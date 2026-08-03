import { QuickEstimateStepResult } from './quick-estimate-types';
import * as THREE from "three";
/**
 * Shoot one random ray from sourcePosition, bounce until 60dB decay,
 * and return per-band RT60 estimates.
 *
 * This is the core logic extracted from RayTracer.quickEstimateStep(),
 * shared between RayTracer and BeamTraceSolver.
 */
export declare function quickEstimateStep(raycaster: THREE.Raycaster, intersectableObjects: THREE.Object3D[], sourcePosition: THREE.Vector3, initialIntensity: number, frequencies: number[], temperature: number, maxOrder?: number): QuickEstimateStepResult;
