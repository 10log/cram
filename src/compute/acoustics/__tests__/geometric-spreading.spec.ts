/**
 * Unit tests for ac.spreadingFactor — spherical-wave intensity 1/r²
 * referenced to 1 m (Issue #99).
 */
import { spreadingFactor } from '../geometric-spreading';

describe('spreadingFactor', () => {
  test('1 m reference is unity', () => {
    expect(spreadingFactor(1)).toBeCloseTo(1, 10);
  });

  test('1/r^2', () => {
    expect(spreadingFactor(2)).toBeCloseTo(0.25, 10);
    expect(spreadingFactor(10)).toBeCloseTo(0.01, 10);
  });

  test('clamps r=0 to 1e-3', () => {
    expect(spreadingFactor(0)).toBe(spreadingFactor(1e-3));
    expect(Number.isFinite(spreadingFactor(0))).toBe(true);
  });
});
