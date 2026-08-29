import { default as Room } from '../../objects/room';
import { EdgeGraph } from '../shared/diffraction';
import { BeamTracePath } from './paths';
import * as THREE from "three";
export interface DiffractionComputeParams {
    room: Room;
    sourceId: string;
    receiverId: string;
    frequencies: number[];
    speedOfSound: number;
    temperature: number;
    containers: Record<string, unknown>;
    raycaster: THREE.Raycaster;
}
export interface DiffractionComputeResult {
    paths: BeamTracePath[];
    edgeGraph: EdgeGraph;
}
/**
 * First-order UTD edge diffraction paths for the active source/receiver pair.
 * Directivity is folded into bandEnergy here so calculateArrivalPressure
 * does not re-apply it on the diffraction branch.
 */
export declare function computeDiffractionPaths(params: DiffractionComputeParams): DiffractionComputeResult;
