import { VoxelGrid } from './voxelize';
/**
 * Which plane a 2D run lives on, in CRAM's Y-up world.
 *
 * Matches `compute/2d-fdtd/slice.ts`, which already had to settle this: `xz` is
 * the floor plan and `xy` is a vertical section. The naming is worth being
 * careful with, because the axis that gets collapsed is the one *not* named —
 * `xz` collapses world Y, and world Y is grid axis 1, not 2.
 */
export type ArdSlice = 'xz' | 'xy';
/** Grid axis collapsed by a slice: 1 (world Y) for `xz`, 2 (world Z) for `xy`. */
export declare function collapsedAxis(slice: ArdSlice): 1 | 2;
/**
 * The layer of `grid` at `index` along `axis`, as a grid of its own.
 *
 * The result has extent 1 on that axis and keeps the other two — including
 * their padding, which the wall slabs still need to grow into. `airCount`,
 * `solidCount` and `leaked` are recomputed for the plane: a layer of a sound
 * 3D grid can still be empty, and a 2D run on no air cells is not a run.
 */
export declare function sliceGrid(grid: VoxelGrid, axis: 1 | 2, index: number): VoxelGrid;
/**
 * The layer index whose centre is nearest `coordinate` on `axis`, clamped into
 * the grid.
 *
 * Used to turn "cut the floor plan at 1.2 m" into a layer. Clamping rather than
 * throwing because a height above the ceiling is a slider that went too far,
 * not a broken room — but the caller is told, so the UI can say which plane it
 * actually used.
 */
export declare function layerForCoordinate(grid: VoxelGrid, axis: 1 | 2, coordinate: number): {
    index: number;
    clamped: boolean;
};
/** Whether a layer has any air in it at all. */
export declare function sliceHasAir(grid: VoxelGrid, axis: 1 | 2, index: number): boolean;
/**
 * The layer with the most air, for when the caller has no height in mind.
 *
 * Better than the middle of the bounding box, which on a room with a pitched
 * roof or a raked floor can land mostly in solid. Ties break toward the centre,
 * so a shoebox — where every layer is identical — cuts through the middle
 * rather than at the floor.
 */
export declare function widestLayer(grid: VoxelGrid, axis: 1 | 2): number;
