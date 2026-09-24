import { S as e, b as t, x as n } from "./FileSaver.min-BS9rdHrk.mjs";
import { p as r, t as i } from "./renderer-Cj8dxF6d.mjs";
import { g as a } from "./store-CUhn0IQy.mjs";
import { t as o } from "./sound-speed-CfEkirc1.mjs";
import { a as s, i as c, o as l } from "./recording-D6qgIUE6.mjs";
import { t as u } from "./solver-DCp-VMaM.mjs";
import { n as d, t as f } from "./random-incidence-C2tZkwdg.mjs";
import { ClampToEdgeWrapping as p, Color as m, DataTexture as h, DoubleSide as g, FloatType as _, Mesh as v, MeshBasicMaterial as y, MeshLambertMaterial as b, NearestFilter as x, PlaneGeometry as S, RGBAFormat as C, ShaderMaterial as w, UniformsLib as T, UniformsUtils as ee, UnsignedByteType as te, Vector2 as E, Vector3 as D, WebGLRenderTarget as O } from "three";
//#region node_modules/three/examples/jsm/misc/GPUComputationRenderer.js
var ne = class {
	constructor(e, t, n) {
		this.variables = [], this.currentTextureIndex = 0;
		let i = _, a = { passThruTexture: { value: null } }, o = l(d(), a), s = new r(o);
		this.setDataType = function(e) {
			return i = e, this;
		}, this.addVariable = function(e, t, n) {
			let r = {
				name: e,
				initialValueTexture: n,
				material: this.createShaderMaterial(t),
				dependencies: null,
				renderTargets: [],
				wrapS: null,
				wrapT: null,
				minFilter: x,
				magFilter: x
			};
			return this.variables.push(r), r;
		}, this.setVariableDependencies = function(e, t) {
			e.dependencies = t;
		}, this.init = function() {
			if (n.capabilities.maxVertexTextures === 0) return "No support for vertex shader textures.";
			for (let n = 0; n < this.variables.length; n++) {
				let r = this.variables[n];
				r.renderTargets[0] = this.createRenderTarget(e, t, r.wrapS, r.wrapT, r.minFilter, r.magFilter), r.renderTargets[1] = this.createRenderTarget(e, t, r.wrapS, r.wrapT, r.minFilter, r.magFilter), this.renderTexture(r.initialValueTexture, r.renderTargets[0]), this.renderTexture(r.initialValueTexture, r.renderTargets[1]);
				let i = r.material, a = i.uniforms;
				if (r.dependencies !== null) for (let e = 0; e < r.dependencies.length; e++) {
					let t = r.dependencies[e];
					if (t.name !== r.name) {
						let e = !1;
						for (let n = 0; n < this.variables.length; n++) if (t.name === this.variables[n].name) {
							e = !0;
							break;
						}
						if (!e) return "Variable dependency not found. Variable=" + r.name + ", dependency=" + t.name;
					}
					a[t.name] = { value: null }, i.fragmentShader = "\nuniform sampler2D " + t.name + ";\n" + i.fragmentShader;
				}
			}
			return this.currentTextureIndex = 0, null;
		}, this.compute = function() {
			let e = this.currentTextureIndex, t = +(this.currentTextureIndex === 0);
			for (let n = 0, r = this.variables.length; n < r; n++) {
				let r = this.variables[n];
				if (r.dependencies !== null) {
					let t = r.material.uniforms;
					for (let n = 0, i = r.dependencies.length; n < i; n++) {
						let i = r.dependencies[n];
						t[i.name].value = i.renderTargets[e].texture;
					}
				}
				this.doRenderTarget(r.material, r.renderTargets[t]);
			}
			this.currentTextureIndex = t;
		}, this.getCurrentRenderTarget = function(e) {
			return e.renderTargets[this.currentTextureIndex];
		}, this.getAlternateRenderTarget = function(e) {
			return e.renderTargets[+(this.currentTextureIndex === 0)];
		}, this.dispose = function() {
			s.dispose();
			let e = this.variables;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				n.initialValueTexture && n.initialValueTexture.dispose();
				let r = n.renderTargets;
				for (let e = 0; e < r.length; e++) r[e].dispose();
				n.material.dispose();
			}
		};
		function c(n) {
			n.defines.resolution = "vec2( " + e.toFixed(1) + ", " + t.toFixed(1) + " )";
		}
		this.addResolutionDefine = c;
		function l(e, t) {
			t ||= {};
			let n = new w({
				name: "GPUComputationShader",
				uniforms: t,
				vertexShader: u(),
				fragmentShader: e
			});
			return c(n), n;
		}
		this.createShaderMaterial = l, this.createRenderTarget = function(n, r, a, o, s, c) {
			return n ||= e, r ||= t, a ||= p, o ||= p, s ||= x, c ||= x, new O(n, r, {
				wrapS: a,
				wrapT: o,
				minFilter: s,
				magFilter: c,
				format: C,
				type: i,
				depthBuffer: !1
			});
		}, this.createTexture = function() {
			let n = new Float32Array(e * t * 4), r = new h(n, e, t, C, _);
			return r.needsUpdate = !0, r;
		}, this.renderTexture = function(e, t) {
			a.passThruTexture.value = e, this.doRenderTarget(o, t), a.passThruTexture.value = null;
		}, this.doRenderTarget = function(e, t) {
			let r = n.getRenderTarget(), i = n.xr.enabled, a = n.shadowMap.autoUpdate;
			n.xr.enabled = !1, n.shadowMap.autoUpdate = !1, s.material = e, n.setRenderTarget(t), s.render(n), s.material = o, n.xr.enabled = i, n.shadowMap.autoUpdate = a, n.setRenderTarget(r);
		};
		function u() {
			return "void main()	{\n\n	gl_Position = vec4( position, 1.0 );\n\n}\n";
		}
		function d() {
			return "uniform sampler2D passThruTexture;\n\nvoid main() {\n\n	vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n	gl_FragColor = texture2D( passThruTexture, uv );\n\n}\n";
		}
	}
}, k = {
	heightMapFrag: "#include <common>\n\nuniform vec2 mousePos;\nuniform float mouseSize;\nuniform float damping;\nuniform float heightCompensation;\nuniform float courantSq;\n\n// Prepended by withGhostGainDefine (impedance.ts). A uniform would read 0 if\n// it never bound and silently make every wall fully centred (#219), so this\n// refuses to compile instead.\n#ifndef MAX_GHOST_GAIN\n#error MAX_GHOST_GAIN must be defined; build this shader with withGhostGainDefine\n#endif\n// Prepended by withRlc (rlc-shaders.ts), 0 for no frequency-dependent walls.\n// An undefined name in #if is an error in GLSL ES 3.0, not a 0, so say why.\n#ifndef RLC_TEXTURES\n#error RLC_TEXTURES must be defined; build this shader with withRlc\n#endif\nuniform sampler2D sourcemap;\n// Staircase face weights (#220), stored as 1 - w: r for x-faces, g for\n// y-faces. Zero — an unwritten texel — is weight 1, the uncorrected wall.\nuniform sampler2D wallmap;\n\n// RLC_CHUNK\n\nvoid main()	{\n\n  vec2 cellSize = 1.0 / resolution.xy;\n\n  vec2 uv = gl_FragCoord.xy * cellSize;\n    \n  float newvel = 0.;\n  float newpos = 0.;\n\n\n  vec4 heightmapValue = texture2D( heightmap, uv );\n  vec4 sourcemapValue = texture2D( sourcemap, uv);\n  \n\n\n  if(sourcemapValue.b > 0.0){\n    float pos = heightmapValue.r;\n    float vel = heightmapValue.g;\n    \n    \n    \n    vec2 ud_offset = vec2( 0.0, cellSize.y );\n    vec2 rl_offset = vec2( cellSize.x, 0.0 );\n    \n    vec4 u = texture2D( heightmap, uv + ud_offset );    \n    vec4 d = texture2D( heightmap, uv - ud_offset );\n    vec4 r = texture2D( heightmap, uv + rl_offset );\n    vec4 l = texture2D( heightmap, uv - rl_offset );\n    \n    float u_wall = texture2D( sourcemap, uv + ud_offset ).b;\n    float d_wall = texture2D( sourcemap, uv - ud_offset ).b;\n    float r_wall = texture2D( sourcemap, uv + rl_offset ).b;\n    float l_wall = texture2D( sourcemap, uv - rl_offset ).b;\n    \n    \n    // Locally-reacting impedance wall (#199): the ghost is pos - gamma*vel,\n    // where gamma = 1/(xi*C) comes from Surface.absorption. The sourcemap's\n    // blue channel is positive for air and -gamma for a wall, so gamma = 0 —\n    // the rigid Neumann ghost of #111 — keeps the old encoding of exactly 0\n    // and the old behaviour bit for bit. Opposite-neighbor sampling is\n    // neither Dirichlet nor rigid and is what #111 removed.\n    //\n    // The backward ghost is only stable below gamma = 1, so it takes at most\n    // MAX_GHOST_GAIN; any excess is a centred loss applied after the stencil\n    // (#219). A wall at or below MAX_GHOST_GAIN computes exactly what it did.\n    //\n    // Each face's gain is weighted by |n.e| (#220), so a staircased wall\n    // absorbs over its real length rather than every step's. Up/down\n    // neighbours are y-faces (wallmap.g), left/right x-faces (wallmap.r).\n    float u_pos = u.r;\n    float d_pos = d.r;\n    float r_pos = r.r;\n    float l_pos = l.r;\n    float centredGain = 0.0;\n\n    if (u_wall <= 0.0) {\n#if RLC_TEXTURES > 0\n      // An RLC face (#222) is rigid here; its flux comes in the solve below.\n      if (texture2D( wallmap, uv + ud_offset ).b > 0.5) {\n        u_pos = pos;\n      } else\n#endif\n      {\n        float u_gain = u_wall * (1.0 - texture2D( wallmap, uv + ud_offset ).g);\n        u_pos = pos + max(u_gain, -MAX_GHOST_GAIN) * vel;\n        centredGain += max(-u_gain - MAX_GHOST_GAIN, 0.0);\n      }\n    }\n    if (d_wall <= 0.0) {\n#if RLC_TEXTURES > 0\n      // An RLC face (#222) is rigid here; its flux comes in the solve below.\n      if (texture2D( wallmap, uv - ud_offset ).b > 0.5) {\n        d_pos = pos;\n      } else\n#endif\n      {\n        float d_gain = d_wall * (1.0 - texture2D( wallmap, uv - ud_offset ).g);\n        d_pos = pos + max(d_gain, -MAX_GHOST_GAIN) * vel;\n        centredGain += max(-d_gain - MAX_GHOST_GAIN, 0.0);\n      }\n    }\n    if (r_wall <= 0.0) {\n#if RLC_TEXTURES > 0\n      // An RLC face (#222) is rigid here; its flux comes in the solve below.\n      if (texture2D( wallmap, uv + rl_offset ).b > 0.5) {\n        r_pos = pos;\n      } else\n#endif\n      {\n        float r_gain = r_wall * (1.0 - texture2D( wallmap, uv + rl_offset ).r);\n        r_pos = pos + max(r_gain, -MAX_GHOST_GAIN) * vel;\n        centredGain += max(-r_gain - MAX_GHOST_GAIN, 0.0);\n      }\n    }\n    if (l_wall <= 0.0) {\n#if RLC_TEXTURES > 0\n      // An RLC face (#222) is rigid here; its flux comes in the solve below.\n      if (texture2D( wallmap, uv - rl_offset ).b > 0.5) {\n        l_pos = pos;\n      } else\n#endif\n      {\n        float l_gain = l_wall * (1.0 - texture2D( wallmap, uv - rl_offset ).r);\n        l_pos = pos + max(l_gain, -MAX_GHOST_GAIN) * vel;\n        centredGain += max(-l_gain - MAX_GHOST_GAIN, 0.0);\n      }\n    }\n\n    float mid = 0.25*(u_pos+d_pos+r_pos+l_pos);\n  \n    float med = 4.0 * courantSq;\n    // sourcemap.r is a soft source's forcing (#224), zero elsewhere. It goes\n    // in before the centred divide, as stepField's `source` does.\n    newvel = med*(mid-pos)+vel*damping+sourcemapValue.r;\n#if RLC_TEXTURES > 0\n    // Centred loss and RLC branch flux (#222), solved together for p^{n+1}:\n    // v^{n+1} = (v* - (beta_c + K) v^n - H0) / (1 + beta_c + K).\n    // This pass reads (p^n, v^n, v^{n-1}) and branch state at n - 3/2: the\n    // branch passes wrote it last frame, from that frame's input. stepField\n    // solves this step with the state at n - 1/2, so the state is first\n    // advanced one step with s = v^n + v^{n-1} = p^n - p^{n-2}, exactly as\n    // the branch passes advance it this frame. Taking H0 from the texture\n    // without advancing would use state one step stale.\n    float total = 0.5 * courantSq * centredGain;\n    float push = 0.0;\n    vec2 faces = rlcFaces(uv, cellSize);\n    if (faces.x > 0.0) {\n      float s = vel + heightmapValue.b;\n      vec2 flux = rlcFlux(rlcAdvance(texture2D(rlc0, uv), 0.0, faces.y, s), 0.0, faces.y);\n#if RLC_TEXTURES > 1\n      flux += rlcFlux(rlcAdvance(texture2D(rlc1, uv), 1.0, faces.y, s), 1.0, faces.y);\n#endif\n#if RLC_TEXTURES > 2\n      flux += rlcFlux(rlcAdvance(texture2D(rlc2, uv), 2.0, faces.y, s), 2.0, faces.y);\n#endif\n#if RLC_TEXTURES > 3\n      flux += rlcFlux(rlcAdvance(texture2D(rlc3, uv), 3.0, faces.y, s), 3.0, faces.y);\n#endif\n      float scale = 0.5 * courant * faces.x;\n      total += scale * flux.x;\n      push = scale * flux.y;\n    }\n    if (total > 0.0) {\n      newvel = (newvel - total * vel - push) / (1.0 + total);\n    }\n#else\n    // Centred loss C²·(γc/2)·(p^{n+1} − p^{n−1}), solved for p^{n+1}.\n    if (centredGain > 0.0) {\n      float beta = 0.5 * courantSq * centredGain;\n      newvel = (newvel - beta * vel) / (1.0 + beta);\n    }\n#endif\n    newpos = pos+newvel;\n  }\n  else {\n    newvel = 0.0;\n    // The field rests at zero (#224); the display adds its own offset.\n    newpos = 0.0;\n  }\n  \n  \n#if RLC_TEXTURES > 0\n  // .b carries the input v^n forward: next pass it is v^{n-1}, for s.\n  gl_FragColor = vec4(newpos, newvel, sourcemapValue.b > 0.0 ? heightmapValue.g : 0.0, sourcemapValue.b);\n#else\n  gl_FragColor = vec4(newpos, newvel, heightmapValue.b, sourcemapValue.b);\n#endif\n\n\n}\n",
	readLevelFrag: "uniform vec2 point1;\nuniform float cell_size;\nuniform float inv_cell_size;\n\nuniform sampler2D levelTexture;\n\n// Integer to float conversion from https://stackoverflow.com/questions/17981163/webgl-read-pixels-from-floating-point-render-target\n\nfloat shift_right( float v, float amt ) {\n\n	v = floor( v ) + 0.5;\n	return floor( v / exp2( amt ) );\n\n}\n\nfloat shift_left( float v, float amt ) {\n\n	return floor( v * exp2( amt ) + 0.5 );\n\n}\n\nfloat mask_last( float v, float bits ) {\n\n	return mod( v, shift_left( 1.0, bits ) );\n\n}\n\nfloat extract_bits( float num, float from, float to ) {\n\n	from = floor( from + 0.5 ); to = floor( to + 0.5 );\n	return mask_last( shift_right( num, from ), to - from );\n\n}\n\nvec4 encode_float( float val ) {\n	if ( val == 0.0 ) return vec4( 0, 0, 0, 0 );\n	float sign = val > 0.0 ? 0.0 : 1.0;\n	val = abs( val );\n	float exponent = floor( log2( val ) );\n	float biased_exponent = exponent + 127.0;\n	float fraction = ( ( val / exp2( exponent ) ) - 1.0 ) * 8388608.0;\n	float t = biased_exponent / 2.0;\n	float last_bit_of_biased_exponent = fract( t ) * 2.0;\n	float remaining_bits_of_biased_exponent = floor( t );\n	float byte4 = extract_bits( fraction, 0.0, 8.0 ) / 255.0;\n	float byte3 = extract_bits( fraction, 8.0, 16.0 ) / 255.0;\n	float byte2 = ( last_bit_of_biased_exponent * 128.0 + extract_bits( fraction, 16.0, 23.0 ) ) / 255.0;\n	float byte1 = ( sign * 128.0 + remaining_bits_of_biased_exponent ) / 255.0;\n	return vec4( byte4, byte3, byte2, byte1 );\n}\n\nvoid main()	{\n\n	vec2 cellSize = vec2(cell_size);\n\n	float waterLevel = texture2D( levelTexture, point1 ).x;\n\n	vec2 normal = vec2(\n		( texture2D( levelTexture, point1 + vec2( - cellSize.x, 0 ) ).x - texture2D( levelTexture, point1 + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\n		( texture2D( levelTexture, point1 + vec2( 0, - cellSize.y ) ).x - texture2D( levelTexture, point1 + vec2( 0, cellSize.y ) ).x ) * inv_cell_size );\n\n	if ( gl_FragCoord.x < 1.5 ) {\n\n		gl_FragColor = encode_float( waterLevel );\n\n	} else if ( gl_FragCoord.x < 2.5 ) {\n\n		gl_FragColor = encode_float( normal.x );\n\n	} else if ( gl_FragCoord.x < 3.5 ) {\n\n		gl_FragColor = encode_float( normal.y );\n\n	} else {\n\n		gl_FragColor = encode_float( 0.0 );\n\n	}\n\n}",
	clearFrag: "uniform sampler2D clearTexture;\n\nvoid main()	{\n\n	vec2 cellSize = 1.0 / resolution.xy;\n\n	vec2 uv = gl_FragCoord.xy * cellSize;\n\n\n	vec4 textureValue = texture2D( clearTexture, uv );\n\n	// Rest is zero in the state (#224).\n	textureValue.r = 0.0;\n	textureValue.g = 0.0;\n	// The previous velocity frequency-dependent walls read (#222).\n	textureValue.b = 0.0;\n\n	gl_FragColor = textureValue;\n\n}\n",
	waterVert: "uniform sampler2D heightmap;\nuniform float inv_cell_size;\nuniform float cell_size;\nvarying float vHeight;\nvarying float vWall;\n#define PHONG\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n	varying vec3 vNormal;\n\n#endif\n\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n	vec2 cellSize = vec2( cell_size );\n\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n\n	// # include <beginnormal_vertex>\n	// Compute normal from heightmap\n	vec3 objectNormal = vec3(\n		( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\n		( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * inv_cell_size,\n		1.0 );\n	//<beginnormal_vertex>\n\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n\n#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\n\n	vNormal = normalize( transformedNormal );\n\n#endif\n\n	//# include <begin_vertex>\n	vec4 heightmapValue = texture2D( heightmap, uv );\n	// The state is zero-centred (#224); no offset to remove.\n	float heightValue = heightmapValue.x;\n	vHeight = heightValue;\n	vWall = heightmapValue.a;\n	\n	vec3 transformed = vec3( position.x, position.y, heightValue );\n	//<begin_vertex>\n\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n\n	vViewPosition = - mvPosition.xyz;\n\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n\n}\n",
	waterFrag: "#ifndef DISPLAY_HALF_RANGE\n#error DISPLAY_HALF_RANGE must be defined; index.ts prepends it from field-encoding.ts\n#endif\n#define PHONG\n\nvarying float vHeight;\nvarying float vWall;\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\nuniform float colorBrightness;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n	#include <clipping_planes_fragment>\n\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n\n	// accumulation\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n\n	// modulation\n	#include <aomap_fragment>\n\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\n	#include <envmap_fragment>\n\n	// DISPLAY_HALF_RANGE is field-encoding.ts's, prepended by index.ts (#224).\n	vec3 col = vec3(0.0,0.0,0.0);\n	if(vHeight > 0.0){\n		col.r = vHeight/DISPLAY_HALF_RANGE*colorBrightness;\n	}\n	else if(vHeight <= 0.0){\n		col.g = -vHeight/DISPLAY_HALF_RANGE*colorBrightness;\n	}\n\n	gl_FragColor = vec4( col, 1.0 );\n\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n\n}",
	rlcCommon: "// Frequency-dependent (series-RLC) walls, #222. The GPU twin of rlc-wall.ts\n// and stepField's RLC path; spliced into height-map.frag and rlc-branch.frag\n// at their RLC_CHUNK marker, after their sourcemap and wallmap uniforms.\n//\n// RLC_TEXTURES branch-state textures hold (y, g, y, g) for two branches each.\n// Every pass reads the previous frame's textures, so with the height map at\n// (p^n, v^n, v^{n-1}) the stored state is at n - 3/2, one step behind what\n// stepField uses to compute v^{n+1}. The height-map pass advances it to\n// n - 1/2 with s = v^n + v^{n-1} before using it; the branch passes make the\n// same advance on the same inputs and store it, for the next frame. The\n// dataflow is emulated against stepField in __tests__/rlc-gpu.spec.ts.\n#if RLC_TEXTURES > 0\n#define RLC_MAX_BRANCHES (2 * RLC_TEXTURES)\n\n// (b, bd, bDh, bFh) per branch (x) and material (y); zeros past a\n// material's own branches, which then contribute nothing.\nuniform sampler2D rlcCoefficients;\nuniform float rlcMaterialCount;\nuniform float courant;\n\n// An air cell's RLC faces: their summed staircase weight (x), and the\n// material they all use (y), the first RLC wall met in the order left,\n// right, down, up, as stepField scans. The wallmap's blue channel is the\n// material index plus one; zero is a wall without branches.\nvec2 rlcFaces(vec2 uv, vec2 cellSize) {\n  float weight = 0.0;\n  float material = -1.0;\n  for (int n = 0; n < 4; n++) {\n    vec2 at = uv + (n == 0 ? vec2(-cellSize.x, 0.0)\n      : n == 1 ? vec2(cellSize.x, 0.0)\n      : n == 2 ? vec2(0.0, -cellSize.y)\n      : vec2(0.0, cellSize.y));\n    if (texture2D(sourcemap, at).b > 0.0) continue;\n    vec4 w = texture2D(wallmap, at);\n    if (w.b < 0.5) continue;\n    weight += n < 2 ? 1.0 - w.r : 1.0 - w.g;\n    if (material < 0.0) material = w.b - 1.0;\n  }\n  return vec2(weight, material);\n}\n\nvec4 rlcCoefficient(float branch, float material) {\n  return texture2D(rlcCoefficients, vec2(\n    (branch + 0.5) / float(RLC_MAX_BRANCHES),\n    (material + 0.5) / rlcMaterialCount));\n}\n\n// One step of branch pair `pair`: (y, g, y, g) at n - 1/2 to n + 1/2, given\n// s = p^{n+1} - p^{n-1}. y+ = b s + bd y- - 2 bFh g-,  g+ = g- + (y+ + y-)/2.\nvec4 rlcAdvance(vec4 state, float pair, float material, float s) {\n  vec4 a = rlcCoefficient(2.0 * pair, material);\n  vec4 b = rlcCoefficient(2.0 * pair + 1.0, material);\n  float ya = a.x * s + a.y * state.x - 2.0 * a.w * state.y;\n  float yb = b.x * s + b.y * state.z - 2.0 * b.w * state.w;\n  return vec4(ya, state.y + 0.5 * (ya + state.x), yb, state.w + 0.5 * (yb + state.z));\n}\n\n// A pair's share of the implicit update: (Σ b, Σ 4 bDh y - 2 bFh g).\nvec2 rlcFlux(vec4 state, float pair, float material) {\n  vec4 a = rlcCoefficient(2.0 * pair, material);\n  vec4 b = rlcCoefficient(2.0 * pair + 1.0, material);\n  return vec2(\n    a.x + b.x,\n    4.0 * a.z * state.x - 2.0 * a.w * state.y + 4.0 * b.z * state.z - 2.0 * b.w * state.w);\n}\n#endif\n",
	rlcBranchFrag: "// Branch state for frequency-dependent walls (#222): one pass per texture,\n// RLC_PAIR its pair and RLC_SELF its own variable (withRlcDefines).\n// Advances the pair by the step the height-map pass took from the same\n// inputs, so the next frame's height-map pass starts from it.\nuniform sampler2D sourcemap;\nuniform sampler2D wallmap;\n\n// RLC_CHUNK\n\nvoid main() {\n  vec2 cellSize = 1.0 / resolution.xy;\n  vec2 uv = gl_FragCoord.xy * cellSize;\n  gl_FragColor = vec4(0.0);\n  // Walls, and air with no RLC face, carry no branch state.\n  if (texture2D(sourcemap, uv).b <= 0.0) return;\n  vec2 faces = rlcFaces(uv, cellSize);\n  if (faces.x <= 0.0) return;\n  vec4 here = texture2D(heightmap, uv);\n  // here.g is v^n, here.b is v^{n-1}: their sum is p^n - p^{n-2}, the s that\n  // takes the stored state from n - 3/2 to n - 1/2.\n  gl_FragColor = rlcAdvance(texture2D(RLC_SELF, uv), RLC_PAIR, faces.y, here.g + here.b);\n}\n"
};
//#endregion
//#region src/compute/2d-fdtd/timestep.ts
function re(e, t) {
	return e / (t * Math.SQRT2);
}
//#endregion
//#region src/compute/2d-fdtd/slice.ts
function ie(e) {
	return Math.abs(e.dx * e.dz) >= Math.abs(e.dx * e.dy) ? "xz" : "xy";
}
function A(e, t) {
	return t === "xz" ? {
		u: e.x,
		v: e.z
	} : {
		u: e.x,
		v: e.y
	};
}
function ae(e, t, n) {
	let r = A(e, t), i = Math.round((r.u - n.offsetX) / n.cellSize), a = Math.round((r.v - n.offsetY) / n.cellSize);
	return i < 0 || a < 0 || i >= n.nx || a >= n.ny ? null : {
		x: i,
		y: a
	};
}
function oe(e, t, n) {
	let r = ae(e, t, n);
	return r ? 4 * (r.y * n.nx + r.x) : null;
}
function se(e, t) {
	let n = {
		dx: e.max.x - e.min.x,
		dy: e.max.y - e.min.y,
		dz: e.max.z - e.min.z
	}, r = t ?? ie(n), i = A(e.min, r), a = A(e.max, r);
	return {
		slice: r,
		width: Math.abs(a.u - i.u),
		height: Math.abs(a.v - i.v),
		offsetX: Math.min(i.u, a.u),
		offsetY: Math.min(i.v, a.v),
		sliceHeight: r === "xz" ? e.min.y : 0
	};
}
function j(e, t) {
	t.slice === "xz" ? (e.rotateX(Math.PI / 2), e.translate(t.width / 2, t.sliceHeight, t.height / 2), e.translate(t.offsetX, 0, t.offsetY)) : (e.translate(t.width / 2, t.height / 2, 0), e.translate(t.offsetX, t.offsetY, 0));
}
//#endregion
//#region src/compute/2d-fdtd/field-encoding.ts
var M = 127.5;
function ce() {
	return {
		forcing: 0,
		alpha: 1
	};
}
function le(e) {
	return {
		forcing: Number.isFinite(e) ? 8 * e : 0,
		alpha: 1
	};
}
function N() {
	return ce();
}
function P(e, t, n) {
	e[t + 0] = n.forcing, e[t + 3] = n.alpha;
}
var ue = .95;
function de(e) {
	return `#define MAX_GHOST_GAIN ${String(ue)}\n${e}`;
}
function fe(e, t) {
	if (!(t > 0)) throw Error(`Courant number must be positive, got ${t}`);
	if (!(e > 0)) throw Error(`Impedance must be positive, got ${e}`);
	return Number.isFinite(e) ? 1 / (e * t) : 0;
}
function pe(e, t) {
	if (!(t > 0)) throw Error(`Courant number must be positive, got ${t}`);
	return e > 1e-6 ? fe(f(e, 2), t) : 0;
}
function me(e) {
	let t = e.x2 - e.x1, n = e.y2 - e.y1, r = Math.hypot(t, n);
	return r > 0 ? {
		x: Math.abs(n) / r,
		y: Math.abs(t) / r
	} : {
		x: 1,
		y: 1
	};
}
function F(e) {
	return 1 - e;
}
function he(e) {
	if (!e.enabled) return {
		r: 0,
		g: 0
	};
	let t = me(e);
	return {
		r: F(t.x),
		g: F(t.y)
	};
}
function ge(e) {
	return e === 0 ? 0 : -e;
}
function _e(e, t) {
	return e.enabled ? ge(pe(e.absorption, t)) : 1;
}
//#endregion
//#region src/compute/2d-fdtd/dispose-gpu.ts
function ve(e) {
	if (!e) return;
	let t = e.variables ?? [];
	for (let e of t) e.renderTargets?.forEach((e) => e.dispose()), e.material?.dispose?.();
	e.dispose?.();
}
//#endregion
//#region src/compute/2d-fdtd/rlc-wall.ts
function ye(e, t) {
	if (!(t > 0)) throw Error(`Time step must be positive, got ${t}`);
	let n = e.length, r = {
		count: n,
		b: new Float64Array(n),
		bd: new Float64Array(n),
		bDh: new Float64Array(n),
		bFh: new Float64Array(n),
		beta: 0,
		Dh: new Float64Array(n),
		E: new Float64Array(n),
		Fh: new Float64Array(n)
	};
	return e.forEach(({ D: e, E: n, F: i }, a) => {
		for (let [t, r] of [
			["D", e],
			["E", n],
			["F", i]
		]) if (!(r >= 0) || !Number.isFinite(r)) throw Error(`Branch ${a} has ${t} = ${r}; a passive branch needs D, E, F ≥ 0`);
		if (e === 0 && n === 0 && i === 0) throw Error(`Branch ${a} is empty`);
		let o = e / t, s = i * t, c = 1 / (2 * o + n + .5 * s);
		r.b[a] = c, r.bd[a] = c * (2 * o - n - .5 * s), r.bDh[a] = c * o, r.bFh[a] = c * s, r.beta += c, r.Dh[a] = o, r.E[a] = n, r.Fh[a] = s;
	}), r;
}
var I = class {
	entries = [];
	indexFor(e) {
		if (e.length === 0) throw Error("A material with no branches is a rigid wall, not an RLC one");
		if (e.length > 8) throw Error(`${e.length} branches; the GPU carries at most 8`);
		let t = JSON.stringify(e.map(({ D: e, E: t, F: n }) => [
			e,
			t,
			n
		])), n = this.entries.findIndex((e) => e.key === t);
		return n >= 0 ? n : (this.entries.push({
			key: t,
			branches: e.map((e) => ({ ...e }))
		}), this.entries.length - 1);
	}
	get size() {
		return this.entries.length;
	}
	coefficients(e) {
		return this.entries.map((t) => ye(t.branches, e));
	}
	texels(e) {
		let t = Math.max(1, this.entries.length), n = new Float32Array(32 * t);
		return this.coefficients(e).forEach((e, t) => {
			for (let r = 0; r < e.count; r++) {
				let i = 4 * (t * 8 + r);
				n[i] = e.b[r], n[i + 1] = e.bd[r], n[i + 2] = e.bDh[r], n[i + 3] = e.bFh[r];
			}
		}), n;
	}
};
function be(e) {
	return e != null && e >= 0 ? e + 1 : 0;
}
//#endregion
//#region src/compute/2d-fdtd/rlc-shaders.ts
var L = "// RLC_CHUNK";
function R(e, t, n = {}) {
	if (!Number.isInteger(t) || t < 0 || t > 4) throw Error(`RLC textures must be an integer in [0, 4], got ${t}`);
	if (!e.includes(L)) throw Error(`Shader has no ${L} marker to splice the RLC walls into`);
	return `${[`#define RLC_TEXTURES ${t}`].concat(Object.entries(n).map(([e, t]) => `#define ${e} ${t}`)).join("\n")}\n${e.replace(L, k.rlcCommon)}`;
}
function z(e) {
	return R(k.rlcBranchFrag, 4, {
		RLC_PAIR: `${e}.0`,
		RLC_SELF: `rlc${e}`
	});
}
//#endregion
//#region src/compute/acoustics/rlc-admittance.ts
function B(e, t) {
	let n = 2 * Math.PI * t, r = 0, i = 0;
	for (let { D: t, E: a, F: o } of e) {
		let e = n * t - (n > 0 ? o / n : o > 0 ? Infinity : 0), s = a * a + e * e;
		!(s > 0) || !Number.isFinite(s) || (r += a / s, i -= e / s);
	}
	return [r, i];
}
function xe(e, t) {
	let [n, r] = B(e, t), i = n * n + r * r;
	return i > 0 ? [n / i, -r / i] : null;
}
var V = [], H = [];
(() => {
	for (let e = 1; e <= 12; e++) {
		let t = Math.cos(Math.PI * (e - .25) / 12.5), n = 0;
		for (let e = 0; e < 100; e++) {
			let e = 1, r = t;
			for (let n = 2; n <= 12; n++) {
				let i = ((2 * n - 1) * t * r - (n - 1) * e) / n;
				e = r, r = i;
			}
			n = 12 * (t * r - e) / (t * t - 1);
			let i = r / n;
			if (t -= i, Math.abs(i) < 1e-16) break;
		}
		V.push(t), H.push(2 / ((1 - t * t) * n * n));
	}
})();
var Se = (() => {
	let e = [Math.PI / 2];
	for (; e[e.length - 1] > 1e-9;) e.push(e[e.length - 1] / 2);
	e.push(0);
	let t = [];
	for (let n = 0; n < e.length - 1; n++) t.push([e[n + 1], e[n]]);
	return t;
})();
function U(e, t) {
	let [n, r] = e;
	if (!(n > 0)) return 0;
	let i = 0;
	for (let [e, a] of Se) {
		let o = (a - e) / 2, s = (e + a) / 2;
		for (let e = 0; e < V.length; e++) {
			let a = s + o * V[e], c = Math.sin(a), l = n * c + 1, u = r * c, d = 4 * n * c / (l * l + u * u), f = t === 3 ? 2 * Math.cos(a) * c : c;
			i += H[e] * o * d * f;
		}
	}
	return i;
}
function Ce(e, t, n) {
	let r = xe(e, t);
	return r ? U(r, n) : 0;
}
var W = 9;
function we(e, t, n) {
	let r = 0;
	for (let i = 0; i < W; i++) {
		let a = t * 2 ** ((i + .5) / W - .5);
		r += Ce(e, a, n);
	}
	return r / W;
}
function Te(e, t, n = Math.SQRT1_2) {
	let r = 2 * Math.PI * t, i = r * n;
	return {
		D: 1 / (e * i),
		E: 1 / e,
		F: r * r / (e * i)
	};
}
function G(e, t, n) {
	let r = 2 * Math.PI * t, i = 1 / e;
	return n === "low" ? {
		D: i / r,
		E: i,
		F: 0
	} : {
		D: 0,
		E: i,
		F: i * r
	};
}
var Ee = [
	Math.SQRT1_2,
	.5,
	.35,
	.25
], K = Math.log(1e-8), De = Math.log(50);
function Oe(e, t, n) {
	let { dims: r, tolerance: i = .001, maxIterations: a = 30, relativeBandwidth: o = Math.SQRT1_2 } = n;
	if (e.length !== t.length) throw Error(`${e.length} bands but ${t.length} coefficients`);
	let s = d(r), c = t.map((e) => Number.isFinite(e) ? Math.min(Math.max(e, 0), s) : 0), l = c.map((e) => e > 1e-6), u = c.map((e) => {
		if (!(e > 1e-6)) return 0;
		let t = f(e, r);
		return Number.isFinite(t) ? 1 / t : 0;
	}), p = e.length - 1, m = e.map((e, t) => t === 0 ? Math.SQRT2 : t === p ? Math.SQRT1_2 : o), h = (t, n) => e.length === 1 ? {
		D: 0,
		E: 1 / n,
		F: 0
	} : t === 0 ? G(n, e[t] * m[t], "low") : t === p ? G(n, e[t] * m[t], "high") : Te(n, e[t], m[t]), g = (t) => e.length === 1 ? [0] : t === 0 ? [
		Math.SQRT2,
		1,
		Math.SQRT1_2
	] : t === p ? [
		Math.SQRT1_2,
		1,
		Math.SQRT2
	] : [o, ...Ee.filter((e) => e !== o)], _ = () => e.flatMap((e, t) => l[t] && u[t] > 0 ? [h(t, u[t])] : []), v = (e) => Array.from({ length: W }, (t, n) => e * 2 ** ((n + .5) / W - .5)), y = -1, b = [], x = (t, n) => {
		let i = v(e[t]);
		if (y !== t) {
			let n = e.flatMap((e, n) => n !== t && l[n] && u[n] > 0 ? [h(n, u[n])] : []);
			b = i.map((e) => B(n, e)), y = t;
		}
		let a = [h(t, Math.exp(n))], o = 0;
		for (let e = 0; e < i.length; e++) {
			let [t, n] = B(a, i[e]), s = b[e][0] + t, c = b[e][1] + n, l = s * s + c * c;
			o += l > 0 ? U([s / l, -c / l], r) : 0;
		}
		return o / i.length;
	}, S = (e) => {
		let t = (Math.sqrt(5) - 1) / 2, n = K, r = De, i = r - t * (r - n), a = n + t * (r - n), o = x(e, i), s = x(e, a);
		for (let c = 0; c < 60 && r - n > 1e-6; c++) o > s ? (r = a, a = i, s = o, i = r - t * (r - n), o = x(e, i)) : (n = i, i = a, o = s, a = n + t * (r - n), s = x(e, a));
		let l = (n + r) / 2;
		if (c[e] >= x(e, l)) return Math.exp(l);
		let u = K, d = l;
		for (let t = 0; t < 60 && d - u > 1e-9; t++) {
			let t = (u + d) / 2;
			x(e, t) < c[e] ? u = t : d = t;
		}
		return Math.exp((u + d) / 2);
	}, C = () => {
		let t = _(), n = e.map((e) => we(t, e, r));
		return {
			branches: t,
			fitted: n,
			maxError: Math.max(0, ...n.map((e, t) => Math.abs(e - c[t])))
		};
	}, w = C(), T = 0;
	for (; w.maxError > i && T < a;) {
		for (let t = 0; t < e.length; t++) {
			if (!l[t]) continue;
			let e = m[t], n = u[t], r = Infinity;
			for (let i of g(t)) {
				m[t] = i, y = -1, u[t] = S(t);
				let a = C().maxError;
				a < r - 1e-12 && (r = a, e = i, n = u[t]);
			}
			m[t] = e, u[t] = n, y = -1;
		}
		let t = C();
		T++;
		let n = t.maxError > w.maxError - 1e-6;
		if (w = t, n) break;
	}
	return {
		branches: w.branches,
		bands: [...e],
		target: c,
		fitted: w.fitted,
		maxError: w.maxError,
		iterations: T
	};
}
//#endregion
//#region src/compute/2d-fdtd/rasterize-line.ts
function q(e, t, n, r) {
	let i = [], a, o, s, c, l, u, d, f, p, m, h;
	if (s = n - e, c = r - t, l = Math.abs(s), u = Math.abs(c), d = 2 * u - l, f = 2 * l - u, u <= l) for (s >= 0 ? (a = e, o = t, p = n) : (a = n, o = r, p = e), i.push([a, o]), h = 0; a < p; h++) a += 1, d < 0 ? d += 2 * u : (s < 0 && c < 0 || s > 0 && c > 0 ? o += 1 : --o, d += 2 * (u - l)), i.push([a, o]);
	else for (c >= 0 ? (a = e, o = t, m = r) : (a = n, o = r, m = t), i.push([a, o]), h = 0; o < m; h++) o += 1, f <= 0 ? f += 2 * l : (s < 0 && c < 0 || s > 0 && c > 0 ? a += 1 : --a, f += 2 * (l - u)), i.push([a, o]);
	return i;
}
//#endregion
//#region src/compute/2d-fdtd/fdtd-wall.ts
var J = class {
	enabled;
	x1;
	y1;
	x2;
	y2;
	cells;
	previousCells;
	shouldClearPreviousCells;
	absorption;
	bands;
	constructor(e) {
		this.absorption = e.absorption ?? 0, this.bands = e.bands, this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = q(this.x1, this.y1, this.x2, this.y2), this.previousCells = this.cells, this.shouldClearPreviousCells = !1, this.enabled = !0;
	}
	move(e) {
		this.previousCells = this.cells, e.absorption !== void 0 && (this.absorption = e.absorption), e.bands !== void 0 && (this.bands = e.bands), this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = q(this.x1, this.y1, this.x2, this.y2), this.shouldClearPreviousCells = !0;
	}
};
//#endregion
//#region src/common/clamp.ts
function Y(e, t, n) {
	return e < t ? t : e > n ? n : e;
}
//#endregion
//#region src/compute/2d-fdtd/index.ts
var X = 256, Z = {
	width: 10,
	height: 10,
	cellSize: 10 / X,
	offsetX: 0,
	offsetY: 0,
	slice: "xz"
}, Q = /* @__PURE__ */ new Map();
function ke(e) {
	let t = JSON.stringify(e), n = Q.get(t);
	return n || (n = Oe(e.frequencies, e.absorption, { dims: 2 }).branches, Q.set(t, n)), n;
}
var $ = class extends u {
	gpuCompute;
	nx;
	ny;
	offsetX;
	offsetY;
	slice;
	sliceHeight;
	uniforms;
	mesh;
	editMesh;
	heightmapVariable;
	sourcemapVariable;
	sourcemap;
	wallmap;
	frequencyDependentWalls;
	rlcVariables = [];
	rlcCoefficients;
	rlcTable = new I();
	zeroShader;
	readLevelShader;
	readLevelImage;
	readLevelRenderTarget;
	sources;
	sourceKeys;
	receivers;
	receiverKeys;
	walls;
	time;
	dt;
	width;
	height;
	cellSize;
	numPasses;
	waveSpeed;
	_temperature;
	recording;
	lastTickMs;
	clearShader;
	frame;
	messageHandlers;
	eventListeners;
	constructor(e) {
		super(e), this.kind = "fdtd-2d", this.running = !1, this.time = 0, this.frame = 0, this.numPasses = 1, this._temperature = e?.temperature ?? 20, this.frequencyDependentWalls = e?.frequencyDependentWalls ?? !1, this.waveSpeed = o(this._temperature), this.recording = !1, this.lastTickMs = null;
		let r = [...a.getState().selectedObjects.values()].filter((e) => e.kind === "surface"), s = null;
		e ||= {};
		let c = null;
		if (r.length > 0) {
			s = r.length > 1 ? r[0].mergeSurfaces(r) : r[0], s.updateMatrixWorld(!0), s.mesh.geometry.computeBoundingBox();
			let t = s.mesh.geometry.boundingBox;
			if (t) {
				let n = t.min.clone().applyMatrix4(s.mesh.matrixWorld), r = t.max.clone().applyMatrix4(s.mesh.matrixWorld);
				c = se({
					min: {
						x: n.x,
						y: n.y,
						z: n.z
					},
					max: {
						x: r.x,
						y: r.y,
						z: r.z
					}
				}, e.slice), e.width = c.width, e.height = c.height, e.offsetX = c.offsetX, e.offsetY = c.offsetY, e.slice = c.slice;
			}
		}
		let l = e && e.width || Z.width, u = e && e.height || Z.height;
		this.offsetX = e && e.offsetX || Z.offsetX, this.offsetY = e && e.offsetY || Z.offsetY, this.slice = e && e.slice || c?.slice || Z.slice, this.sliceHeight = c?.sliceHeight ?? 0, this.cellSize = e && e.cellSize || Math.max(l, u) / X, this.nx = Math.ceil(l / this.cellSize), this.ny = Math.ceil(u / this.cellSize), this.width = this.nx * this.cellSize, this.height = this.ny * this.cellSize, this.dt = 0, this.applyWaveSpeed(), this.sources = {}, this.sourceKeys = [], this.receivers = {}, this.receiverKeys = [], this.walls = [], this.messageHandlers = [], this.eventListeners = [];
		let d = new S(this.width, this.height, 1, 1);
		j(d, {
			slice: this.slice,
			width: this.width,
			height: this.height,
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			sliceHeight: this.sliceHeight
		});
		let f = [new y({
			wireframe: !0,
			side: g,
			color: 7368816
		}), new b({
			transparent: !0,
			opacity: .35,
			side: g,
			color: 7368816
		})];
		this.editMesh = new v(d, f[0]), this.editMesh.name = "fdtd-2d-edit-mesh", this.editMesh.visible = !1, i.fdtdItems.add(this.editMesh), this.fillTexture = this.fillTexture.bind(this), this.init = this.init.bind(this), this.render = this.render.bind(this), this.updateWalls = this.updateWalls.bind(this), this.updateSourceTexture = this.updateSourceTexture.bind(this), this.addWallsFromSurfaceEdges = this.addWallsFromSurfaceEdges.bind(this), this.setWireframeVisible = this.setWireframeVisible.bind(this), this.getWireframeVisible = this.getWireframeVisible.bind(this), this.toggleWall = this.toggleWall.bind(this), this.clear = this.clear.bind(this), this.init(), this.eventListeners.push(t("RENDERER_UPDATED", () => {
			this.running && this.render();
		})), this.onModeChange(n("GET_EDITOR_MODE")[0]), s && this.addWallsFromSurfaceEdges(s);
	}
	onModeChange(e) {
		switch (e) {
			case l.OBJECT:
				this.editMesh.visible = !1, this.mesh.visible = !0;
				break;
			case l.SKETCH:
				this.editMesh.visible = !1, this.mesh.visible = !1;
				break;
			case l.EDIT: this.editMesh.visible = !0, this.mesh.visible = !1;
		}
	}
	setWidth(e) {
		this.nx = Math.ceil(e / this.cellSize), this.width = this.nx * this.cellSize;
	}
	setHeight(e) {
		this.ny = Math.ceil(e / this.cellSize), this.height = this.ny * this.cellSize;
	}
	setDimmensions(e, t) {
		this.setWidth(e), this.setHeight(t);
	}
	init() {
		this.disposeGpu();
		let e = new S(this.width, this.height, this.nx - 1, this.ny - 1);
		e.name = "fdtd-2d-plane-geometry", j(e, {
			slice: this.slice,
			width: this.width,
			height: this.height,
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			sliceHeight: this.sliceHeight
		});
		let t = ee.merge([
			T.common,
			T.specularmap,
			T.envmap,
			T.aomap,
			T.lightmap,
			T.emissivemap,
			T.bumpmap,
			T.normalmap,
			T.displacementmap,
			T.gradientmap,
			T.fog,
			T.lights,
			{
				emissive: { value: new m(0) },
				specular: { value: new m(1118481) },
				shininess: { value: 30 },
				colorBrightness: { value: 10 },
				cell_size: { value: this.cellSize },
				inv_cell_size: { value: 1 / this.cellSize },
				heightmap: { value: null }
			}
		]), n = k.waterVert, r = `#define DISPLAY_HALF_RANGE ${M.toFixed(1)}\n${k.waterFrag}`, a = new w({
			uniforms: t,
			vertexShader: n,
			fragmentShader: r,
			side: g,
			name: "fdtd-2d-material"
		});
		a.lights = !0, this.uniforms = a.uniforms, this.mesh = new v(e, a), this.mesh.matrixAutoUpdate = !1, this.mesh.updateMatrix(), this.mesh.material.wireframe = !1, this.mesh.matrixAutoUpdate = !0, this.mesh.scale.setZ(.01), i.fdtdItems.add(this.mesh), this.gpuCompute = new ne(this.nx, this.ny, i.renderer);
		let o = this.gpuCompute.createTexture();
		this.sourcemap = this.gpuCompute.createTexture(), this.wallmap = this.gpuCompute.createTexture(), this.fillSourceTexture(), this.updateSourceTexture(), this.fillTexture(o);
		let s = this.frequencyDependentWalls ? 4 : 0;
		this.heightmapVariable = this.gpuCompute.addVariable("heightmap", R(de(k.heightMapFrag), s), o), this.rlcVariables = [];
		for (let e = 0; e < s; e++) this.rlcVariables.push(this.gpuCompute.addVariable(`rlc${e}`, z(e), this.gpuCompute.createTexture()));
		this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable, ...this.rlcVariables]);
		for (let e of this.rlcVariables) this.gpuCompute.setVariableDependencies(e, [this.heightmapVariable, e]), e.material.uniforms.sourcemap = { value: this.sourcemap }, e.material.uniforms.wallmap = { value: this.wallmap };
		this.heightmapVariable.material.uniforms.sourcemap = { value: this.sourcemap }, this.heightmapVariable.material.uniforms.wallmap = { value: this.wallmap }, this.heightmapVariable.material.uniforms.mousePos = { value: new E(5, 5) }, this.heightmapVariable.material.uniforms.mouseSize = { value: 0 }, this.heightmapVariable.material.uniforms.damping = { value: 1 }, this.heightmapVariable.material.uniforms.courantSq = { value: 0 }, this.applyWaveSpeed(), this.heightmapVariable.material.uniforms.heightCompensation = { value: 0 }, this.heightmapVariable.material.uniforms.cell_size = { value: this.cellSize }, this.heightmapVariable.material.uniforms.inv_cell_size = { value: 1 / this.cellSize }, this.rlcCoefficients?.dispose(), this.rlcCoefficients = void 0, this.updateRlcCoefficients();
		let c = this.gpuCompute.init();
		c !== null && console.error(c), this.clearShader = this.gpuCompute.createShaderMaterial(k.clearFrag, { clearTexture: { value: null } }), this.zeroShader = this.gpuCompute.createShaderMaterial("void main() { gl_FragColor = vec4(0.0); }", {}), this.readLevelShader = this.gpuCompute.createShaderMaterial(k.readLevelFrag, {
			point1: { value: new E() },
			levelTexture: { value: null },
			cell_size: { value: this.cellSize },
			inv_cell_size: { value: 1 / this.cellSize }
		}), this.readLevelImage = /* @__PURE__ */ new Uint8Array(16), this.readLevelRenderTarget = new O(4, 1, {
			wrapS: p,
			wrapT: p,
			minFilter: x,
			magFilter: x,
			format: C,
			type: te,
			stencilBuffer: !1,
			depthBuffer: !1
		}), this.render(), this.clear();
	}
	editSize() {}
	disposeGpu() {
		if (this.mesh) {
			i.fdtdItems.remove(this.mesh), this.mesh.geometry.dispose();
			let e = this.mesh.material;
			Array.isArray(e) ? e.forEach((e) => e.dispose()) : e.dispose();
		}
		this.readLevelRenderTarget?.dispose(), this.sourcemap?.dispose(), this.wallmap?.dispose(), this.clearShader?.dispose(), this.readLevelShader?.dispose(), this.zeroShader?.dispose(), this.rlcCoefficients?.dispose(), this.rlcCoefficients = void 0, ve(this.gpuCompute);
	}
	dispose() {
		if (this.stop(), this.disposeGpu(), this.editMesh) {
			i.fdtdItems.remove(this.editMesh), this.editMesh.geometry.dispose();
			let e = this.editMesh.material;
			Array.isArray(e) ? e.forEach((e) => e.dispose()) : e.dispose();
		}
		this.eventListeners.forEach((e) => e()), this.eventListeners = [];
		for (let t = 0; t < this.messageHandlers.length; t++) e(this.messageHandlers[t][0], this.messageHandlers[t][1]);
		this.messageHandlers = [];
	}
	run() {
		this.running = !0, this.lastTickMs = null, i.fdtd2drunning = !0;
	}
	stop() {
		this.running = !1, this.lastTickMs = null, i.fdtd2drunning = !1;
	}
	get temperature() {
		return this._temperature;
	}
	set temperature(e) {
		this._temperature = e, this.applyWaveSpeed();
	}
	get c() {
		return o(this._temperature);
	}
	applyWaveSpeed() {
		this.waveSpeed = this.c, this.cellSize > 0 && (this.dt = re(this.cellSize, this.waveSpeed));
		let e = this.heightmapVariable?.material;
		e?.uniforms?.courantSq && this.cellSize > 0 && (e.uniforms.courantSq.value = (this.waveSpeed * this.dt / this.cellSize) ** 2), this.updateRlcCoefficients();
	}
	updateRlcCoefficients() {
		if (!this.frequencyDependentWalls || !this.heightmapVariable || !(this.dt > 0)) return;
		let e = Math.max(1, this.rlcTable.size), t = this.rlcTable.texels(this.dt);
		!this.rlcCoefficients || this.rlcCoefficients.image.height !== e ? (this.rlcCoefficients?.dispose(), this.rlcCoefficients = new h(t, 8, e, C, _), this.rlcCoefficients.minFilter = x, this.rlcCoefficients.magFilter = x) : this.rlcCoefficients.image.data.set(t), this.rlcCoefficients.needsUpdate = !0;
		for (let t of [this.heightmapVariable, ...this.rlcVariables]) {
			let n = t.material.uniforms;
			n.rlcCoefficients = { value: this.rlcCoefficients }, n.rlcMaterialCount = { value: e }, n.courant = { value: this.courant };
		}
	}
	setFrequencyDependentWalls(e) {
		e !== this.frequencyDependentWalls && (this.frequencyDependentWalls = e, this.init(), this.updateWalls());
	}
	get sampleRate() {
		return s(this.dt);
	}
	startRecording() {
		this.recording = !0, this.lastTickMs = null;
		let e = this.sampleRate;
		for (let t of this.sourceKeys) this.sources[t] && (this.sources[t].fdtdSampleRate = e);
		for (let t of this.receiverKeys) this.receivers[t] && (this.receivers[t].fdtdSampleRate = e);
	}
	stopRecording() {
		this.recording = !1;
	}
	setWireframeVisible(e) {
		this.mesh.material.wireframe = e;
	}
	getWireframeVisible() {
		return this.mesh.material.wireframe;
	}
	addSource(e) {
		this.sourceKeys = [...new Set(this.sourceKeys.concat(e.uuid))], this.sources[e.uuid] = e;
	}
	removeSource(e) {
		let t = this.sources[e];
		t && (this.vacateSourceCell(t.position), delete this.sources[e], this.sourceKeys = this.sourceKeys.filter((t) => t !== e));
	}
	planeCellIndex(e) {
		return oe(e, this.slice, {
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			cellSize: this.cellSize,
			nx: this.nx,
			ny: this.ny
		});
	}
	vacateSourceCell(e) {
		let t = this.sourcemap?.image?.data;
		if (!t) return;
		let n = this.planeCellIndex(e);
		n != null && (P(t, n, N()), this.sourcemap.needsUpdate = !0);
	}
	addReceiver(e) {
		this.receiverKeys = [...new Set(this.receiverKeys.concat(e.uuid))], this.receivers[e.uuid] = e;
	}
	removeReceiver(e) {
		this.receivers[e] && (delete this.receivers[e], this.receiverKeys = this.receiverKeys.filter((t) => t !== e));
	}
	addWall(e) {
		let t = Y(Math.floor((e.x1 - this.offsetX) / this.cellSize), 0, this.nx - 1), n = Y(Math.floor((e.y1 - this.offsetY) / this.cellSize), 0, this.ny - 1), r = Y(Math.floor((e.x2 - this.offsetX) / this.cellSize), 0, this.nx - 1), i = Y(Math.floor((e.y2 - this.offsetY) / this.cellSize), 0, this.ny - 1);
		this.walls.push(new J({
			x1: t,
			y1: n,
			x2: r,
			y2: i,
			absorption: e.absorption
		})), this.updateWalls();
	}
	addWallsFromSurfaceEdges(e) {
		e.updateMatrixWorld(!0);
		let t = e.absorptionFunction?.(500) ?? 0, n = e.acousticMaterial?.absorption, r = n ? Object.keys(n).map(Number).sort((e, t) => e - t) : [], i = r.length > 0 ? {
			frequencies: r,
			absorption: r.map((e) => n[String(e)])
		} : void 0, a = e.edges;
		a.updateMatrixWorld(!0);
		let o = a.geometry.getAttribute("position"), s = new D(), c = new D();
		for (let e = 0; e < o.count; e += 2) {
			s.fromBufferAttribute(o, e).applyMatrix4(a.matrixWorld), c.fromBufferAttribute(o, e + 1).applyMatrix4(a.matrixWorld);
			let n = A(s, this.slice), r = A(c, this.slice), l = Y(Math.floor((n.u - this.offsetX) / this.cellSize), 0, this.nx - 1), u = Y(Math.floor((n.v - this.offsetY) / this.cellSize), 0, this.ny - 1), d = Y(Math.floor((r.u - this.offsetX) / this.cellSize), 0, this.nx - 1), f = Y(Math.floor((r.v - this.offsetY) / this.cellSize), 0, this.ny - 1);
			this.walls.push(new J({
				x1: l,
				y1: u,
				x2: d,
				y2: f,
				absorption: t,
				bands: i
			}));
		}
		this.updateWalls();
	}
	fillSourceTexture() {
		let e = this.sourcemap.image.data;
		if (!e) return;
		let t = 0;
		for (let n = 0; n < this.ny; n++) for (let n = 0; n < this.nx; n++) e[t + 0] = 0, e[t + 1] = 0, e[t + 2] = 1, e[t + 3] = 1, t += 4;
	}
	toggleWall(e) {
		this.walls[e] && (this.walls[e].enabled = !this.walls[e].enabled, this.updateWalls());
	}
	get courant() {
		return this.cellSize > 0 ? this.waveSpeed * this.dt / this.cellSize : 0;
	}
	get impedanceFrequencyLimit() {
		return this.cellSize > 0 ? this.waveSpeed / (6 * this.cellSize) : 0;
	}
	updateWalls() {
		let e = this.sourcemap.image.data;
		if (!e) return;
		let t = this.wallmap?.image?.data;
		t || console.warn("FDTD 2D: wallmap missing; walls are written without staircase correction (#220)."), this.rlcTable = new I();
		for (let n = 0; n < this.walls.length; n++) {
			let r = this.walls[n];
			if (r.shouldClearPreviousCells) {
				for (let n = 0; n < r.previousCells.length; n++) {
					let i = 4 * (r.previousCells[n][1] * this.nx + r.previousCells[n][0]);
					e[i + 2] = 1, t && (t[i + 0] = 0, t[i + 1] = 0, t[i + 2] = 0);
				}
				r.shouldClearPreviousCells = !1;
			}
			let i = _e(r, this.courant), a = he(r), o = be(this.rlcMaterialFor(r));
			for (let n = 0; n < r.cells.length; n++) {
				let s = 4 * (r.cells[n][1] * this.nx + r.cells[n][0]);
				e[s + 2] = i, t && (t[s + 0] = a.r, t[s + 1] = a.g, t[s + 2] = o);
			}
		}
		this.sourcemap.needsUpdate = !0, t && (this.wallmap.needsUpdate = !0), this.updateRlcCoefficients();
	}
	rlcMaterialFor(e) {
		if (!this.frequencyDependentWalls || !e.enabled || !e.bands) return null;
		let t = ke(e.bands);
		return t.length > 0 ? this.rlcTable.indexFor(t) : null;
	}
	updateSourceTexture() {
		let e = this.sourcemap.image.data;
		if (e) {
			for (let t = 0; t < this.sourceKeys.length; t++) {
				let n = this.sources[this.sourceKeys[t]];
				n.updateWave(this.time, this.frame, this.dt);
				let r = this.planeCellIndex(n.position);
				if (n.shouldClearPreviousPosition) {
					let t = this.planeCellIndex({
						x: n.previousX,
						y: n.previousY,
						z: n.previousZ
					});
					t != null && t !== r && P(e, t, N()), n.shouldClearPreviousPosition = !1, n.updatePreviousPosition();
				}
				r != null && P(e, r, le(n.velocity));
			}
			this.sourcemap.needsUpdate = !0;
		}
	}
	fillTexture(e) {
		let t = e.image.data;
		if (!t) return;
		let n = 0;
		for (let e = 0; e < this.ny; e++) for (let e = 0; e < this.nx; e++) t[n + 0] = 0, t[n + 1] = 0, t[n + 2] = 0, t[n + 3] = 1, n += 4;
	}
	readReceiverLevels() {
		let e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
		this.readLevelShader.uniforms.levelTexture.value = e.texture;
		for (let e = 0; e < this.receiverKeys.length; e++) {
			let t = this.receiverKeys[e];
			if (this.receivers[t]) {
				let e = A(this.receivers[t].position, this.slice), n = (e.u - this.offsetX) / this.width, r = (e.v - this.offsetY) / this.height;
				this.readLevelShader.uniforms.point1.value.set(n, r), this.gpuCompute.doRenderTarget(this.readLevelShader, this.readLevelRenderTarget), i.renderer.readRenderTargetPixels(this.readLevelRenderTarget, 0, 0, 4, 1, this.readLevelImage);
				let a = new Float32Array(this.readLevelImage.buffer)[0];
				this.receivers[t].fdtdSamples.push(a / M);
			}
		}
	}
	clear() {
		let e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable), t = this.gpuCompute.getAlternateRenderTarget(this.heightmapVariable);
		if (this.clearShader.uniforms.clearTexture.value = e.texture, this.gpuCompute.doRenderTarget(this.clearShader, t), this.clearShader.uniforms.clearTexture.value = t.texture, this.gpuCompute.doRenderTarget(this.clearShader, e), this.zeroShader) for (let e of this.rlcVariables) this.gpuCompute.doRenderTarget(this.zeroShader, this.gpuCompute.getCurrentRenderTarget(e)), this.gpuCompute.doRenderTarget(this.zeroShader, this.gpuCompute.getAlternateRenderTarget(e));
		for (let e of this.sourceKeys) {
			let t = this.sources[e];
			t && (t.value = 0, t.previousValue = 0, t.velocity = 0);
		}
		this.time = 0, this.frame = 0, this.lastTickMs = null;
	}
	render(e = typeof performance < "u" ? performance.now() : 0) {
		let t = this.lastTickMs == null ? 0 : (e - this.lastTickMs) / 1e3;
		this.lastTickMs = e;
		let n = c({
			wallDt: t,
			dt: this.dt,
			displayPasses: this.numPasses,
			recording: this.recording
		});
		for (let e = 0; e < n; e++) {
			this.updateSourceTexture(), this.heightmapVariable.material.uniforms.sourcemap.value = this.sourcemap, this.heightmapVariable.material.uniforms.wallmap.value = this.wallmap;
			for (let e of this.rlcVariables) e.material.uniforms.sourcemap.value = this.sourcemap, e.material.uniforms.wallmap.value = this.wallmap;
			if (this.gpuCompute.compute(), this.recording) {
				for (let e = 0; e < this.sourceKeys.length; e++) this.sources[this.sourceKeys[e]].recordSample();
				this.readReceiverLevels();
			}
			this.time += this.dt, this.frame += 1;
		}
		this.uniforms.heightmap.value = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable).texture;
	}
	onParameterConfigFocus() {}
	onParameterConfigBlur() {}
};
//#endregion
export { $ as FDTD_2D, $ as default };

//# sourceMappingURL=2d-fdtd-0SswEx91.mjs.map