import { Vector3 } from 'three';
export declare class BRDF {
    /** Number of icosahedron subdivisions */
    detail: number;
    /** Unit direction vectors for each hemisphere bin (in local frame, z-up) */
    directions: Vector3[];
    /** Number of hemisphere direction bins */
    nSlots: number;
    /**
     * Reflection coefficient matrix [incomingSlot][outgoingSlot].
     * coefficients[i][j] = fraction of energy arriving in direction i
     * that is reflected into direction j.
     */
    coefficients: Float32Array[];
    constructor(detail?: number);
    /**
     * Compute BRDF coefficients for a given absorption and scattering.
     * Specular component goes into the mirror-reflection bin.
     * Diffuse component is distributed uniformly across all bins.
     */
    computeCoefficients(absorption: number, scattering: number): void;
    /**
     * Find the nearest hemisphere bin for a direction in local frame (z-up).
     */
    findNearestSlot(localDir: Vector3): number;
    /**
     * Get the direction slot index for a world-space direction relative to a patch normal.
     * Transforms the direction into the local frame where the patch normal is z-up.
     */
    getDirectionIndex(worldDir: Vector3, patchNormal: Vector3): number;
    /**
     * Get the outgoing reflection coefficients for a given incoming direction slot.
     * Returns array of length nSlots with the weight for each outgoing direction.
     */
    getOutgoingWeights(incomingSlot: number): Float32Array;
}
export default BRDF;
