/**
 * Locally-reacting impedance walls for the 2D FDTD field (#199).
 *
 * Before this, every FDTD 2D wall was perfectly rigid — `Surface.absorption`
 * was never read — and the only decay in a room came from the global `damping`
 * sponge on velocity. Because `dt = dx / (c·√2)`, the number of steps per
 * second of simulated time is a function of cell size, so the sponge imposed a
 * reverberation time that *halved when the grid was refined*: 71 s at
 * `dx = 0.5 m`, 5.6 s at the default 0.039 m. The decay was a property of the
 * mesh, not of the room.
 *
 * ## The boundary
 *
 * A locally-reacting surface of real specific impedance `ξ` (normalized by
 * `ρc`) satisfies
 *
 * ```
 * ∂p/∂n + (1/(ξ·c)) ∂p/∂t = 0
 * ```
 *
 * The stencil is second order — `mid = ¼(u + d + r + l)` — so a wall neighbour
 * is a single ghost cell, and the wall face sits halfway between the boundary
 * cell and that ghost. Writing the normal derivative across the face as
 * `(p_ghost − p_cell)/dx` and the time derivative at the face as the boundary
 * cell's own, the condition discretizes to
 *
 * ```
 * (p_ghost − p_cell)/dx + (1/(ξ·c)) · (dp_cell/dt) = 0
 * ```
 *
 * and this scheme hands `dp/dt` over for free: `velocity` is literally
 * `p^n − p^{n−1}`, the backward difference, so `dp/dt = v/dt`. Substituting
 * and collecting `C = c·dt/dx`:
 *
 * ```
 * p_ghost = p_cell − γ·v_cell,   γ = 1/(ξ·C)
 * ```
 *
 * One multiply-add on a value the update already has in a register, no per-face
 * history, and `γ = 0` returns `p_ghost = p_cell` — the rigid Neumann ghost
 * #111 installed, bit for bit. That exactness is why rigid rooms are untouched
 * by this change.
 *
 * ## Why this is cheaper than ARD's version of the same boundary
 *
 * `compute/ard/impedance.ts` derives the same physics but evaluates `∂p/∂t` at
 * the face, as the average of the ghost's and the cell's, which leaves the
 * ghost on both sides of the equation and needs a stored history per face cell.
 * It has to: ARD's 6th-order stencil reaches three cells past the boundary, so
 * there are three ghosts at depths `(k + ½)dx` and no cell-centred derivative
 * to borrow. Here there is exactly one ghost and the leapfrog already carries
 * the derivative, so the history term disappears. Simpler than the ARD case,
 * not harder — as #199 predicted.
 *
 * ## Delivered absorption
 *
 * Measured by the two-probe transfer-function method against the scheme's own
 * numerical wavenumber (`__tests__/impedance.spec.ts`), normal incidence:
 *
 * | requested α | 40 c/λ | 20 c/λ | 12 c/λ | 8 c/λ | 6 c/λ | 4 c/λ |
 * |-------------|--------|--------|--------|-------|-------|-------|
 * | 0.0         | 0.000  | 0.000  | 0.000  | 0.000 | 0.000 | 0.000 |
 * | 0.1         | 0.100  | 0.098  | 0.095  | 0.090 | 0.083 | 0.064 |
 * | 0.2         | 0.199  | 0.197  | 0.192  | 0.182 | 0.168 | 0.132 |
 * | 0.3         | 0.299  | 0.296  | 0.289  | 0.276 | 0.257 | 0.207 |
 * | 0.5         | 0.499  | 0.495  | 0.487  | 0.470 | 0.446 | 0.376 |
 * | 0.8         | 0.799  | 0.797  | 0.791  | 0.778 | 0.759 | 0.696 |
 * | 1.0         | 1.000  | 0.999  | 0.998  | 0.996 | 0.992 | 0.973 |
 *
 * Rigid is lossless at every resolution, as the algebra says it must be. The
 * error grows with the ghost's first-order placement of `∂p/∂t` — 0.013 at 12
 * cells per wavelength, 0.054 at 6, 0.124 at 4 — and always in the direction of
 * *under*-absorbing, so a coarse grid makes a room more reverberant than its
 * materials, never less. {@link FDTD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE} is
 * where that error passes 0.05.
 *
 * ## Stability
 *
 * The boundary costs no time step — FDTD 2D runs at `C = 1/√2` exactly, the
 * "maximally stable" 2D CFL locus, and it still does. It does bound `γ`.
 *
 * Reading the boundary cell's own update alone suggests it cannot: substituting
 * the ghost leaves `v^{n+1} = C²(p_neighbour − p_cell) + (1 − C²γ)·v^n`, a
 * first-order recursion with pole `1 − C²γ`, stable to `γ < 4`. That is the
 * wrong answer, and measuring said so. The mode that actually goes unstable is
 * a *surface* mode — the grid's checkerboard along the wall, strongest at the
 * corners — which no single-cell recursion sees. A 1-D strip, where the
 * checkerboard has no tangential direction to live in, is stable past `γ = 1.5`
 * and would have hidden this entirely.
 *
 * Measured on a 48 x 36 room with the checkerboard excited directly, peak
 * pressure sampled every 8,000 steps of 40,000:
 *
 * | γ    | 8k      | 16k     | 24k     | 32k     | 40k     |
 * |------|---------|---------|---------|---------|---------|
 * | 0.90 | 1.3e-3  | 2.8e-4  | 6.6e-5  | 1.1e-5  | 5.3e-6  |
 * | 0.99 | 1.3e-3  | 2.9e-4  | 6.6e-5  | 1.5e-5  | 3.3e-6  |
 * | 1.00 | 1.9e+1  | 1.9e+1  | 1.9e+1  | 1.9e+1  | 1.9e+1  |
 * | 1.005| 8.6e+30 | 5.2e+60 | 3.1e+90 | 1.8e+120| 1.1e+150|
 *
 * The transition is at `γ = 1` and it is sharp: below it the mode decays, at it
 * the mode sits there forever, above it the field diverges within a few
 * thousand steps. `γ = 1` has a tidy reading — the ghost becomes
 * `p − (p^n − p^{n−1}) = p^{n−1}`, a pure one-step delay — and it means
 * `ξ > 1/C`, so at this Courant number a wall cannot be made perfectly matched.
 * {@link MAX_GHOST_GAIN} keeps a margin below it and
 * {@link maxStableAbsorption} says what coefficient that allows: 0.961, which
 * only the most absorbing materials in the database reach.
 *
 * ARD needed a *Courant* clamp for its version of this boundary, because its
 * residual forcing feeds back through a 6th-order stencil. This one clamps the
 * coefficient instead and leaves the time step alone.
 */

import { RIGID_ALPHA_EPSILON, impedanceForAbsorption } from '../ard/impedance';

/**
 * Blue-channel value marking an air cell in the sourcemap.
 *
 * The shader's wall test is `b > 0`, so air is positive and a wall is zero or
 * negative — see {@link wallChannelForGhostGain}.
 */
export const AIR_CHANNEL = 1;

/**
 * Cells per wavelength at which the delivered coefficient is still within
 * about 0.05 of the requested one. Below this the walls read as more
 * reflective than their materials; see the table above.
 */
export const FDTD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE = 6;

/**
 * Largest ghost gain the field stays stable at.
 *
 * The bound is `γ < 1` — see the stability section above — and this keeps 5%
 * below it. The transition is sharp enough that a margin is worth having and
 * cheap enough that 5% costs nothing: it caps absorption at 0.961 rather than
 * at 0.971.
 */
export const MAX_GHOST_GAIN = 0.95;

/**
 * Ghost gain `γ = 1/(ξ·C)` for a surface of absorption `alpha` at Courant `C`,
 * clamped to {@link MAX_GHOST_GAIN}.
 *
 * Returns 0 — the rigid ghost — for a surface at or below
 * {@link RIGID_ALPHA_EPSILON}, so a rigid wall costs nothing and behaves
 * exactly as it did before impedance existed.
 */
export function ghostGainForAbsorption(alpha: number, courant: number): number {
  if (!(courant > 0)) throw new Error(`Courant number must be positive, got ${courant}`);
  if (alpha <= RIGID_ALPHA_EPSILON) return 0;
  const xi = impedanceForAbsorption(alpha);
  const gamma = Number.isFinite(xi) ? 1 / (xi * courant) : 0;
  return Math.min(gamma, MAX_GHOST_GAIN);
}

/**
 * Highest absorption coefficient the clamp lets a wall deliver at `courant`.
 *
 * 0.961 at the CFL locus. A surface above this is simulated as this — the
 * alternative is a field that diverges, and the difference between 0.96 and
 * 1.00 absorbing is a fraction of a dB per bounce.
 */
export function maxStableAbsorption(courant: number): number {
  if (!(courant > 0)) throw new Error(`Courant number must be positive, got ${courant}`);
  const xi = 1 / (MAX_GHOST_GAIN * courant);
  if (!(xi > 1)) return 1;
  const r = (xi - 1) / (xi + 1);
  return 1 - r * r;
}

/**
 * Pack a ghost gain into the sourcemap's blue channel.
 *
 * Air is `AIR_CHANNEL`; a wall is `-γ`, which is `0` for a rigid wall. The old
 * encoding wrote exactly `0` for every wall, so a project built before this
 * change reads back as rigid rather than as something undefined.
 */
export function wallChannelForGhostGain(gamma: number): number {
  // `-0` would work — it fails the shader's `b > 0` air test just as `0` does —
  // but a rigid wall writing the exact same bit pattern it used to is easier to
  // reason about, and to assert.
  return gamma === 0 ? 0 : -gamma;
}

/** `true` for a wall cell, matching the shader's `b > 0` air test. */
export function isWallChannel(channel: number): boolean {
  return !(channel > 0);
}

/** Ghost gain carried by a channel value. Air cells have none. */
export function ghostGainFromChannel(channel: number): number {
  return channel > 0 ? 0 : -channel;
}

/**
 * Sourcemap blue channel for one wall, at the field's Courant number.
 *
 * A disabled wall is air. This is the whole of the decision `updateWalls`
 * makes per wall, factored out so it can be tested — constructing the solver
 * itself needs a WebGL context.
 */
export function wallChannelFor(
  wall: { enabled: boolean; absorption: number },
  courant: number,
): number {
  if (!wall.enabled) return AIR_CHANNEL;
  return wallChannelForGhostGain(ghostGainForAbsorption(wall.absorption, courant));
}
