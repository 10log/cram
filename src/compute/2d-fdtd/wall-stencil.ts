/**
 * Rigid-wall (Neumann) neighbor for the 2D FDTD Laplacian.
 *
 * Walls are perfectly rigid until material-aware impedance exists
 * (Surface.absorptionFunction is not read). A wall neighbor contributes
 * the cell's own pressure — ghost p = p_interior — not the opposite
 * interior cell.
 *
 * Global `damping` is a numerical sponge on velocity, not air absorption
 * and not a surface material.
 */
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
    return { pressure: restPressure, velocity: 0, isWall: true };
  }
  const u = rigidNeighborPressure(cell.pressure, neighbors.u.pressure, neighbors.u.isWall);
  const d = rigidNeighborPressure(cell.pressure, neighbors.d.pressure, neighbors.d.isWall);
  const r = rigidNeighborPressure(cell.pressure, neighbors.r.pressure, neighbors.r.isWall);
  const l = rigidNeighborPressure(cell.pressure, neighbors.l.pressure, neighbors.l.isWall);
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
): { pressure: number[]; velocity: number[] } {
  const n = pressure.length;
  const nextP = new Array<number>(n);
  const nextV = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const cell: StencilCell = { pressure: pressure[i], velocity: velocity[i], isWall: wall[i] };
    const left = i > 0 ? i - 1 : i;
    const right = i < n - 1 ? i + 1 : i;
    const stepped = stepInteriorCell(
      cell,
      {
        u: cell,
        d: cell,
        l: { pressure: pressure[left], velocity: velocity[left], isWall: wall[left] || i === 0 },
        r: { pressure: pressure[right], velocity: velocity[right], isWall: wall[right] || i === n - 1 },
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
