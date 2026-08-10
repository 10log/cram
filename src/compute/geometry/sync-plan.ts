/**
 * Reconciliation planning — which faces are new, which persist, which are gone.
 *
 * Kept separate from the adapter (objects/room-from-mesh.ts) because this is
 * the part with actual decisions in it, and it can be tested without dragging
 * in THREE, Surface, or the store.
 *
 * The reason any of this exists: a Surface carries the user's acoustic material
 * assignment. Rebuilding a room from scratch on every edit would silently
 * discard that, so faces are matched to existing Surfaces by their stable id
 * and updated in place instead.
 *
 * Pure module — no THREE, no csg. See room-mesh.ts.
 */

import type { FaceId } from './room-mesh';

export interface FaceSyncPlan {
  /** Faces that already have a Surface: update its geometry, keep its identity. */
  updated: FaceId[];
  /** Faces with no Surface yet: create one. */
  added: FaceId[];
  /** Surfaces whose face no longer exists: dispose them. */
  removed: FaceId[];
}

/**
 * Diff existing face ids against the ids a mesh now has.
 *
 * `updated` and `added` follow the incoming order so downstream Surfaces keep
 * a stable, meaningful ordering; `removed` follows the existing order.
 * Duplicate ids on either side are collapsed.
 */
export function planFaceSync(
  existing: Iterable<FaceId>,
  incoming: Iterable<FaceId>
): FaceSyncPlan {
  // Materialised up front: both arguments are iterated twice, and a one-shot
  // iterator (Map.keys(), a generator) would be spent after the first pass.
  // syncRoomFromMesh passes exactly that, so consuming it lazily here would
  // silently stop reporting removals.
  const existingIds = [...existing];
  const incomingIds = [...incoming];

  const have = new Set(existingIds);
  const want = new Set(incomingIds);

  const updated: FaceId[] = [];
  const added: FaceId[] = [];
  const seen = new Set<FaceId>();

  for (const id of incomingIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    if (have.has(id)) updated.push(id);
    else added.push(id);
  }

  const removed: FaceId[] = [];
  const droppedSeen = new Set<FaceId>();
  for (const id of existingIds) {
    if (droppedSeen.has(id)) continue;
    droppedSeen.add(id);
    if (!want.has(id)) removed.push(id);
  }

  return { updated, added, removed };
}
