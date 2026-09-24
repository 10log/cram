/**
 * Issue #217: the shared RT60 quick estimate loses energy to air as well as to
 * surfaces, and every band reports rather than only the first one to decay.
 *
 * `airAttenuation` was computed and discarded — eslint had been reporting the
 * unused variable for as long as it had been there — so the estimate applied
 * no air absorption while both full solves did (`ray-core.ts` per segment,
 * `beam-trace/arrival-pressure.ts` over the path). It was wrong only in the
 * bands where air dominates, which is why it read as plausible.
 *
 * The oracle here is exact rather than statistical. In a **perfectly rigid**
 * room the surface takes nothing, so air is the only loss: intensity falls as
 * `10^(-att·d/10)`, and 60 dB arrives at `d = 60/att` metres however the ray
 * happens to bounce. The predicted RT60 is `60 / (att · c)` — a closed form,
 * independent of geometry and of the ray's direction.
 */

import * as THREE from "three";
import * as ac from "../../acoustics";
import { reflectionCoefficient } from "../../acoustics/reflection-coefficient";
import { traceRay } from "../../raytracer/ray-core";
import { quickEstimateStep } from "../quick-estimate";
import { QUICK_ESTIMATE_MAX_ORDER } from "../quick-estimate-types";

const ROOM = { lx: 5, ly: 4, lz: 3 } as const;

/** Rays per measurement. The rigid-room answer is path-length-only, so this
 *  is about averaging out segment quantization rather than Monte Carlo noise. */
const RAYS = 15;

/**
 * A sealed shoebox whose walls absorb `alpha` at every angle.
 *
 * Duck-typed rather than a real `Surface`: `quickEstimateStep` needs `kind`
 * and `reflectionFunction`, and the class pulls in a chain jsdom cannot load.
 */
function shoebox(alpha: number, withReceiver = false): THREE.Object3D[] {
  const { lx, ly, lz } = ROOM;
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const centre = V(lx / 2, ly / 2, lz / 2);

  const wall = (corners: THREE.Vector3[]): THREE.Object3D => {
    let [a, b, c, d] = corners;
    const normalOf = (p: THREE.Vector3, q: THREE.Vector3, r: THREE.Vector3) =>
      new THREE.Vector3()
        .subVectors(q, p)
        .cross(new THREE.Vector3().subVectors(r, p))
        .normalize();
    if (normalOf(a, b, c).dot(new THREE.Vector3().subVectors(centre, a)) < 0) {
      [a, b, c, d] = [d, c, b, a];
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [a, b, c, a, c, d].flatMap((p) => [p.x, p.y, p.z]),
        3,
      ),
    );
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
    );
    const group = new THREE.Group() as THREE.Group & Record<string, unknown>;
    group.add(mesh);
    group.kind = "surface";
    group.reflectionFunction = (_f: number, theta: number) =>
      reflectionCoefficient(alpha, theta);
    group.scatteringFunction = () => 0;
    group.numHits = 0;
    group.updateMatrixWorld(true);
    return group;
  };

  const objects: THREE.Object3D[] = [
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, 0, lz), V(0, 0, lz)]),
    wall([V(0, ly, 0), V(lx, ly, 0), V(lx, ly, lz), V(0, ly, lz)]),
    wall([V(0, 0, 0), V(0, ly, 0), V(0, ly, lz), V(0, 0, lz)]),
    wall([V(lx, 0, 0), V(lx, ly, 0), V(lx, ly, lz), V(lx, 0, lz)]),
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, ly, 0), V(0, ly, 0)]),
    wall([V(0, 0, lz), V(lx, 0, lz), V(lx, ly, lz), V(0, ly, lz)]),
  ];

  if (withReceiver) {
    const receiver = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 12),
      new THREE.MeshBasicMaterial(),
    );
    receiver.userData.kind = "receiver";
    const group = new THREE.Group();
    group.add(receiver);
    group.position.set(lx * 0.7, ly * 0.45, lz * 0.62);
    group.updateMatrixWorld(true);
    objects.push(group);
  }
  return objects;
}

/** The same shoebox with one wall missing, so rays leave through the gap. */
function openBox(alpha: number): THREE.Object3D[] {
  return shoebox(alpha).slice(0, 5);
}

/**
 * Per band: the median of the rays that reported, and how many did.
 *
 * Zeros are dropped before the median rather than sorted into it — the same
 * convention `beam-trace/quick-estimate.ts` uses when averaging
 * (`if (r.rt60s[f] > 0)`). Taking the median *including* zeros would let a
 * couple of long-winded paths drag a band's result to 0 while most rays
 * succeeded, which is a property of the sampling rather than of the physics.
 */
function estimate(
  objects: THREE.Object3D[],
  frequencies: number[],
  temperature: number,
  rays = 9,
): { median: number; reported: number }[] {
  const raycaster = new THREE.Raycaster();
  const source = new THREE.Vector3(ROOM.lx * 0.28, ROOM.ly * 0.55, ROOM.lz * 0.34);
  const perBand: number[][] = frequencies.map(() => []);
  for (let i = 0; i < rays; i++) {
    const { rt60s } = quickEstimateStep(
      raycaster, objects, source, 1, frequencies, temperature,
    );
    for (let f = 0; f < frequencies.length; f++) {
      if (rt60s[f] > 0) perBand[f].push(rt60s[f]);
    }
  }
  return perBand.map((values) => {
    values.sort((a, b) => a - b);
    return {
      median: values.length ? values[values.length >> 1] : 0,
      reported: values.length,
    };
  });
}

/** 60 dB of intensity from air alone, in seconds. */
function airOnlyRt60(frequency: number, temperature: number): number {
  const att = (ac.airAttenuation([frequency], temperature) as number[])[0];
  return 60 / att / ac.soundSpeed(temperature);
}

describe("Issue #217: air absorption ends the decay in the top bands", () => {
  it("a rigid room decays at exactly the air-only rate", () => {
    // Nothing statistical about this: with alpha = 0 the walls take nothing,
    // so the answer depends only on how far the ray has travelled, not where
    // it went. Before #217 a rigid room never decayed at all and every band
    // ran out of bounces reporting 0.
    const frequencies = [4000, 8000];
    const temperature = 20;
    const measured = estimate(shoebox(0), frequencies, temperature, RAYS);
    for (let f = 0; f < frequencies.length; f++) {
      const predicted = airOnlyRt60(frequencies[f], temperature);
      expect([frequencies[f], measured[f].reported]).toEqual([frequencies[f], RAYS]);
      // 2%, because the crossing is read at the end of the segment that
      // passed it and segment lengths vary with the ray's path. Measured
      // spread over repeats is 0.4-0.7%, so this is a few times the grain and
      // nowhere near the factor any of the mutants produce.
      const ratio = measured[f].median / predicted;
      expect([frequencies[f], Math.abs(ratio - 1) < 0.02]).toEqual([frequencies[f], true]);
    }
  }, 120_000);

  it("follows the temperature, because the attenuation does", () => {
    const frequency = 8000;
    for (const temperature of [10, 30]) {
      const [measured] = estimate(shoebox(0), [frequency], temperature, RAYS);
      const ratio = measured.median / airOnlyRt60(frequency, temperature);
      expect([temperature, Math.abs(ratio - 1) < 0.02]).toEqual([temperature, true]);
    }
    // And the two temperatures really do differ, so the test above is not
    // comparing a constant against itself.
    expect(airOnlyRt60(frequency, 10)).not.toBeCloseTo(airOnlyRt60(frequency, 30), 2);
  }, 120_000);

  it("reports every band, not just the first one to finish", () => {
    // The fix that had to come with air absorption. `doneDecaying` was set by
    // the first band to cross and ended the loop, so slower bands returned 0 —
    // and the callers drop zeros from their average, blanking the band in the
    // UI. 8 kHz crosses at 460 m of path and 4 kHz at 1644 m, so under the old
    // flag 4 kHz would never report.
    const rays = RAYS;
    const [fourK, eightK] = estimate(shoebox(0), [4000, 8000], 20, rays);
    // Every ray, not just the median: the old flag would have left 4 kHz at
    // zero on every one of them.
    expect(eightK.reported).toBe(rays);
    expect(fourK.reported).toBe(rays);
    // And in the right order: the band air attacks hardest decays soonest.
    expect(eightK.median).toBeLessThan(fourK.median);
  }, 120_000);

  it("a band whose decay needs more path than the budget allows reports 0", () => {
    // Derived rather than pinned to a frequency. The budget is
    // `QUICK_ESTIMATE_MAX_ORDER` segments of roughly a mean free path
    // (`4V/S`), and a band needs `60/att` metres; a band that wants more than
    // the budget cannot finish, which the callers read as "no estimate"
    // rather than as a short decay. Stated this way the test fails with
    // "budget too short" if the room, the order cap or the air model moves,
    // instead of failing at 2 kHz specifically.
    const { lx, ly, lz } = ROOM;
    const meanFreePath =
      (4 * (lx * ly * lz)) / (2 * (lx * ly + lx * lz + ly * lz));
    const budgetMetres = QUICK_ESTIMATE_MAX_ORDER * meanFreePath;
    const requiredMetres = (f: number) =>
      60 / (ac.airAttenuation([f], 20) as number[])[0];

    const tooFar = [125, 250, 500, 1000, 2000].filter(
      (f) => requiredMetres(f) > 2 * budgetMetres,
    );
    const comfortable = [4000, 8000].filter(
      (f) => requiredMetres(f) < budgetMetres / 2,
    );
    // The room has to actually straddle the budget, or this asserts nothing.
    expect(tooFar.length).toBeGreaterThan(0);
    expect(comfortable.length).toBeGreaterThan(0);

    for (const band of estimate(shoebox(0), tooFar, 20)) {
      expect(band.reported).toBe(0);
      expect(band.median).toBe(0);
    }
    for (const band of estimate(shoebox(0), comfortable, 20)) {
      expect(band.reported).toBeGreaterThan(0);
    }
  }, 120_000);

  it("air and the surface compose, rather than one replacing the other", () => {
    // An absorbing room must decay faster than the air-only bound at the same
    // frequency, and faster than the same room's lower band where air is
    // weaker. A mutant that applied air *instead* of the coefficient passes
    // neither.
    const frequencies = [1000, 8000];
    const absorbing = estimate(shoebox(0.2), frequencies, 20);
    for (let f = 0; f < frequencies.length; f++) {
      expect([frequencies[f], absorbing[f].reported > 0]).toEqual([frequencies[f], true]);
      expect([frequencies[f], absorbing[f].median < airOnlyRt60(frequencies[f], 20)])
        .toEqual([frequencies[f], true]);
    }
    // 8 kHz gets both losses, 1 kHz effectively only the surface, so the top
    // band is the shorter of the two.
    expect(absorbing[1].median).toBeLessThan(absorbing[0].median);
  }, 120_000);

  it("stops when the ray leaves the model instead of recasting it forever", () => {
    // On a miss, `position` and `direction` are unchanged, so continuing
    // recasts the identical ray for the rest of the budget without making
    // progress. That was survivable while the *first* band to decay ended the
    // loop; with per-band completion an escaping ray in a reflective room
    // would burn all 1000 iterations.
    //
    // Counted rather than timed, by handing `quickEstimateStep` a raycaster
    // that tallies its own calls — the signature takes one, so no production
    // seam is needed for this.
    class CountingRaycaster extends THREE.Raycaster {
      casts = 0;
      intersectObjects(
        objects: THREE.Object3D[],
        recursive?: boolean,
        target?: THREE.Intersection[],
      ): THREE.Intersection[] {
        this.casts += 1;
        return super.intersectObjects(objects, recursive, target);
      }
    }

    const source = new THREE.Vector3(ROOM.lx * 0.28, ROOM.ly * 0.55, ROOM.lz * 0.34);
    const run = (objects: THREE.Object3D[]) => {
      const raycaster = new CountingRaycaster();
      quickEstimateStep(raycaster, objects, source, 1, [8000], 20);
      return raycaster.casts;
    };

    // A box with one wall missing: a ray that finds the gap leaves, and the
    // step has to end. Several tries, because a ray can bounce for a while
    // before it happens to reach the opening.
    const escapes: number[] = [];
    for (let i = 0; i < 12; i++) escapes.push(run(openBox(0)));
    const shortest = Math.min(...escapes);
    expect(shortest).toBeLessThan(QUICK_ESTIMATE_MAX_ORDER / 2);

    // And the counter is measuring something: a sealed rigid room runs long,
    // so a low count cannot be an artifact of the instrumentation.
    expect(run(shoebox(0))).toBeGreaterThan(100);
  }, 120_000);

  it("agrees with the full solve about which band air shortens", () => {
    // #217 asked that the estimate and the full solve agree in direction on
    // the same room. Their absolute calibration legitimately differs — the
    // estimate is one specular ray per sample with no diffusion and lands
    // around half of Eyring — so this pins the ordering rather than the gap:
    // in both, the band air attacks hardest decays soonest.
    const frequencies = [1000, 8000];
    const temperature = 20;
    const alpha = 0.2;

    const estimated = estimate(shoebox(alpha), frequencies, temperature, RAYS);
    expect(estimated[1].median).toBeLessThan(estimated[0].median);

    // The same room through `traceRay`, with the air attenuation it really
    // uses, gathered at a receiver and read as T30 per band.
    const objects = shoebox(alpha, true);
    const raycaster = new THREE.Raycaster();
    const source = new THREE.Vector3(ROOM.lx * 0.28, ROOM.ly * 0.55, ROOM.lz * 0.34);
    const cachedAirAtt = ac.airAttenuation(frequencies, temperature) as number[];
    const c = ac.soundSpeed(temperature);
    const SAMPLE_RATE = 1000;
    const bins = frequencies.map(() => new Float64Array(4000));

    for (let i = 0; i < 4000; i++) {
      const z = Math.random() * 2 - 1;
      const phi = Math.random() * 2 * Math.PI;
      const r = Math.sqrt(1 - z * z);
      const direction = new THREE.Vector3(r * Math.cos(phi), r * Math.sin(phi), z);
      const path = traceRay(
        raycaster, objects, frequencies, cachedAirAtt, 1e-12,
        source.clone(), direction, 400, frequencies.map(() => 1),
        "source", 0, 0,
      );
      if (!path?.intersectedReceiver) continue;
      const travelled = (path.chain as { distance?: number }[]).reduce(
        (total, hop) => total + (hop.distance ?? 0), 0,
      );
      const bin = Math.round((travelled / c) * SAMPLE_RATE);
      if (bin >= bins[0].length) continue;
      for (let f = 0; f < frequencies.length; f++) bins[f][bin] += path.bandEnergy![f];
    }

    const t30 = bins.map((histogram) => {
      const edc = new Float64Array(histogram.length);
      let acc = 0;
      for (let i = histogram.length - 1; i >= 0; i--) {
        acc += histogram[i];
        edc[i] = acc;
      }
      const peak = edc[0];
      const db = (i: number) => 10 * Math.log10(edc[i] / peak);
      let from = -1;
      let to = -1;
      for (let i = 0; i < histogram.length; i++) {
        if (from < 0 && db(i) <= -5) from = i;
        if (db(i) <= -35) { to = i; break; }
      }
      if (from < 0 || to < 0 || to <= from) return NaN;
      return -60 / ((db(to) - db(from)) / (((to - from) / SAMPLE_RATE)));
    });

    for (const t of t30) expect(Number.isFinite(t)).toBe(true);
    expect([t30, t30[1] < t30[0]]).toEqual([t30, true]);
  }, 180_000);
});