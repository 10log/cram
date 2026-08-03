import { default as Container } from './container';
import * as THREE from 'three';
export interface ConstructionAxisProps {
    /** starting point */
    p0: THREE.Vector3;
    /** ending point */
    p1: THREE.Vector3;
    /** axis color */
    color?: number;
}
declare class ConstructionAxis extends Container {
    line: THREE.Line;
    constructor(name: string, props: ConstructionAxisProps);
    select(): void;
    deselect(): void;
}
export { ConstructionAxis };
export default ConstructionAxis;
