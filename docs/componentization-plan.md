# Plan: Make CRAM a Reusable React Component for Project Varese

## Requirements (Confirmed)

- **Single instance** per page (no multi-instance isolation needed)
- **Moderate control** with props and callbacks
- **Shared MUI styles** - migrate away from Blueprint.js to MUI
- **Minimal restructuring** - preserve standalone mode for public GitHub fork users

## Integration Model: Follow RT Calculator Pattern

Project Varese already has the perfect integration model: the RT Calculator at `src/pages/rt-calculator/`. CRAM will follow the same pattern:
- Lazy-loaded page module
- Feature flag controlled
- Encapsulated state (Zustand stays internal)
- Nested routes for standalone + project-linked modes

---

## Implementation Plan

### Phase 1: Create Library Entry Point in CRAM

**Goal:** Export CRAM as an embeddable component while preserving standalone mode.

**Files to create/modify in CRAM repo:**

1. **Create `src/lib/index.ts`** - Public API entry point
   ```typescript
   export { CRAMEditor } from './CRAMEditor';
   export type { CRAMEditorProps, CRAMEditorRef, SaveState } from './types';
   ```

2. **Create `src/lib/CRAMEditor.tsx`** - Main embeddable component
   - Initialize singletons in `useEffect` (not at module load)
   - Accept props for configuration and callbacks
   - Expose imperative ref for programmatic control
   - Handle cleanup on unmount

3. **Create `src/lib/types.ts`** - Public type definitions
   ```typescript
   export interface CRAMEditorProps {
     // Project lifecycle
     initialProject?: SaveState;
     onSave?: (state: SaveState) => void;
     onProjectChange?: (state: SaveState) => void;
     onError?: (error: Error) => void;

     // Configuration
     storagePrefix?: string;  // For localStorage namespacing
     showNavBar?: boolean;    // false for embedded mode (default: true for standalone)
   }

   export interface CRAMEditorRef {
     // Project operations (replaces File menu)
     newProject: () => void;
     save: () => SaveState;
     load: (state: SaveState) => void;
     importFile: (file: File) => Promise<void>;

     // Scene operations (replaces Add menu)
     addSource: () => void;
     addReceiver: () => void;
     addSolver: (type: 'raytracer' | 'image-source' | 'beam-trace' | 'fdtd-2d' | 'rt60' | 'energy-decay' | 'art') => void;

     // Edit operations
     undo: () => void;
     redo: () => void;

     // View operations
     toggleResultsPanel: () => void;
   }
   ```

4. **Modify `src/index.tsx`** - Thin wrapper using CRAMEditor
   - Remove initialization code (moved to CRAMEditor)
   - Keep as standalone entry point

### Phase 2: Refactor Singletons for Lazy Initialization

**Goal:** Move singleton creation from module-load to component lifecycle.

**Files to modify:**

1. **`src/render/renderer.ts`**
   - Remove line 1094: `export const renderer = new Renderer();`
   - Add `createRenderer()` factory function
   - Add `dispose()` method for cleanup

2. **`src/messenger.ts`**
   - Remove line 160: `export const messenger = new Messenger();`
   - Add `createMessenger()` factory function
   - Instance passed via React Context

3. **`src/index.tsx`**
   - Move ~50 messenger handler registrations into `CRAMEditor` initialization
   - Create `registerMessageHandlers(messenger, renderer, ...)` function

4. **`src/store/*.ts`** (container, solver, material, result, app, settings)
   - Keep as module-level singletons (OK for single instance)
   - Add `resetStore()` functions for cleanup between loads

### Phase 3: Add Lifecycle Cleanup

**Goal:** Proper unmount cleanup to prevent memory leaks.

**Files to modify:**

1. **`src/render/renderer.ts`**
   - Add `dispose()` method:
     - Remove window event listeners
     - Dispose Three.js geometries, materials, textures
     - Cancel animation frame
     - Dispose WebGL context

2. **`src/lib/CRAMEditor.tsx`**
   - `useEffect` cleanup function calls:
     - `renderer.dispose()`
     - `messenger.clear()`
     - Reset all Zustand stores

3. **localStorage namespacing**
   - Prefix keys with `storagePrefix` prop
   - Keys: `camera`, `layout`, `orientationControl`

### Phase 4: Blueprint.js to MUI Migration

**Goal:** Replace Blueprint.js components with MUI equivalents.

**Scope reduced:** NavBar excluded (replaced by imperative ref API). Remaining: **13 files**.

| Priority | Component | Files | MUI Equivalent | Effort |
|----------|-----------|-------|----------------|--------|
| 1 | Dialog | SaveDialog, ImportDialog, OpenWarning | `Dialog` | 2-3 hrs |
| 2 | Menu | ContextMenu, SolverCardHeader | `Menu` | 1-2 hrs |
| 3 | Drawer | MaterialSearch, SettingsDrawer | `Drawer` | 1 hr |
| 4 | Tabs | ParameterConfig | `Tabs` | 30 min |
| 5 | Button/Tag | SurfaceProperties | `Button`, `Chip` | 30 min |
| 6 | Table | Stats.tsx (`@blueprintjs/table`) | `Table` or `DataGrid` | 2-3 hrs |
| 7 | Trivial | App.tsx, ObjectView, *Properties | Remove/replace constants | 30 min |

**Key mapping:**
- `Intent.PRIMARY` → `color="primary"`
- `Intent.SUCCESS` → `color="success"`
- `minimal={true}` → `variant="text"`
- `Classes.*` → MUI's built-in structure
- `FocusStyleManager` → Remove (MUI handles this)
- `Colors.*` → `theme.palette.*`

**Estimated time: ~8-10 hours** (down from 12-20 with NavBar)

### Phase 5: Package Configuration

**Goal:** Enable import from parent project.

**Option A: Git dependency (Recommended for now)**
```json
// In project-varese/package.json
{
  "dependencies": {
    "cram": "github:your-org/cram#main"
  }
}
```

**Files to modify in CRAM:**

1. **`package.json`** - Add exports field
   ```json
   {
     "exports": {
       ".": "./src/lib/index.ts",
       "./styles": "./src/css/index.ts"
     }
   }
   ```

2. **Create `tsconfig.lib.json`** - Library build config

---

## Files to Modify (Summary)

### CRAM Repository

| File | Action | Description |
|------|--------|-------------|
| `src/lib/index.ts` | CREATE | Public API exports |
| `src/lib/CRAMEditor.tsx` | CREATE | Main embeddable component |
| `src/lib/types.ts` | CREATE | Public TypeScript types |
| `src/index.tsx` | MODIFY | Use CRAMEditor, keep standalone mode |
| `src/render/renderer.ts` | MODIFY | Factory function, dispose method |
| `src/messenger.ts` | MODIFY | Factory function |
| `src/store/*.ts` | MODIFY | Add reset functions |
| `src/components/*.tsx` | MODIFY | Blueprint → MUI (13 files, excludes NavBar) |
| `src/css/index.ts` | MODIFY | Remove Blueprint CSS imports |
| `package.json` | MODIFY | Add exports field |

### Project Varese (After CRAM changes)

| File | Action | Description |
|------|--------|-------------|
| `package.json` | MODIFY | Add CRAM dependency |
| `src/pages/cram/index.tsx` | CREATE | Lazy-loaded entry |
| `src/pages/cram/cram_page.tsx` | CREATE | Main page component |
| `src/pages/cram/CRAMLayout.tsx` | CREATE | Dashboard layout wrapper |
| `src/pages/App.tsx` | MODIFY | Add CRAM routes |
| `src/config/feature_flags.ts` | MODIFY | Add CRAM flag |

---

## Execution Order

1. **Phase 1** - Create library entry point (~2 hours)
2. **Phase 2** - Refactor singletons (~4 hours)
3. **Phase 3** - Add lifecycle cleanup (~2 hours)
4. **Phase 4** - Blueprint → MUI migration (~8-10 hours)
5. **Phase 5** - Package configuration (~1 hour)
6. **Varese integration** - After CRAM changes (~4 hours)

**Total estimate: 21-25 hours**

---

## Risk Mitigation

1. **Standalone mode preservation**
   - `src/index.tsx` remains as standalone entry
   - All initialization logic reusable via `CRAMEditor`
   - Tests verify both modes work

2. **Breaking changes for fork users**
   - Document migration in CHANGELOG
   - Keep public API backward compatible where possible
   - Major version bump (1.x → 2.0)

3. **MUI migration issues**
   - Migrate incrementally, one component type at a time
   - Test each migration before proceeding
   - Keep Blueprint as fallback until fully migrated
