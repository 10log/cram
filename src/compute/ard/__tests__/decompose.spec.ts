/**
 * Tests for the ARD rectangular decomposition (plan Phase 3).
 *
 * Correctness here is a partition property — every air cell covered exactly
 * once, no solid cell covered — so most of these build a grid directly rather
 * than going through the voxelizer, and check the cover against it.
 * `validateDecomposition` does the heavy checking; the tests assert it finds
 * nothing and that the box counts are what the algorithm should produce.
 */

import {
  decompose,
  validateDecomposition,
  type Decomposition,
} from '../decompose';
import {
  Cell,
  cellSizeFor,
  voxelizeTriangles,
  type VoxelGrid,
  type VoxelTriangle,
} from '../voxelize';
import { DctPartition } from '../dct-partition';
import { FdtdPartition } from '../fdtd-partition';
import { applyAllInterfaceForcing, findInterfaces } from '../interface';

/** A grid with no geometry behind it, for testing the cover directly. */
function gridFrom(
  nx: number,
  ny: number,
  nz: number,
  isAir: (i: number, j: number, k: number) => boolean,
): VoxelGrid {
  const cells = new Uint8Array(nx * ny * nz);
  let airCount = 0;
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        if (isAir(i, j, k)) {
          cells[i + nx * (j + ny * k)] = Cell.Air;
          airCount++;
        }
      }
    }
  }
  return {
    nx,
    ny,
    nz,
    dx: 0.05,
    origin: { x: 0, y: 0, z: 0 },
    cells,
    surfaceOf: new Int32Array(nx * ny * nz).fill(-1),
    airCount,
    solidCount: nx * ny * nz - airCount,
    leaked: false,
    warnings: [],
  };
}

function boxVolume(d: Decomposition): number {
  return d.boxes.reduce((t, b) => t + b.w * b.h * b.d, 0);
}

describe('decompose', () => {
  it('covers a rectangular room with exactly one box', () => {
    // The best case, and the one a shoebox produces: nothing to decompose.
    const grid = gridFrom(20, 16, 12, (i, j, k) =>
      i >= 2 && i < 18 && j >= 2 && j < 14 && k >= 2 && k < 10,
    );
    const d = decompose(grid);

    expect(d.boxes).toHaveLength(1);
    expect(d.boxes[0]).toEqual({ x: 2, y: 2, z: 2, w: 16, h: 12, d: 8 });
    expect(d.kinds).toEqual(['dct']);
    expect(d.coverage).toBe(1);
    expect(validateDecomposition(grid, d)).toEqual([]);
  });

  it('covers an L-shaped room with exactly two boxes', () => {
    // Air: x 0..19 / y 0..9, plus x 0..9 / y 10..19. One cell deep in z.
    const grid = gridFrom(20, 20, 1, (i, j) => (j < 10 ? i < 20 : i < 10));
    const d = decompose(grid);

    expect(d.boxes).toHaveLength(2);
    expect(d.coverage).toBe(1);
    expect(boxVolume(d)).toBe(grid.airCount);
    expect(validateDecomposition(grid, d)).toEqual([]);
  });

  it('covers a room with a pillar in the middle', () => {
    const grid = gridFrom(24, 24, 8, (i, j, k) => {
      const inRoom = i >= 1 && i < 23 && j >= 1 && j < 23 && k >= 1 && k < 7;
      const inPillar = i >= 10 && i < 14 && j >= 10 && j < 14;
      return inRoom && !inPillar;
    });
    const d = decompose(grid);

    expect(d.boxes.length).toBeGreaterThan(1);
    expect(d.coverage).toBe(1);
    expect(validateDecomposition(grid, d)).toEqual([]);
  });

  it('produces a disjoint cover on randomized air masks', () => {
    // The property that matters: whatever the shape, every air cell is in
    // exactly one box and no box touches solid. Deterministic PRNG so a
    // failure is reproducible.
    let state = 20260922;
    const rand = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 0x100000000;
    };

    for (let trial = 0; trial < 25; trial++) {
      const grid = gridFrom(12, 11, 7, () => rand() > 0.35);
      const d = decompose(grid, { minBoxEdge: 1 });

      expect(validateDecomposition(grid, d)).toEqual([]);
      expect(d.coverage).toBe(1);
      expect(boxVolume(d)).toBe(grid.airCount);
    }
  });

  it('handles a grid with no air at all', () => {
    const grid = gridFrom(6, 6, 6, () => false);
    const d = decompose(grid);
    expect(d.boxes).toHaveLength(0);
    expect(d.coverage).toBe(1);
    expect(validateDecomposition(grid, d)).toEqual([]);
  });

  it('handles a single isolated air cell', () => {
    const grid = gridFrom(6, 6, 6, (i, j, k) => i === 3 && j === 3 && k === 3);
    const d = decompose(grid, { minBoxEdge: 1 });
    expect(d.boxes).toEqual([{ x: 3, y: 3, z: 3, w: 1, h: 1, d: 1 }]);
    expect(validateDecomposition(grid, d)).toEqual([]);
  });

  it('marks boxes too thin for the interface stencil as FDTD', () => {
    // The 6th-order interface residual reads three cells either side of a
    // face. A box thinner than that cannot supply one, so it goes to an FDTD
    // partition, which zero-pads instead of mirroring — the reason Phase 4
    // implements one at all.
    // A wide room with a narrow corridor leading off it. The corridor has to
    // be narrow *and* not mergeable with the room — a thin strip spanning the
    // same x range would just extend the room's box.
    const grid = gridFrom(40, 40, 1, (i, j) => {
      const room = i >= 2 && i < 38 && j >= 2 && j < 30;
      const corridor = i >= 10 && i < 13 && j >= 30 && j < 38; // 3 cells wide
      return room || corridor;
    });
    const d = decompose(grid);

    expect(d.thinBoxCount).toBeGreaterThan(0);
    const thin = d.boxes.filter((_, n) => d.kinds[n] === 'fdtd');
    expect(thin.length).toBe(d.thinBoxCount);
    for (const box of thin) {
      expect(Math.min(box.w, box.h)).toBeLessThan(7);
    }
    expect(validateDecomposition(grid, d)).toEqual([]);
  });

  it('does not call a 2D run thin just because z is one cell', () => {
    // A 2D simulation is a 3D grid with nz === 1. That axis carries no
    // interface, so it must not push every box onto the FDTD path.
    const grid = gridFrom(30, 30, 1, (i, j) => i >= 2 && i < 28 && j >= 2 && j < 28);
    const d = decompose(grid);

    expect(d.boxes).toHaveLength(1);
    expect(d.kinds).toEqual(['dct']);
    expect(d.thinBoxCount).toBe(0);
  });

  it('keeps every box inside the air region', () => {
    const grid = gridFrom(16, 16, 16, (i, j, k) => {
      const r = Math.hypot(i - 8, j - 8, k - 8);
      return r < 6; // a ball, so boxes must staircase around a curved boundary
    });
    const d = decompose(grid, { minBoxEdge: 1 });

    expect(validateDecomposition(grid, d)).toEqual([]);
    expect(d.coverage).toBe(1);
  });

  describe('axis order', () => {
    /**
     * The plan claimed growing the longest run first "noticeably reduces the
     * box count and therefore the interface area". Measured, it does not: it
     * ties on every room-like shape and loses on ragged ones, so it is off by
     * default. These tests pin that result so the idea is not rediscovered.
     */
    it('makes no difference on room-like shapes', () => {
      const shapes: Array<[string, VoxelGrid]> = [
        [
          'corridor along y',
          gridFrom(6, 60, 6, (i, j, k) => i >= 1 && i < 5 && j >= 1 && j < 59 && k >= 1 && k < 5),
        ],
        [
          'L-shape',
          gridFrom(40, 40, 1, (i, j) => (j < 20 ? i < 40 : i < 12)),
        ],
        [
          'cross',
          gridFrom(30, 30, 1, (i, j) =>
            (i >= 12 && i < 18) || (j >= 12 && j < 18),
          ),
        ],
        [
          'room with pillar',
          gridFrom(24, 24, 6, (i, j, k) => {
            const inRoom = i >= 1 && i < 23 && j >= 1 && j < 23 && k >= 1 && k < 5;
            return inRoom && !(i >= 10 && i < 14 && j >= 10 && j < 14);
          }),
        ],
      ];

      for (const [label, grid] of shapes) {
        const smart = decompose(grid, { minBoxEdge: 1, longestAxisFirst: true });
        const naive = decompose(grid, { minBoxEdge: 1, longestAxisFirst: false });

        expect(validateDecomposition(grid, smart)).toEqual([]);
        expect(validateDecomposition(grid, naive)).toEqual([]);
        expect(
          smart.boxes.length,
          `${label}: ${smart.boxes.length} boxes with the heuristic vs ${naive.boxes.length} without`,
        ).toBe(naive.boxes.length);
      }
    });

    it('defaults to the fixed order', () => {
      const grid = gridFrom(14, 13, 5, (i, j, k) => (i * 7 + j * 5 + k * 3) % 4 !== 0);
      const byDefault = decompose(grid, { minBoxEdge: 1 });
      const fixed = decompose(grid, { minBoxEdge: 1, longestAxisFirst: false });
      expect(byDefault.boxes).toEqual(fixed.boxes);
    });

    it('is still a valid cover when the heuristic is enabled', () => {
      // It produces a different — and on ragged shapes, larger — cover, but
      // never an incorrect one.
      const grid = gridFrom(14, 13, 5, (i, j, k) => (i * 7 + j * 5 + k * 3) % 4 !== 0);
      const withHeuristic = decompose(grid, { minBoxEdge: 1, longestAxisFirst: true });
      expect(validateDecomposition(grid, withHeuristic)).toEqual([]);
      expect(withHeuristic.coverage).toBe(1);
    });

    });

  it('refuses a leaked grid', () => {
    // A room whose surfaces do not close has an air region spanning the whole
    // bounding box. Decomposing that produces a large, silent nonsense.
    const grid = gridFrom(8, 8, 8, () => true);
    grid.leaked = true;
    expect(() => decompose(grid)).toThrow(/leaked/);
  });

  it('rejects a malformed minBoxEdge', () => {
    const grid = gridFrom(8, 8, 8, () => true);
    expect(() => decompose(grid, { minBoxEdge: 0 })).toThrow(/minBoxEdge/);
    expect(() => decompose(grid, { minBoxEdge: 2.5 })).toThrow(/minBoxEdge/);
  });
});

describe('validateDecomposition', () => {
  it('catches a box that covers solid cells', () => {
    const grid = gridFrom(8, 8, 1, (i, j) => i < 4 && j < 4);
    const d = decompose(grid, { minBoxEdge: 1 });
    d.boxes[0] = { x: 0, y: 0, z: 0, w: 8, h: 8, d: 1 };
    expect(validateDecomposition(grid, d).join(' ')).toMatch(/covers solid cell/);
  });

  it('catches an uncovered air cell', () => {
    const grid = gridFrom(8, 8, 1, (i, j) => i < 4 && j < 4);
    const d = decompose(grid, { minBoxEdge: 1 });
    d.boxes[0] = { x: 0, y: 0, z: 0, w: 2, h: 2, d: 1 };
    expect(validateDecomposition(grid, d).join(' ')).toMatch(/not covered/);
  });

  it('catches overlapping boxes', () => {
    const grid = gridFrom(8, 8, 1, (i, j) => i < 4 && j < 4);
    const d = decompose(grid, { minBoxEdge: 1 });
    d.boxes.push({ ...d.boxes[0] });
    expect(validateDecomposition(grid, d).join(' ')).toMatch(/covered by boxes/);
  });
});

describe('voxelize -> decompose -> partitions', () => {
  /**
   * The pipeline end to end, on geometry rather than a hand-built mask: a
   * shoebox and an L-shaped room go through the voxelizer, the decomposition,
   * and into real partitions with real interfaces. This is the first test that
   * exercises Phases 2, 3, 4 and 5 together, and it is what Phase 6's driver
   * will do for every run.
   */
  const C = 343;

  type P = [number, number, number];
  const quad = (a: P, b: P, c: P, d: P, s: number): VoxelTriangle[] => {
    const tri = (p: P, q: P, r: P): VoxelTriangle => ({
      ax: p[0], ay: p[1], az: p[2],
      bx: q[0], by: q[1], bz: q[2],
      cx: r[0], cy: r[1], cz: r[2],
      surfaceIndex: s,
    });
    return [tri(a, b, c), tri(a, c, d)];
  };
  const shoebox = (min: P, max: P): VoxelTriangle[] => {
    const [x0, y0, z0] = min;
    const [x1, y1, z1] = max;
    return [
      ...quad([x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], 0),
      ...quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], 1),
      ...quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], 2),
      ...quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], 3),
      ...quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], 4),
      ...quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], 5),
    ];
  };

  it('turns a shoebox into a single DCT partition that runs', () => {
    const dx = cellSizeFor(500); // ~0.264 m
    const grid = voxelizeTriangles(shoebox([0, 0, 0], [6, 3, 4]), {
      dx,
      seed: { x: 3, y: 1.5, z: 2 },
    });
    expect(grid.leaked).toBe(false);

    const d = decompose(grid);
    expect(validateDecomposition(grid, d)).toEqual([]);
    expect(d.boxes).toHaveLength(1);
    expect(d.kinds).toEqual(['dct']);

    const dt = (0.4 * dx) / C;
    const partition = new DctPartition({ box: d.boxes[0], dx, c: C, dt });
    for (let s = 0; s < 50; s++) {
      partition.addForce(2, 2, 2, 1e4);
      partition.step();
    }
    let peak = 0;
    for (const v of partition.pressure) peak = Math.max(peak, Math.abs(v));
    expect(Number.isFinite(peak)).toBe(true);
    expect(peak).toBeGreaterThan(0);
  });

  it('turns an L-shaped room into coupled partitions with a live interface', () => {
    const dx = 0.1;
    // Air: x 0..4 / y 0..2, plus x 0..2 / y 2..4. Height 0..2.
    const triangles = [
      ...quad([0, 0, 0], [4, 0, 0], [4, 0, 2], [0, 0, 2], 0),
      ...quad([2, 2, 0], [4, 2, 0], [4, 2, 2], [2, 2, 2], 1),
      ...quad([2, 2, 0], [2, 4, 0], [2, 4, 2], [2, 2, 2], 2),
      ...quad([0, 4, 0], [2, 4, 0], [2, 4, 2], [0, 4, 2], 3),
      ...quad([0, 0, 0], [0, 4, 0], [0, 4, 2], [0, 0, 2], 4),
      ...quad([4, 0, 0], [4, 2, 0], [4, 2, 2], [4, 0, 2], 5),
      ...quad([0, 0, 0], [4, 0, 0], [4, 4, 0], [0, 4, 0], 6),
      ...quad([0, 0, 2], [4, 0, 2], [4, 4, 2], [0, 4, 2], 7),
    ];
    const grid = voxelizeTriangles(triangles, { dx, seed: { x: 1, y: 1, z: 1 } });
    expect(grid.leaked).toBe(false);

    const d = decompose(grid);
    expect(validateDecomposition(grid, d)).toEqual([]);
    expect(d.boxes.length).toBeGreaterThan(1);

    const dt = (0.4 * dx) / C;
    const partitions = d.boxes.map((box, n) =>
      d.kinds[n] === 'dct'
        ? new DctPartition({ box, dx, c: C, dt })
        : new FdtdPartition({ box, dx, c: C, dt }),
    );

    // The decomposition's boxes must actually touch, or the room is in pieces.
    const interfaces = findInterfaces(partitions);
    expect(interfaces.length).toBeGreaterThan(0);

    // Drive one partition and confirm energy reaches another through the seam.
    const driven = partitions[0];
    const other = partitions[partitions.length - 1];
    for (let s = 0; s < 120; s++) {
      applyAllInterfaceForcing(interfaces, C, dx);
      driven.addForce(1, 1, 1, 1e4);
      for (const p of partitions) p.step();
    }

    let reached = 0;
    for (const v of other.pressure) reached = Math.max(reached, Math.abs(v));
    expect(Number.isFinite(reached)).toBe(true);
    expect(reached).toBeGreaterThan(0);
  });
});
