/**
 * Issue #224: keep the FDTD 2D field DC-free in float. The state rests at
 * zero, the source is soft and differentiated, and recordings are integrated
 * back out with a low cut.
 */

import { describe, expect, it } from 'vitest';
import { REST_PRESSURE, softSourcePixel } from '../field-encoding';
import { RECORDING_HIGHPASS_HZ, integrateAndHighpass } from '../recording';
import { createField2D, stepField } from '../wall-stencil';

const f32 = Math.fround;

/**
 * The GPU's rigid-room update, in float32 as the textures hold it, with a
 * soft source at one cell. `rest` is the state's rest pressure; `forcing(n)`
 * the source's added velocity at step n. Returns the room's mean pressure
 * about rest, averaged over each tenth of the run.
 */
function float32Room(rest: number, steps: number, forcing: (n: number) => number): number[] {
  const N = 10;
  const p = new Float32Array(N * N).fill(rest);
  const v = new Float32Array(N * N);
  const np = new Float32Array(N * N);
  const nv = new Float32Array(N * N);
  const wall = (i: number, j: number) => i === 0 || j === 0 || i === N - 1 || j === N - 1;
  const at = 3 * N + 4;
  const med = f32(4 * 0.5);
  const windows: number[] = [];
  const window = steps / 10;
  let acc = 0;
  for (let n = 0; n < steps; n++) {
    const f = f32(forcing(n));
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const k = j * N + i;
        if (wall(i, j)) {
          np[k] = rest;
          nv[k] = 0;
          continue;
        }
        const pos = p[k];
        const g = (kk: number, ii: number, jj: number) => (wall(ii, jj) ? pos : p[kk]);
        // height-map.frag's order: mid = 0.25*(u+d+r+l), newvel = med*(mid-pos)+vel+forcing.
        const mid = f32(0.25 * f32(f32(f32(g(k + N, i, j + 1) + g(k - N, i, j - 1)) + g(k + 1, i + 1, j)) + g(k - 1, i - 1, j)));
        const vel = f32(f32(f32(med * f32(mid - pos)) + v[k]) + (k === at ? f : 0));
        np[k] = f32(pos + vel);
        nv[k] = vel;
      }
    }
    p.set(np);
    v.set(nv);
    let mean = 0;
    for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) mean += p[j * N + i] - rest;
    acc += mean / ((N - 2) * (N - 2));
    if ((n + 1) % window === 0) {
      windows.push(acc / window);
      acc = 0;
    }
  }
  return windows;
}

describe('Issue #224: a DC-free field', () => {
  describe('in float32, over 10⁶ steps of a rigid room', () => {
    // A 440 Hz tone at the scheme's sample rate for 5 cm cells.
    const sine = (n: number) => (n < 0 ? 0 : Math.sin((2 * Math.PI * 440 * n) / 9701));
    // As Source.velocity does: the change from the previous sample, which is
    // 0 before the first. Starting from anything else would force a
    // permanent offset into the difference and ramp the mean.
    const differentiated = (n: number) => softSourcePixel(sine(n) - sine(n - 1)).forcing;

    it('holds its mean at rest when the state rests at zero', () => {
      // Measured: every window within ±6 (the tone sits near one of this
      // small room's modes), and no trend.
      const windows = float32Room(REST_PRESSURE, 1_000_000, differentiated);
      for (const w of windows) expect(Math.abs(w)).toBeLessThan(10);
    }, 60_000);

    it('drifted with the old 127.5 rest, the same source and the same room', () => {
      // Every rounding at 127.5 (ULP 7.6e-6) went into the constant mode.
      const windows = float32Room(127.5, 1_000_000, differentiated);
      expect(Math.abs(windows[windows.length - 1])).toBeGreaterThan(50);
    }, 60_000);

    it('needs the source differentiated as well: the plain signal pumps the mean', () => {
      // Σ forcing is the running sum of the signal, not its last value.
      // Measured: 1.4e4 after 10⁵ steps.
      const windows = float32Room(REST_PRESSURE, 100_000, (n) => softSourcePixel(sine(n)).forcing);
      expect(Math.abs(windows[windows.length - 1])).toBeGreaterThan(1000);
    }, 60_000);
  });

  describe('a soft source', () => {
    // The CPU mirror, with a Gaussian pulse launched from one side of a room
    // and crossing a source cell on its way.
    const NX = 60;
    const NY = 40;
    const crossing = 20 * NX + 30;

    function run(pinned: boolean) {
      const field = createField2D(NX, NY);
      for (let j = 0; j < NY; j++) {
        for (let i = 0; i < NX; i++) {
          const r2 = (i - 12) ** 2 + (j - 20) ** 2;
          field.pressure[j * NX + i] = Math.exp(-r2 / 8);
        }
      }
      const scratch = { pressure: new Float64Array(NX * NY), velocity: new Float64Array(NX * NY) };
      const source = new Float64Array(NX * NY);
      const snapshot: number[] = [];
      for (let n = 0; n < 60; n++) {
        // A silent source: soft, it adds nothing; hard, it pins its cell to
        // rest, which is what a Dirichlet source at value 0 did.
        source[crossing] = softSourcePixel(0).forcing;
        stepField(field, 0.5, 1, scratch, undefined, source);
        if (pinned) {
          field.pressure[crossing] = REST_PRESSURE;
          field.velocity[crossing] = 0;
        }
      }
      for (let i = 0; i < NX; i++) snapshot.push(field.pressure[20 * NX + i]);
      return snapshot;
    }

    it('lets a wave pass through its cell, where a hard one scattered it', () => {
      const soft = run(false);
      const hard = run(true);
      const empty = createField2D(NX, NY);
      for (let j = 0; j < NY; j++) {
        for (let i = 0; i < NX; i++) empty.pressure[j * NX + i] = Math.exp(-((i - 12) ** 2 + (j - 20) ** 2) / 8);
      }
      const scratch = { pressure: new Float64Array(NX * NY), velocity: new Float64Array(NX * NY) };
      for (let n = 0; n < 60; n++) stepField(empty, 0.5, 1, scratch);
      const free = Array.from({ length: NX }, (_, i) => empty.pressure[20 * NX + i]);
      // Soft and silent is no source at all, to the bit.
      expect(soft).toEqual(free);
      // Hard and silent scatters: the row differs by a good fraction of the wave.
      const peak = Math.max(...free.map(Math.abs));
      const scatter = Math.max(...hard.map((x, i) => Math.abs(x - free[i])));
      expect(scatter / peak).toBeGreaterThan(0.1);
    });

    it('moves mid-recording without a click', () => {
      // A 300 Hz tone that jumps two cells to the right halfway through. The
      // cell it leaves is simply no longer forced. The recording, integrated
      // back out, has no step larger than the tone's own sample-to-sample
      // change, where a jump of the source's value into a new cell would be one.
      const fs = 9701;
      const field = createField2D(NX, NY);
      const scratch = { pressure: new Float64Array(NX * NY), velocity: new Float64Array(NX * NY) };
      const source = new Float64Array(NX * NY);
      const tone = (n: number) => Math.sin((2 * Math.PI * 300 * n) / fs);
      const recorded: number[] = [];
      const steps = 2000;
      for (let n = 0; n < steps; n++) {
        const here = n < steps / 2 ? 20 * NX + 20 : 20 * NX + 22;
        source.fill(0);
        source[here] = softSourcePixel(tone(n) - tone(n - 1)).forcing;
        stepField(field, 0.5, 1, scratch, undefined, source);
        recorded.push(field.pressure[20 * NX + 40]);
      }
      const output = integrateAndHighpass(recorded, fs);
      const jumps = output.slice(1).map((y, n) => Math.abs(y - output[n]));
      const around = jumps.slice(steps / 2 - 20, steps / 2 + 20);
      const before = jumps.slice(steps / 2 - 400, steps / 2 - 20);
      expect(Math.max(...around)).toBeLessThan(1.5 * Math.max(...before));
    });
  });

  describe('the recording', () => {
    const fs = 9701;
    const diff = (x: number[]) => x.map((v, n) => v - (n > 0 ? x[n - 1] : 0));

    it('integrates the source difference back out, exactly, above the cutoff', () => {
      for (const f of [100, 440, 1000]) {
        const x = Array.from({ length: fs }, (_, n) => Math.sin((2 * Math.PI * f * n) / fs));
        const y = integrateAndHighpass(diff(x), fs);
        // Measured amplitude 1.0000 at each: no trapezoidal cos(πf/fs) droop.
        expect(Math.max(...y.slice(fs / 2))).toBeCloseTo(1, 3);
      }
    });

    it('removes DC and sub-audio drift below the cutoff', () => {
      expect(RECORDING_HIGHPASS_HZ).toBe(10);
      const dc = integrateAndHighpass(new Array(fs).fill(1), fs);
      expect(Math.abs(dc[fs - 1])).toBeLessThan(1e-9);
      const slow = Array.from({ length: fs }, (_, n) => Math.sin((2 * Math.PI * 2 * n) / fs));
      // 2 Hz, a factor of five below the cutoff: measured 0.040.
      expect(Math.max(...integrateAndHighpass(diff(slow), fs).slice(fs / 2))).toBeLessThan(0.06);
    });

    it('refuses a rate or cutoff it cannot filter at', () => {
      expect(() => integrateAndHighpass([1], 0)).toThrow(/Sample rate/);
      expect(() => integrateAndHighpass([1], 100, 60)).toThrow(/Cutoff/);
    });
  });
});
