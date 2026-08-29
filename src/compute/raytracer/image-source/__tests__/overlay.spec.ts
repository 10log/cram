/**
 * Issue #128: per-solver overlay; do not wipe global markup.
 */
import * as THREE from "three";
import { SolverOverlay } from "../overlay";
import { imageSourceArrivalPressure } from "../arrival-pressure";
import { reflectPointAcrossPlane } from "../reflection-geometry";

describe("Issue #128: SolverOverlay is owned per solver", () => {
  test("hiding rays on A leaves B's rays", () => {
    const root = new THREE.Group();
    const a = new SolverOverlay(root);
    const b = new SolverOverlay(root);
    a.addLine([0, 0, 0], [1, 0, 0]);
    a.addPoint([0, 1, 0]);
    b.addLine([0, 0, 0], [0, 1, 0]);
    b.addPoint([1, 1, 0]);
    expect(a.lineCount).toBe(1);
    expect(b.lineCount).toBe(1);
    a.clearLines();
    a.clearPoints();
    expect(a.lineCount).toBe(0);
    expect(a.pointCount).toBe(0);
    expect(b.lineCount).toBe(1);
    expect(b.pointCount).toBe(1);
    expect(root.children).toHaveLength(2);
  });

  test("dispose removes the group from the parent", () => {
    const root = new THREE.Group();
    const overlay = new SolverOverlay(root);
    overlay.addPoint([0, 0, 0]);
    overlay.dispose();
    expect(root.children).toHaveLength(0);
    expect(overlay.pointCount).toBe(0);
  });
});

describe("Issue #128: production wiring + imported helpers", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("solver does not call renderer.markup.clearPoints / clearLines", () => {
    expect(source).not.toMatch(/markup\.clearPoints/);
    expect(source).not.toMatch(/markup\.clearLines/);
    expect(source).toMatch(/overlay\.clearPoints/);
    expect(source).toMatch(/overlay\.clearLines/);
  });

  test("arrivalPressure and reflect helpers are the real functions", () => {
    const p = imageSourceArrivalPressure(
      [100],
      [1000],
      [
        { point: new THREE.Vector3(0, 0, 0), reflectingSurface: null, angle: null },
        { point: new THREE.Vector3(1, 0, 0), reflectingSurface: null, angle: null },
      ],
      20,
    );
    expect(p[0]).toBeGreaterThan(0);
    const mirrored = reflectPointAcrossPlane(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0),
    );
    expect(mirrored.y).toBeCloseTo(-1, 10);
  });
});
