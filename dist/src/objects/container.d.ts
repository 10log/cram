import { EditorModes } from '../constants';
import * as THREE from "three";
type UserData = {
    [key: string]: any;
};
export interface ContainerSaveObject {
    name: string;
    visible: boolean;
    position: number[];
    scale: number[];
    rotation: [number, number, number] | number[];
    uuid: string;
    kind: string;
    children?: Array<ContainerSaveObject>;
}
export interface ContainerProps {
    userData?: UserData;
    type?: string;
    children?: Array<THREE.Object3D | Container | THREE.Group>;
}
export default class Container extends THREE.Group {
    kind: string;
    selected: boolean;
    renderCallback: (time?: number) => void;
    constructor(name: string, props?: ContainerProps);
    save(): ContainerSaveObject;
    restore(state: ContainerSaveObject): this;
    dispose(): void;
    onModeChange(_mode: EditorModes): void;
    select(): void;
    deselect(): void;
    selectChildren(): void;
    deselectChildren(): void;
    traverse(callback: (obj: Container, depth: number) => void, depth?: number): void;
    traverseVisible(callback: (obj: Container, depth: number) => void, depth?: number): void;
    get x(): number;
    set x(val: number);
    get y(): number;
    set y(val: number);
    get z(): number;
    set z(val: number);
    get scalex(): number;
    set scalex(val: number);
    get scaley(): number;
    set scaley(val: number);
    get scalez(): number;
    set scalez(val: number);
    get rotationx(): number;
    set rotationx(val: number);
    get rotationy(): number;
    set rotationy(val: number);
    get rotationz(): number;
    set rotationz(val: number);
}
export declare const getContainersOfKind: <T extends Container>(kind: T["kind"]) => T[];
export {};
