import { KVP } from '../../common/key-value-pair';
import { RayPath } from './types';
/**
 * Download per-octave impulse responses as individual WAV files.
 * (Raytracer-specific: uses RayPath structure)
 */
export declare function downloadImpulses(paths: KVP<RayPath[]>, receiverIDs: string[], sourceIDs: string[], arrivalPressureFn: (spls: number[], freqs: number[], path: RayPath, receiverGain: number) => number[], filename: string, initialSPL?: number, frequencies?: number[], sampleRate?: number): void;
export declare function playImpulseResponse(impulseResponse: AudioBuffer | undefined, calculateImpulseResponse: () => Promise<AudioBuffer>, uuid: string): Promise<{
    impulseResponse: AudioBuffer;
}>;
export declare function downloadImpulseResponse(impulseResponse: AudioBuffer | undefined, calculateImpulseResponse: () => Promise<AudioBuffer>, filename: string, sampleRate?: number): Promise<{
    impulseResponse: AudioBuffer;
}>;
export declare function downloadAmbisonicImpulseResponse(ambisonicImpulseResponse: AudioBuffer | undefined, calculateAmbisonicImpulseResponse: (order: number) => Promise<AudioBuffer>, ambisonicOrder: number, order: number | undefined, filename: string): Promise<{
    ambisonicImpulseResponse: AudioBuffer;
    ambisonicOrder: number;
}>;
export declare function playBinauralImpulseResponse(binauralImpulseResponse: AudioBuffer | undefined, calculateBinauralImpulseResponse: () => Promise<AudioBuffer>, uuid: string): Promise<{
    binauralImpulseResponse: AudioBuffer;
}>;
export declare function downloadBinauralImpulseResponse(binauralImpulseResponse: AudioBuffer | undefined, calculateBinauralImpulseResponse: () => Promise<AudioBuffer>, filename: string): Promise<{
    binauralImpulseResponse: AudioBuffer;
}>;
