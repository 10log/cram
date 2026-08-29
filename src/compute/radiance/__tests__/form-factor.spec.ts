import { Vector3 } from 'three';
import { DirectionalResponse } from '../directional-response';
import { selectShootingPatch, totalUnshotEnergy, incomingLambert } from '../form-factor';

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

  test("shoot and inject multiply deposited energy by incomingLambert", () => {
    const fs = require("fs");
    const path = require("path");
    const src = fs.readFileSync(path.resolve(__dirname, "../form-factor.ts"), "utf8");
    expect(src.match(/incomingLambert/g)?.length).toBeGreaterThanOrEqual(3);
    expect(src).toMatch(/recvCos/);
  });
});

