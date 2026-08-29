import { b as e, x as t, y as n } from "./FileSaver.min-DhK9iPpQ.mjs";
import { p as r, t as i } from "./renderer-Be437Bsu.mjs";
import { g as a } from "./store-CAL1R5s7.mjs";
import { t as o } from "./sound-speed-CfEkirc1.mjs";
import { a as s, i as c, r as l } from "./recording-D5dcOUYq.mjs";
import { t as u } from "./solver-DovuaY8D.mjs";
import { ClampToEdgeWrapping as d, Color as f, DataTexture as p, DoubleSide as m, FloatType as h, Mesh as g, MeshBasicMaterial as _, MeshLambertMaterial as v, NearestFilter as y, PlaneGeometry as b, RGBAFormat as x, ShaderMaterial as S, UniformsLib as C, UniformsUtils as w, UnsignedByteType as T, Vector2 as E, Vector3 as D, WebGLRenderTarget as O } from "three";
//#region node_modules/three/examples/jsm/misc/GPUComputationRenderer.js
var k = class {
	constructor(e, t, n) {
		this.variables = [], this.currentTextureIndex = 0;
		let i = h, a = { passThruTexture: { value: null } }, o = l(f(), a), s = new r(o);
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
				minFilter: y,
				magFilter: y
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
			let n = new S({
				name: "GPUComputationShader",
				uniforms: t,
				vertexShader: u(),
				fragmentShader: e
			});
			return c(n), n;
		}
		this.createShaderMaterial = l, this.createRenderTarget = function(n, r, a, o, s, c) {
			return n ||= e, r ||= t, a ||= d, o ||= d, s ||= y, c ||= y, new O(n, r, {
				wrapS: a,
				wrapT: o,
				minFilter: s,
				magFilter: c,
				format: x,
				type: i,
				depthBuffer: !1
			});
		}, this.createTexture = function() {
			let n = new Float32Array(e * t * 4), r = new p(n, e, t, x, h);
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
		function f() {
			return "uniform sampler2D passThruTexture;\n\nvoid main() {\n\n	vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n	gl_FragColor = texture2D( passThruTexture, uv );\n\n}\n";
		}
	}
}, A = {
	heightMapFrag: "#include <common>\n\nuniform vec2 mousePos;\nuniform float mouseSize;\nuniform float damping;\nuniform float heightCompensation;\nuniform float courantSq;\nuniform sampler2D sourcemap;\n\nvoid main()	{\n\n  vec2 cellSize = 1.0 / resolution.xy;\n\n  vec2 uv = gl_FragCoord.xy * cellSize;\n    \n  float newvel = 0.;\n  float newpos = 0.;\n\n\n  vec4 heightmapValue = texture2D( heightmap, uv );\n  vec4 sourcemapValue = texture2D( sourcemap, uv);\n  \n\n\n  if(sourcemapValue.b > 0.0){\n    float pos = heightmapValue.r;\n    float vel = heightmapValue.g;\n    \n    \n    \n    vec2 ud_offset = vec2( 0.0, cellSize.y );\n    vec2 rl_offset = vec2( cellSize.x, 0.0 );\n    \n    vec4 u = texture2D( heightmap, uv + ud_offset );    \n    vec4 d = texture2D( heightmap, uv - ud_offset );\n    vec4 r = texture2D( heightmap, uv + rl_offset );\n    vec4 l = texture2D( heightmap, uv - rl_offset );\n    \n    float u_wall = texture2D( sourcemap, uv + ud_offset ).b;\n    float d_wall = texture2D( sourcemap, uv - ud_offset ).b;\n    float r_wall = texture2D( sourcemap, uv + rl_offset ).b;\n    float l_wall = texture2D( sourcemap, uv - rl_offset ).b;\n    \n    \n    // Rigid wall (Neumann): ghost pressure equals this cell.\n    // Opposite-neighbor sampling is neither Dirichlet nor rigid (#111).\n    // TODO: locally-reacting impedance from Surface.absorptionFunction.\n    float u_pos = u.r;\n    float d_pos = d.r;\n    float r_pos = r.r;\n    float l_pos = l.r;\n\n    if (u_wall == 0.0) {\n      u_pos = pos;\n    }\n    if (d_wall == 0.0) {\n      d_pos = pos;\n    }\n    if (r_wall == 0.0) {\n      r_pos = pos;\n    }\n    if (l_wall == 0.0) {\n      l_pos = pos;\n    }\n\n    float mid = 0.25*(u_pos+d_pos+r_pos+l_pos);\n  \n    float med = 4.0 * courantSq;\n    newvel = med*(mid-pos)+vel*damping;\n    newpos = pos+newvel;\n    \n    if(sourcemapValue.a == 0.0){  \n      newvel = sourcemapValue.g;\n      newpos = sourcemapValue.r;\n    }    \n  }\n  else {\n    newvel = 0.0;\n    newpos = 127.5;\n  }\n  \n  \n  gl_FragColor = vec4(newpos, newvel, heightmapValue.b, sourcemapValue.b);\n\n\n}\n",
	readLevelFrag: "uniform vec2 point1;\nuniform float cell_size;\nuniform float inv_cell_size;\n\nuniform sampler2D levelTexture;\n\n// Integer to float conversion from https://stackoverflow.com/questions/17981163/webgl-read-pixels-from-floating-point-render-target\n\nfloat shift_right( float v, float amt ) {\n\n	v = floor( v ) + 0.5;\n	return floor( v / exp2( amt ) );\n\n}\n\nfloat shift_left( float v, float amt ) {\n\n	return floor( v * exp2( amt ) + 0.5 );\n\n}\n\nfloat mask_last( float v, float bits ) {\n\n	return mod( v, shift_left( 1.0, bits ) );\n\n}\n\nfloat extract_bits( float num, float from, float to ) {\n\n	from = floor( from + 0.5 ); to = floor( to + 0.5 );\n	return mask_last( shift_right( num, from ), to - from );\n\n}\n\nvec4 encode_float( float val ) {\n	if ( val == 0.0 ) return vec4( 0, 0, 0, 0 );\n	float sign = val > 0.0 ? 0.0 : 1.0;\n	val = abs( val );\n	float exponent = floor( log2( val ) );\n	float biased_exponent = exponent + 127.0;\n	float fraction = ( ( val / exp2( exponent ) ) - 1.0 ) * 8388608.0;\n	float t = biased_exponent / 2.0;\n	float last_bit_of_biased_exponent = fract( t ) * 2.0;\n	float remaining_bits_of_biased_exponent = floor( t );\n	float byte4 = extract_bits( fraction, 0.0, 8.0 ) / 255.0;\n	float byte3 = extract_bits( fraction, 8.0, 16.0 ) / 255.0;\n	float byte2 = ( last_bit_of_biased_exponent * 128.0 + extract_bits( fraction, 16.0, 23.0 ) ) / 255.0;\n	float byte1 = ( sign * 128.0 + remaining_bits_of_biased_exponent ) / 255.0;\n	return vec4( byte4, byte3, byte2, byte1 );\n}\n\nvoid main()	{\n\n	vec2 cellSize = vec2(cell_size);\n\n	float waterLevel = texture2D( levelTexture, point1 ).x;\n\n	vec2 normal = vec2(\n		( texture2D( levelTexture, point1 + vec2( - cellSize.x, 0 ) ).x - texture2D( levelTexture, point1 + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\n		( texture2D( levelTexture, point1 + vec2( 0, - cellSize.y ) ).x - texture2D( levelTexture, point1 + vec2( 0, cellSize.y ) ).x ) * inv_cell_size );\n\n	if ( gl_FragCoord.x < 1.5 ) {\n\n		gl_FragColor = encode_float( waterLevel );\n\n	} else if ( gl_FragCoord.x < 2.5 ) {\n\n		gl_FragColor = encode_float( normal.x );\n\n	} else if ( gl_FragCoord.x < 3.5 ) {\n\n		gl_FragColor = encode_float( normal.y );\n\n	} else {\n\n		gl_FragColor = encode_float( 0.0 );\n\n	}\n\n}",
	clearFrag: "uniform sampler2D clearTexture;\n\nvoid main()	{\n\n	vec2 cellSize = 1.0 / resolution.xy;\n\n	vec2 uv = gl_FragCoord.xy * cellSize;\n\n\n	vec4 textureValue = texture2D( clearTexture, uv );\n\n	textureValue.r = 127.5;\n	textureValue.g = 0.0;\n\n	gl_FragColor = textureValue;\n\n}\n",
	waterVert: "uniform sampler2D heightmap;\nuniform float inv_cell_size;\nuniform float cell_size;\nvarying float vHeight;\nvarying float vWall;\n#define PHONG\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n	varying vec3 vNormal;\n\n#endif\n\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n	vec2 cellSize = vec2( cell_size );\n\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n\n	// # include <beginnormal_vertex>\n	// Compute normal from heightmap\n	vec3 objectNormal = vec3(\n		( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\n		( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * inv_cell_size,\n		1.0 );\n	//<beginnormal_vertex>\n\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n\n#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\n\n	vNormal = normalize( transformedNormal );\n\n#endif\n\n	//# include <begin_vertex>\n	vec4 heightmapValue = texture2D( heightmap, uv );\n	float heightValue = heightmapValue.x - 127.5;\n	vHeight = heightValue;\n	vWall = heightmapValue.a;\n	\n	vec3 transformed = vec3( position.x, position.y, heightValue );\n	//<begin_vertex>\n\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n\n	vViewPosition = - mvPosition.xyz;\n\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n\n}\n",
	waterFrag: "#define PHONG\n\nvarying float vHeight;\nvarying float vWall;\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\nuniform float colorBrightness;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n	#include <clipping_planes_fragment>\n\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n\n	// accumulation\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n\n	// modulation\n	#include <aomap_fragment>\n\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\n	#include <envmap_fragment>\n\n	vec3 col = vec3(0.0,0.0,0.0);\n	if(vHeight > 0.0){\n		col.r = vHeight/127.5*colorBrightness;\n	}\n	else if(vHeight <= 0.0){\n		col.g = -vHeight/127.5*colorBrightness;\n	}\n\n	gl_FragColor = vec4( col, 1.0 );\n\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n\n}"
};
//#endregion
//#region src/compute/2d-fdtd/timestep.ts
function j(e, t) {
	return e / (t * Math.SQRT2);
}
//#endregion
//#region src/compute/2d-fdtd/slice.ts
function M(e) {
	return Math.abs(e.dx * e.dz) >= Math.abs(e.dx * e.dy) ? "xz" : "xy";
}
function N(e, t) {
	return t === "xz" ? {
		u: e.x,
		v: e.z
	} : {
		u: e.x,
		v: e.y
	};
}
function P(e, t, n) {
	let r = N(e, t), i = Math.round((r.u - n.offsetX) / n.cellSize), a = Math.round((r.v - n.offsetY) / n.cellSize);
	return i < 0 || a < 0 || i >= n.nx || a >= n.ny ? null : {
		x: i,
		y: a
	};
}
function F(e, t, n) {
	let r = P(e, t, n);
	return r ? 4 * (r.y * n.nx + r.x) : null;
}
function I(e, t) {
	let n = {
		dx: e.max.x - e.min.x,
		dy: e.max.y - e.min.y,
		dz: e.max.z - e.min.z
	}, r = t ?? M(n), i = N(e.min, r), a = N(e.max, r);
	return {
		slice: r,
		width: Math.abs(a.u - i.u),
		height: Math.abs(a.v - i.v),
		offsetX: Math.min(i.u, a.u),
		offsetY: Math.min(i.v, a.v),
		sliceHeight: r === "xz" ? e.min.y : 0
	};
}
function L(e, t) {
	t.slice === "xz" ? (e.rotateX(Math.PI / 2), e.translate(t.width / 2, t.sliceHeight, t.height / 2), e.translate(t.offsetX, 0, t.offsetY)) : (e.translate(t.width / 2, t.height / 2, 0), e.translate(t.offsetX, t.offsetY, 0));
}
//#endregion
//#region src/compute/2d-fdtd/field-encoding.ts
var R = 127.5;
function z(e) {
	return R + e * 8;
}
function B() {
	return {
		pressure: R,
		velocity: 0,
		alpha: 1
	};
}
function V(e) {
	return {
		pressure: z(e),
		velocity: 0,
		alpha: 0
	};
}
function H() {
	return B();
}
function U(e, t, n) {
	e[t + 0] = n.pressure, e[t + 1] = n.velocity, e[t + 3] = n.alpha;
}
//#endregion
//#region src/compute/2d-fdtd/dispose-gpu.ts
function W(e) {
	if (!e) return;
	let t = e.variables ?? [];
	for (let e of t) e.renderTargets?.forEach((e) => e.dispose()), e.material?.dispose?.();
	e.dispose?.();
}
//#endregion
//#region src/compute/2d-fdtd/rasterize-line.ts
function G(e, t, n, r) {
	let i = [], a, o, s, c, l, u, d, f, p, m, h;
	if (s = n - e, c = r - t, l = Math.abs(s), u = Math.abs(c), d = 2 * u - l, f = 2 * l - u, u <= l) for (s >= 0 ? (a = e, o = t, p = n) : (a = n, o = r, p = e), i.push([a, o]), h = 0; a < p; h++) a += 1, d < 0 ? d += 2 * u : (s < 0 && c < 0 || s > 0 && c > 0 ? o += 1 : --o, d += 2 * (u - l)), i.push([a, o]);
	else for (c >= 0 ? (a = e, o = t, m = r) : (a = n, o = r, m = t), i.push([a, o]), h = 0; o < m; h++) o += 1, f <= 0 ? f += 2 * l : (s < 0 && c < 0 || s > 0 && c > 0 ? a += 1 : --a, f += 2 * (l - u)), i.push([a, o]);
	return i;
}
//#endregion
//#region src/compute/2d-fdtd/fdtd-wall.ts
var K = class {
	enabled;
	x1;
	y1;
	x2;
	y2;
	cells;
	previousCells;
	shouldClearPreviousCells;
	constructor(e) {
		this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = G(this.x1, this.y1, this.x2, this.y2), this.previousCells = this.cells, this.shouldClearPreviousCells = !1, this.enabled = !0;
	}
	move(e) {
		this.previousCells = this.cells, this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = G(this.x1, this.y1, this.x2, this.y2), this.shouldClearPreviousCells = !0;
	}
};
//#endregion
//#region src/common/clamp.ts
function q(e, t, n) {
	return e < t ? t : e > n ? n : e;
}
//#endregion
//#region src/compute/2d-fdtd/index.ts
var J = 256, Y = {
	width: 10,
	height: 10,
	cellSize: 10 / J,
	offsetX: 0,
	offsetY: 0,
	slice: "xz"
}, X = class extends u {
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
	constructor(t) {
		super(t), this.kind = "fdtd-2d", this.running = !1, this.time = 0, this.frame = 0, this.numPasses = 1, this._temperature = t?.temperature ?? 20, this.waveSpeed = o(this._temperature), this.recording = !1, this.lastTickMs = null;
		let r = [...a.getState().selectedObjects.values()].filter((e) => e.kind === "surface"), s = null;
		t ||= {};
		let c = null;
		if (r.length > 0) {
			s = r.length > 1 ? r[0].mergeSurfaces(r) : r[0], s.updateMatrixWorld(!0), s.mesh.geometry.computeBoundingBox();
			let e = s.mesh.geometry.boundingBox;
			if (e) {
				let n = e.min.clone().applyMatrix4(s.mesh.matrixWorld), r = e.max.clone().applyMatrix4(s.mesh.matrixWorld);
				c = I({
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
				}, t.slice), t.width = c.width, t.height = c.height, t.offsetX = c.offsetX, t.offsetY = c.offsetY, t.slice = c.slice;
			}
		}
		let l = t && t.width || Y.width, u = t && t.height || Y.height;
		this.offsetX = t && t.offsetX || Y.offsetX, this.offsetY = t && t.offsetY || Y.offsetY, this.slice = t && t.slice || c?.slice || Y.slice, this.sliceHeight = c?.sliceHeight ?? 0, this.cellSize = t && t.cellSize || Math.max(l, u) / J, this.nx = Math.ceil(l / this.cellSize), this.ny = Math.ceil(u / this.cellSize), this.width = this.nx * this.cellSize, this.height = this.ny * this.cellSize, this.applyWaveSpeed(), this.sources = {}, this.sourceKeys = [], this.receivers = {}, this.receiverKeys = [], this.walls = [], this.messageHandlers = [], this.eventListeners = [];
		let d = new b(this.width, this.height, 1, 1);
		L(d, {
			slice: this.slice,
			width: this.width,
			height: this.height,
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			sliceHeight: this.sliceHeight
		});
		let f = [new _({
			wireframe: !0,
			side: m,
			color: 7368816
		}), new v({
			transparent: !0,
			opacity: .35,
			side: m,
			color: 7368816
		})];
		this.editMesh = new g(d, f[0]), this.editMesh.name = "fdtd-2d-edit-mesh", this.editMesh.visible = !1, i.fdtdItems.add(this.editMesh), this.fillTexture = this.fillTexture.bind(this), this.init = this.init.bind(this), this.render = this.render.bind(this), this.updateWalls = this.updateWalls.bind(this), this.updateSourceTexture = this.updateSourceTexture.bind(this), this.addWallsFromSurfaceEdges = this.addWallsFromSurfaceEdges.bind(this), this.setWireframeVisible = this.setWireframeVisible.bind(this), this.getWireframeVisible = this.getWireframeVisible.bind(this), this.toggleWall = this.toggleWall.bind(this), this.clear = this.clear.bind(this), this.init(), this.eventListeners.push(n("RENDERER_UPDATED", () => {
			this.running && this.render();
		})), this.onModeChange(e("GET_EDITOR_MODE")[0]), s && this.addWallsFromSurfaceEdges(s);
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
		let e = new b(this.width, this.height, this.nx - 1, this.ny - 1);
		e.name = "fdtd-2d-plane-geometry", L(e, {
			slice: this.slice,
			width: this.width,
			height: this.height,
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			sliceHeight: this.sliceHeight
		});
		let t = w.merge([
			C.common,
			C.specularmap,
			C.envmap,
			C.aomap,
			C.lightmap,
			C.emissivemap,
			C.bumpmap,
			C.normalmap,
			C.displacementmap,
			C.gradientmap,
			C.fog,
			C.lights,
			{
				emissive: { value: new f(0) },
				specular: { value: new f(1118481) },
				shininess: { value: 30 },
				colorBrightness: { value: 10 },
				cell_size: { value: this.cellSize },
				inv_cell_size: { value: 1 / this.cellSize },
				heightmap: { value: null }
			}
		]), n = A.waterVert, r = A.waterFrag, a = new S({
			uniforms: t,
			vertexShader: n,
			fragmentShader: r,
			side: m,
			name: "fdtd-2d-material"
		});
		a.lights = !0, this.uniforms = a.uniforms, this.mesh = new g(e, a), this.mesh.matrixAutoUpdate = !1, this.mesh.updateMatrix(), this.mesh.material.wireframe = !1, this.mesh.matrixAutoUpdate = !0, this.mesh.scale.setZ(.01), i.fdtdItems.add(this.mesh), this.gpuCompute = new k(this.nx, this.ny, i.renderer);
		let o = this.gpuCompute.createTexture();
		this.sourcemap = this.gpuCompute.createTexture(), this.fillSourceTexture(), this.updateSourceTexture(), this.fillTexture(o), this.heightmapVariable = this.gpuCompute.addVariable("heightmap", A.heightMapFrag, o), this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]), this.heightmapVariable.material.uniforms.sourcemap = { value: this.sourcemap }, this.heightmapVariable.material.uniforms.mousePos = { value: new E(5, 5) }, this.heightmapVariable.material.uniforms.mouseSize = { value: 0 }, this.heightmapVariable.material.uniforms.damping = { value: .9999 }, this.heightmapVariable.material.uniforms.courantSq = { value: 0 }, this.applyWaveSpeed(), this.heightmapVariable.material.uniforms.heightCompensation = { value: 0 }, this.heightmapVariable.material.uniforms.cell_size = { value: this.cellSize }, this.heightmapVariable.material.uniforms.inv_cell_size = { value: 1 / this.cellSize };
		let s = this.gpuCompute.init();
		s !== null && console.error(s), this.clearShader = this.gpuCompute.createShaderMaterial(A.clearFrag, { clearTexture: { value: null } }), this.readLevelShader = this.gpuCompute.createShaderMaterial(A.readLevelFrag, {
			point1: { value: new E() },
			levelTexture: { value: null },
			cell_size: { value: this.cellSize },
			inv_cell_size: { value: 1 / this.cellSize }
		}), this.readLevelImage = /* @__PURE__ */ new Uint8Array(16), this.readLevelRenderTarget = new O(4, 1, {
			wrapS: d,
			wrapT: d,
			minFilter: y,
			magFilter: y,
			format: x,
			type: T,
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
		this.readLevelRenderTarget?.dispose(), this.sourcemap?.dispose(), this.clearShader?.dispose(), this.readLevelShader?.dispose(), W(this.gpuCompute);
	}
	dispose() {
		if (this.stop(), this.disposeGpu(), this.editMesh) {
			i.fdtdItems.remove(this.editMesh), this.editMesh.geometry.dispose();
			let e = this.editMesh.material;
			Array.isArray(e) ? e.forEach((e) => e.dispose()) : e.dispose();
		}
		this.eventListeners.forEach((e) => e()), this.eventListeners = [];
		for (let e = 0; e < this.messageHandlers.length; e++) t(this.messageHandlers[e][0], this.messageHandlers[e][1]);
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
		this.waveSpeed = this.c, this.cellSize > 0 && (this.dt = j(this.cellSize, this.waveSpeed));
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
		return F(e, this.slice, {
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
		n != null && (U(t, n, H()), this.sourcemap.needsUpdate = !0);
	}
	addReceiver(e) {
		this.receiverKeys = [...new Set(this.receiverKeys.concat(e.uuid))], this.receivers[e.uuid] = e;
	}
	removeReceiver(e) {
		this.receivers[e] && (delete this.receivers[e], this.receiverKeys = this.receiverKeys.filter((t) => t !== e));
	}
	addWall(e) {
		let t = q(Math.floor((e.x1 - this.offsetX) / this.cellSize), 0, this.nx - 1), n = q(Math.floor((e.y1 - this.offsetY) / this.cellSize), 0, this.ny - 1), r = q(Math.floor((e.x2 - this.offsetX) / this.cellSize), 0, this.nx - 1), i = q(Math.floor((e.y2 - this.offsetY) / this.cellSize), 0, this.ny - 1);
		this.walls.push(new K({
			x1: t,
			y1: n,
			x2: r,
			y2: i
		})), this.updateWalls();
	}
	addWallsFromSurfaceEdges(e) {
		e.updateMatrixWorld(!0);
		let t = e.edges;
		t.updateMatrixWorld(!0);
		let n = t.geometry.getAttribute("position"), r = new D(), i = new D();
		for (let e = 0; e < n.count; e += 2) {
			r.fromBufferAttribute(n, e).applyMatrix4(t.matrixWorld), i.fromBufferAttribute(n, e + 1).applyMatrix4(t.matrixWorld);
			let a = N(r, this.slice), o = N(i, this.slice), s = q(Math.floor((a.u - this.offsetX) / this.cellSize), 0, this.nx - 1), c = q(Math.floor((a.v - this.offsetY) / this.cellSize), 0, this.ny - 1), l = q(Math.floor((o.u - this.offsetX) / this.cellSize), 0, this.nx - 1), u = q(Math.floor((o.v - this.offsetY) / this.cellSize), 0, this.ny - 1);
			this.walls.push(new K({
				x1: s,
				y1: c,
				x2: l,
				y2: u
			}));
		}
		this.updateWalls();
	}
	fillSourceTexture() {
		let e = this.sourcemap.image.data;
		if (!e) return;
		let t = 0;
		for (let n = 0; n < this.ny; n++) for (let n = 0; n < this.nx; n++) e[t + 0] = R, e[t + 1] = 0, e[t + 2] = 1, e[t + 3] = 1, t += 4;
	}
	toggleWall(e) {
		this.walls[e] && (this.walls[e].enabled = !this.walls[e].enabled, this.updateWalls());
	}
	updateWalls() {
		let e = this.sourcemap.image.data;
		if (e) {
			for (let t = 0; t < this.walls.length; t++) {
				if (this.walls[t].shouldClearPreviousCells) {
					for (let n = 0; n < this.walls[t].previousCells.length; n++) {
						let r = 4 * (this.walls[t].previousCells[n][1] * this.nx + this.walls[t].previousCells[n][0]);
						e[r + 2] = 1;
					}
					this.walls[t].shouldClearPreviousCells = !1;
				}
				if (this.walls[t].enabled) for (let n = 0; n < this.walls[t].cells.length; n++) {
					let r = 4 * (this.walls[t].cells[n][1] * this.nx + this.walls[t].cells[n][0]);
					e[r + 2] = 0;
				}
				else for (let n = 0; n < this.walls[t].cells.length; n++) {
					let r = 4 * (this.walls[t].cells[n][1] * this.nx + this.walls[t].cells[n][0]);
					e[r + 2] = 1;
				}
			}
			this.sourcemap.needsUpdate = !0;
		}
	}
	updateSourceTexture() {
		let e = this.sourcemap.image.data;
		if (e) {
			for (let t = 0; t < this.sourceKeys.length; t++) {
				let n = this.sources[this.sourceKeys[t]];
				n.updateWave(this.time, this.frame, this.dt);
				let r = this.planeCellIndex(n.position);
				if (r != null && U(e, r, V(n.value)), n.shouldClearPreviousPosition) {
					let t = this.planeCellIndex({
						x: n.previousX,
						y: n.previousY,
						z: n.previousZ
					});
					t != null && U(e, t, H()), n.shouldClearPreviousPosition = !1, n.updatePreviousPosition();
				}
			}
			this.sourcemap.needsUpdate = !0;
		}
	}
	fillTexture(e) {
		let t = e.image.data;
		if (!t) return;
		let n = 0;
		for (let e = 0; e < this.ny; e++) for (let e = 0; e < this.nx; e++) t[n + 0] = R, t[n + 1] = 0, t[n + 2] = 1, t[n + 3] = 1, n += 4;
	}
	readReceiverLevels() {
		let e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
		this.readLevelShader.uniforms.levelTexture.value = e.texture;
		for (let e = 0; e < this.receiverKeys.length; e++) {
			let t = this.receiverKeys[e];
			if (this.receivers[t]) {
				let e = N(this.receivers[t].position, this.slice), n = (e.u - this.offsetX) / this.width, r = (e.v - this.offsetY) / this.height;
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
			if (this.updateSourceTexture(), this.heightmapVariable.material.uniforms.sourcemap.value = this.sourcemap, this.gpuCompute.compute(), this.recording) {
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
export { X as FDTD_2D, X as default };

//# sourceMappingURL=2d-fdtd-CQC57FF5.mjs.map