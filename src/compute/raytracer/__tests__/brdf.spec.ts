import { BRDF } from '../brdf';

describe('BRDF', () => {
  describe('constructor', () => {
    it('creates a BRDF with default steps', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.5,
        diffusionCoefficient: 0.5
      });

      expect(brdf.steps).toBe(10);
      expect(brdf.coefficients.length).toBe(10);
    });

    it('creates a BRDF with custom steps', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.5,
        diffusionCoefficient: 0.5,
        steps: 20
      });

      expect(brdf.steps).toBe(20);
      expect(brdf.coefficients.length).toBe(20);
    });

    it('initializes coefficients matrix', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.5,
        diffusionCoefficient: 0.5,
        steps: 5
      });

      // Each row should have coefficients
      for (let i = 0; i < 5; i++) {
        expect(brdf.coefficients[i].length).toBe(5);
      }
    });
  });

  describe('set', () => {
    it('sets coefficients for fully absorbing surface', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 1.0,
        diffusionCoefficient: 0.5,
        steps: 5
      });

      // All coefficients should be 0 for full absorption
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          expect(brdf.coefficients[i][j]).toBe(0);
        }
      }
    });

    it('sets coefficients for fully reflective surface', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.0,
        diffusionCoefficient: 0.0,
        steps: 5
      });

      // For pure specular reflection, energy should be at the specular direction
      // Specular direction for incoming slot i is (steps - i - 1)
      for (let i = 0; i < 5; i++) {
        const specularSlot = 5 - i - 1;
        expect(brdf.coefficients[i][specularSlot]).toBe(1);
      }
    });

    it('distributes energy correctly for diffuse surface', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.0,
        diffusionCoefficient: 1.0,
        steps: 5
      });

      // For fully diffuse, energy should be evenly distributed
      const expectedPerSlot = 1 / 5;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          expect(brdf.coefficients[i][j]).toBeCloseTo(expectedPerSlot, 5);
        }
      }
    });

    it('conserves energy (sum equals reflected energy)', () => {
      const absorptionCoefficient = 0.3;
      const brdf = new BRDF({
        absorptionCoefficient,
        diffusionCoefficient: 0.5,
        steps: 10
      });

      const reflected = 1 - absorptionCoefficient;

      // For each incoming angle, the sum of outgoing coefficients should equal reflected energy
      for (let i = 0; i < 10; i++) {
        let sum = 0;
        for (let j = 0; j < 10; j++) {
          sum += brdf.coefficients[i][j];
        }
        expect(sum).toBeCloseTo(reflected, 5);
      }
    });

    it('returns this for chaining', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.5,
        diffusionCoefficient: 0.5
      });

      const result = brdf.set(0.2, 0.8);

      expect(result).toBe(brdf);
    });
  });

  describe('get', () => {
    it('retrieves coefficient for given angles', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.0,
        diffusionCoefficient: 1.0,
        steps: 10
      });

      // Should be able to get a valid coefficient
      const coeff = brdf.get(0, 0);
      expect(typeof coeff).toBe('number');
      expect(coeff).toBeCloseTo(0.1, 5);
    });

    it('uses getIndex to convert angles to indices', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.5,
        diffusionCoefficient: 0.5,
        steps: 10
      });

      // Test that angles are properly discretized
      const coeff1 = brdf.get(0, 0);
      const coeff2 = brdf.get(Math.PI / 20, Math.PI / 20); // Small angle, should round to 0

      // Both should retrieve from the same bucket for small angles
      expect(typeof coeff1).toBe('number');
      expect(typeof coeff2).toBe('number');
    });
  });

  describe('randomize', () => {
    it('sets random coefficients', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.5,
        diffusionCoefficient: 0.5,
        steps: 5
      });

      const originalCoeffs = JSON.parse(JSON.stringify(brdf.coefficients));

      brdf.randomize();

      // Coefficients should have changed
      let hasChanged = false;
      for (let i = 0; i < 5 && !hasChanged; i++) {
        for (let j = 0; j < 5 && !hasChanged; j++) {
          if (brdf.coefficients[i][j] !== originalCoeffs[i][j]) {
            hasChanged = true;
          }
        }
      }
      expect(hasChanged).toBe(true);
    });

    it('normalizes each row to sum to 1', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.5,
        diffusionCoefficient: 0.5,
        steps: 5
      });

      brdf.randomize();

      // Each row should sum to 1
      for (let i = 0; i < 5; i++) {
        let sum = 0;
        for (let j = 0; j < 5; j++) {
          sum += brdf.coefficients[i][j];
        }
        expect(sum).toBeCloseTo(1, 5);
      }
    });

    it('returns this for chaining', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.5,
        diffusionCoefficient: 0.5
      });

      const result = brdf.randomize();

      expect(result).toBe(brdf);
    });
  });

  describe('specular reflection', () => {
    it('maps incoming angle to opposite outgoing angle', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.0,
        diffusionCoefficient: 0.0,
        steps: 10
      });

      // For pure specular, slot 0 should reflect to slot 9
      // slot 1 to 8, etc.
      expect(brdf.coefficients[0][9]).toBe(1);
      expect(brdf.coefficients[1][8]).toBe(1);
      expect(brdf.coefficients[4][5]).toBe(1);
      expect(brdf.coefficients[9][0]).toBe(1);
    });
  });

  describe('mixed specular and diffuse', () => {
    it('has higher coefficient in specular direction', () => {
      const brdf = new BRDF({
        absorptionCoefficient: 0.0,
        diffusionCoefficient: 0.5,
        steps: 5
      });

      // For incoming angle at slot 0, specular is at slot 4
      const specularCoeff = brdf.coefficients[0][4];
      const diffuseCoeff = brdf.coefficients[0][0];

      // Specular coefficient should be higher than diffuse
      expect(specularCoeff).toBeGreaterThan(diffuseCoeff);
    });
  });
});
