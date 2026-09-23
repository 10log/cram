import { Matrix4, Vector3 } from 'three';
/**
 * The world-space normal at `hit`, flipped to face `rayDir` when one is given.
 *
 * `rayDir` is optional only because a caller may genuinely want the geometric
 * normal; every caller in the solver passes it. Writes into `target` and
 * returns it, or `null` when the hit carries no normal at all.
 */
export declare function worldHitNormal(hit: {
    normal?: Vector3 | null;
    face?: {
        normal: Vector3;
    } | null;
    object?: {
        matrixWorld?: Matrix4;
    };
}, target: Vector3, rayDir?: Vector3 | null): Vector3 | null;
/**
 * Mirror `rd` about the plane with normal `nWorld`.
 *
 * Invariant to the sign of `nWorld` — the quadratic form sees it twice — so
 * this keeps working on an outward-wound triangle. That is worth knowing
 * before anyone decides the orientation flip in {@link worldHitNormal} is
 * redundant: specular reflection does not care, and the scatter lobe and the
 * next origin offset do.
 */
export declare function reflectDirection(rd: Vector3, nWorld: Vector3, target: Vector3): Vector3;
