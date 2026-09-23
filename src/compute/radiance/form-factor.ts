import { Vector3 } from 'three';
import { BRDF } from './brdf';
import { DirectionalResponse } from './directional-response';
import { Response } from './response';
import { PatchSet, samplePointOnPatch } from './patch';

export interface ShootingContext {
  patchSet: PatchSet;
  unshotEnergy: DirectionalResponse[];
  totalEnergy: DirectionalResponse[];
  brdf: BRDF;
  /** Per-patch absorption at the current frequency */
  absorptions: number[];
  /** Per-patch scattering at the current frequency */
  scatterings: number[];
  /** Air absorption coefficient in Nepers/m at the current frequency */
  airAbsNepers: number;
  /** Speed of sound in m/s */
  speedOfSound: number;
  /** Internal sample rate for time discretization */
  sampleRate: number;
  /** Number of rays per shooting iteration */
  raysPerShoot: number;
}

/**
 * Incoming Lambert factor at a hit: max(0, n · −d) for a ray traveling
 * along `rayDir`. Grazing and back-facing patches receive no flux (#120).
 */
export function incomingLambert(normal: Vector3, rayDir: Vector3): number {
  const cos = -normal.dot(rayDir);
  return cos > 0 ? cos : 0;
}

/**
 * Select the patch with the most unshot energy.
 */
export function selectShootingPatch(unshotEnergy: DirectionalResponse[]): number {
  let maxEnergy = -1;
  let maxIdx = 0;
  for (let i = 0; i < unshotEnergy.length; i++) {
    const e = unshotEnergy[i].sum();
    if (e > maxEnergy) {
      maxEnergy = e;
      maxIdx = i;
    }
  }
  return maxIdx;
}

/**
 * Along-normal offset for a ray leaving a patch, in metres.
 *
 * A barycentric sample sits exactly **on** the triangle plane, so a ray leaving
 * it starts coplanar with its own surface, and the other triangles of the same
 * wall sit at distance ~0 from that origin. Issue #120 read that as a leak and
 * #207 repeated it; **measurement refuted it.** `localToWorld` maps every
 * sampled direction into the patch normal's hemisphere, so a ray cannot turn
 * back into its own plane and a coplanar sibling receives exactly 0 either way
 * — with this offset and without it. The measured T30 and its Eyring ratio do
 * not move.
 *
 * It is kept as a guard for the geometry where the hazard is real: a sample
 * near a shared edge with a *non*-coplanar neighbour, which genuinely does sit
 * at ~0 distance and is not protected by the hemisphere argument. A guard, not
 * a fix — see `physics.spec.ts` for the measurement.
 *
 * 1e-4 m: far above the float noise on a room-scale coordinate, far below any
 * geometric feature a room model has.
 */
export const RAY_ORIGIN_EPSILON = 1e-4;

/**
 * Slack in the gather's occlusion test, in metres.
 *
 * A hit counts as blocking only if it is meaningfully nearer than the receiver.
 * This was 1 cm, which #120 called out as a fudge standing in for the missing
 * origin offset — and it could not do that job anyway, since a sibling triangle
 * registers at ~0 distance and 0 < dist − 0.01 for any receiver beyond a
 * centimetre, so the patch read as occluded. With the origin lifted off the
 * plane the slack only has to cover float noise.
 */
export const OCCLUSION_EPSILON = 1e-4;

/**
 * Compute total unshot energy across all patches.
 */
export function totalUnshotEnergy(unshotEnergy: DirectionalResponse[]): number {
  let total = 0;
  for (let i = 0; i < unshotEnergy.length; i++) {
    total += unshotEnergy[i].sum();
  }
  return total;
}

/**
 * Shoot energy from a single patch to all visible patches via ray tracing.
 */
export function shootFromPatch(ctx: ShootingContext, patchIdx: number): void {
  const { patchSet, unshotEnergy, totalEnergy, brdf, airAbsNepers, speedOfSound, sampleRate, raysPerShoot } = ctx;
  const { patches, bvh, triangleToPatch } = patchSet;
  const srcPatch = patches[patchIdx];
  const srcEnergy = unshotEnergy[patchIdx];

  // Distribute rays across BRDF slots proportional to energy
  const slotEnergies: number[] = [];
  let totalSlotEnergy = 0;
  for (let k = 0; k < brdf.nSlots; k++) {
    const e = srcEnergy.responses[k].sum();
    slotEnergies.push(e);
    totalSlotEnergy += e;
  }

  if (totalSlotEnergy < 1e-20) return;

  for (let k = 0; k < brdf.nSlots; k++) {
    if (slotEnergies[k] < 1e-20) continue;

    const fraction = slotEnergies[k] / totalSlotEnergy;
    const nRays = Math.max(1, Math.round(fraction * raysPerShoot));
    const gain = 1.0 / nRays;

    for (let r = 0; r < nRays; r++) {
      // Random point on the source patch, lifted off its own plane. Coplanar
      // siblings are unreachable regardless — see RAY_ORIGIN_EPSILON — so this
      // guards the non-coplanar neighbour at a shared edge.
      const origin = samplePointOnPatch(srcPatch).addScaledVector(
        srcPatch.normal,
        RAY_ORIGIN_EPSILON,
      );

      // Generate ray direction within BRDF slot k
      const localDir = sampleDirectionInSlot(brdf, k);
      const worldDir = localToWorld(localDir, srcPatch.normal);

      // Trace ray through BVH
      const hits = bvh.intersectRay(origin, worldDir, false);
      if (!hits || hits.length === 0) continue;

      // Find the closest hit that isn't the source patch itself
      let closestHit: any = null;
      let closestDist = Infinity;
      for (const hit of hits) {
        const hitPatchIdx = triangleToPatch[hit.triangleIndex];
        if (hitPatchIdx === patchIdx) continue;
        const hitPoint = hit.intersectionPoint;
        const dx = hitPoint.x - origin.x;
        const dy = hitPoint.y - origin.y;
        const dz = hitPoint.z - origin.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < closestDist) {
          closestDist = dist;
          closestHit = hit;
        }
      }

      if (!closestHit || closestDist < 1e-6) continue;

      const rcvPatchIdx = triangleToPatch[closestHit.triangleIndex];
      const rcvPatch = patches[rcvPatchIdx];
      // Orientation gate only, never a scale factor. A ray that arrives on the
      // back of a patch is a geometry miss and is dropped; one that arrives on
      // the front delivers all the energy it carries. Scaling the deposit by
      // this cosine is what issue #205 was: see the note above `depositGain`.
      if (incomingLambert(rcvPatch.normal, worldDir) <= 0) continue;

      // Propagation delay in samples
      const delaySamples = (closestDist / speedOfSound) * sampleRate;

      // Air absorption attenuation
      const airAtten = Math.exp(-airAbsNepers * closestDist);

      // Compute incoming direction at receiver using ray direction (not centroid)
      const incomingSlot = brdf.getDirectionIndex(worldDir.clone().negate(), rcvPatch.normal);

      // Get outgoing weights from receiver's BRDF
      // Recompute BRDF coefficients for receiver patch material
      const rcvAbsorption = ctx.absorptions[rcvPatchIdx];
      const rcvScattering = ctx.scatterings[rcvPatchIdx];
      brdf.computeCoefficients(rcvAbsorption, rcvScattering);
      const outgoingWeights = brdf.getOutgoingWeights(incomingSlot);

      // Deposit energy at receiver patch.
      //
      // `gain` alone, with no receiver cosine. This is a particle method: the
      // slot's energy is divided equally among `nRays` rays, each ray carries
      // `1/nRays` of it, and a ray that lands on a patch delivers all of it. The
      // receiver's projected area is already accounted for — a tilted patch
      // subtends less solid angle from the source and so is *hit by fewer rays*,
      // which is the form factor. Multiplying by `cos θ` as well counts it
      // twice, and because a raw cosine averages below 1 it also destroys
      // energy: measured 0.70-0.74 retention per bounce at α = 0, compounding to
      // a reverberation time 2-4x short (issue #205).
      const sourceResponse = srcEnergy.responses[k];
      const depositGain = gain * airAtten;

      for (let outSlot = 0; outSlot < brdf.nSlots; outSlot++) {
        const weight = outgoingWeights[outSlot] * depositGain;
        if (weight < 1e-20) continue;
        unshotEnergy[rcvPatchIdx].responses[outSlot].delayMultiplyAdd(
          sourceResponse, delaySamples, weight
        );
        totalEnergy[rcvPatchIdx].responses[outSlot].delayMultiplyAdd(
          sourceResponse, delaySamples, weight
        );
      }
    }
  }

  // Clear unshot energy of the shooting patch
  srcEnergy.clear();
}

/**
 * Inject source emission into visible patches.
 */
export function injectSourceEnergy(
  sourcePosition: Vector3,
  initialEnergy: number,
  ctx: ShootingContext,
  nRays: number = 500,
  rayWeight?: (dir: Vector3) => number,
): void {
  const { patchSet, unshotEnergy, totalEnergy, brdf, airAbsNepers, speedOfSound, sampleRate } = ctx;
  const { patches, bvh, triangleToPatch } = patchSet;

  const gain = initialEnergy / nRays;

  for (let r = 0; r < nRays; r++) {
    // Random direction on full sphere from source
    const dir = randomSphereDirection();

    const hits = bvh.intersectRay(sourcePosition, dir, false);
    if (!hits || hits.length === 0) continue;

    // Find closest hit
    let closestHit: any = null;
    let closestDist = Infinity;
    for (const hit of hits) {
      const hitPoint = hit.intersectionPoint;
      const dx = hitPoint.x - sourcePosition.x;
      const dy = hitPoint.y - sourcePosition.y;
      const dz = hitPoint.z - sourcePosition.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        closestHit = hit;
      }
    }

    if (!closestHit || closestDist < 1e-6) continue;

    const patchIdx = triangleToPatch[closestHit.triangleIndex];
    const patch = patches[patchIdx];
    // Orientation gate only, as in `shootFromPatch` — see the note on
    // `depositGain` there. A point source divides its energy equally among rays
    // and each ray delivers what it carries; scaling by the receiver's cosine
    // cost about 20% of the injected energy before it entered the room at all.
    if (incomingLambert(patch.normal, dir) <= 0) continue;

    const delaySamples = (closestDist / speedOfSound) * sampleRate;
    const airAtten = Math.exp(-airAbsNepers * closestDist);

    // Direction arriving at the patch
    const fromSource = dir.clone().negate();
    const incomingSlot = brdf.getDirectionIndex(fromSource, patch.normal);

    // Apply BRDF at receiving patch
    const patchAbsorption = ctx.absorptions[patchIdx];
    const patchScattering = ctx.scatterings[patchIdx];
    brdf.computeCoefficients(patchAbsorption, patchScattering);
    const outWeights = brdf.getOutgoingWeights(incomingSlot);

    // Create a unit impulse as the source emission
    const impulse = new Response(1);
    impulse.buffer[0] = gain * airAtten * (rayWeight ? rayWeight(dir) : 1);

    for (let outSlot = 0; outSlot < brdf.nSlots; outSlot++) {
      const w = outWeights[outSlot];
      if (w < 1e-20) continue;
      unshotEnergy[patchIdx].responses[outSlot].delayMultiplyAdd(impulse, delaySamples, w);
      totalEnergy[patchIdx].responses[outSlot].delayMultiplyAdd(impulse, delaySamples, w);
    }
  }
}

/**
 * Gather energy at a receiver position from all visible patches.
 * Returns a single time-domain response buffer (the impulse response).
 */
export function gatherAtReceiver(
  receiverPosition: Vector3,
  ctx: ShootingContext
): Response {
  const { patchSet, totalEnergy, brdf, airAbsNepers, speedOfSound, sampleRate } = ctx;
  const { patches, bvh, triangleToPatch } = patchSet;

  // Start with a generous response length
  const result = new Response(1);

  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];

    // Direction from patch to receiver
    const toReceiver = new Vector3().subVectors(receiverPosition, patch.centroid);
    const dist = toReceiver.length();
    if (dist < 1e-6) continue;
    toReceiver.normalize();

    // Check if the patch normal faces toward the receiver
    const cosTheta = patch.normal.dot(toReceiver);
    if (cosTheta <= 0) continue;

    // Visibility check: trace from the patch toward the receiver, from an
    // origin lifted off the patch plane for the same reason as the shoot.
    const gatherOrigin = patch.centroid
      .clone()
      .addScaledVector(patch.normal, RAY_ORIGIN_EPSILON);
    const hits = bvh.intersectRay(gatherOrigin, toReceiver, false);
    let occluded = false;
    if (hits) {
      for (const hit of hits) {
        const hitPatchIdx = triangleToPatch[hit.triangleIndex];
        if (hitPatchIdx === i) continue;
        const hitPoint = hit.intersectionPoint;
        const hitDist = new Vector3(
          hitPoint.x - gatherOrigin.x,
          hitPoint.y - gatherOrigin.y,
          hitPoint.z - gatherOrigin.z
        ).length();
        if (hitDist < dist - OCCLUSION_EPSILON) {
          occluded = true;
          break;
        }
      }
    }
    if (occluded) continue;

    // Propagation delay and attenuation
    const delaySamples = (dist / speedOfSound) * sampleRate;
    const airAtten = Math.exp(-airAbsNepers * dist);

    // Solid angle subtended by patch as seen from receiver
    const solidAngle = (patch.area * cosTheta) / (dist * dist);

    // Get the direction slot toward the receiver
    const dirSlot = brdf.getDirectionIndex(toReceiver, patch.normal);

    // Gather from the energy in this direction
    const patchResponse = totalEnergy[i].responses[dirSlot];
    const weight = solidAngle * airAtten;
    result.delayMultiplyAdd(patchResponse, delaySamples, weight);
  }

  return result;
}

/**
 * Generate a random direction on the unit sphere.
 */
function randomSphereDirection(): Vector3 {
  const theta = Math.acos(2 * Math.random() - 1);
  const phi = 2 * Math.PI * Math.random();
  return new Vector3(
    Math.sin(theta) * Math.cos(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(theta)
  );
}

/**
 * Sample a direction within a BRDF hemisphere slot.
 * Generates a random direction biased toward the slot's center direction.
 */
function sampleDirectionInSlot(brdf: BRDF, slotIdx: number): Vector3 {
  const center = brdf.directions[slotIdx];
  // Perturb around center direction with cosine-weighted distribution
  const theta = Math.acos(Math.sqrt(Math.random())) * 0.5; // Half-angle spread
  const phi = 2 * Math.PI * Math.random();

  // Create a local frame around center
  let tangent = new Vector3(1, 0, 0);
  if (Math.abs(center.dot(tangent)) > 0.9) {
    tangent = new Vector3(0, 1, 0);
  }
  const u = new Vector3().crossVectors(center, tangent).normalize();
  const v = new Vector3().crossVectors(center, u).normalize();

  const sinT = Math.sin(theta);
  const cosT = Math.cos(theta);
  const dir = new Vector3()
    .addScaledVector(center, cosT)
    .addScaledVector(u, sinT * Math.cos(phi))
    .addScaledVector(v, sinT * Math.sin(phi));
  dir.normalize();

  // Clamp to hemisphere (z >= 0 in local frame)
  if (dir.z < 0) dir.z = -dir.z;
  dir.normalize();
  return dir;
}

/**
 * Transform a local-frame direction (z-up = normal) to world space.
 */
function localToWorld(localDir: Vector3, normal: Vector3): Vector3 {
  const z = normal.clone().normalize();
  let tangent = new Vector3(1, 0, 0);
  if (Math.abs(z.dot(tangent)) > 0.9) {
    tangent = new Vector3(0, 1, 0);
  }
  const x = new Vector3().crossVectors(z, tangent).normalize();
  const y = new Vector3().crossVectors(z, x).normalize();

  return new Vector3(
    localDir.x * x.x + localDir.y * y.x + localDir.z * z.x,
    localDir.x * x.y + localDir.y * y.y + localDir.z * z.y,
    localDir.x * x.z + localDir.y * y.z + localDir.z * z.z,
  ).normalize();
}
