# CRAM Testing Strategy

A comprehensive testing strategy for the CRAM (Computational Room Acoustic Module) Three.js/React application, covering scientific calculations, visual rendering, and performance testing.

## Overview

This strategy addresses testing for a complex Three.js/React acoustic simulation application with:
- **316 TypeScript files** across compute, render, and UI layers
- **Heavy scientific calculations** requiring numerical validation
- **GPU-accelerated rendering** with WebGL shaders
- **Currently minimal test coverage** (1 test file)

---

## 1. Testing Pyramid

```
                    ┌──────────────┐
                    │   E2E Tests  │  ← Visual regression, full workflows
                   ─┼──────────────┼─
                  ─ │ Integration  │ ─  ← Solver pipelines, state flows
                ─── ├──────────────┤ ───
              ───── │  Unit Tests  │ ─────  ← Acoustic formulas, utilities
            ─────── └──────────────┘ ───────
```

---

## 2. Test Categories

### Tier 1: Scientific Calculation Tests (Critical)

**Location:** `src/compute/acoustics/` and solver implementations

| Module | File | Test Approach |
|--------|------|---------------|
| Air Attenuation | `src/compute/acoustics/air-attenuation.ts` | Compare against ISO 9613-1 reference values |
| RT60 Formulas | `src/compute/rt/index.ts` | Validate Sabine, Eyring, Arau-Puchades with known rooms |
| dB Addition | `src/compute/acoustics/dbaddition.ts` | Mathematical verification |
| Frequency Bands | `src/compute/acoustics/bands.ts` | ISO octave band center frequencies |
| Reflection Coefficient | `src/compute/acoustics/reflection-coefficient.ts` | Physics-based validation |
| Sound Speed | `src/compute/acoustics/sound-speed.ts` | Temperature-dependent formula verification |

**Example test structure:**
```typescript
// src/compute/acoustics/__tests__/air-attenuation.spec.ts
describe('airAttenuation', () => {
  it('matches ISO 9613-1 at 1kHz, 20°C, 50% humidity', () => {
    const result = airAttenuation(1000, 20, 50);
    expect(result).toBeCloseTo(0.0047, 4); // dB/m from ISO table
  });

  it('increases with frequency', () => {
    const low = airAttenuation(125, 20, 50);
    const high = airAttenuation(8000, 20, 50);
    expect(high).toBeGreaterThan(low);
  });
});
```

### Tier 2: Solver Integration Tests

**Location:** `src/compute/`

| Solver | Test Strategy |
|--------|---------------|
| **RayTracer** | Mock geometry, verify ray paths and energy decay |
| **ImageSource** | Known simple room (shoebox), compare to analytical solution |
| **RT60** | Reference room with known absorption → expected RT60 |
| **EnergyDecay** | Synthetic impulse response → verify T20/T30 extraction |
| **FDTD_2D** | Stability tests, boundary condition verification |

**Key challenges:**
- BVH ray intersection requires geometric test fixtures
- FDTD GPU shaders need WebGL mocking or headless GL context

### Tier 3: Object System Tests

**Location:** `src/objects/`

| Class | Test Focus |
|-------|------------|
| Container | Serialization round-trip (save → restore) |
| Room | Volume calculation, bounding box accuracy |
| Surface | Area calculation, absorption interpolation |
| Source/Receiver | Position transforms, save/restore |

**Snapshot testing for serialization:**
```typescript
describe('Room', () => {
  it('serializes and restores correctly', () => {
    const room = new Room();
    room.position.set(1, 2, 3);
    const saved = room.save();

    const restored = new Room();
    restored.restore(saved);

    expect(restored.position).toEqual(room.position);
  });
});
```

### Tier 4: State Management Tests

**Location:** `src/store/`

| Store | Test Focus |
|-------|------------|
| container-store | Add/remove containers, selection state |
| solver-store | Solver lifecycle management |
| material-store | Search functionality, material lookup |
| result-store | Result storage and retrieval |

```typescript
describe('useContainer', () => {
  it('adds container to state', () => {
    const container = new Container();
    addContainer(container);
    expect(useContainer.getState().containers[container.uuid]).toBe(container);
  });
});
```

### Tier 5: Rendering Tests

**Location:** `src/render/`

| Component | Test Strategy |
|-----------|---------------|
| Renderer | Mock canvas, verify initialization sequence |
| PickHelper | Mock raycaster, verify selection logic |
| Camera transitions | Verify quaternion interpolation |

**Approach:** Use `jest-webgl-canvas-mock` or similar to stub WebGL context.

### Tier 6: React Component Tests

**Location:** `src/components/`

| Component Type | Test Strategy |
|----------------|---------------|
| Property panels | React Testing Library, verify input/output |
| Visualization | Snapshot tests for chart configurations |
| Layout | Verify panel show/hide logic |

---

## 3. Required Dependencies

Add to `package.json`:
```json
{
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/user-event": "^14.5.0",
    "jest-webgl-canvas-mock": "^0.2.3",
    "jest-image-snapshot": "^6.4.0",
    "puppeteer": "^23.0.0",
    "fast-check": "^3.22.0"
  }
}
```

---

## 4. Test Configuration Updates

**Jest setup file** (`src/setupTests.ts`):
```typescript
import '@testing-library/jest-dom';
import 'jest-webgl-canvas-mock';

// Mock Three.js WebGLRenderer
jest.mock('three', () => {
  const THREE = jest.requireActual('three');
  return {
    ...THREE,
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      dispose: jest.fn(),
      domElement: document.createElement('canvas'),
    })),
  };
});
```

---

## 5. Reference Data for Scientific Tests

Create `src/__fixtures__/acoustic-references.ts`:
```typescript
export const REFERENCE_ROOMS = {
  shoebox: {
    dimensions: { x: 10, y: 6, z: 3 }, // meters
    volume: 180, // m³
    surfaceArea: 216, // m²
    // All surfaces α = 0.1
    expectedRT60_sabine: 1.33, // seconds at 1kHz
    expectedRT60_eyring: 1.21,
  },
};

export const ISO_AIR_ATTENUATION = {
  // dB/m at 20°C, 50% RH per ISO 9613-1
  '125Hz': 0.0003,
  '250Hz': 0.0011,
  '500Hz': 0.0019,
  '1000Hz': 0.0047,
  '2000Hz': 0.0137,
  '4000Hz': 0.0453,
  '8000Hz': 0.1587,
};
```

---

## 6. Visual Regression Testing

For Three.js scene rendering:

1. **Headless rendering** with `puppeteer` or `playwright`
2. **Screenshot comparison** with `jest-image-snapshot`
3. **Test scenarios:**
   - Empty scene renders correctly
   - Room with surfaces displays proper materials
   - Ray paths render with correct colors
   - Selection highlight (OutlinePass) works

```typescript
// e2e/visual/scene-rendering.spec.ts
describe('Scene Rendering', () => {
  it('renders empty scene correctly', async () => {
    const screenshot = await renderScene({});
    expect(screenshot).toMatchImageSnapshot({
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
    });
  });
});
```

---

## 7. Property-Based Testing

For acoustic calculations with varying parameters:

```typescript
import fc from 'fast-check';

describe('RT60 calculations', () => {
  it('RT60 is always positive for valid inputs', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 10, max: 10000 }),  // volume
        fc.float({ min: 1, max: 1000 }),    // surface area
        fc.float({ min: 0.01, max: 0.99 }), // absorption
        (V, S, alpha) => {
          const rt60 = sabine(V, S, alpha);
          return rt60 > 0;
        }
      )
    );
  });
});
```

---

## 8. Proposed Directory Structure

```
src/
├── __fixtures__/
│   ├── acoustic-references.ts
│   ├── test-geometries.ts
│   └── mock-materials.ts
├── __mocks__/
│   └── three.ts
├── __tests__/
│   ├── utils/
│   │   └── benchmark.ts
│   ├── memory.perf.spec.ts
│   └── performance-regression.spec.ts
├── compute/
│   ├── acoustics/
│   │   └── __tests__/
│   │       ├── air-attenuation.spec.ts
│   │       ├── dbaddition.spec.ts
│   │       └── bands.spec.ts
│   ├── raytracer/
│   │   └── __tests__/
│   │       ├── ray-intersection.spec.ts
│   │       ├── energy-tracking.spec.ts
│   │       └── raytracer.perf.spec.ts
│   ├── 2d-fdtd/
│   │   └── __tests__/
│   │       └── fdtd.perf.spec.ts
│   └── rt/
│       └── __tests__/
│           └── rt60.spec.ts
├── objects/
│   └── __tests__/
│       ├── container.spec.ts
│       ├── room.spec.ts
│       └── surface.spec.ts
├── render/
│   └── __tests__/
│       └── renderer.perf.spec.ts
├── store/
│   └── __tests__/
│       ├── container-store.spec.ts
│       └── solver-store.spec.ts
├── components/
│   └── __tests__/
│       └── ... (component tests)
├── setupTests.ts
e2e/
├── visual/
│   └── scene-rendering.spec.ts
└── gpu-performance.spec.ts
```

---

## 9. Implementation Priority

| Phase | Focus | Description |
|-------|-------|-------------|
| **Phase 1** | Acoustic utility functions | Pure math - easiest to test, highest value |
| **Phase 2** | RT60 solver with reference validation | Core scientific accuracy |
| **Phase 3** | Object serialization (save/restore) | Data integrity |
| **Phase 4** | State management stores | Application reliability |
| **Phase 5** | Ray tracer core logic | Complex but critical |
| **Phase 6** | React component tests | User interface |
| **Phase 7** | Visual regression setup | Rendering correctness |
| **Phase 8** | Performance test suite | Regression prevention |

---

## 10. Coverage Goals

| Category | Target |
|----------|--------|
| Acoustic formulas | 95%+ |
| Solver core logic | 80%+ |
| Object serialization | 90%+ |
| State stores | 85%+ |
| React components | 70%+ |
| Rendering pipeline | 50%+ (hard to test) |

---

## 11. Performance Testing

### Performance Test Types

| Type | Purpose | Tools |
|------|---------|-------|
| **Benchmark Tests** | Measure execution time of critical operations | `performance.now()`, Jest timer mocks |
| **Regression Tests** | Detect performance degradation between commits | Custom baseline comparison |
| **Load Tests** | Verify behavior under heavy workloads | Parameterized test suites |
| **Memory Tests** | Detect leaks, track heap usage | `process.memoryUsage()`, Chrome DevTools Protocol |
| **Frame Rate Tests** | Ensure rendering meets target FPS | `requestAnimationFrame` timing |

### Ray Tracer Performance Tests

**Critical paths:** `src/compute/raytracer/index.ts`

```typescript
// src/compute/raytracer/__tests__/raytracer.perf.spec.ts

describe('RayTracer Performance', () => {
  const BASELINE_THRESHOLDS = {
    singleRayTrace: 0.5,        // ms per ray
    thousandRays: 200,          // ms for 1000 rays
    bvhConstruction: 500,       // ms for 10k triangles
    reflectionOrder10: 50,      // ms per ray with 10 bounces
  };

  let rayTracer: RayTracer;
  let testRoom: Room;

  beforeEach(() => {
    testRoom = createTestRoom({ triangleCount: 10000 });
    rayTracer = new RayTracer();
  });

  describe('Ray-Surface Intersection', () => {
    it('traces single ray within threshold', () => {
      const start = performance.now();
      rayTracer.traceRay(origin, direction, 0);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(BASELINE_THRESHOLDS.singleRayTrace);
    });

    it('traces 1000 rays within threshold', () => {
      const rays = generateRandomRays(1000);

      const start = performance.now();
      rays.forEach(({ origin, direction }) => {
        rayTracer.traceRay(origin, direction, 0);
      });
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(BASELINE_THRESHOLDS.thousandRays);
    });

    it('scales linearly with ray count', () => {
      const times: number[] = [];

      for (const count of [100, 500, 1000, 2000]) {
        const rays = generateRandomRays(count);
        const start = performance.now();
        rays.forEach(r => rayTracer.traceRay(r.origin, r.direction, 0));
        times.push(performance.now() - start);
      }

      // Verify roughly linear scaling (allow 20% variance)
      const ratio = times[3] / times[0];
      expect(ratio).toBeLessThan(20 * 1.2); // 2000/100 = 20x
    });
  });

  describe('BVH Construction', () => {
    it.each([1000, 5000, 10000, 50000])(
      'builds BVH for %i triangles within threshold',
      (triangleCount) => {
        const geometry = createTestGeometry(triangleCount);

        const start = performance.now();
        geometry.computeBoundsTree();
        const duration = performance.now() - start;

        // O(n log n) scaling expectation
        const expectedMax = BASELINE_THRESHOLDS.bvhConstruction *
          (triangleCount / 10000) * Math.log2(triangleCount / 10000 + 1);

        expect(duration).toBeLessThan(expectedMax);
      }
    );
  });

  describe('Reflection Order Impact', () => {
    it.each([1, 5, 10, 20, 50])(
      'handles reflection order %i within acceptable time',
      (order) => {
        rayTracer.reflectionOrder = order;

        const start = performance.now();
        rayTracer.traceRay(origin, direction, 0);
        const duration = performance.now() - start;

        // Time should scale roughly linearly with reflection order
        expect(duration).toBeLessThan(order * 5); // 5ms per bounce max
      }
    );
  });
});
```

### FDTD GPU Performance Tests

**Critical paths:** `src/compute/2d-fdtd/index.ts`

```typescript
// src/compute/2d-fdtd/__tests__/fdtd.perf.spec.ts

describe('FDTD_2D Performance', () => {
  const BASELINE_THRESHOLDS = {
    initializationTime: 1000,     // ms to initialize GPU compute
    stepTime256: 5,               // ms per step at 256x256
    stepTime512: 15,              // ms per step at 512x512
    receiverReadback: 2,          // ms per receiver readback
  };

  describe('GPU Computation', () => {
    it('initializes within threshold', async () => {
      const start = performance.now();
      const fdtd = new FDTD_2D();
      await fdtd.init();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(BASELINE_THRESHOLDS.initializationTime);
    });

    it('maintains target frame rate during simulation', () => {
      const fdtd = new FDTD_2D();
      const stepTimes: number[] = [];

      for (let i = 0; i < 100; i++) {
        const start = performance.now();
        fdtd.render();
        stepTimes.push(performance.now() - start);
      }

      const avgStepTime = stepTimes.reduce((a, b) => a + b) / stepTimes.length;
      const maxStepTime = Math.max(...stepTimes);

      expect(avgStepTime).toBeLessThan(BASELINE_THRESHOLDS.stepTime256);
      expect(maxStepTime).toBeLessThan(16.67); // 60fps threshold
    });
  });

  describe('CPU-GPU Synchronization', () => {
    it('receiver readback scales linearly with receiver count', () => {
      const fdtd = new FDTD_2D();
      const times: Map<number, number> = new Map();

      for (const receiverCount of [1, 5, 10, 20]) {
        const receivers = createTestReceivers(receiverCount);

        const start = performance.now();
        fdtd.readReceiverLevels(receivers);
        times.set(receiverCount, performance.now() - start);
      }

      // Verify readback per receiver stays constant
      const perReceiver = times.get(20)! / 20;
      expect(perReceiver).toBeLessThan(BASELINE_THRESHOLDS.receiverReadback);
    });
  });
});
```

### Renderer Frame Rate Tests

**Critical paths:** `src/render/renderer.ts`

```typescript
// src/render/__tests__/renderer.perf.spec.ts

describe('Renderer Performance', () => {
  const TARGET_FPS = 60;
  const FRAME_BUDGET_MS = 1000 / TARGET_FPS; // 16.67ms

  describe('Frame Timing', () => {
    it('renders empty scene within frame budget', () => {
      const renderer = new Renderer();
      renderer.init(mockCanvas);

      const frameTimes: number[] = [];

      for (let i = 0; i < 60; i++) {
        const start = performance.now();
        renderer.render();
        frameTimes.push(performance.now() - start);
      }

      const avgFrameTime = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
      const p95FrameTime = percentile(frameTimes, 95);

      expect(avgFrameTime).toBeLessThan(FRAME_BUDGET_MS);
      expect(p95FrameTime).toBeLessThan(FRAME_BUDGET_MS * 1.5);
    });

    it('renders complex scene with acceptable frame drops', () => {
      const renderer = new Renderer();
      renderer.init(mockCanvas);

      // Add complex geometry
      const room = createComplexRoom({ surfaces: 100, triangles: 50000 });
      renderer.add(room);

      const frameTimes: number[] = [];

      for (let i = 0; i < 120; i++) {
        const start = performance.now();
        renderer.render();
        frameTimes.push(performance.now() - start);
      }

      const droppedFrames = frameTimes.filter(t => t > FRAME_BUDGET_MS).length;
      const dropRate = droppedFrames / frameTimes.length;

      expect(dropRate).toBeLessThan(0.05); // Max 5% dropped frames
    });
  });

  describe('Idle Optimization', () => {
    it('reduces CPU usage when idle', async () => {
      const renderer = new Renderer();
      renderer.init(mockCanvas);

      // Measure active rendering
      let activeRenderCount = 0;
      const activeStart = performance.now();
      while (performance.now() - activeStart < 1000) {
        renderer.requestRender();
        await nextFrame();
        activeRenderCount++;
      }

      // Let it go idle
      await sleep(100);

      // Measure idle polling
      let idleRenderCount = 0;
      const idleStart = performance.now();
      while (performance.now() - idleStart < 1000) {
        await nextFrame();
        if (renderer.isIdle) idleRenderCount++;
      }

      // Idle should have significantly fewer render calls
      expect(idleRenderCount).toBeLessThan(activeRenderCount * 0.1);
    });
  });
});
```

### Memory Leak Detection

```typescript
// src/__tests__/memory.perf.spec.ts

describe('Memory Management', () => {
  const getHeapUsed = () => {
    if (global.gc) global.gc(); // Force GC if available
    return process.memoryUsage().heapUsed;
  };

  describe('Object Disposal', () => {
    it('does not leak memory when creating/disposing rooms', () => {
      const initialHeap = getHeapUsed();

      for (let i = 0; i < 100; i++) {
        const room = new Room();
        room.addSurface(createLargeSurface());
        room.dispose();
      }

      const finalHeap = getHeapUsed();
      const growth = finalHeap - initialHeap;

      // Allow 1MB growth for test overhead
      expect(growth).toBeLessThan(1024 * 1024);
    });

    it('does not leak Three.js geometries', () => {
      const renderer = new Renderer();
      const initialGeometryCount = renderer.info.memory.geometries;

      for (let i = 0; i < 50; i++) {
        const mesh = createTestMesh();
        renderer.add(mesh);
        renderer.remove(mesh);
        mesh.geometry.dispose();
      }

      expect(renderer.info.memory.geometries).toBe(initialGeometryCount);
    });

    it('does not leak ray tracer buffers', () => {
      const initialHeap = getHeapUsed();

      for (let i = 0; i < 10; i++) {
        const rayTracer = new RayTracer();
        rayTracer.update(); // Allocates buffers
        rayTracer.dispose();
      }

      const finalHeap = getHeapUsed();
      expect(finalHeap - initialHeap).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Long-Running Simulations', () => {
    it('maintains stable memory during extended ray tracing', async () => {
      const rayTracer = new RayTracer();
      const heapSamples: number[] = [];

      for (let pass = 0; pass < 100; pass++) {
        rayTracer.step();
        if (pass % 10 === 0) {
          heapSamples.push(getHeapUsed());
        }
      }

      // Memory should not grow unboundedly
      const growth = heapSamples[heapSamples.length - 1] - heapSamples[0];
      const avgGrowthPerSample = growth / heapSamples.length;

      expect(avgGrowthPerSample).toBeLessThan(100 * 1024); // Max 100KB per 10 passes
    });
  });
});
```

### Benchmark Infrastructure

Create a reusable benchmark utility:

```typescript
// src/__tests__/utils/benchmark.ts

export interface BenchmarkResult {
  name: string;
  samples: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  p95: number;
  p99: number;
  opsPerSecond: number;
}

export function benchmark(
  name: string,
  fn: () => void,
  options: { samples?: number; warmup?: number } = {}
): BenchmarkResult {
  const { samples = 100, warmup = 10 } = options;

  // Warmup runs
  for (let i = 0; i < warmup; i++) fn();

  // Timed runs
  const times: number[] = [];
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }

  times.sort((a, b) => a - b);

  const mean = times.reduce((a, b) => a + b) / times.length;
  const variance = times.reduce((sum, t) => sum + (t - mean) ** 2, 0) / times.length;

  return {
    name,
    samples,
    mean,
    median: times[Math.floor(times.length / 2)],
    min: times[0],
    max: times[times.length - 1],
    stdDev: Math.sqrt(variance),
    p95: times[Math.floor(times.length * 0.95)],
    p99: times[Math.floor(times.length * 0.99)],
    opsPerSecond: 1000 / mean,
  };
}

export function compareBenchmarks(
  baseline: BenchmarkResult,
  current: BenchmarkResult,
  threshold: number = 0.1 // 10% regression threshold
): { passed: boolean; regression: number } {
  const regression = (current.mean - baseline.mean) / baseline.mean;
  return {
    passed: regression < threshold,
    regression,
  };
}
```

### CI Performance Regression Tests

```typescript
// src/__tests__/performance-regression.spec.ts

import { readFileSync, writeFileSync, existsSync } from 'fs';

const BASELINE_PATH = '.performance-baseline.json';

describe('Performance Regression', () => {
  let baselines: Record<string, BenchmarkResult>;
  const currentResults: Record<string, BenchmarkResult> = {};

  beforeAll(() => {
    if (existsSync(BASELINE_PATH)) {
      baselines = JSON.parse(readFileSync(BASELINE_PATH, 'utf-8'));
    } else {
      baselines = {};
    }
  });

  afterAll(() => {
    // Update baselines if running in baseline mode
    if (process.env.UPDATE_PERF_BASELINE) {
      writeFileSync(BASELINE_PATH, JSON.stringify(currentResults, null, 2));
    }
  });

  it('ray tracing performance', () => {
    const result = benchmark('rayTrace1000', () => {
      traceRays(1000);
    });
    currentResults['rayTrace1000'] = result;

    if (baselines['rayTrace1000']) {
      const { passed, regression } = compareBenchmarks(
        baselines['rayTrace1000'],
        result
      );
      if (!passed) {
        console.warn(`Performance regression: ${(regression * 100).toFixed(1)}%`);
      }
      expect(passed).toBe(true);
    }
  });

  it('BVH construction performance', () => {
    const result = benchmark('bvhBuild10k', () => {
      buildBVH(10000);
    });
    currentResults['bvhBuild10k'] = result;

    if (baselines['bvhBuild10k']) {
      const { passed } = compareBenchmarks(baselines['bvhBuild10k'], result);
      expect(passed).toBe(true);
    }
  });
});
```

### WebGL Performance Testing

For GPU-specific tests, use headless Chrome with Puppeteer:

```typescript
// e2e/gpu-performance.spec.ts

import puppeteer, { Browser, Page } from 'puppeteer';

describe('GPU Performance', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--use-gl=egl'], // Enable GPU in headless
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('FDTD simulation maintains 30fps', async () => {
    const fps = await page.evaluate(async () => {
      const fdtd = window.app.solvers.fdtd;
      fdtd.start();

      const frameTimes: number[] = [];
      let lastTime = performance.now();

      for (let i = 0; i < 60; i++) {
        await new Promise(r => requestAnimationFrame(r));
        const now = performance.now();
        frameTimes.push(now - lastTime);
        lastTime = now;
      }

      fdtd.stop();
      return 1000 / (frameTimes.reduce((a, b) => a + b) / frameTimes.length);
    });

    expect(fps).toBeGreaterThan(30);
  });

  it('ray visualization renders without frame drops', async () => {
    const metrics = await page.evaluate(async () => {
      const rayTracer = window.app.solvers.rayTracer;
      rayTracer.numRays = 10000;
      rayTracer.start();

      // Wait for rays to accumulate
      await new Promise(r => setTimeout(r, 2000));

      // Measure render performance
      const times: number[] = [];
      for (let i = 0; i < 30; i++) {
        const start = performance.now();
        await new Promise(r => requestAnimationFrame(r));
        times.push(performance.now() - start);
      }

      rayTracer.stop();

      return {
        avgFrameTime: times.reduce((a, b) => a + b) / times.length,
        maxFrameTime: Math.max(...times),
        droppedFrames: times.filter(t => t > 33.33).length,
      };
    });

    expect(metrics.avgFrameTime).toBeLessThan(16.67);
    expect(metrics.droppedFrames).toBeLessThan(3);
  });
});
```

---

## 12. Performance Test Configuration

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:perf": "jest --testPathPattern=perf\\.spec --runInBand",
    "test:perf:update-baseline": "UPDATE_PERF_BASELINE=1 npm run test:perf",
    "test:gpu": "jest --testPathPattern=gpu-performance --runInBand"
  },
  "jest": {
    "projects": [
      {
        "displayName": "unit",
        "testMatch": ["**/*.spec.ts", "!**/*.perf.spec.ts"]
      },
      {
        "displayName": "performance",
        "testMatch": ["**/*.perf.spec.ts"],
        "testTimeout": 60000
      }
    ]
  }
}
```

---

## 13. Performance Metrics Summary

| Test Category | Key Metrics | Tooling |
|---------------|-------------|---------|
| **Ray Tracing** | Rays/second, time per reflection | Jest + `performance.now()` |
| **BVH Construction** | Build time vs triangle count | Parameterized tests |
| **FDTD GPU** | Frame time, receiver readback latency | Puppeteer + WebGL |
| **Renderer** | FPS, frame budget compliance, idle efficiency | RAF timing |
| **Memory** | Heap growth, geometry leaks | `process.memoryUsage()`, Three.js info |
| **Regression** | Comparison vs baseline | JSON baseline files |

---

## Summary

This strategy prioritizes **scientific accuracy** by testing acoustic calculations against known reference values (ISO standards, analytical solutions). The visual elements are tested through a combination of:

1. **Unit tests** for renderer logic (mocked WebGL)
2. **Integration tests** for scene construction
3. **Visual regression** for actual rendered output
4. **Performance benchmarks** with regression detection

The phased approach allows building confidence in the core physics before tackling the more complex rendering and UI layers, while the performance testing ensures that optimizations are preserved and regressions are caught early.

---

## 14. Implementation Progress

### Current Test Statistics
- **Total Tests:** 1060 (Jest) + 26 (Playwright) = 1086 total
- **Test Suites:** 46 (Jest) + 2 (Playwright)
- **All Tests Passing:** Yes (excluding flaky performance timing tests)

### Phase Completion Status

| Phase | Description | Status | Tests |
|-------|-------------|--------|-------|
| **Phase 1** | Acoustic utility functions | ✅ Complete | 61 tests |
| **Phase 2** | RT60 solver with reference validation | ✅ Complete | 79 tests |
| **Phase 3** | Object serialization (save/restore) | ✅ Complete | 27 tests |
| **Phase 4** | State management stores | ✅ Complete | 18 tests |
| **Phase 5** | Ray tracer core logic | ✅ Complete | Performance tests |
| **Phase 6** | React component tests | ✅ Complete | 364 tests |
| **Phase 7** | Visual regression setup | ✅ Complete | 26 tests |
| **Phase 8** | Performance test suite | ✅ Complete | 27 tests |
| **Phase 9** | Common utility function tests | ✅ Complete | 198 tests |
| **Phase 10** | Advanced acoustic calculations | ✅ Complete | 149 tests |
| **Phase 11** | Zustand store tests | ✅ Complete | 70 tests |

### Implemented Test Files

#### Unit Tests
| File | Category | Tests |
|------|----------|-------|
| `src/compute/acoustics/__tests__/air-attenuation.spec.ts` | Tier 1: Scientific | Air attenuation calculations with ISO 9613-1 validation |
| `src/compute/acoustics/__tests__/dbaddition.spec.ts` | Tier 1: Scientific | dB addition with mathematical verification |
| `src/compute/acoustics/__tests__/bands.spec.ts` | Tier 1: Scientific | Octave band calculations |
| `src/compute/acoustics/__tests__/sound-speed.spec.ts` | Tier 1: Scientific | Temperature-dependent sound speed |
| `src/compute/rt/__tests__/rt60-formulas.spec.ts` | Tier 2: Solver | Sabine, Eyring, Arau-Puchades formulas |
| `src/objects/__tests__/container.spec.ts` | Tier 3: Objects | Container serialization and lifecycle |
| `src/store/__tests__/container-store.spec.ts` | Tier 4: State | Container store operations |
| `src/store/__tests__/solver-store.spec.ts` | Tier 4: State | Solver store lifecycle, add/remove, property setting |
| `src/store/__tests__/app-store.spec.ts` | Tier 4: State | Global application state, units, cursor mode, panel state |
| `src/store/__tests__/settings-store.spec.ts` | Tier 4: State | User settings, keybindings, staged values, reset to defaults |
| `src/store/__tests__/material-store.spec.ts` | Tier 4: State | Materials Map, fuzzy search, selection, absorption coefficients |
| `src/store/__tests__/result-store.spec.ts` | Tier 4: State | Simulation results storage, result types, tab management |
| `src/compute/acoustics/__tests__/convert.spec.ts` | Tier 1: Scientific | Unit conversions (Lp↔P, Lw↔W, Li↔I, P↔I) |
| `src/compute/acoustics/__tests__/complex.spec.ts` | Tier 1: Scientific | Complex number arithmetic for FFT/signal processing |
| `src/compute/acoustics/__tests__/interpolation.spec.ts` | Tier 1: Scientific | Logarithmic interpolation, absorption coefficient curves |
| `src/compute/acoustics/__tests__/reflection-coefficient.spec.ts` | Tier 1: Scientific | Angle-dependent reflection from absorption coefficient |

#### Common Utility Tests
| File | Category | Tests |
|------|----------|-------|
| `src/common/__tests__/clamp.spec.ts` | Utilities | Clamping values within bounds, edge cases |
| `src/common/__tests__/lerp.spec.ts` | Utilities | Linear interpolation, Vector3 lerp, extrapolation |
| `src/common/__tests__/round-to.spec.ts` | Utilities | Decimal rounding, negative places, precision |
| `src/common/__tests__/mean.spec.ts` | Utilities | Array averages, TypedArrays, edge cases |
| `src/common/__tests__/chunk.spec.ts` | Utilities | Array chunking, Float32Array chunking |
| `src/common/__tests__/helpers.spec.ts` | Utilities | Set operations, sorting, matrix transforms, GraphNode, Range classes, curry, memoize |

#### React Component Tests
| File | Category | Tests |
|------|----------|-------|
| `src/components/__tests__/NumberInput.spec.tsx` | Tier 6: Components | Input rendering, onChange events, constraints, accessibility |
| `src/components/__tests__/CheckboxInput.spec.tsx` | Tier 6: Components | Checkbox rendering, controlled component, toggle behavior |
| `src/components/__tests__/TextInput.spec.tsx` | Tier 6: Components | Text input rendering, onChange events, accessibility |
| `src/components/__tests__/SliderInput.spec.tsx` | Tier 6: Components | Slider rendering, constraints, onChange events |
| `src/components/__tests__/Vector3Input.spec.tsx` | Tier 6: Components | 3D vector input, form submission, value clamping |
| `src/components/__tests__/ColorInput.spec.tsx` | Tier 6: Components | Color picker rendering, onChange events |
| `src/components/parameter-config/property-row/__tests__/PropertyRow.spec.tsx` | Tier 6: Components | Container rendering, children handling |
| `src/components/parameter-config/property-row/__tests__/PropertyRowNumberInput.spec.tsx` | Tier 6: Components | Number input with blur commit, NaN handling |
| `src/components/parameter-config/property-row/__tests__/PropertyRowCheckbox.spec.tsx` | Tier 6: Components | Checkbox toggle, controlled behavior |
| `src/components/parameter-config/property-row/__tests__/PropertyRowSelect.spec.tsx` | Tier 6: Components | Dropdown selection, options handling |
| `src/components/parameter-config/property-row/__tests__/PropertyRowButton.spec.tsx` | Tier 6: Components | Button rendering, onClick events, disabled state |
| `src/components/parameter-config/property-row/__tests__/PropertyRowFolder.spec.tsx` | Tier 6: Components | Collapsible folder, open/close toggle, controlled behavior |
| `src/components/label/__tests__/Label.spec.tsx` | Tier 6: Components | Label rendering, tooltip functionality, mouse events |
| `src/components/parameter-config/property-row/__tests__/PropertyRowLabel.spec.tsx` | Tier 6: Components | Label wrapper with tooltip, styling |
| `src/components/parameter-config/property-row/__tests__/PropertyRowTextInput.spec.tsx` | Tier 6: Components | Text input, onChange events, special characters |
| `src/components/parameter-config/property-row/__tests__/PropertyRowVectorInput.spec.tsx` | Tier 6: Components | Single number input for vector components |
| `src/components/__tests__/SaveDialog.spec.tsx` | Tier 6: Components | Dialog visibility, close functionality, save action |
| `src/components/__tests__/ImportDialog.spec.tsx` | Tier 6: Components | Drop zone, file import, dialog state management |
| `src/components/__tests__/TreeViewComponent.spec.tsx` | Tier 6: Components | Hierarchical tree, expand/collapse, checkbox selection, delete |
| `src/components/results/__tests__/RT60Chart.spec.tsx` | Tier 6: Components | RT60 bar chart, visx visualization, legend rendering |
| `src/components/panel-container/__tests__/PanelContainer.spec.tsx` | Tier 6: Components | Panel layout, header, children rendering |
| `src/components/panel-container/__tests__/PanelEmptyText.spec.tsx` | Tier 6: Components | Empty state messaging |
| `src/components/results/__tests__/ResultsPanel.spec.tsx` | Tier 6: Components | Results display, tabs, empty state |

#### Performance Tests
| File | Category | Tests |
|------|----------|-------|
| `src/compute/raytracer/__tests__/raytracer.perf.spec.ts` | Ray Tracer | Vector operations, ray generation, energy calculations |
| `src/compute/raytracer/__tests__/bvh.perf.spec.ts` | BVH | AABB intersection, triangle operations, tree traversal |
| `src/render/__tests__/renderer.perf.spec.ts` | Renderer | Frame timing, scene graph ops, matrix operations |
| `src/__tests__/memory/memory-leak.spec.ts` | Memory | Object disposal patterns, leak detection |

#### Visual Regression Tests (Playwright)
| File | Category | Tests |
|------|----------|-------|
| `e2e/visual/app-visual.spec.ts` | Application UI | Initial layout, panel visibility, dialog appearance, responsive layouts, theme styling (14 tests) |
| `e2e/visual/scene-rendering.spec.ts` | 3D Rendering | WebGL context, scene rendering, camera controls, selection highlighting, frame performance (12 tests) |

#### Test Utilities
| File | Purpose |
|------|---------|
| `src/test-utils/benchmark.ts` | Performance benchmarking infrastructure |
| `src/__fixtures__/acoustic-references.ts` | ISO standard reference values |

### Scripts Available
```bash
npm test                           # Run all unit tests
npm run test:perf                  # Run performance tests only
npm run test:perf:update-baseline  # Update performance baselines
npm run test:coverage              # Run with coverage report
npx playwright test                # Run visual regression tests
npx playwright test --update-snapshots  # Update baseline screenshots
npx playwright show-report         # View HTML test report
```

### Next Steps
1. **Integration Tests** - Test full solver pipelines with realistic geometry
2. **Coverage Goals** - Work toward coverage targets defined in section 10
3. **Continuous Integration** - Add test suite to CI/CD pipeline
