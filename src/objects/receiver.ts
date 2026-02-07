import * as THREE from "three";
import Container, { ContainerProps, getContainersOfKind } from "./container";
import chroma from "chroma-js";
import { MATCAP_PORCELAIN_WHITE, MATCAP_UNDER_SHADOW } from "./asset-store";
import FileSaver from "file-saver";
import { EditorModes } from "../constants/editor-modes";
import { on } from "../messenger";
import { addContainer, removeContainer, setContainerProperty } from "../store";
import { renderer } from "../render/renderer";
// import { vs, fs } from '../render/shaders/glow';

export enum ReceiverPattern {
  OMNIDIRECTIONAL = 'omni',
  CARDIOID = 'cardioid',
  SUPERCARDIOID = 'supercardioid',
  FIGURE_EIGHT = 'figure8',
}

/** Analytical polar pattern gain for standard microphone types. */
export function receiverPatternGain(pattern: ReceiverPattern, theta: number): number {
  switch (pattern) {
    case ReceiverPattern.OMNIDIRECTIONAL: return 1.0;
    case ReceiverPattern.CARDIOID: return 0.5 + 0.5 * Math.cos(theta);
    case ReceiverPattern.SUPERCARDIOID: return 0.37 + 0.63 * Math.cos(theta);
    case ReceiverPattern.FIGURE_EIGHT: return Math.cos(theta);
    default: return 1.0;
  }
}

export interface ReceiverSaveObject {
  name: string;
  visible: boolean;
  position: number[];
  scale: number[];
  rotation: [number, number, number] | number[];
  uuid: string;
  kind: string;
  color: number;
  directivityPattern?: string;
}

export interface ReceiverProps extends ContainerProps {}

const defaults = {
  color: 0xdd6f6f,
  selectedColor: 0x9fcbff
};

export class Receiver extends Container {
  mesh: THREE.Mesh;
  selectedMaterial: THREE.MeshMatcapMaterial;
  normalMaterial: THREE.MeshMatcapMaterial;
  fdtdSamples: number[];
  directivityPattern: ReceiverPattern = ReceiverPattern.OMNIDIRECTIONAL;
  constructor(name?: string, _props?: ReceiverProps) {
    super(name||"new receiver");
    this.kind = "receiver";
    this.fdtdSamples = [] as number[];

    this.selectedMaterial = new THREE.MeshMatcapMaterial({
      fog: false,
      color: defaults.color,
      matcap: MATCAP_UNDER_SHADOW,
      name: "receiver-selected-material"
    });

    this.normalMaterial = new THREE.MeshMatcapMaterial({
      fog: false,
      color: defaults.color,
      matcap: MATCAP_PORCELAIN_WHITE,
      name: "receiver-material"
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 16), this.normalMaterial);
    this.mesh.userData["kind"] = "receiver";
    this.add(this.mesh);
    this.select = () => {
      if (!this.selected) {
        this.selected = true;
        let brighterColor = chroma((this.mesh.material as THREE.MeshMatcapMaterial).color.getHex())
          .brighten(1)
          .num();
        this.selectedMaterial.color.setHex(brighterColor);
        this.mesh.material = this.selectedMaterial;
      }
    };
    this.deselect = () => {
      if (this.selected) {
        this.selected = false;
        this.mesh.material = this.normalMaterial;
      }
    };
    this.renderCallback = (_time?: number) => {};
    renderer.add(this);
  }
  /**
   * Compute directivity gain for a ray arriving from the given direction.
   * @param arrivalDirection - unit vector [x,y,z] pointing FROM the source/reflection toward the receiver
   * @returns pressure gain factor (-1..1); negative values possible for figure-8 and supercardioid
   */
  getGain(arrivalDirection: [number, number, number]): number {
    if (this.directivityPattern === ReceiverPattern.OMNIDIRECTIONAL) return 1.0;
    const forward = new THREE.Vector3(0, 0, 1).applyEuler(this.rotation);
    const arrival = new THREE.Vector3(arrivalDirection[0], arrivalDirection[1], arrivalDirection[2]);
    const theta = forward.angleTo(arrival);
    return receiverPatternGain(this.directivityPattern, theta);
  }

  dispose(){
    renderer.remove(this);
  }
  save() {
    const name = this.name;
    const visible = this.visible;
    const position = this.position.toArray();
    const scale = this.scale.toArray();
    const rotation = this.rotation.toArray().slice(0, 3) as [number, number, number];
    const color = this.getColorAsNumber();
    const uuid = this.uuid;
    const kind = this.kind;
    const directivityPattern = this.directivityPattern;
    return {
      kind,
      name,
      visible,
      position,
      scale,
      rotation,
      color,
      uuid,
      directivityPattern
    } as ReceiverSaveObject;
  }
  restore(state: ReceiverSaveObject) {
    this.name = state.name;
    this.visible = state.visible;
    this.position.set(state.position[0], state.position[1], state.position[2]);
    this.scale.set(state.scale[0], state.scale[1], state.scale[2]);
    this.rotation.set(
      Number(state.rotation[0]),
      Number(state.rotation[1]),
      Number(state.rotation[2])
    );
    this.color = state.color;
    this.uuid = state.uuid;
    const savedPattern = state.directivityPattern;
    if (savedPattern && Object.values(ReceiverPattern).includes(savedPattern as ReceiverPattern)) {
      this.directivityPattern = savedPattern as ReceiverPattern;
    } else {
      this.directivityPattern = ReceiverPattern.OMNIDIRECTIONAL;
    }
    return this;
  }
  clearSamples() {
    this.fdtdSamples = [] as number[];
  }
  saveSamples() {
    if (this.fdtdSamples.length > 0) {
      const blob = new Blob([this.fdtdSamples.join("\n")], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, `fdtdsamples-receiver-${this.name}.txt`);
    } else return;
  }

  getColorAsNumber() {
    return (this.mesh.material as THREE.MeshBasicMaterial).color.getHex();
  }
  getColorAsString() {
    return String.fromCharCode(35) + (this.mesh.material as THREE.MeshBasicMaterial).color.getHexString();
  }
  onModeChange(mode: EditorModes) {
    switch (mode) {
      case EditorModes.OBJECT:
        break;
      case EditorModes.SKETCH:
        break;
      case EditorModes.EDIT:
        break;
      default:
        break;
    }
  }
  get color() {
    return String.fromCharCode(35) + (this.mesh.material as THREE.MeshBasicMaterial).color.getHexString();
  }
  set color(col: string | number) {
    if (typeof col === "string") {
      (this.mesh.material as THREE.MeshMatcapMaterial).color.setStyle(col);
      (this.normalMaterial as THREE.MeshMatcapMaterial).color.setStyle(col);
      (this.selectedMaterial as THREE.MeshMatcapMaterial).color.setStyle(col);
    } else {
      (this.mesh.material as THREE.MeshMatcapMaterial).color.setHex(col);
      (this.normalMaterial as THREE.MeshMatcapMaterial).color.setHex(col);
      (this.selectedMaterial as THREE.MeshMatcapMaterial).color.setHex(col);
    }
  }
  get brief() {
    return {
      uuid: this.uuid,
      name: this.name,
      selected: this.selected,
      kind: this.kind,
      children: []
    };
  }
}



// this allows for nice type checking with 'on' and 'emit' from messenger
declare global {
  interface EventTypes {
    ADD_RECEIVER: Receiver | undefined;
    RECEIVER_SET_PROPERTY: SetPropertyPayload<Receiver>;
    REMOVE_RECEIVER: string;
  }
}

on("ADD_RECEIVER", addContainer(Receiver))
on("REMOVE_RECEIVER", removeContainer);
on("RECEIVER_SET_PROPERTY", setContainerProperty);

export const getReceivers = () => getContainersOfKind<Receiver>("receiver");


export default Receiver;