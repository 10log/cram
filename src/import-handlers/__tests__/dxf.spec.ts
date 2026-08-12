import { dxf } from '../dxf';

vi.mock('three', async () => await vi.importActual('../../__mocks__/three'));

// Surface/Room/Container drag in the renderer and store machinery; the import path only
// needs them as sinks, so capture what they are handed instead.
const createdSurfaces: Array<{ name: string; positions: number[] }> = [];

vi.mock('../../objects/surface', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(function (this: any, name: string, props: any) {
    this.name = name;
    createdSurfaces.push({
      name,
      positions: Array.from(props.geometry.getAttribute('position').array as Float32Array),
    });
  }),
}));

vi.mock('../../objects/container', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(function (this: any, name: string) {
    this.name = name;
    this.children = [];
    this.add = (child: unknown) => this.children.push(child);
  }),
}));

vi.mock('../../objects/room', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(function (this: any, name: string, props: any) {
    this.name = name;
    this.surfaces = props.surfaces;
  }),
}));

vi.mock('../../store/material-store', () => ({
  useMaterial: {
    getState: () => ({ materials: new Map([['m', { uuid: 'm', material: 'Test' }]]) }),
  },
}));

// --- DXF construction helpers -------------------------------------------------

const group = (pairs: Array<[number, string | number]>) =>
  pairs.map(([code, value]) => `${code}\n${value}`).join('\n') + '\n';

/** A polyface mesh position vertex (flag 192). */
const meshVertex = (x: number, y: number, z: number) =>
  group([[0, 'VERTEX'], [8, 'walls'], [10, x], [20, y], [30, z], [70, 192]]);

/** A polyface face record (flag 128); indices are 1-based, `d` omitted for triangles. */
const faceRecord = (a: number, b: number, c: number, d?: number) => {
  const pairs: Array<[number, string | number]> = [
    [0, 'VERTEX'], [8, 'walls'], [10, 0], [20, 0], [30, 0], [70, 128],
    [71, a], [72, b], [73, c],
  ];
  if (d !== undefined) pairs.push([74, d]);
  return group(pairs);
};

const polyfaceDxf = (vertices: string[], faces: string[]) =>
  group([[0, 'SECTION'], [2, 'ENTITIES']]) +
  group([[0, 'POLYLINE'], [8, 'walls'], [66, 1], [70, 64], [71, vertices.length], [72, faces.length]]) +
  vertices.join('') +
  faces.join('') +
  group([[0, 'SEQEND']]) +
  group([[0, 'ENDSEC']]) +
  group([[0, 'EOF']]);

const unitQuad = [meshVertex(0, 0, 0), meshVertex(1, 0, 0), meshVertex(1, 1, 0), meshVertex(0, 1, 0)];

describe('dxf import handler', () => {
  beforeEach(() => {
    createdSurfaces.length = 0;
  });

  describe('polyface faces', () => {
    it('splits a quad face into two triangles', () => {
      // Regression: only faceA/B/C were read, so the second triangle of every quad was
      // dropped and the face imported as a hole.
      dxf(polyfaceDxf(unitQuad, [faceRecord(1, 2, 3, 4)]));

      expect(createdSurfaces).toHaveLength(1);
      expect(createdSurfaces[0].positions).toHaveLength(18); // 2 triangles x 3 verts x 3 coords
    });

    it('emits one triangle for a triangular face', () => {
      dxf(polyfaceDxf(unitQuad.slice(0, 3), [faceRecord(1, 2, 3)]));

      expect(createdSurfaces[0].positions).toHaveLength(9);
    });

    it('does not add a degenerate triangle when the fourth index repeats the third', () => {
      dxf(polyfaceDxf(unitQuad.slice(0, 3), [faceRecord(1, 2, 3, 3)]));

      expect(createdSurfaces[0].positions).toHaveLength(9);
    });

    it('covers all four corners of a quad', () => {
      dxf(polyfaceDxf(unitQuad, [faceRecord(1, 2, 3, 4)]));

      const p = createdSurfaces[0].positions;
      const corners = new Set<string>();
      for (let i = 0; i < p.length; i += 3) corners.add(`${p[i]},${p[i + 1]},${p[i + 2]}`);

      expect(corners).toEqual(new Set(['0,0,0', '1,0,0', '1,1,0', '0,1,0']));
    });

    it('treats negative indices as visible-edge flags, not distinct vertices', () => {
      dxf(polyfaceDxf(unitQuad, [faceRecord(-1, 2, -3, 4)]));

      const p = createdSurfaces[0].positions;
      expect(p).toHaveLength(18);
      expect(p.every((n) => Number.isFinite(n))).toBe(true);
    });
  });

  describe('parse failures', () => {
    it('throws a descriptive error for input the parser rejects', () => {
      expect(() => dxf('this is not a dxf file')).toThrow(/Could not (parse|read) DXF file/);
    });

    it('throws rather than returning an empty room when there is no ENTITIES section', () => {
      const noEntities =
        group([[0, 'SECTION'], [2, 'HEADER']]) + group([[0, 'ENDSEC']]) + group([[0, 'EOF']]);

      expect(() => dxf(noEntities)).toThrow(/Could not read DXF file/);
    });

    it('names the file type in the message so the failure is attributable', () => {
      let message = '';
      try {
        dxf('this is not a dxf file');
      } catch (err) {
        message = err instanceof Error ? err.message : String(err);
      }

      expect(message).toMatch(/DXF/);
    });
  });

  describe('layers', () => {
    it('groups surfaces into a container named for the layer', () => {
      const room: any = dxf(polyfaceDxf(unitQuad, [faceRecord(1, 2, 3, 4)]));

      expect(room.surfaces).toHaveLength(1);
      expect(room.surfaces[0].name).toBe('walls');
    });
  });
});
