/**
 * Tests for Schroeder backwards integration input mutation bug.
 *
 * Float32Array.reverse() reverses in-place, meaning after the call
 * `data_reversed` and `data` pointed to the same (now reversed) array.
 * This corrupts the caller's original data (this.filteredData[f]),
 * and causes subsequent recalculations to operate on already-reversed
 * data, producing incorrect results on every other invocation.
 *
 * The fix copies the array before reversing:
 *   new Float32Array(data).reverse()
 *
 * These tests import the actual production implementation to ensure
 * it does not regress.
 */

import { schroederBackwardsIntegration } from '../schroeder';

describe('Schroeder backwards integration - input mutation', () => {
  it('does NOT mutate the input array', () => {
    const input = new Float32Array([1, 2, 3, 4, 5]);
    const original = new Float32Array(input);

    schroederBackwardsIntegration(input);

    expect(Array.from(input)).toEqual(Array.from(original));
  });

  it('produces identical results on repeated calls with the same input', () => {
    const sharedInput = new Float32Array([0.9, 0.5, 0.3, 0.1, 0.05]);

    const result1 = schroederBackwardsIntegration(sharedInput);
    const result2 = schroederBackwardsIntegration(sharedInput);

    Array.from(result1).forEach((v, i) => {
      expect(v).toBeCloseTo(result2[i], 10);
    });
  });

  it('produces finite dB values for a decaying impulse', () => {
    const N = 100;
    const input = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      input[i] = Math.exp(-i * 0.1);
    }

    const result = schroederBackwardsIntegration(input);

    result.forEach(v => expect(Number.isFinite(v)).toBe(true));
  });

  it('ends at 0 dB (full energy at cumulative end)', () => {
    const input = new Float32Array([1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05]);
    const result = schroederBackwardsIntegration(input);

    expect(result[result.length - 1]).toBeCloseTo(0, 1);
  });

  it('output is monotonically non-decreasing (cumulative property)', () => {
    const input = new Float32Array([1, 0.9, 0.7, 0.5, 0.3, 0.1, 0.05, 0.01]);
    const result = schroederBackwardsIntegration(input);

    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
    }
  });
});
