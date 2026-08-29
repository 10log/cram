/**
 * Monte Carlo IR scale (#133): 1/N, stable specular sign, no peak-normalize on export.
 */

export function rayOrderFromChain(path: { chainLength?: number; chain?: { length: number } }): number {
  if (typeof path.chainLength === "number") return Math.max(0, path.chainLength - 1);
  if (path.chain) return Math.max(0, path.chain.length - 1);
  return 0;
}

/** Isolated specular keeps a stable sign; optional random sign past first order. */
export function monteCarloSign(order: number, random: () => number = Math.random): number {
  if (order <= 1) return 1;
  return random() > 0.5 ? 1 : -1;
}

export function monteCarloWeight(numRays: number): number {
  return numRays > 0 ? 1 / numRays : 1;
}

/** Extra path length from a 0.1 m mesh hit to the receiver centre. */
export function extraLengthToReceiverCenter(
  hitPoint: [number, number, number] | { x: number; y: number; z: number },
  receiverPosition: { x: number; y: number; z: number },
): number {
  const hx = Array.isArray(hitPoint) ? hitPoint[0] : hitPoint.x;
  const hy = Array.isArray(hitPoint) ? hitPoint[1] : hitPoint.y;
  const hz = Array.isArray(hitPoint) ? hitPoint[2] : hitPoint.z;
  const dx = receiverPosition.x - hx;
  const dy = receiverPosition.y - hy;
  const dz = receiverPosition.z - hz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
