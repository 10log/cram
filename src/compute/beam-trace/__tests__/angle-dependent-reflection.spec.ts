/**
 * Issue #65: the beam tracer reflects with the angle-dependent coefficient,
 * at the angle the path geometry actually has.
 *
 * This spec used to read `arrival-pressure.ts` as text: it checked that the
 * string `reflectionFunction(` appeared, that `Math.acos` appeared, and — the
 * one that aged worst — that the result was "wrapped with `Math.abs`". That
 * wrapper was a no-op on a non-negative energy, so the assertion pinned a
 * redundant guard rather than a property, and the whole block could pass with
 * the angle computed wrongly, the coefficient applied at the wrong incidence,
 * or the two bounces of a path multiplied in the wrong order.
 *
 * It also left the beam tracer with **no** behavioural coverage of the change
 * #200 pushed through it. Correcting the impedance branch moved α at oblique
 * incidence by a lot — at α = 0.3 a 60° bounce goes from 0.163 absorbed to
 * 0.513, and an eight-bounce path at mixed angles by 9.4 dB — and nothing in
 * this directory measured any of it.
 */

import * as THREE from "three";
import * as ac from "../../acoustics";
import { reflectionCoefficient } from "../../acoustics/reflection-coefficient";
import {
  calculateArrivalPressure,
  type ArrivalPath,
  type ArrivalSurface,
} from "../arrival-pressure";

const FREQS = [1000];
const TEMP = 20;
const INITIAL_SPL = [100];
const ALPHA = 0.3;

function opts(surfaces?: Map<number, ArrivalSurface>) {
  return {
    frequencies: FREQS,
    temperature: TEMP,
    receiverGain: 1,
    ...(surfaces ? { polygonToSurface: surfaces } : {}),
  };
}

function absorbing(alpha: number): ArrivalSurface {
  return { reflectionFunction: (_f, theta) => reflectionCoefficient(alpha, theta) };
}

/**
 * A specular bounce off the plane y = 0 with a known incidence angle.
 *
 * Source and receiver sit at height `h`, mirrored either side of the bounce
 * point, so the angle from the surface normal is `atan(d/h)`. The path is
 * built without a `reflections` array, which is what makes the solver derive
 * the angle from the point geometry — the branch #65 added and the one a real
 * beam path from the library does not always populate.
 */
function bouncePath(thetaDeg: number): { path: ArrivalPath; length: number } {
  const h = 1;
  const d = Math.tan((thetaDeg * Math.PI) / 180) * h;
  const leg = Math.hypot(d, h);
  return {
    path: {
      points: [
        new THREE.Vector3(d, h, 0), // receiver
        new THREE.Vector3(0, 0, 0), // bounce
        new THREE.Vector3(-d, h, 0), // source
      ],
      length: 2 * leg,
      polygonIds: [null, 7, null],
    },
    length: 2 * leg,
  };
}

function straightPath(length: number): ArrivalPath {
  return {
    points: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0)],
    length,
    polygonIds: [null, null],
  };
}

/** Energy the bounce keeps, with spreading and air divided out by comparison. */
function energyRatio(path: ArrivalPath, length: number, surfaces: Map<number, ArrivalSurface>) {
  const bounced = calculateArrivalPressure(INITIAL_SPL, path, opts(surfaces))[0];
  const direct = calculateArrivalPressure(INITIAL_SPL, straightPath(length), opts())[0];
  return (ac.P2I([bounced]) as number[])[0] / (ac.P2I([direct]) as number[])[0];
}

describe("Issue #65: reflection is applied at the path's own incidence angle", () => {
  const surfaces = new Map<number, ArrivalSurface>([[7, absorbing(ALPHA)]]);

  it.each([0, 15, 30, 45, 60, 75])("keeps reflectionCoefficient(alpha, %i deg)", (thetaDeg) => {
    // Pins both halves at once: the angle `acos(toSource · toReceiver) / 2`
    // recovers the true incidence, and the coefficient is multiplied into the
    // intensity as energy — not squared again, and not passed through an
    // absolute value that would hide a sign error in the surface.
    //
    // It does **not** check the coefficient itself: the expectation is built
    // from the same `reflectionCoefficient` the fixture surface calls, so a
    // change inside that function moves both sides together. Pinning the
    // pipeline is the job here; the shape of α(θ) is the next test's.
    const { path, length } = bouncePath(thetaDeg);
    const ratio = energyRatio(path, length, surfaces);
    const expected = reflectionCoefficient(ALPHA, (thetaDeg * Math.PI) / 180);
    expect([thetaDeg, ratio]).toEqual([thetaDeg, expect.closeTo(expected, 6)]);
  });

  it("absorbs more off-normal, not less", () => {
    // The #200 discriminator, and the assertion this directory never had. A
    // locally-reacting surface absorbs *more* as the angle opens up, until
    // R crosses zero, and only then falls away to zero at grazing. The
    // reciprocal branch that shipped before #200 fell monotonically from
    // normal incidence, so it fails this outright rather than by a margin.
    const absorbed = (thetaDeg: number) => {
      const { path, length } = bouncePath(thetaDeg);
      return 1 - energyRatio(path, length, surfaces);
    };
    const atNormal = absorbed(0);
    expect(atNormal).toBeCloseTo(ALPHA, 6);
    expect(absorbed(30)).toBeGreaterThan(atNormal);
    expect(absorbed(60)).toBeGreaterThan(absorbed(30));
    // And by a margin, stated against the branch it replaced rather than
    // against normal incidence: at 60 degrees the corrected mapping absorbs
    // 0.513 where the reciprocal one gave 0.163. A bound of 0.4 clears the
    // first comfortably and is three times the second.
    expect(absorbed(60)).toBeGreaterThan(0.4);
    expect(absorbed(60)).toBeCloseTo(0.513, 3);
  });

  it("uses the reflection list when the beam library supplies one", () => {
    // The other branch of the angle source. Given an explicit incidence it
    // must be believed over the geometry, so a library that already knows the
    // angle is not second-guessed — and the two agree when they describe the
    // same bounce.
    const { path, length } = bouncePath(60);
    const fromGeometry = energyRatio(path, length, surfaces);
    const fromList = energyRatio(
      { ...path, reflections: [{ incidenceAngle: (60 * Math.PI) / 180 }] },
      length,
      surfaces,
    );
    expect(fromList).toBeCloseTo(fromGeometry, 6);

    // And a different stated angle really is used, rather than quietly
    // recomputed from the points.
    const stated = energyRatio(
      { ...path, reflections: [{ incidenceAngle: 0 }] },
      length,
      surfaces,
    );
    expect(stated).toBeCloseTo(reflectionCoefficient(ALPHA, 0), 6);
    expect(stated).not.toBeCloseTo(fromGeometry, 3);
  });

  it("multiplies the coefficient once per reflection", () => {
    // Two bounces off the same material at stated angles: the arrival keeps
    // the product. An off-by-one in `reflectionIdx` — the counter that steps
    // past the null source and receiver entries — shows up here and nowhere
    // in a source grep.
    const twoBounces: ArrivalPath = {
      points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(2, 0, 0),
        new THREE.Vector3(3, 0, 0),
      ],
      length: 3,
      polygonIds: [null, 7, 7, null],
      reflections: [
        { incidenceAngle: (30 * Math.PI) / 180 },
        { incidenceAngle: (60 * Math.PI) / 180 },
      ],
    };
    const ratio = energyRatio(twoBounces, 3, surfaces);
    const expected =
      reflectionCoefficient(ALPHA, (30 * Math.PI) / 180) *
      reflectionCoefficient(ALPHA, (60 * Math.PI) / 180);
    expect(ratio).toBeCloseTo(expected, 6);
  });

  it("leaves a path alone where no surface is known for the polygon", () => {
    // A polygon with no material must not silently absorb or amplify; the
    // reflection counter still has to advance past it, which is why this sits
    // next to the multiplication test.
    const { path, length } = bouncePath(45);
    expect(energyRatio(path, length, new Map())).toBeCloseTo(1, 6);
  });
});

describe("Issue #65: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../arrival-pressure.ts"), "utf-8");

  it("does not reflect with the normal-incidence approximation", () => {
    // The one source assertion worth keeping: `1 - absorptionFunction(freq)`
    // is angle-blind, and its absence cannot be observed from the outside
    // once the angle-dependent path is correct, because at normal incidence
    // the two agree exactly.
    expect(source).not.toMatch(/1\s*-\s*.*absorptionFunction/);
  });
});
