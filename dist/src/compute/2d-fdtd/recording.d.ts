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
/**
 * Low cut of the recording's integrator, in Hz (#224). Below the lowest
 * room mode of anything a 2D FDTD grid holds, and PFFDTD's usual choice.
 */
export declare const RECORDING_HIGHPASS_HZ = 10;
/**
 * Integrate a receiver's recording back out of the differentiated source,
 * and remove DC, in one filter (#224, after PFFDTD's `process_outputs`).
 *
 * The source forces the field with the per-sample difference of its signal,
 * so a receiver hears the response to that difference. A running sum undoes
 * it exactly. On its own, though, a sum would integrate any DC or sub-audio
 * drift into a ramp. So this is a second-order Butterworth high-pass at
 * `cutoff` (bilinear, pre-warped), whose numerator is `(1 − z⁻¹)²`, with one
 * of those two differences cancelled against the sum:
 *
 * ```
 * H(z) = g·(1 − z⁻¹) / (1 + d₁z⁻¹ + d₂z⁻²)  =  HPF(z) / (1 − z⁻¹)
 * ```
 *
 * Above the cutoff that is the exact inverse of the source's difference: no
 * droop and no delay, where a trapezoidal integrator would lose
 * `cos(πf/fs)`. Below it, it rolls off like a first-order high-pass, and DC
 * decays to nothing. (PFFDTD removes the zero from the analog prototype
 * instead; that is the trapezoidal version.)
 */
export declare function integrateAndHighpass(samples: readonly number[], sampleRate: number, cutoff?: number): number[];
