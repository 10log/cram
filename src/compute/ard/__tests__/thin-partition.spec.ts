/**
 * Issue #228: a box one cell thick in a 3D room is not a 2D partition.
 *
 * `FdtdPartition` and `PmlPartition` skipped the Laplacian on any axis where
 * their *box* had extent 1. That is right when the whole simulation is
 * collapsed on the axis — a 2D slice — and wrong when only the box is thin:
 * the centre tap `−490·p` went missing while the interface residual still added
 * the neighbours' taps, and a rotated room, whose staircase decomposes into
 * one-cell slivers, diverged within ~200 steps. `activeAxes` says which axes
 * the simulation has; the box's own extents no longer decide.
 */

import { describe, expect, it } from 'vitest';
import { FdtdPartition } from '../fdtd-partition';
import { PmlPartition } from '../pml-partition';
import { Axis, STENCIL_6TH, STENCIL_6TH_DIV, type PartitionBase } from '../partition';
import { decompose } from '../decompose';
import { createArdSimulation } from '../simulation';
import { Cell, type VoxelGrid } from '../voxelize';

const dx = 0.1;
const c = 343;
const dt = (0.4 * dx) / c;
const ALL = [true, true, true] as const;

describe('Issue #228: thin partitions in a 3D grid', () => {
  it('keeps the centre tap on an active axis the box is one cell thick along', () => {
    // A single cell, active on all three axes, no neighbours: every tap but
    // the centre reads zero, so one step is exactly the centre tap three times.
    const box = { x: 0, y: 0, z: 0, w: 1, h: 1, d: 1 };
    const p = new FdtdPartition({ box, dx, c, dt, activeAxes: ALL });
    p.setPressure([1]);
    p.step();
    const lap = (3 * STENCIL_6TH[3]) / (STENCIL_6TH_DIV * dx * dx);
    expect(p.pressure[0]).toBeCloseTo(2 - 1 + c * c * dt * dt * lap, 12);
  });

  it('still skips an axis the simulation is collapsed on', () => {
    // The same cell as a 1D run along x only: y and z carry nothing, so the
    // update is the x centre tap alone — what a 2D slice relies on.
    const box = { x: 0, y: 0, z: 0, w: 1, h: 1, d: 1 };
    const p = new FdtdPartition({ box, dx, c, dt, activeAxes: [true, false, false] });
    p.setPressure([1]);
    p.step();
    const lap = STENCIL_6TH[3] / (STENCIL_6TH_DIV * dx * dx);
    expect(p.pressure[0]).toBeCloseTo(1 + c * c * dt * dt * lap, 12);
  });

  it('defaults to the box’s own axes, so a partition that is the whole domain is unchanged', () => {
    const box = { x: 0, y: 0, z: 0, w: 8, h: 1, d: 1 };
    expect(new FdtdPartition({ box, dx, c, dt }).activeAxes).toEqual([true, false, false]);
    expect(new FdtdPartition({ box, dx, c, dt }).rank).toBe(1);
  });

  it('takes its rank, and so its CFL limit, from the simulation', () => {
    // A 1 x 20 x 17 sliver in a 3D room runs the 3D stencil and needs the 3D
    // limit (0.470), not the 2D one (0.575) its box would suggest.
    const box = { x: 0, y: 0, z: 0, w: 1, h: 20, d: 17 };
    const sliver = new FdtdPartition({ box, dx, c, dt, activeAxes: ALL });
    expect(sliver.rank).toBe(3);
    expect(sliver.cflLimit).toBeCloseTo(0.47, 2);
    expect(new FdtdPartition({ box, dx, c, dt }).rank).toBe(2);
  });

  it('refuses a box that extends along an axis marked collapsed', () => {
    const box = { x: 0, y: 0, z: 0, w: 4, h: 3, d: 1 };
    expect(() => new FdtdPartition({ box, dx, c, dt, activeAxes: [true, false, false] }))
      .toThrow(/extent 3 on axis 1/);
  });

  it('applies the same rule to a PML slab', () => {
    const box = { x: 0, y: 0, z: 0, w: 1, h: 1, d: 1 };
    const params = { box, dx, c, dt, axis: Axis.X, increasing: true, sigmaMax: 0, gradingExponent: 2 };
    const active = new PmlPartition({ ...params, activeAxes: ALL });
    const collapsed = new PmlPartition({ ...params, activeAxes: [true, false, false] });
    for (const p of [active, collapsed]) {
      p.setPressure([1]);
      p.step();
    }
    const tap = (c * c * dt * dt * STENCIL_6TH[3]) / (STENCIL_6TH_DIV * dx * dx);
    expect(active.pressure[0]).toBeCloseTo(1 + 3 * tap, 12);
    expect(collapsed.pressure[0]).toBeCloseTo(1 + tap, 12);
  });

  it('is given the grid’s axes by the simulation, however thin each box is', () => {
    // An L-shaped 3D room whose arms are one cell thick: both boxes are thin on
    // one axis, and both must still run all three.
    const n = 12;
    const cells = new Uint8Array(n * n * 6);
    const surfaceOf = new Int32Array(cells.length).fill(-1);
    let air = 0;
    for (let k = 1; k < 5; k++) {
      for (let j = 1; j < n - 1; j++) {
        for (let i = 1; i < n - 1; i++) {
          if (i === 1 || j === 1) {
            cells[i + n * (j + n * k)] = Cell.Air;
            air++;
          }
        }
      }
    }
    const grid: VoxelGrid = {
      nx: n, ny: n, nz: 6, dx: 0.12, origin: { x: 0, y: 0, z: 0 }, cells, surfaceOf,
      airCount: air, solidCount: cells.length - air, leaked: false, warnings: [],
    };
    const decomposition = decompose(grid);
    expect(decomposition.boxes.some((b) => b.w === 1 || b.h === 1)).toBe(true);
    const sim = createArdSimulation({
      grid, decomposition, c, courant: 0.4, steps: 1, fMax: 500, absorptionFor: () => 0,
      sources: [], receivers: [],
    });
    for (const partition of sim.partitions) {
      expect((partition as unknown as PartitionBase).activeAxes).toEqual([true, true, true]);
      expect((partition as unknown as PartitionBase).rank).toBe(3);
    }
    sim.dispose();
  });
});
