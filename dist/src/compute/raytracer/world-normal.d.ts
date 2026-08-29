import { Matrix4, Vector3 } from 'three';
export declare function worldHitNormal(hit: {
    normal?: Vector3 | null;
    face?: {
        normal: Vector3;
    } | null;
    object?: {
        matrixWorld?: Matrix4;
    };
}, target: Vector3): Vector3 | null;
export declare function reflectDirection(rd: Vector3, nWorld: Vector3, target: Vector3): Vector3;
