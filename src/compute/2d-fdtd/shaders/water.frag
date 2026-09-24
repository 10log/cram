#ifndef DISPLAY_HALF_RANGE
#error DISPLAY_HALF_RANGE must be defined; index.ts prepends it from field-encoding.ts
#endif
// The 2D FDTD field: red above rest, green below, scaled by colorBrightness
// (#240). Unlit, as it always effectively was: the Phong shader this replaced
// computed lighting and then discarded it for this colour.

uniform float colorBrightness;
varying float vHeight;

#include <common>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>

	// DISPLAY_HALF_RANGE is field-encoding.ts's, prepended by index.ts (#224).
	vec3 col = vec3(0.0,0.0,0.0);
	if(vHeight > 0.0){
		col.r = vHeight/DISPLAY_HALF_RANGE*colorBrightness;
	}
	else if(vHeight <= 0.0){
		col.g = -vHeight/DISPLAY_HALF_RANGE*colorBrightness;
	}

	gl_FragColor = vec4( col, 1.0 );

	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>

}
