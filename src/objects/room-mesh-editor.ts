/**
 * Mesh editing with undo/redo.
 *
 * Applies a {@link MeshEdit} to a Room's mesh, reconciles the Surfaces, and
 * records a Moment so the change can be undone.
 *
 * Undo and redo are deliberately not special-cased per operation: both are just
 * "re-sync the Room against a remembered mesh". `syncRoomFromMesh` already
 * diffs by stable face id, so restoring an earlier mesh recreates walls that an
 * edit removed and disposes ones it added, with materials preserved throughout.
 * That falls out of the step-3 reconciler rather than needing inverse ops.
 *
 * There is no 3D editing UI yet. `move-vertex` is wired here because it is what
 * proves the topology supports direct manipulation — the eventual gizmo should
 * only need to call {@link moveVertex}.
 */

import type Room from './room';
import { addMoment, type Directions } from '../history';
import { emit } from '../messenger';
import {
  getRoomMesh,
  syncRoomFromMesh,
  type RoomFromMeshOptions,
} from './room-from-mesh';
import { applyEdit, type MeshEdit, type RoomMesh, type Vec3, type VertexId } from '../compute/geometry/room-mesh';
import type { FloorplanParams } from '../compute/geometry/floorplan';

/** Moment categories, one per edit kind, so history is legible when debugging. */
const CATEGORY: Record<MeshEdit['kind'], string> = {
  'set-floorplan': 'ROOM_MESH_SET_FLOORPLAN',
  'move-vertex': 'ROOM_MESH_MOVE_VERTEX',
};

/**
 * Apply an edit to a Room's mesh and record it in history.
 *
 * @returns the mesh the Room now holds.
 * @throws if the Room has no mesh (it was imported rather than sketched), or if
 *         the edit itself is invalid — an invalid floorplan must not be
 *         half-applied, so validation failure propagates before anything
 *         touches the Room.
 */
export function commitMeshEdit(
  room: Room,
  edit: MeshEdit,
  options: RoomFromMeshOptions
): RoomMesh {
  const before = getRoomMesh(room);
  if (!before) {
    throw new Error(
      `room "${room.name}" has no editable mesh — only rooms created from a floorplan can be edited`
    );
  }

  // Computed before any mutation, so a rejected edit leaves the Room untouched.
  const after = applyEdit(before, edit);

  syncRoomFromMesh(room, after, options);

  // A geometry-only edit changes no containers, so nothing downstream marks the
  // project dirty and the unsaved-changes prompt would not appear. Topology
  // changes happen to emit it via add/removeContainer; this covers the rest.
  emit('MARK_DIRTY', undefined);

  addMoment({
    category: CATEGORY[edit.kind],
    objectId: room.uuid,
    recallFunction: (direction?: keyof Directions) => {
      syncRoomFromMesh(room, direction === 'UNDO' ? before : after, options);
      emit('MARK_DIRTY', undefined);
    },
  });

  return after;
}

/** Replace the room's outline and/or height. */
export function setFloorplan(
  room: Room,
  params: FloorplanParams,
  options: RoomFromMeshOptions
): RoomMesh {
  return commitMeshEdit(room, { kind: 'set-floorplan', params }, options);
}

/**
 * Move a single vertex. Every face sharing it follows, because the mesh stores
 * shared vertices rather than per-face copies.
 */
export function moveVertex(
  room: Room,
  id: VertexId,
  to: Vec3,
  options: RoomFromMeshOptions
): RoomMesh {
  return commitMeshEdit(room, { kind: 'move-vertex', id, to }, options);
}

/** Whether this Room came from the sketch editor and can accept mesh edits. */
export function isEditable(room: Room): boolean {
  return getRoomMesh(room) !== undefined;
}
