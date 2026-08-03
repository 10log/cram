import { default as Messenger } from './messenger';
import { default as Container } from './objects/container';
import { default as AudioFile } from './objects/audio-file';
import { default as Sketch } from './objects/sketch';
import { default as Solver } from './compute/solver';
import { default as Renderer } from './render/renderer';
import { KeyValuePair } from './common/key-value-pair';
import { EditorModes } from './constants/editor-modes';
import { Processes } from './constants/processes';
import { AcousticMaterial } from './db/acoustic-material';
import { Report } from './common/browser-report';
export interface State {
    leftPanelInitialSize: number;
    bottomPanelInitialSize: number;
    rightPanelInitialSize: number;
    rightPanelTopInitialSize: number;
    audiofiles: KeyValuePair<AudioFile>;
    time: number;
    selectedObjects: Container[];
    materialsIndex: KeyValuePair<AcousticMaterial>;
    materials: {
        tags: string[];
        manufacturer: string;
        name: string;
        material: string;
        absorption: {
            "63": number;
            "125": number;
            "250": number;
            "500": number;
            "1000": number;
            "2000": number;
            "4000": number;
            "8000": number;
        };
        nrc: number;
        source: string;
        description: string;
        uuid: string;
    }[];
    materialSearcher: any;
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
export interface Cram {
    state: State;
    messenger: Messenger;
    meta: {
        version: Version;
    };
}
export declare class Cram implements Cram {
    constructor();
}
export declare function finishedLoading(): Promise<void>;
export {};
