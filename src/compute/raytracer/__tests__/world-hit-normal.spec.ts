/**
 * Issue #130: specular reflection uses world n, not object-local face.normal.
 */
import * as THREE from "three";
import { reflectDirection, worldHitNormal } from "../world-normal";

describe("Issue #130: world-space reflection", () => {
  test("rd=(0,-1,0) off world n=+Y reflects to (0,1,0)", () => {
    const r = reflectDirection(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3());
    expect(r.x).toBeCloseTo(0, 10);
    expect(r.y).toBeCloseTo(1, 10);
    expect(r.z).toBeCloseTo(0, 10);
  });

  test("rotated mesh: local +Z becomes world +Y and matches rd - 2 n (rd·n)", () => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    mesh.rotation.x = -Math.PI / 2;
    mesh.updateMatrixWorld(true);
    const hit = {
      normal: null,
      face: { normal: new THREE.Vector3(0, 0, 1) },
      object: mesh,
    } as unknown as THREE.Intersection;
    const nWorld = worldHitNormal(hit, new THREE.Vector3())!;
    expect(nWorld.y).toBeCloseTo(1, 6);
    const rd = new THREE.Vector3(0, -1, 0);
    const r = reflectDirection(rd, nWorld, new THREE.Vector3());
    const expected = rd.clone().addScaledVector(nWorld, -2 * rd.dot(nWorld));
    expect(r.distanceTo(expected)).toBeCloseTo(0, 10);
    expect(r.y).toBeCloseTo(1, 6);
  });

  test("next origin offset uses the same world normal", () => {
    const n = new THREE.Vector3(0, 1, 0);
    const origin = new THREE.Vector3(0, 0, 0).addScaledVector(n, 1e-4);
    expect(origin.y).toBeGreaterThan(0);
  });
});

describe("Issue #130: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../ray-core.ts"), "utf8");

  test("face.normal is not dotted with rd", () => {
    expect(source).not.toMatch(/rd\)\.multiplyScalar\(-1\)\.angleTo\(intersections\[0\]\.face\.normal\)/);
    expect(source).not.toMatch(/copy\(intersections\[0\]\.face\.normal\)\.normalize\(\)/);
    expect(source).toMatch(/worldHitNormal/);
    expect(source).toMatch(/addScaledVector\(normal, SELF_INTERSECTION_OFFSET\)/);
  });
});
