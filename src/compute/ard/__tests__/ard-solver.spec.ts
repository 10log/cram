/**
 * Tests for the ARD solver class (plan Phase 7).
 *
 * The stores, the renderer and the messenger are mocked, following
 * `raytracer.perf.spec.ts`, so this exercises the solver's own sequencing —
 * voxelize, decompose, run, deconvolve, calibrate, resample, emit — against a
 * shoebox whose answers are known analytically.
 *
 * `Worker` is undefined under jsdom, so these take the inline path.
 * `ard.worker.spec.ts` covers the worker's protocol separately.
 */

import { BufferAttribute, BufferGeometry, Vector3 } from 'three';

import { nextPowerOfTwo } from '../deconvolve';
import { createComplexFftPlan } from '../fft';
import { ARD, ARD_CELL_STEPS_PER_SECOND, ARD_REFERENCE_FREQUENCY } from '../index';
import { vonNeumannCflLimit } from '../partition';
import { PML_CFL_MARGIN } from '../pml-partition';

// `vi.mock` factories are hoisted above module initialization, so anything they
// close over has to be hoisted with them.
const mocks = vi.hoisted(() => ({
  emitted: [] as { event: string; payload: unknown }[],
  containers: {} as Record<string, unknown>,
  solvers: {} as Record<string, unknown>,
  results: {} as Record<string, unknown>,
}));
const { emitted, containers, results } = mocks;

vi.mock('../../../render/renderer', () => ({
  renderer: { add: vi.fn(), remove: vi.fn(), requestRender: vi.fn() },
}));

vi.mock('../../../messenger', () => ({
  emit: (event: string, payload: unknown) => {
    mocks.emitted.push({ event, payload });
  },
  on: vi.fn(),
  messenger: { on: vi.fn(), emit: vi.fn() },
}));

vi.mock('../../../store', () => ({
  useContainer: {
    getState: () => ({
      containers: mocks.containers,
      getRooms: () =>
        Object.values(mocks.containers).filter((c: any) => c.kind === 'room'),
    }),
  },
  useSolver: { getState: () => ({ solvers: mocks.solvers }) },
  useResult: { getState: () => ({ results: mocks.results }) },
  addSolver: vi.fn(),
  removeSolver: vi.fn(),
  setSolverProperty: vi.fn(),
  callSolverMethod: vi.fn(),
}));

const PREF = 2e-5;
/** `soundSpeed(20)`, the temperature every fake room here reports. */
const SOUND_SPEED_20C = 20.05 * Math.sqrt(20 + 273.15);

/** A shoebox room whose surfaces all carry the same absorption. */
function makeRoom(
  size: { x: number; y: number; z: number },
  alpha: number | ((frequency: number) => number),
) {
  const alphaAt = typeof alpha === 'function' ? alpha : () => alpha;
  const half = { x: size.x / 2, y: size.y / 2, z: size.z / 2 };
  const surfaces = faceQuads(half).map((quad, index) => ({
    uuid: `surface-${index}`,
    kind: 'surface',
    geometry: quadGeometry(quad),
    absorptionFunction: alphaAt,
    // The quads are already in world coordinates, so the transform is the
    // identity — but `roomTriangles` calls it, and a fake that omits it fails
    // in a way that looks like a voxelizer bug.
    localToWorld: (v: Vector3) => v,
  }));

  return {
    uuid: 'room-1',
    kind: 'room',
    name: 'shoebox',
    temperature: 20,
    humidity: 40,
    allSurfaces: surfaces,
    boundingBox: {
      getSize: (target: Vector3) => target.set(size.x, size.y, size.z),
    },
  };
}

/** Six faces of a box centred on the origin, each as two triangles. */
function faceQuads(half: { x: number; y: number; z: number }): number[][] {
  const { x, y, z } = half;
  const corners = (a: number[], b: number[], c: number[], d: number[]) => [
    ...a, ...b, ...c,
    ...a, ...c, ...d,
  ];
  return [
    corners([-x, -y, -z], [-x, y, -z], [-x, y, z], [-x, -y, z]),
    corners([x, -y, -z], [x, -y, z], [x, y, z], [x, y, -z]),
    corners([-x, -y, -z], [-x, -y, z], [x, -y, z], [x, -y, -z]),
    corners([-x, y, -z], [x, y, -z], [x, y, z], [-x, y, z]),
    corners([-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z]),
    corners([-x, -y, z], [-x, y, z], [x, y, z], [x, -y, z]),
  ];
}

function quadGeometry(positions: number[]): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  return geometry;
}

function makeSource(uuid: string, at: [number, number, number], initialSPL = 100) {
  return {
    uuid,
    kind: 'source',
    name: uuid,
    initialSPL,
    getWorldPosition: (target: Vector3) => target.set(...at),
  };
}

function makeReceiver(uuid: string, at: [number, number, number]) {
  return {
    uuid,
    kind: 'receiver',
    name: uuid,
    getWorldPosition: (target: Vector3) => target.set(...at),
  };
}

function reset() {
  emitted.length = 0;
  for (const key of Object.keys(containers)) delete containers[key];
  for (const key of Object.keys(results)) delete results[key];
}

function addedResults() {
  return emitted.filter((e) => e.event === 'ADD_RESULT').map((e) => e.payload as any);
}

/**
 * Magnitude of the impulse response's spectrum at `hz`.
 *
 * This is the quantity the solver's calibration is defined on: an arrival's
 * sum is its pressure, so a flat-spectrum arrival reads its pressure here. It
 * is also independent of the sample rate the result happens to be written at,
 * unlike the waveform peak.
 */
function spectralMagnitude(ir: Float32Array, sampleRate: number, hz: number): number {
  const n = nextPowerOfTwo(ir.length);
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  re.set(ir.subarray(0, Math.min(ir.length, n)));
  createComplexFftPlan(n).forward(re, im);
  const k = Math.round((hz * n) / sampleRate);
  return Math.hypot(re[k], im[k]);
}

/** A copy with everything from `cut` onward zeroed, keeping the length. */
function before(signal: Float32Array, cut: number): Float32Array {
  const out = new Float32Array(signal.length);
  out.set(signal.subarray(0, Math.min(cut, signal.length)));
  return out;
}

describe('ARD solver', () => {
  beforeEach(reset);

  it('reports what a run would cost before running it', () => {
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 2.5 }, 0.2);
    const solver = new ARD({ fMax: 500, irLength: 0.3 });

    expect(solver.cellSize).toBeCloseTo(SOUND_SPEED_20C / (2.6 * 500), 9);
    expect(solver.estimatedCellCount).toBeGreaterThan(0);
    expect(solver.estimatedSteps).toBeGreaterThan(0);

    // fMax is the cost dial: cells go as fMax^3 and steps as fMax, so the run
    // is asymptotically O(fMax^4). It only reaches that asymptote once the
    // grid is fine enough — the wall slabs' padding is a fixed *cell* count
    // per axis, so on a coarse grid it is most of the grid. Measured on this
    // 4 x 3 x 2.5 m room at the default 8-cell slabs: 5.2x for 500 -> 1000 Hz,
    // 8.4x for 1000 -> 2000. Worth knowing before quoting fMax^4 at a user
    // who is about to double 500 Hz.
    const cost = () => solver.estimatedCellCount * solver.estimatedSteps;
    const at500 = cost();
    solver.fMax = 1000;
    const at1000 = cost();
    solver.fMax = 2000;
    const at2000 = cost();

    expect(at1000 / at500).toBeGreaterThan(4);
    expect(at1000 / at500).toBeLessThan(16);
    // Steeper the second time, as the fixed padding stops dominating.
    expect(at2000 / at1000).toBeGreaterThan(at1000 / at500);
    expect(at2000 / at1000).toBeLessThan(16);

    solver.fMax = 1000;

    // Per-band runs cost one run per octave band that the grid can carry.
    // At fMax 1000 that is 125 Hz through 1 kHz — 2 kHz has its lower edge at
    // 1414 Hz, past what the grid represents, so paying for it would buy a
    // full simulation whose every sample the deconvolver then zeroes.
    const single = solver.estimatedSteps;
    solver.perBandRuns = true;
    expect(solver.bands).toEqual([125, 250, 500, 1000]);
    expect(solver.estimatedSteps).toBe(single * 4);

    solver.fMax = 250;
    expect(solver.bands).toEqual([125, 250]);
    // A single broadband run reads absorption at 500 Hz, but never above fMax.
    solver.perBandRuns = false;
    expect(solver.referenceFrequency).toBe(250);
    solver.fMax = 1000;
    expect(solver.referenceFrequency).toBe(500);

    // The cost figure uses the *clamped* Courant number. Wall slabs are PML
    // partitions and every partition shares a time step, so on a 3D room the
    // clamp is ~0.446 — asking for 0.5 and reporting 0.5 would show a step
    // count 12% low every time walls exist, which is the default.
    solver.courant = 0.5;
    const atHalf = solver.estimatedSteps;
    solver.courant = 0.446;
    expect(solver.estimatedSteps).toBe(atHalf);
    solver.courant = 0.3;
    expect(solver.estimatedSteps).toBeGreaterThan(atHalf);
    solver.courant = 0.4;
  });

  it('predicts the cells a shoebox will actually step', async () => {
    // `estimatedSimulatedCells` is what the runtime estimate rides on, so it
    // has to be the cells that get stepped — not the grid allocation, most of
    // which is padding for the slabs to grow into.
    //
    // This room is deliberately coarse: at fMax 250 the grid is 53 cm and the
    // air region is 5 x 4 x 3 cells, so the shell is most of the bounding box.
    // Counting in metres over dx cubed over-predicted by 64% here; counting
    // interior extents in cells gets both terms exact.
    containers['room-1'] = makeRoom({ x: 3.2, y: 2.6, z: 2.2 }, 0.35);
    containers['s1'] = makeSource('s1', [-0.8, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.6, 0.3, 0]);

    const solver = new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'],
      fMax: 250, irLength: 0.03,
    });
    const predicted = solver.estimatedSimulatedCells;
    const summary = await solver.run();
    const actual = summary.cellCount.room + summary.cellCount.walls;

    // Within 20%: the voxelizer rounds the room onto the grid and a face's
    // slab is clipped to its own extent, so neither term stays exact on an
    // arbitrary room — but it is the right quantity, unlike the allocation.
    expect(predicted / actual).toBeGreaterThan(0.8);
    expect(predicted / actual).toBeLessThan(1.2);

    // And the allocation is much larger, which is the reason the two are
    // separate getters rather than one.
    expect(solver.estimatedCellCount).toBeGreaterThan(1.5 * actual);
    expect(solver.estimatedCellCount).toBe(
      solver.estimatedGrid.x * solver.estimatedGrid.y * solver.estimatedGrid.z,
    );
  }, 300_000);

  it('estimates a runtime that tracks the work', () => {
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 2.5 }, 0.2);
    const solver = new ARD({ roomID: 'room-1', fMax: 500, irLength: 0.5 });

    expect(solver.estimatedSeconds).toBeGreaterThan(0);
    expect(solver.estimatedSeconds).toBeCloseTo(
      (solver.estimatedSimulatedCells * solver.estimatedSteps) / ARD_CELL_STEPS_PER_SECOND,
      9,
    );

    // Longer impulse response, proportionally longer run.
    const short = solver.estimatedSeconds;
    solver.irLength = 1;
    expect(solver.estimatedSeconds / short).toBeCloseTo(2, 1);

    // A room with no geometry estimates nothing rather than NaN or Infinity.
    solver.roomID = 'nope';
    expect(solver.estimatedSeconds).toBe(0);
    expect(solver.estimatedSimulatedCells).toBe(0);
    expect(solver.estimatedGrid).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('drives the app-wide progress indicator', async () => {
    // A wave solve runs long enough that no indicator reads as a hang, so the
    // solver drives the same SHOW/UPDATE/HIDE the ray tracer does rather than
    // relying on a panel to subscribe to ARD_PROGRESS.
    containers['room-1'] = makeRoom({ x: 3.2, y: 2.6, z: 2.2 }, 0.35);
    containers['s1'] = makeSource('s1', [-0.8, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.6, 0.3, 0]);

    const solver = new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'],
      fMax: 250, irLength: 0.03,
    });
    await solver.run();

    const events = emitted.map((e) => e.event);
    expect(events).toContain('SHOW_PROGRESS');
    expect(events).toContain('UPDATE_PROGRESS');
    expect(events).toContain('HIDE_PROGRESS');
    expect(events.lastIndexOf('HIDE_PROGRESS')).toBeGreaterThan(events.indexOf('SHOW_PROGRESS'));

    // Hidden even when the run fails, or the indicator sticks on screen.
    emitted.length = 0;
    await expect(
      new ARD({ roomID: 'nope', sourceIDs: ['s1'], receiverIDs: ['r1'] }).run(),
    ).rejects.toThrow();
    expect(emitted.map((e) => e.event)).toContain('HIDE_PROGRESS');
  }, 300_000);

  it('refuses to run without a room, a source or a receiver', async () => {
    const solver = new ARD({});
    await expect(solver.run()).rejects.toThrow(/no room/);

    containers['room-1'] = makeRoom({ x: 3, y: 2.4, z: 2 }, 0.2);
    const withRoom = new ARD({ roomID: 'room-1' });
    await expect(withRoom.run()).rejects.toThrow(/at least one source and one receiver/);
  });

  it('rejects a source placed outside the room', async () => {
    containers['room-1'] = makeRoom({ x: 3, y: 2.4, z: 2 }, 0.2);
    containers['s1'] = makeSource('s1', [40, 40, 40]);
    containers['r1'] = makeReceiver('r1', [0.5, 0, 0]);
    const solver = new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'], fMax: 400, irLength: 0.05,
    });
    // The flood fill is seeded from the first source, so a source outside the
    // room leaks straight to the rim rather than producing a silently wrong
    // air region.
    await expect(solver.run()).rejects.toThrow(/does not enclose a volume|not in this room/);
  });

  it('runs a shoebox end to end and emits a result pair per source-receiver', async () => {
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 2.6 }, 0.3);
    containers['s1'] = makeSource('s1', [-1, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.4, 0.2, 0]);
    containers['r2'] = makeReceiver('r2', [1.2, -0.3, 0.2]);

    const solver = new ARD({
      roomID: 'room-1',
      sourceIDs: ['s1'],
      receiverIDs: ['r1', 'r2'],
      fMax: 300,
      irLength: 0.08,
    });

    const summary = await solver.run();

    expect(summary.runs).toBe(1);
    expect(summary.boxCount).toBeGreaterThan(0);
    expect(summary.airCells).toBeGreaterThan(0);
    expect(summary.cellCount.walls).toBeGreaterThan(0); // alpha 0.3, so slabs exist
    expect(summary.courant).toBeLessThanOrEqual(0.4);
    expect(summary.dt).toBeCloseTo((summary.courant * summary.dx) / SOUND_SPEED_20C, 12);
    expect(summary.impulseResponses.size).toBe(2);

    const added = addedResults();
    expect(added.map((r) => r.uuid).sort()).toEqual(
      [
        `${solver.uuid}-ard-edc-s1-r1`,
        `${solver.uuid}-ard-edc-s1-r2`,
        `${solver.uuid}-ard-ir-s1-r1`,
        `${solver.uuid}-ard-ir-s1-r2`,
      ].sort(),
    );

    const ir = added.find((r) => r.uuid === `${solver.uuid}-ard-ir-s1-r1`);
    expect(ir.kind).toBe('impulseResponse');
    expect(ir.info.sampleRate).toBe(44100);
    expect(ir.info.sourceId).toBe('s1');
    expect(ir.data.length).toBeGreaterThan(1);
    expect(ir.data.length).toBeLessThanOrEqual(2000);

    const full = summary.impulseResponses.get('s1->r1')!;
    expect(full.length).toBe(Math.round(summary.steps * (44100 * summary.dt)));
    expect(solver.progress).toBe(1);
    expect(solver.noResults).toBe(false);
    expect(emitted.some((e) => e.event === 'ARD_PROGRESS')).toBe(true);
  }, 300_000);

  it('puts the direct arrival at the right time and level', async () => {
    // Big, heavily absorbing room so the direct sound is clear of reflections,
    // and two distances so the level check is a spreading law rather than a
    // single number that could be anything.
    // Distances chosen in *cells*, not metres. `freeFieldGain` is a continuum
    // expression and the source occupies a whole cell, so it means nothing
    // within a couple of cells of the source: at fMax 250 (dx = 0.53 m) a
    // receiver 1 m away is under two cells out and reads 38% low. Here
    // dx = 0.26 m, so the two receivers are 7.6 and 15.2 cells out.
    containers['room-1'] = makeRoom({ x: 12, y: 8, z: 5 }, 0.9);
    containers['s1'] = makeSource('s1', [-4, 0, 0], 100);
    containers['near'] = makeReceiver('near', [-2, 0, 0]);
    containers['far'] = makeReceiver('far', [0, 0, 0]);

    const solver = new ARD({
      roomID: 'room-1',
      sourceIDs: ['s1'],
      receiverIDs: ['near', 'far'],
      fMax: 500,
      irLength: 0.05,
    });
    const summary = await solver.run();
    const sampleRate = solver.sampleRate;

    const near = summary.impulseResponses.get('s1->near')!;
    const far = summary.impulseResponses.get('s1->far')!;

    // Arrival time. The cells the source and receiver land in are rounded to
    // the grid, so the tolerance is a cell either way.
    const cellSeconds = summary.dx / SOUND_SPEED_20C;
    for (const [ir, distance] of [[near, 2], [far, 4]] as const) {
      let peak = 0;
      let index = 0;
      for (let i = 0; i < ir.length; i++) {
        if (Math.abs(ir[i]) > peak) {
          peak = Math.abs(ir[i]);
          index = i;
        }
      }
      const expected = (distance / SOUND_SPEED_20C) * sampleRate;
      expect(Math.abs(index - expected)).toBeLessThan(2 * cellSeconds * sampleRate);
    }

    // Level. An arrival's spectrum is its pressure, so the direct sound at r
    // metres reads Lp2P(initialSPL)/r — 2 Pa at 1 m for 100 dB, so 1 Pa and
    // 0.5 Pa at the two receivers.
    //
    // Measure the direct arrival alone. The spectrum of the whole record is
    // the room's transfer function, modal structure and all, and a spreading
    // law read off that gives whatever the modes happen to be doing at the
    // probe frequency — measured 5.0 rather than 2 on this room. The nearest
    // image source is 5.4 m away against a 2 m direct path, so everything
    // before 14 ms is direct.
    const pressureAtOneMetre = 10 ** (100 / 20) * PREF;
    const directCut = Math.floor(0.014 * sampleRate);
    const levels = [near, far].map((ir) =>
      spectralMagnitude(before(ir, directCut), sampleRate, ARD_REFERENCE_FREQUENCY / 2),
    );

    // Measured 1.059 and 0.530 Pa against 1.000 and 0.500: a common +6%, and a
    // ratio of 1.998 against 2. Two things contribute and neither is a
    // calibration error. The free-field constant itself scatters by ~2.5%
    // (deconvolve.spec.ts), and probes snap to cells — at dx = 26 cm each
    // lands up to 13 cm from where it was put, which here is the 7.575-cell
    // true distance becoming a 7-cell grid distance, worth +8% on its own. The
    // bands below are wide enough to hold both and far too tight to hold a
    // mistaken constant.
    for (let n = 0; n < levels.length; n++) {
      const expected = pressureAtOneMetre / [2, 4][n];
      expect(levels[n] / expected).toBeGreaterThan(0.85);
      expect(levels[n] / expected).toBeLessThan(1.15);
    }
    // The spreading law between them, which no constant could fake: both
    // receivers snap the same way, so the ratio is clean where the absolute
    // level is not.
    expect(levels[0] / levels[1]).toBeGreaterThan(1.85);
    expect(levels[0] / levels[1]).toBeLessThan(2.15);
  }, 300_000);

  it('scales the result with the source level', async () => {
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 2.6 }, 0.4);
    containers['s1'] = makeSource('s1', [-1, 0, 0], 94);
    containers['r1'] = makeReceiver('r1', [0.5, 0, 0]);

    const quiet = await new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'], fMax: 250, irLength: 0.04,
    }).run();

    (containers['s1'] as { initialSPL: number }).initialSPL = 114; // +20 dB
    const loud = await new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'], fMax: 250, irLength: 0.04,
    }).run();

    const a = quiet.impulseResponses.get('s1->r1')!;
    const b = loud.impulseResponses.get('s1->r1')!;
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(a[i]) > 1e-12) expect(b[i] / a[i]).toBeCloseTo(10, 3);
    }
  }, 300_000);

  it('gives the same answer per band as broadband when absorption is flat', async () => {
    // The band windows sum to one, so a room whose materials do not vary with
    // frequency has to come out the same either way. If it does not, the
    // per-band path is changing the broadband level as a side effect of asking
    // for more accuracy.
    containers['room-1'] = makeRoom({ x: 3.2, y: 2.6, z: 2.2 }, 0.35);
    containers['s1'] = makeSource('s1', [-0.8, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.6, 0.3, 0]);

    const base = {
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'],
      fMax: 250, irLength: 0.04,
    };
    const broadband = await new ARD(base).run();
    const perBand = await new ARD({ ...base, perBandRuns: true }).run();

    expect(perBand.runs).toBe(2); // fMax 250 keeps only the 125 and 250 Hz bands
    const a = broadband.impulseResponses.get('s1->r1')!;
    const b = perBand.impulseResponses.get('s1->r1')!;
    expect(b.length).toBe(a.length);

    let error = 0;
    let energy = 0;
    for (let i = 0; i < a.length; i++) {
      error += (b[i] - a[i]) ** 2;
      energy += a[i] ** 2;
    }
    expect(Math.sqrt(error / energy)).toBeLessThan(0.02);
  }, 600_000);

  it('refuses a second run while one is in flight', async () => {
    // Interleaving two runs would clear `cancelled` under the first, share the
    // worker and the progress counter, and on the inline path put two time
    // loops into overlapping buffers. Phase 6's worker refuses a second
    // `start` for the same reasons.
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 2.6 }, 0.3);
    containers['s1'] = makeSource('s1', [-1, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.5, 0, 0]);
    const solver = new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'], fMax: 300, irLength: 0.6,
    });

    const first = solver.run();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(solver.running).toBe(true);
    await expect(solver.run()).rejects.toThrow(/already in progress/);

    // And the refusal did not disturb the first run: a cancel still lands.
    solver.cancel();
    await expect(first).rejects.toThrow(/cancelled/);
    expect(solver.running).toBe(false);

    // Once it has stopped, a new run is allowed again.
    const summary = await new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'], fMax: 250, irLength: 0.03,
    }).run();
    expect(summary.runs).toBe(1);
  }, 300_000);

  it('moves a probe that lands on a wall cell into the room, and says so', async () => {
    // A receiver flush against a surface rounds onto the one-cell shell and is
    // Solid. Left alone the run dies with "inside a wall" only after
    // voxelizing, decomposing and planning walls — and only for receivers,
    // since the first source doubles as the flood-fill seed and already
    // relocates.
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 2.6 }, 0.3);
    containers['s1'] = makeSource('s1', [0, 0, 0]);
    containers['flush'] = makeReceiver('flush', [2, 0, 0]); // exactly on the +x wall
    containers['inside'] = makeReceiver('inside', [0.5, 0, 0]);

    const solver = new ARD({
      roomID: 'room-1',
      sourceIDs: ['s1'],
      receiverIDs: ['flush', 'inside'],
      fMax: 300,
      irLength: 0.03,
    });
    const summary = await solver.run();

    // It ran, and the relocated probe reports the cell it actually used.
    expect(summary.receiverCells).toHaveLength(2);
    expect(summary.warnings.join(' ')).toMatch(/landed on a wall cell and was moved/);
    expect(summary.impulseResponses.get('s1->flush')).toBeDefined();

    // The flush receiver moved; the one well inside did not.
    const [flushCell, insideCell] = summary.receiverCells;
    expect(flushCell).not.toEqual(insideCell);

    // A probe genuinely outside the room is still an error, not a relocation.
    containers['far'] = makeReceiver('far', [40, 40, 40]);
    await expect(
      new ARD({
        roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['far'], fMax: 300, irLength: 0.03,
      }).run(),
    ).rejects.toThrow(/outside the voxel grid|inside a wall/);
  }, 300_000);

  it('uses one time step and one pulse for every band', async () => {
    // Each band has its own absorption, and a band whose materials are all
    // rigid builds no PML slabs — which lifts the CFL clamp and would give
    // that band a larger dt and a shorter record than its neighbours, while
    // every band is deconvolved against one pulse at one rate. Planning from
    // the union of faces and forcing the resolved Courant number on each run
    // is what keeps them in step.
    //
    // Courant 0.5 on purpose: at the class default of 0.4 the clamp never
    // bites and this cannot fail.
    containers['room-1'] = makeRoom({ x: 3.2, y: 2.6, z: 2.2 }, 0.35);
    containers['s1'] = makeSource('s1', [-0.8, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.6, 0.3, 0]);

    // The 125 Hz band absorbs, the 250 Hz band is perfectly rigid. A rigid
    // band builds no PML slabs, so planning per band would leave it at the
    // requested 0.5 while its neighbour is clamped to 0.446 — two different
    // record lengths fed to one deconvolution against one pulse.
    containers['room-1'] = makeRoom({ x: 3.2, y: 2.6, z: 2.2 }, (frequency) =>
      frequency < 200 ? 0.5 : 0,
    );

    const solver = new ARD({
      roomID: 'room-1',
      sourceIDs: ['s1'],
      receiverIDs: ['r1'],
      fMax: 250,
      irLength: 0.03,
      courant: 0.5,
      perBandRuns: true,
    });
    const summary = await solver.run();

    expect(summary.runs).toBe(2);
    // Clamped, because the room has absorbing walls.
    expect(summary.courant).toBeLessThan(0.5);
    expect(summary.courant).toBeCloseTo(PML_CFL_MARGIN * vonNeumannCflLimit(3), 10);
    expect(summary.dt).toBeCloseTo((summary.courant * summary.dx) / SOUND_SPEED_20C, 12);
    // One record length for every band: the IR is `steps` long at the
    // simulation rate, resampled once. A band that ran at a different `dt`
    // would come back short, and summing it into the combined record reads
    // past its end.
    const ir = summary.impulseResponses.get('s1->r1')!;
    expect(ir.length).toBe(Math.round(summary.steps * (44100 * summary.dt)));
    expect(ir.every((sample) => Number.isFinite(sample))).toBe(true);
    let energy = 0;
    for (const sample of ir) energy += sample * sample;
    expect(energy).toBeGreaterThan(0);
  }, 300_000);

  it('keeps the low octave bands at full weight on a 1 kHz grid', async () => {
    // The per-band path filters twice — the deconvolver's own [fMin, fMax]
    // window and then the octave window — so it is worth checking that the
    // lowest band survives at a real fMax rather than only at the 250 Hz the
    // agreement test uses. Measured directly: at fMax 1000 the deconvolver's
    // window is 1.000 from 39 Hz up, and the Wiener term costs 2.3% at 125 Hz
    // — applied identically on the broadband path, so neither is a per-band
    // penalty.
    containers['room-1'] = makeRoom({ x: 3.2, y: 2.6, z: 2.2 }, 0.35);
    containers['s1'] = makeSource('s1', [-0.8, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.6, 0.3, 0]);

    const base = {
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'],
      fMax: 1000, irLength: 0.03,
    };
    const broadband = await new ARD(base).run();
    const perBand = await new ARD({ ...base, perBandRuns: true }).run();
    expect(perBand.runs).toBe(4); // 125, 250, 500, 1000

    const a = broadband.impulseResponses.get('s1->r1')!;
    const b = perBand.impulseResponses.get('s1->r1')!;
    const rate = 44100;
    for (const hz of [125, 250, 500]) {
      const ratio =
        spectralMagnitude(b, rate, hz) / spectralMagnitude(a, rate, hz);
      expect(ratio).toBeGreaterThan(0.9);
      expect(ratio).toBeLessThan(1.1);
    }
  }, 900_000);

  it('saves and restores every property', () => {
    containers['room-1'] = makeRoom({ x: 3, y: 2.4, z: 2 }, 0.2);
    const solver = new ARD({
      roomID: 'room-1',
      sourceIDs: ['s1', 's2'],
      receiverIDs: ['r1'],
      fMax: 1500,
      cellsPerWavelength: 3.4,
      courant: 0.35,
      irLength: 2.5,
      wallThickness: 12,
      perBandRuns: true,
      sampleRate: 48000,
      humidity: 55,
    });
    const state = solver.save();
    expect(state.kind).toBe('ard');

    const restored = new ARD({}).restore(state);
    expect(restored.save()).toEqual(state);
    expect(restored.fMax).toBe(1500);
    expect(restored.perBandRuns).toBe(true);
    expect(restored.humidity).toBe(55);
  });

  it('stops a run when cancelled', async () => {
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 2.6 }, 0.3);
    containers['s1'] = makeSource('s1', [-1, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.5, 0, 0]);
    const solver = new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'], fMax: 400, irLength: 1.5,
    });

    const running = solver.run();
    // The inline loop yields between chunks, so a cancel from here lands.
    await new Promise((resolve) => setTimeout(resolve, 0));
    solver.cancel();

    await expect(running).rejects.toThrow(/cancelled/);
    expect(solver.running).toBe(false);
  }, 300_000);
});
