/**
 * Decouple FDTD display frames from recorded sample rate (#112).
 *
 * Display: `numPasses` GPU steps per rAF (slow-motion is fine).
 * Record: steps ≈ wallDt / dt so 1 s of Record ≈ 1 s of sim at 1/dt Hz.
 */
export declare const MAX_RECORD_PASSES = 2048;
export declare function sampleRateFromDt(dt: number): number;
export declare function passesForElapsed(opts: {
    wallDt: number;
    dt: number;
    displayPasses: number;
    recording: boolean;
    cap?: number;
}): number;
export declare function formatSampleText(samples: number[], sampleRate?: number): string;
/** 16-bit PCM WAV. `samples` are nominally in [-1, 1]. */
export declare function encodeWavPcm16(samples: number[], sampleRate: number): ArrayBuffer;
/** Zero-crossings of a near-sinusoid ≈ 2 × cycles. */
export declare function countZeroCrossings(samples: number[]): number;
