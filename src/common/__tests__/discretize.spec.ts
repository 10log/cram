import { discretize } from '../discretize';

describe('discretize', () => {
  it('returns a function', () => {
    const fn = discretize(10, 0, 100);
    expect(typeof fn).toBe('function');
  });

  describe('returned function', () => {
    it('discretizes values into buckets', () => {
      const fn = discretize(10, 0, 10);

      expect(fn(0)).toBe(0);
      expect(fn(5)).toBe(5);
      expect(fn(10)).toBe(10);
    });

    it('handles different ranges', () => {
      const fn = discretize(5, 0, 100);

      // Range is 100, n is 5, so step size is 20
      // fn(v) = round((100-0)/5 * v) = round(20 * v)
      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(20);
      expect(fn(2)).toBe(40);
    });

    it('handles non-zero start', () => {
      const fn = discretize(10, 10, 20);

      // Range is 10, n is 10, step size is 1
      expect(fn(0)).toBe(0);
      expect(fn(5)).toBe(5);
    });

    it('rounds to nearest integer', () => {
      const fn = discretize(3, 0, 10);

      // Step size is 10/3 = 3.33...
      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(3); // 3.33 rounds to 3
      expect(fn(2)).toBe(7); // 6.67 rounds to 7
    });

    it('handles negative values', () => {
      const fn = discretize(10, -50, 50);

      // Range is 100, step size is 10
      expect(fn(-5)).toBe(-50);
      expect(fn(0)).toBe(0);
      expect(fn(5)).toBe(50);
    });

    it('handles PI range (common for angles)', () => {
      const fn = discretize(10, 0, Math.PI);

      // Step size is PI/10
      expect(fn(0)).toBe(0);
      expect(fn(Math.PI / 2)).toBe(Math.round(Math.PI * 0.5 * Math.PI / 10));
    });

    it('handles single bucket', () => {
      const fn = discretize(1, 0, 10);

      // Everything maps to step size 10
      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(10);
    });
  });
});
