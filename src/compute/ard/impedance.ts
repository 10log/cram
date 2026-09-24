/**
 * Locally-reacting impedance boundaries — the room surface that costs no cells.
 *
 * Every partition solves with rigid (Neumann) walls. Phase 5 cancels the
 * fictitious ones between partitions with a residual forcing term; Phase 6
 * makes the real ones absorb by parking a PML slab outside each face. This is
 * the other way to make them absorb, and the one the plan's own Phases 5, 6, 8
 * and 10 each arrived at independently (reference [6], Bilbao 2013).
 *
 * The slab is expensive in three separate ways. It adds 2-5x the room's cells;
 * it runs an explicit stencil, so it is CFL-limited where a `DctPartition` is
 * not, and since every partition shares one `Δt` the wall sets the time step
 * for the *whole* simulation; and Phase 10 measured it taking **76-93%** of
 * step time. An impedance boundary removes the first and the third outright —
 * it is a forcing term on cells that already exist, touching only the three
 * behind each face — and loosens the second: it has a stability limit of its
 * own, measured below, but every value of it is above the slab's.
 *
 * ## The condition
 *
 * A locally-reacting surface of specific acoustic impedance `Z = ξρc` relates
 * normal particle velocity to pressure by `v_n = p/Z`. With the momentum
 * equation `ρ ∂v_n/∂t = −∂p/∂n` that is
 *
 * ```
 * ∂p/∂n + (1/(ξc)) ∂p/∂t = 0
 * ```
 *
 * whose normal-incidence pressure reflection coefficient is `R = (ξ−1)/(ξ+1)`.
 * Absorption is an energy ratio, so `α = 1 − R²` and the database's octave-band
 * `α` inverts straight to a `ξ`. `ξ` is real here: a resistive surface,
 * frequency-independent within a band. ARD already runs one simulation per
 * octave band (design decision D3), so per-band `α` is carried by the run, not
 * by the boundary model.
 *
 * ## How it is imposed: ghost cells, then the Phase 5 residual
 *
 * The DCT basis mirrors about the half-cell outside each face — `p[−1−k] =
 * p[k]`, which is exactly what makes the wall rigid. So a different boundary is
 * a different set of ghost values, and the correction is the same residual
 * Phase 5 already applies, with the neighbour's cells replaced by ghosts:
 *
 * ```
 * R(d) = Σ_{t=0}^{3−d} STENCIL[3 + d + t] · (ghost[t] − own[t])
 * F(d) = c² · R(d) / (180 · dx²)
 * ```
 *
 * At `ghost = own` the residual is identically zero and the face is rigid, so
 * the rigid case is reproduced *exactly*, not approximately.
 *
 * ## What the ghosts are
 *
 * Near a wall the 1D field is `p(x) = f(t + x/c) + R f(t − x/c)` with the wall
 * at `x = 0` and the room at `x > 0`. The mirror pair at depth `k` sits at
 * `±τ_k` in time, `τ_k = (k + ½)dx/c`. Writing `A = f(t+τ_k)`, `B = f(t−τ_k)`:
 *
 * ```
 * mirror_k = A + R·B          ghost_k = B + R·A
 * ```
 *
 * so `ghost − mirror = (R−1)(A−B)` and `d/dt(ghost + mirror) = (1+R)(A'+B')`.
 * Eliminating `f` to first order in `ωτ` gives one relation per depth:
 *
 * ```
 * ghost_k − p_k = −(τ_k/ξ) · d/dt(ghost_k + p_k)
 * ```
 *
 * which is the boundary condition itself at `k = 0`, and its continuation
 * outward for `k = 1, 2`. A backward difference makes it explicit:
 *
 * ```
 * β_k = τ_k/(ξ Δt) = (k + ½)/(ξ C)          C = cΔt/dx
 * ghost_k^n = [ (1−β_k)·p_k^n + β_k·s_k ] / (1 + β_k),   s_k = ghost_k^{n−1} + p_k^{n−1}
 * ```
 *
 * One stored number per ghost — three doubles per boundary cell, against a
 * slab's several fields over 4-20 cells of depth.
 *
 * The two limits come out exactly right, which is the reason to trust the
 * middle. `ξ → ∞` gives `β = 0` and `ghost = p`: the rigid mirror, bit for bit.
 * `ξ → 0` gives `ghost^n − ghost^{n−1} = −(p^n − p^{n−1})`, so `ghost = −p` from
 * rest: the odd mirror, which is the exact pressure-release boundary.
 *
 * ## Accuracy, measured against the PML it replaces
 *
 * In the frequency domain the exact ghost relation is
 * `ghost/mirror = (1 − i·tan(u)/ξ)/(1 + i·tan(u)/ξ)` with `u = ωτ_k`, and this
 * filter realizes the same form with `tan(u)` in place of `u`. That predicts a
 * drift with frequency, and a pre-warp `ξ·tan(u)/u` that would cancel it at a
 * chosen frequency. **The pre-warp was implemented and measured, and it makes
 * the boundary worse at every frequency** — the three ghost depths carry
 * stencil weights of opposite sign (270, −27, 2), so the delivered α is not
 * monotone in ξ across the band and no single scalar correction improves it.
 * It is not shipped. What is left is the plain mapping, whose error is
 * measured rather than predicted (1D normal incidence, Courant 0.4, delivered
 * α against requested):
 *
 * | cells/wavelength at 1 kHz | 125 Hz | 250 Hz | 500 Hz | 707 Hz | 1 kHz |
 * |---------------------------|--------|--------|--------|--------|-------|
 * | 6, α = 0.3                | 0.300  | 0.301  | 0.305  | 0.309  | 0.313 |
 * | 6, α = 0.7                | 0.700  | 0.702  | 0.706  | 0.710  | 0.710 |
 * | 4, α = 0.3                | 0.301  | 0.303  | 0.310  | 0.313  | 0.293 |
 * | 2.6, α = 0.3              | 0.302  | 0.306  | 0.312  | 0.278  | 0.119 |
 *
 * So: **within 0.013 of the requested coefficient wherever the grid resolves
 * the band at 4 cells per wavelength or better**, falling off below that. The
 * same rig run against a PML slab is worse everywhere — 0.611 for a requested
 * 0.7 at 6 cells per wavelength — and at 2.6 it stops being passive, measuring
 * α of −13 at thickness 8 and −52 at thickness 20: the slab returns more
 * energy than it received near the grid's spatial Nyquist. This boundary
 * cannot do that. The ghost filter is a contraction at every frequency,
 *
 * ```
 * |G/P|² − 1 ∝ 4β(cos ωΔt − 1) ≤ 0
 * ```
 *
 * so the ghost never exceeds the mirror it is built from, for any β ≥ 0.
 * {@link ARD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE} is the figure the driver warns
 * below.
 *
 * ## It does have a stability limit — a measured one, above the PML's
 *
 * The first draft of this module claimed none, on the grounds that nothing here
 * steps and a `DctPartition` is unconditionally stable. That is wrong: the
 * residual is feedback from the field onto itself, and past a Courant number
 * that depends on the absorption it diverges. Measured largest stable Courant
 * number, 800 steps from a broadband seed, three partition shapes:
 *
 * | α    | 1D (24)  | 2D (16x12) | 3D (16x12x10) |
 * |------|----------|------------|---------------|
 * | 0.05 | 0.950    | 0.700      | 0.625         |
 * | 0.20 | 0.850    | 0.675      | 0.600         |
 * | 0.40 | 0.750    | 0.625      | 0.600         |
 * | 0.60 | 0.700    | 0.600      | 0.600         |
 * | 0.80 | 0.625    | 0.575      | 0.575         |
 * | 0.95 | 0.575    | 0.550      | 0.575         |
 * | 1.00 | 0.525    | 0.525      | 0.550         |
 *
 * {@link impedanceCourantLimit} is a straight line under all of it, `0.55 −
 * 0.05α`, and — the point that survives — **every value of it is above the
 * PML's 0.446 on a 3D room**, by 12% at a perfect absorber and 23% at a rigid
 * one. So the slab's clamp is loosened rather than removed, on top of the cells
 * and the calibration curves that are removed outright.
 *
 * The margin is deliberately more than the fit needs. The sweep stepped the
 * Courant number by 0.025, so a row reading 0.600 means "stable at 0.600,
 * divergent at 0.625" — and it is one grid size per rank, so another shape
 * could plausibly land a rung lower. The line therefore sits **at least one
 * full rung under every measurement**, which is what
 * `__tests__/impedance.spec.ts` asserts, alongside the other half: that a run
 * *at* the line is stable. An earlier revision fitted `0.6 − 0.1α`, which
 * cleared every measurement but by only 3% at α = 0.2 — inside the sampling
 * grain, so not actually cleared at all.
 *
 * The accuracy tables above are stated at normal incidence, like the PML's,
 * because that is what a two-probe rig measures. A *material's* α is another
 * matter: the database holds random-incidence (Sabine) absorption, and
 * {@link impedanceForMaterialAbsorption} builds the wall whose diffuse-field
 * absorption equals it (#221). A locally-reacting surface does have the right
 * *angular* behaviour for a given ξ — reflection rising towards grazing as
 * `(ξcosθ − 1)/(ξcosθ + 1)` — which a graded-σ sponge does not, so this is the
 * better of the two at oblique incidence as well. Per-band α is carried by
 * ARD's one-run-per-octave-band structure (design decision D3), not by the
 * boundary model, which is real-valued and frequency-independent within a run.
 */

import { impedanceForAbsorption as sharedImpedanceForAbsorption } from '../acoustics/reflection-coefficient';
import {
  impedanceForRandomIncidenceAbsorption,
  maxRandomIncidenceAbsorption,
} from '../acoustics/random-incidence';
import { INTERFACE_DEPTH, addForceAtDepth, pressureAtDepth } from './interface';
import { Axis, STENCIL_6TH, STENCIL_6TH_DIV, type Partition } from './partition';

/** Normal-incidence pressure reflection coefficient of a real impedance. */
export function reflectionForImpedance(xi: number): number {
  if (!(xi >= 0)) throw new Error(`Impedance must be >= 0, got ${xi}`);
  if (!Number.isFinite(xi)) return 1;
  return (xi - 1) / (xi + 1);
}

/** Absorption coefficient of a real impedance, `1 − R²`. */
export function absorptionForImpedance(xi: number): number {
  const r = reflectionForImpedance(xi);
  return 1 - r * r;
}

/**
 * Impedance realizing an absorption coefficient.
 *
 * `α = 1 − R²` fixes `|R|` only, and both signs are physical: `ξ > 1` for a
 * surface stiffer than air and `ξ < 1` for a softer one. Materials in the
 * database are porous absorbers backed by structure, so the positive root is
 * the right one — and it is also the branch that degenerates to a rigid wall as
 * `α → 0`, which is what a caller asking for `α = 0` means.
 */
export function impedanceForAbsorption(alpha: number): number {
  if (!(alpha >= 0) || alpha > 1) {
    throw new Error(`Absorption coefficient must be in [0, 1], got ${alpha}`);
  }
  // Delegates rather than duplicating. `acoustics/reflection-coefficient.ts`
  // owns this mapping for the whole repository, so the geometrical solvers and
  // this one cannot drift apart about what a material is — which they did,
  // taking opposite roots, until issue #200. The validation stays here because
  // a solver assembling partitions should fail loudly on a bad coefficient,
  // where the geometrical path clamps in a hot loop.
  return sharedImpedanceForAbsorption(alpha);
}

/**
 * Impedance for a *material's* coefficient (#221).
 *
 * The database holds random-incidence (Sabine) absorption, so a wall is built
 * whose diffuse-field absorption is `alpha` in the dimensionality of the run:
 * Paris's formula in 3D, its half-plane form for a 2D slice, and plain
 * `1 − R(0)²` in 1D, where normal incidence is the only incidence there is.
 * {@link impedanceForAbsorption} stays the normal-incidence mapping — it is
 * what the boundary's own accuracy measurements are stated in.
 *
 * A negative or non-finite coefficient throws, for the same reason as there:
 * a solver assembling partitions should fail loudly on a broken material. A
 * coefficient above the model's maximum (0.951 in 3D) — including above 1,
 * which chamber data can reach — builds the most absorbing wall there is, as
 * the shared inverse and FDTD 2D do; the driver warns, see
 * {@link exceedsMaterialAbsorptionLimit}.
 */
export function impedanceForMaterialAbsorption(alpha: number, rank: number): number {
  if (!(alpha >= 0) || !Number.isFinite(alpha)) {
    throw new Error(`Absorption coefficient must be a finite number >= 0, got ${alpha}`);
  }
  if (rank <= 1) return sharedImpedanceForAbsorption(alpha);
  return impedanceForRandomIncidenceAbsorption(alpha, rank >= 3 ? 3 : 2);
}

/**
 * Whether a material asks for more diffuse-field absorption than a
 * locally-reacting wall can give in a run of this rank. Chamber data does,
 * routinely; the driver says so rather than silently delivering less.
 */
export function exceedsMaterialAbsorptionLimit(alpha: number, rank: number): boolean {
  if (rank <= 1) return false;
  return alpha > maxRandomIncidenceAbsorption(rank >= 3 ? 3 : 2);
}

/**
 * Cells per wavelength at which the mapping is still good to about 0.01 in α.
 *
 * Measured, not derived — see the table above. ARD's own default is 2.6, where
 * the top octave of a run sits at 77% of the grid's spatial Nyquist and the
 * delivered coefficient falls well short. The driver warns below this rather
 * than overriding the caller: the cost of a run scales as roughly the fourth
 * power of this number, so it is not a change to make on someone's behalf.
 */
export const ARD_CELLS_PER_WAVELENGTH_FOR_IMPEDANCE = 4;

/** Absorption at or below this is a rigid surface, and gets no boundary at all. */
export const RIGID_ALPHA_EPSILON = 1e-6;

/** Courant number the bound allows at α = 0, the least absorbing surface. */
export const IMPEDANCE_COURANT_INTERCEPT = 0.55;

/** How much of that a perfect absorber costs. */
export const IMPEDANCE_COURANT_SLOPE = 0.05;

/**
 * Largest Courant number an impedance boundary is stable at.
 *
 * `0.55 − 0.05α`, a straight line at least one sampling rung under every
 * measurement in the table above. `maxAbsorption` is the most absorbing surface in the
 * simulation, because every partition shares one time step and the boundary
 * that diverges first is the one that absorbs most.
 *
 * Compare `PML_CFL_MARGIN * vonNeumannCflLimit(3)` = 0.446, which a wall slab
 * imposes regardless of its material.
 */
export function impedanceCourantLimit(maxAbsorption: number): number {
  const alpha = Math.min(1, Math.max(0, maxAbsorption));
  return IMPEDANCE_COURANT_INTERCEPT - IMPEDANCE_COURANT_SLOPE * alpha;
}

export interface ImpedanceBoundaryParams {
  /** The partition whose face this is. */
  partition: Partition;
  axis: Axis;
  /** True when the face is the partition's high edge on `axis`. */
  high: boolean;
  /** Inclusive-exclusive global ranges on the two transverse axes. */
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
  /** Normalized specific acoustic impedance. `Infinity` is a rigid wall. */
  impedance: number;
}

/**
 * One rectangle of one partition face, carrying a locally-reacting impedance.
 *
 * `apply()` accumulates this face's residual into the partition's forcing
 * field. Call it once per step, in the same place as
 * {@link applyAllInterfaceForcing} — before the partitions step, from the
 * current pressure.
 */
export class ImpedanceBoundary {
  readonly partition: Partition;
  readonly axis: Axis;
  readonly high: boolean;
  readonly uMin: number;
  readonly uMax: number;
  readonly vMin: number;
  readonly vMax: number;
  readonly impedance: number;

  /** Ghost depths this face can actually read, `min(3, extent along axis)`. */
  readonly depth: number;

  /** `β_k` per ghost depth. */
  private readonly beta: Float64Array;
  /** `s_k = ghost_k^{n−1} + p_k^{n−1}`, one per ghost per face cell. */
  private readonly history: Float64Array;
  /** Scratch for the current cell's ghosts, so `apply` allocates nothing. */
  private readonly ghost: Float64Array;
  private readonly own: Float64Array;

  constructor(params: ImpedanceBoundaryParams) {
    const { partition, axis, high, uMin, uMax, vMin, vMax, impedance } = params;
    if (uMax <= uMin || vMax <= vMin) {
      throw new Error(
        `An impedance boundary needs a positive face area, got ` +
          `${uMax - uMin} x ${vMax - vMin}`,
      );
    }
    if (!(impedance > 0)) {
      throw new Error(
        `Impedance must be positive, got ${impedance}. A zero impedance is a ` +
          'pressure-release surface, which is not a room material.',
      );
    }

    this.partition = partition;
    this.axis = axis;
    this.high = high;
    this.uMin = uMin;
    this.uMax = uMax;
    this.vMin = vMin;
    this.vMax = vMax;
    this.impedance = impedance;

    const extent = [partition.box.w, partition.box.h, partition.box.d][axis];
    this.depth = Math.min(INTERFACE_DEPTH, extent);

    const courant = (partition.c * partition.dt) / partition.dx;
    this.beta = new Float64Array(INTERFACE_DEPTH);
    for (let k = 0; k < INTERFACE_DEPTH; k++) {
      // β_k = τ_k/(ξ Δt) with τ_k = (k + ½)dx/c, so the grid scale cancels and
      // only the Courant number survives. Infinity gives β = 0 — the exact
      // rigid mirror — rather than a NaN.
      this.beta[k] = Number.isFinite(this.impedance)
        ? (k + 0.5) / (this.impedance * courant)
        : 0;
    }

    this.history = new Float64Array(
      (uMax - uMin) * (vMax - vMin) * INTERFACE_DEPTH,
    );
    this.ghost = new Float64Array(INTERFACE_DEPTH);
    this.own = new Float64Array(INTERFACE_DEPTH);
  }

  /** Face cells this boundary covers. */
  get cellCount(): number {
    return (this.uMax - this.uMin) * (this.vMax - this.vMin);
  }

  /** Forget the filter state. A reused boundary must start from rest. */
  reset(): void {
    this.history.fill(0);
  }

  /** Accumulate this face's residual into the partition's forcing field. */
  apply(): void {
    const { partition, axis, high, depth, beta, history, ghost, own } = this;
    const scale = (partition.c * partition.c) / (STENCIL_6TH_DIV * partition.dx * partition.dx);
    const selfTerms = partition.includeSelfTerms;
    const uSpan = this.uMax - this.uMin;

    for (let gv = this.vMin; gv < this.vMax; gv++) {
      for (let gu = this.uMin; gu < this.uMax; gu++) {
        const base = ((gv - this.vMin) * uSpan + (gu - this.uMin)) * INTERFACE_DEPTH;

        for (let k = 0; k < INTERFACE_DEPTH; k++) {
          if (k >= depth) {
            ghost[k] = 0;
            own[k] = 0;
            continue;
          }
          const p = pressureAtDepth(partition, axis, high, k, gu, gv);
          const b = beta[k];
          const g = ((1 - b) * p + b * history[base + k]) / (1 + b);
          history[base + k] = g + p;
          ghost[k] = g;
          own[k] = selfTerms ? p : 0;
        }

        for (let d = 1; d <= depth; d++) {
          let r = 0;
          for (let t = 0; t + d <= INTERFACE_DEPTH; t++) {
            r += STENCIL_6TH[3 + d + t] * (ghost[t] - own[t]);
          }
          if (r !== 0) addForceAtDepth(partition, axis, high, d - 1, gu, gv, scale * r);
        }
      }
    }
  }
}

/** Apply every impedance boundary's residual. */
export function applyAllImpedanceForcing(
  boundaries: readonly ImpedanceBoundary[],
): void {
  for (const boundary of boundaries) boundary.apply();
}
