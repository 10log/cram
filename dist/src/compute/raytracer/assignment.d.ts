/**
 * Assigned source/receiver/room IDs are the matrix, not a live scan (#135).
 */
export declare function keepAssignedIds(assigned: string[], existing: string[]): string[];
export declare function idsOfKind(containers: Record<string, {
    kind?: string;
}>, kind: string): string[];
