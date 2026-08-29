/**
 * ART source emission is the same physical quantity beam-trace uses:
 * intensity from Source.initialSPL, times Q(θ,φ,f)² from the
 * DirectivityHandler. The old 500-unit omni ignored both (#119).
 */
import * as THREE from "three";
import * as ac from "../acoustics";
import {
  directivityBandEnergy,
  type ArrivalSource,
} from "../beam-trace/arrival-pressure";

export function sourceEmissionEnergy(initialSPL: number): number {
  return ac.P2I(ac.Lp2P(initialSPL)) as number;
}

export function sourceRayWeight(opts: {
  handler?: ArrivalSource["directivityHandler"] | null;
  quaternion?: THREE.Quaternion;
  worldDir: THREE.Vector3;
  frequency: number;
}): number {
  const { handler, worldDir, frequency } = opts;
  if (!handler || worldDir.lengthSq() < 1e-20) return 1;
  const ref = handler.getPressureAtPosition(0, frequency, 0, 0);
  if (typeof ref !== "number" || !(ref > 0)) return 1;
  const scale = directivityBandEnergy(
    handler,
    [ref],
    opts.quaternion ?? new THREE.Quaternion(),
    worldDir,
    [frequency],
  );
  return scale[0];
}
