import { CRAMTheme, ThemeMode } from '../themes';
export interface ThemeStore {
    mode: ThemeMode;
    theme: CRAMTheme;
    set: SetFunction<ThemeStore>;
}
export declare const useTheme: import('zustand').UseBoundStore<import('zustand').StoreApi<ThemeStore>>;
/**
 * Reset the theme store to default values.
 */
export declare const resetThemeStore: () => void;
declare global {
    interface EventTypes {
        SET_THEME_MODE: ThemeMode;
        THEME_CHANGED: CRAMTheme;
    }
}
