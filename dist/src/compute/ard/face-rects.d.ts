import { Axis, Box } from './partition';
import { VoxelGrid } from './voxelize';
/** A rectangle of one partition face, in global cell coordinates. */
export interface FaceRect {
    /** Inclusive-exclusive ranges on the two transverse axes. */
    uMin: number;
    uMax: number;
    vMin: number;
    vMax: number;
}
/**
 * The first cell outside a box's face, along `axis`.
 *
 * Both planners need it — one to grow a slab from, the other to read the
 * surface index behind the face — and it is the one coordinate that is easy to
 * get off by one.
 */
export declare function outerLayer(box: Box, axis: Axis, high: boolean): number;
/**
 * Cover the exposed part of one box face with rectangles.
 *
 * Returns global coordinates, and an empty array when the face is entirely
 * against other partitions.
 */
export declare function exposedFaceRects(grid: VoxelGrid, box: Box, axis: Axis, high: boolean): FaceRect[];
/**
 * Which surface sits behind a face rectangle.
 *
 * One coefficient per rectangle, so a rectangle spanning two materials takes
 * whichever covers more of it. Returns -1 when the grid recorded no surface
 * there at all — a face against the grid's padding rather than against
 * geometry.
 */
export declare function dominantSurface(grid: VoxelGrid, axis: Axis, high: boolean, box: Box, rect: FaceRect): number;
