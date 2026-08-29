import { default as Receiver } from '../../objects/receiver';
import { ResponseByIntensity } from '../shared/response-by-intensity-types';
import { KVP } from '../../common/key-value-pair';
import { BeamTracePath } from './paths';
export type ArrivalPressureFn = (initialSPL: number[], path: BeamTracePath, receiverGain: number) => number[];
export declare function buildEnergyHistogram(params: {
    validPaths: BeamTracePath[];
    frequencies: number[];
    receiver: Receiver | null;
    arrivalPressure: ArrivalPressureFn;
}): Float32Array[];
export declare function calculateLevelTimeProgression(params: {
    validPaths: BeamTracePath[];
    levelTimeProgressionId: string;
    plotFrequency: number;
    maxReflectionOrder: number;
    solverUuid: string;
    receiver: Receiver | null;
    arrivalPressure: ArrivalPressureFn;
}): void;
export declare function calculateResponseByIntensity(params: {
    validPaths: BeamTracePath[];
    frequencies: number[];
    sourceId: string;
    receiverId: string;
    receiver: Receiver | null;
    arrivalPressure: ArrivalPressureFn;
}): KVP<KVP<ResponseByIntensity>>;
