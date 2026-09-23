/**
 * The ARD interior solver: exact per-mode advance in a cosine basis.
 *
 * Inside a rectangular, rigid-walled air region the wave equation
 * `∂²p/∂t² = c²∇²p + F` diagonalizes in the Neumann (cosine) eigenbasis. Each
 * mode is then an independent forced harmonic oscillator, which can be advanced
 * **exactly** over a step of any size:
 *
 * ```
 * M[k]^{n+1} = 2 M[k]^n cos(ω_k Δt) − M[k]^{n−1} + (2 F̃[k] / ω_k²)(1 − cos(ω_k Δt))
 * ```
 *
 * with
 *
 * ```
 * ω_k = c π sqrt( (kx/Lx)² + (ky/Ly)² + (kz/Lz)² ),   L_d = n_d · dx
 * ```
 *
 * There is no numerical dispersion inside a partition and no CFL limit — the
 * scheme is unconditionally stable, because every mode is an exact oscillator
 * and `|cos(ω Δt)| ≤ 1` regardless of `Δt`. That is the whole point of ARD, and
 * it is why the time step is set by the source bandwidth instead.
 *
 * ## Two corrections to the reference
 *
 * **Mode indices start at 0.** The reference loops `i = 1..height`, `j = 1..width`
 * and stores at `(i−1)·width + (j−1)`, so every mode is assigned the frequency
 * of the next mode up and the DC mode (`ω = 0`) is given a non-zero frequency.
 * For the lowest modes that is a 100% error (plan §1.5 item 4). Here `k` runs
 * from 0, and the DC mode takes the `ω → 0` limit of the forcing coefficient:
 * `2(1 − cos ωΔt)/ω² → Δt²`. It is precomputed into `forceCoef`, so the hot
 * loop has no branch and never divides by zero.
 *
 * **No artificial damping.** The reference multiplies the whole modal update by
 * `0.999` every step, which at its own sample rate is −387 dB/s — an imposed
 * T60 of ~0.155 s regardless of materials, masked only because it stops after
 * 0.25 s (plan §1.5 item 5). Decay here comes from boundary absorption and air
 * attenuation, which is where it belongs.
 */

import { createDctPlan, type DctPlan } from './dct';
import { PartitionBase, type PartitionParams } from './partition';

export class DctPartition extends PartitionBase {
  readonly kind = 'dct' as const;
  /** A DCT partition's walls are rigid, so the residual must cancel the mirror. */
  readonly includeSelfTerms = true;

  readonly pressure: Float64Array;

  private readonly plan: DctPlan;
  /** Modal amplitudes at step n. */
  private modes: Float64Array;
  /** Modal amplitudes at step n−1. Reused as the write target, then swapped. */
  private prevModes: Float64Array;
  private readonly forceModes: Float64Array;

  /** cos(ω_k Δt), per mode. */
  private readonly cosWdt: Float64Array;
  /** 2(1 − cos ω_k Δt)/ω_k², per mode; Δt² at the DC mode. */
  private readonly forceCoef: Float64Array;

  constructor(params: PartitionParams) {
    super(params);

    this.plan = createDctPlan(this.dims);
    this.pressure = new Float64Array(this.size);
    this.modes = new Float64Array(this.size);
    this.prevModes = new Float64Array(this.size);
    this.forceModes = new Float64Array(this.size);

    this.cosWdt = new Float64Array(this.size);
    this.forceCoef = new Float64Array(this.size);

    const { nx, ny, nz, dx, c, dt } = this;
    // Domain length along each axis. The DCT-II/III basis is cell-centred —
    // basis function k samples cos(kπx/L) at x = (j + ½)dx — so L is n·dx, not
    // (n − 1)·dx.
    const lx = nx * dx;
    const ly = ny * dx;
    const lz = nz * dx;

    for (let kz = 0; kz < nz; kz++) {
      const fz = kz / lz;
      for (let ky = 0; ky < ny; ky++) {
        const fy = ky / ly;
        const rowBase = nx * (ky + ny * kz);
        for (let kx = 0; kx < nx; kx++) {
          const fx = kx / lx;
          const w = c * Math.PI * Math.sqrt(fx * fx + fy * fy + fz * fz);
          const i = rowBase + kx;
          const cw = Math.cos(w * dt);
          this.cosWdt[i] = cw;
          // The ω → 0 limit is Δt²: 2(1 − cos ωΔt)/ω² → 2(ω²Δt²/2)/ω².
          this.forceCoef[i] = w > 0 ? (2 * (1 - cw)) / (w * w) : dt * dt;
        }
      }
    }
  }

  step(): void {
    const { plan, force, forceModes, cosWdt, forceCoef, size } = this;

    // F̃ = DCT(F)
    plan.forward(force, forceModes);

    // Write M^{n+1} over prevModes, which holds M^{n−1} and is not needed
    // afterwards. Each index is read before it is written, so this is safe.
    const modes = this.modes;
    const prev = this.prevModes;
    for (let i = 0; i < size; i++) {
      prev[i] = 2 * modes[i] * cosWdt[i] - prev[i] + forceModes[i] * forceCoef[i];
    }
    this.modes = prev;
    this.prevModes = modes;

    // p = iDCT(M^{n+1})
    plan.inverse(this.modes, this.pressure);

    this.clearForce();
  }

  /**
   * Conserved modal energy.
   *
   * Not `Σ (M^n)²` — that oscillates, because each mode is an oscillator. The
   * recurrence `x_{n+1} = 2λ x_n − x_{n−1}` with `λ = cos(ω Δt)` has the exact
   * invariant
   *
   * ```
   * E = x_n² + x_{n−1}² − 2λ x_n x_{n−1}
   * ```
   *
   * (substitute and the cross terms cancel), which reduces to the usual
   * `½(v² + ω²x²)` in the small-Δt limit. Summed over modes this is constant to
   * rounding once forcing stops, and is what `__tests__/partition.spec.ts`
   * checks over 10,000 steps.
   */
  modalEnergy(): number {
    let sum = 0;
    for (let i = 0; i < this.size; i++) {
      const a = this.modes[i];
      const b = this.prevModes[i];
      sum += a * a + b * b - 2 * this.cosWdt[i] * a * b;
    }
    return sum;
  }

  /** Angular frequency of a mode, for tests and diagnostics. */
  angularFrequency(kx: number, ky = 0, kz = 0): number {
    const fx = kx / (this.nx * this.dx);
    const fy = ky / (this.ny * this.dx);
    const fz = kz / (this.nz * this.dx);
    return this.c * Math.PI * Math.sqrt(fx * fx + fy * fy + fz * fz);
  }

  /**
   * Largest `ω Δt` over all modes. The update is stable for any value, but
   * modes past π are temporally aliased and carry no useful signal. At
   * Courant 0.5 this stays below π in 1D, 2D and 3D.
   */
  maxPhaseAdvance(): number {
    return this.angularFrequency(this.nx - 1, this.ny - 1, this.nz - 1) * this.dt;
  }

  /** Seed the field directly, for tests and initial conditions. */
  setPressure(values: ArrayLike<number>): void {
    if (values.length !== this.size) {
      throw new Error(`Expected ${this.size} samples, got ${values.length}`);
    }
    this.pressure.set(values);
    this.plan.forward(this.pressure, this.modes);
    this.prevModes.set(this.modes);
  }
}
