import * as THREE from 'three';
import { MeshLine } from 'three.meshline';

/**
 * The three.meshline behaviour behind the setPoints declaration in src/types/modules.d.ts.
 *
 * three.meshline reaches three through require(). Up to r185 that resolved to three's
 * separate CommonJS build, while CRAM imports the ESM build — two modules, two Vector3
 * classes — so the library's `points[0] instanceof THREE.Vector3` guard never matched and
 * a Vector3 array was read as flat numbers, yielding NaN positions.
 *
 * r186 deprecated the CommonJS build: build/three.cjs now re-exports the ES module via
 * require(esm), so both paths share one instance and the Vector3 case works. The last
 * two tests pin that. The declaration still only accepts Float32Array: every caller
 * passes one, and three says the CommonJS entry will be removed, at which point the
 * library's require('three') stops resolving in Node at all.
 *
 * These tests deliberately exercise the real library against real three — no mocks.
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

  // Up to r185 this silently produced NaN positions (see the header).
  it('builds correct geometry from a Vector3 array since three r186', () => {
    const line = new MeshLine();
    const vectors = path.map(([x, y, z]) => new THREE.Vector3(x, y, z));

    // @ts-expect-error - passing the shape the declaration deliberately rejects
    line.setPoints(vectors);

    expect((line as any).attributes.position.count).toBe(vectors.length * 2);
    expect(positionsOf(line)).toEqual([
      0, 0, 0, 0, 0, 0,
      1, 0, 0, 1, 0, 0,
      1, 1, 0, 1, 1, 0,
    ]);
  });

  it('shares a three instance with CRAM since three r186', () => {
    // MeshLine extends THREE.BufferGeometry in its own source. Up to r185 it was not an
    // instance of the BufferGeometry CRAM imports — two copies of three.
    expect(new MeshLine() instanceof THREE.BufferGeometry).toBe(true);
  });
});
