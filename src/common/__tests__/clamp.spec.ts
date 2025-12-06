/**
 * Clamp Function Tests
 *
 * Tests for the clamp utility function that constrains
 * a value between minimum and maximum bounds.
 */

import { clamp } from '../clamp';

describe('clamp', () => {
  describe('Basic Functionality', () => {
    it('returns value when within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('returns min when value is below bounds', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('returns max when value is above bounds', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('returns value when at min boundary', () => {
      expect(clamp(0, 0, 10)).toBe(0);
    });

    it('returns value when at max boundary', () => {
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('Negative Bounds', () => {
    it('handles negative min and max', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
    });

    it('clamps to negative min', () => {
      expect(clamp(-15, -10, -1)).toBe(-10);
    });

    it('clamps to negative max', () => {
      expect(clamp(0, -10, -1)).toBe(-1);
    });
  });

  describe('Zero Bounds', () => {
    it('handles zero as min', () => {
      expect(clamp(-1, 0, 10)).toBe(0);
    });

    it('handles zero as max', () => {
      expect(clamp(1, -10, 0)).toBe(0);
    });

    it('handles zero as both bounds', () => {
      expect(clamp(5, 0, 0)).toBe(0);
    });
  });

  describe('Floating Point Values', () => {
    it('clamps floating point values', () => {
      expect(clamp(5.5, 0, 10)).toBe(5.5);
    });

    it('clamps to floating point min', () => {
      expect(clamp(0.5, 1.5, 10)).toBe(1.5);
    });

    it('clamps to floating point max', () => {
      expect(clamp(9.9, 0, 5.5)).toBe(5.5);
    });

    it('handles very small numbers', () => {
      expect(clamp(0.0001, 0.001, 0.01)).toBe(0.001);
    });
  });

  describe('Edge Cases', () => {
    it('handles when min equals max', () => {
      expect(clamp(5, 3, 3)).toBe(3);
    });

    it('handles Infinity', () => {
      expect(clamp(Infinity, 0, 10)).toBe(10);
    });

    it('handles negative Infinity', () => {
      expect(clamp(-Infinity, 0, 10)).toBe(0);
    });

    it('handles very large numbers', () => {
      expect(clamp(1e100, 0, 1e50)).toBe(1e50);
    });

    it('handles very small negative numbers', () => {
      expect(clamp(-1e100, -1e50, 0)).toBe(-1e50);
    });
  });
});
