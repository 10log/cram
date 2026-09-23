import { PartitionBase, PartitionParams } from './partition';
export declare class FdtdPartition extends PartitionBase {
    readonly kind: "fdtd";
    /** Out-of-range taps read zero, so there is no mirror for the residual to cancel. */
    readonly includeSelfTerms = false;
    readonly pressure: Float64Array;
    private p;
    private pNew;
    private pOld;
    constructor(params: PartitionParams);
    /**
     * Stability bound on the Courant number — see the class comment.
     * 0.813 in 1D, 0.575 in 2D, 0.470 in 3D.
     */
    get cflLimit(): number;
    step(): void;
    scaleState(factor: number): void;
    /** Seed both time levels, for tests and initial conditions. */
    setPressure(values: ArrayLike<number>): void;
}
