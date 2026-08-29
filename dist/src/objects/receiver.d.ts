import { default as Container, ContainerProps } from './container';
import { EditorModes } from '../constants/editor-modes';
import * as THREE from "three";
export declare enum ReceiverPattern {
    OMNIDIRECTIONAL = "omni",
    CARDIOID = "cardioid",
    SUPERCARDIOID = "supercardioid",
    FIGURE_EIGHT = "figure8"
}
/** Analytical polar pattern gain for standard microphone types. */
export declare function receiverPatternGain(pattern: ReceiverPattern, theta: number): number;
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
export interface ReceiverProps extends ContainerProps {
}
export declare class Receiver extends Container {
    mesh: THREE.Mesh;
    selectedMaterial: THREE.MeshMatcapMaterial;
    normalMaterial: THREE.MeshMatcapMaterial;
    fdtdSamples: number[];
    fdtdSampleRate?: number;
    directivityPattern: ReceiverPattern;
    constructor(name?: string, _props?: ReceiverProps);
    /**
     * Compute directivity gain for a ray arriving from the given direction.
     * @param arrivalDirection - unit vector [x,y,z] pointing FROM the receiver
     *   TOWARD the last bounce / source (looking-back). A cardioid looking +Z
     *   peaks when this vector is +Z. Specular raytracer paths already store
     *   this (`rd.negate()`); diffracted paths must too.
     * @returns pressure gain factor (-1..1); negative values possible for figure-8 and supercardioid
     */
    getGain(arrivalDirection: [number, number, number]): number;
    dispose(): void;
    save(): ReceiverSaveObject;
    restore(state: ReceiverSaveObject): this;
    clearSamples(): void;
    saveSamples(): void;
    getColorAsNumber(): number;
    getColorAsString(): string;
    onModeChange(mode: EditorModes): void;
    get color(): string | number;
    set color(col: string | number);
    get brief(): {
        uuid: string;
        name: string;
        selected: boolean;
        kind: string;
        children: never[];
    };
}
declare global {
    interface EventTypes {
        ADD_RECEIVER: Receiver | undefined;
        RECEIVER_SET_PROPERTY: SetPropertyPayload<Receiver>;
        REMOVE_RECEIVER: string;
    }
}
export declare const getReceivers: () => Receiver[];
export default Receiver;
