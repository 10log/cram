/**
 * Types and constants for late reverberation tail synthesis.
 * Shared between RayTracer and BeamTraceSolver.
 */
export interface DecayParameters {
    /** Per-band T60 in seconds */
    t60: number;
    /** Decay rate in dB/s (negative) */
    decayRate: number;
    /** Linear energy level at crossfade point */
    crossfadeLevel: number;
    /** Crossfade start time in seconds */
    crossfadeTime: number;
    /** Time where tail reaches silence in seconds */
    endTime: number;
}
/** Minimum decay rate in dB/s to prevent infinite tails */
export declare const MIN_TAIL_DECAY_RATE = 1;
/** Hard cap on IR length in seconds */
export declare const MAX_TAIL_END_TIME = 10;
/** Duration of the Hann crossfade window between ray-traced IR and synthesized tail (seconds) */
export declare const DEFAULT_TAIL_CROSSFADE_DURATION = 0.05;
/** Histogram bin width in seconds (1 ms) */
export declare const HISTOGRAM_BIN_WIDTH = 0.001;
/** Number of histogram bins (covers up to 10 seconds) */
export declare const HISTOGRAM_NUM_BINS = 10000;
