import * as THREE from "three";
import * as ac from "../acoustics";
import Surface from "../../objects/surface";
import type { QuickEstimateStepResult } from "./quick-estimate-types";
import { QUICK_ESTIMATE_MAX_ORDER, RT60_DECAY_RATIO } from "./quick-estimate-types";

/**
 * Shoot one random ray from sourcePosition, bounce until 60dB decay,
 * and return per-band RT60 estimates.
 *
 * This is the core logic extracted from RayTracer.quickEstimateStep(),
 * shared between RayTracer and BeamTraceSolver.
 */
export function quickEstimateStep(
  raycaster: THREE.Raycaster,
  intersectableObjects: THREE.Object3D[],
  sourcePosition: THREE.Vector3,
  initialIntensity: number,
  frequencies: number[],
  temperature: number,
  maxOrder: number = QUICK_ESTIMATE_MAX_ORDER
): QuickEstimateStepResult {
  const soundSpeed = ac.soundSpeed(temperature);

  const rt60s = Array(frequencies.length).fill(0) as number[];

  // source position
  let position = sourcePosition.clone();

  // random direction (rejection sampling for uniform sphere distribution)
  let dx: number, dy: number, dz: number, lenSq: number;
  do {
    dx = Math.random() * 2 - 1;
    dy = Math.random() * 2 - 1;
    dz = Math.random() * 2 - 1;
    lenSq = dx * dx + dy * dy + dz * dz;
  } while (lenSq > 1 || lenSq < 1e-6);
  let direction = new THREE.Vector3(dx, dy, dz).normalize();

  let angle = 0;

  const intensities = Array(frequencies.length).fill(initialIntensity);

  let iter = 0;

  let doneDecaying = false;

  let distance = 0;

  // attenuation in dB/m
  const airAttenuationdB = ac.airAttenuation(frequencies, temperature);

  let lastIntersection = {} as THREE.Intersection;

  while (!doneDecaying && iter < maxOrder) {
    // set the starting position and direction
    raycaster.ray.set(position, direction);

    // find the surface that the ray intersects
    const intersections = raycaster.intersectObjects(intersectableObjects, true);

    // if there was an intersection
    if (intersections.length > 0) {
      // find the incident angle
      angle = direction.clone().multiplyScalar(-1).angleTo(intersections[0].face!.normal);

      distance += intersections[0].distance;

      const surface = intersections[0].object.parent as Surface;

      // for each frequency
      for (let f = 0; f < frequencies.length; f++) {
        const freq = frequencies[f];
        let coefficient = 1;
        if (surface.kind === 'surface') {
          coefficient = surface.reflectionFunction(freq, angle);
        }
        intensities[f] *= coefficient;
        const freqDoneDecaying = initialIntensity / intensities[f] > RT60_DECAY_RATIO;
        if (freqDoneDecaying) {
          rt60s[f] = distance / soundSpeed;
        }
        doneDecaying = doneDecaying || freqDoneDecaying;
      }

      if (intersections[0].object.parent instanceof Surface) {
        intersections[0].object.parent.numHits += 1;
      }

      // get the normal direction of the intersection
      const normal = intersections[0].face!.normal.normalize();

      // find the reflected direction
      direction.sub(normal.clone().multiplyScalar(direction.dot(normal)).multiplyScalar(2)).normalize();

      position.copy(intersections[0].point);

      lastIntersection = intersections[0];
    }
    iter += 1;
  }

  return {
    distance,
    rt60s,
    angle,
    direction,
    lastIntersection
  };
}
