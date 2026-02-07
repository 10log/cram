// Mock Three.js first before any imports
vi.mock('three', () => {
  const actual = jest.requireActual('../../__mocks__/three');
  return actual;
});

// Mock renderer to avoid Three.js ESM imports
vi.mock('../../render/renderer', () => ({
  renderer: {
    add: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock messenger
vi.mock('../../messenger', () => ({
  on: vi.fn(),
  emit: vi.fn(),
  off: vi.fn(),
}));

// Mock store
vi.mock('../../store', () => ({
  addContainer: vi.fn(() => vi.fn()),
  removeContainer: vi.fn(),
  setContainerProperty: vi.fn(),
}));

// Mock chroma-js
vi.mock('chroma-js', () => ({
  __esModule: true,
  default: vi.fn((color) => ({
    brighten: vi.fn().mockReturnValue({
      num: vi.fn().mockReturnValue(0xffffff),
    }),
    num: vi.fn().mockReturnValue(0xffffff),
  })),
}));

// Mock asset-store
vi.mock('../asset-store', () => ({
  MATCAP_PORCELAIN_WHITE: null,
  MATCAP_UNDER_SHADOW: null,
}));

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

import Receiver, { ReceiverSaveObject, ReceiverPattern, receiverPatternGain } from '../receiver';

describe('Receiver', () => {
  describe('constructor', () => {
    it('creates a receiver with the given name', () => {
      const receiver = new Receiver('TestReceiver');
      expect(receiver.name).toBe('TestReceiver');
    });

    it('creates a receiver with default name when not provided', () => {
      const receiver = new Receiver();
      expect(receiver.name).toBe('new receiver');
    });

    it('has kind "receiver"', () => {
      const receiver = new Receiver('Test');
      expect(receiver.kind).toBe('receiver');
    });

    it('has default position at origin', () => {
      const receiver = new Receiver('Test');
      expect(receiver.position.x).toBe(0);
      expect(receiver.position.y).toBe(0);
      expect(receiver.position.z).toBe(0);
    });

    it('is not selected by default', () => {
      const receiver = new Receiver('Test');
      expect(receiver.selected).toBe(false);
    });

    it('initializes fdtdSamples as empty array', () => {
      const receiver = new Receiver('Test');
      expect(Array.isArray(receiver.fdtdSamples)).toBe(true);
      expect(receiver.fdtdSamples.length).toBe(0);
    });

    it('has default scale of 1', () => {
      const receiver = new Receiver('Test');
      expect(receiver.scale.x).toBe(1);
      expect(receiver.scale.y).toBe(1);
      expect(receiver.scale.z).toBe(1);
    });

    it('has default rotation of 0', () => {
      const receiver = new Receiver('Test');
      expect(receiver.rotation.x).toBe(0);
      expect(receiver.rotation.y).toBe(0);
      expect(receiver.rotation.z).toBe(0);
    });
  });

  describe('save', () => {
    it('returns a serializable object', () => {
      const receiver = new Receiver('TestReceiver');
      const saved = receiver.save();

      expect(typeof saved).toBe('object');
      expect(saved.name).toBe('TestReceiver');
      expect(saved.kind).toBe('receiver');
    });

    it('saves position as array', () => {
      const receiver = new Receiver('Test');
      receiver.position.set(1, 2, 3);

      const saved = receiver.save();
      expect(saved.position).toEqual([1, 2, 3]);
    });

    it('saves scale as array', () => {
      const receiver = new Receiver('Test');
      receiver.scale.set(2, 3, 4);

      const saved = receiver.save();
      expect(saved.scale).toEqual([2, 3, 4]);
    });

    it('saves rotation as array', () => {
      const receiver = new Receiver('Test');
      receiver.rotation.set(Math.PI / 4, Math.PI / 2, Math.PI);

      const saved = receiver.save();
      expect(saved.rotation.length).toBe(3);
      expect(saved.rotation[0]).toBeCloseTo(Math.PI / 4);
      expect(saved.rotation[1]).toBeCloseTo(Math.PI / 2);
      expect(saved.rotation[2]).toBeCloseTo(Math.PI);
    });

    it('saves visibility state', () => {
      const receiver = new Receiver('Test');
      receiver.visible = false;

      const saved = receiver.save();
      expect(saved.visible).toBe(false);
    });

    it('saves uuid', () => {
      const receiver = new Receiver('Test');
      const saved = receiver.save();

      expect(saved.uuid).toBe(receiver.uuid);
    });

    it('produces JSON-serializable output', () => {
      const receiver = new Receiver('Test');
      receiver.position.set(1, 2, 3);

      const saved = receiver.save();
      const json = JSON.stringify(saved);
      const parsed = JSON.parse(json);

      expect(parsed.name).toBe('Test');
      expect(parsed.position).toEqual([1, 2, 3]);
    });
  });

  describe('restore', () => {
    it('restores name', () => {
      const receiver = new Receiver('Original');
      const saveData: ReceiverSaveObject = {
        name: 'Restored',
        kind: 'receiver',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        color: 0xffffff,
      };

      receiver.restore(saveData);
      expect(receiver.name).toBe('Restored');
    });

    it('restores position', () => {
      const receiver = new Receiver('Test');
      const saveData: ReceiverSaveObject = {
        name: 'Test',
        kind: 'receiver',
        visible: true,
        position: [5, 10, 15],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        color: 0xffffff,
      };

      receiver.restore(saveData);
      expect(receiver.position.x).toBe(5);
      expect(receiver.position.y).toBe(10);
      expect(receiver.position.z).toBe(15);
    });

    it('restores scale', () => {
      const receiver = new Receiver('Test');
      const saveData: ReceiverSaveObject = {
        name: 'Test',
        kind: 'receiver',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [2, 3, 4],
        uuid: 'test-uuid',
        color: 0xffffff,
      };

      receiver.restore(saveData);
      expect(receiver.scale.x).toBe(2);
      expect(receiver.scale.y).toBe(3);
      expect(receiver.scale.z).toBe(4);
    });

    it('restores rotation', () => {
      const receiver = new Receiver('Test');
      const saveData: ReceiverSaveObject = {
        name: 'Test',
        kind: 'receiver',
        visible: true,
        position: [0, 0, 0],
        rotation: [Math.PI / 4, Math.PI / 2, Math.PI],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        color: 0xffffff,
      };

      receiver.restore(saveData);
      expect(receiver.rotation.x).toBeCloseTo(Math.PI / 4);
      expect(receiver.rotation.y).toBeCloseTo(Math.PI / 2);
      expect(receiver.rotation.z).toBeCloseTo(Math.PI);
    });

    it('restores visibility', () => {
      const receiver = new Receiver('Test');
      receiver.visible = true;

      const saveData: ReceiverSaveObject = {
        name: 'Test',
        kind: 'receiver',
        visible: false,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        color: 0xffffff,
      };

      receiver.restore(saveData);
      expect(receiver.visible).toBe(false);
    });

    it('restores uuid', () => {
      const receiver = new Receiver('Test');
      const originalUuid = receiver.uuid;

      const saveData: ReceiverSaveObject = {
        name: 'Test',
        kind: 'receiver',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'custom-uuid-12345',
        color: 0xffffff,
      };

      receiver.restore(saveData);
      expect(receiver.uuid).toBe('custom-uuid-12345');
      expect(receiver.uuid).not.toBe(originalUuid);
    });

    it('returns self for chaining', () => {
      const receiver = new Receiver('Test');
      const saveData: ReceiverSaveObject = {
        name: 'Test',
        kind: 'receiver',
        visible: true,
        position: [1, 2, 3],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        color: 0xffffff,
      };

      const result = receiver.restore(saveData);
      expect(result).toBe(receiver);
    });
  });

  describe('save/restore round-trip', () => {
    it('preserves all properties through save/restore cycle', () => {
      const original = new Receiver('RoundTrip');
      original.position.set(1, 2, 3);
      original.rotation.set(0.1, 0.2, 0.3);
      original.scale.set(1.5, 2.0, 2.5);
      original.visible = false;

      const saved = original.save();
      const restored = new Receiver('').restore(saved);

      expect(restored.name).toBe(original.name);
      expect(restored.uuid).toBe(original.uuid);
      expect(restored.visible).toBe(original.visible);
      expect(restored.position.x).toBeCloseTo(original.position.x);
      expect(restored.position.y).toBeCloseTo(original.position.y);
      expect(restored.position.z).toBeCloseTo(original.position.z);
      expect(restored.rotation.x).toBeCloseTo(original.rotation.x);
      expect(restored.rotation.y).toBeCloseTo(original.rotation.y);
      expect(restored.rotation.z).toBeCloseTo(original.rotation.z);
      expect(restored.scale.x).toBeCloseTo(original.scale.x);
      expect(restored.scale.y).toBeCloseTo(original.scale.y);
      expect(restored.scale.z).toBeCloseTo(original.scale.z);
    });

    it('survives JSON serialization round-trip', () => {
      const original = new Receiver('JSONTest');
      original.position.set(1.5, 2.5, 3.5);

      const saved = original.save();
      const json = JSON.stringify(saved);
      const parsed = JSON.parse(json);
      const restored = new Receiver('').restore(parsed);

      expect(restored.name).toBe('JSONTest');
      expect(restored.position.x).toBeCloseTo(1.5);
      expect(restored.position.y).toBeCloseTo(2.5);
      expect(restored.position.z).toBeCloseTo(3.5);
    });
  });

  describe('position accessors', () => {
    it('x getter returns position.x', () => {
      const receiver = new Receiver('Test');
      receiver.position.set(5, 0, 0);
      expect(receiver.x).toBe(5);
    });

    it('x setter updates position.x', () => {
      const receiver = new Receiver('Test');
      receiver.x = 10;
      expect(receiver.position.x).toBe(10);
    });

    it('y getter returns position.y', () => {
      const receiver = new Receiver('Test');
      receiver.position.set(0, 5, 0);
      expect(receiver.y).toBe(5);
    });

    it('y setter updates position.y', () => {
      const receiver = new Receiver('Test');
      receiver.y = 10;
      expect(receiver.position.y).toBe(10);
    });

    it('z getter returns position.z', () => {
      const receiver = new Receiver('Test');
      receiver.position.set(0, 0, 5);
      expect(receiver.z).toBe(5);
    });

    it('z setter updates position.z', () => {
      const receiver = new Receiver('Test');
      receiver.z = 10;
      expect(receiver.position.z).toBe(10);
    });
  });

  describe('scale accessors', () => {
    it('scalex getter/setter work correctly', () => {
      const receiver = new Receiver('Test');
      receiver.scalex = 2;
      expect(receiver.scalex).toBe(2);
      expect(receiver.scale.x).toBe(2);
    });

    it('scaley getter/setter work correctly', () => {
      const receiver = new Receiver('Test');
      receiver.scaley = 3;
      expect(receiver.scaley).toBe(3);
      expect(receiver.scale.y).toBe(3);
    });

    it('scalez getter/setter work correctly', () => {
      const receiver = new Receiver('Test');
      receiver.scalez = 4;
      expect(receiver.scalez).toBe(4);
      expect(receiver.scale.z).toBe(4);
    });
  });

  describe('rotation accessors', () => {
    it('rotationx getter/setter work correctly', () => {
      const receiver = new Receiver('Test');
      receiver.rotationx = Math.PI / 4;
      expect(receiver.rotationx).toBeCloseTo(Math.PI / 4);
      expect(receiver.rotation.x).toBeCloseTo(Math.PI / 4);
    });

    it('rotationy getter/setter work correctly', () => {
      const receiver = new Receiver('Test');
      receiver.rotationy = Math.PI / 2;
      expect(receiver.rotationy).toBeCloseTo(Math.PI / 2);
      expect(receiver.rotation.y).toBeCloseTo(Math.PI / 2);
    });

    it('rotationz getter/setter work correctly', () => {
      const receiver = new Receiver('Test');
      receiver.rotationz = Math.PI;
      expect(receiver.rotationz).toBeCloseTo(Math.PI);
      expect(receiver.rotation.z).toBeCloseTo(Math.PI);
    });
  });

  describe('selection', () => {
    it('select() sets selected to true', () => {
      const receiver = new Receiver('Test');
      receiver.select();
      expect(receiver.selected).toBe(true);
    });

    it('deselect() sets selected to false', () => {
      const receiver = new Receiver('Test');
      receiver.select();
      receiver.deselect();
      expect(receiver.selected).toBe(false);
    });

    it('select() is idempotent', () => {
      const receiver = new Receiver('Test');
      receiver.select();
      receiver.select();
      expect(receiver.selected).toBe(true);
    });

    it('deselect() is idempotent', () => {
      const receiver = new Receiver('Test');
      receiver.deselect();
      receiver.deselect();
      expect(receiver.selected).toBe(false);
    });
  });

  describe('fdtdSamples', () => {
    it('can store FDTD samples', () => {
      const receiver = new Receiver('Test');
      receiver.fdtdSamples.push(0.5, 0.3, 0.1, -0.2, -0.1);

      expect(receiver.fdtdSamples).toEqual([0.5, 0.3, 0.1, -0.2, -0.1]);
    });

    it('clearSamples empties fdtdSamples', () => {
      const receiver = new Receiver('Test');
      receiver.fdtdSamples.push(0.1, 0.2, 0.3);

      receiver.clearSamples();
      expect(receiver.fdtdSamples.length).toBe(0);
    });
  });

  describe('traverse', () => {
    it('calls callback for self', () => {
      const receiver = new Receiver('Test');
      const visited: string[] = [];

      receiver.traverse((obj) => visited.push(obj.name));

      expect(visited).toContain('Test');
    });
  });

  describe('dispose', () => {
    it('can be called without error', () => {
      const receiver = new Receiver('Test');
      expect(() => receiver.dispose()).not.toThrow();
    });
  });

  describe('brief property', () => {
    it('returns object with expected properties', () => {
      const receiver = new Receiver('TestReceiver');
      const brief = receiver.brief;

      expect(brief.uuid).toBe(receiver.uuid);
      expect(brief.name).toBe('TestReceiver');
      expect(brief.selected).toBe(false);
      expect(brief.kind).toBe('receiver');
    });
  });

  describe('color', () => {
    it('getter returns color as hex string', () => {
      const receiver = new Receiver('Test');
      const color = receiver.color;
      expect(typeof color).toBe('string');
      expect(color.startsWith('#')).toBe(true);
    });

    it('getColorAsNumber returns numeric color value', () => {
      const receiver = new Receiver('Test');
      const color = receiver.getColorAsNumber();
      expect(typeof color).toBe('number');
    });

    it('getColorAsString returns hex string', () => {
      const receiver = new Receiver('Test');
      const color = receiver.getColorAsString();
      expect(typeof color).toBe('string');
      expect(color.startsWith('#')).toBe(true);
    });
  });

  describe('directivity', () => {
    it('defaults to omnidirectional', () => {
      const receiver = new Receiver('Test');
      expect(receiver.directivityPattern).toBe(ReceiverPattern.OMNIDIRECTIONAL);
    });

    it('getGain returns 1.0 for omnidirectional pattern regardless of direction', () => {
      const receiver = new Receiver('Test');
      expect(receiver.getGain([0, 0, 1])).toBe(1.0);
      expect(receiver.getGain([1, 0, 0])).toBe(1.0);
      expect(receiver.getGain([0, 0, -1])).toBe(1.0);
    });

    it('cardioid: gain = 1.0 on-axis (front), 0.0 at rear', () => {
      const receiver = new Receiver('Test');
      receiver.directivityPattern = ReceiverPattern.CARDIOID;
      // Forward axis is (0,0,1) by default (no rotation)
      expect(receiver.getGain([0, 0, 1])).toBeCloseTo(1.0, 5);
      expect(receiver.getGain([0, 0, -1])).toBeCloseTo(0.0, 5);
    });

    it('cardioid: gain = 0.5 at 90 degrees', () => {
      const receiver = new Receiver('Test');
      receiver.directivityPattern = ReceiverPattern.CARDIOID;
      expect(receiver.getGain([1, 0, 0])).toBeCloseTo(0.5, 5);
    });

    it('supercardioid: gain = 1.0 on-axis, < 0 at rear', () => {
      const receiver = new Receiver('Test');
      receiver.directivityPattern = ReceiverPattern.SUPERCARDIOID;
      expect(receiver.getGain([0, 0, 1])).toBeCloseTo(1.0, 5);
      // 180 degrees: 0.37 + 0.63 * cos(pi) = 0.37 - 0.63 = -0.26
      expect(receiver.getGain([0, 0, -1])).toBeCloseTo(-0.26, 2);
    });

    it('figure-eight: gain = 1.0 on-axis, 0.0 at 90 degrees, -1.0 at rear', () => {
      const receiver = new Receiver('Test');
      receiver.directivityPattern = ReceiverPattern.FIGURE_EIGHT;
      expect(receiver.getGain([0, 0, 1])).toBeCloseTo(1.0, 5);
      expect(receiver.getGain([1, 0, 0])).toBeCloseTo(0.0, 5);
      expect(receiver.getGain([0, 0, -1])).toBeCloseTo(-1.0, 5);
    });

    it('respects receiver rotation for directivity', () => {
      const receiver = new Receiver('Test');
      receiver.directivityPattern = ReceiverPattern.CARDIOID;
      // Rotate 90 degrees around Y axis: forward becomes (1,0,0)
      receiver.rotation.set(0, Math.PI / 2, 0);
      expect(receiver.getGain([1, 0, 0])).toBeCloseTo(1.0, 2);
      expect(receiver.getGain([-1, 0, 0])).toBeCloseTo(0.0, 2);
    });

    it('save/restore round-trip preserves directivity pattern', () => {
      const original = new Receiver('DirTest');
      original.directivityPattern = ReceiverPattern.CARDIOID;
      const saved = original.save();
      expect(saved.directivityPattern).toBe('cardioid');

      const restored = new Receiver('').restore(saved);
      expect(restored.directivityPattern).toBe(ReceiverPattern.CARDIOID);
    });

    it('restore without directivityPattern resets to omnidirectional', () => {
      const receiver = new Receiver('Test');
      receiver.directivityPattern = ReceiverPattern.CARDIOID;
      const oldSaveData: ReceiverSaveObject = {
        name: 'Test',
        kind: 'receiver',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
        color: 0xffffff,
        // no directivityPattern field — simulates pre-directivity save data
      };
      receiver.restore(oldSaveData);
      // Missing directivityPattern resets to omnidirectional default
      expect(receiver.directivityPattern).toBe(ReceiverPattern.OMNIDIRECTIONAL);

      const fresh = new Receiver('Fresh');
      fresh.restore(oldSaveData);
      expect(fresh.directivityPattern).toBe(ReceiverPattern.OMNIDIRECTIONAL);
    });
  });

  describe('receiverPatternGain (standalone)', () => {
    it('omni: always 1.0', () => {
      expect(receiverPatternGain(ReceiverPattern.OMNIDIRECTIONAL, 0)).toBe(1.0);
      expect(receiverPatternGain(ReceiverPattern.OMNIDIRECTIONAL, Math.PI)).toBe(1.0);
      expect(receiverPatternGain(ReceiverPattern.OMNIDIRECTIONAL, Math.PI / 2)).toBe(1.0);
    });

    it('cardioid: 0.5 + 0.5*cos(theta)', () => {
      expect(receiverPatternGain(ReceiverPattern.CARDIOID, 0)).toBeCloseTo(1.0);
      expect(receiverPatternGain(ReceiverPattern.CARDIOID, Math.PI / 2)).toBeCloseTo(0.5);
      expect(receiverPatternGain(ReceiverPattern.CARDIOID, Math.PI)).toBeCloseTo(0.0);
    });

    it('supercardioid: 0.37 + 0.63*cos(theta)', () => {
      expect(receiverPatternGain(ReceiverPattern.SUPERCARDIOID, 0)).toBeCloseTo(1.0);
      expect(receiverPatternGain(ReceiverPattern.SUPERCARDIOID, Math.PI / 2)).toBeCloseTo(0.37);
      expect(receiverPatternGain(ReceiverPattern.SUPERCARDIOID, Math.PI)).toBeCloseTo(-0.26);
    });

    it('figure-eight: cos(theta)', () => {
      expect(receiverPatternGain(ReceiverPattern.FIGURE_EIGHT, 0)).toBeCloseTo(1.0);
      expect(receiverPatternGain(ReceiverPattern.FIGURE_EIGHT, Math.PI / 2)).toBeCloseTo(0.0);
      expect(receiverPatternGain(ReceiverPattern.FIGURE_EIGHT, Math.PI)).toBeCloseTo(-1.0);
    });
  });
});
