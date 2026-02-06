/**
 * Regression test for traceRay frequency parameter propagation.
 *
 * Bug: The recursive traceRay call hardcoded 4000 instead of passing
 * through the `frequency` parameter, so all bounces computed reflection
 * losses at 4000 Hz regardless of the actual band.
 *
 * Fix: Pass `frequency` through the recursive call.
 *
 * The RayTracer class requires a full Three.js scene, WebGL renderer,
 * and BVH acceleration structure, making it impractical to instantiate
 * in Jest. This test scans the source to verify the recursive call
 * passes the frequency parameter rather than a hardcoded literal.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('traceRay frequency propagation', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '..', 'index.ts'),
    'utf8'
  );

  it('recursive traceRay call passes frequency, not a hardcoded literal', () => {
    // Match the recursive call: `return this.traceRay(` ... `);`
    // This is distinct from the initial call which uses `const path = this.traceRay(`
    const match = source.match(/return\s+this\.traceRay\(([\s\S]*?)\);/);

    expect(match).not.toBeNull();

    // Extract the last non-empty argument (handles trailing commas)
    const argString = match![1];
    const args = argString.split(',').map(a => a.trim()).filter(a => a.length > 0);
    const lastArg = args[args.length - 1];

    // Must be the identifier `frequency`, not a numeric literal like `4000`
    expect(lastArg).toBe('frequency');
  });
});
