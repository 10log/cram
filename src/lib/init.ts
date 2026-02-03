/**
 * Library mode initialization
 *
 * This module sets up the cram state and registers all message handlers
 * for the library build. It runs as a side effect when the library is imported.
 */

import { messenger } from '../messenger';
import { renderer } from '../render/renderer';
import { registerMessageHandlers } from './registerHandlers';
import { Searcher } from 'fast-fuzzy';
import browserReport from '../common/browser-report';

// Materials database
import materials from '../db/material.json';
import { AcousticMaterial } from '../db/acoustic-material';

// Constants
import { EditorModes } from '../constants/editor-modes';
import { Processes } from '../constants/processes';

// Layout defaults
import { layout as defaultLayout } from '../default-storage';
import storage from './storage';

// Types
import type { KeyValuePair } from '../common/key-value-pair';
import type Container from '../objects/container';
import type Sketch from '../objects/sketch';
import type Solver from '../compute/solver';
import type AudioFile from '../objects/audio-file';
import type Renderer from '../render/renderer';
import type Messenger from '../messenger';
import type { Report } from '../common/browser-report';

// Build materials index
const materialsIndex: KeyValuePair<AcousticMaterial> = {};
materials.forEach((x) => {
  materialsIndex[x.uuid] = x;
});

// Get layout from storage or defaults
const layout = JSON.parse(storage.getItem("layout") || defaultLayout);

// State interface matching src/index.tsx
interface State {
  leftPanelInitialSize: number;
  bottomPanelInitialSize: number;
  rightPanelInitialSize: number;
  rightPanelTopInitialSize: number;
  audiofiles: KeyValuePair<AudioFile>;
  time: number;
  selectedObjects: Container[];
  materialsIndex: KeyValuePair<AcousticMaterial>;
  materials: typeof materials;
  materialSearcher: Searcher<typeof materials[0], { keySelector: (obj: typeof materials[0]) => string }>;
  sources: string[];
  receivers: string[];
  containers: KeyValuePair<Container>;
  constructions: KeyValuePair<Container>;
  sketches: KeyValuePair<Sketch>;
  solvers: KeyValuePair<Solver>;
  renderer: Renderer;
  editorMode: EditorModes;
  currentProcess: Processes;
  browser: Report;
}

type Version = `${number}.${number}.${number}`;

interface Cram {
  state: State;
  messenger: Messenger;
  meta: {
    version: Version;
  };
}

// Create cram state for library mode
const state: State = {
  leftPanelInitialSize: layout.leftPanelInitialSize,
  bottomPanelInitialSize: layout.bottomPanelInitialSize,
  rightPanelInitialSize: layout.rightPanelInitialSize,
  rightPanelTopInitialSize: layout.rightPanelTopInitialSize,
  audiofiles: {} as KeyValuePair<AudioFile>,
  time: 0,
  selectedObjects: [] as Container[],
  materialsIndex,
  materials,
  materialSearcher: new Searcher(materials, {
    keySelector: (obj) => obj.material
  }),
  sources: [] as string[],
  receivers: [] as string[],
  containers: {} as KeyValuePair<Container>,
  constructions: {} as KeyValuePair<Container>,
  sketches: {} as KeyValuePair<Sketch>,
  solvers: {} as KeyValuePair<Solver>,
  renderer: renderer,
  editorMode: EditorModes.OBJECT as EditorModes,
  currentProcess: Processes.NONE as Processes,
  browser: browserReport(navigator.userAgent),
};

export const cram: Cram = {
  state,
  messenger,
  meta: {
    version: "0.2.1"
  }
};

// Register all message handlers
registerMessageHandlers(cram, messenger);

console.log('[CRAM] Library mode initialized');
