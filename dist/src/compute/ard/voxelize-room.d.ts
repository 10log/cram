import { default as Room } from '../../objects/room';
import { default as Surface } from '../../objects/surface';
import { VoxelGrid, VoxelTriangle, VoxelizeOptions } from './voxelize';
/**
 * World-space triangles of every surface in a room, tagged with the index of
 * the surface they came from.
 *
 * The index is what `surfaceOf` carries through the grid, so Phase 5 can go
 * from a boundary cell back to `surfaces[i].absorptionFunction(freq)` for the
 * octave band being run. The returned `surfaces` array is that lookup table.
 */
export declare function roomTriangles(room: Room): {
    triangles: VoxelTriangle[];
    surfaces: Surface[];
};
export interface VoxelizeRoomResult {
    grid: VoxelGrid;
    /** Indexed by the values in `grid.surfaceOf`. */
    surfaces: Surface[];
}
/**
 * Voxelize a room into its air region.
 *
 * `seed` should be a point known to be inside — a source position is the
 * natural choice, since a source outside the room is already a user error the
 * solver should report. Without one the vertex centroid is used, which is
 * inside for convex rooms and may not be for others; `grid.leaked` and
 * `grid.warnings` say when that went wrong.
 */
export declare function voxelizeRoom(room: Room, options: VoxelizeOptions): VoxelizeRoomResult;
