import * as THREE from "three";
import { emit } from "../messenger";
import { useContainer } from "../store";
import { addMoment, Directions } from "../history";
import hotkeys from "hotkeys-js";
import type { SourceSaveObject } from "../objects/source";
import type { ReceiverSaveObject } from "../objects/receiver";
import type Renderer from "./renderer";

const YAW_PITCH_SENSITIVITY = 0.003;
const ROLL_SENSITIVITY = 0.005;

interface FirstPersonState {
  targetUuid: string;
  savedCameraPosition: THREE.Vector3;
  savedCameraQuaternion: THREE.Quaternion;
  savedControlsTarget: THREE.Vector3;
  initialContainerSave: SourceSaveObject | ReceiverSaveObject;
}

type DragMode = "yaw-pitch" | "roll" | null;

export default class FirstPersonControls {
  private state: FirstPersonState | null = null;
  private canvas: HTMLCanvasElement;
  private _renderer: Renderer;
  private dragMode: DragMode = null;
  private lastMouseX = 0;
  private lastMouseY = 0;

  // Bound listeners for cleanup
  private onMouseDown: ((e: MouseEvent) => void) | null = null;
  private onMouseMove: ((e: MouseEvent) => void) | null = null;
  private onMouseUp: ((e: MouseEvent) => void) | null = null;
  private onContextMenu: ((e: MouseEvent) => void) | null = null;

  constructor(canvas: HTMLCanvasElement, renderer: Renderer) {
    this.canvas = canvas;
    this._renderer = renderer;
  }

  get active(): boolean {
    return this.state !== null;
  }

  enter(uuid: string) {
    if (this.active) return;

    const renderer = this._renderer;
    if (renderer.isPerformingOperation) return;
    if (renderer.isOrtho) return;
    if (renderer.currentlyMovingObjects) return;

    const container = useContainer.getState().containers[uuid];
    if (!container) return;

    // Save current camera state and initial container state for undo
    const savedCameraPosition = renderer.camera.position.clone();
    const savedCameraQuaternion = renderer.camera.quaternion.clone();
    const savedControlsTarget = renderer.controls.target.clone();
    const initialContainerSave = container.save() as SourceSaveObject | ReceiverSaveObject;

    this.state = {
      targetUuid: uuid,
      savedCameraPosition,
      savedCameraQuaternion,
      savedControlsTarget,
      initialContainerSave,
    };

    // Compute target camera position & orientation
    const targetPosition = container.position.clone();

    // Forward = (0,0,1) rotated by container's Euler (matches receiver getGain convention)
    const forward = new THREE.Vector3(0, 0, 1).applyEuler(container.rotation);

    // Build quaternion: camera looks along -Z, so we need lookAt from origin along forward
    const targetQuat = this.forwardToQuaternion(forward);

    // Dispose orbit controls to prevent interference
    renderer.controls.dispose();

    // Smooth transition to first-person view
    renderer.smoothCameraToQuat({
      position: targetPosition,
      quat: targetQuat,
      duration: 300,
      onFinish: () => {
        this.attachMouseListeners();
        hotkeys.setScope("FIRST_PERSON");
      },
    });

    // Show overlay
    renderer.overlays.global.addCell("Mode", "First Person View", {
      id: "fpv-mode",
    });
  }

  exit() {
    if (!this.state) return;

    const renderer = this._renderer;
    const { targetUuid, savedCameraPosition, savedCameraQuaternion, savedControlsTarget, initialContainerSave } = this.state;

    this.detachMouseListeners();

    // Remove overlay
    renderer.overlays.global.removeCell("fpv-mode");

    // Create undo moment (initial vs final container save)
    const container = useContainer.getState().containers[targetUuid];
    if (container) {
      const finalContainerSave = container.save() as SourceSaveObject | ReceiverSaveObject;
      const initialSave = initialContainerSave;

      addMoment({
        category: "FIRST_PERSON_ROTATION",
        objectId: targetUuid,
        recallFunction: (direction?: keyof Directions) => {
          const c = useContainer.getState().containers[targetUuid];
          if (!c) return;
          if (direction === "UNDO") {
            c.restore(initialSave);
          } else {
            c.restore(finalContainerSave);
          }
          useContainer.getState().set(store => {
            store.version++;
          });
          emit("RENDER");
        },
      });
    }

    // Clear state before transition (prevents re-entry issues)
    this.state = null;

    // Smooth transition back to saved camera state
    renderer.smoothCameraToQuat({
      position: savedCameraPosition,
      quat: savedCameraQuaternion,
      duration: 300,
      onFinish: () => {
        renderer.resetControls();
        renderer.controls.target.copy(savedControlsTarget);
        renderer.controls.update();
        hotkeys.setScope("EDITOR");
      },
    });
  }

  dispose() {
    this.detachMouseListeners();
    this.state = null;
  }

  private attachMouseListeners() {
    this.onMouseDown = (e: MouseEvent) => this.handleMouseDown(e);
    this.onMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
    this.onMouseUp = () => this.handleMouseUp();
    this.onContextMenu = (e: MouseEvent) => e.preventDefault();

    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("contextmenu", this.onContextMenu);
  }

  private detachMouseListeners() {
    if (this.onMouseDown) {
      this.canvas.removeEventListener("mousedown", this.onMouseDown);
      this.onMouseDown = null;
    }
    if (this.onMouseMove) {
      window.removeEventListener("mousemove", this.onMouseMove);
      this.onMouseMove = null;
    }
    if (this.onMouseUp) {
      window.removeEventListener("mouseup", this.onMouseUp);
      this.onMouseUp = null;
    }
    if (this.onContextMenu) {
      this.canvas.removeEventListener("contextmenu", this.onContextMenu);
      this.onContextMenu = null;
    }
    this.dragMode = null;
  }

  private handleMouseDown(e: MouseEvent) {
    if (e.button === 2 || (e.button === 0 && e.shiftKey)) {
      // Right-click or Shift+left-click: roll
      this.dragMode = "roll";
    } else if (e.button === 0) {
      // Left-click: yaw/pitch
      this.dragMode = "yaw-pitch";
    }
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.dragMode || !this.state) return;

    // Guard: check container still exists
    const container = useContainer.getState().containers[this.state.targetUuid];
    if (!container) {
      this.exit();
      return;
    }

    const renderer = this._renderer;
    const camera = renderer.camera;

    const dx = e.clientX - this.lastMouseX;
    const dy = e.clientY - this.lastMouseY;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    if (this.dragMode === "yaw-pitch") {
      // Yaw: rotate around world Z axis
      const yawAngle = -dx * YAW_PITCH_SENSITIVITY;
      const yawQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        yawAngle
      );

      // Pitch: rotate around camera's local X axis
      const pitchAngle = -dy * YAW_PITCH_SENSITIVITY;
      const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      const pitchQuat = new THREE.Quaternion().setFromAxisAngle(cameraRight, pitchAngle);

      // Apply yaw then pitch
      camera.quaternion.premultiply(yawQuat);
      camera.quaternion.premultiply(pitchQuat);
      camera.quaternion.normalize();
    } else if (this.dragMode === "roll") {
      // Roll: rotate around camera's local Z (look direction)
      const rollAngle = dx * ROLL_SENSITIVITY;
      const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const rollQuat = new THREE.Quaternion().setFromAxisAngle(lookDir, rollAngle);

      camera.quaternion.premultiply(rollQuat);
      camera.quaternion.normalize();
    }

    // Write camera orientation back to container
    this.syncCameraToContainer(container);

    // Trigger re-render and UI update
    useContainer.getState().set(store => {
      store.version++;
    });
    emit("RENDER");
  }

  private handleMouseUp() {
    this.dragMode = null;
  }

  /**
   * Convert camera quaternion back to container Euler angles.
   * Camera looks along its local -Z, but container forward is (0,0,1) rotated by its Euler.
   */
  private syncCameraToContainer(container: THREE.Object3D) {
    const camera = this._renderer.camera;

    // Camera forward is its local -Z direction
    const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

    // Container forward convention is (0,0,1) rotated by its Euler
    // We need to find an Euler such that Vector3(0,0,1).applyEuler(euler) === cameraForward
    const containerQuat = this.forwardToQuaternion(cameraForward);
    const euler = new THREE.Euler().setFromQuaternion(containerQuat, "XYZ");
    container.rotation.copy(euler);
  }

  /**
   * Build a quaternion that, when used to rotate (0,0,1), produces the given forward direction.
   * Uses Matrix4.lookAt with Z-up convention.
   */
  private forwardToQuaternion(forward: THREE.Vector3): THREE.Quaternion {
    const origin = new THREE.Vector3(0, 0, 0);
    const up = new THREE.Vector3(0, 0, 1);
    const target = forward.clone().normalize();

    // lookAt builds a matrix where -Z points from eye to target
    const mat = new THREE.Matrix4().lookAt(origin, target, up);
    return new THREE.Quaternion().setFromRotationMatrix(mat);
  }
}
