/**
 * Result Store Tests
 *
 * Tests for the simulation results store that manages:
 * - Results storage (KeyValuePair of Result objects)
 * - Result types (LevelTimeProgression, StatisticalRT60, ImpulseResponse, Default)
 * - Open tab index for results panel
 * - Helper functions (getResultKeys)
 */

import { useResult, ResultKind, getResultKeys, Result } from '../result-store';

describe('useResult', () => {
  // Store original state to restore after tests
  const originalState = useResult.getState();

  afterEach(() => {
    // Reset to original state
    useResult.setState(originalState);
  });

  describe('Initial State', () => {
    it('has empty results object initially', () => {
      const results = useResult.getState().results;
      expect(typeof results).toBe('object');
      expect(Object.keys(results).length).toBe(0);
    });

    it('has openTabIndex of 0 initially', () => {
      expect(useResult.getState().openTabIndex).toBe(0);
    });

    it('has set function', () => {
      expect(typeof useResult.getState().set).toBe('function');
    });
  });

  describe('ResultKind Enum', () => {
    it('has LevelTimeProgression kind', () => {
      expect(ResultKind.LevelTimeProgression).toBe('linear-time-progression');
    });

    it('has Default kind', () => {
      expect(ResultKind.Default).toBe('default');
    });

    it('has StatisticalRT60 kind', () => {
      expect(ResultKind.StatisticalRT60).toBe('statisticalRT60');
    });

    it('has ImpulseResponse kind', () => {
      expect(ResultKind.ImpulseResponse).toBe('impulseResponse');
    });
  });

  describe('set() with Immer', () => {
    it('adds result to results object', () => {
      const testResult: Result<ResultKind.Default> = {
        kind: ResultKind.Default,
        info: {},
        data: [1, 2, 3],
        name: 'Test Result',
        uuid: 'test-uuid-123',
        from: 'solver-uuid-456'
      };

      useResult.getState().set((draft) => {
        draft.results[testResult.uuid] = testResult;
      });

      expect(useResult.getState().results['test-uuid-123']).toEqual(testResult);
    });

    it('updates openTabIndex', () => {
      useResult.getState().set((draft) => {
        draft.openTabIndex = 2;
      });

      expect(useResult.getState().openTabIndex).toBe(2);
    });

    it('removes result from results object', () => {
      // First add a result
      useResult.getState().set((draft) => {
        draft.results['to-remove'] = {
          kind: ResultKind.Default,
          info: {},
          data: [],
          name: 'To Remove',
          uuid: 'to-remove',
          from: 'solver'
        };
      });

      expect(useResult.getState().results['to-remove']).toBeDefined();

      // Then remove it
      useResult.getState().set((draft) => {
        delete draft.results['to-remove'];
      });

      expect(useResult.getState().results['to-remove']).toBeUndefined();
    });

    it('updates existing result', () => {
      const uuid = 'update-test';

      // Add initial result
      useResult.getState().set((draft) => {
        draft.results[uuid] = {
          kind: ResultKind.Default,
          info: {},
          data: [1, 2],
          name: 'Original',
          uuid,
          from: 'solver'
        };
      });

      // Update it
      useResult.getState().set((draft) => {
        draft.results[uuid].name = 'Updated';
        draft.results[uuid].data = [1, 2, 3, 4];
      });

      const result = useResult.getState().results[uuid];
      expect(result.name).toBe('Updated');
      expect(result.data).toEqual([1, 2, 3, 4]);
    });
  });

  describe('getResultKeys()', () => {
    it('returns empty array when no results', () => {
      expect(getResultKeys()).toEqual([]);
    });

    it('returns array of result uuids', () => {
      useResult.getState().set((draft) => {
        draft.results['uuid-1'] = {
          kind: ResultKind.Default,
          info: {},
          data: [],
          name: 'Result 1',
          uuid: 'uuid-1',
          from: 'solver'
        };
        draft.results['uuid-2'] = {
          kind: ResultKind.Default,
          info: {},
          data: [],
          name: 'Result 2',
          uuid: 'uuid-2',
          from: 'solver'
        };
      });

      const keys = getResultKeys();
      expect(keys).toContain('uuid-1');
      expect(keys).toContain('uuid-2');
      expect(keys.length).toBe(2);
    });
  });

  describe('Result Types', () => {
    it('stores StatisticalRT60 result', () => {
      const rt60Result: Result<ResultKind.StatisticalRT60> = {
        kind: ResultKind.StatisticalRT60,
        info: {
          frequency: [125, 250, 500, 1000, 2000, 4000],
          airabsorption: true,
          humidity: 50,
          temperature: 20
        },
        data: [
          { sabine: 1.2, eyring: 1.1, ap: 1.15, frequency: 125 },
          { sabine: 1.0, eyring: 0.9, ap: 0.95, frequency: 250 }
        ],
        name: 'RT60 Analysis',
        uuid: 'rt60-uuid',
        from: 'rt60-solver'
      };

      useResult.getState().set((draft) => {
        draft.results[rt60Result.uuid] = rt60Result;
      });

      const stored = useResult.getState().results['rt60-uuid'] as Result<ResultKind.StatisticalRT60>;
      expect(stored.kind).toBe(ResultKind.StatisticalRT60);
      expect(stored.info.frequency).toEqual([125, 250, 500, 1000, 2000, 4000]);
      expect(stored.info.humidity).toBe(50);
      expect(stored.data[0].sabine).toBe(1.2);
    });

    it('stores ImpulseResponse result', () => {
      const irResult: Result<ResultKind.ImpulseResponse> = {
        kind: ResultKind.ImpulseResponse,
        info: {
          sampleRate: 44100,
          sourceName: 'Source 1',
          receiverName: 'Receiver 1'
        },
        data: [
          { time: 0, amplitude: 1.0 },
          { time: 0.001, amplitude: 0.8 },
          { time: 0.002, amplitude: 0.5 }
        ],
        name: 'IR Result',
        uuid: 'ir-uuid',
        from: 'raytracer'
      };

      useResult.getState().set((draft) => {
        draft.results[irResult.uuid] = irResult;
      });

      const stored = useResult.getState().results['ir-uuid'] as Result<ResultKind.ImpulseResponse>;
      expect(stored.kind).toBe(ResultKind.ImpulseResponse);
      expect(stored.info.sampleRate).toBe(44100);
      expect(stored.data.length).toBe(3);
    });

    it('stores LevelTimeProgression result', () => {
      const ltpResult: Result<ResultKind.LevelTimeProgression> = {
        kind: ResultKind.LevelTimeProgression,
        info: {
          initialSPL: [80, 82, 85, 88, 90, 92],
          frequency: [125, 250, 500, 1000, 2000, 4000],
          maxOrder: 10
        },
        data: [
          { time: 0.01, pressure: [0.1, 0.2], order: 1, arrival: 0.01, uuid: 'ray-1' },
          { time: 0.02, pressure: [0.08, 0.15], order: 2, arrival: 0.02, uuid: 'ray-2' }
        ],
        name: 'Level Progression',
        uuid: 'ltp-uuid',
        from: 'image-source'
      };

      useResult.getState().set((draft) => {
        draft.results[ltpResult.uuid] = ltpResult;
      });

      const stored = useResult.getState().results['ltp-uuid'] as Result<ResultKind.LevelTimeProgression>;
      expect(stored.kind).toBe(ResultKind.LevelTimeProgression);
      expect(stored.info.maxOrder).toBe(10);
      expect(stored.data[0].order).toBe(1);
    });
  });

  describe('Multiple Results Management', () => {
    it('stores multiple results of different types', () => {
      useResult.getState().set((draft) => {
        draft.results['default-1'] = {
          kind: ResultKind.Default,
          info: {},
          data: [1, 2, 3],
          name: 'Default Result',
          uuid: 'default-1',
          from: 'solver-1'
        };
        draft.results['rt60-1'] = {
          kind: ResultKind.StatisticalRT60,
          info: {
            frequency: [125, 250, 500, 1000, 2000, 4000],
            airabsorption: false,
            humidity: 40,
            temperature: 22
          },
          data: [],
          name: 'RT60 Result',
          uuid: 'rt60-1',
          from: 'solver-2'
        };
      });

      const results = useResult.getState().results;
      expect(Object.keys(results).length).toBe(2);
      expect(results['default-1'].kind).toBe(ResultKind.Default);
      expect(results['rt60-1'].kind).toBe(ResultKind.StatisticalRT60);
    });

    it('maintains result integrity after multiple operations', () => {
      // Add
      useResult.getState().set((draft) => {
        draft.results['a'] = { kind: ResultKind.Default, info: {}, data: [1], name: 'A', uuid: 'a', from: 's' };
        draft.results['b'] = { kind: ResultKind.Default, info: {}, data: [2], name: 'B', uuid: 'b', from: 's' };
        draft.results['c'] = { kind: ResultKind.Default, info: {}, data: [3], name: 'C', uuid: 'c', from: 's' };
      });

      // Remove one
      useResult.getState().set((draft) => {
        delete draft.results['b'];
      });

      // Update another
      useResult.getState().set((draft) => {
        draft.results['a'].name = 'Updated A';
      });

      const results = useResult.getState().results;
      expect(Object.keys(results).length).toBe(2);
      expect(results['a'].name).toBe('Updated A');
      expect(results['b']).toBeUndefined();
      expect(results['c'].name).toBe('C');
    });
  });

  describe('Tab Index Management', () => {
    it('updates tab index independently of results', () => {
      useResult.getState().set((draft) => {
        draft.results['test'] = { kind: ResultKind.Default, info: {}, data: [], name: 'Test', uuid: 'test', from: 's' };
        draft.openTabIndex = 5;
      });

      expect(useResult.getState().openTabIndex).toBe(5);
      expect(Object.keys(useResult.getState().results).length).toBe(1);
    });

    it('can reset tab index to 0', () => {
      useResult.getState().set((draft) => {
        draft.openTabIndex = 10;
      });

      useResult.getState().set((draft) => {
        draft.openTabIndex = 0;
      });

      expect(useResult.getState().openTabIndex).toBe(0);
    });
  });
});
