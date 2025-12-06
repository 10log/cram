/**
 * Material Store Tests
 *
 * Tests for the acoustic materials store that manages:
 * - Materials database (Map of AcousticMaterial)
 * - Fuzzy search functionality
 * - Selected material state
 * - Search query state
 */

import { useMaterial } from '../material-store';

describe('useMaterial', () => {
  // Store original state to restore after tests
  const originalState = useMaterial.getState();

  afterEach(() => {
    // Reset to original state
    useMaterial.setState(originalState);
  });

  describe('Initial State', () => {
    it('has materials Map populated from database', () => {
      const materials = useMaterial.getState().materials;
      expect(materials instanceof Map).toBe(true);
      expect(materials.size).toBeGreaterThan(0);
    });

    it('has empty selectedMaterial initially', () => {
      expect(useMaterial.getState().selectedMaterial).toBe('');
    });

    it('has empty query initially', () => {
      expect(useMaterial.getState().query).toBe('');
    });

    it('has bufferLength of 30', () => {
      expect(useMaterial.getState().bufferLength).toBe(30);
    });

    it('has materialSearcher instance', () => {
      const searcher = useMaterial.getState().materialSearcher;
      expect(searcher).toBeDefined();
      expect(typeof searcher.search).toBe('function');
    });

    it('has search function', () => {
      expect(typeof useMaterial.getState().search).toBe('function');
    });
  });

  describe('Materials Map', () => {
    it('materials are indexed by uuid', () => {
      const materials = useMaterial.getState().materials;
      const firstEntry = materials.entries().next().value;
      expect(firstEntry).toBeDefined();

      const [uuid, material] = firstEntry;
      expect(typeof uuid).toBe('string');
      expect(material.uuid).toBe(uuid);
    });

    it('each material has required properties', () => {
      const materials = useMaterial.getState().materials;
      const material = materials.values().next().value;

      expect(material).toHaveProperty('uuid');
      expect(material).toHaveProperty('material');
      expect(material).toHaveProperty('absorption');
    });

    it('can retrieve material by uuid', () => {
      const materials = useMaterial.getState().materials;
      const firstMaterial = materials.values().next().value;

      const retrieved = materials.get(firstMaterial.uuid);
      expect(retrieved).toBe(firstMaterial);
    });
  });

  describe('Search Functionality', () => {
    it('returns all materials when query is empty', () => {
      const allMaterials = useMaterial.getState().search('');
      const materialsMap = useMaterial.getState().materials;

      expect(allMaterials.length).toBe(materialsMap.size);
    });

    it('returns filtered results for search query', () => {
      const results = useMaterial.getState().search('concrete');

      // Should return some results containing "concrete"
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(useMaterial.getState().materials.size);
    });

    it('returns empty array for non-matching query', () => {
      const results = useMaterial.getState().search('xyznonexistent123');
      expect(results.length).toBe(0);
    });

    it('performs fuzzy matching', () => {
      // Fuzzy search should find results even with slight typos
      const results = useMaterial.getState().search('concret'); // missing 'e'
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('set() with Immer', () => {
    it('updates selectedMaterial via set()', () => {
      const materials = useMaterial.getState().materials;
      const firstUuid = materials.keys().next().value;

      useMaterial.getState().set((draft) => {
        draft.selectedMaterial = firstUuid;
      });

      expect(useMaterial.getState().selectedMaterial).toBe(firstUuid);
    });

    it('updates query via set()', () => {
      useMaterial.getState().set((draft) => {
        draft.query = 'glass';
      });

      expect(useMaterial.getState().query).toBe('glass');
    });

    it('updates bufferLength via set()', () => {
      useMaterial.getState().set((draft) => {
        draft.bufferLength = 50;
      });

      expect(useMaterial.getState().bufferLength).toBe(50);
    });
  });

  describe('Material Properties', () => {
    it('materials have absorption coefficients object', () => {
      const materials = useMaterial.getState().materials;
      const material = materials.values().next().value;

      expect(typeof material.absorption).toBe('object');
      expect(Object.keys(material.absorption).length).toBeGreaterThan(0);
    });

    it('absorption coefficients are between 0 and 1', () => {
      const materials = useMaterial.getState().materials;
      const material = materials.values().next().value;

      Object.values(material.absorption).forEach((alpha) => {
        expect(alpha).toBeGreaterThanOrEqual(0);
        expect(alpha).toBeLessThanOrEqual(1);
      });
    });

    it('absorption has frequency band keys', () => {
      const materials = useMaterial.getState().materials;
      const material = materials.values().next().value;

      // Standard octave band frequencies
      const freqKeys = Object.keys(material.absorption);
      expect(freqKeys).toContain('125');
      expect(freqKeys).toContain('500');
      expect(freqKeys).toContain('1000');
    });

    it('materials have string name', () => {
      const materials = useMaterial.getState().materials;
      const material = materials.values().next().value;

      expect(typeof material.material).toBe('string');
      expect(material.material.length).toBeGreaterThan(0);
    });
  });

  describe('State Persistence', () => {
    it('maintains materials Map after state updates', () => {
      const originalSize = useMaterial.getState().materials.size;

      useMaterial.getState().set((draft) => {
        draft.query = 'test';
      });

      expect(useMaterial.getState().materials.size).toBe(originalSize);
    });

    it('maintains search function after state updates', () => {
      useMaterial.getState().set((draft) => {
        draft.selectedMaterial = 'test-uuid';
      });

      const searchFn = useMaterial.getState().search;
      expect(typeof searchFn).toBe('function');

      // Search should still work
      const results = searchFn('');
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
