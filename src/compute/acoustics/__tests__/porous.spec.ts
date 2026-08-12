import { rigidBackedPorousAbsorber } from '../porous';

/**
 * Characterisation tests for the Delany–Bazley rigid-backed porous absorber.
 *
 * The expected values were captured from the implementation as it stood when it used the
 * `complex` npm package, so they pin the arithmetic across the move to CRAM's own Complex
 * class. They are golden values, not independently derived from the literature: their job
 * is to prove the numbers did not move.
 *
 * Every case passes frequencies explicitly — the function assigns onto its module-level
 * defaults object, so an omitted frequency list would leak between calls.
 */
const params = {
  speed: 340,
  density: 1.21,
  flowResistivity: 50000,
  thickness: 0.0254,
  frequencies: [125, 250, 500, 1000, 2000, 4000],
};

const ABSORPTION = [
  0.11395487712222307, 0.2198418298972341, 0.38570542366166827,
  0.5857543793781488, 0.750218057164671, 0.8316282986294593,
];

const MAGNITUDE = [
  0.9412996987558091, 0.8832656282810771, 0.7837694663217825,
  0.6436191580599907, 0.49978189526565375, 0.410331209354761,
];

const PHASE = [
  -0.005971320357903986, -0.00638087841427589, 0.0028082250527685314,
  0.04616043387651554, 0.17584555324627343, 0.4227903164812754,
];

describe('rigidBackedPorousAbsorber', () => {
  it('returns the frequencies it was given', () => {
    expect(rigidBackedPorousAbsorber({ ...params }).frequency).toEqual(params.frequencies);
  });

  it('reproduces the known absorption coefficients', () => {
    const { absorption } = rigidBackedPorousAbsorber({ ...params });

    absorption.forEach((value, i) => expect(value).toBeCloseTo(ABSORPTION[i], 12));
  });

  it('reproduces the known reflection magnitudes', () => {
    const { reflection } = rigidBackedPorousAbsorber({ ...params });

    reflection.magnitude.forEach((value, i) => expect(value).toBeCloseTo(MAGNITUDE[i], 12));
  });

  it('reproduces the known reflection phases', () => {
    const { reflection } = rigidBackedPorousAbsorber({ ...params });

    reflection.phase.forEach((value, i) => expect(value).toBeCloseTo(PHASE[i], 12));
  });

  it('absorbs more at higher frequencies, as a porous absorber must', () => {
    const { absorption } = rigidBackedPorousAbsorber({ ...params });

    for (let i = 1; i < absorption.length; i++) {
      expect(absorption[i]).toBeGreaterThan(absorption[i - 1]);
    }
  });

  it('keeps absorption and reflection magnitude physical', () => {
    const { absorption, reflection } = rigidBackedPorousAbsorber({ ...params });

    absorption.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    });
    reflection.magnitude.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    });
  });

  it('absorbs more as the material gets thicker', () => {
    const thin = rigidBackedPorousAbsorber({ ...params, thickness: 0.0254 });
    const thick = rigidBackedPorousAbsorber({ ...params, thickness: 0.1016 });

    expect(thick.absorption[0]).toBeGreaterThan(thin.absorption[0]);
  });
});
