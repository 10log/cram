import { default as Container } from '../../objects/container';
import * as THREE from "three";
export default class Lights extends Container {
    constructor(name?: string);
    setHelpersVisible(visible: boolean): void;
    get ambientLights(): THREE.Object3D<THREE.Object3DEventMap>;
    get geometryLights(): THREE.Object3D<THREE.Object3DEventMap>;
    get helpers(): THREE.Object3D<THREE.Object3DEventMap>;
}
