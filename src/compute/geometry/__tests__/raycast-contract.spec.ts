/**
 * Raycast contract — does generated geometry satisfy what the raytracer needs?
 *
 * The solver does not consume RoomMesh; it raycasts against three.js geometry
 * and reads `intersection.face.normal` (see compute/raytracer/ray-core.ts,
 * which takes `angleTo(face.normal)`). three.js derives that normal from
 * triangle winding, so this is the test that closes the loop from our loops,
 * through triangulation, into the value the physics actually uses.
 *
 * Two properties are checked, and they are the ones that would otherwise fail
 * silently — producing a room that looks correct and models wrong:
 *
 * - **Inward normals.** A ray travelling inside the room must hit a face whose
 *   normal points back at it.
 * - **Watertightness.** Crossing count parity: odd from inside, even from
 *   outside. A gap or a T-junction breaks this.
 *
 * Unlike its neighbours this spec imports three.js — it is verifying an
 * integration. The geometry modules themselves stay dependency-free.
 */

import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { triangulatedPositions } from '../triangulate';
import { floorplanToMesh, type Point2 } from '../floorplan';
import type { RoomMesh } from '../room-mesh';

const SHOEBOX: Point2[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];

const L_SHAPE: Point2[] = [
  { x: 4, y: 2 },
  { x: 2, y: 2 },
  { x: 2, y: 4 },
  { x: 0, y: 4 },
  { x: 0, y: 0 },
  { x: 4, y: 0 },
];

const HEIGHT = 2.5;

/** Every face welded into one mesh, the way a solver sees a whole room. */
function meshToThree(mesh: RoomMesh): THREE.Mesh {
  const positions: number[] = [];
  for (const face of mesh.faces) positions.push(...triangulatedPositions(mesh, face));

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.computeVertexNormals();

  // DoubleSide so back-facing hits still register — otherwise the parity check
  // would be measuring material culling rather than watertightness.
  return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
}

/** Deterministic unit directions; a fixed seed keeps failures reproducible. */
function directions(count: number): THREE.Vector3[] {
  let seed = 12345;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const out: THREE.Vector3[] = [];
  while (out.length < count) {
    const v = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1);
    if (v.lengthSq() < 1e-6) continue;
    out.push(v.normalize());
  }
  return out;
}

describe.each([
  ['shoebox', SHOEBOX, new THREE.Vector3(2, 1.5, 1.25)],
  ['L-shaped room', L_SHAPE, new THREE.Vector3(1, 1, 1.25)],
])('%s', (_name, points, interior) => {
  const mesh = floorplanToMesh({ points, height: HEIGHT });
  const object = meshToThree(mesh);

  it('is hit from the inside in every direction', () => {
    const raycaster = new THREE.Raycaster();
    for (const dir of directions(60)) {
      raycaster.set(interior, dir);
      expect(raycaster.intersectObject(object).length, `direction ${dir.toArray()}`)
        .toBeGreaterThan(0);
    }
  });

  it('presents an inward-facing normal to a ray leaving the room', () => {
    // The property the raytracer depends on: the surface faces the sound.
    const raycaster = new THREE.Raycaster();
    for (const dir of directions(60)) {
      raycaster.set(interior, dir);
      const hit = raycaster.intersectObject(object)[0];
      expect(hit?.face, `no face for ${dir.toArray()}`).toBeTruthy();
      expect(hit.face!.normal.dot(dir), `outward normal for ${dir.toArray()}`).toBeLessThan(0);
    }
  });

  it('is watertight: an interior ray crosses the boundary an odd number of times', () => {
    const raycaster = new THREE.Raycaster();
    for (const dir of directions(60)) {
      raycaster.set(interior, dir);
      const crossings = raycaster.intersectObject(object).length;
      expect(crossings % 2, `even crossings from inside along ${dir.toArray()}`).toBe(1);
    }
  });

  it('is watertight: an exterior ray crosses an even number of times', () => {
    const raycaster = new THREE.Raycaster();
    const outside = new THREE.Vector3(-50, -50, -50);
    for (const dir of directions(40)) {
      raycaster.set(outside, dir);
      const crossings = raycaster.intersectObject(object).length;
      expect(crossings % 2, `odd crossings from outside along ${dir.toArray()}`).toBe(0);
    }
  });

  it('encloses the volume implied by the floorplan', () => {
    object.geometry.computeBoundingBox();
    const box = object.geometry.boundingBox!;
    expect(box.min.z).toBeCloseTo(0);
    expect(box.max.z).toBeCloseTo(HEIGHT);
  });
});

describe('normals after an edit', () => {
  it('stays inward-facing when the height changes', () => {
    const mesh = floorplanToMesh({ points: SHOEBOX, height: 6 });
    const object = meshToThree(mesh);
    const raycaster = new THREE.Raycaster();
    const interior = new THREE.Vector3(2, 1.5, 3);

    for (const dir of directions(40)) {
      raycaster.set(interior, dir);
      const hit = raycaster.intersectObject(object)[0];
      expect(hit.face!.normal.dot(dir)).toBeLessThan(0);
    }
  });

  it('stays inward-facing for a room drawn clockwise', () => {
    const clockwise = [SHOEBOX[0], ...SHOEBOX.slice(1).reverse()];
    const object = meshToThree(floorplanToMesh({ points: clockwise, height: HEIGHT }));
    const raycaster = new THREE.Raycaster();
    const interior = new THREE.Vector3(2, 1.5, 1.25);

    for (const dir of directions(40)) {
      raycaster.set(interior, dir);
      const hit = raycaster.intersectObject(object)[0];
      expect(hit.face!.normal.dot(dir)).toBeLessThan(0);
    }
  });
});
