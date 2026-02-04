import { S as oe } from "./solver-C-Bt4aM8.mjs";
import * as b from "three";
import { computeBoundsTree as le, disposeBoundsTree as ce, acceleratedRaycast as he } from "three-mesh-bvh";
import { r as w, m as T, u as D, S as Z, e as C, a as Q, R as X, b as V, L, P as N, I as H, F as U, y as ue, o as O, z as fe, s as pe, c as de, d as me, f as B } from "./index-CFFAMMt_.mjs";
import { a as _, O as F, w as W, n as ye } from "./audio-engine-CY5uhXd3.mjs";
import { a as $ } from "./air-attenuation-CBIk1QMo.mjs";
import { e as ge, g as ve } from "./ambisonics.es-Ci32Q6qr.mjs";
import { ImageSourceSolver as Ie } from "./index-BQyb54Zi.mjs";
function Re(d) {
  return d.reduce((e, t) => e + t);
}
function De(d) {
  let e = Re(d.map((t) => 10 ** (t / 10)));
  return 10 * Math.log10(e);
}
function q(d) {
  return 20.05 * Math.sqrt(d + 273.15);
}
var se = function(d) {
  return function(e, t, s) {
    return d(e, t, s) * s;
  };
}, J = function(d, e) {
  if (d)
    throw Error("Invalid sort config: " + e);
}, re = function(d) {
  var e = d || {}, t = e.asc, s = e.desc, r = t ? 1 : -1, n = t || s;
  J(!n, "Expected `asc` or `desc` property"), J(t && s, "Ambiguous object with `asc` and `desc` config properties");
  var l = d.comparer && se(d.comparer);
  return { order: r, sortBy: n, comparer: l };
}, be = function(d) {
  return function e(t, s, r, n, l, a, h) {
    var i, c;
    if (typeof t == "string")
      i = a[t], c = h[t];
    else if (typeof t == "function")
      i = t(a), c = t(h);
    else {
      var o = re(t);
      return e(o.sortBy, s, r, o.order, o.comparer || d, a, h);
    }
    var p = l(i, c, n);
    return (p === 0 || i == null && c == null) && s.length > r ? e(s[r], s, r + 1, n, l, a, h) : p;
  };
};
function ne(d, e, t) {
  if (d === void 0 || d === !0)
    return function(n, l) {
      return e(n, l, t);
    };
  if (typeof d == "string")
    return J(d.includes("."), "String syntax not allowed for nested properties."), function(n, l) {
      return e(n[d], l[d], t);
    };
  if (typeof d == "function")
    return function(n, l) {
      return e(d(n), d(l), t);
    };
  if (Array.isArray(d)) {
    var s = be(e);
    return function(n, l) {
      return s(d[0], d, 1, t, e, n, l);
    };
  }
  var r = re(d);
  return ne(r.sortBy, r.comparer || e, r.order);
}
var Y = function(d, e, t, s) {
  var r;
  return Array.isArray(e) ? (Array.isArray(t) && t.length < 2 && (r = t, t = r[0]), e.sort(ne(t, s, d))) : e;
};
function ie(d) {
  var e = se(d.comparer);
  return function(t) {
    var s = Array.isArray(t) && !d.inPlaceSorting ? t.slice() : t;
    return {
      asc: function(r) {
        return Y(1, s, r, e);
      },
      desc: function(r) {
        return Y(-1, s, r, e);
      },
      by: function(r) {
        return Y(1, s, r, e);
      }
    };
  };
}
var ae = function(d, e, t) {
  return d == null ? t : e == null ? -t : typeof d != typeof e ? typeof d < typeof e ? -1 : 1 : d < e ? -1 : d > e ? 1 : 0;
}, Se = ie({
  comparer: ae
});
ie({
  comparer: ae,
  inPlaceSorting: !0
});
const { cos: ee } = Math;
function we(d, e, t, s, r) {
  return d * (1 - e) * t * (1 - ee(s / 2)) * 2 * ee(r);
}
const Ae = `attribute vec2 color;\r
varying vec2 vColor;\r
uniform float pointScale;\r
void main() {\r
  vColor = color;\r
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\r
  gl_PointSize = pointScale*(color.x/4.0+0.5);\r
  gl_Position = projectionMatrix * mvPosition;\r
  \r
}`, _e = `varying vec2 vColor;\r
uniform float drawStyle;\r
uniform int inverted;\r
vec3 hsl2rgb(vec3 c)\r
{\r
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );\r
\r
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));\r
}\r
\r
vec3 rgb2hsl( vec3 c ){\r
  float h = 0.0;\r
	float s = 0.0;\r
	float l = 0.0;\r
	float r = c.r;\r
	float g = c.g;\r
	float b = c.b;\r
	float cMin = min( r, min( g, b ) );\r
	float cMax = max( r, max( g, b ) );\r
\r
	l = ( cMax + cMin ) / 2.0;\r
	if ( cMax > cMin ) {\r
		float cDelta = cMax - cMin;\r
        \r
        //s = l < .05 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) ); Original\r
		s = l < .0 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) );\r
        \r
		if ( r == cMax ) {\r
			h = ( g - b ) / cDelta;\r
		} else if ( g == cMax ) {\r
			h = 2.0 + ( b - r ) / cDelta;\r
		} else {\r
			h = 4.0 + ( r - g ) / cDelta;\r
		}\r
\r
		if ( h < 0.0) {\r
			h += 6.0;\r
		}\r
		h = h / 6.0;\r
	}\r
	return vec3( h, s, l );\r
}\r
\r
void main() {\r
  vec3 color = vec3(0.0);\r
	float alpha = vColor.x;\r
  if(drawStyle == 0.0){\r
    vec3 col = hsl2rgb(vec3(vColor.x/10.0,0.8, vColor.x));\r
    color = col;\r
		alpha = vColor.x;\r
  }\r
  else if(drawStyle == 1.0){\r
    vec3 col = hsl2rgb(vec3(vColor.y,vColor.x,vColor.y));\r
    vec3 col2 = vec3(vColor.x,vColor.x,1.0-vColor.y);\r
    color = col*col2;\r
		alpha = vColor.x;\r
  }\r
	if(inverted != 0){\r
		color = vec3(1.0) - color;\r
	}\r
  gl_FragColor = vec4(color, alpha);\r
  \r
}`, te = {
  vs: Ae,
  fs: _e
};
function G(d, e = 1) {
  let t = d.slice();
  for (let s = 0; s < d.length; s++)
    if (s >= e && s < d.length - e) {
      const r = s - e, n = s + e;
      let l = 0;
      for (let a = r; a < n; a++)
        l += d[a];
      t[s] = l / (2 * e);
    }
  return t;
}
function xe(d) {
  var e, t, s = d.length;
  if (s === 1)
    e = 0, t = d[0][1];
  else {
    for (var r = 0, n = 0, l = 0, a = 0, h, i, c, o = 0; o < s; o++)
      h = d[o], i = h[0], c = h[1], r += i, n += c, l += i * i, a += i * c;
    e = (s * a - r * n) / (s * l - r * r), t = n / s - e * r / s;
  }
  return {
    m: e,
    b: t
  };
}
function K(d, e) {
  const t = d.length, s = [];
  for (let h = 0; h < t; h++)
    s.push([d[h], e[h]]);
  const { m: r, b: n } = xe(s);
  return { m: r, b: n, fx: (h) => r * h + n, fy: (h) => (h - n) / r };
}
function Ee(d, e) {
  let t = (360 - d) * (Math.PI / 180);
  return [e * (Math.PI / 180), t];
}
class Pe {
  constructor(e) {
    this.v = e;
  }
  watchers = /* @__PURE__ */ new Set();
  get value() {
    return this.v;
  }
  set value(e) {
    const t = this.v;
    this.v = e, this.watchers.forEach((s) => s(this.v, t));
  }
  watch(e) {
    return this.watchers.add(e), () => this.watchers.delete(e);
  }
  toJSON() {
    return JSON.stringify(this.v);
  }
  toString() {
    return String(this.v);
  }
}
function Oe(d, e) {
  return new Pe(d);
}
function Ce(d) {
  return Math.random() < d;
}
const j = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
)), { floor: x, random: Te, abs: P, asin: Me } = Math, M = () => Te() > 0.5;
function z(d) {
  let e = Math.abs(d[0]);
  for (let t = 1; t < d.length; t++)
    Math.abs(d[t]) > e && (e = Math.abs(d[t]));
  if (e !== 0)
    for (let t = 0; t < d.length; t++)
      d[t] /= e;
  return d;
}
b.BufferGeometry.prototype.computeBoundsTree = le;
b.BufferGeometry.prototype.disposeBoundsTree = ce;
b.Mesh.prototype.raycast = he;
class Fe {
  constructor(e) {
    this.id = e, this.data = [];
  }
}
const A = {
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
class je extends oe {
  roomID;
  sourceIDs;
  surfaceIDs;
  receiverIDs;
  updateInterval;
  reflectionOrder;
  raycaster;
  intersections;
  _isRunning;
  intervals;
  rayBufferGeometry;
  rayBufferAttribute;
  colorBufferAttribute;
  rays;
  rayPositionIndex;
  maxrays;
  intersectableObjects;
  paths;
  stats;
  messageHandlerIDs;
  statsUpdatePeriod;
  lastTime;
  _runningWithoutReceivers;
  reflectionLossFrequencies;
  allReceiverData;
  hits;
  _pointSize;
  chartdata;
  passes;
  _raysVisible;
  _pointsVisible;
  _invertedDrawStyle;
  __start_time;
  __calc_time;
  __num_checked_paths;
  responseOverlayElement;
  quickEstimateResults;
  responseByIntensity;
  defaultFrequencies;
  plotData;
  intensitySampleRate;
  validRayCount;
  plotStyle;
  bvh;
  observed_name;
  hybrid;
  transitionOrder;
  constructor(e) {
    super(e), this.kind = "ray-tracer", e = { ...A, ...e }, this.uuid = e.uuid || this.uuid, this.name = e.name || A.name, this.observed_name = Oe(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = e.sourceIDs || A.sourceIDs, this.surfaceIDs = e.surfaceIDs || A.surfaceIDs, this.roomID = e.roomID || A.roomID, this.receiverIDs = e.receiverIDs || A.receiverIDs, this.updateInterval = e.updateInterval || A.updateInterval, this.reflectionOrder = e.reflectionOrder || A.reflectionOrder, this._isRunning = e.isRunning || A.isRunning, this._runningWithoutReceivers = e.runningWithoutReceivers || A.runningWithoutReceivers, this.reflectionLossFrequencies = [4e3], this.intervals = [], this.plotData = [], this.plotStyle = e.plotStyle || A.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = e.pointSize || A.pointSize, this.validRayCount = 0, this.defaultFrequencies = [1e3], this.intensitySampleRate = 256, this.quickEstimateResults = {};
    const t = typeof e.raysVisible == "boolean";
    this._raysVisible = t ? e.raysVisible : A.raysVisible;
    const s = typeof e.pointsVisible == "boolean";
    this._pointsVisible = s ? e.pointsVisible : A.pointsVisible;
    const r = typeof e.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = r ? e.invertedDrawStyle : A.invertedDrawStyle, this.passes = e.passes || A.passes, this.raycaster = new b.Raycaster(), this.rayBufferGeometry = new b.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new b.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(b.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new b.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(b.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.rays = new b.LineSegments(
      this.rayBufferGeometry,
      new b.LineBasicMaterial({
        fog: !1,
        color: 2631977,
        transparent: !0,
        opacity: 0.2,
        premultipliedAlpha: !0,
        blending: b.NormalBlending,
        depthFunc: b.AlwaysDepth,
        name: "raytracer-rays-material"
        // depthTest: false
      })
    ), this.rays.renderOrder = -0.5, this.rays.frustumCulled = !1, w.scene.add(this.rays);
    var n = new b.ShaderMaterial({
      fog: !1,
      vertexShader: te.vs,
      fragmentShader: te.fs,
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
      blending: b.NormalBlending,
      name: "raytracer-points-material"
    });
    this.hits = new b.Points(this.rayBufferGeometry, n), this.hits.frustumCulled = !1, w.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
      value: !0,
      writable: !0
    }), this.intersections = [], this.findIDs(), this.intersectableObjects = [], this.paths = e.paths || A.paths, this.stats = {
      numRaysShot: {
        name: "# of rays shot",
        value: 0
      },
      numValidRayPaths: {
        name: "# of valid rays",
        value: 0
      }
    }, w.overlays.global.addCell("Valid Rays", this.validRayCount, {
      id: this.uuid + "-valid-ray-count",
      hidden: !0,
      formatter: (l) => String(l)
    }), this.messageHandlerIDs = [], T.postMessage("STATS_SETUP", this.stats), this.messageHandlerIDs.push(
      T.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (l, ...a) => {
        console.log(a && a[0] && a[0] instanceof Array && a[1] && a[1] === this.uuid), a && a[0] && a[0] instanceof Array && a[1] && a[1] === this.uuid && (this.sourceIDs = a[0].map((h) => h.id));
      })
    ), this.messageHandlerIDs.push(
      T.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (l, ...a) => {
        a && a[0] && a[0] instanceof Array && a[1] && a[1] === this.uuid && (this.receiverIDs = a[0].map((h) => h.id));
      })
    ), this.messageHandlerIDs.push(
      T.addMessageHandler("SHOULD_REMOVE_CONTAINER", (l, ...a) => {
        const h = a[0];
        h && (console.log(h), this.sourceIDs.includes(h) ? this.sourceIDs = this.sourceIDs.filter((i) => i != h) : this.receiverIDs.includes(h) && (this.receiverIDs = this.receiverIDs.filter((i) => i != h)));
      })
    ), this.step = this.step.bind(this), this.calculateImpulseResponse = this.calculateImpulseResponse.bind(this);
  }
  update = () => {
  };
  save() {
    const {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: r,
      roomID: n,
      sourceIDs: l,
      surfaceIDs: a,
      receiverIDs: h,
      updateInterval: i,
      passes: c,
      pointSize: o,
      reflectionOrder: p,
      runningWithoutReceivers: u,
      raysVisible: y,
      pointsVisible: f,
      invertedDrawStyle: m,
      plotStyle: g,
      paths: I
    } = this;
    return {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: r,
      roomID: n,
      sourceIDs: l,
      surfaceIDs: a,
      receiverIDs: h,
      updateInterval: i,
      passes: c,
      pointSize: o,
      reflectionOrder: p,
      runningWithoutReceivers: u,
      raysVisible: y,
      pointsVisible: f,
      invertedDrawStyle: m,
      plotStyle: g,
      paths: I
    };
  }
  removeMessageHandlers() {
    this.messageHandlerIDs.forEach((e) => {
      T.removeMessageHandler(e[0], e[1]);
    });
  }
  dispose() {
    this.removeMessageHandlers(), Object.keys(window.vars).forEach((e) => {
      window.vars[e].uuid === this.uuid && delete window.vars[e];
    }), w.scene.remove(this.rays), w.scene.remove(this.hits);
  }
  addSource(e) {
    D.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
  }
  addReceiver(e) {
    D.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
  }
  mapIntersectableObjects() {
    const e = [];
    this.room.surfaces.traverse((t) => {
      t.kind && t.kind === "surface" && e.push(t.mesh);
    }), this.runningWithoutReceivers ? this.intersectableObjects = e : this.intersectableObjects = e.concat(this.receivers);
  }
  findIDs() {
    this.sourceIDs = [], this.receiverIDs = [], this.surfaceIDs = [];
    for (const e in D.getState().containers)
      D.getState().containers[e].kind === "room" ? this.roomID = e : D.getState().containers[e].kind === "source" ? this.sourceIDs.push(e) : D.getState().containers[e].kind === "receiver" ? this.receiverIDs.push(e) : D.getState().containers[e].kind === "surface" && this.surfaceIDs.push(e);
    this.mapIntersectableObjects();
  }
  setDrawStyle(e) {
    this.hits.material.uniforms.drawStyle.value = e, this.hits.material.needsUpdate = !0, w.needsToRender = !0;
  }
  setPointScale(e) {
    this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0, w.needsToRender = !0;
  }
  incrementRayPositionIndex() {
    return this.rayPositionIndex < this.maxrays ? this.rayPositionIndex++ : (this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !0, this.rayPositionIndex);
  }
  rayPositionIndexDidOverflow = !1;
  appendRay(e, t, s = 1, r = 1) {
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, r), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, r), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex), this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
  }
  inFrontOf(e, t) {
    const s = e.getPlane(new b.Plane()), r = new b.Vector4(s.normal.x, s.normal.y, s.normal.z, s.constant), n = new b.Vector4(t.a.x, t.a.y, t.a.z, 1), l = new b.Vector4(t.b.x, t.b.y, t.b.z, 1), a = new b.Vector4(t.c.x, t.c.y, t.c.z, 1);
    return r.dot(n) > 0 || r.dot(l) > 0 || r.dot(a) > 0;
  }
  traceRay(e, t, s, r, n, l, a, h = 1, i = [], c = 4e3) {
    t = t.normalize(), this.raycaster.ray.origin = e, this.raycaster.ray.direction = t;
    const o = this.raycaster.intersectObjects(this.intersectableObjects, !0);
    if (o.length > 0) {
      if (o[0].object.userData?.kind === "receiver") {
        const p = o[0].face && t.clone().multiplyScalar(-1).angleTo(o[0].face.normal);
        i.push({
          object: o[0].object.parent.uuid,
          angle: p,
          distance: o[0].distance,
          faceNormal: [
            o[0].face.normal.x,
            o[0].face.normal.y,
            o[0].face.normal.z
          ],
          faceMaterialIndex: o[0].face.materialIndex,
          faceIndex: o[0].faceIndex,
          point: [o[0].point.x, o[0].point.y, o[0].point.z],
          energy: r
        });
        const u = t.clone().normalize().negate(), y = [u.x, u.y, u.z];
        return {
          chain: i,
          chainLength: i.length,
          intersectedReceiver: !0,
          energy: r,
          source: n,
          initialPhi: l,
          initialTheta: a,
          arrivalDirection: y
        };
      } else {
        const p = o[0].face && t.clone().multiplyScalar(-1).angleTo(o[0].face.normal);
        i.push({
          object: o[0].object.parent.uuid,
          angle: p,
          distance: o[0].distance,
          faceNormal: [
            o[0].face.normal.x,
            o[0].face.normal.y,
            o[0].face.normal.z
          ],
          faceMaterialIndex: o[0].face.materialIndex,
          faceIndex: o[0].faceIndex,
          point: [o[0].point.x, o[0].point.y, o[0].point.z],
          energy: r
        }), o[0].object.parent instanceof Z && (o[0].object.parent.numHits += 1);
        const u = o[0].face && o[0].face.normal.normalize();
        let y = u && o[0].face && t.clone().sub(u.clone().multiplyScalar(t.dot(u.clone())).multiplyScalar(2));
        const f = o[0].object.parent._scatteringCoefficient;
        Ce(f) && (y = new b.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), u.dot(y) < 0 && y.multiplyScalar(-1));
        const m = r * P(o[0].object.parent.reflectionFunction(c, p));
        if (y && u && m > 1 / 2 ** 16 && h < s + 1)
          return this.traceRay(
            o[0].point.clone().addScaledVector(u.clone(), 0.01),
            y,
            s,
            m,
            n,
            l,
            a,
            h + 1,
            i,
            4e3
          );
      }
      return { chain: i, chainLength: i.length, source: n, intersectedReceiver: !1 };
    }
  }
  startQuickEstimate(e = this.defaultFrequencies, t = 1e3) {
    const s = this.runningWithoutReceivers;
    this.runningWithoutReceivers = !0;
    let r = 0;
    this.quickEstimateResults = {}, this.sourceIDs.forEach((n) => {
      this.quickEstimateResults[n] = [];
    }), this.intervals.push(
      //@ts-ignore
      setInterval(() => {
        for (let n = 0; n < this.passes; n++, r++)
          for (let l = 0; l < this.sourceIDs.length; l++) {
            const a = this.sourceIDs[l], h = D.getState().containers[a];
            this.quickEstimateResults[a].push(this.quickEstimateStep(h, e, t));
          }
        r >= t ? (this.intervals.forEach((n) => window.clearInterval(n)), this.runningWithoutReceivers = s, console.log(this.quickEstimateResults)) : console.log((r / t * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(e, t, s) {
    const r = q(20), n = Array(t.length).fill(0);
    let l = e.position.clone(), a = new b.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), h = 0;
    const i = Array(t.length).fill(e.initialIntensity);
    let c = 0;
    const o = 1e3;
    let p = !1, u = 0;
    $(t);
    let y = {};
    for (; !p && c < o; ) {
      this.raycaster.ray.set(l, a);
      const f = this.raycaster.intersectObjects(this.intersectableObjects, !0);
      if (f.length > 0) {
        h = a.clone().multiplyScalar(-1).angleTo(f[0].face.normal), u += f[0].distance;
        const m = f[0].object.parent;
        for (let I = 0; I < t.length; I++) {
          const R = t[I];
          let v = 1;
          m.kind === "surface" && (v = m.reflectionFunction(R, h)), i[I] *= v;
          const S = e.initialIntensity / i[I] > 1e6;
          S && (n[I] = u / r), p = p || S;
        }
        f[0].object.parent instanceof Z && (f[0].object.parent.numHits += 1);
        const g = f[0].face.normal.normalize();
        a.sub(g.clone().multiplyScalar(a.dot(g)).multiplyScalar(2)).normalize(), l.copy(f[0].point), y = f[0];
      }
      c += 1;
    }
    return this.stats.numRaysShot.value++, {
      distance: u,
      rt60s: n,
      angle: h,
      direction: a,
      lastIntersection: y
    };
  }
  startAllMonteCarlo() {
    this.intervals.push(
      setInterval(() => {
        for (let e = 0; e < this.passes; e++)
          this.step();
        w.needsToRender = !0;
      }, this.updateInterval)
    );
  }
  step() {
    for (let e = 0; e < this.sourceIDs.length; e++) {
      this.__num_checked_paths += 1;
      const t = Math.random() * D.getState().containers[this.sourceIDs[e]].theta, s = Math.random() * D.getState().containers[this.sourceIDs[e]].phi, r = D.getState().containers[this.sourceIDs[e]].position, n = D.getState().containers[this.sourceIDs[e]].rotation;
      let l = Ee(s, t);
      const a = new b.Vector3().setFromSphericalCoords(1, l[0], l[1]);
      a.applyEuler(n), D.getState().containers[this.sourceIDs[e]].directivityHandler;
      const i = this.traceRay(r, a, this.reflectionOrder, 1, this.sourceIDs[e], s, t);
      if (i) {
        if (this._runningWithoutReceivers) {
          this.appendRay(
            [r.x, r.y, r.z],
            i.chain[0].point,
            i.chain[0].energy || 1,
            i.chain[0].angle
          );
          for (let o = 1; o < i.chain.length; o++)
            this.appendRay(
              // the previous point
              i.chain[o - 1].point,
              // the current point
              i.chain[o].point,
              // the energy content displayed as a color + alpha
              i.chain[o].energy || 1,
              i.chain[o].angle
            );
          const c = i.chain[i.chain.length - 1].object;
          this.paths[c] ? this.paths[c].push(i) : this.paths[c] = [i], D.getState().containers[this.sourceIDs[e]].numRays += 1;
        } else if (i.intersectedReceiver) {
          this.appendRay(
            [r.x, r.y, r.z],
            i.chain[0].point,
            i.chain[0].energy || 1,
            i.chain[0].angle
          );
          for (let o = 1; o < i.chain.length; o++)
            this.appendRay(
              // the previous point
              i.chain[o - 1].point,
              // the current point
              i.chain[o].point,
              // the energy content displayed as a color + alpha
              i.chain[o].energy || 1,
              i.chain[o].angle
            );
          this.stats.numValidRayPaths.value++, this.validRayCount += 1, w.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
          const c = i.chain[i.chain.length - 1].object;
          this.paths[c] ? this.paths[c].push(i) : this.paths[c] = [i], D.getState().containers[this.sourceIDs[e]].numRays += 1;
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
      const t = this.__calc_time / 1e3, s = this.paths[e].length, r = s / t, n = this.__num_checked_paths, l = n / t;
      console.log({
        calc_time: t,
        num_valid_rays: s,
        valid_ray_rate: r,
        num_checks: n,
        check_rate: l
      }), this.paths[e].forEach((a) => {
        a.time = 0, a.totalLength = 0;
        for (let h = 0; h < a.chain.length; h++)
          a.totalLength += a.chain[h].distance, a.time += a.chain[h].distance / 343.2;
      });
    }), this.mapIntersectableObjects(), this.reportImpulseResponse();
  }
  async reportImpulseResponse() {
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = D.getState().containers, t = _.sampleRate, s = [];
    for (const r of this.sourceIDs)
      for (const n of this.receiverIDs) {
        if (!this.paths[n] || this.paths[n].length === 0) continue;
        const l = this.paths[n].filter((a) => a.source === r);
        l.length > 0 && s.push({ sourceId: r, receiverId: n, paths: l });
      }
    if (s.length !== 0) {
      C("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let r = 0; r < s.length; r++) {
        const { sourceId: n, receiverId: l, paths: a } = s[r], h = e[n]?.name || "Source", i = e[l]?.name || "Receiver", c = Math.round(r / s.length * 100);
        C("UPDATE_PROGRESS", {
          progress: c,
          message: `Calculating IR: ${h} → ${i}`
        });
        try {
          const { normalizedSignal: o } = await this.calculateImpulseResponseForPair(n, l, a);
          n === this.sourceIDs[0] && l === this.receiverIDs[0] && this.calculateImpulseResponse().then((I) => {
            this.impulseResponse = I;
          }).catch(console.error);
          const u = Math.max(1, Math.floor(o.length / 2e3)), y = [];
          for (let I = 0; I < o.length; I += u)
            y.push({
              time: I / t,
              amplitude: o[I]
            });
          const f = `${this.uuid}-ir-${n}-${l}`, m = Q.getState().results[f], g = {
            kind: X.ImpulseResponse,
            name: `IR: ${h} → ${i}`,
            uuid: f,
            from: this.uuid,
            info: {
              sampleRate: t,
              sourceName: h,
              receiverName: i,
              sourceId: n,
              receiverId: l
            },
            data: y
          };
          m ? C("UPDATE_RESULT", { uuid: f, result: g }) : C("ADD_RESULT", g);
        } catch (o) {
          console.error(`Failed to calculate impulse response for ${n} -> ${l}:`, o);
        }
      }
      C("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(e, t, s, r = 100, n = F(63, 16e3), l = _.sampleRate) {
    if (s.length === 0) throw Error("No rays have been traced for this pair");
    let a = s.sort((u, y) => u.time - y.time);
    const h = a[a.length - 1].time + 0.05, i = Array(n.length).fill(r), c = x(l * h) * 2;
    let o = [];
    for (let u = 0; u < n.length; u++)
      o.push(new Float32Array(c));
    for (let u = 0; u < a.length; u++) {
      const y = M() ? 1 : -1, f = a[u].time, m = this.arrivalPressure(i, n, a[u]).map((I) => I * y), g = x(f * l);
      for (let I = 0; I < n.length; I++)
        o[I][g] += m[I];
    }
    const p = j();
    return new Promise((u, y) => {
      p.postMessage({ samples: o }), p.onmessage = (f) => {
        const m = f.data.samples, g = new Float32Array(m[0].length >> 1);
        for (let R = 0; R < m.length; R++)
          for (let v = 0; v < g.length; v++)
            g[v] += m[R][v];
        const I = z(g.slice());
        p.terminate(), u({ signal: g, normalizedSignal: I });
      }, p.onerror = (f) => {
        p.terminate(), y(f);
      };
    });
  }
  async calculateImpulseResponseForDisplay(e = 100, t = F(63, 16e3), s = _.sampleRate) {
    if (this.receiverIDs.length == 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length == 0) throw Error("No sources have been assigned to the raytracer");
    if (this.paths[this.receiverIDs[0]].length == 0) throw Error("No rays have been traced yet");
    let r = this.paths[this.receiverIDs[0]].sort((c, o) => c.time - o.time);
    const n = r[r.length - 1].time + 0.05, l = Array(t.length).fill(e), a = x(s * n) * 2;
    let h = [];
    for (let c = 0; c < t.length; c++)
      h.push(new Float32Array(a));
    for (let c = 0; c < r.length; c++) {
      const o = M() ? 1 : -1, p = r[c].time, u = this.arrivalPressure(l, t, r[c]).map((f) => f * o), y = x(p * s);
      for (let f = 0; f < t.length; f++)
        h[f][y] += u[f];
    }
    const i = j();
    return new Promise((c, o) => {
      i.postMessage({ samples: h }), i.onmessage = (p) => {
        const u = p.data.samples, y = new Float32Array(u[0].length >> 1);
        for (let m = 0; m < u.length; m++)
          for (let g = 0; g < y.length; g++)
            y[g] += u[m][g];
        const f = z(y.slice());
        i.terminate(), c({ signal: y, normalizedSignal: f });
      }, i.onerror = (p) => {
        i.terminate(), o(p);
      };
    });
  }
  clearRays() {
    if (this.room)
      for (let e = 0; e < this.room.allSurfaces.length; e++)
        this.room.allSurfaces[e].resetHits();
    this.validRayCount = 0, w.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount), this.rayBufferGeometry.setDrawRange(0, 1), this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !1, this.stats.numRaysShot.value = 0, this.stats.numValidRayPaths.value = 0, T.postMessage("STATS_UPDATE", this.stats), this.sourceIDs.forEach((e) => {
      D.getState().containers[e].numRays = 0;
    }), this.paths = {}, this.mapIntersectableObjects(), w.needsToRender = !0, this.impulseResponse = void 0, this.clearImpulseResponseResults();
  }
  clearImpulseResponseResults() {
    const e = Q.getState().results;
    Object.keys(e).forEach((t) => {
      const s = e[t];
      s.from === this.uuid && s.kind === X.ImpulseResponse && C("REMOVE_RESULT", t);
    });
  }
  calculateWithDiffuse(e = this.reflectionLossFrequencies) {
    this.allReceiverData = [];
    const t = Object.keys(this.paths), s = D.getState().containers[this.receiverIDs[0]].scale.x, r = D.getState().containers[this.receiverIDs[0]].position;
    t.forEach((l) => {
      const a = new Fe(l);
      this.paths[l].forEach((h) => {
        const i = {
          time: 0,
          energy: []
        };
        let c = !1;
        h.chain.forEach((o) => {
          const p = this.receiverIDs.includes(o.object) ? D.getState().containers[o.object] : this.room.surfaceMap[o.object];
          if (p && p.kind) {
            if (p.kind === "receiver")
              c = !0;
            else if (p.kind === "surface") {
              const u = p, y = {
                time: o.time_rec,
                energy: []
              };
              e.forEach((f, m) => {
                const g = P(u.reflectionFunction(f, o.angle_in));
                if (!i.energy[m])
                  i.energy[m] = {
                    frequency: f,
                    value: g
                  };
                else {
                  i.energy[m].value *= g, i.time = o.total_time;
                  const I = new b.Vector3(
                    r.x - o.point[0],
                    r.y - o.point[1],
                    r.z - o.point[2]
                  ), R = new b.Vector3().fromArray(o.faceNormal).angleTo(I);
                  y.energy[m] = {
                    frequency: f,
                    value: we(
                      i.energy[m].value,
                      u.absorptionFunction(f),
                      0.1,
                      Me(s / I.length()),
                      R
                    )
                  };
                }
              }), y.energy.length > 0 && a.data.push(y);
            }
          }
        }), c && a.data.push(i);
      }), a.data = Se(a.data).asc((h) => h.time), this.allReceiverData.push(a);
    });
    const n = this.allReceiverData.map((l) => e.map((a) => ({
      label: a.toString(),
      x: l.data.map((h) => h.time),
      y: l.data.map((h) => h.energy.filter((i) => i.frequency == a)[0].value)
    })));
    return T.postMessage("UPDATE_CHART_DATA", n && n[0]), this.allReceiverData;
  }
  reflectionLossFunction(e, t, s) {
    const r = t.chain.slice(0, -1);
    if (r && r.length > 0) {
      let n = 1;
      for (let l = 0; l < r.length; l++) {
        const a = r[l], h = e.surfaceMap[a.object], i = a.angle || 0;
        n = n * P(h.reflectionFunction(s, i));
      }
      return n;
    }
    return 1;
  }
  //TODO change this name to something more appropriate
  calculateReflectionLoss(e = this.reflectionLossFrequencies) {
    this.allReceiverData = [];
    const t = (n, l) => ({ label: n, data: l }), s = [];
    if (e)
      for (let n = 0; n < e.length; n++)
        s.push(t(e[n].toString(), []));
    const r = Object.keys(this.paths);
    for (let n = 0; n < r.length; n++) {
      this.allReceiverData.push({
        id: r[n],
        data: []
      });
      for (let l = 0; l < this.paths[r[n]].length; l++) {
        const a = this.paths[r[n]][l];
        let h;
        e ? (h = e.map((i) => ({
          frequency: i,
          value: this.reflectionLossFunction(this.room, a, i)
        })), e.forEach((i, c) => {
          s[c].data.push([a.time, this.reflectionLossFunction(this.room, a, i)]);
        })) : h = (i) => this.reflectionLossFunction(this.room, a, i), this.allReceiverData[this.allReceiverData.length - 1].data.push({
          time: a.time,
          energy: h
        });
      }
      this.allReceiverData[this.allReceiverData.length - 1].data = this.allReceiverData[this.allReceiverData.length - 1].data.sort((l, a) => l.time - a.time);
    }
    for (let n = 0; n < s.length; n++)
      s[n].data = s[n].data.sort((l, a) => l[0] - a[0]), s[n].x = s[n].data.map((l) => l[0]), s[n].y = s[n].data.map((l) => l[1]);
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
  resampleResponse(e = 0, t = _.sampleRate) {
    if (this.allReceiverData && this.allReceiverData[e]) {
      const s = this.allReceiverData[e].data, r = s[s.length - 1].time, n = x(t * r), l = [];
      for (let a = 0, h = 0; a < n; a++) {
        let i = a / n * r;
        if (s[h] && s[h].time) {
          let c = s[h].time;
          if (c > i) {
            l.push([i].concat(Array(s[h].energy.length).fill(0)));
            continue;
          }
          if (c <= i) {
            let o = s[h].energy.map((u) => 0), p = 0;
            for (; c <= i; )
              c = s[h].time, o.forEach((u, y, f) => f[y] += s[h].energy[y].value), h++, p++;
            l.push([i, ...o.map((u) => u / p)]);
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
      return s.map((r) => r.join(",")).join(`
`);
  }
  getReceiverIntersectionPoints(e) {
    return this.paths && this.paths[e] && this.paths[e].length > 0 ? this.paths[e].map(
      (t) => new b.Vector3().fromArray(t.chain[t.chain.length - 1].point)
    ) : [];
  }
  calculateResponseByIntensity(e = this.defaultFrequencies, t = 20) {
    const s = this.indexedPaths, r = q(t), n = $(e);
    this.responseByIntensity = {};
    for (const l in s) {
      this.responseByIntensity[l] = {};
      for (const a in s[l]) {
        this.responseByIntensity[l][a] = {
          freqs: e,
          response: []
        }, V(L(D.getState().containers[a].initialSPL));
        for (let h = 0; h < s[l][a].length; h++) {
          let i = 0, c = [], o = s[l][a][h].initialPhi, p = s[l][a][h].initialTheta, u = D.getState().containers[a].directivityHandler;
          for (let f = 0; f < e.length; f++)
            c[f] = V(u.getPressureAtPosition(0, e[f], o, p));
          for (let f = 0; f < s[l][a][h].chain.length; f++) {
            const { angle: m, distance: g } = s[l][a][h].chain[f];
            i += g / r;
            const I = s[l][a][h].chain[f].object, R = D.getState().containers[I] || this.room.surfaceMap[I] || null;
            for (let v = 0; v < e.length; v++) {
              const S = e[v];
              let E = 1;
              R && R.kind === "surface" && (E = R.reflectionFunction(S, m)), c.push(V(
                L(N(H(c[v] * E)) - n[v] * g)
              ));
            }
          }
          const y = N(H(c));
          this.responseByIntensity[l][a].response.push({
            time: i,
            level: y,
            bounces: s[l][a][h].chain.length
          });
        }
        this.responseByIntensity[l][a].response.sort((h, i) => h.time - i.time);
      }
    }
    return this.resampleResponseByIntensity();
  }
  resampleResponseByIntensity(e = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      for (const t in this.responseByIntensity)
        for (const s in this.responseByIntensity[t]) {
          const { response: r, freqs: n } = this.responseByIntensity[t][s], l = r[r.length - 1].time, a = x(e * l);
          this.responseByIntensity[t][s].resampledResponse = Array(n.length).fill(0).map((p) => new Float32Array(a)), this.responseByIntensity[t][s].sampleRate = e;
          let h = 0, i = [], c = n.map((p) => 0), o = !1;
          for (let p = 0, u = 0; p < a; p++) {
            let y = p / a * l;
            if (r[u] && r[u].time) {
              let f = r[u].time;
              if (f > y) {
                for (let m = 0; m < n.length; m++)
                  this.responseByIntensity[t][s].resampledResponse[m][h] = 0;
                o && i.push(h), h++;
                continue;
              }
              if (f <= y) {
                let m = r[u].level.map((g) => 0);
                for (; f <= y; ) {
                  f = r[u].time;
                  for (let g = 0; g < n.length; g++)
                    m[g] = De([m[g], r[u].level[g]]);
                  u++;
                }
                for (let g = 0; g < n.length; g++) {
                  if (this.responseByIntensity[t][s].resampledResponse[g][h] = m[g], i.length > 0) {
                    const I = c[g], R = m[g];
                    for (let v = 0; v < i.length; v++) {
                      const S = ue(I, R, (v + 1) / (i.length + 1));
                      this.responseByIntensity[t][s].resampledResponse[g][i[v]] = S;
                    }
                  }
                  c[g] = m[g];
                }
                i.length > 0 && (i = []), o = !0, h++;
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
    const s = this.receiverIDs, r = this.sourceIDs;
    if (s.length > 0 && r.length > 0) {
      const n = e || s[0], l = t || r[0], a = this.responseByIntensity[n][l].resampledResponse, h = this.responseByIntensity[n][l].sampleRate;
      if (this.responseByIntensity[n][l].freqs, a && h) {
        const i = new Float32Array(a[0].length);
        for (let c = 0; c < a[0].length; c++)
          i[c] = c / h;
        this.responseByIntensity[n][l].t30 = a.map((c) => {
          let o = 0, p = c[o];
          for (; p === 0; )
            p = c[o++];
          for (let m = o; m >= 0; m--)
            c[m] = p;
          const u = p - 30, f = G(c, 2).filter((m) => m >= u).length;
          return K(i.slice(0, f), c.slice(0, f));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT20(e, t) {
    const s = this.receiverIDs, r = this.sourceIDs;
    if (s.length > 0 && r.length > 0) {
      const n = e || s[0], l = t || r[0], a = this.responseByIntensity[n][l].resampledResponse, h = this.responseByIntensity[n][l].sampleRate;
      if (this.responseByIntensity[n][l].freqs, a && h) {
        const i = new Float32Array(a[0].length);
        for (let c = 0; c < a[0].length; c++)
          i[c] = c / h;
        this.responseByIntensity[n][l].t20 = a.map((c) => {
          let o = 0, p = c[o];
          for (; p === 0; )
            p = c[o++];
          for (let m = o; m >= 0; m--)
            c[m] = p;
          const u = p - 20, f = G(c, 2).filter((m) => m >= u).length;
          return K(i.slice(0, f), c.slice(0, f));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT60(e, t) {
    const s = this.receiverIDs, r = this.sourceIDs;
    if (s.length > 0 && r.length > 0) {
      const n = e || s[0], l = t || r[0], a = this.responseByIntensity[n][l].resampledResponse, h = this.responseByIntensity[n][l].sampleRate;
      if (this.responseByIntensity[n][l].freqs, a && h) {
        const i = new Float32Array(a[0].length);
        for (let c = 0; c < a[0].length; c++)
          i[c] = c / h;
        this.responseByIntensity[n][l].t60 = a.map((c) => {
          let o = 0, p = c[o];
          for (; p === 0; )
            p = c[o++];
          for (let m = o; m >= 0; m--)
            c[m] = p;
          const u = p - 60, f = G(c, 2).filter((m) => m >= u).length;
          return K(i.slice(0, f), c.slice(0, f));
        });
      }
    }
    return this.responseByIntensity;
  }
  computeImageSources(e, t, s) {
    for (const r of this.room.allSurfaces)
      r.uuid, t.uuid;
  }
  onParameterConfigFocus() {
    console.log("focus"), console.log(w.overlays.global.cells), w.overlays.global.showCell(this.uuid + "-valid-ray-count");
  }
  onParameterConfigBlur() {
    console.log("blur"), w.overlays.global.hideCell(this.uuid + "-valid-ray-count");
  }
  pathsToLinearBuffer() {
    const e = (r) => r.split("").map((n) => n.charCodeAt(0)), t = (r) => r.map((n) => [
      ...e(n.object),
      // 36x8
      n.angle,
      // 1x32
      n.distance,
      // 1x32
      n.energy,
      // 1x32
      n.faceIndex,
      // 1x8
      n.faceMaterialIndex,
      // 1x8
      ...n.faceNormal,
      // 3x32
      ...n.point
      // 3x32
    ]).flat();
    return new Float32Array(
      Object.keys(this.paths).map((r) => {
        const n = this.paths[r].map((l) => [
          ...e(l.source),
          l.chainLength,
          l.time,
          Number(l.intersectedReceiver),
          l.energy,
          ...t(l.chain)
        ]).flat();
        return [...e(r), n.length, ...n];
      }).flat()
    );
  }
  linearBufferToPaths(e) {
    const r = (i) => String.fromCharCode(...i), n = (i) => {
      let c = 0;
      const o = r(i.slice(c, c += 36)), p = i[c++], u = i[c++], y = i[c++], f = i[c++], m = i[c++], g = [i[c++], i[c++], i[c++]], I = [i[c++], i[c++], i[c++]];
      return {
        object: o,
        angle: p,
        distance: u,
        energy: y,
        faceIndex: f,
        faceMaterialIndex: m,
        faceNormal: g,
        point: I
      };
    }, l = (i) => {
      const c = [];
      let o = 0;
      for (; o < i.length; ) {
        r(i.slice(o, o += 36));
        const p = i[o++];
        i[o++], i[o++], i[o++];
        const u = [];
        for (let y = 0; y < p; y++)
          u.push(n(i.slice(o, o += 47)));
      }
      return c;
    };
    let a = 0;
    const h = {};
    for (; a < e.length; ) {
      const i = r(e.slice(a, a += 36)), c = e[a++], o = l(e.slice(a, a += c));
      h[i] = o;
    }
    return h;
  }
  arrivalPressure(e, t, s) {
    const r = V(L(e));
    s.chain.slice(0, -1).forEach((a) => {
      const h = D.getState().containers[a.object];
      r.forEach((i, c) => {
        let o;
        t[c] === 16e3 ? o = 1 - h.absorptionFunction(t[8e3]) : o = 1 - h.absorptionFunction(t[c]), r[c] = i * o;
      });
    });
    const n = N(H(r)), l = $(t);
    return t.forEach((a, h) => n[h] -= l[h] * s.totalLength), L(n);
  }
  async calculateImpulseResponse(e = 100, t = F(63, 16e3), s = _.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let r = this.paths[this.receiverIDs[0]].sort((c, o) => c.time - o.time);
    const n = r[r.length - 1].time + 0.05, l = Array(t.length).fill(e), a = x(s * n) * 2;
    let h = [];
    for (let c = 0; c < t.length; c++)
      h.push(new Float32Array(a));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let u = 0; u < r.length; u++)
        r[u].chainLength - 1 <= this.transitionOrder && r.splice(u, 1);
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
      }, p = new Ie(c, !0).returnSortedPathsForHybrid(343, l, t);
      for (let u = 0; u < p.length; u++) {
        const y = M() ? 1 : -1, f = p[u].time, m = x(f * s);
        for (let g = 0; g < t.length; g++)
          h[g][m] += p[u].pressure[g] * y;
      }
    }
    for (let c = 0; c < r.length; c++) {
      const o = M() ? 1 : -1, p = r[c].time, u = this.arrivalPressure(l, t, r[c]).map((f) => f * o), y = x(p * s);
      for (let f = 0; f < t.length; f++)
        h[f][y] += u[f];
    }
    const i = j();
    return new Promise((c, o) => {
      i.postMessage({ samples: h }), i.onmessage = (p) => {
        const u = p.data.samples, y = new Float32Array(u[0].length >> 1);
        let f = 0;
        for (let R = 0; R < u.length; R++)
          for (let v = 0; v < y.length; v++)
            y[v] += u[R][v], P(y[v]) > f && (f = P(y[v]));
        const m = z(y), g = _.createOfflineContext(1, y.length, s), I = _.createBufferSource(m, g);
        I.connect(g.destination), I.start(), _.renderContextAsync(g).then((R) => c(R)).catch(o).finally(() => i.terminate());
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
  async calculateAmbisonicImpulseResponse(e = 1, t = 100, s = F(63, 16e3), r = _.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");
    const n = this.paths[this.receiverIDs[0]].sort((p, u) => p.time - u.time);
    if (n.length === 0) throw Error("No valid ray paths found");
    const l = n[n.length - 1].time + 0.05;
    if (l <= 0) throw Error("Invalid impulse response duration");
    const a = Array(s.length).fill(t), h = x(r * l) * 2;
    if (h < 2) throw Error("Impulse response too short to process");
    const i = ve(e), c = [];
    for (let p = 0; p < s.length; p++) {
      c.push([]);
      for (let u = 0; u < i; u++)
        c[p].push(new Float32Array(h));
    }
    for (let p = 0; p < n.length; p++) {
      const u = n[p], y = M() ? 1 : -1, f = u.time, m = this.arrivalPressure(a, s, u).map((v) => v * y), g = x(f * r);
      if (g >= h) continue;
      const I = u.arrivalDirection || [0, 0, 1], R = new Float32Array(1);
      for (let v = 0; v < s.length; v++) {
        R[0] = m[v];
        const S = ge(R, I[0], I[1], I[2], e, "threejs");
        for (let E = 0; E < i; E++)
          c[v][E][g] += S[E][0];
      }
    }
    const o = j();
    return new Promise((p, u) => {
      const y = async (f) => new Promise((m) => {
        const g = [];
        for (let R = 0; R < s.length; R++)
          g.push(c[R][f]);
        const I = j();
        I.postMessage({ samples: g }), I.onmessage = (R) => {
          const v = R.data.samples, S = new Float32Array(v[0].length >> 1);
          for (let E = 0; E < v.length; E++)
            for (let k = 0; k < S.length; k++)
              S[k] += v[E][k];
          I.terminate(), m(S);
        };
      });
      Promise.all(
        Array.from({ length: i }, (f, m) => y(m))
      ).then((f) => {
        let m = 0;
        for (const v of f)
          for (let S = 0; S < v.length; S++)
            P(v[S]) > m && (m = P(v[S]));
        if (m > 0)
          for (const v of f)
            for (let S = 0; S < v.length; S++)
              v[S] /= m;
        const g = f[0].length;
        if (g === 0) {
          o.terminate(), u(new Error("Filtered signal has zero length"));
          return;
        }
        const R = _.createOfflineContext(i, g, r).createBuffer(i, g, r);
        for (let v = 0; v < i; v++)
          R.copyToChannel(new Float32Array(f[v]), v);
        o.terminate(), p(R);
      }).catch(u);
    });
  }
  ambisonicImpulseResponse;
  ambisonicOrder = 1;
  impulseResponse;
  impulseResponsePlaying = !1;
  async playImpulseResponse() {
    if (!this.impulseResponse)
      try {
        this.impulseResponse = await this.calculateImpulseResponse();
      } catch (t) {
        throw t;
      }
    _.context.state === "suspended" && _.context.resume(), console.log(this.impulseResponse);
    const e = _.context.createBufferSource();
    e.buffer = this.impulseResponse, e.connect(_.context.destination), e.start(), C("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(_.context.destination), C("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  downloadImpulses(e, t = 100, s = F(125, 8e3), r = 44100) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    const n = this.paths[this.receiverIDs[0]].sort((o, p) => o.time - p.time), l = n[n.length - 1].time + 0.05, a = Array(s.length).fill(t), h = x(r * l), i = [];
    for (let o = 0; o < s.length; o++)
      i.push(new Float32Array(h));
    let c = 0;
    for (let o = 0; o < n.length; o++) {
      const p = M() ? 1 : -1, u = n[o].time, y = this.arrivalPressure(a, s, n[o]).map((m) => m * p), f = x(u * r);
      for (let m = 0; m < s.length; m++)
        i[m][f] += y[m], P(i[m][f]) > c && (c = P(i[m][f]));
    }
    for (let o = 0; o < s.length; o++) {
      const p = W([ye(i[o])], { sampleRate: r, bitDepth: 32 });
      U.saveAs(p, `${s[o]}_${e}.wav`);
    }
  }
  async downloadImpulseResponse(e, t = _.sampleRate) {
    if (!this.impulseResponse)
      try {
        this.impulseResponse = await this.calculateImpulseResponse();
      } catch (n) {
        throw n;
      }
    const s = W([z(this.impulseResponse.getChannelData(0))], { sampleRate: t, bitDepth: 32 }), r = e.endsWith(".wav") ? "" : ".wav";
    U.saveAs(s, e + r);
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
    const s = this.ambisonicImpulseResponse.numberOfChannels, r = this.ambisonicImpulseResponse.sampleRate, n = [];
    for (let i = 0; i < s; i++)
      n.push(this.ambisonicImpulseResponse.getChannelData(i));
    const l = W(n, { sampleRate: r, bitDepth: 32 }), a = e.endsWith(".wav") ? "" : ".wav", h = t === 1 ? "FOA" : `HOA${t}`;
    U.saveAs(l, `${e}_${h}${a}`);
  }
  get sources() {
    return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => D.getState().containers[e]) : [];
  }
  get receivers() {
    return this.receiverIDs.length > 0 && Object.keys(D.getState().containers).length > 0 ? this.receiverIDs.map((e) => D.getState().containers[e].mesh) : [];
  }
  get room() {
    return D.getState().containers[this.roomID];
  }
  get precheck() {
    return this.sourceIDs.length > 0 && typeof this.room < "u";
  }
  get indexedPaths() {
    const e = {};
    for (const t in this.paths) {
      e[t] = {};
      for (let s = 0; s < this.paths[t].length; s++) {
        const r = this.paths[t][s].source;
        e[t][r] ? e[t][r].push(this.paths[t][s]) : e[t][r] = [this.paths[t][s]];
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
    e != this._raysVisible && (this._raysVisible = e, this.rays.visible = e), w.needsToRender = !0;
  }
  get pointsVisible() {
    return this._pointsVisible;
  }
  set pointsVisible(e) {
    e != this._pointsVisible && (this._pointsVisible = e, this.hits.visible = e), w.needsToRender = !0;
  }
  get invertedDrawStyle() {
    return this._invertedDrawStyle;
  }
  set invertedDrawStyle(e) {
    this._invertedDrawStyle != e && (this._invertedDrawStyle = e, this.hits.material.uniforms.inverted.value = Number(e), this.hits.material.needsUpdate = !0), w.needsToRender = !0;
  }
  get pointSize() {
    return this._pointSize;
  }
  set pointSize(e) {
    Number.isFinite(e) && e > 0 && (this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0), w.needsToRender = !0;
  }
  get runningWithoutReceivers() {
    return this._runningWithoutReceivers;
  }
  set runningWithoutReceivers(e) {
    this.mapIntersectableObjects(), this._runningWithoutReceivers = e;
  }
}
O("RAYTRACER_CALL_METHOD", fe);
O("RAYTRACER_SET_PROPERTY", pe);
O("REMOVE_RAYTRACER", de);
O("ADD_RAYTRACER", me(je));
O("RAYTRACER_CLEAR_RAYS", (d) => void B.getState().solvers[d].clearRays());
O("RAYTRACER_PLAY_IR", (d) => {
  B.getState().solvers[d].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
O("RAYTRACER_DOWNLOAD_IR", (d) => {
  const e = B.getState().solvers[d], t = D.getState().containers, s = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", r = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", n = `ir-${s}-${r}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(n).catch((l) => {
    window.alert(l.message || "Failed to download impulse response");
  });
});
O("RAYTRACER_DOWNLOAD_IR_OCTAVE", (d) => void B.getState().solvers[d].downloadImpulses(d));
O("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: d, order: e }) => {
  const t = B.getState().solvers[d], s = D.getState().containers, r = t.sourceIDs.length > 0 && s[t.sourceIDs[0]]?.name || "source", n = t.receiverIDs.length > 0 && s[t.receiverIDs[0]]?.name || "receiver", l = `ir-${r}-${n}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(l, e).catch((a) => {
    window.alert(a.message || "Failed to download ambisonic impulse response");
  });
});
export {
  Fe as ReceiverData,
  je as default,
  A as defaults
};
//# sourceMappingURL=index-Do1yOVRZ.mjs.map
