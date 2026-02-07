/**
 * @jest-environment jsdom
 *
 * Issue #65: Use angle-dependent reflection coefficient in arrivalPressure
 *
 * The image source solver's arrivalPressure method was using the incorrect
 * normal-incidence energy approximation `1 - absorptionFunction(freq)` instead
 * of the angle-dependent `reflectionFunction(freq, angle)`. The incidence angle
 * is already stored in each intersection's `angle` field.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Issue #65: angle-dependent reflection in image source arrivalPressure', () => {
  const filePath = path.resolve(__dirname, '../index.ts');
  const source = fs.readFileSync(filePath, 'utf-8');

  test('arrivalPressure uses reflectionFunction instead of 1 - absorptionFunction', () => {
    // Extract the arrivalPressure method body
    const methodMatch = source.match(/arrivalPressure\([\s\S]*?^\s{2}\}/m);
    expect(methodMatch).not.toBeNull();
    const methodBody = methodMatch![0];

    // Should use reflectionFunction with angle
    expect(methodBody).toContain('reflectionFunction(');
    expect(methodBody).toContain('intersection.angle');

    // Should NOT use the old 1 - absorptionFunction pattern
    expect(methodBody).not.toMatch(/1\s*-\s*.*absorptionFunction/);
  });

  test('arrivalPressure does not contain commented-out reflectionFunction code', () => {
    // The old code had the correct line commented out with // @ts-ignore
    // Ensure the @ts-ignore and commented-out code are gone
    const methodMatch = source.match(/arrivalPressure\([\s\S]*?^\s{2}\}/m);
    expect(methodMatch).not.toBeNull();
    const methodBody = methodMatch![0];

    expect(methodBody).not.toContain('@ts-ignore');
    expect(methodBody).not.toMatch(/\/\/.*reflectionFunction/);
  });

  test('reflectionFunction result is wrapped with Math.abs', () => {
    const methodMatch = source.match(/arrivalPressure\([\s\S]*?^\s{2}\}/m);
    expect(methodMatch).not.toBeNull();
    const methodBody = methodMatch![0];

    // Should wrap the result in Math.abs for safety
    expect(methodBody).toMatch(/Math\.abs\(.*reflectionFunction/);
  });
});
