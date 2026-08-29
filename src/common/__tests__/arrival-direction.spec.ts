/**
 * Issue #102: specular vs diffraction arrivalDirection were opposite vectors.
 * lookingBackArrivalDirection is the shared convention (receiver → last bounce).
 */
import * as fs from 'fs';
import * as path from 'path';
import { lookingBackArrivalDirection } from '../arrival-direction';

describe('lookingBackArrivalDirection', () => {
  test('direct path: source at +Z from the receiver looks back along +Z', () => {
    const [x, y, z] = lookingBackArrivalDirection(
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 10 },
    );
    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(0, 10);
    expect(z).toBeCloseTo(1, 10);
  });

  test('is the negation of travel (lastBounce → receiver)', () => {
    const rec = { x: 1, y: 2, z: 3 };
    const bounce = { x: 4, y: 6, z: 3 };
    const [lx, ly, lz] = lookingBackArrivalDirection(rec, bounce);
    const tx = rec.x - bounce.x;
    const ty = rec.y - bounce.y;
    const tz = rec.z - bounce.z;
    const tlen = Math.hypot(tx, ty, tz);
    expect(lx).toBeCloseTo(-(tx / tlen), 10);
    expect(ly).toBeCloseTo(-(ty / tlen), 10);
    expect(lz).toBeCloseTo(-(tz / tlen), 10);
  });

  test('specular and diffraction that share a last segment are parallel, not anti-parallel', () => {
    const receiver = { x: 0, y: 0, z: 0 };
    const lastBounce = { x: 3, y: 4, z: 0 };
    const specular = lookingBackArrivalDirection(receiver, lastBounce);
    const diffraction = lookingBackArrivalDirection(receiver, lastBounce);
    expect(specular[0] * diffraction[0] + specular[1] * diffraction[1] + specular[2] * diffraction[2])
      .toBeCloseTo(1, 10);
  });

  test('coincident receiver/bounce does not divide by zero', () => {
    const d = lookingBackArrivalDirection({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 });
    expect(d).toEqual([0, 0, 1]);
    expect(d.every(Number.isFinite)).toBe(true);
  });

  test('unit length', () => {
    const [x, y, z] = lookingBackArrivalDirection(
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 2, z: 2 },
    );
    expect(Math.hypot(x, y, z)).toBeCloseTo(1, 10);
  });
});

describe('Issue #102: production call sites', () => {
  test('beam-trace convertPath and diffraction both call lookingBackArrivalDirection', () => {
    const source = fs.readFileSync(path.resolve(__dirname, '../../compute/beam-trace/index.ts'), 'utf-8');
    const convert = source.match(/private convertPath\([\s\S]*?^  \}/m);
    const diffraction = source.match(/private _computeDiffractionPaths\(\)[\s\S]*?^  \}/m);
    expect(convert).not.toBeNull();
    expect(diffraction).not.toBeNull();
    expect(convert![0]).toMatch(/lookingBackArrivalDirection\(\s*points\[0\],\s*points\[1\]\s*\)/);
    expect(diffraction![0]).toMatch(/lookingBackArrivalDirection\(\s*rec,\s*diffPt\s*\)/);
    expect(diffraction![0]).not.toMatch(/recPos\[0\]\s*-\s*dp\.diffractionPoint\[0\]/);
  });

  test('Receiver.getGain JSDoc describes looking-back, not travel', () => {
    const source = fs.readFileSync(path.resolve(__dirname, '../../objects/receiver.ts'), 'utf-8');
    expect(source).toMatch(/looking-back/);
    expect(source).not.toMatch(/FROM the source\/reflection toward the receiver/);
  });
});
