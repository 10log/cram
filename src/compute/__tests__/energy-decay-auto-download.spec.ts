/**
 * @jest-environment jsdom
 *
 * Issue #39: Remove auto-download CSV from calculateAcParams
 *
 * The calculateAcParams() method automatically called downloadResultsAsCSV()
 * every time it ran, triggering an unwanted file download on every calculation.
 * Download should be an explicit user action, not a side effect of calculation.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Issue #39: Remove auto-download from calculateAcParams', () => {
  const filePath = path.resolve(__dirname, '../energy-decay.ts');
  const source = fs.readFileSync(filePath, 'utf-8');

  test('calculateAcParams should NOT call downloadResultsAsCSV', () => {
    // Extract the calculateAcParams method body
    const methodMatch = source.match(/calculateAcParams\s*\(\s*\)\s*\{([\s\S]*?)\n\s{4}\}/);
    expect(methodMatch).not.toBeNull();
    const methodBody = methodMatch![1];

    // It should not contain a call to downloadResultsAsCSV
    expect(methodBody).not.toContain('downloadResultsAsCSV');
  });

  test('downloadResultsAsCSV method should still exist for explicit use', () => {
    // The method itself should remain available
    expect(source).toContain('downloadResultsAsCSV()');
  });

  test('calculateAcParams should still compute T15, T20, T30 values', () => {
    const methodMatch = source.match(/calculateAcParams\s*\(\s*\)\s*\{([\s\S]*?)\n\s{4}\}/);
    expect(methodMatch).not.toBeNull();
    const methodBody = methodMatch![1];

    // Core computation should remain
    expect(methodBody).toContain('calculateOctavebandBackwardsIntegration');
    expect(methodBody).toContain('calculateRTFromDecay');
    expect(methodBody).toContain('this.T15');
    expect(methodBody).toContain('this.T20');
    expect(methodBody).toContain('this.T30');
  });

  test('demonstrates the side-effect problem: calculation should be pure computation', () => {
    // In the fixed version, calculateAcParams is responsible only for:
    // 1. Checking that IR data is loaded
    // 2. Running octaveband backwards integration
    // 3. Computing T15, T20, T30 from decay curves
    // 4. Logging results (acceptable for debugging)
    //
    // It should NOT trigger file I/O (downloading CSV).
    // The download should be triggered separately by the user.

    const methodMatch = source.match(/calculateAcParams\s*\(\s*\)\s*\{([\s\S]*?)\n\s{4}\}/);
    const methodBody = methodMatch![1];

    // Should not contain any file save/download operations
    expect(methodBody).not.toContain('FileSaver');
    expect(methodBody).not.toContain('saveAs');
    expect(methodBody).not.toContain('download');
    expect(methodBody).not.toContain('Blob');
  });
});
