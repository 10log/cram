export declare class Response {
    buffer: Float32Array;
    constructor(length: number);
    clear(start?: number, stop?: number, value?: number): void;
    extend(n: number): void;
    add(index: number, value: number): void;
    sum(): number;
    delayMultiplyAdd(source: Response, delay: number, multiplier: number): void;
}
export default Response;
