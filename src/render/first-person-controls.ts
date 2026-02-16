import * as THREE from "three";
import { emit, after } from "../messenger";
import { useContainer } from "../store";
import { addMoment, Directions } from "../history";
import hotkeys from "hotkeys-js";
import type { SourceSaveObject } from "../objects/source";
import type { ReceiverSaveObject } from "../objects/receiver";
import type Renderer from "./renderer";

const SENSITIVITY = 0.003;

interface FirstPersonState {
  targetUuid: string;
  savedCameraPosition: THREE.Vector3;
  savedCameraQuaternion: THREE.Quaternion;
  savedControlsTarget: THREE.Vector3;
  initialContainerSave: SourceSaveObject | ReceiverSaveObject;
}

export default class FirstPersonControls {
  private state: FirstPersonState | null = null;
  private canvas: HTMLCanvasElement;
  private _renderer: Renderer;

  // Yaw/pitch angles (radians) — rebuilt into quaternion each frame, so roll never accumulates
  private yaw = 0;
  private pitch = 0;

  private dragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private lastUIUpdate = 0;

  // Bound listeners for cleanup
  private onMouseDown: ((e: MouseEvent) => void) | null = null;
  private onMouseMove: ((e: MouseEvent) => void) | null = null;
  private onMouseUp: ((e: MouseEvent) => void) | null = null;
  private onContextMenu: ((e: MouseEvent) => void) | null = null;

  // Event unsubscribers for property change listeners
  private propertyUnsubs: (() => void)[] = [];

  // Orbit button overlay
  private orbitButton: HTMLButtonElement | null = null;

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

    // Extract yaw/pitch from forward direction
    this.extractYawPitch(forward);

    // Build quaternion from yaw/pitch (roll-free by construction)
    const targetQuat = this.buildQuaternion();

    // Dispose orbit controls to prevent interference
    renderer.controls.dispose();

    // Smooth transition to first-person view
    renderer.smoothCameraToQuat({
      position: targetPosition,
      quat: targetQuat,
      duration: 300,
      onFinish: () => {
        this.attachMouseListeners();
        this.attachPropertyListeners();
        hotkeys.setScope("FIRST_PERSON");
      },
    });

    // Show overlays
    renderer.overlays.global.addCell("Mode", "First Person View", {
      id: "fpv-mode",
    });
    this.showOrbitButton();
  }

  exit() {
    if (!this.state) return;

    const renderer = this._renderer;
    const { targetUuid, savedCameraPosition, savedCameraQuaternion, savedControlsTarget, initialContainerSave } = this.state;

    this.detachMouseListeners();
    this.detachPropertyListeners();

    // Remove overlays
    renderer.overlays.global.removeCell("fpv-mode");
    this.removeOrbitButton();

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
    this.detachPropertyListeners();
    this.removeOrbitButton();
    this.state = null;
  }

  private static ROTATION_PROPS = new Set(["rotationx", "rotationy", "rotationz"]);

  private handlePropertyChange = (payload: { uuid: string; property: string; value: unknown }) => {
    if (!this.state) return;
    if (payload.uuid !== this.state.targetUuid) return;
    if (!FirstPersonControls.ROTATION_PROPS.has(payload.property)) return;

    // Container rotation was changed externally — update yaw/pitch and camera
    const container = useContainer.getState().containers[this.state.targetUuid];
    if (!container) return;

    const forward = new THREE.Vector3(0, 0, 1).applyEuler(container.rotation);
    this.extractYawPitch(forward);
    this._renderer.camera.quaternion.copy(this.buildQuaternion());
    this.syncOrientationControl();
    emit("RENDER");
  };

  private attachPropertyListeners() {
    this.propertyUnsubs.push(
      after("SOURCE_SET_PROPERTY", this.handlePropertyChange as any),
      after("RECEIVER_SET_PROPERTY", this.handlePropertyChange as any),
    );
  }

  private detachPropertyListeners() {
    this.propertyUnsubs.forEach(unsub => unsub());
    this.propertyUnsubs = [];
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
    this.dragging = false;
  }

  private handleMouseDown(e: MouseEvent) {
    if (e.button === 0) {
      this.dragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.dragging || !this.state) return;

    // Guard: check container still exists
    const container = useContainer.getState().containers[this.state.targetUuid];
    if (!container) {
      this.exit();
      return;
    }

    const dx = e.clientX - this.lastMouseX;
    const dy = e.clientY - this.lastMouseY;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    // Update yaw/pitch from mouse deltas
    this.yaw += -dx * SENSITIVITY;
    this.pitch = Math.max(
      -Math.PI / 2 + 0.001,
      Math.min(Math.PI / 2 - 0.001, this.pitch + -dy * SENSITIVITY)
    );

    // Rebuild camera quaternion from yaw/pitch (roll-free by construction)
    this._renderer.camera.quaternion.copy(this.buildQuaternion());

    // Write camera orientation back to container
    this.syncCameraToContainer(container);
    this.syncOrientationControl();

    // Throttle React UI updates (TransformTable) to ~30fps; camera stays real-time
    const now = performance.now();
    if (now - this.lastUIUpdate > 33) {
      this.lastUIUpdate = now;
      useContainer.getState().set(store => {
        store.version++;
      });
    }
    emit("RENDER");
  }

  private handleMouseUp() {
    if (this.dragging) {
      this.dragging = false;
      // Flush final UI update so TransformTable shows accurate values
      useContainer.getState().set(store => {
        store.version++;
      });
    }
  }

  private showOrbitButton() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const btn = document.createElement("button");
    btn.textContent = "Back to Orbit";
    Object.assign(btn.style, {
      position: "absolute",
      bottom: "12px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "6px 20px",
      fontSize: "13px",
      fontFamily: "inherit",
      color: "#fff",
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: "4px",
      cursor: "pointer",
      zIndex: "10",
      backdropFilter: "blur(4px)",
    } satisfies Partial<CSSStyleDeclaration>);
    btn.addEventListener("mouseenter", () => {
      btn.style.background = "rgba(255,255,255,0.25)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "rgba(255,255,255,0.12)";
    });
    btn.addEventListener("click", () => {
      emit("EXIT_FIRST_PERSON");
    });

    parent.appendChild(btn);
    this.orbitButton = btn;
  }

  private removeOrbitButton() {
    if (this.orbitButton) {
      this.orbitButton.remove();
      this.orbitButton = null;
    }
  }

  /**
   * Extract yaw (azimuth around Z) and pitch (elevation) from a forward direction vector.
   */
  private extractYawPitch(forward: THREE.Vector3) {
    const f = forward.clone().normalize();
    this.yaw = Math.atan2(f.y, f.x);
    this.pitch = Math.asin(Math.max(-1, Math.min(1, f.z)));
  }

  /**
   * Build a forward direction vector from yaw/pitch (spherical coords, Z-up).
   */
  private buildForward(): THREE.Vector3 {
    return new THREE.Vector3(
      Math.cos(this.pitch) * Math.cos(this.yaw),
      Math.cos(this.pitch) * Math.sin(this.yaw),
      Math.sin(this.pitch)
    );
  }

  /**
   * Build a roll-free camera quaternion from the current yaw/pitch.
   */
  private buildQuaternion(): THREE.Quaternion {
    return this.forwardToQuaternion(this.buildForward());
  }

  /**
   * Convert camera quaternion back to container Euler angles.
   * Camera looks along its local -Z, but container forward is (0,0,1) rotated by its Euler.
   */
  private syncCameraToContainer(container: THREE.Object3D) {
    const containerQuat = this.forwardToQuaternion(this.buildForward());
    const euler = new THREE.Euler().setFromQuaternion(containerQuat, "XYZ");
    container.rotation.copy(euler);
  }

  /**
   * Update the orientation control cube to match the current camera quaternion.
   */
  private syncOrientationControl() {
    const renderer = this._renderer;
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(renderer.camera.quaternion);
    const pos = dir.negate().normalize().multiplyScalar(renderer.orientationControl.cameraDistance);
    renderer.orientationControl.setCameraTransforms(pos, renderer.camera.quaternion);
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
