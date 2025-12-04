import { Object3D, Camera } from "three";

export class TransformControls {
  constructor(camera: Camera, domElement?: HTMLElement | null);

  // API

  camera: Camera;
  object: Object3D | undefined;
  allAssociatedObjects: Object3D[] | undefined;
  enabled: boolean;
  axis: string | null;
  mode: "translate" | "rotate" | "scale";
  translationSnap: number | null;
  rotationSnap: number | null;
  scaleSnap: number | null;
  space: "world" | "local";
  size: number;
  dragging: boolean;
  showX: boolean;
  showY: boolean;
  showZ: boolean;
  isTransformControls: boolean;

  readonly _root: Object3D;

  attach(objects: Object3D | Object3D[]): this;
  detach(): this;
  getMode(): "translate" | "rotate" | "scale";
  setMode(mode: "translate" | "rotate" | "scale"): void;
  setTranslationSnap(translationSnap: number | null): void;
  setRotationSnap(rotationSnap: number | null): void;
  setScaleSnap(scaleSnap: number | null): void;
  setSize(size: number): void;
  setSpace(space: "world" | "local"): void;
  reset(): void;
  dispose(): void;
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
  dispatchEvent(event: { type: string; [key: string]: any }): void;
}

export class TransformControlsGizmo extends Object3D {
  isTransformControlsGizmo: boolean;
  type: "TransformControlsGizmo";
}

export class TransformControlsPlane extends Object3D {
  isTransformControlsPlane: boolean;
  type: "TransformControlsPlane";
}
