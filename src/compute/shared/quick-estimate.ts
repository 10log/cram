import * as THREE from "three";
import * as ac from "../acoustics";
// Type-only, for the same reason `ray-core.ts` is (#201): importing the
// `Surface` *class* pulls the messenger, the container store and `compute/csg`
// — whose modeling bundle top-level-awaits a browser URL — into this module,
// and nothing could then execute `quickEstimateStep` headlessly. The one
// runtime use was an `instanceof` guarding a hit counter, duck-typed below.
import type Surface from "../../objects/surface";
import { SELF_INTERSECTION_OFFSET } from "../raytracer/types";
import { worldHitNormal } from "../raytracer/world-normal";
import type { QuickEstimateStepResult } from "./quick-estimate-types";
import { QUICK_ESTIMATE_MAX_ORDER, RT60_DECAY_RATIO } from "./quick-estimate-types";

/**
 * Shoot one random ray from sourcePosition, bounce until every band has
 * decayed 60 dB, and return per-band RT60 estimates.
 *
 * This is the core logic extracted from RayTracer.quickEstimateStep(),
 * shared between RayTracer and BeamTraceSolver.
 *
 * Energy is lost to two things, and until #217 only one of them was applied
 * here: the surface coefficient at each bounce, and air absorption over each
 * segment. Both full solves apply both, so the estimate was systematically
 * long in the bands where air dominates — and only there, which is why it read
 * as plausible.
 *
 * A band that has not crossed within `maxOrder` bounces reports 0, which the
 * callers drop from their average. Running until the *last* band finishes
 * rather than the first costs nothing in a room where they finish together,
 * and in a room with a very reflective low band it can now run to `maxOrder`
 * where it previously stopped early with that band unreported.
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

  // Scratch for the hit normal, so a bounce allocates nothing and nothing
  // writes back into three's own face-normal object.
  const normal = new THREE.Vector3();

  const intensities = Array(frequencies.length).fill(initialIntensity);

  let iter = 0;

  // Per band, because bands no longer finish together. Before #217 this was a
  // single flag set by the *first* band to cross 60 dB, which also ended the
  // loop — so every slower band returned 0, and the callers drop zeros from
  // their average (`if (r.rt60s[f] > 0)`), leaving those bands blank in the
  // UI. With only surface absorption and one coefficient per band the
  // crossings were near-simultaneous and nothing showed. Air absorption pulls
  // them apart by an order of magnitude, so the two changes here are not
  // separable: adding air without this would blank every band below the top.
  const bandDone = Array(frequencies.length).fill(false) as boolean[];
  let bandsDone = 0;

  let distance = 0;

  // attenuation in dB/m
  const airAttenuationdB = ac.airAttenuation(frequencies, temperature);

  let lastIntersection = {} as THREE.Intersection;

  while (bandsDone < frequencies.length && iter < maxOrder) {
    // set the starting position and direction
    raycaster.ray.set(position, direction);

    // find the surface that the ray intersects
    const intersections = raycaster.intersectObjects(intersectableObjects, true);

    // if there was an intersection
    if (intersections.length > 0) {
      // Find the incident angle, from the *world-space* normal facing this
      // ray. This used raw `face.normal`, which is object-local and unoriented
      // (#213): on a rotated surface it read a head-on hit as 90° grazing, and
      // it reflected about the local normal as well. `worldHitNormal` is the
      // same source the full solve uses, so the estimate and the solve cannot
      // disagree about which way a wall faces.
      const nWorld = worldHitNormal(intersections[0], normal, direction);
      angle = nWorld ? direction.clone().multiplyScalar(-1).angleTo(nWorld) : 0;

      const segment = intersections[0].distance;
      distance += segment;

      const surface = intersections[0].object.parent as Surface;

      // for each frequency
      for (let f = 0; f < frequencies.length; f++) {
        if (bandDone[f]) continue;
        const freq = frequencies[f];
        let coefficient = 1;
        if (surface.kind === 'surface') {
          coefficient = surface.reflectionFunction(freq, angle);
        }
        // Air over the segment just travelled, then the surface. `dB / 10`
        // because these are intensities, matching `ray-core.ts`. Until #217
        // this coefficient was computed and thrown away, so the estimate had
        // no air absorption at all while both full solves did — and air is
        // what actually ends the decay in the top bands: at 8 kHz it alone
        // accounts for 60 dB in 460 m of path, so any room whose 8 kHz
        // estimate exceeded about 1.3 s was reporting a figure air would have
        // capped.
        intensities[f] *= coefficient * Math.pow(10, (-airAttenuationdB[f] * segment) / 10);
        if (initialIntensity / intensities[f] > RT60_DECAY_RATIO) {
          // The decay is read at the end of the segment that crossed, so it is
          // quantized by segment length — as the surface drop always was, and
          // by a comparable amount.
          rt60s[f] = distance / soundSpeed;
          bandDone[f] = true;
          bandsDone += 1;
        }
      }

      // Anything carrying a numeric `numHits` gets it bumped; in a real scene
      // that is exactly the `Surface` instances the `instanceof` used to match.
      const hitParent = intersections[0].object.parent as { numHits?: number } | null;
      if (hitParent && typeof hitParent.numHits === "number") {
        hitParent.numHits += 1;
      }

      // find the reflected direction, about the same normal
      if (nWorld) {
        direction.addScaledVector(nWorld, -2 * direction.dot(nWorld)).normalize();
      }

      // Lift the next origin off the surface, as `ray-core.ts` does. Without
      // it the ray restarts exactly on the plane it just left and, half the
      // time, immediately re-hits the same triangle at zero distance —
      // measured at **299 of 300 bounces** in a shoebox, mean segment 0.005 m
      // against 2.18 m with the offset. Each of those self-hits applies the
      // reflection coefficient again while adding no path length, so the
      // estimate decayed to -60 dB in about a four-hundredth of the distance
      // it should have. That is separate from the normal fix above, but it
      // lives on the same two lines and left the estimate untestable.
      position.copy(intersections[0].point);
      if (nWorld) position.addScaledVector(nWorld, SELF_INTERSECTION_OFFSET);

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
