// Mock Three.js before any imports
jest.mock('three', () => {
  const actual = jest.requireActual('../../../__mocks__/three');
  return actual;
});

import { Vector3 } from 'three';
import { BRDF } from '../brdf';

describe('Radiance BRDF', () => {
  describe('constructor', () => {
    it('creates hemisphere directions from icosahedron', () => {
      const brdf = new BRDF(0);
      expect(brdf.nSlots).toBeGreaterThan(0);
      expect(brdf.directions.length).toBe(brdf.nSlots);
    });

    it('all directions are in the upper hemisphere (z >= 0)', () => {
      const brdf = new BRDF(1);
      for (const dir of brdf.directions) {
        expect(dir.z).toBeGreaterThanOrEqual(-1e-6);
      }
    });

    it('all directions are unit vectors', () => {
      const brdf = new BRDF(1);
      for (const dir of brdf.directions) {
        expect(dir.length()).toBeCloseTo(1, 3);
      }
    });

    it('higher detail produces more slots', () => {
      const brdf0 = new BRDF(0);
      const brdf1 = new BRDF(1);
      expect(brdf1.nSlots).toBeGreaterThan(brdf0.nSlots);
    });

    it('initializes coefficient matrix with correct dimensions', () => {
      const brdf = new BRDF(1);
      expect(brdf.coefficients.length).toBe(brdf.nSlots);
      for (const row of brdf.coefficients) {
        expect(row.length).toBe(brdf.nSlots);
      }
    });
  });

  describe('computeCoefficients', () => {
    it('produces all zeros for full absorption', () => {
      const brdf = new BRDF(1);
      brdf.computeCoefficients(1.0, 0.5);
      for (let i = 0; i < brdf.nSlots; i++) {
        for (let j = 0; j < brdf.nSlots; j++) {
          expect(brdf.coefficients[i][j]).toBe(0);
        }
      }
    });

    it('distributes energy uniformly for fully diffuse surface', () => {
      const brdf = new BRDF(1);
      brdf.computeCoefficients(0, 1.0);
      const expected = 1 / brdf.nSlots;
      for (let i = 0; i < brdf.nSlots; i++) {
        for (let j = 0; j < brdf.nSlots; j++) {
          expect(brdf.coefficients[i][j]).toBeCloseTo(expected, 4);
        }
      }
    });

    it('conserves energy (row sums equal reflectance)', () => {
      const absorption = 0.3;
      const brdf = new BRDF(1);
      brdf.computeCoefficients(absorption, 0.5);
      const reflectance = 1 - absorption;
      for (let i = 0; i < brdf.nSlots; i++) {
        let sum = 0;
        for (let j = 0; j < brdf.nSlots; j++) {
          sum += brdf.coefficients[i][j];
        }
        expect(sum).toBeCloseTo(reflectance, 3);
      }
    });

    it('specular direction has higher coefficient than diffuse for mixed surface', () => {
      const brdf = new BRDF(0);
      brdf.computeCoefficients(0, 0.5);
      // For each incoming direction, the maximum coefficient should be at or near the mirror slot
      for (let i = 0; i < brdf.nSlots; i++) {
        let maxCoeff = -1;
        for (let j = 0; j < brdf.nSlots; j++) {
          if (brdf.coefficients[i][j] > maxCoeff) {
            maxCoeff = brdf.coefficients[i][j];
          }
        }
        // Max should be greater than uniform diffuse weight
        expect(maxCoeff).toBeGreaterThan(1 / brdf.nSlots);
      }
    });
  });

  describe('findNearestSlot', () => {
    it('returns valid index for any direction', () => {
      const brdf = new BRDF(1);
      const dirs = [
        new Vector3(0, 0, 1),
        new Vector3(1, 0, 0),
        new Vector3(0, 1, 0),
      ];
      for (const d of dirs) {
        const idx = brdf.findNearestSlot(d);
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(brdf.nSlots);
      }
    });
  });

  describe('getDirectionIndex', () => {
    it('returns valid index for world direction and normal', () => {
      const brdf = new BRDF(1);
      const normal = new Vector3(0, 1, 0);
      const worldDir = new Vector3(0, 1, 0);
      const idx = brdf.getDirectionIndex(worldDir, normal);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(brdf.nSlots);
    });

    it('clamps directions below the hemisphere', () => {
      const brdf = new BRDF(1);
      const normal = new Vector3(0, 0, 1);
      const worldDir = new Vector3(0, 0, -1);
      const idx = brdf.getDirectionIndex(worldDir, normal);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(brdf.nSlots);
    });
  });

  describe('getOutgoingWeights', () => {
    it('returns the correct row of coefficients', () => {
      const brdf = new BRDF(1);
      brdf.computeCoefficients(0.2, 0.5);
      for (let i = 0; i < brdf.nSlots; i++) {
        const weights = brdf.getOutgoingWeights(i);
        expect(weights).toBe(brdf.coefficients[i]);
      }
    });
  });
});
