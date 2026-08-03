import { Searcher } from 'fast-fuzzy';
import { default as materials } from '../db/material.json';
import { AcousticMaterial } from '../db/acoustic-material';
import { EditorModes } from '../constants/editor-modes';
import { Processes } from '../constants/processes';
import { KeyValuePair } from '../common/key-value-pair';
import { default as Container } from '../objects/container';
import { default as Sketch } from '../objects/sketch';
import { default as Solver } from '../compute/solver';
import { default as AudioFile } from '../objects/audio-file';
import { default as Renderer } from '../render/renderer';
import { default as Messenger } from '../messenger';
import { Report } from '../common/browser-report';
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
    materialSearcher: Searcher<typeof materials[0], {
        keySelector: (obj: typeof materials[0]) => string;
    }>;
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
export declare const cram: Cram;
export {};
