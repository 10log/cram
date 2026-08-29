import { VisualizationMode } from './paths';
export type { VisualizationMode };
export interface BeamTraceSaveObject {
    name: string;
    kind: "beam-trace";
    uuid: string;
    autoCalculate: boolean;
    roomID: string;
    sourceIDs: string[];
    receiverIDs: string[];
    maxReflectionOrder: number;
    visualizationMode: VisualizationMode;
    showAllBeams: boolean;
    visibleOrders: number[];
    frequencies: number[];
    levelTimeProgression: string;
    impulseResponseResult: string;
    hrtfSubjectId?: string;
    headYaw?: number;
    headPitch?: number;
    headRoll?: number;
    edgeDiffractionEnabled?: boolean;
    lateReverbTailEnabled?: boolean;
    tailCrossfadeTime?: number;
    tailCrossfadeDuration?: number;
}
export interface BeamTraceSolverParams {
    name?: string;
    uuid?: string;
    roomID?: string;
    sourceIDs?: string[];
    receiverIDs?: string[];
    maxReflectionOrder?: number;
    visualizationMode?: VisualizationMode;
    showAllBeams?: boolean;
    visibleOrders?: number[];
    frequencies?: number[];
    levelTimeProgression?: string;
    impulseResponseResult?: string;
    hrtfSubjectId?: string;
    headYaw?: number;
    headPitch?: number;
    headRoll?: number;
    edgeDiffractionEnabled?: boolean;
    lateReverbTailEnabled?: boolean;
    tailCrossfadeTime?: number;
    tailCrossfadeDuration?: number;
}
export declare const beamTraceDefaults: Required<BeamTraceSolverParams>;
