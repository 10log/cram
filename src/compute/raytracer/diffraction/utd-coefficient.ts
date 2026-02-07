/**
 * Uniform Theory of Diffraction (UTD) coefficient computation.
 *
 * Implements the Kouyoumjian-Pathak formulation for wedge diffraction
 * with Fresnel transition function approximation.
 */

const { PI, sqrt, abs, cos, sin, atan2 } = Math;

/**
 * Approximate magnitude of the Fresnel transition function |F(X)|.
 *
 * Uses a smooth approximation: F(X) ≈ 1 - exp(-sqrt(π X))
 * which satisfies F(0) = 0, F(∞) → 1, and is monotonically increasing.
 *
 * @param x - Fresnel integral argument (must be >= 0)
 * @returns Magnitude |F(X)| in [0, 1]
 */
export function fresnelTransition(x: number): number {
  if (x < 0) x = 0;
  // Smooth saturating approximation: no discontinuity
  return 1 - Math.exp(-sqrt(PI * x));
}

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
export function computeWedgeAngles(
  edgeDirection: [number, number, number],
  normal0: [number, number, number],
  diffractionPoint: [number, number, number],
  sourcePos: [number, number, number],
  receiverPos: [number, number, number],
): { phiSource: number; phiReceiver: number } {
  // Project source and receiver into plane perpendicular to edge
  const ed = edgeDirection;

  // Vector from diffraction point to source
  const ds = [
    sourcePos[0] - diffractionPoint[0],
    sourcePos[1] - diffractionPoint[1],
    sourcePos[2] - diffractionPoint[2],
  ];
  // Remove component along edge
  const dsDotEd = ds[0] * ed[0] + ds[1] * ed[1] + ds[2] * ed[2];
  const dsPerp = [ds[0] - dsDotEd * ed[0], ds[1] - dsDotEd * ed[1], ds[2] - dsDotEd * ed[2]];
  const dsPerpLen = sqrt(dsPerp[0] ** 2 + dsPerp[1] ** 2 + dsPerp[2] ** 2);

  // Vector from diffraction point to receiver
  const dr = [
    receiverPos[0] - diffractionPoint[0],
    receiverPos[1] - diffractionPoint[1],
    receiverPos[2] - diffractionPoint[2],
  ];
  const drDotEd = dr[0] * ed[0] + dr[1] * ed[1] + dr[2] * ed[2];
  const drPerp = [dr[0] - drDotEd * ed[0], dr[1] - drDotEd * ed[1], dr[2] - drDotEd * ed[2]];
  const drPerpLen = sqrt(drPerp[0] ** 2 + drPerp[1] ** 2 + drPerp[2] ** 2);

  if (dsPerpLen < 1e-10 || drPerpLen < 1e-10) {
    // Source or receiver is on the edge line - degenerate case
    return { phiSource: PI, phiReceiver: PI };
  }

  // Normalize
  const dsNorm = [dsPerp[0] / dsPerpLen, dsPerp[1] / dsPerpLen, dsPerp[2] / dsPerpLen];
  const drNorm = [drPerp[0] / drPerpLen, drPerp[1] / drPerpLen, drPerp[2] / drPerpLen];

  // Build local 2D coordinate system in the wedge plane:
  // x-axis = -normal0 (pointing into wedge from face 0)
  // y-axis = edge × (-normal0), giving a right-hand system
  const xAxis = [-normal0[0], -normal0[1], -normal0[2]];
  const yAxis = [
    ed[1] * xAxis[2] - ed[2] * xAxis[1],
    ed[2] * xAxis[0] - ed[0] * xAxis[2],
    ed[0] * xAxis[1] - ed[1] * xAxis[0],
  ];

  // Measure angles from face 0 (phi=0)
  const phiSource = atan2(
    dsNorm[0] * yAxis[0] + dsNorm[1] * yAxis[1] + dsNorm[2] * yAxis[2],
    dsNorm[0] * xAxis[0] + dsNorm[1] * xAxis[1] + dsNorm[2] * xAxis[2],
  );
  const phiReceiver = atan2(
    drNorm[0] * yAxis[0] + drNorm[1] * yAxis[1] + drNorm[2] * yAxis[2],
    drNorm[0] * xAxis[0] + drNorm[1] * xAxis[1] + drNorm[2] * xAxis[2],
  );

  // Normalize to [0, 2*PI*n] range, but typically [0, wedgeAngle]
  const normAngle = (a: number) => {
    let r = a;
    while (r < 0) r += 2 * PI;
    return r;
  };

  return {
    phiSource: normAngle(phiSource),
    phiReceiver: normAngle(phiReceiver),
  };
}

/**
 * Cotangent helper for the diffraction coefficient sum terms.
 *
 * cot((pi ± beta) / (2n))
 *
 * where beta = phiReceiver ± phiSource
 */
function cotTerm(n: number, sign1: number, phiR: number, sign2: number, phiS: number): number {
  const beta = phiR + sign2 * phiS;
  const arg = (PI + sign1 * beta) / (2 * n);
  const sinArg = sin(arg);
  if (abs(sinArg) < 1e-12) return 0; // avoid division by zero at shadow/reflection boundaries
  return cos(arg) / sinArg;
}

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
export function utdDiffractionCoefficient(
  frequency: number,
  n: number,
  sourceDistance: number,
  receiverDistance: number,
  phiSource: number,
  phiReceiver: number,
  soundSpeed: number,
): number {
  if (sourceDistance < 1e-10 || receiverDistance < 1e-10) return 0;

  const k = 2 * PI * frequency / soundSpeed; // wave number
  if (k < 1e-10) return 0;

  // Distance parameter for Fresnel transition
  const L = sourceDistance * receiverDistance / (sourceDistance + receiverDistance);

  // Four diffraction terms (Kouyoumjian-Pathak)
  // D = -exp(-j*pi/4) / (2*n*sqrt(2*pi*k)) * sum of 4 terms
  // Each term: cot(...) * F(kLa±(...))

  // a± functions for the Fresnel argument
  const aFunc = (betaSign: number, phiR: number, phiSSign: number, phiS: number): number => {
    const beta = phiR + phiSSign * phiS;
    // a±(beta) = 2 cos²((2nπN± - beta) / 2)
    // where N± is the integer that most nearly satisfies 2πnN± - beta = ±π
    const arg = beta;
    // Find N that minimizes |2*pi*n*N - arg ∓ pi|
    const Nplus = Math.round((arg + PI) / (2 * PI * n));
    const Nminus = Math.round((arg - PI) / (2 * PI * n));

    const aPlus = 2 * cos((2 * PI * n * Nplus - arg) / 2) ** 2;
    const aMinus = 2 * cos((2 * PI * n * Nminus - arg) / 2) ** 2;

    return betaSign > 0 ? aPlus : aMinus;
  };

  // Sum the four terms: |D|²
  let Dsq = 0;

  // Term 1: cot((pi + (phiR - phiS)) / (2n)) * F(kL a+(phiR - phiS))
  const a1 = aFunc(1, phiReceiver, -1, phiSource);
  const cot1 = cotTerm(n, 1, phiReceiver, -1, phiSource);
  const F1 = fresnelTransition(k * L * a1);

  // Term 2: cot((pi - (phiR - phiS)) / (2n)) * F(kL a-(phiR - phiS))
  const a2 = aFunc(-1, phiReceiver, -1, phiSource);
  const cot2 = cotTerm(n, -1, phiReceiver, -1, phiSource);
  const F2 = fresnelTransition(k * L * a2);

  // Term 3: cot((pi + (phiR + phiS)) / (2n)) * F(kL a+(phiR + phiS))
  const a3 = aFunc(1, phiReceiver, 1, phiSource);
  const cot3 = cotTerm(n, 1, phiReceiver, 1, phiSource);
  const F3 = fresnelTransition(k * L * a3);

  // Term 4: cot((pi - (phiR + phiS)) / (2n)) * F(kL a-(phiR + phiS))
  const a4 = aFunc(-1, phiReceiver, 1, phiSource);
  const cot4 = cotTerm(n, -1, phiReceiver, 1, phiSource);
  const F4 = fresnelTransition(k * L * a4);

  // |D|² ∝ (1/(2n))² * (sum of |cot * F|)² / (2*pi*k)
  const prefactor = 1 / (2 * n * sqrt(2 * PI * k));
  const sumTerms = cot1 * F1 + cot2 * F2 + cot3 * F3 + cot4 * F4;
  Dsq = prefactor * prefactor * sumTerms * sumTerms;

  // Spreading factor A² = rho / (s * (s + rho))
  // where rho = s' for cylindrical spreading from edge
  const rho = sourceDistance;
  const A2 = rho / (receiverDistance * (receiverDistance + rho));

  return Dsq * A2;
}
