import * as THREE from "three";
export interface Model {
    name: string;
    geometry: THREE.BufferGeometry;
}
export declare function tds(data: ArrayBuffer): THREE.Group<THREE.Object3DEventMap>;
export declare function stl2(data: ArrayBuffer | string): THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>;
export declare function stl(data: ArrayBuffer | string): Model[];
export declare function obj(data: string): Model[];
export declare function tga(data: ArrayBuffer): HTMLCanvasElement | ImageBitmap;
export declare function dae(data: string): {
    scene: THREE.Scene;
    animations?: undefined;
    kinematics?: undefined;
    library?: undefined;
} | {
    animations: any[];
    kinematics: any;
    library: {
        animations: {};
        clips: {};
        controllers: {};
        images: {};
        effects: {};
        materials: {};
        cameras: {};
        lights: {};
        geometries: {};
        nodes: {};
        visualScenes: {};
        kinematicsModels: {};
        physicsModels: {};
        kinematicsScenes: {};
    };
    scene: any;
} | null;
export { dxf } from './dxf';
export declare function gltf(data: ArrayBuffer): Promise<Model[]>;
