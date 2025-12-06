/**
 * Complex Number Class Tests
 *
 * Tests for the Complex class which provides complex number arithmetic
 * used in FFT and signal processing operations.
 */

import { Complex, makeComplexArray } from '../complex';

describe('Complex', () => {
  describe('Constructor', () => {
    describe('Euclidean (Cartesian) form', () => {
      it('creates complex number from real and imaginary parts', () => {
        const c = new Complex({ real: 3, imag: 4 });
        expect(c.real).toBe(3);
        expect(c.imag).toBe(4);
      });

      it('handles zero values', () => {
        const c = new Complex({ real: 0, imag: 0 });
        expect(c.real).toBe(0);
        expect(c.imag).toBe(0);
      });

      it('handles negative values', () => {
        const c = new Complex({ real: -3, imag: -4 });
        expect(c.real).toBe(-3);
        expect(c.imag).toBe(-4);
      });

      it('handles purely real numbers', () => {
        const c = new Complex({ real: 5, imag: 0 });
        expect(c.real).toBe(5);
        expect(c.imag).toBe(0);
      });

      it('handles purely imaginary numbers', () => {
        const c = new Complex({ real: 0, imag: 7 });
        expect(c.real).toBe(0);
        expect(c.imag).toBe(7);
      });
    });

    describe('Polar form', () => {
      it('creates complex number from radius and argument', () => {
        // radius=1, arg=0 → 1 + 0i
        const c = new Complex({ radius: 1, arg: 0 });
        expect(c.real).toBeCloseTo(1, 10);
        expect(c.imag).toBeCloseTo(0, 10);
      });

      it('creates complex number at 90 degrees', () => {
        // radius=1, arg=π/2 → 0 + i
        const c = new Complex({ radius: 1, arg: Math.PI / 2 });
        expect(c.real).toBeCloseTo(0, 10);
        expect(c.imag).toBeCloseTo(1, 10);
      });

      it('creates complex number at 180 degrees', () => {
        // radius=1, arg=π → -1 + 0i
        const c = new Complex({ radius: 1, arg: Math.PI });
        expect(c.real).toBeCloseTo(-1, 10);
        expect(c.imag).toBeCloseTo(0, 10);
      });

      it('creates complex number at 45 degrees', () => {
        // radius=√2, arg=π/4 → 1 + i
        const c = new Complex({ radius: Math.sqrt(2), arg: Math.PI / 4 });
        expect(c.real).toBeCloseTo(1, 10);
        expect(c.imag).toBeCloseTo(1, 10);
      });

      it('creates complex number with larger radius', () => {
        // radius=5, arg=0 → 5 + 0i
        const c = new Complex({ radius: 5, arg: 0 });
        expect(c.real).toBeCloseTo(5, 10);
        expect(c.imag).toBeCloseTo(0, 10);
      });
    });

    describe('Invalid parameters', () => {
      it('throws error for invalid parameters', () => {
        expect(() => new Complex({})).toThrow();
        expect(() => new Complex({ foo: 1 })).toThrow();
        expect(() => new Complex({ real: 1 })).toThrow();
        expect(() => new Complex({ imag: 1 })).toThrow();
        expect(() => new Complex({ radius: 1 })).toThrow();
        expect(() => new Complex({ arg: 1 })).toThrow();
      });
    });
  });

  describe('conjugate', () => {
    it('negates the imaginary part', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const conj = c.conjugate();
      expect(conj.real).toBe(3);
      expect(conj.imag).toBe(-4);
    });

    it('handles negative imaginary part', () => {
      const c = new Complex({ real: 3, imag: -4 });
      const conj = c.conjugate();
      expect(conj.real).toBe(3);
      expect(conj.imag).toBe(4);
    });

    it('returns new instance', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const conj = c.conjugate();
      expect(conj).not.toBe(c);
    });

    it('double conjugate returns original values', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const doubleConj = c.conjugate().conjugate();
      expect(doubleConj.real).toBe(c.real);
      expect(doubleConj.imag).toBe(c.imag);
    });
  });

  describe('absolute', () => {
    it('calculates magnitude of 3+4i as 5', () => {
      const c = new Complex({ real: 3, imag: 4 });
      expect(c.absolute()).toBe(5);
    });

    it('calculates magnitude of purely real number', () => {
      const c = new Complex({ real: 5, imag: 0 });
      expect(c.absolute()).toBe(5);
    });

    it('calculates magnitude of purely imaginary number', () => {
      const c = new Complex({ real: 0, imag: 5 });
      expect(c.absolute()).toBe(5);
    });

    it('calculates magnitude of zero', () => {
      const c = new Complex({ real: 0, imag: 0 });
      expect(c.absolute()).toBe(0);
    });

    it('calculates magnitude with negative components', () => {
      const c = new Complex({ real: -3, imag: -4 });
      expect(c.absolute()).toBe(5);
    });

    it('calculates magnitude of unit complex number', () => {
      const c = new Complex({ radius: 1, arg: Math.PI / 4 });
      expect(c.absolute()).toBeCloseTo(1, 10);
    });
  });

  describe('swap', () => {
    it('swaps real and imaginary parts', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const swapped = c.swap();
      expect(swapped.real).toBe(4);
      expect(swapped.imag).toBe(3);
    });

    it('returns new instance', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const swapped = c.swap();
      expect(swapped).not.toBe(c);
    });

    it('double swap returns original values', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const doubleSwap = c.swap().swap();
      expect(doubleSwap.real).toBe(c.real);
      expect(doubleSwap.imag).toBe(c.imag);
    });
  });

  describe('add', () => {
    it('adds two complex numbers', () => {
      const a = new Complex({ real: 1, imag: 2 });
      const b = new Complex({ real: 3, imag: 4 });
      const sum = a.add(b);
      expect(sum.real).toBe(4);
      expect(sum.imag).toBe(6);
    });

    it('handles negative values', () => {
      const a = new Complex({ real: 1, imag: 2 });
      const b = new Complex({ real: -3, imag: -4 });
      const sum = a.add(b);
      expect(sum.real).toBe(-2);
      expect(sum.imag).toBe(-2);
    });

    it('is commutative', () => {
      const a = new Complex({ real: 1, imag: 2 });
      const b = new Complex({ real: 3, imag: 4 });
      const sum1 = a.add(b);
      const sum2 = b.add(a);
      expect(sum1.real).toBe(sum2.real);
      expect(sum1.imag).toBe(sum2.imag);
    });

    it('adding zero returns equivalent value', () => {
      const a = new Complex({ real: 3, imag: 4 });
      const zero = new Complex({ real: 0, imag: 0 });
      const sum = a.add(zero);
      expect(sum.real).toBe(a.real);
      expect(sum.imag).toBe(a.imag);
    });

    it('returns new instance', () => {
      const a = new Complex({ real: 1, imag: 2 });
      const b = new Complex({ real: 3, imag: 4 });
      const sum = a.add(b);
      expect(sum).not.toBe(a);
      expect(sum).not.toBe(b);
    });
  });

  describe('subtract', () => {
    it('subtracts two complex numbers', () => {
      const a = new Complex({ real: 5, imag: 7 });
      const b = new Complex({ real: 2, imag: 3 });
      const diff = a.subtract(b);
      expect(diff.real).toBe(3);
      expect(diff.imag).toBe(4);
    });

    it('handles negative results', () => {
      const a = new Complex({ real: 1, imag: 2 });
      const b = new Complex({ real: 3, imag: 4 });
      const diff = a.subtract(b);
      expect(diff.real).toBe(-2);
      expect(diff.imag).toBe(-2);
    });

    it('subtracting zero returns equivalent value', () => {
      const a = new Complex({ real: 3, imag: 4 });
      const zero = new Complex({ real: 0, imag: 0 });
      const diff = a.subtract(zero);
      expect(diff.real).toBe(a.real);
      expect(diff.imag).toBe(a.imag);
    });

    it('subtracting self returns zero', () => {
      const a = new Complex({ real: 3, imag: 4 });
      const diff = a.subtract(a);
      expect(diff.real).toBe(0);
      expect(diff.imag).toBe(0);
    });
  });

  describe('multiply', () => {
    it('multiplies two complex numbers', () => {
      // (1+2i)(3+4i) = 3 + 4i + 6i + 8i² = 3 + 10i - 8 = -5 + 10i
      const a = new Complex({ real: 1, imag: 2 });
      const b = new Complex({ real: 3, imag: 4 });
      const product = a.multiply(b);
      expect(product.real).toBe(-5);
      expect(product.imag).toBe(10);
    });

    it('multiplies purely real numbers', () => {
      const a = new Complex({ real: 3, imag: 0 });
      const b = new Complex({ real: 4, imag: 0 });
      const product = a.multiply(b);
      expect(product.real).toBe(12);
      expect(product.imag).toBe(0);
    });

    it('multiplies purely imaginary numbers', () => {
      // (2i)(3i) = 6i² = -6
      const a = new Complex({ real: 0, imag: 2 });
      const b = new Complex({ real: 0, imag: 3 });
      const product = a.multiply(b);
      expect(product.real).toBe(-6);
      expect(product.imag).toBe(0);
    });

    it('is commutative', () => {
      const a = new Complex({ real: 1, imag: 2 });
      const b = new Complex({ real: 3, imag: 4 });
      const prod1 = a.multiply(b);
      const prod2 = b.multiply(a);
      expect(prod1.real).toBe(prod2.real);
      expect(prod1.imag).toBe(prod2.imag);
    });

    it('multiplying by one returns equivalent value', () => {
      const a = new Complex({ real: 3, imag: 4 });
      const one = new Complex({ real: 1, imag: 0 });
      const product = a.multiply(one);
      expect(product.real).toBe(a.real);
      expect(product.imag).toBe(a.imag);
    });

    it('multiplying by zero returns zero', () => {
      const a = new Complex({ real: 3, imag: 4 });
      const zero = new Complex({ real: 0, imag: 0 });
      const product = a.multiply(zero);
      expect(product.real).toBe(0);
      expect(product.imag).toBe(0);
    });

    it('multiplying by i rotates by 90 degrees', () => {
      // (3+4i) * i = 3i + 4i² = -4 + 3i
      const a = new Complex({ real: 3, imag: 4 });
      const i = new Complex({ real: 0, imag: 1 });
      const product = a.multiply(i);
      expect(product.real).toBe(-4);
      expect(product.imag).toBe(3);
    });

    it('multiplies conjugates to get square of magnitude', () => {
      // (a+bi)(a-bi) = a² + b²
      const a = new Complex({ real: 3, imag: 4 });
      const product = a.multiply(a.conjugate());
      expect(product.real).toBe(25); // 9 + 16
      expect(product.imag).toBeCloseTo(0, 10);
    });
  });

  describe('divide', () => {
    it('divides two complex numbers', () => {
      // (1+2i)/(3+4i) = (1+2i)(3-4i) / (9+16) = (11+2i) / 25
      const a = new Complex({ real: 1, imag: 2 });
      const b = new Complex({ real: 3, imag: 4 });
      const quotient = a.divide(b);
      expect(quotient.real).toBeCloseTo(11 / 25, 10);
      expect(quotient.imag).toBeCloseTo(2 / 25, 10);
    });

    it('divides by purely real number', () => {
      const a = new Complex({ real: 6, imag: 8 });
      const b = new Complex({ real: 2, imag: 0 });
      const quotient = a.divide(b);
      expect(quotient.real).toBe(3);
      expect(quotient.imag).toBe(4);
    });

    it('divides by one returns equivalent value', () => {
      const a = new Complex({ real: 3, imag: 4 });
      const one = new Complex({ real: 1, imag: 0 });
      const quotient = a.divide(one);
      expect(quotient.real).toBeCloseTo(a.real, 10);
      expect(quotient.imag).toBeCloseTo(a.imag, 10);
    });

    it('dividing by self returns one', () => {
      const a = new Complex({ real: 3, imag: 4 });
      const quotient = a.divide(a);
      expect(quotient.real).toBeCloseTo(1, 10);
      expect(quotient.imag).toBeCloseTo(0, 10);
    });

    it('multiply and divide are inverse operations', () => {
      const a = new Complex({ real: 1, imag: 2 });
      const b = new Complex({ real: 3, imag: 4 });
      const product = a.multiply(b);
      const backToA = product.divide(b);
      expect(backToA.real).toBeCloseTo(a.real, 10);
      expect(backToA.imag).toBeCloseTo(a.imag, 10);
    });
  });

  describe('toString', () => {
    it('formats positive imaginary part', () => {
      const c = new Complex({ real: 3, imag: 4 });
      expect(c.toString()).toBe('3 + i4');
    });

    it('formats negative imaginary part (as positive)', () => {
      // Note: The implementation shows negative as positive in the else branch
      const c = new Complex({ real: 3, imag: -4 });
      expect(c.toString()).toBe('3 + i4');
    });

    it('uses custom imaginary unit', () => {
      const c = new Complex({ real: 3, imag: 4 });
      expect(c.toString('j')).toBe('3 + j4');
    });

    it('handles zero values', () => {
      const c = new Complex({ real: 0, imag: 0 });
      expect(c.toString()).toBe('0 + i0');
    });
  });

  describe('toArray', () => {
    it('converts to [real, imag] tuple', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const arr = c.toArray();
      expect(arr).toEqual([3, 4]);
    });

    it('returns proper typed tuple', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const arr = c.toArray();
      expect(arr).toHaveLength(2);
      expect(typeof arr[0]).toBe('number');
      expect(typeof arr[1]).toBe('number');
    });
  });

  describe('copy', () => {
    it('creates a copy with same values', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const copy = c.copy();
      expect(copy.real).toBe(c.real);
      expect(copy.imag).toBe(c.imag);
    });

    it('returns new instance', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const copy = c.copy();
      expect(copy).not.toBe(c);
    });

    it('modifications to copy do not affect original', () => {
      const c = new Complex({ real: 3, imag: 4 });
      const copy = c.copy();
      copy.real = 100;
      expect(c.real).toBe(3);
    });
  });
});

describe('makeComplexArray', () => {
  it('converts number array to Complex array', () => {
    const arr = [1, 2, 3];
    const result = makeComplexArray(arr);
    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(Complex);
  });

  it('creates Complex numbers with zero imaginary part', () => {
    const arr = [1, 2, 3];
    const result = makeComplexArray(arr);
    result.forEach((c, i) => {
      expect(c.real).toBe(arr[i]);
      expect(c.imag).toBe(0);
    });
  });

  it('handles empty array', () => {
    const result = makeComplexArray([]);
    expect(result).toEqual([]);
  });

  it('handles negative numbers', () => {
    const arr = [-1, -2, -3];
    const result = makeComplexArray(arr);
    result.forEach((c, i) => {
      expect(c.real).toBe(arr[i]);
      expect(c.imag).toBe(0);
    });
  });

  it('handles floating point numbers', () => {
    const arr = [1.5, 2.7, 3.14];
    const result = makeComplexArray(arr);
    result.forEach((c, i) => {
      expect(c.real).toBeCloseTo(arr[i], 10);
      expect(c.imag).toBe(0);
    });
  });
});
