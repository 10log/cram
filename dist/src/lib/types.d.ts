import { SaveState } from '../store/io';
import { ThemeMode } from '../themes';
export type { SaveState };
export type { ThemeMode };
/**
 * Solver types that can be added via the imperative API
 */
export type SolverType = 'raytracer' | 'image-source' | 'beam-trace' | 'fdtd-2d' | 'rt60' | 'energy-decay' | 'art';
/**
 * Props for the CRAMEditor component
 */
export interface CRAMEditorProps {
    /** Initial project state to load on mount */
    initialProject?: SaveState;
    /** Callback when user triggers save action */
    onSave?: (state: SaveState) => void;
    /** Callback when project state changes (for dirty tracking) */
    onProjectChange?: (state: SaveState) => void;
    /** Callback when an error occurs */
    onError?: (error: Error) => void;
    /** Prefix for localStorage keys to avoid conflicts (default: 'cram') */
    storagePrefix?: string;
    /** Show the navigation bar (default: true for standalone, false for embedded) */
    showNavBar?: boolean;
    /** Theme mode for the 3D canvas ('light' | 'dark'). When provided, syncs with parent app theme. */
    themeMode?: ThemeMode;
}
/**
 * Imperative handle for the CRAMEditor component.
 * Use React.useRef<CRAMEditorRef>() to get a reference.
 */
export interface CRAMEditorRef {
    /** Create a new empty project */
    newProject: () => void;
    /** Get the current project state */
    save: () => SaveState;
    /** Load a project state */
    load: (state: SaveState) => void;
    /** Import a file (OBJ, STL, DXF, DAE, GLTF, GLB) */
    importFile: (file: File) => Promise<void>;
    /** Open a built-in example project */
    openExample: (name: string) => void;
    /** Add a sound source to the scene */
    addSource: () => void;
    /** Add a receiver to the scene */
    addReceiver: () => void;
    /** Add a solver of the specified type */
    addSolver: (type: SolverType) => void;
    /** Undo the last action */
    undo: () => void;
    /** Redo the last undone action */
    redo: () => void;
    /** Toggle the results panel visibility */
    toggleResultsPanel: () => void;
}
