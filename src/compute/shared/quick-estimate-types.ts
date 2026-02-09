import * as THREE from "three";

/** Maximum reflection order for quick estimate calculations */
export const QUICK_ESTIMATE_MAX_ORDER = 1000;

/** Intensity ratio corresponding to 60 dB decay (10^6) */
export const RT60_DECAY_RATIO = 1e6;

export interface QuickEstimateStepResult {
  rt60s: number[];
  angle: number;
  direction: THREE.Vector3;
  lastIntersection: THREE.Intersection;
  distance: number;
}
