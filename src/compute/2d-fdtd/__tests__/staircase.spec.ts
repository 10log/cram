/**
 * Issue #220: a wall that is not axis-aligned is a staircase of cell faces,
 * and each face used to absorb as though it were real surface — √2 times the
 * wall's length at 45°. Each face's gain is now weighted by `|n·e|`.
 *
 * The oracle is the same 2D Eyring bracket as `rt60-cross-check.spec.ts`, on
 * a room with no parallel walls, so that the field is diffuse enough for an
 * area argument to mean something — see the module comment in `impedance.ts`
 * for the square room at 45°, which is not.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import rasterizeLine from '../rasterize-line';
import {
  faceWeightChannel,
  faceWeightFromChannel,
  ghostGainForAbsorption,
  wallChannelFor,
  wallFaceWeights,
  wallmapTexelFor,
} from '../impedance';
import { createField2D, stepField, type Field2D } from '../wall-stencil';

const C = Math.SQRT1_2;
const C2 = 0.5;

describe('Issue #220: staircase face weights', () => {
  describe('the weights', () => {
    it('are the components of the wall normal, so their squares sum to one', () => {
      for (const [x2, y2] of [[10, 0], [0, 7], [5, 5], [9, 4], [-3, 8], [6, -11]]) {
        const w = wallFaceWeights({ x1: 0, y1: 0, x2, y2 });
        const length = Math.hypot(x2, y2);
        expect(w.x).toBeCloseTo(Math.abs(y2) / length, 15);
        expect(w.y).toBeCloseTo(Math.abs(x2) / length, 15);
        expect(w.x * w.x + w.y * w.y).toBeCloseTo(1, 15);
      }
    });

    it('leave an axis-aligned wall exactly as it was across its own faces', () => {
      // A horizontal wall is seen across y-faces from the room: weight 1, not
      // "close to" 1, so the gain is bit-for-bit unchanged. Its end caps are
      // x-faces and become rigid, which is right: they are not surface.
      expect(wallFaceWeights({ x1: 2, y1: 5, x2: 40, y2: 5 })).toEqual({ x: 0, y: 1 });
      expect(wallFaceWeights({ x1: 7, y1: 30, x2: 7, y2: 3 })).toEqual({ x: 1, y: 0 });
    });

    it('split a 45° wall evenly, taking back the √2 its staircase adds', () => {
      const w = wallFaceWeights({ x1: 0, y1: 0, x2: 20, y2: 20 });
      expect(w.x).toBeCloseTo(Math.SQRT1_2, 15);
      expect(w.y).toBeCloseTo(Math.SQRT1_2, 15);
      // Each diagonal step exposes one x-face and one y-face per √2 of wall.
      expect((w.x + w.y) / Math.SQRT2).toBeCloseTo(1, 15);
    });

    it('leave a wall of no length uncorrected rather than dividing by zero', () => {
      expect(wallFaceWeights({ x1: 4, y1: 4, x2: 4, y2: 4 })).toEqual({ x: 1, y: 1 });
    });
  });

  describe('the wallmap encoding', () => {
    it('stores 1 − w, so an unwritten texel is the uncorrected wall, not a rigid one', () => {
      expect(faceWeightFromChannel(0)).toBe(1);
      for (const w of [0, 0.3, Math.SQRT1_2, 1]) {
        expect(faceWeightFromChannel(faceWeightChannel(w))).toBeCloseTo(w, 15);
      }
    });

    it('writes each wall its own weights, and a disabled wall the resting zeros', () => {
      const slanted = { enabled: true, x1: 0, y1: 0, x2: 12, y2: 5 };
      const texel = wallmapTexelFor(slanted);
      const w = wallFaceWeights(slanted);
      expect(faceWeightFromChannel(texel.r)).toBeCloseTo(w.x, 15);
      expect(faceWeightFromChannel(texel.g)).toBeCloseTo(w.y, 15);
      expect(wallmapTexelFor({ ...slanted, enabled: false })).toEqual({ r: 0, g: 0 });
    });
  });

  describe('in a room', () => {
    /** Rasterize a closed polygon of cell-coordinate vertices into a field. */
    function polygonRoom(n: number, corners: number[][], alpha: number, weighted: boolean) {
      const field = createField2D(n, n);
      for (let k = 0; k < corners.length; k++) {
        const [x1, y1] = corners[k];
        const [x2, y2] = corners[(k + 1) % corners.length];
        const wall = { enabled: true, absorption: alpha, x1, y1, x2, y2 };
        // The same two helpers updateWalls calls, so this is the solver's
        // encoding and not a parallel one.
        const channel = wallChannelFor(wall, C);
        const texel = wallmapTexelFor(wall);
        for (const [x, y] of rasterizeLine(x1, y1, x2, y2)) {
          field.channel[y * n + x] = channel;
          if (weighted) {
            field.weightX[y * n + x] = faceWeightFromChannel(texel.r);
            field.weightY[y * n + x] = faceWeightFromChannel(texel.g);
          }
        }
      }
      let area = 0;
      let perimeter = 0;
      for (let k = 0; k < corners.length; k++) {
        const [x1, y1] = corners[k];
        const [x2, y2] = corners[(k + 1) % corners.length];
        area += x1 * y2 - x2 * y1;
        perimeter += Math.hypot(x2 - x1, y2 - y1);
      }
      return { field, area: Math.abs(area) / 2, perimeter };
    }

    /** Air cells reachable from the centre: the room, not the world outside it. */
    function interior(field: Field2D): Uint8Array {
      const { nx, ny, channel } = field;
      const inside = new Uint8Array(nx * ny);
      const start = (ny >> 1) * nx + (nx >> 1);
      const stack = [start];
      inside[start] = 1;
      while (stack.length) {
        const k = stack.pop()!;
        for (const q of [k - 1, k + 1, k - nx, k + nx]) {
          if (q >= 0 && q < nx * ny && !inside[q] && channel[q] > 0) {
            inside[q] = 1;
            stack.push(q);
          }
        }
      }
      return inside;
    }

    /** T60 in steps, from the room's total p² between −5 and −30 dB. */
    function decaySteps(field: Field2D, steps: number): number {
      const { nx, ny } = field;
      const inside = interior(field);
      const sx = (nx >> 1) + 3;
      const sy = (ny >> 1) - 5;
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          field.pressure[j * nx + i] = Math.exp(-((i - sx) ** 2 + (j - sy) ** 2) / 4);
        }
      }
      const scratch = {
        pressure: new Float64Array(nx * ny),
        velocity: new Float64Array(nx * ny),
      };
      const window = 200;
      const levels: number[] = [];
      let acc = 0;
      for (let t = 1; t <= steps; t++) {
        stepField(field, C2, 1, scratch);
        let e = 0;
        for (let k = 0; k < nx * ny; k++) if (inside[k]) e += field.pressure[k] ** 2;
        acc += e;
        if (t % window === 0) {
          levels.push(acc / window);
          acc = 0;
        }
      }
      const db = levels.map((e) => 10 * Math.log10(e / levels[1]));
      const xs: number[] = [];
      const ys: number[] = [];
      db.forEach((d, i) => {
        if (i >= 1 && d <= -5 && d >= -30) {
          xs.push(i * window);
          ys.push(d);
        }
      });
      const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
      const my = ys.reduce((a, b) => a + b, 0) / ys.length;
      let sxy = 0;
      let sxx = 0;
      xs.forEach((x, i) => {
        sxy += (x - mx) * (ys[i] - my);
        sxx += (x - mx) ** 2;
      });
      return -60 / (sxy / sxx);
    }

    /** 2D Eyring in steps: mean free path πS/P, sound speed C cells per step. */
    const eyringSteps = (area: number, perimeter: number, alpha: number) =>
      (6 * ((Math.PI * area) / perimeter)) / (-C * Math.log10(1 - alpha));

    /** Diffuse-field absorption of a real impedance in 2D, as rt60-cross-check. */
    function diffuseAbsorption2D(alpha: number): number {
      const r = Math.sqrt(1 - alpha);
      const xi = (1 + r) / (1 - r);
      const n = 20000;
      let total = 0;
      for (let i = 0; i < n; i++) {
        const theta = ((i + 0.5) / n) * (Math.PI / 2);
        const R = (xi * Math.cos(theta) - 1) / (xi * Math.cos(theta) + 1);
        total += (1 - R * R) * Math.cos(theta) * (Math.PI / 2 / n);
      }
      return total;
    }

    // An irregular pentagon: no parallel walls, no axis-aligned ones at any of
    // the rotations below, so every wall is a staircase.
    const SHAPE = [[-1, -0.8], [0.7, -1], [1, 0.3], [0.1, 1], [-0.9, 0.6]];
    const N = 80;
    const HALF = 26;
    const ALPHA = 0.2;
    const corners = (degrees: number) => {
      const t = (degrees * Math.PI) / 180;
      return SHAPE.map(([x, y]) => [
        Math.round(N / 2 + HALF * (x * Math.cos(t) - y * Math.sin(t))),
        Math.round(N / 2 + HALF * (x * Math.sin(t) + y * Math.cos(t))),
      ]);
    };

    it('decays inside the 2D Eyring bracket at every rotation, which it did not before', () => {
      const raw: number[] = [];
      const weighted: number[] = [];
      let lower = 0;
      let upper = 0;
      for (const degrees of [0, 25, 55]) {
        const plain = polygonRoom(N, corners(degrees), ALPHA, false);
        const fixed = polygonRoom(N, corners(degrees), ALPHA, true);
        lower = eyringSteps(fixed.area, fixed.perimeter, diffuseAbsorption2D(ALPHA));
        upper = eyringSteps(fixed.area, fixed.perimeter, ALPHA);
        raw.push(decaySteps(plain.field, 4400));
        weighted.push(decaySteps(fixed.field, 4400));
      }
      // Weighted: within the bracket, at the diffuse end where a room with no
      // parallel walls belongs (measured 7–14% above it).
      for (const t of weighted) {
        expect([weighted, t > 0.95 * lower && t < upper]).toEqual([weighted, true]);
      }
      // Uncorrected: faster than even the diffuse end allows, the most
      // absorbing reading of the materials, at every rotation (measured 9–15%
      // below it). This is the defect.
      for (const t of raw) {
        expect([raw, t < lower]).toEqual([raw, true]);
      }
      // And the rotation spread narrows.
      const spread = (xs: number[]) => Math.max(...xs) / Math.min(...xs);
      expect(spread(weighted)).toBeLessThan(spread(raw));
    });

    it('leaves an axis-aligned room bit-for-bit as it was', () => {
      // Interior faces of axis-aligned walls weigh exactly 1; the only zeros
      // are end caps, and in a closed rectangle no room cell sees one.
      const box = [[10, 10], [60, 10], [60, 45], [10, 45]];
      const plain = polygonRoom(70, box, 0.4, false).field;
      const fixed = polygonRoom(70, box, 0.4, true).field;
      for (const f of [plain, fixed]) f.pressure[30 * 70 + 25] = 1;
      const scratch = { pressure: new Float64Array(70 * 70), velocity: new Float64Array(70 * 70) };
      for (let t = 0; t < 500; t++) {
        stepField(plain, C2, 1, scratch);
        stepField(fixed, C2, 1, scratch);
      }
      expect(Array.from(fixed.pressure)).toEqual(Array.from(plain.pressure));
      expect(ghostGainForAbsorption(0.4, C)).toBeGreaterThan(0);
    });
  });

  describe('the shader and solver carry the same weights', () => {
    const frag = readFileSync(resolve(__dirname, '../shaders/height-map.frag'), 'utf8');
    const solver = readFileSync(resolve(__dirname, '../index.ts'), 'utf8');

    it('weights each neighbour by the wallmap channel for its axis', () => {
      expect(frag).toContain('uniform sampler2D wallmap;');
      expect(frag).toContain('float u_gain = u_wall * (1.0 - texture2D( wallmap, uv + ud_offset ).g);');
      expect(frag).toContain('float d_gain = d_wall * (1.0 - texture2D( wallmap, uv - ud_offset ).g);');
      expect(frag).toContain('float r_gain = r_wall * (1.0 - texture2D( wallmap, uv + rl_offset ).r);');
      expect(frag).toContain('float l_gain = l_wall * (1.0 - texture2D( wallmap, uv - rl_offset ).r);');
    });

    it('binds the wallmap, writes it with the sourcemap, and disposes it', () => {
      expect(solver).toContain('uniforms["wallmap"] = { value: this.wallmap }');
      expect(solver).toContain('const texel = wallmapTexelFor(wall);');
      expect(solver).toContain('weights[index + 0] = texel.r;');
      expect(solver).toContain('weights[index + 1] = texel.g;');
      expect(solver).toContain('this.wallmap?.dispose();');
    });
  });
});
