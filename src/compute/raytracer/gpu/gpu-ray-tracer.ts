/**
 * CPU-side orchestrator that manages WebGPU resources and dispatches
 * the ray-trace compute shader.
 */
import { requestGpuContext } from './gpu-context';
import { buildGpuSceneBuffers } from './gpu-bvh';
import type { GpuSceneBuffers } from './gpu-bvh';
import type Room from '../../../objects/room';
import type { RayPath, Chain, BandEnergy } from '../types';
import shaderSource from './ray-trace.wgsl?raw';

// ─── Constants matching WGSL ─────────────────────────────────────────

const MAX_BOUNCES = 64;
// Chain slots per ray: wall bounces and receiver crossings share them since
// rays pass through receivers (#242), so twice the bounces.
const CHAIN_SLOTS = 128;
const MAX_BANDS = 7;
const WORKGROUP_SIZE = 64;

// Byte sizes for GPU structs (must match WGSL layout exactly)
// RayInput: 8 floats + 7 band + 1 pad = 16 floats = 64 bytes
const RAY_INPUT_FLOATS = 16;
const RAY_INPUT_BYTES = RAY_INPUT_FLOATS * 4;

// RayOutput: 8 floats + 7 band + 1 pad = 16 floats = 64 bytes
const RAY_OUTPUT_FLOATS = 16;
const RAY_OUTPUT_BYTES = RAY_OUTPUT_FLOATS * 4;

// ChainEntry: 8 floats + 7 band + 1 pad = 16 floats = 64 bytes
const CHAIN_ENTRY_FLOATS = 16;
const CHAIN_ENTRY_BYTES = CHAIN_ENTRY_FLOATS * 4;

// Params uniform: see struct in WGSL
// 8 u32/f32 + rrThreshold + 3 pad + 2×vec4 airAttPacked = 20 floats (80 bytes)
const PARAMS_FLOATS = 20;
const PARAMS_BYTES = PARAMS_FLOATS * 4;

/**
 * One traced ray. `path` is its own path, wall bounces only, or null if it
 * hit no wall; `arrivals` every receiver it crossed, in order (#242).
 */
export interface GpuRayResult {
  path: RayPath | null;
  arrivals: RayPath[];
}

/**
 * Splits a kernel chain, where receiver crossings are interleaved with wall
 * bounces (#242), into the ray's own path and one arrival per crossing, as
 * the CPU's `traceRay` does with an arrivals collector (#234).
 *
 * Each arrival's chain is the walls before it plus the receiver entry, whose
 * energy the kernel recorded as it reached the receiver. It arrives from the
 * previous wall's point (or the ray's origin) along a straight segment.
 */
export function splitRayChain(
  chain: Chain[],
  isReceiver: boolean[],
  origin: [number, number, number],
  finalBandEnergy: BandEnergy,
  initialPhi: number,
  initialTheta: number,
): GpuRayResult {
  const mean = (e: BandEnergy) => (e.length > 0 ? e.reduce((a, b) => a + b, 0) / e.length : 0);
  const walls: Chain[] = [];
  const arrivals: RayPath[] = [];
  for (let c = 0; c < chain.length; c++) {
    const hop = chain[c];
    if (!isReceiver[c]) {
      walls.push(hop);
      continue;
    }
    const from = walls.length > 0 ? walls[walls.length - 1].point : origin;
    const dir = [from[0] - hop.point[0], from[1] - hop.point[1], from[2] - hop.point[2]];
    const len = Math.hypot(dir[0], dir[1], dir[2]) || 1;
    const arrivalChain = [...walls, hop];
    const arrivalEnergy = hop.bandEnergy ?? [];
    arrivals.push({
      intersectedReceiver: true,
      chain: arrivalChain,
      chainLength: arrivalChain.length,
      energy: mean(arrivalEnergy),
      bandEnergy: [...arrivalEnergy],
      time: 0, // Computed by caller
      source: '', // Filled in by caller
      initialPhi,
      initialTheta,
      totalLength: 0, // Computed by caller
      arrivalDirection: [dir[0] / len, dir[1] / len, dir[2] / len],
    });
  }
  const path: RayPath | null = walls.length === 0 ? null : {
    intersectedReceiver: false,
    chain: walls,
    chainLength: walls.length,
    energy: mean(finalBandEnergy),
    bandEnergy: finalBandEnergy,
    time: 0,
    source: '',
    initialPhi,
    initialTheta,
    totalLength: 0,
  };
  return { path, arrivals };
}

export interface GpuRayTracerConfig {
  reflectionOrder: number;
  frequencies: number[];
  cachedAirAtt: number[];
  rrThreshold: number;
}

export class GpuRayTracer {
  private device: GPUDevice | null = null;
  private pipeline: GPUComputePipeline | null = null;
  private bindGroupLayout: GPUBindGroupLayout | null = null;

  // Scene buffers
  private sceneBuf: GpuSceneBuffers | null = null;
  private gpuBvhNodes: GPUBuffer | null = null;
  private gpuTriVerts: GPUBuffer | null = null;
  private gpuTriSurfIdx: GPUBuffer | null = null;
  private gpuTriNormals: GPUBuffer | null = null;
  private gpuSurfAcoustic: GPUBuffer | null = null;
  private gpuReceiverSpheres: GPUBuffer | null = null;

  // Per-dispatch buffers
  private gpuRayInputs: GPUBuffer | null = null;
  private gpuRayOutputs: GPUBuffer | null = null;
  private gpuChainBuffer: GPUBuffer | null = null;
  private gpuParams: GPUBuffer | null = null;
  private gpuReadbackOutput: GPUBuffer | null = null;
  private gpuReadbackChain: GPUBuffer | null = null;

  private config: GpuRayTracerConfig | null = null;
  private maxBatchSize = 0;

  /** The actual batch size after clamping to device limits. */
  get effectiveBatchSize(): number { return this.maxBatchSize; }

  async initialize(
    room: Room,
    receiverIDs: string[],
    config: GpuRayTracerConfig,
    requestedBatchSize: number,
  ): Promise<boolean> {
    const ctx = await requestGpuContext();
    if (!ctx) return false;

    this.device = ctx.device;
    this.config = config;

    // Clamp batchSize to fit within device storage buffer limits.
    // The chain buffer is the largest: batchSize × CHAIN_SLOTS × CHAIN_ENTRY_BYTES.
    const maxStorageBinding = ctx.device.limits.maxStorageBufferBindingSize;
    const maxBufSize = ctx.device.limits.maxBufferSize;
    const perRayChainBytes = CHAIN_SLOTS * CHAIN_ENTRY_BYTES;
    const maxByLimits = Math.floor(Math.min(maxStorageBinding, maxBufSize) / perRayChainBytes);
    if (maxByLimits < 1) {
      console.error('[GPU RT] Device storage limits too small for even a single ray chain buffer');
      return false;
    }
    const normalizedRequested = Math.max(1, requestedBatchSize);
    const batchSize = Math.min(normalizedRequested, maxByLimits);
    if (batchSize < normalizedRequested) {
      console.warn(`[GPU RT] batchSize ${normalizedRequested} exceeds device limits; clamped to ${batchSize}`);
    }
    this.maxBatchSize = batchSize;

    // Clamp reflection order
    if (config.reflectionOrder > MAX_BOUNCES) {
      console.warn(`[GPU RT] reflectionOrder ${config.reflectionOrder} clamped to ${MAX_BOUNCES}`);
    }

    // Truncate frequencies to MAX_BANDS so scene buffer stride matches shader indexing
    const clampedFrequencies = config.frequencies.slice(0, MAX_BANDS);

    // Build scene data
    this.sceneBuf = buildGpuSceneBuffers(room, receiverIDs, clampedFrequencies);

    // Create GPU storage buffers for scene
    this.gpuBvhNodes = this.createStorageBuffer(this.sceneBuf.bvhNodes);
    this.gpuTriVerts = this.createStorageBuffer(this.sceneBuf.triangleVertices);
    this.gpuTriSurfIdx = this.createStorageBuffer(new Uint32Array(this.sceneBuf.triangleSurfaceIndex));
    this.gpuTriNormals = this.createStorageBuffer(this.sceneBuf.triangleNormals);
    this.gpuSurfAcoustic = this.createStorageBuffer(this.sceneBuf.surfaceAcousticData);

    // Receiver spheres (may be empty — create a 16-byte dummy if so)
    const recData = this.sceneBuf.receiverSpheres.length > 0
      ? this.sceneBuf.receiverSpheres
      : new Float32Array(4); // dummy
    this.gpuReceiverSpheres = this.createStorageBuffer(recData);

    // Per-dispatch buffers
    const inputBytes = batchSize * RAY_INPUT_BYTES;
    const outputBytes = batchSize * RAY_OUTPUT_BYTES;
    const chainBytes = batchSize * CHAIN_SLOTS * CHAIN_ENTRY_BYTES;

    this.gpuRayInputs = this.device.createBuffer({
      size: inputBytes,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    this.gpuRayOutputs = this.device.createBuffer({
      size: outputBytes,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    this.gpuChainBuffer = this.device.createBuffer({
      size: chainBytes,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    this.gpuParams = this.device.createBuffer({
      size: PARAMS_BYTES,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Readback buffers
    this.gpuReadbackOutput = this.device.createBuffer({
      size: outputBytes,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });
    this.gpuReadbackChain = this.device.createBuffer({
      size: chainBytes,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    // Create compute pipeline
    const shaderModule = this.device.createShaderModule({ code: shaderSource });
    this.pipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: { module: shaderModule, entryPoint: 'main' },
    });
    this.bindGroupLayout = this.pipeline.getBindGroupLayout(0);

    return true;
  }

  async traceBatch(
    rayInputs: Float32Array,
    rayCount: number,
    batchSeed: number,
  ): Promise<GpuRayResult[]> {
    if (!this.device || !this.pipeline || !this.sceneBuf || !this.config) {
      throw new Error('[GPU RT] Not initialized');
    }

    if (rayCount > this.maxBatchSize) {
      throw new Error(`[GPU RT] rayCount ${rayCount} exceeds maxBatchSize ${this.maxBatchSize}`);
    }
    if (rayCount === 0) return [];

    const numBands = Math.min(this.config.frequencies.length, MAX_BANDS);

    // Write params uniform
    const paramsData = new ArrayBuffer(PARAMS_BYTES);
    const paramsU32 = new Uint32Array(paramsData);
    const paramsF32 = new Float32Array(paramsData);
    paramsU32[0] = rayCount;
    paramsU32[1] = Math.min(this.config.reflectionOrder, MAX_BOUNCES);
    paramsU32[2] = numBands;
    paramsU32[3] = this.sceneBuf.receiverCount;
    paramsU32[4] = this.sceneBuf.triangleCount;
    paramsU32[5] = this.sceneBuf.nodeCount;
    paramsU32[6] = this.sceneBuf.surfaceCount;
    paramsU32[7] = batchSeed;
    paramsF32[8] = this.config.rrThreshold;
    // pad slots 9,10,11
    // airAttPacked: array<vec4<f32>, 2> starts at index 12
    // vec4[0] = (band0..3) at indices 12-15, vec4[1] = (band4..6, pad) at 16-18
    for (let i = 0; i < numBands; i++) {
      paramsF32[12 + i] = this.config.cachedAirAtt[i];
    }

    this.device.queue.writeBuffer(this.gpuParams!, 0, paramsData as ArrayBuffer);

    // Write ray inputs
    this.device.queue.writeBuffer(
      this.gpuRayInputs!, 0,
      rayInputs.buffer as ArrayBuffer, rayInputs.byteOffset, rayCount * RAY_INPUT_BYTES,
    );

    // Create bind group
    const bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout!,
      entries: [
        { binding: 0, resource: { buffer: this.gpuParams! } },
        { binding: 1, resource: { buffer: this.gpuBvhNodes! } },
        { binding: 2, resource: { buffer: this.gpuTriVerts! } },
        { binding: 3, resource: { buffer: this.gpuTriSurfIdx! } },
        { binding: 4, resource: { buffer: this.gpuTriNormals! } },
        { binding: 5, resource: { buffer: this.gpuSurfAcoustic! } },
        { binding: 6, resource: { buffer: this.gpuReceiverSpheres! } },
        { binding: 7, resource: { buffer: this.gpuRayInputs! } },
        { binding: 8, resource: { buffer: this.gpuRayOutputs! } },
        { binding: 9, resource: { buffer: this.gpuChainBuffer! } },
      ],
    });

    // Dispatch compute
    const workgroups = Math.ceil(rayCount / WORKGROUP_SIZE);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline!);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(workgroups);
    pass.end();

    // Copy outputs to readback
    const outputBytes = rayCount * RAY_OUTPUT_BYTES;
    const chainBytes = rayCount * CHAIN_SLOTS * CHAIN_ENTRY_BYTES;
    encoder.copyBufferToBuffer(this.gpuRayOutputs!, 0, this.gpuReadbackOutput!, 0, outputBytes);
    encoder.copyBufferToBuffer(this.gpuChainBuffer!, 0, this.gpuReadbackChain!, 0, chainBytes);

    this.device.queue.submit([encoder.finish()]);

    // Map readback buffers
    await this.gpuReadbackOutput!.mapAsync(GPUMapMode.READ, 0, outputBytes);
    await this.gpuReadbackChain!.mapAsync(GPUMapMode.READ, 0, chainBytes);

    const outputData = new Float32Array(this.gpuReadbackOutput!.getMappedRange(0, outputBytes).slice(0));
    const chainData = new Float32Array(this.gpuReadbackChain!.getMappedRange(0, chainBytes).slice(0));

    this.gpuReadbackOutput!.unmap();
    this.gpuReadbackChain!.unmap();

    // Split each ray's chain into its own path and its arrivals
    return this.parseResults(outputData, chainData, rayInputs, rayCount, numBands);
  }

  private parseResults(
    outputData: Float32Array,
    chainData: Float32Array,
    rayInputs: Float32Array,
    rayCount: number,
    numBands: number,
  ): GpuRayResult[] {
    // Returns a fixed-length array (1:1 with input rays) so callers can
    // map each result back to the correct source by index.
    const results: GpuRayResult[] = new Array(rayCount);
    const scene = this.sceneBuf!;

    for (let r = 0; r < rayCount; r++) {
      const outOff = r * RAY_OUTPUT_FLOATS;
      const outU32 = new Uint32Array(outputData.buffer, outOff * 4, RAY_OUTPUT_FLOATS);
      const chainLength = outU32[0];

      const finalBandEnergy: BandEnergy = [];
      for (let b = 0; b < numBands; b++) {
        finalBandEnergy.push(outputData[outOff + 8 + b]);
      }

      // Parse chain entries: wall bounces and receiver crossings, in order.
      const chain: Chain[] = [];
      const isReceiver: boolean[] = [];
      const chainBase = r * CHAIN_SLOTS;
      for (let c = 0; c < chainLength; c++) {
        const cOff = (chainBase + c) * CHAIN_ENTRY_FLOATS;
        const cU32 = new Uint32Array(chainData.buffer, cOff * 4, CHAIN_ENTRY_FLOATS);

        const px = chainData[cOff];
        const py = chainData[cOff + 1];
        const pz = chainData[cOff + 2];
        const distance = chainData[cOff + 3];
        const surfaceIndex = cU32[4];
        const angle = chainData[cOff + 6];
        const energy = chainData[cOff + 7];

        const bandEnergy: BandEnergy = [];
        for (let b = 0; b < numBands; b++) {
          bandEnergy.push(chainData[cOff + 8 + b]);
        }

        // Map surface/receiver index back to UUID
        let objectUuid: string;
        if (surfaceIndex >= scene.surfaceCount) {
          // Receiver
          const recIdx = surfaceIndex - scene.surfaceCount;
          objectUuid = scene.receiverUuidMap[recIdx] ?? '';
          isReceiver.push(true);
        } else {
          objectUuid = scene.surfaceUuidMap[surfaceIndex] ?? '';
          isReceiver.push(false);
        }

        chain.push({
          point: [px, py, pz],
          distance,
          object: objectUuid,
          faceNormal: [0, 0, 0],
          faceIndex: -1,
          faceMaterialIndex: -1,
          angle,
          energy,
          bandEnergy,
        });
      }

      // Read source data from ray input
      const inOff = r * RAY_INPUT_FLOATS;
      const origin: [number, number, number] = [rayInputs[inOff], rayInputs[inOff + 1], rayInputs[inOff + 2]];
      const initialPhi = rayInputs[inOff + 6];
      const initialTheta = rayInputs[inOff + 7];

      results[r] = splitRayChain(chain, isReceiver, origin, finalBandEnergy, initialPhi, initialTheta);
    }

    return results;
  }

  dispose(): void {
    const buffers = [
      this.gpuBvhNodes, this.gpuTriVerts, this.gpuTriSurfIdx,
      this.gpuTriNormals, this.gpuSurfAcoustic, this.gpuReceiverSpheres,
      this.gpuRayInputs, this.gpuRayOutputs, this.gpuChainBuffer,
      this.gpuParams, this.gpuReadbackOutput, this.gpuReadbackChain,
    ];
    for (const buf of buffers) {
      if (buf) buf.destroy();
    }
    this.gpuBvhNodes = null;
    this.gpuTriVerts = null;
    this.gpuTriSurfIdx = null;
    this.gpuTriNormals = null;
    this.gpuSurfAcoustic = null;
    this.gpuReceiverSpheres = null;
    this.gpuRayInputs = null;
    this.gpuRayOutputs = null;
    this.gpuChainBuffer = null;
    this.gpuParams = null;
    this.gpuReadbackOutput = null;
    this.gpuReadbackChain = null;
    this.pipeline = null;
    this.bindGroupLayout = null;
    this.device = null;
    this.sceneBuf = null;
    this.config = null;
  }

  private createStorageBuffer(data: Float32Array | Uint32Array): GPUBuffer {
    // Ensure minimum size of 16 bytes
    const size = Math.max(data.byteLength, 16);
    const buffer = this.device!.createBuffer({
      size,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    this.device!.queue.writeBuffer(
      buffer, 0,
      data.buffer as ArrayBuffer, data.byteOffset, data.byteLength,
    );
    return buffer;
  }
}
