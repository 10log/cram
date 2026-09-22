/**
 * Plain 6th-order finite-difference partition.
 *
 * Two jobs. It covers regions the decomposition cannot give to a DCT partition
 * (boxes too thin for the 3-cell interface layer), and — more importantly for
 * now — it is a numerically independent solver for the same equation, so
 * agreement between it and {@link DctPartition} on identical input is real
 * evidence that the modal update is right rather than merely self-consistent.
 *
 * ```
 * p^{n+1} = 2pⁿ − p^{n−1} + Δt²( c²∇²pⁿ + F )
 * ∇²p    ≈ Σ_axes Σ_k STENCIL[k] p[i + k − 3] / (180 dx²)
 * ```
 *
 * Unlike the DCT partition this **is** CFL-limited. Von Neumann analysis of the
 * 6th-order symbol `[4cos3θ − 54cos2θ + 540cosθ − 490]/180` gives a worst case
 * of −6.0444 per axis, and `p^{n+1} = 2pⁿ − p^{n−1} + C²Ŝpⁿ` is stable while
 * `C²·|Ŝ| ≤ 4`, so
 *
 * ```
 * C ≤ sqrt(4 / (6.0444 · rank))   →   0.813 (1D), 0.575 (2D), 0.470 (3D)
 * ```
 *
 * **Courant 0.5 is therefore unstable for a 3D FDTD partition**, even though the
 * plan uses it as the default and it is perfectly safe for DCT partitions, which
 * have no CFL limit at all. The constructor throws rather than letting a 3D
 * partition quietly diverge. {@link cflLimit} reports the bound.
 *
 * Out-of-range taps read zero rather than mirroring, matching the reference's
 * `getIdx` sentinel. That is why `includeSelfTerms` is `false`: the stencil
 * already behaves as though the neighbouring partition contributed nothing, so
 * the interface residual supplies only the true across-boundary values and must
 * not also cancel a mirror that was never applied.
 *
 * The `Δt²( c²∇²p + F )` grouping is deliberate — see the forcing-term note in
 * `partition.ts`. The reference writes `c²Δt²(∇²p + F)`, which multiplies the
 * interface forcing by `c²` a second time; invisible at its `c = 1`, wrong by
 * ~10⁵ at 343 m/s.
 */

import {
  PartitionBase,
  STENCIL_6TH,
  STENCIL_6TH_DIV,
  type PartitionParams,
} from './partition';

/**
 * Most negative value of the 6th-order stencil's Fourier symbol, at θ = π:
 * `|[4cos3θ − 54cos2θ + 540cosθ − 490]/180| = 1088/180`.
 */
const WORST_CASE_SYMBOL = 1088 / 180;

export class FdtdPartition extends PartitionBase {
  readonly kind = 'fdtd' as const;
  /** Out-of-range taps read zero, so there is no mirror for the residual to cancel. */
  readonly includeSelfTerms = false;

  // The three time levels rotate every step, so `pressure` is a getter over
  // the current one rather than a fixed array.
  private p: Float64Array;
  private pNew: Float64Array;
  private pOld: Float64Array;

  get pressure(): Float64Array {
    return this.p;
  }

  constructor(params: PartitionParams) {
    super(params);
    this.p = new Float64Array(this.size);
    this.pNew = new Float64Array(this.size);
    this.pOld = new Float64Array(this.size);

    if (this.courant > this.cflLimit) {
      throw new Error(
        `FDTD partition is CFL-unstable: Courant ${this.courant.toFixed(3)} exceeds ` +
          `${this.cflLimit.toFixed(3)} for rank ${this.rank}. Reduce dt, or use a ` +
          `DctPartition, which has no CFL limit.`,
      );
    }
  }

  /** Number of axes with extent > 1. A 1-thick axis carries no derivative. */
  get rank(): number {
    return Math.max(
      1,
      (this.nx > 1 ? 1 : 0) + (this.ny > 1 ? 1 : 0) + (this.nz > 1 ? 1 : 0),
    );
  }

  /**
   * Stability bound on the Courant number — see the class comment.
   * 0.813 in 1D, 0.575 in 2D, 0.470 in 3D.
   */
  get cflLimit(): number {
    return Math.sqrt(4 / (WORST_CASE_SYMBOL * this.rank));
  }

  step(): void {
    const { nx, ny, nz, dx, c, dt, force, p, pOld, pNew } = this;

    const lapScale = 1 / (STENCIL_6TH_DIV * dx * dx);
    const c2dt2 = c * c * dt * dt;
    const dt2 = dt * dt;

    const strideY = nx;
    const strideZ = nx * ny;

    for (let z = 0; z < nz; z++) {
      for (let y = 0; y < ny; y++) {
        const rowBase = nx * (y + ny * z);
        for (let x = 0; x < nx; x++) {
          const i = rowBase + x;

          // An axis of extent 1 carries no second derivative. It must be
          // skipped entirely: with zero padding its stencil would collapse to
          // the centre tap alone and inject a spurious -490*p into the
          // Laplacian, so a 2D run (nz === 1) would solve the wrong equation.
          let lap = 0;
          for (let k = 0; k < 7; k++) {
            const o = k - 3;
            const coef = STENCIL_6TH[k];

            if (nx > 1) {
              const xo = x + o;
              if (xo >= 0 && xo < nx) lap += coef * p[i + o];
            }
            if (ny > 1) {
              const yo = y + o;
              if (yo >= 0 && yo < ny) lap += coef * p[i + o * strideY];
            }
            if (nz > 1) {
              const zo = z + o;
              if (zo >= 0 && zo < nz) lap += coef * p[i + o * strideZ];
            }
          }
          lap *= lapScale;

          pNew[i] = 2 * p[i] - pOld[i] + c2dt2 * lap + dt2 * force[i];
        }
      }
    }

    // Rotate: the buffer pOld just vacated becomes the next write target.
    this.pOld = p;
    this.p = pNew;
    this.pNew = pOld;

    this.clearForce();
  }

  /** Seed both time levels, for tests and initial conditions. */
  setPressure(values: ArrayLike<number>): void {
    if (values.length !== this.size) {
      throw new Error(`Expected ${this.size} samples, got ${values.length}`);
    }
    this.p.set(values);
    this.pOld.set(values);
  }
}
