import { describe, expect, it } from 'vitest';

import { DctPartition } from '../dct-partition';
import { FdtdPartition } from '../fdtd-partition';
import { createComplexFftPlan } from '../fft';
import {
  ARD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE,
  ImpedanceBoundary,
  absorptionForImpedance,
  applyAllImpedanceForcing,
  impedanceCourantLimit,
  impedanceForAbsorption,
  reflectionForImpedance,
} from '../impedance';
import { Axis } from '../partition';

const C = 343;

/**
 * A 1D normal-incidence reflection rig.
 *
 * A Gaussian starts at cell 128 and splits. The right-going half passes the
 * probe at 256, travels to the boundary at the far end, and comes back past the
 * probe again. The left-going half bounces off the partition's own rigid low
 * face and passes the probe in between, then goes on to the boundary itself —
 * so the three arrivals are ordered `incident`, `rigid echo`, `boundary echo`,
 * with 1280 cells of travel between the second and third. Nothing else can land
 * in the window the measurement reads.
 */
const N = 1024;
const SOURCE = 128;
const PROBE = 256;

function measure(alpha: number, courant: number, dx: number, sigma = 1.6) {
  const dt = (courant * dx) / C;
  const partition = new DctPartition({
    box: { x: 0, y: 0, z: 0, w: N, h: 1, d: 1 },
    dx,
    c: C,
    dt,
  });
  const impedance = impedanceForAbsorption(alpha);
  const boundaries = Number.isFinite(impedance)
    ? [
        new ImpedanceBoundary({
          partition,
          axis: Axis.X,
          high: true,
          uMin: 0,
          uMax: 1,
          vMin: 0,
          vMax: 1,
          impedance,
        }),
      ]
    : [];

  const field = new Float64Array(N);
  for (let i = 0; i < N; i++) field[i] = Math.exp(-0.5 * ((i - SOURCE) / sigma) ** 2);
  partition.setPressure(field);

  const incidentAt = (PROBE - SOURCE) / courant;
  const echoAt = incidentAt + (2 * (N - PROBE)) / courant;
  const steps = Math.ceil(echoAt + 300 / courant);
  const trace = new Float64Array(steps);
  for (let s = 0; s < steps; s++) {
    applyAllImpedanceForcing(boundaries);
    partition.step();
    trace[s] = partition.pressure[PROBE];
  }
  return { trace, incidentAt, echoAt, dt };
}

function spectrum(trace: Float64Array, centre: number, half: number, n: number): Float64Array {
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  const lo = Math.max(0, Math.round(centre - half));
  const hi = Math.min(trace.length, Math.round(centre + half));
  for (let i = lo; i < hi; i++) re[i - lo] = trace[i];
  createComplexFftPlan(n).forward(re, im);
  const mag = new Float64Array(n / 2);
  for (let k = 0; k < n / 2; k++) mag[k] = Math.hypot(re[k], im[k]);
  return mag;
}

/** Delivered absorption at each frequency, from one broadband run. */
function deliveredAlpha(
  alpha: number,
  courant: number,
  dx: number,
  frequencies: readonly number[],
): number[] {
  const run = measure(alpha, courant, dx);
  const n = 4096;
  const half = 400 / courant;
  const incident = spectrum(run.trace, run.incidentAt, half, n);
  const reflected = spectrum(run.trace, run.echoAt + 100 / courant, half, n);
  return frequencies.map((f) => {
    const k = f * n * run.dt;
    const k0 = Math.floor(k);
    const t = k - k0;
    const a = incident[k0] * (1 - t) + incident[k0 + 1] * t;
    const b = reflected[k0] * (1 - t) + reflected[k0 + 1] * t;
    const r = b / a;
    return 1 - r * r;
  });
}

/** Cell size giving `cellsPerWavelength` at 1 kHz. */
const dxFor = (cellsPerWavelength: number) => C / (1000 * cellsPerWavelength);

describe('impedance and absorption', () => {
  it('maps a coefficient to an impedance and back', () => {
    for (const alpha of [0, 0.05, 0.2, 0.5, 0.8, 0.95]) {
      const xi = impedanceForAbsorption(alpha);
      expect(absorptionForImpedance(xi)).toBeCloseTo(alpha, 12);
    }
    // The two ends, which are the cases the closed form has to special-case.
    expect(impedanceForAbsorption(1)).toBe(1); // matched: R = 0
    expect(impedanceForAbsorption(0)).toBe(Infinity); // rigid: R = 1
    expect(reflectionForImpedance(Infinity)).toBe(1);
    expect(absorptionForImpedance(Infinity)).toBe(0);
  });

  it('refuses coefficients and impedances that are not physical', () => {
    expect(() => impedanceForAbsorption(-0.1)).toThrow(/must be in \[0, 1\]/);
    expect(() => impedanceForAbsorption(1.2)).toThrow(/must be in \[0, 1\]/);
    expect(() => impedanceForAbsorption(NaN)).toThrow(/must be in \[0, 1\]/);
    expect(() => reflectionForImpedance(-1)).toThrow(/must be >= 0/);
  });

  it('needs a positive face area and a positive impedance', () => {
    const partition = new DctPartition({
      box: { x: 0, y: 0, z: 0, w: 8, h: 4, d: 4 },
      dx: 0.1,
      c: C,
      dt: 1e-4,
    });
    const base = {
      partition,
      axis: Axis.X,
      high: true,
      uMin: 0,
      uMax: 4,
      vMin: 0,
      vMax: 4,
      impedance: 3,
    };
    expect(() => new ImpedanceBoundary({ ...base, uMax: 0 })).toThrow(/positive face area/);
    expect(() => new ImpedanceBoundary({ ...base, vMax: 0 })).toThrow(/positive face area/);
    expect(() => new ImpedanceBoundary({ ...base, impedance: 0 })).toThrow(
      /pressure-release/,
    );
    expect(() => new ImpedanceBoundary({ ...base, impedance: -2 })).toThrow(/must be positive/);
  });
});

describe('the rigid limit is exact, not approximate', () => {
  it('leaves a partition bit-for-bit identical at infinite impedance', () => {
    // The whole design rests on this: `ghost = mirror` makes the residual
    // identically zero, so a rigid surface is the partition's own behaviour
    // rather than a boundary that happens to reflect nearly everything. A
    // scheme that only approximated it would drift here.
    const make = () => {
      const p = new DctPartition({
        box: { x: 0, y: 0, z: 0, w: 16, h: 8, d: 8 },
        dx: 0.1,
        c: C,
        dt: (0.5 * 0.1) / C,
      });
      const field = new Float64Array(16 * 8 * 8);
      for (let i = 0; i < field.length; i++) field[i] = Math.sin(i * 0.37) * Math.cos(i * 0.11);
      p.setPressure(field);
      return p;
    };

    const bare = make();
    const bounded = make();
    const boundaries = [Axis.X, Axis.Y, Axis.Z].flatMap((axis) =>
      [false, true].map(
        (high) =>
          new ImpedanceBoundary({
            partition: bounded,
            axis,
            high,
            uMin: 0,
            uMax: axis === Axis.X ? 8 : 16,
            vMin: 0,
            vMax: axis === Axis.Z ? 8 : 8,
            impedance: Infinity,
          }),
      ),
    );

    for (let s = 0; s < 200; s++) {
      applyAllImpedanceForcing(boundaries);
      bounded.step();
      bare.step();
    }
    for (let i = 0; i < bare.pressure.length; i++) {
      expect(bounded.pressure[i]).toBe(bare.pressure[i]);
    }
  });
});

describe('the partition decides whether the mirror is subtracted', () => {
  it('flips an FDTD partition from pressure-release to rigid', () => {
    // `includeSelfTerms` is the difference. A DCT partition really mirrors, so
    // the residual is `ghost - own` and a rigid boundary cancels to nothing. An
    // FDTD partition's stencil reads zero outside its array — a pressure-release
    // surface, reflecting with R = -1 — so there is no mirror to cancel and the
    // residual is `ghost` alone, which is what turns that face rigid.
    //
    // Observable as the *sign* of the reflection, which is not a matter of
    // degree: the bare partition returns the pulse inverted and the bounded one
    // returns it upright. A boundary that subtracted the mirror from an FDTD
    // partition anyway would double-force the face, and this is the only thing
    // in the suite that would notice — a thin box in a decomposition becomes an
    // `FdtdPartition`, so the branch is reached in real runs.
    const n = 160;
    const dx = 0.1;
    const source = 40;
    const probe = 70;
    const courant = 0.4;

    const trace = (rigid: boolean) => {
      const partition = new FdtdPartition({
        box: { x: 0, y: 0, z: 0, w: n, h: 1, d: 1 },
        dx,
        c: C,
        dt: (courant * dx) / C,
      });
      const boundaries = rigid
        ? [
            new ImpedanceBoundary({
              partition,
              axis: Axis.X,
              high: true,
              uMin: 0,
              uMax: 1,
              vMin: 0,
              vMax: 1,
              impedance: Infinity,
            }),
          ]
        : [];
      const field = new Float64Array(n);
      for (let i = 0; i < n; i++) field[i] = Math.exp(-0.5 * ((i - source) / 3) ** 2);
      partition.setPressure(field);

      const echoAt = (probe - source) / courant + (2 * (n - probe)) / courant;
      const steps = Math.ceil(echoAt + 80 / courant);
      const out = new Float64Array(steps);
      for (let s = 0; s < steps; s++) {
        applyAllImpedanceForcing(boundaries);
        partition.step();
        out[s] = partition.pressure[probe];
      }
      // Signed extremum of the echo window.
      const lo = Math.round(echoAt - 60 / courant);
      const hi = Math.min(steps, Math.round(echoAt + 60 / courant));
      let best = 0;
      for (let i = lo; i < hi; i++) if (Math.abs(out[i]) > Math.abs(best)) best = out[i];
      return best;
    };

    const bare = trace(false);
    const rigid = trace(true);
    expect(bare).toBeLessThan(0); // zero outside the array: R = -1
    expect(rigid).toBeGreaterThan(0); // ghost = mirror: R = +1
    // Same magnitude either way — the boundary changes the sign, not the loss.
    expect(Math.abs(rigid)).toBeCloseTo(Math.abs(bare), 1);
  }, 30_000);
});

describe('measured normal-incidence absorption', () => {
  const FREQUENCIES = [125, 250, 500, 707, 1000];

  it.each([0.1, 0.3, 0.6, 0.9])(
    'delivers alpha %f across the band at six cells per wavelength',
    (alpha) => {
      const delivered = deliveredAlpha(alpha, 0.4, dxFor(6), FREQUENCIES);
      for (const value of delivered) {
        // Measured spread on this rig is at most 0.013 from 125 Hz to 1 kHz.
        expect(value).toBeCloseTo(alpha, 1);
        expect(Math.abs(value - alpha)).toBeLessThan(0.02);
      }
    },
    60_000,
  );

  it('holds to about 0.01 down to four cells per wavelength and no further', () => {
    const alpha = 0.3;
    const fine = deliveredAlpha(alpha, 0.4, dxFor(ARD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE), [1000]);
    expect(Math.abs(fine[0] - alpha)).toBeLessThan(0.02);

    // At ARD's own default the top octave is at 77% of the grid's spatial
    // Nyquist and the boundary cannot deliver what it was asked for. This is
    // pinned because the driver warns on it: if the mapping ever became
    // accurate here, the warning would be wrong.
    const coarse = deliveredAlpha(alpha, 0.4, dxFor(2.6), [1000]);
    expect(coarse[0]).toBeLessThan(alpha - 0.1);
  }, 60_000);

  it('never returns more energy than it received, at any resolution', () => {
    // The failure mode that matters. A boundary that under-absorbs makes a room
    // too live and is obvious; one that over-returns is an energy source, and a
    // reverberation time computed from it is not merely wrong but unbounded.
    // The same rig run against a PML slab measures alpha of -13 at 2.6 cells
    // per wavelength; this cannot, because the ghost filter is a contraction.
    for (const cellsPerWavelength of [2.6, 4, 6]) {
      for (const alpha of [0.1, 0.5, 0.9]) {
        const delivered = deliveredAlpha(alpha, 0.4, dxFor(cellsPerWavelength), [
          125, 500, 1000,
        ]);
        for (const value of delivered) {
          expect(value).toBeGreaterThan(-1e-6);
          expect(value).toBeLessThan(1 + 1e-6);
        }
      }
    }
  }, 120_000);

  it('absorbs more as the coefficient rises, at a fixed frequency', () => {
    // Monotonicity is what makes the closed-form mapping usable without a
    // measured inverse: a caller asking for more absorption must get more.
    const at500 = [0.1, 0.3, 0.6, 0.9].map(
      (alpha) => deliveredAlpha(alpha, 0.4, dxFor(6), [500])[0],
    );
    for (let i = 1; i < at500.length; i++) expect(at500[i]).toBeGreaterThan(at500[i - 1]);
  }, 120_000);
});

describe('stability', () => {
  /** Largest stable Courant number measured per rank, from the module's table. */
  const MEASURED: { alpha: number; limits: [number, number, number] }[] = [
    { alpha: 0.05, limits: [0.95, 0.7, 0.625] },
    { alpha: 0.2, limits: [0.85, 0.675, 0.6] },
    { alpha: 0.4, limits: [0.75, 0.625, 0.6] },
    { alpha: 0.6, limits: [0.7, 0.6, 0.6] },
    { alpha: 0.8, limits: [0.625, 0.575, 0.575] },
    { alpha: 0.95, limits: [0.575, 0.55, 0.575] },
    { alpha: 1, limits: [0.525, 0.525, 0.55] },
  ];

  /** The step the envelope sweep used, and so the resolution of every row. */
  const SWEEP_STEP = 0.025;

  it('claims a limit at least one sampling rung under every measurement', () => {
    // The bound is an empirical straight line, not a von Neumann result, so the
    // thing to check is that it is conservative everywhere the envelope was
    // measured — and by more than the sweep could resolve. A row reading 0.600
    // means "stable at 0.600, divergent at 0.625", and the sweep covered one
    // grid size per rank, so a margin inside 0.025 is not a margin.
    for (const { alpha, limits } of MEASURED) {
      const claimed = impedanceCourantLimit(alpha);
      for (const measured of limits) {
        expect(claimed).toBeLessThanOrEqual(measured - SWEEP_STEP);
      }
    }
  });

  it('stays above the limit a PML slab would impose, at every coefficient', () => {
    // This is the claim the module makes and the reason the default changed. A
    // slab on a 3D room caps the whole simulation at 0.446 regardless of its
    // material; the loosest this ever gets is 0.5, at a perfect absorber.
    const slab = 0.95 * Math.sqrt(4 / ((1088 / 180) * 3));
    expect(slab).toBeCloseTo(0.446, 3);
    for (const alpha of [0, 0.3, 0.6, 0.9, 1]) {
      expect(impedanceCourantLimit(alpha)).toBeGreaterThan(slab);
    }
    expect(impedanceCourantLimit(1)).toBeCloseTo(0.5, 12);
    expect(impedanceCourantLimit(0)).toBeCloseTo(0.55, 12);
    // Out-of-range input is clamped, not extrapolated into a larger limit.
    expect(impedanceCourantLimit(2)).toBeCloseTo(0.5, 12);
    expect(impedanceCourantLimit(-1)).toBeCloseTo(0.55, 12);
  });

  it.each([0.2, 0.6, 1])(
    'runs a 3D room at its own limit without growing (alpha %f)',
    (alpha) => {
      const dx = 0.1;
      const courant = impedanceCourantLimit(alpha);
      const partition = new DctPartition({
        box: { x: 0, y: 0, z: 0, w: 20, h: 14, d: 12 },
        dx,
        c: C,
        dt: (courant * dx) / C,
      });
      const boundaries = [Axis.X, Axis.Y, Axis.Z].flatMap((axis) =>
        [false, true].map((high) => {
          const [uMax, vMax] =
            axis === Axis.X ? [14, 12] : axis === Axis.Y ? [20, 12] : [20, 14];
          return new ImpedanceBoundary({
            partition,
            axis,
            high,
            uMin: 0,
            uMax,
            vMin: 0,
            vMax,
            impedance: impedanceForAbsorption(alpha),
          });
        }),
      );

      // Seeded broadband on purpose. An instability lives in the modes closest
      // to the temporal Nyquist, which a band-limited source never excites —
      // so a rig driven by a realistic pulse would pass a Courant number that
      // blows up in practice on rounding noise alone.
      const field = new Float64Array(partition.pressure.length);
      for (let i = 0; i < field.length; i++) {
        field[i] = Math.sin(i * 0.31) + Math.cos(i * 1.7);
      }
      partition.setPressure(field);

      const energy = () => {
        let sum = 0;
        for (const p of partition.pressure) sum += p * p;
        return sum;
      };
      const start = energy();
      let worst = start;
      for (let s = 0; s < 2000; s++) {
        applyAllImpedanceForcing(boundaries);
        partition.step();
        worst = Math.max(worst, energy());
      }
      expect(Number.isFinite(worst)).toBe(true);
      // Sum of p² is not the conserved quantity, so it wanders; what must not
      // happen is growth, and with absorbing boundaries it must in fact decay.
      expect(worst / start).toBeLessThan(2);
      expect(energy() / start).toBeLessThan(0.5);
    },
    120_000,
  );

  it('forgets its filter state on reset', () => {
    // The ghost filter is a one-pole recursion with memory. A boundary reused
    // across runs without a reset injects the tail of the last one into the
    // first steps of the next — a quiet, plausible-looking error.
    const dx = 0.1;
    const make = () => {
      const p = new DctPartition({
        box: { x: 0, y: 0, z: 0, w: 32, h: 1, d: 1 },
        dx,
        c: C,
        dt: (0.5 * dx) / C,
      });
      const b = new ImpedanceBoundary({
        partition: p,
        axis: Axis.X,
        high: true,
        uMin: 0,
        uMax: 1,
        vMin: 0,
        vMax: 1,
        impedance: impedanceForAbsorption(0.7),
      });
      const field = new Float64Array(32);
      for (let i = 0; i < 32; i++) field[i] = Math.exp(-0.5 * ((i - 8) / 2) ** 2);
      p.setPressure(field);
      return { p, b };
    };

    const fresh = make();
    for (let s = 0; s < 40; s++) {
      applyAllImpedanceForcing([fresh.b]);
      fresh.p.step();
    }

    const reused = make();
    for (let s = 0; s < 60; s++) {
      applyAllImpedanceForcing([reused.b]);
      reused.p.step();
    }
    reused.b.reset();
    reused.p.setPressure(
      Float64Array.from({ length: 32 }, (_, i) => Math.exp(-0.5 * ((i - 8) / 2) ** 2)),
    );
    for (let s = 0; s < 40; s++) {
      applyAllImpedanceForcing([reused.b]);
      reused.p.step();
    }

    for (let i = 0; i < 32; i++) {
      expect(reused.p.pressure[i]).toBeCloseTo(fresh.p.pressure[i], 12);
    }
  });

  it('reports the face cells it covers', () => {
    const partition = new DctPartition({
      box: { x: 0, y: 0, z: 0, w: 8, h: 6, d: 4 },
      dx: 0.1,
      c: C,
      dt: 1e-4,
    });
    const boundary = new ImpedanceBoundary({
      partition,
      axis: Axis.X,
      high: false,
      uMin: 0,
      uMax: 6,
      vMin: 0,
      vMax: 4,
      impedance: 5,
    });
    expect(boundary.cellCount).toBe(24);
    expect(boundary.depth).toBe(3);
  });

  it('uses fewer ghost depths than the partition is thick', () => {
    // A two-cell partition has no third cell for the stencil's outermost tap to
    // mirror, so the residual is two terms rather than three. Silently reading
    // past the end would fabricate a tap from whatever the next row holds.
    const partition = new DctPartition({
      box: { x: 0, y: 0, z: 0, w: 2, h: 4, d: 4 },
      dx: 0.1,
      c: C,
      dt: 1e-4,
    });
    const boundary = new ImpedanceBoundary({
      partition,
      axis: Axis.X,
      high: false,
      uMin: 0,
      uMax: 4,
      vMin: 0,
      vMax: 4,
      impedance: 5,
    });
    expect(boundary.depth).toBe(2);
  });
});
