/**
 * Frequency-dependent walls for the 2D FDTD scheme (#222): PFFDTD's
 * series-RLC branch boundary (`nb_update_bnl_fd`), in this scheme's terms.
 *
 * ## The update
 *
 * An air cell with a wall face of admittance `Y = Σ_b 1/(jωD_b + E_b + F_b/jω)`
 * sees that face as a rigid ghost, plus a flux through it. With `C` the
 * Courant number, `w` the face's staircase weight (#220), and each branch's
 * velocity `y_b` and its running integral `g_b` living at half steps:
 *
 * ```
 * v^{n+1} = v* − (C/2)·w·Σ_b (y_b^{n+½} + y_b^{n−½})
 * s = p^{n+1} − p^{n−1} = 2Ď(y⁺ − y⁻) + E(y⁺ + y⁻) + Ḟ(g⁺ + g⁻),   g⁺ = g⁻ + ½(y⁺ + y⁻)
 * ```
 *
 * Here `Ď = D/k` and `Ḟ = F·k` for time step `k`. The second line is the
 * branch law `k·ṗ = D·ẏ + E·y + F·∫y` centred at step n. It is linear in
 * `y⁺`, so `y⁺ = b·s + bd·y⁻ − 2bḞ·g⁻`, with `b = 1/(2Ď + E + ½Ḟ)` and
 * `bd = b·(2Ď − E − ½Ḟ)`. Substituting that into the first line leaves
 * `v^{n+1}` on both sides, which one divide solves: the same divide as
 * #219's centred loss, into which it folds. A single branch with `D = F = 0`
 * **is** #219's centred wall, since `(C/2)·(1/ξ)·s` equals
 * `C²·(γ/2)·s` at `γ = 1/(Cξ)`.
 *
 * ## One material per cell
 *
 * Branch state lives on the air cell, as PFFDTD keeps it on the boundary
 * node. Every RLC face of a cell shares the cell's pressure, so faces of one
 * material share one state, scaled by the sum of their weights. Where a cell
 * touches two different RLC materials (a corner where two surfaces meet),
 * **all** its RLC faces use the first one found, in the neighbour order
 * left, right, down, up. The GPU uses the same rule. That keeps the energy
 * exact at the cost of blurring a one-cell corner between two materials.
 *
 * ## Energy
 *
 * Multiplying through by `s` (see `energy.ts`), each cell adds
 * `½·(w/C)·Σ_b (Ď·y² + Ḟ·g²) ≥ 0` to the stored energy `H`, and loses
 * `(w/(4C))·Σ_b E·(y⁺ + y⁻)² ≥ 0` a step. Neither touches the kinetic
 * weight, which is what bounded the backward ghost at γ ≤ 1. So a wall
 * with any `D, E, F ≥ 0` is stable, with no cap and no split.
 */

import type { RlcBranch } from '../acoustics/rlc-admittance';

/** One material's branches, discretised for a time step. */
export interface RlcCoefficients {
  count: number;
  /** `1/(2Ď + E + ½Ḟ)` per branch. */
  b: Float64Array;
  /** `b·(2Ď − E − ½Ḟ)` per branch. */
  bd: Float64Array;
  /** `b·Ď` per branch. */
  bDh: Float64Array;
  /** `b·Ḟ` per branch. */
  bFh: Float64Array;
  /** `Σ b`. */
  beta: number;
  /** `Ď`, `E`, `Ḟ` per branch, for the energy. */
  Dh: Float64Array;
  E: Float64Array;
  Fh: Float64Array;
}

/**
 * Discretise a material's branches for time step `dt` (seconds). Refuses
 * a negative or non-finite coefficient, or a branch with all three at zero:
 * those are not passive branches, and the energy argument needs them to be.
 */
export function discretizeRlc(branches: readonly RlcBranch[], dt: number): RlcCoefficients {
  if (!(dt > 0)) throw new Error(`Time step must be positive, got ${dt}`);
  const n = branches.length;
  const c: RlcCoefficients = {
    count: n,
    b: new Float64Array(n),
    bd: new Float64Array(n),
    bDh: new Float64Array(n),
    bFh: new Float64Array(n),
    beta: 0,
    Dh: new Float64Array(n),
    E: new Float64Array(n),
    Fh: new Float64Array(n),
  };
  branches.forEach(({ D, E, F }, i) => {
    for (const [name, x] of [['D', D], ['E', E], ['F', F]] as const) {
      if (!(x >= 0) || !Number.isFinite(x)) {
        throw new Error(`Branch ${i} has ${name} = ${x}; a passive branch needs D, E, F ≥ 0`);
      }
    }
    if (D === 0 && E === 0 && F === 0) throw new Error(`Branch ${i} is empty`);
    const Dh = D / dt;
    const Fh = F * dt;
    const b = 1 / (2 * Dh + E + 0.5 * Fh);
    c.b[i] = b;
    c.bd[i] = b * (2 * Dh - E - 0.5 * Fh);
    c.bDh[i] = b * Dh;
    c.bFh[i] = b * Fh;
    c.beta += b;
    c.Dh[i] = Dh;
    c.E[i] = E;
    c.Fh[i] = Fh;
  });
  return c;
}

/**
 * RLC walls on a {@link Field2D}. A wall cell whose `wallMaterial` is ≥ 0 is
 * an RLC wall of that material, and its `channel` gain is ignored. Branch
 * state is per air cell, `branches` slots each.
 */
export interface RlcFieldState {
  materials: RlcCoefficients[];
  /** Per cell: RLC material index of a wall cell, −1 otherwise. */
  wallMaterial: Int32Array;
  /** Branch slots per cell: the most any material has. */
  branches: number;
  /** `y^{n+½}` per cell and branch, after a step. */
  velocity: Float64Array;
  /** `g^{n+½}` per cell and branch, after a step. */
  integral: Float64Array;
}

export function createRlcFieldState(
  size: number,
  materials: RlcCoefficients[],
): RlcFieldState {
  const branches = Math.max(1, ...materials.map((m) => m.count));
  return {
    materials,
    wallMaterial: new Int32Array(size).fill(-1),
    branches,
    velocity: new Float64Array(size * branches),
    integral: new Float64Array(size * branches),
  };
}

/**
 * Branch-state textures on the GPU (#222): two branches each, so up to
 * `2·RLC_TEXTURES` branches per material. The fitter gives one per octave
 * band, and the material database has eight.
 */
export const RLC_TEXTURES = 4;
export const RLC_MAX_BRANCHES = 2 * RLC_TEXTURES;

/**
 * The RLC materials a solver's walls use, each once. It hands out the index a
 * wall writes into the wallmap, and packs the coefficient texture the shaders
 * read.
 */
export class RlcMaterialTable {
  private readonly entries: { key: string; branches: RlcBranch[] }[] = [];

  /** Index of a material, adding it the first time it is seen. */
  indexFor(branches: readonly RlcBranch[]): number {
    if (branches.length === 0) throw new Error('A material with no branches is a rigid wall, not an RLC one');
    if (branches.length > RLC_MAX_BRANCHES) {
      throw new Error(`${branches.length} branches; the GPU carries at most ${RLC_MAX_BRANCHES}`);
    }
    const key = JSON.stringify(branches.map(({ D, E, F }) => [D, E, F]));
    const found = this.entries.findIndex((e) => e.key === key);
    if (found >= 0) return found;
    this.entries.push({ key, branches: branches.map((b) => ({ ...b })) });
    return this.entries.length - 1;
  }

  get size(): number {
    return this.entries.length;
  }

  /** Materials in index order, discretised for `dt`: the CPU mirror's `materials`. */
  coefficients(dt: number): RlcCoefficients[] {
    return this.entries.map((e) => discretizeRlc(e.branches, dt));
  }

  /**
   * RGBA texels `(b, bd, bDh, bFh)`, `RLC_MAX_BRANCHES` wide and one row per
   * material (at least one row, so the texture is never empty). Unused
   * branch slots are zero, which the shaders read as no branch.
   */
  texels(dt: number): Float32Array {
    const rows = Math.max(1, this.entries.length);
    const out = new Float32Array(4 * RLC_MAX_BRANCHES * rows);
    this.coefficients(dt).forEach((m, row) => {
      for (let k = 0; k < m.count; k++) {
        const at = 4 * (row * RLC_MAX_BRANCHES + k);
        out[at] = m.b[k];
        out[at + 1] = m.bd[k];
        out[at + 2] = m.bDh[k];
        out[at + 3] = m.bFh[k];
      }
    });
    return out;
  }
}

/** The wallmap's blue channel for a wall: its RLC material index plus one, or 0 for none. */
export function rlcWallmapChannel(material: number | null | undefined): number {
  return material != null && material >= 0 ? material + 1 : 0;
}
