/**
 * World-space hit normal. three ^0.185 `face.normal` is object-local (#130).
 */
import { Matrix4, Vector3 } from "three";

export function worldHitNormal(
  hit: { normal?: Vector3 | null; face?: { normal: Vector3 } | null; object?: { matrixWorld?: Matrix4 } },
  target: Vector3,
): Vector3 | null {
  if (hit.normal && hit.normal.lengthSq() > 0) {
    return target.copy(hit.normal).normalize();
  }
  if (hit.face) {
    target.copy(hit.face.normal);
    hit.object?.matrixWorld && target.transformDirection(hit.object.matrixWorld);
    return target.normalize();
  }
  return null;
}

export function reflectDirection(rd: Vector3, nWorld: Vector3, target: Vector3): Vector3 {
  return target.copy(rd).addScaledVector(nWorld, -2 * rd.dot(nWorld));
}
