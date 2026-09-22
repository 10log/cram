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
 * Cooley-Tukey; every other length goes through Bluestein's chirp-z algorithm.
 *
 * Sign convention: `forward` computes the unnormalized DFT
 * `X[k] = sum_n x[n] exp(-2i*pi*n*k/N)`, and `inverseUnscaled` computes
 * `sum_k X[k] exp(+2i*pi*n*k/N)` — that is, `N` times the true inverse. Callers
 * apply whatever normalization they need; `dct.ts` folds it into its own scaling
 * so nothing is divided twice.
 */

/** A prepared complex FFT of one fixed length. Both methods are in-place. */
export interface ComplexFftPlan {
  readonly n: number;
  /** `(re, im) <- DFT(re + i*im)`, unnormalized. */
  forward(re: Float64Array, im: Float64Array): void;
  /** `(re, im) <- N * IDFT(re + i*im)`. Divide by `n` for the true inverse. */
  inverseUnscaled(re: Float64Array, im: Float64Array): void;
}

function isPowerOfTwo(n: number): boolean {
  return n >= 1 && (n & (n - 1)) === 0;
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
  abstract forward(re: Float64Array, im: Float64Array): void;
  inverseUnscaled(re: Float64Array, im: Float64Array): void {
    this.forward(im, re);
  }
}

/** Length-1 transform: the identity. */
class IdentityFft extends FftPlanBase {
  readonly n = 1;
  forward(): void {
    /* a one-point DFT is its own input */
  }
}

/** Radix-2 Cooley-Tukey, for power-of-two lengths. */
class Radix2Fft extends FftPlanBase {
  readonly n: number;
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
 * Bluestein's chirp-z algorithm, for lengths that are not powers of two.
 *
 * Rewrites the DFT as a cyclic convolution of length `m >= 2n - 1` using
 * `n*k = (n^2 + k^2 - (k-n)^2) / 2`. The chirp tables and the transformed
 * convolution kernel are built once here; `forward` only touches preallocated
 * scratch.
 */
class BluesteinFft extends FftPlanBase {
  readonly n: number;
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
 * Build a reusable FFT plan of length `n`. Plans hold precomputed tables and
 * scratch, so create them once per transform length and keep them.
 */
export function createComplexFftPlan(n: number): ComplexFftPlan {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`FFT length must be a positive integer, got ${n}`);
  }
  if (n === 1) return new IdentityFft();
  if (isPowerOfTwo(n)) return new Radix2Fft(n);
  return new BluesteinFft(n);
}
