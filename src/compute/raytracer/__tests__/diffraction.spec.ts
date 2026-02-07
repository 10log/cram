/**
 * Tests for Issue #77: Edge Diffraction via UTD.
 *
 * Source-scanning tests verify the code structure without needing
 * the full Three.js/WebGL environment. Unit tests verify the pure
 * math functions (Fresnel transition, UTD coefficient, diffraction point).
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Source-scanning: read source files as strings ──────────────────

const typesSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'types.ts'),
  'utf8'
);

const indexSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'index.ts'),
  'utf8'
);

const diffTypesSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'diffraction', 'types.ts'),
  'utf8'
);

const edgeGraphSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'diffraction', 'edge-graph.ts'),
  'utf8'
);

const utdCoefficientSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'diffraction', 'utd-coefficient.ts'),
  'utf8'
);

const findPathsSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'diffraction', 'find-diffraction-paths.ts'),
  'utf8'
);

const diffIndexSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'diffraction', 'index.ts'),
  'utf8'
);

const rayTracerTabSource = fs.readFileSync(
  path.resolve(__dirname, '..', '..', '..', 'components', 'parameter-config', 'RayTracerTab.tsx'),
  'utf8'
);

// ── Import pure math functions for unit testing ───────────────────

import { fresnelTransition, utdDiffractionCoefficient } from '../diffraction/utd-coefficient';
import { findDiffractionPoint } from '../diffraction/find-diffraction-paths';
import { buildEdgeGraph } from '../diffraction/edge-graph';

// ── Source-scanning tests ─────────────────────────────────────────

describe('Issue #77: Edge Diffraction via UTD', () => {

  describe('types.ts modifications', () => {
    it('edgeDiffractionEnabled in RayTracerParams', () => {
      const match = typesSource.match(/export\s+interface\s+RayTracerParams\s*\{([\s\S]*?)\}/);
      expect(match).not.toBeNull();
      expect(match![1]).toContain('edgeDiffractionEnabled');
    });

    it('edgeDiffractionEnabled in RayTracerSaveObject', () => {
      const match = typesSource.match(/export\s+type\s+RayTracerSaveObject\s*=\s*\{([\s\S]*?)\}/);
      expect(match).not.toBeNull();
      expect(match![1]).toContain('edgeDiffractionEnabled');
    });

    it('edgeDiffractionEnabled defaults to false', () => {
      expect(typesSource).toMatch(/edgeDiffractionEnabled:\s*false/);
    });
  });

  describe('diffraction/types.ts', () => {
    it('exports DiffractingEdge interface', () => {
      expect(diffTypesSource).toMatch(/export\s+interface\s+DiffractingEdge/);
    });

    it('DiffractingEdge has wedgeAngle and n', () => {
      const match = diffTypesSource.match(/export\s+interface\s+DiffractingEdge\s*\{([\s\S]*?)\}/);
      expect(match).not.toBeNull();
      expect(match![1]).toContain('wedgeAngle: number');
      expect(match![1]).toContain('n: number');
    });

    it('exports DiffractionPath interface', () => {
      expect(diffTypesSource).toMatch(/export\s+interface\s+DiffractionPath/);
    });

    it('DiffractionPath has bandEnergy', () => {
      const match = diffTypesSource.match(/export\s+interface\s+DiffractionPath\s*\{([\s\S]*?)\}/);
      expect(match).not.toBeNull();
      expect(match![1]).toContain('bandEnergy: number[]');
    });

    it('exports EdgeGraph interface', () => {
      expect(diffTypesSource).toMatch(/export\s+interface\s+EdgeGraph/);
    });
  });

  describe('diffraction/edge-graph.ts', () => {
    it('exports buildEdgeGraph function', () => {
      expect(edgeGraphSource).toMatch(/export\s+function\s+buildEdgeGraph/);
    });

    it('filters for convex edges (n > 1)', () => {
      expect(edgeGraphSource).toContain('n <= 1');
    });

    it('uses numbersEqualWithinTolerence', () => {
      expect(edgeGraphSource).toContain('numbersEqualWithinTolerence');
    });

    it('computes wedge angle from normals', () => {
      expect(edgeGraphSource).toContain('wedgeAngle');
      expect(edgeGraphSource).toContain('2 * Math.PI - interiorAngle');
    });

    it('rejects near-coplanar edges', () => {
      expect(edgeGraphSource).toContain('COPLANAR_THRESHOLD');
      expect(edgeGraphSource).toContain('interiorAngle < COPLANAR_THRESHOLD');
    });

    it('uses neighbor-cell hashing for robust vertex matching', () => {
      expect(edgeGraphSource).toContain('hashPointKeys');
    });
  });

  describe('diffraction/utd-coefficient.ts', () => {
    it('exports fresnelTransition function', () => {
      expect(utdCoefficientSource).toMatch(/export\s+function\s+fresnelTransition/);
    });

    it('exports computeWedgeAngles function', () => {
      expect(utdCoefficientSource).toMatch(/export\s+function\s+computeWedgeAngles/);
    });

    it('exports utdDiffractionCoefficient function', () => {
      expect(utdCoefficientSource).toMatch(/export\s+function\s+utdDiffractionCoefficient/);
    });

    it('uses Kouyoumjian-Pathak 4-term formulation', () => {
      // Should have 4 terms with cotangent and Fresnel
      expect(utdCoefficientSource).toContain('cot1');
      expect(utdCoefficientSource).toContain('cot2');
      expect(utdCoefficientSource).toContain('cot3');
      expect(utdCoefficientSource).toContain('cot4');
    });

    it('includes spreading factor A²', () => {
      expect(utdCoefficientSource).toContain('Spreading factor');
      expect(utdCoefficientSource).toContain('Dsq * A2');
    });
  });

  describe('diffraction/find-diffraction-paths.ts', () => {
    it('exports findDiffractionPoint function', () => {
      expect(findPathsSource).toMatch(/export\s+function\s+findDiffractionPoint/);
    });

    it('exports hasLineOfSight function', () => {
      expect(findPathsSource).toMatch(/export\s+function\s+hasLineOfSight/);
    });

    it('exports findDiffractionPaths function', () => {
      expect(findPathsSource).toMatch(/export\s+function\s+findDiffractionPaths/);
    });

    it('uses Fermat principle for diffraction point', () => {
      expect(findPathsSource).toContain('Fermat');
    });

    it('applies air absorption to diffraction paths', () => {
      expect(findPathsSource).toContain('airAtt');
      expect(findPathsSource).toContain('airAbsDb');
    });
  });

  describe('diffraction/index.ts barrel exports', () => {
    it('uses export type for type exports (isolatedModules)', () => {
      expect(diffIndexSource).toMatch(/export\s+type\s+\{/);
    });

    it('exports buildEdgeGraph', () => {
      expect(diffIndexSource).toContain('buildEdgeGraph');
    });

    it('exports fresnelTransition', () => {
      expect(diffIndexSource).toContain('fresnelTransition');
    });

    it('exports findDiffractionPaths', () => {
      expect(diffIndexSource).toContain('findDiffractionPaths');
    });
  });

  describe('index.ts integration', () => {
    it('imports diffraction module', () => {
      expect(indexSource).toContain("from \"./diffraction\"");
    });

    it('has edgeDiffractionEnabled property', () => {
      expect(indexSource).toContain('edgeDiffractionEnabled: boolean');
    });

    it('has _edgeGraph property', () => {
      expect(indexSource).toContain('_edgeGraph: EdgeGraph | null');
    });

    it('builds edge graph in start() when enabled', () => {
      const startMatch = indexSource.match(/start\(\)\s*\{([\s\S]*?)startAllMonteCarlo/);
      expect(startMatch).not.toBeNull();
      expect(startMatch![1]).toContain('edgeDiffractionEnabled');
      expect(startMatch![1]).toContain('buildEdgeGraph');
    });

    it('computes diffraction paths in stop()', () => {
      const stopMatch = indexSource.match(/stop\(\)\s*\{([\s\S]*?)reportImpulseResponse/);
      expect(stopMatch).not.toBeNull();
      expect(stopMatch![1]).toContain('_computeDiffractionPaths');
    });

    it('has _computeDiffractionPaths method', () => {
      expect(indexSource).toContain('_computeDiffractionPaths()');
    });

    it('save() includes edgeDiffractionEnabled', () => {
      const saveMatch = indexSource.match(/save\(\)\s*\{([\s\S]*?)\n\s{2}\}/);
      expect(saveMatch).not.toBeNull();
      expect(saveMatch![1]).toContain('edgeDiffractionEnabled');
    });

    it('constructor initializes edgeDiffractionEnabled from params', () => {
      expect(indexSource).toContain('params.edgeDiffractionEnabled ?? defaults.edgeDiffractionEnabled');
    });

    it('uses _pushPathWithEviction for diffraction paths', () => {
      expect(indexSource).toContain('this._pushPathWithEviction(dp.receiverId, rayPath)');
    });

    it('sets arrivalDirection on diffraction RayPaths', () => {
      const methodMatch = indexSource.match(/_computeDiffractionPaths\(\)\s*\{([\s\S]*?)\n\s{2}\}/);
      expect(methodMatch).not.toBeNull();
      expect(methodMatch![1]).toContain('arrivalDirection');
    });

    it('applies source directivity to diffraction band energies', () => {
      const methodMatch = indexSource.match(/_computeDiffractionPaths\(\)\s*\{([\s\S]*?)\n\s{2}\}/);
      expect(methodMatch).not.toBeNull();
      expect(methodMatch![1]).toContain('directivityHandler');
    });

    it('creates 2-segment chain for diffraction paths', () => {
      const methodMatch = indexSource.match(/_computeDiffractionPaths\(\)\s*\{([\s\S]*?)\n\s{2}\}/);
      expect(methodMatch).not.toBeNull();
      expect(methodMatch![1]).toContain('chainLength: 2');
    });
  });

  describe('RayTracerTab.tsx UI', () => {
    it('has Edge Diffraction checkbox', () => {
      expect(rayTracerTabSource).toContain('Edge Diffraction');
      expect(rayTracerTabSource).toContain('edgeDiffractionEnabled');
    });
  });

  // ── Unit tests for pure math functions ────────────────────────────

  describe('fresnelTransition', () => {
    it('F(0) → 0', () => {
      expect(fresnelTransition(0)).toBe(0);
    });

    it('F(large) → 1', () => {
      expect(fresnelTransition(1000)).toBeCloseTo(1, 2);
    });

    it('is monotonically increasing', () => {
      const values = [0, 0.01, 0.1, 0.5, 1, 2, 5, 10, 50, 100];
      for (let i = 1; i < values.length; i++) {
        expect(fresnelTransition(values[i])).toBeGreaterThanOrEqual(fresnelTransition(values[i - 1]));
      }
    });

    it('returns values in [0, 1]', () => {
      for (let x = 0; x <= 200; x += 0.5) {
        const f = fresnelTransition(x);
        expect(f).toBeGreaterThanOrEqual(0);
        expect(f).toBeLessThanOrEqual(1);
      }
    });

    it('handles negative input gracefully', () => {
      expect(fresnelTransition(-1)).toBeCloseTo(0, 5);
    });

    it('is continuous (no step discontinuity at any threshold)', () => {
      // Check continuity around x=100 (old code had a hard clamp there)
      const a = fresnelTransition(99);
      const b = fresnelTransition(100);
      const c = fresnelTransition(101);
      expect(Math.abs(b - a)).toBeLessThan(0.01);
      expect(Math.abs(c - b)).toBeLessThan(0.01);
    });
  });

  describe('utdDiffractionCoefficient', () => {
    const soundSpeed = 343;

    it('returns a non-negative value', () => {
      const result = utdDiffractionCoefficient(
        1000, 2, 5, 5, Math.PI / 2, Math.PI * 1.5, soundSpeed
      );
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('reciprocity: equal distances give same result when angles swapped', () => {
      // With equal source/receiver distances, the spreading factor is symmetric,
      // so swapping angles should yield the same result
      const n = 2; // half-plane
      const dist = 5;
      const phiS = Math.PI / 3;
      const phiR = Math.PI * 4 / 3;

      const forward = utdDiffractionCoefficient(1000, n, dist, dist, phiS, phiR, soundSpeed);
      const reverse = utdDiffractionCoefficient(1000, n, dist, dist, phiR, phiS, soundSpeed);

      expect(forward).toBeCloseTo(reverse, 6);
    });

    it('higher frequency gives different coefficient', () => {
      const params: [number, number, number, number, number] = [2, 5, 5, Math.PI / 2, Math.PI * 1.5];
      const lowFreq = utdDiffractionCoefficient(250, ...params, soundSpeed);
      const highFreq = utdDiffractionCoefficient(4000, ...params, soundSpeed);

      // Should be different (diffraction is frequency-dependent)
      expect(lowFreq).not.toBeCloseTo(highFreq, 4);
    });

    it('returns 0 for zero distance', () => {
      expect(utdDiffractionCoefficient(1000, 2, 0, 5, Math.PI / 2, Math.PI * 1.5, soundSpeed)).toBe(0);
      expect(utdDiffractionCoefficient(1000, 2, 5, 0, Math.PI / 2, Math.PI * 1.5, soundSpeed)).toBe(0);
    });
  });

  describe('findDiffractionPoint', () => {
    it('symmetric placement gives midpoint', () => {
      // Source and receiver symmetrically placed about edge midpoint
      const edgeStart: [number, number, number] = [0, 0, 0];
      const edgeEnd: [number, number, number] = [10, 0, 0];
      const sourcePos: [number, number, number] = [5, 3, 0];
      const receiverPos: [number, number, number] = [5, -3, 0];

      const pt = findDiffractionPoint(edgeStart, edgeEnd, sourcePos, receiverPos);

      expect(pt[0]).toBeCloseTo(5, 1);
      expect(pt[1]).toBeCloseTo(0, 1);
      expect(pt[2]).toBeCloseTo(0, 1);
    });

    it('result lies on edge segment', () => {
      const edgeStart: [number, number, number] = [0, 0, 0];
      const edgeEnd: [number, number, number] = [10, 0, 0];
      const sourcePos: [number, number, number] = [2, 5, 0];
      const receiverPos: [number, number, number] = [8, -3, 0];

      const pt = findDiffractionPoint(edgeStart, edgeEnd, sourcePos, receiverPos);

      // Project pt onto edge to verify t ∈ [0, 1]
      const t = (pt[0] - edgeStart[0]) / (edgeEnd[0] - edgeStart[0]);
      expect(t).toBeGreaterThanOrEqual(-0.01);
      expect(t).toBeLessThanOrEqual(1.01);
    });

    it('endpoint clamping when minimum is outside segment', () => {
      // Both source and receiver far to one side
      const edgeStart: [number, number, number] = [0, 0, 0];
      const edgeEnd: [number, number, number] = [10, 0, 0];
      const sourcePos: [number, number, number] = [-5, 3, 0];
      const receiverPos: [number, number, number] = [-3, -3, 0];

      const pt = findDiffractionPoint(edgeStart, edgeEnd, sourcePos, receiverPos);

      // Should be at or near the start endpoint
      expect(pt[0]).toBeCloseTo(0, 0);
    });
  });

  describe('buildEdgeGraph', () => {
    it('returns empty graph for empty surfaces', () => {
      const graph = buildEdgeGraph([]);
      expect(graph.edges).toHaveLength(0);
    });

    it('returns empty graph for single surface', () => {
      const surface = {
        uuid: 'surf1',
        edgeLoop: [
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 0, z: 0 },
          { x: 1, y: 1, z: 0 },
          { x: 0, y: 1, z: 0 },
        ],
        normal: { x: 0, y: 0, z: 1 },
      };
      const graph = buildEdgeGraph([surface]);
      expect(graph.edges).toHaveLength(0);
    });

    it('rejects coplanar surfaces as diffracting edges', () => {
      // Two coplanar surfaces sharing an edge (same normal direction)
      const surface1 = {
        uuid: 'coplanar1',
        edgeLoop: [
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 0, z: 0 },
          { x: 1, y: 1, z: 0 },
          { x: 0, y: 1, z: 0 },
        ],
        normal: { x: 0, y: 0, z: 1 },
      };
      const surface2 = {
        uuid: 'coplanar2',
        edgeLoop: [
          { x: 1, y: 0, z: 0 },
          { x: 2, y: 0, z: 0 },
          { x: 2, y: 1, z: 0 },
          { x: 1, y: 1, z: 0 },
        ],
        normal: { x: 0, y: 0, z: 1 },
      };

      const graph = buildEdgeGraph([surface1, surface2]);
      expect(graph.edges).toHaveLength(0);
    });

    it('finds shared convex edge between two surfaces', () => {
      // Two surfaces meeting at a 90-degree interior angle (270-degree exterior = convex)
      const surface1 = {
        uuid: 'surf1',
        edgeLoop: [
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 0, z: 0 },
          { x: 1, y: 1, z: 0 },
          { x: 0, y: 1, z: 0 },
        ],
        normal: { x: 0, y: 0, z: 1 },
      };
      const surface2 = {
        uuid: 'surf2',
        edgeLoop: [
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 0, z: 0 },
          { x: 1, y: 0, z: -1 },
          { x: 0, y: 0, z: -1 },
        ],
        normal: { x: 0, y: 1, z: 0 },
      };

      const graph = buildEdgeGraph([surface1, surface2]);

      // Should find the shared edge along y=0, z=0
      expect(graph.edges.length).toBeGreaterThanOrEqual(1);

      // The shared edge should be convex (exterior angle = 270° = 1.5*pi, n = 1.5)
      const sharedEdge = graph.edges[0];
      expect(sharedEdge.n).toBeGreaterThan(1);
      expect(sharedEdge.wedgeAngle).toBeGreaterThan(Math.PI);
    });
  });
});
