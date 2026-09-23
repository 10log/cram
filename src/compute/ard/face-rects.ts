/**
 * Which parts of a partition face are room surface, and what is behind them.
 *
 * Two planners need this and must not disagree about it: `walls-from-grid.ts`
 * puts a PML slab outside every exposed face rectangle, and
 * `boundaries-from-grid.ts` puts an impedance boundary on one. If they scanned
 * the geometry separately, a face that one treated as a surface and the other
 * as a partition join would be either absorbing twice or not at all — and
 * nothing downstream could tell.
 *
 * A face cell is *exposed* when the cell immediately beyond it is not air.
 * Where it is air, a neighbouring partition is there and Phase 5's interface
 * forcing handles the join instead.
 *
 * The exposed cells are covered with rectangles by running {@link decompose} on
 * a one-cell-deep grid, which is the same greedy cover the air region itself
 * gets — so "cover this region with boxes" means one thing in this codebase,
 * not two. Rectangles matter because a face can be part neighbour and part
 * surface: an L-shaped room does it at the inside corner.
 */

import { decompose } from './decompose';
import { Axis, type Box } from './partition';
import { Cell, type VoxelGrid } from './voxelize';

const ORIGIN: readonly ['x', 'y', 'z'] = ['x', 'y', 'z'];
const EXTENT: readonly ['w', 'h', 'd'] = ['w', 'h', 'd'];

/** The two axes perpendicular to `axis`, in ascending order. */
export function transverseAxes(axis: Axis): [Axis, Axis] {
  if (axis === Axis.X) return [Axis.Y, Axis.Z];
  if (axis === Axis.Y) return [Axis.X, Axis.Z];
  return [Axis.X, Axis.Y];
}

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
export function outerLayer(box: Box, axis: Axis, high: boolean): number {
  return high ? box[ORIGIN[axis]] + box[EXTENT[axis]] : box[ORIGIN[axis]] - 1;
}

/**
 * Cover the exposed part of one box face with rectangles.
 *
 * Returns global coordinates, and an empty array when the face is entirely
 * against other partitions.
 */
export function exposedFaceRects(
  grid: VoxelGrid,
  box: Box,
  axis: Axis,
  high: boolean,
): FaceRect[] {
  const { nx, ny, nz, cells } = grid;
  const [uAxis, vAxis] = transverseAxes(axis);
  const uSpan = box[EXTENT[uAxis]];
  const vSpan = box[EXTENT[vAxis]];
  const uBase = box[ORIGIN[uAxis]];
  const vBase = box[ORIGIN[vAxis]];
  const outer = outerLayer(box, axis, high);

  const index = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  const inGrid = (i: number, j: number, k: number) =>
    i >= 0 && j >= 0 && k >= 0 && i < nx && j < ny && k < nz;

  const mask = new Uint8Array(uSpan * vSpan);
  let exposed = 0;
  const at = [0, 0, 0];
  for (let v = 0; v < vSpan; v++) {
    for (let u = 0; u < uSpan; u++) {
      at[axis] = outer;
      at[uAxis] = uBase + u;
      at[vAxis] = vBase + v;
      // Outside the grid counts as exposed: a box flush with the grid edge has
      // no neighbour there, and leaving it unmarked would silently make it
      // rigid.
      const beyondIsAir =
        inGrid(at[0], at[1], at[2]) && cells[index(at[0], at[1], at[2])] === Cell.Air;
      if (!beyondIsAir) {
        mask[u + uSpan * v] = Cell.Air;
        exposed++;
      }
    }
  }
  if (exposed === 0) return [];

  const faceGrid: VoxelGrid = {
    nx: uSpan,
    ny: vSpan,
    nz: 1,
    dx: grid.dx,
    origin: { x: 0, y: 0, z: 0 },
    cells: mask,
    surfaceOf: new Int32Array(uSpan * vSpan).fill(-1),
    airCount: exposed,
    solidCount: uSpan * vSpan - exposed,
    leaked: false,
    warnings: [],
  };

  return decompose(faceGrid, { minBoxEdge: 1 }).boxes.map((rect) => ({
    uMin: uBase + rect.x,
    uMax: uBase + rect.x + rect.w,
    vMin: vBase + rect.y,
    vMax: vBase + rect.y + rect.h,
  }));
}

/**
 * Which surface sits behind a face rectangle.
 *
 * One coefficient per rectangle, so a rectangle spanning two materials takes
 * whichever covers more of it. Returns -1 when the grid recorded no surface
 * there at all — a face against the grid's padding rather than against
 * geometry.
 */
export function dominantSurface(
  grid: VoxelGrid,
  axis: Axis,
  high: boolean,
  box: Box,
  rect: FaceRect,
): number {
  const [uAxis, vAxis] = transverseAxes(axis);
  const outer = outerLayer(box, axis, high);
  const counts = new Map<number, number>();
  const at = [0, 0, 0];

  for (let v = rect.vMin; v < rect.vMax; v++) {
    for (let u = rect.uMin; u < rect.uMax; u++) {
      at[axis] = outer;
      at[uAxis] = u;
      at[vAxis] = v;
      if (
        at[0] < 0 || at[1] < 0 || at[2] < 0 ||
        at[0] >= grid.nx || at[1] >= grid.ny || at[2] >= grid.nz
      ) {
        continue;
      }
      const surface = grid.surfaceOf[at[0] + grid.nx * (at[1] + grid.ny * at[2])];
      if (surface >= 0) counts.set(surface, (counts.get(surface) ?? 0) + 1);
    }
  }

  let best = 0;
  let surfaceIndex = -1;
  for (const [surface, count] of counts) {
    if (count > best) {
      best = count;
      surfaceIndex = surface;
    }
  }
  return surfaceIndex;
}
