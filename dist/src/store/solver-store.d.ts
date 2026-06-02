import { KeyValuePair } from '../common/key-value-pair';
import { default as Solver } from '../compute/solver';
export type SolverStore = {
    solvers: KeyValuePair<Solver>;
    version: number;
    set: SetFunction<SolverStore>;
    keys: () => string[];
};
export declare const useSolver: import('zustand').UseBoundStore<import('zustand').StoreApi<SolverStore>>;
export declare const addSolver: <T extends Solver>(SolverClass: new () => T) => (solver: T | undefined) => void;
export declare const removeSolver: (uuid: keyof SolverStore["solvers"]) => void;
export declare const setSolverProperty: ({ uuid, property, value }: {
    uuid: string;
    property: string;
    value: unknown;
}) => void;
export declare const callSolverMethod: ({ uuid, method, args, isAsync }: {
    uuid: string;
    method: string;
    args: unknown[];
    isAsync?: boolean;
}) => void;
export declare const getSolverKeys: () => string[];
/**
 * Reset the solver store to its initial state.
 * Disposes all solvers before clearing.
 */
export declare const resetSolverStore: () => void;
