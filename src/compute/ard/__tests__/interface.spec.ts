/**
 * Tests for ARD interface handling (plan Phase 5).
 *
 * This is the file that decides whether the port is worth continuing. ARD's
 * whole premise is that a room can be cut into rectangles, each stepped with
 * rigid walls, and that a forcing term can undo the cut. If a split partition
 * is not indistinguishable from an undivided one, nothing downstream matters —
 * the decomposition, the voxelizer, the solver class and the UI would all be
 * built on a seam that reflects.
 */

import { DctPartition } from '../dct-partition';
import { FdtdPartition } from '../fdtd-partition';
import {
  applyAllInterfaceForcing,
  applyInterfaceForcing,
  findInterface,
  findInterfaces,
} from '../interface';
import { Axis, STENCIL_6TH, type Box, type Partition } from '../partition';

const C = 343;
const DX = 0.05;
const COURANT = 0.4;
const DT = (COURANT * DX) / C;

function box(w: number, h = 1, d = 1, x = 0, y = 0, z = 0): Box {
  return { x, y, z, w, h, d };
}

function gaussian1d(n: number, centre: number, width: number): Float64Array {
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = Math.exp(-0.5 * ((i - centre) / width) ** 2);
  return out;
}

/**
 * One time step of a multi-partition system.
 *
 * Interface forcing is computed from the current pressure and consumed by the
 * step that follows, which clears it. That matches the reference's
 * `Simulation::main` ordering (step, then boundary forcing for the next step),
 * written the other way round so each step sees forcing evaluated at its own
 * time level.
 */
function advance(parts: Partition[], steps: number, c = C, dx = DX): void {
  const interfaces = findInterfaces(parts);
  for (let s = 0; s < steps; s++) {
    applyAllInterfaceForcing(interfaces, c, dx);
    for (const p of parts) p.step();
  }
}

function relL2(actual: ArrayLike<number>, expected: ArrayLike<number>, from = 0, to = -1): number {
  const end = to < 0 ? expected.length : to;
  let num = 0;
  let den = 0;
  for (let i = from; i < end; i++) {
    const d = actual[i] - expected[i];
    num += d * d;
    den += expected[i] * expected[i];
  }
  return Math.sqrt(num / den);
}

function maxAbs(a: ArrayLike<number>): number {
  let worst = 0;
  for (let i = 0; i < a.length; i++) worst = Math.max(worst, Math.abs(a[i]));
  return worst;
}

describe('findInterface', () => {
  const mk = (b: Box) => new DctPartition({ box: b, dx: DX, c: C, dt: DT });

  it('finds a shared face between abutting boxes', () => {
    const a = mk(box(10, 8, 1, 0, 0, 0));
    const b = mk(box(6, 8, 1, 10, 0, 0));
    const iface = findInterface(a, b);

    expect(iface).not.toBeNull();
    expect(iface!.axis).toBe(Axis.X);
    expect(iface!.lower).toBe(a);
    expect(iface!.upper).toBe(b);
    expect(iface!.overlap).toEqual({ uMin: 0, uMax: 8, vMin: 0, vMax: 1 });
  });

  it('orders lower and upper by position, not argument order', () => {
    const a = mk(box(10, 8, 1, 0, 0, 0));
    const b = mk(box(6, 8, 1, 10, 0, 0));
    const iface = findInterface(b, a);
    expect(iface!.lower).toBe(a);
    expect(iface!.upper).toBe(b);
  });

  it('clips the overlap to the shared extent', () => {
    // b starts partway up a and overhangs the top.
    const a = mk(box(10, 8, 1, 0, 0, 0));
    const b = mk(box(6, 8, 1, 10, 3, 0));
    const iface = findInterface(a, b)!;
    expect(iface.overlap.uMin).toBe(3);
    expect(iface.overlap.uMax).toBe(8);
  });

  it('works on the Y and Z axes', () => {
    const a = mk(box(8, 4, 4, 0, 0, 0));
    expect(findInterface(a, mk(box(8, 5, 4, 0, 4, 0)))!.axis).toBe(Axis.Y);
    expect(findInterface(a, mk(box(8, 4, 5, 0, 0, 4)))!.axis).toBe(Axis.Z);
  });

  it('rejects boxes that only touch along an edge or corner', () => {
    const a = mk(box(10, 10, 1, 0, 0, 0));
    // Diagonally adjacent: abuts on X and on Y, so zero overlap on one of them.
    expect(findInterface(a, mk(box(10, 10, 1, 10, 10, 0)))).toBeNull();
  });

  it('rejects boxes that do not touch', () => {
    const a = mk(box(10, 10, 1, 0, 0, 0));
    expect(findInterface(a, mk(box(10, 10, 1, 11, 0, 0)))).toBeNull();
    expect(findInterface(a, mk(box(10, 10, 1, 0, 20, 0)))).toBeNull();
  });

  it('enumerates each pair once', () => {
    const parts = [
      mk(box(10, 10, 1, 0, 0, 0)),
      mk(box(10, 10, 1, 10, 0, 0)),
      mk(box(20, 6, 1, 0, 10, 0)),
    ];
    expect(findInterfaces(parts)).toHaveLength(3);
  });
});

describe('interface residual', () => {
  /**
   * The reference's `Boundary::computeForcingTerms` uses a literal 6x7
   * coefficient table. `interface.ts` instead derives the residual as
   * `sum_t STENCIL[3 + d + t] * (across[t] - own[t])`, which is far easier to
   * check by eye. Confirm the two are the same operator, term by term, so the
   * rewrite is a checked property rather than a claim in a comment.
   */
  it('matches the reference 6x7 coefficient table', () => {
    // Rows are j = -3..2: j < 0 indexes cells on the lower side (local
    // width + j), j >= 0 cells on the upper side (local j).
    const REFERENCE_TABLE = [
      [0, 0, 0, 0, 0, -2, 2],
      [0, 0, 0, -2, 27, -27, 2],
      [0, -2, 27, -270, 270, -27, 2],
      [2, -27, 270, -270, 27, -2, 0],
      [2, -27, 27, -2, 0, 0, 0],
      [2, -2, 0, 0, 0, 0, 0],
    ];

    // Arbitrary distinct pressures, indexed by depth from the shared face.
    const lower = [1.3, -0.7, 2.1, 0.4, -1.1, 0.9];
    const upper = [-0.5, 1.7, 0.2, -2.3, 0.8, 1.5];

    for (let j = -3; j <= 2; j++) {
      const row = REFERENCE_TABLE[j + 3];

      // Reference column m maps to lower depth (2 - j - m) while m <= 2 - j,
      // and to upper depth (m - 3 + j) after that.
      let reference = 0;
      for (let m = 0; m <= 2 - j; m++) reference += row[m] * lower[2 - j - m];
      for (let m = 3 - j; m <= 6; m++) reference += row[m] * upper[m - 3 + j];

      // Ours: depth d = -j on the lower side, d = j + 1 on the upper side.
      const d = j < 0 ? -j : j + 1;
      let ours = 0;
      for (let t = 0; t + d <= 3; t++) {
        const coef = STENCIL_6TH[3 + d + t];
        ours += j < 0 ? coef * (upper[t] - lower[t]) : coef * (lower[t] - upper[t]);
      }

      expect(ours).toBeCloseTo(reference, 12);
    }
  });

  it('is zero when the field is continuous across the seam', () => {
    // A uniform field has no residual: the true taps and the mirrored taps are
    // the same value, so a flat field must not be disturbed by the seam.
    const left = new DctPartition({ box: box(20), dx: DX, c: C, dt: DT });
    const right = new DctPartition({ box: box(20, 1, 1, 20), dx: DX, c: C, dt: DT });
    left.setPressure(new Float64Array(20).fill(1.75));
    right.setPressure(new Float64Array(20).fill(1.75));

    advance([left, right], 200);

    for (let i = 0; i < 20; i++) {
      expect(left.pressure[i]).toBeCloseTo(1.75, 9);
      expect(right.pressure[i]).toBeCloseTo(1.75, 9);
    }
  });

  it('drops the mirror term for partitions that zero-pad', () => {
    // A DCT partition mirrors, so its residual needs `across - own`. An FDTD
    // partition reads zero outside, so it needs `across` alone. Applying the
    // full difference to it would double-force the interface.
    const dct = new DctPartition({ box: box(8), dx: DX, c: C, dt: DT });
    const fdtd = new FdtdPartition({ box: box(8, 1, 1, 8), dx: DX, c: C, dt: DT });
    expect(dct.includeSelfTerms).toBe(true);
    expect(fdtd.includeSelfTerms).toBe(false);

    dct.setPressure(gaussian1d(8, 6, 2));
    fdtd.setPressure(new Float64Array(8));

    const iface = findInterface(dct, fdtd)!;
    applyInterfaceForcing(iface, C, DX);

    // With `own` dropped and the FDTD field still zero, the force it receives
    // must come only from the DCT partition's cells.
    fdtd.step();
    expect(maxAbs(fdtd.pressure)).toBeGreaterThan(0);
  });
});

describe('a split partition matches an undivided one', () => {
  /**
   * The headline test. One 400-cell domain versus the same domain cut in two at
   * cell 200, driven identically, stepped identically. A pulse starting at 150
   * has its right-going half cross the seam; if the interface treatment is
   * wrong the seam reflects, and the two runs diverge.
   */
  function splitVsWhole(splitAt: number, steps: number) {
    const n = 400;
    const whole = new DctPartition({ box: box(n), dx: DX, c: C, dt: DT });
    const left = new DctPartition({ box: box(splitAt), dx: DX, c: C, dt: DT });
    const right = new DctPartition({
      box: box(n - splitAt, 1, 1, splitAt),
      dx: DX,
      c: C,
      dt: DT,
    });

    const pulse = gaussian1d(n, 150, 6);
    whole.setPressure(pulse);
    left.setPressure(pulse.subarray(0, splitAt));
    right.setPressure(pulse.subarray(splitAt));

    advance([whole], steps);
    advance([left, right], steps);

    const joined = new Float64Array(n);
    joined.set(left.pressure, 0);
    joined.set(right.pressure, splitAt);
    return { whole: whole.pressure, joined };
  }

  it('transmits a pulse across the seam', () => {
    const { whole, joined } = splitVsWhole(200, 300);

    // The right-going half has travelled 120 cells, from 150 to 270 — well past
    // the seam at 200.
    expect(maxAbs(whole)).toBeGreaterThan(0.3);
    expect(relL2(joined, whole)).toBeLessThan(0.02);
  });

  it('leaves no reflection at the seam', () => {
    // A reflection would show up as energy travelling back to the left of the
    // seam that the undivided run does not have. Look only at the region behind
    // the crossing, where the undivided field is near zero.
    const { whole, joined } = splitVsWhole(200, 300);

    let spurious = 0;
    for (let i = 190; i < 200; i++) spurious = Math.max(spurious, Math.abs(joined[i] - whole[i]));
    expect(spurious).toBeLessThan(0.02 * maxAbs(whole));
  });

  it('holds wherever the cut is placed', () => {
    for (const splitAt of [120, 200, 260, 340]) {
      const { whole, joined } = splitVsWhole(splitAt, 300);
      expect(relL2(joined, whole)).toBeLessThan(0.03);
    }
  });

  it('holds across three partitions and two seams', () => {
    const n = 400;
    const whole = new DctPartition({ box: box(n), dx: DX, c: C, dt: DT });
    const a = new DctPartition({ box: box(140), dx: DX, c: C, dt: DT });
    const b = new DctPartition({ box: box(130, 1, 1, 140), dx: DX, c: C, dt: DT });
    const d = new DctPartition({ box: box(130, 1, 1, 270), dx: DX, c: C, dt: DT });

    const pulse = gaussian1d(n, 70, 6);
    whole.setPressure(pulse);
    a.setPressure(pulse.subarray(0, 140));
    b.setPressure(pulse.subarray(140, 270));
    d.setPressure(pulse.subarray(270));

    advance([whole], 400);
    advance([a, b, d], 400);

    const joined = new Float64Array(n);
    joined.set(a.pressure, 0);
    joined.set(b.pressure, 140);
    joined.set(d.pressure, 270);

    expect(relL2(joined, whole.pressure)).toBeLessThan(0.05);
  });

  it('holds in 2D, cut along Y', () => {
    const [nx, ny] = [96, 120];
    const cut = 60;
    const whole = new DctPartition({ box: box(nx, ny), dx: DX, c: C, dt: DT });
    const lower = new DctPartition({ box: box(nx, cut), dx: DX, c: C, dt: DT });
    const upper = new DctPartition({
      box: box(nx, ny - cut, 1, 0, cut),
      dx: DX,
      c: C,
      dt: DT,
    });

    const field = new Float64Array(nx * ny);
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const r = Math.hypot(x - nx / 2, y - 35);
        field[x + nx * y] = Math.exp(-0.5 * (r / 5) ** 2);
      }
    }
    whole.setPressure(field);
    lower.setPressure(field.subarray(0, nx * cut));
    upper.setPressure(field.subarray(nx * cut));

    advance([whole], 120);
    advance([lower, upper], 120);

    const joined = new Float64Array(nx * ny);
    joined.set(lower.pressure, 0);
    joined.set(upper.pressure, nx * cut);

    expect(maxAbs(whole.pressure)).toBeGreaterThan(0.1);
    expect(relL2(joined, whole.pressure)).toBeLessThan(0.05);
  });

  it('holds in 3D, cut along Z', () => {
    const [nx, ny, nz] = [32, 28, 40];
    const cut = 20;
    const whole = new DctPartition({ box: box(nx, ny, nz), dx: DX, c: C, dt: DT });
    const lower = new DctPartition({ box: box(nx, ny, cut), dx: DX, c: C, dt: DT });
    const upper = new DctPartition({
      box: box(nx, ny, nz - cut, 0, 0, cut),
      dx: DX,
      c: C,
      dt: DT,
    });

    const field = new Float64Array(nx * ny * nz);
    for (let z = 0; z < nz; z++) {
      for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
          const r = Math.hypot(x - nx / 2, y - ny / 2, z - 12);
          field[x + nx * (y + ny * z)] = Math.exp(-0.5 * (r / 4) ** 2);
        }
      }
    }
    whole.setPressure(field);
    lower.setPressure(field.subarray(0, nx * ny * cut));
    upper.setPressure(field.subarray(nx * ny * cut));

    advance([whole], 60);
    advance([lower, upper], 60);

    const joined = new Float64Array(nx * ny * nz);
    joined.set(lower.pressure, 0);
    joined.set(upper.pressure, nx * ny * cut);

    expect(maxAbs(whole.pressure)).toBeGreaterThan(0.05);
    expect(relL2(joined, whole.pressure)).toBeLessThan(0.05);
  });

  it('is much worse without the interface forcing', () => {
    // Guards the test itself: if the split run matched the undivided one even
    // with the seam left rigid, the comparison above would prove nothing.
    const n = 400;
    const splitAt = 200;
    const whole = new DctPartition({ box: box(n), dx: DX, c: C, dt: DT });
    const left = new DctPartition({ box: box(splitAt), dx: DX, c: C, dt: DT });
    const right = new DctPartition({
      box: box(n - splitAt, 1, 1, splitAt),
      dx: DX,
      c: C,
      dt: DT,
    });

    const pulse = gaussian1d(n, 150, 6);
    whole.setPressure(pulse);
    left.setPressure(pulse.subarray(0, splitAt));
    right.setPressure(pulse.subarray(splitAt));

    advance([whole], 300);
    // Step the two halves with no interface coupling at all.
    for (let s = 0; s < 300; s++) {
      left.step();
      right.step();
    }

    const joined = new Float64Array(n);
    joined.set(left.pressure, 0);
    joined.set(right.pressure, splitAt);

    expect(relL2(joined, whole.pressure)).toBeGreaterThan(0.5);
  });
});
