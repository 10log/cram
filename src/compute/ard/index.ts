/**
 * The ARD solver — Phase 7 of the ARD solver plan (docs/ard-solver-plan.md).
 *
 * Everything the earlier phases built is machinery; this is the part CRAM sees.
 * It resolves a room, sources and receivers from the stores, derives a grid
 * from the requested upper frequency, runs the simulation (in a worker when
 * there is one), deconvolves the driving pulse back out, calibrates the level,
 * resamples to an audio rate, and emits an impulse response and an energy decay
 * curve per source–receiver pair.
 *
 * Modelled on `src/compute/radiance/art.ts` for its store access, save/restore
 * shape and event wiring.
 *
 * ## What the user is actually choosing when they set `fMax`
 *
 * `fMax` is not a filter setting, it is the cost dial. The grid is
 * `Δx = c/(n·fMax)`, so cell count goes as `fMax³` and the step count goes as
 * `fMax` again: **the run is `O(fMax⁴)`**. Doubling 1 kHz to 2 kHz is sixteen
 * times the work. The UI (Phase 8) is expected to show `estimatedCellCount` and
 * `estimatedSteps` next to the run button for exactly this reason.
 *
 * The result is band-limited to roughly `1.3·fMax` however it is written out —
 * see `resample.ts`. It is written at an audio rate so it can be convolved and
 * compared alongside CRAM's other impulse responses, not because there is
 * anything up there.
 *
 * ## One run per source, and optionally per band
 *
 * A single simulation can carry several sources at once, but then every
 * receiver records their sum and no per-pair impulse response can be recovered.
 * So there is one run per source. With `perBandRuns` there is one run per
 * source *per octave band*, because ARD's boundary treatment is
 * frequency-independent by construction (plan D3): the only way to honour a
 * material's octave-band absorption is to run the simulation once per band with
 * that band's `alpha` and add the filtered results. The band windows sum to
 * exactly one, so a room whose materials happen to be flat gives the same
 * answer either way — which is the test that says the two paths agree.
 *
 * Cost is `sources × bands` runs. At seven bands that is seven times a run
 * already measured in seconds to minutes, which is why it is off by default.
 *
 * ## What the numbers in the impulse response mean
 *
 * An arrival's **sum** is its pressure in pascals: a free-field direct arrival
 * at `r` metres from a source of `initialSPL` sums to `Lp2P(initialSPL)/r`.
 * Equivalently, the result's spectrum is flat at that value across the band,
 * which is the rate-independent way to say it and the way the tests check it.
 *
 * That is the same convention the ray tracer uses, where a single arrival is
 * one sample holding its own pressure — sum and peak coincide there because the
 * arrival is a bare delta. Here it is band-limited, so the energy is spread
 * over several samples and the peak is lower than the pressure by a factor that
 * depends on `fMax`. Reading the peak of an ARD impulse response as "the level
 * of that reflection" is therefore wrong, and increasingly wrong the lower
 * `fMax` is set.
 *
 * ## Two dimensions is a different room, not a cheaper one
 *
 * `dimensions: 2` runs on a plane through the room — the floor plan by
 * default. It is the only mode that reaches 4 kHz on anything but a cupboard
 * (plan §5), because collapsing an axis removes a whole cross-section of cells
 * rather than a third of them.
 *
 * What it computes is the response of a room that is **uniform and unbounded
 * along the collapsed axis**. Not a horizontal slice of this room's field: a
 * different room, whose sound spreads as `1/sqrt(r)` instead of `1/r` and which
 * has no modes across the missing axis at all. The level calibration is a
 * spectral tilt rather than a constant for that reason (`deconvolve.ts`), the
 * results are named `IR [2D xz]` so they cannot be read as comparable to the
 * 3D ones, and the run pushes a warning saying the same thing in words.
 *
 * Useful for wavefronts and early reflections in plan. Not for a reverberation
 * time.
 *
 * ## What this does not do
 *
 * **Source directivity is not applied.** Plan D4 said it would be, following
 * the geometric solvers, and that turns out not to port: a ray carries its own
 * launch direction, so a geometric solver can weight each one by
 * `Q(θ, φ, f)`. A wave solver injects forcing into a single cell, which is a
 * monopole — it has no direction to weight. Scaling the whole impulse response
 * by the on-axis gain toward the receiver would be right for the direct sound
 * and wrong for every reflection, which arrive from other directions entirely.
 * Directivity needs a multipole or an array of driven cells with per-cell
 * delays; that is a real piece of work and it is not this phase. Sources are
 * therefore omnidirectional here, and `source.directivityHandler` is ignored.
 */

import { v4 as makeUuid } from 'uuid';

import { emit, on } from '../../messenger';
import Room from '../../objects/room';
import type Receiver from '../../objects/receiver';
import type Source from '../../objects/source';
import type Surface from '../../objects/surface';
import { addSolver, removeSolver, setSolverProperty, useContainer, useResult } from '../../store';
import { ResultKind, type Result } from '../../store/result-store';
import { Lp2P } from '../acoustics/convert';
import { airAbsDbToPressureNepers, airAttenuation } from '../acoustics/air-attenuation';
import { soundSpeed } from '../acoustics/sound-speed';
import { schroederBackwardsIntegration } from '../schroeder';
import Solver, { type SolverParams } from '../solver';

import { decompose } from './decompose';
import {
  calibration2D,
  calibrationScale,
  deconvolvePulse,
  deconvolveTransformLength,
  octaveBandWindows,
} from './deconvolve';
import { resample } from './resample';
import {
  bandlimitedPulse,
  createArdSimulation,
  planArdTimeStep,
  type ArdSimulationConfig,
} from './simulation';
import type { ArdWorkerRequest, ArdWorkerResponse } from './ard.worker';
import { Vector3 } from 'three';
import {
  collapsedAxis,
  layerForCoordinate,
  sliceGrid,
  sliceHasAir,
  widestLayer,
  type ArdSlice,
} from './grid-slice';
import { Cell, cellSizeFor, nearestCell, worldToCell, type VoxelGrid } from './voxelize';
import { voxelizeRoom } from './voxelize-room';
import { DEFAULT_WALL_THICKNESS, padCellsForWalls } from './walls-from-grid';
import { createArdWorker } from './worker-host';
import { impedanceCourantLimit } from './impedance';
import { PML_CFL_MARGIN } from './pml-partition';
import { vonNeumannCflLimit } from './partition';

// Imported last, as `art.ts` does, to keep the store's circular dependency on
// solver modules from biting at module-evaluation time.
import { useSolver } from '../../store';

/** Octave bands the per-band path runs. 125 Hz to 8 kHz, as `ART` uses. */
export const ARD_BAND_CENTRES = [125, 250, 500, 1000, 2000, 4000, 8000] as const;

/**
 * Band whose absorption a single broadband run uses (plan D3).
 *
 * 500 Hz is the usual mid-band stand-in and the one most published `alpha`
 * tables are anchored on.
 */
export const ARD_REFERENCE_FREQUENCY = 500;

/**
 * Throughput used for the pre-run time estimate, in cell-steps per second, per
 * boundary kind.
 *
 * Two figures because the cost *per stepped cell* genuinely differs. A PML slab
 * cell runs an explicit stencil, which is cheap per cell and there are two to
 * five times as many of them; an impedance run has only the room's DCT cells,
 * each dearer, plus a boundary residual on every face cell that this count does
 * not see. So removing the slabs cuts total work by about 3x while changing the
 * average cost of the cells that remain — one constant cannot carry both.
 *
 * Measured on this implementation; see {@link ARD.estimatedSeconds} for the
 * table. Both take the conservative end of their range — a run that finishes
 * sooner than the warning said is a good surprise.
 */
export const ARD_CELL_STEPS_PER_SECOND = {
  impedance: 1.4e6,
  pml: 1.3e6,
} as const;

/** Points kept for the store's chart, matching the ray tracer's convention. */
const MAX_DISPLAY_POINTS = 2000;

/** Steps between yields on the no-worker path. */
const INLINE_CHUNK_STEPS = 256;

export interface ARDProps extends SolverParams {
  roomID?: string;
  sourceIDs?: string[];
  receiverIDs?: string[];
  /** Upper frequency limit in Hz. The cost dial — see the module comment. */
  fMax?: number;
  /**
   * Spatial sampling density at `fMax`.
   *
   * 2.6 is enough for the *interior*, which is ARD's headline property: the
   * modal update is exact per mode, with no numerical dispersion to out-run.
   * It is **not** enough for the boundary. Phase 11 measured the impedance
   * mapping holding to about 0.01 in α down to 4 cells per wavelength and
   * falling off underneath — at 2.6 the top octave sits at 77% of the grid's
   * spatial Nyquist and a requested 0.3 comes back as 0.12, so surfaces are
   * more reflective than their materials there. The PML is worse at the same
   * resolution, so this is a property of the default rather than of the
   * boundary that surfaced it.
   *
   * The default stays 2.6 because cost goes as roughly the fourth power of this
   * number; the driver warns instead, via
   * {@link ARD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE}. Raise it when the
   * absorption matters more than the run time.
   */
  cellsPerWavelength?: number;
  /** Requested Courant number. PML wall slabs may force it lower. */
  courant?: number;
  /**
   * How a room surface absorbs. `'impedance'` (the default) is a boundary
   * condition on the face; `'pml'` is an absorbing slab outside it.
   *
   * The slab costs 2-5x the room in cells, needs the grid padded by
   * `wallThickness + 1` on every side, clamps the Courant number for the whole
   * simulation, and measures further from the requested absorption coefficient
   * at every grid resolution tested. It is kept because it is what Phases 5-9
   * were validated against. See `impedance.ts`.
   */
  boundary?: 'impedance' | 'pml';
  /** Length of the impulse response, in seconds. */
  irLength?: number;
  /** Absorbing layer thickness in cells. `'pml'` only; see `walls-from-grid.ts`. */
  wallThickness?: number;
  /** Run once per octave band instead of once at 500 Hz. Costs 7x. */
  perBandRuns?: boolean;
  /** Output sample rate in Hz. */
  sampleRate?: number;
  /** Relative humidity in %, for air attenuation. */
  humidity?: number;
  /**
   * 3 for the room, 2 for a plane through it. Default 3.
   *
   * A 2D run is not a cheaper approximation of the 3D one — see the class
   * comment. It is the only mode that reaches 4 kHz on a plan (plan §5).
   */
  dimensions?: 2 | 3;
  /** Plane a 2D run lives on: `xz` is the floor plan, `xy` a section. */
  slice?: ArdSlice;
  /**
   * Where to cut, in metres along the collapsed axis. `null` cuts through the
   * first source, which is inside the room by construction.
   */
  sliceCoordinate?: number | null;
}

export type ARDSaveObject = {
  uuid: string;
  name: string;
  kind: string;
  autoCalculate: boolean;
  roomID?: string;
  sourceIDs?: string[];
  receiverIDs?: string[];
  fMax?: number;
  cellsPerWavelength?: number;
  courant?: number;
  irLength?: number;
  wallThickness?: number;
  boundary?: 'impedance' | 'pml';
  perBandRuns?: boolean;
  sampleRate?: number;
  humidity?: number;
  dimensions?: 2 | 3;
  slice?: ArdSlice;
  sliceCoordinate?: number | null;
};

/** What a completed run reports, for the UI and for tests. */
export interface ARDRunSummary {
  /** Cell size in metres. */
  dx: number;
  /** Time step in seconds. */
  dt: number;
  /** Courant number actually used, which may be below the one requested. */
  courant: number;
  gridCells: number;
  airCells: number;
  boxCount: number;
  /** Cells in room partitions, and cells added by absorbing wall slabs. */
  cellCount: { room: number; walls: number; boundary: number };
  steps: number;
  /** Simulation runs performed: sources x bands. */
  runs: number;
  seconds: number;
  warnings: string[];
  /** Full-rate impulse responses, keyed `${sourceId}->${receiverId}`. */
  impulseResponses: Map<string, Float32Array>;
  /**
   * Cells the sources and receivers snapped to, in grid coordinates.
   *
   * Worth exposing rather than hiding: `dx` is `c/(n·fMax)`, which at 500 Hz is
   * 26 cm, so a probe can move up to 13 cm in each axis on its way onto the
   * grid. That is a real change of distance — enough to shift a free-field
   * level by several percent at close range — and it is invisible in the room
   * view, where the marker stays where the user put it.
   */
  sourceCells: [number, number, number][];
  receiverCells: [number, number, number][];
}

const defaults = {
  name: 'Adaptive Rectangular Decomposition',
};

export class ARD extends Solver {
  public uuid: string;
  public roomID: string;
  public sourceIDs: string[];
  public receiverIDs: string[];

  public fMax: number;
  public cellsPerWavelength: number;
  public courant: number;
  public irLength: number;
  public wallThickness: number;
  public boundary: 'impedance' | 'pml';
  public perBandRuns: boolean;
  public sampleRate: number;
  public humidity: number;
  public dimensions: 2 | 3;
  public slice: ArdSlice;
  public sliceCoordinate: number | null;

  /** Progress of the run in flight, 0..1. */
  public progress: number;
  /** Summary of the last completed run, or null. */
  public lastRun: ARDRunSummary | null;
  public hasEmittedResults: boolean;

  /** Set when a run is asked to stop; checked between chunks. */
  private cancelled: boolean;
  /** The worker serving this run, reused across sources and bands. */
  private activeWorker: Worker | null;
  /** False once a worker has proved unusable, so later bands do not retry. */
  private workerUsable: boolean;

  constructor(props: ARDProps = defaults) {
    super(props);
    this.kind = 'ard';
    this.name = props.name || defaults.name;
    this.uuid = makeUuid();

    const rooms = useContainer.getState().getRooms();
    this.roomID = props.roomID || (rooms.length > 0 ? rooms[0].uuid : '');
    this.sourceIDs = props.sourceIDs || [];
    this.receiverIDs = props.receiverIDs || [];

    this.fMax = props.fMax ?? 1000;
    this.cellsPerWavelength = props.cellsPerWavelength ?? 2.6;
    this.courant = props.courant ?? 0.4;
    this.irLength = props.irLength ?? 1;
    this.wallThickness = props.wallThickness ?? DEFAULT_WALL_THICKNESS;
    this.boundary = props.boundary ?? 'impedance';
    this.perBandRuns = props.perBandRuns ?? false;
    this.sampleRate = props.sampleRate ?? 44100;
    this.humidity = props.humidity ?? 40;
    this.dimensions = props.dimensions ?? 3;
    this.slice = props.slice ?? 'xz';
    this.sliceCoordinate = props.sliceCoordinate ?? null;

    this.progress = 0;
    this.lastRun = null;
    this.hasEmittedResults = false;
    this.cancelled = false;
    this.activeWorker = null;
    this.workerUsable = true;
  }

  /**
   * Start a run and return immediately, as the `Solver` contract requires.
   *
   * Await {@link run} instead when the outcome matters — a failure here can
   * only be logged.
   */
  calculate(): void {
    void this.run().catch((error) => {
      console.error(`ARD: ${error instanceof Error ? error.message : String(error)}`);
    });
  }

  /** Stop the run in flight at the next chunk boundary. */
  cancel(): void {
    this.cancelled = true;
    this.activeWorker?.postMessage({ type: 'cancel' } satisfies ArdWorkerRequest);
  }

  async run(): Promise<ARDRunSummary> {
    // Refuse rather than interleave. A second `run()` — a double click on the
    // button, or `CALCULATE_ARD` arriving while one is in flight — would clear
    // `cancelled` and undo a cancel already under way, share `activeWorker` and
    // `progress` with the first, and on the inline path put two time loops into
    // overlapping buffers racing each other's `dispose()`. Phase 6's worker
    // refuses a second `start` for the same reasons; this is the same rule one
    // level up.
    if (this.running) {
      throw new Error(
        'ARD: a run is already in progress. Cancel it and wait for it to stop before starting ' +
          'another.',
      );
    }

    const started = Date.now();
    this.cancelled = false;
    this.running = true;
    this.workerUsable = true;
    this.progress = 0;

    // The app-wide indicator, as the ray tracer drives it. `ARD_PROGRESS`
    // carries the same number for anything that wants it per solver; this is
    // what actually appears on screen, and a wave solve is long enough that
    // running without one reads as a hang.
    emit('SHOW_PROGRESS', {
      message: `Running ${this.name}…`,
      progress: 0,
      solverUuid: this.uuid,
    });

    try {
      return await this.execute(started);
    } finally {
      this.releaseWorker();
      this.running = false;
      // A cancelled or failed run leaves `progress` part-way, and nothing else
      // will ever move it. Anything keyed on "0 < progress < 1 means running"
      // then latches on for good — including the solver card, which disables
      // its Calculate button while calculating and so cannot start the run
      // that would have cleared it. Zero, not one: the run did not finish.
      if (this.progress > 0 && this.progress < 1) {
        this.progress = 0;
        emit('ARD_PROGRESS', { uuid: this.uuid, progress: 0 });
      }
      emit('HIDE_PROGRESS', undefined);
    }
  }

  private async execute(started: number): Promise<ARDRunSummary> {
    const room = this.room;
    if (!room) throw new Error('ARD: no room selected');

    const containers = useContainer.getState().containers;
    const sources = this.sourceIDs
      .map((id) => containers[id])
      .filter((container): container is Source => container?.kind === 'source');
    const receivers = this.receiverIDs
      .map((id) => containers[id])
      .filter((container): container is Receiver => container?.kind === 'receiver');

    if (sources.length === 0 || receivers.length === 0) {
      throw new Error('ARD: need at least one source and one receiver');
    }

    const c = soundSpeed(this.temperature);
    const dx = cellSizeFor(this.fMax, c, this.cellsPerWavelength);

    // Seed the flood fill from a source rather than from the vertex centroid.
    // A source is by construction a point the user believes is inside the room,
    // and the centroid of an L-shaped or a concave room is not.
    const seed = worldPosition(sources[0]);
    const { grid: volumeGrid, surfaces } = voxelizeRoom(room, {
      dx,
      seed,
      padCells: this.padCells,
    });
    if (volumeGrid.leaked) {
      throw new Error(
        'ARD: the room does not enclose a volume — the flood fill reached the outside of the ' +
          'grid. Close the geometry, or check that the first source is inside the room.',
      );
    }

    const warnings = [...volumeGrid.warnings];
    // A 2D run is one plane of the same voxelization the 3D run would use, so
    // the two modes cannot disagree about where the room is. See
    // `grid-slice.ts` for what that costs and why it is worth it.
    const grid = this.dimensions === 2 ? this.takeSlice(volumeGrid, seed, warnings) : volumeGrid;
    if (grid.airCount === 0) {
      throw new Error(
        'ARD: the chosen slice plane contains no room air. Move it inside the room, or run ' +
          'in three dimensions.',
      );
    }

    const decomposition = decompose(grid);
    const isRoomAir = (index: number) =>
      grid.cells[index] === Cell.Air && decomposition.assignment[index] >= 0;

    // In 2D every probe lives on the cut, whatever height it was placed at.
    // `worldToCell` rounds and bounds-checks, so on a grid one cell deep a
    // point more than half a cell off the plane resolves to `null` and the run
    // dies with "outside the voxel grid" — 17 cm at `fMax` 400, which is an
    // ordinary difference between a source height and a listener height. There
    // is no third coordinate in a 2D run to preserve, so projecting is not an
    // approximation of anything; it is what the mode means.
    let furthestProjection = 0;
    const onPlane = (point: { x: number; y: number; z: number }) => {
      if (this.dimensions !== 2) return point;
      const axis = collapsedAxis(this.slice);
      const planeAt = axis === 1 ? grid.origin.y : grid.origin.z;
      const was = axis === 1 ? point.y : point.z;
      furthestProjection = Math.max(furthestProjection, Math.abs(was - planeAt));
      return axis === 1 ? { ...point, y: planeAt } : { ...point, z: planeAt };
    };

    const sourceCells = sources.map((source, n) =>
      resolveCell(
        grid,
        onPlane(worldPosition(source)),
        `Source ${source.name || n}`,
        isRoomAir,
        warnings,
      ),
    );
    const receiverCells = receivers.map((receiver, n) =>
      resolveCell(
        grid,
        onPlane(worldPosition(receiver)),
        `Receiver ${receiver.name || n}`,
        isRoomAir,
        warnings,
      ),
    );
    if (furthestProjection > grid.dx) {
      // Silent projection is fine for the half-cell rounding every probe gets
      // anyway. A probe a metre off the cut is a different matter: the run will
      // answer about a position the user can see is not where they put it.
      warnings.push(
        `Sources and receivers are projected onto the 2D cut; the furthest moved ` +
          `${furthestProjection.toFixed(2)} m. A 2D run has no coordinate off the plane, so a ` +
          'probe placed well away from it answers about somewhere else.',
      );
    }

    const bands = this.bands;
    const totalRuns = sources.length * bands.length;

    // --- One time step for every band ----------------------------------------
    // Planned once, from the union of the faces any band would build, and then
    // forced on each run by passing the resolved Courant number rather than the
    // requested one.
    //
    // Doing it per band is a trap. A band whose materials are all rigid builds
    // no PML slabs, which lifts the CFL clamp and gives that band a larger `dt`
    // and a shorter record than its neighbours — while `emitResults`
    // deconvolves every band against one pulse at one rate. At the default
    // Courant 0.4 the clamp never bites and the bug is invisible; at the plan's
    // original 0.5 it is immediate.
    const unionAbsorption = surfaces.map((surface) =>
      Math.max(...bands.map((frequency) => clampAlpha(surface.absorptionFunction(frequency)))),
    );
    const plan = planArdTimeStep({
      grid,
      decomposition,
      c,
      courant: this.courant,
      duration: this.irLength,
      wallThickness: this.wallThickness,
      boundary: this.boundary,
      fMax: this.fMax,
      absorptionFor: (index) => (index >= 0 && index < surfaces.length ? unionAbsorption[index] : 0),
    });
    const pulse = bandlimitedPulse(plan.steps, plan.dt, this.fMax);

    // `records[sourceIndex][bandIndex][receiverIndex]` — the raw pulse
    // responses, before any deconvolution.
    const records: Float32Array[][][] = [];
    let summaryCourant = plan.courant;
    let summaryCells = { room: 0, walls: 0, boundary: 0 };
    let runIndex = 0;

    for (let s = 0; s < sources.length; s++) {
      const perBand: Float32Array[][] = [];
      for (let b = 0; b < bands.length; b++) {
        if (this.cancelled) throw new Error('ARD: run cancelled');

        const frequency = bands[b];
        const airAbs = airAbsDbToPressureNepers(
          airAttenuation([frequency], this.temperature, this.humidity)[0],
        );

        const config: ArdSimulationConfig = {
          grid,
          decomposition,
          c,
          // The resolved Courant number, not the requested one. Every band's
          // own limit is at or above this — the plan used the union of faces,
          // which is the most constrained case — so `min` leaves it alone and
          // all bands share one `dt`.
          courant: plan.courant,
          steps: plan.steps,
          sources: [{ cell: sourceCells[s], signal: pulse }],
          receivers: receiverCells.map((cell) => ({ cell })),
          airAbsNepersPerMetre: airAbs,
          wallThickness: this.wallThickness,
          boundary: this.boundary,
          fMax: this.fMax,
        };

        const bandLabel = bands.length > 1 ? ` ${frequency} Hz band,` : '';
        const result = await this.runOne(config, frequency, surfaces, (fraction) => {
          this.progress = (runIndex + fraction) / totalRuns;
          emit('ARD_PROGRESS', { uuid: this.uuid, progress: this.progress });
          emit('UPDATE_PROGRESS', {
            progress: Math.round(this.progress * 100),
            message:
              `${this.name}:${bandLabel} source ${s + 1} of ${sources.length} — ` +
              `${Math.round(fraction * 100)}%`,
          });
        });

        summaryCourant = result.courant;
        summaryCells = result.cellCount;
        for (const warning of result.warnings) {
          if (!warnings.includes(warning)) warnings.push(warning);
        }
        perBand.push(result.irs);
        runIndex++;
      }
      records.push(perBand);
    }

    const impulseResponses = this.emitResults({
      sources,
      receivers,
      records,
      bands,
      pulse,
      dt: plan.dt,
      dx,
      c,
    });

    const summary: ARDRunSummary = {
      dx,
      dt: plan.dt,
      courant: summaryCourant,
      gridCells: grid.nx * grid.ny * grid.nz,
      airCells: grid.airCount,
      boxCount: decomposition.boxes.length,
      cellCount: summaryCells,
      steps: plan.steps,
      runs: totalRuns,
      seconds: (Date.now() - started) / 1000,
      warnings,
      impulseResponses,
      sourceCells,
      receiverCells,
    };
    this.lastRun = summary;
    this.progress = 1;
    emit('ARD_PROGRESS', { uuid: this.uuid, progress: 1 });
    return summary;
  }

  /**
   * The plane a 2D run lives on, cut out of the room's full voxelization.
   *
   * Defaults to the plane through the **first source**, which is inside the
   * room by construction because it seeded the flood fill — unlike the middle
   * of the bounding box, and unlike the widest layer on a building with more
   * than one storey. A height given by the user wins over that.
   *
   * Either way the chosen plane is checked for air, and the widest layer is the
   * fallback when it has none. Clamping a height into the grid is not enough on
   * its own: the outermost layers are the padding the wall slabs grow into, so
   * a height above the ceiling clamps to solid.
   */
  private takeSlice(grid: VoxelGrid, seed: { x: number; y: number; z: number }, warnings: string[]) {
    const axis = collapsedAxis(this.slice);
    const axisName = axis === 1 ? ('y' as const) : ('z' as const);

    // Where to cut, and what to do when that plane has no room in it. Clamping
    // into the *grid* is not enough: the outermost layers are the padding the
    // wall slabs grow into, so a height above the ceiling clamps to a layer
    // that is entirely solid. The fallback is the widest layer, and the user
    // is told which plane was used rather than left with an error about a
    // slider that went too far.
    const requested =
      this.sliceCoordinate === null
        ? // No height given: cut through the first source. It is inside the
          // room by construction — it seeded the fill — which the widest layer
          // need not be on a building with more than one storey.
          (axis === 1 ? seed.y : seed.z)
        : this.sliceCoordinate;
    const chosen = layerForCoordinate(grid, axis, requested);
    let layer = chosen.index;
    if (chosen.clamped && sliceHasAir(grid, axis, layer)) {
      // Clamped but still in the room — a tight room or a coarse grid. The
      // plane moved and the result is usable, so say where it went rather than
      // letting the only voice on this be the no-air path below.
      const used = grid.origin[axisName] + layer * grid.dx;
      warnings.push(
        `The 2D slice at ${axisName} = ${requested.toFixed(2)} m is outside the grid and was ` +
          `clamped to ${axisName} = ${used.toFixed(2)} m.`,
      );
    }
    if (!sliceHasAir(grid, axis, layer)) {
      layer = widestLayer(grid, axis);
      warnings.push(
        `The 2D slice at ${axisName} = ${requested.toFixed(2)} m contains no room air — it is ` +
          `outside the room, or in its padding. Cut at the widest plane instead.`,
      );
    }

    const plane = sliceGrid(grid, axis, layer);
    const height = axis === 1 ? plane.origin.y : plane.origin.z;
    warnings.push(
      `Running in two dimensions on the ${this.slice} plane at ${axisName} = ` +
        `${height.toFixed(2)} m. A 2D result is the response of a room that is uniform and ` +
        'unbounded along the collapsed axis, not of this room — sound spreads as 1/sqrt(r) ' +
        'and there are no modes across that axis at all. Use it to see wavefronts in plan, ' +
        'not to read a reverberation time.',
    );
    return plane;
  }

  /** One simulation: one source, one band. */
  private async runOne(
    config: ArdSimulationConfig,
    frequency: number,
    surfaces: Surface[],
    onProgress: (fraction: number) => void,
  ): Promise<{
    irs: Float32Array[];
    courant: number;
    cellCount: { room: number; walls: number; boundary: number };
    warnings: string[];
  }> {
    // One alpha per surface index, which is both what the partitions need and
    // what crosses a structured clone — a function does not.
    const absorption = surfaces.map((surface) =>
      clampAlpha(surface.absorptionFunction(frequency)),
    );
    const absorptionFor = (surfaceIndex: number) =>
      surfaceIndex >= 0 && surfaceIndex < absorption.length ? absorption[surfaceIndex] : 0;

    return this.stepSimulation({ ...config, absorptionFor }, absorption, absorptionFor, onProgress);
  }

  /**
   * Run the time loop, in a worker where there is one.
   *
   * The worker is not about parallelism — it is one worker stepping partitions
   * sequentially, exactly as this thread would. It is about not blocking: the
   * loop runs for seconds to minutes (plan §5, D2), which on the main thread
   * freezes the editor and stalls the render loop for its whole duration.
   *
   * ## Falling back, once, and only for a worker that never started
   *
   * Two failures look the same from here and must not be treated the same.
   *
   * A worker that **never produced anything** — construction refused, module
   * type unsupported, wrong MIME on the script — has done no work, so running
   * the loop inline loses nothing but the non-blocking. That fallback is taken
   * once, and {@link workerUsable} is cleared so the remaining bands go
   * straight inline instead of each paying the same failed construction.
   *
   * A worker that **died mid-run**, after posting progress, is a different
   * animal. Re-running the whole time loop on the main thread there is exactly
   * the minutes-long freeze the worker exists to avoid, for a run the UI has
   * already shown progress for and which would now restart from zero. That
   * rejects.
   *
   * One worker serves the whole `run()`, not one per band: with `perBandRuns`
   * that was seven constructions per source.
   */
  private stepSimulation(
    config: ArdSimulationConfig,
    absorption: number[],
    absorptionFor: (surfaceIndex: number) => number,
    onProgress: (fraction: number) => void,
  ): Promise<{
    irs: Float32Array[];
    dt: number;
    courant: number;
    cellCount: { room: number; walls: number; boundary: number };
    warnings: string[];
  }> {
    const worker = this.workerUsable ? this.acquireWorker() : null;
    if (!worker) return this.stepInline(config, absorptionFor, onProgress);

    return new Promise((resolve, reject) => {
      let started = false;
      let settled = false;

      const settle = (action: () => void) => {
        if (settled) return;
        settled = true;
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);
        action();
      };

      const onMessage = (event: MessageEvent<ArdWorkerResponse>) => {
        const message = event.data;
        switch (message.type) {
          case 'progress':
            started = true;
            onProgress((message.step + 1) / message.total);
            if (this.cancelled) worker.postMessage({ type: 'cancel' } satisfies ArdWorkerRequest);
            break;
          case 'done':
            settle(() =>
              resolve({
                irs: message.irs,
                dt: message.dt,
                courant: message.courant,
                cellCount: message.cellCount,
                warnings: message.warnings,
              }),
            );
            break;
          case 'cancelled':
            settle(() => reject(new Error('ARD: run cancelled')));
            break;
          case 'error':
            // A reported error is the worker working: it caught the throw and
            // told us. Nothing to retry — the same config fails the same way
            // inline.
            settle(() => reject(new Error(message.message)));
            break;
        }
      };

      const onError = (event: ErrorEvent) => {
        settle(() => {
          this.releaseWorker();
          if (started) {
            reject(
              new Error(
                `ARD: the simulation worker died mid-run (${
                  event.message || 'no message'
                }). Not restarting the time loop on the main thread — it would freeze the ` +
                  'editor for as long as the run has already taken.',
              ),
            );
            return;
          }
          // Never started, so nothing is lost by running it here, and the
          // remaining bands skip the worker entirely.
          this.workerUsable = false;
          this.stepInline(config, absorptionFor, onProgress).then(resolve, reject);
        });
      };

      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', onError);

      // `absorptionFor` is a function and functions do not survive a
      // structured clone. The worker rebuilds it from `absorption`.
      const { absorptionFor: _unused, ...cloneable } = config;
      worker.postMessage({ type: 'start', config: cloneable, absorption } satisfies ArdWorkerRequest);
    });
  }

  /** The worker for this run, constructed on first use. */
  private acquireWorker(): Worker | null {
    if (this.activeWorker) return this.activeWorker;
    this.activeWorker = createArdWorker();
    if (!this.activeWorker) this.workerUsable = false;
    return this.activeWorker;
  }

  private releaseWorker(): void {
    this.activeWorker?.terminate();
    this.activeWorker = null;
  }

  /** The time loop on this thread, chunked so a cancel can get in. */
  private async stepInline(
    config: ArdSimulationConfig,
    absorptionFor: (surfaceIndex: number) => number,
    onProgress: (fraction: number) => void,
  ): Promise<{
    irs: Float32Array[];
    dt: number;
    courant: number;
    cellCount: { room: number; walls: number; boundary: number };
    warnings: string[];
  }> {
    const simulation = createArdSimulation({ ...config, absorptionFor });
    const total = simulation.steps;
    const irs = receiverBuffers(config.receivers.length, total);

    try {
      while (simulation.currentStep < total) {
        if (this.cancelled) throw new Error('ARD: run cancelled');
        const until = Math.min(simulation.currentStep + INLINE_CHUNK_STEPS, total);
        while (simulation.currentStep < until) {
          const step = simulation.step();
          for (let r = 0; r < irs.length; r++) irs[r][step.step] = step.receiverSamples[r];
        }
        onProgress(simulation.currentStep / total);
        await yieldToHost();
      }
      return {
        irs,
        dt: simulation.dt,
        courant: simulation.courant,
        cellCount: simulation.cellCount,
        warnings: [...simulation.warnings],
      };
    } finally {
      simulation.dispose();
    }
  }

  /** Deconvolve, calibrate, resample and emit one result pair per source-receiver. */
  private emitResults(args: {
    sources: Source[];
    receivers: Receiver[];
    records: Float32Array[][][];
    bands: number[];
    pulse: Float32Array;
    dt: number;
    dx: number;
    c: number;
  }): Map<string, Float32Array> {
    const { sources, receivers, records, bands, pulse, dt, dx, c } = args;
    const simRate = 1 / dt;
    const steps = pulse.length;
    const transformLength = deconvolveTransformLength(steps, pulse.length);
    const bandWindows =
      bands.length > 1 ? octaveBandWindows(transformLength, simRate, bands) : null;

    // In 2D the absolute scale is not a scale. A line source spreads as
    // `1/sqrt(r)` and its free-field response falls as `1/sqrt(f)`, so the
    // correction is a +3 dB/octave spectral tilt and the 3D constant is wrong
    // by a factor that varies with distance *and* frequency — measured 8x to
    // 23x across a metre and an octave. It rides inside the deconvolution
    // alongside the band window, for the same reason that does.
    const twoDimensional = this.dimensions === 2;
    const calibration = twoDimensional
      ? calibration2D(transformLength, simRate, dx, c)
      : null;
    const scale = twoDimensional ? 1 : calibrationScale(dx, c);
    const impulseResponses = new Map<string, Float32Array>();

    for (let s = 0; s < sources.length; s++) {
      const source = sources[s];
      const pressureAtOneMetre = Lp2P(source.initialSPL) as number;

      for (let r = 0; r < receivers.length; r++) {
        const receiver = receivers[r];
        const combined = new Float32Array(steps);

        for (let b = 0; b < bands.length; b++) {
          // The octave window rides along inside the deconvolution rather than
          // being applied to its output. Same arithmetic — the two windows
          // multiply — but one transform pair per band instead of two, on top
          // of `sources x bands` simulations.
          //
          // It is also still exactly the broadband answer when summed: the
          // deconvolver's own `[fMin, fMax]` window `W` multiplies every band
          // identically, and the octave windows sum to one, so
          // `sum_b W·w_b·H = W·H`.
          const contribution = deconvolvePulse(records[s][b][r], pulse, {
            sampleRate: simRate,
            fMax: this.fMax,
            window: combineWindows(bandWindows?.[b], calibration),
          });
          for (let i = 0; i < steps; i++) combined[i] += contribution[i];
        }

        for (let i = 0; i < steps; i++) combined[i] *= scale * pressureAtOneMetre;

        // Resampling preserves the waveform's *amplitude*, so an arrival that
        // spanned k samples at the simulation rate spans k·ratio samples at the
        // output rate with the same height — and its sum grows by the ratio.
        // The convention here is that an arrival's **sum** is its pressure, so
        // the ratio has to come back out. Without this an ARD impulse response
        // would be 6.8x too loud at 44.1 kHz purely because of the rate it was
        // written at, and would change level if the user changed `sampleRate`.
        const rateCorrection = simRate / this.sampleRate;
        const ir = resample(combined, simRate, this.sampleRate);
        for (let i = 0; i < ir.length; i++) ir[i] *= rateCorrection;
        const key = `${source.uuid}->${receiver.uuid}`;
        impulseResponses.set(key, ir);
        this.emitPair(source, receiver, ir);
      }
    }

    return impulseResponses;
  }

  private emitPair(source: Source, receiver: Receiver, ir: Float32Array): void {
    const sourceName = source.name || 'source';
    const receiverName = receiver.name || 'receiver';
    // A 2D result is the response of a different room — uniform and unbounded
    // along the collapsed axis — so its name says so. Sitting unlabelled next
    // to a ray-traced IR in the results panel invites a comparison that has no
    // meaning: different spreading law, no modes across the third axis.
    const tag = this.dimensions === 2 ? ` [2D ${this.slice}]` : '';
    const info = {
      sourceName,
      receiverName,
      sourceId: source.uuid,
      receiverId: receiver.uuid,
    };

    const irUuid = `${this.uuid}-ard-ir-${source.uuid}-${receiver.uuid}`;
    publish<ResultKind.ImpulseResponse>({
      kind: ResultKind.ImpulseResponse,
      name: `IR${tag}: ${sourceName} → ${receiverName}`,
      uuid: irUuid,
      from: this.uuid,
      info: { sampleRate: this.sampleRate, ...info },
      data: forDisplay(ir, this.sampleRate),
    });

    // Schroeder integration of the same samples: the energy decay curve the
    // reverberation-time readouts expect, in dB relative to the total.
    const decay = schroederBackwardsIntegration(ir);
    const edcUuid = `${this.uuid}-ard-edc-${source.uuid}-${receiver.uuid}`;
    publish<ResultKind.EnergyDecay>({
      kind: ResultKind.EnergyDecay,
      name: `ARD energy${tag}: ${sourceName} → ${receiverName}`,
      uuid: edcUuid,
      from: this.uuid,
      info: { binRate: this.sampleRate, units: 'energy', ...info },
      data: forDisplay(decay, this.sampleRate),
    });

    this.hasEmittedResults = true;
  }

  save() {
    const {
      name, kind, uuid, autoCalculate, roomID, sourceIDs, receiverIDs,
      fMax, cellsPerWavelength, courant, irLength, wallThickness, boundary,
      perBandRuns, sampleRate, humidity, dimensions, slice, sliceCoordinate,
    } = this;
    return {
      name, kind, uuid, autoCalculate, roomID, sourceIDs, receiverIDs,
      fMax, cellsPerWavelength, courant, irLength, wallThickness, boundary,
      perBandRuns, sampleRate, humidity, dimensions, slice, sliceCoordinate,
    } as ARDSaveObject;
  }

  restore(state: ARDSaveObject) {
    super.restore(state);
    this.kind = state.kind;
    if (state.roomID !== undefined) this.roomID = state.roomID;
    if (state.sourceIDs !== undefined) this.sourceIDs = state.sourceIDs;
    if (state.receiverIDs !== undefined) this.receiverIDs = state.receiverIDs;
    if (state.fMax !== undefined) this.fMax = state.fMax;
    if (state.cellsPerWavelength !== undefined) this.cellsPerWavelength = state.cellsPerWavelength;
    if (state.courant !== undefined) this.courant = state.courant;
    if (state.irLength !== undefined) this.irLength = state.irLength;
    if (state.wallThickness !== undefined) this.wallThickness = state.wallThickness;
    // A project saved before impedance boundaries existed carries no `boundary`
    // key, and its results were produced — and read — through PML slabs. Taking
    // the constructor's new default here would silently change the physics of
    // somebody's saved simulation on load: padding 9 -> 1, a different cell
    // count, and a reverberation time about five times shorter on a 3D room.
    // That is not a migration to perform without being asked, however much
    // better the new boundary is, so an absent key restores as 'pml'. The run
    // then warns about the corner problem (see `planArdTimeStep`) and the
    // Boundary control shows which one is in force, so the choice is visible
    // and one click away rather than made on the user's behalf.
    this.boundary = state.boundary ?? 'pml';
    if (state.perBandRuns !== undefined) this.perBandRuns = state.perBandRuns;
    if (state.sampleRate !== undefined) this.sampleRate = state.sampleRate;
    if (state.humidity !== undefined) this.humidity = state.humidity;
    if (state.dimensions !== undefined) this.dimensions = state.dimensions;
    if (state.slice !== undefined) this.slice = state.slice;
    if (state.sliceCoordinate !== undefined) this.sliceCoordinate = state.sliceCoordinate;
    return this;
  }

  dispose(): void {
    this.cancel();
  }

  get rooms() {
    return useContainer.getState().getRooms();
  }

  get room(): Room {
    return useContainer.getState().containers[this.roomID] as Room;
  }

  get temperature(): number {
    return this.room?.temperature ?? 20;
  }

  get noResults(): boolean {
    return !this.hasEmittedResults;
  }

  /**
   * Cells of padding the grid needs on every side.
   *
   * A PML slab grows outward from a room face through solid cells, so it needs
   * somewhere to grow: `wallThickness + 1`, which at the default is 9 cells on
   * every side and dominates the allocated grid. An impedance boundary
   * occupies nothing outside the face and needs only the one-cell shell the
   * voxelizer already produces.
   */
  get padCells(): number {
    return this.boundary === 'pml' ? padCellsForWalls(this.wallThickness) : 1;
  }

  /** Cell size the current settings imply, in metres. */
  get cellSize(): number {
    return cellSizeFor(this.fMax, soundSpeed(this.temperature), this.cellsPerWavelength);
  }

  /**
   * Grid extents the run would allocate, in cells.
   *
   * From the room's bounding box, so an over-estimate for anything concave:
   * the real grid covers the air region plus its shell and padding, and a room
   * is rarely its own bounding box. It is still the figure to show before
   * pressing run, because it needs no voxelization — which on a large room is
   * itself slow enough to be the thing you were trying to warn about.
   */
  get estimatedGrid(): { x: number; y: number; z: number } {
    const size = this.roomSize();
    if (!size) return { x: 0, y: 0, z: 0 };
    const dx = this.cellSize;
    const pad = 2 * this.padCells;
    return {
      x: Math.ceil(size.x / dx) + pad,
      y: Math.ceil(size.y / dx) + pad,
      z: Math.ceil(size.z / dx) + pad,
    };
  }

  /** Cells the grid would allocate. See {@link estimatedGrid}. */
  get estimatedCellCount(): number {
    const grid = this.estimatedGrid;
    return grid.x * grid.y * grid.z;
  }

  /**
   * Cells that would actually be stepped: the air region plus the wall slabs.
   *
   * Not the same thing as {@link estimatedCellCount}, and the gap is wide —
   * most of the allocated grid is padding for the slabs to grow into. Runtime
   * follows this one.
   *
   * Counted in **cells, from the interior extents**, not in metres from the
   * bounding box. The voxelized air region is one cell smaller than the box on
   * each side, because the shell is solid, and at a coarse grid that is most of
   * the room: on a 3.2 x 2.6 x 2.2 m room at `fMax` 250 (`dx` 53 cm) the air
   * region is 5 x 4 x 3 cells, and the metric form over-counted it by 2x. The
   * cell form gets both terms exactly right there — 60 air cells and 94 face
   * cells, against 60 and 94 actual.
   */
  get estimatedSimulatedCells(): number {
    const size = this.roomSize();
    if (!size) return 0;
    const dx = this.cellSize;
    // Interior extents: the shell occupies the outermost cell on each side.
    let nx = Math.max(1, Math.round(size.x / dx) - 1);
    let ny = Math.max(1, Math.round(size.y / dx) - 1);
    let nz = Math.max(1, Math.round(size.z / dx) - 1);
    // A 2D run collapses one axis to a single cell, and the two faces normal
    // to it need no slab — there is no outside on that axis to absorb into.
    // That is most of the saving: it is not a third of the cells, it is the
    // whole cross-section gone.
    if (this.dimensions === 2) {
      if (collapsedAxis(this.slice) === 1) ny = 1;
      else nz = 1;
    }
    const air = nx * ny * nz;
    // A face normal to an axis gets a slab only if that axis has an outside to
    // grow into — `planWalls` skips a 1-thick axis for the same reason. So a
    // floor plan keeps its four in-plane walls and loses the two that would
    // have been floor and ceiling.
    const faceCells =
      2 *
      ((nx > 1 ? ny * nz : 0) + (ny > 1 ? nx * nz : 0) + (nz > 1 ? nx * ny : 0));
    // An impedance boundary adds no stepped cells at all — it forces cells the
    // air region already contains. That is the whole of the saving, and it is
    // the reason this number can be 3x smaller for the same room.
    return this.boundary === 'pml' ? air + faceCells * this.wallThickness : air;
  }

  /**
   * Roughly how long a run would take, in seconds.
   *
   * An order of magnitude, not a quote — but the order of magnitude is exactly
   * what is worth knowing before pressing a button that can block for minutes,
   * and `fMax` is an `O(fMax⁴)` dial. Throughput measured on this
   * implementation across four room sizes:
   *
   * Re-measured after the mixed-radix FFT landed, all three configurations in
   * one run so the rows are comparable with each other (`dx` 0.13, Courant 0.4,
   * α 0.3, min of four timed passes after a warm-up). The parenthesised figures
   * are the same measurement before mixed radix, when every non-power-of-two
   * extent went through Bluestein:
   *
   * | room (cells) | rigid       | impedance   | PML         | ms/step, impedance vs PML |
   * |--------------|-------------|-------------|-------------|---------------------------|
   * | 16 x 14 x 12 | 4.98 (2.14) | 1.44 (0.99) | 1.31 (1.28) | 1.87 vs 7.38 — **3.9x** |
   * | 24 x 20 x 16 | 5.36 (1.76) | 2.00 (1.17) | 1.40 (1.25) | 3.84 vs 15.61 — **4.1x** |
   * | 32 x 24 x 20 | 5.28 (1.77) | 2.29 (1.26) | 1.48 (1.26) | 6.72 vs 25.62 — **3.8x** |
   * | 16 x 16 x 16 | 7.81        | 1.82        | 1.43        | 2.25 vs 9.31 — **4.1x** |
   * | 32 x 32 x 16 | 6.41 (6.27) | 2.63 (2.76) | 1.56 (1.54) | 6.24 vs 26.27 — **4.2x** |
   *
   * (Mcell-steps/s, over `estimatedSimulatedCells`-equivalent stepped cells.)
   *
   * Read the rate columns and the wall-clock column together, because they say
   * different things. **Wall clock is about 4x better on the impedance path**,
   * which is the number a user experiences, and it comes from stepping roughly
   * a third as many cells rather than from stepping them faster.
   *
   * The two power-of-two rows are the control: they were already on the radix-2
   * path and did not move. Everything else did, by 1.8-2.3x on the DCT-bound
   * configurations, because a mixed extent no longer pays for Bluestein — which
   * is what made the impedance rate *lower* than the slab's before and higher
   * than it now. The per-boundary constants stay, because the cell counts still
   * differ by 3x and the per-cell costs no longer cancel that; they are just
   * both larger, and closer together, than Phase 11 measured.
   */
  get estimatedSeconds(): number {
    return (
      (this.estimatedSimulatedCells * this.estimatedSteps) /
      ARD_CELL_STEPS_PER_SECOND[this.boundary]
    );
  }

  /** Bounding-box size of the room in metres, or null if there is no room. */
  private roomSize(): { x: number; y: number; z: number } | null {
    const room = this.room;
    if (!room) return null;
    const size = new Vector3();
    try {
      room.boundingBox.getSize(size);
    } catch {
      // A room with no geometry has no bounding box. Nothing to estimate from.
      return null;
    }
    if (!(size.x > 0) || !(size.y > 0) || !(size.z > 0)) return null;
    return { x: size.x, y: size.y, z: size.z };
  }

  /**
   * Band centres this run will actually use.
   *
   * Filtered against `fMax`: the grid cannot represent anything above about
   * `1.3·fMax` and the deconvolver zeroes everything above `fMax`, so a band
   * whose *lower* edge is already past `fMax` costs a full simulation and
   * contributes nothing. Unfiltered, a 250 Hz run paid for seven bands and
   * threw five of them away. The highest surviving band's window still runs to
   * Nyquist, so dropping the rest loses no energy and the windows still sum to
   * one.
   */
  get bands(): number[] {
    if (!this.perBandRuns) return [this.referenceFrequency];
    // Lower edge of a band is the geometric mean with its neighbour below, so
    // `centre / sqrt(2)` for octave spacing.
    const kept = ARD_BAND_CENTRES.filter((centre) => centre / Math.SQRT2 <= this.fMax);
    return kept.length > 0 ? [...kept] : [ARD_BAND_CENTRES[0]];
  }

  /**
   * Frequency a single broadband run reads absorption at (plan D3).
   *
   * 500 Hz normally, but never above `fMax` — a 250 Hz run taking its `alpha`
   * from the 500 Hz column would use a material figure for a band it cannot
   * represent, and would disagree with what the per-band path does on the same
   * room.
   */
  get referenceFrequency(): number {
    return Math.min(ARD_REFERENCE_FREQUENCY, this.fMax);
  }

  /**
   * Steps in a single simulation run.
   *
   * Uses the clamped Courant number, not the requested one. Both boundary kinds
   * clamp it, for different reasons and by different amounts: a wall slab is a
   * `PmlPartition` and every partition shares a time step, so a 3D room is held
   * to `PML_CFL_MARGIN × vonNeumann(3)` ≈ 0.446, while an impedance boundary's
   * residual is feedback and holds it to `0.55 − 0.05α`. This getter has no grid
   * and no materials, so it cannot call `planArdTimeStep`; it takes the
   * impedance bound at its worst (α = 1, giving 0.5), which over-estimates the
   * step count for anything less absorbing. That is the right direction for a
   * figure shown before pressing run.
   */
  get estimatedStepsPerRun(): number {
    const c = soundSpeed(this.temperature);
    // Rank follows the mode: a sliced plane is rank 2, where the PML bound is
    // 0.575 rather than 0.470. Using the 3D bound for a 2D run over-states the
    // step count — latent at the default Courant 0.4, where no clamp bites, and
    // real at 0.5.
    const rank = this.dimensions === 2 ? 2 : 3;
    const limit =
      this.boundary === 'pml'
        ? PML_CFL_MARGIN * vonNeumannCflLimit(rank)
        : impedanceCourantLimit(1);
    const courant = Math.min(this.courant, limit);
    const dt = (courant * this.cellSize) / c;
    return Math.ceil(this.irLength / dt);
  }

  /**
   * Simulation runs the solver would perform: one per source, per band.
   *
   * A single simulation can carry several sources at once, but then every
   * receiver records their sum and no per-pair impulse response can be
   * recovered — so sources multiply the cost the same way bands do. Receivers
   * do not: they are probes into a field that is being computed anyway.
   */
  get estimatedRuns(): number {
    return Math.max(1, this.sourceIDs.length) * this.bands.length;
  }

  /** Steps across every run. This is what {@link estimatedSeconds} rides on. */
  get estimatedSteps(): number {
    return this.estimatedStepsPerRun * this.estimatedRuns;
  }
}

export default ARD;

/**
 * Multiply two spectral windows, or return whichever exists.
 *
 * The band split and the 2D calibration are independent weights over the same
 * bins, and `deconvolvePulse` takes one — folding them here keeps the run at
 * one transform pair per band rather than adding one back for the 2D path.
 */
function combineWindows(
  a: Float64Array | undefined,
  b: Float64Array | null,
): Float64Array | undefined {
  if (!a) return b ?? undefined;
  if (!b) return a;
  const out = new Float64Array(a.length);
  for (let k = 0; k < a.length; k++) out[k] = a[k] * b[k];
  return out;
}

/** World position of a container, as a plain point. */
function worldPosition(container: Source | Receiver): { x: number; y: number; z: number } {
  const v = new Vector3();
  container.getWorldPosition(v);
  return { x: v.x, y: v.y, z: v.z };
}

/**
 * The air cell a probe sits in, relocating it off a wall if it landed on one.
 *
 * `worldToCell` only rounds and bounds-checks. A source or receiver flush
 * against a surface — or anywhere in the half-cell band inside it — rounds onto
 * the one-cell shell and is Solid. Left alone, `createArdSimulation` rejects it
 * later with "inside a wall", *after* voxelizing, decomposing and planning
 * walls: a slow, opaque failure for a probe the user placed perfectly
 * reasonably. At `fMax` 500 the grid is 26 cm, so this is not a rare edge.
 *
 * The flood-fill seed already relocates this way (`voxelize.ts`), which made
 * the asymmetry worse rather than better: a run could get past the first
 * source, which is the seed, and then die on a receiver that landed the same
 * way.
 */
function resolveCell(
  grid: VoxelGrid,
  point: { x: number; y: number; z: number },
  what: string,
  isRoomAir: (index: number) => boolean,
  warnings: string[],
): [number, number, number] {
  const where = `(${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`;
  const rounded = worldToCell(grid, point);
  if (!rounded) {
    throw new Error(`ARD: ${what} at ${where} is outside the voxel grid — it is not in this room.`);
  }

  const cell = nearestCell(grid, rounded, (index) => isRoomAir(index));
  if (!cell) {
    throw new Error(
      `ARD: ${what} at ${where} is inside a wall, and there is no room air within 8 cells of ` +
        'it. Move it into the room, or lower fMax for a coarser grid.',
    );
  }

  const moved = Math.hypot(cell.i - rounded.i, cell.j - rounded.j, cell.k - rounded.k);
  if (moved > 0) {
    warnings.push(
      `${what} at ${where} landed on a wall cell and was moved ${(moved * grid.dx).toFixed(2)} m ` +
        `to the nearest room air. Every probe snaps to the grid — dx is ${grid.dx.toFixed(
          3,
        )} m here — but this one had to move further than rounding.`,
    );
  }
  return [cell.i, cell.j, cell.k];
}

/**
 * Absorption coefficients come from a material database and from user edits,
 * so they are not guaranteed to be in range. `wall.ts` needs `alpha < 1` to
 * have a reflection coefficient at all.
 */
function clampAlpha(alpha: number): number {
  if (!Number.isFinite(alpha)) return 0;
  return Math.min(Math.max(alpha, 0), 0.999);
}

function receiverBuffers(count: number, steps: number): Float32Array[] {
  const out: Float32Array[] = [];
  for (let i = 0; i < count; i++) out.push(new Float32Array(steps));
  return out;
}

/** Hand the event loop back, so a cancel or a repaint can get in. */
function yieldToHost(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Decimate for the store's chart.
 *
 * The full-rate arrays stay on {@link ARDRunSummary.impulseResponses}; a second
 * of audio as 44100 plain objects is not something to put in a Zustand store,
 * and the chart cannot draw that many points anyway. Same convention as the ray
 * tracer.
 */
function forDisplay(signal: Float32Array, sampleRate: number): { time: number; amplitude: number }[] {
  // `ceil`, not `floor`. With `floor`, a 3528-sample record gives a stride of
  // 1 and 3528 points — the cap overshoots by up to 2x for any length between
  // the cap and twice it, which is exactly the range a short impulse response
  // lands in.
  const step = Math.max(1, Math.ceil(signal.length / MAX_DISPLAY_POINTS));
  const out: { time: number; amplitude: number }[] = [];
  for (let i = 0; i < signal.length; i += step) {
    out.push({ time: i / sampleRate, amplitude: signal[i] });
  }
  return out.length > 0 ? out : [{ time: 0, amplitude: 0 }];
}

/** Add or update, so re-running a solver keeps the same result tab open. */
function publish<K extends ResultKind>(result: Result<K>): void {
  if (useResult.getState().results[result.uuid]) {
    emit('UPDATE_RESULT', { uuid: result.uuid, result });
  } else {
    emit('ADD_RESULT', result);
  }
}

// this allows for nice type checking with 'on' and 'emit' from messenger
declare global {
  interface EventTypes {
    ADD_ARD: ARD | undefined;
    REMOVE_ARD: string;
    ARD_SET_PROPERTY: {
      uuid: string;
      property: keyof ARD;
      value: ARD[EventTypes['ARD_SET_PROPERTY']['property']];
    };
    CALCULATE_ARD: string;
    ARD_PROGRESS: { uuid: string; progress: number };
  }
}

on('ADD_ARD', addSolver(ARD));
on('REMOVE_ARD', removeSolver);
on('ARD_SET_PROPERTY', setSolverProperty);
on('CALCULATE_ARD', (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as ARD;
  if (solver) solver.calculate();
});
