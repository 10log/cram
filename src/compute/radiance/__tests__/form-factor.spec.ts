import { Vector3 } from 'three';
import { BRDF } from '../brdf';
import { DirectionalResponse } from '../directional-response';
import {
  incomingLambert,
  injectSourceEnergy,
  selectShootingPatch,
  shootFromPatch,
  totalUnshotEnergy,
} from '../form-factor';
import { buildPatchesFromTriangles, type PatchSet } from '../patch';

/** A closed, convex, rigid shoebox — the fixture the deposit tests need. */
function shoebox(lx: number, ly: number, lz: number): PatchSet {
  const p = (x: number, y: number, z: number) => new Vector3(x, y, z);
  const face = (a: Vector3, b: Vector3, c: Vector3, d: Vector3) => [
    { a: a.clone(), b: b.clone(), c: c.clone(), absorption: () => 0, scattering: () => 1 },
    { a: a.clone(), b: c.clone(), c: d.clone(), absorption: () => 0, scattering: () => 1 },
  ];
  return buildPatchesFromTriangles(
    [
      ...face(p(0, 0, 0), p(lx, 0, 0), p(lx, 0, lz), p(0, 0, lz)),
      ...face(p(0, ly, 0), p(0, ly, lz), p(lx, ly, lz), p(lx, ly, 0)),
      ...face(p(0, 0, 0), p(0, 0, lz), p(0, ly, lz), p(0, ly, 0)),
      ...face(p(lx, 0, 0), p(lx, ly, 0), p(lx, ly, lz), p(lx, 0, lz)),
      ...face(p(0, 0, 0), p(0, ly, 0), p(lx, ly, 0), p(lx, 0, 0)),
      ...face(p(0, 0, lz), p(lx, 0, lz), p(lx, ly, lz), p(0, ly, lz)),
    ],
    new Vector3(lx / 2, ly / 2, lz / 2),
  );
}

describe('form-factor helpers', () => {
  describe('selectShootingPatch', () => {
    it('returns index of patch with most unshot energy', () => {
      const unshotEnergy = [
        new DirectionalResponse(2, 5),
        new DirectionalResponse(2, 5),
        new DirectionalResponse(2, 5),
      ];
      // Patch 1 has the most energy
      unshotEnergy[0].responses[0].buffer[0] = 1;
      unshotEnergy[1].responses[0].buffer[0] = 10;
      unshotEnergy[2].responses[0].buffer[0] = 3;

      const idx = selectShootingPatch(unshotEnergy);
      expect(idx).toBe(1);
    });

    it('returns 0 for empty energy arrays', () => {
      const unshotEnergy = [
        new DirectionalResponse(2, 5),
        new DirectionalResponse(2, 5),
      ];
      const idx = selectShootingPatch(unshotEnergy);
      expect(idx).toBe(0);
    });

    it('returns first index when energies are equal', () => {
      const unshotEnergy = [
        new DirectionalResponse(1, 3),
        new DirectionalResponse(1, 3),
      ];
      unshotEnergy[0].responses[0].buffer[0] = 5;
      unshotEnergy[1].responses[0].buffer[0] = 5;

      const idx = selectShootingPatch(unshotEnergy);
      expect(idx).toBe(0);
    });
  });

  describe('totalUnshotEnergy', () => {
    it('sums energy across all patches', () => {
      const unshotEnergy = [
        new DirectionalResponse(2, 5),
        new DirectionalResponse(2, 5),
      ];
      unshotEnergy[0].responses[0].buffer[0] = 1;
      unshotEnergy[0].responses[1].buffer[0] = 2;
      unshotEnergy[1].responses[0].buffer[0] = 3;

      const total = totalUnshotEnergy(unshotEnergy);
      expect(total).toBe(6);
    });

    it('returns 0 for empty energy', () => {
      const unshotEnergy = [
        new DirectionalResponse(3, 10),
      ];
      const total = totalUnshotEnergy(unshotEnergy);
      expect(total).toBe(0);
    });
  });
});

describe("Issue #120: incoming Lambert cosine", () => {
  test("a face-on patch gets cos = 1; an edge-on patch gets 0", () => {
    const down = new Vector3(0, -1, 0);
    expect(incomingLambert(new Vector3(0, 1, 0), down)).toBeCloseTo(1, 10);
    expect(incomingLambert(new Vector3(1, 0, 0), down)).toBeCloseTo(0, 10);
  });

  test("a 60° glancing hit gets 1/2, a backface gets 0", () => {
    const dir = new Vector3(Math.sqrt(3) / 2, -0.5, 0);
    expect(incomingLambert(new Vector3(0, 1, 0), dir)).toBeCloseTo(0.5, 10);
    expect(incomingLambert(new Vector3(0, -1, 0), dir)).toBe(0);
  });

  /**
   * This test used to read the source of `form-factor.ts` and assert that
   * `incomingLambert` appeared at least three times and that the identifier
   * `recvCos` existed, under the title "shoot and inject multiply deposited
   * energy by incomingLambert".
   *
   * Two things were wrong with that. It was a text match, so it pinned an
   * identifier rather than a property and would pass on a file that used the
   * cosine for anything at all. And its title asserted the defect: multiplying
   * deposited energy by the receiver's cosine cost ~28% of every bounce (#205),
   * because in a particle method the receiver's projected area is already
   * expressed in *how many rays reach it*, not in how much each one carries.
   * It also sat under #120, which is about ray-origin epsilon and says nothing
   * about any of this.
   *
   * Replaced with the behavioural property it should have been: the cosine
   * decides *whether* a ray deposits, never *how much*. Reinstating it as a
   * scale in either function fails this.
   */
  test("the cosine gates a deposit, it does not scale one", () => {
    const patchSet = shoebox(4, 3, 2.5);
    const brdf = new BRDF(0);
    const n = patchSet.patches.length;
    const ctx = {
      patchSet,
      unshotEnergy: Array.from({ length: n }, () => new DirectionalResponse(brdf.nSlots, 600)),
      totalEnergy: Array.from({ length: n }, () => new DirectionalResponse(brdf.nSlots, 600)),
      brdf,
      absorptions: patchSet.patches.map(() => 0),
      scatterings: patchSet.patches.map(() => 1),
      airAbsNepers: 0,
      speedOfSound: 343.2,
      sampleRate: 1000,
      raysPerShoot: 300,
    };
    for (let k = 0; k < brdf.nSlots; k++) ctx.unshotEnergy[0].responses[k].buffer[0] = 1;
    const shot = totalUnshotEnergy(ctx.unshotEnergy);
    shootFromPatch(ctx, 0);
    // Rigid, closed, convex: every ray lands on a front face and delivers all it
    // carries, so the room keeps exactly what was shot.
    expect(totalUnshotEnergy(ctx.unshotEnergy) / shot).toBeCloseTo(1, 3);

    // And injection likewise deposits what it is handed.
    const fresh = { ...ctx, unshotEnergy: Array.from({ length: n }, () => new DirectionalResponse(brdf.nSlots, 600)), totalEnergy: Array.from({ length: n }, () => new DirectionalResponse(brdf.nSlots, 600)) };
    injectSourceEnergy(new Vector3(1.2, 1.2, 0.8), 1, fresh, 400);
    expect(totalUnshotEnergy(fresh.unshotEnergy)).toBeCloseTo(1, 2);
  }, 60_000);
});

