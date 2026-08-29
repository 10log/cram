/**
 * Issue #117: ART must emit an unnormalized energy envelope, not a 1 kHz IR.
 */
import { downsampleEnergyEnvelope, peakAmplitude } from "../energy-decay";
import { directPathEnergy } from "../direct-path";

describe("Issue #117: ART energy decay", () => {
  test("two distances keep a (r1/r2)² peak ratio when not peak-normalized", () => {
    const e1 = directPathEnergy({ energy: 500, distance: 2, airAbsDbPerMeter: 0 });
    const e2 = directPathEnergy({ energy: 500, distance: 4, airAbsDbPerMeter: 0 });
    expect(e1 / e2).toBeCloseTo(4, 10);
    const a = new Float32Array(8);
    const b = new Float32Array(8);
    a[2] = e1;
    b[4] = e2;
    expect(peakAmplitude(a) / peakAmplitude(b)).toBeCloseTo(4, 10);
  });

  test("downsample does not peak-normalize", () => {
    const samples = new Float32Array([0, 12, 3, 0]);
    const pts = downsampleEnergyEnvelope(samples, 1000, 2000);
    expect(Math.max(...pts.map((p) => p.amplitude))).toBe(12);
  });
});

describe("Issue #117: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../art.ts"), "utf8");

  test("calculate() does not peak-normalize or emit ImpulseResponse", () => {
    expect(source).not.toMatch(/combined\[i\] \/= maxVal/);
    expect(source).toMatch(/ResultKind\.EnergyDecay/);
    expect(source).not.toMatch(/kind: ResultKind\.ImpulseResponse/);
    expect(source).toMatch(/units: "energy"/);
  });
});
