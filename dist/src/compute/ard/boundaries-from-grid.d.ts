import { Decomposition } from './decompose';
import { FaceRect } from './face-rects';
import { ImpedanceBoundary, impedanceCourantLimit } from './impedance';
import { Axis, Partition } from './partition';
import { VoxelGrid } from './voxelize';
export { impedanceCourantLimit };
/** One rectangle of one partition face, carrying one material. */
export interface ImpedanceFace extends FaceRect {
    boxIndex: number;
    axis: Axis;
    /** True when the face is the box's high edge on `axis`. */
    high: boolean;
    /** Surface index behind the face, or -1 when the grid recorded none. */
    surfaceIndex: number;
}
export interface ImpedancePlan {
    faces: ImpedanceFace[];
    warnings: string[];
    /** Face cells that will carry a boundary — the whole of its memory cost. */
    boundaryCells: number;
    /** Faces left rigid because their material absorbs nothing. */
    skippedRigid: number;
    /**
     * The most absorbing surface among the planned faces, 0 when there are none.
     *
     * This is what sets the time step: the boundary that diverges first is the
     * one that absorbs most, and every partition shares one `dt`. See
     * {@link impedanceCourantLimit}.
     */
    maxAbsorption: number;
}
export interface PlanImpedanceOptions {
    /**
     * Absorption per surface index. A face at α = 0 is rigid, which is what a
     * partition already does on its own, so it gets no boundary and costs
     * nothing — unlike a PML slab at α = 0, which is acoustically identical to a
     * rigid face and still costs its cells.
     */
    absorptionFor?: (surfaceIndex: number) => number;
}
/** Work out where impedance boundaries go, without building them. */
export declare function planImpedanceBoundaries(grid: VoxelGrid, decomposition: Decomposition, options?: PlanImpedanceOptions): ImpedancePlan;
export interface BuildImpedanceOptions {
    /** Absorption coefficient for a surface index. -1 means no surface recorded. */
    absorptionFor: (surfaceIndex: number) => number;
}
/**
 * Build the boundaries for a plan.
 *
 * `partitions` is indexed by the decomposition's box index, so it is the room
 * partitions in decomposition order — wall slabs, if any also exist, are not
 * boundaries and must not be passed here.
 */
export declare function buildImpedanceBoundaries(plan: ImpedancePlan, partitions: readonly Partition[], options: BuildImpedanceOptions): {
    boundaries: ImpedanceBoundary[];
    warnings: string[];
};
