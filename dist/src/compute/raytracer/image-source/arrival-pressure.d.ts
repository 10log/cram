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
 *
 * Direct path (no bounce) stays positive. A rigid wall (α = 0) has R = +1 at
 * every angle, so it does not invert — it is a pressure-doubling boundary. An
 * absorbing surface inverts past its sign change at `cosθ = 1/ξ`, which is
 * where the sign carries information rather than being a constant. See
 * `acoustics/reflection-coefficient.ts` and issue #200; this comment previously
 * documented R = −1 for a hard wall, which came from the reciprocal impedance
 * branch.
 */
export declare function imageSourceArrivalPressureIR(initialSPL: number[], freqs: number[], path: ImageSourceArrivalHit[], temperature?: number): number[];
