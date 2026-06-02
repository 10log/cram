import { default as Solver, SolverParams } from '../solver';
import { default as Room } from '../../objects/room';
export interface RT60Props extends SolverParams {
}
export type RT60SaveObject = {
    uuid: string;
    name: string;
    kind: "rt60";
    autoCalculate: boolean;
};
export declare class RT60 extends Solver {
    uuid: string;
    sabine_rt: number[];
    eyring_rt: number[];
    ap_rt: number[];
    volume: number;
    frequencies: number[];
    roomID: string;
    resultID: string;
    resultExists: boolean;
    constructor(props?: RT60Props);
    save(): RT60SaveObject;
    restore(state: RT60SaveObject): this;
    calculate(): void;
    reset(): void;
    sabine(mValues: number[]): number[];
    eyring(mValues: number[]): number[];
    arauPuchades(room: Room, frequencies?: number[]): number[];
    onParameterConfigFocus(): void;
    onParameterConfigBlur(): void;
    downloadRT60AsCSV(): void;
    get unitsConstant(): number;
    get temperature(): number;
    get humidity(): number;
    get room(): Room;
    get noResults(): boolean;
    get displayVolume(): number;
    set displayVolume(volume: number);
}
export default RT60;
declare global {
    interface EventTypes {
        ADD_RT60: RT60 | undefined;
        REMOVE_RT60: string;
        RT60_SET_PROPERTY: {
            uuid: string;
            property: keyof RT60;
            value: RT60[EventTypes["RT60_SET_PROPERTY"]["property"]];
        };
        UPDATE_RT60: string;
        DOWNLOAD_RT60_RESULTS: string;
    }
}
