import { S as mt } from "./solver-R8BUlJ5R.mjs";
import * as M from "three";
import { computeBoundsTree as yt, disposeBoundsTree as vt, acceleratedRaycast as bt } from "three-mesh-bvh";
import { S as et, u as B, b as xe, L as ae, P as le, I as he, y as Rt, F as It, e as $, z as xt, A as St, r as N, m as X, a as Ce, R as ze, B as _t, C as At, o as H, D as Dt, s as wt, c as Et, d as Tt, f as W } from "./index-WPNQK-eO.mjs";
import { a as V, w as Pt, n as Bt, O as tt } from "./audio-engine-BltQIBir.mjs";
import { a as Z } from "./air-attenuation-CBIk1QMo.mjs";
import { s as nt } from "./sound-speed-Biev-mJ1.mjs";
import { e as Mt, g as Ct } from "./ambisonics.es-Ci32Q6qr.mjs";
import { ImageSourceSolver as zt } from "./index-tQk6FSQk.mjs";
import { p as Ot, d as Nt, a as Ft, b as Lt, c as kt } from "./export-playback-Datwk8y5.mjs";
function Ut(a) {
  return a.reduce((e, t) => e + t);
}
function Gt(a) {
  let e = Ut(a.map((t) => 10 ** (t / 10)));
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
function ye(a, e) {
  let t = (360 - a) * (Math.PI / 180);
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
function qt(a, e) {
  return new jt(a);
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
var rt = /* @__PURE__ */ ((a) => (a[a.ENERGY = 0] = "ENERGY", a[a.ANGLE = 1] = "ANGLE", a[a.ANGLE_ENERGY = 2] = "ANGLE_ENERGY", a))(rt || {});
function Pe(a) {
  let e = Math.abs(a[0]);
  for (let t = 1; t < a.length; t++)
    Math.abs(a[t]) > e && (e = Math.abs(a[t]));
  if (e !== 0)
    for (let t = 0; t < a.length; t++)
      a[t] /= e;
  return a;
}
function en(a) {
  return Math.random() < a;
}
const { abs: tn } = Math, Ne = new M.Vector3(), nn = new M.Vector3(), sn = new M.Vector3(), Fe = new M.Vector3(), J = new M.Vector3(), rn = new M.Vector3(), ne = new M.Vector3(), Q = new M.Plane(), se = new M.Vector4(), Le = new M.Vector4(), ke = new M.Vector4(), Ue = new M.Vector4();
function on(a, e) {
  return a.getPlane(Q), se.set(Q.normal.x, Q.normal.y, Q.normal.z, Q.constant), Le.set(e.a.x, e.a.y, e.a.z, 1), ke.set(e.b.x, e.b.y, e.b.z, 1), Ue.set(e.c.x, e.c.y, e.c.z, 1), se.dot(Le) > 0 || se.dot(ke) > 0 || se.dot(Ue) > 0;
}
function it(a, e, t, r, c, o, i, s, n, l, h, p, d = 1, f = []) {
  i = i.normalize(), a.ray.origin = o, a.ray.direction = i;
  const u = a.intersectObjects(e, !0);
  if (u.length > 0) {
    const m = n.reduce((g, b) => g + b, 0), y = n.length > 0 ? m / n.length : 0;
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
        initialTheta: p,
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
      const S = u[0].distance, D = t.map((E, T) => {
        const w = n[T];
        if (w == null) return 0;
        let O = w * tn(I.reflectionFunction(E, g));
        return O *= Math.pow(10, -r[T] * S / 10), O;
      }), A = Math.max(...D);
      if (x && b && d < s + 1) {
        if (A < c && A > 0) {
          const E = A / c;
          if (Math.random() > E) {
            const T = D.reduce((O, L) => O + L, 0), w = D.length > 0 ? T / D.length : 0;
            return { chain: f, chainLength: f.length, source: l, intersectedReceiver: !1, energy: w, bandEnergy: [...D] };
          }
          for (let T = 0; T < D.length; T++)
            D[T] /= E;
        }
        if (A > 0)
          return it(
            a,
            e,
            t,
            r,
            c,
            rn.copy(u[0].point).addScaledVector(b, Yt),
            x,
            s,
            D,
            l,
            h,
            p,
            d + 1,
            f
          );
      }
    }
    return { chain: f, chainLength: f.length, source: l, intersectedReceiver: !1 };
  }
}
function an(a) {
  var e, t, r = a.length;
  if (r === 1)
    e = 0, t = a[0][1];
  else {
    for (var c = 0, o = 0, i = 0, s = 0, n, l, h, p = 0; p < r; p++)
      n = a[p], l = n[0], h = n[1], c += l, o += h, i += l * l, s += l * h;
    e = (r * s - c * o) / (r * i - c * c), t = o / r - e * c / r;
  }
  return {
    m: e,
    b: t
  };
}
function te(a, e) {
  const t = a.length, r = [];
  for (let n = 0; n < t; n++)
    r.push([a[n], e[n]]);
  const { m: c, b: o } = an(r);
  return { m: c, b: o, fx: (n) => c * n + o, fy: (n) => (n - o) / c };
}
const { log10: cn, pow: Se, floor: ue, max: _e, min: Ae, sqrt: Ge, cos: Ve, PI: He, random: ln } = Math;
function fe(a, e, t, r) {
  const c = e.length, o = [];
  for (let i = 0; i < c; i++) {
    const s = a[i];
    let n = 0;
    for (let v = s.length - 1; v >= 0; v--)
      if (s[v] > 0) {
        n = v;
        break;
      }
    if (n < 2) {
      o.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const l = new Float32Array(n + 1);
    l[n] = s[n];
    for (let v = n - 1; v >= 0; v--)
      l[v] = l[v + 1] + s[v];
    const h = l[0];
    if (h <= 0) {
      o.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const p = h * Se(10, -5 / 10), d = h * Se(10, -35 / 10);
    let f = -1, u = -1;
    for (let v = 0; v <= n; v++)
      f < 0 && l[v] <= p && (f = v), u < 0 && l[v] <= d && (u = v);
    let m = 0, y = 0;
    if (f >= 0 && u > f) {
      const v = [], R = [];
      for (let _ = f; _ <= u; _++) {
        const S = l[_];
        S > 0 && (v.push(_ * r), R.push(10 * cn(S / h)));
      }
      if (v.length >= 2) {
        const S = te(v, R).m;
        S < 0 && (m = S, y = -60 / S);
      }
    }
    m < 0 && m > -ve && (m = -ve, y = 60 / ve);
    let g = t;
    if (g <= 0) {
      const v = _e(1, ue(0.05 / r));
      g = _e(0, n - v) * r;
    }
    const b = Ae(ue(g / r), n), x = b <= n && b >= 0 ? l[b] / h : 0, I = y > 0 ? Ae(g + y, Qt) : g;
    o.push({ t60: y, decayRate: m, crossfadeLevel: x, crossfadeTime: g, endTime: I });
  }
  return o;
}
function de(a, e) {
  let t = 0, r = 1 / 0;
  for (const n of a)
    n.endTime > t && (t = n.endTime), n.crossfadeTime > 0 && n.crossfadeTime < r && (r = n.crossfadeTime);
  if (t <= 0 || !isFinite(r))
    return { tailSamples: a.map(() => new Float32Array(0)), tailStartSample: 0, totalSamples: 0 };
  const c = ue(r * e), o = ue(t * e), i = o - c;
  if (i <= 0)
    return { tailSamples: a.map(() => new Float32Array(0)), tailStartSample: c, totalSamples: o };
  const s = [];
  for (const n of a) {
    const l = new Float32Array(i);
    if (n.decayRate >= 0 || n.crossfadeLevel <= 0) {
      s.push(l);
      continue;
    }
    const h = Ge(n.crossfadeLevel), p = 1 / Ge(3), d = h / p;
    for (let f = 0; f < i; f++) {
      const u = f / e, m = Se(10, n.decayRate * u / 20), y = ln() * 2 - 1;
      l[f] = y * m * d;
    }
    s.push(l);
  }
  return { tailSamples: s, tailStartSample: c, totalSamples: o };
}
function ge(a, e, t, r) {
  const c = a.length, o = [];
  for (let i = 0; i < c; i++) {
    const s = a[i], n = e[i];
    if (!n || n.length === 0) {
      o.push(s);
      continue;
    }
    const l = _e(s.length, t + n.length), h = new Float32Array(l);
    for (let f = 0; f < Ae(t, s.length); f++)
      h[f] = s[f];
    const p = r, d = p > 1 ? p - 1 : 1;
    for (let f = 0; f < p; f++) {
      const u = t + f;
      if (u >= l) break;
      const m = 0.5 * (1 + Ve(He * f / d)), y = 0.5 * (1 - Ve(He * f / d)), g = u < s.length ? s[u] : 0, b = f < n.length ? n[f] : 0;
      h[u] = g * m + b * y;
    }
    for (let f = p; f < n.length; f++) {
      const u = t + f;
      if (u >= l) break;
      h[u] = n[f];
    }
    o.push(h);
  }
  return o;
}
const { floor: K, abs: hn, max: ot } = Math, at = () => Math.random() > 0.5, ct = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
));
function Be(a, e, t, r = 1, c = 20) {
  const o = xe(ae(a));
  if (t.bandEnergy && t.bandEnergy.length === e.length) {
    for (let h = 0; h < e.length; h++)
      o[h] *= t.bandEnergy[h];
    const l = ae(le(he(o)));
    if (r !== 1)
      for (let h = 0; h < l.length; h++) l[h] *= r;
    return l;
  }
  t.chain.slice(0, -1).forEach((l) => {
    const h = B.getState().containers[l.object];
    o.forEach((p, d) => {
      const f = hn(h.reflectionFunction(e[d], l.angle));
      o[d] = p * f;
    });
  });
  const i = le(he(o)), s = Z(e, c);
  e.forEach((l, h) => i[h] -= s[h] * t.totalLength);
  const n = ae(i);
  if (r !== 1)
    for (let l = 0; l < n.length; l++) n[l] *= r;
  return n;
}
async function un(a, e, t, r = j, c, o, i = V.sampleRate, s) {
  if (t.length === 0) throw Error("No rays have been traced for this pair");
  let n = t.sort((m, y) => m.time - y.time);
  const l = n[n.length - 1].time + ee, h = Array(c.length).fill(r), p = K(i * l) * 2;
  let d = [];
  for (let m = 0; m < c.length; m++)
    d.push(new Float32Array(p));
  const f = B.getState().containers[e];
  for (let m = 0; m < n.length; m++) {
    const y = at() ? 1 : -1, g = n[m].time, b = n[m].arrivalDirection || [0, 0, 1], x = f.getGain(b), I = Be(h, c, n[m], x, o).map((R) => R * y), v = K(g * i);
    for (let R = 0; R < c.length; R++)
      d[R][v] += I[R];
  }
  if (s && s.energyHistogram && s.energyHistogram.length > 0) {
    const m = fe(
      s.energyHistogram,
      s.frequencies,
      s.crossfadeTime,
      s.histogramBinWidth
    ), { tailSamples: y, tailStartSample: g } = de(
      m,
      i
    ), b = K(s.crossfadeDuration * i);
    d = ge(d, y, g, b);
    const I = d.reduce((v, R) => ot(v, R.length), 0) * 2;
    for (let v = 0; v < c.length; v++)
      if (d[v].length < I) {
        const R = new Float32Array(I);
        R.set(d[v]), d[v] = R;
      }
  }
  const u = ct();
  return new Promise((m, y) => {
    u.postMessage({ samples: d }), u.onmessage = (g) => {
      const b = g.data.samples, x = new Float32Array(b[0].length >> 1);
      for (let v = 0; v < b.length; v++)
        for (let R = 0; R < x.length; R++)
          x[R] += b[v][R];
      const I = Pe(x.slice());
      u.terminate(), m({ signal: x, normalizedSignal: I });
    }, u.onerror = (g) => {
      u.terminate(), y(g);
    };
  });
}
async function fn(a, e, t, r = j, c, o, i = V.sampleRate, s) {
  if (a.length == 0) throw Error("No receivers have been assigned to the raytracer");
  if (e.length == 0) throw Error("No sources have been assigned to the raytracer");
  if (t[a[0]].length == 0) throw Error("No rays have been traced yet");
  let n = t[a[0]].sort((m, y) => m.time - y.time);
  const l = n[n.length - 1].time + ee, h = Array(c.length).fill(r), p = K(i * l) * 2;
  let d = [];
  for (let m = 0; m < c.length; m++)
    d.push(new Float32Array(p));
  const f = B.getState().containers[a[0]];
  for (let m = 0; m < n.length; m++) {
    const y = at() ? 1 : -1, g = n[m].time, b = n[m].arrivalDirection || [0, 0, 1], x = f.getGain(b), I = Be(h, c, n[m], x, o).map((R) => R * y), v = K(g * i);
    for (let R = 0; R < c.length; R++)
      d[R][v] += I[R];
  }
  if (s && s.energyHistogram && s.energyHistogram.length > 0) {
    const m = fe(
      s.energyHistogram,
      s.frequencies,
      s.crossfadeTime,
      s.histogramBinWidth
    ), { tailSamples: y, tailStartSample: g } = de(
      m,
      i
    ), b = K(s.crossfadeDuration * i);
    d = ge(d, y, g, b);
    const I = d.reduce((v, R) => ot(v, R.length), 0) * 2;
    for (let v = 0; v < c.length; v++)
      if (d[v].length < I) {
        const R = new Float32Array(I);
        R.set(d[v]), d[v] = R;
      }
  }
  const u = ct();
  return new Promise((m, y) => {
    u.postMessage({ samples: d }), u.onmessage = (g) => {
      const b = g.data.samples, x = new Float32Array(b[0].length >> 1);
      for (let v = 0; v < b.length; v++)
        for (let R = 0; R < x.length; R++)
          x[R] += b[v][R];
      const I = Pe(x.slice());
      u.terminate(), m({ signal: x, normalizedSignal: I });
    }, u.onerror = (g) => {
      u.terminate(), y(g);
    };
  });
}
function Me(a, e = 1) {
  let t = a.slice();
  for (let r = 0; r < a.length; r++)
    if (r >= e && r < a.length - e) {
      const c = r - e, o = r + e;
      let i = 0;
      for (let s = c; s < o; s++)
        i += a[s];
      t[r] = i / (2 * e);
    }
  return t;
}
const { floor: dn, abs: gn } = Math;
function ce(a, e, t) {
  const r = e.chain.slice(0, -1);
  if (r && r.length > 0) {
    let c = 1;
    for (let o = 0; o < r.length; o++) {
      const i = r[o], s = a.surfaceMap[i.object], n = i.angle || 0;
      c = c * gn(s.reflectionFunction(t, n));
    }
    return c;
  }
  return 1;
}
function pn(a, e, t, r) {
  const c = [], o = (n, l) => ({ label: n, data: l }), i = [];
  if (r)
    for (let n = 0; n < r.length; n++)
      i.push(o(r[n].toString(), []));
  const s = Object.keys(a);
  for (let n = 0; n < s.length; n++) {
    c.push({
      id: s[n],
      data: []
    });
    for (let l = 0; l < a[s[n]].length; l++) {
      const h = a[s[n]][l];
      let p;
      r ? (p = r.map((d) => ({
        frequency: d,
        value: ce(e, h, d)
      })), r.forEach((d, f) => {
        i[f].data.push([h.time, ce(e, h, d)]);
      })) : p = (d) => ce(e, h, d), c[c.length - 1].data.push({
        time: h.time,
        energy: p
      });
    }
    c[c.length - 1].data = c[c.length - 1].data.sort((l, h) => l.time - h.time);
  }
  for (let n = 0; n < i.length; n++)
    i[n].data = i[n].data.sort((l, h) => l[0] - h[0]), i[n].x = i[n].data.map((l) => l[0]), i[n].y = i[n].data.map((l) => l[1]);
  return [c, i];
}
function mn(a, e, t, r, c, o) {
  const i = a, s = nt(c), n = Z(r, c), l = {};
  for (const h in i) {
    l[h] = {};
    const p = B.getState().containers[h];
    for (const d in i[h]) {
      l[h][d] = {
        freqs: r,
        response: []
      };
      for (let f = 0; f < i[h][d].length; f++) {
        let u = 0, m = [], y = i[h][d][f].initialPhi, g = i[h][d][f].initialTheta, b = B.getState().containers[d].directivityHandler;
        for (let S = 0; S < r.length; S++)
          m[S] = xe(b.getPressureAtPosition(0, r[S], y, g));
        const I = i[h][d][f].arrivalDirection || [0, 0, 1], v = p.getGain(I), R = v * v;
        if (R !== 1)
          for (let S = 0; S < r.length; S++)
            m[S] *= R;
        for (let S = 0; S < i[h][d][f].chain.length; S++) {
          const { angle: D, distance: A } = i[h][d][f].chain[S];
          u += A / s;
          const E = i[h][d][f].chain[S].object, T = B.getState().containers[E] || null;
          for (let w = 0; w < r.length; w++) {
            const O = r[w];
            let L = 1;
            T && T.kind === "surface" && (L = T.reflectionFunction(O, D)), m[w] = xe(
              ae(le(he(m[w] * L)) - n[w] * A)
            );
          }
        }
        const _ = le(he(m));
        l[h][d].response.push({
          time: u,
          level: _,
          bounces: i[h][d][f].chain.length
        });
      }
      l[h][d].response.sort((f, u) => f.time - u.time);
    }
  }
  return lt(l, o);
}
function lt(a, e = st) {
  if (a) {
    for (const t in a)
      for (const r in a[t]) {
        const { response: c, freqs: o } = a[t][r], i = c[c.length - 1].time, s = dn(e * i);
        a[t][r].resampledResponse = Array(o.length).fill(0).map((d) => new Float32Array(s)), a[t][r].sampleRate = e;
        let n = 0, l = [], h = o.map((d) => 0), p = !1;
        for (let d = 0, f = 0; d < s; d++) {
          let u = d / s * i;
          if (c[f] && c[f].time) {
            let m = c[f].time;
            if (m > u) {
              for (let y = 0; y < o.length; y++)
                a[t][r].resampledResponse[y][n] = 0;
              p && l.push(n), n++;
              continue;
            }
            if (m <= u) {
              let y = c[f].level.map((g) => 0);
              for (; m <= u; ) {
                m = c[f].time;
                for (let g = 0; g < o.length; g++)
                  y[g] = Gt([y[g], c[f].level[g]]);
                f++;
              }
              for (let g = 0; g < o.length; g++) {
                if (a[t][r].resampledResponse[g][n] = y[g], l.length > 0) {
                  const b = h[g], x = y[g];
                  for (let I = 0; I < l.length; I++) {
                    const v = Rt(b, x, (I + 1) / (l.length + 1));
                    a[t][r].resampledResponse[g][l[I]] = v;
                  }
                }
                h[g] = y[g];
              }
              l.length > 0 && (l = []), p = !0, n++;
              continue;
            }
          }
        }
        ut(a, t, r), ht(a, t, r), ft(a, t, r);
      }
    return a;
  } else
    console.warn("no data yet");
}
function ht(a, e, t) {
  const r = e, c = t, o = a[r][c].resampledResponse, i = a[r][c].sampleRate;
  if (o && i) {
    const s = new Float32Array(o[0].length);
    for (let n = 0; n < o[0].length; n++)
      s[n] = n / i;
    a[r][c].t30 = o.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const p = h - 30, f = Me(n, 2).filter((u) => u >= p).length;
      return te(s.slice(0, f), n.slice(0, f));
    });
  }
}
function ut(a, e, t) {
  const r = e, c = t, o = a[r][c].resampledResponse, i = a[r][c].sampleRate;
  if (o && i) {
    const s = new Float32Array(o[0].length);
    for (let n = 0; n < o[0].length; n++)
      s[n] = n / i;
    a[r][c].t20 = o.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const p = h - 20, f = Me(n, 2).filter((u) => u >= p).length;
      return te(s.slice(0, f), n.slice(0, f));
    });
  }
}
function ft(a, e, t) {
  const r = e, c = t, o = a[r][c].resampledResponse, i = a[r][c].sampleRate;
  if (o && i) {
    const s = new Float32Array(o[0].length);
    for (let n = 0; n < o[0].length; n++)
      s[n] = n / i;
    a[r][c].t60 = o.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const p = h - 60, f = Me(n, 2).filter((u) => u >= p).length;
      return te(s.slice(0, f), n.slice(0, f));
    });
  }
}
const dt = -2;
function yn(a) {
  const r = (n) => String.fromCharCode(...n), c = (n) => {
    let l = 0;
    const h = r(n.slice(l, l += 36)), p = n[l++], d = n[l++], f = n[l++], u = n[l++], m = n[l++], y = [n[l++], n[l++], n[l++]], g = [n[l++], n[l++], n[l++]];
    return {
      object: h,
      angle: p,
      distance: d,
      energy: f,
      faceIndex: u,
      faceMaterialIndex: m,
      faceNormal: y,
      point: g
    };
  }, o = (n) => {
    const l = [];
    let h = 0;
    for (; h < n.length; ) {
      const p = r(n.slice(h, h += 36)), d = n[h++], f = n[h++], u = !!n[h++], m = n[h++], y = [];
      for (let g = 0; g < d; g++)
        y.push(c(n.slice(h, h += 47)));
      l.push({
        source: p,
        chainLength: d,
        time: f,
        intersectedReceiver: u,
        energy: m,
        chain: y
      });
    }
    return l;
  };
  let i = 0;
  const s = {};
  for (; i < a.length; ) {
    const n = r(a.slice(i, i += 36)), l = a[i++], h = o(a.slice(i, i += l));
    s[n] = h;
  }
  return s;
}
function vn(a) {
  const e = /* @__PURE__ */ new Set();
  for (const n of Object.keys(a)) {
    e.add(n);
    for (const l of a[n]) {
      e.add(l.source);
      for (const h of l.chain)
        e.add(h.object);
    }
  }
  const t = Array.from(e), r = /* @__PURE__ */ new Map();
  for (let n = 0; n < t.length; n++)
    r.set(t[n], n);
  const c = 2 + t.length * 36;
  let o = 0;
  for (const n of Object.keys(a)) {
    o += 2;
    for (const l of a[n])
      o += 5, o += l.chain.length * 12;
  }
  const i = new Float32Array(c + o);
  let s = 0;
  i[s++] = dt, i[s++] = t.length;
  for (const n of t)
    for (let l = 0; l < 36; l++)
      i[s++] = n.charCodeAt(l);
  for (const n of Object.keys(a)) {
    i[s++] = r.get(n);
    let l = 0;
    for (const h of a[n])
      l += 5 + h.chain.length * 12;
    i[s++] = l;
    for (const h of a[n]) {
      i[s++] = r.get(h.source), i[s++] = h.chain.length, i[s++] = h.time, i[s++] = Number(h.intersectedReceiver), i[s++] = h.energy;
      for (const p of h.chain)
        i[s++] = r.get(p.object), i[s++] = p.angle, i[s++] = p.distance, i[s++] = p.energy, i[s++] = p.faceIndex, i[s++] = p.faceMaterialIndex, i[s++] = p.faceNormal[0], i[s++] = p.faceNormal[1], i[s++] = p.faceNormal[2], i[s++] = p.point[0], i[s++] = p.point[1], i[s++] = p.point[2];
    }
  }
  return i;
}
function bn(a) {
  let e = 0;
  e++;
  const t = a[e++];
  if (!Number.isFinite(t) || t < 0 || t !== (t | 0))
    throw new Error("Invalid V2 buffer: bad numUUIDs");
  if (e + t * 36 > a.length)
    throw new Error("Invalid V2 buffer: UUID table exceeds buffer length");
  const r = [];
  for (let o = 0; o < t; o++) {
    const i = [];
    for (let s = 0; s < 36; s++)
      i.push(a[e++]);
    r.push(String.fromCharCode(...i));
  }
  const c = {};
  for (; e < a.length; ) {
    const o = a[e++];
    if (o < 0 || o >= r.length)
      throw new Error("Invalid V2 buffer: receiver index out of range");
    const i = r[o], s = a[e++];
    if (!Number.isFinite(s) || s < 0)
      throw new Error("Invalid V2 buffer: bad pathBufLen");
    const n = Math.min(e + s, a.length), l = [];
    for (; e < n; ) {
      const h = r[a[e++]], p = a[e++], d = a[e++], f = !!a[e++], u = a[e++], m = [];
      for (let y = 0; y < p; y++) {
        const g = r[a[e++]], b = a[e++], x = a[e++], I = a[e++], v = a[e++], R = a[e++], _ = [a[e++], a[e++], a[e++]], S = [a[e++], a[e++], a[e++]];
        m.push({
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
        chainLength: p,
        time: d,
        intersectedReceiver: f,
        energy: u,
        chain: m
      });
    }
    c[i] = l;
  }
  return c;
}
function Rn(a) {
  return vn(a);
}
function In(a) {
  return a.length === 0 ? {} : a[0] === dt ? bn(a) : yn(a);
}
const { floor: je, abs: qe } = Math, xn = () => Math.random() > 0.5, gt = "RAYTRACER_SET_PROPERTY";
function Sn(a, e, t, r, c, o = j, i = tt(125, 8e3), s = 44100) {
  if (e.length === 0) throw Error("No receivers have been assigned to the raytracer");
  if (t.length === 0) throw Error("No sources have been assigned to the raytracer");
  if (a[e[0]].length === 0) throw Error("No rays have been traced yet");
  const n = a[e[0]].sort((m, y) => m.time - y.time), l = n[n.length - 1].time + ee, h = Array(i.length).fill(o), p = je(s * l), d = [];
  for (let m = 0; m < i.length; m++)
    d.push(new Float32Array(p));
  let f = 0;
  const u = B.getState().containers[e[0]];
  for (let m = 0; m < n.length; m++) {
    const y = xn() ? 1 : -1, g = n[m].time, b = n[m].arrivalDirection || [0, 0, 1], x = u.getGain(b), I = r(h, i, n[m], x).map((R) => R * y), v = je(g * s);
    for (let R = 0; R < i.length; R++)
      d[R][v] += I[R], qe(d[R][v]) > f && (f = qe(d[R][v]));
  }
  for (let m = 0; m < i.length; m++) {
    const y = Pt([Bt(d[m])], { sampleRate: s, bitDepth: 32 });
    It.saveAs(y, `${i[m]}_${c}.wav`);
  }
}
async function _n(a, e, t) {
  return Ot(a, e, t, gt);
}
async function An(a, e, t, r) {
  return Nt(a, e, t, r);
}
async function Dn(a, e, t, r = 1, c) {
  return Ft(a, e, t, r, c);
}
async function wn(a, e, t) {
  return Lt(a, e, t, gt);
}
async function En(a, e, t) {
  return kt(a, e, t);
}
async function Tn(a, e) {
  const t = a.sampleRate;
  if (t !== e.sampleRate)
    throw new Error(
      `Sample rate mismatch: ambisonic IR is ${t} Hz but HRTF filters are ${e.sampleRate} Hz`
    );
  const r = Math.min(a.numberOfChannels, e.channelCount);
  if (r === 0)
    throw new Error("No channels to decode");
  const c = a.length + e.filterLength - 1, o = new OfflineAudioContext(2, c, t);
  for (let s = 0; s < r; s++) {
    const n = o.createBuffer(1, a.length, t);
    n.copyToChannel(a.getChannelData(s), 0);
    const l = o.createBufferSource();
    l.buffer = n;
    const h = o.createBuffer(2, e.filterLength, t);
    h.copyToChannel(new Float32Array(e.filtersLeft[s]), 0), h.copyToChannel(new Float32Array(e.filtersRight[s]), 1);
    const p = o.createConvolver();
    p.normalize = !1, p.buffer = h, l.connect(p), p.connect(o.destination), l.start(0);
  }
  return {
    buffer: await o.startRendering(),
    sampleRate: t
  };
}
function Pn(a, e, t, r) {
  if (e === 0 && t === 0 && r === 0)
    return a;
  const c = a.numberOfChannels, o = a.length, i = a.sampleRate;
  if (c < 4)
    throw new Error("Ambisonic rotation requires at least 4 channels (first order)");
  const s = e * Math.PI / 180, n = t * Math.PI / 180, l = r * Math.PI / 180, h = Math.cos(s), p = Math.sin(s), d = Math.cos(n), f = Math.sin(n), u = Math.cos(l), m = Math.sin(l), y = h * u + p * f * m, g = -h * m + p * f * u, b = p * d, x = d * m, I = d * u, v = -f, R = -p * u + h * f * m, _ = p * m + h * f * u, S = h * d, A = new OfflineAudioContext(c, o, i).createBuffer(c, o, i);
  A.copyToChannel(a.getChannelData(0), 0);
  const E = a.getChannelData(1), T = a.getChannelData(2), w = a.getChannelData(3), O = new Float32Array(o), L = new Float32Array(o), z = new Float32Array(o);
  for (let P = 0; P < o; P++) {
    const F = E[P], k = T[P], U = w[P];
    O[P] = y * F + g * k + b * U, L[P] = x * F + I * k + v * U, z[P] = R * F + _ * k + S * U;
  }
  A.copyToChannel(O, 1), A.copyToChannel(L, 2), A.copyToChannel(z, 3);
  for (let P = 4; P < c; P++)
    A.copyToChannel(a.getChannelData(P), P);
  return A;
}
function Bn(a) {
  const e = {
    totalRays: 0,
    validRays: 0,
    estimatedT30: new Array(a).fill(0),
    t30Mean: new Array(a).fill(0),
    t30M2: new Array(a).fill(0),
    t30Count: 0,
    convergenceRatio: 1 / 0
  }, t = {}, r = Date.now();
  return { convergenceMetrics: e, energyHistogram: t, lastConvergenceCheck: r };
}
function Mn(a, e, t, r, c, o, i, s, n) {
  a.totalRays = c, a.validRays = o;
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
  const p = e[h];
  if (!p || p.length === 0) return;
  const d = t.length, f = new Array(d).fill(0);
  for (let g = 0; g < d; g++) {
    const b = p[g];
    let x = 0;
    for (let A = s - 1; A >= 0; A--)
      if (b[A] > 0) {
        x = A;
        break;
      }
    if (x < 2) {
      f[g] = 0;
      continue;
    }
    const I = new Float32Array(x + 1);
    I[x] = b[x];
    for (let A = x - 1; A >= 0; A--)
      I[A] = I[A + 1] + b[A];
    const v = I[0];
    if (v <= 0) {
      f[g] = 0;
      continue;
    }
    const R = v * Math.pow(10, -5 / 10), _ = v * Math.pow(10, -35 / 10);
    let S = -1, D = -1;
    for (let A = 0; A <= x; A++)
      S < 0 && I[A] <= R && (S = A), D < 0 && I[A] <= _ && (D = A);
    if (S >= 0 && D > S) {
      const A = [], E = [];
      for (let T = S; T <= D; T++) {
        const w = I[T];
        w > 0 && (A.push(T * i), E.push(10 * Math.log10(w / v)));
      }
      if (A.length >= 2) {
        const w = te(A, E).m;
        f[g] = w < 0 ? 60 / -w : 0;
      }
    }
  }
  a.estimatedT30 = f, a.t30Count += 1;
  const u = a.t30Count;
  let m = 0, y = 0;
  for (let g = 0; g < d; g++) {
    const b = f[g], x = a.t30Mean[g], I = x + (b - x) / u, R = a.t30M2[g] + (b - x) * (b - I);
    if (a.t30Mean[g] = I, a.t30M2[g] = R, u >= 2 && I > 0) {
      const _ = R / (u - 1), S = Math.sqrt(_) / I;
      S > m && (m = S), y++;
    }
  }
  a.convergenceRatio = y > 0 ? m : 1 / 0, $("RAYTRACER_SET_PROPERTY", {
    uuid: n,
    property: "convergenceMetrics",
    value: { ...a }
  });
}
function Cn(a, e, t, r, c, o, i) {
  if (!a[e]) {
    a[e] = [];
    for (let l = 0; l < r.length; l++)
      a[e].push(new Float32Array(i));
  }
  let s = 0;
  for (let l = 0; l < t.chain.length; l++)
    s += t.chain[l].distance;
  s /= c;
  const n = Math.floor(s / o);
  if (n >= 0 && n < i && t.bandEnergy)
    for (let l = 0; l < r.length; l++)
      a[e][l][n] += t.bandEnergy[l] || 0;
}
function Ye(a, e, t, r) {
  const c = a / r, o = e / r, i = t / r, s = Math.floor(c), n = Math.floor(o), l = Math.floor(i), h = [`${s},${n},${l}`], p = [0, -1, 1];
  for (const d of p)
    for (const f of p)
      for (const u of p) {
        if (d === 0 && f === 0 && u === 0) continue;
        const m = s + d, y = n + f, g = l + u;
        Math.abs(c - (m + 0.5)) < 1 && Math.abs(o - (y + 0.5)) < 1 && Math.abs(i - (g + 0.5)) < 1 && h.push(`${m},${y},${g}`);
      }
  return h;
}
function zn(a, e) {
  return a < e ? `${a}|${e}` : `${e}|${a}`;
}
function On(a, e = 1e-4) {
  const t = xt(e), r = e * 10, c = /* @__PURE__ */ new Map();
  for (const i of a) {
    const s = i.edgeLoop;
    if (!s || s.length < 3) continue;
    const n = [i.normal.x, i.normal.y, i.normal.z];
    for (let l = 0; l < s.length; l++) {
      const h = s[l], p = s[(l + 1) % s.length], d = [h.x, h.y, h.z], f = [p.x, p.y, p.z], u = { start: d, end: f, surfaceId: i.uuid, normal: n }, m = Ye(h.x, h.y, h.z, r), y = Ye(p.x, p.y, p.z, r), g = /* @__PURE__ */ new Set();
      for (const b of m)
        for (const x of y) {
          const I = zn(b, x);
          g.has(I) || (g.add(I), c.has(I) ? c.get(I).push(u) : c.set(I, [u]));
        }
    }
  }
  const o = [];
  for (const [, i] of c) {
    if (i.length !== 2 || i[0].surfaceId === i[1].surfaceId) continue;
    const s = i[0], n = i[1];
    if (!(t(s.start[0], n.start[0]) && t(s.start[1], n.start[1]) && t(s.start[2], n.start[2]) && t(s.end[0], n.end[0]) && t(s.end[1], n.end[1]) && t(s.end[2], n.end[2]) || t(s.start[0], n.end[0]) && t(s.start[1], n.end[1]) && t(s.start[2], n.end[2]) && t(s.end[0], n.start[0]) && t(s.end[1], n.start[1]) && t(s.end[2], n.start[2]))) continue;
    const h = s.end[0] - s.start[0], p = s.end[1] - s.start[1], d = s.end[2] - s.start[2], f = Math.sqrt(h * h + p * p + d * d);
    if (f < e) continue;
    const u = [h / f, p / f, d / f], m = s.normal, y = n.normal, g = m[0] * y[0] + m[1] * y[1] + m[2] * y[2], b = Math.acos(Math.max(-1, Math.min(1, g)));
    if (b < 0.01) continue;
    const I = 2 * Math.PI - b, v = I / Math.PI;
    v <= 1 || o.push({
      start: s.start,
      end: s.end,
      direction: u,
      length: f,
      normal0: m,
      normal1: y,
      surface0Id: s.surfaceId,
      surface1Id: n.surfaceId,
      wedgeAngle: I,
      n: v
    });
  }
  return { edges: o };
}
const { PI: G, sqrt: pe, abs: Nn, cos: De, sin: Fn, atan2: $e } = Math;
function re(a) {
  return a < 0 && (a = 0), 1 - Math.exp(-pe(G * a));
}
function Ln(a, e, t, r, c) {
  const o = a, i = [
    r[0] - t[0],
    r[1] - t[1],
    r[2] - t[2]
  ], s = i[0] * o[0] + i[1] * o[1] + i[2] * o[2], n = [i[0] - s * o[0], i[1] - s * o[1], i[2] - s * o[2]], l = pe(n[0] ** 2 + n[1] ** 2 + n[2] ** 2), h = [
    c[0] - t[0],
    c[1] - t[1],
    c[2] - t[2]
  ], p = h[0] * o[0] + h[1] * o[1] + h[2] * o[2], d = [h[0] - p * o[0], h[1] - p * o[1], h[2] - p * o[2]], f = pe(d[0] ** 2 + d[1] ** 2 + d[2] ** 2);
  if (l < 1e-10 || f < 1e-10)
    return { phiSource: G, phiReceiver: G };
  const u = [n[0] / l, n[1] / l, n[2] / l], m = [d[0] / f, d[1] / f, d[2] / f], y = [-e[0], -e[1], -e[2]], g = [
    o[1] * y[2] - o[2] * y[1],
    o[2] * y[0] - o[0] * y[2],
    o[0] * y[1] - o[1] * y[0]
  ], b = $e(
    u[0] * g[0] + u[1] * g[1] + u[2] * g[2],
    u[0] * y[0] + u[1] * y[1] + u[2] * y[2]
  ), x = $e(
    m[0] * g[0] + m[1] * g[1] + m[2] * g[2],
    m[0] * y[0] + m[1] * y[1] + m[2] * y[2]
  ), I = (v) => {
    let R = v;
    for (; R < 0; ) R += 2 * G;
    return R;
  };
  return {
    phiSource: I(b),
    phiReceiver: I(x)
  };
}
function ie(a, e, t, r, c) {
  const o = t + r * c, i = (G + e * o) / (2 * a), s = Fn(i);
  return Nn(s) < 1e-12 ? 0 : De(i) / s;
}
function kn(a, e, t, r, c, o, i) {
  if (t < 1e-10 || r < 1e-10) return 0;
  const s = 2 * G * a / i;
  if (s < 1e-10) return 0;
  const n = t * r / (t + r), l = (E, T, w, O) => {
    const z = T + w * O, P = Math.round((z + G) / (2 * G * e)), F = Math.round((z - G) / (2 * G * e)), k = 2 * De((2 * G * e * P - z) / 2) ** 2, U = 2 * De((2 * G * e * F - z) / 2) ** 2;
    return E > 0 ? k : U;
  };
  let h = 0;
  const p = l(1, o, -1, c), d = ie(e, 1, o, -1, c), f = re(s * n * p), u = l(-1, o, -1, c), m = ie(e, -1, o, -1, c), y = re(s * n * u), g = l(1, o, 1, c), b = ie(e, 1, o, 1, c), x = re(s * n * g), I = l(-1, o, 1, c), v = ie(e, -1, o, 1, c), R = re(s * n * I), _ = 1 / (2 * e * pe(2 * G * s)), S = d * f + m * y + b * x + v * R;
  h = _ * _ * S * S;
  const D = t, A = D / (r * (r + D));
  return h * A;
}
function Un(a, e, t, r) {
  const c = e[0] - a[0], o = e[1] - a[1], i = e[2] - a[2], s = c * c + o * o + i * i;
  if (s < 1e-20)
    return [...a];
  const n = Math.sqrt(s), l = [c / n, o / n, i / n], h = (y) => {
    const g = a[0] + y * c, b = a[1] + y * o, x = a[2] + y * i, I = Math.sqrt(
      (g - t[0]) ** 2 + (b - t[1]) ** 2 + (x - t[2]) ** 2
    ), v = Math.sqrt(
      (g - r[0]) ** 2 + (b - r[1]) ** 2 + (x - r[2]) ** 2
    );
    if (I < 1e-10 || v < 1e-10) return 0;
    const R = ((g - t[0]) * l[0] + (b - t[1]) * l[1] + (x - t[2]) * l[2]) / I, _ = ((g - r[0]) * l[0] + (b - r[1]) * l[1] + (x - r[2]) * l[2]) / v;
    return R + _;
  };
  let p = 0, d = 1;
  const f = h(p), u = h(d);
  if (f * u > 0) {
    const y = (b) => {
      const x = a[0] + b * c, I = a[1] + b * o, v = a[2] + b * i, R = Math.sqrt(
        (x - t[0]) ** 2 + (I - t[1]) ** 2 + (v - t[2]) ** 2
      ), _ = Math.sqrt(
        (x - r[0]) ** 2 + (I - r[1]) ** 2 + (v - r[2]) ** 2
      );
      return R + _;
    }, g = y(0) < y(1) ? 0 : 1;
    return [
      a[0] + g * c,
      a[1] + g * o,
      a[2] + g * i
    ];
  }
  for (let y = 0; y < 50; y++) {
    const g = (p + d) / 2, b = h(g);
    if (Math.abs(b) < 1e-12) break;
    f * b < 0 ? d = g : p = g;
  }
  const m = (p + d) / 2;
  return [
    a[0] + m * c,
    a[1] + m * o,
    a[2] + m * i
  ];
}
function We(a, e, t, r, c = 0.01) {
  const o = e[0] - a[0], i = e[1] - a[1], s = e[2] - a[2], n = Math.sqrt(o * o + i * i + s * s);
  if (n < c) return !0;
  const l = new M.Vector3(o / n, i / n, s / n), h = new M.Vector3(
    a[0] + l.x * c,
    a[1] + l.y * c,
    a[2] + l.z * c
  );
  t.ray.set(h, l), t.far = n - 2 * c, t.near = 0;
  const p = t.intersectObjects(r, !0);
  return t.far = 1 / 0, p.length === 0;
}
function Gn(a, e, t, r, c, o, i, s) {
  const n = [], l = Z(r, o);
  for (const h of a.edges)
    for (const [p, d] of e)
      for (const [f, u] of t) {
        const m = Un(h.start, h.end, d, u), y = Math.sqrt(
          (m[0] - d[0]) ** 2 + (m[1] - d[1]) ** 2 + (m[2] - d[2]) ** 2
        ), g = Math.sqrt(
          (m[0] - u[0]) ** 2 + (m[1] - u[1]) ** 2 + (m[2] - u[2]) ** 2
        );
        if (y < 1e-6 || g < 1e-6 || !We(d, m, i, s) || !We(m, u, i, s)) continue;
        const { phiSource: b, phiReceiver: x } = Ln(
          h.direction,
          h.normal0,
          m,
          d,
          u
        ), I = y + g, v = I / c, R = new Array(r.length);
        for (let _ = 0; _ < r.length; _++) {
          let S = kn(
            r[_],
            h.n,
            y,
            g,
            b,
            x,
            c
          );
          const D = l[_] * I;
          S *= Math.pow(10, -D / 10), R[_] = S;
        }
        n.push({
          edge: h,
          diffractionPoint: m,
          totalDistance: I,
          time: v,
          bandEnergy: R,
          sourceId: p,
          receiverId: f
        });
      }
  return n;
}
function Vn(a, e, t) {
  const r = a.allSurfaces, c = B.getState().containers, o = [], i = [], s = [], n = [];
  for (let D = 0; D < r.length; D++) {
    const A = r[D];
    o.push(A.uuid);
    const E = A.mesh, T = E.geometry, w = T.getAttribute("position"), O = T.getIndex();
    E.updateMatrixWorld(!0);
    const L = E.matrixWorld;
    if (O)
      for (let z = 0; z < O.count; z += 3) {
        for (let k = 0; k < 3; k++) {
          const U = O.getX(z + k), me = new M.Vector3(
            w.getX(U),
            w.getY(U),
            w.getZ(U)
          ).applyMatrix4(L);
          i.push(me.x, me.y, me.z);
        }
        const P = i.length - 9, F = Xe(
          i[P],
          i[P + 1],
          i[P + 2],
          i[P + 3],
          i[P + 4],
          i[P + 5],
          i[P + 6],
          i[P + 7],
          i[P + 8]
        );
        s.push(F[0], F[1], F[2]), n.push(D);
      }
    else
      for (let z = 0; z < w.count; z += 3) {
        for (let k = 0; k < 3; k++) {
          const U = new M.Vector3(
            w.getX(z + k),
            w.getY(z + k),
            w.getZ(z + k)
          ).applyMatrix4(L);
          i.push(U.x, U.y, U.z);
        }
        const P = i.length - 9, F = Xe(
          i[P],
          i[P + 1],
          i[P + 2],
          i[P + 3],
          i[P + 4],
          i[P + 5],
          i[P + 6],
          i[P + 7],
          i[P + 8]
        );
        s.push(F[0], F[1], F[2]), n.push(D);
      }
  }
  const l = n.length, h = new Float32Array(i), p = new Float32Array(s), d = new Uint32Array(n), f = new Float32Array(l * 3);
  for (let D = 0; D < l; D++) {
    const A = D * 9;
    f[D * 3] = (h[A] + h[A + 3] + h[A + 6]) / 3, f[D * 3 + 1] = (h[A + 1] + h[A + 4] + h[A + 7]) / 3, f[D * 3 + 2] = (h[A + 2] + h[A + 5] + h[A + 8]) / 3;
  }
  const u = new Uint32Array(l);
  for (let D = 0; D < l; D++) u[D] = D;
  const m = we(h, f, u, 0, l, 0), y = new Float32Array(l * 9), g = new Float32Array(l * 3), b = new Uint32Array(l);
  for (let D = 0; D < l; D++) {
    const A = u[D];
    y.set(h.subarray(A * 9, A * 9 + 9), D * 9), g.set(p.subarray(A * 3, A * 3 + 3), D * 3), b[D] = d[A];
  }
  const { nodeArray: x, nodeCount: I } = qn(m), v = t.length, R = new Float32Array(r.length * v * 2);
  for (let D = 0; D < r.length; D++) {
    const A = r[D];
    for (let E = 0; E < v; E++) {
      const T = (D * v + E) * 2;
      R[T] = A.absorptionFunction(t[E]), R[T + 1] = A.scatteringFunction(t[E]);
    }
  }
  const _ = [], S = [];
  for (const D of e) {
    const A = c[D];
    if (A) {
      _.push(D);
      const E = 0.1, T = A.scale, w = Math.max(Math.abs(T.x), Math.abs(T.y), Math.abs(T.z));
      S.push(A.position.x, A.position.y, A.position.z, E * w);
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
    surfaceUuidMap: o,
    receiverUuidMap: _
  };
}
const Hn = 8, jn = 64;
function we(a, e, t, r, c, o) {
  let i = 1 / 0, s = 1 / 0, n = 1 / 0, l = -1 / 0, h = -1 / 0, p = -1 / 0;
  for (let _ = r; _ < c; _++) {
    const S = t[_];
    for (let D = 0; D < 3; D++) {
      const A = S * 9 + D * 3, E = a[A], T = a[A + 1], w = a[A + 2];
      E < i && (i = E), E > l && (l = E), T < s && (s = T), T > h && (h = T), w < n && (n = w), w > p && (p = w);
    }
  }
  const d = c - r;
  if (d <= Hn || o >= jn)
    return { boundsMin: [i, s, n], boundsMax: [l, h, p], left: null, right: null, triStart: r, triCount: d };
  const f = l - i, u = h - s, m = p - n, y = f >= u && f >= m ? 0 : u >= m ? 1 : 2;
  let g = 1 / 0, b = -1 / 0;
  for (let _ = r; _ < c; _++) {
    const S = e[t[_] * 3 + y];
    S < g && (g = S), S > b && (b = S);
  }
  const x = (g + b) * 0.5;
  let I = r;
  for (let _ = r; _ < c; _++)
    if (e[t[_] * 3 + y] < x) {
      const S = t[I];
      t[I] = t[_], t[_] = S, I++;
    }
  (I === r || I === c) && (I = r + c >> 1);
  const v = we(a, e, t, r, I, o + 1), R = we(a, e, t, I, c, o + 1);
  return { boundsMin: [i, s, n], boundsMax: [l, h, p], left: v, right: R, triStart: -1, triCount: -1 };
}
function qn(a) {
  let e = 0;
  const t = [a];
  for (; t.length > 0; ) {
    const i = t.pop();
    e++, i.left && t.push(i.left), i.right && t.push(i.right);
  }
  const r = new Float32Array(e * 8);
  let c = 0;
  function o(i) {
    const s = c++, n = s * 8;
    r[n] = i.boundsMin[0], r[n + 1] = i.boundsMin[1], r[n + 2] = i.boundsMin[2], r[n + 4] = i.boundsMax[0], r[n + 5] = i.boundsMax[1], r[n + 6] = i.boundsMax[2];
    const l = new Uint32Array(r.buffer);
    if (i.left && i.right) {
      const h = o(i.left), p = o(i.right);
      l[n + 3] = h, l[n + 7] = p;
    } else
      l[n + 3] = i.triStart, l[n + 7] = (i.triCount | 2147483648) >>> 0;
    return s;
  }
  return o(a), { nodeArray: r, nodeCount: e };
}
function Xe(a, e, t, r, c, o, i, s, n) {
  const l = r - a, h = c - e, p = o - t, d = i - a, f = s - e, u = n - t;
  let m = h * u - p * f, y = p * d - l * u, g = l * f - h * d;
  const b = Math.sqrt(m * m + y * y + g * g);
  return b > 1e-10 && (m /= b, y /= b, g /= b), [m, y, g];
}
const Yn = `// ─── GPU Ray Tracer Compute Shader ───────────────────────────────────
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
`, q = 64, Ze = 7, $n = 64, pt = 16, Ke = pt * 4, Ee = 16, Je = Ee * 4, Te = 16, be = Te * 4, Wn = 20, Qe = Wn * 4;
class Xn {
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
  async initialize(e, t, r, c) {
    const o = await St();
    if (!o) return !1;
    this.device = o.device, this.config = r;
    const i = o.device.limits.maxStorageBufferBindingSize, s = o.device.limits.maxBufferSize, n = q * be, l = Math.floor(Math.min(i, s) / n);
    if (l < 1)
      return console.error("[GPU RT] Device storage limits too small for even a single ray chain buffer"), !1;
    const h = Math.max(1, c), p = Math.min(h, l);
    p < h && console.warn(`[GPU RT] batchSize ${h} exceeds device limits; clamped to ${p}`), this.maxBatchSize = p, r.reflectionOrder > q && console.warn(`[GPU RT] reflectionOrder ${r.reflectionOrder} clamped to ${q}`);
    const d = r.frequencies.slice(0, Ze);
    this.sceneBuf = Vn(e, t, d), this.gpuBvhNodes = this.createStorageBuffer(this.sceneBuf.bvhNodes), this.gpuTriVerts = this.createStorageBuffer(this.sceneBuf.triangleVertices), this.gpuTriSurfIdx = this.createStorageBuffer(new Uint32Array(this.sceneBuf.triangleSurfaceIndex)), this.gpuTriNormals = this.createStorageBuffer(this.sceneBuf.triangleNormals), this.gpuSurfAcoustic = this.createStorageBuffer(this.sceneBuf.surfaceAcousticData);
    const f = this.sceneBuf.receiverSpheres.length > 0 ? this.sceneBuf.receiverSpheres : new Float32Array(4);
    this.gpuReceiverSpheres = this.createStorageBuffer(f);
    const u = p * Ke, m = p * Je, y = p * q * be;
    this.gpuRayInputs = this.device.createBuffer({
      size: u,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    }), this.gpuRayOutputs = this.device.createBuffer({
      size: m,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    }), this.gpuChainBuffer = this.device.createBuffer({
      size: y,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    }), this.gpuParams = this.device.createBuffer({
      size: Qe,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackOutput = this.device.createBuffer({
      size: m,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackChain = this.device.createBuffer({
      size: y,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    const g = this.device.createShaderModule({ code: Yn });
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
    const c = Math.min(this.config.frequencies.length, Ze), o = new ArrayBuffer(Qe), i = new Uint32Array(o), s = new Float32Array(o);
    i[0] = t, i[1] = Math.min(this.config.reflectionOrder, q), i[2] = c, i[3] = this.sceneBuf.receiverCount, i[4] = this.sceneBuf.triangleCount, i[5] = this.sceneBuf.nodeCount, i[6] = this.sceneBuf.surfaceCount, i[7] = r, s[8] = this.config.rrThreshold;
    for (let y = 0; y < c; y++)
      s[12 + y] = this.config.cachedAirAtt[y];
    this.device.queue.writeBuffer(this.gpuParams, 0, o), this.device.queue.writeBuffer(
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
    }), l = Math.ceil(t / $n), h = this.device.createCommandEncoder(), p = h.beginComputePass();
    p.setPipeline(this.pipeline), p.setBindGroup(0, n), p.dispatchWorkgroups(l), p.end();
    const d = t * Je, f = t * q * be;
    h.copyBufferToBuffer(this.gpuRayOutputs, 0, this.gpuReadbackOutput, 0, d), h.copyBufferToBuffer(this.gpuChainBuffer, 0, this.gpuReadbackChain, 0, f), this.device.queue.submit([h.finish()]), await this.gpuReadbackOutput.mapAsync(GPUMapMode.READ, 0, d), await this.gpuReadbackChain.mapAsync(GPUMapMode.READ, 0, f);
    const u = new Float32Array(this.gpuReadbackOutput.getMappedRange(0, d).slice(0)), m = new Float32Array(this.gpuReadbackChain.getMappedRange(0, f).slice(0));
    return this.gpuReadbackOutput.unmap(), this.gpuReadbackChain.unmap(), this.parseResults(u, m, e, t, c);
  }
  parseResults(e, t, r, c, o) {
    const i = new Array(c), s = this.sceneBuf;
    for (let n = 0; n < c; n++) {
      const l = n * Ee, h = new Uint32Array(e.buffer, l * 4, Ee), p = h[0], d = h[1] !== 0;
      if (p === 0) {
        i[n] = null;
        continue;
      }
      const f = [
        e[l + 3],
        e[l + 4],
        e[l + 5]
      ], u = [];
      for (let R = 0; R < o; R++)
        u.push(e[l + 8 + R]);
      const m = [], y = n * q;
      for (let R = 0; R < p; R++) {
        const _ = (y + R) * Te, S = new Uint32Array(t.buffer, _ * 4, Te), D = t[_], A = t[_ + 1], E = t[_ + 2], T = t[_ + 3], w = S[4], O = t[_ + 6], L = t[_ + 7], z = [];
        for (let F = 0; F < o; F++)
          z.push(t[_ + 8 + F]);
        let P;
        if (w >= s.surfaceCount) {
          const F = w - s.surfaceCount;
          P = s.receiverUuidMap[F] ?? "";
        } else
          P = s.surfaceUuidMap[w] ?? "";
        m.push({
          point: [D, A, E],
          distance: T,
          object: P,
          faceNormal: [0, 0, 0],
          faceIndex: -1,
          faceMaterialIndex: -1,
          angle: O,
          energy: L,
          bandEnergy: z
        });
      }
      const g = n * pt, b = r[g + 6], x = r[g + 7], I = u.reduce((R, _) => R + _, 0), v = o > 0 ? I / o : 0;
      i[n] = {
        intersectedReceiver: d,
        chain: m,
        chainLength: m.length,
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
)), { floor: Y, random: Zn, abs: oe } = Math, Ie = () => Zn() > 0.5;
M.BufferGeometry.prototype.computeBoundsTree = yt;
M.BufferGeometry.prototype.disposeBoundsTree = vt;
M.Mesh.prototype.raycast = bt;
class Kn extends mt {
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
    const c = typeof e.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = c ? e.invertedDrawStyle : C.invertedDrawStyle, this.passes = e.passes || C.passes, this.raycaster = new M.Raycaster(), this.rayBufferGeometry = new M.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new M.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(M.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new M.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(M.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.convergenceThreshold = e.convergenceThreshold ?? C.convergenceThreshold, this.autoStop = e.autoStop ?? C.autoStop, this.rrThreshold = e.rrThreshold ?? C.rrThreshold, this.maxStoredPaths = e.maxStoredPaths ?? C.maxStoredPaths, this.edgeDiffractionEnabled = e.edgeDiffractionEnabled ?? C.edgeDiffractionEnabled, this.lateReverbTailEnabled = e.lateReverbTailEnabled ?? C.lateReverbTailEnabled, this.tailCrossfadeTime = e.tailCrossfadeTime ?? C.tailCrossfadeTime, this.tailCrossfadeDuration = e.tailCrossfadeDuration ?? C.tailCrossfadeDuration, this.gpuEnabled = e.gpuEnabled ?? C.gpuEnabled, this.gpuBatchSize = e.gpuBatchSize ?? C.gpuBatchSize, this.hrtfSubjectId = e.hrtfSubjectId ?? "D1", this.headYaw = e.headYaw ?? 0, this.headPitch = e.headPitch ?? 0, this.headRoll = e.headRoll ?? 0, this._edgeGraph = null, this._histogramBinWidth = Zt, this._histogramNumBins = Kt, this._convergenceCheckInterval = Jt, this._resetConvergenceState(), this.rays = new M.LineSegments(
      this.rayBufferGeometry,
      new M.LineBasicMaterial({
        fog: !1,
        color: 2631977,
        transparent: !0,
        opacity: 0.2,
        premultipliedAlpha: !0,
        blending: M.NormalBlending,
        depthFunc: M.AlwaysDepth,
        name: "raytracer-rays-material"
        // depthTest: false
      })
    ), this.rays.renderOrder = -0.5, this.rays.frustumCulled = !1, N.scene.add(this.rays);
    var o = new M.ShaderMaterial({
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
      blending: M.NormalBlending,
      name: "raytracer-points-material"
    });
    this.hits = new M.Points(this.rayBufferGeometry, o), this.hits.frustumCulled = !1, N.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
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
      autoCalculate: c,
      roomID: o,
      sourceIDs: i,
      surfaceIDs: s,
      receiverIDs: n,
      updateInterval: l,
      passes: h,
      pointSize: p,
      reflectionOrder: d,
      runningWithoutReceivers: f,
      raysVisible: u,
      pointsVisible: m,
      invertedDrawStyle: y,
      plotStyle: g,
      paths: b,
      frequencies: x,
      convergenceThreshold: I,
      autoStop: v,
      rrThreshold: R,
      maxStoredPaths: _,
      edgeDiffractionEnabled: S,
      lateReverbTailEnabled: D,
      tailCrossfadeTime: A,
      tailCrossfadeDuration: E,
      gpuEnabled: T,
      gpuBatchSize: w,
      hrtfSubjectId: O,
      headYaw: L,
      headPitch: z,
      headRoll: P
    } = this;
    return {
      name: e,
      kind: t,
      uuid: r,
      autoCalculate: c,
      roomID: o,
      sourceIDs: i,
      surfaceIDs: s,
      receiverIDs: n,
      updateInterval: l,
      passes: h,
      pointSize: p,
      reflectionOrder: d,
      runningWithoutReceivers: f,
      raysVisible: u,
      pointsVisible: m,
      invertedDrawStyle: y,
      plotStyle: g,
      paths: b,
      frequencies: x,
      convergenceThreshold: I,
      autoStop: v,
      rrThreshold: R,
      maxStoredPaths: _,
      edgeDiffractionEnabled: S,
      lateReverbTailEnabled: D,
      tailCrossfadeTime: A,
      tailCrossfadeDuration: E,
      gpuEnabled: T,
      gpuBatchSize: w,
      hrtfSubjectId: O,
      headYaw: L,
      headPitch: z,
      headRoll: P
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
    this.hits.material.uniforms.drawStyle.value = e, this.hits.material.needsUpdate = !0, N.needsToRender = !0;
  }
  setPointScale(e) {
    this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0, N.needsToRender = !0;
  }
  incrementRayPositionIndex() {
    return this.rayPositionIndex < this.maxrays ? this.rayPositionIndex++ : (this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !0, this.rayPositionIndex);
  }
  rayPositionIndexDidOverflow = !1;
  appendRay(e, t, r = 1, c = 1) {
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, r, c), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, r, c), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex);
  }
  flushRayBuffer() {
    this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
  }
  inFrontOf(e, t) {
    return on(e, t);
  }
  traceRay(e, t, r, c, o, i, s, n = 1, l = []) {
    return it(
      this.raycaster,
      this.intersectableObjects,
      this.frequencies,
      this._cachedAirAtt,
      this.rrThreshold,
      e,
      t,
      r,
      c,
      o,
      i,
      s,
      n,
      l
    );
  }
  startQuickEstimate(e = this.frequencies, t = 1e3) {
    const r = this.runningWithoutReceivers;
    this.runningWithoutReceivers = !0;
    let c = 0;
    this.quickEstimateResults = {}, this.sourceIDs.forEach((o) => {
      this.quickEstimateResults[o] = [];
    }), this.intervals.push(
      window.setInterval(() => {
        for (let o = 0; o < this.passes; o++, c++)
          for (let i = 0; i < this.sourceIDs.length; i++) {
            const s = this.sourceIDs[i], n = B.getState().containers[s];
            this.quickEstimateResults[s].push(this.quickEstimateStep(n, e, t));
          }
        c >= t ? (this.intervals.forEach((o) => window.clearInterval(o)), this.runningWithoutReceivers = r, console.log(this.quickEstimateResults)) : console.log((c / t * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(e, t, r) {
    const c = this.c, o = Array(t.length).fill(0);
    let i = e.position.clone(), s, n, l, h;
    do
      s = Math.random() * 2 - 1, n = Math.random() * 2 - 1, l = Math.random() * 2 - 1, h = s * s + n * n + l * l;
    while (h > 1 || h < 1e-6);
    let p = new M.Vector3(s, n, l).normalize(), d = 0;
    const f = Array(t.length).fill(e.initialIntensity);
    let u = 0;
    const m = $t;
    let y = !1, g = 0;
    Z(t, this.temperature);
    let b = {};
    for (; !y && u < m; ) {
      this.raycaster.ray.set(i, p);
      const x = this.raycaster.intersectObjects(this.intersectableObjects, !0);
      if (x.length > 0) {
        d = p.clone().multiplyScalar(-1).angleTo(x[0].face.normal), g += x[0].distance;
        const I = x[0].object.parent;
        for (let R = 0; R < t.length; R++) {
          const _ = t[R];
          let S = 1;
          I.kind === "surface" && (S = I.reflectionFunction(_, d)), f[R] *= S;
          const D = e.initialIntensity / f[R] > Xt;
          D && (o[R] = g / c), y = y || D;
        }
        x[0].object.parent instanceof et && (x[0].object.parent.numHits += 1);
        const v = x[0].face.normal.normalize();
        p.sub(v.clone().multiplyScalar(p.dot(v)).multiplyScalar(2)).normalize(), i.copy(x[0].point), b = x[0];
      }
      u += 1;
    }
    return this.stats.numRaysShot.value++, {
      distance: g,
      rt60s: o,
      angle: d,
      direction: p,
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
      const c = Date.now();
      if (this.autoStop && c - this._lastConvergenceCheck >= this._convergenceCheckInterval && (this._lastConvergenceCheck = c, this._updateConvergenceMetrics(), this.convergenceMetrics.convergenceRatio < this.convergenceThreshold && this.convergenceMetrics.t30Count >= 3)) {
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
    for (let c = 0; c < this.sourceIDs.length; c++) {
      const o = B.getState().containers[this.sourceIDs[c]], i = o.phi, s = o.theta, n = o.position, l = o.rotation, h = o.directivityHandler;
      this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
      const p = this.sourceIDs[c];
      let d = this._directivityRefPressures.get(p);
      if (!d || d.length !== this.frequencies.length) {
        d = new Array(this.frequencies.length);
        for (let f = 0; f < this.frequencies.length; f++)
          d[f] = h.getPressureAtPosition(0, this.frequencies[f], 0, 0);
        this._directivityRefPressures.set(p, d);
      }
      for (let f = 0; f < t; f++)
        for (let u = 0; u < r; u++) {
          this.__num_checked_paths += 1;
          const m = (f + Math.random()) / t * i, y = (u + Math.random()) / r * s;
          let g = ye(m, y);
          const b = new M.Vector3().setFromSphericalCoords(1, g[0], g[1]);
          b.applyEuler(l);
          const x = new Array(this.frequencies.length);
          for (let v = 0; v < this.frequencies.length; v++) {
            let R = 1;
            try {
              const _ = h.getPressureAtPosition(0, this.frequencies[v], m, y), S = d[v];
              typeof _ == "number" && typeof S == "number" && S > 0 && (R = (_ / S) ** 2);
            } catch {
            }
            x[v] = R;
          }
          const I = this.traceRay(n, b, this.reflectionOrder, x, p, m, y);
          I && this._handleTracedPath(I, n, p), this.stats.numRaysShot.value++;
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
      for (let o = 1; o < e.chain.length; o++)
        this.appendRay(e.chain[o - 1].point, e.chain[o].point, e.chain[o].energy || 1, e.chain[o].angle);
      const c = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(c, e), B.getState().containers[r].numRays += 1;
    } else if (e.intersectedReceiver) {
      this.appendRay(
        [t.x, t.y, t.z],
        e.chain[0].point,
        e.chain[0].energy || 1,
        e.chain[0].angle
      );
      for (let o = 1; o < e.chain.length; o++)
        this.appendRay(e.chain[o - 1].point, e.chain[o].point, e.chain[o].energy || 1, e.chain[o].angle);
      this.stats.numValidRayPaths.value++, this.validRayCount += 1, N.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
      const c = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(c, e), B.getState().containers[r].numRays += 1, this._addToEnergyHistogram(c, e);
    }
  }
  /** Push a path onto the paths array, evicting oldest if over maxStoredPaths */
  _pushPathWithEviction(e, t) {
    const r = Math.max(1, this.maxStoredPaths | 0);
    if (!this.paths[e]) {
      this.paths[e] = [t];
      return;
    }
    const c = this.paths[e];
    if (c.length >= r) {
      const o = c.length - r + 1;
      o > 0 && c.splice(0, o);
    }
    c.push(t);
  }
  /** Add a ray path's energy to the convergence histogram */
  _addToEnergyHistogram(e, t) {
    Cn(this._energyHistogram, e, t, this.frequencies, this.c, this._histogramBinWidth, this._histogramNumBins);
  }
  step() {
    for (let e = 0; e < this.sourceIDs.length; e++) {
      this.__num_checked_paths += 1;
      const t = Math.random() * B.getState().containers[this.sourceIDs[e]].theta, r = Math.random() * B.getState().containers[this.sourceIDs[e]].phi, c = B.getState().containers[this.sourceIDs[e]].position, o = B.getState().containers[this.sourceIDs[e]].rotation;
      let i = ye(r, t);
      const s = new M.Vector3().setFromSphericalCoords(1, i[0], i[1]);
      s.applyEuler(o);
      const n = B.getState().containers[this.sourceIDs[e]].directivityHandler;
      this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
      const l = this.sourceIDs[e];
      let h = this._directivityRefPressures.get(l);
      if (!h || h.length !== this.frequencies.length) {
        h = new Array(this.frequencies.length);
        for (let f = 0; f < this.frequencies.length; f++)
          h[f] = n.getPressureAtPosition(0, this.frequencies[f], 0, 0);
        this._directivityRefPressures.set(l, h);
      }
      const p = new Array(this.frequencies.length);
      for (let f = 0; f < this.frequencies.length; f++) {
        let u = 1;
        try {
          const m = n.getPressureAtPosition(0, this.frequencies[f], r, t), y = h[f];
          typeof m == "number" && typeof y == "number" && y > 0 && (u = (m / y) ** 2);
        } catch {
        }
        p[f] = u;
      }
      const d = this.traceRay(c, s, this.reflectionOrder, p, this.sourceIDs[e], r, t);
      if (d) {
        if (this._runningWithoutReceivers) {
          this.appendRay(
            [c.x, c.y, c.z],
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
          this._pushPathWithEviction(f, d), B.getState().containers[this.sourceIDs[e]].numRays += 1;
        } else if (d.intersectedReceiver) {
          this.appendRay(
            [c.x, c.y, c.z],
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
          this._pushPathWithEviction(f, d), B.getState().containers[this.sourceIDs[e]].numRays += 1;
        }
      }
      this.stats.numRaysShot.value++;
    }
  }
  /** Reset convergence state for a new simulation run */
  _resetConvergenceState() {
    const e = Bn(this.frequencies.length);
    this.convergenceMetrics = e.convergenceMetrics, this._energyHistogram = e.energyHistogram, this._lastConvergenceCheck = e.lastConvergenceCheck;
  }
  /** Compute T30 from Schroeder backward integration of the energy histogram */
  _updateConvergenceMetrics() {
    Mn(
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
    this._isRunning = !0, this._cachedAirAtt = Z(this.frequencies, this.temperature), this.mapIntersectableObjects(), this.edgeDiffractionEnabled && this.room ? this._edgeGraph = On(this.room.allSurfaces) : this._edgeGraph = null, this.__start_time = Date.now(), this.__num_checked_paths = 0, this._resetConvergenceState(), this.gpuEnabled ? this._startGpuMonteCarlo() : this.startAllMonteCarlo();
  }
  stop() {
    this._isRunning = !1, this.__calc_time = Date.now() - this.__start_time, this._gpuRunning = !1, this._gpuRayTracer && setTimeout(() => this._disposeGpu(), 0), cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => {
      window.clearInterval(e);
    }), this.intervals = [], Object.keys(this.paths).forEach((e) => {
      const t = this.__calc_time / 1e3, r = this.paths[e].length, c = r / t, o = this.__num_checked_paths, i = o / t;
      console.log({
        calc_time: t,
        num_valid_rays: r,
        valid_ray_rate: c,
        num_checks: o,
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
    const e = B.getState().containers, t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const s of this.sourceIDs) {
      const n = e[s];
      if (n) {
        t.set(s, [n.position.x, n.position.y, n.position.z]);
        const l = n.directivityHandler, h = new Array(this.frequencies.length);
        for (let p = 0; p < this.frequencies.length; p++)
          h[p] = l.getPressureAtPosition(0, this.frequencies[p], 0, 0);
        r.set(s, { handler: l, refPressures: h });
      }
    }
    const c = /* @__PURE__ */ new Map();
    for (const s of this.receiverIDs) {
      const n = e[s];
      n && c.set(s, [n.position.x, n.position.y, n.position.z]);
    }
    const o = [];
    this.room.surfaces.traverse((s) => {
      s.kind && s.kind === "surface" && o.push(s.mesh);
    });
    const i = Gn(
      this._edgeGraph,
      t,
      c,
      this.frequencies,
      this.c,
      this.temperature,
      this.raycaster,
      o
    );
    for (const s of i) {
      const n = r.get(s.sourceId);
      if (n) {
        const I = t.get(s.sourceId), v = s.diffractionPoint[0] - I[0], R = s.diffractionPoint[1] - I[1], _ = s.diffractionPoint[2] - I[2], S = Math.sqrt(v * v + R * R + _ * _);
        if (S > 1e-10) {
          const D = Math.acos(Math.max(-1, Math.min(1, R / S))) * (180 / Math.PI), A = Math.atan2(_, v) * (180 / Math.PI);
          for (let E = 0; E < this.frequencies.length; E++)
            try {
              const T = n.handler.getPressureAtPosition(0, this.frequencies[E], Math.abs(A), D), w = n.refPressures[E];
              typeof T == "number" && typeof w == "number" && w > 0 && (s.bandEnergy[E] *= (T / w) ** 2);
            } catch {
            }
        }
      }
      const l = s.bandEnergy.reduce((I, v) => I + v, 0) / s.bandEnergy.length, h = c.get(s.receiverId), p = h[0] - s.diffractionPoint[0], d = h[1] - s.diffractionPoint[1], f = h[2] - s.diffractionPoint[2], u = Math.sqrt(p * p + d * d + f * f), m = u > 1e-10 ? [p / u, d / u, f / u] : [0, 0, 1], y = t.get(s.sourceId), g = Math.sqrt(
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
        arrivalDirection: m
      };
      this._pushPathWithEviction(s.receiverId, x);
    }
  }
  async reportImpulseResponse() {
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = B.getState().containers, t = V.sampleRate, r = [];
    for (const c of this.sourceIDs)
      for (const o of this.receiverIDs) {
        if (!this.paths[o] || this.paths[o].length === 0) continue;
        const i = this.paths[o].filter((s) => s.source === c);
        i.length > 0 && r.push({ sourceId: c, receiverId: o, paths: i });
      }
    if (r.length !== 0) {
      $("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let c = 0; c < r.length; c++) {
        const { sourceId: o, receiverId: i, paths: s } = r[c], n = e[o]?.name || "Source", l = e[i]?.name || "Receiver", h = Math.round(c / r.length * 100);
        $("UPDATE_PROGRESS", {
          progress: h,
          message: `Calculating IR: ${n} → ${l}`
        });
        try {
          const { normalizedSignal: p } = await this.calculateImpulseResponseForPair(o, i, s);
          o === this.sourceIDs[0] && i === this.receiverIDs[0] && this.calculateImpulseResponse().then((b) => {
            this.impulseResponse = b;
          }).catch(console.error);
          const d = Wt, f = Math.max(1, Math.floor(p.length / d)), u = [];
          for (let b = 0; b < p.length; b += f)
            u.push({
              time: b / t,
              amplitude: p[b]
            });
          const m = `${this.uuid}-ir-${o}-${i}`, y = Ce.getState().results[m], g = {
            kind: ze.ImpulseResponse,
            name: `IR: ${n} → ${l}`,
            uuid: m,
            from: this.uuid,
            info: {
              sampleRate: t,
              sourceName: n,
              receiverName: l,
              sourceId: o,
              receiverId: i
            },
            data: u
          };
          y ? $("UPDATE_RESULT", { uuid: m, result: g }) : $("ADD_RESULT", g);
        } catch (p) {
          console.error(`Failed to calculate impulse response for ${o} -> ${i}:`, p);
        }
      }
      $("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(e, t, r, c = j, o = this.frequencies, i = V.sampleRate) {
    let s;
    return this.lateReverbTailEnabled && this._energyHistogram[t] && (s = {
      energyHistogram: this._energyHistogram[t],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: o
    }), un(e, t, r, c, o, this.temperature, i, s);
  }
  async calculateImpulseResponseForDisplay(e = j, t = this.frequencies, r = V.sampleRate) {
    let c;
    return this.lateReverbTailEnabled && this.receiverIDs.length > 0 && this._energyHistogram[this.receiverIDs[0]] && (c = {
      energyHistogram: this._energyHistogram[this.receiverIDs[0]],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: t
    }), fn(this.receiverIDs, this.sourceIDs, this.paths, e, t, this.temperature, r, c);
  }
  clearRays() {
    if (this.room)
      for (let e = 0; e < this.room.allSurfaces.length; e++)
        this.room.allSurfaces[e].resetHits();
    this.validRayCount = 0, N.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount), this.rayBufferGeometry.setDrawRange(0, 1), this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !1, this.stats.numRaysShot.value = 0, this.stats.numValidRayPaths.value = 0, X.postMessage("STATS_UPDATE", this.stats), this.sourceIDs.forEach((e) => {
      B.getState().containers[e].numRays = 0;
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
      (t) => new M.Vector3().fromArray(t.chain[t.chain.length - 1].point)
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
      const r = e ? [e] : this.receiverIDs, c = t ? [t] : this.sourceIDs;
      for (const o of r)
        for (const i of c)
          this.responseByIntensity[o]?.[i] && ht(this.responseByIntensity, o, i);
    }
    return this.responseByIntensity;
  }
  calculateT20(e, t) {
    if (this.responseByIntensity) {
      const r = e ? [e] : this.receiverIDs, c = t ? [t] : this.sourceIDs;
      for (const o of r)
        for (const i of c)
          this.responseByIntensity[o]?.[i] && ut(this.responseByIntensity, o, i);
    }
    return this.responseByIntensity;
  }
  calculateT60(e, t) {
    if (this.responseByIntensity) {
      const r = e ? [e] : this.receiverIDs, c = t ? [t] : this.sourceIDs;
      for (const o of r)
        for (const i of c)
          this.responseByIntensity[o]?.[i] && ft(this.responseByIntensity, o, i);
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
  arrivalPressure(e, t, r, c = 1) {
    return Be(e, t, r, c, this.temperature);
  }
  async calculateImpulseResponse(e = j, t = this.frequencies, r = V.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let c = this.paths[this.receiverIDs[0]].sort((p, d) => p.time - d.time);
    const o = c[c.length - 1].time + ee, i = Array(t.length).fill(e), s = Y(r * o) * 2;
    let n = [];
    for (let p = 0; p < t.length; p++)
      n.push(new Float32Array(s));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let u = 0; u < c.length; u++)
        c[u].chainLength - 1 <= this.transitionOrder && c.splice(u, 1);
      let p = {
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
      }, f = new zt(p, !0).returnSortedPathsForHybrid(this.c, i, t);
      for (let u = 0; u < f.length; u++) {
        const m = Ie() ? 1 : -1, y = f[u].time, g = Y(y * r);
        for (let b = 0; b < t.length; b++)
          n[b][g] += f[u].pressure[b] * m;
      }
    }
    const l = B.getState().containers[this.receiverIDs[0]];
    for (let p = 0; p < c.length; p++) {
      const d = Ie() ? 1 : -1, f = c[p].time, u = c[p].arrivalDirection || [0, 0, 1], m = l.getGain(u), y = this.arrivalPressure(i, t, c[p], m).map((b) => b * d), g = Y(f * r);
      for (let b = 0; b < t.length; b++)
        n[b][g] += y[b];
    }
    if (this.lateReverbTailEnabled && this._energyHistogram[this.receiverIDs[0]]) {
      const p = fe(
        this._energyHistogram[this.receiverIDs[0]],
        t,
        this.tailCrossfadeTime,
        this._histogramBinWidth
      ), { tailSamples: d, tailStartSample: f } = de(
        p,
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
    return new Promise((p, d) => {
      h.postMessage({ samples: n }), h.onmessage = (f) => {
        const u = f.data.samples, m = new Float32Array(u[0].length >> 1);
        let y = 0;
        for (let I = 0; I < u.length; I++)
          for (let v = 0; v < m.length; v++)
            m[v] += u[I][v], oe(m[v]) > y && (y = oe(m[v]));
        const g = Pe(m), b = V.createOfflineContext(1, m.length, r), x = V.createBufferSource(g, b);
        x.connect(b.destination), x.start(), V.renderContextAsync(b).then((I) => p(I)).catch(d).finally(() => h.terminate());
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
  async calculateAmbisonicImpulseResponse(e = 1, t = j, r = this.frequencies, c = V.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");
    const o = this.paths[this.receiverIDs[0]].sort((f, u) => f.time - u.time);
    if (o.length === 0) throw Error("No valid ray paths found");
    const i = o[o.length - 1].time + ee;
    if (i <= 0) throw Error("Invalid impulse response duration");
    const s = Array(r.length).fill(t), n = Y(c * i) * 2;
    if (n < 2) throw Error("Impulse response too short to process");
    const l = Ct(e), h = [];
    for (let f = 0; f < r.length; f++) {
      h.push([]);
      for (let u = 0; u < l; u++)
        h[f].push(new Float32Array(n));
    }
    const p = B.getState().containers[this.receiverIDs[0]];
    for (let f = 0; f < o.length; f++) {
      const u = o[f], m = Ie() ? 1 : -1, y = u.time, g = u.arrivalDirection || [0, 0, 1], b = p.getGain(g), x = this.arrivalPressure(s, r, u, b).map((R) => R * m), I = Y(y * c);
      if (I >= n) continue;
      const v = new Float32Array(1);
      for (let R = 0; R < r.length; R++) {
        v[0] = x[R];
        const _ = Mt(v, g[0], g[1], g[2], e, "threejs");
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
      ), { tailSamples: u, tailStartSample: m } = de(
        f,
        c
      ), y = Y(this.tailCrossfadeDuration * c);
      for (let x = 0; x < r.length; x++) {
        const I = [h[x][0]], v = [u[x]], R = ge(I, v, m, y);
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
      const m = async (y) => new Promise((g) => {
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
        Array.from({ length: l }, (y, g) => m(g))
      ).then((y) => {
        let g = 0;
        for (const v of y)
          for (let R = 0; R < v.length; R++)
            oe(v[R]) > g && (g = oe(v[R]));
        if (g > 0)
          for (const v of y)
            for (let R = 0; R < v.length; R++)
              v[R] /= g;
        const b = y[0].length;
        if (b === 0) {
          d.terminate(), u(new Error("Filtered signal has zero length"));
          return;
        }
        const I = V.createOfflineContext(l, b, c).createBuffer(l, b, c);
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
  downloadImpulses(e, t = j, r = tt(125, 8e3), c = 44100) {
    Sn(
      this.paths,
      this.receiverIDs,
      this.sourceIDs,
      (o, i, s, n) => this.arrivalPressure(o, i, s, n),
      e,
      t,
      r,
      c
    );
  }
  async downloadImpulseResponse(e, t = V.sampleRate) {
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
      (c) => this.calculateAmbisonicImpulseResponse(c),
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
    (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder = e);
    let t = this.ambisonicImpulseResponse;
    (this.headYaw !== 0 || this.headPitch !== 0 || this.headRoll !== 0) && (t = Pn(t, this.headYaw, this.headPitch, this.headRoll));
    const r = await _t(this.hrtfSubjectId, e), c = await Tn(t, r);
    return this.binauralImpulseResponse = c.buffer, c.buffer;
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
    if (!At())
      return console.warn("[GPU RT] WebGPU not available in this browser"), !1;
    let e = null;
    try {
      return e = new Xn(), !await e.initialize(
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
      const c = this._gpuRayTracer.effectiveBatchSize, o = new Float32Array(c * e), i = async () => {
        if (!(!this._gpuRunning || !this._isRunning || !this._gpuRayTracer))
          try {
            if (!Number.isFinite(this.gpuBatchSize) || this.gpuBatchSize <= 0) {
              console.warn("[GPU RT] Invalid gpuBatchSize, falling back to CPU"), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
              return;
            }
            const s = Math.min(Math.floor(this.gpuBatchSize), c);
            let n = 0;
            for (let u = 0; u < this.sourceIDs.length && n < s; u++) {
              const m = B.getState().containers[this.sourceIDs[u]], y = m.position, g = m.rotation, b = m.phi, x = m.theta, I = m.directivityHandler, v = this.sourceIDs[u];
              this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
              let R = this._directivityRefPressures.get(v);
              if (!R || R.length !== this.frequencies.length) {
                R = new Array(this.frequencies.length);
                for (let D = 0; D < this.frequencies.length; D++)
                  R[D] = I.getPressureAtPosition(0, this.frequencies[D], 0, 0);
                this._directivityRefPressures.set(v, R);
              }
              const _ = Math.max(1, Math.floor(s / this.sourceIDs.length)), S = new M.Vector3();
              for (let D = 0; D < _ && n < s; D++) {
                const A = Math.random() * b, E = Math.random() * x, T = ye(A, E);
                S.setFromSphericalCoords(1, T[0], T[1]), S.applyEuler(g);
                const w = n * e;
                o[w] = y.x, o[w + 1] = y.y, o[w + 2] = y.z, o[w + 3] = S.x, o[w + 4] = S.y, o[w + 5] = S.z, o[w + 6] = A, o[w + 7] = E;
                for (let O = 0; O < t; O++) {
                  let L = 1;
                  try {
                    const z = I.getPressureAtPosition(0, this.frequencies[O], A, E), P = R[O];
                    typeof z == "number" && typeof P == "number" && P > 0 && (L = (z / P) ** 2);
                  } catch {
                  }
                  o[w + 8 + O] = L;
                }
                n++;
              }
            }
            const l = n, h = Math.floor(Math.random() * 4294967295), p = await this._gpuRayTracer.traceBatch(o, l, h);
            this.__num_checked_paths += l, this.stats.numRaysShot.value += l;
            const d = Math.max(1, Math.floor(l / Math.max(1, this.sourceIDs.length)));
            for (let u = 0; u < p.length; u++) {
              const m = p[u];
              if (!m) continue;
              const y = Math.min(
                Math.floor(u / Math.max(1, d)),
                this.sourceIDs.length - 1
              ), g = this.sourceIDs[y], b = B.getState().containers[g].position;
              m.source = g, this._handleTracedPath(m, b, g);
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
      for (let r = 0; r < this.paths[t].length; r++) {
        const c = this.paths[t][r].source;
        e[t][c] ? e[t][c].push(this.paths[t][r]) : e[t][c] = [this.paths[t][r]];
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
H("RAYTRACER_CALL_METHOD", Dt);
H("RAYTRACER_SET_PROPERTY", wt);
H("REMOVE_RAYTRACER", Et);
H("ADD_RAYTRACER", Tt(Kn));
H("RAYTRACER_CLEAR_RAYS", (a) => void W.getState().solvers[a].clearRays());
H("RAYTRACER_PLAY_IR", (a) => {
  W.getState().solvers[a].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
H("RAYTRACER_DOWNLOAD_IR", (a) => {
  const e = W.getState().solvers[a], t = B.getState().containers, r = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", c = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", o = `ir-${r}-${c}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(o).catch((i) => {
    window.alert(i.message || "Failed to download impulse response");
  });
});
H("RAYTRACER_DOWNLOAD_IR_OCTAVE", (a) => void W.getState().solvers[a].downloadImpulses(a));
H("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: a, order: e }) => {
  const t = W.getState().solvers[a], r = B.getState().containers, c = t.sourceIDs.length > 0 && r[t.sourceIDs[0]]?.name || "source", o = t.receiverIDs.length > 0 && r[t.receiverIDs[0]]?.name || "receiver", i = `ir-${c}-${o}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(i, e).catch((s) => {
    window.alert(s.message || "Failed to download ambisonic impulse response");
  });
});
H("RAYTRACER_PLAY_BINAURAL_IR", ({ uuid: a, order: e }) => {
  W.getState().solvers[a].playBinauralImpulseResponse(e).catch((r) => {
    window.alert(r.message || "Failed to play binaural impulse response");
  });
});
H("RAYTRACER_DOWNLOAD_BINAURAL_IR", ({ uuid: a, order: e }) => {
  const t = W.getState().solvers[a], r = B.getState().containers, c = t.sourceIDs.length > 0 && r[t.sourceIDs[0]]?.name || "source", o = t.receiverIDs.length > 0 && r[t.receiverIDs[0]]?.name || "receiver", i = `ir-${c}-${o}`.replace(/[^a-zA-Z0-9-_]/g, "_");
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
  Kn as default,
  C as defaults,
  Pe as normalize
};
//# sourceMappingURL=index-DTlblsF_.mjs.map
