/**
 * Wall neighbor for the 2D FDTD Laplacian, and the CPU mirror of
 * `shaders/height-map.frag`.
 *
 * A wall neighbor contributes a ghost pressure — not the opposite interior
 * cell, which is neither Dirichlet nor rigid (#111). The ghost is
 * `p_cell − γ·v_cell`, the locally-reacting impedance boundary derived in
 * `impedance.ts`; `γ = 0` gives `p_ghost = p_cell`, the rigid Neumann wall,
 * bit for bit.
 *
 * Global `damping` is a numerical sponge on velocity, not air absorption
 * and not a surface material. It defaults to 1 — surfaces absorb, the sponge
 * does not.
 */
/**
 * Ghost pressure standing in for a wall neighbor.
 *
 * `cellVelocity` is this scheme's backward difference `p^n − p^{n−1}`, which is
 * what makes the impedance ghost a single multiply-add with no stored history.
 */
export declare function wallGhostPressure(cellPressure: number, cellVelocity: number, ghostGain: number): number;
/** The `γ = 0` case of {@link wallGhostPressure}: a perfectly rigid wall. */
export declare function rigidNeighborPressure(cellPressure: number, neighborPressure: number, neighborIsWall: boolean): number;
export interface StencilCell {
    pressure: number;
    velocity: number;
    isWall: boolean;
    /** Impedance ghost gain of *this* cell as a wall. Absent or 0 is rigid. */
    ghostGain?: number;
}
/**
 * One interior update matching height-map.frag:
 *   mid = 0.25*(u+d+r+l)
 *   newvel = 4*courantSq*(mid-pos) + vel*damping
 *   newpos = pos + newvel
 * Wall cells stay at rest.
 */
export declare function stepInteriorCell(cell: StencilCell, neighbors: {
    u: StencilCell;
    d: StencilCell;
    r: StencilCell;
    l: StencilCell;
}, courantSq: number, damping: number, restPressure?: number): StencilCell;
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
 * ghost is `p − γv` and the Laplacian is `Σghost − 4p`, both of which are
 * invariant to a constant added to every pressure.
 */
export interface Field2D {
    nx: number;
    ny: number;
    pressure: Float64Array;
    velocity: Float64Array;
    channel: Float64Array;
}
export declare function createField2D(nx: number, ny: number): Field2D;
/**
 * Advance a whole field one step, in place.
 *
 * `scratch` is the caller's, so a loop of 100,000 steps allocates nothing.
 */
export declare function stepField(field: Field2D, courantSq: number, damping: number, scratch: {
    pressure: Float64Array;
    velocity: Float64Array;
}): void;
