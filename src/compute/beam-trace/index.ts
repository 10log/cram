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
import FileSaver from 'file-saver';
import { audioEngine } from "../../audio-engine/audio-engine";
import chroma from 'chroma-js';

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
  // Detailed reflection info (optional, populated when using getDetailedPaths)
  reflections?: {
    polygonId: number;
    hitPoint: THREE.Vector3;
    incidenceAngle: number;
    surfaceNormal: THREE.Vector3;
    isGrazing: boolean;
  }[];
}

export type VisualizationMode = "rays" | "beams" | "both";

export interface BeamTraceSaveObject {
  name: string;
  kind: "beam-trace";
  uuid: string;
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
}

const defaults: Required<BeamTraceSolverParams> = {
  name: "Beam Trace",
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

  // Results
  validPaths: BeamTracePath[] = [];
  impulseResponse!: AudioBuffer;
  impulseResponsePlaying: boolean = false;

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

  save(): BeamTraceSaveObject {
    return {
      ...pickProps([
        "name",
        "kind",
        "uuid",
        "roomID",
        "sourceIDs",
        "receiverIDs",
        "maxReflectionOrder",
        "frequencies",
        "levelTimeProgression",
        "impulseResponseResult"
      ], this),
      visualizationMode: this._visualizationMode,
      showAllBeams: this._showAllBeams,
      visibleOrders: this._visibleOrders,
    } as BeamTraceSaveObject;
  }

  restore(state: BeamTraceSaveObject): this {
    this.name = state.name;
    this.uuid = state.uuid;
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

    console.log(`BeamTraceSolver: Built with ${this.polygons.length} polygons, max order ${this.maxReflectionOrder}`);
  }

  // Calculate paths to all receivers
  calculate() {
    if (this.sourceIDs.length === 0 || this.receiverIDs.length === 0) {
      console.warn("BeamTraceSolver: Need at least one source and one receiver");
      return;
    }

    // Rebuild solver (in case source moved or room changed)
    this.buildSolver();

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
      // Get paths from beam-trace solver
      const paths = this.btSolver!.getPaths(listenerPos);
      this.lastMetrics = this.btSolver!.getMetrics();

      // Convert to our format
      paths.forEach(path => {
        const btPath = this.convertPath(path);
        this.validPaths.push(btPath);
      });
    });

    // Sort by arrival time
    this.validPaths.sort((a, b) => a.arrivalTime - b.arrivalTime);

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
    this.calculateLTP(343);

    console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`);
    if (this.lastMetrics) {
      console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`);
      console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`);
      console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`);
    }

    renderer.needsToRender = true;
  }

  // Convert beam-trace path to our format
  private convertPath(path: ReflectionPath3D): BeamTracePath {
    const points = path.map(p => new THREE.Vector3(p.position[0], p.position[1], p.position[2]));
    const length = computePathLength(path);
    const arrivalTime = computeArrivalTime(path);
    const order = getPathReflectionOrder(path);
    const polygonIds = path.map(p => p.polygonId);

    return { points, order, length, arrivalTime, polygonIds };
  }

  // Calculate Level Time Progression result
  calculateLTP(_c: number = 343) {
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

    // Calculate arrival pressure for each path
    for (let i = 0; i < sortedPaths.length; i++) {
      const path = sortedPaths[i];
      const pressure = this.calculateArrivalPressure(levelTimeProgression.info.initialSPL, path);
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
    this.calculateLTP(343);
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
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
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

    // Add contributions from each path
    for (const path of this.validPaths) {
      const randomPhase = Math.random() > 0.5 ? 1 : -1;
      const pressure = this.calculateArrivalPressure(spls, path);
      const roundedSample = Math.floor(path.arrivalTime * sampleRate);

      for (let f = 0; f < this.frequencies.length; f++) {
        if (roundedSample < samples[f].length) {
          samples[f][roundedSample] += pressure[f] * randomPhase;
        }
      }
    }

    // Use filter worker (similar to RayTracer)
    const FilterWorker = () => new Worker(new URL('../../audio-engine/filter.worker.ts', import.meta.url));
    const worker = FilterWorker();

    return new Promise((resolve, reject) => {
      worker.postMessage({ samples });

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
  private calculateArrivalPressure(initialSPL: number[], path: BeamTracePath): number[] {
    const intensities = ac.P2I(ac.Lp2P(initialSPL)) as number[];

    // Apply absorption at each reflection
    path.polygonIds.forEach(polygonId => {
      if (polygonId === null) return; // Source or receiver point

      const surface = this.polygonToSurface.get(polygonId);
      if (!surface) return;

      for (let f = 0; f < this.frequencies.length; f++) {
        const R = 1 - surface.absorptionFunction(this.frequencies[f]);
        intensities[f] *= R;
      }
    });

    // Convert back to SPL and apply air absorption
    const arrivalLp = ac.P2Lp(ac.I2P(intensities)) as number[];
    const airAttenuationdB = ac.airAttenuation(this.frequencies);

    for (let f = 0; f < this.frequencies.length; f++) {
      arrivalLp[f] -= airAttenuationdB[f] * path.length;
    }

    return ac.Lp2P(arrivalLp) as number[];
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
    if (!this.impulseResponse) {
      await this.calculateImpulseResponse();
    }

    if (audioEngine.context.state === 'suspended') {
      audioEngine.context.resume();
    }

    const source = audioEngine.context.createBufferSource();
    source.buffer = this.impulseResponse;
    source.connect(audioEngine.context.destination);
    source.start();

    emit("BEAMTRACE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: true });

    source.onended = () => {
      source.stop();
      source.disconnect(audioEngine.context.destination);
      emit("BEAMTRACE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: false });
    };
  }

  async downloadImpulseResponse(filename: string, sampleRate = audioEngine.sampleRate) {
    if (!this.impulseResponse) {
      await this.calculateImpulseResponse();
    }

    const blob = ac.wavAsBlob([normalize(this.impulseResponse.getChannelData(0))], { sampleRate, bitDepth: 32 });
    const extension = !filename.endsWith(".wav") ? ".wav" : "";
    FileSaver.saveAs(blob, filename + extension);
  }

  // Clear results
  reset() {
    this.validPaths = [];
    this.clearVisualization();
    this.btSolver = null;
    this.lastMetrics = null;

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
    // Update plotOrders to include all orders up to the new max
    this._plotOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (_, i) => i);
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

on("SHOULD_ADD_BEAMTRACE", () => {
  emit("ADD_BEAMTRACE", undefined);
});
