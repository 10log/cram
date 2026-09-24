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
 * ## Two kinds of absorbing boundary, and why the default changed
 *
 * `DctPartition` has no CFL limit, which is ARD's headline property. A PML wall
 * slab is a `PmlPartition` running an explicit 6th-order update, and it does —
 * and since every partition shares one `dt`, **a slab sets the time step for
 * the whole simulation**, capping a 3D room at about Courant 0.446. It also
 * adds 2-5x the room in cells and, Phase 10 measured, takes 76-93% of step
 * time.
 *
 * `boundary: 'impedance'` is the default instead. A locally-reacting impedance
 * boundary (plan reference [6]) is a forcing term on cells that already exist:
 * no added cells, no grid padding, no calibration curves, and measured closer
 * to the requested absorption coefficient than the slab at every grid
 * resolution tested — see `impedance.ts` for both tables. It is not free of a
 * time-step constraint, though: its residual is feedback from the field onto
 * itself and diverges past `0.55 − 0.05α`. That is above the slab's 0.446 at
 * every absorption coefficient — by 12% at a perfect absorber and 23% at a
 * rigid one — so the clamp is loosened rather than lifted. `'pml'` remains
 * available and unchanged; it is what the slab machinery in
 * `walls-from-grid.ts` still serves.
 *
 * The two are alternatives, never both: a face carries one or the other, and
 * `planArdTimeStep` returns one non-empty plan.
 */

import type { Decomposition } from './decompose';
import { DctPartition } from './dct-partition';
import { FdtdPartition } from './fdtd-partition';
import {
  buildImpedanceBoundaries,
  buildRigidFdtdBoundaries,
  faceKey,
  planImpedanceBoundaries,
  type ImpedancePlan,
} from './boundaries-from-grid';
import {
  ARD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE,
  applyAllImpedanceForcing,
  impedanceCourantLimit,
  type ImpedanceBoundary,
} from './impedance';
import {
  applyAllInterfaceForcing,
  findInterfaces,
  type GlobalField,
  type PartitionInterface,
} from './interface';
import {
  Axis,
  spatialRank,
  transverseAxes,
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
  /**
   * How many steps to run. Mutually exclusive with {@link duration}.
   *
   * Prefer `duration` from calling code: `dt` is not known until the wall
   * slabs have been planned and the CFL clamp applied, so a caller that
   * computes `steps` from its *requested* Courant number asks for the wrong
   * number of steps whenever the clamp bites — quietly producing a shorter
   * impulse response than it meant to.
   */
  steps?: number;
  /** Seconds of simulated time. Mutually exclusive with {@link steps}. */
  duration?: number;
  /** Air attenuation in nepers per metre. 0 disables it. */
  airAbsNepersPerMetre?: number;
  /** Absorption coefficient per surface index; -1 means no surface recorded. */
  absorptionFor?: (surfaceIndex: number) => number;
  /** Build absorbing boundaries. Off gives rigid surfaces — useful for modal tests. */
  walls?: boolean;
  /**
   * How a room surface absorbs.
   *
   * `'impedance'` (the default) puts a locally-reacting impedance boundary on
   * the face itself: no added cells, no calibration, a time step clamped to
   * `0.55 − 0.05α` rather than to 0.446, and measurably closer to the requested
   * absorption coefficient than the alternative — see `impedance.ts`. `'pml'`
   * is the original graded-sigma slab outside the face, which needs
   * `padCells >= wallThickness + 1` on the grid and costs 2-5x the room in
   * cells.
   *
   * `wallThickness` applies only to `'pml'`.
   */
  boundary?: 'impedance' | 'pml';
  /**
   * Highest frequency the run carries, in Hz. Optional, and used only to warn
   * when the grid is too coarse for the boundary model to deliver the
   * absorption it was asked for.
   */
  fMax?: number;
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
  readonly impedancePlan: ImpedancePlan;
  /**
   * Cells in room partitions, cells added by wall slabs, and face cells
   * carrying an impedance boundary.
   *
   * `room` and `walls` are stepped every time step; `boundary` is not. An
   * impedance boundary is a forcing term on cells `room` already counts, so it
   * adds nothing to the simulated total — which is the entire point of it, and
   * why it is reported separately rather than folded in.
   */
  readonly cellCount: { room: number; walls: number; boundary: number };
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

/** What {@link planArdTimeStep} settles, ahead of building anything. */
export interface ArdTimeStepPlan {
  /** Time step in seconds. */
  dt: number;
  /** Courant number actually used, at or below the one requested. */
  courant: number;
  /** Steps the run will take, whether `steps` or `duration` was given. */
  steps: number;
  /** Axes of the grid with extent above 1. */
  gridRank: number;
  wallPlan: WallPlan;
  impedancePlan: ImpedancePlan;
  warnings: string[];
}

/**
 * What the time step will be, and where the wall slabs go, without building
 * anything.
 *
 * Split out of {@link createArdSimulation} because a caller often needs `dt`
 * *before* it can finish assembling the configuration — the driving pulse has
 * to be sampled at the simulation's own rate, and `dt` is not settled until the
 * wall slabs have been planned and the CFL clamp applied. Constructing a
 * throwaway simulation to read `dt` off it would work and would cost a full set
 * of PML calibration curves, about a second each.
 *
 * It is also what a caller needs to hand a configuration to
 * `ard.worker.ts`: the worker builds the simulation on the far side of a
 * structured clone, so the pulse must already be in the message.
 *
 * All of the configuration's validation happens here, so calling this first
 * does not defer any error.
 */
export function planArdTimeStep(
  config: Omit<ArdSimulationConfig, 'sources' | 'receivers'> &
    Partial<Pick<ArdSimulationConfig, 'sources' | 'receivers'>>,
): ArdTimeStepPlan {
  const {
    grid,
    decomposition,
    c,
    courant: requestedCourant = 0.4,
    steps: requestedSteps,
    duration,
    absorptionFor = () => 0,
    walls = true,
    wallThickness = DEFAULT_WALL_THICKNESS,
    boundary = 'impedance',
    fMax,
  } = config;

  const warnings: string[] = [];
  const dx = grid.dx;

  if (!(c > 0)) throw new Error(`Speed of sound must be positive, got ${c}`);
  if ((requestedSteps === undefined) === (duration === undefined)) {
    throw new Error('Pass exactly one of steps or duration');
  }
  if (requestedSteps !== undefined && (!Number.isInteger(requestedSteps) || requestedSteps < 1)) {
    throw new Error(`steps must be a positive integer, got ${requestedSteps}`);
  }
  if (duration !== undefined && !(duration > 0)) {
    throw new Error(`duration must be positive, got ${duration}`);
  }
  if (decomposition.boxes.length === 0) {
    throw new Error('Decomposition has no boxes; there is nothing to simulate');
  }

  // --- Boundaries ------------------------------------------------------------
  // Planned before the time step, because whether any PML slab is actually
  // placed is what decides the CFL limit below. Neither planner needs dt, so
  // the order costs nothing. Doing it the other way round clamps the Courant
  // number for a room that turns out to have no slabs at all — every surface
  // rigid, every face dropped — which is a 12% tax for a constraint that does
  // not exist.
  const usePml = boundary === 'pml';
  if (boundary !== 'pml' && boundary !== 'impedance') {
    throw new Error(`Unknown boundary ${String(boundary)}; expected 'impedance' or 'pml'`);
  }

  const wallPlan: WallPlan =
    walls && usePml
      ? planWalls(grid, decomposition, { maxThickness: wallThickness, absorptionFor })
      : { faces: [], warnings: [], slabCells: 0, droppedForSpace: 0, skippedRigid: 0 };
  warnings.push(...wallPlan.warnings);

  const impedancePlan: ImpedancePlan =
    walls && !usePml
      ? planImpedanceBoundaries(grid, decomposition, { absorptionFor })
      : { faces: [], warnings: [], boundaryCells: 0, skippedRigid: 0, maxAbsorption: 0 };
  warnings.push(...impedancePlan.warnings);

  if (walls && usePml && wallPlan.faces.length === 0 && wallPlan.droppedForSpace > 0) {
    // Not a warning. A caller that asked for absorbing walls and got a sealed
    // rigid box gets a reverberation time set by nothing but air attenuation,
    // and the number looks plausible enough to publish. The cause is almost
    // always the same one thing, so say it.
    throw new Error(
      `Walls were requested but all ${wallPlan.droppedForSpace} faces were dropped for lack ` +
        'of solid to grow into, so every room surface would be perfectly rigid. Voxelize ' +
        `with padCells >= ${padCellsForWalls(wallThickness)} (currently the grid has too ` +
        "few), pass boundary: 'impedance' (which needs no padding at all), or pass " +
        'walls: false if a rigid room is what you meant.',
    );
  }
  // Anyone running the slab path should be told what it costs in accuracy, not
  // just in cells. The corner gap is not a refinement: it leaves twelve edges
  // and eight corners of the room reflecting, and `rt60-cross-check.spec.ts`
  // measures the resulting reverberation time 4.7x longer than Eyring at two
  // absorption coefficients. This reaches the user whether they chose 'pml'
  // deliberately or inherited it from a project saved before the impedance
  // boundary existed.
  if (wallPlan.faces.length > 0) {
    warnings.push(
      'Using PML wall slabs. Slabs are clipped to their own face so no cell is inside ' +
        'two, which leaves the room\'s twelve edges and eight corners reflecting — ' +
        'measured as a reverberation time about 4.7x longer than Eyring predicts on a ' +
        "3D shoebox. Prefer boundary: 'impedance', which has no corner to leave.",
    );
  }

  if (walls && usePml && wallPlan.faces.length === 0) {
    // The other way to get no slabs: every material is perfectly reflective.
    // That is the caller's choice, faithfully carried out.
    warnings.push(
      `No wall slabs were built: all ${wallPlan.skippedRigid} faces have materials that ` +
        'absorb nothing, so every surface is rigid. The simulation runs without the PML ' +
        'CFL limit as a result.',
    );
  }

  // The impedance mapping is measured accurate to about 0.01 in alpha down to
  // four cells per wavelength and falls off below it — at ARD's own default of
  // 2.6 a requested 0.3 is delivered as 0.12 in the top octave. Warn rather
  // than override: run cost goes as roughly the fourth power of this number.
  if (impedancePlan.faces.length > 0 && fMax !== undefined && fMax > 0) {
    const cellsPerWavelength = c / (fMax * dx);
    if (cellsPerWavelength < ARD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE) {
      warnings.push(
        `The grid carries ${cellsPerWavelength.toFixed(1)} cells per wavelength at ` +
          `${fMax} Hz, below the ${ARD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE} an impedance ` +
          'boundary needs to deliver the absorption it was asked for. Surfaces will be ' +
          'more reflective than their materials in the top octave of the run. Raise ' +
          'cellsPerWavelength, or lower fMax.',
      );
    }
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
  // An impedance boundary does not step, but its residual is feedback from the
  // field onto itself and diverges past a measured limit that depends on how
  // absorbing the most absorbing surface is. Above the PML's 0.446 at every
  // absorption coefficient, so this loosens the clamp rather than removing it.
  const impedanceLimit =
    impedancePlan.faces.length > 0
      ? impedanceCourantLimit(impedancePlan.maxAbsorption)
      : Infinity;
  const courant = Math.min(requestedCourant, wallLimit, fdtdLimit, impedanceLimit);
  if (courant < requestedCourant) {
    const cause =
      courant === impedanceLimit
        ? `impedance boundaries at alpha up to ${impedancePlan.maxAbsorption.toFixed(2)} are ` +
          'stable to here and no further'
        : `the ${wallLimit <= fdtdLimit ? 'wall slabs' : 'FDTD partitions'} are rank ` +
          `${gridRank} and cannot run faster`;
    warnings.push(
      `Courant reduced from ${requestedCourant} to ${courant.toFixed(3)}: ${cause}. ` +
        'DCT interiors have no such limit, but every partition shares a time step.',
    );
  }
  const dt = (courant * dx) / c;
  // Resolved here, not above, because `dt` is only known once the clamp has
  // been applied — which is the whole reason `duration` exists.
  const steps = requestedSteps ?? Math.max(1, Math.ceil((duration as number) / dt));

  return { dt, courant, steps, gridRank, wallPlan, impedancePlan, warnings };
}

export function createArdSimulation(config: ArdSimulationConfig): ArdSimulation {
  const {
    grid,
    decomposition,
    c,
    sources,
    receivers,
    airAbsNepersPerMetre = 0,
    absorptionFor = () => 0,
    frameInterval = 0,
    sliceAxis = 'z',
    sliceIndex,
  } = config;

  const dx = grid.dx;
  // Validation, the wall plan and the CFL clamp all live in the planner, so
  // that a caller who needs `dt` up front gets exactly the same answer.
  const plan = planArdTimeStep(config);
  const { dt, courant, steps, wallPlan, impedancePlan } = plan;
  const warnings = [...plan.warnings];

  // --- Partitions ------------------------------------------------------------
  // The grid's axes, not each box's: a box one cell thick in a 3D room still
  // carries that axis's Laplacian (#228). Only a collapsed grid axis — a 2D
  // slice — drops it.
  const activeAxes = [grid.nx > 1, grid.ny > 1, grid.nz > 1] as const;
  const roomPartitions: Partition[] = decomposition.boxes.map((box, n) =>
    decomposition.kinds[n] === 'dct'
      ? new DctPartition({ box, dx, c, dt, activeAxes })
      : new FdtdPartition({ box, dx, c, dt, activeAxes }),
  );

  let wallPartitions: Partition[] = [];
  if (wallPlan.faces.length > 0) {
    const built = buildWalls(wallPlan, { dx, c, dt, absorptionFor, activeAxes });
    wallPartitions = built.partitions;
    warnings.push(...built.warnings);
  }

  const partitions: Partition[] = [...roomPartitions, ...wallPartitions];
  const interfaces = findInterfaces(partitions);

  // The room's pressure by global cell, for interface taps that reach past a
  // neighbour thinner than the stencil (#228). Room partitions only: a wall
  // slab is at least INTERFACE_DEPTH thick, so nothing reads past one.
  const field: GlobalField = {
    pressureAt(i, j, k) {
      if (i < 0 || j < 0 || k < 0 || i >= grid.nx || j >= grid.ny || k >= grid.nz) return null;
      const idx = i + grid.nx * (j + grid.ny * k);
      if (grid.cells[idx] !== Cell.Air) return null;
      const boxIndex = decomposition.assignment[idx];
      if (boxIndex < 0) return null;
      const owner = roomPartitions[boxIndex];
      return owner.pressureAt(i - owner.box.x, j - owner.box.y, k - owner.box.z);
    },
  };

  // Impedance boundaries attach to the room partitions, indexed by box, and
  // never to a wall slab: the two boundary kinds are alternatives, and
  // `planArdTimeStep` only ever returns one non-empty plan.
  let boundaries: ImpedanceBoundary[] = [];
  if (impedancePlan.faces.length > 0) {
    const built = buildImpedanceBoundaries(impedancePlan, roomPartitions, { absorptionFor, field });
    boundaries = built.boundaries;
    warnings.push(...built.warnings);
  }

  // Every FDTD face nothing else covers gets a rigid boundary: an FDTD
  // partition reads zero past its array, which is pressure release, not the
  // rigid wall a DCT partition's mirror gives for free (#228).
  const covered = new Set<string>();
  for (const face of impedancePlan.faces) covered.add(faceKey(face.boxIndex, face.axis, face.high, face));
  for (const face of wallPlan.faces) {
    const [uAxis, vAxis] = transverseAxes(face.axis);
    const origin = [face.box.x, face.box.y, face.box.z];
    const extent = [face.box.w, face.box.h, face.box.d];
    covered.add(
      faceKey(face.boxIndex, face.axis, face.high, {
        uMin: origin[uAxis],
        uMax: origin[uAxis] + extent[uAxis],
        vMin: origin[vAxis],
        vMax: origin[vAxis] + extent[vAxis],
      }),
    );
  }
  boundaries.push(...buildRigidFdtdBoundaries(grid, decomposition, roomPartitions, covered, field));

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
    impedancePlan,
    cellCount: {
      room: roomCells,
      walls: wallCells,
      boundary: boundaries.reduce((t, b) => t + b.cellCount, 0),
    },
    warnings,
    get currentStep() {
      return currentStep;
    },

    step(): ArdStepResult {
      applyAllInterfaceForcing(interfaces, c, dx, field);
      applyAllImpedanceForcing(boundaries);

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
      // The filter state is history, not geometry: a boundary reused after
      // dispose must start from rest or it would inject the tail of the last
      // run into the first steps of the next.
      for (const boundary of boundaries) boundary.reset();
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
