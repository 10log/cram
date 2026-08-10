/**
 * Floorplan — a parametric generator for {@link RoomMesh}.
 *
 * Takes a closed 2D outline on the ground plane plus a height, and extrudes it
 * into a sealed room: one face per wall, plus a floor and a ceiling.
 *
 * Two things here are load-bearing and easy to get subtly wrong:
 *
 * 1. **Welding.** An n-point outline emits exactly 2n vertices — n at floor
 *    level, n at ceiling level — reused across walls, floor and ceiling.
 *    If every wall got its own four corners, dragging a corner later would
 *    tear the room open.
 *
 * 2. **Winding.** The raytracer reads `face.normal` (see raytracer/ray-core.ts,
 *    which takes `angleTo(face.normal)`), so orientation is physically
 *    meaningful and gets it *silently* wrong rather than loudly. Every loop
 *    emitted here is CCW as seen from inside the room, so normals point in.
 *
 * Coordinate system: CRAM is Z-up. Outline points are XY; height runs along +Z.
 *
 * Pure module — no THREE, no csg. See room-mesh.ts.
 */

import type { Face, RoomMesh, Vec3 } from './room-mesh';

/** A point on the ground plane. */
export interface Point2 {
  x: number;
  y: number;
}

export interface FloorplanParams {
  /** Outline vertices in order. The loop is implicit — do not repeat the first point. */
  points: Point2[];
  /** Extrusion height along +Z. Must be positive. */
  height: number;
  /** Floor elevation. Defaults to 0. */
  baseZ?: number;
}

export type FloorplanIssue =
  | { code: 'too-few-points'; message: string }
  | { code: 'invalid-height'; message: string }
  | { code: 'duplicate-point'; message: string; index: number }
  | { code: 'zero-area'; message: string }
  | { code: 'self-intersecting'; message: string; edges: [number, number] };

const EPS = 1e-9;

/**
 * Shoelace area. Positive when the outline is counter-clockwise in XY.
 */
export function signedArea(points: Point2[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

/**
 * Force counter-clockwise winding, keeping `points[0]` in place.
 *
 * Reversing the tail rather than the whole array means vertex 0 keeps its
 * identity, so face ids stay pinned to the same physical corners whichever
 * direction the user happened to draw in.
 */
export function normalizeWinding(points: Point2[]): Point2[] {
  if (signedArea(points) >= 0) return points.slice();
  return [points[0], ...points.slice(1).reverse()];
}

/** Cross product sign of (b-a) x (c-a); 0 when collinear. */
function orient(a: Point2, b: Point2, c: Point2): number {
  const v = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  if (Math.abs(v) < EPS) return 0;
  return v > 0 ? 1 : -1;
}

/** Whether collinear point `p` lies within segment `a`-`b`. */
function onSegment(a: Point2, b: Point2, p: Point2): boolean {
  return (
    Math.min(a.x, b.x) - EPS <= p.x &&
    p.x <= Math.max(a.x, b.x) + EPS &&
    Math.min(a.y, b.y) - EPS <= p.y &&
    p.y <= Math.max(a.y, b.y) + EPS
  );
}

/**
 * Segment intersection including touching and collinear overlap. Non-adjacent
 * outline edges that merely touch still make the polygon non-simple, so the
 * degenerate cases matter here.
 */
function segmentsIntersect(p1: Point2, p2: Point2, p3: Point2, p4: Point2): boolean {
  const d1 = orient(p3, p4, p1);
  const d2 = orient(p3, p4, p2);
  const d3 = orient(p1, p2, p3);
  const d4 = orient(p1, p2, p4);

  if (d1 !== d2 && d3 !== d4) return true;

  if (d1 === 0 && onSegment(p3, p4, p1)) return true;
  if (d2 === 0 && onSegment(p3, p4, p2)) return true;
  if (d3 === 0 && onSegment(p1, p2, p3)) return true;
  if (d4 === 0 && onSegment(p1, p2, p4)) return true;

  return false;
}

/**
 * Collect every reason this floorplan cannot be extruded.
 *
 * Returns all issues rather than throwing on the first, so the sketch UI can
 * show the user everything that is wrong at once.
 */
export function validateFloorplan(params: FloorplanParams): FloorplanIssue[] {
  const issues: FloorplanIssue[] = [];
  const { points } = params;

  if (points.length < 3) {
    issues.push({
      code: 'too-few-points',
      message: `a room outline needs at least 3 points, got ${points.length}`,
    });
  }

  if (!(params.height > 0) || !Number.isFinite(params.height)) {
    issues.push({
      code: 'invalid-height',
      message: `height must be a positive number, got ${params.height}`,
    });
  }

  // Consecutive duplicates, including last-equals-first: the loop is implicit,
  // so repeating the opening point is a common and confusing mistake.
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    if (Math.abs(a.x - b.x) < EPS && Math.abs(a.y - b.y) < EPS) {
      const wrapped = i === points.length - 1;
      issues.push({
        code: 'duplicate-point',
        index: i,
        message: wrapped
          ? 'the outline closes automatically — remove the repeated first point at the end'
          : `points ${i} and ${i + 1} are in the same place`,
      });
    }
  }

  if (issues.length > 0) return issues;

  // Self-intersection is checked before area because a symmetric bowtie's lobes
  // cancel to zero signed area — reporting "encloses no area" there would be
  // technically true and completely unhelpful. "Walls cross" is the fixable one.
  //
  // Non-adjacent edge pairs only; neighbours legitimately share an endpoint.
  const n = points.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const adjacent = j === i + 1 || (i === 0 && j === n - 1);
      if (adjacent) continue;
      if (segmentsIntersect(points[i], points[(i + 1) % n], points[j], points[(j + 1) % n])) {
        issues.push({
          code: 'self-intersecting',
          edges: [i, j],
          message: `walls ${i + 1} and ${j + 1} cross each other`,
        });
      }
    }
  }

  if (issues.length > 0) return issues;

  if (Math.abs(signedArea(points)) < EPS) {
    issues.push({
      code: 'zero-area',
      message: 'the outline encloses no area (all points are collinear)',
    });
  }

  return issues;
}

/**
 * Extrude a validated outline into a sealed room.
 *
 * Vertex layout: indices `0..n-1` are the floor ring, `n..2n-1` the ceiling
 * ring, so ceiling vertex for outline point `i` is always `n + i`.
 *
 * @throws if the plan does not pass {@link validateFloorplan}.
 */
export function floorplanToMesh(params: FloorplanParams): RoomMesh {
  const issues = validateFloorplan(params);
  if (issues.length > 0) {
    throw new Error(`invalid floorplan: ${issues.map((i) => i.message).join('; ')}`);
  }

  const baseZ = params.baseZ ?? 0;
  const topZ = baseZ + params.height;
  const points = normalizeWinding(params.points);
  const n = points.length;

  const vertices: Vec3[] = [];
  for (const p of points) vertices.push([p.x, p.y, baseZ]);
  for (const p of points) vertices.push([p.x, p.y, topZ]);

  const floorRing = points.map((_, i) => i);

  const faces: Face[] = [
    // CCW in XY viewed from above gives +Z: up, into the room.
    { id: 'floor', name: 'Floor', loop: floorRing },
    // Reversed gives -Z: down, into the room.
    { id: 'ceiling', name: 'Ceiling', loop: floorRing.map((i) => n + i).reverse() },
  ];

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    faces.push({
      id: `wall-${i}`,
      name: `Wall ${i + 1}`,
      // floor i -> ceiling i -> ceiling j -> floor j, which for a CCW outline
      // puts the normal at (-dy, dx): the interior side of the wall.
      loop: [i, n + i, n + j, j],
    });
  }

  return {
    vertices,
    faces,
    source: {
      kind: 'floorplan',
      params: { points, height: params.height, baseZ },
      detached: false,
    },
  };
}
