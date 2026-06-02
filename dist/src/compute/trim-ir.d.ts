/**
 * Trim leading and trailing silence from an impulse response.
 *
 * Samples with absolute value below `tolerance` are considered silence.
 * The trimmed result includes one silent sample before the onset
 * (due to how startSample is tracked).
 */
export declare function trimIR(ir: Float32Array): Float32Array;
