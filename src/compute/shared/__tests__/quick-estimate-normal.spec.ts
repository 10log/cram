/**
 * Issue #213: the shared RT60 quick estimate — used by both the ray tracer and
 * the beam tracer — reads its hit normal in world space, facing the ray.
 *
 * It used raw `intersection.face.normal`, which is object-local and unoriented,
 * for both the incidence angle fed to `reflectionFunction` and the direction of
 * the next bounce. On a surface with a non-identity transform that is a
 * different room: a head-on hit reads as 90° grazing, and the ray is mirrored
 * about a normal pointing somewhere else.
 *
 * The two arms below are the same room in world space. One stores its walls in
 * world coordinates, the other in a rotated and translated frame that the mesh
 * matrix puts back. Nothing else differs, so any gap between their RT60s is the
 * transform being ignored.
 */

import * as THREE from "three";
import { reflectionCoefficient } from "../../acoustics/reflection-coefficient";
import { quickEstimateStep } from "../quick-estimate";

const ROOM = { lx: 5, ly: 4, lz: 3 } as const;
const ALPHA = 0.2;
const FREQUENCIES = [1000];

/** A fixed, arbitrary non-identity frame, shared by every wall of the framed arm. */
function wallFrame(): THREE.Matrix4 {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(6.2, -1.7, 4.3),
    new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(-0.4, 0.6, 0.7).normalize(),
      0.9,
    ),
    new THREE.Vector3(1, 1, 1),
  );
}

/**
 * One wall, wound inward, optionally stored in its own frame.
 *
 * Duck-typed rather than a real `Surface`: `quickEstimateStep` needs `kind`
 * and `reflectionFunction`, and the class pulls in a dependency chain jsdom
 * cannot load.
 */
function wall(
  corners: readonly [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3],
  centre: THREE.Vector3,
  transformed: boolean,
): THREE.Object3D {
  let [a, b, c, d] = corners;
  const normalOf = (p: THREE.Vector3, q: THREE.Vector3, r: THREE.Vector3) =>
    new THREE.Vector3()
      .subVectors(q, p)
      .cross(new THREE.Vector3().subVectors(r, p))
      .normalize();
  if (normalOf(a, b, c).dot(new THREE.Vector3().subVectors(centre, a)) < 0) {
    [a, b, c, d] = [d, c, b, a];
  }
  if (!(normalOf(a, b, c).dot(new THREE.Vector3().subVectors(centre, a)) > 0)) {
    throw new Error("fixture wall could not be wound inward");
  }

  const frame = transformed ? wallFrame() : null;
  const toLocal = frame ? frame.clone().invert() : null;
  const local = (p: THREE.Vector3) => (toLocal ? p.clone().applyMatrix4(toLocal) : p);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [a, b, c, a, c, d].map(local).flatMap((p) => [p.x, p.y, p.z]),
      3,
    ),
  );
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
  );
  if (frame) {
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(frame);
  }
  const group = new THREE.Group() as THREE.Group & Record<string, unknown>;
  group.add(mesh);
  group.kind = "surface";
  group.reflectionFunction = (_f: number, theta: number) =>
    reflectionCoefficient(ALPHA, theta);
  group.numHits = 0;
  group.updateMatrixWorld(true);
  return group;
}

function buildRoom(transformed: boolean): THREE.Object3D[] {
  const { lx, ly, lz } = ROOM;
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const centre = V(lx / 2, ly / 2, lz / 2);
  return [
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, 0, lz), V(0, 0, lz)], centre, transformed),
    wall([V(0, ly, 0), V(lx, ly, 0), V(lx, ly, lz), V(0, ly, lz)], centre, transformed),
    wall([V(0, 0, 0), V(0, ly, 0), V(0, ly, lz), V(0, 0, lz)], centre, transformed),
    wall([V(lx, 0, 0), V(lx, ly, 0), V(lx, ly, lz), V(lx, 0, lz)], centre, transformed),
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, ly, 0), V(0, ly, 0)], centre, transformed),
    wall([V(0, 0, lz), V(lx, 0, lz), V(lx, ly, lz), V(0, ly, lz)], centre, transformed),
  ];
}

/** Median RT60 over many rays, which is what the solvers average in the UI. */
function estimate(transformed: boolean, rays: number): number {
  const objects = buildRoom(transformed);
  const raycaster = new THREE.Raycaster();
  const source = new THREE.Vector3(ROOM.lx * 0.28, ROOM.ly * 0.55, ROOM.lz * 0.34);
  const values: number[] = [];
  for (let i = 0; i < rays; i++) {
    const { rt60s } = quickEstimateStep(raycaster, objects, source, 1, FREQUENCIES, 20);
    if (rt60s[0] > 0) values.push(rt60s[0]);
  }
  expect(values.length).toBeGreaterThan(rays * 0.8);
  values.sort((x, y) => x - y);
  return values[values.length >> 1];
}

describe("Issue #213: shared quick estimate reads the normal in world space", () => {
  it("gives the same RT60 whether or not the walls carry a transform", () => {
    const rays = 400;
    const plain = estimate(false, rays);
    const framed = estimate(true, rays);
    expect(Number.isFinite(plain)).toBe(true);
    expect(Number.isFinite(framed)).toBe(true);
    // Both arms are the same room, so this is scatter only. The bug moved it
    // by a factor, not a few percent: mirroring about a normal that is 90° out
    // does not make a room, it makes a random walk.
    expect([plain, framed, Math.abs(plain - framed) / plain < 0.15])
      .toEqual([plain, framed, true]);
  }, 120_000);

  it("is in the right ballpark, so the comparison is between two real rooms", () => {
    // Guards the case where both arms are equally wrong. Eyring for this room
    // at alpha = 0.2 is about 0.37 s; the estimate uses normal-incidence-ish
    // angles over few bounces, so it is a ballpark rather than a bracket.
    const plain = estimate(false, 400);
    expect(plain).toBeGreaterThan(0.1);
    expect(plain).toBeLessThan(1.5);
  }, 120_000);
});
