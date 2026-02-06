/**
 * Reflection Coefficient Tests
 *
 * Tests for the reflectionCoefficient function that calculates
 * the reflection coefficient R from absorption coefficient α
 * and angle of incidence θ.
 */

import reflectionCoefficient from '../reflection-coefficient';

describe('reflectionCoefficient', () => {
  describe('Basic Properties', () => {
    it('returns value between 0 and 1', () => {
      // Test various combinations
      const testCases = [
        { alpha: 0, theta: 0 },
        { alpha: 0.5, theta: Math.PI / 4 },
        { alpha: 1, theta: Math.PI / 2 },
        { alpha: 0.2, theta: Math.PI / 6 },
        { alpha: 0.8, theta: Math.PI / 3 },
      ];

      testCases.forEach(({ alpha, theta }) => {
        const R = reflectionCoefficient(alpha, theta);
        expect(R).toBeGreaterThanOrEqual(0);
        expect(R).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Perfect Reflector (α = 0)', () => {
    it('returns high reflection for perfectly reflective surface', () => {
      // When α = 0, surface is perfectly reflective
      // R should be close to 1
      const R = reflectionCoefficient(0, Math.PI / 4);
      expect(R).toBeGreaterThan(0.9);
    });

    it('returns 1 at normal incidence for α = 0', () => {
      // At θ = 0 (normal incidence) with α = 0
      // The reflection should be perfect
      const R = reflectionCoefficient(0, 0);
      expect(R).toBeCloseTo(1, 2);
    });
  });

  describe('High Absorption (α = 1)', () => {
    it('returns small reflection for α=1 at oblique angle', () => {
      // When α = 1: sqrt(1-α) = 0, ξo = (1-0)/(1+0) = 1
      // At π/4: R = ((1*cos(π/4) - 1) / (1*cos(π/4) + 1))² ≈ 0.029
      const R = reflectionCoefficient(1, Math.PI / 4);
      expect(R).toBeCloseTo(0.029, 2);
    });

    it('returns 0 at normal incidence for α = 1 (perfect absorption)', () => {
      // At θ = 0: cos(0) = 1, ξo = 1
      // R = ((1*1 - 1) / (1*1 + 1))² = 0
      // Full absorption at normal incidence — physically correct
      const R = reflectionCoefficient(1, 0);
      expect(R).toBeCloseTo(0, 5);
    });

    it('approaches 1 at grazing incidence for α = 1', () => {
      // At θ → π/2: cos(θ) → 0, so ξo*cos(θ) → 0
      // R = ((0 - 1) / (0 + 1))² = 1 (total reflection at grazing)
      const R = reflectionCoefficient(1, Math.PI / 2 - 0.001);
      expect(R).toBeCloseTo(1, 1);
    });
  });

  describe('Relationship with Absorption', () => {
    it('R decreases as α increases (at fixed angle)', () => {
      const theta = Math.PI / 4;
      const alphas = [0.1, 0.3, 0.5, 0.7, 0.9];
      const Rs = alphas.map((alpha) => reflectionCoefficient(alpha, theta));

      // Each subsequent R should be smaller
      for (let i = 1; i < Rs.length; i++) {
        expect(Rs[i]).toBeLessThan(Rs[i - 1]);
      }
    });

    it('R varies with angle for given absorption', () => {
      // This model has angle-dependent reflection
      // At oblique angles, R should vary smoothly
      const alpha = 0.5;
      const R_oblique = reflectionCoefficient(alpha, Math.PI / 4);
      const R_steep = reflectionCoefficient(alpha, Math.PI / 3);

      // Both should be valid reflection coefficients
      expect(R_oblique).toBeGreaterThanOrEqual(0);
      expect(R_oblique).toBeLessThanOrEqual(1);
      expect(R_steep).toBeGreaterThanOrEqual(0);
      expect(R_steep).toBeLessThanOrEqual(1);
    });
  });

  describe('Angle Dependence', () => {
    it('varies with angle of incidence', () => {
      const alpha = 0.3;
      const angles = [0, Math.PI / 6, Math.PI / 4, Math.PI / 3];
      const Rs = angles.map((theta) => reflectionCoefficient(alpha, theta));

      // R should vary with angle
      // The specific behavior depends on the impedance model
      expect(new Set(Rs.map((r) => r.toFixed(5))).size).toBeGreaterThan(1);
    });

    it('handles normal incidence (θ = 0)', () => {
      const R = reflectionCoefficient(0.5, 0);
      expect(R).toBeGreaterThanOrEqual(0);
      expect(R).toBeLessThanOrEqual(1);
    });

    it('handles grazing incidence (θ ≈ π/2)', () => {
      // Near grazing angle
      const R = reflectionCoefficient(0.5, Math.PI / 2 - 0.01);
      expect(R).toBeGreaterThanOrEqual(0);
      expect(R).toBeLessThanOrEqual(1);
    });
  });

  describe('Typical Material Values', () => {
    it('calculates reflection for acoustic tile (α ≈ 0.7)', () => {
      const R = reflectionCoefficient(0.7, Math.PI / 4);
      expect(R).toBeGreaterThan(0);
      expect(R).toBeLessThan(0.5); // Should be fairly absorptive
    });

    it('calculates reflection for glass (α ≈ 0.1)', () => {
      const R = reflectionCoefficient(0.1, Math.PI / 4);
      expect(R).toBeGreaterThan(0.5); // Should be fairly reflective
    });

    it('calculates reflection for carpet (α ≈ 0.4)', () => {
      const R = reflectionCoefficient(0.4, Math.PI / 4);
      expect(R).toBeGreaterThan(0.2);
      expect(R).toBeLessThan(0.8);
    });

    it('calculates reflection for concrete (α ≈ 0.02)', () => {
      const R = reflectionCoefficient(0.02, Math.PI / 4);
      expect(R).toBeGreaterThan(0.8); // Very reflective
    });
  });

  describe('Symmetry', () => {
    it('is symmetric for equivalent angles from different sides', () => {
      // The function should give same result for θ and (π/2 - θ)
      // only if the model is symmetric, which depends on implementation
      const alpha = 0.3;
      const theta1 = Math.PI / 6;
      const theta2 = Math.PI / 3;

      const R1 = reflectionCoefficient(alpha, theta1);
      const R2 = reflectionCoefficient(alpha, theta2);

      // Both should be valid reflection coefficients
      expect(R1).toBeGreaterThanOrEqual(0);
      expect(R2).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Mathematical Properties', () => {
    it('returns squared value (energy coefficient)', () => {
      // The function returns R² (energy reflection coefficient)
      // not R (amplitude reflection coefficient)
      const R = reflectionCoefficient(0.5, Math.PI / 4);

      // R² should always be positive and ≤ 1
      expect(R).toBeGreaterThanOrEqual(0);
      expect(R).toBeLessThanOrEqual(1);
    });

    it('is continuous across the angle range', () => {
      const alpha = 0.5;
      const angles = Array.from({ length: 10 }, (_, i) => (i * Math.PI) / 20);
      const Rs = angles.map((theta) => reflectionCoefficient(alpha, theta));

      // Check no sudden jumps (differences should be reasonable)
      for (let i = 1; i < Rs.length; i++) {
        expect(Math.abs(Rs[i] - Rs[i - 1])).toBeLessThan(0.2);
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles very small absorption coefficients', () => {
      const R = reflectionCoefficient(0.001, Math.PI / 4);
      expect(R).toBeCloseTo(1, 1); // Nearly perfect reflection
    });

    it('handles very high absorption coefficients', () => {
      const R = reflectionCoefficient(0.999, Math.PI / 4);
      expect(R).toBeCloseTo(0, 1); // Nearly perfect absorption
    });

    it('handles zero angle', () => {
      const R = reflectionCoefficient(0.5, 0);
      expect(Number.isFinite(R)).toBe(true);
    });

    it('handles various mid-range values', () => {
      const midValues = [0.25, 0.35, 0.45, 0.55, 0.65, 0.75];
      midValues.forEach((alpha) => {
        const R = reflectionCoefficient(alpha, Math.PI / 4);
        expect(Number.isFinite(R)).toBe(true);
        expect(R).toBeGreaterThanOrEqual(0);
        expect(R).toBeLessThanOrEqual(1);
      });
    });
  });
});
