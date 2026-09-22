/**
 * Tests for pulse deconvolution, spectral windows and the absolute pressure
 * scale (plan Phase 7, design decision D4).
 *
 * The free-field test at the end is the one that earns the constant in
 * `freeFieldGain`: it drives the assembled solver and compares its transfer
 * function against the analytic point-source solution across four parameter
 * sets. Everything above it is the signal processing that constant rides on.
 */

import { decompose } from '../decompose';
import {
  applySpectralWindow,
  bandWindow,
  calibration2D,
  calibrationScale,
  deconvolvePulse,
  deconvolveTransformLength,
  freeFieldGain,
  freeFieldGain2D,
  nextPowerOfTwo,
  octaveBandWindows,
} from '../deconvolve';
import { createComplexFftPlan } from '../fft';
import { bandlimitedPulse, createArdSimulation } from '../simulation';
import { Cell, type VoxelGrid } from '../voxelize';

const C = 343;

function convolve(h: ArrayLike<number>, s: ArrayLike<number>, length: number): Float32Array {
  const out = new Float32Array(length);
  for (let i = 0; i < h.length; i++) {
    if (h[i] === 0) continue;
    for (let j = 0; j < s.length; j++) {
      const n = i + j;
      if (n < length) out[n] += h[i] * s[j];
    }
  }
  return out;
}

function peakOf(signal: ArrayLike<number>): { index: number; value: number } {
  let index = 0;
  let value = 0;
  for (let i = 0; i < signal.length; i++) {
    if (Math.abs(signal[i]) > value) {
      value = Math.abs(signal[i]);
      index = i;
    }
  }
  return { index, value };
}

describe('nextPowerOfTwo', () => {
  it('rounds up and rejects nonsense', () => {
    expect(nextPowerOfTwo(1)).toBe(1);
    expect(nextPowerOfTwo(2)).toBe(2);
    expect(nextPowerOfTwo(3)).toBe(4);
    expect(nextPowerOfTwo(1024)).toBe(1024);
    expect(nextPowerOfTwo(1025)).toBe(2048);
    expect(() => nextPowerOfTwo(0)).toThrow(/positive integer/);
    expect(() => nextPowerOfTwo(2.5)).toThrow(/positive integer/);
  });
});

describe('bandWindow', () => {
  const sampleRate = 8000;
  const n = 1024;

  it('is symmetric, so a real signal stays real', () => {
    const window = bandWindow(n, sampleRate, { fLow: 100, fHigh: 2000 });
    for (let k = 1; k < n / 2; k++) expect(window[n - k]).toBe(window[k]);
  });

  it('passes the band, rejects outside it, and never exceeds unity', () => {
    const window = bandWindow(n, sampleRate, { fLow: 200, fHigh: 2000, transition: 0.25 });
    const bin = (hz: number) => Math.round((hz * n) / sampleRate);
    expect(window[bin(700)]).toBeCloseTo(1, 10);
    expect(window[bin(0)]).toBe(0);
    expect(window[bin(100)]).toBe(0); // below 200/1.25 = 160
    expect(window[bin(3000)]).toBe(0); // above 2000*1.25 = 2500
    for (let k = 0; k < n; k++) expect(window[k]).toBeLessThanOrEqual(1 + 1e-12);
  });

  it('keeps DC when fLow is zero and Nyquist when fHigh is omitted', () => {
    const window = bandWindow(n, sampleRate);
    for (let k = 0; k < n; k++) expect(window[k]).toBeCloseTo(1, 12);
  });

  it('rejects an inverted band', () => {
    expect(() => bandWindow(n, sampleRate, { fLow: 2000, fHigh: 200 })).toThrow(/must exceed/);
    expect(() => bandWindow(n, 0)).toThrow(/positive/);
  });
});

describe('octaveBandWindows', () => {
  const sampleRate = 44100;
  const n = 4096;
  const centres = [125, 250, 500, 1000, 2000, 4000];

  it('sums to exactly one at every frequency', () => {
    // This is what makes the per-band path (plan D3) degenerate to the
    // single-run path when absorption is flat. Windows that summed to anything
    // else would change the broadband level as a side effect of asking for
    // more accuracy.
    const windows = octaveBandWindows(n, sampleRate, centres);
    for (let k = 0; k < n; k++) {
      let total = 0;
      for (const window of windows) total += window[k];
      expect(total).toBeCloseTo(1, 12);
    }
  });

  it('puts each band where its centre is', () => {
    const windows = octaveBandWindows(n, sampleRate, centres);
    for (let b = 0; b < centres.length; b++) {
      const bin = Math.round((centres[b] * n) / sampleRate);
      expect(windows[b][bin]).toBeCloseTo(1, 6);
      for (let other = 0; other < centres.length; other++) {
        if (other !== b) expect(windows[other][bin]).toBeLessThan(1e-6);
      }
    }
  });

  it('splits a signal into bands that add back up', () => {
    const signal = new Float32Array(n / 2);
    for (let i = 0; i < signal.length; i++) {
      signal[i] = Math.sin(i * 0.31) + 0.4 * Math.sin(i * 0.07) + 0.2 * Math.sin(i * 1.7);
    }
    const windows = octaveBandWindows(n, sampleRate, centres);
    const sum = new Float32Array(signal.length);
    for (const window of windows) {
      const band = applySpectralWindow(signal, window);
      for (let i = 0; i < sum.length; i++) sum[i] += band[i];
    }
    for (let i = 0; i < sum.length; i++) expect(sum[i]).toBeCloseTo(signal[i], 5);
  });

  it('rejects unordered centres and overlapping transitions', () => {
    expect(() => octaveBandWindows(n, sampleRate, [])).toThrow(/at least one/);
    expect(() => octaveBandWindows(n, sampleRate, [500, 250])).toThrow(/must increase/);
    // (1 + 0.5)^2 = 2.25 > 2: the transitions either side of a crossover would
    // overlap and the sum-to-one guarantee would quietly stop holding.
    expect(() => octaveBandWindows(n, sampleRate, centres, 0.5)).toThrow(/transition must be/);
    expect(() => octaveBandWindows(n, sampleRate, centres, 0)).toThrow(/transition must be/);
  });

  it('rejects a window shorter than the signal it is applied to', () => {
    expect(() => applySpectralWindow(new Float32Array(100), new Float64Array(64))).toThrow(
      /shorter than the signal/,
    );
  });
});

describe('deconvolvePulse', () => {
  const sampleRate = 6500;
  const dt = 1 / sampleRate;
  const fMax = 1000;

  /**
   * The band-limited version of a signal — what deconvolution can recover.
   *
   * `transformLength` has to match what `deconvolvePulse` uses internally, or
   * the two windows land on different bin grids and the comparison measures
   * that difference instead of the deconvolution.
   */
  function bandLimited(h: Float32Array, length: number, transformLength: number): Float32Array {
    const padded = new Float32Array(transformLength);
    padded.set(h.subarray(0, Math.min(h.length, transformLength)));
    const windowed = applySpectralWindow(
      padded,
      bandWindow(transformLength, sampleRate, { fLow: fMax / 32, fHigh: fMax }),
    );
    return windowed.slice(0, length);
  }

  it('recovers a known impulse response, band-limited', () => {
    // Four arrivals of different sign and level — a caricature of an early
    // reflection pattern. Deconvolution cannot return the deltas themselves
    // (nothing above fMax was excited), so the reference is the same deltas
    // passed through the same band window.
    const length = 512;
    const h = new Float32Array(length);
    h[20] = 1;
    h[57] = -0.6;
    h[98] = 0.35;
    h[180] = -0.15;

    const pulse = bandlimitedPulse(200, dt, fMax);
    const response = convolve(h, pulse, length);
    const recovered = deconvolvePulse(response, pulse, { sampleRate, fMax });
    const reference = bandLimited(h, length, nextPowerOfTwo(length + pulse.length));

    let error = 0;
    let energy = 0;
    for (let i = 0; i < length; i++) {
      error += (recovered[i] - reference[i]) ** 2;
      energy += reference[i] ** 2;
    }
    // The residual is the regularizer's bias: at 1e-3 of the peak power it
    // pulls the estimate towards zero wherever the pulse is weak, which is the
    // whole band edge. Measured 2.7%; dropping the regularizer to 1e-5 takes
    // it to 0.6% and starts amplifying the record's own truncation.
    expect(Math.sqrt(error / energy)).toBeLessThan(0.05);
  });

  it('removes the pulse delay rather than leaving it in the result', () => {
    // The pulse is centred 4 sigma in, so the recorded response is delayed by
    // that much. If deconvolution left the offset behind, every arrival in
    // every ARD impulse response would sit late by a fixed amount — a bias
    // that survives every relative timing check.
    const length = 512;
    const h = new Float32Array(length);
    h[64] = 1;

    // fMax = 325 Hz at 6500 makes the pulse long enough for the offset to be
    // unmistakable — sigma is 3.2 samples, so its centre sits 12.7 samples in.
    const slowMax = sampleRate / 20;
    const pulse = bandlimitedPulse(200, dt, slowMax);
    const response = convolve(h, pulse, length);
    expect(peakOf(response).index).toBeGreaterThanOrEqual(64 + 6);

    const recovered = deconvolvePulse(response, pulse, { sampleRate, fMax: slowMax });
    expect(peakOf(recovered).index).toBe(64);
  });

  it('is linear in the response', () => {
    const length = 256;
    const pulse = bandlimitedPulse(128, dt, fMax);
    const a = new Float32Array(length);
    a[30] = 1;
    const b = new Float32Array(length);
    b[70] = 0.5;

    const ra = convolve(a, pulse, length);
    const rb = convolve(b, pulse, length);
    const sum = new Float32Array(length);
    for (let i = 0; i < length; i++) sum[i] = ra[i] + rb[i];

    const da = deconvolvePulse(ra, pulse, { sampleRate, fMax });
    const db = deconvolvePulse(rb, pulse, { sampleRate, fMax });
    const dsum = deconvolvePulse(sum, pulse, { sampleRate, fMax });
    for (let i = 0; i < length; i++) expect(dsum[i]).toBeCloseTo(da[i] + db[i], 6);
  });

  it('folds an extra window in for the price of the transform it already does', () => {
    // The per-band path needs the octave window on the deconvolved result.
    // Applying it afterwards is a second forward and inverse FFT over the
    // whole record, per band, per receiver, on top of `sources x bands`
    // simulations. Multiplying it into the division costs nothing.
    const length = 512;
    const h = new Float32Array(length);
    h[40] = 1;
    h[120] = -0.4;
    const pulse = bandlimitedPulse(200, dt, fMax);
    const response = convolve(h, pulse, length);

    const n = deconvolveTransformLength(length, pulse.length);
    const plain = deconvolvePulse(response, pulse, { sampleRate, fMax });

    // A window of ones is the identity, so the extra multiply is exactly a
    // window and not a rescaling.
    const ones = new Float64Array(n).fill(1);
    const withOnes = deconvolvePulse(response, pulse, { sampleRate, fMax, window: ones });
    for (let i = 0; i < length; i++) expect(withOnes[i]).toBeCloseTo(plain[i], 12);

    // And the octave bands add back up to the unwindowed result, which is what
    // makes the per-band path agree with the broadband one. Exact, because the
    // windows sum to one inside the same division.
    const octave = octaveBandWindows(n, sampleRate, [125, 250, 500, 1000]);
    const sum = new Float32Array(length);
    for (const window of octave) {
      const band = deconvolvePulse(response, pulse, { sampleRate, fMax, window });
      for (let i = 0; i < length; i++) sum[i] += band[i];
    }
    for (let i = 0; i < length; i++) expect(sum[i]).toBeCloseTo(plain[i], 6);
  });

  it('keeps a band to its own octave', () => {
    const length = 512;
    const h = new Float32Array(length);
    h[40] = 1;
    const pulse = bandlimitedPulse(200, dt, fMax);
    const response = convolve(h, pulse, length);
    const n = deconvolveTransformLength(length, pulse.length);
    const octave = octaveBandWindows(n, sampleRate, [125, 250, 500, 1000]);

    const low = deconvolvePulse(response, pulse, { sampleRate, fMax, window: octave[0] });
    const magnitude = (signal: Float32Array, hz: number) => {
      const size = nextPowerOfTwo(signal.length);
      const re = new Float64Array(size);
      const im = new Float64Array(size);
      re.set(signal.subarray(0, Math.min(signal.length, size)));
      createComplexFftPlan(size).forward(re, im);
      const k = Math.round((hz * size) / sampleRate);
      return Math.hypot(re[k], im[k]);
    };
    // Energy at 125 Hz, none two octaves up.
    expect(magnitude(low, 125)).toBeGreaterThan(0);
    expect(magnitude(low, 500) / magnitude(low, 125)).toBeLessThan(0.01);
  });

  it('rejects a window that does not match its transform length', () => {
    const pulse = bandlimitedPulse(64, dt, fMax);
    expect(() =>
      deconvolvePulse(new Float32Array(128), pulse, {
        sampleRate,
        fMax,
        window: new Float64Array(64),
      }),
    ).toThrow(/window must be \d+ long/);
    expect(deconvolveTransformLength(128, 64)).toBe(256);
  });

  it('passes the low octave bands at full weight on a 1 kHz grid', () => {
    // The two windows in series — the deconvolver's own [fMin, fMax] and then
    // the octave — could in principle eat the lowest octaves. Measured here
    // rather than assumed: at fMax 1000 and a 6500 Hz simulation rate the
    // deconvolver's window reaches 1.000 by 39 Hz, so 125 Hz is untouched by
    // it, and the Wiener term costs 2.3% there.
    const simRate = (2.6 * 1000) / 0.4;
    const n = 8192;
    const window = bandWindow(n, simRate, { fLow: 1000 / 32, fHigh: 1000 });
    const bin = (hz: number) => Math.round((hz * n) / simRate);
    expect(window[bin(125)]).toBeCloseTo(1, 10);
    expect(window[bin(63)]).toBeCloseTo(1, 10);
    expect(window[bin(39)]).toBeGreaterThan(0.999);
    // The rise really is confined to a third of an octave either side of fMin.
    expect(window[bin(31.25)]).toBeCloseTo(0.5, 1);
    expect(window[bin(20)]).toBeLessThan(0.01);

    const octave = octaveBandWindows(n, simRate, [125, 250, 500, 1000]);
    expect(octave[0][bin(125)]).toBeCloseTo(1, 10);
    for (let b = 1; b < octave.length; b++) expect(octave[b][bin(125)]).toBeLessThan(1e-9);
  });

  it('rejects a silent pulse and a zero regularizer', () => {
    const response = new Float32Array(64);
    expect(() =>
      deconvolvePulse(response, new Float32Array(32), { sampleRate, fMax }),
    ).toThrow(/all zeros/);
    expect(() =>
      deconvolvePulse(response, bandlimitedPulse(32, dt, fMax), {
        sampleRate,
        fMax,
        regularization: 0,
      }),
    ).toThrow(/regularization must be positive/);
    expect(() =>
      deconvolvePulse(response, bandlimitedPulse(32, dt, fMax), { sampleRate, fMax: 0 }),
    ).toThrow(/fMax must be positive/);
    expect(deconvolvePulse(new Float32Array(0), bandlimitedPulse(32, dt, fMax), {
      sampleRate,
      fMax,
    })).toHaveLength(0);
  });
});

describe('absolute scale', () => {
  it('takes a free-field record to an impulse response referenced to 1 m', () => {
    const dx = 0.05;
    for (const r of [0.5, 1, 2.5]) {
      expect(freeFieldGain(dx, C, r) * calibrationScale(dx, C)).toBeCloseTo(1 / r, 12);
    }
    expect(() => freeFieldGain(0, C, 1)).toThrow(/positive/);
    expect(() => freeFieldGain(dx, C, 0)).toThrow(/positive/);
  });

  it('has a two-dimensional gain that is not the three-dimensional one', () => {
    // Not a variant with an exponent changed: a different function of
    // different variables. 2D falls as 1/sqrt(r) and as 1/sqrt(f), 3D as 1/r
    // and flat.
    const dx = 0.05;
    expect(freeFieldGain2D(dx, C, 1, 500) / freeFieldGain2D(dx, C, 4, 500)).toBeCloseTo(2, 9);
    expect(freeFieldGain(dx, C, 1) / freeFieldGain(dx, C, 4)).toBeCloseTo(4, 9);
    expect(freeFieldGain2D(dx, C, 1, 250) / freeFieldGain2D(dx, C, 1, 1000)).toBeCloseTo(2, 9);

    for (const bad of [0, -1]) {
      expect(() => freeFieldGain2D(bad, C, 1, 500)).toThrow(/positive/);
      expect(() => freeFieldGain2D(dx, C, bad, 500)).toThrow(/positive/);
      expect(() => freeFieldGain2D(dx, C, 1, bad)).toThrow(/positive/);
    }
  });

  it('builds a 2D calibration that undoes the spreading it corrects', () => {
    const dx = 0.05;
    const n = 2048;
    const sampleRate = 6500;
    const weight = calibration2D(n, sampleRate, dx, C);

    // Symmetric, so the inverse transform of a real spectrum stays real.
    for (let k = 1; k < n / 2; k++) expect(weight[n - k]).toBe(weight[k]);
    // Zero at DC: 2D free field has no amplitude there to normalize against,
    // and the driving pulse carries nothing there either.
    expect(weight[0]).toBe(0);

    // The defining property: gain times calibration is 1/sqrt(r), flat in
    // frequency. That is what makes a 2D impulse response readable at all —
    // without it the result carries a -3 dB/octave tilt that is spreading, not
    // the room.
    const binHz = sampleRate / n;
    for (const r of [0.5, 2, 5]) {
      for (const k of [64, 128, 256]) {
        const f = k * binHz;
        expect(freeFieldGain2D(dx, C, r, f) * weight[k]).toBeCloseTo(1 / Math.sqrt(r), 9);
      }
    }
    expect(() => calibration2D(n, sampleRate, 0, C)).toThrow(/positive/);
  });

  /** Air box with a one-cell rigid shell, for a free-field window. */
  function openGrid(extent: number, dx: number): VoxelGrid {
    const n = extent + 2;
    const cells = new Uint8Array(n * n * n);
    let airCount = 0;
    for (let k = 1; k <= extent; k++) {
      for (let j = 1; j <= extent; j++) {
        for (let i = 1; i <= extent; i++) {
          cells[i + n * (j + n * k)] = Cell.Air;
          airCount++;
        }
      }
    }
    return {
      nx: n, ny: n, nz: n, dx,
      origin: { x: 0, y: 0, z: 0 },
      cells,
      surfaceOf: new Int32Array(n * n * n).fill(-1),
      airCount,
      solidCount: n * n * n - airCount,
      leaked: false,
      warnings: [],
    };
  }

  /**
   * Free-field transfer function from injected forcing to pressure, measured
   * spectrally at three frequencies inside the band and divided by
   * {@link freeFieldGain}.
   */
  function transferRatios(dx: number, courant: number, fMax: number, half: number): number[] {
    const grid = openGrid(2 * half, dx);
    const dt = (courant * dx) / C;
    const source: [number, number, number] = [1 + half, 1 + half, 1 + half];
    const distances = [6, 12, 18];
    // Stop before the nearest wall's reflection reaches the far receiver, so
    // the record is free field for its whole length.
    const steps = Math.floor((2 * half - distances[distances.length - 1]) / courant);
    const signal = bandlimitedPulse(steps, dt, fMax);

    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant,
      walls: false,
      sources: [{ cell: source, signal }],
      receivers: distances.map((d) => ({
        cell: [source[0] + d, source[1], source[2]] as [number, number, number],
      })),
      steps,
    });
    const irs = sim.run();
    sim.dispose();

    const n = nextPowerOfTwo(steps * 2);
    const plan = createComplexFftPlan(n);
    const spectrum = (x: Float32Array) => {
      const re = new Float64Array(n);
      const im = new Float64Array(n);
      re.set(x.subarray(0, Math.min(x.length, n)));
      plan.forward(re, im);
      return { re, im };
    };

    const s = spectrum(signal);
    const ratios: number[] = [];
    for (let d = 0; d < distances.length; d++) {
      const p = spectrum(irs[d]);
      const expected = freeFieldGain(dx, C, distances[d] * dx);
      for (const fraction of [0.25, 0.5, 0.75]) {
        const k = Math.round(fraction * fMax * n * dt);
        const sMag = Math.hypot(s.re[k], s.im[k]);
        const pMag = Math.hypot(p.re[k], p.im[k]);
        ratios.push(pMag / sMag / expected);
      }
    }
    return ratios;
  }

  /** Air plane with a one-cell rigid shell — a 2D free-field window. */
  function openPlane(extent: number, dx: number): VoxelGrid {
    const n = extent + 2;
    const cells = new Uint8Array(n * n);
    let airCount = 0;
    for (let j = 1; j <= extent; j++) {
      for (let i = 1; i <= extent; i++) {
        cells[i + n * j] = Cell.Air;
        airCount++;
      }
    }
    return {
      nx: n, ny: n, nz: 1, dx,
      origin: { x: 0, y: 0, z: 0 },
      cells,
      surfaceOf: new Int32Array(n * n).fill(-1),
      airCount,
      solidCount: n * n - airCount,
      leaked: false,
      warnings: [],
    };
  }

  it('matches the analytic line-source solution in two dimensions', () => {
    // The 2D counterpart of the test below, and the one that says the 3D
    // constant cannot simply be reused: it is checked here too, and misses by
    // a factor that moves with both distance and frequency.
    const dx = 0.05;
    const courant = 0.4;
    const fMax = 1200;
    const half = 40;
    const grid = openPlane(2 * half, dx);
    const dt = (courant * dx) / C;
    const source: [number, number, number] = [1 + half, 1 + half, 0];
    const distances = [8, 16, 24];
    const steps = Math.floor((2 * half - distances[distances.length - 1]) / courant);
    const signal = bandlimitedPulse(steps, dt, fMax);

    const sim = createArdSimulation({
      grid,
      decomposition: decompose(grid),
      c: C,
      courant,
      walls: false,
      steps,
      sources: [{ cell: source, signal }],
      receivers: distances.map((d) => ({
        cell: [source[0] + d, source[1], 0] as [number, number, number],
      })),
    });
    // A plane is rank 2, so nothing here is a degenerate 3D run.
    expect(sim.partitions.every((p) => p.box.d === 1)).toBe(true);
    const irs = sim.run();
    sim.dispose();

    const n = nextPowerOfTwo(steps * 2);
    const plan = createComplexFftPlan(n);
    const spectrum = (x: Float32Array) => {
      const re = new Float64Array(n);
      const im = new Float64Array(n);
      re.set(x.subarray(0, Math.min(x.length, n)));
      plan.forward(re, im);
      return { re, im };
    };
    const s = spectrum(signal);

    const twoD: number[] = [];
    const threeD: number[] = [];
    for (let d = 0; d < distances.length; d++) {
      const p = spectrum(irs[d]);
      const r = distances[d] * dx;
      for (const fraction of [0.25, 0.5, 0.75]) {
        const k = Math.round(fraction * fMax * n * dt);
        const f = k / (n * dt);
        const measured =
          Math.hypot(p.re[k], p.im[k]) / Math.hypot(s.re[k], s.im[k]);
        twoD.push(measured / freeFieldGain2D(dx, C, r, f));
        threeD.push(measured / freeFieldGain(dx, C, r));
      }
    }

    // Measured: every ratio within 1.6% of 1 across three distances and three
    // frequencies.
    for (const ratio of twoD) {
      expect(ratio).toBeGreaterThan(0.97);
      expect(ratio).toBeLessThan(1.03);
    }

    // And the 3D expression is not merely off by a constant here — the spread
    // across these nine points is itself a factor of three, so no scale factor
    // could rescue it. Measured 8x to 23x.
    expect(Math.min(...threeD)).toBeGreaterThan(5);
    expect(Math.max(...threeD) / Math.min(...threeD)).toBeGreaterThan(2);
  }, 300_000);

  it('matches the analytic point-source solution across parameters', () => {
    // dx^3/(4 pi c^2 r) is the continuum Green's function for the forcing
    // convention the partitions use. Three of these rows scale dx and fMax
    // together, which holds the dimensionless grid fixed — so agreement across
    // them says the constant carries the dimensional factors correctly, not
    // just that one case happens to fit.
    const cases = [
      { dx: 0.05, courant: 0.4, fMax: 1200 },
      { dx: 0.05, courant: 0.3, fMax: 1200 },
      { dx: 0.05, courant: 0.4, fMax: 600 },
      { dx: 0.1, courant: 0.4, fMax: 600 },
    ];
    for (const { dx, courant, fMax } of cases) {
      const ratios = transferRatios(dx, courant, fMax, 24);
      for (const ratio of ratios) {
        expect(ratio).toBeGreaterThan(0.95);
        expect(ratio).toBeLessThan(1.05);
      }
      // No systematic bias, only scatter: the mean sits on 1 far tighter than
      // the individual points do.
      const mean = ratios.reduce((t, v) => t + v, 0) / ratios.length;
      expect(Math.abs(mean - 1)).toBeLessThan(0.02);
    }
  }, 300_000);
});
