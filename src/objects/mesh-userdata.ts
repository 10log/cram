/**
 * The link between CRAM objects and the editable geometry they came from.
 *
 * A Room remembers the {@link RoomMesh} it was generated from, and each Surface
 * remembers which face of that mesh it represents. Both ride in `userData`, and
 * both are persisted so a reloaded project stays editable.
 *
 * This lives in its own module, holding only key constants and accessors,
 * because room.ts and surface.ts need it for save/restore while
 * room-from-mesh.ts imports *them*. Putting the keys there instead would close
 * an import cycle — the kind that already produced TDZ failures in this
 * codebase (see the notes in compute/csg).
 */

import type { FaceId, RoomMesh } from '../compute/geometry/room-mesh';

/** Key under which a Surface records its mesh face. */
export const FACE_ID_KEY = 'cramFaceId';

/** Key under which a Room records the mesh it was generated from. */
export const ROOM_MESH_KEY = 'cramRoomMesh';

/** Structural minimum, so these helpers do not depend on Container or THREE. */
interface HasUserData {
  userData?: Record<string, unknown>;
}

/** The face id a Surface was built for, if it has one. */
export function getFaceId(object: HasUserData): FaceId | undefined {
  const value = object.userData?.[FACE_ID_KEY];
  return typeof value === 'string' ? value : undefined;
}

export function setFaceId(object: HasUserData, id: FaceId): void {
  if (!object.userData) object.userData = {};
  object.userData[FACE_ID_KEY] = id;
}

/**
 * The mesh a Room was generated from, if it came from the sketch editor.
 *
 * Rooms imported from OBJ/DXF have none, which is what makes them
 * non-editable rather than editable-but-broken.
 */
export function getRoomMesh(object: HasUserData): RoomMesh | undefined {
  return object.userData?.[ROOM_MESH_KEY] as RoomMesh | undefined;
}

export function setRoomMesh(object: HasUserData, mesh: RoomMesh): void {
  if (!object.userData) object.userData = {};
  object.userData[ROOM_MESH_KEY] = mesh;
}

/**
 * Whether a parsed value is structurally a RoomMesh.
 *
 * Save files are user-supplied data and can be old, hand-edited or truncated.
 * A malformed mesh should leave the room merely non-editable, not crash the
 * restore and take the whole project down with it.
 */
export function isRoomMesh(value: unknown): value is RoomMesh {
  if (!value || typeof value !== 'object') return false;
  const mesh = value as Partial<RoomMesh>;
  if (!Array.isArray(mesh.vertices) || !Array.isArray(mesh.faces)) return false;

  // Vertex components must actually be numbers. A stringified or NaN component
  // survives a shape-only check and reaches BufferGeometry intact.
  const vertexCount = mesh.vertices.length;
  const verticesOk = mesh.vertices.every(
    (v) => Array.isArray(v) && v.length === 3 && v.every((n) => Number.isFinite(n))
  );
  if (!verticesOk) return false;

  // Loop entries must be integer indices that exist, and a face needs at least
  // three of them. Anything else makes triangulation and undo dereference
  // undefined — the crash this validator exists to prevent.
  return mesh.faces.every(
    (f) =>
      !!f &&
      typeof f.id === 'string' &&
      Array.isArray(f.loop) &&
      f.loop.length >= 3 &&
      f.loop.every((i) => Number.isInteger(i) && i >= 0 && i < vertexCount)
  );
}
