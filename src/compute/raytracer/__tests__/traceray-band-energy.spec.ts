/**
 * Source-scanning tests for per-band energy tracking in the ray tracer.
 *
 * Phase 2 replaced scalar energy with per-band energy arrays (BandEnergy).
 * These tests verify the source code has the expected structure without
 * needing to instantiate the full Three.js/WebGL environment.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('per-band energy tracking', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', 'index.ts'),
    'utf8'
  );

  const typesSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'types.ts'),
    'utf8'
  );

  it('traceRay signature includes bandEnergy parameter', () => {
    const signatureMatch = source.match(/traceRay\(([\s\S]*?)\)\s*\{/);
    expect(signatureMatch).not.toBeNull();
    expect(signatureMatch![1]).toContain('bandEnergy: BandEnergy');
  });

  it('reflection loss iterates over this.frequencies', () => {
    // The per-band reflection calculation should iterate over this.frequencies
    expect(source).toMatch(/this\.frequencies\.map\(\(frequency, f\)/);
    expect(source).toMatch(/surface\.reflectionFunction\(frequency, angle/);
  });

  it('termination uses Math.max(...newBandEnergy)', () => {
    expect(source).toContain('Math.max(...newBandEnergy)');
  });

  it('receiver chain entry includes bandEnergy, RayPath return includes bandEnergy', () => {
    // At least one chain.push (receiver hit) should include bandEnergy
    const chainPushes = source.match(/chain\.push\(\{[\s\S]*?\}\)/g);
    expect(chainPushes).not.toBeNull();
    const hasBandEnergy = chainPushes!.some(push => push.includes('bandEnergy'));
    expect(hasBandEnergy).toBe(true);

    // The RayPath return should include bandEnergy
    const returnMatch = source.match(/return\s*\{[\s\S]*?intersectedReceiver:\s*true[\s\S]*?\}\s*as\s*RayPath/);
    expect(returnMatch).not.toBeNull();
    expect(returnMatch![0]).toContain('bandEnergy');
  });

  it('arrivalPressure has a path.bandEnergy fast path', () => {
    expect(source).toContain('path.bandEnergy && path.bandEnergy.length === freqs.length');
  });

  it('BandEnergy type is exported', () => {
    expect(typesSource).toMatch(/export\s+type\s+BandEnergy\s*=\s*number\[\]/);
  });

  it('RayPath interface includes optional bandEnergy', () => {
    // Extract the RayPath interface block
    const rayPathMatch = typesSource.match(/export\s+interface\s+RayPath\s*\{([\s\S]*?)\}/);
    expect(rayPathMatch).not.toBeNull();
    expect(rayPathMatch![1]).toContain('bandEnergy?: BandEnergy');
  });

  it('Chain interface includes optional bandEnergy', () => {
    // Extract the Chain interface block
    const chainMatch = typesSource.match(/export\s+interface\s+Chain\s*\{([\s\S]*?)\}/);
    expect(chainMatch).not.toBeNull();
    expect(chainMatch![1]).toContain('bandEnergy?: BandEnergy');
  });

  it('step() creates initialBandEnergy array from this.frequencies.length', () => {
    // Phase 5 replaced fill(1) with directivity-weighted values
    expect(source).toContain('new Array(this.frequencies.length)');
  });

  it('frequencies property replaces reflectionLossFrequencies and defaultFrequencies', () => {
    // The old properties should not exist as class declarations
    expect(source).not.toMatch(/reflectionLossFrequencies:\s*number\[\]/);
    expect(source).not.toMatch(/defaultFrequencies:\s*number\[\]/);
    // The new frequencies property should exist
    expect(source).toMatch(/frequencies:\s*number\[\]/);
  });

  it('save() includes frequencies', () => {
    // Find the save method and check it includes frequencies in the destructuring
    const saveMatch = source.match(/save\(\)\s*\{([\s\S]*?)\n\s*\}/);
    expect(saveMatch).not.toBeNull();
    expect(saveMatch![1]).toContain('frequencies');
  });
});
