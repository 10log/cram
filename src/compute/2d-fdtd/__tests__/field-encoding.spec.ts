/**
 * Issue #110, as #224 left it: a vacated or removed source cell must match a
 * never-driven one. Since #224 the field rests at zero and a source is soft,
 * so "matching" is simply carrying no forcing.
 */
import {
  DISPLAY_HALF_RANGE,
  FIELD_ALPHA,
  PRESSURE_DISPLAY_SCALE,
  REST_PRESSURE,
  REST_VELOCITY,
  restFieldPixel,
  softSourcePixel,
  vacatedSourcePixel,
  writeFieldPixel,
} from "../field-encoding";

describe("FDTD 2D field encoding", () => {
  test("the field rests at zero; the 127.5 lives only in the display (#224)", () => {
    expect(REST_PRESSURE).toBe(0);
    expect(REST_VELOCITY).toBe(0);
    expect(DISPLAY_HALF_RANGE).toBe(127.5);
  });

  test("a vacated source cell is identical to a never-driven cell (#110)", () => {
    expect(vacatedSourcePixel()).toEqual(restFieldPixel());
    expect(restFieldPixel()).toEqual({ forcing: 0, alpha: FIELD_ALPHA });
  });

  test("a soft source is forced by its signal's change, not its value (#224)", () => {
    expect(softSourcePixel(0)).toEqual(restFieldPixel());
    expect(softSourcePixel(0.25).forcing).toBe(0.25 * PRESSURE_DISPLAY_SCALE);
    // No cell is ever overwritten: the alpha is the field's everywhere.
    expect(softSourcePixel(1).alpha).toBe(FIELD_ALPHA);
  });

  test("a non-finite change forces nothing rather than poisoning the field", () => {
    expect(softSourcePixel(NaN).forcing).toBe(0);
    expect(softSourcePixel(Infinity).forcing).toBe(0);
  });

  test("writeFieldPixel touches the forcing and alpha only", () => {
    const pixels = [9, 0.5, 0.42, 9];
    writeFieldPixel(pixels, 0, softSourcePixel(0.5));
    expect(pixels).toEqual([4, 0.5, 0.42, FIELD_ALPHA]);
  });
});

describe("production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const read = (name: string) => fs.readFileSync(path.resolve(__dirname, name), "utf8");
  const index = read("../index.ts");

  test("index.ts forces sources softly and vacates with the shared helpers", () => {
    expect(index).toMatch(/from ["']\.\/field-encoding["']/);
    expect(index).toMatch(/softSourcePixel\(source\.velocity\)/);
    expect(index).toMatch(/vacatedSourcePixel/);
    expect(index).not.toMatch(/dirichletSourcePixel/);
  });

  test("removeSource vacates the cell (#110)", () => {
    const section = index.match(/removeSource\([\s\S]*?\n  \}/);
    expect(section).not.toBeNull();
    expect(section![0]).toMatch(/vacateSourceCell/);
  });

  test("receivers read the zero-centred state in display units", () => {
    expect(index).toContain("level / DISPLAY_HALF_RANGE");
    expect(index).not.toMatch(/level\s*-\s*127\.5/);
  });

  test("the shaders keep no 127.5 in the state, and no Dirichlet overwrite (#224)", () => {
    const height = read("../shaders/height-map.frag");
    expect(height).not.toContain("127.5");
    expect(height).not.toContain("sourcemapValue.a == 0.0");
    expect(height).toContain("newpos = 0.0;");
    // The forcing goes in before any centred or RLC divide, as in stepField.
    const forced = height.indexOf("newvel = med*(mid-pos)+vel*damping+sourcemapValue.r;");
    expect(forced).toBeGreaterThan(0);
    expect(forced).toBeLessThan(height.indexOf("(1.0 + beta)"));
    expect(forced).toBeLessThan(height.indexOf("(1.0 + total)"));
    expect(read("../shaders/clear.frag")).toContain("textureValue.r = 0.0;");
    expect(read("../shaders/water.vert")).not.toContain("127.5");
  });
});
