/**
 * Angle-dependent reflection off a locally-reacting surface.
 *
 * ```
 * R(θ) = (ξ·cosθ − 1) / (ξ·cosθ + 1)
 * ```
 *
 * with `ξ` the normalized specific acoustic impedance `Z_s/(ρc)` and `θ` the
 * angle from the surface normal (0 at normal incidence, π/2 at grazing).
 *
 * ## Which root of `α = 1 − R²`
 *
 * This module reads α as a normal-incidence coefficient, which fixes
 * `|R(0)| = sqrt(1 − α)` and leaves the sign free. (The database itself holds
 * random-incidence, Sabine, data; the wave solvers invert that through
 * `random-incidence.ts` instead (#221). The geometrical solvers still take this
 * normal-incidence reading, pending their own change.) Both roots are physical —
 * `ξ > 1` for a surface stiffer than air, `ξ < 1` for one softer — so the
 * choice has to be made deliberately rather than fallen into:
 *
 * ```
 * ξ = (1 + sqrt(1 − α)) / (1 − sqrt(1 − α))   ≥ 1
 * ```
 *
 * This is the branch that degenerates to a **rigid** wall as `α → 0`, which is
 * what a caller asking for zero absorption means, and it is the branch
 * `compute/ard/impedance.ts` uses — so the wave solver and the geometrical
 * solvers agree about the same surface. Room materials are porous absorbers
 * backed by structure; the soft branch describes something else.
 *
 * Three things follow, and all three are tested:
 *
 *  - **A rigid wall reflects with R = +1**, not −1. It is a pressure-doubling
 *    boundary: `p_total = 2·p_incident` at the surface. R = −1 is a
 *    pressure-release surface, which a wall is not. This is the convention
 *    issue #124 asked to have documented; it did not require a particular sign.
 *  - **R changes sign at `cosθ = 1/ξ`.** Absorption rises to a maximum there
 *    and falls to zero at grazing. The reciprocal branch cannot produce that
 *    crossing at all — it leaves `ξ·cosθ − 1 < 0` at every angle — so
 *    absorption fell monotonically from normal incidence instead, and rooms
 *    with oblique reflections came out too live. See issue #200.
 *  - **`α(0)` is exactly the database coefficient** either way. The branch
 *    only moves the off-normal behaviour, which is why this survived #35 and
 *    #65: every normal-incidence check passes under both.
 */

/**
 * Normalized specific acoustic impedance for a normal-incidence absorption
 * coefficient. `Infinity` for a perfectly rigid surface.
 *
 * The one definition of this mapping in the repository: `compute/ard/impedance.ts`
 * validates its input and then delegates here, so the wave solver and the
 * geometrical solvers cannot drift apart about what a material is.
 */
export function impedanceForAbsorption(α: number): number {
  const r = reflectionMagnitude(α);
  return r >= 1 ? Infinity : (1 + r) / (1 - r);
}

/**
 * `sqrt(1 − α)` — the normal-incidence reflection magnitude — over a clamped α.
 *
 * Both public functions go through this so the clamp cannot drift between the
 * `ξ` form and the division-free one. `α` outside [0, 1] clamps, and a
 * **non-finite** α falls back to 0, i.e. rigid: `Math.min(1, NaN)` is `NaN` and
 * would otherwise propagate all the way out as a `NaN` reflection, so a failed
 * material lookup would silently poison an entire ray path rather than behave
 * like an unpainted wall.
 *
 * `θ` is deliberately **not** given the same treatment. A `NaN` angle means a
 * degenerate surface normal, which is a geometry bug worth surfacing rather
 * than defaulting; there is no sensible angle to substitute.
 */
function reflectionMagnitude(α: number): number {
  const clamped = Number.isFinite(α) ? Math.min(1, Math.max(0, α)) : 0;
  return Math.sqrt(1 - clamped);
}

/**
 * Signed pressure R. Hard wall (α = 0) → R = +1 at every angle.
 *
 * Written without ever forming `ξ`, by multiplying numerator and denominator
 * through by `(1 − r)`:
 *
 * ```
 * R = [(1 + r)·cosθ − (1 − r)] / [(1 + r)·cosθ + (1 − r)],   r = sqrt(1 − α)
 * ```
 *
 * Algebraically identical (agreement to 2.2e-16 across α and θ) and free of the
 * `α = 0` singularity, which matters because the GPU path evaluates the same
 * expression in f32 where `ξ` would be `inf` and `(inf − 1)/(inf + 1)` is
 * `NaN` — not just at grazing, but at *every* angle. `ray-trace.wgsl` carries
 * the same form for that reason.
 */
export function pressureReflectionCoefficient(α: number, θ: number): number {
  const r = reflectionMagnitude(α);
  const cosθ = Math.abs(Math.cos(θ));
  const numerator = (1 + r) * cosθ - (1 - r);
  const denominator = (1 + r) * cosθ + (1 - r);
  // Only reachable at α = 0 exactly at grazing, where the limit along every
  // approach in α is +1: a rigid surface reflects fully at any angle.
  return denominator === 0 ? 1 : numerator / denominator;
}

/** Energy reflection R² ∈ [0, 1]. LTP / intensity paths use this. */
export function reflectionCoefficient(α: number, θ: number) {
  const R = pressureReflectionCoefficient(α, θ);
  return R * R;
}

export default reflectionCoefficient;
