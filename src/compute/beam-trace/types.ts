import type { VisualizationMode } from "./paths";

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

export const beamTraceDefaults: Required<BeamTraceSolverParams> = {
  name: "Beam Tracer",
  uuid: "",
  roomID: "",
  sourceIDs: [],
  receiverIDs: [],
  maxReflectionOrder: 3,
  visualizationMode: "rays",
  showAllBeams: false,
  visibleOrders: [0, 1, 2, 3],
  frequencies: [125, 250, 500, 1000, 2000, 4000, 8000],
  levelTimeProgression: "",
  impulseResponseResult: "",
  hrtfSubjectId: "D1",
  headYaw: 0,
  headPitch: 0,
  headRoll: 0,
  edgeDiffractionEnabled: false,
  lateReverbTailEnabled: false,
  tailCrossfadeTime: 0,
  tailCrossfadeDuration: 0.05,
};
