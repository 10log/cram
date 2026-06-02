/**
 * Play the impulse response through the audio engine.
 *
 * @param impulseResponse - The AudioBuffer to play (or undefined to calculate first)
 * @param calculateImpulseResponse - Async function to calculate the IR if needed
 * @param uuid - The solver UUID for property events
 * @param eventName - The event name for property updates (e.g. "RAYTRACER_SET_PROPERTY")
 */
export declare function playImpulseResponse(impulseResponse: AudioBuffer | undefined, calculateImpulseResponse: () => Promise<AudioBuffer>, uuid: string, eventName: string): Promise<{
    impulseResponse: AudioBuffer;
}>;
/**
 * Download the impulse response as a WAV file.
 *
 * @param impulseResponse - The AudioBuffer (or undefined to calculate first)
 * @param calculateImpulseResponse - Async function to calculate the IR if needed
 * @param filename - Output filename
 * @param sampleRate - Sample rate for the output
 */
export declare function downloadImpulseResponse(impulseResponse: AudioBuffer | undefined, calculateImpulseResponse: () => Promise<AudioBuffer>, filename: string, sampleRate?: number): Promise<{
    impulseResponse: AudioBuffer;
}>;
/**
 * Download the ambisonic impulse response as a multi-channel WAV file.
 * Channels are in ACN order with N3D normalization.
 *
 * @param ambisonicImpulseResponse - The ambisonic AudioBuffer (or undefined to calculate first)
 * @param calculateAmbisonicImpulseResponse - Async function to calculate if needed
 * @param ambisonicOrder - Current cached ambisonic order
 * @param order - Desired ambisonic order (default: 1)
 * @param filename - Output filename (without extension)
 */
export declare function downloadAmbisonicImpulseResponse(ambisonicImpulseResponse: AudioBuffer | undefined, calculateAmbisonicImpulseResponse: (order: number) => Promise<AudioBuffer>, ambisonicOrder: number, order: number | undefined, filename: string): Promise<{
    ambisonicImpulseResponse: AudioBuffer;
    ambisonicOrder: number;
}>;
/**
 * Play the binaural impulse response through the audio engine.
 *
 * @param binauralImpulseResponse - The stereo AudioBuffer to play (or undefined to calculate first)
 * @param calculateBinauralImpulseResponse - Async function to calculate if needed
 * @param uuid - The solver UUID for property events
 * @param eventName - The event name for property updates (e.g. "RAYTRACER_SET_PROPERTY")
 */
export declare function playBinauralImpulseResponse(binauralImpulseResponse: AudioBuffer | undefined, calculateBinauralImpulseResponse: () => Promise<AudioBuffer>, uuid: string, eventName: string): Promise<{
    binauralImpulseResponse: AudioBuffer;
}>;
/**
 * Download the binaural impulse response as a stereo WAV file.
 *
 * @param binauralImpulseResponse - The stereo AudioBuffer (or undefined to calculate first)
 * @param calculateBinauralImpulseResponse - Async function to calculate if needed
 * @param filename - Output filename
 */
export declare function downloadBinauralImpulseResponse(binauralImpulseResponse: AudioBuffer | undefined, calculateBinauralImpulseResponse: () => Promise<AudioBuffer>, filename: string): Promise<{
    binauralImpulseResponse: AudioBuffer;
}>;
