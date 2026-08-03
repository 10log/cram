import { default as Stats } from './Stats';
import { EffectComposer } from '../../node_modules/@types/three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from '../../node_modules/@types/three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from '../../node_modules/@types/three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from '../../node_modules/@types/three/examples/jsm/postprocessing/ShaderPass';
import { TransformControls } from './TransformControls';
import { QuatAngle } from '../common/QuatAngle';
import { default as Container } from '../objects/container';
import { default as Grid } from './env/grid';
import { KeyValuePair } from '../common/key-value-pair';
import { default as Axes } from './env/axes';
import { default as Lights } from './env/lights';
import { default as Room } from '../objects/room';
import { default as PickHelper } from './pick-helper';
import { TransformOverlay, GlobalOverlay } from './overlays';
import { OrientationControl } from './orientation-control/orientation-control';
import { default as Cursor } from './Cursor';
import { default as FirstPersonControls } from './first-person-controls';
import { Processes } from '../constants/processes';
import { Markup } from './Markup';
import { RendererTheme } from '../themes';
import { default as Model } from '../objects/model';
import * as THREE from "three";
export interface SmoothCameraParams {
    /**
     * Where the camera will end up
     */
    position: THREE.Vector3;
    /**
     * Where to look at while moving
     */
    target?: THREE.Vector3;
    /**
     * time in ms
     */
    duration?: number;
    /**
     * easing function which acts similar to a css function
     */
    easingFunction?: (t: number) => number;
    /**
     * callback
     */
    onFinish?: (...args: any[]) => void;
}
export interface SmoothCameraQuatParams extends SmoothCameraParams {
    /**
     * final orientation
     */
    quat: THREE.Quaternion;
}
export interface OrbitControlMouseConfig {
    LEFT: number;
    MIDDLE: number;
    RIGHT: number;
}
export interface MouseConfigSet {
    Default: OrbitControlMouseConfig;
    Shift: OrbitControlMouseConfig;
    Control: OrbitControlMouseConfig;
    Alt: OrbitControlMouseConfig;
    Meta: OrbitControlMouseConfig;
}
export interface ModifierKeyState {
    Shift: number;
    Control: number;
    Alt: number;
    Meta: number;
}
export interface Overlays {
    transform: TransformOverlay;
    global: GlobalOverlay;
}
export default class Renderer {
    stats: Stats;
    mouseConfigSet: MouseConfigSet;
    modifierKeyState: ModifierKeyState;
    elt: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;
    _camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    perspectiveCamera: THREE.PerspectiveCamera;
    orthoCamera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    env: Container;
    fdtdItems: Container;
    interactables: Container;
    workspace: Container;
    sketches: Container;
    markup: Markup;
    lights: Lights;
    axes: Axes;
    grid: Grid;
    stack: Array<(...args: any[]) => void>;
    settingHandlers: KeyValuePair<(val: any) => void>;
    sourceGroup: Container;
    sourceTemplate: Container;
    receiverGroup: Container;
    receiverTemplate: Container;
    geometryGroup: Container;
    controls: any;
    workspaceCursor: THREE.Object3D;
    fog: THREE.FogExp2 | THREE.Fog;
    _fov: number;
    textures: KeyValuePair<THREE.Texture>;
    smoothingCameraCallback: any;
    smoothingCamera: boolean;
    pickHelper: PickHelper;
    cursor: Cursor;
    composer: EffectComposer;
    outlinePass: OutlinePass;
    renderPass: RenderPass;
    effectFXAA: ShaderPass;
    transformControls: TransformControls;
    currentlyMovingObjects: boolean;
    overlays: Overlays;
    fdtd2drunning: boolean;
    fdtd3drunning: boolean;
    needsToRender: boolean;
    shouldAnimate: boolean;
    /** Tracks if render loop is in idle polling mode */
    private isIdle;
    orientationControl: OrientationControl;
    firstPersonControls: FirstPersonControls;
    currentProcess: Processes;
    /** Theme queued before init() — applied once the scene is created */
    _pendingTheme?: RendererTheme;
    constructor();
    init(elt: HTMLCanvasElement): void;
    onOrbitControlsChange(_e: any): void;
    storeCameraState(): void;
    resetControls(): void;
    setOrtho(on: boolean): void;
    resize(): void;
    resizeCanvasToDisplaySize(force?: boolean): void;
    checkresize(): void;
    settingChanged(setting: string, value: any): void;
    addRays(rays: THREE.LineSegments): void;
    add(obj: THREE.Object3D): void;
    remove(obj: THREE.Object3D): void;
    addModel(model: Model): void;
    addRoom(room: Room): void;
    getCenteredCanvasBounds(): {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    getOrthoBounds(): number[];
    quat2angle(quat: THREE.Quaternion): QuatAngle;
    angle2quat(angle: QuatAngle): THREE.Quaternion;
    applyQuatAngle(angle: number, x: number, y: number, z: number): void;
    roll(angle: number): void;
    smoothCameraTo(params: SmoothCameraParams): void;
    smoothCameraToQuat(params: SmoothCameraQuatParams): void;
    update(): void;
    /** Update stats after an actual frame render */
    updateStats(): void;
    updateCursorSize(): void;
    /** Request a render, waking up from idle state if necessary */
    requestRender(): void;
    render(): void;
    /**
     * returns true if performing an operation, like moving an object.
     * put this here so that if user presses escape while moving/operating it doesnt deselect
     */
    get isPerformingOperation(): boolean;
    get camera(): THREE.PerspectiveCamera | THREE.OrthographicCamera;
    set camera(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera);
    get fogDensity(): number;
    set fogDensity(density: number);
    get gridVisible(): boolean;
    set gridVisible(visible: boolean);
    get cursorVisible(): boolean;
    set cursorVisible(visible: boolean);
    get axisVisible(): boolean;
    set axisVisible(visible: boolean);
    get zoom(): number;
    set zoom(zoom: number);
    get near(): number;
    set near(near: number);
    get far(): number;
    set far(far: number);
    get isOrtho(): boolean;
    set isOrtho(ortho: boolean);
    get background(): string;
    set background(color: string);
    get fogColor(): string;
    set fogColor(color: string);
    /**
     * Apply a renderer theme to update scene colors
     */
    applyTheme(rendererTheme: RendererTheme): void;
    get fov(): number;
    set fov(fov: number);
    private get clientWidth();
    private get clientHeight();
    private get aspect();
    private get mode();
    /**
     * Tracks event listener cleanup functions
     */
    private cleanupFunctions;
    /**
     * Register an event listener that will be cleaned up on dispose
     */
    private addCleanupListener;
    /**
     * Dispose of the renderer and clean up all resources
     */
    dispose(): void;
    /** Animation frame ID for cancellation */
    private animationFrameId?;
}
/**
 * Factory function to create a new Renderer instance
 */
export declare function createRenderer(): Renderer;
export declare const renderer: Renderer;
declare global {
    interface EventTypes {
        RENDERER_UPDATED: any;
        RENDERER_SHOULD_ANIMATE: boolean;
        PHASE_OUT: undefined;
        STOP_OPERATIONS: undefined;
        MOVE_SELECTED_OBJECTS: undefined;
        TOGGLE_CAMERA_ORTHO: undefined;
        FOCUS_ON_SELECTED_OBJECTS: undefined;
        FOCUS_ON_CURSOR: undefined;
        RENDER: undefined;
        ENTER_FIRST_PERSON: {
            uuid: string;
        };
        EXIT_FIRST_PERSON: undefined;
    }
}
