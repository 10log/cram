import { BVHBuilder, BVHBuilderAsync } from '../BVHBuilder';
import { BVH } from '../BVH';

describe('BVHBuilder', () => {
  // Helper to create a simple triangle
  function createTriangle(x: number, y: number, z: number): Vector[] {
    return [
      { x: x, y: y, z: z },
      { x: x + 1, y: y, z: z },
      { x: x, y: y + 1, z: z }
    ];
  }

  describe('input validation', () => {
    it('throws error for non-number maxTrianglesPerNode', () => {
      expect(() => BVHBuilder([], 'invalid' as any)).toThrow(
        'maxTrianglesPerNode must be of type number'
      );
    });

    it('throws error for maxTrianglesPerNode less than 1', () => {
      expect(() => BVHBuilder([], 0)).toThrow(
        'maxTrianglesPerNode must be greater than or equal to 1'
      );
    });

    it('throws error for NaN maxTrianglesPerNode', () => {
      expect(() => BVHBuilder([], NaN)).toThrow(
        'maxTrianglesPerNode is NaN'
      );
    });

    it('warns for non-integer maxTrianglesPerNode', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const triangles = [createTriangle(0, 0, 0)];
      BVHBuilder(triangles, 1.5);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('maxTrianglesPerNode is expected to be an integer')
      );
      warnSpy.mockRestore();
    });

    it('throws error for invalid triangle input type', () => {
      expect(() => BVHBuilder('invalid' as any)).toThrow(
        'triangles must be of type Vector[][] | number[] | Float32Array'
      );
    });

    it('warns for empty array', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      BVHBuilder([]);
      expect(warnSpy).toHaveBeenCalledWith(
        'triangles appears to be an array with 0 elements.'
      );
      warnSpy.mockRestore();
    });
  });

  describe('building from Vector[][]', () => {
    it('builds BVH from face array', () => {
      const triangles = [
        createTriangle(0, 0, 0),
        createTriangle(2, 0, 0),
        createTriangle(4, 0, 0)
      ];

      const bvh = BVHBuilder(triangles);

      expect(bvh).toBeInstanceOf(BVH);
      expect(bvh.trianglesArray.length).toBe(27); // 3 triangles * 9 floats
    });

    it('builds BVH with single triangle', () => {
      const triangles = [createTriangle(0, 0, 0)];

      const bvh = BVHBuilder(triangles);

      expect(bvh).toBeInstanceOf(BVH);
      expect(bvh.rootNode.elementCount()).toBe(1);
    });

    it('builds BVH with many triangles', () => {
      const triangles: Vector[][] = [];
      for (let i = 0; i < 50; i++) {
        triangles.push(createTriangle(i * 2, 0, 0));
      }

      const bvh = BVHBuilder(triangles, 5);

      expect(bvh).toBeInstanceOf(BVH);
      expect(bvh.trianglesArray.length).toBe(50 * 9);
    });
  });

  describe('building from Float32Array', () => {
    it('builds BVH from Float32Array', () => {
      // One triangle: 3 vertices * 3 coords = 9 floats
      const trianglesArray = new Float32Array([
        0, 0, 0, // v0
        1, 0, 0, // v1
        0, 1, 0  // v2
      ]);

      const bvh = BVHBuilder(trianglesArray);

      expect(bvh).toBeInstanceOf(BVH);
      expect(bvh.trianglesArray).toBe(trianglesArray);
    });

    it('builds BVH from multiple triangles in Float32Array', () => {
      const trianglesArray = new Float32Array([
        // Triangle 1
        0, 0, 0,
        1, 0, 0,
        0, 1, 0,
        // Triangle 2
        2, 0, 0,
        3, 0, 0,
        2, 1, 0
      ]);

      const bvh = BVHBuilder(trianglesArray);

      expect(bvh).toBeInstanceOf(BVH);
      expect(bvh.rootNode).toBeDefined();
    });
  });

  describe('building from number[]', () => {
    it('builds BVH from number array', () => {
      const triangles = [
        0, 0, 0, // v0
        1, 0, 0, // v1
        0, 1, 0  // v2
      ];

      const bvh = BVHBuilder(triangles);

      expect(bvh).toBeInstanceOf(BVH);
    });
  });

  describe('tree structure', () => {
    it('creates leaf node for triangles within limit', () => {
      const triangles = [
        createTriangle(0, 0, 0),
        createTriangle(1, 0, 0)
      ];

      const bvh = BVHBuilder(triangles, 10);

      // With maxTriangles=10 and only 2 triangles, should be a leaf
      expect(bvh.rootNode.node0).toBeNull();
      expect(bvh.rootNode.node1).toBeNull();
      expect(bvh.rootNode.elementCount()).toBe(2);
    });

    it('splits node when exceeding limit', () => {
      const triangles: Vector[][] = [];
      // Create triangles spread across X axis
      for (let i = 0; i < 20; i++) {
        triangles.push(createTriangle(i * 3, 0, 0));
      }

      const bvh = BVHBuilder(triangles, 5);

      // Should have split the root node
      expect(bvh.rootNode.node0).not.toBeNull();
      expect(bvh.rootNode.node1).not.toBeNull();
    });

    it('computes correct extents for root node', () => {
      const triangles = [
        createTriangle(0, 0, 0),
        createTriangle(10, 10, 10)
      ];

      const bvh = BVHBuilder(triangles);

      // Check that extents encompass all triangles
      expect(bvh.rootNode.extentsMin[0]).toBeLessThanOrEqual(0);
      expect(bvh.rootNode.extentsMin[1]).toBeLessThanOrEqual(0);
      expect(bvh.rootNode.extentsMin[2]).toBeLessThanOrEqual(0);
      expect(bvh.rootNode.extentsMax[0]).toBeGreaterThanOrEqual(11);
      expect(bvh.rootNode.extentsMax[1]).toBeGreaterThanOrEqual(11);
      expect(bvh.rootNode.extentsMax[2]).toBeLessThanOrEqual(11);
    });
  });
});

describe('BVHBuilderAsync', () => {
  function createTriangle(x: number, y: number, z: number): Vector[] {
    return [
      { x: x, y: y, z: z },
      { x: x + 1, y: y, z: z },
      { x: x, y: y + 1, z: z }
    ];
  }

  describe('input validation', () => {
    it('throws error for non-number maxTrianglesPerNode', async () => {
      await expect(BVHBuilderAsync([], 'invalid' as any)).rejects.toThrow(
        'maxTrianglesPerNode must be of type number'
      );
    });

    it('throws error for maxTrianglesPerNode less than 1', async () => {
      await expect(BVHBuilderAsync([], 0)).rejects.toThrow(
        'maxTrianglesPerNode must be greater than or equal to 1'
      );
    });

    it('throws error for NaN maxTrianglesPerNode', async () => {
      await expect(BVHBuilderAsync([], NaN)).rejects.toThrow(
        'maxTrianglesPerNode is NaN'
      );
    });

    it('throws error for invalid triangle input type', async () => {
      await expect(BVHBuilderAsync('invalid' as any)).rejects.toThrow(
        'triangles must be of type Vector[][] | number[] | Float32Array'
      );
    });
  });

  describe('async building', () => {
    it('builds BVH asynchronously', async () => {
      const triangles = [
        createTriangle(0, 0, 0),
        createTriangle(2, 0, 0),
        createTriangle(4, 0, 0)
      ];

      const bvh = await BVHBuilderAsync(triangles);

      expect(bvh).toBeInstanceOf(BVH);
      expect(bvh.trianglesArray.length).toBe(27);
    });

    it('supports progress callback', async () => {
      const triangles: Vector[][] = [];
      for (let i = 0; i < 30; i++) {
        triangles.push(createTriangle(i * 2, 0, 0));
      }

      const progressCalls: any[] = [];
      const progressCallback = (progress: any) => {
        progressCalls.push(progress);
      };

      await BVHBuilderAsync(triangles, 5, { steps: 5 }, progressCallback);

      // Progress callback should have been called
      expect(progressCalls.length).toBeGreaterThan(0);
      // Progress should include trianglesLeafed
      progressCalls.forEach(call => {
        expect(call).toHaveProperty('trianglesLeafed');
        expect(call).toHaveProperty('nodesSplit');
      });
    });

    it('accepts async parameters', async () => {
      const triangles = [createTriangle(0, 0, 0)];

      const bvh = await BVHBuilderAsync(triangles, 10, { ms: 10, steps: 5 });

      expect(bvh).toBeInstanceOf(BVH);
    });
  });
});
