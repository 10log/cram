/**
 * Taking a plane out of a voxel grid — Phase 9 of the ARD solver
 * (docs/ard-solver-plan.md).
 *
 * ## Why a slice of a 3D grid, rather than a 2D voxelizer
 *
 * A 2D run needs a grid with one axis of extent 1. The cheap way to get one is
 * to intersect the room's triangles with the plane and rasterize the resulting
 * segments — no 3D grid at all. The way taken here is to voxelize the room in
 * three dimensions as usual and lift one layer out of it, which costs the whole
 * 3D grid for a result that uses one plane of it.
 *
 * That is deliberate, for two reasons. It reuses the exact triangle/box overlap
 * and the flood fill that Phases 2 and 3 validated, rather than a second
 * rasterizer with its own separating-axis test to get subtly wrong. And it
 * makes the 2D air region *the same region* the 3D run would have used at that
 * height, so the two modes cannot disagree about where the room is — which they
 * could, at a doorway or a balcony edge, if the plan view were computed
 * independently.
 *
 * The cost is real and worth stating. Measured on a 10 x 4 x 8 m room:
 *
 * | `fMax` | `Δx`    | 3D grid     | voxelize | slice cells |
 * |--------|---------|-------------|----------|-------------|
 * | 1 kHz  | 13.2 cm | 0.38M cells | 42 ms    | 7 600       |
 * | 2 kHz  | 6.6 cm  | 1.93M       | 69 ms    | 24 111      |
 * | 4 kHz  | 3.3 cm  | 11.93M      | 948 ms   | 84 626      |
 *
 * Under a second even at 4 kHz, against a simulation that runs for minutes —
 * and the simulation itself only ever touches the 85 000 cells of the plane,
 * which is the whole point of the mode.
 */

import { Cell, type VoxelGrid } from './voxelize';

/**
 * Which plane a 2D run lives on, in CRAM's Y-up world.
 *
 * Matches `compute/2d-fdtd/slice.ts`, which already had to settle this: `xz` is
 * the floor plan and `xy` is a vertical section. The naming is worth being
 * careful with, because the axis that gets collapsed is the one *not* named —
 * `xz` collapses world Y, and world Y is grid axis 1, not 2.
 */
export type ArdSlice = 'xz' | 'xy';

/** Grid axis collapsed by a slice: 1 (world Y) for `xz`, 2 (world Z) for `xy`. */
export function collapsedAxis(slice: ArdSlice): 1 | 2 {
  return slice === 'xz' ? 1 : 2;
}

/**
 * The layer of `grid` at `index` along `axis`, as a grid of its own.
 *
 * The result has extent 1 on that axis and keeps the other two — including
 * their padding, which the wall slabs still need to grow into. `airCount`,
 * `solidCount` and `leaked` are recomputed for the plane: a layer of a sound
 * 3D grid can still be empty, and a 2D run on no air cells is not a run.
 */
export function sliceGrid(grid: VoxelGrid, axis: 1 | 2, index: number): VoxelGrid {
  const { nx, ny, nz } = grid;
  const extent = axis === 1 ? ny : nz;
  if (!Number.isInteger(index) || index < 0 || index >= extent) {
    throw new Error(
      `Slice index ${index} is outside the grid's ${extent} layers on axis ${axis}`,
    );
  }

  const outNy = axis === 1 ? 1 : ny;
  const outNz = axis === 2 ? 1 : nz;
  const size = nx * outNy * outNz;
  const cells = new Uint8Array(size);
  const surfaceOf = new Int32Array(size).fill(-1);
  let airCount = 0;

  for (let k = 0; k < outNz; k++) {
    for (let j = 0; j < outNy; j++) {
      for (let i = 0; i < nx; i++) {
        const sourceIndex =
          axis === 1 ? i + nx * (index + ny * k) : i + nx * (j + ny * index);
        const target = i + nx * (j + outNy * k);
        cells[target] = grid.cells[sourceIndex];
        surfaceOf[target] = grid.surfaceOf[sourceIndex];
        if (cells[target] === Cell.Air) airCount++;
      }
    }
  }

  // The origin moves onto the plane, so `worldToCell` on the sliced grid maps
  // the two in-plane coordinates correctly.
  //
  // It does **not** rescue the third one. `worldToCell` rounds and then
  // bounds-checks, so with an extent of 1 the collapsed index must round to
  // exactly 0 — a point more than half a cell off the plane returns `null`, not
  // layer 0. At `fMax` 400 that is 17 cm, which is an ordinary difference
  // between a source height and a listener height. **A caller resolving probes
  // against a sliced grid has to project them onto the plane first**; `ARD`
  // does, and there is a regression test for a receiver a full cell off the
  // cut.
  const origin = { ...grid.origin };
  if (axis === 1) origin.y = grid.origin.y + index * grid.dx;
  else origin.z = grid.origin.z + index * grid.dx;

  return {
    nx,
    ny: outNy,
    nz: outNz,
    dx: grid.dx,
    origin,
    cells,
    surfaceOf,
    airCount,
    solidCount: size - airCount,
    // A slice of a sound grid is sound: the fill already proved the room
    // encloses a volume, and taking a plane out of it cannot open one.
    leaked: grid.leaked,
    warnings: [...grid.warnings],
  };
}

/**
 * The layer index whose centre is nearest `coordinate` on `axis`, clamped into
 * the grid.
 *
 * Used to turn "cut the floor plan at 1.2 m" into a layer. Clamping rather than
 * throwing because a height above the ceiling is a slider that went too far,
 * not a broken room — but the caller is told, so the UI can say which plane it
 * actually used.
 */
export function layerForCoordinate(
  grid: VoxelGrid,
  axis: 1 | 2,
  coordinate: number,
): { index: number; clamped: boolean } {
  const extent = axis === 1 ? grid.ny : grid.nz;
  const origin = axis === 1 ? grid.origin.y : grid.origin.z;
  const raw = Math.round((coordinate - origin) / grid.dx);
  const index = Math.min(extent - 1, Math.max(0, raw));
  return { index, clamped: index !== raw };
}

/** Whether a layer has any air in it at all. */
export function sliceHasAir(grid: VoxelGrid, axis: 1 | 2, index: number): boolean {
  const { nx, ny, nz } = grid;
  for (let k = 0; k < (axis === 2 ? 1 : nz); k++) {
    for (let j = 0; j < (axis === 1 ? 1 : ny); j++) {
      for (let i = 0; i < nx; i++) {
        const at = axis === 1 ? i + nx * (index + ny * k) : i + nx * (j + ny * index);
        if (grid.cells[at] === Cell.Air) return true;
      }
    }
  }
  return false;
}

/**
 * The layer with the most air, for when the caller has no height in mind.
 *
 * Better than the middle of the bounding box, which on a room with a pitched
 * roof or a raked floor can land mostly in solid. Ties break toward the centre,
 * so a shoebox — where every layer is identical — cuts through the middle
 * rather than at the floor.
 */
export function widestLayer(grid: VoxelGrid, axis: 1 | 2): number {
  const { nx, ny, nz } = grid;
  const extent = axis === 1 ? ny : nz;
  const centre = (extent - 1) / 2;
  let best = 0;
  let bestAir = -1;
  let bestDistance = Infinity;

  for (let layer = 0; layer < extent; layer++) {
    let air = 0;
    for (let k = 0; k < (axis === 2 ? 1 : nz); k++) {
      for (let j = 0; j < (axis === 1 ? 1 : ny); j++) {
        for (let i = 0; i < nx; i++) {
          const index =
            axis === 1 ? i + nx * (layer + ny * k) : i + nx * (j + ny * layer);
          if (grid.cells[index] === Cell.Air) air++;
        }
      }
    }
    const distance = Math.abs(layer - centre);
    if (air > bestAir || (air === bestAir && distance < bestDistance)) {
      best = layer;
      bestAir = air;
      bestDistance = distance;
    }
  }
  return best;
}
