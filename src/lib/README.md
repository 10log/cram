# CRAM Editor Component

A reusable React component for embedding CRAM (Computational Room Acoustic Modeling) in parent applications.

## Installation

Add CRAM as a git dependency in your `package.json`:

```json
{
  "dependencies": {
    "cram": "github:your-org/cram#main"
  }
}
```

## Usage

### Basic Import

```tsx
import { CRAMEditor, type CRAMEditorRef, type SaveState } from 'cram';
import 'cram/styles'; // Include required CSS
```

### Basic Example

```tsx
function MyApp() {
  return <CRAMEditor />;
}
```

### With Callbacks and Ref

```tsx
import { useRef } from 'react';
import { CRAMEditor, type CRAMEditorRef, type SaveState } from 'cram';

function MyApp() {
  const cramRef = useRef<CRAMEditorRef>(null);

  const handleSave = (state: SaveState) => {
    // Send to your backend or store locally
    console.log('Project saved:', state);
  };

  const handleProjectChange = (state: SaveState) => {
    // Track dirty state for unsaved changes warning
    setHasUnsavedChanges(true);
  };

  return (
    <CRAMEditor
      ref={cramRef}
      showNavBar={false}
      storagePrefix="myapp-cram"
      onSave={handleSave}
      onProjectChange={handleProjectChange}
      onError={(err) => console.error('CRAM error:', err)}
    />
  );
}
```

---

## Props (CRAMEditorProps)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialProject` | `SaveState` | `undefined` | Initial project state to load on mount. Pass a previously saved `SaveState` object to restore a project. |
| `onSave` | `(state: SaveState) => void` | `undefined` | Callback invoked when the user triggers save (Ctrl+S or File > Save). Receives the complete project state. |
| `onProjectChange` | `(state: SaveState) => void` | `undefined` | Callback invoked whenever the project state changes. Useful for dirty-state tracking or auto-save functionality. |
| `onError` | `(error: Error) => void` | `undefined` | Callback invoked when an error occurs during operations like file import or project load. |
| `storagePrefix` | `string` | `'cram'` | Prefix for localStorage keys to avoid conflicts with other applications. Keys used: `{prefix}-camera`, `{prefix}-layout`, `{prefix}-orientationControl`. |
| `showNavBar` | `boolean` | `true` | Whether to show the navigation bar with File/Edit/Add menus. Set to `false` when embedding and controlling via the imperative ref API. |

---

## Imperative Ref API (CRAMEditorRef)

Access imperative methods via a React ref:

```tsx
const cramRef = useRef<CRAMEditorRef>(null);

// Later in your code:
cramRef.current?.addSource();
```

### Project Operations

| Method | Signature | Description |
|--------|-----------|-------------|
| `newProject` | `() => void` | Create a new empty project, clearing all current objects and solvers. |
| `save` | `() => SaveState` | Get the current project state as a serializable object. |
| `load` | `(state: SaveState) => void` | Load a project from a previously saved `SaveState` object. |
| `importFile` | `(file: File) => Promise<void>` | Import a geometry file. Supported formats: OBJ, STL, DXF, DAE (Collada). |

### Scene Operations

| Method | Signature | Description |
|--------|-----------|-------------|
| `addSource` | `() => void` | Add a sound source to the scene at the default position. |
| `addReceiver` | `() => void` | Add a receiver (microphone) to the scene at the default position. |
| `addSolver` | `(type: SolverType) => void` | Add an acoustic solver of the specified type (see Solver Types below). |

### Edit Operations

| Method | Signature | Description |
|--------|-----------|-------------|
| `undo` | `() => void` | Undo the last action. |
| `redo` | `() => void` | Redo the last undone action. |

### View Operations

| Method | Signature | Description |
|--------|-----------|-------------|
| `toggleResultsPanel` | `() => void` | Toggle the visibility of the results panel. |

---

## Solver Types

The `addSolver` method accepts one of the following solver types:

| Type | Description |
|------|-------------|
| `'raytracer'` | Stochastic ray tracing for impulse response calculation |
| `'image-source'` | Image source method for early reflection analysis |
| `'beam-trace'` | 2D beam tracing for visualization |
| `'fdtd-2d'` | 2D Finite Difference Time Domain simulation |
| `'rt60'` | Statistical reverberation time (RT60) calculation |
| `'energy-decay'` | Energy decay curve analysis from impulse responses |
| `'art'` | Acoustic radiance transfer method |

### Example: Adding Solvers

```tsx
// Add a ray tracer
cramRef.current?.addSolver('raytracer');

// Add RT60 calculator
cramRef.current?.addSolver('rt60');
```

---

## SaveState Type

The `SaveState` object contains the complete serialized project:

```typescript
interface SaveState {
  containers: Record<string, ContainerState>;  // Scene objects (rooms, sources, receivers)
  solvers: Record<string, SolverState>;        // Active solvers and their parameters
  materials: Record<string, MaterialState>;    // Custom materials
  results: Record<string, ResultState>;        // Simulation results
  metadata: {
    version: string;
    created: string;
    modified: string;
  };
}
```

This object can be:
- Serialized to JSON for storage
- Sent to a backend API
- Stored in localStorage or IndexedDB
- Passed back to `load()` or `initialProject` to restore

---

## localStorage Keys

CRAM uses localStorage to persist user preferences. All keys are prefixed with the `storagePrefix` prop value (default: `'cram'`):

| Key | Description |
|-----|-------------|
| `{prefix}-camera` | Camera position and orientation |
| `{prefix}-layout` | Splitter panel layout state |
| `{prefix}-orientationControl` | View cube visibility preference |

To avoid conflicts when embedding multiple instances or alongside other applications, provide a unique `storagePrefix`.

---

## Lifecycle and Cleanup

The CRAMEditor component properly cleans up resources on unmount:

- Three.js renderer and WebGL context disposed
- Event listeners removed
- Animation frames cancelled
- Zustand stores reset

This allows safe mounting/unmounting without memory leaks.

---

## Styling

Import the required styles in your application:

```tsx
import 'cram/styles';
```

This includes:
- normalize.css
- Blueprint.js core styles (for NavBar component)
- CRAM-specific styles

The component uses MUI (Material-UI) for most UI elements. If your parent application also uses MUI, styles will integrate seamlessly with your theme.

---

## Example: Full Integration

```tsx
import { useRef, useState, useEffect } from 'react';
import { CRAMEditor, type CRAMEditorRef, type SaveState } from 'cram';
import 'cram/styles';

function AcousticsPage() {
  const cramRef = useRef<CRAMEditorRef>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialProject, setInitialProject] = useState<SaveState | undefined>();

  // Load project from backend on mount
  useEffect(() => {
    fetch('/api/projects/current')
      .then(res => res.json())
      .then(setInitialProject);
  }, []);

  const handleSave = async (state: SaveState) => {
    await fetch('/api/projects/current', {
      method: 'PUT',
      body: JSON.stringify(state),
    });
    setHasUnsavedChanges(false);
  };

  return (
    <div style={{ height: '100vh' }}>
      {/* Custom toolbar */}
      <div className="toolbar">
        <button onClick={() => cramRef.current?.addSource()}>
          Add Source
        </button>
        <button onClick={() => cramRef.current?.addReceiver()}>
          Add Receiver
        </button>
        <button onClick={() => cramRef.current?.addSolver('raytracer')}>
          Add Ray Tracer
        </button>
        <button onClick={() => cramRef.current?.undo()}>
          Undo
        </button>
        <button onClick={() => cramRef.current?.redo()}>
          Redo
        </button>
      </div>

      {/* CRAM Editor */}
      <CRAMEditor
        ref={cramRef}
        initialProject={initialProject}
        showNavBar={false}
        storagePrefix="myapp-acoustics"
        onSave={handleSave}
        onProjectChange={() => setHasUnsavedChanges(true)}
        onError={(err) => alert(`Error: ${err.message}`)}
      />

      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && <span className="unsaved-dot" />}
    </div>
  );
}
```

---

## TypeScript Support

All types are exported from the main entry point:

```tsx
import type {
  CRAMEditorProps,
  CRAMEditorRef,
  SolverType,
  SaveState,
} from 'cram';
```
