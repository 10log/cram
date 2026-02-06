/**
 * Tests for energy decay console log label correctness.
 *
 * Bug: console.log("T10 Values: ") was followed by console.log(this.T15).
 * The label should say "T15" to match the data being logged.
 *
 * Fix: Change "T10 Values: " to "T15 Values: ".
 */

describe('Energy decay console log labels', () => {
  it('source code uses "T15 Values" label (not "T10")', () => {
    const fs = require('fs');
    const path = require('path');

    const sourceFile = fs.readFileSync(
      path.resolve(__dirname, '..', 'energy-decay.ts'),
      'utf8'
    );

    // Should have T15 label
    expect(sourceFile).toMatch(/console\.log\("T15 Values/);

    // Should NOT have T10 label (there is no T10 in this solver)
    expect(sourceFile).not.toMatch(/console\.log\("T10 Values/);
  });

  it('labels match the variables being logged', () => {
    const fs = require('fs');
    const path = require('path');

    const sourceFile = fs.readFileSync(
      path.resolve(__dirname, '..', 'energy-decay.ts'),
      'utf8'
    );

    // Find the logging section and verify label-data correspondence
    const logSection = sourceFile.match(/console\.log\(filterFreqs\)[\s\S]*?console\.log\(this\.T30\)/);
    expect(logSection).not.toBeNull();

    const section = logSection![0];

    // Verify each label matches its data
    expect(section).toMatch(/T15 Values[\s\S]*?this\.T15/);
    expect(section).toMatch(/T20 Values[\s\S]*?this\.T20/);
    expect(section).toMatch(/T30 Values[\s\S]*?this\.T30/);
  });
});
