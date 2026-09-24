/**
 * Shader assembly for frequency-dependent walls (#222).
 *
 * `height-map.frag` and `rlc-branch.frag` carry an `// RLC_CHUNK` marker
 * where `rlc-common.glsl` goes, after their `sourcemap` and `wallmap`
 * uniforms. With `textures = 0` the chunk compiles to nothing and the
 * height-map shader keeps its frequency-independent path unchanged.
 */

import shaders from './shaders';
import { RLC_TEXTURES } from './rlc-wall';

const MARKER = '// RLC_CHUNK';

/** `source` with `RLC_TEXTURES` (and any extra defines) set, and the RLC chunk spliced in. */
export function withRlc(
  source: string,
  textures: number,
  defines: Record<string, string> = {},
): string {
  if (!Number.isInteger(textures) || textures < 0 || textures > RLC_TEXTURES) {
    throw new Error(`RLC textures must be an integer in [0, ${RLC_TEXTURES}], got ${textures}`);
  }
  if (!source.includes(MARKER)) {
    // Without the chunk the shader would fail to compile on a missing
    // function; say which shader and why instead.
    throw new Error(`Shader has no ${MARKER} marker to splice the RLC walls into`);
  }
  const header = [`#define RLC_TEXTURES ${textures}`]
    .concat(Object.entries(defines).map(([k, v]) => `#define ${k} ${v}`))
    .join('\n');
  return `${header}\n${source.replace(MARKER, shaders.rlcCommon)}`;
}

/** The branch pass for pair `pair`, reading its own variable `rlc<pair>`. */
export function rlcBranchShader(pair: number): string {
  return withRlc(shaders.rlcBranchFrag, RLC_TEXTURES, {
    RLC_PAIR: `${pair}.0`,
    RLC_SELF: `rlc${pair}`,
  });
}
