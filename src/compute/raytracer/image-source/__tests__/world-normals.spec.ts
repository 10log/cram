/**
 * Issue #126: image construction and incidence use world normals.
 */
import { Matrix4, Vector3 } from "three";
import { reflectionCoefficient } from "../../../acoustics/reflection-coefficient";
import {
  incidenceAngle,
  reflectPointAcrossPlane,
  worldSurfaceNormal,
} from "../reflection-geometry";

describe("Issue #126: reflectPointAcrossPlane in world frame", () => {
  test("image of (0,1,0) across y=0 is (0,-1,0)", () => {
    const p = reflectPointAcrossPlane(
      new Vector3(0, 1, 0),
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
    );
    expect(p.x).toBeCloseTo(0, 10);
    expect(p.y).toBeCloseTo(-1, 10);
    expect(p.z).toBeCloseTo(0, 10);
  });

  test("translated plane y=2 mirrors (0,3,0) to (0,1,0)", () => {
    const p = reflectPointAcrossPlane(
      new Vector3(0, 3, 0),
      new Vector3(0, 2, 0),
      new Vector3(0, 1, 0),
    );
    expect(p.y).toBeCloseTo(1, 10);
  });

  test("rotated local +Z becomes world +Y and still mirrors across y=0", () => {
    const local = new Vector3(0, 0, 1);
    const rot = new Matrix4().makeRotationX(-Math.PI / 2);
    const world = worldSurfaceNormal(local, rot);
    expect(world.y).toBeCloseTo(1, 6);
    const p = reflectPointAcrossPlane(new Vector3(0, 1, 0), new Vector3(0, 0, 0), world);
    expect(p.y).toBeCloseTo(-1, 6);
  });
});

describe("Issue #126: incidence angle", () => {
  test("front-face normal incidence is 0, 45° hit is π/4, folded into [0, π/2]", () => {
    expect(incidenceAngle(new Vector3(0, -1, 0), new Vector3(0, 1, 0))).toBeCloseTo(0, 10);
    expect(
      incidenceAngle(new Vector3(1, -1, 0).normalize(), new Vector3(0, 1, 0)),
    ).toBeCloseTo(Math.PI / 4, 6);
    const flipped = incidenceAngle(new Vector3(0, -1, 0), new Vector3(0, -1, 0));
    expect(flipped).toBeGreaterThanOrEqual(0);
    expect(flipped).toBeLessThanOrEqual(Math.PI / 2);
  });

  test("reflectionFunction(f, 0) ≠ reflectionFunction(f, π/2) on a real α", () => {
    expect(reflectionCoefficient(0.4, 0)).not.toBeCloseTo(reflectionCoefficient(0.4, Math.PI / 2), 3);
  });
});

describe("Issue #126: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("face.normal is not used untransformed", () => {
    expect(source).not.toMatch(/face!\.normal/);
    expect(source).toMatch(/hitWorldNormal/);
    expect(source).toMatch(/worldSurfaceNormal/);
    expect(source).toMatch(/reflectPointAcrossPlane/);
  });
});
