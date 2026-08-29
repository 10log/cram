/**
 * Direct sound is one geometric path. It is not a per-band quantity in
 * this formulation — adding `initialEnergy` into every octave buffer and
 * then summing makes the direct bin N_bands times too large (#116).
 *
 * Air conversion matches the current ART shoot/gather (pressure 20 log).
 * Energy-vs-pressure air is #118.
 */
export declare const DIRECT_AIR_FREQUENCY_HZ = 1000;
export declare function pickDirectAirFrequency(frequencies: number[]): number;
export declare function directPathEnergy(opts: {
    energy: number;
    distance: number;
    airAbsDbPerMeter: number;
}): number;
export declare function directPathSampleIndex(distance: number, speedOfSound: number, sampleRate: number): number;
