/**
 * Issue #124: image-source IR must be deterministic and use signed pressure R.
 */
import { Vector3 } from "three";
import { pressureReflectionCoefficient } from "../../../acoustics/reflection-coefficient";
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

describe("Issue #124: signed specular IR", () => {
  test("hard-wall pressure R is −1; energy R² is +1", () => {
    expect(pressureReflectionCoefficient(0, 0)).toBeCloseTo(-1, 10);
    expect(pressureReflectionCoefficient(0, 0) ** 2).toBeCloseTo(1, 10);
  });

  test("direct-path IR sample is positive", () => {
    const p = imageSourceArrivalPressureIR([100], [1000], direct(2), 20);
    expect(p[0]).toBeGreaterThan(0);
  });

  test("hard-wall first-order IR sample is negative (R = −1)", () => {
    const p = imageSourceArrivalPressureIR([100], [1000], oneBounce(2, 0), 20);
    expect(p[0]).toBeLessThan(0);
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
