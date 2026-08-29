import * as THREE from "three";
import {
  computePathLength,
  computeArrivalTime,
  getPathReflectionOrder,
} from "beam-trace";
import type {
  ReflectionPath3D,
  DetailedReflectionPath3D,
} from "beam-trace";
import { lookingBackArrivalDirection } from "../../common/arrival-direction";

export interface BeamTracePath {
  points: THREE.Vector3[];
  order: number;
  length: number;
  arrivalTime: number;
  polygonIds: (number | null)[];
  /** Unit vector at the receiver pointing toward the last bounce (looking-back). Matches Receiver.getGain. */
  arrivalDirection: THREE.Vector3;
  reflections?: {
    polygonId: number;
    hitPoint: THREE.Vector3;
    incidenceAngle: number;
    surfaceNormal: THREE.Vector3;
    isGrazing: boolean;
  }[];
  /** Pre-computed per-band energy for diffraction paths (bypasses specular reflection calc) */
  bandEnergy?: number[];
}

export type VisualizationMode = "rays" | "beams" | "both";

/**
 * Convert a library ReflectionPath3D (+ optional detailed reflections)
 * into the solver's BeamTracePath.
 *
 * Point order matches the beam-trace library: [receiver, …bounces, source].
 */
export function convertPath(
  path: ReflectionPath3D,
  detailed: DetailedReflectionPath3D | undefined,
  speedOfSound: number,
): BeamTracePath {
  const points = path.map(p => new THREE.Vector3(p.position[0], p.position[1], p.position[2]));
  const length = computePathLength(path);
  const arrivalTime = computeArrivalTime(path, speedOfSound);
  const order = getPathReflectionOrder(path);
  const polygonIds = path.map(p => p.polygonId);

  // Looking-back: receiver → last bounce (or source). Matches Receiver.getGain.
  // points[0] is the receiver, points[1] is the last reflection (or source for direct).
  let arrivalDirection: THREE.Vector3;
  if (points.length >= 2) {
    const [x, y, z] = lookingBackArrivalDirection(points[0], points[1]);
    arrivalDirection = new THREE.Vector3(x, y, z);
  } else {
    arrivalDirection = new THREE.Vector3(0, 0, 1);
  }

  const reflections = detailed?.reflections.map(r => ({
    polygonId: r.polygonId,
    hitPoint: new THREE.Vector3(r.hitPoint[0], r.hitPoint[1], r.hitPoint[2]),
    incidenceAngle: r.incidenceAngle,
    surfaceNormal: new THREE.Vector3(r.surfaceNormal[0], r.surfaceNormal[1], r.surfaceNormal[2]),
    isGrazing: r.isGrazing,
  }));

  return { points, order, length, arrivalTime, polygonIds, arrivalDirection, reflections };
}
