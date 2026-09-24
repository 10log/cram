// Frequency-dependent (series-RLC) walls, #222. The GPU twin of rlc-wall.ts
// and stepField's RLC path; spliced into height-map.frag and rlc-branch.frag
// at their RLC_CHUNK marker, after their sourcemap and wallmap uniforms.
//
// RLC_TEXTURES branch-state textures hold (y, g, y, g) for two branches each,
// at the half step before the one being computed. Every pass reads the
// previous frame's textures, so the height-map pass cannot see what the
// branch passes write this frame. Both advance the state by one step
// themselves, with rlcAdvance on the same inputs, and so agree.
#if RLC_TEXTURES > 0
#define RLC_MAX_BRANCHES (2 * RLC_TEXTURES)

// (b, bd, bDh, bFh) per branch (x) and material (y); zeros past a
// material's own branches, which then contribute nothing.
uniform sampler2D rlcCoefficients;
uniform float rlcMaterialCount;
uniform float courant;

// An air cell's RLC faces: their summed staircase weight (x), and the
// material they all use (y), the first RLC wall met in the order left,
// right, down, up, as stepField scans. The wallmap's blue channel is the
// material index plus one; zero is a wall without branches.
vec2 rlcFaces(vec2 uv, vec2 cellSize) {
  float weight = 0.0;
  float material = -1.0;
  for (int n = 0; n < 4; n++) {
    vec2 at = uv + (n == 0 ? vec2(-cellSize.x, 0.0)
      : n == 1 ? vec2(cellSize.x, 0.0)
      : n == 2 ? vec2(0.0, -cellSize.y)
      : vec2(0.0, cellSize.y));
    if (texture2D(sourcemap, at).b > 0.0) continue;
    vec4 w = texture2D(wallmap, at);
    if (w.b < 0.5) continue;
    weight += n < 2 ? 1.0 - w.r : 1.0 - w.g;
    if (material < 0.0) material = w.b - 1.0;
  }
  return vec2(weight, material);
}

vec4 rlcCoefficient(float branch, float material) {
  return texture2D(rlcCoefficients, vec2(
    (branch + 0.5) / float(RLC_MAX_BRANCHES),
    (material + 0.5) / rlcMaterialCount));
}

// One step of branch pair `pair`: (y, g, y, g) at n - 1/2 to n + 1/2, given
// s = p^{n+1} - p^{n-1}. y+ = b s + bd y- - 2 bFh g-,  g+ = g- + (y+ + y-)/2.
vec4 rlcAdvance(vec4 state, float pair, float material, float s) {
  vec4 a = rlcCoefficient(2.0 * pair, material);
  vec4 b = rlcCoefficient(2.0 * pair + 1.0, material);
  float ya = a.x * s + a.y * state.x - 2.0 * a.w * state.y;
  float yb = b.x * s + b.y * state.z - 2.0 * b.w * state.w;
  return vec4(ya, state.y + 0.5 * (ya + state.x), yb, state.w + 0.5 * (yb + state.z));
}

// A pair's share of the implicit update: (Σ b, Σ 4 bDh y - 2 bFh g).
vec2 rlcFlux(vec4 state, float pair, float material) {
  vec4 a = rlcCoefficient(2.0 * pair, material);
  vec4 b = rlcCoefficient(2.0 * pair + 1.0, material);
  return vec2(
    a.x + b.x,
    4.0 * a.z * state.x - 2.0 * a.w * state.y + 4.0 * b.z * state.z - 2.0 * b.w * state.w);
}
#endif
