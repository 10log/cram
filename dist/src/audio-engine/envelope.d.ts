export declare function max_width_factor(r: [number, number], step: number): number;
export declare function width_factor(r: [number, number], bands: number, overlap: number): number;
export declare function band_edge_impl(p: number, P: number, l: number): number;
export declare function lower_band_edge(p: number, P: number, l: number): number;
export declare function upper_band_edge(p: number, P: number, l: number): number;
export declare function band_edge_frequency(band: number, bands: number, r: [number, number]): number;
export declare function band_centre_frequency(band: number, bands: number, r: [number, number]): number;
export declare function compute_bandpass_magnitude(frequency: number, r: [number, number], width_factor: number, l: number): number;
export declare function compute_lopass_magnitude(frequency: number, edge: number, width_factor: number, l: number): number;
export declare function compute_hipass_magnitude(frequency: number, edge: number, width_factor: number, l: number): number;
/**
 * Perfect reconstruction filter for banded signals
 * @param samples banded signals
 * @returns
 */
export declare function filterSignals(samples: Float32Array[]): any[];
