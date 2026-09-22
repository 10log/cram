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

import { createComplexFftPlan } from './fft';

/** Smallest power of two at or above `n`. */
export function nextPowerOfTwo(n: number): number {
  if (!Number.isInteger(n) || n < 1) throw new Error(`Expected a positive integer, got ${n}`);
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/**
 * Free-field pressure per unit injected forcing sample, at distance `r`.
 *
 * See the module comment for the derivation and the measurement that confirms
 * it. `r` is in metres; the expression diverges at the source cell itself and
 * is meaningless inside about two cells of it.
 */
export function freeFieldGain(dx: number, c: number, r: number): number {
  if (!(dx > 0) || !(c > 0) || !(r > 0)) {
    throw new Error(`freeFieldGain needs positive dx, c and r; got ${dx}, ${c}, ${r}`);
  }
  return dx ** 3 / (4 * Math.PI * c * c * r);
}

/**
 * Factor taking a deconvolved simulation record to an impulse response whose
 * free-field direct arrival has area `1/r`.
 *
 * That is the same convention as the geometric solvers: convolving the result
 * with a signal expressed as its pressure at 1 m gives the pressure at the
 * receiver. Multiply by `Lp2P(source.initialSPL)` for pascals.
 */
export function calibrationScale(dx: number, c: number): number {
  return (4 * Math.PI * c * c) / dx ** 3;
}

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
export function bandWindow(
  n: number,
  sampleRate: number,
  options: BandWindowOptions = {},
): Float64Array {
  const { fLow = 0, fHigh = Infinity, transition = 0.25 } = options;
  if (!(sampleRate > 0)) throw new Error(`sampleRate must be positive, got ${sampleRate}`);
  if (fHigh <= fLow) throw new Error(`fHigh (${fHigh}) must exceed fLow (${fLow})`);

  const window = new Float64Array(n);
  const binHz = sampleRate / n;
  const half = Math.floor(n / 2);

  for (let k = 0; k <= half; k++) {
    const f = k * binHz;
    window[k] = edgeGain(f, fLow, transition, true) * edgeGain(f, fHigh, transition, false);
    // Mirror onto the negative frequencies. Bin 0 and, for even n, bin n/2 are
    // their own mirrors and must not be written twice.
    if (k > 0 && k < n - k) window[n - k] = window[k];
  }
  return window;
}

/**
 * Raised-cosine gain across one band edge.
 *
 * `rising` is the low edge (0 below, 1 above); otherwise the high edge. An edge
 * at 0 Hz or at infinity is the absence of an edge and returns 1 throughout.
 * The transition is symmetric in octaves: it spans
 * `[edge/(1+transition), edge·(1+transition)]`.
 */
function edgeGain(f: number, edge: number, transition: number, rising: boolean): number {
  if (edge <= 0) return rising ? 1 : 0;
  if (!Number.isFinite(edge)) return rising ? 0 : 1;
  if (transition <= 0) {
    if (rising) return f >= edge ? 1 : 0;
    return f <= edge ? 1 : 0;
  }
  const lo = edge / (1 + transition);
  const hi = edge * (1 + transition);
  if (f <= lo) return rising ? 0 : 1;
  if (f >= hi) return rising ? 1 : 0;
  // Position within the transition, in log frequency, so the two halves of a
  // crossover are exact complements.
  const x = (Math.log2(f) - Math.log2(lo)) / (Math.log2(hi) - Math.log2(lo));
  const s = Math.sin((Math.PI / 2) * x);
  const cosine = Math.cos((Math.PI / 2) * x);
  return rising ? s * s : cosine * cosine;
}

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
}

export const DEFAULT_REGULARIZATION = 1e-3;

/**
 * Divide the driving pulse out of a recorded response.
 *
 * Returns an array the same length as `response`. Both inputs must be sampled
 * at the same rate, which for an ARD run means both come from the same
 * simulation: `response` from a receiver, `pulse` from the source's signal.
 */
export function deconvolvePulse(
  response: Float32Array,
  pulse: Float32Array,
  options: DeconvolveOptions,
): Float32Array {
  const {
    sampleRate,
    fMax,
    fMin = fMax / 32,
    regularization = DEFAULT_REGULARIZATION,
    transition = 0.25,
  } = options;

  if (!(sampleRate > 0)) throw new Error(`sampleRate must be positive, got ${sampleRate}`);
  if (!(fMax > 0)) throw new Error(`fMax must be positive, got ${fMax}`);
  if (!(regularization > 0)) {
    // Zero regularization is division by a spectrum with a zero in it. The
    // result is not "more accurate", it is the regularizer's job done by
    // floating point rounding.
    throw new Error(`regularization must be positive, got ${regularization}`);
  }
  if (response.length === 0) return new Float32Array(0);

  // Long enough that the circular division does not wrap the tail of `h` onto
  // its onset: the linear convolution of the two inputs is
  // `response.length + pulse.length - 1` long.
  const n = nextPowerOfTwo(response.length + pulse.length);
  const plan = createComplexFftPlan(n);

  const pRe = new Float64Array(n);
  const pIm = new Float64Array(n);
  pRe.set(response);
  plan.forward(pRe, pIm);

  const sRe = new Float64Array(n);
  const sIm = new Float64Array(n);
  for (let i = 0; i < Math.min(pulse.length, n); i++) sRe[i] = pulse[i];
  plan.forward(sRe, sIm);

  let peakPower = 0;
  for (let k = 0; k < n; k++) {
    const power = sRe[k] * sRe[k] + sIm[k] * sIm[k];
    if (power > peakPower) peakPower = power;
  }
  if (peakPower === 0) {
    throw new Error('The driving pulse is all zeros; there is nothing to deconvolve');
  }
  const lambda = regularization * peakPower;

  const window = bandWindow(n, sampleRate, { fLow: fMin, fHigh: fMax, transition });

  for (let k = 0; k < n; k++) {
    const denominator = sRe[k] * sRe[k] + sIm[k] * sIm[k] + lambda;
    const gain = window[k] / denominator;
    // P · conj(S)
    const re = (pRe[k] * sRe[k] + pIm[k] * sIm[k]) * gain;
    const im = (pIm[k] * sRe[k] - pRe[k] * sIm[k]) * gain;
    pRe[k] = re;
    pIm[k] = im;
  }

  plan.inverseUnscaled(pRe, pIm);

  const out = new Float32Array(response.length);
  for (let i = 0; i < out.length; i++) out[i] = pRe[i] / n;
  return out;
}

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
export function octaveBandWindows(
  n: number,
  sampleRate: number,
  centres: readonly number[],
  transition = 0.25,
): Float64Array[] {
  if (centres.length === 0) throw new Error('Need at least one band centre');
  if (!(transition > 0) || (1 + transition) ** 2 >= 2) {
    // Each transition spans +/- log2(1 + transition) octaves about its
    // crossover. Wider than half an octave and adjacent transitions overlap,
    // at which point a band is still rising where it is already falling and
    // the windows no longer sum to one — the guarantee this function exists to
    // provide, silently gone.
    throw new Error(
      `transition must be in (0, ${(Math.SQRT2 - 1).toFixed(4)}) so octave transitions do ` +
        `not overlap, got ${transition}`,
    );
  }
  for (let i = 1; i < centres.length; i++) {
    if (!(centres[i] > centres[i - 1])) {
      throw new Error(`Band centres must increase, got ${centres[i - 1]} then ${centres[i]}`);
    }
  }

  // Crossovers at the geometric mean of adjacent centres, which for octave
  // spacing is the usual sqrt(2) edge.
  return centres.map((_, index) => {
    const fLow = index === 0 ? 0 : Math.sqrt(centres[index - 1] * centres[index]);
    const fHigh =
      index === centres.length - 1
        ? Infinity
        : Math.sqrt(centres[index] * centres[index + 1]);
    return bandWindow(n, sampleRate, { fLow, fHigh, transition });
  });
}

/** Multiply a signal by a spectral window, in place of a time-domain filter. */
export function applySpectralWindow(signal: Float32Array, window: Float64Array): Float32Array {
  const n = window.length;
  if (signal.length > n) {
    throw new Error(`Window of length ${n} is shorter than the signal (${signal.length})`);
  }
  const plan = createComplexFftPlan(n);
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  re.set(signal);
  plan.forward(re, im);
  for (let k = 0; k < n; k++) {
    re[k] *= window[k];
    im[k] *= window[k];
  }
  plan.inverseUnscaled(re, im);
  const out = new Float32Array(signal.length);
  for (let i = 0; i < out.length; i++) out[i] = re[i] / n;
  return out;
}
