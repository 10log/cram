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
 * Sabine and Eyring take a *random-incidence* absorption coefficient. The
 * material database stores a *normal-incidence* one, and that is what an
 * impedance boundary is given. For a real impedance the two differ, and by a
 * lot: Paris's formula integrates the locally-reacting reflection coefficient
 * over a diffuse hemisphere and gives
 *
 * ```
 * α_stat = (8/ξ)·[1 − (1/ξ)ln(1+ξ) + 1/(1+ξ)]
 * ```
 *
 * which for α_normal = 0.2 (ξ = 17.94) is **0.396** — nearly double. A
 * locally-reacting surface really does absorb more from a diffuse field than
 * from a normal-incidence wave, so the true T60 must sit **below** Eyring at
 * α_normal.
 *
 * It must also sit **above** Eyring at α_stat, because the field in a room this
 * size at these frequencies is not diffuse. The Schroeder frequency here is
 * around 250 Hz and the run carries content from 0 to 500 Hz, so a good part of
 * the band is in the modal region where statistical theory does not hold and the
 * decay is slower than a diffuse-field estimate.
 *
 * Between those two is the whole of what statistical acoustics can assert about
 * this run. It is a factor of 2.3 wide, and both bounds are one-sided errors
 * that a broken boundary fails: a surface that does not absorb enough runs past
 * the upper bound, one that absorbs too much falls under the lower.
 */

import { describe, expect, it } from 'vitest';

import { decompose } from '../decompose';
import { impedanceForAbsorption } from '../impedance';
import { bandlimitedPulse, createArdSimulation } from '../simulation';
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
 * Paris's random-incidence absorption coefficient for a real impedance.
 *
 * The diffuse-field average of `1 − |R(θ)|²` over a hemisphere, with
 * `R(θ) = (ξcosθ − 1)/(ξcosθ + 1)`.
 */
function randomIncidenceAbsorption(xi: number): number {
  return (8 / xi) * (1 - (1 / xi) * Math.log(1 + xi) + 1 / (1 + xi));
}

/** Eyring reverberation time. Sabine's, with the correct log. */
function eyring(volume: number, surface: number, alpha: number): number {
  return (0.161 * volume) / (-surface * Math.log(1 - alpha));
}

/** Decay time from the Schroeder curve between two levels, extrapolated to 60 dB. */
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
    const dt = (0.4 * dx) / C;
    const steps = Math.ceil(0.8 / dt);

    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant: 0.4,
      // Off-centre source and receiver, so no symmetry leaves whole families of
      // modes unexcited or unheard.
      sources: [{ cell: [8, 7, 6], signal: bandlimitedPulse(80, dt, 500) }],
      receivers: [{ cell: [21, 16, 13] }],
      steps,
      fMax: 500,
      absorptionFor: () => alpha,
    });
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

    const upper = eyring(volume, surface, alpha);
    const lower = eyring(volume, surface, randomIncidenceAbsorption(impedanceForAbsorption(alpha)));
    // Sanity on the bracket itself, so a broken formula cannot widen it to
    // something nothing could fail.
    expect(lower).toBeLessThan(upper);
    expect(upper / lower).toBeLessThan(3);

    for (const t of [t20, t30]) {
      expect(t).toBeGreaterThan(lower);
      expect(t).toBeLessThan(upper);
    }
    // T20 and T30 measure the same slope over different spans; a decay that is
    // not roughly exponential would separate them.
    expect(t30 / t20).toBeGreaterThan(0.7);
    expect(t30 / t20).toBeLessThan(1.4);
  }, 300_000);
});
