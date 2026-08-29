/**
 * Adapter — turns an editable {@link RoomMesh} into CRAM's Room/Surface objects.
 *
 * This is the seam between the pure geometry layer and the rest of the app.
 * Everything downstream (solvers, BVH, materials, the object tree, save files)
 * consumes `Room { Surface[] }`, so this is the only file the editor needs in
 * order to hand its work to the existing machinery.
 *
 * Deliberately thin: the decisions live in compute/geometry (triangulation and
 * sync planning, both testable without mocks). What is left here is object
 * construction and wiring.
 *
 * One face becomes one Surface, so acoustic materials can be assigned per wall
 * — which is the entire point of the exercise for a room acoustics tool, and
 * something a single extruded mesh could not support.
 */

import * as THREE from 'three';

import Surface from './surface';
import Room from './room';
import type Container from './container';
import { emit } from '../messenger';
import type { AcousticMaterial } from '../db/acoustic-material';
import { triangulatedPositions } from '../compute/geometry/triangulate';
import { planFaceSync, type FaceSyncPlan } from '../compute/geometry/sync-plan';
import { findFace, type Face, type FaceId, type RoomMesh } from '../compute/geometry/room-mesh';
import { getFaceId, setFaceId, setRoomMesh } from './mesh-userdata';

// The keys and accessors live in mesh-userdata.ts so room.ts and surface.ts can
// use them for save/restore without importing this module and closing a cycle.
export {
  FACE_ID_KEY,
  ROOM_MESH_KEY,
  getFaceId,
  getRoomMesh,
  setRoomMesh,
} from './mesh-userdata';

export interface RoomFromMeshOptions {
  /** Material applied to faces that do not already have one. */
  acousticMaterial: AcousticMaterial;
  name?: string;
}

/**
 * Build a non-indexed BufferGeometry for one face.
 *
 * Triangle winding comes from the geometry layer and is what gives three.js
 * the face normals the raytracer later reads, so nothing here may reorder
 * vertices.
 */
export function geometryForFace(mesh: RoomMesh, face: Face): THREE.BufferGeometry {
  const positions = triangulatedPositions(mesh, face);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.computeVertexNormals();
  geometry.name = `face-${face.id}`;
  return geometry;
}

/** Create a Surface for a single face, tagged with that face's id. */
export function surfaceForFace(
  mesh: RoomMesh,
  face: Face,
  acousticMaterial: AcousticMaterial
): Surface {
  const surface = new Surface(face.name, {
    geometry: geometryForFace(mesh, face),
    acousticMaterial,
  });
  setFaceId(surface, face.id);
  return surface;
}

/**
 * Build a fresh Room from a mesh. Every face gets the same starting material;
 * per-wall assignment is the user's job afterwards, and {@link syncRoomFromMesh}
 * is what keeps those assignments alive across later edits.
 */
export function roomFromMesh(mesh: RoomMesh, options: RoomFromMeshOptions): Room {
  const surfaces = mesh.faces.map((face) =>
    surfaceForFace(mesh, face, options.acousticMaterial)
  );
  const room = new Room(options.name ?? 'new room', { surfaces });
  setRoomMesh(room, mesh);
  return room;
}

/** Build a Room and register it with the app. */
export function addRoomFromMesh(mesh: RoomMesh, options: RoomFromMeshOptions): Room {
  const room = roomFromMesh(mesh, options);
  emit('ADD_ROOM', room);
  return room;
}

/**
 * Reconcile an existing Room against an edited mesh.
 *
 * Faces that already have a Surface are updated *in place* via `Surface.init`,
 * which preserves the Surface's uuid and — critically — its acoustic material.
 * Rebuilding instead would wipe the user's assignments on every height tweak.
 *
 * `init` merges over module defaults, so the current material has to be passed
 * back in explicitly or it would be reset.
 */
export function syncRoomFromMesh(
  room: Room,
  mesh: RoomMesh,
  options: RoomFromMeshOptions
): FaceSyncPlan {
  const byFaceId = new Map<FaceId, Surface>();
  for (const surface of room.allSurfaces) {
    const id = getFaceId(surface);
    if (id !== undefined && !byFaceId.has(id)) byFaceId.set(id, surface);
  }

  const plan = planFaceSync(
    byFaceId.keys(),
    mesh.faces.map((f) => f.id)
  );

  // Every geometry is built before anything is mutated. A face that
  // triangulates to nothing — a vertex dragged until its face is degenerate —
  // leaves Surface.init dereferencing `_triangles[0]`, and failing halfway
  // through would leave the room in a half-reconciled state.
  const geometries = new Map<FaceId, THREE.BufferGeometry>();
  for (const face of mesh.faces) {
    const geometry = geometryForFace(mesh, face);
    if ((geometry.getAttribute('position')?.count ?? 0) === 0) {
      geometries.forEach((g) => g.dispose());
      geometry.dispose();
      throw new Error(`face "${face.id}" produced no triangles — the outline is degenerate`);
    }
    geometries.set(face.id, geometry);
  }

  for (const id of plan.updated) {
    const surface = byFaceId.get(id)!;
    surface.init({
      geometry: geometries.get(id)!,
      acousticMaterial: surface.acousticMaterial,
    });
    setFaceId(surface, id);
  }

  for (const id of plan.added) {
    const face = findFace(mesh, id)!;
    const surface = new Surface(face.name, {
      geometry: geometries.get(id)!,
      acousticMaterial: options.acousticMaterial,
    });
    setFaceId(surface, id);
    room.surfaces.add(surface);
    emit('ADD_SURFACE', surface);
  }

  for (const id of plan.removed) {
    const surface = byFaceId.get(id)!;
    surface.dispose();
    emit('REMOVE_SURFACE', surface.uuid);
  }

  // Keep the Room's record current, so the next diff is against what is
  // actually on screen. This is also what lets undo/redo be a plain re-sync.
  setRoomMesh(room, mesh);

  // Room caches surfaceMap, boundingBox and volume at init time. Reconciling
  // surfaces behind its back leaves all three stale — surfaceMap fatally so,
  // since the raytracer indexes it for every hit.
  room.refreshDerivedGeometry();

  return plan;
}
