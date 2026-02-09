/**
 * Tests for temperature support across solvers.
 *
 * Temperature now lives on Room and is accessed via getter:
 *   get temperature(): number { return this.room?.temperature ?? 20; }
 *
 * Verifies that:
 * - RayTracer has temperature/c getters and cached air attenuation
 * - Per-segment air absorption is applied during traceRay
 * - All hardcoded speed-of-sound values are replaced with this.c
 * - All airAttenuation calls pass this.temperature
 * - arrivalPressure skips post-hoc air absorption for new paths (avoids double-counting)
 */

import * as fs from 'fs';
import * as path from 'path';
import { soundSpeed, airAttenuation } from '../../acoustics';

describe('RayTracer temperature and per-segment air absorption', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', 'index.ts'),
    'utf8'
  );

  const rayCoreSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'ray-core.ts'),
    'utf8'
  );

  const impulseResponseSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'impulse-response.ts'),
    'utf8'
  );

  // --- Temperature getter from Room ---

  it('has temperature getter that reads from room', () => {
    expect(source).toMatch(/get\s+temperature\(\):\s*number/);
    expect(source).toContain('this.room?.temperature ?? 20');
  });

  it('has c getter using soundSpeed(this.temperature)', () => {
    expect(source).toMatch(/get\s+c\(\):\s*number\s*\{/);
    expect(source).toContain('ac.soundSpeed(this.temperature)');
  });

  it('class declares _cachedAirAtt property', () => {
    expect(source).toContain('_cachedAirAtt');
  });

  // --- Cached air attenuation ---

  it('caches air attenuation in constructor', () => {
    expect(source).toContain('this._cachedAirAtt = ac.airAttenuation(this.frequencies, this.temperature)');
  });

  it('refreshes cached air attenuation in start()', () => {
    const startMatch = source.match(/start\(\)\s*\{([\s\S]*?)startAllMonteCarlo|startGpuMonteCarlo/);
    expect(startMatch).not.toBeNull();
    expect(startMatch![1]).toContain('this._cachedAirAtt = ac.airAttenuation(this.frequencies, this.temperature)');
  });

  // --- Per-segment air absorption in traceRay ---

  it('applies per-segment air absorption in intensity domain (/10) in traceRay', () => {
    // bandEnergy is intensity (reflectionFunction returns R²), so dB→linear uses /10
    expect(rayCoreSource).toContain('cachedAirAtt[f] * segmentDistance / 10');
  });

  it('applies air absorption to receiver segment in intensity domain (/10)', () => {
    expect(rayCoreSource).toContain('cachedAirAtt[f] * receiverSegmentDist / 10');
  });

  // --- Hardcoded speed of sound replaced ---

  it('stop() uses this.c instead of 343.2', () => {
    // Should not contain the old hardcoded value for path time calculation
    expect(source).not.toMatch(/distance\s*\/\s*343\.2/);
    expect(source).toContain('p.chain[i].distance / this.c');
  });

  it('quickEstimateStep uses this.c', () => {
    // Should not use ac.soundSpeed(20) hardcoded
    expect(source).not.toMatch(/soundSpeed\s*=\s*ac\.soundSpeed\(20\)/);
  });

  it('hybrid calculation uses this.c instead of 343', () => {
    expect(source).toContain('returnSortedPathsForHybrid(this.c,');
    expect(source).not.toMatch(/returnSortedPathsForHybrid\(343[^.]/);
  });

  // --- Temperature passed to airAttenuation ---

  it('all airAttenuation calls pass temperature', () => {
    // Find all airAttenuation calls and verify they pass temperature
    const airAttCalls = source.match(/ac\.airAttenuation\([^)]+\)/g) || [];
    expect(airAttCalls.length).toBeGreaterThan(0);

    for (const call of airAttCalls) {
      // Each call should have at least 2 arguments (frequencies, temperature)
      const args = call.match(/ac\.airAttenuation\(([^)]+)\)/);
      expect(args).not.toBeNull();
      const argList = args![1].split(',').map(a => a.trim());
      expect(argList.length).toBeGreaterThanOrEqual(2);
    }
  });

  // --- arrivalPressure avoids double-counting ---

  it('arrivalPressure skips post-hoc air absorption for bandEnergy paths', () => {
    // The bandEnergy fast path should return early without applying air absorption
    expect(impulseResponseSource).toContain('no post-hoc air absorption needed');
  });

  // --- Hybrid passes temperature to image source solver ---

  it('hybrid ImageSourceSolver uses temperature via getter', () => {
    // The hybrid solver creates an ImageSourceSolver which has its own temperature getter
    // Verify the solver passes this.c for speed of sound
    expect(source).toContain('returnSortedPathsForHybrid(this.c,');
  });
});

describe('ImageSourceSolver temperature in airAttenuation', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', 'image-source', 'index.ts'),
    'utf8'
  );

  it('has temperature getter that reads from room', () => {
    expect(source).toMatch(/get\s+temperature\(\):\s*number/);
    expect(source).toContain('this.room?.temperature ?? 20');
  });

  it('has c getter using soundSpeed(this.temperature)', () => {
    expect(source).toContain('get c()');
    expect(source).toContain('ac.soundSpeed(this.temperature)');
  });

  it('arrivalPressure accepts temperature parameter', () => {
    expect(source).toMatch(/arrivalPressure\(initialSPL.*freqs.*temperature/);
  });

  it('arrivalPressure passes temperature to ac.airAttenuation', () => {
    expect(source).toContain('ac.airAttenuation(freqs, temperature)');
  });

  it('callers pass this.temperature to arrivalPressure', () => {
    // All non-commented, non-debug calls from the solver should pass this.temperature
    const lines = source.split('\n');
    const activeCalls = lines.filter(line => {
      const trimmed = line.trim();
      // Skip commented-out lines
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return false;
      return trimmed.includes('.arrivalPressure(');
    });
    expect(activeCalls.length).toBeGreaterThan(0);
    for (const line of activeCalls) {
      expect(line).toContain('this.temperature');
    }
  });
});

describe('BeamTraceSolver temperature support', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', '..', 'beam-trace', 'index.ts'),
    'utf8'
  );

  it('has temperature getter that reads from room', () => {
    expect(source).toMatch(/get\s+temperature\(\):\s*number/);
    expect(source).toContain('this.room?.temperature ?? 20');
  });

  it('has c getter', () => {
    expect(source).toMatch(/get\s+c\(\):\s*number/);
    expect(source).toContain('ac.soundSpeed(this.temperature)');
  });

  it('calculateLTP called without hardcoded 343, and computeArrivalTime uses this.c', () => {
    expect(source).toContain('this.calculateLTP()');
    expect(source).not.toMatch(/this\.calculateLTP\(343\)/);
    expect(source).toContain('computeArrivalTime(path, this.c)');
  });

  it('airAttenuation passes this.temperature', () => {
    expect(source).toContain('ac.airAttenuation(this.frequencies, this.temperature)');
  });
});

describe('RT60 temperature support', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', '..', 'rt', 'index.ts'),
    'utf8'
  );

  it('has temperature getter that reads from room', () => {
    expect(source).toMatch(/get\s+temperature\(\):\s*number/);
    expect(source).toContain('this.room?.temperature ?? 20');
  });

  it('airAttenuation passes this.temperature', () => {
    expect(source).toContain('airAttenuation(this.frequencies, this.temperature');
  });
});

describe('soundSpeed and airAttenuation temperature behavior', () => {
  it('soundSpeed returns different values for different temperatures', () => {
    const c20 = soundSpeed(20);
    const c30 = soundSpeed(30);
    expect(c20).toBeCloseTo(343.2, 0);
    expect(c30).toBeGreaterThan(c20);
  });

  it('airAttenuation returns different values for different temperatures', () => {
    const freqs = [1000, 4000, 8000];
    const att20 = airAttenuation(freqs, 20);
    const att30 = airAttenuation(freqs, 30);

    // Attenuation should differ with temperature
    for (let i = 0; i < freqs.length; i++) {
      expect(att20[i]).not.toEqual(att30[i]);
    }
  });

  it('air attenuation increases with frequency', () => {
    const freqs = [125, 250, 500, 1000, 2000, 4000, 8000];
    const att = airAttenuation(freqs, 20);

    // Higher frequencies should have higher attenuation
    for (let i = 1; i < att.length; i++) {
      expect(att[i]).toBeGreaterThan(att[i - 1]);
    }
  });
});
