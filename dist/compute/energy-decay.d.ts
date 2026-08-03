import { default as Solver, SolverParams } from './solver';
export interface EnergyDecayProps extends SolverParams {
}
export type EnergyDecaySaveObject = {
    uuid: string;
    name: string;
    kind: "energydecay";
    autoCalculate: boolean;
};
declare class EnergyDecay extends Solver {
    uuid: string;
    broadbandIRData: Float32Array;
    broadbandIRSampleRate: number;
    broadbandIRSource: any;
    source: AudioBufferSourceNode | null;
    filteredData: Float32Array[];
    filteredEnergyDecayData: Float32Array[];
    impulseResponsePlaying: boolean;
    filterTest: any;
    T15: number[];
    T20: number[];
    T30: number[];
    constructor(props?: EnergyDecayProps);
    calculateAcParams(): void;
    calculateOctavebandBackwardsIntegration(): void;
    downloadResultsAsCSV(): void;
    play(source: AudioBufferSourceNode): void;
    set broadbandIR(f: ArrayBuffer);
}
export default EnergyDecay;
declare global {
    interface EventTypes {
        ADD_ENERGYDECAY: EnergyDecay | undefined;
        ENERGYDECAY_SET_PROPERTY: {
            uuid: string;
            property: keyof EnergyDecay;
            value: EnergyDecay[EventTypes["ENERGYDECAY_SET_PROPERTY"]["property"]];
        };
        LOAD_IR_TO_ENERGYDECAY: {
            uuid: string;
            f: File;
        };
        CALCULATE_AC_PARAMS: string;
    }
}
