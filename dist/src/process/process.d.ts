import { Task } from './task';
export interface ProcessParams {
    name: string;
    steps: Task[];
    id?: string;
}
/**
 * The Process class hold a collection of tasks to be performed in order
 * ex. 1
 *
 */
export declare class Process {
    name: string;
    id: string;
    steps: Task[];
    stepIndex: 0;
    constructor(params: ProcessParams);
    start(): void;
    end(): void;
}
