/**
 * Issue #125: calculateLTP must not re-enter when validRayPaths is [].
 */
import { shouldRebuildImageSourceTree } from "../selection";

describe("Issue #125: LTP rebuild guard", () => {
  test("null paths mean the tree has never run", () => {
    expect(shouldRebuildImageSourceTree(null)).toBe(true);
  });

  test("empty paths mean it ran and nothing was valid — do not rebuild", () => {
    expect(shouldRebuildImageSourceTree([])).toBe(false);
  });

  test("a non-empty list is already computed", () => {
    expect(shouldRebuildImageSourceTree([{}])).toBe(false);
  });
});

describe("Issue #125: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("calculateLTP rebuilds only when validRayPaths is null", () => {
    expect(source).toMatch(/shouldRebuildImageSourceTree\(this\.validRayPaths\)/);
    expect(source).not.toMatch(/!this\.validRayPaths \|\| this\.validRayPaths\.length === 0/);
  });
});
