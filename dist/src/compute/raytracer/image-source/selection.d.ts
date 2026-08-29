/**
 * Room / surface assignment for image source (#123).
 * Empty roomID falls back to the first room; surfaceIDs filter reflectors
 * when non-empty. Occlusion still uses the full room surface list.
 */
export declare function resolveRoomID(requested: string | undefined | null, roomUuids: string[]): string;
export declare function selectedReflectors<T extends {
    uuid: string;
}>(all: T[], surfaceIDs: string[]): T[];
