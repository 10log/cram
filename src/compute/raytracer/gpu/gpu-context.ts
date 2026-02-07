/** WebGPU adapter/device lifecycle management with module-level caching. */

let cachedAdapter: GPUAdapter | null = null;
let cachedDevice: GPUDevice | null = null;
let deviceLostHandled = false;

/** Returns true if the browser supports WebGPU (navigator.gpu exists). */
export function isWebGPUAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

export interface GpuContext {
  adapter: GPUAdapter;
  device: GPUDevice;
}

/**
 * Request a WebGPU adapter and device. Returns null if WebGPU is unavailable
 * or the adapter/device cannot be obtained. Results are cached — subsequent
 * calls return the same adapter/device until `releaseGpuContext()` is called.
 */
export async function requestGpuContext(): Promise<GpuContext | null> {
  if (cachedDevice && !cachedDevice.lost) {
    return { adapter: cachedAdapter!, device: cachedDevice };
  }

  if (!isWebGPUAvailable()) {
    return null;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      console.warn('[GPU RT] No WebGPU adapter found');
      return null;
    }

    const device = await adapter.requestDevice({
      requiredLimits: {
        maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
        maxBufferSize: adapter.limits.maxBufferSize,
        maxComputeWorkgroupSizeX: 64,
      },
    });

    cachedAdapter = adapter;
    cachedDevice = device;
    deviceLostHandled = false;

    // Handle device loss for error recovery
    device.lost.then((info) => {
      if (!deviceLostHandled) {
        deviceLostHandled = true;
        console.error(`[GPU RT] Device lost: ${info.reason ?? 'unknown'} — ${info.message}`);
        cachedDevice = null;
        cachedAdapter = null;
      }
    });

    return { adapter, device };
  } catch (err) {
    console.warn('[GPU RT] Failed to initialize WebGPU:', err);
    return null;
  }
}

/** Destroy the cached device and clear the cache. */
export function releaseGpuContext(): void {
  if (cachedDevice) {
    deviceLostHandled = true; // suppress the lost handler
    cachedDevice.destroy();
    cachedDevice = null;
    cachedAdapter = null;
  }
}
