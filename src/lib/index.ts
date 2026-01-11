/**
 * CRAM Library - Public API
 *
 * This module exports the main CRAMEditor component and related types
 * for embedding CRAM in a parent React application.
 *
 * Usage:
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
 */

// Main component
export { CRAMEditor, default } from './CRAMEditor';

// Types
export type {
  CRAMEditorProps,
  CRAMEditorRef,
  SolverType,
  SaveState,
} from './types';
