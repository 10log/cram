/**
 * The end-to-end sanity check §6 of the plan has asked for since it was written:
 * does a shoebox with a uniform absorption coefficient decay at the rate
 * statistical room acoustics says it should?
 *
 * Every other test in this directory checks a mechanism. This one checks the
 * answer, against a formula that knows nothing about DCTs, ghost cells or
 * residual forcing — which is the only kind of check that can catch a solver
 * that is self-consistently wrong.
 *
 * ## Why it is a bracket and not a number
 *
 * The material's α is random-incidence (Sabine) absorption, and since #221 the
 * wall is built so that its diffuse-field absorption *is* α (Paris's formula,
 * inverted). A diffuse field would therefore decay at Eyring's T60 at α, and
 * that is the **lower** bound: nothing the wall does can absorb more.
 *
 * The **upper** bound is Eyring at the same wall's normal-incidence
 * absorption, which is lower than α — a locally-reacting surface absorbs most
 * between normal and grazing incidence. A field that never went diffuse, with
 * energy trapped in axial modes striking the walls head-on, decays at that
 * rate. The room here is in the modal region below about 250 Hz and the run
 * carries 0–500 Hz, so the answer sits between the two.
 *
 * Both bounds are one-sided errors a broken boundary fails: a surface that does
 * not absorb enough runs past the upper bound, one that absorbs too much falls
 * under the lower. Before #221 the bracket was built around a softer wall — the
 * one that absorbs α at normal incidence — and quoted its diffuse absorption as
 * 0.396 at α = 0.2 from a mis-transcribed Paris formula; the correct figure is
 * 0.323.
 */

import { describe, expect, it } from 'vitest';

import { decompose } from '../decompose';
import { absorptionForImpedance, impedanceForMaterialAbsorption } from '../impedance';
import { bandlimitedPulse, createArdSimulation, planArdTimeStep } from '../simulation';
import { Cell, type VoxelGrid } from '../voxelize';

const C = 343;

function shoeboxGrid(ax: number, ay: number, az: number, dx: number): VoxelGrid {
  const nx = ax + 2;
  const ny = ay + 2;
  const nz = az + 2;
  const cells = new Uint8Array(nx * ny * nz);
  const surfaceOf = new Int32Array(nx * ny * nz).fill(-1);
  const at = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  let airCount = 0;

  for (let k = 1; k <= az; k++) {
    for (let j = 1; j <= ay; j++) {
      for (let i = 1; i <= ax; i++) {
        cells[at(i, j, k)] = Cell.Air;
        airCount++;
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
          const [a, b, d] = [i + di, j + dj, k + dk];
          return (
            a >= 0 && b >= 0 && d >= 0 && a < nx && b < ny && d < nz &&
            cells[at(a, b, d)] === Cell.Air
          );
        });
        if (touchesAir) surfaceOf[at(i, j, k)] = 0;
      }
    }
  }

  return {
    nx, ny, nz,
    dx,
    origin: { x: 0, y: 0, z: 0 },
    cells,
    surfaceOf,
    airCount,
    solidCount: nx * ny * nz - airCount,
    leaked: false,
    warnings: [],
  };
}

/**
 * Diffuse-field absorption of a real impedance in 3D: `1 − |R(θ)|²` averaged
 * over a hemisphere with the `cosθ·sinθ` weight, by direct integration — kept
 * independent of `acoustics/random-incidence.ts`, which is under test here.
 */
function diffuseAbsorption3D(xi: number): number {
  const n = 20000;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n) * (Math.PI / 2);
    const R = (xi * Math.cos(t) - 1) / (xi * Math.cos(t) + 1);
    total += (1 - R * R) * 2 * Math.cos(t) * Math.sin(t) * (Math.PI / 2 / n);
  }
  return total;
}

/** Eyring reverberation time. Sabine's, with the correct log. */
function eyring(volume: number, surface: number, alpha: number): number {
  return (0.161 * volume) / (-surface * Math.log(1 - alpha));
}

/**
 * Decay time from the Schroeder curve between two levels, extrapolated to 60 dB.
 *
 * A two-point lookup rather than an ISO 3382-1 least-squares fit, deliberately
 * local to this spec for independence from the code under test. #137 objects to
 * exactly that in the shipped energy-decay code, and when it produces a real
 * fit **this helper and the twin in `radiance/__tests__/physics.spec.ts` should
 * move onto it in one pass** — two oracles that define T30 differently would
 * drift, and drift between oracles is worse than a shared approximation. The
 * twin differs only in not squaring its input, since ART's response is energy
 * where this one is pressure.
 */
function decayTime(ir: Float32Array, dt: number, from: number, to: number): number {
  const edc = new Float64Array(ir.length);
  let acc = 0;
  for (let i = ir.length - 1; i >= 0; i--) {
    acc += ir[i] * ir[i];
    edc[i] = acc;
  }
  const peak = edc[0];
  const db = (i: number) => 10 * Math.log10(edc[i] / peak);

  let iFrom = -1;
  let iTo = -1;
  for (let i = 0; i < ir.length; i++) {
    if (iFrom < 0 && db(i) <= from) iFrom = i;
    if (db(i) <= to) {
      iTo = i;
      break;
    }
  }
  if (iFrom < 0 || iTo < 0 || iTo <= iFrom) return NaN;
  const slope = (db(iTo) - db(iFrom)) / ((iTo - iFrom) * dt);
  return -60 / slope;
}

describe('T60 against statistical room acoustics', () => {
  it('decays between the normal- and random-incidence predictions', () => {
    const dx = 0.12;
    const air = [28, 22, 18] as const;
    const alpha = 0.2;

    const [lx, ly, lz] = air.map((n) => n * dx);
    const volume = lx * ly * lz;
    const surface = 2 * (lx * ly + lx * lz + ly * lz);

    const grid = shoeboxGrid(air[0], air[1], air[2], dx);
    const decomposition = decompose(grid);

    // `dt` comes from the planner, not from the requested Courant number. It
    // happens not to be clamped here — `impedanceCourantLimit(0.2)` is 0.54,
    // above the 0.4 asked for — but computing it by hand is the exact trap
    // `planArdTimeStep` and `duration` exist to close: the pulse is sampled at
    // `dt` and the Schroeder times are read in `dt`, so a clamp that bit would
    // desync the IR clock from the simulation's and the decay times would be
    // wrong by the ratio without anything failing.
    const base = {
      grid,
      decomposition,
      c: C,
      courant: 0.4,
      duration: 0.8,
      fMax: 500,
      absorptionFor: () => alpha,
    };
    const plan = planArdTimeStep(base);
    const dt = plan.dt;

    const sim = createArdSimulation({
      ...base,
      // Off-centre source and receiver, so no symmetry leaves whole families of
      // modes unexcited or unheard.
      sources: [{ cell: [8, 7, 6], signal: bandlimitedPulse(80, dt, 500) }],
      receivers: [{ cell: [21, 16, 13] }],
    });
    // The clock the pulse was written at is the clock the simulation runs on.
    expect(sim.dt).toBe(dt);
    expect(sim.steps).toBe(plan.steps);
    expect(sim.impedancePlan.faces).toHaveLength(6);
    // 5.7 cells per wavelength at 500 Hz, inside the envelope the boundary
    // delivers its coefficient in — so this measures the boundary, not the grid.
    expect(sim.warnings.join(' ')).not.toMatch(/cells per wavelength/);

    const [ir] = sim.run();
    sim.dispose();

    const t30 = decayTime(ir, dt, -5, -35);
    const t20 = decayTime(ir, dt, -5, -25);
    expect(Number.isFinite(t30)).toBe(true);
    expect(Number.isFinite(t20)).toBe(true);

    const xi = impedanceForMaterialAbsorption(alpha, 3);
    const lower = eyring(volume, surface, diffuseAbsorption3D(xi));
    const upper = eyring(volume, surface, absorptionForImpedance(xi));
    // The wall built absorbs the material's α from a diffuse field.
    expect(lower).toBeCloseTo(eyring(volume, surface, alpha), 6);
    // Sanity on the bracket itself, so a broken formula cannot widen it to
    // something nothing could fail.
    expect(lower).toBeLessThan(upper);
    expect(upper / lower).toBeLessThan(3);

    for (const t of [t20, t30]) {
      expect(t).toBeGreaterThan(lower);
      expect(t).toBeLessThan(upper);
      // And near Eyring at the material's own α, which is what #221 is about:
      // measured 1.08 (T20) and 1.18 (T30) of it, where the old softer wall
      // decayed at 0.71 and 0.87 — faster than the material allows.
      expect(t).toBeLessThan(1.3 * lower);
    }
    // T20 and T30 measure the same slope over different spans; a decay that is
    // not roughly exponential would separate them.
    expect(t30 / t20).toBeGreaterThan(0.7);
    expect(t30 / t20).toBeLessThan(1.4);
  }, 300_000);
});
