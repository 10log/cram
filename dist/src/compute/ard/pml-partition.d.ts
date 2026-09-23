import { Axis, PartitionBase, PartitionParams } from './partition';
/**
 * Safety factor on the von Neumann bound for a damped layer. Measured worst
 * case across σ̂ ∈ [0, 0.2] and rank 1-3 is 0.974; 0.95 covers it with room.
 */
export declare const PML_CFL_MARGIN = 0.95;
export interface PmlPartitionParams extends PartitionParams {
    /** Axis the damping acts along — the normal of the face this slab terminates. */
    axis: Axis;
    /**
     * Whether `σ` grows toward increasing coordinate. `true` when the slab sits
     * on the high side of the partition it terminates (so `σ = 0` at its low
     * face, where the interface is).
     */
    increasing: boolean;
    /** Peak damping at the outer face, in s⁻¹. */
    sigmaMax: number;
    /** Grading exponent. 2 is the usual choice. */
    gradingExponent?: number;
}
export declare class PmlPartition extends PartitionBase {
    readonly kind: "pml";
    /** Like the FDTD partition, taps outside the array read zero — no mirror. */
    readonly includeSelfTerms = false;
    readonly axis: Axis;
    readonly sigmaMax: number;
    readonly gradingExponent: number;
    /** σ per cell along the damped axis. */
    private readonly sigma;
    readonly pressure: Float64Array;
    private p;
    private pNew;
    private pOld;
    private readonly phi;
    private readonly phiNew;
    constructor(params: PmlPartitionParams);
    /**
     * Stability bound on the Courant number: the von Neumann bound for the
     * explicit 6th-order update, less {@link PML_CFL_MARGIN} to cover the
     * tightening the damping terms cause. See the class comment for measurements.
     */
    get cflLimit(): number;
    /** σ at a given cell along the damped axis, for tests and diagnostics. */
    sigmaAt(i: number): number;
    private axisCoord;
    step(): void;
    scaleState(factor: number): void;
    /** Seed both time levels, for tests. */
    setPressure(values: ArrayLike<number>): void;
}
