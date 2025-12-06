import { soundSpeed } from '../sound-speed';
import { SOUND_SPEED_REFERENCE } from '../../../__fixtures__/acoustic-references';

describe('soundSpeed', () => {
  describe('basic functionality', () => {
    it('returns a positive number', () => {
      const result = soundSpeed(20);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    it('returns speed in m/s', () => {
      const result = soundSpeed(20);
      // Speed of sound at 20°C should be around 343 m/s
      expect(result).toBeGreaterThan(300);
      expect(result).toBeLessThan(400);
    });
  });

  describe('reference value validation', () => {
    it.each(Object.entries(SOUND_SPEED_REFERENCE))(
      'at %s°C returns approximately %s m/s',
      (tempStr, expected) => {
        const temperature = parseInt(tempStr);
        const result = soundSpeed(temperature);
        // Allow 1% tolerance
        expect(result).toBeCloseTo(expected, 0);
      }
    );
  });

  describe('temperature dependence', () => {
    it('speed increases with temperature', () => {
      const cold = soundSpeed(0);
      const warm = soundSpeed(20);
      const hot = soundSpeed(40);

      expect(warm).toBeGreaterThan(cold);
      expect(hot).toBeGreaterThan(warm);
    });

    it('follows expected rate of change (~0.6 m/s per °C)', () => {
      const c1 = soundSpeed(15);
      const c2 = soundSpeed(25);

      // Change over 10°C should be roughly 6 m/s
      const change = c2 - c1;
      expect(change).toBeGreaterThan(5);
      expect(change).toBeLessThan(7);
    });

    it('relationship is approximately linear over small ranges', () => {
      const c0 = soundSpeed(10);
      const c1 = soundSpeed(20);
      const c2 = soundSpeed(30);

      const diff1 = c1 - c0;
      const diff2 = c2 - c1;

      // Differences should be similar (within 10%)
      expect(Math.abs(diff1 - diff2) / diff1).toBeLessThan(0.1);
    });
  });

  describe('standard conditions', () => {
    it('at 0°C returns approximately 331.3 m/s', () => {
      const result = soundSpeed(0);
      expect(result).toBeCloseTo(331.3, 0);
    });

    it('at 15°C (standard temperature) returns approximately 340 m/s', () => {
      const result = soundSpeed(15);
      expect(result).toBeCloseTo(340, 0);
    });

    it('at 20°C (room temperature) returns approximately 343 m/s', () => {
      const result = soundSpeed(20);
      expect(result).toBeCloseTo(343, 0);
    });
  });

  describe('extreme temperatures', () => {
    it('handles very cold temperatures', () => {
      const result = soundSpeed(-40);
      expect(result).toBeGreaterThan(300);
      expect(isFinite(result)).toBe(true);
    });

    it('handles very hot temperatures', () => {
      const result = soundSpeed(50);
      expect(result).toBeGreaterThan(350);
      expect(isFinite(result)).toBe(true);
    });

    it('handles freezing point', () => {
      const result = soundSpeed(0);
      expect(result).toBeCloseTo(331.3, 0);
    });

    it('handles absolute zero approach (theoretical)', () => {
      // At -273.15°C, speed would approach 0
      // Formula: c = 20.05 * sqrt(T + 273.15)
      const result = soundSpeed(-270);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(50);
    });
  });

  describe('formula verification', () => {
    it('follows the formula c = 20.05 * sqrt(T + 273.15)', () => {
      const testTemps = [-20, 0, 15, 20, 25, 30, 40];

      testTemps.forEach(T => {
        const result = soundSpeed(T);
        const expected = 20.05 * Math.sqrt(T + 273.15);
        expect(result).toBeCloseTo(expected, 6);
      });
    });
  });

  describe('numerical stability', () => {
    it('produces consistent results', () => {
      const temp = 20;
      const results = Array.from({ length: 10 }, () => soundSpeed(temp));

      results.forEach(result => {
        expect(result).toBe(results[0]);
      });
    });

    it('handles decimal temperatures', () => {
      const result = soundSpeed(20.5);
      expect(isFinite(result)).toBe(true);
      expect(result).toBeGreaterThan(soundSpeed(20));
      expect(result).toBeLessThan(soundSpeed(21));
    });
  });

  describe('acoustic calculations integration', () => {
    it('can be used to calculate wavelength', () => {
      const c = soundSpeed(20);
      const frequency = 1000; // Hz
      const wavelength = c / frequency;

      // At 1kHz and 20°C, wavelength should be about 0.343m
      expect(wavelength).toBeCloseTo(0.343, 2);
    });

    it('can be used to calculate distance from time', () => {
      const c = soundSpeed(20);
      const time = 0.1; // seconds
      const distance = c * time;

      // Sound travels about 34.3m in 0.1s at 20°C
      expect(distance).toBeCloseTo(34.3, 0);
    });
  });
});
