/**
 * Issue #199: FDTD 2D walls read `Surface.absorption` instead of being
 * perfectly rigid, and the decay comes from the materials rather than from the
 * global `damping` sponge.
 *
 * The headline measurement here is the delivered absorption coefficient,
 * obtained the way an impedance tube does it: two probes near the wall, a
 * steady single tone, and the complex transfer function between them. Two
 * details of this scheme make a naive version of that measurement wrong, and
 * both bit during development:
 *
 * - The wall face is halfway between the boundary cell and its ghost, at
 *   `n - 0.5` in cell coordinates, not at the last cell.
 * - The front travels at the *group* velocity, which at `C = 1/√2` is well
 *   below `c` at short wavelengths — 0.577 cells/step at 4 cells per
 *   wavelength against 0.707 at 40. Opening the analysis window on the phase
 *   velocity measured a *rigid* wall as 0.38 absorbing, purely because the
 *   window opened before the wave arrived.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  AIR_CHANNEL,
  MAX_GHOST_GAIN,
  ghostGainForAbsorption,
  maxStableAbsorption,
  ghostGainFromChannel,
  isWallChannel,
  wallChannelFor,
  wallChannelForGhostGain,
} from '../impedance';
import { createField2D, stepField, wallGhostPressure } from '../wall-stencil';

/** The CFL locus this solver runs on: C = 1/√2, so courantSq = 1/2. */
const C = Math.SQRT1_2;
const C2 = 0.5;

/** Numerical wavenumber, from sin(ω/2) = C·sin(k/2). */
function numericalK(omega: number): number {
  return 2 * Math.asin(Math.min(1, Math.sin(omega / 2) / C));
}

/** dω/dk for the same relation. The front moves at this, not at C. */
function groupVelocity(omega: number): number {
  return (C * Math.cos(numericalK(omega) / 2)) / Math.cos(omega / 2);
}

/** ω that puts exactly `cells` grid cells in a wavelength. */
function omegaForCellsPerWavelength(cells: number): number {
  return 2 * Math.asin(C * Math.sin(Math.PI / cells));
}

/**
 * A 1-D tube: rigid at the left end, impedance at the right, driven by a soft
 * source. The 2-D stencil reduces to this exactly for a field with no
 * variation across the tube, so this measures the production update.
 */
function runTube(
  n: number, steps: number, gamma: number, src: number,
  probes: number[], drive: (t: number) => number,
) {
  const p = new Float64Array(n);
  const v = new Float64Array(n);
  const np = new Float64Array(n);
  const nv = new Float64Array(n);
  const out = probes.map(() => new Float64Array(steps));
  for (let t = 0; t < steps; t++) {
    for (let i = 0; i < n; i++) {
      const l = i > 0 ? p[i - 1] : p[i];
      const r = i < n - 1 ? p[i + 1] : wallGhostPressure(p[i], v[i], gamma);
      const vel = C2 * (l + r - 2 * p[i]) + v[i];
      nv[i] = vel;
      np[i] = p[i] + vel;
    }
    p.set(np);
    v.set(nv);
    p[src] += drive(t);
    for (let q = 0; q < probes.length; q++) out[q][t] = p[probes[q]];
  }
  return out;
}

type Cx = { re: number; im: number };
const mul = (a: Cx, b: Cx): Cx => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const sub = (a: Cx, b: Cx): Cx => ({ re: a.re - b.re, im: a.im - b.im });
const div = (a: Cx, b: Cx): Cx => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};
const expi = (t: number): Cx => ({ re: Math.cos(t), im: Math.sin(t) });
const magnitude = (a: Cx) => Math.hypot(a.re, a.im);

/**
 * Complex amplitude at `omega` over `[from, to)`, Hann windowed. The window
 * matters: a rectangular one lets the image at `-omega` leak in, and at |R| = 1
 * a 4% error reads as α = -0.08.
 */
function phasor(x: Float64Array, omega: number, from: number, to: number): Cx {
  let re = 0;
  let im = 0;
  const n = to - from;
  for (let t = from; t < to; t++) {
    const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * (t - from)) / n);
    re += w * x[t] * Math.cos(omega * t);
    im += w * x[t] * Math.sin(omega * t);
  }
  return { re, im };
}

/** Delivered absorption at normal incidence, by the two-probe method. */
function deliveredAbsorption(alpha: number, cellsPerWavelength: number): number {
  const n = 4000;
  const src = 2000;
  const steps = 6000;
  const p1 = 3900;
  const p2 = p1 - 5;
  const gamma = ghostGainForAbsorption(alpha, C);
  const omega = omegaForCellsPerWavelength(cellsPerWavelength);
  const drive = (t: number) => Math.min(1, t / 200) * Math.sin(omega * t);
  const [s1, s2] = runTube(n, steps, gamma, src, [p1, p2], drive);

  const k = numericalK(omega);
  // The wall face is between the last cell and its ghost.
  const d1 = n - 0.5 - p1;
  const d2 = n - 0.5 - p2;
  // Steady state is one round trip after the front reaches the far probe.
  const vg = groupVelocity(omega);
  const from = Math.ceil((p1 - src) / vg + (2 * d2) / vg) + 300;
  const to = Math.min(steps - 50, from + 1500);
  const P1 = phasor(s1, omega, from, to);
  const P2 = phasor(s2, omega, from, to);
  const outgoing = sub(mul(P2, expi(-k * d1)), mul(P1, expi(-k * d2)));
  const incoming = sub(mul(P1, expi(k * d2)), mul(P2, expi(k * d1)));
  const R = magnitude(div(outgoing, incoming));
  return 1 - R * R;
}

describe('Issue #199: FDTD 2D impedance walls', () => {
  describe('ghost gain', () => {
    it('is zero for a rigid wall, so nothing about a rigid room changes', () => {
      expect(ghostGainForAbsorption(0, C)).toBe(0);
      // The encoding a wall cell carried before this change was exactly 0, and
      // it still is — a project saved then reads back rigid, not undefined.
      expect(wallChannelForGhostGain(ghostGainForAbsorption(0, C))).toBe(0);
      expect(isWallChannel(0)).toBe(true);
      expect(isWallChannel(AIR_CHANNEL)).toBe(false);
    });

    it('is 1/(xi*C), rising with absorption', () => {
      // xi = (1 + sqrt(1-a)) / (1 - sqrt(1-a)); the branch matters — the
      // reciprocal would make a rigid wall the *most* absorbing one.
      for (const alpha of [0.1, 0.3, 0.5, 0.9]) {
        const r = Math.sqrt(1 - alpha);
        expect(ghostGainForAbsorption(alpha, C)).toBeCloseTo((1 - r) / ((1 + r) * C), 12);
      }
      let previous = -1;
      for (const alpha of [0, 0.05, 0.2, 0.4, 0.6, 0.8]) {
        const g = ghostGainForAbsorption(alpha, C);
        expect(g).toBeGreaterThan(previous);
        previous = g;
      }
    });

    it('clamps at the stability bound rather than diverging', () => {
      // Unclamped, a matched surface would ask for gamma = 1/C = 1.414, and
      // the field diverges above gamma = 1 — see the module comment.
      expect(ghostGainForAbsorption(1, C)).toBe(MAX_GHOST_GAIN);
      expect(MAX_GHOST_GAIN).toBeLessThan(1);
      const cap = maxStableAbsorption(C);
      expect(cap).toBeCloseTo(0.961, 3);
      expect(ghostGainForAbsorption(cap, C)).toBeCloseTo(MAX_GHOST_GAIN, 9);
      // Everything at or below the cap is untouched by the clamp.
      for (const alpha of [0.5, 0.8, 0.95, cap - 1e-6]) {
        const r = Math.sqrt(1 - alpha);
        expect(ghostGainForAbsorption(alpha, C)).toBeCloseTo((1 - r) / ((1 + r) * C), 12);
      }
      expect(() => maxStableAbsorption(0)).toThrow(/Courant/);
    });

    it('survives the channel round trip', () => {
      for (const alpha of [0, 0.25, 0.7, 1]) {
        const g = ghostGainForAbsorption(alpha, C);
        const channel = wallChannelForGhostGain(g);
        expect(isWallChannel(channel)).toBe(true);
        expect(ghostGainFromChannel(channel)).toBeCloseTo(g, 15);
      }
      expect(ghostGainFromChannel(AIR_CHANNEL)).toBe(0);
    });

    it('rejects a non-positive Courant number rather than dividing by it', () => {
      expect(() => ghostGainForAbsorption(0.3, 0)).toThrow(/Courant/);
      expect(() => ghostGainForAbsorption(0.3, -1)).toThrow(/Courant/);
    });

    it('clamps a bad absorption instead of throwing, unlike ARD', () => {
      // `alpha` arrives from a material lookup, so the geometrical path's
      // convention applies: out of range or non-finite behaves like an
      // unpainted wall. ARD throws on the same input because a solver
      // assembling partitions should fail loudly; a wall being drawn from a
      // surface should not take the field down with it.
      // Non-finite is a failed lookup, and falls back to rigid — including
      // `Infinity`, which is *not* read as "infinitely absorbing". The shared
      // mapping makes that choice; the alternative would turn a broken material
      // into the most absorbing surface in the room, which is the direction
      // that hides itself.
      for (const bad of [NaN, undefined as unknown as number, Infinity, -Infinity]) {
        expect([bad, ghostGainForAbsorption(bad, C)]).toEqual([bad, 0]);
      }
      // A finite value out of range clamps to the nearer end: below 0 is rigid,
      // above 1 is fully absorbing and then the stability bound.
      expect(ghostGainForAbsorption(-1, C)).toBe(0);
      expect(ghostGainForAbsorption(1.5, C)).toBe(MAX_GHOST_GAIN);
      // And the clamp reaches the sourcemap, so a bad material writes a wall
      // rather than a NaN channel that would poison every neighbouring cell.
      for (const bad of [NaN, -1, 1.5]) {
        const channel = wallChannelFor({ enabled: true, absorption: bad }, C);
        expect([bad, Number.isFinite(channel)]).toEqual([bad, true]);
        expect([bad, isWallChannel(channel)]).toEqual([bad, true]);
      }
    });
  });

  describe('what a wall writes into the sourcemap', () => {
    it('carries the wall\'s own absorption, not a fixed rigid value', () => {
      // The whole point of the change: two walls of different materials must
      // end up with different channel values on the same grid.
      const rigid = wallChannelFor({ enabled: true, absorption: 0 }, C);
      const soft = wallChannelFor({ enabled: true, absorption: 0.6 }, C);
      expect(rigid).toBe(0);
      expect(soft).toBeLessThan(0);
      expect(soft).not.toBe(rigid);
      expect(ghostGainFromChannel(soft)).toBeCloseTo(ghostGainForAbsorption(0.6, C), 15);
      // Monotone, so a more absorbing material never writes a more reflective
      // wall.
      let previous = 1;
      for (const absorption of [0, 0.2, 0.4, 0.6, 0.8]) {
        const channel = wallChannelFor({ enabled: true, absorption }, C);
        expect(channel).toBeLessThanOrEqual(previous);
        previous = channel;
      }
    });

    it('turns a disabled wall back into air', () => {
      expect(wallChannelFor({ enabled: false, absorption: 0.5 }, C)).toBe(AIR_CHANNEL);
      expect(isWallChannel(wallChannelFor({ enabled: false, absorption: 0 }, C))).toBe(false);
    });
  });

  describe('delivered absorption at normal incidence', () => {
    it('is exactly zero for a rigid wall, at every resolution', () => {
      // Not a tolerance: gamma = 0 makes the ghost the cell's own pressure, so
      // the boundary is lossless by construction. Anything else here means the
      // measurement is lying, and it is the control for the rows below.
      for (const cells of [20, 12, 8, 6, 4]) {
        expect(Math.abs(deliveredAbsorption(0, cells))).toBeLessThan(1e-3);
      }
    });

    it('tracks the requested coefficient, with the error growing as the grid coarsens', () => {
      // Measured tolerances, not aspirational ones: the ghost places dp/dt at
      // the cell centre rather than at the face, which is first order in dx.
      const tolerance: Record<number, number> = { 20: 0.01, 12: 0.02, 8: 0.035, 6: 0.06 };
      for (const cells of [20, 12, 8, 6]) {
        for (const alpha of [0.2, 0.5, 0.8]) {
          const delivered = deliveredAbsorption(alpha, cells);
          expect([cells, alpha, Math.abs(delivered - alpha) <= tolerance[cells]])
            .toEqual([cells, alpha, true]);
        }
      }
    });

    it('errs towards reflecting, never towards absorbing more than asked', () => {
      // A coarse grid should make a room too live, not too dead: over-delivering
      // absorption would be a silent energy leak, which is the failure mode #205
      // found in ART.
      for (const cells of [12, 8, 6, 4]) {
        for (const alpha of [0.2, 0.5, 0.8]) {
          const delivered = deliveredAbsorption(alpha, cells);
          expect([cells, alpha, delivered <= alpha + 1e-3]).toEqual([cells, alpha, true]);
          expect(delivered).toBeGreaterThan(0);
        }
      }
    });

    it('is passive: a wall never returns more energy than it receives', () => {
      for (const cells of [20, 12, 8, 6, 4]) {
        for (const alpha of [0, 0.1, 0.5, 1]) {
          expect([cells, alpha, deliveredAbsorption(alpha, cells) >= -1e-3])
            .toEqual([cells, alpha, true]);
        }
      }
    });
  });

  describe('stability', () => {
    it('clamps to a gain the surface mode is stable at', () => {
      // The single-cell recursion (pole 1 - C²γ) says γ < 4 and is wrong: the
      // mode that diverges is the checkerboard along the wall, which a
      // one-cell analysis cannot see. Measured bound is γ = 1.
      expect(ghostGainForAbsorption(1, C)).toBeLessThan(1);
    });

    it('decays the wall checkerboard instead of sustaining or growing it', () => {
      // The instability is a surface mode, so it has to be excited directly —
      // a point source leaves it at a level where 40,000 steps of slow growth
      // still look like nothing.
      const run = (gamma: number) => {
        const field = createField2D(48, 36);
        const channel = wallChannelForGhostGain(gamma);
        for (let j = 0; j < field.ny; j++) {
          for (let i = 0; i < field.nx; i++) {
            if (i === 0 || j === 0 || i === field.nx - 1 || j === field.ny - 1) {
              field.channel[j * field.nx + i] = channel;
            } else {
              field.pressure[j * field.nx + i] = (i + j) % 2 === 0 ? 0.5 : -0.5;
            }
          }
        }
        const scratch = {
          pressure: new Float64Array(field.pressure.length),
          velocity: new Float64Array(field.pressure.length),
        };
        for (let t = 0; t < 24000; t++) stepField(field, C2, 1, scratch);
        let worst = 0;
        for (const p of field.pressure) worst = Math.max(worst, Math.abs(p));
        return worst;
      };

      // At the clamp, and at the most absorbing wall the clamp allows.
      expect(run(MAX_GHOST_GAIN)).toBeLessThan(1e-3);
      expect(run(ghostGainForAbsorption(1, C))).toBeLessThan(1e-3);

      // And the bound is where it was measured: just above it the field is
      // gone within the same number of steps. Without this the clamp could be
      // set anywhere and nothing would notice.
      expect(run(1.01)).toBeGreaterThan(1e6);
    });
  });

  describe('the shader carries the same boundary as the CPU mirror', () => {
    // height-map.frag is the production path and nothing can run it headlessly,
    // so this is a text check — narrow, and aimed at the one expression that
    // would silently revert the walls to rigid.
    const frag = readFileSync(
      resolve(__dirname, '../shaders/height-map.frag'),
      'utf8',
    );

    it('applies the ghost on every one of the four neighbours', () => {
      for (const dir of ['u', 'd', 'r', 'l']) {
        expect(frag).toContain(`if (${dir}_wall <= 0.0) {`);
        expect(frag).toContain(`${dir}_pos = pos + ${dir}_wall * vel;`);
      }
      // `pos + channel * vel` is `pos - gamma * vel` because the channel holds
      // -gamma; the CPU mirror spells the same thing the other way round.
      expect(wallGhostPressure(3, 2, 0.25)).toBeCloseTo(3 + -0.25 * 2, 15);
    });

    it('no longer tests walls with equality, which would ignore gamma', () => {
      // `u_wall == 0.0` was the rigid-only test. Left in place it would treat
      // every absorbing wall as air and leak the field straight through.
      expect(frag).not.toMatch(/_wall\s*==\s*0\.0/);
    });
  });
});
