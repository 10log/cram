/**
 * Mesh editing + undo/redo tests.
 *
 * The interesting claim is that undo/redo needs no inverse operations: because
 * `syncRoomFromMesh` reconciles by stable face id, restoring a remembered mesh
 * is enough to bring back walls an edit deleted, remove ones it created, and
 * keep acoustic materials attached throughout. These tests exercise that
 * through the real `history` singleton.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  commitMeshEdit,
  isEditable,
  moveVertex,
  setFloorplan,
} from '../room-mesh-editor';
import {
  FACE_ID_KEY,
  getRoomMesh,
  roomFromMesh,
} from '../room-from-mesh';
import { history } from '../../history';
import { emit } from '../../messenger';
import { floorplanToMesh, type Point2 } from '../../compute/geometry/floorplan';
import { FakeRoom, FakeSurface, resetSurfaceCounter } from '../../test-utils/room-fakes';
import * as THREE from 'three';
import { getRoomMesh as readMesh, setRoomMesh } from '../mesh-userdata';

vi.mock('../surface', async () => {
  const { FakeSurface } = await import('../../test-utils/room-fakes');
  return { __esModule: true, default: FakeSurface };
});
vi.mock('../room', async () => {
  const { FakeRoom } = await import('../../test-utils/room-fakes');
  return { __esModule: true, default: FakeRoom, Room: FakeRoom };
});
vi.mock('../../messenger', () => ({ emit: vi.fn(), on: vi.fn(), off: vi.fn() }));

const SHOEBOX: Point2[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];
const PENTAGON: Point2[] = [...SHOEBOX, { x: -1, y: 1.5 }];
const TRIANGLE: Point2[] = SHOEBOX.slice(0, 3);

const MATERIAL = { uuid: 'mat-default', name: 'Default' } as never;
const CARPET = { uuid: 'mat-carpet', name: 'Carpet' } as never;
const opts = { acousticMaterial: MATERIAL };

const mesh = (points = SHOEBOX, height = 2.5) => floorplanToMesh({ points, height });

/** A room plus a typed view of the fake standing in for it. */
function makeRoom(points = SHOEBOX, height = 2.5) {
  const room = roomFromMesh(mesh(points, height), opts);
  return { room, fake: room as unknown as FakeRoom };
}

const ceilingZ = (fake: FakeRoom): number => {
  const ceiling = fake.byFaceId(FACE_ID_KEY, 'ceiling')!;
  ceiling.geometry.computeBoundingBox();
  return ceiling.geometry.boundingBox!.min.z;
};

beforeEach(() => {
  history.clear();
  resetSurfaceCounter();
});

describe('isEditable', () => {
  it('is true for a room built from a mesh', () => {
    expect(isEditable(makeRoom().room)).toBe(true);
  });

  it('is false for a room with no mesh, such as an import', () => {
    expect(isEditable(new FakeRoom('imported') as never)).toBe(false);
  });
});

describe('commitMeshEdit', () => {
  it('refuses a room that did not come from a floorplan', () => {
    const imported = new FakeRoom('imported') as never;
    expect(() =>
      commitMeshEdit(imported, { kind: 'set-floorplan', params: { points: SHOEBOX, height: 3 } }, opts)
    ).toThrow(/no editable mesh/);
  });

  it('stores the new mesh on the room', () => {
    const { room } = makeRoom(SHOEBOX, 2.5);
    const after = setFloorplan(room, { points: SHOEBOX, height: 4 }, opts);
    expect(getRoomMesh(room)).toBe(after);
  });

  it('records one moment per edit', () => {
    const { room } = makeRoom();
    setFloorplan(room, { points: SHOEBOX, height: 3 }, opts);
    setFloorplan(room, { points: SHOEBOX, height: 4 }, opts);
    expect(history.timeline).toHaveLength(2);
  });

  it('categorises moments by edit kind', () => {
    const { room } = makeRoom();
    setFloorplan(room, { points: SHOEBOX, height: 3 }, opts);
    moveVertex(room, 0, [-1, -1, 0], opts);
    expect(history.timeline.map((m) => m.category)).toEqual([
      'ROOM_MESH_SET_FLOORPLAN',
      'ROOM_MESH_MOVE_VERTEX',
    ]);
  });

  it('attributes the moment to the room', () => {
    const { room, fake } = makeRoom();
    setFloorplan(room, { points: SHOEBOX, height: 3 }, opts);
    expect(history.timeline[0].objectId).toBe(fake.uuid);
  });

  describe('rejected edits', () => {
    it('propagates a validation failure', () => {
      const { room } = makeRoom();
      expect(() => setFloorplan(room, { points: SHOEBOX, height: 0 }, opts)).toThrow(
        /invalid floorplan/
      );
    });

    it('leaves the room untouched when the edit is invalid', () => {
      const { room, fake } = makeRoom(SHOEBOX, 2.5);
      const before = ceilingZ(fake);

      expect(() => setFloorplan(room, { points: SHOEBOX, height: -1 }, opts)).toThrow();

      expect(ceilingZ(fake)).toBeCloseTo(before);
      expect(fake.allSurfaces).toHaveLength(6);
    });

    it('records no moment for a rejected edit', () => {
      const { room } = makeRoom();
      expect(() => setFloorplan(room, { points: SHOEBOX, height: 0 }, opts)).toThrow();
      expect(history.timeline).toHaveLength(0);
    });
  });
});

describe('marking the project dirty', () => {
  // A geometry-only edit changes no containers, so nothing else in the app
  // would flag unsaved changes and the Open/New warning would not appear.
  it('emits MARK_DIRTY after a height change', () => {
    const { room } = makeRoom(SHOEBOX, 2.5);
    vi.mocked(emit).mockClear();

    setFloorplan(room, { points: SHOEBOX, height: 4 }, opts);

    expect(emit).toHaveBeenCalledWith('MARK_DIRTY', undefined);
  });

  it('emits MARK_DIRTY after a vertex move', () => {
    const { room } = makeRoom();
    vi.mocked(emit).mockClear();

    moveVertex(room, 0, [-2, -2, 0], opts);

    expect(emit).toHaveBeenCalledWith('MARK_DIRTY', undefined);
  });

  it('emits MARK_DIRTY on undo, which is also an unsaved change', () => {
    const { room } = makeRoom(SHOEBOX, 2.5);
    setFloorplan(room, { points: SHOEBOX, height: 4 }, opts);
    vi.mocked(emit).mockClear();

    history.undo();

    expect(emit).toHaveBeenCalledWith('MARK_DIRTY', undefined);
  });

  it('does not emit for a rejected edit', () => {
    const { room } = makeRoom();
    vi.mocked(emit).mockClear();

    expect(() => setFloorplan(room, { points: SHOEBOX, height: 0 }, opts)).toThrow();

    expect(emit).not.toHaveBeenCalledWith('MARK_DIRTY', undefined);
  });
});

describe('setFloorplan', () => {
  it('applies a new height', () => {
    const { room, fake } = makeRoom(SHOEBOX, 2.5);
    setFloorplan(room, { points: SHOEBOX, height: 4 }, opts);
    expect(ceilingZ(fake)).toBeCloseTo(4);
  });

  it('is undone by history.undo', () => {
    const { room, fake } = makeRoom(SHOEBOX, 2.5);
    setFloorplan(room, { points: SHOEBOX, height: 4 }, opts);

    history.undo();

    expect(ceilingZ(fake)).toBeCloseTo(2.5);
  });

  it('is reapplied by history.redo', () => {
    const { room, fake } = makeRoom(SHOEBOX, 2.5);
    setFloorplan(room, { points: SHOEBOX, height: 4 }, opts);

    history.undo();
    history.redo();

    expect(ceilingZ(fake)).toBeCloseTo(4);
  });

  it('unwinds several edits in order', () => {
    const { room, fake } = makeRoom(SHOEBOX, 2.5);
    setFloorplan(room, { points: SHOEBOX, height: 4 }, opts);
    setFloorplan(room, { points: SHOEBOX, height: 6 }, opts);

    expect(ceilingZ(fake)).toBeCloseTo(6);
    history.undo();
    expect(ceilingZ(fake)).toBeCloseTo(4);
    history.undo();
    expect(ceilingZ(fake)).toBeCloseTo(2.5);
  });
});

describe('undo across topology changes', () => {
  it('removes a wall that an edit added', () => {
    const { room, fake } = makeRoom(SHOEBOX);
    setFloorplan(room, { points: PENTAGON, height: 2.5 }, opts);
    expect(fake.allSurfaces).toHaveLength(7);

    history.undo();

    expect(fake.allSurfaces).toHaveLength(6);
    expect(fake.byFaceId(FACE_ID_KEY, 'wall-4')).toBeUndefined();
  });

  it('restores a wall that an edit removed', () => {
    const { room, fake } = makeRoom(SHOEBOX);
    setFloorplan(room, { points: TRIANGLE, height: 2.5 }, opts);
    expect(fake.allSurfaces).toHaveLength(5);

    history.undo();

    expect(fake.allSurfaces).toHaveLength(6);
    expect(fake.byFaceId(FACE_ID_KEY, 'wall-3')).toBeDefined();
  });

  it('redoes a topology change', () => {
    const { room, fake } = makeRoom(SHOEBOX);
    setFloorplan(room, { points: PENTAGON, height: 2.5 }, opts);

    history.undo();
    history.redo();

    expect(fake.allSurfaces).toHaveLength(7);
    expect(fake.byFaceId(FACE_ID_KEY, 'wall-4')).toBeDefined();
  });

  it('keeps a material assignment through an undone topology change', () => {
    // Undo restores the wall, but it is a new Surface — the material rides on
    // the surviving faces, which is what the user actually notices.
    const { room, fake } = makeRoom(SHOEBOX);
    fake.byFaceId(FACE_ID_KEY, 'floor')!.acousticMaterial = CARPET;

    setFloorplan(room, { points: PENTAGON, height: 2.5 }, opts);
    history.undo();

    expect(fake.byFaceId(FACE_ID_KEY, 'floor')!.acousticMaterial).toBe(CARPET);
  });
});

describe('moveVertex', () => {
  it('moves the vertex and every face sharing it', () => {
    const { room, fake } = makeRoom(SHOEBOX, 2.5);
    moveVertex(room, 0, [-2, -2, 0], opts);

    const floor = fake.byFaceId(FACE_ID_KEY, 'floor')!;
    floor.geometry.computeBoundingBox();
    expect(floor.geometry.boundingBox!.min.x).toBeCloseTo(-2);

    const wall = fake.byFaceId(FACE_ID_KEY, 'wall-0')!;
    wall.geometry.computeBoundingBox();
    expect(wall.geometry.boundingBox!.min.x).toBeCloseTo(-2);
  });

  it('marks the mesh detached from its floorplan', () => {
    const { room } = makeRoom();
    moveVertex(room, 0, [-2, -2, 0], opts);
    expect(getRoomMesh(room)!.source).toMatchObject({ kind: 'floorplan', detached: true });
  });

  it('is undone by history.undo', () => {
    const { room, fake } = makeRoom(SHOEBOX, 2.5);
    moveVertex(room, 0, [-2, -2, 0], opts);

    history.undo();

    const floor = fake.byFaceId(FACE_ID_KEY, 'floor')!;
    floor.geometry.computeBoundingBox();
    expect(floor.geometry.boundingBox!.min.x).toBeCloseTo(0);
  });

  it('reattaches the mesh to its plan when undone', () => {
    const { room } = makeRoom();
    moveVertex(room, 0, [-2, -2, 0], opts);

    history.undo();

    expect(getRoomMesh(room)!.source).toMatchObject({ detached: false });
  });

  it('changes no surface count', () => {
    const { room, fake } = makeRoom();
    moveVertex(room, 2, [9, 9, 0], opts);
    expect(fake.allSurfaces).toHaveLength(6);
  });

  it('rejects an out-of-range vertex without recording a moment', () => {
    const { room } = makeRoom();
    expect(() => moveVertex(room, 99, [0, 0, 0], opts)).toThrow(RangeError);
    expect(history.timeline).toHaveLength(0);
  });
});

describe('a room reloaded from a save file', () => {
  /**
   * Rebuild a Room the way Room.restore() does: fresh Surfaces carrying their
   * saved face ids, and the mesh revived from JSON. This is the whole point of
   * persisting them — without it a reloaded room renders but cannot be edited.
   */
  function restoreRoom(materials: Record<string, unknown> = {}) {
    const original = roomFromMesh(mesh(SHOEBOX, 2.5), opts);
    const savedMesh = JSON.parse(JSON.stringify(readMesh(original)));

    const restored = new FakeRoom('sketched room');
    for (const face of savedMesh.faces) {
      const surface = new FakeSurface(face.name, {
        geometry: new THREE.BufferGeometry(),
        acousticMaterial: materials[face.id] ?? MATERIAL,
      });
      surface.userData[FACE_ID_KEY] = face.id;
      restored.surfaces.add(surface);
    }
    setRoomMesh(restored, savedMesh);
    return restored as unknown as FakeRoom;
  }

  it('is editable again', () => {
    expect(isEditable(restoreRoom() as never)).toBe(true);
  });

  it('accepts a height change', () => {
    const restored = restoreRoom();
    setFloorplan(restored as never, { points: SHOEBOX, height: 4 }, opts);
    expect(ceilingZ(restored)).toBeCloseTo(4);
  });

  it('updates its surfaces in place rather than rebuilding them', () => {
    const restored = restoreRoom();
    const before = restored.allSurfaces.map((s) => s.uuid);

    setFloorplan(restored as never, { points: SHOEBOX, height: 4 }, opts);

    expect(restored.allSurfaces.map((s) => s.uuid)).toEqual(before);
  });

  it('keeps materials assigned before the save', () => {
    const restored = restoreRoom({ floor: CARPET });
    setFloorplan(restored as never, { points: SHOEBOX, height: 4 }, opts);
    expect(restored.byFaceId(FACE_ID_KEY, 'floor')!.acousticMaterial).toBe(CARPET);
  });

  it('still supports topology changes', () => {
    const restored = restoreRoom();
    setFloorplan(restored as never, { points: PENTAGON, height: 2.5 }, opts);
    expect(restored.allSurfaces).toHaveLength(7);
  });

  it('records the edit in history, so undo works after a reload', () => {
    const restored = restoreRoom();
    setFloorplan(restored as never, { points: SHOEBOX, height: 4 }, opts);

    history.undo();

    expect(ceilingZ(restored)).toBeCloseTo(2.5);
  });
});
