import { BandEnergy, Chain, RayPath } from './types';
import * as THREE from "three";
export declare function inFrontOf(a: THREE.Triangle, b: THREE.Triangle): boolean;
/**
 * Trace one ray through its reflections.
 *
 * ## Receivers (#234)
 *
 * With an `arrivals` collector, a ray **passes through** receivers. Every
 * receiver the ray crosses before the next wall is recorded there as an
 * arrival (a path ending at the receiver), and the ray then reflects off that
 * wall as if the receiver were not there. The return value is the ray's own
 * path, however it ended. Ending a ray at its first receiver, as before, took
 * it out of every later time bin: a loss of `c·πr²/V` per second on top of
 * the walls, which read T30 3–8% short in `rt60-cross-check.spec.ts`'s room.
 *
 * Without a collector it keeps the old behaviour, returning the first
 * arrival and ending there, so callers that expect one path per ray are
 * unchanged.
 */
export declare function traceRay(raycaster: THREE.Raycaster, intersectableObjects: THREE.Object3D[], frequencies: number[], cachedAirAtt: number[], rrThreshold: number, ro: THREE.Vector3, rd: THREE.Vector3, order: number, bandEnergy: BandEnergy, source: string, initialPhi: number, initialTheta: number, iter?: number, chain?: Partial<Chain>[], arrivals?: RayPath[]): RayPath | undefined;
