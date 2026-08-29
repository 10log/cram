/**
 * Production energy path stays wired through the arrival-pressure module
 * after the #108 split.
 */
import * as fs from 'fs';
import * as path from 'path';

describe('Issue #107/#108: production energy path stays wired', () => {
  const index = fs.readFileSync(path.resolve(__dirname, '../index.ts'), 'utf-8');

  test('index.ts still calls calculateArrivalPressure on LTP/IR paths', () => {
    const calls = index.match(/this\.calculateArrivalPressure\(/g) ?? [];
    expect(calls.length).toBeGreaterThanOrEqual(5);
  });

  test('index.ts delegates spreading to arrival-pressure.ts', () => {
    expect(index.includes('from "./arrival-pressure"')).toBe(true);
    expect(index).toMatch(/return calculateArrivalPressure\(/);
  });
});
