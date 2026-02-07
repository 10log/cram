import Solver from "../solver";
import * as THREE from "three";
import Room from "../../objects/room";
import { KVP } from "../../common/key-value-pair";
import Container from "../../objects/container";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";
import Source from "../../objects/source";
import Surface from "../../objects/surface";
import Receiver from "../../objects/receiver";
import { Stat } from "../../components/parameter-config/Stats";
import { emit, messenger, on } from "../../messenger";

import Plotly, { PlotData } from "plotly.js";

import PointShader from "./shaders/points";
import * as ac from "../acoustics";
import { BVH } from "./bvh/BVH";
import { renderer } from "../../render/renderer";
import { addSolver, callSolverMethod, removeSolver, setSolverProperty, useContainer, useSolver } from "../../store";
import { ResultKind } from "../../store/result-store";
import {cramangle2threejsangle} from "../../common/dir-angle-conversions";
import { audioEngine } from "../../audio-engine/audio-engine";
import observe, { Observable } from "../../common/observable";
import { encodeBufferFromDirection, getAmbisonicChannelCount } from "ambisonics";

import {ImageSourceSolver, ImageSourceSolverParams} from "./image-source/index";

import {
  QuickEstimateStepResult, ResponseByIntensity, BandEnergy, Chain,
  RayPath, ChartData, ReceiverData, RayTracerParams,
  ConvergenceMetrics, defaults, DRAWSTYLE, normalize,
  DEFAULT_INTENSITY_SAMPLE_RATE, DEFAULT_INITIAL_SPL,
  RESPONSE_TIME_PADDING, QUICK_ESTIMATE_MAX_ORDER, MAX_DISPLAY_POINTS, RT60_DECAY_RATIO,
  HISTOGRAM_BIN_WIDTH, HISTOGRAM_NUM_BINS, CONVERGENCE_CHECK_INTERVAL_MS,
} from "./types";

// Extracted module imports
import { traceRay as traceRayFn, inFrontOf as inFrontOfFn } from "./ray-core";
import { arrivalPressure as arrivalPressureFn, calculateImpulseResponseForPair as calcIRForPairFn, calculateImpulseResponseForDisplay as calcIRForDisplayFn } from "./impulse-response";
import { reflectionLossFunction as reflectionLossFunctionFn, calculateReflectionLoss as calculateReflectionLossFn, calculateResponseByIntensity as calcResponseByIntensityFn, resampleResponseByIntensity as resampleResponseByIntensityFn, calculateT20 as calculateT20Fn, calculateT30 as calculateT30Fn, calculateT60 as calculateT60Fn } from "./response-by-intensity";
import { pathsToLinearBuffer as pathsToLinearBufferFn, linearBufferToPaths as linearBufferToPathsFn } from "./serialization";
import { downloadImpulses as downloadImpulsesFn, playImpulseResponse as playImpulseResponseFn, downloadImpulseResponse as downloadImpulseResponseFn, downloadAmbisonicImpulseResponse as downloadAmbisonicIRFn } from "./export-playback";
import { resetConvergenceState, updateConvergenceMetrics, addToEnergyHistogram } from "./convergence";
import { buildEdgeGraph, findDiffractionPaths } from "./diffraction";
import type { EdgeGraph } from "./diffraction";

// Re-export all types for external consumers
export type {
  QuickEstimateStepResult, RayPathResult, ResponseByIntensity, BandEnergy, Chain,
  RayPath, EnergyTime, ChartData, RayTracerSaveObject, RayTracerParams,
  ConvergenceMetrics, DrawStyle,
} from "./types";
export {
  ReceiverData, defaults, DRAWSTYLE, normalize,
  SELF_INTERSECTION_OFFSET, DEFAULT_INTENSITY_SAMPLE_RATE, DEFAULT_INITIAL_SPL,
  RESPONSE_TIME_PADDING, QUICK_ESTIMATE_MAX_ORDER, MAX_DISPLAY_POINTS, RT60_DECAY_RATIO,
  HISTOGRAM_BIN_WIDTH, HISTOGRAM_NUM_BINS, CONVERGENCE_CHECK_INTERVAL_MS,
} from "./types";

// Webpack 5 native worker support
const FilterWorker = () => new Worker(new URL('../../audio-engine/filter.worker.ts', import.meta.url));

const {floor, random, abs, asin} = Math;
const coinFlip = () => random() > 0.5;

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

class RayTracer extends Solver {
  roomID: string;
  sourceIDs: string[];
  surfaceIDs: string[];
  receiverIDs: string[];
  updateInterval: number;
  reflectionOrder: number;
  raycaster: THREE.Raycaster;
  intersections: THREE.Intersection[];
  _isRunning: boolean;
  intervals: number[];
  rayBufferGeometry: THREE.BufferGeometry;
  rayBufferAttribute: THREE.Float32BufferAttribute;
  colorBufferAttribute: THREE.Float32BufferAttribute;
  rays: THREE.LineSegments;
  rayPositionIndex: number;
  maxrays: number;
  intersectableObjects: Array<THREE.Mesh | THREE.Object3D | Container>;
  paths: KVP<RayPath[]>;
  stats: KVP<Stat>;
  messageHandlerIDs: string[][];
  statsUpdatePeriod: number;
  lastTime: number;
  _runningWithoutReceivers: boolean;
  frequencies: number[];
  allReceiverData!: ReceiverData[];
  hits: THREE.Points;
  _pointSize: number;
  chartdata: ChartData[];
  passes: number;
  _raysVisible: boolean;
  _pointsVisible: boolean;
  _invertedDrawStyle: boolean;
  __start_time!: number;
  __calc_time!: number;
  __num_checked_paths!: number;
  responseOverlayElement: HTMLElement;
  quickEstimateResults: KVP<QuickEstimateStepResult[]>;
  responseByIntensity!: KVP<KVP<ResponseByIntensity>>;
  plotData: Plotly.Data[];
  intensitySampleRate: number;
  validRayCount: number;
  plotStyle: Partial<PlotData>;
  bvh!: BVH;
  observed_name: Observable<string>;

  _temperature: number;
  _cachedAirAtt: number[];

  hybrid: boolean;
  transitionOrder: number;

  convergenceThreshold: number;
  autoStop: boolean;
  rrThreshold: number;
  convergenceMetrics!: ConvergenceMetrics;
  _energyHistogram!: KVP<Float32Array[]>;
  _histogramBinWidth: number;
  _histogramNumBins: number;
  _lastConvergenceCheck!: number;
  _convergenceCheckInterval: number;

  _directivityRefPressures?: Map<string, number[]>;
  maxStoredPaths: number;
  edgeDiffractionEnabled: boolean;
  _edgeGraph: EdgeGraph | null;
  private _rafId: number = 0;

  constructor(params?: RayTracerParams) {
    super(params);
    this.kind = "ray-tracer";
    params = {    ...defaults, ...params    };
    this.uuid = params.uuid || this.uuid;
    this.name = params.name || defaults.name;
    this.observed_name = observe(this.name);
    this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div");
    this.responseOverlayElement.style.backgroundColor = "#FFFFFF";
    this.sourceIDs = params.sourceIDs || defaults.sourceIDs;
    this.surfaceIDs = params.surfaceIDs || defaults.surfaceIDs;
    this.roomID = params.roomID || defaults.roomID;
    this.receiverIDs = params.receiverIDs || defaults.receiverIDs;
    this.updateInterval = params.updateInterval || defaults.updateInterval;
    this.reflectionOrder = params.reflectionOrder || defaults.reflectionOrder;
    this._isRunning = params.isRunning || defaults.isRunning;
    this._runningWithoutReceivers = params.runningWithoutReceivers || defaults.runningWithoutReceivers;
    this.frequencies = params.frequencies || defaults.frequencies;
    this._temperature = params.temperature ?? defaults.temperature;
    this._cachedAirAtt = ac.airAttenuation(this.frequencies, this._temperature);
    this.intervals = [] as number[];
    this.plotData = [] as Plotly.Data[];
    this.plotStyle = params.plotStyle || defaults.plotStyle;
    this.lastTime = Date.now();
    this.statsUpdatePeriod = 100;
    this._pointSize = params.pointSize || defaults.pointSize;
    this.validRayCount = 0;
    this.intensitySampleRate = DEFAULT_INTENSITY_SAMPLE_RATE;
    this.quickEstimateResults = {} as KVP<QuickEstimateStepResult[]>;

    const paramsHasRaysVisible = typeof params.raysVisible === "boolean";
    this._raysVisible = paramsHasRaysVisible ? params.raysVisible! : defaults.raysVisible;

    const paramsHasPointsVisible = typeof params.pointsVisible === "boolean";
    this._pointsVisible = paramsHasPointsVisible ? params.pointsVisible! : defaults.pointsVisible;

    const paramsHasInvertedDrawStyle = typeof params.invertedDrawStyle === "boolean";
    this._invertedDrawStyle = paramsHasInvertedDrawStyle ? params.invertedDrawStyle! : defaults.invertedDrawStyle;

    this.passes = params.passes || defaults.passes;
    this.raycaster = new THREE.Raycaster();
    this.rayBufferGeometry = new THREE.BufferGeometry();
    this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry";
    this.maxrays = 1e6 - 1;
    this.rayBufferAttribute = new THREE.Float32BufferAttribute(new Float32Array(this.maxrays), 3);
    this.rayBufferAttribute.setUsage(THREE.DynamicDrawUsage);
    this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute);
    this.rayBufferGeometry.setDrawRange(0, this.maxrays);
    this.colorBufferAttribute = new THREE.Float32BufferAttribute(new Float32Array(this.maxrays), 2);
    this.colorBufferAttribute.setUsage(THREE.DynamicDrawUsage);
    this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute);
    this.chartdata = [] as ChartData[];

    this.hybrid = false;
    this.transitionOrder = 2;

    this.convergenceThreshold = params.convergenceThreshold ?? defaults.convergenceThreshold;
    this.autoStop = params.autoStop ?? defaults.autoStop;
    this.rrThreshold = params.rrThreshold ?? defaults.rrThreshold;
    this.maxStoredPaths = params.maxStoredPaths ?? defaults.maxStoredPaths;
    this.edgeDiffractionEnabled = params.edgeDiffractionEnabled ?? defaults.edgeDiffractionEnabled;
    this._edgeGraph = null;
    this._histogramBinWidth = HISTOGRAM_BIN_WIDTH;
    this._histogramNumBins = HISTOGRAM_NUM_BINS;
    this._convergenceCheckInterval = CONVERGENCE_CHECK_INTERVAL_MS;
    this._resetConvergenceState();

    this.rays = new THREE.LineSegments(
      this.rayBufferGeometry,
      new THREE.LineBasicMaterial({
        fog: false,
        color: 0x282929,
        transparent: true,
        opacity: 0.2,
        premultipliedAlpha: true,
        blending: THREE.NormalBlending,
        depthFunc: THREE.AlwaysDepth,
        name: "raytracer-rays-material"
        // depthTest: false
      })
    );
    this.rays.renderOrder = -0.5;
    this.rays.frustumCulled = false;
    renderer.scene.add(this.rays);

    var shaderMaterial = new THREE.ShaderMaterial({
      fog: false,
      vertexShader: PointShader.vs,
      fragmentShader: PointShader.fs,
      transparent: true,
      premultipliedAlpha: true,
      uniforms: {
        drawStyle: { value: DRAWSTYLE.ENERGY },
        inverted: { value: 0.0 },
        pointScale: { value: this._pointSize }
      },
      blending: THREE.NormalBlending,
      name: "raytracer-points-material"
    });
    // var pointsMaterial = new THREE.PointsMaterial({fog:false,
    //   color: 0xff0000,
    //   transparent: true,
    //   opacity: 0.2,
    //   premultipliedAlpha: true,
    //   blending: THREE.NormalBlending
    // });
    this.hits = new THREE.Points(this.rayBufferGeometry, shaderMaterial);
    this.hits.frustumCulled = false;
    renderer.scene.add(this.hits);
    this.rayPositionIndex = 0;
    Object.defineProperty(this.raycaster, "firstHitOnly", {
      value: true,
      writable: true
    });

    // raycaster.intersectObjects([mesh]);
    this.intersections = [] as THREE.Intersection[];
    this.findIDs();
    this.intersectableObjects = [] as Array<THREE.Mesh | THREE.Object3D | Container>;
    this.paths = params.paths || defaults.paths;
    this.stats = {
      numRaysShot: {
        name: "# of rays shot",
        value: 0
      },
      numValidRayPaths: {
        name: "# of valid rays",
        value: 0
      }
    };
    renderer.overlays.global.addCell("Valid Rays", this.validRayCount, {
      id: this.uuid + "-valid-ray-count",
      hidden: true,
      formatter: (value) => String(value)
    });
    this.messageHandlerIDs = [] as string[][];
    messenger.postMessage("STATS_SETUP", this.stats);
    this.messageHandlerIDs.push(
      messenger.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (acc, ...args) => {
        console.log(args && args[0] && args[0] instanceof Array && args[1] && args[1] === this.uuid);
        if (args && args[0] && args[0] instanceof Array && args[1] && args[1] === this.uuid) {
          this.sourceIDs = args[0].map((x) => x.id);
        }
      })
    );
    this.messageHandlerIDs.push(
      messenger.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (acc, ...args) => {
        if (args && args[0] && args[0] instanceof Array && args[1] && args[1] === this.uuid) {
          this.receiverIDs = args[0].map((x) => x.id);
        }
      })
    );
    this.messageHandlerIDs.push(
      messenger.addMessageHandler("SHOULD_REMOVE_CONTAINER", (acc, ...args) => {
        const id = args[0] as string;
        if (id) {
          console.log(id);
          if (this.sourceIDs.includes(id)) {
            this.sourceIDs = this.sourceIDs.filter((x) => x != id);
          } else if (this.receiverIDs.includes(id)) {
            this.receiverIDs = this.receiverIDs.filter((x) => x != id);
          }
        }
      })
    );
    this.step = this.step.bind(this);
    this.calculateImpulseResponse = this.calculateImpulseResponse.bind(this);
  }
  update = () => {};
  get temperature(): number {
    return this._temperature;
  }
  set temperature(value: number) {
    this._temperature = value;
    this._cachedAirAtt = ac.airAttenuation(this.frequencies, value);
  }
  get c(): number {
    return ac.soundSpeed(this._temperature);
  }

  save() {
    const {
      name,
      kind,
      uuid,
      autoCalculate,
      roomID,
      sourceIDs,
      surfaceIDs,
      receiverIDs,
      updateInterval,
      passes,
      pointSize,
      reflectionOrder,
      runningWithoutReceivers,
      raysVisible,
      pointsVisible,
      invertedDrawStyle,
      plotStyle,
      paths,
      frequencies,
      temperature,
      convergenceThreshold,
      autoStop,
      rrThreshold,
      maxStoredPaths,
      edgeDiffractionEnabled,
    } = this;
    return {
      name,
      kind,
      uuid,
      autoCalculate,
      roomID,
      sourceIDs,
      surfaceIDs,
      receiverIDs,
      updateInterval,
      passes,
      pointSize,
      reflectionOrder,
      runningWithoutReceivers,
      raysVisible,
      pointsVisible,
      invertedDrawStyle,
      plotStyle,
      paths,
      frequencies,
      temperature,
      convergenceThreshold,
      autoStop,
      rrThreshold,
      maxStoredPaths,
      edgeDiffractionEnabled,
    };
  }



  removeMessageHandlers() {
    this.messageHandlerIDs.forEach((x) => {
      messenger.removeMessageHandler(x[0], x[1]);
    });
  }
  dispose() {
    this.removeMessageHandlers();
    Object.keys(window.vars).forEach(key=>{
      if(window.vars[key]['uuid']===this.uuid){
        delete window.vars[key];
      }
    })
    renderer.scene.remove(this.rays);
    renderer.scene.remove(this.hits);
  }
  addSource(source: Source) {
    useContainer.getState().containers[source.uuid] = source;
    this.findIDs();
    this.mapIntersectableObjects();
  }
  addReceiver(rec: Receiver) {
    useContainer.getState().containers[rec.uuid] = rec;
    this.findIDs();
    this.mapIntersectableObjects();
  }

  mapIntersectableObjects() {
    const surfaces = [] as THREE.Mesh[];

    this.room.surfaces.traverse((container)=>{
      if(container['kind'] && container['kind'] === 'surface'){
        surfaces.push((container as Surface).mesh);
      }
    });

    if (this.runningWithoutReceivers) {
      this.intersectableObjects = surfaces;
    } else {
      this.intersectableObjects = surfaces.concat(this.receivers);
    }
  }

  findIDs() {
    this.sourceIDs = [];
    this.receiverIDs = [];
    this.surfaceIDs = [];
    for (const key in useContainer.getState().containers) {
      if (useContainer.getState().containers[key].kind === "room") {
        this.roomID = key;
      } else if (useContainer.getState().containers[key].kind === "source") {
        this.sourceIDs.push(key);
      } else if (useContainer.getState().containers[key].kind === "receiver") {
        this.receiverIDs.push(key);
      } else if (useContainer.getState().containers[key].kind === "surface") {
        this.surfaceIDs.push(key);
      }
    }
    this.mapIntersectableObjects();
  }

  setDrawStyle(drawStyle: number) {
    (this.hits.material as THREE.ShaderMaterial).uniforms["drawStyle"].value = drawStyle;
    (this.hits.material as THREE.ShaderMaterial).needsUpdate = true;
    renderer.needsToRender = true;
  }

  setPointScale(scale: number) {
    this._pointSize = scale;
    (this.hits.material as THREE.ShaderMaterial).uniforms["pointScale"].value = this._pointSize;
    (this.hits.material as THREE.ShaderMaterial).needsUpdate = true;
    renderer.needsToRender = true;
  }

  incrementRayPositionIndex() {
    if (this.rayPositionIndex < this.maxrays) {
      return this.rayPositionIndex++;
    } else {
      this.rayPositionIndex = 0;
      this.rayPositionIndexDidOverflow = true;
      return this.rayPositionIndex;
    }
  }
  rayPositionIndexDidOverflow = false;
  appendRay(p1: [number, number, number], p2: [number, number, number], energy: number = 1.0, angle: number = 1.0) {
    // set p1
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), p1[0], p1[1], p1[2]);

    // set the color
    this.colorBufferAttribute.setXY(this.rayPositionIndex, energy, angle);

    // set p2
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), p2[0], p2[1], p2[2]);

    // set the color
    this.colorBufferAttribute.setXY(this.rayPositionIndex, energy, angle);

    //update the draw range
    this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex);
  }

  flushRayBuffer() {
    this.rayBufferAttribute.needsUpdate = true;
    this.rayBufferAttribute.version++;
    this.colorBufferAttribute.needsUpdate = true;
    this.colorBufferAttribute.version++;
  }

  inFrontOf(a: THREE.Triangle, b: THREE.Triangle) {
    return inFrontOfFn(a, b);
  }

  traceRay(
    ro: THREE.Vector3,
    rd: THREE.Vector3,
    order: number,
    bandEnergy: BandEnergy,
    source: string,
    initialPhi: number,
    initialTheta: number,
    iter: number = 1,
    chain: Partial<Chain>[] = [],
  ) {
    return traceRayFn(
      this.raycaster, this.intersectableObjects, this.frequencies,
      this._cachedAirAtt, this.rrThreshold,
      ro, rd, order, bandEnergy, source, initialPhi, initialTheta, iter, chain,
    );
  }

  startQuickEstimate(frequencies: number[] = this.frequencies, numRays: number = 1000) {
    const tempRunningWithoutReceivers = this.runningWithoutReceivers;
    this.runningWithoutReceivers = true;
    let count = 0;
    this.quickEstimateResults = {} as KVP<QuickEstimateStepResult[]>;
    this.sourceIDs.forEach((id) => {
      this.quickEstimateResults[id] = [] as QuickEstimateStepResult[];
    });
    let done = false;
    this.intervals.push(
      window.setInterval(() => {
        for (let i = 0; i < this.passes; i++, count++) {
          for (let j = 0; j < this.sourceIDs.length; j++) {
            const id = this.sourceIDs[j];
            const source = useContainer.getState().containers[id] as Source;
            this.quickEstimateResults[id].push(this.quickEstimateStep(source, frequencies, numRays));
          }
        }
        if (count >= numRays) {
          done = true;
          this.intervals.forEach((interval) => window.clearInterval(interval));
          this.runningWithoutReceivers = tempRunningWithoutReceivers;
          console.log(this.quickEstimateResults);
        } else {
          console.log(((count / numRays) * 100).toFixed(1) + "%");
        }
      }, this.updateInterval)
    );
  }
  quickEstimateStep(source: Source, frequencies: number[], numRays: number) {
    const soundSpeed = this.c;

    const rt60s = Array(frequencies.length).fill(0) as number[];

    // source position
    let position = source.position.clone();

    // random direction (rejection sampling for uniform sphere distribution)
    let dx: number, dy: number, dz: number, lenSq: number;
    do {
      dx = Math.random() * 2 - 1;
      dy = Math.random() * 2 - 1;
      dz = Math.random() * 2 - 1;
      lenSq = dx * dx + dy * dy + dz * dz;
    } while (lenSq > 1 || lenSq < 1e-6);
    let direction = new THREE.Vector3(dx, dy, dz).normalize();

    let angle = 0;

    const intensities = Array(frequencies.length).fill(source.initialIntensity);

    let iter = 0;
    const maxOrder = QUICK_ESTIMATE_MAX_ORDER;

    let doneDecaying = false;

    let distance = 0;

    // attenuation in dB/m
    const airAttenuationdB = ac.airAttenuation(frequencies, this.temperature);

    let lastIntersection = {} as THREE.Intersection;

    while (!doneDecaying && iter < maxOrder) {
      // set the starting position and direction
      this.raycaster.ray.set(position, direction);

      // find the surface that the ray intersects
      const intersections = this.raycaster.intersectObjects(this.intersectableObjects, true);

      // if there was an intersection
      if (intersections.length > 0) {
        // console.log("itx",intersections[0].point)

        // find the incident angle
        angle = direction.clone().multiplyScalar(-1).angleTo(intersections[0].face!.normal);

        distance += intersections[0].distance;

        const surface = intersections[0].object.parent as Surface;

        // for each frequency
        for (let f = 0; f < frequencies.length; f++) {
          const freq = frequencies[f];
          let coefficient = 1;
          if (surface.kind === 'surface') {
            coefficient = surface.reflectionFunction(freq, angle);
          }
          intensities[f] *= coefficient;
          // const level = (ac.P2Lp(ac.I2P()) as number) - airAttenuationdB[f];
          const freqDoneDecaying = source.initialIntensity / intensities[f] > RT60_DECAY_RATIO;
          if (freqDoneDecaying) {
            rt60s[f] = distance / soundSpeed;
          }
          doneDecaying = doneDecaying || freqDoneDecaying;

          // intensities[f] = ac.P2I(ac.Lp2P(level));
        }

        if (intersections[0].object.parent instanceof Surface) {
          intersections[0].object.parent.numHits += 1;
        }

        // get the normal direction of the intersection
        const normal = intersections[0].face!.normal.normalize();

        // find the reflected direction
        direction.sub(normal.clone().multiplyScalar(direction.dot(normal)).multiplyScalar(2)).normalize();

        position.copy(intersections[0].point);

        lastIntersection = intersections[0];
      }
      iter += 1;
    }

    (this.stats.numRaysShot.value as number)++;

    return {
      distance,
      rt60s,
      angle,
      direction,
      lastIntersection
    };
  }

  startAllMonteCarlo() {
    this._lastConvergenceCheck = Date.now();
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
    const tick = () => {
      if (!this._isRunning) return;

      // Time-budgeted batching: trace as many batches as fit in ~12ms
      const budgetMs = 12;
      const start = performance.now();
      do {
        this.stepStratified(this.passes);
      } while (performance.now() - start < budgetMs);

      this.flushRayBuffer();
      renderer.needsToRender = true;

      // Periodic convergence check
      const now = Date.now();
      if (this.autoStop && now - this._lastConvergenceCheck >= this._convergenceCheckInterval) {
        this._lastConvergenceCheck = now;
        this._updateConvergenceMetrics();
        if (this.convergenceMetrics.convergenceRatio < this.convergenceThreshold
            && this.convergenceMetrics.t30Count >= 3) {
          this.isRunning = false;
          return;
        }
      }
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  stepStratified(numRays: number) {
    if (numRays <= 0) return;

    // Choose stratification dimensions such that nPhi * nTheta === numRays.
    // Start from sqrt(numRays) and search downward for a divisor.
    let nPhi = Math.floor(Math.sqrt(numRays));
    while (nPhi > 1 && numRays % nPhi !== 0) {
      nPhi--;
    }
    const nTheta = numRays / nPhi;

    for (let i = 0; i < this.sourceIDs.length; i++) {
      const source = useContainer.getState().containers[this.sourceIDs[i]] as Source;
      const sourcePhi = source.phi;
      const sourceTheta = source.theta;
      const position = source.position;
      const rotation = source.rotation;
      const sourceDH = source.directivityHandler;

      // cache on-axis reference pressures per source
      if (!this._directivityRefPressures) {
        this._directivityRefPressures = new Map();
      }
      const sourceId = this.sourceIDs[i];
      let refPressures = this._directivityRefPressures.get(sourceId);
      if (!refPressures || refPressures.length !== this.frequencies.length) {
        refPressures = new Array(this.frequencies.length);
        for (let f = 0; f < this.frequencies.length; f++) {
          refPressures[f] = sourceDH.getPressureAtPosition(0, this.frequencies[f], 0, 0) as number;
        }
        this._directivityRefPressures.set(sourceId, refPressures);
      }

      for (let si = 0; si < nPhi; si++) {
        for (let sj = 0; sj < nTheta; sj++) {
          this.__num_checked_paths += 1;

          // stratified jittered angles within the source directivity limits
          const phi = ((si + Math.random()) / nPhi) * sourcePhi;
          const theta = ((sj + Math.random()) / nTheta) * sourceTheta;

          let threeJSAngles: number[] = cramangle2threejsangle(phi, theta);
          const direction = new THREE.Vector3().setFromSphericalCoords(1, threeJSAngles[0], threeJSAngles[1]);
          direction.applyEuler(rotation);

          const initialBandEnergy: BandEnergy = new Array(this.frequencies.length);
          for (let f = 0; f < this.frequencies.length; f++) {
            let energy = 1;
            try {
              const dirPressure = sourceDH.getPressureAtPosition(0, this.frequencies[f], phi, theta);
              const refPressure = refPressures[f];
              if (typeof dirPressure === "number" && typeof refPressure === "number" && refPressure > 0) {
                energy = (dirPressure / refPressure) ** 2;
              }
            } catch (e) {
              // Fallback to unity gain
            }
            initialBandEnergy[f] = energy;
          }

          const path = this.traceRay(position, direction, this.reflectionOrder, initialBandEnergy, sourceId, phi, theta);

          if (path) {
            this._handleTracedPath(path, position, sourceId);
          }

          (this.stats.numRaysShot.value as number)++;
        }
      }
    }
  }

  /** Common path handling for both step() and stepStratified() */
  _handleTracedPath(path: RayPath, position: THREE.Vector3, sourceId: string) {
    if (this._runningWithoutReceivers) {
      this.appendRay(
        [position.x, position.y, position.z],
        path.chain[0].point,
        path.chain[0].energy || 1.0,
        path.chain[0].angle
      );
      for (let j = 1; j < path.chain.length; j++) {
        this.appendRay(path.chain[j - 1].point, path.chain[j].point, path.chain[j].energy || 1.0, path.chain[j].angle);
      }
      const index = path.chain[path.chain.length - 1].object;
      this._pushPathWithEviction(index, path);
      (useContainer.getState().containers[sourceId] as Source).numRays += 1;
    } else if (path.intersectedReceiver) {
      this.appendRay(
        [position.x, position.y, position.z],
        path.chain[0].point,
        path.chain[0].energy || 1.0,
        path.chain[0].angle
      );
      for (let j = 1; j < path.chain.length; j++) {
        this.appendRay(path.chain[j - 1].point, path.chain[j].point, path.chain[j].energy || 1.0, path.chain[j].angle);
      }
      (this.stats.numValidRayPaths.value as number)++;
      this.validRayCount += 1;
      renderer.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
      const receiverId = path.chain[path.chain.length - 1].object;
      this._pushPathWithEviction(receiverId, path);
      (useContainer.getState().containers[sourceId] as Source).numRays += 1;

      // Update energy histogram for convergence monitoring
      this._addToEnergyHistogram(receiverId, path);
    }
  }

  /** Push a path onto the paths array, evicting oldest if over maxStoredPaths */
  _pushPathWithEviction(index: string, path: RayPath) {
    const cap = Math.max(1, this.maxStoredPaths | 0);
    if (!this.paths[index]) {
      this.paths[index] = [path];
      return;
    }
    const arr = this.paths[index];
    if (arr.length >= cap) {
      const overflow = arr.length - cap + 1;
      if (overflow > 0) {
        arr.splice(0, overflow);
      }
    }
    arr.push(path);
  }

  /** Add a ray path's energy to the convergence histogram */
  _addToEnergyHistogram(receiverId: string, path: RayPath) {
    addToEnergyHistogram(this._energyHistogram, receiverId, path, this.frequencies, this.c, this._histogramBinWidth, this._histogramNumBins);
  }

  step() {
    for (let i = 0; i < this.sourceIDs.length; i++) {
      this.__num_checked_paths += 1;

      // random theta within the sources theta limits (0 to 180)
      const theta = (Math.random()) * (useContainer.getState().containers[this.sourceIDs[i]] as Source).theta;

      // random phi within the sources phi limits (0 to 360)
      const phi = (Math.random()) * (useContainer.getState().containers[this.sourceIDs[i]] as Source).phi;

      // source position
      const position = (useContainer.getState().containers[this.sourceIDs[i]] as Source).position;

      // source rotation
      const rotation = (useContainer.getState().containers[this.sourceIDs[i]] as Source).rotation;

      // random direction
      // const direction = new THREE.Vector3(0.75, Math.random() - 0.5, Math.random() - 0.5);
      let threeJSAngles: number[] = cramangle2threejsangle(phi, theta); // [phi, theta]
      const direction = new THREE.Vector3().setFromSphericalCoords(1, threeJSAngles[0], threeJSAngles[1]);
      direction.applyEuler(rotation);

      // assign source energy as a function of direction
      const sourceDH = (useContainer.getState().containers[this.sourceIDs[i]] as Source).directivityHandler;

      // cache on-axis reference pressures per source (constant for all rays from same source)
      if (!this._directivityRefPressures) {
        this._directivityRefPressures = new Map();
      }
      const sourceId = this.sourceIDs[i];
      let refPressures = this._directivityRefPressures.get(sourceId);
      if (!refPressures || refPressures.length !== this.frequencies.length) {
        refPressures = new Array(this.frequencies.length);
        for (let f = 0; f < this.frequencies.length; f++) {
          refPressures[f] = sourceDH.getPressureAtPosition(0, this.frequencies[f], 0, 0) as number;
        }
        this._directivityRefPressures.set(sourceId, refPressures);
      }

      const initialBandEnergy: BandEnergy = new Array(this.frequencies.length);
      for (let f = 0; f < this.frequencies.length; f++) {
        let energy = 1;
        try {
          const dirPressure = sourceDH.getPressureAtPosition(0, this.frequencies[f], phi, theta);
          const refPressure = refPressures[f];
          if (typeof dirPressure === "number" && typeof refPressure === "number" && refPressure > 0) {
            energy = (dirPressure / refPressure) ** 2;
          }
        } catch (e) {
          // Fallback to unity gain if directivity data is missing or lookup fails
        }
        initialBandEnergy[f] = energy;
      }

      // get the path traced by the ray
      const path = this.traceRay(position, direction, this.reflectionOrder, initialBandEnergy, this.sourceIDs[i], phi, theta);

      // if path exists
      if (path) {
        //  ignoring receiver intersections
        if (this._runningWithoutReceivers) {
          // add the first ray onto the buffer
          this.appendRay(
            [position.x, position.y, position.z],
            path.chain[0].point,
            path.chain[0].energy || 1.0,
            path.chain[0].angle
          );

          // add the rest of the rays onto the buffer
          for (let j = 1; j < path.chain.length; j++) {
            // starting at i=1 to avoid an if statement in here
            this.appendRay(
              // the previous point
              path.chain[j - 1].point,

              // the current point
              path.chain[j].point,

              // the energy content displayed as a color + alpha
              path.chain[j].energy || 1.0,
              path.chain[j].angle
            );
          }

          // get the uuid of the intersected receiver that way we can filter by receiver
          const index = path.chain[path.chain.length - 1].object;

          // if the receiver uuid is already defined, push the path on, else define it
          this._pushPathWithEviction(index, path);

          // increment the sources ray counter
          (useContainer.getState().containers[this.sourceIDs[i]] as Source).numRays += 1;
        }

        //  if we are checking receiver intersections
        else if (path["intersectedReceiver"]) {
          // add the ray to the buffer
          this.appendRay(
            [position.x, position.y, position.z],
            path.chain[0].point,
            path.chain[0].energy || 1.0,
            path.chain[0].angle
          );

          // add the rest of the rays
          for (let i = 1; i < path.chain.length; i++) {
            this.appendRay(
              // the previous point
              path.chain[i - 1].point,

              // the current point
              path.chain[i].point,

              // the energy content displayed as a color + alpha
              path.chain[i].energy || 1.0,
              path.chain[i].angle
            );
          }
          (this.stats.numValidRayPaths.value as number)++;
          this.validRayCount += 1;
          renderer.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
          const index = path.chain[path.chain.length - 1].object;
          this._pushPathWithEviction(index, path);

          // increment the sources ray counter
          (useContainer.getState().containers[this.sourceIDs[i]] as Source).numRays += 1;
        }
      }

      (this.stats.numRaysShot.value as number)++;
    }
  }

  /** Reset convergence state for a new simulation run */
  _resetConvergenceState() {
    const state = resetConvergenceState(this.frequencies.length);
    this.convergenceMetrics = state.convergenceMetrics;
    this._energyHistogram = state.energyHistogram;
    this._lastConvergenceCheck = state.lastConvergenceCheck;
  }

  /** Compute T30 from Schroeder backward integration of the energy histogram */
  _updateConvergenceMetrics() {
    updateConvergenceMetrics(
      this.convergenceMetrics, this._energyHistogram, this.frequencies,
      this.receiverIDs, this.__num_checked_paths, this.validRayCount,
      this._histogramBinWidth, this._histogramNumBins, this.uuid
    );
  }

  start() {
    this._cachedAirAtt = ac.airAttenuation(this.frequencies, this._temperature);
    this.mapIntersectableObjects();
    if (this.edgeDiffractionEnabled && this.room) {
      this._edgeGraph = buildEdgeGraph(this.room.allSurfaces);
    } else {
      this._edgeGraph = null;
    }
    this.__start_time = Date.now();
    this.__num_checked_paths = 0;
    this._resetConvergenceState();
    this.startAllMonteCarlo();
  }

  stop() {
    this.__calc_time = Date.now() - this.__start_time;
    cancelAnimationFrame(this._rafId);
    this._rafId = 0;
    this.intervals.forEach((interval) => {
      window.clearInterval(interval);
    });
    this.intervals = [] as number[];
    Object.keys(this.paths).forEach((key) => {
      const calc_time = this.__calc_time / 1000;
      const num_valid_rays = this.paths[key].length;
      const valid_ray_rate = num_valid_rays / calc_time;
      const num_checks = this.__num_checked_paths;
      const check_rate = num_checks / calc_time;
      console.log({
        calc_time,
        num_valid_rays,
        valid_ray_rate,
        num_checks,
        check_rate
      });
      this.paths[key].forEach((p) => {
        p.time = 0;
        p.totalLength = 0;
        for (let i = 0; i < p.chain.length; i++) {
          p.totalLength += p.chain[i].distance;
          p.time += p.chain[i].distance / this.c;
        }
      });
    });
    if (this.edgeDiffractionEnabled && this._edgeGraph && this._edgeGraph.edges.length > 0) {
      this._computeDiffractionPaths();
    }
    this.mapIntersectableObjects();
    this.reportImpulseResponse();
  }

  /** Compute deterministic diffraction paths and inject them into this.paths[] */
  _computeDiffractionPaths() {
    if (!this._edgeGraph) return;

    const containers = useContainer.getState().containers;

    // Gather source positions and directivity data
    const sourcePositions = new Map<string, [number, number, number]>();
    const sourceDirectivity = new Map<string, { handler: any; refPressures: number[] }>();
    for (const id of this.sourceIDs) {
      const src = containers[id] as Source;
      if (src) {
        sourcePositions.set(id, [src.position.x, src.position.y, src.position.z]);
        // Cache reference pressures for directivity
        const dh = src.directivityHandler;
        const refPressures = new Array(this.frequencies.length);
        for (let f = 0; f < this.frequencies.length; f++) {
          refPressures[f] = dh.getPressureAtPosition(0, this.frequencies[f], 0, 0) as number;
        }
        sourceDirectivity.set(id, { handler: dh, refPressures });
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

    // Get surface meshes for LOS checks (exclude receivers)
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
      this._temperature,
      this.raycaster,
      surfaces,
    );

    // Convert DiffractionPath → RayPath and inject into this.paths[]
    for (const dp of diffractionPaths) {
      // Apply source directivity to band energies
      const srcDir = sourceDirectivity.get(dp.sourceId);
      if (srcDir) {
        const srcPos = sourcePositions.get(dp.sourceId)!;
        // Direction from source to diffraction point
        const dx = dp.diffractionPoint[0] - srcPos[0];
        const dy = dp.diffractionPoint[1] - srcPos[1];
        const dz = dp.diffractionPoint[2] - srcPos[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 1e-10) {
          // Compute spherical angles in source frame (approximate)
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

      // Compute mean energy across bands (consistent with ray-core.ts)
      const meanEnergy = dp.bandEnergy.reduce((a, b) => a + b, 0) / dp.bandEnergy.length;

      // Compute arrival direction: edge→receiver (normalized)
      const recPos = receiverPositions.get(dp.receiverId)!;
      const adx = recPos[0] - dp.diffractionPoint[0];
      const ady = recPos[1] - dp.diffractionPoint[1];
      const adz = recPos[2] - dp.diffractionPoint[2];
      const adLen = Math.sqrt(adx * adx + ady * ady + adz * adz);
      const arrivalDirection: [number, number, number] = adLen > 1e-10
        ? [adx / adLen, ady / adLen, adz / adLen]
        : [0, 0, 1];

      // Compute individual leg distances for chain
      const srcPos = sourcePositions.get(dp.sourceId)!;
      const sDist = Math.sqrt(
        (dp.diffractionPoint[0] - srcPos[0]) ** 2 +
        (dp.diffractionPoint[1] - srcPos[1]) ** 2 +
        (dp.diffractionPoint[2] - srcPos[2]) ** 2
      );
      const rDist = dp.totalDistance - sDist;

      const rayPath: RayPath = {
        intersectedReceiver: true,
        chain: [
          {
            distance: sDist,
            point: dp.diffractionPoint,
            object: dp.edge.surface0Id,
            faceNormal: dp.edge.normal0,
            faceIndex: -1,
            faceMaterialIndex: -1,
            angle: 0,
            energy: meanEnergy,
            bandEnergy: dp.bandEnergy,
          },
          {
            distance: rDist,
            point: recPos,
            object: dp.receiverId,
            faceNormal: [0, 0, 0],
            faceIndex: -1,
            faceMaterialIndex: -1,
            angle: 0,
            energy: meanEnergy,
            bandEnergy: dp.bandEnergy,
          },
        ],
        chainLength: 2,
        energy: meanEnergy,
        bandEnergy: dp.bandEnergy,
        time: dp.time,
        source: dp.sourceId,
        initialPhi: 0,
        initialTheta: 0,
        totalLength: dp.totalDistance,
        arrivalDirection,
      };

      this._pushPathWithEviction(dp.receiverId, rayPath);
    }
  }

  async reportImpulseResponse() {
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;

    const containers = useContainer.getState().containers;
    const sampleRate = audioEngine.sampleRate;
    const { useResult } = require("../../store/result-store");

    // Count total pairs to calculate progress
    const pairs: Array<{ sourceId: string; receiverId: string; paths: RayPath[] }> = [];
    for (const sourceId of this.sourceIDs) {
      for (const receiverId of this.receiverIDs) {
        if (!this.paths[receiverId] || this.paths[receiverId].length === 0) continue;
        const pathsForPair = this.paths[receiverId].filter(p => p.source === sourceId);
        if (pathsForPair.length > 0) {
          pairs.push({ sourceId, receiverId, paths: pathsForPair });
        }
      }
    }

    if (pairs.length === 0) return;

    // Show progress indicator
    emit("SHOW_PROGRESS", {
      message: "Calculating impulse response...",
      progress: 0,
      solverUuid: this.uuid
    });

    // Calculate IR for each source-receiver pair
    for (let i = 0; i < pairs.length; i++) {
      const { sourceId, receiverId, paths: pathsForPair } = pairs[i];
      const sourceName = containers[sourceId]?.name || 'Source';
      const receiverName = containers[receiverId]?.name || 'Receiver';

      // Update progress
      const progressPercent = Math.round((i / pairs.length) * 100);
      emit("UPDATE_PROGRESS", {
        progress: progressPercent,
        message: `Calculating IR: ${sourceName} → ${receiverName}`
      });

      try {
        const { normalizedSignal } = await this.calculateImpulseResponseForPair(sourceId, receiverId, pathsForPair);

        // Also calculate the full impulse response for playback (first pair only)
        if (sourceId === this.sourceIDs[0] && receiverId === this.receiverIDs[0]) {
          this.calculateImpulseResponse().then(ir => {
            this.impulseResponse = ir;
          }).catch(console.error);
        }

        // Downsample for display (max 2000 points for performance)
        const maxDisplayPoints = MAX_DISPLAY_POINTS;
        const step = Math.max(1, Math.floor(normalizedSignal.length / maxDisplayPoints));
        const displayData: { time: number; amplitude: number }[] = [];

        for (let j = 0; j < normalizedSignal.length; j += step) {
          displayData.push({
            time: j / sampleRate,
            amplitude: normalizedSignal[j]
          });
        }

        // Use a deterministic UUID based on source/receiver pair so we update the same tab
        const resultUuid = `${this.uuid}-ir-${sourceId}-${receiverId}`;

        const existingResult = useResult.getState().results[resultUuid];

        const result = {
          kind: ResultKind.ImpulseResponse,
          name: `IR: ${sourceName} → ${receiverName}`,
          uuid: resultUuid,
          from: this.uuid,
          info: {
            sampleRate,
            sourceName,
            receiverName,
            sourceId,
            receiverId
          },
          data: displayData
        };

        if (existingResult) {
          // Update existing result
          emit("UPDATE_RESULT", { uuid: resultUuid, result });
        } else {
          // Add new result
          emit("ADD_RESULT", result);
        }
      } catch (err) {
        console.error(`Failed to calculate impulse response for ${sourceId} -> ${receiverId}:`, err);
      }
    }

    // Hide progress indicator
    emit("HIDE_PROGRESS", undefined);
  }

  async calculateImpulseResponseForPair(sourceId: string, receiverId: string, paths: RayPath[], initialSPL = DEFAULT_INITIAL_SPL, frequencies = this.frequencies, sampleRate = audioEngine.sampleRate): Promise<{ signal: Float32Array; normalizedSignal: Float32Array }> {
    return calcIRForPairFn(sourceId, receiverId, paths, initialSPL, frequencies, this.temperature, sampleRate);
  }

  async calculateImpulseResponseForDisplay(initialSPL = DEFAULT_INITIAL_SPL, frequencies = this.frequencies, sampleRate = audioEngine.sampleRate): Promise<{ signal: Float32Array; normalizedSignal: Float32Array }> {
    return calcIRForDisplayFn(this.receiverIDs, this.sourceIDs, this.paths, initialSPL, frequencies, this.temperature, sampleRate);
  }
  clearRays() {
    if (this.room) {
      for (let i = 0; i < this.room.allSurfaces.length; i++) {
        (this.room.allSurfaces[i] as Surface).resetHits();
      }
    }
    this.validRayCount = 0;
    renderer.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
    this.rayBufferGeometry.setDrawRange(0, 1);
    this.rayPositionIndex = 0;
    this.rayPositionIndexDidOverflow = false;
    this.stats.numRaysShot.value = 0;
    this.stats.numValidRayPaths.value = 0;
    messenger.postMessage("STATS_UPDATE", this.stats);
    this.sourceIDs.forEach((x) => {
      (useContainer.getState().containers[x] as Source).numRays = 0;
    });
    this.paths = {} as KVP<RayPath[]>;
    this.mapIntersectableObjects();
    renderer.needsToRender = true;

    // Clear the stored impulse response and update any existing IR results to show empty state
    this.impulseResponse = undefined as unknown as AudioBuffer;
    this.clearImpulseResponseResults();
  }

  clearImpulseResponseResults() {
    const { useResult } = require("../../store/result-store");
    const results = useResult.getState().results;
    // Find any impulse response results from this raytracer and remove them
    Object.keys(results).forEach((key) => {
      const result = results[key];
      if (result.from === this.uuid && result.kind === ResultKind.ImpulseResponse) {
        emit("REMOVE_RESULT", key);
      }
    });
  }

  reflectionLossFunction(room: Room, raypath: RayPath, frequency: number): number {
    return reflectionLossFunctionFn(room, raypath, frequency);
  }

  calculateReflectionLoss(frequencies: number[] = this.frequencies) {
    const [allReceiverData, chartdata] = calculateReflectionLossFn(this.paths, this.room, this.receiverIDs, frequencies);
    this.allReceiverData = allReceiverData;
    this.chartdata = chartdata;
    return [this.allReceiverData, chartdata];
  }
  getReceiverIntersectionPoints(id: string) {
    if (this.paths && this.paths[id] && this.paths[id].length > 0) {
      return this.paths[id].map((x) =>
        new THREE.Vector3().fromArray(x.chain[x.chain.length - 1].point)
      ) as THREE.Vector3[];
    } else return [] as THREE.Vector3[];
  }
  calculateResponseByIntensity(freqs: number[] = this.frequencies, temperature: number = this.temperature) {
    const result = calcResponseByIntensityFn(this.indexedPaths, this.receiverIDs, this.sourceIDs, freqs, temperature, this.intensitySampleRate);
    if (result) {
      this.responseByIntensity = result;
    }
    return this.responseByIntensity;
  }

  resampleResponseByIntensity(sampleRate: number = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      const result = resampleResponseByIntensityFn(this.responseByIntensity, sampleRate);
      if (result) this.responseByIntensity = result;
      return this.responseByIntensity;
    } else {
      console.warn("no data yet");
    }
  }

  calculateT30(receiverId?: string, sourceId?: string) {
    if (this.responseByIntensity) {
      const recIds = receiverId ? [receiverId] : this.receiverIDs;
      const srcIds = sourceId ? [sourceId] : this.sourceIDs;
      for (const rec of recIds) {
        for (const src of srcIds) {
          if (this.responseByIntensity[rec]?.[src]) {
            calculateT30Fn(this.responseByIntensity, rec, src);
          }
        }
      }
    }
    return this.responseByIntensity;
  }
  calculateT20(receiverId?: string, sourceId?: string) {
    if (this.responseByIntensity) {
      const recIds = receiverId ? [receiverId] : this.receiverIDs;
      const srcIds = sourceId ? [sourceId] : this.sourceIDs;
      for (const rec of recIds) {
        for (const src of srcIds) {
          if (this.responseByIntensity[rec]?.[src]) {
            calculateT20Fn(this.responseByIntensity, rec, src);
          }
        }
      }
    }
    return this.responseByIntensity;
  }
  calculateT60(receiverId?: string, sourceId?: string) {
    if (this.responseByIntensity) {
      const recIds = receiverId ? [receiverId] : this.receiverIDs;
      const srcIds = sourceId ? [sourceId] : this.sourceIDs;
      for (const rec of recIds) {
        for (const src of srcIds) {
          if (this.responseByIntensity[rec]?.[src]) {
            calculateT60Fn(this.responseByIntensity, rec, src);
          }
        }
      }
    }
    return this.responseByIntensity;
  }

  onParameterConfigFocus() {
    console.log("focus");
    console.log(renderer.overlays.global.cells);
    renderer.overlays.global.showCell(this.uuid + "-valid-ray-count");
  }
  onParameterConfigBlur() {
    console.log("blur");
    renderer.overlays.global.hideCell(this.uuid + "-valid-ray-count");
  }

  pathsToLinearBuffer() {
    return pathsToLinearBufferFn(this.paths);
  }

  linearBufferToPaths(linearBuffer: Float32Array) {
    return linearBufferToPathsFn(linearBuffer);
  }

  arrivalPressure(initialSPL: number[], freqs: number[], path: RayPath, receiverGain: number = 1.0): number[] {
    return arrivalPressureFn(initialSPL, freqs, path, receiverGain, this.temperature);
  }
  async calculateImpulseResponse(initialSPL = DEFAULT_INITIAL_SPL, frequencies = this.frequencies, sampleRate = audioEngine.sampleRate): Promise<AudioBuffer> {
    if(this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if(this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if(!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");

    let sorted = this.paths[this.receiverIDs[0]].sort((a,b)=>a.time - b.time) as RayPath[];

    const totalTime = sorted[sorted.length - 1].time + RESPONSE_TIME_PADDING;

    const spls = Array(frequencies.length).fill(initialSPL);

    // doubled the number of samples to mitigate the signal reversing
    const numberOfSamples = floor(sampleRate * totalTime) * 2;

    let samples: Array<Float32Array> = []; 
    for(let f = 0; f<frequencies.length; f++){
      samples.push(new Float32Array(numberOfSamples));
    }

    if(this.hybrid){
      console.log("Hybrid Calculation...");

      // remove raytracer paths under transition order
      for(let i=0; i<sorted.length; i++){
        if(sorted[i].chainLength-1 <= this.transitionOrder){
          sorted.splice(i,1); 
        }
      }

      let isparams: ImageSourceSolverParams = {name: "HybridHelperIS",
        roomID: this.roomID,
        sourceIDs: this.sourceIDs,
        surfaceIDs: this.surfaceIDs,
        receiverIDs: this.receiverIDs,
        maxReflectionOrder: this.transitionOrder,
        imageSourcesVisible: false,
        rayPathsVisible: false,
        plotOrders: [0, 1, 2], // all paths
        frequencies: this.frequencies,
        temperature: this.temperature,
      };

      let image_source_solver = new ImageSourceSolver(isparams, true);
      let is_raypaths = image_source_solver.returnSortedPathsForHybrid(this.c,spls,frequencies);

      // add in hybrid paths 
      for(let i = 0; i<is_raypaths.length; i++){
        const randomPhase = coinFlip() ? 1 : -1;
        const t = is_raypaths[i].time; 
        const roundedSample = floor(t * sampleRate);
  
        for(let f = 0; f<frequencies.length; f++){
            samples[f][roundedSample] += is_raypaths[i].pressure[f]*randomPhase;
        }
      }
    }
  
    // add in raytracer paths (apply receiver directivity)
    const recForIR = useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
    for(let i = 0; i<sorted.length; i++){
      const randomPhase = coinFlip() ? 1 : -1;
      const t = sorted[i].time;
      const dir = sorted[i].arrivalDirection || [0, 0, 1] as [number, number, number];
      const recGain = recForIR.getGain(dir as [number, number, number]);
      const p = this.arrivalPressure(spls, frequencies, sorted[i], recGain).map(x => x * randomPhase);
      const roundedSample = floor(t * sampleRate);

      for(let f = 0; f<frequencies.length; f++){
          samples[f][roundedSample] += p[f];
      }
    }

    const worker = FilterWorker();

    return new Promise((resolve, reject)=>{

      worker.postMessage({ samples });
      worker.onmessage = (event) => {
        const filteredSamples = event.data.samples as Float32Array[];

        // make the new signal's length half as long, we dont need the reversed part
        const signal = new Float32Array(filteredSamples[0].length >> 1);

        let max = 0;
        for(let i = 0; i<filteredSamples.length; i++){
          for(let j = 0; j<signal.length; j++){
            signal[j] += filteredSamples[i][j];
            if(abs(signal[j])>max){
              max = abs(signal[j]);
            }
          }
        }

        const normalizedSignal = normalize(signal);

        const offlineContext = audioEngine.createOfflineContext(1, signal.length, sampleRate);

        const source = audioEngine.createBufferSource(normalizedSignal, offlineContext);

        source.connect(offlineContext.destination);
        source.start();


        audioEngine.renderContextAsync(offlineContext).then(impulseResponse=>resolve(impulseResponse)).catch(reject).finally(()=>worker.terminate());
      };

    })

  }

  /**
   * Calculate an ambisonic impulse response from the traced ray paths.
   * Each reflection is encoded based on its arrival direction at the receiver.
   *
   * @param order - Ambisonic order (1 = first order with 4 channels, 2 = 9 channels, etc.)
   * @param initialSPL - Initial sound pressure level in dB
   * @param frequencies - Octave band center frequencies for filtering
   * @param sampleRate - Sample rate for the output
   * @returns Promise resolving to an AudioBuffer with ambisonic channels
   */
  async calculateAmbisonicImpulseResponse(
    order: number = 1,
    initialSPL = DEFAULT_INITIAL_SPL,
    frequencies = this.frequencies,
    sampleRate = audioEngine.sampleRate
  ): Promise<AudioBuffer> {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");

    const sorted = this.paths[this.receiverIDs[0]].sort((a, b) => a.time - b.time) as RayPath[];
    if (sorted.length === 0) throw Error("No valid ray paths found");

    const totalTime = sorted[sorted.length - 1].time + RESPONSE_TIME_PADDING;
    if (totalTime <= 0) throw Error("Invalid impulse response duration");
    const spls = Array(frequencies.length).fill(initialSPL);

    // Doubled samples to mitigate signal reversing (same as mono version)
    const numberOfSamples = floor(sampleRate * totalTime) * 2;
    if (numberOfSamples < 2) throw Error("Impulse response too short to process");
    const nCh = getAmbisonicChannelCount(order);

    // Create per-frequency, per-channel sample buffers
    // Structure: samples[frequency][ambiChannel]
    const samples: Float32Array[][] = [];
    for (let f = 0; f < frequencies.length; f++) {
      samples.push([]);
      for (let ch = 0; ch < nCh; ch++) {
        samples[f].push(new Float32Array(numberOfSamples));
      }
    }

    // Process each ray path (apply receiver directivity)
    const recForAmbi = useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
    for (let i = 0; i < sorted.length; i++) {
      const path = sorted[i];
      const randomPhase = coinFlip() ? 1 : -1;
      const t = path.time;
      const dir = path.arrivalDirection || [0, 0, 1] as [number, number, number];
      const recGain = recForAmbi.getGain(dir as [number, number, number]);
      const p = this.arrivalPressure(spls, frequencies, path, recGain).map(x => x * randomPhase);
      const roundedSample = floor(t * sampleRate);

      if (roundedSample >= numberOfSamples) continue;

      // Create a single-sample impulse for this reflection
      const impulse = new Float32Array(1);

      // Encode each frequency band
      for (let f = 0; f < frequencies.length; f++) {
        impulse[0] = p[f];

        // Encode the impulse at this direction (using Three.js coordinate system)
        const encoded = encodeBufferFromDirection(impulse, dir[0], dir[1], dir[2], order, 'threejs');

        // Add to the output buffers
        for (let ch = 0; ch < nCh; ch++) {
          samples[f][ch][roundedSample] += encoded[ch][0];
        }
      }
    }

    // Use filter worker to apply octave-band filtering (same as mono version)
    const worker = FilterWorker();

    return new Promise((resolve, reject) => {
      // Process each ambisonic channel through the filter bank
      const processChannel = async (chIndex: number): Promise<Float32Array> => {
        return new Promise((resolveChannel) => {
          // Extract the per-frequency samples for this channel
          const channelFreqSamples: Float32Array[] = [];
          for (let f = 0; f < frequencies.length; f++) {
            channelFreqSamples.push(samples[f][chIndex]);
          }

          const channelWorker = FilterWorker();
          channelWorker.postMessage({ samples: channelFreqSamples });
          channelWorker.onmessage = (event) => {
            const filteredSamples = event.data.samples as Float32Array[];

            // Sum filtered bands and take first half (remove reversed portion)
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
            if (abs(signal[j]) > max) {
              max = abs(signal[j]);
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
          worker.terminate();
          reject(new Error("Filtered signal has zero length"));
          return;
        }
        const offlineContext = audioEngine.createOfflineContext(nCh, signalLength, sampleRate);
        const buffer = offlineContext.createBuffer(nCh, signalLength, sampleRate);

        for (let ch = 0; ch < nCh; ch++) {
          buffer.copyToChannel(new Float32Array(channelSignals[ch]), ch);
        }

        worker.terminate();
        resolve(buffer);
      }).catch(reject);
    });
  }

  ambisonicImpulseResponse?: AudioBuffer;
  ambisonicOrder: number = 1;

  impulseResponse!: AudioBuffer;
  impulseResponsePlaying = false;

  async playImpulseResponse(){
    const result = await playImpulseResponseFn(
      this.impulseResponse, () => this.calculateImpulseResponse(), this.uuid
    );
    this.impulseResponse = result.impulseResponse;
  }
  downloadImpulses(filename: string, initialSPL = DEFAULT_INITIAL_SPL, frequencies = ac.Octave(125, 8000), sampleRate = 44100){
    downloadImpulsesFn(
      this.paths, this.receiverIDs, this.sourceIDs,
      (spls, freqs, path, recGain) => this.arrivalPressure(spls, freqs, path, recGain),
      filename, initialSPL, frequencies, sampleRate
    );
  }
  async downloadImpulseResponse(filename: string, sampleRate = audioEngine.sampleRate){
    const result = await downloadImpulseResponseFn(
      this.impulseResponse, () => this.calculateImpulseResponse(), filename, sampleRate
    );
    this.impulseResponse = result.impulseResponse;
  }

  async downloadAmbisonicImpulseResponse(
    filename: string,
    order: number = 1
  ) {
    const result = await downloadAmbisonicIRFn(
      this.ambisonicImpulseResponse,
      (o: number) => this.calculateAmbisonicImpulseResponse(o),
      this.ambisonicOrder, order, filename
    );
    this.ambisonicImpulseResponse = result.ambisonicImpulseResponse;
    this.ambisonicOrder = result.ambisonicOrder;
  }

  get sources() {
    if (this.sourceIDs.length > 0) {
      return this.sourceIDs.map((x) => useContainer.getState().containers[x]);
    } else {
      return [];
    }
  }
  get receivers() {
    if (this.receiverIDs.length > 0 && Object.keys(useContainer.getState().containers).length > 0) {
      return this.receiverIDs.map((x) => (useContainer.getState().containers[x] as Receiver).mesh) as THREE.Mesh[];
    } else return [];
  }
  get room(): Room {
    return useContainer.getState().containers[this.roomID] as Room;
  }
  get precheck() {
    return this.sourceIDs.length > 0 && typeof this.room !== "undefined";
  }
  get indexedPaths() {
    const paths = {} as KVP<KVP<RayPath[]>>;
    for (const receiverKey in this.paths) {
      paths[receiverKey] = {} as KVP<RayPath[]>;
      for (let i = 0; i < this.paths[receiverKey].length; i++) {
        const sourceKey = this.paths[receiverKey][i].source;
        if (!paths[receiverKey][sourceKey]) {
          paths[receiverKey][sourceKey] = [this.paths[receiverKey][i]] as RayPath[];
        } else {
          paths[receiverKey][sourceKey].push(this.paths[receiverKey][i]);
        }
      }
    }
    return paths;
  }
  get isRunning() {
    return this.running;
  }
  set isRunning(isRunning: boolean) {
    this.running = this.precheck && isRunning;
    if (this.running) {
      this.start();
    } else {
      this.stop();
    }
  }
  get raysVisible() {
    return this._raysVisible;
  }
  set raysVisible(visible: boolean) {
    if (visible != this._raysVisible) {
      this._raysVisible = visible;
      this.rays.visible = visible;
    }
    renderer.needsToRender = true;
  }
  get pointsVisible() {
    return this._pointsVisible;
  }
  set pointsVisible(visible: boolean) {
    if (visible != this._pointsVisible) {
      this._pointsVisible = visible;
      this.hits.visible = visible;
    }
    renderer.needsToRender = true;
  }
  get invertedDrawStyle() {
    return this._invertedDrawStyle;
  }
  set invertedDrawStyle(inverted: boolean) {
    if (this._invertedDrawStyle != inverted) {
      this._invertedDrawStyle = inverted;
      (this.hits.material as THREE.ShaderMaterial).uniforms["inverted"].value = Number(inverted);
      (this.hits.material as THREE.ShaderMaterial).needsUpdate = true;
    }
    renderer.needsToRender = true;
  }
  get pointSize() {
    return this._pointSize;
  }
  set pointSize(size: number) {
    if (Number.isFinite(size) && size > 0) {
      this._pointSize = size;
      (this.hits.material as THREE.ShaderMaterial).uniforms["pointScale"].value = this._pointSize;
      (this.hits.material as THREE.ShaderMaterial).needsUpdate = true;
    }
    renderer.needsToRender = true;
  }
  get runningWithoutReceivers() {
    return this._runningWithoutReceivers;
  }
  set runningWithoutReceivers(runningWithoutReceivers: boolean) {
    this.mapIntersectableObjects();
    this._runningWithoutReceivers = runningWithoutReceivers;
  }
}





export default RayTracer;



// this allows for nice type checking with 'on' and 'emit' from messenger
declare global {
  interface EventTypes {
    ADD_RAYTRACER: RayTracer | undefined,
    REMOVE_RAYTRACER: string;
    RAYTRACER_CLEAR_RAYS: string;
    RAYTRACER_SET_PROPERTY: SetPropertyPayload<RayTracer>
    RAYTRACER_PLAY_IR: string;
    RAYTRACER_DOWNLOAD_IR: string;
    RAYTRACER_DOWNLOAD_IR_OCTAVE: string;
    RAYTRACER_DOWNLOAD_AMBISONIC_IR: { uuid: string; order: number };
    RAYTRACER_CALL_METHOD: CallSolverMethod<RayTracer>;
  }
}

on("RAYTRACER_CALL_METHOD", callSolverMethod as any);
on("RAYTRACER_SET_PROPERTY", setSolverProperty);
on("REMOVE_RAYTRACER", removeSolver);
on("ADD_RAYTRACER", addSolver(RayTracer))
on("RAYTRACER_CLEAR_RAYS", (uuid: string) => void (useSolver.getState().solvers[uuid] as RayTracer).clearRays());
on("RAYTRACER_PLAY_IR", (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as RayTracer;
  solver.playImpulseResponse().catch((err: Error) => {
    window.alert(err.message || "Failed to play impulse response");
  });
});
on("RAYTRACER_DOWNLOAD_IR", (uuid: string) => {
  const solver = useSolver.getState().solvers[uuid] as RayTracer;
  const containers = useContainer.getState().containers;
  const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || 'source' : 'source';
  const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || 'receiver' : 'receiver';
  const filename = `ir-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, '_');
  solver.downloadImpulseResponse(filename).catch((err: Error) => {
    window.alert(err.message || "Failed to download impulse response");
  });
});
on("RAYTRACER_DOWNLOAD_IR_OCTAVE", (uuid: string) => void (useSolver.getState().solvers[uuid] as RayTracer).downloadImpulses(uuid));
on("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid, order }: { uuid: string; order: number }) => {
  const solver = useSolver.getState().solvers[uuid] as RayTracer;
  const containers = useContainer.getState().containers;
  const sourceName = solver.sourceIDs.length > 0 ? containers[solver.sourceIDs[0]]?.name || 'source' : 'source';
  const receiverName = solver.receiverIDs.length > 0 ? containers[solver.receiverIDs[0]]?.name || 'receiver' : 'receiver';
  const filename = `ir-${sourceName}-${receiverName}`.replace(/[^a-zA-Z0-9-_]/g, '_');
  solver.downloadAmbisonicImpulseResponse(filename, order).catch((err: Error) => {
    window.alert(err.message || "Failed to download ambisonic impulse response");
  });
});


