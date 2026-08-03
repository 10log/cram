import { default as Solver, SolverParams } from '../solver';
import { default as Room } from '../../objects/room';
export interface ARTProps extends SolverParams {
    roomID?: string;
    sourceIDs?: string[];
    receiverIDs?: string[];
    maxEdgeLength?: number;
    brdfDetail?: number;
    raysPerShoot?: number;
    maxIterations?: number;
    convergenceThreshold?: number;
    sampleRate?: number;
}
export type ARTSaveObject = {
    uuid: string;
    name: string;
    kind: string;
    autoCalculate: boolean;
    roomID?: string;
    sourceIDs?: string[];
    receiverIDs?: string[];
    maxEdgeLength?: number;
    brdfDetail?: number;
    raysPerShoot?: number;
    maxIterations?: number;
    convergenceThreshold?: number;
    sampleRate?: number;
};
export declare class ART extends Solver {
    uuid: string;
    roomID: string;
    sourceIDs: string[];
    receiverIDs: string[];
    /** Tessellation patch size in meters */
    maxEdgeLength: number;
    /** Icosahedron subdivision level (0=6 bins, 1=~18 bins, 2=~66 bins) */
    brdfDetail: number;
    /** Rays per shooting iteration */
    raysPerShoot: number;
    /** Maximum shooting iterations */
    maxIterations: number;
    /** Stop when unshot/initial < threshold */
    convergenceThreshold: number;
    /** Internal temporal sample rate in Hz */
    sampleRate: number;
    /** Octave band center frequencies to compute */
    frequencies: number[];
    /** Initial source energy */
    initialEnergy: number;
    /** Number of rays for source injection */
    sourceRays: number;
    /** Iteration count from last calculation */
    lastIterationCount: number;
    /** Patch count from last calculation */
    lastPatchCount: number;
    /** Whether any results have been emitted */
    hasEmittedResults: boolean;
    constructor(props?: ARTProps);
    calculate(): void;
    save(): ARTSaveObject;
    restore(state: ARTSaveObject): this;
    get rooms(): Room[];
    get temperature(): number;
    get room(): Room;
    get noResults(): boolean;
}
export default ART;
declare global {
    interface EventTypes {
        ADD_ART: ART | undefined;
        REMOVE_ART: string;
        ART_SET_PROPERTY: {
            uuid: string;
            property: keyof ART;
            value: ART[EventTypes["ART_SET_PROPERTY"]["property"]];
        };
        CALCULATE_ART: string;
    }
}
