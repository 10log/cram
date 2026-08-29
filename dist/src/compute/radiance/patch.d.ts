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
/** Flip `normal` so it points toward `interiorPoint`. */
export declare function faceInterior(normal: Vector3, patchCentroid: Vector3, interiorPoint: Vector3): void;
export interface TriangleInput {
    a: Vector3;
    b: Vector3;
    c: Vector3;
    absorption?: (freq: number) => number;
    scattering?: (freq: number) => number;
    surfaceIndex?: number;
}
/**
 * Build a PatchSet from world-space triangles. Used by tests and by
 * `buildPatchesFromRoom`. Normals face `interiorPoint` when given.
 */
export declare function buildPatchesFromTriangles(triangles: TriangleInput[], interiorPoint?: Vector3): PatchSet;
/**
 * Tessellates all room surfaces into patches and builds a BVH for ray intersection.
 */
export declare function buildPatchesFromRoom(room: Room, maxEdgeLength: number): PatchSet;
/**
 * Sample a random point on a triangle using barycentric coordinates.
 */
export declare function samplePointOnPatch(patch: Patch): Vector3;
