/**
 * Triangulation — the boundary where topology becomes renderable geometry.
 *
 * Faces in a {@link RoomMesh} are polygonal loops, which is what makes shared
 * vertices and later vertex editing possible. Solvers and BufferGeometry both
 * want triangles, so the conversion happens here and nowhere earlier.
 *
 * Ear clipping is used rather than a fan because room floors are routinely
 * concave — an L-shaped room is the common case, not an exotic one, and a fan
 * would emit triangles that spill outside the outline.
 *
 * **Winding contract:** output triangles are wound consistently with the face
 * loop they came from, so their normals agree with `faceNormal`. Since the
 * raytracer reads face normals (raytracer/ray-core.ts), breaking this would
 * silently invert a room's acoustics rather than fail loudly.
 *
 * Pure module — no THREE, no csg. See room-mesh.ts.
 */

import { faceNormal, type Face, type RoomMesh, type Vec3, type VertexId } from './room-mesh';

/** A triangle as three indices into {@link RoomMesh.vertices}. */
export type Triangle = [VertexId, VertexId, VertexId];

interface P2 {
  x: number;
  y: number;
}

const EPS = 1e-10;

function cross3(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function normalize3(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]);
  return len === 0 ? [0, 0, 0] : [v[0] / len, v[1] / len, v[2] / len];
}

/**
 * An orthonormal basis (u, v) spanning the plane with u x v === n.
 *
 * Building a real basis rather than dropping the dominant axis keeps
 * orientation exact: a loop wound CCW around `n` projects to a loop with
 * positive shoelace area in (u, v), with no per-axis sign correction.
 */
function basisFor(n: Vec3): [Vec3, Vec3] {
  const t: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = normalize3(cross3(t, n));
  const v = cross3(n, u);
  return [u, v];
}

/** Twice the signed area; positive when counter-clockwise. */
function doubleSignedArea(pts: P2[]): number {
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum;
}

function sign(p: P2, a: P2, b: P2): number {
  return (a.x - p.x) * (b.y - p.y) - (b.x - p.x) * (a.y - p.y);
}

/** Inside or on the boundary. Conservative on purpose: a point on an edge blocks the ear. */
function pointInTriangle(p: P2, a: P2, b: P2, c: P2): boolean {
  const d1 = sign(p, a, b);
  const d2 = sign(p, b, c);
  const d3 = sign(p, c, a);
  const hasNeg = d1 < -EPS || d2 < -EPS || d3 < -EPS;
  const hasPos = d1 > EPS || d2 > EPS || d3 > EPS;
  return !(hasNeg && hasPos);
}

/**
 * Ear clipping over a counter-clockwise simple polygon.
 *
 * Returns triples of indices into `pts`. The caller guarantees CCW input;
 * see the invariant note in {@link triangulateFace}.
 */
function earClip(pts: P2[]): Triangle[] {
  const n = pts.length;
  if (n < 3) return [];

  const ring = pts.map((_, i) => i);
  const tris: Triangle[] = [];

  // Bounded so malformed input degrades into a usable result instead of hanging.
  let guard = n * n + 16;

  while (ring.length > 3 && guard-- > 0) {
    let clipped = false;
    let fallback = -1;
    let fallbackArea = -Infinity;

    for (let k = 0; k < ring.length; k++) {
      const i0 = ring[(k - 1 + ring.length) % ring.length];
      const i1 = ring[k];
      const i2 = ring[(k + 1) % ring.length];
      const a = pts[i0];
      const b = pts[i1];
      const c = pts[i2];

      const convex = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      if (convex <= EPS) continue; // reflex or collinear: not an ear

      if (convex > fallbackArea) {
        fallbackArea = convex;
        fallback = k;
      }

      let blocked = false;
      for (const m of ring) {
        if (m === i0 || m === i1 || m === i2) continue;
        if (pointInTriangle(pts[m], a, b, c)) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;

      tris.push([i0, i1, i2]);
      ring.splice(k, 1);
      clipped = true;
      break;
    }

    if (!clipped) {
      // No valid ear: the polygon is degenerate or self-touching. Clip the
      // largest convex corner regardless so we terminate with something usable.
      const k = fallback >= 0 ? fallback : 0;
      const i0 = ring[(k - 1 + ring.length) % ring.length];
      const i1 = ring[k];
      const i2 = ring[(k + 1) % ring.length];
      tris.push([i0, i1, i2]);
      ring.splice(k, 1);
    }
  }

  if (ring.length === 3) tris.push([ring[0], ring[1], ring[2]]);
  return tris;
}

/**
 * Triangulate one face into triangles indexed against `mesh.vertices`.
 *
 * Returns an empty array for degenerate faces (fewer than three vertices, or
 * a loop with no well-defined normal) rather than throwing — a half-drawn
 * sketch should render as nothing, not crash the viewport.
 *
 * Non-planar loops are flattened onto the Newell plane, so the result is an
 * approximation for faces that have been hand-edited out of plane.
 */
export function triangulateFace(mesh: RoomMesh, face: Face): Triangle[] {
  const loop = face.loop;
  if (loop.length < 3) return [];

  // Checked before the triangle fast path so a collinear 3-vertex face is
  // rejected too, rather than emitting a zero-area triangle downstream.
  const n = faceNormal(mesh, face);
  if (n[0] === 0 && n[1] === 0 && n[2] === 0) return [];

  if (loop.length === 3) return [[loop[0], loop[1], loop[2]]];

  const [u, v] = basisFor(n);
  const pts: P2[] = loop.map((id) => {
    const p = mesh.vertices[id];
    return {
      x: p[0] * u[0] + p[1] * u[1] + p[2] * u[2],
      y: p[0] * v[0] + p[1] * v[1] + p[2] * v[2],
    };
  });

  // Invariant: `n` is Newell's normal of this very loop and u x v === n, so the
  // projection is CCW by construction and its area cannot come out negative.
  // Bail rather than emit inverted triangles if that ever stops holding.
  if (doubleSignedArea(pts) < 0) return [];

  return earClip(pts).map(([a, b, c]): Triangle => [loop[a], loop[b], loop[c]]);
}

/**
 * Triangulate a face into a flat [x,y,z, x,y,z, ...] position list, the form
 * BufferGeometry wants. Three vertices per triangle, no index buffer.
 */
export function triangulatedPositions(mesh: RoomMesh, face: Face): number[] {
  const out: number[] = [];
  for (const tri of triangulateFace(mesh, face)) {
    for (const id of tri) {
      const p = mesh.vertices[id];
      out.push(p[0], p[1], p[2]);
    }
  }
  return out;
}

/** Triangulate every face, keyed by the face's stable id. */
export function triangulateMesh(mesh: RoomMesh): Map<string, Triangle[]> {
  return new Map(mesh.faces.map((f) => [f.id, triangulateFace(mesh, f)]));
}
