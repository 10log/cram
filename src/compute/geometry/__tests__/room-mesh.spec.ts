/**
 * RoomMesh topology tests.
 *
 * These cover the part that exists specifically so 3D vertex editing can land
 * later: shared vertices, immutable edits, and provenance tracking.
 */

import { describe, it, expect } from 'vitest';
import {
  applyEdit,
  faceCentroid,
  faceNormal,
  faceVertices,
  facesTouchingVertex,
  findFace,
  type RoomMesh,
  type Vec3,
} from '../room-mesh';
import { floorplanToMesh, type Point2 } from '../floorplan';
import { floorplanSource } from '../room-mesh';

const SHOEBOX: Point2[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];

const shoebox = (height = 2.5): RoomMesh => floorplanToMesh({ points: SHOEBOX, height });

describe('faceVertices', () => {
  it('resolves a loop to positions in loop order', () => {
    const mesh = shoebox();
    const floor = findFace(mesh, 'floor')!;
    expect(faceVertices(mesh, floor)).toEqual([
      [0, 0, 0],
      [4, 0, 0],
      [4, 3, 0],
      [0, 3, 0],
    ]);
  });
});

describe('faceCentroid', () => {
  it('averages the loop vertices', () => {
    const mesh = shoebox();
    expect(faceCentroid(mesh, findFace(mesh, 'floor')!)).toEqual([2, 1.5, 0]);
  });

  it('sits at mid-height for a wall', () => {
    const mesh = shoebox(2.5);
    expect(faceCentroid(mesh, findFace(mesh, 'wall-0')!)[2]).toBeCloseTo(1.25);
  });
});

describe('faceNormal', () => {
  it('returns a unit vector', () => {
    const mesh = shoebox();
    for (const face of mesh.faces) {
      const n = faceNormal(mesh, face);
      expect(Math.hypot(n[0], n[1], n[2])).toBeCloseTo(1);
    }
  });

  it('returns a zero vector for a degenerate loop rather than NaN', () => {
    const mesh: RoomMesh = {
      vertices: [
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0],
      ],
      faces: [{ id: 'flat', name: 'Flat', loop: [0, 1, 2] }],
      source: { kind: 'manual' },
    };
    expect(faceNormal(mesh, mesh.faces[0])).toEqual([0, 0, 0]);
  });
});

describe('findFace', () => {
  it('finds a face by id', () => {
    expect(findFace(shoebox(), 'wall-2')?.name).toBe('Wall 3');
  });

  it('returns undefined for an unknown id', () => {
    expect(findFace(shoebox(), 'wall-99')).toBeUndefined();
  });
});

describe('facesTouchingVertex', () => {
  it('finds all three faces meeting at a corner', () => {
    const mesh = shoebox();
    expect(facesTouchingVertex(mesh, 0).map((f) => f.id).sort()).toEqual([
      'floor',
      'wall-0',
      'wall-3',
    ]);
  });

  it('returns nothing for an unreferenced index', () => {
    expect(facesTouchingVertex(shoebox(), 999)).toEqual([]);
  });
});

describe('applyEdit — move-vertex', () => {
  it('moves the requested vertex', () => {
    const mesh = shoebox();
    const next = applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [-1, -2, 0] });
    expect(next.vertices[0]).toEqual([-1, -2, 0]);
  });

  it('moves the corner for every face that shares it', () => {
    // The whole reason topology is the source of truth rather than triangles.
    const mesh = shoebox();
    const moved: Vec3 = [-1, -2, 0];
    const next = applyEdit(mesh, { kind: 'move-vertex', id: 0, to: moved });

    for (const face of facesTouchingVertex(next, 0)) {
      expect(faceVertices(next, face)).toContainEqual(moved);
    }
    expect(facesTouchingVertex(next, 0)).toHaveLength(3);
  });

  it('leaves other vertices untouched', () => {
    const mesh = shoebox();
    const next = applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [-1, -2, 0] });
    expect(next.vertices.slice(1)).toEqual(mesh.vertices.slice(1));
  });

  it('does not mutate the input mesh', () => {
    const mesh = shoebox();
    const before = JSON.stringify(mesh);
    applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [9, 9, 9] });
    expect(JSON.stringify(mesh)).toBe(before);
  });

  it('preserves the face list', () => {
    const mesh = shoebox();
    const next = applyEdit(mesh, { kind: 'move-vertex', id: 2, to: [5, 5, 0] });
    expect(next.faces).toEqual(mesh.faces);
  });

  it('marks a floorplan-sourced mesh as detached, keeping the params', () => {
    const mesh = shoebox();
    const next = applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [-1, -2, 0] });
    expect(next.source).toMatchObject({ kind: 'floorplan', detached: true });
    expect((next.source as { params: unknown }).params).toEqual(
      (mesh.source as { params: unknown }).params
    );
  });

  it('leaves a manual mesh manual', () => {
    const mesh: RoomMesh = {
      vertices: [[0, 0, 0]],
      faces: [],
      source: { kind: 'manual' },
    };
    expect(applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [1, 1, 1] }).source).toEqual({
      kind: 'manual',
    });
  });

  it.each([-1, 8, 1.5, NaN])('rejects out-of-range vertex id %p', (id) => {
    expect(() => applyEdit(shoebox(), { kind: 'move-vertex', id, to: [0, 0, 0] })).toThrow(
      RangeError
    );
  });

  it('can flip a normal if a vertex is dragged through the face', () => {
    // Not a guarantee we make — just documenting that direct editing can break
    // the inward-normal invariant that the generator establishes.
    const mesh = shoebox();
    const before = faceNormal(mesh, findFace(mesh, 'floor')!);
    const next = applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [8, 6, 0] });
    const after = faceNormal(next, findFace(next, 'floor')!);
    expect(after).not.toEqual(before);
  });
});

describe('applyEdit — set-floorplan', () => {
  it('regenerates the mesh from new params', () => {
    const mesh = shoebox(2.5);
    const next = applyEdit(mesh, {
      kind: 'set-floorplan',
      params: { points: SHOEBOX, height: 4 },
    });
    expect(next.vertices[4][2]).toBeCloseTo(4);
  });

  it('keeps face ids, so material assignments can be carried over', () => {
    const mesh = shoebox(2.5);
    const next = applyEdit(mesh, {
      kind: 'set-floorplan',
      params: { points: SHOEBOX, height: 4 },
    });
    expect(next.faces.map((f) => f.id)).toEqual(mesh.faces.map((f) => f.id));
  });

  it('clears the detached flag, reattaching the mesh to its plan', () => {
    const detached = applyEdit(shoebox(), { kind: 'move-vertex', id: 0, to: [-1, -1, 0] });
    expect(detached.source).toMatchObject({ detached: true });

    const reattached = applyEdit(detached, {
      kind: 'set-floorplan',
      params: { points: SHOEBOX, height: 3 },
    });
    expect(reattached.source).toMatchObject({ kind: 'floorplan', detached: false });
  });

  it('propagates validation failures', () => {
    expect(() =>
      applyEdit(shoebox(), { kind: 'set-floorplan', params: { points: SHOEBOX, height: 0 } })
    ).toThrow(/invalid floorplan/);
  });
});

describe('floorplanSource', () => {
  it('returns the plan for a floorplan-sourced mesh', () => {
    const source = floorplanSource(shoebox(3))!;
    expect(source.detached).toBe(false);
    expect(source.params.height).toBe(3);
  });

  it('returns null for a manual mesh', () => {
    expect(floorplanSource({ vertices: [], faces: [], source: { kind: 'manual' } })).toBeNull();
  });

  describe('malformed provenance, which would crash the panel', () => {
    // draftFromPoints dereferences p.x, so anything that slips through here
    // takes the Sketch panel down instead of leaving the room non-editable.
    const withParams = (params: unknown): RoomMesh =>
      ({
        vertices: [],
        faces: [],
        source: { kind: 'floorplan', params, detached: false },
      }) as unknown as RoomMesh;

    it.each([
      ['a NaN height', { points: SHOEBOX, height: NaN }],
      ['an infinite height', { points: SHOEBOX, height: Infinity }],
      ['a NaN baseZ', { points: SHOEBOX, height: 3, baseZ: NaN }],
      ['a null point', { points: [null], height: 3 }],
      ['a point missing y', { points: [{ x: 1 }], height: 3 }],
      ['a NaN coordinate', { points: [{ x: NaN, y: 0 }], height: 3 }],
      ['no params at all', undefined],
      ['points that are not an array', { points: 'nope', height: 3 }],
    ])('returns null for %s', (_name, params) => {
      expect(floorplanSource(withParams(params))).toBeNull();
    });
  });
});

describe('applyEdit — move-vertex destination validation', () => {
  it.each([
    ['NaN', [NaN, 0, 0]],
    ['Infinity', [0, Infinity, 0]],
    ['too few components', [0, 0]],
  ])('rejects a destination containing %s', (_name, to) => {
    expect(() =>
      applyEdit(shoebox(), { kind: 'move-vertex', id: 0, to: to as Vec3 })
    ).toThrow(TypeError);
  });

  it('leaves the mesh untouched when the destination is rejected', () => {
    const mesh = shoebox();
    const before = JSON.stringify(mesh);
    expect(() => applyEdit(mesh, { kind: 'move-vertex', id: 0, to: [NaN, 0, 0] })).toThrow();
    expect(JSON.stringify(mesh)).toBe(before);
  });
});
