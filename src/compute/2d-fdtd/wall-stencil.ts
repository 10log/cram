/**
 * Wall neighbor for the 2D FDTD Laplacian, and the CPU mirror of
 * `shaders/height-map.frag`.
 *
 * A wall neighbor contributes a ghost pressure — not the opposite interior
 * cell, which is neither Dirichlet nor rigid (#111). The ghost is
 * `p_cell − γ·v_cell`, the locally-reacting impedance boundary derived in
 * `impedance.ts`; `γ = 0` gives `p_ghost = p_cell`, the rigid Neumann wall,
 * bit for bit.
 *
 * Global `damping` is a numerical sponge on velocity, not air absorption
 * and not a surface material. It defaults to 1 — surfaces absorb, the sponge
 * does not.
 */

import { isWallChannel } from './impedance';

/**
 * Ghost pressure standing in for a wall neighbor.
 *
 * `cellVelocity` is this scheme's backward difference `p^n − p^{n−1}`, which is
 * what makes the impedance ghost a single multiply-add with no stored history.
 */
export function wallGhostPressure(
  cellPressure: number,
  cellVelocity: number,
  ghostGain: number,
): number {
  return cellPressure - ghostGain * cellVelocity;
}

/** The `γ = 0` case of {@link wallGhostPressure}: a perfectly rigid wall. */
export function rigidNeighborPressure(
  cellPressure: number,
  neighborPressure: number,
  neighborIsWall: boolean,
): number {
  return neighborIsWall ? cellPressure : neighborPressure;
}

export interface StencilCell {
  pressure: number;
  velocity: number;
  isWall: boolean;
  /** Impedance ghost gain of *this* cell as a wall. Absent or 0 is rigid. */
  ghostGain?: number;
}

function neighborPressure(cell: StencilCell, neighbor: StencilCell): number {
  if (!neighbor.isWall) return neighbor.pressure;
  return wallGhostPressure(cell.pressure, cell.velocity, neighbor.ghostGain ?? 0);
}

/**
 * One interior update matching height-map.frag:
 *   mid = 0.25*(u+d+r+l)
 *   newvel = 4*courantSq*(mid-pos) + vel*damping
 *   newpos = pos + newvel
 * Wall cells stay at rest.
 */
export function stepInteriorCell(
  cell: StencilCell,
  neighbors: { u: StencilCell; d: StencilCell; r: StencilCell; l: StencilCell },
  courantSq: number,
  damping: number,
  restPressure = 0,
): StencilCell {
  if (cell.isWall) {
    return { pressure: restPressure, velocity: 0, isWall: true, ghostGain: cell.ghostGain };
  }
  const u = neighborPressure(cell, neighbors.u);
  const d = neighborPressure(cell, neighbors.d);
  const r = neighborPressure(cell, neighbors.r);
  const l = neighborPressure(cell, neighbors.l);
  const mid = 0.25 * (u + d + r + l);
  const velocity = 4 * courantSq * (mid - cell.pressure) + cell.velocity * damping;
  return { pressure: cell.pressure + velocity, velocity, isWall: false };
}

/** Advance a 1-D strip with the 2-D stencil (no variation in Y). */
export function stepStrip(
  pressure: number[],
  velocity: number[],
  wall: boolean[],
  courantSq: number,
  damping: number,
  restPressure = 0,
  ghostGain: number[] = [],
): { pressure: number[]; velocity: number[] } {
  const n = pressure.length;
  const nextP = new Array<number>(n);
  const nextV = new Array<number>(n);
  const at = (i: number, isWall: boolean): StencilCell => ({
    pressure: pressure[i],
    velocity: velocity[i],
    isWall,
    ghostGain: ghostGain[i] ?? 0,
  });
  for (let i = 0; i < n; i++) {
    const cell = at(i, wall[i]);
    const left = i > 0 ? i - 1 : i;
    const right = i < n - 1 ? i + 1 : i;
    const stepped = stepInteriorCell(
      cell,
      {
        u: cell,
        d: cell,
        l: at(left, wall[left] || i === 0),
        r: at(right, wall[right] || i === n - 1),
      },
      courantSq,
      damping,
      restPressure,
    );
    nextP[i] = stepped.pressure;
    nextV[i] = stepped.velocity;
  }
  return { pressure: nextP, velocity: nextV };
}

/**
 * A 2-D field, laid out as the heightmap and sourcemap textures are.
 *
 * `channel` is the sourcemap's blue channel: positive for air, `-γ` for a
 * wall. Out-of-grid neighbors clamp to the cell itself, which is what
 * `ClampToEdgeWrapping` makes the shader do, and which reads as rigid.
 *
 * Pressure here is referenced to zero, where the textures carry the water
 * demo's `REST_PRESSURE` offset of 127.5. Nothing in the update notices: the
 * ghost is `p − γv` and the Laplacian is `Σghost − 4p`, both of which are
 * invariant to a constant added to every pressure.
 */
export interface Field2D {
  nx: number;
  ny: number;
  pressure: Float64Array;
  velocity: Float64Array;
  channel: Float64Array;
}

export function createField2D(nx: number, ny: number): Field2D {
  const size = nx * ny;
  return {
    nx,
    ny,
    pressure: new Float64Array(size),
    velocity: new Float64Array(size),
    channel: new Float64Array(size).fill(1),
  };
}

/**
 * Advance a whole field one step, in place.
 *
 * `scratch` is the caller's, so a loop of 100,000 steps allocates nothing.
 */
export function stepField(
  field: Field2D,
  courantSq: number,
  damping: number,
  scratch: { pressure: Float64Array; velocity: Float64Array },
): void {
  const { nx, ny, pressure, velocity, channel } = field;
  const nextP = scratch.pressure;
  const nextV = scratch.velocity;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const idx = j * nx + i;
      if (isWallChannel(channel[idx])) {
        nextP[idx] = 0;
        nextV[idx] = 0;
        continue;
      }
      const p = pressure[idx];
      const v = velocity[idx];
      // Inlined rather than routed through a helper per neighbor: this loop
      // runs nx*ny times per step for tens of thousands of steps in the decay
      // tests, and a closure per cell showed up in their wall clock.
      let sum = 0;
      for (let n = 0; n < 4; n++) {
        const nb =
          n === 0 ? (i > 0 ? idx - 1 : idx)
          : n === 1 ? (i < nx - 1 ? idx + 1 : idx)
          : n === 2 ? (j > 0 ? idx - nx : idx)
          : (j < ny - 1 ? idx + nx : idx);
        const c = channel[nb];
        sum += c > 0 ? pressure[nb] : p + c * v;
      }
      const vel = courantSq * (sum - 4 * p) + v * damping;
      nextV[idx] = vel;
      nextP[idx] = p + vel;
    }
  }
  field.pressure.set(nextP);
  field.velocity.set(nextV);
}
