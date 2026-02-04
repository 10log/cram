/**
 * CRAMEditor - Embeddable React component for CRAM acoustic simulation
 *
 * This component provides a clean API for embedding CRAM in a parent application.
 * It handles initialization, lifecycle management, and exposes an imperative API
 * for programmatic control.
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import type { CRAMEditorProps, CRAMEditorRef, SolverType } from './types';
import type { SaveState } from '../store/io';

// Components
import App from '../components/App';

// Messenger and events
import { emit, messenger } from '../messenger';

// Store access for save/load and cleanup
import { useAppStore, resetAllStores } from '../store';

// Renderer for cleanup
import { renderer } from '../render/renderer';

// Layout defaults
import { layout as defaultLayout } from '../default-storage';

// Storage utility for namespaced localStorage
import storage, { setStoragePrefix } from './storage';

/**
 * Get layout from localStorage with the configured prefix
 */
function getLayout() {
  try {
    const stored = storage.getItem('layout');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to parse layout from localStorage:', e);
  }
  return JSON.parse(defaultLayout);
}

/**
 * CRAMEditor component - the main embeddable CRAM editor
 */
export const CRAMEditor = forwardRef<CRAMEditorRef, CRAMEditorProps>(
  function CRAMEditor(props, ref) {
    const {
      initialProject,
      onSave,
      onProjectChange,
      onError,
      storagePrefix = 'cram',
      showNavBar = true,
      fixedPanelWidth,
    } = props;

    const initializedRef = useRef(false);

    // Set storage prefix on mount (before reading layout)
    // This must happen synchronously before any localStorage reads
    setStoragePrefix(storagePrefix);
    const layoutRef = useRef(getLayout());

    // Track dirty state changes for onProjectChange callback
    useEffect(() => {
      if (!onProjectChange) return;

      const unsubscribe = useAppStore.subscribe((state, prevState) => {
        if (state.hasUnsavedChanges && !prevState.hasUnsavedChanges) {
          // Project became dirty - get current state and notify
          try {
            const currentState = getSaveState();
            onProjectChange(currentState);
          } catch (e) {
            onError?.(e as Error);
          }
        }
      });

      return unsubscribe;
    }, [onProjectChange, onError]);

    // Handle initial project load
    useEffect(() => {
      if (initialProject && initializedRef.current) {
        emit('RESTORE', { json: initialProject });
      }
    }, [initialProject]);

    // Mark as initialized after mount and handle cleanup on unmount
    useEffect(() => {
      initializedRef.current = true;

      // Cleanup function - runs when component unmounts
      return () => {
        console.log('[CRAMEditor] Unmounting - cleaning up resources...');
        initializedRef.current = false;

        // Dispose renderer (WebGL context, event listeners, Three.js resources)
        try {
          renderer.dispose();
        } catch (e) {
          console.warn('[CRAMEditor] Error disposing renderer:', e);
        }

        // Clear messenger handlers
        try {
          messenger.clear();
        } catch (e) {
          console.warn('[CRAMEditor] Error clearing messenger:', e);
        }

        // Reset all Zustand stores
        try {
          resetAllStores();
        } catch (e) {
          console.warn('[CRAMEditor] Error resetting stores:', e);
        }

        console.log('[CRAMEditor] Cleanup complete');
      };
    }, []);

    // Helper to get current save state
    const getSaveState = useCallback((): SaveState => {
      const containers = messenger.postMessage('SAVE_CONTAINERS')[0] || [];
      const solvers = messenger.postMessage('SAVE_SOLVERS')[0] || [];
      const { projectName, version } = useAppStore.getState();

      return {
        meta: {
          version: version as `${number}.${number}.${number}`,
          name: projectName,
          timestamp: new Date().toISOString(),
        },
        containers,
        solvers,
      };
    }, []);

    // Imperative handle for parent component control
    useImperativeHandle(ref, () => ({
      // Project operations
      newProject: () => {
        emit('NEW', undefined);
      },

      save: (): SaveState => {
        const state = getSaveState();
        onSave?.(state);
        return state;
      },

      load: (state: SaveState) => {
        messenger.postMessage('RESTORE', { json: state });
      },

      importFile: async (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
          try {
            messenger.postMessage('IMPORT_FILE', [file]);
            // Give import time to process
            setTimeout(resolve, 100);
          } catch (e) {
            reject(e);
          }
        });
      },

      // Scene operations
      addSource: () => {
        messenger.postMessage('SHOULD_ADD_SOURCE');
      },

      addReceiver: () => {
        messenger.postMessage('SHOULD_ADD_RECEIVER');
      },

      addSolver: (type: SolverType) => {
        // All solvers now use messenger.postMessage with consistent naming
        const solverMessages: Record<SolverType, string> = {
          'raytracer': 'SHOULD_ADD_RAYTRACER',
          'image-source': 'SHOULD_ADD_IMAGE_SOURCE',
          'beam-trace': 'SHOULD_ADD_BEAMTRACE',
          'fdtd-2d': 'SHOULD_ADD_FDTD_2D',
          'rt60': 'SHOULD_ADD_RT60',
          'energy-decay': 'SHOULD_ADD_ENERGYDECAY',
          'art': 'SHOULD_ADD_ART',
        };

        const message = solverMessages[type];
        if (message) {
          messenger.postMessage(message);
        }
      },

      // Edit operations
      undo: () => {
        messenger.postMessage('UNDO');
      },

      redo: () => {
        messenger.postMessage('REDO');
      },

      // View operations
      toggleResultsPanel: () => {
        emit('TOGGLE_RESULTS_PANEL', undefined);
      },
    }), [getSaveState, onSave]);

    // Render the App component with layout props
    // showNavBar is passed down to conditionally render the navbar
    // fixedPanelWidth overrides the stored right panel width
    return (
      <App
        {...layoutRef.current}
        showNavBar={showNavBar}
        fixedPanelWidth={fixedPanelWidth}
      />
    );
  }
);

export default CRAMEditor;
