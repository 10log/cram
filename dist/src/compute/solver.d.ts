import { EditorModes } from '../constants/editor-modes';
export interface SolverParams {
    [key: string]: any;
    name?: string;
}
export default abstract class Solver {
    params: SolverParams;
    name: string;
    uuid: string;
    kind: string;
    running: boolean;
    update: () => void;
    clearpass: boolean;
    autoCalculate: boolean;
    constructor(params?: SolverParams);
    /** Override in subclasses to perform the solver's calculation */
    calculate(): void;
    save(): {
        name: string;
        kind: string;
        uuid: string;
        autoCalculate: boolean;
    };
    restore(state: {
        name: string;
        uuid: string;
        autoCalculate?: boolean;
    }): this;
    dispose(): void;
    onModeChange(mode: EditorModes): void;
    onParameterConfigFocus(): void;
    onParameterConfigBlur(): void;
}
