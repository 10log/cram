# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CRAM (Computational Room Acoustic Module) is a browser-based application for simulating and exploring acoustic properties of modeled spaces. Built with React, TypeScript, and Three.js, it provides interactive 3D visualization and various acoustic solvers including ray tracing, image source methods, FDTD, and statistical reverberation calculations.

## Development Commands

### Build and Development
- `npm start` - Start development server with hot reload
- `npm run build` - Create production build
- `npm test` - Run tests with Jest

### Testing
The test configuration is in package.json under the "jest" key. Tests should be placed in:
- `src/**/__tests__/**/*.{js,jsx,ts,tsx}`
- `src/**/?(*.)(spec|test).{js,jsx,ts,tsx}`

## Architecture

### Core Object System
The application uses a custom object hierarchy based on Three.js Object3D:

**Container** (`src/objects/container.ts`) - Base class extending THREE.Group
- All scene objects inherit from Container
- Implements save/restore for serialization
- Provides selection/deselection lifecycle
- Key subclasses: Model, Room, Source, Receiver, Surface

**Solver** (`src/compute/solver.ts`) - Abstract base for acoustic solvers
- All simulation engines extend Solver
- Key implementations:
  - `RayTracer` - Stochastic ray tracing for impulse responses
  - `ImageSourceSolver` - Early reflection analysis
  - `RT60` - Statistical reverberation calculations
  - `FDTD_2D` - 2D finite difference time domain simulation
  - `EnergyDecay` - Impulse response analysis

### State Management
Uses Zustand for state management with separate stores:

- `container-store.ts` - Scene objects (Container instances)
- `solver-store.ts` - Active solvers and simulations
- `material-store.ts` - Acoustic materials database
- `result-store.ts` - Simulation results
- `app-store.ts` - Application-wide state
- `settings-store.ts` - User preferences

All stores use Immer for immutable updates. Access via hooks: `useContainer`, `useSolver`, `useMaterial`, `useResult`, `useAppStore`.

### Event System
Two complementary event systems:

1. **Messenger** (`src/messenger.ts`) - Custom pub/sub system
   - `emit(event, payload)` - Dispatch events
   - `on(event, callback)` - Subscribe to events
   - `before/after` - Lifecycle hooks
   - Used for cross-module communication

2. **Standard DOM/Three.js events** - For UI and renderer interactions

### Rendering Pipeline
**Renderer** (`src/render/renderer.ts`) - Three.js WebGL renderer with:
- OrbitControls and TransformControls
- Post-processing with OutlinePass for selection
- PickHelper for object selection
- Custom overlays for transform feedback
- OrientationControl for view navigation

### Component Structure
React components in `src/components/`:
- `App.tsx` - Root component
- `parameter-config/` - Solver and object property editors
- `results/` - Chart components for displaying results
- Property editors use controlled components with direct store updates

### Compute Module Organization
`src/compute/` contains all acoustic calculation engines:
- `acoustics/` - Core acoustic formulas and utilities (air attenuation, frequency bands, FFT)
- `raytracer/` - Ray tracing implementation with BVH acceleration
- `2d-fdtd/` - 2D FDTD solver with WebGL shaders
- `rt/` - Statistical RT60 calculations
- `energy-decay.ts` - Impulse response analysis

### Import System
File import handlers in `src/import-handlers/`:
- Supports: DXF, OBJ, STL, DAE (Collada)
- Preserves layer/group information from CAD software
- All handlers register with central import system

### Material Database
`src/db/material.json` contains acoustic materials with octave-band absorption coefficients. Materials are indexed by UUID and searchable by tags/manufacturer using fast-fuzzy.

## Key Patterns

### Object Lifecycle
1. Create object (extends Container)
2. Add to store via `useContainer.setState()`
3. Object automatically added to renderer scene
4. Save/restore methods for project persistence
5. Dispose when removed to clean up Three.js resources

### Solver Workflow
1. Extend Solver base class
2. Implement `update()` for calculations
3. Add to solver-store
4. UI automatically renders parameter panel
5. Results stored in result-store
6. Implement `save()/restore()` for project files

### State Updates
Always use store setters with Immer:
```typescript
useContainer.setState((state) => {
  state.containers[uuid].property = value;
});
```

### TypeScript Configuration
- Strict mode disabled for Three.js compatibility
- Strict null checks enabled
- Target ES2015, module ESNext
- Experimental decorators enabled
- Source maps generated for debugging

## Important Notes

- The application runs entirely in the browser - no backend required
- Three.js BVH (Bounding Volume Hierarchy) used for accelerated ray-surface intersections
- Web Workers used for computationally intensive tasks (filter processing, etc.)
- Project files saved as JSON with full scene serialization
- LocalStorage used for layout persistence and settings
- Designed for modern browsers with WebGL support
