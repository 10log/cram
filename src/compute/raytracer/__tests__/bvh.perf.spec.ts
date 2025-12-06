/**
 * Performance tests for BVH (Bounding Volume Hierarchy) construction
 *
 * These tests measure BVH build time and ray intersection performance.
 * Run with: npm run test:perf
 */

import { benchmark } from '../../../test-utils/benchmark';

describe('BVH Performance', () => {
  describe('Bounding Box Operations', () => {
    it('AABB intersection test is performant', () => {
      // Axis-Aligned Bounding Box intersection
      const aabbIntersect = (
        rayOrigin: number[],
        rayDirInv: number[],
        boxMin: number[],
        boxMax: number[]
      ): boolean => {
        let tmin = -Infinity;
        let tmax = Infinity;

        for (let i = 0; i < 3; i++) {
          const t1 = (boxMin[i] - rayOrigin[i]) * rayDirInv[i];
          const t2 = (boxMax[i] - rayOrigin[i]) * rayDirInv[i];
          tmin = Math.max(tmin, Math.min(t1, t2));
          tmax = Math.min(tmax, Math.max(t1, t2));
        }

        return tmax >= Math.max(0, tmin);
      };

      const result = benchmark(
        'AABB intersection',
        () => {
          for (let i = 0; i < 10000; i++) {
            const origin = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
            const dir = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
            const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
            const dirNorm = dir.map(d => d / len);
            const dirInv = dirNorm.map(d => 1 / d);

            aabbIntersect(origin, dirInv, [0, 0, 0], [5, 5, 5]);
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`AABB intersection: ${result.mean.toFixed(3)}ms per 10000`);
      expect(result.mean).toBeLessThan(20);
    });

    it('bounding box computation is performant', () => {
      interface Triangle {
        v0: number[];
        v1: number[];
        v2: number[];
      }

      const computeBounds = (triangles: Triangle[]) => {
        const min = [Infinity, Infinity, Infinity];
        const max = [-Infinity, -Infinity, -Infinity];

        for (const tri of triangles) {
          for (const v of [tri.v0, tri.v1, tri.v2]) {
            for (let i = 0; i < 3; i++) {
              min[i] = Math.min(min[i], v[i]);
              max[i] = Math.max(max[i], v[i]);
            }
          }
        }

        return { min, max };
      };

      // Create test triangles
      const triangles: Triangle[] = [];
      for (let i = 0; i < 1000; i++) {
        triangles.push({
          v0: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
          v1: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
          v2: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
        });
      }

      const result = benchmark(
        'Bounding box computation',
        () => {
          computeBounds(triangles);
        },
        { samples: 100, warmup: 10 }
      );

      console.log(`Bounding box (1000 triangles): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(5);
    });
  });

  describe('Triangle Operations', () => {
    it('triangle-ray intersection is performant', () => {
      // Möller–Trumbore intersection algorithm
      const rayTriangleIntersect = (
        rayOrigin: number[],
        rayDir: number[],
        v0: number[],
        v1: number[],
        v2: number[]
      ): number | null => {
        const EPSILON = 1e-7;

        const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
        const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];

        // Cross product: rayDir x edge2
        const h = [
          rayDir[1] * edge2[2] - rayDir[2] * edge2[1],
          rayDir[2] * edge2[0] - rayDir[0] * edge2[2],
          rayDir[0] * edge2[1] - rayDir[1] * edge2[0],
        ];

        // Dot product: edge1 · h
        const a = edge1[0] * h[0] + edge1[1] * h[1] + edge1[2] * h[2];

        if (a > -EPSILON && a < EPSILON) return null;

        const f = 1.0 / a;
        const s = [rayOrigin[0] - v0[0], rayOrigin[1] - v0[1], rayOrigin[2] - v0[2]];
        const u = f * (s[0] * h[0] + s[1] * h[1] + s[2] * h[2]);

        if (u < 0.0 || u > 1.0) return null;

        // Cross product: s x edge1
        const q = [
          s[1] * edge1[2] - s[2] * edge1[1],
          s[2] * edge1[0] - s[0] * edge1[2],
          s[0] * edge1[1] - s[1] * edge1[0],
        ];

        const v = f * (rayDir[0] * q[0] + rayDir[1] * q[1] + rayDir[2] * q[2]);

        if (v < 0.0 || u + v > 1.0) return null;

        const t = f * (edge2[0] * q[0] + edge2[1] * q[1] + edge2[2] * q[2]);

        if (t > EPSILON) return t;

        return null;
      };

      const result = benchmark(
        'Triangle-ray intersection',
        () => {
          for (let i = 0; i < 10000; i++) {
            const origin = [0, 0, -5];
            const dir = [Math.random() - 0.5, Math.random() - 0.5, 1];
            const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
            const dirNorm = dir.map(d => d / len);

            rayTriangleIntersect(
              origin,
              dirNorm,
              [-1, -1, 0],
              [1, -1, 0],
              [0, 1, 0]
            );
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Triangle-ray intersection: ${result.mean.toFixed(3)}ms per 10000`);
      expect(result.mean).toBeLessThan(30);
    });

    it('triangle centroid calculation is performant', () => {
      const result = benchmark(
        'Triangle centroid',
        () => {
          for (let i = 0; i < 10000; i++) {
            const v0 = [Math.random(), Math.random(), Math.random()];
            const v1 = [Math.random(), Math.random(), Math.random()];
            const v2 = [Math.random(), Math.random(), Math.random()];

            const centroid = [
              (v0[0] + v1[0] + v2[0]) / 3,
              (v0[1] + v1[1] + v2[1]) / 3,
              (v0[2] + v1[2] + v2[2]) / 3,
            ];
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Triangle centroid: ${result.mean.toFixed(3)}ms per 10000`);
      expect(result.mean).toBeLessThan(10);
    });
  });

  describe('Spatial Partitioning', () => {
    it('median split partitioning is performant', () => {
      interface Triangle {
        centroid: number[];
        bounds: { min: number[]; max: number[] };
      }

      const triangles: Triangle[] = [];
      for (let i = 0; i < 1000; i++) {
        const c = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
        triangles.push({
          centroid: c,
          bounds: {
            min: [c[0] - 0.5, c[1] - 0.5, c[2] - 0.5],
            max: [c[0] + 0.5, c[1] + 0.5, c[2] + 0.5],
          },
        });
      }

      const partitionByMedian = (tris: Triangle[], axis: number) => {
        const sorted = [...tris].sort((a, b) => a.centroid[axis] - b.centroid[axis]);
        const mid = Math.floor(sorted.length / 2);
        return {
          left: sorted.slice(0, mid),
          right: sorted.slice(mid),
        };
      };

      const result = benchmark(
        'Median split partition',
        () => {
          partitionByMedian(triangles, 0);
        },
        { samples: 100, warmup: 10 }
      );

      console.log(`Median split (1000 triangles): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(10);
    });

    it('SAH (Surface Area Heuristic) cost calculation is performant', () => {
      const surfaceArea = (min: number[], max: number[]): number => {
        const dx = max[0] - min[0];
        const dy = max[1] - min[1];
        const dz = max[2] - min[2];
        return 2 * (dx * dy + dy * dz + dz * dx);
      };

      const result = benchmark(
        'SAH cost calculation',
        () => {
          for (let i = 0; i < 10000; i++) {
            const min = [Math.random() * 5, Math.random() * 5, Math.random() * 5];
            const max = [min[0] + Math.random() * 5, min[1] + Math.random() * 5, min[2] + Math.random() * 5];
            surfaceArea(min, max);
          }
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`SAH calculation: ${result.mean.toFixed(3)}ms per 10000`);
      expect(result.mean).toBeLessThan(10);
    });
  });

  describe('BVH Tree Operations', () => {
    it('tree traversal is performant', () => {
      interface BVHNode {
        isLeaf: boolean;
        bounds: { min: number[]; max: number[] };
        left?: BVHNode;
        right?: BVHNode;
        triangles?: number[];
      }

      // Build a simple tree
      const buildTree = (depth: number): BVHNode => {
        if (depth === 0) {
          return {
            isLeaf: true,
            bounds: {
              min: [Math.random(), Math.random(), Math.random()],
              max: [Math.random() + 1, Math.random() + 1, Math.random() + 1],
            },
            triangles: [0, 1, 2],
          };
        }
        return {
          isLeaf: false,
          bounds: {
            min: [0, 0, 0],
            max: [10, 10, 10],
          },
          left: buildTree(depth - 1),
          right: buildTree(depth - 1),
        };
      };

      const tree = buildTree(10); // 2^10 = 1024 leaf nodes

      const traverseCount = (node: BVHNode): number => {
        if (node.isLeaf) return 1;
        return 1 + traverseCount(node.left!) + traverseCount(node.right!);
      };

      const result = benchmark(
        'BVH tree traversal',
        () => {
          traverseCount(tree);
        },
        { samples: 100, warmup: 10 }
      );

      console.log(`BVH traversal (2047 nodes): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(5);
    });

    it('stack-based traversal is performant', () => {
      interface BVHNode {
        isLeaf: boolean;
        left?: BVHNode;
        right?: BVHNode;
      }

      const buildTree = (depth: number): BVHNode => {
        if (depth === 0) return { isLeaf: true };
        return {
          isLeaf: false,
          left: buildTree(depth - 1),
          right: buildTree(depth - 1),
        };
      };

      const tree = buildTree(12); // 4096 leaves

      const traverseStack = (root: BVHNode): number => {
        const stack: BVHNode[] = [root];
        let count = 0;

        while (stack.length > 0) {
          const node = stack.pop()!;
          count++;
          if (!node.isLeaf) {
            if (node.left) stack.push(node.left);
            if (node.right) stack.push(node.right);
          }
        }

        return count;
      };

      const result = benchmark(
        'Stack-based traversal',
        () => {
          traverseStack(tree);
        },
        { samples: 50, warmup: 5 }
      );

      console.log(`Stack traversal (8191 nodes): ${result.mean.toFixed(3)}ms`);
      expect(result.mean).toBeLessThan(10);
    });
  });

  describe('Memory Efficiency', () => {
    it('flat array storage vs object storage', () => {
      const triangleCount = 10000;

      // Object-based storage
      const objectResult = benchmark(
        'Object storage',
        () => {
          const triangles: Array<{ v0: number[]; v1: number[]; v2: number[] }> = [];
          for (let i = 0; i < triangleCount; i++) {
            triangles.push({
              v0: [Math.random(), Math.random(), Math.random()],
              v1: [Math.random(), Math.random(), Math.random()],
              v2: [Math.random(), Math.random(), Math.random()],
            });
          }
        },
        { samples: 20, warmup: 3 }
      );

      // Flat array storage
      const flatResult = benchmark(
        'Flat array storage',
        () => {
          const vertices = new Float32Array(triangleCount * 9);
          for (let i = 0; i < triangleCount * 9; i++) {
            vertices[i] = Math.random();
          }
        },
        { samples: 20, warmup: 3 }
      );

      console.log(`Object storage: ${objectResult.mean.toFixed(3)}ms`);
      console.log(`Flat array storage: ${flatResult.mean.toFixed(3)}ms`);

      // Flat array should be faster
      expect(flatResult.mean).toBeLessThan(objectResult.mean);
    });
  });
});
