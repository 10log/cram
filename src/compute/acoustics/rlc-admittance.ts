/**
 * Frequency-dependent wall admittance as parallel series-RLC branches, and a
 * fitter from octave-band absorption (#222).
 *
 * ## The model
 *
 * Following PFFDTD (Bilbao, Hamilton, Botts & Savioja 2016), a surface's
 * specific (ρc-normalised) admittance is a sum of branches, each a series
 * mass–resistance–spring:
 *
 * ```
 * Y(ω) = Σ_b 1 / Z_b(ω),     Z_b(ω) = jω·D_b + E_b + F_b/(jω)
 * ```
 *
 * `D` (s), `E` (dimensionless) and `F` (1/s) are the normalised inductance,
 * resistance and elastance. Each `Z_b` has a positive real part `E_b`
 * whenever `D, E, F ≥ 0`, so the surface is **passive**: it never returns
 * more energy than it receives, and the wave solvers' energy balance
 * (#223) stays provable. A single branch with `D = F = 0` is the
 * frequency-independent real impedance `ξ = E` the solvers already use.
 *
 * ## The fit
 *
 * Following PFFDTD's `fit_to_Sabs_oct_11`, there is one branch per octave
 * band. It resonates at the band centre `ω₀` with half-power bandwidth
 * `ω₀/√2`, and the only free parameter is its peak admittance `Ŷ`:
 *
 * ```
 * D = 1/(Ŷ·Δω),   E = 1/Ŷ,   F = ω₀²/(Ŷ·Δω)
 * ```
 *
 * PFFDTD fits normal-incidence absorption to a target built from the
 * Sabine data. This fitter goes straight at the quantity the data is: the
 * model's **random-incidence** absorption averaged over each band
 * ({@link bandAbsorption}) is driven to the band's coefficient (#221), in 2D
 * or 3D. It uses a stiff-side search on each `Ŷ` in turn (see
 * {@link fitRlcToOctaveBands}). Only non-negative
 * `Ŷ` is ever produced, so every fitted branch is passive by construction.
 */

import {
  impedanceForRandomIncidenceAbsorption,
  maxRandomIncidenceAbsorption,
  type Dimensions,
} from './random-incidence';

/** One series-RLC branch of a normalised admittance. */
export interface RlcBranch {
  /** Normalised inductance (mass), seconds. */
  D: number;
  /** Normalised resistance, dimensionless. */
  E: number;
  /** Normalised elastance (spring), 1/seconds. */
  F: number;
}

/** A complex number as `[re, im]`. */
export type Complex = [number, number];

/** Specific admittance `Y(ω)` of a set of branches, at frequency `f` in Hz. */
export function branchAdmittance(branches: readonly RlcBranch[], f: number): Complex {
  const w = 2 * Math.PI * f;
  let re = 0;
  let im = 0;
  for (const { D, E, F } of branches) {
    // Z = E + j(ωD − F/ω); 1/Z = (E − jX)/(E² + X²).
    const x = w * D - (w > 0 ? F / w : F > 0 ? Infinity : 0);
    const m = E * E + x * x;
    if (!(m > 0) || !Number.isFinite(m)) continue;
    re += E / m;
    im -= x / m;
  }
  return [re, im];
}

/** Specific impedance `ζ = 1/Y`, or `null` where the admittance is zero (rigid). */
export function branchImpedance(branches: readonly RlcBranch[], f: number): Complex | null {
  const [re, im] = branchAdmittance(branches, f);
  const m = re * re + im * im;
  return m > 0 ? [re / m, -im / m] : null;
}

// 12-point Gauss–Legendre on [-1, 1], by Newton iteration on P_n.
const GL_X: number[] = [];
const GL_W: number[] = [];
(() => {
  const n = 12;
  for (let i = 1; i <= n; i++) {
    let x = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
    let dp = 0;
    for (let iter = 0; iter < 100; iter++) {
      let p0 = 1;
      let p1 = x;
      for (let k = 2; k <= n; k++) {
        const p2 = ((2 * k - 1) * x * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      dp = (n * (x * p1 - p0)) / (x * x - 1);
      const dx = p1 / dp;
      x -= dx;
      if (Math.abs(dx) < 1e-16) break;
    }
    GL_X.push(x);
    GL_W.push(2 / ((1 - x * x) * dp * dp));
  }
})();

/**
 * Panels in `x = π/2 − θ`, the angle from grazing, graded geometrically
 * towards grazing. A stiff wall's absorption lives in a feature about `1/|ζ|`
 * wide there, which a fixed rule misses (see `random-incidence.ts`); halving
 * panels resolve it at any `|ζ|` up to about 10⁹.
 */
const PANELS: [number, number][] = (() => {
  const edges = [Math.PI / 2];
  while (edges[edges.length - 1] > 1e-9) edges.push(edges[edges.length - 1] / 2);
  edges.push(0);
  const panels: [number, number][] = [];
  for (let i = 0; i < edges.length - 1; i++) panels.push([edges[i + 1], edges[i]]);
  return panels;
})();

/**
 * Diffuse-field absorption of a locally-reacting surface of complex specific
 * impedance `ζ`, in a 2D or 3D field. This is the complex generalisation of
 * `randomIncidenceAbsorption` in `random-incidence.ts`, and agrees with it for
 * real `ζ`.
 *
 * `1 − |R(θ)|² = 4·Re(ζ)·cosθ / |ζ·cosθ + 1|²`, averaged over a hemisphere
 * weighted by `2·sinθ·cosθ` (3D) or a half-plane weighted by `cosθ` (2D).
 */
export function complexRandomIncidenceAbsorption(zeta: Complex, dims: Dimensions): number {
  const [zr, zi] = zeta;
  if (!(zr > 0)) return 0;
  let total = 0;
  for (const [a, b] of PANELS) {
    const half = (b - a) / 2;
    const mid = (a + b) / 2;
    for (let i = 0; i < GL_X.length; i++) {
      const x = mid + half * GL_X[i];
      // θ = π/2 − x: cosθ = sin x, sinθ = cos x.
      const c = Math.sin(x);
      const dr = zr * c + 1;
      const di = zi * c;
      const loss = (4 * zr * c) / (dr * dr + di * di);
      const weight = dims === 3 ? 2 * Math.cos(x) * c : c;
      total += GL_W[i] * half * loss * weight;
    }
  }
  return total;
}

/** Diffuse-field absorption of a set of branches at frequency `f`. Rigid is 0. */
export function branchAbsorption(branches: readonly RlcBranch[], f: number, dims: Dimensions): number {
  const zeta = branchImpedance(branches, f);
  return zeta ? complexRandomIncidenceAbsorption(zeta, dims) : 0;
}

/** Log-spaced samples across an octave band, at which a band's absorption is averaged. */
const BAND_SAMPLES = 9;

/**
 * A model's absorption over the octave band centred on `fc`: the mean of
 * {@link branchAbsorption} at {@link BAND_SAMPLES} log-spaced frequencies
 * from `fc/√2` to `fc·√2`. That is what an octave-band filter of a decay
 * sees, near enough.
 */
export function bandAbsorption(
  branches: readonly RlcBranch[],
  fc: number,
  dims: Dimensions,
): number {
  let total = 0;
  for (let i = 0; i < BAND_SAMPLES; i++) {
    const f = fc * 2 ** ((i + 0.5) / BAND_SAMPLES - 0.5);
    total += branchAbsorption(branches, f, dims);
  }
  return total / BAND_SAMPLES;
}

/** PFFDTD's resonant branch: peak admittance `Ŷ` at `f0`, half-power bandwidth `ω₀/√2`. */
export function resonantBranch(peakAdmittance: number, f0: number, relativeBandwidth = Math.SQRT1_2): RlcBranch {
  const w0 = 2 * Math.PI * f0;
  const dw = w0 * relativeBandwidth;
  return {
    D: 1 / (peakAdmittance * dw),
    E: 1 / peakAdmittance,
    F: (w0 * w0) / (peakAdmittance * dw),
  };
}

/**
 * A shelving branch: flat admittance `Ŷ` on one side of a corner, rolling
 * off on the other. `'low'` is a mass and a resistance (`F = 0`), flat below
 * `fc`. `'high'` is a spring and a resistance (`D = 0`), flat above `fc`. The
 * fitter puts these at the two outermost bands, where a resonant branch
 * would leave the outer half of its band unsupported.
 */
export function shelfBranch(peakAdmittance: number, fc: number, side: 'low' | 'high'): RlcBranch {
  const wc = 2 * Math.PI * fc;
  const E = 1 / peakAdmittance;
  return side === 'low' ? { D: E / wc, E, F: 0 } : { D: 0, E, F: E * wc };
}

export interface RlcFit {
  /** One branch per band with a non-zero target, in band order. */
  branches: RlcBranch[];
  /** Band centres, as given. */
  bands: number[];
  /** The target per band, after clamping to what a locally-reacting wall can do. */
  target: number[];
  /** The fitted model's {@link bandAbsorption} per band. */
  fitted: number[];
  /** Largest `|fitted − target|` over the bands. */
  maxError: number;
  iterations: number;
}

export interface FitOptions {
  dims: Dimensions;
  /** Each branch's half-power bandwidth over its centre frequency. PFFDTD's is 1/√2. */
  relativeBandwidth?: number;
  /** Stop once every band is within this of its target. */
  tolerance?: number;
  maxIterations?: number;
}

/**
 * Relative bandwidths a resonant branch may take, from PFFDTD's 1/√2 (half an
 * octave) down to a quarter of one: narrower where a band must not leak.
 */
const SHAPE_CHOICES = [Math.SQRT1_2, 0.5, 0.35, 0.25];

/** Search range for a branch's peak admittance, on a log scale. */
const LOG_PEAK_MIN = Math.log(1e-8);
const LOG_PEAK_MAX = Math.log(50);

/**
 * Fit branches to octave-band random-incidence absorption (#222).
 *
 * `absorption[i]` is the Sabine coefficient of the band centred on
 * `bands[i]` Hz. Coefficients above the locally-reacting limit
 * (`maxRandomIncidenceAbsorption`) are fitted to the limit. A band at zero
 * gets no branch, so a fully rigid material has none and is the rigid wall.
 *
 * Gauss–Seidel over the bands. Each band's `Ŷ` is solved in one dimension
 * with the others held, and the sweeps repeat until every band is within
 * `tolerance`. A band's absorption rises with its own `Ŷ` to a peak and then
 * falls, and both sides can reach the same value. The solve takes the
 * **stiff** side, as every inversion in this repository does:
 *
 * 1. Golden-section search for the `Ŷ` that maximises the band's absorption.
 * 2. If the target is at or above that maximum, which chamber data at the
 *    locally-reacting limit often is, the band takes the maximum.
 * 3. Otherwise, bisect below it, where absorption is increasing.
 *
 * A fixed-point update on `Ŷ` was tried first. It walks past the peak when
 * neighbouring branches overlap, and there it runs away to zero absorption.
 */
export function fitRlcToOctaveBands(
  bands: readonly number[],
  absorption: readonly number[],
  options: FitOptions,
): RlcFit {
  const { dims, tolerance = 1e-3, maxIterations = 30, relativeBandwidth = Math.SQRT1_2 } = options;
  if (bands.length !== absorption.length) {
    throw new Error(`${bands.length} bands but ${absorption.length} coefficients`);
  }
  const limit = maxRandomIncidenceAbsorption(dims);
  const target = absorption.map((a) =>
    Number.isFinite(a) ? Math.min(Math.max(a, 0), limit) : 0,
  );
  const active = target.map((a) => a > 1e-6);
  const peak = target.map((a) => {
    if (!(a > 1e-6)) return 0;
    const xi = impedanceForRandomIncidenceAbsorption(a, dims);
    return Number.isFinite(xi) ? 1 / xi : 0;
  });

  // Each band's shape: a resonant branch's relative bandwidth, or a shelf's
  // corner as a multiple of its band centre. The sweep picks among
  // SHAPE_CHOICES per band, so a strong band beside a weak one can narrow
  // instead of leaking into it.
  const last = bands.length - 1;
  const shape = bands.map((_, i) => (i === 0 ? Math.SQRT2 : i === last ? Math.SQRT1_2 : relativeBandwidth));
  const branchFor = (i: number, y: number): RlcBranch => {
    if (bands.length === 1) return { D: 0, E: 1 / y, F: 0 };
    if (i === 0) return shelfBranch(y, bands[i] * shape[i], 'low');
    if (i === last) return shelfBranch(y, bands[i] * shape[i], 'high');
    return resonantBranch(y, bands[i], shape[i]);
  };
  const choices = (i: number): number[] =>
    bands.length === 1
      ? [0]
      : i === 0
        ? [Math.SQRT2, 1, Math.SQRT1_2]
        : i === last
          ? [Math.SQRT1_2, 1, Math.SQRT2]
          : [relativeBandwidth, ...SHAPE_CHOICES.filter((c) => c !== relativeBandwidth)];
  const build = () =>
    bands.flatMap((_, i) => (active[i] && peak[i] > 0 ? [branchFor(i, peak[i])] : []));
  // During band i's search every other branch is held, so their admittance
  // at band i's sample frequencies is summed once, and each trial adds only
  // branch i's.
  const samples = (fc: number) =>
    Array.from({ length: BAND_SAMPLES }, (_, k) => fc * 2 ** ((k + 0.5) / BAND_SAMPLES - 0.5));
  let heldI = -1;
  let held: Complex[] = [];
  const bandWith = (i: number, logPeak: number) => {
    const fs = samples(bands[i]);
    if (heldI !== i) {
      const others = bands.flatMap((_, j) =>
        j !== i && active[j] && peak[j] > 0 ? [branchFor(j, peak[j])] : [],
      );
      held = fs.map((f) => branchAdmittance(others, f));
      heldI = i;
    }
    const own = [branchFor(i, Math.exp(logPeak))];
    let total = 0;
    for (let k = 0; k < fs.length; k++) {
      const [ore, oim] = branchAdmittance(own, fs[k]);
      const re = held[k][0] + ore;
      const im = held[k][1] + oim;
      const m = re * re + im * im;
      total += m > 0 ? complexRandomIncidenceAbsorption([re / m, -im / m], dims) : 0;
    }
    return total / fs.length;
  };

  /** Band i's own solve, others held: the stiff-side Ŷ that meets its target. */
  const solveBand = (i: number): number => {
    // 1. The most this band can absorb, with the others held.
    const g = (Math.sqrt(5) - 1) / 2;
    let lo = LOG_PEAK_MIN;
    let hi = LOG_PEAK_MAX;
    let x1 = hi - g * (hi - lo);
    let x2 = lo + g * (hi - lo);
    let f1 = bandWith(i, x1);
    let f2 = bandWith(i, x2);
    for (let k = 0; k < 60 && hi - lo > 1e-6; k++) {
      if (f1 > f2) {
        hi = x2;
        x2 = x1;
        f2 = f1;
        x1 = hi - g * (hi - lo);
        f1 = bandWith(i, x1);
      } else {
        lo = x1;
        x1 = x2;
        f1 = f2;
        x2 = lo + g * (hi - lo);
        f2 = bandWith(i, x2);
      }
    }
    const best = (lo + hi) / 2;
    // 2. At or past the maximum: the most absorbing wall there is.
    if (target[i] >= bandWith(i, best)) return Math.exp(best);
    // 3. The stiff side, where absorption rises with Ŷ.
    let a = LOG_PEAK_MIN;
    let b = best;
    for (let k = 0; k < 60 && b - a > 1e-9; k++) {
      const m = (a + b) / 2;
      if (bandWith(i, m) < target[i]) a = m;
      else b = m;
    }
    return Math.exp((a + b) / 2);
  };

  const measure = () => {
    const branches = build();
    const fitted = bands.map((f) => bandAbsorption(branches, f, dims));
    const maxError = Math.max(0, ...fitted.map((a, i) => Math.abs(a - target[i])));
    return { branches, fitted, maxError };
  };

  let state = measure();
  let iterations = 0;
  while (state.maxError > tolerance && iterations < maxIterations) {
    for (let i = 0; i < bands.length; i++) {
      if (!active[i]) continue;
      // Every shape this band may take, each solved for its own target;
      // keep whichever leaves the whole fit closest.
      let bestShape = shape[i];
      let bestPeak = peak[i];
      let bestError = Infinity;
      for (const c of choices(i)) {
        shape[i] = c;
        heldI = -1;
        peak[i] = solveBand(i);
        const error = measure().maxError;
        if (error < bestError - 1e-12) {
          bestError = error;
          bestShape = c;
          bestPeak = peak[i];
        }
      }
      shape[i] = bestShape;
      peak[i] = bestPeak;
      heldI = -1;
    }
    const next = measure();
    iterations++;
    // Gauss–Seidel with a discrete shape choice can cycle; stop when a sweep
    // no longer helps.
    const stalled = next.maxError > state.maxError - 1e-6;
    state = next;
    if (stalled) break;
  }
  return { branches: state.branches, bands: [...bands], target, fitted: state.fitted, maxError: state.maxError, iterations };
}
