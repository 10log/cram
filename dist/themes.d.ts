/**
 * Theme mode: light or dark
 */
export type ThemeMode = 'light' | 'dark';
/**
 * UI theme colors for panels, tabs, and text
 */
export interface UITheme {
    fontColor: string;
    panelBackgroundColor: string;
    backgroundColor: string;
    layoutSeperatorColor: string;
    tabsBorderColor: string;
    tabsBackgroundColor: string;
    tabBackgroundColor: string;
}
/**
 * Renderer theme colors for 3D scene elements
 */
export interface RendererTheme {
    /** Scene background color (hex number) */
    background: number;
    /** Fog color (hex number) */
    fog: number;
    /** Minor grid line color (hex number) */
    gridMinor: number;
    /** Major grid line color (hex number) */
    gridMajor: number;
    /** Minor grid line opacity (0-1) */
    gridOpacity: number;
    /** Major grid line opacity (0-1) */
    gridMajorOpacity: number;
}
/**
 * Combined CRAM theme with UI and renderer settings
 */
export interface CRAMTheme {
    mode: ThemeMode;
    ui: UITheme;
    renderer: RendererTheme;
}
/**
 * @deprecated Use UITheme instead
 */
export type Theme = UITheme;
export declare const LightTheme: CRAMTheme;
export declare const DarkTheme: CRAMTheme;
export declare const themes: Record<ThemeMode, CRAMTheme>;
declare const _default: {
    LightTheme: CRAMTheme;
    DarkTheme: CRAMTheme;
    themes: Record<ThemeMode, CRAMTheme>;
};
export default _default;
