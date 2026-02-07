/**
 * Source-scanning and behavioral tests for Phase 9: Performance Optimizations.
 *
 * Tests verify:
 *  9c: Scratch vectors in ray-core.ts (no new THREE.Vector3 inside traceRay)
 *  9d: Batched GPU upload flags (appendRay has no needsUpdate, flushRayBuffer exists)
 *  9e: Path capping (maxStoredPaths in defaults and save)
 *  9b: requestAnimationFrame in startAllMonteCarlo (not setInterval)
 *  9f: Binary path encoding v2 (round-trip and backward compat)
 */

import * as fs from 'fs';
import * as path from 'path';

const indexSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'index.ts'),
  'utf8'
);

const rayCoreSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'ray-core.ts'),
  'utf8'
);

const typesSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'types.ts'),
  'utf8'
);

const serializationSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'serialization.ts'),
  'utf8'
);

describe('Phase 9: Performance Optimizations', () => {

  describe('9c: Scratch vectors in traceRay', () => {
    it('ray-core.ts declares module-level scratch vectors', () => {
      expect(rayCoreSource).toContain('const _negRd = new THREE.Vector3()');
      expect(rayCoreSource).toContain('const _normalCopy = new THREE.Vector3()');
      expect(rayCoreSource).toContain('const _reflectedDir = new THREE.Vector3()');
      expect(rayCoreSource).toContain('const _offsetOrigin = new THREE.Vector3()');
    });

    it('traceRay does not allocate new THREE.Vector3 inside function body', () => {
      // Extract traceRay function body (between the function signature and the closing)
      const traceRayMatch = rayCoreSource.match(/export function traceRay\(([\s\S]*?)^}/m);
      expect(traceRayMatch).not.toBeNull();
      const traceRayBody = traceRayMatch![0];
      // Should NOT contain `new THREE.Vector3(` inside the function body
      expect(traceRayBody).not.toContain('new THREE.Vector3(');
    });

    it('inFrontOf does not allocate new THREE.Plane or THREE.Vector4', () => {
      const inFrontOfMatch = rayCoreSource.match(/export function inFrontOf\(([\s\S]*?)\n}/);
      expect(inFrontOfMatch).not.toBeNull();
      const body = inFrontOfMatch![0];
      expect(body).not.toContain('new THREE.Plane()');
      expect(body).not.toContain('new THREE.Vector4(');
    });
  });

  describe('9d: Batched GPU upload flags', () => {
    it('appendRay does not set needsUpdate', () => {
      const appendRayMatch = indexSource.match(/appendRay\([\s\S]*?\n  \}/);
      expect(appendRayMatch).not.toBeNull();
      expect(appendRayMatch![0]).not.toContain('needsUpdate');
    });

    it('flushRayBuffer method exists and sets needsUpdate', () => {
      expect(indexSource).toContain('flushRayBuffer()');
      const flushMatch = indexSource.match(/flushRayBuffer\(\)\s*\{([\s\S]*?)\n  \}/);
      expect(flushMatch).not.toBeNull();
      expect(flushMatch![1]).toContain('needsUpdate = true');
    });

    it('startAllMonteCarlo calls flushRayBuffer', () => {
      const monteCarloMatch = indexSource.match(/startAllMonteCarlo\(\)\s*\{([\s\S]*?)\n  \}/);
      expect(monteCarloMatch).not.toBeNull();
      expect(monteCarloMatch![1]).toContain('this.flushRayBuffer()');
    });
  });

  describe('9e: Path capping (maxStoredPaths)', () => {
    it('maxStoredPaths in defaults', () => {
      expect(typesSource).toMatch(/maxStoredPaths:\s*100000/);
    });

    it('maxStoredPaths in RayTracerParams', () => {
      const paramsMatch = typesSource.match(/export\s+interface\s+RayTracerParams\s*\{([\s\S]*?)\}/);
      expect(paramsMatch).not.toBeNull();
      expect(paramsMatch![1]).toContain('maxStoredPaths');
    });

    it('maxStoredPaths in RayTracerSaveObject', () => {
      const saveMatch = typesSource.match(/export\s+type\s+RayTracerSaveObject\s*=\s*\{([\s\S]*?)\}/);
      expect(saveMatch).not.toBeNull();
      expect(saveMatch![1]).toContain('maxStoredPaths');
    });

    it('save() includes maxStoredPaths', () => {
      const saveMatch = indexSource.match(/save\(\)\s*\{([\s\S]*?)\n  \}/);
      expect(saveMatch).not.toBeNull();
      expect(saveMatch![1]).toContain('maxStoredPaths');
    });

    it('has _pushPathWithEviction method', () => {
      expect(indexSource).toContain('_pushPathWithEviction');
      expect(indexSource).toContain('this.maxStoredPaths');
    });
  });

  describe('9b: requestAnimationFrame in startAllMonteCarlo', () => {
    it('startAllMonteCarlo uses requestAnimationFrame', () => {
      const monteCarloMatch = indexSource.match(/startAllMonteCarlo\(\)\s*\{([\s\S]*?)\n  \}/);
      expect(monteCarloMatch).not.toBeNull();
      expect(monteCarloMatch![1]).toContain('requestAnimationFrame');
    });

    it('startAllMonteCarlo does not use setInterval', () => {
      const monteCarloMatch = indexSource.match(/startAllMonteCarlo\(\)\s*\{([\s\S]*?)\n  \}/);
      expect(monteCarloMatch).not.toBeNull();
      expect(monteCarloMatch![1]).not.toContain('setInterval');
    });

    it('stop() calls cancelAnimationFrame', () => {
      const stopMatch = indexSource.match(/stop\(\)\s*\{([\s\S]*?)\n  \}/);
      expect(stopMatch).not.toBeNull();
      expect(stopMatch![1]).toContain('cancelAnimationFrame');
    });

    it('has _rafId field', () => {
      expect(indexSource).toContain('_rafId');
    });
  });

  describe('9f: Binary path encoding v2', () => {
    it('serialization.ts has V2_MAGIC constant', () => {
      expect(serializationSource).toContain('V2_MAGIC');
    });

    it('pathsToLinearBuffer writes v2 format', () => {
      expect(serializationSource).toContain('pathsToLinearBufferV2');
    });

    it('linearBufferToPaths auto-detects v1 vs v2', () => {
      expect(serializationSource).toContain('V2_MAGIC');
      expect(serializationSource).toContain('linearBufferToPathsV1');
      expect(serializationSource).toContain('linearBufferToPathsV2');
    });

    it('v2 round-trip produces identical paths', async () => {
      // Inline import to avoid Three.js env issues
      const { pathsToLinearBuffer, linearBufferToPaths } = await import('../serialization');

      const testPaths = {
        'receiver-uuid-1234-5678-abcdefghijkl': [
          {
            source: 'source-uuid-0000-1111-abcdefghijklmn',
            chainLength: 2,
            time: 0.05,
            intersectedReceiver: true,
            energy: 0.8,
            chain: [
              {
                object: 'surface-uuid-aaaa-bbbb-ccccddddeeeef',
                angle: 0.5,
                distance: 3.2,
                energy: 0.9,
                faceIndex: 12,
                faceMaterialIndex: 0,
                faceNormal: [0, 1, 0] as [number, number, number],
                point: [1.5, 2.0, 3.0] as [number, number, number],
              },
              {
                object: 'receiver-uuid-1234-5678-abcdefghijkl',
                angle: 0.3,
                distance: 1.1,
                energy: 0.8,
                faceIndex: 5,
                faceMaterialIndex: 1,
                faceNormal: [0, 0, 1] as [number, number, number],
                point: [4.0, 5.0, 6.0] as [number, number, number],
              },
            ],
          },
        ],
      };

      const buffer = pathsToLinearBuffer(testPaths);
      expect(buffer[0]).toBe(-2.0); // V2 magic
      const decoded = linearBufferToPaths(buffer);

      const recKey = Object.keys(decoded)[0];
      expect(recKey).toBe('receiver-uuid-1234-5678-abcdefghijkl');
      expect(decoded[recKey]).toHaveLength(1);
      const decodedPath = decoded[recKey][0];
      expect(decodedPath.source).toBe('source-uuid-0000-1111-abcdefghijklmn');
      expect(decodedPath.chainLength).toBe(2);
      expect(decodedPath.time).toBeCloseTo(0.05);
      expect(decodedPath.intersectedReceiver).toBe(true);
      expect(decodedPath.energy).toBeCloseTo(0.8);
      expect(decodedPath.chain).toHaveLength(2);
      expect(decodedPath.chain[0].object).toBe('surface-uuid-aaaa-bbbb-ccccddddeeeef');
      expect(decodedPath.chain[0].point).toEqual([1.5, 2.0, 3.0]);
      expect(decodedPath.chain[1].point).toEqual([4.0, 5.0, 6.0]);
    });

    it('v1 backward compat: v1 buffer decodes correctly', async () => {
      const { pathsToLinearBufferV1, linearBufferToPaths } = await import('../serialization');

      const testPaths = {
        'receiver-uuid-1234-5678-abcdefghijkl': [
          {
            source: 'source-uuid-0000-1111-abcdefghijklmn',
            chainLength: 1,
            time: 0.02,
            intersectedReceiver: false,
            energy: 0.5,
            chain: [
              {
                object: 'surface-uuid-aaaa-bbbb-ccccddddeeeef',
                angle: 0.7,
                distance: 2.0,
                energy: 0.5,
                faceIndex: 3,
                faceMaterialIndex: 0,
                faceNormal: [1, 0, 0] as [number, number, number],
                point: [0, 0, 0] as [number, number, number],
              },
            ],
          },
        ],
      };

      const v1Buffer = pathsToLinearBufferV1(testPaths);
      // V1 buffer first byte is a UUID charCode (>= 48)
      expect(v1Buffer[0]).toBeGreaterThanOrEqual(48);

      const decoded = linearBufferToPaths(v1Buffer);
      const recKey = Object.keys(decoded)[0];
      expect(recKey).toBe('receiver-uuid-1234-5678-abcdefghijkl');
      expect(decoded[recKey]).toHaveLength(1);
      expect(decoded[recKey][0].source).toBe('source-uuid-0000-1111-abcdefghijklmn');
      expect(decoded[recKey][0].energy).toBeCloseTo(0.5);
    });

    it('v2 is smaller than v1 for multi-path data', async () => {
      const { pathsToLinearBufferV1, pathsToLinearBuffer } = await import('../serialization');

      // Create test data with many paths sharing the same UUIDs
      const chain = {
        object: 'surface-uuid-aaaa-bbbb-ccccddddeeeef',
        angle: 0.5,
        distance: 3.0,
        energy: 0.9,
        faceIndex: 1,
        faceMaterialIndex: 0,
        faceNormal: [0, 1, 0] as [number, number, number],
        point: [1, 2, 3] as [number, number, number],
      };

      const paths = [] as any[];
      for (let i = 0; i < 100; i++) {
        paths.push({
          source: 'source-uuid-0000-1111-abcdefghijklmn',
          chainLength: 3,
          time: i * 0.001,
          intersectedReceiver: true,
          energy: 0.8 - i * 0.001,
          chain: [chain, chain, chain],
        });
      }

      const testData = {
        'receiver-uuid-1234-5678-abcdefghijkl': paths,
      };

      const v1 = pathsToLinearBufferV1(testData);
      const v2 = pathsToLinearBuffer(testData);

      // V2 should be significantly smaller
      expect(v2.length).toBeLessThan(v1.length);
    });
  });
});
