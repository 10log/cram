/**
 * Tests for RT60 air absorption using ISO-based airAttenuation().
 *
 * Bug: The RT60 solver used airAbs20c40rh(), a hardcoded lookup function
 * with values only for 20°C/40% RH, returning 0 for 125 Hz and 250 Hz.
 * The codebase has a proper ISO 9613-1 based airAttenuation() function
 * in acoustics/air-attenuation.ts that handles arbitrary conditions.
 *
 * Fix: Replace airAbs20c40rh() with airAttenuation().
 */

import { airAttenuation } from '../../acoustics/air-attenuation';

describe('RT60 air absorption replacement', () => {
  describe('old hardcoded function deficiencies', () => {
    // These reproduce the old hardcoded values to show what was wrong
    const oldAirAbs: Record<number, number> = {
      125: 0,        // Missing! Returns 0
      250: 0,        // Missing! Returns 0
      500: 0.000600423,
      1000: 0.001069606,
      2000: 0.002578866,
      4000: 0.00839936,
      8000: 0.0246,
    };

    it('old function returned 0 for 125 Hz and 250 Hz', () => {
      expect(oldAirAbs[125]).toBe(0);
      expect(oldAirAbs[250]).toBe(0);
    });

    it('old function only worked for 20°C / 40% RH', () => {
      // The old function had no temperature or humidity parameters
      // It was literally a switch statement on frequency
    });
  });

  describe('ISO airAttenuation function', () => {
    it('returns non-zero values for all standard octave bands', () => {
      const freqs = [125, 250, 500, 1000, 2000, 4000, 8000];
      const results = airAttenuation(freqs, 20, 40);

      results.forEach((val, i) => {
        expect(val).toBeGreaterThan(0);
        expect(Number.isFinite(val)).toBe(true);
      });
    });

    it('returns increasing attenuation with frequency', () => {
      const freqs = [125, 250, 500, 1000, 2000, 4000, 8000];
      const results = airAttenuation(freqs, 20, 50);

      // Air attenuation increases with frequency
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBeGreaterThan(results[i - 1]);
      }
    });

    it('supports different temperature and humidity conditions', () => {
      const freqs = [1000, 4000];

      const result20_40 = airAttenuation(freqs, 20, 40);
      const result30_30 = airAttenuation(freqs, 30, 30);
      const result10_70 = airAttenuation(freqs, 10, 70);

      // Different conditions should give different results
      expect(result20_40[0]).not.toBeCloseTo(result30_30[0], 3);
      expect(result20_40[0]).not.toBeCloseTo(result10_70[0], 3);
    });

    it('125 Hz attenuation is now non-zero (fixing the old bug)', () => {
      const result = airAttenuation([125], 20, 40);
      expect(result[0]).toBeGreaterThan(0);
    });

    it('250 Hz attenuation is now non-zero (fixing the old bug)', () => {
      const result = airAttenuation([250], 20, 40);
      expect(result[0]).toBeGreaterThan(0);
    });
  });

  describe('source code verification', () => {
    it('RT60 imports airAttenuation from acoustics module', () => {
      const fs = require('fs');
      const path = require('path');

      const sourceFile = fs.readFileSync(
        path.resolve(__dirname, '..', 'index.ts'),
        'utf8'
      );

      expect(sourceFile).toMatch(/import.*airAttenuation.*from.*air-attenuation/);
    });

    it('airAbs20c40rh function is removed', () => {
      const fs = require('fs');
      const path = require('path');

      const sourceFile = fs.readFileSync(
        path.resolve(__dirname, '..', 'index.ts'),
        'utf8'
      );

      expect(sourceFile).not.toMatch(/airAbs20c40rh/);
    });
  });

  describe('impact on RT60 calculation', () => {
    it('air absorption affects large rooms more than small rooms', () => {
      const freq = 4000;
      const m = airAttenuation([freq], 20, 40)[0] / (20 / Math.log(10));
      const airTerm_small = 4 * m * 50;   // 50 m³
      const airTerm_large = 4 * m * 5000;  // 5000 m³

      expect(airTerm_large).toBeGreaterThan(airTerm_small * 90);
    });

    it('air absorption effect is significant at 8 kHz', () => {
      const m_8k = airAttenuation([8000], 20, 40)[0] / (20 / Math.log(10));
      const m_500 = airAttenuation([500], 20, 40)[0] / (20 / Math.log(10));

      // 8 kHz air absorption should be much larger than 500 Hz
      expect(m_8k / m_500).toBeGreaterThan(10);
    });
  });
});
