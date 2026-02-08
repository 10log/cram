/**
 * Ambisonic-to-binaural decoder using pre-computed HRTF decoder filters.
 *
 * Uses OfflineAudioContext with ConvolverNodes for efficient FFT-based
 * convolution, leveraging the browser's optimized Web Audio implementation.
 */

import { HRTFDecoderFilters } from "./hrtf-data";

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
export async function decodeBinaural(
  ambisonicIR: AudioBuffer,
  filters: HRTFDecoderFilters
): Promise<BinauralResult> {
  const sampleRate = ambisonicIR.sampleRate;
  if (sampleRate !== filters.sampleRate) {
    throw new Error(
      `Sample rate mismatch: ambisonic IR is ${sampleRate} Hz but HRTF filters are ${filters.sampleRate} Hz`
    );
  }

  const nCh = Math.min(ambisonicIR.numberOfChannels, filters.channelCount);
  if (nCh === 0) {
    throw new Error("No channels to decode");
  }

  // Output length = input length + filter length - 1 (linear convolution)
  const outputLength = ambisonicIR.length + filters.filterLength - 1;

  // Create offline context: 2 output channels (stereo), full convolution length
  const offlineCtx = new OfflineAudioContext(2, outputLength, sampleRate);

  for (let ch = 0; ch < nCh; ch++) {
    // Create mono source for this ambisonic channel
    const sourceBuffer = offlineCtx.createBuffer(1, ambisonicIR.length, sampleRate);
    sourceBuffer.copyToChannel(ambisonicIR.getChannelData(ch), 0);

    const sourceNode = offlineCtx.createBufferSource();
    sourceNode.buffer = sourceBuffer;

    // Create stereo convolution filter [left, right]
    const filterBuffer = offlineCtx.createBuffer(2, filters.filterLength, sampleRate);
    filterBuffer.copyToChannel(new Float32Array(filters.filtersLeft[ch]), 0);
    filterBuffer.copyToChannel(new Float32Array(filters.filtersRight[ch]), 1);

    const convolver = offlineCtx.createConvolver();
    convolver.normalize = false;
    convolver.buffer = filterBuffer;

    // Connect: source -> convolver -> destination
    sourceNode.connect(convolver);
    convolver.connect(offlineCtx.destination);

    sourceNode.start(0);
  }

  const renderedBuffer = await offlineCtx.startRendering();

  return {
    buffer: renderedBuffer,
    sampleRate,
  };
}

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
export function rotateAmbisonicIR(
  ambisonicIR: AudioBuffer,
  yawDeg: number,
  pitchDeg: number,
  rollDeg: number
): AudioBuffer {
  if (yawDeg === 0 && pitchDeg === 0 && rollDeg === 0) {
    return ambisonicIR;
  }

  const nCh = ambisonicIR.numberOfChannels;
  const length = ambisonicIR.length;
  const sampleRate = ambisonicIR.sampleRate;

  // Only FOA rotation currently supported
  if (nCh < 4) {
    throw new Error("Ambisonic rotation requires at least 4 channels (first order)");
  }

  const yaw = yawDeg * Math.PI / 180;
  const pitch = pitchDeg * Math.PI / 180;
  const roll = rollDeg * Math.PI / 180;

  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const cr = Math.cos(roll), sr = Math.sin(roll);

  // Combined rotation matrix (yaw * pitch * roll) for the [Y, Z, X] channels
  // ACN order: Y=ch1, Z=ch2, X=ch3
  // In Three.js/CRAM coordinate system: X=right, Y=up, Z=front
  // ACN mapping: X->ch3 (front), Y->ch1 (left), Z->ch2 (up)
  //
  // Rotation matrix R = Ry(yaw) * Rx(pitch) * Rz(roll)
  // Applied to [Y, Z, X] vector per sample
  const r00 = cy * cr + sy * sp * sr;
  const r01 = -cy * sr + sy * sp * cr;
  const r02 = sy * cp;
  const r10 = cp * sr;
  const r11 = cp * cr;
  const r12 = -sp;
  const r20 = -sy * cr + cy * sp * sr;
  const r21 = sy * sr + cy * sp * cr;
  const r22 = cy * cp;

  // Create output buffer
  const ctx = new OfflineAudioContext(nCh, length, sampleRate);
  const outputBuffer = ctx.createBuffer(nCh, length, sampleRate);

  // Copy W channel unchanged
  outputBuffer.copyToChannel(ambisonicIR.getChannelData(0), 0);

  // Get input channels
  const inY = ambisonicIR.getChannelData(1);
  const inZ = ambisonicIR.getChannelData(2);
  const inX = ambisonicIR.getChannelData(3);

  // Rotate
  const outY = new Float32Array(length);
  const outZ = new Float32Array(length);
  const outX = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const y = inY[i], z = inZ[i], x = inX[i];
    outY[i] = r00 * y + r01 * z + r02 * x;
    outZ[i] = r10 * y + r11 * z + r12 * x;
    outX[i] = r20 * y + r21 * z + r22 * x;
  }

  outputBuffer.copyToChannel(outY, 1);
  outputBuffer.copyToChannel(outZ, 2);
  outputBuffer.copyToChannel(outX, 3);

  // Copy any higher-order channels unchanged (HOA rotation not yet implemented)
  for (let ch = 4; ch < nCh; ch++) {
    outputBuffer.copyToChannel(ambisonicIR.getChannelData(ch), ch);
  }

  return outputBuffer;
}
