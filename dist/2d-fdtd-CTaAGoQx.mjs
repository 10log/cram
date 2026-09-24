import { S as e, b as t, x as n } from "./FileSaver.min-BS9rdHrk.mjs";
import { p as r, t as i } from "./renderer-Cj8dxF6d.mjs";
import { g as a } from "./store-CUhn0IQy.mjs";
import { t as o } from "./sound-speed-CfEkirc1.mjs";
import { a as s, i as c, r as l } from "./recording-D5dcOUYq.mjs";
import { t as u } from "./reflection-coefficient-DOfZqTBY.mjs";
import { t as d } from "./solver-DCp-VMaM.mjs";
import { ClampToEdgeWrapping as f, Color as p, DataTexture as m, DoubleSide as h, FloatType as g, Mesh as _, MeshBasicMaterial as ee, MeshLambertMaterial as te, NearestFilter as v, PlaneGeometry as y, RGBAFormat as b, ShaderMaterial as x, UniformsLib as S, UniformsUtils as ne, UnsignedByteType as C, Vector2 as w, Vector3 as T, WebGLRenderTarget as E } from "three";
//#region node_modules/three/examples/jsm/misc/GPUComputationRenderer.js
var D = class {
	constructor(e, t, n) {
		this.variables = [], this.currentTextureIndex = 0;
		let i = g, a = { passThruTexture: { value: null } }, o = l(d(), a), s = new r(o);
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
				minFilter: v,
				magFilter: v
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
			let n = new x({
				name: "GPUComputationShader",
				uniforms: t,
				vertexShader: u(),
				fragmentShader: e
			});
			return c(n), n;
		}
		this.createShaderMaterial = l, this.createRenderTarget = function(n, r, a, o, s, c) {
			return n ||= e, r ||= t, a ||= f, o ||= f, s ||= v, c ||= v, new E(n, r, {
				wrapS: a,
				wrapT: o,
				minFilter: s,
				magFilter: c,
				format: b,
				type: i,
				depthBuffer: !1
			});
		}, this.createTexture = function() {
			let n = new Float32Array(e * t * 4), r = new m(n, e, t, b, g);
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
}, O = {
	heightMapFrag: "#include <common>\n\nuniform vec2 mousePos;\nuniform float mouseSize;\nuniform float damping;\nuniform float heightCompensation;\nuniform float courantSq;\n\n// Prepended by withGhostGainDefine (impedance.ts). A uniform would read 0 if\n// it never bound and silently make every wall fully centred (#219), so this\n// refuses to compile instead.\n#ifndef MAX_GHOST_GAIN\n#error MAX_GHOST_GAIN must be defined; build this shader with withGhostGainDefine\n#endif\nuniform sampler2D sourcemap;\n// Staircase face weights (#220), stored as 1 - w: r for x-faces, g for\n// y-faces. Zero — an unwritten texel — is weight 1, the uncorrected wall.\nuniform sampler2D wallmap;\n\nvoid main()	{\n\n  vec2 cellSize = 1.0 / resolution.xy;\n\n  vec2 uv = gl_FragCoord.xy * cellSize;\n    \n  float newvel = 0.;\n  float newpos = 0.;\n\n\n  vec4 heightmapValue = texture2D( heightmap, uv );\n  vec4 sourcemapValue = texture2D( sourcemap, uv);\n  \n\n\n  if(sourcemapValue.b > 0.0){\n    float pos = heightmapValue.r;\n    float vel = heightmapValue.g;\n    \n    \n    \n    vec2 ud_offset = vec2( 0.0, cellSize.y );\n    vec2 rl_offset = vec2( cellSize.x, 0.0 );\n    \n    vec4 u = texture2D( heightmap, uv + ud_offset );    \n    vec4 d = texture2D( heightmap, uv - ud_offset );\n    vec4 r = texture2D( heightmap, uv + rl_offset );\n    vec4 l = texture2D( heightmap, uv - rl_offset );\n    \n    float u_wall = texture2D( sourcemap, uv + ud_offset ).b;\n    float d_wall = texture2D( sourcemap, uv - ud_offset ).b;\n    float r_wall = texture2D( sourcemap, uv + rl_offset ).b;\n    float l_wall = texture2D( sourcemap, uv - rl_offset ).b;\n    \n    \n    // Locally-reacting impedance wall (#199): the ghost is pos - gamma*vel,\n    // where gamma = 1/(xi*C) comes from Surface.absorption. The sourcemap's\n    // blue channel is positive for air and -gamma for a wall, so gamma = 0 —\n    // the rigid Neumann ghost of #111 — keeps the old encoding of exactly 0\n    // and the old behaviour bit for bit. Opposite-neighbor sampling is\n    // neither Dirichlet nor rigid and is what #111 removed.\n    //\n    // The backward ghost is only stable below gamma = 1, so it takes at most\n    // MAX_GHOST_GAIN; any excess is a centred loss applied after the stencil\n    // (#219). A wall at or below MAX_GHOST_GAIN computes exactly what it did.\n    //\n    // Each face's gain is weighted by |n.e| (#220), so a staircased wall\n    // absorbs over its real length rather than every step's. Up/down\n    // neighbours are y-faces (wallmap.g), left/right x-faces (wallmap.r).\n    float u_pos = u.r;\n    float d_pos = d.r;\n    float r_pos = r.r;\n    float l_pos = l.r;\n    float centredGain = 0.0;\n\n    if (u_wall <= 0.0) {\n      float u_gain = u_wall * (1.0 - texture2D( wallmap, uv + ud_offset ).g);\n      u_pos = pos + max(u_gain, -MAX_GHOST_GAIN) * vel;\n      centredGain += max(-u_gain - MAX_GHOST_GAIN, 0.0);\n    }\n    if (d_wall <= 0.0) {\n      float d_gain = d_wall * (1.0 - texture2D( wallmap, uv - ud_offset ).g);\n      d_pos = pos + max(d_gain, -MAX_GHOST_GAIN) * vel;\n      centredGain += max(-d_gain - MAX_GHOST_GAIN, 0.0);\n    }\n    if (r_wall <= 0.0) {\n      float r_gain = r_wall * (1.0 - texture2D( wallmap, uv + rl_offset ).r);\n      r_pos = pos + max(r_gain, -MAX_GHOST_GAIN) * vel;\n      centredGain += max(-r_gain - MAX_GHOST_GAIN, 0.0);\n    }\n    if (l_wall <= 0.0) {\n      float l_gain = l_wall * (1.0 - texture2D( wallmap, uv - rl_offset ).r);\n      l_pos = pos + max(l_gain, -MAX_GHOST_GAIN) * vel;\n      centredGain += max(-l_gain - MAX_GHOST_GAIN, 0.0);\n    }\n\n    float mid = 0.25*(u_pos+d_pos+r_pos+l_pos);\n  \n    float med = 4.0 * courantSq;\n    newvel = med*(mid-pos)+vel*damping;\n    // Centred loss C²·(γc/2)·(p^{n+1} − p^{n−1}), solved for p^{n+1}.\n    if (centredGain > 0.0) {\n      float beta = 0.5 * courantSq * centredGain;\n      newvel = (newvel - beta * vel) / (1.0 + beta);\n    }\n    newpos = pos+newvel;\n    \n    if(sourcemapValue.a == 0.0){  \n      newvel = sourcemapValue.g;\n      newpos = sourcemapValue.r;\n    }    \n  }\n  else {\n    newvel = 0.0;\n    newpos = 127.5;\n  }\n  \n  \n  gl_FragColor = vec4(newpos, newvel, heightmapValue.b, sourcemapValue.b);\n\n\n}\n",
	readLevelFrag: "uniform vec2 point1;\nuniform float cell_size;\nuniform float inv_cell_size;\n\nuniform sampler2D levelTexture;\n\n// Integer to float conversion from https://stackoverflow.com/questions/17981163/webgl-read-pixels-from-floating-point-render-target\n\nfloat shift_right( float v, float amt ) {\n\n	v = floor( v ) + 0.5;\n	return floor( v / exp2( amt ) );\n\n}\n\nfloat shift_left( float v, float amt ) {\n\n	return floor( v * exp2( amt ) + 0.5 );\n\n}\n\nfloat mask_last( float v, float bits ) {\n\n	return mod( v, shift_left( 1.0, bits ) );\n\n}\n\nfloat extract_bits( float num, float from, float to ) {\n\n	from = floor( from + 0.5 ); to = floor( to + 0.5 );\n	return mask_last( shift_right( num, from ), to - from );\n\n}\n\nvec4 encode_float( float val ) {\n	if ( val == 0.0 ) return vec4( 0, 0, 0, 0 );\n	float sign = val > 0.0 ? 0.0 : 1.0;\n	val = abs( val );\n	float exponent = floor( log2( val ) );\n	float biased_exponent = exponent + 127.0;\n	float fraction = ( ( val / exp2( exponent ) ) - 1.0 ) * 8388608.0;\n	float t = biased_exponent / 2.0;\n	float last_bit_of_biased_exponent = fract( t ) * 2.0;\n	float remaining_bits_of_biased_exponent = floor( t );\n	float byte4 = extract_bits( fraction, 0.0, 8.0 ) / 255.0;\n	float byte3 = extract_bits( fraction, 8.0, 16.0 ) / 255.0;\n	float byte2 = ( last_bit_of_biased_exponent * 128.0 + extract_bits( fraction, 16.0, 23.0 ) ) / 255.0;\n	float byte1 = ( sign * 128.0 + remaining_bits_of_biased_exponent ) / 255.0;\n	return vec4( byte4, byte3, byte2, byte1 );\n}\n\nvoid main()	{\n\n	vec2 cellSize = vec2(cell_size);\n\n	float waterLevel = texture2D( levelTexture, point1 ).x;\n\n	vec2 normal = vec2(\n		( texture2D( levelTexture, point1 + vec2( - cellSize.x, 0 ) ).x - texture2D( levelTexture, point1 + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\n		( texture2D( levelTexture, point1 + vec2( 0, - cellSize.y ) ).x - texture2D( levelTexture, point1 + vec2( 0, cellSize.y ) ).x ) * inv_cell_size );\n\n	if ( gl_FragCoord.x < 1.5 ) {\n\n		gl_FragColor = encode_float( waterLevel );\n\n	} else if ( gl_FragCoord.x < 2.5 ) {\n\n		gl_FragColor = encode_float( normal.x );\n\n	} else if ( gl_FragCoord.x < 3.5 ) {\n\n		gl_FragColor = encode_float( normal.y );\n\n	} else {\n\n		gl_FragColor = encode_float( 0.0 );\n\n	}\n\n}",
	clearFrag: "uniform sampler2D clearTexture;\n\nvoid main()	{\n\n	vec2 cellSize = 1.0 / resolution.xy;\n\n	vec2 uv = gl_FragCoord.xy * cellSize;\n\n\n	vec4 textureValue = texture2D( clearTexture, uv );\n\n	textureValue.r = 127.5;\n	textureValue.g = 0.0;\n\n	gl_FragColor = textureValue;\n\n}\n",
	waterVert: "uniform sampler2D heightmap;\nuniform float inv_cell_size;\nuniform float cell_size;\nvarying float vHeight;\nvarying float vWall;\n#define PHONG\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n	varying vec3 vNormal;\n\n#endif\n\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n	vec2 cellSize = vec2( cell_size );\n\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n\n	// # include <beginnormal_vertex>\n	// Compute normal from heightmap\n	vec3 objectNormal = vec3(\n		( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\n		( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * inv_cell_size,\n		1.0 );\n	//<beginnormal_vertex>\n\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n\n#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\n\n	vNormal = normalize( transformedNormal );\n\n#endif\n\n	//# include <begin_vertex>\n	vec4 heightmapValue = texture2D( heightmap, uv );\n	float heightValue = heightmapValue.x - 127.5;\n	vHeight = heightValue;\n	vWall = heightmapValue.a;\n	\n	vec3 transformed = vec3( position.x, position.y, heightValue );\n	//<begin_vertex>\n\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n\n	vViewPosition = - mvPosition.xyz;\n\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n\n}\n",
	waterFrag: "#define PHONG\n\nvarying float vHeight;\nvarying float vWall;\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\nuniform float colorBrightness;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n	#include <clipping_planes_fragment>\n\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n\n	// accumulation\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n\n	// modulation\n	#include <aomap_fragment>\n\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\n	#include <envmap_fragment>\n\n	vec3 col = vec3(0.0,0.0,0.0);\n	if(vHeight > 0.0){\n		col.r = vHeight/127.5*colorBrightness;\n	}\n	else if(vHeight <= 0.0){\n		col.g = -vHeight/127.5*colorBrightness;\n	}\n\n	gl_FragColor = vec4( col, 1.0 );\n\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n\n}"
};
//#endregion
//#region src/compute/2d-fdtd/timestep.ts
function re(e, t) {
	return e / (t * Math.SQRT2);
}
//#endregion
//#region src/compute/2d-fdtd/slice.ts
function k(e) {
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
function j(e, t, n) {
	let r = A(e, t), i = Math.round((r.u - n.offsetX) / n.cellSize), a = Math.round((r.v - n.offsetY) / n.cellSize);
	return i < 0 || a < 0 || i >= n.nx || a >= n.ny ? null : {
		x: i,
		y: a
	};
}
function ie(e, t, n) {
	let r = j(e, t, n);
	return r ? 4 * (r.y * n.nx + r.x) : null;
}
function ae(e, t) {
	let n = {
		dx: e.max.x - e.min.x,
		dy: e.max.y - e.min.y,
		dz: e.max.z - e.min.z
	}, r = t ?? k(n), i = A(e.min, r), a = A(e.max, r);
	return {
		slice: r,
		width: Math.abs(a.u - i.u),
		height: Math.abs(a.v - i.v),
		offsetX: Math.min(i.u, a.u),
		offsetY: Math.min(i.v, a.v),
		sliceHeight: r === "xz" ? e.min.y : 0
	};
}
function M(e, t) {
	t.slice === "xz" ? (e.rotateX(Math.PI / 2), e.translate(t.width / 2, t.sliceHeight, t.height / 2), e.translate(t.offsetX, 0, t.offsetY)) : (e.translate(t.width / 2, t.height / 2, 0), e.translate(t.offsetX, t.offsetY, 0));
}
//#endregion
//#region src/compute/2d-fdtd/field-encoding.ts
var N = 127.5;
function P(e) {
	return N + e * 8;
}
function F() {
	return {
		pressure: N,
		velocity: 0,
		alpha: 1
	};
}
function I(e) {
	return {
		pressure: P(e),
		velocity: 0,
		alpha: 0
	};
}
function L() {
	return F();
}
function R(e, t, n) {
	e[t + 0] = n.pressure, e[t + 1] = n.velocity, e[t + 3] = n.alpha;
}
var z = .95;
function B(e) {
	return `#define MAX_GHOST_GAIN ${String(z)}\n${e}`;
}
function V(e, t) {
	if (!(t > 0)) throw Error(`Courant number must be positive, got ${t}`);
	if (e <= 1e-6) return 0;
	let n = u(e);
	return Number.isFinite(n) ? 1 / (n * t) : 0;
}
function H(e) {
	let t = e.x2 - e.x1, n = e.y2 - e.y1, r = Math.hypot(t, n);
	return r > 0 ? {
		x: Math.abs(n) / r,
		y: Math.abs(t) / r
	} : {
		x: 1,
		y: 1
	};
}
function U(e) {
	return 1 - e;
}
function W(e) {
	if (!e.enabled) return {
		r: 0,
		g: 0
	};
	let t = H(e);
	return {
		r: U(t.x),
		g: U(t.y)
	};
}
function G(e) {
	return e === 0 ? 0 : -e;
}
function K(e, t) {
	return e.enabled ? G(V(e.absorption, t)) : 1;
}
//#endregion
//#region src/compute/2d-fdtd/dispose-gpu.ts
function q(e) {
	if (!e) return;
	let t = e.variables ?? [];
	for (let e of t) e.renderTargets?.forEach((e) => e.dispose()), e.material?.dispose?.();
	e.dispose?.();
}
//#endregion
//#region src/compute/2d-fdtd/rasterize-line.ts
function J(e, t, n, r) {
	let i = [], a, o, s, c, l, u, d, f, p, m, h;
	if (s = n - e, c = r - t, l = Math.abs(s), u = Math.abs(c), d = 2 * u - l, f = 2 * l - u, u <= l) for (s >= 0 ? (a = e, o = t, p = n) : (a = n, o = r, p = e), i.push([a, o]), h = 0; a < p; h++) a += 1, d < 0 ? d += 2 * u : (s < 0 && c < 0 || s > 0 && c > 0 ? o += 1 : --o, d += 2 * (u - l)), i.push([a, o]);
	else for (c >= 0 ? (a = e, o = t, m = r) : (a = n, o = r, m = t), i.push([a, o]), h = 0; o < m; h++) o += 1, f <= 0 ? f += 2 * l : (s < 0 && c < 0 || s > 0 && c > 0 ? a += 1 : --a, f += 2 * (l - u)), i.push([a, o]);
	return i;
}
//#endregion
//#region src/compute/2d-fdtd/fdtd-wall.ts
var Y = class {
	enabled;
	x1;
	y1;
	x2;
	y2;
	cells;
	previousCells;
	shouldClearPreviousCells;
	absorption;
	constructor(e) {
		this.absorption = e.absorption ?? 0, this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = J(this.x1, this.y1, this.x2, this.y2), this.previousCells = this.cells, this.shouldClearPreviousCells = !1, this.enabled = !0;
	}
	move(e) {
		this.previousCells = this.cells, e.absorption !== void 0 && (this.absorption = e.absorption), this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = J(this.x1, this.y1, this.x2, this.y2), this.shouldClearPreviousCells = !0;
	}
};
//#endregion
//#region src/common/clamp.ts
function X(e, t, n) {
	return e < t ? t : e > n ? n : e;
}
//#endregion
//#region src/compute/2d-fdtd/index.ts
var Z = 256, Q = {
	width: 10,
	height: 10,
	cellSize: 10 / Z,
	offsetX: 0,
	offsetY: 0,
	slice: "xz"
}, $ = class extends d {
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
		super(e), this.kind = "fdtd-2d", this.running = !1, this.time = 0, this.frame = 0, this.numPasses = 1, this._temperature = e?.temperature ?? 20, this.waveSpeed = o(this._temperature), this.recording = !1, this.lastTickMs = null;
		let r = [...a.getState().selectedObjects.values()].filter((e) => e.kind === "surface"), s = null;
		e ||= {};
		let c = null;
		if (r.length > 0) {
			s = r.length > 1 ? r[0].mergeSurfaces(r) : r[0], s.updateMatrixWorld(!0), s.mesh.geometry.computeBoundingBox();
			let t = s.mesh.geometry.boundingBox;
			if (t) {
				let n = t.min.clone().applyMatrix4(s.mesh.matrixWorld), r = t.max.clone().applyMatrix4(s.mesh.matrixWorld);
				c = ae({
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
		let l = e && e.width || Q.width, u = e && e.height || Q.height;
		this.offsetX = e && e.offsetX || Q.offsetX, this.offsetY = e && e.offsetY || Q.offsetY, this.slice = e && e.slice || c?.slice || Q.slice, this.sliceHeight = c?.sliceHeight ?? 0, this.cellSize = e && e.cellSize || Math.max(l, u) / Z, this.nx = Math.ceil(l / this.cellSize), this.ny = Math.ceil(u / this.cellSize), this.width = this.nx * this.cellSize, this.height = this.ny * this.cellSize, this.dt = 0, this.applyWaveSpeed(), this.sources = {}, this.sourceKeys = [], this.receivers = {}, this.receiverKeys = [], this.walls = [], this.messageHandlers = [], this.eventListeners = [];
		let d = new y(this.width, this.height, 1, 1);
		M(d, {
			slice: this.slice,
			width: this.width,
			height: this.height,
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			sliceHeight: this.sliceHeight
		});
		let f = [new ee({
			wireframe: !0,
			side: h,
			color: 7368816
		}), new te({
			transparent: !0,
			opacity: .35,
			side: h,
			color: 7368816
		})];
		this.editMesh = new _(d, f[0]), this.editMesh.name = "fdtd-2d-edit-mesh", this.editMesh.visible = !1, i.fdtdItems.add(this.editMesh), this.fillTexture = this.fillTexture.bind(this), this.init = this.init.bind(this), this.render = this.render.bind(this), this.updateWalls = this.updateWalls.bind(this), this.updateSourceTexture = this.updateSourceTexture.bind(this), this.addWallsFromSurfaceEdges = this.addWallsFromSurfaceEdges.bind(this), this.setWireframeVisible = this.setWireframeVisible.bind(this), this.getWireframeVisible = this.getWireframeVisible.bind(this), this.toggleWall = this.toggleWall.bind(this), this.clear = this.clear.bind(this), this.init(), this.eventListeners.push(t("RENDERER_UPDATED", () => {
			this.running && this.render();
		})), this.onModeChange(n("GET_EDITOR_MODE")[0]), s && this.addWallsFromSurfaceEdges(s);
	}
	onModeChange(e) {
		switch (e) {
			case s.OBJECT:
				this.editMesh.visible = !1, this.mesh.visible = !0;
				break;
			case s.SKETCH:
				this.editMesh.visible = !1, this.mesh.visible = !1;
				break;
			case s.EDIT: this.editMesh.visible = !0, this.mesh.visible = !1;
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
		let e = new y(this.width, this.height, this.nx - 1, this.ny - 1);
		e.name = "fdtd-2d-plane-geometry", M(e, {
			slice: this.slice,
			width: this.width,
			height: this.height,
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			sliceHeight: this.sliceHeight
		});
		let t = ne.merge([
			S.common,
			S.specularmap,
			S.envmap,
			S.aomap,
			S.lightmap,
			S.emissivemap,
			S.bumpmap,
			S.normalmap,
			S.displacementmap,
			S.gradientmap,
			S.fog,
			S.lights,
			{
				emissive: { value: new p(0) },
				specular: { value: new p(1118481) },
				shininess: { value: 30 },
				colorBrightness: { value: 10 },
				cell_size: { value: this.cellSize },
				inv_cell_size: { value: 1 / this.cellSize },
				heightmap: { value: null }
			}
		]), n = O.waterVert, r = O.waterFrag, a = new x({
			uniforms: t,
			vertexShader: n,
			fragmentShader: r,
			side: h,
			name: "fdtd-2d-material"
		});
		a.lights = !0, this.uniforms = a.uniforms, this.mesh = new _(e, a), this.mesh.matrixAutoUpdate = !1, this.mesh.updateMatrix(), this.mesh.material.wireframe = !1, this.mesh.matrixAutoUpdate = !0, this.mesh.scale.setZ(.01), i.fdtdItems.add(this.mesh), this.gpuCompute = new D(this.nx, this.ny, i.renderer);
		let o = this.gpuCompute.createTexture();
		this.sourcemap = this.gpuCompute.createTexture(), this.wallmap = this.gpuCompute.createTexture(), this.fillSourceTexture(), this.updateSourceTexture(), this.fillTexture(o), this.heightmapVariable = this.gpuCompute.addVariable("heightmap", B(O.heightMapFrag), o), this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]), this.heightmapVariable.material.uniforms.sourcemap = { value: this.sourcemap }, this.heightmapVariable.material.uniforms.wallmap = { value: this.wallmap }, this.heightmapVariable.material.uniforms.mousePos = { value: new w(5, 5) }, this.heightmapVariable.material.uniforms.mouseSize = { value: 0 }, this.heightmapVariable.material.uniforms.damping = { value: 1 }, this.heightmapVariable.material.uniforms.courantSq = { value: 0 }, this.applyWaveSpeed(), this.heightmapVariable.material.uniforms.heightCompensation = { value: 0 }, this.heightmapVariable.material.uniforms.cell_size = { value: this.cellSize }, this.heightmapVariable.material.uniforms.inv_cell_size = { value: 1 / this.cellSize };
		let s = this.gpuCompute.init();
		s !== null && console.error(s), this.clearShader = this.gpuCompute.createShaderMaterial(O.clearFrag, { clearTexture: { value: null } }), this.readLevelShader = this.gpuCompute.createShaderMaterial(O.readLevelFrag, {
			point1: { value: new w() },
			levelTexture: { value: null },
			cell_size: { value: this.cellSize },
			inv_cell_size: { value: 1 / this.cellSize }
		}), this.readLevelImage = /* @__PURE__ */ new Uint8Array(16), this.readLevelRenderTarget = new E(4, 1, {
			wrapS: f,
			wrapT: f,
			minFilter: v,
			magFilter: v,
			format: b,
			type: C,
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
		this.readLevelRenderTarget?.dispose(), this.sourcemap?.dispose(), this.wallmap?.dispose(), this.clearShader?.dispose(), this.readLevelShader?.dispose(), q(this.gpuCompute);
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
		e?.uniforms?.courantSq && this.cellSize > 0 && (e.uniforms.courantSq.value = (this.waveSpeed * this.dt / this.cellSize) ** 2);
	}
	get sampleRate() {
		return c(this.dt);
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
		return ie(e, this.slice, {
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
		n != null && (R(t, n, L()), this.sourcemap.needsUpdate = !0);
	}
	addReceiver(e) {
		this.receiverKeys = [...new Set(this.receiverKeys.concat(e.uuid))], this.receivers[e.uuid] = e;
	}
	removeReceiver(e) {
		this.receivers[e] && (delete this.receivers[e], this.receiverKeys = this.receiverKeys.filter((t) => t !== e));
	}
	addWall(e) {
		let t = X(Math.floor((e.x1 - this.offsetX) / this.cellSize), 0, this.nx - 1), n = X(Math.floor((e.y1 - this.offsetY) / this.cellSize), 0, this.ny - 1), r = X(Math.floor((e.x2 - this.offsetX) / this.cellSize), 0, this.nx - 1), i = X(Math.floor((e.y2 - this.offsetY) / this.cellSize), 0, this.ny - 1);
		this.walls.push(new Y({
			x1: t,
			y1: n,
			x2: r,
			y2: i,
			absorption: e.absorption
		})), this.updateWalls();
	}
	addWallsFromSurfaceEdges(e) {
		e.updateMatrixWorld(!0);
		let t = e.absorptionFunction?.(500) ?? 0, n = e.edges;
		n.updateMatrixWorld(!0);
		let r = n.geometry.getAttribute("position"), i = new T(), a = new T();
		for (let e = 0; e < r.count; e += 2) {
			i.fromBufferAttribute(r, e).applyMatrix4(n.matrixWorld), a.fromBufferAttribute(r, e + 1).applyMatrix4(n.matrixWorld);
			let o = A(i, this.slice), s = A(a, this.slice), c = X(Math.floor((o.u - this.offsetX) / this.cellSize), 0, this.nx - 1), l = X(Math.floor((o.v - this.offsetY) / this.cellSize), 0, this.ny - 1), u = X(Math.floor((s.u - this.offsetX) / this.cellSize), 0, this.nx - 1), d = X(Math.floor((s.v - this.offsetY) / this.cellSize), 0, this.ny - 1);
			this.walls.push(new Y({
				x1: c,
				y1: l,
				x2: u,
				y2: d,
				absorption: t
			}));
		}
		this.updateWalls();
	}
	fillSourceTexture() {
		let e = this.sourcemap.image.data;
		if (!e) return;
		let t = 0;
		for (let n = 0; n < this.ny; n++) for (let n = 0; n < this.nx; n++) e[t + 0] = N, e[t + 1] = 0, e[t + 2] = 1, e[t + 3] = 1, t += 4;
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
		t || console.warn("FDTD 2D: wallmap missing; walls are written without staircase correction (#220).");
		for (let n = 0; n < this.walls.length; n++) {
			let r = this.walls[n];
			if (r.shouldClearPreviousCells) {
				for (let n = 0; n < r.previousCells.length; n++) {
					let i = 4 * (r.previousCells[n][1] * this.nx + r.previousCells[n][0]);
					e[i + 2] = 1, t && (t[i + 0] = 0, t[i + 1] = 0);
				}
				r.shouldClearPreviousCells = !1;
			}
			let i = K(r, this.courant), a = W(r);
			for (let n = 0; n < r.cells.length; n++) {
				let o = 4 * (r.cells[n][1] * this.nx + r.cells[n][0]);
				e[o + 2] = i, t && (t[o + 0] = a.r, t[o + 1] = a.g);
			}
		}
		this.sourcemap.needsUpdate = !0, t && (this.wallmap.needsUpdate = !0);
	}
	updateSourceTexture() {
		let e = this.sourcemap.image.data;
		if (e) {
			for (let t = 0; t < this.sourceKeys.length; t++) {
				let n = this.sources[this.sourceKeys[t]];
				n.updateWave(this.time, this.frame, this.dt);
				let r = this.planeCellIndex(n.position);
				if (r != null && R(e, r, I(n.value)), n.shouldClearPreviousPosition) {
					let t = this.planeCellIndex({
						x: n.previousX,
						y: n.previousY,
						z: n.previousZ
					});
					t != null && R(e, t, L()), n.shouldClearPreviousPosition = !1, n.updatePreviousPosition();
				}
			}
			this.sourcemap.needsUpdate = !0;
		}
	}
	fillTexture(e) {
		let t = e.image.data;
		if (!t) return;
		let n = 0;
		for (let e = 0; e < this.ny; e++) for (let e = 0; e < this.nx; e++) t[n + 0] = N, t[n + 1] = 0, t[n + 2] = 1, t[n + 3] = 1, n += 4;
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
				this.receivers[t].fdtdSamples.push((a - 127.5) / 127.5);
			}
		}
	}
	clear() {
		let e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable), t = this.gpuCompute.getAlternateRenderTarget(this.heightmapVariable);
		this.clearShader.uniforms.clearTexture.value = e.texture, this.gpuCompute.doRenderTarget(this.clearShader, t), this.clearShader.uniforms.clearTexture.value = t.texture, this.gpuCompute.doRenderTarget(this.clearShader, e), this.time = 0, this.frame = 0, this.lastTickMs = null;
	}
	render(e = typeof performance < "u" ? performance.now() : 0) {
		let t = this.lastTickMs == null ? 0 : (e - this.lastTickMs) / 1e3;
		this.lastTickMs = e;
		let n = l({
			wallDt: t,
			dt: this.dt,
			displayPasses: this.numPasses,
			recording: this.recording
		});
		for (let e = 0; e < n; e++) {
			if (this.updateSourceTexture(), this.heightmapVariable.material.uniforms.sourcemap.value = this.sourcemap, this.heightmapVariable.material.uniforms.wallmap.value = this.wallmap, this.gpuCompute.compute(), this.recording) {
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

//# sourceMappingURL=2d-fdtd-CTaAGoQx.mjs.map