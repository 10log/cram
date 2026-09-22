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
    const position = surface.geometry?.getAttribute('position');
    if (!position) continue;

    const array = position.array as ArrayLike<number>;
    const triCount = Math.floor(array.length / 9);

    for (let t = 0; t < triCount; t++) {
      const o = t * 9;
      // localToWorld mutates, so each vertex is converted on its own.
      v.set(array[o], array[o + 1], array[o + 2]);
      surface.localToWorld(v);
      const ax = v.x;
      const ay = v.y;
      const az = v.z;

      v.set(array[o + 3], array[o + 4], array[o + 5]);
      surface.localToWorld(v);
      const bx = v.x;
      const by = v.y;
      const bz = v.z;

      v.set(array[o + 6], array[o + 7], array[o + 8]);
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
