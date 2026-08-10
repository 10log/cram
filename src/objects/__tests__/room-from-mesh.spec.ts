/**
 * Adapter tests — RoomMesh into Room/Surface.
 *
 * Surface and Room are replaced with light fakes. The logic worth testing here
 * is reconciliation: which faces update in place, which Surfaces are created or
 * disposed, and above all whether a user's acoustic material survives an edit.
 * Dragging in the real Surface would mean mocking csg, BRDF, the store and the
 * renderer to end up testing none of that.
 *
 * three.js is real, so the BufferGeometry assertions mean something.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';

import {
  FACE_ID_KEY,
  addRoomFromMesh,
  geometryForFace,
  getFaceId,
  roomFromMesh,
  surfaceForFace,
  syncRoomFromMesh,
} from '../room-from-mesh';
import { emit } from '../../messenger';
import { floorplanToMesh, type Point2 } from '../../compute/geometry/floorplan';
import { findFace } from '../../compute/geometry/room-mesh';
import { triangulateFace } from '../../compute/geometry/triangulate';
import {
  FakeRoom,
  FakeSurface,
  resetSurfaceCounter,
} from '../../test-utils/room-fakes';

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

const MATERIAL = { uuid: 'mat-default', name: 'Default' } as never;
const CARPET = { uuid: 'mat-carpet', name: 'Carpet' } as never;

const mesh = (points = SHOEBOX, height = 2.5) => floorplanToMesh({ points, height });
const opts = { acousticMaterial: MATERIAL };

const asRoom = (r: FakeRoom): any => r;

beforeEach(() => {
  vi.mocked(emit).mockClear();
  resetSurfaceCounter();
});

describe('geometryForFace', () => {
  it('produces three positions per triangle', () => {
    const m = mesh();
    const floor = findFace(m, 'floor')!;
    const geometry = geometryForFace(m, floor);
    const position = geometry.getAttribute('position');
    expect(position.count).toBe(triangulateFace(m, floor).length * 3);
    expect(position.itemSize).toBe(3);
  });

  it('names the geometry after the face', () => {
    const m = mesh();
    expect(geometryForFace(m, findFace(m, 'wall-2')!).name).toBe('face-wall-2');
  });

  it('computes vertex normals', () => {
    const m = mesh();
    expect(geometryForFace(m, findFace(m, 'floor')!).getAttribute('normal')).toBeTruthy();
  });

  it('places the floor at z=0 and the ceiling at the room height', () => {
    const m = mesh(SHOEBOX, 2.5);
    const floor = geometryForFace(m, findFace(m, 'floor')!);
    floor.computeBoundingBox();
    expect(floor.boundingBox!.max.z).toBeCloseTo(0);

    const ceiling = geometryForFace(m, findFace(m, 'ceiling')!);
    ceiling.computeBoundingBox();
    expect(ceiling.boundingBox!.min.z).toBeCloseTo(2.5);
  });
});

describe('surfaceForFace', () => {
  it('tags the surface with its face id', () => {
    const m = mesh();
    const surface = surfaceForFace(m, findFace(m, 'wall-1')!, MATERIAL);
    expect(surface.userData[FACE_ID_KEY]).toBe('wall-1');
    expect(getFaceId(surface as never)).toBe('wall-1');
  });

  it('names the surface after the face', () => {
    const m = mesh();
    expect(surfaceForFace(m, findFace(m, 'wall-0')!, MATERIAL).name).toBe('Wall 1');
  });

  it('applies the given acoustic material', () => {
    const m = mesh();
    const surface = surfaceForFace(m, findFace(m, 'floor')!, CARPET) as unknown as FakeSurface;
    expect(surface.acousticMaterial).toBe(CARPET);
  });
});

describe('getFaceId', () => {
  it('returns undefined for an untagged object', () => {
    expect(getFaceId({ userData: {} } as never)).toBeUndefined();
  });

  it('returns undefined when userData is absent', () => {
    expect(getFaceId({} as never)).toBeUndefined();
  });
});

describe('roomFromMesh', () => {
  it('creates one surface per face', () => {
    const room = roomFromMesh(mesh(), opts) as unknown as FakeRoom;
    expect(room.allSurfaces).toHaveLength(6);
  });

  it('tags every surface with a distinct face id', () => {
    const room = roomFromMesh(mesh(), opts) as unknown as FakeRoom;
    const ids = room.allSurfaces.map((s) => s.userData[FACE_ID_KEY]);
    expect(ids).toEqual(['floor', 'ceiling', 'wall-0', 'wall-1', 'wall-2', 'wall-3']);
  });

  it('uses the supplied name', () => {
    const room = roomFromMesh(mesh(), { ...opts, name: 'Studio A' }) as unknown as FakeRoom;
    expect(room.name).toBe('Studio A');
  });

  it('does not emit on its own', () => {
    roomFromMesh(mesh(), opts);
    expect(emit).not.toHaveBeenCalled();
  });
});

describe('addRoomFromMesh', () => {
  it('emits ADD_ROOM with the room', () => {
    const room = addRoomFromMesh(mesh(), opts);
    expect(emit).toHaveBeenCalledWith('ADD_ROOM', room);
  });
});

describe('syncRoomFromMesh', () => {
  it('updates every face in place when only the height changes', () => {
    const room = roomFromMesh(mesh(SHOEBOX, 2.5), opts);
    const plan = syncRoomFromMesh(room, mesh(SHOEBOX, 4), opts);

    expect(plan.updated).toHaveLength(6);
    expect(plan.added).toEqual([]);
    expect(plan.removed).toEqual([]);
  });

  it('preserves the acoustic material a user assigned to a wall', () => {
    // The hook this whole design exists for. Rebuilding surfaces instead of
    // updating them would silently reset this on every height tweak.
    const room = roomFromMesh(mesh(SHOEBOX, 2.5), opts);
    const fake = asRoom(room) as FakeRoom;
    const floor = fake.allSurfaces.find((s) => s.userData[FACE_ID_KEY] === 'floor')!;
    floor.acousticMaterial = CARPET;

    syncRoomFromMesh(room, mesh(SHOEBOX, 4), opts);

    expect(floor.acousticMaterial).toBe(CARPET);
  });

  it('preserves surface identity across an edit', () => {
    const room = roomFromMesh(mesh(SHOEBOX, 2.5), opts);
    const fake = asRoom(room) as FakeRoom;
    const before = fake.allSurfaces.map((s) => s.uuid);

    syncRoomFromMesh(room, mesh(SHOEBOX, 4), opts);

    expect(fake.allSurfaces.map((s) => s.uuid)).toEqual(before);
  });

  it('feeds new geometry through init rather than replacing the surface', () => {
    const room = roomFromMesh(mesh(SHOEBOX, 2.5), opts);
    const fake = asRoom(room) as FakeRoom;
    const ceiling = fake.allSurfaces.find((s) => s.userData[FACE_ID_KEY] === 'ceiling')!;

    syncRoomFromMesh(room, mesh(SHOEBOX, 4), opts);

    expect(ceiling.initCalls).toHaveLength(1);
    ceiling.geometry.computeBoundingBox();
    expect(ceiling.geometry.boundingBox!.min.z).toBeCloseTo(4);
  });

  it('creates a surface for a wall added to the outline', () => {
    const room = roomFromMesh(mesh(), opts);
    const pentagon = [...SHOEBOX, { x: -1, y: 1.5 }];
    const plan = syncRoomFromMesh(room, mesh(pentagon), opts);

    expect(plan.added).toEqual(['wall-4']);
    const fake = asRoom(room) as FakeRoom;
    expect(fake.allSurfaces).toHaveLength(7);
    expect(emit).toHaveBeenCalledWith('ADD_SURFACE', expect.anything());
  });

  it('disposes the surface for a wall removed from the outline', () => {
    const room = roomFromMesh(mesh(), opts);
    const fake = asRoom(room) as FakeRoom;
    const doomed = fake.allSurfaces.find((s) => s.userData[FACE_ID_KEY] === 'wall-3')!;

    const plan = syncRoomFromMesh(room, mesh(SHOEBOX.slice(0, 3)), opts);

    expect(plan.removed).toEqual(['wall-3']);
    expect(doomed.disposed).toBe(true);
    expect(emit).toHaveBeenCalledWith('REMOVE_SURFACE', doomed.uuid);
    expect(fake.allSurfaces).toHaveLength(5);
    expect(fake.allSurfaces).not.toContain(doomed);
  });

  it('settles after a removal, so a repeat sync is a no-op', () => {
    // Guards the case where a disposed surface lingers in the room and gets
    // re-reported as removed on every subsequent edit.
    const room = roomFromMesh(mesh(), opts);
    const triangle = mesh(SHOEBOX.slice(0, 3));
    syncRoomFromMesh(room, triangle, opts);

    const second = syncRoomFromMesh(room, triangle, opts);
    expect(second.removed).toEqual([]);
    expect(second.added).toEqual([]);
    expect(second.updated).toHaveLength(5);
  });

  it('gives newly added surfaces the option material, not a neighbour\'s', () => {
    const room = roomFromMesh(mesh(), opts);
    const fake = asRoom(room) as FakeRoom;
    for (const s of fake.allSurfaces) s.acousticMaterial = CARPET;

    syncRoomFromMesh(room, mesh([...SHOEBOX, { x: -1, y: 1.5 }]), opts);

    const added = fake.allSurfaces.find((s) => s.userData[FACE_ID_KEY] === 'wall-4')!;
    expect(added.acousticMaterial).toBe(MATERIAL);
  });

  it('ignores surfaces that carry no face id', () => {
    const room = roomFromMesh(mesh(), opts);
    const fake = asRoom(room) as FakeRoom;
    fake.surfaces.add(new FakeSurface('stray', { geometry: new THREE.BufferGeometry(), acousticMaterial: MATERIAL }));

    const plan = syncRoomFromMesh(room, mesh(SHOEBOX, 4), opts);

    expect(plan.removed).toEqual([]);
    expect(plan.updated).toHaveLength(6);
  });

  it('is idempotent when the mesh has not changed', () => {
    const room = roomFromMesh(mesh(), opts);
    const fake = asRoom(room) as FakeRoom;
    const plan = syncRoomFromMesh(room, mesh(), opts);

    expect(plan.added).toEqual([]);
    expect(plan.removed).toEqual([]);
    expect(fake.allSurfaces).toHaveLength(6);
  });
});
