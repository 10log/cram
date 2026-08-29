/**
 * Inputs the beam tree is a function of (issue #104).
 * Listener position is intentionally absent — moving only the receiver
 * should reuse the tree.
 */
export type BeamTreeInputs = {
    sourceId: string;
    sourceX: number;
    sourceY: number;
    sourceZ: number;
    roomID: string;
    maxOrder: number;
    surfaceCount: number;
    /** Concatenated matrixWorld.elements for each surface, in stable order. */
    surfaceWorlds: number[];
};
export declare function beamTreeSignature(input: BeamTreeInputs): string;
