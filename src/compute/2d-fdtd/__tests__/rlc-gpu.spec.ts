/**
 * Issue #222: the GPU side of frequency-dependent walls, as far as it can be
 * checked without WebGL. The shaders' numerics were run against the CPU
 * mirror in headless Chromium when this landed. The GPU field matched
 * `stepField` to 3.6e-5 relative over 300 steps, and the branch state to
 * 2e-5, on a room mixing two RLC materials, #219 walls and #220 weights.
 * With the feature off, the height-map shader was bit-identical to its
 * predecessor. What is pinned here is what keeps that true: the two-pass
 * dataflow, replayed frame by frame against stepField; the shader text that
 * implements it; the assembly; and the material table.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { fitRlcToOctaveBands } from '../../acoustics/rlc-admittance';
import { rlcBranchShader, withRlc } from '../rlc-shaders';
import {
  RLC_MAX_BRANCHES,
  RLC_TEXTURES,
  RlcMaterialTable,
  createRlcFieldState,
  discretizeRlc,
  rlcWallmapChannel,
  type RlcCoefficients,
} from '../rlc-wall';
import { createField2D, stepField } from '../wall-stencil';

const read = (name: string) => readFileSync(resolve(__dirname, '../shaders', name), 'utf8');

describe('Issue #222: frequency-dependent walls on the GPU', () => {
  describe('shader assembly', () => {
    it('splices the RLC chunk in and sets RLC_TEXTURES', () => {
      const built = withRlc(read('height-map.frag'), RLC_TEXTURES);
      expect(built.startsWith(`#define RLC_TEXTURES ${RLC_TEXTURES}\n`)).toBe(true);
      expect(built).not.toContain('// RLC_CHUNK');
      expect(built).toContain('vec4 rlcAdvance(');
      // After the uniforms the chunk's functions read.
      expect(built.indexOf('uniform sampler2D wallmap;')).toBeLessThan(built.indexOf('vec2 rlcFaces('));
    });

    it('refuses a shader with nowhere to put the chunk, and a texture count it cannot run', () => {
      expect(() => withRlc('void main() {}', 0)).toThrow(/RLC_CHUNK/);
      expect(() => withRlc(read('height-map.frag'), RLC_TEXTURES + 1)).toThrow(/RLC textures/);
    });

    it('builds one branch pass per texture, each reading its own state', () => {
      for (let pair = 0; pair < RLC_TEXTURES; pair++) {
        const built = rlcBranchShader(pair);
        expect(built).toContain(`#define RLC_PAIR ${pair}.0`);
        expect(built).toContain(`#define RLC_SELF rlc${pair}`);
      }
    });
  });

  describe('the shaders carry the CPU mirror’s update', () => {
    const frag = read('height-map.frag');
    const common = read('rlc-common.glsl');

    it('refuses to compile without RLC_TEXTURES, which GLSL ES 3.0 would not read as 0', () => {
      expect(frag).toMatch(/#ifndef RLC_TEXTURES\s*\n\s*#error/);
    });

    it('keeps the frequency-independent path, unchanged, when RLC_TEXTURES is 0', () => {
      const off = frag.split('#else').slice(1).join('#else');
      expect(off).toContain('newvel = (newvel - beta * vel) / (1.0 + beta);');
      expect(frag).toContain('gl_FragColor = vec4(newpos, newvel, heightmapValue.b, sourcemapValue.b);');
    });

    it('treats an RLC face as rigid in the stencil, on all four neighbours', () => {
      for (const dir of ['u', 'd', 'r', 'l']) expect(frag).toContain(`        ${dir}_pos = pos;`);
    });

    it('advances each branch before the solve, and solves both losses in one divide', () => {
      expect(frag).toContain('float s = vel + heightmapValue.b;');
      for (let t = 0; t < RLC_TEXTURES; t++) {
        expect(frag).toContain(`rlcFlux(rlcAdvance(texture2D(rlc${t}, uv), ${t}.0, faces.y, s), ${t}.0, faces.y)`);
      }
      expect(frag).toContain('float scale = 0.5 * courant * faces.x;');
      expect(frag).toContain('newvel = (newvel - total * vel - push) / (1.0 + total);');
      // .b carries v^{n+1} forward for the next step's s.
      expect(frag).toContain('sourcemapValue.b > 0.0 ? heightmapValue.g : 0.0');
    });

    it('advances a branch with rlc-wall.ts’s recurrence', () => {
      expect(common).toContain('float ya = a.x * s + a.y * state.x - 2.0 * a.w * state.y;');
      expect(common).toContain('state.y + 0.5 * (ya + state.x)');
      expect(common).toContain('4.0 * a.z * state.x - 2.0 * a.w * state.y');
    });

    it('picks the cell’s material in stepField’s neighbour order', () => {
      expect(common).toMatch(/n == 0 \? vec2\(-cellSize\.x, 0\.0\)\s*: n == 1 \? vec2\(cellSize\.x, 0\.0\)\s*: n == 2 \? vec2\(0\.0, -cellSize\.y\)/);
      expect(common).toContain('if (material < 0.0) material = w.b - 1.0;');
    });
  });

  describe('the two-pass dataflow', () => {
    // The shaders cannot run here, but their timing can. Every
    // GPUComputationRenderer pass reads the previous frame's textures, so the
    // stored branch state trails the field by a step. This replays that
    // dataflow frame by frame, in Float64 and in the shaders' order, and holds
    // it to stepField. The variant that takes the flux from the stored state
    // without advancing it (the obvious reading of the shader) is run
    // alongside, to show the advance is what makes the two agree.
    const NX = 24;
    const NY = 18;
    const C2 = 0.5;
    const C = Math.sqrt(C2);
    const dt = (C * 0.1) / 343;
    const materials: RlcCoefficients[] = [
      discretizeRlc(fitRlcToOctaveBands([63, 125, 250, 500, 1000], [0.05, 0.1, 0.5, 0.9, 0.3], { dims: 2 }).branches, dt),
      discretizeRlc(fitRlcToOctaveBands([125, 250, 500], [0.6, 0.2, 0.05], { dims: 2 }).branches, dt),
    ];
    const slots = Math.max(...materials.map((m) => m.count));
    const wall = new Int32Array(NX * NY).fill(-2); // -2 air, -1 rigid, ≥ 0 RLC material
    const initial = new Float64Array(NX * NY);
    let seed = 5;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        const k = j * NX + i;
        if (i === 0 || j === 0 || i === NX - 1 || j === NY - 1 || (i >= 8 && i < 12 && j >= 5 && j < 12)) {
          wall[k] = ((3 * i + j) % 3) - 1;
        } else {
          initial[k] = random() - 0.5;
        }
      }
    }

    function gpuFrames(steps: number, advanceBeforeFlux: boolean): Float64Array {
      const size = NX * NY;
      let p = initial.slice();
      let v = new Float64Array(size);
      let b = new Float64Array(size); // heightmap.b, the previous velocity
      let y = new Float64Array(size * slots);
      let g = new Float64Array(size * slots);
      for (let frame = 0; frame < steps; frame++) {
        const nextP = new Float64Array(size);
        const nextV = new Float64Array(size);
        const nextB = new Float64Array(size);
        const nextY = new Float64Array(size * slots);
        const nextG = new Float64Array(size * slots);
        for (let j = 0; j < NY; j++) {
          for (let i = 0; i < NX; i++) {
            const k = j * NX + i;
            if (wall[k] !== -2) continue;
            let sum = 0;
            let weight = 0;
            let material = -1;
            // rlcFaces' order: left, right, down, up; off-grid reads the cell.
            for (const nb of [i > 0 ? k - 1 : k, i < NX - 1 ? k + 1 : k, j > 0 ? k - NX : k, j < NY - 1 ? k + NX : k]) {
              if (wall[nb] === -2) sum += p[nb];
              else {
                sum += p[k];
                if (wall[nb] >= 0) {
                  weight += 1;
                  if (material < 0) material = wall[nb];
                }
              }
            }
            let vel = C2 * (sum - 4 * p[k]) + v[k];
            if (weight > 0) {
              const m = materials[material];
              const s = v[k] + b[k];
              let beta = 0;
              let h0 = 0;
              for (let n = 0; n < m.count; n++) {
                const y0 = y[k * slots + n];
                const g0 = g[k * slots + n];
                // rlcAdvance, shared by both passes.
                const y1 = m.b[n] * s + m.bd[n] * y0 - 2 * m.bFh[n] * g0;
                const g1 = g0 + 0.5 * (y1 + y0);
                // The branch pass stores the advance ...
                nextY[k * slots + n] = y1;
                nextG[k * slots + n] = g1;
                // ... and the height-map pass solves with it (rlcFlux).
                const [yu, gu] = advanceBeforeFlux ? [y1, g1] : [y0, g0];
                beta += m.b[n];
                h0 += 4 * m.bDh[n] * yu - 2 * m.bFh[n] * gu;
              }
              const scale = 0.5 * C * weight;
              const total = scale * beta;
              vel = (vel - total * v[k] - scale * h0) / (1 + total);
            }
            nextV[k] = vel;
            nextP[k] = p[k] + vel;
            nextB[k] = v[k];
          }
        }
        [p, v, b, y, g] = [nextP, nextV, nextB, nextY, nextG];
      }
      return p;
    }

    function cpu(steps: number): Float64Array {
      const field = createField2D(NX, NY);
      field.rlc = createRlcFieldState(NX * NY, materials);
      for (let k = 0; k < NX * NY; k++) {
        if (wall[k] === -2) continue;
        field.channel[k] = 0;
        field.rlc.wallMaterial[k] = Math.max(wall[k], -1);
      }
      field.pressure.set(initial);
      const scratch = { pressure: new Float64Array(NX * NY), velocity: new Float64Array(NX * NY) };
      for (let n = 0; n < steps; n++) stepField(field, C2, 1, scratch);
      return field.pressure;
    }

    const relative = (a: Float64Array, b: Float64Array) => {
      let d = 0;
      let m = 0;
      for (let k = 0; k < a.length; k++) {
        d = Math.max(d, Math.abs(a[k] - b[k]));
        m = Math.max(m, Math.abs(b[k]));
      }
      return d / m;
    };

    it('matches stepField when the height-map pass advances the stored state first', () => {
      // Measured: identical, bit for bit.
      expect(relative(gpuFrames(400, true), cpu(400))).toBe(0);
    });

    it('drifts from it when the flux is taken from the stored state as it stands', () => {
      // Measured: off by 12× the field's own size after 400 steps.
      expect(relative(gpuFrames(400, false), cpu(400))).toBeGreaterThan(1e-3);
    });
  });

  describe('the material table', () => {
    const dt = 1e-4;
    const a = fitRlcToOctaveBands([125, 250, 500], [0.1, 0.3, 0.6], { dims: 2 }).branches;
    const b = fitRlcToOctaveBands([250, 500], [0.5, 0.2], { dims: 2 }).branches;

    it('indexes each material once', () => {
      const table = new RlcMaterialTable();
      expect(table.indexFor(a)).toBe(0);
      expect(table.indexFor(b)).toBe(1);
      expect(table.indexFor(a.map((x) => ({ ...x })))).toBe(0);
      expect(table.size).toBe(2);
    });

    it('packs (b, bd, bDh, bFh) per branch, one row per material, zero past its branches', () => {
      const table = new RlcMaterialTable();
      table.indexFor(a);
      table.indexFor(b);
      const texels = table.texels(dt);
      expect(texels.length).toBe(4 * RLC_MAX_BRANCHES * 2);
      const c = discretizeRlc(b, dt);
      const row = 4 * RLC_MAX_BRANCHES;
      for (let k = 0; k < c.count; k++) {
        expect(texels[row + 4 * k]).toBeCloseTo(c.b[k], 6);
        expect(texels[row + 4 * k + 1]).toBeCloseTo(c.bd[k], 6);
        expect(texels[row + 4 * k + 2]).toBeCloseTo(c.bDh[k], 6);
        expect(texels[row + 4 * k + 3]).toBeCloseTo(c.bFh[k], 6);
      }
      for (let k = c.count; k < RLC_MAX_BRANCHES; k++) {
        expect(Array.from(texels.slice(row + 4 * k, row + 4 * k + 4))).toEqual([0, 0, 0, 0]);
      }
      expect(new RlcMaterialTable().texels(dt).length).toBe(4 * RLC_MAX_BRANCHES);
    });

    it('refuses what the GPU cannot carry', () => {
      const table = new RlcMaterialTable();
      expect(() => table.indexFor([])).toThrow(/rigid/);
      const many = Array.from({ length: RLC_MAX_BRANCHES + 1 }, () => ({ D: 0, E: 10, F: 0 }));
      expect(() => table.indexFor(many)).toThrow(/at most/);
    });

    it('writes a material into the wallmap as its index plus one, and none as 0', () => {
      expect(rlcWallmapChannel(0)).toBe(1);
      expect(rlcWallmapChannel(3)).toBe(4);
      expect(rlcWallmapChannel(null)).toBe(0);
      expect(rlcWallmapChannel(-1)).toBe(0);
    });
  });
});
