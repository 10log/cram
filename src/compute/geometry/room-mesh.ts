/**
 * RoomMesh — the editable topology that backs room geometry.
 *
 * This is the source of truth for a room's shape. It is deliberately *not*
 * a triangle soup: vertices are shared and index-addressed, and faces are
 * polygonal loops referencing those indices. Triangulation happens later,
 * at the boundary where BufferGeometry is built.
 *
 * That distinction is what makes direct vertex manipulation possible: a room
 * corner is one vertex shared by three faces, so moving it moves every face
 * that touches it. Flatten to triangles early and that corner becomes six
 * unrelated copies.
 *
 * Coordinate system: CRAM is Z-up (see `camera.up.set(0, 0, 1)` in
 * render/renderer.ts). The ground plane is XY and height runs along +Z.
 *
 * This module is pure — no THREE, no csg, no store. Keep it that way; it is
 * the only part of the geometry pipeline that can be tested without mocks.
 */

import type { FloorplanParams } from './floorplan';
import { floorplanToMesh } from './floorplan';

/** A point in 3D space as [x, y, z]. */
export type Vec3 = [number, number, number];

/** Index into {@link RoomMesh.vertices}. */
export type VertexId = number;

/**
 * Stable identifier for a face. Ids survive regeneration, which is what lets
 * an acoustic material assignment outlive an edit — the adapter matches
 * Surfaces to faces by this id rather than rebuilding them.
 *
 * Note that stability is positional, not semantic: adding a point to a
 * floorplan can change which physical wall `wall-2` refers to.
 */
export type FaceId = string;

/** A single planar face, wound counter-clockwise as seen from inside the room. */
export interface Face {
  id: FaceId;
  name: string;
  /** Vertex indices in CCW order viewed from the face's inward side. */
  loop: VertexId[];
}

/**
 * Where a mesh came from, so parametric and manual editing can coexist.
 *
 * A floorplan-sourced mesh can be regenerated from its params until someone
 * moves a vertex by hand; that flips `detached`, and the params are kept as
 * reference rather than discarded.
 */
export type MeshSource =
  | { kind: 'floorplan'; params: FloorplanParams; detached: boolean }
  | { kind: 'manual' };

export interface RoomMesh {
  /** Shared, index-addressed. Faces reference these by position. */
  vertices: Vec3[];
  faces: Face[];
  source: MeshSource;
}

/**
 * An edit to a mesh, expressed as data.
 *
 * Only `set-floorplan` is driven by UI today; `move-vertex` is implemented
 * because it is what proves the topology actually supports 3D editing, and
 * because it gives the eventual vertex gizmo something to call.
 */
export type MeshEdit =
  | { kind: 'set-floorplan'; params: FloorplanParams }
  | { kind: 'move-vertex'; id: VertexId; to: Vec3 };

/** Marks a floorplan-sourced mesh as hand-edited, keeping the params for reference. */
function detach(source: MeshSource): MeshSource {
  return source.kind === 'floorplan' ? { ...source, detached: true } : source;
}

/**
 * Apply an edit, returning a new mesh. Never mutates the input.
 */
export function applyEdit(mesh: RoomMesh, edit: MeshEdit): RoomMesh {
  switch (edit.kind) {
    case 'set-floorplan':
      return floorplanToMesh(edit.params);

    case 'move-vertex': {
      if (!Number.isInteger(edit.id) || edit.id < 0 || edit.id >= mesh.vertices.length) {
        throw new RangeError(
          `move-vertex: no vertex ${edit.id} (mesh has ${mesh.vertices.length})`
        );
      }
      // A non-finite destination would poison every face touching this vertex
      // and only surface much later, as NaN vertices in a BufferGeometry.
      if (!edit.to || edit.to.length !== 3 || !edit.to.every((n) => Number.isFinite(n))) {
        throw new TypeError(`move-vertex: destination must be three finite numbers`);
      }
      const vertices = mesh.vertices.map(
        (v, i): Vec3 => (i === edit.id ? [edit.to[0], edit.to[1], edit.to[2]] : v)
      );
      return { ...mesh, vertices, source: detach(mesh.source) };
    }
  }
}

/** Resolve a face's loop to actual positions. */
export function faceVertices(mesh: RoomMesh, face: Face): Vec3[] {
  return face.loop.map((id) => mesh.vertices[id]);
}

/**
 * Unit normal via Newell's method, which handles non-planar and concave loops
 * gracefully. Follows the right-hand rule, so a CCW loop yields a normal
 * pointing back at the viewer — i.e. into the room, given our winding rule.
 */
export function faceNormal(mesh: RoomMesh, face: Face): Vec3 {
  const pts = faceVertices(mesh, face);
  let nx = 0;
  let ny = 0;
  let nz = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    nx += (a[1] - b[1]) * (a[2] + b[2]);
    ny += (a[2] - b[2]) * (a[0] + b[0]);
    nz += (a[0] - b[0]) * (a[1] + b[1]);
  }
  const len = Math.hypot(nx, ny, nz);
  if (len === 0) return [0, 0, 0];
  return [nx / len, ny / len, nz / len];
}

/** Average of a face's vertices. */
export function faceCentroid(mesh: RoomMesh, face: Face): Vec3 {
  const pts = faceVertices(mesh, face);
  const sum = pts.reduce(
    (acc, p): Vec3 => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
    [0, 0, 0] as Vec3
  );
  return [sum[0] / pts.length, sum[1] / pts.length, sum[2] / pts.length];
}

/**
 * The floorplan a mesh was generated from, if it still has one.
 *
 * Defensive about shape because a mesh revived from a save file is unvalidated
 * JSON: `isRoomMesh` checks vertices and faces, not provenance, so `source`
 * may be missing or malformed on an old or hand-edited project.
 *
 * @returns null when the mesh was not generated from a floorplan.
 */
export function floorplanSource(
  mesh: RoomMesh
): { params: FloorplanParams; detached: boolean } | null {
  const source = mesh.source as Partial<Extract<MeshSource, { kind: 'floorplan' }>> | undefined;
  if (!source || source.kind !== 'floorplan') return null;

  const params = source.params;
  if (!params || !Array.isArray(params.points)) return null;

  // `typeof NaN === 'number'`, so a shape-only check lets NaN through, and
  // unchecked entries let `points: [null]` through. Either reaches
  // draftFromPoints, which dereferences `p.x` and takes the panel down —
  // the opposite of leaving the room quietly non-editable.
  if (!Number.isFinite(params.height)) return null;
  if (params.baseZ !== undefined && !Number.isFinite(params.baseZ)) return null;
  if (!params.points.every((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y))) return null;

  return { params, detached: source.detached === true };
}

/** Look up a face by its stable id. */
export function findFace(mesh: RoomMesh, id: FaceId): Face | undefined {
  return mesh.faces.find((f) => f.id === id);
}

/**
 * Every face index that references a given vertex. The eventual vertex gizmo
 * needs this to know what to redraw; tests use it to prove welding worked.
 */
export function facesTouchingVertex(mesh: RoomMesh, id: VertexId): Face[] {
  return mesh.faces.filter((f) => f.loop.includes(id));
}
