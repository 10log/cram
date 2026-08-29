/**
 * Schroeder backwards integration for energy decay curves.
 *
 * Computes the energy decay curve from an impulse response by
 * reverse-cumulative-summing the squared signal and normalizing
 * by the total energy, then converting to decibels.
 *
 * Reference: Schroeder, M.R. (1965). "New Method of Measuring
 * Reverberation Time." JASA 37(3), 409–412.
 */

export function schroederBackwardsIntegration(data: Float32Array): Float32Array {
  const n = data.length;
  const e = new Float32Array(n);
  let acc = 0;
  for (let i = n - 1; i >= 0; i--) {
    acc += data[i] * data[i];
    e[i] = acc;
  }
  const E = e[0] || 1;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = e[i] > 0 ? 10 * Math.log10(e[i] / E) : Number.NEGATIVE_INFINITY;
  }
  return out;
}
