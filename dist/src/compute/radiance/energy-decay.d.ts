/**
 * ART native output is a broadband energy envelope sampled at the
 * energy-bin rate (default 1 kHz). That is not a pressure IR: do not
 * peak-normalize it or advertise the bin rate as an audio sample rate.
 */
export declare function downsampleEnergyEnvelope(samples: ArrayLike<number>, binRate: number, maxPoints?: number): {
    time: number;
    amplitude: number;
}[];
export declare function peakAmplitude(samples: ArrayLike<number>): number;
