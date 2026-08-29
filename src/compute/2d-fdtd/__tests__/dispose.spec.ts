/**
 * Issue #113: dispose leaked the edit mesh, GPU targets, and fdtd2drunning.
 */
import { disposeGpuCompute } from "../dispose-gpu";

describe("Issue #113: FDTD_2D.dispose", () => {
  const fs = require("fs");
  const path = require("path");
  const source = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  function method(name: string): string {
    const match = source.match(new RegExp(`${name}\\([^)]*\\)\\s*\\{[\\s\\S]*?^\\s{2}\\}`, "m"));
    expect(match).not.toBeNull();
    return match![0];
  }

  test("dispose stops the solver so fdtd2drunning is cleared", () => {
    expect(method("dispose")).toMatch(/this\.stop\(\)/);
  });

  test("dispose removes and disposes the edit mesh", () => {
    const body = method("dispose");
    expect(body).toMatch(/editMesh/);
    expect(body).toMatch(/fdtdItems\.remove\(this\.editMesh\)/);
    expect(body).toMatch(/editMesh\.geometry\.dispose/);
  });

  test("disposeGpu frees the water mesh, sourcemap, readback RT, and GPU targets", () => {
    const body = method("disposeGpu");
    expect(body).toMatch(/fdtdItems\.remove\(this\.mesh\)/);
    expect(body).toMatch(/sourcemap\?\.dispose/);
    expect(body).toMatch(/readLevelRenderTarget\?\.dispose/);
    expect(body).toMatch(/disposeGpuCompute/);
  });

  test("init uses disposeGpu so a size rebuild does not drop messenger subscriptions", () => {
    const body = method("init");
    expect(body).toMatch(/this\.disposeGpu\(\)/);
    expect(body).not.toMatch(/this\.dispose\(\)/);
    expect(body).not.toMatch(/RENDERER_UPDATED/);
  });

  test("dispose clears RENDERER_UPDATED listeners", () => {
    const body = method("dispose");
    expect(body).toMatch(/eventListeners = \[\]/);
  });
});

describe("disposeGpuCompute", () => {
  test("disposes every variable render target and material", () => {
    const calls: string[] = [];
    disposeGpuCompute({
      variables: [
        {
          renderTargets: [
            { dispose: () => calls.push("rt0") },
            { dispose: () => calls.push("rt1") },
          ],
          material: { dispose: () => calls.push("mat") },
        },
      ],
      dispose: () => calls.push("gpu"),
    });
    expect(calls).toEqual(["rt0", "rt1", "mat", "gpu"]);
  });

  test("is a no-op on missing gpu", () => {
    expect(() => disposeGpuCompute(undefined)).not.toThrow();
  });
});
