import { l as B, u as k, r as T, n as X, E as D, o as j, q as N, x as z } from "./index-Bd2qDRpc.mjs";
import { NearestFilter as y, ShaderMaterial as U, WebGLRenderTarget as A, FloatType as L, RGBAFormat as F, DataTexture as Y, ClampToEdgeWrapping as V, PlaneGeometry as P, MeshBasicMaterial as G, MeshLambertMaterial as O, DoubleSide as M, Mesh as W, UniformsUtils as q, UniformsLib as p, Color as K, Vector2 as E, UnsignedByteType as J } from "three";
import { S as Q } from "./solver-C6FiY5iw.mjs";
class Z {
  /**
   * Constructs a new GPU computation renderer.
   *
   * @param {number} sizeX - Computation problem size is always 2d: sizeX * sizeY elements.
  	 * @param {number} sizeY - Computation problem size is always 2d: sizeX * sizeY elements.
  	 * @param {WebGLRenderer} renderer - The renderer.
   */
  constructor(e, t, r) {
    this.variables = [], this.currentTextureIndex = 0;
    let a = L;
    const s = {
      passThruTexture: { value: null }
    }, l = f(x(), s), u = new B(l);
    this.setDataType = function(n) {
      return a = n, this;
    }, this.addVariable = function(n, i, o) {
      const d = this.createShaderMaterial(i), c = {
        name: n,
        initialValueTexture: o,
        material: d,
        dependencies: null,
        renderTargets: [],
        wrapS: null,
        wrapT: null,
        minFilter: y,
        magFilter: y
      };
      return this.variables.push(c), c;
    }, this.setVariableDependencies = function(n, i) {
      n.dependencies = i;
    }, this.init = function() {
      if (r.capabilities.maxVertexTextures === 0)
        return "No support for vertex shader textures.";
      for (let n = 0; n < this.variables.length; n++) {
        const i = this.variables[n];
        i.renderTargets[0] = this.createRenderTarget(e, t, i.wrapS, i.wrapT, i.minFilter, i.magFilter), i.renderTargets[1] = this.createRenderTarget(e, t, i.wrapS, i.wrapT, i.minFilter, i.magFilter), this.renderTexture(i.initialValueTexture, i.renderTargets[0]), this.renderTexture(i.initialValueTexture, i.renderTargets[1]);
        const o = i.material, d = o.uniforms;
        if (i.dependencies !== null)
          for (let c = 0; c < i.dependencies.length; c++) {
            const g = i.dependencies[c];
            if (g.name !== i.name) {
              let b = !1;
              for (let w = 0; w < this.variables.length; w++)
                if (g.name === this.variables[w].name) {
                  b = !0;
                  break;
                }
              if (!b)
                return "Variable dependency not found. Variable=" + i.name + ", dependency=" + g.name;
            }
            d[g.name] = { value: null }, o.fragmentShader = `
uniform sampler2D ` + g.name + `;
` + o.fragmentShader;
          }
      }
      return this.currentTextureIndex = 0, null;
    }, this.compute = function() {
      const n = this.currentTextureIndex, i = this.currentTextureIndex === 0 ? 1 : 0;
      for (let o = 0, d = this.variables.length; o < d; o++) {
        const c = this.variables[o];
        if (c.dependencies !== null) {
          const g = c.material.uniforms;
          for (let b = 0, w = c.dependencies.length; b < w; b++) {
            const R = c.dependencies[b];
            g[R.name].value = R.renderTargets[n].texture;
          }
        }
        this.doRenderTarget(c.material, c.renderTargets[i]);
      }
      this.currentTextureIndex = i;
    }, this.getCurrentRenderTarget = function(n) {
      return n.renderTargets[this.currentTextureIndex];
    }, this.getAlternateRenderTarget = function(n) {
      return n.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
    }, this.dispose = function() {
      u.dispose();
      const n = this.variables;
      for (let i = 0; i < n.length; i++) {
        const o = n[i];
        o.initialValueTexture && o.initialValueTexture.dispose();
        const d = o.renderTargets;
        for (let c = 0; c < d.length; c++)
          d[c].dispose();
      }
    };
    function h(n) {
      n.defines.resolution = "vec2( " + e.toFixed(1) + ", " + t.toFixed(1) + " )";
    }
    this.addResolutionDefine = h;
    function f(n, i) {
      i = i || {};
      const o = new U({
        name: "GPUComputationShader",
        uniforms: i,
        vertexShader: m(),
        fragmentShader: n
      });
      return h(o), o;
    }
    this.createShaderMaterial = f, this.createRenderTarget = function(n, i, o, d, c, g) {
      return n = n || e, i = i || t, o = o || V, d = d || V, c = c || y, g = g || y, new A(n, i, {
        wrapS: o,
        wrapT: d,
        minFilter: c,
        magFilter: g,
        format: F,
        type: a,
        depthBuffer: !1
      });
    }, this.createTexture = function() {
      const n = new Float32Array(e * t * 4), i = new Y(n, e, t, F, L);
      return i.needsUpdate = !0, i;
    }, this.renderTexture = function(n, i) {
      s.passThruTexture.value = n, this.doRenderTarget(l, i), s.passThruTexture.value = null;
    }, this.doRenderTarget = function(n, i) {
      const o = r.getRenderTarget(), d = r.xr.enabled, c = r.shadowMap.autoUpdate;
      r.xr.enabled = !1, r.shadowMap.autoUpdate = !1, u.material = n, r.setRenderTarget(i), u.render(r), u.material = l, r.xr.enabled = d, r.shadowMap.autoUpdate = c, r.setRenderTarget(o);
    };
    function m() {
      return `void main()	{

	gl_Position = vec4( position, 1.0 );

}
`;
    }
    function x() {
      return `uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`;
    }
  }
}
const $ = `#include <common>\r
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
`, ee = `uniform vec2 point1;\r
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
}`, te = `uniform sampler2D clearTexture;\r
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
`, re = `uniform sampler2D heightmap;\r
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
`, ie = `#define PHONG\r
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
}`, S = {
  heightMapFrag: $,
  readLevelFrag: ee,
  clearFrag: te,
  waterVert: re,
  waterFrag: ie
};
function H(v, e, t, r) {
  const a = [];
  let s, l, u, h, f, m, x, n, i, o, d;
  if (u = t - v, h = r - e, f = Math.abs(u), m = Math.abs(h), x = 2 * m - f, n = 2 * f - m, m <= f)
    for (u >= 0 ? (s = v, l = e, i = t) : (s = t, l = r, i = v), a.push([s, l]), d = 0; s < i; d++)
      s = s + 1, x < 0 ? x = x + 2 * m : (u < 0 && h < 0 || u > 0 && h > 0 ? l = l + 1 : l = l - 1, x = x + 2 * (m - f)), a.push([s, l]);
  else
    for (h >= 0 ? (s = v, l = e, o = r) : (s = t, l = r, o = e), a.push([s, l]), d = 0; l < o; d++)
      l = l + 1, n <= 0 ? n = n + 2 * f : (u < 0 && h < 0 || u > 0 && h > 0 ? s = s + 1 : s = s - 1, n = n + 2 * (f - m)), a.push([s, l]);
  return a;
}
class I {
  enabled;
  x1;
  y1;
  x2;
  y2;
  cells;
  previousCells;
  shouldClearPreviousCells;
  constructor(e) {
    this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = H(this.x1, this.y1, this.x2, this.y2), this.previousCells = this.cells, this.shouldClearPreviousCells = !1, this.enabled = !0;
  }
  move(e) {
    this.previousCells = this.cells, this.x1 = e.x1, this.y1 = e.y1, this.x2 = e.x2, this.y2 = e.y2, this.cells = H(this.x1, this.y1, this.x2, this.y2), this.shouldClearPreviousCells = !0;
  }
}
function _(v, e, t) {
  return v < e ? e : v > t ? t : v;
}
const ne = 256, C = {
  width: 10,
  height: 10,
  offsetX: 0,
  offsetY: 0
};
class oe extends Q {
  gpuCompute;
  /**
   * number of x cells
   */
  nx;
  /**
   * number of y cells
   */
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
  /**
   * simulation in seconds
   */
  time;
  /**
   * simulation time step in seconds
   */
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
  constructor(e) {
    super(e), this.kind = "fdtd-2d", this.running = !1, this.time = 0, this.frame = 0, this.numPasses = 1, this.waveSpeed = 340.29, this.recording = !1;
    const t = [...k.getState().selectedObjects.values()].filter((h) => h.kind === "surface");
    let r = null;
    if (e = e || {}, t.length > 0) {
      r = t.length > 1 ? t[0].mergeSurfaces(t) : t[0], r.mesh.geometry.computeBoundingBox();
      const h = r.mesh.geometry.boundingBox;
      h && (e.width = h.max.x - h.min.x, e.height = h.max.y - h.min.y, e.offsetX = h.min.x, e.offsetY = h.min.y);
    }
    const a = e && e.width || C.width, s = e && e.height || C.height;
    this.offsetX = e && e.offsetX || C.offsetX, this.offsetY = e && e.offsetY || C.offsetY, this.cellSize = e && e.cellSize || Math.max(a, s) / ne, this.nx = Math.ceil(a / this.cellSize), this.ny = Math.ceil(s / this.cellSize), this.width = this.nx * this.cellSize, this.height = this.ny * this.cellSize, this.dt = this.cellSize / this.waveSpeed, this.sources = {}, this.sourceKeys = [], this.receivers = {}, this.receiverKeys = [], this.walls = [], this.messageHandlers = [], this.eventListeners = [];
    const l = new P(this.width, this.height, 1, 1);
    l.translate(this.width / 2, this.height / 2, 0), l.translate(this.offsetX, this.offsetY, 0);
    const u = [
      new G({ wireframe: !0, side: M, color: 7368816 }),
      new O({ transparent: !0, opacity: 0.35, side: M, color: 7368816 })
    ];
    this.editMesh = new W(l, u[0]), this.editMesh.name = "fdtd-2d-edit-mesh", this.editMesh.visible = !1, T.fdtdItems.add(this.editMesh), this.fillTexture = this.fillTexture.bind(this), this.init = this.init.bind(this), this.render = this.render.bind(this), this.updateWalls = this.updateWalls.bind(this), this.updateSourceTexture = this.updateSourceTexture.bind(this), this.addWallsFromSurfaceEdges = this.addWallsFromSurfaceEdges.bind(this), this.setWireframeVisible = this.setWireframeVisible.bind(this), this.getWireframeVisible = this.getWireframeVisible.bind(this), this.toggleWall = this.toggleWall.bind(this), this.clear = this.clear.bind(this), this.init(), this.onModeChange(X("GET_EDITOR_MODE")[0]), r && this.addWallsFromSurfaceEdges(r);
  }
  onModeChange(e) {
    switch (e) {
      case D.OBJECT:
        this.editMesh.visible = !1, this.mesh.visible = !0;
        break;
      case D.SKETCH:
        this.editMesh.visible = !1, this.mesh.visible = !1;
        break;
      case D.EDIT:
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
    const e = new P(this.width, this.height, this.nx - 1, this.ny - 1);
    e.name = "fdtd-2d-plane-geometry", e.translate(this.width / 2, this.height / 2, 0), e.translate(this.offsetX, this.offsetY, 0);
    const t = { value: null }, r = q.merge([
      p.common,
      p.specularmap,
      p.envmap,
      p.aomap,
      p.lightmap,
      p.emissivemap,
      p.bumpmap,
      p.normalmap,
      p.displacementmap,
      p.gradientmap,
      p.fog,
      p.lights,
      {
        emissive: { value: new K(0) },
        specular: { value: new K(1118481) },
        shininess: { value: 30 },
        colorBrightness: { value: 10 },
        cell_size: { value: this.cellSize },
        inv_cell_size: { value: 1 / this.cellSize },
        heightmap: t
      }
    ]), a = S.waterVert, s = S.waterFrag, l = M, u = new U({
      uniforms: r,
      vertexShader: a,
      fragmentShader: s,
      side: l,
      name: "fdtd-2d-material"
    });
    u.lights = !0, this.uniforms = u.uniforms, this.mesh = new W(e, u), this.mesh.matrixAutoUpdate = !1, this.mesh.updateMatrix(), this.mesh.material.wireframe = !1, this.mesh.matrixAutoUpdate = !0, this.mesh.scale.setZ(0.01), T.fdtdItems.add(this.mesh), this.gpuCompute = new Z(this.nx, this.ny, T.renderer);
    let h = this.gpuCompute.createTexture();
    this.sourcemap = this.gpuCompute.createTexture(), this.fillSourceTexture(), this.updateSourceTexture(), this.fillTexture(h), this.heightmapVariable = this.gpuCompute.addVariable("heightmap", S.heightMapFrag, h), this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]), this.heightmapVariable.material.uniforms.sourcemap = { value: this.sourcemap }, this.heightmapVariable.material.uniforms.mousePos = { value: new E(5, 5) }, this.heightmapVariable.material.uniforms.mouseSize = { value: 0 }, this.heightmapVariable.material.uniforms.damping = { value: 0.9999 }, this.heightmapVariable.material.uniforms.heightCompensation = { value: 0 }, this.heightmapVariable.material.uniforms.cell_size = { value: this.cellSize }, this.heightmapVariable.material.uniforms.inv_cell_size = { value: 1 / this.cellSize };
    const f = this.gpuCompute.init();
    f !== null && console.error(f), this.clearShader = this.gpuCompute.createShaderMaterial(S.clearFrag, { clearTexture: { value: null } }), this.readLevelShader = this.gpuCompute.createShaderMaterial(S.readLevelFrag, {
      point1: { value: new E() },
      levelTexture: { value: null },
      cell_size: { value: this.cellSize },
      inv_cell_size: { value: 1 / this.cellSize }
    }), this.readLevelImage = new Uint8Array(16), this.readLevelRenderTarget = new A(4, 1, {
      wrapS: V,
      wrapT: V,
      minFilter: y,
      magFilter: y,
      format: F,
      type: J,
      stencilBuffer: !1,
      depthBuffer: !1
    }), this.eventListeners.push(j("RENDERER_UPDATED", () => {
      this.running && this.render();
    })), this.render(), this.clear();
  }
  editSize() {
  }
  dispose() {
    this.eventListeners.forEach((e) => e());
    for (let e = 0; e < this.messageHandlers.length; e++)
      N(this.messageHandlers[e][0], this.messageHandlers[e][1]);
    this.mesh && T.fdtdItems.remove(this.mesh), this.messageHandlers = [];
  }
  run() {
    this.running = !0, T.fdtd2drunning = !0;
  }
  stop() {
    this.running = !1, T.fdtd2drunning = !1;
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
    const t = _(Math.floor((e.x1 - this.offsetX) / this.cellSize), 0, this.nx - 1), r = _(Math.floor((e.y1 - this.offsetY) / this.cellSize), 0, this.nx - 1), a = _(Math.floor((e.x2 - this.offsetX) / this.cellSize), 0, this.nx - 1), s = _(Math.floor((e.y2 - this.offsetY) / this.cellSize), 0, this.nx - 1);
    this.walls.push(new I({ x1: t, y1: r, x2: a, y2: s })), this.updateWalls();
  }
  addWallsFromSurfaceEdges(e) {
    const t = e.edges.geometry.getAttribute("position");
    for (let r = 0; r < t.count; r += 2) {
      let a = _(Math.floor((t.getX(r) - this.offsetX) / this.cellSize), 0, this.nx - 1), s = _(Math.floor((t.getY(r) - this.offsetY) / this.cellSize), 0, this.ny - 1), l = _(Math.floor((t.getX(r + 1) - this.offsetX) / this.cellSize), 0, this.nx - 1), u = _(Math.floor((t.getY(r + 1) - this.offsetY) / this.cellSize), 0, this.ny - 1);
      this.walls.push(new I({ x1: a, y1: s, x2: l, y2: u }));
    }
    this.updateWalls();
  }
  fillSourceTexture() {
    const e = this.sourcemap.image.data;
    if (!e) return;
    let t = 0;
    for (let r = 0; r < this.ny; r++)
      for (let a = 0; a < this.nx; a++)
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
            const a = 4 * (this.walls[t].previousCells[r][1] * this.nx + this.walls[t].previousCells[r][0]);
            e[a + 2] = 1;
          }
          this.walls[t].shouldClearPreviousCells = !1;
        }
        if (this.walls[t].enabled)
          for (let r = 0; r < this.walls[t].cells.length; r++) {
            const a = 4 * (this.walls[t].cells[r][1] * this.nx + this.walls[t].cells[r][0]);
            e[a + 2] = 0;
          }
        else
          for (let r = 0; r < this.walls[t].cells.length; r++) {
            const a = 4 * (this.walls[t].cells[r][1] * this.nx + this.walls[t].cells[r][0]);
            e[a + 2] = 1;
          }
      }
      this.sourcemap.needsUpdate = !0;
    }
  }
  updateSourceTexture() {
    const e = this.sourcemap.image.data;
    if (e) {
      for (let t = 0; t < this.sourceKeys.length; t++) {
        const r = Math.round((this.sources[this.sourceKeys[t]].x - this.offsetX) / this.cellSize), s = 4 * (Math.round((this.sources[this.sourceKeys[t]].y - this.offsetY) / this.cellSize) * this.nx + r);
        this.sources[this.sourceKeys[t]].updateWave(this.time, this.frame, this.dt);
        const l = this.sources[this.sourceKeys[t]].value, u = this.sources[this.sourceKeys[t]].velocity;
        if (e[s + 0] = z(l, -2, 2, 0, 255), e[s + 1] = z(u, -2, 2, 0, 255), e[s + 3] = 0, this.sources[this.sourceKeys[t]].shouldClearPreviousPosition) {
          const h = Math.round((this.sources[this.sourceKeys[t]].previousX - this.offsetX) / this.cellSize), m = 4 * (Math.round((this.sources[this.sourceKeys[t]].previousY - this.offsetY) / this.cellSize) * this.nx + h);
          e[m + 0] = 0, e[m + 1] = 0, e[m + 3] = 1, this.sources[this.sourceKeys[t]].shouldClearPreviousPosition = !1, this.sources[this.sourceKeys[t]].updatePreviousPosition();
        }
      }
      this.sourcemap.needsUpdate = !0;
    }
  }
  fillTexture(e) {
    const t = e.image.data;
    if (!t) return;
    let r = 0;
    for (let a = 0; a < this.ny; a++)
      for (let s = 0; s < this.nx; s++)
        t[r + 0] = z(0, -2, 2, 0, 255), t[r + 1] = 0, t[r + 2] = 1, t[r + 3] = 1, r += 4;
  }
  readReceiverLevels() {
    const e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
    this.readLevelShader.uniforms.levelTexture.value = e.texture;
    for (let t = 0; t < this.receiverKeys.length; t++) {
      const r = this.receiverKeys[t];
      if (this.receivers[r]) {
        const a = (this.receivers[r].position.x - this.offsetX) / this.width, s = (this.receivers[r].position.y - this.offsetY) / this.height;
        this.readLevelShader.uniforms.point1.value.set(a, s), this.gpuCompute.doRenderTarget(this.readLevelShader, this.readLevelRenderTarget), T.renderer.readRenderTargetPixels(
          this.readLevelRenderTarget,
          0,
          0,
          4,
          1,
          this.readLevelImage
        );
        const u = new Float32Array(this.readLevelImage.buffer)[0];
        this.receivers[r].fdtdSamples.push((u - 127.5) / 127.5);
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
  oe as FDTD_2D,
  C as FDTD_2D_Defaults,
  oe as default
};
//# sourceMappingURL=index-CP_NHYh1.mjs.map
