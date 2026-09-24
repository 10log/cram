/**
 * Issue #228: ARD on a room that is not axis-aligned.
 *
 * A rotated box voxelizes into a staircase, and the default decomposition
 * turns the staircase into partitions one to three cells thick. Before #228
 * that diverged to NaN within ~0.03 s, rigid or absorbing. These are the
 * end-to-end regressions the issue asked for: a rotated shoebox, rigid and
 * absorbing, through `voxelizeTriangles`, `decompose` and `createArdSimulation`
 * with nothing overridden.
 */

import { describe, expect, it } from 'vitest';
import { decompose } from '../decompose';
import { bandlimitedPulse, createArdSimulation, planArdTimeStep } from '../simulation';
import { voxelizeTriangles, worldToCell, type VoxelTriangle } from '../voxelize';

/** A box `lx × ly × lz`, floor at z = 0, centred on the z axis and rotated about it. */
function rotatedBox(lx: number, ly: number, lz: number, degrees: number): VoxelTriangle[] {
  const t = (degrees * Math.PI) / 180;
  const v = (x: number, y: number, z: number) => [
    x * Math.cos(t) - y * Math.sin(t),
    x * Math.sin(t) + y * Math.cos(t),
    z,
  ];
  const hx = lx / 2;
  const hy = ly / 2;
  const P = [
    v(-hx, -hy, 0), v(hx, -hy, 0), v(hx, hy, 0), v(-hx, hy, 0),
    v(-hx, -hy, lz), v(hx, -hy, lz), v(hx, hy, lz), v(-hx, hy, lz),
  ];
  const quads = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
  const triangles: VoxelTriangle[] = [];
  for (const [a, b, c, d] of quads) {
    for (const [p, q, r] of [[a, b, c], [a, c, d]]) {
      triangles.push({
        ax: P[p][0], ay: P[p][1], az: P[p][2],
        bx: P[q][0], by: P[q][1], bz: P[q][2],
        cx: P[r][0], cy: P[r][1], cz: P[r][2],
        surfaceIndex: 0,
      });
    }
  }
  return triangles;
}

/** Energy of `ir` in consecutive windows of `seconds`, in dB. */
function windowLevels(ir: Float32Array, dt: number, seconds: number): number[] {
  const n = Math.floor(seconds / dt);
  const levels: number[] = [];
  for (let start = 0; start + n <= ir.length; start += n) {
    let e = 0;
    for (let i = start; i < start + n; i++) e += ir[i] * ir[i];
    levels.push(10 * Math.log10(e));
  }
  return levels;
}

function run(degrees: number, alpha: number, minBoxEdge?: number) {
  const grid = voxelizeTriangles(rotatedBox(2.6, 2.1, 1.6, degrees), {
    dx: 0.12,
    seed: { x: 0.05, y: 0.05, z: 0.8 },
  });
  const decomposition = decompose(grid, minBoxEdge === undefined ? {} : { minBoxEdge });
  const base = {
    grid, decomposition, c: 343, courant: 0.4, duration: 0.25, fMax: 500,
    absorptionFor: () => alpha,
  };
  const dt = planArdTimeStep(base).dt;
  const cell = (x: number, y: number, z: number): [number, number, number] => {
    const c = worldToCell(grid, { x, y, z })!;
    return [c.i, c.j, c.k];
  };
  const sim = createArdSimulation({
    ...base,
    sources: [{ cell: cell(-0.5, -0.3, 0.5), signal: bandlimitedPulse(80, dt, 500) }],
    receivers: [{ cell: cell(0.5, 0.35, 1.0) }],
  });
  const [ir] = sim.run();
  sim.dispose();
  return { ir, dt, decomposition };
}

describe('Issue #228: ARD on a staircased room', () => {
  it.each([22.5, 45])('stays bounded with rigid walls at %s°', (degrees) => {
    const { ir, dt, decomposition } = run(degrees, 0);
    // The case this is about: the staircase really did become one-cell slivers.
    const thin = decomposition.boxes.filter(
      (b, n) => decomposition.kinds[n] === 'fdtd' && Math.min(b.w, b.h, b.d) === 1,
    );
    expect(thin.length).toBeGreaterThan(0);

    expect(ir.every(Number.isFinite)).toBe(true);
    // A sealed rigid room neither grows nor decays: after the pulse, the level
    // holds. Before #228 it rose ~1.9x per step.
    const levels = windowLevels(ir, dt, 0.05).slice(1);
    expect(Math.max(...levels) - Math.min(...levels)).toBeLessThan(3);
  }, 120_000);

  it.each([22.5, 45])('decays with absorbing walls at %s°', (degrees) => {
    const { ir, dt } = run(degrees, 0.2);
    expect(ir.every(Number.isFinite)).toBe(true);
    const levels = windowLevels(ir, dt, 0.05);
    // Falling, and by a room's worth: tens of dB over the run, not a
    // stalled or growing tail.
    expect(levels[levels.length - 1]).toBeLessThan(levels[1] - 20);
  }, 120_000);

  it('decays with absorbing walls on thin DCT partitions too (Mode B)', () => {
    // Not reachable through the app — the decomposer makes every DCT box at
    // least 7 on each axis — but a caller may force minBoxEdge down. Before
    // #228 this diverged; the field-backed ghosts fixed it along with Mode A.
    const { ir, dt, decomposition } = run(22.5, 0.2, 1);
    expect(decomposition.kinds.every((k) => k === 'dct')).toBe(true);
    expect(decomposition.boxes.some((b) => Math.min(b.w, b.h, b.d) < 3)).toBe(true);
    expect(ir.every(Number.isFinite)).toBe(true);
    const levels = windowLevels(ir, dt, 0.05);
    expect(levels[levels.length - 1]).toBeLessThan(levels[1] - 20);
  }, 120_000);
});
