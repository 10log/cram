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
  const filePath = path.resolve(__dirname, '../arrival-pressure.ts');
  const source = fs.readFileSync(filePath, 'utf-8');

  test('arrivalPressure uses reflectionFunction instead of 1 - absorptionFunction', () => {
    expect(source).toContain('reflectionFunction(');
    expect(source).toContain('hit.angle');
    expect(source).not.toMatch(/1\s*-\s*.*absorptionFunction/);
  });

  test('arrivalPressure does not contain commented-out reflectionFunction code', () => {
    expect(source).not.toContain('@ts-ignore');
    expect(source).not.toMatch(/\/\/.*reflectionFunction/);
  });

  test('reflectionFunction result is wrapped with Math.abs', () => {
    expect(source).toMatch(/Math\.abs\(.*reflectionFunction/);
  });
});
