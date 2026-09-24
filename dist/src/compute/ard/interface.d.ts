import { Axis, INTERFACE_DEPTH, Partition } from './partition';
export { INTERFACE_DEPTH };
/**
 * The whole room's pressure, by global cell, for taps that reach past the
 * immediate neighbour (#228).
 *
 * A face's residual needs the three cells beyond it. When the neighbour across
 * the face is thinner than that, the far taps are in whatever lies beyond the
 * neighbour — another partition, or a wall — and a pairwise interface cannot
 * see them. Reading them as zero drops the 6th-order stencil's −27 and 2
 * couplings, which leaves a one-cell partition next to another one-cell
 * partition with a row sum of +50 instead of 0: an operator that is no longer
 * negative semidefinite, and a field that grows. A rotated room's staircase is
 * made of exactly such chains.
 */
export interface GlobalField {
    /** Pressure in the air cell at global `(i, j, k)`, or `null` if it is not air in any partition. */
    pressureAt(i: number, j: number, k: number): number | null;
}
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
/**
 * Find the shared face between two partitions, or `null` if they do not touch.
 *
 * Two boxes share a face when they abut on exactly one axis (one's high edge
 * equals the other's low edge) and overlap positively on both others. Boxes that
 * merely touch along an edge or at a corner have zero overlap on a second axis
 * and are not interfaces — there is no area to exchange through.
 */
export declare function findInterface(a: Partition, b: Partition): PartitionInterface | null;
/** Every shared face among a set of partitions, each pair considered once. */
export declare function findInterfaces(partitions: readonly Partition[]): PartitionInterface[];
/**
 * Read a partition's pressure at a point given by its depth from a face and the
 * two transverse global coordinates.
 *
 * `depth` counts inward from the face: 0 is the cell touching it. `fromHigh`
 * selects which face — the partition's high edge on `axis` (it is the `lower`
 * partition) or its low edge (it is the `upper` one).
 */
export declare function pressureAtDepth(part: Partition, axis: Axis, fromHigh: boolean, depth: number, gu: number, gv: number): number;
export declare function addForceAtDepth(part: Partition, axis: Axis, fromHigh: boolean, depth: number, gu: number, gv: number, f: number): void;
/**
 * Accumulate the interface residual into both partitions' forcing fields.
 *
 * Call once per interface per time step, after every partition has stepped and
 * before the next step — the same ordering the reference's `Simulation::main`
 * uses. Forcing accumulates, so several interfaces may touch the same cell (a
 * partition corner) without any of them being lost.
 */
export declare function applyInterfaceForcing(iface: PartitionInterface, c: number, dx: number, field?: GlobalField): void;
/**
 * Pressure `steps` cells from an air cell along one grid line, with rigid walls
 * as mirrors (#228).
 *
 * Walk one cell at a time from `origin` in `direction`. Stepping into a cell
 * that is not air reflects: stay put and reverse. That is the half-cell mirror
 * a DCT partition's Neumann walls assume — the ghost one cell past a wall face
 * is the cell in front of it — applied as often as the line needs, so an air
 * run shorter than the stencil between two walls gets its even extension
 * rather than zeros. Zeros there drop the stencil's −27 and 2 taps and leave a
 * positive row sum, which is how a staircase grows a field with rigid walls.
 *
 * `null` only if `origin` itself is not air.
 */
export declare function reflectedAlongLine(field: GlobalField, axis: Axis, origin: readonly [number, number, number], direction: 1 | -1, steps: number): number | null;
/** Apply every interface's residual. */
export declare function applyAllInterfaceForcing(interfaces: readonly PartitionInterface[], c: number, dx: number, field?: GlobalField): void;
