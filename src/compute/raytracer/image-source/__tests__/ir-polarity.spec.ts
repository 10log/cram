/**
 * Issue #124: image-source IR must be deterministic and use signed pressure R.
 */
import { Vector3 } from "three";
import {
  impedanceForAbsorption,
  pressureReflectionCoefficient,
} from "../../../acoustics/reflection-coefficient";
import {
  imageSourceArrivalPressure,
  imageSourceArrivalPressureIR,
} from "../arrival-pressure";

function direct(r: number) {
  return [
    { point: new Vector3(0, 0, 0), reflectingSurface: null, angle: null },
    { point: new Vector3(r, 0, 0), reflectingSurface: null, angle: null },
  ];
}

function oneBounce(r: number, alpha: number) {
  const wall = {
    reflectionFunction: (freq: number, theta: number) => {
      const R = pressureReflectionCoefficient(alpha, theta);
      return R * R;
    },
    pressureReflectionFunction: (freq: number, theta: number) =>
      pressureReflectionCoefficient(alpha, theta),
  };
  return [
    { point: new Vector3(0, 0, 0), reflectingSurface: null, angle: null },
    { point: new Vector3(r / 2, 1, 0), reflectingSurface: wall, angle: 0 },
    { point: new Vector3(r, 0, 0), reflectingSurface: null, angle: null },
  ];
}

/** One bounce whose reflection is evaluated at a chosen angle of incidence. */
function oneBounceAt(r: number, alpha: number, theta: number) {
  const path = oneBounce(r, alpha);
  path[1].angle = theta;
  return path;
}

describe("Issue #124: signed specular IR", () => {
  // #124 asked for the sign to be deterministic and to "match the
  // pressure-reflection convention you document" — it did not fix which sign.
  // The documented convention is now R = +1 for a rigid wall (issue #200): a
  // rigid surface doubles pressure at the boundary, p_total = 2*p_incident,
  // and R = -1 describes a pressure-release surface instead. The earlier -1
  // was an artefact of the reciprocal impedance branch, not a choice.
  test("hard-wall pressure R is +1; energy R² is +1", () => {
    expect(pressureReflectionCoefficient(0, 0)).toBeCloseTo(1, 10);
    expect(pressureReflectionCoefficient(0, 0) ** 2).toBeCloseTo(1, 10);
  });

  test("direct-path IR sample is positive", () => {
    const p = imageSourceArrivalPressureIR([100], [1000], direct(2), 20);
    expect(p[0]).toBeGreaterThan(0);
  });

  test("hard-wall first-order IR sample is positive (R = +1)", () => {
    const p = imageSourceArrivalPressureIR([100], [1000], oneBounce(2, 0), 20);
    expect(p[0]).toBeGreaterThan(0);
  });

  // The part of #124 that is about polarity rather than about a constant: the
  // sign has to come from R and follow it, so an absorbing surface past its
  // sign change inverts where a rigid one does not. `Math.abs` on R would pass
  // both tests above and fail this one.
  test("first-order sign follows R past its zero crossing", () => {
    const alpha = 0.3;
    const xi = impedanceForAbsorption(alpha);
    const grazingOfCrossing = Math.acos(1 / xi) + 0.05;
    expect(pressureReflectionCoefficient(alpha, grazingOfCrossing)).toBeLessThan(0);

    const upright = imageSourceArrivalPressureIR([100], [1000], oneBounce(2, 0), 20);
    const inverted = imageSourceArrivalPressureIR(
      [100],
      [1000],
      oneBounceAt(2, alpha, grazingOfCrossing),
      20,
    );
    expect(upright[0]).toBeGreaterThan(0);
    expect(inverted[0]).toBeLessThan(0);
  });

  test("two IR evaluations on a frozen path are identical (no RNG)", () => {
    const path = oneBounce(3, 0.2);
    const a = imageSourceArrivalPressureIR([100], [1000], path, 20);
    const b = imageSourceArrivalPressureIR([100], [1000], path, 20);
    expect(a[0]).toBe(b[0]);
  });

  test("LTP energy arrival stays unsigned", () => {
    const p = imageSourceArrivalPressure([100], [1000], oneBounce(2, 0), 20);
    expect(p[0]).toBeGreaterThan(0);
  });
});

describe("Issue #124: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("calculateImpulseResponse has no Math.random flip", () => {
    expect(source).not.toMatch(/Math\.random\(\)\s*>\s*0\.5/);
    expect(source).toMatch(/imageSourceArrivalPressureIR/);
    expect(source).toMatch(/src\?\.initialSPL/);
  });
});
