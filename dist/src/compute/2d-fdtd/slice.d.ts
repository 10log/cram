/**
 * 2D FDTD lives on a plane cut through the room.
 *
 * CRAM rooms are Y-up: the floor is XZ. The original solver treated the
 * GPU grid as Three.js XY (the water-demo convention) and sampled
 * source.x / source.y, so a source at (2, 1.2, 4) and a receiver at
 * (6, 1.2, 4) collapsed onto the same cell and floor edges became a
 * line at Y = 0.
 *
 * `xz` is the floor-plan cut. `xy` is the vertical sketch cut. When the
 * caller does not set a slice, pick the AABB face with more area.
 */
export type FdtdSlice = "xy" | "xz";
export interface WorldPoint {
    x: number;
    y: number;
    z: number;
}
export interface AxisAlignedSize {
    dx: number;
    dy: number;
    dz: number;
}
export interface PlanePoint {
    /** First grid axis — always world X. */
    u: number;
    /** Second grid axis — world Y (`xy`) or world Z (`xz`). */
    v: number;
}
export interface SliceDomain {
    slice: FdtdSlice;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    /** World Y of an `xz` display plane; unused for `xy`. */
    sliceHeight: number;
}
export declare function inferSlice(size: AxisAlignedSize): FdtdSlice;
export declare function worldToPlane(p: WorldPoint, slice: FdtdSlice): PlanePoint;
export interface GridSize {
    offsetX: number;
    offsetY: number;
    cellSize: number;
    nx: number;
    ny: number;
}
/**
 * Map a world point onto the FDTD grid. `null` if the cell is outside
 * the domain — callers must skip the write instead of clamping to the
 * rim (a source off-grid is not a boundary driver).
 */
export declare function gridCell(p: WorldPoint, slice: FdtdSlice, grid: GridSize): {
    x: number;
    y: number;
} | null;
export declare function gridCellIndex(p: WorldPoint, slice: FdtdSlice, grid: GridSize): number | null;
export declare function planeSeparation(a: WorldPoint, b: WorldPoint, slice: FdtdSlice): number;
export declare function domainFromBox(box: {
    min: WorldPoint;
    max: WorldPoint;
}, slice?: FdtdSlice): SliceDomain;
/**
 * Lay a centered PlaneGeometry onto the chosen world plane so the
 * min-corner sits at (offsetX, sliceHeight, offsetY) for `xz`, or
 * (offsetX, offsetY, 0) for `xy`.
 */
export declare function applySliceTransform(geometry: {
    rotateX: (r: number) => void;
    translate: (x: number, y: number, z: number) => void;
}, domain: Pick<SliceDomain, "slice" | "width" | "height" | "offsetX" | "offsetY" | "sliceHeight">): void;
