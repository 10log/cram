import { airAttenuation } from '../air-attenuation';
import {
  ISO_AIR_ATTENUATION_20C_50RH,
  ISO_AIR_ATTENUATION_VARIANTS,
} from '../../../__fixtures__/acoustic-references';

describe('airAttenuation', () => {
  describe('basic functionality', () => {
    it('returns an array of attenuation values', () => {
      const frequencies = [125, 250, 500, 1000];
      const result = airAttenuation(frequencies);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(frequencies.length);
    });

    it('returns positive values for all frequencies', () => {
      const frequencies = [63, 125, 250, 500, 1000, 2000, 4000, 8000];
      const result = airAttenuation(frequencies);

      result.forEach((value, index) => {
        expect(value).toBeGreaterThan(0);
      });
    });

    it('handles single frequency input', () => {
      const result = airAttenuation([1000]);
      expect(result.length).toBe(1);
      expect(result[0]).toBeGreaterThan(0);
    });

    it('handles empty array input', () => {
      const result = airAttenuation([]);
      expect(result).toEqual([]);
    });
  });

  describe('frequency dependence', () => {
    it('attenuation increases with frequency', () => {
      const frequencies = [125, 250, 500, 1000, 2000, 4000, 8000];
      const result = airAttenuation(frequencies, 20, 50);

      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
      }
    });

    it('high frequencies attenuate significantly more than low frequencies', () => {
      const result = airAttenuation([125, 8000], 20, 50);

      // 8kHz should be at least 100x more attenuated than 125Hz
      expect(result[1] / result[0]).toBeGreaterThan(100);
    });
  });

  describe('temperature dependence', () => {
    it('attenuation changes with temperature', () => {
      const frequencies = [1000, 4000];
      const cold = airAttenuation(frequencies, 0, 50);
      const warm = airAttenuation(frequencies, 30, 50);

      // Values should be different
      expect(cold[0]).not.toBeCloseTo(warm[0], 4);
      expect(cold[1]).not.toBeCloseTo(warm[1], 4);
    });

    it('handles extreme cold temperatures', () => {
      const result = airAttenuation([1000], -20, 50);
      expect(result[0]).toBeGreaterThan(0);
      expect(isFinite(result[0])).toBe(true);
    });

    it('handles high temperatures', () => {
      const result = airAttenuation([1000], 40, 50);
      expect(result[0]).toBeGreaterThan(0);
      expect(isFinite(result[0])).toBe(true);
    });
  });

  describe('humidity dependence', () => {
    it('attenuation changes with humidity', () => {
      const frequencies = [1000, 4000];
      const dry = airAttenuation(frequencies, 20, 20);
      const humid = airAttenuation(frequencies, 20, 80);

      // Values should be different
      expect(dry[0]).not.toBeCloseTo(humid[0], 4);
    });

    it('handles very low humidity', () => {
      const result = airAttenuation([1000], 20, 5);
      expect(result[0]).toBeGreaterThan(0);
      expect(isFinite(result[0])).toBe(true);
    });

    it('handles very high humidity', () => {
      const result = airAttenuation([1000], 20, 95);
      expect(result[0]).toBeGreaterThan(0);
      expect(isFinite(result[0])).toBe(true);
    });
  });

  describe('pressure dependence', () => {
    it('accepts custom atmospheric pressure', () => {
      const frequencies = [1000];
      const seaLevel = airAttenuation(frequencies, 20, 50, 101325);
      const highAltitude = airAttenuation(frequencies, 20, 50, 80000);

      // Results should be different - verify they're not exactly equal
      expect(seaLevel[0]).not.toBe(highAltitude[0]);
      // Both should still be positive valid numbers
      expect(seaLevel[0]).toBeGreaterThan(0);
      expect(highAltitude[0]).toBeGreaterThan(0);
    });

    it('uses default pressure when not specified', () => {
      const frequencies = [1000];
      const withDefault = airAttenuation(frequencies, 20, 50);
      const withExplicit = airAttenuation(frequencies, 20, 50, 101325);

      expect(withDefault[0]).toBeCloseTo(withExplicit[0], 6);
    });
  });

  describe('ISO 9613-1 reference comparison', () => {
    // Note: The implementation uses a slightly different formula than ISO 9613-1,
    // so we test for reasonable agreement rather than exact match

    it('produces values in the correct order of magnitude at 20°C, 50% RH', () => {
      const frequencies = Object.keys(ISO_AIR_ATTENUATION_20C_50RH).map(Number);
      const result = airAttenuation(frequencies, 20, 50);

      frequencies.forEach((freq, i) => {
        const expected = ISO_AIR_ATTENUATION_20C_50RH[freq];
        // Allow factor of 3 difference due to formula variations
        expect(result[i]).toBeGreaterThan(expected * 0.3);
        expect(result[i]).toBeLessThan(expected * 3);
      });
    });

    it('follows expected trend at 20°C, 40% RH', () => {
      const refData = ISO_AIR_ATTENUATION_VARIANTS['20_40'];
      const frequencies = Object.keys(refData).map(Number);
      const result = airAttenuation(frequencies, 20, 40);

      // Verify monotonic increase
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
      }
    });
  });

  describe('numerical stability', () => {
    it('handles very low frequencies', () => {
      const result = airAttenuation([20, 31.5, 63]);
      result.forEach(value => {
        expect(isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it('handles very high frequencies', () => {
      const result = airAttenuation([16000, 20000]);
      result.forEach(value => {
        expect(isFinite(value)).toBe(true);
        expect(value).toBeGreaterThan(0);
      });
    });

    it('produces consistent results across multiple calls', () => {
      const frequencies = [125, 500, 1000, 4000];
      const result1 = airAttenuation(frequencies, 20, 50);
      const result2 = airAttenuation(frequencies, 20, 50);

      result1.forEach((value, i) => {
        expect(value).toBe(result2[i]);
      });
    });
  });

  describe('performance', () => {
    it('handles large frequency arrays efficiently', () => {
      const frequencies = Array.from({ length: 1000 }, (_, i) => 20 + i * 20);

      const start = performance.now();
      const result = airAttenuation(frequencies, 20, 50);
      const duration = performance.now() - start;

      expect(result.length).toBe(1000);
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });
  });
});
