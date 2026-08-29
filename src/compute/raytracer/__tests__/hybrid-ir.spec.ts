/**
 * Issue #129: hybrid IR must not splice this.paths and must not double-count early energy.
 */
import {
  hybridImageSourcePaths,
  hybridStochasticPaths,
  rayPathOrder,
} from "../hybrid-ir";

function ray(chainLength: number, time: number) {
  return { chainLength, time };
}

describe("Issue #129: hybrid path split", () => {
  const stored = [ray(1, 0.01), ray(2, 0.02), ray(3, 0.03), ray(4, 0.04), ray(2, 0.05)];

  test("rayPathOrder is chainLength - 1", () => {
    expect(rayPathOrder({ chainLength: 1 })).toBe(0);
    expect(rayPathOrder({ chainLength: 3 })).toBe(2);
  });

  test("stochastic side keeps only order > transitionOrder and does not mutate input", () => {
    const copy = stored.slice();
    const late = hybridStochasticPaths(stored, 2);
    expect(stored).toEqual(copy);
    expect(late.every((p) => rayPathOrder(p) > 2)).toBe(true);
    expect(late.map((p) => p.chainLength)).toEqual([4]);
  });

  test("image-source side keeps only order ≤ transitionOrder", () => {
    const isPaths = [
      { order: 0, time: 0.01 },
      { order: 2, time: 0.02 },
      { order: 3, time: 0.03 },
    ];
    expect(hybridImageSourcePaths(isPaths, 2).map((p) => p.order)).toEqual([0, 2]);
  });

  test("direct sound is order 0 and belongs to image source, not stochastic", () => {
    const direct = ray(1, 0.01);
    expect(hybridStochasticPaths([direct], 2)).toEqual([]);
    expect(hybridImageSourcePaths([{ order: 0, time: 0.01 }], 2)).toHaveLength(1);
  });
});

describe("Issue #129: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("calculateImpulseResponse does not splice the stored path list", () => {
    expect(source).toMatch(/hybridStochasticPaths\(storedPaths/);
    expect(source).not.toMatch(/sorted\.splice\(/);
    expect(source).toMatch(/hybridImageSourcePaths\(/);
  });
});
