/**
 * Shared ambisonic-to-binaural calculation pipeline.
 *
 * Rotates an ambisonic impulse response by head orientation,
 * loads HRTF decoder filters, and decodes to binaural stereo.
 */

import { rotateAmbisonicIR, decodeBinaural } from "./binaural-decoder";
import { loadDecoderFilters } from "./hrtf-data";

export interface BinauralCalculationParams {
  ambisonicImpulseResponse: AudioBuffer;
  order: number;
  hrtfSubjectId: string;
  headYaw: number;
  headPitch: number;
  headRoll: number;
}

/**
 * Decode an ambisonic impulse response to binaural stereo.
 *
 * 1. Rotate ambisonic IR by head orientation (if non-zero)
 * 2. Load HRTF decoder filters for the selected subject/order
 * 3. Decode to binaural stereo via convolution
 */
export async function calculateBinauralFromAmbisonic(
  params: BinauralCalculationParams
): Promise<AudioBuffer> {
  const { ambisonicImpulseResponse, order, hrtfSubjectId, headYaw, headPitch, headRoll } = params;

  // Apply head rotation if non-zero
  let ambiIR = ambisonicImpulseResponse;
  if (headYaw !== 0 || headPitch !== 0 || headRoll !== 0) {
    ambiIR = rotateAmbisonicIR(ambiIR, headYaw, headPitch, headRoll);
  }

  // Load HRTF decoder filters
  const filters = await loadDecoderFilters(hrtfSubjectId, order);

  // Decode to binaural stereo
  const result = await decodeBinaural(ambiIR, filters);
  return result.buffer;
}
