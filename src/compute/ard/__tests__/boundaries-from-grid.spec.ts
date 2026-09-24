/**
 * Tests for impedance-boundary planning (`boundaries-from-grid.ts`).
 *
 * `impedance.spec.ts` checks that the boundary condition delivers the
 * absorption it is given. These check that the right faces get one — the same
 * three geometric hazards `walls-from-grid.spec.ts` covers, minus the two that
 * only exist because a slab needs somewhere to go, plus the one that is new:
 * the planner must not put a boundary where a neighbouring partition is, or the
 * interface residual and the boundary residual both fire on the same cells and
 * the join becomes an absorbing wall in the middle of the room.
 */

import { maxRandomIncidenceAbsorption, parisAbsorption } from '../../acoustics/random-incidence';
import { describe, expect, it } from 'vitest';

import {
  buildImpedanceBoundaries,
  planImpedanceBoundaries,
} from '../boundaries-from-grid';
import { decompose } from '../decompose';
import { DctPartition } from '../dct-partition';
import { impedanceForMaterialAbsorption } from '../impedance';
import { Axis, type Partition } from '../partition';
import { planWalls } from '../walls-from-grid';
import { Cell, type VoxelGrid } from '../voxelize';

const C = 343;
const DX = 0.1;

/** A grid whose air cells are wherever `isAir` says, with materials on the shell. */
function gridFrom(
  nx: number,
  ny: number,
  nz: number,
  isAir: (i: number, j: number, k: number) => boolean,
): VoxelGrid {
  const cells = new Uint8Array(nx * ny * nz);
  const surfaceOf = new Int32Array(nx * ny * nz).fill(-1);
  const at = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  let airCount = 0;

  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        if (isAir(i, j, k)) {
          cells[at(i, j, k)] = Cell.Air;
          airCount++;
        }
      }
    }
  }
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        if (cells[at(i, j, k)] === Cell.Air) continue;
        const touchesAir = [
          [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
        ].some(([di, dj, dk]) => {
          const [a, b, d] = [i + di, j + dj, k + dk];
          return (
            a >= 0 && b >= 0 && d >= 0 && a < nx && b < ny && d < nz &&
            cells[at(a, b, d)] === Cell.Air
          );
        });
        if (touchesAir) surfaceOf[at(i, j, k)] = 0;
      }
    }
  }

  return {
    nx, ny, nz,
    dx: DX,
    origin: { x: 0, y: 0, z: 0 },
    cells,
    surfaceOf,
    airCount,
    solidCount: nx * ny * nz - airCount,
    leaked: false,
    warnings: [],
  };
}

/** A shoebox of air with a one-cell shell and `pad` cells beyond it. */
function shoebox(air: number, pad = 0): VoxelGrid {
  const margin = 1 + pad;
  const n = air + 2 * margin;
  return gridFrom(n, n, n, (i, j, k) =>
    i >= margin && i < margin + air &&
    j >= margin && j < margin + air &&
    k >= margin && k < margin + air);
}

function partitionsFor(grid: VoxelGrid, boxes: readonly { x: number }[]): Partition[] {
  return (boxes as { x: number; y: number; z: number; w: number; h: number; d: number }[]).map(
    (box) => new DctPartition({ box, dx: grid.dx, c: C, dt: (0.4 * grid.dx) / C }),
  );
}

describe('planImpedanceBoundaries', () => {
  it('covers all six faces of a shoebox, once each, with no cells added', () => {
    const air = 10;
    const grid = shoebox(air);
    const decomposition = decompose(grid);
    const plan = planImpedanceBoundaries(grid, decomposition, { absorptionFor: () => 0.3 });

    expect(plan.faces).toHaveLength(6);
    // One boundary cell per face cell, and a cube of `air` cells has 6·air²
    // faces. That is the whole of the cost: no cell of the grid is added.
    expect(plan.boundaryCells).toBe(6 * air * air);
    expect(plan.skippedRigid).toBe(0);
    expect(plan.maxAbsorption).toBeCloseTo(0.3, 12);

    const seen = new Set<string>();
    for (const face of plan.faces) {
      const key = `${face.axis}${face.high}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
      expect(face.surfaceIndex).toBe(0);
    }
  });

  it('needs no padding, where the slab planner needs nine cells of it', () => {
    // This is the headline practical difference. `voxelizeTriangles` pads by one
    // cell by default; `planWalls` drops every face at that setting and
    // `createArdSimulation` throws rather than return a silently rigid room.
    const grid = shoebox(10, 0);
    const decomposition = decompose(grid);

    const slabs = planWalls(grid, decomposition, { absorptionFor: () => 0.3 });
    expect(slabs.faces).toHaveLength(0);
    expect(slabs.droppedForSpace).toBe(6);

    const boundaries = planImpedanceBoundaries(grid, decomposition, {
      absorptionFor: () => 0.3,
    });
    expect(boundaries.faces).toHaveLength(6);
    expect(boundaries.warnings).toHaveLength(0);
  });

  it('leaves a face with nothing to absorb alone, and says so', () => {
    const grid = shoebox(8);
    const plan = planImpedanceBoundaries(grid, decompose(grid), { absorptionFor: () => 0 });
    expect(plan.faces).toHaveLength(0);
    expect(plan.skippedRigid).toBe(6);
    expect(plan.boundaryCells).toBe(0);
    expect(plan.maxAbsorption).toBe(0);
    expect(plan.warnings.join(' ')).toMatch(/absorb nothing/);
  });

  it('reports the most absorbing surface, since that is what sets the time step', () => {
    const grid = shoebox(8);
    // Two materials: the floor absorbs a lot, everything else a little. The
    // plan has to surface the maximum, not the mean or the first — a single
    // highly absorbing face diverges at a Courant number the rest tolerate.
    const surfaceOf = Int32Array.from(grid.surfaceOf);
    for (let k = 0; k < grid.nz; k++) {
      for (let i = 0; i < grid.nx; i++) {
        const idx = i + grid.nx * (0 + grid.ny * k); // the low-y shell
        if (surfaceOf[idx] >= 0) surfaceOf[idx] = 1;
      }
    }
    const marked: VoxelGrid = { ...grid, surfaceOf };
    const plan = planImpedanceBoundaries(marked, decompose(marked), {
      absorptionFor: (index) => (index === 1 ? 0.9 : 0.1),
    });
    expect(plan.faces.length).toBeGreaterThan(0);
    expect(plan.maxAbsorption).toBeCloseTo(0.9, 12);
  });

  it('puts no boundary where two partitions join', () => {
    // An L-shaped room decomposes into more than one box, and the faces where
    // those boxes meet are fictitious — Phase 5's interface forcing handles
    // them. A boundary there as well would make the middle of the room
    // absorbing, which reads as a plausible reverberation time and is wrong.
    const n = 16;
    const grid = gridFrom(n, n, n, (i, j, k) => {
      const inBox = i >= 1 && i < n - 1 && j >= 1 && j < n - 1 && k >= 1 && k < n - 1;
      if (!inBox) return false;
      // Bite a quadrant out, making an L in the x-y plane.
      return !(i >= n / 2 && j >= n / 2);
    });
    const decomposition = decompose(grid);
    expect(decomposition.boxes.length).toBeGreaterThan(1);

    const plan = planImpedanceBoundaries(grid, decomposition, { absorptionFor: () => 0.4 });

    const ORIGIN = ['x', 'y', 'z'] as const;
    const EXTENT = ['w', 'h', 'd'] as const;
    for (const face of plan.faces) {
      const box = decomposition.boxes[face.boxIndex];
      const outer = face.high
        ? box[ORIGIN[face.axis]] + box[EXTENT[face.axis]]
        : box[ORIGIN[face.axis]] - 1;
      const [uAxis, vAxis] =
        face.axis === Axis.X ? [Axis.Y, Axis.Z] :
        face.axis === Axis.Y ? [Axis.X, Axis.Z] : [Axis.X, Axis.Y];

      for (let v = face.vMin; v < face.vMax; v++) {
        for (let u = face.uMin; u < face.uMax; u++) {
          const at = [0, 0, 0];
          at[face.axis] = outer;
          at[uAxis] = u;
          at[vAxis] = v;
          const idx = at[0] + grid.nx * (at[1] + grid.ny * at[2]);
          // Every boundary cell must have non-air beyond it. Air beyond means a
          // neighbouring partition, and the interface already owns that face.
          expect(grid.cells[idx]).not.toBe(Cell.Air);
        }
      }
    }
  });

  it('treats the grid edge as surface, not as a neighbour', () => {
    // A box flush with the grid edge has nothing beyond it to inspect. Reading
    // that as "not air, so this is a surface" is what keeps it absorbing;
    // reading it as air makes the planner believe a neighbouring partition is
    // there and leave the face rigid, with the interface forcing that would
    // have handled a real neighbour never created either. Defensive in
    // practice — `voxelizeTriangles` always pads — but the shared helper
    // `exposedFaceRects` serves the slab planner too, where the same slip would
    // silently drop a wall.
    const n = 10;
    const grid = gridFrom(n, n, n, () => true); // air everywhere, no shell
    const decomposition = decompose(grid);
    expect(decomposition.boxes).toHaveLength(1);

    // No solid cell means no surface index anywhere, so absorption comes from
    // the -1 fallback; what matters here is that six faces are planned at all.
    const plan = planImpedanceBoundaries(grid, decomposition, { absorptionFor: () => 0.4 });
    expect(plan.faces).toHaveLength(6);
    expect(plan.boundaryCells).toBe(6 * n * n);
    for (const face of plan.faces) expect(face.surfaceIndex).toBe(-1);
  });

  it('skips the collapsed axis of a 2D slice', () => {
    // A 2D run is a plane through the room. Its two faces normal to the
    // collapsed axis are the slice itself, not a floor and a ceiling one cell
    // apart, so they carry no material — the same rule `planWalls` applies.
    const grid = gridFrom(14, 14, 1, (i, j) => i >= 1 && i < 13 && j >= 1 && j < 13);
    const plan = planImpedanceBoundaries(grid, decompose(grid), { absorptionFor: () => 0.4 });
    expect(plan.faces).toHaveLength(4);
    for (const face of plan.faces) expect(face.axis).not.toBe(Axis.Z);
  });
});

describe('buildImpedanceBoundaries', () => {
  it('attaches each face to the partition its box index names', () => {
    const grid = shoebox(8);
    const decomposition = decompose(grid);
    const plan = planImpedanceBoundaries(grid, decomposition, { absorptionFor: () => 0.5 });
    const partitions = partitionsFor(grid, decomposition.boxes);

    const { boundaries, warnings } = buildImpedanceBoundaries(plan, partitions, {
      absorptionFor: () => 0.5,
    });
    expect(warnings).toHaveLength(0);
    expect(boundaries).toHaveLength(plan.faces.length);
    for (let i = 0; i < boundaries.length; i++) {
      expect(boundaries[i].partition).toBe(partitions[plan.faces[i].boxIndex]);
      // The material's 0.5 is random-incidence absorption (#221): the wall
      // built absorbs 0.5 of a diffuse field, not of a normal-incidence wave.
      expect(boundaries[i].impedance).toBeCloseTo(impedanceForMaterialAbsorption(0.5, 3), 12);
      expect(parisAbsorption(boundaries[i].impedance)).toBeCloseTo(0.5, 9);
    }
    // The boundaries' cells add up to what the plan promised.
    expect(boundaries.reduce((t, b) => t + b.cellCount, 0)).toBe(plan.boundaryCells);
  });

  it('builds the most absorbing wall for chamber values above the model maximum, and says so once per surface', () => {
    // Chamber data exceeds the 0.951 a locally-reacting wall can absorb from a
    // diffuse field, and can exceed 1. Neither throws (#221); both get the
    // peak wall, and the driver hears about it — once per surface, however
    // many faces that surface covers.
    const grid = shoebox(8);
    const decomposition = decompose(grid);
    const partitions = partitionsFor(grid, decomposition.boxes);
    const peak = impedanceForMaterialAbsorption(maxRandomIncidenceAbsorption(3), 3);
    for (const alpha of [0.97, 1, 1.15]) {
      const plan = planImpedanceBoundaries(grid, decomposition, { absorptionFor: () => alpha });
      expect(plan.faces.length).toBeGreaterThan(1);
      const { boundaries, warnings } = buildImpedanceBoundaries(plan, partitions, {
        absorptionFor: () => alpha,
      });
      expect(boundaries).toHaveLength(plan.faces.length);
      for (const b of boundaries) expect(b.impedance).toBe(peak);
      const overLimit = warnings.filter((w) => /more than a locally-reacting wall can absorb/.test(w));
      expect([alpha, overLimit.length]).toEqual([alpha, 1]);
      expect(overLimit[0]).toContain(alpha.toFixed(3));
    }
    // Below the maximum, no such warning.
    const plan = planImpedanceBoundaries(grid, decomposition, { absorptionFor: () => 0.9 });
    const { warnings } = buildImpedanceBoundaries(plan, partitions, { absorptionFor: () => 0.9 });
    expect(warnings.some((w) => /locally-reacting wall/.test(w))).toBe(false);
  });

  it('still refuses a broken material coefficient loudly', () => {
    for (const bad of [NaN, -0.1, Infinity]) {
      expect(() => impedanceForMaterialAbsorption(bad, 3)).toThrow(/finite number >= 0/);
    }
  });

  it('refuses a partition list that is not in decomposition order', () => {
    // The plan indexes by box. A caller passing wall slabs, or a filtered list,
    // would silently attach a face to the wrong partition — a boundary in the
    // middle of the room, absorbing.
    const grid = shoebox(8);
    const decomposition = decompose(grid);
    const plan = planImpedanceBoundaries(grid, decomposition, { absorptionFor: () => 0.5 });
    expect(() =>
      buildImpedanceBoundaries(plan, [], { absorptionFor: () => 0.5 }),
    ).toThrow(/decomposition order/);
  });

  it('skips a face whose material turned rigid between plan and build', () => {
    const grid = shoebox(8);
    const decomposition = decompose(grid);
    const plan = planImpedanceBoundaries(grid, decomposition, { absorptionFor: () => 0.5 });
    const partitions = partitionsFor(grid, decomposition.boxes);

    const { boundaries, warnings } = buildImpedanceBoundaries(plan, partitions, {
      absorptionFor: () => 0,
    });
    expect(boundaries).toHaveLength(0);
    expect(warnings.join(' ')).toMatch(/absorbs nothing at build time/);
  });
});
