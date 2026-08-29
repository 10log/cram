/**
 * Issue #106 / #132: ambisonic late-reverb tail was applied to W only.
 * applyAmbisonicTail extends every HOA channel with independent noise of
 * the same envelope so lengths match and the tail is not a mono-W image.
 */
import * as fs from 'fs';
import * as path from 'path';
import { applyAmbisonicTail } from '../tail-synthesis';
import type { DecayParameters } from '../tail-synthesis-types';

function rms(buf: Float32Array, start: number, end: number): number {
  let sum = 0;
  const n = end - start;
  for (let i = start; i < end; i++) sum += buf[i] * buf[i];
  return Math.sqrt(sum / Math.max(1, n));
}

function correlation(a: Float32Array, b: Float32Array, start: number, end: number): number {
  const n = end - start;
  let dot = 0, na = 0, nb = 0;
  for (let i = start; i < end; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na * nb);
  return denom > 0 ? dot / denom : 0;
}

const decay: DecayParameters[] = [{
  t60: 1,
  decayRate: -60,
  crossfadeLevel: 0.25,
  crossfadeTime: 0.2,
  endTime: 1.0,
}];

describe('applyAmbisonicTail', () => {
  const sampleRate = 1000;
  const crossfadeDurationSamples = 50;
  const earlyLen = 300;
  const nCh = 4; // FOA: W Y Z X

  function earlySamples(fillW = 1): Float32Array[][] {
    const samples: Float32Array[][] = [[]];
    for (let ch = 0; ch < nCh; ch++) {
      const buf = new Float32Array(earlyLen);
      if (ch === 0) buf.fill(fillW);
      samples[0].push(buf);
    }
    return samples;
  }

  test('every HOA channel ends at the same length', () => {
    const samples = earlySamples();
    applyAmbisonicTail(samples, decay, sampleRate, crossfadeDurationSamples);
    const len = samples[0][0].length;
    expect(len).toBeGreaterThan(earlyLen);
    for (let ch = 1; ch < nCh; ch++) {
      expect(samples[0][ch].length).toBe(len);
    }
  });

  test('tail region is not W-only — Y/Z/X RMS is within a few dB of W', () => {
    const samples = earlySamples();
    applyAmbisonicTail(samples, decay, sampleRate, crossfadeDurationSamples);
    const len = samples[0][0].length;
    const tailStart = Math.floor(len * 0.6);
    const w = rms(samples[0][0], tailStart, len);
    expect(w).toBeGreaterThan(1e-4);
    for (let ch = 1; ch < nCh; ch++) {
      const r = rms(samples[0][ch], tailStart, len);
      expect(r).toBeGreaterThan(1e-4);
      const db = 20 * Math.log10(r / w);
      expect(Math.abs(db)).toBeLessThan(6);
    }
  });

  test('per-channel tails are decorrelated (not a copy of W)', () => {
    const samples = earlySamples();
    applyAmbisonicTail(samples, decay, sampleRate, crossfadeDurationSamples);
    const len = samples[0][0].length;
    const tailStart = Math.floor(len * 0.6);
    for (let ch = 1; ch < nCh; ch++) {
      expect(Math.abs(correlation(samples[0][0], samples[0][ch], tailStart, len))).toBeLessThan(0.3);
    }
  });

  test('zero decay leaves early buffers unchanged in length when there is no tail', () => {
    const silent: DecayParameters[] = [{
      t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0,
    }];
    const samples = earlySamples();
    applyAmbisonicTail(samples, silent, sampleRate, crossfadeDurationSamples);
    for (let ch = 0; ch < nCh; ch++) {
      expect(samples[0][ch].length).toBe(earlyLen);
    }
  });

  test('empty samples is a no-op', () => {
    expect(applyAmbisonicTail([], decay, sampleRate, crossfadeDurationSamples)).toEqual([]);
    expect(applyAmbisonicTail([[]], decay, sampleRate, crossfadeDurationSamples)).toEqual([[]]);
  });
});

describe('Issue #106/#132: production call sites', () => {
  test('beam-trace calculateAmbisonicImpulseResponse calls applyAmbisonicTail', () => {
    const source = fs.readFileSync(path.resolve(__dirname, '../../beam-trace/index.ts'), 'utf-8');
    const match = source.match(/async calculateAmbisonicImpulseResponse\([\s\S]*?^\s{2}\}/m);
    expect(match).not.toBeNull();
    expect(match![0]).toMatch(/applyAmbisonicTail\(/);
    expect(match![0]).not.toMatch(/W-channel \(channel 0\) only/);
  });

  test('raytracer calculateAmbisonicImpulseResponse calls applyAmbisonicTail', () => {
    const source = fs.readFileSync(path.resolve(__dirname, '../../raytracer/index.ts'), 'utf-8');
    const match = source.match(/async calculateAmbisonicImpulseResponse\([\s\S]*?^\s{2}\}/m);
    expect(match).not.toBeNull();
    expect(match![0]).toMatch(/applyAmbisonicTail\(/);
    expect(match![0]).not.toMatch(/W channel \(ch=0\) only/);
  });
});
