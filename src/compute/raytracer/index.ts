// @ts-nocheck
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

import FileSaver from "file-saver";
import Plotly, { PlotData } from "plotly.js";

import PointShader from "./shaders/points";
import * as ac from "../acoustics";
import { lerp } from "../../common/lerp";
import { movingAverage } from "../../common/moving-average";
import linearRegression, { LinearRegressionResult } from "../../common/linear-regression";
import { BVH } from "./bvh/BVH";
import { renderer } from "../../render/renderer";
import { addSolver, callSolverMethod, removeSolver, setSolverProperty, useContainer, useSolver } from "../../store";
import { ResultKind } from "../../store/result-store";
import {cramangle2threejsangle} from "../../common/dir-angle-conversions";
import { audioEngine } from "../../audio-engine/audio-engine";
import observe, { Observable } from "../../common/observable";
import {probability} from '../../common/probability';
import { encodeBufferFromDirection, getAmbisonicChannelCount } from "ambisonics";

import {ImageSourceSolver, ImageSourceSolverParams} from "./image-source/index";

import {
  QuickEstimateStepResult, RayPathResult, ResponseByIntensity, BandEnergy, Chain,
  RayPath, EnergyTime, ChartData, ReceiverData, RayTracerSaveObject, RayTracerParams,
  ConvergenceMetrics, defaults, DRAWSTYLE, DrawStyle, normalize,
  SELF_INTERSECTION_OFFSET, DEFAULT_INTENSITY_SAMPLE_RATE, DEFAULT_INITIAL_SPL,
  RESPONSE_TIME_PADDING, QUICK_ESTIMATE_MAX_ORDER, MAX_DISPLAY_POINTS, RT60_DECAY_RATIO,
  HISTOGRAM_BIN_WIDTH, HISTOGRAM_NUM_BINS, CONVERGENCE_CHECK_INTERVAL_MS,
} from "./types";

// Re-export all types for external consumers
export {
  QuickEstimateStepResult, RayPathResult, ResponseByIntensity, BandEnergy, Chain,
  RayPath, EnergyTime, ChartData, ReceiverData, RayTracerSaveObject, RayTracerParams,
  ConvergenceMetrics, defaults, DRAWSTYLE, DrawStyle, normalize,
  SELF_INTERSECTION_OFFSET, DEFAULT_INTENSITY_SAMPLE_RATE, DEFAULT_INITIAL_SPL,
  RESPONSE_TIME_PADDING, QUICK_ESTIMATE_MAX_ORDER, MAX_DISPLAY_POINTS, RT60_DECAY_RATIO,
  HISTOGRAM_BIN_WIDTH, HISTOGRAM_NUM_BINS, CONVERGENCE_CHECK_INTERVAL_MS,
} from "./types";

// Webpack 5 native worker support
const FilterWorker = () => new Worker(new URL('../../audio-engine/filter.worker.ts', import.meta.url));

const {floor, random, abs, asin} = Math;
const coinFlip = () => random() > 0.5;

//@ts-ignore
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
//@ts-ignore
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
      formatter: (value: number) => String(value)
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
        const id = args[0];
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

    // update three.js
    this.rayBufferAttribute.needsUpdate = true;

    //update version
    this.rayBufferAttribute.version++;

    // update three.js
    this.colorBufferAttribute.needsUpdate = true;

    //update version
    this.colorBufferAttribute.version++;
  }

  inFrontOf(a: THREE.Triangle, b: THREE.Triangle) {
    const plane = a.getPlane(new THREE.Plane());
    const pleq = new THREE.Vector4(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant);
    const avec4 = new THREE.Vector4(b.a.x, b.a.y, b.a.z, 1);
    const bvec4 = new THREE.Vector4(b.b.x, b.b.y, b.b.z, 1);
    const cvec4 = new THREE.Vector4(b.c.x, b.c.y, b.c.z, 1);
    return pleq.dot(avec4) > 0 || pleq.dot(bvec4) > 0 || pleq.dot(cvec4) > 0;
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
    // normalize the ray
    rd = rd.normalize();

    // set the starting position
    this.raycaster.ray.origin = ro;

    // set the direction
    this.raycaster.ray.direction = rd;

    // find the surface that the ray intersects
    const intersections = this.raycaster.intersectObjects(this.intersectableObjects, true);

    // if there was an intersection
    if (intersections.length > 0) {

      // broadband average energy for scalar backward compat
      const totalEnergy = bandEnergy.reduce((a, b) => a + b, 0);
      const energy = bandEnergy.length > 0 ? totalEnergy / bandEnergy.length : 0;

      //check to see if the intersection was with a receiver
      if (intersections[0].object.userData?.kind === 'receiver') {
        // find the incident angle
        const angle = intersections[0].face && rd.clone().multiplyScalar(-1).angleTo(intersections[0].face.normal);

        // apply air absorption for the final segment to the receiver
        const receiverSegmentDist = intersections[0].distance;
        const receiverBandEnergy = bandEnergy.map((e, f) =>
          e * Math.pow(10, -this._cachedAirAtt[f] * receiverSegmentDist / 10)
        );

        // broadband average energy for scalar backward compat (recompute after air absorption)
        const receiverTotalEnergy = receiverBandEnergy.reduce((a, b) => a + b, 0);
        const receiverEnergy = receiverBandEnergy.length > 0 ? receiverTotalEnergy / receiverBandEnergy.length : 0;

        // push the intersection data onto the chain
        chain.push({
          object: intersections[0].object.parent!.uuid,
          angle: angle!,
          distance: intersections[0].distance,
          faceNormal: [
            intersections[0].face!.normal.x,
            intersections[0].face!.normal.y,
            intersections[0].face!.normal.z
          ],
          faceMaterialIndex: intersections[0].face!.materialIndex,
          faceIndex: intersections[0].faceIndex!,
          point: [intersections[0].point.x, intersections[0].point.y, intersections[0].point.z],
          energy: receiverEnergy,
          bandEnergy: [...receiverBandEnergy],
        });

        // Compute arrival direction (direction ray arrives FROM, normalized)
        // This is the opposite of the ray direction (ray travels toward receiver)
        const arrivalDir = rd.clone().normalize().negate();
        const arrivalDirection: [number, number, number] = [arrivalDir.x, arrivalDir.y, arrivalDir.z];

        // end the chain here
        return {
          chain,
          chainLength: chain.length,
          intersectedReceiver: true,
          energy: receiverEnergy,
          bandEnergy: [...receiverBandEnergy],
          source,
          initialPhi,
          initialTheta,
          arrivalDirection,
        } as RayPath;
      } else {
        // find the incident angle
        const angle = intersections[0].face && rd.clone().multiplyScalar(-1).angleTo(intersections[0].face.normal);

        // push the intersection onto the chain
        chain.push({
          object: intersections[0].object.parent!.uuid,
          angle: angle!,
          distance: intersections[0].distance,
          faceNormal: [
            intersections[0].face!.normal.x,
            intersections[0].face!.normal.y,
            intersections[0].face!.normal.z
          ],
          faceMaterialIndex: intersections[0].face!.materialIndex,
          faceIndex: intersections[0].faceIndex!,
          point: [intersections[0].point.x, intersections[0].point.y, intersections[0].point.z],
          energy,
        });

        if (intersections[0].object.parent instanceof Surface) {
          intersections[0].object.parent.numHits += 1;
        }

        // get the normal direction of the intersection
        const normal = intersections[0].face && intersections[0].face.normal.normalize();

        // find the reflected direction
        let rr =
          normal &&
          intersections[0].face &&
          rd.clone().sub(normal.clone().multiplyScalar(rd.dot(normal.clone())).multiplyScalar(2));

        // compute energy-weighted broadband scattering for directional decision
        const surface = intersections[0].object.parent as Surface;
        const scatterCoeffs = this.frequencies.map(f => surface.scatteringFunction(f));
        const totalEnergy = bandEnergy.reduce((a, b) => a + b, 0) || 1;
        let broadbandScattering = 0;
        for (let f = 0; f < this.frequencies.length; f++) {
          broadbandScattering += scatterCoeffs[f] * (bandEnergy[f] || 0);
        }
        broadbandScattering /= totalEnergy;

        if (probability(broadbandScattering)) {
          // Cosine-weighted (Lambertian) hemisphere sampling via rejection method
          let candidate: THREE.Vector3;
          do {
            candidate = new THREE.Vector3(
              Math.random() * 2 - 1,
              Math.random() * 2 - 1,
              Math.random() * 2 - 1
            );
          } while (candidate.lengthSq() > 1 || candidate.lengthSq() < 1e-6);
          candidate.normalize();
          // Offset along normal for cosine-weighted distribution
          rr = candidate.add(normal!).normalize();
        }

        // apply per-band reflection loss
        const segmentDistance = intersections[0].distance;
        const newBandEnergy = this.frequencies.map((frequency, f) => {
          const e = bandEnergy[f];
          if (e == null) return 0;
          // surface reflection
          let energy = e * abs(surface.reflectionFunction(frequency, angle!));
          // per-segment air absorption (intensity domain: /10)
          energy *= Math.pow(10, -this._cachedAirAtt[f] * segmentDistance / 10);
          return energy;
        });

        // Russian Roulette termination: unbiased probabilistic early termination
        const maxEnergy = Math.max(...newBandEnergy);
        if (rr && normal && iter < order + 1) {
          if (maxEnergy < this.rrThreshold && maxEnergy > 0) {
            const survivalProbability = maxEnergy / this.rrThreshold;
            if (Math.random() > survivalProbability) {
              // Terminate ray - expected value preserved (no bias)
              const rrTotalEnergy = newBandEnergy.reduce((a, b) => a + b, 0);
              const rrEnergy = newBandEnergy.length > 0 ? rrTotalEnergy / newBandEnergy.length : 0;
              return { chain, chainLength: chain.length, source, intersectedReceiver: false, energy: rrEnergy, bandEnergy: [...newBandEnergy] } as RayPath;
            }
            // Boost surviving ray energy to compensate
            for (let f = 0; f < newBandEnergy.length; f++) {
              newBandEnergy[f] /= survivalProbability;
            }
          }
          if (maxEnergy > 0) {
            // recurse
            return this.traceRay(
              intersections[0].point.clone().addScaledVector(normal.clone(), SELF_INTERSECTION_OFFSET),
              rr,
              order,
              newBandEnergy,
              source,
              initialPhi,
              initialTheta,
              iter + 1,
              chain,
            );
          }
        }
      }
      return { chain, chainLength: chain.length, source, intersectedReceiver: false } as RayPath;
    }
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
      //@ts-ignore
      setInterval(() => {
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
    this.intervals.push(
      (setInterval(() => {
        this.stepStratified(this.passes);
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
      }, this.updateInterval) as unknown) as number
    );
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
          refPressures[f] = sourceDH.getPressureAtPosition(0, this.frequencies[f], 0, 0);
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
      this.paths[index] ? this.paths[index].push(path) : (this.paths[index] = [path]);
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
      this.paths[receiverId] ? this.paths[receiverId].push(path) : (this.paths[receiverId] = [path]);
      (useContainer.getState().containers[sourceId] as Source).numRays += 1;

      // Update energy histogram for convergence monitoring
      this._addToEnergyHistogram(receiverId, path);
    }
  }

  /** Add a ray path's energy to the convergence histogram */
  _addToEnergyHistogram(receiverId: string, path: RayPath) {
    if (!this._energyHistogram[receiverId]) {
      this._energyHistogram[receiverId] = [];
      for (let f = 0; f < this.frequencies.length; f++) {
        this._energyHistogram[receiverId].push(new Float32Array(this._histogramNumBins));
      }
    }
    // Compute total time from chain distances
    let totalTime = 0;
    for (let k = 0; k < path.chain.length; k++) {
      totalTime += path.chain[k].distance;
    }
    totalTime /= this.c;
    const bin = Math.floor(totalTime / this._histogramBinWidth);
    if (bin >= 0 && bin < this._histogramNumBins && path.bandEnergy) {
      for (let f = 0; f < this.frequencies.length; f++) {
        this._energyHistogram[receiverId][f][bin] += path.bandEnergy[f] || 0;
      }
    }
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
          refPressures[f] = sourceDH.getPressureAtPosition(0, this.frequencies[f], 0, 0);
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
          this.paths[index] ? this.paths[index].push(path) : (this.paths[index] = [path]);

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
          this.paths[index] ? this.paths[index].push(path) : (this.paths[index] = [path]);

          // increment the sources ray counter
          (useContainer.getState().containers[this.sourceIDs[i]] as Source).numRays += 1;
        }
      }

      (this.stats.numRaysShot.value as number)++;
    }
  }

  /** Reset convergence state for a new simulation run */
  _resetConvergenceState() {
    this.convergenceMetrics = {
      totalRays: 0,
      validRays: 0,
      estimatedT30: new Array(this.frequencies.length).fill(0),
      t30Mean: new Array(this.frequencies.length).fill(0),
      t30M2: new Array(this.frequencies.length).fill(0),
      t30Count: 0,
      convergenceRatio: Infinity,
    };
    this._energyHistogram = {} as KVP<Float32Array[]>;
    this._lastConvergenceCheck = Date.now();
  }

  /** Compute T30 from Schroeder backward integration of the energy histogram */
  _updateConvergenceMetrics() {
    this.convergenceMetrics.totalRays = this.__num_checked_paths;
    this.convergenceMetrics.validRays = this.validRayCount;

    // Choose a stable receiver with data for convergence metrics
    const receiverIdsWithData = Object.keys(this._energyHistogram);
    if (receiverIdsWithData.length === 0) return;

    let receiverId: string | undefined;

    // Prefer stable ordering via this.receiverIDs
    if (this.receiverIDs.length > 0) {
      for (const id of this.receiverIDs) {
        const hist = this._energyHistogram[id];
        if (hist && hist.length > 0) {
          receiverId = id;
          break;
        }
      }
    }

    // Fallback: lexicographically smallest ID with data
    if (!receiverId) {
      const sortedIds = receiverIdsWithData.slice().sort();
      for (const id of sortedIds) {
        const hist = this._energyHistogram[id];
        if (hist && hist.length > 0) {
          receiverId = id;
          break;
        }
      }
    }

    if (!receiverId) return;

    const histograms = this._energyHistogram[receiverId];
    if (!histograms || histograms.length === 0) return;

    const numBands = this.frequencies.length;
    const t30Estimates = new Array(numBands).fill(0);

    for (let f = 0; f < numBands; f++) {
      const histogram = histograms[f];

      // Find last non-zero bin
      let lastBin = 0;
      for (let b = this._histogramNumBins - 1; b >= 0; b--) {
        if (histogram[b] > 0) { lastBin = b; break; }
      }
      if (lastBin < 2) { t30Estimates[f] = 0; continue; }

      // Schroeder backward integration
      const schroeder = new Float32Array(lastBin + 1);
      schroeder[lastBin] = histogram[lastBin];
      for (let b = lastBin - 1; b >= 0; b--) {
        schroeder[b] = schroeder[b + 1] + histogram[b];
      }

      // Convert to dB (relative to max)
      const maxVal = schroeder[0];
      if (maxVal <= 0) { t30Estimates[f] = 0; continue; }

      // Find -5dB and -35dB points for T30 estimation
      const db5 = maxVal * Math.pow(10, -5 / 10);
      const db35 = maxVal * Math.pow(10, -35 / 10);
      let idx5 = -1, idx35 = -1;

      for (let b = 0; b <= lastBin; b++) {
        if (idx5 < 0 && schroeder[b] <= db5) idx5 = b;
        if (idx35 < 0 && schroeder[b] <= db35) idx35 = b;
      }

      if (idx5 >= 0 && idx35 > idx5) {
        // Linear regression in log domain between -5dB and -35dB
        const times: number[] = [];
        const levelsDb: number[] = [];

        for (let b = idx5; b <= idx35; b++) {
          const value = schroeder[b];
          if (value > 0) {
            times.push(b * this._histogramBinWidth);
            levelsDb.push(10 * Math.log10(value / maxVal));
          }
        }

        if (times.length >= 2) {
          const regression = linearRegression(times, levelsDb);
          const slope = regression.slope;
          // T60: time for 60 dB decay, extrapolated from decay slope in dB/s
          t30Estimates[f] = slope < 0 ? 60 / -slope : 0;
        }
      }
    }

    this.convergenceMetrics.estimatedT30 = t30Estimates;

    // Welford's online algorithm for running mean and variance
    this.convergenceMetrics.t30Count += 1;
    const n = this.convergenceMetrics.t30Count;

    let maxRatio = 0;
    let validBandCount = 0;
    for (let f = 0; f < numBands; f++) {
      const val = t30Estimates[f];
      const oldMean = this.convergenceMetrics.t30Mean[f];
      const newMean = oldMean + (val - oldMean) / n;
      const oldM2 = this.convergenceMetrics.t30M2[f];
      const newM2 = oldM2 + (val - oldMean) * (val - newMean);
      this.convergenceMetrics.t30Mean[f] = newMean;
      this.convergenceMetrics.t30M2[f] = newM2;

      // Coefficient of variation: std / mean (skip bands with no valid T30)
      if (n >= 2 && newMean > 0) {
        const variance = newM2 / (n - 1);
        const ratio = Math.sqrt(variance) / newMean;
        if (ratio > maxRatio) maxRatio = ratio;
        validBandCount++;
      }
      // Bands with zero/invalid T30 are excluded from convergence check
    }
    // Only report convergence if at least one band has a valid estimate
    this.convergenceMetrics.convergenceRatio = validBandCount > 0 ? maxRatio : Infinity;

    // Emit update so UI can display metrics
    emit("RAYTRACER_SET_PROPERTY", {
      uuid: this.uuid,
      property: "convergenceMetrics",
      value: { ...this.convergenceMetrics }
    });
  }

  start() {
    this._cachedAirAtt = ac.airAttenuation(this.frequencies, this._temperature);
    this.mapIntersectableObjects();
    this.__start_time = Date.now();
    this.__num_checked_paths = 0;
    this._resetConvergenceState();
    this.startAllMonteCarlo();
  }

  stop() {
    this.__calc_time = Date.now() - this.__start_time;
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
    this.mapIntersectableObjects();
    this.reportImpulseResponse();
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
    if (paths.length === 0) throw Error("No rays have been traced for this pair");

    let sorted = paths.sort((a, b) => a.time - b.time) as RayPath[];

    const totalTime = sorted[sorted.length - 1].time + RESPONSE_TIME_PADDING;

    const spls = Array(frequencies.length).fill(initialSPL);

    const numberOfSamples = floor(sampleRate * totalTime) * 2;

    let samples: Array<Float32Array> = [];
    for (let f = 0; f < frequencies.length; f++) {
      samples.push(new Float32Array(numberOfSamples));
    }

    // add in raytracer paths (apply receiver directivity)
    const recForPair = useContainer.getState().containers[receiverId] as Receiver;
    for (let i = 0; i < sorted.length; i++) {
      const randomPhase = coinFlip() ? 1 : -1;
      const t = sorted[i].time;
      const dir = sorted[i].arrivalDirection || [0, 0, 1] as [number, number, number];
      const recGain = recForPair.getGain(dir as [number, number, number]);
      const p = this.arrivalPressure(spls, frequencies, sorted[i], recGain).map(x => x * randomPhase);
      const roundedSample = floor(t * sampleRate);

      for (let f = 0; f < frequencies.length; f++) {
        samples[f][roundedSample] += p[f];
      }
    }

    const worker = FilterWorker();

    return new Promise((resolve, reject) => {
      worker.postMessage({ samples });
      worker.onmessage = (event) => {
        const filteredSamples = event.data.samples as Float32Array[];

        const signal = new Float32Array(filteredSamples[0].length >> 1);

        for (let i = 0; i < filteredSamples.length; i++) {
          for (let j = 0; j < signal.length; j++) {
            signal[j] += filteredSamples[i][j];
          }
        }

        const normalizedSignal = normalize(signal.slice());

        worker.terminate();
        resolve({ signal, normalizedSignal });
      };
      worker.onerror = (error) => {
        worker.terminate();
        reject(error);
      };
    });
  }

  async calculateImpulseResponseForDisplay(initialSPL = DEFAULT_INITIAL_SPL, frequencies = this.frequencies, sampleRate = audioEngine.sampleRate): Promise<{ signal: Float32Array; normalizedSignal: Float32Array }> {
    if(this.receiverIDs.length == 0) throw Error("No receivers have been assigned to the raytracer");
    if(this.sourceIDs.length == 0) throw Error("No sources have been assigned to the raytracer");
    if(this.paths[this.receiverIDs[0]].length == 0) throw Error("No rays have been traced yet");

    let sorted = this.paths[this.receiverIDs[0]].sort((a,b)=>a.time - b.time) as RayPath[];

    const totalTime = sorted[sorted.length - 1].time + RESPONSE_TIME_PADDING;

    const spls = Array(frequencies.length).fill(initialSPL);

    const numberOfSamples = floor(sampleRate * totalTime) * 2;

    let samples: Array<Float32Array> = [];
    for(let f = 0; f<frequencies.length; f++){
      samples.push(new Float32Array(numberOfSamples));
    }

    // add in raytracer paths (apply receiver directivity)
    const recForDisplay = useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
    for(let i = 0; i<sorted.length; i++){
      const randomPhase = coinFlip() ? 1 : -1;
      const t = sorted[i].time;
      const dir = sorted[i].arrivalDirection || [0, 0, 1] as [number, number, number];
      const recGain = recForDisplay.getGain(dir as [number, number, number]);
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

        const signal = new Float32Array(filteredSamples[0].length >> 1);

        for(let i = 0; i<filteredSamples.length; i++){
          for(let j = 0; j<signal.length; j++){
            signal[j] += filteredSamples[i][j];
          }
        }

        const normalizedSignal = normalize(signal.slice());

        worker.terminate();
        resolve({ signal, normalizedSignal });
      };
      worker.onerror = (error) => {
        worker.terminate();
        reject(error);
      };
    });
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
    const chain = raypath.chain.slice(0, -1);
    if (chain && chain.length > 0) {
      let magnitude = 1;
      for (let k = 0; k < chain.length; k++) {
        const intersection = chain[k];
        const surface = room.surfaceMap[intersection.object] as Surface;
        const angle = intersection["angle"] || 0;
        magnitude = magnitude * abs(surface.reflectionFunction(frequency, angle));
      }
      return magnitude;
    }
    return 1;
  }

  //TODO change this name to something more appropriate
  calculateReflectionLoss(frequencies: number[] = this.frequencies) {
    // reset the receiver data
    this.allReceiverData = [] as ReceiverData[];

    // helper function
    const dataset = (label, data) => ({ label, data });

    // for the chart
    const chartdata = [] as ChartData[];
    if (frequencies) {
      for (let i = 0; i < frequencies.length; i++) {
        chartdata.push(dataset(frequencies[i].toString(), []));
      }
    }

    // pathkeys.length should equal the number of receivers in the scene
    const pathkeys = Object.keys(this.paths);

    // for each receiver's path in the total path array
    for (let i = 0; i < pathkeys.length; i++) {
      // init contribution array
      this.allReceiverData.push({
        id: pathkeys[i],
        data: [] as EnergyTime[]
      });

      // for each path's chain of intersections
      for (let j = 0; j < this.paths[pathkeys[i]].length; j++) {
        // the individual ray path which holds intersection data
        const raypath = this.paths[pathkeys[i]][j];

        let refloss;
        // if there was a given frequency array
        if (frequencies) {
          // map the frequencies to reflection loss
          refloss = frequencies.map((freq) => ({
            frequency: freq,
            value: this.reflectionLossFunction(this.room, raypath, freq)
          }));
          frequencies.forEach((f, i) => {
            chartdata[i].data.push([raypath.time!, this.reflectionLossFunction(this.room, raypath, f)]);
          });
        } else {
          // if no frequencies given, just give back the function that calculates the reflection loss
          refloss = (freq: number) => this.reflectionLossFunction(this.room, raypath, freq);
        }
        this.allReceiverData[this.allReceiverData.length - 1].data.push({
          time: raypath.time!,
          energy: refloss
        });
      }
      this.allReceiverData[this.allReceiverData.length - 1].data = this.allReceiverData[
        this.allReceiverData.length - 1
      ].data.sort((a, b) => a.time - b.time);
    }
    for (let i = 0; i < chartdata.length; i++) {
      chartdata[i].data = chartdata[i].data.sort((a, b) => a[0] - b[0]);
      chartdata[i].x = chartdata[i].data.map((x) => x[0]);
      chartdata[i].y = chartdata[i].data.map((x) => x[1]);
    }
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
    const paths = this.indexedPaths;

    // sound speed in m/s
    const soundSpeed = ac.soundSpeed(temperature);

    // attenuation in dB/m
    const airAttenuationdB = ac.airAttenuation(freqs, temperature);

    this.responseByIntensity = {} as KVP<KVP<ResponseByIntensity>>;

    // for each receiver
    for (const receiverKey in paths) {
      this.responseByIntensity[receiverKey] = {} as KVP<ResponseByIntensity>;
      const recForIntensity = useContainer.getState().containers[receiverKey] as Receiver;

      // for each source
      for (const sourceKey in paths[receiverKey]) {
        this.responseByIntensity[receiverKey][sourceKey] = {
          freqs,
          response: [] as RayPathResult[]
        };

        // source total intensity
        const Itotal = ac.P2I(ac.Lp2P((useContainer.getState().containers[sourceKey] as Source).initialSPL)) as number;

        // for each path
        for (let i = 0; i < paths[receiverKey][sourceKey].length; i++) {

          // propogagtion time
          let time = 0;

          // ray initial intensity
          // const Iray = Itotal / (useContainer.getState().containers[sourceKey] as Source).numRays;

          // initial intensity at each frequency
          let IrayArray: number[] = [];
          let phi = paths[receiverKey][sourceKey][i].initialPhi;
          let theta = paths[receiverKey][sourceKey][i].initialTheta;

          let srcDirectivityHandler = (useContainer.getState().containers[sourceKey] as Source).directivityHandler;

          for(let findex = 0; findex<freqs.length; findex++){
            IrayArray[findex] = ac.P2I(srcDirectivityHandler.getPressureAtPosition(0,freqs[findex],phi,theta)) as number;
          }

          // apply receiver directivity gain (intensity domain: gain²)
          const pathObj = paths[receiverKey][sourceKey][i];
          const dir = pathObj.arrivalDirection || [0, 0, 1] as [number, number, number];
          const recGainIntensity = recForIntensity.getGain(dir as [number, number, number]);
          const recGainSq = recGainIntensity * recGainIntensity;
          if (recGainSq !== 1.0) {
            for (let findex = 0; findex < freqs.length; findex++) {
              IrayArray[findex] *= recGainSq;
            }
          }

          // for each intersection
          for (let j = 0; j < paths[receiverKey][sourceKey][i].chain.length; j++) {
            // intersected angle wrt normal, and the distance traveled
            const { angle, distance } = paths[receiverKey][sourceKey][i].chain[j];

            time += distance / soundSpeed;

            // the intersected surface
            // const surface = paths[receiverKey][sourceKey][i].chain[j].object.parent as Surface;
            const id = paths[receiverKey][sourceKey][i].chain[j].object;

            const surface = useContainer.getState().containers[id] || this.room.surfaceMap[id] || null;

            // for each frequency
            for (let f = 0; f < freqs.length; f++) {
              const freq = freqs[f];
              let coefficient = 1;
              if (surface && surface.kind === 'surface') {
                coefficient = (surface as Surface).reflectionFunction(freq, angle);
                // coefficient = 1 - (surface as Surface).absorptionFunction(freq);
              }
              IrayArray.push(ac.P2I(
                ac.Lp2P((ac.P2Lp(ac.I2P(IrayArray[f] * coefficient)) as number) - airAttenuationdB[f] * distance)
              ) as number);
            }
          }
          const level = ac.P2Lp(ac.I2P(IrayArray)) as number[];
          this.responseByIntensity[receiverKey][sourceKey].response.push({
            time,
            level,
            bounces: paths[receiverKey][sourceKey][i].chain.length
          });
        }
        this.responseByIntensity[receiverKey][sourceKey].response.sort((a, b) => a.time - b.time);
      }
    }

    return this.resampleResponseByIntensity();
  }

  resampleResponseByIntensity(sampleRate: number = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      for (const recKey in this.responseByIntensity) {
        for (const srcKey in this.responseByIntensity[recKey]) {
          const { response, freqs } = this.responseByIntensity[recKey][srcKey];
          const maxTime = response[response.length - 1].time;
          const numSamples = floor(sampleRate * maxTime);
          this.responseByIntensity[recKey][srcKey].resampledResponse = Array(freqs.length)
            .fill(0)
            .map((x) => new Float32Array(numSamples)) as Array<Float32Array>;

          this.responseByIntensity[recKey][srcKey].sampleRate = sampleRate;
          let sampleArrayIndex = 0;
          let zeroIndices = [] as number[];
          let lastNonZeroPoint = freqs.map((x) => 0);
          let seenFirstPointYet = false;
          for (let i = 0, j = 0; i < numSamples; i++) {
            let sampleTime = (i / numSamples) * maxTime;
            if (response[j] && response[j].time) {
              let actualTime = response[j].time;
              if (actualTime > sampleTime) {
                for (let f = 0; f < freqs.length; f++) {
                  this.responseByIntensity[recKey][srcKey].resampledResponse![f][sampleArrayIndex] = 0.0;
                }
                if (seenFirstPointYet) {
                  zeroIndices.push(sampleArrayIndex);
                }
                sampleArrayIndex++;
                continue;
              }
              if (actualTime <= sampleTime) {
                let sums = response[j].level.map((x) => 0);
                while (actualTime <= sampleTime) {
                  actualTime = response[j].time;
                  for (let k = 0; k < freqs.length; k++) {
                    sums[k] = ac.db_add([sums[k], response[j].level[k]]);
                  }
                  j++;
                }
                for (let f = 0; f < freqs.length; f++) {
                  this.responseByIntensity[recKey][srcKey].resampledResponse![f][sampleArrayIndex] = sums[f];
                  if (zeroIndices.length > 0) {
                    const dt = 1 / sampleRate;
                    const lastValue = lastNonZeroPoint[f];
                    const nextValue = sums[f];
                    for (let z = 0; z < zeroIndices.length; z++) {
                      const value = lerp(lastValue, nextValue, (z + 1) / (zeroIndices.length + 1));
                      this.responseByIntensity[recKey][srcKey].resampledResponse![f][zeroIndices[z]] = value;
                    }
                  }
                  lastNonZeroPoint[f] = sums[f];
                }
                if (zeroIndices.length > 0) {
                  zeroIndices = [] as number[];
                }

                seenFirstPointYet = true;
                sampleArrayIndex++;
                continue;
              }
            }
          }
          this.calculateT20(recKey, srcKey);
          this.calculateT30(recKey, srcKey);
          this.calculateT60(recKey, srcKey);
        }
      }

      // return the sample array
      return this.responseByIntensity;
    }

    // if reponse has not been calculated yet
    else {
      console.warn("no data yet");
    }
  }

  calculateT30(receiverId?: string, sourceId?: string) {
    const reckeys = this.receiverIDs;
    const srckeys = this.sourceIDs;
    if (reckeys.length > 0 && srckeys.length > 0) {
      const recid = receiverId || reckeys[0];
      const srcid = sourceId || srckeys[0];
      const resampledResponse = this.responseByIntensity[recid][srcid].resampledResponse;
      const sampleRate = this.responseByIntensity[recid][srcid].sampleRate;
      const freqs = this.responseByIntensity[recid][srcid].freqs;

      if (resampledResponse && sampleRate) {
        const resampleTime = new Float32Array(resampledResponse[0].length);
        for (let i = 0; i < resampledResponse[0].length; i++) {
          resampleTime[i] = i / sampleRate;
        }

        this.responseByIntensity[recid][srcid].t30 = resampledResponse.map((resp) => {
          let i = 0;
          let val = resp[i];
          while (val === 0) {
            val = resp[i++];
          }
          for (let j = i; j >= 0; j--) {
            resp[j] = val;
          }
          const cutoffLevel = val - 30;
          const avg = movingAverage(resp, 2).filter((x) => x >= cutoffLevel);
          const len = avg.length;

          return linearRegression(resampleTime.slice(0, len), resp.slice(0, len));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT20(receiverId?: string, sourceId?: string) {
    const reckeys = this.receiverIDs;
    const srckeys = this.sourceIDs;
    if (reckeys.length > 0 && srckeys.length > 0) {
      const recid = receiverId || reckeys[0];
      const srcid = sourceId || srckeys[0];
      const resampledResponse = this.responseByIntensity[recid][srcid].resampledResponse;
      const sampleRate = this.responseByIntensity[recid][srcid].sampleRate;
      const freqs = this.responseByIntensity[recid][srcid].freqs;

      if (resampledResponse && sampleRate) {
        const resampleTime = new Float32Array(resampledResponse[0].length);
        for (let i = 0; i < resampledResponse[0].length; i++) {
          resampleTime[i] = i / sampleRate;
        }

        this.responseByIntensity[recid][srcid].t20 = resampledResponse.map((resp) => {
          let i = 0;
          let val = resp[i];
          while (val === 0) {
            val = resp[i++];
          }
          for (let j = i; j >= 0; j--) {
            resp[j] = val;
          }
          const cutoffLevel = val - 20;
          const avg = movingAverage(resp, 2).filter((x) => x >= cutoffLevel);
          const len = avg.length;

          return linearRegression(resampleTime.slice(0, len), resp.slice(0, len));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT60(receiverId?: string, sourceId?: string) {
    const reckeys = this.receiverIDs;
    const srckeys = this.sourceIDs;
    if (reckeys.length > 0 && srckeys.length > 0) {
      const recid = receiverId || reckeys[0];
      const srcid = sourceId || srckeys[0];
      const resampledResponse = this.responseByIntensity[recid][srcid].resampledResponse;
      const sampleRate = this.responseByIntensity[recid][srcid].sampleRate;
      const freqs = this.responseByIntensity[recid][srcid].freqs;

      if (resampledResponse && sampleRate) {
        const resampleTime = new Float32Array(resampledResponse[0].length);
        for (let i = 0; i < resampledResponse[0].length; i++) {
          resampleTime[i] = i / sampleRate;
        }

        this.responseByIntensity[recid][srcid].t60 = resampledResponse.map((resp) => {
          let i = 0;
          let val = resp[i];
          while (val === 0) {
            val = resp[i++];
          }
          for (let j = i; j >= 0; j--) {
            resp[j] = val;
          }
          const cutoffLevel = val - 60;
          const avg = movingAverage(resp, 2).filter((x) => x >= cutoffLevel);
          const len = avg.length;

          return linearRegression(resampleTime.slice(0, len), resp.slice(0, len));
        });
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
    const uuidToLinearBuffer = (uuid) => uuid.split("").map((x) => x.charCodeAt(0));
    const chainArrayToLinearBuffer = (chainArray) => {
      return chainArray
        .map((chain: Chain) => [
          ...uuidToLinearBuffer(chain.object), // 36x8
          chain.angle, // 1x32
          chain.distance, // 1x32
          chain.energy, // 1x32
          chain.faceIndex, // 1x8
          chain.faceMaterialIndex, // 1x8
          ...chain.faceNormal, // 3x32
          ...chain.point // 3x32
        ])
        .flat();
    };
    const pathOrder = ["source", "chainLength", "time", "intersectedReceiver", "energy", "chain"];
    const chainOrder = [
      "object",
      "angle",
      "distance",
      "energy",
      "faceIndex",
      "faceMaterialIndex",
      "faceNormal",
      "point"
    ];

    const buffer = new Float32Array(
      Object.keys(this.paths)
        .map((key) => {
          const pathBuffer = this.paths[key]
            .map((path) => {
              return [
                ...uuidToLinearBuffer(path.source),
                path.chainLength,
                path.time,
                Number(path.intersectedReceiver),
                path.energy,
                ...chainArrayToLinearBuffer(path.chain)
              ];
            })
            .flat();
          return [...uuidToLinearBuffer(key), pathBuffer.length, ...pathBuffer];
        })
        .flat()
    );
    return buffer;
  }

  linearBufferToPaths(linearBuffer: Float32Array) {
    const uuidLength = 36;
    const chainItemLength = 47;
    const decodeUUID = (buffer) => String.fromCharCode(...buffer);
    const decodeChainItem = (chainItem: Float32Array) => {
      let o = 0;
      const object = decodeUUID(chainItem.slice(o, (o += uuidLength)));
      const angle = chainItem[o++];
      const distance = chainItem[o++];
      const energy = chainItem[o++];
      const faceIndex = chainItem[o++];
      const faceMaterialIndex = chainItem[o++];
      const faceNormal = [chainItem[o++], chainItem[o++], chainItem[o++]];
      const point = [chainItem[o++], chainItem[o++], chainItem[o++]];
      return {
        object,
        angle,
        distance,
        energy,
        faceIndex,
        faceMaterialIndex,
        faceNormal,
        point
      } as Chain;
    };
    const decodePathBuffer = (buffer) => {
      const paths = [] as RayPath[];
      let o = 0;
      while (o < buffer.length) {
        const source = decodeUUID(buffer.slice(o, (o += uuidLength)));
        const chainLength = buffer[o++];
        const time = buffer[o++];
        const intersectedReceiver = Boolean(buffer[o++]);
        const energy = buffer[o++];
        const chain = [] as Chain[];
        for (let i = 0; i < chainLength; i++) {
          chain.push(decodeChainItem(buffer.slice(o, (o += chainItemLength))));
        }
        /*
        paths.push({
          source,
          chainLength,
          time,
          intersectedReceiver,
          energy,
          chain
        });
        */
      }
      return paths as RayPath[];
    };
    let offset = 0;
    const pathsObj = {} as KVP<RayPath[]>;
    while (offset < linearBuffer.length) {
      const uuid = decodeUUID(linearBuffer.slice(offset, (offset += uuidLength)));
      const pathBufferLength = linearBuffer[offset++];
      const paths = decodePathBuffer(linearBuffer.slice(offset, (offset += pathBufferLength)));
      pathsObj[uuid] = paths;
    }
    return pathsObj;
  }

  arrivalPressure(initialSPL: number[], freqs: number[], path: RayPath, receiverGain: number = 1.0): number[]{

    const intensities = ac.P2I(ac.Lp2P(initialSPL)) as number[];

    if (path.bandEnergy && path.bandEnergy.length === freqs.length) {
      // New path: per-band energy (including air absorption and source directivity) already tracked during tracing
      for (let i = 0; i < freqs.length; i++) {
        intensities[i] *= path.bandEnergy[i];
      }
      // convert back to pressure (no post-hoc air absorption needed), apply receiver directivity gain
      const pressures = ac.Lp2P(ac.P2Lp(ac.I2P(intensities)) as number[]) as number[];
      if (receiverGain !== 1.0) {
        for (let i = 0; i < pressures.length; i++) pressures[i] *= receiverGain;
      }
      return pressures;
    }

    // Legacy path: re-walk chain (backward compat)
    path.chain.slice(0, -1).forEach(p => {
      const surface = useContainer.getState().containers[p.object] as Surface;
      intensities.forEach((I, i) => {
        const R = abs(surface.reflectionFunction(freqs[i], p.angle));
        intensities[i] = I * R;
      });
    });

    // convert back to SPL
    const arrivalLp = ac.P2Lp(ac.I2P(intensities)) as number[];

    // apply air absorption (dB/m) — only for legacy paths
    const airAttenuationdB = ac.airAttenuation(freqs, this.temperature);
    freqs.forEach((_, f) => arrivalLp[f] -= airAttenuationdB[f] * path.totalLength);

    // convert back to pressure, apply receiver directivity gain
    const pressures = ac.Lp2P(arrivalLp) as number[];
    if (receiverGain !== 1.0) {
      for (let i = 0; i < pressures.length; i++) pressures[i] *= receiverGain;
    }
    return pressures;
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
    if(!this.impulseResponse){
      try{
      this.impulseResponse = await this.calculateImpulseResponse();
      } catch(err){
        throw err
      }
    }
    if (audioEngine.context.state === 'suspended') {
      audioEngine.context.resume();
    }
    console.log(this.impulseResponse);
    const impulseResponse = audioEngine.context.createBufferSource();
    impulseResponse.buffer = this.impulseResponse;
    impulseResponse.connect(audioEngine.context.destination);
    impulseResponse.start();
    emit("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: true });
    impulseResponse.onended = () => {
      impulseResponse.stop();
      impulseResponse.disconnect(audioEngine.context.destination);
      emit("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: false });
    };
  }
  downloadImpulses(filename: string, initialSPL = DEFAULT_INITIAL_SPL, frequencies = ac.Octave(125, 8000), sampleRate = 44100){
    if(this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if(this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if(this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");

    const sorted = this.paths[this.receiverIDs[0]].sort((a,b)=>a.time - b.time) as RayPath[];
    const totalTime = sorted[sorted.length - 1].time + RESPONSE_TIME_PADDING;

    const spls = Array(frequencies.length).fill(initialSPL);
    const numberOfSamples = floor(sampleRate * totalTime);

    const samples: Array<Float32Array> = []; 
    for(let f = 0; f<frequencies.length; f++){
      samples.push(new Float32Array(numberOfSamples));
    }
    let max = 0;
    const recForDownload = useContainer.getState().containers[this.receiverIDs[0]] as Receiver;
    for(let i = 0; i<sorted.length; i++){
      const randomPhase = coinFlip() ? 1 : -1;
      const t = sorted[i].time;
      const dir = sorted[i].arrivalDirection || [0, 0, 1] as [number, number, number];
      const recGain = recForDownload.getGain(dir as [number, number, number]);
      const p = this.arrivalPressure(spls, frequencies, sorted[i], recGain).map(x => x * randomPhase);
      const roundedSample = floor(t * sampleRate);

      for(let f = 0; f<frequencies.length; f++){
        samples[f][roundedSample] += p[f];
        if(abs(samples[f][roundedSample]) > max){
          max = abs(samples[f][roundedSample]);
        }
      }
    }

    for(let f = 0; f<frequencies.length; f++){
      const blob = ac.wavAsBlob([ac.normalize(samples[f])], { sampleRate, bitDepth: 32 });
      FileSaver.saveAs(blob, `${frequencies[f]}_${filename}.wav`);
    }
  }
  async downloadImpulseResponse(filename: string, sampleRate = audioEngine.sampleRate){
    if(!this.impulseResponse){
      try{
        this.impulseResponse = await this.calculateImpulseResponse();
        } catch(err){
          throw err
        }
    }
    const blob = ac.wavAsBlob([normalize(this.impulseResponse.getChannelData(0))], { sampleRate, bitDepth: 32 });
    const extension = !filename.endsWith(".wav") ? ".wav" : "";
    FileSaver.saveAs(blob, filename + extension);
  }

  /**
   * Download the ambisonic impulse response as a multi-channel WAV file.
   * Channels are in ACN order with N3D normalization.
   *
   * @param filename - Output filename (without extension)
   * @param order - Ambisonic order (default: 1)
   */
  async downloadAmbisonicImpulseResponse(
    filename: string,
    order: number = 1
  ) {
    // Calculate if not already cached or if order changed
    if (!this.ambisonicImpulseResponse || this.ambisonicOrder !== order) {
      this.ambisonicOrder = order;
      this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(order);
    }

    const nCh = this.ambisonicImpulseResponse.numberOfChannels;
    const sampleRate = this.ambisonicImpulseResponse.sampleRate;
    const channelData: Float32Array[] = [];

    // Extract all channels
    for (let ch = 0; ch < nCh; ch++) {
      channelData.push(this.ambisonicImpulseResponse.getChannelData(ch));
    }

    const blob = ac.wavAsBlob(channelData, { sampleRate, bitDepth: 32 });
    const extension = !filename.endsWith(".wav") ? ".wav" : "";
    const orderLabel = order === 1 ? "FOA" : `HOA${order}`;
    FileSaver.saveAs(blob, `${filename}_${orderLabel}${extension}`);
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

on("RAYTRACER_CALL_METHOD", callSolverMethod);
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


