/**
 * Tests for wall-slab planning (plan Phase 6, `walls-from-grid.ts`).
 *
 * `simulation.spec.ts` checks that walls absorb. These check the three
 * geometric hazards the planner exists to avoid, each of which produces a
 * plausible-looking simulation when it goes wrong:
 *
 *  - **Corners.** A `PmlPartition` damps one axis. Two slabs sharing a cell
 *    would need two, which it does not implement — so no cell may be inside
 *    two slabs.
 *  - **Partly-shared faces.** Half a face against a neighbouring partition and
 *    half against a wall. A slab laid over the whole face lands on top of the
 *    neighbour's air.
 *  - **Thin solid.** A pillar with air on both sides. Two slabs growing inward
 *    would meet in the middle.
 *
 * All three are silent failures: the simulation runs and returns numbers.
 */

import { decompose } from '../decompose';
import { Axis } from '../partition';
import { Cell, type VoxelGrid } from '../voxelize';
import {
  DEFAULT_WALL_THICKNESS,
  planWalls,
  type WallFace,
} from '../walls-from-grid';

/**
 * A grid whose air cells are wherever `isAir` says.
 *
 * Every solid cell touching air is given a surface index, as a real
 * voxelization would, so faces are not skipped for want of a material.
 */
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
          const [a, b, c] = [i + di, j + dj, k + dk];
          return (
            a >= 0 && b >= 0 && c >= 0 && a < nx && b < ny && c < nz &&
            cells[at(a, b, c)] === Cell.Air
          );
        });
        if (touchesAir) surfaceOf[at(i, j, k)] = 0;
      }
    }
  }

  return {
    nx, ny, nz,
    dx: 0.1,
    origin: { x: 0, y: 0, z: 0 },
    cells,
    surfaceOf,
    airCount,
    solidCount: nx * ny * nz - airCount,
    leaked: false,
    warnings: [],
  };
}

/** Every cell the planned slabs occupy, counted. */
function slabOccupancy(grid: VoxelGrid, faces: WallFace[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const face of faces) {
    const { box } = face;
    for (let k = box.z; k < box.z + box.d; k++) {
      for (let j = box.y; j < box.y + box.h; j++) {
        for (let i = box.x; i < box.x + box.w; i++) {
          const idx = i + grid.nx * (j + grid.ny * k);
          counts.set(idx, (counts.get(idx) ?? 0) + 1);
        }
      }
    }
  }
  return counts;
}

describe('planWalls corners', () => {
  it('never puts a cell inside two slabs, and never inside the room', () => {
    // A shoebox has eight corners and twelve edges — every place two faces
    // meet. Slabs clipped to their own face's extent leave those regions
    // empty; slabs extended to the padding would overlap in all twenty.
    const pad = DEFAULT_WALL_THICKNESS + 1;
    const air = 14;
    const margin = 1 + pad;
    const n = air + 2 * margin;
    const grid = gridFrom(n, n, n, (i, j, k) =>
      i >= margin && i < margin + air &&
      j >= margin && j < margin + air &&
      k >= margin && k < margin + air);

    const plan = planWalls(grid, decompose(grid));
    expect(plan.faces.length).toBe(6);
    expect(plan.droppedForSpace).toBe(0);

    const occupancy = slabOccupancy(grid, plan.faces);
    const doubled = [...occupancy.values()].filter((count) => count > 1);
    expect(doubled).toHaveLength(0);

    // And nothing landed in the air, which would put a damping layer inside
    // the room itself.
    for (const idx of occupancy.keys()) {
      expect(grid.cells[idx]).not.toBe(Cell.Air);
    }
    expect(occupancy.size).toBe(plan.slabCells);
  });
});

describe('planWalls on partly-shared faces', () => {
  /**
   * An L-shaped room: the decomposition splits it into at least two boxes, and
   * the inside corner gives at least one face that is air on part of its span
   * and solid on the rest.
   */
  function lRoom() {
    const pad = DEFAULT_WALL_THICKNESS + 1;
    const margin = 1 + pad;
    // Arms 20x10 and 10x20 in the xy plane, 12 deep in z.
    const nx = 20 + 2 * margin;
    const ny = 20 + 2 * margin;
    const nz = 12 + 2 * margin;
    return gridFrom(nx, ny, nz, (i, j, k) => {
      const x = i - margin;
      const y = j - margin;
      const z = k - margin;
      if (x < 0 || y < 0 || z < 0 || x >= 20 || y >= 20 || z >= 12) return false;
      return y < 10 || x < 10; // the L
    });
  }

  it('covers only the exposed part of a face, never the neighbour', () => {
    const grid = lRoom();
    const decomposition = decompose(grid);
    expect(decomposition.boxes.length).toBeGreaterThan(1);

    const plan = planWalls(grid, decomposition);
    expect(plan.faces.length).toBeGreaterThan(6); // the L needs more than a box does

    const occupancy = slabOccupancy(grid, plan.faces);
    for (const idx of occupancy.keys()) {
      // The decisive check: no slab cell is air. A slab laid across a whole
      // partly-shared face would sit in the neighbouring partition's air, and
      // the two would then be solving the same cells with different equations.
      expect(grid.cells[idx]).not.toBe(Cell.Air);
    }
    expect([...occupancy.values()].filter((c) => c > 1)).toHaveLength(0);

    // Specifically: at least one face rectangle is narrower than the box face
    // it sits on, which is what "partly shared" means.
    const narrower = plan.faces.some((face) => {
      const box = decomposition.boxes[face.boxIndex];
      const [u, v] =
        face.axis === Axis.X ? [box.h, box.d]
          : face.axis === Axis.Y ? [box.w, box.d]
            : [box.w, box.h];
      const [su, sv] =
        face.axis === Axis.X ? [face.box.h, face.box.d]
          : face.axis === Axis.Y ? [face.box.w, face.box.d]
            : [face.box.w, face.box.h];
      return su < u || sv < v;
    });
    expect(narrower).toBe(true);
  });

  it('covers exactly the solid-facing part of a partly-shared face', () => {
    const grid = lRoom();
    const decomposition = decompose(grid);
    const plan = planWalls(grid, decomposition);
    const occupancy = slabOccupancy(grid, plan.faces);

    const index = (i: number, j: number, k: number) => i + grid.nx * (j + grid.ny * k);
    let partlySharedFaces = 0;
    /** Face cells against another partition's air that a slab covered anyway. */
    let coveredShared = 0;
    /** Face cells against solid that got no slab. */
    let uncoveredExposed = 0;

    // Walk every box face cell and compare what the planner did against the
    // mask rule: a slab where the cell beyond is solid, nothing where it is
    // another partition's air.
    for (const box of decomposition.boxes) {
      for (const axis of [Axis.X, Axis.Y, Axis.Z]) {
        for (const high of [false, true]) {
          let exposed = 0;
          let shared = 0;

          const lo = [box.x, box.y, box.z];
          const extent = [box.w, box.h, box.d];
          const outer = high ? lo[axis] + extent[axis] : lo[axis] - 1;
          const [uAxis, vAxis] =
            axis === Axis.X ? [Axis.Y, Axis.Z]
              : axis === Axis.Y ? [Axis.X, Axis.Z]
                : [Axis.X, Axis.Y];
          const [uSpan, vSpan] = [extent[uAxis], extent[vAxis]];

          for (let v = 0; v < vSpan; v++) {
            for (let u = 0; u < uSpan; u++) {
              const at = [0, 0, 0];
              at[axis] = outer;
              at[uAxis] = lo[uAxis] + u;
              at[vAxis] = lo[vAxis] + v;
              if (
                at[0] < 0 || at[1] < 0 || at[2] < 0 ||
                at[0] >= grid.nx || at[1] >= grid.ny || at[2] >= grid.nz
              ) {
                continue;
              }
              const idx = index(at[0], at[1], at[2]);
              const covered = (occupancy.get(idx) ?? 0) > 0;
              if (grid.cells[idx] === Cell.Air) {
                shared++;
                if (covered) coveredShared++;
              } else {
                exposed++;
                if (!covered) uncoveredExposed++;
              }
            }
          }

          if (exposed > 0 && shared > 0) partlySharedFaces++;
        }
      }
    }

    // The L's inside corner has to have produced at least one partly-shared
    // face — otherwise the walk above proved nothing about the case it is for.
    expect(partlySharedFaces).toBeGreaterThan(0);

    // The hard rule: never a slab over another partition's air. Phase 5's
    // interface forcing owns those cells, and a slab there would be a second
    // solver on the same grid points.
    expect(coveredShared).toBe(0);

    // The soft one: a solid-facing cell may go uncovered, but only because a
    // rectangle was dropped — which the plan must have counted and said so.
    // The L's concave corner is exactly where that happens: the two faces
    // meeting there want the same cells and slabs may not overlap, so one
    // loses. Silent coverage loss is the thing this rules out.
    if (uncoveredExposed > 0) {
      expect(plan.droppedForSpace).toBeGreaterThan(0);
      expect(plan.warnings.join(' ')).toMatch(/left rigid/);
    }
  });
});

describe('planWalls against thin solid', () => {
  /**
   * Two air regions either side of a solid pillar `pillar` cells across. Both
   * want to grow a slab into it, and two slabs may not share a cell.
   */
  function pillarPlan(pillar: number) {
    const pad = DEFAULT_WALL_THICKNESS + 1;
    const margin = 1 + pad;
    const roomX = 16;
    const ny = 16;
    const nz = 14;
    const nxTotal = 2 * roomX + pillar + 2 * margin;

    const grid = gridFrom(nxTotal, ny + 2 * margin, nz + 2 * margin, (i, j, k) => {
      const y = j - margin;
      const z = k - margin;
      if (y < 0 || z < 0 || y >= ny || z >= nz) return false;
      const x = i - margin;
      if (x < 0 || x >= 2 * roomX + pillar) return false;
      return x < roomX || x >= roomX + pillar; // the pillar itself is solid
    });

    const plan = planWalls(grid, decompose(grid));
    const pillarLo = margin + roomX;
    const pillarHi = margin + roomX + pillar; // one past the end
    return {
      grid,
      plan,
      pillarLo,
      pillarHi,
      intoPillar: plan.faces.filter(
        (f) => f.axis === Axis.X && f.box.x >= pillarLo && f.box.x + f.box.w <= pillarHi,
      ),
    };
  }

  /** No cell in two slabs, and no slab reaching through into air. */
  function expectDisjointAndSolid(grid: VoxelGrid, faces: WallFace[]) {
    const occupancy = slabOccupancy(grid, faces);
    expect([...occupancy.values()].filter((count) => count > 1)).toHaveLength(0);
    for (const idx of occupancy.keys()) {
      expect(grid.cells[idx]).not.toBe(Cell.Air);
    }
  }

  it('shares a pillar between two faces, the second taking what is left', () => {
    // 12 cells: the first face takes the ladder's 8, and 4 remain — exactly
    // the thinnest rung. Both faces get a layer and neither reaches the other.
    const { grid, plan, intoPillar, pillarLo, pillarHi } = pillarPlan(12);

    expectDisjointAndSolid(grid, plan.faces);
    expect(intoPillar).toHaveLength(2);
    expect(intoPillar.reduce((t, f) => t + f.thickness, 0)).toBeLessThanOrEqual(12);
    // The second is thinner than the first: it is fitting into what is left,
    // not helping itself to the full thickness.
    expect(Math.max(...intoPillar.map((f) => f.thickness))).toBe(DEFAULT_WALL_THICKNESS);
    expect(Math.min(...intoPillar.map((f) => f.thickness))).toBeLessThan(
      DEFAULT_WALL_THICKNESS,
    );
    // Both are inside the pillar, on opposite sides of it.
    for (const face of intoPillar) {
      expect(face.box.x).toBeGreaterThanOrEqual(pillarLo);
      expect(face.box.x + face.box.w).toBeLessThanOrEqual(pillarHi);
    }
    expect(intoPillar[0].high).not.toBe(intoPillar[1].high);
  });

  it('drops the second face when what is left of a pillar is too thin', () => {
    // 10 cells: the first face takes 8 and leaves 2, below the 4 the thinnest
    // useful layer needs. The alternative — letting it overlap — would have
    // two damped partitions solving the same cells.
    const { grid, plan, intoPillar } = pillarPlan(10);

    expectDisjointAndSolid(grid, plan.faces);
    expect(intoPillar).toHaveLength(1);
    expect(intoPillar[0].thickness).toBe(DEFAULT_WALL_THICKNESS);
    expect(plan.droppedForSpace).toBeGreaterThan(0);
    expect(plan.warnings.join(' ')).toMatch(/left rigid/);
  });

  it('drops a face with too little solid behind it and says which', () => {
    // One cell of shell and nothing else: below the four cells the thinnest
    // rung of the ladder needs.
    const air = 12;
    const n = air + 2;
    const grid = gridFrom(n, n, n, (i, j, k) =>
      i >= 1 && i < 1 + air && j >= 1 && j < 1 + air && k >= 1 && k < 1 + air);

    const plan = planWalls(grid, decompose(grid));
    expect(plan.faces).toHaveLength(0);
    expect(plan.droppedForSpace).toBe(6);
    expect(plan.skippedRigid).toBe(0);
    expect(plan.warnings.join(' ')).toMatch(/left rigid/);
    expect(plan.warnings.join(' ')).toMatch(/padCells >= 9/);
  });
});

describe('planWalls and rigid materials', () => {
  it('skips a face whose material absorbs nothing and frees its cells', () => {
    const pad = DEFAULT_WALL_THICKNESS + 1;
    const air = 14;
    const margin = 1 + pad;
    const n = air + 2 * margin;
    const grid = gridFrom(n, n, n, (i, j, k) =>
      i >= margin && i < margin + air &&
      j >= margin && j < margin + air &&
      k >= margin && k < margin + air);
    const decomposition = decompose(grid);

    const all = planWalls(grid, decomposition, { absorptionFor: () => 0 });
    expect(all.faces).toHaveLength(0);
    expect(all.skippedRigid).toBe(6);
    expect(all.droppedForSpace).toBe(0);
    expect(all.slabCells).toBe(0);

    const some = planWalls(grid, decomposition, { absorptionFor: () => 0.4 });
    expect(some.faces).toHaveLength(6);
    expect(some.skippedRigid).toBe(0);
  });
});
