/**
 * Issue #118: energy radiosity must use 10 log₁₀ on ISO 9613-1 dB/m SPL.
 */
import { airAttenuation, airAttenuationEnergy, airAbsDbToEnergyNepers } from "../air-attenuation";

describe("Issue #118: air attenuation on energy", () => {
  test("1 kHz, 10 m: energy factor is 10^(-α_dB * 10 / 10)", () => {
    const dbPerM = airAttenuation([1000], 20)[0];
    const factor = airAttenuationEnergy(dbPerM, 10);
    expect(factor).toBeCloseTo(10 ** ((-dbPerM * 10) / 10), 12);
    const pressureFactor = Math.exp(-(dbPerM / (20 / Math.LN10)) * 10);
    expect(factor).toBeCloseTo(pressureFactor * pressureFactor, 10);
  });

  test("energy nepers are twice the pressure nepers", () => {
    const db = 0.05;
    expect(airAbsDbToEnergyNepers(db)).toBeCloseTo(2 * (db / (20 / Math.LN10)), 12);
  });

  test("8 kHz energy decays faster than 125 Hz over the same path", () => {
    const r = 20;
    const low = airAttenuationEnergy(airAttenuation([125], 20)[0], r);
    const high = airAttenuationEnergy(airAttenuation([8000], 20)[0], r);
    expect(high).toBeLessThan(low);
    expect(high / low).toBeLessThan(0.75);
  });
});

describe("Issue #118: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const art = fs.readFileSync(path.resolve(__dirname, "../../radiance/art.ts"), "utf8");
  const direct = fs.readFileSync(path.resolve(__dirname, "../../radiance/direct-path.ts"), "utf8");

  test("ART does not convert ISO dB with the pressure /20 factor", () => {
    expect(art).toMatch(/airAbsDbToEnergyNepers/);
    expect(art).not.toMatch(/airAbsDb \/ \(20 \/ Math\.LN10\)/);
    expect(direct).toMatch(/airAttenuationEnergy/);
    expect(direct).not.toMatch(/20 \/ Math\.LN10/);
  });
});
