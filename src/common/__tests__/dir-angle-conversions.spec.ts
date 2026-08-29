/**
 * @jest-environment jsdom
 *
 * Issue #101: Beam tracer source directivity used an inverted-Euler world→local
 * conversion and two mutually inconsistent spherical conventions.
 *
 * These tests exercise the real production helpers against real three.js
 * rotation math — no source scanning, no re-derived formulas.
 */

import * as THREE from 'three';
import { cramangle2threejsangle, threejsdir2cramangle } from '../dir-angle-conversions';

/** Forward path exactly as the ray tracer launches rays (raytracer/index.ts:672). */
function cramToLocalDir(phiCRAM: number, thetaCRAM: number): THREE.Vector3 {
  const [phiThree, thetaThree] = cramangle2threejsangle(phiCRAM, thetaCRAM);
  return new THREE.Vector3().setFromSphericalCoords(1, phiThree, thetaThree);
}

/** Smallest absolute difference between two azimuths, in degrees (0 when equal). */
function azimuthDelta(a: number, b: number): number {
  return Math.abs((((a - b + 180) % 360) + 360) % 360 - 180);
}

describe('Issue #101: CRAM <-> three.js direction conversions', () => {
  test('CRAM (0, 0) is the source-local +Y axis (the on-axis reference)', () => {
    const dir = cramToLocalDir(0, 0);
    expect(dir.x).toBeCloseTo(0, 6);
    expect(dir.y).toBeCloseTo(1, 6);
    expect(dir.z).toBeCloseTo(0, 6);

    // ...and the inverse agrees, so getPressureAtPosition(0, f, 0, 0) really is on-axis.
    const [phi, theta] = threejsdir2cramangle(dir.x, dir.y, dir.z);
    expect(phi).toBeCloseTo(0, 6);
    expect(theta).toBeCloseTo(0, 6);
  });

  test('threejsdir2cramangle round-trips cramangle2threejsangle over a full angle grid', () => {
    for (let phiCRAM = 0; phiCRAM < 360; phiCRAM += 15) {
      // Skip the poles, where azimuth is degenerate and any phi is equivalent.
      for (let thetaCRAM = 15; thetaCRAM <= 165; thetaCRAM += 15) {
        const dir = cramToLocalDir(phiCRAM, thetaCRAM);
        const [phiBack, thetaBack] = threejsdir2cramangle(dir.x, dir.y, dir.z);

        expect(thetaBack).toBeCloseTo(thetaCRAM, 4);
        // Compare azimuth modulo 360 so 0 and 360 count as equal.
        expect(azimuthDelta(phiBack, phiCRAM)).toBeCloseTo(0, 4);
      }
    }
  });

  test('the rear hemisphere is not folded onto the front (the Math.abs(phi) bug)', () => {
    // phi and 360 - phi are mirror-image azimuths. The old diffraction path called
    // Math.abs(phi) on an atan2 result, collapsing them onto one another and making
    // any azimuthally asymmetric pattern look omnidirectional.
    const front = cramToLocalDir(90, 90);
    const rear = cramToLocalDir(270, 90);

    expect(front.x).toBeCloseTo(-rear.x, 6);
    expect(front.z).toBeCloseTo(rear.z, 6);

    const [phiFront] = threejsdir2cramangle(front.x, front.y, front.z);
    const [phiRear] = threejsdir2cramangle(rear.x, rear.y, rear.z);

    expect(phiFront).toBeCloseTo(90, 4);
    expect(phiRear).toBeCloseTo(270, 4);
    expect(phiFront).not.toBeCloseTo(phiRear, 1);
  });

  test('returns [0, 0] for a degenerate zero-length direction', () => {
    expect(threejsdir2cramangle(0, 0, 0)).toEqual([0, 0]);
  });

  test('phi is normalized into [0, 360)', () => {
    for (let phiCRAM = 0; phiCRAM < 360; phiCRAM += 10) {
      const dir = cramToLocalDir(phiCRAM, 90);
      const [phi] = threejsdir2cramangle(dir.x, dir.y, dir.z);
      expect(phi).toBeGreaterThanOrEqual(0);
      expect(phi).toBeLessThan(360);
    }
  });
});

describe('Issue #101: undoing a source rotation', () => {
  test('negating Euler angles in the same order is NOT the inverse rotation', () => {
    // The original bug: new Euler(-x, -y, -z, order). For order 'XYZ', R = Rz Ry Rx,
    // whose inverse is Rx^-1 Ry^-1 Rz^-1 — i.e. negated angles in 'ZYX', not 'XYZ'.
    const rotation = new THREE.Euler(0.4, 0.7, 0.2, 'XYZ');
    const worldDir = new THREE.Vector3(0, 1, 0).applyEuler(rotation);

    const negatedEuler = worldDir.clone().applyEuler(
      new THREE.Euler(-rotation.x, -rotation.y, -rotation.z, rotation.order),
    );
    const quaternionInverse = worldDir.clone().applyQuaternion(
      new THREE.Quaternion().setFromEuler(rotation).invert(),
    );

    // The quaternion inverse recovers the original local +Y exactly.
    expect(quaternionInverse.x).toBeCloseTo(0, 6);
    expect(quaternionInverse.y).toBeCloseTo(1, 6);
    expect(quaternionInverse.z).toBeCloseTo(0, 6);

    // The negated-Euler version does not.
    expect(negatedEuler.distanceTo(quaternionInverse)).toBeGreaterThan(0.1);
  });

  test('negated Euler happens to work for a single-axis rotation, which is why this hid', () => {
    const rotation = new THREE.Euler(0, 0.7, 0, 'XYZ');
    const worldDir = new THREE.Vector3(1, 0, 0).applyEuler(rotation);

    const negatedEuler = worldDir.clone().applyEuler(
      new THREE.Euler(-rotation.x, -rotation.y, -rotation.z, rotation.order),
    );
    const quaternionInverse = worldDir.clone().applyQuaternion(
      new THREE.Quaternion().setFromEuler(rotation).invert(),
    );

    expect(negatedEuler.distanceTo(quaternionInverse)).toBeCloseTo(0, 6);
  });

  test('combined yaw+pitch: world->local->CRAM matches the unrotated reference angles', () => {
    // A source with a two-axis pose, aimed along some CRAM direction. Undoing the
    // rotation must recover exactly the CRAM angles the direction was built from.
    const rotation = new THREE.Euler(0.35, -0.8, 0, 'XYZ');
    const quaternion = new THREE.Quaternion().setFromEuler(rotation);

    for (const [phiCRAM, thetaCRAM] of [[30, 60], [200, 120], [315, 45]]) {
      const localDir = cramToLocalDir(phiCRAM, thetaCRAM);
      const worldDir = localDir.clone().applyQuaternion(quaternion);

      const recovered = worldDir.clone().applyQuaternion(quaternion.clone().invert());
      const [phi, theta] = threejsdir2cramangle(recovered.x, recovered.y, recovered.z);

      expect(theta).toBeCloseTo(thetaCRAM, 4);
      expect(azimuthDelta(phi, phiCRAM)).toBeCloseTo(0, 4);
    }
  });
});

describe('Issue #101: acceptance — a rotated cardioid aims where it is pointed', () => {
  // Analytic cardioid over the CRAM polar angle: on-axis (theta=0) -> 1, rear -> 0.
  function cardioidPressure(thetaCRAMdeg: number): number {
    return (1 + Math.cos(thetaCRAMdeg * (Math.PI / 180))) / 2;
  }

  /** What the fixed beam-trace helper computes for a source pose and a receiver. */
  function directivityPressure(rotation: THREE.Euler, worldDir: THREE.Vector3): number {
    const quaternion = new THREE.Quaternion().setFromEuler(rotation);
    const localDir = worldDir.clone().normalize().applyQuaternion(quaternion.clone().invert());
    const [, theta] = threejsdir2cramangle(localDir.x, localDir.y, localDir.z);
    return cardioidPressure(theta);
  }

  // The source's on-axis direction is local +Y, so "aim away" from a receiver
  // directly above means rotating +Y to -Y — 180 degrees about X (or Z), not about Y.
  const receiverAbove = new THREE.Vector3(0, 1, 0);

  test('aimed at the receiver gives the full on-axis level', () => {
    const p = directivityPressure(new THREE.Euler(0, 0, 0, 'XYZ'), receiverAbove);
    expect(p).toBeCloseTo(1, 6);
  });

  test('aimed 180 degrees away drops to the cardioid null, not ~0 dB of change', () => {
    const p = directivityPressure(new THREE.Euler(Math.PI, 0, 0, 'XYZ'), receiverAbove);
    expect(p).toBeCloseTo(0, 6);

    const onAxis = directivityPressure(new THREE.Euler(0, 0, 0, 'XYZ'), receiverAbove);
    expect(onAxis - p).toBeGreaterThan(0.9);
  });

  test('aimed 90 degrees off gives the cardioid half-level', () => {
    const p = directivityPressure(new THREE.Euler(Math.PI / 2, 0, 0, 'XYZ'), receiverAbove);
    expect(p).toBeCloseTo(0.5, 6);
  });

  test('a two-axis pose still lands on the correct lobe', () => {
    // Aim the source at a receiver off in (1, 1, 1); the on-axis level must come back.
    const target = new THREE.Vector3(1, 1, 1).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), target,
    );
    const rotation = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');

    expect(directivityPressure(rotation, target)).toBeCloseTo(1, 6);
    // And the opposite direction is the null.
    expect(directivityPressure(rotation, target.clone().negate())).toBeCloseTo(0, 6);
  });
});
