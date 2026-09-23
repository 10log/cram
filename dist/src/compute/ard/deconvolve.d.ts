/**
 * Turning a pulse response into an impulse response — Phase 7 of the ARD
 * solver (docs/ard-solver-plan.md), design decision D4.
 *
 * The simulation is driven by a band-limited pulse, not by a delta: a delta has
 * energy at every frequency, including the ones the grid cannot represent, and
 * injecting one excites numerical garbage at the spatial Nyquist. What comes
 * back is therefore `p = h ⊛ s` — the room's impulse response convolved with
 * that pulse — and `s` has to be divided back out before the result is an
 * impulse response in the sense the rest of CRAM means.
 *
 * ## Regularized division, not division
 *
 * `H = P/S` is correct and useless: `S` is a Gaussian derivative, so `|S|` is
 * zero at DC, small below the band, and falls off above it. Dividing by it
 * amplifies whatever is there — truncation error, the float32 record, the DC
 * mode the source deliberately does not drive — by an unbounded factor.
 *
 * So the Wiener/Tikhonov form is used instead:
 *
 * ```
 * H = P · conj(S) / (|S|² + λ),   λ = regularization · max|S|²
 * ```
 *
 * which tends to `P/S` where the pulse has energy and to zero where it does
 * not. A band window then removes what is left outside the excited band.
 *
 * **The result is high-passed and low-passed, and that is not a defect.** ARD
 * cannot tell you the response at 20 Hz on a 1 kHz grid, and a deconvolution
 * that claimed to would be reporting the regularizer.
 *
 * ## Absolute scale
 *
 * The forcing convention is `∂²p/∂t² = c²∇²p + F` with `F` injected into one
 * cell, so the cell acts as a source of volume `Δx³`. The continuum solution of
 * that equation for a point source is `p = f(t − r/c)/(4πc²r)`, which makes the
 * free-field transfer function from an injected sample value to pressure at
 * distance `r`
 *
 * ```
 * P(f)/F(f) = Δx³ / (4π c² r)
 * ```
 *
 * Measured against the assembled solver at 0.25, 0.5 and 0.75 `fMax`, over
 * `Δx` 0.05–0.1 m, Courant 0.3–0.4, `fMax` 600–1200 Hz and `r` 0.3–1.8 m: every
 * ratio within 2.5% of 1, with no systematic bias
 * (`__tests__/deconvolve.spec.ts`).
 *
 * That constant is worth stating carefully, because the *peak* of the recorded
 * waveform does **not** follow it — it runs 1–5% high, increasing with both
 * Courant number and cells per wavelength. That is the shape of a band-limited
 * delta sampled at an arbitrary offset, not a gain error, and it is why the
 * calibration here is spectral. A time-domain peak calibration would have
 * silently folded a discretization artefact into the absolute level.
 *
 * {@link freeFieldGain} is therefore analytic rather than measured, and
 * {@link calibrationScale} converts a raw simulation record into an impulse
 * response referenced to 1 m, which is the convention the ray tracer's
 * `arrivalPressure` already uses.
 */
/** Smallest power of two at or above `n`. */
export declare function nextPowerOfTwo(n: number): number;
/**
 * Free-field pressure per unit injected forcing sample, at distance `r`.
 *
 * See the module comment for the derivation and the measurement that confirms
 * it. `r` is in metres; the expression diverges at the source cell itself and
 * is meaningless inside about two cells of it.
 */
export declare function freeFieldGain(dx: number, c: number, r: number): number;
/**
 * Factor taking a deconvolved simulation record to an impulse response whose
 * free-field direct arrival has area `1/r`.
 *
 * That is the same convention as the geometric solvers: convolving the result
 * with a signal expressed as its pressure at 1 m gives the pressure at the
 * receiver. Multiply by `Lp2P(source.initialSPL)` for pascals.
 */
export declare function calibrationScale(dx: number, c: number): number;
/**
 * Free-field pressure per unit injected forcing sample in **two dimensions**,
 * at distance `r` and frequency `f`.
 *
 * Not a variant of {@link freeFieldGain} — a different function of different
 * variables. A 2D run's source is a line, not a point, so the Green's function
 * is a Hankel function rather than a delta, and for `kr >> 1`
 *
 * ```
 * |P/F| = (Δx² / 4πc²) · sqrt(c / (f·r))
 * ```
 *
 * Two things follow, and both matter more than the constant:
 *
 * - **2D free field falls as `1/√r`, not `1/r`** — 3 dB per doubling rather
 *   than 6.
 * - **It is not flat in frequency.** It falls as `1/√f`, so "an arrival's sum
 *   is its pressure" — the 3D convention this module is built on — simply does
 *   not hold. A 2D impulse response has a −3 dB/octave tilt in free field, and
 *   {@link calibration2D} is what takes it back out.
 *
 * Measured against the assembled solver at 0.25, 0.5 and 0.75 `fMax`, over `r`
 * 0.4–1.2 m at `Δx` 5 cm: every ratio within 1.6% of 1. Over the same points
 * the 3D expression is wrong by factors of **8 to 23**, varying with both `r`
 * and `f` — so a 2D run calibrated with the 3D constant is not off by a gain,
 * it is off by a function, and no scale factor can rescue it.
 *
 * Asymptotic in `kr`: at `kr = 2.2` the measured ratio is 0.990, and below
 * about `kr = 2` — `r < c/(πf)`, so a metre at 100 Hz — the near-field terms of
 * the Hankel function take over and this expression stops applying.
 */
export declare function freeFieldGain2D(dx: number, c: number, r: number, f: number): number;
/**
 * Spectral weight taking a deconvolved **2D** record to an impulse response
 * whose free-field response is `1/√r`, flat in frequency.
 *
 * The 2D analogue of {@link calibrationScale}, and a weight rather than a
 * scalar because there is no scalar that would do: the correction is a
 * +3 dB/octave tilt, undoing the `1/√f` of 2D spreading.
 *
 * `1/√r` rather than `1/r` is not a choice — it is how a line source spreads.
 * Which is the whole reason a 2D result cannot be compared with a 3D one: they
 * are answers about different rooms, and this function makes the 2D one
 * internally consistent, not equivalent.
 *
 * Returned as a window over `n` bins at `sampleRate`, symmetric so the inverse
 * transform stays real, to be passed to {@link deconvolvePulse} as `window`.
 */
export declare function calibration2D(n: number, sampleRate: number, dx: number, c: number): Float64Array;
export interface BandWindowOptions {
    /** Lower edge in Hz. 0 keeps everything down to DC. */
    fLow?: number;
    /**
     * Upper edge in Hz. Defaults to `Infinity` — no upper edge at all, rather
     * than Nyquist, which with a transition would roll the band off below it.
     */
    fHigh?: number;
    /**
     * Width of each raised-cosine transition, as a fraction of the edge
     * frequency it sits on. 0 gives a brick wall, which rings.
     */
    transition?: number;
}
/**
 * A real, symmetric spectral window of length `n`, for a signal sampled at
 * `sampleRate`.
 *
 * Symmetric about bin `n/2` so that multiplying a Hermitian spectrum by it
 * leaves the spectrum Hermitian and the inverse transform real. Transitions are
 * raised cosines in `log2(f)`, which makes them constant-width in octaves and,
 * more usefully, makes the rising and falling halves of adjacent bands sum to
 * exactly one — see {@link octaveBandWindows}.
 */
export declare function bandWindow(n: number, sampleRate: number, options?: BandWindowOptions): Float64Array;
export interface DeconvolveOptions {
    /** Sample rate of both signals, Hz — the simulation's `1/dt`. */
    sampleRate: number;
    /** Upper edge of the band to keep, Hz. */
    fMax: number;
    /**
     * Lower edge, Hz. Below this the pulse carries too little energy to invert
     * and the regularizer dominates. Defaults to `fMax / 32`.
     */
    fMin?: number;
    /**
     * Tikhonov term, as a fraction of the pulse's peak power spectrum. Larger is
     * a smoother, more biased estimate; smaller rings and amplifies noise.
     */
    regularization?: number;
    /** Transition width for the band window. See {@link bandWindow}. */
    transition?: number;
    /**
     * A further spectral window, multiplied in alongside the band window.
     *
     * Length must be {@link deconvolveTransformLength} of the two inputs. This
     * exists so a caller that wants to filter the result — the per-band path
     * splitting into octaves — pays one transform instead of three: a second
     * `applySpectralWindow` on the output is a forward and an inverse FFT over
     * the whole record, per band, per receiver, on top of the simulations.
     */
    window?: Float64Array;
}
/**
 * FFT length {@link deconvolvePulse} will use for these inputs.
 *
 * Long enough that the circular division does not wrap the tail of `h` onto its
 * onset: the linear convolution of the two is `response + pulse - 1` long.
 * Exported so a caller can build a `window` that lines up with it.
 */
export declare function deconvolveTransformLength(responseLength: number, pulseLength: number): number;
export declare const DEFAULT_REGULARIZATION = 0.001;
/**
 * Divide the driving pulse out of a recorded response.
 *
 * Returns an array the same length as `response`. Both inputs must be sampled
 * at the same rate, which for an ARD run means both come from the same
 * simulation: `response` from a receiver, `pulse` from the source's signal.
 */
export declare function deconvolvePulse(response: Float32Array, pulse: Float32Array, options: DeconvolveOptions): Float32Array;
/**
 * Complementary spectral windows, one per octave band.
 *
 * Used by the per-band path (plan D3): ARD's boundary treatment is
 * frequency-independent by construction, so the only way to honour a material's
 * octave-band absorption is to run the simulation once per band with that
 * band's `alpha` and add the filtered results.
 *
 * **The windows sum to exactly one at every frequency inside the outer edges**,
 * because adjacent crossovers are `sin²` and `cos²` of the same argument. That
 * is what makes the per-band path degenerate to the single-run path when the
 * absorption happens to be flat, and it is the property the test checks — a set
 * of windows that summed to anything else would change the broadband level as a
 * side effect of asking for more accuracy.
 *
 * The lowest band extends down to DC and the highest up to Nyquist, so no
 * energy is dropped at the ends.
 */
export declare function octaveBandWindows(n: number, sampleRate: number, centres: readonly number[], transition?: number): Float64Array[];
/** Multiply a signal by a spectral window, in place of a time-domain filter. */
export declare function applySpectralWindow(signal: Float32Array, window: Float64Array): Float32Array;
