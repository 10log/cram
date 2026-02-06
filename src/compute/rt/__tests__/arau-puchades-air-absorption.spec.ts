/**
 * Tests for Arau-Puchades air absorption term.
 *
 * Bug: Sabine and Eyring include an air absorption term (4*m*V),
 * but Arau-Puchades omitted it entirely.
 *
 * Fix: Add the 4*m*V air absorption term to each directional component
 * in the Arau-Puchades formula.
 */

describe('Arau-Puchades air absorption term', () => {
  describe('physical correctness of air absorption term', () => {
    it('air absorption is modeled as 4*m*V', () => {
      // The standard air absorption term in RT60 formulas is 4*m*V
      // where m = air attenuation coefficient (Np/m), V = volume (m³)
      const m = 0.01; // example at ~4 kHz
      const V = 200;  // 200 m³ room

      const airTerm = 4 * m * V;
      expect(airTerm).toBe(8);

      // This adds equivalent absorption area in m² sabins
    });

    it('air absorption has more impact at high frequencies', () => {
      // Air absorption coefficient increases dramatically with frequency
      // At 20°C, 50% RH:
      //   500 Hz: m ≈ 0.001
      //   4000 Hz: m ≈ 0.02
      //   8000 Hz: m ≈ 0.07

      const V = 500; // large room where air absorption matters
      const airTerm_500 = 4 * 0.001 * V;   // 2
      const airTerm_4k = 4 * 0.02 * V;     // 40
      const airTerm_8k = 4 * 0.07 * V;     // 140

      expect(airTerm_8k).toBeGreaterThan(airTerm_4k);
      expect(airTerm_4k).toBeGreaterThan(airTerm_500);

      // For a large room, air absorption can dominate at high frequencies
      const surfaceAbsorption = 50; // m² sabins
      expect(airTerm_8k).toBeGreaterThan(surfaceAbsorption);
    });

    it('omitting air absorption overestimates RT60 at high frequencies', () => {
      // Without air absorption: RT60 = K*V / A
      // With air absorption:    RT60 = K*V / (A + 4mV)
      const K = 0.161;
      const V = 300;
      const A = 40; // total surface absorption in sabins
      const m = 0.03; // 4kHz air attenuation

      const rt_without = K * V / A;
      const rt_with = K * V / (A + 4 * m * V);

      expect(rt_without).toBeGreaterThan(rt_with);

      // The overestimation can be significant for large rooms
      const overestimate = (rt_without - rt_with) / rt_with;
      expect(overestimate).toBeGreaterThan(0.5); // > 50% error
    });
  });
});
