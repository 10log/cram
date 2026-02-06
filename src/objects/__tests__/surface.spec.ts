// Mock Three.js first before any imports
jest.mock('three', () => {
  const actual = jest.requireActual('../../__mocks__/three');
  return actual;
});

// Mock VertexNormalsHelper from three/examples
jest.mock('three/examples/jsm/helpers/VertexNormalsHelper.js', () => ({
  VertexNormalsHelper: jest.fn().mockImplementation(() => ({
    visible: false,
    geometry: { name: '' },
  })),
}));

// Mock messenger
jest.mock('../../messenger', () => ({
  on: jest.fn(),
  emit: jest.fn(),
  off: jest.fn(),
}));

// Mock store
jest.mock('../../store', () => ({
  addContainer: jest.fn(() => jest.fn()),
  removeContainer: jest.fn(),
  setContainerProperty: jest.fn(),
}));

// Mock CSG
jest.mock('../../compute/csg', () => ({
  math: {
    vec3: {
      fromArray: jest.fn((arr) => arr),
    },
    plane: {
      fromPoints: jest.fn(() => [0, 0, 1, 0]),
    },
  },
  geometry: {
    poly3: {
      fromPointsAndPlane: jest.fn(() => ({
        vertices: [],
        plane: [0, 0, 1, 0],
      })),
    },
  },
}));

// Mock BRDF
jest.mock('../../compute/raytracer/brdf', () => ({
  BRDF: jest.fn().mockImplementation(() => ({})),
}));

// Mock interpolateAlpha
jest.mock('../../compute/acoustics/interpolate-alpha', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue((freq: number) => 0.5),
}));

// Mock reflectionCoefficient
jest.mock('../../compute/acoustics/reflection-coefficient', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(0.5),
}));

// Mock scatteringFunction — returns 0.42 to distinguish from old hardcoded 0.1
jest.mock('../../compute/acoustics/scattering-function', () => ({
  scatteringFunction: jest.fn().mockReturnValue((f: number) => 0.42),
}));

// Mock TessellateModifier
jest.mock('../../compute/radiance/TessellateModifier', () => ({
  TessellateModifier: jest.fn().mockImplementation(() => ({
    modify: jest.fn().mockReturnValue({
      getAttribute: jest.fn().mockReturnValue({
        count: 0,
        getX: jest.fn(),
        getY: jest.fn(),
        getZ: jest.fn(),
      }),
    }),
  })),
}));

// Mock SurfaceElement
jest.mock('../surface-element', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({})),
}));

// Create mock geometry before importing Surface
const createMockGeometry = () => {
  const THREE = jest.requireActual('../../__mocks__/three');
  const geometry = new THREE.BufferGeometry();
  // Create a simple triangle geometry
  const vertices = new Float32Array([
    0, 0, 0,
    1, 0, 0,
    0, 1, 0,
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  return geometry;
};

import Surface, { SurfaceSaveObject } from '../surface';
import { AcousticMaterial } from '../../db/acoustic-material';

// Mock acoustic material
const mockAcousticMaterial: AcousticMaterial = {
  uuid: 'mock-material-uuid',
  material: 'Test Material',
  manufacturer: 'Test Manufacturer',
  absorptionType: 'porous',
  tags: ['test'],
  absorption: {
    '63': 0.1,
    '125': 0.15,
    '250': 0.2,
    '500': 0.3,
    '1000': 0.4,
    '2000': 0.5,
    '4000': 0.6,
    '8000': 0.7,
  },
};

describe('Surface', () => {
  describe('constructor', () => {
    it('creates a surface with the given name', () => {
      const surface = new Surface('TestSurface');
      expect(surface.name).toBe('TestSurface');
    });

    it('has kind "surface"', () => {
      const surface = new Surface('Test');
      expect(surface.kind).toBe('surface');
    });

    it('initializes eventDestructors as empty array', () => {
      const surface = new Surface('Test');
      expect(Array.isArray(surface.eventDestructors)).toBe(true);
      expect(surface.eventDestructors.length).toBe(0);
    });

    it('creates surface with props when provided', () => {
      const THREE = jest.requireActual('../../__mocks__/three');
      const geometry = createMockGeometry();

      const surface = new Surface('WithProps', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      expect(surface.name).toBe('WithProps');
      expect(surface.kind).toBe('surface');
    });
  });

  describe('init', () => {
    it('initializes surface with geometry and acoustic material', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test');

      surface.init({
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      expect(surface.mesh).toBeDefined();
      expect(surface.wire).toBeDefined();
      expect(surface.edges).toBeDefined();
    });

    it('sets numHits to 0', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test');

      surface.init({
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      expect(surface.numHits).toBe(0);
    });

    it('creates _triangles array from geometry', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test');

      surface.init({
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      expect(Array.isArray(surface._triangles)).toBe(true);
      expect(surface._triangles.length).toBeGreaterThan(0);
    });
  });

  describe('destroyEvents', () => {
    it('calls and removes all event destructors', () => {
      const surface = new Surface('Test');
      const destructor1 = jest.fn();
      const destructor2 = jest.fn();

      surface.eventDestructors.push(destructor1, destructor2);
      surface.destroyEvents();

      expect(destructor1).toHaveBeenCalled();
      expect(destructor2).toHaveBeenCalled();
      expect(surface.eventDestructors.length).toBe(0);
    });
  });

  describe('dispose', () => {
    it('removes self from parent if parent exists', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      const THREE = jest.requireActual('../../__mocks__/three');
      const parent = new THREE.Object3D();
      parent.add(surface);

      expect(surface.parent).toBe(parent);

      surface.dispose();

      expect(parent.children).not.toContain(surface);
    });
  });

  describe('save', () => {
    it('returns a serializable object', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('TestSurface', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      const saved = surface.save();

      expect(typeof saved).toBe('object');
      expect(saved.name).toBe('TestSurface');
      expect(saved.kind).toBe('surface');
    });

    it('saves position as array', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });
      surface.position.set(1, 2, 3);

      const saved = surface.save();
      expect(saved.position).toEqual([1, 2, 3]);
    });

    it('saves visibility settings', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });
      surface.visible = false;

      const saved = surface.save();
      expect(saved.visible).toBe(false);
    });

    it('saves acoustic material', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      const saved = surface.save();
      expect(saved.acousticMaterial).toEqual(mockAcousticMaterial);
    });

    it('saves display settings', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
        wireframeVisible: true,
        edgesVisible: true,
        fillSurface: true,
      });

      const saved = surface.save();
      expect(saved.wireframeVisible).toBe(true);
      expect(saved.edgesVisible).toBe(true);
      expect(saved.fillSurface).toBe(true);
    });

    it('saves scattering coefficient', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
        scatteringCoefficient: 0.3,
      });

      const saved = surface.save();
      expect(saved.scatteringCoefficient).toBe(0.3);
    });
  });

  describe('restore', () => {
    it('restores visibility and acoustic properties from saved state', () => {
      const surface = new Surface('Original');
      const saveData: SurfaceSaveObject = {
        name: 'Restored',
        kind: 'surface',
        visible: false,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        acousticMaterial: mockAcousticMaterial,
        geometry: {
          data: {
            attributes: {
              position: {
                itemSize: 3,
                type: 'Float32Array',
                array: [0, 0, 0, 1, 0, 0, 0, 1, 0],
                normalized: false,
              },
            },
          },
        },
        wireframeVisible: false,
        edgesVisible: true,
        fillSurface: true,
        displayVertexNormals: false,
        scatteringCoefficient: 0.1,
      };

      surface.restore(saveData);
      // Note: Surface.restore() calls init() which doesn't restore name
      // The name is preserved from construction
      expect(surface.visible).toBe(false);
    });

    it('restores position', () => {
      const surface = new Surface('Test');
      const saveData: SurfaceSaveObject = {
        name: 'Test',
        kind: 'surface',
        visible: true,
        position: [5, 10, 15],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        acousticMaterial: mockAcousticMaterial,
        geometry: {
          data: {
            attributes: {
              position: {
                itemSize: 3,
                type: 'Float32Array',
                array: [0, 0, 0, 1, 0, 0, 0, 1, 0],
                normalized: false,
              },
            },
          },
        },
        wireframeVisible: false,
        edgesVisible: true,
        fillSurface: true,
        displayVertexNormals: false,
        scatteringCoefficient: 0.1,
      };

      surface.restore(saveData);
      expect(surface.position.x).toBe(5);
      expect(surface.position.y).toBe(10);
      expect(surface.position.z).toBe(15);
    });

    it('restores uuid', () => {
      const surface = new Surface('Test');
      const saveData: SurfaceSaveObject = {
        name: 'Test',
        kind: 'surface',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'custom-uuid-12345',
        acousticMaterial: mockAcousticMaterial,
        geometry: {
          data: {
            attributes: {
              position: {
                itemSize: 3,
                type: 'Float32Array',
                array: [0, 0, 0, 1, 0, 0, 0, 1, 0],
                normalized: false,
              },
            },
          },
        },
        wireframeVisible: false,
        edgesVisible: true,
        fillSurface: true,
        displayVertexNormals: false,
        scatteringCoefficient: 0.1,
      };

      surface.restore(saveData);
      expect(surface.uuid).toBe('custom-uuid-12345');
    });

    it('returns self for chaining', () => {
      const surface = new Surface('Test');
      const saveData: SurfaceSaveObject = {
        name: 'Test',
        kind: 'surface',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        acousticMaterial: mockAcousticMaterial,
        geometry: {
          data: {
            attributes: {
              position: {
                itemSize: 3,
                type: 'Float32Array',
                array: [0, 0, 0, 1, 0, 0, 0, 1, 0],
                normalized: false,
              },
            },
          },
        },
        wireframeVisible: false,
        edgesVisible: true,
        fillSurface: true,
        displayVertexNormals: false,
        scatteringCoefficient: 0.1,
      };

      const result = surface.restore(saveData);
      expect(result).toBe(surface);
    });
  });

  describe('selection', () => {
    it('select() sets selected to true', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      surface.select();
      expect(surface.selected).toBe(true);
    });

    it('deselect() sets selected to false', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      surface.select();
      surface.deselect();
      expect(surface.selected).toBe(false);
    });
  });

  describe('resetHits', () => {
    it('resets numHits to 0', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      surface.numHits = 100;
      surface.resetHits();
      expect(surface.numHits).toBe(0);
    });
  });

  describe('getArea', () => {
    it('calculates and returns area', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      const area = surface.getArea();
      expect(typeof area).toBe('number');
      expect(area).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getEdges', () => {
    it('returns the edges LineSegments', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      const edges = surface.getEdges();
      expect(edges).toBeDefined();
      expect(edges).toBe(surface.edges);
    });
  });

  describe('edgesVisible', () => {
    it('getter returns edges visibility', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
        edgesVisible: true,
      });

      expect(surface.edgesVisible).toBe(true);
    });

    it('setter updates edges visibility', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      surface.edgesVisible = false;
      expect(surface.edges.visible).toBe(false);
    });
  });

  describe('wireframeVisible', () => {
    it('getter returns wire visibility', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
        wireframeVisible: true,
      });

      expect(surface.wireframeVisible).toBe(true);
    });

    it('setter updates wire visibility', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      surface.wireframeVisible = true;
      expect(surface.wire.visible).toBe(true);
    });
  });

  describe('acousticMaterial', () => {
    it('getter returns the acoustic material', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      expect(surface.acousticMaterial).toEqual(mockAcousticMaterial);
    });

    it('setter updates absorption and reflection functions', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      const newMaterial: AcousticMaterial = {
        ...mockAcousticMaterial,
        uuid: 'new-material-uuid',
        material: 'New Material',
      };

      surface.acousticMaterial = newMaterial;
      expect(surface.acousticMaterial).toEqual(newMaterial);
    });
  });

  describe('scatteringCoefficient', () => {
    it('getter returns the scattering coefficient', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
        scatteringCoefficient: 0.2,
      });

      expect(surface.scatteringCoefficient).toBe(0.2);
    });

    it('setter updates scattering coefficient and function', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      surface.scatteringCoefficient = 0.5;
      expect(surface.scatteringCoefficient).toBe(0.5);
    });
  });

  describe('geometry', () => {
    it('getter returns mesh geometry', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      expect(surface.geometry).toBeDefined();
      expect(surface.geometry).toBe(surface.mesh.geometry);
    });
  });

  describe('faces', () => {
    it('getter returns _triangles', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      expect(surface.faces).toBe(surface._triangles);
    });
  });

  describe('brief property', () => {
    it('returns object with expected properties', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('TestSurface', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      const brief = surface.brief;

      expect(brief.uuid).toBe(surface.uuid);
      expect(brief.name).toBe('TestSurface');
      expect(brief.selected).toBe(false);
      expect(brief.kind).toBe('surface');
      expect(brief.children).toEqual([]);
    });
  });

  describe('isTessellated', () => {
    it('returns false when tessellatedMesh is null', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      expect(surface.isTessellated).toBe(false);
    });
  });

  describe('tessellatedMeshVisible', () => {
    it('returns false when tessellatedMesh is null', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      expect(surface.tessellatedMeshVisible).toBe(false);
    });

    it('setter does nothing when tessellatedMesh is null', () => {
      const geometry = createMockGeometry();
      const surface = new Surface('Test', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      // Should not throw
      surface.tessellatedMeshVisible = true;
      expect(surface.tessellatedMeshVisible).toBe(false);
    });
  });

  describe('BRDF uses scatteringFunction', () => {
    it('diffusionCoefficient comes from scatteringFunction not hardcoded 0.1', () => {
      const { BRDF } = require('../../compute/raytracer/brdf');
      (BRDF as jest.Mock).mockClear();

      const geometry = createMockGeometry();
      new Surface('BRDFTest', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      // BRDF should have been called for each frequency band
      expect(BRDF).toHaveBeenCalled();
      // scatteringFunction mock returns 0.42 — verify BRDF gets that, not 0.1
      const calls = (BRDF as jest.Mock).mock.calls;
      calls.forEach((call: any[]) => {
        expect(call[0].diffusionCoefficient).toBe(0.42);
      });
    });

    it('setter also uses scatteringFunction for BRDF', () => {
      const { BRDF } = require('../../compute/raytracer/brdf');
      const geometry = createMockGeometry();
      const surface = new Surface('BRDFTest', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      (BRDF as jest.Mock).mockClear();

      // Re-assign material to trigger setter
      const newMaterial: AcousticMaterial = {
        ...mockAcousticMaterial,
        uuid: 'new-material-uuid',
      };
      surface.acousticMaterial = newMaterial;

      expect(BRDF).toHaveBeenCalled();
      const calls = (BRDF as jest.Mock).mock.calls;
      calls.forEach((call: any[]) => {
        expect(call[0].diffusionCoefficient).toBe(0.42);
      });
    });
  });

  describe('material scattering data', () => {
    it('material with scattering overrides ISO lookup', () => {
      const interpolateAlpha = require('../../compute/acoustics/interpolate-alpha').default;
      (interpolateAlpha as jest.Mock).mockClear();

      const geometry = createMockGeometry();
      const surface = new Surface('ScatterTest', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
      });

      const materialWithScattering: AcousticMaterial = {
        ...mockAcousticMaterial,
        uuid: 'scatter-material-uuid',
        scattering: {
          '125': 0.05,
          '250': 0.1,
          '500': 0.2,
          '1000': 0.4,
          '2000': 0.6,
          '4000': 0.8,
        },
      };

      surface.acousticMaterial = materialWithScattering;

      // interpolateAlpha should be called with the scattering values
      // (once for absorption, once for scattering)
      const calls = (interpolateAlpha as jest.Mock).mock.calls;
      const scatteringCall = calls.find(
        (call: any[]) => Array.isArray(call[0]) && call[0].includes(0.2) && call[0].includes(0.8)
      );
      expect(scatteringCall).toBeDefined();
    });
  });

  describe('save/restore round-trip', () => {
    it('preserves key properties through save/restore cycle', () => {
      const geometry = createMockGeometry();
      const original = new Surface('RoundTrip', {
        geometry,
        acousticMaterial: mockAcousticMaterial,
        scatteringCoefficient: 0.25,
      });
      original.position.set(1, 2, 3);
      original.visible = false;

      const saved = original.save();
      // Note: Surface.restore() doesn't restore name, only position/rotation/scale/uuid
      const restored = new Surface('RoundTrip').restore(saved);

      expect(restored.uuid).toBe(original.uuid);
      expect(restored.visible).toBe(original.visible);
      expect(restored.scatteringCoefficient).toBe(original.scatteringCoefficient);
      expect(restored.position.x).toBeCloseTo(1);
      expect(restored.position.y).toBeCloseTo(2);
      expect(restored.position.z).toBeCloseTo(3);
    });
  });
});
