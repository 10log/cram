export interface TaskParams {
    name: string;
    id?: string;
    desc: string;
    complete: (...args: unknown[]) => unknown;
}
export declare class Task {
    name: string;
    desc: string;
    complete: (...args: unknown[]) => unknown;
    id: string;
    constructor(params: TaskParams);
}
