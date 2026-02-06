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
 */

describe('Schroeder backwards integration - input mutation', () => {
  function cumsum(data: Float32Array): Float32Array {
    const cumulativeSum = ((sum: number) => (value: number) => sum += value)(0);
    return data.map(cumulativeSum);
  }

  function sum(data: Float32Array): number {
    return data.reduce((acc, v) => acc + v, 0);
  }

  /** Buggy version: reverses in place (mutates input) */
  function schroederBuggy(data: Float32Array): Float32Array {
    let data_reversed: Float32Array = data.reverse();
    let data_reversed_sq = data_reversed.map(x => x ** 2);
    let data_reversed_sq_cumsum = cumsum(data_reversed_sq);
    let data_sq = data.map(x => x ** 2);
    let data_sq_sum = sum(data_sq);
    let normalized = data_reversed_sq_cumsum.map(x => x / data_sq_sum);
    return normalized.map(x => x !== 0 ? 10 * Math.log10(x) : 0);
  }

  /** Fixed version: copies before reversing (does not mutate input) */
  function schroederFixed(data: Float32Array): Float32Array {
    let data_reversed: Float32Array = new Float32Array(data).reverse();
    let data_reversed_sq = data_reversed.map(x => x ** 2);
    let data_reversed_sq_cumsum = cumsum(data_reversed_sq);
    let data_sq = data.map(x => x ** 2);
    let data_sq_sum = sum(data_sq);
    let normalized = data_reversed_sq_cumsum.map(x => x / data_sq_sum);
    return normalized.map(x => x !== 0 ? 10 * Math.log10(x) : 0);
  }

  it('buggy version mutates the input array', () => {
    const input = new Float32Array([1, 2, 3, 4, 5]);
    const original = new Float32Array(input);

    schroederBuggy(input);

    // Input was mutated (reversed in place) — this corrupts the caller's data
    expect(Array.from(input)).not.toEqual(Array.from(original));
    expect(Array.from(input)).toEqual(Array.from(original).reverse());
  });

  it('fixed version does NOT mutate the input array', () => {
    const input = new Float32Array([1, 2, 3, 4, 5]);
    const original = new Float32Array(input);

    schroederFixed(input);

    // Input should be unchanged
    expect(Array.from(input)).toEqual(Array.from(original));
  });

  it('buggy version produces different results on repeated calls (data keeps flipping)', () => {
    // This is the critical real-world bug: the user clicks "calculate" twice
    // and gets different results each time because the input is reversed
    const sharedInput = new Float32Array([0.9, 0.5, 0.3, 0.1, 0.05]);

    const result1 = schroederBuggy(sharedInput);
    // sharedInput is now reversed: [0.05, 0.1, 0.3, 0.5, 0.9]
    const result2 = schroederBuggy(sharedInput);
    // sharedInput is back to original: [0.9, 0.5, 0.3, 0.1, 0.05]

    // The two results differ because the input was different each time!
    const areSame = Array.from(result1).every((v, i) =>
      Math.abs(v - result2[i]) < 1e-6
    );
    expect(areSame).toBe(false);
  });

  it('fixed version produces identical results on repeated calls', () => {
    const sharedInput = new Float32Array([0.9, 0.5, 0.3, 0.1, 0.05]);

    const result1 = schroederFixed(sharedInput);
    const result2 = schroederFixed(sharedInput);

    // Both calls should produce the same result (input is not mutated)
    Array.from(result1).forEach((v, i) => {
      expect(v).toBeCloseTo(result2[i], 10);
    });
  });

  it('fixed version produces finite dB values for a decaying impulse', () => {
    const N = 100;
    const input = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      input[i] = Math.exp(-i * 0.1);
    }

    const result = schroederFixed(input);

    result.forEach(v => expect(Number.isFinite(v)).toBe(true));
  });

  it('fixed version ends at 0 dB (full energy at cumulative end)', () => {
    const input = new Float32Array([1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05]);
    const result = schroederFixed(input);

    // The last element of cumsum(reversed_sq) / total = 1.0 = 0 dB
    expect(result[result.length - 1]).toBeCloseTo(0, 1);
  });

  it('fixed version output is monotonically non-decreasing (cumulative property)', () => {
    const input = new Float32Array([1, 0.9, 0.7, 0.5, 0.3, 0.1, 0.05, 0.01]);
    const result = schroederFixed(input);

    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
    }
  });
});
