// Branch state for frequency-dependent walls (#222): one pass per texture,
// RLC_PAIR its pair and RLC_SELF its own variable (withRlcDefines).
// Advances the pair by the step the height-map pass took from the same
// inputs, so the next frame's height-map pass starts from it.
uniform sampler2D sourcemap;
uniform sampler2D wallmap;

// RLC_CHUNK

void main() {
  vec2 cellSize = 1.0 / resolution.xy;
  vec2 uv = gl_FragCoord.xy * cellSize;
  gl_FragColor = vec4(0.0);
  // Walls, and air with no RLC face, carry no branch state.
  if (texture2D(sourcemap, uv).b <= 0.0) return;
  vec2 faces = rlcFaces(uv, cellSize);
  if (faces.x <= 0.0) return;
  vec4 here = texture2D(heightmap, uv);
  // here.g is v^n, here.b is v^{n-1}: their sum is p^n - p^{n-2}, the s that
  // takes the stored state from n - 3/2 to n - 1/2.
  gl_FragColor = rlcAdvance(texture2D(RLC_SELF, uv), RLC_PAIR, faces.y, here.g + here.b);
}
