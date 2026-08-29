/**
 * Image-source arrival pressure. `initialSPL` is Lp @ 1 m.
 * Intensity gets 1/r² (`ac.spreadingFactor`) once — same helper as beam-trace (#99 / #122).
 * `reflectionFunction` is already energy (R²); do not square it again.
 */
import { Vector3 } from "three";
import * as ac from "../../acoustics";

export interface ImageSourceArrivalHit {
  point: Vector3;
  reflectingSurface: {
    reflectionFunction: (freq: number, theta: number) => number;
  } | null;
  angle: number | null;
}

export function imageSourcePathLength(path: { point: Vector3 }[]): number {
  let length = 0;
  for (let i = 1; i < path.length; i++) {
    length += path[i - 1].point.distanceTo(path[i].point);
  }
  return length;
}

export function imageSourceArrivalPressure(
  initialSPL: number[],
  freqs: number[],
  path: ImageSourceArrivalHit[],
  temperature: number = 20,
): number[] {
  const intensity = ac.P2I(ac.Lp2P(initialSPL)) as number[];
  const r = imageSourcePathLength(path);
  const spreading = ac.spreadingFactor(r);
  for (let f = 0; f < intensity.length; f++) {
    intensity[f] *= spreading;
  }

  for (const hit of path) {
    if (!hit.reflectingSurface) continue;
    const angle = hit.angle ?? 0;
    for (let f = 0; f < freqs.length; f++) {
      intensity[f] *= Math.abs(hit.reflectingSurface.reflectionFunction(freqs[f], angle));
    }
  }

  const arrivalLp = ac.P2Lp(ac.I2P(intensity)) as number[];
  const airAttenuationdB = ac.airAttenuation(freqs, temperature);
  for (let f = 0; f < freqs.length; f++) {
    arrivalLp[f] -= airAttenuationdB[f] * r;
  }
  return ac.Lp2P(arrivalLp) as number[];
}
