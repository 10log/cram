/**
 * Rigid-wall (Neumann) neighbor for the 2D FDTD Laplacian.
 *
 * Walls are perfectly rigid until material-aware impedance exists
 * (Surface.absorptionFunction is not read). A wall neighbor contributes
 * the cell's own pressure — ghost p = p_interior — not the opposite
 * interior cell.
 *
 * Global `damping` is a numerical sponge on velocity, not air absorption
 * and not a surface material.
 */
export declare function rigidNeighborPressure(cellPressure: number, neighborPressure: number, neighborIsWall: boolean): number;
export interface StencilCell {
    pressure: number;
    velocity: number;
    isWall: boolean;
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
export declare function stepStrip(pressure: number[], velocity: number[], wall: boolean[], courantSq: number, damping: number, restPressure?: number): {
    pressure: number[];
    velocity: number[];
};
