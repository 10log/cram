/**
 * Tests for the ARD solver's complex FFT plans.
 *
 * The DCT built on top of these is the solver's hot loop, so all three paths —
 * radix-2, mixed-radix Stockham, and Bluestein — are checked against a direct
 * O(N^2) DFT. Partition extents come from voxel-grid box growth, so
 * non-power-of-two lengths are the common case, not the edge case, and which
 * path a length takes is worth asserting directly: the three agree to 1e-12,
 * so a dispatch that silently sent everything to Bluestein would pass every
 * numerical test here while costing the solver a factor of three.
 */

import {
  createComplexFftPlan,
  MAX_FFT_LENGTH,
  mixedRadixStages,
  smallPrimeFactors,
} from '../fft';

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
  // 1 exercises the identity plan; 2/4/8/16/64 radix-2; 3, 5, 6, 7, 9, 12, 14,
  // 15, 20, 24, 27, 30, 35, 45, 49, 63 mixed radix (covering every radix and an
  // odd count of 2s, which leaves a trailing radix-2 stage); 11, 17, 22, 31, 37,
  // 61, 113 Bluestein.
  const lengths = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16, 17, 20, 22, 24, 27, 30, 31,
    35, 37, 45, 49, 61, 63, 64, 113,
  ];

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

  describe('dispatch', () => {
    it('takes the mixed-radix path exactly when the factors are small', () => {
      // The boundary cases: 63 = 7*9 is the largest smooth length here, 11 and
      // its multiples are not smooth however small, and a power of two stays on
      // the radix-2 path rather than being swept into the general one.
      const expected: Array<[number, string]> = [
        [1, 'identity'],
        [2, 'radix2'],
        [64, 'radix2'],
        [3, 'mixed-radix'],
        [6, 'mixed-radix'],
        [12, 'mixed-radix'],
        [14, 'mixed-radix'],
        [20, 'mixed-radix'],
        [63, 'mixed-radix'],
        [105, 'mixed-radix'],
        [11, 'bluestein'],
        [22, 'bluestein'],
        [61, 'bluestein'],
        [121, 'bluestein'],
      ];
      for (const [n, kind] of expected) {
        expect([n, createComplexFftPlan(n).kind]).toEqual([n, kind]);
      }
    });

    it('factors over {2,3,5,7} and refuses anything larger', () => {
      expect(smallPrimeFactors(1)).toEqual([]);
      expect(smallPrimeFactors(12)).toEqual([2, 2, 3]);
      expect(smallPrimeFactors(210)).toEqual([2, 3, 5, 7]);
      expect(smallPrimeFactors(11)).toBeNull();
      expect(smallPrimeFactors(2 * 11)).toBeNull();
    });

    it('pairs 2s into radix-4 stages, leaving at most one radix-2', () => {
      expect(mixedRadixStages(16)).toEqual([4, 4]);
      expect(mixedRadixStages(8)).toEqual([4, 2]);
      expect(mixedRadixStages(24)).toEqual([4, 2, 3]);
      expect(mixedRadixStages(20)).toEqual([4, 5]);
      expect(mixedRadixStages(14)).toEqual([2, 7]);
      expect(mixedRadixStages(11)).toBeNull();
      // Whatever the stage list, its product is the transform length.
      for (const n of [6, 12, 14, 20, 24, 27, 35, 45, 63, 105]) {
        const stages = mixedRadixStages(n);
        expect(stages).not.toBeNull();
        expect((stages as number[]).reduce((a, b) => a * b, 1)).toBe(n);
      }
    });
  });

  it('does not allocate once the plan is built', () => {
    // Every buffer these plans touch is preallocated at construction, because
    // ARD runs two transforms per partition per step for 10,000+ steps. The
    // check is narrow by design — it counts `Float64Array` constructions, which
    // is the only kind of allocation any of the three paths could plausibly
    // regress into — and it is run on one length per path so a scratch array
    // added to any of them is caught.
    const original = globalThis.Float64Array;
    for (const n of [64, 24, 61]) {
      const plan = createComplexFftPlan(n);
      const re = new Float64Array(n);
      const im = new Float64Array(n);
      fillPseudoRandom(re, n);

      let built = 0;
      class Counting extends original {
        constructor(...args: ConstructorParameters<typeof Float64Array>) {
          built++;
          super(...args);
        }
      }
      (globalThis as { Float64Array: unknown }).Float64Array = Counting;
      try {
        plan.forward(re, im);
        plan.inverseUnscaled(re, im);
      } finally {
        (globalThis as { Float64Array: unknown }).Float64Array = original;
      }
      expect([n, built]).toEqual([n, 0]);
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
