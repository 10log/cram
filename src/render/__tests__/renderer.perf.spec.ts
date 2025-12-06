/**
 * Performance tests for the Renderer
 *
 * These tests measure rendering performance and frame rate stability.
 * Run with: npm run test:perf
 */

import { benchmark } from '../../test-utils/benchmark';

// Mock Three.js and related modules
jest.mock('three');

jest.mock('../../store', () => ({
  useContainer: {
    getState: () => ({
      containers: {},
      getRooms: () => [],
    }),
  },
  useSolver: {
    getState: () => ({ solvers: {} }),
  },
}));

jest.mock('../../messenger', () => ({
  emit: jest.fn(),
  on: jest.fn(),
  messenger: {
    on: jest.fn(),
    emit: jest.fn(),
  },
}));

describe('Renderer Performance', () => {
  describe('Frame Timing', () => {
    it('requestAnimationFrame callback pattern is performant', () => {
      let frameCount = 0;
      const frameTimes: number[] = [];
      let lastTime = performance.now();

      // Simulate frame timing measurement
      const measureFrame = () => {
        const now = performance.now();
        frameTimes.push(now - lastTime);
        lastTime = now;
        frameCount++;
      };

      const result = benchmark(
        'Frame timing measurement',
        () => {
          for (let i = 0; i < 60; i++) {
            measureFrame();
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Frame timing (60 frames): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(10); // Should measure 60 frames in under 10ms
    });

    it('frame budget calculation is performant', () => {
      const targetFPS = 60;
      const frameBudget = 1000 / targetFPS; // ~16.67ms

      const result = benchmark(
        'Frame budget check',
        () => {
          for (let i = 0; i < 1000; i++) {
            const frameStart = performance.now();
            // Simulate work
            let sum = 0;
            for (let j = 0; j < 100; j++) {
              sum += Math.random();
            }
            const frameTime = performance.now() - frameStart;
            const withinBudget = frameTime < frameBudget;
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Frame budget calculation: ${result.mean.toFixed(3)}ms per 1000`);
      expect(result.mean).toBeLessThan(20);
    });
  });

  describe('Scene Graph Operations', () => {
    it('object traversal is performant', () => {
      interface MockObject3D {
        uuid: string;
        visible: boolean;
        children: MockObject3D[];
      }

      // Build a large scene graph
      const buildTree = (depth: number, breadth: number): MockObject3D => {
        const node: MockObject3D = {
          uuid: Math.random().toString(36).substr(2, 9),
          visible: true,
          children: [],
        };
        if (depth > 0) {
          for (let i = 0; i < breadth; i++) {
            node.children.push(buildTree(depth - 1, breadth));
          }
        }
        return node;
      };

      const scene = buildTree(4, 5); // 5^4 = 625 leaf nodes

      const traverse = (node: MockObject3D, callback: (n: MockObject3D) => void) => {
        callback(node);
        for (const child of node.children) {
          traverse(child, callback);
        }
      };

      const result = benchmark(
        'Scene graph traversal',
        () => {
          let count = 0;
          traverse(scene, () => {
            count++;
          });
        },
        { samples: 100, warmup: 10 }
      );

      console.log(`Scene traversal (~780 nodes): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(5);
    });

    it('visible object filtering is performant', () => {
      interface MockObject3D {
        visible: boolean;
        children: MockObject3D[];
      }

      const createObjects = (count: number): MockObject3D[] => {
        const objects: MockObject3D[] = [];
        for (let i = 0; i < count; i++) {
          objects.push({
            visible: Math.random() > 0.3, // 70% visible
            children: [],
          });
        }
        return objects;
      };

      const objects = createObjects(1000);

      const result = benchmark(
        'Visible object filtering',
        () => {
          const visible = objects.filter(obj => obj.visible);
        },
        { samples: 100, warmup: 10 }
      );

      console.log(`Filter 1000 objects: ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(2);
    });

    it('frustum culling check is performant', () => {
      // Simplified frustum-box intersection test
      const frustumContainsBox = (
        frustumPlanes: Array<{ normal: number[]; constant: number }>,
        boxMin: number[],
        boxMax: number[]
      ): boolean => {
        for (const plane of frustumPlanes) {
          // Find the corner of the box most aligned with the plane normal
          const px = plane.normal[0] > 0 ? boxMax[0] : boxMin[0];
          const py = plane.normal[1] > 0 ? boxMax[1] : boxMin[1];
          const pz = plane.normal[2] > 0 ? boxMax[2] : boxMin[2];

          // Dot product + constant
          const d = plane.normal[0] * px + plane.normal[1] * py + plane.normal[2] * pz + plane.constant;

          if (d < 0) return false;
        }
        return true;
      };

      // Create frustum planes (simplified)
      const frustumPlanes = [
        { normal: [0, 0, 1], constant: 0 }, // Near
        { normal: [0, 0, -1], constant: 100 }, // Far
        { normal: [1, 0, 0], constant: 50 }, // Left
        { normal: [-1, 0, 0], constant: 50 }, // Right
        { normal: [0, 1, 0], constant: 50 }, // Bottom
        { normal: [0, -1, 0], constant: 50 }, // Top
      ];

      const result = benchmark(
        'Frustum culling',
        () => {
          for (let i = 0; i < 1000; i++) {
            const boxMin = [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100];
            const boxMax = [boxMin[0] + 5, boxMin[1] + 5, boxMin[2] + 5];
            frustumContainsBox(frustumPlanes, boxMin, boxMax);
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Frustum culling (1000 boxes): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(10);
    });
  });

  describe('Matrix Operations', () => {
    it('matrix multiplication is performant', () => {
      const multiplyMatrices = (a: number[], b: number[]): number[] => {
        const result = new Array(16).fill(0);
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
              result[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
            }
          }
        }
        return result;
      };

      const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

      const result = benchmark(
        'Matrix multiplication',
        () => {
          for (let i = 0; i < 1000; i++) {
            const m1 = identity.map(v => v + Math.random() * 0.1);
            const m2 = identity.map(v => v + Math.random() * 0.1);
            multiplyMatrices(m1, m2);
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Matrix multiplication: ${result.mean.toFixed(3)}ms per 1000`);
      expect(result.mean).toBeLessThan(20);
    });

    it('world matrix update cascade is performant', () => {
      interface MockObject3D {
        localMatrix: number[];
        worldMatrix: number[];
        parent: MockObject3D | null;
        children: MockObject3D[];
      }

      const multiplyMatrices = (a: number[], b: number[]): number[] => {
        const result = new Array(16).fill(0);
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
              result[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
            }
          }
        }
        return result;
      };

      const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

      const createHierarchy = (depth: number, parent: MockObject3D | null = null): MockObject3D => {
        const node: MockObject3D = {
          localMatrix: [...identity],
          worldMatrix: [...identity],
          parent,
          children: [],
        };
        if (depth > 0) {
          for (let i = 0; i < 3; i++) {
            node.children.push(createHierarchy(depth - 1, node));
          }
        }
        return node;
      };

      const updateWorldMatrix = (node: MockObject3D) => {
        if (node.parent) {
          node.worldMatrix = multiplyMatrices(node.parent.worldMatrix, node.localMatrix);
        } else {
          node.worldMatrix = [...node.localMatrix];
        }
        for (const child of node.children) {
          updateWorldMatrix(child);
        }
      };

      const root = createHierarchy(5); // 3^5 = 243 objects

      const result = benchmark(
        'World matrix cascade',
        () => {
          updateWorldMatrix(root);
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`World matrix update (364 nodes): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(50);
    });
  });

  describe('Draw Call Batching', () => {
    it('sorting by material is performant', () => {
      interface DrawCall {
        materialId: string;
        geometryId: string;
        distance: number;
      }

      const createDrawCalls = (count: number): DrawCall[] => {
        const materials = ['mat1', 'mat2', 'mat3', 'mat4', 'mat5'];
        const geometries = ['geo1', 'geo2', 'geo3', 'geo4', 'geo5'];

        return Array.from({ length: count }, () => ({
          materialId: materials[Math.floor(Math.random() * materials.length)],
          geometryId: geometries[Math.floor(Math.random() * geometries.length)],
          distance: Math.random() * 100,
        }));
      };

      const drawCalls = createDrawCalls(500);

      const result = benchmark(
        'Draw call sorting',
        () => {
          // Sort by material first, then by geometry (for batching)
          const sorted = [...drawCalls].sort((a, b) => {
            if (a.materialId !== b.materialId) {
              return a.materialId.localeCompare(b.materialId);
            }
            return a.geometryId.localeCompare(b.geometryId);
          });
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Draw call sorting (500 calls): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(10);
    });

    it('transparent object sorting by distance is performant', () => {
      interface TransparentObject {
        distance: number;
      }

      const objects: TransparentObject[] = Array.from({ length: 200 }, () => ({
        distance: Math.random() * 100,
      }));

      const result = benchmark(
        'Distance sorting',
        () => {
          // Sort back to front for proper transparency
          const sorted = [...objects].sort((a, b) => b.distance - a.distance);
        },
        { samples: 100, warmup: 10 }
      );

      console.log(`Distance sorting (200 objects): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(2);
    });
  });

  describe('Buffer Updates', () => {
    it('vertex buffer updates are performant', () => {
      const vertexCount = 10000;
      const positions = new Float32Array(vertexCount * 3);

      const result = benchmark(
        'Vertex buffer update',
        () => {
          for (let i = 0; i < vertexCount; i++) {
            positions[i * 3] = Math.random() * 10;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = Math.random() * 10;
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Vertex buffer update (${vertexCount} vertices): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(10);
    });

    it('partial buffer updates are faster than full updates', () => {
      const vertexCount = 10000;
      const positions = new Float32Array(vertexCount * 3);

      // Initialize
      for (let i = 0; i < positions.length; i++) {
        positions[i] = Math.random();
      }

      const fullUpdate = benchmark(
        'Full buffer update',
        () => {
          for (let i = 0; i < vertexCount; i++) {
            positions[i * 3] = Math.random() * 10;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = Math.random() * 10;
          }
        },
        { samples: 20, warmup: 3 }
      );

      const partialCount = vertexCount / 10; // Update 10%
      const partialUpdate = benchmark(
        'Partial buffer update',
        () => {
          for (let i = 0; i < partialCount; i++) {
            const idx = Math.floor(Math.random() * vertexCount);
            positions[idx * 3] = Math.random() * 10;
            positions[idx * 3 + 1] = Math.random() * 10;
            positions[idx * 3 + 2] = Math.random() * 10;
          }
        },
        { samples: 20, warmup: 3 }
      );

      console.log(`Full update: ${fullUpdate.mean.toFixed(3)}ms`);
      console.log(`Partial update (10%): ${partialUpdate.mean.toFixed(3)}ms`);

      // Partial updates should be faster
      expect(partialUpdate.mean).toBeLessThan(fullUpdate.mean);
    });
  });

  describe('Color and Material Operations', () => {
    it('color interpolation is performant', () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const lerpColor = (
        c1: { r: number; g: number; b: number },
        c2: { r: number; g: number; b: number },
        t: number
      ) => ({
        r: lerp(c1.r, c2.r, t),
        g: lerp(c1.g, c2.g, t),
        b: lerp(c1.b, c2.b, t),
      });

      const result = benchmark(
        'Color interpolation',
        () => {
          for (let i = 0; i < 10000; i++) {
            const c1 = { r: Math.random(), g: Math.random(), b: Math.random() };
            const c2 = { r: Math.random(), g: Math.random(), b: Math.random() };
            lerpColor(c1, c2, Math.random());
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Color interpolation: ${result.mean.toFixed(3)}ms per 10000`);
      expect(result.mean).toBeLessThan(10);
    });
  });

  describe('Frame Rate Stability', () => {
    it('simulated render loop maintains timing', () => {
      const frames: number[] = [];
      const targetFrameTime = 16.67; // 60 FPS
      let lastTime = 0;

      const simulateFrame = (time: number) => {
        if (lastTime > 0) {
          frames.push(time - lastTime);
        }
        lastTime = time;
      };

      // Simulate 60 frames
      for (let i = 0; i < 60; i++) {
        simulateFrame(i * targetFrameTime);
      }

      // Calculate jitter
      const avgFrameTime = frames.reduce((a, b) => a + b, 0) / frames.length;
      const variance =
        frames.reduce((sum, t) => sum + Math.pow(t - avgFrameTime, 2), 0) / frames.length;
      const jitter = Math.sqrt(variance);

      expect(avgFrameTime).toBeCloseTo(targetFrameTime, 1);
      expect(jitter).toBeLessThan(1); // Very low jitter for simulated frames
    });

    it('frame time statistics are accurate', () => {
      const frameTimes = [16.5, 16.8, 16.4, 17.1, 16.6, 16.9, 16.3, 16.7, 16.5, 16.8];

      const calculateStats = (times: number[]) => {
        const sorted = [...times].sort((a, b) => a - b);
        const sum = times.reduce((a, b) => a + b, 0);
        const avg = sum / times.length;
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        const variance = times.reduce((s, t) => s + Math.pow(t - avg, 2), 0) / times.length;
        const stdDev = Math.sqrt(variance);

        return { avg, min, max, p95, stdDev };
      };

      const stats = calculateStats(frameTimes);

      expect(stats.avg).toBeCloseTo(16.66, 1);
      expect(stats.min).toBe(16.3);
      expect(stats.max).toBe(17.1);
      expect(stats.stdDev).toBeLessThan(0.5);
    });
  });

  describe('WebGL State Management', () => {
    it('state change tracking is performant', () => {
      interface GLState {
        blendEnabled: boolean;
        depthTest: boolean;
        cullFace: boolean;
        currentProgram: number;
        activeTexture: number;
      }

      const stateChanges: string[] = [];

      const setState = (current: GLState, next: GLState) => {
        if (current.blendEnabled !== next.blendEnabled) {
          stateChanges.push('blend');
        }
        if (current.depthTest !== next.depthTest) {
          stateChanges.push('depthTest');
        }
        if (current.cullFace !== next.cullFace) {
          stateChanges.push('cullFace');
        }
        if (current.currentProgram !== next.currentProgram) {
          stateChanges.push('program');
        }
        if (current.activeTexture !== next.activeTexture) {
          stateChanges.push('texture');
        }
        return next;
      };

      const result = benchmark(
        'State change tracking',
        () => {
          stateChanges.length = 0;
          let state: GLState = {
            blendEnabled: false,
            depthTest: true,
            cullFace: true,
            currentProgram: 0,
            activeTexture: 0,
          };

          for (let i = 0; i < 1000; i++) {
            const nextState: GLState = {
              blendEnabled: Math.random() > 0.5,
              depthTest: Math.random() > 0.3,
              cullFace: Math.random() > 0.3,
              currentProgram: Math.floor(Math.random() * 10),
              activeTexture: Math.floor(Math.random() * 8),
            };
            state = setState(state, nextState);
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`State change tracking (1000 changes): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(10);
    });
  });
});
