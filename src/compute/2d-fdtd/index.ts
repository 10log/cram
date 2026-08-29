import { on, postMessage, removeMessageHandler } from "../../messenger";
import {
  PlaneGeometry,
  ShaderMaterial,
  UniformsLib,
  Mesh,
  WebGLRenderer,
  DataTexture,
  UniformsUtils,
  Color,
  DoubleSide,
  Vector2,
  Vector3,
  IUniform,
  WebGLRenderTarget,
  ClampToEdgeWrapping,
  NearestFilter,
  RGBAFormat,
  UnsignedByteType,
  BufferGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial
} from "three";
import {
  GPUComputationRenderer,
  Variable
} from "three/examples/jsm/misc/GPUComputationRenderer.js";
import shaders from "./shaders";
import Solver from "../solver";
import { computeTimestep } from "./timestep";
import {
  applySliceTransform,
  domainFromBox,
  worldToPlane,
  type FdtdSlice,
} from "./slice";
import {
  REST_PRESSURE,
  REST_VELOCITY,
  dirichletSourcePixel,
  vacatedSourcePixel,
  writeFieldPixel,
} from "./field-encoding";
import { passesForElapsed, sampleRateFromDt } from "./recording";

import Source from "../../objects/source";
import Receiver from "../../objects/receiver";
import FDTDWall, { FDTDWallProps } from "./fdtd-wall";
import Surface from "../../objects/surface";
import { KeyValuePair } from "../../common/key-value-pair";
import { clamp } from "../../common/clamp";
import { EditorModes } from "../../constants";
import { useContainer } from "../../store";
import { renderer } from "../../render/renderer";

const CELL_RESOLUTION = 256;

export const FDTD_2D_Defaults = {
  width: 10,
  height: 10,
  cellSize: 10 / CELL_RESOLUTION,
  offsetX: 0,
  offsetY: 0,
  slice: "xz" as FdtdSlice,
};

export interface FDTD_2D_Props {
  width?: number;
  height?: number;
  cellSize?: number;
  offsetX?: number;
  offsetY?: number;
  /** Floor plan (`xz`) or vertical sketch (`xy`). Inferred from the selected surface when omitted. */
  slice?: FdtdSlice;
}

export interface Uniforms {
  [uniform: string]: IUniform;
}

class FDTD_2D extends Solver {
  gpuCompute!: GPUComputationRenderer;

  /**
   * number of x cells
   */
  nx: number;

  /**
   * number of y cells
   */
  ny: number;
  
  offsetX: number;
  offsetY: number;
  slice: FdtdSlice;
  sliceHeight: number;

  uniforms!: Uniforms;
  mesh!: Mesh;
  editMesh!: Mesh;
  heightmapVariable!: Variable;
  sourcemapVariable!: Variable;
  sourcemap!: DataTexture;
  readLevelShader!: ShaderMaterial;
  readLevelImage!: Uint8Array;
  readLevelRenderTarget!: WebGLRenderTarget;
  sources!: KeyValuePair<Source>;
  sourceKeys!: string[];
  receivers!: KeyValuePair<Receiver>;
  receiverKeys!: string[];
  walls!: FDTDWall[];
  /**
   * simulation in seconds
   */
  time: number;

  /**
   * simulation time step in seconds
   */
  dt: number;
  width: number;
  height: number;
  cellSize: number;
  numPasses: number;
  waveSpeed: number;
  recording: boolean;
  lastTickMs: number | null;
  clearShader!: ShaderMaterial;
  frame: number;
  messageHandlers: string[][];
  eventListeners: (()=>void)[];
  constructor(props?: FDTD_2D_Props) {
    super(props);
    this.kind = "fdtd-2d";
    this.running = false;
    this.time = 0;
    this.frame = 0;
    this.numPasses = 1;
    this.waveSpeed = 340.29;
    this.recording = false;
    this.lastTickMs = null;

    const surfaces = [...useContainer.getState().selectedObjects.values()].filter(x=>x.kind==="surface") as Surface[];
    let surface: Surface|null = null;
    props = props || {};
    let inferredDomain: ReturnType<typeof domainFromBox> | null = null;
    if (surfaces.length > 0) {
      surface = surfaces.length > 1 ? surfaces[0].mergeSurfaces(surfaces) : surfaces[0];
      surface.updateMatrixWorld(true);
      surface.mesh.geometry.computeBoundingBox();
      const localBox = surface.mesh.geometry.boundingBox;
      if (localBox) {
        const min = localBox.min.clone().applyMatrix4(surface.mesh.matrixWorld);
        const max = localBox.max.clone().applyMatrix4(surface.mesh.matrixWorld);
        inferredDomain = domainFromBox(
          { min: { x: min.x, y: min.y, z: min.z }, max: { x: max.x, y: max.y, z: max.z } },
          props.slice,
        );
        props.width = inferredDomain.width;
        props.height = inferredDomain.height;
        props.offsetX = inferredDomain.offsetX;
        props.offsetY = inferredDomain.offsetY;
        props.slice = inferredDomain.slice;
      }
    }
    const _width = (props && props.width) || FDTD_2D_Defaults.width;
    const _height = (props && props.height) || FDTD_2D_Defaults.height;

    this.offsetX = (props && props.offsetX) || FDTD_2D_Defaults.offsetX;
    this.offsetY = (props && props.offsetY) || FDTD_2D_Defaults.offsetY;
    this.slice = (props && props.slice) || inferredDomain?.slice || FDTD_2D_Defaults.slice;
    this.sliceHeight = inferredDomain?.sliceHeight ?? 0;

    this.cellSize = (props && props.cellSize) || Math.max(_width, _height) / CELL_RESOLUTION;

    this.nx = Math.ceil(_width / this.cellSize);
    this.ny = Math.ceil(_height / this.cellSize);

    this.width = this.nx * this.cellSize;
    this.height = this.ny * this.cellSize;

    this.dt = computeTimestep(this.cellSize, this.waveSpeed);

    this.sources = {} as KeyValuePair<Source>;
    this.sourceKeys = [] as string[];
    this.receivers = {} as KeyValuePair<Receiver>;
    this.receiverKeys = [] as string[];
    this.walls = [] as FDTDWall[];
    this.messageHandlers = [] as string[][];
    this.eventListeners = [] as (()=>void)[];

    const editGeometry = new PlaneGeometry(this.width, this.height, 1, 1);
    applySliceTransform(editGeometry, {
      slice: this.slice,
      width: this.width,
      height: this.height,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      sliceHeight: this.sliceHeight,
    });
    const editMaterials = [
      new MeshBasicMaterial({ wireframe: true, side: DoubleSide, color: 0x707070 }),
      new MeshLambertMaterial({ transparent: true, opacity: 0.35, side: DoubleSide, color: 0x707070 })
    ];
    
    this.editMesh = new Mesh(editGeometry, editMaterials[0]);
    this.editMesh.name = "fdtd-2d-edit-mesh";
    this.editMesh.visible = false;
    
    renderer.fdtdItems.add(this.editMesh);
    

    this.fillTexture = this.fillTexture.bind(this);
    this.init = this.init.bind(this);
    this.render = this.render.bind(this);
    this.updateWalls = this.updateWalls.bind(this);
    this.updateSourceTexture = this.updateSourceTexture.bind(this);
    this.addWallsFromSurfaceEdges = this.addWallsFromSurfaceEdges.bind(this);
    this.setWireframeVisible = this.setWireframeVisible.bind(this);
    this.getWireframeVisible = this.getWireframeVisible.bind(this);
    this.toggleWall = this.toggleWall.bind(this);
    this.clear = this.clear.bind(this);
    
    
    this.init();
    
    this.onModeChange(postMessage("GET_EDITOR_MODE")[0]);

    if(surface){
      this.addWallsFromSurfaceEdges(surface);
    }
    

  }
  onModeChange(mode: EditorModes) {
    switch (mode) {
      case EditorModes.OBJECT: { 
        this.editMesh.visible = false;
        this.mesh.visible = true;
      } break;
      case EditorModes.SKETCH: { 
        this.editMesh.visible = false;
        this.mesh.visible = false;
      } break;
      case EditorModes.EDIT: { 
        this.editMesh.visible = true;
        this.mesh.visible = false;
      } break;
      default: break;
    }
  }
  setWidth(width: number) {
    this.nx = Math.ceil(width / this.cellSize);
    this.width = this.nx * this.cellSize;
  }
  setHeight(height: number) {
    this.ny = Math.ceil(height / this.cellSize);
    this.height = this.ny * this.cellSize;
  }
  
  setDimmensions(width: number, height: number) {
    this.setWidth(width);
    this.setHeight(height);
  }
  
  init() {
    this.dispose();
    const geometry = new PlaneGeometry(this.width, this.height, this.nx - 1, this.ny - 1);
    geometry.name = "fdtd-2d-plane-geometry";
    applySliceTransform(geometry, {
      slice: this.slice,
      width: this.width,
      height: this.height,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      sliceHeight: this.sliceHeight,
    });
    const heightmap = { value: null };
    const uniforms = UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.specularmap,
      UniformsLib.envmap,
      UniformsLib.aomap,
      UniformsLib.lightmap,
      UniformsLib.emissivemap,
      UniformsLib.bumpmap,
      UniformsLib.normalmap,
      UniformsLib.displacementmap,
      UniformsLib.gradientmap,
      UniformsLib.fog,
      UniformsLib.lights,
      {
        emissive: { value: new Color(0x000000) },
        specular: { value: new Color(0x111111) },
        shininess: { value: 30 },
        colorBrightness: { value: 10 },
        cell_size: { value: this.cellSize },
        inv_cell_size: { value: 1 / this.cellSize },
        heightmap
      }
    ]);
    const vertexShader = shaders.waterVert;
    const fragmentShader = shaders.waterFrag;
    const side = DoubleSide;
    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side,
      name: "fdtd-2d-material"
    });
    material.lights = true;

    this.uniforms = material.uniforms;
    this.mesh = new Mesh(geometry, material);

    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
    // this.mesh.scale.setScalar(this.width / this.nx);
    (this.mesh.material as ShaderMaterial).wireframe = false;
    this.mesh.matrixAutoUpdate = true;
    this.mesh.scale.setZ(0.01);
    renderer.fdtdItems.add(this.mesh);

    this.gpuCompute = new GPUComputationRenderer(this.nx, this.ny, renderer.renderer as WebGLRenderer);

    let heightmapInit = this.gpuCompute.createTexture();
    this.sourcemap = this.gpuCompute.createTexture();
    this.fillSourceTexture();
    this.updateSourceTexture();
    this.fillTexture(heightmapInit);
    this.heightmapVariable = this.gpuCompute.addVariable("heightmap", shaders.heightMapFrag, heightmapInit);
    this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]);

    (this.heightmapVariable.material as ShaderMaterial).uniforms["sourcemap"] = { value: this.sourcemap };

    (this.heightmapVariable.material as ShaderMaterial).uniforms["mousePos"] = { value: new Vector2(5, 5) };

    (this.heightmapVariable.material as ShaderMaterial).uniforms["mouseSize"] = { value: 0.0 };

    // Numerical sponge on velocity — not air absorption and not a Surface material.
    // Walls in height-map.frag are perfectly rigid (Neumann) until impedance exists.
    (this.heightmapVariable.material as ShaderMaterial).uniforms["damping"] = { value: 0.9999 };

    (this.heightmapVariable.material as ShaderMaterial).uniforms["courantSq"] = { value: (this.waveSpeed * this.dt / this.cellSize) ** 2 };

    (this.heightmapVariable.material as ShaderMaterial).uniforms["heightCompensation"] = { value: 0 };

    (this.heightmapVariable.material as ShaderMaterial).uniforms["cell_size"] = { value: this.cellSize };

    (this.heightmapVariable.material as ShaderMaterial).uniforms["inv_cell_size"] = { value: 1 / this.cellSize };

    const error = this.gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }

    this.clearShader = this.gpuCompute["createShaderMaterial"](shaders.clearFrag, { clearTexture: { value: null } });

    this.readLevelShader = this.gpuCompute["createShaderMaterial"](shaders.readLevelFrag, {
      point1: { value: new Vector2() },
      levelTexture: { value: null },
      cell_size: { value: this.cellSize },
      inv_cell_size: { value: 1 / this.cellSize }
    });

    // Create a 4x1 pixel image and a render target (Uint8, 4 channels, 1 byte per channel) to read water height and orientation
    this.readLevelImage = new Uint8Array(4 * 1 * 4);

    this.readLevelRenderTarget = new WebGLRenderTarget(4, 1, {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: false
    });
    

    this.eventListeners.push(on("RENDERER_UPDATED", ()=>{
      if (this.running) this.render();
    }));
    this.render();
    this.clear();
  }
  editSize() {
    // this.mesh.visible = false;
  }
  dispose() {
    this.eventListeners.forEach(dispose => dispose());

    for (let i = 0; i < this.messageHandlers.length; i++) {
      removeMessageHandler(this.messageHandlers[i][0], this.messageHandlers[i][1]); 
    }
    this.mesh && renderer.fdtdItems.remove(this.mesh);
    this.messageHandlers = [] as string[][];
  }
  run() {
    this.running = true;
    this.lastTickMs = null;
    renderer.fdtd2drunning = true;
  }
  stop() {
    this.running = false;
    this.lastTickMs = null;
    renderer.fdtd2drunning = false;
  }

  get sampleRate() {
    return sampleRateFromDt(this.dt);
  }

  startRecording() {
    this.recording = true;
    this.lastTickMs = null;
    const rate = this.sampleRate;
    for (const key of this.sourceKeys) {
      if (this.sources[key]) this.sources[key].fdtdSampleRate = rate;
    }
    for (const key of this.receiverKeys) {
      if (this.receivers[key]) this.receivers[key].fdtdSampleRate = rate;
    }
  }

  stopRecording() {
    this.recording = false;
  }
  // save() {
  //   return pickProps(["name", "uuid", "width", "height", "offsetX", "offsetY", "cellSize"], this);
  // }
  setWireframeVisible(show: boolean) {
    (this.mesh.material as ShaderMaterial).wireframe = show;
  }
  getWireframeVisible() {
    return (this.mesh.material as ShaderMaterial).wireframe;
  }
  addSource(source: Source) {
    this.sourceKeys = [...new Set(this.sourceKeys.concat(source.uuid))];
    this.sources[source.uuid] = source;
  }
  removeSource(id: string) {
    const source = this.sources[id];
    if (!source) return;
    this.vacateSourceCell(source.position);
    delete this.sources[id];
    this.sourceKeys = this.sourceKeys.filter((x) => x !== id);
  }

  private planeCellIndex(point: { x: number; y: number; z: number }) {
    const plane = worldToPlane(point, this.slice);
    const x = Math.round((plane.u - this.offsetX) / this.cellSize);
    const y = Math.round((plane.v - this.offsetY) / this.cellSize);
    return 4 * (y * this.nx + x);
  }

  private vacateSourceCell(point: { x: number; y: number; z: number }) {
    const pixels = this.sourcemap?.image?.data;
    if (!pixels) return;
    writeFieldPixel(pixels, this.planeCellIndex(point), vacatedSourcePixel());
    this.sourcemap.needsUpdate = true;
  }
  addReceiver(receiver: Receiver) {
    this.receiverKeys = [...new Set(this.receiverKeys.concat(receiver.uuid))];
    this.receivers[receiver.uuid] = receiver;
  }
  removeReceiver(id: string) {
    if (this.receivers[id]) {
      delete this.receivers[id];
      this.receiverKeys = this.receiverKeys.filter((x) => x !== id);
    }
  }
  addWall(props: FDTDWallProps) {
    const x1 = clamp(Math.floor((props.x1 - this.offsetX) / this.cellSize), 0, this.nx - 1);
    const y1 = clamp(Math.floor((props.y1 - this.offsetY) / this.cellSize), 0, this.ny - 1);
    const x2 = clamp(Math.floor((props.x2 - this.offsetX) / this.cellSize), 0, this.nx - 1);
    const y2 = clamp(Math.floor((props.y2 - this.offsetY) / this.cellSize), 0, this.ny - 1);
    this.walls.push(new FDTDWall({ x1, y1, x2, y2 }));
    this.updateWalls();
  }
  addWallsFromSurfaceEdges(surface: Surface) {
    surface.updateMatrixWorld(true);
    const edges = surface.edges;
    edges.updateMatrixWorld(true);
    const positionAttr = (edges.geometry as BufferGeometry).getAttribute('position');
    const a = new Vector3();
    const b = new Vector3();
    for (let i = 0; i < positionAttr.count; i += 2) {
      a.fromBufferAttribute(positionAttr, i).applyMatrix4(edges.matrixWorld);
      b.fromBufferAttribute(positionAttr, i + 1).applyMatrix4(edges.matrixWorld);
      const pa = worldToPlane(a, this.slice);
      const pb = worldToPlane(b, this.slice);
      const x1 = clamp(Math.floor((pa.u - this.offsetX) / this.cellSize), 0, this.nx - 1);
      const y1 = clamp(Math.floor((pa.v - this.offsetY) / this.cellSize), 0, this.ny - 1);
      const x2 = clamp(Math.floor((pb.u - this.offsetX) / this.cellSize), 0, this.nx - 1);
      const y2 = clamp(Math.floor((pb.v - this.offsetY) / this.cellSize), 0, this.ny - 1);
      this.walls.push(new FDTDWall({ x1, y1, x2, y2 }));
    }
    this.updateWalls();
  }

  fillSourceTexture() {
    const pixels = this.sourcemap.image.data;
    if (!pixels) return;
    let p = 0;
    for (let j = 0; j < this.ny; j++) {
      for (let i = 0; i < this.nx; i++) {
        pixels[p + 0] = REST_PRESSURE;
        pixels[p + 1] = REST_VELOCITY;
        pixels[p + 2] = 1;
        pixels[p + 3] = 1;
        p += 4;
      }
    }
  }

  toggleWall(index: number) {
    if (this.walls[index]) {
      this.walls[index].enabled = !this.walls[index].enabled;
      this.updateWalls();
    }
  }

  updateWalls() {
    const data = this.sourcemap.image.data;
    if (!data) return;
    for (let i = 0; i < this.walls.length; i++) {
      if (this.walls[i].shouldClearPreviousCells) {
        for (let j = 0; j < this.walls[i].previousCells.length; j++) {
          const index = 4 * (this.walls[i].previousCells[j][1] * this.nx + this.walls[i].previousCells[j][0]);
          data[index + 2] = 1;
        }
        this.walls[i].shouldClearPreviousCells = false;
      }
      if (this.walls[i].enabled) {
        for (let j = 0; j < this.walls[i].cells.length; j++) {
          const index = 4 * (this.walls[i].cells[j][1] * this.nx + this.walls[i].cells[j][0]);
          data[index + 2] = 0;
        }
      } else {
        for (let j = 0; j < this.walls[i].cells.length; j++) {
          const index = 4 * (this.walls[i].cells[j][1] * this.nx + this.walls[i].cells[j][0]);
          data[index + 2] = 1;
        }
      }
    }
    this.sourcemap.needsUpdate = true;
  }

  updateSourceTexture() {
    const pixels = this.sourcemap.image.data;
    if (!pixels) return;
    for (let i = 0; i < this.sourceKeys.length; i++) {
      const source = this.sources[this.sourceKeys[i]];
      source.updateWave(this.time, this.frame, this.dt);
      writeFieldPixel(pixels, this.planeCellIndex(source.position), dirichletSourcePixel(source.value));

      if (source.shouldClearPreviousPosition) {
        writeFieldPixel(
          pixels,
          this.planeCellIndex({
            x: source.previousX,
            y: source.previousY,
            z: source.previousZ,
          }),
          vacatedSourcePixel(),
        );
        source.shouldClearPreviousPosition = false;
        source.updatePreviousPosition();
      }
    }
    this.sourcemap.needsUpdate = true;
  }
  fillTexture(texture: DataTexture) {
    const pixels = texture.image.data;
    if (!pixels) return;
    let p = 0;
    for (let j = 0; j < this.ny; j++) {
      for (let i = 0; i < this.nx; i++) {
        pixels[p + 0] = REST_PRESSURE;
        pixels[p + 1] = REST_VELOCITY;
        pixels[p + 2] = 1;
        pixels[p + 3] = 1;
        p += 4;
      }
    }
  }
  readReceiverLevels() {
    const currentRenderTarget = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
    this.readLevelShader.uniforms["levelTexture"].value = currentRenderTarget["texture"];
    for (let i = 0; i < this.receiverKeys.length; i++) {
      const key = this.receiverKeys[i];
      if (this.receivers[key]) {
        const plane = worldToPlane(this.receivers[key].position, this.slice);
        const u = (plane.u - this.offsetX) / this.width;
        const v = (plane.v - this.offsetY) / this.height;
        this.readLevelShader.uniforms["point1"].value.set(u, v);
        this.gpuCompute.doRenderTarget(this.readLevelShader, this.readLevelRenderTarget);
        (renderer.renderer as WebGLRenderer).readRenderTargetPixels(
          this.readLevelRenderTarget,
          0,
          0,
          4,
          1,
          this.readLevelImage
        );
        const pixels = new Float32Array(this.readLevelImage.buffer);
        const level = pixels[0];
        this.receivers[key].fdtdSamples.push((level-127.5)/127.5);
      }
    }
  }
  clear() {
    const currentRenderTarget = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
    const alternateRenderTarget = this.gpuCompute.getAlternateRenderTarget(this.heightmapVariable);
    this.clearShader.uniforms["clearTexture"].value = currentRenderTarget["texture"];
    this.gpuCompute.doRenderTarget(this.clearShader, alternateRenderTarget);
    this.clearShader.uniforms["clearTexture"].value = alternateRenderTarget["texture"];
    this.gpuCompute.doRenderTarget(this.clearShader, currentRenderTarget);
    this.time = 0;
    this.frame = 0;
    this.lastTickMs = null;
  }
  render(nowMs: number = (typeof performance !== "undefined" ? performance.now() : 0)) {
    const wallDt = this.lastTickMs == null ? 0 : (nowMs - this.lastTickMs) / 1000;
    this.lastTickMs = nowMs;
    const passes = passesForElapsed({
      wallDt,
      dt: this.dt,
      displayPasses: this.numPasses,
      recording: this.recording,
    });
    for (let i = 0; i < passes; i++) {
      this.updateSourceTexture();

      this.heightmapVariable.material["uniforms"]["sourcemap"].value = this.sourcemap;

      // Do the gpu computation
      this.gpuCompute.compute();

      if (this.recording) {
        for (let j = 0; j < this.sourceKeys.length; j++){
          this.sources[this.sourceKeys[j]].recordSample();
        }
        this.readReceiverLevels();
      }

      this.time += this.dt;
      this.frame += 1;
    }

    // Get compute output in custom uniform
    this.uniforms["heightmap"].value = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable)["texture"];
  }
  onParameterConfigFocus() {}
  onParameterConfigBlur() {}
}

export { FDTD_2D };

export default FDTD_2D;

