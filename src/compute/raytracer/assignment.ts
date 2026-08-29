/**
 * Assigned source/receiver/room IDs are the matrix, not a live scan (#135).
 */
export function keepAssignedIds(assigned: string[], existing: string[]): string[] {
  const have = new Set(existing);
  return assigned.filter((id) => have.has(id));
}

export function idsOfKind(
  containers: Record<string, { kind?: string }>,
  kind: string,
): string[] {
  return Object.keys(containers).filter((id) => containers[id]?.kind === kind);
}
