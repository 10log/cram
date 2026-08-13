import * as THREE from 'three';
import { MeshLine } from 'three.meshline';

/**
 * Why the setPoints declaration in src/types/modules.d.ts only accepts Float32Array.
 *
 * three.meshline reaches three through require(), which resolves to three's CommonJS
 * build, while CRAM imports it and gets the ESM build. three's exports map makes those
 * two separate modules with two separate Vector3 classes, so the library's
 * `points[0] instanceof THREE.Vector3` guard can never match a Vector3 constructed here.
 * A Vector3 array therefore falls through to the flat-number branch and is read as
 * coordinates, yielding NaN positions rather than a line.
 *
 * These tests deliberately exercise the real library against real three — no mocks. If
 * the Vector3 case ever starts producing sane geometry, the dependency has been fixed or
 * replaced and the type can be widened again.
 */
describe('three.meshline setPoints', () => {
  const path = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ];

  const positionsOf = (line: MeshLine) =>
    Array.from(((line as any).attributes.position.array as ArrayLike<number>));

  it('builds correct geometry from a Float32Array', () => {
    const line = new MeshLine();
    line.setPoints(new Float32Array(path.flat()));

    // MeshLine doubles every point to give the ribbon its two edges.
    expect((line as any).attributes.position.count).toBe(path.length * 2);
    expect(positionsOf(line).every((n) => Number.isFinite(n))).toBe(true);
  });

  it('places the doubled vertices on the original points', () => {
    const line = new MeshLine();
    line.setPoints(new Float32Array(path.flat()));

    expect(positionsOf(line)).toEqual([
      0, 0, 0, 0, 0, 0,
      1, 0, 0, 1, 0, 0,
      1, 1, 0, 1, 1, 0,
    ]);
  });

  it('accepts the empty case used to clear a path', () => {
    const line = new MeshLine();

    expect(() => line.setPoints(new Float32Array(0))).not.toThrow();
    expect((line as any).attributes.position.count).toBe(0);
  });

  // The reason the declared type excludes Vector3[]. Not aspirational — this is what the
  // installed version does today, and it fails silently.
  it('silently corrupts a Vector3 array, which is why the type forbids one', () => {
    const line = new MeshLine();
    const vectors = path.map(([x, y, z]) => new THREE.Vector3(x, y, z));

    // @ts-expect-error - passing the shape the declaration deliberately rejects
    line.setPoints(vectors);

    const positions = positionsOf(line);
    expect((line as any).attributes.position.count).not.toBe(vectors.length * 2);
    expect(positions.every((n) => Number.isFinite(n))).toBe(false);
  });

  it('does not share a three instance with CRAM, which is the root cause', () => {
    // MeshLine extends THREE.BufferGeometry in its own source, yet is not an instance of
    // the BufferGeometry CRAM imports — two copies of three, two class identities.
    expect(new MeshLine() instanceof THREE.BufferGeometry).toBe(false);
  });
});
