/**
 * Types for UTD edge diffraction computation.
 */

/** A convex edge between two surfaces that can diffract sound */
export interface DiffractingEdge {
  /** Edge start point in world space */
  start: [number, number, number];
  /** Edge end point in world space */
  end: [number, number, number];
  /** Unit vector along the edge direction */
  direction: [number, number, number];
  /** Length of the edge */
  length: number;
  /** Outward-facing normal of first surface */
  normal0: [number, number, number];
  /** Outward-facing normal of second surface */
  normal1: [number, number, number];
  /** UUID of first surface */
  surface0Id: string;
  /** UUID of second surface */
  surface1Id: string;
  /** Exterior wedge angle in radians (> pi for convex edges) */
  wedgeAngle: number;
  /** Wedge index: wedgeAngle / pi */
  n: number;
}

/** A diffraction path from source through an edge to a receiver */
export interface DiffractionPath {
  /** The diffracting edge */
  edge: DiffractingEdge;
  /** Point on edge where diffraction occurs */
  diffractionPoint: [number, number, number];
  /** Total path distance: source→edge + edge→receiver */
  totalDistance: number;
  /** Travel time in seconds */
  time: number;
  /** Per-frequency-band energy at receiver */
  bandEnergy: number[];
  /** Source UUID */
  sourceId: string;
  /** Receiver UUID */
  receiverId: string;
}

/** Collection of diffracting edges in the scene */
export interface EdgeGraph {
  edges: DiffractingEdge[];
}
