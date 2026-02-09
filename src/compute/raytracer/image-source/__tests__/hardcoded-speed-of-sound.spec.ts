/**
 * @jest-environment jsdom
 *
 * Issue #41: Replace hardcoded 343 m/s speed of sound in image source solver
 *
 * The image source solver had the speed of sound hardcoded as 343 m/s in
 * multiple locations. This is only accurate at ~20°C. The fix adds a
 * temperature property and uses ac.soundSpeed(temperature) to compute the
 * correct speed of sound dynamically.
 */

import * as fs from 'fs';
import * as path from 'path';
import { soundSpeed } from '../../../acoustics/sound-speed';

describe('Issue #41: Replace hardcoded 343 speed of sound', () => {
  const filePath = path.resolve(__dirname, '../index.ts');
  const source = fs.readFileSync(filePath, 'utf-8');

  test('no hardcoded 343 values remain in image source solver', () => {
    // The literal number 343 should not appear as a speed of sound value
    // We match word-boundary 343 to avoid matching it inside other numbers
    const matches = source.match(/\b343\b/g);
    expect(matches).toBeNull();
  });

  test('ImageSourceSolver has a temperature getter from Room', () => {
    // Temperature now lives on Room and is accessed via getter
    expect(source).toMatch(/get\s+temperature\(\):\s*number/);
    expect(source).toContain('this.room?.temperature ?? 20');
  });

  test('ImageSourceSolver has a speed of sound getter using ac.soundSpeed', () => {
    expect(source).toContain('get c()');
    expect(source).toContain('ac.soundSpeed(this.temperature)');
  });

  test('calculateLTP uses speed of sound parameter (not hardcoded)', () => {
    // The calculateLTP method should default to this.c
    const ltpMatch = source.match(/calculateLTP\(c:\s*number\s*=\s*this\.c/);
    expect(ltpMatch).not.toBeNull();
  });

  test('calculateImpulseResponse uses this.c (cached as local const)', () => {
    const irSection = source.match(/async calculateImpulseResponse[\s\S]*?^\s{4}\}/m);
    expect(irSection).not.toBeNull();
    // Should cache this.c and use it, not a literal
    expect(irSection![0]).toMatch(/const c = this\.c/);
    expect(irSection![0]).not.toMatch(/arrivalTime\(\s*343\s*\)/);
  });

  test('event handler for CALCULATE_LTP calls calculateLTP without hardcoded value', () => {
    const eventLine = source.match(/on\("CALCULATE_LTP".*calculateLTP\(\)/);
    expect(eventLine).not.toBeNull();
  });

  // Validate the soundSpeed function produces correct values
  test('soundSpeed(20) ≈ 343 m/s (validates the replacement)', () => {
    const c = soundSpeed(20);
    expect(c).toBeCloseTo(343.2, 0); // 20.05 * sqrt(293.15) ≈ 343.2
  });

  test('soundSpeed varies correctly with temperature', () => {
    const c0 = soundSpeed(0);    // freezing
    const c20 = soundSpeed(20);  // room temp
    const c30 = soundSpeed(30);  // warm

    // Speed increases with temperature
    expect(c0).toBeLessThan(c20);
    expect(c20).toBeLessThan(c30);

    // At 0°C, c ≈ 331.3 m/s
    expect(c0).toBeCloseTo(331.3, 0);
  });

  test('returnSortedPathsForHybrid still accepts speed of sound as parameter', () => {
    // The hybrid interface should still allow passing custom speed
    expect(source).toContain('returnSortedPathsForHybrid(c: number');
  });
});
