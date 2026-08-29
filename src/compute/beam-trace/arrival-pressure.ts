import * as THREE from "three";
import { worldDirToCramAngles } from "../../common/dir-angle-conversions";
import * as ac from "../acoustics";

/**
 * Minimal surface contract used by the specular reflection loop.
 * `Surface.reflectionFunction` already returns energy (R²).
 */
export interface ArrivalSurface {
  reflectionFunction: (freq: number, theta: number) => number;
}

/**
 * Minimal source contract for on-axis-referenced directivity weighting.
 */
export interface ArrivalSource {
  quaternion: THREE.Quaternion;
  directivityHandler: {
    getPressureAtPosition: (
      gain: number,
      frequency: number,
      phi: number,
      theta: number,
    ) => unknown;
  };
}

/**
 * Path fields consumed by the energy pipeline.
 * `BeamTracePath` is a structural subtype of this.
 *
 * Point order matches the beam-trace library: [receiver, …bounces, source].
 */
export interface ArrivalPath {
  points: THREE.Vector3[];
  length: number;
  polygonIds: (number | null)[];
  reflections?: { incidenceAngle: number }[];
  bandEnergy?: number[];
}

export interface ArrivalPressureOptions {
  frequencies: number[];
  temperature: number;
  receiverGain?: number;
  source?: ArrivalSource | null;
  polygonToSurface?: Map<number, ArrivalSurface>;
}

/**
 * Per-band energy weighting from a source's directivity for energy leaving
 * the source along `worldDir`.
 *
 * Undo the source rotation with the inverse quaternion, then map the
 * source-local direction to CRAM (phi, theta) degrees with
 * `worldDirToCramAngles` — the same convention the ray tracer launches with.
 */
export function directivityBandEnergy(
  handler: ArrivalSource["directivityHandler"],
  refPressures: number[],
  quaternion: THREE.Quaternion,
  worldDir: THREE.Vector3,
  frequencies: number[],
): number[] {
  const scale = new Array(frequencies.length).fill(1);
  if (worldDir.lengthSq() < 1e-20) return scale;

  const [phi, theta] = worldDirToCramAngles(worldDir, quaternion);

  for (let f = 0; f < frequencies.length; f++) {
    try {
      const dirP = handler.getPressureAtPosition(0, frequencies[f], phi, theta);
      const refP = refPressures[f];
      if (typeof dirP === "number" && typeof refP === "number" && refP > 0) {
        scale[f] = (dirP / refP) ** 2;
      }
    } catch {
      // Fallback to unity gain
    }
  }
  return scale;
}

/**
 * Arrival pressure per frequency band for one geometric path.
 *
 * No renderer / messenger / store imports — this is the testable energy
 * path. `BeamTraceSolver.calculateArrivalPressure` is a thin façade.
 */
export function calculateArrivalPressure(
  initialSPL: number[],
  path: ArrivalPath,
  options: ArrivalPressureOptions,
): number[] {
  const {
    frequencies,
    temperature,
    receiverGain = 1.0,
    source = null,
    polygonToSurface,
  } = options;

  // Diffraction: bandEnergy is |D|² × A² from utdDiffractionCoefficient.
  // A² = s'/(s(s+s')) is Kouyoumjian–Pathak spreading of the *diffracted*
  // field from the edge — not incident spreading. The incident spherical
  // wave at the edge is 1/s'² (source → edge). Apply that here. Do not use
  // total path length s'+s; that would double-count A².
  if (path.bandEnergy) {
    const initialIntensities = ac.P2I(ac.Lp2P(initialSPL)) as number[];
    const sourceIdx = path.points.length - 1;
    const sPrime = sourceIdx >= 1
      ? path.points[sourceIdx].distanceTo(path.points[sourceIdx - 1])
      : path.length;
    const incidentSpreading = ac.spreadingFactor(sPrime);
    const pressures: number[] = new Array(frequencies.length);
    for (let f = 0; f < frequencies.length; f++) {
      const arrivalIntensity = initialIntensities[f] * path.bandEnergy[f] * incidentSpreading;
      pressures[f] = (ac.I2P([arrivalIntensity]) as number[])[0] * receiverGain;
    }
    return pressures;
  }

  // initialSPL is referenced at 1 m; scale intensity by 1/r^2 for spherical spreading beyond that.
  const spreading = ac.spreadingFactor(path.length);
  const intensities = ac.P2I(ac.Lp2P(initialSPL)) as number[];
  for (let f = 0; f < intensities.length; f++) {
    intensities[f] *= spreading;
  }

  // Apply source directivity weighting.
  // Direction from source (last point) toward the first reflection (or receiver for direct path).
  const sourceIdx = path.points.length - 1;
  if (sourceIdx >= 1 && source?.directivityHandler) {
    const sourcePos = path.points[sourceIdx];
    const nextPoint = path.points[sourceIdx - 1];
    const worldDir = new THREE.Vector3().subVectors(nextPoint, sourcePos);

    const refPressures = new Array(frequencies.length);
    for (let f = 0; f < frequencies.length; f++) {
      refPressures[f] = source.directivityHandler.getPressureAtPosition(0, frequencies[f], 0, 0);
    }

    const scale = directivityBandEnergy(
      source.directivityHandler,
      refPressures as number[],
      source.quaternion,
      worldDir,
      frequencies,
    );
    for (let f = 0; f < frequencies.length; f++) {
      intensities[f] *= scale[f];
    }
  }

  // Apply angle-dependent reflection at each reflection point.
  // path.reflections lists only actual reflections in order, while
  // path.polygonIds includes null entries for source/receiver.
  let reflectionIdx = 0;

  path.polygonIds.forEach((polygonId, idx) => {
    if (polygonId === null) return;

    const surface = polygonToSurface?.get(polygonId);
    if (!surface) {
      reflectionIdx++;
      return;
    }

    let angle = 0;
    if (path.reflections && reflectionIdx < path.reflections.length) {
      angle = path.reflections[reflectionIdx].incidenceAngle;
    } else if (idx > 0 && idx < path.points.length - 1) {
      const toSource = new THREE.Vector3().subVectors(path.points[idx + 1], path.points[idx]).normalize();
      const toReceiver = new THREE.Vector3().subVectors(path.points[idx - 1], path.points[idx]).normalize();
      const cosAngle = Math.min(1, Math.max(-1, toSource.dot(toReceiver)));
      angle = Math.acos(cosAngle) / 2;
    }
    reflectionIdx++;

    for (let f = 0; f < frequencies.length; f++) {
      const R = Math.abs(surface.reflectionFunction(frequencies[f], angle));
      intensities[f] *= R;
    }
  });

  const arrivalLp = ac.P2Lp(ac.I2P(intensities)) as number[];
  const airAttenuationdB = ac.airAttenuation(frequencies, temperature);

  for (let f = 0; f < frequencies.length; f++) {
    arrivalLp[f] -= airAttenuationdB[f] * path.length;
  }

  const pressures = ac.Lp2P(arrivalLp) as number[];
  if (receiverGain !== 1.0) {
    for (let f = 0; f < pressures.length; f++) {
      pressures[f] *= receiverGain;
    }
  }
  return pressures;
}
