/**
 * Issue #222: the GPU side of frequency-dependent walls, as far as it can be
 * checked without WebGL. The shaders' numerics were run against the CPU
 * mirror in headless Chromium when this landed. The GPU field matched
 * `stepField` to 3.6e-5 relative over 300 steps, and the branch state to
 * 2e-5, on a room mixing two RLC materials, #219 walls and #220 weights.
 * With the feature off, the height-map shader was bit-identical to its
 * predecessor. What is pinned here is what keeps that true: the shader text,
 * the assembly, and the material table.
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
  discretizeRlc,
  rlcWallmapChannel,
} from '../rlc-wall';

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
