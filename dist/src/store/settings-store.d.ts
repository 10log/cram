export type SettingKind = "text" | "number" | "checkbox" | "radio" | "color" | "select" | "keybinding";
export type SettingOption<T> = {
    value: T;
    id: string;
    name: string;
    description: string;
};
export type Setting<T, K extends SettingKind> = {
    id: string;
    name: string;
    description: string;
    kind: K;
    value: T;
    default_value: T;
    staged_value: T;
    options?: SettingOption<T>[];
};
type ApplicationSettings = {
    general: {
        fogColor: Setting<string, "color">;
        defaultSaveName: Setting<string, "text">;
    };
    editor: {
        transformSnapFine: Setting<number, "number">;
        transformSnapNormal: Setting<number, "number">;
        transformSnapCoarse: Setting<number, "number">;
    };
    keybindings: {
        SHOW_IMPORT_DIALOG: Setting<string, "keybinding">;
    };
};
export type SettingsStore = {
    settings: ApplicationSettings;
    set: SetFunction<SettingsStore>;
};
export declare const useSetting: import('zustand').UseBoundStore<import('zustand').StoreApi<SettingsStore>>;
/**
 * Reset the settings store to default values.
 */
export declare const resetSettingsStore: () => void;
export {};
