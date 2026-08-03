import { Vector3 } from 'three';
import { default as Room } from '../../objects/room';
import { BVH } from '../raytracer/bvh/BVH';
export interface Patch {
    index: number;
    centroid: Vector3;
    normal: Vector3;
    area: number;
    vertices: [Vector3, Vector3, Vector3];
    surfaceIndex: number;
    absorption: (freq: number) => number;
    scattering: (freq: number) => number;
}
export interface PatchSet {
    patches: Patch[];
    bvh: BVH;
    /** Maps BVH triangle index to patch index */
    triangleToPatch: number[];
}
/**
 * Tessellates all room surfaces into patches and builds a BVH for ray intersection.
 */
export declare function buildPatchesFromRoom(room: Room, maxEdgeLength: number): PatchSet;
/**
 * Sample a random point on a triangle using barycentric coordinates.
 */
export declare function samplePointOnPatch(patch: Patch): Vector3;
