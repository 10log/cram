/**
 * Random-incidence (diffuse-field) absorption of a locally-reacting surface,
 * and its inverse — the reading the wave solvers give the material database
 * (#221).
 *
 * ## Why
 *
 * `src/db/material.json` is reverberation-chamber data: every material carries
 * an NRC, the sources are ISO 354 / ASTM C423 tables, and 1,362 of its 7,856
 * band values exceed 0.951 — the most a locally-reacting real impedance can
 * absorb from a diffuse field, and a value chamber measurements routinely
 * pass. It is Sabine absorption. Reading it as normal-incidence α, as
 * `impedanceForAbsorption` does, gives a softer wall than the material: the
 * impedance that absorbs 0.2 at normal incidence absorbs 0.323 of a diffuse
 * field in 3D (0.273 in 2D). The wave solvers' rooms therefore decayed faster
 * than Sabine or Eyring predict for the same materials. (#221 as filed had the
 * direction backwards; the fix is the same, and walls get stiffer.)
 *
 * The geometrical solvers still take the normal-incidence reading through
 * `reflection-coefficient.ts`; moving them is a separate change.
 *
 * ## The forward maps
 *
 * With `R(θ) = (ξcosθ − 1)/(ξcosθ + 1)` and `1 − R² = 4ξcosθ/(ξcosθ + 1)²`:
 *
 * - **3D**, a hemisphere weighted by `cosθ·sinθ` — Paris's formula, closed form:
 *   `α = (8/ξ)·[1 + 1/(1 + ξ) − (2/ξ)·ln(1 + ξ)]`. (Two test oracles in this
 *   repository carried `1 − (1/ξ)ln(1 + ξ) + 1/(1 + ξ)` instead, which exceeds 1
 *   near ξ = 1; `__tests__/random-incidence.spec.ts` checks the closed form
 *   against direct integration so the two cannot drift again.)
 * - **2D**, a half-plane weighted by `cosθ`: `α = ∫₀^{π/2} (1 − R²)·cosθ dθ`,
 *   which is what a 2D field's walls see. Also closed form — see
 *   {@link diffuseAbsorption2D}.
 *
 * ## The inverse
 *
 * Neither map is monotone: both rise from 0 at `ξ = ∞` (rigid) to a maximum
 * and fall again as `ξ → 0`. Like `impedanceForAbsorption`, the inverse takes
 * the stiff branch, `ξ ≥ ξ_peak`, which is the one that becomes rigid as
 * `α → 0`. A coefficient above the maximum — 0.951 at ξ = 1.567 in 3D, 0.966
 * at ξ = 1.306 in 2D — is simulated at the maximum rather than refused,
 * because chamber data exceeds it routinely (edge diffraction) and a
 * locally-reacting wall cannot do better.
 */

export type Dimensions = 2 | 3;

/** Absorption at or below this reads as rigid, the same epsilon the solvers use. */
const RIGID_EPSILON = 1e-6;

/** Paris's diffuse-field absorption of a real normalized impedance `ξ`, in 3D. */
export function parisAbsorption(xi: number): number {
  if (!(xi > 0)) throw new Error(`Impedance must be positive, got ${xi}`);
  if (!Number.isFinite(xi)) return 0;
  return (8 / xi) * (1 + 1 / (1 + xi) - (2 / xi) * Math.log1p(xi));
}

// 48-point Gauss–Legendre on [-1, 1], computed once by Newton iteration on P_n.
const GL_NODES: number[] = [];
const GL_WEIGHTS: number[] = [];
(() => {
  const n = 48;
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
    GL_NODES.push(x);
    GL_WEIGHTS.push(2 / ((1 - x * x) * dp * dp));
  }
})();

/** The 2D integral by quadrature: used near ξ = 1, where the closed form cancels. */
function diffuse2DQuadrature(xi: number): number {
  const half = Math.PI / 4;
  let total = 0;
  for (let i = 0; i < GL_NODES.length; i++) {
    const theta = half * (GL_NODES[i] + 1);
    const c = Math.cos(theta);
    const d = xi * c + 1;
    total += GL_WEIGHTS[i] * ((4 * xi * c) / (d * d)) * c;
  }
  return total * half;
}

/**
 * Diffuse-field absorption of a real normalized impedance `ξ`, in a 2D field.
 *
 * Closed form. With `u = cosθ`, `u²/(1 + ξu)² = ξ⁻²·[1 − 2/(1 + ξu) + 1/(1 + ξu)²]`,
 * so `α = (4/ξ)·[π/2 − 2·J₁ + J₂]` with `J₁ = ∫₀^{π/2} dθ/(1 + ξcosθ)` and
 * `J₂ = ∫₀^{π/2} dθ/(1 + ξcosθ)²`, both elementary (`J₂` is `−∂J/∂a` of
 * `∫dθ/(a + ξcosθ)` at `a = 1`). Quadrature would do for moderate ξ, but at
 * large ξ — small α, most walls — the integrand has a feature `1/ξ` wide at
 * grazing that a fixed rule misses by parts in 10⁶.
 */
export function diffuseAbsorption2D(xi: number): number {
  if (!(xi > 0)) throw new Error(`Impedance must be positive, got ${xi}`);
  if (!Number.isFinite(xi)) return 0;
  if (Math.abs(xi - 1) < 1e-2) return diffuse2DQuadrature(xi);
  let j1: number;
  let j2: number;
  if (xi > 1) {
    const s = Math.sqrt(xi * xi - 1);
    const at = Math.atanh(Math.sqrt((xi - 1) / (xi + 1)));
    j1 = (2 / s) * at;
    j2 = xi / (s * s) - (2 * at) / (s * s * s);
  } else {
    const s = Math.sqrt(1 - xi * xi);
    const at = Math.atan(Math.sqrt((1 - xi) / (1 + xi)));
    j1 = (2 / s) * at;
    j2 = (2 * at) / (s * s * s) - xi / (s * s);
  }
  return (4 / xi) * (Math.PI / 2 - 2 * j1 + j2);
}

/** Diffuse-field absorption of `ξ` in 2 or 3 dimensions. */
export function randomIncidenceAbsorption(xi: number, dims: Dimensions): number {
  return dims === 3 ? parisAbsorption(xi) : diffuseAbsorption2D(xi);
}

/** Impedance at which the diffuse-field absorption peaks, found once per dimension. */
function peak(dims: Dimensions): { xi: number; alpha: number } {
  // Golden-section search on ln ξ; both maps are unimodal, peaking near 1.5.
  let lo = Math.log(0.5);
  let hi = Math.log(20);
  const g = (Math.sqrt(5) - 1) / 2;
  const f = (t: number) => -randomIncidenceAbsorption(Math.exp(t), dims);
  let a = hi - g * (hi - lo);
  let b = lo + g * (hi - lo);
  let fa = f(a);
  let fb = f(b);
  for (let i = 0; i < 200 && hi - lo > 1e-13; i++) {
    if (fa < fb) {
      hi = b;
      b = a;
      fb = fa;
      a = hi - g * (hi - lo);
      fa = f(a);
    } else {
      lo = a;
      a = b;
      fa = fb;
      b = lo + g * (hi - lo);
      fb = f(b);
    }
  }
  const xi = Math.exp((lo + hi) / 2);
  return { xi, alpha: randomIncidenceAbsorption(xi, dims) };
}

const PEAK: Record<Dimensions, { xi: number; alpha: number }> = { 2: peak(2), 3: peak(3) };

/**
 * The most diffuse-field absorption a locally-reacting real impedance can
 * give: 0.951 in 3D (Paris's well-known limit) and its 2D counterpart.
 */
export function maxRandomIncidenceAbsorption(dims: Dimensions): number {
  return PEAK[dims].alpha;
}

/**
 * Normalized impedance whose diffuse-field absorption is `alpha`, on the stiff
 * branch. `Infinity` for a rigid surface.
 *
 * Clamped like the geometrical path's mapping: non-finite reads as rigid, and
 * a coefficient above {@link maxRandomIncidenceAbsorption} — chamber data can
 * exceed 1 — returns the peak impedance, the most absorbing wall there is.
 */
export function impedanceForRandomIncidenceAbsorption(alpha: number, dims: Dimensions): number {
  if (!Number.isFinite(alpha) || alpha <= RIGID_EPSILON) return Infinity;
  const { xi: xiPeak, alpha: alphaMax } = PEAK[dims];
  if (alpha >= alphaMax) return xiPeak;
  // α(ξ) falls monotonically from alphaMax at ξ_peak to 0 at ∞; bisect on ln ξ.
  let lo = Math.log(xiPeak);
  let hi = Math.log(1e12);
  for (let i = 0; i < 200 && hi - lo > 1e-14; i++) {
    const mid = (lo + hi) / 2;
    if (randomIncidenceAbsorption(Math.exp(mid), dims) > alpha) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
