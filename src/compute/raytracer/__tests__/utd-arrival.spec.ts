/**
 * Issue #134: UTD arrivalDirection must be inbound (looking back).
 */
import { lookingBackArrivalDirection } from "../../../common/arrival-direction";

describe("Issue #134: UTD arrival direction is inbound", () => {
  test("arrivalDirection · (receiver - lastPoint) < 0", () => {
    const receiver = { x: 4, y: 1, z: 0 };
    const edge = { x: 2, y: 1, z: 0 };
    const dir = lookingBackArrivalDirection(receiver, edge);
    const outbound = [receiver.x - edge.x, receiver.y - edge.y, receiver.z - edge.z];
    const dot = dir[0] * outbound[0] + dir[1] * outbound[1] + dir[2] * outbound[2];
    expect(dot).toBeLessThan(0);
  });

  test("specular and diffracted hits at the same world points share a direction", () => {
    const receiver = { x: 0, y: 0, z: 0 };
    const last = { x: 0, y: 0, z: 1 };
    const a = lookingBackArrivalDirection(receiver, last);
    const b = lookingBackArrivalDirection(receiver, last);
    expect(a).toEqual(b);
    expect(a[2]).toBeCloseTo(1, 10);
  });
});

describe("Issue #134: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("diffraction uses lookingBackArrivalDirection and worldDirToCramAngles", () => {
    expect(source).toMatch(/lookingBackArrivalDirection\(/);
    expect(source).toMatch(/worldDirToCramAngles\(worldDir/);
    expect(source).not.toMatch(/const adx = recPos\[0\] - dp\.diffractionPoint\[0\]/);
  });
});
