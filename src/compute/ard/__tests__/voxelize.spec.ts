/**
 * Tests for ARD voxelization (plan Phase 2).
 *
 * Phase 2 and Phase 3 are the parts with no counterpart in the reference — it
 * reads a pre-baked `.rec` box list from an offline MATLAB step — so there is
 * nothing to cross-check against and the tests carry the whole burden.
 */

import {
  Cell,
  cellSizeFor,
  cellToWorld,
  voxelizeTriangles,
  worldToCell,
  type VoxelGrid,
  type VoxelTriangle,
} from '../voxelize';

type P = [number, number, number];

/** Two triangles forming an axis-aligned quad, wound consistently. */
function quad(a: P, b: P, c: P, d: P, surfaceIndex: number): VoxelTriangle[] {
  const tri = (p: P, q: P, r: P): VoxelTriangle => ({
    ax: p[0], ay: p[1], az: p[2],
    bx: q[0], by: q[1], bz: q[2],
    cx: r[0], cy: r[1], cz: r[2],
    surfaceIndex,
  });
  return [tri(a, b, c), tri(a, c, d)];
}

/**
 * A closed axis-aligned box as six quads, one surface index per face:
 * 0 = -x, 1 = +x, 2 = -y, 3 = +y, 4 = -z, 5 = +z.
 */
function boxSurfaces(
  min: P,
  max: P,
  firstSurface = 0,
): VoxelTriangle[] {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  const s = firstSurface;
  return [
    ...quad([x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], s + 0),
    ...quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], s + 1),
    ...quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], s + 2),
    ...quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], s + 3),
    ...quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], s + 4),
    ...quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], s + 5),
  ];
}

function at(grid: VoxelGrid, i: number, j: number, k: number): number {
  return grid.cells[i + grid.nx * (j + grid.ny * k)];
}

describe('cellSizeFor', () => {
  it('resolves the target frequency at the requested sampling density', () => {
    // 2.6 cells per wavelength at 1 kHz, c = 343.
    expect(cellSizeFor(1000)).toBeCloseTo(343 / 2600, 12);
    expect(343 / cellSizeFor(1000) / 1000).toBeCloseTo(2.6, 12);
  });

  it('rejects a non-positive frequency', () => {
    expect(() => cellSizeFor(0)).toThrow();
    expect(() => cellSizeFor(-100)).toThrow();
  });
});

describe('voxelizeTriangles', () => {
  it('fills a closed cube and leaves a one-cell shell', () => {
    // A 1 m cube at dx = 0.1. Cell centres sit on the grid, walls land on a
    // single layer, and the interior is the cells strictly between them.
    const grid = voxelizeTriangles(boxSurfaces([0, 0, 0], [1, 1, 1]), {
      dx: 0.1,
      seed: { x: 0.5, y: 0.5, z: 0.5 },
    });

    expect(grid.leaked).toBe(false);
    expect(grid.warnings).toEqual([]);
    expect(grid.airCount).toBeGreaterThan(0);

    // The air region is a solid rectangular block.
    let minI = Infinity, minJ = Infinity, minK = Infinity;
    let maxI = -Infinity, maxJ = -Infinity, maxK = -Infinity;
    for (let k = 0; k < grid.nz; k++) {
      for (let j = 0; j < grid.ny; j++) {
        for (let i = 0; i < grid.nx; i++) {
          if (at(grid, i, j, k) !== Cell.Air) continue;
          minI = Math.min(minI, i); maxI = Math.max(maxI, i);
          minJ = Math.min(minJ, j); maxJ = Math.max(maxJ, j);
          minK = Math.min(minK, k); maxK = Math.max(maxK, k);
        }
      }
    }
    const span: [number, number, number] = [
      maxI - minI + 1,
      maxJ - minJ + 1,
      maxK - minK + 1,
    ];
    expect(grid.airCount).toBe(span[0] * span[1] * span[2]);

    // Every face of that block is wrapped in wall cells, not open space.
    for (let j = minJ; j <= maxJ; j++) {
      for (let k = minK; k <= maxK; k++) {
        expect(at(grid, minI - 1, j, k)).toBe(Cell.Solid);
        expect(at(grid, maxI + 1, j, k)).toBe(Cell.Solid);
      }
    }
  });

  it('records the surface each wall cell came from', () => {
    const grid = voxelizeTriangles(boxSurfaces([0, 0, 0], [1, 1, 1]), {
      dx: 0.1,
      seed: { x: 0.5, y: 0.5, z: 0.5 },
    });

    // Every face index should appear somewhere, so Phase 5 can look up a
    // per-band alpha for any wall it meets.
    const seen = new Set<number>();
    for (const s of grid.surfaceOf) if (s >= 0) seen.add(s);
    expect([...seen].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);

    // Interior air carries no surface.
    for (let idx = 0; idx < grid.cells.length; idx++) {
      if (grid.cells[idx] === Cell.Air) expect(grid.surfaceOf[idx]).toBe(-1);
    }
  });

  it('leaves a sealed interior void solid', () => {
    // A closet nobody opened is not part of the room's acoustic volume. The
    // fill is 6-connected from a seed outside it, so it never gets in.
    const triangles = [
      ...boxSurfaces([0, 0, 0], [2, 1, 1], 0),
      ...boxSurfaces([1.2, 0.2, 0.2], [1.8, 0.8, 0.8], 6),
    ];
    const grid = voxelizeTriangles(triangles, {
      dx: 0.05,
      seed: { x: 0.5, y: 0.5, z: 0.5 },
    });

    expect(grid.leaked).toBe(false);
    const inCloset = worldToCell(grid, { x: 1.5, y: 0.5, z: 0.5 })!;
    expect(at(grid, inCloset.i, inCloset.j, inCloset.k)).toBe(Cell.Solid);

    const inRoom = worldToCell(grid, { x: 0.5, y: 0.5, z: 0.5 })!;
    expect(at(grid, inRoom.i, inRoom.j, inRoom.k)).toBe(Cell.Air);
  });

  it('flags a leak when the surfaces do not close', () => {
    // Drop the +x face. The interior drains into the exterior, and the "air
    // region" becomes the whole bounding box — which must be reported, not
    // silently decomposed.
    const open = boxSurfaces([0, 0, 0], [1, 1, 1]).filter((t) => t.surfaceIndex !== 1);
    const grid = voxelizeTriangles(open, {
      dx: 0.1,
      seed: { x: 0.5, y: 0.5, z: 0.5 },
    });

    expect(grid.leaked).toBe(true);
    expect(grid.warnings.join(' ')).toMatch(/do not close|outside/);
  });

  it('does not leak through a closed room', () => {
    // The complement of the test above: no air anywhere on the padded rim.
    const grid = voxelizeTriangles(boxSurfaces([0, 0, 0], [1, 1, 1]), {
      dx: 0.1,
      seed: { x: 0.5, y: 0.5, z: 0.5 },
    });

    for (let k = 0; k < grid.nz; k++) {
      for (let j = 0; j < grid.ny; j++) {
        for (let i = 0; i < grid.nx; i++) {
          const onRim =
            i === 0 || j === 0 || k === 0 ||
            i === grid.nx - 1 || j === grid.ny - 1 || k === grid.nz - 1;
          if (onRim) expect(at(grid, i, j, k)).toBe(Cell.Solid);
        }
      }
    }
  });

  it('handles an L-shaped room as one connected region', () => {
    // Two overlapping boxes sharing an opening. Both arms must fill from one
    // seed, which is what makes the decomposition see a single air region.
    // Air occupies x 0..2 / y 0..1 plus x 0..1 / y 1..2. There is deliberately
    // no wall at y = 1 over x 0..1 — that is where the two arms join.
    const triangles = [
      ...quad([0, 0, 0], [2, 0, 0], [2, 0, 1], [0, 0, 1], 0), // y = 0
      ...quad([1, 1, 0], [2, 1, 0], [2, 1, 1], [1, 1, 1], 1), // y = 1, x 1..2
      ...quad([1, 1, 0], [1, 2, 0], [1, 2, 1], [1, 1, 1], 2), // x = 1, y 1..2
      ...quad([0, 2, 0], [1, 2, 0], [1, 2, 1], [0, 2, 1], 3), // y = 2
      ...quad([0, 0, 0], [0, 2, 0], [0, 2, 1], [0, 0, 1], 4), // x = 0
      ...quad([2, 0, 0], [2, 1, 0], [2, 1, 1], [2, 0, 1], 5), // x = 2, y 0..1
      ...quad([0, 0, 0], [2, 0, 0], [2, 2, 0], [0, 2, 0], 6), // floor
      ...quad([0, 0, 1], [2, 0, 1], [2, 2, 1], [0, 2, 1], 7), // ceiling
    ];
    const grid = voxelizeTriangles(triangles, {
      dx: 0.05,
      seed: { x: 0.5, y: 0.5, z: 0.5 },
    });

    expect(grid.leaked).toBe(false);
    // Both arms reachable.
    const shortArm = worldToCell(grid, { x: 1.5, y: 0.5, z: 0.5 })!;
    const longArm = worldToCell(grid, { x: 0.5, y: 1.5, z: 0.5 })!;
    expect(at(grid, shortArm.i, shortArm.j, shortArm.k)).toBe(Cell.Air);
    expect(at(grid, longArm.i, longArm.j, longArm.k)).toBe(Cell.Air);
    // And the notch outside the L is not.
    const notch = worldToCell(grid, { x: 1.5, y: 1.5, z: 0.5 })!;
    expect(at(grid, notch.i, notch.j, notch.k)).toBe(Cell.Solid);
  });

  it('warns and relocates when the seed lands on a wall', () => {
    const grid = voxelizeTriangles(boxSurfaces([0, 0, 0], [1, 1, 1]), {
      dx: 0.1,
      seed: { x: 0, y: 0.5, z: 0.5 },
    });
    expect(grid.warnings.join(' ')).toMatch(/wall cell/);
  });

  it('pads the grid so the exterior always touches the rim', () => {
    const grid = voxelizeTriangles(boxSurfaces([0, 0, 0], [1, 1, 1]), {
      dx: 0.1,
      seed: { x: 0.5, y: 0.5, z: 0.5 },
      padCells: 3,
    });
    // Three empty cells each side, beyond the geometry's own extent.
    expect(grid.nx).toBeGreaterThanOrEqual(Math.ceil(1 / 0.1) + 7);
    expect(grid.origin.x).toBeCloseTo(-0.3, 12);
  });

  it('round-trips world coordinates through cell indices', () => {
    const grid = voxelizeTriangles(boxSurfaces([0, 0, 0], [1, 1, 1]), {
      dx: 0.1,
      seed: { x: 0.5, y: 0.5, z: 0.5 },
    });
    for (const p of [
      { x: 0.5, y: 0.5, z: 0.5 },
      { x: 0.2, y: 0.8, z: 0.3 },
    ]) {
      const cell = worldToCell(grid, p)!;
      const back = cellToWorld(grid, cell.i, cell.j, cell.k);
      expect(Math.abs(back.x - p.x)).toBeLessThanOrEqual(grid.dx / 2 + 1e-12);
      expect(Math.abs(back.y - p.y)).toBeLessThanOrEqual(grid.dx / 2 + 1e-12);
      expect(Math.abs(back.z - p.z)).toBeLessThanOrEqual(grid.dx / 2 + 1e-12);
    }
    expect(worldToCell(grid, { x: 100, y: 0, z: 0 })).toBeNull();
  });

  it('marks a thin diagonal wall without thickening it into a blob', () => {
    // The exact SAT overlap test matters here: a conservative bounding-box test
    // would mark the whole cell range the triangle's AABB covers, turning a
    // one-cell diagonal into a filled triangle several cells deep, changing the
    // air volume and with it the modal frequencies.
    const diagonal = quad([0, 0, 0], [1, 1, 0], [1, 1, 1], [0, 0, 1], 0);
    const grid = voxelizeTriangles(diagonal, { dx: 0.05, seed: { x: 0.5, y: 0.9, z: 0.5 } });

    let solid = 0;
    for (const v of grid.surfaceOf) if (v >= 0) solid++;
    // A 1.41 m x 1 m sheet at dx = 0.05 is ~28 x 20 = 560 cells; staircasing
    // and the half-cell margin roughly double that. Far below the ~1600 cells
    // its bounding box would cover per layer.
    expect(solid).toBeGreaterThan(400);
    expect(solid).toBeLessThan(2500);
  });

  it('rejects malformed input', () => {
    const tris = boxSurfaces([0, 0, 0], [1, 1, 1]);
    expect(() => voxelizeTriangles([], { dx: 0.1 })).toThrow(/empty/);
    expect(() => voxelizeTriangles(tris, { dx: 0 })).toThrow(/positive/);
    expect(() => voxelizeTriangles(tris, { dx: 0.1, padCells: 0 })).toThrow(/padCells/);
    expect(() => voxelizeTriangles(tris, { dx: 0.1, padCells: 1.5 })).toThrow(/padCells/);
  });

  it('refuses a grid larger than the cell budget', () => {
    // Guards against a user asking for 4 kHz in a concert hall and waiting for
    // an allocation failure instead of an error.
    expect(() =>
      voxelizeTriangles(boxSurfaces([0, 0, 0], [10, 10, 10]), { dx: 0.001 }),
    ).toThrow(/over the limit/);
  });
});
