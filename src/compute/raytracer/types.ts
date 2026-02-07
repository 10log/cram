import * as THREE from "three";
import { KVP } from "../../common/key-value-pair";
import { PlotData } from "plotly.js";
import { LinearRegressionResult } from "../../common/linear-regression";

// ── Named constants replacing magic numbers ──────────────────────────

/** Offset along normal to avoid self-intersection when continuing a ray */
export const SELF_INTERSECTION_OFFSET = 0.01;

/** Default sample rate for intensity-based response (samples per second) */
export const DEFAULT_INTENSITY_SAMPLE_RATE = 256;

/** Default initial SPL (dB) for impulse response calculations */
export const DEFAULT_INITIAL_SPL = 100;

/** Extra time (seconds) appended to impulse response duration */
export const RESPONSE_TIME_PADDING = 0.05;

/** Maximum reflection order for quick estimate calculations */
export const QUICK_ESTIMATE_MAX_ORDER = 1000;

/** Maximum number of display points for downsampled IR charts */
export const MAX_DISPLAY_POINTS = 2000;

/** Intensity ratio corresponding to 60 dB decay (10^6) */
export const RT60_DECAY_RATIO = 1e6;

/** Histogram bin width in seconds (1 ms) */
export const HISTOGRAM_BIN_WIDTH = 0.001;

/** Number of histogram bins (covers up to 10 seconds) */
export const HISTOGRAM_NUM_BINS = 10000;

/** Interval in milliseconds between convergence checks */
export const CONVERGENCE_CHECK_INTERVAL_MS = 500;

/** Duration of the Hann crossfade window between ray-traced IR and synthesized tail (seconds) */
export const DEFAULT_TAIL_CROSSFADE_DURATION = 0.05;

/** Minimum decay rate in dB/s to prevent infinite tails */
export const MIN_TAIL_DECAY_RATE = 1.0;

/** Hard cap on IR length in seconds */
export const MAX_TAIL_END_TIME = 10.0;

// ── Interfaces and types ─────────────────────────────────────────────

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

export interface QuickEstimateStepResult {
  rt60s: number[];
  angle: number;
  direction: THREE.Vector3;
  lastIntersection: THREE.Intersection;
  distance: number;
}

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

export type BandEnergy = number[];

export interface Chain {
  angle_in?: number;
  angle_out?: number;
  total_time?: number;
  time_rec?: number;
  angle_rec?: number;
  distance: number;
  // point: THREE.Vector3;
  point: [number, number, number];
  object: string;
  faceNormal: [number, number, number];
  faceIndex: number;
  faceMaterialIndex: number;
  angle: number;
  energy: number;
  bandEnergy?: BandEnergy;
}


export interface RayPath {
  intersectedReceiver: boolean;
  chain: Chain[];
  chainLength: number;
  energy: number; // used for visualization
  bandEnergy?: BandEnergy;
  time: number;
  source: string;
  initialPhi: number;
  initialTheta: number;
  totalLength: number;
  /** Direction from which the ray arrives at the receiver (normalized, in receiver's local space) */
  arrivalDirection?: [number, number, number];
}
export interface EnergyTime {
  time: number;
  energy: {
    frequency: number;
    value: number;
  }[];
}
// helper type
export type ChartData = {
  label: string;
  data: number[][];
  x?: number[];
  y?: number[];
};

export interface ReceiverData {
  id: string;
  data: EnergyTime[];
}
export class ReceiverData {
  constructor(id: string) {
    this.id = id;
    this.data = [] as EnergyTime[];
  }
}

export type RayTracerSaveObject = {
  name: string;
  kind: "ray-tracer";
  uuid: string;
  autoCalculate: boolean;
  roomID: string;
  sourceIDs: string[];
  surfaceIDs: string[];
  receiverIDs: string[];
  updateInterval: number;
  passes: number;
  pointSize: number;
  reflectionOrder: number;
  runningWithoutReceivers: boolean;
  raysVisible: boolean;
  pointsVisible: boolean;
  invertedDrawStyle: boolean;
  plotStyle: Partial<PlotData>;
  paths: KVP<RayPath[]>;
  frequencies: number[];
  temperature?: number;
  convergenceThreshold?: number;
  autoStop?: boolean;
  rrThreshold?: number;
  maxStoredPaths?: number;
  edgeDiffractionEnabled?: boolean;
  lateReverbTailEnabled?: boolean;
  tailCrossfadeTime?: number;
  tailCrossfadeDuration?: number;
}

export interface RayTracerParams {
  name?: string;
  roomID?: string;
  sourceIDs?: string[];
  surfaceIDs?: string[];
  receiverIDs?: string[];
  updateInterval?: number;
  passes?: number;
  pointSize?: number;
  reflectionOrder?: number;
  isRunning?: boolean;
  runningWithoutReceivers?: boolean;
  raysVisible?: boolean;
  pointsVisible?: boolean;
  invertedDrawStyle?: boolean;
  plotStyle?: Partial<PlotData>;
  uuid?: string;
  paths?: KVP<RayPath[]>;
  frequencies?: number[];
  temperature?: number;
  convergenceThreshold?: number;
  autoStop?: boolean;
  rrThreshold?: number;
  maxStoredPaths?: number;
  edgeDiffractionEnabled?: boolean;
  lateReverbTailEnabled?: boolean;
  tailCrossfadeTime?: number;
  tailCrossfadeDuration?: number;
}
export interface ConvergenceMetrics {
  totalRays: number;
  validRays: number;
  estimatedT30: number[];        // per band, latest estimate
  t30Mean: number[];             // running mean of T30 estimates
  t30M2: number[];               // running M2 for Welford's variance
  t30Count: number;              // number of T30 samples taken
  convergenceRatio: number;      // max(std/mean) across bands
}

export const defaults = {
  name: "Ray Tracer",
  roomID: "",
  sourceIDs: [] as string[],
  surfaceIDs: [] as string[],
  receiverIDs: [] as string[],
  updateInterval: 5,
  reflectionOrder: 50,
  isRunning: false,
  runningWithoutReceivers: false,
  passes: 100,
  pointSize: 2,
  raysVisible: true,
  pointsVisible: true,
  invertedDrawStyle: false,
  paths: {} as KVP<RayPath[]>,
  plotStyle: {
    mode: "lines"
  } as Partial<PlotData>,
  frequencies: [125, 250, 500, 1000, 2000, 4000, 8000] as number[],
  temperature: 20,
  convergenceThreshold: 0.01,
  autoStop: true,
  rrThreshold: 0.1,
  maxStoredPaths: 100000,
  edgeDiffractionEnabled: false,
  lateReverbTailEnabled: false,
  tailCrossfadeTime: 0,
  tailCrossfadeDuration: 0.05,
};

export enum DRAWSTYLE {
  ENERGY = 0.0,
  ANGLE = 1.0,
  ANGLE_ENERGY = 2.0
}
export interface DrawStyle {
  ENERGY: 0.0;
  ANGLE: 1.0;
  ANGLE_ENERGY: 2.0;
}

// ── Helper functions ─────────────────────────────────────────────────

export function normalize(arr: Float32Array) {
  let maxValue = Math.abs(arr[0]);
  for (let i = 1; i < arr.length; i++){
    if (Math.abs(arr[i]) > maxValue) {
      maxValue = Math.abs(arr[i]);
    }
  }
  if (maxValue !== 0) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] /= maxValue;
    }
  }
  return arr;
}
