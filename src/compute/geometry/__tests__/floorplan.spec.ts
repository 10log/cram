/**
 * Floorplan generator tests.
 *
 * The two properties worth defending here are welding (an n-point outline must
 * produce exactly 2n shared vertices) and winding (every face normal must point
 * into the room, because the raytracer reads it).
 */

import { describe, it, expect } from 'vitest';
import {
  signedArea,
  normalizeWinding,
  validateFloorplan,
  floorplanToMesh,
  type Point2,
  type FloorplanParams,
} from '../floorplan';
import { faceNormal, faceCentroid, facesTouchingVertex, type Vec3 } from '../room-mesh';

/** 4 x 3 room, drawn counter-clockwise. */
const SHOEBOX: Point2[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];

/** L-shaped room: a 4x4 square with a 2x2 bite taken out. Concave. */
const L_SHAPE: Point2[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 2 },
  { x: 2, y: 2 },
  { x: 2, y: 4 },
  { x: 0, y: 4 },
];

const plan = (points: Point2[], height = 2.5, baseZ?: number): FloorplanParams => ({
  points,
  height,
  ...(baseZ === undefined ? {} : { baseZ }),
});

function expectVec3Close(actual: Vec3, expected: Vec3, precision = 9) {
  expect(actual[0]).toBeCloseTo(expected[0], precision);
  expect(actual[1]).toBeCloseTo(expected[1], precision);
  expect(actual[2]).toBeCloseTo(expected[2], precision);
}

describe('signedArea', () => {
  it('is positive for a counter-clockwise outline', () => {
    expect(signedArea(SHOEBOX)).toBeCloseTo(12);
  });

  it('is negative for a clockwise outline', () => {
    expect(signedArea([...SHOEBOX].reverse())).toBeCloseTo(-12);
  });

  it('computes the area of a concave outline', () => {
    // 4x4 square less a 2x2 corner
    expect(signedArea(L_SHAPE)).toBeCloseTo(12);
  });

  it('is zero for collinear points', () => {
    expect(signedArea([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }])).toBeCloseTo(0);
  });
});

describe('normalizeWinding', () => {
  it('leaves a counter-clockwise outline alone', () => {
    expect(normalizeWinding(SHOEBOX)).toEqual(SHOEBOX);
  });

  it('flips a clockwise outline to counter-clockwise', () => {
    expect(signedArea(normalizeWinding([...SHOEBOX].reverse()))).toBeGreaterThan(0);
  });

  it('keeps point 0 in place when flipping, so corner identity is stable', () => {
    const clockwise = [...SHOEBOX].reverse();
    const fixed = normalizeWinding(clockwise);
    expect(fixed[0]).toEqual(clockwise[0]);
  });

  it('does not mutate its input', () => {
    const input = [...SHOEBOX].reverse();
    const snapshot = JSON.stringify(input);
    normalizeWinding(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});

describe('validateFloorplan', () => {
  it('accepts a well-formed plan', () => {
    expect(validateFloorplan(plan(SHOEBOX))).toEqual([]);
  });

  it('accepts a concave plan', () => {
    expect(validateFloorplan(plan(L_SHAPE))).toEqual([]);
  });

  it('rejects fewer than 3 points', () => {
    const issues = validateFloorplan(plan([{ x: 0, y: 0 }, { x: 1, y: 0 }]));
    expect(issues.map((i) => i.code)).toContain('too-few-points');
  });

  it.each([0, -1, NaN, Infinity])('rejects height %p', (height) => {
    const issues = validateFloorplan(plan(SHOEBOX, height));
    expect(issues.map((i) => i.code)).toContain('invalid-height');
  });

  it('rejects consecutive duplicate points', () => {
    const issues = validateFloorplan(
      plan([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }])
    );
    const dup = issues.find((i) => i.code === 'duplicate-point');
    expect(dup).toBeDefined();
    expect(dup).toMatchObject({ index: 1 });
  });

  it('explains that the loop closes automatically when the first point is repeated', () => {
    const issues = validateFloorplan(
      plan([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 0 }])
    );
    const dup = issues.find((i) => i.code === 'duplicate-point');
    expect(dup?.message).toMatch(/closes automatically/);
  });

  it.each([
    ['NaN x', [{ x: NaN, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }]],
    ['Infinite y', [{ x: 0, y: Infinity }, { x: 4, y: 0 }, { x: 4, y: 3 }]],
    ['a missing coordinate', [{ x: 0 } as Point2, { x: 4, y: 0 }, { x: 4, y: 3 }]],
  ])('rejects %s', (_name, points) => {
    expect(validateFloorplan(plan(points as Point2[])).map((i) => i.code)).toContain('non-finite');
  });

  it('reports which point is non-finite', () => {
    const issues = validateFloorplan(
      plan([{ x: 0, y: 0 }, { x: NaN, y: 0 }, { x: 4, y: 3 }])
    );
    expect(issues.find((i) => i.code === 'non-finite')).toMatchObject({ index: 1 });
  });

  it('rejects a non-finite baseZ', () => {
    const issues = validateFloorplan({ points: SHOEBOX, height: 2.5, baseZ: NaN });
    expect(issues.map((i) => i.code)).toContain('non-finite');
  });

  it('does not emit NaN geometry for a non-finite outline', () => {
    // Without the finiteness check these flowed through to BufferGeometry.
    expect(() =>
      floorplanToMesh(plan([{ x: NaN, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }]))
    ).toThrow(/numeric coordinates/);
  });

  it('rejects a collinear outline as enclosing no area', () => {
    const issues = validateFloorplan(
      plan([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }])
    );
    expect(issues.map((i) => i.code)).toContain('zero-area');
  });

  it('rejects a self-intersecting bowtie', () => {
    const bowtie: Point2[] = [
      { x: 0, y: 0 },
      { x: 5, y: 4 },
      { x: 5, y: 0 },
      { x: 0, y: 3 },
    ];
    const issues = validateFloorplan(plan(bowtie));
    expect(issues.map((i) => i.code)).toContain('self-intersecting');
  });

  it('calls a symmetric bowtie crossed rather than empty', () => {
    // Its lobes cancel to zero signed area, so the area check would otherwise
    // win the race and report a true but useless "encloses no area".
    const symmetric: Point2[] = [
      { x: 0, y: 0 },
      { x: 4, y: 4 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
    ];
    expect(signedArea(symmetric)).toBeCloseTo(0);
    expect(validateFloorplan(plan(symmetric)).map((i) => i.code)).toEqual(['self-intersecting']);
  });

  it('does not flag neighbouring walls for sharing a corner', () => {
    expect(validateFloorplan(plan(SHOEBOX)).map((i) => i.code)).not.toContain(
      'self-intersecting'
    );
  });

  it('reports every problem at once rather than stopping at the first', () => {
    const issues = validateFloorplan(plan([{ x: 0, y: 0 }, { x: 1, y: 0 }], 0));
    expect(issues.map((i) => i.code)).toEqual(
      expect.arrayContaining(['too-few-points', 'invalid-height'])
    );
  });
});

describe('floorplanToMesh', () => {
  it('throws on an invalid plan, naming the reason', () => {
    expect(() => floorplanToMesh(plan(SHOEBOX, -1))).toThrow(/height must be a positive number/);
  });

  describe('welding', () => {
    it('emits exactly 2n vertices for an n-point outline', () => {
      expect(floorplanToMesh(plan(SHOEBOX)).vertices).toHaveLength(8);
      expect(floorplanToMesh(plan(L_SHAPE)).vertices).toHaveLength(12);
    });

    it('shares each floor corner between the floor and two walls', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX));
      for (let v = 0; v < 4; v++) {
        const ids = facesTouchingVertex(mesh, v).map((f) => f.id);
        expect(ids).toHaveLength(3);
        expect(ids).toContain('floor');
      }
    });

    it('shares each ceiling corner between the ceiling and two walls', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX));
      for (let v = 4; v < 8; v++) {
        const ids = facesTouchingVertex(mesh, v).map((f) => f.id);
        expect(ids).toHaveLength(3);
        expect(ids).toContain('ceiling');
      }
    });

    it('places the ceiling ring at n + i for outline point i', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX, 2.5));
      const n = SHOEBOX.length;
      for (let i = 0; i < n; i++) {
        const floorV = mesh.vertices[i];
        const ceilV = mesh.vertices[n + i];
        expect(ceilV[0]).toBeCloseTo(floorV[0]);
        expect(ceilV[1]).toBeCloseTo(floorV[1]);
        expect(ceilV[2] - floorV[2]).toBeCloseTo(2.5);
      }
    });

    it('never repeats a position across the vertex list', () => {
      const mesh = floorplanToMesh(plan(L_SHAPE));
      const keys = mesh.vertices.map((v) => v.join(','));
      expect(new Set(keys).size).toBe(keys.length);
    });
  });

  describe('faces', () => {
    it('produces one wall per outline segment, plus floor and ceiling', () => {
      const mesh = floorplanToMesh(plan(L_SHAPE));
      expect(mesh.faces).toHaveLength(L_SHAPE.length + 2);
      expect(mesh.faces.map((f) => f.id)).toEqual([
        'floor',
        'ceiling',
        'wall-0',
        'wall-1',
        'wall-2',
        'wall-3',
        'wall-4',
        'wall-5',
      ]);
    });

    it('gives walls 1-based display names', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX));
      expect(mesh.faces.find((f) => f.id === 'wall-0')?.name).toBe('Wall 1');
    });

    it('keeps face ids stable when only the height changes', () => {
      // This is the hook that lets acoustic material assignments survive an edit.
      const a = floorplanToMesh(plan(SHOEBOX, 2.5)).faces.map((f) => f.id);
      const b = floorplanToMesh(plan(SHOEBOX, 4.0)).faces.map((f) => f.id);
      expect(b).toEqual(a);
    });

    it('gives every wall a 4-vertex loop', () => {
      const mesh = floorplanToMesh(plan(L_SHAPE));
      for (const face of mesh.faces.filter((f) => f.id.startsWith('wall-'))) {
        expect(face.loop).toHaveLength(4);
      }
    });

    it('gives floor and ceiling one vertex per outline point', () => {
      const mesh = floorplanToMesh(plan(L_SHAPE));
      expect(mesh.faces.find((f) => f.id === 'floor')!.loop).toHaveLength(6);
      expect(mesh.faces.find((f) => f.id === 'ceiling')!.loop).toHaveLength(6);
    });
  });

  describe('winding — normals must point into the room', () => {
    it('points the floor up', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX));
      expectVec3Close(faceNormal(mesh, mesh.faces[0]), [0, 0, 1]);
    });

    it('points the ceiling down', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX));
      expectVec3Close(faceNormal(mesh, mesh.faces[1]), [0, 0, -1]);
    });

    it('points every wall toward the interior of a convex room', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX));
      const interior: Vec3 = [2, 1.5, 1.25];
      for (const face of mesh.faces) {
        const n = faceNormal(mesh, face);
        const c = faceCentroid(mesh, face);
        const toInterior: Vec3 = [interior[0] - c[0], interior[1] - c[1], interior[2] - c[2]];
        const dot = n[0] * toInterior[0] + n[1] * toInterior[1] + n[2] * toInterior[2];
        expect(dot, `face ${face.id} faces outward`).toBeGreaterThan(0);
      }
    });

    it('applies the same winding rule on a concave room', () => {
      // Containment reasoning breaks down on concave solids, so check each wall
      // against the inward direction implied by its own edge: (-dy, dx).
      const mesh = floorplanToMesh(plan(L_SHAPE));
      const pts = (mesh.source as { params: FloorplanParams }).params.points;
      const n = pts.length;
      for (let i = 0; i < n; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % n];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy);
        const expected: Vec3 = [-dy / len, dx / len, 0];
        const face = mesh.faces.find((f) => f.id === `wall-${i}`)!;
        expectVec3Close(faceNormal(mesh, face), expected, 6);
      }
    });

    it('produces inward normals even when the outline is drawn clockwise', () => {
      const mesh = floorplanToMesh(plan([...SHOEBOX].reverse()));
      expectVec3Close(faceNormal(mesh, mesh.faces[0]), [0, 0, 1]);
      expectVec3Close(faceNormal(mesh, mesh.faces[1]), [0, 0, -1]);
    });

    it('yields an identical mesh when the same corner is drawn in either direction', () => {
      const ccw = floorplanToMesh(plan(SHOEBOX));
      // Same starting corner, opposite direction.
      const cw = floorplanToMesh(plan([SHOEBOX[0], ...SHOEBOX.slice(1).reverse()]));
      expect(cw.vertices).toEqual(ccw.vertices);
      expect(cw.faces).toEqual(ccw.faces);
    });

    it('rotates rather than reorders when drawing starts at a different corner', () => {
      // Winding is normalised but the starting corner is preserved, so vertex 0
      // is wherever the user began. The room is the same shape; only the
      // labelling differs. Worth pinning — it decides which wall is "wall-0".
      const ccw = floorplanToMesh(plan(SHOEBOX));
      const started3 = floorplanToMesh(plan([...SHOEBOX].reverse()));

      expect(started3.vertices[0]).toEqual([0, 3, 0]);
      expect(new Set(started3.vertices.map(String))).toEqual(
        new Set(ccw.vertices.map(String))
      );
      // Still a sealed room with inward normals, just relabelled.
      expectVec3Close(faceNormal(started3, started3.faces[0]), [0, 0, 1]);
    });
  });

  describe('elevation', () => {
    it('puts the floor at z = 0 by default', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX, 2.5));
      expect(mesh.vertices.slice(0, 4).every((v) => v[2] === 0)).toBe(true);
      expect(mesh.vertices.slice(4).every((v) => v[2] === 2.5)).toBe(true);
    });

    it('honours an explicit baseZ', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX, 2.5, 10));
      expect(mesh.vertices.slice(0, 4).every((v) => v[2] === 10)).toBe(true);
      expect(mesh.vertices.slice(4).every((v) => v[2] === 12.5)).toBe(true);
    });
  });

  describe('source', () => {
    it('records the plan it was generated from, not yet detached', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX, 2.5));
      expect(mesh.source).toMatchObject({ kind: 'floorplan', detached: false });
    });

    it('stores the winding-normalised points, so regeneration is stable', () => {
      const mesh = floorplanToMesh(plan([...SHOEBOX].reverse()));
      const stored = (mesh.source as { params: FloorplanParams }).params.points;
      expect(signedArea(stored)).toBeGreaterThan(0);
    });

    it('resolves baseZ to a concrete value', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX));
      expect((mesh.source as { params: FloorplanParams }).params.baseZ).toBe(0);
    });

    it('round-trips: regenerating from stored params reproduces the mesh', () => {
      const mesh = floorplanToMesh(plan(SHOEBOX));
      const again = floorplanToMesh((mesh.source as { params: FloorplanParams }).params);
      expect(again.vertices).toEqual(mesh.vertices);
      expect(again.faces).toEqual(mesh.faces);
    });
  });
});
