/** WebGPU adapter/device lifecycle management with module-level caching. */
/** Returns true if the browser supports WebGPU (navigator.gpu exists). */
export declare function isWebGPUAvailable(): boolean;
export interface GpuContext {
    adapter: GPUAdapter;
    device: GPUDevice;
}
/**
 * Request a WebGPU adapter and device. Returns null if WebGPU is unavailable
 * or the adapter/device cannot be obtained. Results are cached — subsequent
 * calls return the same adapter/device until `releaseGpuContext()` is called.
 */
export declare function requestGpuContext(): Promise<GpuContext | null>;
/** Destroy the cached device and clear the cache. */
export declare function releaseGpuContext(): void;
