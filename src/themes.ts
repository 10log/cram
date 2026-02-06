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

export const LightTheme: CRAMTheme = {
  mode: 'light',
  ui: {
    fontColor: "#182026",
    panelBackgroundColor: "#ffffff",
    backgroundColor: "#f5f8fa",
    layoutSeperatorColor: "#bbbbbb33",
    tabsBorderColor: "#aaaaaa",
    tabsBackgroundColor: "#0000000d",
    tabBackgroundColor: "#ffffff"
  },
  renderer: {
    background: 0xf5f8fa,
    fog: 0xf5f8fa,
    gridMinor: 0x000000,
    gridMajor: 0x000000,
    gridOpacity: 0.1,
    gridMajorOpacity: 0.2,
  }
};

export const DarkTheme: CRAMTheme = {
  mode: 'dark',
  ui: {
    fontColor: "#f5f6f7",
    panelBackgroundColor: "#1e1e1e",
    backgroundColor: "#121212",
    layoutSeperatorColor: "#ffffff20",
    tabsBorderColor: "#444444",
    tabsBackgroundColor: "#ffffff0d",
    tabBackgroundColor: "#2d2d2d"
  },
  renderer: {
    background: 0x1a1a2e,
    fog: 0x1a1a2e,
    gridMinor: 0xffffff,
    gridMajor: 0xffffff,
    gridOpacity: 0.08,
    gridMajorOpacity: 0.15,
  }
};

export const themes: Record<ThemeMode, CRAMTheme> = {
  light: LightTheme,
  dark: DarkTheme
};

export default {
  LightTheme,
  DarkTheme,
  themes
};
