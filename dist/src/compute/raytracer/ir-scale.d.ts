/**
 * Monte Carlo IR scale (#133): 1/N, stable specular sign, no peak-normalize on export.
 */
export declare function rayOrderFromChain(path: {
    chainLength?: number;
    chain?: {
        length: number;
    };
}): number;
/** Isolated specular keeps a stable sign; optional random sign past first order. */
export declare function monteCarloSign(order: number, random?: () => number): number;
export declare function monteCarloWeight(numRays: number): number;
/** Extra path length from a 0.1 m mesh hit to the receiver centre. */
export declare function extraLengthToReceiverCenter(hitPoint: [number, number, number] | {
    x: number;
    y: number;
    z: number;
}, receiverPosition: {
    x: number;
    y: number;
    z: number;
}): number;
