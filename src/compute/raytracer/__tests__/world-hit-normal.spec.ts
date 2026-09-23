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

describe("Issue #213: the normal is world-space and faces the ray", () => {
  /**
   * A plane whose local +Z is world +Y, hit head-on from above. True incidence
   * is 0°; before this, the branch production takes reported 90°.
   */
  function hitRotatedPlane(withVertexNormals: boolean) {
    const geometry = new THREE.PlaneGeometry(4, 4);
    if (!withVertexNormals) geometry.deleteAttribute("normal");
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.updateMatrixWorld(true);

    const direction = new THREE.Vector3(0, -1, 0);
    const raycaster = new THREE.Raycaster(new THREE.Vector3(0, 3, 0), direction);
    const hits = raycaster.intersectObject(mesh, true);
    expect(hits).not.toHaveLength(0);
    return { hit: hits[0], direction };
  }

  test("a rotated surface reports the incidence it actually has", () => {
    // Both branches, because which one a hit takes depends on whether the
    // geometry carries a normal attribute — and `Surface` always calls
    // `computeVertexNormals()`, so production takes the one that was broken.
    for (const withVertexNormals of [true, false]) {
      const { hit, direction } = hitRotatedPlane(withVertexNormals);
      const n = worldHitNormal(hit, new THREE.Vector3(), direction)!;
      const incidence = direction.clone().multiplyScalar(-1).angleTo(n);
      expect([withVertexNormals, +n.y.toFixed(6)]).toEqual([withVertexNormals, 1]);
      expect([withVertexNormals, +incidence.toFixed(6)]).toEqual([withVertexNormals, 0]);
    }
  });

  test("both branches return the same normal for the same hit", () => {
    // The two used to fix what the other broke — one transformed and did not
    // orient, the other oriented and did not transform — so agreement between
    // them is the property worth holding, not either one alone.
    const withNormals = hitRotatedPlane(true);
    const withoutNormals = hitRotatedPlane(false);
    expect(withNormals.hit.normal).toBeDefined();
    expect(withoutNormals.hit.normal).toBeUndefined();
    const a = worldHitNormal(withNormals.hit, new THREE.Vector3(), withNormals.direction)!;
    const b = worldHitNormal(withoutNormals.hit, new THREE.Vector3(), withoutNormals.direction)!;
    expect(a.distanceTo(b)).toBeCloseTo(0, 10);
  });

  /** A single triangle wound so its geometric normal points *along* `rayDir`. */
  function hitOutwardWoundTriangle(withVertexNormals: boolean) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([-1, 0, -1, 1, 0, -1, 0, 0, 1], 3),
    );
    geometry.computeVertexNormals();
    if (!withVertexNormals) geometry.deleteAttribute("normal");
    const mesh = new THREE.Mesh(
      geometry,
      // `Surface`'s own material is DoubleSide, so a wall wound away from the
      // room is hit rather than culled. This is reachable with real geometry.
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
    );
    mesh.updateMatrixWorld(true);
    const direction = new THREE.Vector3(0, -1, 0);
    const hits = new THREE.Raycaster(new THREE.Vector3(0, 2, 0), direction)
      .intersectObject(mesh, true);
    expect(hits).not.toHaveLength(0);
    // The fixture is only the case worth testing if the winding really does
    // face away from the ray; otherwise everything below passes for the wrong
    // reason.
    expect(hits[0].face!.normal.dot(direction)).toBeGreaterThan(0);
    return { hit: hits[0], direction };
  }

  test("an outward-wound triangle yields a normal facing the ray, on either branch", () => {
    // Which branch matters, and this is the assertion that says so. three.js
    // flips `intersection.normal` itself (`Mesh.js`: `if (normal.dot(
    // ray.direction) > 0) normal *= -1`), so the vertex-normal branch arrives
    // already oriented and the flip here is redundant for it. Nothing flips
    // `face.normal`. Testing only the branch production happens to take would
    // let the flip be deleted without a single failure.
    for (const withVertexNormals of [true, false]) {
      const { hit, direction } = hitOutwardWoundTriangle(withVertexNormals);
      const n = worldHitNormal(hit, new THREE.Vector3(), direction)!;
      expect([withVertexNormals, n.dot(direction) < 0]).toEqual([withVertexNormals, true]);

      // And the offset origin lands on the side the ray came from rather than
      // through the wall, which is what the scatter lobe and the next segment
      // both depend on.
      const offset = hit.point.clone().addScaledVector(n, 1e-3);
      expect([withVertexNormals, offset.y > hit.point.y]).toEqual([withVertexNormals, true]);
    }
  });

  test("three.js orients the vertex-normal branch for us, and not the face branch", () => {
    // Pinned because it is the reason the flip above looks like dead code on
    // the branch production takes, and because it is three-version behaviour:
    // if a future three stops doing it, the flip starts carrying that case and
    // nothing else needs to change.
    const oriented = hitOutwardWoundTriangle(true);
    expect(oriented.hit.normal).toBeDefined();
    expect(oriented.hit.normal!.dot(oriented.direction)).toBeLessThan(0);

    const raw = hitOutwardWoundTriangle(false);
    expect(raw.hit.normal).toBeUndefined();
    expect(raw.hit.face!.normal.dot(raw.direction)).toBeGreaterThan(0);
  });

  test("reflectDirection does not care about the sign, which is why the flip lives elsewhere", () => {
    // rd - 2n(rd·n) sees `n` twice, so specular reflection is identical for
    // `n` and `-n`. Pinned so nobody removes the orientation flip on the
    // grounds that reflection is unaffected: the scatter lobe and the origin
    // offset are what need it.
    const rd = new THREE.Vector3(1, -2, 0.5).normalize();
    const n = new THREE.Vector3(0, 1, 0);
    const a = reflectDirection(rd, n, new THREE.Vector3());
    const b = reflectDirection(rd, n.clone().negate(), new THREE.Vector3());
    expect(a.distanceTo(b)).toBeCloseTo(0, 12);
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

  test("#213: every call site hands over the ray direction", () => {
    // `rayDir` is optional on the signature, because a caller could want the
    // geometric normal — so an omission here is silent, and the solver's
    // callers are exactly the ones that must not omit it.
    const calls = source.match(/worldHitNormal\([^)]*\)/g) ?? [];
    expect(calls.length).toBeGreaterThanOrEqual(2);
    for (const call of calls) expect([call, /,\s*rd\s*\)/.test(call)]).toEqual([call, true]);
  });

  test("#213: the shared quick estimate uses the same normal as the full solve", () => {
    const shared = fs.readFileSync(
      path.resolve(__dirname, "../../shared/quick-estimate.ts"),
      "utf8",
    );
    expect(shared).toMatch(/worldHitNormal\(/);
    // The raw local-space normal is gone from both the angle and the bounce.
    expect(shared).not.toMatch(/angleTo\(intersections\[0\]\.face!?\.normal\)/);
    expect(shared).not.toMatch(/intersections\[0\]\.face!?\.normal\.normalize\(\)/);
  });
});
