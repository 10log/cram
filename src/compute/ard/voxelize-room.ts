/**
 * Adapter from a CRAM `Room` onto the pure voxelizer.
 *
 * Kept apart from `voxelize.ts` so the geometry core stays free of `three`, the
 * stores and the DOM, and can be tested on plain triangle lists. This mirrors
 * the split `compute/radiance/patch.ts` already uses between
 * `buildPatchesFromTriangles` and `buildPatchesFromRoom`.
 */

import { Vector3 } from 'three';
import type Room from '../../objects/room';
import type Surface from '../../objects/surface';
import {
  voxelizeTriangles,
  type VoxelGrid,
  type VoxelTriangle,
  type VoxelizeOptions,
} from './voxelize';

/**
 * World-space triangles of every surface in a room, tagged with the index of
 * the surface they came from.
 *
 * The index is what `surfaceOf` carries through the grid, so Phase 5 can go
 * from a boundary cell back to `surfaces[i].absorptionFunction(freq)` for the
 * octave band being run. The returned `surfaces` array is that lookup table.
 */
export function roomTriangles(room: Room): {
  triangles: VoxelTriangle[];
  surfaces: Surface[];
} {
  const surfaces = room.allSurfaces as Surface[];
  const triangles: VoxelTriangle[] = [];
  const v = new Vector3();

  for (let si = 0; si < surfaces.length; si++) {
    const surface = surfaces[si];
    const geometry = surface.geometry;
    const position = geometry?.getAttribute('position');
    if (!position) continue;

    const array = position.array as ArrayLike<number>;
    // Indexed geometry has to be expanded first. `Surface` builds non-indexed
    // buffers today, but a loader change or a model import that carries an
    // index would otherwise be read as consecutive triples — shared-vertex soup
    // interpreted as independent triangles. The shell comes out full of holes
    // and the result is a real leak that is very hard to attribute back to
    // here. `TessellateModifier` guards the same way for the same reason.
    const index = geometry?.index ?? null;
    const corner = (t: number, c: 0 | 1 | 2): number => {
      const vertex = index ? index.getX(t * 3 + c) : t * 3 + c;
      return vertex * 3;
    };
    const triCount = index
      ? Math.floor(index.count / 3)
      : Math.floor(array.length / 9);

    for (let t = 0; t < triCount; t++) {
      const oa = corner(t, 0);
      const ob = corner(t, 1);
      const oc = corner(t, 2);
      // localToWorld mutates, so each vertex is converted on its own.
      v.set(array[oa], array[oa + 1], array[oa + 2]);
      surface.localToWorld(v);
      const ax = v.x;
      const ay = v.y;
      const az = v.z;

      v.set(array[ob], array[ob + 1], array[ob + 2]);
      surface.localToWorld(v);
      const bx = v.x;
      const by = v.y;
      const bz = v.z;

      v.set(array[oc], array[oc + 1], array[oc + 2]);
      surface.localToWorld(v);

      triangles.push({
        ax,
        ay,
        az,
        bx,
        by,
        bz,
        cx: v.x,
        cy: v.y,
        cz: v.z,
        surfaceIndex: si,
      });
    }
  }

  return { triangles, surfaces };
}

export interface VoxelizeRoomResult {
  grid: VoxelGrid;
  /** Indexed by the values in `grid.surfaceOf`. */
  surfaces: Surface[];
}

/**
 * Voxelize a room into its air region.
 *
 * `seed` should be a point known to be inside — a source position is the
 * natural choice, since a source outside the room is already a user error the
 * solver should report. Without one the vertex centroid is used, which is
 * inside for convex rooms and may not be for others; `grid.leaked` and
 * `grid.warnings` say when that went wrong.
 */
export function voxelizeRoom(
  room: Room,
  options: VoxelizeOptions,
): VoxelizeRoomResult {
  const { triangles, surfaces } = roomTriangles(room);
  if (triangles.length === 0) {
    throw new Error('Room has no surface geometry to voxelize');
  }
  return { grid: voxelizeTriangles(triangles, options), surfaces };
}
