export type Shortcut = {
    key: string;
    event: keyof EventTypes;
    scopes: Scopes[];
    name: string;
    description: string;
    args?: EventTypes[Shortcut["event"]];
};
export type ShortcutStore = {
    shortcuts: Map<string, Shortcut>;
    set: SetFunction<ShortcutStore>;
};
export declare const useShortcut: import('zustand').UseBoundStore<import('zustand').StoreApi<ShortcutStore>>;
declare global {
    interface EventTypes {
        REGISTER_SHORTCUTS: undefined;
    }
}
