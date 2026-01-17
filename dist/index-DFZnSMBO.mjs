import { S as oe } from "./solver-BY1W6uB-.mjs";
import * as b from "three";
import { computeBoundsTree as le, disposeBoundsTree as ce, acceleratedRaycast as he } from "three-mesh-bvh";
import { r as w, t as T, k as D, X as J, A as N, w as _, e as O, q as Q, R as X, Y as F, z as V, L, s as H, I as U, Z as ue, _ as fe, x as W, y as pe, F as $, $ as q, o as C, a0 as de, B as me, C as ge, D as ye, f as B } from "./index-BaH-Rmpc.mjs";
import { e as ve, g as Ie } from "./ambisonics.es-Ci32Q6qr.mjs";
import { ImageSourceSolver as Re } from "./index-YDaxJlf9.mjs";
var se = function(m) {
  return function(e, t, s) {
    return m(e, t, s) * s;
  };
}, Z = function(m, e) {
  if (m)
    throw Error("Invalid sort config: " + e);
}, ne = function(m) {
  var e = m || {}, t = e.asc, s = e.desc, n = t ? 1 : -1, a = t || s;
  Z(!a, "Expected `asc` or `desc` property"), Z(t && s, "Ambiguous object with `asc` and `desc` config properties");
  var l = m.comparer && se(m.comparer);
  return { order: n, sortBy: a, comparer: l };
}, De = function(m) {
  return function e(t, s, n, a, l, r, c) {
    var i, h;
    if (typeof t == "string")
      i = r[t], h = c[t];
    else if (typeof t == "function")
      i = t(r), h = t(c);
    else {
      var o = ne(t);
      return e(o.sortBy, s, n, o.order, o.comparer || m, r, c);
    }
    var p = l(i, h, a);
    return (p === 0 || i == null && h == null) && s.length > n ? e(s[n], s, n + 1, a, l, r, c) : p;
  };
};
function re(m, e, t) {
  if (m === void 0 || m === !0)
    return function(a, l) {
      return e(a, l, t);
    };
  if (typeof m == "string")
    return Z(m.includes("."), "String syntax not allowed for nested properties."), function(a, l) {
      return e(a[m], l[m], t);
    };
  if (typeof m == "function")
    return function(a, l) {
      return e(m(a), m(l), t);
    };
  if (Array.isArray(m)) {
    var s = De(e);
    return function(a, l) {
      return s(m[0], m, 1, t, e, a, l);
    };
  }
  var n = ne(m);
  return re(n.sortBy, n.comparer || e, n.order);
}
var Y = function(m, e, t, s) {
  var n;
  return Array.isArray(e) ? (Array.isArray(t) && t.length < 2 && (n = t, t = n[0]), e.sort(re(t, s, m))) : e;
};
function ie(m) {
  var e = se(m.comparer);
  return function(t) {
    var s = Array.isArray(t) && !m.inPlaceSorting ? t.slice() : t;
    return {
      asc: function(n) {
        return Y(1, s, n, e);
      },
      desc: function(n) {
        return Y(-1, s, n, e);
      },
      by: function(n) {
        return Y(1, s, n, e);
      }
    };
  };
}
var ae = function(m, e, t) {
  return m == null ? t : e == null ? -t : typeof m != typeof e ? typeof m < typeof e ? -1 : 1 : m < e ? -1 : m > e ? 1 : 0;
}, be = ie({
  comparer: ae
});
ie({
  comparer: ae,
  inPlaceSorting: !0
});
const { cos: ee } = Math;
function Se(m, e, t, s, n) {
  return m * (1 - e) * t * (1 - ee(s / 2)) * 2 * ee(n);
}
const we = `attribute vec2 color;
varying vec2 vColor;
uniform float pointScale;
void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = pointScale*(color.x/4.0+0.5);
  gl_Position = projectionMatrix * mvPosition;
  
}`, Ae = `varying vec2 vColor;
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
  
}`, te = {
  vs: we,
  fs: Ae
};
function G(m, e = 1) {
  let t = m.slice();
  for (let s = 0; s < m.length; s++)
    if (s >= e && s < m.length - e) {
      const n = s - e, a = s + e;
      let l = 0;
      for (let r = n; r < a; r++)
        l += m[r];
      t[s] = l / (2 * e);
    }
  return t;
}
function _e(m) {
  var e, t, s = m.length;
  if (s === 1)
    e = 0, t = m[0][1];
  else {
    for (var n = 0, a = 0, l = 0, r = 0, c, i, h, o = 0; o < s; o++)
      c = m[o], i = c[0], h = c[1], n += i, a += h, l += i * i, r += i * h;
    e = (s * r - n * a) / (s * l - n * n), t = a / s - e * n / s;
  }
  return {
    m: e,
    b: t
  };
}
function K(m, e) {
  const t = m.length, s = [];
  for (let c = 0; c < t; c++)
    s.push([m[c], e[c]]);
  const { m: n, b: a } = _e(s);
  return { m: n, b: a, fx: (c) => n * c + a, fy: (c) => (c - a) / n };
}
function xe(m, e) {
  let t = (360 - m) * (Math.PI / 180);
  return [e * (Math.PI / 180), t];
}
class Ee {
  constructor(e) {
    this.v = e, this.watchers = /* @__PURE__ */ new Set();
  }
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
function Pe(m, e) {
  return new Ee(m);
}
function Ce(m) {
  return Math.random() < m;
}
const j = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
)), { floor: x, random: Oe, abs: P, asin: Te } = Math, M = () => Oe() > 0.5;
function z(m) {
  let e = Math.abs(m[0]);
  for (let t = 1; t < m.length; t++)
    Math.abs(m[t]) > e && (e = Math.abs(m[t]));
  if (e !== 0)
    for (let t = 0; t < m.length; t++)
      m[t] /= e;
  return m;
}
b.BufferGeometry.prototype.computeBoundsTree = le;
b.BufferGeometry.prototype.disposeBoundsTree = ce;
b.Mesh.prototype.raycast = he;
class Me {
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
class Fe extends oe {
  constructor(e) {
    super(e), this.update = () => {
    }, this.rayPositionIndexDidOverflow = !1, this.ambisonicOrder = 1, this.impulseResponsePlaying = !1, this.kind = "ray-tracer", e = { ...A, ...e }, this.uuid = e.uuid || this.uuid, this.name = e.name || A.name, this.observed_name = Pe(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = e.sourceIDs || A.sourceIDs, this.surfaceIDs = e.surfaceIDs || A.surfaceIDs, this.roomID = e.roomID || A.roomID, this.receiverIDs = e.receiverIDs || A.receiverIDs, this.updateInterval = e.updateInterval || A.updateInterval, this.reflectionOrder = e.reflectionOrder || A.reflectionOrder, this._isRunning = e.isRunning || A.isRunning, this._runningWithoutReceivers = e.runningWithoutReceivers || A.runningWithoutReceivers, this.reflectionLossFrequencies = [4e3], this.intervals = [], this.plotData = [], this.plotStyle = e.plotStyle || A.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = e.pointSize || A.pointSize, this.validRayCount = 0, this.defaultFrequencies = [1e3], this.intensitySampleRate = 256, this.quickEstimateResults = {};
    const t = typeof e.raysVisible == "boolean";
    this._raysVisible = t ? e.raysVisible : A.raysVisible;
    const s = typeof e.pointsVisible == "boolean";
    this._pointsVisible = s ? e.pointsVisible : A.pointsVisible;
    const n = typeof e.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = n ? e.invertedDrawStyle : A.invertedDrawStyle, this.passes = e.passes || A.passes, this.raycaster = new b.Raycaster(), this.rayBufferGeometry = new b.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new b.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(b.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new b.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(b.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.rays = new b.LineSegments(
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
    var a = new b.ShaderMaterial({
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
    this.hits = new b.Points(this.rayBufferGeometry, a), this.hits.frustumCulled = !1, w.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
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
      T.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (l, ...r) => {
        console.log(r && r[0] && r[0] instanceof Array && r[1] && r[1] === this.uuid), r && r[0] && r[0] instanceof Array && r[1] && r[1] === this.uuid && (this.sourceIDs = r[0].map((c) => c.id));
      })
    ), this.messageHandlerIDs.push(
      T.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (l, ...r) => {
        r && r[0] && r[0] instanceof Array && r[1] && r[1] === this.uuid && (this.receiverIDs = r[0].map((c) => c.id));
      })
    ), this.messageHandlerIDs.push(
      T.addMessageHandler("SHOULD_REMOVE_CONTAINER", (l, ...r) => {
        const c = r[0];
        c && (console.log(c), this.sourceIDs.includes(c) ? this.sourceIDs = this.sourceIDs.filter((i) => i != c) : this.receiverIDs.includes(c) && (this.receiverIDs = this.receiverIDs.filter((i) => i != c)));
      })
    ), this.step = this.step.bind(this), this.calculateImpulseResponse = this.calculateImpulseResponse.bind(this);
  }
  save() {
    const {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: n,
      roomID: a,
      sourceIDs: l,
      surfaceIDs: r,
      receiverIDs: c,
      updateInterval: i,
      passes: h,
      pointSize: o,
      reflectionOrder: p,
      runningWithoutReceivers: f,
      raysVisible: g,
      pointsVisible: u,
      invertedDrawStyle: d,
      plotStyle: y,
      paths: I
    } = this;
    return {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: n,
      roomID: a,
      sourceIDs: l,
      surfaceIDs: r,
      receiverIDs: c,
      updateInterval: i,
      passes: h,
      pointSize: o,
      reflectionOrder: p,
      runningWithoutReceivers: f,
      raysVisible: g,
      pointsVisible: u,
      invertedDrawStyle: d,
      plotStyle: y,
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
  appendRay(e, t, s = 1, n = 1) {
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, n), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, n), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex), this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
  }
  inFrontOf(e, t) {
    const s = e.getPlane(new b.Plane()), n = new b.Vector4(s.normal.x, s.normal.y, s.normal.z, s.constant), a = new b.Vector4(t.a.x, t.a.y, t.a.z, 1), l = new b.Vector4(t.b.x, t.b.y, t.b.z, 1), r = new b.Vector4(t.c.x, t.c.y, t.c.z, 1);
    return n.dot(a) > 0 || n.dot(l) > 0 || n.dot(r) > 0;
  }
  traceRay(e, t, s, n, a, l, r, c = 1, i = [], h = 4e3) {
    var p;
    t = t.normalize(), this.raycaster.ray.origin = e, this.raycaster.ray.direction = t;
    const o = this.raycaster.intersectObjects(this.intersectableObjects, !0);
    if (o.length > 0) {
      if (((p = o[0].object.userData) == null ? void 0 : p.kind) === "receiver") {
        const f = o[0].face && t.clone().multiplyScalar(-1).angleTo(o[0].face.normal);
        i.push({
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
          energy: n
        });
        const g = t.clone().normalize().negate(), u = [g.x, g.y, g.z];
        return {
          chain: i,
          chainLength: i.length,
          intersectedReceiver: !0,
          energy: n,
          source: a,
          initialPhi: l,
          initialTheta: r,
          arrivalDirection: u
        };
      } else {
        const f = o[0].face && t.clone().multiplyScalar(-1).angleTo(o[0].face.normal);
        i.push({
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
          energy: n
        }), o[0].object.parent instanceof J && (o[0].object.parent.numHits += 1);
        const g = o[0].face && o[0].face.normal.normalize();
        let u = g && o[0].face && t.clone().sub(g.clone().multiplyScalar(t.dot(g.clone())).multiplyScalar(2));
        const d = o[0].object.parent._scatteringCoefficient;
        Ce(d) && (u = new b.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), g.dot(u) < 0 && u.multiplyScalar(-1));
        const y = n * P(o[0].object.parent.reflectionFunction(h, f));
        if (u && g && y > 1 / 2 ** 16 && c < s + 1)
          return this.traceRay(
            o[0].point.clone().addScaledVector(g.clone(), 0.01),
            u,
            s,
            y,
            a,
            l,
            r,
            c + 1,
            i,
            4e3
          );
      }
      return { chain: i, chainLength: i.length, source: a, intersectedReceiver: !1 };
    }
  }
  startQuickEstimate(e = this.defaultFrequencies, t = 1e3) {
    const s = this.runningWithoutReceivers;
    this.runningWithoutReceivers = !0;
    let n = 0;
    this.quickEstimateResults = {}, this.sourceIDs.forEach((a) => {
      this.quickEstimateResults[a] = [];
    }), this.intervals.push(
      //@ts-ignore
      setInterval(() => {
        for (let a = 0; a < this.passes; a++, n++)
          for (let l = 0; l < this.sourceIDs.length; l++) {
            const r = this.sourceIDs[l], c = D.getState().containers[r];
            this.quickEstimateResults[r].push(this.quickEstimateStep(c, e, t));
          }
        n >= t ? (this.intervals.forEach((a) => window.clearInterval(a)), this.runningWithoutReceivers = s, console.log(this.quickEstimateResults)) : console.log((n / t * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(e, t, s) {
    const n = q(20), a = Array(t.length).fill(0);
    let l = e.position.clone(), r = new b.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), c = 0;
    const i = Array(t.length).fill(e.initialIntensity);
    let h = 0;
    const o = 1e3;
    let p = !1, f = 0;
    N(t);
    let g = {};
    for (; !p && h < o; ) {
      this.raycaster.ray.set(l, r);
      const u = this.raycaster.intersectObjects(this.intersectableObjects, !0);
      if (u.length > 0) {
        c = r.clone().multiplyScalar(-1).angleTo(u[0].face.normal), f += u[0].distance;
        const d = u[0].object.parent;
        for (let I = 0; I < t.length; I++) {
          const R = t[I];
          let v = 1;
          d.kind === "surface" && (v = d.reflectionFunction(R, c)), i[I] *= v;
          const S = e.initialIntensity / i[I] > 1e6;
          S && (a[I] = f / n), p = p || S;
        }
        u[0].object.parent instanceof J && (u[0].object.parent.numHits += 1);
        const y = u[0].face.normal.normalize();
        r.sub(y.clone().multiplyScalar(r.dot(y)).multiplyScalar(2)).normalize(), l.copy(u[0].point), g = u[0];
      }
      h += 1;
    }
    return this.stats.numRaysShot.value++, {
      distance: f,
      rt60s: a,
      angle: c,
      direction: r,
      lastIntersection: g
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
      const t = Math.random() * D.getState().containers[this.sourceIDs[e]].theta, s = Math.random() * D.getState().containers[this.sourceIDs[e]].phi, n = D.getState().containers[this.sourceIDs[e]].position, a = D.getState().containers[this.sourceIDs[e]].rotation;
      let l = xe(s, t);
      const r = new b.Vector3().setFromSphericalCoords(1, l[0], l[1]);
      r.applyEuler(a), D.getState().containers[this.sourceIDs[e]].directivityHandler;
      const i = this.traceRay(n, r, this.reflectionOrder, 1, this.sourceIDs[e], s, t);
      if (i) {
        if (this._runningWithoutReceivers) {
          this.appendRay(
            [n.x, n.y, n.z],
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
          const h = i.chain[i.chain.length - 1].object;
          this.paths[h] ? this.paths[h].push(i) : this.paths[h] = [i], D.getState().containers[this.sourceIDs[e]].numRays += 1;
        } else if (i.intersectedReceiver) {
          this.appendRay(
            [n.x, n.y, n.z],
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
          const h = i.chain[i.chain.length - 1].object;
          this.paths[h] ? this.paths[h].push(i) : this.paths[h] = [i], D.getState().containers[this.sourceIDs[e]].numRays += 1;
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
      const t = this.__calc_time / 1e3, s = this.paths[e].length, n = s / t, a = this.__num_checked_paths, l = a / t;
      console.log({
        calc_time: t,
        num_valid_rays: s,
        valid_ray_rate: n,
        num_checks: a,
        check_rate: l
      }), this.paths[e].forEach((r) => {
        r.time = 0, r.totalLength = 0;
        for (let c = 0; c < r.chain.length; c++)
          r.totalLength += r.chain[c].distance, r.time += r.chain[c].distance / 343.2;
      });
    }), this.mapIntersectableObjects(), this.reportImpulseResponse();
  }
  async reportImpulseResponse() {
    var n, a;
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = D.getState().containers, t = _.sampleRate, s = [];
    for (const l of this.sourceIDs)
      for (const r of this.receiverIDs) {
        if (!this.paths[r] || this.paths[r].length === 0) continue;
        const c = this.paths[r].filter((i) => i.source === l);
        c.length > 0 && s.push({ sourceId: l, receiverId: r, paths: c });
      }
    if (s.length !== 0) {
      O("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let l = 0; l < s.length; l++) {
        const { sourceId: r, receiverId: c, paths: i } = s[l], h = ((n = e[r]) == null ? void 0 : n.name) || "Source", o = ((a = e[c]) == null ? void 0 : a.name) || "Receiver", p = Math.round(l / s.length * 100);
        O("UPDATE_PROGRESS", {
          progress: p,
          message: `Calculating IR: ${h} → ${o}`
        });
        try {
          const { normalizedSignal: f } = await this.calculateImpulseResponseForPair(r, c, i);
          r === this.sourceIDs[0] && c === this.receiverIDs[0] && this.calculateImpulseResponse().then((v) => {
            this.impulseResponse = v;
          }).catch(console.error);
          const u = Math.max(1, Math.floor(f.length / 2e3)), d = [];
          for (let v = 0; v < f.length; v += u)
            d.push({
              time: v / t,
              amplitude: f[v]
            });
          const y = `${this.uuid}-ir-${r}-${c}`, I = Q.getState().results[y], R = {
            kind: X.ImpulseResponse,
            name: `IR: ${h} → ${o}`,
            uuid: y,
            from: this.uuid,
            info: {
              sampleRate: t,
              sourceName: h,
              receiverName: o,
              sourceId: r,
              receiverId: c
            },
            data: d
          };
          I ? O("UPDATE_RESULT", { uuid: y, result: R }) : O("ADD_RESULT", R);
        } catch (f) {
          console.error(`Failed to calculate impulse response for ${r} -> ${c}:`, f);
        }
      }
      O("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(e, t, s, n = 100, a = F(63, 16e3), l = _.sampleRate) {
    if (s.length === 0) throw Error("No rays have been traced for this pair");
    let r = s.sort((f, g) => f.time - g.time);
    const c = r[r.length - 1].time + 0.05, i = Array(a.length).fill(n), h = x(l * c) * 2;
    let o = [];
    for (let f = 0; f < a.length; f++)
      o.push(new Float32Array(h));
    for (let f = 0; f < r.length; f++) {
      const g = M() ? 1 : -1, u = r[f].time, d = this.arrivalPressure(i, a, r[f]).map((I) => I * g), y = x(u * l);
      for (let I = 0; I < a.length; I++)
        o[I][y] += d[I];
    }
    const p = j();
    return new Promise((f, g) => {
      p.postMessage({ samples: o }), p.onmessage = (u) => {
        const d = u.data.samples, y = new Float32Array(d[0].length >> 1);
        for (let R = 0; R < d.length; R++)
          for (let v = 0; v < y.length; v++)
            y[v] += d[R][v];
        const I = z(y.slice());
        p.terminate(), f({ signal: y, normalizedSignal: I });
      }, p.onerror = (u) => {
        p.terminate(), g(u);
      };
    });
  }
  async calculateImpulseResponseForDisplay(e = 100, t = F(63, 16e3), s = _.sampleRate) {
    if (this.receiverIDs.length == 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length == 0) throw Error("No sources have been assigned to the raytracer");
    if (this.paths[this.receiverIDs[0]].length == 0) throw Error("No rays have been traced yet");
    let n = this.paths[this.receiverIDs[0]].sort((h, o) => h.time - o.time);
    const a = n[n.length - 1].time + 0.05, l = Array(t.length).fill(e), r = x(s * a) * 2;
    let c = [];
    for (let h = 0; h < t.length; h++)
      c.push(new Float32Array(r));
    for (let h = 0; h < n.length; h++) {
      const o = M() ? 1 : -1, p = n[h].time, f = this.arrivalPressure(l, t, n[h]).map((u) => u * o), g = x(p * s);
      for (let u = 0; u < t.length; u++)
        c[u][g] += f[u];
    }
    const i = j();
    return new Promise((h, o) => {
      i.postMessage({ samples: c }), i.onmessage = (p) => {
        const f = p.data.samples, g = new Float32Array(f[0].length >> 1);
        for (let d = 0; d < f.length; d++)
          for (let y = 0; y < g.length; y++)
            g[y] += f[d][y];
        const u = z(g.slice());
        i.terminate(), h({ signal: g, normalizedSignal: u });
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
      s.from === this.uuid && s.kind === X.ImpulseResponse && O("REMOVE_RESULT", t);
    });
  }
  calculateWithDiffuse(e = this.reflectionLossFrequencies) {
    this.allReceiverData = [];
    const t = Object.keys(this.paths), s = D.getState().containers[this.receiverIDs[0]].scale.x, n = D.getState().containers[this.receiverIDs[0]].position;
    t.forEach((l) => {
      const r = new Me(l);
      this.paths[l].forEach((c) => {
        const i = {
          time: 0,
          energy: []
        };
        let h = !1;
        c.chain.forEach((o) => {
          const p = this.receiverIDs.includes(o.object) ? D.getState().containers[o.object] : this.room.surfaceMap[o.object];
          if (p && p.kind) {
            if (p.kind === "receiver")
              h = !0;
            else if (p.kind === "surface") {
              const f = p, g = {
                time: o.time_rec,
                energy: []
              };
              e.forEach((u, d) => {
                const y = P(f.reflectionFunction(u, o.angle_in));
                if (!i.energy[d])
                  i.energy[d] = {
                    frequency: u,
                    value: y
                  };
                else {
                  i.energy[d].value *= y, i.time = o.total_time;
                  const I = new b.Vector3(
                    n.x - o.point[0],
                    n.y - o.point[1],
                    n.z - o.point[2]
                  ), R = new b.Vector3().fromArray(o.faceNormal).angleTo(I);
                  g.energy[d] = {
                    frequency: u,
                    value: Se(
                      i.energy[d].value,
                      f.absorptionFunction(u),
                      0.1,
                      Te(s / I.length()),
                      R
                    )
                  };
                }
              }), g.energy.length > 0 && r.data.push(g);
            }
          }
        }), h && r.data.push(i);
      }), r.data = be(r.data).asc((c) => c.time), this.allReceiverData.push(r);
    });
    const a = this.allReceiverData.map((l) => e.map((r) => ({
      label: r.toString(),
      x: l.data.map((c) => c.time),
      y: l.data.map((c) => c.energy.filter((i) => i.frequency == r)[0].value)
    })));
    return T.postMessage("UPDATE_CHART_DATA", a && a[0]), this.allReceiverData;
  }
  reflectionLossFunction(e, t, s) {
    const n = t.chain.slice(0, -1);
    if (n && n.length > 0) {
      let a = 1;
      for (let l = 0; l < n.length; l++) {
        const r = n[l], c = e.surfaceMap[r.object], i = r.angle || 0;
        a = a * P(c.reflectionFunction(s, i));
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
    const n = Object.keys(this.paths);
    for (let a = 0; a < n.length; a++) {
      this.allReceiverData.push({
        id: n[a],
        data: []
      });
      for (let l = 0; l < this.paths[n[a]].length; l++) {
        const r = this.paths[n[a]][l];
        let c;
        e ? (c = e.map((i) => ({
          frequency: i,
          value: this.reflectionLossFunction(this.room, r, i)
        })), e.forEach((i, h) => {
          s[h].data.push([r.time, this.reflectionLossFunction(this.room, r, i)]);
        })) : c = (i) => this.reflectionLossFunction(this.room, r, i), this.allReceiverData[this.allReceiverData.length - 1].data.push({
          time: r.time,
          energy: c
        });
      }
      this.allReceiverData[this.allReceiverData.length - 1].data = this.allReceiverData[this.allReceiverData.length - 1].data.sort((l, r) => l.time - r.time);
    }
    for (let a = 0; a < s.length; a++)
      s[a].data = s[a].data.sort((l, r) => l[0] - r[0]), s[a].x = s[a].data.map((l) => l[0]), s[a].y = s[a].data.map((l) => l[1]);
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
      const s = this.allReceiverData[e].data, n = s[s.length - 1].time, a = x(t * n), l = [];
      for (let r = 0, c = 0; r < a; r++) {
        let i = r / a * n;
        if (s[c] && s[c].time) {
          let h = s[c].time;
          if (h > i) {
            l.push([i].concat(Array(s[c].energy.length).fill(0)));
            continue;
          }
          if (h <= i) {
            let o = s[c].energy.map((f) => 0), p = 0;
            for (; h <= i; )
              h = s[c].time, o.forEach((f, g, u) => u[g] += s[c].energy[g].value), c++, p++;
            l.push([i, ...o.map((f) => f / p)]);
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
      return s.map((n) => n.join(",")).join(`
`);
  }
  getReceiverIntersectionPoints(e) {
    return this.paths && this.paths[e] && this.paths[e].length > 0 ? this.paths[e].map(
      (t) => new b.Vector3().fromArray(t.chain[t.chain.length - 1].point)
    ) : [];
  }
  calculateResponseByIntensity(e = this.defaultFrequencies, t = 20) {
    const s = this.indexedPaths, n = q(t), a = N(e);
    this.responseByIntensity = {};
    for (const l in s) {
      this.responseByIntensity[l] = {};
      for (const r in s[l]) {
        this.responseByIntensity[l][r] = {
          freqs: e,
          response: []
        }, V(L(D.getState().containers[r].initialSPL));
        for (let c = 0; c < s[l][r].length; c++) {
          let i = 0, h = [], o = s[l][r][c].initialPhi, p = s[l][r][c].initialTheta, f = D.getState().containers[r].directivityHandler;
          for (let u = 0; u < e.length; u++)
            h[u] = V(f.getPressureAtPosition(0, e[u], o, p));
          for (let u = 0; u < s[l][r][c].chain.length; u++) {
            const { angle: d, distance: y } = s[l][r][c].chain[u];
            i += y / n;
            const I = s[l][r][c].chain[u].object, R = D.getState().containers[I] || this.room.surfaceMap[I] || null;
            for (let v = 0; v < e.length; v++) {
              const S = e[v];
              let E = 1;
              R && R.kind === "surface" && (E = R.reflectionFunction(S, d)), h.push(V(
                L(H(U(h[v] * E)) - a[v] * y)
              ));
            }
          }
          const g = H(U(h));
          this.responseByIntensity[l][r].response.push({
            time: i,
            level: g,
            bounces: s[l][r][c].chain.length
          });
        }
        this.responseByIntensity[l][r].response.sort((c, i) => c.time - i.time);
      }
    }
    return this.resampleResponseByIntensity();
  }
  resampleResponseByIntensity(e = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      for (const t in this.responseByIntensity)
        for (const s in this.responseByIntensity[t]) {
          const { response: n, freqs: a } = this.responseByIntensity[t][s], l = n[n.length - 1].time, r = x(e * l);
          this.responseByIntensity[t][s].resampledResponse = Array(a.length).fill(0).map((p) => new Float32Array(r)), this.responseByIntensity[t][s].sampleRate = e;
          let c = 0, i = [], h = a.map((p) => 0), o = !1;
          for (let p = 0, f = 0; p < r; p++) {
            let g = p / r * l;
            if (n[f] && n[f].time) {
              let u = n[f].time;
              if (u > g) {
                for (let d = 0; d < a.length; d++)
                  this.responseByIntensity[t][s].resampledResponse[d][c] = 0;
                o && i.push(c), c++;
                continue;
              }
              if (u <= g) {
                let d = n[f].level.map((y) => 0);
                for (; u <= g; ) {
                  u = n[f].time;
                  for (let y = 0; y < a.length; y++)
                    d[y] = ue([d[y], n[f].level[y]]);
                  f++;
                }
                for (let y = 0; y < a.length; y++) {
                  if (this.responseByIntensity[t][s].resampledResponse[y][c] = d[y], i.length > 0) {
                    const I = h[y], R = d[y];
                    for (let v = 0; v < i.length; v++) {
                      const S = fe(I, R, (v + 1) / (i.length + 1));
                      this.responseByIntensity[t][s].resampledResponse[y][i[v]] = S;
                    }
                  }
                  h[y] = d[y];
                }
                i.length > 0 && (i = []), o = !0, c++;
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
    const s = this.receiverIDs, n = this.sourceIDs;
    if (s.length > 0 && n.length > 0) {
      const a = e || s[0], l = t || n[0], r = this.responseByIntensity[a][l].resampledResponse, c = this.responseByIntensity[a][l].sampleRate;
      if (this.responseByIntensity[a][l].freqs, r && c) {
        const i = new Float32Array(r[0].length);
        for (let h = 0; h < r[0].length; h++)
          i[h] = h / c;
        this.responseByIntensity[a][l].t30 = r.map((h) => {
          let o = 0, p = h[o];
          for (; p === 0; )
            p = h[o++];
          for (let d = o; d >= 0; d--)
            h[d] = p;
          const f = p - 30, u = G(h, 2).filter((d) => d >= f).length;
          return K(i.slice(0, u), h.slice(0, u));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT20(e, t) {
    const s = this.receiverIDs, n = this.sourceIDs;
    if (s.length > 0 && n.length > 0) {
      const a = e || s[0], l = t || n[0], r = this.responseByIntensity[a][l].resampledResponse, c = this.responseByIntensity[a][l].sampleRate;
      if (this.responseByIntensity[a][l].freqs, r && c) {
        const i = new Float32Array(r[0].length);
        for (let h = 0; h < r[0].length; h++)
          i[h] = h / c;
        this.responseByIntensity[a][l].t20 = r.map((h) => {
          let o = 0, p = h[o];
          for (; p === 0; )
            p = h[o++];
          for (let d = o; d >= 0; d--)
            h[d] = p;
          const f = p - 20, u = G(h, 2).filter((d) => d >= f).length;
          return K(i.slice(0, u), h.slice(0, u));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT60(e, t) {
    const s = this.receiverIDs, n = this.sourceIDs;
    if (s.length > 0 && n.length > 0) {
      const a = e || s[0], l = t || n[0], r = this.responseByIntensity[a][l].resampledResponse, c = this.responseByIntensity[a][l].sampleRate;
      if (this.responseByIntensity[a][l].freqs, r && c) {
        const i = new Float32Array(r[0].length);
        for (let h = 0; h < r[0].length; h++)
          i[h] = h / c;
        this.responseByIntensity[a][l].t60 = r.map((h) => {
          let o = 0, p = h[o];
          for (; p === 0; )
            p = h[o++];
          for (let d = o; d >= 0; d--)
            h[d] = p;
          const f = p - 60, u = G(h, 2).filter((d) => d >= f).length;
          return K(i.slice(0, u), h.slice(0, u));
        });
      }
    }
    return this.responseByIntensity;
  }
  computeImageSources(e, t, s) {
    for (const n of this.room.allSurfaces)
      n.uuid, t.uuid;
  }
  onParameterConfigFocus() {
    console.log("focus"), console.log(w.overlays.global.cells), w.overlays.global.showCell(this.uuid + "-valid-ray-count");
  }
  onParameterConfigBlur() {
    console.log("blur"), w.overlays.global.hideCell(this.uuid + "-valid-ray-count");
  }
  pathsToLinearBuffer() {
    const e = (n) => n.split("").map((a) => a.charCodeAt(0)), t = (n) => n.map((a) => [
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
      Object.keys(this.paths).map((n) => {
        const a = this.paths[n].map((l) => [
          ...e(l.source),
          l.chainLength,
          l.time,
          Number(l.intersectedReceiver),
          l.energy,
          ...t(l.chain)
        ]).flat();
        return [...e(n), a.length, ...a];
      }).flat()
    );
  }
  linearBufferToPaths(e) {
    const n = (i) => String.fromCharCode(...i), a = (i) => {
      let h = 0;
      const o = n(i.slice(h, h += 36)), p = i[h++], f = i[h++], g = i[h++], u = i[h++], d = i[h++], y = [i[h++], i[h++], i[h++]], I = [i[h++], i[h++], i[h++]];
      return {
        object: o,
        angle: p,
        distance: f,
        energy: g,
        faceIndex: u,
        faceMaterialIndex: d,
        faceNormal: y,
        point: I
      };
    }, l = (i) => {
      const h = [];
      let o = 0;
      for (; o < i.length; ) {
        n(i.slice(o, o += 36));
        const p = i[o++];
        i[o++], i[o++], i[o++];
        const f = [];
        for (let g = 0; g < p; g++)
          f.push(a(i.slice(o, o += 47)));
      }
      return h;
    };
    let r = 0;
    const c = {};
    for (; r < e.length; ) {
      const i = n(e.slice(r, r += 36)), h = e[r++], o = l(e.slice(r, r += h));
      c[i] = o;
    }
    return c;
  }
  arrivalPressure(e, t, s) {
    const n = V(L(e));
    s.chain.slice(0, -1).forEach((r) => {
      const c = D.getState().containers[r.object];
      n.forEach((i, h) => {
        let o;
        t[h] === 16e3 ? o = 1 - c.absorptionFunction(t[8e3]) : o = 1 - c.absorptionFunction(t[h]), n[h] = i * o;
      });
    });
    const a = H(U(n)), l = N(t);
    return t.forEach((r, c) => a[c] -= l[c] * s.totalLength), L(a);
  }
  async calculateImpulseResponse(e = 100, t = F(63, 16e3), s = _.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let n = this.paths[this.receiverIDs[0]].sort((h, o) => h.time - o.time);
    const a = n[n.length - 1].time + 0.05, l = Array(t.length).fill(e), r = x(s * a) * 2;
    let c = [];
    for (let h = 0; h < t.length; h++)
      c.push(new Float32Array(r));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let f = 0; f < n.length; f++)
        n[f].chainLength - 1 <= this.transitionOrder && n.splice(f, 1);
      let h = {
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
      }, p = new Re(h, !0).returnSortedPathsForHybrid(343, l, t);
      for (let f = 0; f < p.length; f++) {
        const g = M() ? 1 : -1, u = p[f].time, d = x(u * s);
        for (let y = 0; y < t.length; y++)
          c[y][d] += p[f].pressure[y] * g;
      }
    }
    for (let h = 0; h < n.length; h++) {
      const o = M() ? 1 : -1, p = n[h].time, f = this.arrivalPressure(l, t, n[h]).map((u) => u * o), g = x(p * s);
      for (let u = 0; u < t.length; u++)
        c[u][g] += f[u];
    }
    const i = j();
    return new Promise((h, o) => {
      i.postMessage({ samples: c }), i.onmessage = (p) => {
        const f = p.data.samples, g = new Float32Array(f[0].length >> 1);
        let u = 0;
        for (let R = 0; R < f.length; R++)
          for (let v = 0; v < g.length; v++)
            g[v] += f[R][v], P(g[v]) > u && (u = P(g[v]));
        const d = z(g), y = _.createOfflineContext(1, g.length, s), I = _.createBufferSource(d, y);
        I.connect(y.destination), I.start(), _.renderContextAsync(y).then((R) => h(R)).catch(o).finally(() => i.terminate());
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
  async calculateAmbisonicImpulseResponse(e = 1, t = 100, s = F(63, 16e3), n = _.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");
    const a = this.paths[this.receiverIDs[0]].sort((p, f) => p.time - f.time);
    if (a.length === 0) throw Error("No valid ray paths found");
    const l = a[a.length - 1].time + 0.05;
    if (l <= 0) throw Error("Invalid impulse response duration");
    const r = Array(s.length).fill(t), c = x(n * l) * 2;
    if (c < 2) throw Error("Impulse response too short to process");
    const i = Ie(e), h = [];
    for (let p = 0; p < s.length; p++) {
      h.push([]);
      for (let f = 0; f < i; f++)
        h[p].push(new Float32Array(c));
    }
    for (let p = 0; p < a.length; p++) {
      const f = a[p], g = M() ? 1 : -1, u = f.time, d = this.arrivalPressure(r, s, f).map((v) => v * g), y = x(u * n);
      if (y >= c) continue;
      const I = f.arrivalDirection || [0, 0, 1], R = new Float32Array(1);
      for (let v = 0; v < s.length; v++) {
        R[0] = d[v];
        const S = ve(R, I[0], I[1], I[2], e, "threejs");
        for (let E = 0; E < i; E++)
          h[v][E][y] += S[E][0];
      }
    }
    const o = j();
    return new Promise((p, f) => {
      const g = async (u) => new Promise((d) => {
        const y = [];
        for (let R = 0; R < s.length; R++)
          y.push(h[R][u]);
        const I = j();
        I.postMessage({ samples: y }), I.onmessage = (R) => {
          const v = R.data.samples, S = new Float32Array(v[0].length >> 1);
          for (let E = 0; E < v.length; E++)
            for (let k = 0; k < S.length; k++)
              S[k] += v[E][k];
          I.terminate(), d(S);
        };
      });
      Promise.all(
        Array.from({ length: i }, (u, d) => g(d))
      ).then((u) => {
        let d = 0;
        for (const v of u)
          for (let S = 0; S < v.length; S++)
            P(v[S]) > d && (d = P(v[S]));
        if (d > 0)
          for (const v of u)
            for (let S = 0; S < v.length; S++)
              v[S] /= d;
        const y = u[0].length;
        if (y === 0) {
          o.terminate(), f(new Error("Filtered signal has zero length"));
          return;
        }
        const R = _.createOfflineContext(i, y, n).createBuffer(i, y, n);
        for (let v = 0; v < i; v++)
          R.copyToChannel(new Float32Array(u[v]), v);
        o.terminate(), p(R);
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
    _.context.state === "suspended" && _.context.resume(), console.log(this.impulseResponse);
    const e = _.context.createBufferSource();
    e.buffer = this.impulseResponse, e.connect(_.context.destination), e.start(), O("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(_.context.destination), O("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  downloadImpulses(e, t = 100, s = F(125, 8e3), n = 44100) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    const a = this.paths[this.receiverIDs[0]].sort((o, p) => o.time - p.time), l = a[a.length - 1].time + 0.05, r = Array(s.length).fill(t), c = x(n * l), i = [];
    for (let o = 0; o < s.length; o++)
      i.push(new Float32Array(c));
    let h = 0;
    for (let o = 0; o < a.length; o++) {
      const p = M() ? 1 : -1, f = a[o].time, g = this.arrivalPressure(r, s, a[o]).map((d) => d * p), u = x(f * n);
      for (let d = 0; d < s.length; d++)
        i[d][u] += g[d], P(i[d][u]) > h && (h = P(i[d][u]));
    }
    for (let o = 0; o < s.length; o++) {
      const p = W([pe(i[o])], { sampleRate: n, bitDepth: 32 });
      $.saveAs(p, `${s[o]}_${e}.wav`);
    }
  }
  async downloadImpulseResponse(e, t = _.sampleRate) {
    if (!this.impulseResponse)
      try {
        this.impulseResponse = await this.calculateImpulseResponse();
      } catch (a) {
        throw a;
      }
    const s = W([z(this.impulseResponse.getChannelData(0))], { sampleRate: t, bitDepth: 32 }), n = e.endsWith(".wav") ? "" : ".wav";
    $.saveAs(s, e + n);
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
    const s = this.ambisonicImpulseResponse.numberOfChannels, n = this.ambisonicImpulseResponse.sampleRate, a = [];
    for (let i = 0; i < s; i++)
      a.push(this.ambisonicImpulseResponse.getChannelData(i));
    const l = W(a, { sampleRate: n, bitDepth: 32 }), r = e.endsWith(".wav") ? "" : ".wav", c = t === 1 ? "FOA" : `HOA${t}`;
    $.saveAs(l, `${e}_${c}${r}`);
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
        const n = this.paths[t][s].source;
        e[t][n] ? e[t][n].push(this.paths[t][s]) : e[t][n] = [this.paths[t][s]];
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
C("RAYTRACER_CALL_METHOD", de);
C("RAYTRACER_SET_PROPERTY", me);
C("REMOVE_RAYTRACER", ge);
C("ADD_RAYTRACER", ye(Fe));
C("RAYTRACER_CLEAR_RAYS", (m) => void B.getState().solvers[m].clearRays());
C("RAYTRACER_PLAY_IR", (m) => {
  B.getState().solvers[m].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
C("RAYTRACER_DOWNLOAD_IR", (m) => {
  var l, r;
  const e = B.getState().solvers[m], t = D.getState().containers, s = e.sourceIDs.length > 0 && ((l = t[e.sourceIDs[0]]) == null ? void 0 : l.name) || "source", n = e.receiverIDs.length > 0 && ((r = t[e.receiverIDs[0]]) == null ? void 0 : r.name) || "receiver", a = `ir-${s}-${n}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(a).catch((c) => {
    window.alert(c.message || "Failed to download impulse response");
  });
});
C("RAYTRACER_DOWNLOAD_IR_OCTAVE", (m) => void B.getState().solvers[m].downloadImpulses(m));
C("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: m, order: e }) => {
  var r, c;
  const t = B.getState().solvers[m], s = D.getState().containers, n = t.sourceIDs.length > 0 && ((r = s[t.sourceIDs[0]]) == null ? void 0 : r.name) || "source", a = t.receiverIDs.length > 0 && ((c = s[t.receiverIDs[0]]) == null ? void 0 : c.name) || "receiver", l = `ir-${n}-${a}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(l, e).catch((i) => {
    window.alert(i.message || "Failed to download ambisonic impulse response");
  });
});
export {
  Me as ReceiverData,
  Fe as default,
  A as defaults
};
//# sourceMappingURL=index-DFZnSMBO.mjs.map
