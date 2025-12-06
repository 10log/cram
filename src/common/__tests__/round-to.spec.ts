/**
 * RoundTo Function Tests
 *
 * Tests for the roundTo utility function that rounds
 * numbers to a specified number of decimal places.
 */

import roundTo from '../round-to';

describe('roundTo', () => {
  describe('Positive Decimal Places', () => {
    it('rounds to 2 decimal places', () => {
      expect(roundTo(3.1415926, 2)).toBe(3.14);
    });

    it('rounds to 1 decimal place', () => {
      expect(roundTo(3.1415926, 1)).toBe(3.1);
    });

    it('rounds to 3 decimal places', () => {
      expect(roundTo(3.1415926, 3)).toBe(3.142);
    });

    it('rounds up when next digit is 5 or more', () => {
      expect(roundTo(3.145, 2)).toBe(3.15);
    });

    it('rounds down when next digit is less than 5', () => {
      expect(roundTo(3.144, 2)).toBe(3.14);
    });
  });

  describe('Zero Decimal Places', () => {
    it('rounds to integer with 0 places (default)', () => {
      expect(roundTo(3.5)).toBe(4);
    });

    it('rounds down to integer', () => {
      expect(roundTo(3.4)).toBe(3);
    });

    it('rounds up to integer', () => {
      expect(roundTo(3.6)).toBe(4);
    });

    it('explicit 0 places works the same', () => {
      expect(roundTo(3.5, 0)).toBe(4);
    });
  });

  describe('Negative Decimal Places', () => {
    it('rounds to tens with -1 places', () => {
      expect(roundTo(1492, -1)).toBe(1490);
    });

    it('rounds to hundreds with -2 places', () => {
      expect(roundTo(1492, -2)).toBe(1500);
    });

    it('rounds to thousands with -3 places', () => {
      expect(roundTo(1492, -3)).toBe(1000);
    });

    it('rounds up to next hundred', () => {
      expect(roundTo(1550, -2)).toBe(1600);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero', () => {
      expect(roundTo(0, 2)).toBe(0);
    });

    it('handles negative numbers', () => {
      expect(roundTo(-3.1415926, 2)).toBe(-3.14);
    });

    it('handles already rounded numbers', () => {
      expect(roundTo(3.14, 2)).toBe(3.14);
    });

    it('handles very small numbers', () => {
      expect(roundTo(0.000123456, 5)).toBe(0.00012);
    });

    it('handles very large numbers', () => {
      expect(roundTo(123456789.123, 2)).toBe(123456789.12);
    });

    it('handles numbers with fewer decimal places', () => {
      expect(roundTo(3.1, 5)).toBe(3.1);
    });
  });

  describe('Precision Edge Cases', () => {
    it('handles 0.5 rounding (banker rounding is not used)', () => {
      // JavaScript Math.round rounds 0.5 up
      expect(roundTo(2.5, 0)).toBe(3);
      expect(roundTo(3.5, 0)).toBe(4);
    });

    it('handles very large decimal places', () => {
      expect(roundTo(Math.PI, 10)).toBeCloseTo(3.1415926536, 10);
    });
  });

  describe('Integer Inputs', () => {
    it('returns integer unchanged with positive places', () => {
      expect(roundTo(42, 2)).toBe(42);
    });

    it('rounds integer with negative places', () => {
      expect(roundTo(42, -1)).toBe(40);
    });
  });
});
