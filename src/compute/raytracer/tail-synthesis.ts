import linearRegression from "../../common/linear-regression";
import { DecayParameters, MIN_TAIL_DECAY_RATE, MAX_TAIL_END_TIME } from "./types";

const { log10, pow, floor, max, min, sqrt, cos, PI, random } = Math;

/**
 * Extract per-band decay parameters from an energy histogram using Schroeder
 * backward integration and linear regression.
 *
 * @param energyHistogram - Per-band energy histograms (already energy, not pressure)
 * @param frequencies - Frequency band centers
 * @param crossfadeTime - Crossfade start time in seconds (0 = auto-detect)
 * @param binWidth - Histogram bin width in seconds
 * @returns Per-band DecayParameters
 */
export function extractDecayParameters(
  energyHistogram: Float32Array[],
  frequencies: number[],
  crossfadeTime: number,
  binWidth: number,
): DecayParameters[] {
  const numBands = frequencies.length;
  const result: DecayParameters[] = [];

  for (let f = 0; f < numBands; f++) {
    const histogram = energyHistogram[f];

    // Find last non-zero bin
    let lastBin = 0;
    for (let b = histogram.length - 1; b >= 0; b--) {
      if (histogram[b] > 0) { lastBin = b; break; }
    }

    if (lastBin < 2) {
      result.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }

    // Schroeder backward integration (histogram is already energy, no squaring)
    const schroeder = new Float32Array(lastBin + 1);
    schroeder[lastBin] = histogram[lastBin];
    for (let b = lastBin - 1; b >= 0; b--) {
      schroeder[b] = schroeder[b + 1] + histogram[b];
    }

    const maxVal = schroeder[0];
    if (maxVal <= 0) {
      result.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }

    // Find -5dB and -35dB crossings for T30 estimation
    const db5 = maxVal * pow(10, -5 / 10);
    const db35 = maxVal * pow(10, -35 / 10);
    let idx5 = -1, idx35 = -1;

    for (let b = 0; b <= lastBin; b++) {
      if (idx5 < 0 && schroeder[b] <= db5) idx5 = b;
      if (idx35 < 0 && schroeder[b] <= db35) idx35 = b;
    }

    let decayRate = 0;
    let t60 = 0;

    if (idx5 >= 0 && idx35 > idx5) {
      // Linear regression in log domain between -5dB and -35dB
      const times: number[] = [];
      const levelsDb: number[] = [];

      for (let b = idx5; b <= idx35; b++) {
        const value = schroeder[b];
        if (value > 0) {
          times.push(b * binWidth);
          levelsDb.push(10 * log10(value / maxVal));
        }
      }

      if (times.length >= 2) {
        const regression = linearRegression(times, levelsDb);
        const slope = regression.m; // dB/s (negative)
        if (slope < 0) {
          decayRate = slope;
          t60 = -60 / slope;
        }
      }
    }

    // Clamp decay rate to minimum
    if (decayRate > -MIN_TAIL_DECAY_RATE && decayRate <= 0) {
      decayRate = -MIN_TAIL_DECAY_RATE;
      t60 = 60 / MIN_TAIL_DECAY_RATE;
    }

    // Auto-detect crossfade time: use the last non-zero bin minus a small margin
    let effectiveCrossfadeTime = crossfadeTime;
    if (effectiveCrossfadeTime <= 0) {
      const marginBins = max(1, floor(0.05 / binWidth)); // 50ms margin
      effectiveCrossfadeTime = max(0, (lastBin - marginBins)) * binWidth;
    }

    // Look up Schroeder curve value at crossfade bin for crossfadeLevel
    const crossfadeBin = min(floor(effectiveCrossfadeTime / binWidth), lastBin);
    const crossfadeLevel = crossfadeBin <= lastBin && crossfadeBin >= 0
      ? schroeder[crossfadeBin] / maxVal
      : 0;

    // endTime = crossfadeTime + remaining T60, clamped to MAX_TAIL_END_TIME
    const endTime = t60 > 0
      ? min(effectiveCrossfadeTime + t60, MAX_TAIL_END_TIME)
      : effectiveCrossfadeTime;

    result.push({ t60, decayRate, crossfadeLevel, crossfadeTime: effectiveCrossfadeTime, endTime });
  }

  return result;
}

/**
 * Synthesize a noise-based reverberation tail matching the decay characteristics.
 *
 * @param decayParams - Per-band decay parameters
 * @param sampleRate - Output sample rate
 * @param crossfadeDuration - Crossfade window duration in seconds
 * @returns Per-band tail samples, start sample index, and total output length
 */
export function synthesizeTail(
  decayParams: DecayParameters[],
  sampleRate: number,
  crossfadeDuration: number,
): { tailSamples: Float32Array[]; tailStartSample: number; totalSamples: number } {
  // Determine max end time across all bands
  let maxEndTime = 0;
  let minCrossfadeTime = Infinity;

  for (const dp of decayParams) {
    if (dp.endTime > maxEndTime) maxEndTime = dp.endTime;
    if (dp.crossfadeTime > 0 && dp.crossfadeTime < minCrossfadeTime) {
      minCrossfadeTime = dp.crossfadeTime;
    }
  }

  if (maxEndTime <= 0 || !isFinite(minCrossfadeTime)) {
    return { tailSamples: decayParams.map(() => new Float32Array(0)), tailStartSample: 0, totalSamples: 0 };
  }

  const tailStartSample = floor(minCrossfadeTime * sampleRate);
  const totalSamples = floor(maxEndTime * sampleRate);
  const tailLength = totalSamples - tailStartSample;

  if (tailLength <= 0) {
    return { tailSamples: decayParams.map(() => new Float32Array(0)), tailStartSample, totalSamples };
  }

  const tailSamples: Float32Array[] = [];

  for (const dp of decayParams) {
    const tail = new Float32Array(tailLength);

    if (dp.decayRate >= 0 || dp.crossfadeLevel <= 0) {
      tailSamples.push(tail);
      continue;
    }

    // Target RMS amplitude at the start of the tail = sqrt(crossfadeLevel)
    // (crossfadeLevel is in energy/power domain, amplitude = sqrt(energy))
    const targetRmsAmplitude = sqrt(dp.crossfadeLevel);

    // White noise RMS for uniform [-1,1] is 1/sqrt(3)
    const noiseRms = 1 / sqrt(3);
    const scaleFactor = targetRmsAmplitude / noiseRms;

    for (let n = 0; n < tailLength; n++) {
      const t = n / sampleRate; // time relative to tail start
      // Exponential decay envelope: 10^(decayRate * t / 20)
      const envelope = pow(10, dp.decayRate * t / 20);
      const noise = random() * 2 - 1;
      tail[n] = noise * envelope * scaleFactor;
    }

    tailSamples.push(tail);
  }

  return { tailSamples, tailStartSample, totalSamples };
}

/**
 * Assemble the final impulse response by crossfading between ray-traced samples
 * and the synthesized tail.
 *
 * @param rayTracedSamples - Per-band ray-traced impulse response samples
 * @param tailSamples - Per-band synthesized tail samples
 * @param crossfadeStartSample - Sample index where crossfade begins
 * @param crossfadeDurationSamples - Number of samples in the crossfade window
 * @returns Extended per-band impulse response samples
 */
export function assembleFinalIR(
  rayTracedSamples: Float32Array[],
  tailSamples: Float32Array[],
  crossfadeStartSample: number,
  crossfadeDurationSamples: number,
): Float32Array[] {
  const numBands = rayTracedSamples.length;
  const result: Float32Array[] = [];

  for (let f = 0; f < numBands; f++) {
    const traced = rayTracedSamples[f];
    const tail = tailSamples[f];

    if (!tail || tail.length === 0) {
      result.push(traced);
      continue;
    }

    const outputLength = max(traced.length, crossfadeStartSample + tail.length);
    const output = new Float32Array(outputLength);

    // Copy ray-traced samples up to end of crossfade
    const crossfadeEnd = min(crossfadeStartSample + crossfadeDurationSamples, outputLength);

    // Copy everything before crossfade region
    for (let n = 0; n < min(crossfadeStartSample, traced.length); n++) {
      output[n] = traced[n];
    }

    // Crossfade region: Hann fade-out on traced, Hann fade-in on tail
    const N = crossfadeDurationSamples;
    for (let n = 0; n < N; n++) {
      const sampleIdx = crossfadeStartSample + n;
      if (sampleIdx >= outputLength) break;

      const fadeOut = 0.5 * (1 + cos(PI * n / N));
      const fadeIn = 0.5 * (1 - cos(PI * n / N));

      const tracedVal = sampleIdx < traced.length ? traced[sampleIdx] : 0;
      const tailVal = n < tail.length ? tail[n] : 0;

      output[sampleIdx] = tracedVal * fadeOut + tailVal * fadeIn;
    }

    // After crossfade: only tail samples
    for (let n = N; n < tail.length; n++) {
      const sampleIdx = crossfadeStartSample + n;
      if (sampleIdx >= outputLength) break;
      output[sampleIdx] = tail[n];
    }

    result.push(output);
  }

  return result;
}
