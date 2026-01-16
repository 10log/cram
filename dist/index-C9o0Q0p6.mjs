import { S as ss } from "./solver-Co1OmpsL.mjs";
import { at as et, au as Vn, V as M, av as rt, aw as qe, ae as ht, T as Bt, K as pt, ax as is, a8 as rs, ay as On, az as os, aA as ln, M as pe, aB as Ke, aC as Un, al as Nn, aD as Ge, aE as as, aF as cs, A as ls, ak as Je, aG as un, aH as fn, ar as us, aI as fs, aJ as hn, r as N, $ as hs, w as yt, k as C, aK as $t, aL as pn, C as we, x as W, e as ct, R as dn, aM as Et, B as Wt, L as Yt, t as Ae, I as be, aN as ps, aO as ds, y as Ie, z as ys, F as Se, aP as yn, o as at, aQ as ms, D as gs, E as vs, G as xs, f as jt } from "./index-Cyx44W_I.mjs";
import { e as ws, g as As } from "./ambisonics.es-Ci32Q6qr.mjs";
import { ImageSourceSolver as bs } from "./index-CDaAT_IC.mjs";
const kn = 0, Is = 1, Ss = 2, mn = 2, Re = 1.25, gn = 1, Y = 32, O = Y / 4, jn = 65535, ue = Math.pow(2, -24), Qe = Symbol("SKIP_GENERATION"), Hn = {
  strategy: kn,
  maxDepth: 40,
  maxLeafSize: 10,
  useSharedArrayBuffer: !1,
  setBoundingBox: !0,
  onProgress: null,
  indirect: !1,
  verbose: !0,
  range: null,
  [Qe]: !1
};
function L(c, t, e) {
  return e.min.x = t[c], e.min.y = t[c + 1], e.min.z = t[c + 2], e.max.x = t[c + 3], e.max.y = t[c + 4], e.max.z = t[c + 5], e;
}
function vn(c) {
  let t = -1, e = -1 / 0;
  for (let n = 0; n < 3; n++) {
    const s = c[n + 3] - c[n];
    s > e && (e = s, t = n);
  }
  return t;
}
function xn(c, t) {
  t.set(c);
}
function wn(c, t, e) {
  let n, s;
  for (let r = 0; r < 3; r++) {
    const i = r + 3;
    n = c[r], s = t[r], e[r] = n < s ? n : s, n = c[i], s = t[i], e[i] = n > s ? n : s;
  }
}
function Zt(c, t, e) {
  for (let n = 0; n < 3; n++) {
    const s = t[c + 2 * n], r = t[c + 2 * n + 1], i = s - r, a = s + r;
    i < e[n] && (e[n] = i), a > e[n + 3] && (e[n + 3] = a);
  }
}
function Ct(c) {
  const t = c[3] - c[0], e = c[4] - c[1], n = c[5] - c[2];
  return 2 * (t * e + e * n + n * t);
}
function U(c, t) {
  return t[c + 15] === jn;
}
function Z(c, t) {
  return t[c + 6];
}
function X(c, t) {
  return t[c + 14];
}
function k(c) {
  return c + O;
}
function j(c, t) {
  const e = t[c + 6];
  return c + e * O;
}
function tn(c, t) {
  return t[c + 7];
}
function Pe(c, t, e, n, s) {
  let r = 1 / 0, i = 1 / 0, a = 1 / 0, o = -1 / 0, u = -1 / 0, f = -1 / 0, l = 1 / 0, h = 1 / 0, p = 1 / 0, g = -1 / 0, y = -1 / 0, v = -1 / 0;
  const x = c.offset || 0;
  for (let d = (t - x) * 6, w = (t + e - x) * 6; d < w; d += 6) {
    const m = c[d + 0], A = c[d + 1], b = m - A, I = m + A;
    b < r && (r = b), I > o && (o = I), m < l && (l = m), m > g && (g = m);
    const P = c[d + 2], T = c[d + 3], S = P - T, D = P + T;
    S < i && (i = S), D > u && (u = D), P < h && (h = P), P > y && (y = P);
    const R = c[d + 4], B = c[d + 5], _ = R - B, E = R + B;
    _ < a && (a = _), E > f && (f = E), R < p && (p = R), R > v && (v = R);
  }
  n[0] = r, n[1] = i, n[2] = a, n[3] = o, n[4] = u, n[5] = f, s[0] = l, s[1] = h, s[2] = p, s[3] = g, s[4] = y, s[5] = v;
}
const st = 32, Rs = (c, t) => c.candidate - t.candidate, lt = /* @__PURE__ */ new Array(st).fill().map(() => ({
  count: 0,
  bounds: new Float32Array(6),
  rightCacheBounds: new Float32Array(6),
  leftCacheBounds: new Float32Array(6),
  candidate: 0
})), Xt = /* @__PURE__ */ new Float32Array(6);
function Ps(c, t, e, n, s, r) {
  let i = -1, a = 0;
  if (r === kn)
    i = vn(t), i !== -1 && (a = (t[i] + t[i + 3]) / 2);
  else if (r === Is)
    i = vn(c), i !== -1 && (a = Ts(e, n, s, i));
  else if (r === Ss) {
    const o = Ct(c);
    let u = Re * s;
    const f = e.offset || 0, l = (n - f) * 6, h = (n + s - f) * 6;
    for (let p = 0; p < 3; p++) {
      const g = t[p], x = (t[p + 3] - g) / st;
      if (s < st / 4) {
        const d = [...lt];
        d.length = s;
        let w = 0;
        for (let A = l; A < h; A += 6, w++) {
          const b = d[w];
          b.candidate = e[A + 2 * p], b.count = 0;
          const {
            bounds: I,
            leftCacheBounds: P,
            rightCacheBounds: T
          } = b;
          for (let S = 0; S < 3; S++)
            T[S] = 1 / 0, T[S + 3] = -1 / 0, P[S] = 1 / 0, P[S + 3] = -1 / 0, I[S] = 1 / 0, I[S + 3] = -1 / 0;
          Zt(A, e, I);
        }
        d.sort(Rs);
        let m = s;
        for (let A = 0; A < m; A++) {
          const b = d[A];
          for (; A + 1 < m && d[A + 1].candidate === b.candidate; )
            d.splice(A + 1, 1), m--;
        }
        for (let A = l; A < h; A += 6) {
          const b = e[A + 2 * p];
          for (let I = 0; I < m; I++) {
            const P = d[I];
            b >= P.candidate ? Zt(A, e, P.rightCacheBounds) : (Zt(A, e, P.leftCacheBounds), P.count++);
          }
        }
        for (let A = 0; A < m; A++) {
          const b = d[A], I = b.count, P = s - b.count, T = b.leftCacheBounds, S = b.rightCacheBounds;
          let D = 0;
          I !== 0 && (D = Ct(T) / o);
          let R = 0;
          P !== 0 && (R = Ct(S) / o);
          const B = gn + Re * (D * I + R * P);
          B < u && (i = p, u = B, a = b.candidate);
        }
      } else {
        for (let m = 0; m < st; m++) {
          const A = lt[m];
          A.count = 0, A.candidate = g + x + m * x;
          const b = A.bounds;
          for (let I = 0; I < 3; I++)
            b[I] = 1 / 0, b[I + 3] = -1 / 0;
        }
        for (let m = l; m < h; m += 6) {
          let I = ~~((e[m + 2 * p] - g) / x);
          I >= st && (I = st - 1);
          const P = lt[I];
          P.count++, Zt(m, e, P.bounds);
        }
        const d = lt[st - 1];
        xn(d.bounds, d.rightCacheBounds);
        for (let m = st - 2; m >= 0; m--) {
          const A = lt[m], b = lt[m + 1];
          wn(A.bounds, b.rightCacheBounds, A.rightCacheBounds);
        }
        let w = 0;
        for (let m = 0; m < st - 1; m++) {
          const A = lt[m], b = A.count, I = A.bounds, T = lt[m + 1].rightCacheBounds;
          b !== 0 && (w === 0 ? xn(I, Xt) : wn(I, Xt, Xt)), w += b;
          let S = 0, D = 0;
          w !== 0 && (S = Ct(Xt) / o);
          const R = s - w;
          R !== 0 && (D = Ct(T) / o);
          const B = gn + Re * (S * w + D * R);
          B < u && (i = p, u = B, a = A.candidate);
        }
      }
    }
  } else
    console.warn(`BVH: Invalid build strategy value ${r} used.`);
  return { axis: i, pos: a };
}
function Ts(c, t, e, n) {
  let s = 0;
  const r = c.offset;
  for (let i = t, a = t + e; i < a; i++)
    s += c[(i - r) * 6 + n * 2];
  return s / e;
}
class Te {
  constructor() {
    this.boundingData = new Float32Array(6);
  }
}
function Ds(c, t, e, n, s, r) {
  let i = n, a = n + s - 1;
  const o = r.pos, u = r.axis * 2, f = e.offset || 0;
  for (; ; ) {
    for (; i <= a && e[(i - f) * 6 + u] < o; )
      i++;
    for (; i <= a && e[(a - f) * 6 + u] >= o; )
      a--;
    if (i < a) {
      for (let l = 0; l < t; l++) {
        let h = c[i * t + l];
        c[i * t + l] = c[a * t + l], c[a * t + l] = h;
      }
      for (let l = 0; l < 6; l++) {
        const h = i - f, p = a - f, g = e[h * 6 + l];
        e[h * 6 + l] = e[p * 6 + l], e[p * 6 + l] = g;
      }
      i++, a--;
    } else
      return i;
  }
}
let $n, fe, Oe, Wn;
const Bs = Math.pow(2, 32);
function Ue(c) {
  return "count" in c ? 1 : 1 + Ue(c.left) + Ue(c.right);
}
function _s(c, t, e) {
  return $n = new Float32Array(e), fe = new Uint32Array(e), Oe = new Uint16Array(e), Wn = new Uint8Array(e), Ne(c, t);
}
function Ne(c, t) {
  const e = c / 4, n = c / 2, s = "count" in t, r = t.boundingData;
  for (let i = 0; i < 6; i++)
    $n[e + i] = r[i];
  if (s)
    return t.buffer ? (Wn.set(new Uint8Array(t.buffer), c), c + t.buffer.byteLength) : (fe[e + 6] = t.offset, Oe[n + 14] = t.count, Oe[n + 15] = jn, c + Y);
  {
    const { left: i, right: a, splitAxis: o } = t, u = c + Y;
    let f = Ne(u, i);
    const l = c / Y, p = f / Y - l;
    if (p > Bs)
      throw new Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");
    return fe[e + 6] = p, fe[e + 7] = o, Ne(f, a);
  }
}
function Ms(c, t, e, n, s) {
  const {
    maxDepth: r,
    verbose: i,
    maxLeafSize: a,
    strategy: o,
    onProgress: u
  } = s, f = c.primitiveBuffer, l = c.primitiveBufferStride, h = new Float32Array(6);
  let p = !1;
  const g = new Te();
  return Pe(t, e, n, g.boundingData, h), v(g, e, n, h), g;
  function y(x) {
    u && u(x / n);
  }
  function v(x, d, w, m = null, A = 0) {
    if (!p && A >= r && (p = !0, i && console.warn(`BVH: Max depth of ${r} reached when generating BVH. Consider increasing maxDepth.`)), w <= a || A >= r)
      return y(d + w), x.offset = d, x.count = w, x;
    const b = Ps(x.boundingData, m, t, d, w, o);
    if (b.axis === -1)
      return y(d + w), x.offset = d, x.count = w, x;
    const I = Ds(f, l, t, d, w, b);
    if (I === d || I === d + w)
      y(d + w), x.offset = d, x.count = w;
    else {
      x.splitAxis = b.axis;
      const P = new Te(), T = d, S = I - d;
      x.left = P, Pe(t, T, S, P.boundingData, h), v(P, T, S, h, A + 1);
      const D = new Te(), R = I, B = w - S;
      x.right = D, Pe(t, R, B, D.boundingData, h), v(D, R, B, h, A + 1);
    }
    return x;
  }
}
function Es(c, t) {
  const e = t.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer, n = c.getRootRanges(t.range), s = n[0], r = n[n.length - 1], i = {
    offset: s.offset,
    count: r.offset + r.count - s.offset
  }, a = new Float32Array(6 * i.count);
  a.offset = i.offset, c.computePrimitiveBounds(i.offset, i.count, a), c._roots = n.map((o) => {
    const u = Ms(c, a, o.offset, o.count, t), f = Ue(u), l = new e(Y * f);
    return _s(0, u, l), l;
  });
}
class en {
  constructor(t) {
    this._getNewPrimitive = t, this._primitives = [];
  }
  getPrimitive() {
    const t = this._primitives;
    return t.length === 0 ? this._getNewPrimitive() : t.pop();
  }
  releasePrimitive(t) {
    this._primitives.push(t);
  }
}
class Cs {
  constructor() {
    this.float32Array = null, this.uint16Array = null, this.uint32Array = null;
    const t = [];
    let e = null;
    this.setBuffer = (n) => {
      e && t.push(e), e = n, this.float32Array = new Float32Array(n), this.uint16Array = new Uint16Array(n), this.uint32Array = new Uint32Array(n);
    }, this.clearBuffer = () => {
      e = null, this.float32Array = null, this.uint16Array = null, this.uint32Array = null, t.length !== 0 && this.setBuffer(t.pop());
    };
  }
}
const F = /* @__PURE__ */ new Cs();
let ft, Mt;
const wt = [], qt = /* @__PURE__ */ new en(() => new et());
function Fs(c, t, e, n, s, r) {
  ft = qt.getPrimitive(), Mt = qt.getPrimitive(), wt.push(ft, Mt), F.setBuffer(c._roots[t]);
  const i = ke(0, c.geometry, e, n, s, r);
  F.clearBuffer(), qt.releasePrimitive(ft), qt.releasePrimitive(Mt), wt.pop(), wt.pop();
  const a = wt.length;
  return a > 0 && (Mt = wt[a - 1], ft = wt[a - 2]), i;
}
function ke(c, t, e, n, s = null, r = 0, i = 0) {
  const { float32Array: a, uint16Array: o, uint32Array: u } = F;
  let f = c * 2;
  if (U(f, o)) {
    const h = Z(c, u), p = X(f, o);
    return L(c, a, ft), n(h, p, !1, i, r + c / O, ft);
  } else {
    let S = function(R) {
      const { uint16Array: B, uint32Array: _ } = F;
      let E = R * 2;
      for (; !U(E, B); )
        R = k(R), E = R * 2;
      return Z(R, _);
    }, D = function(R) {
      const { uint16Array: B, uint32Array: _ } = F;
      let E = R * 2;
      for (; !U(E, B); )
        R = j(R, _), E = R * 2;
      return Z(R, _) + X(E, B);
    };
    const h = k(c), p = j(c, u);
    let g = h, y = p, v, x, d, w;
    if (s && (d = ft, w = Mt, L(g, a, d), L(y, a, w), v = s(d), x = s(w), x < v)) {
      g = p, y = h;
      const R = v;
      v = x, x = R, d = w;
    }
    d || (d = ft, L(g, a, d));
    const m = U(g * 2, o), A = e(d, m, v, i + 1, r + g / O);
    let b;
    if (A === mn) {
      const R = S(g), _ = D(g) - R;
      b = n(R, _, !0, i + 1, r + g / O, d);
    } else
      b = A && ke(
        g,
        t,
        e,
        n,
        s,
        r,
        i + 1
      );
    if (b) return !0;
    w = Mt, L(y, a, w);
    const I = U(y * 2, o), P = e(w, I, x, i + 1, r + y / O);
    let T;
    if (P === mn) {
      const R = S(y), _ = D(y) - R;
      T = n(R, _, !0, i + 1, r + y / O, w);
    } else
      T = P && ke(
        y,
        t,
        e,
        n,
        s,
        r,
        i + 1
      );
    return !!T;
  }
}
const An = /* @__PURE__ */ new et(), At = /* @__PURE__ */ new Float32Array(6);
class Ls {
  constructor() {
    this._roots = null, this.primitiveBuffer = null, this.primitiveBufferStride = null;
  }
  init(t) {
    t = {
      ...Hn,
      ...t
    }, Es(this, t);
  }
  getRootRanges() {
    throw new Error("BVH: getRootRanges() not implemented");
  }
  // write the i-th primitive bounds in a 6-value min / max format to the buffer
  // starting at the given "writeOffset"
  writePrimitiveBounds() {
    throw new Error("BVH: writePrimitiveBounds() not implemented");
  }
  // writes the union bounds of all primitives in the given range in a min / max format
  // to the buffer
  writePrimitiveRangeBounds(t, e, n, s) {
    let r = 1 / 0, i = 1 / 0, a = 1 / 0, o = -1 / 0, u = -1 / 0, f = -1 / 0;
    for (let l = t, h = t + e; l < h; l++) {
      this.writePrimitiveBounds(l, At, 0);
      const [p, g, y, v, x, d] = At;
      p < r && (r = p), v > o && (o = v), g < i && (i = g), x > u && (u = x), y < a && (a = y), d > f && (f = d);
    }
    return n[s + 0] = r, n[s + 1] = i, n[s + 2] = a, n[s + 3] = o, n[s + 4] = u, n[s + 5] = f, n;
  }
  computePrimitiveBounds(t, e, n) {
    const s = n.offset || 0;
    for (let r = t, i = t + e; r < i; r++) {
      this.writePrimitiveBounds(r, At, 0);
      const [a, o, u, f, l, h] = At, p = (a + f) / 2, g = (o + l) / 2, y = (u + h) / 2, v = (f - a) / 2, x = (l - o) / 2, d = (h - u) / 2, w = (r - s) * 6;
      n[w + 0] = p, n[w + 1] = v + (Math.abs(p) + v) * ue, n[w + 2] = g, n[w + 3] = x + (Math.abs(g) + x) * ue, n[w + 4] = y, n[w + 5] = d + (Math.abs(y) + d) * ue;
    }
    return n;
  }
  shiftPrimitiveOffsets(t) {
    const e = this._indirectBuffer;
    if (e)
      for (let n = 0, s = e.length; n < s; n++)
        e[n] += t;
    else {
      const n = this._roots;
      for (let s = 0; s < n.length; s++) {
        const r = n[s], i = new Uint32Array(r), a = new Uint16Array(r), o = r.byteLength / Y;
        for (let u = 0; u < o; u++) {
          const f = O * u, l = 2 * f;
          U(l, a) && (i[f + 6] += t);
        }
      }
    }
  }
  traverse(t, e = 0) {
    const n = this._roots[e], s = new Uint32Array(n), r = new Uint16Array(n);
    i(0);
    function i(a, o = 0) {
      const u = a * 2, f = U(u, r);
      if (f) {
        const l = s[a + 6], h = r[u + 14];
        t(o, f, new Float32Array(n, a * 4, 6), l, h);
      } else {
        const l = k(a), h = j(a, s), p = tn(a, s);
        t(o, f, new Float32Array(n, a * 4, 6), p) || (i(l, o + 1), i(h, o + 1));
      }
    }
  }
  refit() {
    const t = this._roots;
    for (let e = 0, n = t.length; e < n; e++) {
      const s = t[e], r = new Uint32Array(s), i = new Uint16Array(s), a = new Float32Array(s), o = s.byteLength / Y;
      for (let u = o - 1; u >= 0; u--) {
        const f = u * O, l = f * 2;
        if (U(l, i)) {
          const p = Z(f, r), g = X(l, i);
          this.writePrimitiveRangeBounds(p, g, At, 0), a.set(At, f);
        } else {
          const p = k(f), g = j(f, r);
          for (let y = 0; y < 3; y++) {
            const v = a[p + y], x = a[p + y + 3], d = a[g + y], w = a[g + y + 3];
            a[f + y] = v < d ? v : d, a[f + y + 3] = x > w ? x : w;
          }
        }
      }
    }
  }
  getBoundingBox(t) {
    return t.makeEmpty(), this._roots.forEach((n) => {
      L(0, new Float32Array(n), An), t.union(An);
    }), t;
  }
  // Base shapecast implementation that can be used by subclasses
  // TODO: see if we can get rid of "iterateFunc" here as well as the primitive so the function
  // API aligns with the "shapecast" implementation
  shapecast(t) {
    let {
      boundsTraverseOrder: e,
      intersectsBounds: n,
      intersectsRange: s,
      intersectsPrimitive: r,
      scratchPrimitive: i,
      iterate: a
    } = t;
    if (s && r) {
      const l = s;
      s = (h, p, g, y, v) => l(h, p, g, y, v) ? !0 : a(h, p, this, r, g, y, i);
    } else s || (r ? s = (l, h, p, g) => a(l, h, this, r, p, g, i) : s = (l, h, p) => p);
    let o = !1, u = 0;
    const f = this._roots;
    for (let l = 0, h = f.length; l < h; l++) {
      const p = f[l];
      if (o = Fs(this, l, n, s, e, u), o)
        break;
      u += p.byteLength / Y;
    }
    return o;
  }
}
function zs() {
  return typeof SharedArrayBuffer < "u";
}
function nn(c) {
  return c.index ? c.index.count : c.attributes.position.count;
}
function de(c) {
  return nn(c) / 3;
}
function Vs(c, t = ArrayBuffer) {
  return c > 65535 ? new Uint32Array(new t(4 * c)) : new Uint16Array(new t(2 * c));
}
function Os(c, t) {
  if (!c.index) {
    const e = c.attributes.position.count, n = t.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer, s = Vs(e, n);
    c.setIndex(new Vn(s, 1));
    for (let r = 0; r < e; r++)
      s[r] = r;
  }
}
function Us(c, t, e) {
  const n = nn(c) / e, s = t || c.drawRange, r = s.start / e, i = (s.start + s.count) / e, a = Math.max(0, r), o = Math.min(n, i) - a;
  return {
    offset: Math.floor(a),
    count: Math.floor(o)
  };
}
function Ns(c, t) {
  return c.groups.map((e) => ({
    offset: e.start / t,
    count: e.count / t
  }));
}
function bn(c, t, e) {
  const n = Us(c, t, e), s = Ns(c, e);
  if (!s.length)
    return [n];
  const r = [], i = n.offset, a = n.offset + n.count, o = nn(c) / e, u = [];
  for (const h of s) {
    const { offset: p, count: g } = h, y = p, v = isFinite(g) ? g : o - p, x = p + v;
    y < a && x > i && (u.push({ pos: Math.max(i, y), isStart: !0 }), u.push({ pos: Math.min(a, x), isStart: !1 }));
  }
  u.sort((h, p) => h.pos !== p.pos ? h.pos - p.pos : h.type === "end" ? -1 : 1);
  let f = 0, l = null;
  for (const h of u) {
    const p = h.pos;
    f !== 0 && p !== l && r.push({
      offset: l,
      count: p - l
    }), f += h.isStart ? 1 : -1, l = p;
  }
  return r;
}
function ks(c, t) {
  const e = c[c.length - 1], n = e.offset + e.count > 2 ** 16, s = c.reduce((u, f) => u + f.count, 0), r = n ? 4 : 2, i = t ? new SharedArrayBuffer(s * r) : new ArrayBuffer(s * r), a = n ? new Uint32Array(i) : new Uint16Array(i);
  let o = 0;
  for (let u = 0; u < c.length; u++) {
    const { offset: f, count: l } = c[u];
    for (let h = 0; h < l; h++)
      a[o + h] = f + h;
    o += l;
  }
  return a;
}
class js extends Ls {
  get indirect() {
    return !!this._indirectBuffer;
  }
  get primitiveStride() {
    return null;
  }
  get primitiveBufferStride() {
    return this.indirect ? 1 : this.primitiveStride;
  }
  set primitiveBufferStride(t) {
  }
  get primitiveBuffer() {
    return this.indirect ? this._indirectBuffer : this.geometry.index.array;
  }
  set primitiveBuffer(t) {
  }
  constructor(t, e = {}) {
    if (t.isBufferGeometry) {
      if (t.index && t.index.isInterleavedBufferAttribute)
        throw new Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.");
    } else throw new Error("BVH: Only BufferGeometries are supported.");
    if (e.useSharedArrayBuffer && !zs())
      throw new Error("BVH: SharedArrayBuffer is not available.");
    super(), this.geometry = t, this.resolvePrimitiveIndex = e.indirect ? (n) => this._indirectBuffer[n] : (n) => n, this.primitiveBuffer = null, this.primitiveBufferStride = null, this._indirectBuffer = null, e = {
      ...Hn,
      ...e
    }, e[Qe] || this.init(e);
  }
  init(t) {
    const { geometry: e, primitiveStride: n } = this;
    if (t.indirect) {
      const s = bn(e, t.range, n), r = ks(s, t.useSharedArrayBuffer);
      this._indirectBuffer = r;
    } else
      Os(e, t);
    super.init(t), !e.boundingBox && t.setBoundingBox && (e.boundingBox = this.getBoundingBox(new et()));
  }
  // Abstract methods to be implemented by subclasses
  getRootRanges(t) {
    return this.indirect ? [{ offset: 0, count: this._indirectBuffer.length }] : bn(this.geometry, t, this.primitiveStride);
  }
  raycastObject3D() {
    throw new Error("BVH: raycastObject3D() not implemented");
  }
  shapecast(t) {
    let {
      iterateDirect: e,
      iterateIndirect: n,
      ...s
    } = t;
    const r = this.indirect ? n : e;
    return super.shapecast({
      ...s,
      iterate: r
    });
  }
}
class ot {
  constructor() {
    this.min = 1 / 0, this.max = -1 / 0;
  }
  setFromPointsField(t, e) {
    let n = 1 / 0, s = -1 / 0;
    for (let r = 0, i = t.length; r < i; r++) {
      const o = t[r][e];
      n = o < n ? o : n, s = o > s ? o : s;
    }
    this.min = n, this.max = s;
  }
  setFromPoints(t, e) {
    let n = 1 / 0, s = -1 / 0;
    for (let r = 0, i = e.length; r < i; r++) {
      const a = e[r], o = t.dot(a);
      n = o < n ? o : n, s = o > s ? o : s;
    }
    this.min = n, this.max = s;
  }
  isSeparated(t) {
    return this.min > t.max || t.min > this.max;
  }
}
ot.prototype.setFromBox = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new M();
  return function(e, n) {
    const s = n.min, r = n.max;
    let i = 1 / 0, a = -1 / 0;
    for (let o = 0; o <= 1; o++)
      for (let u = 0; u <= 1; u++)
        for (let f = 0; f <= 1; f++) {
          c.x = s.x * o + r.x * (1 - o), c.y = s.y * u + r.y * (1 - u), c.z = s.z * f + r.z * (1 - f);
          const l = e.dot(c);
          i = Math.min(l, i), a = Math.max(l, a);
        }
    this.min = i, this.max = a;
  };
})();
const Hs = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new M(), t = /* @__PURE__ */ new M(), e = /* @__PURE__ */ new M();
  return function(s, r, i) {
    const a = s.start, o = c, u = r.start, f = t;
    e.subVectors(a, u), c.subVectors(s.end, s.start), t.subVectors(r.end, r.start);
    const l = e.dot(f), h = f.dot(o), p = f.dot(f), g = e.dot(o), v = o.dot(o) * p - h * h;
    let x, d;
    v !== 0 ? x = (l * h - g * p) / v : x = 0, d = (l + x * h) / p, i.x = x, i.y = d;
  };
})(), sn = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new ht(), t = /* @__PURE__ */ new M(), e = /* @__PURE__ */ new M();
  return function(s, r, i, a) {
    Hs(s, r, c);
    let o = c.x, u = c.y;
    if (o >= 0 && o <= 1 && u >= 0 && u <= 1) {
      s.at(o, i), r.at(u, a);
      return;
    } else if (o >= 0 && o <= 1) {
      u < 0 ? r.at(0, a) : r.at(1, a), s.closestPointToPoint(a, !0, i);
      return;
    } else if (u >= 0 && u <= 1) {
      o < 0 ? s.at(0, i) : s.at(1, i), r.closestPointToPoint(i, !0, a);
      return;
    } else {
      let f;
      o < 0 ? f = s.start : f = s.end;
      let l;
      u < 0 ? l = r.start : l = r.end;
      const h = t, p = e;
      if (s.closestPointToPoint(l, !0, t), r.closestPointToPoint(f, !0, e), h.distanceToSquared(l) <= p.distanceToSquared(f)) {
        i.copy(h), a.copy(l);
        return;
      } else {
        i.copy(f), a.copy(p);
        return;
      }
    }
  };
})(), $s = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new M(), t = /* @__PURE__ */ new M(), e = /* @__PURE__ */ new qe(), n = /* @__PURE__ */ new rt();
  return function(r, i) {
    const { radius: a, center: o } = r, { a: u, b: f, c: l } = i;
    if (n.start = u, n.end = f, n.closestPointToPoint(o, !0, c).distanceTo(o) <= a || (n.start = u, n.end = l, n.closestPointToPoint(o, !0, c).distanceTo(o) <= a) || (n.start = f, n.end = l, n.closestPointToPoint(o, !0, c).distanceTo(o) <= a)) return !0;
    const y = i.getPlane(e);
    if (Math.abs(y.distanceToPoint(o)) <= a) {
      const x = y.projectPoint(o, t);
      if (i.containsPoint(x)) return !0;
    }
    return !1;
  };
})(), Ws = ["x", "y", "z"], it = 1e-15, In = it * it;
function G(c) {
  return Math.abs(c) < it;
}
class tt extends Bt {
  constructor(...t) {
    super(...t), this.isExtendedTriangle = !0, this.satAxes = new Array(4).fill().map(() => new M()), this.satBounds = new Array(4).fill().map(() => new ot()), this.points = [this.a, this.b, this.c], this.plane = new qe(), this.isDegenerateIntoSegment = !1, this.isDegenerateIntoPoint = !1, this.degenerateSegment = new rt(), this.needsUpdate = !0;
  }
  intersectsSphere(t) {
    return $s(t, this);
  }
  update() {
    const t = this.a, e = this.b, n = this.c, s = this.points, r = this.satAxes, i = this.satBounds, a = r[0], o = i[0];
    this.getNormal(a), o.setFromPoints(a, s);
    const u = r[1], f = i[1];
    u.subVectors(t, e), f.setFromPoints(u, s);
    const l = r[2], h = i[2];
    l.subVectors(e, n), h.setFromPoints(l, s);
    const p = r[3], g = i[3];
    p.subVectors(n, t), g.setFromPoints(p, s);
    const y = u.length(), v = l.length(), x = p.length();
    this.isDegenerateIntoPoint = !1, this.isDegenerateIntoSegment = !1, y < it ? v < it || x < it ? this.isDegenerateIntoPoint = !0 : (this.isDegenerateIntoSegment = !0, this.degenerateSegment.start.copy(t), this.degenerateSegment.end.copy(n)) : v < it ? x < it ? this.isDegenerateIntoPoint = !0 : (this.isDegenerateIntoSegment = !0, this.degenerateSegment.start.copy(e), this.degenerateSegment.end.copy(t)) : x < it && (this.isDegenerateIntoSegment = !0, this.degenerateSegment.start.copy(n), this.degenerateSegment.end.copy(e)), this.plane.setFromNormalAndCoplanarPoint(a, t), this.needsUpdate = !1;
  }
}
tt.prototype.closestPointToSegment = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new M(), t = /* @__PURE__ */ new M(), e = /* @__PURE__ */ new rt();
  return function(s, r = null, i = null) {
    const { start: a, end: o } = s, u = this.points;
    let f, l = 1 / 0;
    for (let h = 0; h < 3; h++) {
      const p = (h + 1) % 3;
      e.start.copy(u[h]), e.end.copy(u[p]), sn(e, s, c, t), f = c.distanceToSquared(t), f < l && (l = f, r && r.copy(c), i && i.copy(t));
    }
    return this.closestPointToPoint(a, c), f = a.distanceToSquared(c), f < l && (l = f, r && r.copy(c), i && i.copy(a)), this.closestPointToPoint(o, c), f = o.distanceToSquared(c), f < l && (l = f, r && r.copy(c), i && i.copy(o)), Math.sqrt(l);
  };
})();
tt.prototype.intersectsTriangle = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new tt(), t = /* @__PURE__ */ new ot(), e = /* @__PURE__ */ new ot(), n = /* @__PURE__ */ new M(), s = /* @__PURE__ */ new M(), r = /* @__PURE__ */ new M(), i = /* @__PURE__ */ new M(), a = /* @__PURE__ */ new rt(), o = /* @__PURE__ */ new rt(), u = /* @__PURE__ */ new M(), f = /* @__PURE__ */ new ht(), l = /* @__PURE__ */ new ht();
  function h(w, m, A, b) {
    const I = n;
    !w.isDegenerateIntoPoint && !w.isDegenerateIntoSegment ? I.copy(w.plane.normal) : I.copy(m.plane.normal);
    const P = w.satBounds, T = w.satAxes;
    for (let R = 1; R < 4; R++) {
      const B = P[R], _ = T[R];
      if (t.setFromPoints(_, m.points), B.isSeparated(t) || (i.copy(I).cross(_), t.setFromPoints(i, w.points), e.setFromPoints(i, m.points), t.isSeparated(e))) return !1;
    }
    const S = m.satBounds, D = m.satAxes;
    for (let R = 1; R < 4; R++) {
      const B = S[R], _ = D[R];
      if (t.setFromPoints(_, w.points), B.isSeparated(t) || (i.crossVectors(I, _), t.setFromPoints(i, w.points), e.setFromPoints(i, m.points), t.isSeparated(e))) return !1;
    }
    return A && (b || console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."), A.start.set(0, 0, 0), A.end.set(0, 0, 0)), !0;
  }
  function p(w, m, A, b, I, P, T, S, D, R, B) {
    let _ = T / (T - S);
    R.x = b + (I - b) * _, B.start.subVectors(m, w).multiplyScalar(_).add(w), _ = T / (T - D), R.y = b + (P - b) * _, B.end.subVectors(A, w).multiplyScalar(_).add(w);
  }
  function g(w, m, A, b, I, P, T, S, D, R, B) {
    if (I > 0)
      p(w.c, w.a, w.b, b, m, A, D, T, S, R, B);
    else if (P > 0)
      p(w.b, w.a, w.c, A, m, b, S, T, D, R, B);
    else if (S * D > 0 || T != 0)
      p(w.a, w.b, w.c, m, A, b, T, S, D, R, B);
    else if (S != 0)
      p(w.b, w.a, w.c, A, m, b, S, T, D, R, B);
    else if (D != 0)
      p(w.c, w.a, w.b, b, m, A, D, T, S, R, B);
    else
      return !0;
    return !1;
  }
  function y(w, m, A, b) {
    const I = m.degenerateSegment, P = w.plane.distanceToPoint(I.start), T = w.plane.distanceToPoint(I.end);
    return G(P) ? G(T) ? h(w, m, A, b) : (A && (A.start.copy(I.start), A.end.copy(I.start)), w.containsPoint(I.start)) : G(T) ? (A && (A.start.copy(I.end), A.end.copy(I.end)), w.containsPoint(I.end)) : w.plane.intersectLine(I, n) != null ? (A && (A.start.copy(n), A.end.copy(n)), w.containsPoint(n)) : !1;
  }
  function v(w, m, A) {
    const b = m.a;
    return G(w.plane.distanceToPoint(b)) && w.containsPoint(b) ? (A && (A.start.copy(b), A.end.copy(b)), !0) : !1;
  }
  function x(w, m, A) {
    const b = w.degenerateSegment, I = m.a;
    return b.closestPointToPoint(I, !0, n), I.distanceToSquared(n) < In ? (A && (A.start.copy(I), A.end.copy(I)), !0) : !1;
  }
  function d(w, m, A, b) {
    if (w.isDegenerateIntoSegment)
      if (m.isDegenerateIntoSegment) {
        const I = w.degenerateSegment, P = m.degenerateSegment, T = s, S = r;
        I.delta(T), P.delta(S);
        const D = n.subVectors(P.start, I.start), R = T.x * S.y - T.y * S.x;
        if (G(R))
          return !1;
        const B = (D.x * S.y - D.y * S.x) / R, _ = -(T.x * D.y - T.y * D.x) / R;
        if (B < 0 || B > 1 || _ < 0 || _ > 1)
          return !1;
        const E = I.start.z + T.z * B, z = P.start.z + S.z * _;
        return G(E - z) ? (A && (A.start.copy(I.start).addScaledVector(T, B), A.end.copy(I.start).addScaledVector(T, B)), !0) : !1;
      } else return m.isDegenerateIntoPoint ? x(w, m, A) : y(m, w, A, b);
    else {
      if (w.isDegenerateIntoPoint)
        return m.isDegenerateIntoPoint ? m.a.distanceToSquared(w.a) < In ? (A && (A.start.copy(w.a), A.end.copy(w.a)), !0) : !1 : m.isDegenerateIntoSegment ? x(m, w, A) : v(m, w, A);
      if (m.isDegenerateIntoPoint)
        return v(w, m, A);
      if (m.isDegenerateIntoSegment)
        return y(w, m, A, b);
    }
  }
  return function(m, A = null, b = !1) {
    this.needsUpdate && this.update(), m.isExtendedTriangle ? m.needsUpdate && m.update() : (c.copy(m), c.update(), m = c);
    const I = d(this, m, A, b);
    if (I !== void 0)
      return I;
    const P = this.plane, T = m.plane;
    let S = T.distanceToPoint(this.a), D = T.distanceToPoint(this.b), R = T.distanceToPoint(this.c);
    G(S) && (S = 0), G(D) && (D = 0), G(R) && (R = 0);
    const B = S * D, _ = S * R;
    if (B > 0 && _ > 0)
      return !1;
    let E = P.distanceToPoint(m.a), z = P.distanceToPoint(m.b), Ht = P.distanceToPoint(m.c);
    G(E) && (E = 0), G(z) && (z = 0), G(Ht) && (Ht = 0);
    const on = E * z, an = E * Ht;
    if (on > 0 && an > 0)
      return !1;
    s.copy(P.normal), r.copy(T.normal);
    const me = s.cross(r);
    let ge = 0, ve = Math.abs(me.x);
    const cn = Math.abs(me.y);
    cn > ve && (ve = cn, ge = 1), Math.abs(me.z) > ve && (ge = 2);
    const xt = Ws[ge], Gn = this.a[xt], Jn = this.b[xt], Qn = this.c[xt], ts = m.a[xt], es = m.b[xt], ns = m.c[xt];
    if (g(this, Gn, Jn, Qn, B, _, S, D, R, f, a))
      return h(this, m, A, b);
    if (g(m, ts, es, ns, on, an, E, z, Ht, l, o))
      return h(this, m, A, b);
    if (f.y < f.x) {
      const xe = f.y;
      f.y = f.x, f.x = xe, u.copy(a.start), a.start.copy(a.end), a.end.copy(u);
    }
    if (l.y < l.x) {
      const xe = l.y;
      l.y = l.x, l.x = xe, u.copy(o.start), o.start.copy(o.end), o.end.copy(u);
    }
    return f.y < l.x || l.y < f.x ? !1 : (A && (l.x > f.x ? A.start.copy(o.start) : A.start.copy(a.start), l.y < f.y ? A.end.copy(o.end) : A.end.copy(a.end)), !0);
  };
})();
tt.prototype.distanceToPoint = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new M();
  return function(e) {
    return this.closestPointToPoint(e, c), e.distanceTo(c);
  };
})();
tt.prototype.distanceToTriangle = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new M(), t = /* @__PURE__ */ new M(), e = ["a", "b", "c"], n = /* @__PURE__ */ new rt(), s = /* @__PURE__ */ new rt();
  return function(i, a = null, o = null) {
    const u = a || o ? n : null;
    if (this.intersectsTriangle(i, u))
      return (a || o) && (a && u.getCenter(a), o && u.getCenter(o)), 0;
    let f = 1 / 0;
    for (let l = 0; l < 3; l++) {
      let h;
      const p = e[l], g = i[p];
      this.closestPointToPoint(g, c), h = g.distanceToSquared(c), h < f && (f = h, a && a.copy(c), o && o.copy(g));
      const y = this[p];
      i.closestPointToPoint(y, c), h = y.distanceToSquared(c), h < f && (f = h, a && a.copy(y), o && o.copy(c));
    }
    for (let l = 0; l < 3; l++) {
      const h = e[l], p = e[(l + 1) % 3];
      n.set(this[h], this[p]);
      for (let g = 0; g < 3; g++) {
        const y = e[g], v = e[(g + 1) % 3];
        s.set(i[y], i[v]), sn(n, s, c, t);
        const x = c.distanceToSquared(t);
        x < f && (f = x, a && a.copy(c), o && o.copy(t));
      }
    }
    return Math.sqrt(f);
  };
})();
class q {
  constructor(t, e, n) {
    this.isOrientedBox = !0, this.min = new M(), this.max = new M(), this.matrix = new pt(), this.invMatrix = new pt(), this.points = new Array(8).fill().map(() => new M()), this.satAxes = new Array(3).fill().map(() => new M()), this.satBounds = new Array(3).fill().map(() => new ot()), this.alignedSatBounds = new Array(3).fill().map(() => new ot()), this.needsUpdate = !1, t && this.min.copy(t), e && this.max.copy(e), n && this.matrix.copy(n);
  }
  set(t, e, n) {
    this.min.copy(t), this.max.copy(e), this.matrix.copy(n), this.needsUpdate = !0;
  }
  copy(t) {
    this.min.copy(t.min), this.max.copy(t.max), this.matrix.copy(t.matrix), this.needsUpdate = !0;
  }
}
q.prototype.update = /* @__PURE__ */ (function() {
  return function() {
    const t = this.matrix, e = this.min, n = this.max, s = this.points;
    for (let u = 0; u <= 1; u++)
      for (let f = 0; f <= 1; f++)
        for (let l = 0; l <= 1; l++) {
          const h = 1 * u | 2 * f | 4 * l, p = s[h];
          p.x = u ? n.x : e.x, p.y = f ? n.y : e.y, p.z = l ? n.z : e.z, p.applyMatrix4(t);
        }
    const r = this.satBounds, i = this.satAxes, a = s[0];
    for (let u = 0; u < 3; u++) {
      const f = i[u], l = r[u], h = 1 << u, p = s[h];
      f.subVectors(a, p), l.setFromPoints(f, s);
    }
    const o = this.alignedSatBounds;
    o[0].setFromPointsField(s, "x"), o[1].setFromPointsField(s, "y"), o[2].setFromPointsField(s, "z"), this.invMatrix.copy(this.matrix).invert(), this.needsUpdate = !1;
  };
})();
q.prototype.intersectsBox = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new ot();
  return function(e) {
    this.needsUpdate && this.update();
    const n = e.min, s = e.max, r = this.satBounds, i = this.satAxes, a = this.alignedSatBounds;
    if (c.min = n.x, c.max = s.x, a[0].isSeparated(c) || (c.min = n.y, c.max = s.y, a[1].isSeparated(c)) || (c.min = n.z, c.max = s.z, a[2].isSeparated(c))) return !1;
    for (let o = 0; o < 3; o++) {
      const u = i[o], f = r[o];
      if (c.setFromBox(u, e), f.isSeparated(c)) return !1;
    }
    return !0;
  };
})();
q.prototype.intersectsTriangle = /* @__PURE__ */ (function() {
  const c = /* @__PURE__ */ new tt(), t = /* @__PURE__ */ new Array(3), e = /* @__PURE__ */ new ot(), n = /* @__PURE__ */ new ot(), s = /* @__PURE__ */ new M();
  return function(i) {
    this.needsUpdate && this.update(), i.isExtendedTriangle ? i.needsUpdate && i.update() : (c.copy(i), c.update(), i = c);
    const a = this.satBounds, o = this.satAxes;
    t[0] = i.a, t[1] = i.b, t[2] = i.c;
    for (let h = 0; h < 3; h++) {
      const p = a[h], g = o[h];
      if (e.setFromPoints(g, t), p.isSeparated(e)) return !1;
    }
    const u = i.satBounds, f = i.satAxes, l = this.points;
    for (let h = 0; h < 3; h++) {
      const p = u[h], g = f[h];
      if (e.setFromPoints(g, l), p.isSeparated(e)) return !1;
    }
    for (let h = 0; h < 3; h++) {
      const p = o[h];
      for (let g = 0; g < 4; g++) {
        const y = f[g];
        if (s.crossVectors(p, y), e.setFromPoints(s, t), n.setFromPoints(s, l), e.isSeparated(n)) return !1;
      }
    }
    return !0;
  };
})();
q.prototype.closestPointToPoint = /* @__PURE__ */ (function() {
  return function(t, e) {
    return this.needsUpdate && this.update(), e.copy(t).applyMatrix4(this.invMatrix).clamp(this.min, this.max).applyMatrix4(this.matrix), e;
  };
})();
q.prototype.distanceToPoint = (function() {
  const c = new M();
  return function(e) {
    return this.closestPointToPoint(e, c), e.distanceTo(c);
  };
})();
q.prototype.distanceToBox = /* @__PURE__ */ (function() {
  const c = ["x", "y", "z"], t = /* @__PURE__ */ new Array(12).fill().map(() => new rt()), e = /* @__PURE__ */ new Array(12).fill().map(() => new rt()), n = /* @__PURE__ */ new M(), s = /* @__PURE__ */ new M();
  return function(i, a = 0, o = null, u = null) {
    if (this.needsUpdate && this.update(), this.intersectsBox(i))
      return (o || u) && (i.getCenter(s), this.closestPointToPoint(s, n), i.closestPointToPoint(n, s), o && o.copy(n), u && u.copy(s)), 0;
    const f = a * a, l = i.min, h = i.max, p = this.points;
    let g = 1 / 0;
    for (let v = 0; v < 8; v++) {
      const x = p[v];
      s.copy(x).clamp(l, h);
      const d = x.distanceToSquared(s);
      if (d < g && (g = d, o && o.copy(x), u && u.copy(s), d < f))
        return Math.sqrt(d);
    }
    let y = 0;
    for (let v = 0; v < 3; v++)
      for (let x = 0; x <= 1; x++)
        for (let d = 0; d <= 1; d++) {
          const w = (v + 1) % 3, m = (v + 2) % 3, A = x << w | d << m, b = 1 << v | x << w | d << m, I = p[A], P = p[b];
          t[y].set(I, P);
          const S = c[v], D = c[w], R = c[m], B = e[y], _ = B.start, E = B.end;
          _[S] = l[S], _[D] = x ? l[D] : h[D], _[R] = d ? l[R] : h[D], E[S] = h[S], E[D] = x ? l[D] : h[D], E[R] = d ? l[R] : h[D], y++;
        }
    for (let v = 0; v <= 1; v++)
      for (let x = 0; x <= 1; x++)
        for (let d = 0; d <= 1; d++) {
          s.x = v ? h.x : l.x, s.y = x ? h.y : l.y, s.z = d ? h.z : l.z, this.closestPointToPoint(s, n);
          const w = s.distanceToSquared(n);
          if (w < g && (g = w, o && o.copy(n), u && u.copy(s), w < f))
            return Math.sqrt(w);
        }
    for (let v = 0; v < 12; v++) {
      const x = t[v];
      for (let d = 0; d < 12; d++) {
        const w = e[d];
        sn(x, w, n, s);
        const m = n.distanceToSquared(s);
        if (m < g && (g = m, o && o.copy(n), u && u.copy(s), m < f))
          return Math.sqrt(m);
      }
    }
    return Math.sqrt(g);
  };
})();
class Ys extends en {
  constructor() {
    super(() => new tt());
  }
}
const J = /* @__PURE__ */ new Ys(), Ft = /* @__PURE__ */ new M(), De = /* @__PURE__ */ new M();
function Zs(c, t, e = {}, n = 0, s = 1 / 0) {
  const r = n * n, i = s * s;
  let a = 1 / 0, o = null;
  if (c.shapecast(
    {
      boundsTraverseOrder: (f) => (Ft.copy(t).clamp(f.min, f.max), Ft.distanceToSquared(t)),
      intersectsBounds: (f, l, h) => h < a && h < i,
      intersectsTriangle: (f, l) => {
        f.closestPointToPoint(t, Ft);
        const h = t.distanceToSquared(Ft);
        return h < a && (De.copy(Ft), a = h, o = l), h < r;
      }
    }
  ), a === 1 / 0) return null;
  const u = Math.sqrt(a);
  return e.point ? e.point.copy(De) : e.point = De.clone(), e.distance = u, e.faceIndex = o, e;
}
const Kt = parseInt(On) >= 169, Xs = parseInt(On) <= 161, mt = /* @__PURE__ */ new M(), gt = /* @__PURE__ */ new M(), vt = /* @__PURE__ */ new M(), Gt = /* @__PURE__ */ new ht(), Jt = /* @__PURE__ */ new ht(), Qt = /* @__PURE__ */ new ht(), Sn = /* @__PURE__ */ new M(), Rn = /* @__PURE__ */ new M(), Pn = /* @__PURE__ */ new M(), Lt = /* @__PURE__ */ new M();
function qs(c, t, e, n, s, r, i, a) {
  let o;
  if (r === is ? o = c.intersectTriangle(n, e, t, !0, s) : o = c.intersectTriangle(t, e, n, r !== rs, s), o === null) return null;
  const u = c.origin.distanceTo(s);
  return u < i || u > a ? null : {
    distance: u,
    point: s.clone()
  };
}
function Tn(c, t, e, n, s, r, i, a, o, u, f) {
  mt.fromBufferAttribute(t, r), gt.fromBufferAttribute(t, i), vt.fromBufferAttribute(t, a);
  const l = qs(c, mt, gt, vt, Lt, o, u, f);
  if (l) {
    if (n) {
      Gt.fromBufferAttribute(n, r), Jt.fromBufferAttribute(n, i), Qt.fromBufferAttribute(n, a), l.uv = new ht();
      const p = Bt.getInterpolation(Lt, mt, gt, vt, Gt, Jt, Qt, l.uv);
      Kt || (l.uv = p);
    }
    if (s) {
      Gt.fromBufferAttribute(s, r), Jt.fromBufferAttribute(s, i), Qt.fromBufferAttribute(s, a), l.uv1 = new ht();
      const p = Bt.getInterpolation(Lt, mt, gt, vt, Gt, Jt, Qt, l.uv1);
      Kt || (l.uv1 = p), Xs && (l.uv2 = l.uv1);
    }
    if (e) {
      Sn.fromBufferAttribute(e, r), Rn.fromBufferAttribute(e, i), Pn.fromBufferAttribute(e, a), l.normal = new M();
      const p = Bt.getInterpolation(Lt, mt, gt, vt, Sn, Rn, Pn, l.normal);
      l.normal.dot(c.direction) > 0 && l.normal.multiplyScalar(-1), Kt || (l.normal = p);
    }
    const h = {
      a: r,
      b: i,
      c: a,
      normal: new M(),
      materialIndex: 0
    };
    if (Bt.getNormal(mt, gt, vt, h.normal), l.face = h, l.faceIndex = r, Kt) {
      const p = new M();
      Bt.getBarycoord(Lt, mt, gt, vt, p), l.barycoord = p;
    }
  }
  return l;
}
function Dn(c) {
  return c && c.isMaterial ? c.side : c;
}
function ye(c, t, e, n, s, r, i) {
  const a = n * 3;
  let o = a + 0, u = a + 1, f = a + 2;
  const { index: l, groups: h } = c;
  c.index && (o = l.getX(o), u = l.getX(u), f = l.getX(f));
  const { position: p, normal: g, uv: y, uv1: v } = c.attributes;
  if (Array.isArray(t)) {
    const x = n * 3;
    for (let d = 0, w = h.length; d < w; d++) {
      const { start: m, count: A, materialIndex: b } = h[d];
      if (x >= m && x < m + A) {
        const I = Dn(t[b]), P = Tn(e, p, g, y, v, o, u, f, I, r, i);
        if (P)
          if (P.faceIndex = n, P.face.materialIndex = b, s)
            s.push(P);
          else
            return P;
      }
    }
  } else {
    const x = Dn(t), d = Tn(e, p, g, y, v, o, u, f, x, r, i);
    if (d)
      if (d.faceIndex = n, d.face.materialIndex = 0, s)
        s.push(d);
      else
        return d;
  }
  return null;
}
function V(c, t, e, n) {
  const s = c.a, r = c.b, i = c.c;
  let a = t, o = t + 1, u = t + 2;
  e && (a = e.getX(a), o = e.getX(o), u = e.getX(u)), s.x = n.getX(a), s.y = n.getY(a), s.z = n.getZ(a), r.x = n.getX(o), r.y = n.getY(o), r.z = n.getZ(o), i.x = n.getX(u), i.y = n.getY(u), i.z = n.getZ(u);
}
function Ks(c, t, e, n, s, r, i, a) {
  const { geometry: o, _indirectBuffer: u } = c;
  for (let f = n, l = n + s; f < l; f++)
    ye(o, t, e, f, r, i, a);
}
function Gs(c, t, e, n, s, r, i) {
  const { geometry: a, _indirectBuffer: o } = c;
  let u = 1 / 0, f = null;
  for (let l = n, h = n + s; l < h; l++) {
    let p;
    p = ye(a, t, e, l, null, r, i), p && p.distance < u && (f = p, u = p.distance);
  }
  return f;
}
function Js(c, t, e, n, s, r, i) {
  const { geometry: a } = e, { index: o } = a, u = a.attributes.position;
  for (let f = c, l = t + c; f < l; f++) {
    let h;
    if (h = f, V(i, h * 3, o, u), i.needsUpdate = !0, n(i, h, s, r))
      return !0;
  }
  return !1;
}
function Qs(c, t = null) {
  t && Array.isArray(t) && (t = new Set(t));
  const e = c.geometry, n = e.index ? e.index.array : null, s = e.attributes.position;
  let r, i, a, o, u = 0;
  const f = c._roots;
  for (let h = 0, p = f.length; h < p; h++)
    r = f[h], i = new Uint32Array(r), a = new Uint16Array(r), o = new Float32Array(r), l(0, u), u += r.byteLength;
  function l(h, p, g = !1) {
    const y = h * 2;
    if (U(y, a)) {
      const v = Z(h, i), x = X(y, a);
      let d = 1 / 0, w = 1 / 0, m = 1 / 0, A = -1 / 0, b = -1 / 0, I = -1 / 0;
      for (let P = 3 * v, T = 3 * (v + x); P < T; P++) {
        let S = n[P];
        const D = s.getX(S), R = s.getY(S), B = s.getZ(S);
        D < d && (d = D), D > A && (A = D), R < w && (w = R), R > b && (b = R), B < m && (m = B), B > I && (I = B);
      }
      return o[h + 0] !== d || o[h + 1] !== w || o[h + 2] !== m || o[h + 3] !== A || o[h + 4] !== b || o[h + 5] !== I ? (o[h + 0] = d, o[h + 1] = w, o[h + 2] = m, o[h + 3] = A, o[h + 4] = b, o[h + 5] = I, !0) : !1;
    } else {
      const v = k(h), x = j(h, i);
      let d = g, w = !1, m = !1;
      if (t) {
        if (!d) {
          const S = v / O + p / Y, D = x / O + p / Y;
          w = t.has(S), m = t.has(D), d = !w && !m;
        }
      } else
        w = !0, m = !0;
      const A = d || w, b = d || m;
      let I = !1;
      A && (I = l(v, p, d));
      let P = !1;
      b && (P = l(x, p, d));
      const T = I || P;
      if (T)
        for (let S = 0; S < 3; S++) {
          const D = v + S, R = x + S, B = o[D], _ = o[D + 3], E = o[R], z = o[R + 3];
          o[h + S] = B < E ? B : E, o[h + S + 3] = _ > z ? _ : z;
        }
      return T;
    }
  }
}
function dt(c, t, e, n, s) {
  let r, i, a, o, u, f;
  const l = 1 / e.direction.x, h = 1 / e.direction.y, p = 1 / e.direction.z, g = e.origin.x, y = e.origin.y, v = e.origin.z;
  let x = t[c], d = t[c + 3], w = t[c + 1], m = t[c + 3 + 1], A = t[c + 2], b = t[c + 3 + 2];
  return l >= 0 ? (r = (x - g) * l, i = (d - g) * l) : (r = (d - g) * l, i = (x - g) * l), h >= 0 ? (a = (w - y) * h, o = (m - y) * h) : (a = (m - y) * h, o = (w - y) * h), r > o || a > i || ((a > r || isNaN(r)) && (r = a), (o < i || isNaN(i)) && (i = o), p >= 0 ? (u = (A - v) * p, f = (b - v) * p) : (u = (b - v) * p, f = (A - v) * p), r > f || u > i) ? !1 : ((u > r || r !== r) && (r = u), (f < i || i !== i) && (i = f), r <= s && i >= n);
}
function ti(c, t, e, n, s, r, i, a) {
  const { geometry: o, _indirectBuffer: u } = c;
  for (let f = n, l = n + s; f < l; f++) {
    let h = u ? u[f] : f;
    ye(o, t, e, h, r, i, a);
  }
}
function ei(c, t, e, n, s, r, i) {
  const { geometry: a, _indirectBuffer: o } = c;
  let u = 1 / 0, f = null;
  for (let l = n, h = n + s; l < h; l++) {
    let p;
    p = ye(a, t, e, o ? o[l] : l, null, r, i), p && p.distance < u && (f = p, u = p.distance);
  }
  return f;
}
function ni(c, t, e, n, s, r, i) {
  const { geometry: a } = e, { index: o } = a, u = a.attributes.position;
  for (let f = c, l = t + c; f < l; f++) {
    let h;
    if (h = e.resolveTriangleIndex(f), V(i, h * 3, o, u), i.needsUpdate = !0, n(i, h, s, r))
      return !0;
  }
  return !1;
}
function si(c, t, e, n, s, r, i) {
  F.setBuffer(c._roots[t]), je(0, c, e, n, s, r, i), F.clearBuffer();
}
function je(c, t, e, n, s, r, i) {
  const { float32Array: a, uint16Array: o, uint32Array: u } = F, f = c * 2;
  if (U(f, o)) {
    const h = Z(c, u), p = X(f, o);
    Ks(t, e, n, h, p, s, r, i);
  } else {
    const h = k(c);
    dt(h, a, n, r, i) && je(h, t, e, n, s, r, i);
    const p = j(c, u);
    dt(p, a, n, r, i) && je(p, t, e, n, s, r, i);
  }
}
const ii = ["x", "y", "z"];
function ri(c, t, e, n, s, r) {
  F.setBuffer(c._roots[t]);
  const i = He(0, c, e, n, s, r);
  return F.clearBuffer(), i;
}
function He(c, t, e, n, s, r) {
  const { float32Array: i, uint16Array: a, uint32Array: o } = F;
  let u = c * 2;
  if (U(u, a)) {
    const l = Z(c, o), h = X(u, a);
    return Gs(t, e, n, l, h, s, r);
  } else {
    const l = tn(c, o), h = ii[l], g = n.direction[h] >= 0;
    let y, v;
    g ? (y = k(c), v = j(c, o)) : (y = j(c, o), v = k(c));
    const d = dt(y, i, n, s, r) ? He(y, t, e, n, s, r) : null;
    if (d) {
      const A = d.point[h];
      if (g ? A <= i[v + l] : (
        // min bounding data
        A >= i[v + l + 3]
      ))
        return d;
    }
    const m = dt(v, i, n, s, r) ? He(v, t, e, n, s, r) : null;
    return d && m ? d.distance <= m.distance ? d : m : d || m || null;
  }
}
const te = /* @__PURE__ */ new et(), bt = /* @__PURE__ */ new tt(), It = /* @__PURE__ */ new tt(), zt = /* @__PURE__ */ new pt(), Bn = /* @__PURE__ */ new q(), ee = /* @__PURE__ */ new q();
function oi(c, t, e, n) {
  F.setBuffer(c._roots[t]);
  const s = $e(0, c, e, n);
  return F.clearBuffer(), s;
}
function $e(c, t, e, n, s = null) {
  const { float32Array: r, uint16Array: i, uint32Array: a } = F;
  let o = c * 2;
  if (s === null && (e.boundingBox || e.computeBoundingBox(), Bn.set(e.boundingBox.min, e.boundingBox.max, n), s = Bn), U(o, i)) {
    const f = t.geometry, l = f.index, h = f.attributes.position, p = e.index, g = e.attributes.position, y = Z(c, a), v = X(o, i);
    if (zt.copy(n).invert(), e.boundsTree)
      return L(c, r, ee), ee.matrix.copy(zt), ee.needsUpdate = !0, e.boundsTree.shapecast({
        intersectsBounds: (d) => ee.intersectsBox(d),
        intersectsTriangle: (d) => {
          d.a.applyMatrix4(n), d.b.applyMatrix4(n), d.c.applyMatrix4(n), d.needsUpdate = !0;
          for (let w = y * 3, m = (v + y) * 3; w < m; w += 3)
            if (V(It, w, l, h), It.needsUpdate = !0, d.intersectsTriangle(It))
              return !0;
          return !1;
        }
      });
    {
      const x = de(e);
      for (let d = y * 3, w = (v + y) * 3; d < w; d += 3) {
        V(bt, d, l, h), bt.a.applyMatrix4(zt), bt.b.applyMatrix4(zt), bt.c.applyMatrix4(zt), bt.needsUpdate = !0;
        for (let m = 0, A = x * 3; m < A; m += 3)
          if (V(It, m, p, g), It.needsUpdate = !0, bt.intersectsTriangle(It))
            return !0;
      }
    }
  } else {
    const f = k(c), l = j(c, a);
    return L(f, r, te), !!(s.intersectsBox(te) && $e(f, t, e, n, s) || (L(l, r, te), s.intersectsBox(te) && $e(l, t, e, n, s)));
  }
}
const ne = /* @__PURE__ */ new pt(), Be = /* @__PURE__ */ new q(), Vt = /* @__PURE__ */ new q(), ai = /* @__PURE__ */ new M(), ci = /* @__PURE__ */ new M(), li = /* @__PURE__ */ new M(), ui = /* @__PURE__ */ new M();
function fi(c, t, e, n = {}, s = {}, r = 0, i = 1 / 0) {
  t.boundingBox || t.computeBoundingBox(), Be.set(t.boundingBox.min, t.boundingBox.max, e), Be.needsUpdate = !0;
  const a = c.geometry, o = a.attributes.position, u = a.index, f = t.attributes.position, l = t.index, h = J.getPrimitive(), p = J.getPrimitive();
  let g = ai, y = ci, v = null, x = null;
  s && (v = li, x = ui);
  let d = 1 / 0, w = null, m = null;
  return ne.copy(e).invert(), Vt.matrix.copy(ne), c.shapecast(
    {
      boundsTraverseOrder: (A) => Be.distanceToBox(A),
      intersectsBounds: (A, b, I) => I < d && I < i ? (b && (Vt.min.copy(A.min), Vt.max.copy(A.max), Vt.needsUpdate = !0), !0) : !1,
      intersectsRange: (A, b) => {
        if (t.boundsTree)
          return t.boundsTree.shapecast({
            boundsTraverseOrder: (P) => Vt.distanceToBox(P),
            intersectsBounds: (P, T, S) => S < d && S < i,
            intersectsRange: (P, T) => {
              for (let S = P, D = P + T; S < D; S++) {
                V(p, 3 * S, l, f), p.a.applyMatrix4(e), p.b.applyMatrix4(e), p.c.applyMatrix4(e), p.needsUpdate = !0;
                for (let R = A, B = A + b; R < B; R++) {
                  V(h, 3 * R, u, o), h.needsUpdate = !0;
                  const _ = h.distanceToTriangle(p, g, v);
                  if (_ < d && (y.copy(g), x && x.copy(v), d = _, w = R, m = S), _ < r)
                    return !0;
                }
              }
            }
          });
        {
          const I = de(t);
          for (let P = 0, T = I; P < T; P++) {
            V(p, 3 * P, l, f), p.a.applyMatrix4(e), p.b.applyMatrix4(e), p.c.applyMatrix4(e), p.needsUpdate = !0;
            for (let S = A, D = A + b; S < D; S++) {
              V(h, 3 * S, u, o), h.needsUpdate = !0;
              const R = h.distanceToTriangle(p, g, v);
              if (R < d && (y.copy(g), x && x.copy(v), d = R, w = S, m = P), R < r)
                return !0;
            }
          }
        }
      }
    }
  ), J.releasePrimitive(h), J.releasePrimitive(p), d === 1 / 0 ? null : (n.point ? n.point.copy(y) : n.point = y.clone(), n.distance = d, n.faceIndex = w, s && (s.point ? s.point.copy(x) : s.point = x.clone(), s.point.applyMatrix4(ne), y.applyMatrix4(ne), s.distance = y.sub(s.point).length(), s.faceIndex = m), n);
}
function hi(c, t = null) {
  t && Array.isArray(t) && (t = new Set(t));
  const e = c.geometry, n = e.index ? e.index.array : null, s = e.attributes.position;
  let r, i, a, o, u = 0;
  const f = c._roots;
  for (let h = 0, p = f.length; h < p; h++)
    r = f[h], i = new Uint32Array(r), a = new Uint16Array(r), o = new Float32Array(r), l(0, u), u += r.byteLength;
  function l(h, p, g = !1) {
    const y = h * 2;
    if (U(y, a)) {
      const v = Z(h, i), x = X(y, a);
      let d = 1 / 0, w = 1 / 0, m = 1 / 0, A = -1 / 0, b = -1 / 0, I = -1 / 0;
      for (let P = v, T = v + x; P < T; P++) {
        const S = 3 * c.resolveTriangleIndex(P);
        for (let D = 0; D < 3; D++) {
          let R = S + D;
          R = n ? n[R] : R;
          const B = s.getX(R), _ = s.getY(R), E = s.getZ(R);
          B < d && (d = B), B > A && (A = B), _ < w && (w = _), _ > b && (b = _), E < m && (m = E), E > I && (I = E);
        }
      }
      return o[h + 0] !== d || o[h + 1] !== w || o[h + 2] !== m || o[h + 3] !== A || o[h + 4] !== b || o[h + 5] !== I ? (o[h + 0] = d, o[h + 1] = w, o[h + 2] = m, o[h + 3] = A, o[h + 4] = b, o[h + 5] = I, !0) : !1;
    } else {
      const v = k(h), x = j(h, i);
      let d = g, w = !1, m = !1;
      if (t) {
        if (!d) {
          const S = v / O + p / Y, D = x / O + p / Y;
          w = t.has(S), m = t.has(D), d = !w && !m;
        }
      } else
        w = !0, m = !0;
      const A = d || w, b = d || m;
      let I = !1;
      A && (I = l(v, p, d));
      let P = !1;
      b && (P = l(x, p, d));
      const T = I || P;
      if (T)
        for (let S = 0; S < 3; S++) {
          const D = v + S, R = x + S, B = o[D], _ = o[D + 3], E = o[R], z = o[R + 3];
          o[h + S] = B < E ? B : E, o[h + S + 3] = _ > z ? _ : z;
        }
      return T;
    }
  }
}
function pi(c, t, e, n, s, r, i) {
  F.setBuffer(c._roots[t]), We(0, c, e, n, s, r, i), F.clearBuffer();
}
function We(c, t, e, n, s, r, i) {
  const { float32Array: a, uint16Array: o, uint32Array: u } = F, f = c * 2;
  if (U(f, o)) {
    const h = Z(c, u), p = X(f, o);
    ti(t, e, n, h, p, s, r, i);
  } else {
    const h = k(c);
    dt(h, a, n, r, i) && We(h, t, e, n, s, r, i);
    const p = j(c, u);
    dt(p, a, n, r, i) && We(p, t, e, n, s, r, i);
  }
}
const di = ["x", "y", "z"];
function yi(c, t, e, n, s, r) {
  F.setBuffer(c._roots[t]);
  const i = Ye(0, c, e, n, s, r);
  return F.clearBuffer(), i;
}
function Ye(c, t, e, n, s, r) {
  const { float32Array: i, uint16Array: a, uint32Array: o } = F;
  let u = c * 2;
  if (U(u, a)) {
    const l = Z(c, o), h = X(u, a);
    return ei(t, e, n, l, h, s, r);
  } else {
    const l = tn(c, o), h = di[l], g = n.direction[h] >= 0;
    let y, v;
    g ? (y = k(c), v = j(c, o)) : (y = j(c, o), v = k(c));
    const d = dt(y, i, n, s, r) ? Ye(y, t, e, n, s, r) : null;
    if (d) {
      const A = d.point[h];
      if (g ? A <= i[v + l] : (
        // min bounding data
        A >= i[v + l + 3]
      ))
        return d;
    }
    const m = dt(v, i, n, s, r) ? Ye(v, t, e, n, s, r) : null;
    return d && m ? d.distance <= m.distance ? d : m : d || m || null;
  }
}
const se = /* @__PURE__ */ new et(), St = /* @__PURE__ */ new tt(), Rt = /* @__PURE__ */ new tt(), Ot = /* @__PURE__ */ new pt(), _n = /* @__PURE__ */ new q(), ie = /* @__PURE__ */ new q();
function mi(c, t, e, n) {
  F.setBuffer(c._roots[t]);
  const s = Ze(0, c, e, n);
  return F.clearBuffer(), s;
}
function Ze(c, t, e, n, s = null) {
  const { float32Array: r, uint16Array: i, uint32Array: a } = F;
  let o = c * 2;
  if (s === null && (e.boundingBox || e.computeBoundingBox(), _n.set(e.boundingBox.min, e.boundingBox.max, n), s = _n), U(o, i)) {
    const f = t.geometry, l = f.index, h = f.attributes.position, p = e.index, g = e.attributes.position, y = Z(c, a), v = X(o, i);
    if (Ot.copy(n).invert(), e.boundsTree)
      return L(c, r, ie), ie.matrix.copy(Ot), ie.needsUpdate = !0, e.boundsTree.shapecast({
        intersectsBounds: (d) => ie.intersectsBox(d),
        intersectsTriangle: (d) => {
          d.a.applyMatrix4(n), d.b.applyMatrix4(n), d.c.applyMatrix4(n), d.needsUpdate = !0;
          for (let w = y, m = v + y; w < m; w++)
            if (V(Rt, 3 * t.resolveTriangleIndex(w), l, h), Rt.needsUpdate = !0, d.intersectsTriangle(Rt))
              return !0;
          return !1;
        }
      });
    {
      const x = de(e);
      for (let d = y, w = v + y; d < w; d++) {
        const m = t.resolveTriangleIndex(d);
        V(St, 3 * m, l, h), St.a.applyMatrix4(Ot), St.b.applyMatrix4(Ot), St.c.applyMatrix4(Ot), St.needsUpdate = !0;
        for (let A = 0, b = x * 3; A < b; A += 3)
          if (V(Rt, A, p, g), Rt.needsUpdate = !0, St.intersectsTriangle(Rt))
            return !0;
      }
    }
  } else {
    const f = k(c), l = j(c, a);
    return L(f, r, se), !!(s.intersectsBox(se) && Ze(f, t, e, n, s) || (L(l, r, se), s.intersectsBox(se) && Ze(l, t, e, n, s)));
  }
}
const re = /* @__PURE__ */ new pt(), _e = /* @__PURE__ */ new q(), Ut = /* @__PURE__ */ new q(), gi = /* @__PURE__ */ new M(), vi = /* @__PURE__ */ new M(), xi = /* @__PURE__ */ new M(), wi = /* @__PURE__ */ new M();
function Ai(c, t, e, n = {}, s = {}, r = 0, i = 1 / 0) {
  t.boundingBox || t.computeBoundingBox(), _e.set(t.boundingBox.min, t.boundingBox.max, e), _e.needsUpdate = !0;
  const a = c.geometry, o = a.attributes.position, u = a.index, f = t.attributes.position, l = t.index, h = J.getPrimitive(), p = J.getPrimitive();
  let g = gi, y = vi, v = null, x = null;
  s && (v = xi, x = wi);
  let d = 1 / 0, w = null, m = null;
  return re.copy(e).invert(), Ut.matrix.copy(re), c.shapecast(
    {
      boundsTraverseOrder: (A) => _e.distanceToBox(A),
      intersectsBounds: (A, b, I) => I < d && I < i ? (b && (Ut.min.copy(A.min), Ut.max.copy(A.max), Ut.needsUpdate = !0), !0) : !1,
      intersectsRange: (A, b) => {
        if (t.boundsTree) {
          const I = t.boundsTree;
          return I.shapecast({
            boundsTraverseOrder: (P) => Ut.distanceToBox(P),
            intersectsBounds: (P, T, S) => S < d && S < i,
            intersectsRange: (P, T) => {
              for (let S = P, D = P + T; S < D; S++) {
                const R = I.resolveTriangleIndex(S);
                V(p, 3 * R, l, f), p.a.applyMatrix4(e), p.b.applyMatrix4(e), p.c.applyMatrix4(e), p.needsUpdate = !0;
                for (let B = A, _ = A + b; B < _; B++) {
                  const E = c.resolveTriangleIndex(B);
                  V(h, 3 * E, u, o), h.needsUpdate = !0;
                  const z = h.distanceToTriangle(p, g, v);
                  if (z < d && (y.copy(g), x && x.copy(v), d = z, w = B, m = S), z < r)
                    return !0;
                }
              }
            }
          });
        } else {
          const I = de(t);
          for (let P = 0, T = I; P < T; P++) {
            V(p, 3 * P, l, f), p.a.applyMatrix4(e), p.b.applyMatrix4(e), p.c.applyMatrix4(e), p.needsUpdate = !0;
            for (let S = A, D = A + b; S < D; S++) {
              const R = c.resolveTriangleIndex(S);
              V(h, 3 * R, u, o), h.needsUpdate = !0;
              const B = h.distanceToTriangle(p, g, v);
              if (B < d && (y.copy(g), x && x.copy(v), d = B, w = S, m = P), B < r)
                return !0;
            }
          }
        }
      }
    }
  ), J.releasePrimitive(h), J.releasePrimitive(p), d === 1 / 0 ? null : (n.point ? n.point.copy(y) : n.point = y.clone(), n.distance = d, n.faceIndex = w, s && (s.point ? s.point.copy(x) : s.point = x.clone(), s.point.applyMatrix4(re), y.applyMatrix4(re), s.distance = y.sub(s.point).length(), s.faceIndex = m), n);
}
const kt = /* @__PURE__ */ new F.constructor(), he = /* @__PURE__ */ new F.constructor(), ut = /* @__PURE__ */ new en(() => new et()), Pt = /* @__PURE__ */ new et(), Tt = /* @__PURE__ */ new et(), Me = /* @__PURE__ */ new et(), Ee = /* @__PURE__ */ new et();
let Ce = !1;
function bi(c, t, e, n) {
  if (Ce)
    throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");
  Ce = !0;
  const s = c._roots, r = t._roots;
  let i, a = 0, o = 0;
  const u = new pt().copy(e).invert();
  for (let f = 0, l = s.length; f < l; f++) {
    kt.setBuffer(s[f]), o = 0;
    const h = ut.getPrimitive();
    L(0, kt.float32Array, h), h.applyMatrix4(u);
    for (let p = 0, g = r.length; p < g && (he.setBuffer(r[p]), i = Q(
      0,
      0,
      e,
      u,
      n,
      a,
      o,
      0,
      0,
      h
    ), he.clearBuffer(), o += r[p].byteLength / Y, !i); p++)
      ;
    if (ut.releasePrimitive(h), kt.clearBuffer(), a += s[f].byteLength / Y, i)
      break;
  }
  return Ce = !1, i;
}
function Q(c, t, e, n, s, r = 0, i = 0, a = 0, o = 0, u = null, f = !1) {
  let l, h;
  f ? (l = he, h = kt) : (l = kt, h = he);
  const p = l.float32Array, g = l.uint32Array, y = l.uint16Array, v = h.float32Array, x = h.uint32Array, d = h.uint16Array, w = c * 2, m = t * 2, A = U(w, y), b = U(m, d);
  let I = !1;
  if (b && A)
    f ? I = s(
      Z(t, x),
      X(t * 2, d),
      Z(c, g),
      X(c * 2, y),
      o,
      i + t / O,
      a,
      r + c / O
    ) : I = s(
      Z(c, g),
      X(c * 2, y),
      Z(t, x),
      X(t * 2, d),
      a,
      r + c / O,
      o,
      i + t / O
    );
  else if (b) {
    const P = ut.getPrimitive();
    L(t, v, P), P.applyMatrix4(e);
    const T = k(c), S = j(c, g);
    L(T, p, Pt), L(S, p, Tt);
    const D = P.intersectsBox(Pt), R = P.intersectsBox(Tt);
    I = D && Q(
      t,
      T,
      n,
      e,
      s,
      i,
      r,
      o,
      a + 1,
      P,
      !f
    ) || R && Q(
      t,
      S,
      n,
      e,
      s,
      i,
      r,
      o,
      a + 1,
      P,
      !f
    ), ut.releasePrimitive(P);
  } else {
    const P = k(t), T = j(t, x);
    L(P, v, Me), L(T, v, Ee);
    const S = u.intersectsBox(Me), D = u.intersectsBox(Ee);
    if (S && D)
      I = Q(
        c,
        P,
        e,
        n,
        s,
        r,
        i,
        a,
        o + 1,
        u,
        f
      ) || Q(
        c,
        T,
        e,
        n,
        s,
        r,
        i,
        a,
        o + 1,
        u,
        f
      );
    else if (S)
      if (A)
        I = Q(
          c,
          P,
          e,
          n,
          s,
          r,
          i,
          a,
          o + 1,
          u,
          f
        );
      else {
        const R = ut.getPrimitive();
        R.copy(Me).applyMatrix4(e);
        const B = k(c), _ = j(c, g);
        L(B, p, Pt), L(_, p, Tt);
        const E = R.intersectsBox(Pt), z = R.intersectsBox(Tt);
        I = E && Q(
          P,
          B,
          n,
          e,
          s,
          i,
          r,
          o,
          a + 1,
          R,
          !f
        ) || z && Q(
          P,
          _,
          n,
          e,
          s,
          i,
          r,
          o,
          a + 1,
          R,
          !f
        ), ut.releasePrimitive(R);
      }
    else if (D)
      if (A)
        I = Q(
          c,
          T,
          e,
          n,
          s,
          r,
          i,
          a,
          o + 1,
          u,
          f
        );
      else {
        const R = ut.getPrimitive();
        R.copy(Ee).applyMatrix4(e);
        const B = k(c), _ = j(c, g);
        L(B, p, Pt), L(_, p, Tt);
        const E = R.intersectsBox(Pt), z = R.intersectsBox(Tt);
        I = E && Q(
          T,
          B,
          n,
          e,
          s,
          i,
          r,
          o,
          a + 1,
          R,
          !f
        ) || z && Q(
          T,
          _,
          n,
          e,
          s,
          i,
          r,
          o,
          a + 1,
          R,
          !f
        ), ut.releasePrimitive(R);
      }
  }
  return I;
}
function Mn(c, t, e) {
  return c === null ? null : (c.point.applyMatrix4(t.matrixWorld), c.distance = c.point.distanceTo(e.ray.origin), c.object = t, c);
}
const oe = /* @__PURE__ */ new q(), ae = /* @__PURE__ */ new os(), En = /* @__PURE__ */ new M(), Cn = /* @__PURE__ */ new pt(), Fn = /* @__PURE__ */ new M(), Fe = ["getX", "getY", "getZ"];
class rn extends js {
  static serialize(t, e = {}) {
    e = {
      cloneBuffers: !0,
      ...e
    };
    const n = t.geometry, s = t._roots, r = t._indirectBuffer, i = n.getIndex(), a = {
      version: 1,
      roots: null,
      index: null,
      indirectBuffer: null
    };
    return e.cloneBuffers ? (a.roots = s.map((o) => o.slice()), a.index = i ? i.array.slice() : null, a.indirectBuffer = r ? r.slice() : null) : (a.roots = s, a.index = i ? i.array : null, a.indirectBuffer = r), a;
  }
  static deserialize(t, e, n = {}) {
    n = {
      setIndex: !0,
      indirect: !!t.indirectBuffer,
      ...n
    };
    const { index: s, roots: r, indirectBuffer: i } = t;
    t.version || (console.warn(
      "MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."
    ), o(r));
    const a = new rn(e, { ...n, [Qe]: !0 });
    if (a._roots = r, a._indirectBuffer = i || null, n.setIndex) {
      const u = e.getIndex();
      if (u === null) {
        const f = new Vn(t.index, 1, !1);
        e.setIndex(f);
      } else u.array !== s && (u.array.set(s), u.needsUpdate = !0);
    }
    return a;
    function o(u) {
      for (let f = 0; f < u.length; f++) {
        const l = u[f], h = new Uint32Array(l), p = new Uint16Array(l);
        for (let g = 0, y = l.byteLength / Y; g < y; g++) {
          const v = O * g, x = 2 * v;
          U(x, p) || (h[v + 6] = h[v + 6] / O - g);
        }
      }
    }
  }
  get primitiveStride() {
    return 3;
  }
  get resolveTriangleIndex() {
    return this.resolvePrimitiveIndex;
  }
  constructor(t, e = {}) {
    e.maxLeafTris && (e = {
      ...e,
      maxLeafSize: e.maxLeafTris
    }), super(t, e);
  }
  // implement abstract methods from BVH base class
  shiftTriangleOffsets(t) {
    return super.shiftPrimitiveOffsets(t);
  }
  // write primitive bounds to the buffer - used only for validateBounds at the moment
  writePrimitiveBounds(t, e, n) {
    const s = this.geometry, r = this._indirectBuffer, i = s.attributes.position, a = s.index ? s.index.array : null, u = (r ? r[t] : t) * 3;
    let f = u + 0, l = u + 1, h = u + 2;
    a && (f = a[f], l = a[l], h = a[h]);
    for (let p = 0; p < 3; p++) {
      const g = i[Fe[p]](f), y = i[Fe[p]](l), v = i[Fe[p]](h);
      let x = g;
      y < x && (x = y), v < x && (x = v);
      let d = g;
      y > d && (d = y), v > d && (d = v), e[n + p] = x, e[n + p + 3] = d;
    }
    return e;
  }
  // precomputes the bounding box for each triangle; required for quickly calculating tree splits.
  // result is an array of size count * 6 where triangle i maps to a
  // [x_center, x_delta, y_center, y_delta, z_center, z_delta] tuple starting at index (i - offset) * 6,
  // representing the center and half-extent in each dimension of triangle i
  computePrimitiveBounds(t, e, n) {
    const s = this.geometry, r = this._indirectBuffer, i = s.attributes.position, a = s.index ? s.index.array : null, o = i.normalized;
    if (t < 0 || e + t - n.offset > n.length / 6)
      throw new Error("MeshBVH: compute triangle bounds range is invalid.");
    const u = i.array, f = i.offset || 0;
    let l = 3;
    i.isInterleavedBufferAttribute && (l = i.data.stride);
    const h = ["getX", "getY", "getZ"], p = n.offset;
    for (let g = t, y = t + e; g < y; g++) {
      const x = (r ? r[g] : g) * 3, d = (g - p) * 6;
      let w = x + 0, m = x + 1, A = x + 2;
      a && (w = a[w], m = a[m], A = a[A]), o || (w = w * l + f, m = m * l + f, A = A * l + f);
      for (let b = 0; b < 3; b++) {
        let I, P, T;
        o ? (I = i[h[b]](w), P = i[h[b]](m), T = i[h[b]](A)) : (I = u[w + b], P = u[m + b], T = u[A + b]);
        let S = I;
        P < S && (S = P), T < S && (S = T);
        let D = I;
        P > D && (D = P), T > D && (D = T);
        const R = (D - S) / 2, B = b * 2;
        n[d + B + 0] = S + R, n[d + B + 1] = R + (Math.abs(S) + R) * ue;
      }
    }
    return n;
  }
  raycastObject3D(t, e, n = []) {
    const { material: s } = t;
    if (s === void 0)
      return;
    Cn.copy(t.matrixWorld).invert(), ae.copy(e.ray).applyMatrix4(Cn), Fn.setFromMatrixScale(t.matrixWorld), En.copy(ae.direction).multiply(Fn);
    const r = En.length(), i = e.near / r, a = e.far / r;
    if (e.firstHitOnly === !0) {
      let o = this.raycastFirst(ae, s, i, a);
      o = Mn(o, t, e), o && n.push(o);
    } else {
      const o = this.raycast(ae, s, i, a);
      for (let u = 0, f = o.length; u < f; u++) {
        const l = Mn(o[u], t, e);
        l && n.push(l);
      }
    }
    return n;
  }
  refit(t = null) {
    return (this.indirect ? hi : Qs)(this, t);
  }
  /* Core Cast Functions */
  raycast(t, e = ln, n = 0, s = 1 / 0) {
    const r = this._roots, i = [], a = this.indirect ? pi : si;
    for (let o = 0, u = r.length; o < u; o++)
      a(this, o, e, t, i, n, s);
    return i;
  }
  raycastFirst(t, e = ln, n = 0, s = 1 / 0) {
    const r = this._roots;
    let i = null;
    const a = this.indirect ? yi : ri;
    for (let o = 0, u = r.length; o < u; o++) {
      const f = a(this, o, e, t, n, s);
      f != null && (i == null || f.distance < i.distance) && (i = f);
    }
    return i;
  }
  intersectsGeometry(t, e) {
    let n = !1;
    const s = this._roots, r = this.indirect ? mi : oi;
    for (let i = 0, a = s.length; i < a && (n = r(this, i, t, e), !n); i++)
      ;
    return n;
  }
  shapecast(t) {
    const e = J.getPrimitive(), n = super.shapecast(
      {
        ...t,
        intersectsPrimitive: t.intersectsTriangle,
        scratchPrimitive: e,
        // TODO: is the performance significant enough for the added complexity here?
        // can we just use one function?
        iterateDirect: Js,
        iterateIndirect: ni
      }
    );
    return J.releasePrimitive(e), n;
  }
  bvhcast(t, e, n) {
    let {
      intersectsRanges: s,
      intersectsTriangles: r
    } = n;
    const i = J.getPrimitive(), a = this.geometry.index, o = this.geometry.attributes.position, u = this.indirect ? (g) => {
      const y = this.resolveTriangleIndex(g);
      V(i, y * 3, a, o);
    } : (g) => {
      V(i, g * 3, a, o);
    }, f = J.getPrimitive(), l = t.geometry.index, h = t.geometry.attributes.position, p = t.indirect ? (g) => {
      const y = t.resolveTriangleIndex(g);
      V(f, y * 3, l, h);
    } : (g) => {
      V(f, g * 3, l, h);
    };
    if (r) {
      const g = (y, v, x, d, w, m, A, b) => {
        for (let I = x, P = x + d; I < P; I++) {
          p(I), f.a.applyMatrix4(e), f.b.applyMatrix4(e), f.c.applyMatrix4(e), f.needsUpdate = !0;
          for (let T = y, S = y + v; T < S; T++)
            if (u(T), i.needsUpdate = !0, r(i, f, T, I, w, m, A, b))
              return !0;
        }
        return !1;
      };
      if (s) {
        const y = s;
        s = function(v, x, d, w, m, A, b, I) {
          return y(v, x, d, w, m, A, b, I) ? !0 : g(v, x, d, w, m, A, b, I);
        };
      } else
        s = g;
    }
    return bi(this, t, e, s);
  }
  /* Derived Cast Functions */
  intersectsBox(t, e) {
    return oe.set(t.min, t.max, e), oe.needsUpdate = !0, this.shapecast(
      {
        intersectsBounds: (n) => oe.intersectsBox(n),
        intersectsTriangle: (n) => oe.intersectsTriangle(n)
      }
    );
  }
  intersectsSphere(t) {
    return this.shapecast(
      {
        intersectsBounds: (e) => t.intersectsBox(e),
        intersectsTriangle: (e) => e.intersectsSphere(t)
      }
    );
  }
  closestPointToGeometry(t, e, n = {}, s = {}, r = 0, i = 1 / 0) {
    return (this.indirect ? Ai : fi)(
      this,
      t,
      e,
      n,
      s,
      r,
      i
    );
  }
  closestPointToPoint(t, e = {}, n = 0, s = 1 / 0) {
    return Zs(
      this,
      t,
      e,
      n,
      s
    );
  }
}
const _t = {
  Mesh: pe.prototype.raycast,
  Line: Nn.prototype.raycast,
  LineSegments: Ke.prototype.raycast,
  LineLoop: Un.prototype.raycast,
  Points: Ge.prototype.raycast,
  BatchedMesh: cs.prototype.raycast
}, H = /* @__PURE__ */ new pe(), ce = [];
function Ii(c, t) {
  if (this.isBatchedMesh)
    Si.call(this, c, t);
  else {
    const { geometry: e } = this;
    if (e.boundsTree)
      e.boundsTree.raycastObject3D(this, c, t);
    else {
      let n;
      if (this instanceof pe)
        n = _t.Mesh;
      else if (this instanceof Ke)
        n = _t.LineSegments;
      else if (this instanceof Un)
        n = _t.LineLoop;
      else if (this instanceof Nn)
        n = _t.Line;
      else if (this instanceof Ge)
        n = _t.Points;
      else
        throw new Error("BVH: Fallback raycast function not found.");
      n.call(this, c, t);
    }
  }
}
function Si(c, t) {
  if (this.boundsTrees) {
    const e = this.boundsTrees, n = this._drawInfo || this._instanceInfo, s = this._drawRanges || this._geometryInfo, r = this.matrixWorld;
    H.material = this.material, H.geometry = this.geometry;
    const i = H.geometry.boundsTree, a = H.geometry.drawRange;
    H.geometry.boundingSphere === null && (H.geometry.boundingSphere = new as());
    for (let o = 0, u = n.length; o < u; o++) {
      if (!this.getVisibleAt(o))
        continue;
      const f = n[o].geometryIndex;
      if (H.geometry.boundsTree = e[f], this.getMatrixAt(o, H.matrixWorld).premultiply(r), !H.geometry.boundsTree) {
        this.getBoundingBoxAt(f, H.geometry.boundingBox), this.getBoundingSphereAt(f, H.geometry.boundingSphere);
        const l = s[f];
        H.geometry.setDrawRange(l.start, l.count);
      }
      H.raycast(c, ce);
      for (let l = 0, h = ce.length; l < h; l++) {
        const p = ce[l];
        p.object = this, p.batchId = o, t.push(p);
      }
      ce.length = 0;
    }
    H.geometry.boundsTree = i, H.geometry.drawRange = a, H.material = null, H.geometry = null;
  } else
    _t.BatchedMesh.call(this, c, t);
}
function Ri(c = {}) {
  const { type: t = rn } = c;
  return this.boundsTree = new t(this, c), this.boundsTree;
}
function Pi() {
  this.boundsTree = null;
}
var Yn = function(c) {
  return function(t, e, n) {
    return c(t, e, n) * n;
  };
}, Xe = function(c, t) {
  if (c)
    throw Error("Invalid sort config: " + t);
}, Zn = function(c) {
  var t = c || {}, e = t.asc, n = t.desc, s = e ? 1 : -1, r = e || n;
  Xe(!r, "Expected `asc` or `desc` property"), Xe(e && n, "Ambiguous object with `asc` and `desc` config properties");
  var i = c.comparer && Yn(c.comparer);
  return { order: s, sortBy: r, comparer: i };
}, Ti = function(c) {
  return function t(e, n, s, r, i, a, o) {
    var u, f;
    if (typeof e == "string")
      u = a[e], f = o[e];
    else if (typeof e == "function")
      u = e(a), f = e(o);
    else {
      var l = Zn(e);
      return t(l.sortBy, n, s, l.order, l.comparer || c, a, o);
    }
    var h = i(u, f, r);
    return (h === 0 || u == null && f == null) && n.length > s ? t(n[s], n, s + 1, r, i, a, o) : h;
  };
};
function Xn(c, t, e) {
  if (c === void 0 || c === !0)
    return function(r, i) {
      return t(r, i, e);
    };
  if (typeof c == "string")
    return Xe(c.includes("."), "String syntax not allowed for nested properties."), function(r, i) {
      return t(r[c], i[c], e);
    };
  if (typeof c == "function")
    return function(r, i) {
      return t(c(r), c(i), e);
    };
  if (Array.isArray(c)) {
    var n = Ti(t);
    return function(r, i) {
      return n(c[0], c, 1, e, t, r, i);
    };
  }
  var s = Zn(c);
  return Xn(s.sortBy, s.comparer || t, s.order);
}
var Le = function(c, t, e, n) {
  var s;
  return Array.isArray(t) ? (Array.isArray(e) && e.length < 2 && (s = e, e = s[0]), t.sort(Xn(e, n, c))) : t;
};
function qn(c) {
  var t = Yn(c.comparer);
  return function(e) {
    var n = Array.isArray(e) && !c.inPlaceSorting ? e.slice() : e;
    return {
      asc: function(s) {
        return Le(1, n, s, t);
      },
      desc: function(s) {
        return Le(-1, n, s, t);
      },
      by: function(s) {
        return Le(1, n, s, t);
      }
    };
  };
}
var Kn = function(c, t, e) {
  return c == null ? e : t == null ? -e : typeof c != typeof t ? typeof c < typeof t ? -1 : 1 : c < t ? -1 : c > t ? 1 : 0;
}, Di = qn({
  comparer: Kn
});
qn({
  comparer: Kn,
  inPlaceSorting: !0
});
const { cos: Ln } = Math;
function Bi(c, t, e, n, s) {
  return c * (1 - t) * e * (1 - Ln(n / 2)) * 2 * Ln(s);
}
const _i = `attribute vec2 color;\r
varying vec2 vColor;\r
uniform float pointScale;\r
void main() {\r
  vColor = color;\r
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\r
  gl_PointSize = pointScale*(color.x/4.0+0.5);\r
  gl_Position = projectionMatrix * mvPosition;\r
  \r
}`, Mi = `varying vec2 vColor;\r
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
}`, zn = {
  vs: _i,
  fs: Mi
};
function ze(c, t = 1) {
  let e = c.slice();
  for (let n = 0; n < c.length; n++)
    if (n >= t && n < c.length - t) {
      const s = n - t, r = n + t;
      let i = 0;
      for (let a = s; a < r; a++)
        i += c[a];
      e[n] = i / (2 * t);
    }
  return e;
}
function Ei(c) {
  var t, e, n = c.length;
  if (n === 1)
    t = 0, e = c[0][1];
  else {
    for (var s = 0, r = 0, i = 0, a = 0, o, u, f, l = 0; l < n; l++)
      o = c[l], u = o[0], f = o[1], s += u, r += f, i += u * u, a += u * f;
    t = (n * a - s * r) / (n * i - s * s), e = r / n - t * s / n;
  }
  return {
    m: t,
    b: e
  };
}
function Ve(c, t) {
  const e = c.length, n = [];
  for (let o = 0; o < e; o++)
    n.push([c[o], t[o]]);
  const { m: s, b: r } = Ei(n);
  return { m: s, b: r, fx: (o) => s * o + r, fy: (o) => (o - r) / s };
}
function Ci(c, t) {
  let e = (360 - c) * (Math.PI / 180);
  return [t * (Math.PI / 180), e];
}
class Fi {
  constructor(t) {
    this.v = t, this.watchers = /* @__PURE__ */ new Set();
  }
  get value() {
    return this.v;
  }
  set value(t) {
    const e = this.v;
    this.v = t, this.watchers.forEach((n) => n(this.v, e));
  }
  watch(t) {
    return this.watchers.add(t), () => this.watchers.delete(t);
  }
  toJSON() {
    return JSON.stringify(this.v);
  }
  toString() {
    return String(this.v);
  }
}
function Li(c, t) {
  return new Fi(c);
}
function zi(c) {
  return Math.random() < c;
}
const Nt = () => new Worker(new URL(
  /* @vite-ignore */
  "/assets/filter.worker-CKhUfGRZ.js",
  import.meta.url
)), { floor: K, random: Vi, abs: nt, asin: Oi } = Math, Dt = () => Vi() > 0.5;
function le(c) {
  let t = Math.abs(c[0]);
  for (let e = 1; e < c.length; e++)
    Math.abs(c[e]) > t && (t = Math.abs(c[e]));
  if (t !== 0)
    for (let e = 0; e < c.length; e++)
      c[e] /= t;
  return c;
}
Je.prototype.computeBoundsTree = Ri;
Je.prototype.disposeBoundsTree = Pi;
pe.prototype.raycast = Ii;
class Ui {
  constructor(t) {
    this.id = t, this.data = [];
  }
}
const $ = {
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
class Ni extends ss {
  constructor(t) {
    super(t), this.update = () => {
    }, this.rayPositionIndexDidOverflow = !1, this.ambisonicOrder = 1, this.impulseResponsePlaying = !1, this.kind = "ray-tracer", t = { ...$, ...t }, this.uuid = t.uuid || this.uuid, this.name = t.name || $.name, this.observed_name = Li(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = t.sourceIDs || $.sourceIDs, this.surfaceIDs = t.surfaceIDs || $.surfaceIDs, this.roomID = t.roomID || $.roomID, this.receiverIDs = t.receiverIDs || $.receiverIDs, this.updateInterval = t.updateInterval || $.updateInterval, this.reflectionOrder = t.reflectionOrder || $.reflectionOrder, this._isRunning = t.isRunning || $.isRunning, this._runningWithoutReceivers = t.runningWithoutReceivers || $.runningWithoutReceivers, this.reflectionLossFrequencies = [4e3], this.intervals = [], this.plotData = [], this.plotStyle = t.plotStyle || $.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = t.pointSize || $.pointSize, this.validRayCount = 0, this.defaultFrequencies = [1e3], this.intensitySampleRate = 256, this.quickEstimateResults = {};
    const e = typeof t.raysVisible == "boolean";
    this._raysVisible = e ? t.raysVisible : $.raysVisible;
    const n = typeof t.pointsVisible == "boolean";
    this._pointsVisible = n ? t.pointsVisible : $.pointsVisible;
    const s = typeof t.invertedDrawStyle == "boolean";
    this._invertedDrawStyle = s ? t.invertedDrawStyle : $.invertedDrawStyle, this.passes = t.passes || $.passes, this.raycaster = new ls(), this.rayBufferGeometry = new Je(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 999999, this.rayBufferAttribute = new un(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(fn), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new un(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(fn), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.rays = new Ke(
      this.rayBufferGeometry,
      new us({
        fog: !1,
        color: 2631977,
        transparent: !0,
        opacity: 0.2,
        premultipliedAlpha: !0,
        blending: hn,
        depthFunc: fs,
        name: "raytracer-rays-material"
        // depthTest: false
      })
    ), this.rays.renderOrder = -0.5, this.rays.frustumCulled = !1, N.scene.add(this.rays);
    var r = new hs({
      fog: !1,
      vertexShader: zn.vs,
      fragmentShader: zn.fs,
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
      blending: hn,
      name: "raytracer-points-material"
    });
    this.hits = new Ge(this.rayBufferGeometry, r), this.hits.frustumCulled = !1, N.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
      value: !0,
      writable: !0
    }), this.intersections = [], this.findIDs(), this.intersectableObjects = [], this.paths = t.paths || $.paths, this.stats = {
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
    }), this.messageHandlerIDs = [], yt.postMessage("STATS_SETUP", this.stats), this.messageHandlerIDs.push(
      yt.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (i, ...a) => {
        console.log(a && a[0] && a[0] instanceof Array && a[1] && a[1] === this.uuid), a && a[0] && a[0] instanceof Array && a[1] && a[1] === this.uuid && (this.sourceIDs = a[0].map((o) => o.id));
      })
    ), this.messageHandlerIDs.push(
      yt.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (i, ...a) => {
        a && a[0] && a[0] instanceof Array && a[1] && a[1] === this.uuid && (this.receiverIDs = a[0].map((o) => o.id));
      })
    ), this.messageHandlerIDs.push(
      yt.addMessageHandler("SHOULD_REMOVE_CONTAINER", (i, ...a) => {
        const o = a[0];
        o && (console.log(o), this.sourceIDs.includes(o) ? this.sourceIDs = this.sourceIDs.filter((u) => u != o) : this.receiverIDs.includes(o) && (this.receiverIDs = this.receiverIDs.filter((u) => u != o)));
      })
    ), this.step = this.step.bind(this), this.calculateImpulseResponse = this.calculateImpulseResponse.bind(this);
  }
  save() {
    const {
      name: t,
      kind: e,
      uuid: n,
      autoCalculate: s,
      roomID: r,
      sourceIDs: i,
      surfaceIDs: a,
      receiverIDs: o,
      updateInterval: u,
      passes: f,
      pointSize: l,
      reflectionOrder: h,
      runningWithoutReceivers: p,
      raysVisible: g,
      pointsVisible: y,
      invertedDrawStyle: v,
      plotStyle: x,
      paths: d
    } = this;
    return {
      name: t,
      kind: e,
      uuid: n,
      autoCalculate: s,
      roomID: r,
      sourceIDs: i,
      surfaceIDs: a,
      receiverIDs: o,
      updateInterval: u,
      passes: f,
      pointSize: l,
      reflectionOrder: h,
      runningWithoutReceivers: p,
      raysVisible: g,
      pointsVisible: y,
      invertedDrawStyle: v,
      plotStyle: x,
      paths: d
    };
  }
  removeMessageHandlers() {
    this.messageHandlerIDs.forEach((t) => {
      yt.removeMessageHandler(t[0], t[1]);
    });
  }
  dispose() {
    this.removeMessageHandlers(), Object.keys(window.vars).forEach((t) => {
      window.vars[t].uuid === this.uuid && delete window.vars[t];
    }), N.scene.remove(this.rays), N.scene.remove(this.hits);
  }
  addSource(t) {
    C.getState().containers[t.uuid] = t, this.findIDs(), this.mapIntersectableObjects();
  }
  addReceiver(t) {
    C.getState().containers[t.uuid] = t, this.findIDs(), this.mapIntersectableObjects();
  }
  mapIntersectableObjects() {
    const t = [];
    this.room.surfaces.traverse((e) => {
      e.kind && e.kind === "surface" && t.push(e.mesh);
    }), this.runningWithoutReceivers ? this.intersectableObjects = t : this.intersectableObjects = t.concat(this.receivers);
  }
  findIDs() {
    this.sourceIDs = [], this.receiverIDs = [], this.surfaceIDs = [];
    for (const t in C.getState().containers)
      C.getState().containers[t].kind === "room" ? this.roomID = t : C.getState().containers[t].kind === "source" ? this.sourceIDs.push(t) : C.getState().containers[t].kind === "receiver" ? this.receiverIDs.push(t) : C.getState().containers[t].kind === "surface" && this.surfaceIDs.push(t);
    this.mapIntersectableObjects();
  }
  setDrawStyle(t) {
    this.hits.material.uniforms.drawStyle.value = t, this.hits.material.needsUpdate = !0, N.needsToRender = !0;
  }
  setPointScale(t) {
    this._pointSize = t, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0, N.needsToRender = !0;
  }
  incrementRayPositionIndex() {
    return this.rayPositionIndex < this.maxrays ? this.rayPositionIndex++ : (this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !0, this.rayPositionIndex);
  }
  appendRay(t, e, n = 1, s = 1) {
    this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, n, s), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, n, s), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex), this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
  }
  inFrontOf(t, e) {
    const n = t.getPlane(new qe()), s = new $t(n.normal.x, n.normal.y, n.normal.z, n.constant), r = new $t(e.a.x, e.a.y, e.a.z, 1), i = new $t(e.b.x, e.b.y, e.b.z, 1), a = new $t(e.c.x, e.c.y, e.c.z, 1);
    return s.dot(r) > 0 || s.dot(i) > 0 || s.dot(a) > 0;
  }
  traceRay(t, e, n, s, r, i, a, o = 1, u = [], f = 4e3) {
    var h;
    e = e.normalize(), this.raycaster.ray.origin = t, this.raycaster.ray.direction = e;
    const l = this.raycaster.intersectObjects(this.intersectableObjects, !0);
    if (l.length > 0) {
      if (((h = l[0].object.userData) == null ? void 0 : h.kind) === "receiver") {
        const p = l[0].face && e.clone().multiplyScalar(-1).angleTo(l[0].face.normal);
        u.push({
          object: l[0].object.parent.uuid,
          angle: p,
          distance: l[0].distance,
          faceNormal: [
            l[0].face.normal.x,
            l[0].face.normal.y,
            l[0].face.normal.z
          ],
          faceMaterialIndex: l[0].face.materialIndex,
          faceIndex: l[0].faceIndex,
          point: [l[0].point.x, l[0].point.y, l[0].point.z],
          energy: s
        });
        const g = e.clone().normalize().negate(), y = [g.x, g.y, g.z];
        return {
          chain: u,
          chainLength: u.length,
          intersectedReceiver: !0,
          energy: s,
          source: r,
          initialPhi: i,
          initialTheta: a,
          arrivalDirection: y
        };
      } else {
        const p = l[0].face && e.clone().multiplyScalar(-1).angleTo(l[0].face.normal);
        u.push({
          object: l[0].object.parent.uuid,
          angle: p,
          distance: l[0].distance,
          faceNormal: [
            l[0].face.normal.x,
            l[0].face.normal.y,
            l[0].face.normal.z
          ],
          faceMaterialIndex: l[0].face.materialIndex,
          faceIndex: l[0].faceIndex,
          point: [l[0].point.x, l[0].point.y, l[0].point.z],
          energy: s
        }), l[0].object.parent instanceof pn && (l[0].object.parent.numHits += 1);
        const g = l[0].face && l[0].face.normal.normalize();
        let y = g && l[0].face && e.clone().sub(g.clone().multiplyScalar(e.dot(g.clone())).multiplyScalar(2));
        const v = l[0].object.parent._scatteringCoefficient;
        zi(v) && (y = new M(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), g.dot(y) < 0 && y.multiplyScalar(-1));
        const x = s * nt(l[0].object.parent.reflectionFunction(f, p));
        if (y && g && x > 1 / 2 ** 16 && o < n + 1)
          return this.traceRay(
            l[0].point.clone().addScaledVector(g.clone(), 0.01),
            y,
            n,
            x,
            r,
            i,
            a,
            o + 1,
            u,
            4e3
          );
      }
      return { chain: u, chainLength: u.length, source: r, intersectedReceiver: !1 };
    }
  }
  startQuickEstimate(t = this.defaultFrequencies, e = 1e3) {
    const n = this.runningWithoutReceivers;
    this.runningWithoutReceivers = !0;
    let s = 0;
    this.quickEstimateResults = {}, this.sourceIDs.forEach((r) => {
      this.quickEstimateResults[r] = [];
    }), this.intervals.push(
      //@ts-ignore
      setInterval(() => {
        for (let r = 0; r < this.passes; r++, s++)
          for (let i = 0; i < this.sourceIDs.length; i++) {
            const a = this.sourceIDs[i], o = C.getState().containers[a];
            this.quickEstimateResults[a].push(this.quickEstimateStep(o, t, e));
          }
        s >= e ? (this.intervals.forEach((r) => window.clearInterval(r)), this.runningWithoutReceivers = n, console.log(this.quickEstimateResults)) : console.log((s / e * 100).toFixed(1) + "%");
      }, this.updateInterval)
    );
  }
  quickEstimateStep(t, e, n) {
    const s = yn(20), r = Array(e.length).fill(0);
    let i = t.position.clone(), a = new M(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), o = 0;
    const u = Array(e.length).fill(t.initialIntensity);
    let f = 0;
    const l = 1e3;
    let h = !1, p = 0;
    we(e);
    let g = {};
    for (; !h && f < l; ) {
      this.raycaster.ray.set(i, a);
      const y = this.raycaster.intersectObjects(this.intersectableObjects, !0);
      if (y.length > 0) {
        o = a.clone().multiplyScalar(-1).angleTo(y[0].face.normal), p += y[0].distance;
        const v = y[0].object.parent;
        for (let d = 0; d < e.length; d++) {
          const w = e[d];
          let m = 1;
          v.kind === "surface" && (m = v.reflectionFunction(w, o)), u[d] *= m;
          const A = t.initialIntensity / u[d] > 1e6;
          A && (r[d] = p / s), h = h || A;
        }
        y[0].object.parent instanceof pn && (y[0].object.parent.numHits += 1);
        const x = y[0].face.normal.normalize();
        a.sub(x.clone().multiplyScalar(a.dot(x)).multiplyScalar(2)).normalize(), i.copy(y[0].point), g = y[0];
      }
      f += 1;
    }
    return this.stats.numRaysShot.value++, {
      distance: p,
      rt60s: r,
      angle: o,
      direction: a,
      lastIntersection: g
    };
  }
  startAllMonteCarlo() {
    this.intervals.push(
      setInterval(() => {
        for (let t = 0; t < this.passes; t++)
          this.step();
        N.needsToRender = !0;
      }, this.updateInterval)
    );
  }
  step() {
    for (let t = 0; t < this.sourceIDs.length; t++) {
      this.__num_checked_paths += 1;
      const e = Math.random() * C.getState().containers[this.sourceIDs[t]].theta, n = Math.random() * C.getState().containers[this.sourceIDs[t]].phi, s = C.getState().containers[this.sourceIDs[t]].position, r = C.getState().containers[this.sourceIDs[t]].rotation;
      let i = Ci(n, e);
      const a = new M().setFromSphericalCoords(1, i[0], i[1]);
      a.applyEuler(r), C.getState().containers[this.sourceIDs[t]].directivityHandler;
      const u = this.traceRay(s, a, this.reflectionOrder, 1, this.sourceIDs[t], n, e);
      if (u) {
        if (this._runningWithoutReceivers) {
          this.appendRay(
            [s.x, s.y, s.z],
            u.chain[0].point,
            u.chain[0].energy || 1,
            u.chain[0].angle
          );
          for (let l = 1; l < u.chain.length; l++)
            this.appendRay(
              // the previous point
              u.chain[l - 1].point,
              // the current point
              u.chain[l].point,
              // the energy content displayed as a color + alpha
              u.chain[l].energy || 1,
              u.chain[l].angle
            );
          const f = u.chain[u.chain.length - 1].object;
          this.paths[f] ? this.paths[f].push(u) : this.paths[f] = [u], C.getState().containers[this.sourceIDs[t]].numRays += 1;
        } else if (u.intersectedReceiver) {
          this.appendRay(
            [s.x, s.y, s.z],
            u.chain[0].point,
            u.chain[0].energy || 1,
            u.chain[0].angle
          );
          for (let l = 1; l < u.chain.length; l++)
            this.appendRay(
              // the previous point
              u.chain[l - 1].point,
              // the current point
              u.chain[l].point,
              // the energy content displayed as a color + alpha
              u.chain[l].energy || 1,
              u.chain[l].angle
            );
          this.stats.numValidRayPaths.value++, this.validRayCount += 1, N.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
          const f = u.chain[u.chain.length - 1].object;
          this.paths[f] ? this.paths[f].push(u) : this.paths[f] = [u], C.getState().containers[this.sourceIDs[t]].numRays += 1;
        }
      }
      this.stats.numRaysShot.value++;
    }
  }
  start() {
    this.mapIntersectableObjects(), this.__start_time = Date.now(), this.__num_checked_paths = 0, this.startAllMonteCarlo();
  }
  stop() {
    this.__calc_time = Date.now() - this.__start_time, this.intervals.forEach((t) => {
      window.clearInterval(t);
    }), this.intervals = [], Object.keys(this.paths).forEach((t) => {
      const e = this.__calc_time / 1e3, n = this.paths[t].length, s = n / e, r = this.__num_checked_paths, i = r / e;
      console.log({
        calc_time: e,
        num_valid_rays: n,
        valid_ray_rate: s,
        num_checks: r,
        check_rate: i
      }), this.paths[t].forEach((a) => {
        a.time = 0, a.totalLength = 0;
        for (let o = 0; o < a.chain.length; o++)
          a.totalLength += a.chain[o].distance, a.time += a.chain[o].distance / 343.2;
      });
    }), this.mapIntersectableObjects(), this.reportImpulseResponse();
  }
  async reportImpulseResponse() {
    var r, i;
    if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const t = C.getState().containers, e = W.sampleRate, { useResult: n } = require("../../store/result-store"), s = [];
    for (const a of this.sourceIDs)
      for (const o of this.receiverIDs) {
        if (!this.paths[o] || this.paths[o].length === 0) continue;
        const u = this.paths[o].filter((f) => f.source === a);
        u.length > 0 && s.push({ sourceId: a, receiverId: o, paths: u });
      }
    if (s.length !== 0) {
      ct("SHOW_PROGRESS", {
        message: "Calculating impulse response...",
        progress: 0,
        solverUuid: this.uuid
      });
      for (let a = 0; a < s.length; a++) {
        const { sourceId: o, receiverId: u, paths: f } = s[a], l = ((r = t[o]) == null ? void 0 : r.name) || "Source", h = ((i = t[u]) == null ? void 0 : i.name) || "Receiver", p = Math.round(a / s.length * 100);
        ct("UPDATE_PROGRESS", {
          progress: p,
          message: `Calculating IR: ${l} → ${h}`
        });
        try {
          const { normalizedSignal: g } = await this.calculateImpulseResponseForPair(o, u, f);
          o === this.sourceIDs[0] && u === this.receiverIDs[0] && this.calculateImpulseResponse().then((A) => {
            this.impulseResponse = A;
          }).catch(console.error);
          const v = Math.max(1, Math.floor(g.length / 2e3)), x = [];
          for (let A = 0; A < g.length; A += v)
            x.push({
              time: A / e,
              amplitude: g[A]
            });
          const d = `${this.uuid}-ir-${o}-${u}`, w = n.getState().results[d], m = {
            kind: dn.ImpulseResponse,
            name: `IR: ${l} → ${h}`,
            uuid: d,
            from: this.uuid,
            info: {
              sampleRate: e,
              sourceName: l,
              receiverName: h,
              sourceId: o,
              receiverId: u
            },
            data: x
          };
          w ? ct("UPDATE_RESULT", { uuid: d, result: m }) : ct("ADD_RESULT", m);
        } catch (g) {
          console.error(`Failed to calculate impulse response for ${o} -> ${u}:`, g);
        }
      }
      ct("HIDE_PROGRESS", void 0);
    }
  }
  async calculateImpulseResponseForPair(t, e, n, s = 100, r = Et(63, 16e3), i = W.sampleRate) {
    if (n.length === 0) throw Error("No rays have been traced for this pair");
    let a = n.sort((p, g) => p.time - g.time);
    const o = a[a.length - 1].time + 0.05, u = Array(r.length).fill(s), f = K(i * o) * 2;
    let l = [];
    for (let p = 0; p < r.length; p++)
      l.push(new Float32Array(f));
    for (let p = 0; p < a.length; p++) {
      const g = Dt() ? 1 : -1, y = a[p].time, v = this.arrivalPressure(u, r, a[p]).map((d) => d * g), x = K(y * i);
      for (let d = 0; d < r.length; d++)
        l[d][x] += v[d];
    }
    const h = Nt();
    return new Promise((p, g) => {
      h.postMessage({ samples: l }), h.onmessage = (y) => {
        const v = y.data.samples, x = new Float32Array(v[0].length >> 1);
        for (let w = 0; w < v.length; w++)
          for (let m = 0; m < x.length; m++)
            x[m] += v[w][m];
        const d = le(x.slice());
        h.terminate(), p({ signal: x, normalizedSignal: d });
      }, h.onerror = (y) => {
        h.terminate(), g(y);
      };
    });
  }
  async calculateImpulseResponseForDisplay(t = 100, e = Et(63, 16e3), n = W.sampleRate) {
    if (this.receiverIDs.length == 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length == 0) throw Error("No sources have been assigned to the raytracer");
    if (this.paths[this.receiverIDs[0]].length == 0) throw Error("No rays have been traced yet");
    let s = this.paths[this.receiverIDs[0]].sort((f, l) => f.time - l.time);
    const r = s[s.length - 1].time + 0.05, i = Array(e.length).fill(t), a = K(n * r) * 2;
    let o = [];
    for (let f = 0; f < e.length; f++)
      o.push(new Float32Array(a));
    for (let f = 0; f < s.length; f++) {
      const l = Dt() ? 1 : -1, h = s[f].time, p = this.arrivalPressure(i, e, s[f]).map((y) => y * l), g = K(h * n);
      for (let y = 0; y < e.length; y++)
        o[y][g] += p[y];
    }
    const u = Nt();
    return new Promise((f, l) => {
      u.postMessage({ samples: o }), u.onmessage = (h) => {
        const p = h.data.samples, g = new Float32Array(p[0].length >> 1);
        for (let v = 0; v < p.length; v++)
          for (let x = 0; x < g.length; x++)
            g[x] += p[v][x];
        const y = le(g.slice());
        u.terminate(), f({ signal: g, normalizedSignal: y });
      }, u.onerror = (h) => {
        u.terminate(), l(h);
      };
    });
  }
  clearRays() {
    if (this.room)
      for (let t = 0; t < this.room.allSurfaces.length; t++)
        this.room.allSurfaces[t].resetHits();
    this.validRayCount = 0, N.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount), this.rayBufferGeometry.setDrawRange(0, 1), this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !1, this.stats.numRaysShot.value = 0, this.stats.numValidRayPaths.value = 0, yt.postMessage("STATS_UPDATE", this.stats), this.sourceIDs.forEach((t) => {
      C.getState().containers[t].numRays = 0;
    }), this.paths = {}, this.mapIntersectableObjects(), N.needsToRender = !0, this.impulseResponse = void 0, this.clearImpulseResponseResults();
  }
  clearImpulseResponseResults() {
    const { useResult: t } = require("../../store/result-store"), e = t.getState().results;
    Object.keys(e).forEach((n) => {
      const s = e[n];
      s.from === this.uuid && s.kind === dn.ImpulseResponse && ct("REMOVE_RESULT", n);
    });
  }
  calculateWithDiffuse(t = this.reflectionLossFrequencies) {
    this.allReceiverData = [];
    const e = Object.keys(this.paths), n = C.getState().containers[this.receiverIDs[0]].scale.x, s = C.getState().containers[this.receiverIDs[0]].position;
    e.forEach((i) => {
      const a = new Ui(i);
      this.paths[i].forEach((o) => {
        const u = {
          time: 0,
          energy: []
        };
        let f = !1;
        o.chain.forEach((l) => {
          const h = this.receiverIDs.includes(l.object) ? C.getState().containers[l.object] : this.room.surfaceMap[l.object];
          if (h && h.kind) {
            if (h.kind === "receiver")
              f = !0;
            else if (h.kind === "surface") {
              const p = h, g = {
                time: l.time_rec,
                energy: []
              };
              t.forEach((y, v) => {
                const x = nt(p.reflectionFunction(y, l.angle_in));
                if (!u.energy[v])
                  u.energy[v] = {
                    frequency: y,
                    value: x
                  };
                else {
                  u.energy[v].value *= x, u.time = l.total_time;
                  const d = new M(
                    s.x - l.point[0],
                    s.y - l.point[1],
                    s.z - l.point[2]
                  ), w = new M().fromArray(l.faceNormal).angleTo(d);
                  g.energy[v] = {
                    frequency: y,
                    value: Bi(
                      u.energy[v].value,
                      p.absorptionFunction(y),
                      0.1,
                      Oi(n / d.length()),
                      w
                    )
                  };
                }
              }), g.energy.length > 0 && a.data.push(g);
            }
          }
        }), f && a.data.push(u);
      }), a.data = Di(a.data).asc((o) => o.time), this.allReceiverData.push(a);
    });
    const r = this.allReceiverData.map((i) => t.map((a) => ({
      label: a.toString(),
      x: i.data.map((o) => o.time),
      y: i.data.map((o) => o.energy.filter((u) => u.frequency == a)[0].value)
    })));
    return yt.postMessage("UPDATE_CHART_DATA", r && r[0]), this.allReceiverData;
  }
  reflectionLossFunction(t, e, n) {
    const s = e.chain.slice(0, -1);
    if (s && s.length > 0) {
      let r = 1;
      for (let i = 0; i < s.length; i++) {
        const a = s[i], o = t.surfaceMap[a.object], u = a.angle || 0;
        r = r * nt(o.reflectionFunction(n, u));
      }
      return r;
    }
    return 1;
  }
  //TODO change this name to something more appropriate
  calculateReflectionLoss(t = this.reflectionLossFrequencies) {
    this.allReceiverData = [];
    const e = (r, i) => ({ label: r, data: i }), n = [];
    if (t)
      for (let r = 0; r < t.length; r++)
        n.push(e(t[r].toString(), []));
    const s = Object.keys(this.paths);
    for (let r = 0; r < s.length; r++) {
      this.allReceiverData.push({
        id: s[r],
        data: []
      });
      for (let i = 0; i < this.paths[s[r]].length; i++) {
        const a = this.paths[s[r]][i];
        let o;
        t ? (o = t.map((u) => ({
          frequency: u,
          value: this.reflectionLossFunction(this.room, a, u)
        })), t.forEach((u, f) => {
          n[f].data.push([a.time, this.reflectionLossFunction(this.room, a, u)]);
        })) : o = (u) => this.reflectionLossFunction(this.room, a, u), this.allReceiverData[this.allReceiverData.length - 1].data.push({
          time: a.time,
          energy: o
        });
      }
      this.allReceiverData[this.allReceiverData.length - 1].data = this.allReceiverData[this.allReceiverData.length - 1].data.sort((i, a) => i.time - a.time);
    }
    for (let r = 0; r < n.length; r++)
      n[r].data = n[r].data.sort((i, a) => i[0] - a[0]), n[r].x = n[r].data.map((i) => i[0]), n[r].y = n[r].data.map((i) => i[1]);
    return this.chartdata = n, [this.allReceiverData, n];
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
  resampleResponse(t = 0, e = W.sampleRate) {
    if (this.allReceiverData && this.allReceiverData[t]) {
      const n = this.allReceiverData[t].data, s = n[n.length - 1].time, r = K(e * s), i = [];
      for (let a = 0, o = 0; a < r; a++) {
        let u = a / r * s;
        if (n[o] && n[o].time) {
          let f = n[o].time;
          if (f > u) {
            i.push([u].concat(Array(n[o].energy.length).fill(0)));
            continue;
          }
          if (f <= u) {
            let l = n[o].energy.map((p) => 0), h = 0;
            for (; f <= u; )
              f = n[o].time, l.forEach((p, g, y) => y[g] += n[o].energy[g].value), o++, h++;
            i.push([u, ...l.map((p) => p / h)]);
            continue;
          }
        }
      }
      return i;
    } else
      console.warn("no data yet");
  }
  saveImpulseResponse(t = 0, e = 44100) {
    const n = this.resampleResponse(t, e);
    if (n)
      return n.map((s) => s.join(",")).join(`
`);
  }
  getReceiverIntersectionPoints(t) {
    return this.paths && this.paths[t] && this.paths[t].length > 0 ? this.paths[t].map(
      (e) => new M().fromArray(e.chain[e.chain.length - 1].point)
    ) : [];
  }
  calculateResponseByIntensity(t = this.defaultFrequencies, e = 20) {
    const n = this.indexedPaths, s = yn(e), r = we(t);
    this.responseByIntensity = {};
    for (const i in n) {
      this.responseByIntensity[i] = {};
      for (const a in n[i]) {
        this.responseByIntensity[i][a] = {
          freqs: t,
          response: []
        }, Wt(Yt(C.getState().containers[a].initialSPL));
        for (let o = 0; o < n[i][a].length; o++) {
          let u = 0, f = [], l = n[i][a][o].initialPhi, h = n[i][a][o].initialTheta, p = C.getState().containers[a].directivityHandler;
          for (let y = 0; y < t.length; y++)
            f[y] = Wt(p.getPressureAtPosition(0, t[y], l, h));
          for (let y = 0; y < n[i][a][o].chain.length; y++) {
            const { angle: v, distance: x } = n[i][a][o].chain[y];
            u += x / s;
            const d = n[i][a][o].chain[y].object, w = C.getState().containers[d] || this.room.surfaceMap[d] || null;
            for (let m = 0; m < t.length; m++) {
              const A = t[m];
              let b = 1;
              w && w.kind === "surface" && (b = w.reflectionFunction(A, v)), f.push(Wt(
                Yt(Ae(be(f[m] * b)) - r[m] * x)
              ));
            }
          }
          const g = Ae(be(f));
          this.responseByIntensity[i][a].response.push({
            time: u,
            level: g,
            bounces: n[i][a][o].chain.length
          });
        }
        this.responseByIntensity[i][a].response.sort((o, u) => o.time - u.time);
      }
    }
    return this.resampleResponseByIntensity();
  }
  resampleResponseByIntensity(t = this.intensitySampleRate) {
    if (this.responseByIntensity) {
      for (const e in this.responseByIntensity)
        for (const n in this.responseByIntensity[e]) {
          const { response: s, freqs: r } = this.responseByIntensity[e][n], i = s[s.length - 1].time, a = K(t * i);
          this.responseByIntensity[e][n].resampledResponse = Array(r.length).fill(0).map((h) => new Float32Array(a)), this.responseByIntensity[e][n].sampleRate = t;
          let o = 0, u = [], f = r.map((h) => 0), l = !1;
          for (let h = 0, p = 0; h < a; h++) {
            let g = h / a * i;
            if (s[p] && s[p].time) {
              let y = s[p].time;
              if (y > g) {
                for (let v = 0; v < r.length; v++)
                  this.responseByIntensity[e][n].resampledResponse[v][o] = 0;
                l && u.push(o), o++;
                continue;
              }
              if (y <= g) {
                let v = s[p].level.map((x) => 0);
                for (; y <= g; ) {
                  y = s[p].time;
                  for (let x = 0; x < r.length; x++)
                    v[x] = ps([v[x], s[p].level[x]]);
                  p++;
                }
                for (let x = 0; x < r.length; x++) {
                  if (this.responseByIntensity[e][n].resampledResponse[x][o] = v[x], u.length > 0) {
                    const d = f[x], w = v[x];
                    for (let m = 0; m < u.length; m++) {
                      const A = ds(d, w, (m + 1) / (u.length + 1));
                      this.responseByIntensity[e][n].resampledResponse[x][u[m]] = A;
                    }
                  }
                  f[x] = v[x];
                }
                u.length > 0 && (u = []), l = !0, o++;
                continue;
              }
            }
          }
          this.calculateT20(e, n), this.calculateT30(e, n), this.calculateT60(e, n);
        }
      return this.responseByIntensity;
    } else
      console.warn("no data yet");
  }
  calculateT30(t, e) {
    const n = this.receiverIDs, s = this.sourceIDs;
    if (n.length > 0 && s.length > 0) {
      const r = t || n[0], i = e || s[0], a = this.responseByIntensity[r][i].resampledResponse, o = this.responseByIntensity[r][i].sampleRate;
      if (this.responseByIntensity[r][i].freqs, a && o) {
        const u = new Float32Array(a[0].length);
        for (let f = 0; f < a[0].length; f++)
          u[f] = f / o;
        this.responseByIntensity[r][i].t30 = a.map((f) => {
          let l = 0, h = f[l];
          for (; h === 0; )
            h = f[l++];
          for (let v = l; v >= 0; v--)
            f[v] = h;
          const p = h - 30, y = ze(f, 2).filter((v) => v >= p).length;
          return Ve(u.slice(0, y), f.slice(0, y));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT20(t, e) {
    const n = this.receiverIDs, s = this.sourceIDs;
    if (n.length > 0 && s.length > 0) {
      const r = t || n[0], i = e || s[0], a = this.responseByIntensity[r][i].resampledResponse, o = this.responseByIntensity[r][i].sampleRate;
      if (this.responseByIntensity[r][i].freqs, a && o) {
        const u = new Float32Array(a[0].length);
        for (let f = 0; f < a[0].length; f++)
          u[f] = f / o;
        this.responseByIntensity[r][i].t20 = a.map((f) => {
          let l = 0, h = f[l];
          for (; h === 0; )
            h = f[l++];
          for (let v = l; v >= 0; v--)
            f[v] = h;
          const p = h - 20, y = ze(f, 2).filter((v) => v >= p).length;
          return Ve(u.slice(0, y), f.slice(0, y));
        });
      }
    }
    return this.responseByIntensity;
  }
  calculateT60(t, e) {
    const n = this.receiverIDs, s = this.sourceIDs;
    if (n.length > 0 && s.length > 0) {
      const r = t || n[0], i = e || s[0], a = this.responseByIntensity[r][i].resampledResponse, o = this.responseByIntensity[r][i].sampleRate;
      if (this.responseByIntensity[r][i].freqs, a && o) {
        const u = new Float32Array(a[0].length);
        for (let f = 0; f < a[0].length; f++)
          u[f] = f / o;
        this.responseByIntensity[r][i].t60 = a.map((f) => {
          let l = 0, h = f[l];
          for (; h === 0; )
            h = f[l++];
          for (let v = l; v >= 0; v--)
            f[v] = h;
          const p = h - 60, y = ze(f, 2).filter((v) => v >= p).length;
          return Ve(u.slice(0, y), f.slice(0, y));
        });
      }
    }
    return this.responseByIntensity;
  }
  computeImageSources(t, e, n) {
    for (const s of this.room.allSurfaces)
      s.uuid, e.uuid;
  }
  onParameterConfigFocus() {
    console.log("focus"), console.log(N.overlays.global.cells), N.overlays.global.showCell(this.uuid + "-valid-ray-count");
  }
  onParameterConfigBlur() {
    console.log("blur"), N.overlays.global.hideCell(this.uuid + "-valid-ray-count");
  }
  pathsToLinearBuffer() {
    const t = (s) => s.split("").map((r) => r.charCodeAt(0)), e = (s) => s.map((r) => [
      ...t(r.object),
      // 36x8
      r.angle,
      // 1x32
      r.distance,
      // 1x32
      r.energy,
      // 1x32
      r.faceIndex,
      // 1x8
      r.faceMaterialIndex,
      // 1x8
      ...r.faceNormal,
      // 3x32
      ...r.point
      // 3x32
    ]).flat();
    return new Float32Array(
      Object.keys(this.paths).map((s) => {
        const r = this.paths[s].map((i) => [
          ...t(i.source),
          i.chainLength,
          i.time,
          Number(i.intersectedReceiver),
          i.energy,
          ...e(i.chain)
        ]).flat();
        return [...t(s), r.length, ...r];
      }).flat()
    );
  }
  linearBufferToPaths(t) {
    const s = (u) => String.fromCharCode(...u), r = (u) => {
      let f = 0;
      const l = s(u.slice(f, f += 36)), h = u[f++], p = u[f++], g = u[f++], y = u[f++], v = u[f++], x = [u[f++], u[f++], u[f++]], d = [u[f++], u[f++], u[f++]];
      return {
        object: l,
        angle: h,
        distance: p,
        energy: g,
        faceIndex: y,
        faceMaterialIndex: v,
        faceNormal: x,
        point: d
      };
    }, i = (u) => {
      const f = [];
      let l = 0;
      for (; l < u.length; ) {
        s(u.slice(l, l += 36));
        const h = u[l++];
        u[l++], u[l++], u[l++];
        const p = [];
        for (let g = 0; g < h; g++)
          p.push(r(u.slice(l, l += 47)));
      }
      return f;
    };
    let a = 0;
    const o = {};
    for (; a < t.length; ) {
      const u = s(t.slice(a, a += 36)), f = t[a++], l = i(t.slice(a, a += f));
      o[u] = l;
    }
    return o;
  }
  arrivalPressure(t, e, n) {
    const s = Wt(Yt(t));
    n.chain.slice(0, -1).forEach((a) => {
      const o = C.getState().containers[a.object];
      s.forEach((u, f) => {
        let l;
        e[f] === 16e3 ? l = 1 - o.absorptionFunction(e[8e3]) : l = 1 - o.absorptionFunction(e[f]), s[f] = u * l;
      });
    });
    const r = Ae(be(s)), i = we(e);
    return e.forEach((a, o) => r[o] -= i[o] * n.totalLength), Yt(r);
  }
  async calculateImpulseResponse(t = 100, e = Et(63, 16e3), n = W.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    let s = this.paths[this.receiverIDs[0]].sort((f, l) => f.time - l.time);
    const r = s[s.length - 1].time + 0.05, i = Array(e.length).fill(t), a = K(n * r) * 2;
    let o = [];
    for (let f = 0; f < e.length; f++)
      o.push(new Float32Array(a));
    if (this.hybrid) {
      console.log("Hybrid Calculation...");
      for (let p = 0; p < s.length; p++)
        s[p].chainLength - 1 <= this.transitionOrder && s.splice(p, 1);
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
        frequencies: [125, 250, 500, 1e3, 2e3, 4e3, 8e3]
      }, h = new bs(f, !0).returnSortedPathsForHybrid(343, i, e);
      for (let p = 0; p < h.length; p++) {
        const g = Dt() ? 1 : -1, y = h[p].time, v = K(y * n);
        for (let x = 0; x < e.length; x++)
          o[x][v] += h[p].pressure[x] * g;
      }
    }
    for (let f = 0; f < s.length; f++) {
      const l = Dt() ? 1 : -1, h = s[f].time, p = this.arrivalPressure(i, e, s[f]).map((y) => y * l), g = K(h * n);
      for (let y = 0; y < e.length; y++)
        o[y][g] += p[y];
    }
    const u = Nt();
    return new Promise((f, l) => {
      u.postMessage({ samples: o }), u.onmessage = (h) => {
        const p = h.data.samples, g = new Float32Array(p[0].length >> 1);
        let y = 0;
        for (let w = 0; w < p.length; w++)
          for (let m = 0; m < g.length; m++)
            g[m] += p[w][m], nt(g[m]) > y && (y = nt(g[m]));
        const v = le(g), x = W.createOfflineContext(1, g.length, n), d = W.createBufferSource(v, x);
        d.connect(x.destination), d.start(), W.renderContextAsync(x).then((w) => f(w)).catch(l).finally(() => u.terminate());
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
  async calculateAmbisonicImpulseResponse(t = 1, e = 100, n = Et(63, 16e3), s = W.sampleRate) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (!this.paths[this.receiverIDs[0]] || this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet. Run the raytracer first.");
    const r = this.paths[this.receiverIDs[0]].sort((h, p) => h.time - p.time);
    if (r.length === 0) throw Error("No valid ray paths found");
    const i = r[r.length - 1].time + 0.05;
    if (i <= 0) throw Error("Invalid impulse response duration");
    const a = Array(n.length).fill(e), o = K(s * i) * 2;
    if (o < 2) throw Error("Impulse response too short to process");
    const u = As(t), f = [];
    for (let h = 0; h < n.length; h++) {
      f.push([]);
      for (let p = 0; p < u; p++)
        f[h].push(new Float32Array(o));
    }
    for (let h = 0; h < r.length; h++) {
      const p = r[h], g = Dt() ? 1 : -1, y = p.time, v = this.arrivalPressure(a, n, p).map((m) => m * g), x = K(y * s);
      if (x >= o) continue;
      const d = p.arrivalDirection || [0, 0, 1], w = new Float32Array(1);
      for (let m = 0; m < n.length; m++) {
        w[0] = v[m];
        const A = ws(w, d[0], d[1], d[2], t, "threejs");
        for (let b = 0; b < u; b++)
          f[m][b][x] += A[b][0];
      }
    }
    const l = Nt();
    return new Promise((h, p) => {
      const g = async (y) => new Promise((v) => {
        const x = [];
        for (let w = 0; w < n.length; w++)
          x.push(f[w][y]);
        const d = Nt();
        d.postMessage({ samples: x }), d.onmessage = (w) => {
          const m = w.data.samples, A = new Float32Array(m[0].length >> 1);
          for (let b = 0; b < m.length; b++)
            for (let I = 0; I < A.length; I++)
              A[I] += m[b][I];
          d.terminate(), v(A);
        };
      });
      Promise.all(
        Array.from({ length: u }, (y, v) => g(v))
      ).then((y) => {
        let v = 0;
        for (const m of y)
          for (let A = 0; A < m.length; A++)
            nt(m[A]) > v && (v = nt(m[A]));
        if (v > 0)
          for (const m of y)
            for (let A = 0; A < m.length; A++)
              m[A] /= v;
        const x = y[0].length;
        if (x === 0) {
          l.terminate(), p(new Error("Filtered signal has zero length"));
          return;
        }
        const w = W.createOfflineContext(u, x, s).createBuffer(u, x, s);
        for (let m = 0; m < u; m++)
          w.copyToChannel(new Float32Array(y[m]), m);
        l.terminate(), h(w);
      }).catch(p);
    });
  }
  async playImpulseResponse() {
    if (!this.impulseResponse)
      try {
        this.impulseResponse = await this.calculateImpulseResponse();
      } catch (e) {
        throw e;
      }
    W.context.state === "suspended" && W.context.resume(), console.log(this.impulseResponse);
    const t = W.context.createBufferSource();
    t.buffer = this.impulseResponse, t.connect(W.context.destination), t.start(), ct("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), t.onended = () => {
      t.stop(), t.disconnect(W.context.destination), ct("RAYTRACER_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  downloadImpulses(t, e = 100, n = Et(125, 8e3), s = 44100) {
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (this.paths[this.receiverIDs[0]].length === 0) throw Error("No rays have been traced yet");
    const r = this.paths[this.receiverIDs[0]].sort((l, h) => l.time - h.time), i = r[r.length - 1].time + 0.05, a = Array(n.length).fill(e), o = K(s * i), u = [];
    for (let l = 0; l < n.length; l++)
      u.push(new Float32Array(o));
    let f = 0;
    for (let l = 0; l < r.length; l++) {
      const h = Dt() ? 1 : -1, p = r[l].time, g = this.arrivalPressure(a, n, r[l]).map((v) => v * h), y = K(p * s);
      for (let v = 0; v < n.length; v++)
        u[v][y] += g[v], nt(u[v][y]) > f && (f = nt(u[v][y]));
    }
    for (let l = 0; l < n.length; l++) {
      const h = Ie([ys(u[l])], { sampleRate: s, bitDepth: 32 });
      Se.saveAs(h, `${n[l]}_${t}.wav`);
    }
  }
  async downloadImpulseResponse(t, e = W.sampleRate) {
    if (!this.impulseResponse)
      try {
        this.impulseResponse = await this.calculateImpulseResponse();
      } catch (r) {
        throw r;
      }
    const n = Ie([le(this.impulseResponse.getChannelData(0))], { sampleRate: e, bitDepth: 32 }), s = t.endsWith(".wav") ? "" : ".wav";
    Se.saveAs(n, t + s);
  }
  /**
   * Download the ambisonic impulse response as a multi-channel WAV file.
   * Channels are in ACN order with N3D normalization.
   *
   * @param filename - Output filename (without extension)
   * @param order - Ambisonic order (default: 1)
   */
  async downloadAmbisonicImpulseResponse(t, e = 1) {
    (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicOrder = e, this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e));
    const n = this.ambisonicImpulseResponse.numberOfChannels, s = this.ambisonicImpulseResponse.sampleRate, r = [];
    for (let u = 0; u < n; u++)
      r.push(this.ambisonicImpulseResponse.getChannelData(u));
    const i = Ie(r, { sampleRate: s, bitDepth: 32 }), a = t.endsWith(".wav") ? "" : ".wav", o = e === 1 ? "FOA" : `HOA${e}`;
    Se.saveAs(i, `${t}_${o}${a}`);
  }
  get sources() {
    return this.sourceIDs.length > 0 ? this.sourceIDs.map((t) => C.getState().containers[t]) : [];
  }
  get receivers() {
    return this.receiverIDs.length > 0 && Object.keys(C.getState().containers).length > 0 ? this.receiverIDs.map((t) => C.getState().containers[t].mesh) : [];
  }
  get room() {
    return C.getState().containers[this.roomID];
  }
  get precheck() {
    return this.sourceIDs.length > 0 && typeof this.room < "u";
  }
  get indexedPaths() {
    const t = {};
    for (const e in this.paths) {
      t[e] = {};
      for (let n = 0; n < this.paths[e].length; n++) {
        const s = this.paths[e][n].source;
        t[e][s] ? t[e][s].push(this.paths[e][n]) : t[e][s] = [this.paths[e][n]];
      }
    }
    return t;
  }
  get isRunning() {
    return this.running;
  }
  set isRunning(t) {
    this.running = this.precheck && t, this.running ? this.start() : this.stop();
  }
  get raysVisible() {
    return this._raysVisible;
  }
  set raysVisible(t) {
    t != this._raysVisible && (this._raysVisible = t, this.rays.visible = t), N.needsToRender = !0;
  }
  get pointsVisible() {
    return this._pointsVisible;
  }
  set pointsVisible(t) {
    t != this._pointsVisible && (this._pointsVisible = t, this.hits.visible = t), N.needsToRender = !0;
  }
  get invertedDrawStyle() {
    return this._invertedDrawStyle;
  }
  set invertedDrawStyle(t) {
    this._invertedDrawStyle != t && (this._invertedDrawStyle = t, this.hits.material.uniforms.inverted.value = Number(t), this.hits.material.needsUpdate = !0), N.needsToRender = !0;
  }
  get pointSize() {
    return this._pointSize;
  }
  set pointSize(t) {
    Number.isFinite(t) && t > 0 && (this._pointSize = t, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0), N.needsToRender = !0;
  }
  get runningWithoutReceivers() {
    return this._runningWithoutReceivers;
  }
  set runningWithoutReceivers(t) {
    this.mapIntersectableObjects(), this._runningWithoutReceivers = t;
  }
}
at("RAYTRACER_CALL_METHOD", ms);
at("RAYTRACER_SET_PROPERTY", gs);
at("REMOVE_RAYTRACER", vs);
at("ADD_RAYTRACER", xs(Ni));
at("RAYTRACER_CLEAR_RAYS", (c) => void jt.getState().solvers[c].clearRays());
at("RAYTRACER_PLAY_IR", (c) => {
  jt.getState().solvers[c].playImpulseResponse().catch((e) => {
    window.alert(e.message || "Failed to play impulse response");
  });
});
at("RAYTRACER_DOWNLOAD_IR", (c) => {
  var i, a;
  const t = jt.getState().solvers[c], e = C.getState().containers, n = t.sourceIDs.length > 0 && ((i = e[t.sourceIDs[0]]) == null ? void 0 : i.name) || "source", s = t.receiverIDs.length > 0 && ((a = e[t.receiverIDs[0]]) == null ? void 0 : a.name) || "receiver", r = `ir-${n}-${s}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadImpulseResponse(r).catch((o) => {
    window.alert(o.message || "Failed to download impulse response");
  });
});
at("RAYTRACER_DOWNLOAD_IR_OCTAVE", (c) => void jt.getState().solvers[c].downloadImpulses(c));
at("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: c, order: t }) => {
  var a, o;
  const e = jt.getState().solvers[c], n = C.getState().containers, s = e.sourceIDs.length > 0 && ((a = n[e.sourceIDs[0]]) == null ? void 0 : a.name) || "source", r = e.receiverIDs.length > 0 && ((o = n[e.receiverIDs[0]]) == null ? void 0 : o.name) || "receiver", i = `ir-${s}-${r}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadAmbisonicImpulseResponse(i, t).catch((u) => {
    window.alert(u.message || "Failed to download ambisonic impulse response");
  });
});
export {
  Ui as ReceiverData,
  Ni as default,
  $ as defaults
};
//# sourceMappingURL=index-C9o0Q0p6.mjs.map
