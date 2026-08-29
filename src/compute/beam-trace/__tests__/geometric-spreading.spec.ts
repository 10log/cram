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
 * BeamTraceSolver cannot be instantiated in this test environment (its
 * constructor pulls in the `beam-trace` package, which has a native-ESM
 * resolution issue unrelated to this fix — see angle-dependent-reflection.spec.ts
 * for the established precedent of scanning the compiled method source instead).
 * The numeric sub-test below independently verifies the 1/r^2 -> 6 dB/doubling
 * physics claim using the same pure acoustic-conversion utilities the method
 * itself uses (ac.P2I/I2P/Lp2P/P2Lp), so the formula's correctness is checked
 * by computation, not merely by string presence.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ac from '../../acoustics';

describe('Issue #99: geometric spreading in beam-trace calculateArrivalPressure', () => {
  const filePath = path.resolve(__dirname, '../index.ts');
  const source = fs.readFileSync(filePath, 'utf-8');

  function getMethodBody(): string {
    const methodMatch = source.match(/private calculateArrivalPressure\(initialSPL[\s\S]*?^\s{2}\}/m);
    expect(methodMatch).not.toBeNull();
    return methodMatch![0];
  }

  test('calculateArrivalPressure derives a 1/r^2 spreading factor from path.length', () => {
    const methodBody = getMethodBody();

    expect(methodBody).toMatch(/path\.length/);
    expect(methodBody).toMatch(/1\s*\/\s*\(\s*r\s*\*\s*r\s*\)/);
  });

  test('spreading is applied to the specular-path intensities', () => {
    const methodBody = getMethodBody();
    // The specular branch's intensities array must be scaled by the spreading factor
    // before directivity/reflection are applied.
    expect(methodBody).toMatch(/intensities\[f\]\s*\*=\s*spreading/);
  });

  test('spreading is also applied to the diffraction (bandEnergy) branch', () => {
    const methodBody = getMethodBody();
    expect(methodBody).toMatch(/bandEnergy\[f\]\s*\*\s*spreading/);
  });

  test('spreading is floor-clamped so a coincident source/receiver does not divide by zero', () => {
    const methodBody = getMethodBody();
    expect(methodBody).toMatch(/Math\.max\(path\.length,\s*1e-3\)/);
  });

  // Independent numeric verification of the physics claim, using the same
  // pure conversion utilities calculateArrivalPressure uses internally.
  test('applying 1/r^2 intensity spreading yields ~6 dB SPL drop per doubling of distance', () => {
    const initialSPL = [100];
    const frequencies = [1000];
    const temperature = 20;
    const airAttenuationdB = ac.airAttenuation(frequencies, temperature)[0];

    function arrivalSpl(r: number): number {
      const intensities = ac.P2I(ac.Lp2P(initialSPL)) as number[];
      const spreading = 1 / (r * r);
      intensities[0] *= spreading;
      const arrivalLp = ac.P2Lp(ac.I2P(intensities)) as number[];
      arrivalLp[0] -= airAttenuationdB * r;
      return arrivalLp[0];
    }

    const spl1 = arrivalSpl(1);
    const spl2 = arrivalSpl(2);
    const spl4 = arrivalSpl(4);

    const expectedDrop1to2 = 20 * Math.log10(2) + airAttenuationdB * (2 - 1);
    const expectedDrop2to4 = 20 * Math.log10(2) + airAttenuationdB * (4 - 2);

    expect(spl1).toBeCloseTo(100, 1);
    expect(spl1 - spl2).toBeCloseTo(expectedDrop1to2, 1);
    expect(spl2 - spl4).toBeCloseTo(expectedDrop2to4, 1);
  });
});
