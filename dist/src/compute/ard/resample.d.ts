/**
 * Sample-rate conversion for ARD impulse responses — Phase 7 of the ARD solver
 * (docs/ard-solver-plan.md).
 *
 * ## Why this is an upsampler in practice
 *
 * It is worth being explicit about which direction the conversion runs, because
 * the intuition from measurement is backwards here. A wave solver's time step
 * is set by the grid, not by audio: `Δt = C·Δx/c` with `Δx = c/(n·fMax)`, so
 *
 * ```
 * fs_sim = 1/Δt = n·fMax/C
 * ```
 *
 * At the plan's defaults — `n = 2.6` cells per wavelength, `C = 0.4`,
 * `fMax = 1000 Hz` — that is **6500 Hz**, not 44100. Every ARD run is therefore
 * upsampled on its way to an audio rate, and no anti-alias filtering is needed
 * or wanted: there is nothing above `fs_sim/2 = 3250 Hz` to fold down, because
 * the grid cannot represent it.
 *
 * The corollary matters more than the implementation: **an ARD impulse response
 * is band-limited to roughly `1.3·fMax` no matter what rate it is written at.**
 * Resampling to 44.1 kHz makes it playable and convolvable alongside CRAM's
 * other results; it does not make it broadband. A 1 kHz `fMax` run written at
 * 44.1 kHz is silent above ~1.3 kHz, and the cost of raising `fMax` is the
 * fourth power of the ratio (plan §5).
 *
 * ## Method
 *
 * Kaiser-windowed sinc interpolation, cutoff at whichever Nyquist is lower.
 * Chosen over FFT zero-padding because an impulse response is not periodic: the
 * FFT method wraps the tail onto the onset, which for a decaying IR puts a
 * ghost of the late reverberation on top of the direct arrival. It is chosen
 * over linear interpolation because that is a triangular kernel with a `sinc²`
 * response — a 6500 → 44100 Hz conversion would lose about 3 dB at 3 kHz and
 * leave audible images.
 */
/**
 * Modified Bessel function of the first kind, order zero, by its power series.
 *
 * `I0(x) = Σ (x²/4)^k / (k!)²`. The terms are all positive so there is no
 * cancellation, and for the `x <= beta` range a window needs (beta is ~8) the
 * series converges in well under twenty terms.
 */
export declare function besselI0(x: number): number;
/**
 * Kaiser window at `t ∈ [-1, 1]`, zero outside.
 *
 * `beta` trades main-lobe width against stopband attenuation:
 * `A ≈ 8.7 + beta/0.1102` dB. The default 8.0 gives about 81 dB, which puts the
 * interpolation images below the float32 noise floor of the result.
 */
export declare function kaiserWindow(t: number, beta: number): number;
export interface ResampleOptions {
    /**
     * Sinc zero crossings kept either side of the centre. Higher is sharper at
     * the band edge and proportionally slower. 16 puts the transition inside
     * about 2% of the cutoff frequency.
     */
    zeroCrossings?: number;
    /** Kaiser shape parameter. See {@link kaiserWindow}. */
    beta?: number;
}
export declare const DEFAULT_ZERO_CROSSINGS = 16;
export declare const DEFAULT_KAISER_BETA = 8;
/**
 * Convert `input` from `fromRate` to `toRate`.
 *
 * The output is `round(input.length · toRate / fromRate)` samples long, with
 * output sample `m` at time `m / toRate` — so sample 0 of the output is sample
 * 0 of the input and the onset is not shifted. Samples outside the input read
 * as zero, which is correct for an impulse response that starts at silence.
 */
export declare function resample(input: Float32Array, fromRate: number, toRate: number, options?: ResampleOptions): Float32Array;
