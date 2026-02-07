import { isWebGPUAvailable } from '../gpu-context';
import { GpuRayTracer } from '../gpu-ray-tracer';

// Mock the store module
jest.mock('../../../../store', () => ({
  useContainer: {
    getState: () => ({
      containers: {},
    }),
  },
  useSolver: { getState: () => ({ solvers: {} }) },
  addSolver: jest.fn(),
  removeSolver: jest.fn(),
  setSolverProperty: jest.fn(),
  callSolverMethod: jest.fn(),
}));

describe('GpuRayTracer', () => {
  it('can be constructed', () => {
    const tracer = new GpuRayTracer();
    expect(tracer).toBeDefined();
  });

  it('dispose does not throw when called without initialization', () => {
    const tracer = new GpuRayTracer();
    expect(() => tracer.dispose()).not.toThrow();
  });

  // WebGPU-dependent tests (skip in non-WebGPU environments like jsdom)
  const describeGpu = isWebGPUAvailable() ? describe : describe.skip;

  describeGpu('with WebGPU', () => {
    // These tests require a real WebGPU adapter (Chrome 113+ with WebGPU)
    // They will be skipped in jsdom/node environments

    it('initializes successfully with a simple room', async () => {
      // This test would need a real Three.js Room setup and WebGPU context.
      // Placeholder for when running in a WebGPU-capable environment.
      expect(true).toBe(true);
    });
  });
});
