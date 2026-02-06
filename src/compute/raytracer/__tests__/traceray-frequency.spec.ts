/**
 * Tests for traceRay frequency parameter propagation.
 *
 * Bug: When traceRay recursed (ray bounced off a surface), the frequency
 * argument was hardcoded to 4000 instead of passing through the original
 * `frequency` parameter. This meant all recursive bounces computed
 * reflection losses at 4000 Hz regardless of the actual frequency.
 *
 * Fix: Pass the `frequency` parameter through the recursive call.
 *
 * Since traceRay requires full Three.js scene infrastructure, these tests
 * verify the fix at the code/contract level rather than full integration.
 */

describe('traceRay frequency propagation', () => {
  it('demonstrates that frequency-dependent absorption varies across bands', () => {
    // Typical material: absorption varies significantly with frequency
    // If all bounces use 4000 Hz, low-frequency behavior is completely wrong
    const absorptions: Record<number, number> = {
      125: 0.10,  // Low frequency: very reflective
      500: 0.30,  // Mid frequency: moderate
      2000: 0.60, // High frequency: absorptive
      4000: 0.80, // The hardcoded frequency: very absorptive
    };

    // After N bounces with reflection coefficient (1-α)^N
    const bounces = 5;
    const energyAfterBounces = (freq: number) => (1 - absorptions[freq]) ** bounces;

    // Using 4000 Hz: (1 - 0.8)^5 = 0.2^5 = 0.00032
    // Using 125 Hz:  (1 - 0.1)^5 = 0.9^5 = 0.590
    expect(energyAfterBounces(4000)).toBeCloseTo(0.00032, 4);
    expect(energyAfterBounces(125)).toBeCloseTo(0.590, 2);

    // The ratio shows the bug's impact: >1000x error at 125 Hz
    const ratio = energyAfterBounces(125) / energyAfterBounces(4000);
    expect(ratio).toBeGreaterThan(1000);
  });

  it('verifies the recursive call signature passes frequency through', () => {
    // This test reads the source code to verify the fix
    // The recursive call should use `frequency` not `4000`
    const fs = require('fs');
    const path = require('path');

    const sourceFile = fs.readFileSync(
      path.resolve(__dirname, '..', 'index.ts'),
      'utf8'
    );

    // Find the recursive traceRay call — the last argument before the closing ");"
    // The multi-line call ends with `chain,\n  frequency,\n );`
    const recursiveCallPattern = /return\s+this\.traceRay\([\s\S]*?chain,\s*(frequency|4000),?\s*\)/;
    const match = sourceFile.match(recursiveCallPattern);

    expect(match).not.toBeNull();
    expect(match![1]).toBe('frequency');
  });

  it('the function signature has frequency as the last parameter with default 4000', () => {
    const fs = require('fs');
    const path = require('path');

    const sourceFile = fs.readFileSync(
      path.resolve(__dirname, '..', 'index.ts'),
      'utf8'
    );

    // The traceRay signature should have frequency as a parameter
    const signaturePattern = /traceRay\([^)]*frequency\s*=\s*4000[^)]*\)/s;
    expect(sourceFile).toMatch(signaturePattern);
  });

  it('energy loss is frequency-dependent in real room acoustics', () => {
    // Demonstrate why this bug matters acoustically:
    // A carpet absorbs ~2% at 125 Hz but ~65% at 4000 Hz
    // Using 4000 Hz for all bounces makes low frequencies appear
    // far more absorbed than they actually are
    const carpet = {
      125: 0.02,
      250: 0.06,
      500: 0.14,
      1000: 0.37,
      2000: 0.60,
      4000: 0.65,
    };

    const bounces = 3;

    // Correct: each frequency uses its own absorption
    const correct125 = (1 - carpet[125]) ** bounces;  // 0.98^3 = 0.941
    const correct4000 = (1 - carpet[4000]) ** bounces; // 0.35^3 = 0.043

    // Buggy: all frequencies forced to use 4000 Hz absorption
    const buggy125 = (1 - carpet[4000]) ** bounces; // 0.35^3 = 0.043

    // The bug makes 125 Hz appear 22x more absorbed than it should be
    expect(correct125 / buggy125).toBeGreaterThan(20);

    // Correct behavior preserves the wide frequency-dependent range
    expect(correct125).toBeGreaterThan(0.9);
    expect(correct4000).toBeLessThan(0.05);
  });
});
