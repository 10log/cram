import { Float32BufferAttribute, IcosahedronGeometry, Matrix4, Vector3 } from 'three';

const DEFAULT_BRDF_DETAIL = 1;

export class BRDF {
  /** Number of icosahedron subdivisions */
  public detail: number;
  /** Unit direction vectors for each hemisphere bin (in local frame, z-up) */
  public directions: Vector3[];
  /** Number of hemisphere direction bins */
  public nSlots: number;
  /**
   * Reflection coefficient matrix [incomingSlot][outgoingSlot].
   * coefficients[i][j] = fraction of energy arriving in direction i
   * that is reflected into direction j.
   */
  public coefficients: Float32Array[];

  constructor(detail: number = DEFAULT_BRDF_DETAIL) {
    this.detail = detail;

    // Generate hemisphere sample directions from icosahedron
    const geometry = new IcosahedronGeometry(1, this.detail);
    const positions = geometry.getAttribute('position') as Float32BufferAttribute;

    // Collect unique upper-hemisphere points
    const seen = new Set<string>();
    const hemiPoints: Vector3[] = [];
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      if (z >= 0) {
        const v = new Vector3(x, y, z).normalize();
        const key = `${v.x.toFixed(6)},${v.y.toFixed(6)},${v.z.toFixed(6)}`;
        if (!seen.has(key)) {
          seen.add(key);
          hemiPoints.push(v);
        }
      }
    }

    this.directions = hemiPoints;
    this.nSlots = hemiPoints.length;
    this.coefficients = [];
    for (let i = 0; i < this.nSlots; i++) {
      this.coefficients[i] = new Float32Array(this.nSlots);
    }
  }

  /**
   * Compute BRDF coefficients for a given absorption and scattering.
   * Specular component goes into the mirror-reflection bin.
   * Diffuse component is distributed uniformly across all bins.
   */
  computeCoefficients(absorption: number, scattering: number): void {
    const reflectance = 1 - absorption;
    const diffuseWeight = reflectance * scattering / this.nSlots;
    const specularWeight = reflectance * (1 - scattering);

    for (let incoming = 0; incoming < this.nSlots; incoming++) {
      // Mirror reflection direction: reflect incoming across z-axis (normal)
      // If incoming direction is d = (dx, dy, dz), mirror is (-dx, -dy, dz)
      const d = this.directions[incoming];
      const mirror = new Vector3(-d.x, -d.y, d.z).normalize();
      const mirrorSlot = this.findNearestSlot(mirror);

      for (let outgoing = 0; outgoing < this.nSlots; outgoing++) {
        this.coefficients[incoming][outgoing] = diffuseWeight;
      }
      this.coefficients[incoming][mirrorSlot] += specularWeight;
    }
  }

  /**
   * Find the nearest hemisphere bin for a direction in local frame (z-up).
   */
  findNearestSlot(localDir: Vector3): number {
    let bestIdx = 0;
    let bestDot = -Infinity;
    for (let i = 0; i < this.nSlots; i++) {
      const dot = localDir.dot(this.directions[i]);
      if (dot > bestDot) {
        bestDot = dot;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  /**
   * Get the direction slot index for a world-space direction relative to a patch normal.
   * Transforms the direction into the local frame where the patch normal is z-up.
   */
  getDirectionIndex(worldDir: Vector3, patchNormal: Vector3): number {
    const localDir = worldToLocal(worldDir, patchNormal);
    // Clamp to hemisphere (direction should face outward from surface)
    if (localDir.z < 0) localDir.z = 0;
    if (localDir.lengthSq() < 1e-10) return 0;
    localDir.normalize();
    return this.findNearestSlot(localDir);
  }

  /**
   * Get the outgoing reflection coefficients for a given incoming direction slot.
   * Returns array of length nSlots with the weight for each outgoing direction.
   */
  getOutgoingWeights(incomingSlot: number): Float32Array {
    return this.coefficients[incomingSlot];
  }
}

/**
 * Transform a world-space direction into a local frame where `normal` is the z-axis.
 */
function worldToLocal(dir: Vector3, normal: Vector3): Vector3 {
  // Build a rotation matrix that takes normal -> (0,0,1)
  const z = normal.clone().normalize();
  // Choose a tangent not parallel to z
  let tangent = new Vector3(1, 0, 0);
  if (Math.abs(z.dot(tangent)) > 0.9) {
    tangent = new Vector3(0, 1, 0);
  }
  const x = new Vector3().crossVectors(z, tangent).normalize();
  const y = new Vector3().crossVectors(z, x).normalize();

  // Project direction onto local axes
  return new Vector3(dir.dot(x), dir.dot(y), dir.dot(z));
}

export default BRDF;
