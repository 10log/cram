import { GlobalField } from './interface';
import { Axis, Partition } from './partition';
/** Normal-incidence pressure reflection coefficient of a real impedance. */
export declare function reflectionForImpedance(xi: number): number;
/** Absorption coefficient of a real impedance, `1 − R²`. */
export declare function absorptionForImpedance(xi: number): number;
/**
 * Impedance realizing an absorption coefficient.
 *
 * `α = 1 − R²` fixes `|R|` only, and both signs are physical: `ξ > 1` for a
 * surface stiffer than air and `ξ < 1` for a softer one. Materials in the
 * database are porous absorbers backed by structure, so the positive root is
 * the right one — and it is also the branch that degenerates to a rigid wall as
 * `α → 0`, which is what a caller asking for `α = 0` means.
 */
export declare function impedanceForAbsorption(alpha: number): number;
/**
 * Cells per wavelength at which the mapping is still good to about 0.01 in α.
 *
 * Measured, not derived — see the table above. ARD's own default is 2.6, where
 * the top octave of a run sits at 77% of the grid's spatial Nyquist and the
 * delivered coefficient falls well short. The driver warns below this rather
 * than overriding the caller: the cost of a run scales as roughly the fourth
 * power of this number, so it is not a change to make on someone's behalf.
 */
export declare const ARD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE = 4;
/** Absorption at or below this is a rigid surface, and gets no boundary at all. */
export declare const RIGID_ALPHA_EPSILON = 0.000001;
/** Courant number the bound allows at α = 0, the least absorbing surface. */
export declare const IMPEDANCE_COURANT_INTERCEPT = 0.55;
/** How much of that a perfect absorber costs. */
export declare const IMPEDANCE_COURANT_SLOPE = 0.05;
/**
 * Largest Courant number an impedance boundary is stable at.
 *
 * `0.55 − 0.05α`, a straight line at least one sampling rung under every
 * measurement in the table above. `maxAbsorption` is the most absorbing surface in the
 * simulation, because every partition shares one time step and the boundary
 * that diverges first is the one that absorbs most.
 *
 * Compare `PML_CFL_MARGIN * vonNeumannCflLimit(3)` = 0.446, which a wall slab
 * imposes regardless of its material.
 */
export declare function impedanceCourantLimit(maxAbsorption: number): number;
export interface ImpedanceBoundaryParams {
    /** The partition whose face this is. */
    partition: Partition;
    axis: Axis;
    /** True when the face is the partition's high edge on `axis`. */
    high: boolean;
    /** Inclusive-exclusive global ranges on the two transverse axes. */
    uMin: number;
    uMax: number;
    vMin: number;
    vMax: number;
    /** Normalized specific acoustic impedance. `Infinity` is a rigid wall. */
    impedance: number;
    /**
     * The room's pressure by global cell (#228). A face on a partition thinner
     * than INTERFACE_DEPTH needs mirror cells that lie in the partition beyond
     * it; without this they read zero, the stencil loses its −27 and 2 taps, and
     * a one-cell sliver against an absorbing wall grows. Optional so a boundary
     * on a thick partition, or in a unit test, is built exactly as before.
     */
    field?: GlobalField;
}
/**
 * One rectangle of one partition face, carrying a locally-reacting impedance.
 *
 * `apply()` accumulates this face's residual into the partition's forcing
 * field. Call it once per step, in the same place as
 * {@link applyAllInterfaceForcing} — before the partitions step, from the
 * current pressure.
 */
export declare class ImpedanceBoundary {
    readonly partition: Partition;
    readonly axis: Axis;
    readonly high: boolean;
    readonly uMin: number;
    readonly uMax: number;
    readonly vMin: number;
    readonly vMax: number;
    readonly impedance: number;
    /** Depths this face forces — the partition's own cells, `min(3, extent along axis)`. */
    readonly depth: number;
    private readonly field;
    /** `β_k` per ghost depth. */
    private readonly beta;
    /** `s_k = ghost_k^{n−1} + p_k^{n−1}`, one per ghost per face cell. */
    private readonly history;
    /** Scratch for the current cell's ghosts, so `apply` allocates nothing. */
    private readonly ghost;
    private readonly own;
    constructor(params: ImpedanceBoundaryParams);
    /** Face cells this boundary covers. */
    get cellCount(): number;
    /** Forget the filter state. A reused boundary must start from rest. */
    reset(): void;
    /** Accumulate this face's residual into the partition's forcing field. */
    apply(): void;
}
/** Apply every impedance boundary's residual. */
export declare function applyAllImpedanceForcing(boundaries: readonly ImpedanceBoundary[]): void;
