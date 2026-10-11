import * as THREE from 'three';
import { MeshLineGeometry } from 'meshline';

/**
 * The meshline behaviour the image-source and beam-trace path highlights rely on.
 *
 * CRAM used three.meshline until three r186. That library reached three through
 * require(), which up to r185 resolved to three's separate CommonJS build — a second
 * copy of three, so its `instanceof THREE.Vector3` guard never matched and Vector3
 * arrays became NaN positions. r186 turned that build into a require(esm) shim that
 * calls Node's process.emitWarning, which broke the ray tracer in the browser once Vite
 * bundled it. meshline imports three as an ES module, so it shares CRAM's instance in
 * every environment.
 *
 * These tests deliberately exercise the real library against real three — no mocks.
 */
describe('meshline setPoints', () => {
  const path = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ];
  // MeshLine doubles every point to give the ribbon its two edges.
  const doubled = [
    0, 0, 0, 0, 0, 0,
    1, 0, 0, 1, 0, 0,
    1, 1, 0, 1, 1, 0,
  ];

  const positionsOf = (line: MeshLineGeometry) =>
    Array.from(line.getAttribute('position').array as ArrayLike<number>);

  it('builds correct geometry from a Float32Array', () => {
    const line = new MeshLineGeometry();
    line.setPoints(new Float32Array(path.flat()));

    expect(line.getAttribute('position').count).toBe(path.length * 2);
    expect(positionsOf(line)).toEqual(doubled);
  });

  it('accepts the empty case used to clear a path', () => {
    const line = new MeshLineGeometry();
    line.setPoints(new Float32Array(path.flat()));

    expect(() => line.setPoints(new Float32Array(0))).not.toThrow();
    expect(line.getAttribute('position').count).toBe(0);
  });

  it('builds correct geometry from a Vector3 array', () => {
    const line = new MeshLineGeometry();
    line.setPoints(path.map(([x, y, z]) => new THREE.Vector3(x, y, z)));

    expect(positionsOf(line)).toEqual(doubled);
  });

  it('shares a three instance with CRAM', () => {
    expect(new MeshLineGeometry() instanceof THREE.BufferGeometry).toBe(true);
  });
});
