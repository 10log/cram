import { default as Room } from '../../../objects/room';
import { RayPath } from '../types';
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
    traceBatch(rayInputs: Float32Array, rayCount: number, batchSeed: number): Promise<(RayPath | null)[]>;
    private parseResults;
    dispose(): void;
    private createStorageBuffer;
}
