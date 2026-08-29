/**
 * @jest-environment jsdom
 *
 * Issue #99: Beam tracer omits geometric spreading — arrival levels
 * independent of path length.
 *
 * calculateArrivalPressure() converted initialSPL to intensity, applied
 * directivity/reflection/air-absorption, but never scaled by 1/r^2, so a
 * 1 m and a 20 m path arrived at essentially the same level.
 *
 * The fix uses ac.spreadingFactor(r) (src/compute/acoustics/geometric-spreading.ts),
 * a pure, side-effect-free function shared with the image-source solver. This
 * spec runs the actual production helper end to end through the real acoustic
 * conversion pipeline (ac.P2I/I2P/Lp2P/P2Lp) rather than re-deriving the math,
 * so it fails if the formula, its exponent, or its 1 m reference changes.
 *
 * BeamTraceSolver itself cannot be instantiated in this test environment — its
 * constructor pulls in the `beam-trace` npm package, which ships extensionless
 * relative ESM imports that fail under Vitest's native ESM resolution (a
 * pre-existing, unrelated issue — see angle-dependent-reflection.spec.ts for
 * the established precedent). spreadingFactor has no such dependency and is
 * imported directly here.
 */

import * as ac from '../../acoustics';
import { spreadingFactor } from '../../acoustics/geometric-spreading';

describe('Issue #99: geometric spreading in beam-trace calculateArrivalPressure', () => {
  const frequencies = [1000];
  const temperature = 20;

  function arrivalSpl(r: number): number {
    const initialSPL = [100];
    const intensities = ac.P2I(ac.Lp2P(initialSPL)) as number[];
    intensities[0] *= spreadingFactor(r);
    const arrivalLp = ac.P2Lp(ac.I2P(intensities)) as number[];
    const airAttenuationdB = ac.airAttenuation(frequencies, temperature)[0];
    arrivalLp[0] -= airAttenuationdB * r;
    return arrivalLp[0];
  }

  test('spreadingFactor(1) is 1 — the 1 m reference is reproduced unchanged', () => {
    expect(spreadingFactor(1)).toBeCloseTo(1, 6);
  });

  test('spreadingFactor follows 1/r^2', () => {
    expect(spreadingFactor(2)).toBeCloseTo(0.25, 6);
    expect(spreadingFactor(4)).toBeCloseTo(1 / 16, 6);
  });

  test('spreadingFactor is floor-clamped so a coincident source/receiver does not divide by zero', () => {
    expect(Number.isFinite(spreadingFactor(0))).toBe(true);
    expect(spreadingFactor(0)).toBe(spreadingFactor(1e-3));
  });

  test('applying spreadingFactor through the real conversion pipeline yields ~6 dB SPL drop per doubling of distance', () => {
    const spl1 = arrivalSpl(1);
    const spl2 = arrivalSpl(2);
    const spl4 = arrivalSpl(4);

    const airAttenuationdB = ac.airAttenuation(frequencies, temperature)[0];
    const expectedDrop1to2 = 20 * Math.log10(2) + airAttenuationdB * (2 - 1);
    const expectedDrop2to4 = 20 * Math.log10(2) + airAttenuationdB * (4 - 2);

    expect(spl1).toBeCloseTo(100, 1);
    expect(spl1 - spl2).toBeCloseTo(expectedDrop1to2, 1);
    expect(spl2 - spl4).toBeCloseTo(expectedDrop2to4, 1);
  });

  test('a receiver at 10 m is ~20 dB quieter than one at 1 m', () => {
    const spl1 = arrivalSpl(1);
    const spl10 = arrivalSpl(10);
    const airAttenuationdB = ac.airAttenuation(frequencies, temperature)[0];
    const expectedDrop = 20 * Math.log10(10) + airAttenuationdB * (10 - 1);
    expect(spl1 - spl10).toBeCloseTo(expectedDrop, 1);
  });
});
