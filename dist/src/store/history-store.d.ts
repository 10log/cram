export type HistoryStore = {};
export declare const useHistory: import('zustand').UseBoundStore<import('zustand').StoreApi<HistoryStore>>;
declare global {
    interface EventTypes {
        UNDO: undefined;
        REDO: undefined;
    }
}
export default useHistory;
