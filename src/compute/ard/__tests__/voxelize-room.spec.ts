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
  /** Triangle vertex indices, for an indexed BufferGeometry. */
  index?: number[];
}

function stubSurface({ positions, offset = { x: 0, y: 0, z: 0 }, index }: StubOptions) {
  return {
    geometry: {
      getAttribute: (name: string) =>
        name === 'position' ? { array: new Float32Array(positions) } : undefined,
      index: index
        ? { count: index.length, getX: (i: number) => index[i] }
        : null,
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

  describe('indexed geometry', () => {
    /**
     * `Surface` builds non-indexed buffers today, so this is defence rather
     * than a live bug. But a loader change or a model import carrying an index
     * would otherwise have the position buffer read as consecutive triples —
     * shared-vertex soup taken for independent triangles. The shell would come
     * out full of holes and produce a "leak" that is near-impossible to trace
     * back to the adapter. `TessellateModifier` guards the same way.
     */
    it('expands an index buffer instead of reading positions as triples', () => {
      // A quad as four shared vertices plus six indices. Read as triples this
      // would give one triangle from (0,1,2) and garbage past the end.
      const positions = [
        0, 0, 0,
        1, 0, 0,
        1, 1, 0,
        0, 1, 0,
      ];
      const room = stubRoom([stubSurface({ positions, index: [0, 1, 2, 0, 2, 3] })]);
      const { triangles } = roomTriangles(room);

      expect(triangles).toHaveLength(2);
      expect([triangles[0].ax, triangles[0].ay]).toEqual([0, 0]);
      expect([triangles[0].bx, triangles[0].by]).toEqual([1, 0]);
      expect([triangles[0].cx, triangles[0].cy]).toEqual([1, 1]);
      // The second triangle reuses vertices 0 and 2 — the whole point of an index.
      expect([triangles[1].ax, triangles[1].ay]).toEqual([0, 0]);
      expect([triangles[1].bx, triangles[1].by]).toEqual([1, 1]);
      expect([triangles[1].cx, triangles[1].cy]).toEqual([0, 1]);
    });

    it('applies the world transform to indexed vertices too', () => {
      const room = stubRoom([
        stubSurface({
          positions: [0, 0, 0, 1, 0, 0, 0, 1, 0],
          index: [0, 1, 2],
          offset: { x: 5, y: 0, z: 0 },
        }),
      ]);
      const { triangles } = roomTriangles(room);
      expect([triangles[0].ax, triangles[0].bx, triangles[0].cx]).toEqual([5, 6, 5]);
    });

    it('produces the same shell from indexed and non-indexed geometry', () => {
      // The property that actually matters: an indexed cube must voxelize to
      // the same air region as the equivalent non-indexed one.
      const corners = [
        [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
        [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
      ];
      const faces = [
        [0, 3, 7, 4], [1, 5, 6, 2], [0, 4, 5, 1],
        [3, 2, 6, 7], [0, 1, 2, 3], [4, 7, 6, 5],
      ];

      const indexedSurfaces = faces.map((f) =>
        stubSurface({
          positions: corners.flat(),
          index: [f[0], f[1], f[2], f[0], f[2], f[3]],
        }),
      );
      const expandedSurfaces = faces.map((f) =>
        stubSurface({
          positions: [
            ...corners[f[0]], ...corners[f[1]], ...corners[f[2]],
            ...corners[f[0]], ...corners[f[2]], ...corners[f[3]],
          ],
        }),
      );

      const seed = { x: 0.5, y: 0.5, z: 0.5 };
      const indexed = voxelizeRoom(stubRoom(indexedSurfaces), { dx: 0.1, seed });
      const expanded = voxelizeRoom(stubRoom(expandedSurfaces), { dx: 0.1, seed });

      expect(indexed.grid.leaked).toBe(false);
      expect(indexed.grid.airCount).toBe(expanded.grid.airCount);
      expect(Array.from(indexed.grid.cells)).toEqual(Array.from(expanded.grid.cells));
    });
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
