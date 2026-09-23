import { Box } from './partition';
import { VoxelGrid } from './voxelize';
export type PartitionKind = 'dct' | 'fdtd';
export interface Decomposition {
    /** Disjoint boxes covering every air cell, in global cell coordinates. */
    boxes: Box[];
    /** Partition kind for each box, parallel to `boxes`. */
    kinds: PartitionKind[];
    /** Box index per cell, -1 for solid. */
    assignment: Int32Array;
    /** Air cells covered, divided by air cells present. 1 when correct. */
    coverage: number;
    /** Air cells the decomposition covered. */
    coveredCells: number;
    /** How many boxes were too thin for the interface stencil. */
    thinBoxCount: number;
}
export interface DecomposeOptions {
    /**
     * Shortest edge a `dct` box may have. Below this the interface stencil has no
     * room, and the box is emitted as `fdtd`. Default 7: three cells either side
     * of a face plus one, so a box can carry an interface on both of its opposing
     * faces at once.
     */
    minBoxEdge?: number;
    /**
     * Grow the longest run at each seed first, instead of always x → y → z.
     *
     * Defaults to **off**: measured, it ties on every room-like shape and is
     * worse on ragged ones. See the note at the top of this file. The option
     * exists so the measurement has something to compare against.
     */
    longestAxisFirst?: boolean;
}
/**
 * Cover a voxel grid's air region with disjoint axis-aligned boxes.
 *
 * Throws on a leaked grid: the air region of a room whose surfaces do not close
 * is the whole bounding box, and decomposing that would produce a large, silent
 * nonsense rather than an error.
 */
export declare function decompose(grid: VoxelGrid, options?: DecomposeOptions): Decomposition;
/**
 * Check a decomposition against its grid: every air cell assigned exactly once,
 * no solid cell assigned, every box containing only air. Returns the problems
 * found, empty when sound.
 *
 * Cheap relative to a simulation and worth running before Phase 6 spends
 * minutes on a bad cover.
 */
export declare function validateDecomposition(grid: VoxelGrid, decomposition: Decomposition): string[];
