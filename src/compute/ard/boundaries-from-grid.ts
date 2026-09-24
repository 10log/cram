/**
 * Turning a decomposed voxel grid into impedance boundaries.
 *
 * The counterpart of `walls-from-grid.ts`, and a much shorter one. That module
 * has to find somewhere to *put* each absorbing layer — a slab grows outward
 * through solid cells, so it needs padding to grow into, it must not collide
 * with another slab inside a thin wall, and it is dropped when it cannot reach
 * a useful thickness. An impedance boundary occupies no cells at all. It is a
 * forcing term on the three cells behind a face that already exist, so there is
 * nothing to place, nothing to claim, and nothing to drop.
 *
 * What survives from the slab planner is the geometry question both share, and
 * they share the answer too: {@link exposedFaceRects} decides which parts of a
 * partition face are room surface rather than a join with a neighbour, and
 * {@link dominantSurface} says what material is behind each rectangle.
 *
 * Three consequences worth stating, because they are the point of the exercise:
 *
 *  - **No padding requirement.** `planWalls` needs `padCells >= thickness + 1`
 *    and throws when a grid cannot supply it. This needs the default 1.
 *  - **A looser time step.** A slab is a `PmlPartition` running an explicit
 *    stencil, and since every partition shares one `Δt` it sets the time step
 *    for the whole simulation — about Courant 0.446 on a 3D room regardless of
 *    material. An impedance boundary has its own measured limit, `0.55 − 0.05α`,
 *    which is above that at every absorption coefficient. Hence
 *    {@link ImpedancePlan.maxAbsorption}: the planner reports the most
 *    absorbing face so the driver can apply it.
 *  - **No calibration.** Each distinct slab thickness costs a measured
 *    reflection curve, about a second. `impedanceForAbsorption` is a closed
 *    form.
 */

import type { Decomposition } from './decompose';
import { dominantSurface, exposedFaceRects, faceWeights, type FaceRect } from './face-rects';
import {
  ImpedanceBoundary,
  RIGID_ALPHA_EPSILON,
  impedanceCourantLimit,
  impedanceForAbsorption,
} from './impedance';
import { Axis, type Partition } from './partition';
import type { VoxelGrid } from './voxelize';

export { impedanceCourantLimit };

/** One rectangle of one partition face, carrying one material. */
export interface ImpedanceFace extends FaceRect {
  boxIndex: number;
  axis: Axis;
  /** True when the face is the box's high edge on `axis`. */
  high: boolean;
  /** Surface index behind the face, or -1 when the grid recorded none. */
  surfaceIndex: number;
  /**
   * Staircase weight per face cell (#220), from `faceWeights`. Absent when
   * the grid carries none, which is the uncorrected boundary.
   */
  weights?: Float64Array;
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
export function planImpedanceBoundaries(
  grid: VoxelGrid,
  decomposition: Decomposition,
  options: PlanImpedanceOptions = {},
): ImpedancePlan {
  const { absorptionFor } = options;
  const dims = [grid.nx, grid.ny, grid.nz];
  const faces: ImpedanceFace[] = [];
  const warnings: string[] = [];
  let boundaryCells = 0;
  let skippedRigid = 0;
  let maxAbsorption = 0;

  for (let boxIndex = 0; boxIndex < decomposition.boxes.length; boxIndex++) {
    const box = decomposition.boxes[boxIndex];

    for (let axis = Axis.X; axis <= Axis.Z; axis++) {
      // A 1-thick axis has no outside to put a surface on — a 2D run is a slice
      // through the room, and its two collapsed faces are the slice itself, not
      // a floor and a ceiling one cell apart. Same rule as `planWalls`, so the
      // two boundary kinds cover the same faces.
      if (dims[axis] <= 1) continue;

      for (const high of [false, true]) {
        for (const rect of exposedFaceRects(grid, box, axis, high)) {
          const surfaceIndex = dominantSurface(grid, axis, high, box, rect);
          const alpha = absorptionFor ? absorptionFor(surfaceIndex) : 1;

          if (absorptionFor && alpha <= RIGID_ALPHA_EPSILON) {
            skippedRigid++;
            continue;
          }

          const weights = faceWeights(grid, axis, high, box, rect);
          faces.push({ boxIndex, axis, high, surfaceIndex, ...rect, ...(weights && { weights }) });
          boundaryCells += (rect.uMax - rect.uMin) * (rect.vMax - rect.vMin);
          maxAbsorption = Math.max(maxAbsorption, Math.min(1, alpha));
        }
      }
    }
  }

  if (faces.length === 0 && skippedRigid > 0) {
    // Not an error, unlike the slab planner's equivalent. There is no way to
    // arrive here by under-padding a grid, so the only cause is the caller
    // asking for perfectly reflective materials — which is carried out
    // faithfully, and said out loud because a rigid room's reverberation time
    // is set by nothing but its volume.
    warnings.push(
      `No impedance boundaries were built: all ${skippedRigid} faces have materials that ` +
        'absorb nothing, so every surface is rigid.',
    );
  }

  return { faces, warnings, boundaryCells, skippedRigid, maxAbsorption };
}

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
export function buildImpedanceBoundaries(
  plan: ImpedancePlan,
  partitions: readonly Partition[],
  options: BuildImpedanceOptions,
): { boundaries: ImpedanceBoundary[]; warnings: string[] } {
  const { absorptionFor } = options;
  const boundaries: ImpedanceBoundary[] = [];
  const warnings: string[] = [];

  for (const face of plan.faces) {
    const partition = partitions[face.boxIndex];
    if (!partition) {
      throw new Error(
        `Impedance plan refers to box ${face.boxIndex}, but only ${partitions.length} ` +
          'partitions were given. The partition list must be in decomposition order.',
      );
    }

    const alpha = absorptionFor(face.surfaceIndex);
    const impedance = impedanceForAbsorption(alpha);
    if (!Number.isFinite(impedance)) {
      // α = 0 after the plan was made — a caller passing a different
      // `absorptionFor` to `build` than to `plan`. A rigid boundary is a no-op,
      // so skip it rather than build one whose residual is identically zero.
      warnings.push(
        `Surface ${face.surfaceIndex} absorbs nothing at build time though the plan ` +
          'expected it to; that face is rigid.',
      );
      continue;
    }

    boundaries.push(
      new ImpedanceBoundary({
        partition,
        axis: face.axis,
        high: face.high,
        uMin: face.uMin,
        uMax: face.uMax,
        vMin: face.vMin,
        vMax: face.vMax,
        impedance,
        weights: face.weights,
      }),
    );
  }

  return { boundaries, warnings };
}
