/**
 * Tests for the Room -> voxelizer adapter (plan Phase 2).
 *
 * The adapter is thin on purpose — all the geometry work lives in the
 * `three`-free core — so what needs pinning is the extraction: triangles read
 * nine floats at a time, every vertex goes through the surface's world
 * transform, and the surface index each triangle carries is the one Phase 5
 * uses to find a per-band absorption coefficient.
 *
 * Surfaces are duck-typed stubs rather than real CRAM `Surface` objects, which
 * would drag in the stores, the material database and a renderer for no added
 * coverage.
 */

import { Vector3 } from 'three';
import type Room from '../../../objects/room';
import { roomTriangles, voxelizeRoom } from '../voxelize-room';

interface StubOptions {
  positions: number[];
  offset?: { x: number; y: number; z: number };
}

function stubSurface({ positions, offset = { x: 0, y: 0, z: 0 } }: StubOptions) {
  return {
    geometry: {
      getAttribute: (name: string) =>
        name === 'position' ? { array: new Float32Array(positions) } : undefined,
    },
    localToWorld: (v: Vector3) => v.set(v.x + offset.x, v.y + offset.y, v.z + offset.z),
  };
}

function stubRoom(surfaces: unknown[]): Room {
  return { allSurfaces: surfaces } as unknown as Room;
}

/** One triangle, as nine consecutive floats. */
const TRI = [0, 0, 0, 1, 0, 0, 0, 1, 0];

describe('roomTriangles', () => {
  it('reads nine floats per triangle', () => {
    const room = stubRoom([stubSurface({ positions: [...TRI, ...TRI] })]);
    const { triangles } = roomTriangles(room);
    expect(triangles).toHaveLength(2);
  });

  it('applies the surface world transform to every vertex', () => {
    const room = stubRoom([
      stubSurface({ positions: TRI, offset: { x: 10, y: 20, z: 30 } }),
    ]);
    const { triangles } = roomTriangles(room);
    const t = triangles[0];

    // All three vertices moved, not just the first — localToWorld mutates, so
    // reusing one Vector3 across vertices is easy to get wrong.
    expect([t.ax, t.ay, t.az]).toEqual([10, 20, 30]);
    expect([t.bx, t.by, t.bz]).toEqual([11, 20, 30]);
    expect([t.cx, t.cy, t.cz]).toEqual([10, 21, 30]);
  });

  it('tags each triangle with its surface index', () => {
    const room = stubRoom([
      stubSurface({ positions: [...TRI, ...TRI] }),
      stubSurface({ positions: TRI }),
      stubSurface({ positions: TRI }),
    ]);
    const { triangles, surfaces } = roomTriangles(room);

    expect(triangles.map((t) => t.surfaceIndex)).toEqual([0, 0, 1, 2]);
    // The returned array is the lookup table `grid.surfaceOf` indexes into.
    expect(surfaces).toHaveLength(3);
  });

  it('skips surfaces with no geometry', () => {
    const room = stubRoom([
      stubSurface({ positions: TRI }),
      { geometry: undefined, localToWorld: (v: Vector3) => v },
      { localToWorld: (v: Vector3) => v },
    ]);
    const { triangles } = roomTriangles(room);
    expect(triangles).toHaveLength(1);
    expect(triangles[0].surfaceIndex).toBe(0);
  });

  it('ignores a trailing partial triangle rather than reading past the end', () => {
    const room = stubRoom([stubSurface({ positions: [...TRI, 1, 2, 3, 4] })]);
    const { triangles } = roomTriangles(room);
    expect(triangles).toHaveLength(1);
    expect(Number.isFinite(triangles[0].cx)).toBe(true);
  });
});

describe('voxelizeRoom', () => {
  /** A closed unit cube as six quads, one surface each. */
  function cubeSurfaces() {
    const face = (pts: number[][]) => ({
      positions: [
        ...pts[0], ...pts[1], ...pts[2],
        ...pts[0], ...pts[2], ...pts[3],
      ],
    });
    return [
      stubSurface(face([[0, 0, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1]])),
      stubSurface(face([[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]])),
      stubSurface(face([[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]])),
      stubSurface(face([[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]])),
      stubSurface(face([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]])),
      stubSurface(face([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]])),
    ];
  }

  it('voxelizes a room and returns the surface lookup table', () => {
    const { grid, surfaces } = voxelizeRoom(stubRoom(cubeSurfaces()), {
      dx: 0.1,
      seed: { x: 0.5, y: 0.5, z: 0.5 },
    });

    expect(grid.leaked).toBe(false);
    expect(grid.airCount).toBeGreaterThan(0);
    expect(surfaces).toHaveLength(6);

    // Every surface index in the grid resolves into the returned table.
    for (const s of grid.surfaceOf) {
      if (s >= 0) expect(s).toBeLessThan(surfaces.length);
    }
  });

  it('refuses a room with no geometry', () => {
    expect(() => voxelizeRoom(stubRoom([]), { dx: 0.1 })).toThrow(/no surface geometry/);
  });
});
