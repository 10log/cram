import * as THREE from "three";
import Source from "../../objects/source";
import Room from "../../objects/room";
import { emit } from "../../messenger";
import { quickEstimateStep as sharedQuickEstimateStep } from "../shared/quick-estimate";
import type { QuickEstimateStepResult } from "../shared/quick-estimate-types";

export interface QuickEstimateHost {
  uuid: string;
  sourceIDs: string[];
  frequencies: number[];
  temperature: number;
  room: Room | undefined;
  _raycaster: THREE.Raycaster;
  _quickEstimateInterval: number | null;
  quickEstimateResults: QuickEstimateStepResult[];
  estimatedT30: number[] | null;
}

export function startQuickEstimate(
  host: QuickEstimateHost,
  source: Source | undefined,
  numRays: number = 500,
) {
  if (host._quickEstimateInterval !== null) {
    window.clearInterval(host._quickEstimateInterval);
    host._quickEstimateInterval = null;
  }
  if (!source || !host.room) return;

  const surfaceMeshes: THREE.Object3D[] = [];
  host.room.surfaces.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) surfaceMeshes.push(child);
  });
  if (surfaceMeshes.length === 0) return;

  host.quickEstimateResults = [];
  host.estimatedT30 = null;
  let count = 0;
  const batchSize = 10;

  host._quickEstimateInterval = window.setInterval(() => {
    for (let i = 0; i < batchSize && count < numRays; i++, count++) {
      host.quickEstimateResults.push(sharedQuickEstimateStep(
        host._raycaster, surfaceMeshes,
        source.position, source.initialIntensity,
        host.frequencies, host.temperature,
      ));
    }
    if (count >= numRays) {
      window.clearInterval(host._quickEstimateInterval!);
      host._quickEstimateInterval = null;
      const numBands = host.frequencies.length;
      const avgRt60s = Array(numBands).fill(0);
      const validCounts = Array(numBands).fill(0);
      for (const r of host.quickEstimateResults) {
        for (let f = 0; f < numBands; f++) {
          if (r.rt60s[f] > 0) {
            avgRt60s[f] += r.rt60s[f];
            validCounts[f]++;
          }
        }
      }
      for (let f = 0; f < numBands; f++) {
        avgRt60s[f] = validCounts[f] > 0 ? avgRt60s[f] / validCounts[f] : 0;
      }
      host.estimatedT30 = avgRt60s;
      emit("BEAMTRACE_QUICK_ESTIMATE_COMPLETE", host.uuid);
    }
  }, 5);
}
