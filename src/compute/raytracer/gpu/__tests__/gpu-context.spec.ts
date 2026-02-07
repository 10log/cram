import { isWebGPUAvailable, requestGpuContext, releaseGpuContext } from '../gpu-context';

describe('gpu-context', () => {
  describe('isWebGPUAvailable', () => {
    it('returns false when navigator.gpu is not defined', () => {
      // jsdom doesn't have navigator.gpu
      expect(isWebGPUAvailable()).toBe(false);
    });
  });

  describe('requestGpuContext', () => {
    it('returns null when WebGPU is unavailable', async () => {
      const result = await requestGpuContext();
      expect(result).toBeNull();
    });
  });

  describe('releaseGpuContext', () => {
    it('does not throw when called without prior initialization', () => {
      expect(() => releaseGpuContext()).not.toThrow();
    });
  });
});
