/**
 * Issue #127: isInFrontOf culls reflectors behind the previous plane.
 */
import { Vector3 } from "three";
import { pointInFrontOfPlane } from "../reflection-geometry";

describe("Issue #127: pointInFrontOfPlane", () => {
  const p0 = new Vector3(0, 0, 0);
  const n = new Vector3(1, 0, 0);

  test("a point in front of the plane is kept", () => {
    expect(pointInFrontOfPlane(new Vector3(2, 0, 0), p0, n)).toBe(true);
  });

  test("a point behind the plane is rejected", () => {
    expect(pointInFrontOfPlane(new Vector3(-2, 0, 0), p0, n)).toBe(false);
  });

  test("a coplanar point is kept", () => {
    expect(pointInFrontOfPlane(new Vector3(0, 1, 0), p0, n)).toBe(true);
  });

  test("L-room missing corner sits behind the inner wall", () => {
    // Inner L wall at x=2 facing +x (into the remaining room).
    // The missing-corner facade at x=0 is behind that wall.
    const inner = new Vector3(2, 0, 0);
    const innerN = new Vector3(1, 0, 0);
    expect(pointInFrontOfPlane(new Vector3(3, 1, 0), inner, innerN)).toBe(true);
    expect(pointInFrontOfPlane(new Vector3(0, 1, 0), inner, innerN)).toBe(false);
  });
});

describe("Issue #127: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("isInFrontOf is called; the inFrontOf = true stub is gone", () => {
    expect(source).toMatch(/isInFrontOf\(reflectors\[i\], is\.reflector\)/);
    expect(source).not.toMatch(/let inFrontOf:\s*boolean\s*=\s*true/);
    expect(source).toMatch(/pointInFrontOfPlane/);
  });
});
