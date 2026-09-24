/**
 * Issue #220, ARD half: a surface that is not axis-aligned voxelizes into a
 * staircase, and every exposed cell face used to absorb as though it were
 * real surface — `|nₓ| + |n_y| + |n_z|` times the true area. Each face's
 * admittance is now weighted by `|n·e|` (`faceWeight`), PFFDTD's correction.
 *
 * The end-to-end oracle follows the 2D half (`2d-fdtd/__tests__/staircase.spec.ts`):
 * the 3D Eyring bracket, on a room with no parallel walls — a pentagonal prism
 * with a sloping ceiling — so that the field is diffuse enough for an area
 * argument to mean something. A rectangular box is used only where the area
 * argument does not need a diffuse field.
 */

import { describe, expect, it } from 'vitest';
import { impedanceForRandomIncidenceAbsorption, parisAbsorption } from '../../acoustics/random-incidence';
import { describeStaircaseArea, planImpedanceBoundaries } from '../boundaries-from-grid';
import { decompose } from '../decompose';
import { sliceGrid } from '../grid-slice';
import { bandlimitedPulse, createArdSimulation, planArdTimeStep } from '../simulation';
import { faceWeight, voxelizeTriangles, worldToCell, type VoxelGrid, type VoxelTriangle } from '../voxelize';

type V3 = [number, number, number];

function triangles(faces: V3[][]): VoxelTriangle[] {
  const out: VoxelTriangle[] = [];
  for (const polygon of faces) {
    // Fan from the first vertex: every face here is planar and convex.
    for (let i = 1; i < polygon.length - 1; i++) {
      const [p, q, r] = [polygon[0], polygon[i], polygon[i + 1]];
      out.push({
        ax: p[0], ay: p[1], az: p[2],
        bx: q[0], by: q[1], bz: q[2],
        cx: r[0], cy: r[1], cz: r[2],
        surfaceIndex: 0,
      });
    }
  }
  return out;
}

const rotateZ = (degrees: number) => {
  const t = (degrees * Math.PI) / 180;
  return ([x, y, z]: V3): V3 => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t), z];
};

/** A box `lx × ly × lz`, floor at z = 0, centred on the z axis and rotated about it. */
function rotatedBox(lx: number, ly: number, lz: number, degrees: number): VoxelTriangle[] {
  const r = rotateZ(degrees);
  const [hx, hy] = [lx / 2, ly / 2];
  const P = ([
    [-hx, -hy, 0], [hx, -hy, 0], [hx, hy, 0], [-hx, hy, 0],
    [-hx, -hy, lz], [hx, -hy, lz], [hx, hy, lz], [-hx, hy, lz],
  ] as V3[]).map(r);
  const quads = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
  return triangles(quads.map((q) => q.map((i) => P[i])));
}

// An irregular pentagon, the 2D half's: no parallel walls, and none
// axis-aligned at any rotation below. The ceiling slopes along the room's own
// x, so it is not parallel to the floor either.
const SHAPE: [number, number][] = [[-1, -0.8], [0.7, -1], [1, 0.3], [0.1, 1], [-0.9, 0.6]];
const SCALE = 1.5;
const HEIGHT = 1.6;
const SLOPE = 0.15;

function prism(degrees: number) {
  const r = rotateZ(degrees);
  const base = SHAPE.map(([x, y]) => [x * SCALE, y * SCALE] as [number, number]);
  const top = (x: number) => HEIGHT + SLOPE * x;
  const floor = base.map(([x, y]) => r([x, y, 0]));
  const ceiling = base.map(([x, y]) => r([x, y, top(x)]));
  const walls = base.map((_, i) => {
    const j = (i + 1) % base.length;
    return [floor[i], floor[j], ceiling[j], ceiling[i]];
  });

  // Exact volume and surface, for the Eyring bracket.
  let signed = 0;
  let cx = 0;
  let sides = 0;
  for (let i = 0; i < base.length; i++) {
    const [a, b] = [base[i], base[(i + 1) % base.length]];
    const cross = a[0] * b[1] - b[0] * a[1];
    signed += cross;
    cx += (a[0] + b[0]) * cross;
    sides += (Math.hypot(b[0] - a[0], b[1] - a[1]) * (top(a[0]) + top(b[0]))) / 2;
  }
  const area = Math.abs(signed) / 2;
  cx /= 3 * signed;
  return {
    triangles: triangles([floor, ceiling, ...walls]),
    volume: area * top(cx),
    surface: area + area * Math.hypot(1, SLOPE) + sides,
  };
}

const eyring = (volume: number, surface: number, alpha: number) =>
  (0.161 * volume) / (-surface * Math.log(1 - alpha));

/** T20 from the Schroeder curve of the summed energy of every receiver. */
function t20(irs: Float32Array[], dt: number): number {
  const n = irs[0].length;
  const edc = new Float64Array(n);
  let acc = 0;
  for (let i = n - 1; i >= 0; i--) {
    for (const ir of irs) acc += ir[i] * ir[i];
    edc[i] = acc;
  }
  const db = (i: number) => 10 * Math.log10(edc[i] / edc[0]);
  let from = -1;
  for (let i = 0; i < n; i++) {
    if (from < 0 && db(i) <= -5) from = i;
    if (db(i) <= -25) return (-60 * (i - from) * dt) / (db(i) - db(from));
  }
  return NaN;
}

const DX = 0.12;
const ALPHA = 0.2;

function voxelize(tris: VoxelTriangle[], weighted: boolean): VoxelGrid {
  const grid = voxelizeTriangles(tris, { dx: DX, seed: { x: 0, y: 0, z: 0.8 } });
  expect(grid.leaked).toBe(false);
  // Dropping the weights is exactly the grid #220 started from.
  if (!weighted) grid.faceWeightOf = undefined;
  return grid;
}

/**
 * Run a room and read T20 off 24 receivers. One receiver in a room this small
 * reads whichever modes it sits on; the sum reads the room.
 */
function decay(tris: VoxelTriangle[], weighted: boolean, duration = 0.4) {
  const grid = voxelize(tris, weighted);
  const decomposition = decompose(grid);
  const base = {
    grid, decomposition, c: 343, courant: 0.4, duration, fMax: 500,
    absorptionFor: () => ALPHA,
  };
  const dt = planArdTimeStep(base).dt;
  const cell = (x: number, y: number, z: number): [number, number, number] => {
    const c = worldToCell(grid, { x, y, z })!;
    return [c.i, c.j, c.k];
  };
  const receivers: { cell: [number, number, number] }[] = [];
  for (const x of [-0.6, -0.2, 0.2, 0.6]) {
    for (const y of [-0.5, 0, 0.5]) {
      for (const z of [0.45, 1.15]) receivers.push({ cell: cell(x, y, z) });
    }
  }
  const sim = createArdSimulation({
    ...base,
    sources: [{ cell: cell(-0.5, -0.3, 0.5), signal: bandlimitedPulse(80, dt, 500) }],
    receivers,
  });
  const irs = sim.run();
  sim.dispose();
  return { irs, dt, t20: t20(irs, dt) };
}

describe('Issue #220: ARD staircase face weights', () => {
  describe('the weights', () => {
    /** Index of the cell under a world point, in the room's own frame rotated by `degrees`. */
    const cellAt = (grid: VoxelGrid, degrees: number, p: V3) => {
      const [x, y, z] = rotateZ(degrees)(p);
      const c = worldToCell(grid, { x, y, z })!;
      return c.i + grid.nx * (c.j + grid.ny * c.k);
    };

    it('are the components of each surface normal', () => {
      const grid = voxelize(rotatedBox(2.6, 2.1, 1.6, 22.5), true);
      // A cell on the middle of the rotated +x wall, clear of every corner:
      // its normal is (cos 22.5°, sin 22.5°, 0).
      const index = cellAt(grid, 22.5, [1.3, 0, 0.8]);
      expect(faceWeight(grid, index, 0)).toBeCloseTo(Math.cos(Math.PI / 8), 6);
      expect(faceWeight(grid, index, 1)).toBeCloseTo(Math.sin(Math.PI / 8), 6);
      expect(faceWeight(grid, index, 2)).toBeCloseTo(0, 6);
    });

    it('read 1 where the grid carries none, so hand-built grids are unchanged', () => {
      const grid = voxelize(rotatedBox(2.6, 2.1, 1.6, 22.5), false);
      expect(faceWeight(grid, cellAt(grid, 22.5, [1.3, 0, 0.8]), 0)).toBe(1);
    });

    it('in a slice, are the in-plane normal renormalised', () => {
      // A slice runs a 2D field, whose staircase is the surface's trace in the
      // plane. The +x wall cut at constant y is a line along z with normal
      // (1, 0) in (x, z): weight 1, where the 3D weight was cos 22.5°.
      const grid = voxelize(rotatedBox(2.6, 2.1, 1.6, 22.5), true);
      const index = cellAt(grid, 22.5, [1.3, 0, 0.8]);
      const j = Math.floor(index / grid.nx) % grid.ny;
      const slice = sliceGrid(grid, 1, j);
      const i = index % grid.nx;
      const k = Math.floor(index / (grid.nx * grid.ny));
      const inSlice = i + slice.nx * k;
      expect(faceWeight(slice, inSlice, 0)).toBeCloseTo(1, 6);
      expect(faceWeight(slice, inSlice, 2)).toBeCloseTo(0, 6);
      // The slice has no triangles, so it reports no true area.
      expect(slice.surfaceArea).toBeUndefined();
    });
  });

  describe('the area diagnostic', () => {
    it('holds the corrected area still as the room rotates, where the staircase grows', () => {
      const rows = [0, 22.5, 45].map((degrees) => {
        const grid = voxelize(rotatedBox(2.6, 2.1, 1.6, degrees), true);
        const plan = planImpedanceBoundaries(grid, decompose(grid), { absorptionFor: () => ALPHA });
        expect(plan.staircaseArea).toHaveLength(1);
        return plan.staircaseArea[0];
      });
      const [flat, mid, diagonal] = rows;
      // Axis-aligned: every weight is 1, so the two readings agree exactly.
      expect(flat.corrected).toBe(flat.staircased);
      // Measured 22.46, 21.96 and 21.81 m² corrected; 22.46, 25.72 and 26.87
      // staircased.
      for (const row of [mid, diagonal]) {
        expect(Math.abs(row.corrected / flat.corrected - 1)).toBeLessThan(0.04);
      }
      expect(mid.staircased / flat.staircased).toBeGreaterThan(1.1);
      expect(diagonal.staircased / flat.staircased).toBeGreaterThan(1.15);
      // The true area is the triangles', 25.96 m²; corrected sits below it
      // by the shell's inset, the same at every rotation.
      for (const row of rows) {
        expect(row.true).toBeCloseTo(2 * 2.6 * 2.1 + 2 * (2.6 + 2.1) * 1.6, 9);
        expect(row.corrected / row.true!).toBeGreaterThan(0.8);
        expect(row.corrected / row.true!).toBeLessThan(1);
      }
    });

    it('prints one line per surface, against the true area', () => {
      expect(
        describeStaircaseArea([
          { surfaceIndex: 3, staircased: 12, corrected: 9.5, true: 10 },
          { surfaceIndex: 4, staircased: 2, corrected: 2 },
        ]),
      ).toEqual([
        'surface 3: staircased 12.000 m² (+20.0%), corrected 9.500 m² (-5.0%), true 10.000 m²',
        'surface 4: staircased 2.000 m², corrected 2.000 m²',
      ]);
    });
  });

  it('leaves an axis-aligned room bit-for-bit as it was', () => {
    const box = rotatedBox(2.6, 2.1, 1.6, 0);
    const plain = decay(box, false, 0.05);
    const fixed = decay(box, true, 0.05);
    expect(fixed.irs.map((ir) => Array.from(ir))).toEqual(plain.irs.map((ir) => Array.from(ir)));
  }, 120_000);

  it('decays inside the 3D Eyring bracket at every rotation, which it did not before', () => {
    // The material is α = 0.2 of a diffuse field (#221), so the bracket's
    // diffuse end is Eyring at 0.2 and its other end Eyring at the wall's
    // normal-incidence α. Measured, weighted: 0.96–1.01 × the diffuse end;
    // uncorrected: 0.83–0.86 ×, faster than any reading of the material allows.
    const xi = impedanceForRandomIncidenceAbsorption(ALPHA, 3);
    expect(parisAbsorption(xi)).toBeCloseTo(ALPHA, 9);
    const weighted: number[] = [];
    for (const degrees of [0, 25, 55]) {
      const room = prism(degrees);
      const lower = eyring(room.volume, room.surface, ALPHA);
      const upper = eyring(room.volume, room.surface, 1 - ((xi - 1) / (xi + 1)) ** 2);
      const before = decay(room.triangles, false).t20;
      const after = decay(room.triangles, true).t20;
      weighted.push(after);
      const at = { degrees, lower, upper, before, after };
      expect([at, after > 0.9 * lower && after < upper]).toEqual([at, true]);
      expect([at, before < 0.92 * lower]).toEqual([at, true]);
    }
    // Rotation-invariant to within the modal scatter (measured 4.7%).
    expect(Math.max(...weighted) / Math.min(...weighted)).toBeLessThan(1.1);
  }, 600_000);

  it('brings a box rotated by 22.5° back to the axis-aligned decay', () => {
    // A box is not diffuse, so this compares rotations with each other rather
    // than with Eyring. Measured: 0° 0.263 s; 22.5° 0.233 s uncorrected
    // (−11%), 0.269 s weighted (+2%).
    //
    // Not at 45°, at this resolution. At dx = 0.12 (six cells per wavelength
    // at 500 Hz) the uncorrected 45° box happens to match 0° and the weight
    // over-corrects it (+19%). That is the grid, not the angle: at dx = 0.06
    // the same box reads −22% uncorrected and −3% weighted (22.5°: −22% and
    // −8%). The staircase's excess area is only fully felt once the steps are
    // small against the wavelength, and the correction removes it there. Too
    // slow to run here (≈4 min a room), so it is recorded, not asserted.
    const flat = decay(rotatedBox(2.6, 2.1, 1.6, 0), true).t20;
    const before = decay(rotatedBox(2.6, 2.1, 1.6, 22.5), false).t20;
    const after = decay(rotatedBox(2.6, 2.1, 1.6, 22.5), true).t20;
    const at = { flat, before, after };
    expect([at, Math.abs(after / flat - 1) < 0.06]).toEqual([at, true]);
    expect([at, before / flat < 0.93]).toEqual([at, true]);
  }, 600_000);
});
