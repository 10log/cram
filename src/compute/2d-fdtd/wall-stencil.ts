/**
 * Wall neighbor for the 2D FDTD Laplacian, and the CPU mirror of
 * `shaders/height-map.frag`.
 *
 * A wall neighbor contributes a ghost pressure — not the opposite interior
 * cell, which is neither Dirichlet nor rigid (#111). The ghost is
 * `p_cell − γ_b·v_cell`, the locally-reacting impedance boundary derived in
 * `impedance.ts`; `γ = 0` gives `p_ghost = p_cell`, the rigid Neumann wall,
 * bit for bit. A wall whose gain exceeds `MAX_GHOST_GAIN` puts the excess into
 * a centred loss applied after the stencil — see
 * {@link applyCentredWallLoss}.
 *
 * Global `damping` is a numerical sponge on velocity, not air absorption
 * and not a surface material. It defaults to 1 — surfaces absorb, the sponge
 * does not.
 */

import { MAX_GHOST_GAIN, isWallChannel, splitGhostGain } from './impedance';

/**
 * Ghost pressure standing in for a wall neighbor.
 *
 * `cellVelocity` is this scheme's backward difference `p^n − p^{n−1}`, which is
 * what makes the impedance ghost a single multiply-add with no stored history.
 * Only the backward part of `ghostGain` goes here; the rest is
 * {@link applyCentredWallLoss}'s.
 */
export function wallGhostPressure(
  cellPressure: number,
  cellVelocity: number,
  ghostGain: number,
): number {
  return cellPressure - splitGhostGain(ghostGain).backward * cellVelocity;
}

/**
 * The centred remainder of a cell's wall gains, applied to the velocity the
 * stencil produced (#219).
 *
 * `centredGain` is `Σ γ_c` over the cell's wall neighbors. The loss
 * `C²·(γ_c/2)·(p^{n+1} − p^{n−1})` has `p^{n+1}` on both sides, and solving
 * for it is one divide:
 *
 * ```
 * v^{n+1} = (v* − β·v^n) / (1 + β),   β = ½·C²·Σ γ_c
 * ```
 *
 * Written on velocity rather than pressure so the field's rest offset never
 * enters, and returns `stepped` untouched at `centredGain = 0`, so a cell with
 * no such wall is bit-for-bit what it was.
 */
export function applyCentredWallLoss(
  stepped: number,
  previous: number,
  courantSq: number,
  centredGain: number,
): number {
  if (!(centredGain > 0)) return stepped;
  const beta = 0.5 * courantSq * centredGain;
  return (stepped - beta * previous) / (1 + beta);
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
 *   newvel = applyCentredWallLoss(newvel, vel, courantSq, Σγ_c)
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
  let centredGain = 0;
  // Same order as stepField sums them, so the two agree to the bit.
  for (const n of [neighbors.l, neighbors.r, neighbors.d, neighbors.u]) {
    if (n.isWall) centredGain += splitGhostGain(n.ghostGain ?? 0).centred;
  }
  const velocity = applyCentredWallLoss(
    4 * courantSq * (mid - cell.pressure) + cell.velocity * damping,
    cell.velocity,
    courantSq,
    centredGain,
  );
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
 * ghost is `p − γv`, the Laplacian is `Σghost − 4p` and the centred loss acts
 * on velocity, all of which are invariant to a constant added to every
 * pressure.
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
 *
 * `maxGhostGain` is the shader's uniform of the same name. Only tests move it:
 * `Infinity` gives the pure backward ghost at any gain, which is how the
 * `γ = 1` bound that sets {@link MAX_GHOST_GAIN} stays measured.
 */
export function stepField(
  field: Field2D,
  courantSq: number,
  damping: number,
  scratch: { pressure: Float64Array; velocity: Float64Array },
  maxGhostGain = MAX_GHOST_GAIN,
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
      let centredGain = 0;
      for (let n = 0; n < 4; n++) {
        const nb =
          n === 0 ? (i > 0 ? idx - 1 : idx)
          : n === 1 ? (i < nx - 1 ? idx + 1 : idx)
          : n === 2 ? (j > 0 ? idx - nx : idx)
          : (j < ny - 1 ? idx + nx : idx);
        const c = channel[nb];
        if (c > 0) {
          sum += pressure[nb];
        } else {
          // The channel holds -γ: the backward ghost takes up to
          // maxGhostGain of it, the centred loss the rest.
          sum += p + Math.max(c, -maxGhostGain) * v;
          centredGain += Math.max(-c - maxGhostGain, 0);
        }
      }
      const vel = applyCentredWallLoss(
        courantSq * (sum - 4 * p) + v * damping,
        v,
        courantSq,
        centredGain,
      );
      nextV[idx] = vel;
      nextP[idx] = p + vel;
    }
  }
  field.pressure.set(nextP);
  field.velocity.set(nextV);
}
