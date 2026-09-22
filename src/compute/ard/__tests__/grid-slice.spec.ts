/**
 * Tests for taking a plane out of a voxel grid (plan Phase 9).
 *
 * The thing to get right is which axis disappears. CRAM rooms are Y-up, so the
 * floor plan is the world XZ plane and the axis that collapses is world Y —
 * which is grid axis 1, not the 2 that "the third axis" suggests. Getting that
 * backwards produces a perfectly healthy simulation of the wrong plane.
 */

import {
  collapsedAxis,
  layerForCoordinate,
  sliceGrid,
  sliceHasAir,
  widestLayer,
} from '../grid-slice';
import { Cell, type VoxelGrid } from '../voxelize';

/** A grid whose air is whatever `isAir` says, with per-cell surface indices. */
function gridFrom(
  nx: number,
  ny: number,
  nz: number,
  isAir: (i: number, j: number, k: number) => boolean,
  origin = { x: 0, y: 0, z: 0 },
): VoxelGrid {
  const cells = new Uint8Array(nx * ny * nz);
  const surfaceOf = new Int32Array(nx * ny * nz).fill(-1);
  let airCount = 0;
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const index = i + nx * (j + ny * k);
        if (isAir(i, j, k)) {
          cells[index] = Cell.Air;
          airCount++;
        } else {
          // A distinct index per cell, so a mis-mapped slice shows up as the
          // wrong surface rather than as a coincidence.
          surfaceOf[index] = index;
        }
      }
    }
  }
  return {
    nx, ny, nz, dx: 0.1, origin, cells, surfaceOf, airCount,
    solidCount: nx * ny * nz - airCount,
    leaked: false,
    warnings: ['a warning from the voxelizer'],
  };
}

describe('collapsedAxis', () => {
  it('collapses world Y for a floor plan and world Z for a section', () => {
    // The whole point of the naming: `xz` keeps x and z, so y goes.
    expect(collapsedAxis('xz')).toBe(1);
    expect(collapsedAxis('xy')).toBe(2);
  });
});

describe('sliceGrid', () => {
  const grid = gridFrom(5, 4, 3, (i, j, k) => i > 0 && i < 4 && j > 0 && j < 3 && k > 0 && k < 2);

  it('keeps the in-plane axes and collapses the named one', () => {
    const plan = sliceGrid(grid, 1, 2);
    expect([plan.nx, plan.ny, plan.nz]).toEqual([5, 1, 3]);

    const section = sliceGrid(grid, 2, 1);
    expect([section.nx, section.ny, section.nz]).toEqual([5, 4, 1]);
  });

  it('carries the right cells and surface indices across', () => {
    const layer = 2;
    const plan = sliceGrid(grid, 1, layer);
    for (let k = 0; k < grid.nz; k++) {
      for (let i = 0; i < grid.nx; i++) {
        const from = i + grid.nx * (layer + grid.ny * k);
        const to = i + plan.nx * k; // ny === 1
        expect(plan.cells[to]).toBe(grid.cells[from]);
        expect(plan.surfaceOf[to]).toBe(grid.surfaceOf[from]);
      }
    }
  });

  it('recounts the air rather than inheriting the volume figure', () => {
    // A layer of a 3D grid holds a fraction of its air, and a solver that
    // trusted the inherited count would size buffers for a room it is not
    // simulating.
    const plan = sliceGrid(grid, 1, 2);
    expect(plan.airCount).toBeLessThan(grid.airCount);
    expect(plan.airCount + plan.solidCount).toBe(plan.nx * plan.ny * plan.nz);

    // A layer with no air is legal here and refused by the caller.
    const empty = sliceGrid(grid, 1, 0);
    expect(empty.airCount).toBe(0);
    expect(sliceHasAir(grid, 1, 0)).toBe(false);
    expect(sliceHasAir(grid, 1, 2)).toBe(true);
  });

  it('moves the origin onto the plane', () => {
    // So `worldToCell` on the sliced grid puts a point's out-of-plane
    // coordinate on layer 0, which is where the only layer is.
    const offset = gridFrom(5, 4, 3, () => true, { x: 1, y: 2, z: 3 });
    const plan = sliceGrid(offset, 1, 2);
    expect(plan.origin).toEqual({ x: 1, y: 2 + 2 * 0.1, z: 3 });

    const section = sliceGrid(offset, 2, 1);
    expect(section.origin).toEqual({ x: 1, y: 2, z: 3 + 1 * 0.1 });
  });

  it('carries the voxelizer warnings forward by value', () => {
    const plan = sliceGrid(grid, 1, 2);
    expect(plan.warnings).toEqual(grid.warnings);
    plan.warnings.push('mine');
    expect(grid.warnings).toHaveLength(1);
  });

  it('refuses a layer that is not there', () => {
    expect(() => sliceGrid(grid, 1, 4)).toThrow(/outside the grid/);
    expect(() => sliceGrid(grid, 1, -1)).toThrow(/outside the grid/);
    expect(() => sliceGrid(grid, 2, 1.5)).toThrow(/outside the grid/);
  });
});

describe('layerForCoordinate', () => {
  const grid = gridFrom(5, 10, 3, () => true, { x: 0, y: 0.5, z: 0 });

  it('finds the layer nearest a world coordinate', () => {
    expect(layerForCoordinate(grid, 1, 0.5)).toEqual({ index: 0, clamped: false });
    expect(layerForCoordinate(grid, 1, 1.2)).toEqual({ index: 7, clamped: false });
    // Rounds to the nearest layer, not down.
    expect(layerForCoordinate(grid, 1, 1.24).index).toBe(7);
    expect(layerForCoordinate(grid, 1, 1.26).index).toBe(8);
  });

  it('clamps rather than throwing, and says that it did', () => {
    // A height above the ceiling is a slider that went too far, not a broken
    // room — but the caller has to be able to tell the user which plane it
    // actually used.
    expect(layerForCoordinate(grid, 1, 99)).toEqual({ index: 9, clamped: true });
    expect(layerForCoordinate(grid, 1, -99)).toEqual({ index: 0, clamped: true });
  });
});

describe('widestLayer', () => {
  it('picks the layer with the most air', () => {
    // A wedge: air grows with height. The middle of the bounding box would
    // land halfway up; the widest layer is at the top.
    const wedge = gridFrom(10, 5, 10, (i, j, k) => i > 0 && k > 0 && i < 1 + j && k < 9);
    expect(widestLayer(wedge, 1)).toBe(4);
  });

  it('breaks ties toward the centre', () => {
    // Every layer identical, as in a shoebox: cut through the middle rather
    // than at the floor, which is where scan order would have landed.
    const box = gridFrom(6, 7, 6, (i, j, k) => i > 0 && i < 5 && k > 0 && k < 5);
    expect(widestLayer(box, 1)).toBe(3);
  });
});
