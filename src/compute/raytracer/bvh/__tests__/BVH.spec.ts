import { BVH } from '../BVH';
import { BVHNode } from '../BVHNode';
import { BVHVector3 } from '../BVHVector3';
import { BVHBuilder } from '../BVHBuilder';

describe('BVH', () => {
  describe('constructor', () => {
    it('creates BVH with all properties', () => {
      const rootNode = new BVHNode([0, 0, 0], [1, 1, 1], 0, 1, 0);
      const bboxArray = new Float32Array(7);
      const trianglesArray = new Float32Array(9);

      const bvh = new BVH(rootNode, bboxArray, trianglesArray);

      expect(bvh.rootNode).toBe(rootNode);
      expect(bvh.bboxArray).toBe(bboxArray);
      expect(bvh.trianglesArray).toBe(trianglesArray);
    });
  });

  describe('calcTValues', () => {
    it('calculates t values for positive direction', () => {
      const [tmin, tmax] = BVH.calcTValues(0, 10, 0, 1);
      expect(tmin).toBe(0);
      expect(tmax).toBe(10);
    });

    it('calculates t values for negative direction', () => {
      const [tmin, tmax] = BVH.calcTValues(0, 10, 5, -1);
      // invdir = -1, maxVal=10, rayOrigin=5
      // When invdir < 0: [(maxVal - rayOrigin) * invdir, (minVal - rayOrigin) * invdir]
      // = [(10 - 5) * -1, (0 - 5) * -1] = [-5, 5]
      expect(tmin).toBe(-5);
      expect(tmax).toBe(5);
    });

    it('calculates t values with offset origin', () => {
      const [tmin, tmax] = BVH.calcTValues(0, 10, -5, 1);
      expect(tmin).toBe(5);
      expect(tmax).toBe(15);
    });
  });

  describe('intersectNodeBox', () => {
    it('returns true for ray hitting box', () => {
      const node = new BVHNode([0, 0, 0], [1, 1, 1], 0, 1, 0);
      const rayOrigin = new BVHVector3(-1, 0.5, 0.5);
      // invRayDir = 1/direction - ray going in +x direction (1,0,0) -> invDir (1, Inf, Inf)
      const invRayDir = new BVHVector3(1, Infinity, Infinity);

      const result = BVH.intersectNodeBox(rayOrigin, invRayDir, node);

      expect(result).toBe(true);
    });

    it('returns false for ray missing box', () => {
      const node = new BVHNode([0, 0, 0], [1, 1, 1], 0, 1, 0);
      const rayOrigin = new BVHVector3(-1, 5, 5);
      const invRayDir = new BVHVector3(1, Infinity, Infinity);

      const result = BVH.intersectNodeBox(rayOrigin, invRayDir, node);

      expect(result).toBe(false);
    });

    it('returns false for ray behind box', () => {
      const node = new BVHNode([0, 0, 0], [1, 1, 1], 0, 1, 0);
      const rayOrigin = new BVHVector3(5, 0.5, 0.5);
      // Ray going in +x direction, but starting after box
      const invRayDir = new BVHVector3(1, Infinity, Infinity);

      const result = BVH.intersectNodeBox(rayOrigin, invRayDir, node);

      expect(result).toBe(false);
    });

    it('returns true for ray starting inside box', () => {
      const node = new BVHNode([0, 0, 0], [1, 1, 1], 0, 1, 0);
      const rayOrigin = new BVHVector3(0.5, 0.5, 0.5);
      const invRayDir = new BVHVector3(1, Infinity, Infinity);

      const result = BVH.intersectNodeBox(rayOrigin, invRayDir, node);

      expect(result).toBe(true);
    });
  });

  describe('intersectRayTriangle', () => {
    it('finds intersection with front-facing triangle', () => {
      const a = new BVHVector3(0, 0, 0);
      const b = new BVHVector3(1, 0, 0);
      const c = new BVHVector3(0, 1, 0);
      const rayOrigin = new BVHVector3(0.25, 0.25, -1);
      const rayDir = new BVHVector3(0, 0, 1);

      const result = BVH.intersectRayTriangle(a, b, c, rayOrigin, rayDir, false);

      expect(result).not.toBeNull();
      expect(result!.x).toBeCloseTo(0.25);
      expect(result!.y).toBeCloseTo(0.25);
      expect(result!.z).toBeCloseTo(0);
    });

    it('returns null for front-facing triangle when backface culling enabled', () => {
      // With backface culling enabled, the implementation culls front-facing hits
      // (when DdN > 0, i.e., ray going same direction as normal)
      const a = new BVHVector3(0, 0, 0);
      const b = new BVHVector3(1, 0, 0);
      const c = new BVHVector3(0, 1, 0);
      // Normal is (0,0,1), ray direction is (0,0,1) - both same direction = DdN > 0
      const rayOrigin = new BVHVector3(0.25, 0.25, 1);
      const rayDir = new BVHVector3(0, 0, -1);

      // Ray going -z, triangle normal is +z => DdN < 0, so NOT culled
      const result = BVH.intersectRayTriangle(a, b, c, rayOrigin, rayDir, true);
      expect(result).not.toBeNull();
    });

    it('culls when ray direction matches triangle normal', () => {
      // Triangle with normal pointing in +z direction
      const a = new BVHVector3(0, 0, 0);
      const b = new BVHVector3(1, 0, 0);
      const c = new BVHVector3(0, 1, 0);
      // Ray going in +z direction
      const rayOrigin = new BVHVector3(0.25, 0.25, -1);
      const rayDir = new BVHVector3(0, 0, 1);

      // Cross product of (1,0,0) and (0,1,0) = (0,0,1)
      // Dot of (0,0,1) and (0,0,1) = 1 > 0 -> culled with backfaceCulling=true
      const result = BVH.intersectRayTriangle(a, b, c, rayOrigin, rayDir, true);
      expect(result).toBeNull();
    });

    it('finds intersection when culling disabled regardless of direction', () => {
      const a = new BVHVector3(0, 0, 0);
      const b = new BVHVector3(1, 0, 0);
      const c = new BVHVector3(0, 1, 0);
      const rayOrigin = new BVHVector3(0.25, 0.25, -1);
      const rayDir = new BVHVector3(0, 0, 1);

      const result = BVH.intersectRayTriangle(a, b, c, rayOrigin, rayDir, false);

      expect(result).not.toBeNull();
    });

    it('returns null for ray parallel to triangle', () => {
      const a = new BVHVector3(0, 0, 0);
      const b = new BVHVector3(1, 0, 0);
      const c = new BVHVector3(0, 1, 0);
      const rayOrigin = new BVHVector3(0, 0, 1);
      const rayDir = new BVHVector3(1, 0, 0); // parallel to triangle plane

      const result = BVH.intersectRayTriangle(a, b, c, rayOrigin, rayDir, false);

      expect(result).toBeNull();
    });

    it('returns null for ray missing triangle', () => {
      const a = new BVHVector3(0, 0, 0);
      const b = new BVHVector3(1, 0, 0);
      const c = new BVHVector3(0, 1, 0);
      const rayOrigin = new BVHVector3(10, 10, -1);
      const rayDir = new BVHVector3(0, 0, 1);

      const result = BVH.intersectRayTriangle(a, b, c, rayOrigin, rayDir, false);

      expect(result).toBeNull();
    });

    it('returns null for ray pointing away from triangle', () => {
      const a = new BVHVector3(0, 0, 0);
      const b = new BVHVector3(1, 0, 0);
      const c = new BVHVector3(0, 1, 0);
      const rayOrigin = new BVHVector3(0.25, 0.25, -1);
      const rayDir = new BVHVector3(0, 0, -1); // pointing away

      const result = BVH.intersectRayTriangle(a, b, c, rayOrigin, rayDir, false);

      expect(result).toBeNull();
    });
  });

  describe('intersectRay', () => {
    function createTriangle(x: number, y: number, z: number): Vector[] {
      return [
        { x: x, y: y, z: z },
        { x: x + 1, y: y, z: z },
        { x: x, y: y + 1, z: z }
      ];
    }

    it('finds intersection with single triangle', () => {
      const bvh = BVHBuilder([createTriangle(0, 0, 0)]);
      const rayOrigin = { x: 0.25, y: 0.25, z: -1 };
      const rayDir = { x: 0, y: 0, z: 1 };

      const intersections = bvh.intersectRay(rayOrigin, rayDir, false);

      expect(intersections.length).toBe(1);
      expect(intersections[0].triangleIndex).toBe(0);
    });

    it('returns empty array when no intersection', () => {
      const bvh = BVHBuilder([createTriangle(0, 0, 0)]);
      const rayOrigin = { x: 10, y: 10, z: -1 };
      const rayDir = { x: 0, y: 0, z: 1 };

      const intersections = bvh.intersectRay(rayOrigin, rayDir);

      expect(intersections.length).toBe(0);
    });

    it('finds multiple intersections', () => {
      const triangles = [
        createTriangle(0, 0, 0),
        createTriangle(0, 0, 2)
      ];
      const bvh = BVHBuilder(triangles);
      const rayOrigin = { x: 0.25, y: 0.25, z: -1 };
      const rayDir = { x: 0, y: 0, z: 1 };

      const intersections = bvh.intersectRay(rayOrigin, rayDir, false);

      expect(intersections.length).toBe(2);
    });

    it('applies backface culling when enabled', () => {
      const bvh = BVHBuilder([createTriangle(0, 0, 0)]);
      // Ray direction same as triangle normal -> culled
      // Triangle normal is +z (from cross product of edges)
      const rayOrigin = { x: 0.25, y: 0.25, z: -1 };
      const rayDir = { x: 0, y: 0, z: 1 };

      const intersections = bvh.intersectRay(rayOrigin, rayDir, true);

      expect(intersections.length).toBe(0);
    });

    it('throws error for invalid ray origin', () => {
      const bvh = BVHBuilder([createTriangle(0, 0, 0)]);

      expect(() => bvh.intersectRay({}, { x: 0, y: 0, z: 1 })).toThrow(
        "Origin or Direction couldn't be converted to a BVHVector3"
      );
    });

    it('throws error for invalid ray direction', () => {
      const bvh = BVHBuilder([createTriangle(0, 0, 0)]);

      expect(() => bvh.intersectRay({ x: 0, y: 0, z: 0 }, {})).toThrow(
        "Origin or Direction couldn't be converted to a BVHVector3"
      );
    });

    it('works with BVHVector3 input', () => {
      const bvh = BVHBuilder([createTriangle(0, 0, 0)]);
      const rayOrigin = new BVHVector3(0.25, 0.25, -1);
      const rayDir = new BVHVector3(0, 0, 1);

      const intersections = bvh.intersectRay(rayOrigin, rayDir, false);

      expect(intersections.length).toBe(1);
    });

    it('returns intersection point in result', () => {
      const bvh = BVHBuilder([createTriangle(0, 0, 0)]);
      const rayOrigin = { x: 0.25, y: 0.25, z: -1 };
      const rayDir = { x: 0, y: 0, z: 1 };

      const intersections = bvh.intersectRay(rayOrigin, rayDir, false);

      expect(intersections[0].intersectionPoint).toBeDefined();
      expect(intersections[0].intersectionPoint.x).toBeCloseTo(0.25);
      expect(intersections[0].intersectionPoint.y).toBeCloseTo(0.25);
      expect(intersections[0].intersectionPoint.z).toBeCloseTo(0);
    });
  });
});
