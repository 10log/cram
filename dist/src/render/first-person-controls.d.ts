import { default as Renderer } from './renderer';
export default class FirstPersonControls {
    private state;
    private canvas;
    private _renderer;
    private yaw;
    private pitch;
    private dragging;
    private lastMouseX;
    private lastMouseY;
    private lastUIUpdate;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    private onContextMenu;
    private propertyUnsubs;
    private orbitButton;
    constructor(canvas: HTMLCanvasElement, renderer: Renderer);
    get active(): boolean;
    enter(uuid: string): void;
    exit(): void;
    dispose(): void;
    private static ROTATION_PROPS;
    private handlePropertyChange;
    private attachPropertyListeners;
    private detachPropertyListeners;
    private attachMouseListeners;
    private detachMouseListeners;
    private handleMouseDown;
    private handleMouseMove;
    private handleMouseUp;
    private showOrbitButton;
    private removeOrbitButton;
    /**
     * Extract yaw (azimuth around Z) and pitch (elevation) from a forward direction vector.
     */
    private extractYawPitch;
    /**
     * Build a forward direction vector from yaw/pitch (spherical coords, Z-up).
     */
    private buildForward;
    /**
     * Build a roll-free camera quaternion from the current yaw/pitch.
     */
    private buildQuaternion;
    /**
     * Convert camera quaternion back to container Euler angles.
     * Camera looks along its local -Z, but container forward is (0,0,1) rotated by its Euler.
     */
    private syncCameraToContainer;
    /**
     * Update the orientation control cube to match the current camera quaternion.
     */
    private syncOrientationControl;
    /**
     * Build a quaternion that, when used to rotate (0,0,1), produces the given forward direction.
     * Uses Matrix4.lookAt with Z-up convention.
     */
    private forwardToQuaternion;
}
