/**
 * Perfectly Matched Layer partition — an absorbing slab that terminates a face.
 *
 * Attached to a partition face, it lets waves leave without reflecting off the
 * end of the grid. It is also the mechanism `wall.ts` uses to realize a room
 * surface's absorption coefficient, by damping only partially.
 *
 * The update follows the reference's `PMLPartition::step` (after Marcus & Imbo),
 * with the damping applied along one axis:
 *
 * ```
 * p^{n+1} = 2pⁿ − p^{n−1} + Δt²[ c²∇²pⁿ + F − σ·ṗ + Σ_d ∂φ_d/∂x_d ]
 * φ_a^{n+1} = φ_a − Δt·σ·( φ_a + c² ∂p^{n+1}/∂x_a )        (the damped axis)
 * φ_e^{n+1} = φ_e + Δt·σ·c² ∂p^{n+1}/∂x_e                  (the others)
 * ```
 *
 * with `ṗ ≈ (pⁿ − p^{n−1})/Δt` and the 4th-order central first difference for
 * `∂/∂x`.
 *
 * ## Two departures from the reference
 *
 * **A graded profile instead of hand-tuned constants.** The reference uses
 * `kx = (20 − i)·kxMin/10` with `kxMin = 0.2` inside slabs it creates 40 cells
 * thick, plus a constant `0.05` cross-damping — magic numbers with no stated
 * derivation. Here `σ(t) = σmax·(t/L)^m` (default `m = 2`) grows from zero at
 * the interface to `σmax` at the outer face. Starting at zero is what matches
 * the layer to the domain: a step change in `σ` is itself an impedance
 * discontinuity and reflects.
 *
 * **One damped axis.** `axis` names it, and the other two are undamped. This
 * covers a slab attached to a face, which is the only way the solver builds
 * them. It does **not** cover a PML corner, where two slabs overlap and both
 * axes need damping; the reference papers over that case with its constant
 * `0.05` cross-term.
 *
 * A partition cannot detect a corner on its own — that needs the neighbour set,
 * which only the driver has — so nothing here rejects one. **Avoiding corners is
 * a Phase 6 contract**, not something this class enforces. Build two overlapping
 * slabs and you get two independently damped partitions and a wrong answer, with
 * no error.
 *
 * ## Stability
 *
 * The interior update is the same explicit 6th-order scheme as
 * {@link FdtdPartition}, so it carries the same CFL limit — and measurement
 * shows the damping terms tighten it slightly further. Largest stable Courant,
 * bisected over 2000 steps, as a fraction of the undamped von Neumann bound:
 *
 * | σ̂    | 1D    | 2D    | 3D    |
 * |-------|-------|-------|-------|
 * | 0.00  | 1.000 | 1.003 | 1.010 |
 * | 0.05  | 0.995 | 1.000 | 1.008 |
 * | 0.20  | 0.974 | 0.989 | 1.001 |
 *
 * So the plain FDTD bound is *optimistic* here by up to ~2.6%, not
 * conservative. {@link PML_CFL_MARGIN} applies a 5% margin, which covers the
 * whole measured range and still admits Courant 0.4 in 3D. Without the guard a
 * rank-3 wall slab at the plan's default Courant 0.5 diverges silently while
 * the DCT interior beside it — which has no CFL limit — looks perfectly
 * healthy, and the 1D calibration rig never sees it.
 *
 * ## Accuracy
 *
 * See `__tests__/wall.spec.ts` for measured reflection coefficients. The layer
 * reaches roughly `|R| ≈ 0.02` at 20 cells — good enough to terminate a domain,
 * and not the `1e-3` the plan optimistically assumed. `wall.ts` documents what
 * that means for absorption coefficients.
 */

import {
  Axis,
  FIRST_DERIV_4TH,
  FIRST_DERIV_4TH_DIV,
  PartitionBase,
  STENCIL_6TH,
  STENCIL_6TH_DIV,
  vonNeumannCflLimit,
  type PartitionParams,
} from './partition';

/**
 * Safety factor on the von Neumann bound for a damped layer. Measured worst
 * case across σ̂ ∈ [0, 0.2] and rank 1-3 is 0.974; 0.95 covers it with room.
 */
export const PML_CFL_MARGIN = 0.95;

export interface PmlPartitionParams extends PartitionParams {
  /** Axis the damping acts along — the normal of the face this slab terminates. */
  axis: Axis;
  /**
   * Whether `σ` grows toward increasing coordinate. `true` when the slab sits
   * on the high side of the partition it terminates (so `σ = 0` at its low
   * face, where the interface is).
   */
  increasing: boolean;
  /** Peak damping at the outer face, in s⁻¹. */
  sigmaMax: number;
  /** Grading exponent. 2 is the usual choice. */
  gradingExponent?: number;
}

export class PmlPartition extends PartitionBase {
  readonly kind = 'pml' as const;
  /** Like the FDTD partition, taps outside the array read zero — no mirror. */
  readonly includeSelfTerms = false;

  readonly axis: Axis;
  readonly sigmaMax: number;
  readonly gradingExponent: number;

  /** σ per cell along the damped axis. */
  private readonly sigma: Float64Array;

  // As in FdtdPartition: three rotating time levels plus a stable `pressure`
  // copied from the current one, so callers may hold the reference.
  readonly pressure: Float64Array;
  private p: Float64Array;
  private pNew: Float64Array;
  private pOld: Float64Array;
  private readonly phi: [Float64Array, Float64Array, Float64Array];
  private readonly phiNew: [Float64Array, Float64Array, Float64Array];

  constructor(params: PmlPartitionParams) {
    super(params);
    const { axis, increasing, sigmaMax, gradingExponent = 2 } = params;

    if (sigmaMax < 0) throw new Error(`sigmaMax must be >= 0, got ${sigmaMax}`);
    this.axis = axis;
    this.sigmaMax = sigmaMax;
    this.gradingExponent = gradingExponent;

    const n = this.dims[axis];
    this.sigma = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      // Depth into the slab from the interface face, normalized to [0, 1].
      const depth = increasing ? (i + 0.5) / n : (n - 0.5 - i) / n;
      this.sigma[i] = sigmaMax * Math.pow(depth, gradingExponent);
    }

    if (this.courant > this.cflLimit) {
      throw new Error(
        `PML partition is CFL-unstable: Courant ${this.courant.toFixed(3)} exceeds ` +
          `${this.cflLimit.toFixed(3)} for rank ${this.rank}. The damped 6th-order ` +
          `update carries the same limit as an FDTD partition, less a ${
            ((1 - PML_CFL_MARGIN) * 100).toFixed(0)
          }% margin. Reduce dt — a DctPartition interior has no CFL limit, so the ` +
          `wall slab, not the room, sets the time step.`,
      );
    }

    this.pressure = new Float64Array(this.size);
    this.p = new Float64Array(this.size);
    this.pNew = new Float64Array(this.size);
    this.pOld = new Float64Array(this.size);
    this.phi = [
      new Float64Array(this.size),
      new Float64Array(this.size),
      new Float64Array(this.size),
    ];
    this.phiNew = [
      new Float64Array(this.size),
      new Float64Array(this.size),
      new Float64Array(this.size),
    ];
  }

  /**
   * Stability bound on the Courant number: the von Neumann bound for the
   * explicit 6th-order update, less {@link PML_CFL_MARGIN} to cover the
   * tightening the damping terms cause. See the class comment for measurements.
   */
  get cflLimit(): number {
    return PML_CFL_MARGIN * vonNeumannCflLimit(this.rank);
  }

  /** σ at a given cell along the damped axis, for tests and diagnostics. */
  sigmaAt(i: number): number {
    return this.sigma[i] ?? 0;
  }

  private axisCoord(x: number, y: number, z: number): number {
    return this.axis === Axis.X ? x : this.axis === Axis.Y ? y : z;
  }

  step(): void {
    const { nx, ny, nz, dx, c, dt, force, p, pOld, pNew, phi, phiNew, sigma } = this;
    const strides = [1, nx, nx * ny];
    const extents = [nx, ny, nz];

    const lapScale = 1 / (STENCIL_6TH_DIV * dx * dx);
    const derivScale = 1 / (FIRST_DERIV_4TH_DIV * dx);
    const c2 = c * c;
    const dt2 = dt * dt;

    // Pass 1: pressure.
    for (let z = 0; z < nz; z++) {
      for (let y = 0; y < ny; y++) {
        const rowBase = nx * (y + ny * z);
        for (let x = 0; x < nx; x++) {
          const i = rowBase + x;
          const coord = [x, y, z];
          const s = sigma[this.axisCoord(x, y, z)];

          let lap = 0;
          let divPhi = 0;
          for (let d = 0; d < 3; d++) {
            // A collapsed axis carries no derivative; a box that is merely one
            // cell thick in a 3D room still does (#228).
            if (!this.activeAxes[d]) continue;
            const stride = strides[d];
            for (let k = 0; k < 7; k++) {
              const o = k - 3;
              const q = coord[d] + o;
              if (q >= 0 && q < extents[d]) lap += STENCIL_6TH[k] * p[i + o * stride];
            }
            for (let k = 0; k < 5; k++) {
              const o = k - 2;
              const q = coord[d] + o;
              if (q >= 0 && q < extents[d]) divPhi += FIRST_DERIV_4TH[k] * phi[d][i + o * stride];
            }
          }
          lap *= lapScale;
          divPhi *= derivScale;

          const pdot = (p[i] - pOld[i]) / dt;
          pNew[i] = 2 * p[i] - pOld[i] + dt2 * (c2 * lap + force[i] - s * pdot + divPhi);
        }
      }
    }

    // Pass 2: auxiliary fields, from the freshly written pressure.
    for (let z = 0; z < nz; z++) {
      for (let y = 0; y < ny; y++) {
        const rowBase = nx * (y + ny * z);
        for (let x = 0; x < nx; x++) {
          const i = rowBase + x;
          const coord = [x, y, z];
          const s = sigma[this.axisCoord(x, y, z)];

          for (let d = 0; d < 3; d++) {
            // Same rule as pass 1. On an active axis one cell thick the
            // centred first derivative has no centre tap and reads zero anyway.
            if (!this.activeAxes[d]) {
              phiNew[d][i] = 0;
              continue;
            }
            const stride = strides[d];
            let grad = 0;
            for (let k = 0; k < 5; k++) {
              const o = k - 2;
              const q = coord[d] + o;
              if (q >= 0 && q < extents[d]) grad += FIRST_DERIV_4TH[k] * pNew[i + o * stride];
            }
            grad *= derivScale;

            phiNew[d][i] =
              d === this.axis
                ? phi[d][i] - dt * s * (phi[d][i] + c2 * grad)
                : phi[d][i] + dt * s * c2 * grad;
          }
        }
      }
    }

    for (let d = 0; d < 3; d++) {
      const tmp = phi[d];
      phi[d] = phiNew[d];
      phiNew[d] = tmp;
    }

    this.pOld = p;
    this.p = pNew;
    this.pNew = pOld;
    this.pressure.set(this.p);

    this.clearForce();
  }

  scaleState(factor: number): void {
    for (let i = 0; i < this.size; i++) {
      this.p[i] *= factor;
      this.pOld[i] *= factor;
      this.pressure[i] *= factor;
    }
    // The auxiliary fields are part of the state too; leaving them unscaled
    // would let them keep driving a field that has been damped away.
    for (let d = 0; d < 3; d++) {
      const phi = this.phi[d];
      for (let i = 0; i < this.size; i++) phi[i] *= factor;
    }
  }

  /** Seed both time levels, for tests. */
  setPressure(values: ArrayLike<number>): void {
    if (values.length !== this.size) {
      throw new Error(`Expected ${this.size} samples, got ${values.length}`);
    }
    this.p.set(values);
    this.pOld.set(values);
    this.pressure.set(values);
  }
}
