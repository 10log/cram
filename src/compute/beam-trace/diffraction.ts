import * as THREE from "three";
import Source from "../../objects/source";
import Receiver from "../../objects/receiver";
import Surface from "../../objects/surface";
import Room from "../../objects/room";
import { lookingBackArrivalDirection } from "../../common/arrival-direction";
import { buildEdgeGraph, findDiffractionPaths } from "../shared/diffraction";
import type { EdgeGraph } from "../shared/diffraction";
import { directivityBandEnergy } from "./arrival-pressure";
import type { BeamTracePath } from "./paths";

export interface DiffractionComputeParams {
  room: Room;
  sourceId: string;
  receiverId: string;
  frequencies: number[];
  speedOfSound: number;
  temperature: number;
  containers: Record<string, unknown>;
  raycaster: THREE.Raycaster;
}

export interface DiffractionComputeResult {
  paths: BeamTracePath[];
  edgeGraph: EdgeGraph;
}

/**
 * First-order UTD edge diffraction paths for the active source/receiver pair.
 * Directivity is folded into bandEnergy here so calculateArrivalPressure
 * does not re-apply it on the diffraction branch.
 */
export function computeDiffractionPaths(params: DiffractionComputeParams): DiffractionComputeResult {
  const {
    room,
    sourceId,
    receiverId,
    frequencies,
    speedOfSound,
    temperature,
    containers,
    raycaster,
  } = params;

  const edgeGraph = buildEdgeGraph(room.allSurfaces);
  if (edgeGraph.edges.length === 0) {
    return { paths: [], edgeGraph };
  }

  const sourcePositions = new Map<string, [number, number, number]>();
  const sourceDirectivity = new Map<string, {
    handler: Source["directivityHandler"];
    refPressures: number[];
    quaternion: THREE.Quaternion;
  }>();

  const src = containers[sourceId] as Source | undefined;
  if (src) {
    sourcePositions.set(sourceId, [src.position.x, src.position.y, src.position.z]);
    const dh = src.directivityHandler;
    if (dh) {
      const refPressures = new Array(frequencies.length);
      for (let f = 0; f < frequencies.length; f++) {
        refPressures[f] = dh.getPressureAtPosition(0, frequencies[f], 0, 0) as number;
      }
      sourceDirectivity.set(sourceId, { handler: dh, refPressures, quaternion: src.quaternion.clone() });
    }
  }

  const receiverPositions = new Map<string, [number, number, number]>();
  const rec = containers[receiverId] as Receiver | undefined;
  if (rec) {
    receiverPositions.set(receiverId, [rec.position.x, rec.position.y, rec.position.z]);
  }

  const surfaces: THREE.Mesh[] = [];
  room.surfaces.traverse((container) => {
    if (container["kind"] && container["kind"] === "surface") {
      surfaces.push((container as Surface).mesh);
    }
  });

  const diffractionPaths = findDiffractionPaths(
    edgeGraph,
    sourcePositions,
    receiverPositions,
    frequencies,
    speedOfSound,
    temperature,
    raycaster,
    surfaces,
  );

  const paths: BeamTracePath[] = [];

  for (const dp of diffractionPaths) {
    const srcDir = sourceDirectivity.get(dp.sourceId);
    if (srcDir) {
      const srcPos = sourcePositions.get(dp.sourceId)!;
      const worldDir = new THREE.Vector3(
        dp.diffractionPoint[0] - srcPos[0],
        dp.diffractionPoint[1] - srcPos[1],
        dp.diffractionPoint[2] - srcPos[2],
      );
      const scale = directivityBandEnergy(
        srcDir.handler, srcDir.refPressures, srcDir.quaternion, worldDir, frequencies,
      );
      for (let f = 0; f < frequencies.length; f++) {
        dp.bandEnergy[f] *= scale[f];
      }
    }

    const recPos = receiverPositions.get(dp.receiverId)!;
    const diffPt = {
      x: dp.diffractionPoint[0],
      y: dp.diffractionPoint[1],
      z: dp.diffractionPoint[2],
    };
    const recPt = { x: recPos[0], y: recPos[1], z: recPos[2] };
    const [adx, ady, adz] = lookingBackArrivalDirection(recPt, diffPt);
    const arrivalDir = new THREE.Vector3(adx, ady, adz);

    const srcPos = sourcePositions.get(dp.sourceId)!;
    const receiverVec = new THREE.Vector3(recPos[0], recPos[1], recPos[2]);
    const diffPtVec = new THREE.Vector3(dp.diffractionPoint[0], dp.diffractionPoint[1], dp.diffractionPoint[2]);
    const sourceVec = new THREE.Vector3(srcPos[0], srcPos[1], srcPos[2]);

    paths.push({
      points: [receiverVec, diffPtVec, sourceVec],
      order: 0,
      length: dp.totalDistance,
      arrivalTime: dp.time,
      polygonIds: [null, null, null],
      arrivalDirection: arrivalDir,
      reflections: [],
      bandEnergy: dp.bandEnergy,
    });
  }

  return { paths, edgeGraph };
}
