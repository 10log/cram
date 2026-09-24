/**
 * Voxelization — Phase 2 of the ARD solver (docs/ard-solver-plan.md).
 *
 * ARD needs the room's **air region** as a grid of cells, because the
 * decomposition (Phase 3) packs boxes into it and the partitions (Phase 4)
 * live on it. The reference implementation has nothing to port here: it reads
 * a pre-baked `.rec` box list produced by an offline MATLAB step
 * (`Partition::readFromRecFile`), so this and Phase 3 are new code.
 *
 * Two passes:
 *
 * 1. **Rasterize** every surface triangle into the grid with an exact
 *    triangle-box overlap test, marking those cells solid and recording which
 *    surface each belongs to. That gives a shell, not a filled volume.
 * 2. **Flood fill** the air from a seed, 6-connected, through non-solid cells.
 *    Only the component reachable from the seed becomes air, which is what
 *    discards the exterior and any sealed void — a closet nobody opened is not
 *    part of the room's acoustic volume.
 *
 * ## Why not a BVH
 *
 * The plan called for a `three-mesh-bvh` box-vs-triangle query per candidate
 * cell. Scattering each triangle into the cells its own bounding box covers is
 * strictly better: the work is proportional to the surface area in cells — that
 * is, to the number of solid cells actually produced — rather than to the
 * volume of the grid times `log(triangles)`. It also needs no acceleration
 * structure and no dependency. The overlap test itself is exact either way.
 *
 * ## Leak detection
 *
 * The grid is padded by a cell on every side, so the exterior always touches
 * the rim. If the fill reaches the rim, either the seed was outside the room or
 * the surfaces do not close — a gap of even one cell lets the interior drain
 * into the exterior and the "air region" becomes the whole bounding box. That
 * is reported rather than thrown: the caller may still want the grid for
 * diagnosis, and a room that fails here needs geometry attention, not a retry.
 *
 * ## Staircasing
 *
 * Surfaces that are not axis-aligned become stair steps. That is intrinsic to
 * grid methods and a real accuracy limit, not something this implementation
 * chooses; it is the reason the plan keeps ARD to the low-frequency band.
 *
 * A face lying exactly on the boundary between two cells marks both of them
 * (#230), so on such faces the air region sits up to half a cell further in
 * than on a face that cuts through cells. Worth remembering when comparing
 * the air volume with the model's.
 */
/** Cell states. After `voxelize` only these two remain. */
export declare const enum Cell {
    Solid = 0,
    Air = 1
}
export interface VoxelTriangle {
    ax: number;
    ay: number;
    az: number;
    bx: number;
    by: number;
    bz: number;
    cx: number;
    cy: number;
    cz: number;
    /** Index of the surface this triangle came from, for per-band absorption. */
    surfaceIndex: number;
}
export interface VoxelGrid {
    nx: number;
    ny: number;
    nz: number;
    /** Cell size in metres. */
    dx: number;
    /** World position of the centre of cell (0, 0, 0). */
    origin: {
        x: number;
        y: number;
        z: number;
    };
    /** `Cell.Solid` or `Cell.Air`, length `nx*ny*nz`, first axis contiguous. */
    cells: Uint8Array;
    /** Parent surface index on solid boundary cells, -1 elsewhere. */
    surfaceOf: Int32Array;
    /**
     * Staircase face weights (#220), three per cell: for each axis, the largest
     * `|n_axis|` among the unit normals of the triangles overlapping the cell,
     * or -1 where no triangle did. See {@link faceWeight}.
     *
     * Optional because a grid built by hand, as the tests' shoeboxes are, is
     * axis-aligned and needs no correction — absent reads as weight 1.
     */
    faceWeightOf?: Float32Array;
    /**
     * True area in m² of each surface index's triangles, for the staircase
     * diagnostic (#220). Optional for the same reason as `faceWeightOf`.
     */
    surfaceArea?: Record<number, number>;
    airCount: number;
    solidCount: number;
    /**
     * True when the flood fill reached the padded rim: the surfaces do not close,
     * or the seed was outside the room. The air region is then meaningless.
     */
    leaked: boolean;
    /** Human-readable problems worth surfacing to the user. */
    warnings: string[];
}
export interface VoxelizeOptions {
    /** Cell size in metres. Usually `c / (cellsPerWavelength * fMax)`. */
    dx: number;
    /** A point known to be inside the room. Defaults to the vertex centroid. */
    seed?: {
        x: number;
        y: number;
        z: number;
    };
    /** Empty cells of padding around the geometry. At least 1, for leak detection. */
    padCells?: number;
    /** Refuse grids larger than this many cells. */
    maxCells?: number;
}
/** `dx` for an upper frequency limit, at a given spatial sampling density. */
export declare function cellSizeFor(fMax: number, c?: number, cellsPerWavelength?: number): number;
/**
 * Voxelize a set of world-space triangles into a room's air region.
 *
 * Pure: no `three`, no stores, no DOM. `voxelizeRoom` adapts a CRAM `Room` onto
 * it.
 */
export declare function voxelizeTriangles(triangles: readonly VoxelTriangle[], options: VoxelizeOptions): VoxelGrid;
/**
 * Staircase weight `|n·e|` of the face a solid cell presents across `axis`
 * (#220).
 *
 * A surface that is not axis-aligned voxelizes into a staircase, and every
 * exposed cell face of it would otherwise absorb as though it were real
 * surface: `|nₓ| + |n_y| + |n_z|` times the true area, √3 at worst. Weighting
 * each face's admittance by the cosine between the surface and that face makes
 * the weighted area `Σ nₐ² = 1` per unit of surface, which is PFFDTD's
 * surface-area correction.
 *
 * 1 — uncorrected — for a grid without weights, a cell no triangle reached
 * (padding, or a face against the grid edge), or an index off the grid.
 */
export declare function faceWeight(grid: VoxelGrid, index: number, axis: 0 | 1 | 2): number;
/**
 * The nearest cell to `from` that `accept` allows, searched outward.
 *
 * Ordered by Chebyshev radius, then by true distance from `from` within a
 * radius. That differs on purpose from the *seed* relocation above, which
 * breaks ties toward the centre of the grid: a seed has to land somewhere in
 * the main volume and any interior cell will do, while a probe stands for a
 * microphone or a loudspeaker the user placed and should move as little as
 * possible.
 *
 * Returns `from` itself when it is already acceptable, and `null` when nothing
 * within `maxRadius` is. Callers that need to know how far it moved can compare
 * the result against what they passed in — the distance matters, because `dx`
 * is `c/(n·fMax)` and at 500 Hz that is 26 cm.
 */
export declare function nearestCell(grid: VoxelGrid, from: {
    i: number;
    j: number;
    k: number;
}, accept: (index: number, i: number, j: number, k: number) => boolean, maxRadius?: number): {
    i: number;
    j: number;
    k: number;
} | null;
/** Linear index of a cell, or -1 if outside the grid. */
export declare function cellIndex(grid: VoxelGrid, i: number, j: number, k: number): number;
/** Grid cell containing a world point, or null if outside the grid. */
export declare function worldToCell(grid: VoxelGrid, p: {
    x: number;
    y: number;
    z: number;
}): {
    i: number;
    j: number;
    k: number;
} | null;
/** World position of a cell centre. */
export declare function cellToWorld(grid: VoxelGrid, i: number, j: number, k: number): {
    x: number;
    y: number;
    z: number;
};
