/**
 * World-frame image-source geometry (#126).
 * Surface.normal and face.normal are local; points and rays are world.
 */
import { Matrix4, Vector3 } from "three";

export function worldSurfaceNormal(localNormal: Vector3, matrixWorld: Matrix4): Vector3 {
  return localNormal.clone().transformDirection(matrixWorld).normalize();
}

/** p' = p − 2 n (n · (p − p0)) with world n, p, p0. */
export function reflectPointAcrossPlane(
  point: Vector3,
  pointOnPlane: Vector3,
  normalWorld: Vector3,
): Vector3 {
  const n = normalWorld.clone().normalize();
  const offset = n.dot(point.clone().sub(pointOnPlane));
  return point.clone().sub(n.multiplyScalar(2 * offset));
}

/**
 * Angle between the incoming ray (toward the hit) reversed onto the surface
 * and the world normal, folded into [0, π/2] for reflectionCoefficient.
 */
export function incidenceAngle(worldRayDir: Vector3, normalWorld: Vector3): number {
  const towardOrigin = worldRayDir.clone().normalize().negate();
  const n = normalWorld.clone().normalize();
  let theta = towardOrigin.angleTo(n);
  if (theta > Math.PI / 2) theta = Math.PI - theta;
  return theta;
}

export function hitWorldNormal(
  hit: { normal?: Vector3 | null; face?: { normal: Vector3 } | null },
  matrixWorld: Matrix4,
  fallbackLocal: Vector3,
): Vector3 {
  if (hit.normal && hit.normal.lengthSq() > 0) {
    return hit.normal.clone().normalize();
  }
  if (hit.face) {
    return worldSurfaceNormal(hit.face.normal, matrixWorld);
  }
  return worldSurfaceNormal(fallbackLocal, matrixWorld);
}
