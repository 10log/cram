/**
 * Wall neighbor for the 2D FDTD Laplacian, and the CPU mirror of
 * `shaders/height-map.frag`.
 *
 * A wall neighbor contributes a ghost pressure — not the opposite interior
 * cell, which is neither Dirichlet nor rigid (#111). The ghost is
 * `p_cell − γ_b·v_cell`, the locally-reacting impedance boundary derived in
 * `impedance.ts`; `γ = 0` gives `p_ghost = p_cell`, the rigid Neumann wall,
 * bit for bit. A wall whose gain exceeds `MAX_GHOST_GAIN` puts the excess into
 * a centred loss applied after the stencil — see
 * {@link applyCentredWallLoss}. Splitting a wall's `γ` into the two is
 * `splitGhostGain`'s job, and every caller here does it explicitly: a helper
 * that split behind your back would let a caller that forgot the centred half
 * reintroduce the old 0.961 cap without noticing.
 *
 * Global `damping` is a numerical sponge on velocity, not air absorption
 * and not a surface material. It defaults to 1 — surfaces absorb, the sponge
 * does not.
 */
/**
 * Ghost pressure standing in for a wall neighbor: `p − γ_b·v`.
 *
 * `cellVelocity` is this scheme's backward difference `p^n − p^{n−1}`, which is
 * what makes the impedance ghost a single multiply-add with no stored history.
 *
 * `backwardGain` is the backward share of the wall's gain,
 * `splitGhostGain(γ).backward`, not `γ` itself. This applies exactly what it is
 * given — above 1 it is the unstable ghost — and the centred remainder is
 * {@link applyCentredWallLoss}'s.
 */
export declare function wallGhostPressure(cellPressure: number, cellVelocity: number, backwardGain: number): number;
/**
 * The centred remainder of a cell's wall gains, applied to the velocity the
 * stencil produced (#219).
 *
 * `centredGain` is `Σ γ_c` over the cell's wall neighbors, each `γ_c` being
 * only the excess of that wall's gain above `MAX_GHOST_GAIN`: the backward
 * share is already in `stepped`, through the ghosts. The loss
 * `C²·(γ_c/2)·(p^{n+1} − p^{n−1})` has `p^{n+1}` on both sides, and solving
 * for it is one divide:
 *
 * ```
 * v^{n+1} = (v* − β·v^n) / (1 + β),   β = ½·C²·Σ γ_c
 * ```
 *
 * Written on velocity rather than pressure so the field's rest offset never
 * enters, and returns `stepped` untouched at `centredGain = 0`, so a cell with
 * no such wall is bit-for-bit what it was.
 */
export declare function applyCentredWallLoss(stepped: number, previous: number, courantSq: number, centredGain: number): number;
/** The `γ = 0` case of {@link wallGhostPressure}: a perfectly rigid wall. */
export declare function rigidNeighborPressure(cellPressure: number, neighborPressure: number, neighborIsWall: boolean): number;
export interface StencilCell {
    pressure: number;
    velocity: number;
    isWall: boolean;
    /** Impedance ghost gain of *this* cell as a wall. Absent or 0 is rigid. */
    ghostGain?: number;
    /**
     * Staircase face weights `|n·e|` of this cell as a wall (#220): `weightX`
     * scales `ghostGain` across an x-face, `weightY` across a y-face. Absent is
     * 1, the uncorrected wall.
     */
    weightX?: number;
    weightY?: number;
}
/**
 * One interior update matching height-map.frag:
 *   mid = 0.25*(u+d+r+l)
 *   newvel = 4*courantSq*(mid-pos) + vel*damping
 *   newvel = applyCentredWallLoss(newvel, vel, courantSq, Σγ_c)
 *   newpos = pos + newvel
 * Wall cells stay at rest.
 *
 * `maxGhostGain` is {@link stepField}'s, for the same reason.
 */
export declare function stepInteriorCell(cell: StencilCell, neighbors: {
    u: StencilCell;
    d: StencilCell;
    r: StencilCell;
    l: StencilCell;
}, courantSq: number, damping: number, restPressure?: number, maxGhostGain?: number): StencilCell;
/** Advance a 1-D strip with the 2-D stencil (no variation in Y). */
export declare function stepStrip(pressure: number[], velocity: number[], wall: boolean[], courantSq: number, damping: number, restPressure?: number, ghostGain?: number[]): {
    pressure: number[];
    velocity: number[];
};
/**
 * A 2-D field, laid out as the heightmap and sourcemap textures are.
 *
 * `channel` is the sourcemap's blue channel: positive for air, `-γ` for a
 * wall. Out-of-grid neighbors clamp to the cell itself, which is what
 * `ClampToEdgeWrapping` makes the shader do, and which reads as rigid.
 *
 * Pressure here is referenced to zero, where the textures carry the water
 * demo's `REST_PRESSURE` offset of 127.5. Nothing in the update notices: the
 * ghost is `p − γv`, the Laplacian is `Σghost − 4p` and the centred loss acts
 * on velocity, all of which are invariant to a constant added to every
 * pressure.
 */
export interface Field2D {
    nx: number;
    ny: number;
    pressure: Float64Array;
    velocity: Float64Array;
    channel: Float64Array;
    /**
     * Staircase face weights of each wall cell (#220), the wallmap texture's
     * `1 − r` and `1 − g`. 1 everywhere is the uncorrected field.
     */
    weightX: Float64Array;
    weightY: Float64Array;
}
export declare function createField2D(nx: number, ny: number): Field2D;
/**
 * Advance a whole field one step, in place.
 *
 * `scratch` is the caller's, so a loop of 100,000 steps allocates nothing.
 *
 * `maxGhostGain` is the split point `splitGhostGain` takes, and the shader's
 * `MAX_GHOST_GAIN` define. Only tests move it: `Infinity` gives the pure
 * backward ghost at any gain, which is how the `γ = 1` bound that sets
 * {@link MAX_GHOST_GAIN} stays measured. {@link stepInteriorCell} takes the same
 * argument, and the tiling test pins the two together at both settings.
 */
export declare function stepField(field: Field2D, courantSq: number, damping: number, scratch: {
    pressure: Float64Array;
    velocity: Float64Array;
}, maxGhostGain?: number): void;
