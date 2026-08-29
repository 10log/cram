import Solver from "../solver";
import * as THREE from "three";
import { MeshLine } from "three.meshline";
import { v4 as uuidv4 } from "uuid";
import { Source3D, Solver3D } from "beam-trace";
import type {
  ReflectionPath3D,
  DetailedReflectionPath3D,
  BeamVisualizationData,
  Vector3 as BT_Vector3,
} from "beam-trace";

import Room, { getRooms } from "../../objects/room";
import Source from "../../objects/source";
import Receiver from "../../objects/receiver";
import Surface from "../../objects/surface";
import { emit } from "../../messenger";
import { renderer } from "../../render/renderer";
import { useContainer, useResult, ResultKind, Result } from "../../store";
import { pickProps } from "../../common/helpers";
import * as ac from "../acoustics";
import { audioEngine } from "../../audio-engine/audio-engine";
import {
  playImpulseResponse as sharedPlayIR,
  downloadImpulseResponse as sharedDownloadIR,
  downloadAmbisonicImpulseResponse as sharedDownloadAmbisonicIR,
  playBinauralImpulseResponse as sharedPlayBinauralIR,
  downloadBinauralImpulseResponse as sharedDownloadBinauralIR,
} from "../shared/export-playback";
import type { EdgeGraph } from "../shared/diffraction";
import type { ResponseByIntensity } from "../shared/response-by-intensity-types";
import type { QuickEstimateStepResult } from "../shared/quick-estimate-types";
import { KVP } from "../../common/key-value-pair";
import type { BeamTraceSaveObject, BeamTraceSolverParams } from "./types";
import { beamTraceDefaults } from "./types";
import {
  buildEnergyHistogram,
  calculateLevelTimeProgression as calculateLTPImpl,
  calculateResponseByIntensity as calculateRBIImpl,
} from "./results";
import { startQuickEstimate as startQuickEstimateImpl } from "./quick-estimate";
import { registerBeamTraceEvents } from "./events";

import { calculateArrivalPressure } from "./arrival-pressure";
import { convertPath } from "./paths";
import type { BeamTracePath, VisualizationMode } from "./paths";
import { extractPolygons, currentTreeSignature } from "./geometry";
import { computeDiffractionPaths } from "./diffraction";
import {
  createHighlightLine,
  clearGroup,
  clearVisualization,
  drawPaths as drawPathsImpl,
  drawBeams as drawBeamsImpl,
  highlightVirtualSourcePath,
  highlightPathByIndex as highlightPathByIndexImpl,
  setupClickHandler,
  removeClickHandler,
  redrawVisualization,
} from "./visualization";
import {
  calculateMonoImpulseResponse,
  calculateAmbisonicImpulseResponse as calculateAmbisonicIRImpl,
  calculateBinauralImpulseResponse as calculateBinauralIRImpl,
  downloadOctaveBandIR as downloadOctaveBandIRImpl,
  updateImpulseResponseResult,
} from "./impulse-response";

export type { BeamTracePath, VisualizationMode } from "./paths";
export type { BeamTraceSaveObject, BeamTraceSolverParams } from "./types";
export { calculateArrivalPressure, directivityBandEnergy } from "./arrival-pressure";

export class BeamTraceSolver extends Solver {
  roomID: string;
  sourceIDs: string[];
  receiverIDs: string[];
  maxReflectionOrder: number;
  frequencies: number[];
  levelTimeProgression: string;
  impulseResponseResult: string;

  private _visualizationMode: VisualizationMode;
  private _showAllBeams: boolean;
  private _visibleOrders: number[];
  private _plotFrequency: number;
  private _plotOrders: number[];

  private btSolver: Solver3D | null = null;
  private polygons: ReturnType<typeof extractPolygons>["polygons"] = [];
  private surfaceToPolygonIndex: Map<string, number[]> = new Map();
  private polygonToSurface: Map<number, Surface> = new Map();

  edgeDiffractionEnabled: boolean;
  private _edgeGraph: EdgeGraph | null = null;
  _raycaster: THREE.Raycaster = new THREE.Raycaster();

  lateReverbTailEnabled: boolean;
  tailCrossfadeTime: number;
  tailCrossfadeDuration: number;
  private _energyHistogram: Float32Array[] | null = null;

  hrtfSubjectId: string;
  headYaw: number;
  headPitch: number;
  headRoll: number;
  binauralImpulseResponse?: AudioBuffer;
  binauralPlaying: boolean = false;

  validPaths: BeamTracePath[] = [];
  impulseResponse!: AudioBuffer;
  impulseResponsePlaying: boolean = false;

  responseByIntensity: KVP<KVP<ResponseByIntensity>> | undefined;

  quickEstimateResults: QuickEstimateStepResult[] = [];
  estimatedT30: number[] | null = null;
  _quickEstimateInterval: number | null = null;

  lastMetrics: {
    validPathCount: number;
    raycastCount: number;
    failPlaneCacheHits: number;
    bucketsSkipped: number;
    bufferUsage?: {
      linesUsed: number;
      linesCapacity: number;
      linesPercent: number;
      pointsUsed: number;
      pointsCapacity: number;
      pointsPercent: number;
      overflowWarning: boolean;
    };
  } | null = null;

  private virtualSourcesGroup: THREE.Group;
  private virtualSourceMap: Map<THREE.Mesh, BeamVisualizationData & { polygonPath: number[] }> = new Map();
  private selectedVirtualSource: THREE.Mesh | null = null;
  private clickHandler: ((event: MouseEvent) => void) | null = null;
  private hoverHandler: ((event: MouseEvent) => void) | null = null;
  private selectedPath: THREE.Mesh;
  private selectedBeamsGroup: THREE.Group;
  private _lastTreeSignature: string | null = null;

  constructor(params: BeamTraceSolverParams = {}) {
    super(params);
    const p = { ...beamTraceDefaults, ...params };

    this.kind = "beam-trace";
    this.uuid = p.uuid || uuidv4();
    this.name = p.name;
    this.roomID = p.roomID;
    this.sourceIDs = p.sourceIDs;
    this.receiverIDs = p.receiverIDs;
    this.maxReflectionOrder = p.maxReflectionOrder;
    this.frequencies = p.frequencies;
    this.hrtfSubjectId = p.hrtfSubjectId;
    this.headYaw = p.headYaw;
    this.headPitch = p.headPitch;
    this.headRoll = p.headRoll;
    this.edgeDiffractionEnabled = p.edgeDiffractionEnabled;
    this.lateReverbTailEnabled = p.lateReverbTailEnabled;
    this.tailCrossfadeTime = p.tailCrossfadeTime;
    this.tailCrossfadeDuration = p.tailCrossfadeDuration;
    this._visualizationMode = p.visualizationMode;
    this._showAllBeams = p.showAllBeams;
    this._visibleOrders = p.visibleOrders.length > 0 ? p.visibleOrders : Array.from({ length: p.maxReflectionOrder + 1 }, (_, i) => i);
    this._plotFrequency = 1000;
    this._plotOrders = Array.from({ length: p.maxReflectionOrder + 1 }, (_, i) => i);
    this.levelTimeProgression = p.levelTimeProgression || uuidv4();
    this.impulseResponseResult = p.impulseResponseResult || uuidv4();

    if (!this.roomID) {
      const rooms = getRooms();
      if (rooms.length > 0) this.roomID = rooms[0].uuid;
    }

    emit("ADD_RESULT", {
      kind: ResultKind.LevelTimeProgression,
      data: [],
      info: { initialSPL: [100], frequency: [this._plotFrequency], maxOrder: this.maxReflectionOrder },
      name: `LTP - ${this.name}`,
      uuid: this.levelTimeProgression,
      from: this.uuid,
    } as Result<ResultKind.LevelTimeProgression>);

    emit("ADD_RESULT", {
      kind: ResultKind.ImpulseResponse,
      data: [],
      info: {
        sampleRate: 44100,
        sourceName: "",
        receiverName: "",
        sourceId: this.sourceIDs[0] || "",
        receiverId: this.receiverIDs[0] || "",
      },
      name: `IR - ${this.name}`,
      uuid: this.impulseResponseResult,
      from: this.uuid,
    } as Result<ResultKind.ImpulseResponse>);

    this.selectedPath = createHighlightLine();
    renderer.markup.add(this.selectedPath);
    this.selectedBeamsGroup = new THREE.Group();
    this.selectedBeamsGroup.name = "selected-beams-highlight";
    renderer.markup.add(this.selectedBeamsGroup);
    this.virtualSourcesGroup = new THREE.Group();
    this.virtualSourcesGroup.name = "virtual-sources";
    renderer.markup.add(this.virtualSourcesGroup);
  }

  get temperature(): number {
    return this.room?.temperature ?? 20;
  }

  get c(): number {
    return ac.soundSpeed(this.temperature);
  }

  save(): BeamTraceSaveObject {
    return {
      ...pickProps([
        "name", "kind", "uuid", "autoCalculate", "roomID", "sourceIDs", "receiverIDs",
        "maxReflectionOrder", "frequencies", "levelTimeProgression", "impulseResponseResult",
        "hrtfSubjectId", "headYaw", "headPitch", "headRoll", "edgeDiffractionEnabled",
        "lateReverbTailEnabled", "tailCrossfadeTime", "tailCrossfadeDuration",
      ], this),
      visualizationMode: this._visualizationMode,
      showAllBeams: this._showAllBeams,
      visibleOrders: this._visibleOrders,
    } as BeamTraceSaveObject;
  }

  restore(state: BeamTraceSaveObject): this {
    this.name = state.name;
    this.uuid = state.uuid;
    this.autoCalculate = state.autoCalculate ?? false;
    this.roomID = state.roomID;
    this.sourceIDs = state.sourceIDs;
    this.receiverIDs = state.receiverIDs;
    this.maxReflectionOrder = state.maxReflectionOrder;
    this._visualizationMode = state.visualizationMode || "rays";
    this._showAllBeams = state.showAllBeams ?? false;
    this._visibleOrders = state.visibleOrders ?? Array.from({ length: this.maxReflectionOrder + 1 }, (_, i) => i);
    this.frequencies = state.frequencies;
    this.levelTimeProgression = state.levelTimeProgression || uuidv4();
    this.impulseResponseResult = state.impulseResponseResult || uuidv4();
    this.hrtfSubjectId = state.hrtfSubjectId ?? "D1";
    this.headYaw = state.headYaw ?? 0;
    this.headPitch = state.headPitch ?? 0;
    this.headRoll = state.headRoll ?? 0;
    this.edgeDiffractionEnabled = state.edgeDiffractionEnabled ?? false;
    this.lateReverbTailEnabled = state.lateReverbTailEnabled ?? false;
    this.tailCrossfadeTime = state.tailCrossfadeTime ?? 0;
    this.tailCrossfadeDuration = state.tailCrossfadeDuration ?? 0.05;
    return this;
  }

  dispose() {
    this.reset();
    this.removeClickHandler();
    renderer.markup.remove(this.selectedPath);
    renderer.markup.remove(this.selectedBeamsGroup);
    renderer.markup.remove(this.virtualSourcesGroup);
    this.selectedPath.geometry?.dispose();
    const material = this.selectedPath.material;
    if (material instanceof THREE.Material) material.dispose();
    else if (Array.isArray(material)) {
      for (const mat of material) if (mat instanceof THREE.Material) mat.dispose();
    }
    emit("REMOVE_RESULT", this.levelTimeProgression);
    emit("REMOVE_RESULT", this.impulseResponseResult);
  }

  private clickHost() {
    const host: {
      virtualSourceMap: Map<THREE.Mesh, BeamVisualizationData & { polygonPath: number[] }>;
      selectedVirtualSource: THREE.Mesh | null;
      clickHandler: ((event: MouseEvent) => void) | null;
      hoverHandler: ((event: MouseEvent) => void) | null;
      onSelectBeam: (beam: BeamVisualizationData & { polygonPath: number[] }) => void;
      onDeselect: () => void;
    } = {
      virtualSourceMap: this.virtualSourceMap,
      clickHandler: this.clickHandler,
      hoverHandler: this.hoverHandler,
      onSelectBeam: (beam) => this.highlightVirtualSourcePath(beam),
      onDeselect: () => this.clearSelectedBeams(),
      selectedVirtualSource: null,
    };
    Object.defineProperty(host, "selectedVirtualSource", {
      get: () => this.selectedVirtualSource,
      set: (v: THREE.Mesh | null) => { this.selectedVirtualSource = v; },
      enumerable: true,
      configurable: true,
    });
    return host;
  }

  private setupClickHandler() {
    const host = this.clickHost();
    setupClickHandler(host);
    this.clickHandler = host.clickHandler;
    this.hoverHandler = host.hoverHandler;
  }

  private removeClickHandler() {
    const host = this.clickHost();
    removeClickHandler(host);
    this.clickHandler = host.clickHandler;
    this.hoverHandler = host.hoverHandler;
  }

  private highlightVirtualSourcePath(beam: BeamVisualizationData & { polygonPath: number[] }) {
    const receiver = this.receiverIDs.length === 0
      ? undefined
      : useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
    highlightVirtualSourcePath({
      beam,
      validPaths: this.validPaths,
      maxReflectionOrder: this.maxReflectionOrder,
      receiver,
      selectedPath: this.selectedPath,
      selectedBeamsGroup: this.selectedBeamsGroup,
    });
  }

  private extractPolygons() {
    const extracted = extractPolygons(this.room);
    this.polygons = extracted.polygons;
    this.surfaceToPolygonIndex = extracted.surfaceToPolygonIndex;
    this.polygonToSurface = extracted.polygonToSurface;
    return extracted.polygons;
  }

  private currentTreeSignature(): string | null {
    if (this.sourceIDs.length === 0) return null;
    const source = useContainer.getState().containers[this.sourceIDs[0]] as Source | undefined;
    return currentTreeSignature({
      source,
      room: this.room,
      roomID: this.roomID,
      maxOrder: this.maxReflectionOrder,
    });
  }

  private needsBeamTreeRebuild(): boolean {
    if (!this.btSolver) return true;
    const sig = this.currentTreeSignature();
    if (sig === null) return true;
    return sig !== this._lastTreeSignature;
  }

  buildSolver() {
    if (this.sourceIDs.length === 0) {
      console.warn("BeamTraceSolver: No source selected");
      return;
    }
    const source = useContainer.getState().containers[this.sourceIDs[0]] as Source;
    if (!source) {
      console.warn("BeamTraceSolver: Source not found");
      return;
    }
    this.polygons = this.extractPolygons();
    if (this.polygons.length === 0) {
      console.warn("BeamTraceSolver: No polygons extracted from room");
      return;
    }
    const sourcePos: BT_Vector3 = [source.position.x, source.position.y, source.position.z];
    this.btSolver = new Solver3D(this.polygons, new Source3D(sourcePos), {
      maxReflectionOrder: this.maxReflectionOrder,
    });
    this._lastTreeSignature = this.currentTreeSignature();
    console.log(`BeamTraceSolver: Built with ${this.polygons.length} polygons, max order ${this.maxReflectionOrder}`);
  }

  calculate() {
    if (this.sourceIDs.length === 0 || this.receiverIDs.length === 0) {
      console.warn("BeamTraceSolver: Need at least one source and one receiver");
      return;
    }
    if (this.sourceIDs.length > 1) {
      console.warn(`BeamTraceSolver: ${this.sourceIDs.length} sources selected; using only the first (${this.sourceIDs[0]})`);
    }
    if (this.receiverIDs.length > 1) {
      console.warn(`BeamTraceSolver: ${this.receiverIDs.length} receivers selected; using only the first (${this.receiverIDs[0]})`);
    }

    const receiverID = this.receiverIDs[0];
    const needsRebuild = this.needsBeamTreeRebuild();
    if (needsRebuild) this.buildSolver();
    else if (this.btSolver) {
      this.btSolver.clearCache();
      console.log("BeamTraceSolver: Reusing beam tree (listener-only change)");
    }

    if (!this.btSolver) {
      console.warn("BeamTraceSolver: Solver not built");
      return;
    }

    this.validPaths = [];
    this.clearVisualization();

    const receiver = useContainer.getState().containers[receiverID] as Receiver;
    if (!receiver) {
      console.warn("BeamTraceSolver: Receiver not found");
      return;
    }

    const listenerPos: BT_Vector3 = [receiver.position.x, receiver.position.y, receiver.position.z];
    const paths = this.btSolver.getPaths(listenerPos);
    this.lastMetrics = this.btSolver.getMetrics();
    const detailedPaths = this.btSolver.getDetailedPaths(listenerPos);

    paths.forEach((path, i) => {
      const detailed = i < detailedPaths.length ? detailedPaths[i] : undefined;
      this.validPaths.push(this.convertPath(path, detailed));
    });

    if (this.edgeDiffractionEnabled && this.room) {
      this._computeDiffractionPaths();
    }

    this.validPaths.sort((a, b) => a.arrivalTime - b.arrivalTime);

    if (this.lateReverbTailEnabled && this.validPaths.length > 0) {
      this._buildEnergyHistogram();
    }

    switch (this._visualizationMode) {
      case "rays": this.drawPaths(); break;
      case "beams": this.drawBeams(); break;
      case "both": this.drawPaths(); this.drawBeams(); break;
    }

    this.calculateLTP();
    this.calculateResponseByIntensity();

    console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`);
    if (this.lastMetrics) {
      console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`);
      console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`);
      console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`);
    }
    renderer.needsToRender = true;
  }

  private convertPath(path: ReflectionPath3D, detailed?: DetailedReflectionPath3D): BeamTracePath {
    return convertPath(path, detailed, this.c);
  }

  calculateLTP() {
    const recForLTP = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;
    calculateLTPImpl({
      validPaths: this.validPaths,
      levelTimeProgressionId: this.levelTimeProgression,
      plotFrequency: this._plotFrequency,
      maxReflectionOrder: this.maxReflectionOrder,
      solverUuid: this.uuid,
      receiver: recForLTP,
      arrivalPressure: (spls, path, gain) => this.calculateArrivalPressure(spls, path, gain),
    });
  }

  clearLevelTimeProgressionData() {
    const levelTimeProgression = { ...useResult.getState().results[this.levelTimeProgression] };
    levelTimeProgression.data = [];
    emit("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: levelTimeProgression });
  }

  set plotFrequency(f: number) {
    this._plotFrequency = f;
    this.calculateLTP();
  }
  get plotFrequency(): number { return this._plotFrequency; }
  get plotOrders(): number[] { return this._plotOrders; }
  set plotOrders(orders: number[]) { this._plotOrders = orders; }

  toggleRayPathHighlight(pathUuid: string) {
    const match = pathUuid.match(/-path-(\d+)$/);
    if (!match) {
      console.warn("BeamTraceSolver: Invalid path UUID format:", pathUuid);
      return;
    }
    this.highlightPathByIndex(parseInt(match[1], 10));
  }

  private clearVisualization() {
    clearVisualization(this.virtualSourcesGroup);
    this.virtualSourceMap.clear();
    this.selectedVirtualSource = null;
  }

  private drawPaths() {
    drawPathsImpl({
      validPaths: this.validPaths,
      visibleOrders: this._visibleOrders,
      maxReflectionOrder: this.maxReflectionOrder,
      virtualSourcesGroup: this.virtualSourcesGroup,
      lastMetrics: this.lastMetrics,
    });
  }

  private drawBeams() {
    const host = {
      btSolver: this.btSolver,
      validPaths: this.validPaths,
      visibleOrders: this._visibleOrders,
      maxReflectionOrder: this.maxReflectionOrder,
      showAllBeams: this._showAllBeams,
      virtualSourcesGroup: this.virtualSourcesGroup,
      virtualSourceMap: this.virtualSourceMap,
      selectedVirtualSource: this.selectedVirtualSource,
    };
    drawBeamsImpl(host);
    this.selectedVirtualSource = host.selectedVirtualSource;
    this.setupClickHandler();
    renderer.needsToRender = true;
  }

  private _computeDiffractionPaths() {
    if (!this.room) return;
    const result = computeDiffractionPaths({
      room: this.room,
      sourceId: this.sourceIDs[0],
      receiverId: this.receiverIDs[0],
      frequencies: this.frequencies,
      speedOfSound: this.c,
      temperature: this.temperature,
      containers: useContainer.getState().containers,
      raycaster: this._raycaster,
    });
    this._edgeGraph = result.edgeGraph;
    this.validPaths.push(...result.paths);
    if (result.paths.length > 0) {
      console.log(`BeamTraceSolver: Found ${result.paths.length} diffraction paths`);
    }
  }

  private _buildEnergyHistogram() {
    const recForHist = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;
    this._energyHistogram = buildEnergyHistogram({
      validPaths: this.validPaths,
      frequencies: this.frequencies,
      receiver: recForHist,
      arrivalPressure: (spls, path, gain) => this.calculateArrivalPressure(spls, path, gain),
    });
  }

  private calculateArrivalPressure(initialSPL: number[], path: BeamTracePath, receiverGain: number = 1.0): number[] {
    const source = this.sourceIDs.length > 0
      ? useContainer.getState().containers[this.sourceIDs[0]] as Source
      : null;
    return calculateArrivalPressure(initialSPL, path, {
      frequencies: this.frequencies,
      temperature: this.temperature,
      receiverGain,
      source: source?.directivityHandler ? source : null,
      polygonToSurface: this.polygonToSurface,
    });
  }

  async calculateImpulseResponse(): Promise<AudioBuffer> {
    const rec = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;
    const ir = await calculateMonoImpulseResponse({
      validPaths: this.validPaths,
      frequencies: this.frequencies,
      receiver: rec,
      arrivalPressure: (spls, path, gain) => this.calculateArrivalPressure(spls, path, gain),
      lateReverbTailEnabled: this.lateReverbTailEnabled,
      energyHistogram: this._energyHistogram,
      tailCrossfadeTime: this.tailCrossfadeTime,
      tailCrossfadeDuration: this.tailCrossfadeDuration,
      updateResult: (buffer, sampleRate) => {
        this.impulseResponse = buffer;
        updateImpulseResponseResult({
          ir: buffer,
          sampleRate,
          sourceIDs: this.sourceIDs,
          receiverIDs: this.receiverIDs,
          impulseResponseResult: this.impulseResponseResult,
          solverUuid: this.uuid,
        });
      },
    });
    this.impulseResponse = ir;
    return ir;
  }

  async playImpulseResponse() {
    const result = await sharedPlayIR(
      this.impulseResponse, () => this.calculateImpulseResponse(), this.uuid, "BEAMTRACE_SET_PROPERTY",
    );
    this.impulseResponse = result.impulseResponse;
  }

  async downloadImpulseResponse(filename: string, sampleRate = audioEngine.sampleRate) {
    const result = await sharedDownloadIR(
      this.impulseResponse, () => this.calculateImpulseResponse(), filename, sampleRate,
    );
    this.impulseResponse = result.impulseResponse;
  }

  ambisonicImpulseResponse?: AudioBuffer;
  ambisonicOrder: number = 1;

  async calculateAmbisonicImpulseResponse(order: number = 1): Promise<AudioBuffer> {
    const rec = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;
    const buffer = await calculateAmbisonicIRImpl({
      validPaths: this.validPaths,
      frequencies: this.frequencies,
      receiver: rec,
      arrivalPressure: (spls, path, gain) => this.calculateArrivalPressure(spls, path, gain),
      lateReverbTailEnabled: this.lateReverbTailEnabled,
      energyHistogram: this._energyHistogram,
      tailCrossfadeTime: this.tailCrossfadeTime,
      tailCrossfadeDuration: this.tailCrossfadeDuration,
      order,
    });
    this.ambisonicImpulseResponse = buffer;
    this.ambisonicOrder = order;
    return buffer;
  }

  async downloadAmbisonicImpulseResponse(filename: string, order: number = 1) {
    const result = await sharedDownloadAmbisonicIR(
      this.ambisonicImpulseResponse,
      (o: number) => this.calculateAmbisonicImpulseResponse(o),
      this.ambisonicOrder, order, filename,
    );
    this.ambisonicImpulseResponse = result.ambisonicImpulseResponse;
    this.ambisonicOrder = result.ambisonicOrder;
  }

  async calculateBinauralImpulseResponse(order: number = 1): Promise<AudioBuffer> {
    if (!this.ambisonicImpulseResponse || this.ambisonicOrder !== order) {
      this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(order);
      this.ambisonicOrder = order;
    }
    this.binauralImpulseResponse = await calculateBinauralIRImpl({
      ambisonicImpulseResponse: this.ambisonicImpulseResponse,
      order,
      hrtfSubjectId: this.hrtfSubjectId,
      headYaw: this.headYaw,
      headPitch: this.headPitch,
      headRoll: this.headRoll,
    });
    return this.binauralImpulseResponse;
  }

  async playBinauralImpulseResponse(order: number = 1) {
    const result = await sharedPlayBinauralIR(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(order),
      this.uuid, "BEAMTRACE_SET_PROPERTY",
    );
    this.binauralImpulseResponse = result.binauralImpulseResponse;
  }

  async downloadBinauralImpulseResponse(filename: string, order: number = 1) {
    const result = await sharedDownloadBinauralIR(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(order),
      filename,
    );
    this.binauralImpulseResponse = result.binauralImpulseResponse;
  }

  calculateResponseByIntensity() {
    if (this.validPaths.length === 0) return;
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const recId = this.receiverIDs[0];
    const srcId = this.sourceIDs[0];
    const recForIntensity = useContainer.getState().containers[recId] as Receiver;
    this.responseByIntensity = calculateRBIImpl({
      validPaths: this.validPaths,
      frequencies: this.frequencies,
      sourceId: srcId,
      receiverId: recId,
      receiver: recForIntensity,
      arrivalPressure: (spls, path, gain) => this.calculateArrivalPressure(spls, path, gain),
    });
  }

  downloadOctaveBandIR(filename: string, sampleRate = audioEngine.sampleRate) {
    const rec = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;
    downloadOctaveBandIRImpl({
      validPaths: this.validPaths,
      frequencies: this.frequencies,
      receiver: rec,
      arrivalPressure: (spls, path, gain) => this.calculateArrivalPressure(spls, path, gain),
      filename,
      sampleRate,
    });
  }

  startQuickEstimate(numRays: number = 500) {
    const source = this.sourceIDs.length === 0
      ? undefined
      : useContainer.getState().containers[this.sourceIDs[0]] as Source;
    startQuickEstimateImpl(this, source, numRays);
  }

  reset() {
    this.validPaths = [];
    this.clearVisualization();
    this.btSolver = null;
    this._lastTreeSignature = null;
    this.lastMetrics = null;
    this.responseByIntensity = undefined;
    if (this._quickEstimateInterval !== null) {
      window.clearInterval(this._quickEstimateInterval);
      this._quickEstimateInterval = null;
    }
    this.quickEstimateResults = [];
    this.estimatedT30 = null;
    this.clearLevelTimeProgressionData();
    (this.selectedPath.geometry as MeshLine).setPoints(new Float32Array(0));
    this.clearSelectedBeams();
    renderer.needsToRender = true;
  }

  private clearSelectedBeams() {
    clearGroup(this.selectedBeamsGroup);
  }

  get room(): Room | undefined {
    return useContainer.getState().containers[this.roomID] as Room | undefined;
  }
  get sources(): Source[] {
    return this.sourceIDs.map(id => useContainer.getState().containers[id] as Source).filter(Boolean);
  }
  get receivers(): Receiver[] {
    return this.receiverIDs.map(id => useContainer.getState().containers[id] as Receiver).filter(Boolean);
  }
  get numValidPaths(): number { return this.validPaths.length; }

  set maxReflectionOrderReset(order: number) {
    this.maxReflectionOrder = Math.max(0, Math.floor(order));
    this._plotOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (_, i) => i);
    this._visibleOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (_, i) => i);
    if (this.sourceIDs.length > 0 && this.receiverIDs.length > 0) {
      this.calculate();
      emit("BEAMTRACE_CALCULATE_COMPLETE", this.uuid);
    } else {
      this.reset();
    }
  }
  get maxReflectionOrderReset(): number { return this.maxReflectionOrder; }

  get visualizationMode(): VisualizationMode { return this._visualizationMode; }
  set visualizationMode(mode: VisualizationMode) {
    this._visualizationMode = mode;
    redrawVisualization({
      mode,
      validPaths: this.validPaths,
      btSolver: this.btSolver,
      virtualSourcesGroup: this.virtualSourcesGroup,
      drawBeamsFn: () => this.drawBeams(),
      drawPathsFn: () => this.drawPaths(),
    });
  }

  get showAllBeams(): boolean { return this._showAllBeams; }
  set showAllBeams(value: boolean) {
    this._showAllBeams = value;
    if (this._visualizationMode === "beams" || this._visualizationMode === "both") {
      this.visualizationMode = this._visualizationMode;
    }
  }

  get visibleOrders(): number[] { return this._visibleOrders; }
  set visibleOrders(orders: number[]) {
    this._visibleOrders = orders;
    this.visualizationMode = this._visualizationMode;
  }

  debugBeamPath(polygonPath: number[]) {
    if (!this.btSolver) {
      console.warn("BeamTraceSolver: No solver built. Run calculate() first.");
      return;
    }
    if (this.receiverIDs.length === 0) {
      console.warn("BeamTraceSolver: No receiver selected for debugging.");
      return;
    }
    const receiver = useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
    if (!receiver) {
      console.warn("BeamTraceSolver: Receiver not found.");
      return;
    }
    const listenerPos: BT_Vector3 = [receiver.position.x, receiver.position.y, receiver.position.z];
    console.group(`🔍 Debugging beam path: [${polygonPath.join(" → ")}]`);
    this.btSolver.debugBeamPath(listenerPos, polygonPath);
    console.groupEnd();
  }

  setBSPDebug(enabled: boolean) {
    console.log(`BeamTraceSolver: BSP debug ${enabled ? "enabled" : "disabled"} (note: requires beam-trace package update to export setBSPDebug)`);
  }

  getDetailedPaths(): DetailedReflectionPath3D[] {
    if (!this.btSolver) {
      console.warn("BeamTraceSolver: No solver built. Run calculate() first.");
      return [];
    }
    if (this.receiverIDs.length === 0) {
      console.warn("BeamTraceSolver: No receiver selected.");
      return [];
    }
    const receiver = useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
    if (!receiver) {
      console.warn("BeamTraceSolver: Receiver not found.");
      return [];
    }
    return this.btSolver.getDetailedPaths([receiver.position.x, receiver.position.y, receiver.position.z]);
  }

  highlightPathByIndex(pathIndex: number) {
    const receiver = this.receiverIDs.length === 0
      ? undefined
      : useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
    highlightPathByIndexImpl({
      pathIndex,
      validPaths: this.validPaths,
      maxReflectionOrder: this.maxReflectionOrder,
      btSolver: this.btSolver,
      receiver,
      selectedPath: this.selectedPath,
      selectedBeamsGroup: this.selectedBeamsGroup,
    });
  }

  clearPathHighlight() {
    (this.selectedPath.geometry as MeshLine).setPoints(new Float32Array(0));
    this.clearSelectedBeams();
    renderer.needsToRender = true;
  }
}

export default BeamTraceSolver;

registerBeamTraceEvents(BeamTraceSolver);
