/**
 * Edge diffraction via Uniform Theory of Diffraction (UTD).
 *
 * Barrel exports for the diffraction module.
 */

export type { DiffractingEdge, DiffractionPath, EdgeGraph } from "./types";
export { buildEdgeGraph } from "./edge-graph";
export { fresnelTransition, computeWedgeAngles, utdDiffractionCoefficient } from "./utd-coefficient";
export { findDiffractionPoint, hasLineOfSight, findDiffractionPaths } from "./find-diffraction-paths";
