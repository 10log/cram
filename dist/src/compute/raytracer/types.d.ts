import { KVP } from '../../common/key-value-pair';
import { PlotData } from 'plotly.js';
/** Offset along normal to avoid self-intersection when continuing a ray */
export declare const SELF_INTERSECTION_OFFSET = 0.01;
export { DEFAULT_INTENSITY_SAMPLE_RATE } from '../shared/response-by-intensity-types';
/** Default initial SPL (dB) for impulse response calculations */
export declare const DEFAULT_INITIAL_SPL = 100;
/** Extra time (seconds) appended to impulse response duration */
export declare const RESPONSE_TIME_PADDING = 0.05;
export { QUICK_ESTIMATE_MAX_ORDER } from '../shared/quick-estimate-types';
/** Maximum number of display points for downsampled IR charts */
export declare const MAX_DISPLAY_POINTS = 2000;
export { RT60_DECAY_RATIO } from '../shared/quick-estimate-types';
export { HISTOGRAM_BIN_WIDTH, HISTOGRAM_NUM_BINS } from '../shared/tail-synthesis-types';
/** Interval in milliseconds between convergence checks */
export declare const CONVERGENCE_CHECK_INTERVAL_MS = 500;
export { DEFAULT_TAIL_CROSSFADE_DURATION, MIN_TAIL_DECAY_RATE, MAX_TAIL_END_TIME } from '../shared/tail-synthesis-types';
export type { DecayParameters } from '../shared/tail-synthesis-types';
export type { QuickEstimateStepResult } from '../shared/quick-estimate-types';
export type { RayPathResult, ResponseByIntensity } from '../shared/response-by-intensity-types';
export type BandEnergy = number[];
export interface Chain {
    angle_in?: number;
    angle_out?: number;
    total_time?: number;
    time_rec?: number;
    angle_rec?: number;
    distance: number;
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
    energy: number;
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
export declare class ReceiverData {
    constructor(id: string);
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
    convergenceThreshold?: number;
    autoStop?: boolean;
    rrThreshold?: number;
    maxStoredPaths?: number;
    edgeDiffractionEnabled?: boolean;
    lateReverbTailEnabled?: boolean;
    tailCrossfadeTime?: number;
    tailCrossfadeDuration?: number;
    gpuEnabled?: boolean;
    gpuBatchSize?: number;
    hrtfSubjectId?: string;
    headYaw?: number;
    headPitch?: number;
    headRoll?: number;
};
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
    convergenceThreshold?: number;
    autoStop?: boolean;
    rrThreshold?: number;
    maxStoredPaths?: number;
    edgeDiffractionEnabled?: boolean;
    lateReverbTailEnabled?: boolean;
    tailCrossfadeTime?: number;
    tailCrossfadeDuration?: number;
    gpuEnabled?: boolean;
    gpuBatchSize?: number;
    hrtfSubjectId?: string;
    headYaw?: number;
    headPitch?: number;
    headRoll?: number;
}
export interface ConvergenceMetrics {
    totalRays: number;
    validRays: number;
    estimatedT30: number[];
    t30Mean: number[];
    t30M2: number[];
    t30Count: number;
    convergenceRatio: number;
}
export declare const defaults: {
    name: string;
    roomID: string;
    sourceIDs: string[];
    surfaceIDs: string[];
    receiverIDs: string[];
    updateInterval: number;
    reflectionOrder: number;
    isRunning: boolean;
    runningWithoutReceivers: boolean;
    passes: number;
    pointSize: number;
    raysVisible: boolean;
    pointsVisible: boolean;
    invertedDrawStyle: boolean;
    paths: KVP<RayPath[]>;
    plotStyle: Partial<PlotData>;
    frequencies: number[];
    convergenceThreshold: number;
    autoStop: boolean;
    rrThreshold: number;
    maxStoredPaths: number;
    edgeDiffractionEnabled: boolean;
    lateReverbTailEnabled: boolean;
    tailCrossfadeTime: number;
    tailCrossfadeDuration: number;
    gpuEnabled: boolean;
    gpuBatchSize: number;
};
export declare enum DRAWSTYLE {
    ENERGY = 0,
    ANGLE = 1,
    ANGLE_ENERGY = 2
}
export interface DrawStyle {
    ENERGY: 0.0;
    ANGLE: 1.0;
    ANGLE_ENERGY: 2.0;
}
export declare function normalize(arr: Float32Array): Float32Array<ArrayBufferLike>;
