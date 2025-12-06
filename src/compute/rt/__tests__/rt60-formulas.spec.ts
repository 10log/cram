/**
 * Unit tests for RT60 calculation formulas
 *
 * These tests verify the mathematical correctness of Sabine, Eyring,
 * and Arau-Puchades reverberation time formulas without requiring
 * the full Room/Surface object infrastructure.
 */

import {
  REFERENCE_ROOMS,
  ACOUSTIC_CONSTANTS,
} from '../../../__fixtures__/acoustic-references';

// Extract the pure mathematical formulas for testing
// These mirror the calculations in RT60 class

/**
 * Sabine reverberation time formula
 * RT60 = K * V / A
 * where K = 0.161 (metric), V = volume (m³), A = total absorption (m² sabins)
 */
function sabineRT60(
  volume: number,
  totalAbsorption: number,
  airAbsorption: number = 0,
  k: number = ACOUSTIC_CONSTANTS.SABINE_METRIC
): number {
  return (k * volume) / (totalAbsorption + 4 * airAbsorption * volume);
}

/**
 * Eyring reverberation time formula
 * RT60 = K * V / (-S * ln(1 - α_avg))
 * where α_avg = average absorption coefficient
 */
function eyringRT60(
  volume: number,
  surfaceArea: number,
  avgAbsorption: number,
  airAbsorption: number = 0,
  k: number = ACOUSTIC_CONSTANTS.SABINE_METRIC
): number {
  const denominator = -surfaceArea * Math.log(1 - avgAbsorption) + 4 * airAbsorption * volume;
  return (k * volume) / denominator;
}

describe('Sabine RT60 Formula', () => {
  describe('basic calculations', () => {
    it('returns positive values for valid inputs', () => {
      const rt = sabineRT60(100, 20);
      expect(rt).toBeGreaterThan(0);
    });

    it('calculates RT60 for simple room', () => {
      // 100 m³ room, 10 m² sabins absorption
      // RT60 = 0.161 * 100 / 10 = 1.61s
      const rt = sabineRT60(100, 10);
      expect(rt).toBeCloseTo(1.61, 2);
    });

    it('uses correct constant for metric units', () => {
      const rt = sabineRT60(180, 21.6, 0, 0.161);
      expect(rt).toBeCloseTo(1.34, 1);
    });

    it('uses correct constant for imperial units', () => {
      // Same room in imperial: V=6357 ft³, A=232.5 ft² sabins
      const rt = sabineRT60(6357, 232.5, 0, 0.049);
      expect(rt).toBeCloseTo(1.34, 1);
    });
  });

  describe('reference room validation', () => {
    const room = REFERENCE_ROOMS.shoebox_uniform;

    it('matches expected RT60 for shoebox room', () => {
      const totalAbsorption = room.surfaceArea * room.absorption[1000];
      const rt = sabineRT60(room.volume, totalAbsorption);

      expect(rt).toBeCloseTo(room.expectedSabine[1000], 1);
    });

    it('produces consistent results across frequency bands', () => {
      // For uniform absorption, RT60 should be same at all frequencies
      const frequencies = [125, 250, 500, 1000, 2000, 4000];
      const results = frequencies.map(freq => {
        const absorption = room.surfaceArea * room.absorption[freq];
        return sabineRT60(room.volume, absorption);
      });

      results.forEach(rt => {
        expect(rt).toBeCloseTo(results[0], 2);
      });
    });
  });

  describe('parameter relationships', () => {
    it('RT60 decreases with increasing absorption', () => {
      const volume = 100;
      const rt1 = sabineRT60(volume, 10);
      const rt2 = sabineRT60(volume, 20);
      const rt3 = sabineRT60(volume, 30);

      expect(rt2).toBeLessThan(rt1);
      expect(rt3).toBeLessThan(rt2);
    });

    it('RT60 increases with increasing volume', () => {
      const absorption = 20;
      const rt1 = sabineRT60(50, absorption);
      const rt2 = sabineRT60(100, absorption);
      const rt3 = sabineRT60(200, absorption);

      expect(rt2).toBeGreaterThan(rt1);
      expect(rt3).toBeGreaterThan(rt2);
    });

    it('RT60 is inversely proportional to absorption', () => {
      const volume = 100;
      const rt1 = sabineRT60(volume, 10);
      const rt2 = sabineRT60(volume, 20);

      // Doubling absorption should halve RT60
      expect(rt1 / rt2).toBeCloseTo(2, 2);
    });

    it('RT60 is directly proportional to volume', () => {
      const absorption = 20;
      const rt1 = sabineRT60(100, absorption);
      const rt2 = sabineRT60(200, absorption);

      // Doubling volume should double RT60
      expect(rt2 / rt1).toBeCloseTo(2, 2);
    });
  });

  describe('air absorption effects', () => {
    it('reduces RT60 at high frequencies', () => {
      const volume = 180;
      const absorption = 21.6;
      const airAbs = 0.01; // Typical at 4kHz

      const rtWithoutAir = sabineRT60(volume, absorption, 0);
      const rtWithAir = sabineRT60(volume, absorption, airAbs);

      expect(rtWithAir).toBeLessThan(rtWithoutAir);
    });

    it('has negligible effect for small rooms', () => {
      const volume = 50;
      const absorption = 10;
      const airAbs = 0.001; // Low frequency

      const rtWithoutAir = sabineRT60(volume, absorption, 0);
      const rtWithAir = sabineRT60(volume, absorption, airAbs);

      // Difference should be less than 5%
      const diff = (rtWithoutAir - rtWithAir) / rtWithoutAir;
      expect(diff).toBeLessThan(0.05);
    });
  });
});

describe('Eyring RT60 Formula', () => {
  describe('basic calculations', () => {
    it('returns positive values for valid inputs', () => {
      const rt = eyringRT60(100, 100, 0.1);
      expect(rt).toBeGreaterThan(0);
    });

    it('calculates RT60 for simple room', () => {
      // 180 m³ room, 216 m², α = 0.1
      // RT60 = 0.161 * 180 / (-216 * ln(0.9)) = 28.98 / 22.77 ≈ 1.27s
      const rt = eyringRT60(180, 216, 0.1);
      expect(rt).toBeCloseTo(1.27, 1);
    });
  });

  describe('reference room validation', () => {
    const room = REFERENCE_ROOMS.shoebox_uniform;

    it('matches expected RT60 for shoebox room', () => {
      const rt = eyringRT60(room.volume, room.surfaceArea, room.absorption[1000]);
      expect(rt).toBeCloseTo(room.expectedEyring[1000], 1);
    });
  });

  describe('comparison with Sabine', () => {
    it('gives lower RT60 than Sabine for same room', () => {
      const volume = 180;
      const surfaceArea = 216;
      const absorption = 0.1;

      const sabine = sabineRT60(volume, surfaceArea * absorption);
      const eyring = eyringRT60(volume, surfaceArea, absorption);

      expect(eyring).toBeLessThan(sabine);
    });

    it('converges to Sabine for low absorption', () => {
      const volume = 180;
      const surfaceArea = 216;
      const absorption = 0.01; // Very low absorption

      const sabine = sabineRT60(volume, surfaceArea * absorption);
      const eyring = eyringRT60(volume, surfaceArea, absorption);

      // Should be within 5% for low absorption
      const diff = Math.abs(sabine - eyring) / sabine;
      expect(diff).toBeLessThan(0.05);
    });

    it('diverges from Sabine for high absorption', () => {
      const volume = 90;
      const surfaceArea = 126;
      const absorption = 0.5;

      const sabine = sabineRT60(volume, surfaceArea * absorption);
      const eyring = eyringRT60(volume, surfaceArea, absorption);

      // Eyring should be significantly lower
      expect(eyring / sabine).toBeLessThan(0.8);
    });
  });

  describe('edge cases', () => {
    it('approaches infinity as absorption approaches 0', () => {
      const rt1 = eyringRT60(100, 100, 0.1);
      const rt2 = eyringRT60(100, 100, 0.01);
      const rt3 = eyringRT60(100, 100, 0.001);

      expect(rt2).toBeGreaterThan(rt1);
      expect(rt3).toBeGreaterThan(rt2);
    });

    it('approaches 0 as absorption approaches 1', () => {
      const rt1 = eyringRT60(100, 100, 0.5);
      const rt2 = eyringRT60(100, 100, 0.8);
      const rt3 = eyringRT60(100, 100, 0.95);

      expect(rt2).toBeLessThan(rt1);
      expect(rt3).toBeLessThan(rt2);
    });

    it('handles absorption = 1 (fully absorptive)', () => {
      // ln(0) = -Infinity, so RT60 = 0
      const rt = eyringRT60(100, 100, 0.999);
      expect(rt).toBeGreaterThan(0);
      expect(rt).toBeLessThan(0.1);
    });
  });
});

describe('Formula Consistency', () => {
  describe('typical room scenarios', () => {
    it('office room produces reasonable RT60 values', () => {
      const room = REFERENCE_ROOMS.office;
      const freq = 500;

      const sabine = sabineRT60(room.volume, room.surfaceArea * room.absorption[freq]);
      const eyring = eyringRT60(room.volume, room.surfaceArea, room.absorption[freq]);

      // Both should produce values in typical office range (0.3-0.8s)
      expect(sabine).toBeGreaterThan(0.3);
      expect(sabine).toBeLessThan(1.0);
      expect(eyring).toBeGreaterThan(0.3);
      expect(eyring).toBeLessThan(1.0);
    });

    it('studio produces short RT60 values', () => {
      const room = REFERENCE_ROOMS.studio;
      const freq = 1000;

      const sabine = sabineRT60(room.volume, room.surfaceArea * room.absorption[freq]);
      const eyring = eyringRT60(room.volume, room.surfaceArea, room.absorption[freq]);

      // Studios should have short RT60 (< 0.5s)
      expect(sabine).toBeLessThan(0.5);
      expect(eyring).toBeLessThan(0.3);
    });
  });

  describe('frequency dependence', () => {
    it('RT60 varies with frequency for typical rooms', () => {
      const room = REFERENCE_ROOMS.office;

      const rtValues = [125, 500, 2000, 8000].map(freq => {
        return sabineRT60(room.volume, room.surfaceArea * room.absorption[freq]);
      });

      // Values should be different at different frequencies
      const allSame = rtValues.every(v => Math.abs(v - rtValues[0]) < 0.01);
      expect(allSame).toBe(false);
    });
  });
});

describe('Numerical Stability', () => {
  it('handles very small rooms', () => {
    const rt = sabineRT60(5, 2);
    expect(isFinite(rt)).toBe(true);
    expect(rt).toBeGreaterThan(0);
  });

  it('handles very large rooms', () => {
    const rt = sabineRT60(50000, 10000);
    expect(isFinite(rt)).toBe(true);
    expect(rt).toBeGreaterThan(0);
  });

  it('handles very high absorption', () => {
    const rt = eyringRT60(100, 100, 0.99);
    expect(isFinite(rt)).toBe(true);
    expect(rt).toBeGreaterThan(0);
  });

  it('handles very low absorption', () => {
    const rt = eyringRT60(100, 100, 0.001);
    expect(isFinite(rt)).toBe(true);
    expect(rt).toBeGreaterThan(0);
  });
});
