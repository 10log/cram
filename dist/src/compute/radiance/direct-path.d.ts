/**
 * Direct sound is one geometric path. It is not a per-band quantity in
 * this formulation — adding `initialEnergy` into every octave buffer and
 * then summing makes the direct bin N_bands times too large (#116).
 *
 * Air on this energy path uses 10 log₁₀ (#118), not the pressure 20 log.
 */
export declare const DIRECT_AIR_FREQUENCY_HZ = 1000;
export declare function pickDirectAirFrequency(frequencies: number[]): number;
export declare function directPathEnergy(opts: {
    energy: number;
    distance: number;
    airAbsDbPerMeter: number;
}): number;
export declare function directPathSampleIndex(distance: number, speedOfSound: number, sampleRate: number): number;
