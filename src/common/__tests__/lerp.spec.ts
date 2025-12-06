/**
 * Lerp Function Tests
 *
 * Tests for linear interpolation functions.
 */

import { Vector3 } from 'three';
import { lerp, lerp3 } from '../lerp';

describe('lerp', () => {
  describe('Basic Interpolation', () => {
    it('returns start value when amount is 0', () => {
      expect(lerp(0, 10, 0)).toBe(0);
    });

    it('returns end value when amount is 1', () => {
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it('returns midpoint when amount is 0.5', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
    });

    it('interpolates correctly at 0.25', () => {
      expect(lerp(0, 100, 0.25)).toBe(25);
    });

    it('interpolates correctly at 0.75', () => {
      expect(lerp(0, 100, 0.75)).toBe(75);
    });
  });

  describe('Different Ranges', () => {
    it('handles negative start', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });

    it('handles negative end', () => {
      expect(lerp(10, -10, 0.5)).toBe(0);
    });

    it('handles both negative', () => {
      expect(lerp(-20, -10, 0.5)).toBe(-15);
    });

    it('handles descending range', () => {
      expect(lerp(10, 0, 0.5)).toBe(5);
    });

    it('handles same start and end', () => {
      expect(lerp(5, 5, 0.5)).toBe(5);
    });
  });

  describe('Extrapolation', () => {
    it('extrapolates below 0', () => {
      expect(lerp(0, 10, -0.5)).toBe(-5);
    });

    it('extrapolates above 1', () => {
      expect(lerp(0, 10, 1.5)).toBe(15);
    });

    it('extrapolates at 2', () => {
      expect(lerp(0, 10, 2)).toBe(20);
    });
  });

  describe('Floating Point Precision', () => {
    it('handles small values', () => {
      expect(lerp(0.001, 0.002, 0.5)).toBeCloseTo(0.0015, 10);
    });

    it('handles large values', () => {
      expect(lerp(1e6, 2e6, 0.5)).toBe(1.5e6);
    });
  });
});

describe('lerp3', () => {
  describe('Basic Interpolation', () => {
    it('returns start vector when amount is 0', () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(10, 20, 30);
      const result = lerp3(a, b, 0);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });

    it('returns end vector when amount is 1', () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(10, 20, 30);
      const result = lerp3(a, b, 1);

      expect(result.x).toBe(10);
      expect(result.y).toBe(20);
      expect(result.z).toBe(30);
    });

    it('returns midpoint when amount is 0.5', () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(10, 20, 30);
      const result = lerp3(a, b, 0.5);

      expect(result.x).toBe(5);
      expect(result.y).toBe(10);
      expect(result.z).toBe(15);
    });
  });

  describe('Different Vector Configurations', () => {
    it('interpolates with negative components', () => {
      const a = new Vector3(-10, -10, -10);
      const b = new Vector3(10, 10, 10);
      const result = lerp3(a, b, 0.5);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });

    it('interpolates same vectors', () => {
      const a = new Vector3(5, 5, 5);
      const b = new Vector3(5, 5, 5);
      const result = lerp3(a, b, 0.5);

      expect(result.x).toBe(5);
      expect(result.y).toBe(5);
      expect(result.z).toBe(5);
    });

    it('interpolates unit vectors', () => {
      const a = new Vector3(1, 0, 0);
      const b = new Vector3(0, 1, 0);
      const result = lerp3(a, b, 0.5);

      expect(result.x).toBe(0.5);
      expect(result.y).toBe(0.5);
      expect(result.z).toBe(0);
    });
  });

  describe('Returns New Instance', () => {
    it('returns a new Vector3 instance', () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(10, 10, 10);
      const result = lerp3(a, b, 0.5);

      expect(result).not.toBe(a);
      expect(result).not.toBe(b);
      expect(result).toBeInstanceOf(Vector3);
    });

    it('does not modify input vectors', () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(10, 10, 10);
      lerp3(a, b, 0.5);

      expect(a.x).toBe(0);
      expect(a.y).toBe(0);
      expect(a.z).toBe(0);
      expect(b.x).toBe(10);
      expect(b.y).toBe(10);
      expect(b.z).toBe(10);
    });
  });
});
