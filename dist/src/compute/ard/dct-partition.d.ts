import { PartitionBase, PartitionParams } from './partition';
export declare class DctPartition extends PartitionBase {
    readonly kind: "dct";
    /** A DCT partition's walls are rigid, so the residual must cancel the mirror. */
    readonly includeSelfTerms = true;
    readonly pressure: Float64Array;
    private readonly plan;
    /** Modal amplitudes at step n. */
    private modes;
    /** Modal amplitudes at step n−1. Reused as the write target, then swapped. */
    private prevModes;
    private readonly forceModes;
    /** cos(ω_k Δt), per mode. */
    private readonly cosWdt;
    /** 2(1 − cos ω_k Δt)/ω_k², per mode; Δt² at the DC mode. */
    private readonly forceCoef;
    constructor(params: PartitionParams);
    step(): void;
    scaleState(factor: number): void;
    /**
     * Conserved modal energy.
     *
     * Not `Σ (M^n)²` — that oscillates, because each mode is an oscillator. The
     * recurrence `x_{n+1} = 2λ x_n − x_{n−1}` with `λ = cos(ω Δt)` has the exact
     * invariant
     *
     * ```
     * E = x_n² + x_{n−1}² − 2λ x_n x_{n−1}
     * ```
     *
     * (substitute and the cross terms cancel), which reduces to the usual
     * `½(v² + ω²x²)` in the small-Δt limit. Summed over modes this is constant to
     * rounding once forcing stops, and is what `__tests__/partition.spec.ts`
     * checks over 10,000 steps.
     */
    modalEnergy(): number;
    /** Angular frequency of a mode, for tests and diagnostics. */
    angularFrequency(kx: number, ky?: number, kz?: number): number;
    /**
     * Largest `ω Δt` over all modes. The update is stable for any value, but
     * modes past π are temporally aliased and carry no useful signal. At
     * Courant 0.5 this stays below π in 1D, 2D and 3D.
     */
    maxPhaseAdvance(): number;
    /** Seed the field directly, for tests and initial conditions. */
    setPressure(values: ArrayLike<number>): void;
}
