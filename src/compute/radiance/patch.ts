import { Vector3, Triangle, BufferGeometry } from 'three';
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

/**
 * Tessellates all room surfaces into patches and builds a BVH for ray intersection.
 */
export function buildPatchesFromRoom(room: Room, maxEdgeLength: number): PatchSet {
  const surfaces = room.allSurfaces as Surface[];
  const patches: Patch[] = [];
  const allTriangleVertices: number[][] = [];
  const triangleToPatch: number[] = [];

  const tessellator = new TessellateModifier(maxEdgeLength, 6);

  for (let si = 0; si < surfaces.length; si++) {
    const surface = surfaces[si];
    const geom = surface.geometry.clone();

    // Tessellate the surface geometry
    const tessellated = tessellator.modify(geom);
    const posAttr = tessellated.getAttribute('position');
    const posArray = posAttr.array as Float32Array;
    const triCount = posArray.length / 9;

    for (let t = 0; t < triCount; t++) {
      const offset = t * 9;
      // Vertices in local space
      const vA = new Vector3(posArray[offset], posArray[offset + 1], posArray[offset + 2]);
      const vB = new Vector3(posArray[offset + 3], posArray[offset + 4], posArray[offset + 5]);
      const vC = new Vector3(posArray[offset + 6], posArray[offset + 7], posArray[offset + 8]);

      // Transform to world space
      const wA = surface.localToWorld(vA.clone());
      const wB = surface.localToWorld(vB.clone());
      const wC = surface.localToWorld(vC.clone());

      const tri = new Triangle(wA, wB, wC);
      const area = tri.getArea();
      if (area < 1e-10) continue; // Skip degenerate triangles

      const centroid = new Vector3();
      tri.getMidpoint(centroid);

      const normal = new Vector3();
      tri.getNormal(normal);

      const patchIndex = patches.length;

      patches.push({
        index: patchIndex,
        centroid,
        normal,
        area,
        vertices: [wA, wB, wC],
        surfaceIndex: si,
        absorption: surface.absorptionFunction,
        scattering: surface.scatteringFunction || (() => surface.scatteringCoefficient),
      });

      // Store flat vertex array for BVH builder
      allTriangleVertices.push([
        wA.x, wA.y, wA.z,
        wB.x, wB.y, wB.z,
        wC.x, wC.y, wC.z,
      ]);
      triangleToPatch.push(patchIndex);
    }
  }

  // Build BVH from all patch triangles
  const flatArray = new Float32Array(allTriangleVertices.length * 9);
  for (let i = 0; i < allTriangleVertices.length; i++) {
    for (let j = 0; j < 9; j++) {
      flatArray[i * 9 + j] = allTriangleVertices[i][j];
    }
  }
  const bvh = BVHBuilder(flatArray);

  return { patches, bvh, triangleToPatch };
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
