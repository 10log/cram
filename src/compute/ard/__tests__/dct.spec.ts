/**
 * Tests for the ARD solver's separable DCT (plan Phase 1).
 *
 * Three things have to hold before anything downstream can be trusted:
 *
 *  1. `inverse(forward(x)) === x` exactly, on non-square 2D and 3D grids —
 *     otherwise the modal update leaks energy every step.
 *  2. `forward` agrees with a direct O(N^2) DCT-II in FFTW's `REDFT10`
 *     normalization, so per-mode constants carry over from the reference
 *     implementation unchanged.
 *  3. A single cosine mode transforms to a single non-zero coefficient at the
 *     expected index — this is what makes the analytic per-mode update valid,
 *     and it is the property the reference gets wrong by starting its mode
 *     indices at 1 (see docs/ard-solver-plan.md §1.5 item 4).
 */

import { createDctPlan } from '../dct';

function fillPseudoRandom(target: Float64Array, seed: number): void {
  let state = seed >>> 0;
  for (let i = 0; i < target.length; i++) {
    state = (state * 1664525 + 1013904223) >>> 0;
    target[i] = state / 0x100000000 - 0.5;
  }
}

function maxAbsDiff(a: Float64Array, b: Float64Array): number {
  let worst = 0;
  for (let i = 0; i < a.length; i++) worst = Math.max(worst, Math.abs(a[i] - b[i]));
  return worst;
}

function maxAbs(a: Float64Array): number {
  let worst = 0;
  for (let i = 0; i < a.length; i++) worst = Math.max(worst, Math.abs(a[i]));
  return worst;
}

/** Direct DCT-II in FFTW's REDFT10 normalization, along one axis of a grid. */
function naiveRedft10(input: Float64Array, dims: number[], axis: number): Float64Array {
  const out = new Float64Array(input.length);
  let stride = 1;
  for (let d = 0; d < axis; d++) stride *= dims[d];
  const n = dims[axis];
  const block = n * stride;
  const outer = input.length / block;

  for (let o = 0; o < outer; o++) {
    for (let i = 0; i < stride; i++) {
      const base = o * block + i;
      for (let k = 0; k < n; k++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          sum += input[base + j * stride] * Math.cos((Math.PI * (2 * j + 1) * k) / (2 * n));
        }
        out[base + k * stride] = 2 * sum;
      }
    }
  }
  return out;
}

/** Direct separable DCT-II over every axis, for cross-checking the plan. */
function naiveForward(input: Float64Array, dims: number[]): Float64Array {
  let current = input;
  for (let axis = 0; axis < dims.length; axis++) {
    current = naiveRedft10(current, dims, axis);
  }
  return current;
}

describe('ARD separable DCT', () => {
  describe('round trip is the identity', () => {
    const grids: number[][] = [
      [1],
      [2],
      [8],
      [37],
      [4, 4],
      [8, 5], // non-square, both powers-of-two-free on one axis
      [37, 13], // both Bluestein
      [61, 4],
      [16, 1], // a 1-thick axis, as a 2D run sees it
      [1, 16],
      [4, 5, 6],
      [8, 3, 5],
      [13, 7, 11], // all three Bluestein
      [12, 9, 1],
    ];

    it.each(grids.map((dims) => [dims.join('x'), dims] as const))(
      '%s',
      (_label, dims) => {
        const plan = createDctPlan(dims);
        const values = new Float64Array(plan.size);
        fillPseudoRandom(values, plan.size * 17 + 3);
        const original = values.slice();

        const modes = new Float64Array(plan.size);
        const restored = new Float64Array(plan.size);
        plan.forward(values, modes);
        const modesAfterForward = modes.slice();
        plan.inverse(modes, restored);

        expect(maxAbsDiff(restored, original)).toBeLessThan(1e-12);
        // Neither direction may disturb its input when the buffers are
        // distinct: the partition step keeps the modal state across steps, and
        // re-reads the forcing field it just transformed.
        expect(maxAbsDiff(values, original)).toBe(0);
        expect(maxAbsDiff(modes, modesAfterForward)).toBe(0);
      },
    );
  });

  it('supports aliased input and output buffers', () => {
    const dims = [9, 5];
    const plan = createDctPlan(dims);
    const buffer = new Float64Array(plan.size);
    fillPseudoRandom(buffer, 4242);
    const original = buffer.slice();

    plan.forward(buffer, buffer);
    plan.inverse(buffer, buffer);

    expect(maxAbsDiff(buffer, original)).toBeLessThan(1e-12);
  });

  describe('forward matches a direct DCT-II', () => {
    const grids: number[][] = [[6], [8, 5], [7, 3], [4, 5, 3], [5, 5, 5]];

    it.each(grids.map((dims) => [dims.join('x'), dims] as const))(
      '%s',
      (_label, dims) => {
        const plan = createDctPlan(dims);
        const values = new Float64Array(plan.size);
        fillPseudoRandom(values, plan.size * 5 + 11);

        const modes = new Float64Array(plan.size);
        plan.forward(values, modes);
        const expected = naiveForward(values, dims);

        expect(maxAbsDiff(modes, expected)).toBeLessThan(1e-10);
      },
    );
  });

  describe('a single cosine mode maps to a single coefficient', () => {
    // The basis function for mode k on an axis of length N is
    // cos(pi*(j+0.5)*k/N). Mode indices start at 0, and mode 0 is the constant
    // DC mode whose angular frequency is zero.
    it.each([
      [0, 0],
      [1, 0],
      [0, 1],
      [2, 3],
      [5, 4],
      [11, 6],
    ])('2D mode (%i, %i)', (kx, ky) => {
      const nx = 12;
      const ny = 7;
      const plan = createDctPlan([nx, ny]);
      const values = new Float64Array(plan.size);

      for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
          values[x + nx * y] =
            Math.cos((Math.PI * (x + 0.5) * kx) / nx) * Math.cos((Math.PI * (y + 0.5) * ky) / ny);
        }
      }

      const modes = new Float64Array(plan.size);
      plan.forward(values, modes);

      const target = kx + nx * ky;
      const peak = Math.abs(modes[target]);
      expect(peak).toBeGreaterThan(1);

      // Everything else must be numerically zero relative to the peak.
      const leaked = modes.slice();
      leaked[target] = 0;
      expect(maxAbs(leaked) / peak).toBeLessThan(1e-12);
    });

    it('3D mode (2, 1, 3)', () => {
      const nx = 8;
      const ny = 6;
      const nz = 5;
      const [kx, ky, kz] = [2, 1, 3];
      const plan = createDctPlan([nx, ny, nz]);
      const values = new Float64Array(plan.size);

      for (let z = 0; z < nz; z++) {
        for (let y = 0; y < ny; y++) {
          for (let x = 0; x < nx; x++) {
            values[x + nx * (y + ny * z)] =
              Math.cos((Math.PI * (x + 0.5) * kx) / nx) *
              Math.cos((Math.PI * (y + 0.5) * ky) / ny) *
              Math.cos((Math.PI * (z + 0.5) * kz) / nz);
          }
        }
      }

      const modes = new Float64Array(plan.size);
      plan.forward(values, modes);

      const target = kx + nx * (ky + ny * kz);
      const peak = Math.abs(modes[target]);
      expect(peak).toBeGreaterThan(1);

      const leaked = modes.slice();
      leaked[target] = 0;
      expect(maxAbs(leaked) / peak).toBeLessThan(1e-12);
    });
  });

  it('maps a constant field to DC only', () => {
    const plan = createDctPlan([10, 6]);
    const values = new Float64Array(plan.size).fill(3);
    const modes = new Float64Array(plan.size);

    plan.forward(values, modes);

    // REDFT10 of a constant c over N samples puts 2*c*N at k=0.
    expect(modes[0]).toBeCloseTo(3 * 2 * 10 * 2 * 6, 8);
    const rest = modes.slice();
    rest[0] = 0;
    expect(maxAbs(rest)).toBeLessThan(1e-9);
  });

  it('a 1-thick axis leaves the other axes unchanged', () => {
    // A 2D run is a 3D grid with nz === 1; the extra axis must be a no-op
    // beyond the REDFT10 factor of 2 that `inverse` divides back out.
    const flat = createDctPlan([9, 5]);
    const slab = createDctPlan([9, 5, 1]);

    const values = new Float64Array(flat.size);
    fillPseudoRandom(values, 777);

    const flatModes = new Float64Array(flat.size);
    const slabModes = new Float64Array(slab.size);
    flat.forward(values, flatModes);
    slab.forward(values, slabModes);

    // The 1-thick axis contributes exactly a factor of 2.
    for (let i = 0; i < flatModes.length; i++) flatModes[i] *= 2;
    expect(maxAbsDiff(slabModes, flatModes)).toBeLessThan(1e-10);
  });

  it('exposes its dims and size', () => {
    const plan = createDctPlan([4, 6, 3]);
    expect(plan.dims).toEqual([4, 6, 3]);
    expect(plan.size).toBe(72);
  });

  it('publishes dims frozen, so they cannot drift from the built plan', () => {
    const input = [4, 6, 3];
    const plan = createDctPlan(input);

    expect(Object.isFrozen(plan.dims)).toBe(true);
    // Mutating the caller's array must not reach into the plan either.
    input[0] = 99;
    expect(plan.dims).toEqual([4, 6, 3]);
    expect(plan.size).toBe(72);
  });

  it('rejects malformed grids', () => {
    expect(() => createDctPlan([])).toThrow();
    expect(() => createDctPlan([0, 4])).toThrow();
    expect(() => createDctPlan([4, -1])).toThrow();
    expect(() => createDctPlan([4, 2.5])).toThrow();
  });

  it('rejects buffers that do not match the plan', () => {
    const plan = createDctPlan([4, 4]);
    const right = new Float64Array(16);
    const wrong = new Float64Array(9);
    expect(() => plan.forward(wrong, right)).toThrow();
    expect(() => plan.forward(right, wrong)).toThrow();
    expect(() => plan.inverse(wrong, right)).toThrow();
  });
});
