/**
 * Separable DCT-II / DCT-III over an axis-aligned grid — Phase 1 of the ARD
 * solver (docs/ard-solver-plan.md).
 *
 * ARD advances each rectangular partition in a cosine modal basis: every time
 * step transforms the forcing field into modal space, applies an exact per-mode
 * update, and transforms the pressure back. That is two transforms per partition
 * per step, so this module is the solver's innermost hot loop and does no
 * allocation once the plan is built.
 *
 * ## Conventions
 *
 * `forward` is FFTW's `REDFT10` (DCT-II) along each axis, unnormalized:
 *
 * ```
 * Y[k] = 2 * sum_{j=0}^{N-1} x[j] cos(pi*(2j+1)*k / (2N))
 * ```
 *
 * matching the transform the reference implementation plans with
 * `FFTW_REDFT10`, so per-mode constants carry over from it directly.
 *
 * `inverse` is `REDFT01` (DCT-III) along each axis, divided by `prod(2*N_d)` so
 * that `inverse(forward(x)) === x`. FFTW's own round trip is `2N` per dimension;
 * all of that normalization lives on the inverse side, and none of it on the
 * forward side. The split is arbitrary as far as the modal update is concerned —
 * modes and forcing terms are scaled identically, and the update relates them
 * with a scale-free coefficient — so it is chosen here to keep `forward`
 * bit-comparable with the reference rather than to look symmetric. (The
 * reference instead splits its scaling `2*sqrt(2WH)` / `sqrt(2WH)` across the
 * two directions, which multiplies out to the same `prod(2*N_d)`.)
 *
 * ## Memory layout
 *
 * Row-major with the **first axis contiguous**:
 *
 * ```
 * index = x + nx*(y + ny*z)     for dims [nx, ny, nz]
 * ```
 *
 * This matches the reference's `values[y*width + x]` indexing and the voxel grid
 * of plan Phase 2. It is a contract between phases, so changing it means
 * changing them together.
 *
 * Any rank is accepted. 2D ARD is `[nx, ny]`, 3D is `[nx, ny, nz]`, and an axis
 * of length 1 is handled correctly (`REDFT10` degenerates to a factor of 2 and
 * `REDFT01` to the identity), so a slab partition needs no special casing.
 *
 * Input and output buffers may alias: the first axis pass reads the source and
 * writes the destination, and later passes work inside the destination.
 */

import { createComplexFftPlan, type ComplexFftPlan } from './fft';

/**
 * A prepared separable DCT for one fixed grid.
 *
 * **Not re-entrant.** A plan owns mutable line scratch, and shares one
 * {@link ComplexFftPlan} between axes of equal length, so a single instance must
 * not have two transforms in flight at once: no overlapping `forward` /
 * `inverse` calls, and no sharing between concurrent callers. Giving each axis
 * its own FFT would not change this — the line scratch is shared regardless —
 * so the rule is one plan per sequential user. Plans are plain class instances
 * and do not survive `postMessage`, so a worker builds its own.
 */
export interface DctPlan {
  /** Grid extents, first axis contiguous. Frozen. */
  readonly dims: readonly number[];
  /** Total number of samples, `prod(dims)`. */
  readonly size: number;
  /** DCT-II (`REDFT10`) along every axis. `values` is not modified unless it aliases `modes`. */
  forward(values: Float64Array, modes: Float64Array): void;
  /** Normalized DCT-III (`REDFT01`) along every axis — the exact inverse of `forward`. */
  inverse(modes: Float64Array, values: Float64Array): void;
}

/** Per-axis tables: the Makhoul rotation plus the FFT of that axis's length. */
interface AxisPlan {
  n: number;
  /** Elements between successive samples along this axis. */
  stride: number;
  /** Number of independent lines before this axis (equals `stride`). */
  inner: number;
  /** Number of independent line groups after this axis. */
  outer: number;
  /** cos(pi*k / (2N)) */
  rotCos: Float64Array;
  /** sin(pi*k / (2N)) */
  rotSin: Float64Array;
  fft: ComplexFftPlan;
}

class SeparableDctPlan implements DctPlan {
  readonly dims: readonly number[];
  readonly size: number;
  private readonly axes: AxisPlan[];
  private readonly scratchRe: Float64Array;
  private readonly scratchIm: Float64Array;
  private readonly inverseScale: number;

  constructor(dims: readonly number[]) {
    // Frozen: the extents are baked into `axes`, `size` and the FFT plans below,
    // so a mutated copy would silently disagree with the plan it describes.
    this.dims = Object.freeze(dims.slice());

    let size = 1;
    for (const n of dims) size *= n;
    this.size = size;

    // One FFT plan per distinct length — a cube reuses a single plan.
    const fftByLength = new Map<number, ComplexFftPlan>();
    const rotByLength = new Map<number, { rotCos: Float64Array; rotSin: Float64Array }>();

    this.axes = [];
    let stride = 1;
    let inverseScale = 1;
    for (let d = 0; d < dims.length; d++) {
      const n = dims[d];

      let fft = fftByLength.get(n);
      if (!fft) {
        fft = createComplexFftPlan(n);
        fftByLength.set(n, fft);
      }

      let rot = rotByLength.get(n);
      if (!rot) {
        const rotCos = new Float64Array(n);
        const rotSin = new Float64Array(n);
        for (let k = 0; k < n; k++) {
          const angle = (Math.PI * k) / (2 * n);
          rotCos[k] = Math.cos(angle);
          rotSin[k] = Math.sin(angle);
        }
        rot = { rotCos, rotSin };
        rotByLength.set(n, rot);
      }

      this.axes.push({
        n,
        stride,
        inner: stride,
        outer: size / (n * stride),
        rotCos: rot.rotCos,
        rotSin: rot.rotSin,
        fft,
      });

      stride *= n;
      inverseScale *= 2 * n;
    }

    this.inverseScale = 1 / inverseScale;

    let longest = 1;
    for (const n of dims) longest = Math.max(longest, n);
    this.scratchRe = new Float64Array(longest);
    this.scratchIm = new Float64Array(longest);
  }

  forward(values: Float64Array, modes: Float64Array): void {
    this.assertSizes(values, modes);
    for (let d = 0; d < this.axes.length; d++) {
      // Only the first pass reads the caller's input; the rest work in place.
      this.forwardAxis(this.axes[d], d === 0 ? values : modes, modes);
    }
  }

  inverse(modes: Float64Array, values: Float64Array): void {
    this.assertSizes(values, modes);
    for (let d = 0; d < this.axes.length; d++) {
      this.inverseAxis(this.axes[d], d === 0 ? modes : values, values);
    }
    const scale = this.inverseScale;
    if (scale !== 1) {
      for (let i = 0; i < values.length; i++) values[i] *= scale;
    }
  }

  private assertSizes(values: Float64Array, modes: Float64Array): void {
    if (values.length !== this.size || modes.length !== this.size) {
      throw new Error(
        `DCT plan is ${this.dims.join('x')} (${this.size} samples); got ` +
          `${values.length} and ${modes.length}`,
      );
    }
  }

  /**
   * DCT-II along one axis, by Makhoul's method: reorder the line so the even
   * samples run forwards and the odd samples run backwards, take a length-N
   * complex FFT, then rotate by exp(-i*pi*k/(2N)) and keep twice the real part.
   */
  private forwardAxis(axis: AxisPlan, src: Float64Array, dst: Float64Array): void {
    const { n, stride, inner, outer, rotCos, rotSin, fft } = axis;
    const re = this.scratchRe;
    const im = this.scratchIm;
    const halfUp = (n + 1) >> 1;
    const halfDown = n >> 1;
    const block = n * stride;

    for (let o = 0; o < outer; o++) {
      const outerBase = o * block;
      for (let i = 0; i < inner; i++) {
        const base = outerBase + i;

        for (let j = 0; j < halfUp; j++) re[j] = src[base + 2 * j * stride];
        for (let j = 0; j < halfDown; j++) re[n - 1 - j] = src[base + (2 * j + 1) * stride];
        im.fill(0, 0, n);

        fft.forward(re, im);

        for (let k = 0; k < n; k++) {
          dst[base + k * stride] = 2 * (re[k] * rotCos[k] + im[k] * rotSin[k]);
        }
      }
    }
  }

  /**
   * DCT-III along one axis — the same route run backwards. `REDFT01` is
   * `2N` times the inverse of `REDFT10`, so rebuild the FFT spectrum from the
   * cosine coefficients, invert, and undo the even/odd reordering. The `2N`
   * factor and the FFT's own `1/N` cancel down to the single factor of 2 below;
   * the remaining `prod(2*N_d)` is divided out once in `inverse`.
   */
  private inverseAxis(axis: AxisPlan, src: Float64Array, dst: Float64Array): void {
    const { n, stride, inner, outer, rotCos, rotSin, fft } = axis;
    const re = this.scratchRe;
    const im = this.scratchIm;
    const halfUp = (n + 1) >> 1;
    const halfDown = n >> 1;
    const block = n * stride;

    for (let o = 0; o < outer; o++) {
      const outerBase = o * block;
      for (let i = 0; i < inner; i++) {
        const base = outerBase + i;

        // Z[k] = (Y[k] - i*Y[N-k]) * exp(+i*pi*k/(2N)) / 2, with Y[N] = 0.
        // The whole line is read into scratch before anything is written back,
        // which is what makes an aliased src/dst safe.
        for (let k = 0; k < n; k++) {
          const a = src[base + k * stride];
          const b = k === 0 ? 0 : src[base + (n - k) * stride];
          const c = rotCos[k];
          const s = rotSin[k];
          re[k] = 0.5 * (a * c + b * s);
          im[k] = 0.5 * (a * s - b * c);
        }

        fft.inverseUnscaled(re, im);

        for (let j = 0; j < halfUp; j++) dst[base + 2 * j * stride] = 2 * re[j];
        for (let j = 0; j < halfDown; j++) dst[base + (2 * j + 1) * stride] = 2 * re[n - 1 - j];
      }
    }
  }
}

/**
 * Build a reusable DCT plan for a grid of the given extents (first axis
 * contiguous). Tables and scratch are allocated here so that `forward` and
 * `inverse` allocate nothing; create one plan per partition and keep it for the
 * life of the simulation — but see {@link DctPlan} on re-entrancy before
 * sharing one between concurrent callers.
 */
export function createDctPlan(dims: readonly number[]): DctPlan {
  if (dims.length === 0) throw new Error('DCT plan needs at least one axis');
  for (const n of dims) {
    if (!Number.isInteger(n) || n < 1) {
      throw new Error(`DCT extents must be positive integers, got [${dims.join(', ')}]`);
    }
  }
  return new SeparableDctPlan(dims);
}
