/**
 * Issue #123: honor room/source/receiver/surface IDs; keep the root at order 0.
 */
import { resolveRoomID, selectedReflectors } from "../selection";

describe("Issue #123: assignment", () => {
  test("resolveRoomID keeps an explicit room and falls back to rooms[0]", () => {
    expect(resolveRoomID("room-b", ["room-a", "room-b"])).toBe("room-b");
    expect(resolveRoomID("", ["room-a", "room-b"])).toBe("room-a");
    expect(resolveRoomID(undefined, [])).toBe("");
  });

  test("selectedReflectors uses all surfaces when surfaceIDs is empty", () => {
    const all = [{ uuid: "a" }, { uuid: "b" }];
    expect(selectedReflectors(all, [])).toEqual(all);
    expect(selectedReflectors(all, ["b"]).map((s) => s.uuid)).toEqual(["b"]);
  });
});

describe("Issue #123: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");
  const registry = fs.readFileSync(path.resolve(__dirname, "../../../solver-registry.ts"), "utf8");

  test("constructor does not clobber roomID with rooms[0]", () => {
    expect(source).toMatch(/resolveRoomID/);
    expect(source).not.toMatch(/this\.roomID = rooms\[0\]\.uuid/);
    expect(source).toMatch(/params\.surfaceIDs/);
  });

  test("max order 0 keeps the root image source", () => {
    expect(source).toMatch(/if \(maxOrder === 0\) return is/);
    expect(source).not.toMatch(/if\s*\(\s*maxOrder\s*==\s*0\s*\)\s*\{\s*return null/);
  });

  test("updateImageSourceCalculation loops sources × receivers", () => {
    expect(source).toMatch(/for \(const sourceId of this\.sourceIDs\)/);
    expect(source).toMatch(/for \(const receiverId of this\.receiverIDs\)/);
  });

  test("registry factory passes props through", () => {
    expect(registry).toMatch(/new ImageSourceSolver\(\{ \.\.\.defaults, \.\.\.props \}\)/);
  });
});
