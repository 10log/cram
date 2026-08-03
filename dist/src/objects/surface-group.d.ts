import { default as Surface } from './surface';
import { EditorModes } from '../constants';
import { default as Container } from './container';
type UserData = {
    [key: string]: any;
};
export interface SurfaceGroupSaveObject {
    name: string;
    visible: boolean;
    position: number[];
    scale: number[];
    rotation: [number, number, number] | number[];
    uuid: string;
    kind: string;
}
export interface SurfaceGroupProps {
    userData?: UserData;
    type?: string;
    children?: Array<Surface | SurfaceGroup>;
}
export default class SurfaceGroup extends Container {
    kind: string;
    selected: boolean;
    renderCallback: (time?: number) => void;
    constructor(name: string, props?: SurfaceGroupProps);
    save(): SurfaceGroupSaveObject;
    restore(state: SurfaceGroupSaveObject): this;
    onModeChange(_mode: EditorModes): void;
    select(): void;
    deselect(): void;
    selectChildren(): void;
    deselectChildren(): void;
    addSurface(surface: Surface): void;
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
export {};
