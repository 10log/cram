/**
 * Triangulation tests.
 *
 * Two properties do the heavy lifting:
 *
 * - **Winding.** Every emitted triangle must agree with its face's normal,
 *   because the raytracer reads that normal and an inverted room fails silently.
 * - **Area conservation.** The triangles' areas must sum to the polygon's area.
 *   For a simple polygon that is a strong statement: it rules out both gaps and
 *   overlaps, which is exactly how a naive fan triangulation breaks on concave
 *   outlines like an L-shaped room.
 */

import { describe, it, expect } from 'vitest';
import {
  triangulateFace,
  triangulatedPositions,
  triangulateMesh,
  type Triangle,
} from '../triangulate';
import {
  faceNormal,
  findFace,
  type Face,
  type RoomMesh,
  type Vec3,
} from '../room-mesh';
import { floorplanToMesh, validateFloorplan, type Point2 } from '../floorplan';

const SHOEBOX: Point2[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];

/**
 * 4x4 square with the top-right 2x2 removed. Area 12.
 *
 * Deliberately started at (4,2) rather than the origin. An L-shape is
 * star-shaped from its corner vertices, so a fan from (0,0) happens to stay
 * inside the outline and would pass the area check by luck; fanning from (4,2)
 * escapes into the missing bite. Starting here makes the fixture discriminate.
 */
const L_SHAPE: Point2[] = [
  { x: 4, y: 2 },
  { x: 2, y: 2 },
  { x: 2, y: 4 },
  { x: 0, y: 4 },
  { x: 0, y: 0 },
  { x: 4, y: 0 },
];

/** 6x4 rectangle with two 1x3 notches cut down from the top. Area 18. */
const COMB: Point2[] = [
  { x: 0, y: 0 },
  { x: 6, y: 0 },
  { x: 6, y: 4 },
  { x: 5, y: 4 },
  { x: 5, y: 1 },
  { x: 4, y: 1 },
  { x: 4, y: 4 },
  { x: 3, y: 4 },
  { x: 3, y: 1 },
  { x: 2, y: 1 },
  { x: 2, y: 4 },
  { x: 0, y: 4 },
];

const room = (points: Point2[], height = 2.5): RoomMesh => floorplanToMesh({ points, height });

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function triangleArea(mesh: RoomMesh, tri: Triangle): number {
  const [a, b, c] = tri.map((i) => mesh.vertices[i]);
  const n = cross(sub(b, a), sub(c, a));
  return Math.hypot(n[0], n[1], n[2]) / 2;
}

function triangleNormal(mesh: RoomMesh, tri: Triangle): Vec3 {
  const [a, b, c] = tri.map((i) => mesh.vertices[i]);
  const n = cross(sub(b, a), sub(c, a));
  const len = Math.hypot(n[0], n[1], n[2]);
  return len === 0 ? [0, 0, 0] : [n[0] / len, n[1] / len, n[2] / len];
}

/** Polygon area via the magnitude of Newell's vector. Works for any planar loop. */
function polygonArea(mesh: RoomMesh, face: Face): number {
  let nx = 0;
  let ny = 0;
  let nz = 0;
  const pts = face.loop.map((i) => mesh.vertices[i]);
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    nx += (a[1] - b[1]) * (a[2] + b[2]);
    ny += (a[2] - b[2]) * (a[0] + b[0]);
    nz += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return Math.hypot(nx, ny, nz) / 2;
}

describe('fixtures', () => {
  it.each([
    ['L_SHAPE', L_SHAPE],
    ['COMB', COMB],
  ])('%s is a valid floorplan', (_name, points) => {
    expect(validateFloorplan({ points, height: 2.5 })).toEqual([]);
  });

  it('L_SHAPE floor has the expected area', () => {
    const mesh = room(L_SHAPE);
    expect(polygonArea(mesh, findFace(mesh, 'floor')!)).toBeCloseTo(12);
  });

  it('COMB floor has the expected area', () => {
    const mesh = room(COMB);
    expect(polygonArea(mesh, findFace(mesh, 'floor')!)).toBeCloseTo(18);
  });
});

describe('triangulateFace', () => {
  describe('triangle count', () => {
    it('emits n-2 triangles for a convex quad', () => {
      const mesh = room(SHOEBOX);
      expect(triangulateFace(mesh, findFace(mesh, 'floor')!)).toHaveLength(2);
    });

    it('emits n-2 triangles for a concave L-shape', () => {
      const mesh = room(L_SHAPE);
      expect(triangulateFace(mesh, findFace(mesh, 'floor')!)).toHaveLength(4);
    });

    it('emits n-2 triangles for a 12-sided comb', () => {
      const mesh = room(COMB);
      expect(triangulateFace(mesh, findFace(mesh, 'floor')!)).toHaveLength(10);
    });

    it('emits n-2 triangles for every face of every room', () => {
      for (const points of [SHOEBOX, L_SHAPE, COMB]) {
        const mesh = room(points);
        for (const face of mesh.faces) {
          expect(triangulateFace(mesh, face), face.id).toHaveLength(face.loop.length - 2);
        }
      }
    });
  });

  describe('winding', () => {
    it('agrees with the face normal on a convex floor', () => {
      const mesh = room(SHOEBOX);
      const floor = findFace(mesh, 'floor')!;
      for (const tri of triangulateFace(mesh, floor)) {
        expect(dot(triangleNormal(mesh, tri), faceNormal(mesh, floor))).toBeCloseTo(1);
      }
    });

    it('agrees with the face normal on a concave floor', () => {
      const mesh = room(L_SHAPE);
      const floor = findFace(mesh, 'floor')!;
      for (const tri of triangulateFace(mesh, floor)) {
        expect(dot(triangleNormal(mesh, tri), faceNormal(mesh, floor))).toBeCloseTo(1);
      }
    });

    it('agrees with the face normal on every face of every room', () => {
      // The end-to-end guarantee: inward normals established by the generator
      // survive the trip through triangulation.
      for (const points of [SHOEBOX, L_SHAPE, COMB]) {
        const mesh = room(points);
        for (const face of mesh.faces) {
          const fn = faceNormal(mesh, face);
          for (const tri of triangulateFace(mesh, face)) {
            expect(dot(triangleNormal(mesh, tri), fn), `${face.id}`).toBeCloseTo(1);
          }
        }
      }
    });

    it('keeps walls facing inward', () => {
      const mesh = room(SHOEBOX);
      const interior: Vec3 = [2, 1.5, 1.25];
      for (const face of mesh.faces) {
        for (const tri of triangulateFace(mesh, face)) {
          const [a] = tri.map((i) => mesh.vertices[i]);
          expect(dot(triangleNormal(mesh, tri), sub(interior, a)), face.id).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('area conservation', () => {
    it.each([
      ['convex', SHOEBOX],
      ['concave L', L_SHAPE],
      ['comb', COMB],
    ])('covers the %s floor exactly, with no gaps or overlaps', (_name, points) => {
      const mesh = room(points);
      const floor = findFace(mesh, 'floor')!;
      const total = triangulateFace(mesh, floor).reduce(
        (sum, tri) => sum + triangleArea(mesh, tri),
        0
      );
      expect(total).toBeCloseTo(polygonArea(mesh, floor));
    });

    it('covers every face of a concave room exactly', () => {
      const mesh = room(L_SHAPE);
      for (const face of mesh.faces) {
        const total = triangulateFace(mesh, face).reduce(
          (sum, tri) => sum + triangleArea(mesh, tri),
          0
        );
        expect(total, face.id).toBeCloseTo(polygonArea(mesh, face));
      }
    });

    it('emits no zero-area triangles for a well-formed room', () => {
      const mesh = room(COMB);
      for (const face of mesh.faces) {
        for (const tri of triangulateFace(mesh, face)) {
          expect(triangleArea(mesh, tri), face.id).toBeGreaterThan(1e-9);
        }
      }
    });
  });

  describe('index integrity', () => {
    it('only emits indices drawn from the face loop', () => {
      const mesh = room(COMB);
      for (const face of mesh.faces) {
        const allowed = new Set(face.loop);
        for (const tri of triangulateFace(mesh, face)) {
          for (const id of tri) expect(allowed.has(id), `${face.id}/${id}`).toBe(true);
        }
      }
    });

    it('uses every vertex of the loop at least once', () => {
      const mesh = room(L_SHAPE);
      for (const face of mesh.faces) {
        const used = new Set(triangulateFace(mesh, face).flat());
        expect(new Set(face.loop), face.id).toEqual(used);
      }
    });

    it('never repeats an index within one triangle', () => {
      const mesh = room(COMB);
      for (const face of mesh.faces) {
        for (const tri of triangulateFace(mesh, face)) {
          expect(new Set(tri).size).toBe(3);
        }
      }
    });
  });

  describe('degenerate input', () => {
    const manual = (vertices: Vec3[], loop: number[]): RoomMesh => ({
      vertices,
      faces: [{ id: 'f', name: 'F', loop }],
      source: { kind: 'manual' },
    });

    it('returns nothing for a loop with fewer than 3 vertices', () => {
      const mesh = manual([[0, 0, 0], [1, 0, 0]], [0, 1]);
      expect(triangulateFace(mesh, mesh.faces[0])).toEqual([]);
    });

    it('returns nothing for a collinear 3-vertex loop', () => {
      const mesh = manual([[0, 0, 0], [1, 0, 0], [2, 0, 0]], [0, 1, 2]);
      expect(triangulateFace(mesh, mesh.faces[0])).toEqual([]);
    });

    it('returns nothing for a collinear 4-vertex loop', () => {
      const mesh = manual([[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]], [0, 1, 2, 3]);
      expect(triangulateFace(mesh, mesh.faces[0])).toEqual([]);
    });

    it('passes a non-degenerate triangle straight through', () => {
      const mesh = manual([[0, 0, 0], [1, 0, 0], [0, 1, 0]], [0, 1, 2]);
      expect(triangulateFace(mesh, mesh.faces[0])).toEqual([[0, 1, 2]]);
    });

    it('terminates on a self-touching loop instead of hanging', () => {
      // floorplanToMesh rejects this, but a hand-edited mesh could reach here.
      const mesh = manual(
        [[0, 0, 0], [4, 4, 0], [4, 0, 0], [0, 4, 0]],
        [0, 1, 2, 3]
      );
      const tris = triangulateFace(mesh, mesh.faces[0]);
      expect(tris.length).toBeLessThanOrEqual(2);
    });

    it('handles a face in an arbitrary plane, not just axis-aligned', () => {
      const mesh = manual(
        [[0, 0, 0], [1, 1, 1], [0, 2, 2], [-1, 1, 1]],
        [0, 1, 2, 3]
      );
      const tris = triangulateFace(mesh, mesh.faces[0]);
      expect(tris).toHaveLength(2);
      const fn = faceNormal(mesh, mesh.faces[0]);
      for (const tri of tris) {
        expect(dot(triangleNormal(mesh, tri), fn)).toBeCloseTo(1);
      }
    });
  });
});

describe('triangulatedPositions', () => {
  it('emits 9 numbers per triangle', () => {
    const mesh = room(L_SHAPE);
    const floor = findFace(mesh, 'floor')!;
    expect(triangulatedPositions(mesh, floor)).toHaveLength(
      triangulateFace(mesh, floor).length * 9
    );
  });

  it('emits the actual vertex coordinates in triangle order', () => {
    const mesh = room(SHOEBOX);
    const floor = findFace(mesh, 'floor')!;
    const tris = triangulateFace(mesh, floor);
    const expected = tris.flatMap((tri) => tri.flatMap((id) => mesh.vertices[id]));
    expect(triangulatedPositions(mesh, floor)).toEqual(expected);
  });

  it('is empty for a degenerate face', () => {
    const mesh: RoomMesh = {
      vertices: [[0, 0, 0], [1, 0, 0]],
      faces: [{ id: 'f', name: 'F', loop: [0, 1] }],
      source: { kind: 'manual' },
    };
    expect(triangulatedPositions(mesh, mesh.faces[0])).toEqual([]);
  });
});

describe('triangulateMesh', () => {
  it('keys results by stable face id', () => {
    const mesh = room(SHOEBOX);
    const result = triangulateMesh(mesh);
    expect([...result.keys()]).toEqual(mesh.faces.map((f) => f.id));
  });

  it('matches per-face triangulation', () => {
    const mesh = room(L_SHAPE);
    const result = triangulateMesh(mesh);
    for (const face of mesh.faces) {
      expect(result.get(face.id)).toEqual(triangulateFace(mesh, face));
    }
  });

  it('covers the whole room surface area', () => {
    const mesh = room(L_SHAPE);
    const total = [...triangulateMesh(mesh).values()]
      .flat()
      .reduce((sum, tri) => sum + triangleArea(mesh, tri), 0);
    const expected = mesh.faces.reduce((sum, f) => sum + polygonArea(mesh, f), 0);
    expect(total).toBeCloseTo(expected);
  });
});
