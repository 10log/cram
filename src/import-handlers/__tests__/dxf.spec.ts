import { dxf, dxfAsync } from '../dxf';

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
    this.position = {
      x: 0,
      y: 0,
      z: 0,
      set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
      },
    };
    this.updateMatrixWorld = vi.fn();
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

/** One POLYLINE polyface entity; each becomes its own Surface. */
const polylineEntity = (vertices: string[], faces: string[], layer = 'walls') =>
  group([[0, 'POLYLINE'], [8, layer], [66, 1], [70, 64], [71, vertices.length], [72, faces.length]]) +
  vertices.join('') +
  faces.join('') +
  group([[0, 'SEQEND']]);

const entitiesDxf = (...entities: string[]) =>
  group([[0, 'SECTION'], [2, 'ENTITIES']]) +
  entities.join('') +
  group([[0, 'ENDSEC']]) +
  group([[0, 'EOF']]);

const polyfaceDxf = (vertices: string[], faces: string[]) =>
  entitiesDxf(polylineEntity(vertices, faces));

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

  describe('site-grid coordinates', () => {
    // A UTM easting/northing. float32 values are half a metre apart at this magnitude,
    // so storing the vertices raw snaps separate walls onto each other.
    const E = 500000;
    const N = 4500000;

    /** Four walls 0.2 m apart in y, drawn on a site grid. */
    const spacedWalls = () => {
      const ys = [0, 0.2, 0.4, 0.6];
      const vertices = ys.flatMap((dy) => [
        meshVertex(E, N + dy, 0),
        meshVertex(E + 1, N + dy, 0),
        meshVertex(E + 1, N + dy, 2),
      ]);
      const faces = ys.map((_, i) => faceRecord(i * 3 + 1, i * 3 + 2, i * 3 + 3));
      return polyfaceDxf(vertices, faces);
    };

    it('keeps walls distinct that float32 would otherwise merge', () => {
      dxf(spacedWalls());

      const ys = new Set<number>();
      for (const surface of createdSurfaces) {
        for (let i = 1; i < surface.positions.length; i += 3) ys.add(surface.positions[i]);
      }

      // Stored raw, the four northings collapse onto two or three representable values.
      expect(ys.size).toBe(4);
    });

    it('preserves the 0.2 m spacing between them', () => {
      dxf(spacedWalls());

      const ys = [...new Set(createdSurfaces.flatMap((s) =>
        s.positions.filter((_, i) => i % 3 === 1)))].sort((a, b) => a - b);

      for (let i = 1; i < ys.length; i++) {
        expect(ys[i] - ys[i - 1]).toBeCloseTo(0.2, 4);
      }
    });

    it('moves the discarded magnitude onto the room transform', () => {
      const room: any = dxf(spacedWalls());

      expect(room.position.x).toBeCloseTo(E + 0.5, 3);
      expect(room.position.y).toBeCloseTo(N + 0.3, 3);
    });

    it('leaves the model where the file drew it', () => {
      const room: any = dxf(spacedWalls());

      // local vertex + room offset should reconstruct the original coordinate
      const xs = createdSurfaces.flatMap((s) => s.positions.filter((_, i) => i % 3 === 0));
      const worldXs = xs.map((x) => x + room.position.x);

      expect(Math.min(...worldXs)).toBeCloseTo(E, 3);
      expect(Math.max(...worldXs)).toBeCloseTo(E + 1, 3);
    });

    it('shares one offset across every surface so the model does not scatter', () => {
      // Two separate POLYLINE entities 40 m apart on the site grid.
      const triangleAt = (x: number, y: number) =>
        polylineEntity(
          [meshVertex(x, y, 0), meshVertex(x + 1, y, 0), meshVertex(x + 1, y, 2)],
          [faceRecord(1, 2, 3)]
        );

      dxf(entitiesDxf(triangleAt(E, N), triangleAt(E + 40, N)));

      expect(createdSurfaces).toHaveLength(2);

      // A per-surface offset would drop both onto their own local origin and destroy the
      // 40 m separation. One shared offset keeps them apart.
      const firstX = createdSurfaces[0].positions[0];
      const secondX = createdSurfaces[1].positions[0];

      expect(Math.abs(secondX - firstX)).toBeCloseTo(40, 3);
    });

    it('does not recentre a file float32 already represents faithfully', () => {
      const room: any = dxf(polyfaceDxf(unitQuad, [faceRecord(1, 2, 3, 4)]));

      expect(room.position.x).toBe(0);
      expect(room.position.y).toBe(0);
      expect(room.position.z).toBe(0);
      expect(createdSurfaces[0].positions).toContain(1); // untouched, not shifted to -0.5
    });
  });

  describe('dxfAsync', () => {
    /** Stands in for a real Worker: jsdom has none, and we want to drive the responses. */
    class FakeWorker {
      static last: FakeWorker | null = null;
      listeners: Record<string, Array<(event: any) => void>> = {};
      posted: any[] = [];
      terminate = vi.fn();

      constructor(public url: unknown, public options?: unknown) {
        FakeWorker.last = this;
      }
      addEventListener(type: string, fn: (event: any) => void) {
        (this.listeners[type] ||= []).push(fn);
      }
      postMessage(message: any) {
        this.posted.push(message);
      }
      emit(type: string, event: any) {
        (this.listeners[type] || []).forEach((fn) => fn(event));
      }
    }

    const withFakeWorker = async (run: () => Promise<any>) => {
      (globalThis as any).Worker = FakeWorker;
      try {
        return await run();
      } finally {
        delete (globalThis as any).Worker;
        FakeWorker.last = null;
      }
    };

    const quad = () => polyfaceDxf(unitQuad, [faceRecord(1, 2, 3, 4)]);

    it('falls back to parsing in place when the environment has no Worker', async () => {
      expect(typeof (globalThis as any).Worker).toBe('undefined');

      const room: any = await dxfAsync(quad());

      expect(room.surfaces).toHaveLength(1);
      expect(createdSurfaces[0].positions).toHaveLength(18);
    });

    it('hands the file to the worker rather than parsing on this thread', async () => {
      await withFakeWorker(async () => {
        const pending = dxfAsync(quad());
        const worker = FakeWorker.last!;

        expect(worker.posted).toEqual([{ data: quad() }]);

        // Positions the parser could never produce from that input, so a pass proves the
        // room was built from the worker's reply and not re-parsed here.
        worker.emit('message', {
          data: {
            ok: true,
            meshes: [{ layer: 'from-worker', positions: new Float32Array([7, 7, 7, 8, 8, 8, 9, 9, 9]) }],
            offset: null,
          },
        });

        const room: any = await pending;
        expect(room.surfaces).toHaveLength(1);
        expect(createdSurfaces[0].positions).toEqual([7, 7, 7, 8, 8, 8, 9, 9, 9]);
      });
    });

    it('applies the offset the worker reports', async () => {
      await withFakeWorker(async () => {
        const pending = dxfAsync(quad());
        FakeWorker.last!.emit('message', {
          data: {
            ok: true,
            meshes: [{ layer: 'walls', positions: new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0]) }],
            offset: [500000, 4500000, 0],
          },
        });

        const room: any = await pending;
        expect(room.position.x).toBe(500000);
        expect(room.position.y).toBe(4500000);
      });
    });

    it('rejects with the parser message when the worker reports failure', async () => {
      await withFakeWorker(async () => {
        const pending = dxfAsync('not a dxf');
        FakeWorker.last!.emit('message', {
          data: { ok: false, message: 'Could not parse DXF file: Empty file' },
        });

        await expect(pending).rejects.toThrow(/Could not parse DXF file/);
      });
    });

    it('parses in place when the worker itself fails to run', async () => {
      await withFakeWorker(async () => {
        const pending = dxfAsync(quad());
        FakeWorker.last!.emit('error', { message: 'worker failed to start' });

        // A broken worker says nothing about the file, so the import should still succeed.
        const room: any = await pending;
        expect(room.surfaces).toHaveLength(1);
        expect(createdSurfaces[0].positions).toHaveLength(18);
      });
    });

    it('terminates the worker once it has replied', async () => {
      await withFakeWorker(async () => {
        const pending = dxfAsync(quad());
        const worker = FakeWorker.last!;
        worker.emit('message', { data: { ok: true, meshes: [], offset: null } });
        await pending;

        expect(worker.terminate).toHaveBeenCalled();
      });
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
