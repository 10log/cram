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
import {
  applyAllInterfaceForcing,
  findInterfaces,
  reflectedAlongLine,
  type GlobalField,
} from '../interface';
import { DctPartition } from '../dct-partition';
import { ImpedanceBoundary } from '../impedance';
import { buildRigidFdtdBoundaries, faceKey } from '../boundaries-from-grid';
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

  describe('taps past a thin neighbour (A2)', () => {
    const X = [true, false, false] as const;
    const WIDTHS = [2, 1, 1, 3, 1, 2, 1, 1, 1, 4, 1, 3, 1, 1, 2, 1, 5, 1, 1, 2];
    const length = WIDTHS.reduce((a, b) => a + b, 0);

    function chain() {
      let x = 0;
      return WIDTHS.map((w) => {
        const p = new FdtdPartition({ box: { x, y: 0, z: 0, w, h: 1, d: 1 }, dx, c, dt, activeAxes: X });
        x += w;
        return p;
      });
    }
    /** The chain as one line; beyond its ends reads 0, which is what one partition's zero padding sees. */
    function lineField(parts: FdtdPartition[]): GlobalField {
      return {
        pressureAt(i, j, k) {
          if (j !== 0 || k !== 0) return null;
          const owner = parts.find((p) => i >= p.box.x && i < p.box.x + p.box.w);
          return owner ? owner.pressureAt(i - owner.box.x, 0, 0) : 0;
        },
      };
    }
    const seed = (i: number) => Math.exp(-0.5 * ((i - length / 2) / 2) ** 2);

    it('makes a chain of FDTD partitions, however thin, the same operator as one partition', () => {
      const parts = chain();
      for (const p of parts) p.setPressure(Array.from({ length: p.box.w }, (_, i) => seed(p.box.x + i)));
      const whole = new FdtdPartition({ box: { x: 0, y: 0, z: 0, w: length, h: 1, d: 1 }, dx, c, dt, activeAxes: X });
      whole.setPressure(Array.from({ length }, (_, i) => seed(i)));
      const interfaces = findInterfaces(parts);
      const field = lineField(parts);
      for (let s = 0; s < 400; s++) {
        applyAllInterfaceForcing(interfaces, c, dx, field);
        for (const p of parts) p.step();
        whole.step();
      }
      let worst = 0;
      let peak = 0;
      for (const p of parts) {
        for (let i = 0; i < p.box.w; i++) {
          worst = Math.max(worst, Math.abs(p.pressure[i] - whole.pressure[p.box.x + i]));
          peak = Math.max(peak, Math.abs(whole.pressure[p.box.x + i]));
        }
      }
      expect(peak).toBeGreaterThan(1e-3);
      expect(worst / peak).toBeLessThan(1e-9);
    });

    it('diverges without it: pairwise interfaces alone drop the far taps', () => {
      const parts = chain();
      for (const p of parts) p.setPressure(Array.from({ length: p.box.w }, (_, i) => seed(p.box.x + i)));
      const interfaces = findInterfaces(parts);
      for (let s = 0; s < 3000; s++) {
        applyAllInterfaceForcing(interfaces, c, dx);
        for (const p of parts) p.step();
      }
      const peak = Math.max(...parts.flatMap((p) => Array.from(p.pressure, Math.abs)));
      expect(peak).toBeGreaterThan(1e6);
    });
  });

  describe('walls along a line (A2 at a wall)', () => {
    // Air at 0..4 on a line, walls elsewhere; each cell's pressure is its index + 10.
    const line = (air: (i: number) => boolean): GlobalField => ({
      pressureAt: (i, j, k) => (j === 0 && k === 0 && air(i) ? i + 10 : null),
    });
    const open = line((i) => i >= 0 && i <= 4);

    it('reads straight along the air', () => {
      expect(reflectedAlongLine(open, Axis.X, [1, 0, 0], 1, 2)).toBe(13);
      expect(reflectedAlongLine(open, Axis.X, [3, 0, 0], -1, 3)).toBe(10);
    });

    it('mirrors about a wall face, the image a DCT partition’s Neumann wall assumes', () => {
      // From cell 3 toward the wall past 4: one past the face is 4 itself, two
      // past is 3, three past is 2.
      expect(reflectedAlongLine(open, Axis.X, [3, 0, 0], 1, 2)).toBe(14);
      expect(reflectedAlongLine(open, Axis.X, [3, 0, 0], 1, 3)).toBe(13);
      expect(reflectedAlongLine(open, Axis.X, [3, 0, 0], 1, 4)).toBe(12);
    });

    it('bounces between two walls when the air run is shorter than the stencil', () => {
      // A single air cell: every tap is that cell, its even extension — not
      // zeros, which would leave the row sum at +50.
      const single = line((i) => i === 2);
      for (const steps of [1, 2, 3]) {
        expect(reflectedAlongLine(single, Axis.X, [2, 0, 0], 1, steps)).toBe(12);
        expect(reflectedAlongLine(single, Axis.X, [2, 0, 0], -1, steps)).toBe(12);
      }
      // Two air cells: 2 → 3 → (wall) 3 → 2.
      const pair = line((i) => i === 2 || i === 3);
      expect([1, 2, 3].map((n) => reflectedAlongLine(pair, Axis.X, [2, 0, 0], 1, n))).toEqual([13, 13, 12]);
    });

    it('is null only from a cell that is not air', () => {
      expect(reflectedAlongLine(open, Axis.X, [7, 0, 0], 1, 1)).toBeNull();
    });
  });

  describe('rigid FDTD faces (A3)', () => {
    const X = [true, false, false] as const;

    /** Sign of the echo off the high face of a 1D partition, relative to the incident pulse. */
    function echoSign(p: { step(): void; pressure: Float64Array; setPressure(v: ArrayLike<number>): void }, bs: ImpedanceBoundary[]) {
      const n = p.pressure.length;
      p.setPressure(Array.from({ length: n }, (_, i) => Math.exp(-0.5 * ((i - 150) / 4) ** 2)));
      let echo = 0;
      for (let s = 0; s < 260; s++) {
        for (const b of bs) b.apply();
        p.step();
        if (s > 90 && s < 200 && Math.abs(p.pressure[185]) > Math.abs(echo)) echo = p.pressure[185];
      }
      return Math.sign(echo);
    }
    const box = { x: 0, y: 0, z: 0, w: 200, h: 1, d: 1 };

    it('an FDTD partition alone is pressure-release; a rigid boundary makes it reflect like DCT', () => {
      const bare = new FdtdPartition({ box, dx, c, dt, activeAxes: X });
      expect(echoSign(bare, [])).toBe(-1);
      const dct = new DctPartition({ box, dx, c, dt, activeAxes: X });
      expect(echoSign(dct, [])).toBe(1);
      const rigid = new FdtdPartition({ box, dx, c, dt, activeAxes: X });
      const wall = new ImpedanceBoundary({
        partition: rigid, axis: Axis.X, high: true, uMin: 0, uMax: 1, vMin: 0, vMax: 1, impedance: Infinity,
      });
      expect(echoSign(rigid, [wall])).toBe(1);
    });

    it('fills every exposed FDTD face that no other boundary covers, and nothing else', () => {
      // A 1-thick L: two FDTD arms, every outer face exposed.
      const n = 8;
      const cells = new Uint8Array(n * n * 4);
      let air = 0;
      for (let k = 1; k < 3; k++) {
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
        nx: n, ny: n, nz: 4, dx: 0.12, origin: { x: 0, y: 0, z: 0 }, cells,
        surfaceOf: new Int32Array(cells.length).fill(-1), airCount: air,
        solidCount: cells.length - air, leaked: false, warnings: [],
      };
      const decomposition = decompose(grid);
      expect(decomposition.kinds.every((k) => k === 'fdtd')).toBe(true);
      const parts = decomposition.boxes.map(
        (b) => new FdtdPartition({ box: b, dx: 0.12, c, dt: (0.4 * 0.12) / c, activeAxes: ALL }),
      );
      const all = buildRigidFdtdBoundaries(grid, decomposition, parts, new Set());
      expect(all.length).toBeGreaterThan(0);
      expect(all.every((b) => b.impedance === Infinity)).toBe(true);
      // Covering one face removes exactly that one.
      const first = all[0];
      const covered = new Set([
        faceKey(parts.indexOf(first.partition as FdtdPartition), first.axis, first.high, first),
      ]);
      expect(buildRigidFdtdBoundaries(grid, decomposition, parts, covered)).toHaveLength(all.length - 1);
    });
  });
});
