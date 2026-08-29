/**
 * Tear down GPUComputationRenderer ping-pong targets.
 * Three's helper has no public dispose(); the RTs live on each variable.
 */
export declare function disposeGpuCompute(gpu: {
    variables?: Array<{
        renderTargets?: Array<{
            dispose: () => void;
        }>;
        material?: {
            dispose?: () => void;
        };
    }>;
    dispose?: () => void;
} | null | undefined): void;
