/**
 * Acoustic Unit Conversion Tests
 *
 * Tests for functions that convert between acoustic units:
 * - Sound pressure level (Lp) and pressure (P)
 * - Sound power level (Lw) and power (W)
 * - Sound intensity level (Li) and intensity (I)
 * - Conversions between Lp/Lw with distance and directivity
 */

import {
  Lw2Lp,
  Lp2Lw,
  P2Lp,
  Lp2P,
  I2Li,
  Li2I,
  W2Lw,
  Lw2W,
  P2I,
  I2P,
  Lp2Ln,
} from '../convert';

describe('Acoustic Unit Conversions', () => {
  describe('P2Lp (Pressure to Sound Pressure Level)', () => {
    it('converts reference pressure (20 µPa) to 0 dB', () => {
      const result = P2Lp(2e-5) as number;
      expect(result).toBeCloseTo(0, 5);
    });

    it('converts 0.2 Pa to 80 dB', () => {
      // 20 * log10(0.2 / 2e-5) = 20 * log10(10000) = 80
      const result = P2Lp(0.2) as number;
      expect(result).toBeCloseTo(80, 5);
    });

    it('converts 2 Pa to 100 dB', () => {
      const result = P2Lp(2) as number;
      expect(result).toBeCloseTo(100, 5);
    });

    it('converts 20 Pa to 120 dB', () => {
      const result = P2Lp(20) as number;
      expect(result).toBeCloseTo(120, 5);
    });

    it('handles array input', () => {
      const pressures = [2e-5, 0.2, 2];
      const result = P2Lp(pressures) as number[];
      expect(result[0]).toBeCloseTo(0, 5);
      expect(result[1]).toBeCloseTo(80, 5);
      expect(result[2]).toBeCloseTo(100, 5);
    });
  });

  describe('Lp2P (Sound Pressure Level to Pressure)', () => {
    it('converts 0 dB to reference pressure (20 µPa)', () => {
      const result = Lp2P(0) as number;
      expect(result).toBeCloseTo(2e-5, 10);
    });

    it('converts 80 dB to 0.2 Pa', () => {
      const result = Lp2P(80) as number;
      expect(result).toBeCloseTo(0.2, 5);
    });

    it('converts 100 dB to 2 Pa', () => {
      const result = Lp2P(100) as number;
      expect(result).toBeCloseTo(2, 5);
    });

    it('converts 120 dB to 20 Pa', () => {
      const result = Lp2P(120) as number;
      expect(result).toBeCloseTo(20, 5);
    });

    it('handles array input', () => {
      const levels = [0, 80, 100];
      const result = Lp2P(levels) as number[];
      expect(result[0]).toBeCloseTo(2e-5, 10);
      expect(result[1]).toBeCloseTo(0.2, 5);
      expect(result[2]).toBeCloseTo(2, 5);
    });
  });

  describe('P2Lp and Lp2P roundtrip', () => {
    it('roundtrips correctly for various pressures', () => {
      const pressures = [2e-5, 0.002, 0.02, 0.2, 2, 20];
      pressures.forEach((p) => {
        const lp = P2Lp(p) as number;
        const backToP = Lp2P(lp) as number;
        expect(backToP).toBeCloseTo(p, 8);
      });
    });
  });

  describe('W2Lw (Power to Sound Power Level)', () => {
    it('converts reference power (1 pW) to 0 dB', () => {
      const result = W2Lw(1e-12) as number;
      expect(result).toBeCloseTo(0, 5);
    });

    it('converts 1 W to 120 dB', () => {
      // 10 * log10(1 / 1e-12) = 10 * 12 = 120
      const result = W2Lw(1) as number;
      expect(result).toBeCloseTo(120, 5);
    });

    it('converts 0.001 W to 90 dB', () => {
      const result = W2Lw(0.001) as number;
      expect(result).toBeCloseTo(90, 5);
    });

    it('handles array input', () => {
      const powers = [1e-12, 1e-6, 1];
      const result = W2Lw(powers) as number[];
      expect(result[0]).toBeCloseTo(0, 5);
      expect(result[1]).toBeCloseTo(60, 5);
      expect(result[2]).toBeCloseTo(120, 5);
    });
  });

  describe('Lw2W (Sound Power Level to Power)', () => {
    it('converts 0 dB to reference power (1 pW)', () => {
      const result = Lw2W(0) as number;
      expect(result).toBeCloseTo(1e-12, 17);
    });

    it('converts 120 dB to 1 W', () => {
      const result = Lw2W(120) as number;
      expect(result).toBeCloseTo(1, 5);
    });

    it('converts 90 dB to 0.001 W', () => {
      const result = Lw2W(90) as number;
      expect(result).toBeCloseTo(0.001, 8);
    });

    it('handles array input', () => {
      const levels = [0, 60, 120];
      const result = Lw2W(levels) as number[];
      expect(result[0]).toBeCloseTo(1e-12, 17);
      expect(result[1]).toBeCloseTo(1e-6, 11);
      expect(result[2]).toBeCloseTo(1, 5);
    });
  });

  describe('W2Lw and Lw2W roundtrip', () => {
    it('roundtrips correctly for various powers', () => {
      const powers = [1e-12, 1e-9, 1e-6, 1e-3, 1, 1000];
      powers.forEach((w) => {
        const lw = W2Lw(w) as number;
        const backToW = Lw2W(lw) as number;
        expect(backToW).toBeCloseTo(w, 8);
      });
    });
  });

  describe('I2Li (Intensity to Sound Intensity Level)', () => {
    it('converts reference intensity (1 pW/m²) to 0 dB', () => {
      const result = I2Li(1e-12) as number;
      expect(result).toBeCloseTo(0, 5);
    });

    it('converts 1 W/m² to 120 dB', () => {
      const result = I2Li(1) as number;
      expect(result).toBeCloseTo(120, 5);
    });

    it('handles array input', () => {
      const intensities = [1e-12, 1e-6, 1];
      const result = I2Li(intensities) as number[];
      expect(result[0]).toBeCloseTo(0, 5);
      expect(result[1]).toBeCloseTo(60, 5);
      expect(result[2]).toBeCloseTo(120, 5);
    });
  });

  describe('Li2I (Sound Intensity Level to Intensity)', () => {
    it('converts 0 dB to reference intensity (1 pW/m²)', () => {
      const result = Li2I(0) as number;
      expect(result).toBeCloseTo(1e-12, 17);
    });

    it('converts 120 dB to 1 W/m²', () => {
      const result = Li2I(120) as number;
      expect(result).toBeCloseTo(1, 5);
    });

    it('handles array input', () => {
      const levels = [0, 60, 120];
      const result = Li2I(levels) as number[];
      expect(result[0]).toBeCloseTo(1e-12, 17);
      expect(result[1]).toBeCloseTo(1e-6, 11);
      expect(result[2]).toBeCloseTo(1, 5);
    });
  });

  describe('I2Li and Li2I roundtrip', () => {
    it('roundtrips correctly for various intensities', () => {
      const intensities = [1e-12, 1e-9, 1e-6, 1e-3, 1];
      intensities.forEach((i) => {
        const li = I2Li(i) as number;
        const backToI = Li2I(li) as number;
        expect(backToI).toBeCloseTo(i, 8);
      });
    });
  });

  describe('P2I (Pressure to Intensity)', () => {
    it('converts pressure to intensity using default impedance', () => {
      // I = p² / z0, default z0 = 400
      const result = P2I(2) as number; // 2 Pa
      expect(result).toBeCloseTo(0.01, 5); // 4 / 400 = 0.01
    });

    it('converts pressure to intensity with custom impedance', () => {
      const result = P2I(2, 413) as number; // 413 N·s/m³
      expect(result).toBeCloseTo(4 / 413, 5);
    });

    it('handles array input', () => {
      const pressures = [1, 2, 4];
      const result = P2I(pressures) as number[];
      expect(result[0]).toBeCloseTo(1 / 400, 8);
      expect(result[1]).toBeCloseTo(4 / 400, 8);
      expect(result[2]).toBeCloseTo(16 / 400, 8);
    });
  });

  describe('I2P (Intensity to Pressure)', () => {
    it('converts intensity to pressure using default impedance', () => {
      // p = sqrt(I * z0), default z0 = 400
      const result = I2P(0.01) as number;
      expect(result).toBeCloseTo(2, 5); // sqrt(0.01 * 400) = sqrt(4) = 2
    });

    it('converts intensity to pressure with custom impedance', () => {
      const result = I2P(0.01, 413) as number;
      expect(result).toBeCloseTo(Math.sqrt(0.01 * 413), 5);
    });

    it('handles array input', () => {
      const intensities = [0.0025, 0.01, 0.04];
      const result = I2P(intensities) as number[];
      expect(result[0]).toBeCloseTo(1, 5); // sqrt(0.0025 * 400) = 1
      expect(result[1]).toBeCloseTo(2, 5); // sqrt(0.01 * 400) = 2
      expect(result[2]).toBeCloseTo(4, 5); // sqrt(0.04 * 400) = 4
    });
  });

  describe('P2I and I2P roundtrip', () => {
    it('roundtrips correctly for various pressures', () => {
      const pressures = [0.1, 1, 2, 10];
      pressures.forEach((p) => {
        const i = P2I(p) as number;
        const backToP = I2P(i) as number;
        expect(backToP).toBeCloseTo(p, 8);
      });
    });
  });

  describe('Lw2Lp (Sound Power Level to Sound Pressure Level)', () => {
    it('converts at 1m distance with Q=1', () => {
      // Lp = Lw - |10 * log10(Q / (4 * π * r²))|
      // At r=1, Q=1: Lp = Lw - |10 * log10(1 / (4π))| = Lw - 10.99
      const result = Lw2Lp(100, 1, 1) as number;
      expect(result).toBeCloseTo(100 - 10.99, 1);
    });

    it('decreases with distance (inverse square law)', () => {
      const at1m = Lw2Lp(100, 1, 1) as number;
      const at2m = Lw2Lp(100, 2, 1) as number;
      const at10m = Lw2Lp(100, 10, 1) as number;

      // Each doubling of distance reduces by ~6 dB
      expect(at1m - at2m).toBeCloseTo(6, 0);
      // 10x distance reduces by 20 dB
      expect(at1m - at10m).toBeCloseTo(20, 0);
    });

    it('increases with directivity', () => {
      const q1 = Lw2Lp(100, 1, 1) as number;
      const q2 = Lw2Lp(100, 1, 2) as number;
      const q4 = Lw2Lp(100, 1, 4) as number;

      // Doubling Q increases by ~3 dB
      expect(q2 - q1).toBeCloseTo(3, 0);
      expect(q4 - q1).toBeCloseTo(6, 0);
    });

    it('handles array input', () => {
      const levels = [80, 90, 100];
      const result = Lw2Lp(levels, 1, 1) as number[];
      expect(result).toHaveLength(3);
      expect(result[1] - result[0]).toBeCloseTo(10, 5);
      expect(result[2] - result[1]).toBeCloseTo(10, 5);
    });
  });

  describe('Lp2Lw (Sound Pressure Level to Sound Power Level)', () => {
    it('converts at 1m distance with Q=1', () => {
      const result = Lp2Lw(89, 1, 1) as number;
      expect(result).toBeCloseTo(100, 0);
    });

    it('handles array input', () => {
      const levels = [69, 79, 89];
      const result = Lp2Lw(levels, 1, 1) as number[];
      expect(result).toHaveLength(3);
      expect(result[1] - result[0]).toBeCloseTo(10, 5);
    });
  });

  describe('Lw2Lp and Lp2Lw roundtrip', () => {
    it('roundtrips correctly for various configurations', () => {
      const configs = [
        { Lw: 100, r: 1, Q: 1 },
        { Lw: 90, r: 2, Q: 2 },
        { Lw: 80, r: 5, Q: 4 },
      ];

      configs.forEach(({ Lw, r, Q }) => {
        const Lp = Lw2Lp(Lw, r, Q) as number;
        const backToLw = Lp2Lw(Lp, r, Q) as number;
        expect(backToLw).toBeCloseTo(Lw, 5);
      });
    });
  });

  describe('Lp2Ln (Sound Pressure Level to Loudness Level)', () => {
    it('converts Lp to Ln with given room area', () => {
      // Ln = Lp - 10 * log10(Ao / Ar)
      // With Ar = Ao (108), Ln = Lp
      const result = Lp2Ln(80, 108) as number;
      expect(result).toBeCloseTo(80, 5);
    });

    it('increases Ln when Ar > Ao', () => {
      // Larger room area increases Ln
      // Ln = Lp - 10 * log10(Ao / Ar) = 80 - 10 * log10(108/216) = 80 - 10*(-0.301) ≈ 83
      const result = Lp2Ln(80, 216) as number;
      expect(result).toBeCloseTo(83, 0);
    });

    it('decreases Ln when Ar < Ao', () => {
      // Smaller room area decreases Ln
      // Ln = Lp - 10 * log10(Ao / Ar) = 80 - 10 * log10(108/54) = 80 - 10*(0.301) ≈ 77
      const result = Lp2Ln(80, 54) as number;
      expect(result).toBeCloseTo(77, 0);
    });

    it('handles array input', () => {
      const levels = [70, 80, 90];
      const result = Lp2Ln(levels, 108) as number[];
      expect(result[0]).toBeCloseTo(70, 5);
      expect(result[1]).toBeCloseTo(80, 5);
      expect(result[2]).toBeCloseTo(90, 5);
    });
  });
});
