import { default as Room } from '../../../objects/room';
import { RayPath, Chain, BandEnergy } from '../types';
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
export declare function splitRayChain(chain: Chain[], isReceiver: boolean[], origin: [number, number, number], finalBandEnergy: BandEnergy, initialPhi: number, initialTheta: number): GpuRayResult;
export interface GpuRayTracerConfig {
    reflectionOrder: number;
    frequencies: number[];
    cachedAirAtt: number[];
    rrThreshold: number;
}
export declare class GpuRayTracer {
    private device;
    private pipeline;
    private bindGroupLayout;
    private sceneBuf;
    private gpuBvhNodes;
    private gpuTriVerts;
    private gpuTriSurfIdx;
    private gpuTriNormals;
    private gpuSurfAcoustic;
    private gpuReceiverSpheres;
    private gpuRayInputs;
    private gpuRayOutputs;
    private gpuChainBuffer;
    private gpuParams;
    private gpuReadbackOutput;
    private gpuReadbackChain;
    private config;
    private maxBatchSize;
    /** The actual batch size after clamping to device limits. */
    get effectiveBatchSize(): number;
    initialize(room: Room, receiverIDs: string[], config: GpuRayTracerConfig, requestedBatchSize: number): Promise<boolean>;
    traceBatch(rayInputs: Float32Array, rayCount: number, batchSeed: number): Promise<GpuRayResult[]>;
    private parseResults;
    dispose(): void;
    private createStorageBuffer;
}
