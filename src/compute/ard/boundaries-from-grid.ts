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
  exceedsMaterialAbsorptionLimit,
  impedanceForMaterialAbsorption,
} from './impedance';
import { Axis, type Partition } from './partition';
import type { VoxelGrid } from './voxelize';
import type { GlobalField } from './interface';

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
  /**
   * Absorbing area per surface, before and after the staircase correction
   * (#220), in the order surfaces were first met. See {@link StaircaseArea}.
   */
  staircaseArea: StaircaseArea[];
}

/**
 * How much absorbing area one surface presents to the grid, the diagnostic
 * PFFDTD's voxelizer prints (#220). All in m².
 *
 * `staircased` counts every exposed cell face at full strength, which is what
 * the boundaries did before #220. For a surface of unit normal `n` it runs
 * `|nₓ| + |n_y| + |n_z|` times the true area, up to √3. `corrected` weights
 * each face by `|n·e|`, and is what the boundaries now use. `true` is the
 * triangles' own area, absent when the grid does not carry it (a 2D slice, or
 * a grid built by hand).
 *
 * `corrected` still reads below `true` by the shell's inset. The voxelizer
 * marks every cell a surface touches as solid, so the air region, and every
 * face of it, sits up to a cell inside the geometry. That is the same shrink
 * the air volume shows, and it is not a staircase effect.
 */
export interface StaircaseArea {
  surfaceIndex: number;
  staircased: number;
  corrected: number;
  true?: number;
}

/** One line per surface, in the spirit of PFFDTD's per-material printout. */
export function describeStaircaseArea(rows: readonly StaircaseArea[]): string[] {
  return rows.map(({ surfaceIndex, staircased, corrected, true: area }) => {
    const vs = (x: number) =>
      area && area > 0 ? ` (${x >= area ? '+' : ''}${(100 * (x / area - 1)).toFixed(1)}%)` : '';
    return (
      `surface ${surfaceIndex}: staircased ${staircased.toFixed(3)} m²${vs(staircased)}, ` +
      `corrected ${corrected.toFixed(3)} m²${vs(corrected)}` +
      (area !== undefined ? `, true ${area.toFixed(3)} m²` : '')
    );
  });
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
  const areas = new Map<number, StaircaseArea>();
  const cellArea = grid.dx * grid.dx;

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
          const cells = (rect.uMax - rect.uMin) * (rect.vMax - rect.vMin);
          boundaryCells += cells;
          let row = areas.get(surfaceIndex);
          if (!row) {
            const area = grid.surfaceArea?.[surfaceIndex];
            row = { surfaceIndex, staircased: 0, corrected: 0, ...(area !== undefined && { true: area }) };
            areas.set(surfaceIndex, row);
          }
          row.staircased += cells * cellArea;
          let weighted = cells;
          if (weights) {
            weighted = 0;
            for (let i = 0; i < weights.length; i++) weighted += weights[i];
          }
          row.corrected += weighted * cellArea;
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

  return {
    faces,
    warnings,
    boundaryCells,
    skippedRigid,
    maxAbsorption,
    staircaseArea: [...areas.values()],
  };
}

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
export function buildImpedanceBoundaries(
  plan: ImpedancePlan,
  partitions: readonly Partition[],
  options: BuildImpedanceOptions,
): { boundaries: ImpedanceBoundary[]; warnings: string[] } {
  const { absorptionFor, field, rank = 3 } = options;
  const boundaries: ImpedanceBoundary[] = [];
  const warnings: string[] = [];
  const overLimit = new Set<number>();

  for (const face of plan.faces) {
    const partition = partitions[face.boxIndex];
    if (!partition) {
      throw new Error(
        `Impedance plan refers to box ${face.boxIndex}, but only ${partitions.length} ` +
          'partitions were given. The partition list must be in decomposition order.',
      );
    }

    const alpha = absorptionFor(face.surfaceIndex);
    const impedance = impedanceForMaterialAbsorption(alpha, rank);
    if (exceedsMaterialAbsorptionLimit(alpha, rank) && !overLimit.has(face.surfaceIndex)) {
      overLimit.add(face.surfaceIndex);
      warnings.push(
        `Surface ${face.surfaceIndex} asks for ${alpha.toFixed(3)} random-incidence absorption, ` +
          'more than a locally-reacting wall can absorb from a diffuse field; it is simulated ' +
          'as the most absorbing wall there is.',
      );
    }
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
        field,
      }),
    );
  }

  return { boundaries, warnings };
}

/** Key identifying one face rectangle of one box, shared by every boundary plan. */
export function faceKey(boxIndex: number, axis: Axis, high: boolean, rect: FaceRect): string {
  return `${boxIndex}:${axis}:${high ? 1 : 0}:${rect.uMin},${rect.uMax},${rect.vMin},${rect.vMax}`;
}

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
export function buildRigidFdtdBoundaries(
  grid: VoxelGrid,
  decomposition: Decomposition,
  partitions: readonly Partition[],
  covered: ReadonlySet<string>,
  field?: GlobalField,
): ImpedanceBoundary[] {
  const dims = [grid.nx, grid.ny, grid.nz];
  const boundaries: ImpedanceBoundary[] = [];
  for (let boxIndex = 0; boxIndex < decomposition.boxes.length; boxIndex++) {
    if (decomposition.kinds[boxIndex] !== 'fdtd') continue;
    const box = decomposition.boxes[boxIndex];
    const partition = partitions[boxIndex];
    for (let axis = Axis.X; axis <= Axis.Z; axis++) {
      if (dims[axis] <= 1) continue;
      for (const high of [false, true]) {
        for (const rect of exposedFaceRects(grid, box, axis, high)) {
          if (covered.has(faceKey(boxIndex, axis, high, rect))) continue;
          boundaries.push(
            new ImpedanceBoundary({
              partition,
              axis,
              high,
              ...rect,
              impedance: Infinity,
              field,
            }),
          );
        }
      }
    }
  }
  return boundaries;
}

