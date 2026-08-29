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

export function beamTreeSignature(input: BeamTreeInputs): string {
  return [
    input.sourceId,
    input.roomID,
    String(input.maxOrder),
    String(input.surfaceCount),
    input.sourceX.toFixed(6),
    input.sourceY.toFixed(6),
    input.sourceZ.toFixed(6),
    input.surfaceWorlds.map((n) => n.toFixed(6)).join(","),
  ].join("|");
}
