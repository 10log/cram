/**
 * Rectangular decomposition — Phase 3 of the ARD solver
 * (docs/ard-solver-plan.md).
 *
 * ARD's premise is that the air region can be covered by disjoint axis-aligned
 * boxes, each advanced exactly in a cosine modal basis, with the fictitious
 * walls between them cancelled by interface forcing (Phase 5). This produces
 * that cover.
 *
 * Like Phase 2, there is nothing to port: the reference reads a pre-baked
 * `.rec` box list from an offline MATLAB step.
 *
 * ## The algorithm
 *
 * Greedy growth, after Raghuvanshi §4. Take the lowest-index unassigned air
 * cell, grow a box from it one axis at a time — maximally along the first axis,
 * then extend that run along the second while every cell of the candidate slab
 * is unassigned air, then along the third — emit it, mark its cells, repeat.
 * Every cell is assigned exactly once, so the boxes are disjoint and cover the
 * air region completely.
 *
 * ## Axis order is a non-lever — measured
 *
 * The plan asserted that growing the longest run first "noticeably reduces the
 * box count". It does not. Measured against a fixed x→y→z order it **ties on
 * every room-like shape tried** — corridor, L, cross, T, comb, staircase,
 * pillared room, ball — and on 200 randomized air masks it was *worse*: 172
 * losses to 17 wins, mean 207.5 boxes against 202.9.
 *
 * Nor does the stronger version help. Trying all six orders per seed and
 * keeping the largest box also ties on every room-like shape and comes out
 * slightly worse on random masks (205.2 vs 202.8), because greedily maximizing
 * one box leaves worse leftovers for the rest.
 *
 * The reason is that the slab rule already extends maximally along each axis in
 * turn, so for near-rectilinear geometry — which rooms are — the result is
 * order-independent. `longestAxisFirst` is kept, defaulted off, so the negative
 * result stays pinned by a test rather than being rediscovered.
 *
 * Reducing the box count, and with it the interface area where the error lives,
 * needs a different idea than axis ordering — seed selection or a merge pass.
 *
 * ## Thin boxes
 *
 * The interface stencil reads three cells either side of a face, so a box
 * thinner than that cannot supply a full residual. Those are emitted as `fdtd`
 * rather than `dct`: `FdtdPartition` zero-pads instead of mirroring and needs
 * no such depth. This is exactly why the reference keeps an FDTD partition kind
 * around, and why Phase 4 implements one.
 *
 * Merging a thin box into a neighbour is the alternative the plan mentions. It
 * is not done here because the union of two boxes is only a box in special
 * cases, so a merge pass would succeed rarely and silently leave the rest —
 * whereas marking the kind always works and Phase 4 already handles it.
 */

import type { Box } from './partition';
import { Cell, type VoxelGrid } from './voxelize';

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

/** Three cells either side of a face, as the 6th-order interface stencil needs. */
export const INTERFACE_STENCIL_DEPTH = 3;

const DEFAULT_MIN_BOX_EDGE = 2 * INTERFACE_STENCIL_DEPTH + 1;

/**
 * Cover a voxel grid's air region with disjoint axis-aligned boxes.
 *
 * Throws on a leaked grid: the air region of a room whose surfaces do not close
 * is the whole bounding box, and decomposing that would produce a large, silent
 * nonsense rather than an error.
 */
export function decompose(grid: VoxelGrid, options: DecomposeOptions = {}): Decomposition {
  const { minBoxEdge = DEFAULT_MIN_BOX_EDGE, longestAxisFirst = false } = options;
  const { nx, ny, nz, cells } = grid;

  if (grid.leaked) {
    throw new Error(
      'Refusing to decompose a leaked voxel grid: the air region spans the whole bounding ' +
        'box, so the result would be meaningless. Fix the room geometry or the seed point.',
    );
  }
  if (!Number.isInteger(minBoxEdge) || minBoxEdge < 1) {
    throw new Error(`minBoxEdge must be a positive integer, got ${minBoxEdge}`);
  }

  const total = nx * ny * nz;
  const assignment = new Int32Array(total).fill(-1);
  const boxes: Box[] = [];
  const kinds: PartitionKind[] = [];

  const strideY = nx;
  const strideZ = nx * ny;

  let airCells = 0;
  for (let i = 0; i < total; i++) if (cells[i] === Cell.Air) airCells++;

  /** Is this cell free to be taken into the box being grown? */
  const free = (i: number, j: number, k: number): boolean => {
    const idx = i + strideY * j + strideZ * k;
    return cells[idx] === Cell.Air && assignment[idx] < 0;
  };

  /** Length of the free run from (i,j,k) along `axis`. */
  const runLength = (i: number, j: number, k: number, axis: 0 | 1 | 2): number => {
    const limit = axis === 0 ? nx : axis === 1 ? ny : nz;
    const start = axis === 0 ? i : axis === 1 ? j : k;
    let n = 0;
    while (start + n < limit) {
      const ok =
        axis === 0
          ? free(i + n, j, k)
          : axis === 1
            ? free(i, j + n, k)
            : free(i, j, k + n);
      if (!ok) break;
      n++;
    }
    return n;
  };

  /**
   * Can the box grow one more cell along `axis`? Every cell of the new slab
   * must be free, which is what keeps the boxes disjoint.
   */
  const slabIsFree = (
    o: [number, number, number],
    e: [number, number, number],
    axis: 0 | 1 | 2,
  ): boolean => {
    const at = [o[0], o[1], o[2]];
    at[axis] = o[axis] + e[axis];
    const limit = axis === 0 ? nx : axis === 1 ? ny : nz;
    if (at[axis] >= limit) return false;

    const spanA = axis === 0 ? 1 : e[0];
    const spanB = axis === 1 ? 1 : e[1];
    const spanC = axis === 2 ? 1 : e[2];

    for (let dk = 0; dk < spanC; dk++) {
      for (let dj = 0; dj < spanB; dj++) {
        for (let di = 0; di < spanA; di++) {
          const i = axis === 0 ? at[0] : o[0] + di;
          const j = axis === 1 ? at[1] : o[1] + dj;
          const k = axis === 2 ? at[2] : o[2] + dk;
          if (!free(i, j, k)) return false;
        }
      }
    }
    return true;
  };

  let coveredCells = 0;

  for (let seed = 0; seed < total; seed++) {
    if (cells[seed] !== Cell.Air || assignment[seed] >= 0) continue;

    const i0 = seed % nx;
    const j0 = ((seed - i0) / nx) % ny;
    const k0 = Math.floor(seed / strideZ);

    // Axis order for this seed. Longest single-cell run first, ties broken by
    // axis index so the result is deterministic.
    let order: [0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2] = [0, 1, 2];
    if (longestAxisFirst) {
      const runs: Array<{ axis: 0 | 1 | 2; len: number }> = [
        { axis: 0, len: runLength(i0, j0, k0, 0) },
        { axis: 1, len: runLength(i0, j0, k0, 1) },
        { axis: 2, len: runLength(i0, j0, k0, 2) },
      ];
      runs.sort((a, b) => b.len - a.len || a.axis - b.axis);
      order = [runs[0].axis, runs[1].axis, runs[2].axis];
    }

    const origin: [number, number, number] = [i0, j0, k0];
    const extent: [number, number, number] = [1, 1, 1];

    for (const axis of order) {
      while (slabIsFree(origin, extent, axis)) extent[axis]++;
    }

    const boxIndex = boxes.length;
    for (let k = origin[2]; k < origin[2] + extent[2]; k++) {
      for (let j = origin[1]; j < origin[1] + extent[1]; j++) {
        const rowBase = strideY * j + strideZ * k;
        for (let i = origin[0]; i < origin[0] + extent[0]; i++) {
          assignment[rowBase + i] = boxIndex;
        }
      }
    }
    coveredCells += extent[0] * extent[1] * extent[2];

    boxes.push({
      x: origin[0],
      y: origin[1],
      z: origin[2],
      w: extent[0],
      h: extent[1],
      d: extent[2],
    });

    // A 1-thick axis is a legitimate 2D run, not a thin box: it carries no
    // interface on that axis because there is nothing on the other side of it.
    const thin = ([extent[0], extent[1], extent[2]] as const).some(
      (e, axis) => {
        const gridExtent = axis === 0 ? nx : axis === 1 ? ny : nz;
        return gridExtent > 1 && e < minBoxEdge;
      },
    );
    kinds.push(thin ? 'fdtd' : 'dct');
  }

  let thinBoxCount = 0;
  for (const kind of kinds) if (kind === 'fdtd') thinBoxCount++;

  return {
    boxes,
    kinds,
    assignment,
    coverage: airCells === 0 ? 1 : coveredCells / airCells,
    coveredCells,
    thinBoxCount,
  };
}

/**
 * Check a decomposition against its grid: every air cell assigned exactly once,
 * no solid cell assigned, every box containing only air. Returns the problems
 * found, empty when sound.
 *
 * Cheap relative to a simulation and worth running before Phase 6 spends
 * minutes on a bad cover.
 */
export function validateDecomposition(
  grid: VoxelGrid,
  decomposition: Decomposition,
): string[] {
  const problems: string[] = [];
  const { nx, ny, nz, cells } = grid;
  const { boxes, assignment } = decomposition;
  const strideY = nx;
  const strideZ = nx * ny;

  const seen = new Int32Array(nx * ny * nz).fill(-1);
  for (let b = 0; b < boxes.length; b++) {
    const box = boxes[b];
    if (box.w < 1 || box.h < 1 || box.d < 1) {
      problems.push(`Box ${b} has a non-positive extent: ${box.w}x${box.h}x${box.d}`);
      continue;
    }
    if (
      box.x < 0 || box.y < 0 || box.z < 0 ||
      box.x + box.w > nx || box.y + box.h > ny || box.z + box.d > nz
    ) {
      problems.push(`Box ${b} extends outside the grid`);
      continue;
    }
    for (let k = box.z; k < box.z + box.d; k++) {
      for (let j = box.y; j < box.y + box.h; j++) {
        const rowBase = strideY * j + strideZ * k;
        for (let i = box.x; i < box.x + box.w; i++) {
          const idx = rowBase + i;
          if (cells[idx] !== Cell.Air) {
            problems.push(`Box ${b} covers solid cell (${i}, ${j}, ${k})`);
            return problems;
          }
          if (seen[idx] >= 0) {
            problems.push(`Cell (${i}, ${j}, ${k}) is covered by boxes ${seen[idx]} and ${b}`);
            return problems;
          }
          seen[idx] = b;
        }
      }
    }
  }

  for (let idx = 0; idx < cells.length; idx++) {
    if (cells[idx] === Cell.Air && seen[idx] < 0) {
      problems.push(`Air cell at index ${idx} is not covered by any box`);
      return problems;
    }
    if (cells[idx] !== Cell.Air && assignment[idx] >= 0) {
      problems.push(`Solid cell at index ${idx} is assigned to box ${assignment[idx]}`);
      return problems;
    }
    if (seen[idx] !== assignment[idx]) {
      problems.push(
        `Cell at index ${idx} is in box ${seen[idx]} but assignment says ${assignment[idx]}`,
      );
      return problems;
    }
  }

  return problems;
}
