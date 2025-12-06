/**
 * Interpolation Function Tests
 *
 * Tests for interpolation utilities used in acoustic calculations:
 * - interpolateLog: Logarithmic interpolation between two points
 * - interpolateAlpha: Creates absorption coefficient interpolation function
 */

import interpolateLog from '../interpolate-log';
import interpolateAlpha from '../interpolate-alpha';

describe('interpolateLog', () => {
  describe('Basic Logarithmic Interpolation', () => {
    it('returns y1 when xi equals x1', () => {
      const result = interpolateLog(100, 0.1, 1000, 0.5, 100);
      expect(result).toBeCloseTo(0.1, 10);
    });

    it('returns y2 when xi equals x2', () => {
      const result = interpolateLog(100, 0.1, 1000, 0.5, 1000);
      expect(result).toBeCloseTo(0.5, 10);
    });

    it('returns midpoint value at geometric mean', () => {
      // Geometric mean of 100 and 1000 is sqrt(100*1000) = 316.23
      // Linear interpolation of y at log midpoint = (0.1 + 0.5) / 2 = 0.3
      const xi = Math.sqrt(100 * 1000);
      const result = interpolateLog(100, 0.1, 1000, 0.5, xi);
      expect(result).toBeCloseTo(0.3, 5);
    });

    it('interpolates at quarter point', () => {
      // At x = 100 * 10^0.25 ≈ 177.83
      // y should be 0.1 + 0.25 * (0.5 - 0.1) = 0.2
      const xi = 100 * Math.pow(10, 0.25);
      const result = interpolateLog(100, 0.1, 1000, 0.5, xi);
      expect(result).toBeCloseTo(0.2, 5);
    });

    it('interpolates at three-quarter point', () => {
      // At x = 100 * 10^0.75 ≈ 562.34
      // y should be 0.1 + 0.75 * (0.5 - 0.1) = 0.4
      const xi = 100 * Math.pow(10, 0.75);
      const result = interpolateLog(100, 0.1, 1000, 0.5, xi);
      expect(result).toBeCloseTo(0.4, 5);
    });
  });

  describe('Octave Band Interpolation', () => {
    it('interpolates between octave bands (125Hz to 250Hz)', () => {
      // Typical absorption coefficients
      const x1 = 125;
      const y1 = 0.05;
      const x2 = 250;
      const y2 = 0.10;

      // At geometric mean = sqrt(125*250) = 176.78 Hz
      const xi = Math.sqrt(x1 * x2);
      const result = interpolateLog(x1, y1, x2, y2, xi);
      expect(result).toBeCloseTo(0.075, 5);
    });

    it('interpolates across multiple octaves (500Hz to 2000Hz)', () => {
      const x1 = 500;
      const y1 = 0.20;
      const x2 = 2000;
      const y2 = 0.80;

      // At 1000Hz (one octave above 500Hz)
      // log10(1000) - log10(500) / (log10(2000) - log10(500))
      // = (3 - 2.699) / (3.301 - 2.699) = 0.301 / 0.602 = 0.5
      const result = interpolateLog(x1, y1, x2, y2, 1000);
      expect(result).toBeCloseTo(0.5, 2);
    });
  });

  describe('Decreasing Values', () => {
    it('handles decreasing y values', () => {
      const result = interpolateLog(100, 0.8, 1000, 0.2, Math.sqrt(100 * 1000));
      expect(result).toBeCloseTo(0.5, 5);
    });
  });

  describe('Edge Cases', () => {
    it('handles small frequency values', () => {
      const result = interpolateLog(20, 0.01, 40, 0.02, 30);
      // Should be between 0.01 and 0.02
      expect(result).toBeGreaterThan(0.01);
      expect(result).toBeLessThan(0.02);
    });

    it('handles large frequency values', () => {
      const result = interpolateLog(8000, 0.90, 16000, 0.95, 12000);
      // Should be between 0.90 and 0.95
      expect(result).toBeGreaterThan(0.90);
      expect(result).toBeLessThan(0.95);
    });

    it('handles y values at boundaries (0 and 1)', () => {
      const result = interpolateLog(100, 0, 1000, 1, Math.sqrt(100 * 1000));
      expect(result).toBeCloseTo(0.5, 5);
    });
  });
});

describe('interpolateAlpha', () => {
  describe('Basic Interpolation Function', () => {
    it('returns a function', () => {
      const alpha = [0.1, 0.2, 0.3];
      const freq = [125, 500, 2000];
      const fn = interpolateAlpha(alpha, freq);
      expect(typeof fn).toBe('function');
    });

    it('returns exact value at known frequency point', () => {
      const alpha = [0.1, 0.2, 0.3, 0.4];
      const freq = [125, 250, 500, 1000];
      const fn = interpolateAlpha(alpha, freq);

      expect(fn(125)).toBeCloseTo(0.1, 5);
      expect(fn(250)).toBeCloseTo(0.2, 5);
      expect(fn(500)).toBeCloseTo(0.3, 5);
      expect(fn(1000)).toBeCloseTo(0.4, 5);
    });

    it('interpolates between frequency points', () => {
      const alpha = [0.1, 0.3];
      const freq = [100, 1000];
      const fn = interpolateAlpha(alpha, freq);

      // At geometric mean (316.23 Hz), should be 0.2
      const midFreq = Math.sqrt(100 * 1000);
      expect(fn(midFreq)).toBeCloseTo(0.2, 2);
    });
  });

  describe('Boundary Behavior', () => {
    it('returns first alpha for frequencies below range', () => {
      const alpha = [0.1, 0.2, 0.3];
      const freq = [125, 500, 2000];
      const fn = interpolateAlpha(alpha, freq);

      expect(fn(50)).toBe(0.1);
      expect(fn(100)).toBe(0.1);
      expect(fn(124)).toBe(0.1);
    });

    it('returns last alpha for frequencies above range', () => {
      const alpha = [0.1, 0.2, 0.3];
      const freq = [125, 500, 2000];
      const fn = interpolateAlpha(alpha, freq);

      expect(fn(2001)).toBe(0.3);
      expect(fn(4000)).toBe(0.3);
      expect(fn(10000)).toBe(0.3);
    });
  });

  describe('Standard Octave Bands', () => {
    it('interpolates through standard octave band data', () => {
      // Typical absorption coefficients for a material
      const alpha = [0.05, 0.10, 0.20, 0.40, 0.60, 0.70];
      const freq = [125, 250, 500, 1000, 2000, 4000];
      const fn = interpolateAlpha(alpha, freq);

      // Test interpolation at 1/3 octave band frequencies
      const f375 = fn(375); // Between 250 and 500
      expect(f375).toBeGreaterThan(0.10);
      expect(f375).toBeLessThan(0.20);

      const f750 = fn(750); // Between 500 and 1000
      expect(f750).toBeGreaterThan(0.20);
      expect(f750).toBeLessThan(0.40);

      const f1500 = fn(1500); // Between 1000 and 2000
      expect(f1500).toBeGreaterThan(0.40);
      expect(f1500).toBeLessThan(0.60);
    });
  });

  describe('Real Material Data', () => {
    it('handles acoustic tile absorption data', () => {
      // Typical acoustic ceiling tile absorption
      const alpha = [0.29, 0.44, 0.64, 0.73, 0.70, 0.66];
      const freq = [125, 250, 500, 1000, 2000, 4000];
      const fn = interpolateAlpha(alpha, freq);

      // Should smoothly interpolate
      expect(fn(500)).toBeCloseTo(0.64, 2);
      expect(fn(1000)).toBeCloseTo(0.73, 2);

      // At 700 Hz (between 500 and 1000)
      const f700 = fn(700);
      expect(f700).toBeGreaterThan(0.64);
      expect(f700).toBeLessThan(0.73);
    });

    it('handles carpet absorption data', () => {
      // Typical heavy carpet absorption
      const alpha = [0.02, 0.06, 0.14, 0.37, 0.60, 0.65];
      const freq = [125, 250, 500, 1000, 2000, 4000];
      const fn = interpolateAlpha(alpha, freq);

      expect(fn(125)).toBeCloseTo(0.02, 2);
      expect(fn(4000)).toBeCloseTo(0.65, 2);
    });

    it('handles glass absorption data (low values)', () => {
      // Glass - low absorption
      const alpha = [0.35, 0.25, 0.18, 0.12, 0.07, 0.04];
      const freq = [125, 250, 500, 1000, 2000, 4000];
      const fn = interpolateAlpha(alpha, freq);

      // Decreasing trend
      expect(fn(125)).toBeCloseTo(0.35, 2);
      expect(fn(500)).toBeCloseTo(0.18, 2);
      expect(fn(2000)).toBeCloseTo(0.07, 2);
    });
  });

  describe('Edge Cases', () => {
    it('handles single frequency point', () => {
      const alpha = [0.5];
      const freq = [1000];
      const fn = interpolateAlpha(alpha, freq);

      // Should return the only value for all frequencies
      expect(fn(100)).toBe(0.5);
      expect(fn(1000)).toBe(0.5);
      expect(fn(10000)).toBe(0.5);
    });

    it('handles two frequency points', () => {
      const alpha = [0.1, 0.9];
      const freq = [100, 10000];
      const fn = interpolateAlpha(alpha, freq);

      expect(fn(100)).toBeCloseTo(0.1, 5);
      expect(fn(10000)).toBeCloseTo(0.9, 5);

      // Midpoint at geometric mean (1000 Hz)
      expect(fn(1000)).toBeCloseTo(0.5, 2);
    });

    it('handles constant absorption (same value at all frequencies)', () => {
      const alpha = [0.5, 0.5, 0.5, 0.5];
      const freq = [125, 500, 1000, 4000];
      const fn = interpolateAlpha(alpha, freq);

      expect(fn(200)).toBeCloseTo(0.5, 5);
      expect(fn(750)).toBeCloseTo(0.5, 5);
      expect(fn(2000)).toBeCloseTo(0.5, 5);
    });
  });
});
