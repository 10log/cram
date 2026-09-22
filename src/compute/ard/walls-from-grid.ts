/**
 * Turning a decomposed voxel grid into wall slabs — the part of Phase 6 that
 * discharges the contract `pml-partition.ts` states but cannot enforce.
 *
 * Every partition face not shared with another partition is a room surface and
 * needs an absorbing layer. Placing those layers is not as simple as "one slab
 * per face", for three reasons.
 *
 * ## Corners
 *
 * A `PmlPartition` damps one axis. Two slabs overlapping at a room corner would
 * need both, which it does not implement — the reference papers over that case
 * with a hand-tuned constant cross-term. **Slabs are therefore clipped to their
 * own face's extent and never extend past it.** The slab beyond a box's low-x
 * face occupies `x < x0` but keeps the face's own `y` and `z` range; the slab
 * beyond the low-y face occupies `y < y0` but keeps the face's `x` range. The
 * corner region beyond both is simply left empty, so no cell is ever inside two
 * slabs.
 *
 * The cost is that the corner is not modelled: a wave arriving there at a
 * grazing angle runs off the side of a slab, which zero-pads and so reflects it
 * as a pressure-release surface. The error is local to the corner and bounded;
 * the alternative was a partition kind that does not exist.
 *
 * ## Partly-shared faces
 *
 * A face can be half against a neighbouring partition and half against a wall —
 * an L-shaped room does this at the inside corner. Covering the whole face
 * would put a slab on top of a neighbour. So each face's exposed cells are
 * collected as a 2D mask and covered with rectangles, one slab per rectangle.
 * That is the same greedy cover `decompose` already performs, run on a
 * one-cell-deep grid, so the two cannot disagree about what "cover this region
 * with boxes" means.
 *
 * ## Slabs need somewhere to go, and they are not cheap
 *
 * A slab grows outward from a room face into solid cells. A voxelized room's
 * shell is one cell thick, so almost all of that space is the grid's padding —
 * and `voxelizeTriangles` pads by one cell by default, which is not enough for
 * any slab at all. **A grid intended for a simulation with walls must be
 * voxelized with `padCells` of at least {@link padCellsForWalls}.** Measured on
 * a 3 x 2.4 x 2 m room at `dx = 0.1`, with `padCells: 1` all six faces are
 * dropped for lack of room.
 *
 * Thickness buys absorption and costs cells, and the exchange rate is steep
 * (`|R|` floors measured at Courant 0.446, grading 2; cell cost relative to the
 * same room's air volume):
 *
 * | thickness | max α | slab cells |
 * |-----------|-------|------------|
 * | 4         | 0.813 | ~1.0x room |
 * | 6         | 0.910 | ~1.6x room |
 * | 8         | 0.958 | ~2.1x room |
 * | 12        | 0.992 | ~3.1x room |
 * | 16        | 0.998 | ~4.2x room |
 * | 20        | 0.999 | ~5.2x room |
 *
 * {@link DEFAULT_WALL_THICKNESS} is 8: it reaches α = 0.958, past any material
 * in the database, for about twice the room in cells. Note what this does to
 * the plan's §5 cost table, which counts room cells only — with walls the real
 * figure is three times its rows. A locally-reacting impedance boundary (plan
 * reference [6]) would cost no cells at all and is the way out.
 *
 * ## Thin solid structures
 *
 * A pillar four cells across has air on both sides. Two 20-cell slabs growing
 * inward would overlap inside it. Every slab therefore grows outward only
 * through cells that are solid **and unclaimed**, and claims what it takes. A
 * slab that cannot reach a useful thickness is dropped, and the face left rigid
 * — reported as a warning, because a rigid wall where the user asked for an
 * absorbing one is a result worth knowing about.
 */

import { decompose } from './decompose';
import type { Decomposition } from './decompose';
import { Axis, type Box } from './partition';
import { PmlPartition } from './pml-partition';
import { Cell, type VoxelGrid } from './voxelize';
import { createWall } from './wall';

/** A rectangle of one partition face that faces a room surface. */
export interface WallFace {
  boxIndex: number;
  axis: Axis;
  /** True when the face is the box's high edge on `axis`. */
  high: boolean;
  /** The slab's footprint, in global cell coordinates. */
  box: Box;
  /** Cells of solid the slab could actually claim. */
  thickness: number;
  /** Surface index behind the face, or -1 when the grid recorded none. */
  surfaceIndex: number;
}

export interface WallPlan {
  faces: WallFace[];
  /** Faces dropped for lack of room, as human-readable notes. */
  warnings: string[];
  /** Cells added by the slabs, for cost reporting. */
  slabCells: number;
}

const ORIGIN: readonly ['x', 'y', 'z'] = ['x', 'y', 'z'];
const EXTENT: readonly ['w', 'h', 'd'] = ['w', 'h', 'd'];

function transverseAxes(axis: Axis): [Axis, Axis] {
  if (axis === Axis.X) return [Axis.Y, Axis.Z];
  if (axis === Axis.Y) return [Axis.X, Axis.Z];
  return [Axis.X, Axis.Y];
}

/**
 * Thicknesses a slab may be built at.
 *
 * Quantized because each distinct thickness costs a calibration curve (~1s),
 * and a room with a dozen awkward faces would otherwise pay for a dozen. The
 * ladder descends so a face with little room still gets the best layer that
 * fits.
 */
export const WALL_THICKNESS_LADDER = [20, 16, 12, 8, 6, 4] as const;

/**
 * Default slab thickness: α up to 0.958 for about twice the room in cells.
 * See the table above for the other rungs.
 */
export const DEFAULT_WALL_THICKNESS = 8;

/** Below this, a slab absorbs too little to be worth the cells it costs. */
const MIN_USEFUL_THICKNESS = 4;

/**
 * Padding a voxel grid needs so wall slabs of this thickness have room: the
 * slab itself plus the one cell of shell it starts behind.
 */
export function padCellsForWalls(thickness: number = DEFAULT_WALL_THICKNESS): number {
  return thickness + 1;
}

/**
 * Work out where wall slabs go, without building them.
 *
 * Separated from construction so the geometry can be tested without paying for
 * calibration curves, and so a caller can report the cost before committing.
 */
export function planWalls(
  grid: VoxelGrid,
  decomposition: Decomposition,
  maxThickness: number = DEFAULT_WALL_THICKNESS,
): WallPlan {
  const { nx, ny, nz, cells, surfaceOf } = grid;
  const dims = [nx, ny, nz];
  const faces: WallFace[] = [];
  const warnings: string[] = [];
  /** Solid cells already taken by a slab, so two slabs never overlap. */
  const claimed = new Uint8Array(nx * ny * nz);
  let slabCells = 0;

  const index = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  const inGrid = (i: number, j: number, k: number) =>
    i >= 0 && j >= 0 && k >= 0 && i < nx && j < ny && k < nz;

  for (let boxIndex = 0; boxIndex < decomposition.boxes.length; boxIndex++) {
    const box = decomposition.boxes[boxIndex];

    for (let axis = Axis.X; axis <= Axis.Z; axis++) {
      // A 1-thick axis has no outside to put a wall on — a 2D run is a slice
      // through the room, not a room with a floor and ceiling one cell apart.
      if (dims[axis] <= 1) continue;

      for (const high of [false, true]) {
        const [uAxis, vAxis] = transverseAxes(axis);
        const uSpan = box[EXTENT[uAxis]];
        const vSpan = box[EXTENT[vAxis]];
        const uBase = box[ORIGIN[uAxis]];
        const vBase = box[ORIGIN[vAxis]];
        // The first cell outside the face, along `axis`.
        const outer = high
          ? box[ORIGIN[axis]] + box[EXTENT[axis]]
          : box[ORIGIN[axis]] - 1;
        const stepOut = high ? 1 : -1;

        // Exposed mask: a face cell is a wall where the cell beyond it is not
        // air. Where it is air, another partition is there and Phase 5's
        // interface forcing handles the join instead.
        const mask = new Uint8Array(uSpan * vSpan);
        let exposed = 0;
        for (let v = 0; v < vSpan; v++) {
          for (let u = 0; u < uSpan; u++) {
            const at = [0, 0, 0];
            at[axis] = outer;
            at[uAxis] = uBase + u;
            at[vAxis] = vBase + v;
            const outside =
              inGrid(at[0], at[1], at[2]) && cells[index(at[0], at[1], at[2])] === Cell.Air;
            if (!outside) {
              mask[u + uSpan * v] = Cell.Air;
              exposed++;
            }
          }
        }
        if (exposed === 0) continue;

        // Cover the exposed mask with rectangles. Reusing `decompose` on a
        // one-cell-deep grid keeps this consistent with how the air region
        // itself is covered.
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
        const cover = decompose(faceGrid, { minBoxEdge: 1 });

        for (const rect of cover.boxes) {
          // How far outward can this rectangle grow through solid, unclaimed
          // cells? The whole rectangle has to clear, or the slab would be
          // ragged.
          let available = 0;
          grow: for (let t = 0; t < maxThickness; t++) {
            for (let v = 0; v < rect.h; v++) {
              for (let u = 0; u < rect.w; u++) {
                const at = [0, 0, 0];
                at[axis] = outer + stepOut * t;
                at[uAxis] = uBase + rect.x + u;
                at[vAxis] = vBase + rect.y + v;
                if (!inGrid(at[0], at[1], at[2])) break grow;
                const idx = index(at[0], at[1], at[2]);
                if (cells[idx] === Cell.Air || claimed[idx]) break grow;
              }
            }
            available = t + 1;
          }

          const thickness =
            WALL_THICKNESS_LADDER.find((candidate) => candidate <= available) ?? 0;

          if (thickness < MIN_USEFUL_THICKNESS) {
            warnings.push(
              `A wall face of box ${boxIndex} on ${high ? '+' : '-'}${'xyz'[axis]} has only ` +
                `${available} cells of solid behind it, below the ${MIN_USEFUL_THICKNESS} an ` +
                'absorbing layer needs, so that face is left rigid. Voxelize with ' +
                `padCells >= ${maxThickness + 1} to give the slabs room.`,
            );
            continue;
          }

          // Claim the cells so no other slab can take them.
          const dominant = new Map<number, number>();
          for (let t = 0; t < thickness; t++) {
            for (let v = 0; v < rect.h; v++) {
              for (let u = 0; u < rect.w; u++) {
                const at = [0, 0, 0];
                at[axis] = outer + stepOut * t;
                at[uAxis] = uBase + rect.x + u;
                at[vAxis] = vBase + rect.y + v;
                const idx = index(at[0], at[1], at[2]);
                claimed[idx] = 1;
                if (t === 0) {
                  const surface = surfaceOf[idx];
                  if (surface >= 0) dominant.set(surface, (dominant.get(surface) ?? 0) + 1);
                }
              }
            }
          }

          // One absorption coefficient per slab, so a face spanning two
          // materials takes whichever covers more of it. Splitting the face per
          // material would be more faithful and is left for later; the slab
          // count, and with it the cost, would rise.
          let surfaceIndex = -1;
          let best = 0;
          for (const [surface, count] of dominant) {
            if (count > best) {
              best = count;
              surfaceIndex = surface;
            }
          }

          const slab: Box = { x: 0, y: 0, z: 0, w: 1, h: 1, d: 1 };
          slab[ORIGIN[axis]] = high ? outer : outer - (thickness - 1);
          slab[EXTENT[axis]] = thickness;
          slab[ORIGIN[uAxis]] = uBase + rect.x;
          slab[EXTENT[uAxis]] = rect.w;
          slab[ORIGIN[vAxis]] = vBase + rect.y;
          slab[EXTENT[vAxis]] = rect.h;

          faces.push({ boxIndex, axis, high, box: slab, thickness, surfaceIndex });
          slabCells += slab.w * slab.h * slab.d;
        }
      }
    }
  }

  return { faces, warnings, slabCells };
}

export interface BuildWallsOptions {
  dx: number;
  c: number;
  dt: number;
  /** Absorption coefficient for a surface index. -1 means "no surface recorded". */
  absorptionFor: (surfaceIndex: number) => number;
  gradingExponent?: number;
}

/**
 * Build the PML partitions for a wall plan.
 *
 * Each slab is calibrated for its own thickness, so a face that could only take
 * a thin layer still gets the best absorption that layer can deliver rather
 * than a coefficient it cannot reach.
 */
export function buildWalls(
  plan: WallPlan,
  options: BuildWallsOptions,
): { partitions: PmlPartition[]; warnings: string[] } {
  const { dx, c, dt, absorptionFor, gradingExponent = 2 } = options;
  const partitions: PmlPartition[] = [];
  const warnings: string[] = [];

  for (const face of plan.faces) {
    const alpha = absorptionFor(face.surfaceIndex);

    try {
      partitions.push(
        createWall({
          // `createWall` derives the slab from the room box, so hand it a box
          // whose face is exactly this slab's footprint.
          box: faceOwnerBox(face),
          axis: face.axis,
          high: face.high,
          alpha,
          dx,
          c,
          dt,
          thickness: face.thickness,
          gradingExponent,
        }),
      );
    } catch (error) {
      // A layer that cannot reach the requested absorption is reported and the
      // face left rigid, rather than silently given a wall more reflective than
      // the material it stands for.
      warnings.push(
        `Could not build a wall for surface ${face.surfaceIndex} at alpha ${alpha.toFixed(3)}: ` +
          `${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return { partitions, warnings };
}

/**
 * The box `createWall` should treat as the room, such that the slab it builds
 * is exactly this face's footprint.
 */
function faceOwnerBox(face: WallFace): Box {
  const owner: Box = { ...face.box };
  // Collapse the damped axis to zero thickness at the face plane: createWall
  // then extends `thickness` cells outward from it, reproducing face.box.
  owner[EXTENT[face.axis]] = 0;
  owner[ORIGIN[face.axis]] = face.high
    ? face.box[ORIGIN[face.axis]]
    : face.box[ORIGIN[face.axis]] + face.box[EXTENT[face.axis]];
  return owner;
}
