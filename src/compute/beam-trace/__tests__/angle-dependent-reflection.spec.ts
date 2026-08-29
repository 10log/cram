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
  const filePath = path.resolve(__dirname, '../arrival-pressure.ts');
  const source = fs.readFileSync(filePath, 'utf-8');

  function getMethodBody(): string {
    const methodMatch = source.match(/export function calculateArrivalPressure\([\s\S]*?^\}\n/m);
    expect(methodMatch).not.toBeNull();
    return methodMatch![0];
  }

  test('calculateArrivalPressure uses reflectionFunction instead of 1 - absorptionFunction', () => {
    const methodBody = getMethodBody();

    expect(methodBody).toContain('reflectionFunction(');
    expect(methodBody).not.toMatch(/1\s*-\s*.*absorptionFunction/);
  });

  test('calculateArrivalPressure computes incidence angle from path geometry', () => {
    const methodBody = getMethodBody();

    expect(methodBody).toContain('path.points');
    expect(methodBody).toContain('Math.acos');
  });

  test('reflectionFunction result is wrapped with Math.abs', () => {
    const methodBody = getMethodBody();

    expect(methodBody).toMatch(/Math\.abs\(.*reflectionFunction/);
  });
});
