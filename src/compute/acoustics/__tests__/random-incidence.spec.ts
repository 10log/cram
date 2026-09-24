/**
 * Issue #221: the wave solvers read the material database as random-incidence
 * (Sabine) absorption, which is what it is, and invert it to an impedance.
 */

import { describe, expect, it } from 'vitest';
import {
  diffuseAbsorption2D,
  impedanceForRandomIncidenceAbsorption,
  maxRandomIncidenceAbsorption,
  parisAbsorption,
} from '../random-incidence';
import { impedanceForAbsorption } from '../reflection-coefficient';

/** Direct midpoint integration of the 2D diffuse average — independent of the Gauss rule. */
function diffuse2DReference(xi: number): number {
  const n = 200000;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n) * (Math.PI / 2);
    const R = (xi * Math.cos(t) - 1) / (xi * Math.cos(t) + 1);
    total += (1 - R * R) * Math.cos(t) * (Math.PI / 2 / n);
  }
  return total;
}

/** Direct integration of the 3D hemisphere average, cosθ·sinθ weighted — Paris without the closed form. */
function diffuse3DReference(xi: number): number {
  const n = 200000;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n) * (Math.PI / 2);
    const R = (xi * Math.cos(t) - 1) / (xi * Math.cos(t) + 1);
    total += (1 - R * R) * 2 * Math.cos(t) * Math.sin(t) * (Math.PI / 2 / n);
  }
  return total;
}

describe('Issue #221: random-incidence absorption', () => {
  describe('forward', () => {
    it('matches direct integration in both dimensions', () => {
      for (const xi of [0.3, 0.8, 0.995, 1, 1.005, 1.01, 1.5, 3, 10, 40, 300, 3000]) {
        expect([xi, parisAbsorption(xi)]).toEqual([xi, expect.closeTo(diffuse3DReference(xi), 8)]);
        expect([xi, diffuseAbsorption2D(xi)]).toEqual([xi, expect.closeTo(diffuse2DReference(xi), 8)]);
      }
    });

    it('puts normal-incidence 0.2 at diffuse 0.323 in 3D — not the 0.396 #221 quoted', () => {
      // 0.396 came from an oracle with the log term's coefficient wrong; that
      // form exceeds 1 near ξ = 1, which the integration check above rules out.
      expect(parisAbsorption(impedanceForAbsorption(0.2))).toBeCloseTo(0.323, 3);
      const wrong = (xi: number) => (8 / xi) * (1 - Math.log(1 + xi) / xi + 1 / (1 + xi));
      expect(wrong(1.01)).toBeGreaterThan(1);
    });

    it('is zero for a rigid wall', () => {
      expect(parisAbsorption(Infinity)).toBe(0);
      expect(diffuseAbsorption2D(Infinity)).toBe(0);
    });
  });

  describe('the maximum', () => {
    it('is Paris’s 0.951 in 3D', () => {
      expect(maxRandomIncidenceAbsorption(3)).toBeCloseTo(0.9512, 4);
    });

    it('has a 2D counterpart, also below 1', () => {
      const max2 = maxRandomIncidenceAbsorption(2);
      expect(max2).toBeGreaterThan(0.9);
      expect(max2).toBeLessThan(1);
      // No impedance beats it.
      for (const xi of [0.5, 1, 1.2, 1.5, 2, 4]) expect(diffuseAbsorption2D(xi)).toBeLessThanOrEqual(max2 + 1e-12);
    });
  });

  describe('inverse', () => {
    it('round-trips on the stiff branch', () => {
      for (const dims of [2, 3] as const) {
        for (const alpha of [1e-4, 0.01, 0.1, 0.2, 0.5, 0.8, 0.9]) {
          if (alpha >= maxRandomIncidenceAbsorption(dims)) continue;
          const xi = impedanceForRandomIncidenceAbsorption(alpha, dims);
          const back = dims === 3 ? parisAbsorption(xi) : diffuseAbsorption2D(xi);
          expect([dims, alpha, back]).toEqual([dims, alpha, expect.closeTo(alpha, 9)]);
        }
      }
    });

    it('takes the branch that becomes rigid as α → 0, and is monotone on it', () => {
      for (const dims of [2, 3] as const) {
        let previous = Infinity;
        for (const alpha of [0.001, 0.05, 0.2, 0.5, 0.8, 0.94]) {
          const xi = impedanceForRandomIncidenceAbsorption(alpha, dims);
          expect(xi).toBeLessThan(previous);
          expect(xi).toBeGreaterThan(1);
          previous = xi;
        }
      }
    });

    it('is a stiffer wall than the normal-incidence reading of the same α', () => {
      // The point of #221: the same database value is less absorbing per
      // normal-incidence wave once read as a diffuse-field average.
      for (const alpha of [0.1, 0.3, 0.6]) {
        expect(impedanceForRandomIncidenceAbsorption(alpha, 3)).toBeGreaterThan(impedanceForAbsorption(alpha));
        expect(impedanceForRandomIncidenceAbsorption(alpha, 2)).toBeGreaterThan(impedanceForAbsorption(alpha));
      }
    });

    it('simulates chamber values above the maximum at the maximum, rather than refusing them', () => {
      for (const dims of [2, 3] as const) {
        const peakXi = impedanceForRandomIncidenceAbsorption(maxRandomIncidenceAbsorption(dims), dims);
        for (const alpha of [0.97, 1, 1.15]) {
          expect(impedanceForRandomIncidenceAbsorption(alpha, dims)).toBe(peakXi);
        }
      }
    });

    it('reads zero, negative and non-finite as rigid', () => {
      for (const bad of [0, -0.3, NaN, Infinity, -Infinity]) {
        expect([bad, impedanceForRandomIncidenceAbsorption(bad, 3)]).toEqual([bad, Infinity]);
      }
    });
  });
});
