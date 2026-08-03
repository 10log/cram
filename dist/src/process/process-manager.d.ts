import { Process } from './process';
import { KeyValuePair } from '../common/key-value-pair';
import { default as Messenger } from '../messenger';
export interface ProcessManagerParams {
    messenger: Messenger;
    processes?: KeyValuePair<Process>;
}
export interface RegisterProcessParams {
    proc: Process;
}
export declare class ProcessManager {
    currentProcess: Process;
    messenger: Messenger;
    processes: KeyValuePair<Process>;
    constructor(params: ProcessManagerParams);
    registerNewProcess(params: RegisterProcessParams): void;
}
