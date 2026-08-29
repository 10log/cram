import { ShaderMaterial, Mesh, DataTexture, IUniform, WebGLRenderTarget } from 'three';
import { GPUComputationRenderer, Variable } from '../../../node_modules/@types/three/examples/jsm/misc/GPUComputationRenderer.js';
import { default as Solver } from '../solver';
import { FdtdSlice } from './slice';
import { default as Source } from '../../objects/source';
import { default as Receiver } from '../../objects/receiver';
import { default as FDTDWall, FDTDWallProps } from './fdtd-wall';
import { default as Surface } from '../../objects/surface';
import { KeyValuePair } from '../../common/key-value-pair';
import { EditorModes } from '../../constants';
export declare const FDTD_2D_Defaults: {
    width: number;
    height: number;
    cellSize: number;
    offsetX: number;
    offsetY: number;
    slice: FdtdSlice;
};
export interface FDTD_2D_Props {
    width?: number;
    height?: number;
    cellSize?: number;
    offsetX?: number;
    offsetY?: number;
    /** Floor plan (`xz`) or vertical sketch (`xy`). Inferred from the selected surface when omitted. */
    slice?: FdtdSlice;
}
export interface Uniforms {
    [uniform: string]: IUniform;
}
declare class FDTD_2D extends Solver {
    gpuCompute: GPUComputationRenderer;
    /**
     * number of x cells
     */
    nx: number;
    /**
     * number of y cells
     */
    ny: number;
    offsetX: number;
    offsetY: number;
    slice: FdtdSlice;
    sliceHeight: number;
    uniforms: Uniforms;
    mesh: Mesh;
    editMesh: Mesh;
    heightmapVariable: Variable;
    sourcemapVariable: Variable;
    sourcemap: DataTexture;
    readLevelShader: ShaderMaterial;
    readLevelImage: Uint8Array;
    readLevelRenderTarget: WebGLRenderTarget;
    sources: KeyValuePair<Source>;
    sourceKeys: string[];
    receivers: KeyValuePair<Receiver>;
    receiverKeys: string[];
    walls: FDTDWall[];
    /**
     * simulation in seconds
     */
    time: number;
    /**
     * simulation time step in seconds
     */
    dt: number;
    width: number;
    height: number;
    cellSize: number;
    numPasses: number;
    waveSpeed: number;
    recording: boolean;
    clearShader: ShaderMaterial;
    frame: number;
    messageHandlers: string[][];
    eventListeners: (() => void)[];
    constructor(props?: FDTD_2D_Props);
    onModeChange(mode: EditorModes): void;
    setWidth(width: number): void;
    setHeight(height: number): void;
    setDimmensions(width: number, height: number): void;
    init(): void;
    editSize(): void;
    dispose(): void;
    run(): void;
    stop(): void;
    setWireframeVisible(show: boolean): void;
    getWireframeVisible(): boolean;
    addSource(source: Source): void;
    removeSource(id: string): void;
    addReceiver(receiver: Receiver): void;
    removeReceiver(id: string): void;
    addWall(props: FDTDWallProps): void;
    addWallsFromSurfaceEdges(surface: Surface): void;
    fillSourceTexture(): void;
    toggleWall(index: number): void;
    updateWalls(): void;
    updateSourceTexture(): void;
    fillTexture(texture: DataTexture): void;
    readReceiverLevels(): void;
    clear(): void;
    render(): void;
    onParameterConfigFocus(): void;
    onParameterConfigBlur(): void;
}
export { FDTD_2D };
export default FDTD_2D;
