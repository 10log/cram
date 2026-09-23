/**
 * Tests for the ARD simulation driver (plan Phase 6).
 *
 * The three the plan names are the physics checks — arrival time and 1/r
 * spreading, energy not growing once the source stops, and a rigid box's mode
 * frequencies matching the analytic shoebox series. Those are what say the
 * assembled pipeline computes acoustics rather than merely running.
 */

import { bandlimitedPulse, createArdSimulation } from '../simulation';
import { decompose } from '../decompose';
import { createComplexFftPlan } from '../fft';
import { impedanceCourantLimit } from '../impedance';
import { spatialRank, vonNeumannCflLimit } from '../partition';
import { PML_CFL_MARGIN } from '../pml-partition';
import { Cell, type VoxelGrid } from '../voxelize';

const C = 343;

/**
 * An air box of the given size, wrapped in a one-cell shell and then `pad`
 * cells of empty solid.
 *
 * The padding is not decoration: a wall slab grows outward from a room face
 * into solid cells, so without room behind the shell every face is dropped and
 * the room comes out perfectly rigid. Real grids need
 * `padCells >= wallThickness + 1` from the voxelizer for the same reason.
 */
function shoeboxGrid(
  airX: number,
  airY: number,
  airZ: number,
  dx: number,
  pad = 0,
): VoxelGrid {
  const margin = 1 + pad;
  const nx = airX + 2 * margin;
  const ny = airY + 2 * margin;
  const nz = airZ + 2 * margin;
  const cells = new Uint8Array(nx * ny * nz);
  const surfaceOf = new Int32Array(nx * ny * nz).fill(-1);
  let airCount = 0;

  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const idx = i + nx * (j + ny * k);
        const inAir =
          i >= margin && i < margin + airX &&
          j >= margin && j < margin + airY &&
          k >= margin && k < margin + airZ;
        if (inAir) {
          cells[idx] = Cell.Air;
          airCount++;
          continue;
        }
        // The shell is the single layer touching the air; one surface index
        // per face, as a real voxelization would record. Padding beyond it
        // carries no surface.
        const onShell =
          i >= margin - 1 && i <= margin + airX &&
          j >= margin - 1 && j <= margin + airY &&
          k >= margin - 1 && k <= margin + airZ;
        if (onShell) {
          surfaceOf[idx] =
            i === margin - 1 ? 0
              : i === margin + airX ? 1
                : j === margin - 1 ? 2
                  : j === margin + airY ? 3
                    : k === margin - 1 ? 4
                      : 5;
        }
      }
    }
  }

  return {
    nx, ny, nz, dx,
    origin: { x: 0, y: 0, z: 0 },
    cells,
    surfaceOf,
    airCount,
    solidCount: nx * ny * nz - airCount,
    leaked: false,
    warnings: [],
  };
}

/** Where the air region starts, for placing sources and receivers. */
function airOrigin(pad = 0): number {
  return 1 + pad;
}

function peakOf(signal: Float32Array, from = 0, to = -1): { index: number; value: number } {
  const end = to < 0 ? signal.length : to;
  let index = from;
  let value = 0;
  for (let i = from; i < end; i++) {
    const magnitude = Math.abs(signal[i]);
    if (magnitude > value) {
      value = magnitude;
      index = i;
    }
  }
  return { index, value };
}

describe('createArdSimulation', () => {
  it('builds partitions, interfaces and walls from a decomposed grid', () => {
    const pad = 9; // room for the default 8-cell slabs
    const o = airOrigin(pad);
    const grid = shoeboxGrid(20, 16, 12, 0.1, pad);
    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      sources: [{ cell: [o + 10, o + 8, o + 6], signal: new Float32Array(4) }],
      receivers: [{ cell: [o + 4, o + 3, o + 2] }],
      steps: 4,
      boundary: 'pml',
      absorptionFor: () => 0.3,
    });

    expect(sim.partitions.length).toBeGreaterThan(1); // room plus wall slabs
    expect(sim.wallPlan.faces.length).toBeGreaterThan(0);
    expect(sim.interfaces.length).toBeGreaterThan(0); // walls are coupled in
    expect(sim.cellCount.room).toBeGreaterThan(0);
    expect(sim.cellCount.walls).toBeGreaterThan(0);
    sim.dispose();
  });

  it('refuses to run when an under-padded grid leaves no room for wall slabs', () => {
    // The default `padCells: 1` from the voxelizer leaves only the one-cell
    // shell behind each face, which is below the minimum a slab needs. Every
    // face is then rigid and the result carries no absorption at all. A warning
    // is not enough: the run completes, produces a reverberation time set by
    // nothing but the room's volume, and looks entirely healthy.
    const grid = shoeboxGrid(20, 16, 12, 0.1, 0);
    expect(() =>
      createArdSimulation({
        grid,
        decomposition: decompose(grid),
        c: C,
        sources: [{ cell: [11, 9, 7], signal: new Float32Array(2) }],
        receivers: [],
        steps: 2,
        boundary: 'pml',
        absorptionFor: () => 0.5,
      }),
    ).toThrow(/padCells >= 9/);
  });

  it('builds no slab for a face whose material absorbs nothing', () => {
    // A PML at alpha = 0 is acoustically the same as a rigid face, but it costs
    // its cells and it drags the whole simulation onto the PML's CFL limit. The
    // requested Courant surviving is the observable half of that: the room is
    // pure DCT, so nothing constrains it.
    const pad = 9;
    const o = airOrigin(pad);
    const grid = shoeboxGrid(16, 14, 12, 0.1, pad);
    const decomposition = decompose(grid);
    const requested = 0.6; // above the PML limit of ~0.446 for a rank-3 slab

    const rigid = createArdSimulation({
      grid,
      decomposition,
      c: C,
      courant: requested,
      sources: [{ cell: [o + 8, o + 7, o + 6], signal: new Float32Array(2) }],
      receivers: [],
      steps: 2,
      boundary: 'pml',
      absorptionFor: () => 0,
    });

    expect(rigid.wallPlan.faces).toHaveLength(0);
    expect(rigid.wallPlan.skippedRigid).toBe(6);
    expect(rigid.wallPlan.droppedForSpace).toBe(0);
    expect(rigid.cellCount.walls).toBe(0);
    expect(rigid.courant).toBe(requested);
    expect(rigid.warnings.join(' ')).toMatch(/absorb nothing/);
    rigid.dispose();

    // The same room with a real material does get slabs, and does pay the CFL
    // price — so the difference above is the absorption coefficient, not the
    // geometry.
    const absorbing = createArdSimulation({
      grid,
      decomposition,
      c: C,
      courant: requested,
      sources: [{ cell: [o + 8, o + 7, o + 6], signal: new Float32Array(2) }],
      receivers: [],
      steps: 2,
      boundary: 'pml',
      absorptionFor: () => 0.3,
    });
    expect(absorbing.wallPlan.faces).toHaveLength(6);
    expect(absorbing.courant).toBeLessThan(requested);
    absorbing.dispose();
  });

  it('lets the wall slabs set the time step, not the room', () => {
    // DctPartition has no CFL limit; PmlPartition does, and they share one dt.
    // Asking for 0.5 on a 3D room has to come back reduced.
    const pad = 9;
    const o = airOrigin(pad);
    const grid = shoeboxGrid(16, 14, 12, 0.1, pad);
    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant: 0.5,
      sources: [{ cell: [o + 8, o + 7, o + 6], signal: new Float32Array(2) }],
      receivers: [],
      steps: 2,
      boundary: 'pml',
      absorptionFor: () => 0.2,
    });

    const limit = PML_CFL_MARGIN * vonNeumannCflLimit(spatialRank(grid.nx, grid.ny, grid.nz));
    expect(sim.courant).toBeCloseTo(limit, 10);
    expect(sim.courant).toBeLessThan(0.5);
    expect(sim.warnings.join(' ')).toMatch(/Courant reduced/);
    sim.dispose();
  });

  it('uses impedance boundaries by default, and they cost no cells', () => {
    // Same room, same materials, both boundary kinds — the difference is the
    // whole reason the default changed. Note the padding: the impedance grid is
    // the voxelizer's own one-cell shell, which the slab planner cannot use at
    // all.
    const air = [16, 14, 12] as const;
    const bare = shoeboxGrid(air[0], air[1], air[2], 0.1, 0);
    const padded = shoeboxGrid(air[0], air[1], air[2], 0.1, 9);
    const bareOrigin = airOrigin(0);
    const paddedOrigin = airOrigin(9);

    const build = (grid: VoxelGrid, o: number, boundary: 'impedance' | 'pml') =>
      createArdSimulation({
        grid,
        decomposition: decompose(grid),
        c: C,
        courant: 0.4,
        sources: [{ cell: [o + 8, o + 7, o + 6], signal: new Float32Array(2) }],
        receivers: [],
        steps: 2,
        boundary,
        absorptionFor: () => 0.3,
      });

    const impedance = build(bare, bareOrigin, 'impedance');
    const pml = build(padded, paddedOrigin, 'pml');

    // Both absorb on all six faces.
    expect(impedance.impedancePlan.faces).toHaveLength(6);
    expect(pml.wallPlan.faces).toHaveLength(6);

    // The rooms are the same; only the slabs differ.
    expect(impedance.cellCount.room).toBe(pml.cellCount.room);
    expect(impedance.cellCount.walls).toBe(0);
    expect(pml.cellCount.walls).toBeGreaterThan(impedance.cellCount.room);

    // Boundary cells are the face area, and are not stepped: they are cells the
    // room already contains.
    expect(impedance.cellCount.boundary).toBe(
      2 * (air[0] * air[1] + air[0] * air[2] + air[1] * air[2]),
    );
    expect(impedance.partitions).toHaveLength(pml.partitions.length - 6);

    impedance.dispose();
    pml.dispose();
  });

  it('clamps the Courant number to what the impedance boundary is stable at', () => {
    // Not a CFL limit in the PML's sense — nothing here steps — but the
    // residual is feedback and diverges past a measured bound that depends on
    // the most absorbing surface. The driver has to apply it, because a run
    // that diverges returns NaN for a whole octave band.
    const grid = shoeboxGrid(16, 14, 12, 0.1, 0);
    const o = airOrigin(0);
    const at = (alpha: number) =>
      createArdSimulation({
        grid,
        decomposition: decompose(grid),
        c: C,
        courant: 0.9,
        sources: [{ cell: [o + 8, o + 7, o + 6], signal: new Float32Array(2) }],
        receivers: [],
        steps: 2,
        absorptionFor: () => alpha,
      });

    const live = at(0.1);
    const dead = at(0.95);
    expect(live.courant).toBeCloseTo(impedanceCourantLimit(0.1), 12);
    expect(dead.courant).toBeCloseTo(impedanceCourantLimit(0.95), 12);
    // A more absorbing room gets a smaller time step, and both stay above the
    // 0.446 a PML slab would have imposed regardless of material.
    expect(dead.courant).toBeLessThan(live.courant);
    const slabLimit =
      PML_CFL_MARGIN * vonNeumannCflLimit(spatialRank(grid.nx, grid.ny, grid.nz));
    expect(dead.courant).toBeGreaterThan(slabLimit);
    expect(live.warnings.join(' ')).toMatch(/Courant reduced/);
    expect(live.warnings.join(' ')).toMatch(/impedance boundaries/);
    live.dispose();
    dead.dispose();
  });

  it('warns when the grid is too coarse for the boundary to deliver its alpha', () => {
    // The mapping is measured good to about 0.01 in alpha down to four cells per
    // wavelength. ARD's own default is 2.6, where the top octave comes back at
    // 0.12 for a requested 0.3 — a room quietly more reflective than its
    // materials, which is not visible in the result.
    const grid = shoeboxGrid(16, 14, 12, 0.1, 0);
    const o = airOrigin(0);
    const make = (fMax: number) =>
      createArdSimulation({
        grid,
        decomposition: decompose(grid),
        c: C,
        courant: 0.4,
        sources: [{ cell: [o + 8, o + 7, o + 6], signal: new Float32Array(2) }],
        receivers: [],
        steps: 2,
        fMax,
        absorptionFor: () => 0.3,
      });

    // dx = 0.1 m, so 4 cells per wavelength is 857 Hz.
    const coarse = make(1300);
    expect(coarse.warnings.join(' ')).toMatch(/cells per wavelength/);
    coarse.dispose();

    const fine = make(600);
    expect(fine.warnings.join(' ')).not.toMatch(/cells per wavelength/);
    fine.dispose();

    // No fMax, no warning — the driver does not guess at one.
    const silent = make(0);
    expect(silent.warnings.join(' ')).not.toMatch(/cells per wavelength/);
    silent.dispose();
  });

  it('rejects a boundary kind it does not implement', () => {
    const grid = shoeboxGrid(12, 12, 12, 0.1);
    expect(() =>
      createArdSimulation({
        grid,
        decomposition: decompose(grid),
        c: C,
        sources: [{ cell: [7, 7, 7], signal: new Float32Array(1) }],
        receivers: [],
        steps: 2,
        boundary: 'sponge' as 'pml',
      }),
    ).toThrow(/Unknown boundary sponge/);
  });

  it('keeps the requested Courant number when there are no walls', () => {
    const grid = shoeboxGrid(18, 16, 14, 0.1);
    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant: 0.9, // far past any CFL limit — legal for a pure DCT interior
      walls: false,
      sources: [{ cell: [9, 8, 7], signal: new Float32Array(2) }],
      receivers: [],
      steps: 2,
    });
    expect(sim.courant).toBe(0.9);
    sim.dispose();
  });

  it('resolves duration against the clamped time step, not the requested one', () => {
    // This is the whole reason `duration` exists. A caller that computes
    // `steps` itself has to use the Courant number it *asked for*, because the
    // clamped one is not known until the simulation is built — and every time
    // the clamp bites, the run comes out short. Here it bites by 12%, so a
    // second of impulse response would have been 0.88 s.
    const pad = 9;
    const o = airOrigin(pad);
    const dx = 0.1;
    const grid = shoeboxGrid(16, 14, 12, dx, pad);
    const requested = 0.5;
    const duration = 0.02;

    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant: requested,
      sources: [{ cell: [o + 8, o + 7, o + 6], signal: new Float32Array(1) }],
      receivers: [],
      duration,
      boundary: 'pml',
      absorptionFor: () => 0.3,
    });

    expect(sim.courant).toBeLessThan(requested);
    expect(sim.steps).toBe(Math.ceil(duration / sim.dt));
    // Strictly more steps than the requested Courant number would have given,
    // which is what a caller doing its own arithmetic would have asked for.
    expect(sim.steps).toBeGreaterThan(Math.ceil(duration / ((requested * dx) / C)));
    sim.dispose();
  });

  it('wants exactly one of steps and duration', () => {
    const grid = shoeboxGrid(12, 12, 12, 0.1);
    const base = {
      grid,
      decomposition: decompose(grid),
      c: C,
      walls: false,
      sources: [{ cell: [7, 7, 7] as [number, number, number], signal: new Float32Array(1) }],
      receivers: [],
    };
    expect(() => createArdSimulation({ ...base })).toThrow(/exactly one of steps or duration/);
    expect(() => createArdSimulation({ ...base, steps: 4, duration: 0.01 })).toThrow(
      /exactly one of steps or duration/,
    );
    expect(() => createArdSimulation({ ...base, duration: 0 })).toThrow(/duration must be positive/);
    expect(() => createArdSimulation({ ...base, steps: 2.5 })).toThrow(/positive integer/);
  });

  it('rejects probes that are not in the room', () => {
    const grid = shoeboxGrid(14, 14, 14, 0.1);
    const decomposition = decompose(grid);
    const base = {
      grid,
      decomposition,
      c: C,
      steps: 2,
      walls: false,
      sources: [{ cell: [8, 8, 8] as [number, number, number], signal: new Float32Array(2) }],
      receivers: [],
    };

    expect(() =>
      createArdSimulation({ ...base, receivers: [{ cell: [0, 8, 8] }] }),
    ).toThrow(/inside a wall/);
    expect(() =>
      createArdSimulation({ ...base, receivers: [{ cell: [99, 8, 8] }] }),
    ).toThrow(/outside the grid/);
  });
});

describe('free-field physics', () => {
  /**
   * Walls off, so the only boundaries are the DCT partition's own rigid faces.
   * Measurements are taken before the first reflection can arrive, which is
   * what makes this a free-field test inside a finite box.
   */
  // Air region is 64 x 32 x 32 — powers of two, so every DCT axis takes the
  // radix-2 path instead of Bluestein, a 3-5x saving (Phase 1 measurements)
  // that costs the test nothing.
  const dx = 0.05;
  const AIR: [number, number, number] = [64, 32, 32];
  const grid = shoeboxGrid(AIR[0], AIR[1], AIR[2], dx);
  const decomposition = decompose(grid);
  const o = airOrigin();
  /** Local coordinates inside the air box. */
  const sourceLocal: [number, number, number] = [14, 16, 16];
  const sourceCell: [number, number, number] = [
    o + sourceLocal[0], o + sourceLocal[1], o + sourceLocal[2],
  ];

  /**
   * Step at which the earliest wall reflection can reach a receiver.
   *
   * Taking the global peak of the response is wrong in a rigid box: with no
   * absorption the modes ring indefinitely and can interfere constructively
   * later than, and louder than, the direct arrival. So the direct wave has to
   * be found in the window before anything else can get there, computed from
   * the six image sources rather than guessed.
   */
  function firstReflectionStep(receiverLocal: [number, number, number], courant: number): number {
    let earliest = Infinity;
    for (let axis = 0; axis < 3; axis++) {
      for (const side of [0, 1]) {
        const image = [...sourceLocal];
        // Mirror the source in the wall just outside the air box.
        image[axis] = side === 0 ? -1 - sourceLocal[axis] : 2 * AIR[axis] - 1 - sourceLocal[axis];
        const d = Math.hypot(
          image[0] - receiverLocal[0],
          image[1] - receiverLocal[1],
          image[2] - receiverLocal[2],
        );
        earliest = Math.min(earliest, d / courant);
      }
    }
    return Math.floor(earliest);
  }

  function runWithReceivers(distancesInCells: number[]) {
    const steps = 200;
    const dt = (0.4 * dx) / C;
    const signal = bandlimitedPulse(steps, dt, 1200);
    const sim = createArdSimulation({
      grid,
      decomposition,
      c: C,
      courant: 0.4,
      walls: false,
      sources: [{ cell: sourceCell, signal }],
      receivers: distancesInCells.map((d) => ({
        cell: [sourceCell[0] + d, sourceCell[1], sourceCell[2]] as [number, number, number],
      })),
      steps,
    });
    const irs = sim.run();
    const result = { dt: sim.dt, irs, signal };
    sim.dispose();
    return result;
  }

  // Far enough out that the source's own cell is not still the near field, and
  // close enough in that the direct wave arrives well before any reflection.
  const DISTANCES = [12, 24, 36];

  /** Peak of the direct arrival alone, in the pre-reflection window. */
  function directPeak(ir: Float32Array, distance: number, courant: number) {
    const receiverLocal: [number, number, number] = [
      sourceLocal[0] + distance, sourceLocal[1], sourceLocal[2],
    ];
    return peakOf(ir, 0, firstReflectionStep(receiverLocal, courant));
  }

  it('puts the direct arrival at the right sample', () => {
    const { dt, irs, signal } = runWithReceivers(DISTANCES);

    // The response peaks where the source signal does, delayed by the travel
    // time. Taking the offset from the signal itself rather than from its
    // formula keeps this independent of the pulse shape.
    const pulseOffset = peakOf(signal).index;

    for (let n = 0; n < DISTANCES.length; n++) {
      const travel = (DISTANCES[n] * dx) / C / dt;
      const expected = Math.round(travel) + pulseOffset;
      const { index } = directPeak(irs[n], DISTANCES[n], 0.4);
      expect(Math.abs(index - expected)).toBeLessThanOrEqual(1);
    }
  }, 60_000);

  it('follows 1/r spreading across three distances', () => {
    const { irs } = runWithReceivers(DISTANCES);
    const peaks = DISTANCES.map((d, n) => directPeak(irs[n], d, 0.4).value);

    expect(peaks[0]).toBeGreaterThan(0);
    // A point source in three dimensions: pressure falls as 1/r, so the
    // product of peak and distance is constant.
    expect((peaks[1] * DISTANCES[1]) / (peaks[0] * DISTANCES[0])).toBeCloseTo(1, 1);
    expect((peaks[2] * DISTANCES[2]) / (peaks[0] * DISTANCES[0])).toBeCloseTo(1, 1);
  }, 60_000);
});

describe('energy does not grow once the source stops', () => {
  /**
   * With rigid walls and no absorption the field should hold its energy; it
   * must never gain any. A scheme that did would be unstable, and an interface
   * treatment that injected energy would show up here before anywhere else.
   */
  function fieldEnergy(sim: ReturnType<typeof createArdSimulation>): number {
    let total = 0;
    for (const partition of sim.partitions) {
      const p = partition.pressure;
      for (let i = 0; i < p.length; i++) total += p[i] * p[i];
    }
    return total;
  }

  it('holds steady with rigid walls', () => {
    const dx = 0.1;
    const grid = shoeboxGrid(24, 16, 16, dx);
    const dt = (0.4 * dx) / C;
    const sourceSteps = 60;
    const signal = bandlimitedPulse(sourceSteps, dt, 600);

    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant: 0.4,
      walls: false,
      sources: [{ cell: [8, 6, 5], signal }],
      receivers: [],
      steps: 600,
    });

    for (let s = 0; s < sourceSteps; s++) sim.step();
    const afterSource = fieldEnergy(sim);
    expect(afterSource).toBeGreaterThan(0);

    let worst = 0;
    while (sim.currentStep < 600) {
      sim.step();
      worst = Math.max(worst, fieldEnergy(sim));
    }
    // Sum of p^2 is not the conserved quantity — the field trades between
    // pressure and velocity — so it oscillates. What must not happen is
    // sustained growth.
    expect(worst / afterSource).toBeLessThan(3);
    expect(Number.isFinite(worst)).toBe(true);
    sim.dispose();
  }, 60_000);

  it.each(['impedance', 'pml'] as const)(
    'decays with absorbing boundaries and holds steady without them (%s)',
    (boundary) => {
      // Paired against a rigid control, because sum of p^2 is not the conserved
      // quantity and wanders on its own. What identifies the boundary as the
      // cause is that the same room with alpha = 0 does not decay at all.
      //
      // Run for both boundary kinds: this is the property they are alternative
      // implementations of, so neither is allowed to pass it alone.
      const dx = 0.1;
      const pad = 9;
      const o = airOrigin(pad);
      const grid = shoeboxGrid(24, 16, 16, dx, pad);
      const decomposition = decompose(grid);
      const dt = (0.4 * dx) / C;
      const signal = bandlimitedPulse(60, dt, 600);

      const runTo = (alpha: number) => {
        const sim = createArdSimulation({
          grid,
          decomposition,
          c: C,
          courant: 0.4,
          sources: [{ cell: [o + 7, o + 5, o + 4], signal }],
          receivers: [],
          steps: 500,
          boundary,
          absorptionFor: () => alpha,
        });
        // The control is rigid because nothing is built for alpha = 0 at all,
        // which is exactly what makes it a control: same grid, same
        // decomposition, no absorbing boundary anywhere.
        const built =
          boundary === 'pml' ? sim.wallPlan.faces.length : sim.impedancePlan.faces.length;
        expect(built).toBe(alpha > 0 ? 6 : 0);
        // Sample once the field has filled the room, not while it is still
        // arriving: the source stops at step 60 but the energy keeps
        // redistributing for a while after.
        while (sim.currentStep < 150) sim.step();
        const settled = fieldEnergy(sim);
        while (sim.currentStep < 500) sim.step();
        const final = fieldEnergy(sim);
        sim.dispose();
        return { settled, final };
      };

      const rigid = runTo(0);
      const absorbing = runTo(0.6);

      // Rigid walls conserve: the field is still there at the end.
      expect(rigid.final / rigid.settled).toBeGreaterThan(0.5);
      // Absorbing walls take it away.
      expect(absorbing.final / absorbing.settled).toBeLessThan(0.2);
      expect(absorbing.final).toBeLessThan(rigid.final);
    },
    120_000,
  );

  it('applies air attenuation to the room only, never to a wall slab', () => {
    // A PML slab is not air. Its damping is calibrated to hit a target
    // reflection coefficient, so scaling its state on top of that makes the
    // wall more absorbing than the material it stands for — and it also scales
    // the auxiliary `phi` fields, which are not pressure at all. The effect is
    // small, plausible and entirely invisible in a reverberation time, which
    // is why this is checked by mechanism rather than by measurement.
    const dx = 0.1;
    const pad = 9;
    const o = airOrigin(pad);
    const grid = shoeboxGrid(16, 14, 12, dx, pad);

    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant: 0.4,
      sources: [{ cell: [o + 8, o + 7, o + 6], signal: new Float32Array(4) }],
      receivers: [],
      steps: 4,
      airAbsNepersPerMetre: 0.5,
      boundary: 'pml',
      absorptionFor: () => 0.4,
    });

    const scaled = new Map<(typeof sim.partitions)[number], number>();
    for (const partition of sim.partitions) {
      const original = partition.scaleState.bind(partition);
      scaled.set(partition, 0);
      (partition as { scaleState: (f: number) => void }).scaleState = (factor: number) => {
        scaled.set(partition, (scaled.get(partition) ?? 0) + 1);
        original(factor);
      };
    }

    sim.step();

    const pml = sim.partitions.filter((p) => p.kind === 'pml');
    const room = sim.partitions.filter((p) => p.kind !== 'pml');
    expect(pml.length).toBeGreaterThan(0);
    expect(room.length).toBeGreaterThan(0);
    for (const partition of pml) expect(scaled.get(partition)).toBe(0);
    for (const partition of room) expect(scaled.get(partition)).toBe(1);
    sim.dispose();
  });

  it('decays faster with air attenuation than without', () => {
    const dx = 0.1;
    const grid = shoeboxGrid(20, 16, 16, dx);
    const decomposition = decompose(grid);
    const dt = (0.4 * dx) / C;
    const signal = bandlimitedPulse(40, dt, 600);

    const build = (airAbs: number) =>
      createArdSimulation({
        grid,
        decomposition,
        c: C,
        courant: 0.4,
        walls: false,
        sources: [{ cell: [7, 6, 5], signal }],
        receivers: [],
        steps: 400,
        airAbsNepersPerMetre: airAbs,
      });

    const dry = build(0);
    const damped = build(0.5);
    while (dry.currentStep < 400) dry.step();
    while (damped.currentStep < 400) damped.step();

    expect(fieldEnergy(damped)).toBeLessThan(fieldEnergy(dry));
    dry.dispose();
    damped.dispose();
  }, 60_000);
});

describe('rigid box eigenfrequencies', () => {
  /**
   * The end-to-end physics check. Drive a rigid shoebox with a broadband pulse,
   * record at an off-axis point, and look for peaks where the analytic series
   * says modes are:
   *
   *   f(nx,ny,nz) = (c/2) sqrt((nx/Lx)^2 + (ny/Ly)^2 + (nz/Lz)^2)
   *
   * This exercises the whole assembled pipeline — decomposition, partition,
   * source injection, recording — against an answer from a textbook rather than
   * from the code.
   */
  it('matches the analytic shoebox series for the lowest modes', () => {
    const dx = 0.1;
    // Air region is 16 x 12 x 8 cells inside a one-cell shell. Small on
    // purpose: the modes are then far apart relative to the FFT bin width, so
    // a peak can be attributed to one mode rather than a cluster.
    const grid = shoeboxGrid(16, 12, 8, dx);
    const [lx, ly, lz] = [16 * dx, 12 * dx, 8 * dx];

    const steps = 8192;
    const dt = (0.4 * dx) / C;
    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant: 0.4,
      walls: false,
      // Off-centre and off-axis, so no mode sits on a node of the source or
      // the receiver and drops out of the spectrum.
      sources: [{ cell: [3, 3, 2], signal: bandlimitedPulse(steps, dt, 2000) }],
      receivers: [{ cell: [14, 11, 8] }],
      steps,
    });

    const [ir] = sim.run();
    sim.dispose();

    // Spectrum of the response.
    const re = Float64Array.from(ir);
    const im = new Float64Array(steps);
    createComplexFftPlan(steps).forward(re, im);

    const binHz = 1 / (steps * dt);
    const magnitude = new Float64Array(steps / 2);
    for (let i = 0; i < steps / 2; i++) magnitude[i] = Math.hypot(re[i], im[i]);

    /** Is there a spectral peak within tolerance of this frequency? */
    const hasPeakNear = (hz: number, toleranceHz: number): boolean => {
      const lo = Math.max(1, Math.floor((hz - toleranceHz) / binHz));
      const hi = Math.min(magnitude.length - 2, Math.ceil((hz + toleranceHz) / binHz));
      for (let i = lo; i <= hi; i++) {
        if (magnitude[i] > magnitude[i - 1] && magnitude[i] >= magnitude[i + 1]) {
          // Ignore ripple: a mode stands well above its surroundings.
          const floor = Math.min(magnitude[lo - 1] ?? magnitude[lo], magnitude[hi + 1] ?? magnitude[hi]);
          if (magnitude[i] > 2 * floor) return true;
        }
      }
      return false;
    };

    const analytic = (mx: number, my: number, mz: number) =>
      (C / 2) * Math.hypot(mx / lx, my / ly, mz / lz);

    const modes: Array<[number, number, number]> = [
      [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1],
      [2, 0, 0], [1, 0, 1], [0, 1, 1], [2, 1, 0],
      [1, 1, 1], [0, 2, 0],
    ];

    const found = modes.filter(([mx, my, mz]) => hasPeakNear(analytic(mx, my, mz), 4 * binHz));
    // A couple of the ten can be masked by a neighbour in a room this small,
    // where modes are only tens of Hz apart.
    expect(found.length).toBeGreaterThanOrEqual(8);
  }, 120_000);
});

describe('bandlimitedPulse', () => {
  const dt = (0.4 * 0.1) / C;

  it('sums to zero even when the buffer truncates the tail', () => {
    // The analytic integral of a Gaussian derivative is zero over the whole
    // line. A buffer is not the whole line: it starts at -4 sigma and stops
    // wherever `steps` runs out, so the sampled sum is not zero unless it is
    // made so. Whatever is left over is DC, which drives the omega = 0 mode
    // and ramps the mean pressure of a sealed rigid room without bound.
    const fMax = 600;
    const sigma = 1 / (2 * Math.PI * fMax);
    // Deliberately short: cut off about 1.3 sigma past the peak, well inside
    // the tail, which is the case the analytic argument does not cover.
    const steps = Math.ceil((4 * sigma + 1.3 * sigma) / dt);
    const pulse = bandlimitedPulse(steps, dt, fMax);

    let sum = 0;
    let magnitude = 0;
    for (const v of pulse) {
      sum += v;
      magnitude = Math.max(magnitude, Math.abs(v));
    }
    expect(magnitude).toBeGreaterThan(0.1);
    expect(Math.abs(sum) / magnitude).toBeLessThan(1e-6);
  });

  it('does not ramp the mean pressure of a sealed rigid room', () => {
    // The consequence, measured. With zero net forcing the DC mode has no
    // restoring force but also no drive: after the source stops its amplitude
    // is constant. With net forcing it accelerates, and the mean pressure —
    // and with it the field energy — walks up linearly and without bound.
    //
    // So the test is flatness, not smallness. A one-off offset is harmless;
    // a slope is the bug.
    const dx = 0.1;
    const grid = shoeboxGrid(16, 12, 12, dx);
    const fMax = 600;
    const sigma = 1 / (2 * Math.PI * fMax);
    const sourceSteps = Math.ceil((4 * sigma + 1.3 * sigma) / dt);

    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant: 0.4,
      walls: false,
      sources: [{ cell: [6, 5, 5], signal: bandlimitedPulse(sourceSteps, dt, fMax) }],
      receivers: [],
      steps: 900,
    });

    const meanPressure = () => {
      let total = 0;
      let count = 0;
      for (const partition of sim.partitions) {
        for (let i = 0; i < partition.pressure.length; i++) total += partition.pressure[i];
        count += partition.pressure.length;
      }
      return total / count;
    };
    let scale = 0;
    const runTo = (step: number) => {
      while (sim.currentStep < step) {
        sim.step();
        for (const partition of sim.partitions) {
          for (let i = 0; i < partition.pressure.length; i++) {
            scale = Math.max(scale, Math.abs(partition.pressure[i]));
          }
        }
      }
    };

    runTo(sourceSteps);
    expect(scale).toBeGreaterThan(0);

    runTo(300);
    const early = meanPressure();
    runTo(900);
    const late = meanPressure();

    // 600 further steps with the source long silent. Measured: 2e-8 with the
    // correction — the float32 signal buffer's own quantization floor, since
    // the mean is subtracted in double and then rounded back to float32 — and
    // 0.24 without it. Seven orders of magnitude apart, so the threshold sits
    // comfortably between rather than on either.
    expect(Math.abs(late - early) / scale).toBeLessThan(1e-5);
    sim.dispose();
  }, 60_000);
});
