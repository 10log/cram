/**
 * Edge graph construction: identifies convex edges shared between surfaces.
 *
 * Walks each Surface's edgeLoop, hashes vertex positions for O(1) matching,
 * then keeps only edges shared by two surfaces with exterior angle > pi.
 */

import { numbersEqualWithinTolerence } from "../../../common/equal-within-range";
import type { EdgeGraph, DiffractingEdge } from "./types";

/** All spatial hash keys for a 3D point, including neighbor cells to handle boundary cases */
function hashPointKeys(x: number, y: number, z: number, cellSize: number): string[] {
  const fx = x / cellSize;
  const fy = y / cellSize;
  const fz = z / cellSize;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const iz = Math.floor(fz);
  // Primary key is always floor-based
  const keys = [`${ix},${iy},${iz}`];
  // Check if point is near a cell boundary (within 0.5 tolerance/cellSize fraction)
  // and add neighbor keys to avoid missing matches
  const offsets = [0, -1, 1];
  for (const ox of offsets) {
    for (const oy of offsets) {
      for (const oz of offsets) {
        if (ox === 0 && oy === 0 && oz === 0) continue;
        const nx = ix + ox;
        const ny = iy + oy;
        const nz = iz + oz;
        // Only add neighbor if point is within half a cell of that boundary
        if (Math.abs(fx - (nx + 0.5)) < 1.0 &&
            Math.abs(fy - (ny + 0.5)) < 1.0 &&
            Math.abs(fz - (nz + 0.5)) < 1.0) {
          keys.push(`${nx},${ny},${nz}`);
        }
      }
    }
  }
  return keys;
}

/** Primary spatial hash key for a 3D point */
function hashPointPrimary(x: number, y: number, z: number, cellSize: number): string {
  const ix = Math.floor(x / cellSize);
  const iy = Math.floor(y / cellSize);
  const iz = Math.floor(z / cellSize);
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

      const raw: RawEdge = { start, end, surfaceId: surface.uuid, normal };

      // Insert into all hash key combinations to ensure neighbor-cell matching
      const keys1 = hashPointKeys(a.x, a.y, a.z, cellSize);
      const keys2 = hashPointKeys(b.x, b.y, b.z, cellSize);
      const insertedKeys = new Set<string>();
      for (const k1 of keys1) {
        for (const k2 of keys2) {
          const key = edgeKey(k1, k2);
          if (insertedKeys.has(key)) continue;
          insertedKeys.add(key);
          if (!edgeMap.has(key)) {
            edgeMap.set(key, [raw]);
          } else {
            edgeMap.get(key)!.push(raw);
          }
        }
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

    // Reject near-coplanar surfaces (interiorAngle ≈ 0 means normals point
    // the same direction, which would give wedgeAngle ≈ 2π — a false positive)
    const COPLANAR_THRESHOLD = 0.01; // ~0.57 degrees
    if (interiorAngle < COPLANAR_THRESHOLD) continue;

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
