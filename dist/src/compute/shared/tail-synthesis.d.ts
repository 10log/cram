import { DecayParameters } from './tail-synthesis-types';
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
export declare function extractDecayParameters(energyHistogram: Float32Array[], frequencies: number[], crossfadeTime: number, binWidth: number): DecayParameters[];
/**
 * Synthesize a noise-based reverberation tail matching the decay characteristics.
 *
 * @param decayParams - Per-band decay parameters
 * @param sampleRate - Output sample rate
 * @returns Per-band tail samples, start sample index, and total output length
 */
export declare function synthesizeTail(decayParams: DecayParameters[], sampleRate: number): {
    tailSamples: Float32Array[];
    tailStartSample: number;
    totalSamples: number;
};
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
export declare function assembleFinalIR(rayTracedSamples: Float32Array[], tailSamples: Float32Array[], crossfadeStartSample: number, crossfadeDurationSamples: number): Float32Array[];
