import Solver from "../solver";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { v4 as uuidv4 } from 'uuid';
import {
  Polygon3D,
  Source3D,
  Solver3D,
  computePathLength,
  computeArrivalTime,
  getPathReflectionOrder,
} from 'beam-trace';
import type {
  ReflectionPath3D,
  DetailedReflectionPath3D,
  BeamVisualizationData,
  Vector3 as BT_Vector3
} from 'beam-trace';

import Room, { getRooms } from "../../objects/room";
import Source from "../../objects/source";
import Receiver from "../../objects/receiver";
import Surface from "../../objects/surface";
import { emit, on } from "../../messenger";
import { renderer } from "../../render/renderer";
import { addSolver, removeSolver, setSolverProperty, useSolver, useContainer, useResult, ResultKind, Result } from "../../store";
import { pickProps } from "../../common/helpers";
import * as ac from "../acoustics";
import { normalize } from "../acoustics";
import { audioEngine } from "../../audio-engine/audio-engine";
import {
  playImpulseResponse as sharedPlayIR,
  downloadImpulseResponse as sharedDownloadIR,
  downloadAmbisonicImpulseResponse as sharedDownloadAmbisonicIR,
  playBinauralImpulseResponse as sharedPlayBinauralIR,
  downloadBinauralImpulseResponse as sharedDownloadBinauralIR,
} from "../shared/export-playback";
import { calculateBinauralFromAmbisonic } from "../binaural/calculate-binaural";
import chroma from 'chroma-js';
import { encodeBufferFromDirection, getAmbisonicChannelCount } from "ambisonics";
import { buildEdgeGraph, findDiffractionPaths } from "../shared/diffraction";
import type { EdgeGraph, DiffractionPath } from "../shared/diffraction";
import { HISTOGRAM_BIN_WIDTH, HISTOGRAM_NUM_BINS } from "../shared/tail-synthesis-types";
import { extractDecayParameters, synthesizeTail, assembleFinalIR } from "../shared/tail-synthesis";
import type { ResponseByIntensity, RayPathResult } from "../shared/response-by-intensity-types";
import { DEFAULT_INTENSITY_SAMPLE_RATE } from "../shared/response-by-intensity-types";
import { resampleResponseByIntensity } from "../shared/response-by-intensity";
import { quickEstimateStep as sharedQuickEstimateStep } from "../shared/quick-estimate";
import type { QuickEstimateStepResult } from "../shared/quick-estimate-types";
import { KVP } from "../../common/key-value-pair";
import FileSaver from "file-saver";

// Helper to create a highlighted path line (same as ImageSourceSolver)
function createHighlightLine(): THREE.Mesh {
  const line = new MeshLine();
  line.setPoints([]);
  const material = new MeshLineMaterial({
    lineWidth: 0.1,
    color: 0xff0000,
    sizeAttenuation: 1,
  });
  return new THREE.Mesh(line, material);
}

// Path visualization colors by reflection order
// Uses the same color scale as LTPChart for consistency: orange (#ff8a0b) to navy (#000080)
const colorScale = chroma.scale(['#ff8a0b', '#000080']).mode('lch');

// Get color for a given reflection order (0 = direct, 1 = 1st order, etc.)
// maxOrder determines the number of colors in the scale
function getOrderColor(order: number, maxOrder: number): number {
  const numColors = maxOrder + 1;
  const colors = colorScale.colors(numColors);
  const colorIndex = Math.min(order, numColors - 1);
  const color = chroma(colors[colorIndex]);
  return parseInt(color.hex().slice(1), 16);
}

export interface BeamTracePath {
  points: THREE.Vector3[];
  order: number;
  length: number;
  arrivalTime: number;
  polygonIds: (number | null)[];
  /** Direction from which the path arrives at the receiver (normalized) */
  arrivalDirection: THREE.Vector3;
  // Detailed reflection info (optional, populated when using getDetailedPaths)
  reflections?: {
    polygonId: number;
    hitPoint: THREE.Vector3;
    incidenceAngle: number;
    surfaceNormal: THREE.Vector3;
    isGrazing: boolean;
  }[];
  /** Pre-computed per-band energy for diffraction paths (bypasses specular reflection calc) */
  bandEnergy?: number[];
}

export type VisualizationMode = "rays" | "beams" | "both";

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

const defaults: Required<BeamTraceSolverParams> = {
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

  // Internal beam-trace solver instance
  private btSolver: Solver3D | null = null;
  private polygons: Polygon3D[] = [];
  private surfaceToPolygonIndex: Map<string, number[]> = new Map();
  private polygonToSurface: Map<number, Surface> = new Map();

  // Edge diffraction
  edgeDiffractionEnabled: boolean;
  private _edgeGraph: EdgeGraph | null = null;
  private _raycaster: THREE.Raycaster = new THREE.Raycaster();

  // Late reverberation tail
  lateReverbTailEnabled: boolean;
  tailCrossfadeTime: number;
  tailCrossfadeDuration: number;
  private _energyHistogram: Float32Array[] | null = null;

  // Binaural
  hrtfSubjectId: string;
  headYaw: number;
  headPitch: number;
  headRoll: number;
  binauralImpulseResponse?: AudioBuffer;
  binauralPlaying: boolean = false;

  // Results
  validPaths: BeamTracePath[] = [];
  impulseResponse!: AudioBuffer;
  impulseResponsePlaying: boolean = false;

  // Response by intensity (per-frequency decay analysis)
  responseByIntensity: KVP<KVP<ResponseByIntensity>> | undefined;

  // Quick estimate
  quickEstimateResults: QuickEstimateStepResult[] = [];
  estimatedT30: number[] | null = null;
  private _quickEstimateInterval: number | null = null;

  // Metrics
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

  // Group for virtual source meshes (replaces Points for reliable raycasting)
  private virtualSourcesGroup: THREE.Group;
  // Map from virtual source mesh to beam data for click detection
  private virtualSourceMap: Map<THREE.Mesh, BeamVisualizationData & { polygonPath: number[] }> = new Map();
  // Currently selected virtual source mesh
  private selectedVirtualSource: THREE.Mesh | null = null;

  // Click handler cleanup
  private clickHandler: ((event: MouseEvent) => void) | null = null;
  private hoverHandler: ((event: MouseEvent) => void) | null = null;

  // Selected path highlight (for LTP chart click interaction)
  private selectedPath: THREE.Mesh;
  private selectedBeamsGroup: THREE.Group;

  // Incremental update tracking: skip full beam tree rebuild when only the listener moved
  private _lastSourcePos: THREE.Vector3 | null = null;
  private _lastRoomID: string = "";
  private _lastMaxOrder: number = -1;

  constructor(params: BeamTraceSolverParams = {}) {
    super(params);
    const p = { ...defaults, ...params };

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
    this._plotOrders = Array.from({ length: p.maxReflectionOrder + 1 }, (_, i) => i); // [0, 1, 2, ... maxReflectionOrder]
    this.levelTimeProgression = p.levelTimeProgression || uuidv4();
    this.impulseResponseResult = p.impulseResponseResult || uuidv4();

    // Auto-find room if not specified
    if (!this.roomID) {
      const rooms = getRooms();
      if (rooms.length > 0) {
        this.roomID = rooms[0].uuid;
      }
    }

    // Create LTP result for this solver
    emit("ADD_RESULT", {
      kind: ResultKind.LevelTimeProgression,
      data: [],
      info: {
        initialSPL: [100],
        frequency: [this._plotFrequency],
        maxOrder: this.maxReflectionOrder,
      },
      name: `LTP - ${this.name}`,
      uuid: this.levelTimeProgression,
      from: this.uuid
    } as Result<ResultKind.LevelTimeProgression>);

    // Create IR result for this solver
    emit("ADD_RESULT", {
      kind: ResultKind.ImpulseResponse,
      data: [],
      info: {
        sampleRate: 44100,
        sourceName: "",
        receiverName: "",
        sourceId: this.sourceIDs[0] || "",
        receiverId: this.receiverIDs[0] || ""
      },
      name: `IR - ${this.name}`,
      uuid: this.impulseResponseResult,
      from: this.uuid
    } as Result<ResultKind.ImpulseResponse>);

    // Create selected path highlight line
    this.selectedPath = createHighlightLine();
    renderer.markup.add(this.selectedPath);

    // Create group for highlighted beam lines
    this.selectedBeamsGroup = new THREE.Group();
    this.selectedBeamsGroup.name = "selected-beams-highlight";
    renderer.markup.add(this.selectedBeamsGroup);

    // Create group for virtual source spheres
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
        "name",
        "kind",
        "uuid",
        "autoCalculate",
        "roomID",
        "sourceIDs",
        "receiverIDs",
        "maxReflectionOrder",
        "frequencies",
        "levelTimeProgression",
        "impulseResponseResult",
        "hrtfSubjectId",
        "headYaw",
        "headPitch",
        "headRoll",
        "edgeDiffractionEnabled",
        "lateReverbTailEnabled",
        "tailCrossfadeTime",
        "tailCrossfadeDuration",
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
    this.clearVisualization();
    this.removeClickHandler();
    renderer.markup.remove(this.selectedPath);
    renderer.markup.remove(this.selectedBeamsGroup);
    renderer.markup.remove(this.virtualSourcesGroup);
    emit("REMOVE_RESULT", this.levelTimeProgression);
    emit("REMOVE_RESULT", this.impulseResponseResult);
  }

  private setupClickHandler() {
    // Remove existing handlers if any
    this.removeClickHandler();

    const canvas = renderer.renderer.domElement;

    // Helper to get mouse position in normalized device coordinates
    const getMouseNDC = (event: MouseEvent): THREE.Vector2 => {
      const rect = canvas.getBoundingClientRect();
      return new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
    };

    // Hover handler - change cursor when over a clickable virtual source
    this.hoverHandler = (event: MouseEvent) => {
      if (this.virtualSourceMap.size === 0) {
        canvas.style.cursor = 'default';
        return;
      }

      const mouse = getMouseNDC(event);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, renderer.camera);

      const virtualSourceMeshes = Array.from(this.virtualSourceMap.keys());
      const intersects = raycaster.intersectObjects(virtualSourceMeshes);

      if (intersects.length > 0) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
    };

    // Click handler
    this.clickHandler = (event: MouseEvent) => {
      // Only handle left clicks
      if (event.button !== 0) return;
      if (this.virtualSourceMap.size === 0) return;

      const mouse = getMouseNDC(event);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, renderer.camera);

      const virtualSourceMeshes = Array.from(this.virtualSourceMap.keys());
      const intersects = raycaster.intersectObjects(virtualSourceMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const beam = this.virtualSourceMap.get(clickedMesh);

        if (beam) {
          // Toggle selection - if already selected, deselect
          if (this.selectedVirtualSource === clickedMesh) {
            this.selectedVirtualSource = null;
            this.clearSelectedBeams();
          } else {
            this.selectedVirtualSource = clickedMesh;
            this.highlightVirtualSourcePath(beam);
          }
        }
      }
    };

    canvas.addEventListener('click', this.clickHandler);
    canvas.addEventListener('mousemove', this.hoverHandler);
  }

  // Highlight the ray path from a clicked virtual source to the receiver
  // beam contains polygonPath which is the sequence of polygon IDs for reflections
  private highlightVirtualSourcePath(beam: BeamVisualizationData & { polygonPath: number[] }) {
    // Clear previous selections
    (this.selectedPath.geometry as MeshLine).setPoints([]);
    this.clearSelectedBeams();

    const colorHex = getOrderColor(beam.reflectionOrder, this.maxReflectionOrder);
    const vs = new THREE.Vector3(beam.virtualSource[0], beam.virtualSource[1], beam.virtualSource[2]);

    // Get receiver position
    if (this.receiverIDs.length === 0) return;
    const receiver = useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
    if (!receiver) return;
    const receiverPos = receiver.position.clone();

    // Draw dashed line from virtual source to receiver (the "unfolded" path)
    const dashedMaterial = new THREE.LineDashedMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.4,
      dashSize: 0.3,
      gapSize: 0.15
    });
    const unfoldedLineGeom = new THREE.BufferGeometry().setFromPoints([vs, receiverPos]);
    const unfoldedLine = new THREE.Line(unfoldedLineGeom, dashedMaterial);
    unfoldedLine.computeLineDistances();
    this.selectedBeamsGroup.add(unfoldedLine);

    // Add a larger highlight sphere on the virtual source
    const highlightGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.4
    });
    const highlightMesh = new THREE.Mesh(highlightGeom, highlightMat);
    highlightMesh.position.copy(vs);
    this.selectedBeamsGroup.add(highlightMesh);

    // Find the matching path inside the room by comparing polygon sequence
    const polygonPath = beam.polygonPath;
    if (!polygonPath || polygonPath.length === 0) return;

    const targetOrder = beam.reflectionOrder;

    for (const path of this.validPaths) {
      // Path structure: path.polygonIds = [null (listener), polyN, poly_{N-1}, ..., poly_1, null (source)]
      // A path with N reflections has length N+2 (including source and listener points)
      const pathOrder = path.order;

      if (pathOrder !== targetOrder) continue;

      // Check if the polygon sequence matches
      // polygonPath is [poly0, poly1, ..., polyN] (first to last reflection, root to leaf in beam tree)
      // path.polygonIds is [null, polyN, poly_{N-1}, ..., poly_1, null] (leaf to root order)
      // So we need to compare in reverse: polygonPath[i] should match path.polygonIds[pathOrder - i]
      let matches = true;
      for (let i = 0; i < polygonPath.length; i++) {
        const pathIndex = pathOrder - i; // Index of reflection point in path (1-based from listener)
        const pathPolygonId = path.polygonIds[pathIndex];
        if (pathPolygonId !== polygonPath[i]) {
          matches = false;
          break;
        }
      }

      if (matches) {
        // Draw the actual ray path inside the room as thick cylinders
        const points = path.points;
        const numReflections = path.order;

        for (let i = 0; i < points.length - 1; i++) {
          const start = points[i];
          const end = points[i + 1];
          const segLen = start.distanceTo(end);
          const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

          // Color based on segment order
          const segmentOrder = numReflections - i;
          const segColor = (segmentOrder === 0) ? 0xffffff : getOrderColor(segmentOrder, this.maxReflectionOrder);

          const cylGeom = new THREE.CylinderGeometry(0.025, 0.025, segLen, 8);
          const cylMat = new THREE.MeshBasicMaterial({ color: segColor });
          const cyl = new THREE.Mesh(cylGeom, cylMat);

          cyl.position.copy(midPoint);
          const direction = new THREE.Vector3().subVectors(end, start).normalize();
          const quaternion = new THREE.Quaternion();
          quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
          cyl.setRotationFromQuaternion(quaternion);

          this.selectedBeamsGroup.add(cyl);
        }

        // Add spheres at reflection points
        for (let i = 1; i < path.points.length - 1; i++) {
          const pointOrder = numReflections - i + 1;
          const pointColor = getOrderColor(pointOrder, this.maxReflectionOrder);

          const pointGeom = new THREE.SphereGeometry(0.08, 12, 12);
          const pointMat = new THREE.MeshBasicMaterial({ color: pointColor });
          const pointMesh = new THREE.Mesh(pointGeom, pointMat);
          pointMesh.position.copy(path.points[i]);
          this.selectedBeamsGroup.add(pointMesh);
        }

        renderer.needsToRender = true;
        return;
      }
    }

    renderer.needsToRender = true;
  }

  private removeClickHandler() {
    const canvas = renderer.renderer.domElement;
    if (this.clickHandler) {
      canvas.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
    if (this.hoverHandler) {
      canvas.removeEventListener('mousemove', this.hoverHandler);
      this.hoverHandler = null;
      canvas.style.cursor = 'default';
    }
  }

  // Convert room surfaces to beam-trace Polygon3D format
  private extractPolygons(): Polygon3D[] {
    const room = this.room;
    if (!room) return [];

    const polygons: Polygon3D[] = [];
    this.surfaceToPolygonIndex.clear();
    this.polygonToSurface.clear();

    room.allSurfaces.forEach((surface: Surface) => {
      const surfacePolygons = this.surfaceToPolygons(surface);
      const startIndex = polygons.length;

      surfacePolygons.forEach((poly, i) => {
        this.polygonToSurface.set(startIndex + i, surface);
        polygons.push(poly);
      });

      this.surfaceToPolygonIndex.set(
        surface.uuid,
        surfacePolygons.map((_, i) => startIndex + i)
      );
    });

    return polygons;
  }

  // Convert a Surface to Polygon3D objects
  private surfaceToPolygons(surface: Surface): Polygon3D[] {
    const polygons: Polygon3D[] = [];
    const geometry = surface.geometry;
    const posAttr = geometry.getAttribute('position');

    if (!posAttr) return polygons;

    // Get world matrix for the surface
    surface.updateMatrixWorld(true);
    const worldMatrix = surface.matrixWorld;

    // Process triangles
    const indices = geometry.getIndex();
    const positions = posAttr.array;

    const processTriangle = (i0: number, i1: number, i2: number) => {
      const v0 = new THREE.Vector3(
        positions[i0 * 3],
        positions[i0 * 3 + 1],
        positions[i0 * 3 + 2]
      ).applyMatrix4(worldMatrix);

      const v1 = new THREE.Vector3(
        positions[i1 * 3],
        positions[i1 * 3 + 1],
        positions[i1 * 3 + 2]
      ).applyMatrix4(worldMatrix);

      const v2 = new THREE.Vector3(
        positions[i2 * 3],
        positions[i2 * 3 + 1],
        positions[i2 * 3 + 2]
      ).applyMatrix4(worldMatrix);

      const vertices: BT_Vector3[] = [
        [v0.x, v0.y, v0.z],
        [v1.x, v1.y, v1.z],
        [v2.x, v2.y, v2.z]
      ];

      const polygon = Polygon3D.create(vertices);
      polygons.push(polygon);
    };

    if (indices) {
      const indexArray = indices.array;
      for (let i = 0; i < indexArray.length; i += 3) {
        processTriangle(indexArray[i], indexArray[i + 1], indexArray[i + 2]);
      }
    } else {
      // Non-indexed geometry
      const numVertices = posAttr.count;
      for (let i = 0; i < numVertices; i += 3) {
        processTriangle(i, i + 1, i + 2);
      }
    }

    return polygons;
  }

  // Check if the beam tree needs to be rebuilt (source moved, room changed, or order changed)
  private needsBeamTreeRebuild(): boolean {
    if (!this.btSolver) return true;
    if (this._lastRoomID !== this.roomID) return true;
    if (this._lastMaxOrder !== this.maxReflectionOrder) return true;
    if (this.sourceIDs.length === 0) return true;

    const source = useContainer.getState().containers[this.sourceIDs[0]] as Source;
    if (!source) return true;
    if (!this._lastSourcePos || !this._lastSourcePos.equals(source.position)) return true;

    return false;
  }

  // Build/rebuild the beam-trace solver
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

    // Extract room geometry
    this.polygons = this.extractPolygons();
    if (this.polygons.length === 0) {
      console.warn("BeamTraceSolver: No polygons extracted from room");
      return;
    }

    // Create beam-trace source
    const sourcePos: BT_Vector3 = [
      source.position.x,
      source.position.y,
      source.position.z
    ];
    const btSource = new Source3D(sourcePos);

    // Create solver
    this.btSolver = new Solver3D(this.polygons, btSource, {
      maxReflectionOrder: this.maxReflectionOrder
    });

    // Record the state used for this build (for incremental update detection)
    this._lastSourcePos = source.position.clone();
    this._lastRoomID = this.roomID;
    this._lastMaxOrder = this.maxReflectionOrder;

    console.log(`BeamTraceSolver: Built with ${this.polygons.length} polygons, max order ${this.maxReflectionOrder}`);
  }

  // Calculate paths to all receivers
  calculate() {
    if (this.sourceIDs.length === 0 || this.receiverIDs.length === 0) {
      console.warn("BeamTraceSolver: Need at least one source and one receiver");
      return;
    }

    // Only rebuild beam tree if source, room, or reflection order changed.
    // If only the listener moved, reuse the existing beam tree (much faster).
    const needsRebuild = this.needsBeamTreeRebuild();
    if (needsRebuild) {
      this.buildSolver();
    } else if (this.btSolver) {
      // Clear fail-plane cache so stale listener-position caches don't skip valid paths
      this.btSolver.clearCache();
      console.log("BeamTraceSolver: Reusing beam tree (listener-only change)");
    }

    if (!this.btSolver) {
      console.warn("BeamTraceSolver: Solver not built");
      return;
    }

    this.validPaths = [];
    this.clearVisualization();

    // Process each receiver
    this.receiverIDs.forEach(receiverID => {
      const receiver = useContainer.getState().containers[receiverID] as Receiver;
      if (!receiver) return;

      const listenerPos: BT_Vector3 = [
        receiver.position.x,
        receiver.position.y,
        receiver.position.z
      ];
      // Get paths and detailed paths from beam-trace solver
      const paths = this.btSolver!.getPaths(listenerPos);
      this.lastMetrics = this.btSolver!.getMetrics();
      const detailedPaths = this.btSolver!.getDetailedPaths(listenerPos);

      // Convert to our format, using detailed paths for pre-computed angles
      paths.forEach((path, i) => {
        const detailed = i < detailedPaths.length ? detailedPaths[i] : undefined;
        const btPath = this.convertPath(path, detailed);
        this.validPaths.push(btPath);
      });
    });

    // Compute diffraction paths if enabled
    if (this.edgeDiffractionEnabled && this.room) {
      this._computeDiffractionPaths();
    }

    // Sort by arrival time (including diffraction paths)
    this.validPaths.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Build energy histogram for tail synthesis
    if (this.lateReverbTailEnabled && this.validPaths.length > 0) {
      this._buildEnergyHistogram();
    }

    // Update visualization based on current mode
    switch (this._visualizationMode) {
      case "rays":
        this.drawPaths();
        break;
      case "beams":
        this.drawBeams();
        break;
      case "both":
        this.drawPaths();
        this.drawBeams();
        break;
    }

    // Calculate LTP result
    this.calculateLTP();

    // Calculate per-frequency intensity response with T30 estimates
    this.calculateResponseByIntensity();

    console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`);
    if (this.lastMetrics) {
      console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`);
      console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`);
      console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`);
    }

    renderer.needsToRender = true;
  }

  // Convert beam-trace path to our format
  private convertPath(path: ReflectionPath3D, detailed?: DetailedReflectionPath3D): BeamTracePath {
    const points = path.map(p => new THREE.Vector3(p.position[0], p.position[1], p.position[2]));
    const length = computePathLength(path);
    const arrivalTime = computeArrivalTime(path, this.c);
    const order = getPathReflectionOrder(path);
    const polygonIds = path.map(p => p.polygonId);

    // Compute arrival direction (direction from second-to-last point to receiver)
    // points[0] is the receiver, points[1] is the last reflection point (or source for direct)
    let arrivalDirection: THREE.Vector3;
    if (points.length >= 2) {
      arrivalDirection = new THREE.Vector3()
        .subVectors(points[0], points[1])
        .normalize()
        .negate(); // Negate to get direction ray arrives FROM
    } else {
      // Fallback for edge case
      arrivalDirection = new THREE.Vector3(0, 0, 1);
    }

    // Populate detailed reflection info from library if available
    const reflections = detailed?.reflections.map(r => ({
      polygonId: r.polygonId,
      hitPoint: new THREE.Vector3(r.hitPoint[0], r.hitPoint[1], r.hitPoint[2]),
      incidenceAngle: r.incidenceAngle,
      surfaceNormal: new THREE.Vector3(r.surfaceNormal[0], r.surfaceNormal[1], r.surfaceNormal[2]),
      isGrazing: r.isGrazing,
    }));

    return { points, order, length, arrivalTime, polygonIds, arrivalDirection, reflections };
  }

  // Calculate Level Time Progression result
  calculateLTP() {
    if (this.validPaths.length === 0) return;

    // Sort paths by arrival time
    const sortedPaths = [...this.validPaths].sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Get the current LTP result and update it
    const levelTimeProgression = { ...useResult.getState().results[this.levelTimeProgression] as Result<ResultKind.LevelTimeProgression> };
    levelTimeProgression.data = [];
    levelTimeProgression.info = {
      ...levelTimeProgression.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    };

    // Calculate arrival pressure for each path (with receiver directivity)
    const recForLTP = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;

    for (let i = 0; i < sortedPaths.length; i++) {
      const path = sortedPaths[i];
      const dir = path.arrivalDirection;
      const recGain = recForLTP ? recForLTP.getGain([dir.x, dir.y, dir.z]) : 1.0;
      const pressure = this.calculateArrivalPressure(levelTimeProgression.info.initialSPL, path, recGain);
      const pressureLp = ac.P2Lp(pressure) as number[];

      levelTimeProgression.data.push({
        time: path.arrivalTime,
        pressure: pressureLp,
        arrival: i + 1,
        order: path.order,
        uuid: `${this.uuid}-path-${i}`
      });
    }

    emit("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: levelTimeProgression });
  }

  // Clear LTP data
  clearLevelTimeProgressionData() {
    const levelTimeProgression = { ...useResult.getState().results[this.levelTimeProgression] };
    levelTimeProgression.data = [];
    emit("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: levelTimeProgression });
  }

  // Setter for plot frequency (recalculates LTP when changed)
  set plotFrequency(f: number) {
    this._plotFrequency = f;
    this.calculateLTP();
  }

  get plotFrequency(): number {
    return this._plotFrequency;
  }

  // Plot orders for LTP chart filtering (mirrors ImageSourceSolver API)
  get plotOrders(): number[] {
    return this._plotOrders;
  }

  set plotOrders(orders: number[]) {
    this._plotOrders = orders;
    // No need to redraw visualization - beam trace doesn't filter by plotOrders
    // This is only used by the LTP chart
  }

  // Toggle ray path highlight when clicking on LTP chart bar
  // uuid format is `${this.uuid}-path-${index}` from calculateLTP
  toggleRayPathHighlight(pathUuid: string) {
    // Extract path index from uuid (format: `{solverUuid}-path-{index}`)
    const match = pathUuid.match(/-path-(\d+)$/);
    if (!match) {
      console.warn('BeamTraceSolver: Invalid path UUID format:', pathUuid);
      return;
    }

    const pathIndex = parseInt(match[1], 10);
    this.highlightPathByIndex(pathIndex);
  }

  // Visualization methods
  private clearVisualization() {
    // Clear lines and points using renderer.markup (same as ImageSourceSolver)
    renderer.markup.clearLines();
    renderer.markup.clearPoints();
    // Clear virtual source meshes
    this.clearVirtualSources();
    this.virtualSourceMap.clear();
    this.selectedVirtualSource = null;
  }

  private drawPaths() {
    // Use renderer.markup.addLine() like ImageSourceSolver for consistent visualization
    // Use the same color scale as LTPChart for visual consistency
    // Filter paths by visible orders
    const filteredPaths = this.validPaths.filter(path => this._visibleOrders.includes(path.order));

    filteredPaths.forEach(path => {
      const colorHex = getOrderColor(path.order, this.maxReflectionOrder);
      // Convert hex color to RGB (0-1 range)
      const r = ((colorHex >> 16) & 0xff) / 255;
      const g = ((colorHex >> 8) & 0xff) / 255;
      const b = (colorHex & 0xff) / 255;
      const color: [number, number, number] = [r, g, b];

      // Draw line segments between consecutive points
      for (let i = 0; i < path.points.length - 1; i++) {
        const p1 = path.points[i];
        const p2 = path.points[i + 1];
        renderer.markup.addLine(
          [p1.x, p1.y, p1.z],
          [p2.x, p2.y, p2.z],
          color,
          color
        );
      }
    });

    // Add small spheres at diffraction points to distinguish them from direct paths
    filteredPaths.forEach(path => {
      if (path.bandEnergy && path.points.length === 3) {
        const diffPt = path.points[1]; // [receiver, diffractionPoint, source]
        const colorHex = getOrderColor(path.order, this.maxReflectionOrder);
        const geom = new THREE.SphereGeometry(0.06, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: colorHex });
        const sphere = new THREE.Mesh(geom, mat);
        sphere.position.copy(diffPt);
        this.virtualSourcesGroup.add(sphere);
      }
    });

    // Get buffer usage stats and store in metrics
    const usageStats = renderer.markup.getUsageStats();
    if (this.lastMetrics) {
      this.lastMetrics.bufferUsage = usageStats;
    }

    // Log buffer usage warnings
    if (usageStats.overflowWarning) {
      console.error(`⚠️ Path buffer overflow! Lines: ${usageStats.linesUsed}/${usageStats.linesCapacity}. Reduce reflection order.`);
    } else if (usageStats.linesPercent > 80) {
      console.warn(`Buffer usage high: Lines ${usageStats.linesPercent.toFixed(1)}%`);
    }
  }

  private drawBeams() {
    if (!this.btSolver) return;

    // Clear virtual source meshes and map
    this.clearVirtualSources();
    this.virtualSourceMap.clear();
    this.selectedVirtualSource = null;

    // Get current paths to determine which virtual sources are valid
    const paths = this.validPaths;

    // Build a map of valid paths by their polygon sequence for quick lookup
    const validPathsByPolygonSequence = new Map<string, BeamTracePath>();
    paths.forEach(path => {
      // Build polygon sequence key (excluding null entries for source/receiver)
      const polygonSequence = path.polygonIds.filter(id => id !== null).join(',');
      if (polygonSequence) {
        validPathsByPolygonSequence.set(polygonSequence, path);
      }
    });

    const beamData = this.btSolver.getBeamsForVisualization(this.maxReflectionOrder);

    beamData.forEach((beam: BeamVisualizationData) => {
      // Filter by visible orders
      if (!this._visibleOrders.includes(beam.reflectionOrder)) {
        return;
      }

      // Check if this beam has a valid path to the receiver
      const hasValidPath = this.beamHasValidPath(beam, paths);

      // Skip virtual sources without valid paths unless showAllBeams is enabled
      if (!hasValidPath && !this._showAllBeams) {
        return;
      }

      // Calculate sphere radius based on reflection order (smaller for higher orders)
      const radius = Math.max(0.05, 0.10 - beam.reflectionOrder * 0.01);

      // Get color based on reflection order
      const colorHex = getOrderColor(beam.reflectionOrder, this.maxReflectionOrder);

      // Dim invalid beams
      let finalColor = colorHex;
      if (!hasValidPath) {
        // Mix with gray to dim
        const r = ((colorHex >> 16) & 0xff) * 0.4 + 128 * 0.6;
        const g = ((colorHex >> 8) & 0xff) * 0.4 + 128 * 0.6;
        const b = (colorHex & 0xff) * 0.4 + 128 * 0.6;
        finalColor = (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
      }

      const vs = new THREE.Vector3(beam.virtualSource[0], beam.virtualSource[1], beam.virtualSource[2]);

      // Create virtual source sphere mesh
      const vsGeom = new THREE.SphereGeometry(radius, 12, 12);
      const vsMat = new THREE.MeshStandardMaterial({
        color: finalColor,
        transparent: !hasValidPath,
        opacity: hasValidPath ? 1.0 : 0.4,
        roughness: 0.6,
        metalness: 0.1
      });
      const vsMesh = new THREE.Mesh(vsGeom, vsMat);
      vsMesh.position.copy(vs);
      this.virtualSourcesGroup.add(vsMesh);

      // Register this mesh for click detection (only valid beams are clickable)
      if (hasValidPath) {
        this.virtualSourceMap.set(vsMesh, {
          ...beam,
          polygonPath: beam.polygonPath || []
        });
      }

      // --- Aperture polygon rendering ---
      const apertureVerts = beam.apertureVertices;
      if (apertureVerts && apertureVerts.length >= 3) {
        const aperturePoints = apertureVerts.map(
          v => new THREE.Vector3(v[0], v[1], v[2])
        );

        // (a) Filled aperture polygon using triangle fan
        const fillGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(aperturePoints.length * 3);
        for (let i = 0; i < aperturePoints.length; i++) {
          positions[i * 3] = aperturePoints[i].x;
          positions[i * 3 + 1] = aperturePoints[i].y;
          positions[i * 3 + 2] = aperturePoints[i].z;
        }
        fillGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Triangle fan indices: (0,1,2), (0,2,3), (0,3,4), ...
        const indices: number[] = [];
        for (let i = 1; i < aperturePoints.length - 1; i++) {
          indices.push(0, i, i + 1);
        }
        fillGeom.setIndex(indices);
        fillGeom.computeVertexNormals();

        const fillMat = new THREE.MeshBasicMaterial({
          color: finalColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: hasValidPath ? 0.20 : 0.08,
          depthWrite: false,
        });
        const fillMesh = new THREE.Mesh(fillGeom, fillMat);
        this.virtualSourcesGroup.add(fillMesh);

        // (b) Aperture edge outline
        const outlineGeom = new THREE.BufferGeometry().setFromPoints(aperturePoints);
        const outlineMat = new THREE.LineBasicMaterial({
          color: finalColor,
          transparent: true,
          opacity: hasValidPath ? 0.50 : 0.20,
        });
        const outlineLine = new THREE.LineLoop(outlineGeom, outlineMat);
        this.virtualSourcesGroup.add(outlineLine);

        // (c) Cone edges: virtual source → each aperture vertex
        const conePositions: THREE.Vector3[] = [];
        for (const ap of aperturePoints) {
          conePositions.push(vs.clone(), ap);
        }
        const coneGeom = new THREE.BufferGeometry().setFromPoints(conePositions);
        const coneMat = new THREE.LineBasicMaterial({
          color: finalColor,
          transparent: true,
          opacity: hasValidPath ? 0.35 : 0.12,
        });
        const coneLines = new THREE.LineSegments(coneGeom, coneMat);
        this.virtualSourcesGroup.add(coneLines);
      }
    });

    // Setup click handler for virtual source selection
    this.setupClickHandler();

    renderer.needsToRender = true;
  }

  // Check if a beam has a valid path to the receiver
  private beamHasValidPath(beam: BeamVisualizationData, paths: BeamTracePath[]): boolean {
    const polygonPath = beam.polygonPath;
    if (!polygonPath || polygonPath.length === 0) return false;

    const targetOrder = beam.reflectionOrder;

    for (const path of paths) {
      if (path.order !== targetOrder) continue;

      // Check if the polygon sequence matches
      // polygonPath is [poly0, poly1, ..., polyN] (first to last reflection)
      // path.polygonIds is [null, polyN, poly_{N-1}, ..., poly_1, null] (leaf to root order)
      let matches = true;
      for (let i = 0; i < polygonPath.length; i++) {
        const pathIndex = targetOrder - i;
        const pathPolygonId = path.polygonIds[pathIndex];
        if (pathPolygonId !== polygonPath[i]) {
          matches = false;
          break;
        }
      }

      if (matches) return true;
    }

    return false;
  }

  // Clear virtual source meshes
  private clearVirtualSources() {
    while (this.virtualSourcesGroup.children.length > 0) {
      const child = this.virtualSourcesGroup.children[0];
      this.virtualSourcesGroup.remove(child);
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry?.dispose();
        const material = child.material;
        if (Array.isArray(material)) {
          for (const mat of material) {
            if (mat instanceof THREE.Material) {
              mat.dispose();
            }
          }
        } else if (material instanceof THREE.Material) {
          material.dispose();
        }
      }
    }
  }

  /**
   * Compute first-order UTD edge diffraction paths and add them to validPaths.
   */
  private _computeDiffractionPaths() {
    if (!this.room) return;

    const containers = useContainer.getState().containers;

    // Build edge graph from room surfaces
    this._edgeGraph = buildEdgeGraph(this.room.allSurfaces);
    if (this._edgeGraph.edges.length === 0) return;

    // Gather source positions and directivity data
    const sourcePositions = new Map<string, [number, number, number]>();
    const sourceDirectivity = new Map<string, { handler: any; refPressures: number[] }>();
    for (const id of this.sourceIDs) {
      const src = containers[id] as Source;
      if (src) {
        sourcePositions.set(id, [src.position.x, src.position.y, src.position.z]);
        const dh = src.directivityHandler;
        if (dh) {
          const refPressures = new Array(this.frequencies.length);
          for (let f = 0; f < this.frequencies.length; f++) {
            refPressures[f] = dh.getPressureAtPosition(0, this.frequencies[f], 0, 0) as number;
          }
          sourceDirectivity.set(id, { handler: dh, refPressures });
        }
      }
    }

    // Gather receiver positions
    const receiverPositions = new Map<string, [number, number, number]>();
    for (const id of this.receiverIDs) {
      const rec = containers[id];
      if (rec) {
        receiverPositions.set(id, [rec.position.x, rec.position.y, rec.position.z]);
      }
    }

    // Get surface meshes for LOS checks
    const surfaces: THREE.Mesh[] = [];
    this.room.surfaces.traverse((container) => {
      if (container['kind'] && container['kind'] === 'surface') {
        surfaces.push((container as Surface).mesh);
      }
    });

    const diffractionPaths = findDiffractionPaths(
      this._edgeGraph,
      sourcePositions,
      receiverPositions,
      this.frequencies,
      this.c,
      this.temperature,
      this._raycaster,
      surfaces,
    );

    // Convert DiffractionPath → BeamTracePath and add to validPaths
    for (const dp of diffractionPaths) {
      // Apply source directivity to band energies
      const srcDir = sourceDirectivity.get(dp.sourceId);
      if (srcDir) {
        const srcPos = sourcePositions.get(dp.sourceId)!;
        const dx = dp.diffractionPoint[0] - srcPos[0];
        const dy = dp.diffractionPoint[1] - srcPos[1];
        const dz = dp.diffractionPoint[2] - srcPos[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 1e-10) {
          const theta = Math.acos(Math.max(-1, Math.min(1, dy / dist))) * (180 / Math.PI);
          const phi = Math.atan2(dz, dx) * (180 / Math.PI);
          for (let f = 0; f < this.frequencies.length; f++) {
            try {
              const dirP = srcDir.handler.getPressureAtPosition(0, this.frequencies[f], Math.abs(phi), theta);
              const refP = srcDir.refPressures[f];
              if (typeof dirP === "number" && typeof refP === "number" && refP > 0) {
                dp.bandEnergy[f] *= (dirP / refP) ** 2;
              }
            } catch (e) {
              // Fallback to unity gain
            }
          }
        }
      }

      // Compute arrival direction: diffraction point → receiver (normalized)
      const recPos = receiverPositions.get(dp.receiverId)!;
      const adx = recPos[0] - dp.diffractionPoint[0];
      const ady = recPos[1] - dp.diffractionPoint[1];
      const adz = recPos[2] - dp.diffractionPoint[2];
      const adLen = Math.sqrt(adx * adx + ady * ady + adz * adz);
      const arrivalDir = adLen > 1e-10
        ? new THREE.Vector3(adx / adLen, ady / adLen, adz / adLen)
        : new THREE.Vector3(0, 0, 1);

      const srcPos = sourcePositions.get(dp.sourceId)!;
      const receiverVec = new THREE.Vector3(recPos[0], recPos[1], recPos[2]);
      const diffPtVec = new THREE.Vector3(dp.diffractionPoint[0], dp.diffractionPoint[1], dp.diffractionPoint[2]);
      const sourceVec = new THREE.Vector3(srcPos[0], srcPos[1], srcPos[2]);

      const beamPath: BeamTracePath = {
        points: [receiverVec, diffPtVec, sourceVec],
        order: 0, // diffraction is a "direct-like" path
        length: dp.totalDistance,
        arrivalTime: dp.time,
        polygonIds: [null, null, null],
        arrivalDirection: arrivalDir,
        reflections: [],
        bandEnergy: dp.bandEnergy,
      };

      this.validPaths.push(beamPath);
    }

    if (diffractionPaths.length > 0) {
      console.log(`BeamTraceSolver: Found ${diffractionPaths.length} diffraction paths`);
    }
  }

  /**
   * Build per-band energy histograms from all computed paths (for tail synthesis).
   */
  private _buildEnergyHistogram() {
    const numBands = this.frequencies.length;
    this._energyHistogram = [];
    for (let f = 0; f < numBands; f++) {
      this._energyHistogram.push(new Float32Array(HISTOGRAM_NUM_BINS));
    }

    const initialSPL = 100;
    const spls = Array(numBands).fill(initialSPL);

    const recForHist = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;

    for (const path of this.validPaths) {
      const bin = Math.floor(path.arrivalTime / HISTOGRAM_BIN_WIDTH);
      if (bin < 0 || bin >= HISTOGRAM_NUM_BINS) continue;

      const dir = path.arrivalDirection;
      const recGain = recForHist ? recForHist.getGain([dir.x, dir.y, dir.z]) : 1.0;
      const pressure = this.calculateArrivalPressure(spls, path, recGain);

      for (let f = 0; f < numBands; f++) {
        // Energy = pressure²
        this._energyHistogram![f][bin] += pressure[f] * pressure[f];
      }
    }
  }

  // Calculate impulse response
  async calculateImpulseResponse(): Promise<AudioBuffer> {
    if (this.validPaths.length === 0) {
      throw new Error("No paths calculated yet. Run calculate() first.");
    }

    const sampleRate = audioEngine.sampleRate;
    const initialSPL = 100;
    const spls = Array(this.frequencies.length).fill(initialSPL);

    const totalTime = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05;
    const numberOfSamples = Math.floor(sampleRate * totalTime) * 2;

    const samples: Float32Array[] = [];
    for (let f = 0; f < this.frequencies.length; f++) {
      samples.push(new Float32Array(numberOfSamples));
    }

    // Add contributions from each path (with receiver directivity)
    const recForIR = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;

    for (const path of this.validPaths) {
      const randomPhase = Math.random() > 0.5 ? 1 : -1;
      const dir = path.arrivalDirection;
      const recGain = recForIR ? recForIR.getGain([dir.x, dir.y, dir.z]) : 1.0;
      const pressure = this.calculateArrivalPressure(spls, path, recGain);
      const roundedSample = Math.floor(path.arrivalTime * sampleRate);

      for (let f = 0; f < this.frequencies.length; f++) {
        if (roundedSample < samples[f].length) {
          samples[f][roundedSample] += pressure[f] * randomPhase;
        }
      }
    }

    // Apply late reverberation tail synthesis
    let finalSamples = samples;
    if (this.lateReverbTailEnabled && this._energyHistogram) {
      const decayParams = extractDecayParameters(
        this._energyHistogram, this.frequencies,
        this.tailCrossfadeTime, HISTOGRAM_BIN_WIDTH
      );
      const { tailSamples, tailStartSample } = synthesizeTail(decayParams, sampleRate);
      const crossfadeDurationSamples = Math.floor(this.tailCrossfadeDuration * sampleRate);
      finalSamples = assembleFinalIR(samples, tailSamples, tailStartSample, crossfadeDurationSamples);
    }

    // Use filter worker (similar to RayTracer)
    const FilterWorker = () => new Worker(new URL('../../audio-engine/filter.worker.ts', import.meta.url));
    const worker = FilterWorker();

    return new Promise((resolve, reject) => {
      worker.postMessage({ samples: finalSamples });

      worker.onmessage = (event) => {
        const filteredSamples = event.data.samples as Float32Array[];
        const signal = new Float32Array(filteredSamples[0].length >> 1);

        let max = 0;
        for (let i = 0; i < filteredSamples.length; i++) {
          for (let j = 0; j < signal.length; j++) {
            signal[j] += filteredSamples[i][j];
            if (Math.abs(signal[j]) > max) {
              max = Math.abs(signal[j]);
            }
          }
        }

        const normalizedSignal = normalize(signal);
        const offlineContext = audioEngine.createOfflineContext(1, signal.length, sampleRate);
        const source = audioEngine.createBufferSource(normalizedSignal, offlineContext);

        source.connect(offlineContext.destination);
        source.start();

        audioEngine.renderContextAsync(offlineContext)
          .then(ir => {
            this.impulseResponse = ir;
            this.updateImpulseResponseResult(ir, sampleRate);
            resolve(ir);
          })
          .catch(reject)
          .finally(() => worker.terminate());
      };

      worker.onerror = (error) => {
        worker.terminate();
        reject(error);
      };
    });
  }

  // Calculate arrival pressure for a path
  private calculateArrivalPressure(initialSPL: number[], path: BeamTracePath, receiverGain: number = 1.0): number[] {
    // Diffraction paths have pre-computed per-band energy — convert to pressure directly
    if (path.bandEnergy) {
      const initialIntensities = ac.P2I(ac.Lp2P(initialSPL)) as number[];
      const pressures: number[] = new Array(this.frequencies.length);
      for (let f = 0; f < this.frequencies.length; f++) {
        const arrivalIntensity = initialIntensities[f] * path.bandEnergy[f];
        pressures[f] = (ac.I2P([arrivalIntensity]) as number[])[0] * receiverGain;
      }
      return pressures;
    }

    const intensities = ac.P2I(ac.Lp2P(initialSPL)) as number[];

    // Apply source directivity weighting
    // Direction from source (last point) toward the first reflection (or receiver for direct path)
    const sourceIdx = path.points.length - 1;
    if (sourceIdx >= 1 && this.sourceIDs.length > 0) {
      const source = useContainer.getState().containers[this.sourceIDs[0]] as Source;
      if (source?.directivityHandler) {
        const sourcePos = path.points[sourceIdx];
        const nextPoint = path.points[sourceIdx - 1];
        const worldDir = new THREE.Vector3().subVectors(nextPoint, sourcePos).normalize();

        // Convert world direction to source-local spherical angles
        const localDir = worldDir.clone().applyEuler(
          new THREE.Euler(-source.rotation.x, -source.rotation.y, -source.rotation.z, source.rotation.order)
        );
        const r = localDir.length();
        if (r > 1e-10) {
          const theta = Math.acos(Math.min(1, Math.max(-1, localDir.z / r)));
          const phi = Math.atan2(localDir.y, localDir.x);
          const phiDeg = ((phi * 180 / Math.PI) % 360 + 360) % 360;
          const thetaDeg = theta * 180 / Math.PI;

          for (let f = 0; f < this.frequencies.length; f++) {
            const dirPressure = source.directivityHandler.getPressureAtPosition(0, this.frequencies[f], phiDeg, thetaDeg);
            const refPressure = source.directivityHandler.getPressureAtPosition(0, this.frequencies[f], 0, 0);
            if (typeof dirPressure === 'number' && typeof refPressure === 'number' && refPressure > 0) {
              intensities[f] *= (dirPressure / refPressure) ** 2;
            }
          }
        }
      }
    }

    // Apply angle-dependent reflection at each reflection point
    // path.reflections (from DetailedReflectionPath3D) lists only actual reflections in order,
    // while path.polygonIds includes null entries for source/receiver.
    let reflectionIdx = 0;

    path.polygonIds.forEach((polygonId, idx) => {
      if (polygonId === null) return; // Source or receiver point

      const surface = this.polygonToSurface.get(polygonId);
      if (!surface) {
        reflectionIdx++;
        return;
      }

      // Use pre-computed incidence angle from library when available
      let angle = 0; // fallback to normal incidence
      if (path.reflections && reflectionIdx < path.reflections.length) {
        angle = path.reflections[reflectionIdx].incidenceAngle;
      } else if (idx > 0 && idx < path.points.length - 1) {
        // Fallback: compute from path geometry
        const toSource = new THREE.Vector3().subVectors(path.points[idx + 1], path.points[idx]).normalize();
        const toReceiver = new THREE.Vector3().subVectors(path.points[idx - 1], path.points[idx]).normalize();
        const cosAngle = Math.min(1, Math.max(-1, toSource.dot(toReceiver)));
        angle = Math.acos(cosAngle) / 2;
      }
      reflectionIdx++;

      for (let f = 0; f < this.frequencies.length; f++) {
        const R = Math.abs(surface.reflectionFunction(this.frequencies[f], angle));
        intensities[f] *= R;
      }
    });

    // Convert back to SPL and apply air absorption
    const arrivalLp = ac.P2Lp(ac.I2P(intensities)) as number[];
    const airAttenuationdB = ac.airAttenuation(this.frequencies, this.temperature);

    for (let f = 0; f < this.frequencies.length; f++) {
      arrivalLp[f] -= airAttenuationdB[f] * path.length;
    }

    // Apply receiver directivity gain
    const pressures = ac.Lp2P(arrivalLp) as number[];
    if (receiverGain !== 1.0) {
      for (let f = 0; f < pressures.length; f++) {
        pressures[f] *= receiverGain;
      }
    }
    return pressures;
  }

  // Update the IR result with calculated data
  private updateImpulseResponseResult(ir: AudioBuffer, sampleRate: number) {
    const containers = useContainer.getState().containers;
    const sourceName = this.sourceIDs.length > 0 ? containers[this.sourceIDs[0]]?.name || 'source' : 'source';
    const receiverName = this.receiverIDs.length > 0 ? containers[this.receiverIDs[0]]?.name || 'receiver' : 'receiver';

    // Convert AudioBuffer to time/amplitude data for the chart
    const channelData = ir.getChannelData(0);
    const data: { time: number; amplitude: number }[] = [];

    // Downsample for display (show every Nth sample to keep data manageable)
    const downsampleFactor = Math.max(1, Math.floor(channelData.length / 2000));
    for (let i = 0; i < channelData.length; i += downsampleFactor) {
      data.push({
        time: i / sampleRate,
        amplitude: channelData[i]
      });
    }

    console.log(`BeamTraceSolver: Updating IR result with ${data.length} samples, duration: ${(channelData.length / sampleRate).toFixed(3)}s`);

    const result: Result<ResultKind.ImpulseResponse> = {
      kind: ResultKind.ImpulseResponse,
      data,
      info: {
        sampleRate,
        sourceName,
        receiverName,
        sourceId: this.sourceIDs[0] || "",
        receiverId: this.receiverIDs[0] || ""
      },
      name: `IR: ${sourceName} → ${receiverName}`,
      uuid: this.impulseResponseResult,
      from: this.uuid
    };

    emit("UPDATE_RESULT", { uuid: this.impulseResponseResult, result });
  }

  async playImpulseResponse() {
    const result = await sharedPlayIR(
      this.impulseResponse, () => this.calculateImpulseResponse(), this.uuid, "BEAMTRACE_SET_PROPERTY"
    );
    this.impulseResponse = result.impulseResponse;
  }

  async downloadImpulseResponse(filename: string, sampleRate = audioEngine.sampleRate) {
    const result = await sharedDownloadIR(
      this.impulseResponse, () => this.calculateImpulseResponse(), filename, sampleRate
    );
    this.impulseResponse = result.impulseResponse;
  }

  // Ambisonic impulse response storage
  ambisonicImpulseResponse?: AudioBuffer;
  ambisonicOrder: number = 1;

  /**
   * Calculate an ambisonic impulse response from the beam-traced paths.
   * Each reflection is encoded based on its arrival direction at the receiver.
   *
   * @param order - Ambisonic order (1 = first order with 4 channels, 2 = 9 channels, etc.)
   * @returns Promise resolving to an AudioBuffer with ambisonic channels
   */
  async calculateAmbisonicImpulseResponse(order: number = 1): Promise<AudioBuffer> {
    if (this.validPaths.length === 0) {
      throw new Error("No paths calculated yet. Run calculate() first.");
    }

    const sampleRate = audioEngine.sampleRate;
    const initialSPL = 100;
    const spls = Array(this.frequencies.length).fill(initialSPL);

    const totalTime = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05;
    if (totalTime <= 0) throw new Error("Invalid impulse response duration");
    const numberOfSamples = Math.floor(sampleRate * totalTime) * 2;
    if (numberOfSamples < 2) throw new Error("Impulse response too short to process");
    const nCh = getAmbisonicChannelCount(order);

    // Create per-frequency, per-channel sample buffers
    const samples: Float32Array[][] = [];
    for (let f = 0; f < this.frequencies.length; f++) {
      samples.push([]);
      for (let ch = 0; ch < nCh; ch++) {
        samples[f].push(new Float32Array(numberOfSamples));
      }
    }

    // Process each path (with receiver directivity)
    const recForAmbi = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;

    for (const path of this.validPaths) {
      const randomPhase = Math.random() > 0.5 ? 1 : -1;
      const dir = path.arrivalDirection;
      const recGain = recForAmbi ? recForAmbi.getGain([dir.x, dir.y, dir.z]) : 1.0;
      const pressure = this.calculateArrivalPressure(spls, path, recGain);
      const roundedSample = Math.floor(path.arrivalTime * sampleRate);

      if (roundedSample >= numberOfSamples) continue;

      // Create a single-sample impulse for this reflection
      const impulse = new Float32Array(1);

      // Encode each frequency band
      for (let f = 0; f < this.frequencies.length; f++) {
        impulse[0] = pressure[f] * randomPhase;

        // Encode the impulse at this direction (using Three.js coordinate system)
        const encoded = encodeBufferFromDirection(impulse, dir.x, dir.y, dir.z, order, 'threejs');

        // Add to the output buffers
        for (let ch = 0; ch < nCh; ch++) {
          samples[f][ch][roundedSample] += encoded[ch][0];
        }
      }
    }

    // Apply late reverberation tail synthesis to W-channel (channel 0) only
    if (this.lateReverbTailEnabled && this._energyHistogram) {
      const decayParams = extractDecayParameters(
        this._energyHistogram, this.frequencies,
        this.tailCrossfadeTime, HISTOGRAM_BIN_WIDTH
      );
      const { tailSamples, tailStartSample } = synthesizeTail(decayParams, sampleRate);
      const crossfadeDurationSamples = Math.floor(this.tailCrossfadeDuration * sampleRate);
      // Gather W-channel (ch=0) per-band samples
      const wChannelSamples: Float32Array[] = [];
      for (let f = 0; f < this.frequencies.length; f++) {
        wChannelSamples.push(samples[f][0]);
      }
      const extendedW = assembleFinalIR(wChannelSamples, tailSamples, tailStartSample, crossfadeDurationSamples);
      // Write back extended W-channel samples
      for (let f = 0; f < this.frequencies.length; f++) {
        samples[f][0] = extendedW[f];
      }
    }

    // Use filter worker to apply octave-band filtering
    const FilterWorker = () => new Worker(new URL('../../audio-engine/filter.worker.ts', import.meta.url));

    return new Promise((resolve, reject) => {
      // Process each ambisonic channel through the filter bank
      const processChannel = async (chIndex: number): Promise<Float32Array> => {
        return new Promise((resolveChannel) => {
          const channelFreqSamples: Float32Array[] = [];
          for (let f = 0; f < this.frequencies.length; f++) {
            channelFreqSamples.push(samples[f][chIndex]);
          }

          const channelWorker = FilterWorker();
          channelWorker.postMessage({ samples: channelFreqSamples });
          channelWorker.onmessage = (event) => {
            const filteredSamples = event.data.samples as Float32Array[];
            const signal = new Float32Array(filteredSamples[0].length >> 1);

            for (let f = 0; f < filteredSamples.length; f++) {
              for (let j = 0; j < signal.length; j++) {
                signal[j] += filteredSamples[f][j];
              }
            }

            channelWorker.terminate();
            resolveChannel(signal);
          };
        });
      };

      // Process all channels
      Promise.all(
        Array.from({ length: nCh }, (_, ch) => processChannel(ch))
      ).then((channelSignals) => {
        // Find global max for normalization
        let max = 0;
        for (const signal of channelSignals) {
          for (let j = 0; j < signal.length; j++) {
            if (Math.abs(signal[j]) > max) {
              max = Math.abs(signal[j]);
            }
          }
        }

        // Normalize all channels by the same factor
        if (max > 0) {
          for (const signal of channelSignals) {
            for (let j = 0; j < signal.length; j++) {
              signal[j] /= max;
            }
          }
        }

        // Create multi-channel AudioBuffer
        const signalLength = channelSignals[0].length;
        if (signalLength === 0) {
          reject(new Error("Filtered signal has zero length"));
          return;
        }
        const offlineContext = audioEngine.createOfflineContext(nCh, signalLength, sampleRate);
        const buffer = offlineContext.createBuffer(nCh, signalLength, sampleRate);

        for (let ch = 0; ch < nCh; ch++) {
          buffer.copyToChannel(new Float32Array(channelSignals[ch]), ch);
        }

        this.ambisonicImpulseResponse = buffer;
        this.ambisonicOrder = order;
        resolve(buffer);
      }).catch(reject);
    });
  }

  async downloadAmbisonicImpulseResponse(
    filename: string,
    order: number = 1
  ) {
    const result = await sharedDownloadAmbisonicIR(
      this.ambisonicImpulseResponse,
      (o: number) => this.calculateAmbisonicImpulseResponse(o),
      this.ambisonicOrder, order, filename
    );
    this.ambisonicImpulseResponse = result.ambisonicImpulseResponse;
    this.ambisonicOrder = result.ambisonicOrder;
  }

  async calculateBinauralImpulseResponse(order: number = 1): Promise<AudioBuffer> {
    // Get or compute ambisonic IR
    if (!this.ambisonicImpulseResponse || this.ambisonicOrder !== order) {
      this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(order);
      this.ambisonicOrder = order;
    }

    this.binauralImpulseResponse = await calculateBinauralFromAmbisonic({
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
      this.uuid, "BEAMTRACE_SET_PROPERTY"
    );
    this.binauralImpulseResponse = result.binauralImpulseResponse;
  }

  async downloadBinauralImpulseResponse(filename: string, order: number = 1) {
    const result = await sharedDownloadBinauralIR(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(order),
      filename
    );
    this.binauralImpulseResponse = result.binauralImpulseResponse;
  }

  /**
   * Calculate per-frequency intensity response with T20/T30/T60 decay estimates.
   * Uses existing calculateArrivalPressure() to convert beam-trace paths into
   * the same RayPathResult format the raytracer uses, then delegates to the
   * shared resampleResponseByIntensity() for decay-time fitting.
   */
  calculateResponseByIntensity() {
    if (this.validPaths.length === 0) return;
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;

    const recId = this.receiverIDs[0];
    const srcId = this.sourceIDs[0];
    const initialSPL = 100;
    const spls = Array(this.frequencies.length).fill(initialSPL);

    const recForIntensity = useContainer.getState().containers[recId] as Receiver;

    const sortedPaths = [...this.validPaths].sort((a, b) => a.arrivalTime - b.arrivalTime);

    const response: RayPathResult[] = [];

    for (const path of sortedPaths) {
      const dir = path.arrivalDirection;
      const recGain = recForIntensity ? recForIntensity.getGain([dir.x, dir.y, dir.z]) : 1.0;
      const pressure = this.calculateArrivalPressure(spls, path, recGain);
      const level = ac.P2Lp(pressure) as number[];

      response.push({
        time: path.arrivalTime,
        bounces: path.order,
        level,
      });
    }

    const rbi: KVP<KVP<ResponseByIntensity>> = {
      [recId]: {
        [srcId]: {
          freqs: this.frequencies,
          response,
        }
      }
    };

    this.responseByIntensity = resampleResponseByIntensity(rbi, DEFAULT_INTENSITY_SAMPLE_RATE);
  }

  /**
   * Export per-octave-band impulse responses as individual WAV files.
   * Skips the filter worker — writes one WAV per frequency band directly.
   */
  downloadOctaveBandIR(filename: string, sampleRate = audioEngine.sampleRate) {
    if (this.validPaths.length === 0) {
      throw new Error("No paths calculated yet. Run calculate() first.");
    }

    const initialSPL = 100;
    const spls = Array(this.frequencies.length).fill(initialSPL);
    const sortedPaths = [...this.validPaths].sort((a, b) => a.arrivalTime - b.arrivalTime);

    const totalTime = sortedPaths[sortedPaths.length - 1].arrivalTime + 0.05;
    const numberOfSamples = Math.floor(sampleRate * totalTime);

    const samples: Float32Array[] = [];
    for (let f = 0; f < this.frequencies.length; f++) {
      samples.push(new Float32Array(numberOfSamples));
    }

    const recForDownload = this.receiverIDs.length > 0
      ? useContainer.getState().containers[this.receiverIDs[0]] as Receiver
      : null;

    for (const path of sortedPaths) {
      const randomPhase = Math.random() > 0.5 ? 1 : -1;
      const dir = path.arrivalDirection;
      const recGain = recForDownload ? recForDownload.getGain([dir.x, dir.y, dir.z]) : 1.0;
      const pressure = this.calculateArrivalPressure(spls, path, recGain);
      const roundedSample = Math.floor(path.arrivalTime * sampleRate);

      for (let f = 0; f < this.frequencies.length; f++) {
        if (roundedSample < samples[f].length) {
          samples[f][roundedSample] += pressure[f] * randomPhase;
        }
      }
    }

    for (let f = 0; f < this.frequencies.length; f++) {
      const blob = ac.wavAsBlob([normalize(samples[f])], { sampleRate, bitDepth: 32 });
      FileSaver.saveAs(blob, `${this.frequencies[f]}_${filename}.wav`);
    }
  }

  /**
   * Quick RT60 estimate by shooting random rays through the room geometry.
   * Runs in batches via setInterval to avoid blocking the UI.
   */
  startQuickEstimate(numRays: number = 500) {
    // Cancel any running estimate
    if (this._quickEstimateInterval !== null) {
      window.clearInterval(this._quickEstimateInterval);
      this._quickEstimateInterval = null;
    }

    if (this.sourceIDs.length === 0) return;
    const source = useContainer.getState().containers[this.sourceIDs[0]] as Source;
    if (!source) return;

    // Gather surface meshes for raycasting (same as _computeDiffractionPaths)
    const room = this.room;
    if (!room) return;

    const surfaceMeshes: THREE.Object3D[] = [];
    room.surfaces.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        surfaceMeshes.push(child);
      }
    });
    if (surfaceMeshes.length === 0) return;

    this.quickEstimateResults = [];
    this.estimatedT30 = null;
    let count = 0;
    const batchSize = 10;

    this._quickEstimateInterval = window.setInterval(() => {
      for (let i = 0; i < batchSize && count < numRays; i++, count++) {
        const result = sharedQuickEstimateStep(
          this._raycaster, surfaceMeshes,
          source.position, source.initialIntensity,
          this.frequencies, this.temperature
        );
        this.quickEstimateResults.push(result);
      }

      if (count >= numRays) {
        window.clearInterval(this._quickEstimateInterval!);
        this._quickEstimateInterval = null;

        // Average per-band RT60s
        const numBands = this.frequencies.length;
        const avgRt60s = Array(numBands).fill(0);
        let validCounts = Array(numBands).fill(0);

        for (const r of this.quickEstimateResults) {
          for (let f = 0; f < numBands; f++) {
            if (r.rt60s[f] > 0) {
              avgRt60s[f] += r.rt60s[f];
              validCounts[f]++;
            }
          }
        }

        for (let f = 0; f < numBands; f++) {
          avgRt60s[f] = validCounts[f] > 0 ? avgRt60s[f] / validCounts[f] : 0;
        }

        this.estimatedT30 = avgRt60s;
        emit("BEAMTRACE_QUICK_ESTIMATE_COMPLETE", this.uuid);
      }
    }, 5);
  }

  // Clear results
  reset() {
    this.validPaths = [];
    this.clearVisualization();
    this.btSolver = null;
    this.lastMetrics = null;

    // Clear response-by-intensity data
    this.responseByIntensity = undefined;

    // Clear quick estimate
    if (this._quickEstimateInterval !== null) {
      window.clearInterval(this._quickEstimateInterval);
      this._quickEstimateInterval = null;
    }
    this.quickEstimateResults = [];
    this.estimatedT30 = null;

    // Clear LTP data
    this.clearLevelTimeProgressionData();

    // Clear highlighted path and beams
    (this.selectedPath.geometry as MeshLine).setPoints([]);
    this.clearSelectedBeams();

    renderer.needsToRender = true;
  }

  // Helper to clear highlighted beam lines
  private clearSelectedBeams() {
    while (this.selectedBeamsGroup.children.length > 0) {
      const child = this.selectedBeamsGroup.children[0];
      this.selectedBeamsGroup.remove(child);
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry?.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    }
  }

  // Getters and setters
  get room(): Room | undefined {
    return useContainer.getState().containers[this.roomID] as Room | undefined;
  }

  get sources(): Source[] {
    return this.sourceIDs
      .map(id => useContainer.getState().containers[id] as Source)
      .filter(Boolean);
  }

  get receivers(): Receiver[] {
    return this.receiverIDs
      .map(id => useContainer.getState().containers[id] as Receiver)
      .filter(Boolean);
  }

  get numValidPaths(): number {
    return this.validPaths.length;
  }

  set maxReflectionOrderReset(order: number) {
    // Clamp to non-negative integer
    this.maxReflectionOrder = Math.max(0, Math.floor(order));
    // Update plotOrders and visibleOrders to include all orders up to the new max
    this._plotOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (_, i) => i);
    this._visibleOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (_, i) => i);
    // Auto-recalculate if we have sources and receivers configured
    if (this.sourceIDs.length > 0 && this.receiverIDs.length > 0) {
      this.calculate();
      emit("BEAMTRACE_CALCULATE_COMPLETE", this.uuid);
    } else {
      this.reset();
    }
  }

  get maxReflectionOrderReset(): number {
    return this.maxReflectionOrder;
  }

  get visualizationMode(): VisualizationMode {
    return this._visualizationMode;
  }

  set visualizationMode(mode: VisualizationMode) {
    this._visualizationMode = mode;

    // Clear and redraw based on mode
    this.clearVisualization();

    switch (mode) {
      case "rays":
        if (this.validPaths.length > 0) {
          this.drawPaths();
        }
        break;
      case "beams":
        if (this.btSolver) {
          this.drawBeams();
        }
        break;
      case "both":
        if (this.validPaths.length > 0) {
          this.drawPaths();
        }
        if (this.btSolver) {
          this.drawBeams();
        }
        break;
    }

    renderer.needsToRender = true;
  }

  // Show all beams toggle (including invalid/orphaned beams)
  get showAllBeams(): boolean {
    return this._showAllBeams;
  }

  set showAllBeams(value: boolean) {
    this._showAllBeams = value;
    // Redraw beams if in beams or both mode
    if (this._visualizationMode === "beams" || this._visualizationMode === "both") {
      this.clearVisualization();
      if (this._visualizationMode === "both" && this.validPaths.length > 0) {
        this.drawPaths();
      }
      if (this.btSolver) {
        this.drawBeams();
      }
      renderer.needsToRender = true;
    }
  }

  // Visible reflection orders for filtering visualization
  get visibleOrders(): number[] {
    return this._visibleOrders;
  }

  set visibleOrders(orders: number[]) {
    this._visibleOrders = orders;
    // Redraw visualization with new filter
    this.clearVisualization();
    switch (this._visualizationMode) {
      case "rays":
        if (this.validPaths.length > 0) {
          this.drawPaths();
        }
        break;
      case "beams":
        if (this.btSolver) {
          this.drawBeams();
        }
        break;
      case "both":
        if (this.validPaths.length > 0) {
          this.drawPaths();
        }
        if (this.btSolver) {
          this.drawBeams();
        }
        break;
    }
    renderer.needsToRender = true;
  }

  // Debug a specific beam path by polygon IDs
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

    const listenerPos: BT_Vector3 = [
      receiver.position.x,
      receiver.position.y,
      receiver.position.z
    ];

    console.group(`🔍 Debugging beam path: [${polygonPath.join(' → ')}]`);
    this.btSolver.debugBeamPath(listenerPos, polygonPath);
    console.groupEnd();
  }

  // Enable/disable BSP debug output (placeholder - setBSPDebug not exported from beam-trace)
  setBSPDebug(enabled: boolean) {
    // Note: setBSPDebug is not currently exported from beam-trace package
    // This is a placeholder that logs the intent
    console.log(`BeamTraceSolver: BSP debug ${enabled ? 'enabled' : 'disabled'} (note: requires beam-trace package update to export setBSPDebug)`);
  }

  // Get detailed paths with reflection information
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

    const listenerPos: BT_Vector3 = [
      receiver.position.x,
      receiver.position.y,
      receiver.position.z
    ];

    return this.btSolver.getDetailedPaths(listenerPos);
  }

  // Highlight a specific path by index (for interactive selection)
  highlightPathByIndex(pathIndex: number) {
    const sortedPaths = [...this.validPaths].sort((a, b) => a.arrivalTime - b.arrivalTime);

    if (pathIndex < 0 || pathIndex >= sortedPaths.length) {
      console.warn('BeamTraceSolver: Path index out of bounds:', pathIndex);
      return;
    }

    const path = sortedPaths[pathIndex];

    // Clear previous selections
    (this.selectedPath.geometry as MeshLine).setPoints([]);
    this.clearSelectedBeams();

    // Get the order-based color for this path
    const pathColorHex = getOrderColor(path.order, this.maxReflectionOrder);

    // Draw the ray path inside the room with order-based color (solid lines)
    const rayMaterial = new THREE.LineBasicMaterial({
      color: pathColorHex,
      linewidth: 2,
      transparent: false
    });

    // Draw each segment of the ray path
    for (let i = 0; i < path.points.length - 1; i++) {
      const segmentGeom = new THREE.BufferGeometry().setFromPoints([
        path.points[i],
        path.points[i + 1]
      ]);
      const segmentLine = new THREE.Line(segmentGeom, rayMaterial);
      this.selectedBeamsGroup.add(segmentLine);
    }

    // Draw dashed line from virtual source to receiver for each reflection order
    if (this.btSolver && this.receiverIDs.length > 0) {
      const receiver = useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
      if (receiver) {
        // Find the virtual source for the highest order beam in this path
        const beamData = this.btSolver.getBeamsForVisualization(this.maxReflectionOrder);
        const lastPolygonId = path.polygonIds[path.order];

        if (lastPolygonId !== null) {
          const matchingBeam = beamData.find((beam: BeamVisualizationData) =>
            beam.polygonId === lastPolygonId && beam.reflectionOrder === path.order
          );

          if (matchingBeam) {
            const dashedMaterial = new THREE.LineDashedMaterial({
              color: pathColorHex,
              linewidth: 1,
              dashSize: 0.3,
              gapSize: 0.15,
              transparent: true,
              opacity: 0.7
            });

            const virtualSourcePos = new THREE.Vector3(
              matchingBeam.virtualSource[0],
              matchingBeam.virtualSource[1],
              matchingBeam.virtualSource[2]
            );
            const receiverPos = receiver.position.clone();

            const dashedLineGeom = new THREE.BufferGeometry().setFromPoints([virtualSourcePos, receiverPos]);
            const dashedLine = new THREE.Line(dashedLineGeom, dashedMaterial);
            dashedLine.computeLineDistances();
            this.selectedBeamsGroup.add(dashedLine);
          }
        }
      }
    }

    console.log(`BeamTraceSolver: Highlighting path ${pathIndex} with order ${path.order}, arrival time ${path.arrivalTime.toFixed(4)}s`);

    renderer.needsToRender = true;
  }

  // Clear the current path highlight
  clearPathHighlight() {
    (this.selectedPath.geometry as MeshLine).setPoints([]);
    this.clearSelectedBeams();
    renderer.needsToRender = true;
  }
}

export default BeamTraceSolver;

// Event type declarations
declare global {
  interface EventTypes {
    ADD_BEAMTRACE: BeamTraceSolver | undefined;
    REMOVE_BEAMTRACE: string;
    BEAMTRACE_SET_PROPERTY: SetPropertyPayload<BeamTraceSolver>;
    BEAMTRACE_CALCULATE: string;
    BEAMTRACE_CALCULATE_COMPLETE: string;
    BEAMTRACE_RESET: string;
    BEAMTRACE_PLAY_IR: string;
    BEAMTRACE_DOWNLOAD_IR: string;
    BEAMTRACE_DOWNLOAD_AMBISONIC_IR: { uuid: string; order: number };
    BEAMTRACE_PLAY_BINAURAL_IR: { uuid: string; order: number };
    BEAMTRACE_DOWNLOAD_BINAURAL_IR: { uuid: string; order: number };
    BEAMTRACE_DOWNLOAD_OCTAVE_IR: string;
    BEAMTRACE_QUICK_ESTIMATE: string;
    BEAMTRACE_QUICK_ESTIMATE_COMPLETE: string;
    SHOULD_ADD_BEAMTRACE: undefined;
  }
}

// Event handlers
on("BEAMTRACE_SET_PROPERTY", setSolverProperty);
on("REMOVE_BEAMTRACE", removeSolver);
on("ADD_BEAMTRACE", addSolver(BeamTraceSolver));

on("BEAMTRACE_CALCULATE", (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
  solver.calculate();
  // Defer the complete event to allow React state updates to flush
  // This ensures setCalculating(true) is processed before setCalculating(false)
  setTimeout(() => emit("BEAMTRACE_CALCULATE_COMPLETE", uuid), 0);
});

on("BEAMTRACE_RESET", (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
  solver.reset();
});

on("BEAMTRACE_PLAY_IR", (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
  solver.playImpulseResponse().catch((err: Error) => {
    window.alert(err.message || "Failed to play impulse response");
  });
});

on("BEAMTRACE_DOWNLOAD_IR", (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
  const containers = useContainer.getState().containers;
  const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || 'source' : 'source';
  const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || 'receiver' : 'receiver';
  const filename = `ir-beamtrace-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, '_');
  solver.downloadImpulseResponse(filename).catch((err: Error) => {
    window.alert(err.message || "Failed to download impulse response");
  });
});

on("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid, order }: { uuid: string; order: number }) => {
  const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
  const containers = useContainer.getState().containers;
  const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || 'source' : 'source';
  const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || 'receiver' : 'receiver';
  const filename = `ir-beamtrace-ambi-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, '_');
  solver.downloadAmbisonicImpulseResponse(filename, order).catch((err: Error) => {
    window.alert(err.message || "Failed to download ambisonic impulse response");
  });
});

on("BEAMTRACE_PLAY_BINAURAL_IR", ({ uuid, order }: { uuid: string; order: number }) => {
  const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
  solver.playBinauralImpulseResponse(order).catch((err: Error) => {
    window.alert(err.message || "Failed to play binaural impulse response");
  });
});

on("BEAMTRACE_DOWNLOAD_BINAURAL_IR", ({ uuid, order }: { uuid: string; order: number }) => {
  const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
  const containers = useContainer.getState().containers;
  const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || 'source' : 'source';
  const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || 'receiver' : 'receiver';
  const filename = `ir-beamtrace-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, '_');
  solver.downloadBinauralImpulseResponse(filename, order).catch((err: Error) => {
    window.alert(err.message || "Failed to download binaural impulse response");
  });
});

on("BEAMTRACE_DOWNLOAD_OCTAVE_IR", (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
  const containers = useContainer.getState().containers;
  const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || 'source' : 'source';
  const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || 'receiver' : 'receiver';
  const filename = `ir-beamtrace-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, '_');
  try {
    solver.downloadOctaveBandIR(filename);
  } catch (err: any) {
    window.alert(err.message || "Failed to download octave-band impulse responses");
  }
});

on("BEAMTRACE_QUICK_ESTIMATE", (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as BeamTraceSolver;
  solver.startQuickEstimate();
});

on("SHOULD_ADD_BEAMTRACE", () => {
  emit("ADD_BEAMTRACE", undefined);
});
