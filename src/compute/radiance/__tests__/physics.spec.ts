/**
 * Issue #121: Phase 8 physics tests — tessellation, conservation, Sabine, reciprocity.
 */
import { Vector3 } from "three";
import { BRDF } from "../brdf";
import { DirectionalResponse } from "../directional-response";
import {
  buildPatchesFromTriangles,
  faceInterior,
  type PatchSet,
} from "../patch";
import {
  shootFromPatch,
  injectSourceEnergy,
  gatherAtReceiver,
  totalUnshotEnergy,
  selectShootingPatch,
  type ShootingContext,
} from "../form-factor";

function quad(
  a: Vector3,
  b: Vector3,
  c: Vector3,
  d: Vector3,
  absorption: (f: number) => number,
  scattering: (f: number) => number,
) {
  return [
    { a: a.clone(), b: b.clone(), c: c.clone(), absorption, scattering },
    { a: a.clone(), b: c.clone(), c: d.clone(), absorption, scattering },
  ];
}

/** Axis-aligned box [0,lx]×[0,ly]×[0,lz]. */
function shoebox(
  lx: number,
  ly: number,
  lz: number,
  absorption: (f: number) => number = () => 0,
  scattering: (f: number) => number = () => 1,
): PatchSet {
  const p = (x: number, y: number, z: number) => new Vector3(x, y, z);
  const tris = [
    ...quad(p(0, 0, 0), p(lx, 0, 0), p(lx, 0, lz), p(0, 0, lz), absorption, scattering),
    ...quad(p(0, ly, 0), p(0, ly, lz), p(lx, ly, lz), p(lx, ly, 0), absorption, scattering),
    ...quad(p(0, 0, 0), p(0, 0, lz), p(0, ly, lz), p(0, ly, 0), absorption, scattering),
    ...quad(p(lx, 0, 0), p(lx, ly, 0), p(lx, ly, lz), p(lx, 0, lz), absorption, scattering),
    ...quad(p(0, 0, 0), p(0, ly, 0), p(lx, ly, 0), p(lx, 0, 0), absorption, scattering),
    ...quad(p(0, 0, lz), p(lx, 0, lz), p(lx, ly, lz), p(0, ly, lz), absorption, scattering),
  ];
  return buildPatchesFromTriangles(tris, new Vector3(lx / 2, ly / 2, lz / 2));
}

function makeCtx(
  patchSet: PatchSet,
  opts: { alpha: number; scatter: number; rays?: number; air?: number; rate?: number },
): ShootingContext {
  const brdf = new BRDF(0);
  const n = patchSet.patches.length;
  const len = 2000;
  const unshotEnergy = Array.from({ length: n }, () => new DirectionalResponse(brdf.nSlots, len));
  const totalEnergy = Array.from({ length: n }, () => new DirectionalResponse(brdf.nSlots, len));
  const absorptions = patchSet.patches.map((p) => p.absorption(1000));
  const scatterings = patchSet.patches.map((p) => p.scattering(1000));
  return {
    patchSet,
    unshotEnergy,
    totalEnergy,
    brdf,
    absorptions,
    scatterings,
    airAbsNepers: opts.air ?? 0,
    speedOfSound: 343.2,
    sampleRate: opts.rate ?? 1000,
    raysPerShoot: opts.rays ?? 200,
  };
}

describe("Issue #121: faceInterior", () => {
  test("flips a normal that points away from the room center", () => {
    const n = new Vector3(0, -1, 0);
    faceInterior(n, new Vector3(2, 0, 2), new Vector3(2, 1.5, 2));
    expect(n.y).toBeGreaterThan(0);
  });
});

describe("Issue #121: shoebox tessellation", () => {
  const Lx = 4;
  const Ly = 3;
  const Lz = 2.5;
  const patches = shoebox(Lx, Ly, Lz).patches;
  const interior = new Vector3(Lx / 2, Ly / 2, Lz / 2);
  const S = 2 * (Lx * Ly + Lx * Lz + Ly * Lz);

  test("area covers the six faces", () => {
    const area = patches.reduce((a, p) => a + p.area, 0);
    expect(area).toBeCloseTo(S, 6);
  });

  test("every normal points toward the room centroid", () => {
    for (const p of patches) {
      const toCenter = interior.clone().sub(p.centroid);
      expect(p.normal.dot(toCenter)).toBeGreaterThan(0);
    }
  });
});

describe("Issue #121: one-bounce energy", () => {
  test("α=0: most unshot energy survives a shoot (misses allowed)", () => {
    const patchSet = shoebox(4, 3, 2.5, () => 0, () => 1);
    const ctx = makeCtx(patchSet, { alpha: 0, scatter: 1, rays: 300 });
    for (let k = 0; k < ctx.brdf.nSlots; k++) {
      ctx.unshotEnergy[0].responses[k].buffer[0] = 1;
    }
    const before = totalUnshotEnergy(ctx.unshotEnergy);
    shootFromPatch(ctx, 0);
    const after = totalUnshotEnergy(ctx.unshotEnergy);
    expect(after).toBeGreaterThan(0.2 * before);
    expect(after).toBeLessThanOrEqual(before + 1e-9);
  });

  test("α=1: a shoot deposits ~0 and gather stays empty", () => {
    const patchSet = shoebox(4, 3, 2.5, () => 1, () => 1);
    const ctx = makeCtx(patchSet, { alpha: 1, scatter: 1, rays: 80 });
    ctx.unshotEnergy[0].responses[0].buffer[0] = 10;
    shootFromPatch(ctx, 0);
    expect(totalUnshotEnergy(ctx.unshotEnergy)).toBeLessThan(1e-8);
    const ir = gatherAtReceiver(new Vector3(2, 1.5, 1.25), ctx);
    const sum = ir.buffer.reduce((a, b) => a + Math.abs(b), 0);
    expect(sum).toBeLessThan(1e-8);
  });
});

describe("Issue #121: Sabine ballpark", () => {
  test("empty box α=0.2: Sabine formula holds and the gather decays", () => {
    const Lx = 4;
    const Ly = 3;
    const Lz = 2.5;
    const V = Lx * Ly * Lz;
    const S = 2 * (Lx * Ly + Lx * Lz + Ly * Lz);
    const alpha = 0.2;
    const sabine = (0.161 * V) / (alpha * S);
    const patchSet = shoebox(Lx, Ly, Lz, () => alpha, () => 1);
    const ctx = makeCtx(patchSet, { alpha, scatter: 1, rays: 80, rate: 500 });
    injectSourceEnergy(new Vector3(1.2, 1.2, 0.8), 1, ctx, 200);
    for (let i = 0; i < 40; i++) {
      const idx = selectShootingPatch(ctx.unshotEnergy);
      if (ctx.unshotEnergy[idx].sum() < 1e-12) break;
      shootFromPatch(ctx, idx);
    }
    const ir = gatherAtReceiver(new Vector3(2.8, 1.4, 1.6), ctx);
    const mid = Math.floor(ir.buffer.length / 4);
    const early = ir.buffer.slice(0, mid).reduce((s, x) => s + x, 0);
    const late = ir.buffer.slice(-mid).reduce((s, x) => s + x, 0);
    expect(sabine).toBeCloseTo(0.41, 1);
    expect(early).toBeGreaterThan(0);
    expect(early).toBeGreaterThan(late);
  });
});

describe("Issue #121: reciprocity of energy integrals", () => {
  test("swap source and receiver, unnormalized integrals stay in the same decade", () => {
    const patchSet = shoebox(4, 3, 2.5, () => 0.15, () => 1);
    const A = new Vector3(1, 1.2, 0.8);
    const B = new Vector3(3, 1.6, 1.7);

    function integral(from: Vector3, to: Vector3): number {
      const ctx = makeCtx(patchSet, { alpha: 0.15, scatter: 1, rays: 60, rate: 500 });
      injectSourceEnergy(from, 1, ctx, 150);
      for (let i = 0; i < 25; i++) {
        const idx = selectShootingPatch(ctx.unshotEnergy);
        if (ctx.unshotEnergy[idx].sum() < 1e-12) break;
        shootFromPatch(ctx, idx);
      }
      const ir = gatherAtReceiver(to, ctx);
      return ir.buffer.reduce((s, x) => s + x, 0);
    }

    const ab = integral(A, B);
    const ba = integral(B, A);
    expect(ab).toBeGreaterThan(0);
    expect(ba).toBeGreaterThan(0);
    const ratio = ab > ba ? ab / ba : ba / ab;
    expect(ratio).toBeLessThan(20);
  });
});
