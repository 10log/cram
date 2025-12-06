import { Octave, ThirdOctave, Flower, Fupper } from '../bands';
import {
  ISO_OCTAVE_BANDS,
  ISO_THIRD_OCTAVE_BANDS,
} from '../../../__fixtures__/acoustic-references';

describe('Octave', () => {
  describe('basic functionality', () => {
    it('returns an array of frequencies', () => {
      const result = Octave(125, 8000);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns frequencies within the specified range', () => {
      const start = 125;
      const end = 4000;
      const result = Octave(start, end);

      result.forEach(freq => {
        expect(freq).toBeGreaterThanOrEqual(start);
        expect(freq).toBeLessThanOrEqual(end);
      });
    });

    it('includes boundary frequencies', () => {
      const result = Octave(125, 8000);
      expect(result).toContain(125);
      expect(result).toContain(8000);
    });
  });

  describe('ISO standard compliance', () => {
    it('returns standard octave band center frequencies', () => {
      const result = Octave(16, 16000);

      // Common octave bands that should be included
      const expectedBands = [16, 31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

      expectedBands.forEach(freq => {
        expect(result).toContain(freq);
      });
    });

    it('frequencies follow octave doubling pattern', () => {
      const result = Octave(31.5, 8000);

      // Each frequency should be approximately double the previous
      for (let i = 1; i < result.length; i++) {
        const ratio = result[i] / result[i - 1];
        expect(ratio).toBeCloseTo(2, 0);
      }
    });

    it('matches ISO octave bands within typical audio range', () => {
      const result = Octave(16, 16000);
      const isoFiltered = ISO_OCTAVE_BANDS.filter(f => f >= 16 && f <= 16000);

      expect(result.length).toBe(isoFiltered.length);
      result.forEach((freq, i) => {
        expect(freq).toBeCloseTo(isoFiltered[i], 1);
      });
    });
  });

  describe('range handling', () => {
    it('returns empty array for invalid range', () => {
      const result = Octave(8000, 125); // end < start
      expect(result).toEqual([]);
    });

    it('handles range with single band', () => {
      const result = Octave(900, 1100);
      expect(result).toContain(1000);
      expect(result.length).toBe(1);
    });

    it('handles full audible range', () => {
      const result = Octave(20, 20000);
      expect(result.length).toBeGreaterThan(5);
    });

    it('handles low frequency range', () => {
      const result = Octave(16, 63);
      expect(result.length).toBeGreaterThan(0);
      result.forEach(freq => {
        expect(freq).toBeLessThanOrEqual(63);
      });
    });

    it('handles high frequency range', () => {
      const result = Octave(4000, 16000);
      expect(result.length).toBeGreaterThan(0);
      result.forEach(freq => {
        expect(freq).toBeGreaterThanOrEqual(4000);
      });
    });
  });
});

describe('ThirdOctave', () => {
  describe('basic functionality', () => {
    it('returns an array of frequencies', () => {
      const result = ThirdOctave(100, 10000);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns frequencies within the specified range', () => {
      const start = 100;
      const end = 10000;
      const result = ThirdOctave(start, end);

      result.forEach(freq => {
        expect(freq).toBeGreaterThanOrEqual(start);
        expect(freq).toBeLessThanOrEqual(end);
      });
    });

    it('returns more bands than octave for same range', () => {
      const octaveResult = Octave(125, 8000);
      const thirdOctaveResult = ThirdOctave(125, 8000);

      // Third octave should have roughly 3x as many bands
      expect(thirdOctaveResult.length).toBeGreaterThan(octaveResult.length * 2);
    });
  });

  describe('ISO standard compliance', () => {
    it('includes standard third-octave frequencies', () => {
      const result = ThirdOctave(100, 10000);

      // Some key third-octave frequencies
      const expectedBands = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000,
        1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000];

      expectedBands.forEach(freq => {
        expect(result).toContain(freq);
      });
    });

    it('frequencies follow third-octave ratio pattern', () => {
      const result = ThirdOctave(100, 10000);

      // Each frequency should be approximately 2^(1/3) ≈ 1.26 times the previous
      for (let i = 1; i < result.length; i++) {
        const ratio = result[i] / result[i - 1];
        expect(ratio).toBeCloseTo(Math.pow(2, 1 / 3), 1);
      }
    });

    it('contains 3 third-octave bands per octave', () => {
      // Between 1000Hz and 2000Hz there should be 3 third-octave bands
      const result = ThirdOctave(1000, 2000);
      // Should include 1000, 1250, 1600, 2000
      expect(result.length).toBe(4);
    });
  });

  describe('default behavior', () => {
    it('returns full range when no arguments provided', () => {
      const result = ThirdOctave();
      expect(result.length).toBeGreaterThan(20);
    });

    it('returns bands from 0 when only end is effectively used', () => {
      const result = ThirdOctave(undefined, 1000);
      expect(result.length).toBeGreaterThan(0);
      expect(result[result.length - 1]).toBeLessThanOrEqual(1000);
    });
  });
});

describe('Flower', () => {
  describe('octave bands (k=1)', () => {
    it('calculates correct lower frequency for octave band', () => {
      // For 1000Hz octave band, lower limit = 1000 / 2^(1/2) ≈ 707Hz
      const result = Flower(1, 1000);
      expect(result).toBeCloseTo(707.1, 0);
    });

    it('handles array input', () => {
      const result = Flower(1, [1000, 2000, 4000]);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });
  });

  describe('third-octave bands (k=3)', () => {
    it('calculates correct lower frequency for third-octave band', () => {
      // For 1000Hz third-octave band, lower limit = 1000 / 2^(1/6) ≈ 891Hz
      const result = Flower(3, 1000);
      expect(result).toBeCloseTo(891, 0);
    });
  });

  describe('sixth-octave bands (k=6)', () => {
    it('calculates correct lower frequency for sixth-octave band', () => {
      const result = Flower(6, 1000);
      // Lower limit = 1000 / 2^(1/12) ≈ 944Hz
      expect(result).toBeCloseTo(944, 0);
    });
  });

  describe('mathematical properties', () => {
    it('lower frequency is always less than center frequency', () => {
      const centers = [125, 250, 500, 1000, 2000, 4000, 8000];

      centers.forEach(fc => {
        const lower = Flower(1, fc) as number;
        expect(lower).toBeLessThan(fc);
      });
    });

    it('bandwidth increases with frequency', () => {
      const fc1 = 1000;
      const fc2 = 2000;

      const bw1 = fc1 - (Flower(1, fc1) as number);
      const bw2 = fc2 - (Flower(1, fc2) as number);

      expect(bw2).toBeGreaterThan(bw1);
    });
  });
});

describe('Fupper', () => {
  describe('octave bands (k=1)', () => {
    it('calculates correct upper frequency for octave band', () => {
      // For 1000Hz octave band, upper limit = 1000 * 2^(1/2) ≈ 1414Hz
      const result = Fupper(1, 1000);
      expect(result).toBeCloseTo(1414.2, 0);
    });

    it('handles array input', () => {
      const result = Fupper(1, [1000, 2000, 4000]);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });
  });

  describe('third-octave bands (k=3)', () => {
    it('calculates correct upper frequency for third-octave band', () => {
      // For 1000Hz third-octave band, upper limit = 1000 * 2^(1/6) ≈ 1122Hz
      const result = Fupper(3, 1000);
      expect(result).toBeCloseTo(1122, 0);
    });
  });

  describe('mathematical properties', () => {
    it('upper frequency is always greater than center frequency', () => {
      const centers = [125, 250, 500, 1000, 2000, 4000, 8000];

      centers.forEach(fc => {
        const upper = Fupper(1, fc) as number;
        expect(upper).toBeGreaterThan(fc);
      });
    });

    it('Flower and Fupper are symmetric around center', () => {
      const fc = 1000;
      const k = 1;

      const lower = Flower(k, fc) as number;
      const upper = Fupper(k, fc) as number;

      // The geometric mean of lower and upper should equal the center
      const geometricMean = Math.sqrt(lower * upper);
      expect(geometricMean).toBeCloseTo(fc, 2);
    });
  });
});

describe('Flower and Fupper consistency', () => {
  it('bandwidth ratio is constant for octave bands', () => {
    const centers = [125, 250, 500, 1000, 2000, 4000];
    const k = 1;

    const ratios = centers.map(fc => {
      const lower = Flower(k, fc) as number;
      const upper = Fupper(k, fc) as number;
      return upper / lower;
    });

    // All ratios should be equal (= 2 for octave bands)
    ratios.forEach(ratio => {
      expect(ratio).toBeCloseTo(2, 2);
    });
  });

  it('bandwidth ratio is constant for third-octave bands', () => {
    const centers = [125, 160, 200, 250, 315, 400, 500];
    const k = 3;

    const ratios = centers.map(fc => {
      const lower = Flower(k, fc) as number;
      const upper = Fupper(k, fc) as number;
      return upper / lower;
    });

    // All ratios should be equal (= 2^(1/3) ≈ 1.26 for third-octave bands)
    const expectedRatio = Math.pow(2, 1 / 3);
    ratios.forEach(ratio => {
      expect(ratio).toBeCloseTo(expectedRatio, 2);
    });
  });

  it('adjacent third-octave bands share boundaries', () => {
    // Upper limit of one band should equal lower limit of next band
    const thirdOctaveCenters = [1000, 1250, 1600, 2000];

    for (let i = 0; i < thirdOctaveCenters.length - 1; i++) {
      const upper = Fupper(3, thirdOctaveCenters[i]) as number;
      const lower = Flower(3, thirdOctaveCenters[i + 1]) as number;

      // Should be relatively close (within 2% - nominal values have rounding)
      expect(Math.abs(upper - lower) / upper).toBeLessThan(0.02);
    }
  });
});
