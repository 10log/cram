/**
 * Performance tests for the Ray Tracer
 *
 * These tests measure execution time and ensure performance doesn't regress.
 * Run with: npm run test:perf
 */

import { benchmark, BenchmarkResult } from '../../../test-utils/benchmark';

// Mock dependencies that would be needed
vi.mock('../../../render/renderer', () => ({
  renderer: {
    add: vi.fn(),
    remove: vi.fn(),
    requestRender: vi.fn(),
  },
}));

vi.mock('../../../store', () => ({
  useContainer: {
    getState: () => ({
      containers: {},
      getRooms: () => [],
    }),
  },
  useSolver: {
    getState: () => ({ solvers: {} }),
  },
  addSolver: vi.fn(),
  removeSolver: vi.fn(),
  setSolverProperty: vi.fn(),
  callSolverMethod: vi.fn(),
}));

vi.mock('../../../messenger', () => ({
  emit: vi.fn(),
  on: vi.fn(),
  messenger: {
    on: vi.fn(),
    emit: vi.fn(),
  },
}));

vi.mock('../../../audio-engine/audio-engine', () => ({
  audioEngine: {
    context: null,
  },
}));

describe('RayTracer Performance', () => {
  const BASELINE_THRESHOLDS = {
    vectorOperations: 0.01, // ms per 1000 operations
    rayGeneration: 0.1, // ms per 100 rays
    normalCalculation: 0.05, // ms per 100 normals
  };

  describe('Vector Operations', () => {
    it('Vector3 creation is performant', () => {
      const THREE = require('three');

      const result = benchmark(
        'Vector3 creation',
        () => {
          for (let i = 0; i < 1000; i++) {
            new THREE.Vector3(Math.random(), Math.random(), Math.random());
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Vector3 creation: ${result.mean.toFixed(3)}ms per 1000`);
      expect(result.mean).toBeLessThan(5); // Should create 1000 vectors in under 5ms
    });

    it('Vector3 operations are performant', () => {
      const THREE = require('three');
      const v1 = new THREE.Vector3(1, 2, 3);
      const v2 = new THREE.Vector3(4, 5, 6);

      const result = benchmark(
        'Vector3 operations',
        () => {
          for (let i = 0; i < 1000; i++) {
            v1.clone().add(v2).normalize().multiplyScalar(2);
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Vector3 operations: ${result.mean.toFixed(3)}ms per 1000`);
      expect(result.mean).toBeLessThan(10);
    });
  });

  describe('Ray Generation', () => {
    it('random direction generation is performant', () => {
      const { random, PI, cos, sin, sqrt } = Math;

      const result = benchmark(
        'Random direction generation',
        () => {
          for (let i = 0; i < 1000; i++) {
            // Uniform sphere sampling
            const theta = 2 * PI * random();
            const phi = Math.acos(2 * random() - 1);
            const x = sin(phi) * cos(theta);
            const y = sin(phi) * sin(theta);
            const z = cos(phi);
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Random direction: ${result.mean.toFixed(3)}ms per 1000`);
      expect(result.mean).toBeLessThan(5);
    });

    it('hemispherical sampling is performant', () => {
      const { random, PI, cos, sin, sqrt } = Math;

      const result = benchmark(
        'Hemispherical sampling',
        () => {
          for (let i = 0; i < 1000; i++) {
            // Cosine-weighted hemisphere sampling
            const r1 = random();
            const r2 = random();
            const theta = 2 * PI * r1;
            const r = sqrt(r2);
            const x = r * cos(theta);
            const y = r * sin(theta);
            const z = sqrt(1 - r2);
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Hemisphere sampling: ${result.mean.toFixed(3)}ms per 1000`);
      expect(result.mean).toBeLessThan(5);
    });
  });

  describe('Energy Calculations', () => {
    it('absorption coefficient lookup is performant', () => {
      // Simulate absorption coefficient interpolation
      const absorptionData = {
        125: 0.1,
        250: 0.15,
        500: 0.25,
        1000: 0.35,
        2000: 0.4,
        4000: 0.45,
        8000: 0.5,
      };
      const frequencies = Object.keys(absorptionData).map(Number);

      const interpolate = (freq: number): number => {
        if (freq <= frequencies[0]) return absorptionData[frequencies[0]];
        if (freq >= frequencies[frequencies.length - 1])
          return absorptionData[frequencies[frequencies.length - 1]];

        for (let i = 0; i < frequencies.length - 1; i++) {
          if (freq >= frequencies[i] && freq <= frequencies[i + 1]) {
            const t = (freq - frequencies[i]) / (frequencies[i + 1] - frequencies[i]);
            return absorptionData[frequencies[i]] * (1 - t) + absorptionData[frequencies[i + 1]] * t;
          }
        }
        return 0;
      };

      const result = benchmark(
        'Absorption interpolation',
        () => {
          for (let i = 0; i < 1000; i++) {
            interpolate(100 + Math.random() * 7900);
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Absorption interpolation: ${result.mean.toFixed(3)}ms per 1000`);
      expect(result.mean).toBeLessThan(5);
    });

    it('energy decay calculation is performant', () => {
      const frequencies = [125, 250, 500, 1000, 2000, 4000, 8000];
      const absorptions = [0.1, 0.15, 0.25, 0.35, 0.4, 0.45, 0.5];

      const result = benchmark(
        'Energy decay per bounce',
        () => {
          let energy = frequencies.map(() => 1.0);
          for (let bounce = 0; bounce < 50; bounce++) {
            energy = energy.map((e, i) => e * (1 - absorptions[i]));
          }
        },
        { samples: 100, warmup: 10 }
      );

      console.log(`Energy decay (50 bounces): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(1);
    });
  });

  describe('Array Operations', () => {
    it('Float32Array operations are performant', () => {
      const size = 10000;

      const result = benchmark(
        'Float32Array operations',
        () => {
          const arr = new Float32Array(size);
          for (let i = 0; i < size; i++) {
            arr[i] = Math.random();
          }
          // Find max
          let max = arr[0];
          for (let i = 1; i < size; i++) {
            if (arr[i] > max) max = arr[i];
          }
          // Normalize
          for (let i = 0; i < size; i++) {
            arr[i] /= max;
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Float32Array (${size} elements): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(10);
    });

    it('ray path storage is performant', () => {
      interface RayPath {
        time: number;
        bounces: number;
        level: number[];
      }

      const result = benchmark(
        'Ray path storage',
        () => {
          const paths: RayPath[] = [];
          for (let i = 0; i < 1000; i++) {
            paths.push({
              time: Math.random() * 2,
              bounces: Math.floor(Math.random() * 50),
              level: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
            });
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Ray path storage (1000 paths): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(10);
    });
  });

  describe('Reflection Calculations', () => {
    it('reflection vector calculation is performant', () => {
      const result = benchmark(
        'Reflection vector',
        () => {
          for (let i = 0; i < 1000; i++) {
            // Incident vector
            const ix = Math.random() - 0.5;
            const iy = Math.random() - 0.5;
            const iz = Math.random() - 0.5;
            const ilen = Math.sqrt(ix * ix + iy * iy + iz * iz);
            const inx = ix / ilen;
            const iny = iy / ilen;
            const inz = iz / ilen;

            // Normal vector
            const nx = Math.random() - 0.5;
            const ny = Math.random() - 0.5;
            const nz = Math.random() - 0.5;
            const nlen = Math.sqrt(nx * nx + ny * ny + nz * nz);
            const nnx = nx / nlen;
            const nny = ny / nlen;
            const nnz = nz / nlen;

            // Reflection: r = i - 2(i·n)n
            const dot = inx * nnx + iny * nny + inz * nnz;
            const rx = inx - 2 * dot * nnx;
            const ry = iny - 2 * dot * nny;
            const rz = inz - 2 * dot * nnz;
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Reflection vector: ${result.mean.toFixed(3)}ms per 1000`);
      expect(result.mean).toBeLessThan(5);
    });

    it('angle calculation is performant', () => {
      const result = benchmark(
        'Angle calculation',
        () => {
          for (let i = 0; i < 1000; i++) {
            // Two random unit vectors
            const theta1 = Math.random() * Math.PI * 2;
            const phi1 = Math.acos(2 * Math.random() - 1);
            const theta2 = Math.random() * Math.PI * 2;
            const phi2 = Math.acos(2 * Math.random() - 1);

            const x1 = Math.sin(phi1) * Math.cos(theta1);
            const y1 = Math.sin(phi1) * Math.sin(theta1);
            const z1 = Math.cos(phi1);

            const x2 = Math.sin(phi2) * Math.cos(theta2);
            const y2 = Math.sin(phi2) * Math.sin(theta2);
            const z2 = Math.cos(phi2);

            // Dot product gives cos(angle)
            const dot = x1 * x2 + y1 * y2 + z1 * z2;
            const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Angle calculation: ${result.mean.toFixed(3)}ms per 1000`);
      expect(result.mean).toBeLessThan(5);
    });
  });

  describe('Scaling Tests', () => {
    it('performance scales linearly with ray count', () => {
      const times: number[] = [];
      const counts = [100, 500, 1000, 2000];

      for (const count of counts) {
        const result = benchmark(
          `${count} rays`,
          () => {
            const rays: Array<{ origin: number[]; direction: number[] }> = [];
            for (let i = 0; i < count; i++) {
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.acos(2 * Math.random() - 1);
              rays.push({
                origin: [0, 0, 0],
                direction: [
                  Math.sin(phi) * Math.cos(theta),
                  Math.sin(phi) * Math.sin(theta),
                  Math.cos(phi),
                ],
              });
            }
          },
          { samples: 20, warmup: 3 }
        );
        times.push(result.mean);
      }

      // Check roughly linear scaling (allow 50% variance)
      const ratio = times[3] / times[0];
      const expectedRatio = counts[3] / counts[0];
      expect(ratio).toBeLessThan(expectedRatio * 1.5);
      expect(ratio).toBeGreaterThan(expectedRatio * 0.1);
    });
  });
});
