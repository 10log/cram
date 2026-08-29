import { Vector3, Triangle } from 'three';
import { TessellateModifier } from './TessellateModifier';
import Room from '../../objects/room';
import Surface from '../../objects/surface';
import { BVH } from '../raytracer/bvh/BVH';
import { BVHBuilder } from '../raytracer/bvh/BVHBuilder';

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
export function faceInterior(normal: Vector3, patchCentroid: Vector3, interiorPoint: Vector3): void {
  const toInterior = interiorPoint.clone().sub(patchCentroid);
  if (normal.dot(toInterior) < 0) normal.negate();
}

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
export function buildPatchesFromTriangles(
  triangles: TriangleInput[],
  interiorPoint?: Vector3,
): PatchSet {
  const patches: Patch[] = [];
  const allTriangleVertices: number[][] = [];
  const triangleToPatch: number[] = [];

  for (const triIn of triangles) {
    const tri = new Triangle(triIn.a, triIn.b, triIn.c);
    const area = tri.getArea();
    if (area < 1e-10) continue;
    const centroid = new Vector3();
    tri.getMidpoint(centroid);
    const normal = new Vector3();
    tri.getNormal(normal);
    if (interiorPoint) faceInterior(normal, centroid, interiorPoint);

    const patchIndex = patches.length;
    patches.push({
      index: patchIndex,
      centroid,
      normal,
      area,
      vertices: [triIn.a, triIn.b, triIn.c],
      surfaceIndex: triIn.surfaceIndex ?? 0,
      absorption: triIn.absorption ?? (() => 0),
      scattering: triIn.scattering ?? (() => 1),
    });
    allTriangleVertices.push([
      triIn.a.x, triIn.a.y, triIn.a.z,
      triIn.b.x, triIn.b.y, triIn.b.z,
      triIn.c.x, triIn.c.y, triIn.c.z,
    ]);
    triangleToPatch.push(patchIndex);
  }

  const flatArray = new Float32Array(allTriangleVertices.length * 9);
  for (let i = 0; i < allTriangleVertices.length; i++) {
    for (let j = 0; j < 9; j++) {
      flatArray[i * 9 + j] = allTriangleVertices[i][j];
    }
  }
  return { patches, bvh: BVHBuilder(flatArray), triangleToPatch };
}

/**
 * Tessellates all room surfaces into patches and builds a BVH for ray intersection.
 */
export function buildPatchesFromRoom(room: Room, maxEdgeLength: number): PatchSet {
  const surfaces = room.allSurfaces as Surface[];
  const triangles: TriangleInput[] = [];
  const tessellator = new TessellateModifier(maxEdgeLength, 6);
  const bounds = new Vector3();
  let boundCount = 0;

  for (let si = 0; si < surfaces.length; si++) {
    const surface = surfaces[si];
    const geom = surface.geometry.clone();
    const tessellated = tessellator.modify(geom);
    const posArray = (tessellated.getAttribute("position").array as Float32Array);
    const triCount = posArray.length / 9;

    for (let t = 0; t < triCount; t++) {
      const offset = t * 9;
      const vA = new Vector3(posArray[offset], posArray[offset + 1], posArray[offset + 2]);
      const vB = new Vector3(posArray[offset + 3], posArray[offset + 4], posArray[offset + 5]);
      const vC = new Vector3(posArray[offset + 6], posArray[offset + 7], posArray[offset + 8]);
      const wA = surface.localToWorld(vA.clone());
      const wB = surface.localToWorld(vB.clone());
      const wC = surface.localToWorld(vC.clone());
      triangles.push({
        a: wA,
        b: wB,
        c: wC,
        surfaceIndex: si,
        absorption: surface.absorptionFunction,
        scattering: surface.scatteringFunction || (() => surface.scatteringCoefficient),
      });
      bounds.add(wA).add(wB).add(wC);
      boundCount += 3;
    }
  }

  const interior = boundCount > 0 ? bounds.multiplyScalar(1 / boundCount) : new Vector3();
  return buildPatchesFromTriangles(triangles, interior);
}

/**
 * Sample a random point on a triangle using barycentric coordinates.
 */
export function samplePointOnPatch(patch: Patch): Vector3 {
  let u = Math.random();
  let v = Math.random();
  if (u + v > 1) {
    u = 1 - u;
    v = 1 - v;
  }
  const w = 1 - u - v;
  return new Vector3(
    patch.vertices[0].x * u + patch.vertices[1].x * v + patch.vertices[2].x * w,
    patch.vertices[0].y * u + patch.vertices[1].y * v + patch.vertices[2].y * w,
    patch.vertices[0].z * u + patch.vertices[1].z * v + patch.vertices[2].z * w,
  );
}
