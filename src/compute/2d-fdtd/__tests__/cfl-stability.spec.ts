/**
 * Tests for FDTD 2D CFL (Courant-Friedrichs-Lewy) stability condition.
 *
 * For the 2D wave equation solved via explicit finite differences,
 * the CFL condition requires:
 *   C = c * dt / dx <= 1 / sqrt(2) ≈ 0.707
 *
 * where c = wave speed, dt = time step, dx = cell size.
 *
 * The solver's computeTimestep function must satisfy this bound.
 *
 * Reference: Strikwerda, J.C. (2004). Finite Difference Schemes and PDEs.
 */

import { computeTimestep } from '../timestep';

describe('FDTD 2D CFL Stability', () => {
  const waveSpeed = 340.29;

  describe('computeTimestep', () => {
    it('produces a Courant number exactly at the 2D limit (1/sqrt(2))', () => {
      const cellSize = 10 / 256;
      const dt = computeTimestep(cellSize, waveSpeed);
      const courant = waveSpeed * dt / cellSize;

      expect(courant).toBeCloseTo(1 / Math.SQRT2, 10);
    });

    it('satisfies CFL condition for various cell sizes', () => {
      const cellSizes = [0.01, 0.039, 0.05, 0.1, 0.5];

      cellSizes.forEach(cellSize => {
        const dt = computeTimestep(cellSize, waveSpeed);
        const courant = waveSpeed * dt / cellSize;

        expect(courant).toBeLessThanOrEqual(1 / Math.SQRT2 + 1e-15);
        expect(courant).toBeGreaterThan(0);
      });
    });

    it('Courant number is independent of cell size', () => {
      const cellSizes = [0.01, 0.05, 0.1, 0.5, 1.0];
      const courants = cellSizes.map(cellSize => {
        const dt = computeTimestep(cellSize, waveSpeed);
        return waveSpeed * dt / cellSize;
      });

      courants.forEach(c => {
        expect(c).toBeCloseTo(courants[0], 10);
      });
    });

    it('returns a positive timestep', () => {
      expect(computeTimestep(0.039, waveSpeed)).toBeGreaterThan(0);
      expect(computeTimestep(0.001, waveSpeed)).toBeGreaterThan(0);
    });

    it('timestep scales linearly with cell size', () => {
      const dt1 = computeTimestep(0.1, waveSpeed);
      const dt2 = computeTimestep(0.2, waveSpeed);

      expect(dt2 / dt1).toBeCloseTo(2.0, 10);
    });
  });

  describe('old formula comparison', () => {
    it('old formula (dt = dx/c) violates 2D CFL condition (C = 1.0 > 0.707)', () => {
      const cellSize = 10 / 256;
      const dt_old = cellSize / waveSpeed;
      const courant_old = waveSpeed * dt_old / cellSize;

      expect(courant_old).toBeCloseTo(1.0, 10);
      expect(courant_old).toBeGreaterThan(1 / Math.SQRT2);
    });

    it('the fix reduces dt by a factor of sqrt(2) compared to the old value', () => {
      const cellSize = 0.039;
      const dt_old = cellSize / waveSpeed;
      const dt_new = computeTimestep(cellSize, waveSpeed);

      expect(dt_old / dt_new).toBeCloseTo(Math.SQRT2, 10);
    });
  });

  describe('stability implications', () => {
    it('1D CFL limit is 1.0, 2D limit is 1/sqrt(2), 3D limit is 1/sqrt(3)', () => {
      expect(1 / Math.sqrt(1)).toBeCloseTo(1.0, 10);
      expect(1 / Math.sqrt(2)).toBeCloseTo(Math.SQRT1_2, 10);
      expect(1 / Math.sqrt(3)).toBeCloseTo(0.5774, 3);
    });
  });
});
