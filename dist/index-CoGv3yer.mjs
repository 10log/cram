import { S as mt } from "./solver-BnRpsXb-.mjs";
import * as B from "three";
import { computeBoundsTree as yt, disposeBoundsTree as vt, acceleratedRaycast as bt } from "three-mesh-bvh";
import { S as et, u as P, b as xe, L as oe, P as le, I as he, z as Rt, F as It, e as $, A as xt, B as St, r as N, m as X, a as Ce, R as ze, C as _t, o as V, D as At, s as Dt, c as wt, d as Et, f as W } from "./index-BW01orYZ.mjs";
import { a as U, w as Tt, n as Pt, O as tt } from "./audio-engine-DTb1Qexp.mjs";
import { a as Z } from "./air-attenuation-CBIk1QMo.mjs";
import { s as nt } from "./sound-speed-Biev-mJ1.mjs";
import { e as Bt, c as Mt, g as Ct } from "./calculate-binaural-z75egsJs.mjs";
import { ImageSourceSolver as zt } from "./index-Cl2kCZDI.mjs";
import { p as Ot, d as Nt, a as Ft, b as Lt, c as kt } from "./export-playback-GRqBZlbu.mjs";
function Ut(c) {
  return c.reduce((e, t) => e + t);
}
function Gt(c) {
  let e = Ut(c.map((t) => 10 ** (t / 10)));
  return 10 * Math.log10(e);
}
const Vt = `attribute vec2 color;
varying vec2 vColor;
uniform float pointScale;
void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = pointScale*(color.x/4.0+0.5);
  gl_Position = projectionMatrix * mvPosition;
  
}`, Ht = `varying vec2 vColor;
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
  
}`, Oe = {
  vs: Vt,
  fs: Ht
};
function ye(c, e) {
  let t = (360 - c) * (Math.PI / 180);
  return [e * (Math.PI / 180), t];
}
class jt {
  constructor(e) {
    this.v = e;
  }
  watchers = /* @__PURE__ */ new Set();
  get value() {
    return this.v;
  }
  set value(e) {
    const t = this.v;
    this.v = e, this.watchers.forEach((r) => r(this.v, t));
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
function qt(c, e) {
  return new jt(c);
}
const Yt = 0.01, st = 256, j = 100, ee = 0.05, $t = 1e3, Wt = 2e3, Xt = 1e6, Zt = 1e-3, Kt = 1e4, Jt = 500, ve = 1, Qt = 10, C = {
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
var rt = /* @__PURE__ */ ((c) => (c[c.ENERGY = 0] = "ENERGY", c[c.ANGLE = 1] = "ANGLE", c[c.ANGLE_ENERGY = 2] = "ANGLE_ENERGY", c))(rt || {});
function Pe(c) {
  let e = Math.abs(c[0]);
  for (let t = 1; t < c.length; t++)
    Math.abs(c[t]) > e && (e = Math.abs(c[t]));
  if (e !== 0)
    for (let t = 0; t < c.length; t++)
      c[t] /= e;
  return c;
}
function en(c) {
  return Math.random() < c;
}
const { abs: tn } = Math, Ne = new B.Vector3(), nn = new B.Vector3(), sn = new B.Vector3(), Fe = new B.Vector3(), J = new B.Vector3(), rn = new B.Vector3(), ne = new B.Vector3(), Q = new B.Plane(), se = new B.Vector4(), Le = new B.Vector4(), ke = new B.Vector4(), Ue = new B.Vector4();
function an(c, e) {
  return c.getPlane(Q), se.set(Q.normal.x, Q.normal.y, Q.normal.z, Q.constant), Le.set(e.a.x, e.a.y, e.a.z, 1), ke.set(e.b.x, e.b.y, e.b.z, 1), Ue.set(e.c.x, e.c.y, e.c.z, 1), se.dot(Le) > 0 || se.dot(ke) > 0 || se.dot(Ue) > 0;
}
function it(c, e, t, r, o, a, i, s, n, l, h, m, d = 1, f = []) {
  i = i.normalize(), c.ray.origin = a, c.ray.direction = i;
  const u = c.intersectObjects(e, !0);
  if (u.length > 0) {
    const p = n.reduce((g, b) => g + b, 0), y = n.length > 0 ? p / n.length : 0;
    if (u[0].object.userData?.kind === "receiver") {
      const g = u[0].face && Ne.copy(i).multiplyScalar(-1).angleTo(u[0].face.normal), b = u[0].distance, x = n.map(
        (_, S) => _ * Math.pow(10, -r[S] * b / 10)
      ), I = x.reduce((_, S) => _ + S, 0), v = x.length > 0 ? I / x.length : 0;
      f.push({
        object: u[0].object.parent.uuid,
        angle: g,
        distance: u[0].distance,
        faceNormal: [
          u[0].face.normal.x,
          u[0].face.normal.y,
          u[0].face.normal.z
        ],
        faceMaterialIndex: u[0].face.materialIndex,
        faceIndex: u[0].faceIndex,
        point: [u[0].point.x, u[0].point.y, u[0].point.z],
        energy: v,
        bandEnergy: [...x]
      }), ne.copy(i).normalize().negate();
      const R = [ne.x, ne.y, ne.z];
      return {
        chain: f,
        chainLength: f.length,
        intersectedReceiver: !0,
        energy: v,
        bandEnergy: [...x],
        source: l,
        initialPhi: h,
        initialTheta: m,
        arrivalDirection: R
      };
    } else {
      const g = u[0].face && Ne.copy(i).multiplyScalar(-1).angleTo(u[0].face.normal);
      f.push({
        object: u[0].object.parent.uuid,
        angle: g,
        distance: u[0].distance,
        faceNormal: [
          u[0].face.normal.x,
          u[0].face.normal.y,
          u[0].face.normal.z
        ],
        faceMaterialIndex: u[0].face.materialIndex,
        faceIndex: u[0].faceIndex,
        point: [u[0].point.x, u[0].point.y, u[0].point.z],
        energy: y
      }), u[0].object.parent instanceof et && (u[0].object.parent.numHits += 1);
      const b = u[0].face && nn.copy(u[0].face.normal).normalize();
      let x = b && u[0].face && Fe.copy(i).sub(sn.copy(b).multiplyScalar(i.dot(b)).multiplyScalar(2));
      const I = u[0].object.parent, v = t.map((E) => I.scatteringFunction(E)), R = n.reduce((E, T) => E + T, 0) || 1;
      let _ = 0;
      for (let E = 0; E < t.length; E++)
        _ += v[E] * (n[E] || 0);
      if (_ /= R, en(_)) {
        do
          J.set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
          );
        while (J.lengthSq() > 1 || J.lengthSq() < 1e-6);
        J.normalize(), x = Fe.copy(J).add(b).normalize();
      }
      const S = u[0].distance, A = t.map((E, T) => {
        const w = n[T];
        if (w == null) return 0;
        let O = w * tn(I.reflectionFunction(E, g));
        return O *= Math.pow(10, -r[T] * S / 10), O;
      }), D = Math.max(...A);
      if (x && b && d < s + 1) {
        if (D < o && D > 0) {
          const E = D / o;
          if (Math.random() > E) {
            const T = A.reduce((O, F) => O + F, 0), w = A.length > 0 ? T / A.length : 0;
            return { chain: f, chainLength: f.length, source: l, intersectedReceiver: !1, energy: w, bandEnergy: [...A] };
          }
          for (let T = 0; T < A.length; T++)
            A[T] /= E;
        }
        if (D > 0)
          return it(
            c,
            e,
            t,
            r,
            o,
            rn.copy(u[0].point).addScaledVector(b, Yt),
            x,
            s,
            A,
            l,
            h,
            m,
            d + 1,
            f
          );
      }
    }
    return { chain: f, chainLength: f.length, source: l, intersectedReceiver: !1 };
  }
}
function on(c) {
  var e, t, r = c.length;
  if (r === 1)
    e = 0, t = c[0][1];
  else {
    for (var o = 0, a = 0, i = 0, s = 0, n, l, h, m = 0; m < r; m++)
      n = c[m], l = n[0], h = n[1], o += l, a += h, i += l * l, s += l * h;
    e = (r * s - o * a) / (r * i - o * o), t = a / r - e * o / r;
  }
  return {
    m: e,
    b: t
  };
}
function te(c, e) {
  const t = c.length, r = [];
  for (let n = 0; n < t; n++)
    r.push([c[n], e[n]]);
  const { m: o, b: a } = on(r);
  return { m: o, b: a, fx: (n) => o * n + a, fy: (n) => (n - a) / o };
}
const { log10: cn, pow: Se, floor: ue, max: _e, min: Ae, sqrt: Ge, cos: Ve, PI: He, random: ln } = Math;
function fe(c, e, t, r) {
  const o = e.length, a = [];
  for (let i = 0; i < o; i++) {
    const s = c[i];
    let n = 0;
    for (let v = s.length - 1; v >= 0; v--)
      if (s[v] > 0) {
        n = v;
        break;
      }
    if (n < 2) {
      a.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const l = new Float32Array(n + 1);
    l[n] = s[n];
    for (let v = n - 1; v >= 0; v--)
      l[v] = l[v + 1] + s[v];
    const h = l[0];
    if (h <= 0) {
      a.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const m = h * Se(10, -5 / 10), d = h * Se(10, -35 / 10);
    let f = -1, u = -1;
    for (let v = 0; v <= n; v++)
      f < 0 && l[v] <= m && (f = v), u < 0 && l[v] <= d && (u = v);
    let p = 0, y = 0;
    if (f >= 0 && u > f) {
      const v = [], R = [];
      for (let _ = f; _ <= u; _++) {
        const S = l[_];
        S > 0 && (v.push(_ * r), R.push(10 * cn(S / h)));
      }
      if (v.length >= 2) {
        const S = te(v, R).m;
        S < 0 && (p = S, y = -60 / S);
      }
    }
    p < 0 && p > -ve && (p = -ve, y = 60 / ve);
    let g = t;
    if (g <= 0) {
      const v = _e(1, ue(0.05 / r));
      g = _e(0, n - v) * r;
    }
    const b = Ae(ue(g / r), n), x = b <= n && b >= 0 ? l[b] / h : 0, I = y > 0 ? Ae(g + y, Qt) : g;
    a.push({ t60: y, decayRate: p, crossfadeLevel: x, crossfadeTime: g, endTime: I });
  }
  return a;
}
function de(c, e) {
  let t = 0, r = 1 / 0;
  for (const n of c)
    n.endTime > t && (t = n.endTime), n.crossfadeTime > 0 && n.crossfadeTime < r && (r = n.crossfadeTime);
  if (t <= 0 || !isFinite(r))
    return { tailSamples: c.map(() => new Float32Array(0)), tailStartSample: 0, totalSamples: 0 };
  const o = ue(r * e), a = ue(t * e), i = a - o;
  if (i <= 0)
    return { tailSamples: c.map(() => new Float32Array(0)), tailStartSample: o, totalSamples: a };
  const s = [];
  for (const n of c) {
    const l = new Float32Array(i);
    if (n.decayRate >= 0 || n.crossfadeLevel <= 0) {
      s.push(l);
      continue;
    }
    const h = Ge(n.crossfadeLevel), m = 1 / Ge(3), d = h / m;
    for (let f = 0; f < i; f++) {
      const u = f / e, p = Se(10, n.decayRate * u / 20), y = ln() * 2 - 1;
      l[f] = y * p * d;
    }
    s.push(l);
  }
  return { tailSamples: s, tailStartSample: o, totalSamples: a };
}
function ge(c, e, t, r) {
  const o = c.length, a = [];
  for (let i = 0; i < o; i++) {
    const s = c[i], n = e[i];
    if (!n || n.length === 0) {
      a.push(s);
      continue;
    }
    const l = _e(s.length, t + n.length), h = new Float32Array(l);
    for (let f = 0; f < Ae(t, s.length); f++)
      h[f] = s[f];
    const m = r, d = m > 1 ? m - 1 : 1;
    for (let f = 0; f < m; f++) {
      const u = t + f;
      if (u >= l) break;
      const p = 0.5 * (1 + Ve(He * f / d)), y = 0.5 * (1 - Ve(He * f / d)), g = u < s.length ? s[u] : 0, b = f < n.length ? n[f] : 0;
      h[u] = g * p + b * y;
    }
    for (let f = m; f < n.length; f++) {
      const u = t + f;
      if (u >= l) break;
      h[u] = n[f];
    }
    a.push(h);
  }
  return a;
}
const { floor: K, abs: hn, max: at } = Math, ot = () => Math.random() > 0.5, ct = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
));
function Be(c, e, t, r = 1, o = 20) {
  const a = xe(oe(c));
  if (t.bandEnergy && t.bandEnergy.length === e.length) {
    for (let h = 0; h < e.length; h++)
      a[h] *= t.bandEnergy[h];
    const l = oe(le(he(a)));
    if (r !== 1)
      for (let h = 0; h < l.length; h++) l[h] *= r;
    return l;
  }
  t.chain.slice(0, -1).forEach((l) => {
    const h = P.getState().containers[l.object];
    a.forEach((m, d) => {
      const f = hn(h.reflectionFunction(e[d], l.angle));
      a[d] = m * f;
    });
  });
  const i = le(he(a)), s = Z(e, o);
  e.forEach((l, h) => i[h] -= s[h] * t.totalLength);
  const n = oe(i);
  if (r !== 1)
    for (let l = 0; l < n.length; l++) n[l] *= r;
  return n;
}
async function un(c, e, t, r = j, o, a, i = U.sampleRate, s) {
  if (t.length === 0) throw Error("No rays have been traced for this pair");
  let n = t.sort((p, y) => p.time - y.time);
  const l = n[n.length - 1].time + ee, h = Array(o.length).fill(r), m = K(i * l) * 2;
  let d = [];
  for (let p = 0; p < o.length; p++)
    d.push(new Float32Array(m));
  const f = P.getState().containers[e];
  for (let p = 0; p < n.length; p++) {
    const y = ot() ? 1 : -1, g = n[p].time, b = n[p].arrivalDirection || [0, 0, 1], x = f.getGain(b), I = Be(h, o, n[p], x, a).map((R) => R * y), v = K(g * i);
    for (let R = 0; R < o.length; R++)
      d[R][v] += I[R];
  }
  if (s && s.energyHistogram && s.energyHistogram.length > 0) {
    const p = fe(
      s.energyHistogram,
      s.frequencies,
      s.crossfadeTime,
      s.histogramBinWidth
    ), { tailSamples: y, tailStartSample: g } = de(
      p,
      i
    ), b = K(s.crossfadeDuration * i);
    d = ge(d, y, g, b);
    const I = d.reduce((v, R) => at(v, R.length), 0) * 2;
    for (let v = 0; v < o.length; v++)
      if (d[v].length < I) {
        const R = new Float32Array(I);
        R.set(d[v]), d[v] = R;
      }
  }
  const u = ct();
  return new Promise((p, y) => {
    u.postMessage({ samples: d }), u.onmessage = (g) => {
      const b = g.data.samples, x = new Float32Array(b[0].length >> 1);
      for (let v = 0; v < b.length; v++)
        for (let R = 0; R < x.length; R++)
          x[R] += b[v][R];
      const I = Pe(x.slice());
      u.terminate(), p({ signal: x, normalizedSignal: I });
    }, u.onerror = (g) => {
      u.terminate(), y(g);
    };
  });
}
async function fn(c, e, t, r = j, o, a, i = U.sampleRate, s) {
  if (c.length == 0) throw Error("No receivers have been assigned to the raytracer");
  if (e.length == 0) throw Error("No sources have been assigned to the raytracer");
  if (t[c[0]].length == 0) throw Error("No rays have been traced yet");
  let n = t[c[0]].sort((p, y) => p.time - y.time);
  const l = n[n.length - 1].time + ee, h = Array(o.length).fill(r), m = K(i * l) * 2;
  let d = [];
  for (let p = 0; p < o.length; p++)
    d.push(new Float32Array(m));
  const f = P.getState().containers[c[0]];
  for (let p = 0; p < n.length; p++) {
    const y = ot() ? 1 : -1, g = n[p].time, b = n[p].arrivalDirection || [0, 0, 1], x = f.getGain(b), I = Be(h, o, n[p], x, a).map((R) => R * y), v = K(g * i);
    for (let R = 0; R < o.length; R++)
      d[R][v] += I[R];
  }
  if (s && s.energyHistogram && s.energyHistogram.length > 0) {
    const p = fe(
      s.energyHistogram,
      s.frequencies,
      s.crossfadeTime,
      s.histogramBinWidth
    ), { tailSamples: y, tailStartSample: g } = de(
      p,
      i
    ), b = K(s.crossfadeDuration * i);
    d = ge(d, y, g, b);
    const I = d.reduce((v, R) => at(v, R.length), 0) * 2;
    for (let v = 0; v < o.length; v++)
      if (d[v].length < I) {
        const R = new Float32Array(I);
        R.set(d[v]), d[v] = R;
      }
  }
  const u = ct();
  return new Promise((p, y) => {
    u.postMessage({ samples: d }), u.onmessage = (g) => {
      const b = g.data.samples, x = new Float32Array(b[0].length >> 1);
      for (let v = 0; v < b.length; v++)
        for (let R = 0; R < x.length; R++)
          x[R] += b[v][R];
      const I = Pe(x.slice());
      u.terminate(), p({ signal: x, normalizedSignal: I });
    }, u.onerror = (g) => {
      u.terminate(), y(g);
    };
  });
}
function Me(c, e = 1) {
  let t = c.slice();
  for (let r = 0; r < c.length; r++)
    if (r >= e && r < c.length - e) {
      const o = r - e, a = r + e;
      let i = 0;
      for (let s = o; s < a; s++)
        i += c[s];
      t[r] = i / (2 * e);
    }
  return t;
}
const { floor: dn, abs: gn } = Math;
function ce(c, e, t) {
  const r = e.chain.slice(0, -1);
  if (r && r.length > 0) {
    let o = 1;
    for (let a = 0; a < r.length; a++) {
      const i = r[a], s = c.surfaceMap[i.object], n = i.angle || 0;
      o = o * gn(s.reflectionFunction(t, n));
    }
    return o;
  }
  return 1;
}
function pn(c, e, t, r) {
  const o = [], a = (n, l) => ({ label: n, data: l }), i = [];
  if (r)
    for (let n = 0; n < r.length; n++)
      i.push(a(r[n].toString(), []));
  const s = Object.keys(c);
  for (let n = 0; n < s.length; n++) {
    o.push({
      id: s[n],
      data: []
    });
    for (let l = 0; l < c[s[n]].length; l++) {
      const h = c[s[n]][l];
      let m;
      r ? (m = r.map((d) => ({
        frequency: d,
        value: ce(e, h, d)
      })), r.forEach((d, f) => {
        i[f].data.push([h.time, ce(e, h, d)]);
      })) : m = (d) => ce(e, h, d), o[o.length - 1].data.push({
        time: h.time,
        energy: m
      });
    }
    o[o.length - 1].data = o[o.length - 1].data.sort((l, h) => l.time - h.time);
  }
  for (let n = 0; n < i.length; n++)
    i[n].data = i[n].data.sort((l, h) => l[0] - h[0]), i[n].x = i[n].data.map((l) => l[0]), i[n].y = i[n].data.map((l) => l[1]);
  return [o, i];
}
function mn(c, e, t, r, o, a) {
  const i = c, s = nt(o), n = Z(r, o), l = {};
  for (const h in i) {
    l[h] = {};
    const m = P.getState().containers[h];
    for (const d in i[h]) {
      l[h][d] = {
        freqs: r,
        response: []
      };
      for (let f = 0; f < i[h][d].length; f++) {
        let u = 0, p = [], y = i[h][d][f].initialPhi, g = i[h][d][f].initialTheta, b = P.getState().containers[d].directivityHandler;
        for (let S = 0; S < r.length; S++)
          p[S] = xe(b.getPressureAtPosition(0, r[S], y, g));
        const I = i[h][d][f].arrivalDirection || [0, 0, 1], v = m.getGain(I), R = v * v;
        if (R !== 1)
          for (let S = 0; S < r.length; S++)
            p[S] *= R;
        for (let S = 0; S < i[h][d][f].chain.length; S++) {
          const { angle: A, distance: D } = i[h][d][f].chain[S];
          u += D / s;
          const E = i[h][d][f].chain[S].object, T = P.getState().containers[E] || null;
          for (let w = 0; w < r.length; w++) {
            const O = r[w];
            let F = 1;
            T && T.kind === "surface" && (F = T.reflectionFunction(O, A)), p[w] = xe(
              oe(le(he(p[w] * F)) - n[w] * D)
            );
          }
        }
        const _ = le(he(p));
        l[h][d].response.push({
          time: u,
          level: _,
          bounces: i[h][d][f].chain.length
        });
      }
      l[h][d].response.sort((f, u) => f.time - u.time);
    }
  }
  return lt(l, a);
}
function lt(c, e = st) {
  if (c) {
    for (const t in c)
      for (const r in c[t]) {
        const { response: o, freqs: a } = c[t][r], i = o[o.length - 1].time, s = dn(e * i);
        c[t][r].resampledResponse = Array(a.length).fill(0).map((d) => new Float32Array(s)), c[t][r].sampleRate = e;
        let n = 0, l = [], h = a.map((d) => 0), m = !1;
        for (let d = 0, f = 0; d < s; d++) {
          let u = d / s * i;
          if (o[f] && o[f].time) {
            let p = o[f].time;
            if (p > u) {
              for (let y = 0; y < a.length; y++)
                c[t][r].resampledResponse[y][n] = 0;
              m && l.push(n), n++;
              continue;
            }
            if (p <= u) {
              let y = o[f].level.map((g) => 0);
              for (; p <= u; ) {
                p = o[f].time;
                for (let g = 0; g < a.length; g++)
                  y[g] = Gt([y[g], o[f].level[g]]);
                f++;
              }
              for (let g = 0; g < a.length; g++) {
                if (c[t][r].resampledResponse[g][n] = y[g], l.length > 0) {
                  const b = h[g], x = y[g];
                  for (let I = 0; I < l.length; I++) {
                    const v = Rt(b, x, (I + 1) / (l.length + 1));
                    c[t][r].resampledResponse[g][l[I]] = v;
                  }
                }
                h[g] = y[g];
              }
              l.length > 0 && (l = []), m = !0, n++;
              continue;
            }
          }
        }
        ut(c, t, r), ht(c, t, r), ft(c, t, r);
      }
    return c;
  } else
    console.warn("no data yet");
}
function ht(c, e, t) {
  const r = e, o = t, a = c[r][o].resampledResponse, i = c[r][o].sampleRate;
  if (a && i) {
    const s = new Float32Array(a[0].length);
    for (let n = 0; n < a[0].length; n++)
      s[n] = n / i;
    c[r][o].t30 = a.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const m = h - 30, f = Me(n, 2).filter((u) => u >= m).length;
      return te(s.slice(0, f), n.slice(0, f));
    });
  }
}
function ut(c, e, t) {
  const r = e, o = t, a = c[r][o].resampledResponse, i = c[r][o].sampleRate;
  if (a && i) {
    const s = new Float32Array(a[0].length);
    for (let n = 0; n < a[0].length; n++)
      s[n] = n / i;
    c[r][o].t20 = a.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const m = h - 20, f = Me(n, 2).filter((u) => u >= m).length;
      return te(s.slice(0, f), n.slice(0, f));
    });
  }
}
function ft(c, e, t) {
  const r = e, o = t, a = c[r][o].resampledResponse, i = c[r][o].sampleRate;
  if (a && i) {
    const s = new Float32Array(a[0].length);
    for (let n = 0; n < a[0].length; n++)
      s[n] = n / i;
    c[r][o].t60 = a.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const m = h - 60, f = Me(n, 2).filter((u) => u >= m).length;
      return te(s.slice(0, f), n.slice(0, f));
    });
  }
}
const dt = -2;
function yn(c) {
  const r = (n) => String.fromCharCode(...n), o = (n) => {
    let l = 0;
    const h = r(n.slice(l, l += 36)), m = n[l++], d = n[l++], f = n[l++], u = n[l++], p = n[l++], y = [n[l++], n[l++], n[l++]], g = [n[l++], n[l++], n[l++]];
    return {
      object: h,
      angle: m,
      distance: d,
      energy: f,
      faceIndex: u,
      faceMaterialIndex: p,
      faceNormal: y,
      point: g
    };
  }, a = (n) => {
    const l = [];
    let h = 0;
    for (; h < n.length; ) {
      const m = r(n.slice(h, h += 36)), d = n[h++], f = n[h++], u = !!n[h++], p = n[h++], y = [];
      for (let g = 0; g < d; g++)
        y.push(o(n.slice(h, h += 47)));
      l.push({
        source: m,
        chainLength: d,
        time: f,
        intersectedReceiver: u,
        energy: p,
        chain: y
      });
    }
    return l;
  };
  let i = 0;
  const s = {};
  for (; i < c.length; ) {
    const n = r(c.slice(i, i += 36)), l = c[i++], h = a(c.slice(i, i += l));
    s[n] = h;
  }
  return s;
}
function vn(c) {
  const e = /* @__PURE__ */ new Set();
  for (const n of Object.keys(c)) {
    e.add(n);
    for (const l of c[n]) {
      e.add(l.source);
      for (const h of l.chain)
        e.add(h.object);
    }
  }
  const t = Array.from(e), r = /* @__PURE__ */ new Map();
  for (let n = 0; n < t.length; n++)
    r.set(t[n], n);
  const o = 2 + t.length * 36;
  let a = 0;
  for (const n of Object.keys(c)) {
    a += 2;
    for (const l of c[n])
      a += 5, a += l.chain.length * 12;
  }
  const i = new Float32Array(o + a);
  let s = 0;
  i[s++] = dt, i[s++] = t.length;
  for (const n of t)
    for (let l = 0; l < 36; l++)
      i[s++] = n.charCodeAt(l);
  for (const n of Object.keys(c)) {
    i[s++] = r.get(n);
    let l = 0;
    for (const h of c[n])
      l += 5 + h.chain.length * 12;
    i[s++] = l;
    for (const h of c[n]) {
      i[s++] = r.get(h.source), i[s++] = h.chain.length, i[s++] = h.time, i[s++] = Number(h.intersectedReceiver), i[s++] = h.energy;
      for (const m of h.chain)
        i[s++] = r.get(m.object), i[s++] = m.angle, i[s++] = m.distance, i[s++] = m.energy, i[s++] = m.faceIndex, i[s++] = m.faceMaterialIndex, i[s++] = m.faceNormal[0], i[s++] = m.faceNormal[1], i[s++] = m.faceNormal[2], i[s++] = m.point[0], i[s++] = m.point[1], i[s++] = m.point[2];
    }
  }
  return i;
}
function bn(c) {
  let e = 0;
  e++;
  const t = c[e++];
  if (!Number.isFinite(t) || t < 0 || t !== (t | 0))
    throw new Error("Invalid V2 buffer: bad numUUIDs");
  if (e + t * 36 > c.length)
    throw new Error("Invalid V2 buffer: UUID table exceeds buffer length");
  const r = [];
  for (let a = 0; a < t; a++) {
    const i = [];
    for (let s = 0; s < 36; s++)
      i.push(c[e++]);
    r.push(String.fromCharCode(...i));
  }
  const o = {};
  for (; e < c.length; ) {
    const a = c[e++];
    if (a < 0 || a >= r.length)
      throw new Error("Invalid V2 buffer: receiver index out of range");
    const i = r[a], s = c[e++];
    if (!Number.isFinite(s) || s < 0)
      throw new Error("Invalid V2 buffer: bad pathBufLen");
    const n = Math.min(e + s, c.length), l = [];
    for (; e < n; ) {
      const h = r[c[e++]], m = c[e++], d = c[e++], f = !!c[e++], u = c[e++], p = [];
      for (let y = 0; y < m; y++) {
        const g = r[c[e++]], b = c[e++], x = c[e++], I = c[e++], v = c[e++], R = c[e++], _ = [c[e++], c[e++], c[e++]], S = [c[e++], c[e++], c[e++]];
        p.push({
          object: g,
          angle: b,
          distance: x,
          energy: I,
          faceIndex: v,
          faceMaterialIndex: R,
          faceNormal: _,
          point: S
        });
      }
      l.push({
        source: h,
        chainLength: m,
        time: d,
        intersectedReceiver: f,
        energy: u,
        chain: p
      });
    }
    o[i] = l;
  }
  return o;
}
function Rn(c) {
  return vn(c);
}
function In(c) {
  return c.length === 0 ? {} : c[0] === dt ? bn(c) : yn(c);
}
const { floor: je, abs: qe } = Math, xn = () => Math.random() > 0.5, gt = "RAYTRACER_SET_PROPERTY";
function Sn(c, e, t, r, o, a = j, i = tt(125, 8e3), s = 44100) {
  if (e.length === 0) throw Error("No receivers have been assigned to the raytracer");
  if (t.length === 0) throw Error("No sources have been assigned to the raytracer");
  if (c[e[0]].length === 0) throw Error("No rays have been traced yet");
  const n = c[e[0]].sort((p, y) => p.time - y.time), l = n[n.length - 1].time + ee, h = Array(i.length).fill(a), m = je(s * l), d = [];
  for (let p = 0; p < i.length; p++)
    d.push(new Float32Array(m));
  let f = 0;
  const u = P.getState().containers[e[0]];
  for (let p = 0; p < n.length; p++) {
    const y = xn() ? 1 : -1, g = n[p].time, b = n[p].arrivalDirection || [0, 0, 1], x = u.getGain(b), I = r(h, i, n[p], x).map((R) => R * y), v = je(g * s);
    for (let R = 0; R < i.length; R++)
      d[R][v] += I[R], qe(d[R][v]) > f && (f = qe(d[R][v]));
  }
  for (let p = 0; p < i.length; p++) {
    const y = Tt([Pt(d[p])], { sampleRate: s, bitDepth: 32 });
    It.saveAs(y, `${i[p]}_${o}.wav`);
  }
}
async function _n(c, e, t) {
  return Ot(c, e, t, gt);
}
async function An(c, e, t, r) {
  return Nt(c, e, t, r);
}
async function Dn(c, e, t, r = 1, o) {
  return Ft(c, e, t, r, o);
}
async function wn(c, e, t) {
  return Lt(c, e, t, gt);
}
async function En(c, e, t) {
  return kt(c, e, t);
}
function Tn(c) {
  const e = {
    totalRays: 0,
    validRays: 0,
    estimatedT30: new Array(c).fill(0),
    t30Mean: new Array(c).fill(0),
    t30M2: new Array(c).fill(0),
    t30Count: 0,
    convergenceRatio: 1 / 0
  }, t = {}, r = Date.now();
  return { convergenceMetrics: e, energyHistogram: t, lastConvergenceCheck: r };
}
function Pn(c, e, t, r, o, a, i, s, n) {
  c.totalRays = o, c.validRays = a;
  const l = Object.keys(e);
  if (l.length === 0) return;
  let h;
  if (r.length > 0)
    for (const g of r) {
      const b = e[g];
      if (b && b.length > 0) {
        h = g;
        break;
      }
    }
  if (!h) {
    const g = l.slice().sort();
    for (const b of g) {
      const x = e[b];
      if (x && x.length > 0) {
        h = b;
        break;
      }
    }
  }
  if (!h) return;
  const m = e[h];
  if (!m || m.length === 0) return;
  const d = t.length, f = new Array(d).fill(0);
  for (let g = 0; g < d; g++) {
    const b = m[g];
    let x = 0;
    for (let D = s - 1; D >= 0; D--)
      if (b[D] > 0) {
        x = D;
        break;
      }
    if (x < 2) {
      f[g] = 0;
      continue;
    }
    const I = new Float32Array(x + 1);
    I[x] = b[x];
    for (let D = x - 1; D >= 0; D--)
      I[D] = I[D + 1] + b[D];
    const v = I[0];
    if (v <= 0) {
      f[g] = 0;
      continue;
    }
    const R = v * Math.pow(10, -5 / 10), _ = v * Math.pow(10, -35 / 10);
    let S = -1, A = -1;
    for (let D = 0; D <= x; D++)
      S < 0 && I[D] <= R && (S = D), A < 0 && I[D] <= _ && (A = D);
    if (S >= 0 && A > S) {
      const D = [], E = [];
      for (let T = S; T <= A; T++) {
        const w = I[T];
        w > 0 && (D.push(T * i), E.push(10 * Math.log10(w / v)));
      }
      if (D.length >= 2) {
        const w = te(D, E).m;
        f[g] = w < 0 ? 60 / -w : 0;
      }
    }
  }
  c.estimatedT30 = f, c.t30Count += 1;
  const u = c.t30Count;
  let p = 0, y = 0;
  for (let g = 0; g < d; g++) {
    const b = f[g], x = c.t30Mean[g], I = x + (b - x) / u, R = c.t30M2[g] + (b - x) * (b - I);
    if (c.t30Mean[g] = I, c.t30M2[g] = R, u >= 2 && I > 0) {
      const _ = R / (u - 1), S = Math.sqrt(_) / I;
      S > p && (p = S), y++;
    }
  }
  c.convergenceRatio = y > 0 ? p : 1 / 0, $("RAYTRACER_SET_PROPERTY", {
    uuid: n,
    property: "convergenceMetrics",
    value: { ...c }
  });
}
function Bn(c, e, t, r, o, a, i) {
  if (!c[e]) {
    c[e] = [];
    for (let l = 0; l < r.length; l++)
      c[e].push(new Float32Array(i));
  }
  let s = 0;
  for (let l = 0; l < t.chain.length; l++)
    s += t.chain[l].distance;
  s /= o;
  const n = Math.floor(s / a);
  if (n >= 0 && n < i && t.bandEnergy)
    for (let l = 0; l < r.length; l++)
      c[e][l][n] += t.bandEnergy[l] || 0;
}
function Ye(c, e, t, r) {
  const o = c / r, a = e / r, i = t / r, s = Math.floor(o), n = Math.floor(a), l = Math.floor(i), h = [`${s},${n},${l}`], m = [0, -1, 1];
  for (const d of m)
    for (const f of m)
      for (const u of m) {
        if (d === 0 && f === 0 && u === 0) continue;
        const p = s + d, y = n + f, g = l + u;
        Math.abs(o - (p + 0.5)) < 1 && Math.abs(a - (y + 0.5)) < 1 && Math.abs(i - (g + 0.5)) < 1 && h.push(`${p},${y},${g}`);
      }
  return h;
}
function Mn(c, e) {
  return c < e ? `${c}|${e}` : `${e}|${c}`;
}
function Cn(c, e = 1e-4) {
  const t = xt(e), r = e * 10, o = /* @__PURE__ */ new Map();
  for (const i of c) {
    const s = i.edgeLoop;
    if (!s || s.length < 3) continue;
    const n = [i.normal.x, i.normal.y, i.normal.z];
    for (let l = 0; l < s.length; l++) {
      const h = s[l], m = s[(l + 1) % s.length], d = [h.x, h.y, h.z], f = [m.x, m.y, m.z], u = { start: d, end: f, surfaceId: i.uuid, normal: n }, p = Ye(h.x, h.y, h.z, r), y = Ye(m.x, m.y, m.z, r), g = /* @__PURE__ */ new Set();
      for (const b of p)
        for (const x of y) {
          const I = Mn(b, x);
          g.has(I) || (g.add(I), o.has(I) ? o.get(I).push(u) : o.set(I, [u]));
        }
    }
  }
  const a = [];
  for (const [, i] of o) {
    if (i.length !== 2 || i[0].surfaceId === i[1].surfaceId) continue;
    const s = i[0], n = i[1];
    if (!(t(s.start[0], n.start[0]) && t(s.start[1], n.start[1]) && t(s.start[2], n.start[2]) && t(s.end[0], n.end[0]) && t(s.end[1], n.end[1]) && t(s.end[2], n.end[2]) || t(s.start[0], n.end[0]) && t(s.start[1], n.end[1]) && t(s.start[2], n.end[2]) && t(s.end[0], n.start[0]) && t(s.end[1], n.start[1]) && t(s.end[2], n.start[2]))) continue;
    const h = s.end[0] - s.start[0], m = s.end[1] - s.start[1], d = s.end[2] - s.start[2], f = Math.sqrt(h * h + m * m + d * d);
    if (f < e) continue;
    const u = [h / f, m / f, d / f], p = s.normal, y = n.normal, g = p[0] * y[0] + p[1] * y[1] + p[2] * y[2], b = Math.acos(Math.max(-1, Math.min(1, g)));
    if (b < 0.01) continue;
    const I = 2 * Math.PI - b, v = I / Math.PI;
    v <= 1 || a.push({
      start: s.start,
      end: s.end,
      direction: u,
      length: f,
      normal0: p,
      normal1: y,
      surface0Id: s.surfaceId,
      surface1Id: n.surfaceId,
      wedgeAngle: I,
      n: v
    });
  }
  return { edges: a };
}
const { PI: k, sqrt: pe, abs: zn, cos: De, sin: On, atan2: $e } = Math;
function re(c) {
  return c < 0 && (c = 0), 1 - Math.exp(-pe(k * c));
}
function Nn(c, e, t, r, o) {
  const a = c, i = [
    r[0] - t[0],
    r[1] - t[1],
    r[2] - t[2]
  ], s = i[0] * a[0] + i[1] * a[1] + i[2] * a[2], n = [i[0] - s * a[0], i[1] - s * a[1], i[2] - s * a[2]], l = pe(n[0] ** 2 + n[1] ** 2 + n[2] ** 2), h = [
    o[0] - t[0],
    o[1] - t[1],
    o[2] - t[2]
  ], m = h[0] * a[0] + h[1] * a[1] + h[2] * a[2], d = [h[0] - m * a[0], h[1] - m * a[1], h[2] - m * a[2]], f = pe(d[0] ** 2 + d[1] ** 2 + d[2] ** 2);
  if (l < 1e-10 || f < 1e-10)
    return { phiSource: k, phiReceiver: k };
  const u = [n[0] / l, n[1] / l, n[2] / l], p = [d[0] / f, d[1] / f, d[2] / f], y = [-e[0], -e[1], -e[2]], g = [
    a[1] * y[2] - a[2] * y[1],
    a[2] * y[0] - a[0] * y[2],
    a[0] * y[1] - a[1] * y[0]
  ], b = $e(
    u[0] * g[0] + u[1] * g[1] + u[2] * g[2],
    u[0] * y[0] + u[1] * y[1] + u[2] * y[2]
  ), x = $e(
    p[0] * g[0] + p[1] * g[1] + p[2] * g[2],
    p[0] * y[0] + p[1] * y[1] + p[2] * y[2]
  ), I = (v) => {
    let R = v;
    for (; R < 0; ) R += 2 * k;
    return R;
  };
  return {
    phiSource: I(b),
    phiReceiver: I(x)
  };
}
function ie(c, e, t, r, o) {
  const a = t + r * o, i = (k + e * a) / (2 * c), s = On(i);
  return zn(s) < 1e-12 ? 0 : De(i) / s;
}
function Fn(c, e, t, r, o, a, i) {
  if (t < 1e-10 || r < 1e-10) return 0;
  const s = 2 * k * c / i;
  if (s < 1e-10) return 0;
  const n = t * r / (t + r), l = (E, T, w, O) => {
    const z = T + w * O, M = Math.round((z + k) / (2 * k * e)), L = Math.round((z - k) / (2 * k * e)), G = 2 * De((2 * k * e * M - z) / 2) ** 2, H = 2 * De((2 * k * e * L - z) / 2) ** 2;
    return E > 0 ? G : H;
  };
  let h = 0;
  const m = l(1, a, -1, o), d = ie(e, 1, a, -1, o), f = re(s * n * m), u = l(-1, a, -1, o), p = ie(e, -1, a, -1, o), y = re(s * n * u), g = l(1, a, 1, o), b = ie(e, 1, a, 1, o), x = re(s * n * g), I = l(-1, a, 1, o), v = ie(e, -1, a, 1, o), R = re(s * n * I), _ = 1 / (2 * e * pe(2 * k * s)), S = d * f + p * y + b * x + v * R;
  h = _ * _ * S * S;
  const A = t, D = A / (r * (r + A));
  return h * D;
}
function Ln(c, e, t, r) {
  const o = e[0] - c[0], a = e[1] - c[1], i = e[2] - c[2], s = o * o + a * a + i * i;
  if (s < 1e-20)
    return [...c];
  const n = Math.sqrt(s), l = [o / n, a / n, i / n], h = (y) => {
    const g = c[0] + y * o, b = c[1] + y * a, x = c[2] + y * i, I = Math.sqrt(
      (g - t[0]) ** 2 + (b - t[1]) ** 2 + (x - t[2]) ** 2
    ), v = Math.sqrt(
      (g - r[0]) ** 2 + (b - r[1]) ** 2 + (x - r[2]) ** 2
    );
    if (I < 1e-10 || v < 1e-10) return 0;
    const R = ((g - t[0]) * l[0] + (b - t[1]) * l[1] + (x - t[2]) * l[2]) / I, _ = ((g - r[0]) * l[0] + (b - r[1]) * l[1] + (x - r[2]) * l[2]) / v;
    return R + _;
  };
  let m = 0, d = 1;
  const f = h(m), u = h(d);
  if (f * u > 0) {
    const y = (b) => {
      const x = c[0] + b * o, I = c[1] + b * a, v = c[2] + b * i, R = Math.sqrt(
        (x - t[0]) ** 2 + (I - t[1]) ** 2 + (v - t[2]) ** 2
      ), _ = Math.sqrt(
        (x - r[0]) ** 2 + (I - r[1]) ** 2 + (v - r[2]) ** 2
      );
      return R + _;
    }, g = y(0) < y(1) ? 0 : 1;
    return [
      c[0] + g * o,
      c[1] + g * a,
      c[2] + g * i
    ];
  }
  for (let y = 0; y < 50; y++) {
    const g = (m + d) / 2, b = h(g);
    if (Math.abs(b) < 1e-12) break;
    f * b < 0 ? d = g : m = g;
  }
  const p = (m + d) / 2;
  return [
    c[0] + p * o,
    c[1] + p * a,
    c[2] + p * i
  ];
}
function We(c, e, t, r, o = 0.01) {
  const a = e[0] - c[0], i = e[1] - c[1], s = e[2] - c[2], n = Math.sqrt(a * a + i * i + s * s);
  if (n < o) return !0;
  const l = new B.Vector3(a / n, i / n, s / n), h = new B.Vector3(
    c[0] + l.x * o,
    c[1] + l.y * o,
    c[2] + l.z * o
  );
  t.ray.set(h, l), t.far = n - 2 * o, t.near = 0;
  const m = t.intersectObjects(r, !0);
  return t.far = 1 / 0, m.length === 0;
}
function kn(c, e, t, r, o, a, i, s) {
  const n = [], l = Z(r, a);
  for (const h of c.edges)
    for (const [m, d] of e)
      for (const [f, u] of t) {
        const p = Ln(h.start, h.end, d, u), y = Math.sqrt(
          (p[0] - d[0]) ** 2 + (p[1] - d[1]) ** 2 + (p[2] - d[2]) ** 2
        ), g = Math.sqrt(
          (p[0] - u[0]) ** 2 + (p[1] - u[1]) ** 2 + (p[2] - u[2]) ** 2
        );
        if (y < 1e-6 || g < 1e-6 || !We(d, p, i, s) || !We(p, u, i, s)) continue;
        const { phiSource: b, phiReceiver: x } = Nn(
          h.direction,
          h.normal0,
          p,
          d,
          u
        ), I = y + g, v = I / o, R = new Array(r.length);
        for (let _ = 0; _ < r.length; _++) {
          let S = Fn(
            r[_],
            h.n,
            y,
            g,
            b,
            x,
            o
          );
          const A = l[_] * I;
          S *= Math.pow(10, -A / 10), R[_] = S;
        }
        n.push({
          edge: h,
          diffractionPoint: p,
          totalDistance: I,
          time: v,
          bandEnergy: R,
          sourceId: m,
          receiverId: f
        });
      }
  return n;
}
function Un(c, e, t) {
  const r = c.allSurfaces, o = P.getState().containers, a = [], i = [], s = [], n = [];
  for (let A = 0; A < r.length; A++) {
    const D = r[A];
    a.push(D.uuid);
    const E = D.mesh, T = E.geometry, w = T.getAttribute("position"), O = T.getIndex();
    E.updateMatrixWorld(!0);
    const F = E.matrixWorld;
    if (O)
      for (let z = 0; z < O.count; z += 3) {
        for (let G = 0; G < 3; G++) {
          const H = O.getX(z + G), me = new B.Vector3(
            w.getX(H),
            w.getY(H),
            w.getZ(H)
          ).applyMatrix4(F);
          i.push(me.x, me.y, me.z);
        }
        const M = i.length - 9, L = Xe(
          i[M],
          i[M + 1],
          i[M + 2],
          i[M + 3],
          i[M + 4],
          i[M + 5],
          i[M + 6],
          i[M + 7],
          i[M + 8]
        );
        s.push(L[0], L[1], L[2]), n.push(A);
      }
    else
      for (let z = 0; z < w.count; z += 3) {
        for (let G = 0; G < 3; G++) {
          const H = new B.Vector3(
            w.getX(z + G),
            w.getY(z + G),
            w.getZ(z + G)
          ).applyMatrix4(F);
          i.push(H.x, H.y, H.z);
        }
        const M = i.length - 9, L = Xe(
          i[M],
          i[M + 1],
          i[M + 2],
          i[M + 3],
          i[M + 4],
          i[M + 5],
          i[M + 6],
          i[M + 7],
          i[M + 8]
        );
        s.push(L[0], L[1], L[2]), n.push(A);
      }
  }
  const l = n.length, h = new Float32Array(i), m = new Float32Array(s), d = new Uint32Array(n), f = new Float32Array(l * 3);
  for (let A = 0; A < l; A++) {
    const D = A * 9;
    f[A * 3] = (h[D] + h[D + 3] + h[D + 6]) / 3, f[A * 3 + 1] = (h[D + 1] + h[D + 4] + h[D + 7]) / 3, f[A * 3 + 2] = (h[D + 2] + h[D + 5] + h[D + 8]) / 3;
  }
  const u = new Uint32Array(l);
  for (let A = 0; A < l; A++) u[A] = A;
  const p = we(h, f, u, 0, l, 0), y = new Float32Array(l * 9), g = new Float32Array(l * 3), b = new Uint32Array(l);
  for (let A = 0; A < l; A++) {
    const D = u[A];
    y.set(h.subarray(D * 9, D * 9 + 9), A * 9), g.set(m.subarray(D * 3, D * 3 + 3), A * 3), b[A] = d[D];
  }
  const { nodeArray: x, nodeCount: I } = Hn(p), v = t.length, R = new Float32Array(r.length * v * 2);
  for (let A = 0; A < r.length; A++) {
    const D = r[A];
    for (let E = 0; E < v; E++) {
      const T = (A * v + E) * 2;
      R[T] = D.absorptionFunction(t[E]), R[T + 1] = D.scatteringFunction(t[E]);
    }
  }
  const _ = [], S = [];
  for (const A of e) {
    const D = o[A];
    if (D) {
      _.push(A);
      const E = 0.1, T = D.scale, w = Math.max(Math.abs(T.x), Math.abs(T.y), Math.abs(T.z));
      S.push(D.position.x, D.position.y, D.position.z, E * w);
    }
  }
  return {
    bvhNodes: x,
    triangleVertices: y,
    triangleSurfaceIndex: b,
    triangleNormals: g,
    surfaceAcousticData: R,
    receiverSpheres: new Float32Array(S),
    triangleCount: l,
    nodeCount: I,
    surfaceCount: r.length,
    receiverCount: _.length,
    surfaceUuidMap: a,
    receiverUuidMap: _
  };
}
const Gn = 8, Vn = 64;
function we(c, e, t, r, o, a) {
  let i = 1 / 0, s = 1 / 0, n = 1 / 0, l = -1 / 0, h = -1 / 0, m = -1 / 0;
  for (let _ = r; _ < o; _++) {
    const S = t[_];
    for (let A = 0; A < 3; A++) {
      const D = S * 9 + A * 3, E = c[D], T = c[D + 1], w = c[D + 2];
      E < i && (i = E), E > l && (l = E), T < s && (s = T), T > h && (h = T), w < n && (n = w), w > m && (m = w);
    }
  }
  const d = o - r;
  if (d <= Gn || a >= Vn)
    return { boundsMin: [i, s, n], boundsMax: [l, h, m], left: null, right: null, triStart: r, triCount: d };
  const f = l - i, u = h - s, p = m - n, y = f >= u && f >= p ? 0 : u >= p ? 1 : 2;
  let g = 1 / 0, b = -1 / 0;
  for (let _ = r; _ < o; _++) {
    const S = e[t[_] * 3 + y];
    S < g && (g = S), S > b && (b = S);
  }
  const x = (g + b) * 0.5;
  let I = r;
  for (let _ = r; _ < o; _++)
    if (e[t[_] * 3 + y] < x) {
      const S = t[I];
      t[I] = t[_], t[_] = S, I++;
    }
  (I === r || I === o) && (I = r + o >> 1);
  const v = we(c, e, t, r, I, a + 1), R = we(c, e, t, I, o, a + 1);
  return { boundsMin: [i, s, n], boundsMax: [l, h, m], left: v, right: R, triStart: -1, triCount: -1 };
}
function Hn(c) {
  let e = 0;
  const t = [c];
  for (; t.length > 0; ) {
    const i = t.pop();
    e++, i.left && t.push(i.left), i.right && t.push(i.right);
  }
  const r = new Float32Array(e * 8);
  let o = 0;
  function a(i) {
    const s = o++, n = s * 8;
    r[n] = i.boundsMin[0], r[n + 1] = i.boundsMin[1], r[n + 2] = i.boundsMin[2], r[n + 4] = i.boundsMax[0], r[n + 5] = i.boundsMax[1], r[n + 6] = i.boundsMax[2];
    const l = new Uint32Array(r.buffer);
    if (i.left && i.right) {
      const h = a(i.left), m = a(i.right);
      l[n + 3] = h, l[n + 7] = m;
    } else
      l[n + 3] = i.triStart, l[n + 7] = (i.triCount | 2147483648) >>> 0;
    return s;
  }
  return a(c), { nodeArray: r, nodeCount: e };
}
function Xe(c, e, t, r, o, a, i, s, n) {
  const l = r - c, h = o - e, m = a - t, d = i - c, f = s - e, u = n - t;
  let p = h * u - m * f, y = m * d - l * u, g = l * f - h * d;
  const b = Math.sqrt(p * p + y * y + g * g);
  return b > 1e-10 && (p /= b, y /= b, g /= b), [p, y, g];
}
const jn = `// ─── GPU Ray Tracer Compute Shader ───────────────────────────────────
// Traces one ray per thread through all bounces using an iterative BVH
// traversal and Moller–Trumbore ray-triangle intersection.
//
// Mirrors the CPU implementation in ray-core.ts.

// Constants
const MAX_BOUNCES: u32 = 64u;
const MAX_BANDS: u32 = 7u;
const BVH_STACK_SIZE: u32 = 64u;
const SELF_INTERSECTION_OFFSET: f32 = 0.01;
const PI: f32 = 3.14159265358979;
const EPSILON: f32 = 1e-6;

// ─── Structures ──────────────────────────────────────────────────────

struct Params {
  numRays: u32,
  maxBounces: u32,
  numBands: u32,
  numReceivers: u32,
  numTriangles: u32,
  numNodes: u32,
  numSurfaces: u32,
  batchSeed: u32,
  rrThreshold: f32,
  _pad0: f32,
  _pad1: f32,
  _pad2: f32,
  // Per-band air attenuation in dB/m (up to MAX_BANDS), packed into vec4s
  // to satisfy uniform buffer layout rules (array<f32> has 16-byte stride).
  // airAttPacked[0] = (band0, band1, band2, band3)
  // airAttPacked[1] = (band4, band5, band6, unused)
  airAttPacked: array<vec4<f32>, 2>,
}

fn getAirAtt(band: u32) -> f32 {
  return params.airAttPacked[band / 4u][band % 4u];
}

// Per-bounce output written to the chain buffer
struct ChainEntry {
  px: f32, py: f32, pz: f32,
  distance: f32,
  surfaceIndex: u32,
  _pad0: u32,
  angle: f32,
  energy: f32,
  bandEnergy: array<f32, 7>,
  _pad1: f32,
}

// Per-ray output
struct RayOutput {
  chainLength: u32,
  intersectedReceiver: u32, // 0 or 1
  receiverIndex: u32,
  arrivalDirX: f32,
  arrivalDirY: f32,
  arrivalDirZ: f32,
  _pad0: f32,
  _pad1: f32,
  finalBandEnergy: array<f32, 7>,
  _pad2: f32,
}

// Per-ray input
struct RayInput {
  ox: f32, oy: f32, oz: f32,
  dx: f32, dy: f32, dz: f32,
  initialPhi: f32,
  initialTheta: f32,
  bandEnergy: array<f32, 7>,
  _pad: f32,
}

// ─── Bindings ────────────────────────────────────────────────────────

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> bvhNodes: array<f32>;
@group(0) @binding(2) var<storage, read> triVerts: array<f32>;
@group(0) @binding(3) var<storage, read> triSurfIndex: array<u32>;
@group(0) @binding(4) var<storage, read> triNormals: array<f32>;
@group(0) @binding(5) var<storage, read> surfAcoustic: array<f32>;
@group(0) @binding(6) var<storage, read> receiverSpheres: array<f32>;
@group(0) @binding(7) var<storage, read> rayInputs: array<RayInput>;
@group(0) @binding(8) var<storage, read_write> rayOutputs: array<RayOutput>;
@group(0) @binding(9) var<storage, read_write> chainBuffer: array<ChainEntry>;

// ─── RNG (PCG hash) ─────────────────────────────────────────────────

fn pcg_hash(input: u32) -> u32 {
  var state = input * 747796405u + 2891336453u;
  var word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn rand(seed: ptr<function, u32>) -> f32 {
  *seed = pcg_hash(*seed);
  return f32(*seed) / 4294967295.0;
}

// ─── Vector helpers ─────────────────────────────────────────────────

fn dot3(ax: f32, ay: f32, az: f32, bx: f32, by: f32, bz: f32) -> f32 {
  return ax * bx + ay * by + az * bz;
}

fn length3(x: f32, y: f32, z: f32) -> f32 {
  return sqrt(x * x + y * y + z * z);
}

fn normalize3(x: f32, y: f32, z: f32) -> vec3<f32> {
  let len = length3(x, y, z);
  if (len < EPSILON) { return vec3<f32>(0.0, 1.0, 0.0); }
  return vec3<f32>(x / len, y / len, z / len);
}

// ─── Ray-AABB slab test ─────────────────────────────────────────────

fn rayAabbIntersect(
  ox: f32, oy: f32, oz: f32,
  invDx: f32, invDy: f32, invDz: f32,
  bminX: f32, bminY: f32, bminZ: f32,
  bmaxX: f32, bmaxY: f32, bmaxZ: f32,
  tMax: f32,
) -> bool {
  var t1 = (bminX - ox) * invDx;
  var t2 = (bmaxX - ox) * invDx;
  var tNear = min(t1, t2);
  var tFar = max(t1, t2);

  t1 = (bminY - oy) * invDy;
  t2 = (bmaxY - oy) * invDy;
  tNear = max(tNear, min(t1, t2));
  tFar = min(tFar, max(t1, t2));

  t1 = (bminZ - oz) * invDz;
  t2 = (bmaxZ - oz) * invDz;
  tNear = max(tNear, min(t1, t2));
  tFar = min(tFar, max(t1, t2));

  return tNear <= tFar && tFar >= 0.0 && tNear < tMax;
}

// ─── Moller–Trumbore ray-triangle intersection ──────────────────────

fn rayTriIntersect(
  ox: f32, oy: f32, oz: f32,
  dx: f32, dy: f32, dz: f32,
  triIdx: u32,
) -> vec2<f32> {
  // Returns (t, 0) on hit, (-1, 0) on miss
  let b = triIdx * 9u;
  let v0x = triVerts[b]; let v0y = triVerts[b + 1u]; let v0z = triVerts[b + 2u];
  let v1x = triVerts[b + 3u]; let v1y = triVerts[b + 4u]; let v1z = triVerts[b + 5u];
  let v2x = triVerts[b + 6u]; let v2y = triVerts[b + 7u]; let v2z = triVerts[b + 8u];

  let e1x = v1x - v0x; let e1y = v1y - v0y; let e1z = v1z - v0z;
  let e2x = v2x - v0x; let e2y = v2y - v0y; let e2z = v2z - v0z;

  // h = cross(d, e2)
  let hx = dy * e2z - dz * e2y;
  let hy = dz * e2x - dx * e2z;
  let hz = dx * e2y - dy * e2x;

  let a = e1x * hx + e1y * hy + e1z * hz;
  if (abs(a) < EPSILON) { return vec2<f32>(-1.0, 0.0); }

  let f_inv = 1.0 / a;
  let sx = ox - v0x; let sy = oy - v0y; let sz = oz - v0z;
  let u = f_inv * (sx * hx + sy * hy + sz * hz);
  if (u < 0.0 || u > 1.0) { return vec2<f32>(-1.0, 0.0); }

  // q = cross(s, e1)
  let qx = sy * e1z - sz * e1y;
  let qy = sz * e1x - sx * e1z;
  let qz = sx * e1y - sy * e1x;
  let v = f_inv * (dx * qx + dy * qy + dz * qz);
  if (v < 0.0 || u + v > 1.0) { return vec2<f32>(-1.0, 0.0); }

  let t = f_inv * (e2x * qx + e2y * qy + e2z * qz);
  if (t < EPSILON) { return vec2<f32>(-1.0, 0.0); }

  return vec2<f32>(t, 0.0);
}

// ─── Ray-sphere intersection ────────────────────────────────────────

fn raySphereIntersect(
  ox: f32, oy: f32, oz: f32,
  dx: f32, dy: f32, dz: f32,
  cx: f32, cy: f32, cz: f32,
  r: f32,
) -> f32 {
  let lx = cx - ox; let ly = cy - oy; let lz = cz - oz;
  let tca = lx * dx + ly * dy + lz * dz;
  let d2 = lx * lx + ly * ly + lz * lz - tca * tca;
  let r2 = r * r;
  if (d2 > r2) { return -1.0; }
  let thc = sqrt(r2 - d2);
  var t0 = tca - thc;
  let t1 = tca + thc;
  if (t0 < EPSILON) { t0 = t1; }
  if (t0 < EPSILON) { return -1.0; }
  return t0;
}

// ─── BVH traversal — find closest triangle hit ─────────────────────

struct HitResult {
  t: f32,
  triIdx: u32,
  hit: bool,
}

fn traceClosest(
  ox: f32, oy: f32, oz: f32,
  dx: f32, dy: f32, dz: f32,
) -> HitResult {
  var result: HitResult;
  result.t = 1e30;
  result.triIdx = 0u;
  result.hit = false;

  let invDx = select(1e30, 1.0 / dx, abs(dx) > EPSILON);
  let invDy = select(1e30, 1.0 / dy, abs(dy) > EPSILON);
  let invDz = select(1e30, 1.0 / dz, abs(dz) > EPSILON);

  var stack: array<u32, 64>;
  var stackPtr: u32 = 0u;
  stack[0] = 0u; // root node index
  stackPtr = 1u;

  while (stackPtr > 0u) {
    stackPtr -= 1u;
    let nodeIdx = stack[stackPtr];
    let off = nodeIdx * 8u;

    let bminX = bvhNodes[off];
    let bminY = bvhNodes[off + 1u];
    let bminZ = bvhNodes[off + 2u];
    let bmaxX = bvhNodes[off + 4u];
    let bmaxY = bvhNodes[off + 5u];
    let bmaxZ = bvhNodes[off + 6u];

    if (!rayAabbIntersect(ox, oy, oz, invDx, invDy, invDz, bminX, bminY, bminZ, bmaxX, bmaxY, bmaxZ, result.t)) {
      continue;
    }

    // Read data1 as u32 to check leaf flag
    let data1Bits = bitcast<u32>(bvhNodes[off + 7u]);
    let isLeaf = (data1Bits & 0x80000000u) != 0u;

    if (isLeaf) {
      let triStart = bitcast<u32>(bvhNodes[off + 3u]);
      let triCount = data1Bits & 0x7FFFFFFFu;
      for (var i = 0u; i < triCount; i++) {
        let tri = triStart + i;
        let res = rayTriIntersect(ox, oy, oz, dx, dy, dz, tri);
        if (res.x > 0.0 && res.x < result.t) {
          result.t = res.x;
          result.triIdx = tri;
          result.hit = true;
        }
      }
    } else {
      let leftIdx = bitcast<u32>(bvhNodes[off + 3u]);
      let rightIdx = data1Bits;
      if (stackPtr < BVH_STACK_SIZE) {
        stack[stackPtr] = leftIdx;
        stackPtr += 1u;
      }
      if (stackPtr < BVH_STACK_SIZE) {
        stack[stackPtr] = rightIdx;
        stackPtr += 1u;
      }
    }
  }

  return result;
}

// ─── Reflection coefficient (matches CPU reflection-coefficient.ts) ──

fn reflectionCoefficient(alpha: f32, theta: f32) -> f32 {
  let rootOneMinusAlpha = sqrt(max(1.0 - alpha, 0.0));
  let xi_o = (1.0 - rootOneMinusAlpha) / (1.0 + rootOneMinusAlpha);
  let cosTheta = abs(cos(theta));
  let xi_o_cosTheta = xi_o * cosTheta;
  let R = (xi_o_cosTheta - 1.0) / (xi_o_cosTheta + 1.0);
  return R * R;
}

// ─── Main compute entry point ───────────────────────────────────────

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let rayIdx = gid.x;
  if (rayIdx >= params.numRays) { return; }

  let inp = rayInputs[rayIdx];
  let numBands = min(params.numBands, MAX_BANDS);
  let maxBounces = min(params.maxBounces, MAX_BOUNCES);

  var rngSeed: u32 = pcg_hash(rayIdx * 747796405u + params.batchSeed);

  // Current ray state
  var ox = inp.ox; var oy = inp.oy; var oz = inp.oz;
  var dx = inp.dx; var dy = inp.dy; var dz = inp.dz;
  var d = normalize3(dx, dy, dz);
  dx = d.x; dy = d.y; dz = d.z;

  var bandEnergy: array<f32, 7>;
  for (var b = 0u; b < numBands; b++) {
    bandEnergy[b] = inp.bandEnergy[b];
  }

  // Output
  let chainBase = rayIdx * MAX_BOUNCES;
  var chainLen: u32 = 0u;
  var hitReceiver: u32 = 0u;
  var receiverIdx: u32 = 0u;
  var arrivalDir = vec3<f32>(0.0, 0.0, 0.0);

  for (var bounce = 0u; bounce < maxBounces; bounce++) {
    // Check receiver spheres first (find closest)
    var closestRecT: f32 = 1e30;
    var closestRecIdx: u32 = 0u;
    var recHit = false;
    for (var ri = 0u; ri < params.numReceivers; ri++) {
      let rb = ri * 4u;
      let rcx = receiverSpheres[rb];
      let rcy = receiverSpheres[rb + 1u];
      let rcz = receiverSpheres[rb + 2u];
      let rr = receiverSpheres[rb + 3u];
      let t = raySphereIntersect(ox, oy, oz, dx, dy, dz, rcx, rcy, rcz, rr);
      if (t > 0.0 && t < closestRecT) {
        closestRecT = t;
        closestRecIdx = ri;
        recHit = true;
      }
    }

    // BVH closest triangle hit
    let triHit = traceClosest(ox, oy, oz, dx, dy, dz);

    // Receiver is closer than any surface — ray enters receiver
    if (recHit && closestRecT < triHit.t) {
      // Apply air absorption for receiver segment
      for (var b = 0u; b < numBands; b++) {
        bandEnergy[b] *= pow(10.0, -getAirAtt(b) * closestRecT / 10.0);
      }

      // Compute mean energy
      var totalE: f32 = 0.0;
      for (var b = 0u; b < numBands; b++) { totalE += bandEnergy[b]; }
      let meanE = totalE / f32(numBands);

      // Record chain entry at receiver position
      if (chainLen < MAX_BOUNCES) {
        let ci = chainBase + chainLen;
        chainBuffer[ci].px = ox + dx * closestRecT;
        chainBuffer[ci].py = oy + dy * closestRecT;
        chainBuffer[ci].pz = oz + dz * closestRecT;
        chainBuffer[ci].distance = closestRecT;
        // Store receiver index encoded as surface index + numSurfaces offset
        chainBuffer[ci].surfaceIndex = params.numSurfaces + closestRecIdx;
        chainBuffer[ci].angle = 0.0;
        chainBuffer[ci].energy = meanE;
        for (var b = 0u; b < numBands; b++) {
          chainBuffer[ci].bandEnergy[b] = bandEnergy[b];
        }
        chainLen += 1u;
      }

      hitReceiver = 1u;
      receiverIdx = closestRecIdx;
      arrivalDir = normalize3(-dx, -dy, -dz);
      break;
    }

    // No surface hit — ray escapes
    if (!triHit.hit) { break; }

    // Surface hit
    let hitT = triHit.t;
    let hitTri = triHit.triIdx;
    let surfIdx = triSurfIndex[hitTri];

    // Hit point
    let hx = ox + dx * hitT;
    let hy = oy + dy * hitT;
    let hz = oz + dz * hitT;

    // Face normal
    let nb = hitTri * 3u;
    let nx = triNormals[nb];
    let ny = triNormals[nb + 1u];
    let nz = triNormals[nb + 2u];

    // Incidence angle
    let negDdotN = -(dx * nx + dy * ny + dz * nz);
    let angle = acos(clamp(abs(negDdotN), 0.0, 1.0));

    // Mean energy before reflection (for chain output)
    var totalEBefore: f32 = 0.0;
    for (var b = 0u; b < numBands; b++) { totalEBefore += bandEnergy[b]; }
    let meanEBefore = totalEBefore / f32(numBands);

    // Record chain entry
    if (chainLen < MAX_BOUNCES) {
      let ci = chainBase + chainLen;
      chainBuffer[ci].px = hx;
      chainBuffer[ci].py = hy;
      chainBuffer[ci].pz = hz;
      chainBuffer[ci].distance = hitT;
      chainBuffer[ci].surfaceIndex = surfIdx;
      chainBuffer[ci].angle = angle;
      chainBuffer[ci].energy = meanEBefore;
      for (var b = 0u; b < numBands; b++) {
        chainBuffer[ci].bandEnergy[b] = bandEnergy[b];
      }
      chainLen += 1u;
    }

    // Apply per-band reflection loss and air absorption
    var broadbandScatter: f32 = 0.0;
    var totalEForScatter: f32 = 0.0;

    for (var b = 0u; b < numBands; b++) {
      let acousticOffset = (surfIdx * params.numBands + b) * 2u;
      let alpha = surfAcoustic[acousticOffset];
      let scatter = surfAcoustic[acousticOffset + 1u];

      let R = reflectionCoefficient(alpha, angle);
      bandEnergy[b] *= abs(R);
      bandEnergy[b] *= pow(10.0, -getAirAtt(b) * hitT / 10.0);

      broadbandScatter += scatter * bandEnergy[b];
      totalEForScatter += bandEnergy[b];
    }

    if (totalEForScatter > 0.0) {
      broadbandScatter /= totalEForScatter;
    }

    // Russian Roulette termination
    var maxE: f32 = 0.0;
    for (var b = 0u; b < numBands; b++) {
      maxE = max(maxE, bandEnergy[b]);
    }

    if (maxE < params.rrThreshold && maxE > 0.0) {
      let survivalProb = maxE / params.rrThreshold;
      if (rand(&rngSeed) > survivalProb) {
        break; // Terminate
      }
      // Boost survivors
      for (var b = 0u; b < numBands; b++) {
        bandEnergy[b] /= survivalProb;
      }
    } else if (maxE <= 0.0) {
      break;
    }

    // Compute reflected direction
    // Specular: r = d - 2(d·n)n
    let dDotN = dx * nx + dy * ny + dz * nz;
    var rx = dx - 2.0 * dDotN * nx;
    var ry = dy - 2.0 * dDotN * ny;
    var rz = dz - 2.0 * dDotN * nz;

    // Scattering: probabilistic Lambert vs specular
    if (rand(&rngSeed) < broadbandScatter) {
      // Cosine-weighted hemisphere sampling (rejection + normal offset)
      var sx: f32; var sy: f32; var sz: f32; var lenSq: f32;
      loop {
        sx = rand(&rngSeed) * 2.0 - 1.0;
        sy = rand(&rngSeed) * 2.0 - 1.0;
        sz = rand(&rngSeed) * 2.0 - 1.0;
        lenSq = sx * sx + sy * sy + sz * sz;
        if (lenSq <= 1.0 && lenSq > 1e-6) { break; }
      }
      let invLen = 1.0 / sqrt(lenSq);
      sx *= invLen; sy *= invLen; sz *= invLen;
      // Offset along normal for cosine distribution
      rx = sx + nx;
      ry = sy + ny;
      rz = sz + nz;
    }

    // Normalize reflected direction
    d = normalize3(rx, ry, rz);
    dx = d.x; dy = d.y; dz = d.z;

    // Offset origin along normal to avoid self-intersection
    ox = hx + nx * SELF_INTERSECTION_OFFSET;
    oy = hy + ny * SELF_INTERSECTION_OFFSET;
    oz = hz + nz * SELF_INTERSECTION_OFFSET;
  }

  // Write output
  rayOutputs[rayIdx].chainLength = chainLen;
  rayOutputs[rayIdx].intersectedReceiver = hitReceiver;
  rayOutputs[rayIdx].receiverIndex = receiverIdx;
  rayOutputs[rayIdx].arrivalDirX = arrivalDir.x;
  rayOutputs[rayIdx].arrivalDirY = arrivalDir.y;
  rayOutputs[rayIdx].arrivalDirZ = arrivalDir.z;
  for (var b = 0u; b < min(params.numBands, MAX_BANDS); b++) {
    rayOutputs[rayIdx].finalBandEnergy[b] = bandEnergy[b];
  }
}
`, q = 64, Ze = 7, qn = 64, pt = 16, Ke = pt * 4, Ee = 16, Je = Ee * 4, Te = 16, be = Te * 4, Yn = 20, Qe = Yn * 4;
class $n {
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
  async initialize(e, t, r, o) {
    const a = await St();
    if (!a) return !1;
    this.device = a.device, this.config = r;
    const i = a.device.limits.maxStorageBufferBindingSize, s = a.device.limits.maxBufferSize, n = q * be, l = Math.floor(Math.min(i, s) / n);
    if (l < 1)
      return console.error("[GPU RT] Device storage limits too small for even a single ray chain buffer"), !1;
    const h = Math.max(1, o), m = Math.min(h, l);
    m < h && console.warn(`[GPU RT] batchSize ${h} exceeds device limits; clamped to ${m}`), this.maxBatchSize = m, r.reflectionOrder > q && console.warn(`[GPU RT] reflectionOrder ${r.reflectionOrder} clamped to ${q}`);
    const d = r.frequencies.slice(0, Ze);
    this.sceneBuf = Un(e, t, d), this.gpuBvhNodes = this.createStorageBuffer(this.sceneBuf.bvhNodes), this.gpuTriVerts = this.createStorageBuffer(this.sceneBuf.triangleVertices), this.gpuTriSurfIdx = this.createStorageBuffer(new Uint32Array(this.sceneBuf.triangleSurfaceIndex)), this.gpuTriNormals = this.createStorageBuffer(this.sceneBuf.triangleNormals), this.gpuSurfAcoustic = this.createStorageBuffer(this.sceneBuf.surfaceAcousticData);
    const f = this.sceneBuf.receiverSpheres.length > 0 ? this.sceneBuf.receiverSpheres : new Float32Array(4);
    this.gpuReceiverSpheres = this.createStorageBuffer(f);
    const u = m * Ke, p = m * Je, y = m * q * be;
    this.gpuRayInputs = this.device.createBuffer({
      size: u,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    }), this.gpuRayOutputs = this.device.createBuffer({
      size: p,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    }), this.gpuChainBuffer = this.device.createBuffer({
      size: y,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    }), this.gpuParams = this.device.createBuffer({
      size: Qe,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackOutput = this.device.createBuffer({
      size: p,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackChain = this.device.createBuffer({
      size: y,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    const g = this.device.createShaderModule({ code: jn });
    return this.pipeline = this.device.createComputePipeline({
      layout: "auto",
      compute: { module: g, entryPoint: "main" }
    }), this.bindGroupLayout = this.pipeline.getBindGroupLayout(0), !0;
  }
  async traceBatch(e, t, r) {
    if (!this.device || !this.pipeline || !this.sceneBuf || !this.config)
      throw new Error("[GPU RT] Not initialized");
    if (t > this.maxBatchSize)
      throw new Error(`[GPU RT] rayCount ${t} exceeds maxBatchSize ${this.maxBatchSize}`);
    if (t === 0) return [];
    const o = Math.min(this.config.frequencies.length, Ze), a = new ArrayBuffer(Qe), i = new Uint32Array(a), s = new Float32Array(a);
    i[0] = t, i[1] = Math.min(this.config.reflectionOrder, q), i[2] = o, i[3] = this.sceneBuf.receiverCount, i[4] = this.sceneBuf.triangleCount, i[5] = this.sceneBuf.nodeCount, i[6] = this.sceneBuf.surfaceCount, i[7] = r, s[8] = this.config.rrThreshold;
    for (let y = 0; y < o; y++)
      s[12 + y] = this.config.cachedAirAtt[y];
    this.device.queue.writeBuffer(this.gpuParams, 0, a), this.device.queue.writeBuffer(
      this.gpuRayInputs,
      0,
      e.buffer,
      e.byteOffset,
      t * Ke
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
    }), l = Math.ceil(t / qn), h = this.device.createCommandEncoder(), m = h.beginComputePass();
    m.setPipeline(this.pipeline), m.setBindGroup(0, n), m.dispatchWorkgroups(l), m.end();
    const d = t * Je, f = t * q * be;
    h.copyBufferToBuffer(this.gpuRayOutputs, 0, this.gpuReadbackOutput, 0, d), h.copyBufferToBuffer(this.gpuChainBuffer, 0, this.gpuReadbackChain, 0, f), this.device.queue.submit([h.finish()]), await this.gpuReadbackOutput.mapAsync(GPUMapMode.READ, 0, d), await this.gpuReadbackChain.mapAsync(GPUMapMode.READ, 0, f);
    const u = new Float32Array(this.gpuReadbackOutput.getMappedRange(0, d).slice(0)), p = new Float32Array(this.gpuReadbackChain.getMappedRange(0, f).slice(0));
    return this.gpuReadbackOutput.unmap(), this.gpuReadbackChain.unmap(), this.parseResults(u, p, e, t, o);
  }
  parseResults(e, t, r, o, a) {
    const i = new Array(o), s = this.sceneBuf;
    for (let n = 0; n < o; n++) {
      const l = n * Ee, h = new Uint32Array(e.buffer, l * 4, Ee), m = h[0], d = h[1] !== 0;
      if (m === 0) {
        i[n] = null;
        continue;
      }
      const f = [
        e[l + 3],
        e[l + 4],
        e[l + 5]
      ], u = [];
      for (let R = 0; R < a; R++)
        u.push(e[l + 8 + R]);
      const p = [], y = n * q;
      for (let R = 0; R < m; R++) {
        const _ = (y + R) * Te, S = new Uint32Array(t.buffer, _ * 4, Te), A = t[_], D = t[_ + 1], E = t[_ + 2], T = t[_ + 3], w = S[4], O = t[_ + 6], F = t[_ + 7], z = [];
        for (let L = 0; L < a; L++)
          z.push(t[_ + 8 + L]);
        let M;
        if (w >= s.surfaceCount) {
          const L = w - s.surfaceCount;
          M = s.receiverUuidMap[L] ?? "";
        } else
          M = s.surfaceUuidMap[w] ?? "";
        p.push({
          point: [A, D, E],
          distance: T,
          object: M,
          faceNormal: [0, 0, 0],
          faceIndex: -1,
          faceMaterialIndex: -1,
          angle: O,
          energy: F,
          bandEnergy: z
        });
      }
      const g = n * pt, b = r[g + 6], x = r[g + 7], I = u.reduce((R, _) => R + _, 0), v = a > 0 ? I / a : 0;
      i[n] = {
        intersectedReceiver: d,
        chain: p,
        chainLength: p.length,
        energy: v,
        bandEnergy: u,
        time: 0,
        // Computed by caller (stop())
        source: "",
        // Filled in by caller
        initialPhi: b,
        initialTheta: x,
        totalLength: 0,
        // Computed by caller
        arrivalDirection: d ? f : void 0
      };
    }
    return i;
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
    const t = Math.max(e.byteLength, 16), r = this.device.createBuffer({
      size: t,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    return this.device.queue.writeBuffer(
      r,
      0,
      e.buffer,
      e.byteOffset,
      e.byteLength
    ), r;
  }
}
const Re = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
)), { floor: Y, random: Wn, abs: ae } = Math, Ie = () => Wn() > 0.5;
B.BufferGeometry.prototype.computeBoundsTree = yt;
B.BufferGeometry.prototype.disposeBoundsTree = vt;
B.Mesh.prototype.raycast = bt;
class Xn extends mt {
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
    super(e), this.kind = "ray-tracer", e = { ...C, ...e }, this.uuid = e.uuid || this.uuid, this.name = e.name || C.name, this.observed_name = qt(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = e.sourceIDs || C.sourceIDs, this.surfaceIDs = e.surfaceIDs || C.surfaceIDs, this.roomID = e.roomID || C.roomID, this.receiverIDs = e.receiverIDs || C.receiverIDs, this.updateInterval = e.updateInterval || C.updateInterval, this.reflectionOrder = e.reflectionOrder || C.reflectionOrder, this._isRunning = e.isRunning || C.isRunning, this._runningWithoutReceivers = e.runningWithoutReceivers || C.runningWithoutReceivers, this.frequencies = e.frequencies || C.frequencies, this._cachedAirAtt = Z(this.frequencies, this.temperature), this.intervals = [], this.plotData = [], this.plotStyle = e.plotStyle || C.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = e.pointSize || C.pointSize, this.validRayCount = 0, this.intensitySampleRate = st, this.quickEstimateResults = {};
    const t = typeof e.raysVisible == "boolean";
    this._raysVisible = t ? e.raysVisible : C.raysVisible;
    const r = typeof e.pointsVisible == "boolean";
    this._pointsVisible = r ? e.pointsVisible : C.pointsVisible;
    const o = typeof e.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = o ? e.invertedDrawStyle : C.invertedDrawStyle, this.passes = e.passes || C.passes, this.raycaster = new B.Raycaster(), this.rayBufferGeometry = new B.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new B.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(B.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new B.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(B.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.convergenceThreshold = e.convergenceThreshold ?? C.convergenceThreshold, this.autoStop = e.autoStop ?? C.autoStop, this.rrThreshold = e.rrThreshold ?? C.rrThreshold, this.maxStoredPaths = e.maxStoredPaths ?? C.maxStoredPaths, this.edgeDiffractionEnabled = e.edgeDiffractionEnabled ?? C.edgeDiffractionEnabled, this.lateReverbTailEnabled = e.lateReverbTailEnabled ?? C.lateReverbTailEnabled, this.tailCrossfadeTime = e.tailCrossfadeTime ?? C.tailCrossfadeTime, this.tailCrossfadeDuration = e.tailCrossfadeDuration ?? C.tailCrossfadeDuration, this.gpuEnabled = e.gpuEnabled ?? C.gpuEnabled, this.gpuBatchSize = e.gpuBatchSize ?? C.gpuBatchSize, this.hrtfSubjectId = e.hrtfSubjectId ?? "D1", this.headYaw = e.headYaw ?? 0, this.headPitch = e.headPitch ?? 0, this.headRoll = e.headRoll ?? 0, this._edgeGraph = null, this._histogramBinWidth = Zt, this._histogramNumBins = Kt, this._convergenceCheckInterval = Jt, this._resetConvergenceState(), this.rays = new B.LineSegments(
      this.rayBufferGeometry,
      new B.LineBasicMaterial({
        fog: !1,
        color: 2631977,
        transparent: !0,
        opacity: 0.2,
        premultipliedAlpha: !0,
        blending: B.NormalBlending,
        depthFunc: B.AlwaysDepth,
        name: "raytracer-rays-material"
        // depthTest: false
      })
    ), this.rays.renderOrder = -0.5, this.rays.frustumCulled = !1, N.scene.add(this.rays);
    var a = new B.ShaderMaterial({
      fog: !1,
      vertexShader: Oe.vs,
      fragmentShader: Oe.fs,
      transparent: !0,
      premultipliedAlpha: !0,
      uniforms: {
        drawStyle: { value: rt.ENERGY },
        inverted: { value: 0 },
        pointScale: { value: this._pointSize }
      },
      blending: B.NormalBlending,
      name: "raytracer-points-material"
    });
    this.hits = new B.Points(this.rayBufferGeometry, a), this.hits.frustumCulled = !1, N.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
      value: !0,
      writable: !0
    }), this.intersections = [], this.findIDs(), this.intersectableObjects = [], this.paths = e.paths || C.paths, this.stats = {
      numRaysShot: {
        name: "# of rays shot",
        value: 0
      },
      numValidRayPaths: {
        name: "# of valid rays",
        value: 0
      }
    }, N.overlays.global.addCell("Valid Rays", this.validRayCount, {
      id: this.uuid + "-valid-ray-count",
      hidden: !0,
      formatter: (i) => String(i)
    }), this.messageHandlerIDs = [], X.postMessage("STATS_SETUP", this.stats), this.messageHandlerIDs.push(
      X.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (i, ...s) => {
        console.log(s && s[0] && s[0] instanceof Array && s[1] && s[1] === this.uuid), s && s[0] && s[0] instanceof Array && s[1] && s[1] === this.uuid && (this.sourceIDs = s[0].map((n) => n.id));
      })
    ), this.messageHandlerIDs.push(
      X.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (i, ...s) => {
        s && s[0] && s[0] instanceof Array && s[1] && s[1] === this.uuid && (this.receiverIDs = s[0].map((n) => n.id));
      })
    ), this.messageHandlerIDs.push(
      X.addMessageHandler("SHOULD_REMOVE_CONTAINER", (i, ...s) => {
        const n = s[0];
        n && (console.log(n), this.sourceIDs.includes(n) ? this.sourceIDs = this.sourceIDs.filter((l) => l != n) : this.receiverIDs.includes(n) && (this.receiverIDs = this.receiverIDs.filter((l) => l != n)));
      })
    ), this.step = this.step.bind(this), this.calculateImpulseResponse = this.calculateImpulseResponse.bind(this);
  }
  update = () => {
  };
  get temperature() {
    return this.room?.temperature ?? 20;
  }
  get c() {
    return nt(this.temperature);
  }
  save() {
    const {
      name: e,
      kind: t,
      uuid: r,
      autoCalculate: o,
      roomID: a,
      sourceIDs: i,
      surfaceIDs: s,
      receiverIDs: n,
      updateInterval: l,
      passes: h,
      pointSize: m,
      reflectionOrder: d,
      runningWithoutReceivers: f,
      raysVisible: u,
      pointsVisible: p,
      invertedDrawStyle: y,
      plotStyle: g,
      paths: b,
      frequencies: x,
      convergenceThreshold: I,
      autoStop: v,
      rrThreshold: R,
      maxStoredPaths: _,
      edgeDiffractionEnabled: S,
      lateReverbTailEnabled: A,
      tailCrossfadeTime: D,
      tailCrossfadeDuration: E,
      gpuEnabled: T,
      gpuBatchSize: w,
      hrtfSubjectId: O,
      headYaw: F,
      headPitch: z,
      headRoll: M
    } = this;
    return {
      name: e,
      kind: t,
      uuid: r,
      autoCalculate: o,
      roomID: a,
      sourceIDs: i,
      surfaceIDs: s,
      receiverIDs: n,
      updateInterval: l,
      passes: h,
      pointSize: m,
      reflectionOrder: d,
      runningWithoutReceivers: f,
      raysVisible: u,
      pointsVisible: p,
      invertedDrawStyle: y,
      plotStyle: g,
      paths: b,
      frequencies: x,
      convergenceThreshold: I,
      autoStop: v,
      rrThreshold: R,
      maxStoredPaths: _,
      edgeDiffractionEnabled: S,
      lateReverbTailEnabled: A,
      tailCrossfadeTime: D,
      tailCrossfadeDuration: E,
      gpuEnabled: T,
      gpuBatchSize: w,
      hrtfSubjectId: O,
      headYaw: F,
      headPitch: z,
      headRoll: M
    };
  }
  removeMessageHandlers() {
    this.messageHandlerIDs.forEach((e) => {
      X.removeMessageHandler(e[0], e[1]);
    });
  }
  dispose() {
    this._isRunning && (this._isRunning = !1, this._gpuRunning = !1, cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => window.clearInterval(e)), this.intervals = []), this._disposeGpu(), this.removeMessageHandlers(), Object.keys(window.vars).forEach((e) => {
      window.vars[e].uuid === this.uuid && delete window.vars[e];
    }), N.scene.remove(this.rays), N.scene.remove(this.hits);
  }
  addSource(e) {
    P.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
  }
  addReceiver(e) {
    P.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
  }
  mapIntersectableObjects() {
    const e = [];
    this.room.surfaces.traverse((t) => {
      t.kind && t.kind === "surface" && e.push(t.mesh);
    }), this.runningWithoutReceivers ? this.intersectableObjects = e : this.intersectableObjects = e.concat(this.receivers);
  }
  findIDs() {
    this.sourceIDs = [], this.receiverIDs = [], this.surfaceIDs = [];
    for (const e in P.getState().containers)
      P.getState().containers[e].kind === "room" ? this.roomID = e : P.getState().containers[e].kind === "source" ? this.sourceIDs.push(e) : P.getState().containers[e].kind === "receiver" ? this.receiverIDs.push(e) : P.getState().containers[e].kind === "surface" && this.surfaceIDs.push(e);
    this.mapIntersectableObjects();
  }
  setDrawStyle(e) {
    this.hits.material.uniforms.drawStyle.value = e, this.hits.material.needsUpdate = !0, N.needsToRender = !0;
  }
  setPointScale(e) {
    this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0, N.needsToRender = !0;
  }
  incrementRayPositionIndex() {
    return this.rayPositionIndex < this.maxrays ? this.rayPositionIndex++ : (this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !0, this.rayPositionIndex);
  }
  rayPositionIndexDidOverflow = !1;
  appendRay(e, t, r = 1, o = 1) {
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, r, o), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, r, o), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex);
  }
  flushRayBuffer() {
    this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
  }
  inFrontOf(e, t) {
    return an(e, t);
  }
  traceRay(e, t, r, o, a, i, s, n = 1, l = []) {
    return it(
      this.raycaster,
      this.intersectableObjects,
      this.frequencies,
      this._cachedAirAtt,
      this.rrThreshold,
      e,
      t,
      r,
      o,
      a,
      i,
      s,
      n,
      l
    );
  }
  startQuickEstimate(e = this.frequencies, t = 1e3) {
    const r = this.runningWithoutReceivers;
    this.runningWithoutReceivers = !0;
    let o = 0;
    this.quickEstimateResults = {}, this.sourceIDs.forEach((a) => {
      this.quickEstimateResults[a] = [];
    }), this.intervals.push(
      window.setInterval(() => {
        for (let a = 0; a < this.passes; a++, o++)
          for (let i = 0; i < this.sourceIDs.length; i++) {
            const s = this.sourceIDs[i], n = P.getState().containers[s];
            this.quickEstimateResults[s].push(this.quickEstimateStep(n, e, t));
          }
        o >= t ? (this.intervals.forEach((a) => window.clearInterval(a)), this.runningWithoutReceivers = r, console.log(this.quickEstimateResults)) : console.log((o / t * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(e, t, r) {
    const o = this.c, a = Array(t.length).fill(0);
    let i = e.position.clone(), s, n, l, h;
    do
      s = Math.random() * 2 - 1, n = Math.random() * 2 - 1, l = Math.random() * 2 - 1, h = s * s + n * n + l * l;
    while (h > 1 || h < 1e-6);
    let m = new B.Vector3(s, n, l).normalize(), d = 0;
    const f = Array(t.length).fill(e.initialIntensity);
    let u = 0;
    const p = $t;
    let y = !1, g = 0;
    Z(t, this.temperature);
    let b = {};
    for (; !y && u < p; ) {
      this.raycaster.ray.set(i, m);
      const x = this.raycaster.intersectObjects(this.intersectableObjects, !0);
      if (x.length > 0) {
        d = m.clone().multiplyScalar(-1).angleTo(x[0].face.normal), g += x[0].distance;
        const I = x[0].object.parent;
        for (let R = 0; R < t.length; R++) {
          const _ = t[R];
          let S = 1;
          I.kind === "surface" && (S = I.reflectionFunction(_, d)), f[R] *= S;
          const A = e.initialIntensity / f[R] > Xt;
          A && (a[R] = g / o), y = y || A;
        }
        x[0].object.parent instanceof et && (x[0].object.parent.numHits += 1);
        const v = x[0].face.normal.normalize();
        m.sub(v.clone().multiplyScalar(m.dot(v)).multiplyScalar(2)).normalize(), i.copy(x[0].point), b = x[0];
      }
      u += 1;
    }
    return this.stats.numRaysShot.value++, {
      distance: g,
      rt60s: a,
      angle: d,
      direction: m,
      lastIntersection: b
    };
  }
  startAllMonteCarlo() {
    this._lastConvergenceCheck = Date.now(), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = 0);
    const e = () => {
      if (!this._isRunning) return;
      const t = 12, r = performance.now();
      do
        this.stepStratified(this.passes);
      while (performance.now() - r < t);
      this.flushRayBuffer(), N.needsToRender = !0;
      const o = Date.now();
      if (this.autoStop && o - this._lastConvergenceCheck >= this._convergenceCheckInterval && (this._lastConvergenceCheck = o, this._updateConvergenceMetrics(), this.convergenceMetrics.convergenceRatio < this.convergenceThreshold && this.convergenceMetrics.t30Count >= 3)) {
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
    const r = e / t;
    for (let o = 0; o < this.sourceIDs.length; o++) {
      const a = P.getState().containers[this.sourceIDs[o]], i = a.phi, s = a.theta, n = a.position, l = a.rotation, h = a.directivityHandler;
      this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
      const m = this.sourceIDs[o];
      let d = this._directivityRefPressures.get(m);
      if (!d || d.length !== this.frequencies.length) {
        d = new Array(this.frequencies.length);
        for (let f = 0; f < this.frequencies.length; f++)
          d[f] = h.getPressureAtPosition(0, this.frequencies[f], 0, 0);
        this._directivityRefPressures.set(m, d);
      }
      for (let f = 0; f < t; f++)
        for (let u = 0; u < r; u++) {
          this.__num_checked_paths += 1;
          const p = (f + Math.random()) / t * i, y = (u + Math.random()) / r * s;
          let g = ye(p, y);
          const b = new B.Vector3().setFromSphericalCoords(1, g[0], g[1]);
          b.applyEuler(l);
          const x = new Array(this.frequencies.length);
          for (let v = 0; v < this.frequencies.length; v++) {
            let R = 1;
            try {
              const _ = h.getPressureAtPosition(0, this.frequencies[v], p, y), S = d[v];
              typeof _ == "number" && typeof S == "number" && S > 0 && (R = (_ / S) ** 2);
            } catch {
            }
            x[v] = R;
          }
          const I = this.traceRay(n, b, this.reflectionOrder, x, m, p, y);
          I && this._handleTracedPath(I, n, m), this.stats.numRaysShot.value++;
        }
    }
  }
  /** Common path handling for both step() and stepStratified() */
  _handleTracedPath(e, t, r) {
    if (this._runningWithoutReceivers) {
      this.appendRay(
        [t.x, t.y, t.z],
        e.chain[0].point,
        e.chain[0].energy || 1,
        e.chain[0].angle
      );
      for (let a = 1; a < e.chain.length; a++)
        this.appendRay(e.chain[a - 1].point, e.chain[a].point, e.chain[a].energy || 1, e.chain[a].angle);
      const o = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(o, e), P.getState().containers[r].numRays += 1;
    } else if (e.intersectedReceiver) {
      this.appendRay(
        [t.x, t.y, t.z],
        e.chain[0].point,
        e.chain[0].energy || 1,
        e.chain[0].angle
      );
      for (let a = 1; a < e.chain.length; a++)
        this.appendRay(e.chain[a - 1].point, e.chain[a].point, e.chain[a].energy || 1, e.chain[a].angle);
      this.stats.numValidRayPaths.value++, this.validRayCount += 1, N.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
      const o = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(o, e), P.getState().containers[r].numRays += 1, this._addToEnergyHistogram(o, e);
    }
  }
  /** Push a path onto the paths array, evicting oldest if over maxStoredPaths */
  _pushPathWithEviction(e, t) {
    const r = Math.max(1, this.maxStoredPaths | 0);
    if (!this.paths[e]) {
      this.paths[e] = [t];
      return;
    }
    const o = this.paths[e];
    if (o.length >= r) {
      const a = o.length - r + 1;
      a > 0 && o.splice(0, a);
    }
    o.push(t);
  }
  /** Add a ray path's energy to the convergence histogram */
  _addToEnergyHistogram(e, t) {
    Bn(this._energyHistogram, e, t, this.frequencies, this.c, this._histogramBinWidth, this._histogramNumBins);
  }
  step() {
    for (let e = 0; e < this.sourceIDs.length; e++) {
      this.__num_checked_paths += 1;
      const t = Math.random() * P.getState().containers[this.sourceIDs[e]].theta, r = Math.random() * P.getState().containers[this.sourceIDs[e]].phi, o = P.getState().containers[this.sourceIDs[e]].position, a = P.getState().containers[this.sourceIDs[e]].rotation;
      let i = ye(r, t);
      const s = new B.Vector3().setFromSphericalCoords(1, i[0], i[1]);
      s.applyEuler(a);
      const n = P.getState().containers[this.sourceIDs[e]].directivityHandler;
      this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
      const l = this.sourceIDs[e];
      let h = this._directivityRefPressures.get(l);
      if (!h || h.length !== this.frequencies.length) {
        h = new Array(this.frequencies.length);
        for (let f = 0; f < this.frequencies.length; f++)
          h[f] = n.getPressureAtPosition(0, this.frequencies[f], 0, 0);
        this._directivityRefPressures.set(l, h);
      }
      const m = new Array(this.frequencies.length);
      for (let f = 0; f < this.frequencies.length; f++) {
        let u = 1;
        try {
          const p = n.getPressureAtPosition(0, this.frequencies[f], r, t), y = h[f];
          typeof p == "number" && typeof y == "number" && y > 0 && (u = (p / y) ** 2);
        } catch {
        }
        m[f] = u;
      }
      const d = this.traceRay(o, s, this.reflectionOrder, m, this.sourceIDs[e], r, t);
      if (d) {
        if (this._runningWithoutReceivers) {
          this.appendRay(
            [o.x, o.y, o.z],
            d.chain[0].point,
            d.chain[0].energy || 1,
            d.chain[0].angle
          );
          for (let u = 1; u < d.chain.length; u++)
            this.appendRay(
              // the previous point
              d.chain[u - 1].point,
              // the current point
              d.chain[u].point,
              // the energy content displayed as a color + alpha
              d.chain[u].energy || 1,
              d.chain[u].angle
            );
          const f = d.chain[d.chain.length - 1].object;
          this._pushPathWithEviction(f, d), P.getState().containers[this.sourceIDs[e]].numRays += 1;
        } else if (d.intersectedReceiver) {
          this.appendRay(
            [o.x, o.y, o.z],
            d.chain[0].point,
            d.chain[0].energy || 1,
            d.chain[0].angle
          );
          for (let u = 1; u < d.chain.length; u++)
            this.appendRay(
              // the previous point
              d.chain[u - 1].point,
              // the current point
              d.chain[u].point,
              // the energy content displayed as a color + alpha
              d.chain[u].energy || 1,
              d.chain[u].angle
            );
          this.stats.numValidRayPaths.value++, this.validRayCount += 1, N.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
          const f = d.chain[d.chain.length - 1].object;
          this._pushPathWithEviction(f, d), P.getState().containers[this.sourceIDs[e]].numRays += 1;
        }
      }
      this.stats.numRaysShot.value++;
    }
  }
  /** Reset convergence state for a new simulation run */
  _resetConvergenceState() {
    const e = Tn(this.frequencies.length);
    this.convergenceMetrics = e.convergenceMetrics, this._energyHistogram = e.energyHistogram, this._lastConvergenceCheck = e.lastConvergenceCheck;
  }
  /** Compute T30 from Schroeder backward integration of the energy histogram */
  _updateConvergenceMetrics() {
    Pn(
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
    this._isRunning = !0, this._cachedAirAtt = Z(this.frequencies, this.temperature), this.mapIntersectableObjects(), this.edgeDiffractionEnabled && this.room ? this._edgeGraph = Cn(this.room.allSurfaces) : this._edgeGraph = null, this.__start_time = Date.now(), this.__num_checked_paths = 0, this._resetConvergenceState(), this.gpuEnabled ? this._startGpuMonteCarlo() : this.startAllMonteCarlo();
  }
  stop() {
    this._isRunning = !1, this.__calc_time = Date.now() - this.__start_time, this._gpuRunning = !1, this._gpuRayTracer && setTimeout(() => this._disposeGpu(), 0), cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => {
      window.clearInterval(e);
    }), this.intervals = [], Object.keys(this.paths).forEach((e) => {
      const t = this.__calc_time / 1e3, r = this.paths[e].length, o = r / t, a = this.__num_checked_paths, i = a / t;
      console.log({
        calc_time: t,
        num_valid_rays: r,
        valid_ray_rate: o,
        num_checks: a,
        check_rate: i
      }), this.paths[e].forEach((s) => {
        s.time = 0, s.totalLength = 0;
        for (let n = 0; n < s.chain.length; n++)
          s.totalLength += s.chain[n].distance, s.time += s.chain[n].distance / this.c;
      });
    }), this.edgeDiffractionEnabled && this._edgeGraph && this._edgeGraph.edges.length > 0 && this._computeDiffractionPaths(), this.mapIntersectableObjects(), this.reportImpulseResponse();
  }
  /** Compute deterministic diffraction paths and inject them into this.paths[] */
  _computeDiffractionPaths() {
    if (!this._edgeGraph) return;
    const e = P.getState().containers, t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const s of this.sourceIDs) {
      const n = e[s];
      if (n) {
        t.set(s, [n.position.x, n.position.y, n.position.z]);
        const l = n.directivityHandler, h = new Array(this.frequencies.length);
        for (let m = 0; m < this.frequencies.length; m++)
          h[m] = l.getPressureAtPosition(0, this.frequencies[m], 0, 0);
        r.set(s, { handler: l, refPressures: h });
      }
    }
    const o = /* @__PURE__ */ new Map();
    for (const s of this.receiverIDs) {
      const n = e[s];
      n && o.set(s, [n.position.x, n.position.y, n.position.z]);
    }
    const a = [];
    this.room.surfaces.traverse((s) => {
      s.kind && s.kind === "surface" && a.push(s.mesh);
    });
    const i = kn(
      this._edgeGraph,
      t,
      o,
      this.frequencies,
      this.c,
      this.temperature,
      this.raycaster,
      a
    );
    for (const s of i) {
      const n = r.get(s.sourceId);
      if (n) {
        const I = t.get(s.sourceId), v = s.diffractionPoint[0] - I[0], R = s.diffractionPoint[1] - I[1], _ = s.diffractionPoint[2] - I[2], S = Math.sqrt(v * v + R * R + _ * _);
        if (S > 1e-10) {
          const A = Math.acos(Math.max(-1, Math.min(1, R / S))) * (180 / Math.PI), D = Math.atan2(_, v) * (180 / Math.PI);
          for (let E = 0; E < this.frequencies.length; E++)
            try {
              const T = n.handler.getPressureAtPosition(0, this.frequencies[E], Math.abs(D), A), w = n.refPressures[E];
              typeof T == "number" && typeof w == "number" && w > 0 && (s.bandEnergy[E] *= (T / w) ** 2);
            } catch {
            }
        }
      }
      const l = s.bandEnergy.reduce((I, v) => I + v, 0) / s.bandEnergy.length, h = o.get(s.receiverId), m = h[0] - s.diffractionPoint[0], d = h[1] - s.diffractionPoint[1], f = h[2] - s.diffractionPoint[2], u = Math.sqrt(m * m + d * d + f * f), p = u > 1e-10 ? [m / u, d / u, f / u] : [0, 0, 1], y = t.get(s.sourceId), g = Math.sqrt(
        (s.diffractionPoint[0] - y[0]) ** 2 + (s.diffractionPoint[1] - y[1]) ** 2 + (s.diffractionPoint[2] - y[2]) ** 2
      ), b = s.totalDistance - g, x = {
        intersectedReceiver: !0,
        chain: [
          {
            distance: g,
            point: s.diffractionPoint,
            object: s.edge.surface0Id,
            faceNormal: s.edge.normal0,
            faceIndex: -1,
            faceMaterialIndex: -1,
            angle: 0,
            energy: l,
            bandEnergy: s.bandEnergy
          },
          {
            distance: b,
            point: h,
            object: s.receiverId,
            faceNormal: [0, 0, 0],
            faceIndex: -1,
            faceMaterialIndex: -1,
            angle: 0,
            energy: l,
            bandEnergy: s.bandEnergy
          }
        ],
        chainLength: 2,
        energy: l,
        bandEnergy: s.bandEnergy,
        time: s.time,
        source: s.sourceId,
        initialPhi: 0,
        initialTheta: 0,
        totalLength: s.totalDistance,
        arrivalDirection: p
      };
      this._pushPathWithEviction(s.receiverId, x);
    }
  }
  async reportImpulseResponse() {
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = P.getState().containers, t = U.sampleRate, r = [];
    for (const o of this.sourceIDs)
      for (const a of this.receiverIDs) {
        if (!this.paths[a] || this.paths[a].length === 0) continue;
        const i = this.paths[a].filter((s) => s.source === o);
        i.length > 0 && r.push({ sourceId: o, receiverId: a, paths: i });
      }
    if (r.length !== 0) {
      $("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let o = 0; o < r.length; o++) {
        const { sourceId: a, receiverId: i, paths: s } = r[o], n = e[a]?.name || "Source", l = e[i]?.name || "Receiver", h = Math.round(o / r.length * 100);
        $("UPDATE_PROGRESS", {
          progress: h,
          message: `Calculating IR: ${n} → ${l}`
        });
        try {
          const { normalizedSignal: m } = await this.calculateImpulseResponseForPair(a, i, s);
          a === this.sourceIDs[0] && i === this.receiverIDs[0] && this.calculateImpulseResponse().then((b) => {
            this.impulseResponse = b;
          }).catch(console.error);
          const d = Wt, f = Math.max(1, Math.floor(m.length / d)), u = [];
          for (let b = 0; b < m.length; b += f)
            u.push({
              time: b / t,
              amplitude: m[b]
            });
          const p = `${this.uuid}-ir-${a}-${i}`, y = Ce.getState().results[p], g = {
            kind: ze.ImpulseResponse,
            name: `IR: ${n} → ${l}`,
            uuid: p,
            from: this.uuid,
            info: {
              sampleRate: t,
              sourceName: n,
              receiverName: l,
              sourceId: a,
              receiverId: i
            },
            data: u
          };
          y ? $("UPDATE_RESULT", { uuid: p, result: g }) : $("ADD_RESULT", g);
        } catch (m) {
          console.error(`Failed to calculate impulse response for ${a} -> ${i}:`, m);
        }
      }
      $("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(e, t, r, o = j, a = this.frequencies, i = U.sampleRate) {
    let s;
    return this.lateReverbTailEnabled && this._energyHistogram[t] && (s = {
      energyHistogram: this._energyHistogram[t],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: a
    }), un(e, t, r, o, a, this.temperature, i, s);
  }
  async calculateImpulseResponseForDisplay(e = j, t = this.frequencies, r = U.sampleRate) {
    let o;
    return this.lateReverbTailEnabled && this.receiverIDs.length > 0 && this._energyHistogram[this.receiverIDs[0]] && (o = {
      energyHistogram: this._energyHistogram[this.receiverIDs[0]],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: t
    }), fn(this.receiverIDs, this.sourceIDs, this.paths, e, t, this.temperature, r, o);
  }
  clearRays() {
    if (this.room)
      for (let e = 0; e < this.room.allSurfaces.length; e++)
        this.room.allSurfaces[e].resetHits();
    this.validRayCount = 0, N.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount), this.rayBufferGeometry.setDrawRange(0, 1), this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !1, this.stats.numRaysShot.value = 0, this.stats.numValidRayPaths.value = 0, X.postMessage("STATS_UPDATE", this.stats), this.sourceIDs.forEach((e) => {
      P.getState().containers[e].numRays = 0;
    }), this.paths = {}, this.mapIntersectableObjects(), N.needsToRender = !0, this.impulseResponse = void 0, this.clearImpulseResponseResults();
  }
  clearImpulseResponseResults() {
    const e = Ce.getState().results;
    Object.keys(e).forEach((t) => {
      const r = e[t];
      r.from === this.uuid && r.kind === ze.ImpulseResponse && $("REMOVE_RESULT", t);
    });
  }
  reflectionLossFunction(e, t, r) {
    return ce(e, t, r);
  }
  calculateReflectionLoss(e = this.frequencies) {
    const [t, r] = pn(this.paths, this.room, this.receiverIDs, e);
    return this.allReceiverData = t, this.chartdata = r, [this.allReceiverData, r];
  }
  getReceiverIntersectionPoints(e) {
    return this.paths && this.paths[e] && this.paths[e].length > 0 ? this.paths[e].map(
      (t) => new B.Vector3().fromArray(t.chain[t.chain.length - 1].point)
    ) : [];
  }
  calculateResponseByIntensity(e = this.frequencies, t = this.temperature) {
    const r = mn(this.indexedPaths, this.receiverIDs, this.sourceIDs, e, t, this.intensitySampleRate);
    return r && (this.responseByIntensity = r), this.responseByIntensity;
  }
  resampleResponseByIntensity(e = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      const t = lt(this.responseByIntensity, e);
      return t && (this.responseByIntensity = t), this.responseByIntensity;
    } else
      console.warn("no data yet");
  }
  calculateT30(e, t) {
    if (this.responseByIntensity) {
      const r = e ? [e] : this.receiverIDs, o = t ? [t] : this.sourceIDs;
      for (const a of r)
        for (const i of o)
          this.responseByIntensity[a]?.[i] && ht(this.responseByIntensity, a, i);
    }
    return this.responseByIntensity;
  }
  calculateT20(e, t) {
    if (this.responseByIntensity) {
      const r = e ? [e] : this.receiverIDs, o = t ? [t] : this.sourceIDs;
      for (const a of r)
        for (const i of o)
          this.responseByIntensity[a]?.[i] && ut(this.responseByIntensity, a, i);
    }
    return this.responseByIntensity;
  }
  calculateT60(e, t) {
    if (this.responseByIntensity) {
      const r = e ? [e] : this.receiverIDs, o = t ? [t] : this.sourceIDs;
      for (const a of r)
        for (const i of o)
          this.responseByIntensity[a]?.[i] && ft(this.responseByIntensity, a, i);
    }
    return this.responseByIntensity;
  }
  onParameterConfigFocus() {
    console.log("focus"), console.log(N.overlays.global.cells), N.overlays.global.showCell(this.uuid + "-valid-ray-count");
  }
  onParameterConfigBlur() {
    console.log("blur"), N.overlays.global.hideCell(this.uuid + "-valid-ray-count");
  }
  pathsToLinearBuffer() {
    return Rn(this.paths);
  }
  linearBufferToPaths(e) {
    return In(e);
  }
  arrivalPressure(e, t, r, o = 1) {
    return Be(e, t, r, o, this.temperature);
  }
  async calculateImpulseResponse(e = j, t = this.frequencies, r = U.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let o = this.paths[this.receiverIDs[0]].sort((m, d) => m.time - d.time);
    const a = o[o.length - 1].time + ee, i = Array(t.length).fill(e), s = Y(r * a) * 2;
    let n = [];
    for (let m = 0; m < t.length; m++)
      n.push(new Float32Array(s));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let u = 0; u < o.length; u++)
        o[u].chainLength - 1 <= this.transitionOrder && o.splice(u, 1);
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
      }, f = new zt(m, !0).returnSortedPathsForHybrid(this.c, i, t);
      for (let u = 0; u < f.length; u++) {
        const p = Ie() ? 1 : -1, y = f[u].time, g = Y(y * r);
        for (let b = 0; b < t.length; b++)
          n[b][g] += f[u].pressure[b] * p;
      }
    }
    const l = P.getState().containers[this.receiverIDs[0]];
    for (let m = 0; m < o.length; m++) {
      const d = Ie() ? 1 : -1, f = o[m].time, u = o[m].arrivalDirection || [0, 0, 1], p = l.getGain(u), y = this.arrivalPressure(i, t, o[m], p).map((b) => b * d), g = Y(f * r);
      for (let b = 0; b < t.length; b++)
        n[b][g] += y[b];
    }
    if (this.lateReverbTailEnabled && this._energyHistogram[this.receiverIDs[0]]) {
      const m = fe(
        this._energyHistogram[this.receiverIDs[0]],
        t,
        this.tailCrossfadeTime,
        this._histogramBinWidth
      ), { tailSamples: d, tailStartSample: f } = de(
        m,
        r
      ), u = Y(this.tailCrossfadeDuration * r);
      n = ge(n, d, f, u);
      const y = n.reduce((g, b) => Math.max(g, b.length), 0) * 2;
      for (let g = 0; g < t.length; g++)
        if (n[g].length < y) {
          const b = new Float32Array(y);
          b.set(n[g]), n[g] = b;
        }
    }
    const h = Re();
    return new Promise((m, d) => {
      h.postMessage({ samples: n }), h.onmessage = (f) => {
        const u = f.data.samples, p = new Float32Array(u[0].length >> 1);
        let y = 0;
        for (let I = 0; I < u.length; I++)
          for (let v = 0; v < p.length; v++)
            p[v] += u[I][v], ae(p[v]) > y && (y = ae(p[v]));
        const g = Pe(p), b = U.createOfflineContext(1, p.length, r), x = U.createBufferSource(g, b);
        x.connect(b.destination), x.start(), U.renderContextAsync(b).then((I) => m(I)).catch(d).finally(() => h.terminate());
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
  async calculateAmbisonicImpulseResponse(e = 1, t = j, r = this.frequencies, o = U.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");
    const a = this.paths[this.receiverIDs[0]].sort((f, u) => f.time - u.time);
    if (a.length === 0) throw Error("No valid ray paths found");
    const i = a[a.length - 1].time + ee;
    if (i <= 0) throw Error("Invalid impulse response duration");
    const s = Array(r.length).fill(t), n = Y(o * i) * 2;
    if (n < 2) throw Error("Impulse response too short to process");
    const l = Ct(e), h = [];
    for (let f = 0; f < r.length; f++) {
      h.push([]);
      for (let u = 0; u < l; u++)
        h[f].push(new Float32Array(n));
    }
    const m = P.getState().containers[this.receiverIDs[0]];
    for (let f = 0; f < a.length; f++) {
      const u = a[f], p = Ie() ? 1 : -1, y = u.time, g = u.arrivalDirection || [0, 0, 1], b = m.getGain(g), x = this.arrivalPressure(s, r, u, b).map((R) => R * p), I = Y(y * o);
      if (I >= n) continue;
      const v = new Float32Array(1);
      for (let R = 0; R < r.length; R++) {
        v[0] = x[R];
        const _ = Bt(v, g[0], g[1], g[2], e, "threejs");
        for (let S = 0; S < l; S++)
          h[R][S][I] += _[S][0];
      }
    }
    if (this.lateReverbTailEnabled && this._energyHistogram[this.receiverIDs[0]]) {
      const f = fe(
        this._energyHistogram[this.receiverIDs[0]],
        r,
        this.tailCrossfadeTime,
        this._histogramBinWidth
      ), { tailSamples: u, tailStartSample: p } = de(
        f,
        o
      ), y = Y(this.tailCrossfadeDuration * o);
      for (let x = 0; x < r.length; x++) {
        const I = [h[x][0]], v = [u[x]], R = ge(I, v, p, y);
        h[x][0] = R[0];
      }
      let g = 0;
      for (let x = 0; x < r.length; x++)
        for (let I = 0; I < l; I++)
          h[x][I].length > g && (g = h[x][I].length);
      const b = g * 2;
      for (let x = 0; x < r.length; x++)
        for (let I = 0; I < l; I++)
          if (h[x][I].length < b) {
            const v = new Float32Array(b);
            v.set(h[x][I]), h[x][I] = v;
          }
    }
    const d = Re();
    return new Promise((f, u) => {
      const p = async (y) => new Promise((g) => {
        const b = [];
        for (let I = 0; I < r.length; I++)
          b.push(h[I][y]);
        const x = Re();
        x.postMessage({ samples: b }), x.onmessage = (I) => {
          const v = I.data.samples, R = new Float32Array(v[0].length >> 1);
          for (let _ = 0; _ < v.length; _++)
            for (let S = 0; S < R.length; S++)
              R[S] += v[_][S];
          x.terminate(), g(R);
        };
      });
      Promise.all(
        Array.from({ length: l }, (y, g) => p(g))
      ).then((y) => {
        let g = 0;
        for (const v of y)
          for (let R = 0; R < v.length; R++)
            ae(v[R]) > g && (g = ae(v[R]));
        if (g > 0)
          for (const v of y)
            for (let R = 0; R < v.length; R++)
              v[R] /= g;
        const b = y[0].length;
        if (b === 0) {
          d.terminate(), u(new Error("Filtered signal has zero length"));
          return;
        }
        const I = U.createOfflineContext(l, b, o).createBuffer(l, b, o);
        for (let v = 0; v < l; v++)
          I.copyToChannel(new Float32Array(y[v]), v);
        d.terminate(), f(I);
      }).catch(u);
    });
  }
  ambisonicImpulseResponse;
  ambisonicOrder = 1;
  impulseResponse;
  impulseResponsePlaying = !1;
  async playImpulseResponse() {
    const e = await _n(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      this.uuid
    );
    this.impulseResponse = e.impulseResponse;
  }
  downloadImpulses(e, t = j, r = tt(125, 8e3), o = 44100) {
    Sn(
      this.paths,
      this.receiverIDs,
      this.sourceIDs,
      (a, i, s, n) => this.arrivalPressure(a, i, s, n),
      e,
      t,
      r,
      o
    );
  }
  async downloadImpulseResponse(e, t = U.sampleRate) {
    const r = await An(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      e,
      t
    );
    this.impulseResponse = r.impulseResponse;
  }
  async downloadAmbisonicImpulseResponse(e, t = 1) {
    const r = await Dn(
      this.ambisonicImpulseResponse,
      (o) => this.calculateAmbisonicImpulseResponse(o),
      this.ambisonicOrder,
      t,
      e
    );
    this.ambisonicImpulseResponse = r.ambisonicImpulseResponse, this.ambisonicOrder = r.ambisonicOrder;
  }
  /**
   * Calculate binaural impulse response from the ambisonic IR using HRTF decoder filters.
   * The ambisonic IR is computed (or cached) first, then optionally rotated by head orientation,
   * and finally decoded to stereo via HRTF convolution.
   */
  async calculateBinauralImpulseResponse(e = 1) {
    return (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder = e), this.binauralImpulseResponse = await Mt({
      ambisonicImpulseResponse: this.ambisonicImpulseResponse,
      order: e,
      hrtfSubjectId: this.hrtfSubjectId,
      headYaw: this.headYaw,
      headPitch: this.headPitch,
      headRoll: this.headRoll
    }), this.binauralImpulseResponse;
  }
  async playBinauralImpulseResponse(e = 1) {
    const t = await wn(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(e),
      this.uuid
    );
    this.binauralImpulseResponse = t.binauralImpulseResponse;
  }
  async downloadBinauralImpulseResponse(e, t = 1) {
    const r = await En(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(t),
      e
    );
    this.binauralImpulseResponse = r.binauralImpulseResponse;
  }
  /** Initialize GPU ray tracer. Returns true on success. */
  async _initGpu() {
    if (!_t())
      return console.warn("[GPU RT] WebGPU not available in this browser"), !1;
    let e = null;
    try {
      return e = new $n(), !await e.initialize(
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
    this._initGpu().then((r) => {
      if (!r || !this._gpuRunning) {
        this._gpuRunning && (console.warn("[GPU RT] Falling back to CPU ray tracing"), this._gpuRunning = !1, this.startAllMonteCarlo());
        return;
      }
      const o = this._gpuRayTracer.effectiveBatchSize, a = new Float32Array(o * e), i = async () => {
        if (!(!this._gpuRunning || !this._isRunning || !this._gpuRayTracer))
          try {
            if (!Number.isFinite(this.gpuBatchSize) || this.gpuBatchSize <= 0) {
              console.warn("[GPU RT] Invalid gpuBatchSize, falling back to CPU"), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
              return;
            }
            const s = Math.min(Math.floor(this.gpuBatchSize), o);
            let n = 0;
            for (let u = 0; u < this.sourceIDs.length && n < s; u++) {
              const p = P.getState().containers[this.sourceIDs[u]], y = p.position, g = p.rotation, b = p.phi, x = p.theta, I = p.directivityHandler, v = this.sourceIDs[u];
              this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
              let R = this._directivityRefPressures.get(v);
              if (!R || R.length !== this.frequencies.length) {
                R = new Array(this.frequencies.length);
                for (let A = 0; A < this.frequencies.length; A++)
                  R[A] = I.getPressureAtPosition(0, this.frequencies[A], 0, 0);
                this._directivityRefPressures.set(v, R);
              }
              const _ = Math.max(1, Math.floor(s / this.sourceIDs.length)), S = new B.Vector3();
              for (let A = 0; A < _ && n < s; A++) {
                const D = Math.random() * b, E = Math.random() * x, T = ye(D, E);
                S.setFromSphericalCoords(1, T[0], T[1]), S.applyEuler(g);
                const w = n * e;
                a[w] = y.x, a[w + 1] = y.y, a[w + 2] = y.z, a[w + 3] = S.x, a[w + 4] = S.y, a[w + 5] = S.z, a[w + 6] = D, a[w + 7] = E;
                for (let O = 0; O < t; O++) {
                  let F = 1;
                  try {
                    const z = I.getPressureAtPosition(0, this.frequencies[O], D, E), M = R[O];
                    typeof z == "number" && typeof M == "number" && M > 0 && (F = (z / M) ** 2);
                  } catch {
                  }
                  a[w + 8 + O] = F;
                }
                n++;
              }
            }
            const l = n, h = Math.floor(Math.random() * 4294967295), m = await this._gpuRayTracer.traceBatch(a, l, h);
            this.__num_checked_paths += l, this.stats.numRaysShot.value += l;
            const d = Math.max(1, Math.floor(l / Math.max(1, this.sourceIDs.length)));
            for (let u = 0; u < m.length; u++) {
              const p = m[u];
              if (!p) continue;
              const y = Math.min(
                Math.floor(u / Math.max(1, d)),
                this.sourceIDs.length - 1
              ), g = this.sourceIDs[y], b = P.getState().containers[g].position;
              p.source = g, this._handleTracedPath(p, b, g);
            }
            this.flushRayBuffer(), N.needsToRender = !0;
            const f = Date.now();
            if (this.autoStop && f - this._lastConvergenceCheck >= this._convergenceCheckInterval && (this._lastConvergenceCheck = f, this._updateConvergenceMetrics(), this.convergenceMetrics.convergenceRatio < this.convergenceThreshold && this.convergenceMetrics.t30Count >= 3)) {
              this.isRunning = !1;
              return;
            }
            this._gpuRunning && this._isRunning && (this._rafId = requestAnimationFrame(() => {
              i();
            }));
          } catch (s) {
            console.error("[GPU RT] Batch error, falling back to CPU:", s), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
          }
      };
      this._rafId = requestAnimationFrame(() => {
        i();
      });
    });
  }
  /** Destroy GPU ray tracer if initialized. */
  _disposeGpu() {
    this._gpuRayTracer && (this._gpuRayTracer.dispose(), this._gpuRayTracer = null);
  }
  get sources() {
    return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => P.getState().containers[e]) : [];
  }
  get receivers() {
    return this.receiverIDs.length > 0 && Object.keys(P.getState().containers).length > 0 ? this.receiverIDs.map((e) => P.getState().containers[e].mesh) : [];
  }
  get room() {
    return P.getState().containers[this.roomID];
  }
  get precheck() {
    return this.sourceIDs.length > 0 && typeof this.room < "u";
  }
  get indexedPaths() {
    const e = {};
    for (const t in this.paths) {
      e[t] = {};
      for (let r = 0; r < this.paths[t].length; r++) {
        const o = this.paths[t][r].source;
        e[t][o] ? e[t][o].push(this.paths[t][r]) : e[t][o] = [this.paths[t][r]];
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
    e != this._raysVisible && (this._raysVisible = e, this.rays.visible = e), N.needsToRender = !0;
  }
  get pointsVisible() {
    return this._pointsVisible;
  }
  set pointsVisible(e) {
    e != this._pointsVisible && (this._pointsVisible = e, this.hits.visible = e), N.needsToRender = !0;
  }
  get invertedDrawStyle() {
    return this._invertedDrawStyle;
  }
  set invertedDrawStyle(e) {
    this._invertedDrawStyle != e && (this._invertedDrawStyle = e, this.hits.material.uniforms.inverted.value = Number(e), this.hits.material.needsUpdate = !0), N.needsToRender = !0;
  }
  get pointSize() {
    return this._pointSize;
  }
  set pointSize(e) {
    Number.isFinite(e) && e > 0 && (this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0), N.needsToRender = !0;
  }
  get runningWithoutReceivers() {
    return this._runningWithoutReceivers;
  }
  set runningWithoutReceivers(e) {
    this.mapIntersectableObjects(), this._runningWithoutReceivers = e;
  }
}
V("RAYTRACER_CALL_METHOD", At);
V("RAYTRACER_SET_PROPERTY", Dt);
V("REMOVE_RAYTRACER", wt);
V("ADD_RAYTRACER", Et(Xn));
V("RAYTRACER_CLEAR_RAYS", (c) => void W.getState().solvers[c].clearRays());
V("RAYTRACER_PLAY_IR", (c) => {
  W.getState().solvers[c].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
V("RAYTRACER_DOWNLOAD_IR", (c) => {
  const e = W.getState().solvers[c], t = P.getState().containers, r = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", o = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", a = `ir-${r}-${o}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(a).catch((i) => {
    window.alert(i.message || "Failed to download impulse response");
  });
});
V("RAYTRACER_DOWNLOAD_IR_OCTAVE", (c) => void W.getState().solvers[c].downloadImpulses(c));
V("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: c, order: e }) => {
  const t = W.getState().solvers[c], r = P.getState().containers, o = t.sourceIDs.length > 0 && r[t.sourceIDs[0]]?.name || "source", a = t.receiverIDs.length > 0 && r[t.receiverIDs[0]]?.name || "receiver", i = `ir-${o}-${a}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(i, e).catch((s) => {
    window.alert(s.message || "Failed to download ambisonic impulse response");
  });
});
V("RAYTRACER_PLAY_BINAURAL_IR", ({ uuid: c, order: e }) => {
  W.getState().solvers[c].playBinauralImpulseResponse(e).catch((r) => {
    window.alert(r.message || "Failed to play binaural impulse response");
  });
});
V("RAYTRACER_DOWNLOAD_BINAURAL_IR", ({ uuid: c, order: e }) => {
  const t = W.getState().solvers[c], r = P.getState().containers, o = t.sourceIDs.length > 0 && r[t.sourceIDs[0]]?.name || "source", a = t.receiverIDs.length > 0 && r[t.receiverIDs[0]]?.name || "receiver", i = `ir-${o}-${a}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadBinauralImpulseResponse(i, e).catch((s) => {
    window.alert(s.message || "Failed to download binaural impulse response");
  });
});
export {
  Jt as CONVERGENCE_CHECK_INTERVAL_MS,
  j as DEFAULT_INITIAL_SPL,
  st as DEFAULT_INTENSITY_SAMPLE_RATE,
  rt as DRAWSTYLE,
  Zt as HISTOGRAM_BIN_WIDTH,
  Kt as HISTOGRAM_NUM_BINS,
  Wt as MAX_DISPLAY_POINTS,
  Qt as MAX_TAIL_END_TIME,
  ve as MIN_TAIL_DECAY_RATE,
  $t as QUICK_ESTIMATE_MAX_ORDER,
  ee as RESPONSE_TIME_PADDING,
  Xt as RT60_DECAY_RATIO,
  Yt as SELF_INTERSECTION_OFFSET,
  Xn as default,
  C as defaults,
  Pe as normalize
};
//# sourceMappingURL=index-CoGv3yer.mjs.map
