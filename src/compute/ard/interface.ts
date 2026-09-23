/**
 * Interface handling between adjacent partitions — Phase 5, and the piece the
 * whole approach stands or falls on.
 *
 * ## Why this exists
 *
 * Every partition solves with rigid (Neumann) walls on all six faces. Where two
 * partitions meet, that wall is fictitious: the decomposition invented it, and
 * left alone it would reflect every wave that reaches it, turning one room into
 * a grid of sealed boxes. The fix is to add a forcing term that is exactly the
 * error the fictitious wall introduces.
 *
 * ## The residual
 *
 * For a cell near the interface, the true 6th-order Laplacian reads taps from
 * across the boundary. The rigid-wall solution instead reads the mirror image of
 * the partition's own cells. The residual is the difference, so adding
 * `c²·(∇²_true − ∇²_rigid)p` as forcing recovers the true operator.
 *
 * Index the 6th-order stencil `{2, −27, 270, −490, 270, −27, 2}` by offset
 * `o ∈ [−3, 3]`. Take a cell at depth `d ∈ {1, 2, 3}` from the interface (d = 1
 * is the cell touching it). Its taps at offsets `o ≥ d` cross the boundary,
 * landing on the neighbour's cell `t = o − d`; the mirror they would otherwise
 * read is this partition's own cell at the same depth `t` from the face. So
 * with
 *
 * ```
 * across[t] = neighbour's cell t from the face
 * own[t]    = this partition's cell t from the face
 * R(d)      = Σ_{t=0}^{3−d} STENCIL[3 + d + t] · (across[t] − own[t])
 * F(d)      = c² · R(d) / (180 · dx²)
 * ```
 *
 * Only three `across`/`own` values are ever needed, and the three depths are
 * three short dot products over them.
 *
 * This is the same operator as the reference's 6×7 coefficient table
 * (`Boundary.cpp`), rearranged so it can be derived rather than trusted.
 * `__tests__/interface.spec.ts` cross-checks the two forms term by term, so the
 * equivalence is a checked property and not a claim in a comment.
 *
 * ## `includeSelfTerms`
 *
 * A DCT partition really does mirror, so it needs the full `across − own`
 * difference. An FDTD or PML partition reads zero outside its array, so there is
 * no mirror to cancel and it takes `across` alone — dropping `own` is what
 * `includeSelfTerms: false` means. Applying the full difference to an FDTD
 * partition double-forces the interface.
 *
 * ## Units
 *
 * `F` is in the `∂²p/∂t² = c²∇²p + F` convention of `partition.ts`: the `c²` is
 * applied here, once, and partitions do not apply it again.
 */

import {
  Axis,
  INTERFACE_DEPTH,
  STENCIL_6TH,
  STENCIL_6TH_DIV,
  transverseAxes,
  type Box,
  type Partition,
} from './partition';

export { INTERFACE_DEPTH };

/**
 * A shared face between two partitions.
 *
 * `lower` is the partition on the negative side of `axis`, `upper` the one on
 * the positive side; the face sits at `lower`'s high edge and `upper`'s low
 * edge. `overlap` is the rectangle they share, in global cell coordinates, on
 * the two axes that are not `axis`.
 */
export interface PartitionInterface {
  axis: Axis;
  lower: Partition;
  upper: Partition;
  /** Inclusive-exclusive global ranges on the two transverse axes. */
  overlap: {
    uMin: number;
    uMax: number;
    vMin: number;
    vMax: number;
  };
}

const EXTENT: readonly ['w', 'h', 'd'] = ['w', 'h', 'd'];
const ORIGIN: readonly ['x', 'y', 'z'] = ['x', 'y', 'z'];

function lowEdge(box: Box, axis: Axis): number {
  return box[ORIGIN[axis]];
}

function highEdge(box: Box, axis: Axis): number {
  return box[ORIGIN[axis]] + box[EXTENT[axis]];
}

/**
 * Find the shared face between two partitions, or `null` if they do not touch.
 *
 * Two boxes share a face when they abut on exactly one axis (one's high edge
 * equals the other's low edge) and overlap positively on both others. Boxes that
 * merely touch along an edge or at a corner have zero overlap on a second axis
 * and are not interfaces — there is no area to exchange through.
 */
export function findInterface(a: Partition, b: Partition): PartitionInterface | null {
  for (let axis = Axis.X; axis <= Axis.Z; axis++) {
    let lower: Partition | null = null;
    let upper: Partition | null = null;

    if (highEdge(a.box, axis) === lowEdge(b.box, axis)) {
      lower = a;
      upper = b;
    } else if (highEdge(b.box, axis) === lowEdge(a.box, axis)) {
      lower = b;
      upper = a;
    } else {
      continue;
    }

    const [uAxis, vAxis] = transverseAxes(axis);
    const uMin = Math.max(lowEdge(a.box, uAxis), lowEdge(b.box, uAxis));
    const uMax = Math.min(highEdge(a.box, uAxis), highEdge(b.box, uAxis));
    const vMin = Math.max(lowEdge(a.box, vAxis), lowEdge(b.box, vAxis));
    const vMax = Math.min(highEdge(a.box, vAxis), highEdge(b.box, vAxis));

    if (uMax <= uMin || vMax <= vMin) continue;

    return { axis, lower, upper, overlap: { uMin, uMax, vMin, vMax } };
  }

  return null;
}

/** Every shared face among a set of partitions, each pair considered once. */
export function findInterfaces(partitions: readonly Partition[]): PartitionInterface[] {
  const found: PartitionInterface[] = [];
  for (let i = 0; i < partitions.length; i++) {
    for (let j = i + 1; j < partitions.length; j++) {
      const iface = findInterface(partitions[i], partitions[j]);
      if (iface) found.push(iface);
    }
  }
  return found;
}

/**
 * Read a partition's pressure at a point given by its depth from a face and the
 * two transverse global coordinates.
 *
 * `depth` counts inward from the face: 0 is the cell touching it. `fromHigh`
 * selects which face — the partition's high edge on `axis` (it is the `lower`
 * partition) or its low edge (it is the `upper` one).
 */
export function pressureAtDepth(
  part: Partition,
  axis: Axis,
  fromHigh: boolean,
  depth: number,
  gu: number,
  gv: number,
): number {
  const [uAxis, vAxis] = transverseAxes(axis);
  const local = [0, 0, 0];
  local[axis] = fromHigh ? part.box[EXTENT[axis]] - 1 - depth : depth;
  local[uAxis] = gu - part.box[ORIGIN[uAxis]];
  local[vAxis] = gv - part.box[ORIGIN[vAxis]];
  return part.pressureAt(local[0], local[1], local[2]);
}

export function addForceAtDepth(
  part: Partition,
  axis: Axis,
  fromHigh: boolean,
  depth: number,
  gu: number,
  gv: number,
  f: number,
): void {
  const [uAxis, vAxis] = transverseAxes(axis);
  const local = [0, 0, 0];
  local[axis] = fromHigh ? part.box[EXTENT[axis]] - 1 - depth : depth;
  local[uAxis] = gu - part.box[ORIGIN[uAxis]];
  local[vAxis] = gv - part.box[ORIGIN[vAxis]];
  part.addForce(local[0], local[1], local[2], f);
}

/**
 * Accumulate the interface residual into both partitions' forcing fields.
 *
 * Call once per interface per time step, after every partition has stepped and
 * before the next step — the same ordering the reference's `Simulation::main`
 * uses. Forcing accumulates, so several interfaces may touch the same cell (a
 * partition corner) without any of them being lost.
 */
export function applyInterfaceForcing(iface: PartitionInterface, c: number, dx: number): void {
  const { axis, lower, upper, overlap } = iface;
  assertGridMatches(iface, c, dx);
  const scale = (c * c) / (STENCIL_6TH_DIV * dx * dx);

  const lowerSelf = lower.includeSelfTerms;
  const upperSelf = upper.includeSelfTerms;

  // Depth along the interface axis available on each side. A partition thinner
  // than INTERFACE_DEPTH still works; it just contributes fewer taps.
  const lowerDepth = Math.min(INTERFACE_DEPTH, lower.box[EXTENT[axis]]);
  const upperDepth = Math.min(INTERFACE_DEPTH, upper.box[EXTENT[axis]]);

  const lowerFace = new Float64Array(INTERFACE_DEPTH);
  const upperFace = new Float64Array(INTERFACE_DEPTH);

  for (let gv = overlap.vMin; gv < overlap.vMax; gv++) {
    for (let gu = overlap.uMin; gu < overlap.uMax; gu++) {
      // The three cells nearest the face on each side, indexed by depth.
      for (let t = 0; t < INTERFACE_DEPTH; t++) {
        lowerFace[t] = t < lowerDepth ? pressureAtDepth(lower, axis, true, t, gu, gv) : 0;
        upperFace[t] = t < upperDepth ? pressureAtDepth(upper, axis, false, t, gu, gv) : 0;
      }

      // Lower side: `across` is the upper partition, `own` is its own mirror.
      for (let d = 1; d <= lowerDepth; d++) {
        let r = 0;
        for (let t = 0; t + d <= INTERFACE_DEPTH; t++) {
          const coef = STENCIL_6TH[3 + d + t];
          r += coef * (upperFace[t] - (lowerSelf ? lowerFace[t] : 0));
        }
        if (r !== 0) addForceAtDepth(lower, axis, true, d - 1, gu, gv, scale * r);
      }

      // Upper side: mirrored roles.
      for (let d = 1; d <= upperDepth; d++) {
        let r = 0;
        for (let t = 0; t + d <= INTERFACE_DEPTH; t++) {
          const coef = STENCIL_6TH[3 + d + t];
          r += coef * (lowerFace[t] - (upperSelf ? upperFace[t] : 0));
        }
        if (r !== 0) addForceAtDepth(upper, axis, false, d - 1, gu, gv, scale * r);
      }
    }
  }
}

/**
 * The residual amplitude is `c²/(180 dx²)`, but each partition advances with
 * its own `this.c` and `this.dx`. A caller passing different values — or two
 * partitions built on different grids — silently applies the wrong amplitude:
 * the kind of bug that passes a 1D unit test and is wrong in the driver. Fail
 * instead.
 */
function assertGridMatches(iface: PartitionInterface, c: number, dx: number): void {
  for (const [side, part] of [
    ['lower', iface.lower],
    ['upper', iface.upper],
  ] as const) {
    if (part.c !== c) {
      throw new Error(
        `Interface forcing called with c = ${c} but the ${side} partition runs at ${part.c}`,
      );
    }
    if (part.dx !== dx) {
      throw new Error(
        `Interface forcing called with dx = ${dx} but the ${side} partition runs at ${part.dx}`,
      );
    }
  }
  if (iface.lower.dt !== iface.upper.dt) {
    throw new Error(
      `Partitions across an interface must share a time step; got ` +
        `${iface.lower.dt} and ${iface.upper.dt}`,
    );
  }
}

/** Apply every interface's residual. */
export function applyAllInterfaceForcing(
  interfaces: readonly PartitionInterface[],
  c: number,
  dx: number,
): void {
  for (const iface of interfaces) applyInterfaceForcing(iface, c, dx);
}
