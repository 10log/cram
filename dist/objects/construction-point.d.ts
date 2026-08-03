import { default as Container } from './container';
import * as THREE from 'three';
export interface ConstructionPointProps {
    /** point vector */
    point: THREE.Vector3;
}
declare class ConstructionPoint extends Container {
    point: THREE.Points;
    constructor(name: string, props: ConstructionPointProps);
    select(): void;
    deselect(): void;
}
export { ConstructionPoint };
export default ConstructionPoint;
