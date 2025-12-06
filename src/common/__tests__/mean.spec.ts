/**
 * Mean Function Tests
 *
 * Tests for the mean (average) utility function.
 */

import { mean } from '../mean';

describe('mean', () => {
  describe('Basic Calculations', () => {
    it('calculates mean of positive integers', () => {
      expect(mean([1, 2, 3, 4, 5])).toBe(3);
    });

    it('calculates mean of two numbers', () => {
      expect(mean([10, 20])).toBe(15);
    });

    it('calculates mean of single number', () => {
      expect(mean([42])).toBe(42);
    });

    it('calculates mean of identical numbers', () => {
      expect(mean([5, 5, 5, 5])).toBe(5);
    });
  });

  describe('Floating Point Numbers', () => {
    it('calculates mean of decimals', () => {
      expect(mean([1.5, 2.5, 3.5])).toBe(2.5);
    });

    it('handles mixed integers and decimals', () => {
      expect(mean([1, 2.5, 4])).toBe(2.5);
    });

    it('handles very small numbers', () => {
      expect(mean([0.001, 0.002, 0.003])).toBeCloseTo(0.002, 10);
    });
  });

  describe('Negative Numbers', () => {
    it('calculates mean of negative numbers', () => {
      expect(mean([-1, -2, -3])).toBe(-2);
    });

    it('calculates mean of mixed positive and negative', () => {
      expect(mean([-10, 10])).toBe(0);
    });

    it('handles negative result', () => {
      expect(mean([-5, -3, -1, 0])).toBe(-2.25);
    });
  });

  describe('Zero Values', () => {
    it('calculates mean including zeros', () => {
      expect(mean([0, 0, 3])).toBe(1);
    });

    it('calculates mean of all zeros', () => {
      expect(mean([0, 0, 0])).toBe(0);
    });
  });

  describe('Large Arrays', () => {
    it('handles large array of ones', () => {
      const arr = new Array(1000).fill(1);
      expect(mean(arr)).toBe(1);
    });

    it('handles large sequential array', () => {
      const arr = Array.from({ length: 100 }, (_, i) => i + 1);
      // Mean of 1..100 is 50.5
      expect(mean(arr)).toBe(50.5);
    });
  });

  describe('TypedArrays', () => {
    it('works with Float32Array', () => {
      const arr = new Float32Array([1, 2, 3, 4, 5]);
      expect(mean(arr)).toBe(3);
    });

    it('works with Float64Array', () => {
      const arr = new Float64Array([1.5, 2.5, 3.5]);
      expect(mean(arr)).toBe(2.5);
    });

    it('works with Int32Array', () => {
      const arr = new Int32Array([10, 20, 30]);
      expect(mean(arr)).toBe(20);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty array returning NaN', () => {
      expect(mean([])).toBeNaN();
    });

    it('handles very large numbers', () => {
      expect(mean([1e10, 2e10, 3e10])).toBe(2e10);
    });
  });
});
