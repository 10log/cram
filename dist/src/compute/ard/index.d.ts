import { default as Room } from '../../objects/room';
import { default as Solver, SolverParams } from '../solver';
import { ArdSlice } from './grid-slice';
/** Octave bands the per-band path runs. 125 Hz to 8 kHz, as `ART` uses. */
export declare const ARD_BAND_CENTRES: readonly [125, 250, 500, 1000, 2000, 4000, 8000];
/**
 * Band whose absorption a single broadband run uses (plan D3).
 *
 * 500 Hz is the usual mid-band stand-in and the one most published `alpha`
 * tables are anchored on.
 */
export declare const ARD_REFERENCE_FREQUENCY = 500;
/**
 * Throughput used for the pre-run time estimate, in cell-steps per second, per
 * boundary kind.
 *
 * Two figures because the cost *per stepped cell* genuinely differs. A PML slab
 * cell runs an explicit stencil, which is cheap per cell and there are two to
 * five times as many of them; an impedance run has only the room's DCT cells,
 * each dearer, plus a boundary residual on every face cell that this count does
 * not see. So removing the slabs cuts total work by about 3x while *raising*
 * the average cost of the cells that remain — the two effects pull opposite
 * ways and one constant cannot carry both.
 *
 * Measured on this implementation; see {@link ARD.estimatedSeconds} for the
 * table. Both take the conservative end of their range — a run that finishes
 * sooner than the warning said is a good surprise.
 */
export declare const ARD_CELL_STEPS_PER_SECOND: {
    readonly impedance: 1000000;
    readonly pml: 1250000;
};
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
    cellCount: {
        room: number;
        walls: number;
        boundary: number;
    };
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
export declare class ARD extends Solver {
    uuid: string;
    roomID: string;
    sourceIDs: string[];
    receiverIDs: string[];
    fMax: number;
    cellsPerWavelength: number;
    courant: number;
    irLength: number;
    wallThickness: number;
    boundary: 'impedance' | 'pml';
    perBandRuns: boolean;
    sampleRate: number;
    humidity: number;
    dimensions: 2 | 3;
    slice: ArdSlice;
    sliceCoordinate: number | null;
    /** Progress of the run in flight, 0..1. */
    progress: number;
    /** Summary of the last completed run, or null. */
    lastRun: ARDRunSummary | null;
    hasEmittedResults: boolean;
    /** Set when a run is asked to stop; checked between chunks. */
    private cancelled;
    /** The worker serving this run, reused across sources and bands. */
    private activeWorker;
    /** False once a worker has proved unusable, so later bands do not retry. */
    private workerUsable;
    constructor(props?: ARDProps);
    /**
     * Start a run and return immediately, as the `Solver` contract requires.
     *
     * Await {@link run} instead when the outcome matters — a failure here can
     * only be logged.
     */
    calculate(): void;
    /** Stop the run in flight at the next chunk boundary. */
    cancel(): void;
    run(): Promise<ARDRunSummary>;
    private execute;
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
    private takeSlice;
    /** One simulation: one source, one band. */
    private runOne;
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
    private stepSimulation;
    /** The worker for this run, constructed on first use. */
    private acquireWorker;
    private releaseWorker;
    /** The time loop on this thread, chunked so a cancel can get in. */
    private stepInline;
    /** Deconvolve, calibrate, resample and emit one result pair per source-receiver. */
    private emitResults;
    private emitPair;
    save(): ARDSaveObject;
    restore(state: ARDSaveObject): this;
    dispose(): void;
    get rooms(): Room[];
    get room(): Room;
    get temperature(): number;
    get noResults(): boolean;
    /**
     * Cells of padding the grid needs on every side.
     *
     * A PML slab grows outward from a room face through solid cells, so it needs
     * somewhere to grow: `wallThickness + 1`, which at the default is 9 cells on
     * every side and dominates the allocated grid. An impedance boundary
     * occupies nothing outside the face and needs only the one-cell shell the
     * voxelizer already produces.
     */
    get padCells(): number;
    /** Cell size the current settings imply, in metres. */
    get cellSize(): number;
    /**
     * Grid extents the run would allocate, in cells.
     *
     * From the room's bounding box, so an over-estimate for anything concave:
     * the real grid covers the air region plus its shell and padding, and a room
     * is rarely its own bounding box. It is still the figure to show before
     * pressing run, because it needs no voxelization — which on a large room is
     * itself slow enough to be the thing you were trying to warn about.
     */
    get estimatedGrid(): {
        x: number;
        y: number;
        z: number;
    };
    /** Cells the grid would allocate. See {@link estimatedGrid}. */
    get estimatedCellCount(): number;
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
    get estimatedSimulatedCells(): number;
    /**
     * Roughly how long a run would take, in seconds.
     *
     * An order of magnitude, not a quote — but the order of magnitude is exactly
     * what is worth knowing before pressing a button that can block for minutes,
     * and `fMax` is an `O(fMax⁴)` dial. Throughput measured on this
     * implementation across four room sizes:
     *
     * Re-measured for Phase 11, all three configurations in one run so the rows
     * are comparable with each other (`dx` 0.13, Courant 0.4, α 0.3, min of four
     * timed passes after a warm-up):
     *
     * | room (cells) | rigid | impedance | PML | ms/step, impedance vs PML |
     * |--------------|-------|-----------|-----|---------------------------|
     * | 16 x 14 x 12 | 2.14  | 0.99      | 1.28 | 2.71 vs 9.40 — **3.5x** |
     * | 24 x 20 x 16 | 1.76  | 1.17      | 1.25 | 6.54 vs 21.24 — **3.2x** |
     * | 32 x 24 x 20 | 1.77  | 1.26      | 1.26 | 12.23 vs 36.13 — **3.0x** |
     * | 32 x 32 x 16 | 6.27  | 2.76      | 1.54 | 5.94 vs 31.83 — **5.4x** |
     *
     * (Mcell-steps/s, over `estimatedSimulatedCells`-equivalent stepped cells.)
     *
     * Read the rate columns and the wall-clock column together, because they say
     * different things. **Wall clock is 3-5x better on the impedance path**, which
     * is the number a user experiences. The *rate* is lower there, which looks
     * like a regression and is not: the rate is per stepped cell, slab cells are
     * cheaper per cell than DCT cells, and an impedance run also does boundary
     * work on every face cell that the cell count does not include. Fewer, dearer
     * cells.
     *
     * The consequence for this estimate is the one that matters: multiplying the
     * (3x smaller) impedance cell count by the old 1.35e6 was **optimistic**, not
     * pessimistic — typical rooms measure 0.99-1.26. Hence the per-boundary
     * constants. The last row is the Phase 1 finding from the other side:
     * power-of-two extents take the radix-2 FFT path, and on the impedance path,
     * where the DCT is most of the work, that is worth 2.2x rather than 20%.
     */
    get estimatedSeconds(): number;
    /** Bounding-box size of the room in metres, or null if there is no room. */
    private roomSize;
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
    get bands(): number[];
    /**
     * Frequency a single broadband run reads absorption at (plan D3).
     *
     * 500 Hz normally, but never above `fMax` — a 250 Hz run taking its `alpha`
     * from the 500 Hz column would use a material figure for a band it cannot
     * represent, and would disagree with what the per-band path does on the same
     * room.
     */
    get referenceFrequency(): number;
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
    get estimatedStepsPerRun(): number;
    /**
     * Simulation runs the solver would perform: one per source, per band.
     *
     * A single simulation can carry several sources at once, but then every
     * receiver records their sum and no per-pair impulse response can be
     * recovered — so sources multiply the cost the same way bands do. Receivers
     * do not: they are probes into a field that is being computed anyway.
     */
    get estimatedRuns(): number;
    /** Steps across every run. This is what {@link estimatedSeconds} rides on. */
    get estimatedSteps(): number;
}
export default ARD;
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
        ARD_PROGRESS: {
            uuid: string;
            progress: number;
        };
    }
}
