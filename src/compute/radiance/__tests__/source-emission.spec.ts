/**
 * Issue #119: ART must use Source.initialSPL and DirectivityHandler Q.
 */
import * as THREE from "three";
import { sourceEmissionEnergy, sourceRayWeight } from "../source-emission";

describe("Issue #119: ART source emission", () => {
  test("10 dB more SPL is 10× energy", () => {
    const lo = sourceEmissionEnergy(90);
    const hi = sourceEmissionEnergy(100);
    expect(hi / lo).toBeCloseTo(10, 10);
  });

  test("omni / missing handler is Q = 1", () => {
    expect(
      sourceRayWeight({
        handler: null,
        worldDir: new THREE.Vector3(1, 0, 0),
        frequency: 1000,
      }),
    ).toBe(1);
  });

  test("pressure ratio 2 on-axis is energy Q = 4", () => {
    const handler = {
      getPressureAtPosition: (_g: number, _f: number, phi: number, theta: number) => {
        if (phi === 0 && theta === 0) return 1;
        return 2;
      },
    };
    const q = sourceRayWeight({
      handler,
      quaternion: new THREE.Quaternion(),
      worldDir: new THREE.Vector3(0, 0, 1),
      frequency: 1000,
    });
    expect(q).toBeCloseTo(4, 5);
  });
});

describe("Issue #119: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../art.ts"), "utf8");

  test("calculate uses source.initialSPL and sourceRayWeight, not the 500-unit constant", () => {
    expect(source).toMatch(/sourceEmissionEnergy\(source\.initialSPL\)/);
    expect(source).toMatch(/sourceRayWeight/);
    expect(source).not.toMatch(/injectSourceEnergy\(sourcePos, this\.initialEnergy/);
  });
});
