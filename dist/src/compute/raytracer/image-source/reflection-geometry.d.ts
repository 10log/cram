import { Matrix4, Vector3 } from 'three';
export declare function worldSurfaceNormal(localNormal: Vector3, matrixWorld: Matrix4): Vector3;
/** p' = p − 2 n (n · (p − p0)) with world n, p, p0. */
export declare function reflectPointAcrossPlane(point: Vector3, pointOnPlane: Vector3, normalWorld: Vector3): Vector3;
/**
 * Angle between the incoming ray (toward the hit) reversed onto the surface
 * and the world normal, folded into [0, π/2] for reflectionCoefficient.
 */
export declare function incidenceAngle(worldRayDir: Vector3, normalWorld: Vector3): number;
export declare function hitWorldNormal(hit: {
    normal?: Vector3 | null;
    face?: {
        normal: Vector3;
    } | null;
}, matrixWorld: Matrix4, fallbackLocal: Vector3): Vector3;
