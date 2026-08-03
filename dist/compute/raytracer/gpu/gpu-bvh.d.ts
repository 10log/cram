import { default as Room } from '../../../objects/room';
export interface GpuSceneBuffers {
    /** Linearised BVH nodes — 8 floats each (see flattenBvh). */
    bvhNodes: Float32Array;
    /** Triangle vertices — 9 floats per triangle (3 verts × xyz). */
    triangleVertices: Float32Array;
    /** Maps triangle index → surface index. */
    triangleSurfaceIndex: Uint32Array;
    /** Per-triangle face normal (3 floats). */
    triangleNormals: Float32Array;
    /**
     * Per-surface acoustic data at each frequency band.
     * Layout: surfaceCount × numFreqs × 2 (absorption, scattering).
     */
    surfaceAcousticData: Float32Array;
    /** Receiver spheres — 4 floats each (x, y, z, radius). */
    receiverSpheres: Float32Array;
    triangleCount: number;
    nodeCount: number;
    surfaceCount: number;
    receiverCount: number;
    /** surface index → surface UUID */
    surfaceUuidMap: string[];
    /** receiver index → receiver UUID */
    receiverUuidMap: string[];
}
/**
 * Build all GPU buffers for the given room geometry.
 *
 * @param room         The Room object containing surfaces.
 * @param receiverIDs  UUIDs of receivers that should be checked for intersection.
 * @param frequencies  Octave-band center frequencies.
 */
export declare function buildGpuSceneBuffers(room: Room, receiverIDs: string[], frequencies: number[]): GpuSceneBuffers;
