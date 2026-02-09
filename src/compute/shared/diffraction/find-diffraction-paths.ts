/**
 * Diffraction path enumeration: finds valid source→edge→receiver paths.
 *
 * For each (source, edge, receiver) triple, finds the Fermat-principle
 * diffraction point on the edge, checks line-of-sight on both legs,
 * and computes UTD diffraction coefficients per frequency band.
 */

import * as THREE from "three";
import * as ac from "../../acoustics";
import { utdDiffractionCoefficient, computeWedgeAngles } from "./utd-coefficient";
import type { DiffractingEdge, DiffractionPath, EdgeGraph } from "./types";

/**
 * Find the diffraction point on an edge segment using Fermat's principle.
 *
 * The point that minimizes total path length source→point→receiver lies
 * where the projection onto the edge balances the angular requirement.
 * For a finite-length edge, this is solved by minimizing
 * |S - P(t)| + |P(t) - R| where P(t) = start + t*(end-start), t ∈ [0,1].
 *
 * Uses analytical projection: the minimum of f(t) = |S-P(t)| + |P(t)-R|
 * can be found by binary search or by the "unfolding" approach.
 * Here we use a simple iterative bisection for robustness.
 *
 * @param edgeStart - Start of edge segment
 * @param edgeEnd - End of edge segment
 * @param sourcePos - Source position
 * @param receiverPos - Receiver position
 * @returns Diffraction point on the edge
 */
export function findDiffractionPoint(
  edgeStart: [number, number, number],
  edgeEnd: [number, number, number],
  sourcePos: [number, number, number],
  receiverPos: [number, number, number],
): [number, number, number] {
  // Edge vector
  const ex = edgeEnd[0] - edgeStart[0];
  const ey = edgeEnd[1] - edgeStart[1];
  const ez = edgeEnd[2] - edgeStart[2];
  const edgeLenSq = ex * ex + ey * ey + ez * ez;

  if (edgeLenSq < 1e-20) {
    return [...edgeStart] as [number, number, number];
  }

  // Project source and receiver onto edge line to get t parameters
  // For the optimal point, d/dt(|S-P(t)| + |P(t)-R|) = 0
  // This is equivalent to: (P-S)·e/|P-S| + (P-R)·e/|P-R| = 0
  // Solve by bisection on the derivative

  const edgeLen = Math.sqrt(edgeLenSq);
  const eNorm = [ex / edgeLen, ey / edgeLen, ez / edgeLen];

  // Evaluate derivative at a given t
  const derivative = (t: number): number => {
    const px = edgeStart[0] + t * ex;
    const py = edgeStart[1] + t * ey;
    const pz = edgeStart[2] + t * ez;

    const ds = Math.sqrt(
      (px - sourcePos[0]) ** 2 + (py - sourcePos[1]) ** 2 + (pz - sourcePos[2]) ** 2
    );

    const dr = Math.sqrt(
      (px - receiverPos[0]) ** 2 + (py - receiverPos[1]) ** 2 + (pz - receiverPos[2]) ** 2
    );

    if (ds < 1e-10 || dr < 1e-10) return 0;

    // d/dt = (P-S)·e_hat / |P-S| + (P-R)·e_hat / |P-R|
    const dotS = ((px - sourcePos[0]) * eNorm[0] + (py - sourcePos[1]) * eNorm[1] + (pz - sourcePos[2]) * eNorm[2]) / ds;
    const dotR = ((px - receiverPos[0]) * eNorm[0] + (py - receiverPos[1]) * eNorm[1] + (pz - receiverPos[2]) * eNorm[2]) / dr;

    return dotS + dotR;
  };

  // Binary search for root of derivative in [0, 1]
  let lo = 0;
  let hi = 1;
  const dLo = derivative(lo);
  const dHi = derivative(hi);

  // If derivative doesn't change sign, minimum is at an endpoint
  if (dLo * dHi > 0) {
    // Evaluate total distance at both endpoints
    const distAt = (t: number): number => {
      const px = edgeStart[0] + t * ex;
      const py = edgeStart[1] + t * ey;
      const pz = edgeStart[2] + t * ez;
      const ds = Math.sqrt(
        (px - sourcePos[0]) ** 2 + (py - sourcePos[1]) ** 2 + (pz - sourcePos[2]) ** 2
      );
      const dr = Math.sqrt(
        (px - receiverPos[0]) ** 2 + (py - receiverPos[1]) ** 2 + (pz - receiverPos[2]) ** 2
      );
      return ds + dr;
    };
    const t = distAt(0) < distAt(1) ? 0 : 1;
    return [
      edgeStart[0] + t * ex,
      edgeStart[1] + t * ey,
      edgeStart[2] + t * ez,
    ];
  }

  // Bisection
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const dMid = derivative(mid);
    if (Math.abs(dMid) < 1e-12) break;
    if (dLo * dMid < 0) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  const tOpt = (lo + hi) / 2;
  return [
    edgeStart[0] + tOpt * ex,
    edgeStart[1] + tOpt * ey,
    edgeStart[2] + tOpt * ez,
  ];
}

/**
 * Check line-of-sight between two points using raycasting.
 *
 * @param from - Start point
 * @param to - End point
 * @param raycaster - THREE.Raycaster instance
 * @param objects - Intersectable surface objects
 * @param tolerance - Distance tolerance for self-intersection avoidance
 * @returns true if line of sight is clear
 */
export function hasLineOfSight(
  from: [number, number, number],
  to: [number, number, number],
  raycaster: THREE.Raycaster,
  objects: Array<THREE.Mesh | THREE.Object3D>,
  tolerance: number = 0.01,
): boolean {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (dist < tolerance) return true;

  const dir = new THREE.Vector3(dx / dist, dy / dist, dz / dist);
  const origin = new THREE.Vector3(
    from[0] + dir.x * tolerance,
    from[1] + dir.y * tolerance,
    from[2] + dir.z * tolerance,
  );

  raycaster.ray.set(origin, dir);
  raycaster.far = dist - 2 * tolerance;
  raycaster.near = 0;

  const intersections = raycaster.intersectObjects(objects, true);
  raycaster.far = Infinity; // reset

  return intersections.length === 0;
}

/**
 * Find all valid first-order diffraction paths in the scene.
 *
 * @param edgeGraph - Graph of diffracting edges
 * @param sourcePositions - Map of source UUID → world position
 * @param receiverPositions - Map of receiver UUID → world position
 * @param frequencies - Octave band center frequencies
 * @param soundSpeed - Speed of sound in m/s
 * @param temperature - Temperature in °C (for air absorption)
 * @param raycaster - THREE.Raycaster for LOS checks
 * @param surfaceObjects - Intersectable surface meshes
 * @returns Array of valid diffraction paths
 */
export function findDiffractionPaths(
  edgeGraph: EdgeGraph,
  sourcePositions: Map<string, [number, number, number]>,
  receiverPositions: Map<string, [number, number, number]>,
  frequencies: number[],
  soundSpeed: number,
  temperature: number,
  raycaster: THREE.Raycaster,
  surfaceObjects: Array<THREE.Mesh | THREE.Object3D>,
): DiffractionPath[] {
  const paths: DiffractionPath[] = [];
  const airAtt = ac.airAttenuation(frequencies, temperature);

  for (const edge of edgeGraph.edges) {
    for (const [sourceId, sourcePos] of sourcePositions) {
      for (const [receiverId, receiverPos] of receiverPositions) {
        // Find optimal diffraction point on this edge
        const diffPt = findDiffractionPoint(edge.start, edge.end, sourcePos, receiverPos);

        // Compute distances
        const sDist = Math.sqrt(
          (diffPt[0] - sourcePos[0]) ** 2 +
          (diffPt[1] - sourcePos[1]) ** 2 +
          (diffPt[2] - sourcePos[2]) ** 2
        );
        const rDist = Math.sqrt(
          (diffPt[0] - receiverPos[0]) ** 2 +
          (diffPt[1] - receiverPos[1]) ** 2 +
          (diffPt[2] - receiverPos[2]) ** 2
        );

        if (sDist < 1e-6 || rDist < 1e-6) continue;

        // Check line-of-sight on both legs
        if (!hasLineOfSight(sourcePos, diffPt, raycaster, surfaceObjects)) continue;
        if (!hasLineOfSight(diffPt, receiverPos, raycaster, surfaceObjects)) continue;

        // Compute wedge angles
        const { phiSource, phiReceiver } = computeWedgeAngles(
          edge.direction, edge.normal0, diffPt, sourcePos, receiverPos,
        );

        // Compute UTD coefficient per frequency band
        const totalDistance = sDist + rDist;
        const time = totalDistance / soundSpeed;
        const bandEnergy: number[] = new Array(frequencies.length);

        for (let f = 0; f < frequencies.length; f++) {
          // UTD energy transfer
          let energy = utdDiffractionCoefficient(
            frequencies[f], edge.n, sDist, rDist, phiSource, phiReceiver, soundSpeed,
          );

          // Apply air absorption over total path distance
          // airAtt is in dB/m, convert to energy factor
          const airAbsDb = airAtt[f] * totalDistance;
          energy *= Math.pow(10, -airAbsDb / 10);

          bandEnergy[f] = energy;
        }

        paths.push({
          edge,
          diffractionPoint: diffPt,
          totalDistance,
          time,
          bandEnergy,
          sourceId,
          receiverId,
        });
      }
    }
  }

  return paths;
}
