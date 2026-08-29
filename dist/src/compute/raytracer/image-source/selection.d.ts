/**
 * Room / surface assignment for image source (#123).
 * Empty roomID falls back to the first room; surfaceIDs filter reflectors
 * when non-empty. Occlusion still uses the full room surface list.
 */
export declare function resolveRoomID(requested: string | undefined | null, roomUuids: string[]): string;
export declare function selectedReflectors<T extends {
    uuid: string;
}>(all: T[], surfaceIDs: string[]): T[];
/**
 * `null` means the tree has never run — Calculate should build it once.
 * `[]` means it ran and nothing was valid — do not re-enter (#125).
 */
export declare function shouldRebuildImageSourceTree(validRayPaths: unknown[] | null): boolean;
