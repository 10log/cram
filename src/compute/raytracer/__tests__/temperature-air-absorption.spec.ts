/**
 * Tests for Phase 4: per-segment air absorption during propagation
 * and temperature support across solvers.
 *
 * Verifies that:
 * - RayTracer has temperature property, c getter, and cached air attenuation
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

  const typesSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'types.ts'),
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

  // --- Temperature property ---

  it('RayTracerParams includes optional temperature', () => {
    const paramsMatch = typesSource.match(/export\s+interface\s+RayTracerParams\s*\{([\s\S]*?)\}/);
    expect(paramsMatch).not.toBeNull();
    expect(paramsMatch![1]).toContain('temperature');
  });

  it('defaults include temperature: 20', () => {
    const defaultsMatch = typesSource.match(/export\s+const\s+defaults\s*=\s*\{([\s\S]*?)\};/);
    expect(defaultsMatch).not.toBeNull();
    expect(defaultsMatch![1]).toMatch(/temperature:\s*20/);
  });

  it('class declares temperature property', () => {
    expect(source).toMatch(/temperature:\s*number/);
  });

  it('class declares _cachedAirAtt property', () => {
    expect(source).toContain('_cachedAirAtt');
  });

  it('has c getter using soundSpeed(this._temperature)', () => {
    expect(source).toMatch(/get\s+c\(\):\s*number\s*\{/);
    expect(source).toContain('ac.soundSpeed(this._temperature)');
  });

  it('has temperature setter that recomputes cached air attenuation', () => {
    expect(source).toMatch(/set\s+temperature\(value:\s*number\)/);
    expect(source).toContain('this._cachedAirAtt = ac.airAttenuation(this.frequencies, value)');
  });

  it('save() includes temperature', () => {
    const saveMatch = source.match(/save\(\)\s*\{([\s\S]*?)\n\s*\}/);
    expect(saveMatch).not.toBeNull();
    expect(saveMatch![1]).toContain('temperature');
  });

  it('RayTracerSaveObject type includes temperature', () => {
    const saveTypeMatch = typesSource.match(/export\s+type\s+RayTracerSaveObject\s*=\s*\{([\s\S]*?)\}/);
    expect(saveTypeMatch).not.toBeNull();
    expect(saveTypeMatch![1]).toContain('temperature');
  });

  // --- Cached air attenuation ---

  it('caches air attenuation in constructor', () => {
    expect(source).toContain('this._cachedAirAtt = ac.airAttenuation(this.frequencies, this._temperature)');
  });

  it('refreshes cached air attenuation in start()', () => {
    const startMatch = source.match(/start\(\)\s*\{([\s\S]*?)startAllMonteCarlo/);
    expect(startMatch).not.toBeNull();
    expect(startMatch![1]).toContain('this._cachedAirAtt = ac.airAttenuation(this.frequencies, this._temperature)');
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

  it('hybrid ImageSourceSolver params include temperature', () => {
    expect(source).toContain('temperature: this.temperature,');
  });
});

describe('ImageSourceSolver temperature in airAttenuation', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', 'image-source', 'index.ts'),
    'utf8'
  );

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

  it('has temperature in params interface', () => {
    const paramsMatch = source.match(/interface\s+BeamTraceSolverParams\s*\{([\s\S]*?)\}/);
    expect(paramsMatch).not.toBeNull();
    expect(paramsMatch![1]).toContain('temperature');
  });

  it('has temperature class property', () => {
    expect(source).toMatch(/temperature:\s*number/);
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

  it('save includes temperature', () => {
    const saveMatch = source.match(/save\(\)[\s\S]*?pickProps\(\[([\s\S]*?)\]/);
    expect(saveMatch).not.toBeNull();
    expect(saveMatch![1]).toContain('"temperature"');
  });

  it('restore sets temperature with fallback', () => {
    expect(source).toMatch(/this\.temperature\s*=\s*state\.temperature\s*\?\?\s*20/);
  });
});

describe('RT60 temperature support', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', '..', 'rt', 'index.ts'),
    'utf8'
  );

  it('has temperature class property', () => {
    expect(source).toMatch(/public\s+temperature:\s*number/);
  });

  it('airAttenuation passes this.temperature', () => {
    expect(source).toContain('airAttenuation(this.frequencies, this.temperature)');
  });

  it('save includes temperature', () => {
    const saveMatch = source.match(/save\(\)\s*\{([\s\S]*?)\n\s*\}/);
    expect(saveMatch).not.toBeNull();
    expect(saveMatch![1]).toContain('temperature');
  });

  it('restore sets temperature with fallback', () => {
    expect(source).toMatch(/this\.temperature\s*=\s*state\.temperature\s*\?\?\s*20/);
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
