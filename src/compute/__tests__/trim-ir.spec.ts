/**
 * Tests for trimIR function (impulse response tail trimming).
 *
 * Bug: `sindex` was initialized to `ir.length` (one past the last valid index).
 * `ir[ir.length]` returns `undefined`, and `Math.abs(undefined)` is `NaN`.
 * `NaN < tolerance` is `false`, so the while loop exited immediately,
 * making the tail-trimming logic non-functional.
 *
 * Fix: Initialize `sindex = ir.length - 1` so the loop starts at the last
 * valid array index.
 */

/**
 * Extracted trimIR (buggy version for comparison)
 */
function trimIR_buggy(ir: Float32Array): Float32Array {
  let tolerance = 1e-6;
  let startSample = 0;
  let endSample = ir.length;

  let sindex = 0;
  while (Math.abs(ir[sindex]) < tolerance) {
    startSample = sindex;
    sindex++;
  }

  sindex = ir.length; // BUG: one past end
  while (Math.abs(ir[sindex]) < tolerance) {
    endSample = sindex;
    sindex--;
  }

  return ir.slice(startSample, endSample);
}

/**
 * Extracted trimIR (fixed version)
 */
function trimIR_fixed(ir: Float32Array): Float32Array {
  let tolerance = 1e-6;
  let startSample = 0;
  let endSample = ir.length;

  let sindex = 0;
  while (Math.abs(ir[sindex]) < tolerance) {
    startSample = sindex;
    sindex++;
  }

  sindex = ir.length - 1; // FIX: last valid index
  while (Math.abs(ir[sindex]) < tolerance) {
    endSample = sindex;
    sindex--;
  }

  return ir.slice(startSample, endSample);
}

describe('trimIR', () => {
  describe('out-of-bounds bug', () => {
    it('buggy version does NOT trim trailing silence', () => {
      // IR with NO leading silence, just signal followed by trailing silence
      const ir = new Float32Array([1.0, 0.5, 0.1, 0, 0, 0, 0]);

      const result = trimIR_buggy(ir);

      // Buggy version: start trimming does nothing (first sample is non-zero)
      // End trimming: ir[7] = undefined → NaN < tolerance = false → loop skips
      // Result = slice(0, 7) = entire array untrimmed
      expect(result.length).toBe(ir.length);
    });

    it('fixed version trims trailing silence', () => {
      const ir = new Float32Array([0, 0, 0, 1.0, 0.5, 0.1, 0, 0, 0, 0]);

      const result = trimIR_fixed(ir);

      // Should trim leading and trailing zeros
      expect(result.length).toBeLessThan(ir.length);
      // The trimmed result should contain the signal portion
      expect(Math.max(...Array.from(result))).toBeCloseTo(1.0, 5);
    });

    it('ir[ir.length] is undefined, Math.abs(undefined) is NaN', () => {
      const arr = new Float32Array([1, 2, 3]);
      expect(arr[arr.length]).toBeUndefined();
      expect(Math.abs(arr[arr.length])).toBeNaN();
    });

    it('NaN < tolerance is always false (loop never enters)', () => {
      expect(NaN < 1e-6).toBe(false);
      expect(NaN < Infinity).toBe(false);
    });
  });

  describe('fixed trimIR correctness', () => {
    it('trims leading silence (keeps one zero before onset)', () => {
      const ir = new Float32Array([0, 0, 0, 0, 0.5, 0.3, 0.1]);
      const result = trimIR_fixed(ir);

      // Leading zeros are partially removed (startSample = last zero before signal)
      expect(result.length).toBeLessThan(ir.length);
      // The signal portion should be present
      expect(Math.max(...Array.from(result))).toBeCloseTo(0.5, 1);
    });

    it('trims trailing silence', () => {
      const ir = new Float32Array([0.5, 0.3, 0.1, 0, 0, 0, 0]);
      const result = trimIR_fixed(ir);

      expect(result.length).toBeLessThan(ir.length);
    });

    it('trims both leading and trailing silence', () => {
      const ir = new Float32Array([0, 0, 0, 1.0, 0.5, 0.1, 0, 0, 0]);
      const result = trimIR_fixed(ir);

      // Should be significantly shorter
      expect(result.length).toBeLessThan(ir.length);
    });

    it('preserves signal content', () => {
      const signal = [0.8, 0.6, 0.4, 0.2, 0.1];
      const ir = new Float32Array([0, 0, ...signal, 0, 0, 0]);
      const result = trimIR_fixed(ir);

      // All signal values should be present in the trimmed result (within Float32 precision)
      signal.forEach(v => {
        const found = Array.from(result).some(r => Math.abs(r - v) < 1e-6);
        expect(found).toBe(true);
      });
    });

    it('returns unchanged array when no silence to trim', () => {
      const ir = new Float32Array([0.5, 0.3, 0.8, 0.1, 0.2]);
      const result = trimIR_fixed(ir);

      expect(result.length).toBe(ir.length);
    });

    it('handles all-silence input gracefully', () => {
      const ir = new Float32Array([0, 0, 0, 0, 0]);
      // Should not crash
      expect(() => trimIR_fixed(ir)).not.toThrow();
    });

    it('handles single-sample impulse', () => {
      const ir = new Float32Array([0, 0, 1.0, 0, 0]);
      const result = trimIR_fixed(ir);

      expect(result.length).toBeLessThanOrEqual(2);
      expect(Math.max(...Array.from(result))).toBeCloseTo(1.0, 5);
    });

    it('respects the tolerance threshold', () => {
      const tolerance = 1e-6;
      // Values just above tolerance should be kept
      const ir = new Float32Array([0, 0, 1e-5, 0.5, 1e-5, 0, 0]);
      const result = trimIR_fixed(ir);

      // The 1e-5 values exceed 1e-6 tolerance, so they should be kept
      expect(result.length).toBeGreaterThanOrEqual(3);
    });
  });
});
