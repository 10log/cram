/**
 * Allocation-free complex FFT plans for the ARD solver's hot loop.
 *
 * Why another FFT in this repository: `compute/acoustics/fft/fft.ts` wraps every
 * element in a `Complex` object, `compute/acoustics/fft/_fft.ts` allocates fresh
 * arrays on every call, and `compute/acoustics/fft/index.ts` applies a Hann
 * window and chunks its input by default. ARD runs two transforms per partition
 * per time step for 10,000-20,000 steps (docs/ard-solver-plan.md §5), so every
 * buffer has to be preallocated at plan time and the data has to stay in
 * `Float64Array`s.
 *
 * Arbitrary transform lengths are a requirement, not a convenience: partition
 * extents come from greedy box growth over a voxel grid (plan Phase 3), so they
 * are whatever integers the room geometry produces. Powers of two use radix-2
 * Cooley-Tukey; every other length goes through Bluestein's chirp-z algorithm.
 *
 * Sign convention: `forward` computes the unnormalized DFT
 * `X[k] = sum_n x[n] exp(-2i*pi*n*k/N)`, and `inverseUnscaled` computes
 * `sum_k X[k] exp(+2i*pi*n*k/N)` — that is, `N` times the true inverse. Callers
 * apply whatever normalization they need; `dct.ts` folds it into its own scaling
 * so nothing is divided twice.
 */
/**
 * Largest transform length accepted. Well above any partition extent a room
 * produces, and low enough that an accidental huge value fails with a clear
 * error instead of an allocation failure — a plan of length `n` holds tables of
 * `O(n)`, and Bluestein rounds up to a power of two at least `2n - 1`.
 */
export declare const MAX_FFT_LENGTH: number;
/**
 * A prepared complex FFT of one fixed length. Both methods are in-place.
 *
 * **Not re-entrant.** A plan owns mutable scratch (the Bluestein path in
 * particular), so a single instance must not have two transforms in flight at
 * once: no overlapping calls, and no sharing between concurrent callers. Plans
 * are also plain class instances, so they do not survive `postMessage` —
 * a worker builds its own. One plan per sequential user; `createComplexFftPlan`
 * again for anything concurrent.
 */
export interface ComplexFftPlan {
    readonly n: number;
    /** `(re, im) <- DFT(re + i*im)`, unnormalized. */
    forward(re: Float64Array, im: Float64Array): void;
    /** `(re, im) <- N * IDFT(re + i*im)`. Divide by `n` for the true inverse. */
    inverseUnscaled(re: Float64Array, im: Float64Array): void;
}
/**
 * Build a reusable FFT plan of length `n`. Plans hold precomputed tables and
 * scratch, so create them once per transform length and keep them — but see
 * {@link ComplexFftPlan} on re-entrancy before sharing one.
 */
export declare function createComplexFftPlan(n: number): ComplexFftPlan;
