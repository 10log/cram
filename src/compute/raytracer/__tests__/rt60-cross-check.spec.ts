/**
 * Does the ray tracer decay at the rate statistical room acoustics says it
 * should? (Issue #201.)
 *
 * Every other spec in this directory tests a mechanism or reads the source text
 * — deliberately, per `traceray-band-energy.spec.ts`: "without needing to
 * instantiate the full Three.js/WebGL environment". None of them can tell you
 * whether the solver's reverberation time is right, and that gap is not
 * hypothetical: ARD's PML wall path shipped a T60 4.7x too long for eight PRs
 * because every test it had compared the slab against itself.
 *
 * This one runs the real `traceRay` — real three.js raycasting, real reflection
 * coefficients, real scattering and recursion — and checks the answer against a
 * formula that knows nothing about any of it.
 *
 * ## Why the oracle is a bracket, and a different bracket from ARD's
 *
 * Sabine and Eyring take a **random-incidence** absorption coefficient. The
 * material database stores a **normal-incidence** one, which is what
 * `reflectionCoefficient(α, θ)` is handed. For a locally-reacting surface those
 * differ a great deal — Paris's formula integrates the reflection coefficient
 * over a diffuse hemisphere:
 *
 * ```
 * α_stat = (8/ξ)·[1 − (1/ξ)·ln(1+ξ) + 1/(1+ξ)]
 * ```
 *
 * At α_normal = 0.2 that is 0.396, nearly double. So the two ends are:
 *
 *  - **Upper**: Eyring at α_normal, i.e. as if every reflection were
 *    normal-incidence. The decay must be faster than this, because a
 *    locally-reacting surface absorbs more off-normal.
 *  - **Lower**: Eyring at α_stat, the fully diffuse limit.
 *
 * A *geometrical* solver samples angles and reflects many times, so it should
 * approach the diffuse limit and land in the **lower** half of the bracket —
 * which is asserted, and is the one thing here that distinguishes this solver's
 * expected answer from `ard/__tests__/rt60-cross-check.spec.ts`. The wave solver
 * sits higher in the same bracket because a small room below its Schroeder
 * frequency is modal, not diffuse.
 *
 * Measured T30 over four repeats: 0.214-0.229 s against a bracket of
 * [0.162, 0.367]. Spread 0.015, so both bounds sit at several times the Monte
 * Carlo scatter.
 */

import * as THREE from "three";

import {
  impedanceForAbsorption,
  reflectionCoefficient,
} from "../../acoustics/reflection-coefficient";
import { traceRay } from "../ray-core";
import { worldHitNormal } from "../world-normal";

const C = 343;
const ROOM = { lx: 4, ly: 3, lz: 2.5 } as const;
const VOLUME = ROOM.lx * ROOM.ly * ROOM.lz;
const SURFACE =
  2 * (ROOM.lx * ROOM.ly + ROOM.lx * ROOM.lz + ROOM.ly * ROOM.lz);

/** Paris's random-incidence absorption for a real impedance. */
function randomIncidenceAbsorption(xi: number): number {
  return (8 / xi) * (1 - (1 / xi) * Math.log(1 + xi) + 1 / (1 + xi));
}

/** Eyring reverberation time. Sabine's, with the correct log. */
function eyring(volume: number, surface: number, alpha: number): number {
  return (0.161 * volume) / (-surface * Math.log(1 - alpha));
}

/** The two ends of what statistical acoustics can assert about this room. */
function bracket(alpha: number) {
  const xi = impedanceForAbsorption(alpha);
  return {
    lower: eyring(VOLUME, SURFACE, randomIncidenceAbsorption(xi)),
    upper: eyring(VOLUME, SURFACE, alpha),
  };
}

/**
 * One wall, wound so its geometric normal faces the room.
 *
 * Built from raw triangles in world coordinates rather than from a rotated
 * `PlaneGeometry`. The original fixture used rotated planes and leaked: 104 of
 * 200 first-hit reflections pointed out of the room, the offset origin landed
 * on the far side, and the ray tunnelled out.
 *
 * That was written up as `worldHitNormal` not orienting its normal against the
 * ray. #213 measured it and the diagnosis was wrong: three.js already flips
 * `intersection.normal`, and these walls have vertex normals, so orientation
 * was never the problem here. The cause was that `worldHitNormal` returned
 * that normal in **object-local** space — on a plane rotated 90° a head-on hit
 * read as 90° grazing, and the reflection was mirrored about a normal pointing
 * anywhere at all. Identity transforms are what this fixture actually relies
 * on, and `transformed` below is the arm that tests the fix.
 *
 * The winding is still asserted, because it is a real invariant of the
 * geometry and the `geometric` variant of the normal is read against it.
 *
 * The surface is duck-typed rather than a real `Surface`: that class pulls in
 * the messenger, the container store and `compute/csg`, whose modeling bundle
 * top-level-awaits a browser URL that jsdom cannot resolve. `traceRay` only
 * needs `reflectionFunction`, `scatteringFunction` and a `uuid`.
 */
function wall(
  corners: readonly [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3],
  centre: THREE.Vector3,
  alpha: number,
  scattering: number,
  winding: Winding = "inward",
  transformed = false,
): THREE.Object3D {
  let [a, b, c, d] = corners;
  const normalOf = (p: THREE.Vector3, q: THREE.Vector3, r: THREE.Vector3) =>
    new THREE.Vector3()
      .subVectors(q, p)
      .cross(new THREE.Vector3().subVectors(r, p))
      .normalize();

  if (normalOf(a, b, c).dot(new THREE.Vector3().subVectors(centre, a)) < 0) {
    [a, b, c, d] = [d, c, b, a];
  }
  const inward = normalOf(a, b, c).dot(new THREE.Vector3().subVectors(centre, a));
  if (!(inward > 0)) throw new Error("fixture wall could not be wound inward");
  if (winding === "outward") [a, b, c, d] = [d, c, b, a];

  // With `transformed`, the same wall is stored in a rotated and translated
  // frame and put back by the mesh's matrix: identical geometry in world
  // space, reached through a non-identity `matrixWorld`. That is the only
  // difference between the two arms of the transform test.
  const frame = transformed ? wallFrame() : null;
  const toLocal = frame ? frame.clone().invert() : null;
  const corner = (p: THREE.Vector3) =>
    toLocal ? p.clone().applyMatrix4(toLocal) : p;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [a, b, c, a, c, d].map(corner).flatMap((p) => [p.x, p.y, p.z]),
      3,
    ),
  );
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(
    geometry,
    // `Surface`'s own material is DoubleSide, so a wall wound away from the
    // room is hit rather than culled — which is the only reason the winding
    // comparison below tests anything. FrontSide for the default arm keeps
    // the bracket tests reading a wall the way they always did.
    new THREE.MeshBasicMaterial({
      side: winding === "inward" ? THREE.FrontSide : THREE.DoubleSide,
    }),
  );
  if (frame) {
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(frame);
  }
  const group = new THREE.Group() as THREE.Group & Record<string, unknown>;
  group.add(mesh);
  group.reflectionFunction = (_f: number, theta: number) =>
    reflectionCoefficient(alpha, theta);
  group.scatteringFunction = () => scattering;
  group.numHits = 0;
  group.updateMatrixWorld(true);
  return group;
}

type Winding = "inward" | "outward" | "inward-double";

/**
 * A fixed, arbitrary non-identity transform, so a wall's geometry is stored in
 * its own frame rather than in world coordinates. Chosen once and shared, so
 * the two arms of the transform comparison differ in nothing else.
 */
function wallFrame(): THREE.Matrix4 {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(-3.1, 7.4, 2.6),
    new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0.3, -0.8, 0.5).normalize(),
      1.1,
    ),
    new THREE.Vector3(1, 1, 1),
  );
}

function buildRoom(
  alpha: number,
  scattering: number,
  receiverRadius = 0.25,
  winding: Winding = "inward",
  transformed = false,
) {
  const { lx, ly, lz } = ROOM;
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const centre = V(lx / 2, ly / 2, lz / 2);
  const objects: THREE.Object3D[] = [
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, 0, lz), V(0, 0, lz)], centre, alpha, scattering, winding, transformed),
    wall([V(0, ly, 0), V(lx, ly, 0), V(lx, ly, lz), V(0, ly, lz)], centre, alpha, scattering, winding, transformed),
    wall([V(0, 0, 0), V(0, ly, 0), V(0, ly, lz), V(0, 0, lz)], centre, alpha, scattering, winding, transformed),
    wall([V(lx, 0, 0), V(lx, ly, 0), V(lx, ly, lz), V(lx, 0, lz)], centre, alpha, scattering, winding, transformed),
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, ly, 0), V(0, ly, 0)], centre, alpha, scattering, winding, transformed),
    wall([V(0, 0, lz), V(lx, 0, lz), V(lx, ly, lz), V(0, ly, lz)], centre, alpha, scattering, winding, transformed),
  ];

  const receiver = new THREE.Mesh(
    new THREE.SphereGeometry(receiverRadius, 16, 12),
    new THREE.MeshBasicMaterial(),
  );
  receiver.userData.kind = "receiver";
  const receiverGroup = new THREE.Group();
  receiverGroup.add(receiver);
  receiverGroup.position.set(lx * 0.7, ly * 0.45, lz * 0.62);
  receiverGroup.updateMatrixWorld(true);
  objects.push(receiverGroup);

  return objects;
}

/** Uniform on the sphere. */
function randomDirection(): THREE.Vector3 {
  const z = Math.random() * 2 - 1;
  const phi = Math.random() * 2 * Math.PI;
  const r = Math.sqrt(1 - z * z);
  return new THREE.Vector3(r * Math.cos(phi), r * Math.sin(phi), z);
}

const SAMPLE_RATE = 1000;

/** Shoot rays and bin the energy that reaches the receiver by arrival time. */
function shoot(
  alpha: number,
  scattering: number,
  rays: number,
  order = 400,
  winding: Winding = "inward",
  transformed = false,
) {
  const objects = buildRoom(alpha, scattering, 0.25, winding, transformed);
  const raycaster = new THREE.Raycaster();
  const source = new THREE.Vector3(ROOM.lx * 0.28, ROOM.ly * 0.55, ROOM.lz * 0.34);
  const bins = new Float64Array(4000);
  let arrivals = 0;
  let escaped = 0;

  for (let i = 0; i < rays; i++) {
    const path = traceRay(
      raycaster,
      objects,
      [1000],
      [0], // no air absorption, so Eyring's α is the only loss
      1e-12,
      source.clone(),
      randomDirection(),
      order,
      [1],
      "source",
      0,
      0,
    );
    // `traceRay` returns the recursive call directly, so a ray that finds
    // nothing at any depth collapses the whole path to `undefined`.
    if (!path) {
      escaped++;
      continue;
    }
    if (!path.intersectedReceiver) continue;
    const distance = (path.chain as { distance?: number }[]).reduce(
      (total, hop) => total + (hop.distance ?? 0),
      0,
    );
    const bin = Math.round((distance / C) * SAMPLE_RATE);
    if (bin < bins.length) {
      bins[bin] += path.bandEnergy![0];
      arrivals++;
    }
  }
  return { bins, arrivals, escaped };
}

/** Decay time from the Schroeder curve of an energy histogram. */
function decayTime(bins: Float64Array, fromDb: number, toDb: number): number {
  const edc = new Float64Array(bins.length);
  let acc = 0;
  for (let i = bins.length - 1; i >= 0; i--) {
    acc += bins[i];
    edc[i] = acc;
  }
  const peak = edc[0];
  if (!(peak > 0)) return NaN;
  const db = (i: number) => 10 * Math.log10(edc[i] / peak);

  let from = -1;
  let to = -1;
  for (let i = 0; i < bins.length; i++) {
    if (from < 0 && db(i) <= fromDb) from = i;
    if (db(i) <= toDb) {
      to = i;
      break;
    }
  }
  if (from < 0 || to < 0 || to <= from) return NaN;
  return -60 / ((db(to) - db(from)) / ((to - from) / SAMPLE_RATE));
}

describe("Issue #201: ray tracer decay against statistical room acoustics", () => {
  const ALPHA = 0.2;
  const SCATTERING = 1;

  let result: ReturnType<typeof shoot>;

  beforeAll(() => {
    result = shoot(ALPHA, SCATTERING, 6000);
  }, 120_000);

  test("the fixture is sealed and the rays are counted", () => {
    // If rays leak out of the model the decay is measuring attrition rather than
    // absorption, and because `traceRay` collapses an escaped path to
    // `undefined` the loss is silent. Flush planes leaked 79% this way.
    expect(result.escaped / 6000).toBeLessThan(0.02);
    expect(result.arrivals).toBeGreaterThan(2000);
  });

  test("every wall reflects back into the room", () => {
    // The fixture invariant the winding check in `wall()` exists to hold:
    // every wall is wound so its *geometric* normal faces the room. Read with
    // `worldHitNormal` and no ray direction, which is the one call in the
    // repository that wants the unflipped normal — passing `rd` would make
    // this pass for any winding at all, which is the point of #213 and would
    // be the point of nothing here.
    const objects = buildRoom(ALPHA, SCATTERING);
    const raycaster = new THREE.Raycaster();
    const source = new THREE.Vector3(ROOM.lx * 0.28, ROOM.ly * 0.55, ROOM.lz * 0.34);
    const target = new THREE.Vector3();
    let checked = 0;

    for (let i = 0; i < 200; i++) {
      const direction = randomDirection();
      raycaster.set(source, direction.clone());
      const hits = raycaster.intersectObjects(objects, true);
      if (!hits.length) continue;
      const normal = worldHitNormal(hits[0] as never, target); // no `rd`: geometric
      expect(normal).not.toBeNull();
      // Incoming ray must meet the face from the front.
      expect(direction.dot(normal!)).toBeLessThan(0);
      checked++;
    }
    expect(checked).toBeGreaterThan(150);
  }, 60_000);

  test("T20 and T30 land inside the statistical bracket", () => {
    const { lower, upper } = bracket(ALPHA);
    // Sanity on the oracle itself, so a broken formula cannot widen the bracket
    // into something nothing could fail.
    expect(lower).toBeCloseTo(0.162, 3);
    expect(upper).toBeCloseTo(0.367, 3);
    expect(upper / lower).toBeLessThan(3);

    const t20 = decayTime(result.bins, -5, -25);
    const t30 = decayTime(result.bins, -5, -35);
    for (const t of [t20, t30]) {
      expect(Number.isFinite(t)).toBe(true);
      expect(t).toBeGreaterThan(lower);
      expect(t).toBeLessThan(upper);
    }

    // T20 and T30 measure the same slope over different spans, so they agree on
    // an exponential decay and diverge on a truncated one.
    expect(t30 / t20).toBeGreaterThan(0.85);
    expect(t30 / t20).toBeLessThan(1.15);
  });

  test("#213: a room reached through a non-identity transform decays the same", () => {
    // The defect, at room scale. Both arms are the same room in world space;
    // one stores its walls in world coordinates and the other in a rotated,
    // translated frame put back by the mesh matrix. `worldHitNormal` returned
    // the object-local normal, so the second arm measured incidence against a
    // normal pointing somewhere else entirely — a head-on hit reading as 90°
    // grazing — and mirrored the bounce about it, which is how the original
    // #201 fixture leaked 79% of its rays through rotated planes.
    //
    // `Surface` carries its own position, rotation and scale, restored from
    // the save file and settable from the transform controls, and a `Room`
    // does too, so this is the ordinary case rather than a contrived one.
    const rays = 3000;
    const plain = shoot(ALPHA, SCATTERING, rays, 400, "inward", false);
    const framed = shoot(ALPHA, SCATTERING, rays, 400, "inward", true);

    for (const [label, run] of [["plain", plain], ["framed", framed]] as const) {
      expect([label, run.escaped / rays < 0.02]).toEqual([label, true]);
      expect([label, run.arrivals > 500]).toEqual([label, true]);
    }

    const a = decayTime(plain.bins, -5, -35);
    const b = decayTime(framed.bins, -5, -35);
    expect(Number.isFinite(a)).toBe(true);
    expect(Number.isFinite(b)).toBe(true);
    // Monte Carlo scatter at 3000 rays is ~0.015 s against a T30 near 0.22 s,
    // so 20% is several times the noise and nowhere near what the bug did.
    expect([a, b, Math.abs(a - b) / a < 0.2]).toEqual([a, b, true]);
  }, 180_000);

  test("#213: and the same room wound the wrong way decays the same too", () => {
    // Winding is the half of #213 that three.js already handles for geometry
    // with vertex normals — it flips `intersection.normal` itself — so this
    // arm passes without the flip in `worldHitNormal` and is not what kills
    // that mutant. It is here because `Surface` is DoubleSide, so an
    // outward-wound wall is hit rather than culled, and the property is worth
    // holding whether three keeps doing it or the flip starts carrying it.
    const rays = 3000;
    const inward = shoot(ALPHA, SCATTERING, rays, 400, "inward-double");
    const outward = shoot(ALPHA, SCATTERING, rays, 400, "outward");

    for (const [label, run] of [["inward", inward], ["outward", outward]] as const) {
      expect([label, run.escaped / rays < 0.02]).toEqual([label, true]);
      expect([label, run.arrivals > 500]).toEqual([label, true]);
    }

    const a = decayTime(inward.bins, -5, -35);
    const b = decayTime(outward.bins, -5, -35);
    expect([a, b, Math.abs(a - b) / a < 0.2]).toEqual([a, b, true]);
  }, 180_000);

  test("it sits in the diffuse half of the bracket, as a geometrical solver should", () => {
    // The assertion that separates this solver's expected answer from the wave
    // solver's. Sampling angles over many reflections drives the effective
    // absorption toward the random-incidence average, so the decay belongs near
    // the lower end. ARD sits higher in the same bracket because a small room
    // below its Schroeder frequency is modal rather than diffuse.
    const { lower, upper } = bracket(ALPHA);
    const t30 = decayTime(result.bins, -5, -35);
    expect((t30 - lower) / (upper - lower)).toBeLessThan(0.5);
  });

  test("more absorption decays faster, and each α lands in its own bracket", () => {
    // The discriminator. A solver that ignored the coefficient entirely, or
    // applied it with the wrong sign, passes a single-α band far more easily
    // than it passes this.
    const measured = [0.1, 0.4].map((alpha) => ({
      alpha,
      t30: decayTime(shoot(alpha, SCATTERING, 6000).bins, -5, -35),
      ...bracket(alpha),
    }));

    for (const { t30, lower, upper } of measured) {
      expect(Number.isFinite(t30)).toBe(true);
      expect(t30).toBeGreaterThan(lower);
      expect(t30).toBeLessThan(upper);
    }
    expect(measured[1].t30).toBeLessThan(measured[0].t30);
  }, 120_000);
});
