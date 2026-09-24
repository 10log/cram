/**
 * Issue #222: frequency-dependent admittance as parallel series-RLC branches,
 * fitted to octave-band random-incidence absorption.
 */

import { describe, expect, it } from 'vitest';
import {
  bandAbsorption,
  branchAdmittance,
  complexRandomIncidenceAbsorption,
  fitRlcToOctaveBands,
  resonantBranch,
  shelfBranch,
} from '../rlc-admittance';
import { diffuseAbsorption2D, maxRandomIncidenceAbsorption, parisAbsorption } from '../random-incidence';

const OCTAVES = [63, 125, 250, 500, 1000, 2000, 4000, 8000];

/** London's closed form for the 3D diffuse absorption of a complex impedance `r·e^{iφ}`. */
function london(zr: number, zi: number): number {
  const r = Math.hypot(zr, zi);
  const p = Math.atan2(zi, zr);
  const c = Math.cos(p);
  const s = Math.sin(p);
  return (
    ((8 * c) / r) *
    (1 -
      (c / r) * Math.log(1 + 2 * r * c + r * r) +
      (Math.cos(2 * p) / (r * s)) * Math.atan((r * s) / (1 + r * c)))
  );
}

function expectPassive(branches: { D: number; E: number; F: number }[]) {
  for (const { D, E, F } of branches) {
    for (const x of [D, E, F]) {
      expect(Number.isFinite(x)).toBe(true);
      expect(x).toBeGreaterThanOrEqual(0);
    }
  }
}

describe('Issue #222: RLC admittance', () => {
  describe('diffuse-field absorption of a complex impedance', () => {
    it('matches the real closed forms, in 2D and 3D', () => {
      for (const xi of [0.2, 1, 1.567, 3, 10, 100, 1e4]) {
        expect(complexRandomIncidenceAbsorption([xi, 0], 3)).toBeCloseTo(parisAbsorption(xi), 13);
        expect(complexRandomIncidenceAbsorption([xi, 0], 2)).toBeCloseTo(diffuseAbsorption2D(xi), 13);
      }
    });

    it("matches London's closed form off the real axis", () => {
      for (const [zr, zi] of [[2, 1], [5, -3], [1, 4], [20, 10], [0.5, -0.5]]) {
        expect(complexRandomIncidenceAbsorption([zr, zi], 3)).toBeCloseTo(london(zr, zi), 13);
      }
    });

    it('is zero for a surface with no resistance', () => {
      expect(complexRandomIncidenceAbsorption([0, 3], 3)).toBe(0);
    });
  });

  describe('branches', () => {
    it('resonate at their centre with their peak admittance, real there', () => {
      const branch = resonantBranch(0.2, 500);
      const [re, im] = branchAdmittance([branch], 500);
      expect(re).toBeCloseTo(0.2, 12);
      expect(im).toBeCloseTo(0, 12);
      // Half power where the reactance equals the resistance, ωD − F/ω = ±E,
      // and those two frequencies are the bandwidth ω₀/√2 apart.
      const { D, E, F } = branch;
      const edges = [-E, E].map((x) => (x + Math.sqrt(E * E + 4 * D * F)) / (2 * D));
      expect(edges[1] - edges[0]).toBeCloseTo((2 * Math.PI * 500) / Math.SQRT2, 9);
      for (const w of edges) {
        const [a, b] = branchAdmittance([branch], w / (2 * Math.PI));
        expect((a * a + b * b) / 0.04).toBeCloseTo(0.5, 12);
      }
    });

    it('shelve flat on their open side and roll off on the other', () => {
      const low = shelfBranch(0.1, 100, 'low');
      const high = shelfBranch(0.1, 1000, 'high');
      expect(low.F).toBe(0);
      expect(high.D).toBe(0);
      expect(branchAdmittance([low], 1)[0]).toBeCloseTo(0.1, 4);
      expect(branchAdmittance([high], 1e6)[0]).toBeCloseTo(0.1, 4);
      expect(branchAdmittance([low], 1e4)[0]).toBeLessThan(1e-3);
      expect(branchAdmittance([high], 10)[0]).toBeLessThan(1e-3);
    });
  });

  describe('fitting octave bands', () => {
    it('hits a smooth spectrum to within 0.005, with passive branches', () => {
      const bands = [125, 250, 500, 1000];
      for (const dims of [2, 3] as const) {
        const fit = fitRlcToOctaveBands(bands, [0.2, 0.3, 0.4, 0.5], { dims });
        expect(fit.maxError).toBeLessThan(0.005);
        expectPassive(fit.branches);
        bands.forEach((f, i) => expect(bandAbsorption(fit.branches, f, dims)).toBeCloseTo(fit.fitted[i], 12));
      }
    });

    it('fits a database material across all eight octaves', () => {
      // "Mineral Fiber ACT, 5/8in" from material.json: a dip at 250 Hz and a
      // peak at 1 kHz. Measured max error 0.0004 (2D), 0.0008 (3D).
      const alpha = [0.16, 0.34, 0.36, 0.71, 0.82, 0.68, 0.64, 0.64];
      const fit = fitRlcToOctaveBands(OCTAVES, alpha, { dims: 2 });
      expect(fit.branches).toHaveLength(8);
      expect(fit.maxError).toBeLessThan(0.002);
      expectPassive(fit.branches);
    });

    it('gives a rigid band no branch, and a rigid material none at all', () => {
      expect(fitRlcToOctaveBands([125, 250], [0, 0], { dims: 3 }).branches).toEqual([]);
      const fit = fitRlcToOctaveBands([125, 250, 500], [0.3, 0, 0.3], { dims: 3 });
      expect(fit.branches).toHaveLength(2);
    });

    it('fits past-the-limit chamber data to the locally-reacting limit', () => {
      const fit = fitRlcToOctaveBands([500], [1.2], { dims: 3 });
      expect(fit.target[0]).toBeCloseTo(maxRandomIncidenceAbsorption(3), 12);
      // A single band is a plain resistance, which reaches the limit exactly.
      expect(fit.branches[0].D).toBe(0);
      expect(fit.branches[0].F).toBe(0);
      expect(fit.maxError).toBeLessThan(1e-3);
    });

    it('fits the dimension it is asked for', () => {
      const two = fitRlcToOctaveBands([250, 500], [0.3, 0.5], { dims: 2 });
      const three = fitRlcToOctaveBands([250, 500], [0.3, 0.5], { dims: 3 });
      expect(two.branches[0].E).not.toBeCloseTo(three.branches[0].E, 3);
      expect(bandAbsorption(three.branches, 500, 3)).toBeCloseTo(0.5, 2);
    });

    it('rejects mismatched inputs', () => {
      expect(() => fitRlcToOctaveBands([125, 250], [0.1], { dims: 3 })).toThrow(/2 bands but 1/);
    });
  });
});
