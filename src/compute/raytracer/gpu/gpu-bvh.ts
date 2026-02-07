/**
 * Merges all surface geometries into flat GPU-friendly typed-array buffers and
 * builds a linearised BVH suitable for iterative traversal in WGSL.
 */
import * as THREE from 'three';
import Room from '../../../objects/room';
import Surface from '../../../objects/surface';
import Receiver from '../../../objects/receiver';
import { useContainer } from '../../../store';

// ── Types ────────────────────────────────────────────────────────────

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

// ── Internal BVH node (tree form, then linearised) ───────────────────

interface BvhNode {
  boundsMin: [number, number, number];
  boundsMax: [number, number, number];
  // Leaf: triStart/triCount; Internal: left/right child index after flattening
  left: BvhNode | null;
  right: BvhNode | null;
  triStart: number;
  triCount: number;
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Build all GPU buffers for the given room geometry.
 *
 * @param room         The Room object containing surfaces.
 * @param receiverIDs  UUIDs of receivers that should be checked for intersection.
 * @param frequencies  Octave-band center frequencies.
 */
export function buildGpuSceneBuffers(
  room: Room,
  receiverIDs: string[],
  frequencies: number[],
): GpuSceneBuffers {
  const surfaces = room.allSurfaces as Surface[];
  const containers = useContainer.getState().containers;

  // ── 1. Merge triangles from all surfaces ────────────────────────

  const surfaceUuidMap: string[] = [];
  const allVerts: number[] = [];
  const allNormals: number[] = [];
  const allSurfIdx: number[] = [];

  for (let si = 0; si < surfaces.length; si++) {
    const surface = surfaces[si];
    surfaceUuidMap.push(surface.uuid);

    const mesh = surface.mesh;
    const geo = mesh.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const indexAttr = geo.getIndex();

    // Ensure matrixWorld is up to date
    mesh.updateMatrixWorld(true);
    const mat = mesh.matrixWorld;

    if (indexAttr) {
      // Indexed geometry
      for (let i = 0; i < indexAttr.count; i += 3) {
        for (let v = 0; v < 3; v++) {
          const idx = indexAttr.getX(i + v);
          const vert = new THREE.Vector3(
            posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx)
          ).applyMatrix4(mat);
          allVerts.push(vert.x, vert.y, vert.z);
        }
        // Compute face normal from the 3 world-space vertices
        const base = allVerts.length - 9;
        const n = computeFaceNormal(
          allVerts[base], allVerts[base + 1], allVerts[base + 2],
          allVerts[base + 3], allVerts[base + 4], allVerts[base + 5],
          allVerts[base + 6], allVerts[base + 7], allVerts[base + 8],
        );
        allNormals.push(n[0], n[1], n[2]);
        allSurfIdx.push(si);
      }
    } else {
      // Non-indexed geometry
      for (let i = 0; i < posAttr.count; i += 3) {
        for (let v = 0; v < 3; v++) {
          const vert = new THREE.Vector3(
            posAttr.getX(i + v), posAttr.getY(i + v), posAttr.getZ(i + v)
          ).applyMatrix4(mat);
          allVerts.push(vert.x, vert.y, vert.z);
        }
        const base = allVerts.length - 9;
        const n = computeFaceNormal(
          allVerts[base], allVerts[base + 1], allVerts[base + 2],
          allVerts[base + 3], allVerts[base + 4], allVerts[base + 5],
          allVerts[base + 6], allVerts[base + 7], allVerts[base + 8],
        );
        allNormals.push(n[0], n[1], n[2]);
        allSurfIdx.push(si);
      }
    }
  }

  const triangleCount = allSurfIdx.length;
  const triangleVertices = new Float32Array(allVerts);
  const triangleNormals = new Float32Array(allNormals);
  const triangleSurfaceIndex = new Uint32Array(allSurfIdx);

  // ── 2. Build BVH ──────────────────────────────────────────────────

  // Centroid array for SAH-like median split
  const centroids = new Float32Array(triangleCount * 3);
  for (let t = 0; t < triangleCount; t++) {
    const b = t * 9;
    centroids[t * 3] = (triangleVertices[b] + triangleVertices[b + 3] + triangleVertices[b + 6]) / 3;
    centroids[t * 3 + 1] = (triangleVertices[b + 1] + triangleVertices[b + 4] + triangleVertices[b + 7]) / 3;
    centroids[t * 3 + 2] = (triangleVertices[b + 2] + triangleVertices[b + 5] + triangleVertices[b + 8]) / 3;
  }

  // Indices array — we reorder this but keep original buffers; the BVH
  // references triangles via these indices which map to the *original* arrays.
  const indices = new Uint32Array(triangleCount);
  for (let i = 0; i < triangleCount; i++) indices[i] = i;

  const root = buildBvhNode(triangleVertices, centroids, indices, 0, triangleCount, 0);

  // After building the BVH, reorder the triangle data according to the index
  // ordering so that leaves reference contiguous spans in the arrays.
  const reorderedVerts = new Float32Array(triangleCount * 9);
  const reorderedNormals = new Float32Array(triangleCount * 3);
  const reorderedSurfIdx = new Uint32Array(triangleCount);
  for (let i = 0; i < triangleCount; i++) {
    const src = indices[i];
    reorderedVerts.set(triangleVertices.subarray(src * 9, src * 9 + 9), i * 9);
    reorderedNormals.set(triangleNormals.subarray(src * 3, src * 3 + 3), i * 3);
    reorderedSurfIdx[i] = triangleSurfaceIndex[src];
  }

  // Flatten BVH to linear array
  const { nodeArray, nodeCount } = flattenBvh(root);

  // ── 3. Surface acoustic data ──────────────────────────────────────

  const numFreqs = frequencies.length;
  const surfaceAcousticData = new Float32Array(surfaces.length * numFreqs * 2);
  for (let si = 0; si < surfaces.length; si++) {
    const surface = surfaces[si];
    for (let fi = 0; fi < numFreqs; fi++) {
      const offset = (si * numFreqs + fi) * 2;
      surfaceAcousticData[offset] = surface.absorptionFunction(frequencies[fi]);
      surfaceAcousticData[offset + 1] = surface.scatteringFunction(frequencies[fi]);
    }
  }

  // ── 4. Receiver spheres ───────────────────────────────────────────

  const receiverUuidMap: string[] = [];
  const receiverData: number[] = [];
  for (const id of receiverIDs) {
    const rec = containers[id] as Receiver | undefined;
    if (rec) {
      receiverUuidMap.push(id);
      receiverData.push(rec.position.x, rec.position.y, rec.position.z, 0.1);
    }
  }

  return {
    bvhNodes: nodeArray,
    triangleVertices: reorderedVerts,
    triangleSurfaceIndex: reorderedSurfIdx,
    triangleNormals: reorderedNormals,
    surfaceAcousticData,
    receiverSpheres: new Float32Array(receiverData),
    triangleCount,
    nodeCount,
    surfaceCount: surfaces.length,
    receiverCount: receiverUuidMap.length,
    surfaceUuidMap,
    receiverUuidMap,
  };
}

// ── BVH construction (recursive midpoint split on longest axis) ──────

const MAX_LEAF_TRIS = 8;
const MAX_DEPTH = 64;

function buildBvhNode(
  verts: Float32Array,
  centroids: Float32Array,
  indices: Uint32Array,
  start: number,
  end: number,
  depth: number,
): BvhNode {
  // Compute bounds over [start, end)
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = start; i < end; i++) {
    const ti = indices[i];
    for (let v = 0; v < 3; v++) {
      const b = ti * 9 + v * 3;
      const x = verts[b], y = verts[b + 1], z = verts[b + 2];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
  }

  const count = end - start;
  if (count <= MAX_LEAF_TRIS || depth >= MAX_DEPTH) {
    return { boundsMin: [minX, minY, minZ], boundsMax: [maxX, maxY, maxZ], left: null, right: null, triStart: start, triCount: count };
  }

  // Split along the longest axis at centroid midpoint
  const dx = maxX - minX, dy = maxY - minY, dz = maxZ - minZ;
  const axis = dx >= dy && dx >= dz ? 0 : (dy >= dz ? 1 : 2);

  // Find centroid midpoint along this axis
  let centroidMin = Infinity, centroidMax = -Infinity;
  for (let i = start; i < end; i++) {
    const c = centroids[indices[i] * 3 + axis];
    if (c < centroidMin) centroidMin = c;
    if (c > centroidMax) centroidMax = c;
  }
  const split = (centroidMin + centroidMax) * 0.5;

  // Partition indices around split
  let mid = start;
  for (let i = start; i < end; i++) {
    if (centroids[indices[i] * 3 + axis] < split) {
      // swap indices[i] and indices[mid]
      const tmp = indices[mid];
      indices[mid] = indices[i];
      indices[i] = tmp;
      mid++;
    }
  }

  // Fallback: if all went to one side, split in half
  if (mid === start || mid === end) {
    mid = (start + end) >> 1;
  }

  const left = buildBvhNode(verts, centroids, indices, start, mid, depth + 1);
  const right = buildBvhNode(verts, centroids, indices, mid, end, depth + 1);

  return { boundsMin: [minX, minY, minZ], boundsMax: [maxX, maxY, maxZ], left, right, triStart: -1, triCount: -1 };
}

// ── Flatten BVH into a linear Float32Array ──────────────────────────
//
// Each node occupies 8 floats:
//   [boundsMinX, boundsMinY, boundsMinZ, data0,
//    boundsMaxX, boundsMaxY, boundsMaxZ, data1]
//
// Internal node: data0 = left child index, data1 = right child index
// Leaf node:     data0 = triStart,         data1 = triCount | 0x80000000

function flattenBvh(root: BvhNode): { nodeArray: Float32Array; nodeCount: number } {
  // First pass: count nodes
  let count = 0;
  const stack: BvhNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    count++;
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }

  const nodeArray = new Float32Array(count * 8);
  let nextIndex = 0;

  function write(node: BvhNode): number {
    const myIndex = nextIndex++;
    const off = myIndex * 8;
    nodeArray[off] = node.boundsMin[0];
    nodeArray[off + 1] = node.boundsMin[1];
    nodeArray[off + 2] = node.boundsMin[2];
    nodeArray[off + 4] = node.boundsMax[0];
    nodeArray[off + 5] = node.boundsMax[1];
    nodeArray[off + 6] = node.boundsMax[2];

    if (node.left && node.right) {
      // Internal: reserve slots for children indices, fill after recursion
      const leftIdx = write(node.left);
      const rightIdx = write(node.right);
      // Store as float-encoded u32 (safe for ints up to 2^24)
      nodeArray[off + 3] = leftIdx;
      nodeArray[off + 7] = rightIdx;
    } else {
      // Leaf
      nodeArray[off + 3] = node.triStart;
      // Encode leaf flag in high bit via bitwise-or with 0x80000000
      // We use DataView to write this as a u32 into the f32 slot.
      const u32View = new Uint32Array(nodeArray.buffer, off * 4 + 7 * 4, 1);
      u32View[0] = (node.triCount | 0x80000000) >>> 0;
    }

    return myIndex;
  }

  write(root);

  return { nodeArray, nodeCount: count };
}

// ── Helpers ──────────────────────────────────────────────────────────

function computeFaceNormal(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  cx: number, cy: number, cz: number,
): [number, number, number] {
  const e1x = bx - ax, e1y = by - ay, e1z = bz - az;
  const e2x = cx - ax, e2y = cy - ay, e2z = cz - az;
  let nx = e1y * e2z - e1z * e2y;
  let ny = e1z * e2x - e1x * e2z;
  let nz = e1x * e2y - e1y * e2x;
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
  if (len > 1e-10) { nx /= len; ny /= len; nz /= len; }
  return [nx, ny, nz];
}
