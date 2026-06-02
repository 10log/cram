/**
 * Shared ambisonic-to-binaural calculation pipeline.
 *
 * Rotates an ambisonic impulse response by head orientation,
 * loads HRTF decoder filters, and decodes to binaural stereo.
 */
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
export declare function calculateBinauralFromAmbisonic(params: BinauralCalculationParams): Promise<AudioBuffer>;
