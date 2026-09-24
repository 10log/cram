// The 2D FDTD field as a displaced, coloured sheet (#240).
//
// This was a copy of three's old Phong vertex shader. Its lighting was never
// used (the fragment shader colours by height alone), and its uv2 chunks were
// removed from three.js, so it no longer compiled. What the picture needs is
// here: the height displacement, and the height for colouring.
uniform sampler2D heightmap;
varying float vHeight;

#include <common>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	// The state is zero-centred (#224); no offset to remove.
	float heightValue = texture2D( heightmap, uv ).x;
	vHeight = heightValue;

	vec3 transformed = vec3( position.x, position.y, heightValue );

	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

}
