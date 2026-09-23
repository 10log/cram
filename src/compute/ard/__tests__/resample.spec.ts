/**
 * Tests for sample-rate conversion (plan Phase 7).
 *
 * The properties that matter for an impulse response are that a tone inside
 * the band comes through unchanged, that one outside it does not fold back,
 * and that the onset does not move — a resampler that shifted the result would
 * put every arrival at the wrong time and still look perfectly clean.
 */

import {
  DEFAULT_KAISER_BETA,
  besselI0,
  kaiserWindow,
  resample,
} from '../resample';

/** Root-mean-square difference between two signals over a window. */
function rmsError(a: Float32Array, b: ArrayLike<number>, from: number, to: number): number {
  let error = 0;
  let reference = 0;
  for (let i = from; i < to; i++) {
    error += (a[i] - b[i]) ** 2;
    reference += b[i] ** 2;
  }
  return Math.sqrt(error / Math.max(reference, Number.MIN_VALUE));
}

function sine(length: number, rate: number, hz: number, phase = 0): Float32Array {
  const out = new Float32Array(length);
  for (let n = 0; n < length; n++) out[n] = Math.sin(2 * Math.PI * hz * (n / rate) + phase);
  return out;
}

describe('besselI0 and kaiserWindow', () => {
  it('matches known values of I0', () => {
    // Abramowitz & Stegun 9.8.1 / standard tables.
    expect(besselI0(0)).toBeCloseTo(1, 12);
    expect(besselI0(1)).toBeCloseTo(1.2660658778, 9);
    expect(besselI0(2)).toBeCloseTo(2.2795853023, 9);
    expect(besselI0(8)).toBeCloseTo(427.5641157218, 6);
  });

  it('is one at the centre, zero at the edges, and symmetric', () => {
    expect(kaiserWindow(0, DEFAULT_KAISER_BETA)).toBeCloseTo(1, 12);
    expect(kaiserWindow(-1, DEFAULT_KAISER_BETA)).toBe(0);
    expect(kaiserWindow(1, DEFAULT_KAISER_BETA)).toBe(0);
    expect(kaiserWindow(2, DEFAULT_KAISER_BETA)).toBe(0);
    for (const t of [0.1, 0.4, 0.77, 0.99]) {
      expect(kaiserWindow(t, DEFAULT_KAISER_BETA)).toBeCloseTo(
        kaiserWindow(-t, DEFAULT_KAISER_BETA),
        15,
      );
    }
  });
});

describe('resample', () => {
  it('returns a copy when the rates are equal', () => {
    const input = sine(64, 1000, 100);
    const out = resample(input, 1000, 1000);
    expect(Array.from(out)).toEqual(Array.from(input));
    expect(out).not.toBe(input);
  });

  it('rejects non-positive rates and bad kernel widths', () => {
    const input = sine(16, 1000, 100);
    expect(() => resample(input, 0, 1000)).toThrow(/positive/);
    expect(() => resample(input, 1000, -1)).toThrow(/positive/);
    expect(() => resample(input, 1000, 2000, { zeroCrossings: 0 })).toThrow(/positive integer/);
    expect(() => resample(input, 1000, 2000, { zeroCrossings: 2.5 })).toThrow(/positive integer/);
  });

  it('gives an output length set by the rate ratio', () => {
    expect(resample(new Float32Array(1000), 6500, 44100)).toHaveLength(Math.round(1000 * 44100 / 6500));
    expect(resample(new Float32Array(441), 44100, 8000)).toHaveLength(80);
    expect(resample(new Float32Array(0), 6500, 44100)).toHaveLength(0);
  });

  it('preserves a constant, so the kernel sums to one', () => {
    const input = new Float32Array(400).fill(0.75);
    const out = resample(input, 6500, 44100);
    // Away from the ends, where the kernel runs off the input and the signal
    // really does taper. The residual is the windowed sinc's own DC ripple:
    // measured 2.6e-5 relative, about -91 dB, which is below a float32 IR's
    // noise floor and two orders under the 1e-3 a resampling error would show.
    for (let i = 200; i < out.length - 200; i++) expect(out[i]).toBeCloseTo(0.75, 4);
  });

  it('reproduces an in-band tone when upsampling 6500 -> 44100', () => {
    // 6500 Hz is what the plan's defaults give: 2.6 cells per wavelength at
    // fMax = 1000 Hz, Courant 0.4. Every ARD run is upsampled on its way out.
    const from = 6500;
    const to = 44100;
    const hz = 800;
    const input = sine(650, from, hz);
    const out = resample(input, from, to);

    const expected = new Float32Array(out.length);
    for (let n = 0; n < out.length; n++) expected[n] = Math.sin(2 * Math.PI * hz * (n / to));

    // The kernel needs its full width of input either side, so skip the ends.
    const guard = Math.ceil((16 / from) * to) + 8;
    expect(rmsError(out, expected, guard, out.length - guard)).toBeLessThan(0.01);
  });

  it('does not move the onset', () => {
    // An impulse at input sample k has to land at output sample k·ratio, not
    // half a kernel later. A resampler with a delay puts every arrival in an
    // impulse response at the wrong time while looking perfectly clean.
    const from = 6500;
    const to = 44100;
    const input = new Float32Array(200);
    input[40] = 1;
    const out = resample(input, from, to);

    let peak = 0;
    let index = 0;
    for (let i = 0; i < out.length; i++) {
      if (Math.abs(out[i]) > peak) {
        peak = Math.abs(out[i]);
        index = i;
      }
    }
    expect(index).toBe(Math.round((40 * to) / from));
  });

  it('rejects an out-of-band tone when downsampling instead of aliasing it', () => {
    // 5 kHz at 44100 down to 8000: the output Nyquist is 4 kHz, so the tone
    // must be filtered away. Without the cutoff following the *output* rate it
    // would fold to 3 kHz at full amplitude — an alias that looks like signal.
    const input = sine(4410, 44100, 5000);
    const out = resample(input, 44100, 8000);

    let peak = 0;
    for (let i = 100; i < out.length - 100; i++) peak = Math.max(peak, Math.abs(out[i]));
    expect(peak).toBeLessThan(0.01);

    // A tone inside the output band comes through untouched, so the test above
    // is rejection rather than the filter simply being broken.
    const inBand = resample(sine(4410, 44100, 1000), 44100, 8000);
    let inBandPeak = 0;
    for (let i = 100; i < inBand.length - 100; i++) {
      inBandPeak = Math.max(inBandPeak, Math.abs(inBand[i]));
    }
    expect(inBandPeak).toBeGreaterThan(0.98);
  });

  it('round-trips a band-limited signal through a rate it does not divide', () => {
    const signal = new Float32Array(600);
    for (const hz of [120, 310, 700]) {
      const partial = sine(600, 6500, hz, hz);
      for (let n = 0; n < signal.length; n++) signal[n] += partial[n] / 3;
    }
    const up = resample(signal, 6500, 44100);
    const back = resample(up, 44100, 6500);

    const guard = 32;
    expect(rmsError(back, signal, guard, signal.length - guard)).toBeLessThan(0.01);
  });
});
