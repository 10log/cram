/**
 * App Store Tests
 *
 * Tests for the global application state store that manages:
 * - Units (meters/feet)
 * - UI visibility flags (dialogs, drawers, panels)
 * - Selection state
 * - Undo/redo state
 */

import { useAppStore } from '../app-store';
import { UNITS } from '../../enums/units';

describe('useAppStore', () => {
  // Reset store before each test
  beforeEach(() => {
    useAppStore.setState({
      units: UNITS.METERS,
      version: '0.2.1',
      canDuplicate: false,
      rendererStatsVisible: false,
      saveDialogVisible: false,
      projectName: '',
      openWarningVisible: false,
      newWarningVisible: false,
      materialDrawerOpen: false,
      importDialogVisible: false,
      selectedObjects: undefined,
      settingsDrawerVisible: false,
      resultsPanelOpen: false,
      canUndo: false,
      canRedo: false,
    });
  });

  describe('Initial State', () => {
    it('has correct default units', () => {
      expect(useAppStore.getState().units).toBe(UNITS.METERS);
    });

    it('has version string', () => {
      expect(useAppStore.getState().version).toBe('0.2.1');
    });

    it('has all dialogs closed by default', () => {
      const state = useAppStore.getState();
      expect(state.saveDialogVisible).toBe(false);
      expect(state.openWarningVisible).toBe(false);
      expect(state.newWarningVisible).toBe(false);
      expect(state.importDialogVisible).toBe(false);
    });

    it('has all drawers closed by default', () => {
      const state = useAppStore.getState();
      expect(state.materialDrawerOpen).toBe(false);
      expect(state.settingsDrawerVisible).toBe(false);
    });

    it('has no selected objects by default', () => {
      expect(useAppStore.getState().selectedObjects).toBeUndefined();
    });

    it('has undo/redo disabled by default', () => {
      const state = useAppStore.getState();
      expect(state.canUndo).toBe(false);
      expect(state.canRedo).toBe(false);
    });
  });

  describe('set() with Immer', () => {
    it('updates units via set()', () => {
      useAppStore.getState().set((draft) => {
        draft.units = UNITS.FEET;
      });
      expect(useAppStore.getState().units).toBe(UNITS.FEET);
    });

    it('updates project name via set()', () => {
      useAppStore.getState().set((draft) => {
        draft.projectName = 'Test Project';
      });
      expect(useAppStore.getState().projectName).toBe('Test Project');
    });

    it('toggles dialog visibility', () => {
      useAppStore.getState().set((draft) => {
        draft.saveDialogVisible = true;
      });
      expect(useAppStore.getState().saveDialogVisible).toBe(true);

      useAppStore.getState().set((draft) => {
        draft.saveDialogVisible = false;
      });
      expect(useAppStore.getState().saveDialogVisible).toBe(false);
    });

    it('updates multiple properties in single set()', () => {
      useAppStore.getState().set((draft) => {
        draft.canDuplicate = true;
        draft.rendererStatsVisible = true;
        draft.resultsPanelOpen = true;
      });

      const state = useAppStore.getState();
      expect(state.canDuplicate).toBe(true);
      expect(state.rendererStatsVisible).toBe(true);
      expect(state.resultsPanelOpen).toBe(true);
    });

    it('updates selectedObjects', () => {
      useAppStore.getState().set((draft) => {
        draft.selectedObjects = 'object-uuid-123';
      });
      expect(useAppStore.getState().selectedObjects).toBe('object-uuid-123');
    });
  });

  describe('Dialog Management', () => {
    it('opens save dialog', () => {
      useAppStore.getState().set((draft) => {
        draft.saveDialogVisible = true;
      });
      expect(useAppStore.getState().saveDialogVisible).toBe(true);
    });

    it('opens import dialog', () => {
      useAppStore.getState().set((draft) => {
        draft.importDialogVisible = true;
      });
      expect(useAppStore.getState().importDialogVisible).toBe(true);
    });

    it('opens warning dialogs', () => {
      useAppStore.getState().set((draft) => {
        draft.openWarningVisible = true;
        draft.newWarningVisible = true;
      });

      const state = useAppStore.getState();
      expect(state.openWarningVisible).toBe(true);
      expect(state.newWarningVisible).toBe(true);
    });
  });

  describe('Drawer Management', () => {
    it('opens material drawer', () => {
      useAppStore.getState().set((draft) => {
        draft.materialDrawerOpen = true;
      });
      expect(useAppStore.getState().materialDrawerOpen).toBe(true);
    });

    it('opens settings drawer', () => {
      useAppStore.getState().set((draft) => {
        draft.settingsDrawerVisible = true;
      });
      expect(useAppStore.getState().settingsDrawerVisible).toBe(true);
    });
  });

  describe('Undo/Redo State', () => {
    it('enables undo', () => {
      useAppStore.getState().set((draft) => {
        draft.canUndo = true;
      });
      expect(useAppStore.getState().canUndo).toBe(true);
    });

    it('enables redo', () => {
      useAppStore.getState().set((draft) => {
        draft.canRedo = true;
      });
      expect(useAppStore.getState().canRedo).toBe(true);
    });

    it('manages undo/redo together', () => {
      // Simulate initial undo available
      useAppStore.getState().set((draft) => {
        draft.canUndo = true;
        draft.canRedo = false;
      });

      let state = useAppStore.getState();
      expect(state.canUndo).toBe(true);
      expect(state.canRedo).toBe(false);

      // After undo, redo becomes available
      useAppStore.getState().set((draft) => {
        draft.canUndo = false;
        draft.canRedo = true;
      });

      state = useAppStore.getState();
      expect(state.canUndo).toBe(false);
      expect(state.canRedo).toBe(true);
    });
  });

  describe('Results Panel', () => {
    it('opens results panel', () => {
      useAppStore.getState().set((draft) => {
        draft.resultsPanelOpen = true;
      });
      expect(useAppStore.getState().resultsPanelOpen).toBe(true);
    });

    it('closes results panel', () => {
      useAppStore.getState().set((draft) => {
        draft.resultsPanelOpen = true;
      });
      useAppStore.getState().set((draft) => {
        draft.resultsPanelOpen = false;
      });
      expect(useAppStore.getState().resultsPanelOpen).toBe(false);
    });
  });

  describe('Renderer Stats', () => {
    it('toggles renderer stats visibility', () => {
      expect(useAppStore.getState().rendererStatsVisible).toBe(false);

      useAppStore.getState().set((draft) => {
        draft.rendererStatsVisible = true;
      });
      expect(useAppStore.getState().rendererStatsVisible).toBe(true);

      useAppStore.getState().set((draft) => {
        draft.rendererStatsVisible = false;
      });
      expect(useAppStore.getState().rendererStatsVisible).toBe(false);
    });
  });
});
