import type { LinearRegressionResult } from "../../common/linear-regression";

/** Default sample rate for intensity-based response (samples per second) */
export const DEFAULT_INTENSITY_SAMPLE_RATE = 256;

export interface RayPathResult {
  time: number;
  bounces: number;
  level: number[];
}

export interface ResponseByIntensity {
  freqs: number[];
  response: RayPathResult[];
  sampleRate?: number;
  resampledResponse?: Float32Array[];
  t20?: LinearRegressionResult[];
  t30?: LinearRegressionResult[];
  t60?: LinearRegressionResult[];
}
