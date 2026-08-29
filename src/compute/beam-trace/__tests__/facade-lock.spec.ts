/**
 * Until #108 finishes the BeamTraceSolver split, production still inlines
 * calculateArrivalPressure in index.ts. Keep a cheap lock so that file
 * cannot drop spreading / reflection / the arrival-pressure import later
 * without a test failing.
 */
import * as fs from 'fs';
import * as path from 'path';

describe('Issue #107: production energy path stays wired', () => {
  const index = fs.readFileSync(path.resolve(__dirname, '../index.ts'), 'utf-8');

  test('index.ts still calls calculateArrivalPressure on LTP/IR paths', () => {
    const calls = index.match(/this\.calculateArrivalPressure\(/g) ?? [];
    expect(calls.length).toBeGreaterThanOrEqual(5);
  });

  test('index.ts still applies spreadingFactor in the inlined method or via arrival-pressure',
    () => {
      const usesHelper = index.includes('from "./arrival-pressure"');
      const inlined = /spreadingFactor\(\s*(path\.length|sPrime)\s*\)/.test(index);
      expect(usesHelper || inlined).toBe(true);
    },
  );
});
