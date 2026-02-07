/**
 * Regression test for traceRay frequency parameter propagation.
 *
 * Original bug: The recursive traceRay call hardcoded 4000 instead of passing
 * through the `frequency` parameter, so all bounces computed reflection
 * losses at 4000 Hz regardless of the actual band.
 *
 * Phase 2 fix: The scalar `frequency` parameter was removed entirely.
 * Per-band energy is now tracked via a `bandEnergy` array, and reflection
 * losses are computed for all bands at each bounce using `this.frequencies`.
 *
 * This test verifies the new per-band approach is in place.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('traceRay frequency propagation', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', 'index.ts'),
    'utf8'
  );

  const rayCoreSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'ray-core.ts'),
    'utf8'
  );

  it('traceRay signature uses bandEnergy instead of scalar frequency', () => {
    // The traceRay method should have bandEnergy in its signature
    const signatureMatch = source.match(/traceRay\(([\s\S]*?)\)\s*\{/);
    expect(signatureMatch).not.toBeNull();

    const params = signatureMatch![1];
    expect(params).toContain('bandEnergy');
    // The old `frequency = 4000` parameter should be gone
    expect(params).not.toMatch(/frequency\s*=\s*4000/);
  });

  it('recursive traceRay call passes newBandEnergy, not a scalar', () => {
    // Match the recursive call: `return this.traceRay(` ... `);`
    const match = rayCoreSource.match(/return\s+traceRay\(([\s\S]*?)\);/);
    expect(match).not.toBeNull();

    const argString = match![1];
    // Should contain newBandEnergy, not a scalar energy or frequency
    expect(argString).toContain('newBandEnergy');
    // Should NOT contain a frequency argument
    expect(argString).not.toMatch(/\bfrequency\b/);
  });
});
