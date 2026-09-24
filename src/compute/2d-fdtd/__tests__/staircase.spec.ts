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
import { impedanceForRandomIncidenceAbsorption } from '../../acoustics/random-incidence';
import {
  AIR_CHANNEL,
  MAX_GHOST_GAIN,
  faceWeightChannel,
  faceWeightFromChannel,
  ghostGainForAbsorption,
  splitGhostGain,
  wallChannelFor,
  wallFaceWeights,
  wallmapTexelFor,
} from '../impedance';
import {
  applyCentredWallLoss,
  createField2D,
  stepField,
  stepInteriorCell,
  wallGhostPressure,
  type Field2D,
} from '../wall-stencil';

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

    /** Diffuse-field absorption of a real impedance in 2D, by direct integration — independent of the solver's module. */
    function diffuseAbsorption2D(xi: number): number {
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
      for (const degrees of [0, 25, 55]) {
        const plain = polygonRoom(N, corners(degrees), ALPHA, false);
        const fixed = polygonRoom(N, corners(degrees), ALPHA, true);
        // Each rotation against its own bracket: corners are rounded after
        // rotating, so area and perimeter differ slightly between rotations.
        // The bracket of the wall the solver built (#221): its diffuse-field
        // absorption is ALPHA, its normal-incidence absorption lower.
        const xi = impedanceForRandomIncidenceAbsorption(ALPHA, 2);
        const lower = eyringSteps(fixed.area, fixed.perimeter, diffuseAbsorption2D(xi));
        const upper = eyringSteps(fixed.area, fixed.perimeter, 1 - ((xi - 1) / (xi + 1)) ** 2);
        const before = decaySteps(plain.field, 4400);
        const after = decaySteps(fixed.field, 4400);
        raw.push(before);
        weighted.push(after);
        const at = { degrees, lower, upper, before, after };
        // Weighted: within the bracket, at the diffuse end where a room with
        // no parallel walls belongs (measured 1.07–1.14 × the diffuse end).
        expect([at, after > 0.95 * lower && after < upper]).toEqual([at, true]);
        // Uncorrected: faster than even the diffuse end allows, the most
        // absorbing reading of the materials (measured 0.85–0.91 ×). This is
        // the defect.
        expect([at, before < lower]).toEqual([at, true]);
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

  describe('with the #219 centred remainder', () => {
    // The weight scales γ *before* splitGhostGain divides it. For γ above
    // MAX_GHOST_GAIN that is not the same as splitting first: γ = 1.5 at
    // w = 0.5 is a face gain of 0.75, all backward, where split-then-weight
    // would leave 0.475 backward and 0.275 centred. The shader weights first
    // too (`u_gain = u_wall * w`, then the max()), so this pins the order.
    const gamma = 1.5;
    const weight = 0.5;
    const cell = { pressure: 0.3, velocity: 0.2, isWall: false };
    const air = { pressure: -0.1, velocity: 0, isWall: false };
    const wall = { pressure: 0, velocity: 0, isWall: true, ghostGain: gamma, weightX: weight, weightY: 1 };

    it('splits the weighted gain, not the weight of each split part', () => {
      expect(splitGhostGain(gamma * weight)).toEqual({ backward: gamma * weight, centred: 0 });
      const stepped = stepInteriorCell(cell, { l: wall, r: air, u: air, d: air }, C2, 1);
      // Weight first: the wall is a plain backward ghost of gain 0.75.
      const ghost = wallGhostPressure(cell.pressure, cell.velocity, gamma * weight);
      const expected = cell.pressure + C2 * (ghost + 3 * air.pressure - 4 * cell.pressure) + cell.velocity;
      expect(stepped.pressure).toBeCloseTo(expected, 15);
      // Split first would have carried a centred remainder and a different
      // backward share; make sure that is distinguishable here.
      const { backward, centred } = splitGhostGain(gamma);
      const wrongGhost = wallGhostPressure(cell.pressure, cell.velocity, backward * weight);
      const wrong = applyCentredWallLoss(
        C2 * (wrongGhost + 3 * air.pressure - 4 * cell.pressure) + cell.velocity,
        cell.velocity,
        C2,
        centred * weight,
      );
      expect(Math.abs(stepped.pressure - (cell.pressure + wrong))).toBeGreaterThan(1e-3);
    });

    it('does the same in stepField, where a weighted gain still above the split keeps a remainder', () => {
      // 1.5 at w = 0.8 is 1.2: backward MAX_GHOST_GAIN, centred 0.25.
      // The centre cell (4) has walls left (3, an x-face), below (1) and above
      // (7, y-faces), and air to its right (5).
      const field = createField2D(3, 3);
      field.pressure[4] = cell.pressure;
      field.velocity[4] = cell.velocity;
      field.pressure[5] = air.pressure;
      field.channel[5] = AIR_CHANNEL;
      for (const k of [1, 3, 7]) field.channel[k] = -gamma;
      field.weightX[3] = 0.8;
      field.weightY[1] = 0.5;
      field.weightY[7] = 1;
      const scratch = { pressure: new Float64Array(9), velocity: new Float64Array(9) };
      const expectedCell = stepInteriorCell(
        { pressure: cell.pressure, velocity: cell.velocity, isWall: false },
        {
          l: { ...wall, weightX: 0.8 },
          r: { pressure: air.pressure, velocity: 0, isWall: false },
          d: { ...wall, weightY: 0.5 },
          u: { ...wall, weightY: 1 },
        },
        C2,
        1,
      );
      stepField(field, C2, 1, scratch);
      expect(field.pressure[4]).toBeCloseTo(expectedCell.pressure, 14);
      // And the remainders are the weighted gains' own: 1.2 − 0.95 and
      // 1.5 − 0.95 carried, 0.75 not.
      const remainder = [0.8, 0.5, 1].reduce(
        (sum, w) => sum + splitGhostGain(gamma * w).centred,
        0,
      );
      expect(remainder).toBeCloseTo((1.2 - MAX_GHOST_GAIN) + (1.5 - MAX_GHOST_GAIN), 14);
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
      // Rebound each pass beside the sourcemap, so an init that replaced the
      // texture object cannot leave the shader reading a stale one.
      expect(solver).toContain('this.heightmapVariable.material["uniforms"]["wallmap"].value = this.wallmap;');
      expect(solver).toContain('const texel = wallmapTexelFor(wall);');
      expect(solver).toContain('weights[index + 0] = texel.r;');
      expect(solver).toContain('weights[index + 1] = texel.g;');
      expect(solver).toContain('this.wallmap?.dispose();');
    });
  });
});
