import { ArrivalSource } from '../beam-trace/arrival-pressure';
/**
 * ART source emission is the same physical quantity beam-trace uses:
 * intensity from Source.initialSPL, times Q(θ,φ,f)² from the
 * DirectivityHandler. The old 500-unit omni ignored both (#119).
 */
import * as THREE from "three";
export declare function sourceEmissionEnergy(initialSPL: number): number;
export declare function sourceRayWeight(opts: {
    handler?: ArrivalSource["directivityHandler"] | null;
    quaternion?: THREE.Quaternion;
    worldDir: THREE.Vector3;
    frequency: number;
}): number;
