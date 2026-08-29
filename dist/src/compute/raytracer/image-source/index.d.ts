import { default as Solver } from '../../solver';
import { default as Room } from '../../../objects/room';
import { default as Source } from '../../../objects/source';
import { default as Receiver } from '../../../objects/receiver';
import { Vector3 } from 'three';
import { default as Surface } from '../../../objects/surface';
import * as THREE from "three";
interface ImageSourceParams {
    baseSource: Source;
    position: Vector3;
    room: Room;
    reflector: Surface | null;
    parent: ImageSource | null;
    order: number;
}
declare class ImageSource {
    baseSource: Source;
    children: ImageSource[];
    parent: ImageSource | null;
    reflector: Surface | null;
    order: number;
    position: Vector3;
    room: Room;
    uuid: string;
    constructor(params: ImageSourceParams);
    constructPathsForAllDescendents(r: Receiver, constructForThis?: boolean): ImageSourcePath[];
    markupAllDescendents(): void;
    markup(): void;
    getTotalDescendents(): number;
    getChildrenOfOrder(order: number): ImageSource[];
    get hasChildren(): boolean;
}
interface IntersectionPoint {
    point: Vector3;
    reflectingSurface: Surface | null;
    angle: number | null;
}
declare class ImageSourcePath {
    path: IntersectionPoint[];
    uuid: string;
    highlight: boolean;
    constructor(path: IntersectionPoint[]);
    markup(): void;
    isvalid(room_surfaces: Surface[]): boolean;
    get order(): number;
    get totalLength(): number;
    arrivalPressure(initialSPL: number[], freqs: number[], temperature?: number): number[];
    arrivalTime(c: number): number;
}
export type ImageSourceSaveObject = {
    name: string;
    kind: "image-source";
    uuid: string;
    autoCalculate: boolean;
    roomID: string;
    sourceIDs: string[];
    surfaceIDs: string[];
    receiverIDs: string[];
    maxReflectionOrder: number;
    imageSourcesVisible: boolean;
    rayPathsVisible: boolean;
    plotOrders: number[];
    frequencies: number[];
    levelTimeProgression: string;
};
export interface ImageSourceSolverParams {
    name: string;
    uuid?: string;
    roomID: string;
    sourceIDs: string[];
    surfaceIDs: string[];
    receiverIDs: string[];
    maxReflectionOrder: number;
    imageSourcesVisible: boolean;
    rayPathsVisible: boolean;
    plotOrders: number[];
    frequencies: number[];
    levelTimeProgression?: string;
}
export interface HybridRayPath {
    time: number;
    pressure: number[];
    order: number;
}
export declare class ImageSourceSolver extends Solver {
    sourceIDs: string[];
    receiverIDs: string[];
    roomID: string;
    surfaceIDs: string[];
    uuid: string;
    levelTimeProgression: string;
    maxReflectionOrder: number;
    frequencies: number[];
    private _imageSourcesVisible;
    private _rayPathsVisible;
    private _plotOrders;
    impulseResponse: AudioBuffer;
    impulseResponsePlaying: boolean;
    rootImageSource: ImageSource | null;
    validRayPaths: ImageSourcePath[] | null;
    allRayPaths: ImageSourcePath[] | null;
    selectedImageSourcePath: THREE.Mesh;
    private overlay;
    private _plotFrequency;
    isHybrid: boolean;
    constructor(params?: ImageSourceSolverParams, isHybrid?: boolean);
    save(): ImageSourceSaveObject;
    dispose(): void;
    updateSelectedImageSourcePath(imageSourcePath: ImageSourcePath): void;
    updateImageSourceCalculation(): void;
    returnSortedPathsForHybrid(c: number, initialSPLs: number[], freqs: number[]): HybridRayPath[];
    calculateLTP(c?: number, consoleOutput?: boolean): void;
    getPathsOfOrder(order: number): ImageSourcePath[];
    test(): void;
    clearLevelTimeProgressionData(): void;
    reset(): void;
    drawImageSources(): void;
    clearImageSources(): void;
    drawRayPaths(orders?: number[]): void;
    clearRayPaths(): void;
    toggleRayPathHighlight(rayPathUUID: string): void;
    calculateImpulseResponse(): Promise<AudioBuffer | undefined>;
    playImpulseResponse(): Promise<void>;
    downloadImpulseResponse(filename: string, sampleRate?: number): Promise<void>;
    get sources(): import('../../../objects/container').default[];
    get receivers(): Receiver[];
    get room(): Room;
    get numValidRays(): number;
    get numTotalRays(): number;
    set maxReflectionOrderReset(o: number);
    get maxReflectionOrderReset(): number;
    set rayPathsVisible(vis: boolean);
    get rayPathsVisible(): boolean;
    set imageSourcesVisible(vis: boolean);
    get imageSourcesVisible(): boolean;
    get possibleOrders(): {
        value: number;
        label: any;
    }[];
    get selectedPlotOrders(): {
        value: number;
        label: any;
    }[];
    set toggleOrder(order: number);
    get plotOrders(): number[];
    set plotOrders(orders: number[]);
    get temperature(): number;
    get c(): number;
    set plotFrequency(f: number);
}
export default ImageSourceSolver;
declare global {
    interface EventTypes {
        ADD_IMAGESOURCE: ImageSourceSolver | undefined;
        REMOVE_IMAGESOURCE: string;
        IMAGESOURCE_CLEAR_RAYS: string;
        IMAGESOURCE_SET_PROPERTY: {
            uuid: string;
            property: keyof ImageSourceSolver;
            value: ImageSourceSolver[EventTypes["IMAGESOURCE_SET_PROPERTY"]["property"]];
        };
        UPDATE_IMAGESOURCE: string;
        RESET_IMAGESOURCE: string;
        CALCULATE_LTP: string;
        IMAGESOURCE_PLAY_IR: string;
        IMAGESOURCE_DOWNLOAD_IR: string;
    }
}
