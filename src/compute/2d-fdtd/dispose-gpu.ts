/**
 * Tear down GPUComputationRenderer ping-pong targets.
 * Three's helper has no public dispose(); the RTs live on each variable.
 */
export function disposeGpuCompute(gpu: {
  variables?: Array<{
    renderTargets?: Array<{ dispose: () => void }>;
    material?: { dispose?: () => void };
  }>;
  dispose?: () => void;
} | null | undefined) {
  if (!gpu) return;
  const vars = gpu.variables ?? [];
  for (const v of vars) {
    v.renderTargets?.forEach((rt) => rt.dispose());
    v.material?.dispose?.();
  }
  gpu.dispose?.();
}
