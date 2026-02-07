/**
 * Edge graph construction: identifies convex edges shared between surfaces.
 *
 * Walks each Surface's edgeLoop, hashes vertex positions for O(1) matching,
 * then keeps only edges shared by two surfaces with exterior angle > pi.
 */

import { numbersEqualWithinTolerence } from "../../../common/equal-within-range";
import type { EdgeGraph, DiffractingEdge } from "./types";

/** Spatial hash key for a 3D point at the given tolerance */
function hashPoint(x: number, y: number, z: number, cellSize: number): string {
  const ix = Math.round(x / cellSize);
  const iy = Math.round(y / cellSize);
  const iz = Math.round(z / cellSize);
  return `${ix},${iy},${iz}`;
}

/** Canonical key for an edge (order-independent) */
function edgeKey(h1: string, h2: string): string {
  return h1 < h2 ? `${h1}|${h2}` : `${h2}|${h1}`;
}

interface RawEdge {
  start: [number, number, number];
  end: [number, number, number];
  surfaceId: string;
  normal: [number, number, number];
}

interface SurfaceLike {
  uuid: string;
  edgeLoop: { x: number; y: number; z: number }[];
  normal: { x: number; y: number; z: number };
}

/**
 * Build the edge graph from room surfaces.
 *
 * @param surfaces - Array of surfaces with edgeLoop and normal properties
 * @param tolerance - Vertex matching tolerance in world units
 * @returns EdgeGraph containing only convex diffracting edges
 */
export function buildEdgeGraph(surfaces: SurfaceLike[], tolerance: number = 1e-4): EdgeGraph {
  const equal = numbersEqualWithinTolerence(tolerance);
  const cellSize = tolerance * 10; // hash cell larger than tolerance for neighbor lookup

  // Collect all boundary edges from all surfaces
  const edgeMap = new Map<string, RawEdge[]>();

  for (const surface of surfaces) {
    const loop = surface.edgeLoop;
    if (!loop || loop.length < 3) continue;

    const normal: [number, number, number] = [surface.normal.x, surface.normal.y, surface.normal.z];

    for (let i = 0; i < loop.length; i++) {
      const a = loop[i];
      const b = loop[(i + 1) % loop.length];

      const start: [number, number, number] = [a.x, a.y, a.z];
      const end: [number, number, number] = [b.x, b.y, b.z];

      const h1 = hashPoint(a.x, a.y, a.z, cellSize);
      const h2 = hashPoint(b.x, b.y, b.z, cellSize);
      const key = edgeKey(h1, h2);

      const raw: RawEdge = { start, end, surfaceId: surface.uuid, normal };

      if (!edgeMap.has(key)) {
        edgeMap.set(key, [raw]);
      } else {
        edgeMap.get(key)!.push(raw);
      }
    }
  }

  // Find shared edges and compute wedge angles
  const edges: DiffractingEdge[] = [];

  for (const [, rawEdges] of edgeMap) {
    if (rawEdges.length !== 2) continue; // only shared edges between exactly 2 surfaces
    if (rawEdges[0].surfaceId === rawEdges[1].surfaceId) continue; // skip self-edges

    const e0 = rawEdges[0];
    const e1 = rawEdges[1];

    // Verify endpoints actually match within tolerance (hash collisions possible)
    const match =
      (equal(e0.start[0], e1.start[0]) && equal(e0.start[1], e1.start[1]) && equal(e0.start[2], e1.start[2])
        && equal(e0.end[0], e1.end[0]) && equal(e0.end[1], e1.end[1]) && equal(e0.end[2], e1.end[2]))
      ||
      (equal(e0.start[0], e1.end[0]) && equal(e0.start[1], e1.end[1]) && equal(e0.start[2], e1.end[2])
        && equal(e0.end[0], e1.start[0]) && equal(e0.end[1], e1.start[1]) && equal(e0.end[2], e1.start[2]));

    if (!match) continue;

    // Compute edge direction and length
    const dx = e0.end[0] - e0.start[0];
    const dy = e0.end[1] - e0.start[1];
    const dz = e0.end[2] - e0.start[2];
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (length < tolerance) continue;

    const direction: [number, number, number] = [dx / length, dy / length, dz / length];

    // Compute exterior wedge angle from surface normals
    // Interior angle between normals: cos(interior) = n0 . n1
    const n0 = e0.normal;
    const n1 = e1.normal;
    const dot = n0[0] * n1[0] + n0[1] * n1[1] + n0[2] * n1[2];
    const interiorAngle = Math.acos(Math.max(-1, Math.min(1, dot)));
    const wedgeAngle = 2 * Math.PI - interiorAngle;
    const n = wedgeAngle / Math.PI;

    // Only keep convex edges (exterior angle > pi, i.e. n > 1)
    if (n <= 1) continue;

    edges.push({
      start: e0.start,
      end: e0.end,
      direction,
      length,
      normal0: n0,
      normal1: n1,
      surface0Id: e0.surfaceId,
      surface1Id: e1.surfaceId,
      wedgeAngle,
      n,
    });
  }

  return { edges };
}
