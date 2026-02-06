/**
 * Trim leading and trailing silence from an impulse response.
 *
 * Samples with absolute value below `tolerance` are considered silence.
 * The trimmed result includes one silent sample before the onset
 * (due to how startSample is tracked).
 */
export function trimIR(ir: Float32Array): Float32Array {
  const tolerance = 1e-6;
  let startSample = 0;
  let endSample = ir.length;

  let sindex = 0;
  while (sindex < ir.length && Math.abs(ir[sindex]) < tolerance) {
    startSample = sindex;
    sindex++;
  }

  sindex = ir.length - 1;
  while (sindex >= 0 && Math.abs(ir[sindex]) < tolerance) {
    endSample = sindex;
    sindex--;
  }

  return ir.slice(startSample, endSample);
}
