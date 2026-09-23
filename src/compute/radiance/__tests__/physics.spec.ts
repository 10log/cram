/**
 * Issue #121: Phase 8 physics tests — tessellation, conservation, decay, reciprocity.
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
  test("α=0: a shoot conserves energy", () => {
    // This used to read `toBeGreaterThan(0.2 * before)` under the title "misses
    // allowed", and passed while ART was losing 28% of every bounce (#205). In a
    // closed convex box a ray leaving a patch into the interior has nothing to
    // miss, so a 20% floor was the wrong allowance for this fixture and it hid
    // the defect for as long as it existed. Conservation is now exact to
    // rounding, so it is asserted that way.
    const patchSet = shoebox(4, 3, 2.5, () => 0, () => 1);
    const ctx = makeCtx(patchSet, { alpha: 0, scatter: 1, rays: 300 });
    for (let k = 0; k < ctx.brdf.nSlots; k++) {
      ctx.unshotEnergy[0].responses[k].buffer[0] = 1;
    }
    const before = totalUnshotEnergy(ctx.unshotEnergy);
    shootFromPatch(ctx, 0);
    const after = totalUnshotEnergy(ctx.unshotEnergy);
    expect(after / before).toBeGreaterThan(0.999);
    expect(after).toBeLessThanOrEqual(before + 1e-9);
  });

  test("α: a shoot keeps exactly (1 − α) of what it shot", () => {
    // The generalisation, and the one that pins the mechanism: the only loss is
    // the material's. Before #205 this ratio was a flat ~0.72 × (1 − α) at every
    // coefficient, which is what identified the defect as a raw cosine applied
    // as an energy scale rather than as absorption being double-counted.
    for (const alpha of [0, 0.1, 0.2, 0.4]) {
      const patchSet = shoebox(4, 3, 2.5, () => alpha, () => 1);
      const ctx = makeCtx(patchSet, { alpha, scatter: 1, rays: 300 });
      for (let k = 0; k < ctx.brdf.nSlots; k++) {
        ctx.unshotEnergy[0].responses[k].buffer[0] = 1;
      }
      const shot = ctx.unshotEnergy[0].sum();
      shootFromPatch(ctx, 0);
      const survived = totalUnshotEnergy(ctx.unshotEnergy);
      expect(survived / (shot * (1 - alpha))).toBeCloseTo(1, 2);
    }
  }, 60_000);

  test("a one-sided interior baffle loses the energy that lands behind it", () => {
    // What the back-face gate is for, and the only fixture in which it fires at
    // all: instrumented, a closed convex shoebox never reaches it (0 of 12,104
    // arrivals), because `faceInterior` points every wall normal inward and a
    // ray crossing the room always arrives on a front face. Add a free-standing
    // baffle and it fires on 3.5% of arrivals, because that patch has one normal
    // and its other side is simply not modelled.
    //
    // Dropping that energy is deliberate and is the conservative reading: the
    // alternative is depositing it on the lit side, i.e. sound appearing through
    // a solid partition. The loss is the price of not teleporting it, and it is
    // a modelling limitation of one-sided patches rather than a bug — but it
    // must not happen in a sealed room, which is what the pairing asserts.
    const p = (x: number, y: number, z: number) => new Vector3(x, y, z);
    const walls = (lx: number, ly: number, lz: number) => [
      ...quad(p(0, 0, 0), p(lx, 0, 0), p(lx, 0, lz), p(0, 0, lz), () => 0, () => 1),
      ...quad(p(0, ly, 0), p(0, ly, lz), p(lx, ly, lz), p(lx, ly, 0), () => 0, () => 1),
      ...quad(p(0, 0, 0), p(0, 0, lz), p(0, ly, lz), p(0, ly, 0), () => 0, () => 1),
      ...quad(p(lx, 0, 0), p(lx, ly, 0), p(lx, ly, lz), p(lx, 0, lz), () => 0, () => 1),
      ...quad(p(0, 0, 0), p(0, ly, 0), p(lx, ly, 0), p(lx, 0, 0), () => 0, () => 1),
      ...quad(p(0, 0, lz), p(lx, 0, lz), p(lx, ly, lz), p(0, ly, lz), () => 0, () => 1),
    ];

    const retention = (baffled: boolean) => {
      const tris = walls(4, 3, 2.5);
      if (baffled) {
        // Off-centre on purpose. `faceInterior` orients a patch by the sign of
        // `n · (centroid − patchCentroid)`, so a baffle standing *through* the
        // room centroid has that dot product at zero and its normal is decided
        // by a tie-break — which made the first version of this test pass alone
        // and fail in the suite, on nothing but the order `Math.random` was
        // consumed in. At x = 1.2 the room centre is unambiguously on one side.
        tris.push(
          ...quad(
            p(1.2, 0.02, 0.02), p(1.2, 2.98, 0.02), p(1.2, 2.98, 2.48), p(1.2, 0.02, 2.48),
            () => 0, () => 1,
          ),
        );
      }
      const patchSet = buildPatchesFromTriangles(tris, new Vector3(2, 1.5, 1.25));
      const ctx = makeCtx(patchSet, { alpha: 0, scatter: 1, rays: 400 });

      // Shoot from the x = 0 wall, chosen by geometry rather than by index so
      // the fixture survives a change in triangle order. Its rays travel toward
      // +x and meet the baffle from behind, which is the only way to reach the
      // gate in quantity — a shoot from an arbitrary patch produces a handful of
      // back-face arrivals or none, which is what made the first version of this
      // assertion drift around 0.997.
      const shooter = patchSet.patches.findIndex((q) => q.normal.x > 0.99);
      expect(shooter).toBeGreaterThanOrEqual(0);
      for (let k = 0; k < ctx.brdf.nSlots; k++) {
        ctx.unshotEnergy[shooter].responses[k].buffer[0] = 1;
      }
      const shot = ctx.unshotEnergy[shooter].sum();
      shootFromPatch(ctx, shooter);
      return totalUnshotEnergy(ctx.unshotEnergy) / shot;
    };

    expect(retention(false)).toBeGreaterThan(0.999);
    // Measured 0.75-0.80 over four runs, spread 0.045, so both bounds sit at
    // several times the Monte Carlo scatter. The baffle spans nearly the whole
    // y-z cross-section for that reason: a small one produces a handful of
    // back-face arrivals and a retention that wanders around 0.99, where the
    // assertion would be reading noise.
    const baffled = retention(true);
    expect(baffled).toBeLessThan(0.9);
    expect(baffled).toBeGreaterThan(0.5);
  }, 60_000);

  test("a shoot lands no energy back on its own surface", () => {
    // Issue #120's first acceptance criterion, finally written down — and worth
    // reading with its result, because the criterion passes for a reason other
    // than the one #120 assumed.
    //
    // #120 argued that a ray leaving a point *on* the triangle plane would have
    // its coplanar siblings stolen at ~0 distance. It cannot: `localToWorld`
    // maps the sampled direction into the patch normal's hemisphere, so the ray
    // moves away from its own plane and never re-intersects it. Measured, the
    // sibling receives exactly 0 either way — with the along-normal offset and
    // without it.
    //
    // The offset (#207) is kept as a guard for the geometry where the hazard is
    // real: a sample near a shared edge with a *non*-coplanar neighbour, where
    // the neighbour genuinely does sit at ~0 distance. This test holds the
    // property that matters, and would catch a change to the direction sampling
    // that let rays below the horizon through.
    const patchSet = shoebox(4, 3, 2.5, () => 0, () => 1);
    const ctx = makeCtx(patchSet, { alpha: 0, scatter: 1, rays: 400 });
    for (let k = 0; k < ctx.brdf.nSlots; k++) {
      ctx.unshotEnergy[0].responses[k].buffer[0] = 1;
    }
    const shot = ctx.unshotEnergy[0].sum();
    shootFromPatch(ctx, 0);

    // Find the shooter's coplanar siblings by normal rather than by index: in
    // a shoebox every wall normal points inward, so the only patches sharing
    // this one's direction are the other triangles of the same wall. Indices 0
    // and 1 happen to be that pair today, but a change to triangle emission
    // order would silently point the assertion at a different wall.
    const shooterNormal = patchSet.patches[0].normal;
    const siblings = patchSet.patches
      .map((q, i) => [i, q] as const)
      .filter(([i, q]) => i !== 0 && q.normal.dot(shooterNormal) > 0.999)
      .map(([i]) => i);
    expect(siblings.length).toBeGreaterThan(0);
    const leaked = siblings.reduce((sum, i) => sum + ctx.unshotEnergy[i].sum(), 0);
    expect([siblings, leaked / shot < 1e-9]).toEqual([siblings, true]);
    // And the energy did go somewhere: across the room, not nowhere.
    expect(totalUnshotEnergy(ctx.unshotEnergy) / shot).toBeGreaterThan(0.999);
  }, 60_000);

  test("injectSourceEnergy deposits what it is given, less one absorption", () => {
    // ~0.798 of the requested 1.0 before #205, for the same reason: the point
    // source's rays were scaled by the receiving patch's cosine. A ray carries
    // what it carries; the patch's orientation decides how many rays reach it,
    // not how much each one delivers.
    for (const alpha of [0, 0.2, 0.4]) {
      const patchSet = shoebox(4, 3, 2.5, () => alpha, () => 1);
      const ctx = makeCtx(patchSet, { alpha, scatter: 1, rays: 200 });
      injectSourceEnergy(new Vector3(1.2, 1.2, 0.8), 1, ctx, 400);
      expect(totalUnshotEnergy(ctx.unshotEnergy)).toBeCloseTo(1 - alpha, 2);
    }
  }, 60_000);

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

/**
 * Decay time from the Schroeder curve of an **energy** response.
 *
 * ART's gathered buffer already holds energy, so the curve is the running
 * reverse sum of the buffer itself — no squaring — and the level is
 * `10*log10`, not 20. Extrapolated to 60 dB from the span between two levels,
 * which is what T20 and T30 mean.
 *
 * A two-point lookup rather than an ISO 3382-1 least-squares fit, deliberately
 * local to this spec for independence from the code under test. #137 objects to
 * exactly that in the shipped energy-decay code, and when it produces a real
 * fit **this helper and the twin in `ard/__tests__/rt60-cross-check.spec.ts`
 * should move onto it in one pass** — two oracles that define T30 differently
 * would drift, and drift between oracles is worse than a shared approximation.
 * The twin differs only in squaring its input, since ARD's response is pressure
 * where this one is energy.
 */
function decayTime(
  buffer: ArrayLike<number>,
  sampleRate: number,
  fromDb: number,
  toDb: number,
): number {
  const n = buffer.length;
  const edc = new Float64Array(n);
  let acc = 0;
  for (let i = n - 1; i >= 0; i--) {
    acc += buffer[i];
    edc[i] = acc;
  }
  const peak = edc[0];
  if (!(peak > 0)) return NaN;
  const db = (i: number) => 10 * Math.log10(edc[i] / peak);

  let from = -1;
  let to = -1;
  for (let i = 0; i < n; i++) {
    if (from < 0 && db(i) <= fromDb) from = i;
    if (db(i) <= toDb) {
      to = i;
      break;
    }
  }
  if (from < 0 || to < 0 || to <= from) return NaN;
  const slope = (db(to) - db(from)) / ((to - from) / sampleRate);
  return -60 / slope;
}

/**
 * Eyring reverberation time — Sabine's, with the correct log.
 *
 * Eyring rather than Sabine because the two differ by 12% even at α = 0.2 and
 * further as α rises, and #121 asked for a factor-of-2 bound that should not
 * spend a tenth of its budget on picking the looser formula.
 *
 * And a **single number** rather than the bracket
 * `ard/__tests__/rt60-cross-check.spec.ts` needs, which is worth saying because
 * it is a property of ART rather than a simplification: Sabine and Eyring take
 * a random-incidence coefficient, the material database stores a
 * normal-incidence one, and for a locally-reacting surface those differ by
 * nearly a factor of two (Paris). ART's BRDF applies `reflectance = 1 − α` at
 * every angle and never consults `reflectionCoefficient`, so its α *is* the
 * mean absorption Eyring wants and no conversion applies. A wave solver, or the
 * ray tracer under #201, does not get that shortcut.
 */
function eyring(volume: number, surface: number, alpha: number): number {
  return (0.161 * volume) / (-surface * Math.log(1 - alpha));
}

describe("Issue #121: Eyring ballpark", () => {
  const Lx = 4;
  const Ly = 3;
  const Lz = 2.5;
  const V = Lx * Ly * Lz;
  const S = 2 * (Lx * Ly + Lx * Lz + Ly * Lz);
  const alpha = 0.2;

  // One converged run, shared by the three tests below. Shooting a 4 x 3 x 2.5 m
  // shoebox to convergence costs more than vitest's 10 s default, and paying
  // for it three times was the first version of this block.
  let ir: ReturnType<typeof gatherAtReceiver>;

  beforeAll(() => {
    const patchSet = shoebox(Lx, Ly, Lz, () => alpha, () => 1);
    const ctx = makeCtx(patchSet, { alpha, scatter: 1, rays: 80, rate: 1000 });
    injectSourceEnergy(new Vector3(1.2, 1.2, 0.8), 1, ctx, 200);
    const injected = totalUnshotEnergy(ctx.unshotEnergy);
    expect(injected).toBeGreaterThan(0);
    // Terminate on the residual, not on an iteration count, and budget 800.
    // Before #205 the 28% per-bounce loss made 150 shoots look converged; with
    // energy conserved this room needs about 250 at α = 0.2 and 650 at α = 0.1,
    // because the only thing removing energy is now the material. A fixed cap
    // was silently truncating the tail, which flattered the decay — the first
    // version of this test measured T20 = 0.291 against T30 = 0.252, and a
    // Schroeder curve that bends like that is a truncated one, not a room.
    let shoots = 0;
    for (let i = 0; i < 800; i++) {
      const idx = selectShootingPatch(ctx.unshotEnergy);
      if (ctx.unshotEnergy[idx].sum() < 1e-20) break;
      shootFromPatch(ctx, idx);
      shoots++;
      if (totalUnshotEnergy(ctx.unshotEnergy) / injected < 1e-4) break;
    }
    expect(shoots).toBeLessThan(800); // converged rather than ran out of budget
    // Converged, so the tail below is the room's and not the iteration cap's.
    // Measured T30 moves under 2% between 200/150 and 400/250, so the cheaper
    // setting is not costing the answer.
    //
    // Relative to what was injected, not an absolute floor: the injected total
    // depends on α and on the ray count, so an absolute threshold is a
    // different test at every setting and sits one tweak away from flaking.
    expect(totalUnshotEnergy(ctx.unshotEnergy) / injected).toBeLessThan(1e-4);
    ir = gatherAtReceiver(new Vector3(2.8, 1.4, 1.6), ctx);
  }, 120_000);

  test("empty box α=0.2: the gather decays", () => {
    // This assertion is all the block used to make about ART. It is worth
    // keeping — it catches a solver that does not decay at all — but note what
    // it does not do: `sabine` appeared in exactly one assertion, against the
    // literal 0.41, which checks that 0.161·V/(αS) is arithmetic. Any decay
    // rate passed. See #202.
    const mid = Math.floor(ir.buffer.length / 4);
    const early = ir.buffer.slice(0, mid).reduce((s, x) => s + x, 0);
    const late = ir.buffer.slice(-mid).reduce((s, x) => s + x, 0);
    expect(early).toBeGreaterThan(0);
    expect(early).toBeGreaterThan(late);
  });

  /**
   * The comparison #121 criterion 3 actually asked for:
   *
   * > ART EDC T30 vs `0.161 V / (α S)` within a factor of ~2 (ART is
   * > directional; this is a sanity bound, not a 1% match)
   *
   * Tighter than a factor of 2, because ART now earns it. Measured T20/Eyring
   * 0.91-0.92 and T30/Eyring 0.88-0.89 over three repeats, spread under 0.02, so
   * the 0.75-1.15 band carries roughly six times the observed run-to-run scatter
   * on the near side. Landing a little **below** Eyring is expected rather than a
   * residual defect: Eyring is itself an approximation, and 12 patches with a
   * discretized BRDF do not reproduce a perfectly diffuse field. The upper bound
   * is left above 1 so that a genuine improvement in patch count or directional
   * resolution does not read as a regression.
   *
   * This was `test.fails` until #205: ART lost ~28% of energy per bounce
   * independent of absorption, giving T30 = 0.146 s against Eyring's 0.367. Two
   * defects, one cause — the receiving patch's cosine applied as an energy scale
   * in both `shootFromPatch` and `injectSourceEnergy`, where a particle method
   * needs it only as a back-face gate.
   *
   * The old "biased short, not long" guard is gone with the marker, folded into
   * this band: it existed because the oracle was not executing, and `< 1.15`
   * now covers it.
   */
  test("empty box α=0.2: T20 and T30 sit just under Eyring", () => {
    const reference = eyring(V, S, alpha);
    expect(reference).toBeCloseTo(0.367, 3);

    const t20 = decayTime(ir.buffer, 1000, -5, -25);
    const t30 = decayTime(ir.buffer, 1000, -5, -35);
    for (const t of [t20, t30]) {
      expect(Number.isFinite(t)).toBe(true);
      expect(t / reference).toBeGreaterThan(0.75);
      expect(t / reference).toBeLessThan(1.15);
    }

    // T20 and T30 measure the same slope over different spans, so they agree on
    // an exponential decay and diverge on a truncated one. Measured within 0.3%;
    // the pre-#205 run had them 15% apart, which was the tail being cut off.
    expect(t30 / t20).toBeGreaterThan(0.9);
    expect(t30 / t20).toBeLessThan(1.1);
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
