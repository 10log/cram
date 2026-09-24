import { Field2D } from './wall-stencil';
/**
 * The stored energy `H^{n+½}` of a field whose `pressure` is `p^{n+1}` and whose
 * `velocity` is `p^{n+1} − p^n`, that is, the state `stepField` leaves.
 *
 * `courantSq`, `damping` and `maxGhostGain` must be the ones the field is
 * stepped with: the kinetic weight depends on all three.
 */
export declare function fieldEnergy(field: Field2D, courantSq: number, damping?: number, maxGhostGain?: number): number;
/**
 * What one step removed and added: `lost ≥ 0` through the walls and the
 * damping, and `input` from `source`.
 *
 * `previousVelocity` is the field's `velocity` before the step. The field
 * itself is the state after it. `source` is the same array `stepField`
 * was given, or absent.
 */
export declare function stepEnergyFlow(field: Field2D, previousVelocity: Float64Array, courantSq: number, damping?: number, maxGhostGain?: number, source?: Float64Array, previousBranchVelocity?: Float64Array): {
    lost: number;
    input: number;
};
/**
 * The smallest per-cell positivity margin `a_i − ½·deg_i` over the field's air
 * cells. When it is ≥ 0, `H` is bounded below by a sum of squares and the
 * scheme cannot grow. When it is negative, `H` is indefinite, and the
 * energy balance no longer rules growth out.
 *
 * At `λ² = ½`, `d = 1` this is `min ½·(k_i − B_i)`: wall faces minus backward
 * gain.
 */
export declare function energyMargin(field: Field2D, courantSq: number, damping?: number, maxGhostGain?: number): number;
