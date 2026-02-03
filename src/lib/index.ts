/**
 * CRAM Library - Public API
 *
 * This module exports the main CRAMEditor component and related types
 * for embedding CRAM in a parent React application.
 *
 * Usage (Full Editor):
 * ```tsx
 * import { CRAMEditor, type CRAMEditorRef } from 'cram';
 *
 * function MyApp() {
 *   const cramRef = useRef<CRAMEditorRef>(null);
 *
 *   return (
 *     <CRAMEditor
 *       ref={cramRef}
 *       showNavBar={false}
 *       onSave={(state) => console.log('Saved:', state)}
 *     />
 *   );
 * }
 * ```
 *
 * Usage (Modular - Custom Layout):
 * ```tsx
 * import { CRAMCanvas, ObjectsPanel, SolversPanel, type CRAMEditorRef } from 'cram';
 *
 * function MyApp() {
 *   const cramRef = useRef<CRAMEditorRef>(null);
 *
 *   return (
 *     <div style={{ display: 'flex', height: '100vh' }}>
 *       <div style={{ flex: 1 }}>
 *         <CRAMCanvas ref={cramRef} />
 *       </div>
 *       <div style={{ width: 320 }}>
 *         <ObjectsPanel />
 *         <SolversPanel />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */

// Initialize library mode (registers handlers, sets up cram state)
// This runs as a side effect when the library is imported
import './init';

// Main component (full editor with built-in layout)
export { CRAMEditor, default } from './CRAMEditor';

// Modular components (for custom layouts)
export { CRAMCanvas } from './CRAMCanvas';
export { ObjectCardList as ObjectsPanel } from '../components/object-cards';
export { SolverCardList as SolversPanel } from '../components/solver-cards';

// Types
export type {
  CRAMEditorProps,
  CRAMEditorRef,
  SolverType,
  SaveState,
} from './types';
