/**
 * Chunk Function Tests
 *
 * Tests for array chunking utilities.
 */

import { chunk, chunkf32 } from '../chunk';

describe('chunk', () => {
  describe('Basic Chunking', () => {
    it('chunks array into pairs', () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    it('chunks array into triples', () => {
      expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([[1, 2, 3], [4, 5, 6]]);
    });

    it('chunks array into singles', () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('returns whole array as single chunk when size >= length', () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });
  });

  describe('Incomplete Final Chunk', () => {
    it('handles incomplete final chunk', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('handles single element final chunk', () => {
      expect(chunk([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });
  });

  describe('Empty Array', () => {
    it('returns empty array for empty input', () => {
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe('String Arrays', () => {
    it('chunks string arrays', () => {
      expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([['a', 'b'], ['c', 'd']]);
    });
  });

  describe('Object Arrays', () => {
    it('chunks object arrays', () => {
      const objects = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const result = chunk(objects, 2);
      expect(result).toEqual([[{ id: 1 }, { id: 2 }], [{ id: 3 }, { id: 4 }]]);
    });

    it('preserves object references', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const result = chunk([obj1, obj2], 1);
      expect(result[0][0]).toBe(obj1);
      expect(result[1][0]).toBe(obj2);
    });
  });

  describe('Large Chunk Sizes', () => {
    it('handles chunk size equal to array length', () => {
      expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    });

    it('handles chunk size larger than array', () => {
      expect(chunk([1, 2], 10)).toEqual([[1, 2]]);
    });
  });
});

describe('chunkf32', () => {
  describe('Basic Chunking', () => {
    it('chunks Float32Array into pairs', () => {
      const arr = new Float32Array([1, 2, 3, 4]);
      const result = chunkf32(arr, 2);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Float32Array);
      expect(Array.from(result[0])).toEqual([1, 2]);
      expect(Array.from(result[1])).toEqual([3, 4]);
    });

    it('chunks Float32Array into triples', () => {
      const arr = new Float32Array([1, 2, 3, 4, 5, 6]);
      const result = chunkf32(arr, 3);

      expect(result).toHaveLength(2);
      expect(Array.from(result[0])).toEqual([1, 2, 3]);
      expect(Array.from(result[1])).toEqual([4, 5, 6]);
    });
  });

  describe('Incomplete Final Chunk', () => {
    it('handles incomplete final chunk', () => {
      const arr = new Float32Array([1, 2, 3, 4, 5]);
      const result = chunkf32(arr, 2);

      expect(result).toHaveLength(3);
      expect(Array.from(result[0])).toEqual([1, 2]);
      expect(Array.from(result[1])).toEqual([3, 4]);
      expect(Array.from(result[2])).toEqual([5]);
    });
  });

  describe('Empty Array', () => {
    it('returns empty array for empty Float32Array', () => {
      const arr = new Float32Array([]);
      expect(chunkf32(arr, 2)).toEqual([]);
    });
  });

  describe('Floating Point Values', () => {
    it('preserves floating point precision', () => {
      const arr = new Float32Array([1.5, 2.5, 3.5, 4.5]);
      const result = chunkf32(arr, 2);

      expect(result[0][0]).toBeCloseTo(1.5, 5);
      expect(result[0][1]).toBeCloseTo(2.5, 5);
      expect(result[1][0]).toBeCloseTo(3.5, 5);
      expect(result[1][1]).toBeCloseTo(4.5, 5);
    });
  });

  describe('Returns Float32Array Slices', () => {
    it('returns Float32Array instances', () => {
      const arr = new Float32Array([1, 2, 3, 4]);
      const result = chunkf32(arr, 2);

      result.forEach(chunk => {
        expect(chunk).toBeInstanceOf(Float32Array);
      });
    });
  });
});
