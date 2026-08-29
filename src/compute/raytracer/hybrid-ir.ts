/**
 * Hybrid IR: image source owns order ≤ transitionOrder, stochastic rays own the rest.
 * Never mutate the stored path list (#129).
 */

export function rayPathOrder(path: { chainLength: number }): number {
  return path.chainLength - 1;
}

export function hybridStochasticPaths<T extends { chainLength: number; time: number }>(
  paths: readonly T[],
  transitionOrder: number,
): T[] {
  return paths
    .filter((p) => rayPathOrder(p) > transitionOrder)
    .slice()
    .sort((a, b) => a.time - b.time);
}

export function hybridImageSourcePaths<T extends { order: number }>(
  paths: readonly T[],
  transitionOrder: number,
): T[] {
  return paths.filter((p) => p.order <= transitionOrder);
}
