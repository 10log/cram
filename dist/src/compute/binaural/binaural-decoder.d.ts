import { HRTFDecoderFilters } from './hrtf-data';
export interface BinauralResult {
    buffer: AudioBuffer;
    sampleRate: number;
}
/**
 * Decode an ambisonic impulse response to binaural stereo using
 * pre-computed HRTF decoder filters.
 *
 * For each ambisonic channel i:
 *   - Convolve channel i with stereo filter [filtersLeft[i], filtersRight[i]]
 *   - Sum all convolved outputs to produce final stereo signal
 *
 * Uses OfflineAudioContext which handles summing at the destination automatically.
 */
export declare function decodeBinaural(ambisonicIR: AudioBuffer, filters: HRTFDecoderFilters): Promise<BinauralResult>;
/**
 * Apply head rotation to a first-order ambisonic (FOA) impulse response.
 *
 * Channel layout (ACN): 0=W, 1=Y, 2=Z, 3=X
 * W is omnidirectional and invariant under rotation.
 * Y, Z, X are rotated using a 3x3 rotation matrix.
 *
 * Rotation convention: yaw (around Y-axis), pitch (around X-axis), roll (around Z-axis).
 * Applied in order: yaw -> pitch -> roll (extrinsic).
 */
export declare function rotateAmbisonicIR(ambisonicIR: AudioBuffer, yawDeg: number, pitchDeg: number, rollDeg: number): AudioBuffer;
