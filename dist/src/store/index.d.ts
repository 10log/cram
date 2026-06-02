export * from './container-store';
export * from './settings-store';
export * from './history-store';
export * from './shortcut-store';
export * from './material-store';
export * from './result-store';
export * from './solver-store';
export * from './app-store';
export * from './theme-store';
export * from './io';
/**
 * Reset all stores to their initial state.
 * Call this when cleaning up the CRAMEditor component.
 */
export declare const resetAllStores: () => void;
declare global {
    type SetFunction<T> = (fn: (store: T, overwrite?: boolean) => void) => void;
    interface SetPropertyPayload<T> {
        uuid: string;
        property: keyof T;
        value: T[SetPropertyPayload<T>["property"]];
    }
}
