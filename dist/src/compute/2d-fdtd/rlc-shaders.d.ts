/**
 * Shader assembly for frequency-dependent walls (#222).
 *
 * `height-map.frag` and `rlc-branch.frag` carry an `// RLC_CHUNK` marker
 * where `rlc-common.glsl` goes, after their `sourcemap` and `wallmap`
 * uniforms. With `textures = 0` the chunk compiles to nothing and the
 * height-map shader keeps its frequency-independent path unchanged.
 */
/** `source` with `RLC_TEXTURES` (and any extra defines) set, and the RLC chunk spliced in. */
export declare function withRlc(source: string, textures: number, defines?: Record<string, string>): string;
/** The branch pass for pair `pair`, reading its own variable `rlc<pair>`. */
export declare function rlcBranchShader(pair: number): string;
