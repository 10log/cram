export declare function diracDelta(length?: number, offset?: number): Float32Array<ArrayBuffer>;
export declare const filter: (b: number[], a: number[], x: Float32Array) => Float32Array<ArrayBuffer>;
export declare function compute_bandpass_biquad_coefficients(low: number, high: number, sampleRate: number): {
    b: number[];
    a: number[];
};
export declare const coefs: Map<number, {
    b: number[];
    a: number[];
}>;
