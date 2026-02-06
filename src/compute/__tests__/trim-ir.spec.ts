/**
 * Tests for trimIR function (impulse response silence trimming).
 *
 * Bug: `sindex` was initialized to `ir.length` (one past the last valid index).
 * `ir[ir.length]` returns `undefined`, and `Math.abs(undefined)` is `NaN`.
 * `NaN < tolerance` is `false`, so the while loop exited immediately,
 * making the tail-trimming logic non-functional.
 *
 * Fix: Initialize `sindex = ir.length - 1` so the loop starts at the last
 * valid array index, and add explicit bounds checking to both loops.
 *
 * These tests import the actual production implementation to ensure
 * it does not regress.
 */

import { trimIR } from '../trim-ir';

describe('trimIR', () => {
  describe('out-of-bounds bug regression', () => {
    it('trims trailing silence (previously broken)', () => {
      const ir = new Float32Array([1.0, 0.5, 0.1, 0, 0, 0, 0]);
      const result = trimIR(ir);

      // Should trim trailing zeros
      expect(result.length).toBeLessThan(ir.length);
    });

    it('trims both leading and trailing silence', () => {
      const ir = new Float32Array([0, 0, 0, 1.0, 0.5, 0.1, 0, 0, 0, 0]);
      const result = trimIR(ir);

      expect(result.length).toBeLessThan(ir.length);
      expect(Math.max(...Array.from(result))).toBeCloseTo(1.0, 5);
    });
  });

  describe('correctness', () => {
    it('trims leading silence', () => {
      const ir = new Float32Array([0, 0, 0, 0, 0.5, 0.3, 0.1]);
      const result = trimIR(ir);

      expect(result.length).toBeLessThan(ir.length);
      expect(Math.max(...Array.from(result))).toBeCloseTo(0.5, 1);
    });

    it('trims trailing silence', () => {
      const ir = new Float32Array([0.5, 0.3, 0.1, 0, 0, 0, 0]);
      const result = trimIR(ir);

      expect(result.length).toBeLessThan(ir.length);
    });

    it('preserves signal content', () => {
      const signal = [0.8, 0.6, 0.4, 0.2, 0.1];
      const ir = new Float32Array([0, 0, ...signal, 0, 0, 0]);
      const result = trimIR(ir);

      signal.forEach(v => {
        const found = Array.from(result).some(r => Math.abs(r - v) < 1e-6);
        expect(found).toBe(true);
      });
    });

    it('returns unchanged array when no silence to trim', () => {
      const ir = new Float32Array([0.5, 0.3, 0.8, 0.1, 0.2]);
      const result = trimIR(ir);

      expect(result.length).toBe(ir.length);
    });

    it('handles all-silence input without crashing and returns empty result', () => {
      const ir = new Float32Array([0, 0, 0, 0, 0]);
      const result = trimIR(ir);

      expect(result.length).toBe(0);
    });

    it('handles single-sample impulse', () => {
      const ir = new Float32Array([0, 0, 1.0, 0, 0]);
      const result = trimIR(ir);

      expect(result.length).toBeLessThanOrEqual(2);
      expect(Math.max(...Array.from(result))).toBeCloseTo(1.0, 5);
    });

    it('respects the tolerance threshold', () => {
      // Values just above tolerance (1e-6) should be kept
      const ir = new Float32Array([0, 0, 1e-5, 0.5, 1e-5, 0, 0]);
      const result = trimIR(ir);

      expect(result.length).toBeGreaterThanOrEqual(3);
    });
  });
});
