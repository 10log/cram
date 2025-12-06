import { OBJLoader } from '../obj';

describe('OBJLoader', () => {
  describe('constructor', () => {
    it('creates a loader with file contents', () => {
      const loader = new OBJLoader('');
      expect(loader).toBeDefined();
    });

    it('accepts a default model name', () => {
      const loader = new OBJLoader('', 'custom-model');
      const result = loader.parse();
      // Should use default name for unnamed objects
      expect(result.models).toBeDefined();
    });
  });

  describe('parse', () => {
    it('returns empty models array for empty file', () => {
      const loader = new OBJLoader('');
      const result = loader.parse();
      expect(result.models).toEqual([]);
      expect(result.materialLibraries).toEqual([]);
    });

    it('ignores comments', () => {
      const loader = new OBJLoader('# this is a comment\n# another comment');
      const result = loader.parse();
      expect(result.models).toEqual([]);
    });

    it('parses vertices', () => {
      const obj = `
v 1.0 2.0 3.0
v 4.0 5.0 6.0
v 7.0 8.0 9.0
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models.length).toBe(1);
      expect(result.models[0].vertices.length).toBe(3);
      expect(result.models[0].vertices[0]).toEqual({ x: 1.0, y: 2.0, z: 3.0 });
      expect(result.models[0].vertices[1]).toEqual({ x: 4.0, y: 5.0, z: 6.0 });
      expect(result.models[0].vertices[2]).toEqual({ x: 7.0, y: 8.0, z: 9.0 });
    });

    it('parses vertices with default values', () => {
      const obj = `
v 1.0
v 2.0 3.0
f 1 2 1
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].vertices[0]).toEqual({ x: 1.0, y: 0.0, z: 0.0 });
      expect(result.models[0].vertices[1]).toEqual({ x: 2.0, y: 3.0, z: 0.0 });
    });

    it('parses vertex normals', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
vn 0.0 0.0 1.0
vn 0.0 1.0 0.0
f 1//1 2//1 3//1
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].vertexNormals.length).toBe(2);
      expect(result.models[0].vertexNormals[0]).toEqual({ x: 0.0, y: 0.0, z: 1.0 });
      expect(result.models[0].vertexNormals[1]).toEqual({ x: 0.0, y: 1.0, z: 0.0 });
    });

    it('parses texture coordinates', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
vt 0.0 0.0
vt 1.0 0.0
vt 0.5 1.0
f 1/1 2/2 3/3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].textureCoords.length).toBe(3);
      expect(result.models[0].textureCoords[0]).toEqual({ u: 0.0, v: 0.0, w: 0.0 });
      expect(result.models[0].textureCoords[1]).toEqual({ u: 1.0, v: 0.0, w: 0.0 });
      expect(result.models[0].textureCoords[2]).toEqual({ u: 0.5, v: 1.0, w: 0.0 });
    });

    it('parses texture coordinates with w component', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
vt 0.0 0.0 0.5
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].textureCoords[0]).toEqual({ u: 0.0, v: 0.0, w: 0.5 });
    });

    it('parses faces', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
v 1 1 0
f 1 2 3
f 2 4 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].faces.length).toBe(2);
      expect(result.models[0].faces[0].vertices.length).toBe(3);
      expect(result.models[0].faces[0].vertices[0].vertexIndex).toBe(1);
      expect(result.models[0].faces[0].vertices[1].vertexIndex).toBe(2);
      expect(result.models[0].faces[0].vertices[2].vertexIndex).toBe(3);
    });

    it('parses faces with vertex/texture/normal indices', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
vt 0 0
vt 1 0
vt 0 1
vn 0 0 1
f 1/1/1 2/2/1 3/3/1
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      const face = result.models[0].faces[0];
      expect(face.vertices[0].vertexIndex).toBe(1);
      expect(face.vertices[0].textureCoordsIndex).toBe(1);
      expect(face.vertices[0].vertexNormalIndex).toBe(1);
    });

    it('parses faces with vertex//normal indices', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
vn 0 0 1
f 1//1 2//1 3//1
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      const face = result.models[0].faces[0];
      expect(face.vertices[0].vertexIndex).toBe(1);
      expect(face.vertices[0].textureCoordsIndex).toBe(0);
      expect(face.vertices[0].vertexNormalIndex).toBe(1);
    });

    it('parses quad faces', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 1 1 0
v 0 1 0
f 1 2 3 4
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].faces[0].vertices.length).toBe(4);
    });

    it('parses negative vertex indices', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
f -3 -2 -1
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      // -1 = last vertex (index 3), -2 = second to last (index 2), -3 = third to last (index 1)
      expect(result.models[0].faces[0].vertices[0].vertexIndex).toBe(1);
      expect(result.models[0].faces[0].vertices[1].vertexIndex).toBe(2);
      expect(result.models[0].faces[0].vertices[2].vertexIndex).toBe(3);
    });

    it('parses object names', () => {
      const obj = `
o Cube
v 0 0 0
v 1 0 0
v 0 1 0
f 1 2 3
o Sphere
v 2 0 0
v 3 0 0
v 2 1 0
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models.length).toBe(2);
      expect(result.models[0].name).toBe('Cube');
      expect(result.models[1].name).toBe('Sphere');
    });

    it('uses default model name when o has no argument', () => {
      const obj = `
o
v 0 0 0
v 1 0 0
v 0 1 0
f 1 2 3
`;
      const loader = new OBJLoader(obj, 'default-name');
      const result = loader.parse();

      expect(result.models[0].name).toBe('default-name');
    });

    it('parses groups', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
v 1 1 0
g group1
f 1 2 3
g group2
f 2 4 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].faces[0].group).toBe('group1');
      expect(result.models[0].faces[1].group).toBe('group2');
    });

    it('parses material library references', () => {
      const obj = `
mtllib materials.mtl
mtllib other.mtl
v 0 0 0
v 1 0 0
v 0 1 0
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.materialLibraries).toEqual(['materials.mtl', 'other.mtl']);
    });

    it('parses usemtl statements', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
v 1 1 0
usemtl red
f 1 2 3
usemtl blue
f 2 4 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].faces[0].material).toBe('red');
      expect(result.models[0].faces[1].material).toBe('blue');
    });

    it('parses smoothing groups', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
v 1 1 0
s 1
f 1 2 3
s 2
f 2 4 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].faces[0].smoothingGroup).toBe(1);
      expect(result.models[0].faces[1].smoothingGroup).toBe(2);
    });

    it('parses smoothing group off', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
s off
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].faces[0].smoothingGroup).toBe(0);
    });

    it('handles inline comments', () => {
      const obj = `
v 1.0 2.0 3.0 # vertex comment
v 4.0 5.0 6.0
v 7.0 8.0 9.0
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].vertices[0]).toEqual({ x: 1.0, y: 2.0, z: 3.0 });
    });

    it('handles multiple spaces in lines', () => {
      const obj = `
v   1.0   2.0   3.0
v  4.0  5.0  6.0
v 7.0 8.0 9.0
f  1  2  3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].vertices[0]).toEqual({ x: 1.0, y: 2.0, z: 3.0 });
    });

    it('ignores unknown commands', () => {
      const obj = `
unknowncommand arg1 arg2
v 1.0 2.0 3.0
v 4.0 5.0 6.0
v 7.0 8.0 9.0
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      const result = loader.parse();

      expect(result.models[0].vertices.length).toBe(3);
    });
  });

  describe('parseAsync', () => {
    it('returns a promise that resolves to parse result', async () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      const result = await loader.parseAsync();

      expect(result.models.length).toBe(1);
      expect(result.models[0].vertices.length).toBe(3);
    });
  });

  describe('error handling', () => {
    it('throws error for face with less than 3 vertices', () => {
      const obj = `
v 0 0 0
v 1 0 0
f 1 2
`;
      const loader = new OBJLoader(obj);
      expect(() => loader.parse()).toThrow('Face statement has less than 3 vertices');
    });

    it('throws error for face with vertex index 0', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
f 0 1 2
`;
      const loader = new OBJLoader(obj);
      expect(() => loader.parse()).toThrow('Faces uses invalid vertex index of 0');
    });

    it('throws error for group with no argument', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
g
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      expect(() => loader.parse()).toThrow('Group statements must have exactly 1 argument');
    });

    it('throws error for smoothing group with no argument', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
s
f 1 2 3
`;
      const loader = new OBJLoader(obj);
      expect(() => loader.parse()).toThrow('Smoothing group statements must have exactly 1 argument');
    });

    it('throws error for face vertex with too many slash-separated values', () => {
      const obj = `
v 0 0 0
v 1 0 0
v 0 1 0
f 1/1/1/1 2/2/2/2 3/3/3/3
`;
      const loader = new OBJLoader(obj);
      expect(() => loader.parse()).toThrow('Two many values');
    });

    it('rejects promise on parse error in parseAsync', async () => {
      const obj = `
v 0 0 0
v 1 0 0
f 1 2
`;
      const loader = new OBJLoader(obj);
      await expect(loader.parseAsync()).rejects.toThrow('Face statement has less than 3 vertices');
    });
  });

  describe('complex OBJ files', () => {
    it('parses a complete cube', () => {
      const cube = `
# Simple cube
o Cube
v 0 0 0
v 1 0 0
v 1 1 0
v 0 1 0
v 0 0 1
v 1 0 1
v 1 1 1
v 0 1 1
f 1 2 3 4
f 5 8 7 6
f 1 5 6 2
f 2 6 7 3
f 3 7 8 4
f 5 1 4 8
`;
      const loader = new OBJLoader(cube);
      const result = loader.parse();

      expect(result.models[0].name).toBe('Cube');
      expect(result.models[0].vertices.length).toBe(8);
      expect(result.models[0].faces.length).toBe(6);
    });

    it('parses multiple objects in one file', () => {
      const multiObj = `
o Object1
v 0 0 0
v 1 0 0
v 0.5 1 0
f 1 2 3

o Object2
v 2 0 0
v 3 0 0
v 2.5 1 0
f 1 2 3
`;
      const loader = new OBJLoader(multiObj);
      const result = loader.parse();

      expect(result.models.length).toBe(2);
      expect(result.models[0].name).toBe('Object1');
      expect(result.models[1].name).toBe('Object2');
    });
  });
});
