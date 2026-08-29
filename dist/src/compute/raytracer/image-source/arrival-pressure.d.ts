import { Vector3 } from 'three';
export interface ImageSourceArrivalHit {
    point: Vector3;
    reflectingSurface: {
        reflectionFunction: (freq: number, theta: number) => number;
    } | null;
    angle: number | null;
}
export declare function imageSourcePathLength(path: {
    point: Vector3;
}[]): number;
export declare function imageSourceArrivalPressure(initialSPL: number[], freqs: number[], path: ImageSourceArrivalHit[], temperature?: number): number[];
