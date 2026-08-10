/**
 * Mesh userData tests.
 *
 * The load-bearing claim of step 7 is that a RoomMesh survives a save file
 * intact — JSON is the only thing between a drawn room and an editable one
 * after reload — and that a malformed mesh degrades to "not editable" rather
 * than taking the restore down with it.
 *
 * No mocks: mesh-userdata imports types only.
 */

import { describe, it, expect } from 'vitest';
import {
  FACE_ID_KEY,
  ROOM_MESH_KEY,
  getFaceId,
  getRoomMesh,
  isRoomMesh,
  setFaceId,
  setRoomMesh,
} from '../mesh-userdata';
import { floorplanToMesh, type Point2 } from '../../compute/geometry/floorplan';
import { applyEdit, faceNormal, findFace } from '../../compute/geometry/room-mesh';
import { triangulateFace } from '../../compute/geometry/triangulate';

const SHOEBOX: Point2[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];

const mesh = (height = 2.5) => floorplanToMesh({ points: SHOEBOX, height });

/** What a save/load cycle actually does to the value. */
const roundTrip = <T>(value: T): unknown => JSON.parse(JSON.stringify(value));

describe('face id', () => {
  it('round-trips through userData', () => {
    const object = { userData: {} as Record<string, unknown> };
    setFaceId(object, 'wall-2');
    expect(getFaceId(object)).toBe('wall-2');
    expect(object.userData[FACE_ID_KEY]).toBe('wall-2');
  });

  it('is undefined when unset', () => {
    expect(getFaceId({ userData: {} })).toBeUndefined();
  });

  it('is undefined when userData is missing entirely', () => {
    expect(getFaceId({})).toBeUndefined();
  });

  it('creates userData when absent', () => {
    const object: { userData?: Record<string, unknown> } = {};
    setFaceId(object, 'floor');
    expect(getFaceId(object)).toBe('floor');
  });

  it('ignores a non-string value', () => {
    expect(getFaceId({ userData: { [FACE_ID_KEY]: 42 } })).toBeUndefined();
  });
});

describe('room mesh', () => {
  it('round-trips through userData', () => {
    const object = { userData: {} as Record<string, unknown> };
    const m = mesh();
    setRoomMesh(object, m);
    expect(getRoomMesh(object)).toBe(m);
    expect(object.userData[ROOM_MESH_KEY]).toBe(m);
  });

  it('is undefined for an object that never had one', () => {
    expect(getRoomMesh({ userData: {} })).toBeUndefined();
  });

  it('creates userData when absent', () => {
    const object: { userData?: Record<string, unknown> } = {};
    setRoomMesh(object, mesh());
    expect(getRoomMesh(object)).toBeDefined();
  });
});

describe('isRoomMesh', () => {
  it('accepts a generated mesh', () => {
    expect(isRoomMesh(mesh())).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a string', 'mesh'],
    ['a number', 7],
    ['an empty object', {}],
    ['missing faces', { vertices: [[0, 0, 0]] }],
    ['missing vertices', { faces: [] }],
    ['vertices that are not triples', { vertices: [[0, 0]], faces: [] }],
    ['vertices that are not arrays', { vertices: [{ x: 0 }], faces: [] }],
    ['a face without an id', { vertices: [], faces: [{ loop: [0, 1, 2] }] }],
    ['a face without a loop', { vertices: [], faces: [{ id: 'floor' }] }],
    ['a loop of non-numbers', { vertices: [], faces: [{ id: 'f', loop: ['a'] }] }],
  ])('rejects %s', (_name, value) => {
    expect(isRoomMesh(value)).toBe(false);
  });

  it('accepts an empty but well-formed mesh', () => {
    expect(isRoomMesh({ vertices: [], faces: [] })).toBe(true);
  });

  describe('malformed data that would crash downstream', () => {
    const verts = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]];

    it.each([
      ['a string vertex component', { vertices: [['0', 0, 0]], faces: [] }],
      ['a NaN vertex component', { vertices: [[NaN, 0, 0]], faces: [] }],
      ['an infinite vertex component', { vertices: [[Infinity, 0, 0]], faces: [] }],
    ])('rejects %s', (_name, value) => {
      expect(isRoomMesh(value)).toBe(false);
    });

    it('rejects a loop index past the end of the vertex list', () => {
      expect(isRoomMesh({ vertices: verts, faces: [{ id: 'f', loop: [0, 1, 99] }] })).toBe(false);
    });

    it('rejects a negative loop index', () => {
      expect(isRoomMesh({ vertices: verts, faces: [{ id: 'f', loop: [0, 1, -1] }] })).toBe(false);
    });

    it('rejects a fractional loop index', () => {
      expect(isRoomMesh({ vertices: verts, faces: [{ id: 'f', loop: [0, 1, 1.5] }] })).toBe(false);
    });

    it('rejects a NaN loop index', () => {
      expect(isRoomMesh({ vertices: verts, faces: [{ id: 'f', loop: [0, 1, NaN] }] })).toBe(false);
    });

    it('rejects a face with fewer than three vertices', () => {
      expect(isRoomMesh({ vertices: verts, faces: [{ id: 'f', loop: [0, 1] }] })).toBe(false);
    });

    it('still accepts a well-formed face', () => {
      expect(isRoomMesh({ vertices: verts, faces: [{ id: 'f', loop: [0, 1, 2] }] })).toBe(true);
    });
  });
});

describe('surviving a save file', () => {
  it('is still recognised as a mesh after JSON', () => {
    expect(isRoomMesh(roundTrip(mesh()))).toBe(true);
  });

  it('is structurally identical after JSON', () => {
    const original = mesh();
    expect(roundTrip(original)).toEqual(original);
  });

  it('keeps vertex positions exactly', () => {
    const original = mesh(2.5);
    const revived = roundTrip(original) as typeof original;
    expect(revived.vertices).toEqual(original.vertices);
  });

  it('keeps face ids and loops, which the reconciler matches on', () => {
    const original = mesh();
    const revived = roundTrip(original) as typeof original;
    expect(revived.faces.map((f) => f.id)).toEqual(original.faces.map((f) => f.id));
    expect(revived.faces.map((f) => f.loop)).toEqual(original.faces.map((f) => f.loop));
  });

  it('keeps the floorplan provenance, so the room stays parametric', () => {
    const original = mesh();
    const revived = roundTrip(original) as typeof original;
    expect(revived.source).toEqual(original.source);
  });

  it('preserves the detached flag', () => {
    const edited = applyEdit(mesh(), { kind: 'move-vertex', id: 0, to: [-1, -1, 0] });
    expect((roundTrip(edited) as typeof edited).source).toMatchObject({ detached: true });
  });

  it('still triangulates to the same geometry', () => {
    const original = mesh();
    const revived = roundTrip(original) as typeof original;
    for (const face of original.faces) {
      expect(triangulateFace(revived, findFace(revived, face.id)!)).toEqual(
        triangulateFace(original, face)
      );
    }
  });

  it('still has inward-facing normals', () => {
    // Winding is the property that fails silently, so it is worth restating
    // on the far side of serialisation.
    const revived = roundTrip(mesh()) as ReturnType<typeof mesh>;
    expect(faceNormal(revived, findFace(revived, 'floor')!)).toEqual([0, 0, 1]);
    expect(faceNormal(revived, findFace(revived, 'ceiling')!)).toEqual([0, 0, -1]);
  });

  it('can still be edited after the round trip', () => {
    const revived = roundTrip(mesh(2.5)) as ReturnType<typeof mesh>;
    const taller = applyEdit(revived, {
      kind: 'set-floorplan',
      params: { points: SHOEBOX, height: 4 },
    });
    expect(Math.max(...taller.vertices.map((v) => v[2]))).toBeCloseTo(4);
  });

  it('can still move a vertex after the round trip', () => {
    const revived = roundTrip(mesh()) as ReturnType<typeof mesh>;
    const moved = applyEdit(revived, { kind: 'move-vertex', id: 0, to: [-2, -2, 0] });
    expect(moved.vertices[0]).toEqual([-2, -2, 0]);
  });
});
