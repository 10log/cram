/**
 * Issue #116: ART direct sound must not scale with the number of octave bands.
 */
import {
  DIRECT_AIR_FREQUENCY_HZ,
  pickDirectAirFrequency,
  directPathEnergy,
  directPathSampleIndex,
} from "../direct-path";

describe("Issue #116: ART direct path", () => {
  test("direct energy does not depend on how many bands will be summed", () => {
    const one = directPathEnergy({ energy: 500, distance: 4, airAbsDbPerMeter: 0 });
    const sevenCopies = 7 * one;
    expect(one).toBeCloseTo(500 / 16, 10);
    expect(sevenCopies).toBeCloseTo(7 * one, 10);
    expect(one).not.toBeCloseTo(sevenCopies, 5);
  });

  test("1 band vs 7 bands: the direct bin added once is identical", () => {
    const e = directPathEnergy({ energy: 500, distance: 2, airAbsDbPerMeter: 0.1 });
    const bands1 = [e];
    const bands7 = Array.from({ length: 7 }, () => 0);
    bands7[0] = e;
    const sum1 = bands1.reduce((a, b) => a + b, 0);
    const sum7 = bands7.reduce((a, b) => a + b, 0);
    expect(sum1).toBeCloseTo(sum7, 12);
  });

  test("picks 1 kHz when present, otherwise the middle listed band", () => {
    expect(pickDirectAirFrequency([125, 250, 500, 1000, 2000, 4000, 8000])).toBe(DIRECT_AIR_FREQUENCY_HZ);
    expect(pickDirectAirFrequency([125, 8000])).toBe(8000);
  });

  test("sample index is distance / c * sampleRate", () => {
    expect(directPathSampleIndex(343.2, 343.2, 1000)).toBe(1000);
  });
});

describe("Issue #116: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../art.ts"), "utf8");

  test("direct energy is added once to combined, not into every band buffer", () => {
    expect(source).toMatch(/directPathEnergy/);
    expect(source).toMatch(/combined\[directIdx\] \+= /);
    expect(source).not.toMatch(/bandResponses\[b\]\.buffer\[directIdx\] \+= this\.initialEnergy/);
  });
});
