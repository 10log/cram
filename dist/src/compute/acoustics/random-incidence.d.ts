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
/** Paris's diffuse-field absorption of a real normalized impedance `ξ`, in 3D. */
export declare function parisAbsorption(xi: number): number;
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
export declare function diffuseAbsorption2D(xi: number): number;
/** Diffuse-field absorption of `ξ` in 2 or 3 dimensions. */
export declare function randomIncidenceAbsorption(xi: number, dims: Dimensions): number;
/**
 * The most diffuse-field absorption a locally-reacting real impedance can
 * give: 0.951 in 3D (Paris's well-known limit) and its 2D counterpart.
 */
export declare function maxRandomIncidenceAbsorption(dims: Dimensions): number;
/**
 * Normalized impedance whose diffuse-field absorption is `alpha`, on the stiff
 * branch. `Infinity` for a rigid surface.
 *
 * Clamped like the geometrical path's mapping: non-finite reads as rigid, and
 * a coefficient above {@link maxRandomIncidenceAbsorption} — chamber data can
 * exceed 1 — returns the peak impedance, the most absorbing wall there is.
 */
export declare function impedanceForRandomIncidenceAbsorption(alpha: number, dims: Dimensions): number;
