/**
 * Tests for late reverberation tail synthesis (Issue #78).
 *
 * Part 1: Source-scanning tests that verify structure without instantiating
 * the Three.js/WebGL environment.
 * Part 2: Unit tests for the pure functions in tail-synthesis.ts.
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Source code for scanning tests ───────────────────────────────────

const typesSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'types.ts'),
  'utf8'
);

const indexSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'index.ts'),
  'utf8'
);

const tailSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'tail-synthesis.ts'),
  'utf8'
);

const irSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'impulse-response.ts'),
  'utf8'
);

// ── Part 1: Source-scanning tests ────────────────────────────────────

describe('Late Reverberation Tail Synthesis – source structure', () => {

  describe('types.ts', () => {
    it('exports DecayParameters interface with required fields', () => {
      expect(typesSource).toMatch(/export\s+interface\s+DecayParameters/);
      const match = typesSource.match(/export\s+interface\s+DecayParameters\s*\{([\s\S]*?)\}/);
      expect(match).not.toBeNull();
      const body = match![1];
      expect(body).toContain('t60: number');
      expect(body).toContain('decayRate: number');
      expect(body).toContain('crossfadeLevel: number');
      expect(body).toContain('crossfadeTime: number');
      expect(body).toContain('endTime: number');
    });

    it('has lateReverbTailEnabled in defaults', () => {
      expect(typesSource).toMatch(/lateReverbTailEnabled:\s*false/);
    });

    it('has tailCrossfadeTime in defaults', () => {
      expect(typesSource).toMatch(/tailCrossfadeTime:\s*0/);
    });

    it('has tailCrossfadeDuration in defaults', () => {
      expect(typesSource).toMatch(/tailCrossfadeDuration:\s*0\.05/);
    });

    it('has lateReverbTailEnabled in RayTracerSaveObject', () => {
      const match = typesSource.match(/type\s+RayTracerSaveObject\s*=\s*\{([\s\S]*?)\}/);
      expect(match).not.toBeNull();
      expect(match![1]).toContain('lateReverbTailEnabled');
    });

    it('has lateReverbTailEnabled in RayTracerParams', () => {
      const match = typesSource.match(/interface\s+RayTracerParams\s*\{([\s\S]*?)\}/);
      expect(match).not.toBeNull();
      expect(match![1]).toContain('lateReverbTailEnabled');
    });

    it('exports MIN_TAIL_DECAY_RATE and MAX_TAIL_END_TIME constants', () => {
      expect(typesSource).toMatch(/export\s+const\s+MIN_TAIL_DECAY_RATE/);
      expect(typesSource).toMatch(/export\s+const\s+MAX_TAIL_END_TIME/);
    });
  });

  describe('tail-synthesis.ts', () => {
    it('exports extractDecayParameters', () => {
      expect(tailSource).toMatch(/export\s+function\s+extractDecayParameters/);
    });

    it('exports synthesizeTail', () => {
      expect(tailSource).toMatch(/export\s+function\s+synthesizeTail/);
    });

    it('exports assembleFinalIR', () => {
      expect(tailSource).toMatch(/export\s+function\s+assembleFinalIR/);
    });

    it('uses linearRegression with .m for slope', () => {
      expect(tailSource).toContain('regression.m');
    });

    it('implements Schroeder backward integration', () => {
      expect(tailSource).toMatch(/schroeder\[b\]\s*=\s*schroeder\[b\s*\+\s*1\]\s*\+\s*histogram\[b\]/);
    });
  });

  describe('index.ts', () => {
    it('imports from tail-synthesis', () => {
      expect(indexSource).toContain('from "./tail-synthesis"');
    });

    it('has lateReverbTailEnabled in save()', () => {
      expect(indexSource).toMatch(/lateReverbTailEnabled/);
    });

    it('class declares lateReverbTailEnabled member', () => {
      expect(indexSource).toMatch(/lateReverbTailEnabled:\s*boolean/);
    });
  });

  describe('impulse-response.ts', () => {
    it('has tailOptions parameter', () => {
      expect(irSource).toContain('tailOptions');
    });

    it('imports from tail-synthesis', () => {
      expect(irSource).toContain('from "./tail-synthesis"');
    });
  });
});

// ── Part 2: Unit tests for pure functions ────────────────────────────

import { extractDecayParameters, synthesizeTail, assembleFinalIR } from '../tail-synthesis';

describe('extractDecayParameters', () => {
  const frequencies = [500, 1000];
  const binWidth = 0.001; // 1ms bins

  /**
   * Helper: create a synthetic exponential decay histogram.
   * Energy decays as 10^(decayRateDb * t / 10) where t = bin * binWidth.
   */
  function makeExponentialHistogram(
    numBins: number,
    decayRateDb: number, // e.g. -30 means -30 dB/s
    binWidth: number,
  ): Float32Array {
    const hist = new Float32Array(numBins);
    for (let b = 0; b < numBins; b++) {
      const t = b * binWidth;
      const energy = Math.pow(10, decayRateDb * t / 10);
      hist[b] = energy;
    }
    return hist;
  }

  it('extracts correct T60 from a synthetic exponential histogram within 10%', () => {
    const decayRate = -30; // dB/s → T60 = 60/30 = 2.0s
    const numBins = 3000; // 3 seconds of data
    const hist = makeExponentialHistogram(numBins, decayRate, binWidth);

    const result = extractDecayParameters([hist], [500], 0, binWidth);
    expect(result).toHaveLength(1);
    expect(result[0].t60).toBeGreaterThan(0);
    // Within 10% of expected T60 = 2.0s
    expect(Math.abs(result[0].t60 - 2.0)).toBeLessThan(0.2);
  });

  it('returns safe defaults for an empty histogram', () => {
    const hist = new Float32Array(1000); // all zeros
    const result = extractDecayParameters([hist], [500], 0, binWidth);
    expect(result).toHaveLength(1);
    expect(result[0].t60).toBe(0);
    expect(result[0].decayRate).toBe(0);
    expect(result[0].crossfadeLevel).toBe(0);
  });

  it('auto-detects crossfade time when input is 0', () => {
    const decayRate = -30;
    const numBins = 2000;
    const hist = makeExponentialHistogram(numBins, decayRate, binWidth);

    const result = extractDecayParameters([hist], [500], 0, binWidth);
    expect(result[0].crossfadeTime).toBeGreaterThan(0);
    // Should be near the last non-zero bin minus margin
    expect(result[0].crossfadeTime).toBeLessThan(numBins * binWidth);
  });

  it('respects explicit crossfade time', () => {
    const decayRate = -30;
    const numBins = 2000;
    const hist = makeExponentialHistogram(numBins, decayRate, binWidth);

    const result = extractDecayParameters([hist], [500], 1.0, binWidth);
    expect(result[0].crossfadeTime).toBe(1.0);
  });

  it('handles multiple frequency bands', () => {
    const numBins = 2000;
    const hist1 = makeExponentialHistogram(numBins, -20, binWidth); // T60 = 3.0s
    const hist2 = makeExponentialHistogram(numBins, -60, binWidth); // T60 = 1.0s

    const result = extractDecayParameters([hist1, hist2], frequencies, 0, binWidth);
    expect(result).toHaveLength(2);
    expect(result[0].t60).toBeGreaterThan(result[1].t60);
  });
});

describe('synthesizeTail', () => {
  it('output length matches expected duration', () => {
    const decayParams = [{
      t60: 2.0, decayRate: -30, crossfadeLevel: 0.5,
      crossfadeTime: 1.0, endTime: 3.0,
    }];
    const sampleRate = 44100;
    const { tailSamples, totalSamples } = synthesizeTail(decayParams, sampleRate, 0.05);

    expect(tailSamples).toHaveLength(1);
    expect(totalSamples).toBe(Math.floor(3.0 * sampleRate));
    expect(tailSamples[0].length).toBe(totalSamples - Math.floor(1.0 * sampleRate));
  });

  it('envelope decays to near-zero at end', () => {
    const decayParams = [{
      t60: 1.0, decayRate: -60, crossfadeLevel: 1.0,
      crossfadeTime: 0.5, endTime: 1.5,
    }];
    const sampleRate = 44100;
    const { tailSamples } = synthesizeTail(decayParams, sampleRate, 0.05);
    const tail = tailSamples[0];

    // Compute RMS of first 10ms and last 10ms
    const windowSize = Math.floor(0.01 * sampleRate);
    let rmsStart = 0, rmsEnd = 0;
    for (let i = 0; i < windowSize; i++) {
      rmsStart += tail[i] * tail[i];
      rmsEnd += tail[tail.length - 1 - i] * tail[tail.length - 1 - i];
    }
    rmsStart = Math.sqrt(rmsStart / windowSize);
    rmsEnd = Math.sqrt(rmsEnd / windowSize);

    // End RMS should be much smaller than start RMS
    expect(rmsEnd).toBeLessThan(rmsStart * 0.1);
  });

  it('returns empty arrays when no valid decay params', () => {
    const decayParams = [{ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 }];
    const { tailSamples } = synthesizeTail(decayParams, 44100, 0.05);
    expect(tailSamples[0].length).toBe(0);
  });
});

describe('assembleFinalIR', () => {
  const sampleRate = 1000; // simple rate for easy math

  it('samples before crossfade are unchanged', () => {
    const traced = new Float32Array(1000);
    for (let i = 0; i < 1000; i++) traced[i] = i;

    const tail = new Float32Array(500);
    for (let i = 0; i < 500; i++) tail[i] = 1;

    const result = assembleFinalIR([traced], [tail], 500, 100);
    expect(result).toHaveLength(1);

    // Samples before crossfade should be unchanged
    for (let i = 0; i < 500; i++) {
      expect(result[0][i]).toBe(traced[i]);
    }
  });

  it('Hann crossfade weights sum to ~1.0 at midpoint', () => {
    const traced = new Float32Array(1000).fill(1.0);
    const tail = new Float32Array(500).fill(1.0);

    const crossfadeStart = 500;
    const crossfadeDuration = 100;
    const result = assembleFinalIR([traced], [tail], crossfadeStart, crossfadeDuration);

    // At midpoint of crossfade (n = 50), fadeOut + fadeIn should ≈ 1
    // fadeOut = 0.5 * (1 + cos(pi * 50 / 100)) = 0.5
    // fadeIn  = 0.5 * (1 - cos(pi * 50 / 100)) = 0.5
    // Sum = 1.0 (both traced and tail are 1.0)
    const midIdx = crossfadeStart + Math.floor(crossfadeDuration / 2);
    expect(Math.abs(result[0][midIdx] - 1.0)).toBeLessThan(0.01);
  });

  it('samples after crossfade region are pure tail', () => {
    const traced = new Float32Array(600).fill(2.0);
    const tail = new Float32Array(500);
    for (let i = 0; i < 500; i++) tail[i] = i * 0.01;

    const crossfadeStart = 400;
    const crossfadeDuration = 100;
    const result = assembleFinalIR([traced], [tail], crossfadeStart, crossfadeDuration);

    // After crossfade (sample 500 onwards), values should be pure tail
    for (let i = crossfadeDuration; i < tail.length; i++) {
      expect(result[0][crossfadeStart + i]).toBeCloseTo(tail[i], 5);
    }
  });

  it('handles crossfade time beyond ray-traced IR length', () => {
    const traced = new Float32Array(100).fill(1.0);
    const tail = new Float32Array(200).fill(0.5);

    // Crossfade starts at 150, which is beyond traced length (100)
    const result = assembleFinalIR([traced], [tail], 150, 50);
    expect(result).toHaveLength(1);
    expect(result[0].length).toBe(350); // max(100, 150 + 200)

    // After crossfade, tail samples should be present
    for (let i = 50; i < 200; i++) {
      expect(result[0][150 + i]).toBeCloseTo(0.5, 5);
    }
  });

  it('handles empty tail gracefully', () => {
    const traced = new Float32Array(100).fill(1.0);
    const tail = new Float32Array(0);

    const result = assembleFinalIR([traced], [tail], 50, 10);
    expect(result).toHaveLength(1);
    // Original traced data should be preserved
    expect(result[0].length).toBe(traced.length);
    for (let i = 0; i < traced.length; i++) {
      expect(result[0][i]).toBe(traced[i]);
    }
  });
});
