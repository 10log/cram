import { Font } from '../../../node_modules/@types/three/examples/jsm/loaders/FontLoader.js';
import { default as PickHelper } from '../pick-helper';
import { default as Container } from '../../objects/container';
import * as THREE from 'three';
export declare enum OrientationControlTargets {
    TOP = "top",
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right",
    FRONT = "front",
    BACK = "back",
    TOP_FROM_FRONT = "top-from-front",
    TOP_FROM_RIGHT = "top-from-right",
    TOP_FROM_BACK = "top-from-back",
    TOP_FROM_LEFT = "top-from-left",
    BOTTOM_FROM_FRONT = "bottom-from-front",
    BOTTOM_FROM_RIGHT = "bottom-from-right",
    BOTTOM_FROM_BACK = "bottom-from-back",
    BOTTOM_FROM_LEFT = "bottom-from-left"
}
export declare const OrientationAxisAdds: {
    right: THREE.Vector3;
    left: THREE.Vector3;
    back: THREE.Vector3;
    front: THREE.Vector3;
    top: THREE.Vector3;
    bottom: THREE.Vector3;
    "top-from-front": THREE.Vector3;
    "top-from-right": THREE.Vector3;
    "top-from-back": THREE.Vector3;
    "top-from-left": THREE.Vector3;
    "bottom-from-front": THREE.Vector3;
    "bottom-from-right": THREE.Vector3;
    "bottom-from-back": THREE.Vector3;
    "bottom-from-left": THREE.Vector3;
};
export declare const OrientationAxisQuats: {
    right: THREE.Quaternion;
    left: THREE.Quaternion;
    back: THREE.Quaternion;
    front: THREE.Quaternion;
    top: THREE.Quaternion;
    bottom: THREE.Quaternion;
    "top-from-front": THREE.Quaternion;
    "top-from-right": THREE.Quaternion;
    "top-from-back": THREE.Quaternion;
    "top-from-left": THREE.Quaternion;
    "bottom-from-front": THREE.Quaternion;
    "bottom-from-right": THREE.Quaternion;
    "bottom-from-back": THREE.Quaternion;
    "bottom-from-left": THREE.Quaternion;
};
export interface OrientationControlClickEvent {
    target: OrientationControlTargets;
}
export interface OrientationControlOptions {
    width?: number;
    height?: number;
    axis?: OrientationControlTargets | "none";
}
export declare class OrientationControl {
    width: number;
    height: number;
    pickHelper: PickHelper;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    cube: Container;
    element: HTMLElement;
    pointLight: THREE.PointLight;
    ambientLight: THREE.AmbientLight;
    renderer: THREE.WebGLRenderer;
    font: Font;
    fontMaterial: THREE.MeshBasicMaterial;
    edges: THREE.LineSegments;
    fontMeshes: {
        top: THREE.Mesh;
        bottom: THREE.Mesh;
        left: THREE.Mesh;
        right: THREE.Mesh;
        front: THREE.Mesh;
        back: THREE.Mesh;
    };
    surfaceMeshes: {
        top: THREE.Mesh;
        bottom: THREE.Mesh;
        left: THREE.Mesh;
        right: THREE.Mesh;
        front: THREE.Mesh;
        back: THREE.Mesh;
    };
    pickPosition: THREE.Vector2;
    raycaster: THREE.Raycaster;
    _hoveredPlane: THREE.Mesh | undefined;
    shouldRender: boolean;
    cameraDistance: number;
    clickListeners: Map<string, (e: OrientationControlClickEvent) => void>;
    _axis: OrientationControlTargets | "none";
    helperArrows: {
        top: HTMLElement;
        bottom: HTMLElement;
        left: HTMLElement;
        right: HTMLElement;
        rotateLeft: HTMLElement;
        rotateRight: HTMLElement;
    };
    constructor(selector: string, opts?: OrientationControlOptions);
    setCameraTransforms(position: THREE.Vector3, quaternion: THREE.Quaternion): void;
    showHelperArrows(arrows: string[]): void;
    hideHelperArrows(): void;
    hide(): void;
    show(): void;
    addClickListener(listener: (e: OrientationControlClickEvent) => void): string;
    removeClickListener(id: string): void;
    createPlaneMesh(size: number, materialParams: THREE.MeshLambertMaterialParameters): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshLambertMaterial, THREE.Object3DEventMap>;
    getMeshFromText(text: string): THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
    setPickPosition(event: any, mount: any): void;
    setPickPositionCenter(mount: any): void;
    getCanvasRelativePosition(event: any, mount: any): {
        x: number;
        y: number;
    };
    clearPickPosition(): void;
    save(): {
        axis: "none" | OrientationControlTargets;
        width: number;
        height: number;
    };
    render(): void;
    get axis(): OrientationControlTargets | "none";
    set axis(axis: OrientationControlTargets | "none");
    get hoveredPlane(): THREE.Mesh | undefined;
    set hoveredPlane(plane: THREE.Mesh | undefined);
}
