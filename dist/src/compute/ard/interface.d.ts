import { Axis, INTERFACE_DEPTH, Partition } from './partition';
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
export declare function applyInterfaceForcing(iface: PartitionInterface, c: number, dx: number): void;
/** Apply every interface's residual. */
export declare function applyAllInterfaceForcing(interfaces: readonly PartitionInterface[], c: number, dx: number): void;
