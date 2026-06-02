import { default as Container } from '../../objects/container';
import * as THREE from "three";
export interface AxesProps {
    Xaxis?: boolean;
    Yaxis?: boolean;
    Zaxis?: boolean;
}
export default class Axes extends Container {
    Xaxis: THREE.Line;
    Yaxis: THREE.Line;
    Zaxis: THREE.Line;
    constructor(name?: string, props?: AxesProps);
    makeLine(start: THREE.Vector3, end: THREE.Vector3): THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>;
}
