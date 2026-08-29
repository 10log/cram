import { RayPath } from './types';
export interface TailOptions {
    energyHistogram: Float32Array[];
    crossfadeTime: number;
    crossfadeDuration: number;
    histogramBinWidth: number;
    frequencies: number[];
}
export declare function arrivalPressure(initialSPL: number[], freqs: number[], path: RayPath, receiverGain?: number, temperature?: number): number[];
export declare function calculateImpulseResponseForPair(sourceId: string, receiverId: string, paths: RayPath[], initialSPL: number | undefined, frequencies: number[], temperature: number, sampleRate?: number, tailOptions?: TailOptions, numRays?: number): Promise<{
    signal: Float32Array;
    normalizedSignal: Float32Array;
}>;
export declare function calculateImpulseResponseForDisplay(receiverIDs: string[], sourceIDs: string[], paths: Record<string, RayPath[]>, initialSPL: number | undefined, frequencies: number[], temperature: number, sampleRate?: number, tailOptions?: TailOptions, receiverId?: string): Promise<{
    signal: Float32Array;
    normalizedSignal: Float32Array;
}>;
