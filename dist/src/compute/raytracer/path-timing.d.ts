/**
 * Stamp RayPath.time / totalLength when the path is stored, not only in stop() (#131).
 * extraLength is the mesh-hit → receiver-centre remainder (#133).
 */
export declare function stampRayPathTiming<T extends {
    chain: {
        distance: number;
    }[];
    time?: number;
    totalLength?: number;
}>(path: T, speedOfSound: number, extraLength?: number): T;
export declare function resolveReceiverId(receiverIDs: string[], paths: Record<string, {
    length: number;
} | undefined>, receiverId?: string): string;
