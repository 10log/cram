/**
 * @jest-environment jsdom
 *
 * Issue #40: Clamp negative cos(theta) in scattered energy
 *
 * When theta > π/2 (receiver behind the surface), cos(theta) becomes negative,
 * producing negative energy values which are physically impossible for diffuse
 * scattered energy. The fix clamps cos(theta) to a minimum of 0.
 */

import { scatteredEnergy } from '../scattered-energy';

describe('Issue #40: Clamp negative cos(theta) in scattered energy', () => {

  // Standard test case: theta within valid hemisphere
  it('returns positive energy for receiver in front of surface (theta < π/2)', () => {
    const energy = scatteredEnergy(1.0, 0.1, 0.5, Math.PI / 4, 0);
    expect(energy).toBeGreaterThan(0);
  });

  it('returns positive energy for theta = π/4', () => {
    const energy = scatteredEnergy(1.0, 0.1, 0.5, Math.PI / 4, Math.PI / 4);
    expect(energy).toBeGreaterThan(0);
  });

  // Critical bug test: theta > π/2 should yield zero, not negative energy
  it('returns zero (not negative) energy when receiver is behind surface (theta > π/2)', () => {
    const energy = scatteredEnergy(1.0, 0.1, 0.5, Math.PI / 4, (3 * Math.PI) / 4);
    expect(energy).toBe(0);
  });

  it('returns zero energy when theta = π (directly behind)', () => {
    const energy = scatteredEnergy(1.0, 0.1, 0.5, Math.PI / 4, Math.PI);
    expect(energy).toBe(0);
  });

  it('returns zero energy at exactly theta = π/2 (grazing)', () => {
    const energy = scatteredEnergy(1.0, 0.1, 0.5, Math.PI / 4, Math.PI / 2);
    // cos(π/2) ≈ 0, so energy should be essentially 0
    expect(energy).toBeCloseTo(0, 10);
  });

  // Demonstrate the buggy behavior would produce negative values
  it('buggy version would produce negative energy for theta > π/2', () => {
    // Without the clamp, cos(3π/4) = -√2/2 ≈ -0.707
    // This would make the entire result negative
    const theta = (3 * Math.PI) / 4;
    const rawCosTheta = Math.cos(theta);
    expect(rawCosTheta).toBeLessThan(0); // confirms the bug scenario

    // But the fixed function should return >= 0
    const energy = scatteredEnergy(1.0, 0.1, 0.5, Math.PI / 4, theta);
    expect(energy).toBe(0);
  });

  // Physical validation: Lambert's cosine law
  it('energy follows cosine distribution for valid angles', () => {
    const e0 = scatteredEnergy(1.0, 0.1, 0.5, Math.PI / 4, 0);         // cos(0) = 1
    const e45 = scatteredEnergy(1.0, 0.1, 0.5, Math.PI / 4, Math.PI / 4); // cos(π/4) ≈ 0.707
    const e60 = scatteredEnergy(1.0, 0.1, 0.5, Math.PI / 4, Math.PI / 3); // cos(π/3) = 0.5

    // Energy should decrease with increasing theta
    expect(e0).toBeGreaterThan(e45);
    expect(e45).toBeGreaterThan(e60);

    // Verify the cosine relationship
    expect(e45 / e0).toBeCloseTo(Math.cos(Math.PI / 4), 5);
    expect(e60 / e0).toBeCloseTo(Math.cos(Math.PI / 3), 5);
  });

  // Non-negativity across full range of theta
  it('scattered energy is non-negative across all theta values', () => {
    const incoming = 1.0;
    for (let theta = 0; theta < 2 * Math.PI; theta += 0.1) {
      const energy = scatteredEnergy(incoming, 0.1, 0.5, Math.PI / 4, theta);
      expect(energy).toBeGreaterThanOrEqual(0);
    }
  });
});
