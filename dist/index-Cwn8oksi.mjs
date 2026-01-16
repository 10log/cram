import { S as ae } from "./solver-BGevQtbj.mjs";
import * as S from "three";
import { computeBoundsTree as oe, disposeBoundsTree as le, acceleratedRaycast as ce } from "three-mesh-bvh";
import { r as w, t as T, k as D, X as J, A as N, w as _, e as O, R as Q, Y as F, z as V, L, s as H, I as U, Z as he, _ as ue, x as W, y as fe, F as $, $ as X, o as C, a0 as pe, B as de, C as me, D as ge, f as B } from "./index-CgcZvXNw.mjs";
import { e as ye, g as ve } from "./ambisonics.es-Ci32Q6qr.mjs";
import { ImageSourceSolver as Ie } from "./index-DVF6ksxn.mjs";
var te = function(m) {
  return function(e, t, s) {
    return m(e, t, s) * s;
  };
}, Z = function(m, e) {
  if (m)
    throw Error("Invalid sort config: " + e);
}, se = function(m) {
  var e = m || {}, t = e.asc, s = e.desc, n = t ? 1 : -1, a = t || s;
  Z(!a, "Expected `asc` or `desc` property"), Z(t && s, "Ambiguous object with `asc` and `desc` config properties");
  var c = m.comparer && te(m.comparer);
  return { order: n, sortBy: a, comparer: c };
}, Re = function(m) {
  return function e(t, s, n, a, c, i, l) {
    var r, h;
    if (typeof t == "string")
      r = i[t], h = l[t];
    else if (typeof t == "function")
      r = t(i), h = t(l);
    else {
      var o = se(t);
      return e(o.sortBy, s, n, o.order, o.comparer || m, i, l);
    }
    var f = c(r, h, a);
    return (f === 0 || r == null && h == null) && s.length > n ? e(s[n], s, n + 1, a, c, i, l) : f;
  };
};
function ne(m, e, t) {
  if (m === void 0 || m === !0)
    return function(a, c) {
      return e(a, c, t);
    };
  if (typeof m == "string")
    return Z(m.includes("."), "String syntax not allowed for nested properties."), function(a, c) {
      return e(a[m], c[m], t);
    };
  if (typeof m == "function")
    return function(a, c) {
      return e(m(a), m(c), t);
    };
  if (Array.isArray(m)) {
    var s = Re(e);
    return function(a, c) {
      return s(m[0], m, 1, t, e, a, c);
    };
  }
  var n = se(m);
  return ne(n.sortBy, n.comparer || e, n.order);
}
var Y = function(m, e, t, s) {
  var n;
  return Array.isArray(e) ? (Array.isArray(t) && t.length < 2 && (n = t, t = n[0]), e.sort(ne(t, s, m))) : e;
};
function re(m) {
  var e = te(m.comparer);
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
var ie = function(m, e, t) {
  return m == null ? t : e == null ? -t : typeof m != typeof e ? typeof m < typeof e ? -1 : 1 : m < e ? -1 : m > e ? 1 : 0;
}, De = re({
  comparer: ie
});
re({
  comparer: ie,
  inPlaceSorting: !0
});
const { cos: q } = Math;
function be(m, e, t, s, n) {
  return m * (1 - e) * t * (1 - q(s / 2)) * 2 * q(n);
}
const Se = `attribute vec2 color;
varying vec2 vColor;
uniform float pointScale;
void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = pointScale*(color.x/4.0+0.5);
  gl_Position = projectionMatrix * mvPosition;
  
}`, we = `varying vec2 vColor;
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
  
}`, ee = {
  vs: Se,
  fs: we
};
function G(m, e = 1) {
  let t = m.slice();
  for (let s = 0; s < m.length; s++)
    if (s >= e && s < m.length - e) {
      const n = s - e, a = s + e;
      let c = 0;
      for (let i = n; i < a; i++)
        c += m[i];
      t[s] = c / (2 * e);
    }
  return t;
}
function Ae(m) {
  var e, t, s = m.length;
  if (s === 1)
    e = 0, t = m[0][1];
  else {
    for (var n = 0, a = 0, c = 0, i = 0, l, r, h, o = 0; o < s; o++)
      l = m[o], r = l[0], h = l[1], n += r, a += h, c += r * r, i += r * h;
    e = (s * i - n * a) / (s * c - n * n), t = a / s - e * n / s;
  }
  return {
    m: e,
    b: t
  };
}
function K(m, e) {
  const t = m.length, s = [];
  for (let l = 0; l < t; l++)
    s.push([m[l], e[l]]);
  const { m: n, b: a } = Ae(s);
  return { m: n, b: a, fx: (l) => n * l + a, fy: (l) => (l - a) / n };
}
function _e(m, e) {
  let t = (360 - m) * (Math.PI / 180);
  return [e * (Math.PI / 180), t];
}
class xe {
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
function Ee(m, e) {
  return new xe(m);
}
function Pe(m) {
  return Math.random() < m;
}
const j = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
)), { floor: x, random: Ce, abs: P, asin: Oe } = Math, M = () => Ce() > 0.5;
function z(m) {
  let e = Math.abs(m[0]);
  for (let t = 1; t < m.length; t++)
    Math.abs(m[t]) > e && (e = Math.abs(m[t]));
  if (e !== 0)
    for (let t = 0; t < m.length; t++)
      m[t] /= e;
  return m;
}
S.BufferGeometry.prototype.computeBoundsTree = oe;
S.BufferGeometry.prototype.disposeBoundsTree = le;
S.Mesh.prototype.raycast = ce;
class Te {
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
class Me extends ae {
  constructor(e) {
    super(e), this.update = () => {
    }, this.rayPositionIndexDidOverflow = !1, this.ambisonicOrder = 1, this.impulseResponsePlaying = !1, this.kind = "ray-tracer", e = { ...A, ...e }, this.uuid = e.uuid || this.uuid, this.name = e.name || A.name, this.observed_name = Ee(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = e.sourceIDs || A.sourceIDs, this.surfaceIDs = e.surfaceIDs || A.surfaceIDs, this.roomID = e.roomID || A.roomID, this.receiverIDs = e.receiverIDs || A.receiverIDs, this.updateInterval = e.updateInterval || A.updateInterval, this.reflectionOrder = e.reflectionOrder || A.reflectionOrder, this._isRunning = e.isRunning || A.isRunning, this._runningWithoutReceivers = e.runningWithoutReceivers || A.runningWithoutReceivers, this.reflectionLossFrequencies = [4e3], this.intervals = [], this.plotData = [], this.plotStyle = e.plotStyle || A.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = e.pointSize || A.pointSize, this.validRayCount = 0, this.defaultFrequencies = [1e3], this.intensitySampleRate = 256, this.quickEstimateResults = {};
    const t = typeof e.raysVisible == "boolean";
    this._raysVisible = t ? e.raysVisible : A.raysVisible;
    const s = typeof e.pointsVisible == "boolean";
    this._pointsVisible = s ? e.pointsVisible : A.pointsVisible;
    const n = typeof e.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = n ? e.invertedDrawStyle : A.invertedDrawStyle, this.passes = e.passes || A.passes, this.raycaster = new S.Raycaster(), this.rayBufferGeometry = new S.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new S.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(S.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new S.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(S.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.rays = new S.LineSegments(
      this.rayBufferGeometry,
      new S.LineBasicMaterial({
        fog: !1,
        color: 2631977,
        transparent: !0,
        opacity: 0.2,
        premultipliedAlpha: !0,
        blending: S.NormalBlending,
        depthFunc: S.AlwaysDepth,
        name: "raytracer-rays-material"
        // depthTest: false
      })
    ), this.rays.renderOrder = -0.5, this.rays.frustumCulled = !1, w.scene.add(this.rays);
    var a = new S.ShaderMaterial({
      fog: !1,
      vertexShader: ee.vs,
      fragmentShader: ee.fs,
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
      blending: S.NormalBlending,
      name: "raytracer-points-material"
    });
    this.hits = new S.Points(this.rayBufferGeometry, a), this.hits.frustumCulled = !1, w.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
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
      formatter: (c) => String(c)
    }), this.messageHandlerIDs = [], T.postMessage("STATS_SETUP", this.stats), this.messageHandlerIDs.push(
      T.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (c, ...i) => {
        console.log(i && i[0] && i[0] instanceof Array && i[1] && i[1] === this.uuid), i && i[0] && i[0] instanceof Array && i[1] && i[1] === this.uuid && (this.sourceIDs = i[0].map((l) => l.id));
      })
    ), this.messageHandlerIDs.push(
      T.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (c, ...i) => {
        i && i[0] && i[0] instanceof Array && i[1] && i[1] === this.uuid && (this.receiverIDs = i[0].map((l) => l.id));
      })
    ), this.messageHandlerIDs.push(
      T.addMessageHandler("SHOULD_REMOVE_CONTAINER", (c, ...i) => {
        const l = i[0];
        l && (console.log(l), this.sourceIDs.includes(l) ? this.sourceIDs = this.sourceIDs.filter((r) => r != l) : this.receiverIDs.includes(l) && (this.receiverIDs = this.receiverIDs.filter((r) => r != l)));
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
      sourceIDs: c,
      surfaceIDs: i,
      receiverIDs: l,
      updateInterval: r,
      passes: h,
      pointSize: o,
      reflectionOrder: f,
      runningWithoutReceivers: p,
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
      sourceIDs: c,
      surfaceIDs: i,
      receiverIDs: l,
      updateInterval: r,
      passes: h,
      pointSize: o,
      reflectionOrder: f,
      runningWithoutReceivers: p,
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
    const s = e.getPlane(new S.Plane()), n = new S.Vector4(s.normal.x, s.normal.y, s.normal.z, s.constant), a = new S.Vector4(t.a.x, t.a.y, t.a.z, 1), c = new S.Vector4(t.b.x, t.b.y, t.b.z, 1), i = new S.Vector4(t.c.x, t.c.y, t.c.z, 1);
    return n.dot(a) > 0 || n.dot(c) > 0 || n.dot(i) > 0;
  }
  traceRay(e, t, s, n, a, c, i, l = 1, r = [], h = 4e3) {
    var f;
    t = t.normalize(), this.raycaster.ray.origin = e, this.raycaster.ray.direction = t;
    const o = this.raycaster.intersectObjects(this.intersectableObjects, !0);
    if (o.length > 0) {
      if (((f = o[0].object.userData) == null ? void 0 : f.kind) === "receiver") {
        const p = o[0].face && t.clone().multiplyScalar(-1).angleTo(o[0].face.normal);
        r.push({
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
          energy: n
        });
        const g = t.clone().normalize().negate(), u = [g.x, g.y, g.z];
        return {
          chain: r,
          chainLength: r.length,
          intersectedReceiver: !0,
          energy: n,
          source: a,
          initialPhi: c,
          initialTheta: i,
          arrivalDirection: u
        };
      } else {
        const p = o[0].face && t.clone().multiplyScalar(-1).angleTo(o[0].face.normal);
        r.push({
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
          energy: n
        }), o[0].object.parent instanceof J && (o[0].object.parent.numHits += 1);
        const g = o[0].face && o[0].face.normal.normalize();
        let u = g && o[0].face && t.clone().sub(g.clone().multiplyScalar(t.dot(g.clone())).multiplyScalar(2));
        const d = o[0].object.parent._scatteringCoefficient;
        Pe(d) && (u = new S.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), g.dot(u) < 0 && u.multiplyScalar(-1));
        const y = n * P(o[0].object.parent.reflectionFunction(h, p));
        if (u && g && y > 1 / 2 ** 16 && l < s + 1)
          return this.traceRay(
            o[0].point.clone().addScaledVector(g.clone(), 0.01),
            u,
            s,
            y,
            a,
            c,
            i,
            l + 1,
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
    let n = 0;
    this.quickEstimateResults = {}, this.sourceIDs.forEach((a) => {
      this.quickEstimateResults[a] = [];
    }), this.intervals.push(
      //@ts-ignore
      setInterval(() => {
        for (let a = 0; a < this.passes; a++, n++)
          for (let c = 0; c < this.sourceIDs.length; c++) {
            const i = this.sourceIDs[c], l = D.getState().containers[i];
            this.quickEstimateResults[i].push(this.quickEstimateStep(l, e, t));
          }
        n >= t ? (this.intervals.forEach((a) => window.clearInterval(a)), this.runningWithoutReceivers = s, console.log(this.quickEstimateResults)) : console.log((n / t * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(e, t, s) {
    const n = X(20), a = Array(t.length).fill(0);
    let c = e.position.clone(), i = new S.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), l = 0;
    const r = Array(t.length).fill(e.initialIntensity);
    let h = 0;
    const o = 1e3;
    let f = !1, p = 0;
    N(t);
    let g = {};
    for (; !f && h < o; ) {
      this.raycaster.ray.set(c, i);
      const u = this.raycaster.intersectObjects(this.intersectableObjects, !0);
      if (u.length > 0) {
        l = i.clone().multiplyScalar(-1).angleTo(u[0].face.normal), p += u[0].distance;
        const d = u[0].object.parent;
        for (let I = 0; I < t.length; I++) {
          const R = t[I];
          let v = 1;
          d.kind === "surface" && (v = d.reflectionFunction(R, l)), r[I] *= v;
          const b = e.initialIntensity / r[I] > 1e6;
          b && (a[I] = p / n), f = f || b;
        }
        u[0].object.parent instanceof J && (u[0].object.parent.numHits += 1);
        const y = u[0].face.normal.normalize();
        i.sub(y.clone().multiplyScalar(i.dot(y)).multiplyScalar(2)).normalize(), c.copy(u[0].point), g = u[0];
      }
      h += 1;
    }
    return this.stats.numRaysShot.value++, {
      distance: p,
      rt60s: a,
      angle: l,
      direction: i,
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
      let c = _e(s, t);
      const i = new S.Vector3().setFromSphericalCoords(1, c[0], c[1]);
      i.applyEuler(a), D.getState().containers[this.sourceIDs[e]].directivityHandler;
      const r = this.traceRay(n, i, this.reflectionOrder, 1, this.sourceIDs[e], s, t);
      if (r) {
        if (this._runningWithoutReceivers) {
          this.appendRay(
            [n.x, n.y, n.z],
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
          const h = r.chain[r.chain.length - 1].object;
          this.paths[h] ? this.paths[h].push(r) : this.paths[h] = [r], D.getState().containers[this.sourceIDs[e]].numRays += 1;
        } else if (r.intersectedReceiver) {
          this.appendRay(
            [n.x, n.y, n.z],
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
          this.stats.numValidRayPaths.value++, this.validRayCount += 1, w.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
          const h = r.chain[r.chain.length - 1].object;
          this.paths[h] ? this.paths[h].push(r) : this.paths[h] = [r], D.getState().containers[this.sourceIDs[e]].numRays += 1;
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
      const t = this.__calc_time / 1e3, s = this.paths[e].length, n = s / t, a = this.__num_checked_paths, c = a / t;
      console.log({
        calc_time: t,
        num_valid_rays: s,
        valid_ray_rate: n,
        num_checks: a,
        check_rate: c
      }), this.paths[e].forEach((i) => {
        i.time = 0, i.totalLength = 0;
        for (let l = 0; l < i.chain.length; l++)
          i.totalLength += i.chain[l].distance, i.time += i.chain[l].distance / 343.2;
      });
    }), this.mapIntersectableObjects(), this.reportImpulseResponse();
  }
  async reportImpulseResponse() {
    var a, c;
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = D.getState().containers, t = _.sampleRate, { useResult: s } = require("../../store/result-store"), n = [];
    for (const i of this.sourceIDs)
      for (const l of this.receiverIDs) {
        if (!this.paths[l] || this.paths[l].length === 0) continue;
        const r = this.paths[l].filter((h) => h.source === i);
        r.length > 0 && n.push({ sourceId: i, receiverId: l, paths: r });
      }
    if (n.length !== 0) {
      O("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let i = 0; i < n.length; i++) {
        const { sourceId: l, receiverId: r, paths: h } = n[i], o = ((a = e[l]) == null ? void 0 : a.name) || "Source", f = ((c = e[r]) == null ? void 0 : c.name) || "Receiver", p = Math.round(i / n.length * 100);
        O("UPDATE_PROGRESS", {
          progress: p,
          message: `Calculating IR: ${o} → ${f}`
        });
        try {
          const { normalizedSignal: g } = await this.calculateImpulseResponseForPair(l, r, h);
          l === this.sourceIDs[0] && r === this.receiverIDs[0] && this.calculateImpulseResponse().then((b) => {
            this.impulseResponse = b;
          }).catch(console.error);
          const d = Math.max(1, Math.floor(g.length / 2e3)), y = [];
          for (let b = 0; b < g.length; b += d)
            y.push({
              time: b / t,
              amplitude: g[b]
            });
          const I = `${this.uuid}-ir-${l}-${r}`, R = s.getState().results[I], v = {
            kind: Q.ImpulseResponse,
            name: `IR: ${o} → ${f}`,
            uuid: I,
            from: this.uuid,
            info: {
              sampleRate: t,
              sourceName: o,
              receiverName: f,
              sourceId: l,
              receiverId: r
            },
            data: y
          };
          R ? O("UPDATE_RESULT", { uuid: I, result: v }) : O("ADD_RESULT", v);
        } catch (g) {
          console.error(`Failed to calculate impulse response for ${l} -> ${r}:`, g);
        }
      }
      O("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(e, t, s, n = 100, a = F(63, 16e3), c = _.sampleRate) {
    if (s.length === 0) throw Error("No rays have been traced for this pair");
    let i = s.sort((p, g) => p.time - g.time);
    const l = i[i.length - 1].time + 0.05, r = Array(a.length).fill(n), h = x(c * l) * 2;
    let o = [];
    for (let p = 0; p < a.length; p++)
      o.push(new Float32Array(h));
    for (let p = 0; p < i.length; p++) {
      const g = M() ? 1 : -1, u = i[p].time, d = this.arrivalPressure(r, a, i[p]).map((I) => I * g), y = x(u * c);
      for (let I = 0; I < a.length; I++)
        o[I][y] += d[I];
    }
    const f = j();
    return new Promise((p, g) => {
      f.postMessage({ samples: o }), f.onmessage = (u) => {
        const d = u.data.samples, y = new Float32Array(d[0].length >> 1);
        for (let R = 0; R < d.length; R++)
          for (let v = 0; v < y.length; v++)
            y[v] += d[R][v];
        const I = z(y.slice());
        f.terminate(), p({ signal: y, normalizedSignal: I });
      }, f.onerror = (u) => {
        f.terminate(), g(u);
      };
    });
  }
  async calculateImpulseResponseForDisplay(e = 100, t = F(63, 16e3), s = _.sampleRate) {
    if (this.receiverIDs.length == 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length == 0) throw Error("No sources have been assigned to the raytracer");
    if (this.paths[this.receiverIDs[0]].length == 0) throw Error("No rays have been traced yet");
    let n = this.paths[this.receiverIDs[0]].sort((h, o) => h.time - o.time);
    const a = n[n.length - 1].time + 0.05, c = Array(t.length).fill(e), i = x(s * a) * 2;
    let l = [];
    for (let h = 0; h < t.length; h++)
      l.push(new Float32Array(i));
    for (let h = 0; h < n.length; h++) {
      const o = M() ? 1 : -1, f = n[h].time, p = this.arrivalPressure(c, t, n[h]).map((u) => u * o), g = x(f * s);
      for (let u = 0; u < t.length; u++)
        l[u][g] += p[u];
    }
    const r = j();
    return new Promise((h, o) => {
      r.postMessage({ samples: l }), r.onmessage = (f) => {
        const p = f.data.samples, g = new Float32Array(p[0].length >> 1);
        for (let d = 0; d < p.length; d++)
          for (let y = 0; y < g.length; y++)
            g[y] += p[d][y];
        const u = z(g.slice());
        r.terminate(), h({ signal: g, normalizedSignal: u });
      }, r.onerror = (f) => {
        r.terminate(), o(f);
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
    const { useResult: e } = require("../../store/result-store"), t = e.getState().results;
    Object.keys(t).forEach((s) => {
      const n = t[s];
      n.from === this.uuid && n.kind === Q.ImpulseResponse && O("REMOVE_RESULT", s);
    });
  }
  calculateWithDiffuse(e = this.reflectionLossFrequencies) {
    this.allReceiverData = [];
    const t = Object.keys(this.paths), s = D.getState().containers[this.receiverIDs[0]].scale.x, n = D.getState().containers[this.receiverIDs[0]].position;
    t.forEach((c) => {
      const i = new Te(c);
      this.paths[c].forEach((l) => {
        const r = {
          time: 0,
          energy: []
        };
        let h = !1;
        l.chain.forEach((o) => {
          const f = this.receiverIDs.includes(o.object) ? D.getState().containers[o.object] : this.room.surfaceMap[o.object];
          if (f && f.kind) {
            if (f.kind === "receiver")
              h = !0;
            else if (f.kind === "surface") {
              const p = f, g = {
                time: o.time_rec,
                energy: []
              };
              e.forEach((u, d) => {
                const y = P(p.reflectionFunction(u, o.angle_in));
                if (!r.energy[d])
                  r.energy[d] = {
                    frequency: u,
                    value: y
                  };
                else {
                  r.energy[d].value *= y, r.time = o.total_time;
                  const I = new S.Vector3(
                    n.x - o.point[0],
                    n.y - o.point[1],
                    n.z - o.point[2]
                  ), R = new S.Vector3().fromArray(o.faceNormal).angleTo(I);
                  g.energy[d] = {
                    frequency: u,
                    value: be(
                      r.energy[d].value,
                      p.absorptionFunction(u),
                      0.1,
                      Oe(s / I.length()),
                      R
                    )
                  };
                }
              }), g.energy.length > 0 && i.data.push(g);
            }
          }
        }), h && i.data.push(r);
      }), i.data = De(i.data).asc((l) => l.time), this.allReceiverData.push(i);
    });
    const a = this.allReceiverData.map((c) => e.map((i) => ({
      label: i.toString(),
      x: c.data.map((l) => l.time),
      y: c.data.map((l) => l.energy.filter((r) => r.frequency == i)[0].value)
    })));
    return T.postMessage("UPDATE_CHART_DATA", a && a[0]), this.allReceiverData;
  }
  reflectionLossFunction(e, t, s) {
    const n = t.chain.slice(0, -1);
    if (n && n.length > 0) {
      let a = 1;
      for (let c = 0; c < n.length; c++) {
        const i = n[c], l = e.surfaceMap[i.object], r = i.angle || 0;
        a = a * P(l.reflectionFunction(s, r));
      }
      return a;
    }
    return 1;
  }
  //TODO change this name to something more appropriate
  calculateReflectionLoss(e = this.reflectionLossFrequencies) {
    this.allReceiverData = [];
    const t = (a, c) => ({ label: a, data: c }), s = [];
    if (e)
      for (let a = 0; a < e.length; a++)
        s.push(t(e[a].toString(), []));
    const n = Object.keys(this.paths);
    for (let a = 0; a < n.length; a++) {
      this.allReceiverData.push({
        id: n[a],
        data: []
      });
      for (let c = 0; c < this.paths[n[a]].length; c++) {
        const i = this.paths[n[a]][c];
        let l;
        e ? (l = e.map((r) => ({
          frequency: r,
          value: this.reflectionLossFunction(this.room, i, r)
        })), e.forEach((r, h) => {
          s[h].data.push([i.time, this.reflectionLossFunction(this.room, i, r)]);
        })) : l = (r) => this.reflectionLossFunction(this.room, i, r), this.allReceiverData[this.allReceiverData.length - 1].data.push({
          time: i.time,
          energy: l
        });
      }
      this.allReceiverData[this.allReceiverData.length - 1].data = this.allReceiverData[this.allReceiverData.length - 1].data.sort((c, i) => c.time - i.time);
    }
    for (let a = 0; a < s.length; a++)
      s[a].data = s[a].data.sort((c, i) => c[0] - i[0]), s[a].x = s[a].data.map((c) => c[0]), s[a].y = s[a].data.map((c) => c[1]);
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
      const s = this.allReceiverData[e].data, n = s[s.length - 1].time, a = x(t * n), c = [];
      for (let i = 0, l = 0; i < a; i++) {
        let r = i / a * n;
        if (s[l] && s[l].time) {
          let h = s[l].time;
          if (h > r) {
            c.push([r].concat(Array(s[l].energy.length).fill(0)));
            continue;
          }
          if (h <= r) {
            let o = s[l].energy.map((p) => 0), f = 0;
            for (; h <= r; )
              h = s[l].time, o.forEach((p, g, u) => u[g] += s[l].energy[g].value), l++, f++;
            c.push([r, ...o.map((p) => p / f)]);
            continue;
          }
        }
      }
      return c;
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
      (t) => new S.Vector3().fromArray(t.chain[t.chain.length - 1].point)
    ) : [];
  }
  calculateResponseByIntensity(e = this.defaultFrequencies, t = 20) {
    const s = this.indexedPaths, n = X(t), a = N(e);
    this.responseByIntensity = {};
    for (const c in s) {
      this.responseByIntensity[c] = {};
      for (const i in s[c]) {
        this.responseByIntensity[c][i] = {
          freqs: e,
          response: []
        }, V(L(D.getState().containers[i].initialSPL));
        for (let l = 0; l < s[c][i].length; l++) {
          let r = 0, h = [], o = s[c][i][l].initialPhi, f = s[c][i][l].initialTheta, p = D.getState().containers[i].directivityHandler;
          for (let u = 0; u < e.length; u++)
            h[u] = V(p.getPressureAtPosition(0, e[u], o, f));
          for (let u = 0; u < s[c][i][l].chain.length; u++) {
            const { angle: d, distance: y } = s[c][i][l].chain[u];
            r += y / n;
            const I = s[c][i][l].chain[u].object, R = D.getState().containers[I] || this.room.surfaceMap[I] || null;
            for (let v = 0; v < e.length; v++) {
              const b = e[v];
              let E = 1;
              R && R.kind === "surface" && (E = R.reflectionFunction(b, d)), h.push(V(
                L(H(U(h[v] * E)) - a[v] * y)
              ));
            }
          }
          const g = H(U(h));
          this.responseByIntensity[c][i].response.push({
            time: r,
            level: g,
            bounces: s[c][i][l].chain.length
          });
        }
        this.responseByIntensity[c][i].response.sort((l, r) => l.time - r.time);
      }
    }
    return this.resampleResponseByIntensity();
  }
  resampleResponseByIntensity(e = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      for (const t in this.responseByIntensity)
        for (const s in this.responseByIntensity[t]) {
          const { response: n, freqs: a } = this.responseByIntensity[t][s], c = n[n.length - 1].time, i = x(e * c);
          this.responseByIntensity[t][s].resampledResponse = Array(a.length).fill(0).map((f) => new Float32Array(i)), this.responseByIntensity[t][s].sampleRate = e;
          let l = 0, r = [], h = a.map((f) => 0), o = !1;
          for (let f = 0, p = 0; f < i; f++) {
            let g = f / i * c;
            if (n[p] && n[p].time) {
              let u = n[p].time;
              if (u > g) {
                for (let d = 0; d < a.length; d++)
                  this.responseByIntensity[t][s].resampledResponse[d][l] = 0;
                o && r.push(l), l++;
                continue;
              }
              if (u <= g) {
                let d = n[p].level.map((y) => 0);
                for (; u <= g; ) {
                  u = n[p].time;
                  for (let y = 0; y < a.length; y++)
                    d[y] = he([d[y], n[p].level[y]]);
                  p++;
                }
                for (let y = 0; y < a.length; y++) {
                  if (this.responseByIntensity[t][s].resampledResponse[y][l] = d[y], r.length > 0) {
                    const I = h[y], R = d[y];
                    for (let v = 0; v < r.length; v++) {
                      const b = ue(I, R, (v + 1) / (r.length + 1));
                      this.responseByIntensity[t][s].resampledResponse[y][r[v]] = b;
                    }
                  }
                  h[y] = d[y];
                }
                r.length > 0 && (r = []), o = !0, l++;
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
      const a = e || s[0], c = t || n[0], i = this.responseByIntensity[a][c].resampledResponse, l = this.responseByIntensity[a][c].sampleRate;
      if (this.responseByIntensity[a][c].freqs, i && l) {
        const r = new Float32Array(i[0].length);
        for (let h = 0; h < i[0].length; h++)
          r[h] = h / l;
        this.responseByIntensity[a][c].t30 = i.map((h) => {
          let o = 0, f = h[o];
          for (; f === 0; )
            f = h[o++];
          for (let d = o; d >= 0; d--)
            h[d] = f;
          const p = f - 30, u = G(h, 2).filter((d) => d >= p).length;
          return K(r.slice(0, u), h.slice(0, u));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT20(e, t) {
    const s = this.receiverIDs, n = this.sourceIDs;
    if (s.length > 0 && n.length > 0) {
      const a = e || s[0], c = t || n[0], i = this.responseByIntensity[a][c].resampledResponse, l = this.responseByIntensity[a][c].sampleRate;
      if (this.responseByIntensity[a][c].freqs, i && l) {
        const r = new Float32Array(i[0].length);
        for (let h = 0; h < i[0].length; h++)
          r[h] = h / l;
        this.responseByIntensity[a][c].t20 = i.map((h) => {
          let o = 0, f = h[o];
          for (; f === 0; )
            f = h[o++];
          for (let d = o; d >= 0; d--)
            h[d] = f;
          const p = f - 20, u = G(h, 2).filter((d) => d >= p).length;
          return K(r.slice(0, u), h.slice(0, u));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT60(e, t) {
    const s = this.receiverIDs, n = this.sourceIDs;
    if (s.length > 0 && n.length > 0) {
      const a = e || s[0], c = t || n[0], i = this.responseByIntensity[a][c].resampledResponse, l = this.responseByIntensity[a][c].sampleRate;
      if (this.responseByIntensity[a][c].freqs, i && l) {
        const r = new Float32Array(i[0].length);
        for (let h = 0; h < i[0].length; h++)
          r[h] = h / l;
        this.responseByIntensity[a][c].t60 = i.map((h) => {
          let o = 0, f = h[o];
          for (; f === 0; )
            f = h[o++];
          for (let d = o; d >= 0; d--)
            h[d] = f;
          const p = f - 60, u = G(h, 2).filter((d) => d >= p).length;
          return K(r.slice(0, u), h.slice(0, u));
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
        const a = this.paths[n].map((c) => [
          ...e(c.source),
          c.chainLength,
          c.time,
          Number(c.intersectedReceiver),
          c.energy,
          ...t(c.chain)
        ]).flat();
        return [...e(n), a.length, ...a];
      }).flat()
    );
  }
  linearBufferToPaths(e) {
    const n = (r) => String.fromCharCode(...r), a = (r) => {
      let h = 0;
      const o = n(r.slice(h, h += 36)), f = r[h++], p = r[h++], g = r[h++], u = r[h++], d = r[h++], y = [r[h++], r[h++], r[h++]], I = [r[h++], r[h++], r[h++]];
      return {
        object: o,
        angle: f,
        distance: p,
        energy: g,
        faceIndex: u,
        faceMaterialIndex: d,
        faceNormal: y,
        point: I
      };
    }, c = (r) => {
      const h = [];
      let o = 0;
      for (; o < r.length; ) {
        n(r.slice(o, o += 36));
        const f = r[o++];
        r[o++], r[o++], r[o++];
        const p = [];
        for (let g = 0; g < f; g++)
          p.push(a(r.slice(o, o += 47)));
      }
      return h;
    };
    let i = 0;
    const l = {};
    for (; i < e.length; ) {
      const r = n(e.slice(i, i += 36)), h = e[i++], o = c(e.slice(i, i += h));
      l[r] = o;
    }
    return l;
  }
  arrivalPressure(e, t, s) {
    const n = V(L(e));
    s.chain.slice(0, -1).forEach((i) => {
      const l = D.getState().containers[i.object];
      n.forEach((r, h) => {
        let o;
        t[h] === 16e3 ? o = 1 - l.absorptionFunction(t[8e3]) : o = 1 - l.absorptionFunction(t[h]), n[h] = r * o;
      });
    });
    const a = H(U(n)), c = N(t);
    return t.forEach((i, l) => a[l] -= c[l] * s.totalLength), L(a);
  }
  async calculateImpulseResponse(e = 100, t = F(63, 16e3), s = _.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let n = this.paths[this.receiverIDs[0]].sort((h, o) => h.time - o.time);
    const a = n[n.length - 1].time + 0.05, c = Array(t.length).fill(e), i = x(s * a) * 2;
    let l = [];
    for (let h = 0; h < t.length; h++)
      l.push(new Float32Array(i));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let p = 0; p < n.length; p++)
        n[p].chainLength - 1 <= this.transitionOrder && n.splice(p, 1);
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
      }, f = new Ie(h, !0).returnSortedPathsForHybrid(343, c, t);
      for (let p = 0; p < f.length; p++) {
        const g = M() ? 1 : -1, u = f[p].time, d = x(u * s);
        for (let y = 0; y < t.length; y++)
          l[y][d] += f[p].pressure[y] * g;
      }
    }
    for (let h = 0; h < n.length; h++) {
      const o = M() ? 1 : -1, f = n[h].time, p = this.arrivalPressure(c, t, n[h]).map((u) => u * o), g = x(f * s);
      for (let u = 0; u < t.length; u++)
        l[u][g] += p[u];
    }
    const r = j();
    return new Promise((h, o) => {
      r.postMessage({ samples: l }), r.onmessage = (f) => {
        const p = f.data.samples, g = new Float32Array(p[0].length >> 1);
        let u = 0;
        for (let R = 0; R < p.length; R++)
          for (let v = 0; v < g.length; v++)
            g[v] += p[R][v], P(g[v]) > u && (u = P(g[v]));
        const d = z(g), y = _.createOfflineContext(1, g.length, s), I = _.createBufferSource(d, y);
        I.connect(y.destination), I.start(), _.renderContextAsync(y).then((R) => h(R)).catch(o).finally(() => r.terminate());
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
    const a = this.paths[this.receiverIDs[0]].sort((f, p) => f.time - p.time);
    if (a.length === 0) throw Error("No valid ray paths found");
    const c = a[a.length - 1].time + 0.05;
    if (c <= 0) throw Error("Invalid impulse response duration");
    const i = Array(s.length).fill(t), l = x(n * c) * 2;
    if (l < 2) throw Error("Impulse response too short to process");
    const r = ve(e), h = [];
    for (let f = 0; f < s.length; f++) {
      h.push([]);
      for (let p = 0; p < r; p++)
        h[f].push(new Float32Array(l));
    }
    for (let f = 0; f < a.length; f++) {
      const p = a[f], g = M() ? 1 : -1, u = p.time, d = this.arrivalPressure(i, s, p).map((v) => v * g), y = x(u * n);
      if (y >= l) continue;
      const I = p.arrivalDirection || [0, 0, 1], R = new Float32Array(1);
      for (let v = 0; v < s.length; v++) {
        R[0] = d[v];
        const b = ye(R, I[0], I[1], I[2], e, "threejs");
        for (let E = 0; E < r; E++)
          h[v][E][y] += b[E][0];
      }
    }
    const o = j();
    return new Promise((f, p) => {
      const g = async (u) => new Promise((d) => {
        const y = [];
        for (let R = 0; R < s.length; R++)
          y.push(h[R][u]);
        const I = j();
        I.postMessage({ samples: y }), I.onmessage = (R) => {
          const v = R.data.samples, b = new Float32Array(v[0].length >> 1);
          for (let E = 0; E < v.length; E++)
            for (let k = 0; k < b.length; k++)
              b[k] += v[E][k];
          I.terminate(), d(b);
        };
      });
      Promise.all(
        Array.from({ length: r }, (u, d) => g(d))
      ).then((u) => {
        let d = 0;
        for (const v of u)
          for (let b = 0; b < v.length; b++)
            P(v[b]) > d && (d = P(v[b]));
        if (d > 0)
          for (const v of u)
            for (let b = 0; b < v.length; b++)
              v[b] /= d;
        const y = u[0].length;
        if (y === 0) {
          o.terminate(), p(new Error("Filtered signal has zero length"));
          return;
        }
        const R = _.createOfflineContext(r, y, n).createBuffer(r, y, n);
        for (let v = 0; v < r; v++)
          R.copyToChannel(new Float32Array(u[v]), v);
        o.terminate(), f(R);
      }).catch(p);
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
    const a = this.paths[this.receiverIDs[0]].sort((o, f) => o.time - f.time), c = a[a.length - 1].time + 0.05, i = Array(s.length).fill(t), l = x(n * c), r = [];
    for (let o = 0; o < s.length; o++)
      r.push(new Float32Array(l));
    let h = 0;
    for (let o = 0; o < a.length; o++) {
      const f = M() ? 1 : -1, p = a[o].time, g = this.arrivalPressure(i, s, a[o]).map((d) => d * f), u = x(p * n);
      for (let d = 0; d < s.length; d++)
        r[d][u] += g[d], P(r[d][u]) > h && (h = P(r[d][u]));
    }
    for (let o = 0; o < s.length; o++) {
      const f = W([fe(r[o])], { sampleRate: n, bitDepth: 32 });
      $.saveAs(f, `${s[o]}_${e}.wav`);
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
    for (let r = 0; r < s; r++)
      a.push(this.ambisonicImpulseResponse.getChannelData(r));
    const c = W(a, { sampleRate: n, bitDepth: 32 }), i = e.endsWith(".wav") ? "" : ".wav", l = t === 1 ? "FOA" : `HOA${t}`;
    $.saveAs(c, `${e}_${l}${i}`);
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
C("RAYTRACER_CALL_METHOD", pe);
C("RAYTRACER_SET_PROPERTY", de);
C("REMOVE_RAYTRACER", me);
C("ADD_RAYTRACER", ge(Me));
C("RAYTRACER_CLEAR_RAYS", (m) => void B.getState().solvers[m].clearRays());
C("RAYTRACER_PLAY_IR", (m) => {
  B.getState().solvers[m].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
C("RAYTRACER_DOWNLOAD_IR", (m) => {
  var c, i;
  const e = B.getState().solvers[m], t = D.getState().containers, s = e.sourceIDs.length > 0 && ((c = t[e.sourceIDs[0]]) == null ? void 0 : c.name) || "source", n = e.receiverIDs.length > 0 && ((i = t[e.receiverIDs[0]]) == null ? void 0 : i.name) || "receiver", a = `ir-${s}-${n}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(a).catch((l) => {
    window.alert(l.message || "Failed to download impulse response");
  });
});
C("RAYTRACER_DOWNLOAD_IR_OCTAVE", (m) => void B.getState().solvers[m].downloadImpulses(m));
C("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: m, order: e }) => {
  var i, l;
  const t = B.getState().solvers[m], s = D.getState().containers, n = t.sourceIDs.length > 0 && ((i = s[t.sourceIDs[0]]) == null ? void 0 : i.name) || "source", a = t.receiverIDs.length > 0 && ((l = s[t.receiverIDs[0]]) == null ? void 0 : l.name) || "receiver", c = `ir-${n}-${a}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(c, e).catch((r) => {
    window.alert(r.message || "Failed to download ambisonic impulse response");
  });
});
export {
  Te as ReceiverData,
  Me as default,
  A as defaults
};
//# sourceMappingURL=index-Cwn8oksi.mjs.map
