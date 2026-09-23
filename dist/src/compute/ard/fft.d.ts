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
 * Cooley-Tukey; lengths whose prime factors are all at most
 * {@link MAX_MIXED_RADIX_FACTOR} use a mixed-radix Stockham transform; anything
 * left goes through Bluestein's chirp-z algorithm.
 *
 * The middle path is there because Bluestein is expensive in a way that shows
 * up in the solver's wall clock, not just in an asymptotic constant: it runs
 * three power-of-two transforms of length `>= 2n - 1` plus two chirp passes, so
 * a partition whose extents are 16 x 14 x 12 measured 3.7x the per-cell cost of
 * a 16 x 16 x 16 one. Most extents a room produces are smooth — of the 61
 * extents in 4..64, 33 factor over {2,3,5,7} against 5 that are powers of two —
 * so the middle path is the common case, and it closes that gap to about
 * 1.2-1.6x.
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
    /**
     * Which algorithm the plan runs. Reported so that a caller — or a test —
     * can see which path `createComplexFftPlan` chose for a length without
     * inferring it from timings.
     */
    readonly kind: 'identity' | 'radix2' | 'mixed-radix' | 'bluestein';
    /** `(re, im) <- DFT(re + i*im)`, unnormalized. */
    forward(re: Float64Array, im: Float64Array): void;
    /** `(re, im) <- N * IDFT(re + i*im)`. Divide by `n` for the true inverse. */
    inverseUnscaled(re: Float64Array, im: Float64Array): void;
}
/**
 * Largest prime factor a mixed-radix plan will handle.
 *
 * Each factor `p` is combined with a direct `p`-point DFT, which is `O(p²)` per
 * butterfly against Bluestein's `O(n log n)` for the whole transform — so small
 * factors are a clear win and large ones are not. 7 covers the useful range:
 * of the extents 4..64 that a room's box growth produces, 33 are
 * {2,3,5,7}-smooth against 5 that are powers of two, so this roughly sextuples
 * how often the fast path is taken.
 */
export declare const MAX_MIXED_RADIX_FACTOR = 7;
/** Prime factors of `n`, ascending, or `null` if any exceeds the bound. */
export declare function smallPrimeFactors(n: number): number[] | null;
/**
 * Radices a mixed-radix plan runs, in stage order, or `null` if `n` has a
 * factor above {@link MAX_MIXED_RADIX_FACTOR}.
 *
 * Adjacent 2s are merged into 4s. The radix-4 butterfly costs the same
 * multiplies as two radix-2 ones but halves the passes over the array, and
 * with `n` in the low thousands the transform is bound by memory traffic, not
 * arithmetic — the pairing measures 20-25% faster on partition-sized lengths.
 * An odd count of 2s leaves one radix-2 stage behind.
 *
 * Stage order does not affect the result: each stage is a full Cooley-Tukey
 * split of whatever length is left, so any permutation of the factors computes
 * the same DFT.
 */
export declare function mixedRadixStages(n: number): number[] | null;
/**
 * Build a reusable FFT plan of length `n`. Plans hold precomputed tables and
 * scratch, so create them once per transform length and keep them — but see
 * {@link ComplexFftPlan} on re-entrancy before sharing one.
 */
export declare function createComplexFftPlan(n: number): ComplexFftPlan;
