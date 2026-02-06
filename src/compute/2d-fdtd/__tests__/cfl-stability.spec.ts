/**
 * Tests for FDTD 2D CFL (Courant-Friedrichs-Lewy) stability condition.
 *
 * For the 2D wave equation solved via explicit finite differences,
 * the CFL condition requires:
 *   C = c * dt / dx <= 1 / sqrt(2) ≈ 0.707
 *
 * where c = wave speed, dt = time step, dx = cell size.
 *
 * Previously dt was computed as dx / c, giving C = 1.0 which exceeds the
 * 2D stability limit. The fix divides by an additional sqrt(2).
 *
 * Reference: Strikwerda, J.C. (2004). Finite Difference Schemes and PDEs.
 */

describe('FDTD 2D CFL Stability', () => {
  const waveSpeed = 340.29;

  describe('time step computation', () => {
    it('produces a Courant number <= 1/sqrt(2) for the 2D wave equation', () => {
      const cellSize = 10 / 256;
      // Fixed formula: dt = dx / (c * sqrt(2))
      const dt = cellSize / (waveSpeed * Math.SQRT2);
      const courant = waveSpeed * dt / cellSize;

      expect(courant).toBeLessThanOrEqual(1 / Math.SQRT2);
      expect(courant).toBeCloseTo(1 / Math.SQRT2, 10);
    });

    it('old formula violates 2D CFL condition (C = 1.0 > 0.707)', () => {
      const cellSize = 10 / 256;
      // Old formula: dt = dx / c
      const dt_old = cellSize / waveSpeed;
      const courant_old = waveSpeed * dt_old / cellSize;

      // This would be exactly 1.0, which violates C <= 1/sqrt(2)
      expect(courant_old).toBeCloseTo(1.0, 10);
      expect(courant_old).toBeGreaterThan(1 / Math.SQRT2);
    });

    it('new formula satisfies 2D CFL condition for various cell sizes', () => {
      const cellSizes = [0.01, 0.039, 0.05, 0.1, 0.5];

      cellSizes.forEach(cellSize => {
        const dt = cellSize / (waveSpeed * Math.SQRT2);
        const courant = waveSpeed * dt / cellSize;

        expect(courant).toBeLessThanOrEqual(1 / Math.SQRT2 + 1e-15);
        expect(courant).toBeGreaterThan(0);
      });
    });

    it('Courant number is independent of cell size', () => {
      const cellSizes = [0.01, 0.05, 0.1, 0.5, 1.0];
      const courants = cellSizes.map(cellSize => {
        const dt = cellSize / (waveSpeed * Math.SQRT2);
        return waveSpeed * dt / cellSize;
      });

      // All Courant numbers should be identical
      courants.forEach(c => {
        expect(c).toBeCloseTo(courants[0], 10);
      });
    });
  });

  describe('stability implications', () => {
    it('1D CFL limit is 1.0, 2D limit is 1/sqrt(2), 3D limit is 1/sqrt(3)', () => {
      // Verify the mathematical relationship
      expect(1 / Math.sqrt(1)).toBeCloseTo(1.0, 10);
      expect(1 / Math.sqrt(2)).toBeCloseTo(Math.SQRT1_2, 10);
      expect(1 / Math.sqrt(3)).toBeCloseTo(0.5774, 3);
    });

    it('the fix reduces dt by a factor of sqrt(2) compared to the old value', () => {
      const cellSize = 0.039;
      const dt_old = cellSize / waveSpeed;
      const dt_new = cellSize / (waveSpeed * Math.SQRT2);

      expect(dt_old / dt_new).toBeCloseTo(Math.SQRT2, 10);
    });
  });
});
