import { Decomposition } from './decompose';
import { ImpedancePlan } from './boundaries-from-grid';
import { PartitionInterface } from './interface';
import { Partition } from './partition';
import { VoxelGrid } from './voxelize';
import { WallPlan } from './walls-from-grid';
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
    readonly cellCount: {
        room: number;
        walls: number;
        boundary: number;
    };
    readonly warnings: readonly string[];
    /** Steps taken so far. */
    readonly currentStep: number;
    step(): ArdStepResult;
    /** Run to completion, returning one impulse response per receiver. */
    run(): Float32Array[];
    dispose(): void;
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
export declare function planArdTimeStep(config: Omit<ArdSimulationConfig, 'sources' | 'receivers'> & Partial<Pick<ArdSimulationConfig, 'sources' | 'receivers'>>): ArdTimeStepPlan;
export declare function createArdSimulation(config: ArdSimulationConfig): ArdSimulation;
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
export declare function bandlimitedPulse(steps: number, dt: number, fMax: number): Float32Array;
