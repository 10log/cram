/**
 * Where the simulation's time goes, per partition kind — Phase 10 of the ARD
 * solver (docs/ard-solver-plan.md).
 *
 * The plan's GPU design rests on "the DCT is the bulk of the work", and builds
 * its whole "what is actually hard" list on that. Measured, it is not: the PML
 * wall slabs are 76–93% and the DCT interior is 7–24%, because Phase 5
 * established that slabs run 2–5x the room's own cell count and the two kinds
 * cost comparable time per cell.
 *
 * That inverts the priority — the stencil kernels the plan calls textbook are
 * where the time is, and the FFT it calls hard is not — so the claim is worth
 * a test rather than a paragraph. Two of them, with different failure modes:
 *
 *  - The **volume** ratio is deterministic and is the structural reason, so it
 *    is asserted tightly.
 *  - The **time** share depends on the machine, so it is asserted loosely: the
 *    bound is set where a genuine inversion fails and ordinary CI noise does
 *    not.
 */

import { createArdSimulation } from '../simulation';
import { decompose } from '../decompose';
import { Cell, type VoxelGrid } from '../voxelize';

const C = 343;

/** Air box in a one-cell shell with padding for the wall slabs. */
function shoebox(ax: number, ay: number, az: number, dx: number, pad: number): VoxelGrid {
  const margin = 1 + pad;
  const nx = ax + 2 * margin;
  const ny = ay + 2 * margin;
  const nz = az + 2 * margin;
  const cells = new Uint8Array(nx * ny * nz);
  const surfaceOf = new Int32Array(nx * ny * nz).fill(-1);
  let airCount = 0;

  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const index = i + nx * (j + ny * k);
        const inAir =
          i >= margin && i < margin + ax &&
          j >= margin && j < margin + ay &&
          k >= margin && k < margin + az;
        if (inAir) {
          cells[index] = Cell.Air;
          airCount++;
          continue;
        }
        const onShell =
          i >= margin - 1 && i <= margin + ax &&
          j >= margin - 1 && j <= margin + ay &&
          k >= margin - 1 && k <= margin + az;
        if (onShell) surfaceOf[index] = 0;
      }
    }
  }

  return {
    nx, ny, nz, dx,
    origin: { x: 0, y: 0, z: 0 },
    cells, surfaceOf, airCount,
    solidCount: nx * ny * nz - airCount,
    leaked: false,
    warnings: [],
  };
}

const ROOMS = [
  [16, 14, 12],
  [24, 20, 16],
  [32, 32, 16],
] as const;

function build(ax: number, ay: number, az: number) {
  const grid = shoebox(ax, ay, az, 0.13, 9);
  const sim = createArdSimulation({
    grid,
    decomposition: decompose(grid),
    c: C,
    courant: 0.4,
    steps: 60,
    sources: [{ cell: [13, 13, 13], signal: new Float32Array(60) }],
    receivers: [],
    absorptionFor: () => 0.3,
  });
  const of = (kind: string) => sim.partitions.filter((p) => p.kind === kind);
  const cells = (ps: readonly { box: { w: number; h: number; d: number } }[]) =>
    ps.reduce((total, p) => total + p.box.w * p.box.h * p.box.d, 0);
  return { sim, dct: of('dct'), pml: of('pml'), cells };
}

describe('partition cost', () => {
  it('puts far more cells in the wall slabs than in the room', () => {
    // The deterministic half, and the reason the timing comes out the way it
    // does. Phase 5 measured 2-5x depending on slab thickness; at the default
    // 8 cells these three rooms come out at 3.48x, 2.47x and exactly 2.00x —
    // the last because a 32 x 32 x 16 room's surface area over its volume
    // lands there precisely.
    for (const [ax, ay, az] of ROOMS) {
      const { sim, dct, pml, cells } = build(ax, ay, az);
      expect(dct).toHaveLength(1);
      expect(pml).toHaveLength(6);

      const ratio = cells(pml) / cells(dct);
      expect(ratio).toBeGreaterThanOrEqual(2);
      expect(ratio).toBeLessThan(4);
      sim.dispose();
    }
  });

  it('spends most of its time in the stencil partitions, not the DCT', () => {
    // The claim that decides what a GPU port should target. Loose on purpose:
    // measured shares are 76-93% PML, so a bound at 60% has room for a slow or
    // contended machine while still failing if the two ever swapped places.
    //
    // Minimum of several passes rather than the mean, because interference can
    // only ever make a timing larger.
    for (const [ax, ay, az] of ROOMS) {
      const { sim, dct, pml } = build(ax, ay, az);
      const stepAll = (ps: typeof dct) => {
        for (const p of ps) p.step();
      };

      // Warm up: first passes pay for lazily-built tables and JIT.
      for (let i = 0; i < 5; i++) {
        stepAll(dct);
        stepAll(pml);
      }

      const fastest = (ps: typeof dct) => {
        let best = Infinity;
        for (let pass = 0; pass < 3; pass++) {
          const started = performance.now();
          for (let i = 0; i < 15; i++) stepAll(ps);
          best = Math.min(best, performance.now() - started);
        }
        return best;
      };

      const tDct = fastest(dct);
      const tPml = fastest(pml);
      const pmlShare = tPml / (tPml + tDct);

      expect(pmlShare).toBeGreaterThan(0.6);
      sim.dispose();
    }
  }, 120_000);
});
