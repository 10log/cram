/**
 * Simulation driver — Phase 6 of the ARD solver (docs/ard-solver-plan.md).
 *
 * Assembles everything the earlier phases produced into a running simulation:
 * partitions from the decomposition (Phase 3/4), interfaces between them and
 * absorbing layers on the room surfaces (Phase 5), then the time loop.
 *
 * Portable by design — no DOM, no stores, no `three`. `ard.worker.ts` hosts it
 * off the main thread; the tests drive it directly.
 *
 * ## The loop
 *
 * ```
 * for each step:
 *   apply interface forcing      (from the current pressure)
 *   inject source forcing        (this step's sample)
 *   step every partition         (consumes the forcing, then clears it)
 *   apply air attenuation
 *   record receiver samples
 * ```
 *
 * This is the reference's `Simulation::main` ordering written the other way
 * round, so each step sees forcing evaluated at its own time level rather than
 * the previous one. Partitions run sequentially: the reference's thread per
 * partition does not port, and `SharedArrayBuffer` is unavailable (plan D2).
 *
 * ## Air attenuation
 *
 * A per-step multiplicative decay `exp(-m·c·Δt)` on every partition's state.
 * This is the place the reference's hardcoded `0.999` was standing in for —
 * except derived from a real absorption coefficient instead of invented, and
 * therefore switched off by default rather than always on at −387 dB/s.
 *
 * ## The time step is set by the walls, not the room
 *
 * `DctPartition` has no CFL limit, which is ARD's headline property. But wall
 * slabs are `PmlPartition`s running an explicit 6th-order update, and they do —
 * and since every partition shares one `dt`, **the walls set the time step for
 * the whole simulation**. On a 3D room that caps the Courant number at about
 * 0.446 rather than the plan's default 0.5. It is a 12% cost, not a
 * catastrophe, but it does mean "no CFL limit" stops being true the moment
 * absorbing boundaries are added. A locally-reacting impedance boundary
 * (plan reference [6]) would avoid it, along with the cell cost below.
 */

import type { Decomposition } from './decompose';
import { DctPartition } from './dct-partition';
import { FdtdPartition } from './fdtd-partition';
import {
  applyAllInterfaceForcing,
  findInterfaces,
  type PartitionInterface,
} from './interface';
import {
  Axis,
  spatialRank,
  vonNeumannCflLimit,
  type Partition,
} from './partition';
import { PML_CFL_MARGIN } from './pml-partition';
import { Cell, type VoxelGrid } from './voxelize';
import {
  DEFAULT_WALL_THICKNESS,
  buildWalls,
  padCellsForWalls,
  planWalls,
  type WallPlan,
} from './walls-from-grid';

export interface ArdSource {
  /** Global cell coordinates. */
  cell: [number, number, number];
  /** Forcing sample per step. Steps past the end contribute nothing. */
  signal: Float32Array;
}

export interface ArdReceiver {
  cell: [number, number, number];
}

export interface ArdSimulationConfig {
  grid: VoxelGrid;
  decomposition: Decomposition;
  c: number;
  /** Courant number to aim for. Reduced if the wall slabs cannot run at it. */
  courant?: number;
  sources: ArdSource[];
  receivers: ArdReceiver[];
  steps: number;
  /** Air attenuation in nepers per metre. 0 disables it. */
  airAbsNepersPerMetre?: number;
  /** Absorption coefficient per surface index; -1 means no surface recorded. */
  absorptionFor?: (surfaceIndex: number) => number;
  /** Build absorbing walls. Off gives rigid surfaces — useful for modal tests. */
  walls?: boolean;
  /**
   * Slab thickness in cells. Higher reaches a higher absorption coefficient and
   * costs proportionally more cells — see the table in `walls-from-grid.ts`.
   * The grid must have been voxelized with `padCells >= thickness + 1`.
   */
  wallThickness?: number;
  /** Emit a display slice every N steps. 0 disables. */
  frameInterval?: number;
  sliceAxis?: 'x' | 'y' | 'z';
  sliceIndex?: number;
}

export interface ArdStepResult {
  step: number;
  /** One sample per receiver, in the order they were configured. */
  receiverSamples: Float32Array;
  /** Pressure over the slice plane, when this step emits one. */
  slice?: Float32Array;
}

export interface ArdSimulation {
  readonly dt: number;
  readonly courant: number;
  readonly steps: number;
  readonly partitions: readonly Partition[];
  readonly interfaces: readonly PartitionInterface[];
  readonly wallPlan: WallPlan;
  /** Cells in room partitions, and cells added by wall slabs. */
  readonly cellCount: { room: number; walls: number };
  readonly warnings: readonly string[];
  /** Steps taken so far. */
  readonly currentStep: number;
  step(): ArdStepResult;
  /** Run to completion, returning one impulse response per receiver. */
  run(): Float32Array[];
  dispose(): void;
}

/** Where a source or receiver lives, once resolved onto a partition. */
interface Probe {
  partition: Partition;
  local: [number, number, number];
}

export function createArdSimulation(config: ArdSimulationConfig): ArdSimulation {
  const {
    grid,
    decomposition,
    c,
    courant: requestedCourant = 0.4,
    sources,
    receivers,
    steps,
    airAbsNepersPerMetre = 0,
    absorptionFor = () => 0,
    walls = true,
    wallThickness = DEFAULT_WALL_THICKNESS,
    frameInterval = 0,
    sliceAxis = 'z',
    sliceIndex,
  } = config;

  const warnings: string[] = [];
  const dx = grid.dx;

  if (!(c > 0)) throw new Error(`Speed of sound must be positive, got ${c}`);
  if (!Number.isInteger(steps) || steps < 1) {
    throw new Error(`steps must be a positive integer, got ${steps}`);
  }
  if (decomposition.boxes.length === 0) {
    throw new Error('Decomposition has no boxes; there is nothing to simulate');
  }

  // --- Wall plan -------------------------------------------------------------
  // Planned before the time step, because whether any slab is actually placed
  // is what decides the CFL limit below. `planWalls` needs no dt, so the order
  // costs nothing. Doing it the other way round clamps the Courant number for a
  // room that turns out to have no slabs at all — every surface rigid, every
  // face dropped — which is a 12% tax for a constraint that does not exist.
  const wallPlan: WallPlan = walls
    ? planWalls(grid, decomposition, { maxThickness: wallThickness, absorptionFor })
    : { faces: [], warnings: [], slabCells: 0, droppedForSpace: 0, skippedRigid: 0 };
  warnings.push(...wallPlan.warnings);

  if (walls && wallPlan.faces.length === 0 && wallPlan.droppedForSpace > 0) {
    // Not a warning. A caller that asked for absorbing walls and got a sealed
    // rigid box gets a reverberation time set by nothing but air attenuation,
    // and the number looks plausible enough to publish. The cause is almost
    // always the same one thing, so say it.
    throw new Error(
      `Walls were requested but all ${wallPlan.droppedForSpace} faces were dropped for lack ` +
        'of solid to grow into, so every room surface would be perfectly rigid. Voxelize ' +
        `with padCells >= ${padCellsForWalls(wallThickness)} (currently the grid has too ` +
        'few), or pass walls: false if a rigid room is what you meant.',
    );
  }
  if (walls && wallPlan.faces.length === 0) {
    // The other way to get no slabs: every material is perfectly reflective.
    // That is the caller's choice, faithfully carried out.
    warnings.push(
      `No wall slabs were built: all ${wallPlan.skippedRigid} faces have materials that ` +
        'absorb nothing, so every surface is rigid. The simulation runs without the PML ' +
        'CFL limit as a result.',
    );
  }

  // --- Time step -------------------------------------------------------------
  // Wall slabs carry the transverse extents of the face they cover, so on a 3D
  // room they are rank 3 and take the 3D CFL limit. Everything shares one dt,
  // so the wall is what sets it — but only if there is a wall.
  const gridRank = spatialRank(grid.nx, grid.ny, grid.nz);
  const wallLimit =
    wallPlan.faces.length > 0 ? PML_CFL_MARGIN * vonNeumannCflLimit(gridRank) : Infinity;
  // An FDTD partition appears wherever a box was too thin for the interface
  // stencil, and has the same limit without the PML margin.
  const hasFdtd = decomposition.kinds.includes('fdtd');
  const fdtdLimit = hasFdtd ? vonNeumannCflLimit(gridRank) : Infinity;
  const courant = Math.min(requestedCourant, wallLimit, fdtdLimit);
  if (courant < requestedCourant) {
    warnings.push(
      `Courant reduced from ${requestedCourant} to ${courant.toFixed(3)}: the ` +
        `${wallLimit <= fdtdLimit ? 'wall slabs' : 'FDTD partitions'} are rank ${gridRank} ` +
        'and cannot run faster. DCT interiors have no such limit, but every partition ' +
        'shares a time step.',
    );
  }
  const dt = (courant * dx) / c;

  // --- Partitions ------------------------------------------------------------
  const roomPartitions: Partition[] = decomposition.boxes.map((box, n) =>
    decomposition.kinds[n] === 'dct'
      ? new DctPartition({ box, dx, c, dt })
      : new FdtdPartition({ box, dx, c, dt }),
  );

  let wallPartitions: Partition[] = [];
  if (wallPlan.faces.length > 0) {
    const built = buildWalls(wallPlan, { dx, c, dt, absorptionFor });
    wallPartitions = built.partitions;
    warnings.push(...built.warnings);
  }

  const partitions: Partition[] = [...roomPartitions, ...wallPartitions];
  const interfaces = findInterfaces(partitions);

  const roomCells = roomPartitions.reduce((t, p) => t + p.box.w * p.box.h * p.box.d, 0);
  const wallCells = wallPartitions.reduce((t, p) => t + p.box.w * p.box.h * p.box.d, 0);
  if (wallCells > roomCells) {
    warnings.push(
      `Wall slabs add ${wallCells} cells against the room's ${roomCells} (${(
        wallCells / roomCells
      ).toFixed(1)}x) — the simulation is mostly wall. Absorbing layers are expensive in ` +
        'cells; a locally-reacting impedance boundary would cost none.',
    );
  }

  // --- Sources and receivers -------------------------------------------------
  const resolve = (cell: [number, number, number], what: string): Probe => {
    const [i, j, k] = cell;
    if (i < 0 || j < 0 || k < 0 || i >= grid.nx || j >= grid.ny || k >= grid.nz) {
      throw new Error(`${what} at cell (${i}, ${j}, ${k}) is outside the grid`);
    }
    const idx = i + grid.nx * (j + grid.ny * k);
    if (grid.cells[idx] !== Cell.Air) {
      throw new Error(`${what} at cell (${i}, ${j}, ${k}) is inside a wall, not in the room`);
    }
    const boxIndex = decomposition.assignment[idx];
    if (boxIndex < 0) {
      throw new Error(`${what} at cell (${i}, ${j}, ${k}) is in air no partition covers`);
    }
    const partition = roomPartitions[boxIndex];
    return {
      partition,
      local: [i - partition.box.x, j - partition.box.y, k - partition.box.z],
    };
  };

  const sourceProbes = sources.map((s, n) => resolve(s.cell, `Source ${n}`));
  const receiverProbes = receivers.map((r, n) => resolve(r.cell, `Receiver ${n}`));

  // --- Slice plane -----------------------------------------------------------
  const sliceAxisIndex = sliceAxis === 'x' ? Axis.X : sliceAxis === 'y' ? Axis.Y : Axis.Z;
  const sliceDims = [grid.nx, grid.ny, grid.nz];
  const resolvedSliceIndex = sliceIndex ?? Math.floor(sliceDims[sliceAxisIndex] / 2);
  const [sliceU, sliceV] =
    sliceAxisIndex === Axis.X
      ? [grid.ny, grid.nz]
      : sliceAxisIndex === Axis.Y
        ? [grid.nx, grid.nz]
        : [grid.nx, grid.ny];

  // --- Loop state ------------------------------------------------------------
  const decayPerStep =
    airAbsNepersPerMetre > 0 ? Math.exp(-airAbsNepersPerMetre * c * dt) : 1;
  const receiverSamples = new Float32Array(receivers.length);
  let currentStep = 0;

  const simulation: ArdSimulation = {
    dt,
    courant,
    steps,
    partitions,
    interfaces,
    wallPlan,
    cellCount: { room: roomCells, walls: wallCells },
    warnings,
    get currentStep() {
      return currentStep;
    },

    step(): ArdStepResult {
      applyAllInterfaceForcing(interfaces, c, dx);

      for (let n = 0; n < sourceProbes.length; n++) {
        const signal = sources[n].signal;
        if (currentStep >= signal.length) continue;
        const value = signal[currentStep];
        if (value === 0) continue;
        const { partition, local } = sourceProbes[n];
        partition.addForce(local[0], local[1], local[2], value);
      }

      for (const partition of partitions) partition.step();

      // Room partitions only. A PML slab is not air — it is a numerical
      // absorber whose damping is already calibrated to hit a target reflection
      // coefficient, and scaling its state on top of that makes the wall more
      // absorbing than the material it stands for. It also scales the auxiliary
      // `phi` fields, which are not pressure and have no business decaying at
      // the air's rate.
      if (decayPerStep !== 1) {
        for (const partition of roomPartitions) partition.scaleState(decayPerStep);
      }

      for (let n = 0; n < receiverProbes.length; n++) {
        const { partition, local } = receiverProbes[n];
        receiverSamples[n] = partition.pressureAt(local[0], local[1], local[2]);
      }

      const stepIndex = currentStep;
      currentStep++;

      const wantsSlice = frameInterval > 0 && stepIndex % frameInterval === 0;
      return {
        step: stepIndex,
        receiverSamples: receiverSamples.slice(),
        slice: wantsSlice ? captureSlice() : undefined,
      };
    },

    run(): Float32Array[] {
      const impulseResponses = receivers.map(() => new Float32Array(steps));
      while (currentStep < steps) {
        const result = simulation.step();
        for (let n = 0; n < receivers.length; n++) {
          impulseResponses[n][result.step] = result.receiverSamples[n];
        }
      }
      return impulseResponses;
    },

    dispose(): void {
      for (const partition of partitions) partition.dispose();
    },
  };

  /** Pressure across the slice plane, gathered from whichever partitions cover it. */
  function captureSlice(): Float32Array {
    const out = new Float32Array(sliceU * sliceV);
    for (const partition of roomPartitions) {
      const box = partition.box;
      const lo = [box.x, box.y, box.z][sliceAxisIndex];
      const hi = lo + [box.w, box.h, box.d][sliceAxisIndex];
      if (resolvedSliceIndex < lo || resolvedSliceIndex >= hi) continue;

      for (let k = box.z; k < box.z + box.d; k++) {
        for (let j = box.y; j < box.y + box.h; j++) {
          for (let i = box.x; i < box.x + box.w; i++) {
            const global = [i, j, k];
            if (global[sliceAxisIndex] !== resolvedSliceIndex) continue;
            const u =
              sliceAxisIndex === Axis.X ? j : sliceAxisIndex === Axis.Y ? i : i;
            const v =
              sliceAxisIndex === Axis.X ? k : sliceAxisIndex === Axis.Y ? k : j;
            out[u + sliceU * v] = partition.pressureAt(
              i - box.x,
              j - box.y,
              k - box.z,
            );
          }
        }
      }
    }
    return out;
  }

  return simulation;
}

/**
 * A DC-free bandlimited pulse, for driving a simulation.
 *
 * The first derivative of a Gaussian, `-(t/σ)·exp(-t²/2σ²)`, whose integral is
 * exactly zero.
 *
 * **The zero mean is the point, not a detail.** A plain Gaussian is all
 * positive, so injecting it as forcing pushes net volume into the room. In a
 * sealed rigid box that has nowhere to go: it drives the DC mode, which has
 * `ω = 0` and therefore no restoring force, so the mean pressure ramps linearly
 * and the field energy grows without bound. Measured on a 20x16x14 room, a
 * plain Gaussian grew the field energy 27x between steps 120 and 600 with the
 * source long since silent, and buried the modal peaks under the ramp; this
 * pulse holds at 1.1x with a stable mean.
 *
 * That growth is real physics — a source that injects mass into a sealed rigid
 * room does raise its static pressure — but it is not what an acoustic source
 * does, and it is the same DC mode the reference mishandles from the other
 * direction by giving it a non-zero frequency (plan §1.5 item 4).
 *
 * Not a calibrated source: no level, no directivity, and the result is a pulse
 * response rather than an impulse response. Deconvolving the pulse, normalizing
 * against a free-field reference and applying `Source.initialSPL` and
 * directivity is Phase 7's job (plan D4). This exists so Phase 6 and its tests
 * have something to inject.
 */
export function bandlimitedPulse(steps: number, dt: number, fMax: number): Float32Array {
  const sigma = 1 / (2 * Math.PI * fMax);
  const centre = 4 * sigma;
  const out = new Float32Array(steps);
  let sum = 0;
  for (let n = 0; n < steps; n++) {
    const t = n * dt - centre;
    const v = -(t / sigma) * Math.exp(-0.5 * (t / sigma) ** 2);
    out[n] = v;
    sum += v;
  }

  // The analytic integral is zero over `(-inf, inf)`. This buffer is neither
  // infinite nor symmetric about the peak: it starts at `t = -4σ` and stops at
  // whatever `steps` reaches, so the sampled sum is not zero and the residue is
  // exactly the DC content the pulse exists to avoid. Subtracting the sample
  // mean makes the discrete sum zero by construction, whatever `steps` is.
  //
  // The correction is tiny when the buffer is long (the tails are ~1e-8 of the
  // peak by 6σ) and is the whole difference when it is short — a caller who
  // truncates at, say, 2σ past the peak otherwise gets a net-positive pulse and
  // the unbounded energy growth described above, with no indication why.
  const mean = steps > 0 ? sum / steps : 0;
  if (mean !== 0) {
    for (let n = 0; n < steps; n++) out[n] -= mean;
  }
  return out;
}
