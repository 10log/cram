import * as THREE from "three";
import Surface from "../../objects/surface";
import { probability } from '../../common/probability';
import { BandEnergy, Chain, RayPath, SELF_INTERSECTION_OFFSET } from "./types";

const { abs } = Math;

// Pre-allocated scratch vectors to avoid per-ray allocations
const _negRd = new THREE.Vector3();
const _normalCopy = new THREE.Vector3();
const _normalScaled = new THREE.Vector3();
const _reflectedDir = new THREE.Vector3();
const _scatterCandidate = new THREE.Vector3();
const _offsetOrigin = new THREE.Vector3();
const _arrivalDir = new THREE.Vector3();

const _plane = new THREE.Plane();
const _pleq = new THREE.Vector4();
const _avec4 = new THREE.Vector4();
const _bvec4 = new THREE.Vector4();
const _cvec4 = new THREE.Vector4();

export function inFrontOf(a: THREE.Triangle, b: THREE.Triangle) {
  a.getPlane(_plane);
  _pleq.set(_plane.normal.x, _plane.normal.y, _plane.normal.z, _plane.constant);
  _avec4.set(b.a.x, b.a.y, b.a.z, 1);
  _bvec4.set(b.b.x, b.b.y, b.b.z, 1);
  _cvec4.set(b.c.x, b.c.y, b.c.z, 1);
  return _pleq.dot(_avec4) > 0 || _pleq.dot(_bvec4) > 0 || _pleq.dot(_cvec4) > 0;
}

export function traceRay(
  raycaster: THREE.Raycaster,
  intersectableObjects: THREE.Object3D[],
  frequencies: number[],
  cachedAirAtt: number[],
  rrThreshold: number,
  ro: THREE.Vector3,
  rd: THREE.Vector3,
  order: number,
  bandEnergy: BandEnergy,
  source: string,
  initialPhi: number,
  initialTheta: number,
  iter: number = 1,
  chain: Partial<Chain>[] = [],
): RayPath | undefined {
  // normalize the ray
  rd = rd.normalize();

  // set the starting position
  raycaster.ray.origin = ro;

  // set the direction
  raycaster.ray.direction = rd;

  // find the surface that the ray intersects
  const intersections = raycaster.intersectObjects(intersectableObjects, true);

  // if there was an intersection
  if (intersections.length > 0) {

    // broadband average energy for scalar backward compat
    const totalEnergy = bandEnergy.reduce((a, b) => a + b, 0);
    const energy = bandEnergy.length > 0 ? totalEnergy / bandEnergy.length : 0;

    //check to see if the intersection was with a receiver
    if (intersections[0].object.userData?.kind === 'receiver') {
      // find the incident angle
      const angle = intersections[0].face && _negRd.copy(rd).multiplyScalar(-1).angleTo(intersections[0].face.normal);

      // apply air absorption for the final segment to the receiver
      const receiverSegmentDist = intersections[0].distance;
      const receiverBandEnergy = bandEnergy.map((e, f) =>
        e * Math.pow(10, -cachedAirAtt[f] * receiverSegmentDist / 10)
      );

      // broadband average energy for scalar backward compat (recompute after air absorption)
      const receiverTotalEnergy = receiverBandEnergy.reduce((a, b) => a + b, 0);
      const receiverEnergy = receiverBandEnergy.length > 0 ? receiverTotalEnergy / receiverBandEnergy.length : 0;

      // push the intersection data onto the chain
      chain.push({
        object: intersections[0].object.parent!.uuid,
        angle: angle!,
        distance: intersections[0].distance,
        faceNormal: [
          intersections[0].face!.normal.x,
          intersections[0].face!.normal.y,
          intersections[0].face!.normal.z
        ],
        faceMaterialIndex: intersections[0].face!.materialIndex,
        faceIndex: intersections[0].faceIndex!,
        point: [intersections[0].point.x, intersections[0].point.y, intersections[0].point.z],
        energy: receiverEnergy,
        bandEnergy: [...receiverBandEnergy],
      });

      // Compute arrival direction (direction ray arrives FROM, normalized)
      // This is the opposite of the ray direction (ray travels toward receiver)
      _arrivalDir.copy(rd).normalize().negate();
      const arrivalDirection: [number, number, number] = [_arrivalDir.x, _arrivalDir.y, _arrivalDir.z];

      // end the chain here
      return {
        chain,
        chainLength: chain.length,
        intersectedReceiver: true,
        energy: receiverEnergy,
        bandEnergy: [...receiverBandEnergy],
        source,
        initialPhi,
        initialTheta,
        arrivalDirection,
      } as RayPath;
    } else {
      // find the incident angle
      const angle = intersections[0].face && _negRd.copy(rd).multiplyScalar(-1).angleTo(intersections[0].face.normal);

      // push the intersection onto the chain
      chain.push({
        object: intersections[0].object.parent!.uuid,
        angle: angle!,
        distance: intersections[0].distance,
        faceNormal: [
          intersections[0].face!.normal.x,
          intersections[0].face!.normal.y,
          intersections[0].face!.normal.z
        ],
        faceMaterialIndex: intersections[0].face!.materialIndex,
        faceIndex: intersections[0].faceIndex!,
        point: [intersections[0].point.x, intersections[0].point.y, intersections[0].point.z],
        energy,
      });

      if (intersections[0].object.parent instanceof Surface) {
        intersections[0].object.parent.numHits += 1;
      }

      // get the normal direction of the intersection (copy to avoid mutating mesh data)
      const normal = intersections[0].face && _normalCopy.copy(intersections[0].face.normal).normalize();

      // find the reflected direction
      let rr =
        normal &&
        intersections[0].face &&
        _reflectedDir.copy(rd).sub(_normalScaled.copy(normal).multiplyScalar(rd.dot(normal)).multiplyScalar(2));

      // compute energy-weighted broadband scattering for directional decision
      const surface = intersections[0].object.parent as Surface;
      const scatterCoeffs = frequencies.map(f => surface.scatteringFunction(f));
      const totalEnergy = bandEnergy.reduce((a, b) => a + b, 0) || 1;
      let broadbandScattering = 0;
      for (let f = 0; f < frequencies.length; f++) {
        broadbandScattering += scatterCoeffs[f] * (bandEnergy[f] || 0);
      }
      broadbandScattering /= totalEnergy;

      if (probability(broadbandScattering)) {
        // Cosine-weighted (Lambertian) hemisphere sampling via rejection method
        do {
          _scatterCandidate.set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
          );
        } while (_scatterCandidate.lengthSq() > 1 || _scatterCandidate.lengthSq() < 1e-6);
        _scatterCandidate.normalize();
        // Offset along normal for cosine-weighted distribution
        rr = _reflectedDir.copy(_scatterCandidate).add(normal!).normalize();
      }

      // apply per-band reflection loss
      const segmentDistance = intersections[0].distance;
      const newBandEnergy = frequencies.map((frequency, f) => {
        const e = bandEnergy[f];
        if (e == null) return 0;
        // surface reflection
        let energy = e * abs(surface.reflectionFunction(frequency, angle!));
        // per-segment air absorption (intensity domain: /10)
        energy *= Math.pow(10, -cachedAirAtt[f] * segmentDistance / 10);
        return energy;
      });

      // Russian Roulette termination: unbiased probabilistic early termination
      const maxEnergy = Math.max(...newBandEnergy);
      if (rr && normal && iter < order + 1) {
        if (maxEnergy < rrThreshold && maxEnergy > 0) {
          const survivalProbability = maxEnergy / rrThreshold;
          if (Math.random() > survivalProbability) {
            // Terminate ray - expected value preserved (no bias)
            const rrTotalEnergy = newBandEnergy.reduce((a, b) => a + b, 0);
            const rrEnergy = newBandEnergy.length > 0 ? rrTotalEnergy / newBandEnergy.length : 0;
            return { chain, chainLength: chain.length, source, intersectedReceiver: false, energy: rrEnergy, bandEnergy: [...newBandEnergy] } as RayPath;
          }
          // Boost surviving ray energy to compensate
          for (let f = 0; f < newBandEnergy.length; f++) {
            newBandEnergy[f] /= survivalProbability;
          }
        }
        if (maxEnergy > 0) {
          // recurse
          return traceRay(
            raycaster,
            intersectableObjects,
            frequencies,
            cachedAirAtt,
            rrThreshold,
            _offsetOrigin.copy(intersections[0].point).addScaledVector(normal, SELF_INTERSECTION_OFFSET),
            rr,
            order,
            newBandEnergy,
            source,
            initialPhi,
            initialTheta,
            iter + 1,
            chain,
          );
        }
      }
    }
    return { chain, chainLength: chain.length, source, intersectedReceiver: false } as RayPath;
  }
}
