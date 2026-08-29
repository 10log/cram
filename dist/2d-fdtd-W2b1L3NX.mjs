import { b as e, x as t, y as n } from "./FileSaver.min-DhK9iPpQ.mjs";
import { p as r, t as i } from "./renderer-Be437Bsu.mjs";
import { g as a } from "./store-CAL1R5s7.mjs";
import { n as o, t as s } from "./editor-modes-Dl6UXVU3.mjs";
import { t as c } from "./solver-DovuaY8D.mjs";
import { ClampToEdgeWrapping as l, Color as u, DataTexture as d, DoubleSide as f, FloatType as p, Mesh as m, MeshBasicMaterial as h, MeshLambertMaterial as g, NearestFilter as _, PlaneGeometry as v, RGBAFormat as y, ShaderMaterial as b, UniformsLib as x, UniformsUtils as S, UnsignedByteType as C, Vector2 as w, WebGLRenderTarget as T } from "three";
//#region node_modules/three/examples/jsm/misc/GPUComputationRenderer.js
var E = class {
	constructor(e, t, n) {
		this.variables = [], this.currentTextureIndex = 0;
		let i = p, a = { passThruTexture: { value: null } }, o = u(m(), a), s = new r(o);
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
				minFilter: _,
				magFilter: _
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
		function u(e, t) {
			t ||= {};
			let n = new b({
				name: "GPUComputationShader",
				uniforms: t,
				vertexShader: f(),
				fragmentShader: e
			});
			return c(n), n;
		}
		this.createShaderMaterial = u, this.createRenderTarget = function(n, r, a, o, s, c) {
			return n ||= e, r ||= t, a ||= l, o ||= l, s ||= _, c ||= _, new T(n, r, {
				wrapS: a,
				wrapT: o,
				minFilter: s,
				magFilter: c,
				format: y,
				type: i,
				depthBuffer: !1
			});
		}, this.createTexture = function() {
			let n = new Float32Array(e * t * 4), r = new d(n, e, t, y, p);
			return r.needsUpdate = !0, r;
		}, this.renderTexture = function(e, t) {
			a.passThruTexture.value = e, this.doRenderTarget(o, t), a.passThruTexture.value = null;
		}, this.doRenderTarget = function(e, t) {
			let r = n.getRenderTarget(), i = n.xr.enabled, a = n.shadowMap.autoUpdate;
			n.xr.enabled = !1, n.shadowMap.autoUpdate = !1, s.material = e, n.setRenderTarget(t), s.render(n), s.material = o, n.xr.enabled = i, n.shadowMap.autoUpdate = a, n.setRenderTarget(r);
		};
		function f() {
			return "void main()	{\n\n	gl_Position = vec4( position, 1.0 );\n\n}\n";
		}
		function m() {
			return "uniform sampler2D passThruTexture;\n\nvoid main() {\n\n	vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n	gl_FragColor = texture2D( passThruTexture, uv );\n\n}\n";
		}
	}
}, D = {
	heightMapFrag: "#include <common>\n\nuniform vec2 mousePos;\nuniform float mouseSize;\nuniform float damping;\nuniform float heightCompensation;\nuniform float courantSq;\nuniform sampler2D sourcemap;\n\nvoid main()	{\n\n  vec2 cellSize = 1.0 / resolution.xy;\n\n  vec2 uv = gl_FragCoord.xy * cellSize;\n    \n  float newvel = 0.;\n  float newpos = 0.;\n\n\n  vec4 heightmapValue = texture2D( heightmap, uv );\n  vec4 sourcemapValue = texture2D( sourcemap, uv);\n  \n\n\n  if(sourcemapValue.b > 0.0){\n    float pos = heightmapValue.r;\n    float vel = heightmapValue.g;\n    \n    \n    \n    vec2 ud_offset = vec2( 0.0, cellSize.y );\n    vec2 rl_offset = vec2( cellSize.x, 0.0 );\n    \n    vec4 u = texture2D( heightmap, uv + ud_offset );    \n    vec4 d = texture2D( heightmap, uv - ud_offset );\n    vec4 r = texture2D( heightmap, uv + rl_offset );\n    vec4 l = texture2D( heightmap, uv - rl_offset );\n    \n    float u_wall = texture2D( sourcemap, uv + ud_offset ).b;\n    float d_wall = texture2D( sourcemap, uv - ud_offset ).b;\n    float r_wall = texture2D( sourcemap, uv + rl_offset ).b;\n    float l_wall = texture2D( sourcemap, uv - rl_offset ).b;\n    \n    \n    // float u_pos = u_wall == 0 ? d.r : u.r;\n    // float d_pos = d_wall == 0 ? u.r : d.r;\n    // float r_pos = r_wall == 0 ? l.r : r.r;\n    // float l_pos = l_wall == 0 ? r.r : l.r;\n\n    float u_pos =  u.r;\n    float d_pos =  d.r;\n    float r_pos =  r.r;\n    float l_pos =  l.r;\n    \n    if(u_wall == 0.0){\n      u_pos = texture2D( heightmap, uv - ud_offset ).r;\n    }\n    if(d_wall == 0.0){\n      d_pos = texture2D( heightmap, uv + ud_offset ).r;\n    }\n    if(r_wall == 0.0){\n      r_pos = texture2D( heightmap, uv - rl_offset ).r;\n    }\n    if(l_wall == 0.0){\n      l_pos = texture2D( heightmap, uv + rl_offset ).r;\n    }\n\n    float mid = 0.25*(u_pos+d_pos+r_pos+l_pos);\n  \n    float med = 4.0 * courantSq;\n    newvel = med*(mid-pos)+vel*damping;\n    newpos = pos+newvel;\n    \n    if(sourcemapValue.a == 0.0){  \n      newvel = sourcemapValue.g;\n      newpos = sourcemapValue.r;\n    }    \n  }\n  else {\n    newvel = 0.0;\n    newpos = 127.5;\n  }\n  \n  \n  gl_FragColor = vec4(newpos, newvel, heightmapValue.b, sourcemapValue.b);\n\n\n}\n",
	readLevelFrag: "uniform vec2 point1;\nuniform float cell_size;\nuniform float inv_cell_size;\n\nuniform sampler2D levelTexture;\n\n// Integer to float conversion from https://stackoverflow.com/questions/17981163/webgl-read-pixels-from-floating-point-render-target\n\nfloat shift_right( float v, float amt ) {\n\n	v = floor( v ) + 0.5;\n	return floor( v / exp2( amt ) );\n\n}\n\nfloat shift_left( float v, float amt ) {\n\n	return floor( v * exp2( amt ) + 0.5 );\n\n}\n\nfloat mask_last( float v, float bits ) {\n\n	return mod( v, shift_left( 1.0, bits ) );\n\n}\n\nfloat extract_bits( float num, float from, float to ) {\n\n	from = floor( from + 0.5 ); to = floor( to + 0.5 );\n	return mask_last( shift_right( num, from ), to - from );\n\n}\n\nvec4 encode_float( float val ) {\n	if ( val == 0.0 ) return vec4( 0, 0, 0, 0 );\n	float sign = val > 0.0 ? 0.0 : 1.0;\n	val = abs( val );\n	float exponent = floor( log2( val ) );\n	float biased_exponent = exponent + 127.0;\n	float fraction = ( ( val / exp2( exponent ) ) - 1.0 ) * 8388608.0;\n	float t = biased_exponent / 2.0;\n	float last_bit_of_biased_exponent = fract( t ) * 2.0;\n	float remaining_bits_of_biased_exponent = floor( t );\n	float byte4 = extract_bits( fraction, 0.0, 8.0 ) / 255.0;\n	float byte3 = extract_bits( fraction, 8.0, 16.0 ) / 255.0;\n	float byte2 = ( last_bit_of_biased_exponent * 128.0 + extract_bits( fraction, 16.0, 23.0 ) ) / 255.0;\n	float byte1 = ( sign * 128.0 + remaining_bits_of_biased_exponent ) / 255.0;\n	return vec4( byte4, byte3, byte2, byte1 );\n}\n\nvoid main()	{\n\n	vec2 cellSize = vec2(cell_size);\n\n	float waterLevel = texture2D( levelTexture, point1 ).x;\n\n	vec2 normal = vec2(\n		( texture2D( levelTexture, point1 + vec2( - cellSize.x, 0 ) ).x - texture2D( levelTexture, point1 + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\n		( texture2D( levelTexture, point1 + vec2( 0, - cellSize.y ) ).x - texture2D( levelTexture, point1 + vec2( 0, cellSize.y ) ).x ) * inv_cell_size );\n\n	if ( gl_FragCoord.x < 1.5 ) {\n\n		gl_FragColor = encode_float( waterLevel );\n\n	} else if ( gl_FragCoord.x < 2.5 ) {\n\n		gl_FragColor = encode_float( normal.x );\n\n	} else if ( gl_FragCoord.x < 3.5 ) {\n\n		gl_FragColor = encode_float( normal.y );\n\n	} else {\n\n		gl_FragColor = encode_float( 0.0 );\n\n	}\n\n}",
	clearFrag: "uniform sampler2D clearTexture;\n\nvoid main()	{\n\n	vec2 cellSize = 1.0 / resolution.xy;\n\n	vec2 uv = gl_FragCoord.xy * cellSize;\n\n\n	vec4 textureValue = texture2D( clearTexture, uv );\n\n	textureValue.r = 127.5;\n	textureValue.g = 0.0;\n\n	gl_FragColor = textureValue;\n\n}\n",
	waterVert: "uniform sampler2D heightmap;\nuniform float inv_cell_size;\nuniform float cell_size;\nvarying float vHeight;\nvarying float vWall;\n#define PHONG\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n	varying vec3 vNormal;\n\n#endif\n\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n	vec2 cellSize = vec2( cell_size );\n\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n\n	// # include <beginnormal_vertex>\n	// Compute normal from heightmap\n	vec3 objectNormal = vec3(\n		( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\n		( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * inv_cell_size,\n		1.0 );\n	//<beginnormal_vertex>\n\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n\n#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\n\n	vNormal = normalize( transformedNormal );\n\n#endif\n\n	//# include <begin_vertex>\n	vec4 heightmapValue = texture2D( heightmap, uv );\n	float heightValue = heightmapValue.x - 127.5;\n	vHeight = heightValue;\n	vWall = heightmapValue.a;\n	\n	vec3 transformed = vec3( position.x, position.y, heightValue );\n	//<begin_vertex>\n\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n\n	vViewPosition = - mvPosition.xyz;\n\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n\n}\n",
	waterFrag: "#define PHONG\n\nvarying float vHeight;\nvarying float vWall;\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\nuniform float colorBrightness;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n	#include <clipping_planes_fragment>\n\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n\n	// accumulation\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n\n	// modulation\n	#include <aomap_fragment>\n\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\n	#include <envmap_fragment>\n\n	vec3 col = vec3(0.0,0.0,0.0);\n	if(vHeight > 0.0){\n		col.r = vHeight/127.5*colorBrightness;\n	}\n	else if(vHeight <= 0.0){\n		col.g = -vHeight/127.5*colorBrightness;\n	}\n\n	gl_FragColor = vec4( col, 1.0 );\n\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n\n}"
};
//#endregion
//#region src/compute/2d-fdtd/timestep.ts
function O(e, t) {
	return e / (t * Math.SQRT2);
}
//#endregion
//#region src/compute/2d-fdtd/rasterize-line.ts
function k(e, t, n, r) {
	let i = [], a, o, s, c, l, u, d, f, p, m, h;
	if (s = n - e, c = r - t, l = Math.abs(s), u = Math.abs(c), d = 2 * u - l, f = 2 * l - u, u <= l) for (s >= 0 ? (a = e, o = t, p = n) : (a = n, o = r, p = e), i.push([a, o]), h = 0; a < p; h++) a += 1, d < 0 ? d += 2 * u : (s < 0 && c < 0 || s > 0 && c > 0 ? o += 1 : --o, d += 2 * (u - l)), i.push([a, o]);
	else for (c >= 0 ? (a = e, o = t, m = r) : (a = n, o = r, m = t), i.push([a, o]), h = 0; o < m; h++) o += 1, f <= 0 ? f += 2 * l : (s < 0 && c < 0 || s > 0 && c > 0 ? a += 1 : --a, f += 2 * (l - u)), i.push([a, o]);
	return i;
}
//#endregion
//#region src/compute/2d-fdtd/fdtd-wall.ts
var A = class {
	enabled;
	x1;
	y1;
	x2;
	y2;
	cells;
	previousCells;
	shouldClearPreviousCells;
	constructor(e) {
		this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = k(this.x1, this.y1, this.x2, this.y2), this.previousCells = this.cells, this.shouldClearPreviousCells = !1, this.enabled = !0;
	}
	move(e) {
		this.previousCells = this.cells, this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = k(this.x1, this.y1, this.x2, this.y2), this.shouldClearPreviousCells = !0;
	}
};
//#endregion
//#region src/common/clamp.ts
function j(e, t, n) {
	return e < t ? t : e > n ? n : e;
}
//#endregion
//#region src/compute/2d-fdtd/index.ts
var M = 256, N = {
	width: 10,
	height: 10,
	cellSize: 10 / M,
	offsetX: 0,
	offsetY: 0
}, P = class extends c {
	gpuCompute;
	nx;
	ny;
	offsetX;
	offsetY;
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
	recording;
	clearShader;
	frame;
	messageHandlers;
	eventListeners;
	constructor(t) {
		super(t), this.kind = "fdtd-2d", this.running = !1, this.time = 0, this.frame = 0, this.numPasses = 1, this.waveSpeed = 340.29, this.recording = !1;
		let n = [...a.getState().selectedObjects.values()].filter((e) => e.kind === "surface"), r = null;
		if (t ||= {}, n.length > 0) {
			r = n.length > 1 ? n[0].mergeSurfaces(n) : n[0], r.mesh.geometry.computeBoundingBox();
			let e = r.mesh.geometry.boundingBox;
			e && (t.width = e.max.x - e.min.x, t.height = e.max.y - e.min.y, t.offsetX = e.min.x, t.offsetY = e.min.y);
		}
		let o = t && t.width || N.width, s = t && t.height || N.height;
		this.offsetX = t && t.offsetX || N.offsetX, this.offsetY = t && t.offsetY || N.offsetY, this.cellSize = t && t.cellSize || Math.max(o, s) / M, this.nx = Math.ceil(o / this.cellSize), this.ny = Math.ceil(s / this.cellSize), this.width = this.nx * this.cellSize, this.height = this.ny * this.cellSize, this.dt = O(this.cellSize, this.waveSpeed), this.sources = {}, this.sourceKeys = [], this.receivers = {}, this.receiverKeys = [], this.walls = [], this.messageHandlers = [], this.eventListeners = [];
		let c = new v(this.width, this.height, 1, 1);
		c.translate(this.width / 2, this.height / 2, 0), c.translate(this.offsetX, this.offsetY, 0);
		let l = [new h({
			wireframe: !0,
			side: f,
			color: 7368816
		}), new g({
			transparent: !0,
			opacity: .35,
			side: f,
			color: 7368816
		})];
		this.editMesh = new m(c, l[0]), this.editMesh.name = "fdtd-2d-edit-mesh", this.editMesh.visible = !1, i.fdtdItems.add(this.editMesh), this.fillTexture = this.fillTexture.bind(this), this.init = this.init.bind(this), this.render = this.render.bind(this), this.updateWalls = this.updateWalls.bind(this), this.updateSourceTexture = this.updateSourceTexture.bind(this), this.addWallsFromSurfaceEdges = this.addWallsFromSurfaceEdges.bind(this), this.setWireframeVisible = this.setWireframeVisible.bind(this), this.getWireframeVisible = this.getWireframeVisible.bind(this), this.toggleWall = this.toggleWall.bind(this), this.clear = this.clear.bind(this), this.init(), this.onModeChange(e("GET_EDITOR_MODE")[0]), r && this.addWallsFromSurfaceEdges(r);
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
		this.dispose();
		let e = new v(this.width, this.height, this.nx - 1, this.ny - 1);
		e.name = "fdtd-2d-plane-geometry", e.translate(this.width / 2, this.height / 2, 0), e.translate(this.offsetX, this.offsetY, 0);
		let t = S.merge([
			x.common,
			x.specularmap,
			x.envmap,
			x.aomap,
			x.lightmap,
			x.emissivemap,
			x.bumpmap,
			x.normalmap,
			x.displacementmap,
			x.gradientmap,
			x.fog,
			x.lights,
			{
				emissive: { value: new u(0) },
				specular: { value: new u(1118481) },
				shininess: { value: 30 },
				colorBrightness: { value: 10 },
				cell_size: { value: this.cellSize },
				inv_cell_size: { value: 1 / this.cellSize },
				heightmap: { value: null }
			}
		]), r = D.waterVert, a = D.waterFrag, o = new b({
			uniforms: t,
			vertexShader: r,
			fragmentShader: a,
			side: f,
			name: "fdtd-2d-material"
		});
		o.lights = !0, this.uniforms = o.uniforms, this.mesh = new m(e, o), this.mesh.matrixAutoUpdate = !1, this.mesh.updateMatrix(), this.mesh.material.wireframe = !1, this.mesh.matrixAutoUpdate = !0, this.mesh.scale.setZ(.01), i.fdtdItems.add(this.mesh), this.gpuCompute = new E(this.nx, this.ny, i.renderer);
		let s = this.gpuCompute.createTexture();
		this.sourcemap = this.gpuCompute.createTexture(), this.fillSourceTexture(), this.updateSourceTexture(), this.fillTexture(s), this.heightmapVariable = this.gpuCompute.addVariable("heightmap", D.heightMapFrag, s), this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]), this.heightmapVariable.material.uniforms.sourcemap = { value: this.sourcemap }, this.heightmapVariable.material.uniforms.mousePos = { value: new w(5, 5) }, this.heightmapVariable.material.uniforms.mouseSize = { value: 0 }, this.heightmapVariable.material.uniforms.damping = { value: .9999 }, this.heightmapVariable.material.uniforms.courantSq = { value: (this.waveSpeed * this.dt / this.cellSize) ** 2 }, this.heightmapVariable.material.uniforms.heightCompensation = { value: 0 }, this.heightmapVariable.material.uniforms.cell_size = { value: this.cellSize }, this.heightmapVariable.material.uniforms.inv_cell_size = { value: 1 / this.cellSize };
		let c = this.gpuCompute.init();
		c !== null && console.error(c), this.clearShader = this.gpuCompute.createShaderMaterial(D.clearFrag, { clearTexture: { value: null } }), this.readLevelShader = this.gpuCompute.createShaderMaterial(D.readLevelFrag, {
			point1: { value: new w() },
			levelTexture: { value: null },
			cell_size: { value: this.cellSize },
			inv_cell_size: { value: 1 / this.cellSize }
		}), this.readLevelImage = /* @__PURE__ */ new Uint8Array(16), this.readLevelRenderTarget = new T(4, 1, {
			wrapS: l,
			wrapT: l,
			minFilter: _,
			magFilter: _,
			format: y,
			type: C,
			stencilBuffer: !1,
			depthBuffer: !1
		}), this.eventListeners.push(n("RENDERER_UPDATED", () => {
			this.running && this.render();
		})), this.render(), this.clear();
	}
	editSize() {}
	dispose() {
		this.eventListeners.forEach((e) => e());
		for (let e = 0; e < this.messageHandlers.length; e++) t(this.messageHandlers[e][0], this.messageHandlers[e][1]);
		this.mesh && i.fdtdItems.remove(this.mesh), this.messageHandlers = [];
	}
	run() {
		this.running = !0, i.fdtd2drunning = !0;
	}
	stop() {
		this.running = !1, i.fdtd2drunning = !1;
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
		this.sources[e] && (delete this.sources[e], this.sourceKeys = this.sourceKeys.filter((t) => t !== e));
	}
	addReceiver(e) {
		this.receiverKeys = [...new Set(this.receiverKeys.concat(e.uuid))], this.receivers[e.uuid] = e;
	}
	removeReceiver(e) {
		this.receivers[e] && (delete this.receivers[e], this.receiverKeys = this.receiverKeys.filter((t) => t !== e));
	}
	addWall(e) {
		let t = j(Math.floor((e.x1 - this.offsetX) / this.cellSize), 0, this.nx - 1), n = j(Math.floor((e.y1 - this.offsetY) / this.cellSize), 0, this.ny - 1), r = j(Math.floor((e.x2 - this.offsetX) / this.cellSize), 0, this.nx - 1), i = j(Math.floor((e.y2 - this.offsetY) / this.cellSize), 0, this.ny - 1);
		this.walls.push(new A({
			x1: t,
			y1: n,
			x2: r,
			y2: i
		})), this.updateWalls();
	}
	addWallsFromSurfaceEdges(e) {
		let t = e.edges.geometry.getAttribute("position");
		for (let e = 0; e < t.count; e += 2) {
			let n = j(Math.floor((t.getX(e) - this.offsetX) / this.cellSize), 0, this.nx - 1), r = j(Math.floor((t.getY(e) - this.offsetY) / this.cellSize), 0, this.ny - 1), i = j(Math.floor((t.getX(e + 1) - this.offsetX) / this.cellSize), 0, this.nx - 1), a = j(Math.floor((t.getY(e + 1) - this.offsetY) / this.cellSize), 0, this.ny - 1);
			this.walls.push(new A({
				x1: n,
				y1: r,
				x2: i,
				y2: a
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
				let n = Math.round((this.sources[this.sourceKeys[t]].x - this.offsetX) / this.cellSize), r = 4 * (Math.round((this.sources[this.sourceKeys[t]].y - this.offsetY) / this.cellSize) * this.nx + n);
				this.sources[this.sourceKeys[t]].updateWave(this.time, this.frame, this.dt);
				let i = this.sources[this.sourceKeys[t]].value, a = this.sources[this.sourceKeys[t]].velocity;
				if (e[r + 0] = o(i, -2, 2, 0, 255), e[r + 1] = o(a, -2, 2, 0, 255), e[r + 3] = 0, this.sources[this.sourceKeys[t]].shouldClearPreviousPosition) {
					let n = Math.round((this.sources[this.sourceKeys[t]].previousX - this.offsetX) / this.cellSize), r = 4 * (Math.round((this.sources[this.sourceKeys[t]].previousY - this.offsetY) / this.cellSize) * this.nx + n);
					e[r + 0] = 0, e[r + 1] = 0, e[r + 3] = 1, this.sources[this.sourceKeys[t]].shouldClearPreviousPosition = !1, this.sources[this.sourceKeys[t]].updatePreviousPosition();
				}
			}
			this.sourcemap.needsUpdate = !0;
		}
	}
	fillTexture(e) {
		let t = e.image.data;
		if (!t) return;
		let n = 0;
		for (let e = 0; e < this.ny; e++) for (let e = 0; e < this.nx; e++) t[n + 0] = o(0, -2, 2, 0, 255), t[n + 1] = 0, t[n + 2] = 1, t[n + 3] = 1, n += 4;
	}
	readReceiverLevels() {
		let e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
		this.readLevelShader.uniforms.levelTexture.value = e.texture;
		for (let e = 0; e < this.receiverKeys.length; e++) {
			let t = this.receiverKeys[e];
			if (this.receivers[t]) {
				let e = (this.receivers[t].position.x - this.offsetX) / this.width, n = (this.receivers[t].position.y - this.offsetY) / this.height;
				this.readLevelShader.uniforms.point1.value.set(e, n), this.gpuCompute.doRenderTarget(this.readLevelShader, this.readLevelRenderTarget), i.renderer.readRenderTargetPixels(this.readLevelRenderTarget, 0, 0, 4, 1, this.readLevelImage);
				let r = new Float32Array(this.readLevelImage.buffer)[0];
				this.receivers[t].fdtdSamples.push((r - 127.5) / 127.5);
			}
		}
	}
	clear() {
		let e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable), t = this.gpuCompute.getAlternateRenderTarget(this.heightmapVariable);
		this.clearShader.uniforms.clearTexture.value = e.texture, this.gpuCompute.doRenderTarget(this.clearShader, t), this.clearShader.uniforms.clearTexture.value = t.texture, this.gpuCompute.doRenderTarget(this.clearShader, e), this.time = 0, this.frame = 0;
	}
	render() {
		for (let e = 0; e < this.numPasses; e++) {
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
export { P as FDTD_2D, P as default };

//# sourceMappingURL=2d-fdtd-W2b1L3NX.mjs.map