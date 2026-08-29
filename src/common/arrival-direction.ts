/**
 * Looking-back arrival direction at the receiver.
 *
 * Returns a unit vector pointing FROM the receiver TOWARD the last bounce
 * (or the source, for a direct path). Receiver.getGain and ambisonic
 * encodeBufferFromDirection both consume this convention: a cardioid looking
 * +Z peaks when the last bounce is also in +Z.
 *
 * Travel direction (lastBounce → receiver) is the negation of this vector.
 */
export function lookingBackArrivalDirection(
  receiver: { x: number; y: number; z: number },
  lastBounce: { x: number; y: number; z: number },
): [number, number, number] {
  const dx = lastBounce.x - receiver.x;
  const dy = lastBounce.y - receiver.y;
  const dz = lastBounce.z - receiver.z;
  const len = Math.hypot(dx, dy, dz);
  if (len < 1e-10) {
    return [0, 0, 1];
  }
  return [dx / len, dy / len, dz / len];
}
