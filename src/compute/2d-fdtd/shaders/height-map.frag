#include <common>

uniform vec2 mousePos;
uniform float mouseSize;
uniform float damping;
uniform float heightCompensation;
uniform float courantSq;

// Prepended by withGhostGainDefine (impedance.ts). A uniform would read 0 if
// it never bound and silently make every wall fully centred (#219), so this
// refuses to compile instead.
#ifndef MAX_GHOST_GAIN
#error MAX_GHOST_GAIN must be defined; build this shader with withGhostGainDefine
#endif
// Prepended by withRlc (rlc-shaders.ts), 0 for no frequency-dependent walls.
// An undefined name in #if is an error in GLSL ES 3.0, not a 0, so say why.
#ifndef RLC_TEXTURES
#error RLC_TEXTURES must be defined; build this shader with withRlc
#endif
uniform sampler2D sourcemap;
// Staircase face weights (#220), stored as 1 - w: r for x-faces, g for
// y-faces. Zero — an unwritten texel — is weight 1, the uncorrected wall.
uniform sampler2D wallmap;

// RLC_CHUNK

void main()	{

  vec2 cellSize = 1.0 / resolution.xy;

  vec2 uv = gl_FragCoord.xy * cellSize;
    
  float newvel = 0.;
  float newpos = 0.;


  vec4 heightmapValue = texture2D( heightmap, uv );
  vec4 sourcemapValue = texture2D( sourcemap, uv);
  


  if(sourcemapValue.b > 0.0){
    float pos = heightmapValue.r;
    float vel = heightmapValue.g;
    
    
    
    vec2 ud_offset = vec2( 0.0, cellSize.y );
    vec2 rl_offset = vec2( cellSize.x, 0.0 );
    
    vec4 u = texture2D( heightmap, uv + ud_offset );    
    vec4 d = texture2D( heightmap, uv - ud_offset );
    vec4 r = texture2D( heightmap, uv + rl_offset );
    vec4 l = texture2D( heightmap, uv - rl_offset );
    
    float u_wall = texture2D( sourcemap, uv + ud_offset ).b;
    float d_wall = texture2D( sourcemap, uv - ud_offset ).b;
    float r_wall = texture2D( sourcemap, uv + rl_offset ).b;
    float l_wall = texture2D( sourcemap, uv - rl_offset ).b;
    
    
    // Locally-reacting impedance wall (#199): the ghost is pos - gamma*vel,
    // where gamma = 1/(xi*C) comes from Surface.absorption. The sourcemap's
    // blue channel is positive for air and -gamma for a wall, so gamma = 0 —
    // the rigid Neumann ghost of #111 — keeps the old encoding of exactly 0
    // and the old behaviour bit for bit. Opposite-neighbor sampling is
    // neither Dirichlet nor rigid and is what #111 removed.
    //
    // The backward ghost is only stable below gamma = 1, so it takes at most
    // MAX_GHOST_GAIN; any excess is a centred loss applied after the stencil
    // (#219). A wall at or below MAX_GHOST_GAIN computes exactly what it did.
    //
    // Each face's gain is weighted by |n.e| (#220), so a staircased wall
    // absorbs over its real length rather than every step's. Up/down
    // neighbours are y-faces (wallmap.g), left/right x-faces (wallmap.r).
    float u_pos = u.r;
    float d_pos = d.r;
    float r_pos = r.r;
    float l_pos = l.r;
    float centredGain = 0.0;

    if (u_wall <= 0.0) {
#if RLC_TEXTURES > 0
      // An RLC face (#222) is rigid here; its flux comes in the solve below.
      if (texture2D( wallmap, uv + ud_offset ).b > 0.5) {
        u_pos = pos;
      } else
#endif
      {
        float u_gain = u_wall * (1.0 - texture2D( wallmap, uv + ud_offset ).g);
        u_pos = pos + max(u_gain, -MAX_GHOST_GAIN) * vel;
        centredGain += max(-u_gain - MAX_GHOST_GAIN, 0.0);
      }
    }
    if (d_wall <= 0.0) {
#if RLC_TEXTURES > 0
      // An RLC face (#222) is rigid here; its flux comes in the solve below.
      if (texture2D( wallmap, uv - ud_offset ).b > 0.5) {
        d_pos = pos;
      } else
#endif
      {
        float d_gain = d_wall * (1.0 - texture2D( wallmap, uv - ud_offset ).g);
        d_pos = pos + max(d_gain, -MAX_GHOST_GAIN) * vel;
        centredGain += max(-d_gain - MAX_GHOST_GAIN, 0.0);
      }
    }
    if (r_wall <= 0.0) {
#if RLC_TEXTURES > 0
      // An RLC face (#222) is rigid here; its flux comes in the solve below.
      if (texture2D( wallmap, uv + rl_offset ).b > 0.5) {
        r_pos = pos;
      } else
#endif
      {
        float r_gain = r_wall * (1.0 - texture2D( wallmap, uv + rl_offset ).r);
        r_pos = pos + max(r_gain, -MAX_GHOST_GAIN) * vel;
        centredGain += max(-r_gain - MAX_GHOST_GAIN, 0.0);
      }
    }
    if (l_wall <= 0.0) {
#if RLC_TEXTURES > 0
      // An RLC face (#222) is rigid here; its flux comes in the solve below.
      if (texture2D( wallmap, uv - rl_offset ).b > 0.5) {
        l_pos = pos;
      } else
#endif
      {
        float l_gain = l_wall * (1.0 - texture2D( wallmap, uv - rl_offset ).r);
        l_pos = pos + max(l_gain, -MAX_GHOST_GAIN) * vel;
        centredGain += max(-l_gain - MAX_GHOST_GAIN, 0.0);
      }
    }

    float mid = 0.25*(u_pos+d_pos+r_pos+l_pos);
  
    float med = 4.0 * courantSq;
    // sourcemap.r is a soft source's forcing (#224), zero elsewhere. It goes
    // in before the centred divide, as stepField's `source` does.
    newvel = med*(mid-pos)+vel*damping+sourcemapValue.r;
#if RLC_TEXTURES > 0
    // Centred loss and RLC branch flux (#222), solved together for p^{n+1}:
    // v^{n+1} = (v* - (beta_c + K) v^n - H0) / (1 + beta_c + K).
    // This pass reads (p^n, v^n, v^{n-1}) and branch state at n - 3/2: the
    // branch passes wrote it last frame, from that frame's input. stepField
    // solves this step with the state at n - 1/2, so the state is first
    // advanced one step with s = v^n + v^{n-1} = p^n - p^{n-2}, exactly as
    // the branch passes advance it this frame. Taking H0 from the texture
    // without advancing would use state one step stale.
    float total = 0.5 * courantSq * centredGain;
    float push = 0.0;
    vec2 faces = rlcFaces(uv, cellSize);
    if (faces.x > 0.0) {
      float s = vel + heightmapValue.b;
      vec2 flux = rlcFlux(rlcAdvance(texture2D(rlc0, uv), 0.0, faces.y, s), 0.0, faces.y);
#if RLC_TEXTURES > 1
      flux += rlcFlux(rlcAdvance(texture2D(rlc1, uv), 1.0, faces.y, s), 1.0, faces.y);
#endif
#if RLC_TEXTURES > 2
      flux += rlcFlux(rlcAdvance(texture2D(rlc2, uv), 2.0, faces.y, s), 2.0, faces.y);
#endif
#if RLC_TEXTURES > 3
      flux += rlcFlux(rlcAdvance(texture2D(rlc3, uv), 3.0, faces.y, s), 3.0, faces.y);
#endif
      float scale = 0.5 * courant * faces.x;
      total += scale * flux.x;
      push = scale * flux.y;
    }
    if (total > 0.0) {
      newvel = (newvel - total * vel - push) / (1.0 + total);
    }
#else
    // Centred loss C²·(γc/2)·(p^{n+1} − p^{n−1}), solved for p^{n+1}.
    if (centredGain > 0.0) {
      float beta = 0.5 * courantSq * centredGain;
      newvel = (newvel - beta * vel) / (1.0 + beta);
    }
#endif
    newpos = pos+newvel;
  }
  else {
    newvel = 0.0;
    // The field rests at zero (#224); the display adds its own offset.
    newpos = 0.0;
  }
  
  
#if RLC_TEXTURES > 0
  // .b carries the input v^n forward: next pass it is v^{n-1}, for s.
  gl_FragColor = vec4(newpos, newvel, sourcemapValue.b > 0.0 ? heightmapValue.g : 0.0, sourcemapValue.b);
#else
  gl_FragColor = vec4(newpos, newvel, heightmapValue.b, sourcemapValue.b);
#endif


}
