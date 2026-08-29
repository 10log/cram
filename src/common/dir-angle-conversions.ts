import * as THREE from "three";

export function cramangle2threejsangle(phiCRAM: number, thetaCRAM: number): number[]{

    // converts CRAM angle convention (in DEGREES) to ThreeJS angle convention (in RADIANS)
    // accounts for coordinate system and symbol convention shift

    let thetaThreeJS: number = (360-phiCRAM)*(Math.PI/180);
    let phiThreeJS: number = thetaCRAM*(Math.PI/180);

    return [phiThreeJS, thetaThreeJS];


}

/**
 * Inverse of `cramangle2threejsangle`.
 *
 * Takes a direction vector expressed in the source's LOCAL frame (i.e. after the
 * source's rotation has been undone) and returns CRAM `[phi, theta]` in DEGREES,
 * ready to hand to `DirectivityHandler.getPressureAtPosition`.
 *
 * Three.js `Spherical` treats `phi` as the polar angle from +Y and `theta` as the
 * azimuth in the XZ plane measured from +Z toward +X, which is what
 * `setFromSphericalCoords` consumes on the forward path. Round-trips with
 * `cramangle2threejsangle`, so the source's on-axis direction — CRAM (0, 0) — is
 * local +Y in both directions.
 */
export function threejsdir2cramangle(x: number, y: number, z: number): number[]{

    const r = Math.sqrt(x*x + y*y + z*z);
    if(r < 1e-10){
        return [0, 0];
    }

    // polar angle from +Y
    const polar = Math.acos(Math.min(1, Math.max(-1, y / r)));
    // azimuth in XZ, from +Z toward +X
    const azimuth = Math.atan2(x, z);

    const thetaCRAM: number = polar * (180/Math.PI);
    const phiCRAM: number = (((360 - azimuth * (180/Math.PI)) % 360) + 360) % 360;

    return [phiCRAM, thetaCRAM];

}

/**
 * World-space leaving direction → CRAM (phi, theta) degrees in the source frame.
 *
 * Undoes `sourceQuaternion` with the inverse quaternion (negating Euler angles
 * in the same order is NOT the inverse for two or more non-zero components),
 * then maps with `threejsdir2cramangle`. Shared by beam-trace and the raytracer
 * so they cannot drift apart.
 */
export function worldDirToCramAngles(
  worldDir: THREE.Vector3,
  sourceQuaternion: THREE.Quaternion,
): [number, number] {
  if (worldDir.lengthSq() < 1e-20) {
    return [0, 0];
  }
  const localDir = worldDir.clone().normalize().applyQuaternion(sourceQuaternion.clone().invert());
  const [phi, theta] = threejsdir2cramangle(localDir.x, localDir.y, localDir.z);
  return [phi, theta];
}
