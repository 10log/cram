/**
 * Issue #110: vacated / removed source cells must match field rest.
 * Rest pressure is 127.5, rest velocity is 0. Pressure 0 is a −127.5 spike.
 */
import {
  REST_PRESSURE,
  REST_VELOCITY,
  SOURCE_ALPHA,
  FIELD_ALPHA,
  PRESSURE_DISPLAY_SCALE,
  encodePressure,
  restFieldPixel,
  dirichletSourcePixel,
  vacatedSourcePixel,
  writeFieldPixel,
} from "../field-encoding";

describe("Issue #110: FDTD 2D source rest state", () => {
  test("clear() / fillTexture rest is (127.5, 0)", () => {
    const rest = restFieldPixel();
    expect(rest.pressure).toBe(REST_PRESSURE);
    expect(rest.velocity).toBe(REST_VELOCITY);
    expect(rest.pressure).toBe(127.5);
    expect(rest.velocity).toBe(0);
    expect(rest.alpha).toBe(FIELD_ALPHA);
  });

  test("a vacated source cell is identical to a never-driven cell", () => {
    expect(vacatedSourcePixel()).toEqual(restFieldPixel());
  });

  test("a source at rest (value = 0) writes rest pressure and rest velocity", () => {
    const pixel = dirichletSourcePixel(0);
    expect(pixel.pressure).toBe(REST_PRESSURE);
    expect(pixel.velocity).toBe(REST_VELOCITY);
    expect(pixel.alpha).toBe(SOURCE_ALPHA);
  });

  test("oscillator amplitude 1 is a small perturbation, not ~50% of the display", () => {
    const delta = Math.abs(encodePressure(1) - REST_PRESSURE);
    expect(delta).toBe(PRESSURE_DISPLAY_SCALE);
    expect(delta).toBeLessThan(127.5 * 0.1);
    // Old map(value, -2, 2, 0, 255) put amplitude 1 at 191.25 — half the 0–255 span from rest.
    expect(delta).toBeLessThan(Math.abs(191.25 - 127.5) / 2);
  });

  test("writeFieldPixel does not touch the wall channel (index + 2)", () => {
    const pixels = [9, 9, 0.42, 9];
    writeFieldPixel(pixels, 0, vacatedSourcePixel());
    expect(pixels[0]).toBe(REST_PRESSURE);
    expect(pixels[1]).toBe(REST_VELOCITY);
    expect(pixels[2]).toBe(0.42);
    expect(pixels[3]).toBe(FIELD_ALPHA);
  });
});

describe("Issue #110: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("index.ts uses field-encoding helpers instead of raw 0 on vacate", () => {
    expect(source).toMatch(/from ["']\.\/field-encoding["']/);
    expect(source).toMatch(/vacatedSourcePixel/);
    expect(source).toMatch(/dirichletSourcePixel/);
    expect(source).toMatch(/writeFieldPixel/);
  });

  test("the old vacate write of pressure = 0 is gone", () => {
    expect(source).not.toMatch(/pixels\[previndex \+ 0\] = 0/);
  });

  test("removeSource vacates the cell instead of leaving Dirichlet alpha = 0", () => {
    const section = source.match(/removeSource\([\s\S]*?\n  \}/);
    expect(section).not.toBeNull();
    expect(section![0]).toMatch(/vacateSourceCell/);
  });
});
