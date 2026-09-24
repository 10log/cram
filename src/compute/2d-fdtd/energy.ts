/**
 * Discrete energy balance of the 2D FDTD scheme (#223), for the CPU mirror in
 * `wall-stencil.ts`.
 *
 * The suite used to find instabilities by running the field and watching
 * it. The γ = 1 surface mode (#199) turned up only when a 2D room was excited
 * with a checkerboard, after a single-cell analysis and a 1-D strip had both
 * called it stable. PFFDTD checks a conserved energy every step instead, and
 * this module provides the same check for CRAM's scheme.
 *
 * ## The scheme, as one equation
 *
 * With `v^n = p^n − p^{n−1}`, `λ² = courantSq`, damping `d`, and for an air
 * cell `i`, `stepField` computes
 *
 * ```
 * v^{n+1} − v^n = λ²·(L p^n)_i − λ²·B_i·v^n − (1 − d)·v^n − ½λ²·G_i·(v^{n+1} + v^n) + f_i
 * ```
 *
 * - `L` is the rigid-wall Laplacian: `(L p)_i = Σ (p_j − p_i)` over air
 *   neighbours `j`. A wall or off-grid neighbour contributes the cell's own
 *   pressure, so it has no edge. `L` is symmetric and negative semi-definite.
 * - `B_i` is the sum of the backward ghost shares of the cell's wall faces,
 *   `min(γ·w, maxGhostGain)`. Each face contributes `p − γ_b·v` in place of
 *   `p`, which is `−γ_b·v` more than a rigid face.
 * - `G_i` is the sum of the centred excesses (#219).
 * - `f_i` is an additive source, if any (see `stepField`'s `source`).
 *
 * ## The energy
 *
 * Multiply by `s_i = v_i^{n+1} + v_i^n = p_i^{n+1} − p_i^{n−1}` and sum over
 * the cells. `L` is symmetric, so `Σ s·Lp^n` telescopes to
 * `⟨p^{n+1}, Lp^n⟩ − ⟨p^n, Lp^{n−1}⟩`. The backward and damping terms are not
 * sign-definite as written. Splitting
 * `v^n = ½s − ½(v^{n+1} − v^n)` turns each into a loss `½·(·)·s²` plus a change
 * in a kinetic weight. What remains is exact:
 *
 * ```
 * H^{n+½} = ½ Σ_i a_i·(v_i^{n+1})²  −  ½ ⟨p^{n+1}, L p^n⟩,     a_i = (1 + d)/(2λ²) − ½B_i
 * H^{n+½} − H^{n−½} = −¼ Σ_i [ (1 − d)/λ² + B_i + G_i ]·s_i²  +  ½ Σ_i s_i·f_i / λ²
 * ```
 *
 * (Summing the update times `s` gives the identity for `2H`: loss
 * `½·[…]·s²`, work `s·f/λ²`. `H` carries the overall ½, so its flows carry it
 * too. These are exactly what {@link stepEnergyFlow} returns.)
 *
 * The first sum on the right is always ≤ 0. It is the energy the walls and
 * the damping remove, with the centred share entering as cleanly as PFFDTD's.
 * The second is the work the source does. So `H + E_lost − E_in` is constant
 * to rounding for **any** gains. That alone proves nothing about stability.
 *
 * ## Where stability comes from: `H` must be positive
 *
 * Write `−⟨p^{n+1}, Lp^n⟩ = Σ_edges (Dp^{n+1})(Dp^n)` and
 * `ab = ((a+b)/2)² − ((a−b)/2)²`. With `Σ_edges (Dv)² ≤ 2·Σ_i deg_i·v_i²`:
 *
 * ```
 * H ≥ ½ Σ_i [ a_i − ½·deg_i ]·v_i²  +  ½ Σ_edges (D p̄)²
 * ```
 *
 * `deg_i` counts the air neighbours. At the scheme's `λ² = ½` and `d = 1`,
 * `a_i − ½deg_i = ½·(k_i − B_i)`, where `k_i = 4 − deg_i` counts the wall
 * faces. So `H` is positive, and the scheme stable, while **each cell's
 * backward gains sum to no more than its wall faces**. That means `γ_b ≤ 1`
 * per face, which is the γ = 1 bound #199 found by experiment, and the reason
 * `MAX_GHOST_GAIN` sits just under it. Above that bound, `H + E_lost` is
 * still conserved, but `H` is indefinite. The field can then grow without
 * limit while `H` falls, which is what {@link energyMargin} and the tests
 * show.
 *
 * ## Scope
 *
 * This is the Float64 CPU mirror's energy. It certifies the scheme and the
 * mirror, not `height-map.frag` as the GPU runs it in float32 with the rest
 * offset. The two share their update line for line (the tiling tests pin
 * that), but rounding in float32 is not covered here.
 *
 * ## Conventions
 *
 * Energies are in the field's own units, pressure² per cell, with the
 * overall factor chosen so that a rigid room's `H` is its conserved
 * quantity. Wall cells carry no energy and are skipped.
 */

import { MAX_GHOST_GAIN, isWallChannel } from './impedance';
import type { Field2D } from './wall-stencil';

/**
 * Each air cell's backward and centred wall sums, `B_i` and `G_i`, its
 * air-neighbour count, and its RLC face weight and material (#222).
 */
function wallSums(field: Field2D, maxGhostGain: number) {
  const { nx, ny, channel, weightX, weightY, rlc } = field;
  const size = nx * ny;
  const backward = new Float64Array(size);
  const centred = new Float64Array(size);
  const degree = new Uint8Array(size);
  const rlcWeight = new Float64Array(size);
  const rlcMaterial = new Int32Array(size).fill(-1);
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const idx = j * nx + i;
      if (isWallChannel(channel[idx])) continue;
      for (let n = 0; n < 4; n++) {
        // Same neighbour order and clamping as stepField.
        const nb =
          n === 0 ? (i > 0 ? idx - 1 : idx)
          : n === 1 ? (i < nx - 1 ? idx + 1 : idx)
          : n === 2 ? (j > 0 ? idx - nx : idx)
          : (j < ny - 1 ? idx + nx : idx);
        const raw = channel[nb];
        if (raw > 0) {
          if (nb !== idx) degree[idx]++;
          continue;
        }
        if (rlc && rlc.wallMaterial[nb] >= 0) {
          // Same rule as stepField: the first RLC material met serves them all.
          rlcWeight[idx] += n < 2 ? weightX[nb] : weightY[nb];
          if (rlcMaterial[idx] < 0) rlcMaterial[idx] = rlc.wallMaterial[nb];
          continue;
        }
        const c = raw * (n < 2 ? weightX[nb] : weightY[nb]);
        backward[idx] += -Math.max(c, -maxGhostGain);
        centred[idx] += Math.max(-c - maxGhostGain, 0);
      }
    }
  }
  return { backward, centred, degree, rlcWeight, rlcMaterial };
}

/**
 * The stored energy `H^{n+½}` of a field whose `pressure` is `p^{n+1}` and whose
 * `velocity` is `p^{n+1} − p^n`, that is, the state `stepField` leaves.
 *
 * `courantSq`, `damping` and `maxGhostGain` must be the ones the field is
 * stepped with: the kinetic weight depends on all three.
 */
export function fieldEnergy(
  field: Field2D,
  courantSq: number,
  damping = 1,
  maxGhostGain = MAX_GHOST_GAIN,
): number {
  const { nx, ny, pressure, velocity, channel, rlc } = field;
  const { backward, rlcWeight, rlcMaterial } = wallSums(field, maxGhostGain);
  const kineticScale = (1 + damping) / (2 * courantSq);
  const courant = Math.sqrt(courantSq);
  let kinetic = 0;
  let potential = 0;
  let branches = 0;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const idx = j * nx + i;
      if (isWallChannel(channel[idx])) continue;
      const v = velocity[idx];
      kinetic += (kineticScale - 0.5 * backward[idx]) * v * v;
      if (rlc && rlcWeight[idx] > 0) {
        // The branches' own energy (#222): (w/C)·Σ (Ď·y² + Ḟ·g²), in the
        // same 2H units as the rest of this sum.
        const m = rlc.materials[rlcMaterial[idx]];
        const base = idx * rlc.branches;
        let e = 0;
        for (let k = 0; k < m.count; k++) {
          const y = rlc.velocity[base + k];
          const g = rlc.integral[base + k];
          e += m.Dh[k] * y * y + m.Fh[k] * g * g;
        }
        branches += (rlcWeight[idx] / courant) * e;
      }
      // Each air–air edge once, to the right and downward.
      const p = pressure[idx];
      const q = p - v;
      for (const nb of [i < nx - 1 ? idx + 1 : -1, j < ny - 1 ? idx + nx : -1]) {
        if (nb < 0 || isWallChannel(channel[nb])) continue;
        potential += (p - pressure[nb]) * (q - (pressure[nb] - velocity[nb]));
      }
    }
  }
  return 0.5 * (kinetic + potential + branches);
}

/**
 * What one step removed and added: `lost ≥ 0` through the walls and the
 * damping, and `input` from `source`.
 *
 * `previousVelocity` is the field's `velocity` before the step. The field
 * itself is the state after it. `source` is the same array `stepField`
 * was given, or absent.
 */
export function stepEnergyFlow(
  field: Field2D,
  previousVelocity: Float64Array,
  courantSq: number,
  damping = 1,
  maxGhostGain = MAX_GHOST_GAIN,
  source?: Float64Array,
  previousBranchVelocity?: Float64Array,
): { lost: number; input: number } {
  const { velocity, channel, rlc } = field;
  const { backward, centred, rlcWeight, rlcMaterial } = wallSums(field, maxGhostGain);
  if (rlc && !previousBranchVelocity) {
    throw new Error('A field with RLC walls needs the branch velocities from before the step');
  }
  const dampingLoss = (1 - damping) / courantSq;
  const courant = Math.sqrt(courantSq);
  let lost = 0;
  let input = 0;
  for (let idx = 0; idx < velocity.length; idx++) {
    if (isWallChannel(channel[idx])) continue;
    const s = velocity[idx] + previousVelocity[idx];
    lost += 0.5 * (dampingLoss + backward[idx] + centred[idx]) * s * s;
    if (source) input += (s * source[idx]) / courantSq;
    if (rlc && rlcWeight[idx] > 0) {
      // Branch resistance (#222): (w/(2C))·Σ E·(y⁺ + y⁻)² in 2H units.
      const m = rlc.materials[rlcMaterial[idx]];
      const base = idx * rlc.branches;
      let e = 0;
      for (let k = 0; k < m.count; k++) {
        const sum = rlc.velocity[base + k] + previousBranchVelocity![base + k];
        e += m.E[k] * sum * sum;
      }
      lost += (rlcWeight[idx] / (2 * courant)) * e;
    }
  }
  // The sums above are 2H's flows (see the module doc); H carries the ½.
  return { lost: 0.5 * lost, input: 0.5 * input };
}

/**
 * The smallest per-cell positivity margin `a_i − ½·deg_i` over the field's air
 * cells. When it is ≥ 0, `H` is bounded below by a sum of squares and the
 * scheme cannot grow. When it is negative, `H` is indefinite, and the
 * energy balance no longer rules growth out.
 *
 * At `λ² = ½`, `d = 1` this is `min ½·(k_i − B_i)`: wall faces minus backward
 * gain.
 */
export function energyMargin(
  field: Field2D,
  courantSq: number,
  damping = 1,
  maxGhostGain = MAX_GHOST_GAIN,
): number {
  const { backward, degree } = wallSums(field, maxGhostGain);
  const kineticScale = (1 + damping) / (2 * courantSq);
  let margin = Infinity;
  for (let idx = 0; idx < field.channel.length; idx++) {
    if (isWallChannel(field.channel[idx])) continue;
    margin = Math.min(margin, kineticScale - 0.5 * backward[idx] - 0.5 * degree[idx]);
  }
  return margin;
}
