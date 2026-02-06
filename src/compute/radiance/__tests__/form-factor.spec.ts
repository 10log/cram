import { DirectionalResponse } from '../directional-response';
import { selectShootingPatch, totalUnshotEnergy } from '../form-factor';

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
