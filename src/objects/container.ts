import * as THREE from "three";
import { EditorModes } from "../constants";
import { useContainer } from "../store";
import { filterObjectToArray } from "../common/helpers";





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
  children?: Array<ContainerSaveObject>
}

export interface ContainerProps {
  userData?: UserData;
  type?: string;
  children?: Array<THREE.Object3D | Container | THREE.Group>;
}

export default class Container extends THREE.Group {
  kind: string;
  selected: boolean;
  renderCallback!: (time?: number) => void;
  constructor(name: string, props?: ContainerProps) {
    super();
    this.name = name;
    this.kind = "container";
    props &&
      (() => {
        for (const key in props) {
          (this as Record<string, unknown>)[key] = (props as Record<string, unknown>)[key];
        }
      })();
    this.selected = false;
    this.renderCallback = () => {};
  }
  save(): ContainerSaveObject {
    return {
      kind: this.kind,
      visible: this.visible,
      name: this.name,
      position: this.position.toArray(),
      rotation: this.rotation.toArray().slice(0, 3) as [number, number, number],
      scale: this.scale.toArray(),
      uuid: this.uuid,
      children: this.children.reduce((acc: ContainerSaveObject[], curr) => {
        const child = curr as Container;
        return typeof child.save === "function" ? [...acc, child.save()] : acc;
      }, [] as ContainerSaveObject[])
    };
  }
  restore(state: ContainerSaveObject) {
    this.visible = state.visible;
    this.name = state.name;
    this.position.fromArray(state.position);
    this.rotation.fromArray(state.rotation as [number, number, number]);
    this.scale.fromArray(state.scale);
    this.uuid = state.uuid;
    return this;
  }
  dispose() {}
  onModeChange(_mode: EditorModes) {}
  select() {
    this.selectChildren();
    this.selected = true;
  }
  deselect() {
    this.deselectChildren();
    this.selected = false;
  }
  selectChildren() {
    (this.children.filter(x=>x instanceof Container) as Container[]).forEach((x) => x.select());
  }
  deselectChildren() {
    (this.children.filter(x=>x instanceof Container) as Container[]).forEach((x) => x.deselect());
  }

  traverse(callback: (obj: Container, depth: number) => void, depth = 0) {
    callback(this, depth);
    var children = this.children;

    for (var i = 0, l = children.length; i < l; i++) {
      const child = children[i] as Container;
      if (child.traverse) {
        child.traverse(callback, depth + 1);
      }
    }
  }

  traverseVisible(callback: (obj: Container, depth: number) => void, depth = 0) {
    if (this.visible === false) return;
    callback(this, depth);
    var children = this.children;

    for (var i = 0, l = children.length; i < l; i++) {
      const child = children[i] as Container;
      if (child.traverseVisible) {
        child.traverseVisible(callback, depth + 1);
      }
    }
  }

  get x() {
    return this.position.x;
  }
  set x(val) {
    this.position.setX(val);
  }
  get y() {
    return this.position.y;
  }
  set y(val) {
    this.position.setY(val);
  }
  get z() {
    return this.position.z;
  }
  set z(val) {
    this.position.setZ(val);
  }

  get scalex() {
    return this.scale.x;
  }
  set scalex(val) {
    this.scale.setX(val);
  }
  get scaley() {
    return this.scale.y;
  }
  set scaley(val) {
    this.scale.setY(val);
  }
  get scalez() {
    return this.scale.z;
  }
  set scalez(val) {
    this.scale.setZ(val);
  }

  get rotationx() {
    return this.rotation.x;
  }
  set rotationx(val) {
    this.rotation.x = val;
  }
  get rotationy() {
    return this.rotation.y;
  }
  set rotationy(val) {
    this.rotation.y = val;
  }
  get rotationz() {
    return this.rotation.z;
  }
  set rotationz(val) {
    this.rotation.z = val;
  }
}



export const getContainersOfKind = <T extends Container>(kind: T["kind"]) => filterObjectToArray(
  useContainer.getState().containers, 
  (container) => container.kind === kind
) as T[];