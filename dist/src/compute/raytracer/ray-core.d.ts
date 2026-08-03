import { BandEnergy, Chain, RayPath } from './types';
import * as THREE from "three";
export declare function inFrontOf(a: THREE.Triangle, b: THREE.Triangle): boolean;
export declare function traceRay(raycaster: THREE.Raycaster, intersectableObjects: THREE.Object3D[], frequencies: number[], cachedAirAtt: number[], rrThreshold: number, ro: THREE.Vector3, rd: THREE.Vector3, order: number, bandEnergy: BandEnergy, source: string, initialPhi: number, initialTheta: number, iter?: number, chain?: Partial<Chain>[]): RayPath | undefined;
