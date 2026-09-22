/**
 * Tests for the ARD partition solvers (plan Phase 4).
 *
 * The DCT partition is the thing being validated; the FDTD partition is the
 * independent second opinion. They discretize the same equation by unrelated
 * means — an exact modal recurrence versus an explicit 6th-order stencil — so
 * agreement between them on identical input is evidence, where either alone
 * checking against itself would not be.
 */

import { DctPartition } from '../dct-partition';
import { FdtdPartition } from '../fdtd-partition';
import type { Box } from '../partition';

const C = 343; // m/s — deliberately not 1, see the forcing-convention note below
const DX = 0.05;

function box(w: number, h = 1, d = 1, x = 0, y = 0, z = 0): Box {
  return { x, y, z, w, h, d };
}

/** dt for a given Courant number. */
function dtFor(courant: number, dx = DX, c = C): number {
  return (courant * dx) / c;
}

/** Smooth, well-resolved Gaussian — narrow enough to move, wide enough not to alias. */
function gaussian(n: number, centre: number, width: number): Float64Array {
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = (i - centre) / width;
    out[i] = Math.exp(-0.5 * t * t);
  }
  return out;
}

function maxAbs(a: ArrayLike<number>): number {
  let worst = 0;
  for (let i = 0; i < a.length; i++) worst = Math.max(worst, Math.abs(a[i]));
  return worst;
}

describe('DctPartition', () => {
  it('conserves modal energy over 10,000 unforced steps', () => {
    const p = new DctPartition({ box: box(64, 16), dx: DX, c: C, dt: dtFor(0.5) });
    p.setPressure(
      Array.from({ length: 64 * 16 }, (_, i) => Math.sin(i * 0.37) * Math.cos(i * 0.11)),
    );

    const initial = p.modalEnergy();
    expect(initial).toBeGreaterThan(0);

    for (let n = 0; n < 10_000; n++) p.step();

    const drift = Math.abs(p.modalEnergy() - initial) / initial;
    expect(drift).toBeLessThan(1e-9);
  });

  it('is stable at Courant numbers far past any CFL limit', () => {
    // The whole point of the modal update: every mode is an exact oscillator,
    // so |cos(w dt)| <= 1 for any dt and nothing can grow.
    const p = new DctPartition({ box: box(32, 32), dx: DX, c: C, dt: dtFor(20) });
    p.setPressure(Array.from({ length: 1024 }, (_, i) => Math.sin(i)));

    for (let n = 0; n < 2000; n++) p.step();

    expect(Number.isFinite(maxAbs(p.pressure))).toBe(true);
    expect(maxAbs(p.pressure)).toBeLessThan(100);
  });

  describe('eigenfrequencies', () => {
    it('matches c/(2L) for the fundamental of a 1D box', () => {
      const n = 80;
      const p = new DctPartition({ box: box(n), dx: DX, c: C, dt: dtFor(0.5) });
      const expected = C / (2 * n * DX);
      expect(p.angularFrequency(1) / (2 * Math.PI)).toBeCloseTo(expected, 9);
    });

    it('matches the analytic 3D shoebox series', () => {
      // f(kx,ky,kz) = (c/2) sqrt((kx/Lx)^2 + (ky/Ly)^2 + (kz/Lz)^2)
      const [nx, ny, nz] = [20, 16, 12];
      const p = new DctPartition({ box: box(nx, ny, nz), dx: DX, c: C, dt: dtFor(0.4) });
      const [lx, ly, lz] = [nx * DX, ny * DX, nz * DX];

      for (const [kx, ky, kz] of [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 0],
        [2, 1, 3],
        [5, 4, 2],
      ]) {
        const expected =
          (C / 2) * Math.hypot(kx / lx, ky / ly, kz / lz);
        expect(p.angularFrequency(kx, ky, kz) / (2 * Math.PI)).toBeCloseTo(expected, 8);
      }
    });

    it('gives the DC mode zero frequency', () => {
      // The reference's off-by-one hands the DC mode a non-zero frequency
      // (plan §1.5 item 4); a constant field must simply not evolve.
      const p = new DctPartition({ box: box(24, 8), dx: DX, c: C, dt: dtFor(0.5) });
      expect(p.angularFrequency(0, 0, 0)).toBe(0);

      p.setPressure(new Float64Array(24 * 8).fill(2.5));
      for (let n = 0; n < 500; n++) p.step();

      for (let i = 0; i < p.pressure.length; i++) {
        expect(p.pressure[i]).toBeCloseTo(2.5, 9);
      }
    });
  });

  it('keeps every mode below the temporal aliasing limit at Courant 0.5', () => {
    // w_max * dt = pi * sqrt(rank) * Courant, so 0.5 is under pi in 1D-3D.
    for (const dims of [[64, 1, 1], [64, 48, 1], [32, 24, 16]] as const) {
      const p = new DctPartition({
        box: box(dims[0], dims[1], dims[2]),
        dx: DX,
        c: C,
        dt: dtFor(0.5),
      });
      expect(p.maxPhaseAdvance()).toBeLessThan(Math.PI);
    }
  });

  it('drives the DC mode with the exact discrete parabola', () => {
    // With w = 0 the mode obeys M'' = F. The reference cannot take this branch
    // at all: its off-by-one gives the DC mode a non-zero w and a finite
    // 2F/w^2 coefficient. Here forceCoef[0] is dt^2, so with M^0 = M^-1 = 0 and
    // constant forcing f the recurrence M^{n+1} = 2M^n - M^{n-1} + f dt^2 has
    // the exact solution f dt^2 n(n+1)/2 — which is the continuous f t^2 / 2
    // scaled by (n+1)/n, so assert the discrete form, not the continuous one.
    const n = 16;
    const dt = dtFor(0.5);
    const p = new DctPartition({ box: box(n), dx: DX, c: C, dt });
    const steps = 50;

    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < n; i++) p.addForce(i, 0, 0, 1);
      p.step();
    }

    const expected = dt * dt * ((steps * (steps + 1)) / 2);
    for (let i = 0; i < n; i++) {
      expect(p.pressure[i]).toBeCloseTo(expected, 12);
    }
  });
});

describe('FdtdPartition', () => {
  it('reports the von Neumann CFL bound per rank', () => {
    const mk = (w: number, h: number, d: number) =>
      new FdtdPartition({ box: box(w, h, d), dx: DX, c: C, dt: dtFor(0.3) });

    expect(mk(32, 1, 1).cflLimit).toBeCloseTo(0.8135, 3);
    expect(mk(32, 32, 1).cflLimit).toBeCloseTo(0.5752, 3);
    expect(mk(32, 32, 32).cflLimit).toBeCloseTo(0.4697, 3);
  });

  it('refuses a Courant number past its stability limit', () => {
    // Courant 0.5 is the plan's default and is safe for DCT partitions, but a
    // 3D FDTD partition is unstable there (limit 0.470). Fail loudly.
    expect(
      () => new FdtdPartition({ box: box(16, 16, 16), dx: DX, c: C, dt: dtFor(0.5) }),
    ).toThrow(/CFL-unstable/);
    expect(
      () => new FdtdPartition({ box: box(16, 16, 16), dx: DX, c: C, dt: dtFor(0.4) }),
    ).not.toThrow();
  });

  it('ignores axes of extent 1, so a 2D run solves the 2D equation', () => {
    // A 1-thick axis carries no second derivative. Stencilled with zero
    // padding it would collapse to the centre tap and inject -490*p into the
    // Laplacian — a large spurious stiffness that makes a 2D run (nz === 1)
    // solve the wrong equation and, at this Courant number, diverge.
    // Cross-check against the DCT partition, which gets this right by
    // construction (kz only takes the value 0, so fz = 0).
    const [nx, ny] = [120, 96];
    const dt = dtFor(0.4);
    const fdtd = new FdtdPartition({ box: box(nx, ny, 1), dx: DX, c: C, dt });
    const dct = new DctPartition({ box: box(nx, ny, 1), dx: DX, c: C, dt });

    const pulse = new Float64Array(nx * ny);
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const r = Math.hypot(x - nx / 2, y - ny / 2);
        pulse[x + nx * y] = Math.exp(-0.5 * (r / 5) ** 2);
      }
    }
    fdtd.setPressure(pulse);
    dct.setPressure(pulse);

    for (let s = 0; s < 40; s++) {
      fdtd.step();
      dct.step();
    }

    expect(maxAbs(fdtd.pressure)).toBeLessThan(2);

    // Compare away from the boundaries, where the two differ by design.
    let num = 0;
    let den = 0;
    for (let y = 30; y < ny - 30; y++) {
      for (let x = 30; x < nx - 30; x++) {
        const i = x + nx * y;
        const diff = fdtd.pressure[i] - dct.pressure[i];
        num += diff * diff;
        den += dct.pressure[i] * dct.pressure[i];
      }
    }
    expect(Math.sqrt(num / den)).toBeLessThan(0.02);
  });
});

describe('DctPartition vs FdtdPartition', () => {
  /**
   * The two solvers have different boundary conditions — the DCT partition's
   * walls are rigid, the FDTD partition's stencil reads zero outside — so they
   * can only be compared while the wave is still far from both ends. 150 steps
   * at Courant 0.4 moves the front 60 cells, well inside a 400-cell domain.
   */
  it('agrees on a propagating pulse, at a physical speed of sound', () => {
    const n = 400;
    const dt = dtFor(0.4);
    const dct = new DctPartition({ box: box(n), dx: DX, c: C, dt });
    const fdtd = new FdtdPartition({ box: box(n), dx: DX, c: C, dt });

    const pulse = gaussian(n, n / 2, 6);
    dct.setPressure(pulse);
    fdtd.setPressure(pulse);

    for (let s = 0; s < 150; s++) {
      dct.step();
      fdtd.step();
    }

    // Compare over the region the wave has reached, away from both boundaries.
    let num = 0;
    let den = 0;
    for (let i = 100; i < 300; i++) {
      const diff = dct.pressure[i] - fdtd.pressure[i];
      num += diff * diff;
      den += dct.pressure[i] * dct.pressure[i];
    }
    const relL2 = Math.sqrt(num / den);
    expect(relL2).toBeLessThan(0.01);
  });

  /**
   * This is the test that pins the forcing-term convention. The reference sets
   * interface forcing to `c^2 * sip` but has `FDTDPartition` consume it as
   * `c^2 dt^2 (lap + force)`, applying `c^2` twice. At the reference's c = 1
   * that is invisible; at 343 m/s the two partitions would disagree by ~10^5.
   */
  it('agrees on the response to an identical forcing term', () => {
    const n = 400;
    const dt = dtFor(0.4);
    const dct = new DctPartition({ box: box(n), dx: DX, c: C, dt });
    const fdtd = new FdtdPartition({ box: box(n), dx: DX, c: C, dt });

    const centre = n >> 1;
    for (let s = 0; s < 150; s++) {
      // A smooth pulse in time, so both schemes resolve it.
      const t = s * dt;
      const tau = 30 * dt;
      const amp = 1e6 * Math.exp(-0.5 * ((t - 3 * tau) / tau) ** 2);
      for (let i = -3; i <= 3; i++) {
        const w = Math.exp(-0.5 * (i / 1.5) ** 2);
        dct.addForce(centre + i, 0, 0, amp * w);
        fdtd.addForce(centre + i, 0, 0, amp * w);
      }
      dct.step();
      fdtd.step();
    }

    const peak = maxAbs(dct.pressure);
    expect(peak).toBeGreaterThan(1e-6);

    let num = 0;
    let den = 0;
    for (let i = 100; i < 300; i++) {
      const diff = dct.pressure[i] - fdtd.pressure[i];
      num += diff * diff;
      den += dct.pressure[i] * dct.pressure[i];
    }
    expect(Math.sqrt(num / den)).toBeLessThan(0.01);
  });
});

describe('forcing bookkeeping', () => {
  it('accumulates rather than overwriting', () => {
    // The reference's setForce overwrites, so a cell that is both a source cell
    // and an interface cell loses one contribution (plan §1.5 item 6).
    const dt = dtFor(0.5);
    const one = new DctPartition({ box: box(8), dx: DX, c: C, dt });
    const two = new DctPartition({ box: box(8), dx: DX, c: C, dt });

    one.addForce(4, 0, 0, 3);
    two.addForce(4, 0, 0, 1);
    two.addForce(4, 0, 0, 2);
    one.step();
    two.step();

    for (let i = 0; i < 8; i++) expect(two.pressure[i]).toBeCloseTo(one.pressure[i], 15);
  });

  it('clears the forcing field every step', () => {
    // The reference's DCTPartition never clears its force volume, so a single
    // impulse persists as a permanent static force (plan §1.5 item 7).
    //
    // Discriminate directly: drive one partition once and another on every
    // step. A retained force would make the first behave like the second. The
    // DC mode is the clean probe — it has no restoring force, so one impulse
    // ramps the spatial mean linearly while sustained forcing ramps it as
    // n(n+1)/2. After 200 steps that is a ~100x separation.
    const dt = dtFor(0.5);
    const steps = 200;
    const once = new DctPartition({ box: box(16), dx: DX, c: C, dt });
    const every = new DctPartition({ box: box(16), dx: DX, c: C, dt });

    for (let s = 0; s < steps; s++) {
      if (s === 0) for (let i = 0; i < 16; i++) once.addForce(i, 0, 0, 1);
      for (let i = 0; i < 16; i++) every.addForce(i, 0, 0, 1);
      once.step();
      every.step();
    }

    const mean = (a: Float64Array) => a.reduce((t, v) => t + v, 0) / a.length;
    const onceMean = mean(once.pressure);
    const everyMean = mean(every.pressure);

    expect(onceMean).toBeGreaterThan(0);
    expect(everyMean / onceMean).toBeGreaterThan(20);
    // One impulse ramps linearly: M^n = f dt^2 * n.
    expect(onceMean).toBeCloseTo(dt * dt * steps, 12);
  });

  it('drops out-of-range writes and reads', () => {
    const p = new DctPartition({ box: box(4, 4), dx: DX, c: C, dt: dtFor(0.5) });
    expect(() => p.addForce(-1, 0, 0, 1)).not.toThrow();
    expect(() => p.addForce(4, 0, 0, 1)).not.toThrow();
    expect(p.pressureAt(-1, 0, 0)).toBe(0);
    expect(p.pressureAt(0, 99, 0)).toBe(0);

    p.step();
    expect(maxAbs(p.pressure)).toBe(0);
  });

  it('rejects degenerate geometry and parameters', () => {
    expect(() => new DctPartition({ box: box(0, 4), dx: DX, c: C, dt: 1e-5 })).toThrow();
    expect(() => new DctPartition({ box: box(4), dx: 0, c: C, dt: 1e-5 })).toThrow();
    expect(() => new DctPartition({ box: box(4), dx: DX, c: 0, dt: 1e-5 })).toThrow();
    expect(() => new DctPartition({ box: box(4), dx: DX, c: C, dt: 0 })).toThrow();
  });
});
