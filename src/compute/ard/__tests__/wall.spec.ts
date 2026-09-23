/**
 * Tests for PML layers and the absorption mapping (plan Phases 4 and 5).
 *
 * The calibration curve is measured, not analytic, so these tests are slower
 * than the rest of the ARD suite. The curve is memoized per
 * `(thickness, grading, Courant)`, so the cost is paid once per distinct
 * calibration and the default one is reused throughout.
 */

import { Axis } from '../partition';
import { PmlPartition } from '../pml-partition';
import {
  absorptionFromReflection,
  calibrationCurve,
  createWall,
  dampingForAbsorption,
  dampingForReflection,
  measureNormalIncidenceReflection,
  reflectionMagnitude,
} from '../wall';

const C = 343;
const DX = 0.05;
const DT = (0.4 * DX) / C;

describe('reflectionMagnitude', () => {
  it('maps the endpoints of the absorption range', () => {
    expect(reflectionMagnitude(0)).toBe(1);
    expect(reflectionMagnitude(1)).toBe(0);
  });

  it('is sqrt(1 - alpha), since alpha is an energy ratio', () => {
    expect(reflectionMagnitude(0.5)).toBeCloseTo(Math.SQRT1_2, 12);
    expect(reflectionMagnitude(0.3)).toBeCloseTo(Math.sqrt(0.7), 12);
  });

  it('round-trips with absorptionFromReflection', () => {
    for (const alpha of [0, 0.1, 0.35, 0.8, 1]) {
      expect(absorptionFromReflection(reflectionMagnitude(alpha))).toBeCloseTo(alpha, 12);
    }
  });

  it('rejects values outside [0, 1]', () => {
    expect(() => reflectionMagnitude(-0.1)).toThrow();
    expect(() => reflectionMagnitude(1.1)).toThrow();
    expect(() => absorptionFromReflection(-0.1)).toThrow();
    expect(() => absorptionFromReflection(1.5)).toThrow();
  });
});

describe('PmlPartition', () => {
  it('grades sigma from zero at the interface to sigmaMax at the outer face', () => {
    const high = new PmlPartition({
      box: { x: 100, y: 0, z: 0, w: 20, h: 1, d: 1 },
      dx: DX,
      c: C,
      dt: DT,
      axis: Axis.X,
      increasing: true,
      sigmaMax: 1000,
      gradingExponent: 2,
    });
    // Slab on the high side: the interface is at its low face, so sigma must
    // start near zero there. A step change in sigma is itself an impedance
    // discontinuity and would reflect.
    expect(high.sigmaAt(0)).toBeLessThan(10);
    expect(high.sigmaAt(19)).toBeGreaterThan(900);

    const low = new PmlPartition({
      box: { x: -20, y: 0, z: 0, w: 20, h: 1, d: 1 },
      dx: DX,
      c: C,
      dt: DT,
      axis: Axis.X,
      increasing: false,
      sigmaMax: 1000,
      gradingExponent: 2,
    });
    expect(low.sigmaAt(19)).toBeLessThan(10);
    expect(low.sigmaAt(0)).toBeGreaterThan(900);
  });

  it('rejects negative damping', () => {
    expect(
      () =>
        new PmlPartition({
          box: { x: 0, y: 0, z: 0, w: 20, h: 1, d: 1 },
          dx: DX,
          c: C,
          dt: DT,
          axis: Axis.X,
          increasing: true,
          sigmaMax: -1,
        }),
    ).toThrow();
  });

  it('reflects almost everything when undamped', () => {
    // With sigmaMax = 0 the slab is transparent, but its far face is a
    // zero-padded end, so the wave comes straight back.
    expect(measureNormalIncidenceReflection(0)).toBeGreaterThan(0.9);
  });
});

describe('calibration curve', () => {
  it('falls monotonically along the branch it exposes', () => {
    const curve = calibrationCurve();
    expect(curve.sigmaHat.length).toBeGreaterThan(5);
    for (let i = 1; i < curve.reflection.length; i++) {
      expect(curve.sigmaHat[i]).toBeGreaterThan(curve.sigmaHat[i - 1]);
      expect(curve.reflection[i]).toBeLessThan(curve.reflection[i - 1]);
    }
    expect(curve.reflection[0]).toBeGreaterThan(0.9);
  });

  it('is memoized per calibration', () => {
    const a = calibrationCurve();
    const b = calibrationCurve();
    expect(b).toBe(a);
  });

  it('reaches well past the absorption of any real material at 20 cells', () => {
    // Not the 1e-3 the plan assumed — the floor is ~0.03 — but far beyond the
    // alpha of any surface in the material database.
    const curve = calibrationCurve();
    expect(curve.minReflection).toBeLessThan(0.05);
    expect(curve.maxAbsorption).toBeGreaterThan(0.99);
  });
});

describe('dampingForAbsorption', () => {
  it('gives no damping for a perfectly reflective surface', () => {
    expect(dampingForAbsorption(0)).toBe(0);
  });

  it('increases with absorption', () => {
    let previous = -1;
    for (const alpha of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      const sigma = dampingForAbsorption(alpha);
      expect(sigma).toBeGreaterThan(previous);
      previous = sigma;
    }
  });

  /**
   * The plan's acceptance test: a wall configured for alpha = 0.3 must reflect
   * |R| = sqrt(0.7) within 0.05. Measured error is ~1e-4, so the tolerance here
   * is loose by three orders of magnitude; it is kept at the plan's figure so a
   * regression has room to be caught as a regression rather than as noise.
   */
  it('realizes a requested absorption coefficient', () => {
    for (const alpha of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      const sigmaHat = dampingForAbsorption(alpha);
      const measured = measureNormalIncidenceReflection(sigmaHat);
      expect(measured).toBeCloseTo(reflectionMagnitude(alpha), 2);
      expect(Math.abs(absorptionFromReflection(measured) - alpha)).toBeLessThan(0.05);
    }
  });

  it('refuses an absorption the layer cannot reach', () => {
    // Silently clamping would hand back a wall quietly more reflective than the
    // material it stands in for, which is worse than failing.
    const thin = { thickness: 10, gradingExponent: 2, courant: 0.4 };
    const unreachable = absorptionFromReflection(calibrationCurve(thin).minReflection) + 0.01;
    expect(() => dampingForAbsorption(Math.min(1, unreachable), thin)).toThrow(
      /reaches \|R\| =/,
    );
  });

  it('rejects malformed targets', () => {
    expect(() => dampingForReflection(-0.1)).toThrow();
    expect(() => dampingForReflection(1.5)).toThrow();
    expect(() => dampingForAbsorption(1.5)).toThrow();
  });
});

describe('createWall', () => {
  const room = { x: 0, y: 0, z: 0, w: 40, h: 30, d: 1 };

  it('places a slab beyond the high face', () => {
    const wall = createWall({
      box: room,
      axis: Axis.X,
      high: true,
      alpha: 0.3,
      dx: DX,
      c: C,
      dt: DT,
      thickness: 20,
    });
    expect(wall.box).toEqual({ x: 40, y: 0, z: 0, w: 20, h: 30, d: 1 });
    // sigma must vanish where it meets the room.
    expect(wall.sigmaAt(0)).toBeLessThan(wall.sigmaAt(19));
  });

  it('places a slab before the low face, with the profile flipped', () => {
    const wall = createWall({
      box: room,
      axis: Axis.Y,
      high: false,
      alpha: 0.3,
      dx: DX,
      c: C,
      dt: DT,
      thickness: 20,
    });
    expect(wall.box).toEqual({ x: 0, y: -20, z: 0, w: 40, h: 20, d: 1 });
    expect(wall.sigmaAt(19)).toBeLessThan(wall.sigmaAt(0));
  });

  /**
   * A wall keeps its face's transverse extents, so a wall on a 3D room is a
   * rank-3 PML slab with the 3D CFL limit (~0.47) — while the DCT interior it
   * terminates has no limit at all. At the plan's default Courant 0.5 the wall
   * diverges and the room beside it looks healthy. The calibration rig is 1D
   * (rank 1, limit ~0.81), so it cannot notice; the check has to live where the
   * geometry is known.
   */
  describe('stability guard', () => {
    const room3d = { x: 0, y: 0, z: 0, w: 40, h: 30, d: 20 };
    const dtFor = (courant: number) => (courant * DX) / C;

    it('refuses a 3D room wall at the plan default of Courant 0.5', () => {
      expect(() =>
        createWall({
          box: room3d,
          axis: Axis.X,
          high: true,
          alpha: 0.3,
          dx: DX,
          c: C,
          dt: dtFor(0.5),
        }),
      ).toThrow(/rank-3 PML slab/);
    });

    it('accepts the same wall at Courant 0.4', () => {
      const wall = createWall({
        box: room3d,
        axis: Axis.X,
        high: true,
        alpha: 0.3,
        dx: DX,
        c: C,
        dt: dtFor(0.4),
      });
      expect(wall.rank).toBe(3);
      expect(wall.courant).toBeLessThan(wall.cflLimit);
    });

    it('still allows Courant 0.5 on a 2D room, where the slab is rank 2', () => {
      // Same default, different geometry: the 2D limit is ~0.575, so 0.5 is
      // genuinely safe here and must not be refused.
      const room2d = { x: 0, y: 0, z: 0, w: 40, h: 30, d: 1 };
      const wall = createWall({
        box: room2d,
        axis: Axis.X,
        high: true,
        alpha: 0.3,
        dx: DX,
        c: C,
        dt: dtFor(0.5),
      });
      expect(wall.rank).toBe(2);
      expect(wall.courant).toBeLessThan(wall.cflLimit);
    });
  });

  it('gives a fully reflective surface no damping at all', () => {
    const wall = createWall({
      box: room,
      axis: Axis.X,
      high: true,
      alpha: 0,
      dx: DX,
      c: C,
      dt: DT,
    });
    expect(wall.sigmaMax).toBe(0);
  });
});
