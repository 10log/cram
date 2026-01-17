var B = Object.defineProperty;
var N = (g, o, e) => o in g ? B(g, o, { enumerable: !0, configurable: !0, writable: !0, value: e }) : g[o] = e;
var s = (g, o, e) => N(g, typeof o != "symbol" ? o + "" : o, e);
import { M as X, k as j, r as y, N as Y, O as z, o as G, Q as O, U as M } from "./index-KmIKz-wL.mjs";
import { NearestFilter as w, ShaderMaterial as A, WebGLRenderTarget as k, FloatType as P, RGBAFormat as R, DataTexture as q, ClampToEdgeWrapping as D, PlaneGeometry as W, MeshBasicMaterial as Q, MeshLambertMaterial as J, DoubleSide as F, Mesh as K, UniformsUtils as Z, UniformsLib as _, Color as E, Vector2 as H, UnsignedByteType as $ } from "three";
import { S as ee } from "./solver-z5p8Cank.mjs";
class te {
  /**
   * Constructs a new GPU computation renderer.
   *
   * @param {number} sizeX - Computation problem size is always 2d: sizeX * sizeY elements.
  	 * @param {number} sizeY - Computation problem size is always 2d: sizeX * sizeY elements.
  	 * @param {WebGLRenderer} renderer - The renderer.
   */
  constructor(o, e, t) {
    this.variables = [], this.currentTextureIndex = 0;
    let r = P;
    const n = {
      passThruTexture: { value: null }
    }, l = u(v(), n), c = new X(l);
    this.setDataType = function(a) {
      return r = a, this;
    }, this.addVariable = function(a, i, h) {
      const m = this.createShaderMaterial(i), d = {
        name: a,
        initialValueTexture: h,
        material: m,
        dependencies: null,
        renderTargets: [],
        wrapS: null,
        wrapT: null,
        minFilter: w,
        magFilter: w
      };
      return this.variables.push(d), d;
    }, this.setVariableDependencies = function(a, i) {
      a.dependencies = i;
    }, this.init = function() {
      if (t.capabilities.maxVertexTextures === 0)
        return "No support for vertex shader textures.";
      for (let a = 0; a < this.variables.length; a++) {
        const i = this.variables[a];
        i.renderTargets[0] = this.createRenderTarget(o, e, i.wrapS, i.wrapT, i.minFilter, i.magFilter), i.renderTargets[1] = this.createRenderTarget(o, e, i.wrapS, i.wrapT, i.minFilter, i.magFilter), this.renderTexture(i.initialValueTexture, i.renderTargets[0]), this.renderTexture(i.initialValueTexture, i.renderTargets[1]);
        const h = i.material, m = h.uniforms;
        if (i.dependencies !== null)
          for (let d = 0; d < i.dependencies.length; d++) {
            const x = i.dependencies[d];
            if (x.name !== i.name) {
              let T = !1;
              for (let S = 0; S < this.variables.length; S++)
                if (x.name === this.variables[S].name) {
                  T = !0;
                  break;
                }
              if (!T)
                return "Variable dependency not found. Variable=" + i.name + ", dependency=" + x.name;
            }
            m[x.name] = { value: null }, h.fragmentShader = `
uniform sampler2D ` + x.name + `;
` + h.fragmentShader;
          }
      }
      return this.currentTextureIndex = 0, null;
    }, this.compute = function() {
      const a = this.currentTextureIndex, i = this.currentTextureIndex === 0 ? 1 : 0;
      for (let h = 0, m = this.variables.length; h < m; h++) {
        const d = this.variables[h];
        if (d.dependencies !== null) {
          const x = d.material.uniforms;
          for (let T = 0, S = d.dependencies.length; T < S; T++) {
            const L = d.dependencies[T];
            x[L.name].value = L.renderTargets[a].texture;
          }
        }
        this.doRenderTarget(d.material, d.renderTargets[i]);
      }
      this.currentTextureIndex = i;
    }, this.getCurrentRenderTarget = function(a) {
      return a.renderTargets[this.currentTextureIndex];
    }, this.getAlternateRenderTarget = function(a) {
      return a.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
    }, this.dispose = function() {
      c.dispose();
      const a = this.variables;
      for (let i = 0; i < a.length; i++) {
        const h = a[i];
        h.initialValueTexture && h.initialValueTexture.dispose();
        const m = h.renderTargets;
        for (let d = 0; d < m.length; d++)
          m[d].dispose();
      }
    };
    function f(a) {
      a.defines.resolution = "vec2( " + o.toFixed(1) + ", " + e.toFixed(1) + " )";
    }
    this.addResolutionDefine = f;
    function u(a, i) {
      i = i || {};
      const h = new A({
        name: "GPUComputationShader",
        uniforms: i,
        vertexShader: p(),
        fragmentShader: a
      });
      return f(h), h;
    }
    this.createShaderMaterial = u, this.createRenderTarget = function(a, i, h, m, d, x) {
      return a = a || o, i = i || e, h = h || D, m = m || D, d = d || w, x = x || w, new k(a, i, {
        wrapS: h,
        wrapT: m,
        minFilter: d,
        magFilter: x,
        format: R,
        type: r,
        depthBuffer: !1
      });
    }, this.createTexture = function() {
      const a = new Float32Array(o * e * 4), i = new q(a, o, e, R, P);
      return i.needsUpdate = !0, i;
    }, this.renderTexture = function(a, i) {
      n.passThruTexture.value = a, this.doRenderTarget(l, i), n.passThruTexture.value = null;
    }, this.doRenderTarget = function(a, i) {
      const h = t.getRenderTarget(), m = t.xr.enabled, d = t.shadowMap.autoUpdate;
      t.xr.enabled = !1, t.shadowMap.autoUpdate = !1, c.material = a, t.setRenderTarget(i), c.render(t), c.material = l, t.xr.enabled = m, t.shadowMap.autoUpdate = d, t.setRenderTarget(h);
    };
    function p() {
      return `void main()	{

	gl_Position = vec4( position, 1.0 );

}
`;
    }
    function v() {
      return `uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`;
    }
  }
}
const re = `#include <common>\r
\r
uniform vec2 mousePos;\r
uniform float mouseSize;\r
uniform float damping;\r
uniform float heightCompensation;\r
uniform sampler2D sourcemap;\r
\r
void main()	{\r
\r
  vec2 cellSize = 1.0 / resolution.xy;\r
\r
  vec2 uv = gl_FragCoord.xy * cellSize;\r
    \r
  float newvel = 0.;\r
  float newpos = 0.;\r
\r
\r
  vec4 heightmapValue = texture2D( heightmap, uv );\r
  vec4 sourcemapValue = texture2D( sourcemap, uv);\r
  \r
\r
\r
  if(sourcemapValue.b > 0.0){\r
    float pos = heightmapValue.r;\r
    float vel = heightmapValue.g;\r
    \r
    \r
    \r
    vec2 ud_offset = vec2( 0.0, cellSize.y );\r
    vec2 rl_offset = vec2( cellSize.x, 0.0 );\r
    \r
    vec4 u = texture2D( heightmap, uv + ud_offset );    \r
    vec4 d = texture2D( heightmap, uv - ud_offset );\r
    vec4 r = texture2D( heightmap, uv + rl_offset );\r
    vec4 l = texture2D( heightmap, uv - rl_offset );\r
    \r
    float u_wall = texture2D( sourcemap, uv + ud_offset ).b;\r
    float d_wall = texture2D( sourcemap, uv - ud_offset ).b;\r
    float r_wall = texture2D( sourcemap, uv + rl_offset ).b;\r
    float l_wall = texture2D( sourcemap, uv - rl_offset ).b;\r
    \r
    \r
    // float u_pos = u_wall == 0 ? d.r : u.r;\r
    // float d_pos = d_wall == 0 ? u.r : d.r;\r
    // float r_pos = r_wall == 0 ? l.r : r.r;\r
    // float l_pos = l_wall == 0 ? r.r : l.r;\r
\r
    float u_pos =  u.r;\r
    float d_pos =  d.r;\r
    float r_pos =  r.r;\r
    float l_pos =  l.r;\r
    \r
    if(u_wall == 0.0){\r
      u_pos = texture2D( heightmap, uv - ud_offset ).r;\r
    }\r
    if(d_wall == 0.0){\r
      d_pos = texture2D( heightmap, uv + ud_offset ).r;\r
    }\r
    if(r_wall == 0.0){\r
      r_pos = texture2D( heightmap, uv - rl_offset ).r;\r
    }\r
    if(l_wall == 0.0){\r
      l_pos = texture2D( heightmap, uv + rl_offset ).r;\r
    }\r
\r
    float mid = 0.25*(u_pos+d_pos+r_pos+l_pos);\r
  \r
    float med = heightmapValue.b * 1.5;\r
    newvel = med*(mid-pos)+vel*damping;\r
    newpos = pos+newvel;\r
    \r
    if(sourcemapValue.a == 0.0){  \r
      newvel = sourcemapValue.g;\r
      newpos = sourcemapValue.r;\r
    }    \r
  }\r
  else {\r
    newvel = 0.0;\r
    newpos = 127.5;\r
  }\r
  \r
  \r
  gl_FragColor = vec4(newpos, newvel, heightmapValue.b, sourcemapValue.b);\r
\r
\r
}\r
`, ie = `uniform vec2 point1;\r
uniform float cell_size;\r
uniform float inv_cell_size;\r
\r
uniform sampler2D levelTexture;\r
\r
// Integer to float conversion from https://stackoverflow.com/questions/17981163/webgl-read-pixels-from-floating-point-render-target\r
\r
float shift_right( float v, float amt ) {\r
\r
	v = floor( v ) + 0.5;\r
	return floor( v / exp2( amt ) );\r
\r
}\r
\r
float shift_left( float v, float amt ) {\r
\r
	return floor( v * exp2( amt ) + 0.5 );\r
\r
}\r
\r
float mask_last( float v, float bits ) {\r
\r
	return mod( v, shift_left( 1.0, bits ) );\r
\r
}\r
\r
float extract_bits( float num, float from, float to ) {\r
\r
	from = floor( from + 0.5 ); to = floor( to + 0.5 );\r
	return mask_last( shift_right( num, from ), to - from );\r
\r
}\r
\r
vec4 encode_float( float val ) {\r
	if ( val == 0.0 ) return vec4( 0, 0, 0, 0 );\r
	float sign = val > 0.0 ? 0.0 : 1.0;\r
	val = abs( val );\r
	float exponent = floor( log2( val ) );\r
	float biased_exponent = exponent + 127.0;\r
	float fraction = ( ( val / exp2( exponent ) ) - 1.0 ) * 8388608.0;\r
	float t = biased_exponent / 2.0;\r
	float last_bit_of_biased_exponent = fract( t ) * 2.0;\r
	float remaining_bits_of_biased_exponent = floor( t );\r
	float byte4 = extract_bits( fraction, 0.0, 8.0 ) / 255.0;\r
	float byte3 = extract_bits( fraction, 8.0, 16.0 ) / 255.0;\r
	float byte2 = ( last_bit_of_biased_exponent * 128.0 + extract_bits( fraction, 16.0, 23.0 ) ) / 255.0;\r
	float byte1 = ( sign * 128.0 + remaining_bits_of_biased_exponent ) / 255.0;\r
	return vec4( byte4, byte3, byte2, byte1 );\r
}\r
\r
void main()	{\r
\r
	vec2 cellSize = vec2(cell_size);\r
\r
	float waterLevel = texture2D( levelTexture, point1 ).x;\r
\r
	vec2 normal = vec2(\r
		( texture2D( levelTexture, point1 + vec2( - cellSize.x, 0 ) ).x - texture2D( levelTexture, point1 + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\r
		( texture2D( levelTexture, point1 + vec2( 0, - cellSize.y ) ).x - texture2D( levelTexture, point1 + vec2( 0, cellSize.y ) ).x ) * inv_cell_size );\r
\r
	if ( gl_FragCoord.x < 1.5 ) {\r
\r
		gl_FragColor = encode_float( waterLevel );\r
\r
	} else if ( gl_FragCoord.x < 2.5 ) {\r
\r
		gl_FragColor = encode_float( normal.x );\r
\r
	} else if ( gl_FragCoord.x < 3.5 ) {\r
\r
		gl_FragColor = encode_float( normal.y );\r
\r
	} else {\r
\r
		gl_FragColor = encode_float( 0.0 );\r
\r
	}\r
\r
}`, ne = `uniform sampler2D clearTexture;\r
\r
void main()	{\r
\r
	vec2 cellSize = 1.0 / resolution.xy;\r
\r
	vec2 uv = gl_FragCoord.xy * cellSize;\r
\r
\r
	vec4 textureValue = texture2D( clearTexture, uv );\r
\r
	textureValue.r = 127.5;\r
	textureValue.g = 0.0;\r
\r
	gl_FragColor = textureValue;\r
\r
}\r
`, se = `uniform sampler2D heightmap;\r
uniform float inv_cell_size;\r
uniform float cell_size;\r
varying float vHeight;\r
varying float vWall;\r
#define PHONG\r
\r
varying vec3 vViewPosition;\r
\r
#ifndef FLAT_SHADED\r
\r
	varying vec3 vNormal;\r
\r
#endif\r
\r
#include <common>\r
#include <uv_pars_vertex>\r
#include <uv2_pars_vertex>\r
#include <displacementmap_pars_vertex>\r
#include <envmap_pars_vertex>\r
#include <color_pars_vertex>\r
#include <morphtarget_pars_vertex>\r
#include <skinning_pars_vertex>\r
#include <shadowmap_pars_vertex>\r
#include <logdepthbuf_pars_vertex>\r
#include <clipping_planes_pars_vertex>\r
\r
void main() {\r
\r
	vec2 cellSize = vec2( cell_size );\r
\r
	#include <uv_vertex>\r
	#include <uv2_vertex>\r
	#include <color_vertex>\r
\r
	// # include <beginnormal_vertex>\r
	// Compute normal from heightmap\r
	vec3 objectNormal = vec3(\r
		( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,\r
		( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * inv_cell_size,\r
		1.0 );\r
	//<beginnormal_vertex>\r
\r
	#include <morphnormal_vertex>\r
	#include <skinbase_vertex>\r
	#include <skinnormal_vertex>\r
	#include <defaultnormal_vertex>\r
\r
#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\r
\r
	vNormal = normalize( transformedNormal );\r
\r
#endif\r
\r
	//# include <begin_vertex>\r
	vec4 heightmapValue = texture2D( heightmap, uv );\r
	float heightValue = heightmapValue.x - 127.5;\r
	vHeight = heightValue;\r
	vWall = heightmapValue.a;\r
	\r
	vec3 transformed = vec3( position.x, position.y, heightValue );\r
	//<begin_vertex>\r
\r
	#include <morphtarget_vertex>\r
	#include <skinning_vertex>\r
	#include <displacementmap_vertex>\r
	#include <project_vertex>\r
	#include <logdepthbuf_vertex>\r
	#include <clipping_planes_vertex>\r
\r
	vViewPosition = - mvPosition.xyz;\r
\r
	#include <worldpos_vertex>\r
	#include <envmap_vertex>\r
	#include <shadowmap_vertex>\r
\r
}\r
`, ae = `#define PHONG\r
\r
varying float vHeight;\r
varying float vWall;\r
\r
uniform vec3 diffuse;\r
uniform vec3 emissive;\r
uniform vec3 specular;\r
uniform float shininess;\r
uniform float opacity;\r
uniform float colorBrightness;\r
\r
#include <common>\r
#include <packing>\r
#include <dithering_pars_fragment>\r
#include <color_pars_fragment>\r
#include <uv_pars_fragment>\r
#include <uv2_pars_fragment>\r
#include <map_pars_fragment>\r
#include <alphamap_pars_fragment>\r
#include <aomap_pars_fragment>\r
#include <lightmap_pars_fragment>\r
#include <emissivemap_pars_fragment>\r
#include <envmap_common_pars_fragment>\r
#include <envmap_pars_fragment>\r
#include <gradientmap_pars_fragment>\r
#include <fog_pars_fragment>\r
#include <bsdfs>\r
#include <lights_pars_begin>\r
#include <lights_phong_pars_fragment>\r
#include <shadowmap_pars_fragment>\r
#include <bumpmap_pars_fragment>\r
#include <normalmap_pars_fragment>\r
#include <specularmap_pars_fragment>\r
#include <logdepthbuf_pars_fragment>\r
#include <clipping_planes_pars_fragment>\r
\r
void main() {\r
\r
	#include <clipping_planes_fragment>\r
\r
	vec4 diffuseColor = vec4( diffuse, opacity );\r
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\r
	vec3 totalEmissiveRadiance = emissive;\r
\r
	#include <logdepthbuf_fragment>\r
	#include <map_fragment>\r
	#include <color_fragment>\r
	#include <alphamap_fragment>\r
	#include <alphatest_fragment>\r
	#include <specularmap_fragment>\r
	#include <normal_fragment_begin>\r
	#include <normal_fragment_maps>\r
	#include <emissivemap_fragment>\r
\r
	// accumulation\r
	#include <lights_phong_fragment>\r
	#include <lights_fragment_begin>\r
	#include <lights_fragment_maps>\r
	#include <lights_fragment_end>\r
\r
	// modulation\r
	#include <aomap_fragment>\r
\r
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\r
\r
	#include <envmap_fragment>\r
\r
	vec3 col = vec3(0.0,0.0,0.0);\r
	if(vHeight > 0.0){\r
		col.r = vHeight/127.5*colorBrightness;\r
	}\r
	else if(vHeight <= 0.0){\r
		col.g = -vHeight/127.5*colorBrightness;\r
	}\r
\r
	gl_FragColor = vec4( col, 1.0 );\r
\r
	#include <tonemapping_fragment>\r
	#include <encodings_fragment>\r
	#include <fog_fragment>\r
	#include <premultiplied_alpha_fragment>\r
	#include <dithering_fragment>\r
\r
}`, C = {
  heightMapFrag: re,
  readLevelFrag: ie,
  clearFrag: ne,
  waterVert: se,
  waterFrag: ae
};
function I(g, o, e, t) {
  const r = [];
  let n, l, c, f, u, p, v, a, i, h, m;
  if (c = e - g, f = t - o, u = Math.abs(c), p = Math.abs(f), v = 2 * p - u, a = 2 * u - p, p <= u)
    for (c >= 0 ? (n = g, l = o, i = e) : (n = e, l = t, i = g), r.push([n, l]), m = 0; n < i; m++)
      n = n + 1, v < 0 ? v = v + 2 * p : (c < 0 && f < 0 || c > 0 && f > 0 ? l = l + 1 : l = l - 1, v = v + 2 * (p - u)), r.push([n, l]);
  else
    for (f >= 0 ? (n = g, l = o, h = t) : (n = e, l = t, h = o), r.push([n, l]), m = 0; l < h; m++)
      l = l + 1, a <= 0 ? a = a + 2 * u : (c < 0 && f < 0 || c > 0 && f > 0 ? n = n + 1 : n = n - 1, a = a + 2 * (u - p)), r.push([n, l]);
  return r;
}
class U {
  constructor(o) {
    s(this, "enabled");
    s(this, "x1");
    s(this, "y1");
    s(this, "x2");
    s(this, "y2");
    s(this, "cells");
    s(this, "previousCells");
    s(this, "shouldClearPreviousCells");
    this.x1 = o.x1, this.y1 = o.y1, this.x2 = o.x2, this.y2 = o.y2, this.cells = I(this.x1, this.y1, this.x2, this.y2), this.previousCells = this.cells, this.shouldClearPreviousCells = !1, this.enabled = !0;
  }
  move(o) {
    this.previousCells = this.cells, this.x1 = o.x1, this.y1 = o.y1, this.x2 = o.x2, this.y2 = o.y2, this.cells = I(this.x1, this.y1, this.x2, this.y2), this.shouldClearPreviousCells = !0;
  }
}
function b(g, o, e) {
  return g < o ? o : g > e ? e : g;
}
const le = 256, V = {
  width: 10,
  height: 10,
  offsetX: 0,
  offsetY: 0
};
class de extends ee {
  constructor(e) {
    super(e);
    s(this, "gpuCompute");
    /**
     * number of x cells
     */
    s(this, "nx");
    /**
     * number of y cells
     */
    s(this, "ny");
    s(this, "offsetX");
    s(this, "offsetY");
    s(this, "uniforms");
    s(this, "mesh");
    s(this, "editMesh");
    s(this, "heightmapVariable");
    s(this, "sourcemapVariable");
    s(this, "sourcemap");
    s(this, "readLevelShader");
    s(this, "readLevelImage");
    s(this, "readLevelRenderTarget");
    s(this, "sources");
    s(this, "sourceKeys");
    s(this, "receivers");
    s(this, "receiverKeys");
    s(this, "walls");
    /**
     * simulation in seconds
     */
    s(this, "time");
    /**
     * simulation time step in seconds
     */
    s(this, "dt");
    s(this, "width");
    s(this, "height");
    s(this, "cellSize");
    s(this, "numPasses");
    s(this, "waveSpeed");
    s(this, "recording");
    s(this, "clearShader");
    s(this, "frame");
    s(this, "messageHandlers");
    s(this, "eventListeners");
    this.kind = "fdtd-2d", this.running = !1, this.time = 0, this.frame = 0, this.numPasses = 1, this.waveSpeed = 340.29, this.recording = !1;
    const t = [...j.getState().selectedObjects.values()].filter((u) => u.kind === "surface");
    let r = null;
    if (e = e || {}, t.length > 0) {
      r = t.length > 1 ? t[0].mergeSurfaces(t) : t[0], r.mesh.geometry.computeBoundingBox();
      const u = r.mesh.geometry.boundingBox;
      u && (e.width = u.max.x - u.min.x, e.height = u.max.y - u.min.y, e.offsetX = u.min.x, e.offsetY = u.min.y);
    }
    const n = e && e.width || V.width, l = e && e.height || V.height;
    this.offsetX = e && e.offsetX || V.offsetX, this.offsetY = e && e.offsetY || V.offsetY, this.cellSize = e && e.cellSize || Math.max(n, l) / le, this.nx = Math.ceil(n / this.cellSize), this.ny = Math.ceil(l / this.cellSize), this.width = this.nx * this.cellSize, this.height = this.ny * this.cellSize, this.dt = this.cellSize / this.waveSpeed, this.sources = {}, this.sourceKeys = [], this.receivers = {}, this.receiverKeys = [], this.walls = [], this.messageHandlers = [], this.eventListeners = [];
    const c = new W(this.width, this.height, 1, 1);
    c.translate(this.width / 2, this.height / 2, 0), c.translate(this.offsetX, this.offsetY, 0);
    const f = [
      new Q({ wireframe: !0, side: F, color: 7368816 }),
      new J({ transparent: !0, opacity: 0.35, side: F, color: 7368816 })
    ];
    this.editMesh = new K(c, f[0]), this.editMesh.name = "fdtd-2d-edit-mesh", this.editMesh.visible = !1, y.fdtdItems.add(this.editMesh), this.fillTexture = this.fillTexture.bind(this), this.init = this.init.bind(this), this.render = this.render.bind(this), this.updateWalls = this.updateWalls.bind(this), this.updateSourceTexture = this.updateSourceTexture.bind(this), this.addWallsFromSurfaceEdges = this.addWallsFromSurfaceEdges.bind(this), this.setWireframeVisible = this.setWireframeVisible.bind(this), this.getWireframeVisible = this.getWireframeVisible.bind(this), this.toggleWall = this.toggleWall.bind(this), this.clear = this.clear.bind(this), this.init(), this.onModeChange(Y("GET_EDITOR_MODE")[0]), r && this.addWallsFromSurfaceEdges(r);
  }
  onModeChange(e) {
    switch (e) {
      case z.OBJECT:
        this.editMesh.visible = !1, this.mesh.visible = !0;
        break;
      case z.SKETCH:
        this.editMesh.visible = !1, this.mesh.visible = !1;
        break;
      case z.EDIT:
        this.editMesh.visible = !0, this.mesh.visible = !1;
        break;
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
    const e = new W(this.width, this.height, this.nx - 1, this.ny - 1);
    e.name = "fdtd-2d-plane-geometry", e.translate(this.width / 2, this.height / 2, 0), e.translate(this.offsetX, this.offsetY, 0);
    const t = { value: null }, r = Z.merge([
      _.common,
      _.specularmap,
      _.envmap,
      _.aomap,
      _.lightmap,
      _.emissivemap,
      _.bumpmap,
      _.normalmap,
      _.displacementmap,
      _.gradientmap,
      _.fog,
      _.lights,
      {
        emissive: { value: new E(0) },
        specular: { value: new E(1118481) },
        shininess: { value: 30 },
        colorBrightness: { value: 10 },
        cell_size: { value: this.cellSize },
        inv_cell_size: { value: 1 / this.cellSize },
        heightmap: t
      }
    ]), n = C.waterVert, l = C.waterFrag, c = F, f = new A({
      uniforms: r,
      vertexShader: n,
      fragmentShader: l,
      side: c,
      name: "fdtd-2d-material"
    });
    f.lights = !0, this.uniforms = f.uniforms, this.mesh = new K(e, f), this.mesh.matrixAutoUpdate = !1, this.mesh.updateMatrix(), this.mesh.material.wireframe = !1, this.mesh.matrixAutoUpdate = !0, this.mesh.scale.setZ(0.01), y.fdtdItems.add(this.mesh), this.gpuCompute = new te(this.nx, this.ny, y.renderer);
    let u = this.gpuCompute.createTexture();
    this.sourcemap = this.gpuCompute.createTexture(), this.fillSourceTexture(), this.updateSourceTexture(), this.fillTexture(u), this.heightmapVariable = this.gpuCompute.addVariable("heightmap", C.heightMapFrag, u), this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]), this.heightmapVariable.material.uniforms.sourcemap = { value: this.sourcemap }, this.heightmapVariable.material.uniforms.mousePos = { value: new H(5, 5) }, this.heightmapVariable.material.uniforms.mouseSize = { value: 0 }, this.heightmapVariable.material.uniforms.damping = { value: 0.9999 }, this.heightmapVariable.material.uniforms.heightCompensation = { value: 0 }, this.heightmapVariable.material.uniforms.cell_size = { value: this.cellSize }, this.heightmapVariable.material.uniforms.inv_cell_size = { value: 1 / this.cellSize };
    const p = this.gpuCompute.init();
    p !== null && console.error(p), this.clearShader = this.gpuCompute.createShaderMaterial(C.clearFrag, { clearTexture: { value: null } }), this.readLevelShader = this.gpuCompute.createShaderMaterial(C.readLevelFrag, {
      point1: { value: new H() },
      levelTexture: { value: null },
      cell_size: { value: this.cellSize },
      inv_cell_size: { value: 1 / this.cellSize }
    }), this.readLevelImage = new Uint8Array(16), this.readLevelRenderTarget = new k(4, 1, {
      wrapS: D,
      wrapT: D,
      minFilter: w,
      magFilter: w,
      format: R,
      type: $,
      stencilBuffer: !1,
      depthBuffer: !1
    }), this.eventListeners.push(G("RENDERER_UPDATED", () => {
      this.running && this.render();
    })), this.render(), this.clear();
  }
  editSize() {
  }
  dispose() {
    this.eventListeners.forEach((e) => e());
    for (let e = 0; e < this.messageHandlers.length; e++)
      O(this.messageHandlers[e][0], this.messageHandlers[e][1]);
    this.mesh && y.fdtdItems.remove(this.mesh), this.messageHandlers = [];
  }
  run() {
    this.running = !0, y.fdtd2drunning = !0;
  }
  stop() {
    this.running = !1, y.fdtd2drunning = !1;
  }
  // save() {
  //   return pickProps(["name", "uuid", "width", "height", "offsetX", "offsetY", "cellSize"], this);
  // }
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
    const t = b(Math.floor((e.x1 - this.offsetX) / this.cellSize), 0, this.nx - 1), r = b(Math.floor((e.y1 - this.offsetY) / this.cellSize), 0, this.nx - 1), n = b(Math.floor((e.x2 - this.offsetX) / this.cellSize), 0, this.nx - 1), l = b(Math.floor((e.y2 - this.offsetY) / this.cellSize), 0, this.nx - 1);
    this.walls.push(new U({ x1: t, y1: r, x2: n, y2: l })), this.updateWalls();
  }
  addWallsFromSurfaceEdges(e) {
    const t = e.edges.geometry.getAttribute("position");
    for (let r = 0; r < t.count; r += 2) {
      let n = b(Math.floor((t.getX(r) - this.offsetX) / this.cellSize), 0, this.nx - 1), l = b(Math.floor((t.getY(r) - this.offsetY) / this.cellSize), 0, this.ny - 1), c = b(Math.floor((t.getX(r + 1) - this.offsetX) / this.cellSize), 0, this.nx - 1), f = b(Math.floor((t.getY(r + 1) - this.offsetY) / this.cellSize), 0, this.ny - 1);
      this.walls.push(new U({ x1: n, y1: l, x2: c, y2: f }));
    }
    this.updateWalls();
  }
  fillSourceTexture() {
    const e = this.sourcemap.image.data;
    if (!e) return;
    let t = 0;
    for (let r = 0; r < this.ny; r++)
      for (let n = 0; n < this.nx; n++)
        e[t + 0] = 0, e[t + 1] = 0, e[t + 2] = 1, e[t + 3] = 1, t += 4;
  }
  toggleWall(e) {
    this.walls[e] && (this.walls[e].enabled = !this.walls[e].enabled, this.updateWalls());
  }
  updateWalls() {
    const e = this.sourcemap.image.data;
    if (e) {
      for (let t = 0; t < this.walls.length; t++) {
        if (this.walls[t].shouldClearPreviousCells) {
          for (let r = 0; r < this.walls[t].previousCells.length; r++) {
            const n = 4 * (this.walls[t].previousCells[r][1] * this.nx + this.walls[t].previousCells[r][0]);
            e[n + 2] = 1;
          }
          this.walls[t].shouldClearPreviousCells = !1;
        }
        if (this.walls[t].enabled)
          for (let r = 0; r < this.walls[t].cells.length; r++) {
            const n = 4 * (this.walls[t].cells[r][1] * this.nx + this.walls[t].cells[r][0]);
            e[n + 2] = 0;
          }
        else
          for (let r = 0; r < this.walls[t].cells.length; r++) {
            const n = 4 * (this.walls[t].cells[r][1] * this.nx + this.walls[t].cells[r][0]);
            e[n + 2] = 1;
          }
      }
      this.sourcemap.needsUpdate = !0;
    }
  }
  updateSourceTexture() {
    const e = this.sourcemap.image.data;
    if (e) {
      for (let t = 0; t < this.sourceKeys.length; t++) {
        const r = Math.round((this.sources[this.sourceKeys[t]].x - this.offsetX) / this.cellSize), l = 4 * (Math.round((this.sources[this.sourceKeys[t]].y - this.offsetY) / this.cellSize) * this.nx + r);
        this.sources[this.sourceKeys[t]].updateWave(this.time, this.frame, this.dt);
        const c = this.sources[this.sourceKeys[t]].value, f = this.sources[this.sourceKeys[t]].velocity;
        if (e[l + 0] = M(c, -2, 2, 0, 255), e[l + 1] = M(f, -2, 2, 0, 255), e[l + 3] = 0, this.sources[this.sourceKeys[t]].shouldClearPreviousPosition) {
          const u = Math.round((this.sources[this.sourceKeys[t]].previousX - this.offsetX) / this.cellSize), v = 4 * (Math.round((this.sources[this.sourceKeys[t]].previousY - this.offsetY) / this.cellSize) * this.nx + u);
          e[v + 0] = 0, e[v + 1] = 0, e[v + 3] = 1, this.sources[this.sourceKeys[t]].shouldClearPreviousPosition = !1, this.sources[this.sourceKeys[t]].updatePreviousPosition();
        }
      }
      this.sourcemap.needsUpdate = !0;
    }
  }
  fillTexture(e) {
    const t = e.image.data;
    if (!t) return;
    let r = 0;
    for (let n = 0; n < this.ny; n++)
      for (let l = 0; l < this.nx; l++)
        t[r + 0] = M(0, -2, 2, 0, 255), t[r + 1] = 0, t[r + 2] = 1, t[r + 3] = 1, r += 4;
  }
  readReceiverLevels() {
    const e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
    this.readLevelShader.uniforms.levelTexture.value = e.texture;
    for (let t = 0; t < this.receiverKeys.length; t++) {
      const r = this.receiverKeys[t];
      if (this.receivers[r]) {
        const n = (this.receivers[r].position.x - this.offsetX) / this.width, l = (this.receivers[r].position.y - this.offsetY) / this.height;
        this.readLevelShader.uniforms.point1.value.set(n, l), this.gpuCompute.doRenderTarget(this.readLevelShader, this.readLevelRenderTarget), y.renderer.readRenderTargetPixels(
          this.readLevelRenderTarget,
          0,
          0,
          4,
          1,
          this.readLevelImage
        );
        const f = new Float32Array(this.readLevelImage.buffer)[0];
        this.receivers[r].fdtdSamples.push((f - 127.5) / 127.5);
      }
    }
  }
  clear() {
    const e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable), t = this.gpuCompute.getAlternateRenderTarget(this.heightmapVariable);
    this.clearShader.uniforms.clearTexture.value = e.texture, this.gpuCompute.doRenderTarget(this.clearShader, t), this.clearShader.uniforms.clearTexture.value = t.texture, this.gpuCompute.doRenderTarget(this.clearShader, e), this.time = 0, this.frame = 0;
  }
  render() {
    for (let e = 0; e < this.numPasses; e++) {
      if (this.updateSourceTexture(), this.heightmapVariable.material.uniforms.sourcemap.value = this.sourcemap, this.gpuCompute.compute(), this.recording) {
        for (let t = 0; t < this.sourceKeys.length; t++)
          this.sources[this.sourceKeys[t]].recordSample();
        this.readReceiverLevels();
      }
      this.time += this.dt, this.frame += 1;
    }
    this.uniforms.heightmap.value = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable).texture;
  }
  onParameterConfigFocus() {
  }
  onParameterConfigBlur() {
  }
}
export {
  de as FDTD_2D,
  V as FDTD_2D_Defaults,
  de as default
};
//# sourceMappingURL=index-BbMrFnjS.mjs.map
