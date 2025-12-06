/**
 * Reference data for acoustic calculation validation
 *
 * These values are derived from:
 * - ISO 9613-1:1993 - Attenuation of sound during propagation outdoors
 * - ISO 354:2003 - Measurement of sound absorption in a reverberation room
 * - Kuttruff, H. (2009). Room Acoustics (5th ed.)
 * - Standard acoustic engineering references
 */

/**
 * ISO 9613-1 Air Attenuation Reference Values
 * Atmospheric absorption coefficient α in dB/m at standard conditions
 * Temperature: 20°C, Relative Humidity: 50%, Pressure: 101.325 kPa
 */
export const ISO_AIR_ATTENUATION_20C_50RH: Record<number, number> = {
  63: 0.0001,
  125: 0.0003,
  250: 0.0011,
  500: 0.0019,
  1000: 0.0037,
  2000: 0.0099,
  4000: 0.0330,
  8000: 0.1140,
};

/**
 * Air attenuation at different temperature/humidity combinations
 * Format: { temperature_humidity: { frequency: attenuation } }
 */
export const ISO_AIR_ATTENUATION_VARIANTS: Record<string, Record<number, number>> = {
  // 10°C, 70% RH
  '10_70': {
    125: 0.0003,
    250: 0.0008,
    500: 0.0017,
    1000: 0.0035,
    2000: 0.0080,
    4000: 0.0220,
    8000: 0.0720,
  },
  // 20°C, 40% RH
  '20_40': {
    125: 0.0003,
    250: 0.0011,
    500: 0.0020,
    1000: 0.0041,
    2000: 0.0112,
    4000: 0.0380,
    8000: 0.1300,
  },
  // 30°C, 30% RH
  '30_30': {
    125: 0.0003,
    250: 0.0012,
    500: 0.0024,
    1000: 0.0052,
    2000: 0.0143,
    4000: 0.0470,
    8000: 0.1570,
  },
};

/**
 * Reference rooms with known acoustic properties for RT60 validation
 */
export interface ReferenceRoom {
  name: string;
  dimensions: { length: number; width: number; height: number };
  volume: number; // m³
  surfaceArea: number; // m²
  /** Average absorption coefficient per frequency band */
  absorption: Record<number, number>;
  /** Expected Sabine RT60 values (seconds) */
  expectedSabine: Record<number, number>;
  /** Expected Eyring RT60 values (seconds) */
  expectedEyring: Record<number, number>;
}

export const REFERENCE_ROOMS: Record<string, ReferenceRoom> = {
  /**
   * Simple shoebox room with uniform absorption
   * All surfaces: α = 0.1 (typical painted concrete)
   */
  shoebox_uniform: {
    name: 'Shoebox - Uniform Absorption',
    dimensions: { length: 10, width: 6, height: 3 },
    volume: 180,
    surfaceArea: 216, // 2*(10*6 + 10*3 + 6*3) = 2*(60+30+18) = 216
    absorption: {
      125: 0.10,
      250: 0.10,
      500: 0.10,
      1000: 0.10,
      2000: 0.10,
      4000: 0.10,
      8000: 0.10,
    },
    // Sabine RT60 = 0.161 * V / A = 0.161 * 180 / 21.6 = 1.34s
    expectedSabine: {
      125: 1.34,
      250: 1.34,
      500: 1.34,
      1000: 1.34,
      2000: 1.34,
      4000: 1.34,
      8000: 1.34,
    },
    // Eyring RT60 = 0.161 * V / (-S * ln(1-α)) = 0.161 * 180 / (-216 * ln(0.9))
    // = 28.98 / 22.77 = 1.27s
    expectedEyring: {
      125: 1.27,
      250: 1.27,
      500: 1.27,
      1000: 1.27,
      2000: 1.27,
      4000: 1.27,
      8000: 1.27,
    },
  },

  /**
   * Medium absorption room (typical office)
   * Average α ≈ 0.25
   */
  office: {
    name: 'Typical Office',
    dimensions: { length: 8, width: 6, height: 2.7 },
    volume: 129.6,
    surfaceArea: 171.6, // 2*(8*6 + 8*2.7 + 6*2.7)
    absorption: {
      125: 0.15,
      250: 0.20,
      500: 0.25,
      1000: 0.30,
      2000: 0.30,
      4000: 0.25,
      8000: 0.20,
    },
    expectedSabine: {
      125: 0.81,
      250: 0.61,
      500: 0.49,
      1000: 0.41,
      2000: 0.41,
      4000: 0.49,
      8000: 0.61,
    },
    expectedEyring: {
      125: 0.74,
      250: 0.54,
      500: 0.42,
      1000: 0.34,
      2000: 0.34,
      4000: 0.42,
      8000: 0.54,
    },
  },

  /**
   * High absorption room (recording studio)
   * Average α ≈ 0.5
   */
  studio: {
    name: 'Recording Studio',
    dimensions: { length: 6, width: 5, height: 3 },
    volume: 90,
    surfaceArea: 126,
    absorption: {
      125: 0.35,
      250: 0.45,
      500: 0.55,
      1000: 0.60,
      2000: 0.60,
      4000: 0.55,
      8000: 0.50,
    },
    expectedSabine: {
      125: 0.33,
      250: 0.26,
      500: 0.21,
      1000: 0.19,
      2000: 0.19,
      4000: 0.21,
      8000: 0.23,
    },
    expectedEyring: {
      125: 0.24,
      250: 0.18,
      500: 0.13,
      1000: 0.11,
      2000: 0.11,
      4000: 0.13,
      8000: 0.15,
    },
  },
};

/**
 * ISO standard octave band center frequencies
 */
export const ISO_OCTAVE_BANDS = [16, 31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

/**
 * ISO standard third-octave band center frequencies
 */
export const ISO_THIRD_OCTAVE_BANDS = [
  12.5, 16, 20, 25, 31.5, 40, 50, 63, 80, 100,
  125, 160, 200, 250, 315, 400, 500, 630, 800, 1000,
  1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000,
  12500, 16000, 20000,
];

/**
 * Speed of sound reference values at various temperatures
 * c = 331.3 * sqrt(1 + T/273.15) or approximately c = 20.05 * sqrt(T + 273.15)
 */
export const SOUND_SPEED_REFERENCE: Record<number, number> = {
  '-20': 319.1,
  '-10': 325.2,
  0: 331.3,
  10: 337.3,
  15: 340.3,
  20: 343.2,
  25: 346.1,
  30: 349.0,
  40: 354.7,
};

/**
 * dB addition reference values
 * Adding equal levels: L + L = L + 3dB
 * Adding different levels follows: 10*log10(10^(L1/10) + 10^(L2/10))
 */
export const DB_ADDITION_REFERENCE = [
  { inputs: [60, 60], expected: 63.01 },
  { inputs: [70, 70], expected: 73.01 },
  { inputs: [60, 70], expected: 70.41 },
  { inputs: [60, 66], expected: 67.0 },
  { inputs: [80, 80, 80], expected: 84.77 },
  { inputs: [90, 90, 90, 90], expected: 96.02 },
  { inputs: [50, 60, 70], expected: 70.46 },
];

/**
 * Common material absorption coefficients for validation
 * Values from various acoustic material databases
 */
export const MATERIAL_ABSORPTION: Record<string, Record<number, number>> = {
  concrete_painted: {
    125: 0.10,
    250: 0.05,
    500: 0.06,
    1000: 0.07,
    2000: 0.09,
    4000: 0.08,
  },
  carpet_heavy: {
    125: 0.02,
    250: 0.06,
    500: 0.14,
    1000: 0.37,
    2000: 0.60,
    4000: 0.65,
  },
  glass_window: {
    125: 0.35,
    250: 0.25,
    500: 0.18,
    1000: 0.12,
    2000: 0.07,
    4000: 0.04,
  },
  acoustic_tile: {
    125: 0.20,
    250: 0.40,
    500: 0.70,
    1000: 0.80,
    2000: 0.60,
    4000: 0.40,
  },
  plywood_panel: {
    125: 0.28,
    250: 0.22,
    500: 0.17,
    1000: 0.09,
    2000: 0.10,
    4000: 0.11,
  },
};

/**
 * Acoustic constants
 */
export const ACOUSTIC_CONSTANTS = {
  /** Sabine constant for metric units (RT60 = 0.161 * V / A) */
  SABINE_METRIC: 0.161,
  /** Sabine constant for imperial units (RT60 = 0.049 * V / A) */
  SABINE_IMPERIAL: 0.049,
  /** Reference sound pressure (Pa) */
  P_REF: 2e-5,
  /** Reference sound intensity (W/m²) */
  I_REF: 1e-12,
  /** Reference sound power (W) */
  W_REF: 1e-12,
  /** Standard atmospheric pressure (Pa) */
  P_ATM: 101325,
  /** Density of air at 20°C (kg/m³) */
  RHO_AIR_20C: 1.204,
};
