import * as THREE from "three";
export declare function cramangle2threejsangle(phiCRAM: number, thetaCRAM: number): number[];
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
export declare function threejsdir2cramangle(x: number, y: number, z: number): number[];
/**
 * World-space leaving direction → CRAM (phi, theta) degrees in the source frame.
 *
 * Undoes `sourceQuaternion` with the inverse quaternion (negating Euler angles
 * in the same order is NOT the inverse for two or more non-zero components),
 * then maps with `threejsdir2cramangle`. Shared by beam-trace and the raytracer
 * so they cannot drift apart.
 */
export declare function worldDirToCramAngles(worldDir: THREE.Vector3, sourceQuaternion: THREE.Quaternion): [number, number];
