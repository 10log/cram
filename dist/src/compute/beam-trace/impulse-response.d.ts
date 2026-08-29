import { default as Receiver } from '../../objects/receiver';
import { BeamTracePath } from './paths';
export type ArrivalPressureFn = (initialSPL: number[], path: BeamTracePath, receiverGain: number) => number[];
export declare function receiverGainForPath(receiver: Receiver | null | undefined, path: BeamTracePath): number;
export declare function calculateMonoImpulseResponse(params: {
    validPaths: BeamTracePath[];
    frequencies: number[];
    receiver: Receiver | null;
    arrivalPressure: ArrivalPressureFn;
    lateReverbTailEnabled: boolean;
    energyHistogram: Float32Array[] | null;
    tailCrossfadeTime: number;
    tailCrossfadeDuration: number;
    updateResult: (ir: AudioBuffer, sampleRate: number) => void;
}): Promise<AudioBuffer>;
export declare function updateImpulseResponseResult(params: {
    ir: AudioBuffer;
    sampleRate: number;
    sourceIDs: string[];
    receiverIDs: string[];
    impulseResponseResult: string;
    solverUuid: string;
}): void;
export declare function calculateAmbisonicImpulseResponse(params: {
    validPaths: BeamTracePath[];
    frequencies: number[];
    receiver: Receiver | null;
    arrivalPressure: ArrivalPressureFn;
    lateReverbTailEnabled: boolean;
    energyHistogram: Float32Array[] | null;
    tailCrossfadeTime: number;
    tailCrossfadeDuration: number;
    order: number;
}): Promise<AudioBuffer>;
export declare function calculateBinauralImpulseResponse(params: {
    ambisonicImpulseResponse: AudioBuffer;
    order: number;
    hrtfSubjectId: string;
    headYaw: number;
    headPitch: number;
    headRoll: number;
}): Promise<AudioBuffer>;
export declare function downloadOctaveBandIR(params: {
    validPaths: BeamTracePath[];
    frequencies: number[];
    receiver: Receiver | null;
    arrivalPressure: ArrivalPressureFn;
    filename: string;
    sampleRate?: number;
}): void;
