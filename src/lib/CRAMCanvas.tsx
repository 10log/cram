/**
 * CRAMCanvas - Standalone 3D canvas component for CRAM
 *
 * This component renders just the 3D WebGL canvas without any panels.
 * Use with ObjectsPanel and SolversPanel for a custom layout.
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import type { CRAMEditorProps, CRAMEditorRef, SolverType } from './types';
import type { SaveState } from '../store/io';

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

// Import dialogs and progress indicators
import ImportDialog from '../components/ImportDialog';
import SaveDialog from '../components/SaveDialog';
import ProgressIndicator from '../components/ProgressIndicator';
import AutoCalculateProgress from '../components/AutoCalculateProgress';
import { MaterialSearch } from '../components/MaterialSearch';

// Import CSS
import '../css';
import '../components/App.css';

const canvasContainerSx: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: '100%',
  userSelect: 'none',
  overflow: 'hidden',
};

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
 * CRAMCanvas component - the 3D canvas without any panels
 */
export const CRAMCanvas = forwardRef<CRAMEditorRef, CRAMEditorProps>(
  function CRAMCanvas(props, ref) {
    const {
      initialProject,
      onSave,
      onProjectChange,
      onError,
      storagePrefix = 'cram',
    } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasOverlayRef = useRef<HTMLDivElement>(null);
    const orientationOverlayRef = useRef<HTMLDivElement>(null);
    const responseOverlayRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);

    // Set storage prefix on mount (before reading layout)
    setStoragePrefix(storagePrefix);
    const layoutRef = useRef(getLayout());

    // Track dirty state changes for onProjectChange callback
    useEffect(() => {
      if (!onProjectChange) return;

      const unsubscribe = useAppStore.subscribe((state, prevState) => {
        if (state.hasUnsavedChanges && !prevState.hasUnsavedChanges) {
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

    // Initialize canvas and handle cleanup
    useEffect(() => {
      if (canvasRef.current) {
        messenger.postMessage('APP_MOUNTED', canvasRef.current);
      }
      initializedRef.current = true;

      return () => {
        console.log('[CRAMCanvas] Unmounting - cleaning up resources...');
        initializedRef.current = false;

        try {
          renderer.dispose();
        } catch (e) {
          console.warn('[CRAMCanvas] Error disposing renderer:', e);
        }

        try {
          messenger.clear();
        } catch (e) {
          console.warn('[CRAMCanvas] Error clearing messenger:', e);
        }

        try {
          resetAllStores();
        } catch (e) {
          console.warn('[CRAMCanvas] Error resetting stores:', e);
        }

        console.log('[CRAMCanvas] Cleanup complete');
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
      newProject: () => {
        emit('NEW', undefined);
      },

      save: (): SaveState => {
        const state = getSaveState();
        onSave?.(state);
        return state;
      },

      load: (state: SaveState) => {
        emit('RESTORE', { json: state });
      },

      importFile: async (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
          try {
            messenger.postMessage('IMPORT_FILE', [file]);
            setTimeout(resolve, 100);
          } catch (e) {
            reject(e);
          }
        });
      },

      addSource: () => {
        messenger.postMessage('SHOULD_ADD_SOURCE');
      },

      addReceiver: () => {
        messenger.postMessage('SHOULD_ADD_RECEIVER');
      },

      addSolver: (type: SolverType) => {
        const solverEvents: Record<SolverType, string> = {
          'raytracer': 'SHOULD_ADD_RAYTRACER',
          'image-source': 'SHOULD_ADD_IMAGE_SOURCE',
          'beam-trace': 'SHOULD_ADD_BEAMTRACE',
          'fdtd-2d': 'ADD_FDTD_2D',
          'rt60': 'SHOULD_ADD_RT60',
          'energy-decay': 'SHOULD_ADD_ENERGYDECAY',
          'art': 'ADD_ART',
        };

        const eventName = solverEvents[type];
        if (eventName) {
          if (eventName.startsWith('SHOULD_')) {
            messenger.postMessage(eventName);
          } else {
            emit(eventName as keyof EventTypes, undefined);
          }
        }
      },

      undo: () => {
        messenger.postMessage('UNDO');
      },

      redo: () => {
        messenger.postMessage('REDO');
      },

      toggleResultsPanel: () => {
        emit('TOGGLE_RESULTS_PANEL', undefined);
      },
    }), [getSaveState, onSave]);

    return (
      <>
        <ProgressIndicator />
        <AutoCalculateProgress />
        <MaterialSearch />
        <ImportDialog />
        <SaveDialog />
        <Box sx={canvasContainerSx}>
          <div id="response-overlay" className="response_overlay response_overlay-hidden" ref={responseOverlayRef} />
          <div id="canvas_overlay" ref={canvasOverlayRef} />
          <div id="orientation-overlay" ref={orientationOverlayRef} />
          <canvas id="renderer-canvas" ref={canvasRef} />
        </Box>
      </>
    );
  }
);

export default CRAMCanvas;
