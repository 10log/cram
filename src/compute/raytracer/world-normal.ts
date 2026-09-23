/**
 * World-space, ray-facing hit normal.
 *
 * Two things have to be true of a normal before the ray tracer can use it, and
 * before #213 each branch of this function got one of them right:
 *
 * - **World space.** `face.normal` is object-local (#130), and so is
 *   `intersection.normal` — three.js raycasts in the object's own frame
 *   (`Mesh.js` builds `rayLocalSpace`) and hands back the interpolated vertex
 *   normal without transforming it. Measured on a plane rotated 90° about X,
 *   hit head-on: the untransformed normal reads the incidence as **90°** when
 *   it is 0°. Only surfaces whose world matrix is the identity escape, which is
 *   why this went unnoticed — but `Surface` carries its own position, rotation
 *   and scale, restored from the save file and settable from the transform
 *   controls, and a `Room` does too.
 * - **Facing the ray.** three.js already flips `intersection.normal` when it
 *   points along the ray; nothing flips `face.normal`. An outward-wound
 *   triangle then reflects correctly anyway — see {@link reflectDirection} —
 *   but the scatter lobe is built *about* the normal, and the next segment's
 *   origin is pushed *along* it, so both end up on the far side of the wall.
 *   The ray does not error, it just stops finding surfaces; `traceRay` returns
 *   its recursive call directly, so the whole path collapses to `undefined`.
 *   A fixture wound this way leaked 79% of its rays (#201).
 *
 * Which branch a hit takes depends on whether the geometry carries a normal
 * attribute, and `Surface` always calls `computeVertexNormals()` — so
 * production always took the first one. Both are handled the same way now.
 *
 * **Known gap:** the transform is `transformDirection`, i.e. the matrix's upper
 * 3×3, which is exact for rotation and uniform scale and wrong under
 * *non-uniform* scale, where a normal transforms by the inverse transpose. That
 * is a separate defect, shared with `image-source/reflection-geometry.ts`, and
 * fixing it in one place only would put the two back out of step.
 */
import { Matrix4, Vector3 } from "three";

/**
 * The world-space normal at `hit`, flipped to face `rayDir` when one is given.
 *
 * `rayDir` is optional only because a caller may genuinely want the geometric
 * normal; every caller in the solver passes it. Writes into `target` and
 * returns it, or `null` when the hit carries no normal at all.
 */
export function worldHitNormal(
  hit: { normal?: Vector3 | null; face?: { normal: Vector3 } | null; object?: { matrixWorld?: Matrix4 } },
  target: Vector3,
  rayDir?: Vector3 | null,
): Vector3 | null {
  if (hit.normal && hit.normal.lengthSq() > 0) {
    target.copy(hit.normal);
  } else if (hit.face) {
    target.copy(hit.face.normal);
  } else {
    return null;
  }

  if (hit.object?.matrixWorld) target.transformDirection(hit.object.matrixWorld);
  else target.normalize();

  if (rayDir && target.dot(rayDir) > 0) target.multiplyScalar(-1);
  return target;
}

/**
 * Mirror `rd` about the plane with normal `nWorld`.
 *
 * Invariant to the sign of `nWorld` — the quadratic form sees it twice — so
 * this keeps working on an outward-wound triangle. That is worth knowing
 * before anyone decides the orientation flip in {@link worldHitNormal} is
 * redundant: specular reflection does not care, and the scatter lobe and the
 * next origin offset do.
 */
export function reflectDirection(rd: Vector3, nWorld: Vector3, target: Vector3): Vector3 {
  return target.copy(rd).addScaledVector(nWorld, -2 * rd.dot(nWorld));
}
