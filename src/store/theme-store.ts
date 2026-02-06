import { create } from 'zustand';
import { produce } from 'immer';
import { on, emit } from '../messenger';
import { themes, CRAMTheme, ThemeMode } from '../themes';

export interface ThemeStore {
  mode: ThemeMode;
  theme: CRAMTheme;
  set: SetFunction<ThemeStore>;
}

export const useTheme = create<ThemeStore>((set) => ({
  mode: 'light',
  theme: themes.light,
  set: (fn) => set(produce(fn)),
}));

// Listen for theme mode changes from external sources (e.g., parent app)
on('SET_THEME_MODE', (mode: ThemeMode) => {
  const newTheme = themes[mode];
  useTheme.getState().set((draft) => {
    draft.mode = mode;
    draft.theme = newTheme;
  });
  emit('THEME_CHANGED', newTheme);
});

/**
 * Reset the theme store to default values.
 */
export const resetThemeStore = () => {
  useTheme.setState({
    mode: 'light',
    theme: themes.light,
  });
  console.log('[ThemeStore] Reset complete');
};

// Add event types for TypeScript
declare global {
  interface EventTypes {
    SET_THEME_MODE: ThemeMode;
    THEME_CHANGED: CRAMTheme;
  }
}
