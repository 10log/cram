import { default as Container } from './container';
import * as THREE from 'three';
export interface ConstructionPlaneProps {
    normal: THREE.Vector3;
    point: THREE.Vector3;
    width?: number;
    height?: number;
}
declare class ConstructionPlane extends Container {
    mesh: THREE.Mesh;
    constructor(name: string, props: ConstructionPlaneProps);
    select(): void;
    deselect(): void;
}
export { ConstructionPlane };
export default ConstructionPlane;
