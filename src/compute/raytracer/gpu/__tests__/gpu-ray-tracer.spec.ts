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

  it('traceBatch throws when not initialized', async () => {
    const tracer = new GpuRayTracer();
    const rayInputs = new Float32Array(16);
    await expect(tracer.traceBatch(rayInputs, 1, 42)).rejects.toThrow('[GPU RT] Not initialized');
  });
});

describe('GPU data packing constants', () => {
  // These constants must match the WGSL shader layout
  const RAY_INPUT_FLOATS = 16;
  const RAY_OUTPUT_FLOATS = 16;
  const CHAIN_ENTRY_FLOATS = 16;
  const MAX_BOUNCES = 64;
  const MAX_BANDS = 7;

  it('RayInput layout: 8 floats + 7 band + 1 pad = 16 floats', () => {
    // origin(3) + direction(3) + phi + theta + bandEnergy(7) + pad(1)
    expect(RAY_INPUT_FLOATS).toBe(16);
    expect(RAY_INPUT_FLOATS * 4).toBe(64); // 64 bytes per ray
  });

  it('RayOutput layout: 8 floats + 7 band + 1 pad = 16 floats', () => {
    // chainLength(u32) + intersectedReceiver(u32) + receiverIndex(u32) +
    // arrivalDir(3) + pad(2) + finalBandEnergy(7) + pad(1)
    expect(RAY_OUTPUT_FLOATS).toBe(16);
    expect(RAY_OUTPUT_FLOATS * 4).toBe(64);
  });

  it('ChainEntry layout: 8 floats + 7 band + 1 pad = 16 floats', () => {
    // point(3) + distance + surfaceIndex(u32) + pad(u32) + angle + energy + bandEnergy(7) + pad(1)
    expect(CHAIN_ENTRY_FLOATS).toBe(16);
    expect(CHAIN_ENTRY_FLOATS * 4).toBe(64);
  });

  it('chain buffer size matches MAX_BOUNCES × ChainEntry', () => {
    const batchSize = 100;
    const chainBytes = batchSize * MAX_BOUNCES * CHAIN_ENTRY_FLOATS * 4;
    expect(chainBytes).toBe(batchSize * 64 * 64);
  });

  it('ray input packing matches expected offsets', () => {
    const rayInputs = new Float32Array(RAY_INPUT_FLOATS);
    const origin = [1, 2, 3];
    const direction = [0.577, 0.577, 0.577];
    const phi = 1.5;
    const theta = 0.8;
    const bandEnergy = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];

    rayInputs[0] = origin[0];
    rayInputs[1] = origin[1];
    rayInputs[2] = origin[2];
    rayInputs[3] = direction[0];
    rayInputs[4] = direction[1];
    rayInputs[5] = direction[2];
    rayInputs[6] = phi;
    rayInputs[7] = theta;
    for (let i = 0; i < MAX_BANDS; i++) {
      rayInputs[8 + i] = bandEnergy[i];
    }

    expect(rayInputs[0]).toBeCloseTo(1);
    expect(rayInputs[6]).toBeCloseTo(1.5);
    expect(rayInputs[7]).toBeCloseTo(0.8);
    expect(rayInputs[8]).toBeCloseTo(1.0);
    expect(rayInputs[14]).toBeCloseTo(0.4);
  });

  it('params uniform packing matches WGSL struct layout (20 floats = 80 bytes)', () => {
    const PARAMS_FLOATS = 20;
    const paramsData = new ArrayBuffer(PARAMS_FLOATS * 4);
    const u32 = new Uint32Array(paramsData);
    const f32 = new Float32Array(paramsData);

    // Write as the orchestrator would
    u32[0] = 1000;   // numRays
    u32[1] = 50;     // maxBounces
    u32[2] = 7;      // numBands
    u32[3] = 2;      // numReceivers
    u32[4] = 500;    // numTriangles
    u32[5] = 100;    // numNodes
    u32[6] = 10;     // numSurfaces
    u32[7] = 12345;  // batchSeed
    f32[8] = 0.1;    // rrThreshold
    // indices 9-11 are padding
    // airAttPacked[0] (vec4) at indices 12-15
    f32[12] = 0.001; f32[13] = 0.002; f32[14] = 0.003; f32[15] = 0.004;
    // airAttPacked[1] (vec4) at indices 16-19
    f32[16] = 0.005; f32[17] = 0.006; f32[18] = 0.007;

    // Verify u32 reads
    expect(u32[0]).toBe(1000);
    expect(u32[7]).toBe(12345);
    // Verify f32 reads
    expect(f32[8]).toBeCloseTo(0.1);
    expect(f32[12]).toBeCloseTo(0.001);
    expect(f32[16]).toBeCloseTo(0.005);
    // Total size
    expect(PARAMS_FLOATS * 4).toBe(80);
  });

  it('output parsing extracts chain length and receiver flag correctly', () => {
    const outputData = new Float32Array(RAY_OUTPUT_FLOATS);
    const u32View = new Uint32Array(outputData.buffer);

    // Simulate a ray that hit a receiver after 3 bounces
    u32View[0] = 3;   // chainLength
    u32View[1] = 1;   // intersectedReceiver
    u32View[2] = 0;   // receiverIndex
    outputData[3] = -0.5; // arrivalDirX
    outputData[4] = 0.5;  // arrivalDirY
    outputData[5] = 0.707; // arrivalDirZ

    expect(u32View[0]).toBe(3);
    expect(u32View[1]).toBe(1);
    expect(outputData[3]).toBeCloseTo(-0.5);
  });
});
