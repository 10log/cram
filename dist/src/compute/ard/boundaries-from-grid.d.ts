import { Decomposition } from './decompose';
import { FaceRect } from './face-rects';
import { ImpedanceBoundary, impedanceCourantLimit } from './impedance';
import { Axis, Partition } from './partition';
import { VoxelGrid } from './voxelize';
import { GlobalField } from './interface';
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
     * Absorption per surface index. A face at α = 0 is rigid, and this plan
     * gives it no boundary. For a DCT partition that is free — it mirrors, which
     * is the rigid wall — unlike a PML slab at α = 0, which is acoustically
     * identical to a rigid face and still costs its cells. An FDTD partition does
     * *not* mirror (it reads zero past its array: pressure release), so its
     * skipped rigid faces are filled in afterwards by
     * {@link buildRigidFdtdBoundaries} (#228).
     */
    absorptionFor?: (surfaceIndex: number) => number;
}
/** Work out where impedance boundaries go, without building them. */
export declare function planImpedanceBoundaries(grid: VoxelGrid, decomposition: Decomposition, options?: PlanImpedanceOptions): ImpedancePlan;
export interface BuildImpedanceOptions {
    /** Absorption coefficient for a surface index. -1 means no surface recorded. */
    absorptionFor: (surfaceIndex: number) => number;
    /**
     * Spatial rank of the run, which picks the diffuse-field model a material's
     * random-incidence α is inverted against (#221). Defaults to 3.
     */
    rank?: number;
    /** The room's pressure by global cell, for faces on thin partitions (#228). */
    field?: GlobalField;
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
/** Key identifying one face rectangle of one box, shared by every boundary plan. */
export declare function faceKey(boxIndex: number, axis: Axis, high: boolean, rect: FaceRect): string;
/**
 * Rigid boundaries for every exposed face of an FDTD partition that no other
 * boundary covers (#228).
 *
 * A DCT partition is rigid on its own — it mirrors — so the planners skip a
 * face whose material absorbs nothing. An FDTD partition is not: it reads
 * zero outside its array, which is a pressure-release wall, echo inverted. So
 * each of its exposed faces needs a boundary even at α = 0, and an impedance
 * boundary at ξ = ∞ is exactly the rigid mirror (β = 0, ghost = p). This
 * fills in the faces the impedance plan skipped as rigid, the faces a PML
 * plan gave no slab, and every face when the room was asked for without walls.
 *
 * `covered` holds the {@link faceKey} of every face another boundary already
 * handles; the cover comes from the same `exposedFaceRects` both planners use,
 * so the keys line up.
 */
export declare function buildRigidFdtdBoundaries(grid: VoxelGrid, decomposition: Decomposition, partitions: readonly Partition[], covered: ReadonlySet<string>, field?: GlobalField): ImpedanceBoundary[];
