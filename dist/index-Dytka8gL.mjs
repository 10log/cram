var ce = Object.defineProperty;
var he = (d, y, e) => y in d ? ce(d, y, { enumerable: !0, configurable: !0, writable: !0, value: e }) : d[y] = e;
var R = (d, y, e) => he(d, typeof y != "symbol" ? y + "" : y, e);
import { S as ue } from "./solver-cvNYXUbR.mjs";
import * as w from "three";
import { computeBoundsTree as fe, disposeBoundsTree as pe, acceleratedRaycast as de } from "three-mesh-bvh";
import { r as _, t as M, k as S, V as X, A as U, w as E, e as F, q, R as ee, W as B, z, L as N, s as W, I as $, X as me, Y as ye, x as Y, y as ge, F as G, Z as te, o as T, _ as ve, B as Ie, C as Re, D as De, f as V } from "./index-BovKYX7u.mjs";
import { e as be, g as Se } from "./ambisonics.es-Ci32Q6qr.mjs";
import { ImageSourceSolver as we } from "./index-Cyw3edSD.mjs";
var re = function(d) {
  return function(y, e, t) {
    return d(y, e, t) * t;
  };
}, Q = function(d, y) {
  if (d)
    throw Error("Invalid sort config: " + y);
}, ie = function(d) {
  var y = d || {}, e = y.asc, t = y.desc, s = e ? 1 : -1, i = e || t;
  Q(!i, "Expected `asc` or `desc` property"), Q(e && t, "Ambiguous object with `asc` and `desc` config properties");
  var a = d.comparer && re(d.comparer);
  return { order: s, sortBy: i, comparer: a };
}, Ae = function(d) {
  return function y(e, t, s, i, a, l, n) {
    var h, r;
    if (typeof e == "string")
      h = l[e], r = n[e];
    else if (typeof e == "function")
      h = e(l), r = e(n);
    else {
      var c = ie(e);
      return y(c.sortBy, t, s, c.order, c.comparer || d, l, n);
    }
    var o = a(h, r, i);
    return (o === 0 || h == null && r == null) && t.length > s ? y(t[s], t, s + 1, i, a, l, n) : o;
  };
};
function ae(d, y, e) {
  if (d === void 0 || d === !0)
    return function(i, a) {
      return y(i, a, e);
    };
  if (typeof d == "string")
    return Q(d.includes("."), "String syntax not allowed for nested properties."), function(i, a) {
      return y(i[d], a[d], e);
    };
  if (typeof d == "function")
    return function(i, a) {
      return y(d(i), d(a), e);
    };
  if (Array.isArray(d)) {
    var t = Ae(y);
    return function(i, a) {
      return t(d[0], d, 1, e, y, i, a);
    };
  }
  var s = ie(d);
  return ae(s.sortBy, s.comparer || y, s.order);
}
var K = function(d, y, e, t) {
  var s;
  return Array.isArray(y) ? (Array.isArray(e) && e.length < 2 && (s = e, e = s[0]), y.sort(ae(e, t, d))) : y;
};
function oe(d) {
  var y = re(d.comparer);
  return function(e) {
    var t = Array.isArray(e) && !d.inPlaceSorting ? e.slice() : e;
    return {
      asc: function(s) {
        return K(1, t, s, y);
      },
      desc: function(s) {
        return K(-1, t, s, y);
      },
      by: function(s) {
        return K(1, t, s, y);
      }
    };
  };
}
var le = function(d, y, e) {
  return d == null ? e : y == null ? -e : typeof d != typeof y ? typeof d < typeof y ? -1 : 1 : d < y ? -1 : d > y ? 1 : 0;
}, _e = oe({
  comparer: le
});
oe({
  comparer: le,
  inPlaceSorting: !0
});
const { cos: se } = Math;
function xe(d, y, e, t, s) {
  return d * (1 - y) * e * (1 - se(t / 2)) * 2 * se(s);
}
const Ee = `attribute vec2 color;
varying vec2 vColor;
uniform float pointScale;
void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = pointScale*(color.x/4.0+0.5);
  gl_Position = projectionMatrix * mvPosition;
  
}`, Pe = `varying vec2 vColor;
uniform float drawStyle;
uniform int inverted;
vec3 hsl2rgb(vec3 c)
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

vec3 rgb2hsl( vec3 c ){
  float h = 0.0;
	float s = 0.0;
	float l = 0.0;
	float r = c.r;
	float g = c.g;
	float b = c.b;
	float cMin = min( r, min( g, b ) );
	float cMax = max( r, max( g, b ) );

	l = ( cMax + cMin ) / 2.0;
	if ( cMax > cMin ) {
		float cDelta = cMax - cMin;
        
        //s = l < .05 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) ); Original
		s = l < .0 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) );
        
		if ( r == cMax ) {
			h = ( g - b ) / cDelta;
		} else if ( g == cMax ) {
			h = 2.0 + ( b - r ) / cDelta;
		} else {
			h = 4.0 + ( r - g ) / cDelta;
		}

		if ( h < 0.0) {
			h += 6.0;
		}
		h = h / 6.0;
	}
	return vec3( h, s, l );
}

void main() {
  vec3 color = vec3(0.0);
	float alpha = vColor.x;
  if(drawStyle == 0.0){
    vec3 col = hsl2rgb(vec3(vColor.x/10.0,0.8, vColor.x));
    color = col;
		alpha = vColor.x;
  }
  else if(drawStyle == 1.0){
    vec3 col = hsl2rgb(vec3(vColor.y,vColor.x,vColor.y));
    vec3 col2 = vec3(vColor.x,vColor.x,1.0-vColor.y);
    color = col*col2;
		alpha = vColor.x;
  }
	if(inverted != 0){
		color = vec3(1.0) - color;
	}
  gl_FragColor = vec4(color, alpha);
  
}`, ne = {
  vs: Ee,
  fs: Pe
};
function Z(d, y = 1) {
  let e = d.slice();
  for (let t = 0; t < d.length; t++)
    if (t >= y && t < d.length - y) {
      const s = t - y, i = t + y;
      let a = 0;
      for (let l = s; l < i; l++)
        a += d[l];
      e[t] = a / (2 * y);
    }
  return e;
}
function Oe(d) {
  var y, e, t = d.length;
  if (t === 1)
    y = 0, e = d[0][1];
  else {
    for (var s = 0, i = 0, a = 0, l = 0, n, h, r, c = 0; c < t; c++)
      n = d[c], h = n[0], r = n[1], s += h, i += r, a += h * h, l += h * r;
    y = (t * l - s * i) / (t * a - s * s), e = i / t - y * s / t;
  }
  return {
    m: y,
    b: e
  };
}
function J(d, y) {
  const e = d.length, t = [];
  for (let n = 0; n < e; n++)
    t.push([d[n], y[n]]);
  const { m: s, b: i } = Oe(t);
  return { m: s, b: i, fx: (n) => s * n + i, fy: (n) => (n - i) / s };
}
function Ce(d, y) {
  let e = (360 - d) * (Math.PI / 180);
  return [y * (Math.PI / 180), e];
}
class Te {
  constructor(y) {
    R(this, "watchers", /* @__PURE__ */ new Set());
    this.v = y;
  }
  get value() {
    return this.v;
  }
  set value(y) {
    const e = this.v;
    this.v = y, this.watchers.forEach((t) => t(this.v, e));
  }
  watch(y) {
    return this.watchers.add(y), () => this.watchers.delete(y);
  }
  toJSON() {
    return JSON.stringify(this.v);
  }
  toString() {
    return String(this.v);
  }
}
function Fe(d, y) {
  return new Te(d);
}
function Me(d) {
  return Math.random() < d;
}
const k = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
)), { floor: P, random: je, abs: C, asin: Be } = Math, j = () => je() > 0.5;
function H(d) {
  let y = Math.abs(d[0]);
  for (let e = 1; e < d.length; e++)
    Math.abs(d[e]) > y && (y = Math.abs(d[e]));
  if (y !== 0)
    for (let e = 0; e < d.length; e++)
      d[e] /= y;
  return d;
}
w.BufferGeometry.prototype.computeBoundsTree = fe;
w.BufferGeometry.prototype.disposeBoundsTree = pe;
w.Mesh.prototype.raycast = de;
class ke {
  constructor(y) {
    this.id = y, this.data = [];
  }
}
const x = {
  name: "Ray Tracer",
  roomID: "",
  sourceIDs: [],
  surfaceIDs: [],
  receiverIDs: [],
  updateInterval: 5,
  reflectionOrder: 50,
  isRunning: !1,
  runningWithoutReceivers: !1,
  passes: 100,
  pointSize: 2,
  raysVisible: !0,
  pointsVisible: !0,
  invertedDrawStyle: !1,
  paths: {},
  plotStyle: {
    mode: "lines"
  }
};
class Ve extends ue {
  constructor(e) {
    super(e);
    R(this, "roomID");
    R(this, "sourceIDs");
    R(this, "surfaceIDs");
    R(this, "receiverIDs");
    R(this, "updateInterval");
    R(this, "reflectionOrder");
    R(this, "raycaster");
    R(this, "intersections");
    R(this, "_isRunning");
    R(this, "intervals");
    R(this, "rayBufferGeometry");
    R(this, "rayBufferAttribute");
    R(this, "colorBufferAttribute");
    R(this, "rays");
    R(this, "rayPositionIndex");
    R(this, "maxrays");
    R(this, "intersectableObjects");
    R(this, "paths");
    R(this, "stats");
    R(this, "messageHandlerIDs");
    R(this, "statsUpdatePeriod");
    R(this, "lastTime");
    R(this, "_runningWithoutReceivers");
    R(this, "reflectionLossFrequencies");
    R(this, "allReceiverData");
    R(this, "hits");
    R(this, "_pointSize");
    R(this, "chartdata");
    R(this, "passes");
    R(this, "_raysVisible");
    R(this, "_pointsVisible");
    R(this, "_invertedDrawStyle");
    R(this, "__start_time");
    R(this, "__calc_time");
    R(this, "__num_checked_paths");
    R(this, "responseOverlayElement");
    R(this, "quickEstimateResults");
    R(this, "responseByIntensity");
    R(this, "defaultFrequencies");
    R(this, "plotData");
    R(this, "intensitySampleRate");
    R(this, "validRayCount");
    R(this, "plotStyle");
    R(this, "bvh");
    R(this, "observed_name");
    R(this, "hybrid");
    R(this, "transitionOrder");
    R(this, "update", () => {
    });
    R(this, "rayPositionIndexDidOverflow", !1);
    R(this, "ambisonicImpulseResponse");
    R(this, "ambisonicOrder", 1);
    R(this, "impulseResponse");
    R(this, "impulseResponsePlaying", !1);
    this.kind = "ray-tracer", e = { ...x, ...e }, this.uuid = e.uuid || this.uuid, this.name = e.name || x.name, this.observed_name = Fe(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = e.sourceIDs || x.sourceIDs, this.surfaceIDs = e.surfaceIDs || x.surfaceIDs, this.roomID = e.roomID || x.roomID, this.receiverIDs = e.receiverIDs || x.receiverIDs, this.updateInterval = e.updateInterval || x.updateInterval, this.reflectionOrder = e.reflectionOrder || x.reflectionOrder, this._isRunning = e.isRunning || x.isRunning, this._runningWithoutReceivers = e.runningWithoutReceivers || x.runningWithoutReceivers, this.reflectionLossFrequencies = [4e3], this.intervals = [], this.plotData = [], this.plotStyle = e.plotStyle || x.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = e.pointSize || x.pointSize, this.validRayCount = 0, this.defaultFrequencies = [1e3], this.intensitySampleRate = 256, this.quickEstimateResults = {};
    const t = typeof e.raysVisible == "boolean";
    this._raysVisible = t ? e.raysVisible : x.raysVisible;
    const s = typeof e.pointsVisible == "boolean";
    this._pointsVisible = s ? e.pointsVisible : x.pointsVisible;
    const i = typeof e.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = i ? e.invertedDrawStyle : x.invertedDrawStyle, this.passes = e.passes || x.passes, this.raycaster = new w.Raycaster(), this.rayBufferGeometry = new w.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new w.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(w.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new w.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(w.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.rays = new w.LineSegments(
      this.rayBufferGeometry,
      new w.LineBasicMaterial({
        fog: !1,
        color: 2631977,
        transparent: !0,
        opacity: 0.2,
        premultipliedAlpha: !0,
        blending: w.NormalBlending,
        depthFunc: w.AlwaysDepth,
        name: "raytracer-rays-material"
        // depthTest: false
      })
    ), this.rays.renderOrder = -0.5, this.rays.frustumCulled = !1, _.scene.add(this.rays);
    var a = new w.ShaderMaterial({
      fog: !1,
      vertexShader: ne.vs,
      fragmentShader: ne.fs,
      transparent: !0,
      premultipliedAlpha: !0,
      uniforms: {
        drawStyle: {
          value: 0
          /* ENERGY */
        },
        inverted: { value: 0 },
        pointScale: { value: this._pointSize }
      },
      blending: w.NormalBlending,
      name: "raytracer-points-material"
    });
    this.hits = new w.Points(this.rayBufferGeometry, a), this.hits.frustumCulled = !1, _.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
      value: !0,
      writable: !0
    }), this.intersections = [], this.findIDs(), this.intersectableObjects = [], this.paths = e.paths || x.paths, this.stats = {
      numRaysShot: {
        name: "# of rays shot",
        value: 0
      },
      numValidRayPaths: {
        name: "# of valid rays",
        value: 0
      }
    }, _.overlays.global.addCell("Valid Rays", this.validRayCount, {
      id: this.uuid + "-valid-ray-count",
      hidden: !0,
      formatter: (l) => String(l)
    }), this.messageHandlerIDs = [], M.postMessage("STATS_SETUP", this.stats), this.messageHandlerIDs.push(
      M.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (l, ...n) => {
        console.log(n && n[0] && n[0] instanceof Array && n[1] && n[1] === this.uuid), n && n[0] && n[0] instanceof Array && n[1] && n[1] === this.uuid && (this.sourceIDs = n[0].map((h) => h.id));
      })
    ), this.messageHandlerIDs.push(
      M.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (l, ...n) => {
        n && n[0] && n[0] instanceof Array && n[1] && n[1] === this.uuid && (this.receiverIDs = n[0].map((h) => h.id));
      })
    ), this.messageHandlerIDs.push(
      M.addMessageHandler("SHOULD_REMOVE_CONTAINER", (l, ...n) => {
        const h = n[0];
        h && (console.log(h), this.sourceIDs.includes(h) ? this.sourceIDs = this.sourceIDs.filter((r) => r != h) : this.receiverIDs.includes(h) && (this.receiverIDs = this.receiverIDs.filter((r) => r != h)));
      })
    ), this.step = this.step.bind(this), this.calculateImpulseResponse = this.calculateImpulseResponse.bind(this);
  }
  save() {
    const {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: i,
      roomID: a,
      sourceIDs: l,
      surfaceIDs: n,
      receiverIDs: h,
      updateInterval: r,
      passes: c,
      pointSize: o,
      reflectionOrder: p,
      runningWithoutReceivers: f,
      raysVisible: g,
      pointsVisible: u,
      invertedDrawStyle: m,
      plotStyle: v,
      paths: D
    } = this;
    return {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: i,
      roomID: a,
      sourceIDs: l,
      surfaceIDs: n,
      receiverIDs: h,
      updateInterval: r,
      passes: c,
      pointSize: o,
      reflectionOrder: p,
      runningWithoutReceivers: f,
      raysVisible: g,
      pointsVisible: u,
      invertedDrawStyle: m,
      plotStyle: v,
      paths: D
    };
  }
  removeMessageHandlers() {
    this.messageHandlerIDs.forEach((e) => {
      M.removeMessageHandler(e[0], e[1]);
    });
  }
  dispose() {
    this.removeMessageHandlers(), Object.keys(window.vars).forEach((e) => {
      window.vars[e].uuid === this.uuid && delete window.vars[e];
    }), _.scene.remove(this.rays), _.scene.remove(this.hits);
  }
  addSource(e) {
    S.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
  }
  addReceiver(e) {
    S.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
  }
  mapIntersectableObjects() {
    const e = [];
    this.room.surfaces.traverse((t) => {
      t.kind && t.kind === "surface" && e.push(t.mesh);
    }), this.runningWithoutReceivers ? this.intersectableObjects = e : this.intersectableObjects = e.concat(this.receivers);
  }
  findIDs() {
    this.sourceIDs = [], this.receiverIDs = [], this.surfaceIDs = [];
    for (const e in S.getState().containers)
      S.getState().containers[e].kind === "room" ? this.roomID = e : S.getState().containers[e].kind === "source" ? this.sourceIDs.push(e) : S.getState().containers[e].kind === "receiver" ? this.receiverIDs.push(e) : S.getState().containers[e].kind === "surface" && this.surfaceIDs.push(e);
    this.mapIntersectableObjects();
  }
  setDrawStyle(e) {
    this.hits.material.uniforms.drawStyle.value = e, this.hits.material.needsUpdate = !0, _.needsToRender = !0;
  }
  setPointScale(e) {
    this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0, _.needsToRender = !0;
  }
  incrementRayPositionIndex() {
    return this.rayPositionIndex < this.maxrays ? this.rayPositionIndex++ : (this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !0, this.rayPositionIndex);
  }
  appendRay(e, t, s = 1, i = 1) {
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, i), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, i), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex), this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
  }
  inFrontOf(e, t) {
    const s = e.getPlane(new w.Plane()), i = new w.Vector4(s.normal.x, s.normal.y, s.normal.z, s.constant), a = new w.Vector4(t.a.x, t.a.y, t.a.z, 1), l = new w.Vector4(t.b.x, t.b.y, t.b.z, 1), n = new w.Vector4(t.c.x, t.c.y, t.c.z, 1);
    return i.dot(a) > 0 || i.dot(l) > 0 || i.dot(n) > 0;
  }
  traceRay(e, t, s, i, a, l, n, h = 1, r = [], c = 4e3) {
    var p;
    t = t.normalize(), this.raycaster.ray.origin = e, this.raycaster.ray.direction = t;
    const o = this.raycaster.intersectObjects(this.intersectableObjects, !0);
    if (o.length > 0) {
      if (((p = o[0].object.userData) == null ? void 0 : p.kind) === "receiver") {
        const f = o[0].face && t.clone().multiplyScalar(-1).angleTo(o[0].face.normal);
        r.push({
          object: o[0].object.parent.uuid,
          angle: f,
          distance: o[0].distance,
          faceNormal: [
            o[0].face.normal.x,
            o[0].face.normal.y,
            o[0].face.normal.z
          ],
          faceMaterialIndex: o[0].face.materialIndex,
          faceIndex: o[0].faceIndex,
          point: [o[0].point.x, o[0].point.y, o[0].point.z],
          energy: i
        });
        const g = t.clone().normalize().negate(), u = [g.x, g.y, g.z];
        return {
          chain: r,
          chainLength: r.length,
          intersectedReceiver: !0,
          energy: i,
          source: a,
          initialPhi: l,
          initialTheta: n,
          arrivalDirection: u
        };
      } else {
        const f = o[0].face && t.clone().multiplyScalar(-1).angleTo(o[0].face.normal);
        r.push({
          object: o[0].object.parent.uuid,
          angle: f,
          distance: o[0].distance,
          faceNormal: [
            o[0].face.normal.x,
            o[0].face.normal.y,
            o[0].face.normal.z
          ],
          faceMaterialIndex: o[0].face.materialIndex,
          faceIndex: o[0].faceIndex,
          point: [o[0].point.x, o[0].point.y, o[0].point.z],
          energy: i
        }), o[0].object.parent instanceof X && (o[0].object.parent.numHits += 1);
        const g = o[0].face && o[0].face.normal.normalize();
        let u = g && o[0].face && t.clone().sub(g.clone().multiplyScalar(t.dot(g.clone())).multiplyScalar(2));
        const m = o[0].object.parent._scatteringCoefficient;
        Me(m) && (u = new w.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), g.dot(u) < 0 && u.multiplyScalar(-1));
        const v = i * C(o[0].object.parent.reflectionFunction(c, f));
        if (u && g && v > 1 / 2 ** 16 && h < s + 1)
          return this.traceRay(
            o[0].point.clone().addScaledVector(g.clone(), 0.01),
            u,
            s,
            v,
            a,
            l,
            n,
            h + 1,
            r,
            4e3
          );
      }
      return { chain: r, chainLength: r.length, source: a, intersectedReceiver: !1 };
    }
  }
  startQuickEstimate(e = this.defaultFrequencies, t = 1e3) {
    const s = this.runningWithoutReceivers;
    this.runningWithoutReceivers = !0;
    let i = 0;
    this.quickEstimateResults = {}, this.sourceIDs.forEach((a) => {
      this.quickEstimateResults[a] = [];
    }), this.intervals.push(
      //@ts-ignore
      setInterval(() => {
        for (let a = 0; a < this.passes; a++, i++)
          for (let l = 0; l < this.sourceIDs.length; l++) {
            const n = this.sourceIDs[l], h = S.getState().containers[n];
            this.quickEstimateResults[n].push(this.quickEstimateStep(h, e, t));
          }
        i >= t ? (this.intervals.forEach((a) => window.clearInterval(a)), this.runningWithoutReceivers = s, console.log(this.quickEstimateResults)) : console.log((i / t * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(e, t, s) {
    const i = te(20), a = Array(t.length).fill(0);
    let l = e.position.clone(), n = new w.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), h = 0;
    const r = Array(t.length).fill(e.initialIntensity);
    let c = 0;
    const o = 1e3;
    let p = !1, f = 0;
    U(t);
    let g = {};
    for (; !p && c < o; ) {
      this.raycaster.ray.set(l, n);
      const u = this.raycaster.intersectObjects(this.intersectableObjects, !0);
      if (u.length > 0) {
        h = n.clone().multiplyScalar(-1).angleTo(u[0].face.normal), f += u[0].distance;
        const m = u[0].object.parent;
        for (let D = 0; D < t.length; D++) {
          const b = t[D];
          let I = 1;
          m.kind === "surface" && (I = m.reflectionFunction(b, h)), r[D] *= I;
          const A = e.initialIntensity / r[D] > 1e6;
          A && (a[D] = f / i), p = p || A;
        }
        u[0].object.parent instanceof X && (u[0].object.parent.numHits += 1);
        const v = u[0].face.normal.normalize();
        n.sub(v.clone().multiplyScalar(n.dot(v)).multiplyScalar(2)).normalize(), l.copy(u[0].point), g = u[0];
      }
      c += 1;
    }
    return this.stats.numRaysShot.value++, {
      distance: f,
      rt60s: a,
      angle: h,
      direction: n,
      lastIntersection: g
    };
  }
  startAllMonteCarlo() {
    this.intervals.push(
      setInterval(() => {
        for (let e = 0; e < this.passes; e++)
          this.step();
        _.needsToRender = !0;
      }, this.updateInterval)
    );
  }
  step() {
    for (let e = 0; e < this.sourceIDs.length; e++) {
      this.__num_checked_paths += 1;
      const t = Math.random() * S.getState().containers[this.sourceIDs[e]].theta, s = Math.random() * S.getState().containers[this.sourceIDs[e]].phi, i = S.getState().containers[this.sourceIDs[e]].position, a = S.getState().containers[this.sourceIDs[e]].rotation;
      let l = Ce(s, t);
      const n = new w.Vector3().setFromSphericalCoords(1, l[0], l[1]);
      n.applyEuler(a), S.getState().containers[this.sourceIDs[e]].directivityHandler;
      const r = this.traceRay(i, n, this.reflectionOrder, 1, this.sourceIDs[e], s, t);
      if (r) {
        if (this._runningWithoutReceivers) {
          this.appendRay(
            [i.x, i.y, i.z],
            r.chain[0].point,
            r.chain[0].energy || 1,
            r.chain[0].angle
          );
          for (let o = 1; o < r.chain.length; o++)
            this.appendRay(
              // the previous point
              r.chain[o - 1].point,
              // the current point
              r.chain[o].point,
              // the energy content displayed as a color + alpha
              r.chain[o].energy || 1,
              r.chain[o].angle
            );
          const c = r.chain[r.chain.length - 1].object;
          this.paths[c] ? this.paths[c].push(r) : this.paths[c] = [r], S.getState().containers[this.sourceIDs[e]].numRays += 1;
        } else if (r.intersectedReceiver) {
          this.appendRay(
            [i.x, i.y, i.z],
            r.chain[0].point,
            r.chain[0].energy || 1,
            r.chain[0].angle
          );
          for (let o = 1; o < r.chain.length; o++)
            this.appendRay(
              // the previous point
              r.chain[o - 1].point,
              // the current point
              r.chain[o].point,
              // the energy content displayed as a color + alpha
              r.chain[o].energy || 1,
              r.chain[o].angle
            );
          this.stats.numValidRayPaths.value++, this.validRayCount += 1, _.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
          const c = r.chain[r.chain.length - 1].object;
          this.paths[c] ? this.paths[c].push(r) : this.paths[c] = [r], S.getState().containers[this.sourceIDs[e]].numRays += 1;
        }
      }
      this.stats.numRaysShot.value++;
    }
  }
  start() {
    this.mapIntersectableObjects(), this.__start_time = Date.now(), this.__num_checked_paths = 0, this.startAllMonteCarlo();
  }
  stop() {
    this.__calc_time = Date.now() - this.__start_time, this.intervals.forEach((e) => {
      window.clearInterval(e);
    }), this.intervals = [], Object.keys(this.paths).forEach((e) => {
      const t = this.__calc_time / 1e3, s = this.paths[e].length, i = s / t, a = this.__num_checked_paths, l = a / t;
      console.log({
        calc_time: t,
        num_valid_rays: s,
        valid_ray_rate: i,
        num_checks: a,
        check_rate: l
      }), this.paths[e].forEach((n) => {
        n.time = 0, n.totalLength = 0;
        for (let h = 0; h < n.chain.length; h++)
          n.totalLength += n.chain[h].distance, n.time += n.chain[h].distance / 343.2;
      });
    }), this.mapIntersectableObjects(), this.reportImpulseResponse();
  }
  async reportImpulseResponse() {
    var i, a;
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = S.getState().containers, t = E.sampleRate, s = [];
    for (const l of this.sourceIDs)
      for (const n of this.receiverIDs) {
        if (!this.paths[n] || this.paths[n].length === 0) continue;
        const h = this.paths[n].filter((r) => r.source === l);
        h.length > 0 && s.push({ sourceId: l, receiverId: n, paths: h });
      }
    if (s.length !== 0) {
      F("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let l = 0; l < s.length; l++) {
        const { sourceId: n, receiverId: h, paths: r } = s[l], c = ((i = e[n]) == null ? void 0 : i.name) || "Source", o = ((a = e[h]) == null ? void 0 : a.name) || "Receiver", p = Math.round(l / s.length * 100);
        F("UPDATE_PROGRESS", {
          progress: p,
          message: `Calculating IR: ${c} → ${o}`
        });
        try {
          const { normalizedSignal: f } = await this.calculateImpulseResponseForPair(n, h, r);
          n === this.sourceIDs[0] && h === this.receiverIDs[0] && this.calculateImpulseResponse().then((I) => {
            this.impulseResponse = I;
          }).catch(console.error);
          const u = Math.max(1, Math.floor(f.length / 2e3)), m = [];
          for (let I = 0; I < f.length; I += u)
            m.push({
              time: I / t,
              amplitude: f[I]
            });
          const v = `${this.uuid}-ir-${n}-${h}`, D = q.getState().results[v], b = {
            kind: ee.ImpulseResponse,
            name: `IR: ${c} → ${o}`,
            uuid: v,
            from: this.uuid,
            info: {
              sampleRate: t,
              sourceName: c,
              receiverName: o,
              sourceId: n,
              receiverId: h
            },
            data: m
          };
          D ? F("UPDATE_RESULT", { uuid: v, result: b }) : F("ADD_RESULT", b);
        } catch (f) {
          console.error(`Failed to calculate impulse response for ${n} -> ${h}:`, f);
        }
      }
      F("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(e, t, s, i = 100, a = B(63, 16e3), l = E.sampleRate) {
    if (s.length === 0) throw Error("No rays have been traced for this pair");
    let n = s.sort((f, g) => f.time - g.time);
    const h = n[n.length - 1].time + 0.05, r = Array(a.length).fill(i), c = P(l * h) * 2;
    let o = [];
    for (let f = 0; f < a.length; f++)
      o.push(new Float32Array(c));
    for (let f = 0; f < n.length; f++) {
      const g = j() ? 1 : -1, u = n[f].time, m = this.arrivalPressure(r, a, n[f]).map((D) => D * g), v = P(u * l);
      for (let D = 0; D < a.length; D++)
        o[D][v] += m[D];
    }
    const p = k();
    return new Promise((f, g) => {
      p.postMessage({ samples: o }), p.onmessage = (u) => {
        const m = u.data.samples, v = new Float32Array(m[0].length >> 1);
        for (let b = 0; b < m.length; b++)
          for (let I = 0; I < v.length; I++)
            v[I] += m[b][I];
        const D = H(v.slice());
        p.terminate(), f({ signal: v, normalizedSignal: D });
      }, p.onerror = (u) => {
        p.terminate(), g(u);
      };
    });
  }
  async calculateImpulseResponseForDisplay(e = 100, t = B(63, 16e3), s = E.sampleRate) {
    if (this.receiverIDs.length == 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length == 0) throw Error("No sources have been assigned to the raytracer");
    if (this.paths[this.receiverIDs[0]].length == 0) throw Error("No rays have been traced yet");
    let i = this.paths[this.receiverIDs[0]].sort((c, o) => c.time - o.time);
    const a = i[i.length - 1].time + 0.05, l = Array(t.length).fill(e), n = P(s * a) * 2;
    let h = [];
    for (let c = 0; c < t.length; c++)
      h.push(new Float32Array(n));
    for (let c = 0; c < i.length; c++) {
      const o = j() ? 1 : -1, p = i[c].time, f = this.arrivalPressure(l, t, i[c]).map((u) => u * o), g = P(p * s);
      for (let u = 0; u < t.length; u++)
        h[u][g] += f[u];
    }
    const r = k();
    return new Promise((c, o) => {
      r.postMessage({ samples: h }), r.onmessage = (p) => {
        const f = p.data.samples, g = new Float32Array(f[0].length >> 1);
        for (let m = 0; m < f.length; m++)
          for (let v = 0; v < g.length; v++)
            g[v] += f[m][v];
        const u = H(g.slice());
        r.terminate(), c({ signal: g, normalizedSignal: u });
      }, r.onerror = (p) => {
        r.terminate(), o(p);
      };
    });
  }
  clearRays() {
    if (this.room)
      for (let e = 0; e < this.room.allSurfaces.length; e++)
        this.room.allSurfaces[e].resetHits();
    this.validRayCount = 0, _.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount), this.rayBufferGeometry.setDrawRange(0, 1), this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !1, this.stats.numRaysShot.value = 0, this.stats.numValidRayPaths.value = 0, M.postMessage("STATS_UPDATE", this.stats), this.sourceIDs.forEach((e) => {
      S.getState().containers[e].numRays = 0;
    }), this.paths = {}, this.mapIntersectableObjects(), _.needsToRender = !0, this.impulseResponse = void 0, this.clearImpulseResponseResults();
  }
  clearImpulseResponseResults() {
    const e = q.getState().results;
    Object.keys(e).forEach((t) => {
      const s = e[t];
      s.from === this.uuid && s.kind === ee.ImpulseResponse && F("REMOVE_RESULT", t);
    });
  }
  calculateWithDiffuse(e = this.reflectionLossFrequencies) {
    this.allReceiverData = [];
    const t = Object.keys(this.paths), s = S.getState().containers[this.receiverIDs[0]].scale.x, i = S.getState().containers[this.receiverIDs[0]].position;
    t.forEach((l) => {
      const n = new ke(l);
      this.paths[l].forEach((h) => {
        const r = {
          time: 0,
          energy: []
        };
        let c = !1;
        h.chain.forEach((o) => {
          const p = this.receiverIDs.includes(o.object) ? S.getState().containers[o.object] : this.room.surfaceMap[o.object];
          if (p && p.kind) {
            if (p.kind === "receiver")
              c = !0;
            else if (p.kind === "surface") {
              const f = p, g = {
                time: o.time_rec,
                energy: []
              };
              e.forEach((u, m) => {
                const v = C(f.reflectionFunction(u, o.angle_in));
                if (!r.energy[m])
                  r.energy[m] = {
                    frequency: u,
                    value: v
                  };
                else {
                  r.energy[m].value *= v, r.time = o.total_time;
                  const D = new w.Vector3(
                    i.x - o.point[0],
                    i.y - o.point[1],
                    i.z - o.point[2]
                  ), b = new w.Vector3().fromArray(o.faceNormal).angleTo(D);
                  g.energy[m] = {
                    frequency: u,
                    value: xe(
                      r.energy[m].value,
                      f.absorptionFunction(u),
                      0.1,
                      Be(s / D.length()),
                      b
                    )
                  };
                }
              }), g.energy.length > 0 && n.data.push(g);
            }
          }
        }), c && n.data.push(r);
      }), n.data = _e(n.data).asc((h) => h.time), this.allReceiverData.push(n);
    });
    const a = this.allReceiverData.map((l) => e.map((n) => ({
      label: n.toString(),
      x: l.data.map((h) => h.time),
      y: l.data.map((h) => h.energy.filter((r) => r.frequency == n)[0].value)
    })));
    return M.postMessage("UPDATE_CHART_DATA", a && a[0]), this.allReceiverData;
  }
  reflectionLossFunction(e, t, s) {
    const i = t.chain.slice(0, -1);
    if (i && i.length > 0) {
      let a = 1;
      for (let l = 0; l < i.length; l++) {
        const n = i[l], h = e.surfaceMap[n.object], r = n.angle || 0;
        a = a * C(h.reflectionFunction(s, r));
      }
      return a;
    }
    return 1;
  }
  //TODO change this name to something more appropriate
  calculateReflectionLoss(e = this.reflectionLossFrequencies) {
    this.allReceiverData = [];
    const t = (a, l) => ({ label: a, data: l }), s = [];
    if (e)
      for (let a = 0; a < e.length; a++)
        s.push(t(e[a].toString(), []));
    const i = Object.keys(this.paths);
    for (let a = 0; a < i.length; a++) {
      this.allReceiverData.push({
        id: i[a],
        data: []
      });
      for (let l = 0; l < this.paths[i[a]].length; l++) {
        const n = this.paths[i[a]][l];
        let h;
        e ? (h = e.map((r) => ({
          frequency: r,
          value: this.reflectionLossFunction(this.room, n, r)
        })), e.forEach((r, c) => {
          s[c].data.push([n.time, this.reflectionLossFunction(this.room, n, r)]);
        })) : h = (r) => this.reflectionLossFunction(this.room, n, r), this.allReceiverData[this.allReceiverData.length - 1].data.push({
          time: n.time,
          energy: h
        });
      }
      this.allReceiverData[this.allReceiverData.length - 1].data = this.allReceiverData[this.allReceiverData.length - 1].data.sort((l, n) => l.time - n.time);
    }
    for (let a = 0; a < s.length; a++)
      s[a].data = s[a].data.sort((l, n) => l[0] - n[0]), s[a].x = s[a].data.map((l) => l[0]), s[a].y = s[a].data.map((l) => l[1]);
    return this.chartdata = s, [this.allReceiverData, s];
  }
  // downloadImpulseResponse(index: number = 0, sample_rate: number = 44100) {
  //   const data = this.saveImpulseResponse(index, sample_rate);
  //   if (data) {
  //     const blob = new Blob([data], {
  //       type: "text/plain;charset=utf-8"
  //     });
  //     FileSaver.saveAs(blob, `ir${index}-fs${sample_rate}hz-t${Date.now()}.txt`);
  //   } else return;
  // }
  resampleResponse(e = 0, t = E.sampleRate) {
    if (this.allReceiverData && this.allReceiverData[e]) {
      const s = this.allReceiverData[e].data, i = s[s.length - 1].time, a = P(t * i), l = [];
      for (let n = 0, h = 0; n < a; n++) {
        let r = n / a * i;
        if (s[h] && s[h].time) {
          let c = s[h].time;
          if (c > r) {
            l.push([r].concat(Array(s[h].energy.length).fill(0)));
            continue;
          }
          if (c <= r) {
            let o = s[h].energy.map((f) => 0), p = 0;
            for (; c <= r; )
              c = s[h].time, o.forEach((f, g, u) => u[g] += s[h].energy[g].value), h++, p++;
            l.push([r, ...o.map((f) => f / p)]);
            continue;
          }
        }
      }
      return l;
    } else
      console.warn("no data yet");
  }
  saveImpulseResponse(e = 0, t = 44100) {
    const s = this.resampleResponse(e, t);
    if (s)
      return s.map((i) => i.join(",")).join(`
`);
  }
  getReceiverIntersectionPoints(e) {
    return this.paths && this.paths[e] && this.paths[e].length > 0 ? this.paths[e].map(
      (t) => new w.Vector3().fromArray(t.chain[t.chain.length - 1].point)
    ) : [];
  }
  calculateResponseByIntensity(e = this.defaultFrequencies, t = 20) {
    const s = this.indexedPaths, i = te(t), a = U(e);
    this.responseByIntensity = {};
    for (const l in s) {
      this.responseByIntensity[l] = {};
      for (const n in s[l]) {
        this.responseByIntensity[l][n] = {
          freqs: e,
          response: []
        }, z(N(S.getState().containers[n].initialSPL));
        for (let h = 0; h < s[l][n].length; h++) {
          let r = 0, c = [], o = s[l][n][h].initialPhi, p = s[l][n][h].initialTheta, f = S.getState().containers[n].directivityHandler;
          for (let u = 0; u < e.length; u++)
            c[u] = z(f.getPressureAtPosition(0, e[u], o, p));
          for (let u = 0; u < s[l][n][h].chain.length; u++) {
            const { angle: m, distance: v } = s[l][n][h].chain[u];
            r += v / i;
            const D = s[l][n][h].chain[u].object, b = S.getState().containers[D] || this.room.surfaceMap[D] || null;
            for (let I = 0; I < e.length; I++) {
              const A = e[I];
              let O = 1;
              b && b.kind === "surface" && (O = b.reflectionFunction(A, m)), c.push(z(
                N(W($(c[I] * O)) - a[I] * v)
              ));
            }
          }
          const g = W($(c));
          this.responseByIntensity[l][n].response.push({
            time: r,
            level: g,
            bounces: s[l][n][h].chain.length
          });
        }
        this.responseByIntensity[l][n].response.sort((h, r) => h.time - r.time);
      }
    }
    return this.resampleResponseByIntensity();
  }
  resampleResponseByIntensity(e = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      for (const t in this.responseByIntensity)
        for (const s in this.responseByIntensity[t]) {
          const { response: i, freqs: a } = this.responseByIntensity[t][s], l = i[i.length - 1].time, n = P(e * l);
          this.responseByIntensity[t][s].resampledResponse = Array(a.length).fill(0).map((p) => new Float32Array(n)), this.responseByIntensity[t][s].sampleRate = e;
          let h = 0, r = [], c = a.map((p) => 0), o = !1;
          for (let p = 0, f = 0; p < n; p++) {
            let g = p / n * l;
            if (i[f] && i[f].time) {
              let u = i[f].time;
              if (u > g) {
                for (let m = 0; m < a.length; m++)
                  this.responseByIntensity[t][s].resampledResponse[m][h] = 0;
                o && r.push(h), h++;
                continue;
              }
              if (u <= g) {
                let m = i[f].level.map((v) => 0);
                for (; u <= g; ) {
                  u = i[f].time;
                  for (let v = 0; v < a.length; v++)
                    m[v] = me([m[v], i[f].level[v]]);
                  f++;
                }
                for (let v = 0; v < a.length; v++) {
                  if (this.responseByIntensity[t][s].resampledResponse[v][h] = m[v], r.length > 0) {
                    const D = c[v], b = m[v];
                    for (let I = 0; I < r.length; I++) {
                      const A = ye(D, b, (I + 1) / (r.length + 1));
                      this.responseByIntensity[t][s].resampledResponse[v][r[I]] = A;
                    }
                  }
                  c[v] = m[v];
                }
                r.length > 0 && (r = []), o = !0, h++;
                continue;
              }
            }
          }
          this.calculateT20(t, s), this.calculateT30(t, s), this.calculateT60(t, s);
        }
      return this.responseByIntensity;
    } else
      console.warn("no data yet");
  }
  calculateT30(e, t) {
    const s = this.receiverIDs, i = this.sourceIDs;
    if (s.length > 0 && i.length > 0) {
      const a = e || s[0], l = t || i[0], n = this.responseByIntensity[a][l].resampledResponse, h = this.responseByIntensity[a][l].sampleRate;
      if (this.responseByIntensity[a][l].freqs, n && h) {
        const r = new Float32Array(n[0].length);
        for (let c = 0; c < n[0].length; c++)
          r[c] = c / h;
        this.responseByIntensity[a][l].t30 = n.map((c) => {
          let o = 0, p = c[o];
          for (; p === 0; )
            p = c[o++];
          for (let m = o; m >= 0; m--)
            c[m] = p;
          const f = p - 30, u = Z(c, 2).filter((m) => m >= f).length;
          return J(r.slice(0, u), c.slice(0, u));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT20(e, t) {
    const s = this.receiverIDs, i = this.sourceIDs;
    if (s.length > 0 && i.length > 0) {
      const a = e || s[0], l = t || i[0], n = this.responseByIntensity[a][l].resampledResponse, h = this.responseByIntensity[a][l].sampleRate;
      if (this.responseByIntensity[a][l].freqs, n && h) {
        const r = new Float32Array(n[0].length);
        for (let c = 0; c < n[0].length; c++)
          r[c] = c / h;
        this.responseByIntensity[a][l].t20 = n.map((c) => {
          let o = 0, p = c[o];
          for (; p === 0; )
            p = c[o++];
          for (let m = o; m >= 0; m--)
            c[m] = p;
          const f = p - 20, u = Z(c, 2).filter((m) => m >= f).length;
          return J(r.slice(0, u), c.slice(0, u));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT60(e, t) {
    const s = this.receiverIDs, i = this.sourceIDs;
    if (s.length > 0 && i.length > 0) {
      const a = e || s[0], l = t || i[0], n = this.responseByIntensity[a][l].resampledResponse, h = this.responseByIntensity[a][l].sampleRate;
      if (this.responseByIntensity[a][l].freqs, n && h) {
        const r = new Float32Array(n[0].length);
        for (let c = 0; c < n[0].length; c++)
          r[c] = c / h;
        this.responseByIntensity[a][l].t60 = n.map((c) => {
          let o = 0, p = c[o];
          for (; p === 0; )
            p = c[o++];
          for (let m = o; m >= 0; m--)
            c[m] = p;
          const f = p - 60, u = Z(c, 2).filter((m) => m >= f).length;
          return J(r.slice(0, u), c.slice(0, u));
        });
      }
    }
    return this.responseByIntensity;
  }
  computeImageSources(e, t, s) {
    for (const i of this.room.allSurfaces)
      i.uuid, t.uuid;
  }
  onParameterConfigFocus() {
    console.log("focus"), console.log(_.overlays.global.cells), _.overlays.global.showCell(this.uuid + "-valid-ray-count");
  }
  onParameterConfigBlur() {
    console.log("blur"), _.overlays.global.hideCell(this.uuid + "-valid-ray-count");
  }
  pathsToLinearBuffer() {
    const e = (i) => i.split("").map((a) => a.charCodeAt(0)), t = (i) => i.map((a) => [
      ...e(a.object),
      // 36x8
      a.angle,
      // 1x32
      a.distance,
      // 1x32
      a.energy,
      // 1x32
      a.faceIndex,
      // 1x8
      a.faceMaterialIndex,
      // 1x8
      ...a.faceNormal,
      // 3x32
      ...a.point
      // 3x32
    ]).flat();
    return new Float32Array(
      Object.keys(this.paths).map((i) => {
        const a = this.paths[i].map((l) => [
          ...e(l.source),
          l.chainLength,
          l.time,
          Number(l.intersectedReceiver),
          l.energy,
          ...t(l.chain)
        ]).flat();
        return [...e(i), a.length, ...a];
      }).flat()
    );
  }
  linearBufferToPaths(e) {
    const i = (r) => String.fromCharCode(...r), a = (r) => {
      let c = 0;
      const o = i(r.slice(c, c += 36)), p = r[c++], f = r[c++], g = r[c++], u = r[c++], m = r[c++], v = [r[c++], r[c++], r[c++]], D = [r[c++], r[c++], r[c++]];
      return {
        object: o,
        angle: p,
        distance: f,
        energy: g,
        faceIndex: u,
        faceMaterialIndex: m,
        faceNormal: v,
        point: D
      };
    }, l = (r) => {
      const c = [];
      let o = 0;
      for (; o < r.length; ) {
        i(r.slice(o, o += 36));
        const p = r[o++];
        r[o++], r[o++], r[o++];
        const f = [];
        for (let g = 0; g < p; g++)
          f.push(a(r.slice(o, o += 47)));
      }
      return c;
    };
    let n = 0;
    const h = {};
    for (; n < e.length; ) {
      const r = i(e.slice(n, n += 36)), c = e[n++], o = l(e.slice(n, n += c));
      h[r] = o;
    }
    return h;
  }
  arrivalPressure(e, t, s) {
    const i = z(N(e));
    s.chain.slice(0, -1).forEach((n) => {
      const h = S.getState().containers[n.object];
      i.forEach((r, c) => {
        let o;
        t[c] === 16e3 ? o = 1 - h.absorptionFunction(t[8e3]) : o = 1 - h.absorptionFunction(t[c]), i[c] = r * o;
      });
    });
    const a = W($(i)), l = U(t);
    return t.forEach((n, h) => a[h] -= l[h] * s.totalLength), N(a);
  }
  async calculateImpulseResponse(e = 100, t = B(63, 16e3), s = E.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let i = this.paths[this.receiverIDs[0]].sort((c, o) => c.time - o.time);
    const a = i[i.length - 1].time + 0.05, l = Array(t.length).fill(e), n = P(s * a) * 2;
    let h = [];
    for (let c = 0; c < t.length; c++)
      h.push(new Float32Array(n));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let f = 0; f < i.length; f++)
        i[f].chainLength - 1 <= this.transitionOrder && i.splice(f, 1);
      let c = {
        name: "HybridHelperIS",
        roomID: this.roomID,
        sourceIDs: this.sourceIDs,
        surfaceIDs: this.surfaceIDs,
        receiverIDs: this.receiverIDs,
        maxReflectionOrder: this.transitionOrder,
        imageSourcesVisible: !1,
        rayPathsVisible: !1,
        plotOrders: [0, 1, 2],
        // all paths
        frequencies: [125, 250, 500, 1e3, 2e3, 4e3, 8e3]
      }, p = new we(c, !0).returnSortedPathsForHybrid(343, l, t);
      for (let f = 0; f < p.length; f++) {
        const g = j() ? 1 : -1, u = p[f].time, m = P(u * s);
        for (let v = 0; v < t.length; v++)
          h[v][m] += p[f].pressure[v] * g;
      }
    }
    for (let c = 0; c < i.length; c++) {
      const o = j() ? 1 : -1, p = i[c].time, f = this.arrivalPressure(l, t, i[c]).map((u) => u * o), g = P(p * s);
      for (let u = 0; u < t.length; u++)
        h[u][g] += f[u];
    }
    const r = k();
    return new Promise((c, o) => {
      r.postMessage({ samples: h }), r.onmessage = (p) => {
        const f = p.data.samples, g = new Float32Array(f[0].length >> 1);
        let u = 0;
        for (let b = 0; b < f.length; b++)
          for (let I = 0; I < g.length; I++)
            g[I] += f[b][I], C(g[I]) > u && (u = C(g[I]));
        const m = H(g), v = E.createOfflineContext(1, g.length, s), D = E.createBufferSource(m, v);
        D.connect(v.destination), D.start(), E.renderContextAsync(v).then((b) => c(b)).catch(o).finally(() => r.terminate());
      };
    });
  }
  /**
   * Calculate an ambisonic impulse response from the traced ray paths.
   * Each reflection is encoded based on its arrival direction at the receiver.
   *
   * @param order - Ambisonic order (1 = first order with 4 channels, 2 = 9 channels, etc.)
   * @param initialSPL - Initial sound pressure level in dB
   * @param frequencies - Octave band center frequencies for filtering
   * @param sampleRate - Sample rate for the output
   * @returns Promise resolving to an AudioBuffer with ambisonic channels
   */
  async calculateAmbisonicImpulseResponse(e = 1, t = 100, s = B(63, 16e3), i = E.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");
    const a = this.paths[this.receiverIDs[0]].sort((p, f) => p.time - f.time);
    if (a.length === 0) throw Error("No valid ray paths found");
    const l = a[a.length - 1].time + 0.05;
    if (l <= 0) throw Error("Invalid impulse response duration");
    const n = Array(s.length).fill(t), h = P(i * l) * 2;
    if (h < 2) throw Error("Impulse response too short to process");
    const r = Se(e), c = [];
    for (let p = 0; p < s.length; p++) {
      c.push([]);
      for (let f = 0; f < r; f++)
        c[p].push(new Float32Array(h));
    }
    for (let p = 0; p < a.length; p++) {
      const f = a[p], g = j() ? 1 : -1, u = f.time, m = this.arrivalPressure(n, s, f).map((I) => I * g), v = P(u * i);
      if (v >= h) continue;
      const D = f.arrivalDirection || [0, 0, 1], b = new Float32Array(1);
      for (let I = 0; I < s.length; I++) {
        b[0] = m[I];
        const A = be(b, D[0], D[1], D[2], e, "threejs");
        for (let O = 0; O < r; O++)
          c[I][O][v] += A[O][0];
      }
    }
    const o = k();
    return new Promise((p, f) => {
      const g = async (u) => new Promise((m) => {
        const v = [];
        for (let b = 0; b < s.length; b++)
          v.push(c[b][u]);
        const D = k();
        D.postMessage({ samples: v }), D.onmessage = (b) => {
          const I = b.data.samples, A = new Float32Array(I[0].length >> 1);
          for (let O = 0; O < I.length; O++)
            for (let L = 0; L < A.length; L++)
              A[L] += I[O][L];
          D.terminate(), m(A);
        };
      });
      Promise.all(
        Array.from({ length: r }, (u, m) => g(m))
      ).then((u) => {
        let m = 0;
        for (const I of u)
          for (let A = 0; A < I.length; A++)
            C(I[A]) > m && (m = C(I[A]));
        if (m > 0)
          for (const I of u)
            for (let A = 0; A < I.length; A++)
              I[A] /= m;
        const v = u[0].length;
        if (v === 0) {
          o.terminate(), f(new Error("Filtered signal has zero length"));
          return;
        }
        const b = E.createOfflineContext(r, v, i).createBuffer(r, v, i);
        for (let I = 0; I < r; I++)
          b.copyToChannel(new Float32Array(u[I]), I);
        o.terminate(), p(b);
      }).catch(f);
    });
  }
  async playImpulseResponse() {
    if (!this.impulseResponse)
      try {
        this.impulseResponse = await this.calculateImpulseResponse();
      } catch (t) {
        throw t;
      }
    E.context.state === "suspended" && E.context.resume(), console.log(this.impulseResponse);
    const e = E.context.createBufferSource();
    e.buffer = this.impulseResponse, e.connect(E.context.destination), e.start(), F("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(E.context.destination), F("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  downloadImpulses(e, t = 100, s = B(125, 8e3), i = 44100) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    const a = this.paths[this.receiverIDs[0]].sort((o, p) => o.time - p.time), l = a[a.length - 1].time + 0.05, n = Array(s.length).fill(t), h = P(i * l), r = [];
    for (let o = 0; o < s.length; o++)
      r.push(new Float32Array(h));
    let c = 0;
    for (let o = 0; o < a.length; o++) {
      const p = j() ? 1 : -1, f = a[o].time, g = this.arrivalPressure(n, s, a[o]).map((m) => m * p), u = P(f * i);
      for (let m = 0; m < s.length; m++)
        r[m][u] += g[m], C(r[m][u]) > c && (c = C(r[m][u]));
    }
    for (let o = 0; o < s.length; o++) {
      const p = Y([ge(r[o])], { sampleRate: i, bitDepth: 32 });
      G.saveAs(p, `${s[o]}_${e}.wav`);
    }
  }
  async downloadImpulseResponse(e, t = E.sampleRate) {
    if (!this.impulseResponse)
      try {
        this.impulseResponse = await this.calculateImpulseResponse();
      } catch (a) {
        throw a;
      }
    const s = Y([H(this.impulseResponse.getChannelData(0))], { sampleRate: t, bitDepth: 32 }), i = e.endsWith(".wav") ? "" : ".wav";
    G.saveAs(s, e + i);
  }
  /**
   * Download the ambisonic impulse response as a multi-channel WAV file.
   * Channels are in ACN order with N3D normalization.
   *
   * @param filename - Output filename (without extension)
   * @param order - Ambisonic order (default: 1)
   */
  async downloadAmbisonicImpulseResponse(e, t = 1) {
    (!this.ambisonicImpulseResponse || this.ambisonicOrder !== t) && (this.ambisonicOrder = t, this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(t));
    const s = this.ambisonicImpulseResponse.numberOfChannels, i = this.ambisonicImpulseResponse.sampleRate, a = [];
    for (let r = 0; r < s; r++)
      a.push(this.ambisonicImpulseResponse.getChannelData(r));
    const l = Y(a, { sampleRate: i, bitDepth: 32 }), n = e.endsWith(".wav") ? "" : ".wav", h = t === 1 ? "FOA" : `HOA${t}`;
    G.saveAs(l, `${e}_${h}${n}`);
  }
  get sources() {
    return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => S.getState().containers[e]) : [];
  }
  get receivers() {
    return this.receiverIDs.length > 0 && Object.keys(S.getState().containers).length > 0 ? this.receiverIDs.map((e) => S.getState().containers[e].mesh) : [];
  }
  get room() {
    return S.getState().containers[this.roomID];
  }
  get precheck() {
    return this.sourceIDs.length > 0 && typeof this.room < "u";
  }
  get indexedPaths() {
    const e = {};
    for (const t in this.paths) {
      e[t] = {};
      for (let s = 0; s < this.paths[t].length; s++) {
        const i = this.paths[t][s].source;
        e[t][i] ? e[t][i].push(this.paths[t][s]) : e[t][i] = [this.paths[t][s]];
      }
    }
    return e;
  }
  get isRunning() {
    return this.running;
  }
  set isRunning(e) {
    this.running = this.precheck && e, this.running ? this.start() : this.stop();
  }
  get raysVisible() {
    return this._raysVisible;
  }
  set raysVisible(e) {
    e != this._raysVisible && (this._raysVisible = e, this.rays.visible = e), _.needsToRender = !0;
  }
  get pointsVisible() {
    return this._pointsVisible;
  }
  set pointsVisible(e) {
    e != this._pointsVisible && (this._pointsVisible = e, this.hits.visible = e), _.needsToRender = !0;
  }
  get invertedDrawStyle() {
    return this._invertedDrawStyle;
  }
  set invertedDrawStyle(e) {
    this._invertedDrawStyle != e && (this._invertedDrawStyle = e, this.hits.material.uniforms.inverted.value = Number(e), this.hits.material.needsUpdate = !0), _.needsToRender = !0;
  }
  get pointSize() {
    return this._pointSize;
  }
  set pointSize(e) {
    Number.isFinite(e) && e > 0 && (this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0), _.needsToRender = !0;
  }
  get runningWithoutReceivers() {
    return this._runningWithoutReceivers;
  }
  set runningWithoutReceivers(e) {
    this.mapIntersectableObjects(), this._runningWithoutReceivers = e;
  }
}
T("RAYTRACER_CALL_METHOD", ve);
T("RAYTRACER_SET_PROPERTY", Ie);
T("REMOVE_RAYTRACER", Re);
T("ADD_RAYTRACER", De(Ve));
T("RAYTRACER_CLEAR_RAYS", (d) => void V.getState().solvers[d].clearRays());
T("RAYTRACER_PLAY_IR", (d) => {
  V.getState().solvers[d].playImpulseResponse().catch((e) => {
    window.alert(e.message || "Failed to play impulse response");
  });
});
T("RAYTRACER_DOWNLOAD_IR", (d) => {
  var a, l;
  const y = V.getState().solvers[d], e = S.getState().containers, t = y.sourceIDs.length > 0 && ((a = e[y.sourceIDs[0]]) == null ? void 0 : a.name) || "source", s = y.receiverIDs.length > 0 && ((l = e[y.receiverIDs[0]]) == null ? void 0 : l.name) || "receiver", i = `ir-${t}-${s}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  y.downloadImpulseResponse(i).catch((n) => {
    window.alert(n.message || "Failed to download impulse response");
  });
});
T("RAYTRACER_DOWNLOAD_IR_OCTAVE", (d) => void V.getState().solvers[d].downloadImpulses(d));
T("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: d, order: y }) => {
  var l, n;
  const e = V.getState().solvers[d], t = S.getState().containers, s = e.sourceIDs.length > 0 && ((l = t[e.sourceIDs[0]]) == null ? void 0 : l.name) || "source", i = e.receiverIDs.length > 0 && ((n = t[e.receiverIDs[0]]) == null ? void 0 : n.name) || "receiver", a = `ir-${s}-${i}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadAmbisonicImpulseResponse(a, y).catch((h) => {
    window.alert(h.message || "Failed to download ambisonic impulse response");
  });
});
export {
  ke as ReceiverData,
  Ve as default,
  x as defaults
};
//# sourceMappingURL=index-Dytka8gL.mjs.map
