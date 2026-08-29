/**
 * Issue #109: FDTD 2D must simulate the XZ floor plan of a Y-up room,
 * not the XY vertical slab inherited from the water-demo heightmap.
 */
import {
  inferSlice,
  worldToPlane,
  planeSeparation,
  domainFromBox,
  applySliceTransform,
} from "../slice";

describe("Issue #109: FDTD 2D slice mapping", () => {
  const source = { x: 2, y: 1.2, z: 4 };
  const receiver = { x: 6, y: 1.2, z: 4 };

  test("floor-plan source and receiver 4 m apart in Z stay 4 m apart on the xz grid", () => {
    expect(planeSeparation(source, receiver, "xz")).toBeCloseTo(4, 6);
    expect(worldToPlane(source, "xz")).toEqual({ u: 2, v: 4 });
    expect(worldToPlane(receiver, "xz")).toEqual({ u: 6, v: 4 });
  });

  test("the old xy mapping collapses that pair onto the same cell in V", () => {
    expect(worldToPlane(source, "xy").v).toBeCloseTo(worldToPlane(receiver, "xy").v, 6);
    expect(planeSeparation(source, receiver, "xy")).toBeCloseTo(4, 6); // still 4 m in X
    expect(worldToPlane(source, "xy")).toEqual({ u: 2, v: 1.2 });
  });

  test("a shoebox floor AABB infers xz, not xy", () => {
    expect(inferSlice({ dx: 10, dy: 3, dz: 8 })).toBe("xz");
    const domain = domainFromBox({
      min: { x: 0, y: 0, z: 0 },
      max: { x: 10, y: 3, z: 8 },
    });
    expect(domain.slice).toBe("xz");
    expect(domain.width).toBeCloseTo(10, 6);
    expect(domain.height).toBeCloseTo(8, 6);
    expect(domain.offsetX).toBeCloseTo(0, 6);
    expect(domain.offsetY).toBeCloseTo(0, 6);
    expect(domain.sliceHeight).toBeCloseTo(0, 6);
  });

  test("an XY sketch plane infers xy so existing sketch scenes keep working", () => {
    expect(inferSlice({ dx: 12, dy: 9, dz: 0.02 })).toBe("xy");
    const domain = domainFromBox({
      min: { x: 1, y: 2, z: 0 },
      max: { x: 13, y: 11, z: 0.02 },
    });
    expect(domain.slice).toBe("xy");
    expect(domain.width).toBeCloseTo(12, 6);
    expect(domain.height).toBeCloseTo(9, 6);
    expect(domain.offsetX).toBeCloseTo(1, 6);
    expect(domain.offsetY).toBeCloseTo(2, 6);
  });

  test("explicit slice overrides inference", () => {
    const domain = domainFromBox(
      { min: { x: 0, y: 0, z: 0 }, max: { x: 10, y: 3, z: 8 } },
      "xy",
    );
    expect(domain.slice).toBe("xy");
    expect(domain.height).toBeCloseTo(3, 6);
  });

  test("floor edges project onto XZ, not a line at Y = 0", () => {
    const a = { x: 0, y: 0, z: 0 };
    const b = { x: 0, y: 0, z: 8 };
    expect(planeSeparation(a, b, "xz")).toBeCloseTo(8, 6);
    expect(planeSeparation(a, b, "xy")).toBeCloseTo(0, 6);
  });

  test("xz display plane is rotated onto the floor", () => {
    const calls: string[] = [];
    const geom = {
      rotateX: (r: number) => calls.push(`rotateX:${r.toFixed(4)}`),
      translate: (x: number, y: number, z: number) => calls.push(`translate:${x},${y},${z}`),
    };
    applySliceTransform(geom, {
      slice: "xz",
      width: 10,
      height: 8,
      offsetX: 1,
      offsetY: 2,
      sliceHeight: 0.05,
    });
    expect(calls[0]).toBe(`rotateX:${(Math.PI / 2).toFixed(4)}`);
    expect(calls).toContain("translate:5,0.05,4");
    expect(calls).toContain("translate:1,0,2");
  });

  test("xy display plane keeps the original XY translation", () => {
    const calls: string[] = [];
    const geom = {
      rotateX: () => calls.push("rotateX"),
      translate: (x: number, y: number, z: number) => calls.push(`translate:${x},${y},${z}`),
    };
    applySliceTransform(geom, {
      slice: "xy",
      width: 10,
      height: 8,
      offsetX: 1,
      offsetY: 2,
      sliceHeight: 0,
    });
    expect(calls).toEqual(["translate:5,4,0", "translate:1,2,0"]);
  });
});

describe("Issue #109: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("index.ts imports the slice helper and stores a slice", () => {
    expect(source).toMatch(/from ["']\.\/slice["']/);
    expect(source).toMatch(/this\.slice/);
  });

  test("source and receiver sampling go through worldToPlane, not raw .y", () => {
    expect(source).toMatch(/worldToPlane\(/);
    expect(source).not.toMatch(/sources\[.*\]\.y - this\.offsetY/);
    expect(source).not.toMatch(/receivers\[.*\]\.position\.y - this\.offsetY/);
  });

  test("surface edges use world-space vertices, not local getY only", () => {
    expect(source).toMatch(/addWallsFromSurfaceEdges/);
    expect(source).toMatch(/matrixWorld/);
  });
});
