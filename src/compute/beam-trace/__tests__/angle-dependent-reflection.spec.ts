/**
 * @jest-environment jsdom
 *
 * Issue #65: Use angle-dependent reflection coefficient in beam tracer
 *
 * The beam tracer's calculateArrivalPressure method was using the incorrect
 * normal-incidence energy approximation `1 - absorptionFunction(freq)` instead
 * of the angle-dependent `reflectionFunction(freq, angle)`. The incidence angle
 * is computed from path geometry (specular reflection).
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Issue #65: angle-dependent reflection in beam tracer calculateArrivalPressure', () => {
  const filePath = path.resolve(__dirname, '../index.ts');
  const source = fs.readFileSync(filePath, 'utf-8');

  // Match the method definition (not call sites) by anchoring on the private keyword and signature
  function getMethodBody(): string {
    const methodMatch = source.match(/private calculateArrivalPressure\(initialSPL[\s\S]*?^\s{2}\}/m);
    expect(methodMatch).not.toBeNull();
    return methodMatch![0];
  }

  test('calculateArrivalPressure uses reflectionFunction instead of 1 - absorptionFunction', () => {
    const methodBody = getMethodBody();

    // Should use reflectionFunction
    expect(methodBody).toContain('reflectionFunction(');

    // Should NOT use the old 1 - absorptionFunction pattern
    expect(methodBody).not.toMatch(/1\s*-\s*.*absorptionFunction/);
  });

  test('calculateArrivalPressure computes incidence angle from path geometry', () => {
    const methodBody = getMethodBody();

    // Should compute angle from path points
    expect(methodBody).toContain('path.points');
    // Should use Math.acos for angle computation
    expect(methodBody).toContain('Math.acos');
  });

  test('reflectionFunction result is wrapped with Math.abs', () => {
    const methodBody = getMethodBody();

    expect(methodBody).toMatch(/Math\.abs\(.*reflectionFunction/);
  });
});
