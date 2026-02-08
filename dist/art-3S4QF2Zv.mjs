import { S as it } from "./solver-BnRpsXb-.mjs";
import { T as rt, v as ct, u as Z, w as at, R as lt, a as ht, e as tt, o as X, d as ut, c as ft, s as dt, f as mt } from "./index-BW01orYZ.mjs";
import { IcosahedronGeometry as gt, Vector3 as y, Triangle as xt } from "three";
import { a as et } from "./air-attenuation-CBIk1QMo.mjs";
import { s as pt } from "./sound-speed-Biev-mJ1.mjs";
const yt = 1;
class wt {
  /** Number of icosahedron subdivisions */
  detail;
  /** Unit direction vectors for each hemisphere bin (in local frame, z-up) */
  directions;
  /** Number of hemisphere direction bins */
  nSlots;
  /**
   * Reflection coefficient matrix [incomingSlot][outgoingSlot].
   * coefficients[i][j] = fraction of energy arriving in direction i
   * that is reflected into direction j.
   */
  coefficients;
  constructor(t = yt) {
    this.detail = t;
    const s = new gt(1, this.detail).getAttribute("position"), o = /* @__PURE__ */ new Set(), i = [];
    for (let r = 0; r < s.count; r++) {
      const l = s.getX(r), h = s.getY(r), u = s.getZ(r);
      if (u >= 0) {
        const a = new y(l, h, u).normalize(), c = `${a.x.toFixed(6)},${a.y.toFixed(6)},${a.z.toFixed(6)}`;
        o.has(c) || (o.add(c), i.push(a));
      }
    }
    this.directions = i, this.nSlots = i.length, this.coefficients = [];
    for (let r = 0; r < this.nSlots; r++)
      this.coefficients[r] = new Float32Array(this.nSlots);
  }
  /**
   * Compute BRDF coefficients for a given absorption and scattering.
   * Specular component goes into the mirror-reflection bin.
   * Diffuse component is distributed uniformly across all bins.
   */
  computeCoefficients(t, e) {
    const s = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0)), o = Math.max(0, Math.min(1, Number.isFinite(e) ? e : 0)), i = 1 - s, r = i * o / this.nSlots, l = i * (1 - o);
    for (let h = 0; h < this.nSlots; h++) {
      const u = this.directions[h], a = new y(-u.x, -u.y, u.z).normalize(), c = this.findNearestSlot(a);
      for (let m = 0; m < this.nSlots; m++)
        this.coefficients[h][m] = r;
      this.coefficients[h][c] += l;
    }
  }
  /**
   * Find the nearest hemisphere bin for a direction in local frame (z-up).
   */
  findNearestSlot(t) {
    let e = 0, s = -1 / 0;
    for (let o = 0; o < this.nSlots; o++) {
      const i = t.dot(this.directions[o]);
      i > s && (s = i, e = o);
    }
    return e;
  }
  /**
   * Get the direction slot index for a world-space direction relative to a patch normal.
   * Transforms the direction into the local frame where the patch normal is z-up.
   */
  getDirectionIndex(t, e) {
    const s = It(t, e);
    return s.z < 0 && (s.z = 0), s.lengthSq() < 1e-10 ? 0 : (s.normalize(), this.findNearestSlot(s));
  }
  /**
   * Get the outgoing reflection coefficients for a given incoming direction slot.
   * Returns array of length nSlots with the weight for each outgoing direction.
   */
  getOutgoingWeights(t) {
    return this.coefficients[t];
  }
}
function It(n, t) {
  const e = t.clone().normalize();
  let s = new y(1, 0, 0);
  Math.abs(e.dot(s)) > 0.9 && (s = new y(0, 1, 0));
  const o = new y().crossVectors(e, s).normalize(), i = new y().crossVectors(e, o).normalize();
  return new y(n.dot(o), n.dot(i), n.dot(e));
}
class G {
  buffer;
  constructor(t) {
    this.buffer = new Float32Array(t);
  }
  clear(t = 0, e = this.buffer.length, s = 0) {
    this.buffer.fill(s, t, e);
  }
  extend(t) {
    const e = new Float32Array(t);
    for (let s = 0; s < this.buffer.length; s++)
      e[s] = this.buffer[s];
    this.buffer = e;
  }
  add(t, e) {
    this.buffer[t] += e;
  }
  sum() {
    let t = 0;
    for (let e = 0; e < this.buffer.length; e++)
      t += this.buffer[e];
    return t;
  }
  delayMultiplyAdd(t, e, s) {
    e = Math.round(e);
    const o = t.buffer.length + e;
    o > this.buffer.length && this.extend(o);
    for (let i = 0; i < t.buffer.length; i++)
      this.buffer[i + e] += t.buffer[i] * s;
  }
}
class nt {
  /* number of directions */
  n;
  /* response in each direction */
  responses;
  /**
   * constructs a new DirectionalResponse
   * @param n number of directions
   * @param length length of the response
   */
  constructor(t, e) {
    this.n = t, this.responses = [];
    for (let s = 0; s < t; s++)
      this.responses[s] = new G(e);
  }
  clear() {
    this.responses.forEach((t) => t.clear());
  }
  sum() {
    return this.responses.reduce((t, e) => t + e.sum(), 0);
  }
  delayMultiplyAdd(t, e, s, o) {
    for (let i = 0; i < this.n; i++)
      this.responses[i].delayMultiplyAdd(t, e, s[i] * o);
  }
  accumulateFrom(t) {
    for (let e = 0; e < this.n; e++)
      this.responses[e].buffer[0] = t.responses[e].sum();
  }
}
class q {
  extentsMin;
  extentsMax;
  startIndex;
  endIndex;
  level;
  node0;
  node1;
  constructor(t, e, s, o, i) {
    this.extentsMin = t, this.extentsMax = e, this.startIndex = s, this.endIndex = o, this.level = i, this.node0 = null, this.node1 = null;
  }
  static fromObj({ extentsMin: t, extentsMax: e, startIndex: s, endIndex: o, level: i, node0: r, node1: l }) {
    const h = new q(t, e, s, o, i);
    return r && (h.node0 = q.fromObj(r)), l && (h.node1 = q.fromObj(l)), h;
  }
  elementCount() {
    return this.endIndex - this.startIndex;
  }
  centerX() {
    return (this.extentsMin[0] + this.extentsMax[0]) * 0.5;
  }
  centerY() {
    return (this.extentsMin[1] + this.extentsMax[1]) * 0.5;
  }
  centerZ() {
    return (this.extentsMin[2] + this.extentsMax[2]) * 0.5;
  }
  clearShapes() {
    this.startIndex = -1, this.endIndex = -1;
  }
  get children() {
    return [this.node0, this.node1];
  }
}
class F {
  x = 0;
  y = 0;
  z = 0;
  constructor(t = 0, e = 0, s = 0) {
    this.x = t, this.y = e, this.z = s;
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  setFromArray(t, e) {
    this.x = t[e], this.y = t[e + 1], this.z = t[e + 2];
  }
  setFromArrayNoOffset(t) {
    this.x = t[0], this.y = t[1], this.z = t[2];
  }
  setFromArgs(t, e, s) {
    this.x = t, this.y = e, this.z = s;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  cross(t) {
    const e = this.x, s = this.y, o = this.z;
    return this.x = s * t.z - o * t.y, this.y = o * t.x - e * t.z, this.z = e * t.y - s * t.x, this;
  }
  crossVectors(t, e) {
    const s = t.x, o = t.y, i = t.z, r = e.x, l = e.y, h = e.z;
    return this.x = o * h - i * l, this.y = i * r - s * h, this.z = s * l - o * r, this;
  }
  clone() {
    return new F(this.x, this.y, this.z);
  }
  static fromAny(t) {
    if (t instanceof F)
      return t;
    if (t.x !== void 0 && t.x !== null)
      return new F(t.x, t.y, t.z);
    throw new TypeError("Couldn't convert to BVHVector3.");
  }
}
class j {
  rootNode;
  bboxArray;
  trianglesArray;
  constructor(t, e, s) {
    this.rootNode = t, this.bboxArray = e, this.trianglesArray = s;
  }
  intersectRay(t, e, s = !0) {
    try {
      t = F.fromAny(t), e = F.fromAny(e);
    } catch {
      throw new TypeError("Origin or Direction couldn't be converted to a BVHVector3.");
    }
    const o = [this.rootNode], i = [], r = [], l = new F(
      1 / e.x,
      1 / e.y,
      1 / e.z
    );
    for (; o.length > 0; ) {
      const c = o.pop();
      if (c && j.intersectNodeBox(t, l, c)) {
        c.node0 && o.push(c.node0), c.node1 && o.push(c.node1);
        for (let m = c.startIndex; m < c.endIndex; m++)
          i.push(this.bboxArray[m * 7]);
      }
    }
    let h = new F(), u = new F(), a = new F();
    for (let c = 0; c < i.length; c++) {
      const m = i[c];
      h.setFromArray(this.trianglesArray, m * 9), u.setFromArray(this.trianglesArray, m * 9 + 3), a.setFromArray(this.trianglesArray, m * 9 + 6);
      const x = j.intersectRayTriangle(h, u, a, t, e, s);
      x && r.push({
        //triangle: [a.clone(), b.clone(), c.clone()],
        triangleIndex: m,
        intersectionPoint: x
      });
    }
    return r;
  }
  static calcTValues(t, e, s, o) {
    return o >= 0 ? [(t - s) * o, (e - s) * o] : [(e - s) * o, (t - s) * o];
  }
  static intersectNodeBox(t, e, s) {
    let [o, i] = j.calcTValues(s.extentsMin[0], s.extentsMax[0], t.x, e.x), [r, l] = j.calcTValues(s.extentsMin[1], s.extentsMax[1], t.y, e.y);
    if (o > l || r > i) return !1;
    (r > o || o !== o) && (o = r), (l < i || i !== i) && (i = l);
    let [h, u] = j.calcTValues(s.extentsMin[2], s.extentsMax[2], t.z, e.z);
    return !(o > u || h > i || ((u < i || i !== i) && (i = u), i < 0));
  }
  static intersectRayTriangle(t, e, s, o, i, r) {
    var l = new F(), h = new F(), u = new F(), a = new F();
    h.subVectors(e, t), u.subVectors(s, t), a.crossVectors(h, u);
    let c = i.dot(a);
    if (c === 0 || c > 0 && r) return null;
    let m = Math.sign(c);
    c *= m, l.subVectors(o, t);
    var x = m * i.dot(u.crossVectors(l, u));
    if (x < 0) return null;
    var g = m * i.dot(h.cross(l));
    if (g < 0 || x + g > c) return null;
    const p = -m * l.dot(a);
    return p < 0 ? null : i.clone().multiplyScalar(p / c).add(o);
  }
}
const B = 1e-6;
function Mt(n, t = 10) {
  if (typeof t != "number") throw new Error(`maxTrianglesPerNode must be of type number, got: ${typeof t}`);
  if (t < 1) throw new Error(`maxTrianglesPerNode must be greater than or equal to 1, got: ${t}`);
  if (Number.isNaN(t)) throw new Error("maxTrianglesPerNode is NaN");
  Number.isInteger(t) || console.warn(`maxTrianglesPerNode is expected to be an integer, got: ${t}`);
  let e;
  if (Array.isArray(n) && n.length === 0 && console.warn("triangles appears to be an array with 0 elements."), Tt(n))
    e = bt(n);
  else if (n instanceof Float32Array)
    e = n;
  else if (Dt(n))
    e = new Float32Array(n);
  else
    throw new Error(`triangles must be of type Vector[][] | number[] | Float32Array, got: ${typeof n}`);
  let s = St(e), o = new Float32Array(s.length);
  o.set(s);
  var i = e.length / 9, r = Q(s, 0, i, B);
  let l = new q(r[0], r[1], 0, i, 0), h = [l], u;
  for (; u = h.pop(); ) {
    let a = vt(u, t, s, o);
    h.push(...a);
  }
  return new j(l, s, e);
}
function vt(n, t, e, s) {
  const o = n.elementCount();
  if (o <= t || o === 0) return [];
  let i = n.startIndex, r = n.endIndex, l = [[], [], []], h = [[], [], []], u = [n.centerX(), n.centerY(), n.centerZ()], a = [];
  a.length = 3;
  for (let I = i; I < r; I++) {
    let M = I * 7 + 1;
    a[0] = (e[M] + e[M++ + 3]) * 0.5, a[1] = (e[M] + e[M++ + 3]) * 0.5, a[2] = (e[M] + e[M + 3]) * 0.5;
    for (let f = 0; f < 3; f++)
      a[f] < u[f] ? l[f].push(I) : h[f].push(I);
  }
  var c = [];
  if (c.length = 3, c[0] = l[0].length === 0 || h[0].length === 0, c[1] = l[1].length === 0 || h[1].length === 0, c[2] = l[2].length === 0 || h[2].length === 0, c[0] && c[1] && c[2]) return [];
  var m = [0, 1, 2], x = [
    n.extentsMax[0] - n.extentsMin[0],
    n.extentsMax[1] - n.extentsMin[1],
    n.extentsMax[2] - n.extentsMin[2]
  ];
  m.sort((I, M) => x[M] - x[I]);
  let g = [], p = [];
  for (let I = 0; I < 3; I++) {
    var v = m[I];
    if (!c[v]) {
      g = l[v], p = h[v];
      break;
    }
  }
  var d = i, w = d + g.length, z = w, D = r;
  zt(g, p, n.startIndex, e, s);
  var R = s.subarray(n.startIndex * 7, n.endIndex * 7);
  e.set(R, n.startIndex * 7);
  var S = Q(e, d, w, B), T = Q(e, z, D, B), A = new q(S[0], S[1], d, w, n.level + 1), E = new q(T[0], T[1], z, D, n.level + 1);
  return n.node0 = A, n.node1 = E, n.clearShapes(), [A, E];
}
function zt(n, t, e, s, o) {
  var i = n.concat(t), r = e;
  for (let l = 0; l < i.length; l++) {
    let h = i[l];
    Et(s, h, o, r), r++;
  }
}
function Q(n, t, e, s = 0) {
  if (t >= e) return [[0, 0, 0], [0, 0, 0]];
  let o = 1 / 0, i = 1 / 0, r = 1 / 0, l = -1 / 0, h = -1 / 0, u = -1 / 0;
  for (let a = t; a < e; a++) {
    let c = a * 7 + 1;
    o = Math.min(n[c++], o), i = Math.min(n[c++], i), r = Math.min(n[c++], r), l = Math.max(n[c++], l), h = Math.max(n[c++], h), u = Math.max(n[c], u);
  }
  return [
    [o - s, i - s, r - s],
    [l + s, h + s, u + s]
  ];
}
function St(n) {
  const t = n.length / 9, e = new Float32Array(t * 7);
  for (let s = 0; s < t; s++) {
    let o = s * 9;
    const i = n[o++], r = n[o++], l = n[o++], h = n[o++], u = n[o++], a = n[o++], c = n[o++], m = n[o++], x = n[o], g = Math.min(i, h, c), p = Math.min(r, u, m), v = Math.min(l, a, x), d = Math.max(i, h, c), w = Math.max(r, u, m), z = Math.max(l, a, x);
    Rt(e, s, s, g, p, v, d, w, z);
  }
  return e;
}
function bt(n) {
  const t = new Float32Array(n.length * 9);
  for (let e = 0; e < n.length; e++) {
    const s = n[e][0], o = n[e][1], i = n[e][2];
    let r = e * 9;
    t[r++] = s.x, t[r++] = s.y, t[r++] = s.z, t[r++] = o.x, t[r++] = o.y, t[r++] = o.z, t[r++] = i.x, t[r++] = i.y, t[r] = i.z;
  }
  return t;
}
function Rt(n, t, e, s, o, i, r, l, h) {
  let u = t * 7;
  n[u++] = e, n[u++] = s, n[u++] = o, n[u++] = i, n[u++] = r, n[u++] = l, n[u] = h;
}
function Et(n, t, e, s) {
  let o = s * 7, i = t * 7;
  e[o++] = n[i++], e[o++] = n[i++], e[o++] = n[i++], e[o++] = n[i++], e[o++] = n[i++], e[o++] = n[i++], e[o] = n[i];
}
function Tt(n) {
  if (!Array.isArray(n)) return !1;
  for (let t = 0; t < n.length; t++) {
    const e = n[t];
    if (!Array.isArray(e) || e.length !== 3) return !1;
    for (let s = 0; s < 3; s++) {
      const o = e[s];
      if (typeof o.x != "number" || typeof o.y != "number" || typeof o.z != "number") return !1;
    }
  }
  return !0;
}
function Dt(n) {
  if (!Array.isArray(n)) return !1;
  for (let t = 0; t < n.length; t++)
    if (typeof n[t] != "number") return !1;
  return !0;
}
function At(n, t) {
  const e = n.allSurfaces, s = [], o = [], i = [], r = new rt(t, 6);
  for (let u = 0; u < e.length; u++) {
    const a = e[u], c = a.geometry.clone(), g = r.modify(c).getAttribute("position").array, p = g.length / 9;
    for (let v = 0; v < p; v++) {
      const d = v * 9, w = new y(g[d], g[d + 1], g[d + 2]), z = new y(g[d + 3], g[d + 4], g[d + 5]), D = new y(g[d + 6], g[d + 7], g[d + 8]), R = a.localToWorld(w.clone()), S = a.localToWorld(z.clone()), T = a.localToWorld(D.clone()), A = new xt(R, S, T), E = A.getArea();
      if (E < 1e-10) continue;
      const I = new y();
      A.getMidpoint(I);
      const M = new y();
      A.getNormal(M);
      const f = s.length;
      s.push({
        index: f,
        centroid: I,
        normal: M,
        area: E,
        vertices: [R, S, T],
        surfaceIndex: u,
        absorption: a.absorptionFunction,
        scattering: a.scatteringFunction || (() => a.scatteringCoefficient)
      }), o.push([
        R.x,
        R.y,
        R.z,
        S.x,
        S.y,
        S.z,
        T.x,
        T.y,
        T.z
      ]), i.push(f);
    }
  }
  const l = new Float32Array(o.length * 9);
  for (let u = 0; u < o.length; u++)
    for (let a = 0; a < 9; a++)
      l[u * 9 + a] = o[u][a];
  const h = Mt(l);
  return { patches: s, bvh: h, triangleToPatch: i };
}
function Pt(n) {
  let t = Math.random(), e = Math.random();
  t + e > 1 && (t = 1 - t, e = 1 - e);
  const s = 1 - t - e;
  return new y(
    n.vertices[0].x * t + n.vertices[1].x * e + n.vertices[2].x * s,
    n.vertices[0].y * t + n.vertices[1].y * e + n.vertices[2].y * s,
    n.vertices[0].z * t + n.vertices[1].z * e + n.vertices[2].z * s
  );
}
function Nt(n) {
  let t = -1, e = 0;
  for (let s = 0; s < n.length; s++) {
    const o = n[s].sum();
    o > t && (t = o, e = s);
  }
  return e;
}
function st(n) {
  let t = 0;
  for (let e = 0; e < n.length; e++)
    t += n[e].sum();
  return t;
}
function Ft(n, t) {
  const { patchSet: e, unshotEnergy: s, totalEnergy: o, brdf: i, airAbsNepers: r, speedOfSound: l, sampleRate: h, raysPerShoot: u } = n, { patches: a, bvh: c, triangleToPatch: m } = e, x = a[t], g = s[t], p = [];
  let v = 0;
  for (let d = 0; d < i.nSlots; d++) {
    const w = g.responses[d].sum();
    p.push(w), v += w;
  }
  if (!(v < 1e-20)) {
    for (let d = 0; d < i.nSlots; d++) {
      if (p[d] < 1e-20) continue;
      const w = p[d] / v, z = Math.max(1, Math.round(w * u)), D = 1 / z;
      for (let R = 0; R < z; R++) {
        const S = Pt(x), T = Vt(i, d), A = Wt(T, x.normal), E = c.intersectRay(S, A, !1);
        if (!E || E.length === 0) continue;
        let I = null, M = 1 / 0;
        for (const k of E) {
          if (m[k.triangleIndex] === t) continue;
          const O = k.intersectionPoint, K = O.x - S.x, J = O.y - S.y, _ = O.z - S.z, H = Math.sqrt(K * K + J * J + _ * _);
          H < M && (M = H, I = k);
        }
        if (!I || M < 1e-6) continue;
        const f = m[I.triangleIndex], P = a[f], b = M / l * h, L = Math.exp(-r * M), V = i.getDirectionIndex(A.clone().negate(), P.normal), C = n.absorptions[f], $ = n.scatterings[f];
        i.computeCoefficients(C, $);
        const W = i.getOutgoingWeights(V), U = g.responses[d], Y = D * L;
        for (let k = 0; k < i.nSlots; k++) {
          const N = W[k] * Y;
          N < 1e-20 || (s[f].responses[k].delayMultiplyAdd(
            U,
            b,
            N
          ), o[f].responses[k].delayMultiplyAdd(
            U,
            b,
            N
          ));
        }
      }
    }
    g.clear();
  }
}
function Ct(n, t, e, s = 500) {
  const { patchSet: o, unshotEnergy: i, totalEnergy: r, brdf: l, airAbsNepers: h, speedOfSound: u, sampleRate: a } = e, { patches: c, bvh: m, triangleToPatch: x } = o, g = t / s;
  for (let p = 0; p < s; p++) {
    const v = kt(), d = m.intersectRay(n, v, !1);
    if (!d || d.length === 0) continue;
    let w = null, z = 1 / 0;
    for (const b of d) {
      const L = b.intersectionPoint, V = L.x - n.x, C = L.y - n.y, $ = L.z - n.z, W = Math.sqrt(V * V + C * C + $ * $);
      W < z && (z = W, w = b);
    }
    if (!w || z < 1e-6) continue;
    const D = x[w.triangleIndex], R = c[D], S = z / u * a, T = Math.exp(-h * z), A = v.clone().negate(), E = l.getDirectionIndex(A, R.normal), I = e.absorptions[D], M = e.scatterings[D];
    l.computeCoefficients(I, M);
    const f = l.getOutgoingWeights(E), P = new G(1);
    P.buffer[0] = g * T;
    for (let b = 0; b < l.nSlots; b++) {
      const L = f[b];
      L < 1e-20 || (i[D].responses[b].delayMultiplyAdd(P, S, L), r[D].responses[b].delayMultiplyAdd(P, S, L));
    }
  }
}
function Lt(n, t) {
  const { patchSet: e, totalEnergy: s, brdf: o, airAbsNepers: i, speedOfSound: r, sampleRate: l } = t, { patches: h, bvh: u, triangleToPatch: a } = e, c = new G(1);
  for (let m = 0; m < h.length; m++) {
    const x = h[m], g = new y().subVectors(n, x.centroid), p = g.length();
    if (p < 1e-6) continue;
    g.normalize();
    const v = x.normal.dot(g);
    if (v <= 0) continue;
    const d = u.intersectRay(x.centroid, g, !1);
    let w = !1;
    if (d)
      for (const E of d) {
        if (a[E.triangleIndex] === m) continue;
        const M = E.intersectionPoint;
        if (new y(
          M.x - x.centroid.x,
          M.y - x.centroid.y,
          M.z - x.centroid.z
        ).length() < p - 0.01) {
          w = !0;
          break;
        }
      }
    if (w) continue;
    const z = p / r * l, D = Math.exp(-i * p), R = x.area * v / (p * p), S = o.getDirectionIndex(g, x.normal), T = s[m].responses[S], A = R * D;
    c.delayMultiplyAdd(T, z, A);
  }
  return c;
}
function kt() {
  const n = Math.acos(2 * Math.random() - 1), t = 2 * Math.PI * Math.random();
  return new y(
    Math.sin(n) * Math.cos(t),
    Math.sin(n) * Math.sin(t),
    Math.cos(n)
  );
}
function Vt(n, t) {
  const e = n.directions[t], s = Math.acos(Math.sqrt(Math.random())) * 0.5, o = 2 * Math.PI * Math.random();
  let i = new y(1, 0, 0);
  Math.abs(e.dot(i)) > 0.9 && (i = new y(0, 1, 0));
  const r = new y().crossVectors(e, i).normalize(), l = new y().crossVectors(e, r).normalize(), h = Math.sin(s), u = Math.cos(s), a = new y().addScaledVector(e, u).addScaledVector(r, h * Math.cos(o)).addScaledVector(l, h * Math.sin(o));
  return a.normalize(), a.z < 0 && (a.z = -a.z), a.normalize(), a;
}
function Wt(n, t) {
  const e = t.clone().normalize();
  let s = new y(1, 0, 0);
  Math.abs(e.dot(s)) > 0.9 && (s = new y(0, 1, 0));
  const o = new y().crossVectors(e, s).normalize(), i = new y().crossVectors(e, o).normalize();
  return new y(
    n.x * o.x + n.y * i.x + n.z * e.x,
    n.x * o.y + n.y * i.y + n.z * e.y,
    n.x * o.z + n.y * i.z + n.z * e.z
  ).normalize();
}
const ot = {
  name: "Acoustic Radiance Transfer"
};
class $t extends it {
  uuid;
  roomID;
  sourceIDs;
  receiverIDs;
  /** Tessellation patch size in meters */
  maxEdgeLength;
  /** Icosahedron subdivision level (0=6 bins, 1=~18 bins, 2=~66 bins) */
  brdfDetail;
  /** Rays per shooting iteration */
  raysPerShoot;
  /** Maximum shooting iterations */
  maxIterations;
  /** Stop when unshot/initial < threshold */
  convergenceThreshold;
  /** Internal temporal sample rate in Hz */
  sampleRate;
  /** Octave band center frequencies to compute */
  frequencies;
  /** Initial source energy */
  initialEnergy;
  /** Number of rays for source injection */
  sourceRays;
  /** Iteration count from last calculation */
  lastIterationCount;
  /** Patch count from last calculation */
  lastPatchCount;
  /** Whether any results have been emitted */
  hasEmittedResults;
  constructor(t = ot) {
    super(t), this.kind = "art", this.name = t.name || ot.name, this.uuid = ct();
    const e = Z.getState().getRooms();
    this.roomID = t.roomID || (e.length > 0 ? e[0].uuid : ""), this.sourceIDs = t.sourceIDs || [], this.receiverIDs = t.receiverIDs || [], this.maxEdgeLength = t.maxEdgeLength ?? 0.5, this.brdfDetail = t.brdfDetail ?? 1, this.raysPerShoot = t.raysPerShoot ?? 200, this.maxIterations = t.maxIterations ?? 100, this.convergenceThreshold = t.convergenceThreshold ?? 0.01, this.sampleRate = t.sampleRate ?? 1e3, this.frequencies = at.slice(4, 11), this.initialEnergy = 500, this.sourceRays = 500, this.lastIterationCount = 0, this.lastPatchCount = 0, this.hasEmittedResults = !1;
  }
  calculate() {
    const t = Z.getState().containers, e = t[this.roomID];
    if (!e) {
      console.error("ART: No room found");
      return;
    }
    const s = [], o = [];
    for (const a of this.sourceIDs) {
      const c = t[a];
      c && c.kind === "source" && s.push(c);
    }
    for (const a of this.receiverIDs) {
      const c = t[a];
      c && c.kind === "receiver" && o.push(c);
    }
    if (s.length === 0 || o.length === 0) {
      console.warn("ART: Need at least one source and one receiver");
      return;
    }
    const i = pt(this.temperature), r = At(e, this.maxEdgeLength), l = r.patches.length;
    if (this.lastPatchCount = l, l === 0) {
      console.error("ART: Tessellation produced no patches");
      return;
    }
    const h = new wt(this.brdfDetail), u = Math.ceil(this.sampleRate * 5);
    for (const a of s) {
      const c = new y();
      a.getWorldPosition(c);
      for (const m of o) {
        const x = new y();
        m.getWorldPosition(x);
        const g = [];
        for (const f of this.frequencies) {
          const P = [], b = [];
          for (const N of r.patches)
            P.push(N.absorption(f)), b.push(N.scattering(f));
          const V = et([f], this.temperature)[0] / (20 / Math.LN10), C = [], $ = [];
          for (let N = 0; N < l; N++)
            C[N] = new nt(h.nSlots, u), $[N] = new nt(h.nSlots, u);
          const W = {
            patchSet: r,
            unshotEnergy: C,
            totalEnergy: $,
            brdf: h,
            absorptions: P,
            scatterings: b,
            airAbsNepers: V,
            speedOfSound: i,
            sampleRate: this.sampleRate,
            raysPerShoot: this.raysPerShoot
          };
          Ct(c, this.initialEnergy, W, this.sourceRays);
          const U = st(C);
          let Y = 0;
          for (; Y < this.maxIterations; ) {
            const N = st(C);
            if (U > 0 && N / U < this.convergenceThreshold)
              break;
            const O = Nt(C);
            if (C[O].sum() < 1e-20) break;
            Ft(W, O), Y++;
          }
          this.lastIterationCount = Y;
          const k = Lt(x, W);
          g.push(k);
        }
        const p = c.distanceTo(x);
        if (p > 1e-6) {
          const f = p / i * this.sampleRate, P = Math.round(f);
          for (let b = 0; b < g.length; b++) {
            const V = et([this.frequencies[b]], this.temperature)[0] / (20 / Math.LN10), C = Math.exp(-V * p) / (p * p);
            P < g[b].buffer.length && (g[b].buffer[P] += this.initialEnergy * C);
          }
        }
        let v = 0;
        for (const f of g)
          f.buffer.length > v && (v = f.buffer.length);
        const d = new Float32Array(v);
        for (const f of g)
          for (let P = 0; P < f.buffer.length; P++)
            d[P] += f.buffer[P];
        let w = 0;
        for (let f = 0; f < d.length; f++)
          Math.abs(d[f]) > w && (w = Math.abs(d[f]));
        if (w > 0)
          for (let f = 0; f < d.length; f++)
            d[f] /= w;
        const z = [], D = Math.max(1, Math.floor(d.length / 2e3));
        for (let f = 0; f < d.length; f += D)
          z.push({
            time: f / this.sampleRate,
            amplitude: d[f]
          });
        let R = z.length - 1;
        for (; R > 0 && Math.abs(z[R].amplitude) < 1e-10; )
          R--;
        const S = z.slice(0, R + 1), T = a.name || "source", A = m.name || "receiver", E = `${this.uuid}-art-ir-${a.uuid}-${m.uuid}`, I = {
          kind: lt.ImpulseResponse,
          name: `ART IR: ${T} → ${A}`,
          uuid: E,
          from: this.uuid,
          info: {
            sampleRate: this.sampleRate,
            sourceName: T,
            receiverName: A,
            sourceId: a.uuid,
            receiverId: m.uuid
          },
          data: S.length > 0 ? S : [{ time: 0, amplitude: 0 }]
        };
        ht.getState().results[E] ? tt("UPDATE_RESULT", { uuid: E, result: I }) : tt("ADD_RESULT", I), this.hasEmittedResults = !0;
      }
    }
  }
  save() {
    const {
      name: t,
      kind: e,
      uuid: s,
      autoCalculate: o,
      roomID: i,
      sourceIDs: r,
      receiverIDs: l,
      maxEdgeLength: h,
      brdfDetail: u,
      raysPerShoot: a,
      maxIterations: c,
      convergenceThreshold: m,
      sampleRate: x
    } = this;
    return {
      name: t,
      kind: e,
      uuid: s,
      autoCalculate: o,
      roomID: i,
      sourceIDs: r,
      receiverIDs: l,
      maxEdgeLength: h,
      brdfDetail: u,
      raysPerShoot: a,
      maxIterations: c,
      convergenceThreshold: m,
      sampleRate: x
    };
  }
  restore(t) {
    return super.restore(t), this.kind = t.kind, t.roomID !== void 0 && (this.roomID = t.roomID), t.sourceIDs !== void 0 && (this.sourceIDs = t.sourceIDs), t.receiverIDs !== void 0 && (this.receiverIDs = t.receiverIDs), t.maxEdgeLength !== void 0 && (this.maxEdgeLength = t.maxEdgeLength), t.brdfDetail !== void 0 && (this.brdfDetail = t.brdfDetail), t.raysPerShoot !== void 0 && (this.raysPerShoot = t.raysPerShoot), t.maxIterations !== void 0 && (this.maxIterations = t.maxIterations), t.convergenceThreshold !== void 0 && (this.convergenceThreshold = t.convergenceThreshold), t.sampleRate !== void 0 && (this.sampleRate = t.sampleRate), this;
  }
  get rooms() {
    return Z.getState().getRooms();
  }
  get temperature() {
    return this.room?.temperature ?? 20;
  }
  get room() {
    return Z.getState().containers[this.roomID];
  }
  get noResults() {
    return !this.hasEmittedResults;
  }
}
X("ADD_ART", ut($t));
X("REMOVE_ART", ft);
X("ART_SET_PROPERTY", dt);
X("CALCULATE_ART", (n) => {
  const t = mt.getState().solvers[n];
  t && t.calculate();
});
export {
  $t as ART,
  $t as default
};
//# sourceMappingURL=art-3S4QF2Zv.mjs.map
