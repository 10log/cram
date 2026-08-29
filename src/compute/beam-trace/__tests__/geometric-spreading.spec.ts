/**
 * @jest-environment jsdom
 *
 * Issue #99: Beam tracer omits geometric spreading — arrival levels
 * independent of path length.
 *
 * Helper physics lives in ac.spreadingFactor. These tests (1) run that
 * helper through the real P2I/I2P pipeline and (2) assert the production
 * call sites in calculateArrivalPressure, so deleting the two
 * spreadingFactor(...) lines would fail.
 */

import * as fs from 'fs';
import * as path from 'path';
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

  function calculateArrivalPressureBody(): string {
    const source = fs.readFileSync(path.resolve(__dirname, '../arrival-pressure.ts'), 'utf-8');
    const match = source.match(/export function calculateArrivalPressure\([\s\S]*?^\}\n/m);
    expect(match).not.toBeNull();
    return match![0];
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

  test('specular branch calls spreadingFactor(path.length)', () => {
    const body = calculateArrivalPressureBody();
    expect(body).toMatch(/spreadingFactor\(\s*path\.length\s*\)/);
  });

  test('diffraction branch uses spreadingFactor(sPrime), not total path length', () => {
    const body = calculateArrivalPressureBody();
    expect(body).toMatch(/spreadingFactor\(\s*sPrime\s*\)/);
    expect(body).not.toMatch(/bandEnergy\[f\]\s*\*\s*spreading\b/);
    const diffractionBranch = body.split('if (path.bandEnergy)')[1]?.split('return pressures')[0] ?? '';
    expect(diffractionBranch).not.toMatch(/spreadingFactor\(\s*path\.length\s*\)/);
  });

  test('UTD incident spreading is 1/s\'², not 1/(s\'+s)²', () => {
    const sPrime = 4;
    const s = 4;
    expect(spreadingFactor(sPrime)).toBeCloseTo(1 / 16, 6);
    expect(spreadingFactor(sPrime + s)).toBeCloseTo(1 / 64, 6);
    const ratio = spreadingFactor(sPrime + s) / spreadingFactor(sPrime);
    expect(10 * Math.log10(ratio)).toBeCloseTo(-6, 1);
  });
});
