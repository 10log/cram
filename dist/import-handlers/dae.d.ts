/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 * modified by Greg Zanchelli https://gihub.com/gregzanch
 */
import * as THREE from "three";
export declare class DAELoader extends THREE.Loader {
    load(url: any, onLoad: any, onProgress: any, onError: any): void;
    parse(text: any, path: any): {
        scene: THREE.Scene<THREE.Object3DEventMap>;
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
}
