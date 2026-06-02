import { default as Solver } from '../solver';
import { default as Room } from '../../objects/room';
import { KVP } from '../../common/key-value-pair';
import { default as Container } from '../../objects/container';
import { default as Source } from '../../objects/source';
import { default as Receiver } from '../../objects/receiver';
import { Stat } from '../../components/parameter-config/Stats';
import { default as Plotly, PlotData } from 'plotly.js';
import { BVH } from './bvh/BVH';
import { Observable } from '../../common/observable';
import { QuickEstimateStepResult, ResponseByIntensity, BandEnergy, Chain, RayPath, ChartData, ReceiverData, RayTracerParams, ConvergenceMetrics } from './types';
import { EdgeGraph } from './diffraction';
import * as THREE from "three";
export type { QuickEstimateStepResult, RayPathResult, ResponseByIntensity, BandEnergy, Chain, RayPath, EnergyTime, ChartData, RayTracerSaveObject, RayTracerParams, ConvergenceMetrics, DrawStyle, DecayParameters, } from './types';
export { ReceiverData, defaults, DRAWSTYLE, normalize, SELF_INTERSECTION_OFFSET, DEFAULT_INTENSITY_SAMPLE_RATE, DEFAULT_INITIAL_SPL, RESPONSE_TIME_PADDING, QUICK_ESTIMATE_MAX_ORDER, MAX_DISPLAY_POINTS, RT60_DECAY_RATIO, HISTOGRAM_BIN_WIDTH, HISTOGRAM_NUM_BINS, CONVERGENCE_CHECK_INTERVAL_MS, DEFAULT_TAIL_CROSSFADE_DURATION, MIN_TAIL_DECAY_RATE, MAX_TAIL_END_TIME, } from './types';
declare class RayTracer extends Solver {
    roomID: string;
    sourceIDs: string[];
    surfaceIDs: string[];
    receiverIDs: string[];
    updateInterval: number;
    reflectionOrder: number;
    raycaster: THREE.Raycaster;
    intersections: THREE.Intersection[];
    _isRunning: boolean;
    intervals: number[];
    rayBufferGeometry: THREE.BufferGeometry;
    rayBufferAttribute: THREE.Float32BufferAttribute;
    colorBufferAttribute: THREE.Float32BufferAttribute;
    rays: THREE.LineSegments;
    rayPositionIndex: number;
    maxrays: number;
    intersectableObjects: Array<THREE.Mesh | THREE.Object3D | Container>;
    paths: KVP<RayPath[]>;
    stats: KVP<Stat>;
    messageHandlerIDs: string[][];
    statsUpdatePeriod: number;
    lastTime: number;
    _runningWithoutReceivers: boolean;
    frequencies: number[];
    allReceiverData: ReceiverData[];
    hits: THREE.Points;
    _pointSize: number;
    chartdata: ChartData[];
    passes: number;
    _raysVisible: boolean;
    _pointsVisible: boolean;
    _invertedDrawStyle: boolean;
    __start_time: number;
    __calc_time: number;
    __num_checked_paths: number;
    responseOverlayElement: HTMLElement;
    quickEstimateResults: KVP<QuickEstimateStepResult[]>;
    responseByIntensity: KVP<KVP<ResponseByIntensity>>;
    plotData: Plotly.Data[];
    intensitySampleRate: number;
    validRayCount: number;
    plotStyle: Partial<PlotData>;
    bvh: BVH;
    observed_name: Observable<string>;
    _cachedAirAtt: number[];
    hybrid: boolean;
    transitionOrder: number;
    convergenceThreshold: number;
    autoStop: boolean;
    rrThreshold: number;
    convergenceMetrics: ConvergenceMetrics;
    _energyHistogram: KVP<Float32Array[]>;
    _histogramBinWidth: number;
    _histogramNumBins: number;
    _lastConvergenceCheck: number;
    _convergenceCheckInterval: number;
    _directivityRefPressures?: Map<string, number[]>;
    maxStoredPaths: number;
    edgeDiffractionEnabled: boolean;
    lateReverbTailEnabled: boolean;
    tailCrossfadeTime: number;
    tailCrossfadeDuration: number;
    _edgeGraph: EdgeGraph | null;
    gpuEnabled: boolean;
    gpuBatchSize: number;
    private _gpuRayTracer;
    private _gpuRunning;
    private _rafId;
    hrtfSubjectId: string;
    headYaw: number;
    headPitch: number;
    headRoll: number;
    binauralImpulseResponse?: AudioBuffer;
    binauralPlaying: boolean;
    constructor(params?: RayTracerParams);
    update: () => void;
    get temperature(): number;
    get c(): number;
    save(): {
        name: string;
        kind: string;
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
        plotStyle: Partial<Plotly.PlotData>;
        paths: KVP<RayPath[]>;
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
        hrtfSubjectId: string;
        headYaw: number;
        headPitch: number;
        headRoll: number;
    };
    removeMessageHandlers(): void;
    dispose(): void;
    addSource(source: Source): void;
    addReceiver(rec: Receiver): void;
    mapIntersectableObjects(): void;
    findIDs(): void;
    setDrawStyle(drawStyle: number): void;
    setPointScale(scale: number): void;
    incrementRayPositionIndex(): number;
    rayPositionIndexDidOverflow: boolean;
    appendRay(p1: [number, number, number], p2: [number, number, number], energy?: number, angle?: number): void;
    flushRayBuffer(): void;
    inFrontOf(a: THREE.Triangle, b: THREE.Triangle): boolean;
    traceRay(ro: THREE.Vector3, rd: THREE.Vector3, order: number, bandEnergy: BandEnergy, source: string, initialPhi: number, initialTheta: number, iter?: number, chain?: Partial<Chain>[]): RayPath | undefined;
    startQuickEstimate(frequencies?: number[], numRays?: number): void;
    quickEstimateStep(source: Source, frequencies: number[], numRays: number): QuickEstimateStepResult;
    startAllMonteCarlo(): void;
    stepStratified(numRays: number): void;
    /** Common path handling for both step() and stepStratified() */
    _handleTracedPath(path: RayPath, position: THREE.Vector3, sourceId: string): void;
    /** Push a path onto the paths array, evicting oldest if over maxStoredPaths */
    _pushPathWithEviction(index: string, path: RayPath): void;
    /** Add a ray path's energy to the convergence histogram */
    _addToEnergyHistogram(receiverId: string, path: RayPath): void;
    step(): void;
    /** Reset convergence state for a new simulation run */
    _resetConvergenceState(): void;
    /** Compute T30 from Schroeder backward integration of the energy histogram */
    _updateConvergenceMetrics(): void;
    start(): void;
    stop(): void;
    /** Compute deterministic diffraction paths and inject them into this.paths[] */
    _computeDiffractionPaths(): void;
    reportImpulseResponse(): Promise<void>;
    calculateImpulseResponseForPair(sourceId: string, receiverId: string, paths: RayPath[], initialSPL?: number, frequencies?: number[], sampleRate?: number): Promise<{
        signal: Float32Array;
        normalizedSignal: Float32Array;
    }>;
    calculateImpulseResponseForDisplay(initialSPL?: number, frequencies?: number[], sampleRate?: number): Promise<{
        signal: Float32Array;
        normalizedSignal: Float32Array;
    }>;
    clearRays(): void;
    clearImpulseResponseResults(): void;
    reflectionLossFunction(room: Room, raypath: RayPath, frequency: number): number;
    calculateReflectionLoss(frequencies?: number[]): (ReceiverData[] | ChartData[])[];
    getReceiverIntersectionPoints(id: string): THREE.Vector3[];
    calculateResponseByIntensity(freqs?: number[], temperature?: number): KVP<KVP<ResponseByIntensity>>;
    resampleResponseByIntensity(sampleRate?: number): KVP<KVP<ResponseByIntensity>> | undefined;
    calculateT30(receiverId?: string, sourceId?: string): KVP<KVP<ResponseByIntensity>>;
    calculateT20(receiverId?: string, sourceId?: string): KVP<KVP<ResponseByIntensity>>;
    calculateT60(receiverId?: string, sourceId?: string): KVP<KVP<ResponseByIntensity>>;
    onParameterConfigFocus(): void;
    onParameterConfigBlur(): void;
    pathsToLinearBuffer(): Float32Array<ArrayBufferLike>;
    linearBufferToPaths(linearBuffer: Float32Array): KVP<RayPath[]>;
    arrivalPressure(initialSPL: number[], freqs: number[], path: RayPath, receiverGain?: number): number[];
    calculateImpulseResponse(initialSPL?: number, frequencies?: number[], sampleRate?: number): Promise<AudioBuffer>;
    /**
     * Calculate an ambisonic impulse response from the traced ray paths.
     * Each reflection is encoded based on its arrival direction at the receiver.
     *
     * @param order - Ambisonic order (1 = first order with 4 channels, 2 = 9 channels, etc.)
     * @param initialSPL - Initial sound pressure level in dB
     * @param frequencies - Octave band center frequencies for filtering
     * @param sampleRate - Sample rate for the output
     * @returns Promise resolving to an AudioBuffer with ambisonic channels
     */
    calculateAmbisonicImpulseResponse(order?: number, initialSPL?: number, frequencies?: number[], sampleRate?: number): Promise<AudioBuffer>;
    ambisonicImpulseResponse?: AudioBuffer;
    ambisonicOrder: number;
    impulseResponse: AudioBuffer;
    impulseResponsePlaying: boolean;
    playImpulseResponse(): Promise<void>;
    downloadImpulses(filename: string, initialSPL?: number, frequencies?: number[], sampleRate?: number): void;
    downloadImpulseResponse(filename: string, sampleRate?: number): Promise<void>;
    downloadAmbisonicImpulseResponse(filename: string, order?: number): Promise<void>;
    /**
     * Calculate binaural impulse response from the ambisonic IR using HRTF decoder filters.
     * The ambisonic IR is computed (or cached) first, then optionally rotated by head orientation,
     * and finally decoded to stereo via HRTF convolution.
     */
    calculateBinauralImpulseResponse(order?: number): Promise<AudioBuffer>;
    playBinauralImpulseResponse(order?: number): Promise<void>;
    downloadBinauralImpulseResponse(filename: string, order?: number): Promise<void>;
    /** Initialize GPU ray tracer. Returns true on success. */
    private _initGpu;
    /** Start the GPU-accelerated Monte Carlo loop. Falls back to CPU on failure. */
    private _startGpuMonteCarlo;
    /** Destroy GPU ray tracer if initialized. */
    private _disposeGpu;
    get sources(): Container[];
    get receivers(): THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>, THREE.Material<THREE.MaterialEventMap> | THREE.Material<THREE.MaterialEventMap>[], THREE.Object3DEventMap>[];
    get room(): Room;
    get precheck(): boolean;
    get indexedPaths(): KVP<KVP<RayPath[]>>;
    get isRunning(): boolean;
    set isRunning(isRunning: boolean);
    get raysVisible(): boolean;
    set raysVisible(visible: boolean);
    get pointsVisible(): boolean;
    set pointsVisible(visible: boolean);
    get invertedDrawStyle(): boolean;
    set invertedDrawStyle(inverted: boolean);
    get pointSize(): number;
    set pointSize(size: number);
    get runningWithoutReceivers(): boolean;
    set runningWithoutReceivers(runningWithoutReceivers: boolean);
}
export default RayTracer;
declare global {
    interface EventTypes {
        ADD_RAYTRACER: RayTracer | undefined;
        REMOVE_RAYTRACER: string;
        RAYTRACER_CLEAR_RAYS: string;
        RAYTRACER_SET_PROPERTY: SetPropertyPayload<RayTracer>;
        RAYTRACER_PLAY_IR: string;
        RAYTRACER_DOWNLOAD_IR: string;
        RAYTRACER_DOWNLOAD_IR_OCTAVE: string;
        RAYTRACER_DOWNLOAD_AMBISONIC_IR: {
            uuid: string;
            order: number;
        };
        RAYTRACER_PLAY_BINAURAL_IR: {
            uuid: string;
            order: number;
        };
        RAYTRACER_DOWNLOAD_BINAURAL_IR: {
            uuid: string;
            order: number;
        };
        RAYTRACER_CALL_METHOD: CallSolverMethod<RayTracer>;
    }
}
