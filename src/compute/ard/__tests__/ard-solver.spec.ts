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
import { layerForCoordinate, sliceHasAir } from '../grid-slice';
import { vonNeumannCflLimit } from '../partition';
import { Cell, type VoxelGrid } from '../voxelize';
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

    // The cost figure uses the *clamped* Courant number, and which clamp
    // depends on the boundary. A PML slab holds a 3D room to ~0.446, so asking
    // for 0.5 and reporting 0.5 would show a step count 12% low.
    solver.boundary = 'pml';
    solver.courant = 0.5;
    const atHalf = solver.estimatedSteps;
    solver.courant = 0.446;
    expect(solver.estimatedSteps).toBe(atHalf);
    solver.courant = 0.3;
    expect(solver.estimatedSteps).toBeGreaterThan(atHalf);

    // An impedance boundary's clamp is looser, and the estimate takes it at its
    // worst — 0.5, the α = 1 end — because this getter has no materials to read.
    // So 0.5 is reported as asked and anything above it is held there, where the
    // slab estimate above was already clamped at 0.5.
    solver.boundary = 'impedance';
    solver.courant = 0.5;
    const impedanceAtHalf = solver.estimatedSteps;
    expect(impedanceAtHalf).toBeLessThan(atHalf);
    solver.courant = 0.9;
    expect(solver.estimatedSteps).toBe(impedanceAtHalf);
    solver.courant = 0.3;
    expect(solver.estimatedSteps).toBeGreaterThan(impedanceAtHalf);
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
      (solver.estimatedSimulatedCells * solver.estimatedSteps) /
        ARD_CELL_STEPS_PER_SECOND[solver.boundary],
      9,
    );

    // Longer impulse response, proportionally longer run.
    const short = solver.estimatedSeconds;
    solver.irLength = 1;
    expect(solver.estimatedSeconds / short).toBeCloseTo(2, 1);

    // One full simulation per source, so sources multiply the cost exactly as
    // bands do. `execute` runs `sources.length * bands.length` times, and an
    // estimate that missed the first factor would be silently half right for
    // two sources — the undercount this whole cost line exists to prevent.
    const oneSource = solver.estimatedSeconds;
    solver.sourceIDs = ['s1', 's2'];
    expect(solver.estimatedRuns).toBe(2);
    expect(solver.estimatedSeconds / oneSource).toBeCloseTo(2, 6);
    solver.perBandRuns = true;
    expect(solver.estimatedRuns).toBe(2 * solver.bands.length);
    expect(solver.estimatedSteps).toBe(solver.estimatedStepsPerRun * solver.estimatedRuns);

    // Receivers are probes into a field being computed anyway: free.
    const before = solver.estimatedSeconds;
    solver.receiverIDs = ['r1', 'r2', 'r3'];
    expect(solver.estimatedSeconds).toBe(before);

    // And with no sources configured the estimate is still a run's worth
    // rather than zero.
    solver.sourceIDs = [];
    solver.perBandRuns = false;
    expect(solver.estimatedRuns).toBe(1);

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

  it('leaves progress at a terminal value when a run is cancelled or fails', async () => {
    // `ARD_PROGRESS` is how the UI knows a run is in flight, and anything
    // keyed on "0 < progress < 1" latches on for good if the last event of a
    // failed run is a fraction. The solver card is the sharp case: it disables
    // its Calculate button while calculating, so a stuck state cannot be
    // cleared by starting another run from there.
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 2.6 }, 0.3);
    containers['s1'] = makeSource('s1', [-1, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.5, 0, 0]);

    const progressOf = () =>
      emitted
        .filter((e) => e.event === 'ARD_PROGRESS')
        .map((e) => (e.payload as { progress: number }).progress);

    const solver = new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'], fMax: 400, irLength: 1.5,
    });
    const running = solver.run();
    await new Promise((resolve) => setTimeout(resolve, 0));
    solver.cancel();
    await expect(running).rejects.toThrow(/cancelled/);

    const cancelled = progressOf();
    expect(cancelled.length).toBeGreaterThan(0);
    expect(cancelled.some((p) => p > 0 && p < 1)).toBe(true); // it did report mid-flight
    expect(cancelled[cancelled.length - 1]).toBe(0);
    expect(solver.progress).toBe(0);

    // Same for a run that throws rather than being cancelled.
    emitted.length = 0;
    const doomed = new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'], fMax: 400, irLength: 0.03,
    });
    void doomed.run().catch(() => undefined);
    await new Promise((resolve) => setTimeout(resolve, 0));
    // Break the room out from under it mid-run.
    delete containers['room-1'];
    doomed.cancel();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const last = progressOf();
    if (last.length > 0) expect(last[last.length - 1] % 1).toBe(0); // 0 or 1, never a fraction

    // A successful run ends at 1, not 0 — "finished" and "never ran" are
    // different states even though both read as "not calculating".
    emitted.length = 0;
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 2.6 }, 0.3);
    await new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'], fMax: 250, irLength: 0.03,
    }).run();
    const finished = progressOf();
    expect(finished[finished.length - 1]).toBe(1);
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
    // alpha 0.3, so the surfaces absorb — and by default they do it with an
    // impedance boundary, which adds no stepped cells at all.
    expect(summary.cellCount.boundary).toBeGreaterThan(0);
    expect(summary.cellCount.walls).toBe(0);
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
    // Gate on the peak, not on an absolute floor. The impulse responses are
    // Float32Array, and the arithmetic that fills them accumulates in f32, so
    // a sample five orders of magnitude below the peak is quantization noise
    // whatever the level: at 1.3e-5 of peak the ratio wanders by 1e-4, which
    // says nothing about linearity. An absolute 1e-12 floor admits exactly
    // those samples and passes or fails on where the noise happens to land.
    let peak = 0;
    for (let i = 0; i < a.length; i++) peak = Math.max(peak, Math.abs(a[i]));
    let compared = 0;
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(a[i]) < 1e-4 * peak) continue;
      compared++;
      expect(b[i] / a[i]).toBeCloseTo(10, 3);
    }
    expect(compared).toBeGreaterThan(50);
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
      // Pinned to the slab boundary: the clamp this test is about is the PML's,
      // and an impedance boundary does not have one.
      boundary: 'pml',
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

  it('runs on a plane and says that it is a different room', async () => {
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 3.2 }, 0.3);
    containers['s1'] = makeSource('s1', [-1, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.8, 0, 0.4]);

    const solver = new ARD({
      roomID: 'room-1',
      sourceIDs: ['s1'],
      receiverIDs: ['r1'],
      fMax: 400,
      irLength: 0.04,
      dimensions: 2,
    });
    const summary = await solver.run();

    // Every partition is one cell deep on the collapsed axis — a floor plan
    // collapses world Y, which is the grid's *second* axis, not the third.
    expect(summary.dx).toBeGreaterThan(0);
    expect(summary.impulseResponses.get('s1->r1')!.length).toBeGreaterThan(0);
    expect(summary.airCells).toBeGreaterThan(0);

    // Said in words, because the result looks exactly like a 3D one otherwise.
    const said = summary.warnings.join(' ');
    expect(said).toMatch(/Running in two dimensions on the xz plane/);
    expect(said).toMatch(/not of this room/);
    expect(said).toMatch(/1\/sqrt\(r\)/);

    // And in the result names, which is where someone comparing two tabs
    // actually looks.
    const names = addedResults().map((r) => r.name);
    expect(names).toContain(`IR [2D xz]: s1 → r1`);
    expect(names).toContain(`ARD energy [2D xz]: s1 → r1`);
  }, 300_000);

  it('resolves probes that are nowhere near the cut plane', async () => {
    // The gap the other 2D tests all miss by keeping probes on the plane.
    // `worldToCell` rounds and bounds-checks, so on a grid one cell deep a
    // point more than half a cell off the plane resolves to null and the run
    // dies with "outside the voxel grid" — after the full 3D voxelization, for
    // an ordinary source-height / listener-height difference.
    containers['room-1'] = makeRoom({ x: 6, y: 3, z: 5 }, 0.3);
    containers['s1'] = makeSource('s1', [-1.5, 1.0, 0]);
    // A metre below the source: several cells off the cut at fMax 400.
    containers['low'] = makeReceiver('low', [1.2, 0, 0.5]);
    // And one a hair off, the case that used to fail at 17 cm.
    containers['near'] = makeReceiver('near', [0.6, 0.8, -0.4]);

    const solver = new ARD({
      roomID: 'room-1',
      sourceIDs: ['s1'],
      receiverIDs: ['low', 'near'],
      fMax: 400,
      irLength: 0.03,
      dimensions: 2,
    });
    const summary = await solver.run();

    expect(summary.impulseResponses.get('s1->low')).toBeDefined();
    expect(summary.impulseResponses.get('s1->near')).toBeDefined();
    // Projected onto the cut, not left where they were — and said so, because
    // a metre is far enough that the answer is about somewhere else.
    expect(summary.warnings.join(' ')).toMatch(/projected onto the 2D cut/);
    // The cut sits on the layer nearest the source's height, so the distance
    // is a metre give or take half a cell rather than exactly a metre.
    const moved = /the furthest moved ([0-9.]+) m/.exec(summary.warnings.join(' '));
    expect(moved).not.toBeNull();
    expect(Number(moved![1])).toBeGreaterThan(0.8);
    expect(Number(moved![1])).toBeLessThan(1.2);

    // Every probe landed on the single layer, which is the only place there is.
    for (const cell of [...summary.sourceCells, ...summary.receiverCells]) {
      expect(cell[1]).toBe(0);
    }

    // In 3D the same scene keeps them apart, so the projection is the mode's
    // doing rather than something that always happens.
    emitted.length = 0;
    const threeD = await new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['low', 'near'],
      fMax: 400, irLength: 0.03,
    }).run();
    expect(threeD.receiverCells[0][1]).not.toBe(threeD.receiverCells[1][1]);
    expect(threeD.warnings.join(' ')).not.toMatch(/projected onto the 2D cut/);
  }, 300_000);

  it('survives a fallback plane that moves away from the source', async () => {
    // When the requested height lands in padding the cut falls back to the
    // widest layer, which can be nowhere near the seed source. Without the
    // projection the seed itself then fails to resolve — the shoebox clamp
    // test passes only because its source sits at the centre, which *is* the
    // widest layer.
    containers['room-1'] = makeRoom({ x: 6, y: 4, z: 5 }, 0.3);
    containers['s1'] = makeSource('s1', [-1.5, 1.6, 0]); // well off centre
    containers['r1'] = makeReceiver('r1', [1.2, -1.6, 0.5]);

    const summary = await new ARD({
      roomID: 'room-1',
      sourceIDs: ['s1'],
      receiverIDs: ['r1'],
      fMax: 400,
      irLength: 0.03,
      dimensions: 2,
      sliceCoordinate: 99,
    }).run();

    expect(summary.warnings.join(' ')).toMatch(/contains no room air/);
    expect(summary.impulseResponses.get('s1->r1')).toBeDefined();
    expect(summary.sourceCells[0][1]).toBe(0);
    expect(summary.receiverCells[0][1]).toBe(0);
  }, 300_000);

  it('warns when a requested height is clamped but still in the room', () => {
    // `layerForCoordinate` reports the clamp and the solver used to drop it on
    // the floor, so a plane that moved said nothing unless it moved into
    // padding. Checked on the helper, since producing a clamp-into-air through
    // a real room needs a grid with no padding at all.
    const grid: VoxelGrid = {
      nx: 5, ny: 4, nz: 5, dx: 0.5,
      origin: { x: 0, y: 0, z: 0 },
      cells: new Uint8Array(100).fill(Cell.Air),
      surfaceOf: new Int32Array(100).fill(-1),
      airCount: 100, solidCount: 0, leaked: false, warnings: [],
    };
    expect(layerForCoordinate(grid, 1, 99)).toEqual({ index: 3, clamped: true });
    expect(sliceHasAir(grid, 1, 3)).toBe(true);
  });

  it('gets the level right on a plane, which needs a different law entirely', async () => {
    // The 2D counterpart of the direct-arrival test above, and the one that
    // says the solver actually applies the 2D calibration rather than merely
    // having one. Three properties, and each catches a different mistake:
    //
    //  1. **1/sqrt(r), not 1/r.** A line source spreads 3 dB per doubling, not
    //     6. Getting this wrong is the difference between the two modes.
    //  2. **Flat in frequency.** 2D free field falls as 1/sqrt(f); the
    //     calibration is a +3 dB/octave tilt that takes it out. Without it the
    //     result carries a slope that is spreading, not the room.
    //  3. **The right absolute level.** A scalar borrowed from the 3D path
    //     leaves 1 and 2 intact while being wrong by five orders of magnitude.
    //
    // Distances in cells again: at fMax 500 the grid is 26 cm, so 2 m and 4 m
    // are 7.6 and 15.2 cells out — far enough for the asymptotic Hankel form
    // the calibration is built on (kr well above 2).
    containers['room-1'] = makeRoom({ x: 12, y: 3, z: 8 }, 0.9);
    containers['s1'] = makeSource('s1', [-4, 0, 0], 100);
    containers['near'] = makeReceiver('near', [-2, 0, 0]);
    containers['far'] = makeReceiver('far', [0, 0, 0]);

    const solver = new ARD({
      roomID: 'room-1',
      sourceIDs: ['s1'],
      receiverIDs: ['near', 'far'],
      fMax: 500,
      irLength: 0.05,
      dimensions: 2,
    });
    const summary = await solver.run();
    const sampleRate = solver.sampleRate;

    // The nearest image source is 6 m away against a 2 m direct path, so
    // everything before 14 ms is direct.
    const cut = Math.floor(0.014 * sampleRate);
    const near = before(summary.impulseResponses.get('s1->near')!, cut);
    const far = before(summary.impulseResponses.get('s1->far')!, cut);
    const pressureAtOneMetre = 10 ** (100 / 20) * PREF;

    const level = (ir: Float32Array, hz: number) => spectralMagnitude(ir, sampleRate, hz);

    // Probes well inside the band. 500 Hz is `fMax` itself, where the
    // deconvolver's raised-cosine edge is 0.5 by construction — measuring
    // flatness against it would read the window, not the calibration.
    const probes = [125, 250, 375];
    const mean = (ir: Float32Array) =>
      probes.reduce((total, hz) => total + level(ir, hz), 0) / probes.length;

    // 1. The spreading law. sqrt(2) = 1.414, measured 1.45 — and the bound is
    //    tight enough that the 3D law's 2.0 cannot sit inside it.
    expect(mean(near) / mean(far)).toBeGreaterThan(1.2);
    expect(mean(near) / mean(far)).toBeLessThan(1.7);

    // 2. Flat across a pair of in-band octaves. Uncalibrated, 125 Hz would
    //    read sqrt(3) times 375 Hz; measured 1.007.
    const flatness = level(near, 125) / level(near, 375);
    expect(flatness).toBeGreaterThan(0.75);
    expect(flatness).toBeLessThan(1.35);

    // 3. The absolute level: Lp2P(100 dB) / sqrt(2 m) = 1.414 Pa, measured
    //    1.505. A scalar borrowed from the 3D path is out by 1e8 here, so the
    //    band is wide enough for modal ripple and nowhere near wide enough for
    //    that.
    const expected = pressureAtOneMetre / Math.SQRT2;
    expect(mean(near) / expected).toBeGreaterThan(0.7);
    expect(mean(near) / expected).toBeLessThan(1.5);
  }, 600_000);

  it('cuts the section plane when asked, and clamps a height outside the room', async () => {
    containers['room-1'] = makeRoom({ x: 4, y: 3, z: 3.2 }, 0.3);
    containers['s1'] = makeSource('s1', [-1, 0, 0]);
    containers['r1'] = makeReceiver('r1', [0.8, 0.2, 0]);

    const section = await new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'],
      fMax: 400, irLength: 0.04, dimensions: 2, slice: 'xy',
    }).run();
    expect(section.warnings.join(' ')).toMatch(/on the xy plane/);
    expect(addedResults().map((r) => r.name)).toContain('IR [2D xy]: s1 → r1');

    // A height well above the ceiling is a slider that went too far, not a
    // broken room. Clamping into the grid is not enough on its own: the
    // outermost layers are the padding the wall slabs grow into, so the
    // clamped plane is solid. Fall back to the widest plane, say which one was
    // used, and still produce a result.
    emitted.length = 0;
    const clamped = await new ARD({
      roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'],
      fMax: 400, irLength: 0.04, dimensions: 2, sliceCoordinate: 99,
    }).run();
    expect(clamped.warnings.join(' ')).toMatch(/contains no room air/);
    expect(clamped.warnings.join(' ')).toMatch(/widest plane instead/);
    expect(clamped.impulseResponses.get('s1->r1')).toBeDefined();
    expect(clamped.airCells).toBeGreaterThan(0);
  }, 300_000);

  it('clamps the cost estimate at the rank the mode actually runs at', () => {
    // A sliced plane is rank 2, where the von Neumann bound is 0.575 rather
    // than 0.470. Using the 3D bound for a 2D run over-states the step count —
    // latent at the default Courant 0.4, where neither clamp bites, and real
    // at the plan's original 0.5.
    //
    // This is a property of the PML clamp specifically, because von Neumann
    // stability is what depends on rank. Pinned accordingly.
    containers['room-1'] = makeRoom({ x: 8, y: 4, z: 6 }, 0.3);
    const solver = new ARD({
      roomID: 'room-1', fMax: 500, irLength: 0.5, courant: 0.5, boundary: 'pml',
    });

    const threeD = solver.estimatedStepsPerRun;
    solver.dimensions = 2;
    const twoD = solver.estimatedStepsPerRun;

    // 0.5 is under the 2D bound of 0.546 and over the 3D bound of 0.446, so
    // only the 3D figure is clamped.
    expect(twoD).toBeLessThan(threeD);
    expect(threeD / twoD).toBeCloseTo(0.5 / (PML_CFL_MARGIN * vonNeumannCflLimit(3)), 1);

    // Below both bounds the two agree: the rank only matters where it bites.
    solver.courant = 0.3;
    const twoDSlow = solver.estimatedStepsPerRun;
    solver.dimensions = 3;
    expect(solver.estimatedStepsPerRun).toBe(twoDSlow);
  });

  it('costs the time estimate at the boundary it will actually run', () => {
    // Two constants because the cost per *stepped* cell differs: a slab cell
    // runs an explicit stencil and there are 2-5x as many, while an impedance
    // run keeps only the DCT cells and does face work the cell count does not
    // see. Measured 1.44-2.63 Mcell-steps/s against the slab's 1.31-1.56 — so
    // the impedance path is now the faster one per cell as well as end to end,
    // which it was not before the mixed-radix FFT: a mixed extent used to pay
    // for Bluestein, and that alone put the DCT-bound path below the slab's.
    containers['room-1'] = makeRoom({ x: 5, y: 4, z: 3 }, 0.3);
    const impedance = new ARD({ roomID: 'room-1', fMax: 600, irLength: 0.5 });
    const pml = new ARD({
      roomID: 'room-1', fMax: 600, irLength: 0.5, boundary: 'pml',
    });

    expect(ARD_CELL_STEPS_PER_SECOND.impedance).toBeGreaterThan(
      ARD_CELL_STEPS_PER_SECOND.pml,
    );
    for (const solver of [impedance, pml]) {
      expect(solver.estimatedSeconds).toBeCloseTo(
        (solver.estimatedSimulatedCells * solver.estimatedSteps) /
          ARD_CELL_STEPS_PER_SECOND[solver.boundary],
        9,
      );
    }

    // The slab run is the slower one end to end, which is the claim a user
    // experiences — it steps several times as many cells, and that dominates the
    // lower per-cell rate of the impedance path.
    expect(pml.estimatedSeconds).toBeGreaterThan(2 * impedance.estimatedSeconds);
  });

  it('does not vary the impedance estimate with rank, because the bound does not', () => {
    // The impedance bound is `0.55 - 0.05α`. Nothing in it is a von Neumann
    // symbol, so a 2D run gets no looser time step than a 3D one — and a
    // rank-dependent estimate here would be fiction. The 2D saving is in cells,
    // not in steps, which is where the 2D mode's cost actually comes from.
    containers['room-1'] = makeRoom({ x: 8, y: 4, z: 6 }, 0.3);
    const solver = new ARD({ roomID: 'room-1', fMax: 500, irLength: 0.5, courant: 0.9 });

    const threeD = solver.estimatedStepsPerRun;
    solver.dimensions = 2;
    expect(solver.estimatedStepsPerRun).toBe(threeD);
    // And it is the clamp, not the request, that produced that figure.
    solver.courant = 0.5;
    expect(solver.estimatedStepsPerRun).toBe(threeD);
    solver.courant = 0.45;
    expect(solver.estimatedStepsPerRun).toBeGreaterThan(threeD);
  });

  it('costs far less in two dimensions, and the saving is the cross-section', () => {
    containers['room-1'] = makeRoom({ x: 8, y: 4, z: 6 }, 0.3);
    // Slabs on purpose: `wallThickness` is what the second half measures the
    // slope against, and an impedance boundary has no thickness to vary.
    const solver = new ARD({
      roomID: 'room-1', fMax: 1000, irLength: 0.5, boundary: 'pml',
    });

    const threeD = solver.estimatedSimulatedCells;
    solver.dimensions = 2;
    const twoD = solver.estimatedSimulatedCells;

    // Not a third of the cells — a whole cross-section gone. On this room the
    // ratio is above 20x, which is why 2D is the only mode that reaches 4 kHz.
    expect(threeD / twoD).toBeGreaterThan(10);

    // Floor and ceiling lose their slabs too: there is no outside along a
    // 1-thick axis to absorb into, and `planWalls` skips it for that reason.
    // So fewer faces scale with thickness in 2D than in 3D — measurable as the
    // slope of cells against thickness.
    const slope = (s: ARD) => {
      s.wallThickness = 20;
      const thick = s.estimatedSimulatedCells;
      s.wallThickness = 8;
      const thin = s.estimatedSimulatedCells;
      return (thick - thin) / 12;
    };
    const twoDSlope = slope(solver);
    solver.dimensions = 3;
    const threeDSlope = slope(solver);
    expect(twoDSlope).toBeGreaterThan(0);
    expect(threeDSlope).toBeGreaterThan(5 * twoDSlope);
    solver.dimensions = 2;

    // The section plane costs differently from the floor plan on a room that
    // is not a cube, so the choice is not cosmetic.
    solver.slice = 'xy';
    expect(solver.estimatedSimulatedCells).not.toBe(twoD);
  });

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
      dimensions: 2,
      slice: 'xy',
      sliceCoordinate: 1.2,
    });
    const state = solver.save();
    expect(state.kind).toBe('ard');

    const restored = new ARD({}).restore(state);
    expect(restored.save()).toEqual(state);
    expect(restored.fMax).toBe(1500);
    expect(restored.perBandRuns).toBe(true);
    expect(restored.humidity).toBe(55);
    // A project saved in 2D has to come back in 2D — the results it produced
    // are not comparable with the 3D ones, so silently reverting the mode
    // would change what the solver means without changing anything visible.
    expect(restored.dimensions).toBe(2);
    expect(restored.slice).toBe('xy');
    expect(restored.sliceCoordinate).toBe(1.2);

    // And a project saved before these existed restores as 3D rather than
    // undefined.
    const legacy = new ARD({}).restore({ ...state, dimensions: undefined, slice: undefined });
    expect(legacy.dimensions).toBe(3);
    expect(legacy.slice).toBe('xz');
  });

  it('restores a project saved before impedance boundaries onto the slab path', () => {
    // A new solver gets the better boundary; a *saved* one keeps the physics it
    // was saved with. Taking the constructor's default on restore would change
    // padding 9 -> 1, the cell count, and the reverberation time by about 5x on
    // a 3D room — a migration nobody asked for, performed on load, on results
    // somebody may already have read and reported.
    const modern = new ARD({ roomID: 'room-1' });
    expect(modern.boundary).toBe('impedance');

    const legacy = new ARD({}).restore({
      ...new ARD({ roomID: 'room-1', wallThickness: 12 }).save(),
      boundary: undefined,
    });
    expect(legacy.boundary).toBe('pml');
    // And the padding follows it, which is the observable half: an impedance
    // grid is the voxelizer's own one-cell shell and a slab grid is not.
    expect(legacy.padCells).toBe(13);
    expect(modern.padCells).toBe(1);

    // An explicit choice still round-trips, in both directions.
    for (const boundary of ['impedance', 'pml'] as const) {
      const saved = new ARD({ roomID: 'room-1', boundary }).save();
      expect(saved.boundary).toBe(boundary);
      expect(new ARD({}).restore(saved).boundary).toBe(boundary);
    }
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
