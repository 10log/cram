import { default as Container, ContainerProps } from './container';
import { default as Surface, SurfaceSaveObject } from './surface';
import { UNITS } from '../enums/units';
import { KVP } from '../common/key-value-pair';
import * as THREE from "three";
export interface RoomProps extends ContainerProps {
    surfaces: (Surface | Container)[];
    originalFileName?: string;
    originalFileData?: string;
    units?: UNITS;
    temperature?: number;
    humidity?: number;
}
export interface RoomSaveObject {
    kind: string;
    surfaces: SurfaceSaveObject[];
    originalFileName: string;
    originalFileData: string;
    units: UNITS;
    uuid: string;
    name: string;
    visible: boolean;
    position: number[];
    rotation: number[];
    scale: number[];
    temperature?: number;
    humidity?: number;
}
export declare class Room extends Container {
    boundingBox: THREE.Box3;
    surfaces: Container;
    volume: number;
    units: UNITS;
    originalFileName: string;
    originalFileData: string;
    surfaceMap: KVP<Surface>;
    temperature: number;
    humidity: number;
    constructor(name?: string, props?: RoomProps);
    init(props: RoomProps, fromConstructor?: boolean): void;
    dispose(): void;
    save(): RoomSaveObject;
    restore(state: RoomSaveObject): this;
    static from(saveObject: RoomSaveObject): Room;
    select(): void;
    deselect(): void;
    calculateBoundingBox(): THREE.Box3;
    signedVolumeOfTriangle(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number;
    volumeOfMesh(): number;
    calculateMeanAbsorptionCoefficientFromHits(frequencies?: number[]): {
        meanAbsorption: any[];
        totalHits: number;
    };
    calculateRT60FromHits(frequencies?: number[]): any[][];
    tessellateSurfaces(maxEdgeLength?: number, maxIterations?: number): void;
    /**
     * an array surfaces that make up this room
     */
    get allSurfaces(): Surface[];
    get brief(): {
        uuid: string;
        name: string;
        selected: boolean;
        children: {
            uuid: string;
            name: string;
            selected: boolean;
            kind: string;
            children: never[];
        }[];
        kind: string;
    };
}
declare global {
    interface EventTypes {
        ADD_ROOM: Room | undefined;
        ROOM_SET_PROPERTY: SetPropertyPayload<Room>;
        REMOVE_ROOM: string;
    }
}
export declare const getRooms: () => Room[];
export default Room;
