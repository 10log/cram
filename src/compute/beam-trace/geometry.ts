import * as THREE from "three";
import { Polygon3D } from "beam-trace";
import type { Vector3 as BT_Vector3 } from "beam-trace";
import Room from "../../objects/room";
import Surface from "../../objects/surface";
import Source from "../../objects/source";
import { beamTreeSignature } from "./tree-signature";

export function surfaceToPolygons(surface: Surface): Polygon3D[] {
  const polygons: Polygon3D[] = [];
  const geometry = surface.geometry;
  const posAttr = geometry.getAttribute("position");
  if (!posAttr) return polygons;

  surface.updateMatrixWorld(true);
  const worldMatrix = surface.matrixWorld;
  const indices = geometry.getIndex();
  const positions = posAttr.array;

  const processTriangle = (i0: number, i1: number, i2: number) => {
    const v0 = new THREE.Vector3(
      positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2],
    ).applyMatrix4(worldMatrix);
    const v1 = new THREE.Vector3(
      positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2],
    ).applyMatrix4(worldMatrix);
    const v2 = new THREE.Vector3(
      positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2],
    ).applyMatrix4(worldMatrix);

    const vertices: BT_Vector3[] = [
      [v0.x, v0.y, v0.z],
      [v1.x, v1.y, v1.z],
      [v2.x, v2.y, v2.z],
    ];
    polygons.push(Polygon3D.create(vertices));
  };

  if (indices) {
    const indexArray = indices.array;
    for (let i = 0; i < indexArray.length; i += 3) {
      processTriangle(indexArray[i], indexArray[i + 1], indexArray[i + 2]);
    }
  } else {
    const numVertices = posAttr.count;
    for (let i = 0; i < numVertices; i += 3) {
      processTriangle(i, i + 1, i + 2);
    }
  }

  return polygons;
}

export function extractPolygons(room: Room | undefined): {
  polygons: Polygon3D[];
  surfaceToPolygonIndex: Map<string, number[]>;
  polygonToSurface: Map<number, Surface>;
} {
  const polygons: Polygon3D[] = [];
  const surfaceToPolygonIndex = new Map<string, number[]>();
  const polygonToSurface = new Map<number, Surface>();
  if (!room) return { polygons, surfaceToPolygonIndex, polygonToSurface };

  room.allSurfaces.forEach((surface: Surface) => {
    const surfacePolygons = surfaceToPolygons(surface);
    const startIndex = polygons.length;
    surfacePolygons.forEach((poly, i) => {
      polygonToSurface.set(startIndex + i, surface);
      polygons.push(poly);
    });
    surfaceToPolygonIndex.set(
      surface.uuid,
      surfacePolygons.map((_, i) => startIndex + i),
    );
  });

  return { polygons, surfaceToPolygonIndex, polygonToSurface };
}

export function currentTreeSignature(params: {
  source: Source | undefined;
  room: Room | undefined;
  roomID: string;
  maxOrder: number;
}): string | null {
  const { source, room, roomID, maxOrder } = params;
  if (!source || !room) return null;
  const surfaces = room.allSurfaces as Surface[];
  const surfaceWorlds: number[] = [];
  for (const surface of surfaces) {
    surface.updateMatrixWorld(true);
    const e = surface.matrixWorld.elements;
    for (let i = 0; i < 16; i++) surfaceWorlds.push(e[i]);
  }
  return beamTreeSignature({
    sourceId: source.uuid,
    sourceX: source.position.x,
    sourceY: source.position.y,
    sourceZ: source.position.z,
    roomID,
    maxOrder,
    surfaceCount: surfaces.length,
    surfaceWorlds,
  });
}
