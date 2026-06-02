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
export declare function schroederBackwardsIntegration(data: Float32Array): Float32Array;
