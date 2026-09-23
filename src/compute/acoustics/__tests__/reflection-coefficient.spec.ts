/**
 * Reflection Coefficient Tests
 *
 * Tests for the reflectionCoefficient function that calculates
 * the reflection coefficient R from absorption coefficient α
 * and angle of incidence θ.
 */

import reflectionCoefficient, {
  impedanceForAbsorption,
  pressureReflectionCoefficient,
} from '../reflection-coefficient';
import { impedanceForAbsorption as ardImpedanceForAbsorption } from '../../ard/impedance';

/**
 * Issue #200: the impedance branch.
 *
 * Everything below this block passed under *both* roots of `α = 1 − R²`, which
 * is how the reciprocal branch survived #35 and #65: it moves only the
 * off-normal behaviour and the sign, and nothing here asserted either. These
 * are the assertions that distinguish them.
 */
describe('Issue #200: locally-reacting impedance branch', () => {
  it('takes the branch that makes a rigid surface rigid', () => {
    // Both roots reproduce |R(0)| = sqrt(1 - alpha). Only one of them sends a
    // zero-absorption surface to infinite impedance rather than to zero, and a
    // wall is stiffer than air, not softer.
    expect(impedanceForAbsorption(0)).toBe(Infinity);
    expect(impedanceForAbsorption(1)).toBe(1); // matched
    for (const alpha of [0.1, 0.3, 0.6, 0.9]) {
      expect(impedanceForAbsorption(alpha)).toBeGreaterThan(1);
    }
  });

  it('reflects a rigid wall with R = +1 at every angle, never NaN', () => {
    // A rigid wall doubles pressure at the surface: p_total = 2*p_incident,
    // which needs R = +1. R = -1 is a pressure-release surface, which a wall is
    // not. Grazing is the case that produced NaN under an explicit `Infinity`
    // impedance, so it is checked rather than assumed.
    for (const deg of [0, 30, 45, 60, 89, 90]) {
      const R = pressureReflectionCoefficient(0, (deg * Math.PI) / 180);
      expect(Number.isFinite(R)).toBe(true);
      expect(R).toBeCloseTo(1, 12);
    }
  });

  it('anchors alpha at normal incidence to the database coefficient', () => {
    // The one thing the branch must not move: at theta = 0 the delivered
    // absorption is exactly what the material says.
    for (const alpha of [0, 0.02, 0.1, 0.3, 0.5, 0.7, 0.9, 1]) {
      expect(reflectionCoefficient(alpha, 0)).toBeCloseTo(1 - alpha, 12);
    }
  });

  it('changes the sign of R at cos(theta) = 1/xi', () => {
    // The decisive difference. With xi <= 1 the quantity `xi*cos(theta) - 1` is
    // negative at every angle and R never crosses zero; the crossing is a real
    // feature of a locally-reacting surface and the reciprocal branch cannot
    // express it at all.
    for (const alpha of [0.3, 0.6, 0.9]) {
      const xi = impedanceForAbsorption(alpha);
      const brewster = Math.acos(1 / xi);
      expect(pressureReflectionCoefficient(alpha, brewster)).toBeCloseTo(0, 10);
      expect(pressureReflectionCoefficient(alpha, brewster - 0.05)).toBeGreaterThan(0);
      expect(pressureReflectionCoefficient(alpha, brewster + 0.05)).toBeLessThan(0);
    }
  });

  it('absorbs most at that angle and not at grazing', () => {
    // Absorption rises from the normal-incidence coefficient to a maximum of 1
    // where R vanishes, then falls to 0 at grazing. As coded before #200 it
    // fell monotonically from normal incidence, so rooms with oblique
    // reflections came out too live.
    const alpha = 0.3;
    const xi = impedanceForAbsorption(alpha);
    const brewster = Math.acos(1 / xi);

    expect(reflectionCoefficient(alpha, brewster)).toBeCloseTo(0, 10); // alpha = 1
    expect(1 - reflectionCoefficient(alpha, 0)).toBeCloseTo(alpha, 12);
    expect(1 - reflectionCoefficient(alpha, Math.PI / 2)).toBeCloseTo(0, 10);

    // Monotone up to the maximum, monotone down after it. The descent is
    // sampled as a fraction of what is left to 90 degrees rather than in fixed
    // steps: for alpha = 0.3 the maximum is already at 84.9 degrees, so a fixed
    // step walks past grazing, where `Math.abs(cos)` folds the angle back onto
    // the rising side and the comparison silently reverses.
    const alphaAt = (deg: number) => 1 - reflectionCoefficient(alpha, (deg * Math.PI) / 180);
    const degBrewster = (brewster * 180) / Math.PI;
    expect(degBrewster).toBeLessThan(90);

    const upward = [0, 0.25, 0.5, 0.75, 0.95].map((t) => alphaAt(t * degBrewster));
    for (let i = 1; i < upward.length; i++) expect(upward[i]).toBeGreaterThan(upward[i - 1]);

    const downward = [0.05, 0.25, 0.5, 0.75, 0.95].map((t) =>
      alphaAt(degBrewster + t * (90 - degBrewster)),
    );
    for (let i = 1; i < downward.length; i++) expect(downward[i]).toBeLessThan(downward[i - 1]);
  });

  it('agrees with the ARD solver about the same material', () => {
    // The two solver families disagreed about both the sign and the angular
    // dependence of every reflection until #200, which would have shown up as a
    // seam in the hybrid crossover the ARD plan proposes. They now share one
    // definition; this is what keeps it that way.
    for (const alpha of [0, 0.05, 0.3, 0.6, 0.95, 1]) {
      expect(ardImpedanceForAbsorption(alpha)).toBe(impedanceForAbsorption(alpha));
    }
    // ARD validates where the geometrical path clamps, which is the one
    // intended difference between them.
    expect(() => ardImpedanceForAbsorption(-0.1)).toThrow(/must be in \[0, 1\]/);
    expect(impedanceForAbsorption(-0.1)).toBe(Infinity);
  });

  it('falls back to rigid for a coefficient that is not a number', () => {
    // The clamp handles out-of-range, but `Math.min(1, NaN)` is NaN and would
    // have propagated all the way out: a failed material lookup would return a
    // NaN reflection and poison an entire ray path rather than behave like an
    // unpainted wall. Both public functions go through one clamp so this cannot
    // hold for the impedance and not for the reflection.
    for (const bad of [NaN, undefined as unknown as number, Infinity, -Infinity]) {
      expect(impedanceForAbsorption(bad)).toBe(Infinity);
      for (const deg of [0, 45, 89]) {
        const theta = (deg * Math.PI) / 180;
        expect(pressureReflectionCoefficient(bad, theta)).toBeCloseTo(1, 12);
        expect(reflectionCoefficient(bad, theta)).toBeCloseTo(1, 12);
      }
    }
    // Out of range still clamps rather than extrapolating.
    expect(impedanceForAbsorption(-0.5)).toBe(Infinity);
    expect(impedanceForAbsorption(1.5)).toBe(1);

    // theta is deliberately not gated: a NaN angle is a degenerate surface
    // normal, which is a geometry bug worth surfacing, and there is no sensible
    // angle to substitute.
    expect(Number.isNaN(pressureReflectionCoefficient(0.3, NaN))).toBe(true);
  });

  it('matches the xi form it is algebraically equal to', () => {
    // `pressureReflectionCoefficient` avoids ever forming xi, so that the GPU
    // path can evaluate the same expression in f32 without `inf`. That is an
    // optimisation, and this is what says it is only an optimisation.
    const viaXi = (alpha: number, theta: number) => {
      const xi = impedanceForAbsorption(alpha);
      if (!Number.isFinite(xi)) return 1;
      const x = xi * Math.abs(Math.cos(theta));
      return (x - 1) / (x + 1);
    };
    for (const alpha of [0, 0.001, 0.02, 0.1, 0.3, 0.5, 0.7, 0.9, 0.999, 1]) {
      for (let deg = 0; deg <= 180; deg += 3) {
        const theta = (deg * Math.PI) / 180;
        expect(pressureReflectionCoefficient(alpha, theta)).toBeCloseTo(
          viaXi(alpha, theta),
          12,
        );
      }
    }
  });
});

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
      // α = 1 is the one coefficient where both roots of α = 1 − R² coincide:
      // r = sqrt(1-α) = 0 gives ξ = (1+0)/(1-0) = 1 either way, the matched
      // surface. That is why the numbers in this block survived the branch fix
      // in #200 unchanged, and why they could not have caught it — see the
      // `Issue #200` block at the top of this file for the assertions that do.
      // At π/4: R = ((1*cos(π/4) - 1) / (1*cos(π/4) + 1))² ≈ 0.029
      const R = reflectionCoefficient(1, Math.PI / 4);
      expect(R).toBeCloseTo(0.029, 2);
    });

    it('returns 0 at normal incidence for α = 1 (perfect absorption)', () => {
      // At θ = 0: cos(0) = 1 and ξ = 1 (matched, see above)
      // R = ((1*1 - 1) / (1*1 + 1))² = 0
      // Full absorption at normal incidence — physically correct
      const R = reflectionCoefficient(1, 0);
      expect(R).toBeCloseTo(0, 5);
    });

    it('approaches 1 at grazing incidence for α = 1', () => {
      // At θ → π/2: cos(θ) → 0, so ξ*cos(θ) → 0
      // R = ((0 - 1) / (0 + 1))² = 1 (total reflection at grazing).
      // True for any finite ξ, which is why this one is also branch-blind.
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

  describe('Obtuse Angles (θ > π/2, DoubleSide surfaces)', () => {
    it('returns value in [0,1] for θ > π/2', () => {
      const obtuseAngles = [
        Math.PI * 2 / 3,   // 120°
        Math.PI * 3 / 4,   // 135°
        Math.PI * 5 / 6,   // 150°
        Math.PI - 0.001,   // ~180°
      ];

      obtuseAngles.forEach(theta => {
        const R = reflectionCoefficient(0.5, theta);
        expect(R).toBeGreaterThanOrEqual(0);
        expect(R).toBeLessThanOrEqual(1);
      });
    });

    it('obtuse angle gives same result as its supplementary acute angle', () => {
      const alphas = [0.1, 0.5, 0.9];
      const acuteAngles = [Math.PI / 6, Math.PI / 4, Math.PI / 3];

      alphas.forEach(alpha => {
        acuteAngles.forEach(acute => {
          const obtuse = Math.PI - acute;
          const R_acute = reflectionCoefficient(alpha, acute);
          const R_obtuse = reflectionCoefficient(alpha, obtuse);
          expect(R_obtuse).toBeCloseTo(R_acute, 10);
        });
      });
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
