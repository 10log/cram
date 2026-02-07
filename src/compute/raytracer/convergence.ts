import linearRegression from "../../common/linear-regression";
import { emit } from "../../messenger";
import { KVP } from "../../common/key-value-pair";
import { RayPath, ConvergenceMetrics } from "./types";

/**
 * Reset convergence state for a new simulation run.
 *
 * @param numFrequencies - Number of frequency bands
 * @returns An object containing the fresh convergenceMetrics and energyHistogram
 */
export function resetConvergenceState(numFrequencies: number): {
  convergenceMetrics: ConvergenceMetrics;
  energyHistogram: KVP<Float32Array[]>;
  lastConvergenceCheck: number;
} {
  const convergenceMetrics: ConvergenceMetrics = {
    totalRays: 0,
    validRays: 0,
    estimatedT30: new Array(numFrequencies).fill(0),
    t30Mean: new Array(numFrequencies).fill(0),
    t30M2: new Array(numFrequencies).fill(0),
    t30Count: 0,
    convergenceRatio: Infinity,
  };
  const energyHistogram = {} as KVP<Float32Array[]>;
  const lastConvergenceCheck = Date.now();
  return { convergenceMetrics, energyHistogram, lastConvergenceCheck };
}

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
export function updateConvergenceMetrics(
  convergenceMetrics: ConvergenceMetrics,
  energyHistogram: KVP<Float32Array[]>,
  frequencies: number[],
  receiverIDs: string[],
  numCheckedPaths: number,
  validRayCount: number,
  histogramBinWidth: number,
  histogramNumBins: number,
  uuid: string
): void {
  convergenceMetrics.totalRays = numCheckedPaths;
  convergenceMetrics.validRays = validRayCount;

  // Choose a stable receiver with data for convergence metrics
  const receiverIdsWithData = Object.keys(energyHistogram);
  if (receiverIdsWithData.length === 0) return;

  let receiverId: string | undefined;

  // Prefer stable ordering via receiverIDs
  if (receiverIDs.length > 0) {
    for (const id of receiverIDs) {
      const hist = energyHistogram[id];
      if (hist && hist.length > 0) {
        receiverId = id;
        break;
      }
    }
  }

  // Fallback: lexicographically smallest ID with data
  if (!receiverId) {
    const sortedIds = receiverIdsWithData.slice().sort();
    for (const id of sortedIds) {
      const hist = energyHistogram[id];
      if (hist && hist.length > 0) {
        receiverId = id;
        break;
      }
    }
  }

  if (!receiverId) return;

  const histograms = energyHistogram[receiverId];
  if (!histograms || histograms.length === 0) return;

  const numBands = frequencies.length;
  const t30Estimates = new Array(numBands).fill(0);

  for (let f = 0; f < numBands; f++) {
    const histogram = histograms[f];

    // Find last non-zero bin
    let lastBin = 0;
    for (let b = histogramNumBins - 1; b >= 0; b--) {
      if (histogram[b] > 0) { lastBin = b; break; }
    }
    if (lastBin < 2) { t30Estimates[f] = 0; continue; }

    // Schroeder backward integration
    const schroeder = new Float32Array(lastBin + 1);
    schroeder[lastBin] = histogram[lastBin];
    for (let b = lastBin - 1; b >= 0; b--) {
      schroeder[b] = schroeder[b + 1] + histogram[b];
    }

    // Convert to dB (relative to max)
    const maxVal = schroeder[0];
    if (maxVal <= 0) { t30Estimates[f] = 0; continue; }

    // Find -5dB and -35dB points for T30 estimation
    const db5 = maxVal * Math.pow(10, -5 / 10);
    const db35 = maxVal * Math.pow(10, -35 / 10);
    let idx5 = -1, idx35 = -1;

    for (let b = 0; b <= lastBin; b++) {
      if (idx5 < 0 && schroeder[b] <= db5) idx5 = b;
      if (idx35 < 0 && schroeder[b] <= db35) idx35 = b;
    }

    if (idx5 >= 0 && idx35 > idx5) {
      // Linear regression in log domain between -5dB and -35dB
      const times: number[] = [];
      const levelsDb: number[] = [];

      for (let b = idx5; b <= idx35; b++) {
        const value = schroeder[b];
        if (value > 0) {
          times.push(b * histogramBinWidth);
          levelsDb.push(10 * Math.log10(value / maxVal));
        }
      }

      if (times.length >= 2) {
        const regression = linearRegression(times, levelsDb);
        const slope = regression.m;
        // T60: time for 60 dB decay, extrapolated from decay slope in dB/s
        t30Estimates[f] = slope < 0 ? 60 / -slope : 0;
      }
    }
  }

  convergenceMetrics.estimatedT30 = t30Estimates;

  // Welford's online algorithm for running mean and variance
  convergenceMetrics.t30Count += 1;
  const n = convergenceMetrics.t30Count;

  let maxRatio = 0;
  let validBandCount = 0;
  for (let f = 0; f < numBands; f++) {
    const val = t30Estimates[f];
    const oldMean = convergenceMetrics.t30Mean[f];
    const newMean = oldMean + (val - oldMean) / n;
    const oldM2 = convergenceMetrics.t30M2[f];
    const newM2 = oldM2 + (val - oldMean) * (val - newMean);
    convergenceMetrics.t30Mean[f] = newMean;
    convergenceMetrics.t30M2[f] = newM2;

    // Coefficient of variation: std / mean (skip bands with no valid T30)
    if (n >= 2 && newMean > 0) {
      const variance = newM2 / (n - 1);
      const ratio = Math.sqrt(variance) / newMean;
      if (ratio > maxRatio) maxRatio = ratio;
      validBandCount++;
    }
    // Bands with zero/invalid T30 are excluded from convergence check
  }
  // Only report convergence if at least one band has a valid estimate
  convergenceMetrics.convergenceRatio = validBandCount > 0 ? maxRatio : Infinity;

  // Emit update so UI can display metrics
  emit("RAYTRACER_SET_PROPERTY", {
    uuid: uuid,
    property: "convergenceMetrics",
    value: { ...convergenceMetrics }
  });
}

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
export function addToEnergyHistogram(
  energyHistogram: KVP<Float32Array[]>,
  receiverId: string,
  path: RayPath,
  frequencies: number[],
  soundSpeed: number,
  histogramBinWidth: number,
  histogramNumBins: number
): void {
  if (!energyHistogram[receiverId]) {
    energyHistogram[receiverId] = [];
    for (let f = 0; f < frequencies.length; f++) {
      energyHistogram[receiverId].push(new Float32Array(histogramNumBins));
    }
  }
  // Compute total time from chain distances
  let totalTime = 0;
  for (let k = 0; k < path.chain.length; k++) {
    totalTime += path.chain[k].distance;
  }
  totalTime /= soundSpeed;
  const bin = Math.floor(totalTime / histogramBinWidth);
  if (bin >= 0 && bin < histogramNumBins && path.bandEnergy) {
    for (let f = 0; f < frequencies.length; f++) {
      energyHistogram[receiverId][f][bin] += path.bandEnergy[f] || 0;
    }
  }
}
