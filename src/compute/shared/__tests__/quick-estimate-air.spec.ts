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
import { quickEstimateStep } from "../quick-estimate";

const ROOM = { lx: 5, ly: 4, lz: 3 } as const;

/**
 * A sealed shoebox whose walls absorb `alpha` at every angle.
 *
 * Duck-typed rather than a real `Surface`: `quickEstimateStep` needs `kind`
 * and `reflectionFunction`, and the class pulls in a chain jsdom cannot load.
 */
function shoebox(alpha: number): THREE.Object3D[] {
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
    group.numHits = 0;
    group.updateMatrixWorld(true);
    return group;
  };

  return [
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, 0, lz), V(0, 0, lz)]),
    wall([V(0, ly, 0), V(lx, ly, 0), V(lx, ly, lz), V(0, ly, lz)]),
    wall([V(0, 0, 0), V(0, ly, 0), V(0, ly, lz), V(0, 0, lz)]),
    wall([V(lx, 0, 0), V(lx, ly, 0), V(lx, ly, lz), V(lx, 0, lz)]),
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, ly, 0), V(0, ly, 0)]),
    wall([V(0, 0, lz), V(lx, 0, lz), V(lx, ly, lz), V(0, ly, lz)]),
  ];
}

/** Median RT60 per band over a few rays. */
function estimate(
  objects: THREE.Object3D[],
  frequencies: number[],
  temperature: number,
  rays = 9,
): number[] {
  const raycaster = new THREE.Raycaster();
  const source = new THREE.Vector3(ROOM.lx * 0.28, ROOM.ly * 0.55, ROOM.lz * 0.34);
  const perBand: number[][] = frequencies.map(() => []);
  for (let i = 0; i < rays; i++) {
    const { rt60s } = quickEstimateStep(
      raycaster, objects, source, 1, frequencies, temperature,
    );
    for (let f = 0; f < frequencies.length; f++) perBand[f].push(rt60s[f]);
  }
  return perBand.map((values) => {
    values.sort((a, b) => a - b);
    return values[values.length >> 1];
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
    const measured = estimate(shoebox(0), frequencies, temperature);
    for (let f = 0; f < frequencies.length; f++) {
      const predicted = airOnlyRt60(frequencies[f], temperature);
      // Quantized by segment length — the crossing is read at the end of the
      // segment that passed it — which is well under a percent here.
      expect([frequencies[f], measured[f] / predicted]).toEqual([
        frequencies[f],
        expect.closeTo(1, 2),
      ]);
    }
  }, 120_000);

  it("follows the temperature, because the attenuation does", () => {
    const frequency = 8000;
    for (const temperature of [10, 30]) {
      const [measured] = estimate(shoebox(0), [frequency], temperature);
      expect([temperature, measured / airOnlyRt60(frequency, temperature)])
        .toEqual([temperature, expect.closeTo(1, 2)]);
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
    const [fourK, eightK] = estimate(shoebox(0), [4000, 8000], 20);
    expect(eightK).toBeGreaterThan(0);
    expect(fourK).toBeGreaterThan(0);
    // And in the right order: the band air attacks hardest decays soonest.
    expect(eightK).toBeLessThan(fourK);
  }, 120_000);

  it("a band that cannot finish within the bounce budget still reports 0", () => {
    // 2 kHz needs 5,357 m of path against roughly 2,200 m of budget, so it
    // runs out — which the callers read as "no estimate" rather than as a
    // short decay. Pinned so the budget's effect stays visible.
    const [twoK] = estimate(shoebox(0), [2000], 20);
    expect(twoK).toBe(0);
  }, 120_000);

  it("air and the surface compose, rather than one replacing the other", () => {
    // An absorbing room must decay faster than the air-only bound at the same
    // frequency, and faster than the same room's lower band where air is
    // weaker. A mutant that applied air *instead* of the coefficient passes
    // neither.
    const frequencies = [1000, 8000];
    const absorbing = estimate(shoebox(0.2), frequencies, 20);
    for (let f = 0; f < frequencies.length; f++) {
      expect([frequencies[f], absorbing[f] > 0]).toEqual([frequencies[f], true]);
      expect([frequencies[f], absorbing[f] < airOnlyRt60(frequencies[f], 20)])
        .toEqual([frequencies[f], true]);
    }
    // 8 kHz gets both losses, 1 kHz effectively only the surface, so the top
    // band is the shorter of the two.
    expect(absorbing[1]).toBeLessThan(absorbing[0]);
  }, 120_000);
});
