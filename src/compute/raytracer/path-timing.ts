/**
 * Stamp RayPath.time / totalLength when the path is stored, not only in stop() (#131).
 * extraLength is the mesh-hit → receiver-centre remainder (#133).
 */

export function stampRayPathTiming<T extends { chain: { distance: number }[]; time?: number; totalLength?: number }>(
  path: T,
  speedOfSound: number,
  extraLength: number = 0,
): T {
  let totalLength = 0;
  let time = 0;
  const c = speedOfSound > 0 ? speedOfSound : 343;
  for (const step of path.chain) {
    totalLength += step.distance;
    time += step.distance / c;
  }
  totalLength += extraLength;
  time += extraLength / c;
  path.totalLength = totalLength;
  path.time = time;
  return path;
}

export function resolveReceiverId(
  receiverIDs: string[],
  paths: Record<string, { length: number } | undefined>,
  receiverId?: string,
): string {
  const id = receiverId ?? receiverIDs[0];
  if (!id) throw Error("No receivers have been assigned to the raytracer");
  if (!paths[id] || paths[id]!.length === 0) throw Error("No rays have been traced yet");
  return id;
}
