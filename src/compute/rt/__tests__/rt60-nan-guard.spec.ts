/**
 * Tests for RT60 NaN/Infinity guard on high absorption values.
 *
 * Bug: Math.log(1 - avg_abs) produces -Infinity when avg_abs === 1 and
 * NaN when avg_abs > 1 (possible from bad material data). No guard
 * existed in Eyring or Arau-Puchades implementations.
 *
 * Fix: Clamp absorption coefficients to [0, 0.99] before passing to log.
 */

describe('RT60 NaN/Infinity guard', () => {
  describe('Math.log edge cases', () => {
    it('Math.log(0) produces -Infinity', () => {
      // When avg_abs = 1: Math.log(1 - 1) = Math.log(0) = -Infinity
      expect(Math.log(0)).toBe(-Infinity);
    });

    it('Math.log(negative) produces NaN', () => {
      // When avg_abs > 1: Math.log(1 - 1.2) = Math.log(-0.2) = NaN
      expect(Math.log(-0.2)).toBeNaN();
    });

    it('-Infinity in denominator makes RT60 = 0 or -0', () => {
      const volume = 100;
      const unitsConstant = 0.161;
      const surfaceArea = 200;

      const denominator = -surfaceArea * Math.log(0); // -200 * -Infinity = Infinity
      const rt = (unitsConstant * volume) / denominator;

      // This gives 0 (or -0), which is physically meaningless
      expect(rt).toBe(0);
    });

    it('NaN in denominator propagates NaN to RT60', () => {
      const volume = 100;
      const unitsConstant = 0.161;
      const surfaceArea = 200;

      const denominator = -surfaceArea * Math.log(-0.2); // NaN
      const rt = (unitsConstant * volume) / denominator;

      expect(rt).toBeNaN();
    });
  });

  describe('clamping behavior', () => {
    it('clamping to 0.99 prevents -Infinity from Math.log', () => {
      const avg_abs = 1.0;
      const clamped = Math.min(avg_abs, 0.99);
      const logValue = Math.log(1 - clamped);

      expect(Number.isFinite(logValue)).toBe(true);
      expect(logValue).toBeCloseTo(Math.log(0.01), 10);
    });

    it('clamping to 0.99 prevents NaN from Math.log when α > 1', () => {
      const avg_abs = 1.5; // impossible physically, but possible from bad data
      const clamped = Math.min(avg_abs, 0.99);
      const logValue = Math.log(1 - clamped);

      expect(Number.isFinite(logValue)).toBe(true);
      expect(logValue).toBeLessThan(0); // ln(0.01) ≈ -4.6
    });

    it('clamping does not affect valid absorption values', () => {
      const validValues = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 0.95];

      validValues.forEach(alpha => {
        const clamped = Math.min(alpha, 0.99);
        // For α <= 0.95, clamping should not change the value
        if (alpha <= 0.95) {
          expect(clamped).toBe(alpha);
        }
        // For all valid values, log should be finite
        expect(Number.isFinite(Math.log(1 - clamped))).toBe(true);
      });
    });
  });

  describe('Eyring formula with guard', () => {
    function eyringRT60_guarded(
      volume: number,
      surfaceArea: number,
      avgAbsorption: number,
      airAbsorption: number = 0,
      k: number = 0.161
    ): number {
      const clampedAlpha = Math.min(avgAbsorption, 0.99);
      const denominator = -surfaceArea * Math.log(1 - clampedAlpha) + 4 * airAbsorption * volume;
      return (k * volume) / denominator;
    }

    it('produces finite result for α = 1.0', () => {
      const rt = eyringRT60_guarded(100, 200, 1.0);
      expect(Number.isFinite(rt)).toBe(true);
      expect(rt).toBeGreaterThan(0);
    });

    it('produces finite result for α > 1.0 (bad data)', () => {
      const rt = eyringRT60_guarded(100, 200, 1.5);
      expect(Number.isFinite(rt)).toBe(true);
      expect(rt).toBeGreaterThan(0);
    });

    it('produces physically reasonable result for α = 0.99', () => {
      // Very high absorption should give very short RT60
      const rt = eyringRT60_guarded(100, 200, 0.99);
      expect(rt).toBeGreaterThan(0);
      expect(rt).toBeLessThan(0.1); // Nearly anechoic
    });

    it('produces same results as unguarded for typical absorption values', () => {
      const volume = 180;
      const surfaceArea = 216;
      const k = 0.161;

      [0.1, 0.3, 0.5, 0.7, 0.9].forEach(alpha => {
        const guarded = eyringRT60_guarded(volume, surfaceArea, alpha, 0, k);
        const unguarded = (k * volume) / (-surfaceArea * Math.log(1 - alpha));

        expect(guarded).toBeCloseTo(unguarded, 10);
      });
    });
  });

  describe('source code verification', () => {
    it('Eyring method clamps avg_abs before Math.log', () => {
      const fs = require('fs');
      const path = require('path');

      const sourceFile = fs.readFileSync(
        path.resolve(__dirname, '..', 'index.ts'),
        'utf8'
      );

      // Find the Eyring method and check for Math.min clamping
      const eyringSection = sourceFile.match(/eyring\(\)\s*\{[\s\S]*?return response/);
      expect(eyringSection).not.toBeNull();

      // Should contain Math.min(..., 0.99)
      expect(eyringSection![0]).toMatch(/Math\.min\([^)]*0\.99\)/);
    });

    it('Arau-Puchades method clamps alphas before Math.log', () => {
      const fs = require('fs');
      const path = require('path');

      const sourceFile = fs.readFileSync(
        path.resolve(__dirname, '..', 'index.ts'),
        'utf8'
      );

      // Find the arauPuchades method and check for Math.min clamping
      const apSection = sourceFile.match(/arauPuchades[\s\S]*?return frequencies\.map/);
      expect(apSection).not.toBeNull();

      expect(apSection![0]).toMatch(/Math\.min\([^)]*0\.99\)/);
    });
  });
});
