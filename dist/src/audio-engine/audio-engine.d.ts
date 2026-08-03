type BiquadFilterType = "bandpass" | "lowpass" | "highpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass";
export type FilteredSource = {
    source: AudioBufferSourceNode;
    lowpass: BiquadFilterNode;
    highpass: BiquadFilterNode;
    gain: GainNode;
};
export declare class AudioEngine {
    context: AudioContext;
    constructor();
    /**
     * Creates an offline audio context for faster rendering
     * @param numberOfChannels number of channels for this context
     * @param length length of the context in samples
     * @param sampleRate sample rate in samples / second
     */
    createOfflineContext(numberOfChannels: number, length: number, sampleRate: number): OfflineAudioContext;
    /**
     * Renders an offline audio context in a more browser agnostic way.
     * neither Safari or Edge like `await context.startRendering()`
     * @param context offline audio context
     * @returns {Promise<AudioBuffer>} the rendered buffer
     */
    renderContextAsync(context: OfflineAudioContext): Promise<AudioBuffer>;
    /**
     * Creates a buffer source node filled with the supplied data
     * @param buffer The buffer of samples in a Float32Array
     * @param context audio context to use
     * @returns the buffer source
     */
    createBufferSource(buffer: Float32Array, context?: AudioContext | OfflineAudioContext): AudioBufferSourceNode;
    /**
     * Creates a bandpass filter node
     * @param freq center frequency
     * @param Q Q-factor (reciprocal of the fractional bandwidth)
     * @param context audio context to use
     * @returns a bandpass filter
     */
    createBandpassFilter(freq: number, Q?: number, context?: AudioContext | OfflineAudioContext): BiquadFilterNode;
    /**
     * Creates a bandpass filter node
     * @param freq center frequency
     * @param Q Q-factor (reciprocal of the fractional bandwidth)
     * @param context audio context to use
     * @returns a bandpass filter
     */
    createBiquadFilter(type: BiquadFilterType, freq: number, Q?: number, gain?: number, context?: AudioContext | OfflineAudioContext): BiquadFilterNode;
    /**
     * Creates a gain node
     * @param value the gain value
     * @param context audio context to use
     * @returns a gain node
     */
    createGainNode(value: number, context?: AudioContext | OfflineAudioContext): GainNode;
    /**
     * Creates a channel merger node
     * @param count number of input channels to merge
     * @param context audio context to use
     * @returns a channel merger node
     */
    createMerger(count: number, context?: AudioContext | OfflineAudioContext): ChannelMergerNode;
    /**
     * Creates a filtered source node
     * @param buffer The buffer of samples in a Float32Array
     * @param freq center frequency
     * @param Q Q-factor (reciprocal of the fractional bandwidth)
     * @param gain the gain value
     * @param context audio context to use
     * @returns a filtered source node
     */
    createFilteredSource(buffer: Float32Array, freq: number, Q?: number, gain?: number, context?: AudioContext | OfflineAudioContext): FilteredSource;
    /**
     * Creates an array of filtered source nodes
     * @param dataBuffers an array of sample buffers
     * @param frequencies an array of frequencies
     * @param context audio context to use
     * @returns an array of filtered source nodes
     */
    createFilteredSources(dataBuffers: Float32Array[], frequencies: number[], context?: AudioContext | OfflineAudioContext): FilteredSource[];
    diracDelta(length?: number, offset?: number): Float32Array<ArrayBuffer>;
    testFilters(frequencies: number[], sampleRate?: number): Promise<void>;
    get sampleRate(): number;
}
export declare const audioEngine: AudioEngine;
export {};
