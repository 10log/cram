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

function sum(data: Float32Array): number {
  return data.reduce((acc, v) => acc + v, 0);
}

function cumsum(data: Float32Array): Float32Array {
  const cumulativeSum = ((s: number) => (value: number) => s += value)(0);
  return data.map(cumulativeSum);
}

export function schroederBackwardsIntegration(data: Float32Array): Float32Array {
  const data_reversed = new Float32Array(data).reverse();
  const data_reversed_sq = data_reversed.map((x) => x ** 2);
  const data_reversed_sq_cumsum = cumsum(data_reversed_sq);

  const data_sq = data.map((x) => x ** 2);
  const data_sq_sum = sum(data_sq);

  const normalized = data_reversed_sq_cumsum.map((x) => x / data_sq_sum);

  return normalized.map((x) => (x !== 0 ? 10 * Math.log10(x) : 0));
}
