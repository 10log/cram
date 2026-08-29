import { ReflectionPath3D, DetailedReflectionPath3D } from 'beam-trace';
import * as THREE from "three";
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
export declare function convertPath(path: ReflectionPath3D, detailed: DetailedReflectionPath3D | undefined, speedOfSound: number): BeamTracePath;
