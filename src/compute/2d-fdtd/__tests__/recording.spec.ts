/**
 * Issue #112: recordings must be indexed by dt, not display frames.
 */
import {
  MAX_RECORD_PASSES,
  sampleRateFromDt,
  passesForElapsed,
  formatSampleText,
  encodeWavPcm16,
  countZeroCrossings,
} from "../recording";

describe("Issue #112: FDTD record vs display", () => {
  const dt = 10 / 256 / 340.29 / Math.SQRT2;

  test("1 s of Record schedules ~1/dt steps, not ~60 display frames", () => {
    const recordPasses = passesForElapsed({
      wallDt: 1,
      dt,
      displayPasses: 1,
      recording: true,
      cap: 1e9,
    });
    expect(recordPasses).toBeCloseTo(1 / dt, 0);
    expect(recordPasses).toBeGreaterThan(10_000);
    expect(passesForElapsed({ wallDt: 1, dt, displayPasses: 1, recording: false })).toBe(1);
  });

  test("a 16 ms display frame while recording is ~wallDt/dt passes, capped", () => {
    const uncapped = passesForElapsed({
      wallDt: 1 / 60,
      dt,
      displayPasses: 1,
      recording: true,
      cap: 1e9,
    });
    expect(uncapped).toBeGreaterThan(100);
    expect(uncapped).toBeLessThan(400);
    expect(
      passesForElapsed({ wallDt: 1, dt, displayPasses: 1, recording: true, cap: MAX_RECORD_PASSES }),
    ).toBe(MAX_RECORD_PASSES);
  });

  test("exported text has a sample-rate header", () => {
    const text = formatSampleText([0.1, -0.2], 12345);
    expect(text.startsWith("# sampleRate=12345\n")).toBe(true);
  });

  test("WAV header carries the FDTD sample rate", () => {
    const rate = Math.round(sampleRateFromDt(dt));
    const buf = encodeWavPcm16([0, 0.5, -0.5], rate);
    const view = new DataView(buf);
    expect(String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))).toBe("RIFF");
    expect(view.getUint32(24, true)).toBe(rate);
    expect(view.getUint16(22, true)).toBe(1);
  });

  test("100 Hz oscillator yields ~100 cycles in 1 s of sim, independent of fps", () => {
    const freq = 100;
    const simTime = 1;
    const samples = [];
    for (let t = 0; t < simTime; t += dt) {
      samples.push(Math.sin(2 * Math.PI * freq * t));
    }
    const cycles = countZeroCrossings(samples) / 2;
    expect(cycles).toBeGreaterThan(99);
    expect(cycles).toBeLessThan(101);
    expect(samples.length).toBeCloseTo(sampleRateFromDt(dt), 0);
  });
});

describe("Issue #112: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const index = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");
  const tab = fs.readFileSync(
    path.resolve(__dirname, "../../../components/parameter-config/FDTD_2DTab.tsx"),
    "utf8",
  );

  test("render() uses passesForElapsed instead of only numPasses", () => {
    expect(index).toMatch(/passesForElapsed/);
    expect(index).toMatch(/lastTickMs/);
  });

  test("UI shows simulated seconds", () => {
    expect(tab).toMatch(/Simulat/);
    expect(tab).toMatch(/solver\.time/);
  });
});
