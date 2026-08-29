/**
 * Hybrid IR: image source owns order ≤ transitionOrder, stochastic rays own the rest.
 * Never mutate the stored path list (#129).
 */
export declare function rayPathOrder(path: {
    chainLength: number;
}): number;
export declare function hybridStochasticPaths<T extends {
    chainLength: number;
    time: number;
}>(paths: readonly T[], transitionOrder: number): T[];
export declare function hybridImageSourcePaths<T extends {
    order: number;
}>(paths: readonly T[], transitionOrder: number): T[];
