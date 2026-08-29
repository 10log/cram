/**
 * Room / surface assignment for image source (#123).
 * Empty roomID falls back to the first room; surfaceIDs filter reflectors
 * when non-empty. Occlusion still uses the full room surface list.
 */
export function resolveRoomID(requested: string | undefined | null, roomUuids: string[]): string {
  if (requested) return requested;
  return roomUuids[0] ?? "";
}

export function selectedReflectors<T extends { uuid: string }>(all: T[], surfaceIDs: string[]): T[] {
  if (!surfaceIDs.length) return all;
  const allow = new Set(surfaceIDs);
  return all.filter((s) => allow.has(s.uuid));
}

/**
 * `null` means the tree has never run — Calculate should build it once.
 * `[]` means it ran and nothing was valid — do not re-enter (#125).
 */
export function shouldRebuildImageSourceTree(validRayPaths: unknown[] | null): boolean {
  return validRayPaths === null;
}
