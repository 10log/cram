import { BVHNode } from '../BVHNode';

describe('BVHNode', () => {
  describe('constructor', () => {
    it('creates a node with all properties', () => {
      const extentsMin: XYZ = [0, 0, 0];
      const extentsMax: XYZ = [1, 1, 1];
      const node = new BVHNode(extentsMin, extentsMax, 0, 10, 0);

      expect(node.extentsMin).toEqual([0, 0, 0]);
      expect(node.extentsMax).toEqual([1, 1, 1]);
      expect(node.startIndex).toBe(0);
      expect(node.endIndex).toBe(10);
      expect(node.level).toBe(0);
      expect(node.node0).toBeNull();
      expect(node.node1).toBeNull();
    });

    it('creates a node with different level', () => {
      const node = new BVHNode([0, 0, 0], [1, 1, 1], 5, 15, 3);
      expect(node.level).toBe(3);
      expect(node.startIndex).toBe(5);
      expect(node.endIndex).toBe(15);
    });
  });

  describe('fromObj', () => {
    it('creates node from plain object', () => {
      const obj = {
        extentsMin: [0, 0, 0] as XYZ,
        extentsMax: [1, 1, 1] as XYZ,
        startIndex: 0,
        endIndex: 5,
        level: 0,
        node0: null,
        node1: null
      };

      const node = BVHNode.fromObj(obj);

      expect(node).toBeInstanceOf(BVHNode);
      expect(node.extentsMin).toEqual([0, 0, 0]);
      expect(node.extentsMax).toEqual([1, 1, 1]);
    });

    it('recursively creates child nodes', () => {
      const obj = {
        extentsMin: [0, 0, 0] as XYZ,
        extentsMax: [2, 2, 2] as XYZ,
        startIndex: -1,
        endIndex: -1,
        level: 0,
        node0: {
          extentsMin: [0, 0, 0] as XYZ,
          extentsMax: [1, 1, 1] as XYZ,
          startIndex: 0,
          endIndex: 3,
          level: 1,
          node0: null,
          node1: null
        },
        node1: {
          extentsMin: [1, 1, 1] as XYZ,
          extentsMax: [2, 2, 2] as XYZ,
          startIndex: 3,
          endIndex: 6,
          level: 1,
          node0: null,
          node1: null
        }
      };

      const node = BVHNode.fromObj(obj);

      expect(node.node0).toBeInstanceOf(BVHNode);
      expect(node.node1).toBeInstanceOf(BVHNode);
      expect(node.node0!.startIndex).toBe(0);
      expect(node.node0!.endIndex).toBe(3);
      expect(node.node1!.startIndex).toBe(3);
      expect(node.node1!.endIndex).toBe(6);
    });

    it('handles deeply nested nodes', () => {
      const obj = {
        extentsMin: [0, 0, 0] as XYZ,
        extentsMax: [4, 4, 4] as XYZ,
        startIndex: -1,
        endIndex: -1,
        level: 0,
        node0: {
          extentsMin: [0, 0, 0] as XYZ,
          extentsMax: [2, 2, 2] as XYZ,
          startIndex: -1,
          endIndex: -1,
          level: 1,
          node0: {
            extentsMin: [0, 0, 0] as XYZ,
            extentsMax: [1, 1, 1] as XYZ,
            startIndex: 0,
            endIndex: 2,
            level: 2,
            node0: null,
            node1: null
          },
          node1: null
        },
        node1: null
      };

      const node = BVHNode.fromObj(obj);

      expect(node.node0!.node0).toBeInstanceOf(BVHNode);
      expect(node.node0!.node0!.level).toBe(2);
    });
  });

  describe('elementCount', () => {
    it('returns correct count', () => {
      const node = new BVHNode([0, 0, 0], [1, 1, 1], 5, 15, 0);
      expect(node.elementCount()).toBe(10);
    });

    it('returns zero for empty range', () => {
      const node = new BVHNode([0, 0, 0], [1, 1, 1], 5, 5, 0);
      expect(node.elementCount()).toBe(0);
    });

    it('returns one for single element', () => {
      const node = new BVHNode([0, 0, 0], [1, 1, 1], 0, 1, 0);
      expect(node.elementCount()).toBe(1);
    });
  });

  describe('centerX', () => {
    it('calculates center of X axis', () => {
      const node = new BVHNode([0, 0, 0], [10, 20, 30], 0, 1, 0);
      expect(node.centerX()).toBe(5);
    });

    it('handles negative coordinates', () => {
      const node = new BVHNode([-10, 0, 0], [10, 20, 30], 0, 1, 0);
      expect(node.centerX()).toBe(0);
    });
  });

  describe('centerY', () => {
    it('calculates center of Y axis', () => {
      const node = new BVHNode([0, 0, 0], [10, 20, 30], 0, 1, 0);
      expect(node.centerY()).toBe(10);
    });

    it('handles negative coordinates', () => {
      const node = new BVHNode([0, -20, 0], [10, 20, 30], 0, 1, 0);
      expect(node.centerY()).toBe(0);
    });
  });

  describe('centerZ', () => {
    it('calculates center of Z axis', () => {
      const node = new BVHNode([0, 0, 0], [10, 20, 30], 0, 1, 0);
      expect(node.centerZ()).toBe(15);
    });

    it('handles negative coordinates', () => {
      const node = new BVHNode([0, 0, -30], [10, 20, 30], 0, 1, 0);
      expect(node.centerZ()).toBe(0);
    });
  });

  describe('clearShapes', () => {
    it('sets indices to -1', () => {
      const node = new BVHNode([0, 0, 0], [1, 1, 1], 5, 15, 0);

      node.clearShapes();

      expect(node.startIndex).toBe(-1);
      expect(node.endIndex).toBe(-1);
    });
  });

  describe('children getter', () => {
    it('returns array with both child nodes', () => {
      const parent = new BVHNode([0, 0, 0], [2, 2, 2], 0, 10, 0);
      const child0 = new BVHNode([0, 0, 0], [1, 1, 1], 0, 5, 1);
      const child1 = new BVHNode([1, 1, 1], [2, 2, 2], 5, 10, 1);

      parent.node0 = child0;
      parent.node1 = child1;

      const children = parent.children;

      expect(children).toHaveLength(2);
      expect(children[0]).toBe(child0);
      expect(children[1]).toBe(child1);
    });

    it('returns array with null children for leaf node', () => {
      const leaf = new BVHNode([0, 0, 0], [1, 1, 1], 0, 5, 0);

      const children = leaf.children;

      expect(children).toHaveLength(2);
      expect(children[0]).toBeNull();
      expect(children[1]).toBeNull();
    });
  });
});
