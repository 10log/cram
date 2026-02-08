import { S as It } from "./solver-qC3XYtzY.mjs";
import * as C from "three";
import { computeBoundsTree as xt, disposeBoundsTree as St, acceleratedRaycast as _t } from "three-mesh-bvh";
import { S as it, u as B, b as Ee, L as le, P as ue, I as fe, y as At, e as H, F as ve, z as wt, r as L, m as Z, a as Le, R as ke, A as Dt, o as j, B as Et, s as Tt, c as Pt, d as Bt, f as X } from "./index-GmH05fDm.mjs";
import { a as N, w as be, n as Ct, O as at } from "./audio-engine-BRp0zTAk.mjs";
import { a as W } from "./air-attenuation-CBIk1QMo.mjs";
import { s as ot } from "./sound-speed-Biev-mJ1.mjs";
import { e as Mt, g as zt } from "./ambisonics.es-Ci32Q6qr.mjs";
import { ImageSourceSolver as Ot } from "./index-DFra9SZI.mjs";
function Nt(a) {
  return a.reduce((e, t) => e + t);
}
function Ft(a) {
  let e = Nt(a.map((t) => 10 ** (t / 10)));
  return 10 * Math.log10(e);
}
const Lt = `attribute vec2 color;
varying vec2 vColor;
uniform float pointScale;
void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = pointScale*(color.x/4.0+0.5);
  gl_Position = projectionMatrix * mvPosition;
  
}`, kt = `varying vec2 vColor;
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
  
}`, Ue = {
  vs: Lt,
  fs: kt
};
function xe(a, e) {
  let t = (360 - a) * (Math.PI / 180);
  return [e * (Math.PI / 180), t];
}
class Ut {
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
function Gt(a, e) {
  return new Ut(a);
}
const Vt = 0.01, ct = 256, q = 100, ee = 0.05, Ht = 1e3, jt = 2e3, qt = 1e6, Yt = 1e-3, $t = 1e4, Wt = 500, Se = 1, Xt = 10, M = {
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
  temperature: 20,
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
var lt = /* @__PURE__ */ ((a) => (a[a.ENERGY = 0] = "ENERGY", a[a.ANGLE = 1] = "ANGLE", a[a.ANGLE_ENERGY = 2] = "ANGLE_ENERGY", a))(lt || {});
function Re(a) {
  let e = Math.abs(a[0]);
  for (let t = 1; t < a.length; t++)
    Math.abs(a[t]) > e && (e = Math.abs(a[t]));
  if (e !== 0)
    for (let t = 0; t < a.length; t++)
      a[t] /= e;
  return a;
}
function Zt(a) {
  return Math.random() < a;
}
const { abs: Kt } = Math, Ge = new C.Vector3(), Jt = new C.Vector3(), Qt = new C.Vector3(), Ve = new C.Vector3(), J = new C.Vector3(), en = new C.Vector3(), ne = new C.Vector3(), Q = new C.Plane(), se = new C.Vector4(), He = new C.Vector4(), je = new C.Vector4(), qe = new C.Vector4();
function tn(a, e) {
  return a.getPlane(Q), se.set(Q.normal.x, Q.normal.y, Q.normal.z, Q.constant), He.set(e.a.x, e.a.y, e.a.z, 1), je.set(e.b.x, e.b.y, e.b.z, 1), qe.set(e.c.x, e.c.y, e.c.z, 1), se.dot(He) > 0 || se.dot(je) > 0 || se.dot(qe) > 0;
}
function ht(a, e, t, s, c, o, i, r, n, l, h, f, g = 1, d = []) {
  i = i.normalize(), a.ray.origin = o, a.ray.direction = i;
  const u = a.intersectObjects(e, !0);
  if (u.length > 0) {
    const m = n.reduce((p, b) => p + b, 0), y = n.length > 0 ? m / n.length : 0;
    if (u[0].object.userData?.kind === "receiver") {
      const p = u[0].face && Ge.copy(i).multiplyScalar(-1).angleTo(u[0].face.normal), b = u[0].distance, x = n.map(
        (_, S) => _ * Math.pow(10, -s[S] * b / 10)
      ), I = x.reduce((_, S) => _ + S, 0), v = x.length > 0 ? I / x.length : 0;
      d.push({
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
        energy: v,
        bandEnergy: [...x]
      }), ne.copy(i).normalize().negate();
      const R = [ne.x, ne.y, ne.z];
      return {
        chain: d,
        chainLength: d.length,
        intersectedReceiver: !0,
        energy: v,
        bandEnergy: [...x],
        source: l,
        initialPhi: h,
        initialTheta: f,
        arrivalDirection: R
      };
    } else {
      const p = u[0].face && Ge.copy(i).multiplyScalar(-1).angleTo(u[0].face.normal);
      d.push({
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
        energy: y
      }), u[0].object.parent instanceof it && (u[0].object.parent.numHits += 1);
      const b = u[0].face && Jt.copy(u[0].face.normal).normalize();
      let x = b && u[0].face && Ve.copy(i).sub(Qt.copy(b).multiplyScalar(i.dot(b)).multiplyScalar(2));
      const I = u[0].object.parent, v = t.map((E) => I.scatteringFunction(E)), R = n.reduce((E, T) => E + T, 0) || 1;
      let _ = 0;
      for (let E = 0; E < t.length; E++)
        _ += v[E] * (n[E] || 0);
      if (_ /= R, Zt(_)) {
        do
          J.set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
          );
        while (J.lengthSq() > 1 || J.lengthSq() < 1e-6);
        J.normalize(), x = Ve.copy(J).add(b).normalize();
      }
      const S = u[0].distance, w = t.map((E, T) => {
        const D = n[T];
        if (D == null) return 0;
        let O = D * Kt(I.reflectionFunction(E, p));
        return O *= Math.pow(10, -s[T] * S / 10), O;
      }), A = Math.max(...w);
      if (x && b && g < r + 1) {
        if (A < c && A > 0) {
          const E = A / c;
          if (Math.random() > E) {
            const T = w.reduce((O, k) => O + k, 0), D = w.length > 0 ? T / w.length : 0;
            return { chain: d, chainLength: d.length, source: l, intersectedReceiver: !1, energy: D, bandEnergy: [...w] };
          }
          for (let T = 0; T < w.length; T++)
            w[T] /= E;
        }
        if (A > 0)
          return ht(
            a,
            e,
            t,
            s,
            c,
            en.copy(u[0].point).addScaledVector(b, Vt),
            x,
            r,
            w,
            l,
            h,
            f,
            g + 1,
            d
          );
      }
    }
    return { chain: d, chainLength: d.length, source: l, intersectedReceiver: !1 };
  }
}
function nn(a) {
  var e, t, s = a.length;
  if (s === 1)
    e = 0, t = a[0][1];
  else {
    for (var c = 0, o = 0, i = 0, r = 0, n, l, h, f = 0; f < s; f++)
      n = a[f], l = n[0], h = n[1], c += l, o += h, i += l * l, r += l * h;
    e = (s * r - c * o) / (s * i - c * c), t = o / s - e * c / s;
  }
  return {
    m: e,
    b: t
  };
}
function te(a, e) {
  const t = a.length, s = [];
  for (let n = 0; n < t; n++)
    s.push([a[n], e[n]]);
  const { m: c, b: o } = nn(s);
  return { m: c, b: o, fx: (n) => c * n + o, fy: (n) => (n - o) / c };
}
const { log10: sn, pow: Te, floor: de, max: Pe, min: Be, sqrt: Ye, cos: $e, PI: We, random: rn } = Math;
function ge(a, e, t, s) {
  const c = e.length, o = [];
  for (let i = 0; i < c; i++) {
    const r = a[i];
    let n = 0;
    for (let v = r.length - 1; v >= 0; v--)
      if (r[v] > 0) {
        n = v;
        break;
      }
    if (n < 2) {
      o.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const l = new Float32Array(n + 1);
    l[n] = r[n];
    for (let v = n - 1; v >= 0; v--)
      l[v] = l[v + 1] + r[v];
    const h = l[0];
    if (h <= 0) {
      o.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const f = h * Te(10, -5 / 10), g = h * Te(10, -35 / 10);
    let d = -1, u = -1;
    for (let v = 0; v <= n; v++)
      d < 0 && l[v] <= f && (d = v), u < 0 && l[v] <= g && (u = v);
    let m = 0, y = 0;
    if (d >= 0 && u > d) {
      const v = [], R = [];
      for (let _ = d; _ <= u; _++) {
        const S = l[_];
        S > 0 && (v.push(_ * s), R.push(10 * sn(S / h)));
      }
      if (v.length >= 2) {
        const S = te(v, R).m;
        S < 0 && (m = S, y = -60 / S);
      }
    }
    m < 0 && m > -Se && (m = -Se, y = 60 / Se);
    let p = t;
    if (p <= 0) {
      const v = Pe(1, de(0.05 / s));
      p = Pe(0, n - v) * s;
    }
    const b = Be(de(p / s), n), x = b <= n && b >= 0 ? l[b] / h : 0, I = y > 0 ? Be(p + y, Xt) : p;
    o.push({ t60: y, decayRate: m, crossfadeLevel: x, crossfadeTime: p, endTime: I });
  }
  return o;
}
function pe(a, e) {
  let t = 0, s = 1 / 0;
  for (const n of a)
    n.endTime > t && (t = n.endTime), n.crossfadeTime > 0 && n.crossfadeTime < s && (s = n.crossfadeTime);
  if (t <= 0 || !isFinite(s))
    return { tailSamples: a.map(() => new Float32Array(0)), tailStartSample: 0, totalSamples: 0 };
  const c = de(s * e), o = de(t * e), i = o - c;
  if (i <= 0)
    return { tailSamples: a.map(() => new Float32Array(0)), tailStartSample: c, totalSamples: o };
  const r = [];
  for (const n of a) {
    const l = new Float32Array(i);
    if (n.decayRate >= 0 || n.crossfadeLevel <= 0) {
      r.push(l);
      continue;
    }
    const h = Ye(n.crossfadeLevel), f = 1 / Ye(3), g = h / f;
    for (let d = 0; d < i; d++) {
      const u = d / e, m = Te(10, n.decayRate * u / 20), y = rn() * 2 - 1;
      l[d] = y * m * g;
    }
    r.push(l);
  }
  return { tailSamples: r, tailStartSample: c, totalSamples: o };
}
function me(a, e, t, s) {
  const c = a.length, o = [];
  for (let i = 0; i < c; i++) {
    const r = a[i], n = e[i];
    if (!n || n.length === 0) {
      o.push(r);
      continue;
    }
    const l = Pe(r.length, t + n.length), h = new Float32Array(l);
    for (let d = 0; d < Be(t, r.length); d++)
      h[d] = r[d];
    const f = s, g = f > 1 ? f - 1 : 1;
    for (let d = 0; d < f; d++) {
      const u = t + d;
      if (u >= l) break;
      const m = 0.5 * (1 + $e(We * d / g)), y = 0.5 * (1 - $e(We * d / g)), p = u < r.length ? r[u] : 0, b = d < n.length ? n[d] : 0;
      h[u] = p * m + b * y;
    }
    for (let d = f; d < n.length; d++) {
      const u = t + d;
      if (u >= l) break;
      h[u] = n[d];
    }
    o.push(h);
  }
  return o;
}
const { floor: K, abs: an, max: ut } = Math, ft = () => Math.random() > 0.5, dt = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
));
function Ne(a, e, t, s = 1, c = 20) {
  const o = Ee(le(a));
  if (t.bandEnergy && t.bandEnergy.length === e.length) {
    for (let h = 0; h < e.length; h++)
      o[h] *= t.bandEnergy[h];
    const l = le(ue(fe(o)));
    if (s !== 1)
      for (let h = 0; h < l.length; h++) l[h] *= s;
    return l;
  }
  t.chain.slice(0, -1).forEach((l) => {
    const h = B.getState().containers[l.object];
    o.forEach((f, g) => {
      const d = an(h.reflectionFunction(e[g], l.angle));
      o[g] = f * d;
    });
  });
  const i = ue(fe(o)), r = W(e, c);
  e.forEach((l, h) => i[h] -= r[h] * t.totalLength);
  const n = le(i);
  if (s !== 1)
    for (let l = 0; l < n.length; l++) n[l] *= s;
  return n;
}
async function on(a, e, t, s = q, c, o, i = N.sampleRate, r) {
  if (t.length === 0) throw Error("No rays have been traced for this pair");
  let n = t.sort((m, y) => m.time - y.time);
  const l = n[n.length - 1].time + ee, h = Array(c.length).fill(s), f = K(i * l) * 2;
  let g = [];
  for (let m = 0; m < c.length; m++)
    g.push(new Float32Array(f));
  const d = B.getState().containers[e];
  for (let m = 0; m < n.length; m++) {
    const y = ft() ? 1 : -1, p = n[m].time, b = n[m].arrivalDirection || [0, 0, 1], x = d.getGain(b), I = Ne(h, c, n[m], x, o).map((R) => R * y), v = K(p * i);
    for (let R = 0; R < c.length; R++)
      g[R][v] += I[R];
  }
  if (r && r.energyHistogram && r.energyHistogram.length > 0) {
    const m = ge(
      r.energyHistogram,
      r.frequencies,
      r.crossfadeTime,
      r.histogramBinWidth
    ), { tailSamples: y, tailStartSample: p } = pe(
      m,
      i
    ), b = K(r.crossfadeDuration * i);
    g = me(g, y, p, b);
    const I = g.reduce((v, R) => ut(v, R.length), 0) * 2;
    for (let v = 0; v < c.length; v++)
      if (g[v].length < I) {
        const R = new Float32Array(I);
        R.set(g[v]), g[v] = R;
      }
  }
  const u = dt();
  return new Promise((m, y) => {
    u.postMessage({ samples: g }), u.onmessage = (p) => {
      const b = p.data.samples, x = new Float32Array(b[0].length >> 1);
      for (let v = 0; v < b.length; v++)
        for (let R = 0; R < x.length; R++)
          x[R] += b[v][R];
      const I = Re(x.slice());
      u.terminate(), m({ signal: x, normalizedSignal: I });
    }, u.onerror = (p) => {
      u.terminate(), y(p);
    };
  });
}
async function cn(a, e, t, s = q, c, o, i = N.sampleRate, r) {
  if (a.length == 0) throw Error("No receivers have been assigned to the raytracer");
  if (e.length == 0) throw Error("No sources have been assigned to the raytracer");
  if (t[a[0]].length == 0) throw Error("No rays have been traced yet");
  let n = t[a[0]].sort((m, y) => m.time - y.time);
  const l = n[n.length - 1].time + ee, h = Array(c.length).fill(s), f = K(i * l) * 2;
  let g = [];
  for (let m = 0; m < c.length; m++)
    g.push(new Float32Array(f));
  const d = B.getState().containers[a[0]];
  for (let m = 0; m < n.length; m++) {
    const y = ft() ? 1 : -1, p = n[m].time, b = n[m].arrivalDirection || [0, 0, 1], x = d.getGain(b), I = Ne(h, c, n[m], x, o).map((R) => R * y), v = K(p * i);
    for (let R = 0; R < c.length; R++)
      g[R][v] += I[R];
  }
  if (r && r.energyHistogram && r.energyHistogram.length > 0) {
    const m = ge(
      r.energyHistogram,
      r.frequencies,
      r.crossfadeTime,
      r.histogramBinWidth
    ), { tailSamples: y, tailStartSample: p } = pe(
      m,
      i
    ), b = K(r.crossfadeDuration * i);
    g = me(g, y, p, b);
    const I = g.reduce((v, R) => ut(v, R.length), 0) * 2;
    for (let v = 0; v < c.length; v++)
      if (g[v].length < I) {
        const R = new Float32Array(I);
        R.set(g[v]), g[v] = R;
      }
  }
  const u = dt();
  return new Promise((m, y) => {
    u.postMessage({ samples: g }), u.onmessage = (p) => {
      const b = p.data.samples, x = new Float32Array(b[0].length >> 1);
      for (let v = 0; v < b.length; v++)
        for (let R = 0; R < x.length; R++)
          x[R] += b[v][R];
      const I = Re(x.slice());
      u.terminate(), m({ signal: x, normalizedSignal: I });
    }, u.onerror = (p) => {
      u.terminate(), y(p);
    };
  });
}
function Fe(a, e = 1) {
  let t = a.slice();
  for (let s = 0; s < a.length; s++)
    if (s >= e && s < a.length - e) {
      const c = s - e, o = s + e;
      let i = 0;
      for (let r = c; r < o; r++)
        i += a[r];
      t[s] = i / (2 * e);
    }
  return t;
}
const { floor: ln, abs: hn } = Math;
function he(a, e, t) {
  const s = e.chain.slice(0, -1);
  if (s && s.length > 0) {
    let c = 1;
    for (let o = 0; o < s.length; o++) {
      const i = s[o], r = a.surfaceMap[i.object], n = i.angle || 0;
      c = c * hn(r.reflectionFunction(t, n));
    }
    return c;
  }
  return 1;
}
function un(a, e, t, s) {
  const c = [], o = (n, l) => ({ label: n, data: l }), i = [];
  if (s)
    for (let n = 0; n < s.length; n++)
      i.push(o(s[n].toString(), []));
  const r = Object.keys(a);
  for (let n = 0; n < r.length; n++) {
    c.push({
      id: r[n],
      data: []
    });
    for (let l = 0; l < a[r[n]].length; l++) {
      const h = a[r[n]][l];
      let f;
      s ? (f = s.map((g) => ({
        frequency: g,
        value: he(e, h, g)
      })), s.forEach((g, d) => {
        i[d].data.push([h.time, he(e, h, g)]);
      })) : f = (g) => he(e, h, g), c[c.length - 1].data.push({
        time: h.time,
        energy: f
      });
    }
    c[c.length - 1].data = c[c.length - 1].data.sort((l, h) => l.time - h.time);
  }
  for (let n = 0; n < i.length; n++)
    i[n].data = i[n].data.sort((l, h) => l[0] - h[0]), i[n].x = i[n].data.map((l) => l[0]), i[n].y = i[n].data.map((l) => l[1]);
  return [c, i];
}
function fn(a, e, t, s, c, o) {
  const i = a, r = ot(c), n = W(s, c), l = {};
  for (const h in i) {
    l[h] = {};
    const f = B.getState().containers[h];
    for (const g in i[h]) {
      l[h][g] = {
        freqs: s,
        response: []
      };
      for (let d = 0; d < i[h][g].length; d++) {
        let u = 0, m = [], y = i[h][g][d].initialPhi, p = i[h][g][d].initialTheta, b = B.getState().containers[g].directivityHandler;
        for (let S = 0; S < s.length; S++)
          m[S] = Ee(b.getPressureAtPosition(0, s[S], y, p));
        const I = i[h][g][d].arrivalDirection || [0, 0, 1], v = f.getGain(I), R = v * v;
        if (R !== 1)
          for (let S = 0; S < s.length; S++)
            m[S] *= R;
        for (let S = 0; S < i[h][g][d].chain.length; S++) {
          const { angle: w, distance: A } = i[h][g][d].chain[S];
          u += A / r;
          const E = i[h][g][d].chain[S].object, T = B.getState().containers[E] || null;
          for (let D = 0; D < s.length; D++) {
            const O = s[D];
            let k = 1;
            T && T.kind === "surface" && (k = T.reflectionFunction(O, w)), m[D] = Ee(
              le(ue(fe(m[D] * k)) - n[D] * A)
            );
          }
        }
        const _ = ue(fe(m));
        l[h][g].response.push({
          time: u,
          level: _,
          bounces: i[h][g][d].chain.length
        });
      }
      l[h][g].response.sort((d, u) => d.time - u.time);
    }
  }
  return gt(l, o);
}
function gt(a, e = ct) {
  if (a) {
    for (const t in a)
      for (const s in a[t]) {
        const { response: c, freqs: o } = a[t][s], i = c[c.length - 1].time, r = ln(e * i);
        a[t][s].resampledResponse = Array(o.length).fill(0).map((g) => new Float32Array(r)), a[t][s].sampleRate = e;
        let n = 0, l = [], h = o.map((g) => 0), f = !1;
        for (let g = 0, d = 0; g < r; g++) {
          let u = g / r * i;
          if (c[d] && c[d].time) {
            let m = c[d].time;
            if (m > u) {
              for (let y = 0; y < o.length; y++)
                a[t][s].resampledResponse[y][n] = 0;
              f && l.push(n), n++;
              continue;
            }
            if (m <= u) {
              let y = c[d].level.map((p) => 0);
              for (; m <= u; ) {
                m = c[d].time;
                for (let p = 0; p < o.length; p++)
                  y[p] = Ft([y[p], c[d].level[p]]);
                d++;
              }
              for (let p = 0; p < o.length; p++) {
                if (a[t][s].resampledResponse[p][n] = y[p], l.length > 0) {
                  const b = h[p], x = y[p];
                  for (let I = 0; I < l.length; I++) {
                    const v = At(b, x, (I + 1) / (l.length + 1));
                    a[t][s].resampledResponse[p][l[I]] = v;
                  }
                }
                h[p] = y[p];
              }
              l.length > 0 && (l = []), f = !0, n++;
              continue;
            }
          }
        }
        mt(a, t, s), pt(a, t, s), yt(a, t, s);
      }
    return a;
  } else
    console.warn("no data yet");
}
function pt(a, e, t) {
  const s = e, c = t, o = a[s][c].resampledResponse, i = a[s][c].sampleRate;
  if (o && i) {
    const r = new Float32Array(o[0].length);
    for (let n = 0; n < o[0].length; n++)
      r[n] = n / i;
    a[s][c].t30 = o.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const f = h - 30, d = Fe(n, 2).filter((u) => u >= f).length;
      return te(r.slice(0, d), n.slice(0, d));
    });
  }
}
function mt(a, e, t) {
  const s = e, c = t, o = a[s][c].resampledResponse, i = a[s][c].sampleRate;
  if (o && i) {
    const r = new Float32Array(o[0].length);
    for (let n = 0; n < o[0].length; n++)
      r[n] = n / i;
    a[s][c].t20 = o.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const f = h - 20, d = Fe(n, 2).filter((u) => u >= f).length;
      return te(r.slice(0, d), n.slice(0, d));
    });
  }
}
function yt(a, e, t) {
  const s = e, c = t, o = a[s][c].resampledResponse, i = a[s][c].sampleRate;
  if (o && i) {
    const r = new Float32Array(o[0].length);
    for (let n = 0; n < o[0].length; n++)
      r[n] = n / i;
    a[s][c].t60 = o.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const f = h - 60, d = Fe(n, 2).filter((u) => u >= f).length;
      return te(r.slice(0, d), n.slice(0, d));
    });
  }
}
const vt = -2;
function dn(a) {
  const s = (n) => String.fromCharCode(...n), c = (n) => {
    let l = 0;
    const h = s(n.slice(l, l += 36)), f = n[l++], g = n[l++], d = n[l++], u = n[l++], m = n[l++], y = [n[l++], n[l++], n[l++]], p = [n[l++], n[l++], n[l++]];
    return {
      object: h,
      angle: f,
      distance: g,
      energy: d,
      faceIndex: u,
      faceMaterialIndex: m,
      faceNormal: y,
      point: p
    };
  }, o = (n) => {
    const l = [];
    let h = 0;
    for (; h < n.length; ) {
      const f = s(n.slice(h, h += 36)), g = n[h++], d = n[h++], u = !!n[h++], m = n[h++], y = [];
      for (let p = 0; p < g; p++)
        y.push(c(n.slice(h, h += 47)));
      l.push({
        source: f,
        chainLength: g,
        time: d,
        intersectedReceiver: u,
        energy: m,
        chain: y
      });
    }
    return l;
  };
  let i = 0;
  const r = {};
  for (; i < a.length; ) {
    const n = s(a.slice(i, i += 36)), l = a[i++], h = o(a.slice(i, i += l));
    r[n] = h;
  }
  return r;
}
function gn(a) {
  const e = /* @__PURE__ */ new Set();
  for (const n of Object.keys(a)) {
    e.add(n);
    for (const l of a[n]) {
      e.add(l.source);
      for (const h of l.chain)
        e.add(h.object);
    }
  }
  const t = Array.from(e), s = /* @__PURE__ */ new Map();
  for (let n = 0; n < t.length; n++)
    s.set(t[n], n);
  const c = 2 + t.length * 36;
  let o = 0;
  for (const n of Object.keys(a)) {
    o += 2;
    for (const l of a[n])
      o += 5, o += l.chain.length * 12;
  }
  const i = new Float32Array(c + o);
  let r = 0;
  i[r++] = vt, i[r++] = t.length;
  for (const n of t)
    for (let l = 0; l < 36; l++)
      i[r++] = n.charCodeAt(l);
  for (const n of Object.keys(a)) {
    i[r++] = s.get(n);
    let l = 0;
    for (const h of a[n])
      l += 5 + h.chain.length * 12;
    i[r++] = l;
    for (const h of a[n]) {
      i[r++] = s.get(h.source), i[r++] = h.chain.length, i[r++] = h.time, i[r++] = Number(h.intersectedReceiver), i[r++] = h.energy;
      for (const f of h.chain)
        i[r++] = s.get(f.object), i[r++] = f.angle, i[r++] = f.distance, i[r++] = f.energy, i[r++] = f.faceIndex, i[r++] = f.faceMaterialIndex, i[r++] = f.faceNormal[0], i[r++] = f.faceNormal[1], i[r++] = f.faceNormal[2], i[r++] = f.point[0], i[r++] = f.point[1], i[r++] = f.point[2];
    }
  }
  return i;
}
function pn(a) {
  let e = 0;
  e++;
  const t = a[e++];
  if (!Number.isFinite(t) || t < 0 || t !== (t | 0))
    throw new Error("Invalid V2 buffer: bad numUUIDs");
  if (e + t * 36 > a.length)
    throw new Error("Invalid V2 buffer: UUID table exceeds buffer length");
  const s = [];
  for (let o = 0; o < t; o++) {
    const i = [];
    for (let r = 0; r < 36; r++)
      i.push(a[e++]);
    s.push(String.fromCharCode(...i));
  }
  const c = {};
  for (; e < a.length; ) {
    const o = a[e++];
    if (o < 0 || o >= s.length)
      throw new Error("Invalid V2 buffer: receiver index out of range");
    const i = s[o], r = a[e++];
    if (!Number.isFinite(r) || r < 0)
      throw new Error("Invalid V2 buffer: bad pathBufLen");
    const n = Math.min(e + r, a.length), l = [];
    for (; e < n; ) {
      const h = s[a[e++]], f = a[e++], g = a[e++], d = !!a[e++], u = a[e++], m = [];
      for (let y = 0; y < f; y++) {
        const p = s[a[e++]], b = a[e++], x = a[e++], I = a[e++], v = a[e++], R = a[e++], _ = [a[e++], a[e++], a[e++]], S = [a[e++], a[e++], a[e++]];
        m.push({
          object: p,
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
        chainLength: f,
        time: g,
        intersectedReceiver: d,
        energy: u,
        chain: m
      });
    }
    c[i] = l;
  }
  return c;
}
function mn(a) {
  return gn(a);
}
function yn(a) {
  return a.length === 0 ? {} : a[0] === vt ? pn(a) : dn(a);
}
const { floor: Xe, abs: Ze } = Math, vn = () => Math.random() > 0.5;
function bn(a, e, t, s, c, o = q, i = at(125, 8e3), r = 44100) {
  if (e.length === 0) throw Error("No receivers have been assigned to the raytracer");
  if (t.length === 0) throw Error("No sources have been assigned to the raytracer");
  if (a[e[0]].length === 0) throw Error("No rays have been traced yet");
  const n = a[e[0]].sort((m, y) => m.time - y.time), l = n[n.length - 1].time + ee, h = Array(i.length).fill(o), f = Xe(r * l), g = [];
  for (let m = 0; m < i.length; m++)
    g.push(new Float32Array(f));
  let d = 0;
  const u = B.getState().containers[e[0]];
  for (let m = 0; m < n.length; m++) {
    const y = vn() ? 1 : -1, p = n[m].time, b = n[m].arrivalDirection || [0, 0, 1], x = u.getGain(b), I = s(h, i, n[m], x).map((R) => R * y), v = Xe(p * r);
    for (let R = 0; R < i.length; R++)
      g[R][v] += I[R], Ze(g[R][v]) > d && (d = Ze(g[R][v]));
  }
  for (let m = 0; m < i.length; m++) {
    const y = be([Ct(g[m])], { sampleRate: r, bitDepth: 32 });
    ve.saveAs(y, `${i[m]}_${c}.wav`);
  }
}
async function Rn(a, e, t) {
  if (!a)
    try {
      a = await e();
    } catch (c) {
      throw c;
    }
  N.context.state === "suspended" && N.context.resume(), console.log(a);
  const s = N.context.createBufferSource();
  return s.buffer = a, s.connect(N.context.destination), s.start(), H("RAYTRACER_SET_PROPERTY", { uuid: t, property: "impulseResponsePlaying", value: !0 }), s.onended = () => {
    s.stop(), s.disconnect(N.context.destination), H("RAYTRACER_SET_PROPERTY", { uuid: t, property: "impulseResponsePlaying", value: !1 });
  }, { impulseResponse: a };
}
async function In(a, e, t, s = N.sampleRate) {
  if (!a)
    try {
      a = await e();
    } catch (i) {
      throw i;
    }
  const c = be([Re(a.getChannelData(0))], { sampleRate: s, bitDepth: 32 }), o = t.endsWith(".wav") ? "" : ".wav";
  return ve.saveAs(c, t + o), { impulseResponse: a };
}
async function xn(a, e, t, s = 1, c) {
  (!a || t !== s) && (t = s, a = await e(s));
  const o = a.numberOfChannels, i = a.sampleRate, r = [];
  for (let f = 0; f < o; f++)
    r.push(a.getChannelData(f));
  const n = be(r, { sampleRate: i, bitDepth: 32 }), l = c.endsWith(".wav") ? "" : ".wav", h = s === 1 ? "FOA" : `HOA${s}`;
  return ve.saveAs(n, `${c}_${h}${l}`), { ambisonicImpulseResponse: a, ambisonicOrder: t };
}
async function Sn(a, e, t) {
  a || (a = await e()), N.context.state === "suspended" && N.context.resume();
  const s = N.context.createBufferSource();
  return s.buffer = a, s.connect(N.context.destination), s.start(), H("RAYTRACER_SET_PROPERTY", { uuid: t, property: "binauralPlaying", value: !0 }), s.onended = () => {
    s.stop(), s.disconnect(N.context.destination), H("RAYTRACER_SET_PROPERTY", { uuid: t, property: "binauralPlaying", value: !1 });
  }, { binauralImpulseResponse: a };
}
async function _n(a, e, t) {
  a || (a = await e());
  const s = a.sampleRate, c = a.getChannelData(0), o = a.getChannelData(1);
  let i = 0;
  for (let f = 0; f < c.length; f++)
    Math.abs(c[f]) > i && (i = Math.abs(c[f])), Math.abs(o[f]) > i && (i = Math.abs(o[f]));
  const r = new Float32Array(c.length), n = new Float32Array(o.length);
  if (i > 0)
    for (let f = 0; f < c.length; f++)
      r[f] = c[f] / i, n[f] = o[f] / i;
  const l = be([r, n], { sampleRate: s, bitDepth: 32 }), h = t.endsWith(".wav") ? "" : ".wav";
  return ve.saveAs(l, `${t}_binaural${h}`), { binauralImpulseResponse: a };
}
async function An(a, e) {
  const t = a.sampleRate;
  if (t !== e.sampleRate)
    throw new Error(
      `Sample rate mismatch: ambisonic IR is ${t} Hz but HRTF filters are ${e.sampleRate} Hz`
    );
  const s = Math.min(a.numberOfChannels, e.channelCount);
  if (s === 0)
    throw new Error("No channels to decode");
  const c = a.length + e.filterLength - 1, o = new OfflineAudioContext(2, c, t);
  for (let r = 0; r < s; r++) {
    const n = o.createBuffer(1, a.length, t);
    n.copyToChannel(a.getChannelData(r), 0);
    const l = o.createBufferSource();
    l.buffer = n;
    const h = o.createBuffer(2, e.filterLength, t);
    h.copyToChannel(new Float32Array(e.filtersLeft[r]), 0), h.copyToChannel(new Float32Array(e.filtersRight[r]), 1);
    const f = o.createConvolver();
    f.normalize = !1, f.buffer = h, l.connect(f), f.connect(o.destination), l.start(0);
  }
  return {
    buffer: await o.startRendering(),
    sampleRate: t
  };
}
function wn(a, e, t, s) {
  if (e === 0 && t === 0 && s === 0)
    return a;
  const c = a.numberOfChannels, o = a.length, i = a.sampleRate;
  if (c < 4)
    throw new Error("Ambisonic rotation requires at least 4 channels (first order)");
  const r = e * Math.PI / 180, n = t * Math.PI / 180, l = s * Math.PI / 180, h = Math.cos(r), f = Math.sin(r), g = Math.cos(n), d = Math.sin(n), u = Math.cos(l), m = Math.sin(l), y = h * u + f * d * m, p = -h * m + f * d * u, b = f * g, x = g * m, I = g * u, v = -d, R = -f * u + h * d * m, _ = f * m + h * d * u, S = h * g, A = new OfflineAudioContext(c, o, i).createBuffer(c, o, i);
  A.copyToChannel(a.getChannelData(0), 0);
  const E = a.getChannelData(1), T = a.getChannelData(2), D = a.getChannelData(3), O = new Float32Array(o), k = new Float32Array(o), z = new Float32Array(o);
  for (let P = 0; P < o; P++) {
    const F = E[P], U = T[P], G = D[P];
    O[P] = y * F + p * U + b * G, k[P] = x * F + I * U + v * G, z[P] = R * F + _ * U + S * G;
  }
  A.copyToChannel(O, 1), A.copyToChannel(k, 2), A.copyToChannel(z, 3);
  for (let P = 4; P < c; P++)
    A.copyToChannel(a.getChannelData(P), P);
  return A;
}
function Dn(a) {
  const e = {
    totalRays: 0,
    validRays: 0,
    estimatedT30: new Array(a).fill(0),
    t30Mean: new Array(a).fill(0),
    t30M2: new Array(a).fill(0),
    t30Count: 0,
    convergenceRatio: 1 / 0
  }, t = {}, s = Date.now();
  return { convergenceMetrics: e, energyHistogram: t, lastConvergenceCheck: s };
}
function En(a, e, t, s, c, o, i, r, n) {
  a.totalRays = c, a.validRays = o;
  const l = Object.keys(e);
  if (l.length === 0) return;
  let h;
  if (s.length > 0)
    for (const p of s) {
      const b = e[p];
      if (b && b.length > 0) {
        h = p;
        break;
      }
    }
  if (!h) {
    const p = l.slice().sort();
    for (const b of p) {
      const x = e[b];
      if (x && x.length > 0) {
        h = b;
        break;
      }
    }
  }
  if (!h) return;
  const f = e[h];
  if (!f || f.length === 0) return;
  const g = t.length, d = new Array(g).fill(0);
  for (let p = 0; p < g; p++) {
    const b = f[p];
    let x = 0;
    for (let A = r - 1; A >= 0; A--)
      if (b[A] > 0) {
        x = A;
        break;
      }
    if (x < 2) {
      d[p] = 0;
      continue;
    }
    const I = new Float32Array(x + 1);
    I[x] = b[x];
    for (let A = x - 1; A >= 0; A--)
      I[A] = I[A + 1] + b[A];
    const v = I[0];
    if (v <= 0) {
      d[p] = 0;
      continue;
    }
    const R = v * Math.pow(10, -5 / 10), _ = v * Math.pow(10, -35 / 10);
    let S = -1, w = -1;
    for (let A = 0; A <= x; A++)
      S < 0 && I[A] <= R && (S = A), w < 0 && I[A] <= _ && (w = A);
    if (S >= 0 && w > S) {
      const A = [], E = [];
      for (let T = S; T <= w; T++) {
        const D = I[T];
        D > 0 && (A.push(T * i), E.push(10 * Math.log10(D / v)));
      }
      if (A.length >= 2) {
        const D = te(A, E).m;
        d[p] = D < 0 ? 60 / -D : 0;
      }
    }
  }
  a.estimatedT30 = d, a.t30Count += 1;
  const u = a.t30Count;
  let m = 0, y = 0;
  for (let p = 0; p < g; p++) {
    const b = d[p], x = a.t30Mean[p], I = x + (b - x) / u, R = a.t30M2[p] + (b - x) * (b - I);
    if (a.t30Mean[p] = I, a.t30M2[p] = R, u >= 2 && I > 0) {
      const _ = R / (u - 1), S = Math.sqrt(_) / I;
      S > m && (m = S), y++;
    }
  }
  a.convergenceRatio = y > 0 ? m : 1 / 0, H("RAYTRACER_SET_PROPERTY", {
    uuid: n,
    property: "convergenceMetrics",
    value: { ...a }
  });
}
function Tn(a, e, t, s, c, o, i) {
  if (!a[e]) {
    a[e] = [];
    for (let l = 0; l < s.length; l++)
      a[e].push(new Float32Array(i));
  }
  let r = 0;
  for (let l = 0; l < t.chain.length; l++)
    r += t.chain[l].distance;
  r /= c;
  const n = Math.floor(r / o);
  if (n >= 0 && n < i && t.bandEnergy)
    for (let l = 0; l < s.length; l++)
      a[e][l][n] += t.bandEnergy[l] || 0;
}
function Ke(a, e, t, s) {
  const c = a / s, o = e / s, i = t / s, r = Math.floor(c), n = Math.floor(o), l = Math.floor(i), h = [`${r},${n},${l}`], f = [0, -1, 1];
  for (const g of f)
    for (const d of f)
      for (const u of f) {
        if (g === 0 && d === 0 && u === 0) continue;
        const m = r + g, y = n + d, p = l + u;
        Math.abs(c - (m + 0.5)) < 1 && Math.abs(o - (y + 0.5)) < 1 && Math.abs(i - (p + 0.5)) < 1 && h.push(`${m},${y},${p}`);
      }
  return h;
}
function Pn(a, e) {
  return a < e ? `${a}|${e}` : `${e}|${a}`;
}
function Bn(a, e = 1e-4) {
  const t = wt(e), s = e * 10, c = /* @__PURE__ */ new Map();
  for (const i of a) {
    const r = i.edgeLoop;
    if (!r || r.length < 3) continue;
    const n = [i.normal.x, i.normal.y, i.normal.z];
    for (let l = 0; l < r.length; l++) {
      const h = r[l], f = r[(l + 1) % r.length], g = [h.x, h.y, h.z], d = [f.x, f.y, f.z], u = { start: g, end: d, surfaceId: i.uuid, normal: n }, m = Ke(h.x, h.y, h.z, s), y = Ke(f.x, f.y, f.z, s), p = /* @__PURE__ */ new Set();
      for (const b of m)
        for (const x of y) {
          const I = Pn(b, x);
          p.has(I) || (p.add(I), c.has(I) ? c.get(I).push(u) : c.set(I, [u]));
        }
    }
  }
  const o = [];
  for (const [, i] of c) {
    if (i.length !== 2 || i[0].surfaceId === i[1].surfaceId) continue;
    const r = i[0], n = i[1];
    if (!(t(r.start[0], n.start[0]) && t(r.start[1], n.start[1]) && t(r.start[2], n.start[2]) && t(r.end[0], n.end[0]) && t(r.end[1], n.end[1]) && t(r.end[2], n.end[2]) || t(r.start[0], n.end[0]) && t(r.start[1], n.end[1]) && t(r.start[2], n.end[2]) && t(r.end[0], n.start[0]) && t(r.end[1], n.start[1]) && t(r.end[2], n.start[2]))) continue;
    const h = r.end[0] - r.start[0], f = r.end[1] - r.start[1], g = r.end[2] - r.start[2], d = Math.sqrt(h * h + f * f + g * g);
    if (d < e) continue;
    const u = [h / d, f / d, g / d], m = r.normal, y = n.normal, p = m[0] * y[0] + m[1] * y[1] + m[2] * y[2], b = Math.acos(Math.max(-1, Math.min(1, p)));
    if (b < 0.01) continue;
    const I = 2 * Math.PI - b, v = I / Math.PI;
    v <= 1 || o.push({
      start: r.start,
      end: r.end,
      direction: u,
      length: d,
      normal0: m,
      normal1: y,
      surface0Id: r.surfaceId,
      surface1Id: n.surfaceId,
      wedgeAngle: I,
      n: v
    });
  }
  return { edges: o };
}
const { PI: V, sqrt: ye, abs: Cn, cos: Ce, sin: Mn, atan2: Je } = Math;
function re(a) {
  return a < 0 && (a = 0), 1 - Math.exp(-ye(V * a));
}
function zn(a, e, t, s, c) {
  const o = a, i = [
    s[0] - t[0],
    s[1] - t[1],
    s[2] - t[2]
  ], r = i[0] * o[0] + i[1] * o[1] + i[2] * o[2], n = [i[0] - r * o[0], i[1] - r * o[1], i[2] - r * o[2]], l = ye(n[0] ** 2 + n[1] ** 2 + n[2] ** 2), h = [
    c[0] - t[0],
    c[1] - t[1],
    c[2] - t[2]
  ], f = h[0] * o[0] + h[1] * o[1] + h[2] * o[2], g = [h[0] - f * o[0], h[1] - f * o[1], h[2] - f * o[2]], d = ye(g[0] ** 2 + g[1] ** 2 + g[2] ** 2);
  if (l < 1e-10 || d < 1e-10)
    return { phiSource: V, phiReceiver: V };
  const u = [n[0] / l, n[1] / l, n[2] / l], m = [g[0] / d, g[1] / d, g[2] / d], y = [-e[0], -e[1], -e[2]], p = [
    o[1] * y[2] - o[2] * y[1],
    o[2] * y[0] - o[0] * y[2],
    o[0] * y[1] - o[1] * y[0]
  ], b = Je(
    u[0] * p[0] + u[1] * p[1] + u[2] * p[2],
    u[0] * y[0] + u[1] * y[1] + u[2] * y[2]
  ), x = Je(
    m[0] * p[0] + m[1] * p[1] + m[2] * p[2],
    m[0] * y[0] + m[1] * y[1] + m[2] * y[2]
  ), I = (v) => {
    let R = v;
    for (; R < 0; ) R += 2 * V;
    return R;
  };
  return {
    phiSource: I(b),
    phiReceiver: I(x)
  };
}
function ie(a, e, t, s, c) {
  const o = t + s * c, i = (V + e * o) / (2 * a), r = Mn(i);
  return Cn(r) < 1e-12 ? 0 : Ce(i) / r;
}
function On(a, e, t, s, c, o, i) {
  if (t < 1e-10 || s < 1e-10) return 0;
  const r = 2 * V * a / i;
  if (r < 1e-10) return 0;
  const n = t * s / (t + s), l = (E, T, D, O) => {
    const z = T + D * O, P = Math.round((z + V) / (2 * V * e)), F = Math.round((z - V) / (2 * V * e)), U = 2 * Ce((2 * V * e * P - z) / 2) ** 2, G = 2 * Ce((2 * V * e * F - z) / 2) ** 2;
    return E > 0 ? U : G;
  };
  let h = 0;
  const f = l(1, o, -1, c), g = ie(e, 1, o, -1, c), d = re(r * n * f), u = l(-1, o, -1, c), m = ie(e, -1, o, -1, c), y = re(r * n * u), p = l(1, o, 1, c), b = ie(e, 1, o, 1, c), x = re(r * n * p), I = l(-1, o, 1, c), v = ie(e, -1, o, 1, c), R = re(r * n * I), _ = 1 / (2 * e * ye(2 * V * r)), S = g * d + m * y + b * x + v * R;
  h = _ * _ * S * S;
  const w = t, A = w / (s * (s + w));
  return h * A;
}
function Nn(a, e, t, s) {
  const c = e[0] - a[0], o = e[1] - a[1], i = e[2] - a[2], r = c * c + o * o + i * i;
  if (r < 1e-20)
    return [...a];
  const n = Math.sqrt(r), l = [c / n, o / n, i / n], h = (y) => {
    const p = a[0] + y * c, b = a[1] + y * o, x = a[2] + y * i, I = Math.sqrt(
      (p - t[0]) ** 2 + (b - t[1]) ** 2 + (x - t[2]) ** 2
    ), v = Math.sqrt(
      (p - s[0]) ** 2 + (b - s[1]) ** 2 + (x - s[2]) ** 2
    );
    if (I < 1e-10 || v < 1e-10) return 0;
    const R = ((p - t[0]) * l[0] + (b - t[1]) * l[1] + (x - t[2]) * l[2]) / I, _ = ((p - s[0]) * l[0] + (b - s[1]) * l[1] + (x - s[2]) * l[2]) / v;
    return R + _;
  };
  let f = 0, g = 1;
  const d = h(f), u = h(g);
  if (d * u > 0) {
    const y = (b) => {
      const x = a[0] + b * c, I = a[1] + b * o, v = a[2] + b * i, R = Math.sqrt(
        (x - t[0]) ** 2 + (I - t[1]) ** 2 + (v - t[2]) ** 2
      ), _ = Math.sqrt(
        (x - s[0]) ** 2 + (I - s[1]) ** 2 + (v - s[2]) ** 2
      );
      return R + _;
    }, p = y(0) < y(1) ? 0 : 1;
    return [
      a[0] + p * c,
      a[1] + p * o,
      a[2] + p * i
    ];
  }
  for (let y = 0; y < 50; y++) {
    const p = (f + g) / 2, b = h(p);
    if (Math.abs(b) < 1e-12) break;
    d * b < 0 ? g = p : f = p;
  }
  const m = (f + g) / 2;
  return [
    a[0] + m * c,
    a[1] + m * o,
    a[2] + m * i
  ];
}
function Qe(a, e, t, s, c = 0.01) {
  const o = e[0] - a[0], i = e[1] - a[1], r = e[2] - a[2], n = Math.sqrt(o * o + i * i + r * r);
  if (n < c) return !0;
  const l = new C.Vector3(o / n, i / n, r / n), h = new C.Vector3(
    a[0] + l.x * c,
    a[1] + l.y * c,
    a[2] + l.z * c
  );
  t.ray.set(h, l), t.far = n - 2 * c, t.near = 0;
  const f = t.intersectObjects(s, !0);
  return t.far = 1 / 0, f.length === 0;
}
function Fn(a, e, t, s, c, o, i, r) {
  const n = [], l = W(s, o);
  for (const h of a.edges)
    for (const [f, g] of e)
      for (const [d, u] of t) {
        const m = Nn(h.start, h.end, g, u), y = Math.sqrt(
          (m[0] - g[0]) ** 2 + (m[1] - g[1]) ** 2 + (m[2] - g[2]) ** 2
        ), p = Math.sqrt(
          (m[0] - u[0]) ** 2 + (m[1] - u[1]) ** 2 + (m[2] - u[2]) ** 2
        );
        if (y < 1e-6 || p < 1e-6 || !Qe(g, m, i, r) || !Qe(m, u, i, r)) continue;
        const { phiSource: b, phiReceiver: x } = zn(
          h.direction,
          h.normal0,
          m,
          g,
          u
        ), I = y + p, v = I / c, R = new Array(s.length);
        for (let _ = 0; _ < s.length; _++) {
          let S = On(
            s[_],
            h.n,
            y,
            p,
            b,
            x,
            c
          );
          const w = l[_] * I;
          S *= Math.pow(10, -w / 10), R[_] = S;
        }
        n.push({
          edge: h,
          diffractionPoint: m,
          totalDistance: I,
          time: v,
          bandEnergy: R,
          sourceId: f,
          receiverId: d
        });
      }
  return n;
}
let _e = null, ae = null, oe = !1;
function bt() {
  return typeof navigator < "u" && "gpu" in navigator;
}
async function Ln() {
  if (ae && !oe)
    return { adapter: _e, device: ae };
  if (!bt())
    return null;
  try {
    const a = await navigator.gpu.requestAdapter();
    if (!a)
      return console.warn("[GPU RT] No WebGPU adapter found"), null;
    const e = await a.requestDevice({
      requiredLimits: {
        maxStorageBufferBindingSize: a.limits.maxStorageBufferBindingSize,
        maxBufferSize: a.limits.maxBufferSize,
        maxComputeWorkgroupSizeX: 64
      }
    });
    return _e = a, ae = e, oe = !1, e.lost.then((t) => {
      oe || (oe = !0, console.error(`[GPU RT] Device lost: ${t.reason ?? "unknown"} — ${t.message}`), ae = null, _e = null);
    }), { adapter: a, device: e };
  } catch (a) {
    return console.warn("[GPU RT] Failed to initialize WebGPU:", a), null;
  }
}
function kn(a, e, t) {
  const s = a.allSurfaces, c = B.getState().containers, o = [], i = [], r = [], n = [];
  for (let w = 0; w < s.length; w++) {
    const A = s[w];
    o.push(A.uuid);
    const E = A.mesh, T = E.geometry, D = T.getAttribute("position"), O = T.getIndex();
    E.updateMatrixWorld(!0);
    const k = E.matrixWorld;
    if (O)
      for (let z = 0; z < O.count; z += 3) {
        for (let U = 0; U < 3; U++) {
          const G = O.getX(z + U), Ie = new C.Vector3(
            D.getX(G),
            D.getY(G),
            D.getZ(G)
          ).applyMatrix4(k);
          i.push(Ie.x, Ie.y, Ie.z);
        }
        const P = i.length - 9, F = et(
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
        r.push(F[0], F[1], F[2]), n.push(w);
      }
    else
      for (let z = 0; z < D.count; z += 3) {
        for (let U = 0; U < 3; U++) {
          const G = new C.Vector3(
            D.getX(z + U),
            D.getY(z + U),
            D.getZ(z + U)
          ).applyMatrix4(k);
          i.push(G.x, G.y, G.z);
        }
        const P = i.length - 9, F = et(
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
        r.push(F[0], F[1], F[2]), n.push(w);
      }
  }
  const l = n.length, h = new Float32Array(i), f = new Float32Array(r), g = new Uint32Array(n), d = new Float32Array(l * 3);
  for (let w = 0; w < l; w++) {
    const A = w * 9;
    d[w * 3] = (h[A] + h[A + 3] + h[A + 6]) / 3, d[w * 3 + 1] = (h[A + 1] + h[A + 4] + h[A + 7]) / 3, d[w * 3 + 2] = (h[A + 2] + h[A + 5] + h[A + 8]) / 3;
  }
  const u = new Uint32Array(l);
  for (let w = 0; w < l; w++) u[w] = w;
  const m = Me(h, d, u, 0, l, 0), y = new Float32Array(l * 9), p = new Float32Array(l * 3), b = new Uint32Array(l);
  for (let w = 0; w < l; w++) {
    const A = u[w];
    y.set(h.subarray(A * 9, A * 9 + 9), w * 9), p.set(f.subarray(A * 3, A * 3 + 3), w * 3), b[w] = g[A];
  }
  const { nodeArray: x, nodeCount: I } = Vn(m), v = t.length, R = new Float32Array(s.length * v * 2);
  for (let w = 0; w < s.length; w++) {
    const A = s[w];
    for (let E = 0; E < v; E++) {
      const T = (w * v + E) * 2;
      R[T] = A.absorptionFunction(t[E]), R[T + 1] = A.scatteringFunction(t[E]);
    }
  }
  const _ = [], S = [];
  for (const w of e) {
    const A = c[w];
    if (A) {
      _.push(w);
      const E = 0.1, T = A.scale, D = Math.max(Math.abs(T.x), Math.abs(T.y), Math.abs(T.z));
      S.push(A.position.x, A.position.y, A.position.z, E * D);
    }
  }
  return {
    bvhNodes: x,
    triangleVertices: y,
    triangleSurfaceIndex: b,
    triangleNormals: p,
    surfaceAcousticData: R,
    receiverSpheres: new Float32Array(S),
    triangleCount: l,
    nodeCount: I,
    surfaceCount: s.length,
    receiverCount: _.length,
    surfaceUuidMap: o,
    receiverUuidMap: _
  };
}
const Un = 8, Gn = 64;
function Me(a, e, t, s, c, o) {
  let i = 1 / 0, r = 1 / 0, n = 1 / 0, l = -1 / 0, h = -1 / 0, f = -1 / 0;
  for (let _ = s; _ < c; _++) {
    const S = t[_];
    for (let w = 0; w < 3; w++) {
      const A = S * 9 + w * 3, E = a[A], T = a[A + 1], D = a[A + 2];
      E < i && (i = E), E > l && (l = E), T < r && (r = T), T > h && (h = T), D < n && (n = D), D > f && (f = D);
    }
  }
  const g = c - s;
  if (g <= Un || o >= Gn)
    return { boundsMin: [i, r, n], boundsMax: [l, h, f], left: null, right: null, triStart: s, triCount: g };
  const d = l - i, u = h - r, m = f - n, y = d >= u && d >= m ? 0 : u >= m ? 1 : 2;
  let p = 1 / 0, b = -1 / 0;
  for (let _ = s; _ < c; _++) {
    const S = e[t[_] * 3 + y];
    S < p && (p = S), S > b && (b = S);
  }
  const x = (p + b) * 0.5;
  let I = s;
  for (let _ = s; _ < c; _++)
    if (e[t[_] * 3 + y] < x) {
      const S = t[I];
      t[I] = t[_], t[_] = S, I++;
    }
  (I === s || I === c) && (I = s + c >> 1);
  const v = Me(a, e, t, s, I, o + 1), R = Me(a, e, t, I, c, o + 1);
  return { boundsMin: [i, r, n], boundsMax: [l, h, f], left: v, right: R, triStart: -1, triCount: -1 };
}
function Vn(a) {
  let e = 0;
  const t = [a];
  for (; t.length > 0; ) {
    const i = t.pop();
    e++, i.left && t.push(i.left), i.right && t.push(i.right);
  }
  const s = new Float32Array(e * 8);
  let c = 0;
  function o(i) {
    const r = c++, n = r * 8;
    s[n] = i.boundsMin[0], s[n + 1] = i.boundsMin[1], s[n + 2] = i.boundsMin[2], s[n + 4] = i.boundsMax[0], s[n + 5] = i.boundsMax[1], s[n + 6] = i.boundsMax[2];
    const l = new Uint32Array(s.buffer);
    if (i.left && i.right) {
      const h = o(i.left), f = o(i.right);
      l[n + 3] = h, l[n + 7] = f;
    } else
      l[n + 3] = i.triStart, l[n + 7] = (i.triCount | 2147483648) >>> 0;
    return r;
  }
  return o(a), { nodeArray: s, nodeCount: e };
}
function et(a, e, t, s, c, o, i, r, n) {
  const l = s - a, h = c - e, f = o - t, g = i - a, d = r - e, u = n - t;
  let m = h * u - f * d, y = f * g - l * u, p = l * d - h * g;
  const b = Math.sqrt(m * m + y * y + p * p);
  return b > 1e-10 && (m /= b, y /= b, p /= b), [m, y, p];
}
const Hn = `// ─── GPU Ray Tracer Compute Shader ───────────────────────────────────
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
`, Y = 64, tt = 7, jn = 64, Rt = 16, nt = Rt * 4, ze = 16, st = ze * 4, Oe = 16, Ae = Oe * 4, qn = 20, rt = qn * 4;
class Yn {
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
  async initialize(e, t, s, c) {
    const o = await Ln();
    if (!o) return !1;
    this.device = o.device, this.config = s;
    const i = o.device.limits.maxStorageBufferBindingSize, r = o.device.limits.maxBufferSize, n = Y * Ae, l = Math.floor(Math.min(i, r) / n);
    if (l < 1)
      return console.error("[GPU RT] Device storage limits too small for even a single ray chain buffer"), !1;
    const h = Math.max(1, c), f = Math.min(h, l);
    f < h && console.warn(`[GPU RT] batchSize ${h} exceeds device limits; clamped to ${f}`), this.maxBatchSize = f, s.reflectionOrder > Y && console.warn(`[GPU RT] reflectionOrder ${s.reflectionOrder} clamped to ${Y}`);
    const g = s.frequencies.slice(0, tt);
    this.sceneBuf = kn(e, t, g), this.gpuBvhNodes = this.createStorageBuffer(this.sceneBuf.bvhNodes), this.gpuTriVerts = this.createStorageBuffer(this.sceneBuf.triangleVertices), this.gpuTriSurfIdx = this.createStorageBuffer(new Uint32Array(this.sceneBuf.triangleSurfaceIndex)), this.gpuTriNormals = this.createStorageBuffer(this.sceneBuf.triangleNormals), this.gpuSurfAcoustic = this.createStorageBuffer(this.sceneBuf.surfaceAcousticData);
    const d = this.sceneBuf.receiverSpheres.length > 0 ? this.sceneBuf.receiverSpheres : new Float32Array(4);
    this.gpuReceiverSpheres = this.createStorageBuffer(d);
    const u = f * nt, m = f * st, y = f * Y * Ae;
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
      size: rt,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackOutput = this.device.createBuffer({
      size: m,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackChain = this.device.createBuffer({
      size: y,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    const p = this.device.createShaderModule({ code: Hn });
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
    const c = Math.min(this.config.frequencies.length, tt), o = new ArrayBuffer(rt), i = new Uint32Array(o), r = new Float32Array(o);
    i[0] = t, i[1] = Math.min(this.config.reflectionOrder, Y), i[2] = c, i[3] = this.sceneBuf.receiverCount, i[4] = this.sceneBuf.triangleCount, i[5] = this.sceneBuf.nodeCount, i[6] = this.sceneBuf.surfaceCount, i[7] = s, r[8] = this.config.rrThreshold;
    for (let y = 0; y < c; y++)
      r[12 + y] = this.config.cachedAirAtt[y];
    this.device.queue.writeBuffer(this.gpuParams, 0, o), this.device.queue.writeBuffer(
      this.gpuRayInputs,
      0,
      e.buffer,
      e.byteOffset,
      t * nt
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
    }), l = Math.ceil(t / jn), h = this.device.createCommandEncoder(), f = h.beginComputePass();
    f.setPipeline(this.pipeline), f.setBindGroup(0, n), f.dispatchWorkgroups(l), f.end();
    const g = t * st, d = t * Y * Ae;
    h.copyBufferToBuffer(this.gpuRayOutputs, 0, this.gpuReadbackOutput, 0, g), h.copyBufferToBuffer(this.gpuChainBuffer, 0, this.gpuReadbackChain, 0, d), this.device.queue.submit([h.finish()]), await this.gpuReadbackOutput.mapAsync(GPUMapMode.READ, 0, g), await this.gpuReadbackChain.mapAsync(GPUMapMode.READ, 0, d);
    const u = new Float32Array(this.gpuReadbackOutput.getMappedRange(0, g).slice(0)), m = new Float32Array(this.gpuReadbackChain.getMappedRange(0, d).slice(0));
    return this.gpuReadbackOutput.unmap(), this.gpuReadbackChain.unmap(), this.parseResults(u, m, e, t, c);
  }
  parseResults(e, t, s, c, o) {
    const i = new Array(c), r = this.sceneBuf;
    for (let n = 0; n < c; n++) {
      const l = n * ze, h = new Uint32Array(e.buffer, l * 4, ze), f = h[0], g = h[1] !== 0;
      if (f === 0) {
        i[n] = null;
        continue;
      }
      const d = [
        e[l + 3],
        e[l + 4],
        e[l + 5]
      ], u = [];
      for (let R = 0; R < o; R++)
        u.push(e[l + 8 + R]);
      const m = [], y = n * Y;
      for (let R = 0; R < f; R++) {
        const _ = (y + R) * Oe, S = new Uint32Array(t.buffer, _ * 4, Oe), w = t[_], A = t[_ + 1], E = t[_ + 2], T = t[_ + 3], D = S[4], O = t[_ + 6], k = t[_ + 7], z = [];
        for (let F = 0; F < o; F++)
          z.push(t[_ + 8 + F]);
        let P;
        if (D >= r.surfaceCount) {
          const F = D - r.surfaceCount;
          P = r.receiverUuidMap[F] ?? "";
        } else
          P = r.surfaceUuidMap[D] ?? "";
        m.push({
          point: [w, A, E],
          distance: T,
          object: P,
          faceNormal: [0, 0, 0],
          faceIndex: -1,
          faceMaterialIndex: -1,
          angle: O,
          energy: k,
          bandEnergy: z
        });
      }
      const p = n * Rt, b = s[p + 6], x = s[p + 7], I = u.reduce((R, _) => R + _, 0), v = o > 0 ? I / o : 0;
      i[n] = {
        intersectedReceiver: g,
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
        arrivalDirection: g ? d : void 0
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
const we = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
)), { floor: $, random: $n, abs: ce } = Math, De = () => $n() > 0.5;
C.BufferGeometry.prototype.computeBoundsTree = xt;
C.BufferGeometry.prototype.disposeBoundsTree = St;
C.Mesh.prototype.raycast = _t;
class Wn extends It {
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
  _temperature;
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
    super(e), this.kind = "ray-tracer", e = { ...M, ...e }, this.uuid = e.uuid || this.uuid, this.name = e.name || M.name, this.observed_name = Gt(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = e.sourceIDs || M.sourceIDs, this.surfaceIDs = e.surfaceIDs || M.surfaceIDs, this.roomID = e.roomID || M.roomID, this.receiverIDs = e.receiverIDs || M.receiverIDs, this.updateInterval = e.updateInterval || M.updateInterval, this.reflectionOrder = e.reflectionOrder || M.reflectionOrder, this._isRunning = e.isRunning || M.isRunning, this._runningWithoutReceivers = e.runningWithoutReceivers || M.runningWithoutReceivers, this.frequencies = e.frequencies || M.frequencies, this._temperature = e.temperature ?? M.temperature, this._cachedAirAtt = W(this.frequencies, this._temperature), this.intervals = [], this.plotData = [], this.plotStyle = e.plotStyle || M.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = e.pointSize || M.pointSize, this.validRayCount = 0, this.intensitySampleRate = ct, this.quickEstimateResults = {};
    const t = typeof e.raysVisible == "boolean";
    this._raysVisible = t ? e.raysVisible : M.raysVisible;
    const s = typeof e.pointsVisible == "boolean";
    this._pointsVisible = s ? e.pointsVisible : M.pointsVisible;
    const c = typeof e.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = c ? e.invertedDrawStyle : M.invertedDrawStyle, this.passes = e.passes || M.passes, this.raycaster = new C.Raycaster(), this.rayBufferGeometry = new C.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new C.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(C.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new C.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(C.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.convergenceThreshold = e.convergenceThreshold ?? M.convergenceThreshold, this.autoStop = e.autoStop ?? M.autoStop, this.rrThreshold = e.rrThreshold ?? M.rrThreshold, this.maxStoredPaths = e.maxStoredPaths ?? M.maxStoredPaths, this.edgeDiffractionEnabled = e.edgeDiffractionEnabled ?? M.edgeDiffractionEnabled, this.lateReverbTailEnabled = e.lateReverbTailEnabled ?? M.lateReverbTailEnabled, this.tailCrossfadeTime = e.tailCrossfadeTime ?? M.tailCrossfadeTime, this.tailCrossfadeDuration = e.tailCrossfadeDuration ?? M.tailCrossfadeDuration, this.gpuEnabled = e.gpuEnabled ?? M.gpuEnabled, this.gpuBatchSize = e.gpuBatchSize ?? M.gpuBatchSize, this.hrtfSubjectId = e.hrtfSubjectId ?? "D1", this.headYaw = e.headYaw ?? 0, this.headPitch = e.headPitch ?? 0, this.headRoll = e.headRoll ?? 0, this._edgeGraph = null, this._histogramBinWidth = Yt, this._histogramNumBins = $t, this._convergenceCheckInterval = Wt, this._resetConvergenceState(), this.rays = new C.LineSegments(
      this.rayBufferGeometry,
      new C.LineBasicMaterial({
        fog: !1,
        color: 2631977,
        transparent: !0,
        opacity: 0.2,
        premultipliedAlpha: !0,
        blending: C.NormalBlending,
        depthFunc: C.AlwaysDepth,
        name: "raytracer-rays-material"
        // depthTest: false
      })
    ), this.rays.renderOrder = -0.5, this.rays.frustumCulled = !1, L.scene.add(this.rays);
    var o = new C.ShaderMaterial({
      fog: !1,
      vertexShader: Ue.vs,
      fragmentShader: Ue.fs,
      transparent: !0,
      premultipliedAlpha: !0,
      uniforms: {
        drawStyle: { value: lt.ENERGY },
        inverted: { value: 0 },
        pointScale: { value: this._pointSize }
      },
      blending: C.NormalBlending,
      name: "raytracer-points-material"
    });
    this.hits = new C.Points(this.rayBufferGeometry, o), this.hits.frustumCulled = !1, L.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
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
    }, L.overlays.global.addCell("Valid Rays", this.validRayCount, {
      id: this.uuid + "-valid-ray-count",
      hidden: !0,
      formatter: (i) => String(i)
    }), this.messageHandlerIDs = [], Z.postMessage("STATS_SETUP", this.stats), this.messageHandlerIDs.push(
      Z.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (i, ...r) => {
        console.log(r && r[0] && r[0] instanceof Array && r[1] && r[1] === this.uuid), r && r[0] && r[0] instanceof Array && r[1] && r[1] === this.uuid && (this.sourceIDs = r[0].map((n) => n.id));
      })
    ), this.messageHandlerIDs.push(
      Z.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (i, ...r) => {
        r && r[0] && r[0] instanceof Array && r[1] && r[1] === this.uuid && (this.receiverIDs = r[0].map((n) => n.id));
      })
    ), this.messageHandlerIDs.push(
      Z.addMessageHandler("SHOULD_REMOVE_CONTAINER", (i, ...r) => {
        const n = r[0];
        n && (console.log(n), this.sourceIDs.includes(n) ? this.sourceIDs = this.sourceIDs.filter((l) => l != n) : this.receiverIDs.includes(n) && (this.receiverIDs = this.receiverIDs.filter((l) => l != n)));
      })
    ), this.step = this.step.bind(this), this.calculateImpulseResponse = this.calculateImpulseResponse.bind(this);
  }
  update = () => {
  };
  get temperature() {
    return this._temperature;
  }
  set temperature(e) {
    this._temperature = e, this._cachedAirAtt = W(this.frequencies, e);
  }
  get c() {
    return ot(this._temperature);
  }
  save() {
    const {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: c,
      roomID: o,
      sourceIDs: i,
      surfaceIDs: r,
      receiverIDs: n,
      updateInterval: l,
      passes: h,
      pointSize: f,
      reflectionOrder: g,
      runningWithoutReceivers: d,
      raysVisible: u,
      pointsVisible: m,
      invertedDrawStyle: y,
      plotStyle: p,
      paths: b,
      frequencies: x,
      temperature: I,
      convergenceThreshold: v,
      autoStop: R,
      rrThreshold: _,
      maxStoredPaths: S,
      edgeDiffractionEnabled: w,
      lateReverbTailEnabled: A,
      tailCrossfadeTime: E,
      tailCrossfadeDuration: T,
      gpuEnabled: D,
      gpuBatchSize: O,
      hrtfSubjectId: k,
      headYaw: z,
      headPitch: P,
      headRoll: F
    } = this;
    return {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: c,
      roomID: o,
      sourceIDs: i,
      surfaceIDs: r,
      receiverIDs: n,
      updateInterval: l,
      passes: h,
      pointSize: f,
      reflectionOrder: g,
      runningWithoutReceivers: d,
      raysVisible: u,
      pointsVisible: m,
      invertedDrawStyle: y,
      plotStyle: p,
      paths: b,
      frequencies: x,
      temperature: I,
      convergenceThreshold: v,
      autoStop: R,
      rrThreshold: _,
      maxStoredPaths: S,
      edgeDiffractionEnabled: w,
      lateReverbTailEnabled: A,
      tailCrossfadeTime: E,
      tailCrossfadeDuration: T,
      gpuEnabled: D,
      gpuBatchSize: O,
      hrtfSubjectId: k,
      headYaw: z,
      headPitch: P,
      headRoll: F
    };
  }
  removeMessageHandlers() {
    this.messageHandlerIDs.forEach((e) => {
      Z.removeMessageHandler(e[0], e[1]);
    });
  }
  dispose() {
    this._isRunning && (this._isRunning = !1, this._gpuRunning = !1, cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => window.clearInterval(e)), this.intervals = []), this._disposeGpu(), this.removeMessageHandlers(), Object.keys(window.vars).forEach((e) => {
      window.vars[e].uuid === this.uuid && delete window.vars[e];
    }), L.scene.remove(this.rays), L.scene.remove(this.hits);
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
    this.hits.material.uniforms.drawStyle.value = e, this.hits.material.needsUpdate = !0, L.needsToRender = !0;
  }
  setPointScale(e) {
    this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0, L.needsToRender = !0;
  }
  incrementRayPositionIndex() {
    return this.rayPositionIndex < this.maxrays ? this.rayPositionIndex++ : (this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !0, this.rayPositionIndex);
  }
  rayPositionIndexDidOverflow = !1;
  appendRay(e, t, s = 1, c = 1) {
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, c), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, c), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex);
  }
  flushRayBuffer() {
    this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
  }
  inFrontOf(e, t) {
    return tn(e, t);
  }
  traceRay(e, t, s, c, o, i, r, n = 1, l = []) {
    return ht(
      this.raycaster,
      this.intersectableObjects,
      this.frequencies,
      this._cachedAirAtt,
      this.rrThreshold,
      e,
      t,
      s,
      c,
      o,
      i,
      r,
      n,
      l
    );
  }
  startQuickEstimate(e = this.frequencies, t = 1e3) {
    const s = this.runningWithoutReceivers;
    this.runningWithoutReceivers = !0;
    let c = 0;
    this.quickEstimateResults = {}, this.sourceIDs.forEach((o) => {
      this.quickEstimateResults[o] = [];
    }), this.intervals.push(
      window.setInterval(() => {
        for (let o = 0; o < this.passes; o++, c++)
          for (let i = 0; i < this.sourceIDs.length; i++) {
            const r = this.sourceIDs[i], n = B.getState().containers[r];
            this.quickEstimateResults[r].push(this.quickEstimateStep(n, e, t));
          }
        c >= t ? (this.intervals.forEach((o) => window.clearInterval(o)), this.runningWithoutReceivers = s, console.log(this.quickEstimateResults)) : console.log((c / t * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(e, t, s) {
    const c = this.c, o = Array(t.length).fill(0);
    let i = e.position.clone(), r, n, l, h;
    do
      r = Math.random() * 2 - 1, n = Math.random() * 2 - 1, l = Math.random() * 2 - 1, h = r * r + n * n + l * l;
    while (h > 1 || h < 1e-6);
    let f = new C.Vector3(r, n, l).normalize(), g = 0;
    const d = Array(t.length).fill(e.initialIntensity);
    let u = 0;
    const m = Ht;
    let y = !1, p = 0;
    W(t, this.temperature);
    let b = {};
    for (; !y && u < m; ) {
      this.raycaster.ray.set(i, f);
      const x = this.raycaster.intersectObjects(this.intersectableObjects, !0);
      if (x.length > 0) {
        g = f.clone().multiplyScalar(-1).angleTo(x[0].face.normal), p += x[0].distance;
        const I = x[0].object.parent;
        for (let R = 0; R < t.length; R++) {
          const _ = t[R];
          let S = 1;
          I.kind === "surface" && (S = I.reflectionFunction(_, g)), d[R] *= S;
          const w = e.initialIntensity / d[R] > qt;
          w && (o[R] = p / c), y = y || w;
        }
        x[0].object.parent instanceof it && (x[0].object.parent.numHits += 1);
        const v = x[0].face.normal.normalize();
        f.sub(v.clone().multiplyScalar(f.dot(v)).multiplyScalar(2)).normalize(), i.copy(x[0].point), b = x[0];
      }
      u += 1;
    }
    return this.stats.numRaysShot.value++, {
      distance: p,
      rt60s: o,
      angle: g,
      direction: f,
      lastIntersection: b
    };
  }
  startAllMonteCarlo() {
    this._lastConvergenceCheck = Date.now(), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = 0);
    const e = () => {
      if (!this._isRunning) return;
      const t = 12, s = performance.now();
      do
        this.stepStratified(this.passes);
      while (performance.now() - s < t);
      this.flushRayBuffer(), L.needsToRender = !0;
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
    const s = e / t;
    for (let c = 0; c < this.sourceIDs.length; c++) {
      const o = B.getState().containers[this.sourceIDs[c]], i = o.phi, r = o.theta, n = o.position, l = o.rotation, h = o.directivityHandler;
      this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
      const f = this.sourceIDs[c];
      let g = this._directivityRefPressures.get(f);
      if (!g || g.length !== this.frequencies.length) {
        g = new Array(this.frequencies.length);
        for (let d = 0; d < this.frequencies.length; d++)
          g[d] = h.getPressureAtPosition(0, this.frequencies[d], 0, 0);
        this._directivityRefPressures.set(f, g);
      }
      for (let d = 0; d < t; d++)
        for (let u = 0; u < s; u++) {
          this.__num_checked_paths += 1;
          const m = (d + Math.random()) / t * i, y = (u + Math.random()) / s * r;
          let p = xe(m, y);
          const b = new C.Vector3().setFromSphericalCoords(1, p[0], p[1]);
          b.applyEuler(l);
          const x = new Array(this.frequencies.length);
          for (let v = 0; v < this.frequencies.length; v++) {
            let R = 1;
            try {
              const _ = h.getPressureAtPosition(0, this.frequencies[v], m, y), S = g[v];
              typeof _ == "number" && typeof S == "number" && S > 0 && (R = (_ / S) ** 2);
            } catch {
            }
            x[v] = R;
          }
          const I = this.traceRay(n, b, this.reflectionOrder, x, f, m, y);
          I && this._handleTracedPath(I, n, f), this.stats.numRaysShot.value++;
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
      for (let o = 1; o < e.chain.length; o++)
        this.appendRay(e.chain[o - 1].point, e.chain[o].point, e.chain[o].energy || 1, e.chain[o].angle);
      const c = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(c, e), B.getState().containers[s].numRays += 1;
    } else if (e.intersectedReceiver) {
      this.appendRay(
        [t.x, t.y, t.z],
        e.chain[0].point,
        e.chain[0].energy || 1,
        e.chain[0].angle
      );
      for (let o = 1; o < e.chain.length; o++)
        this.appendRay(e.chain[o - 1].point, e.chain[o].point, e.chain[o].energy || 1, e.chain[o].angle);
      this.stats.numValidRayPaths.value++, this.validRayCount += 1, L.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
      const c = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(c, e), B.getState().containers[s].numRays += 1, this._addToEnergyHistogram(c, e);
    }
  }
  /** Push a path onto the paths array, evicting oldest if over maxStoredPaths */
  _pushPathWithEviction(e, t) {
    const s = Math.max(1, this.maxStoredPaths | 0);
    if (!this.paths[e]) {
      this.paths[e] = [t];
      return;
    }
    const c = this.paths[e];
    if (c.length >= s) {
      const o = c.length - s + 1;
      o > 0 && c.splice(0, o);
    }
    c.push(t);
  }
  /** Add a ray path's energy to the convergence histogram */
  _addToEnergyHistogram(e, t) {
    Tn(this._energyHistogram, e, t, this.frequencies, this.c, this._histogramBinWidth, this._histogramNumBins);
  }
  step() {
    for (let e = 0; e < this.sourceIDs.length; e++) {
      this.__num_checked_paths += 1;
      const t = Math.random() * B.getState().containers[this.sourceIDs[e]].theta, s = Math.random() * B.getState().containers[this.sourceIDs[e]].phi, c = B.getState().containers[this.sourceIDs[e]].position, o = B.getState().containers[this.sourceIDs[e]].rotation;
      let i = xe(s, t);
      const r = new C.Vector3().setFromSphericalCoords(1, i[0], i[1]);
      r.applyEuler(o);
      const n = B.getState().containers[this.sourceIDs[e]].directivityHandler;
      this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
      const l = this.sourceIDs[e];
      let h = this._directivityRefPressures.get(l);
      if (!h || h.length !== this.frequencies.length) {
        h = new Array(this.frequencies.length);
        for (let d = 0; d < this.frequencies.length; d++)
          h[d] = n.getPressureAtPosition(0, this.frequencies[d], 0, 0);
        this._directivityRefPressures.set(l, h);
      }
      const f = new Array(this.frequencies.length);
      for (let d = 0; d < this.frequencies.length; d++) {
        let u = 1;
        try {
          const m = n.getPressureAtPosition(0, this.frequencies[d], s, t), y = h[d];
          typeof m == "number" && typeof y == "number" && y > 0 && (u = (m / y) ** 2);
        } catch {
        }
        f[d] = u;
      }
      const g = this.traceRay(c, r, this.reflectionOrder, f, this.sourceIDs[e], s, t);
      if (g) {
        if (this._runningWithoutReceivers) {
          this.appendRay(
            [c.x, c.y, c.z],
            g.chain[0].point,
            g.chain[0].energy || 1,
            g.chain[0].angle
          );
          for (let u = 1; u < g.chain.length; u++)
            this.appendRay(
              // the previous point
              g.chain[u - 1].point,
              // the current point
              g.chain[u].point,
              // the energy content displayed as a color + alpha
              g.chain[u].energy || 1,
              g.chain[u].angle
            );
          const d = g.chain[g.chain.length - 1].object;
          this._pushPathWithEviction(d, g), B.getState().containers[this.sourceIDs[e]].numRays += 1;
        } else if (g.intersectedReceiver) {
          this.appendRay(
            [c.x, c.y, c.z],
            g.chain[0].point,
            g.chain[0].energy || 1,
            g.chain[0].angle
          );
          for (let u = 1; u < g.chain.length; u++)
            this.appendRay(
              // the previous point
              g.chain[u - 1].point,
              // the current point
              g.chain[u].point,
              // the energy content displayed as a color + alpha
              g.chain[u].energy || 1,
              g.chain[u].angle
            );
          this.stats.numValidRayPaths.value++, this.validRayCount += 1, L.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
          const d = g.chain[g.chain.length - 1].object;
          this._pushPathWithEviction(d, g), B.getState().containers[this.sourceIDs[e]].numRays += 1;
        }
      }
      this.stats.numRaysShot.value++;
    }
  }
  /** Reset convergence state for a new simulation run */
  _resetConvergenceState() {
    const e = Dn(this.frequencies.length);
    this.convergenceMetrics = e.convergenceMetrics, this._energyHistogram = e.energyHistogram, this._lastConvergenceCheck = e.lastConvergenceCheck;
  }
  /** Compute T30 from Schroeder backward integration of the energy histogram */
  _updateConvergenceMetrics() {
    En(
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
    this._isRunning = !0, this._cachedAirAtt = W(this.frequencies, this._temperature), this.mapIntersectableObjects(), this.edgeDiffractionEnabled && this.room ? this._edgeGraph = Bn(this.room.allSurfaces) : this._edgeGraph = null, this.__start_time = Date.now(), this.__num_checked_paths = 0, this._resetConvergenceState(), this.gpuEnabled ? this._startGpuMonteCarlo() : this.startAllMonteCarlo();
  }
  stop() {
    this._isRunning = !1, this.__calc_time = Date.now() - this.__start_time, this._gpuRunning = !1, this._gpuRayTracer && setTimeout(() => this._disposeGpu(), 0), cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => {
      window.clearInterval(e);
    }), this.intervals = [], Object.keys(this.paths).forEach((e) => {
      const t = this.__calc_time / 1e3, s = this.paths[e].length, c = s / t, o = this.__num_checked_paths, i = o / t;
      console.log({
        calc_time: t,
        num_valid_rays: s,
        valid_ray_rate: c,
        num_checks: o,
        check_rate: i
      }), this.paths[e].forEach((r) => {
        r.time = 0, r.totalLength = 0;
        for (let n = 0; n < r.chain.length; n++)
          r.totalLength += r.chain[n].distance, r.time += r.chain[n].distance / this.c;
      });
    }), this.edgeDiffractionEnabled && this._edgeGraph && this._edgeGraph.edges.length > 0 && this._computeDiffractionPaths(), this.mapIntersectableObjects(), this.reportImpulseResponse();
  }
  /** Compute deterministic diffraction paths and inject them into this.paths[] */
  _computeDiffractionPaths() {
    if (!this._edgeGraph) return;
    const e = B.getState().containers, t = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
    for (const r of this.sourceIDs) {
      const n = e[r];
      if (n) {
        t.set(r, [n.position.x, n.position.y, n.position.z]);
        const l = n.directivityHandler, h = new Array(this.frequencies.length);
        for (let f = 0; f < this.frequencies.length; f++)
          h[f] = l.getPressureAtPosition(0, this.frequencies[f], 0, 0);
        s.set(r, { handler: l, refPressures: h });
      }
    }
    const c = /* @__PURE__ */ new Map();
    for (const r of this.receiverIDs) {
      const n = e[r];
      n && c.set(r, [n.position.x, n.position.y, n.position.z]);
    }
    const o = [];
    this.room.surfaces.traverse((r) => {
      r.kind && r.kind === "surface" && o.push(r.mesh);
    });
    const i = Fn(
      this._edgeGraph,
      t,
      c,
      this.frequencies,
      this.c,
      this._temperature,
      this.raycaster,
      o
    );
    for (const r of i) {
      const n = s.get(r.sourceId);
      if (n) {
        const I = t.get(r.sourceId), v = r.diffractionPoint[0] - I[0], R = r.diffractionPoint[1] - I[1], _ = r.diffractionPoint[2] - I[2], S = Math.sqrt(v * v + R * R + _ * _);
        if (S > 1e-10) {
          const w = Math.acos(Math.max(-1, Math.min(1, R / S))) * (180 / Math.PI), A = Math.atan2(_, v) * (180 / Math.PI);
          for (let E = 0; E < this.frequencies.length; E++)
            try {
              const T = n.handler.getPressureAtPosition(0, this.frequencies[E], Math.abs(A), w), D = n.refPressures[E];
              typeof T == "number" && typeof D == "number" && D > 0 && (r.bandEnergy[E] *= (T / D) ** 2);
            } catch {
            }
        }
      }
      const l = r.bandEnergy.reduce((I, v) => I + v, 0) / r.bandEnergy.length, h = c.get(r.receiverId), f = h[0] - r.diffractionPoint[0], g = h[1] - r.diffractionPoint[1], d = h[2] - r.diffractionPoint[2], u = Math.sqrt(f * f + g * g + d * d), m = u > 1e-10 ? [f / u, g / u, d / u] : [0, 0, 1], y = t.get(r.sourceId), p = Math.sqrt(
        (r.diffractionPoint[0] - y[0]) ** 2 + (r.diffractionPoint[1] - y[1]) ** 2 + (r.diffractionPoint[2] - y[2]) ** 2
      ), b = r.totalDistance - p, x = {
        intersectedReceiver: !0,
        chain: [
          {
            distance: p,
            point: r.diffractionPoint,
            object: r.edge.surface0Id,
            faceNormal: r.edge.normal0,
            faceIndex: -1,
            faceMaterialIndex: -1,
            angle: 0,
            energy: l,
            bandEnergy: r.bandEnergy
          },
          {
            distance: b,
            point: h,
            object: r.receiverId,
            faceNormal: [0, 0, 0],
            faceIndex: -1,
            faceMaterialIndex: -1,
            angle: 0,
            energy: l,
            bandEnergy: r.bandEnergy
          }
        ],
        chainLength: 2,
        energy: l,
        bandEnergy: r.bandEnergy,
        time: r.time,
        source: r.sourceId,
        initialPhi: 0,
        initialTheta: 0,
        totalLength: r.totalDistance,
        arrivalDirection: m
      };
      this._pushPathWithEviction(r.receiverId, x);
    }
  }
  async reportImpulseResponse() {
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = B.getState().containers, t = N.sampleRate, s = [];
    for (const c of this.sourceIDs)
      for (const o of this.receiverIDs) {
        if (!this.paths[o] || this.paths[o].length === 0) continue;
        const i = this.paths[o].filter((r) => r.source === c);
        i.length > 0 && s.push({ sourceId: c, receiverId: o, paths: i });
      }
    if (s.length !== 0) {
      H("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let c = 0; c < s.length; c++) {
        const { sourceId: o, receiverId: i, paths: r } = s[c], n = e[o]?.name || "Source", l = e[i]?.name || "Receiver", h = Math.round(c / s.length * 100);
        H("UPDATE_PROGRESS", {
          progress: h,
          message: `Calculating IR: ${n} → ${l}`
        });
        try {
          const { normalizedSignal: f } = await this.calculateImpulseResponseForPair(o, i, r);
          o === this.sourceIDs[0] && i === this.receiverIDs[0] && this.calculateImpulseResponse().then((b) => {
            this.impulseResponse = b;
          }).catch(console.error);
          const g = jt, d = Math.max(1, Math.floor(f.length / g)), u = [];
          for (let b = 0; b < f.length; b += d)
            u.push({
              time: b / t,
              amplitude: f[b]
            });
          const m = `${this.uuid}-ir-${o}-${i}`, y = Le.getState().results[m], p = {
            kind: ke.ImpulseResponse,
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
          y ? H("UPDATE_RESULT", { uuid: m, result: p }) : H("ADD_RESULT", p);
        } catch (f) {
          console.error(`Failed to calculate impulse response for ${o} -> ${i}:`, f);
        }
      }
      H("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(e, t, s, c = q, o = this.frequencies, i = N.sampleRate) {
    let r;
    return this.lateReverbTailEnabled && this._energyHistogram[t] && (r = {
      energyHistogram: this._energyHistogram[t],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: o
    }), on(e, t, s, c, o, this.temperature, i, r);
  }
  async calculateImpulseResponseForDisplay(e = q, t = this.frequencies, s = N.sampleRate) {
    let c;
    return this.lateReverbTailEnabled && this.receiverIDs.length > 0 && this._energyHistogram[this.receiverIDs[0]] && (c = {
      energyHistogram: this._energyHistogram[this.receiverIDs[0]],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: t
    }), cn(this.receiverIDs, this.sourceIDs, this.paths, e, t, this.temperature, s, c);
  }
  clearRays() {
    if (this.room)
      for (let e = 0; e < this.room.allSurfaces.length; e++)
        this.room.allSurfaces[e].resetHits();
    this.validRayCount = 0, L.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount), this.rayBufferGeometry.setDrawRange(0, 1), this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !1, this.stats.numRaysShot.value = 0, this.stats.numValidRayPaths.value = 0, Z.postMessage("STATS_UPDATE", this.stats), this.sourceIDs.forEach((e) => {
      B.getState().containers[e].numRays = 0;
    }), this.paths = {}, this.mapIntersectableObjects(), L.needsToRender = !0, this.impulseResponse = void 0, this.clearImpulseResponseResults();
  }
  clearImpulseResponseResults() {
    const e = Le.getState().results;
    Object.keys(e).forEach((t) => {
      const s = e[t];
      s.from === this.uuid && s.kind === ke.ImpulseResponse && H("REMOVE_RESULT", t);
    });
  }
  reflectionLossFunction(e, t, s) {
    return he(e, t, s);
  }
  calculateReflectionLoss(e = this.frequencies) {
    const [t, s] = un(this.paths, this.room, this.receiverIDs, e);
    return this.allReceiverData = t, this.chartdata = s, [this.allReceiverData, s];
  }
  getReceiverIntersectionPoints(e) {
    return this.paths && this.paths[e] && this.paths[e].length > 0 ? this.paths[e].map(
      (t) => new C.Vector3().fromArray(t.chain[t.chain.length - 1].point)
    ) : [];
  }
  calculateResponseByIntensity(e = this.frequencies, t = this.temperature) {
    const s = fn(this.indexedPaths, this.receiverIDs, this.sourceIDs, e, t, this.intensitySampleRate);
    return s && (this.responseByIntensity = s), this.responseByIntensity;
  }
  resampleResponseByIntensity(e = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      const t = gt(this.responseByIntensity, e);
      return t && (this.responseByIntensity = t), this.responseByIntensity;
    } else
      console.warn("no data yet");
  }
  calculateT30(e, t) {
    if (this.responseByIntensity) {
      const s = e ? [e] : this.receiverIDs, c = t ? [t] : this.sourceIDs;
      for (const o of s)
        for (const i of c)
          this.responseByIntensity[o]?.[i] && pt(this.responseByIntensity, o, i);
    }
    return this.responseByIntensity;
  }
  calculateT20(e, t) {
    if (this.responseByIntensity) {
      const s = e ? [e] : this.receiverIDs, c = t ? [t] : this.sourceIDs;
      for (const o of s)
        for (const i of c)
          this.responseByIntensity[o]?.[i] && mt(this.responseByIntensity, o, i);
    }
    return this.responseByIntensity;
  }
  calculateT60(e, t) {
    if (this.responseByIntensity) {
      const s = e ? [e] : this.receiverIDs, c = t ? [t] : this.sourceIDs;
      for (const o of s)
        for (const i of c)
          this.responseByIntensity[o]?.[i] && yt(this.responseByIntensity, o, i);
    }
    return this.responseByIntensity;
  }
  onParameterConfigFocus() {
    console.log("focus"), console.log(L.overlays.global.cells), L.overlays.global.showCell(this.uuid + "-valid-ray-count");
  }
  onParameterConfigBlur() {
    console.log("blur"), L.overlays.global.hideCell(this.uuid + "-valid-ray-count");
  }
  pathsToLinearBuffer() {
    return mn(this.paths);
  }
  linearBufferToPaths(e) {
    return yn(e);
  }
  arrivalPressure(e, t, s, c = 1) {
    return Ne(e, t, s, c, this.temperature);
  }
  async calculateImpulseResponse(e = q, t = this.frequencies, s = N.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let c = this.paths[this.receiverIDs[0]].sort((f, g) => f.time - g.time);
    const o = c[c.length - 1].time + ee, i = Array(t.length).fill(e), r = $(s * o) * 2;
    let n = [];
    for (let f = 0; f < t.length; f++)
      n.push(new Float32Array(r));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let u = 0; u < c.length; u++)
        c[u].chainLength - 1 <= this.transitionOrder && c.splice(u, 1);
      let f = {
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
        frequencies: this.frequencies,
        temperature: this.temperature
      }, d = new Ot(f, !0).returnSortedPathsForHybrid(this.c, i, t);
      for (let u = 0; u < d.length; u++) {
        const m = De() ? 1 : -1, y = d[u].time, p = $(y * s);
        for (let b = 0; b < t.length; b++)
          n[b][p] += d[u].pressure[b] * m;
      }
    }
    const l = B.getState().containers[this.receiverIDs[0]];
    for (let f = 0; f < c.length; f++) {
      const g = De() ? 1 : -1, d = c[f].time, u = c[f].arrivalDirection || [0, 0, 1], m = l.getGain(u), y = this.arrivalPressure(i, t, c[f], m).map((b) => b * g), p = $(d * s);
      for (let b = 0; b < t.length; b++)
        n[b][p] += y[b];
    }
    if (this.lateReverbTailEnabled && this._energyHistogram[this.receiverIDs[0]]) {
      const f = ge(
        this._energyHistogram[this.receiverIDs[0]],
        t,
        this.tailCrossfadeTime,
        this._histogramBinWidth
      ), { tailSamples: g, tailStartSample: d } = pe(
        f,
        s
      ), u = $(this.tailCrossfadeDuration * s);
      n = me(n, g, d, u);
      const y = n.reduce((p, b) => Math.max(p, b.length), 0) * 2;
      for (let p = 0; p < t.length; p++)
        if (n[p].length < y) {
          const b = new Float32Array(y);
          b.set(n[p]), n[p] = b;
        }
    }
    const h = we();
    return new Promise((f, g) => {
      h.postMessage({ samples: n }), h.onmessage = (d) => {
        const u = d.data.samples, m = new Float32Array(u[0].length >> 1);
        let y = 0;
        for (let I = 0; I < u.length; I++)
          for (let v = 0; v < m.length; v++)
            m[v] += u[I][v], ce(m[v]) > y && (y = ce(m[v]));
        const p = Re(m), b = N.createOfflineContext(1, m.length, s), x = N.createBufferSource(p, b);
        x.connect(b.destination), x.start(), N.renderContextAsync(b).then((I) => f(I)).catch(g).finally(() => h.terminate());
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
  async calculateAmbisonicImpulseResponse(e = 1, t = q, s = this.frequencies, c = N.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");
    const o = this.paths[this.receiverIDs[0]].sort((d, u) => d.time - u.time);
    if (o.length === 0) throw Error("No valid ray paths found");
    const i = o[o.length - 1].time + ee;
    if (i <= 0) throw Error("Invalid impulse response duration");
    const r = Array(s.length).fill(t), n = $(c * i) * 2;
    if (n < 2) throw Error("Impulse response too short to process");
    const l = zt(e), h = [];
    for (let d = 0; d < s.length; d++) {
      h.push([]);
      for (let u = 0; u < l; u++)
        h[d].push(new Float32Array(n));
    }
    const f = B.getState().containers[this.receiverIDs[0]];
    for (let d = 0; d < o.length; d++) {
      const u = o[d], m = De() ? 1 : -1, y = u.time, p = u.arrivalDirection || [0, 0, 1], b = f.getGain(p), x = this.arrivalPressure(r, s, u, b).map((R) => R * m), I = $(y * c);
      if (I >= n) continue;
      const v = new Float32Array(1);
      for (let R = 0; R < s.length; R++) {
        v[0] = x[R];
        const _ = Mt(v, p[0], p[1], p[2], e, "threejs");
        for (let S = 0; S < l; S++)
          h[R][S][I] += _[S][0];
      }
    }
    if (this.lateReverbTailEnabled && this._energyHistogram[this.receiverIDs[0]]) {
      const d = ge(
        this._energyHistogram[this.receiverIDs[0]],
        s,
        this.tailCrossfadeTime,
        this._histogramBinWidth
      ), { tailSamples: u, tailStartSample: m } = pe(
        d,
        c
      ), y = $(this.tailCrossfadeDuration * c);
      for (let x = 0; x < s.length; x++) {
        const I = [h[x][0]], v = [u[x]], R = me(I, v, m, y);
        h[x][0] = R[0];
      }
      let p = 0;
      for (let x = 0; x < s.length; x++)
        for (let I = 0; I < l; I++)
          h[x][I].length > p && (p = h[x][I].length);
      const b = p * 2;
      for (let x = 0; x < s.length; x++)
        for (let I = 0; I < l; I++)
          if (h[x][I].length < b) {
            const v = new Float32Array(b);
            v.set(h[x][I]), h[x][I] = v;
          }
    }
    const g = we();
    return new Promise((d, u) => {
      const m = async (y) => new Promise((p) => {
        const b = [];
        for (let I = 0; I < s.length; I++)
          b.push(h[I][y]);
        const x = we();
        x.postMessage({ samples: b }), x.onmessage = (I) => {
          const v = I.data.samples, R = new Float32Array(v[0].length >> 1);
          for (let _ = 0; _ < v.length; _++)
            for (let S = 0; S < R.length; S++)
              R[S] += v[_][S];
          x.terminate(), p(R);
        };
      });
      Promise.all(
        Array.from({ length: l }, (y, p) => m(p))
      ).then((y) => {
        let p = 0;
        for (const v of y)
          for (let R = 0; R < v.length; R++)
            ce(v[R]) > p && (p = ce(v[R]));
        if (p > 0)
          for (const v of y)
            for (let R = 0; R < v.length; R++)
              v[R] /= p;
        const b = y[0].length;
        if (b === 0) {
          g.terminate(), u(new Error("Filtered signal has zero length"));
          return;
        }
        const I = N.createOfflineContext(l, b, c).createBuffer(l, b, c);
        for (let v = 0; v < l; v++)
          I.copyToChannel(new Float32Array(y[v]), v);
        g.terminate(), d(I);
      }).catch(u);
    });
  }
  ambisonicImpulseResponse;
  ambisonicOrder = 1;
  impulseResponse;
  impulseResponsePlaying = !1;
  async playImpulseResponse() {
    const e = await Rn(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      this.uuid
    );
    this.impulseResponse = e.impulseResponse;
  }
  downloadImpulses(e, t = q, s = at(125, 8e3), c = 44100) {
    bn(
      this.paths,
      this.receiverIDs,
      this.sourceIDs,
      (o, i, r, n) => this.arrivalPressure(o, i, r, n),
      e,
      t,
      s,
      c
    );
  }
  async downloadImpulseResponse(e, t = N.sampleRate) {
    const s = await In(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      e,
      t
    );
    this.impulseResponse = s.impulseResponse;
  }
  async downloadAmbisonicImpulseResponse(e, t = 1) {
    const s = await xn(
      this.ambisonicImpulseResponse,
      (c) => this.calculateAmbisonicImpulseResponse(c),
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
    (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder = e);
    let t = this.ambisonicImpulseResponse;
    (this.headYaw !== 0 || this.headPitch !== 0 || this.headRoll !== 0) && (t = wn(t, this.headYaw, this.headPitch, this.headRoll));
    const s = await Dt(this.hrtfSubjectId, e), c = await An(t, s);
    return this.binauralImpulseResponse = c.buffer, c.buffer;
  }
  async playBinauralImpulseResponse(e = 1) {
    const t = await Sn(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(e),
      this.uuid
    );
    this.binauralImpulseResponse = t.binauralImpulseResponse;
  }
  async downloadBinauralImpulseResponse(e, t = 1) {
    const s = await _n(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(t),
      e
    );
    this.binauralImpulseResponse = s.binauralImpulseResponse;
  }
  /** Initialize GPU ray tracer. Returns true on success. */
  async _initGpu() {
    if (!bt())
      return console.warn("[GPU RT] WebGPU not available in this browser"), !1;
    let e = null;
    try {
      return e = new Yn(), !await e.initialize(
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
      const c = this._gpuRayTracer.effectiveBatchSize, o = new Float32Array(c * e), i = async () => {
        if (!(!this._gpuRunning || !this._isRunning || !this._gpuRayTracer))
          try {
            if (!Number.isFinite(this.gpuBatchSize) || this.gpuBatchSize <= 0) {
              console.warn("[GPU RT] Invalid gpuBatchSize, falling back to CPU"), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
              return;
            }
            const r = Math.min(Math.floor(this.gpuBatchSize), c);
            let n = 0;
            for (let u = 0; u < this.sourceIDs.length && n < r; u++) {
              const m = B.getState().containers[this.sourceIDs[u]], y = m.position, p = m.rotation, b = m.phi, x = m.theta, I = m.directivityHandler, v = this.sourceIDs[u];
              this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
              let R = this._directivityRefPressures.get(v);
              if (!R || R.length !== this.frequencies.length) {
                R = new Array(this.frequencies.length);
                for (let w = 0; w < this.frequencies.length; w++)
                  R[w] = I.getPressureAtPosition(0, this.frequencies[w], 0, 0);
                this._directivityRefPressures.set(v, R);
              }
              const _ = Math.max(1, Math.floor(r / this.sourceIDs.length)), S = new C.Vector3();
              for (let w = 0; w < _ && n < r; w++) {
                const A = Math.random() * b, E = Math.random() * x, T = xe(A, E);
                S.setFromSphericalCoords(1, T[0], T[1]), S.applyEuler(p);
                const D = n * e;
                o[D] = y.x, o[D + 1] = y.y, o[D + 2] = y.z, o[D + 3] = S.x, o[D + 4] = S.y, o[D + 5] = S.z, o[D + 6] = A, o[D + 7] = E;
                for (let O = 0; O < t; O++) {
                  let k = 1;
                  try {
                    const z = I.getPressureAtPosition(0, this.frequencies[O], A, E), P = R[O];
                    typeof z == "number" && typeof P == "number" && P > 0 && (k = (z / P) ** 2);
                  } catch {
                  }
                  o[D + 8 + O] = k;
                }
                n++;
              }
            }
            const l = n, h = Math.floor(Math.random() * 4294967295), f = await this._gpuRayTracer.traceBatch(o, l, h);
            this.__num_checked_paths += l, this.stats.numRaysShot.value += l;
            const g = Math.max(1, Math.floor(l / Math.max(1, this.sourceIDs.length)));
            for (let u = 0; u < f.length; u++) {
              const m = f[u];
              if (!m) continue;
              const y = Math.min(
                Math.floor(u / Math.max(1, g)),
                this.sourceIDs.length - 1
              ), p = this.sourceIDs[y], b = B.getState().containers[p].position;
              m.source = p, this._handleTracedPath(m, b, p);
            }
            this.flushRayBuffer(), L.needsToRender = !0;
            const d = Date.now();
            if (this.autoStop && d - this._lastConvergenceCheck >= this._convergenceCheckInterval && (this._lastConvergenceCheck = d, this._updateConvergenceMetrics(), this.convergenceMetrics.convergenceRatio < this.convergenceThreshold && this.convergenceMetrics.t30Count >= 3)) {
              this.isRunning = !1;
              return;
            }
            this._gpuRunning && this._isRunning && (this._rafId = requestAnimationFrame(() => {
              i();
            }));
          } catch (r) {
            console.error("[GPU RT] Batch error, falling back to CPU:", r), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
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
      for (let s = 0; s < this.paths[t].length; s++) {
        const c = this.paths[t][s].source;
        e[t][c] ? e[t][c].push(this.paths[t][s]) : e[t][c] = [this.paths[t][s]];
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
    e != this._raysVisible && (this._raysVisible = e, this.rays.visible = e), L.needsToRender = !0;
  }
  get pointsVisible() {
    return this._pointsVisible;
  }
  set pointsVisible(e) {
    e != this._pointsVisible && (this._pointsVisible = e, this.hits.visible = e), L.needsToRender = !0;
  }
  get invertedDrawStyle() {
    return this._invertedDrawStyle;
  }
  set invertedDrawStyle(e) {
    this._invertedDrawStyle != e && (this._invertedDrawStyle = e, this.hits.material.uniforms.inverted.value = Number(e), this.hits.material.needsUpdate = !0), L.needsToRender = !0;
  }
  get pointSize() {
    return this._pointSize;
  }
  set pointSize(e) {
    Number.isFinite(e) && e > 0 && (this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0), L.needsToRender = !0;
  }
  get runningWithoutReceivers() {
    return this._runningWithoutReceivers;
  }
  set runningWithoutReceivers(e) {
    this.mapIntersectableObjects(), this._runningWithoutReceivers = e;
  }
}
j("RAYTRACER_CALL_METHOD", Et);
j("RAYTRACER_SET_PROPERTY", Tt);
j("REMOVE_RAYTRACER", Pt);
j("ADD_RAYTRACER", Bt(Wn));
j("RAYTRACER_CLEAR_RAYS", (a) => void X.getState().solvers[a].clearRays());
j("RAYTRACER_PLAY_IR", (a) => {
  X.getState().solvers[a].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
j("RAYTRACER_DOWNLOAD_IR", (a) => {
  const e = X.getState().solvers[a], t = B.getState().containers, s = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", c = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", o = `ir-${s}-${c}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(o).catch((i) => {
    window.alert(i.message || "Failed to download impulse response");
  });
});
j("RAYTRACER_DOWNLOAD_IR_OCTAVE", (a) => void X.getState().solvers[a].downloadImpulses(a));
j("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: a, order: e }) => {
  const t = X.getState().solvers[a], s = B.getState().containers, c = t.sourceIDs.length > 0 && s[t.sourceIDs[0]]?.name || "source", o = t.receiverIDs.length > 0 && s[t.receiverIDs[0]]?.name || "receiver", i = `ir-${c}-${o}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(i, e).catch((r) => {
    window.alert(r.message || "Failed to download ambisonic impulse response");
  });
});
j("RAYTRACER_PLAY_BINAURAL_IR", ({ uuid: a, order: e }) => {
  X.getState().solvers[a].playBinauralImpulseResponse(e).catch((s) => {
    window.alert(s.message || "Failed to play binaural impulse response");
  });
});
j("RAYTRACER_DOWNLOAD_BINAURAL_IR", ({ uuid: a, order: e }) => {
  const t = X.getState().solvers[a], s = B.getState().containers, c = t.sourceIDs.length > 0 && s[t.sourceIDs[0]]?.name || "source", o = t.receiverIDs.length > 0 && s[t.receiverIDs[0]]?.name || "receiver", i = `ir-${c}-${o}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadBinauralImpulseResponse(i, e).catch((r) => {
    window.alert(r.message || "Failed to download binaural impulse response");
  });
});
export {
  Wt as CONVERGENCE_CHECK_INTERVAL_MS,
  q as DEFAULT_INITIAL_SPL,
  ct as DEFAULT_INTENSITY_SAMPLE_RATE,
  lt as DRAWSTYLE,
  Yt as HISTOGRAM_BIN_WIDTH,
  $t as HISTOGRAM_NUM_BINS,
  jt as MAX_DISPLAY_POINTS,
  Xt as MAX_TAIL_END_TIME,
  Se as MIN_TAIL_DECAY_RATE,
  Ht as QUICK_ESTIMATE_MAX_ORDER,
  ee as RESPONSE_TIME_PADDING,
  qt as RT60_DECAY_RATIO,
  Vt as SELF_INTERSECTION_OFFSET,
  Wn as default,
  M as defaults,
  Re as normalize
};
//# sourceMappingURL=index-DHC6ILmY.mjs.map
