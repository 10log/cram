import { ShaderMaterial, Mesh, DataTexture, IUniform, WebGLRenderTarget } from 'three';
import { GPUComputationRenderer, Variable } from '../../../node_modules/@types/three/examples/jsm/misc/GPUComputationRenderer.js';
import { default as Solver } from '../solver';
import { FdtdSlice } from './slice';
import { DEFAULT_DAMPING, FDTD_REFERENCE_FREQUENCY } from './index-constants';
import { RlcMaterialTable } from './rlc-wall';
import { RlcBranch } from '../acoustics/rlc-admittance';
import { default as Source } from '../../objects/source';
import { default as Receiver } from '../../objects/receiver';
import { default as FDTDWall, FDTDWallProps } from './fdtd-wall';
import { default as Surface } from '../../objects/surface';
import { KeyValuePair } from '../../common/key-value-pair';
import { EditorModes } from '../../constants';
export { DEFAULT_DAMPING, FDTD_REFERENCE_FREQUENCY };
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
    /** Air temperature in °C. Default 20, matching the other solvers. */
    temperature?: number;
    /**
     * Walls follow their materials' octave bands in one run (#222), as fitted
     * series-RLC branches, instead of one coefficient at
     * FDTD_REFERENCE_FREQUENCY. Default off.
     */
    frequencyDependentWalls?: boolean;
}
/** The 2D fit of a wall's octave bands (#222), or none for a rigid material. */
export declare function rlcBranchesForBands(bands: {
    frequencies: number[];
    absorption: number[];
}): RlcBranch[];
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
    /**
     * Staircase face weights per wall cell, as `1 − w` (#220), in r and g; the
     * wall's RLC material index plus one in b (#222).
     */
    wallmap: DataTexture;
    /** See FDTD_2D_Props.frequencyDependentWalls. */
    frequencyDependentWalls: boolean;
    /** Branch-state variables, RLC_TEXTURES of them when frequencyDependentWalls. */
    rlcVariables: Variable[];
    /** (b, bd, bDh, bFh) per branch and material, for the current dt. */
    rlcCoefficients?: DataTexture;
    rlcTable: RlcMaterialTable;
    zeroShader?: ShaderMaterial;
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
    _temperature: number;
    recording: boolean;
    lastTickMs: number | null;
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
    disposeGpu(): void;
    dispose(): void;
    run(): void;
    stop(): void;
    get temperature(): number;
    set temperature(value: number);
    get c(): number;
    /** Keep waveSpeed, dt, and courantSq on the CFL 1/√2 locus. */
    applyWaveSpeed(): void;
    /**
     * Rebuild the RLC coefficient texture for the current materials and dt,
     * and bind it, with the Courant number, to every pass that reads it.
     */
    updateRlcCoefficients(): void;
    /**
     * Switch frequency-dependent walls (#222) on or off. The GPU passes are
     * rebuilt, so the field restarts from rest.
     */
    setFrequencyDependentWalls(on: boolean): void;
    get sampleRate(): number;
    startRecording(): void;
    stopRecording(): void;
    setWireframeVisible(show: boolean): void;
    getWireframeVisible(): boolean;
    addSource(source: Source): void;
    removeSource(id: string): void;
    private planeCellIndex;
    private vacateSourceCell;
    addReceiver(receiver: Receiver): void;
    removeReceiver(id: string): void;
    addWall(props: FDTDWallProps): void;
    addWallsFromSurfaceEdges(surface: Surface): void;
    fillSourceTexture(): void;
    toggleWall(index: number): void;
    /** Courant number the field runs at. The CFL locus puts it at 1/√2. */
    get courant(): number;
    /**
     * Highest frequency the walls deliver their coefficient at, within about
     * 0.05 in α. Above it they read as more reflective than their materials.
     */
    get impedanceFrequencyLimit(): number;
    updateWalls(): void;
    /**
     * A wall's RLC material index (#222), or null to keep its single
     * coefficient: frequency-dependent walls off, a disabled wall, a wall with
     * no spectrum, or a spectrum that is rigid in every band.
     */
    private rlcMaterialFor;
    updateSourceTexture(): void;
    fillTexture(texture: DataTexture): void;
    readReceiverLevels(): void;
    clear(): void;
    render(nowMs?: number): void;
    onParameterConfigFocus(): void;
    onParameterConfigBlur(): void;
}
export { FDTD_2D };
export default FDTD_2D;
