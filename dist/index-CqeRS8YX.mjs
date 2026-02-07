import { l as B, u as k, r as T, n as X, E as D, o as j, q as N, x as z } from "./index-CXm_LEs2.mjs";
import { NearestFilter as y, ShaderMaterial as U, WebGLRenderTarget as A, FloatType as L, RGBAFormat as F, DataTexture as Y, ClampToEdgeWrapping as V, PlaneGeometry as P, MeshBasicMaterial as G, MeshLambertMaterial as O, DoubleSide as M, Mesh as W, UniformsUtils as q, UniformsLib as v, Color as K, Vector2 as E, UnsignedByteType as Q } from "three";
import { S as J } from "./solver-2Xqbhs6F.mjs";
class Z {
  /**
   * Constructs a new GPU computation renderer.
   *
   * @param {number} sizeX - Computation problem size is always 2d: sizeX * sizeY elements.
  	 * @param {number} sizeY - Computation problem size is always 2d: sizeX * sizeY elements.
  	 * @param {WebGLRenderer} renderer - The renderer.
   */
  constructor(e, t, i) {
    this.variables = [], this.currentTextureIndex = 0;
    let a = L;
    const r = {
      passThruTexture: { value: null }
    }, l = f(x(), r), u = new B(l);
    this.setDataType = function(s) {
      return a = s, this;
    }, this.addVariable = function(s, n, o) {
      const d = this.createShaderMaterial(n), c = {
        name: s,
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
    }, this.setVariableDependencies = function(s, n) {
      s.dependencies = n;
    }, this.init = function() {
      if (i.capabilities.maxVertexTextures === 0)
        return "No support for vertex shader textures.";
      for (let s = 0; s < this.variables.length; s++) {
        const n = this.variables[s];
        n.renderTargets[0] = this.createRenderTarget(e, t, n.wrapS, n.wrapT, n.minFilter, n.magFilter), n.renderTargets[1] = this.createRenderTarget(e, t, n.wrapS, n.wrapT, n.minFilter, n.magFilter), this.renderTexture(n.initialValueTexture, n.renderTargets[0]), this.renderTexture(n.initialValueTexture, n.renderTargets[1]);
        const o = n.material, d = o.uniforms;
        if (n.dependencies !== null)
          for (let c = 0; c < n.dependencies.length; c++) {
            const p = n.dependencies[c];
            if (p.name !== n.name) {
              let b = !1;
              for (let S = 0; S < this.variables.length; S++)
                if (p.name === this.variables[S].name) {
                  b = !0;
                  break;
                }
              if (!b)
                return "Variable dependency not found. Variable=" + n.name + ", dependency=" + p.name;
            }
            d[p.name] = { value: null }, o.fragmentShader = `
uniform sampler2D ` + p.name + `;
` + o.fragmentShader;
          }
      }
      return this.currentTextureIndex = 0, null;
    }, this.compute = function() {
      const s = this.currentTextureIndex, n = this.currentTextureIndex === 0 ? 1 : 0;
      for (let o = 0, d = this.variables.length; o < d; o++) {
        const c = this.variables[o];
        if (c.dependencies !== null) {
          const p = c.material.uniforms;
          for (let b = 0, S = c.dependencies.length; b < S; b++) {
            const R = c.dependencies[b];
            p[R.name].value = R.renderTargets[s].texture;
          }
        }
        this.doRenderTarget(c.material, c.renderTargets[n]);
      }
      this.currentTextureIndex = n;
    }, this.getCurrentRenderTarget = function(s) {
      return s.renderTargets[this.currentTextureIndex];
    }, this.getAlternateRenderTarget = function(s) {
      return s.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
    }, this.dispose = function() {
      u.dispose();
      const s = this.variables;
      for (let n = 0; n < s.length; n++) {
        const o = s[n];
        o.initialValueTexture && o.initialValueTexture.dispose();
        const d = o.renderTargets;
        for (let c = 0; c < d.length; c++)
          d[c].dispose();
      }
    };
    function h(s) {
      s.defines.resolution = "vec2( " + e.toFixed(1) + ", " + t.toFixed(1) + " )";
    }
    this.addResolutionDefine = h;
    function f(s, n) {
      n = n || {};
      const o = new U({
        name: "GPUComputationShader",
        uniforms: n,
        vertexShader: g(),
        fragmentShader: s
      });
      return h(o), o;
    }
    this.createShaderMaterial = f, this.createRenderTarget = function(s, n, o, d, c, p) {
      return s = s || e, n = n || t, o = o || V, d = d || V, c = c || y, p = p || y, new A(s, n, {
        wrapS: o,
        wrapT: d,
        minFilter: c,
        magFilter: p,
        format: F,
        type: a,
        depthBuffer: !1
      });
    }, this.createTexture = function() {
      const s = new Float32Array(e * t * 4), n = new Y(s, e, t, F, L);
      return n.needsUpdate = !0, n;
    }, this.renderTexture = function(s, n) {
      r.passThruTexture.value = s, this.doRenderTarget(l, n), r.passThruTexture.value = null;
    }, this.doRenderTarget = function(s, n) {
      const o = i.getRenderTarget(), d = i.xr.enabled, c = i.shadowMap.autoUpdate;
      i.xr.enabled = !1, i.shadowMap.autoUpdate = !1, u.material = s, i.setRenderTarget(n), u.render(i), u.material = l, i.xr.enabled = d, i.shadowMap.autoUpdate = c, i.setRenderTarget(o);
    };
    function g() {
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
const $ = `#include <common>

uniform vec2 mousePos;
uniform float mouseSize;
uniform float damping;
uniform float heightCompensation;
uniform float courantSq;
uniform sampler2D sourcemap;

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
    
    
    // float u_pos = u_wall == 0 ? d.r : u.r;
    // float d_pos = d_wall == 0 ? u.r : d.r;
    // float r_pos = r_wall == 0 ? l.r : r.r;
    // float l_pos = l_wall == 0 ? r.r : l.r;

    float u_pos =  u.r;
    float d_pos =  d.r;
    float r_pos =  r.r;
    float l_pos =  l.r;
    
    if(u_wall == 0.0){
      u_pos = texture2D( heightmap, uv - ud_offset ).r;
    }
    if(d_wall == 0.0){
      d_pos = texture2D( heightmap, uv + ud_offset ).r;
    }
    if(r_wall == 0.0){
      r_pos = texture2D( heightmap, uv - rl_offset ).r;
    }
    if(l_wall == 0.0){
      l_pos = texture2D( heightmap, uv + rl_offset ).r;
    }

    float mid = 0.25*(u_pos+d_pos+r_pos+l_pos);
  
    float med = 4.0 * courantSq;
    newvel = med*(mid-pos)+vel*damping;
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
`, ee = `uniform vec2 point1;
uniform float cell_size;
uniform float inv_cell_size;

uniform sampler2D levelTexture;

// Integer to float conversion from https://stackoverflow.com/questions/17981163/webgl-read-pixels-from-floating-point-render-target

float shift_right( float v, float amt ) {

	v = floor( v ) + 0.5;
	return floor( v / exp2( amt ) );

}

float shift_left( float v, float amt ) {

	return floor( v * exp2( amt ) + 0.5 );

}

float mask_last( float v, float bits ) {

	return mod( v, shift_left( 1.0, bits ) );

}

float extract_bits( float num, float from, float to ) {

	from = floor( from + 0.5 ); to = floor( to + 0.5 );
	return mask_last( shift_right( num, from ), to - from );

}

vec4 encode_float( float val ) {
	if ( val == 0.0 ) return vec4( 0, 0, 0, 0 );
	float sign = val > 0.0 ? 0.0 : 1.0;
	val = abs( val );
	float exponent = floor( log2( val ) );
	float biased_exponent = exponent + 127.0;
	float fraction = ( ( val / exp2( exponent ) ) - 1.0 ) * 8388608.0;
	float t = biased_exponent / 2.0;
	float last_bit_of_biased_exponent = fract( t ) * 2.0;
	float remaining_bits_of_biased_exponent = floor( t );
	float byte4 = extract_bits( fraction, 0.0, 8.0 ) / 255.0;
	float byte3 = extract_bits( fraction, 8.0, 16.0 ) / 255.0;
	float byte2 = ( last_bit_of_biased_exponent * 128.0 + extract_bits( fraction, 16.0, 23.0 ) ) / 255.0;
	float byte1 = ( sign * 128.0 + remaining_bits_of_biased_exponent ) / 255.0;
	return vec4( byte4, byte3, byte2, byte1 );
}

void main()	{

	vec2 cellSize = vec2(cell_size);

	float waterLevel = texture2D( levelTexture, point1 ).x;

	vec2 normal = vec2(
		( texture2D( levelTexture, point1 + vec2( - cellSize.x, 0 ) ).x - texture2D( levelTexture, point1 + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,
		( texture2D( levelTexture, point1 + vec2( 0, - cellSize.y ) ).x - texture2D( levelTexture, point1 + vec2( 0, cellSize.y ) ).x ) * inv_cell_size );

	if ( gl_FragCoord.x < 1.5 ) {

		gl_FragColor = encode_float( waterLevel );

	} else if ( gl_FragCoord.x < 2.5 ) {

		gl_FragColor = encode_float( normal.x );

	} else if ( gl_FragCoord.x < 3.5 ) {

		gl_FragColor = encode_float( normal.y );

	} else {

		gl_FragColor = encode_float( 0.0 );

	}

}`, te = `uniform sampler2D clearTexture;

void main()	{

	vec2 cellSize = 1.0 / resolution.xy;

	vec2 uv = gl_FragCoord.xy * cellSize;


	vec4 textureValue = texture2D( clearTexture, uv );

	textureValue.r = 127.5;
	textureValue.g = 0.0;

	gl_FragColor = textureValue;

}
`, ie = `uniform sampler2D heightmap;
uniform float inv_cell_size;
uniform float cell_size;
varying float vHeight;
varying float vWall;
#define PHONG

varying vec3 vViewPosition;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	vec2 cellSize = vec2( cell_size );

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	// # include <beginnormal_vertex>
	// Compute normal from heightmap
	vec3 objectNormal = vec3(
		( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * inv_cell_size,
		( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * inv_cell_size,
		1.0 );
	//<beginnormal_vertex>

	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

	vNormal = normalize( transformedNormal );

#endif

	//# include <begin_vertex>
	vec4 heightmapValue = texture2D( heightmap, uv );
	float heightValue = heightmapValue.x - 127.5;
	vHeight = heightValue;
	vWall = heightmapValue.a;
	
	vec3 transformed = vec3( position.x, position.y, heightValue );
	//<begin_vertex>

	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>

}
`, ne = `#define PHONG

varying float vHeight;
varying float vWall;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform float colorBrightness;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	#include <envmap_fragment>

	vec3 col = vec3(0.0,0.0,0.0);
	if(vHeight > 0.0){
		col.r = vHeight/127.5*colorBrightness;
	}
	else if(vHeight <= 0.0){
		col.g = -vHeight/127.5*colorBrightness;
	}

	gl_FragColor = vec4( col, 1.0 );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}`, w = {
  heightMapFrag: $,
  readLevelFrag: ee,
  clearFrag: te,
  waterVert: ie,
  waterFrag: ne
};
function se(m, e) {
  return m / (e * Math.SQRT2);
}
function H(m, e, t, i) {
  const a = [];
  let r, l, u, h, f, g, x, s, n, o, d;
  if (u = t - m, h = i - e, f = Math.abs(u), g = Math.abs(h), x = 2 * g - f, s = 2 * f - g, g <= f)
    for (u >= 0 ? (r = m, l = e, n = t) : (r = t, l = i, n = m), a.push([r, l]), d = 0; r < n; d++)
      r = r + 1, x < 0 ? x = x + 2 * g : (u < 0 && h < 0 || u > 0 && h > 0 ? l = l + 1 : l = l - 1, x = x + 2 * (g - f)), a.push([r, l]);
  else
    for (h >= 0 ? (r = m, l = e, o = i) : (r = t, l = i, o = e), a.push([r, l]), d = 0; l < o; d++)
      l = l + 1, s <= 0 ? s = s + 2 * f : (u < 0 && h < 0 || u > 0 && h > 0 ? r = r + 1 : r = r - 1, s = s + 2 * (f - g)), a.push([r, l]);
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
function _(m, e, t) {
  return m < e ? e : m > t ? t : m;
}
const re = 256, C = {
  width: 10,
  height: 10,
  offsetX: 0,
  offsetY: 0
};
class he extends J {
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
    let i = null;
    if (e = e || {}, t.length > 0) {
      i = t.length > 1 ? t[0].mergeSurfaces(t) : t[0], i.mesh.geometry.computeBoundingBox();
      const h = i.mesh.geometry.boundingBox;
      h && (e.width = h.max.x - h.min.x, e.height = h.max.y - h.min.y, e.offsetX = h.min.x, e.offsetY = h.min.y);
    }
    const a = e && e.width || C.width, r = e && e.height || C.height;
    this.offsetX = e && e.offsetX || C.offsetX, this.offsetY = e && e.offsetY || C.offsetY, this.cellSize = e && e.cellSize || Math.max(a, r) / re, this.nx = Math.ceil(a / this.cellSize), this.ny = Math.ceil(r / this.cellSize), this.width = this.nx * this.cellSize, this.height = this.ny * this.cellSize, this.dt = se(this.cellSize, this.waveSpeed), this.sources = {}, this.sourceKeys = [], this.receivers = {}, this.receiverKeys = [], this.walls = [], this.messageHandlers = [], this.eventListeners = [];
    const l = new P(this.width, this.height, 1, 1);
    l.translate(this.width / 2, this.height / 2, 0), l.translate(this.offsetX, this.offsetY, 0);
    const u = [
      new G({ wireframe: !0, side: M, color: 7368816 }),
      new O({ transparent: !0, opacity: 0.35, side: M, color: 7368816 })
    ];
    this.editMesh = new W(l, u[0]), this.editMesh.name = "fdtd-2d-edit-mesh", this.editMesh.visible = !1, T.fdtdItems.add(this.editMesh), this.fillTexture = this.fillTexture.bind(this), this.init = this.init.bind(this), this.render = this.render.bind(this), this.updateWalls = this.updateWalls.bind(this), this.updateSourceTexture = this.updateSourceTexture.bind(this), this.addWallsFromSurfaceEdges = this.addWallsFromSurfaceEdges.bind(this), this.setWireframeVisible = this.setWireframeVisible.bind(this), this.getWireframeVisible = this.getWireframeVisible.bind(this), this.toggleWall = this.toggleWall.bind(this), this.clear = this.clear.bind(this), this.init(), this.onModeChange(X("GET_EDITOR_MODE")[0]), i && this.addWallsFromSurfaceEdges(i);
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
    const t = { value: null }, i = q.merge([
      v.common,
      v.specularmap,
      v.envmap,
      v.aomap,
      v.lightmap,
      v.emissivemap,
      v.bumpmap,
      v.normalmap,
      v.displacementmap,
      v.gradientmap,
      v.fog,
      v.lights,
      {
        emissive: { value: new K(0) },
        specular: { value: new K(1118481) },
        shininess: { value: 30 },
        colorBrightness: { value: 10 },
        cell_size: { value: this.cellSize },
        inv_cell_size: { value: 1 / this.cellSize },
        heightmap: t
      }
    ]), a = w.waterVert, r = w.waterFrag, l = M, u = new U({
      uniforms: i,
      vertexShader: a,
      fragmentShader: r,
      side: l,
      name: "fdtd-2d-material"
    });
    u.lights = !0, this.uniforms = u.uniforms, this.mesh = new W(e, u), this.mesh.matrixAutoUpdate = !1, this.mesh.updateMatrix(), this.mesh.material.wireframe = !1, this.mesh.matrixAutoUpdate = !0, this.mesh.scale.setZ(0.01), T.fdtdItems.add(this.mesh), this.gpuCompute = new Z(this.nx, this.ny, T.renderer);
    let h = this.gpuCompute.createTexture();
    this.sourcemap = this.gpuCompute.createTexture(), this.fillSourceTexture(), this.updateSourceTexture(), this.fillTexture(h), this.heightmapVariable = this.gpuCompute.addVariable("heightmap", w.heightMapFrag, h), this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]), this.heightmapVariable.material.uniforms.sourcemap = { value: this.sourcemap }, this.heightmapVariable.material.uniforms.mousePos = { value: new E(5, 5) }, this.heightmapVariable.material.uniforms.mouseSize = { value: 0 }, this.heightmapVariable.material.uniforms.damping = { value: 0.9999 }, this.heightmapVariable.material.uniforms.courantSq = { value: (this.waveSpeed * this.dt / this.cellSize) ** 2 }, this.heightmapVariable.material.uniforms.heightCompensation = { value: 0 }, this.heightmapVariable.material.uniforms.cell_size = { value: this.cellSize }, this.heightmapVariable.material.uniforms.inv_cell_size = { value: 1 / this.cellSize };
    const f = this.gpuCompute.init();
    f !== null && console.error(f), this.clearShader = this.gpuCompute.createShaderMaterial(w.clearFrag, { clearTexture: { value: null } }), this.readLevelShader = this.gpuCompute.createShaderMaterial(w.readLevelFrag, {
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
      type: Q,
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
    const t = _(Math.floor((e.x1 - this.offsetX) / this.cellSize), 0, this.nx - 1), i = _(Math.floor((e.y1 - this.offsetY) / this.cellSize), 0, this.ny - 1), a = _(Math.floor((e.x2 - this.offsetX) / this.cellSize), 0, this.nx - 1), r = _(Math.floor((e.y2 - this.offsetY) / this.cellSize), 0, this.ny - 1);
    this.walls.push(new I({ x1: t, y1: i, x2: a, y2: r })), this.updateWalls();
  }
  addWallsFromSurfaceEdges(e) {
    const t = e.edges.geometry.getAttribute("position");
    for (let i = 0; i < t.count; i += 2) {
      let a = _(Math.floor((t.getX(i) - this.offsetX) / this.cellSize), 0, this.nx - 1), r = _(Math.floor((t.getY(i) - this.offsetY) / this.cellSize), 0, this.ny - 1), l = _(Math.floor((t.getX(i + 1) - this.offsetX) / this.cellSize), 0, this.nx - 1), u = _(Math.floor((t.getY(i + 1) - this.offsetY) / this.cellSize), 0, this.ny - 1);
      this.walls.push(new I({ x1: a, y1: r, x2: l, y2: u }));
    }
    this.updateWalls();
  }
  fillSourceTexture() {
    const e = this.sourcemap.image.data;
    if (!e) return;
    let t = 0;
    for (let i = 0; i < this.ny; i++)
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
          for (let i = 0; i < this.walls[t].previousCells.length; i++) {
            const a = 4 * (this.walls[t].previousCells[i][1] * this.nx + this.walls[t].previousCells[i][0]);
            e[a + 2] = 1;
          }
          this.walls[t].shouldClearPreviousCells = !1;
        }
        if (this.walls[t].enabled)
          for (let i = 0; i < this.walls[t].cells.length; i++) {
            const a = 4 * (this.walls[t].cells[i][1] * this.nx + this.walls[t].cells[i][0]);
            e[a + 2] = 0;
          }
        else
          for (let i = 0; i < this.walls[t].cells.length; i++) {
            const a = 4 * (this.walls[t].cells[i][1] * this.nx + this.walls[t].cells[i][0]);
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
        const i = Math.round((this.sources[this.sourceKeys[t]].x - this.offsetX) / this.cellSize), r = 4 * (Math.round((this.sources[this.sourceKeys[t]].y - this.offsetY) / this.cellSize) * this.nx + i);
        this.sources[this.sourceKeys[t]].updateWave(this.time, this.frame, this.dt);
        const l = this.sources[this.sourceKeys[t]].value, u = this.sources[this.sourceKeys[t]].velocity;
        if (e[r + 0] = z(l, -2, 2, 0, 255), e[r + 1] = z(u, -2, 2, 0, 255), e[r + 3] = 0, this.sources[this.sourceKeys[t]].shouldClearPreviousPosition) {
          const h = Math.round((this.sources[this.sourceKeys[t]].previousX - this.offsetX) / this.cellSize), g = 4 * (Math.round((this.sources[this.sourceKeys[t]].previousY - this.offsetY) / this.cellSize) * this.nx + h);
          e[g + 0] = 0, e[g + 1] = 0, e[g + 3] = 1, this.sources[this.sourceKeys[t]].shouldClearPreviousPosition = !1, this.sources[this.sourceKeys[t]].updatePreviousPosition();
        }
      }
      this.sourcemap.needsUpdate = !0;
    }
  }
  fillTexture(e) {
    const t = e.image.data;
    if (!t) return;
    let i = 0;
    for (let a = 0; a < this.ny; a++)
      for (let r = 0; r < this.nx; r++)
        t[i + 0] = z(0, -2, 2, 0, 255), t[i + 1] = 0, t[i + 2] = 1, t[i + 3] = 1, i += 4;
  }
  readReceiverLevels() {
    const e = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
    this.readLevelShader.uniforms.levelTexture.value = e.texture;
    for (let t = 0; t < this.receiverKeys.length; t++) {
      const i = this.receiverKeys[t];
      if (this.receivers[i]) {
        const a = (this.receivers[i].position.x - this.offsetX) / this.width, r = (this.receivers[i].position.y - this.offsetY) / this.height;
        this.readLevelShader.uniforms.point1.value.set(a, r), this.gpuCompute.doRenderTarget(this.readLevelShader, this.readLevelRenderTarget), T.renderer.readRenderTargetPixels(
          this.readLevelRenderTarget,
          0,
          0,
          4,
          1,
          this.readLevelImage
        );
        const u = new Float32Array(this.readLevelImage.buffer)[0];
        this.receivers[i].fdtdSamples.push((u - 127.5) / 127.5);
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
  he as FDTD_2D,
  C as FDTD_2D_Defaults,
  he as default
};
//# sourceMappingURL=index-CqeRS8YX.mjs.map
