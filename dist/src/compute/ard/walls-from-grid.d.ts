import { Decomposition } from './decompose';
import { Axis, ActiveAxes, Box } from './partition';
import { PmlPartition } from './pml-partition';
import { VoxelGrid } from './voxelize';
/** A rectangle of one partition face that faces a room surface. */
export interface WallFace {
    boxIndex: number;
    axis: Axis;
    /** True when the face is the box's high edge on `axis`. */
    high: boolean;
    /** The slab's footprint, in global cell coordinates. */
    box: Box;
    /** Cells of solid the slab could actually claim. */
    thickness: number;
    /** Surface index behind the face, or -1 when the grid recorded none. */
    surfaceIndex: number;
}
export interface WallPlan {
    faces: WallFace[];
    /** Faces dropped for lack of room, as human-readable notes. */
    warnings: string[];
    /** Cells added by the slabs, for cost reporting. */
    slabCells: number;
    /**
     * Faces that wanted a slab but had no room for one. Non-zero means the grid
     * was under-padded: the surfaces are silently rigid and the result carries no
     * absorption. Distinct from `skippedRigid`, which is the user asking for a
     * rigid surface and getting one.
     */
    droppedForSpace: number;
    /** Faces left rigid because their material absorbs nothing. */
    skippedRigid: number;
}
/**
 * Thicknesses a slab may be built at.
 *
 * Quantized because each distinct thickness costs a calibration curve (~1s),
 * and a room with a dozen awkward faces would otherwise pay for a dozen. The
 * ladder descends so a face with little room still gets the best layer that
 * fits.
 */
export declare const WALL_THICKNESS_LADDER: readonly [20, 16, 12, 8, 6, 4];
/**
 * Default slab thickness: α up to 0.958 for about twice the room in cells.
 * See the table above for the other rungs.
 */
export declare const DEFAULT_WALL_THICKNESS = 8;
/**
 * Padding a voxel grid needs so wall slabs of this thickness have room: the
 * slab itself plus the one cell of shell it starts behind.
 */
export declare function padCellsForWalls(thickness?: number): number;
/**
 * Work out where wall slabs go, without building them.
 *
 * Separated from construction so the geometry can be tested without paying for
 * calibration curves, and so a caller can report the cost before committing.
 */
export interface PlanWallsOptions {
    maxThickness?: number;
    /**
     * Absorption per surface index, so a face with nothing to absorb can be left
     * alone. A slab at α = 0 is acoustically identical to a rigid face but still
     * costs its cells and still drags the whole simulation onto the PML's CFL
     * limit, so building one is pure loss.
     */
    absorptionFor?: (surfaceIndex: number) => number;
}
export declare function planWalls(grid: VoxelGrid, decomposition: Decomposition, options?: PlanWallsOptions): WallPlan;
export interface BuildWallsOptions {
    dx: number;
    c: number;
    dt: number;
    /** Absorption coefficient for a surface index. -1 means "no surface recorded". */
    absorptionFor: (surfaceIndex: number) => number;
    gradingExponent?: number;
    /** The grid's axes, passed to every slab — see `PartitionParams.activeAxes`. */
    activeAxes?: ActiveAxes;
}
/**
 * Build the PML partitions for a wall plan.
 *
 * Each slab is calibrated for its own thickness, so a face that could only take
 * a thin layer still gets the best absorption that layer can deliver rather
 * than a coefficient it cannot reach.
 */
export declare function buildWalls(plan: WallPlan, options: BuildWallsOptions): {
    partitions: PmlPartition[];
    warnings: string[];
};
