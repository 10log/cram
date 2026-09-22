/**
 * Tests for the ARD solver's complex FFT plans.
 *
 * The DCT built on top of these is the solver's hot loop, so both the
 * power-of-two path (radix-2) and the arbitrary-length path (Bluestein) are
 * checked against a direct O(N^2) DFT. Partition extents come from voxel-grid
 * box growth, so non-power-of-two lengths are the common case, not the edge
 * case.
 */

import { createComplexFftPlan, MAX_FFT_LENGTH } from '../fft';

/** Direct DFT: X[k] = sum_j x[j] exp(-2i*pi*j*k/N). */
function naiveDft(re: Float64Array, im: Float64Array): { re: Float64Array; im: Float64Array } {
  const n = re.length;
  const outRe = new Float64Array(n);
  const outIm = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    let sr = 0;
    let si = 0;
    for (let j = 0; j < n; j++) {
      const angle = (-2 * Math.PI * j * k) / n;
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      sr += re[j] * c - im[j] * s;
      si += re[j] * s + im[j] * c;
    }
    outRe[k] = sr;
    outIm[k] = si;
  }
  return { re: outRe, im: outIm };
}

/** Deterministic pseudo-random fill, so failures are reproducible. */
function fillPseudoRandom(target: Float64Array, seed: number): void {
  let state = seed >>> 0;
  for (let i = 0; i < target.length; i++) {
    state = (state * 1664525 + 1013904223) >>> 0;
    target[i] = state / 0x100000000 - 0.5;
  }
}

function maxAbsDiff(a: Float64Array, b: Float64Array): number {
  let worst = 0;
  for (let i = 0; i < a.length; i++) worst = Math.max(worst, Math.abs(a[i] - b[i]));
  return worst;
}

describe('ARD complex FFT', () => {
  // 1 exercises the identity plan, 2/4/8/16/64 radix-2, the rest Bluestein.
  const lengths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 16, 17, 30, 31, 37, 61, 64, 113];

  describe('forward matches a direct DFT', () => {
    it.each(lengths)('length %i', (n) => {
      const re = new Float64Array(n);
      const im = new Float64Array(n);
      fillPseudoRandom(re, n * 7 + 1);
      fillPseudoRandom(im, n * 13 + 5);

      const expected = naiveDft(re, im);

      const plan = createComplexFftPlan(n);
      plan.forward(re, im);

      // Tolerance scales with n: the sum itself has n terms.
      const tol = 1e-12 * Math.max(8, n);
      expect(maxAbsDiff(re, expected.re)).toBeLessThan(tol);
      expect(maxAbsDiff(im, expected.im)).toBeLessThan(tol);
    });
  });

  describe('inverseUnscaled undoes forward up to a factor of n', () => {
    it.each(lengths)('length %i', (n) => {
      const re = new Float64Array(n);
      const im = new Float64Array(n);
      fillPseudoRandom(re, n * 3 + 2);
      fillPseudoRandom(im, n * 11 + 9);
      const originalRe = re.slice();
      const originalIm = im.slice();

      const plan = createComplexFftPlan(n);
      plan.forward(re, im);
      plan.inverseUnscaled(re, im);
      for (let i = 0; i < n; i++) {
        re[i] /= n;
        im[i] /= n;
      }

      const tol = 1e-12 * Math.max(8, n);
      expect(maxAbsDiff(re, originalRe)).toBeLessThan(tol);
      expect(maxAbsDiff(im, originalIm)).toBeLessThan(tol);
    });
  });

  it('transforms a unit impulse to a flat spectrum', () => {
    const n = 37;
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    re[0] = 1;

    createComplexFftPlan(n).forward(re, im);

    for (let k = 0; k < n; k++) {
      expect(re[k]).toBeCloseTo(1, 12);
      expect(im[k]).toBeCloseTo(0, 12);
    }
  });

  it('transforms a constant to a single DC bin', () => {
    const n = 30;
    const re = new Float64Array(n).fill(2);
    const im = new Float64Array(n);

    createComplexFftPlan(n).forward(re, im);

    expect(re[0]).toBeCloseTo(2 * n, 10);
    expect(im[0]).toBeCloseTo(0, 10);
    for (let k = 1; k < n; k++) {
      expect(Math.hypot(re[k], im[k])).toBeLessThan(1e-10);
    }
  });

  it('reuses a plan across calls without drift', () => {
    const n = 61;
    const plan = createComplexFftPlan(n);
    const source = new Float64Array(n);
    fillPseudoRandom(source, 99);

    let first: Float64Array | null = null;
    for (let trial = 0; trial < 5; trial++) {
      const re = source.slice();
      const im = new Float64Array(n);
      plan.forward(re, im);
      if (first === null) first = re.slice();
      else expect(maxAbsDiff(re, first)).toBe(0);
    }
  });

  it('rejects invalid lengths', () => {
    expect(() => createComplexFftPlan(0)).toThrow();
    expect(() => createComplexFftPlan(-4)).toThrow();
    expect(() => createComplexFftPlan(2.5)).toThrow();
  });

  it('rejects lengths past the maximum instead of misclassifying them', () => {
    // Bitwise operators coerce through ToInt32, so `n & (n - 1)` reports
    // 2**32 + 2 as a power of two. Such a value must throw, not quietly take
    // the radix-2 path with a truncated length.
    expect(() => createComplexFftPlan(2 ** 32 + 2)).toThrow(/exceeds the maximum/);
    expect(() => createComplexFftPlan(2 ** 31)).toThrow(/exceeds the maximum/);
    expect(() => createComplexFftPlan(MAX_FFT_LENGTH + 1)).toThrow(/exceeds the maximum/);
    // Not asserting that MAX_FFT_LENGTH itself builds: the tables for 2^26 run
    // to hundreds of megabytes, which is not worth spending on a bounds check.
    expect(() => createComplexFftPlan(1 << 12)).not.toThrow();
  });
});
