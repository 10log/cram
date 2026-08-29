/**
 * Issue #115: FDTD 2D must use ac.soundSpeed(T), not 340.29 m/s.
 */
import { soundSpeed } from "../../acoustics/sound-speed";
import { computeTimestep } from "../timestep";

describe("Issue #115: FDTD wave speed", () => {
  test("default 20 °C matches the project sound-speed (~343.2 m/s)", () => {
    expect(soundSpeed(20)).toBeCloseTo(343.2, 0);
    expect(Math.abs(soundSpeed(20) - 340.29)).toBeGreaterThan(2);
  });

  test("dt and courant number stay on the 2D CFL locus when c changes", () => {
    const cellSize = 10 / 256;
    for (const t of [0, 20, 30]) {
      const c = soundSpeed(t);
      const dt = computeTimestep(cellSize, c);
      expect(c * dt / cellSize).toBeCloseTo(1 / Math.SQRT2, 10);
    }
  });
});

describe("Issue #115: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("340.29 is gone; waveSpeed comes from soundSpeed(temperature)", () => {
    expect(source).not.toMatch(/340\.29/);
    expect(source).toMatch(/soundSpeed\(/);
    expect(source).toMatch(/applyWaveSpeed/);
    expect(source).toMatch(/get c\(/);
  });
});
