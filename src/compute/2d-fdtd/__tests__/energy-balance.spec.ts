/**
 * Issue #223: the discrete energy balance of the 2D FDTD scheme, checked on
 * the CPU mirror in Float64.
 *
 * Stability used to be tested by stepping a field and watching it. That is
 * how the γ = 1 wall surface mode (#199) was found, and only a checkerboard in
 * a 2D room found it. `energy.ts` derives the scheme's conserved energy `H`,
 * with walls and all. These tests show that:
 *
 * - `H + E_lost − E_in` is constant to rounding for every wall kind,
 * - walls only ever remove energy, and
 * - positivity of `H` is exactly the γ ≤ 1 bound #199 found by experiment.
 *
 * `energy.ts` is the passivity check for #219's centred walls here, and for
 * #222's frequency-dependent walls when they come.
 */

import { describe, expect, it } from 'vitest';
import { energyMargin, fieldEnergy, stepEnergyFlow } from '../energy';
import { MAX_GHOST_GAIN } from '../impedance';
import { createField2D, stepField, type Field2D } from '../wall-stencil';

const NX = 40;
const NY = 30;
/** The scheme's Courant number is 1/√2. */
const LAMBDA_SQ = 0.5;

/**
 * A room with a border wall and an L-shaped block inside it, so there are
 * convex and concave corners, where #199's mode lived. The air starts at
 * seeded random pressure and rest velocity. `gain(i, j)` gives each wall cell
 * its γ. With `weighted`, every wall cell also gets random staircase weights
 * (#220).
 */
function room(gain: (i: number, j: number) => number, weighted = false): Field2D {
  const field = createField2D(NX, NY);
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const idx = j * NX + i;
      const border = i === 0 || j === 0 || i === NX - 1 || j === NY - 1;
      const block =
        (i >= 12 && i < 18 && j >= 8 && j < 20) || (i >= 18 && i < 26 && j >= 14 && j < 18);
      if (border || block) {
        field.channel[idx] = -gain(i, j);
        if (weighted) {
          field.weightX[idx] = random();
          field.weightY[idx] = random();
        }
      } else {
        field.pressure[idx] = random() - 0.5;
      }
    }
  }
  return field;
}

interface RunOptions {
  steps: number;
  courantSq?: number;
  damping?: number;
  maxGhostGain?: number;
  source?: (step: number) => Float64Array | undefined;
}

/** Step a field and track `H`, the energy lost, and the energy put in. */
function run(field: Field2D, options: RunOptions) {
  const { steps, courantSq = LAMBDA_SQ, damping = 1, maxGhostGain = MAX_GHOST_GAIN } = options;
  const scratch = {
    pressure: new Float64Array(field.pressure.length),
    velocity: new Float64Array(field.pressure.length),
  };
  const initial = fieldEnergy(field, courantSq, damping, maxGhostGain);
  let lost = 0;
  let input = 0;
  let previous = initial;
  let worstBalance = 0;
  let worstRise = 0;
  let minEnergy = initial;
  for (let n = 0; n < steps; n++) {
    const before = field.velocity.slice();
    const source = options.source?.(n);
    stepField(field, courantSq, damping, scratch, maxGhostGain, source);
    const flow = stepEnergyFlow(field, before, courantSq, damping, maxGhostGain, source);
    expect(flow.lost).toBeGreaterThanOrEqual(0);
    lost += flow.lost;
    input += flow.input;
    const energy = fieldEnergy(field, courantSq, damping, maxGhostGain);
    worstBalance = Math.max(worstBalance, Math.abs(energy + lost - input - initial) / initial);
    worstRise = Math.max(worstRise, (energy - previous) / initial);
    minEnergy = Math.min(minEnergy, energy);
    previous = energy;
  }
  return { initial, final: previous, lost, input, worstBalance, worstRise, minEnergy };
}

describe('Issue #223: FDTD 2D energy balance', () => {
  it('conserves H in a rigid room to 1e-12 over 10⁴ steps', () => {
    const field = room(() => 0);
    const r = run(field, { steps: 10_000 });
    // Measured 1.2e-14.
    expect(r.worstBalance).toBeLessThan(1e-12);
    expect(r.lost).toBe(0);
    expect(Math.abs(r.final / r.initial - 1)).toBeLessThan(1e-12);
  });

  it('only loses energy through impedance walls, and accounts for every bit of it', () => {
    // Every regime of #219's split in one room: rigid, backward only, exactly
    // at MAX_GHOST_GAIN, and centred excesses of 1.55 and 7.05. Random
    // staircase weights on top (#220).
    const gains = [0, 0.3, MAX_GHOST_GAIN, 2.5, 8];
    const field = room((i, j) => gains[(i + 3 * j) % gains.length], true);
    expect(energyMargin(field, LAMBDA_SQ)).toBeGreaterThanOrEqual(0);
    const r = run(field, { steps: 10_000 });
    // Measured: balance 2.0e-14, and H never rose.
    expect(r.worstBalance).toBeLessThan(1e-12);
    expect(r.worstRise).toBeLessThanOrEqual(1e-14);
    // And the walls did absorb: the room is essentially silent.
    expect(r.final / r.initial).toBeLessThan(1e-6);
    expect(r.lost / r.initial).toBeCloseTo(1, 6);
  });

  it('accounts for the damping sponge and a smaller Courant number too', () => {
    const damped = run(room((i, j) => [0, 0.3][(i + j) % 2]), { steps: 3000, damping: 0.999 });
    expect(damped.worstBalance).toBeLessThan(1e-12);
    expect(damped.worstRise).toBeLessThanOrEqual(1e-14);
    const slower = run(room((i, j) => [0, 0.3, 2][(i + j) % 3]), { steps: 3000, courantSq: 0.4 });
    expect(slower.worstBalance).toBeLessThan(1e-12);
    expect(slower.worstRise).toBeLessThanOrEqual(1e-14);
  });

  it('balances a soft source: H + E_lost − E_in is constant', () => {
    const source = new Float64Array(NX * NY);
    const at = 5 * NX + 5;
    const r = run(room((i, j) => [0, 0.5][(i + j) % 2]), {
      steps: 3000,
      source: (n) => {
        source[at] = n < 200 ? 0.1 * Math.sin(0.2 * n) : 0;
        return source;
      },
    });
    expect(Math.abs(r.input)).toBeGreaterThan(1e-3 * r.initial);
    expect(r.worstBalance).toBeLessThan(1e-12);
  });

  describe('positivity is the γ ≤ 1 bound', () => {
    it('reads the margin off the gains, with no stepping', () => {
      // At λ² = ½ the margin is min ½·(wall faces − backward gain): 0 for
      // rigid walls (and interior cells), and −0.1 per face above γ = 1, so
      // −0.2 at a corner of γ = 1.2.
      expect(energyMargin(room(() => 0), LAMBDA_SQ)).toBe(0);
      expect(energyMargin(room(() => 0.99), LAMBDA_SQ, 1, Infinity)).toBe(0);
      expect(energyMargin(room(() => 1.2), LAMBDA_SQ, 1, Infinity)).toBeCloseTo(-0.2, 12);
      // #219's split keeps any gain inside the bound.
      expect(energyMargin(room(() => 8), LAMBDA_SQ)).toBe(0);
    });

    it('catches the #199 surface mode: past γ = 1 the backward ghost makes H go negative', () => {
      // The pure backward ghost at every gain (maxGhostGain = ∞), which is
      // the scheme before #219. The balance still holds: it is an identity.
      // What fails is positivity. H goes negative while the field is still
      // of order one, well before it blows up. That is the signal the
      // run-and-watch tests needed a checkerboard to find.
      for (const [gamma, negativeBy] of [[1.05, 60], [1.2, 25]] as const) {
        const r = run(room(() => gamma), { steps: negativeBy, maxGhostGain: Infinity });
        const at = { gamma, ...r };
        expect([at, r.minEnergy < 0]).toEqual([at, true]);
        expect([at, r.worstBalance < 1e-12]).toEqual([at, true]);
      }
      // Just inside the bound, the same room decays and H stays positive.
      const inside = run(room(() => 0.99), { steps: 3000, maxGhostGain: Infinity });
      expect(inside.minEnergy).toBeGreaterThan(0);
      expect(inside.worstRise).toBeLessThanOrEqual(1e-14);
    });
  });
});
