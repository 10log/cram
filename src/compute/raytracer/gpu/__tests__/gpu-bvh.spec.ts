import * as THREE from 'three';
import { buildGpuSceneBuffers } from '../gpu-bvh';

// Mock the store module
jest.mock('../../../../store', () => {
  const T = require('three');
  return {
    useContainer: {
      getState: () => ({
        containers: {
          'receiver-1': {
            kind: 'receiver',
            uuid: 'receiver-1',
            position: new T.Vector3(2, 1, 0),
            scale: new T.Vector3(1, 1, 1),
          },
        },
      }),
    },
    useSolver: { getState: () => ({ solvers: {} }) },
    addSolver: jest.fn(),
    removeSolver: jest.fn(),
    setSolverProperty: jest.fn(),
    callSolverMethod: jest.fn(),
  };
});

/**
 * Create a minimal mock geometry that provides the interface gpu-bvh.ts needs:
 * getAttribute('position'), getIndex(), and the position attribute's getX/getY/getZ.
 */
function createMockGeometry(positions: number[], indices?: number[]) {
  const posArray = new Float32Array(positions);
  return {
    getAttribute: (name: string) => {
      if (name === 'position') {
        return {
          count: positions.length / 3,
          getX: (i: number) => posArray[i * 3],
          getY: (i: number) => posArray[i * 3 + 1],
          getZ: (i: number) => posArray[i * 3 + 2],
        };
      }
      return null;
    },
    getIndex: () => {
      if (!indices) return null;
      return {
        count: indices.length,
        getX: (i: number) => indices[i],
      };
    },
  };
}

function createMockSurface(uuid: string, positions: number[], absorption: number, scattering: number, indices?: number[]) {
  return {
    kind: 'surface',
    uuid,
    mesh: {
      geometry: createMockGeometry(positions, indices),
      matrixWorld: new THREE.Matrix4(), // identity
      updateMatrixWorld: () => {},
    },
    absorptionFunction: (_freq: number) => absorption,
    scatteringFunction: (_freq: number) => scattering,
    numHits: 0,
  };
}

function createMockRoom(surfaces: any[]) {
  return {
    kind: 'room',
    uuid: 'room-1',
    allSurfaces: surfaces,
  } as any;
}

describe('buildGpuSceneBuffers', () => {
  it('builds correct buffers for a single-triangle surface', () => {
    const positions = [
      0, 0, 0,
      1, 0, 0,
      0, 1, 0,
    ];
    const surface = createMockSurface('surf-1', positions, 0.3, 0.1);
    const room = createMockRoom([surface]);
    const frequencies = [500, 1000];

    const buffers = buildGpuSceneBuffers(room, ['receiver-1'], frequencies);

    expect(buffers.triangleCount).toBe(1);
    expect(buffers.triangleVertices.length).toBe(9);
    expect(buffers.triangleSurfaceIndex[0]).toBe(0);
    expect(buffers.surfaceUuidMap).toEqual(['surf-1']);

    // Acoustic data: 1 surface × 2 freqs × 2 values
    expect(buffers.surfaceAcousticData.length).toBe(4);
    expect(buffers.surfaceAcousticData[0]).toBeCloseTo(0.3, 5);
    expect(buffers.surfaceAcousticData[1]).toBeCloseTo(0.1, 5);

    // BVH
    expect(buffers.nodeCount).toBeGreaterThanOrEqual(1);
    expect(buffers.bvhNodes.length).toBe(buffers.nodeCount * 8);

    // Receiver spheres
    expect(buffers.receiverSpheres.length).toBe(4);
    expect(buffers.receiverSpheres[0]).toBeCloseTo(2, 5);
    expect(buffers.receiverSpheres[1]).toBeCloseTo(1, 5);
    expect(buffers.receiverSpheres[2]).toBeCloseTo(0, 5);
    expect(buffers.receiverSpheres[3]).toBeCloseTo(0.1, 5);
    expect(buffers.receiverUuidMap).toEqual(['receiver-1']);

    // Normals
    expect(buffers.triangleNormals.length).toBe(3);
    expect(Math.abs(buffers.triangleNormals[2])).toBeCloseTo(1, 5);
  });

  it('handles multiple surfaces with indexed geometry', () => {
    const surface1 = createMockSurface(
      'surf-a',
      [0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
      0.2, 0.05,
      [0, 1, 2, 0, 2, 3], // 2 triangles
    );
    const surface2 = createMockSurface(
      'surf-b',
      [0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
      0.5, 0.2,
      [0, 1, 2, 0, 2, 3], // 2 triangles
    );

    const room = createMockRoom([surface1, surface2]);
    const buffers = buildGpuSceneBuffers(room, [], [500]);

    expect(buffers.triangleCount).toBe(4);
    expect(buffers.triangleVertices.length).toBe(4 * 9);
    expect(buffers.surfaceUuidMap).toEqual(['surf-a', 'surf-b']);
    expect(buffers.surfaceCount).toBe(2);

    for (let i = 0; i < buffers.triangleCount; i++) {
      expect(buffers.triangleSurfaceIndex[i]).toBeLessThan(2);
    }

    expect(buffers.receiverCount).toBe(0);
  });

  it('correctly encodes BVH leaf flag', () => {
    const surface = createMockSurface('surf-1', [0, 0, 0, 1, 0, 0, 0, 1, 0], 0.1, 0.05);
    const room = createMockRoom([surface]);

    const buffers = buildGpuSceneBuffers(room, [], [500]);

    expect(buffers.nodeCount).toBe(1);

    // Check leaf flag in data1 (offset 7)
    const data1Bits = new Uint32Array(buffers.bvhNodes.buffer, 7 * 4, 1)[0];
    expect(data1Bits & 0x80000000).not.toBe(0);
    expect(data1Bits & 0x7FFFFFFF).toBe(1);

    // triStart (offset 3) should be 0
    const data0Bits = new Uint32Array(buffers.bvhNodes.buffer, 3 * 4, 1)[0];
    expect(data0Bits).toBe(0);
  });
});
