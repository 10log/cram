import { default as Solver } from '../solver';
import { DetailedReflectionPath3D } from 'beam-trace';
import { default as Room } from '../../objects/room';
import { default as Source } from '../../objects/source';
import { default as Receiver } from '../../objects/receiver';
import { ResponseByIntensity } from '../shared/response-by-intensity-types';
import { QuickEstimateStepResult } from '../shared/quick-estimate-types';
import { KVP } from '../../common/key-value-pair';
import * as THREE from "three";
export interface BeamTracePath {
    points: THREE.Vector3[];
    order: number;
    length: number;
    arrivalTime: number;
    polygonIds: (number | null)[];
    /** Direction from which the path arrives at the receiver (normalized) */
    arrivalDirection: THREE.Vector3;
    reflections?: {
        polygonId: number;
        hitPoint: THREE.Vector3;
        incidenceAngle: number;
        surfaceNormal: THREE.Vector3;
        isGrazing: boolean;
    }[];
    /** Pre-computed per-band energy for diffraction paths (bypasses specular reflection calc) */
    bandEnergy?: number[];
}
export type VisualizationMode = "rays" | "beams" | "both";
export interface BeamTraceSaveObject {
    name: string;
    kind: "beam-trace";
    uuid: string;
    autoCalculate: boolean;
    roomID: string;
    sourceIDs: string[];
    receiverIDs: string[];
    maxReflectionOrder: number;
    visualizationMode: VisualizationMode;
    showAllBeams: boolean;
    visibleOrders: number[];
    frequencies: number[];
    levelTimeProgression: string;
    impulseResponseResult: string;
    hrtfSubjectId?: string;
    headYaw?: number;
    headPitch?: number;
    headRoll?: number;
    edgeDiffractionEnabled?: boolean;
    lateReverbTailEnabled?: boolean;
    tailCrossfadeTime?: number;
    tailCrossfadeDuration?: number;
}
export interface BeamTraceSolverParams {
    name?: string;
    uuid?: string;
    roomID?: string;
    sourceIDs?: string[];
    receiverIDs?: string[];
    maxReflectionOrder?: number;
    visualizationMode?: VisualizationMode;
    showAllBeams?: boolean;
    visibleOrders?: number[];
    frequencies?: number[];
    levelTimeProgression?: string;
    impulseResponseResult?: string;
    hrtfSubjectId?: string;
    headYaw?: number;
    headPitch?: number;
    headRoll?: number;
    edgeDiffractionEnabled?: boolean;
    lateReverbTailEnabled?: boolean;
    tailCrossfadeTime?: number;
    tailCrossfadeDuration?: number;
}
export declare class BeamTraceSolver extends Solver {
    roomID: string;
    sourceIDs: string[];
    receiverIDs: string[];
    maxReflectionOrder: number;
    frequencies: number[];
    levelTimeProgression: string;
    impulseResponseResult: string;
    private _visualizationMode;
    private _showAllBeams;
    private _visibleOrders;
    private _plotFrequency;
    private _plotOrders;
    private btSolver;
    private polygons;
    private surfaceToPolygonIndex;
    private polygonToSurface;
    edgeDiffractionEnabled: boolean;
    private _edgeGraph;
    private _raycaster;
    lateReverbTailEnabled: boolean;
    tailCrossfadeTime: number;
    tailCrossfadeDuration: number;
    private _energyHistogram;
    hrtfSubjectId: string;
    headYaw: number;
    headPitch: number;
    headRoll: number;
    binauralImpulseResponse?: AudioBuffer;
    binauralPlaying: boolean;
    validPaths: BeamTracePath[];
    impulseResponse: AudioBuffer;
    impulseResponsePlaying: boolean;
    responseByIntensity: KVP<KVP<ResponseByIntensity>> | undefined;
    quickEstimateResults: QuickEstimateStepResult[];
    estimatedT30: number[] | null;
    private _quickEstimateInterval;
    lastMetrics: {
        validPathCount: number;
        raycastCount: number;
        failPlaneCacheHits: number;
        bucketsSkipped: number;
        bufferUsage?: {
            linesUsed: number;
            linesCapacity: number;
            linesPercent: number;
            pointsUsed: number;
            pointsCapacity: number;
            pointsPercent: number;
            overflowWarning: boolean;
        };
    } | null;
    private virtualSourcesGroup;
    private virtualSourceMap;
    private selectedVirtualSource;
    private clickHandler;
    private hoverHandler;
    private selectedPath;
    private selectedBeamsGroup;
    private _lastSourcePos;
    private _lastRoomID;
    private _lastMaxOrder;
    constructor(params?: BeamTraceSolverParams);
    get temperature(): number;
    get c(): number;
    save(): BeamTraceSaveObject;
    restore(state: BeamTraceSaveObject): this;
    dispose(): void;
    private setupClickHandler;
    private highlightVirtualSourcePath;
    private removeClickHandler;
    private extractPolygons;
    private surfaceToPolygons;
    private needsBeamTreeRebuild;
    buildSolver(): void;
    calculate(): void;
    private convertPath;
    calculateLTP(): void;
    clearLevelTimeProgressionData(): void;
    set plotFrequency(f: number);
    get plotFrequency(): number;
    get plotOrders(): number[];
    set plotOrders(orders: number[]);
    toggleRayPathHighlight(pathUuid: string): void;
    private clearVisualization;
    private drawPaths;
    private drawBeams;
    private beamHasValidPath;
    private clearVirtualSources;
    /**
     * Compute first-order UTD edge diffraction paths and add them to validPaths.
     */
    private _computeDiffractionPaths;
    /**
     * Build per-band energy histograms from all computed paths (for tail synthesis).
     */
    private _buildEnergyHistogram;
    calculateImpulseResponse(): Promise<AudioBuffer>;
    private calculateArrivalPressure;
    private updateImpulseResponseResult;
    playImpulseResponse(): Promise<void>;
    downloadImpulseResponse(filename: string, sampleRate?: number): Promise<void>;
    ambisonicImpulseResponse?: AudioBuffer;
    ambisonicOrder: number;
    /**
     * Calculate an ambisonic impulse response from the beam-traced paths.
     * Each reflection is encoded based on its arrival direction at the receiver.
     *
     * @param order - Ambisonic order (1 = first order with 4 channels, 2 = 9 channels, etc.)
     * @returns Promise resolving to an AudioBuffer with ambisonic channels
     */
    calculateAmbisonicImpulseResponse(order?: number): Promise<AudioBuffer>;
    downloadAmbisonicImpulseResponse(filename: string, order?: number): Promise<void>;
    calculateBinauralImpulseResponse(order?: number): Promise<AudioBuffer>;
    playBinauralImpulseResponse(order?: number): Promise<void>;
    downloadBinauralImpulseResponse(filename: string, order?: number): Promise<void>;
    /**
     * Calculate per-frequency intensity response with T20/T30/T60 decay estimates.
     * Uses existing calculateArrivalPressure() to convert beam-trace paths into
     * the same RayPathResult format the raytracer uses, then delegates to the
     * shared resampleResponseByIntensity() for decay-time fitting.
     */
    calculateResponseByIntensity(): void;
    /**
     * Export per-octave-band impulse responses as individual WAV files.
     * Skips the filter worker — writes one WAV per frequency band directly.
     */
    downloadOctaveBandIR(filename: string, sampleRate?: number): void;
    /**
     * Quick RT60 estimate by shooting random rays through the room geometry.
     * Runs in batches via setInterval to avoid blocking the UI.
     */
    startQuickEstimate(numRays?: number): void;
    reset(): void;
    private clearSelectedBeams;
    get room(): Room | undefined;
    get sources(): Source[];
    get receivers(): Receiver[];
    get numValidPaths(): number;
    set maxReflectionOrderReset(order: number);
    get maxReflectionOrderReset(): number;
    get visualizationMode(): VisualizationMode;
    set visualizationMode(mode: VisualizationMode);
    get showAllBeams(): boolean;
    set showAllBeams(value: boolean);
    get visibleOrders(): number[];
    set visibleOrders(orders: number[]);
    debugBeamPath(polygonPath: number[]): void;
    setBSPDebug(enabled: boolean): void;
    getDetailedPaths(): DetailedReflectionPath3D[];
    highlightPathByIndex(pathIndex: number): void;
    clearPathHighlight(): void;
}
export default BeamTraceSolver;
declare global {
    interface EventTypes {
        ADD_BEAMTRACE: BeamTraceSolver | undefined;
        REMOVE_BEAMTRACE: string;
        BEAMTRACE_SET_PROPERTY: SetPropertyPayload<BeamTraceSolver>;
        BEAMTRACE_CALCULATE: string;
        BEAMTRACE_CALCULATE_COMPLETE: string;
        BEAMTRACE_RESET: string;
        BEAMTRACE_PLAY_IR: string;
        BEAMTRACE_DOWNLOAD_IR: string;
        BEAMTRACE_DOWNLOAD_AMBISONIC_IR: {
            uuid: string;
            order: number;
        };
        BEAMTRACE_PLAY_BINAURAL_IR: {
            uuid: string;
            order: number;
        };
        BEAMTRACE_DOWNLOAD_BINAURAL_IR: {
            uuid: string;
            order: number;
        };
        BEAMTRACE_DOWNLOAD_OCTAVE_IR: string;
        BEAMTRACE_QUICK_ESTIMATE: string;
        BEAMTRACE_QUICK_ESTIMATE_COMPLETE: string;
        SHOULD_ADD_BEAMTRACE: undefined;
    }
}
