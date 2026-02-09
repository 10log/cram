/**
 * Re-exports from shared diffraction module.
 * @deprecated Import from "../../shared/diffraction" directly.
 */

export type { DiffractingEdge, DiffractionPath, EdgeGraph } from "../../shared/diffraction";
export { buildEdgeGraph } from "../../shared/diffraction";
export { fresnelTransition, computeWedgeAngles, utdDiffractionCoefficient } from "../../shared/diffraction";
export { findDiffractionPoint, hasLineOfSight, findDiffractionPaths } from "../../shared/diffraction";
