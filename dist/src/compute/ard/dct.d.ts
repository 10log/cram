/**
 * Separable DCT-II / DCT-III over an axis-aligned grid — Phase 1 of the ARD
 * solver (docs/ard-solver-plan.md).
 *
 * ARD advances each rectangular partition in a cosine modal basis: every time
 * step transforms the forcing field into modal space, applies an exact per-mode
 * update, and transforms the pressure back. That is two transforms per partition
 * per step, so this module is the solver's innermost hot loop and does no
 * allocation once the plan is built.
 *
 * ## Conventions
 *
 * `forward` is FFTW's `REDFT10` (DCT-II) along each axis, unnormalized:
 *
 * ```
 * Y[k] = 2 * sum_{j=0}^{N-1} x[j] cos(pi*(2j+1)*k / (2N))
 * ```
 *
 * matching the transform the reference implementation plans with
 * `FFTW_REDFT10`, so per-mode constants carry over from it directly.
 *
 * `inverse` is `REDFT01` (DCT-III) along each axis, divided by `prod(2*N_d)` so
 * that `inverse(forward(x)) === x`. FFTW's own round trip is `2N` per dimension;
 * all of that normalization lives on the inverse side, and none of it on the
 * forward side. The split is arbitrary as far as the modal update is concerned —
 * modes and forcing terms are scaled identically, and the update relates them
 * with a scale-free coefficient — so it is chosen here to keep `forward`
 * bit-comparable with the reference rather than to look symmetric. (The
 * reference instead splits its scaling `2*sqrt(2WH)` / `sqrt(2WH)` across the
 * two directions, which multiplies out to the same `prod(2*N_d)`.)
 *
 * ## Memory layout
 *
 * Row-major with the **first axis contiguous**:
 *
 * ```
 * index = x + nx*(y + ny*z)     for dims [nx, ny, nz]
 * ```
 *
 * This matches the reference's `values[y*width + x]` indexing and the voxel grid
 * of plan Phase 2. It is a contract between phases, so changing it means
 * changing them together.
 *
 * Any rank is accepted. 2D ARD is `[nx, ny]`, 3D is `[nx, ny, nz]`, and an axis
 * of length 1 is handled correctly (`REDFT10` degenerates to a factor of 2 and
 * `REDFT01` to the identity), so a slab partition needs no special casing.
 *
 * Input and output buffers may alias: the first axis pass reads the source and
 * writes the destination, and later passes work inside the destination.
 */
/**
 * A prepared separable DCT for one fixed grid.
 *
 * **Not re-entrant.** A plan owns mutable line scratch, and shares one
 * {@link ComplexFftPlan} between axes of equal length, so a single instance must
 * not have two transforms in flight at once: no overlapping `forward` /
 * `inverse` calls, and no sharing between concurrent callers. Giving each axis
 * its own FFT would not change this — the line scratch is shared regardless —
 * so the rule is one plan per sequential user. Plans are plain class instances
 * and do not survive `postMessage`, so a worker builds its own.
 */
export interface DctPlan {
    /** Grid extents, first axis contiguous. Frozen. */
    readonly dims: readonly number[];
    /** Total number of samples, `prod(dims)`. */
    readonly size: number;
    /** DCT-II (`REDFT10`) along every axis. `values` is not modified unless it aliases `modes`. */
    forward(values: Float64Array, modes: Float64Array): void;
    /** Normalized DCT-III (`REDFT01`) along every axis — the exact inverse of `forward`. */
    inverse(modes: Float64Array, values: Float64Array): void;
}
/**
 * Build a reusable DCT plan for a grid of the given extents (first axis
 * contiguous). Tables and scratch are allocated here so that `forward` and
 * `inverse` allocate nothing; create one plan per partition and keep it for the
 * life of the simulation — but see {@link DctPlan} on re-entrancy before
 * sharing one between concurrent callers.
 */
export declare function createDctPlan(dims: readonly number[]): DctPlan;
