import Container, { ContainerSaveObject } from '../container';

describe('Container', () => {
  describe('constructor', () => {
    it('creates a container with the given name', () => {
      const container = new Container('TestContainer');
      expect(container.name).toBe('TestContainer');
    });

    it('has kind "container" by default', () => {
      const container = new Container('Test');
      expect(container.kind).toBe('container');
    });

    it('is not selected by default', () => {
      const container = new Container('Test');
      expect(container.selected).toBe(false);
    });

    it('has default position at origin', () => {
      const container = new Container('Test');
      expect(container.position.x).toBe(0);
      expect(container.position.y).toBe(0);
      expect(container.position.z).toBe(0);
    });

    it('has default scale of 1', () => {
      const container = new Container('Test');
      expect(container.scale.x).toBe(1);
      expect(container.scale.y).toBe(1);
      expect(container.scale.z).toBe(1);
    });

    it('has default rotation of 0', () => {
      const container = new Container('Test');
      expect(container.rotation.x).toBe(0);
      expect(container.rotation.y).toBe(0);
      expect(container.rotation.z).toBe(0);
    });

    it('accepts props for userData', () => {
      const container = new Container('Test', {
        userData: { custom: 'data' },
      });
      expect(container.userData.custom).toBe('data');
    });
  });

  describe('save', () => {
    it('returns a serializable object', () => {
      const container = new Container('TestContainer');
      const saved = container.save();

      expect(typeof saved).toBe('object');
      expect(saved.name).toBe('TestContainer');
      expect(saved.kind).toBe('container');
    });

    it('saves position as array', () => {
      const container = new Container('Test');
      container.position.set(1, 2, 3);

      const saved = container.save();
      expect(saved.position).toEqual([1, 2, 3]);
    });

    it('saves scale as array', () => {
      const container = new Container('Test');
      container.scale.set(2, 3, 4);

      const saved = container.save();
      expect(saved.scale).toEqual([2, 3, 4]);
    });

    it('saves rotation as array (first 3 components)', () => {
      const container = new Container('Test');
      container.rotation.set(Math.PI / 4, Math.PI / 2, Math.PI);

      const saved = container.save();
      expect(saved.rotation.length).toBe(3);
      expect(saved.rotation[0]).toBeCloseTo(Math.PI / 4);
      expect(saved.rotation[1]).toBeCloseTo(Math.PI / 2);
      expect(saved.rotation[2]).toBeCloseTo(Math.PI);
    });

    it('saves visibility state', () => {
      const container = new Container('Test');
      container.visible = false;

      const saved = container.save();
      expect(saved.visible).toBe(false);
    });

    it('saves uuid', () => {
      const container = new Container('Test');
      const saved = container.save();

      expect(saved.uuid).toBe(container.uuid);
      expect(typeof saved.uuid).toBe('string');
    });

    it('saves children recursively', () => {
      const parent = new Container('Parent');
      const child1 = new Container('Child1');
      const child2 = new Container('Child2');

      parent.add(child1);
      parent.add(child2);

      const saved = parent.save();
      expect(saved.children).toBeDefined();
      expect(saved.children!.length).toBe(2);
      expect(saved.children![0].name).toBe('Child1');
      expect(saved.children![1].name).toBe('Child2');
    });

    it('produces JSON-serializable output', () => {
      const container = new Container('Test');
      container.position.set(1, 2, 3);
      container.rotation.set(0.1, 0.2, 0.3);
      container.scale.set(1, 1, 1);

      const saved = container.save();
      const json = JSON.stringify(saved);
      const parsed = JSON.parse(json);

      expect(parsed.name).toBe('Test');
      expect(parsed.position).toEqual([1, 2, 3]);
    });
  });

  describe('restore', () => {
    it('restores name', () => {
      const container = new Container('Original');
      const saveData: ContainerSaveObject = {
        name: 'Restored',
        kind: 'container',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
      };

      container.restore(saveData);
      expect(container.name).toBe('Restored');
    });

    it('restores position', () => {
      const container = new Container('Test');
      const saveData: ContainerSaveObject = {
        name: 'Test',
        kind: 'container',
        visible: true,
        position: [5, 10, 15],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
      };

      container.restore(saveData);
      expect(container.position.x).toBe(5);
      expect(container.position.y).toBe(10);
      expect(container.position.z).toBe(15);
    });

    it('restores scale', () => {
      const container = new Container('Test');
      const saveData: ContainerSaveObject = {
        name: 'Test',
        kind: 'container',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [2, 3, 4],
        uuid: 'test-uuid',
      };

      container.restore(saveData);
      expect(container.scale.x).toBe(2);
      expect(container.scale.y).toBe(3);
      expect(container.scale.z).toBe(4);
    });

    it('restores rotation', () => {
      const container = new Container('Test');
      const saveData: ContainerSaveObject = {
        name: 'Test',
        kind: 'container',
        visible: true,
        position: [0, 0, 0],
        rotation: [Math.PI / 4, Math.PI / 2, Math.PI],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
      };

      container.restore(saveData);
      expect(container.rotation.x).toBeCloseTo(Math.PI / 4);
      expect(container.rotation.y).toBeCloseTo(Math.PI / 2);
      expect(container.rotation.z).toBeCloseTo(Math.PI);
    });

    it('restores visibility', () => {
      const container = new Container('Test');
      container.visible = true;

      const saveData: ContainerSaveObject = {
        name: 'Test',
        kind: 'container',
        visible: false,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
      };

      container.restore(saveData);
      expect(container.visible).toBe(false);
    });

    it('restores uuid', () => {
      const container = new Container('Test');
      const originalUuid = container.uuid;

      const saveData: ContainerSaveObject = {
        name: 'Test',
        kind: 'container',
        visible: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'custom-uuid-12345',
      };

      container.restore(saveData);
      expect(container.uuid).toBe('custom-uuid-12345');
      expect(container.uuid).not.toBe(originalUuid);
    });

    it('returns self for chaining', () => {
      const container = new Container('Test');
      const saveData: ContainerSaveObject = {
        name: 'Test',
        kind: 'container',
        visible: true,
        position: [1, 2, 3],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        uuid: 'test-uuid',
      };

      const result = container.restore(saveData);
      expect(result).toBe(container);
    });
  });

  describe('save/restore round-trip', () => {
    it('preserves all properties through save/restore cycle', () => {
      const original = new Container('RoundTrip');
      original.position.set(1, 2, 3);
      original.rotation.set(0.1, 0.2, 0.3);
      original.scale.set(1.5, 2.0, 2.5);
      original.visible = false;

      const saved = original.save();
      const restored = new Container('').restore(saved);

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
      const original = new Container('JSONTest');
      original.position.set(1.5, 2.5, 3.5);

      const saved = original.save();
      const json = JSON.stringify(saved);
      const parsed = JSON.parse(json);
      const restored = new Container('').restore(parsed);

      expect(restored.name).toBe('JSONTest');
      expect(restored.position.x).toBeCloseTo(1.5);
      expect(restored.position.y).toBeCloseTo(2.5);
      expect(restored.position.z).toBeCloseTo(3.5);
    });
  });

  describe('position accessors', () => {
    it('x getter returns position.x', () => {
      const container = new Container('Test');
      container.position.set(5, 0, 0);
      expect(container.x).toBe(5);
    });

    it('x setter updates position.x', () => {
      const container = new Container('Test');
      container.x = 10;
      expect(container.position.x).toBe(10);
    });

    it('y getter returns position.y', () => {
      const container = new Container('Test');
      container.position.set(0, 5, 0);
      expect(container.y).toBe(5);
    });

    it('y setter updates position.y', () => {
      const container = new Container('Test');
      container.y = 10;
      expect(container.position.y).toBe(10);
    });

    it('z getter returns position.z', () => {
      const container = new Container('Test');
      container.position.set(0, 0, 5);
      expect(container.z).toBe(5);
    });

    it('z setter updates position.z', () => {
      const container = new Container('Test');
      container.z = 10;
      expect(container.position.z).toBe(10);
    });
  });

  describe('scale accessors', () => {
    it('scalex getter/setter work correctly', () => {
      const container = new Container('Test');
      container.scalex = 2;
      expect(container.scalex).toBe(2);
      expect(container.scale.x).toBe(2);
    });

    it('scaley getter/setter work correctly', () => {
      const container = new Container('Test');
      container.scaley = 3;
      expect(container.scaley).toBe(3);
      expect(container.scale.y).toBe(3);
    });

    it('scalez getter/setter work correctly', () => {
      const container = new Container('Test');
      container.scalez = 4;
      expect(container.scalez).toBe(4);
      expect(container.scale.z).toBe(4);
    });
  });

  describe('rotation accessors', () => {
    it('rotationx getter/setter work correctly', () => {
      const container = new Container('Test');
      container.rotationx = Math.PI / 4;
      expect(container.rotationx).toBeCloseTo(Math.PI / 4);
      expect(container.rotation.x).toBeCloseTo(Math.PI / 4);
    });

    it('rotationy getter/setter work correctly', () => {
      const container = new Container('Test');
      container.rotationy = Math.PI / 2;
      expect(container.rotationy).toBeCloseTo(Math.PI / 2);
      expect(container.rotation.y).toBeCloseTo(Math.PI / 2);
    });

    it('rotationz getter/setter work correctly', () => {
      const container = new Container('Test');
      container.rotationz = Math.PI;
      expect(container.rotationz).toBeCloseTo(Math.PI);
      expect(container.rotation.z).toBeCloseTo(Math.PI);
    });
  });

  describe('selection', () => {
    it('select() sets selected to true', () => {
      const container = new Container('Test');
      container.select();
      expect(container.selected).toBe(true);
    });

    it('deselect() sets selected to false', () => {
      const container = new Container('Test');
      container.selected = true;
      container.deselect();
      expect(container.selected).toBe(false);
    });

    it('select() selects children', () => {
      const parent = new Container('Parent');
      const child = new Container('Child');
      parent.add(child);

      parent.select();
      expect(child.selected).toBe(true);
    });

    it('deselect() deselects children', () => {
      const parent = new Container('Parent');
      const child = new Container('Child');
      parent.add(child);

      parent.select();
      parent.deselect();
      expect(child.selected).toBe(false);
    });
  });

  describe('traverse', () => {
    it('calls callback for self', () => {
      const container = new Container('Test');
      const visited: string[] = [];

      container.traverse((obj) => visited.push(obj.name));

      expect(visited).toContain('Test');
    });

    it('calls callback for all descendants', () => {
      const root = new Container('Root');
      const child1 = new Container('Child1');
      const child2 = new Container('Child2');
      const grandchild = new Container('Grandchild');

      root.add(child1);
      root.add(child2);
      child1.add(grandchild);

      const visited: string[] = [];
      root.traverse((obj) => visited.push(obj.name));

      expect(visited).toContain('Root');
      expect(visited).toContain('Child1');
      expect(visited).toContain('Child2');
      expect(visited).toContain('Grandchild');
    });

    it('provides depth information', () => {
      const root = new Container('Root');
      const child = new Container('Child');
      const grandchild = new Container('Grandchild');

      root.add(child);
      child.add(grandchild);

      const depths: Record<string, number> = {};
      root.traverse((obj, depth) => {
        depths[obj.name] = depth;
      });

      expect(depths['Root']).toBe(0);
      expect(depths['Child']).toBe(1);
      expect(depths['Grandchild']).toBe(2);
    });
  });

  describe('traverseVisible', () => {
    it('skips invisible containers', () => {
      const root = new Container('Root');
      const visibleChild = new Container('Visible');
      const invisibleChild = new Container('Invisible');
      invisibleChild.visible = false;

      root.add(visibleChild);
      root.add(invisibleChild);

      const visited: string[] = [];
      root.traverseVisible((obj) => visited.push(obj.name));

      expect(visited).toContain('Root');
      expect(visited).toContain('Visible');
      expect(visited).not.toContain('Invisible');
    });

    it('skips descendants of invisible containers', () => {
      const root = new Container('Root');
      const invisibleChild = new Container('Invisible');
      invisibleChild.visible = false;
      const grandchild = new Container('Grandchild');

      root.add(invisibleChild);
      invisibleChild.add(grandchild);

      const visited: string[] = [];
      root.traverseVisible((obj) => visited.push(obj.name));

      expect(visited).not.toContain('Grandchild');
    });
  });

  describe('dispose', () => {
    it('can be called without error', () => {
      const container = new Container('Test');
      expect(() => container.dispose()).not.toThrow();
    });
  });
});
