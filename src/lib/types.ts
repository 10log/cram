/**
 * Public types for CRAM Editor component
 */

import type { SaveState } from '../store/io';

// Re-export SaveState for consumers
export type { SaveState };

/**
 * Solver types that can be added via the imperative API
 */
export type SolverType =
  | 'raytracer'
  | 'image-source'
  | 'beam-trace'
  | 'fdtd-2d'
  | 'rt60'
  | 'energy-decay'
  | 'art';

/**
 * Props for the CRAMEditor component
 */
export interface CRAMEditorProps {
  // Project lifecycle
  /** Initial project state to load on mount */
  initialProject?: SaveState;
  /** Callback when user triggers save action */
  onSave?: (state: SaveState) => void;
  /** Callback when project state changes (for dirty tracking) */
  onProjectChange?: (state: SaveState) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;

  // Configuration
  /** Prefix for localStorage keys to avoid conflicts (default: 'cram') */
  storagePrefix?: string;
  /** Show the navigation bar (default: true for standalone, false for embedded) */
  showNavBar?: boolean;
  /** Fixed width for the right properties panel in pixels. When set, uses flex layout instead of resizable splitter */
  fixedPanelWidth?: number;
}

/**
 * Imperative handle for the CRAMEditor component.
 * Use React.useRef<CRAMEditorRef>() to get a reference.
 */
export interface CRAMEditorRef {
  // Project operations (replaces File menu)
  /** Create a new empty project */
  newProject: () => void;
  /** Get the current project state */
  save: () => SaveState;
  /** Load a project state */
  load: (state: SaveState) => void;
  /** Import a file (OBJ, STL, DXF, DAE) */
  importFile: (file: File) => Promise<void>;

  // Scene operations (replaces Add menu)
  /** Add a sound source to the scene */
  addSource: () => void;
  /** Add a receiver to the scene */
  addReceiver: () => void;
  /** Add a solver of the specified type */
  addSolver: (type: SolverType) => void;

  // Edit operations
  /** Undo the last action */
  undo: () => void;
  /** Redo the last undone action */
  redo: () => void;

  // View operations
  /** Toggle the results panel visibility */
  toggleResultsPanel: () => void;
}
