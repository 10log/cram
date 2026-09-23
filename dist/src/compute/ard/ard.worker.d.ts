import { ArdSimulationConfig } from './simulation';
export {};
export type ArdWorkerRequest = {
    type: 'start';
    /** Everything `createArdSimulation` needs. Structured-cloneable only. */
    config: Omit<ArdSimulationConfig, 'absorptionFor'>;
    /** Absorption per surface index, as a plain array — functions do not clone. */
    absorption?: number[];
    /** Steps per chunk before yielding. Smaller means smoother progress. */
    chunkSize?: number;
} | {
    type: 'cancel';
};
export type ArdWorkerResponse = {
    type: 'progress';
    step: number;
    total: number;
    /** One sample per receiver at this step. */
    receiverSamples: Float32Array;
    slice?: Float32Array;
} | {
    type: 'done';
    /** One impulse response per receiver. */
    irs: Float32Array[];
    dt: number;
    courant: number;
    cellCount: {
        room: number;
        walls: number;
        boundary: number;
    };
    warnings: string[];
} | {
    type: 'cancelled';
    step: number;
} | {
    type: 'error';
    message: string;
};
