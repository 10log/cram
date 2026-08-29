/**
 * Issue #131: RayPath.time is stamped when stored; IR can target any receiver.
 */
import { resolveReceiverId, stampRayPathTiming } from "../path-timing";

describe("Issue #131: stampRayPathTiming", () => {
  test("time is distance/c before stop()", () => {
    const path = stampRayPathTiming(
      { chain: [{ distance: 343 }, { distance: 343 }] },
      343,
    );
    expect(path.totalLength).toBe(686);
    expect(path.time).toBeCloseTo(2, 10);
  });

  test("missing time is not left undefined", () => {
    const path = stampRayPathTiming({ chain: [{ distance: 1 }] }, 340);
    expect(path.time).toBeCloseTo(1 / 340, 10);
  });
});

describe("Issue #131: resolveReceiverId", () => {
  const paths = { A: [1], B: [1, 2] };

  test("defaults to the first assigned receiver", () => {
    expect(resolveReceiverId(["A", "B"], paths)).toBe("A");
  });

  test("can target receiver B", () => {
    expect(resolveReceiverId(["A", "B"], paths, "B")).toBe("B");
  });

  test("throws when that receiver has no paths", () => {
    expect(() => resolveReceiverId(["A", "B"], { A: [1] }, "B")).toThrow(/No rays/);
  });
});

describe("Issue #131: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("paths are stamped on store; IR methods take receiverId", () => {
    expect(source).toMatch(/stampRayPathTiming\(path, this\.c/);
    expect(source).toMatch(/calculateImpulseResponse\([^)]*receiverId/);
    expect(source).toMatch(/calculateAmbisonicImpulseResponse\([\s\S]*receiverId/);
  });
});
