import { Response } from './response';
export declare class DirectionalResponse {
    n: number;
    responses: Response[];
    /**
     * constructs a new DirectionalResponse
     * @param n number of directions
     * @param length length of the response
     */
    constructor(n: number, length: number);
    clear(): void;
    sum(): number;
    delayMultiplyAdd(source: Response, delay: number, multPerDirection: number[], constScaler: number): void;
    accumulateFrom(source: DirectionalResponse): void;
}
