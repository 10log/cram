/**
 * Floorplan drawing tool — pointer plumbing and preview geometry.
 *
 * Deliberately holds no rules of its own. Where a click lands, whether it
 * closes the loop, and what the preview polyline should be all come from
 * compute/geometry/sketch-input.ts; this turns pointer events into ground-plane
 * coordinates, feeds them in, and draws the result.
 *
 * Dependencies are injected rather than taken from the renderer singleton, so
 * the tool can be constructed against a plain camera and element in a test.
 *
 * CRAM is Z-up: the drawing plane is XY at `baseZ`.
 */

import * as THREE from 'three';

import {
  DEFAULT_SNAP,
  addPoint,
  closeDraft,
  emptyDraft,
  moveCursor,
  previewPath,
  undoLastPoint,
  type SketchDraft,
  type SnapSettings,
} from '../compute/geometry/sketch-input';
import type { Point2 } from '../compute/geometry/floorplan';

export interface FloorplanToolOptions {
  domElement: HTMLElement;
  camera: THREE.Camera;
  /** Where preview objects are parented — typically the renderer's overlay group. */
  parent: THREE.Object3D;
  /** Elevation of the drawing plane. Defaults to 0. */
  baseZ?: number;
  settings?: Partial<SnapSettings>;
  /** Called whenever the draft changes, for panel UI and re-rendering. */
  onChange?: (draft: SketchDraft) => void;
  /** Called once the outline closes. */
  onClose?: (draft: SketchDraft) => void;
}

const LINE_COLOR = 0xffc32a;
const MARKER_COLOR = 0xffffff;

/**
 * Reject rays grazing the ground plane.
 *
 * Exact parallelism is rare in floating point: a camera orbited to near ground
 * level leaves a denominator around 1e-16, and the resulting "intersection"
 * lands astronomically far away rather than reporting a miss. Anything this
 * shallow is unusable for drawing, so treat it as no hit.
 */
const MIN_RAY_PLANE_COS = 1e-6;

/** Whether an event came from somewhere the user is typing. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

export class FloorplanTool {
  private readonly domElement: HTMLElement;
  private readonly camera: THREE.Camera;
  private readonly parent: THREE.Object3D;
  private readonly baseZ: number;
  private readonly plane: THREE.Plane;
  private readonly raycaster = new THREE.Raycaster();

  private settings: SnapSettings;
  private onChangeCallback?: (draft: SketchDraft) => void;
  private onCloseCallback?: (draft: SketchDraft) => void;

  private _draft: SketchDraft = emptyDraft();
  private _enabled = false;

  readonly group = new THREE.Group();
  private readonly line: THREE.Line;
  private readonly markers: THREE.Points;

  constructor(options: FloorplanToolOptions) {
    this.domElement = options.domElement;
    this.camera = options.camera;
    this.parent = options.parent;
    this.baseZ = options.baseZ ?? 0;
    this.settings = { ...DEFAULT_SNAP, ...options.settings };
    this.onChangeCallback = options.onChange;
    this.onCloseCallback = options.onClose;

    // Plane form is normal·p + constant = 0, so z = baseZ means constant = -baseZ.
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -this.baseZ);

    this.group.name = 'floorplan-tool-preview';
    this.group.visible = false;

    this.line = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: LINE_COLOR, depthTest: false, fog: false })
    );
    this.line.renderOrder = 999;
    this.line.frustumCulled = false;

    this.markers = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.PointsMaterial({
        color: MARKER_COLOR,
        size: 6,
        sizeAttenuation: false,
        depthTest: false,
        fog: false,
      })
    );
    this.markers.renderOrder = 1000;
    this.markers.frustumCulled = false;

    this.group.add(this.line, this.markers);
    this.parent.add(this.group);
  }

  get draft(): SketchDraft {
    return this._draft;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  enable(): void {
    if (this._enabled) return;
    this._enabled = true;
    this.group.visible = true;
    this.domElement.addEventListener('pointerdown', this.handlePointerDown);
    this.domElement.addEventListener('pointermove', this.handlePointerMove);
    this.domElement.addEventListener('pointerleave', this.handlePointerLeave);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  disable(): void {
    if (!this._enabled) return;
    this._enabled = false;
    this.group.visible = false;
    this.domElement.removeEventListener('pointerdown', this.handlePointerDown);
    this.domElement.removeEventListener('pointermove', this.handlePointerMove);
    this.domElement.removeEventListener('pointerleave', this.handlePointerLeave);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  setSettings(settings: Partial<SnapSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  getSettings(): SnapSettings {
    return { ...this.settings };
  }

  /** Discard the outline in progress. */
  reset(): void {
    this.commit(emptyDraft());
  }

  /**
   * Replace the draft outright — for numeric entry, where the panel edits a
   * point's coordinates directly rather than by clicking.
   */
  setDraft(draft: SketchDraft): void {
    this.commit(draft);
  }

  /** Close the outline explicitly, as a button or Enter would. */
  close(): void {
    this.commit(closeDraft(this._draft));
  }

  /** Step back one point, or reopen a closed outline. */
  undo(): void {
    this.commit(undoLastPoint(this._draft));
  }

  /**
   * Project a pointer position onto the drawing plane.
   *
   * @returns null when the ray misses — the camera can be below or parallel to
   *          the ground plane, and a miss must not be reported as the origin.
   */
  screenToGround(event: { clientX: number; clientY: number }): Point2 | null {
    const rect = this.domElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    const ndc = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(ndc, this.camera);

    const ray = this.raycaster.ray;
    if (Math.abs(ray.direction.dot(this.plane.normal)) < MIN_RAY_PLANE_COS) return null;

    const hit = ray.intersectPlane(this.plane, new THREE.Vector3());
    return hit ? { x: hit.x, y: hit.y } : null;
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    const ground = this.screenToGround(event);
    if (!ground) return;
    this.commit(addPoint(this._draft, ground, this.settings));
  };

  private handlePointerMove = (event: PointerEvent): void => {
    const ground = this.screenToGround(event);
    this.commit(moveCursor(this._draft, ground, this.settings));
  };

  private handlePointerLeave = (): void => {
    this.commit(moveCursor(this._draft, null, this.settings));
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    // The listener is on window so shortcuts work with the viewport focused,
    // which also puts it in front of every form field. Without this guard,
    // backspacing a digit out of a coordinate input would delete a sketch
    // point instead of editing the number.
    if (isEditableTarget(event.target)) return;

    switch (event.key) {
      case 'Escape':
        this.reset();
        break;
      case 'Enter':
        this.close();
        break;
      case 'Backspace':
      case 'Delete':
        event.preventDefault();
        this.undo();
        break;
      default:
        return;
    }
  };

  /** Adopt a new draft, refresh the preview, and notify listeners if it changed. */
  private commit(next: SketchDraft): void {
    if (next === this._draft) return;

    const wasClosed = this._draft.closed;
    this._draft = next;
    this.refreshPreview();
    this.onChangeCallback?.(next);
    if (!wasClosed && next.closed) this.onCloseCallback?.(next);
  }

  private refreshPreview(): void {
    const path = previewPath(this._draft);
    const linePositions = new Float32Array(path.length * 3);
    path.forEach((p, i) => {
      linePositions[i * 3] = p.x;
      linePositions[i * 3 + 1] = p.y;
      linePositions[i * 3 + 2] = this.baseZ;
    });
    this.line.geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this.line.geometry.setDrawRange(0, path.length);
    this.line.geometry.computeBoundingSphere();

    const committed = this._draft.points;
    const markerPositions = new Float32Array(committed.length * 3);
    committed.forEach((p, i) => {
      markerPositions[i * 3] = p.x;
      markerPositions[i * 3 + 1] = p.y;
      markerPositions[i * 3 + 2] = this.baseZ;
    });
    this.markers.geometry.setAttribute('position', new THREE.BufferAttribute(markerPositions, 3));
    this.markers.geometry.setDrawRange(0, committed.length);
    this.markers.geometry.computeBoundingSphere();
  }

  dispose(): void {
    this.disable();
    this.parent.remove(this.group);
    this.line.geometry.dispose();
    (this.line.material as THREE.Material).dispose();
    this.markers.geometry.dispose();
    (this.markers.material as THREE.Material).dispose();
    this.onChangeCallback = undefined;
    this.onCloseCallback = undefined;
  }
}

export default FloorplanTool;
