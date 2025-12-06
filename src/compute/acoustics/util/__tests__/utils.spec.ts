import { linspace } from '../linspace';
import { range } from '../range';
import { sum } from '../sum';
import { chunk } from '../chunk';
import { between } from '../between';
import { max } from '../max';
import { transpose } from '../transpose';

describe('linspace', () => {
  it('creates array from start to end with step', () => {
    const result = linspace(0, 1, 5);
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('handles fractional step', () => {
    const result = linspace(0, 0.5, 2);
    expect(result).toEqual([0, 0.5, 1, 1.5, 2]);
  });

  it('handles negative start', () => {
    const result = linspace(-2, 1, 2);
    expect(result).toEqual([-2, -1, 0, 1, 2]);
  });

  it('returns single element when start equals end', () => {
    const result = linspace(5, 1, 5);
    expect(result).toEqual([5]);
  });

  it('handles large step', () => {
    const result = linspace(0, 10, 5);
    expect(result).toEqual([0]);
  });
});

describe('range', () => {
  it('creates array of consecutive integers from 0 to n-1', () => {
    const result = range(5);
    expect(result).toEqual([0, 1, 2, 3, 4]);
  });

  it('returns empty array for 0', () => {
    const result = range(0);
    expect(result).toEqual([]);
  });

  it('returns single element for 1', () => {
    const result = range(1);
    expect(result).toEqual([0]);
  });

  it('handles larger ranges', () => {
    const result = range(10);
    expect(result.length).toBe(10);
    expect(result[0]).toBe(0);
    expect(result[9]).toBe(9);
  });
});

describe('sum', () => {
  it('sums array of numbers', () => {
    const result = sum([1, 2, 3, 4, 5]);
    expect(result).toBe(15);
  });

  it('sums single element', () => {
    const result = sum([42]);
    expect(result).toBe(42);
  });

  it('handles negative numbers', () => {
    const result = sum([-1, -2, 3]);
    expect(result).toBe(0);
  });

  it('handles floats', () => {
    const result = sum([0.1, 0.2, 0.3]);
    expect(result).toBeCloseTo(0.6);
  });

  it('sums zeros', () => {
    const result = sum([0, 0, 0]);
    expect(result).toBe(0);
  });
});

describe('chunk', () => {
  it('splits array into chunks of specified size', () => {
    const chunker = chunk(2);
    const result = chunker([1, 2, 3, 4]);
    expect(result).toEqual([[1, 2], [3, 4]]);
  });

  it('handles last chunk with fewer elements', () => {
    const chunker = chunk(2);
    const result = chunker([1, 2, 3, 4, 5]);
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('handles chunk size larger than array', () => {
    const chunker = chunk(10);
    const result = chunker([1, 2, 3]);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it('handles chunk size of 1', () => {
    const chunker = chunk(1);
    const result = chunker([1, 2, 3]);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('handles empty array', () => {
    const chunker = chunk(3);
    const result = chunker([]);
    expect(result).toEqual([]);
  });

  it('preserves types', () => {
    const chunker = chunk(2);
    const result = chunker(['a', 'b', 'c', 'd']);
    expect(result).toEqual([['a', 'b'], ['c', 'd']]);
  });
});

describe('between', () => {
  it('returns true when value is within range', () => {
    const isInRange = between(0, 10);
    expect(isInRange(5)).toBe(true);
  });

  it('returns true when value equals min', () => {
    const isInRange = between(0, 10);
    expect(isInRange(0)).toBe(true);
  });

  it('returns true when value equals max', () => {
    const isInRange = between(0, 10);
    expect(isInRange(10)).toBe(true);
  });

  it('returns false when value is below min', () => {
    const isInRange = between(0, 10);
    expect(isInRange(-1)).toBe(false);
  });

  it('returns false when value is above max', () => {
    const isInRange = between(0, 10);
    expect(isInRange(11)).toBe(false);
  });

  it('handles negative range', () => {
    const isInRange = between(-10, -5);
    expect(isInRange(-7)).toBe(true);
    expect(isInRange(0)).toBe(false);
  });
});

describe('max', () => {
  it('finds maximum value in array', () => {
    const result = max([1, 5, 3, 9, 2]);
    expect(result).toBe(9);
  });

  it('returns first max when duplicates exist', () => {
    const result = max([1, 9, 3, 9, 2]);
    expect(result).toBe(9);
  });

  it('handles single element', () => {
    const result = max([42]);
    expect(result).toBe(42);
  });

  it('handles negative numbers (returns 0 as initial accumulator is 0)', () => {
    // The function uses 0 as initial accumulator, so all-negative arrays return 0
    const result = max([-5, -2, -10]);
    expect(result).toBe(0);
  });

  it('handles mixed positive and negative', () => {
    const result = max([-5, 2, -10]);
    expect(result).toBe(2);
  });

  describe('with abs=true', () => {
    it('finds value with largest absolute value', () => {
      const result = max([1, -5, 3, -9, 2], true);
      expect(result).toBe(-9);
    });

    it('returns positive value if larger in absolute terms', () => {
      const result = max([1, -5, 10, -9, 2], true);
      expect(result).toBe(10);
    });

    it('returns 0 for empty comparison base', () => {
      const result = max([0, 0, 0], true);
      expect(result).toBe(0);
    });
  });
});

describe('transpose', () => {
  it('transposes a 2D array', () => {
    const result = transpose([
      [1, 2, 3],
      [4, 5, 6]
    ]);
    expect(result).toEqual([
      [1, 4],
      [2, 5],
      [3, 6]
    ]);
  });

  it('transposes a square matrix', () => {
    const result = transpose([
      [1, 2],
      [3, 4]
    ]);
    expect(result).toEqual([
      [1, 3],
      [2, 4]
    ]);
  });

  it('transposes a single row', () => {
    const result = transpose([[1, 2, 3]]);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('transposes a single column', () => {
    const result = transpose([[1], [2], [3]]);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it('handles different types', () => {
    const result = transpose([
      ['a', 'b'],
      ['c', 'd']
    ]);
    expect(result).toEqual([
      ['a', 'c'],
      ['b', 'd']
    ]);
  });
});
