/**
 * Issue #136: Schroeder EDC is forward in time, zeros are −∞ not 0 dB.
 */
import { schroederBackwardsIntegration } from "../schroeder";

describe("Issue #136: Schroeder EDC", () => {
  test("exponential IR: EDC[0] ∈ [−0.5, 0] dB and the curve is non-increasing", () => {
    const ir = new Float32Array(1000);
    for (let i = 0; i < ir.length; i++) ir[i] = Math.exp(-i / 200);
    const edc = schroederBackwardsIntegration(ir);
    expect(edc[0]).toBeGreaterThanOrEqual(-0.5);
    expect(edc[0]).toBeLessThanOrEqual(0);
    for (let i = 1; i < edc.length; i++) {
      expect(edc[i]).toBeLessThanOrEqual(edc[i - 1] + 1e-9);
    }
    expect(edc[edc.length - 1]).toBeLessThan(edc[0]);
  });

  test("zero remaining energy is −Infinity, never 0 dB", () => {
    const ir = new Float32Array([1, 0.5, 0, 0]);
    const edc = schroederBackwardsIntegration(ir);
    expect(edc[0]).toBeCloseTo(0, 6);
    expect(edc[edc.length - 1]).toBe(Number.NEGATIVE_INFINITY);
    expect(edc[edc.length - 2]).toBe(Number.NEGATIVE_INFINITY);
  });

  test("does not mutate the input", () => {
    const input = new Float32Array([1, 0.5, 0.25]);
    const copy = new Float32Array(input);
    schroederBackwardsIntegration(input);
    expect(Array.from(input)).toEqual(Array.from(copy));
  });
});
