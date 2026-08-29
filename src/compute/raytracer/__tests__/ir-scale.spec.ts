/**
 * Issue #133: 1/N IR scale, stable specular sign, centre arrival time.
 */
import {
  extraLengthToReceiverCenter,
  monteCarloSign,
  monteCarloWeight,
  rayOrderFromChain,
} from "../ir-scale";
import { stampRayPathTiming } from "../path-timing";

describe("Issue #133: Monte Carlo weight", () => {
  test("2× rays keep the same deposited scale, not 2×", () => {
    const p = 2;
    const s1 = 10 * p * monteCarloWeight(10);
    const s2 = 20 * p * monteCarloWeight(20);
    expect(s2).toBeCloseTo(s1, 10);
    expect(s2).not.toBeCloseTo(2 * s1, 5);
  });
});

describe("Issue #133: specular sign", () => {
  test("order 0 and 1 never flip", () => {
    expect(monteCarloSign(0, () => 0)).toBe(1);
    expect(monteCarloSign(1, () => 0)).toBe(1);
  });
  test("higher order may flip", () => {
    expect(monteCarloSign(2, () => 0)).toBe(-1);
    expect(rayOrderFromChain({ chainLength: 1 })).toBe(0);
  });
});

describe("Issue #133: arrival time is to the receiver centre", () => {
  test("direct time is source.distanceTo(center)/c, not minus 0.1/c", () => {
    const c = 343;
    const sourceToSurface = 1.9;
    const hit: [number, number, number] = [1.9, 0, 0];
    const center = { x: 2, y: 0, z: 0 };
    const extra = extraLengthToReceiverCenter(hit, center);
    const path = stampRayPathTiming({ chain: [{ distance: sourceToSurface }] }, c, extra);
    expect(path.time).toBeCloseTo(2 / c, 10);
    expect(path.time).not.toBeCloseTo(sourceToSurface / c, 6);
  });
});

describe("Issue #133: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const index = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");
  const download = fs.readFileSync(path.resolve(__dirname, "../export-playback.ts"), "utf8");

  test("IR deposits use 1/N and do not peak-normalize the exported buffer", () => {
    expect(index).toMatch(/monteCarloWeight/);
    expect(index).toMatch(/createBufferSource\(signal,/);
    expect(index).not.toMatch(/createBufferSource\(normalizedSignal,/);
    expect(download).not.toMatch(/ac\.normalize\(samples/);
  });
});
