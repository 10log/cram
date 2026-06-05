import { S as We } from "./solver-BmP-9ULQ.mjs";
import * as T from "three";
import { computeBoundsTree as $e, disposeBoundsTree as Xe, acceleratedRaycast as Ze } from "three-mesh-bvh";
import { S as Ke, u as B, b as pe, L as re, P as se, I as ie, F as Je, e as q, y as Qe, r as O, m as $, a as Re, R as Se, z as et, o as L, A as tt, s as rt, c as nt, d as st, f as W } from "./index--vKOn3aE.mjs";
import { a as U, w as it, n as at, O as Ne } from "./audio-engine-B5vo1Ejp.mjs";
import { a as ae } from "./air-attenuation-CBIk1QMo.mjs";
import { s as Fe } from "./sound-speed-Biev-mJ1.mjs";
import { e as oe, s as ce, c as le, r as ke, l as ot, D as ct, a as lt, H as ht, q as ut, b as ft, f as dt, i as gt, j as pt, k as mt, d as yt, g as vt, h as bt } from "./quick-estimate-CWUHE2bA.mjs";
import { M as Er, m as Pr, Q as wr, R as Br } from "./quick-estimate-CWUHE2bA.mjs";
import { ImageSourceSolver as It } from "./index-CuAv3Rmc.mjs";
import { p as Rt, d as St, a as xt, b as _t, c as Dt } from "./export-playback-CIJtY5Du.mjs";
const At = `attribute vec2 color;\r
varying vec2 vColor;\r
uniform float pointScale;\r
void main() {\r
  vColor = color;\r
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\r
  gl_PointSize = pointScale*(color.x/4.0+0.5);\r
  gl_Position = projectionMatrix * mvPosition;\r
  \r
}`, Et = `varying vec2 vColor;\r
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
}`, xe = {
  vs: At,
  fs: Et
};
function ue(l, e) {
  let t = (360 - l) * (Math.PI / 180);
  return [e * (Math.PI / 180), t];
}
class Pt {
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
function wt(l, e) {
  return new Pt(l);
}
const Bt = 0.01, V = 100, J = 0.05, Tt = 2e3, Ct = 500, M = {
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
  },
  frequencies: [125, 250, 500, 1e3, 2e3, 4e3, 8e3],
  convergenceThreshold: 0.01,
  autoStop: !0,
  rrThreshold: 0.1,
  maxStoredPaths: 1e5,
  edgeDiffractionEnabled: !1,
  lateReverbTailEnabled: !1,
  tailCrossfadeTime: 0,
  tailCrossfadeDuration: 0.05,
  gpuEnabled: !1,
  gpuBatchSize: 1e4
};
var Ue = /* @__PURE__ */ ((l) => (l[l.ENERGY = 0] = "ENERGY", l[l.ANGLE = 1] = "ANGLE", l[l.ANGLE_ENERGY = 2] = "ANGLE_ENERGY", l))(Ue || {});
function be(l) {
  let e = Math.abs(l[0]);
  for (let t = 1; t < l.length; t++)
    Math.abs(l[t]) > e && (e = Math.abs(l[t]));
  if (e !== 0)
    for (let t = 0; t < l.length; t++)
      l[t] /= e;
  return l;
}
function Mt(l) {
  return Math.random() < l;
}
const { abs: zt } = Math, _e = new T.Vector3(), Ot = new T.Vector3(), Nt = new T.Vector3(), De = new T.Vector3(), Z = new T.Vector3(), Ft = new T.Vector3(), Q = new T.Vector3(), K = new T.Plane(), ee = new T.Vector4(), Ae = new T.Vector4(), Ee = new T.Vector4(), Pe = new T.Vector4();
function kt(l, e) {
  return l.getPlane(K), ee.set(K.normal.x, K.normal.y, K.normal.z, K.constant), Ae.set(e.a.x, e.a.y, e.a.z, 1), Ee.set(e.b.x, e.b.y, e.b.z, 1), Pe.set(e.c.x, e.c.y, e.c.z, 1), ee.dot(Ae) > 0 || ee.dot(Ee) > 0 || ee.dot(Pe) > 0;
}
function Le(l, e, t, s, a, c, r, i, n, o, h, m, f = 1, g = []) {
  r = r.normalize(), l.ray.origin = c, l.ray.direction = r;
  const u = l.intersectObjects(e, !0);
  if (u.length > 0) {
    const d = n.reduce((p, y) => p + y, 0), I = n.length > 0 ? d / n.length : 0;
    if (u[0].object.userData?.kind === "receiver") {
      const p = u[0].face && _e.copy(r).multiplyScalar(-1).angleTo(u[0].face.normal), y = u[0].distance, S = n.map(
        (A, _) => A * Math.pow(10, -s[_] * y / 10)
      ), R = S.reduce((A, _) => A + _, 0), b = S.length > 0 ? R / S.length : 0;
      g.push({
        object: u[0].object.parent.uuid,
        angle: p,
        distance: u[0].distance,
        faceNormal: [
          u[0].face.normal.x,
          u[0].face.normal.y,
          u[0].face.normal.z
        ],
        faceMaterialIndex: u[0].face.materialIndex,
        faceIndex: u[0].faceIndex,
        point: [u[0].point.x, u[0].point.y, u[0].point.z],
        energy: b,
        bandEnergy: [...S]
      }), Q.copy(r).normalize().negate();
      const v = [Q.x, Q.y, Q.z];
      return {
        chain: g,
        chainLength: g.length,
        intersectedReceiver: !0,
        energy: b,
        bandEnergy: [...S],
        source: o,
        initialPhi: h,
        initialTheta: m,
        arrivalDirection: v
      };
    } else {
      const p = u[0].face && _e.copy(r).multiplyScalar(-1).angleTo(u[0].face.normal);
      g.push({
        object: u[0].object.parent.uuid,
        angle: p,
        distance: u[0].distance,
        faceNormal: [
          u[0].face.normal.x,
          u[0].face.normal.y,
          u[0].face.normal.z
        ],
        faceMaterialIndex: u[0].face.materialIndex,
        faceIndex: u[0].faceIndex,
        point: [u[0].point.x, u[0].point.y, u[0].point.z],
        energy: I
      }), u[0].object.parent instanceof Ke && (u[0].object.parent.numHits += 1);
      const y = u[0].face && Ot.copy(u[0].face.normal).normalize();
      let S = y && u[0].face && De.copy(r).sub(Nt.copy(y).multiplyScalar(r.dot(y)).multiplyScalar(2));
      const R = u[0].object.parent, b = t.map((P) => R.scatteringFunction(P)), v = n.reduce((P, w) => P + w, 0) || 1;
      let A = 0;
      for (let P = 0; P < t.length; P++)
        A += b[P] * (n[P] || 0);
      if (A /= v, Mt(A)) {
        do
          Z.set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
          );
        while (Z.lengthSq() > 1 || Z.lengthSq() < 1e-6);
        Z.normalize(), S = De.copy(Z).add(y).normalize();
      }
      const _ = u[0].distance, D = t.map((P, w) => {
        const E = n[w];
        if (E == null) return 0;
        let z = E * zt(R.reflectionFunction(P, p));
        return z *= Math.pow(10, -s[w] * _ / 10), z;
      }), x = Math.max(...D);
      if (S && y && f < i + 1) {
        if (x < a && x > 0) {
          const P = x / a;
          if (Math.random() > P) {
            const w = D.reduce((z, F) => z + F, 0), E = D.length > 0 ? w / D.length : 0;
            return { chain: g, chainLength: g.length, source: o, intersectedReceiver: !1, energy: E, bandEnergy: [...D] };
          }
          for (let w = 0; w < D.length; w++)
            D[w] /= P;
        }
        if (x > 0)
          return Le(
            l,
            e,
            t,
            s,
            a,
            Ft.copy(u[0].point).addScaledVector(y, Bt),
            S,
            i,
            D,
            o,
            h,
            m,
            f + 1,
            g
          );
      }
    }
    return { chain: g, chainLength: g.length, source: o, intersectedReceiver: !1 };
  }
}
const { floor: X, abs: Ut, max: Ge } = Math, Ve = () => Math.random() > 0.5, He = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
));
function Ie(l, e, t, s = 1, a = 20) {
  const c = pe(re(l));
  if (t.bandEnergy && t.bandEnergy.length === e.length) {
    for (let h = 0; h < e.length; h++)
      c[h] *= t.bandEnergy[h];
    const o = re(se(ie(c)));
    if (s !== 1)
      for (let h = 0; h < o.length; h++) o[h] *= s;
    return o;
  }
  t.chain.slice(0, -1).forEach((o) => {
    const h = B.getState().containers[o.object];
    c.forEach((m, f) => {
      const g = Ut(h.reflectionFunction(e[f], o.angle));
      c[f] = m * g;
    });
  });
  const r = se(ie(c)), i = ae(e, a);
  e.forEach((o, h) => r[h] -= i[h] * t.totalLength);
  const n = re(r);
  if (s !== 1)
    for (let o = 0; o < n.length; o++) n[o] *= s;
  return n;
}
async function Lt(l, e, t, s = V, a, c, r = U.sampleRate, i) {
  if (t.length === 0) throw Error("No rays have been traced for this pair");
  let n = t.sort((d, I) => d.time - I.time);
  const o = n[n.length - 1].time + J, h = Array(a.length).fill(s), m = X(r * o) * 2;
  let f = [];
  for (let d = 0; d < a.length; d++)
    f.push(new Float32Array(m));
  const g = B.getState().containers[e];
  for (let d = 0; d < n.length; d++) {
    const I = Ve() ? 1 : -1, p = n[d].time, y = n[d].arrivalDirection || [0, 0, 1], S = g.getGain(y), R = Ie(h, a, n[d], S, c).map((v) => v * I), b = X(p * r);
    for (let v = 0; v < a.length; v++)
      f[v][b] += R[v];
  }
  if (i && i.energyHistogram && i.energyHistogram.length > 0) {
    const d = oe(
      i.energyHistogram,
      i.frequencies,
      i.crossfadeTime,
      i.histogramBinWidth
    ), { tailSamples: I, tailStartSample: p } = ce(
      d,
      r
    ), y = X(i.crossfadeDuration * r);
    f = le(f, I, p, y);
    const R = f.reduce((b, v) => Ge(b, v.length), 0) * 2;
    for (let b = 0; b < a.length; b++)
      if (f[b].length < R) {
        const v = new Float32Array(R);
        v.set(f[b]), f[b] = v;
      }
  }
  const u = He();
  return new Promise((d, I) => {
    u.postMessage({ samples: f }), u.onmessage = (p) => {
      const y = p.data.samples, S = new Float32Array(y[0].length >> 1);
      for (let b = 0; b < y.length; b++)
        for (let v = 0; v < S.length; v++)
          S[v] += y[b][v];
      const R = be(S.slice());
      u.terminate(), d({ signal: S, normalizedSignal: R });
    }, u.onerror = (p) => {
      u.terminate(), I(p);
    };
  });
}
async function Gt(l, e, t, s = V, a, c, r = U.sampleRate, i) {
  if (l.length == 0) throw Error("No receivers have been assigned to the raytracer");
  if (e.length == 0) throw Error("No sources have been assigned to the raytracer");
  if (t[l[0]].length == 0) throw Error("No rays have been traced yet");
  let n = t[l[0]].sort((d, I) => d.time - I.time);
  const o = n[n.length - 1].time + J, h = Array(a.length).fill(s), m = X(r * o) * 2;
  let f = [];
  for (let d = 0; d < a.length; d++)
    f.push(new Float32Array(m));
  const g = B.getState().containers[l[0]];
  for (let d = 0; d < n.length; d++) {
    const I = Ve() ? 1 : -1, p = n[d].time, y = n[d].arrivalDirection || [0, 0, 1], S = g.getGain(y), R = Ie(h, a, n[d], S, c).map((v) => v * I), b = X(p * r);
    for (let v = 0; v < a.length; v++)
      f[v][b] += R[v];
  }
  if (i && i.energyHistogram && i.energyHistogram.length > 0) {
    const d = oe(
      i.energyHistogram,
      i.frequencies,
      i.crossfadeTime,
      i.histogramBinWidth
    ), { tailSamples: I, tailStartSample: p } = ce(
      d,
      r
    ), y = X(i.crossfadeDuration * r);
    f = le(f, I, p, y);
    const R = f.reduce((b, v) => Ge(b, v.length), 0) * 2;
    for (let b = 0; b < a.length; b++)
      if (f[b].length < R) {
        const v = new Float32Array(R);
        v.set(f[b]), f[b] = v;
      }
  }
  const u = He();
  return new Promise((d, I) => {
    u.postMessage({ samples: f }), u.onmessage = (p) => {
      const y = p.data.samples, S = new Float32Array(y[0].length >> 1);
      for (let b = 0; b < y.length; b++)
        for (let v = 0; v < S.length; v++)
          S[v] += y[b][v];
      const R = be(S.slice());
      u.terminate(), d({ signal: S, normalizedSignal: R });
    }, u.onerror = (p) => {
      u.terminate(), I(p);
    };
  });
}
const { abs: Vt } = Math;
function ne(l, e, t) {
  const s = e.chain.slice(0, -1);
  if (s && s.length > 0) {
    let a = 1;
    for (let c = 0; c < s.length; c++) {
      const r = s[c], i = l.surfaceMap[r.object], n = r.angle || 0;
      a = a * Vt(i.reflectionFunction(t, n));
    }
    return a;
  }
  return 1;
}
function Ht(l, e, t, s) {
  const a = [], c = (n, o) => ({ label: n, data: o }), r = [];
  if (s)
    for (let n = 0; n < s.length; n++)
      r.push(c(s[n].toString(), []));
  const i = Object.keys(l);
  for (let n = 0; n < i.length; n++) {
    a.push({
      id: i[n],
      data: []
    });
    for (let o = 0; o < l[i[n]].length; o++) {
      const h = l[i[n]][o];
      let m;
      s ? (m = s.map((f) => ({
        frequency: f,
        value: ne(e, h, f)
      })), s.forEach((f, g) => {
        r[g].data.push([h.time, ne(e, h, f)]);
      })) : m = (f) => ne(e, h, f), a[a.length - 1].data.push({
        time: h.time,
        energy: m
      });
    }
    a[a.length - 1].data = a[a.length - 1].data.sort((o, h) => o.time - h.time);
  }
  for (let n = 0; n < r.length; n++)
    r[n].data = r[n].data.sort((o, h) => o[0] - h[0]), r[n].x = r[n].data.map((o) => o[0]), r[n].y = r[n].data.map((o) => o[1]);
  return [a, r];
}
function jt(l, e, t, s, a, c) {
  const r = l, i = Fe(a), n = ae(s, a), o = {};
  for (const h in r) {
    o[h] = {};
    const m = B.getState().containers[h];
    for (const f in r[h]) {
      o[h][f] = {
        freqs: s,
        response: []
      };
      for (let g = 0; g < r[h][f].length; g++) {
        let u = 0, d = [], I = r[h][f][g].initialPhi, p = r[h][f][g].initialTheta, y = B.getState().containers[f].directivityHandler;
        for (let _ = 0; _ < s.length; _++)
          d[_] = pe(y.getPressureAtPosition(0, s[_], I, p));
        const R = r[h][f][g].arrivalDirection || [0, 0, 1], b = m.getGain(R), v = b * b;
        if (v !== 1)
          for (let _ = 0; _ < s.length; _++)
            d[_] *= v;
        for (let _ = 0; _ < r[h][f][g].chain.length; _++) {
          const { angle: D, distance: x } = r[h][f][g].chain[_];
          u += x / i;
          const P = r[h][f][g].chain[_].object, w = B.getState().containers[P] || null;
          for (let E = 0; E < s.length; E++) {
            const z = s[E];
            let F = 1;
            w && w.kind === "surface" && (F = w.reflectionFunction(z, D)), d[E] = pe(
              re(se(ie(d[E] * F)) - n[E] * x)
            );
          }
        }
        const A = se(ie(d));
        o[h][f].response.push({
          time: u,
          level: A,
          bounces: r[h][f][g].chain.length
        });
      }
      o[h][f].response.sort((g, u) => g.time - u.time);
    }
  }
  return ke(o, c);
}
const je = -2;
function Yt(l) {
  const s = (n) => String.fromCharCode(...n), a = (n) => {
    let o = 0;
    const h = s(n.slice(o, o += 36)), m = n[o++], f = n[o++], g = n[o++], u = n[o++], d = n[o++], I = [n[o++], n[o++], n[o++]], p = [n[o++], n[o++], n[o++]];
    return {
      object: h,
      angle: m,
      distance: f,
      energy: g,
      faceIndex: u,
      faceMaterialIndex: d,
      faceNormal: I,
      point: p
    };
  }, c = (n) => {
    const o = [];
    let h = 0;
    for (; h < n.length; ) {
      const m = s(n.slice(h, h += 36)), f = n[h++], g = n[h++], u = !!n[h++], d = n[h++], I = [];
      for (let p = 0; p < f; p++)
        I.push(a(n.slice(h, h += 47)));
      o.push({
        source: m,
        chainLength: f,
        time: g,
        intersectedReceiver: u,
        energy: d,
        chain: I
      });
    }
    return o;
  };
  let r = 0;
  const i = {};
  for (; r < l.length; ) {
    const n = s(l.slice(r, r += 36)), o = l[r++], h = c(l.slice(r, r += o));
    i[n] = h;
  }
  return i;
}
function qt(l) {
  const e = /* @__PURE__ */ new Set();
  for (const n of Object.keys(l)) {
    e.add(n);
    for (const o of l[n]) {
      e.add(o.source);
      for (const h of o.chain)
        e.add(h.object);
    }
  }
  const t = Array.from(e), s = /* @__PURE__ */ new Map();
  for (let n = 0; n < t.length; n++)
    s.set(t[n], n);
  const a = 2 + t.length * 36;
  let c = 0;
  for (const n of Object.keys(l)) {
    c += 2;
    for (const o of l[n])
      c += 5, c += o.chain.length * 12;
  }
  const r = new Float32Array(a + c);
  let i = 0;
  r[i++] = je, r[i++] = t.length;
  for (const n of t)
    for (let o = 0; o < 36; o++)
      r[i++] = n.charCodeAt(o);
  for (const n of Object.keys(l)) {
    r[i++] = s.get(n);
    let o = 0;
    for (const h of l[n])
      o += 5 + h.chain.length * 12;
    r[i++] = o;
    for (const h of l[n]) {
      r[i++] = s.get(h.source), r[i++] = h.chain.length, r[i++] = h.time, r[i++] = Number(h.intersectedReceiver), r[i++] = h.energy;
      for (const m of h.chain)
        r[i++] = s.get(m.object), r[i++] = m.angle, r[i++] = m.distance, r[i++] = m.energy, r[i++] = m.faceIndex, r[i++] = m.faceMaterialIndex, r[i++] = m.faceNormal[0], r[i++] = m.faceNormal[1], r[i++] = m.faceNormal[2], r[i++] = m.point[0], r[i++] = m.point[1], r[i++] = m.point[2];
    }
  }
  return r;
}
function Wt(l) {
  let e = 0;
  e++;
  const t = l[e++];
  if (!Number.isFinite(t) || t < 0 || t !== (t | 0))
    throw new Error("Invalid V2 buffer: bad numUUIDs");
  if (e + t * 36 > l.length)
    throw new Error("Invalid V2 buffer: UUID table exceeds buffer length");
  const s = [];
  for (let c = 0; c < t; c++) {
    const r = [];
    for (let i = 0; i < 36; i++)
      r.push(l[e++]);
    s.push(String.fromCharCode(...r));
  }
  const a = {};
  for (; e < l.length; ) {
    const c = l[e++];
    if (c < 0 || c >= s.length)
      throw new Error("Invalid V2 buffer: receiver index out of range");
    const r = s[c], i = l[e++];
    if (!Number.isFinite(i) || i < 0)
      throw new Error("Invalid V2 buffer: bad pathBufLen");
    const n = Math.min(e + i, l.length), o = [];
    for (; e < n; ) {
      const h = s[l[e++]], m = l[e++], f = l[e++], g = !!l[e++], u = l[e++], d = [];
      for (let I = 0; I < m; I++) {
        const p = s[l[e++]], y = l[e++], S = l[e++], R = l[e++], b = l[e++], v = l[e++], A = [l[e++], l[e++], l[e++]], _ = [l[e++], l[e++], l[e++]];
        d.push({
          object: p,
          angle: y,
          distance: S,
          energy: R,
          faceIndex: b,
          faceMaterialIndex: v,
          faceNormal: A,
          point: _
        });
      }
      o.push({
        source: h,
        chainLength: m,
        time: f,
        intersectedReceiver: g,
        energy: u,
        chain: d
      });
    }
    a[r] = o;
  }
  return a;
}
function $t(l) {
  return qt(l);
}
function Xt(l) {
  return l.length === 0 ? {} : l[0] === je ? Wt(l) : Yt(l);
}
const { floor: we, abs: Be } = Math, Zt = () => Math.random() > 0.5, Ye = "RAYTRACER_SET_PROPERTY";
function Kt(l, e, t, s, a, c = V, r = Ne(125, 8e3), i = 44100) {
  if (e.length === 0) throw Error("No receivers have been assigned to the raytracer");
  if (t.length === 0) throw Error("No sources have been assigned to the raytracer");
  if (l[e[0]].length === 0) throw Error("No rays have been traced yet");
  const n = l[e[0]].sort((d, I) => d.time - I.time), o = n[n.length - 1].time + J, h = Array(r.length).fill(c), m = we(i * o), f = [];
  for (let d = 0; d < r.length; d++)
    f.push(new Float32Array(m));
  let g = 0;
  const u = B.getState().containers[e[0]];
  for (let d = 0; d < n.length; d++) {
    const I = Zt() ? 1 : -1, p = n[d].time, y = n[d].arrivalDirection || [0, 0, 1], S = u.getGain(y), R = s(h, r, n[d], S).map((v) => v * I), b = we(p * i);
    for (let v = 0; v < r.length; v++)
      f[v][b] += R[v], Be(f[v][b]) > g && (g = Be(f[v][b]));
  }
  for (let d = 0; d < r.length; d++) {
    const I = it([at(f[d])], { sampleRate: i, bitDepth: 32 });
    Je.saveAs(I, `${r[d]}_${a}.wav`);
  }
}
async function Jt(l, e, t) {
  return Rt(l, e, t, Ye);
}
async function Qt(l, e, t, s) {
  return St(l, e, t, s);
}
async function er(l, e, t, s = 1, a) {
  return xt(l, e, t, s, a);
}
async function tr(l, e, t) {
  return _t(l, e, t, Ye);
}
async function rr(l, e, t) {
  return Dt(l, e, t);
}
function nr(l) {
  const e = {
    totalRays: 0,
    validRays: 0,
    estimatedT30: new Array(l).fill(0),
    t30Mean: new Array(l).fill(0),
    t30M2: new Array(l).fill(0),
    t30Count: 0,
    convergenceRatio: 1 / 0
  }, t = {}, s = Date.now();
  return { convergenceMetrics: e, energyHistogram: t, lastConvergenceCheck: s };
}
function sr(l, e, t, s, a, c, r, i, n) {
  l.totalRays = a, l.validRays = c;
  const o = Object.keys(e);
  if (o.length === 0) return;
  let h;
  if (s.length > 0)
    for (const p of s) {
      const y = e[p];
      if (y && y.length > 0) {
        h = p;
        break;
      }
    }
  if (!h) {
    const p = o.slice().sort();
    for (const y of p) {
      const S = e[y];
      if (S && S.length > 0) {
        h = y;
        break;
      }
    }
  }
  if (!h) return;
  const m = e[h];
  if (!m || m.length === 0) return;
  const f = t.length, g = new Array(f).fill(0);
  for (let p = 0; p < f; p++) {
    const y = m[p];
    let S = 0;
    for (let x = i - 1; x >= 0; x--)
      if (y[x] > 0) {
        S = x;
        break;
      }
    if (S < 2) {
      g[p] = 0;
      continue;
    }
    const R = new Float32Array(S + 1);
    R[S] = y[S];
    for (let x = S - 1; x >= 0; x--)
      R[x] = R[x + 1] + y[x];
    const b = R[0];
    if (b <= 0) {
      g[p] = 0;
      continue;
    }
    const v = b * Math.pow(10, -5 / 10), A = b * Math.pow(10, -35 / 10);
    let _ = -1, D = -1;
    for (let x = 0; x <= S; x++)
      _ < 0 && R[x] <= v && (_ = x), D < 0 && R[x] <= A && (D = x);
    if (_ >= 0 && D > _) {
      const x = [], P = [];
      for (let w = _; w <= D; w++) {
        const E = R[w];
        E > 0 && (x.push(w * r), P.push(10 * Math.log10(E / b)));
      }
      if (x.length >= 2) {
        const E = ot(x, P).m;
        g[p] = E < 0 ? 60 / -E : 0;
      }
    }
  }
  l.estimatedT30 = g, l.t30Count += 1;
  const u = l.t30Count;
  let d = 0, I = 0;
  for (let p = 0; p < f; p++) {
    const y = g[p], S = l.t30Mean[p], R = S + (y - S) / u, v = l.t30M2[p] + (y - S) * (y - R);
    if (l.t30Mean[p] = R, l.t30M2[p] = v, u >= 2 && R > 0) {
      const A = v / (u - 1), _ = Math.sqrt(A) / R;
      _ > d && (d = _), I++;
    }
  }
  l.convergenceRatio = I > 0 ? d : 1 / 0, q("RAYTRACER_SET_PROPERTY", {
    uuid: n,
    property: "convergenceMetrics",
    value: { ...l }
  });
}
function ir(l, e, t, s, a, c, r) {
  if (!l[e]) {
    l[e] = [];
    for (let o = 0; o < s.length; o++)
      l[e].push(new Float32Array(r));
  }
  let i = 0;
  for (let o = 0; o < t.chain.length; o++)
    i += t.chain[o].distance;
  i /= a;
  const n = Math.floor(i / c);
  if (n >= 0 && n < r && t.bandEnergy)
    for (let o = 0; o < s.length; o++)
      l[e][o][n] += t.bandEnergy[o] || 0;
}
function ar(l, e, t) {
  const s = l.allSurfaces, a = B.getState().containers, c = [], r = [], i = [], n = [];
  for (let D = 0; D < s.length; D++) {
    const x = s[D];
    c.push(x.uuid);
    const P = x.mesh, w = P.geometry, E = w.getAttribute("position"), z = w.getIndex();
    P.updateMatrixWorld(!0);
    const F = P.matrixWorld;
    if (z)
      for (let N = 0; N < z.count; N += 3) {
        for (let G = 0; G < 3; G++) {
          const H = z.getX(N + G), he = new T.Vector3(
            E.getX(H),
            E.getY(H),
            E.getZ(H)
          ).applyMatrix4(F);
          r.push(he.x, he.y, he.z);
        }
        const C = r.length - 9, k = Te(
          r[C],
          r[C + 1],
          r[C + 2],
          r[C + 3],
          r[C + 4],
          r[C + 5],
          r[C + 6],
          r[C + 7],
          r[C + 8]
        );
        i.push(k[0], k[1], k[2]), n.push(D);
      }
    else
      for (let N = 0; N < E.count; N += 3) {
        for (let G = 0; G < 3; G++) {
          const H = new T.Vector3(
            E.getX(N + G),
            E.getY(N + G),
            E.getZ(N + G)
          ).applyMatrix4(F);
          r.push(H.x, H.y, H.z);
        }
        const C = r.length - 9, k = Te(
          r[C],
          r[C + 1],
          r[C + 2],
          r[C + 3],
          r[C + 4],
          r[C + 5],
          r[C + 6],
          r[C + 7],
          r[C + 8]
        );
        i.push(k[0], k[1], k[2]), n.push(D);
      }
  }
  const o = n.length, h = new Float32Array(r), m = new Float32Array(i), f = new Uint32Array(n), g = new Float32Array(o * 3);
  for (let D = 0; D < o; D++) {
    const x = D * 9;
    g[D * 3] = (h[x] + h[x + 3] + h[x + 6]) / 3, g[D * 3 + 1] = (h[x + 1] + h[x + 4] + h[x + 7]) / 3, g[D * 3 + 2] = (h[x + 2] + h[x + 5] + h[x + 8]) / 3;
  }
  const u = new Uint32Array(o);
  for (let D = 0; D < o; D++) u[D] = D;
  const d = me(h, g, u, 0, o, 0), I = new Float32Array(o * 9), p = new Float32Array(o * 3), y = new Uint32Array(o);
  for (let D = 0; D < o; D++) {
    const x = u[D];
    I.set(h.subarray(x * 9, x * 9 + 9), D * 9), p.set(m.subarray(x * 3, x * 3 + 3), D * 3), y[D] = f[x];
  }
  const { nodeArray: S, nodeCount: R } = lr(d), b = t.length, v = new Float32Array(s.length * b * 2);
  for (let D = 0; D < s.length; D++) {
    const x = s[D];
    for (let P = 0; P < b; P++) {
      const w = (D * b + P) * 2;
      v[w] = x.absorptionFunction(t[P]), v[w + 1] = x.scatteringFunction(t[P]);
    }
  }
  const A = [], _ = [];
  for (const D of e) {
    const x = a[D];
    if (x) {
      A.push(D);
      const P = 0.1, w = x.scale, E = Math.max(Math.abs(w.x), Math.abs(w.y), Math.abs(w.z));
      _.push(x.position.x, x.position.y, x.position.z, P * E);
    }
  }
  return {
    bvhNodes: S,
    triangleVertices: I,
    triangleSurfaceIndex: y,
    triangleNormals: p,
    surfaceAcousticData: v,
    receiverSpheres: new Float32Array(_),
    triangleCount: o,
    nodeCount: R,
    surfaceCount: s.length,
    receiverCount: A.length,
    surfaceUuidMap: c,
    receiverUuidMap: A
  };
}
const or = 8, cr = 64;
function me(l, e, t, s, a, c) {
  let r = 1 / 0, i = 1 / 0, n = 1 / 0, o = -1 / 0, h = -1 / 0, m = -1 / 0;
  for (let A = s; A < a; A++) {
    const _ = t[A];
    for (let D = 0; D < 3; D++) {
      const x = _ * 9 + D * 3, P = l[x], w = l[x + 1], E = l[x + 2];
      P < r && (r = P), P > o && (o = P), w < i && (i = w), w > h && (h = w), E < n && (n = E), E > m && (m = E);
    }
  }
  const f = a - s;
  if (f <= or || c >= cr)
    return { boundsMin: [r, i, n], boundsMax: [o, h, m], left: null, right: null, triStart: s, triCount: f };
  const g = o - r, u = h - i, d = m - n, I = g >= u && g >= d ? 0 : u >= d ? 1 : 2;
  let p = 1 / 0, y = -1 / 0;
  for (let A = s; A < a; A++) {
    const _ = e[t[A] * 3 + I];
    _ < p && (p = _), _ > y && (y = _);
  }
  const S = (p + y) * 0.5;
  let R = s;
  for (let A = s; A < a; A++)
    if (e[t[A] * 3 + I] < S) {
      const _ = t[R];
      t[R] = t[A], t[A] = _, R++;
    }
  (R === s || R === a) && (R = s + a >> 1);
  const b = me(l, e, t, s, R, c + 1), v = me(l, e, t, R, a, c + 1);
  return { boundsMin: [r, i, n], boundsMax: [o, h, m], left: b, right: v, triStart: -1, triCount: -1 };
}
function lr(l) {
  let e = 0;
  const t = [l];
  for (; t.length > 0; ) {
    const r = t.pop();
    e++, r.left && t.push(r.left), r.right && t.push(r.right);
  }
  const s = new Float32Array(e * 8);
  let a = 0;
  function c(r) {
    const i = a++, n = i * 8;
    s[n] = r.boundsMin[0], s[n + 1] = r.boundsMin[1], s[n + 2] = r.boundsMin[2], s[n + 4] = r.boundsMax[0], s[n + 5] = r.boundsMax[1], s[n + 6] = r.boundsMax[2];
    const o = new Uint32Array(s.buffer);
    if (r.left && r.right) {
      const h = c(r.left), m = c(r.right);
      o[n + 3] = h, o[n + 7] = m;
    } else
      o[n + 3] = r.triStart, o[n + 7] = (r.triCount | 2147483648) >>> 0;
    return i;
  }
  return c(l), { nodeArray: s, nodeCount: e };
}
function Te(l, e, t, s, a, c, r, i, n) {
  const o = s - l, h = a - e, m = c - t, f = r - l, g = i - e, u = n - t;
  let d = h * u - m * g, I = m * f - o * u, p = o * g - h * f;
  const y = Math.sqrt(d * d + I * I + p * p);
  return y > 1e-10 && (d /= y, I /= y, p /= y), [d, I, p];
}
const hr = `// ─── GPU Ray Tracer Compute Shader ───────────────────────────────────\r
// Traces one ray per thread through all bounces using an iterative BVH\r
// traversal and Moller–Trumbore ray-triangle intersection.\r
//\r
// Mirrors the CPU implementation in ray-core.ts.\r
\r
// Constants\r
const MAX_BOUNCES: u32 = 64u;\r
const MAX_BANDS: u32 = 7u;\r
const BVH_STACK_SIZE: u32 = 64u;\r
const SELF_INTERSECTION_OFFSET: f32 = 0.01;\r
const PI: f32 = 3.14159265358979;\r
const EPSILON: f32 = 1e-6;\r
\r
// ─── Structures ──────────────────────────────────────────────────────\r
\r
struct Params {\r
  numRays: u32,\r
  maxBounces: u32,\r
  numBands: u32,\r
  numReceivers: u32,\r
  numTriangles: u32,\r
  numNodes: u32,\r
  numSurfaces: u32,\r
  batchSeed: u32,\r
  rrThreshold: f32,\r
  _pad0: f32,\r
  _pad1: f32,\r
  _pad2: f32,\r
  // Per-band air attenuation in dB/m (up to MAX_BANDS), packed into vec4s\r
  // to satisfy uniform buffer layout rules (array<f32> has 16-byte stride).\r
  // airAttPacked[0] = (band0, band1, band2, band3)\r
  // airAttPacked[1] = (band4, band5, band6, unused)\r
  airAttPacked: array<vec4<f32>, 2>,\r
}\r
\r
fn getAirAtt(band: u32) -> f32 {\r
  return params.airAttPacked[band / 4u][band % 4u];\r
}\r
\r
// Per-bounce output written to the chain buffer\r
struct ChainEntry {\r
  px: f32, py: f32, pz: f32,\r
  distance: f32,\r
  surfaceIndex: u32,\r
  _pad0: u32,\r
  angle: f32,\r
  energy: f32,\r
  bandEnergy: array<f32, 7>,\r
  _pad1: f32,\r
}\r
\r
// Per-ray output\r
struct RayOutput {\r
  chainLength: u32,\r
  intersectedReceiver: u32, // 0 or 1\r
  receiverIndex: u32,\r
  arrivalDirX: f32,\r
  arrivalDirY: f32,\r
  arrivalDirZ: f32,\r
  _pad0: f32,\r
  _pad1: f32,\r
  finalBandEnergy: array<f32, 7>,\r
  _pad2: f32,\r
}\r
\r
// Per-ray input\r
struct RayInput {\r
  ox: f32, oy: f32, oz: f32,\r
  dx: f32, dy: f32, dz: f32,\r
  initialPhi: f32,\r
  initialTheta: f32,\r
  bandEnergy: array<f32, 7>,\r
  _pad: f32,\r
}\r
\r
// ─── Bindings ────────────────────────────────────────────────────────\r
\r
@group(0) @binding(0) var<uniform> params: Params;\r
@group(0) @binding(1) var<storage, read> bvhNodes: array<f32>;\r
@group(0) @binding(2) var<storage, read> triVerts: array<f32>;\r
@group(0) @binding(3) var<storage, read> triSurfIndex: array<u32>;\r
@group(0) @binding(4) var<storage, read> triNormals: array<f32>;\r
@group(0) @binding(5) var<storage, read> surfAcoustic: array<f32>;\r
@group(0) @binding(6) var<storage, read> receiverSpheres: array<f32>;\r
@group(0) @binding(7) var<storage, read> rayInputs: array<RayInput>;\r
@group(0) @binding(8) var<storage, read_write> rayOutputs: array<RayOutput>;\r
@group(0) @binding(9) var<storage, read_write> chainBuffer: array<ChainEntry>;\r
\r
// ─── RNG (PCG hash) ─────────────────────────────────────────────────\r
\r
fn pcg_hash(input: u32) -> u32 {\r
  var state = input * 747796405u + 2891336453u;\r
  var word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;\r
  return (word >> 22u) ^ word;\r
}\r
\r
fn rand(seed: ptr<function, u32>) -> f32 {\r
  *seed = pcg_hash(*seed);\r
  return f32(*seed) / 4294967295.0;\r
}\r
\r
// ─── Vector helpers ─────────────────────────────────────────────────\r
\r
fn dot3(ax: f32, ay: f32, az: f32, bx: f32, by: f32, bz: f32) -> f32 {\r
  return ax * bx + ay * by + az * bz;\r
}\r
\r
fn length3(x: f32, y: f32, z: f32) -> f32 {\r
  return sqrt(x * x + y * y + z * z);\r
}\r
\r
fn normalize3(x: f32, y: f32, z: f32) -> vec3<f32> {\r
  let len = length3(x, y, z);\r
  if (len < EPSILON) { return vec3<f32>(0.0, 1.0, 0.0); }\r
  return vec3<f32>(x / len, y / len, z / len);\r
}\r
\r
// ─── Ray-AABB slab test ─────────────────────────────────────────────\r
\r
fn rayAabbIntersect(\r
  ox: f32, oy: f32, oz: f32,\r
  invDx: f32, invDy: f32, invDz: f32,\r
  bminX: f32, bminY: f32, bminZ: f32,\r
  bmaxX: f32, bmaxY: f32, bmaxZ: f32,\r
  tMax: f32,\r
) -> bool {\r
  var t1 = (bminX - ox) * invDx;\r
  var t2 = (bmaxX - ox) * invDx;\r
  var tNear = min(t1, t2);\r
  var tFar = max(t1, t2);\r
\r
  t1 = (bminY - oy) * invDy;\r
  t2 = (bmaxY - oy) * invDy;\r
  tNear = max(tNear, min(t1, t2));\r
  tFar = min(tFar, max(t1, t2));\r
\r
  t1 = (bminZ - oz) * invDz;\r
  t2 = (bmaxZ - oz) * invDz;\r
  tNear = max(tNear, min(t1, t2));\r
  tFar = min(tFar, max(t1, t2));\r
\r
  return tNear <= tFar && tFar >= 0.0 && tNear < tMax;\r
}\r
\r
// ─── Moller–Trumbore ray-triangle intersection ──────────────────────\r
\r
fn rayTriIntersect(\r
  ox: f32, oy: f32, oz: f32,\r
  dx: f32, dy: f32, dz: f32,\r
  triIdx: u32,\r
) -> vec2<f32> {\r
  // Returns (t, 0) on hit, (-1, 0) on miss\r
  let b = triIdx * 9u;\r
  let v0x = triVerts[b]; let v0y = triVerts[b + 1u]; let v0z = triVerts[b + 2u];\r
  let v1x = triVerts[b + 3u]; let v1y = triVerts[b + 4u]; let v1z = triVerts[b + 5u];\r
  let v2x = triVerts[b + 6u]; let v2y = triVerts[b + 7u]; let v2z = triVerts[b + 8u];\r
\r
  let e1x = v1x - v0x; let e1y = v1y - v0y; let e1z = v1z - v0z;\r
  let e2x = v2x - v0x; let e2y = v2y - v0y; let e2z = v2z - v0z;\r
\r
  // h = cross(d, e2)\r
  let hx = dy * e2z - dz * e2y;\r
  let hy = dz * e2x - dx * e2z;\r
  let hz = dx * e2y - dy * e2x;\r
\r
  let a = e1x * hx + e1y * hy + e1z * hz;\r
  if (abs(a) < EPSILON) { return vec2<f32>(-1.0, 0.0); }\r
\r
  let f_inv = 1.0 / a;\r
  let sx = ox - v0x; let sy = oy - v0y; let sz = oz - v0z;\r
  let u = f_inv * (sx * hx + sy * hy + sz * hz);\r
  if (u < 0.0 || u > 1.0) { return vec2<f32>(-1.0, 0.0); }\r
\r
  // q = cross(s, e1)\r
  let qx = sy * e1z - sz * e1y;\r
  let qy = sz * e1x - sx * e1z;\r
  let qz = sx * e1y - sy * e1x;\r
  let v = f_inv * (dx * qx + dy * qy + dz * qz);\r
  if (v < 0.0 || u + v > 1.0) { return vec2<f32>(-1.0, 0.0); }\r
\r
  let t = f_inv * (e2x * qx + e2y * qy + e2z * qz);\r
  if (t < EPSILON) { return vec2<f32>(-1.0, 0.0); }\r
\r
  return vec2<f32>(t, 0.0);\r
}\r
\r
// ─── Ray-sphere intersection ────────────────────────────────────────\r
\r
fn raySphereIntersect(\r
  ox: f32, oy: f32, oz: f32,\r
  dx: f32, dy: f32, dz: f32,\r
  cx: f32, cy: f32, cz: f32,\r
  r: f32,\r
) -> f32 {\r
  let lx = cx - ox; let ly = cy - oy; let lz = cz - oz;\r
  let tca = lx * dx + ly * dy + lz * dz;\r
  let d2 = lx * lx + ly * ly + lz * lz - tca * tca;\r
  let r2 = r * r;\r
  if (d2 > r2) { return -1.0; }\r
  let thc = sqrt(r2 - d2);\r
  var t0 = tca - thc;\r
  let t1 = tca + thc;\r
  if (t0 < EPSILON) { t0 = t1; }\r
  if (t0 < EPSILON) { return -1.0; }\r
  return t0;\r
}\r
\r
// ─── BVH traversal — find closest triangle hit ─────────────────────\r
\r
struct HitResult {\r
  t: f32,\r
  triIdx: u32,\r
  hit: bool,\r
}\r
\r
fn traceClosest(\r
  ox: f32, oy: f32, oz: f32,\r
  dx: f32, dy: f32, dz: f32,\r
) -> HitResult {\r
  var result: HitResult;\r
  result.t = 1e30;\r
  result.triIdx = 0u;\r
  result.hit = false;\r
\r
  let invDx = select(1e30, 1.0 / dx, abs(dx) > EPSILON);\r
  let invDy = select(1e30, 1.0 / dy, abs(dy) > EPSILON);\r
  let invDz = select(1e30, 1.0 / dz, abs(dz) > EPSILON);\r
\r
  var stack: array<u32, 64>;\r
  var stackPtr: u32 = 0u;\r
  stack[0] = 0u; // root node index\r
  stackPtr = 1u;\r
\r
  while (stackPtr > 0u) {\r
    stackPtr -= 1u;\r
    let nodeIdx = stack[stackPtr];\r
    let off = nodeIdx * 8u;\r
\r
    let bminX = bvhNodes[off];\r
    let bminY = bvhNodes[off + 1u];\r
    let bminZ = bvhNodes[off + 2u];\r
    let bmaxX = bvhNodes[off + 4u];\r
    let bmaxY = bvhNodes[off + 5u];\r
    let bmaxZ = bvhNodes[off + 6u];\r
\r
    if (!rayAabbIntersect(ox, oy, oz, invDx, invDy, invDz, bminX, bminY, bminZ, bmaxX, bmaxY, bmaxZ, result.t)) {\r
      continue;\r
    }\r
\r
    // Read data1 as u32 to check leaf flag\r
    let data1Bits = bitcast<u32>(bvhNodes[off + 7u]);\r
    let isLeaf = (data1Bits & 0x80000000u) != 0u;\r
\r
    if (isLeaf) {\r
      let triStart = bitcast<u32>(bvhNodes[off + 3u]);\r
      let triCount = data1Bits & 0x7FFFFFFFu;\r
      for (var i = 0u; i < triCount; i++) {\r
        let tri = triStart + i;\r
        let res = rayTriIntersect(ox, oy, oz, dx, dy, dz, tri);\r
        if (res.x > 0.0 && res.x < result.t) {\r
          result.t = res.x;\r
          result.triIdx = tri;\r
          result.hit = true;\r
        }\r
      }\r
    } else {\r
      let leftIdx = bitcast<u32>(bvhNodes[off + 3u]);\r
      let rightIdx = data1Bits;\r
      if (stackPtr < BVH_STACK_SIZE) {\r
        stack[stackPtr] = leftIdx;\r
        stackPtr += 1u;\r
      }\r
      if (stackPtr < BVH_STACK_SIZE) {\r
        stack[stackPtr] = rightIdx;\r
        stackPtr += 1u;\r
      }\r
    }\r
  }\r
\r
  return result;\r
}\r
\r
// ─── Reflection coefficient (matches CPU reflection-coefficient.ts) ──\r
\r
fn reflectionCoefficient(alpha: f32, theta: f32) -> f32 {\r
  let rootOneMinusAlpha = sqrt(max(1.0 - alpha, 0.0));\r
  let xi_o = (1.0 - rootOneMinusAlpha) / (1.0 + rootOneMinusAlpha);\r
  let cosTheta = abs(cos(theta));\r
  let xi_o_cosTheta = xi_o * cosTheta;\r
  let R = (xi_o_cosTheta - 1.0) / (xi_o_cosTheta + 1.0);\r
  return R * R;\r
}\r
\r
// ─── Main compute entry point ───────────────────────────────────────\r
\r
@compute @workgroup_size(64)\r
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {\r
  let rayIdx = gid.x;\r
  if (rayIdx >= params.numRays) { return; }\r
\r
  let inp = rayInputs[rayIdx];\r
  let numBands = min(params.numBands, MAX_BANDS);\r
  let maxBounces = min(params.maxBounces, MAX_BOUNCES);\r
\r
  var rngSeed: u32 = pcg_hash(rayIdx * 747796405u + params.batchSeed);\r
\r
  // Current ray state\r
  var ox = inp.ox; var oy = inp.oy; var oz = inp.oz;\r
  var dx = inp.dx; var dy = inp.dy; var dz = inp.dz;\r
  var d = normalize3(dx, dy, dz);\r
  dx = d.x; dy = d.y; dz = d.z;\r
\r
  var bandEnergy: array<f32, 7>;\r
  for (var b = 0u; b < numBands; b++) {\r
    bandEnergy[b] = inp.bandEnergy[b];\r
  }\r
\r
  // Output\r
  let chainBase = rayIdx * MAX_BOUNCES;\r
  var chainLen: u32 = 0u;\r
  var hitReceiver: u32 = 0u;\r
  var receiverIdx: u32 = 0u;\r
  var arrivalDir = vec3<f32>(0.0, 0.0, 0.0);\r
\r
  for (var bounce = 0u; bounce < maxBounces; bounce++) {\r
    // Check receiver spheres first (find closest)\r
    var closestRecT: f32 = 1e30;\r
    var closestRecIdx: u32 = 0u;\r
    var recHit = false;\r
    for (var ri = 0u; ri < params.numReceivers; ri++) {\r
      let rb = ri * 4u;\r
      let rcx = receiverSpheres[rb];\r
      let rcy = receiverSpheres[rb + 1u];\r
      let rcz = receiverSpheres[rb + 2u];\r
      let rr = receiverSpheres[rb + 3u];\r
      let t = raySphereIntersect(ox, oy, oz, dx, dy, dz, rcx, rcy, rcz, rr);\r
      if (t > 0.0 && t < closestRecT) {\r
        closestRecT = t;\r
        closestRecIdx = ri;\r
        recHit = true;\r
      }\r
    }\r
\r
    // BVH closest triangle hit\r
    let triHit = traceClosest(ox, oy, oz, dx, dy, dz);\r
\r
    // Receiver is closer than any surface — ray enters receiver\r
    if (recHit && closestRecT < triHit.t) {\r
      // Apply air absorption for receiver segment\r
      for (var b = 0u; b < numBands; b++) {\r
        bandEnergy[b] *= pow(10.0, -getAirAtt(b) * closestRecT / 10.0);\r
      }\r
\r
      // Compute mean energy\r
      var totalE: f32 = 0.0;\r
      for (var b = 0u; b < numBands; b++) { totalE += bandEnergy[b]; }\r
      let meanE = totalE / f32(numBands);\r
\r
      // Record chain entry at receiver position\r
      if (chainLen < MAX_BOUNCES) {\r
        let ci = chainBase + chainLen;\r
        chainBuffer[ci].px = ox + dx * closestRecT;\r
        chainBuffer[ci].py = oy + dy * closestRecT;\r
        chainBuffer[ci].pz = oz + dz * closestRecT;\r
        chainBuffer[ci].distance = closestRecT;\r
        // Store receiver index encoded as surface index + numSurfaces offset\r
        chainBuffer[ci].surfaceIndex = params.numSurfaces + closestRecIdx;\r
        chainBuffer[ci].angle = 0.0;\r
        chainBuffer[ci].energy = meanE;\r
        for (var b = 0u; b < numBands; b++) {\r
          chainBuffer[ci].bandEnergy[b] = bandEnergy[b];\r
        }\r
        chainLen += 1u;\r
      }\r
\r
      hitReceiver = 1u;\r
      receiverIdx = closestRecIdx;\r
      arrivalDir = normalize3(-dx, -dy, -dz);\r
      break;\r
    }\r
\r
    // No surface hit — ray escapes\r
    if (!triHit.hit) { break; }\r
\r
    // Surface hit\r
    let hitT = triHit.t;\r
    let hitTri = triHit.triIdx;\r
    let surfIdx = triSurfIndex[hitTri];\r
\r
    // Hit point\r
    let hx = ox + dx * hitT;\r
    let hy = oy + dy * hitT;\r
    let hz = oz + dz * hitT;\r
\r
    // Face normal\r
    let nb = hitTri * 3u;\r
    let nx = triNormals[nb];\r
    let ny = triNormals[nb + 1u];\r
    let nz = triNormals[nb + 2u];\r
\r
    // Incidence angle\r
    let negDdotN = -(dx * nx + dy * ny + dz * nz);\r
    let angle = acos(clamp(abs(negDdotN), 0.0, 1.0));\r
\r
    // Mean energy before reflection (for chain output)\r
    var totalEBefore: f32 = 0.0;\r
    for (var b = 0u; b < numBands; b++) { totalEBefore += bandEnergy[b]; }\r
    let meanEBefore = totalEBefore / f32(numBands);\r
\r
    // Record chain entry\r
    if (chainLen < MAX_BOUNCES) {\r
      let ci = chainBase + chainLen;\r
      chainBuffer[ci].px = hx;\r
      chainBuffer[ci].py = hy;\r
      chainBuffer[ci].pz = hz;\r
      chainBuffer[ci].distance = hitT;\r
      chainBuffer[ci].surfaceIndex = surfIdx;\r
      chainBuffer[ci].angle = angle;\r
      chainBuffer[ci].energy = meanEBefore;\r
      for (var b = 0u; b < numBands; b++) {\r
        chainBuffer[ci].bandEnergy[b] = bandEnergy[b];\r
      }\r
      chainLen += 1u;\r
    }\r
\r
    // Apply per-band reflection loss and air absorption\r
    var broadbandScatter: f32 = 0.0;\r
    var totalEForScatter: f32 = 0.0;\r
\r
    for (var b = 0u; b < numBands; b++) {\r
      let acousticOffset = (surfIdx * params.numBands + b) * 2u;\r
      let alpha = surfAcoustic[acousticOffset];\r
      let scatter = surfAcoustic[acousticOffset + 1u];\r
\r
      let R = reflectionCoefficient(alpha, angle);\r
      bandEnergy[b] *= abs(R);\r
      bandEnergy[b] *= pow(10.0, -getAirAtt(b) * hitT / 10.0);\r
\r
      broadbandScatter += scatter * bandEnergy[b];\r
      totalEForScatter += bandEnergy[b];\r
    }\r
\r
    if (totalEForScatter > 0.0) {\r
      broadbandScatter /= totalEForScatter;\r
    }\r
\r
    // Russian Roulette termination\r
    var maxE: f32 = 0.0;\r
    for (var b = 0u; b < numBands; b++) {\r
      maxE = max(maxE, bandEnergy[b]);\r
    }\r
\r
    if (maxE < params.rrThreshold && maxE > 0.0) {\r
      let survivalProb = maxE / params.rrThreshold;\r
      if (rand(&rngSeed) > survivalProb) {\r
        break; // Terminate\r
      }\r
      // Boost survivors\r
      for (var b = 0u; b < numBands; b++) {\r
        bandEnergy[b] /= survivalProb;\r
      }\r
    } else if (maxE <= 0.0) {\r
      break;\r
    }\r
\r
    // Compute reflected direction\r
    // Specular: r = d - 2(d·n)n\r
    let dDotN = dx * nx + dy * ny + dz * nz;\r
    var rx = dx - 2.0 * dDotN * nx;\r
    var ry = dy - 2.0 * dDotN * ny;\r
    var rz = dz - 2.0 * dDotN * nz;\r
\r
    // Scattering: probabilistic Lambert vs specular\r
    if (rand(&rngSeed) < broadbandScatter) {\r
      // Cosine-weighted hemisphere sampling (rejection + normal offset)\r
      var sx: f32; var sy: f32; var sz: f32; var lenSq: f32;\r
      loop {\r
        sx = rand(&rngSeed) * 2.0 - 1.0;\r
        sy = rand(&rngSeed) * 2.0 - 1.0;\r
        sz = rand(&rngSeed) * 2.0 - 1.0;\r
        lenSq = sx * sx + sy * sy + sz * sz;\r
        if (lenSq <= 1.0 && lenSq > 1e-6) { break; }\r
      }\r
      let invLen = 1.0 / sqrt(lenSq);\r
      sx *= invLen; sy *= invLen; sz *= invLen;\r
      // Offset along normal for cosine distribution\r
      rx = sx + nx;\r
      ry = sy + ny;\r
      rz = sz + nz;\r
    }\r
\r
    // Normalize reflected direction\r
    d = normalize3(rx, ry, rz);\r
    dx = d.x; dy = d.y; dz = d.z;\r
\r
    // Offset origin along normal to avoid self-intersection\r
    ox = hx + nx * SELF_INTERSECTION_OFFSET;\r
    oy = hy + ny * SELF_INTERSECTION_OFFSET;\r
    oz = hz + nz * SELF_INTERSECTION_OFFSET;\r
  }\r
\r
  // Write output\r
  rayOutputs[rayIdx].chainLength = chainLen;\r
  rayOutputs[rayIdx].intersectedReceiver = hitReceiver;\r
  rayOutputs[rayIdx].receiverIndex = receiverIdx;\r
  rayOutputs[rayIdx].arrivalDirX = arrivalDir.x;\r
  rayOutputs[rayIdx].arrivalDirY = arrivalDir.y;\r
  rayOutputs[rayIdx].arrivalDirZ = arrivalDir.z;\r
  for (var b = 0u; b < min(params.numBands, MAX_BANDS); b++) {\r
    rayOutputs[rayIdx].finalBandEnergy[b] = bandEnergy[b];\r
  }\r
}\r
`, j = 64, Ce = 7, ur = 64, qe = 16, Me = qe * 4, ye = 16, ze = ye * 4, ve = 16, fe = ve * 4, fr = 20, Oe = fr * 4;
class dr {
  device = null;
  pipeline = null;
  bindGroupLayout = null;
  // Scene buffers
  sceneBuf = null;
  gpuBvhNodes = null;
  gpuTriVerts = null;
  gpuTriSurfIdx = null;
  gpuTriNormals = null;
  gpuSurfAcoustic = null;
  gpuReceiverSpheres = null;
  // Per-dispatch buffers
  gpuRayInputs = null;
  gpuRayOutputs = null;
  gpuChainBuffer = null;
  gpuParams = null;
  gpuReadbackOutput = null;
  gpuReadbackChain = null;
  config = null;
  maxBatchSize = 0;
  /** The actual batch size after clamping to device limits. */
  get effectiveBatchSize() {
    return this.maxBatchSize;
  }
  async initialize(e, t, s, a) {
    const c = await Qe();
    if (!c) return !1;
    this.device = c.device, this.config = s;
    const r = c.device.limits.maxStorageBufferBindingSize, i = c.device.limits.maxBufferSize, n = j * fe, o = Math.floor(Math.min(r, i) / n);
    if (o < 1)
      return console.error("[GPU RT] Device storage limits too small for even a single ray chain buffer"), !1;
    const h = Math.max(1, a), m = Math.min(h, o);
    m < h && console.warn(`[GPU RT] batchSize ${h} exceeds device limits; clamped to ${m}`), this.maxBatchSize = m, s.reflectionOrder > j && console.warn(`[GPU RT] reflectionOrder ${s.reflectionOrder} clamped to ${j}`);
    const f = s.frequencies.slice(0, Ce);
    this.sceneBuf = ar(e, t, f), this.gpuBvhNodes = this.createStorageBuffer(this.sceneBuf.bvhNodes), this.gpuTriVerts = this.createStorageBuffer(this.sceneBuf.triangleVertices), this.gpuTriSurfIdx = this.createStorageBuffer(new Uint32Array(this.sceneBuf.triangleSurfaceIndex)), this.gpuTriNormals = this.createStorageBuffer(this.sceneBuf.triangleNormals), this.gpuSurfAcoustic = this.createStorageBuffer(this.sceneBuf.surfaceAcousticData);
    const g = this.sceneBuf.receiverSpheres.length > 0 ? this.sceneBuf.receiverSpheres : new Float32Array(4);
    this.gpuReceiverSpheres = this.createStorageBuffer(g);
    const u = m * Me, d = m * ze, I = m * j * fe;
    this.gpuRayInputs = this.device.createBuffer({
      size: u,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    }), this.gpuRayOutputs = this.device.createBuffer({
      size: d,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    }), this.gpuChainBuffer = this.device.createBuffer({
      size: I,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    }), this.gpuParams = this.device.createBuffer({
      size: Oe,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackOutput = this.device.createBuffer({
      size: d,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackChain = this.device.createBuffer({
      size: I,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    const p = this.device.createShaderModule({ code: hr });
    return this.pipeline = this.device.createComputePipeline({
      layout: "auto",
      compute: { module: p, entryPoint: "main" }
    }), this.bindGroupLayout = this.pipeline.getBindGroupLayout(0), !0;
  }
  async traceBatch(e, t, s) {
    if (!this.device || !this.pipeline || !this.sceneBuf || !this.config)
      throw new Error("[GPU RT] Not initialized");
    if (t > this.maxBatchSize)
      throw new Error(`[GPU RT] rayCount ${t} exceeds maxBatchSize ${this.maxBatchSize}`);
    if (t === 0) return [];
    const a = Math.min(this.config.frequencies.length, Ce), c = new ArrayBuffer(Oe), r = new Uint32Array(c), i = new Float32Array(c);
    r[0] = t, r[1] = Math.min(this.config.reflectionOrder, j), r[2] = a, r[3] = this.sceneBuf.receiverCount, r[4] = this.sceneBuf.triangleCount, r[5] = this.sceneBuf.nodeCount, r[6] = this.sceneBuf.surfaceCount, r[7] = s, i[8] = this.config.rrThreshold;
    for (let I = 0; I < a; I++)
      i[12 + I] = this.config.cachedAirAtt[I];
    this.device.queue.writeBuffer(this.gpuParams, 0, c), this.device.queue.writeBuffer(
      this.gpuRayInputs,
      0,
      e.buffer,
      e.byteOffset,
      t * Me
    );
    const n = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this.gpuParams } },
        { binding: 1, resource: { buffer: this.gpuBvhNodes } },
        { binding: 2, resource: { buffer: this.gpuTriVerts } },
        { binding: 3, resource: { buffer: this.gpuTriSurfIdx } },
        { binding: 4, resource: { buffer: this.gpuTriNormals } },
        { binding: 5, resource: { buffer: this.gpuSurfAcoustic } },
        { binding: 6, resource: { buffer: this.gpuReceiverSpheres } },
        { binding: 7, resource: { buffer: this.gpuRayInputs } },
        { binding: 8, resource: { buffer: this.gpuRayOutputs } },
        { binding: 9, resource: { buffer: this.gpuChainBuffer } }
      ]
    }), o = Math.ceil(t / ur), h = this.device.createCommandEncoder(), m = h.beginComputePass();
    m.setPipeline(this.pipeline), m.setBindGroup(0, n), m.dispatchWorkgroups(o), m.end();
    const f = t * ze, g = t * j * fe;
    h.copyBufferToBuffer(this.gpuRayOutputs, 0, this.gpuReadbackOutput, 0, f), h.copyBufferToBuffer(this.gpuChainBuffer, 0, this.gpuReadbackChain, 0, g), this.device.queue.submit([h.finish()]), await this.gpuReadbackOutput.mapAsync(GPUMapMode.READ, 0, f), await this.gpuReadbackChain.mapAsync(GPUMapMode.READ, 0, g);
    const u = new Float32Array(this.gpuReadbackOutput.getMappedRange(0, f).slice(0)), d = new Float32Array(this.gpuReadbackChain.getMappedRange(0, g).slice(0));
    return this.gpuReadbackOutput.unmap(), this.gpuReadbackChain.unmap(), this.parseResults(u, d, e, t, a);
  }
  parseResults(e, t, s, a, c) {
    const r = new Array(a), i = this.sceneBuf;
    for (let n = 0; n < a; n++) {
      const o = n * ye, h = new Uint32Array(e.buffer, o * 4, ye), m = h[0], f = h[1] !== 0;
      if (m === 0) {
        r[n] = null;
        continue;
      }
      const g = [
        e[o + 3],
        e[o + 4],
        e[o + 5]
      ], u = [];
      for (let v = 0; v < c; v++)
        u.push(e[o + 8 + v]);
      const d = [], I = n * j;
      for (let v = 0; v < m; v++) {
        const A = (I + v) * ve, _ = new Uint32Array(t.buffer, A * 4, ve), D = t[A], x = t[A + 1], P = t[A + 2], w = t[A + 3], E = _[4], z = t[A + 6], F = t[A + 7], N = [];
        for (let k = 0; k < c; k++)
          N.push(t[A + 8 + k]);
        let C;
        if (E >= i.surfaceCount) {
          const k = E - i.surfaceCount;
          C = i.receiverUuidMap[k] ?? "";
        } else
          C = i.surfaceUuidMap[E] ?? "";
        d.push({
          point: [D, x, P],
          distance: w,
          object: C,
          faceNormal: [0, 0, 0],
          faceIndex: -1,
          faceMaterialIndex: -1,
          angle: z,
          energy: F,
          bandEnergy: N
        });
      }
      const p = n * qe, y = s[p + 6], S = s[p + 7], R = u.reduce((v, A) => v + A, 0), b = c > 0 ? R / c : 0;
      r[n] = {
        intersectedReceiver: f,
        chain: d,
        chainLength: d.length,
        energy: b,
        bandEnergy: u,
        time: 0,
        // Computed by caller (stop())
        source: "",
        // Filled in by caller
        initialPhi: y,
        initialTheta: S,
        totalLength: 0,
        // Computed by caller
        arrivalDirection: f ? g : void 0
      };
    }
    return r;
  }
  dispose() {
    const e = [
      this.gpuBvhNodes,
      this.gpuTriVerts,
      this.gpuTriSurfIdx,
      this.gpuTriNormals,
      this.gpuSurfAcoustic,
      this.gpuReceiverSpheres,
      this.gpuRayInputs,
      this.gpuRayOutputs,
      this.gpuChainBuffer,
      this.gpuParams,
      this.gpuReadbackOutput,
      this.gpuReadbackChain
    ];
    for (const t of e)
      t && t.destroy();
    this.gpuBvhNodes = null, this.gpuTriVerts = null, this.gpuTriSurfIdx = null, this.gpuTriNormals = null, this.gpuSurfAcoustic = null, this.gpuReceiverSpheres = null, this.gpuRayInputs = null, this.gpuRayOutputs = null, this.gpuChainBuffer = null, this.gpuParams = null, this.gpuReadbackOutput = null, this.gpuReadbackChain = null, this.pipeline = null, this.bindGroupLayout = null, this.device = null, this.sceneBuf = null, this.config = null;
  }
  createStorageBuffer(e) {
    const t = Math.max(e.byteLength, 16), s = this.device.createBuffer({
      size: t,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    return this.device.queue.writeBuffer(
      s,
      0,
      e.buffer,
      e.byteOffset,
      e.byteLength
    ), s;
  }
}
const de = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
)), { floor: Y, random: gr, abs: te } = Math, ge = () => gr() > 0.5;
T.BufferGeometry.prototype.computeBoundsTree = $e;
T.BufferGeometry.prototype.disposeBoundsTree = Xe;
T.Mesh.prototype.raycast = Ze;
class pr extends We {
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
  frequencies;
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
  plotData;
  intensitySampleRate;
  validRayCount;
  plotStyle;
  bvh;
  observed_name;
  _cachedAirAtt;
  hybrid;
  transitionOrder;
  convergenceThreshold;
  autoStop;
  rrThreshold;
  convergenceMetrics;
  _energyHistogram;
  _histogramBinWidth;
  _histogramNumBins;
  _lastConvergenceCheck;
  _convergenceCheckInterval;
  _directivityRefPressures;
  maxStoredPaths;
  edgeDiffractionEnabled;
  lateReverbTailEnabled;
  tailCrossfadeTime;
  tailCrossfadeDuration;
  _edgeGraph;
  gpuEnabled;
  gpuBatchSize;
  _gpuRayTracer = null;
  _gpuRunning = !1;
  _rafId = 0;
  // Binaural output properties
  hrtfSubjectId;
  headYaw;
  headPitch;
  headRoll;
  binauralImpulseResponse;
  binauralPlaying = !1;
  constructor(e) {
    super(e), this.kind = "ray-tracer", e = { ...M, ...e }, this.uuid = e.uuid || this.uuid, this.name = e.name || M.name, this.observed_name = wt(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = e.sourceIDs || M.sourceIDs, this.surfaceIDs = e.surfaceIDs || M.surfaceIDs, this.roomID = e.roomID || M.roomID, this.receiverIDs = e.receiverIDs || M.receiverIDs, this.updateInterval = e.updateInterval || M.updateInterval, this.reflectionOrder = e.reflectionOrder || M.reflectionOrder, this._isRunning = e.isRunning || M.isRunning, this._runningWithoutReceivers = e.runningWithoutReceivers || M.runningWithoutReceivers, this.frequencies = e.frequencies || M.frequencies, this._cachedAirAtt = ae(this.frequencies, this.temperature), this.intervals = [], this.plotData = [], this.plotStyle = e.plotStyle || M.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = e.pointSize || M.pointSize, this.validRayCount = 0, this.intensitySampleRate = ct, this.quickEstimateResults = {};
    const t = typeof e.raysVisible == "boolean";
    this._raysVisible = t ? e.raysVisible : M.raysVisible;
    const s = typeof e.pointsVisible == "boolean";
    this._pointsVisible = s ? e.pointsVisible : M.pointsVisible;
    const a = typeof e.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = a ? e.invertedDrawStyle : M.invertedDrawStyle, this.passes = e.passes || M.passes, this.raycaster = new T.Raycaster(), this.rayBufferGeometry = new T.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new T.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(T.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new T.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(T.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.convergenceThreshold = e.convergenceThreshold ?? M.convergenceThreshold, this.autoStop = e.autoStop ?? M.autoStop, this.rrThreshold = e.rrThreshold ?? M.rrThreshold, this.maxStoredPaths = e.maxStoredPaths ?? M.maxStoredPaths, this.edgeDiffractionEnabled = e.edgeDiffractionEnabled ?? M.edgeDiffractionEnabled, this.lateReverbTailEnabled = e.lateReverbTailEnabled ?? M.lateReverbTailEnabled, this.tailCrossfadeTime = e.tailCrossfadeTime ?? M.tailCrossfadeTime, this.tailCrossfadeDuration = e.tailCrossfadeDuration ?? M.tailCrossfadeDuration, this.gpuEnabled = e.gpuEnabled ?? M.gpuEnabled, this.gpuBatchSize = e.gpuBatchSize ?? M.gpuBatchSize, this.hrtfSubjectId = e.hrtfSubjectId ?? "D1", this.headYaw = e.headYaw ?? 0, this.headPitch = e.headPitch ?? 0, this.headRoll = e.headRoll ?? 0, this._edgeGraph = null, this._histogramBinWidth = lt, this._histogramNumBins = ht, this._convergenceCheckInterval = Ct, this._resetConvergenceState(), this.rays = new T.LineSegments(
      this.rayBufferGeometry,
      new T.LineBasicMaterial({
        fog: !1,
        color: 2631977,
        transparent: !0,
        opacity: 0.2,
        premultipliedAlpha: !0,
        blending: T.NormalBlending,
        depthFunc: T.AlwaysDepth,
        name: "raytracer-rays-material"
        // depthTest: false
      })
    ), this.rays.renderOrder = -0.5, this.rays.frustumCulled = !1, O.scene.add(this.rays);
    var c = new T.ShaderMaterial({
      fog: !1,
      vertexShader: xe.vs,
      fragmentShader: xe.fs,
      transparent: !0,
      premultipliedAlpha: !0,
      uniforms: {
        drawStyle: { value: Ue.ENERGY },
        inverted: { value: 0 },
        pointScale: { value: this._pointSize }
      },
      blending: T.NormalBlending,
      name: "raytracer-points-material"
    });
    this.hits = new T.Points(this.rayBufferGeometry, c), this.hits.frustumCulled = !1, O.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
      value: !0,
      writable: !0
    }), this.intersections = [], this.findIDs(), this.intersectableObjects = [], this.paths = e.paths || M.paths, this.stats = {
      numRaysShot: {
        name: "# of rays shot",
        value: 0
      },
      numValidRayPaths: {
        name: "# of valid rays",
        value: 0
      }
    }, O.overlays.global.addCell("Valid Rays", this.validRayCount, {
      id: this.uuid + "-valid-ray-count",
      hidden: !0,
      formatter: (r) => String(r)
    }), this.messageHandlerIDs = [], $.postMessage("STATS_SETUP", this.stats), this.messageHandlerIDs.push(
      $.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (r, ...i) => {
        console.log(i && i[0] && i[0] instanceof Array && i[1] && i[1] === this.uuid), i && i[0] && i[0] instanceof Array && i[1] && i[1] === this.uuid && (this.sourceIDs = i[0].map((n) => n.id));
      })
    ), this.messageHandlerIDs.push(
      $.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (r, ...i) => {
        i && i[0] && i[0] instanceof Array && i[1] && i[1] === this.uuid && (this.receiverIDs = i[0].map((n) => n.id));
      })
    ), this.messageHandlerIDs.push(
      $.addMessageHandler("SHOULD_REMOVE_CONTAINER", (r, ...i) => {
        const n = i[0];
        n && (console.log(n), this.sourceIDs.includes(n) ? this.sourceIDs = this.sourceIDs.filter((o) => o != n) : this.receiverIDs.includes(n) && (this.receiverIDs = this.receiverIDs.filter((o) => o != n)));
      })
    ), this.step = this.step.bind(this), this.calculateImpulseResponse = this.calculateImpulseResponse.bind(this);
  }
  update = () => {
  };
  get temperature() {
    return this.room?.temperature ?? 20;
  }
  get c() {
    return Fe(this.temperature);
  }
  save() {
    const {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: a,
      roomID: c,
      sourceIDs: r,
      surfaceIDs: i,
      receiverIDs: n,
      updateInterval: o,
      passes: h,
      pointSize: m,
      reflectionOrder: f,
      runningWithoutReceivers: g,
      raysVisible: u,
      pointsVisible: d,
      invertedDrawStyle: I,
      plotStyle: p,
      paths: y,
      frequencies: S,
      convergenceThreshold: R,
      autoStop: b,
      rrThreshold: v,
      maxStoredPaths: A,
      edgeDiffractionEnabled: _,
      lateReverbTailEnabled: D,
      tailCrossfadeTime: x,
      tailCrossfadeDuration: P,
      gpuEnabled: w,
      gpuBatchSize: E,
      hrtfSubjectId: z,
      headYaw: F,
      headPitch: N,
      headRoll: C
    } = this;
    return {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: a,
      roomID: c,
      sourceIDs: r,
      surfaceIDs: i,
      receiverIDs: n,
      updateInterval: o,
      passes: h,
      pointSize: m,
      reflectionOrder: f,
      runningWithoutReceivers: g,
      raysVisible: u,
      pointsVisible: d,
      invertedDrawStyle: I,
      plotStyle: p,
      paths: y,
      frequencies: S,
      convergenceThreshold: R,
      autoStop: b,
      rrThreshold: v,
      maxStoredPaths: A,
      edgeDiffractionEnabled: _,
      lateReverbTailEnabled: D,
      tailCrossfadeTime: x,
      tailCrossfadeDuration: P,
      gpuEnabled: w,
      gpuBatchSize: E,
      hrtfSubjectId: z,
      headYaw: F,
      headPitch: N,
      headRoll: C
    };
  }
  removeMessageHandlers() {
    this.messageHandlerIDs.forEach((e) => {
      $.removeMessageHandler(e[0], e[1]);
    });
  }
  dispose() {
    this._isRunning && (this._isRunning = !1, this._gpuRunning = !1, cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => window.clearInterval(e)), this.intervals = []), this._disposeGpu(), this.removeMessageHandlers(), Object.keys(window.vars).forEach((e) => {
      window.vars[e].uuid === this.uuid && delete window.vars[e];
    }), O.scene.remove(this.rays), O.scene.remove(this.hits);
  }
  addSource(e) {
    B.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
  }
  addReceiver(e) {
    B.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
  }
  mapIntersectableObjects() {
    const e = [];
    this.room.surfaces.traverse((t) => {
      t.kind && t.kind === "surface" && e.push(t.mesh);
    }), this.runningWithoutReceivers ? this.intersectableObjects = e : this.intersectableObjects = e.concat(this.receivers);
  }
  findIDs() {
    this.sourceIDs = [], this.receiverIDs = [], this.surfaceIDs = [];
    for (const e in B.getState().containers)
      B.getState().containers[e].kind === "room" ? this.roomID = e : B.getState().containers[e].kind === "source" ? this.sourceIDs.push(e) : B.getState().containers[e].kind === "receiver" ? this.receiverIDs.push(e) : B.getState().containers[e].kind === "surface" && this.surfaceIDs.push(e);
    this.mapIntersectableObjects();
  }
  setDrawStyle(e) {
    this.hits.material.uniforms.drawStyle.value = e, this.hits.material.needsUpdate = !0, O.needsToRender = !0;
  }
  setPointScale(e) {
    this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0, O.needsToRender = !0;
  }
  incrementRayPositionIndex() {
    return this.rayPositionIndex < this.maxrays ? this.rayPositionIndex++ : (this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !0, this.rayPositionIndex);
  }
  rayPositionIndexDidOverflow = !1;
  appendRay(e, t, s = 1, a = 1) {
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, a), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, a), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex);
  }
  flushRayBuffer() {
    this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
  }
  inFrontOf(e, t) {
    return kt(e, t);
  }
  traceRay(e, t, s, a, c, r, i, n = 1, o = []) {
    return Le(
      this.raycaster,
      this.intersectableObjects,
      this.frequencies,
      this._cachedAirAtt,
      this.rrThreshold,
      e,
      t,
      s,
      a,
      c,
      r,
      i,
      n,
      o
    );
  }
  startQuickEstimate(e = this.frequencies, t = 1e3) {
    const s = this.runningWithoutReceivers;
    this.runningWithoutReceivers = !0;
    let a = 0;
    this.quickEstimateResults = {}, this.sourceIDs.forEach((c) => {
      this.quickEstimateResults[c] = [];
    }), this.intervals.push(
      window.setInterval(() => {
        for (let c = 0; c < this.passes; c++, a++)
          for (let r = 0; r < this.sourceIDs.length; r++) {
            const i = this.sourceIDs[r], n = B.getState().containers[i];
            this.quickEstimateResults[i].push(this.quickEstimateStep(n, e, t));
          }
        a >= t ? (this.intervals.forEach((c) => window.clearInterval(c)), this.runningWithoutReceivers = s, console.log(this.quickEstimateResults)) : console.log((a / t * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(e, t, s) {
    const a = ut(
      this.raycaster,
      this.intersectableObjects,
      e.position,
      e.initialIntensity,
      t,
      this.temperature
    );
    return this.stats.numRaysShot.value++, a;
  }
  startAllMonteCarlo() {
    this._lastConvergenceCheck = Date.now(), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = 0);
    const e = () => {
      if (!this._isRunning) return;
      const t = 12, s = performance.now();
      do
        this.stepStratified(this.passes);
      while (performance.now() - s < t);
      this.flushRayBuffer(), O.needsToRender = !0;
      const a = Date.now();
      if (this.autoStop && a - this._lastConvergenceCheck >= this._convergenceCheckInterval && (this._lastConvergenceCheck = a, this._updateConvergenceMetrics(), this.convergenceMetrics.convergenceRatio < this.convergenceThreshold && this.convergenceMetrics.t30Count >= 3)) {
        this.isRunning = !1;
        return;
      }
      this._rafId = requestAnimationFrame(e);
    };
    this._rafId = requestAnimationFrame(e);
  }
  stepStratified(e) {
    if (e <= 0) return;
    let t = Math.floor(Math.sqrt(e));
    for (; t > 1 && e % t !== 0; )
      t--;
    const s = e / t;
    for (let a = 0; a < this.sourceIDs.length; a++) {
      const c = B.getState().containers[this.sourceIDs[a]], r = c.phi, i = c.theta, n = c.position, o = c.rotation, h = c.directivityHandler;
      this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
      const m = this.sourceIDs[a];
      let f = this._directivityRefPressures.get(m);
      if (!f || f.length !== this.frequencies.length) {
        f = new Array(this.frequencies.length);
        for (let g = 0; g < this.frequencies.length; g++)
          f[g] = h.getPressureAtPosition(0, this.frequencies[g], 0, 0);
        this._directivityRefPressures.set(m, f);
      }
      for (let g = 0; g < t; g++)
        for (let u = 0; u < s; u++) {
          this.__num_checked_paths += 1;
          const d = (g + Math.random()) / t * r, I = (u + Math.random()) / s * i;
          let p = ue(d, I);
          const y = new T.Vector3().setFromSphericalCoords(1, p[0], p[1]);
          y.applyEuler(o);
          const S = new Array(this.frequencies.length);
          for (let b = 0; b < this.frequencies.length; b++) {
            let v = 1;
            try {
              const A = h.getPressureAtPosition(0, this.frequencies[b], d, I), _ = f[b];
              typeof A == "number" && typeof _ == "number" && _ > 0 && (v = (A / _) ** 2);
            } catch {
            }
            S[b] = v;
          }
          const R = this.traceRay(n, y, this.reflectionOrder, S, m, d, I);
          R && this._handleTracedPath(R, n, m), this.stats.numRaysShot.value++;
        }
    }
  }
  /** Common path handling for both step() and stepStratified() */
  _handleTracedPath(e, t, s) {
    if (this._runningWithoutReceivers) {
      this.appendRay(
        [t.x, t.y, t.z],
        e.chain[0].point,
        e.chain[0].energy || 1,
        e.chain[0].angle
      );
      for (let c = 1; c < e.chain.length; c++)
        this.appendRay(e.chain[c - 1].point, e.chain[c].point, e.chain[c].energy || 1, e.chain[c].angle);
      const a = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(a, e), B.getState().containers[s].numRays += 1;
    } else if (e.intersectedReceiver) {
      this.appendRay(
        [t.x, t.y, t.z],
        e.chain[0].point,
        e.chain[0].energy || 1,
        e.chain[0].angle
      );
      for (let c = 1; c < e.chain.length; c++)
        this.appendRay(e.chain[c - 1].point, e.chain[c].point, e.chain[c].energy || 1, e.chain[c].angle);
      this.stats.numValidRayPaths.value++, this.validRayCount += 1, O.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
      const a = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(a, e), B.getState().containers[s].numRays += 1, this._addToEnergyHistogram(a, e);
    }
  }
  /** Push a path onto the paths array, evicting oldest if over maxStoredPaths */
  _pushPathWithEviction(e, t) {
    const s = Math.max(1, this.maxStoredPaths | 0);
    if (!this.paths[e]) {
      this.paths[e] = [t];
      return;
    }
    const a = this.paths[e];
    if (a.length >= s) {
      const c = a.length - s + 1;
      c > 0 && a.splice(0, c);
    }
    a.push(t);
  }
  /** Add a ray path's energy to the convergence histogram */
  _addToEnergyHistogram(e, t) {
    ir(this._energyHistogram, e, t, this.frequencies, this.c, this._histogramBinWidth, this._histogramNumBins);
  }
  step() {
    for (let e = 0; e < this.sourceIDs.length; e++) {
      this.__num_checked_paths += 1;
      const t = Math.random() * B.getState().containers[this.sourceIDs[e]].theta, s = Math.random() * B.getState().containers[this.sourceIDs[e]].phi, a = B.getState().containers[this.sourceIDs[e]].position, c = B.getState().containers[this.sourceIDs[e]].rotation;
      let r = ue(s, t);
      const i = new T.Vector3().setFromSphericalCoords(1, r[0], r[1]);
      i.applyEuler(c);
      const n = B.getState().containers[this.sourceIDs[e]].directivityHandler;
      this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
      const o = this.sourceIDs[e];
      let h = this._directivityRefPressures.get(o);
      if (!h || h.length !== this.frequencies.length) {
        h = new Array(this.frequencies.length);
        for (let g = 0; g < this.frequencies.length; g++)
          h[g] = n.getPressureAtPosition(0, this.frequencies[g], 0, 0);
        this._directivityRefPressures.set(o, h);
      }
      const m = new Array(this.frequencies.length);
      for (let g = 0; g < this.frequencies.length; g++) {
        let u = 1;
        try {
          const d = n.getPressureAtPosition(0, this.frequencies[g], s, t), I = h[g];
          typeof d == "number" && typeof I == "number" && I > 0 && (u = (d / I) ** 2);
        } catch {
        }
        m[g] = u;
      }
      const f = this.traceRay(a, i, this.reflectionOrder, m, this.sourceIDs[e], s, t);
      if (f) {
        if (this._runningWithoutReceivers) {
          this.appendRay(
            [a.x, a.y, a.z],
            f.chain[0].point,
            f.chain[0].energy || 1,
            f.chain[0].angle
          );
          for (let u = 1; u < f.chain.length; u++)
            this.appendRay(
              // the previous point
              f.chain[u - 1].point,
              // the current point
              f.chain[u].point,
              // the energy content displayed as a color + alpha
              f.chain[u].energy || 1,
              f.chain[u].angle
            );
          const g = f.chain[f.chain.length - 1].object;
          this._pushPathWithEviction(g, f), B.getState().containers[this.sourceIDs[e]].numRays += 1;
        } else if (f.intersectedReceiver) {
          this.appendRay(
            [a.x, a.y, a.z],
            f.chain[0].point,
            f.chain[0].energy || 1,
            f.chain[0].angle
          );
          for (let u = 1; u < f.chain.length; u++)
            this.appendRay(
              // the previous point
              f.chain[u - 1].point,
              // the current point
              f.chain[u].point,
              // the energy content displayed as a color + alpha
              f.chain[u].energy || 1,
              f.chain[u].angle
            );
          this.stats.numValidRayPaths.value++, this.validRayCount += 1, O.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
          const g = f.chain[f.chain.length - 1].object;
          this._pushPathWithEviction(g, f), B.getState().containers[this.sourceIDs[e]].numRays += 1;
        }
      }
      this.stats.numRaysShot.value++;
    }
  }
  /** Reset convergence state for a new simulation run */
  _resetConvergenceState() {
    const e = nr(this.frequencies.length);
    this.convergenceMetrics = e.convergenceMetrics, this._energyHistogram = e.energyHistogram, this._lastConvergenceCheck = e.lastConvergenceCheck;
  }
  /** Compute T30 from Schroeder backward integration of the energy histogram */
  _updateConvergenceMetrics() {
    sr(
      this.convergenceMetrics,
      this._energyHistogram,
      this.frequencies,
      this.receiverIDs,
      this.__num_checked_paths,
      this.validRayCount,
      this._histogramBinWidth,
      this._histogramNumBins,
      this.uuid
    );
  }
  start() {
    this._isRunning = !0, this._cachedAirAtt = ae(this.frequencies, this.temperature), this.mapIntersectableObjects(), this.edgeDiffractionEnabled && this.room ? this._edgeGraph = ft(this.room.allSurfaces) : this._edgeGraph = null, this.__start_time = Date.now(), this.__num_checked_paths = 0, this._resetConvergenceState(), this.gpuEnabled ? this._startGpuMonteCarlo() : this.startAllMonteCarlo();
  }
  stop() {
    this._isRunning = !1, this.__calc_time = Date.now() - this.__start_time, this._gpuRunning = !1, this._gpuRayTracer && setTimeout(() => this._disposeGpu(), 0), cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => {
      window.clearInterval(e);
    }), this.intervals = [], Object.keys(this.paths).forEach((e) => {
      const t = this.__calc_time / 1e3, s = this.paths[e].length, a = s / t, c = this.__num_checked_paths, r = c / t;
      console.log({
        calc_time: t,
        num_valid_rays: s,
        valid_ray_rate: a,
        num_checks: c,
        check_rate: r
      }), this.paths[e].forEach((i) => {
        i.time = 0, i.totalLength = 0;
        for (let n = 0; n < i.chain.length; n++)
          i.totalLength += i.chain[n].distance, i.time += i.chain[n].distance / this.c;
      });
    }), this.edgeDiffractionEnabled && this._edgeGraph && this._edgeGraph.edges.length > 0 && this._computeDiffractionPaths(), this.mapIntersectableObjects(), this.reportImpulseResponse();
  }
  /** Compute deterministic diffraction paths and inject them into this.paths[] */
  _computeDiffractionPaths() {
    if (!this._edgeGraph) return;
    const e = B.getState().containers, t = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
    for (const i of this.sourceIDs) {
      const n = e[i];
      if (n) {
        t.set(i, [n.position.x, n.position.y, n.position.z]);
        const o = n.directivityHandler, h = new Array(this.frequencies.length);
        for (let m = 0; m < this.frequencies.length; m++)
          h[m] = o.getPressureAtPosition(0, this.frequencies[m], 0, 0);
        s.set(i, { handler: o, refPressures: h });
      }
    }
    const a = /* @__PURE__ */ new Map();
    for (const i of this.receiverIDs) {
      const n = e[i];
      n && a.set(i, [n.position.x, n.position.y, n.position.z]);
    }
    const c = [];
    this.room.surfaces.traverse((i) => {
      i.kind && i.kind === "surface" && c.push(i.mesh);
    });
    const r = dt(
      this._edgeGraph,
      t,
      a,
      this.frequencies,
      this.c,
      this.temperature,
      this.raycaster,
      c
    );
    for (const i of r) {
      const n = s.get(i.sourceId);
      if (n) {
        const R = t.get(i.sourceId), b = i.diffractionPoint[0] - R[0], v = i.diffractionPoint[1] - R[1], A = i.diffractionPoint[2] - R[2], _ = Math.sqrt(b * b + v * v + A * A);
        if (_ > 1e-10) {
          const D = Math.acos(Math.max(-1, Math.min(1, v / _))) * (180 / Math.PI), x = Math.atan2(A, b) * (180 / Math.PI);
          for (let P = 0; P < this.frequencies.length; P++)
            try {
              const w = n.handler.getPressureAtPosition(0, this.frequencies[P], Math.abs(x), D), E = n.refPressures[P];
              typeof w == "number" && typeof E == "number" && E > 0 && (i.bandEnergy[P] *= (w / E) ** 2);
            } catch {
            }
        }
      }
      const o = i.bandEnergy.reduce((R, b) => R + b, 0) / i.bandEnergy.length, h = a.get(i.receiverId), m = h[0] - i.diffractionPoint[0], f = h[1] - i.diffractionPoint[1], g = h[2] - i.diffractionPoint[2], u = Math.sqrt(m * m + f * f + g * g), d = u > 1e-10 ? [m / u, f / u, g / u] : [0, 0, 1], I = t.get(i.sourceId), p = Math.sqrt(
        (i.diffractionPoint[0] - I[0]) ** 2 + (i.diffractionPoint[1] - I[1]) ** 2 + (i.diffractionPoint[2] - I[2]) ** 2
      ), y = i.totalDistance - p, S = {
        intersectedReceiver: !0,
        chain: [
          {
            distance: p,
            point: i.diffractionPoint,
            object: i.edge.surface0Id,
            faceNormal: i.edge.normal0,
            faceIndex: -1,
            faceMaterialIndex: -1,
            angle: 0,
            energy: o,
            bandEnergy: i.bandEnergy
          },
          {
            distance: y,
            point: h,
            object: i.receiverId,
            faceNormal: [0, 0, 0],
            faceIndex: -1,
            faceMaterialIndex: -1,
            angle: 0,
            energy: o,
            bandEnergy: i.bandEnergy
          }
        ],
        chainLength: 2,
        energy: o,
        bandEnergy: i.bandEnergy,
        time: i.time,
        source: i.sourceId,
        initialPhi: 0,
        initialTheta: 0,
        totalLength: i.totalDistance,
        arrivalDirection: d
      };
      this._pushPathWithEviction(i.receiverId, S);
    }
  }
  async reportImpulseResponse() {
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = B.getState().containers, t = U.sampleRate, s = [];
    for (const a of this.sourceIDs)
      for (const c of this.receiverIDs) {
        if (!this.paths[c] || this.paths[c].length === 0) continue;
        const r = this.paths[c].filter((i) => i.source === a);
        r.length > 0 && s.push({ sourceId: a, receiverId: c, paths: r });
      }
    if (s.length !== 0) {
      q("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let a = 0; a < s.length; a++) {
        const { sourceId: c, receiverId: r, paths: i } = s[a], n = e[c]?.name || "Source", o = e[r]?.name || "Receiver", h = Math.round(a / s.length * 100);
        q("UPDATE_PROGRESS", {
          progress: h,
          message: `Calculating IR: ${n} → ${o}`
        });
        try {
          const { normalizedSignal: m } = await this.calculateImpulseResponseForPair(c, r, i);
          c === this.sourceIDs[0] && r === this.receiverIDs[0] && this.calculateImpulseResponse().then((y) => {
            this.impulseResponse = y;
          }).catch(console.error);
          const f = Tt, g = Math.max(1, Math.floor(m.length / f)), u = [];
          for (let y = 0; y < m.length; y += g)
            u.push({
              time: y / t,
              amplitude: m[y]
            });
          const d = `${this.uuid}-ir-${c}-${r}`, I = Re.getState().results[d], p = {
            kind: Se.ImpulseResponse,
            name: `IR: ${n} → ${o}`,
            uuid: d,
            from: this.uuid,
            info: {
              sampleRate: t,
              sourceName: n,
              receiverName: o,
              sourceId: c,
              receiverId: r
            },
            data: u
          };
          I ? q("UPDATE_RESULT", { uuid: d, result: p }) : q("ADD_RESULT", p);
        } catch (m) {
          console.error(`Failed to calculate impulse response for ${c} -> ${r}:`, m);
        }
      }
      q("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(e, t, s, a = V, c = this.frequencies, r = U.sampleRate) {
    let i;
    return this.lateReverbTailEnabled && this._energyHistogram[t] && (i = {
      energyHistogram: this._energyHistogram[t],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: c
    }), Lt(e, t, s, a, c, this.temperature, r, i);
  }
  async calculateImpulseResponseForDisplay(e = V, t = this.frequencies, s = U.sampleRate) {
    let a;
    return this.lateReverbTailEnabled && this.receiverIDs.length > 0 && this._energyHistogram[this.receiverIDs[0]] && (a = {
      energyHistogram: this._energyHistogram[this.receiverIDs[0]],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: t
    }), Gt(this.receiverIDs, this.sourceIDs, this.paths, e, t, this.temperature, s, a);
  }
  clearRays() {
    if (this.room)
      for (let e = 0; e < this.room.allSurfaces.length; e++)
        this.room.allSurfaces[e].resetHits();
    this.validRayCount = 0, O.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount), this.rayBufferGeometry.setDrawRange(0, 1), this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !1, this.stats.numRaysShot.value = 0, this.stats.numValidRayPaths.value = 0, $.postMessage("STATS_UPDATE", this.stats), this.sourceIDs.forEach((e) => {
      B.getState().containers[e].numRays = 0;
    }), this.paths = {}, this.mapIntersectableObjects(), O.needsToRender = !0, this.impulseResponse = void 0, this.clearImpulseResponseResults();
  }
  clearImpulseResponseResults() {
    const e = Re.getState().results;
    Object.keys(e).forEach((t) => {
      const s = e[t];
      s.from === this.uuid && s.kind === Se.ImpulseResponse && q("REMOVE_RESULT", t);
    });
  }
  reflectionLossFunction(e, t, s) {
    return ne(e, t, s);
  }
  calculateReflectionLoss(e = this.frequencies) {
    const [t, s] = Ht(this.paths, this.room, this.receiverIDs, e);
    return this.allReceiverData = t, this.chartdata = s, [this.allReceiverData, s];
  }
  getReceiverIntersectionPoints(e) {
    return this.paths && this.paths[e] && this.paths[e].length > 0 ? this.paths[e].map(
      (t) => new T.Vector3().fromArray(t.chain[t.chain.length - 1].point)
    ) : [];
  }
  calculateResponseByIntensity(e = this.frequencies, t = this.temperature) {
    const s = jt(this.indexedPaths, this.receiverIDs, this.sourceIDs, e, t, this.intensitySampleRate);
    return s && (this.responseByIntensity = s), this.responseByIntensity;
  }
  resampleResponseByIntensity(e = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      const t = ke(this.responseByIntensity, e);
      return t && (this.responseByIntensity = t), this.responseByIntensity;
    } else
      console.warn("no data yet");
  }
  calculateT30(e, t) {
    if (this.responseByIntensity) {
      const s = e ? [e] : this.receiverIDs, a = t ? [t] : this.sourceIDs;
      for (const c of s)
        for (const r of a)
          this.responseByIntensity[c]?.[r] && gt(this.responseByIntensity, c, r);
    }
    return this.responseByIntensity;
  }
  calculateT20(e, t) {
    if (this.responseByIntensity) {
      const s = e ? [e] : this.receiverIDs, a = t ? [t] : this.sourceIDs;
      for (const c of s)
        for (const r of a)
          this.responseByIntensity[c]?.[r] && pt(this.responseByIntensity, c, r);
    }
    return this.responseByIntensity;
  }
  calculateT60(e, t) {
    if (this.responseByIntensity) {
      const s = e ? [e] : this.receiverIDs, a = t ? [t] : this.sourceIDs;
      for (const c of s)
        for (const r of a)
          this.responseByIntensity[c]?.[r] && mt(this.responseByIntensity, c, r);
    }
    return this.responseByIntensity;
  }
  onParameterConfigFocus() {
    console.log("focus"), console.log(O.overlays.global.cells), O.overlays.global.showCell(this.uuid + "-valid-ray-count");
  }
  onParameterConfigBlur() {
    console.log("blur"), O.overlays.global.hideCell(this.uuid + "-valid-ray-count");
  }
  pathsToLinearBuffer() {
    return $t(this.paths);
  }
  linearBufferToPaths(e) {
    return Xt(e);
  }
  arrivalPressure(e, t, s, a = 1) {
    return Ie(e, t, s, a, this.temperature);
  }
  async calculateImpulseResponse(e = V, t = this.frequencies, s = U.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let a = this.paths[this.receiverIDs[0]].sort((m, f) => m.time - f.time);
    const c = a[a.length - 1].time + J, r = Array(t.length).fill(e), i = Y(s * c) * 2;
    let n = [];
    for (let m = 0; m < t.length; m++)
      n.push(new Float32Array(i));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let u = 0; u < a.length; u++)
        a[u].chainLength - 1 <= this.transitionOrder && a.splice(u, 1);
      let m = {
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
        frequencies: this.frequencies
      }, g = new It(m, !0).returnSortedPathsForHybrid(this.c, r, t);
      for (let u = 0; u < g.length; u++) {
        const d = ge() ? 1 : -1, I = g[u].time, p = Y(I * s);
        for (let y = 0; y < t.length; y++)
          n[y][p] += g[u].pressure[y] * d;
      }
    }
    const o = B.getState().containers[this.receiverIDs[0]];
    for (let m = 0; m < a.length; m++) {
      const f = ge() ? 1 : -1, g = a[m].time, u = a[m].arrivalDirection || [0, 0, 1], d = o.getGain(u), I = this.arrivalPressure(r, t, a[m], d).map((y) => y * f), p = Y(g * s);
      for (let y = 0; y < t.length; y++)
        n[y][p] += I[y];
    }
    if (this.lateReverbTailEnabled && this._energyHistogram[this.receiverIDs[0]]) {
      const m = oe(
        this._energyHistogram[this.receiverIDs[0]],
        t,
        this.tailCrossfadeTime,
        this._histogramBinWidth
      ), { tailSamples: f, tailStartSample: g } = ce(
        m,
        s
      ), u = Y(this.tailCrossfadeDuration * s);
      n = le(n, f, g, u);
      const I = n.reduce((p, y) => Math.max(p, y.length), 0) * 2;
      for (let p = 0; p < t.length; p++)
        if (n[p].length < I) {
          const y = new Float32Array(I);
          y.set(n[p]), n[p] = y;
        }
    }
    const h = de();
    return new Promise((m, f) => {
      h.postMessage({ samples: n }), h.onmessage = (g) => {
        const u = g.data.samples, d = new Float32Array(u[0].length >> 1);
        let I = 0;
        for (let R = 0; R < u.length; R++)
          for (let b = 0; b < d.length; b++)
            d[b] += u[R][b], te(d[b]) > I && (I = te(d[b]));
        const p = be(d), y = U.createOfflineContext(1, d.length, s), S = U.createBufferSource(p, y);
        S.connect(y.destination), S.start(), U.renderContextAsync(y).then((R) => m(R)).catch(f).finally(() => h.terminate());
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
  async calculateAmbisonicImpulseResponse(e = 1, t = V, s = this.frequencies, a = U.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");
    const c = this.paths[this.receiverIDs[0]].sort((g, u) => g.time - u.time);
    if (c.length === 0) throw Error("No valid ray paths found");
    const r = c[c.length - 1].time + J;
    if (r <= 0) throw Error("Invalid impulse response duration");
    const i = Array(s.length).fill(t), n = Y(a * r) * 2;
    if (n < 2) throw Error("Impulse response too short to process");
    const o = bt(e), h = [];
    for (let g = 0; g < s.length; g++) {
      h.push([]);
      for (let u = 0; u < o; u++)
        h[g].push(new Float32Array(n));
    }
    const m = B.getState().containers[this.receiverIDs[0]];
    for (let g = 0; g < c.length; g++) {
      const u = c[g], d = ge() ? 1 : -1, I = u.time, p = u.arrivalDirection || [0, 0, 1], y = m.getGain(p), S = this.arrivalPressure(i, s, u, y).map((v) => v * d), R = Y(I * a);
      if (R >= n) continue;
      const b = new Float32Array(1);
      for (let v = 0; v < s.length; v++) {
        b[0] = S[v];
        const A = yt(b, p[0], p[1], p[2], e, "threejs");
        for (let _ = 0; _ < o; _++)
          h[v][_][R] += A[_][0];
      }
    }
    if (this.lateReverbTailEnabled && this._energyHistogram[this.receiverIDs[0]]) {
      const g = oe(
        this._energyHistogram[this.receiverIDs[0]],
        s,
        this.tailCrossfadeTime,
        this._histogramBinWidth
      ), { tailSamples: u, tailStartSample: d } = ce(
        g,
        a
      ), I = Y(this.tailCrossfadeDuration * a);
      for (let S = 0; S < s.length; S++) {
        const R = [h[S][0]], b = [u[S]], v = le(R, b, d, I);
        h[S][0] = v[0];
      }
      let p = 0;
      for (let S = 0; S < s.length; S++)
        for (let R = 0; R < o; R++)
          h[S][R].length > p && (p = h[S][R].length);
      const y = p * 2;
      for (let S = 0; S < s.length; S++)
        for (let R = 0; R < o; R++)
          if (h[S][R].length < y) {
            const b = new Float32Array(y);
            b.set(h[S][R]), h[S][R] = b;
          }
    }
    const f = de();
    return new Promise((g, u) => {
      const d = async (I) => new Promise((p) => {
        const y = [];
        for (let R = 0; R < s.length; R++)
          y.push(h[R][I]);
        const S = de();
        S.postMessage({ samples: y }), S.onmessage = (R) => {
          const b = R.data.samples, v = new Float32Array(b[0].length >> 1);
          for (let A = 0; A < b.length; A++)
            for (let _ = 0; _ < v.length; _++)
              v[_] += b[A][_];
          S.terminate(), p(v);
        };
      });
      Promise.all(
        Array.from({ length: o }, (I, p) => d(p))
      ).then((I) => {
        let p = 0;
        for (const b of I)
          for (let v = 0; v < b.length; v++)
            te(b[v]) > p && (p = te(b[v]));
        if (p > 0)
          for (const b of I)
            for (let v = 0; v < b.length; v++)
              b[v] /= p;
        const y = I[0].length;
        if (y === 0) {
          f.terminate(), u(new Error("Filtered signal has zero length"));
          return;
        }
        const R = U.createOfflineContext(o, y, a).createBuffer(o, y, a);
        for (let b = 0; b < o; b++)
          R.copyToChannel(new Float32Array(I[b]), b);
        f.terminate(), g(R);
      }).catch(u);
    });
  }
  ambisonicImpulseResponse;
  ambisonicOrder = 1;
  impulseResponse;
  impulseResponsePlaying = !1;
  async playImpulseResponse() {
    const e = await Jt(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      this.uuid
    );
    this.impulseResponse = e.impulseResponse;
  }
  downloadImpulses(e, t = V, s = Ne(125, 8e3), a = 44100) {
    Kt(
      this.paths,
      this.receiverIDs,
      this.sourceIDs,
      (c, r, i, n) => this.arrivalPressure(c, r, i, n),
      e,
      t,
      s,
      a
    );
  }
  async downloadImpulseResponse(e, t = U.sampleRate) {
    const s = await Qt(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      e,
      t
    );
    this.impulseResponse = s.impulseResponse;
  }
  async downloadAmbisonicImpulseResponse(e, t = 1) {
    const s = await er(
      this.ambisonicImpulseResponse,
      (a) => this.calculateAmbisonicImpulseResponse(a),
      this.ambisonicOrder,
      t,
      e
    );
    this.ambisonicImpulseResponse = s.ambisonicImpulseResponse, this.ambisonicOrder = s.ambisonicOrder;
  }
  /**
   * Calculate binaural impulse response from the ambisonic IR using HRTF decoder filters.
   * The ambisonic IR is computed (or cached) first, then optionally rotated by head orientation,
   * and finally decoded to stereo via HRTF convolution.
   */
  async calculateBinauralImpulseResponse(e = 1) {
    return (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder = e), this.binauralImpulseResponse = await vt({
      ambisonicImpulseResponse: this.ambisonicImpulseResponse,
      order: e,
      hrtfSubjectId: this.hrtfSubjectId,
      headYaw: this.headYaw,
      headPitch: this.headPitch,
      headRoll: this.headRoll
    }), this.binauralImpulseResponse;
  }
  async playBinauralImpulseResponse(e = 1) {
    const t = await tr(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(e),
      this.uuid
    );
    this.binauralImpulseResponse = t.binauralImpulseResponse;
  }
  async downloadBinauralImpulseResponse(e, t = 1) {
    const s = await rr(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(t),
      e
    );
    this.binauralImpulseResponse = s.binauralImpulseResponse;
  }
  /** Initialize GPU ray tracer. Returns true on success. */
  async _initGpu() {
    if (!et())
      return console.warn("[GPU RT] WebGPU not available in this browser"), !1;
    let e = null;
    try {
      return e = new dr(), !await e.initialize(
        this.room,
        this.receiverIDs,
        {
          reflectionOrder: this.reflectionOrder,
          frequencies: this.frequencies,
          cachedAirAtt: this._cachedAirAtt,
          rrThreshold: this.rrThreshold
        },
        this.gpuBatchSize
      ) || !this._gpuRunning ? (e.dispose(), !1) : (this._gpuRayTracer = e, !0);
    } catch (t) {
      return console.error("[GPU RT] Initialization failed:", t), e && e.dispose(), !1;
    }
  }
  /** Start the GPU-accelerated Monte Carlo loop. Falls back to CPU on failure. */
  _startGpuMonteCarlo() {
    cancelAnimationFrame(this._rafId), this._rafId = 0, this._gpuRunning = !0, this._lastConvergenceCheck = Date.now();
    const e = 16, t = Math.min(this.frequencies.length, 7);
    if (this.frequencies.length > 7) {
      console.warn(`[GPU RT] ${this.frequencies.length} frequency bands exceeds GPU limit of 7; falling back to CPU`), this._gpuRunning = !1, this.startAllMonteCarlo();
      return;
    }
    this._initGpu().then((s) => {
      if (!s || !this._gpuRunning) {
        this._gpuRunning && (console.warn("[GPU RT] Falling back to CPU ray tracing"), this._gpuRunning = !1, this.startAllMonteCarlo());
        return;
      }
      const a = this._gpuRayTracer.effectiveBatchSize, c = new Float32Array(a * e), r = async () => {
        if (!(!this._gpuRunning || !this._isRunning || !this._gpuRayTracer))
          try {
            if (!Number.isFinite(this.gpuBatchSize) || this.gpuBatchSize <= 0) {
              console.warn("[GPU RT] Invalid gpuBatchSize, falling back to CPU"), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
              return;
            }
            const i = Math.min(Math.floor(this.gpuBatchSize), a);
            let n = 0;
            for (let u = 0; u < this.sourceIDs.length && n < i; u++) {
              const d = B.getState().containers[this.sourceIDs[u]], I = d.position, p = d.rotation, y = d.phi, S = d.theta, R = d.directivityHandler, b = this.sourceIDs[u];
              this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
              let v = this._directivityRefPressures.get(b);
              if (!v || v.length !== this.frequencies.length) {
                v = new Array(this.frequencies.length);
                for (let D = 0; D < this.frequencies.length; D++)
                  v[D] = R.getPressureAtPosition(0, this.frequencies[D], 0, 0);
                this._directivityRefPressures.set(b, v);
              }
              const A = Math.max(1, Math.floor(i / this.sourceIDs.length)), _ = new T.Vector3();
              for (let D = 0; D < A && n < i; D++) {
                const x = Math.random() * y, P = Math.random() * S, w = ue(x, P);
                _.setFromSphericalCoords(1, w[0], w[1]), _.applyEuler(p);
                const E = n * e;
                c[E] = I.x, c[E + 1] = I.y, c[E + 2] = I.z, c[E + 3] = _.x, c[E + 4] = _.y, c[E + 5] = _.z, c[E + 6] = x, c[E + 7] = P;
                for (let z = 0; z < t; z++) {
                  let F = 1;
                  try {
                    const N = R.getPressureAtPosition(0, this.frequencies[z], x, P), C = v[z];
                    typeof N == "number" && typeof C == "number" && C > 0 && (F = (N / C) ** 2);
                  } catch {
                  }
                  c[E + 8 + z] = F;
                }
                n++;
              }
            }
            const o = n, h = Math.floor(Math.random() * 4294967295), m = await this._gpuRayTracer.traceBatch(c, o, h);
            this.__num_checked_paths += o, this.stats.numRaysShot.value += o;
            const f = Math.max(1, Math.floor(o / Math.max(1, this.sourceIDs.length)));
            for (let u = 0; u < m.length; u++) {
              const d = m[u];
              if (!d) continue;
              const I = Math.min(
                Math.floor(u / Math.max(1, f)),
                this.sourceIDs.length - 1
              ), p = this.sourceIDs[I], y = B.getState().containers[p].position;
              d.source = p, this._handleTracedPath(d, y, p);
            }
            this.flushRayBuffer(), O.needsToRender = !0;
            const g = Date.now();
            if (this.autoStop && g - this._lastConvergenceCheck >= this._convergenceCheckInterval && (this._lastConvergenceCheck = g, this._updateConvergenceMetrics(), this.convergenceMetrics.convergenceRatio < this.convergenceThreshold && this.convergenceMetrics.t30Count >= 3)) {
              this.isRunning = !1;
              return;
            }
            this._gpuRunning && this._isRunning && (this._rafId = requestAnimationFrame(() => {
              r();
            }));
          } catch (i) {
            console.error("[GPU RT] Batch error, falling back to CPU:", i), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
          }
      };
      this._rafId = requestAnimationFrame(() => {
        r();
      });
    });
  }
  /** Destroy GPU ray tracer if initialized. */
  _disposeGpu() {
    this._gpuRayTracer && (this._gpuRayTracer.dispose(), this._gpuRayTracer = null);
  }
  get sources() {
    return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => B.getState().containers[e]) : [];
  }
  get receivers() {
    return this.receiverIDs.length > 0 && Object.keys(B.getState().containers).length > 0 ? this.receiverIDs.map((e) => B.getState().containers[e].mesh) : [];
  }
  get room() {
    return B.getState().containers[this.roomID];
  }
  get precheck() {
    return this.sourceIDs.length > 0 && typeof this.room < "u";
  }
  get indexedPaths() {
    const e = {};
    for (const t in this.paths) {
      e[t] = {};
      for (let s = 0; s < this.paths[t].length; s++) {
        const a = this.paths[t][s].source;
        e[t][a] ? e[t][a].push(this.paths[t][s]) : e[t][a] = [this.paths[t][s]];
      }
    }
    return e;
  }
  get isRunning() {
    return this.running;
  }
  set isRunning(e) {
    e && this.findIDs(), this.running = this.precheck && e, this.running ? this.start() : this.stop();
  }
  get raysVisible() {
    return this._raysVisible;
  }
  set raysVisible(e) {
    e != this._raysVisible && (this._raysVisible = e, this.rays.visible = e), O.needsToRender = !0;
  }
  get pointsVisible() {
    return this._pointsVisible;
  }
  set pointsVisible(e) {
    e != this._pointsVisible && (this._pointsVisible = e, this.hits.visible = e), O.needsToRender = !0;
  }
  get invertedDrawStyle() {
    return this._invertedDrawStyle;
  }
  set invertedDrawStyle(e) {
    this._invertedDrawStyle != e && (this._invertedDrawStyle = e, this.hits.material.uniforms.inverted.value = Number(e), this.hits.material.needsUpdate = !0), O.needsToRender = !0;
  }
  get pointSize() {
    return this._pointSize;
  }
  set pointSize(e) {
    Number.isFinite(e) && e > 0 && (this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0), O.needsToRender = !0;
  }
  get runningWithoutReceivers() {
    return this._runningWithoutReceivers;
  }
  set runningWithoutReceivers(e) {
    this.mapIntersectableObjects(), this._runningWithoutReceivers = e;
  }
}
L("RAYTRACER_CALL_METHOD", tt);
L("RAYTRACER_SET_PROPERTY", rt);
L("REMOVE_RAYTRACER", nt);
L("ADD_RAYTRACER", st(pr));
L("RAYTRACER_CLEAR_RAYS", (l) => void W.getState().solvers[l].clearRays());
L("RAYTRACER_PLAY_IR", (l) => {
  W.getState().solvers[l].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
L("RAYTRACER_DOWNLOAD_IR", (l) => {
  const e = W.getState().solvers[l], t = B.getState().containers, s = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", a = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", c = `ir-${s}-${a}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(c).catch((r) => {
    window.alert(r.message || "Failed to download impulse response");
  });
});
L("RAYTRACER_DOWNLOAD_IR_OCTAVE", (l) => void W.getState().solvers[l].downloadImpulses(l));
L("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: l, order: e }) => {
  const t = W.getState().solvers[l], s = B.getState().containers, a = t.sourceIDs.length > 0 && s[t.sourceIDs[0]]?.name || "source", c = t.receiverIDs.length > 0 && s[t.receiverIDs[0]]?.name || "receiver", r = `ir-${a}-${c}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(r, e).catch((i) => {
    window.alert(i.message || "Failed to download ambisonic impulse response");
  });
});
L("RAYTRACER_PLAY_BINAURAL_IR", ({ uuid: l, order: e }) => {
  W.getState().solvers[l].playBinauralImpulseResponse(e).catch((s) => {
    window.alert(s.message || "Failed to play binaural impulse response");
  });
});
L("RAYTRACER_DOWNLOAD_BINAURAL_IR", ({ uuid: l, order: e }) => {
  const t = W.getState().solvers[l], s = B.getState().containers, a = t.sourceIDs.length > 0 && s[t.sourceIDs[0]]?.name || "source", c = t.receiverIDs.length > 0 && s[t.receiverIDs[0]]?.name || "receiver", r = `ir-${a}-${c}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadBinauralImpulseResponse(r, e).catch((i) => {
    window.alert(i.message || "Failed to download binaural impulse response");
  });
});
export {
  Ct as CONVERGENCE_CHECK_INTERVAL_MS,
  V as DEFAULT_INITIAL_SPL,
  ct as DEFAULT_INTENSITY_SAMPLE_RATE,
  Ue as DRAWSTYLE,
  lt as HISTOGRAM_BIN_WIDTH,
  ht as HISTOGRAM_NUM_BINS,
  Tt as MAX_DISPLAY_POINTS,
  Er as MAX_TAIL_END_TIME,
  Pr as MIN_TAIL_DECAY_RATE,
  wr as QUICK_ESTIMATE_MAX_ORDER,
  J as RESPONSE_TIME_PADDING,
  Br as RT60_DECAY_RATIO,
  Bt as SELF_INTERSECTION_OFFSET,
  pr as default,
  M as defaults,
  be as normalize
};
//# sourceMappingURL=index-BRvUvRRt.mjs.map
