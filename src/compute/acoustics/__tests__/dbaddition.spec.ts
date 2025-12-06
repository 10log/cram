import { db_add } from '../dbaddition';
import { DB_ADDITION_REFERENCE } from '../../../__fixtures__/acoustic-references';

describe('db_add', () => {
  describe('basic functionality', () => {
    it('returns a number', () => {
      const result = db_add([60, 60]);
      expect(typeof result).toBe('number');
    });

    it('handles single value input', () => {
      const result = db_add([70]);
      expect(result).toBeCloseTo(70, 2);
    });

    it('handles two equal values (should add ~3dB)', () => {
      const result = db_add([60, 60]);
      // Two equal sound levels: L_total = L + 10*log10(2) ≈ L + 3.01
      expect(result).toBeCloseTo(63.01, 1);
    });
  });

  describe('reference value validation', () => {
    it.each(DB_ADDITION_REFERENCE)(
      'correctly adds $inputs to get $expected dB',
      ({ inputs, expected }) => {
        const result = db_add(inputs);
        expect(result).toBeCloseTo(expected, 1);
      }
    );
  });

  describe('mathematical properties', () => {
    it('adding equal levels follows N*3dB rule', () => {
      // 2 equal sources: +3dB
      expect(db_add([70, 70])).toBeCloseTo(73.01, 1);

      // 4 equal sources: +6dB
      expect(db_add([70, 70, 70, 70])).toBeCloseTo(76.02, 1);

      // 8 equal sources: +9dB
      expect(db_add(Array(8).fill(70))).toBeCloseTo(79.03, 1);

      // 10 equal sources: +10dB
      expect(db_add(Array(10).fill(70))).toBeCloseTo(80, 1);
    });

    it('result is dominated by the loudest source when difference > 10dB', () => {
      // When one source is much louder, it dominates
      const result = db_add([80, 60]);
      // 80 + 10*log10(1 + 10^(-2)) ≈ 80.04
      expect(result).toBeCloseTo(80.04, 1);
    });

    it('is commutative (order does not matter)', () => {
      const result1 = db_add([60, 70, 80]);
      const result2 = db_add([80, 60, 70]);
      const result3 = db_add([70, 80, 60]);

      expect(result1).toBeCloseTo(result2, 6);
      expect(result2).toBeCloseTo(result3, 6);
    });

    it('is associative', () => {
      const direct = db_add([60, 70, 80]);
      const step1 = db_add([60, 70]);
      const step2 = db_add([step1, 80]);

      expect(direct).toBeCloseTo(step2, 6);
    });

    it('result is always >= maximum input', () => {
      const inputs = [50, 60, 55, 58, 62];
      const result = db_add(inputs);
      const maxInput = Math.max(...inputs);

      expect(result).toBeGreaterThanOrEqual(maxInput);
    });
  });

  describe('edge cases', () => {
    it('handles very different levels', () => {
      const result = db_add([100, 50]);
      // 50dB difference means the 50dB source adds essentially nothing
      expect(result).toBeCloseTo(100, 0);
    });

    it('handles negative dB values', () => {
      const result = db_add([-10, -10]);
      expect(result).toBeCloseTo(-6.99, 1);
    });

    it('handles mix of positive and negative values', () => {
      const result = db_add([10, -10]);
      // 10 + 10*log10(1 + 10^(-2)) ≈ 10.04
      expect(result).toBeCloseTo(10.04, 1);
    });

    it('handles zero dB values', () => {
      const result = db_add([0, 0]);
      expect(result).toBeCloseTo(3.01, 1);
    });

    it('handles very large values', () => {
      const result = db_add([140, 140]);
      expect(result).toBeCloseTo(143.01, 1);
      expect(isFinite(result)).toBe(true);
    });

    it('handles very small values', () => {
      const result = db_add([-60, -60]);
      expect(result).toBeCloseTo(-56.99, 1);
      expect(isFinite(result)).toBe(true);
    });
  });

  describe('array handling', () => {
    it('throws on empty array', () => {
      // The underlying sum function uses reduce without initial value,
      // which throws on empty arrays
      expect(() => db_add([])).toThrow();
    });

    it('handles large arrays', () => {
      const inputs = Array(100).fill(60);
      const result = db_add(inputs);
      // 100 equal sources: 60 + 10*log10(100) = 60 + 20 = 80
      expect(result).toBeCloseTo(80, 1);
    });

    it('handles arrays with varying values', () => {
      const inputs = [60, 65, 70, 75, 80];
      const result = db_add(inputs);
      // Should be greater than 80 but less than 80 + 7 (if all were 80)
      expect(result).toBeGreaterThan(80);
      expect(result).toBeLessThan(87);
    });
  });

  describe('precision', () => {
    it('maintains precision for typical acoustic values', () => {
      // Test at various SPL ranges typical in acoustics
      const testCases = [
        { inputs: [30, 30], expected: 33.01 },
        { inputs: [50, 50], expected: 53.01 },
        { inputs: [70, 70], expected: 73.01 },
        { inputs: [90, 90], expected: 93.01 },
        { inputs: [110, 110], expected: 113.01 },
      ];

      testCases.forEach(({ inputs, expected }) => {
        const result = db_add(inputs);
        expect(result).toBeCloseTo(expected, 1);
      });
    });

    it('handles values at hearing threshold', () => {
      const result = db_add([0, 3]);
      // 0 dB + 3 dB in energy terms
      expect(result).toBeCloseTo(4.77, 1);
    });
  });

  describe('performance', () => {
    it('handles many additions efficiently', () => {
      const inputs = Array.from({ length: 10000 }, () => Math.random() * 100);

      const start = performance.now();
      const result = db_add(inputs);
      const duration = performance.now() - start;

      expect(isFinite(result)).toBe(true);
      expect(duration).toBeLessThan(50); // Should complete in under 50ms
    });
  });
});
