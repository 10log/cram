import { default as Container, ContainerProps } from './container';
import * as THREE from "three";
export interface ModelProps extends ContainerProps {
    bufferGeometry: THREE.BufferGeometry;
}
export interface ModelSaveObject {
    kind: string;
    uuid: string;
    name: string;
    visible: boolean;
    position: number[];
    rotation: number[];
    scale: number[];
}
export default class Model extends Container {
    boundingBox: THREE.Box3;
    volume: number;
    mesh: THREE.Mesh;
    constructor(name: string, props: ModelProps);
    init(props: ModelProps, _fromConstructor?: boolean): void;
    get vertexBuffer(): THREE.BufferAttribute<THREE.BufferAttributeEventMap> | THREE.InterleavedBufferAttribute;
    setVertexPosition(index: number, x: number, y: number, z: number): void;
    save(): ModelSaveObject;
    restore(state: ModelSaveObject): this;
    select(): void;
    deselect(): void;
    calculateBoundingBox(): void;
    signedVolumeOfTriangle(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number;
    volumeOfMesh(): void;
    get brief(): {
        uuid: string;
        name: string;
        selected: boolean;
        children: never[];
        kind: string;
    };
}
