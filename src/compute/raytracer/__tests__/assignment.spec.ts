/**
 * Issue #135: findIDs must not discover every source/receiver in the project.
 */
import { idsOfKind, keepAssignedIds } from "../assignment";
import { resolveRoomID } from "../image-source/selection";

describe("Issue #135: assigned IDs", () => {
  test("a source not in the matrix is dropped", () => {
    expect(keepAssignedIds(["a"], ["a", "b"])).toEqual(["a"]);
    expect(keepAssignedIds(["a"], ["b"])).toEqual([]);
  });

  test("two rooms: selected roomID is kept, Object.keys order is not", () => {
    expect(resolveRoomID("room-b", ["room-a", "room-b"])).toBe("room-b");
    expect(resolveRoomID("gone", ["room-a", "room-b"])).toBe("room-a");
  });

  test("idsOfKind lists only that kind", () => {
    const containers = {
      a: { kind: "source" },
      b: { kind: "receiver" },
      c: { kind: "room" },
    };
    expect(idsOfKind(containers, "source")).toEqual(["a"]);
  });
});

describe("Issue #135: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("findIDs prunes assigned lists and save() keeps them", () => {
    expect(source).toMatch(/keepAssignedIds\(this\.sourceIDs/);
    expect(source).toMatch(/keepAssignedIds\(this\.receiverIDs/);
    expect(source).toMatch(/resolveRoomID\(this\.roomID/);
    expect(source).not.toMatch(/this\.sourceIDs = \[\];/);
    expect(source).toMatch(/sourceIDs,/);
    expect(source).toMatch(/receiverIDs,/);
    expect(source).toMatch(/roomID,/);
  });
});
