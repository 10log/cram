import { default as Solver, SolverParams } from './solver';
import { default as Room } from '../objects/room';
import * as THREE from 'three';
export interface GLFDTDParams extends SolverParams {
    dx: number;
    length: number;
    width: number;
    height: number;
    dt: number;
    room: Room;
}
export default class GLFDTD extends Solver {
    length: number;
    width: number;
    height: number;
    dx: number;
    dt: number;
    t: number;
    step: number;
    m: number;
    nx: number;
    ny: number;
    nz: number;
    mesh: THREE.Mesh;
    texture1: THREE.Data3DTexture;
    texture2: THREE.Data3DTexture;
    room: Room;
    constructor(params: GLFDTDParams);
    reset(): void;
    init(): void;
}
