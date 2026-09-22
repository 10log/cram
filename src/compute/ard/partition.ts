/**
 * Partition types and shared bookkeeping — Phase 4 of the ARD solver
 * (docs/ard-solver-plan.md).
 *
 * The room's air region is decomposed into axis-aligned boxes (Phase 3). Each
 * box is stepped by one of three partition kinds:
 *
 *  - `dct`  — the ARD interior solver. Exact per-mode update in a cosine basis,
 *             no numerical dispersion, time step bounded by source bandwidth.
 *  - `fdtd` — plain 6th-order finite differences, for regions a DCT partition
 *             cannot cover (too thin for the interface stencil) and as the
 *             independent cross-check that validates the DCT partition.
 *  - `pml`  — an absorbing layer, for open boundaries and room walls.
 *
 * ## Forcing-term convention
 *
 * `addForce` accumulates **`F` in `∂²p/∂t² = c²∇²p + F`** — that is, units of
 * pressure per time squared. Every partition kind applies it the same way, and
 * interface/wall/source code all produce that quantity.
 *
 * This matters because the reference implementation is inconsistent about it and
 * cannot notice. `Boundary::computeForcingTerms` sets `force = c²·sip`, which
 * `DCTPartition` then consumes as `2F/ω²·(1 − cos ωΔt)` — correct, since `ω`
 * already carries `c`. But `FDTDPartition::step` consumes the same field as
 * `c²Δt²·(KP + force)`, multiplying by `c²` a second time. The reference sets
 * `speedOfSound = 1.0`, so `c² = c⁴ = 1` and the two conventions coincide; at
 * `c = 343` they differ by a factor of ~10⁵. See
 * `__tests__/partition.spec.ts`, which drives a DCT and an FDTD partition
 * identically at a physical sound speed and would fail under the reference's
 * convention.
 *
 * ## Accumulate, never overwrite
 *
 * `addForce` accumulates (`+=`). The reference's `setForce` overwrites, so a
 * cell that is both a source cell and an interface cell — or that sits on two
 * interfaces at a partition corner — silently loses one contribution
 * (plan §1.5 item 6). Every partition also clears its forcing field at the end
 * of `step`, which `DCTPartition` in the reference never does (§1.5 item 7).
 *
 * ## Coordinates
 *
 * `box` is in global cell coordinates. Every method takes **local** cell
 * coordinates, `0 <= x < box.w` and so on. The linear layout is the same
 * first-axis-contiguous order the DCT plan uses: `x + w*(y + h*z)`.
 */

/** An axis-aligned box of cells, in global grid coordinates. */
export interface Box {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
}

/** The three spatial axes, as indices into a `[w, h, d]` extent triple. */
export const enum Axis {
  X = 0,
  Y = 1,
  Z = 2,
}

export interface PartitionParams {
  /** Extent and placement in global cell coordinates. */
  box: Box;
  /** Cell size in metres. */
  dx: number;
  /** Speed of sound in m/s. */
  c: number;
  /** Time step in seconds. */
  dt: number;
}

export interface Partition {
  readonly kind: 'dct' | 'fdtd' | 'pml';
  readonly box: Box;
  /** Cell size in metres. Every partition on a grid must agree. */
  readonly dx: number;
  /** Speed of sound in m/s. */
  readonly c: number;
  /** Time step in seconds. Partitions sharing an interface must agree. */
  readonly dt: number;
  /**
   * Whether the interface residual should include this partition's own
   * mirrored terms.
   *
   * A DCT partition solves with rigid (Neumann) walls, so the residual has to
   * both remove the mirror image and add the true neighbour: `true`. An FDTD or
   * PML partition's stencil already reads zero outside its array, so only the
   * true neighbour is added: `false`. Getting this wrong double-forces the
   * interface.
   */
  readonly includeSelfTerms: boolean;
  /**
   * Pressure field, for interfaces, recording and display.
   *
   * **The array identity is stable for the life of the partition.** Holding a
   * reference across `step()` is safe and sees updated values, for every
   * partition kind. `FdtdPartition` and `PmlPartition` rotate three time levels
   * internally and copy the current one here; `DctPartition` writes it in
   * place. Without that guarantee a receiver probe, a debug view or a
   * `postMessage` transfer that cached `partition.pressure` would silently read
   * a stale — and two steps later, a scratch — buffer on two of the three kinds.
   */
  readonly pressure: Float64Array;
  /** Advance one time step, then clear the forcing field. */
  step(): void;
  /** Pressure at a local cell. Out-of-range reads return 0. */
  pressureAt(x: number, y: number, z: number): number;
  /** Accumulate forcing at a local cell. Out-of-range writes are dropped. */
  addForce(x: number, y: number, z: number, f: number): void;
  /** Zero the forcing field. Called at the end of `step`. */
  clearForce(): void;
  /**
   * Multiply the whole solver state by a factor, damping the field uniformly.
   *
   * Both stored time levels are scaled, which is what makes this an exact
   * amplitude decay rather than an impulse: applied once per step it gives
   * geometric decay of the solution. The driver uses it for air attenuation —
   * the place the reference's `0.999` factor was standing in for, except
   * derived from a real absorption coefficient instead of invented.
   */
  scaleState(factor: number): void;
  dispose(): void;
}

/** Shared geometry, indexing and forcing-field bookkeeping. */
export abstract class PartitionBase implements Partition {
  abstract readonly kind: 'dct' | 'fdtd' | 'pml';
  abstract readonly includeSelfTerms: boolean;

  readonly box: Box;
  /** Local extents, `[nx, ny, nz]`. */
  readonly dims: readonly number[];
  readonly nx: number;
  readonly ny: number;
  readonly nz: number;
  readonly size: number;
  readonly dx: number;
  readonly c: number;
  readonly dt: number;

  abstract readonly pressure: Float64Array;
  protected readonly force: Float64Array;

  constructor(params: PartitionParams) {
    const { box, dx, c, dt } = params;
    // Integers, not just positive. `new Float64Array(10.5)` truncates to length
    // 10 while `for (x = 0; x < nx; x++)` with `nx = 10.5` still visits x = 10,
    // so a fractional extent reads and writes off the end of the array. A
    // Phase 3 decomposition bug would surface as silent corruption instead of
    // a constructor error. `createDctPlan` already fails closed this way; the
    // FDTD and PML partitions only pass through here.
    for (const [name, value] of [
      ['w', box.w],
      ['h', box.h],
      ['d', box.d],
      ['x', box.x],
      ['y', box.y],
      ['z', box.z],
    ] as const) {
      if (!Number.isInteger(value)) {
        throw new Error(`Partition box.${name} must be an integer, got ${value}`);
      }
    }
    if (box.w < 1 || box.h < 1 || box.d < 1) {
      throw new Error(`Partition extents must be >= 1, got ${box.w}x${box.h}x${box.d}`);
    }
    if (!(dx > 0) || !(c > 0) || !(dt > 0)) {
      throw new Error(`Partition needs positive dx, c and dt; got ${dx}, ${c}, ${dt}`);
    }

    this.box = { ...box };
    this.nx = box.w;
    this.ny = box.h;
    this.nz = box.d;
    this.dims = [box.w, box.h, box.d];
    this.size = box.w * box.h * box.d;
    this.dx = dx;
    this.c = c;
    this.dt = dt;

    this.force = new Float64Array(this.size);
  }

  /** Linear index of a local cell, or -1 if outside. */
  protected index(x: number, y: number, z: number): number {
    if (x < 0 || y < 0 || z < 0 || x >= this.nx || y >= this.ny || z >= this.nz) return -1;
    return x + this.nx * (y + this.ny * z);
  }

  pressureAt(x: number, y: number, z: number): number {
    const i = this.index(x, y, z);
    return i < 0 ? 0 : this.pressure[i];
  }

  addForce(x: number, y: number, z: number, f: number): void {
    const i = this.index(x, y, z);
    if (i >= 0) this.force[i] += f;
  }

  clearForce(): void {
    this.force.fill(0);
  }

  abstract step(): void;
  abstract scaleState(factor: number): void;

  dispose(): void {
    /* Typed arrays are collected with the instance; subclasses override if
     * they hold anything that is not. */
  }

  /** Courant number `c·dt/dx`, for stability reporting and tests. */
  get courant(): number {
    return (this.c * this.dt) / this.dx;
  }

  /** Number of axes with extent > 1. A 1-thick axis carries no derivative. */
  get rank(): number {
    return spatialRank(this.nx, this.ny, this.nz);
  }
}

/** Number of axes with extent greater than 1, clamped to at least 1. */
export function spatialRank(nx: number, ny: number, nz: number): number {
  return Math.max(1, (nx > 1 ? 1 : 0) + (ny > 1 ? 1 : 0) + (nz > 1 ? 1 : 0));
}

/**
 * Most negative value of the 6th-order stencil's Fourier symbol, at θ = π:
 * `|[4cos3θ − 54cos2θ + 540cosθ − 490]/180| = 1088/180`.
 */
export const WORST_CASE_SYMBOL = 1088 / 180;

/**
 * Stability bound on the Courant number for the explicit 6th-order update
 * `p^{n+1} = 2pⁿ − p^{n−1} + C²Ŝpⁿ`, which is stable while `C²·|Ŝ| ≤ 4`:
 *
 * ```
 * C ≤ sqrt(4 / (6.0444 · rank))   →   0.813 (1D), 0.575 (2D), 0.470 (3D)
 * ```
 *
 * Applies to {@link FdtdPartition} and, with a margin, to {@link PmlPartition}.
 * {@link DctPartition} has no CFL limit at all — every mode is an exact
 * oscillator — which is why the plan's default of Courant 0.5 is safe for room
 * interiors and unsafe for a 3D wall slab.
 */
export function vonNeumannCflLimit(rank: number): number {
  return Math.sqrt(4 / (WORST_CASE_SYMBOL * rank));
}

/**
 * 6th-order central second-difference coefficients, for offsets -3..+3.
 * The operator is `sum(STENCIL[k] * p[i + k - 3]) / (180 * dx^2)`.
 */
export const STENCIL_6TH = [2, -27, 270, -490, 270, -27, 2] as const;

/** Divisor that goes with {@link STENCIL_6TH}. */
export const STENCIL_6TH_DIV = 180;

/**
 * Cells either side of a partition face that the interface residual reads.
 *
 * Derived from {@link STENCIL_6TH}: the operator spans offsets -3..+3, so taps
 * reach three cells across a face. Two things depend on it and must not drift
 * apart — `interface.ts` sizes the residual with it, and `decompose.ts` uses it
 * to decide which boxes are too thin to carry an interface at all. Raising the
 * stencil order changes both, so it lives here with the stencil.
 */
export const INTERFACE_DEPTH = (STENCIL_6TH.length - 1) / 2;

/**
 * 4th-order central first-difference coefficients, for offsets -2..+2.
 * The operator is `sum(FIRST_DERIV_4TH[k] * p[i + k - 2]) / (12 * dx)`.
 */
export const FIRST_DERIV_4TH = [1, -8, 0, 8, -1] as const;

/** Divisor that goes with {@link FIRST_DERIV_4TH}. */
export const FIRST_DERIV_4TH_DIV = 12;
