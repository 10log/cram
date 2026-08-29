import { Vector3 } from 'three';
export interface ImageSourceArrivalHit {
    point: Vector3;
    reflectingSurface: {
        reflectionFunction: (freq: number, theta: number) => number;
        pressureReflectionFunction?: (freq: number, theta: number) => number;
    } | null;
    angle: number | null;
}
export declare function imageSourcePathLength(path: {
    point: Vector3;
}[]): number;
export declare function imageSourceArrivalPressure(initialSPL: number[], freqs: number[], path: ImageSourceArrivalHit[], temperature?: number): number[];
/**
 * Coherent IR arrival: same magnitude as LTP, times ∏ sign(R_pressure).
 * Direct path (no bounce) stays positive. Hard wall (α = 0) → R = −1.
 */
export declare function imageSourceArrivalPressureIR(initialSPL: number[], freqs: number[], path: ImageSourceArrivalHit[], temperature?: number): number[];
