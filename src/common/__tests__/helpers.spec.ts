/**
 * Helpers Module Tests
 *
 * Tests for the extensive collection of utility functions
 * in the helpers module.
 */

import {
  intersection,
  difference,
  union,
  getIndex,
  ascending,
  descending,
  swap,
  add,
  subtract,
  multiply,
  divide,
  max,
  min,
  truthy,
  falsey,
  toIndexed,
  splitEvery,
  multiMap,
  addArray,
  subtractArray,
  multiplyArray,
  toNumbers,
  between,
  unique,
  diff,
  transpose,
  flipHor,
  flipVer,
  rotate,
  derotate,
  clamp,
  mod,
  rmod,
  int,
  isInteger,
  at,
  reach,
  derivative,
  countIf,
  makeObject,
  deepEqual,
  GraphNode,
  Range,
  ClosedRange,
  getAdjacentIterator,
  reduce,
  charFrequency,
  memoize,
  splitArr,
  splitAt,
  isDefined,
  countBy,
  addIfUnique,
  pickProps,
  omit,
  ensureArray,
  curry,
} from '../helpers';

describe('Set Operations', () => {
  describe('intersection', () => {
    it('returns common elements', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([2, 3, 4]);
      expect(intersection(set1, set2)).toEqual(new Set([2, 3]));
    });

    it('returns empty set when no common elements', () => {
      const set1 = new Set([1, 2]);
      const set2 = new Set([3, 4]);
      expect(intersection(set1, set2)).toEqual(new Set());
    });

    it('handles empty sets', () => {
      expect(intersection(new Set(), new Set([1, 2]))).toEqual(new Set());
    });
  });

  describe('difference', () => {
    it('returns elements in set1 not in set2', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([2, 3, 4]);
      expect(difference(set1, set2)).toEqual(new Set([1]));
    });

    it('returns all elements when sets are disjoint', () => {
      const set1 = new Set([1, 2]);
      const set2 = new Set([3, 4]);
      expect(difference(set1, set2)).toEqual(new Set([1, 2]));
    });
  });

  describe('union', () => {
    it('returns all elements from both sets', () => {
      const set1 = new Set([1, 2]);
      const set2 = new Set([3, 4]);
      expect(union(set1, set2)).toEqual(new Set([1, 2, 3, 4]));
    });

    it('removes duplicates', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([2, 3, 4]);
      expect(union(set1, set2)).toEqual(new Set([1, 2, 3, 4]));
    });
  });
});

describe('Sorting Functions', () => {
  describe('ascending', () => {
    it('sorts numbers in ascending order', () => {
      expect([3, 1, 2].sort(ascending)).toEqual([1, 2, 3]);
    });

    it('sorts strings in ascending order', () => {
      expect(['c', 'a', 'b'].sort(ascending)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('descending', () => {
    it('sorts numbers in descending order', () => {
      expect([1, 3, 2].sort(descending)).toEqual([3, 2, 1]);
    });

    it('sorts strings in descending order', () => {
      expect(['a', 'c', 'b'].sort(descending)).toEqual(['c', 'b', 'a']);
    });
  });
});

describe('Accessor Functions', () => {
  describe('getIndex', () => {
    it('accesses array element', () => {
      expect(getIndex(1)([10, 20, 30])).toBe(20);
    });

    it('accesses object property', () => {
      expect(getIndex('name')({ name: 'test' })).toBe('test');
    });
  });

  describe('swap', () => {
    it('swaps two elements in array', () => {
      expect(swap(0, 2)([1, 2, 3])).toEqual([3, 2, 1]);
    });

    it('swaps adjacent elements', () => {
      expect(swap(1, 2)([1, 2, 3])).toEqual([1, 3, 2]);
    });
  });
});

describe('Arithmetic Functions', () => {
  it('add returns sum', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('subtract returns difference', () => {
    expect(subtract(5, 3)).toBe(2);
  });

  it('multiply returns product', () => {
    expect(multiply(4, 3)).toBe(12);
  });

  it('divide returns quotient', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('max returns larger value', () => {
    expect(max(5, 3)).toBe(5);
    expect(max(3, 5)).toBe(5);
  });

  it('min returns smaller value', () => {
    expect(min(5, 3)).toBe(3);
    expect(min(3, 5)).toBe(3);
  });
});

describe('Boolean Functions', () => {
  describe('truthy', () => {
    it('returns true for truthy values', () => {
      expect(truthy(1)).toBe(true);
      expect(truthy('hello')).toBe(true);
      expect(truthy([])).toBe(true);
      expect(truthy({})).toBe(true);
    });

    it('returns false for falsey values', () => {
      expect(truthy(0)).toBe(false);
      expect(truthy('')).toBe(false);
      expect(truthy(null)).toBe(false);
      expect(truthy(undefined)).toBe(false);
    });
  });

  describe('falsey', () => {
    it('returns false for truthy values', () => {
      expect(falsey(1)).toBe(false);
      expect(falsey('hello')).toBe(false);
    });

    it('returns true for falsey values', () => {
      expect(falsey(0)).toBe(true);
      expect(falsey('')).toBe(true);
      expect(falsey(null)).toBe(true);
    });
  });
});

describe('Array Transformations', () => {
  describe('toIndexed', () => {
    it('converts to indexed tuple', () => {
      const result = ['a', 'b', 'c'].map(toIndexed);
      expect(result).toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);
    });
  });

  describe('splitEvery', () => {
    it('splits array into chunks', () => {
      expect(splitEvery([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    it('handles incomplete final chunk', () => {
      expect(splitEvery([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe('multiMap operations', () => {
    it('addArray adds corresponding elements', () => {
      expect(addArray([1, 2, 3], [4, 5, 6])).toEqual([5, 7, 9]);
    });

    it('subtractArray subtracts corresponding elements', () => {
      expect(subtractArray([5, 6, 7], [1, 2, 3])).toEqual([4, 4, 4]);
    });

    it('multiplyArray multiplies corresponding elements', () => {
      expect(multiplyArray([2, 3, 4], [5, 6, 7])).toEqual([10, 18, 28]);
    });
  });

  describe('toNumbers', () => {
    it('converts strings to numbers', () => {
      expect(toNumbers(['1', '2', '3'])).toEqual([1, 2, 3]);
    });

    it('converts booleans to numbers', () => {
      expect(toNumbers([true, false, true])).toEqual([1, 0, 1]);
    });
  });

  describe('unique', () => {
    it('removes duplicates from array', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('diff', () => {
    it('returns differences between two arrays', () => {
      const [diffA, diffB] = diff([1, 2, 3], [2, 3, 4]);
      expect(diffA).toEqual([1]);
      expect(diffB).toEqual([4]);
    });
  });
});

describe('Matrix Operations', () => {
  describe('transpose', () => {
    it('transposes 2D array', () => {
      const matrix = [[1, 2], [3, 4]];
      expect(transpose(matrix)).toEqual([[1, 3], [2, 4]]);
    });

    it('transposes rectangular matrix', () => {
      const matrix = [[1, 2, 3], [4, 5, 6]];
      expect(transpose(matrix)).toEqual([[1, 4], [2, 5], [3, 6]]);
    });
  });

  describe('flipHor', () => {
    it('flips matrix horizontally', () => {
      const matrix = [[1, 2], [3, 4]];
      expect(flipHor(matrix)).toEqual([[2, 1], [4, 3]]);
    });
  });

  describe('flipVer', () => {
    it('flips matrix vertically', () => {
      const matrix = [[1, 2], [3, 4]];
      expect(flipVer(matrix)).toEqual([[3, 4], [1, 2]]);
    });
  });

  describe('rotate', () => {
    it('rotates matrix 90 degrees counter-clockwise', () => {
      const matrix = [[1, 2], [3, 4]];
      // rotate = flipVer(transpose)
      expect(rotate(matrix)).toEqual([[2, 4], [1, 3]]);
    });
  });

  describe('derotate', () => {
    it('rotates matrix 90 degrees clockwise', () => {
      const matrix = [[1, 2], [3, 4]];
      // derotate = transpose(flipVer)
      expect(derotate(matrix)).toEqual([[3, 1], [4, 2]]);
    });
  });
});

describe('clamp (curried)', () => {
  it('clamps value to range', () => {
    const clamp0to10 = clamp(0, 10);
    expect(clamp0to10(5)).toBe(5);
    expect(clamp0to10(-5)).toBe(0);
    expect(clamp0to10(15)).toBe(10);
  });
});

describe('mod', () => {
  it('performs modulo operation', () => {
    expect(mod(5, 3)).toBe(2);
    expect(mod(6, 3)).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(mod(-1, 3)).toBe(2);
    expect(mod(-4, 3)).toBe(2);
  });

  it('wraps correctly', () => {
    expect([0, 1, 2, 3, 4, 5].map(n => mod(n, 3))).toEqual([0, 1, 2, 0, 1, 2]);
  });
});

describe('rmod', () => {
  it('reflects instead of wrapping', () => {
    // The reflection pattern for m=3: m - 2 * |mod(0.5*n, m) - 1|
    const results = [0, 1, 2, 3, 4, 5].map(n => rmod(n, 3));
    // rmod produces a triangular wave pattern
    expect(results[1]).toBeCloseTo(2, 5);
    expect(results[3]).toBeCloseTo(2, 5);
  });
});

describe('int', () => {
  it('truncates to integer', () => {
    expect(int(3.7)).toBe(3);
    expect(int(-3.7)).toBe(-3);
    expect(int(0.9)).toBe(0);
  });
});

describe('isInteger', () => {
  it('returns true for integers', () => {
    expect(isInteger(5)).toBe(true);
    expect(isInteger(-3)).toBe(true);
    expect(isInteger(0)).toBe(true);
  });

  it('returns false for non-integers', () => {
    expect(isInteger(3.14)).toBe(false);
    expect(isInteger(NaN)).toBe(false);
    expect(isInteger(Infinity)).toBe(false);
  });
});

describe('between', () => {
  it('returns true when value is between bounds', () => {
    expect(between(5, 0, 10)).toBe(true);
    expect(between(0, 0, 10)).toBe(true);
    expect(between(10, 0, 10)).toBe(true);
  });

  it('returns false when value is outside bounds', () => {
    expect(between(-1, 0, 10)).toBe(false);
    expect(between(11, 0, 10)).toBe(false);
  });
});

describe('Object Path Access', () => {
  describe('at', () => {
    it('accesses nested properties', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(at(obj, 'a.b.c')).toBe(42);
    });

    it('accesses single property', () => {
      const obj = { name: 'test' };
      expect(at(obj, 'name')).toBe('test');
    });
  });

  describe('reach', () => {
    it('accesses nested properties via array path', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(reach(obj, ['a', 'b', 'c'])).toBe(42);
    });

    it('accesses array elements', () => {
      const obj = { items: [1, 2, 3] };
      expect(reach(obj, ['items', 1])).toBe(2);
    });

    it('returns undefined for invalid path', () => {
      const obj = { a: 1 };
      expect(reach(obj, ['b', 'c'])).toBeUndefined();
    });
  });
});

describe('derivative', () => {
  it('calculates differences between consecutive elements', () => {
    expect(derivative([1, 3, 6, 10])).toEqual([2, 3, 4]);
  });

  it('handles negative differences', () => {
    expect(derivative([10, 7, 3, 0])).toEqual([-3, -4, -3]);
  });

  it('returns empty array for single element', () => {
    expect(derivative([5])).toEqual([]);
  });
});

describe('countIf', () => {
  it('counts elements matching condition', () => {
    const isEven = (x: number) => x % 2 === 0;
    expect(countIf(isEven)([1, 2, 3, 4, 5, 6])).toBe(3);
  });

  it('returns 0 when no matches', () => {
    const isNegative = (x: number) => x < 0;
    expect(countIf(isNegative)([1, 2, 3])).toBe(0);
  });
});

describe('makeObject', () => {
  it('creates object from key-value pairs', () => {
    const pairs: [string, number][] = [['a', 1], ['b', 2]];
    expect(makeObject(pairs)).toEqual({ a: 1, b: 2 });
  });

  it('handles empty array', () => {
    expect(makeObject([])).toEqual({});
  });
});

describe('deepEqual', () => {
  it('returns true for equal primitives', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('a', 'a')).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
  });

  it('returns false for different primitives', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('a', 'b')).toBe(false);
  });

  it('returns true for equal objects', () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it('returns false for different objects', () => {
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('handles nested objects', () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  it('handles arrays', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('handles null and undefined', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
  });
});

describe('GraphNode', () => {
  it('creates node with value', () => {
    const node = new GraphNode(42);
    expect(node.value).toBe(42);
    expect(node.children.size).toBe(0);
    expect(node.parents.size).toBe(0);
  });

  it('adds child node', () => {
    const parent = new GraphNode('parent');
    const child = new GraphNode('child');
    parent.addChild(child);

    expect(parent.children.has(child)).toBe(true);
    expect(child.parents.has(parent)).toBe(true);
  });

  it('adds child by value', () => {
    const parent = new GraphNode('parent');
    parent.addChild('child');

    expect(parent.children.size).toBe(1);
  });
});

describe('Range', () => {
  it('creates range with min and max', () => {
    const range = new Range(0, 10);
    expect(range.min).toBe(0);
    expect(range.max).toBe(10);
    expect(range.delta).toBe(10);
  });

  it('swaps min and max if inverted', () => {
    const range = new Range(10, 0);
    expect(range.min).toBe(0);
    expect(range.max).toBe(10);
  });

  it('contains checks open range (exclusive)', () => {
    const range = new Range(0, 10);
    expect(range.contains(5)).toBe(true);
    expect(range.contains(0)).toBe(false);
    expect(range.contains(10)).toBe(false);
    expect(range.contains(-1)).toBe(false);
    expect(range.contains(11)).toBe(false);
  });
});

describe('ClosedRange', () => {
  it('contains checks closed range (inclusive)', () => {
    const range = new ClosedRange(0, 10);
    expect(range.contains(5)).toBe(true);
    expect(range.contains(0)).toBe(true);
    expect(range.contains(10)).toBe(true);
    expect(range.contains(-1)).toBe(false);
    expect(range.contains(11)).toBe(false);
  });
});

describe('getAdjacentIterator', () => {
  it('generates adjacent combinations', () => {
    const result = Array.from(getAdjacentIterator(2, [0, 2]));
    expect(result).toEqual([
      [0, 0], [0, 1], [0, 2],
      [1, 0], [1, 1], [1, 2],
      [2, 0], [2, 1], [2, 2]
    ]);
  });
});

describe('reduce', () => {
  it('reduces iterable with seed', () => {
    const result = reduce([1, 2, 3], 0, (acc, curr) => acc + curr);
    expect(result).toBe(6);
  });

  it('works with generators', () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 3;
    }
    const result = reduce(gen(), 0, (acc, curr) => acc + curr);
    expect(result).toBe(6);
  });
});

describe('charFrequency', () => {
  it('counts character occurrences', () => {
    expect(charFrequency('aab')).toEqual({ a: 2, b: 1 });
  });

  it('handles empty string', () => {
    expect(charFrequency('')).toEqual({});
  });
});

describe('memoize', () => {
  it('caches function results', () => {
    let callCount = 0;
    const fn = (x: number) => {
      callCount++;
      return x * 2;
    };
    const memoized = memoize(fn, (x) => x);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(1);

    expect(memoized(3)).toBe(6);
    expect(callCount).toBe(2);
  });
});

describe('splitAt', () => {
  it('splits array at index', () => {
    const [left, right] = splitAt([1, 2, 3, 4, 5], 2);
    expect(left).toEqual([1, 2]);
    expect(right).toEqual([3, 4, 5]);
  });

  it('splits string at index', () => {
    const [left, right] = splitAt('hello', 2);
    expect(left).toBe('he');
    expect(right).toBe('llo');
  });
});

describe('isDefined', () => {
  it('returns true for defined values', () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(null)).toBe(true);
    expect(isDefined(false)).toBe(true);
  });

  it('returns false for undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });
});

describe('countBy', () => {
  it('counts elements matching predicate', () => {
    const isEven = (x: number) => x % 2 === 0;
    expect(countBy([1, 2, 3, 4, 5], isEven)).toBe(2);
  });
});

describe('addIfUnique', () => {
  it('adds item to set if unique', () => {
    const set = new Set([1, 2]);
    addIfUnique(set)(3);
    expect(set.has(3)).toBe(true);
  });

  it('does not add duplicate', () => {
    const set = new Set([1, 2]);
    addIfUnique(set)(2);
    expect(set.size).toBe(2);
  });
});

describe('pickProps', () => {
  it('picks specified properties', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pickProps(['a', 'c'], obj)).toEqual({ a: 1, c: 3 });
  });
});

describe('omit', () => {
  it('omits specified properties', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(['b'], obj)).toEqual({ a: 1, c: 3 });
  });
});

describe('ensureArray', () => {
  it('wraps non-array in array', () => {
    expect(ensureArray(5)).toEqual([5]);
    expect(ensureArray('hello')).toEqual(['hello']);
  });

  it('returns array unchanged', () => {
    expect(ensureArray([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe('curry', () => {
  it('curries function', () => {
    const add3 = (a: number, b: number, c: number) => a + b + c;
    const curriedAdd = curry(add3);

    expect(curriedAdd(1)(2)(3)).toBe(6);
    expect(curriedAdd(1, 2)(3)).toBe(6);
    expect(curriedAdd(1)(2, 3)).toBe(6);
    expect(curriedAdd(1, 2, 3)).toBe(6);
  });
});
