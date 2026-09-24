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
uniform sampler2D sourcemap;
// Staircase face weights (#220), stored as 1 - w: r for x-faces, g for
// y-faces. Zero — an unwritten texel — is weight 1, the uncorrected wall.
uniform sampler2D wallmap;

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
      float u_gain = u_wall * (1.0 - texture2D( wallmap, uv + ud_offset ).g);
      u_pos = pos + max(u_gain, -MAX_GHOST_GAIN) * vel;
      centredGain += max(-u_gain - MAX_GHOST_GAIN, 0.0);
    }
    if (d_wall <= 0.0) {
      float d_gain = d_wall * (1.0 - texture2D( wallmap, uv - ud_offset ).g);
      d_pos = pos + max(d_gain, -MAX_GHOST_GAIN) * vel;
      centredGain += max(-d_gain - MAX_GHOST_GAIN, 0.0);
    }
    if (r_wall <= 0.0) {
      float r_gain = r_wall * (1.0 - texture2D( wallmap, uv + rl_offset ).r);
      r_pos = pos + max(r_gain, -MAX_GHOST_GAIN) * vel;
      centredGain += max(-r_gain - MAX_GHOST_GAIN, 0.0);
    }
    if (l_wall <= 0.0) {
      float l_gain = l_wall * (1.0 - texture2D( wallmap, uv - rl_offset ).r);
      l_pos = pos + max(l_gain, -MAX_GHOST_GAIN) * vel;
      centredGain += max(-l_gain - MAX_GHOST_GAIN, 0.0);
    }

    float mid = 0.25*(u_pos+d_pos+r_pos+l_pos);
  
    float med = 4.0 * courantSq;
    newvel = med*(mid-pos)+vel*damping;
    // Centred loss C²·(γc/2)·(p^{n+1} − p^{n−1}), solved for p^{n+1}.
    if (centredGain > 0.0) {
      float beta = 0.5 * courantSq * centredGain;
      newvel = (newvel - beta * vel) / (1.0 + beta);
    }
    newpos = pos+newvel;
    
    if(sourcemapValue.a == 0.0){  
      newvel = sourcemapValue.g;
      newpos = sourcemapValue.r;
    }    
  }
  else {
    newvel = 0.0;
    newpos = 127.5;
  }
  
  
  gl_FragColor = vec4(newpos, newvel, heightmapValue.b, sourcemapValue.b);


}
