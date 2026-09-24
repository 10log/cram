/**
 * Issue #240: the display shaders included three.js chunks that three had
 * since removed (`uv2_*`, `encodings_fragment`), so the field mesh stopped
 * compiling and nothing said so. Every `#include <…>` in the 2D FDTD shaders
 * must name a chunk the installed three.js has.
 */

import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { ShaderChunk } from 'three';
import { describe, expect, it } from 'vitest';

const dir = resolve(__dirname, '../shaders');
const sources = readdirSync(dir).filter((f) => /\.(frag|vert|glsl)$/.test(f));

describe('Issue #240: the 2D FDTD shaders only include chunks three.js has', () => {
  it.each(sources)('%s', (file) => {
    const text = readFileSync(resolve(dir, file), 'utf8');
    const includes = [...text.matchAll(/#include\s*<([\w]+)>/g)].map((m) => m[1]);
    const missing = includes.filter((name) => !(name in ShaderChunk));
    expect([file, missing]).toEqual([file, []]);
  });

  it('checks the display shaders, not an empty list', () => {
    expect(sources).toEqual(expect.arrayContaining(['water.vert', 'water.frag', 'height-map.frag']));
  });

  it('keeps the display unlit, since its colour never used the lighting', () => {
    const frag = readFileSync(resolve(dir, 'water.frag'), 'utf8');
    expect(frag).not.toMatch(/lights_|#define PHONG/);
    expect(frag).toContain('#include <colorspace_fragment>');
  });
});
