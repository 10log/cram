/**
 * Issue #108: BeamTraceSolver split along raytracer module boundaries.
 */
import * as fs from "fs";
import * as path from "path";

describe("Issue #108: BeamTraceSolver module split", () => {
  const dir = path.resolve(__dirname, "..");
  const index = fs.readFileSync(path.join(dir, "index.ts"), "utf-8");

  test("index.ts stays a façade (solver class + thin wrappers)", () => {
    const lines = index.split("\n").length;
    // calculate() / save / restore / property accessors stay on the class.
    // Event table lives in events.ts. Target from #108 is "roughly < 800".
    expect(lines).toBeLessThan(900);
  });

  test("calculateArrivalPressure is imported from arrival-pressure.ts, not inlined", () => {
    expect(index).toContain('from "./arrival-pressure"');
    expect(index).toMatch(/return calculateArrivalPressure\(/);
    // Thin wrapper may remain so the class can pass source/surface context.
    expect(index).not.toMatch(/intensities\[f\] \*= spreadingFactor/);
  });

  test("arrival-pressure.ts has no renderer / messenger / store imports", () => {
    const energy = fs.readFileSync(path.join(dir, "arrival-pressure.ts"), "utf-8");
    expect(energy).not.toMatch(/from ["'].*render\/renderer["']/);
    expect(energy).not.toMatch(/from ["'].*messenger["']/);
    expect(energy).not.toMatch(/from ["'].*store["']/);
    expect(energy).toContain("export function calculateArrivalPressure");
  });

  test("split modules exist for paths, diffraction, visualization, IR, geometry", () => {
    for (const name of ["paths.ts", "diffraction.ts", "visualization.ts", "impulse-response.ts", "geometry.ts"]) {
      expect(fs.existsSync(path.join(dir, name))).toBe(true);
    }
    expect(index).toContain('from "./paths"');
    expect(index).toContain('from "./diffraction"');
    expect(index).toContain('from "./visualization"');
    expect(index).toContain('from "./impulse-response"');
    expect(index).toContain('from "./geometry"');
  });
});
