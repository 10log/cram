/**
 * Issue #222: frequency-dependent (series-RLC) walls in the 2D FDTD CPU
 * mirror, checked for equivalence with #219, for passivity with #223's
 * energy balance, and for per-band decay in a single run.
 */

import { describe, expect, it } from 'vitest';
import { fitRlcToOctaveBands, type RlcBranch } from '../../acoustics/rlc-admittance';
import { impedanceForRandomIncidenceAbsorption } from '../../acoustics/random-incidence';
import { applySpectralWindow, nextPowerOfTwo, octaveBandWindows } from '../../ard/deconvolve';
import { energyMargin, fieldEnergy, stepEnergyFlow } from '../energy';
import { createRlcFieldState, discretizeRlc } from '../rlc-wall';
import { createField2D, stepField, type Field2D } from '../wall-stencil';

const C = Math.SQRT1_2;
const LAMBDA_SQ = 0.5;

function scratchFor(field: Field2D) {
  return {
    pressure: new Float64Array(field.pressure.length),
    velocity: new Float64Array(field.pressure.length),
  };
}

describe('Issue #222: RLC walls in the 2D FDTD scheme', () => {
  describe('discretisation', () => {
    it('refuses branches that are not passive', () => {
      expect(() => discretizeRlc([{ D: -1, E: 1, F: 0 }], 1e-4)).toThrow(/D = -1/);
      expect(() => discretizeRlc([{ D: 0, E: NaN, F: 0 }], 1e-4)).toThrow(/E = NaN/);
      expect(() => discretizeRlc([{ D: 0, E: 0, F: 0 }], 1e-4)).toThrow(/empty/);
      expect(() => discretizeRlc([{ D: 0, E: 1, F: 0 }], 0)).toThrow(/Time step/);
    });
  });

  it('is exactly #219’s centred wall when a single branch is a pure resistance', () => {
    // (C/2)·(1/ξ)·s = C²·(γ/2)·s at γ = 1/(Cξ): the same update, so the same
    // field to rounding. The γ side runs fully centred (maxGhostGain = 0).
    const nx = 30;
    const ny = 20;
    const xi = 4.45;
    const make = (rlc: boolean) => {
      const field = createField2D(nx, ny);
      if (rlc) field.rlc = createRlcFieldState(nx * ny, [discretizeRlc([{ D: 0, E: xi, F: 0 }], 1e-4)]);
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const idx = j * nx + i;
          if (i === 0 || j === 0 || i === nx - 1 || j === ny - 1) {
            field.channel[idx] = rlc ? 0 : -1 / (C * xi);
            if (rlc) field.rlc!.wallMaterial[idx] = 0;
          } else {
            field.pressure[idx] = Math.sin(1.3 * i + 0.7 * j);
          }
        }
      }
      return field;
    };
    const branch = make(true);
    const centred = make(false);
    const scratch = scratchFor(branch);
    for (let n = 0; n < 500; n++) {
      stepField(branch, LAMBDA_SQ, 1, scratch);
      stepField(centred, LAMBDA_SQ, 1, scratch, 0);
    }
    let diff = 0;
    for (let k = 0; k < nx * ny; k++) diff = Math.max(diff, Math.abs(branch.pressure[k] - centred.pressure[k]));
    expect(diff).toBeLessThan(1e-14);
  });

  it('never adds energy: H + E_lost is constant to 1e-12, beside γ walls and staircase weights', () => {
    // Two fitted materials, #219 walls of three gains, and random #220
    // weights, all in one room with a block, over 10⁴ steps.
    const nx = 40;
    const ny = 30;
    const dt = (C * 0.1) / 343;
    const a = fitRlcToOctaveBands([63, 125, 250, 500, 1000], [0.05, 0.1, 0.5, 0.9, 0.3], { dims: 2 });
    const b = fitRlcToOctaveBands([125, 250, 500], [0.6, 0.2, 0.05], { dims: 2 });
    const field = createField2D(nx, ny);
    field.rlc = createRlcFieldState(nx * ny, [discretizeRlc(a.branches, dt), discretizeRlc(b.branches, dt)]);
    let seed = 3;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const idx = j * nx + i;
        const wall = i === 0 || j === 0 || i === nx - 1 || j === ny - 1 || (i >= 12 && i < 18 && j >= 8 && j < 20);
        if (wall) {
          field.channel[idx] = -[0, 0.5, 3][(i + j) % 3];
          // −2 and −1 leave the γ wall; 0 and 1 are the two RLC materials.
          field.rlc.wallMaterial[idx] = ((7 * i + j) % 4) - 2;
          field.weightX[idx] = random();
          field.weightY[idx] = random();
        } else {
          field.pressure[idx] = random() - 0.5;
        }
      }
    }
    const scratch = scratchFor(field);
    const initial = fieldEnergy(field, LAMBDA_SQ);
    let lost = 0;
    let previous = initial;
    let worstBalance = 0;
    let worstRise = 0;
    for (let n = 0; n < 10_000; n++) {
      const v = field.velocity.slice();
      const y = field.rlc.velocity.slice();
      stepField(field, LAMBDA_SQ, 1, scratch);
      const flow = stepEnergyFlow(field, v, LAMBDA_SQ, 1, undefined, undefined, y);
      expect(flow.lost).toBeGreaterThanOrEqual(0);
      lost += flow.lost;
      const energy = fieldEnergy(field, LAMBDA_SQ);
      worstBalance = Math.max(worstBalance, Math.abs(energy + lost - initial) / initial);
      worstRise = Math.max(worstRise, (energy - previous) / initial);
      previous = energy;
    }
    // Measured: balance 1.5e-14, and H never rose.
    expect(worstBalance).toBeLessThan(1e-12);
    expect(worstRise).toBeLessThanOrEqual(1e-14);
    expect(previous / initial).toBeLessThan(1e-3);
  });

  it('needs no gain cap: RLC faces leave the stability margin where rigid walls put it', () => {
    // The branches never touch the kinetic weight, unlike the backward
    // ghost, so the γ ≤ 1 bound (#223) does not apply to them at any D, E, F.
    const field = createField2D(8, 8);
    field.rlc = createRlcFieldState(64, [discretizeRlc([{ D: 1e-3, E: 0.01, F: 1e5 }], 1e-4)]);
    for (let k = 0; k < 64; k++) {
      const i = k % 8;
      const j = Math.floor(k / 8);
      if (i === 0 || j === 0 || i === 7 || j === 7) {
        field.channel[k] = 0;
        field.rlc.wallMaterial[k] = 0;
      }
    }
    expect(energyMargin(field, LAMBDA_SQ)).toBe(0);
  });

  describe('one run, every band', () => {
    // A 5.2 × 3.7 m room with a block in it, at 5 cm (the walls deliver to
    // about 1.1 kHz), driven by a Gaussian-derivative pulse centred near
    // 300 Hz. Octave-band T20 from one run with fitted RLC walls, against
    // one run per band with a plain resistance at that band's fitted
    // absorption: the per-band runs a frequency-independent wall needs.
    const DX = 0.05;
    const DT = (C * DX) / 343;
    const NX = 104;
    const NY = 74;
    const BANDS = [125, 250, 500];

    function room(branches: RlcBranch[]): Field2D {
      const field = createField2D(NX, NY);
      field.rlc = createRlcFieldState(NX * NY, [discretizeRlc(branches, DT)]);
      for (let j = 0; j < NY; j++) {
        for (let i = 0; i < NX; i++) {
          const idx = j * NX + i;
          if (i < 2 || j < 2 || i >= NX - 2 || j >= NY - 2 || (i >= 60 && i < 66 && j >= 20 && j < 45)) {
            field.channel[idx] = 0;
            field.rlc.wallMaterial[idx] = 0;
          }
        }
      }
      return field;
    }

    function impulseResponse(field: Field2D, seconds: number): Float32Array {
      const steps = Math.round(seconds / DT);
      const out = new Float32Array(steps);
      const scratch = scratchFor(field);
      const source = new Float64Array(NX * NY);
      const at = 20 * NX + 25;
      const listen = 50 * NX + 80;
      // Zero-mean and band-limited, so neither a DC offset nor the grid's
      // near-Nyquist modes, which barely propagate, get into the bands.
      const sigma = 1 / (2 * Math.PI * 300) / DT;
      const t0 = 6 * sigma;
      for (let n = 0; n < steps; n++) {
        const t = n - t0;
        source[at] = n < 2 * t0 ? -(t / (sigma * sigma)) * Math.exp(-(t * t) / (2 * sigma * sigma)) : 0;
        stepField(field, LAMBDA_SQ, 1, scratch, undefined, source);
        out[n] = field.pressure[listen];
      }
      return out;
    }

    function t20(signal: Float32Array): number {
      const edc = new Float64Array(signal.length);
      let acc = 0;
      for (let i = signal.length - 1; i >= 0; i--) {
        acc += signal[i] * signal[i];
        edc[i] = acc;
      }
      const db = (i: number) => 10 * Math.log10(edc[i] / edc[0]);
      let from = -1;
      for (let i = 0; i < signal.length; i++) {
        if (from < 0 && db(i) <= -5) from = i;
        if (db(i) <= -25) return (-60 * (i - from) * DT) / (db(i) - db(from));
      }
      return NaN;
    }

    function compare(alpha: number[]) {
      const fit = fitRlcToOctaveBands(BANDS, alpha, { dims: 2 });
      const seconds = 1.2;
      const single = impulseResponse(room(fit.branches), seconds);
      // Guard bands either side, so neither DC nor Nyquist is in a band.
      const centres = [63, 125, 250, 500, 1000, 2000];
      const windows = octaveBandWindows(nextPowerOfTwo(single.length), 1 / DT, centres);
      return BANDS.map((fc, b) => {
        const window = windows[centres.indexOf(fc)];
        const xi = impedanceForRandomIncidenceAbsorption(fit.fitted[b], 2);
        const perBand = impulseResponse(room([{ D: 0, E: xi, F: 0 }]), seconds);
        return { fc, single: t20(applySpectralWindow(single, window)), perBand: t20(applySpectralWindow(perBand, window)) };
      });
    }

    it('matches per-band runs for a spectrum that doubles over two octaves', () => {
      // Measured single / per-band: 1.04, 1.09, 1.00.
      for (const r of compare([0.2, 0.3, 0.4])) {
        expect([r, Math.abs(r.single / r.perBand - 1) < 0.15]).toEqual([r, true]);
      }
    }, 120_000);

    it('separates the bands of a strongly frequency-dependent material in one run', () => {
      // Five times the absorption from 125 to 500 Hz. Measured T20 1.03,
      // 0.48, 0.19 s in one run, against 1.07, 0.37, 0.16 s from per-band
      // runs. The single run reads up to 30% longer, and it should. Its wall
      // really does vary across each band (0.07 to 0.15 over the 125 Hz band),
      // and a band's tail follows the band's least absorbing frequencies. The
      // per-band runs hold α flat across the band, which is the approximation.
      const results = compare([0.1, 0.25, 0.5]);
      for (const r of results) {
        expect([r, r.single / r.perBand > 0.85 && r.single / r.perBand < 1.4]).toEqual([r, true]);
      }
      const [low, mid, high] = results.map((r) => r.single);
      expect(low / mid).toBeGreaterThan(1.7);
      expect(mid / high).toBeGreaterThan(1.7);
    }, 120_000);
  });
});
