import { BVHVector3 } from '../BVHVector3';

describe('BVHVector3', () => {
  describe('constructor', () => {
    it('creates vector with default values', () => {
      const v = new BVHVector3();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('creates vector with specified values', () => {
      const v = new BVHVector3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });

    it('creates vector with partial values', () => {
      const v = new BVHVector3(5);
      expect(v.x).toBe(5);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });
  });

  describe('copy', () => {
    it('copies values from another vector', () => {
      const source = new BVHVector3(1, 2, 3);
      const target = new BVHVector3();

      target.copy(source);

      expect(target.x).toBe(1);
      expect(target.y).toBe(2);
      expect(target.z).toBe(3);
    });

    it('returns this for chaining', () => {
      const source = new BVHVector3(1, 2, 3);
      const target = new BVHVector3();

      const result = target.copy(source);

      expect(result).toBe(target);
    });
  });

  describe('setFromArray', () => {
    it('sets values from Float32Array at offset', () => {
      const array = new Float32Array([10, 20, 30, 40, 50, 60]);
      const v = new BVHVector3();

      v.setFromArray(array, 0);

      expect(v.x).toBe(10);
      expect(v.y).toBe(20);
      expect(v.z).toBe(30);
    });

    it('sets values from Float32Array at non-zero offset', () => {
      const array = new Float32Array([10, 20, 30, 40, 50, 60]);
      const v = new BVHVector3();

      v.setFromArray(array, 3);

      expect(v.x).toBe(40);
      expect(v.y).toBe(50);
      expect(v.z).toBe(60);
    });
  });

  describe('setFromArrayNoOffset', () => {
    it('sets values from regular array', () => {
      const array = [7, 8, 9];
      const v = new BVHVector3();

      v.setFromArrayNoOffset(array);

      expect(v.x).toBe(7);
      expect(v.y).toBe(8);
      expect(v.z).toBe(9);
    });
  });

  describe('setFromArgs', () => {
    it('sets values from individual arguments', () => {
      const v = new BVHVector3();

      v.setFromArgs(11, 22, 33);

      expect(v.x).toBe(11);
      expect(v.y).toBe(22);
      expect(v.z).toBe(33);
    });
  });

  describe('add', () => {
    it('adds another vector', () => {
      const v1 = new BVHVector3(1, 2, 3);
      const v2 = new BVHVector3(4, 5, 6);

      v1.add(v2);

      expect(v1.x).toBe(5);
      expect(v1.y).toBe(7);
      expect(v1.z).toBe(9);
    });

    it('returns this for chaining', () => {
      const v1 = new BVHVector3(1, 2, 3);
      const v2 = new BVHVector3(4, 5, 6);

      const result = v1.add(v2);

      expect(result).toBe(v1);
    });

    it('does not modify the other vector', () => {
      const v1 = new BVHVector3(1, 2, 3);
      const v2 = new BVHVector3(4, 5, 6);

      v1.add(v2);

      expect(v2.x).toBe(4);
      expect(v2.y).toBe(5);
      expect(v2.z).toBe(6);
    });
  });

  describe('multiplyScalar', () => {
    it('multiplies by a scalar', () => {
      const v = new BVHVector3(2, 3, 4);

      v.multiplyScalar(3);

      expect(v.x).toBe(6);
      expect(v.y).toBe(9);
      expect(v.z).toBe(12);
    });

    it('multiplies by zero', () => {
      const v = new BVHVector3(2, 3, 4);

      v.multiplyScalar(0);

      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('multiplies by negative', () => {
      const v = new BVHVector3(2, 3, 4);

      v.multiplyScalar(-2);

      expect(v.x).toBe(-4);
      expect(v.y).toBe(-6);
      expect(v.z).toBe(-8);
    });

    it('returns this for chaining', () => {
      const v = new BVHVector3(2, 3, 4);

      const result = v.multiplyScalar(3);

      expect(result).toBe(v);
    });
  });

  describe('subVectors', () => {
    it('computes difference of two vectors', () => {
      const a = new BVHVector3(5, 7, 9);
      const b = new BVHVector3(1, 2, 3);
      const result = new BVHVector3();

      result.subVectors(a, b);

      expect(result.x).toBe(4);
      expect(result.y).toBe(5);
      expect(result.z).toBe(6);
    });

    it('returns this for chaining', () => {
      const a = new BVHVector3(5, 7, 9);
      const b = new BVHVector3(1, 2, 3);
      const result = new BVHVector3();

      const returned = result.subVectors(a, b);

      expect(returned).toBe(result);
    });

    it('handles negative results', () => {
      const a = new BVHVector3(1, 2, 3);
      const b = new BVHVector3(5, 7, 9);
      const result = new BVHVector3();

      result.subVectors(a, b);

      expect(result.x).toBe(-4);
      expect(result.y).toBe(-5);
      expect(result.z).toBe(-6);
    });
  });

  describe('dot', () => {
    it('computes dot product', () => {
      const v1 = new BVHVector3(1, 2, 3);
      const v2 = new BVHVector3(4, 5, 6);

      const result = v1.dot(v2);

      // 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
      expect(result).toBe(32);
    });

    it('returns zero for perpendicular vectors', () => {
      const v1 = new BVHVector3(1, 0, 0);
      const v2 = new BVHVector3(0, 1, 0);

      const result = v1.dot(v2);

      expect(result).toBe(0);
    });

    it('returns positive for same direction', () => {
      const v1 = new BVHVector3(1, 0, 0);
      const v2 = new BVHVector3(2, 0, 0);

      const result = v1.dot(v2);

      expect(result).toBe(2);
    });

    it('returns negative for opposite directions', () => {
      const v1 = new BVHVector3(1, 0, 0);
      const v2 = new BVHVector3(-2, 0, 0);

      const result = v1.dot(v2);

      expect(result).toBe(-2);
    });
  });

  describe('cross', () => {
    it('computes cross product', () => {
      const v1 = new BVHVector3(1, 0, 0);
      const v2 = new BVHVector3(0, 1, 0);

      v1.cross(v2);

      // i x j = k
      expect(v1.x).toBe(0);
      expect(v1.y).toBe(0);
      expect(v1.z).toBe(1);
    });

    it('returns this for chaining', () => {
      const v1 = new BVHVector3(1, 0, 0);
      const v2 = new BVHVector3(0, 1, 0);

      const result = v1.cross(v2);

      expect(result).toBe(v1);
    });

    it('is anti-commutative', () => {
      const v1a = new BVHVector3(1, 0, 0);
      const v1b = new BVHVector3(1, 0, 0);
      const v2a = new BVHVector3(0, 1, 0);
      const v2b = new BVHVector3(0, 1, 0);

      v1a.cross(v2a);
      v2b.cross(v1b);

      // Check that a x b = -(b x a), using + 0 to handle -0 case
      expect(v1a.x + 0).toBe(-v2b.x + 0);
      expect(v1a.y + 0).toBe(-v2b.y + 0);
      expect(v1a.z + 0).toBe(-v2b.z + 0);
    });

    it('returns zero for parallel vectors', () => {
      const v1 = new BVHVector3(1, 0, 0);
      const v2 = new BVHVector3(2, 0, 0);

      v1.cross(v2);

      expect(v1.x).toBe(0);
      expect(v1.y).toBe(0);
      expect(v1.z).toBe(0);
    });
  });

  describe('crossVectors', () => {
    it('computes cross product of two vectors', () => {
      const a = new BVHVector3(1, 0, 0);
      const b = new BVHVector3(0, 1, 0);
      const result = new BVHVector3();

      result.crossVectors(a, b);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(1);
    });

    it('returns this for chaining', () => {
      const a = new BVHVector3(1, 0, 0);
      const b = new BVHVector3(0, 1, 0);
      const result = new BVHVector3();

      const returned = result.crossVectors(a, b);

      expect(returned).toBe(result);
    });

    it('does not modify input vectors', () => {
      const a = new BVHVector3(1, 2, 3);
      const b = new BVHVector3(4, 5, 6);
      const result = new BVHVector3();

      result.crossVectors(a, b);

      expect(a.x).toBe(1);
      expect(a.y).toBe(2);
      expect(a.z).toBe(3);
      expect(b.x).toBe(4);
      expect(b.y).toBe(5);
      expect(b.z).toBe(6);
    });

    it('computes general cross product correctly', () => {
      const a = new BVHVector3(2, 3, 4);
      const b = new BVHVector3(5, 6, 7);
      const result = new BVHVector3();

      result.crossVectors(a, b);

      // (3*7 - 4*6, 4*5 - 2*7, 2*6 - 3*5)
      // (21 - 24, 20 - 14, 12 - 15)
      // (-3, 6, -3)
      expect(result.x).toBe(-3);
      expect(result.y).toBe(6);
      expect(result.z).toBe(-3);
    });
  });

  describe('clone', () => {
    it('creates a new vector with same values', () => {
      const v = new BVHVector3(1, 2, 3);

      const cloned = v.clone();

      expect(cloned.x).toBe(1);
      expect(cloned.y).toBe(2);
      expect(cloned.z).toBe(3);
    });

    it('creates an independent copy', () => {
      const v = new BVHVector3(1, 2, 3);

      const cloned = v.clone();
      cloned.x = 100;

      expect(v.x).toBe(1);
    });

    it('returns a BVHVector3 instance', () => {
      const v = new BVHVector3(1, 2, 3);

      const cloned = v.clone();

      expect(cloned).toBeInstanceOf(BVHVector3);
    });
  });

  describe('fromAny', () => {
    it('returns same instance if already BVHVector3', () => {
      const v = new BVHVector3(1, 2, 3);

      const result = BVHVector3.fromAny(v);

      expect(result).toBe(v);
    });

    it('creates BVHVector3 from object with x, y, z', () => {
      const obj = { x: 4, y: 5, z: 6 };

      const result = BVHVector3.fromAny(obj);

      expect(result).toBeInstanceOf(BVHVector3);
      expect(result.x).toBe(4);
      expect(result.y).toBe(5);
      expect(result.z).toBe(6);
    });

    it('throws for invalid input', () => {
      expect(() => BVHVector3.fromAny({})).toThrow("Couldn't convert to BVHVector3.");
    });

    it('throws for null', () => {
      expect(() => BVHVector3.fromAny(null)).toThrow();
    });

    it('throws for primitive', () => {
      expect(() => BVHVector3.fromAny(42)).toThrow();
    });

    it('handles object with null x', () => {
      const obj = { x: null, y: 5, z: 6 };

      expect(() => BVHVector3.fromAny(obj)).toThrow("Couldn't convert to BVHVector3.");
    });
  });

  describe('chaining', () => {
    it('supports method chaining', () => {
      const v = new BVHVector3(1, 1, 1);
      const other = new BVHVector3(1, 1, 1);

      v.add(other).multiplyScalar(2);

      expect(v.x).toBe(4);
      expect(v.y).toBe(4);
      expect(v.z).toBe(4);
    });
  });
});
