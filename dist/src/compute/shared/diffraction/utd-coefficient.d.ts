/**
 * Uniform Theory of Diffraction (UTD) coefficient computation.
 *
 * Implements the Kouyoumjian-Pathak formulation for wedge diffraction
 * with Fresnel transition function approximation.
 */
/**
 * Approximate magnitude of the Fresnel transition function |F(X)|.
 *
 * Uses a smooth approximation: F(X) ≈ 1 - exp(-sqrt(π X))
 * which satisfies F(0) = 0, F(∞) → 1, and is monotonically increasing.
 *
 * @param x - Fresnel integral argument (must be >= 0)
 * @returns Magnitude |F(X)| in [0, 1]
 */
export declare function fresnelTransition(x: number): number;
/**
 * Compute the wedge-local angles for source and receiver.
 *
 * Projects source/receiver positions into the plane perpendicular to the edge
 * and measures angles relative to the wedge faces.
 *
 * @param edgeStart - Edge start point
 * @param edgeEnd - Edge end point
 * @param edgeDirection - Unit vector along edge
 * @param normal0 - Normal of face 0 (the 0-face of the wedge)
 * @param normal1 - Normal of face 1 (the n-face of the wedge)
 * @param diffractionPoint - Point on edge where diffraction occurs
 * @param sourcePos - Source position
 * @param receiverPos - Receiver position
 * @returns phiSource and phiReceiver angles in radians
 */
export declare function computeWedgeAngles(edgeDirection: [number, number, number], normal0: [number, number, number], diffractionPoint: [number, number, number], sourcePos: [number, number, number], receiverPos: [number, number, number]): {
    phiSource: number;
    phiReceiver: number;
};
/**
 * Compute the UTD diffraction coefficient |D|² (energy domain).
 *
 * Uses the Kouyoumjian-Pathak 4-term formulation with Fresnel transition
 * functions and includes the spreading factor A².
 *
 * @param frequency - Frequency in Hz
 * @param n - Wedge index (wedgeAngle / pi), n > 1 for convex edges
 * @param sourceDistance - Distance from source to diffraction point (s')
 * @param receiverDistance - Distance from diffraction point to receiver (s)
 * @param phiSource - Source angle in wedge coordinates
 * @param phiReceiver - Receiver angle in wedge coordinates
 * @param soundSpeed - Speed of sound in m/s
 * @returns |D|² × A² — diffraction energy transfer factor
 */
export declare function utdDiffractionCoefficient(frequency: number, n: number, sourceDistance: number, receiverDistance: number, phiSource: number, phiReceiver: number, soundSpeed: number): number;
