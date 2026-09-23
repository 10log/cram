/**
 * Allocation-free complex FFT plans for the ARD solver's hot loop.
 *
 * Why another FFT in this repository: `compute/acoustics/fft/fft.ts` wraps every
 * element in a `Complex` object, `compute/acoustics/fft/_fft.ts` allocates fresh
 * arrays on every call, and `compute/acoustics/fft/index.ts` applies a Hann
 * window and chunks its input by default. ARD runs two transforms per partition
 * per time step for 10,000-20,000 steps (docs/ard-solver-plan.md §5), so every
 * buffer has to be preallocated at plan time and the data has to stay in
 * `Float64Array`s.
 *
 * Arbitrary transform lengths are a requirement, not a convenience: partition
 * extents come from greedy box growth over a voxel grid (plan Phase 3), so they
 * are whatever integers the room geometry produces. Powers of two use radix-2
 * Cooley-Tukey; lengths whose prime factors are all at most
 * {@link MAX_MIXED_RADIX_FACTOR} use a mixed-radix Stockham transform; anything
 * left goes through Bluestein's chirp-z algorithm.
 *
 * The middle path is there because Bluestein is expensive in a way that shows
 * up in the solver's wall clock, not just in an asymptotic constant: it runs
 * three power-of-two transforms of length `>= 2n - 1` plus two chirp passes, so
 * a partition whose extents are 16 x 14 x 12 measured 3.7x the per-cell cost of
 * a 16 x 16 x 16 one. Most extents a room produces are smooth — of the 61
 * extents in 4..64, 33 factor over {2,3,5,7} against 5 that are powers of two —
 * so the middle path is the common case, and it closes that gap to about
 * 1.2-1.6x.
 *
 * Sign convention: `forward` computes the unnormalized DFT
 * `X[k] = sum_n x[n] exp(-2i*pi*n*k/N)`, and `inverseUnscaled` computes
 * `sum_k X[k] exp(+2i*pi*n*k/N)` — that is, `N` times the true inverse. Callers
 * apply whatever normalization they need; `dct.ts` folds it into its own scaling
 * so nothing is divided twice.
 */

/**
 * Largest transform length accepted. Well above any partition extent a room
 * produces, and low enough that an accidental huge value fails with a clear
 * error instead of an allocation failure — a plan of length `n` holds tables of
 * `O(n)`, and Bluestein rounds up to a power of two at least `2n - 1`.
 */
export const MAX_FFT_LENGTH = 1 << 26;

/**
 * A prepared complex FFT of one fixed length. Both methods are in-place.
 *
 * **Not re-entrant.** A plan owns mutable scratch (the Bluestein path in
 * particular), so a single instance must not have two transforms in flight at
 * once: no overlapping calls, and no sharing between concurrent callers. Plans
 * are also plain class instances, so they do not survive `postMessage` —
 * a worker builds its own. One plan per sequential user; `createComplexFftPlan`
 * again for anything concurrent.
 */
export interface ComplexFftPlan {
  readonly n: number;
  /**
   * Which algorithm the plan runs. Reported so that a caller — or a test —
   * can see which path `createComplexFftPlan` chose for a length without
   * inferring it from timings.
   */
  readonly kind: 'identity' | 'radix2' | 'mixed-radix' | 'bluestein';
  /** `(re, im) <- DFT(re + i*im)`, unnormalized. */
  forward(re: Float64Array, im: Float64Array): void;
  /** `(re, im) <- N * IDFT(re + i*im)`. Divide by `n` for the true inverse. */
  inverseUnscaled(re: Float64Array, im: Float64Array): void;
}

/**
 * JavaScript's bitwise operators coerce through `ToInt32`, so the usual
 * `n & (n - 1)` trick silently misclassifies values at or above `2^31`
 * (`2**32 + 2` would test as a power of two). Bound the input before using it.
 */
function isPowerOfTwo(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= 0x40000000 && (n & (n - 1)) === 0;
}

function reverseBits(value: number, width: number): number {
  let result = 0;
  for (let i = 0; i < width; i++) {
    result = (result << 1) | ((value >>> i) & 1);
  }
  return result >>> 0;
}

/**
 * The unscaled inverse is the forward transform with the real and imaginary
 * arrays swapped. For `z = re + i*im`, `IDFT_unscaled(z) = conj(DFT(conj z))`,
 * and passing `(im, re)` transforms `i*conj(z)`, which leaves `Re` in `re` and
 * `Im` in `im` exactly as wanted.
 */
abstract class FftPlanBase implements ComplexFftPlan {
  abstract readonly n: number;
  abstract readonly kind: ComplexFftPlan['kind'];
  abstract forward(re: Float64Array, im: Float64Array): void;
  inverseUnscaled(re: Float64Array, im: Float64Array): void {
    this.forward(im, re);
  }
}

/** Length-1 transform: the identity. */
class IdentityFft extends FftPlanBase {
  readonly n = 1;
  readonly kind = 'identity' as const;
  forward(): void {
    /* a one-point DFT is its own input */
  }
}

/** Radix-2 Cooley-Tukey, for power-of-two lengths. */
class Radix2Fft extends FftPlanBase {
  readonly n: number;
  readonly kind = 'radix2' as const;
  private readonly levels: number;
  private readonly cosTable: Float64Array;
  private readonly sinTable: Float64Array;
  private readonly reversed: Uint32Array;

  constructor(n: number) {
    super();
    if (!isPowerOfTwo(n)) throw new Error(`Radix2Fft needs a power of two, got ${n}`);
    this.n = n;
    this.levels = Math.round(Math.log2(n));

    const half = n >>> 1;
    this.cosTable = new Float64Array(half);
    this.sinTable = new Float64Array(half);
    for (let i = 0; i < half; i++) {
      this.cosTable[i] = Math.cos((2 * Math.PI * i) / n);
      this.sinTable[i] = Math.sin((2 * Math.PI * i) / n);
    }

    this.reversed = new Uint32Array(n);
    for (let i = 0; i < n; i++) this.reversed[i] = reverseBits(i, this.levels);
  }

  forward(re: Float64Array, im: Float64Array): void {
    const { n, reversed, cosTable, sinTable } = this;
    if (n === 1) return;

    for (let i = 0; i < n; i++) {
      const j = reversed[i];
      if (j > i) {
        let t = re[i];
        re[i] = re[j];
        re[j] = t;
        t = im[i];
        im[i] = im[j];
        im[j] = t;
      }
    }

    for (let size = 2; size <= n; size *= 2) {
      const half = size >>> 1;
      const step = n / size;
      for (let i = 0; i < n; i += size) {
        for (let j = i, k = 0; j < i + half; j++, k += step) {
          const l = j + half;
          const c = cosTable[k];
          const s = sinTable[k];
          const tre = re[l] * c + im[l] * s;
          const tim = -re[l] * s + im[l] * c;
          re[l] = re[j] - tre;
          im[l] = im[j] - tim;
          re[j] += tre;
          im[j] += tim;
        }
      }
    }
  }
}

/**
 * Bluestein's chirp-z algorithm, for lengths with a prime factor above
 * {@link MAX_MIXED_RADIX_FACTOR}.
 *
 * The fallback of last resort, not the general case: 14, 15, 24 and every other
 * {2,3,5,7}-smooth length take {@link MixedRadixFft} instead. What is left is a
 * length like 11, 22 or 61, where a Cooley-Tukey split would need a butterfly
 * as expensive as the transform.
 *
 * Rewrites the DFT as a cyclic convolution of length `m >= 2n - 1` using
 * `n*k = (n^2 + k^2 - (k-n)^2) / 2`, which is why it is the expensive path:
 * three power-of-two transforms of at least twice the length, plus two chirp
 * passes. The chirp tables and the transformed convolution kernel are built
 * once here; `forward` only touches preallocated scratch.
 */
class BluesteinFft extends FftPlanBase {
  readonly n: number;
  readonly kind = 'bluestein' as const;
  private readonly m: number;
  private readonly inner: Radix2Fft;
  private readonly cosTable: Float64Array;
  private readonly sinTable: Float64Array;
  private readonly kernelRe: Float64Array;
  private readonly kernelIm: Float64Array;
  private readonly scratchRe: Float64Array;
  private readonly scratchIm: Float64Array;

  constructor(n: number) {
    super();
    this.n = n;

    let m = 1;
    while (m < 2 * n - 1) m *= 2;
    this.m = m;
    this.inner = new Radix2Fft(m);

    // exp(i*pi*i^2/n). Reducing i^2 modulo 2n keeps the angle inside one
    // period, which matters for accuracy once n is in the hundreds.
    this.cosTable = new Float64Array(n);
    this.sinTable = new Float64Array(n);
    const period = 2 * n;
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * ((i * i) % period)) / n;
      this.cosTable[i] = Math.cos(angle);
      this.sinTable[i] = Math.sin(angle);
    }

    // Convolution kernel, wrapped symmetrically, transformed once.
    const kernelRe = new Float64Array(m);
    const kernelIm = new Float64Array(m);
    kernelRe[0] = this.cosTable[0];
    kernelIm[0] = this.sinTable[0];
    for (let i = 1; i < n; i++) {
      kernelRe[i] = kernelRe[m - i] = this.cosTable[i];
      kernelIm[i] = kernelIm[m - i] = this.sinTable[i];
    }
    this.inner.forward(kernelRe, kernelIm);
    this.kernelRe = kernelRe;
    this.kernelIm = kernelIm;

    this.scratchRe = new Float64Array(m);
    this.scratchIm = new Float64Array(m);
  }

  forward(re: Float64Array, im: Float64Array): void {
    const { n, m, inner, cosTable, sinTable, kernelRe, kernelIm, scratchRe, scratchIm } = this;

    scratchRe.fill(0);
    scratchIm.fill(0);
    for (let i = 0; i < n; i++) {
      const c = cosTable[i];
      const s = sinTable[i];
      scratchRe[i] = re[i] * c + im[i] * s;
      scratchIm[i] = -re[i] * s + im[i] * c;
    }

    inner.forward(scratchRe, scratchIm);
    for (let i = 0; i < m; i++) {
      const tre = scratchRe[i] * kernelRe[i] - scratchIm[i] * kernelIm[i];
      const tim = scratchRe[i] * kernelIm[i] + scratchIm[i] * kernelRe[i];
      scratchRe[i] = tre;
      scratchIm[i] = tim;
    }
    inner.inverseUnscaled(scratchRe, scratchIm);

    const invM = 1 / m;
    for (let i = 0; i < n; i++) {
      const cre = scratchRe[i] * invM;
      const cim = scratchIm[i] * invM;
      const c = cosTable[i];
      const s = sinTable[i];
      re[i] = cre * c + cim * s;
      im[i] = -cre * s + cim * c;
    }
  }
}


/**
 * Largest prime factor a mixed-radix plan will handle.
 *
 * Each factor `p` is combined with a direct `p`-point DFT, which is `O(p²)` per
 * butterfly against Bluestein's `O(n log n)` for the whole transform — so small
 * factors are a clear win and large ones are not. 7 covers the useful range:
 * of the extents 4..64 that a room's box growth produces, 33 are
 * {2,3,5,7}-smooth against 5 that are powers of two, so this roughly sextuples
 * how often the fast path is taken.
 */
export const MAX_MIXED_RADIX_FACTOR = 7;

/** Prime factors of `n`, ascending, or `null` if any exceeds the bound. */
export function smallPrimeFactors(n: number): number[] | null {
  const factors: number[] = [];
  let rest = n;
  for (let p = 2; p <= MAX_MIXED_RADIX_FACTOR; p++) {
    while (rest % p === 0) {
      factors.push(p);
      rest /= p;
    }
  }
  return rest === 1 ? factors : null;
}

/**
 * Radices a mixed-radix plan runs, in stage order, or `null` if `n` has a
 * factor above {@link MAX_MIXED_RADIX_FACTOR}.
 *
 * Adjacent 2s are merged into 4s. The radix-4 butterfly costs the same
 * multiplies as two radix-2 ones but halves the passes over the array, and
 * with `n` in the low thousands the transform is bound by memory traffic, not
 * arithmetic — the pairing measures 20-25% faster on partition-sized lengths.
 * An odd count of 2s leaves one radix-2 stage behind.
 *
 * Stage order does not affect the result: each stage is a full Cooley-Tukey
 * split of whatever length is left, so any permutation of the factors computes
 * the same DFT.
 */
export function mixedRadixStages(n: number): number[] | null {
  const factors = smallPrimeFactors(n);
  if (!factors) return null;
  let twos = 0;
  const odd: number[] = [];
  for (const p of factors) {
    if (p === 2) twos++;
    else odd.push(p);
  }
  const stages: number[] = [];
  for (let i = 0; i + 1 < twos; i += 2) stages.push(4);
  if (twos % 2 === 1) stages.push(2);
  return stages.concat(odd);
}

/**
 * Mixed-radix Stockham for lengths whose prime factors are all small.
 *
 * Decimation in frequency, self-sorting. A stage splits the transform length
 * `L = p·m` as `nu = k + m·r` and `kappa = j + p·t`, which gives
 *
 * ```
 * X[j + p·t] = DFT_m over k of ( W_L^{kj} · Σ_r x[k + m·r] W_p^{rj} )
 * ```
 *
 * — a `p`-point DFT, a twiddle, and `p` interleaved sub-transforms of length
 * `m`. Writing the `p` results to `q + s·(p·k + j)` leaves the next stage's
 * inputs contiguous at stride `s·p`, so the data comes out in natural order
 * with no bit-reversal or digit-reversal pass. The cost is that each stage
 * reads one array and writes another, so the plan ping-pongs between the
 * caller's arrays and its own scratch.
 *
 * Both twiddles come from one table of `W_n^i`: `W_L^{kj}` is
 * `W_n^{kj·(n/L)}` and every index stays below `n`. The `p`-point DFTs use
 * small per-radix tables built at construction, so no stage does a modular
 * reduction in its inner loop.
 */
class MixedRadixFft extends FftPlanBase {
  readonly n: number;
  readonly kind = 'mixed-radix' as const;
  private readonly stages: number[];
  private readonly cos: Float64Array;
  private readonly sin: Float64Array;
  private readonly scratchRe: Float64Array;
  private readonly scratchIm: Float64Array;
  /** `W_p^{jr}` for each distinct radix needing the generic butterfly. */
  private readonly small = new Map<number, { cos: Float64Array; sin: Float64Array }>();
  /** Per-butterfly gather, sized for the largest radix. */
  private readonly bufRe: Float64Array;
  private readonly bufIm: Float64Array;

  constructor(n: number, stages: number[]) {
    super();
    this.n = n;
    this.stages = stages;
    this.cos = new Float64Array(n);
    this.sin = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      this.cos[i] = Math.cos((2 * Math.PI * i) / n);
      this.sin[i] = Math.sin((2 * Math.PI * i) / n);
    }
    this.scratchRe = new Float64Array(n);
    this.scratchIm = new Float64Array(n);
    let widest = 1;
    for (const p of stages) {
      widest = Math.max(widest, p);
      if (p === 2 || p === 4 || this.small.has(p)) continue;
      const c = new Float64Array(p * p);
      const s = new Float64Array(p * p);
      for (let j = 0; j < p; j++) {
        for (let r = 0; r < p; r++) {
          c[j * p + r] = Math.cos((2 * Math.PI * ((j * r) % p)) / p);
          s[j * p + r] = Math.sin((2 * Math.PI * ((j * r) % p)) / p);
        }
      }
      this.small.set(p, { cos: c, sin: s });
    }
    this.bufRe = new Float64Array(widest);
    this.bufIm = new Float64Array(widest);
  }

  forward(re: Float64Array, im: Float64Array): void {
    const { n, stages } = this;
    let srcRe = re;
    let srcIm = im;
    let dstRe = this.scratchRe;
    let dstIm = this.scratchIm;
    let len = n;
    let stride = 1;

    for (let level = 0; level < stages.length; level++) {
      const p = stages[level];
      const m = len / p;
      // `W_len^k` is `W_n^{k*step}`.
      const step = n / len;
      if (p === 2) this.stage2(srcRe, srcIm, dstRe, dstIm, m, stride, step);
      else if (p === 4) this.stage4(srcRe, srcIm, dstRe, dstIm, m, stride, step);
      else this.stageGeneric(srcRe, srcIm, dstRe, dstIm, m, stride, step, p);

      let t: Float64Array = srcRe;
      srcRe = dstRe;
      dstRe = t;
      t = srcIm;
      srcIm = dstIm;
      dstIm = t;
      len = m;
      stride *= p;
    }

    // An odd number of stages leaves the result in scratch.
    if (srcRe !== re) {
      re.set(srcRe);
      im.set(srcIm);
    }
  }

  private stage2(
    srcRe: Float64Array, srcIm: Float64Array,
    dstRe: Float64Array, dstIm: Float64Array,
    m: number, s: number, step: number,
  ): void {
    const { cos, sin } = this;
    for (let k = 0; k < m; k++) {
      const t = k * step;
      const c = cos[t];
      const sn = sin[t];
      const in0 = s * k;
      const in1 = s * (k + m);
      const out0 = s * 2 * k;
      const out1 = out0 + s;
      for (let q = 0; q < s; q++) {
        const ar = srcRe[in0 + q];
        const ai = srcIm[in0 + q];
        const br = srcRe[in1 + q];
        const bi = srcIm[in1 + q];
        dstRe[out0 + q] = ar + br;
        dstIm[out0 + q] = ai + bi;
        const dr = ar - br;
        const di = ai - bi;
        dstRe[out1 + q] = dr * c + di * sn;
        dstIm[out1 + q] = di * c - dr * sn;
      }
    }
  }

  private stage4(
    srcRe: Float64Array, srcIm: Float64Array,
    dstRe: Float64Array, dstIm: Float64Array,
    m: number, s: number, step: number,
  ): void {
    const { cos, sin } = this;
    for (let k = 0; k < m; k++) {
      const t1 = k * step;
      const t2 = 2 * t1;
      const t3 = 3 * t1;
      const c1 = cos[t1], s1 = sin[t1];
      const c2 = cos[t2], s2 = sin[t2];
      const c3 = cos[t3], s3 = sin[t3];
      const in0 = s * k;
      const in1 = in0 + s * m;
      const in2 = in1 + s * m;
      const in3 = in2 + s * m;
      const out0 = s * 4 * k;
      const out1 = out0 + s;
      const out2 = out1 + s;
      const out3 = out2 + s;
      for (let q = 0; q < s; q++) {
        const x0r = srcRe[in0 + q], x0i = srcIm[in0 + q];
        const x1r = srcRe[in1 + q], x1i = srcIm[in1 + q];
        const x2r = srcRe[in2 + q], x2i = srcIm[in2 + q];
        const x3r = srcRe[in3 + q], x3i = srcIm[in3 + q];
        // Sum and difference pairs, then the two rotations by -i and +i that
        // a 4-point DFT reduces to.
        const ar = x0r + x2r, ai = x0i + x2i;
        const br = x1r + x3r, bi = x1i + x3i;
        const cr = x0r - x2r, ci = x0i - x2i;
        const dr = x1r - x3r, di = x1i - x3i;
        dstRe[out0 + q] = ar + br;
        dstIm[out0 + q] = ai + bi;
        const a1r = cr + di, a1i = ci - dr;
        const a2r = ar - br, a2i = ai - bi;
        const a3r = cr - di, a3i = ci + dr;
        dstRe[out1 + q] = a1r * c1 + a1i * s1;
        dstIm[out1 + q] = a1i * c1 - a1r * s1;
        dstRe[out2 + q] = a2r * c2 + a2i * s2;
        dstIm[out2 + q] = a2i * c2 - a2r * s2;
        dstRe[out3 + q] = a3r * c3 + a3i * s3;
        dstIm[out3 + q] = a3i * c3 - a3r * s3;
      }
    }
  }

  private stageGeneric(
    srcRe: Float64Array, srcIm: Float64Array,
    dstRe: Float64Array, dstIm: Float64Array,
    m: number, s: number, step: number, p: number,
  ): void {
    const { cos, sin, bufRe, bufIm } = this;
    const small = this.small.get(p);
    if (!small) throw new Error(`no butterfly table for radix ${p}`);
    const pc = small.cos;
    const ps = small.sin;
    for (let k = 0; k < m; k++) {
      for (let q = 0; q < s; q++) {
        for (let r = 0; r < p; r++) {
          const idx = s * (k + m * r) + q;
          bufRe[r] = srcRe[idx];
          bufIm[r] = srcIm[idx];
        }
        for (let j = 0; j < p; j++) {
          let accRe = 0;
          let accIm = 0;
          const row = j * p;
          for (let r = 0; r < p; r++) {
            const c = pc[row + r];
            const sn = ps[row + r];
            accRe += bufRe[r] * c + bufIm[r] * sn;
            accIm += bufIm[r] * c - bufRe[r] * sn;
          }
          const t = k * j * step;
          const c = cos[t];
          const sn = sin[t];
          const out = s * (p * k + j) + q;
          dstRe[out] = accRe * c + accIm * sn;
          dstIm[out] = accIm * c - accRe * sn;
        }
      }
    }
  }
}

/**
 * Build a reusable FFT plan of length `n`. Plans hold precomputed tables and
 * scratch, so create them once per transform length and keep them — but see
 * {@link ComplexFftPlan} on re-entrancy before sharing one.
 */
export function createComplexFftPlan(n: number): ComplexFftPlan {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`FFT length must be a positive integer, got ${n}`);
  }
  if (n > MAX_FFT_LENGTH) {
    throw new Error(`FFT length ${n} exceeds the maximum of ${MAX_FFT_LENGTH}`);
  }
  if (n === 1) return new IdentityFft();
  if (isPowerOfTwo(n)) return new Radix2Fft(n);
  // Mixed radix where the factors allow it; Bluestein is the fallback for a
  // length with a large prime factor, which is the only case it is now needed
  // for.
  const stages = mixedRadixStages(n);
  if (stages) return new MixedRadixFft(n, stages);
  return new BluesteinFft(n);
}
