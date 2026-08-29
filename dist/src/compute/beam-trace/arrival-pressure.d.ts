import * as THREE from "three";
/**
 * Minimal surface contract used by the specular reflection loop.
 * `Surface.reflectionFunction` already returns energy (R²).
 */
export interface ArrivalSurface {
    reflectionFunction: (freq: number, theta: number) => number;
}
/**
 * Minimal source contract for on-axis-referenced directivity weighting.
 */
export interface ArrivalSource {
    quaternion: THREE.Quaternion;
    directivityHandler: {
        getPressureAtPosition: (gain: number, frequency: number, phi: number, theta: number) => unknown;
    };
}
/**
 * Path fields consumed by the energy pipeline.
 * `BeamTracePath` is a structural subtype of this.
 *
 * Point order matches the beam-trace library: [receiver, …bounces, source].
 */
export interface ArrivalPath {
    points: THREE.Vector3[];
    length: number;
    polygonIds: (number | null)[];
    reflections?: {
        incidenceAngle: number;
    }[];
    bandEnergy?: number[];
}
export interface ArrivalPressureOptions {
    frequencies: number[];
    temperature: number;
    receiverGain?: number;
    source?: ArrivalSource | null;
    polygonToSurface?: Map<number, ArrivalSurface>;
}
/**
 * Per-band energy weighting from a source's directivity for energy leaving
 * the source along `worldDir`.
 *
 * Undo the source rotation with the inverse quaternion, then map the
 * source-local direction to CRAM (phi, theta) degrees with
 * `worldDirToCramAngles` — the same convention the ray tracer launches with.
 */
export declare function directivityBandEnergy(handler: ArrivalSource["directivityHandler"], refPressures: number[], quaternion: THREE.Quaternion, worldDir: THREE.Vector3, frequencies: number[]): number[];
/**
 * Arrival pressure per frequency band for one geometric path.
 *
 * No renderer / messenger / store imports — this is the testable energy
 * path. `BeamTraceSolver.calculateArrivalPressure` is a thin façade.
 */
export declare function calculateArrivalPressure(initialSPL: number[], path: ArrivalPath, options: ArrivalPressureOptions): number[];
