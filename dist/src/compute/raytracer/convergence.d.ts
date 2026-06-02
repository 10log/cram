import { KVP } from '../../common/key-value-pair';
import { RayPath, ConvergenceMetrics } from './types';
/**
 * Reset convergence state for a new simulation run.
 *
 * @param numFrequencies - Number of frequency bands
 * @returns An object containing the fresh convergenceMetrics and energyHistogram
 */
export declare function resetConvergenceState(numFrequencies: number): {
    convergenceMetrics: ConvergenceMetrics;
    energyHistogram: KVP<Float32Array[]>;
    lastConvergenceCheck: number;
};
/**
 * Compute T30 from Schroeder backward integration of the energy histogram
 * and update convergence metrics using Welford's online algorithm.
 *
 * @param convergenceMetrics - The current convergence metrics (mutated in place)
 * @param energyHistogram - The energy histogram keyed by receiver ID
 * @param frequencies - Frequency bands array
 * @param receiverIDs - Ordered array of receiver IDs
 * @param numCheckedPaths - Total number of checked paths
 * @param validRayCount - Total number of valid rays
 * @param histogramBinWidth - Width of each histogram bin in seconds
 * @param histogramNumBins - Total number of histogram bins
 * @param uuid - Solver UUID for emitting property updates
 */
export declare function updateConvergenceMetrics(convergenceMetrics: ConvergenceMetrics, energyHistogram: KVP<Float32Array[]>, frequencies: number[], receiverIDs: string[], numCheckedPaths: number, validRayCount: number, histogramBinWidth: number, histogramNumBins: number, uuid: string): void;
/**
 * Add a ray path's energy to the convergence histogram.
 *
 * @param energyHistogram - The energy histogram (mutated in place)
 * @param receiverId - The receiver UUID
 * @param path - The ray path to add
 * @param frequencies - Frequency bands array
 * @param soundSpeed - Speed of sound in m/s
 * @param histogramBinWidth - Width of each histogram bin in seconds
 * @param histogramNumBins - Total number of histogram bins
 */
export declare function addToEnergyHistogram(energyHistogram: KVP<Float32Array[]>, receiverId: string, path: RayPath, frequencies: number[], soundSpeed: number, histogramBinWidth: number, histogramNumBins: number): void;
