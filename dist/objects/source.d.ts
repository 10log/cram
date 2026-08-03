import { default as Container, ContainerProps, ContainerSaveObject } from './container';
import { EditorModes } from '../constants/editor-modes';
import { CLFResult } from '../import-handlers/CLFParser';
import * as THREE from "three";
export interface SourceSaveObject extends ContainerSaveObject {
    name: string;
    visible: boolean;
    position: number[];
    scale: number[];
    rotation: [number, number, number] | number[];
    uuid: string;
    kind: "source";
    color: number;
    signalSource: SignalSource;
    amplitude: number;
    frequency: number;
    phase: number;
}
export interface SourceProps extends ContainerProps {
    f?: (t: number) => number;
    theta?: number;
    phi?: number;
}
export declare enum SignalSource {
    NONE = 0,
    OSCILLATOR = 1,
    PINK_NOISE = 2,
    WHITE_NOISE = 3,
    PULSE = 4
}
export declare const SignalSourceOptions: {
    value: string;
    label: string;
}[];
export declare class Source extends Container {
    f: (t: number) => number;
    theta: number;
    phi: number;
    numRays: number;
    mesh: THREE.Mesh;
    selectedMaterial: THREE.MeshMatcapMaterial;
    normalMaterial: THREE.MeshMatcapMaterial;
    amplitude: number;
    frequency: number;
    phase: number;
    value: number;
    previousValue: number;
    velocity: number;
    rgba: number[];
    previousX: number;
    previousY: number;
    previousZ: number;
    shouldClearPreviousPosition: boolean;
    pinkNoiseSamples: Float32Array;
    signalSource: SignalSource;
    private _initialSPL;
    private _initialIntensity;
    fdtdSamples: number[];
    directivityHandler: DirectivityHandler;
    constructor(name?: string, props?: SourceProps);
    dispose(): void;
    save(): SourceSaveObject;
    restore(state: SourceSaveObject): this;
    updatePreviousPosition(): void;
    updateWave(time: number, frame: number, dt: number): void;
    recordSample(): void;
    getWhiteNoiseSample(): number;
    getOscillatorSample(time: number): number;
    getPulseSample(time: number, dt: number): number;
    getPinkNoiseSample(frame: number): number;
    generatePinkNoiseSamples(): void;
    clearSamples(): void;
    saveSamples(): void;
    getColorAsNumber(): number;
    getColorAsString(): string;
    onModeChange(mode: EditorModes): void;
    get color(): string | number;
    set color(col: string | number);
    get initialSPL(): number;
    set initialSPL(spl: number);
    get initialIntensity(): number;
    get brief(): {
        uuid: string;
        name: string;
        selected: boolean;
        kind: string;
        children: never[];
    };
}
declare global {
    interface EventTypes {
        ADD_SOURCE: Source | undefined;
        SOURCE_SET_PROPERTY: SetPropertyPayload<Source>;
        REMOVE_SOURCE: string;
        SOURCE_CALL_METHOD: CallContainerMethod<Source>;
    }
}
export declare const getSources: () => Source[];
export default Source;
/**
 * Directivity Handler
 **/
export declare class DirectivityHandler {
    private dirDataList;
    frequencies: number[];
    sensitivity: number[];
    sourceDirType: number;
    phi: number[];
    theta: number[];
    clfData: CLFResult | undefined;
    constructor(sourceType: number, importData?: CLFResult);
    getPressureAtPosition(gain: number, frequency: number, phi: number, theta: number): number | number[];
}
export interface directivityData {
    frequency: number;
    directivity: number[][];
}
