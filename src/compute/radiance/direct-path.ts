/**
 * Direct sound is one geometric path. It is not a per-band quantity in
 * this formulation — adding `initialEnergy` into every octave buffer and
 * then summing makes the direct bin N_bands times too large (#116).
 *
 * Air conversion matches the current ART shoot/gather (pressure 20 log).
 * Energy-vs-pressure air is #118.
 */

export const DIRECT_AIR_FREQUENCY_HZ = 1000;

export function pickDirectAirFrequency(frequencies: number[]): number {
  if (frequencies.includes(DIRECT_AIR_FREQUENCY_HZ)) return DIRECT_AIR_FREQUENCY_HZ;
  if (frequencies.length === 0) return DIRECT_AIR_FREQUENCY_HZ;
  return frequencies[Math.floor(frequencies.length / 2)];
}

export function directPathEnergy(opts: {
  energy: number;
  distance: number;
  airAbsDbPerMeter: number;
}): number {
  const { energy, distance, airAbsDbPerMeter } = opts;
  if (!(distance > 1e-6)) return 0;
  const airAbsNepers = airAbsDbPerMeter / (20 / Math.LN10);
  return (energy * Math.exp(-airAbsNepers * distance)) / (distance * distance);
}

export function directPathSampleIndex(
  distance: number,
  speedOfSound: number,
  sampleRate: number,
): number {
  return Math.round((distance / speedOfSound) * sampleRate);
}
