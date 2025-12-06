// Mock Three.js first before any imports
jest.mock('three', () => {
  const actual = jest.requireActual('../../__mocks__/three');
  return actual;
});

// Mock renderer to avoid Three.js ESM imports
jest.mock('../../render/renderer', () => ({
  renderer: {
    add: jest.fn(),
    remove: jest.fn(),
  },
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
  callContainerMethod: jest.fn(),
}));

// Mock chroma-js
jest.mock('chroma-js', () => ({
  __esModule: true,
  default: jest.fn((color) => ({
    brighten: jest.fn().mockReturnValue({
      num: jest.fn().mockReturnValue(0xffffff),
    }),
    num: jest.fn().mockReturnValue(0xffffff),
  })),
}));

// Mock asset-store
jest.mock('../asset-store', () => ({
  MATCAP_PORCELAIN_WHITE: null,
  MATCAP_UNDER_SHADOW: null,
}));

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

// Mock acoustics
jest.mock('../../compute/acoustics', () => ({
  P2I: jest.fn().mockReturnValue(1),
  Lp2P: jest.fn().mockReturnValue(1),
}));

import Source, { SourceSaveObject, SignalSource, DirectivityHandler } from '../source';

describe('Source', () => {
  describe('constructor', () => {
    it('creates a source with the given name', () => {
      const source = new Source('TestSource');
      expect(source.name).toBe('TestSource');
    });

    it('creates a source with default name when not provided', () => {
      const source = new Source();
      expect(source.name).toBe('new source');
    });

    it('has kind "source"', () => {
      const source = new Source('Test');
      expect(source.kind).toBe('source');
    });

    it('has default position at origin', () => {
      const source = new Source('Test');
      expect(source.position.x).toBe(0);
      expect(source.position.y).toBe(0);
      expect(source.position.z).toBe(0);
    });

    it('is not selected by default', () => {
      const source = new Source('Test');
      expect(source.selected).toBe(false);
    });

    it('initializes with default signal source as OSCILLATOR', () => {
      const source = new Source('Test');
      expect(source.signalSource).toBe(SignalSource.OSCILLATOR);
    });

    it('initializes fdtdSamples as empty array', () => {
      const source = new Source('Test');
      expect(Array.isArray(source.fdtdSamples)).toBe(true);
      expect(source.fdtdSamples.length).toBe(0);
    });

    it('initializes with default frequency of 100', () => {
      const source = new Source('Test');
      expect(source.frequency).toBe(100);
    });

    it('initializes with default amplitude of 1', () => {
      const source = new Source('Test');
      expect(source.amplitude).toBe(1);
    });

    it('initializes with default phase of 0', () => {
      const source = new Source('Test');
      expect(source.phase).toBe(0);
    });

    it('creates a directivityHandler', () => {
      const source = new Source('Test');
      expect(source.directivityHandler).toBeDefined();
    });
  });

  describe('signal sources', () => {
    describe('oscillator', () => {
      it('getOscillatorSample returns number', () => {
        const source = new Source('Test');
        source.signalSource = SignalSource.OSCILLATOR;
        source.frequency = 440;

        const sample = source.getOscillatorSample(0.001);
        expect(typeof sample).toBe('number');
      });

      it('getOscillatorSample produces sine wave values between -1 and 1', () => {
        const source = new Source('Test');
        source.amplitude = 1;
        source.frequency = 440;

        const samples: number[] = [];
        for (let i = 0; i < 100; i++) {
          samples.push(source.getOscillatorSample(i / 44100));
        }

        const max = Math.max(...samples);
        const min = Math.min(...samples);
        expect(max).toBeLessThanOrEqual(1.001);
        expect(min).toBeGreaterThanOrEqual(-1.001);
      });

      it('getOscillatorSample respects amplitude', () => {
        const source = new Source('Test');
        source.amplitude = 0.5;
        source.frequency = 440;

        const samples: number[] = [];
        for (let i = 0; i < 1000; i++) {
          samples.push(source.getOscillatorSample(i / 44100));
        }

        const max = Math.max(...samples);
        const min = Math.min(...samples);
        expect(max).toBeLessThanOrEqual(0.501);
        expect(min).toBeGreaterThanOrEqual(-0.501);
      });
    });

    describe('white noise', () => {
      it('getWhiteNoiseSample returns number', () => {
        const source = new Source('Test');
        const sample = source.getWhiteNoiseSample();
        expect(typeof sample).toBe('number');
      });

      it('getWhiteNoiseSample produces values between -1 and 1', () => {
        const source = new Source('Test');
        const samples: number[] = [];
        for (let i = 0; i < 1000; i++) {
          samples.push(source.getWhiteNoiseSample());
        }

        const max = Math.max(...samples);
        const min = Math.min(...samples);
        expect(max).toBeLessThanOrEqual(1);
        expect(min).toBeGreaterThanOrEqual(-1);
      });

      it('getWhiteNoiseSample produces different values on each call', () => {
        const source = new Source('Test');
        const sample1 = source.getWhiteNoiseSample();
        const sample2 = source.getWhiteNoiseSample();
        const sample3 = source.getWhiteNoiseSample();

        // With high probability, at least one should be different
        const allEqual = sample1 === sample2 && sample2 === sample3;
        expect(allEqual).toBe(false);
      });
    });

    describe('pink noise', () => {
      it('getPinkNoiseSample returns number', () => {
        const source = new Source('Test');
        const sample = source.getPinkNoiseSample(0);
        expect(typeof sample).toBe('number');
      });

      it('getPinkNoiseSample produces values in reasonable range', () => {
        const source = new Source('Test');
        const samples: number[] = [];
        for (let i = 0; i < 1000; i++) {
          samples.push(source.getPinkNoiseSample(i));
        }

        // Pink noise can exceed -1 to 1 due to filtering, but should be reasonable
        const max = Math.max(...samples);
        const min = Math.min(...samples);
        expect(max).toBeLessThan(10);
        expect(min).toBeGreaterThan(-10);
      });

      it('regenerates samples when buffer wraps around', () => {
        const source = new Source('Test');
        // Access samples near the end of the buffer to trigger regeneration
        const sample1 = source.getPinkNoiseSample(1023);
        const sample2 = source.getPinkNoiseSample(1024);
        expect(typeof sample1).toBe('number');
        expect(typeof sample2).toBe('number');
      });
    });

    describe('pulse', () => {
      it('getPulseSample returns amplitude at time 0', () => {
        const source = new Source('Test');
        source.amplitude = 1;
        source.frequency = 1;
        const sample = source.getPulseSample(0, 0.001);
        expect(sample).toBe(1);
      });

      it('getPulseSample returns 0 when not at pulse time', () => {
        const source = new Source('Test');
        source.amplitude = 1;
        source.frequency = 1;
        expect(source.getPulseSample(0.5, 0.001)).toBe(0);
        expect(source.getPulseSample(0.1, 0.001)).toBe(0);
      });
    });
  });

  describe('save', () => {
    it('returns a serializable object', () => {
      const source = new Source('TestSource');
      const saved = source.save();

      expect(typeof saved).toBe('object');
      expect(saved.name).toBe('TestSource');
      expect(saved.kind).toBe('source');
    });

    it('saves position as array', () => {
      const source = new Source('Test');
      source.position.set(1, 2, 3);

      const saved = source.save();
      expect(saved.position).toEqual([1, 2, 3]);
    });

    it('saves scale as array', () => {
      const source = new Source('Test');
      source.scale.set(2, 3, 4);

      const saved = source.save();
      expect(saved.scale).toEqual([2, 3, 4]);
    });

    it('saves rotation as array', () => {
      const source = new Source('Test');
      source.rotation.set(Math.PI / 4, Math.PI / 2, Math.PI);

      const saved = source.save();
      expect(saved.rotation.length).toBe(3);
      expect(saved.rotation[0]).toBeCloseTo(Math.PI / 4);
      expect(saved.rotation[1]).toBeCloseTo(Math.PI / 2);
      expect(saved.rotation[2]).toBeCloseTo(Math.PI);
    });

    it('saves visibility state', () => {
      const source = new Source('Test');
      source.visible = false;

      const saved = source.save();
      expect(saved.visible).toBe(false);
    });

    it('saves uuid', () => {
      const source = new Source('Test');
      const saved = source.save();

      expect(saved.uuid).toBe(source.uuid);
    });

    it('saves signal source configuration', () => {
      const source = new Source('Test');
      source.signalSource = SignalSource.WHITE_NOISE;
      source.frequency = 880;
      source.amplitude = 0.5;
      source.phase = Math.PI / 4;

      const saved = source.save();
      expect(saved.signalSource).toBe(SignalSource.WHITE_NOISE);
      expect(saved.frequency).toBe(880);
      expect(saved.amplitude).toBe(0.5);
      expect(saved.phase).toBe(Math.PI / 4);
    });

    it('produces JSON-serializable output', () => {
      const source = new Source('Test');
      source.position.set(1, 2, 3);

      const saved = source.save();
      const json = JSON.stringify(saved);
      const parsed = JSON.parse(json);

      expect(parsed.name).toBe('Test');
      expect(parsed.position).toEqual([1, 2, 3]);
    });
  });

  describe('restore', () => {
    it('restores name', () => {
      const source = new Source('Original');
      const saveData: SourceSaveObject = {
        name: 'Restored',
        kind: 'source',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        signalSource: SignalSource.OSCILLATOR,
        frequency: 440,
        amplitude: 1,
        phase: 0,
        color: 0xffffff,
      };

      source.restore(saveData);
      expect(source.name).toBe('Restored');
    });

    it('restores position', () => {
      const source = new Source('Test');
      const saveData: SourceSaveObject = {
        name: 'Test',
        kind: 'source',
        visible: true,
        position: [5, 10, 15],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        signalSource: SignalSource.OSCILLATOR,
        frequency: 440,
        amplitude: 1,
        phase: 0,
        color: 0xffffff,
      };

      source.restore(saveData);
      expect(source.position.x).toBe(5);
      expect(source.position.y).toBe(10);
      expect(source.position.z).toBe(15);
    });

    it('restores scale', () => {
      const source = new Source('Test');
      const saveData: SourceSaveObject = {
        name: 'Test',
        kind: 'source',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [2, 3, 4],
        uuid: 'test-uuid',
        signalSource: SignalSource.OSCILLATOR,
        frequency: 440,
        amplitude: 1,
        phase: 0,
        color: 0xffffff,
      };

      source.restore(saveData);
      expect(source.scale.x).toBe(2);
      expect(source.scale.y).toBe(3);
      expect(source.scale.z).toBe(4);
    });

    it('restores rotation', () => {
      const source = new Source('Test');
      const saveData: SourceSaveObject = {
        name: 'Test',
        kind: 'source',
        visible: true,
        position: [0, 0, 0],
        rotation: [Math.PI / 4, Math.PI / 2, Math.PI],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        signalSource: SignalSource.OSCILLATOR,
        frequency: 440,
        amplitude: 1,
        phase: 0,
        color: 0xffffff,
      };

      source.restore(saveData);
      expect(source.rotation.x).toBeCloseTo(Math.PI / 4);
      expect(source.rotation.y).toBeCloseTo(Math.PI / 2);
      expect(source.rotation.z).toBeCloseTo(Math.PI);
    });

    it('restores visibility', () => {
      const source = new Source('Test');
      source.visible = true;

      const saveData: SourceSaveObject = {
        name: 'Test',
        kind: 'source',
        visible: false,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        signalSource: SignalSource.OSCILLATOR,
        frequency: 440,
        amplitude: 1,
        phase: 0,
        color: 0xffffff,
      };

      source.restore(saveData);
      expect(source.visible).toBe(false);
    });

    it('restores uuid', () => {
      const source = new Source('Test');
      const originalUuid = source.uuid;

      const saveData: SourceSaveObject = {
        name: 'Test',
        kind: 'source',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'custom-uuid-12345',
        signalSource: SignalSource.OSCILLATOR,
        frequency: 440,
        amplitude: 1,
        phase: 0,
        color: 0xffffff,
      };

      source.restore(saveData);
      expect(source.uuid).toBe('custom-uuid-12345');
      expect(source.uuid).not.toBe(originalUuid);
    });

    it('restores signal source configuration', () => {
      const source = new Source('Test');
      const saveData: SourceSaveObject = {
        name: 'Test',
        kind: 'source',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        signalSource: SignalSource.WHITE_NOISE,
        frequency: 1000,
        amplitude: 0.75,
        phase: Math.PI,
        color: 0xffffff,
      };

      source.restore(saveData);
      expect(source.signalSource).toBe(SignalSource.WHITE_NOISE);
      expect(source.frequency).toBe(1000);
      expect(source.amplitude).toBe(0.75);
      expect(source.phase).toBe(Math.PI);
    });

    it('returns self for chaining', () => {
      const source = new Source('Test');
      const saveData: SourceSaveObject = {
        name: 'Test',
        kind: 'source',
        visible: true,
        position: [1, 2, 3],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        signalSource: SignalSource.OSCILLATOR,
        frequency: 440,
        amplitude: 1,
        phase: 0,
        color: 0xffffff,
      };

      const result = source.restore(saveData);
      expect(result).toBe(source);
    });
  });

  describe('save/restore round-trip', () => {
    it('preserves all properties through save/restore cycle', () => {
      const original = new Source('RoundTrip');
      original.position.set(1, 2, 3);
      original.rotation.set(0.1, 0.2, 0.3);
      original.scale.set(1.5, 2.0, 2.5);
      original.visible = false;
      original.signalSource = SignalSource.PINK_NOISE;
      original.frequency = 880;
      original.amplitude = 0.5;
      original.phase = Math.PI / 2;

      const saved = original.save();
      const restored = new Source('').restore(saved);

      expect(restored.name).toBe(original.name);
      expect(restored.uuid).toBe(original.uuid);
      expect(restored.visible).toBe(original.visible);
      expect(restored.signalSource).toBe(original.signalSource);
      expect(restored.frequency).toBe(original.frequency);
      expect(restored.amplitude).toBe(original.amplitude);
      expect(restored.phase).toBe(original.phase);
      expect(restored.position.x).toBeCloseTo(original.position.x);
      expect(restored.position.y).toBeCloseTo(original.position.y);
      expect(restored.position.z).toBeCloseTo(original.position.z);
    });

    it('survives JSON serialization round-trip', () => {
      const original = new Source('JSONTest');
      original.position.set(1.5, 2.5, 3.5);
      original.signalSource = SignalSource.OSCILLATOR;
      original.frequency = 523.25;

      const saved = original.save();
      const json = JSON.stringify(saved);
      const parsed = JSON.parse(json);
      const restored = new Source('').restore(parsed);

      expect(restored.name).toBe('JSONTest');
      expect(restored.position.x).toBeCloseTo(1.5);
      expect(restored.signalSource).toBe(SignalSource.OSCILLATOR);
      expect(restored.frequency).toBeCloseTo(523.25);
    });
  });

  describe('selection', () => {
    it('select() sets selected to true', () => {
      const source = new Source('Test');
      source.select();
      expect(source.selected).toBe(true);
    });

    it('deselect() sets selected to false', () => {
      const source = new Source('Test');
      source.select();
      source.deselect();
      expect(source.selected).toBe(false);
    });

    it('select() is idempotent', () => {
      const source = new Source('Test');
      source.select();
      source.select();
      expect(source.selected).toBe(true);
    });

    it('deselect() is idempotent', () => {
      const source = new Source('Test');
      source.deselect();
      source.deselect();
      expect(source.selected).toBe(false);
    });
  });

  describe('fdtdSamples', () => {
    it('recordSample adds value to fdtdSamples', () => {
      const source = new Source('Test');
      source.value = 0.5;
      source.recordSample();

      expect(source.fdtdSamples).toContain(0.5);
    });

    it('clearSamples empties fdtdSamples', () => {
      const source = new Source('Test');
      source.value = 0.5;
      source.recordSample();
      source.recordSample();

      source.clearSamples();
      expect(source.fdtdSamples.length).toBe(0);
    });
  });

  describe('SignalSource enum', () => {
    it('has expected signal source values', () => {
      expect(SignalSource.NONE).toBe(0);
      expect(SignalSource.OSCILLATOR).toBe(1);
      expect(SignalSource.PINK_NOISE).toBe(2);
      expect(SignalSource.WHITE_NOISE).toBe(3);
      expect(SignalSource.PULSE).toBe(4);
    });
  });

  describe('updateWave', () => {
    it('updates value based on signal source', () => {
      const source = new Source('Test');
      source.signalSource = SignalSource.OSCILLATOR;
      source.frequency = 440;
      source.amplitude = 1;

      source.updateWave(0.001, 0, 0.001);
      expect(typeof source.value).toBe('number');
    });

    it('sets value to 0 for NONE signal source', () => {
      const source = new Source('Test');
      source.signalSource = SignalSource.NONE;

      source.updateWave(0.001, 0, 0.001);
      expect(source.value).toBe(0);
    });

    it('calculates velocity as difference between current and previous value', () => {
      const source = new Source('Test');
      source.signalSource = SignalSource.OSCILLATOR;
      source.frequency = 440;
      source.amplitude = 1;
      source.value = 0;
      source.previousValue = 0;

      source.updateWave(0.001, 0, 0.001);
      expect(source.velocity).toBe(source.value - 0);
    });
  });

  describe('updatePreviousPosition', () => {
    it('stores current position as previous', () => {
      const source = new Source('Test');
      source.position.set(5, 10, 15);

      source.updatePreviousPosition();

      expect(source.previousX).toBe(5);
      expect(source.previousY).toBe(10);
      expect(source.previousZ).toBe(15);
    });
  });

  describe('initialSPL', () => {
    it('getter returns initial SPL', () => {
      const source = new Source('Test');
      expect(source.initialSPL).toBe(120);
    });

    it('setter updates initial SPL', () => {
      const source = new Source('Test');
      source.initialSPL = 100;
      expect(source.initialSPL).toBe(100);
    });
  });

  describe('dispose', () => {
    it('can be called without error', () => {
      const source = new Source('Test');
      expect(() => source.dispose()).not.toThrow();
    });
  });

  describe('brief property', () => {
    it('returns object with expected properties', () => {
      const source = new Source('TestSource');
      const brief = source.brief;

      expect(brief.uuid).toBe(source.uuid);
      expect(brief.name).toBe('TestSource');
      expect(brief.selected).toBe(false);
      expect(brief.kind).toBe('source');
      expect(brief.children).toEqual([]);
    });
  });
});

describe('DirectivityHandler', () => {
  describe('constructor', () => {
    it('creates omni directivity handler for type 0', () => {
      const handler = new DirectivityHandler(0);
      expect(handler.sourceDirType).toBe(0);
      expect(handler.frequencies).toEqual([0]);
      expect(handler.sensitivity).toEqual([90]);
    });

    it('creates CLF directivity handler for type 1 with import data', () => {
      const mockCLFData = {
        frequencies: [125, 250, 500, 1000],
        directivity: [],
        phi: [0, 10, 20],
        theta: [0, 10, 20],
        sensitivity: [90, 92, 94, 96],
        angleres: 10,
      };

      const handler = new DirectivityHandler(1, mockCLFData as any);
      expect(handler.sourceDirType).toBe(1);
      expect(handler.frequencies).toEqual([125, 250, 500, 1000]);
      expect(handler.sensitivity).toEqual([90, 92, 94, 96]);
    });

    it('handles unknown source type', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const handler = new DirectivityHandler(99);
      expect(handler.sourceDirType).toBe(99);
      expect(consoleSpy).toHaveBeenCalledWith('Unknown Source Directivity Type');
      consoleSpy.mockRestore();
    });
  });

  describe('getPressureAtPosition', () => {
    it('returns pressure for omni source', () => {
      const handler = new DirectivityHandler(0);
      const pressure = handler.getPressureAtPosition(0, 1000, 0, 0);
      expect(typeof pressure).toBe('number');
    });
  });
});
