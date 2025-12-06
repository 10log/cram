/**
 * Settings Store Tests
 *
 * Tests for the application settings store that manages:
 * - General settings (fog color, default save name)
 * - Editor settings (transform snap values)
 * - Keybindings
 */

import { useSetting } from '../settings-store';

describe('useSetting', () => {
  // Store original state to restore after tests
  const originalState = useSetting.getState();

  afterEach(() => {
    // Reset to original state
    useSetting.setState(originalState);
  });

  describe('Initial State', () => {
    describe('General Settings', () => {
      it('has fog color setting', () => {
        const fogColor = useSetting.getState().settings.general.fogColor;
        expect(fogColor.id).toBe('fogColor');
        expect(fogColor.kind).toBe('color');
        expect(fogColor.value).toBe('#ffffff');
        expect(fogColor.default_value).toBe('#ffffff');
      });

      it('has default save name setting', () => {
        const defaultSaveName = useSetting.getState().settings.general.defaultSaveName;
        expect(defaultSaveName.id).toBe('defaultSaveName');
        expect(defaultSaveName.kind).toBe('text');
        expect(defaultSaveName.value).toBe('new-project');
      });
    });

    describe('Editor Settings', () => {
      it('has fine transform snap setting', () => {
        const snap = useSetting.getState().settings.editor.transformSnapFine;
        expect(snap.id).toBe('transformSnapFine');
        expect(snap.kind).toBe('number');
        expect(snap.value).toBe(0.001);
      });

      it('has normal transform snap setting', () => {
        const snap = useSetting.getState().settings.editor.transformSnapNormal;
        expect(snap.id).toBe('transformSnapNormal');
        expect(snap.kind).toBe('number');
        expect(snap.value).toBe(0.1);
      });

      it('has coarse transform snap setting', () => {
        const snap = useSetting.getState().settings.editor.transformSnapCoarse;
        expect(snap.id).toBe('transformSnapCoarse');
        expect(snap.kind).toBe('number');
        expect(snap.value).toBe(1);
      });
    });

    describe('Keybindings', () => {
      it('has import dialog keybinding', () => {
        const keybinding = useSetting.getState().settings.keybindings.SHOW_IMPORT_DIALOG;
        expect(keybinding.id).toBe('SHOW_IMPORT_DIALOG');
        expect(keybinding.kind).toBe('keybinding');
        expect(keybinding.value).toBe('⌃+i, ⌘+i');
      });
    });
  });

  describe('Setting Properties', () => {
    it('each setting has name and description', () => {
      const settings = useSetting.getState().settings;

      // General settings
      expect(settings.general.fogColor.name).toBe('Fog Color');
      expect(settings.general.fogColor.description).toContain('fog');

      expect(settings.general.defaultSaveName.name).toBe('Default Save Name');
      expect(settings.general.defaultSaveName.description).toContain('saving');

      // Editor settings
      expect(settings.editor.transformSnapFine.name).toContain('Snap');
      expect(settings.editor.transformSnapNormal.name).toContain('Snap');
      expect(settings.editor.transformSnapCoarse.name).toContain('Snap');
    });

    it('each setting has staged_value matching value initially', () => {
      const settings = useSetting.getState().settings;

      expect(settings.general.fogColor.staged_value).toBe(settings.general.fogColor.value);
      expect(settings.general.defaultSaveName.staged_value).toBe(settings.general.defaultSaveName.value);
      expect(settings.editor.transformSnapFine.staged_value).toBe(settings.editor.transformSnapFine.value);
    });
  });

  describe('set() with Immer', () => {
    it('updates fog color via set()', () => {
      useSetting.getState().set((draft) => {
        draft.settings.general.fogColor.value = '#ff0000';
      });
      expect(useSetting.getState().settings.general.fogColor.value).toBe('#ff0000');
    });

    it('updates default save name via set()', () => {
      useSetting.getState().set((draft) => {
        draft.settings.general.defaultSaveName.value = 'my-project';
      });
      expect(useSetting.getState().settings.general.defaultSaveName.value).toBe('my-project');
    });

    it('updates transform snap values via set()', () => {
      useSetting.getState().set((draft) => {
        draft.settings.editor.transformSnapFine.value = 0.01;
        draft.settings.editor.transformSnapNormal.value = 0.5;
        draft.settings.editor.transformSnapCoarse.value = 5;
      });

      const editor = useSetting.getState().settings.editor;
      expect(editor.transformSnapFine.value).toBe(0.01);
      expect(editor.transformSnapNormal.value).toBe(0.5);
      expect(editor.transformSnapCoarse.value).toBe(5);
    });

    it('updates keybinding via set()', () => {
      useSetting.getState().set((draft) => {
        draft.settings.keybindings.SHOW_IMPORT_DIALOG.value = '⌃+o, ⌘+o';
      });
      expect(useSetting.getState().settings.keybindings.SHOW_IMPORT_DIALOG.value).toBe('⌃+o, ⌘+o');
    });
  });

  describe('Staged Values', () => {
    it('updates staged_value independently of value', () => {
      useSetting.getState().set((draft) => {
        draft.settings.general.fogColor.staged_value = '#00ff00';
      });

      const fogColor = useSetting.getState().settings.general.fogColor;
      expect(fogColor.value).toBe('#ffffff'); // Original
      expect(fogColor.staged_value).toBe('#00ff00'); // Staged
    });

    it('can apply staged value to actual value', () => {
      // First stage a value
      useSetting.getState().set((draft) => {
        draft.settings.editor.transformSnapFine.staged_value = 0.005;
      });

      // Then apply it
      useSetting.getState().set((draft) => {
        draft.settings.editor.transformSnapFine.value =
          draft.settings.editor.transformSnapFine.staged_value;
      });

      const snap = useSetting.getState().settings.editor.transformSnapFine;
      expect(snap.value).toBe(0.005);
      expect(snap.staged_value).toBe(0.005);
    });

    it('can reset staged value to default', () => {
      // Modify both value and staged
      useSetting.getState().set((draft) => {
        draft.settings.general.defaultSaveName.value = 'modified';
        draft.settings.general.defaultSaveName.staged_value = 'also-modified';
      });

      // Reset staged to default
      useSetting.getState().set((draft) => {
        draft.settings.general.defaultSaveName.staged_value =
          draft.settings.general.defaultSaveName.default_value;
      });

      const setting = useSetting.getState().settings.general.defaultSaveName;
      expect(setting.value).toBe('modified');
      expect(setting.staged_value).toBe('new-project');
    });
  });

  describe('Default Values', () => {
    it('can reset value to default', () => {
      // Modify value
      useSetting.getState().set((draft) => {
        draft.settings.general.fogColor.value = '#123456';
      });

      // Reset to default
      useSetting.getState().set((draft) => {
        draft.settings.general.fogColor.value =
          draft.settings.general.fogColor.default_value;
      });

      expect(useSetting.getState().settings.general.fogColor.value).toBe('#ffffff');
    });

    it('default values remain unchanged', () => {
      useSetting.getState().set((draft) => {
        draft.settings.editor.transformSnapFine.value = 999;
      });

      // Default should still be original
      expect(useSetting.getState().settings.editor.transformSnapFine.default_value).toBe(0.001);
    });
  });

  describe('Setting Kinds', () => {
    it('color settings have kind "color"', () => {
      expect(useSetting.getState().settings.general.fogColor.kind).toBe('color');
    });

    it('text settings have kind "text"', () => {
      expect(useSetting.getState().settings.general.defaultSaveName.kind).toBe('text');
    });

    it('number settings have kind "number"', () => {
      expect(useSetting.getState().settings.editor.transformSnapFine.kind).toBe('number');
      expect(useSetting.getState().settings.editor.transformSnapNormal.kind).toBe('number');
      expect(useSetting.getState().settings.editor.transformSnapCoarse.kind).toBe('number');
    });

    it('keybinding settings have kind "keybinding"', () => {
      expect(useSetting.getState().settings.keybindings.SHOW_IMPORT_DIALOG.kind).toBe('keybinding');
    });
  });
});
