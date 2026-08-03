import { default as Container } from '../objects/container';
import * as THREE from "three";
export default class PickHelper {
    pickPosition: THREE.Vector2;
    raycaster: THREE.Raycaster;
    pickedObject: any;
    pickedPoint: THREE.Vector3;
    pickedObjectSavedColor: number;
    hover: null;
    scene: any;
    camera: any;
    objects: Container[];
    mount: any;
    __pickedObject: any;
    __pickedPoint: any;
    constructor(scene: THREE.Scene, camera: THREE.Camera, mount: HTMLElement);
    pick(event: MouseEvent, objects?: Container[], _scene?: any, _camera?: any, mount?: any): {
        clickedOnTransformControl: boolean;
        clickedOnSourceReceiver: boolean;
        pickedObject: any;
    };
    getPickedPoint(): number[];
    pickOnce(event: MouseEvent, scene: THREE.Scene, camera: THREE.Camera, mount: HTMLElement): any;
    pickCenter(scene: THREE.Scene, camera: THREE.Camera, mount: HTMLElement): any;
    setPickPosition(event: MouseEvent, mount: HTMLElement): void;
    setPickPositionCenter(mount: HTMLElement): void;
    getCanvasRelativePosition(event: MouseEvent, mount: HTMLElement): {
        x: number;
        y: number;
    };
    clearPickPosition(): void;
    updateCamera(camera: THREE.Camera): void;
}
