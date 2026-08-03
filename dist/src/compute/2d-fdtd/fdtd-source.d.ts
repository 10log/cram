export interface FDTDSourceProps {
    x: number;
    y: number;
    amplitude: number;
    frequency: number;
    phase: number;
}
declare class FDTDSource {
    x: number;
    y: number;
    amplitude: number;
    frequency: number;
    phase: number;
    value: number;
    previousValue: number;
    velocity: number;
    rgba: number[];
    previousX: number;
    previousY: number;
    shouldClearPreviousPosition: boolean;
    constructor(props: FDTDSourceProps);
    update(time: number): void;
    move(x: number, y: number): void;
}
export { FDTDSource };
export default FDTDSource;
