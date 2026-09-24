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
 * | 0.98        | 0.980  | 0.979  | 0.976  | 0.971 | 0.962 | 0.929 |
 * | 1.0         | 1.000  | 0.998  | 0.995  | 0.988 | 0.978 | 0.938 |
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
 * `p − (p^n − p^{n−1}) = p^{n−1}`, a pure one-step delay. The same threshold
 * holds on every geometry tried (diagonal walls, a one-cell corridor, pillars,
 * dead-end pockets): it is a property of each wall face, not of the room.
 *
 * ## Past the bound: the centred remainder (#219)
 *
 * A perfectly matched wall needs `γ = 1/C = √2`. No material asks for that
 * any more — read as diffuse-field absorption (#221), the most absorbing wall
 * is the 2D diffuse peak, `ξ = 1.306`, `γ = 1.083` — but 216 of the 982
 * database materials still ask for more than `γ = 0.95` at the reference
 * frequency. (Re-counted under #221's reading, not carried over from #219:
 * `γ > 0.95` is `ξ < 1.489`, which is 2D diffuse α above 0.962 at 500 Hz; the
 * normal-incidence threshold it replaced, 0.961, happens to select the same
 * 216.) So the
 * gain is split per face. The backward ghost takes `min(γ, MAX_GHOST_GAIN)`,
 * exactly as before, and whatever is left, `γ_c = γ − MAX_GHOST_GAIN`, is
 * applied with a *centred* time difference, the form PFFDTD uses for all of its
 * walls:
 *
 * ```
 * p^{n+1} = p* − C²·Σ (γ_c/2)·(p^{n+1} − p^{n−1})
 *        ⇒ v^{n+1} = (v* − β·v^n) / (1 + β),   β = ½·C²·Σ γ_c
 * ```
 *
 * where `p*`, `v*` are the update with the backward ghosts already in it.
 * Unlike PFFDTD, where `p*` is rigid and the centred term carries a wall's
 * whole admittance, `γ_c` here is only the excess above `MAX_GHOST_GAIN`; the
 * backward share is already lossy and already in `p*`. The
 * centred term only ever removes energy: it is proportional to
 * `(p^{n+1} − p^{n−1})`, the discrete `∂p/∂t` straddling the step, so it cannot
 * feed the surface mode the way a one-sided difference does. Measured, the
 * backward part still decides stability (`γ_b < 1`), and a remainder of any
 * size, up to `γ = 10` on the geometries above, leaves the field bounded.
 *
 * Why not make every wall centred and drop the backward ghost? It was tried
 * (#219) and it is worse. The loss sits at the cell centre, half a cell in
 * front of the face, and the centred difference leaves that `e^{ik/2}` phase
 * uncompensated; the backward difference's own half-step lag happens to cancel
 * most of it. Fully centred walls deliver 0.709 for a requested 0.8 at 6 cells
 * per wavelength, against 0.759 here. The split keeps every wall with
 * `γ ≤ 0.95` bit-for-bit what it was and spends the centred form only on the
 * part the backward one cannot carry.
 *
 * ARD needed a *Courant* clamp for its version of this boundary, because its
 * residual forcing feeds back through a 6th-order stencil. This one needs
 * neither a Courant clamp nor, any longer, a coefficient clamp.
 *
 * ## Staircased walls (#220)
 *
 * A wall that is not axis-aligned is rasterized into a staircase, and every
 * cell face of that staircase absorbs as though it were real surface. For a
 * wall of unit normal `n`, the exposed face length per unit of wall is
 * `|nₓ| + |n_y|` — √2 at 45° — so a slanted room absorbs over up to 41% more
 * surface than it has, and its decay depends on how it is rotated.
 *
 * Following PFFDTD's voxelizer, each face's gain is weighted by `|n·e|`, the
 * cosine between the wall and that face: `γ·|nₓ|` across an x-face, `γ·|n_y|`
 * across a y-face ({@link wallFaceWeights}). The weighted length is then
 * `nₓ² + n_y² = 1` per unit of wall, exactly. An axis-aligned wall has weights
 * of 1 and 0: its faces into the room are unchanged, bit for bit, and only the
 * end caps of a free-standing wall — which are not surface — become rigid.
 *
 * The weight is a diffuse-field argument, and it holds where the field is
 * diffuse. On the irregular pentagon in `__tests__/staircase.spec.ts`, at 0°,
 * 25° and 55°, uncorrected walls decay 9–15% faster than even the diffuse end
 * of the 2D Eyring bracket allows; weighted, every rotation lands 7–14% above
 * that end, inside the bracket. (An earlier probe on a larger grid, over 0–75°
 * and a second irregular room, found the same: 8–22% below uncorrected, inside
 * weighted, and the spread across rotations roughly halved.) A square room at exactly 45° is the exception: its decay
 * is held by a handful of modes striking a perfectly periodic staircase at one
 * angle, not by a diffuse field, and the weight over-corrects it.
 */
/**
 * Absorption at or below this is a rigid surface, and gets no boundary at all.
 *
 * A twin of ARD's constant rather than an import of it. When #199 landed, this
 * module took both this and the impedance mapping from `ard/impedance.ts`,
 * because that was the only place in the repository with the correct branch —
 * `acoustics/reflection-coefficient.ts` still carried the reciprocal one that
 * #200 describes, and importing it would have made these walls *more*
 * reflective as α rose. With #200 fixed, the mapping comes from the shared
 * definition and the only thing left to borrow is a number, which is not worth
 * an edge from this solver to the wave solver.
 */
export declare const RIGID_ALPHA_EPSILON = 0.000001;
/**
 * Blue-channel value marking an air cell in the sourcemap.
 *
 * The shader's wall test is `b > 0`, so air is positive and a wall is zero or
 * negative — see {@link wallChannelForGhostGain}.
 */
export declare const AIR_CHANNEL = 1;
/**
 * Cells per wavelength at which the delivered coefficient is still within
 * about 0.05 of the requested one. Below this the walls read as more
 * reflective than their materials; see the table above.
 */
export declare const FDTD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE = 6;
/**
 * Largest gain the *backward* ghost `p − γ·v` carries.
 *
 * That ghost is stable for `γ < 1` — see the stability section above — and this
 * keeps 5% below it. A wall asking for more gets the rest from the centred
 * remainder, so this is no longer a cap on absorption, only the point where
 * one form of the boundary hands over to the other. The shader gets it as a
 * compile-time define — see {@link withGhostGainDefine}.
 */
export declare const MAX_GHOST_GAIN = 0.95;
/**
 * `source` with `#define MAX_GHOST_GAIN` prepended, for `height-map.frag`.
 *
 * A define rather than a uniform because a uniform fails *open*: one that never
 * binds reads as 0 in GLSL, which would turn every absorbing wall into a fully
 * centred one — the scheme #219 measured and rejected — with nothing to say so.
 * The shader refuses to compile without this define, so a missing one fails
 * loudly instead.
 */
export declare function withGhostGainDefine(source: string): string;
/**
 * Ghost gain `γ = 1/(ξ·C)` for a normalized impedance `ξ` at Courant `C`.
 *
 * The boundary itself, independent of how a material's α becomes a `ξ`:
 * `Infinity` is the rigid ghost, 0. The accuracy measurements in
 * `__tests__/impedance.spec.ts` drive it through this, so they measure the
 * boundary and not the α convention.
 */
export declare function ghostGainForImpedance(xi: number, courant: number): number;
/**
 * Ghost gain for a surface of database absorption `alpha` at Courant `C`.
 *
 * `alpha` is **random-incidence** (Sabine) absorption, which is what the
 * material database holds (#221), and a 2D field's walls see a diffuse field
 * over a half-plane, so `ξ` comes from inverting the 2D diffuse average —
 * `impedanceForRandomIncidenceAbsorption(α, 2)` — not from `α = 1 − R(0)²`.
 * A coefficient above that model's maximum, 0.966, gets the most absorbing
 * wall there is (`ξ = 1.306`, `γ = 1.083` at the CFL locus); the part above
 * {@link MAX_GHOST_GAIN} goes to the centred remainder (see
 * {@link splitGhostGain}).
 *
 * Returns 0 — the rigid ghost — for a surface at or below
 * {@link RIGID_ALPHA_EPSILON}, so a rigid wall costs nothing and behaves
 * exactly as it did before impedance existed.
 *
 * `alpha` comes from a material lookup, so it is clamped rather than validated:
 * out of range or non-finite behaves like an unpainted wall, which is the
 * geometrical path's convention and the right one here. ARD throws on the same
 * input because a solver assembling partitions should fail loudly; a wall being
 * drawn from a surface should not take the whole field down.
 */
export declare function ghostGainForAbsorption(alpha: number, courant: number): number;
/**
 * A wall's gain as the two parts the update applies: the backward ghost's
 * `min(γ, maxGhostGain)` and the centred remainder above it.
 *
 * The channel carries the single `γ` and the shader makes the same split, so a
 * wall that never needed the remainder writes exactly the value it always did.
 *
 * `maxGhostGain` defaults to the production split point. Only tests move it:
 * `Infinity` hands the whole gain to the backward ghost, which is how the
 * `γ = 1` bound that sets {@link MAX_GHOST_GAIN} stays measured.
 *
 * A negative or non-finite gain is a rigid wall, the same convention
 * {@link ghostGainForAbsorption} follows for a bad material, rather than a
 * `NaN` that would poison the neighbouring cell's update.
 */
export declare function splitGhostGain(gamma: number, maxGhostGain?: number): {
    backward: number;
    centred: number;
};
/**
 * Face weights `|n·e|` for a wall from `(x1, y1)` to `(x2, y2)` (#220).
 *
 * `x` weighs the wall's faces seen across the x axis (its left and right
 * neighbours), `y` those seen across y. They are the components of the wall's
 * unit normal: `|Δy|/L` and `|Δx|/L`. A wall of no length has no direction to
 * correct for and keeps weights of 1, the uncorrected wall.
 */
export declare function wallFaceWeights(wall: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}): {
    x: number;
    y: number;
};
/**
 * Wallmap channel value for a face weight: `1 − w`.
 *
 * Stored as the complement so the texture's zero — what `createTexture`
 * allocates, and what an air cell holds — means weight 1, the uncorrected
 * wall. A wallmap that was never written, or never bound, degrades to the
 * boundary as it was before #220 rather than to a room of rigid walls.
 */
export declare function faceWeightChannel(weight: number): number;
/** Inverse of {@link faceWeightChannel}; the shader does the same `1.0 - c`. */
export declare function faceWeightFromChannel(channel: number): number;
/**
 * Wallmap texel for one wall: its x-face weight in `r`, y-face in `g`, both
 * as {@link faceWeightChannel}. A disabled wall is air and writes zeros, the
 * texture's resting value. Factored out of `updateWalls` for the same reason
 * as {@link wallChannelFor}: the solver itself needs a WebGL context.
 */
export declare function wallmapTexelFor(wall: {
    enabled: boolean;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}): {
    r: number;
    g: number;
};
/**
 * Pack a ghost gain into the sourcemap's blue channel.
 *
 * Air is `AIR_CHANNEL`; a wall is `-γ`, which is `0` for a rigid wall. The old
 * encoding wrote exactly `0` for every wall, so a project built before this
 * change reads back as rigid rather than as something undefined.
 */
export declare function wallChannelForGhostGain(gamma: number): number;
/** `true` for a wall cell, matching the shader's `b > 0` air test. */
export declare function isWallChannel(channel: number): boolean;
/** Ghost gain carried by a channel value. Air cells have none. */
export declare function ghostGainFromChannel(channel: number): number;
/**
 * Sourcemap blue channel for one wall, at the field's Courant number.
 *
 * A disabled wall is air. This is the whole of the decision `updateWalls`
 * makes per wall, factored out so it can be tested — constructing the solver
 * itself needs a WebGL context.
 */
export declare function wallChannelFor(wall: {
    enabled: boolean;
    absorption: number;
}, courant: number): number;
