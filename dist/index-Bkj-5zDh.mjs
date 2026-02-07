import { S as xt } from "./solver-2Xqbhs6F.mjs";
import * as M from "three";
import { computeBoundsTree as It, disposeBoundsTree as St, acceleratedRaycast as _t } from "three-mesh-bvh";
import { S as it, u as P, b as De, L as le, P as ue, I as fe, y as At, e as H, F as ze, z as Dt, r as N, m as X, a as ke, R as Le, o as j, A as wt, s as Et, c as Tt, d as Pt, f as ee } from "./index-CXm_LEs2.mjs";
import { a as F, w as Oe, n as Mt, O as ot } from "./audio-engine-Bw0oX7Dw.mjs";
import { a as W } from "./air-attenuation-CBIk1QMo.mjs";
import { s as at } from "./sound-speed-Biev-mJ1.mjs";
import { e as Bt, g as Ct } from "./ambisonics.es-Ci32Q6qr.mjs";
import { ImageSourceSolver as zt } from "./index-BD3h9Uey.mjs";
function Ot(o) {
  return o.reduce((e, t) => e + t);
}
function Nt(o) {
  let e = Ot(o.map((t) => 10 ** (t / 10)));
  return 10 * Math.log10(e);
}
const Ft = `attribute vec2 color;
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
  vs: Ft,
  fs: kt
};
function Re(o, e) {
  let t = (360 - o) * (Math.PI / 180);
  return [e * (Math.PI / 180), t];
}
class Lt {
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
function Ut(o, e) {
  return new Lt(o);
}
const Gt = 0.01, ct = 256, q = 100, Q = 0.05, Vt = 1e3, Ht = 2e3, jt = 1e6, qt = 1e-3, Yt = 1e4, $t = 500, xe = 1, Wt = 10, C = {
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
var lt = /* @__PURE__ */ ((o) => (o[o.ENERGY = 0] = "ENERGY", o[o.ANGLE = 1] = "ANGLE", o[o.ANGLE_ENERGY = 2] = "ANGLE_ENERGY", o))(lt || {});
function ve(o) {
  let e = Math.abs(o[0]);
  for (let t = 1; t < o.length; t++)
    Math.abs(o[t]) > e && (e = Math.abs(o[t]));
  if (e !== 0)
    for (let t = 0; t < o.length; t++)
      o[t] /= e;
  return o;
}
function Xt(o) {
  return Math.random() < o;
}
const { abs: Zt } = Math, Ge = new M.Vector3(), Kt = new M.Vector3(), Jt = new M.Vector3(), Ve = new M.Vector3(), K = new M.Vector3(), Qt = new M.Vector3(), ne = new M.Vector3(), J = new M.Plane(), se = new M.Vector4(), He = new M.Vector4(), je = new M.Vector4(), qe = new M.Vector4();
function en(o, e) {
  return o.getPlane(J), se.set(J.normal.x, J.normal.y, J.normal.z, J.constant), He.set(e.a.x, e.a.y, e.a.z, 1), je.set(e.b.x, e.b.y, e.b.z, 1), qe.set(e.c.x, e.c.y, e.c.z, 1), se.dot(He) > 0 || se.dot(je) > 0 || se.dot(qe) > 0;
}
function ht(o, e, t, s, c, a, i, r, n, l, h, m, d = 1, f = []) {
  i = i.normalize(), o.ray.origin = a, o.ray.direction = i;
  const u = o.intersectObjects(e, !0);
  if (u.length > 0) {
    const p = n.reduce((g, b) => g + b, 0), y = n.length > 0 ? p / n.length : 0;
    if (u[0].object.userData?.kind === "receiver") {
      const g = u[0].face && Ge.copy(i).multiplyScalar(-1).angleTo(u[0].face.normal), b = u[0].distance, I = n.map(
        (_, S) => _ * Math.pow(10, -s[S] * b / 10)
      ), x = I.reduce((_, S) => _ + S, 0), v = I.length > 0 ? x / I.length : 0;
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
        bandEnergy: [...I]
      }), ne.copy(i).normalize().negate();
      const R = [ne.x, ne.y, ne.z];
      return {
        chain: f,
        chainLength: f.length,
        intersectedReceiver: !0,
        energy: v,
        bandEnergy: [...I],
        source: l,
        initialPhi: h,
        initialTheta: m,
        arrivalDirection: R
      };
    } else {
      const g = u[0].face && Ge.copy(i).multiplyScalar(-1).angleTo(u[0].face.normal);
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
      }), u[0].object.parent instanceof it && (u[0].object.parent.numHits += 1);
      const b = u[0].face && Kt.copy(u[0].face.normal).normalize();
      let I = b && u[0].face && Ve.copy(i).sub(Jt.copy(b).multiplyScalar(i.dot(b)).multiplyScalar(2));
      const x = u[0].object.parent, v = t.map((E) => x.scatteringFunction(E)), R = n.reduce((E, T) => E + T, 0) || 1;
      let _ = 0;
      for (let E = 0; E < t.length; E++)
        _ += v[E] * (n[E] || 0);
      if (_ /= R, Xt(_)) {
        do
          K.set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
          );
        while (K.lengthSq() > 1 || K.lengthSq() < 1e-6);
        K.normalize(), I = Ve.copy(K).add(b).normalize();
      }
      const S = u[0].distance, A = t.map((E, T) => {
        const w = n[T];
        if (w == null) return 0;
        let z = w * Zt(x.reflectionFunction(E, g));
        return z *= Math.pow(10, -s[T] * S / 10), z;
      }), D = Math.max(...A);
      if (I && b && d < r + 1) {
        if (D < c && D > 0) {
          const E = D / c;
          if (Math.random() > E) {
            const T = A.reduce((z, L) => z + L, 0), w = A.length > 0 ? T / A.length : 0;
            return { chain: f, chainLength: f.length, source: l, intersectedReceiver: !1, energy: w, bandEnergy: [...A] };
          }
          for (let T = 0; T < A.length; T++)
            A[T] /= E;
        }
        if (D > 0)
          return ht(
            o,
            e,
            t,
            s,
            c,
            Qt.copy(u[0].point).addScaledVector(b, Gt),
            I,
            r,
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
function tn(o) {
  var e, t, s = o.length;
  if (s === 1)
    e = 0, t = o[0][1];
  else {
    for (var c = 0, a = 0, i = 0, r = 0, n, l, h, m = 0; m < s; m++)
      n = o[m], l = n[0], h = n[1], c += l, a += h, i += l * l, r += l * h;
    e = (s * r - c * a) / (s * i - c * c), t = a / s - e * c / s;
  }
  return {
    m: e,
    b: t
  };
}
function te(o, e) {
  const t = o.length, s = [];
  for (let n = 0; n < t; n++)
    s.push([o[n], e[n]]);
  const { m: c, b: a } = tn(s);
  return { m: c, b: a, fx: (n) => c * n + a, fy: (n) => (n - a) / c };
}
const { log10: nn, pow: we, floor: de, max: Ee, min: Te, sqrt: Ye, cos: $e, PI: We, random: sn } = Math;
function ge(o, e, t, s) {
  const c = e.length, a = [];
  for (let i = 0; i < c; i++) {
    const r = o[i];
    let n = 0;
    for (let v = r.length - 1; v >= 0; v--)
      if (r[v] > 0) {
        n = v;
        break;
      }
    if (n < 2) {
      a.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const l = new Float32Array(n + 1);
    l[n] = r[n];
    for (let v = n - 1; v >= 0; v--)
      l[v] = l[v + 1] + r[v];
    const h = l[0];
    if (h <= 0) {
      a.push({ t60: 0, decayRate: 0, crossfadeLevel: 0, crossfadeTime: 0, endTime: 0 });
      continue;
    }
    const m = h * we(10, -5 / 10), d = h * we(10, -35 / 10);
    let f = -1, u = -1;
    for (let v = 0; v <= n; v++)
      f < 0 && l[v] <= m && (f = v), u < 0 && l[v] <= d && (u = v);
    let p = 0, y = 0;
    if (f >= 0 && u > f) {
      const v = [], R = [];
      for (let _ = f; _ <= u; _++) {
        const S = l[_];
        S > 0 && (v.push(_ * s), R.push(10 * nn(S / h)));
      }
      if (v.length >= 2) {
        const S = te(v, R).m;
        S < 0 && (p = S, y = -60 / S);
      }
    }
    p < 0 && p > -xe && (p = -xe, y = 60 / xe);
    let g = t;
    if (g <= 0) {
      const v = Ee(1, de(0.05 / s));
      g = Ee(0, n - v) * s;
    }
    const b = Te(de(g / s), n), I = b <= n && b >= 0 ? l[b] / h : 0, x = y > 0 ? Te(g + y, Wt) : g;
    a.push({ t60: y, decayRate: p, crossfadeLevel: I, crossfadeTime: g, endTime: x });
  }
  return a;
}
function pe(o, e) {
  let t = 0, s = 1 / 0;
  for (const n of o)
    n.endTime > t && (t = n.endTime), n.crossfadeTime > 0 && n.crossfadeTime < s && (s = n.crossfadeTime);
  if (t <= 0 || !isFinite(s))
    return { tailSamples: o.map(() => new Float32Array(0)), tailStartSample: 0, totalSamples: 0 };
  const c = de(s * e), a = de(t * e), i = a - c;
  if (i <= 0)
    return { tailSamples: o.map(() => new Float32Array(0)), tailStartSample: c, totalSamples: a };
  const r = [];
  for (const n of o) {
    const l = new Float32Array(i);
    if (n.decayRate >= 0 || n.crossfadeLevel <= 0) {
      r.push(l);
      continue;
    }
    const h = Ye(n.crossfadeLevel), m = 1 / Ye(3), d = h / m;
    for (let f = 0; f < i; f++) {
      const u = f / e, p = we(10, n.decayRate * u / 20), y = sn() * 2 - 1;
      l[f] = y * p * d;
    }
    r.push(l);
  }
  return { tailSamples: r, tailStartSample: c, totalSamples: a };
}
function me(o, e, t, s) {
  const c = o.length, a = [];
  for (let i = 0; i < c; i++) {
    const r = o[i], n = e[i];
    if (!n || n.length === 0) {
      a.push(r);
      continue;
    }
    const l = Ee(r.length, t + n.length), h = new Float32Array(l);
    for (let f = 0; f < Te(t, r.length); f++)
      h[f] = r[f];
    const m = s, d = m > 1 ? m - 1 : 1;
    for (let f = 0; f < m; f++) {
      const u = t + f;
      if (u >= l) break;
      const p = 0.5 * (1 + $e(We * f / d)), y = 0.5 * (1 - $e(We * f / d)), g = u < r.length ? r[u] : 0, b = f < n.length ? n[f] : 0;
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
const { floor: Z, abs: rn, max: ut } = Math, ft = () => Math.random() > 0.5, dt = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
));
function Ne(o, e, t, s = 1, c = 20) {
  const a = De(le(o));
  if (t.bandEnergy && t.bandEnergy.length === e.length) {
    for (let h = 0; h < e.length; h++)
      a[h] *= t.bandEnergy[h];
    const l = le(ue(fe(a)));
    if (s !== 1)
      for (let h = 0; h < l.length; h++) l[h] *= s;
    return l;
  }
  t.chain.slice(0, -1).forEach((l) => {
    const h = P.getState().containers[l.object];
    a.forEach((m, d) => {
      const f = rn(h.reflectionFunction(e[d], l.angle));
      a[d] = m * f;
    });
  });
  const i = ue(fe(a)), r = W(e, c);
  e.forEach((l, h) => i[h] -= r[h] * t.totalLength);
  const n = le(i);
  if (s !== 1)
    for (let l = 0; l < n.length; l++) n[l] *= s;
  return n;
}
async function on(o, e, t, s = q, c, a, i = F.sampleRate, r) {
  if (t.length === 0) throw Error("No rays have been traced for this pair");
  let n = t.sort((p, y) => p.time - y.time);
  const l = n[n.length - 1].time + Q, h = Array(c.length).fill(s), m = Z(i * l) * 2;
  let d = [];
  for (let p = 0; p < c.length; p++)
    d.push(new Float32Array(m));
  const f = P.getState().containers[e];
  for (let p = 0; p < n.length; p++) {
    const y = ft() ? 1 : -1, g = n[p].time, b = n[p].arrivalDirection || [0, 0, 1], I = f.getGain(b), x = Ne(h, c, n[p], I, a).map((R) => R * y), v = Z(g * i);
    for (let R = 0; R < c.length; R++)
      d[R][v] += x[R];
  }
  if (r && r.energyHistogram && r.energyHistogram.length > 0) {
    const p = ge(
      r.energyHistogram,
      r.frequencies,
      r.crossfadeTime,
      r.histogramBinWidth
    ), { tailSamples: y, tailStartSample: g } = pe(
      p,
      i
    ), b = Z(r.crossfadeDuration * i);
    d = me(d, y, g, b);
    const x = d.reduce((v, R) => ut(v, R.length), 0) * 2;
    for (let v = 0; v < c.length; v++)
      if (d[v].length < x) {
        const R = new Float32Array(x);
        R.set(d[v]), d[v] = R;
      }
  }
  const u = dt();
  return new Promise((p, y) => {
    u.postMessage({ samples: d }), u.onmessage = (g) => {
      const b = g.data.samples, I = new Float32Array(b[0].length >> 1);
      for (let v = 0; v < b.length; v++)
        for (let R = 0; R < I.length; R++)
          I[R] += b[v][R];
      const x = ve(I.slice());
      u.terminate(), p({ signal: I, normalizedSignal: x });
    }, u.onerror = (g) => {
      u.terminate(), y(g);
    };
  });
}
async function an(o, e, t, s = q, c, a, i = F.sampleRate, r) {
  if (o.length == 0) throw Error("No receivers have been assigned to the raytracer");
  if (e.length == 0) throw Error("No sources have been assigned to the raytracer");
  if (t[o[0]].length == 0) throw Error("No rays have been traced yet");
  let n = t[o[0]].sort((p, y) => p.time - y.time);
  const l = n[n.length - 1].time + Q, h = Array(c.length).fill(s), m = Z(i * l) * 2;
  let d = [];
  for (let p = 0; p < c.length; p++)
    d.push(new Float32Array(m));
  const f = P.getState().containers[o[0]];
  for (let p = 0; p < n.length; p++) {
    const y = ft() ? 1 : -1, g = n[p].time, b = n[p].arrivalDirection || [0, 0, 1], I = f.getGain(b), x = Ne(h, c, n[p], I, a).map((R) => R * y), v = Z(g * i);
    for (let R = 0; R < c.length; R++)
      d[R][v] += x[R];
  }
  if (r && r.energyHistogram && r.energyHistogram.length > 0) {
    const p = ge(
      r.energyHistogram,
      r.frequencies,
      r.crossfadeTime,
      r.histogramBinWidth
    ), { tailSamples: y, tailStartSample: g } = pe(
      p,
      i
    ), b = Z(r.crossfadeDuration * i);
    d = me(d, y, g, b);
    const x = d.reduce((v, R) => ut(v, R.length), 0) * 2;
    for (let v = 0; v < c.length; v++)
      if (d[v].length < x) {
        const R = new Float32Array(x);
        R.set(d[v]), d[v] = R;
      }
  }
  const u = dt();
  return new Promise((p, y) => {
    u.postMessage({ samples: d }), u.onmessage = (g) => {
      const b = g.data.samples, I = new Float32Array(b[0].length >> 1);
      for (let v = 0; v < b.length; v++)
        for (let R = 0; R < I.length; R++)
          I[R] += b[v][R];
      const x = ve(I.slice());
      u.terminate(), p({ signal: I, normalizedSignal: x });
    }, u.onerror = (g) => {
      u.terminate(), y(g);
    };
  });
}
function Fe(o, e = 1) {
  let t = o.slice();
  for (let s = 0; s < o.length; s++)
    if (s >= e && s < o.length - e) {
      const c = s - e, a = s + e;
      let i = 0;
      for (let r = c; r < a; r++)
        i += o[r];
      t[s] = i / (2 * e);
    }
  return t;
}
const { floor: cn, abs: ln } = Math;
function he(o, e, t) {
  const s = e.chain.slice(0, -1);
  if (s && s.length > 0) {
    let c = 1;
    for (let a = 0; a < s.length; a++) {
      const i = s[a], r = o.surfaceMap[i.object], n = i.angle || 0;
      c = c * ln(r.reflectionFunction(t, n));
    }
    return c;
  }
  return 1;
}
function hn(o, e, t, s) {
  const c = [], a = (n, l) => ({ label: n, data: l }), i = [];
  if (s)
    for (let n = 0; n < s.length; n++)
      i.push(a(s[n].toString(), []));
  const r = Object.keys(o);
  for (let n = 0; n < r.length; n++) {
    c.push({
      id: r[n],
      data: []
    });
    for (let l = 0; l < o[r[n]].length; l++) {
      const h = o[r[n]][l];
      let m;
      s ? (m = s.map((d) => ({
        frequency: d,
        value: he(e, h, d)
      })), s.forEach((d, f) => {
        i[f].data.push([h.time, he(e, h, d)]);
      })) : m = (d) => he(e, h, d), c[c.length - 1].data.push({
        time: h.time,
        energy: m
      });
    }
    c[c.length - 1].data = c[c.length - 1].data.sort((l, h) => l.time - h.time);
  }
  for (let n = 0; n < i.length; n++)
    i[n].data = i[n].data.sort((l, h) => l[0] - h[0]), i[n].x = i[n].data.map((l) => l[0]), i[n].y = i[n].data.map((l) => l[1]);
  return [c, i];
}
function un(o, e, t, s, c, a) {
  const i = o, r = at(c), n = W(s, c), l = {};
  for (const h in i) {
    l[h] = {};
    const m = P.getState().containers[h];
    for (const d in i[h]) {
      l[h][d] = {
        freqs: s,
        response: []
      };
      for (let f = 0; f < i[h][d].length; f++) {
        let u = 0, p = [], y = i[h][d][f].initialPhi, g = i[h][d][f].initialTheta, b = P.getState().containers[d].directivityHandler;
        for (let S = 0; S < s.length; S++)
          p[S] = De(b.getPressureAtPosition(0, s[S], y, g));
        const x = i[h][d][f].arrivalDirection || [0, 0, 1], v = m.getGain(x), R = v * v;
        if (R !== 1)
          for (let S = 0; S < s.length; S++)
            p[S] *= R;
        for (let S = 0; S < i[h][d][f].chain.length; S++) {
          const { angle: A, distance: D } = i[h][d][f].chain[S];
          u += D / r;
          const E = i[h][d][f].chain[S].object, T = P.getState().containers[E] || null;
          for (let w = 0; w < s.length; w++) {
            const z = s[w];
            let L = 1;
            T && T.kind === "surface" && (L = T.reflectionFunction(z, A)), p[w] = De(
              le(ue(fe(p[w] * L)) - n[w] * D)
            );
          }
        }
        const _ = ue(fe(p));
        l[h][d].response.push({
          time: u,
          level: _,
          bounces: i[h][d][f].chain.length
        });
      }
      l[h][d].response.sort((f, u) => f.time - u.time);
    }
  }
  return gt(l, a);
}
function gt(o, e = ct) {
  if (o) {
    for (const t in o)
      for (const s in o[t]) {
        const { response: c, freqs: a } = o[t][s], i = c[c.length - 1].time, r = cn(e * i);
        o[t][s].resampledResponse = Array(a.length).fill(0).map((d) => new Float32Array(r)), o[t][s].sampleRate = e;
        let n = 0, l = [], h = a.map((d) => 0), m = !1;
        for (let d = 0, f = 0; d < r; d++) {
          let u = d / r * i;
          if (c[f] && c[f].time) {
            let p = c[f].time;
            if (p > u) {
              for (let y = 0; y < a.length; y++)
                o[t][s].resampledResponse[y][n] = 0;
              m && l.push(n), n++;
              continue;
            }
            if (p <= u) {
              let y = c[f].level.map((g) => 0);
              for (; p <= u; ) {
                p = c[f].time;
                for (let g = 0; g < a.length; g++)
                  y[g] = Nt([y[g], c[f].level[g]]);
                f++;
              }
              for (let g = 0; g < a.length; g++) {
                if (o[t][s].resampledResponse[g][n] = y[g], l.length > 0) {
                  const b = h[g], I = y[g];
                  for (let x = 0; x < l.length; x++) {
                    const v = At(b, I, (x + 1) / (l.length + 1));
                    o[t][s].resampledResponse[g][l[x]] = v;
                  }
                }
                h[g] = y[g];
              }
              l.length > 0 && (l = []), m = !0, n++;
              continue;
            }
          }
        }
        mt(o, t, s), pt(o, t, s), yt(o, t, s);
      }
    return o;
  } else
    console.warn("no data yet");
}
function pt(o, e, t) {
  const s = e, c = t, a = o[s][c].resampledResponse, i = o[s][c].sampleRate;
  if (a && i) {
    const r = new Float32Array(a[0].length);
    for (let n = 0; n < a[0].length; n++)
      r[n] = n / i;
    o[s][c].t30 = a.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const m = h - 30, f = Fe(n, 2).filter((u) => u >= m).length;
      return te(r.slice(0, f), n.slice(0, f));
    });
  }
}
function mt(o, e, t) {
  const s = e, c = t, a = o[s][c].resampledResponse, i = o[s][c].sampleRate;
  if (a && i) {
    const r = new Float32Array(a[0].length);
    for (let n = 0; n < a[0].length; n++)
      r[n] = n / i;
    o[s][c].t20 = a.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const m = h - 20, f = Fe(n, 2).filter((u) => u >= m).length;
      return te(r.slice(0, f), n.slice(0, f));
    });
  }
}
function yt(o, e, t) {
  const s = e, c = t, a = o[s][c].resampledResponse, i = o[s][c].sampleRate;
  if (a && i) {
    const r = new Float32Array(a[0].length);
    for (let n = 0; n < a[0].length; n++)
      r[n] = n / i;
    o[s][c].t60 = a.map((n) => {
      let l = 0, h = n[l];
      for (; h === 0; )
        h = n[l++];
      for (let u = l; u >= 0; u--)
        n[u] = h;
      const m = h - 60, f = Fe(n, 2).filter((u) => u >= m).length;
      return te(r.slice(0, f), n.slice(0, f));
    });
  }
}
const vt = -2;
function fn(o) {
  const s = (n) => String.fromCharCode(...n), c = (n) => {
    let l = 0;
    const h = s(n.slice(l, l += 36)), m = n[l++], d = n[l++], f = n[l++], u = n[l++], p = n[l++], y = [n[l++], n[l++], n[l++]], g = [n[l++], n[l++], n[l++]];
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
      const m = s(n.slice(h, h += 36)), d = n[h++], f = n[h++], u = !!n[h++], p = n[h++], y = [];
      for (let g = 0; g < d; g++)
        y.push(c(n.slice(h, h += 47)));
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
  const r = {};
  for (; i < o.length; ) {
    const n = s(o.slice(i, i += 36)), l = o[i++], h = a(o.slice(i, i += l));
    r[n] = h;
  }
  return r;
}
function dn(o) {
  const e = /* @__PURE__ */ new Set();
  for (const n of Object.keys(o)) {
    e.add(n);
    for (const l of o[n]) {
      e.add(l.source);
      for (const h of l.chain)
        e.add(h.object);
    }
  }
  const t = Array.from(e), s = /* @__PURE__ */ new Map();
  for (let n = 0; n < t.length; n++)
    s.set(t[n], n);
  const c = 2 + t.length * 36;
  let a = 0;
  for (const n of Object.keys(o)) {
    a += 2;
    for (const l of o[n])
      a += 5, a += l.chain.length * 12;
  }
  const i = new Float32Array(c + a);
  let r = 0;
  i[r++] = vt, i[r++] = t.length;
  for (const n of t)
    for (let l = 0; l < 36; l++)
      i[r++] = n.charCodeAt(l);
  for (const n of Object.keys(o)) {
    i[r++] = s.get(n);
    let l = 0;
    for (const h of o[n])
      l += 5 + h.chain.length * 12;
    i[r++] = l;
    for (const h of o[n]) {
      i[r++] = s.get(h.source), i[r++] = h.chain.length, i[r++] = h.time, i[r++] = Number(h.intersectedReceiver), i[r++] = h.energy;
      for (const m of h.chain)
        i[r++] = s.get(m.object), i[r++] = m.angle, i[r++] = m.distance, i[r++] = m.energy, i[r++] = m.faceIndex, i[r++] = m.faceMaterialIndex, i[r++] = m.faceNormal[0], i[r++] = m.faceNormal[1], i[r++] = m.faceNormal[2], i[r++] = m.point[0], i[r++] = m.point[1], i[r++] = m.point[2];
    }
  }
  return i;
}
function gn(o) {
  let e = 0;
  e++;
  const t = o[e++];
  if (!Number.isFinite(t) || t < 0 || t !== (t | 0))
    throw new Error("Invalid V2 buffer: bad numUUIDs");
  if (e + t * 36 > o.length)
    throw new Error("Invalid V2 buffer: UUID table exceeds buffer length");
  const s = [];
  for (let a = 0; a < t; a++) {
    const i = [];
    for (let r = 0; r < 36; r++)
      i.push(o[e++]);
    s.push(String.fromCharCode(...i));
  }
  const c = {};
  for (; e < o.length; ) {
    const a = o[e++];
    if (a < 0 || a >= s.length)
      throw new Error("Invalid V2 buffer: receiver index out of range");
    const i = s[a], r = o[e++];
    if (!Number.isFinite(r) || r < 0)
      throw new Error("Invalid V2 buffer: bad pathBufLen");
    const n = Math.min(e + r, o.length), l = [];
    for (; e < n; ) {
      const h = s[o[e++]], m = o[e++], d = o[e++], f = !!o[e++], u = o[e++], p = [];
      for (let y = 0; y < m; y++) {
        const g = s[o[e++]], b = o[e++], I = o[e++], x = o[e++], v = o[e++], R = o[e++], _ = [o[e++], o[e++], o[e++]], S = [o[e++], o[e++], o[e++]];
        p.push({
          object: g,
          angle: b,
          distance: I,
          energy: x,
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
    c[i] = l;
  }
  return c;
}
function pn(o) {
  return dn(o);
}
function mn(o) {
  return o.length === 0 ? {} : o[0] === vt ? gn(o) : fn(o);
}
const { floor: Xe, abs: Ze } = Math, yn = () => Math.random() > 0.5;
function vn(o, e, t, s, c, a = q, i = ot(125, 8e3), r = 44100) {
  if (e.length === 0) throw Error("No receivers have been assigned to the raytracer");
  if (t.length === 0) throw Error("No sources have been assigned to the raytracer");
  if (o[e[0]].length === 0) throw Error("No rays have been traced yet");
  const n = o[e[0]].sort((p, y) => p.time - y.time), l = n[n.length - 1].time + Q, h = Array(i.length).fill(a), m = Xe(r * l), d = [];
  for (let p = 0; p < i.length; p++)
    d.push(new Float32Array(m));
  let f = 0;
  const u = P.getState().containers[e[0]];
  for (let p = 0; p < n.length; p++) {
    const y = yn() ? 1 : -1, g = n[p].time, b = n[p].arrivalDirection || [0, 0, 1], I = u.getGain(b), x = s(h, i, n[p], I).map((R) => R * y), v = Xe(g * r);
    for (let R = 0; R < i.length; R++)
      d[R][v] += x[R], Ze(d[R][v]) > f && (f = Ze(d[R][v]));
  }
  for (let p = 0; p < i.length; p++) {
    const y = Oe([Mt(d[p])], { sampleRate: r, bitDepth: 32 });
    ze.saveAs(y, `${i[p]}_${c}.wav`);
  }
}
async function bn(o, e, t) {
  if (!o)
    try {
      o = await e();
    } catch (c) {
      throw c;
    }
  F.context.state === "suspended" && F.context.resume(), console.log(o);
  const s = F.context.createBufferSource();
  return s.buffer = o, s.connect(F.context.destination), s.start(), H("RAYTRACER_SET_PROPERTY", { uuid: t, property: "impulseResponsePlaying", value: !0 }), s.onended = () => {
    s.stop(), s.disconnect(F.context.destination), H("RAYTRACER_SET_PROPERTY", { uuid: t, property: "impulseResponsePlaying", value: !1 });
  }, { impulseResponse: o };
}
async function Rn(o, e, t, s = F.sampleRate) {
  if (!o)
    try {
      o = await e();
    } catch (i) {
      throw i;
    }
  const c = Oe([ve(o.getChannelData(0))], { sampleRate: s, bitDepth: 32 }), a = t.endsWith(".wav") ? "" : ".wav";
  return ze.saveAs(c, t + a), { impulseResponse: o };
}
async function xn(o, e, t, s = 1, c) {
  (!o || t !== s) && (t = s, o = await e(s));
  const a = o.numberOfChannels, i = o.sampleRate, r = [];
  for (let m = 0; m < a; m++)
    r.push(o.getChannelData(m));
  const n = Oe(r, { sampleRate: i, bitDepth: 32 }), l = c.endsWith(".wav") ? "" : ".wav", h = s === 1 ? "FOA" : `HOA${s}`;
  return ze.saveAs(n, `${c}_${h}${l}`), { ambisonicImpulseResponse: o, ambisonicOrder: t };
}
function In(o) {
  const e = {
    totalRays: 0,
    validRays: 0,
    estimatedT30: new Array(o).fill(0),
    t30Mean: new Array(o).fill(0),
    t30M2: new Array(o).fill(0),
    t30Count: 0,
    convergenceRatio: 1 / 0
  }, t = {}, s = Date.now();
  return { convergenceMetrics: e, energyHistogram: t, lastConvergenceCheck: s };
}
function Sn(o, e, t, s, c, a, i, r, n) {
  o.totalRays = c, o.validRays = a;
  const l = Object.keys(e);
  if (l.length === 0) return;
  let h;
  if (s.length > 0)
    for (const g of s) {
      const b = e[g];
      if (b && b.length > 0) {
        h = g;
        break;
      }
    }
  if (!h) {
    const g = l.slice().sort();
    for (const b of g) {
      const I = e[b];
      if (I && I.length > 0) {
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
    let I = 0;
    for (let D = r - 1; D >= 0; D--)
      if (b[D] > 0) {
        I = D;
        break;
      }
    if (I < 2) {
      f[g] = 0;
      continue;
    }
    const x = new Float32Array(I + 1);
    x[I] = b[I];
    for (let D = I - 1; D >= 0; D--)
      x[D] = x[D + 1] + b[D];
    const v = x[0];
    if (v <= 0) {
      f[g] = 0;
      continue;
    }
    const R = v * Math.pow(10, -5 / 10), _ = v * Math.pow(10, -35 / 10);
    let S = -1, A = -1;
    for (let D = 0; D <= I; D++)
      S < 0 && x[D] <= R && (S = D), A < 0 && x[D] <= _ && (A = D);
    if (S >= 0 && A > S) {
      const D = [], E = [];
      for (let T = S; T <= A; T++) {
        const w = x[T];
        w > 0 && (D.push(T * i), E.push(10 * Math.log10(w / v)));
      }
      if (D.length >= 2) {
        const w = te(D, E).m;
        f[g] = w < 0 ? 60 / -w : 0;
      }
    }
  }
  o.estimatedT30 = f, o.t30Count += 1;
  const u = o.t30Count;
  let p = 0, y = 0;
  for (let g = 0; g < d; g++) {
    const b = f[g], I = o.t30Mean[g], x = I + (b - I) / u, R = o.t30M2[g] + (b - I) * (b - x);
    if (o.t30Mean[g] = x, o.t30M2[g] = R, u >= 2 && x > 0) {
      const _ = R / (u - 1), S = Math.sqrt(_) / x;
      S > p && (p = S), y++;
    }
  }
  o.convergenceRatio = y > 0 ? p : 1 / 0, H("RAYTRACER_SET_PROPERTY", {
    uuid: n,
    property: "convergenceMetrics",
    value: { ...o }
  });
}
function _n(o, e, t, s, c, a, i) {
  if (!o[e]) {
    o[e] = [];
    for (let l = 0; l < s.length; l++)
      o[e].push(new Float32Array(i));
  }
  let r = 0;
  for (let l = 0; l < t.chain.length; l++)
    r += t.chain[l].distance;
  r /= c;
  const n = Math.floor(r / a);
  if (n >= 0 && n < i && t.bandEnergy)
    for (let l = 0; l < s.length; l++)
      o[e][l][n] += t.bandEnergy[l] || 0;
}
function Ke(o, e, t, s) {
  const c = o / s, a = e / s, i = t / s, r = Math.floor(c), n = Math.floor(a), l = Math.floor(i), h = [`${r},${n},${l}`], m = [0, -1, 1];
  for (const d of m)
    for (const f of m)
      for (const u of m) {
        if (d === 0 && f === 0 && u === 0) continue;
        const p = r + d, y = n + f, g = l + u;
        Math.abs(c - (p + 0.5)) < 1 && Math.abs(a - (y + 0.5)) < 1 && Math.abs(i - (g + 0.5)) < 1 && h.push(`${p},${y},${g}`);
      }
  return h;
}
function An(o, e) {
  return o < e ? `${o}|${e}` : `${e}|${o}`;
}
function Dn(o, e = 1e-4) {
  const t = Dt(e), s = e * 10, c = /* @__PURE__ */ new Map();
  for (const i of o) {
    const r = i.edgeLoop;
    if (!r || r.length < 3) continue;
    const n = [i.normal.x, i.normal.y, i.normal.z];
    for (let l = 0; l < r.length; l++) {
      const h = r[l], m = r[(l + 1) % r.length], d = [h.x, h.y, h.z], f = [m.x, m.y, m.z], u = { start: d, end: f, surfaceId: i.uuid, normal: n }, p = Ke(h.x, h.y, h.z, s), y = Ke(m.x, m.y, m.z, s), g = /* @__PURE__ */ new Set();
      for (const b of p)
        for (const I of y) {
          const x = An(b, I);
          g.has(x) || (g.add(x), c.has(x) ? c.get(x).push(u) : c.set(x, [u]));
        }
    }
  }
  const a = [];
  for (const [, i] of c) {
    if (i.length !== 2 || i[0].surfaceId === i[1].surfaceId) continue;
    const r = i[0], n = i[1];
    if (!(t(r.start[0], n.start[0]) && t(r.start[1], n.start[1]) && t(r.start[2], n.start[2]) && t(r.end[0], n.end[0]) && t(r.end[1], n.end[1]) && t(r.end[2], n.end[2]) || t(r.start[0], n.end[0]) && t(r.start[1], n.end[1]) && t(r.start[2], n.end[2]) && t(r.end[0], n.start[0]) && t(r.end[1], n.start[1]) && t(r.end[2], n.start[2]))) continue;
    const h = r.end[0] - r.start[0], m = r.end[1] - r.start[1], d = r.end[2] - r.start[2], f = Math.sqrt(h * h + m * m + d * d);
    if (f < e) continue;
    const u = [h / f, m / f, d / f], p = r.normal, y = n.normal, g = p[0] * y[0] + p[1] * y[1] + p[2] * y[2], b = Math.acos(Math.max(-1, Math.min(1, g)));
    if (b < 0.01) continue;
    const x = 2 * Math.PI - b, v = x / Math.PI;
    v <= 1 || a.push({
      start: r.start,
      end: r.end,
      direction: u,
      length: f,
      normal0: p,
      normal1: y,
      surface0Id: r.surfaceId,
      surface1Id: n.surfaceId,
      wedgeAngle: x,
      n: v
    });
  }
  return { edges: a };
}
const { PI: U, sqrt: ye, abs: wn, cos: Pe, sin: En, atan2: Je } = Math;
function re(o) {
  return o < 0 && (o = 0), 1 - Math.exp(-ye(U * o));
}
function Tn(o, e, t, s, c) {
  const a = o, i = [
    s[0] - t[0],
    s[1] - t[1],
    s[2] - t[2]
  ], r = i[0] * a[0] + i[1] * a[1] + i[2] * a[2], n = [i[0] - r * a[0], i[1] - r * a[1], i[2] - r * a[2]], l = ye(n[0] ** 2 + n[1] ** 2 + n[2] ** 2), h = [
    c[0] - t[0],
    c[1] - t[1],
    c[2] - t[2]
  ], m = h[0] * a[0] + h[1] * a[1] + h[2] * a[2], d = [h[0] - m * a[0], h[1] - m * a[1], h[2] - m * a[2]], f = ye(d[0] ** 2 + d[1] ** 2 + d[2] ** 2);
  if (l < 1e-10 || f < 1e-10)
    return { phiSource: U, phiReceiver: U };
  const u = [n[0] / l, n[1] / l, n[2] / l], p = [d[0] / f, d[1] / f, d[2] / f], y = [-e[0], -e[1], -e[2]], g = [
    a[1] * y[2] - a[2] * y[1],
    a[2] * y[0] - a[0] * y[2],
    a[0] * y[1] - a[1] * y[0]
  ], b = Je(
    u[0] * g[0] + u[1] * g[1] + u[2] * g[2],
    u[0] * y[0] + u[1] * y[1] + u[2] * y[2]
  ), I = Je(
    p[0] * g[0] + p[1] * g[1] + p[2] * g[2],
    p[0] * y[0] + p[1] * y[1] + p[2] * y[2]
  ), x = (v) => {
    let R = v;
    for (; R < 0; ) R += 2 * U;
    return R;
  };
  return {
    phiSource: x(b),
    phiReceiver: x(I)
  };
}
function ie(o, e, t, s, c) {
  const a = t + s * c, i = (U + e * a) / (2 * o), r = En(i);
  return wn(r) < 1e-12 ? 0 : Pe(i) / r;
}
function Pn(o, e, t, s, c, a, i) {
  if (t < 1e-10 || s < 1e-10) return 0;
  const r = 2 * U * o / i;
  if (r < 1e-10) return 0;
  const n = t * s / (t + s), l = (E, T, w, z) => {
    const O = T + w * z, B = Math.round((O + U) / (2 * U * e)), k = Math.round((O - U) / (2 * U * e)), G = 2 * Pe((2 * U * e * B - O) / 2) ** 2, V = 2 * Pe((2 * U * e * k - O) / 2) ** 2;
    return E > 0 ? G : V;
  };
  let h = 0;
  const m = l(1, a, -1, c), d = ie(e, 1, a, -1, c), f = re(r * n * m), u = l(-1, a, -1, c), p = ie(e, -1, a, -1, c), y = re(r * n * u), g = l(1, a, 1, c), b = ie(e, 1, a, 1, c), I = re(r * n * g), x = l(-1, a, 1, c), v = ie(e, -1, a, 1, c), R = re(r * n * x), _ = 1 / (2 * e * ye(2 * U * r)), S = d * f + p * y + b * I + v * R;
  h = _ * _ * S * S;
  const A = t, D = A / (s * (s + A));
  return h * D;
}
function Mn(o, e, t, s) {
  const c = e[0] - o[0], a = e[1] - o[1], i = e[2] - o[2], r = c * c + a * a + i * i;
  if (r < 1e-20)
    return [...o];
  const n = Math.sqrt(r), l = [c / n, a / n, i / n], h = (y) => {
    const g = o[0] + y * c, b = o[1] + y * a, I = o[2] + y * i, x = Math.sqrt(
      (g - t[0]) ** 2 + (b - t[1]) ** 2 + (I - t[2]) ** 2
    ), v = Math.sqrt(
      (g - s[0]) ** 2 + (b - s[1]) ** 2 + (I - s[2]) ** 2
    );
    if (x < 1e-10 || v < 1e-10) return 0;
    const R = ((g - t[0]) * l[0] + (b - t[1]) * l[1] + (I - t[2]) * l[2]) / x, _ = ((g - s[0]) * l[0] + (b - s[1]) * l[1] + (I - s[2]) * l[2]) / v;
    return R + _;
  };
  let m = 0, d = 1;
  const f = h(m), u = h(d);
  if (f * u > 0) {
    const y = (b) => {
      const I = o[0] + b * c, x = o[1] + b * a, v = o[2] + b * i, R = Math.sqrt(
        (I - t[0]) ** 2 + (x - t[1]) ** 2 + (v - t[2]) ** 2
      ), _ = Math.sqrt(
        (I - s[0]) ** 2 + (x - s[1]) ** 2 + (v - s[2]) ** 2
      );
      return R + _;
    }, g = y(0) < y(1) ? 0 : 1;
    return [
      o[0] + g * c,
      o[1] + g * a,
      o[2] + g * i
    ];
  }
  for (let y = 0; y < 50; y++) {
    const g = (m + d) / 2, b = h(g);
    if (Math.abs(b) < 1e-12) break;
    f * b < 0 ? d = g : m = g;
  }
  const p = (m + d) / 2;
  return [
    o[0] + p * c,
    o[1] + p * a,
    o[2] + p * i
  ];
}
function Qe(o, e, t, s, c = 0.01) {
  const a = e[0] - o[0], i = e[1] - o[1], r = e[2] - o[2], n = Math.sqrt(a * a + i * i + r * r);
  if (n < c) return !0;
  const l = new M.Vector3(a / n, i / n, r / n), h = new M.Vector3(
    o[0] + l.x * c,
    o[1] + l.y * c,
    o[2] + l.z * c
  );
  t.ray.set(h, l), t.far = n - 2 * c, t.near = 0;
  const m = t.intersectObjects(s, !0);
  return t.far = 1 / 0, m.length === 0;
}
function Bn(o, e, t, s, c, a, i, r) {
  const n = [], l = W(s, a);
  for (const h of o.edges)
    for (const [m, d] of e)
      for (const [f, u] of t) {
        const p = Mn(h.start, h.end, d, u), y = Math.sqrt(
          (p[0] - d[0]) ** 2 + (p[1] - d[1]) ** 2 + (p[2] - d[2]) ** 2
        ), g = Math.sqrt(
          (p[0] - u[0]) ** 2 + (p[1] - u[1]) ** 2 + (p[2] - u[2]) ** 2
        );
        if (y < 1e-6 || g < 1e-6 || !Qe(d, p, i, r) || !Qe(p, u, i, r)) continue;
        const { phiSource: b, phiReceiver: I } = Tn(
          h.direction,
          h.normal0,
          p,
          d,
          u
        ), x = y + g, v = x / c, R = new Array(s.length);
        for (let _ = 0; _ < s.length; _++) {
          let S = Pn(
            s[_],
            h.n,
            y,
            g,
            b,
            I,
            c
          );
          const A = l[_] * x;
          S *= Math.pow(10, -A / 10), R[_] = S;
        }
        n.push({
          edge: h,
          diffractionPoint: p,
          totalDistance: x,
          time: v,
          bandEnergy: R,
          sourceId: m,
          receiverId: f
        });
      }
  return n;
}
let Ie = null, oe = null, ae = !1;
function bt() {
  return typeof navigator < "u" && "gpu" in navigator;
}
async function Cn() {
  if (oe && !ae)
    return { adapter: Ie, device: oe };
  if (!bt())
    return null;
  try {
    const o = await navigator.gpu.requestAdapter();
    if (!o)
      return console.warn("[GPU RT] No WebGPU adapter found"), null;
    const e = await o.requestDevice({
      requiredLimits: {
        maxStorageBufferBindingSize: o.limits.maxStorageBufferBindingSize,
        maxBufferSize: o.limits.maxBufferSize,
        maxComputeWorkgroupSizeX: 64
      }
    });
    return Ie = o, oe = e, ae = !1, e.lost.then((t) => {
      ae || (ae = !0, console.error(`[GPU RT] Device lost: ${t.reason ?? "unknown"} — ${t.message}`), oe = null, Ie = null);
    }), { adapter: o, device: e };
  } catch (o) {
    return console.warn("[GPU RT] Failed to initialize WebGPU:", o), null;
  }
}
function zn(o, e, t) {
  const s = o.allSurfaces, c = P.getState().containers, a = [], i = [], r = [], n = [];
  for (let A = 0; A < s.length; A++) {
    const D = s[A];
    a.push(D.uuid);
    const E = D.mesh, T = E.geometry, w = T.getAttribute("position"), z = T.getIndex();
    E.updateMatrixWorld(!0);
    const L = E.matrixWorld;
    if (z)
      for (let O = 0; O < z.count; O += 3) {
        for (let G = 0; G < 3; G++) {
          const V = z.getX(O + G), be = new M.Vector3(
            w.getX(V),
            w.getY(V),
            w.getZ(V)
          ).applyMatrix4(L);
          i.push(be.x, be.y, be.z);
        }
        const B = i.length - 9, k = et(
          i[B],
          i[B + 1],
          i[B + 2],
          i[B + 3],
          i[B + 4],
          i[B + 5],
          i[B + 6],
          i[B + 7],
          i[B + 8]
        );
        r.push(k[0], k[1], k[2]), n.push(A);
      }
    else
      for (let O = 0; O < w.count; O += 3) {
        for (let G = 0; G < 3; G++) {
          const V = new M.Vector3(
            w.getX(O + G),
            w.getY(O + G),
            w.getZ(O + G)
          ).applyMatrix4(L);
          i.push(V.x, V.y, V.z);
        }
        const B = i.length - 9, k = et(
          i[B],
          i[B + 1],
          i[B + 2],
          i[B + 3],
          i[B + 4],
          i[B + 5],
          i[B + 6],
          i[B + 7],
          i[B + 8]
        );
        r.push(k[0], k[1], k[2]), n.push(A);
      }
  }
  const l = n.length, h = new Float32Array(i), m = new Float32Array(r), d = new Uint32Array(n), f = new Float32Array(l * 3);
  for (let A = 0; A < l; A++) {
    const D = A * 9;
    f[A * 3] = (h[D] + h[D + 3] + h[D + 6]) / 3, f[A * 3 + 1] = (h[D + 1] + h[D + 4] + h[D + 7]) / 3, f[A * 3 + 2] = (h[D + 2] + h[D + 5] + h[D + 8]) / 3;
  }
  const u = new Uint32Array(l);
  for (let A = 0; A < l; A++) u[A] = A;
  const p = Me(h, f, u, 0, l, 0), y = new Float32Array(l * 9), g = new Float32Array(l * 3), b = new Uint32Array(l);
  for (let A = 0; A < l; A++) {
    const D = u[A];
    y.set(h.subarray(D * 9, D * 9 + 9), A * 9), g.set(m.subarray(D * 3, D * 3 + 3), A * 3), b[A] = d[D];
  }
  const { nodeArray: I, nodeCount: x } = Fn(p), v = t.length, R = new Float32Array(s.length * v * 2);
  for (let A = 0; A < s.length; A++) {
    const D = s[A];
    for (let E = 0; E < v; E++) {
      const T = (A * v + E) * 2;
      R[T] = D.absorptionFunction(t[E]), R[T + 1] = D.scatteringFunction(t[E]);
    }
  }
  const _ = [], S = [];
  for (const A of e) {
    const D = c[A];
    if (D) {
      _.push(A);
      const E = 0.1, T = D.scale, w = Math.max(Math.abs(T.x), Math.abs(T.y), Math.abs(T.z));
      S.push(D.position.x, D.position.y, D.position.z, E * w);
    }
  }
  return {
    bvhNodes: I,
    triangleVertices: y,
    triangleSurfaceIndex: b,
    triangleNormals: g,
    surfaceAcousticData: R,
    receiverSpheres: new Float32Array(S),
    triangleCount: l,
    nodeCount: x,
    surfaceCount: s.length,
    receiverCount: _.length,
    surfaceUuidMap: a,
    receiverUuidMap: _
  };
}
const On = 8, Nn = 64;
function Me(o, e, t, s, c, a) {
  let i = 1 / 0, r = 1 / 0, n = 1 / 0, l = -1 / 0, h = -1 / 0, m = -1 / 0;
  for (let _ = s; _ < c; _++) {
    const S = t[_];
    for (let A = 0; A < 3; A++) {
      const D = S * 9 + A * 3, E = o[D], T = o[D + 1], w = o[D + 2];
      E < i && (i = E), E > l && (l = E), T < r && (r = T), T > h && (h = T), w < n && (n = w), w > m && (m = w);
    }
  }
  const d = c - s;
  if (d <= On || a >= Nn)
    return { boundsMin: [i, r, n], boundsMax: [l, h, m], left: null, right: null, triStart: s, triCount: d };
  const f = l - i, u = h - r, p = m - n, y = f >= u && f >= p ? 0 : u >= p ? 1 : 2;
  let g = 1 / 0, b = -1 / 0;
  for (let _ = s; _ < c; _++) {
    const S = e[t[_] * 3 + y];
    S < g && (g = S), S > b && (b = S);
  }
  const I = (g + b) * 0.5;
  let x = s;
  for (let _ = s; _ < c; _++)
    if (e[t[_] * 3 + y] < I) {
      const S = t[x];
      t[x] = t[_], t[_] = S, x++;
    }
  (x === s || x === c) && (x = s + c >> 1);
  const v = Me(o, e, t, s, x, a + 1), R = Me(o, e, t, x, c, a + 1);
  return { boundsMin: [i, r, n], boundsMax: [l, h, m], left: v, right: R, triStart: -1, triCount: -1 };
}
function Fn(o) {
  let e = 0;
  const t = [o];
  for (; t.length > 0; ) {
    const i = t.pop();
    e++, i.left && t.push(i.left), i.right && t.push(i.right);
  }
  const s = new Float32Array(e * 8);
  let c = 0;
  function a(i) {
    const r = c++, n = r * 8;
    s[n] = i.boundsMin[0], s[n + 1] = i.boundsMin[1], s[n + 2] = i.boundsMin[2], s[n + 4] = i.boundsMax[0], s[n + 5] = i.boundsMax[1], s[n + 6] = i.boundsMax[2];
    const l = new Uint32Array(s.buffer);
    if (i.left && i.right) {
      const h = a(i.left), m = a(i.right);
      l[n + 3] = h, l[n + 7] = m;
    } else
      l[n + 3] = i.triStart, l[n + 7] = (i.triCount | 2147483648) >>> 0;
    return r;
  }
  return a(o), { nodeArray: s, nodeCount: e };
}
function et(o, e, t, s, c, a, i, r, n) {
  const l = s - o, h = c - e, m = a - t, d = i - o, f = r - e, u = n - t;
  let p = h * u - m * f, y = m * d - l * u, g = l * f - h * d;
  const b = Math.sqrt(p * p + y * y + g * g);
  return b > 1e-10 && (p /= b, y /= b, g /= b), [p, y, g];
}
const kn = `// ─── GPU Ray Tracer Compute Shader ───────────────────────────────────
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
`, Y = 64, tt = 7, Ln = 64, Rt = 16, nt = Rt * 4, Be = 16, st = Be * 4, Ce = 16, Se = Ce * 4, Un = 20, rt = Un * 4;
class Gn {
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
    const a = await Cn();
    if (!a) return !1;
    this.device = a.device, this.config = s;
    const i = a.device.limits.maxStorageBufferBindingSize, r = a.device.limits.maxBufferSize, n = Y * Se, l = Math.floor(Math.min(i, r) / n);
    if (l < 1)
      return console.error("[GPU RT] Device storage limits too small for even a single ray chain buffer"), !1;
    const h = Math.max(1, c), m = Math.min(h, l);
    m < h && console.warn(`[GPU RT] batchSize ${h} exceeds device limits; clamped to ${m}`), this.maxBatchSize = m, s.reflectionOrder > Y && console.warn(`[GPU RT] reflectionOrder ${s.reflectionOrder} clamped to ${Y}`);
    const d = s.frequencies.slice(0, tt);
    this.sceneBuf = zn(e, t, d), this.gpuBvhNodes = this.createStorageBuffer(this.sceneBuf.bvhNodes), this.gpuTriVerts = this.createStorageBuffer(this.sceneBuf.triangleVertices), this.gpuTriSurfIdx = this.createStorageBuffer(new Uint32Array(this.sceneBuf.triangleSurfaceIndex)), this.gpuTriNormals = this.createStorageBuffer(this.sceneBuf.triangleNormals), this.gpuSurfAcoustic = this.createStorageBuffer(this.sceneBuf.surfaceAcousticData);
    const f = this.sceneBuf.receiverSpheres.length > 0 ? this.sceneBuf.receiverSpheres : new Float32Array(4);
    this.gpuReceiverSpheres = this.createStorageBuffer(f);
    const u = m * nt, p = m * st, y = m * Y * Se;
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
      size: rt,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackOutput = this.device.createBuffer({
      size: p,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    }), this.gpuReadbackChain = this.device.createBuffer({
      size: y,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    const g = this.device.createShaderModule({ code: kn });
    return this.pipeline = this.device.createComputePipeline({
      layout: "auto",
      compute: { module: g, entryPoint: "main" }
    }), this.bindGroupLayout = this.pipeline.getBindGroupLayout(0), !0;
  }
  async traceBatch(e, t, s) {
    if (!this.device || !this.pipeline || !this.sceneBuf || !this.config)
      throw new Error("[GPU RT] Not initialized");
    if (t > this.maxBatchSize)
      throw new Error(`[GPU RT] rayCount ${t} exceeds maxBatchSize ${this.maxBatchSize}`);
    if (t === 0) return [];
    const c = Math.min(this.config.frequencies.length, tt), a = new ArrayBuffer(rt), i = new Uint32Array(a), r = new Float32Array(a);
    i[0] = t, i[1] = Math.min(this.config.reflectionOrder, Y), i[2] = c, i[3] = this.sceneBuf.receiverCount, i[4] = this.sceneBuf.triangleCount, i[5] = this.sceneBuf.nodeCount, i[6] = this.sceneBuf.surfaceCount, i[7] = s, r[8] = this.config.rrThreshold;
    for (let y = 0; y < c; y++)
      r[12 + y] = this.config.cachedAirAtt[y];
    this.device.queue.writeBuffer(this.gpuParams, 0, a), this.device.queue.writeBuffer(
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
    }), l = Math.ceil(t / Ln), h = this.device.createCommandEncoder(), m = h.beginComputePass();
    m.setPipeline(this.pipeline), m.setBindGroup(0, n), m.dispatchWorkgroups(l), m.end();
    const d = t * st, f = t * Y * Se;
    h.copyBufferToBuffer(this.gpuRayOutputs, 0, this.gpuReadbackOutput, 0, d), h.copyBufferToBuffer(this.gpuChainBuffer, 0, this.gpuReadbackChain, 0, f), this.device.queue.submit([h.finish()]), await this.gpuReadbackOutput.mapAsync(GPUMapMode.READ, 0, d), await this.gpuReadbackChain.mapAsync(GPUMapMode.READ, 0, f);
    const u = new Float32Array(this.gpuReadbackOutput.getMappedRange(0, d).slice(0)), p = new Float32Array(this.gpuReadbackChain.getMappedRange(0, f).slice(0));
    return this.gpuReadbackOutput.unmap(), this.gpuReadbackChain.unmap(), this.parseResults(u, p, e, t, c);
  }
  parseResults(e, t, s, c, a) {
    const i = new Array(c), r = this.sceneBuf;
    for (let n = 0; n < c; n++) {
      const l = n * Be, h = new Uint32Array(e.buffer, l * 4, Be), m = h[0], d = h[1] !== 0;
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
      const p = [], y = n * Y;
      for (let R = 0; R < m; R++) {
        const _ = (y + R) * Ce, S = new Uint32Array(t.buffer, _ * 4, Ce), A = t[_], D = t[_ + 1], E = t[_ + 2], T = t[_ + 3], w = S[4], z = t[_ + 6], L = t[_ + 7], O = [];
        for (let k = 0; k < a; k++)
          O.push(t[_ + 8 + k]);
        let B;
        if (w >= r.surfaceCount) {
          const k = w - r.surfaceCount;
          B = r.receiverUuidMap[k] ?? "";
        } else
          B = r.surfaceUuidMap[w] ?? "";
        p.push({
          point: [A, D, E],
          distance: T,
          object: B,
          faceNormal: [0, 0, 0],
          faceIndex: -1,
          faceMaterialIndex: -1,
          angle: z,
          energy: L,
          bandEnergy: O
        });
      }
      const g = n * Rt, b = s[g + 6], I = s[g + 7], x = u.reduce((R, _) => R + _, 0), v = a > 0 ? x / a : 0;
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
        initialTheta: I,
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
const _e = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
)), { floor: $, random: Vn, abs: ce } = Math, Ae = () => Vn() > 0.5;
M.BufferGeometry.prototype.computeBoundsTree = It;
M.BufferGeometry.prototype.disposeBoundsTree = St;
M.Mesh.prototype.raycast = _t;
class Hn extends xt {
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
  constructor(e) {
    super(e), this.kind = "ray-tracer", e = { ...C, ...e }, this.uuid = e.uuid || this.uuid, this.name = e.name || C.name, this.observed_name = Ut(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = e.sourceIDs || C.sourceIDs, this.surfaceIDs = e.surfaceIDs || C.surfaceIDs, this.roomID = e.roomID || C.roomID, this.receiverIDs = e.receiverIDs || C.receiverIDs, this.updateInterval = e.updateInterval || C.updateInterval, this.reflectionOrder = e.reflectionOrder || C.reflectionOrder, this._isRunning = e.isRunning || C.isRunning, this._runningWithoutReceivers = e.runningWithoutReceivers || C.runningWithoutReceivers, this.frequencies = e.frequencies || C.frequencies, this._temperature = e.temperature ?? C.temperature, this._cachedAirAtt = W(this.frequencies, this._temperature), this.intervals = [], this.plotData = [], this.plotStyle = e.plotStyle || C.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = e.pointSize || C.pointSize, this.validRayCount = 0, this.intensitySampleRate = ct, this.quickEstimateResults = {};
    const t = typeof e.raysVisible == "boolean";
    this._raysVisible = t ? e.raysVisible : C.raysVisible;
    const s = typeof e.pointsVisible == "boolean";
    this._pointsVisible = s ? e.pointsVisible : C.pointsVisible;
    const c = typeof e.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = c ? e.invertedDrawStyle : C.invertedDrawStyle, this.passes = e.passes || C.passes, this.raycaster = new M.Raycaster(), this.rayBufferGeometry = new M.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new M.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(M.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new M.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(M.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.convergenceThreshold = e.convergenceThreshold ?? C.convergenceThreshold, this.autoStop = e.autoStop ?? C.autoStop, this.rrThreshold = e.rrThreshold ?? C.rrThreshold, this.maxStoredPaths = e.maxStoredPaths ?? C.maxStoredPaths, this.edgeDiffractionEnabled = e.edgeDiffractionEnabled ?? C.edgeDiffractionEnabled, this.lateReverbTailEnabled = e.lateReverbTailEnabled ?? C.lateReverbTailEnabled, this.tailCrossfadeTime = e.tailCrossfadeTime ?? C.tailCrossfadeTime, this.tailCrossfadeDuration = e.tailCrossfadeDuration ?? C.tailCrossfadeDuration, this.gpuEnabled = e.gpuEnabled ?? C.gpuEnabled, this.gpuBatchSize = e.gpuBatchSize ?? C.gpuBatchSize, this._edgeGraph = null, this._histogramBinWidth = qt, this._histogramNumBins = Yt, this._convergenceCheckInterval = $t, this._resetConvergenceState(), this.rays = new M.LineSegments(
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
    var a = new M.ShaderMaterial({
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
      blending: M.NormalBlending,
      name: "raytracer-points-material"
    });
    this.hits = new M.Points(this.rayBufferGeometry, a), this.hits.frustumCulled = !1, N.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
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
      X.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (i, ...r) => {
        console.log(r && r[0] && r[0] instanceof Array && r[1] && r[1] === this.uuid), r && r[0] && r[0] instanceof Array && r[1] && r[1] === this.uuid && (this.sourceIDs = r[0].map((n) => n.id));
      })
    ), this.messageHandlerIDs.push(
      X.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (i, ...r) => {
        r && r[0] && r[0] instanceof Array && r[1] && r[1] === this.uuid && (this.receiverIDs = r[0].map((n) => n.id));
      })
    ), this.messageHandlerIDs.push(
      X.addMessageHandler("SHOULD_REMOVE_CONTAINER", (i, ...r) => {
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
    return at(this._temperature);
  }
  save() {
    const {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: c,
      roomID: a,
      sourceIDs: i,
      surfaceIDs: r,
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
      frequencies: I,
      temperature: x,
      convergenceThreshold: v,
      autoStop: R,
      rrThreshold: _,
      maxStoredPaths: S,
      edgeDiffractionEnabled: A,
      lateReverbTailEnabled: D,
      tailCrossfadeTime: E,
      tailCrossfadeDuration: T,
      gpuEnabled: w,
      gpuBatchSize: z
    } = this;
    return {
      name: e,
      kind: t,
      uuid: s,
      autoCalculate: c,
      roomID: a,
      sourceIDs: i,
      surfaceIDs: r,
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
      frequencies: I,
      temperature: x,
      convergenceThreshold: v,
      autoStop: R,
      rrThreshold: _,
      maxStoredPaths: S,
      edgeDiffractionEnabled: A,
      lateReverbTailEnabled: D,
      tailCrossfadeTime: E,
      tailCrossfadeDuration: T,
      gpuEnabled: w,
      gpuBatchSize: z
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
  appendRay(e, t, s = 1, c = 1) {
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, c), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, s, c), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex);
  }
  flushRayBuffer() {
    this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
  }
  inFrontOf(e, t) {
    return en(e, t);
  }
  traceRay(e, t, s, c, a, i, r, n = 1, l = []) {
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
      a,
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
    this.quickEstimateResults = {}, this.sourceIDs.forEach((a) => {
      this.quickEstimateResults[a] = [];
    }), this.intervals.push(
      window.setInterval(() => {
        for (let a = 0; a < this.passes; a++, c++)
          for (let i = 0; i < this.sourceIDs.length; i++) {
            const r = this.sourceIDs[i], n = P.getState().containers[r];
            this.quickEstimateResults[r].push(this.quickEstimateStep(n, e, t));
          }
        c >= t ? (this.intervals.forEach((a) => window.clearInterval(a)), this.runningWithoutReceivers = s, console.log(this.quickEstimateResults)) : console.log((c / t * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(e, t, s) {
    const c = this.c, a = Array(t.length).fill(0);
    let i = e.position.clone(), r, n, l, h;
    do
      r = Math.random() * 2 - 1, n = Math.random() * 2 - 1, l = Math.random() * 2 - 1, h = r * r + n * n + l * l;
    while (h > 1 || h < 1e-6);
    let m = new M.Vector3(r, n, l).normalize(), d = 0;
    const f = Array(t.length).fill(e.initialIntensity);
    let u = 0;
    const p = Vt;
    let y = !1, g = 0;
    W(t, this.temperature);
    let b = {};
    for (; !y && u < p; ) {
      this.raycaster.ray.set(i, m);
      const I = this.raycaster.intersectObjects(this.intersectableObjects, !0);
      if (I.length > 0) {
        d = m.clone().multiplyScalar(-1).angleTo(I[0].face.normal), g += I[0].distance;
        const x = I[0].object.parent;
        for (let R = 0; R < t.length; R++) {
          const _ = t[R];
          let S = 1;
          x.kind === "surface" && (S = x.reflectionFunction(_, d)), f[R] *= S;
          const A = e.initialIntensity / f[R] > jt;
          A && (a[R] = g / c), y = y || A;
        }
        I[0].object.parent instanceof it && (I[0].object.parent.numHits += 1);
        const v = I[0].face.normal.normalize();
        m.sub(v.clone().multiplyScalar(m.dot(v)).multiplyScalar(2)).normalize(), i.copy(I[0].point), b = I[0];
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
      const t = 12, s = performance.now();
      do
        this.stepStratified(this.passes);
      while (performance.now() - s < t);
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
    const s = e / t;
    for (let c = 0; c < this.sourceIDs.length; c++) {
      const a = P.getState().containers[this.sourceIDs[c]], i = a.phi, r = a.theta, n = a.position, l = a.rotation, h = a.directivityHandler;
      this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
      const m = this.sourceIDs[c];
      let d = this._directivityRefPressures.get(m);
      if (!d || d.length !== this.frequencies.length) {
        d = new Array(this.frequencies.length);
        for (let f = 0; f < this.frequencies.length; f++)
          d[f] = h.getPressureAtPosition(0, this.frequencies[f], 0, 0);
        this._directivityRefPressures.set(m, d);
      }
      for (let f = 0; f < t; f++)
        for (let u = 0; u < s; u++) {
          this.__num_checked_paths += 1;
          const p = (f + Math.random()) / t * i, y = (u + Math.random()) / s * r;
          let g = Re(p, y);
          const b = new M.Vector3().setFromSphericalCoords(1, g[0], g[1]);
          b.applyEuler(l);
          const I = new Array(this.frequencies.length);
          for (let v = 0; v < this.frequencies.length; v++) {
            let R = 1;
            try {
              const _ = h.getPressureAtPosition(0, this.frequencies[v], p, y), S = d[v];
              typeof _ == "number" && typeof S == "number" && S > 0 && (R = (_ / S) ** 2);
            } catch {
            }
            I[v] = R;
          }
          const x = this.traceRay(n, b, this.reflectionOrder, I, m, p, y);
          x && this._handleTracedPath(x, n, m), this.stats.numRaysShot.value++;
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
      for (let a = 1; a < e.chain.length; a++)
        this.appendRay(e.chain[a - 1].point, e.chain[a].point, e.chain[a].energy || 1, e.chain[a].angle);
      const c = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(c, e), P.getState().containers[s].numRays += 1;
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
      const c = e.chain[e.chain.length - 1].object;
      this._pushPathWithEviction(c, e), P.getState().containers[s].numRays += 1, this._addToEnergyHistogram(c, e);
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
      const a = c.length - s + 1;
      a > 0 && c.splice(0, a);
    }
    c.push(t);
  }
  /** Add a ray path's energy to the convergence histogram */
  _addToEnergyHistogram(e, t) {
    _n(this._energyHistogram, e, t, this.frequencies, this.c, this._histogramBinWidth, this._histogramNumBins);
  }
  step() {
    for (let e = 0; e < this.sourceIDs.length; e++) {
      this.__num_checked_paths += 1;
      const t = Math.random() * P.getState().containers[this.sourceIDs[e]].theta, s = Math.random() * P.getState().containers[this.sourceIDs[e]].phi, c = P.getState().containers[this.sourceIDs[e]].position, a = P.getState().containers[this.sourceIDs[e]].rotation;
      let i = Re(s, t);
      const r = new M.Vector3().setFromSphericalCoords(1, i[0], i[1]);
      r.applyEuler(a);
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
          const p = n.getPressureAtPosition(0, this.frequencies[f], s, t), y = h[f];
          typeof p == "number" && typeof y == "number" && y > 0 && (u = (p / y) ** 2);
        } catch {
        }
        m[f] = u;
      }
      const d = this.traceRay(c, r, this.reflectionOrder, m, this.sourceIDs[e], s, t);
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
          this._pushPathWithEviction(f, d), P.getState().containers[this.sourceIDs[e]].numRays += 1;
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
          this._pushPathWithEviction(f, d), P.getState().containers[this.sourceIDs[e]].numRays += 1;
        }
      }
      this.stats.numRaysShot.value++;
    }
  }
  /** Reset convergence state for a new simulation run */
  _resetConvergenceState() {
    const e = In(this.frequencies.length);
    this.convergenceMetrics = e.convergenceMetrics, this._energyHistogram = e.energyHistogram, this._lastConvergenceCheck = e.lastConvergenceCheck;
  }
  /** Compute T30 from Schroeder backward integration of the energy histogram */
  _updateConvergenceMetrics() {
    Sn(
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
    this._cachedAirAtt = W(this.frequencies, this._temperature), this.mapIntersectableObjects(), this.edgeDiffractionEnabled && this.room ? this._edgeGraph = Dn(this.room.allSurfaces) : this._edgeGraph = null, this.__start_time = Date.now(), this.__num_checked_paths = 0, this._resetConvergenceState(), this.gpuEnabled ? this._startGpuMonteCarlo() : this.startAllMonteCarlo();
  }
  stop() {
    this.__calc_time = Date.now() - this.__start_time, this._gpuRunning = !1, this._gpuRayTracer && setTimeout(() => this._disposeGpu(), 0), cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => {
      window.clearInterval(e);
    }), this.intervals = [], Object.keys(this.paths).forEach((e) => {
      const t = this.__calc_time / 1e3, s = this.paths[e].length, c = s / t, a = this.__num_checked_paths, i = a / t;
      console.log({
        calc_time: t,
        num_valid_rays: s,
        valid_ray_rate: c,
        num_checks: a,
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
    const e = P.getState().containers, t = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
    for (const r of this.sourceIDs) {
      const n = e[r];
      if (n) {
        t.set(r, [n.position.x, n.position.y, n.position.z]);
        const l = n.directivityHandler, h = new Array(this.frequencies.length);
        for (let m = 0; m < this.frequencies.length; m++)
          h[m] = l.getPressureAtPosition(0, this.frequencies[m], 0, 0);
        s.set(r, { handler: l, refPressures: h });
      }
    }
    const c = /* @__PURE__ */ new Map();
    for (const r of this.receiverIDs) {
      const n = e[r];
      n && c.set(r, [n.position.x, n.position.y, n.position.z]);
    }
    const a = [];
    this.room.surfaces.traverse((r) => {
      r.kind && r.kind === "surface" && a.push(r.mesh);
    });
    const i = Bn(
      this._edgeGraph,
      t,
      c,
      this.frequencies,
      this.c,
      this._temperature,
      this.raycaster,
      a
    );
    for (const r of i) {
      const n = s.get(r.sourceId);
      if (n) {
        const x = t.get(r.sourceId), v = r.diffractionPoint[0] - x[0], R = r.diffractionPoint[1] - x[1], _ = r.diffractionPoint[2] - x[2], S = Math.sqrt(v * v + R * R + _ * _);
        if (S > 1e-10) {
          const A = Math.acos(Math.max(-1, Math.min(1, R / S))) * (180 / Math.PI), D = Math.atan2(_, v) * (180 / Math.PI);
          for (let E = 0; E < this.frequencies.length; E++)
            try {
              const T = n.handler.getPressureAtPosition(0, this.frequencies[E], Math.abs(D), A), w = n.refPressures[E];
              typeof T == "number" && typeof w == "number" && w > 0 && (r.bandEnergy[E] *= (T / w) ** 2);
            } catch {
            }
        }
      }
      const l = r.bandEnergy.reduce((x, v) => x + v, 0) / r.bandEnergy.length, h = c.get(r.receiverId), m = h[0] - r.diffractionPoint[0], d = h[1] - r.diffractionPoint[1], f = h[2] - r.diffractionPoint[2], u = Math.sqrt(m * m + d * d + f * f), p = u > 1e-10 ? [m / u, d / u, f / u] : [0, 0, 1], y = t.get(r.sourceId), g = Math.sqrt(
        (r.diffractionPoint[0] - y[0]) ** 2 + (r.diffractionPoint[1] - y[1]) ** 2 + (r.diffractionPoint[2] - y[2]) ** 2
      ), b = r.totalDistance - g, I = {
        intersectedReceiver: !0,
        chain: [
          {
            distance: g,
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
        arrivalDirection: p
      };
      this._pushPathWithEviction(r.receiverId, I);
    }
  }
  async reportImpulseResponse() {
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = P.getState().containers, t = F.sampleRate, s = [];
    for (const c of this.sourceIDs)
      for (const a of this.receiverIDs) {
        if (!this.paths[a] || this.paths[a].length === 0) continue;
        const i = this.paths[a].filter((r) => r.source === c);
        i.length > 0 && s.push({ sourceId: c, receiverId: a, paths: i });
      }
    if (s.length !== 0) {
      H("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let c = 0; c < s.length; c++) {
        const { sourceId: a, receiverId: i, paths: r } = s[c], n = e[a]?.name || "Source", l = e[i]?.name || "Receiver", h = Math.round(c / s.length * 100);
        H("UPDATE_PROGRESS", {
          progress: h,
          message: `Calculating IR: ${n} → ${l}`
        });
        try {
          const { normalizedSignal: m } = await this.calculateImpulseResponseForPair(a, i, r);
          a === this.sourceIDs[0] && i === this.receiverIDs[0] && this.calculateImpulseResponse().then((b) => {
            this.impulseResponse = b;
          }).catch(console.error);
          const d = Ht, f = Math.max(1, Math.floor(m.length / d)), u = [];
          for (let b = 0; b < m.length; b += f)
            u.push({
              time: b / t,
              amplitude: m[b]
            });
          const p = `${this.uuid}-ir-${a}-${i}`, y = ke.getState().results[p], g = {
            kind: Le.ImpulseResponse,
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
          y ? H("UPDATE_RESULT", { uuid: p, result: g }) : H("ADD_RESULT", g);
        } catch (m) {
          console.error(`Failed to calculate impulse response for ${a} -> ${i}:`, m);
        }
      }
      H("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(e, t, s, c = q, a = this.frequencies, i = F.sampleRate) {
    let r;
    return this.lateReverbTailEnabled && this._energyHistogram[t] && (r = {
      energyHistogram: this._energyHistogram[t],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: a
    }), on(e, t, s, c, a, this.temperature, i, r);
  }
  async calculateImpulseResponseForDisplay(e = q, t = this.frequencies, s = F.sampleRate) {
    let c;
    return this.lateReverbTailEnabled && this.receiverIDs.length > 0 && this._energyHistogram[this.receiverIDs[0]] && (c = {
      energyHistogram: this._energyHistogram[this.receiverIDs[0]],
      crossfadeTime: this.tailCrossfadeTime,
      crossfadeDuration: this.tailCrossfadeDuration,
      histogramBinWidth: this._histogramBinWidth,
      frequencies: t
    }), an(this.receiverIDs, this.sourceIDs, this.paths, e, t, this.temperature, s, c);
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
    const e = ke.getState().results;
    Object.keys(e).forEach((t) => {
      const s = e[t];
      s.from === this.uuid && s.kind === Le.ImpulseResponse && H("REMOVE_RESULT", t);
    });
  }
  reflectionLossFunction(e, t, s) {
    return he(e, t, s);
  }
  calculateReflectionLoss(e = this.frequencies) {
    const [t, s] = hn(this.paths, this.room, this.receiverIDs, e);
    return this.allReceiverData = t, this.chartdata = s, [this.allReceiverData, s];
  }
  getReceiverIntersectionPoints(e) {
    return this.paths && this.paths[e] && this.paths[e].length > 0 ? this.paths[e].map(
      (t) => new M.Vector3().fromArray(t.chain[t.chain.length - 1].point)
    ) : [];
  }
  calculateResponseByIntensity(e = this.frequencies, t = this.temperature) {
    const s = un(this.indexedPaths, this.receiverIDs, this.sourceIDs, e, t, this.intensitySampleRate);
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
      for (const a of s)
        for (const i of c)
          this.responseByIntensity[a]?.[i] && pt(this.responseByIntensity, a, i);
    }
    return this.responseByIntensity;
  }
  calculateT20(e, t) {
    if (this.responseByIntensity) {
      const s = e ? [e] : this.receiverIDs, c = t ? [t] : this.sourceIDs;
      for (const a of s)
        for (const i of c)
          this.responseByIntensity[a]?.[i] && mt(this.responseByIntensity, a, i);
    }
    return this.responseByIntensity;
  }
  calculateT60(e, t) {
    if (this.responseByIntensity) {
      const s = e ? [e] : this.receiverIDs, c = t ? [t] : this.sourceIDs;
      for (const a of s)
        for (const i of c)
          this.responseByIntensity[a]?.[i] && yt(this.responseByIntensity, a, i);
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
    return pn(this.paths);
  }
  linearBufferToPaths(e) {
    return mn(e);
  }
  arrivalPressure(e, t, s, c = 1) {
    return Ne(e, t, s, c, this.temperature);
  }
  async calculateImpulseResponse(e = q, t = this.frequencies, s = F.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let c = this.paths[this.receiverIDs[0]].sort((m, d) => m.time - d.time);
    const a = c[c.length - 1].time + Q, i = Array(t.length).fill(e), r = $(s * a) * 2;
    let n = [];
    for (let m = 0; m < t.length; m++)
      n.push(new Float32Array(r));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let u = 0; u < c.length; u++)
        c[u].chainLength - 1 <= this.transitionOrder && c.splice(u, 1);
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
        frequencies: this.frequencies,
        temperature: this.temperature
      }, f = new zt(m, !0).returnSortedPathsForHybrid(this.c, i, t);
      for (let u = 0; u < f.length; u++) {
        const p = Ae() ? 1 : -1, y = f[u].time, g = $(y * s);
        for (let b = 0; b < t.length; b++)
          n[b][g] += f[u].pressure[b] * p;
      }
    }
    const l = P.getState().containers[this.receiverIDs[0]];
    for (let m = 0; m < c.length; m++) {
      const d = Ae() ? 1 : -1, f = c[m].time, u = c[m].arrivalDirection || [0, 0, 1], p = l.getGain(u), y = this.arrivalPressure(i, t, c[m], p).map((b) => b * d), g = $(f * s);
      for (let b = 0; b < t.length; b++)
        n[b][g] += y[b];
    }
    if (this.lateReverbTailEnabled && this._energyHistogram[this.receiverIDs[0]]) {
      const m = ge(
        this._energyHistogram[this.receiverIDs[0]],
        t,
        this.tailCrossfadeTime,
        this._histogramBinWidth
      ), { tailSamples: d, tailStartSample: f } = pe(
        m,
        s
      ), u = $(this.tailCrossfadeDuration * s);
      n = me(n, d, f, u);
      const y = n.reduce((g, b) => Math.max(g, b.length), 0) * 2;
      for (let g = 0; g < t.length; g++)
        if (n[g].length < y) {
          const b = new Float32Array(y);
          b.set(n[g]), n[g] = b;
        }
    }
    const h = _e();
    return new Promise((m, d) => {
      h.postMessage({ samples: n }), h.onmessage = (f) => {
        const u = f.data.samples, p = new Float32Array(u[0].length >> 1);
        let y = 0;
        for (let x = 0; x < u.length; x++)
          for (let v = 0; v < p.length; v++)
            p[v] += u[x][v], ce(p[v]) > y && (y = ce(p[v]));
        const g = ve(p), b = F.createOfflineContext(1, p.length, s), I = F.createBufferSource(g, b);
        I.connect(b.destination), I.start(), F.renderContextAsync(b).then((x) => m(x)).catch(d).finally(() => h.terminate());
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
  async calculateAmbisonicImpulseResponse(e = 1, t = q, s = this.frequencies, c = F.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");
    const a = this.paths[this.receiverIDs[0]].sort((f, u) => f.time - u.time);
    if (a.length === 0) throw Error("No valid ray paths found");
    const i = a[a.length - 1].time + Q;
    if (i <= 0) throw Error("Invalid impulse response duration");
    const r = Array(s.length).fill(t), n = $(c * i) * 2;
    if (n < 2) throw Error("Impulse response too short to process");
    const l = Ct(e), h = [];
    for (let f = 0; f < s.length; f++) {
      h.push([]);
      for (let u = 0; u < l; u++)
        h[f].push(new Float32Array(n));
    }
    const m = P.getState().containers[this.receiverIDs[0]];
    for (let f = 0; f < a.length; f++) {
      const u = a[f], p = Ae() ? 1 : -1, y = u.time, g = u.arrivalDirection || [0, 0, 1], b = m.getGain(g), I = this.arrivalPressure(r, s, u, b).map((R) => R * p), x = $(y * c);
      if (x >= n) continue;
      const v = new Float32Array(1);
      for (let R = 0; R < s.length; R++) {
        v[0] = I[R];
        const _ = Bt(v, g[0], g[1], g[2], e, "threejs");
        for (let S = 0; S < l; S++)
          h[R][S][x] += _[S][0];
      }
    }
    if (this.lateReverbTailEnabled && this._energyHistogram[this.receiverIDs[0]]) {
      const f = ge(
        this._energyHistogram[this.receiverIDs[0]],
        s,
        this.tailCrossfadeTime,
        this._histogramBinWidth
      ), { tailSamples: u, tailStartSample: p } = pe(
        f,
        c
      ), y = $(this.tailCrossfadeDuration * c);
      for (let I = 0; I < s.length; I++) {
        const x = [h[I][0]], v = [u[I]], R = me(x, v, p, y);
        h[I][0] = R[0];
      }
      let g = 0;
      for (let I = 0; I < s.length; I++)
        for (let x = 0; x < l; x++)
          h[I][x].length > g && (g = h[I][x].length);
      const b = g * 2;
      for (let I = 0; I < s.length; I++)
        for (let x = 0; x < l; x++)
          if (h[I][x].length < b) {
            const v = new Float32Array(b);
            v.set(h[I][x]), h[I][x] = v;
          }
    }
    const d = _e();
    return new Promise((f, u) => {
      const p = async (y) => new Promise((g) => {
        const b = [];
        for (let x = 0; x < s.length; x++)
          b.push(h[x][y]);
        const I = _e();
        I.postMessage({ samples: b }), I.onmessage = (x) => {
          const v = x.data.samples, R = new Float32Array(v[0].length >> 1);
          for (let _ = 0; _ < v.length; _++)
            for (let S = 0; S < R.length; S++)
              R[S] += v[_][S];
          I.terminate(), g(R);
        };
      });
      Promise.all(
        Array.from({ length: l }, (y, g) => p(g))
      ).then((y) => {
        let g = 0;
        for (const v of y)
          for (let R = 0; R < v.length; R++)
            ce(v[R]) > g && (g = ce(v[R]));
        if (g > 0)
          for (const v of y)
            for (let R = 0; R < v.length; R++)
              v[R] /= g;
        const b = y[0].length;
        if (b === 0) {
          d.terminate(), u(new Error("Filtered signal has zero length"));
          return;
        }
        const x = F.createOfflineContext(l, b, c).createBuffer(l, b, c);
        for (let v = 0; v < l; v++)
          x.copyToChannel(new Float32Array(y[v]), v);
        d.terminate(), f(x);
      }).catch(u);
    });
  }
  ambisonicImpulseResponse;
  ambisonicOrder = 1;
  impulseResponse;
  impulseResponsePlaying = !1;
  async playImpulseResponse() {
    const e = await bn(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      this.uuid
    );
    this.impulseResponse = e.impulseResponse;
  }
  downloadImpulses(e, t = q, s = ot(125, 8e3), c = 44100) {
    vn(
      this.paths,
      this.receiverIDs,
      this.sourceIDs,
      (a, i, r, n) => this.arrivalPressure(a, i, r, n),
      e,
      t,
      s,
      c
    );
  }
  async downloadImpulseResponse(e, t = F.sampleRate) {
    const s = await Rn(
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
  /** Initialize GPU ray tracer. Returns true on success. */
  async _initGpu() {
    if (!bt())
      return console.warn("[GPU RT] WebGPU not available in this browser"), !1;
    let e = null;
    try {
      return e = new Gn(), !await e.initialize(
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
      const c = this._gpuRayTracer.effectiveBatchSize, a = new Float32Array(c * e), i = async () => {
        if (!(!this._gpuRunning || !this._isRunning || !this._gpuRayTracer))
          try {
            if (!Number.isFinite(this.gpuBatchSize) || this.gpuBatchSize <= 0) {
              console.warn("[GPU RT] Invalid gpuBatchSize, falling back to CPU"), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
              return;
            }
            const r = Math.min(Math.floor(this.gpuBatchSize), c);
            let n = 0;
            for (let u = 0; u < this.sourceIDs.length && n < r; u++) {
              const p = P.getState().containers[this.sourceIDs[u]], y = p.position, g = p.rotation, b = p.phi, I = p.theta, x = p.directivityHandler, v = this.sourceIDs[u];
              this._directivityRefPressures || (this._directivityRefPressures = /* @__PURE__ */ new Map());
              let R = this._directivityRefPressures.get(v);
              if (!R || R.length !== this.frequencies.length) {
                R = new Array(this.frequencies.length);
                for (let A = 0; A < this.frequencies.length; A++)
                  R[A] = x.getPressureAtPosition(0, this.frequencies[A], 0, 0);
                this._directivityRefPressures.set(v, R);
              }
              const _ = Math.max(1, Math.floor(r / this.sourceIDs.length)), S = new M.Vector3();
              for (let A = 0; A < _ && n < r; A++) {
                const D = Math.random() * b, E = Math.random() * I, T = Re(D, E);
                S.setFromSphericalCoords(1, T[0], T[1]), S.applyEuler(g);
                const w = n * e;
                a[w] = y.x, a[w + 1] = y.y, a[w + 2] = y.z, a[w + 3] = S.x, a[w + 4] = S.y, a[w + 5] = S.z, a[w + 6] = D, a[w + 7] = E;
                for (let z = 0; z < t; z++) {
                  let L = 1;
                  try {
                    const O = x.getPressureAtPosition(0, this.frequencies[z], D, E), B = R[z];
                    typeof O == "number" && typeof B == "number" && B > 0 && (L = (O / B) ** 2);
                  } catch {
                  }
                  a[w + 8 + z] = L;
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
j("RAYTRACER_CALL_METHOD", wt);
j("RAYTRACER_SET_PROPERTY", Et);
j("REMOVE_RAYTRACER", Tt);
j("ADD_RAYTRACER", Pt(Hn));
j("RAYTRACER_CLEAR_RAYS", (o) => void ee.getState().solvers[o].clearRays());
j("RAYTRACER_PLAY_IR", (o) => {
  ee.getState().solvers[o].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
j("RAYTRACER_DOWNLOAD_IR", (o) => {
  const e = ee.getState().solvers[o], t = P.getState().containers, s = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", c = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", a = `ir-${s}-${c}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(a).catch((i) => {
    window.alert(i.message || "Failed to download impulse response");
  });
});
j("RAYTRACER_DOWNLOAD_IR_OCTAVE", (o) => void ee.getState().solvers[o].downloadImpulses(o));
j("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: o, order: e }) => {
  const t = ee.getState().solvers[o], s = P.getState().containers, c = t.sourceIDs.length > 0 && s[t.sourceIDs[0]]?.name || "source", a = t.receiverIDs.length > 0 && s[t.receiverIDs[0]]?.name || "receiver", i = `ir-${c}-${a}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(i, e).catch((r) => {
    window.alert(r.message || "Failed to download ambisonic impulse response");
  });
});
export {
  $t as CONVERGENCE_CHECK_INTERVAL_MS,
  q as DEFAULT_INITIAL_SPL,
  ct as DEFAULT_INTENSITY_SAMPLE_RATE,
  lt as DRAWSTYLE,
  qt as HISTOGRAM_BIN_WIDTH,
  Yt as HISTOGRAM_NUM_BINS,
  Ht as MAX_DISPLAY_POINTS,
  Wt as MAX_TAIL_END_TIME,
  xe as MIN_TAIL_DECAY_RATE,
  Vt as QUICK_ESTIMATE_MAX_ORDER,
  Q as RESPONSE_TIME_PADDING,
  jt as RT60_DECAY_RATIO,
  Gt as SELF_INTERSECTION_OFFSET,
  Hn as default,
  C as defaults,
  ve as normalize
};
//# sourceMappingURL=index-Bkj-5zDh.mjs.map
