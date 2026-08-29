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

export function inferSlice(size: AxisAlignedSize): FdtdSlice {
  const areaXZ = Math.abs(size.dx * size.dz);
  const areaXY = Math.abs(size.dx * size.dy);
  return areaXZ >= areaXY ? "xz" : "xy";
}

export function worldToPlane(p: WorldPoint, slice: FdtdSlice): PlanePoint {
  return slice === "xz" ? { u: p.x, v: p.z } : { u: p.x, v: p.y };
}

export function planeSeparation(a: WorldPoint, b: WorldPoint, slice: FdtdSlice): number {
  const pa = worldToPlane(a, slice);
  const pb = worldToPlane(b, slice);
  const du = pb.u - pa.u;
  const dv = pb.v - pa.v;
  return Math.hypot(du, dv);
}

export function domainFromBox(
  box: { min: WorldPoint; max: WorldPoint },
  slice?: FdtdSlice,
): SliceDomain {
  const size = {
    dx: box.max.x - box.min.x,
    dy: box.max.y - box.min.y,
    dz: box.max.z - box.min.z,
  };
  const resolved = slice ?? inferSlice(size);
  const a = worldToPlane(box.min, resolved);
  const b = worldToPlane(box.max, resolved);
  return {
    slice: resolved,
    width: Math.abs(b.u - a.u),
    height: Math.abs(b.v - a.v),
    offsetX: Math.min(a.u, b.u),
    offsetY: Math.min(a.v, b.v),
    sliceHeight: resolved === "xz" ? box.min.y : 0,
  };
}

/**
 * Lay a centered PlaneGeometry onto the chosen world plane so the
 * min-corner sits at (offsetX, sliceHeight, offsetY) for `xz`, or
 * (offsetX, offsetY, 0) for `xy`.
 */
export function applySliceTransform(
  geometry: { rotateX: (r: number) => void; translate: (x: number, y: number, z: number) => void },
  domain: Pick<SliceDomain, "slice" | "width" | "height" | "offsetX" | "offsetY" | "sliceHeight">,
) {
  if (domain.slice === "xz") {
    // Local +Y becomes world +Z so the plane lies on the floor.
    geometry.rotateX(Math.PI / 2);
    geometry.translate(domain.width / 2, domain.sliceHeight, domain.height / 2);
    geometry.translate(domain.offsetX, 0, domain.offsetY);
  } else {
    geometry.translate(domain.width / 2, domain.height / 2, 0);
    geometry.translate(domain.offsetX, domain.offsetY, 0);
  }
}
