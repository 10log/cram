import { C as e, a as t, b as n, c as r, n as i, s as a, v as o } from "./FileSaver.min-BS9rdHrk.mjs";
import { a as s, g as c, i as l } from "./store-CUhn0IQy.mjs";
import { n as u } from "./convert-GmiMppOk.mjs";
import { n as d, r as f } from "./air-attenuation-CZldbT4Y.mjs";
import { t as p } from "./sound-speed-CfEkirc1.mjs";
import { t as m } from "./solver-DCp-VMaM.mjs";
import { a as h, c as g, d as _, f as v, h as y, i as b, l as x, m as S, o as C, p as w, r as T, s as E, t as D, u as O } from "./impedance-BJDUOGSt.mjs";
import { t as k } from "./schroeder-BROBh3sk.mjs";
import { Vector3 as A } from "three";
//#region src/compute/ard/voxelize.ts
var j = /* @__PURE__ */ function(e) {
	return e[e.Solid = 0] = "Solid", e[e.Air = 1] = "Air", e;
}({});
function M(e, t = 343, n = 2.6) {
	if (!(e > 0)) throw Error(`fMax must be positive, got ${e}`);
	return t / (n * e);
}
var N = 64e6;
function P(e, t, n, r, i, a, o, s, c, l, u, d) {
	if (Math.min(e, r, o) > l || Math.max(e, r, o) < -l || Math.min(t, i, s) > u || Math.max(t, i, s) < -u || Math.min(n, a, c) > d || Math.max(n, a, c) < -d) return !1;
	let f = [
		r - e,
		o - r,
		e - o
	], p = [
		i - t,
		s - i,
		t - s
	], m = [
		a - n,
		c - a,
		n - c
	], h = p[0] * m[1] - m[0] * p[1], g = m[0] * f[1] - f[0] * m[1], _ = f[0] * p[1] - p[0] * f[1], v = l * Math.abs(h) + u * Math.abs(g) + d * Math.abs(_);
	if (Math.abs(h * e + g * t + _ * n) > v) return !1;
	for (let h = 0; h < 3; h++) {
		let g = f[h], _ = p[h], v = m[h], y = v * t - _ * n, b = v * i - _ * a, x = v * s - _ * c, S = u * Math.abs(v) + d * Math.abs(_);
		if (Math.min(y, b, x) > S || Math.max(y, b, x) < -S || (y = -v * e + g * n, b = -v * r + g * a, x = -v * o + g * c, S = l * Math.abs(v) + d * Math.abs(g), Math.min(y, b, x) > S || Math.max(y, b, x) < -S) || (y = _ * e - g * t, b = _ * r - g * i, x = _ * o - g * s, S = l * Math.abs(_) + u * Math.abs(g), Math.min(y, b, x) > S || Math.max(y, b, x) < -S)) return !1;
	}
	return !0;
}
function F(e, t) {
	let { dx: n, seed: r, padCells: i = 1, maxCells: a = N } = t, o = [];
	if (!(n > 0)) throw Error(`Cell size must be positive, got ${n}`);
	if (!Number.isInteger(i) || i < 1) throw Error(`padCells must be an integer >= 1, got ${i}`);
	if (e.length === 0) throw Error("Cannot voxelize an empty surface set");
	let s = Infinity, c = Infinity, l = Infinity, u = -Infinity, d = -Infinity, f = -Infinity, p = 0, m = 0, h = 0;
	for (let t of e) s = Math.min(s, t.ax, t.bx, t.cx), c = Math.min(c, t.ay, t.by, t.cy), l = Math.min(l, t.az, t.bz, t.cz), u = Math.max(u, t.ax, t.bx, t.cx), d = Math.max(d, t.ay, t.by, t.cy), f = Math.max(f, t.az, t.bz, t.cz), p += t.ax + t.bx + t.cx, m += t.ay + t.by + t.cy, h += t.az + t.bz + t.cz;
	if (!Number.isFinite(s) || !Number.isFinite(u)) throw Error("Surface geometry has non-finite coordinates");
	let g = Math.ceil((u - s) / n) + 2 * i + 1, _ = Math.ceil((d - c) / n) + 2 * i + 1, v = Math.ceil((f - l) / n) + 2 * i + 1, y = g * _ * v;
	if (y > a) throw Error(`Voxel grid would be ${g}x${_}x${v} = ${y} cells, over the limit of ${a}. Raise dx (lower fMax) or raise maxCells.`);
	let b = {
		x: s - i * n,
		y: c - i * n,
		z: l - i * n
	}, x = new Uint8Array(y), S = new Int32Array(y).fill(-1), C = g, w = g * _, T = n / 2;
	for (let t of e) {
		let e = Math.min(t.ax, t.bx, t.cx), r = Math.min(t.ay, t.by, t.cy), i = Math.min(t.az, t.bz, t.cz), a = Math.max(t.ax, t.bx, t.cx), o = Math.max(t.ay, t.by, t.cy), s = Math.max(t.az, t.bz, t.cz), c = Math.max(0, Math.floor((e - T - b.x) / n)), l = Math.min(g - 1, Math.ceil((a + T - b.x) / n)), u = Math.max(0, Math.floor((r - T - b.y) / n)), d = Math.min(_ - 1, Math.ceil((o + T - b.y) / n)), f = Math.max(0, Math.floor((i - T - b.z) / n)), p = Math.min(v - 1, Math.ceil((s + T - b.z) / n));
		for (let e = f; e <= p; e++) {
			let r = b.z + e * n;
			for (let i = u; i <= d; i++) {
				let a = b.y + i * n, o = g * (i + _ * e);
				for (let e = c; e <= l; e++) {
					let i = b.x + e * n;
					if (!P(t.ax - i, t.ay - a, t.az - r, t.bx - i, t.by - a, t.bz - r, t.cx - i, t.cy - a, t.cz - r, T, T, T)) continue;
					let s = o + e;
					x[s] = 0, S[s] < 0 && (S[s] = t.surfaceIndex);
				}
			}
		}
	}
	let E = e.length * 3, D = r ?? {
		x: p / E,
		y: m / E,
		z: h / E
	}, O = (e, t) => Math.min(t, Math.max(0, e)), k = O(Math.round((D.x - b.x) / n), g - 1), A = O(Math.round((D.y - b.y) / n), _ - 1), j = O(Math.round((D.z - b.z) / n), v - 1), M = k + g * (A + _ * j), F = new Int32Array(y), L = (e) => {
		x.fill(0);
		let t = 0;
		F[t++] = e, x[e] = 1;
		let n = 1;
		for (; t > 0;) {
			let e = F[--t], n = e % g, i = (e - n) / g % _, a = Math.floor(e / w);
			n > 0 && r(e - 1), n < g - 1 && r(e + 1), i > 0 && r(e - C), i < _ - 1 && r(e + C), a > 0 && r(e - w), a < v - 1 && r(e + w);
		}
		function r(e) {
			x[e] === 1 || S[e] >= 0 || (x[e] = 1, n++, F[t++] = e);
		}
		return {
			airCount: n,
			touchedRim: I(x, g, _, v)
		};
	}, z;
	if (S[M] < 0) z = L(M);
	else {
		let e = R(S, g, _, v, k, A, j);
		if (e.length === 0) throw Error("No free cell found near the seed point; the grid is entirely solid");
		let t = null;
		for (let n of e) {
			let e = L(n);
			if (!e.touchedRim) {
				t = e;
				break;
			}
			t === null && (t = e);
		}
		z = t, z.touchedRim && (z = L(e[0])), o.push("The seed point landed on a wall cell; the fill started from the nearest enclosed free cell instead.");
	}
	let B = z.airCount, V = z.touchedRim;
	return V && o.push("The air fill reached the edge of the padded grid. The room surfaces do not close, or the seed point is outside them. The air region covers the whole bounding box and is not usable."), {
		nx: g,
		ny: _,
		nz: v,
		dx: n,
		origin: b,
		cells: x,
		surfaceOf: S,
		airCount: B,
		solidCount: y - B,
		leaked: V,
		warnings: o
	};
}
function I(e, t, n, r) {
	for (let i = 0; i < r; i++) {
		let a = i === 0 || i === r - 1;
		for (let r = 0; r < n; r++) {
			let o = r === 0 || r === n - 1, s = t * (r + n * i);
			if (a || o) {
				for (let n = 0; n < t; n++) if (e[s + n] === 1) return !0;
			} else if (e[s] === 1 || e[s + t - 1] === 1) return !0;
		}
	}
	return !1;
}
var L = 12;
function R(e, t, n, r, i, a, o) {
	let s = (t - 1) / 2, c = (n - 1) / 2, l = (r - 1) / 2, u = [], d = Math.max(t, n, r);
	for (let f = 1; f < d && u.length < L; f++) {
		let d = [];
		for (let u = Math.max(0, o - f); u <= Math.min(r - 1, o + f); u++) for (let r = Math.max(0, a - f); r <= Math.min(n - 1, a + f); r++) for (let p = Math.max(0, i - f); p <= Math.min(t - 1, i + f); p++) {
			if (Math.abs(p - i) !== f && Math.abs(r - a) !== f && Math.abs(u - o) !== f) continue;
			let m = p + t * (r + n * u);
			if (e[m] >= 0) continue;
			let h = p - s, g = r - c, _ = u - l;
			d.push({
				idx: m,
				toCentre: h * h + g * g + _ * _
			});
		}
		d.sort((e, t) => e.toCentre - t.toCentre || e.idx - t.idx);
		for (let e of d) if (u.push(e.idx), u.length >= L) break;
	}
	return u;
}
function z(e, t, n, r = 8) {
	let { nx: i, ny: a, nz: o } = e, s = (e, t, n) => e + i * (t + a * n), c = (e, t, n) => e >= 0 && t >= 0 && n >= 0 && e < i && t < a && n < o;
	if (c(t.i, t.j, t.k) && n(s(t.i, t.j, t.k), t.i, t.j, t.k)) return { ...t };
	for (let e = 1; e <= r; e++) {
		let r = [];
		for (let i = t.k - e; i <= t.k + e; i++) for (let a = t.j - e; a <= t.j + e; a++) for (let o = t.i - e; o <= t.i + e; o++) {
			if (Math.abs(o - t.i) !== e && Math.abs(a - t.j) !== e && Math.abs(i - t.k) !== e || !c(o, a, i) || !n(s(o, a, i), o, a, i)) continue;
			let l = o - t.i, u = a - t.j, d = i - t.k;
			r.push({
				i: o,
				j: a,
				k: i,
				distance: l * l + u * u + d * d
			});
		}
		if (r.length === 0) continue;
		r.sort((e, t) => e.distance - t.distance || e.i - t.i || e.j - t.j || e.k - t.k);
		let { i, j: a, k: o } = r[0];
		return {
			i,
			j: a,
			k: o
		};
	}
	return null;
}
function B(e, t) {
	let n = Math.round((t.x - e.origin.x) / e.dx), r = Math.round((t.y - e.origin.y) / e.dx), i = Math.round((t.z - e.origin.z) / e.dx);
	return n < 0 || r < 0 || i < 0 || n >= e.nx || r >= e.ny || i >= e.nz ? null : {
		i: n,
		j: r,
		k: i
	};
}
//#endregion
//#region src/compute/ard/decompose.ts
var V = 2 * O + 1;
function H(e, t = {}) {
	let { minBoxEdge: n = V, longestAxisFirst: r = !1 } = t, { nx: i, ny: a, nz: o, cells: s } = e;
	if (e.leaked) throw Error("Refusing to decompose a leaked voxel grid: the air region spans the whole bounding box, so the result would be meaningless. Fix the room geometry or the seed point.");
	if (!Number.isInteger(n) || n < 1) throw Error(`minBoxEdge must be a positive integer, got ${n}`);
	let c = i * a * o, l = new Int32Array(c).fill(-1), u = [], d = [], f = i, p = i * a, m = 0;
	for (let e = 0; e < c; e++) s[e] === j.Air && m++;
	let h = (e, t, n) => {
		let r = e + f * t + p * n;
		return s[r] === j.Air && l[r] < 0;
	}, g = (e, t, n, r) => {
		let s = r === 0 ? i : r === 1 ? a : o, c = r === 0 ? e : r === 1 ? t : n, l = 0;
		for (; c + l < s && (r === 0 ? h(e + l, t, n) : r === 1 ? h(e, t + l, n) : h(e, t, n + l));) l++;
		return l;
	}, _ = (e, t, n) => {
		let r = [
			e[0],
			e[1],
			e[2]
		];
		r[n] = e[n] + t[n];
		let s = n === 0 ? i : n === 1 ? a : o;
		if (r[n] >= s) return !1;
		let c = n === 0 ? 1 : t[0], l = n === 1 ? 1 : t[1], u = n === 2 ? 1 : t[2];
		for (let t = 0; t < u; t++) for (let i = 0; i < l; i++) for (let a = 0; a < c; a++) {
			let o = n === 0 ? r[0] : e[0] + a, s = n === 1 ? r[1] : e[1] + i, c = n === 2 ? r[2] : e[2] + t;
			if (!h(o, s, c)) return !1;
		}
		return !0;
	}, v = 0;
	for (let e = 0; e < c; e++) {
		if (s[e] !== j.Air || l[e] >= 0) continue;
		let t = e % i, c = (e - t) / i % a, m = Math.floor(e / p), h = [
			0,
			1,
			2
		];
		if (r) {
			let e = [
				{
					axis: 0,
					len: g(t, c, m, 0)
				},
				{
					axis: 1,
					len: g(t, c, m, 1)
				},
				{
					axis: 2,
					len: g(t, c, m, 2)
				}
			];
			e.sort((e, t) => t.len - e.len || e.axis - t.axis), h = [
				e[0].axis,
				e[1].axis,
				e[2].axis
			];
		}
		let y = [
			t,
			c,
			m
		], b = [
			1,
			1,
			1
		];
		for (let e of h) for (; _(y, b, e);) b[e]++;
		let x = u.length;
		for (let e = y[2]; e < y[2] + b[2]; e++) for (let t = y[1]; t < y[1] + b[1]; t++) {
			let n = f * t + p * e;
			for (let e = y[0]; e < y[0] + b[0]; e++) l[n + e] = x;
		}
		v += b[0] * b[1] * b[2], u.push({
			x: y[0],
			y: y[1],
			z: y[2],
			w: b[0],
			h: b[1],
			d: b[2]
		});
		let S = [
			b[0],
			b[1],
			b[2]
		].some((e, t) => (t === 0 ? i : t === 1 ? a : o) > 1 && e < n);
		d.push(S ? "fdtd" : "dct");
	}
	let y = 0;
	for (let e of d) e === "fdtd" && y++;
	return {
		boxes: u,
		kinds: d,
		assignment: l,
		coverage: m === 0 ? 1 : v / m,
		coveredCells: v,
		thinBoxCount: y
	};
}
//#endregion
//#region src/compute/ard/fft.ts
var ee = 1 << 26;
function te(e) {
	return Number.isInteger(e) && e >= 1 && e <= 1073741824 && !(e & e - 1);
}
function ne(e, t) {
	let n = 0;
	for (let r = 0; r < t; r++) n = n << 1 | e >>> r & 1;
	return n >>> 0;
}
var U = class {
	inverseUnscaled(e, t) {
		this.forward(t, e);
	}
}, re = class extends U {
	n = 1;
	kind = "identity";
	forward() {}
}, ie = class extends U {
	n;
	kind = "radix2";
	levels;
	cosTable;
	sinTable;
	reversed;
	constructor(e) {
		if (super(), !te(e)) throw Error(`Radix2Fft needs a power of two, got ${e}`);
		this.n = e, this.levels = Math.round(Math.log2(e));
		let t = e >>> 1;
		this.cosTable = new Float64Array(t), this.sinTable = new Float64Array(t);
		for (let n = 0; n < t; n++) this.cosTable[n] = Math.cos(2 * Math.PI * n / e), this.sinTable[n] = Math.sin(2 * Math.PI * n / e);
		this.reversed = new Uint32Array(e);
		for (let t = 0; t < e; t++) this.reversed[t] = ne(t, this.levels);
	}
	forward(e, t) {
		let { n, reversed: r, cosTable: i, sinTable: a } = this;
		if (n !== 1) {
			for (let i = 0; i < n; i++) {
				let n = r[i];
				if (n > i) {
					let r = e[i];
					e[i] = e[n], e[n] = r, r = t[i], t[i] = t[n], t[n] = r;
				}
			}
			for (let r = 2; r <= n; r *= 2) {
				let o = r >>> 1, s = n / r;
				for (let c = 0; c < n; c += r) for (let n = c, r = 0; n < c + o; n++, r += s) {
					let s = n + o, c = i[r], l = a[r], u = e[s] * c + t[s] * l, d = -e[s] * l + t[s] * c;
					e[s] = e[n] - u, t[s] = t[n] - d, e[n] += u, t[n] += d;
				}
			}
		}
	}
}, ae = class extends U {
	n;
	kind = "bluestein";
	m;
	inner;
	cosTable;
	sinTable;
	kernelRe;
	kernelIm;
	scratchRe;
	scratchIm;
	constructor(e) {
		super(), this.n = e;
		let t = 1;
		for (; t < 2 * e - 1;) t *= 2;
		this.m = t, this.inner = new ie(t), this.cosTable = new Float64Array(e), this.sinTable = new Float64Array(e);
		let n = 2 * e;
		for (let t = 0; t < e; t++) {
			let r = Math.PI * (t * t % n) / e;
			this.cosTable[t] = Math.cos(r), this.sinTable[t] = Math.sin(r);
		}
		let r = new Float64Array(t), i = new Float64Array(t);
		r[0] = this.cosTable[0], i[0] = this.sinTable[0];
		for (let n = 1; n < e; n++) r[n] = r[t - n] = this.cosTable[n], i[n] = i[t - n] = this.sinTable[n];
		this.inner.forward(r, i), this.kernelRe = r, this.kernelIm = i, this.scratchRe = new Float64Array(t), this.scratchIm = new Float64Array(t);
	}
	forward(e, t) {
		let { n, m: r, inner: i, cosTable: a, sinTable: o, kernelRe: s, kernelIm: c, scratchRe: l, scratchIm: u } = this;
		l.fill(0), u.fill(0);
		for (let r = 0; r < n; r++) {
			let n = a[r], i = o[r];
			l[r] = e[r] * n + t[r] * i, u[r] = -e[r] * i + t[r] * n;
		}
		i.forward(l, u);
		for (let e = 0; e < r; e++) {
			let t = l[e] * s[e] - u[e] * c[e], n = l[e] * c[e] + u[e] * s[e];
			l[e] = t, u[e] = n;
		}
		i.inverseUnscaled(l, u);
		let d = 1 / r;
		for (let r = 0; r < n; r++) {
			let n = l[r] * d, i = u[r] * d, s = a[r], c = o[r];
			e[r] = n * s + i * c, t[r] = -n * c + i * s;
		}
	}
};
function oe(e) {
	let t = [], n = e;
	for (let e = 2; e <= 7; e++) for (; n % e === 0;) t.push(e), n /= e;
	return n === 1 ? t : null;
}
function se(e) {
	let t = oe(e);
	if (!t) return null;
	let n = 0, r = [];
	for (let e of t) e === 2 ? n++ : r.push(e);
	let i = [];
	for (let e = 0; e + 1 < n; e += 2) i.push(4);
	return n % 2 == 1 && i.push(2), i.concat(r);
}
var ce = class extends U {
	n;
	kind = "mixed-radix";
	stages;
	cos;
	sin;
	scratchRe;
	scratchIm;
	small = /* @__PURE__ */ new Map();
	bufRe;
	bufIm;
	constructor(e, t) {
		super(), this.n = e, this.stages = t, this.cos = new Float64Array(e), this.sin = new Float64Array(e);
		for (let t = 0; t < e; t++) this.cos[t] = Math.cos(2 * Math.PI * t / e), this.sin[t] = Math.sin(2 * Math.PI * t / e);
		this.scratchRe = new Float64Array(e), this.scratchIm = new Float64Array(e);
		let n = 1;
		for (let e of t) {
			if (n = Math.max(n, e), e === 2 || e === 4 || this.small.has(e)) continue;
			let t = new Float64Array(e * e), r = new Float64Array(e * e);
			for (let n = 0; n < e; n++) for (let i = 0; i < e; i++) t[n * e + i] = Math.cos(2 * Math.PI * (n * i % e) / e), r[n * e + i] = Math.sin(2 * Math.PI * (n * i % e) / e);
			this.small.set(e, {
				cos: t,
				sin: r
			});
		}
		this.bufRe = new Float64Array(n), this.bufIm = new Float64Array(n);
	}
	forward(e, t) {
		let { n, stages: r } = this, i = e, a = t, o = this.scratchRe, s = this.scratchIm, c = n, l = 1;
		for (let e = 0; e < r.length; e++) {
			let t = r[e], u = c / t, d = n / c;
			t === 2 ? this.stage2(i, a, o, s, u, l, d) : t === 4 ? this.stage4(i, a, o, s, u, l, d) : this.stageGeneric(i, a, o, s, u, l, d, t);
			let f = i;
			i = o, o = f, f = a, a = s, s = f, c = u, l *= t;
		}
		i !== e && (e.set(i), t.set(a));
	}
	stage2(e, t, n, r, i, a, o) {
		let { cos: s, sin: c } = this;
		for (let l = 0; l < i; l++) {
			let u = l * o, d = s[u], f = c[u], p = a * l, m = a * (l + i), h = a * 2 * l, g = h + a;
			for (let i = 0; i < a; i++) {
				let a = e[p + i], o = t[p + i], s = e[m + i], c = t[m + i];
				n[h + i] = a + s, r[h + i] = o + c;
				let l = a - s, u = o - c;
				n[g + i] = l * d + u * f, r[g + i] = u * d - l * f;
			}
		}
	}
	stage4(e, t, n, r, i, a, o) {
		let { cos: s, sin: c } = this;
		for (let l = 0; l < i; l++) {
			let u = l * o, d = 2 * u, f = 3 * u, p = s[u], m = c[u], h = s[d], g = c[d], _ = s[f], v = c[f], y = a * l, b = y + a * i, x = b + a * i, S = x + a * i, C = a * 4 * l, w = C + a, T = w + a, E = T + a;
			for (let i = 0; i < a; i++) {
				let a = e[y + i], o = t[y + i], s = e[b + i], c = t[b + i], l = e[x + i], u = t[x + i], d = e[S + i], f = t[S + i], D = a + l, O = o + u, k = s + d, A = c + f, j = a - l, M = o - u, N = s - d, P = c - f;
				n[C + i] = D + k, r[C + i] = O + A;
				let F = j + P, I = M - N, L = D - k, R = O - A, z = j - P, B = M + N;
				n[w + i] = F * p + I * m, r[w + i] = I * p - F * m, n[T + i] = L * h + R * g, r[T + i] = R * h - L * g, n[E + i] = z * _ + B * v, r[E + i] = B * _ - z * v;
			}
		}
	}
	stageGeneric(e, t, n, r, i, a, o, s) {
		let { cos: c, sin: l, bufRe: u, bufIm: d } = this, f = this.small.get(s);
		if (!f) throw Error(`no butterfly table for radix ${s}`);
		let p = f.cos, m = f.sin;
		for (let f = 0; f < i; f++) for (let h = 0; h < a; h++) {
			for (let n = 0; n < s; n++) {
				let r = a * (f + i * n) + h;
				u[n] = e[r], d[n] = t[r];
			}
			for (let e = 0; e < s; e++) {
				let t = 0, i = 0, g = e * s;
				for (let e = 0; e < s; e++) {
					let n = p[g + e], r = m[g + e];
					t += u[e] * n + d[e] * r, i += d[e] * n - u[e] * r;
				}
				let _ = f * e * o, v = c[_], y = l[_], b = a * (s * f + e) + h;
				n[b] = t * v + i * y, r[b] = i * v - t * y;
			}
		}
	}
};
function le(e) {
	if (!Number.isInteger(e) || e < 1) throw Error(`FFT length must be a positive integer, got ${e}`);
	if (e > 67108864) throw Error(`FFT length ${e} exceeds the maximum of ${ee}`);
	if (e === 1) return new re();
	if (te(e)) return new ie(e);
	let t = se(e);
	return t ? new ce(e, t) : new ae(e);
}
//#endregion
//#region src/compute/ard/deconvolve.ts
function ue(e) {
	if (!Number.isInteger(e) || e < 1) throw Error(`Expected a positive integer, got ${e}`);
	let t = 1;
	for (; t < e;) t *= 2;
	return t;
}
function de(e, t) {
	return 4 * Math.PI * t * t / e ** 3;
}
function fe(e, t, n, r) {
	if (!(n > 0) || !(r > 0)) throw Error(`calibration2D needs positive dx and c; got ${n}, ${r}`);
	let i = new Float64Array(e), a = t / e, o = 4 * Math.PI * r * r / (n * n * Math.sqrt(r)), s = Math.floor(e / 2);
	for (let t = 0; t <= s; t++) {
		let n = t === 0 ? 0 : o * Math.sqrt(t * a);
		i[t] = n, t > 0 && t < e - t && (i[e - t] = n);
	}
	return i;
}
function pe(e, t, n = {}) {
	let { fLow: r = 0, fHigh: i = Infinity, transition: a = .25 } = n;
	if (!(t > 0)) throw Error(`sampleRate must be positive, got ${t}`);
	if (i <= r) throw Error(`fHigh (${i}) must exceed fLow (${r})`);
	let o = new Float64Array(e), s = t / e, c = Math.floor(e / 2);
	for (let t = 0; t <= c; t++) {
		let n = t * s;
		o[t] = me(n, r, a, !0) * me(n, i, a, !1), t > 0 && t < e - t && (o[e - t] = o[t]);
	}
	return o;
}
function me(e, t, n, r) {
	if (t <= 0) return +!!r;
	if (!Number.isFinite(t)) return +!r;
	if (n <= 0) return r ? +(e >= t) : +(e <= t);
	let i = t / (1 + n), a = t * (1 + n);
	if (e <= i) return +!r;
	if (e >= a) return +!!r;
	let o = (Math.log2(e) - Math.log2(i)) / (Math.log2(a) - Math.log2(i)), s = Math.sin(Math.PI / 2 * o), c = Math.cos(Math.PI / 2 * o);
	return r ? s * s : c * c;
}
function he(e, t) {
	return ue(e + t);
}
var ge = .001;
function _e(e, t, n) {
	let { sampleRate: r, fMax: i, fMin: a = i / 32, regularization: o = ge, transition: s = .25, window: c } = n;
	if (!(r > 0)) throw Error(`sampleRate must be positive, got ${r}`);
	if (!(i > 0)) throw Error(`fMax must be positive, got ${i}`);
	if (!(o > 0)) throw Error(`regularization must be positive, got ${o}`);
	if (e.length === 0) return /* @__PURE__ */ new Float32Array();
	let l = he(e.length, t.length);
	if (c && c.length !== l) throw Error(`window must be ${l} long for these inputs (deconvolveTransformLength), got ${c.length}`);
	let u = le(l), d = new Float64Array(l), f = new Float64Array(l);
	d.set(e), u.forward(d, f);
	let p = new Float64Array(l), m = new Float64Array(l);
	for (let e = 0; e < Math.min(t.length, l); e++) p[e] = t[e];
	u.forward(p, m);
	let h = 0;
	for (let e = 0; e < l; e++) {
		let t = p[e] * p[e] + m[e] * m[e];
		t > h && (h = t);
	}
	if (h === 0) throw Error("The driving pulse is all zeros; there is nothing to deconvolve");
	let g = o * h, _ = pe(l, r, {
		fLow: a,
		fHigh: i,
		transition: s
	});
	for (let e = 0; e < l; e++) {
		let t = p[e] * p[e] + m[e] * m[e] + g, n = (c ? _[e] * c[e] : _[e]) / t, r = (d[e] * p[e] + f[e] * m[e]) * n, i = (f[e] * p[e] - d[e] * m[e]) * n;
		d[e] = r, f[e] = i;
	}
	u.inverseUnscaled(d, f);
	let v = new Float32Array(e.length);
	for (let e = 0; e < v.length; e++) v[e] = d[e] / l;
	return v;
}
function ve(e, t, n, r = .25) {
	if (n.length === 0) throw Error("Need at least one band centre");
	if (!(r > 0) || (1 + r) ** 2 >= 2) throw Error(`transition must be in (0, ${(Math.SQRT2 - 1).toFixed(4)}) so octave transitions do not overlap, got ${r}`);
	for (let e = 1; e < n.length; e++) if (!(n[e] > n[e - 1])) throw Error(`Band centres must increase, got ${n[e - 1]} then ${n[e]}`);
	return n.map((i, a) => pe(e, t, {
		fLow: a === 0 ? 0 : Math.sqrt(n[a - 1] * n[a]),
		fHigh: a === n.length - 1 ? Infinity : Math.sqrt(n[a] * n[a + 1]),
		transition: r
	}));
}
//#endregion
//#region src/compute/ard/resample.ts
function ye(e) {
	let t = e / 2, n = 1, r = 1;
	for (let e = 1; e < 64 && (n *= t / e * (t / e), r += n, !(n < r * 1e-17)); e++);
	return r;
}
function be(e, t) {
	return e <= -1 || e >= 1 ? 0 : ye(t * Math.sqrt(1 - e * e)) / ye(t);
}
function xe(e) {
	if (e === 0) return 1;
	let t = Math.PI * e;
	return Math.sin(t) / t;
}
function Se(e, t, n, r = {}) {
	let { zeroCrossings: i = 16, beta: a = 8 } = r;
	if (!(t > 0) || !(n > 0)) throw Error(`Sample rates must be positive, got ${t} and ${n}`);
	if (!Number.isInteger(i) || i < 1) throw Error(`zeroCrossings must be a positive integer, got ${i}`);
	if (t === n) return e.slice();
	if (e.length === 0) return /* @__PURE__ */ new Float32Array();
	let o = n / t, s = Math.round(e.length * o), c = Math.min(1, o), l = i / c, u = new Float32Array(s), d = e.length - 1;
	for (let t = 0; t < s; t++) {
		let n = t / o, r = Math.max(0, Math.ceil(n - l)), i = Math.min(d, Math.floor(n + l)), s = 0;
		for (let t = r; t <= i; t++) {
			let r = n - t;
			s += e[t] * c * xe(c * r) * be(r / l, a);
		}
		u[t] = s;
	}
	return u;
}
//#endregion
//#region src/compute/ard/dct.ts
var Ce = class {
	dims;
	size;
	axes;
	scratchRe;
	scratchIm;
	inverseScale;
	constructor(e) {
		this.dims = Object.freeze(e.slice());
		let t = 1;
		for (let n of e) t *= n;
		this.size = t;
		let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
		this.axes = [];
		let i = 1, a = 1;
		for (let o = 0; o < e.length; o++) {
			let s = e[o], c = n.get(s);
			c || (c = le(s), n.set(s, c));
			let l = r.get(s);
			if (!l) {
				let e = new Float64Array(s), t = new Float64Array(s);
				for (let n = 0; n < s; n++) {
					let r = Math.PI * n / (2 * s);
					e[n] = Math.cos(r), t[n] = Math.sin(r);
				}
				l = {
					rotCos: e,
					rotSin: t
				}, r.set(s, l);
			}
			this.axes.push({
				n: s,
				stride: i,
				inner: i,
				outer: t / (s * i),
				rotCos: l.rotCos,
				rotSin: l.rotSin,
				fft: c
			}), i *= s, a *= 2 * s;
		}
		this.inverseScale = 1 / a;
		let o = 1;
		for (let t of e) o = Math.max(o, t);
		this.scratchRe = new Float64Array(o), this.scratchIm = new Float64Array(o);
	}
	forward(e, t) {
		this.assertSizes(e, t);
		for (let n = 0; n < this.axes.length; n++) this.forwardAxis(this.axes[n], n === 0 ? e : t, t);
	}
	inverse(e, t) {
		this.assertSizes(t, e);
		for (let n = 0; n < this.axes.length; n++) this.inverseAxis(this.axes[n], n === 0 ? e : t, t);
		let n = this.inverseScale;
		if (n !== 1) for (let e = 0; e < t.length; e++) t[e] *= n;
	}
	assertSizes(e, t) {
		if (e.length !== this.size || t.length !== this.size) throw Error(`DCT plan is ${this.dims.join("x")} (${this.size} samples); got ${e.length} and ${t.length}`);
	}
	forwardAxis(e, t, n) {
		let { n: r, stride: i, inner: a, outer: o, rotCos: s, rotSin: c, fft: l } = e, u = this.scratchRe, d = this.scratchIm, f = r + 1 >> 1, p = r >> 1, m = r * i;
		for (let e = 0; e < o; e++) {
			let o = e * m;
			for (let e = 0; e < a; e++) {
				let a = o + e;
				for (let e = 0; e < f; e++) u[e] = t[a + 2 * e * i];
				for (let e = 0; e < p; e++) u[r - 1 - e] = t[a + (2 * e + 1) * i];
				d.fill(0, 0, r), l.forward(u, d);
				for (let e = 0; e < r; e++) n[a + e * i] = 2 * (u[e] * s[e] + d[e] * c[e]);
			}
		}
	}
	inverseAxis(e, t, n) {
		let { n: r, stride: i, inner: a, outer: o, rotCos: s, rotSin: c, fft: l } = e, u = this.scratchRe, d = this.scratchIm, f = r + 1 >> 1, p = r >> 1, m = r * i;
		for (let e = 0; e < o; e++) {
			let o = e * m;
			for (let e = 0; e < a; e++) {
				let a = o + e;
				for (let e = 0; e < r; e++) {
					let n = t[a + e * i], o = e === 0 ? 0 : t[a + (r - e) * i], l = s[e], f = c[e];
					u[e] = .5 * (n * l + o * f), d[e] = .5 * (n * f - o * l);
				}
				l.inverseUnscaled(u, d);
				for (let e = 0; e < f; e++) n[a + 2 * e * i] = 2 * u[e];
				for (let e = 0; e < p; e++) n[a + (2 * e + 1) * i] = 2 * u[r - 1 - e];
			}
		}
	}
};
function we(e) {
	if (e.length === 0) throw Error("DCT plan needs at least one axis");
	for (let t of e) if (!Number.isInteger(t) || t < 1) throw Error(`DCT extents must be positive integers, got [${e.join(", ")}]`);
	return new Ce(e);
}
//#endregion
//#region src/compute/ard/dct-partition.ts
var Te = class extends _ {
	kind = "dct";
	includeSelfTerms = !0;
	pressure;
	plan;
	modes;
	prevModes;
	forceModes;
	cosWdt;
	forceCoef;
	constructor(e) {
		super(e), this.plan = we(this.dims), this.pressure = new Float64Array(this.size), this.modes = new Float64Array(this.size), this.prevModes = new Float64Array(this.size), this.forceModes = new Float64Array(this.size), this.cosWdt = new Float64Array(this.size), this.forceCoef = new Float64Array(this.size);
		let { nx: t, ny: n, nz: r, dx: i, c: a, dt: o } = this, s = t * i, c = n * i, l = r * i;
		for (let e = 0; e < r; e++) {
			let r = e / l;
			for (let i = 0; i < n; i++) {
				let l = i / c, u = t * (i + n * e);
				for (let e = 0; e < t; e++) {
					let t = e / s, n = a * Math.PI * Math.sqrt(t * t + l * l + r * r), i = u + e, c = Math.cos(n * o);
					this.cosWdt[i] = c, this.forceCoef[i] = n > 0 ? 2 * (1 - c) / (n * n) : o * o;
				}
			}
		}
	}
	step() {
		let { plan: e, force: t, forceModes: n, cosWdt: r, forceCoef: i, size: a } = this;
		e.forward(t, n);
		let o = this.modes, s = this.prevModes;
		for (let e = 0; e < a; e++) s[e] = 2 * o[e] * r[e] - s[e] + n[e] * i[e];
		this.modes = s, this.prevModes = o, e.inverse(this.modes, this.pressure), this.clearForce();
	}
	scaleState(e) {
		for (let t = 0; t < this.size; t++) this.modes[t] *= e, this.prevModes[t] *= e, this.pressure[t] *= e;
	}
	modalEnergy() {
		let e = 0;
		for (let t = 0; t < this.size; t++) {
			let n = this.modes[t], r = this.prevModes[t];
			e += n * n + r * r - 2 * this.cosWdt[t] * n * r;
		}
		return e;
	}
	angularFrequency(e, t = 0, n = 0) {
		let r = e / (this.nx * this.dx), i = t / (this.ny * this.dx), a = n / (this.nz * this.dx);
		return this.c * Math.PI * Math.sqrt(r * r + i * i + a * a);
	}
	maxPhaseAdvance() {
		return this.angularFrequency(this.nx - 1, this.ny - 1, this.nz - 1) * this.dt;
	}
	setPressure(e) {
		if (e.length !== this.size) throw Error(`Expected ${this.size} samples, got ${e.length}`);
		this.pressure.set(e), this.plan.forward(this.pressure, this.modes), this.prevModes.set(this.modes);
	}
}, Ee = class extends _ {
	kind = "fdtd";
	includeSelfTerms = !1;
	pressure;
	p;
	pNew;
	pOld;
	constructor(e) {
		if (super(e), this.pressure = new Float64Array(this.size), this.p = new Float64Array(this.size), this.pNew = new Float64Array(this.size), this.pOld = new Float64Array(this.size), this.courant > this.cflLimit) throw Error(`FDTD partition is CFL-unstable: Courant ${this.courant.toFixed(3)} exceeds ${this.cflLimit.toFixed(3)} for rank ${this.rank}. Reduce dt, or use a DctPartition, which has no CFL limit.`);
	}
	get cflLimit() {
		return y(this.rank);
	}
	step() {
		let { nx: e, ny: t, nz: n, dx: r, c: i, dt: a, force: o, p: s, pOld: c, pNew: l } = this, u = 1 / (180 * r * r), d = i * i * a * a, f = a * a, p = e, m = e * t;
		for (let r = 0; r < n; r++) for (let i = 0; i < t; i++) {
			let a = e * (i + t * r);
			for (let h = 0; h < e; h++) {
				let g = a + h, _ = 0;
				for (let a = 0; a < 7; a++) {
					let o = a - 3, c = v[a];
					if (e > 1) {
						let t = h + o;
						t >= 0 && t < e && (_ += c * s[g + o]);
					}
					if (t > 1) {
						let e = i + o;
						e >= 0 && e < t && (_ += c * s[g + o * p]);
					}
					if (n > 1) {
						let e = r + o;
						e >= 0 && e < n && (_ += c * s[g + o * m]);
					}
				}
				_ *= u, l[g] = 2 * s[g] - c[g] + d * _ + f * o[g];
			}
		}
		this.pOld = s, this.p = l, this.pNew = c, this.pressure.set(this.p), this.clearForce();
	}
	scaleState(e) {
		for (let t = 0; t < this.size; t++) this.p[t] *= e, this.pOld[t] *= e, this.pressure[t] *= e;
	}
	setPressure(e) {
		if (e.length !== this.size) throw Error(`Expected ${this.size} samples, got ${e.length}`);
		this.p.set(e), this.pOld.set(e), this.pressure.set(e);
	}
}, W = [
	"x",
	"y",
	"z"
], G = [
	"w",
	"h",
	"d"
];
function K(e, t, n) {
	return n ? e[W[t]] + e[G[t]] : e[W[t]] - 1;
}
function De(e, t, n, r) {
	let { nx: i, ny: a, nz: o, cells: s } = e, [c, l] = S(n), u = t[G[c]], d = t[G[l]], f = t[W[c]], p = t[W[l]], m = K(t, n, r), h = (e, t, n) => e + i * (t + a * n), g = (e, t, n) => e >= 0 && t >= 0 && n >= 0 && e < i && t < a && n < o, _ = new Uint8Array(u * d), v = 0, y = [
		0,
		0,
		0
	];
	for (let e = 0; e < d; e++) for (let t = 0; t < u; t++) y[n] = m, y[c] = f + t, y[l] = p + e, g(y[0], y[1], y[2]) && s[h(y[0], y[1], y[2])] === j.Air || (_[t + u * e] = j.Air, v++);
	return v === 0 ? [] : H({
		nx: u,
		ny: d,
		nz: 1,
		dx: e.dx,
		origin: {
			x: 0,
			y: 0,
			z: 0
		},
		cells: _,
		surfaceOf: new Int32Array(u * d).fill(-1),
		airCount: v,
		solidCount: u * d - v,
		leaked: !1,
		warnings: []
	}, { minBoxEdge: 1 }).boxes.map((e) => ({
		uMin: f + e.x,
		uMax: f + e.x + e.w,
		vMin: p + e.y,
		vMax: p + e.y + e.h
	}));
}
function Oe(e, t, n, r, i) {
	let [a, o] = S(t), s = K(r, t, n), c = /* @__PURE__ */ new Map(), l = [
		0,
		0,
		0
	];
	for (let n = i.vMin; n < i.vMax; n++) for (let r = i.uMin; r < i.uMax; r++) {
		if (l[t] = s, l[a] = r, l[o] = n, l[0] < 0 || l[1] < 0 || l[2] < 0 || l[0] >= e.nx || l[1] >= e.ny || l[2] >= e.nz) continue;
		let i = e.surfaceOf[l[0] + e.nx * (l[1] + e.ny * l[2])];
		i >= 0 && c.set(i, (c.get(i) ?? 0) + 1);
	}
	let u = 0, d = -1;
	for (let [e, t] of c) t > u && (u = t, d = e);
	return d;
}
//#endregion
//#region src/compute/ard/boundaries-from-grid.ts
function ke(e, t, n = {}) {
	let { absorptionFor: r } = n, i = [
		e.nx,
		e.ny,
		e.nz
	], a = [], o = [], s = 0, c = 0, l = 0;
	for (let n = 0; n < t.boxes.length; n++) {
		let o = t.boxes[n];
		for (let t = g.X; t <= g.Z; t++) if (!(i[t] <= 1)) for (let i of [!1, !0]) for (let u of De(e, o, t, i)) {
			let d = Oe(e, t, i, o, u), f = r ? r(d) : 1;
			if (r && f <= 1e-6) {
				c++;
				continue;
			}
			a.push({
				boxIndex: n,
				axis: t,
				high: i,
				surfaceIndex: d,
				...u
			}), s += (u.uMax - u.uMin) * (u.vMax - u.vMin), l = Math.max(l, Math.min(1, f));
		}
	}
	return a.length === 0 && c > 0 && o.push(`No impedance boundaries were built: all ${c} faces have materials that absorb nothing, so every surface is rigid.`), {
		faces: a,
		warnings: o,
		boundaryCells: s,
		skippedRigid: c,
		maxAbsorption: l
	};
}
function Ae(e, t, n) {
	let { absorptionFor: r } = n, i = [], a = [];
	for (let n of e.faces) {
		let e = t[n.boxIndex];
		if (!e) throw Error(`Impedance plan refers to box ${n.boxIndex}, but only ${t.length} partitions were given. The partition list must be in decomposition order.`);
		let o = r(n.surfaceIndex), s = h(o);
		if (!Number.isFinite(s)) {
			a.push(`Surface ${n.surfaceIndex} absorbs nothing at build time though the plan expected it to; that face is rigid.`);
			continue;
		}
		i.push(new D({
			partition: e,
			axis: n.axis,
			high: n.high,
			uMin: n.uMin,
			uMax: n.uMax,
			vMin: n.vMin,
			vMax: n.vMax,
			impedance: s
		}));
	}
	return {
		boundaries: i,
		warnings: a
	};
}
//#endregion
//#region src/compute/ard/pml-partition.ts
var q = .95, je = class extends _ {
	kind = "pml";
	includeSelfTerms = !1;
	axis;
	sigmaMax;
	gradingExponent;
	sigma;
	pressure;
	p;
	pNew;
	pOld;
	phi;
	phiNew;
	constructor(e) {
		super(e);
		let { axis: t, increasing: n, sigmaMax: r, gradingExponent: i = 2 } = e;
		if (r < 0) throw Error(`sigmaMax must be >= 0, got ${r}`);
		this.axis = t, this.sigmaMax = r, this.gradingExponent = i;
		let a = this.dims[t];
		this.sigma = new Float64Array(a);
		for (let e = 0; e < a; e++) {
			let t = n ? (e + .5) / a : (a - .5 - e) / a;
			this.sigma[e] = r * t ** +i;
		}
		if (this.courant > this.cflLimit) throw Error(`PML partition is CFL-unstable: Courant ${this.courant.toFixed(3)} exceeds ${this.cflLimit.toFixed(3)} for rank ${this.rank}. The damped 6th-order update carries the same limit as an FDTD partition, less a ${5.000000000000004.toFixed(0)}% margin. Reduce dt — a DctPartition interior has no CFL limit, so the wall slab, not the room, sets the time step.`);
		this.pressure = new Float64Array(this.size), this.p = new Float64Array(this.size), this.pNew = new Float64Array(this.size), this.pOld = new Float64Array(this.size), this.phi = [
			new Float64Array(this.size),
			new Float64Array(this.size),
			new Float64Array(this.size)
		], this.phiNew = [
			new Float64Array(this.size),
			new Float64Array(this.size),
			new Float64Array(this.size)
		];
	}
	get cflLimit() {
		return q * y(this.rank);
	}
	sigmaAt(e) {
		return this.sigma[e] ?? 0;
	}
	axisCoord(e, t, n) {
		return this.axis === g.X ? e : this.axis === g.Y ? t : n;
	}
	step() {
		let { nx: e, ny: t, nz: n, dx: r, c: i, dt: a, force: o, p: s, pOld: c, pNew: l, phi: u, phiNew: d, sigma: f } = this, p = [
			1,
			e,
			e * t
		], m = [
			e,
			t,
			n
		], h = 1 / (180 * r * r), g = 1 / (12 * r), _ = i * i, y = a * a;
		for (let r = 0; r < n; r++) for (let n = 0; n < t; n++) {
			let i = e * (n + t * r);
			for (let t = 0; t < e; t++) {
				let e = i + t, d = [
					t,
					n,
					r
				], b = f[this.axisCoord(t, n, r)], S = 0, C = 0;
				for (let t = 0; t < 3; t++) {
					if (m[t] <= 1) continue;
					let n = p[t];
					for (let r = 0; r < 7; r++) {
						let i = r - 3, a = d[t] + i;
						a >= 0 && a < m[t] && (S += v[r] * s[e + i * n]);
					}
					for (let r = 0; r < 5; r++) {
						let i = r - 2, a = d[t] + i;
						a >= 0 && a < m[t] && (C += x[r] * u[t][e + i * n]);
					}
				}
				S *= h, C *= g;
				let w = (s[e] - c[e]) / a;
				l[e] = 2 * s[e] - c[e] + y * (_ * S + o[e] - b * w + C);
			}
		}
		for (let r = 0; r < n; r++) for (let n = 0; n < t; n++) {
			let i = e * (n + t * r);
			for (let t = 0; t < e; t++) {
				let e = i + t, o = [
					t,
					n,
					r
				], s = f[this.axisCoord(t, n, r)];
				for (let t = 0; t < 3; t++) {
					if (m[t] <= 1) {
						d[t][e] = 0;
						continue;
					}
					let n = p[t], r = 0;
					for (let i = 0; i < 5; i++) {
						let a = i - 2, s = o[t] + a;
						s >= 0 && s < m[t] && (r += x[i] * l[e + a * n]);
					}
					r *= g, d[t][e] = t === this.axis ? u[t][e] - a * s * (u[t][e] + _ * r) : u[t][e] + a * s * _ * r;
				}
			}
		}
		for (let e = 0; e < 3; e++) {
			let t = u[e];
			u[e] = d[e], d[e] = t;
		}
		this.pOld = s, this.p = l, this.pNew = c, this.pressure.set(this.p), this.clearForce();
	}
	scaleState(e) {
		for (let t = 0; t < this.size; t++) this.p[t] *= e, this.pOld[t] *= e, this.pressure[t] *= e;
		for (let t = 0; t < 3; t++) {
			let n = this.phi[t];
			for (let t = 0; t < this.size; t++) n[t] *= e;
		}
	}
	setPressure(e) {
		if (e.length !== this.size) throw Error(`Expected ${this.size} samples, got ${e.length}`);
		this.p.set(e), this.pOld.set(e), this.pressure.set(e);
	}
};
//#endregion
//#region src/compute/ard/wall.ts
function Me(e) {
	if (!(e >= 0) || e > 1) throw Error(`Absorption coefficient must be in [0, 1], got ${e}`);
	return Math.sqrt(1 - e);
}
function Ne(e) {
	if (!(e >= 0) || e > 1) throw Error(`Reflection magnitude must be in [0, 1], got ${e}`);
	return 1 - e * e;
}
var J = {
	thickness: 20,
	gradingExponent: 2,
	courant: .4
};
function Pe(e, t = J) {
	let { thickness: n, gradingExponent: r, courant: i } = t, a = .05, o = i * a / 343, s = 256;
	for (; s < 8 * n;) s *= 2;
	let c = s >> 1, l = s - (s >> 2), u = (l - c) / i, d = (c + l) / i, f = u + 2 * (s - l) / i, p = 2 * n / i, m = d - 100, h = Math.ceil(m), _ = new Te({
		box: {
			x: 0,
			y: 0,
			z: 0,
			w: s,
			h: 1,
			d: 1
		},
		dx: a,
		c: 343,
		dt: o
	}), v = new je({
		box: {
			x: s,
			y: 0,
			z: 0,
			w: n,
			h: 1,
			d: 1
		},
		dx: a,
		c: 343,
		dt: o,
		axis: g.X,
		increasing: !0,
		sigmaMax: e * 343 / a,
		gradingExponent: r
	}), y = new Float64Array(s);
	for (let e = 0; e < s; e++) y[e] = Math.exp(-.5 * ((e - c) / 4) ** 2);
	_.setPressure(y);
	let b = E([_, v]), x = new Float64Array(h);
	for (let e = 0; e < h; e++) C(b, 343, a), _.step(), v.step(), x[e] = _.pressure[l];
	let S = (e, t) => {
		let n = 0, r = Math.max(0, Math.floor(e)), i = Math.min(h, Math.ceil(t));
		for (let e = r; e < i; e++) n = Math.max(n, Math.abs(x[e]));
		return n;
	}, w = S(u - 60, u + 100), T = S(f - 40, Math.min(m, f + p + 400));
	return !(w > 0) || !Number.isFinite(T) ? NaN : T / w;
}
var Fe = /* @__PURE__ */ new Map();
function Ie(e) {
	return `${e.thickness}|${e.gradingExponent}|${e.courant}`;
}
function Le(e = J) {
	let t = Ie(e), n = Fe.get(t);
	if (n) return n;
	let r = [0], i = [Math.min(1, Pe(0, e))];
	for (let t = .004; t <= 8; t *= 1.3) {
		let n = Pe(t, e);
		if (!Number.isFinite(n)) break;
		r.push(t), i.push(n);
	}
	let a = 0;
	for (let e = 1; e < i.length; e++) i[e] < i[a] && (a = e);
	let o = [r[0]], s = [i[0]];
	for (let e = 1; e <= a; e++) i[e] < s[s.length - 1] && (o.push(r[e]), s.push(i[e]));
	let c = {
		calibration: e,
		sigmaHat: Float64Array.from(o),
		reflection: Float64Array.from(s),
		minReflection: s[s.length - 1],
		maxAbsorption: Ne(Math.min(1, s[s.length - 1]))
	};
	return Fe.set(t, c), c;
}
function Re(e, t = J) {
	if (!(e >= 0) || e > 1) throw Error(`Reflection magnitude must be in [0, 1], got ${e}`);
	let n = Le(t), { sigmaHat: r, reflection: i } = n;
	if (e >= i[0]) return 0;
	if (e < n.minReflection) throw Error(`A ${t.thickness}-cell PML at grading ${t.gradingExponent} reaches |R| = ${n.minReflection.toFixed(4)} at best (alpha <= ${n.maxAbsorption.toFixed(4)}); ${e.toFixed(4)} was requested. Use a thicker layer.`);
	for (let t = 1; t < i.length; t++) if (e >= i[t]) {
		let n = Math.log(Math.max(i[t - 1], 1e-12)), a = Math.log(Math.max(i[t], 1e-12)), o = (Math.log(e) - n) / (a - n);
		return r[t - 1] + o * (r[t] - r[t - 1]);
	}
	return r[r.length - 1];
}
function ze(e, t = J) {
	return Re(Me(e), t);
}
function Be(e) {
	let { box: t, axis: n, high: r, alpha: i, dx: a, c: o, dt: s, thickness: c = J.thickness, gradingExponent: l = J.gradingExponent } = e, u = o * s / a, d = w(n === g.X ? c : t.w, n === g.Y ? c : t.h, n === g.Z ? c : t.d), f = q * y(d);
	if (u > f) throw Error(`A wall on this face is a rank-${d} PML slab, limited to Courant ${f.toFixed(3)}, but dt gives ${u.toFixed(3)}. The wall slab sets the time step for the whole simulation — DctPartition interiors have no CFL limit — so reduce dt rather than the layer thickness.`);
	let p = ze(i, {
		thickness: c,
		gradingExponent: l,
		courant: u
	}), m = [
		"x",
		"y",
		"z"
	], h = [
		"w",
		"h",
		"d"
	], _ = { ...t };
	return _[h[n]] = c, _[m[n]] = r ? t[m[n]] + t[h[n]] : t[m[n]] - c, new je({
		box: _,
		dx: a,
		c: o,
		dt: s,
		axis: n,
		increasing: r,
		sigmaMax: p * o / a,
		gradingExponent: l
	});
}
//#endregion
//#region src/compute/ard/walls-from-grid.ts
var Y = [
	"x",
	"y",
	"z"
], X = [
	"w",
	"h",
	"d"
], Ve = [
	20,
	16,
	12,
	8,
	6,
	4
], He = 4, Ue = 1e-6;
function We(e = 8) {
	return e + 1;
}
function Ge(e, t, n = {}) {
	let { maxThickness: r = 8, absorptionFor: i } = n, { nx: a, ny: o, nz: s, cells: c } = e, l = [
		a,
		o,
		s
	], u = [], d = [], f = new Uint8Array(a * o * s), p = 0, m = 0, h = 0, _ = (e, t, n) => e + a * (t + o * n), v = (e, t, n) => e >= 0 && t >= 0 && n >= 0 && e < a && t < o && n < s;
	for (let n = 0; n < t.boxes.length; n++) {
		let a = t.boxes[n];
		for (let t = g.X; t <= g.Z; t++) if (!(l[t] <= 1)) for (let o of [!1, !0]) {
			let [s, l] = S(t), g = K(a, t, o), y = o ? 1 : -1, b = De(e, a, t, o);
			for (let x of b) {
				let b = x.uMax - x.uMin, S = x.vMax - x.vMin, C = 0;
				grow: for (let e = 0; e < r; e++) {
					for (let n = x.vMin; n < x.vMax; n++) for (let r = x.uMin; r < x.uMax; r++) {
						let i = [
							0,
							0,
							0
						];
						if (i[t] = g + y * e, i[s] = r, i[l] = n, !v(i[0], i[1], i[2])) break grow;
						let a = _(i[0], i[1], i[2]);
						if (c[a] === j.Air || f[a]) break grow;
					}
					C = e + 1;
				}
				let w = Ve.find((e) => e <= C) ?? 0;
				if (w < He) {
					m++, d.push(`A wall face of box ${n} on ${o ? "+" : "-"}${"xyz"[t]} has only ${C} cells of solid behind it, below the ${He} an absorbing layer needs, so that face is left rigid. Voxelize with padCells >= ${r + 1} to give the slabs room.`);
					continue;
				}
				let T = Oe(e, t, o, a, x);
				if (i && i(T) <= Ue) {
					h++;
					continue;
				}
				for (let e = 0; e < w; e++) for (let n = x.vMin; n < x.vMax; n++) for (let r = x.uMin; r < x.uMax; r++) {
					let i = [
						0,
						0,
						0
					];
					i[t] = g + y * e, i[s] = r, i[l] = n, f[_(i[0], i[1], i[2])] = 1;
				}
				let E = {
					x: 0,
					y: 0,
					z: 0,
					w: 1,
					h: 1,
					d: 1
				};
				E[Y[t]] = o ? g : g - (w - 1), E[X[t]] = w, E[Y[s]] = x.uMin, E[X[s]] = b, E[Y[l]] = x.vMin, E[X[l]] = S, u.push({
					boxIndex: n,
					axis: t,
					high: o,
					box: E,
					thickness: w,
					surfaceIndex: T
				}), p += E.w * E.h * E.d;
			}
		}
	}
	return {
		faces: u,
		warnings: d,
		slabCells: p,
		droppedForSpace: m,
		skippedRigid: h
	};
}
function Ke(e, t) {
	let { dx: n, c: r, dt: i, absorptionFor: a, gradingExponent: o = 2 } = t, s = [], c = [];
	for (let t of e.faces) {
		let e = a(t.surfaceIndex);
		try {
			s.push(Be({
				box: qe(t),
				axis: t.axis,
				high: t.high,
				alpha: e,
				dx: n,
				c: r,
				dt: i,
				thickness: t.thickness,
				gradingExponent: o
			}));
		} catch (n) {
			c.push(`Could not build a wall for surface ${t.surfaceIndex} at alpha ${e.toFixed(3)}: ${n instanceof Error ? n.message : String(n)}`);
		}
	}
	return {
		partitions: s,
		warnings: c
	};
}
function qe(e) {
	let t = { ...e.box };
	return t[X[e.axis]] = 0, t[Y[e.axis]] = e.high ? e.box[Y[e.axis]] : e.box[Y[e.axis]] + e.box[X[e.axis]], t;
}
//#endregion
//#region src/compute/ard/simulation.ts
function Je(e) {
	let { grid: t, decomposition: n, c: r, courant: i = .4, steps: a, duration: o, absorptionFor: s = () => 0, walls: c = !0, wallThickness: l = 8, boundary: u = "impedance", fMax: d } = e, f = [], p = t.dx;
	if (!(r > 0)) throw Error(`Speed of sound must be positive, got ${r}`);
	if (a === void 0 == (o === void 0)) throw Error("Pass exactly one of steps or duration");
	if (a !== void 0 && (!Number.isInteger(a) || a < 1)) throw Error(`steps must be a positive integer, got ${a}`);
	if (o !== void 0 && !(o > 0)) throw Error(`duration must be positive, got ${o}`);
	if (n.boxes.length === 0) throw Error("Decomposition has no boxes; there is nothing to simulate");
	let m = u === "pml";
	if (u !== "pml" && u !== "impedance") throw Error(`Unknown boundary ${String(u)}; expected 'impedance' or 'pml'`);
	let h = c && m ? Ge(t, n, {
		maxThickness: l,
		absorptionFor: s
	}) : {
		faces: [],
		warnings: [],
		slabCells: 0,
		droppedForSpace: 0,
		skippedRigid: 0
	};
	f.push(...h.warnings);
	let g = c && !m ? ke(t, n, { absorptionFor: s }) : {
		faces: [],
		warnings: [],
		boundaryCells: 0,
		skippedRigid: 0,
		maxAbsorption: 0
	};
	if (f.push(...g.warnings), c && m && h.faces.length === 0 && h.droppedForSpace > 0) throw Error(`Walls were requested but all ${h.droppedForSpace} faces were dropped for lack of solid to grow into, so every room surface would be perfectly rigid. Voxelize with padCells >= ${We(l)} (currently the grid has too few), pass boundary: 'impedance' (which needs no padding at all), or pass walls: false if a rigid room is what you meant.`);
	if (h.faces.length > 0 && f.push("Using PML wall slabs. Slabs are clipped to their own face so no cell is inside two, which leaves the room's twelve edges and eight corners reflecting — measured as a reverberation time about 4.7x longer than Eyring predicts on a 3D shoebox. Prefer boundary: 'impedance', which has no corner to leave."), c && m && h.faces.length === 0 && f.push(`No wall slabs were built: all ${h.skippedRigid} faces have materials that absorb nothing, so every surface is rigid. The simulation runs without the PML CFL limit as a result.`), g.faces.length > 0 && d !== void 0 && d > 0) {
		let e = r / (d * p);
		e < 4 && f.push(`The grid carries ${e.toFixed(1)} cells per wavelength at ${d} Hz, below the 4 an impedance boundary needs to deliver the absorption it was asked for. Surfaces will be more reflective than their materials in the top octave of the run. Raise cellsPerWavelength, or lower fMax.`);
	}
	let _ = w(t.nx, t.ny, t.nz), v = h.faces.length > 0 ? q * y(_) : Infinity, x = n.kinds.includes("fdtd") ? y(_) : Infinity, S = g.faces.length > 0 ? b(g.maxAbsorption) : Infinity, C = Math.min(i, v, x, S);
	if (C < i) {
		let e = C === S ? `impedance boundaries at alpha up to ${g.maxAbsorption.toFixed(2)} are stable to here and no further` : `the ${v <= x ? "wall slabs" : "FDTD partitions"} are rank ${_} and cannot run faster`;
		f.push(`Courant reduced from ${i} to ${C.toFixed(3)}: ${e}. DCT interiors have no such limit, but every partition shares a time step.`);
	}
	let T = C * p / r;
	return {
		dt: T,
		courant: C,
		steps: a ?? Math.max(1, Math.ceil(o / T)),
		gridRank: _,
		wallPlan: h,
		impedancePlan: g,
		warnings: f
	};
}
function Ye(e) {
	let { grid: t, decomposition: n, c: r, sources: i, receivers: a, airAbsNepersPerMetre: o = 0, absorptionFor: s = () => 0, frameInterval: c = 0, sliceAxis: l = "z", sliceIndex: u } = e, d = t.dx, f = Je(e), { dt: p, courant: m, steps: h, wallPlan: _, impedancePlan: v } = f, y = [...f.warnings], b = n.boxes.map((e, t) => n.kinds[t] === "dct" ? new Te({
		box: e,
		dx: d,
		c: r,
		dt: p
	}) : new Ee({
		box: e,
		dx: d,
		c: r,
		dt: p
	})), x = [];
	if (_.faces.length > 0) {
		let e = Ke(_, {
			dx: d,
			c: r,
			dt: p,
			absorptionFor: s
		});
		x = e.partitions, y.push(...e.warnings);
	}
	let S = [...b, ...x], w = E(S), D = [];
	if (v.faces.length > 0) {
		let e = Ae(v, b, { absorptionFor: s });
		D = e.boundaries, y.push(...e.warnings);
	}
	let O = b.reduce((e, t) => e + t.box.w * t.box.h * t.box.d, 0), k = x.reduce((e, t) => e + t.box.w * t.box.h * t.box.d, 0);
	k > O && y.push(`Wall slabs add ${k} cells against the room's ${O} (${(k / O).toFixed(1)}x) — the simulation is mostly wall. Absorbing layers are expensive in cells; a locally-reacting impedance boundary would cost none.`);
	let A = (e, r) => {
		let [i, a, o] = e;
		if (i < 0 || a < 0 || o < 0 || i >= t.nx || a >= t.ny || o >= t.nz) throw Error(`${r} at cell (${i}, ${a}, ${o}) is outside the grid`);
		let s = i + t.nx * (a + t.ny * o);
		if (t.cells[s] !== j.Air) throw Error(`${r} at cell (${i}, ${a}, ${o}) is inside a wall, not in the room`);
		let c = n.assignment[s];
		if (c < 0) throw Error(`${r} at cell (${i}, ${a}, ${o}) is in air no partition covers`);
		let l = b[c];
		return {
			partition: l,
			local: [
				i - l.box.x,
				a - l.box.y,
				o - l.box.z
			]
		};
	}, M = i.map((e, t) => A(e.cell, `Source ${t}`)), N = a.map((e, t) => A(e.cell, `Receiver ${t}`)), P = l === "x" ? g.X : l === "y" ? g.Y : g.Z, F = [
		t.nx,
		t.ny,
		t.nz
	], I = u ?? Math.floor(F[P] / 2), [L, R] = P === g.X ? [t.ny, t.nz] : P === g.Y ? [t.nx, t.nz] : [t.nx, t.ny], z = o > 0 ? Math.exp(-o * r * p) : 1, B = new Float32Array(a.length), V = 0, H = {
		dt: p,
		courant: m,
		steps: h,
		partitions: S,
		interfaces: w,
		wallPlan: _,
		impedancePlan: v,
		cellCount: {
			room: O,
			walls: k,
			boundary: D.reduce((e, t) => e + t.cellCount, 0)
		},
		warnings: y,
		get currentStep() {
			return V;
		},
		step() {
			C(w, r, d), T(D);
			for (let e = 0; e < M.length; e++) {
				let t = i[e].signal;
				if (V >= t.length) continue;
				let n = t[V];
				if (n === 0) continue;
				let { partition: r, local: a } = M[e];
				r.addForce(a[0], a[1], a[2], n);
			}
			for (let e of S) e.step();
			if (z !== 1) for (let e of b) e.scaleState(z);
			for (let e = 0; e < N.length; e++) {
				let { partition: t, local: n } = N[e];
				B[e] = t.pressureAt(n[0], n[1], n[2]);
			}
			let e = V;
			V++;
			let t = c > 0 && e % c === 0;
			return {
				step: e,
				receiverSamples: B.slice(),
				slice: t ? ee() : void 0
			};
		},
		run() {
			let e = a.map(() => new Float32Array(h));
			for (; V < h;) {
				let t = H.step();
				for (let n = 0; n < a.length; n++) e[n][t.step] = t.receiverSamples[n];
			}
			return e;
		},
		dispose() {
			for (let e of S) e.dispose();
			for (let e of D) e.reset();
		}
	};
	function ee() {
		let e = new Float32Array(L * R);
		for (let t of b) {
			let n = t.box, r = [
				n.x,
				n.y,
				n.z
			][P], i = r + [
				n.w,
				n.h,
				n.d
			][P];
			if (!(I < r || I >= i)) for (let r = n.z; r < n.z + n.d; r++) for (let i = n.y; i < n.y + n.h; i++) for (let a = n.x; a < n.x + n.w; a++) {
				if ([
					a,
					i,
					r
				][P] !== I) continue;
				let o = P === g.X ? i : (g.Y, a), s = P === g.X || P === g.Y ? r : i;
				e[o + L * s] = t.pressureAt(a - n.x, i - n.y, r - n.z);
			}
		}
		return e;
	}
	return H;
}
function Xe(e, t, n) {
	let r = 1 / (2 * Math.PI * n), i = 4 * r, a = new Float32Array(e), o = 0;
	for (let n = 0; n < e; n++) {
		let e = n * t - i, s = -(e / r) * Math.exp(-.5 * (e / r) ** 2);
		a[n] = s, o += s;
	}
	let s = e > 0 ? o / e : 0;
	if (s !== 0) for (let t = 0; t < e; t++) a[t] -= s;
	return a;
}
//#endregion
//#region src/compute/ard/grid-slice.ts
function Z(e) {
	return e === "xz" ? 1 : 2;
}
function Ze(e, t, n) {
	let { nx: r, ny: i, nz: a } = e, o = t === 1 ? i : a;
	if (!Number.isInteger(n) || n < 0 || n >= o) throw Error(`Slice index ${n} is outside the grid's ${o} layers on axis ${t}`);
	let s = t === 1 ? 1 : i, c = t === 2 ? 1 : a, l = r * s * c, u = new Uint8Array(l), d = new Int32Array(l).fill(-1), f = 0;
	for (let a = 0; a < c; a++) for (let o = 0; o < s; o++) for (let c = 0; c < r; c++) {
		let l = t === 1 ? c + r * (n + i * a) : c + r * (o + i * n), p = c + r * (o + s * a);
		u[p] = e.cells[l], d[p] = e.surfaceOf[l], u[p] === j.Air && f++;
	}
	let p = { ...e.origin };
	return t === 1 ? p.y = e.origin.y + n * e.dx : p.z = e.origin.z + n * e.dx, {
		nx: r,
		ny: s,
		nz: c,
		dx: e.dx,
		origin: p,
		cells: u,
		surfaceOf: d,
		airCount: f,
		solidCount: l - f,
		leaked: e.leaked,
		warnings: [...e.warnings]
	};
}
function Qe(e, t, n) {
	let r = t === 1 ? e.ny : e.nz, i = t === 1 ? e.origin.y : e.origin.z, a = Math.round((n - i) / e.dx), o = Math.min(r - 1, Math.max(0, a));
	return {
		index: o,
		clamped: o !== a
	};
}
function $e(e, t, n) {
	let { nx: r, ny: i, nz: a } = e;
	for (let o = 0; o < (t === 2 ? 1 : a); o++) for (let a = 0; a < (t === 1 ? 1 : i); a++) for (let s = 0; s < r; s++) {
		let c = t === 1 ? s + r * (n + i * o) : s + r * (a + i * n);
		if (e.cells[c] === j.Air) return !0;
	}
	return !1;
}
function et(e, t) {
	let { nx: n, ny: r, nz: i } = e, a = t === 1 ? r : i, o = (a - 1) / 2, s = 0, c = -1, l = Infinity;
	for (let u = 0; u < a; u++) {
		let a = 0;
		for (let o = 0; o < (t === 2 ? 1 : i); o++) for (let i = 0; i < (t === 1 ? 1 : r); i++) for (let s = 0; s < n; s++) {
			let c = t === 1 ? s + n * (u + r * o) : s + n * (i + r * u);
			e.cells[c] === j.Air && a++;
		}
		let d = Math.abs(u - o);
		(a > c || a === c && d < l) && (s = u, c = a, l = d);
	}
	return s;
}
//#endregion
//#region src/compute/ard/voxelize-room.ts
function tt(e) {
	let t = e.allSurfaces, n = [], r = new A();
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = i.geometry, o = a?.getAttribute("position");
		if (!o) continue;
		let s = o.array, c = a?.index ?? null, l = (e, t) => (c ? c.getX(e * 3 + t) : e * 3 + t) * 3, u = Math.floor(c ? c.count / 3 : s.length / 9);
		for (let t = 0; t < u; t++) {
			let a = l(t, 0), o = l(t, 1), c = l(t, 2);
			r.set(s[a], s[a + 1], s[a + 2]), i.localToWorld(r);
			let u = r.x, d = r.y, f = r.z;
			r.set(s[o], s[o + 1], s[o + 2]), i.localToWorld(r);
			let p = r.x, m = r.y, h = r.z;
			r.set(s[c], s[c + 1], s[c + 2]), i.localToWorld(r), n.push({
				ax: u,
				ay: d,
				az: f,
				bx: p,
				by: m,
				bz: h,
				cx: r.x,
				cy: r.y,
				cz: r.z,
				surfaceIndex: e
			});
		}
	}
	return {
		triangles: n,
		surfaces: t
	};
}
function nt(e, t) {
	let { triangles: n, surfaces: r } = tt(e);
	if (n.length === 0) throw Error("Room has no surface geometry to voxelize");
	return {
		grid: F(n, t),
		surfaces: r
	};
}
//#endregion
//#region src/compute/ard/worker-host.ts
function rt() {
	if (typeof Worker > "u") return null;
	try {
		return new Worker(new URL(
			/* @vite-ignore */
			"/assets/ard.worker-CsN-CuKM.js",
			"" + import.meta.url
		), { type: "module" });
	} catch {
		return null;
	}
}
//#endregion
//#region src/compute/ard/index.ts
var it = [
	125,
	250,
	500,
	1e3,
	2e3,
	4e3,
	8e3
], at = {
	impedance: 14e5,
	pml: 13e5
}, ot = 2e3, st = 256, ct = { name: "Adaptive Rectangular Decomposition" }, Q = class extends m {
	uuid;
	roomID;
	sourceIDs;
	receiverIDs;
	fMax;
	cellsPerWavelength;
	courant;
	irLength;
	wallThickness;
	boundary;
	perBandRuns;
	sampleRate;
	humidity;
	dimensions;
	slice;
	sliceCoordinate;
	progress;
	lastRun;
	hasEmittedResults;
	cancelled;
	activeWorker;
	workerUsable;
	constructor(t = ct) {
		super(t), this.kind = "ard", this.name = t.name || ct.name, this.uuid = e();
		let n = c.getState().getRooms();
		this.roomID = t.roomID || (n.length > 0 ? n[0].uuid : ""), this.sourceIDs = t.sourceIDs || [], this.receiverIDs = t.receiverIDs || [], this.fMax = t.fMax ?? 1e3, this.cellsPerWavelength = t.cellsPerWavelength ?? 2.6, this.courant = t.courant ?? .4, this.irLength = t.irLength ?? 1, this.wallThickness = t.wallThickness ?? 8, this.boundary = t.boundary ?? "impedance", this.perBandRuns = t.perBandRuns ?? !1, this.sampleRate = t.sampleRate ?? 44100, this.humidity = t.humidity ?? 40, this.dimensions = t.dimensions ?? 3, this.slice = t.slice ?? "xz", this.sliceCoordinate = t.sliceCoordinate ?? null, this.progress = 0, this.lastRun = null, this.hasEmittedResults = !1, this.cancelled = !1, this.activeWorker = null, this.workerUsable = !0;
	}
	calculate() {
		this.run().catch((e) => {
			console.error(`ARD: ${e instanceof Error ? e.message : String(e)}`);
		});
	}
	cancel() {
		this.cancelled = !0, this.activeWorker?.postMessage({ type: "cancel" });
	}
	async run() {
		if (this.running) throw Error("ARD: a run is already in progress. Cancel it and wait for it to stop before starting another.");
		let e = Date.now();
		this.cancelled = !1, this.running = !0, this.workerUsable = !0, this.progress = 0, o("SHOW_PROGRESS", {
			message: `Running ${this.name}…`,
			progress: 0,
			solverUuid: this.uuid
		});
		try {
			return await this.execute(e);
		} finally {
			this.releaseWorker(), this.running = !1, this.progress > 0 && this.progress < 1 && (this.progress = 0, o("ARD_PROGRESS", {
				uuid: this.uuid,
				progress: 0
			})), o("HIDE_PROGRESS", void 0);
		}
	}
	async execute(e) {
		let t = this.room;
		if (!t) throw Error("ARD: no room selected");
		let n = c.getState().containers, r = this.sourceIDs.map((e) => n[e]).filter((e) => e?.kind === "source"), i = this.receiverIDs.map((e) => n[e]).filter((e) => e?.kind === "receiver");
		if (r.length === 0 || i.length === 0) throw Error("ARD: need at least one source and one receiver");
		let a = p(this.temperature), s = M(this.fMax, a, this.cellsPerWavelength), l = $(r[0]), { grid: u, surfaces: m } = nt(t, {
			dx: s,
			seed: l,
			padCells: this.padCells
		});
		if (u.leaked) throw Error("ARD: the room does not enclose a volume — the flood fill reached the outside of the grid. Close the geometry, or check that the first source is inside the room.");
		let h = [...u.warnings], g = this.dimensions === 2 ? this.takeSlice(u, l, h) : u;
		if (g.airCount === 0) throw Error("ARD: the chosen slice plane contains no room air. Move it inside the room, or run in three dimensions.");
		let _ = H(g), v = (e) => g.cells[e] === j.Air && _.assignment[e] >= 0, y = 0, b = (e) => {
			if (this.dimensions !== 2) return e;
			let t = Z(this.slice), n = t === 1 ? g.origin.y : g.origin.z, r = t === 1 ? e.y : e.z;
			return y = Math.max(y, Math.abs(r - n)), t === 1 ? {
				...e,
				y: n
			} : {
				...e,
				z: n
			};
		}, x = r.map((e, t) => ut(g, b($(e)), `Source ${e.name || t}`, v, h)), S = i.map((e, t) => ut(g, b($(e)), `Receiver ${e.name || t}`, v, h));
		y > g.dx && h.push(`Sources and receivers are projected onto the 2D cut; the furthest moved ${y.toFixed(2)} m. A 2D run has no coordinate off the plane, so a probe placed well away from it answers about somewhere else.`);
		let C = this.bands, w = r.length * C.length, T = m.map((e) => Math.max(...C.map((t) => dt(e.absorptionFunction(t))))), E = Je({
			grid: g,
			decomposition: _,
			c: a,
			courant: this.courant,
			duration: this.irLength,
			wallThickness: this.wallThickness,
			boundary: this.boundary,
			fMax: this.fMax,
			absorptionFor: (e) => e >= 0 && e < m.length ? T[e] : 0
		}), D = Xe(E.steps, E.dt, this.fMax), O = [], k = E.courant, A = {
			room: 0,
			walls: 0,
			boundary: 0
		}, N = 0;
		for (let e = 0; e < r.length; e++) {
			let t = [];
			for (let n = 0; n < C.length; n++) {
				if (this.cancelled) throw Error("ARD: run cancelled");
				let i = C[n], s = d(f([i], this.temperature, this.humidity)[0]), c = {
					grid: g,
					decomposition: _,
					c: a,
					courant: E.courant,
					steps: E.steps,
					sources: [{
						cell: x[e],
						signal: D
					}],
					receivers: S.map((e) => ({ cell: e })),
					airAbsNepersPerMetre: s,
					wallThickness: this.wallThickness,
					boundary: this.boundary,
					fMax: this.fMax
				}, l = C.length > 1 ? ` ${i} Hz band,` : "", u = await this.runOne(c, i, m, (t) => {
					this.progress = (N + t) / w, o("ARD_PROGRESS", {
						uuid: this.uuid,
						progress: this.progress
					}), o("UPDATE_PROGRESS", {
						progress: Math.round(this.progress * 100),
						message: `${this.name}:${l} source ${e + 1} of ${r.length} — ${Math.round(t * 100)}%`
					});
				});
				k = u.courant, A = u.cellCount;
				for (let e of u.warnings) h.includes(e) || h.push(e);
				t.push(u.irs), N++;
			}
			O.push(t);
		}
		let P = this.emitResults({
			sources: r,
			receivers: i,
			records: O,
			bands: C,
			pulse: D,
			dt: E.dt,
			dx: s,
			c: a
		}), F = {
			dx: s,
			dt: E.dt,
			courant: k,
			gridCells: g.nx * g.ny * g.nz,
			airCells: g.airCount,
			boxCount: _.boxes.length,
			cellCount: A,
			steps: E.steps,
			runs: w,
			seconds: (Date.now() - e) / 1e3,
			warnings: h,
			impulseResponses: P,
			sourceCells: x,
			receiverCells: S
		};
		return this.lastRun = F, this.progress = 1, o("ARD_PROGRESS", {
			uuid: this.uuid,
			progress: 1
		}), F;
	}
	takeSlice(e, t, n) {
		let r = Z(this.slice), i = r === 1 ? "y" : "z", a = this.sliceCoordinate === null ? r === 1 ? t.y : t.z : this.sliceCoordinate, o = Qe(e, r, a), s = o.index;
		if (o.clamped && $e(e, r, s)) {
			let t = e.origin[i] + s * e.dx;
			n.push(`The 2D slice at ${i} = ${a.toFixed(2)} m is outside the grid and was clamped to ${i} = ${t.toFixed(2)} m.`);
		}
		$e(e, r, s) || (s = et(e, r), n.push(`The 2D slice at ${i} = ${a.toFixed(2)} m contains no room air — it is outside the room, or in its padding. Cut at the widest plane instead.`));
		let c = Ze(e, r, s), l = r === 1 ? c.origin.y : c.origin.z;
		return n.push(`Running in two dimensions on the ${this.slice} plane at ${i} = ${l.toFixed(2)} m. A 2D result is the response of a room that is uniform and unbounded along the collapsed axis, not of this room — sound spreads as 1/sqrt(r) and there are no modes across that axis at all. Use it to see wavefronts in plan, not to read a reverberation time.`), c;
	}
	async runOne(e, t, n, r) {
		let i = n.map((e) => dt(e.absorptionFunction(t))), a = (e) => e >= 0 && e < i.length ? i[e] : 0;
		return this.stepSimulation({
			...e,
			absorptionFor: a
		}, i, a, r);
	}
	stepSimulation(e, t, n, r) {
		let i = this.workerUsable ? this.acquireWorker() : null;
		return i ? new Promise((a, o) => {
			let s = !1, c = !1, l = (e) => {
				c || (c = !0, i.removeEventListener("message", u), i.removeEventListener("error", d), e());
			}, u = (e) => {
				let t = e.data;
				switch (t.type) {
					case "progress":
						s = !0, r((t.step + 1) / t.total), this.cancelled && i.postMessage({ type: "cancel" });
						break;
					case "done":
						l(() => a({
							irs: t.irs,
							dt: t.dt,
							courant: t.courant,
							cellCount: t.cellCount,
							warnings: t.warnings
						}));
						break;
					case "cancelled":
						l(() => o(/* @__PURE__ */ Error("ARD: run cancelled")));
						break;
					case "error": l(() => o(Error(t.message)));
				}
			}, d = (t) => {
				l(() => {
					if (this.releaseWorker(), s) {
						o(/* @__PURE__ */ Error(`ARD: the simulation worker died mid-run (${t.message || "no message"}). Not restarting the time loop on the main thread — it would freeze the editor for as long as the run has already taken.`));
						return;
					}
					this.workerUsable = !1, this.stepInline(e, n, r).then(a, o);
				});
			};
			i.addEventListener("message", u), i.addEventListener("error", d);
			let { absorptionFor: f, ...p } = e;
			i.postMessage({
				type: "start",
				config: p,
				absorption: t
			});
		}) : this.stepInline(e, n, r);
	}
	acquireWorker() {
		return this.activeWorker ? this.activeWorker : (this.activeWorker = rt(), this.activeWorker || (this.workerUsable = !1), this.activeWorker);
	}
	releaseWorker() {
		this.activeWorker?.terminate(), this.activeWorker = null;
	}
	async stepInline(e, t, n) {
		let r = Ye({
			...e,
			absorptionFor: t
		}), i = r.steps, a = ft(e.receivers.length, i);
		try {
			for (; r.currentStep < i;) {
				if (this.cancelled) throw Error("ARD: run cancelled");
				let e = Math.min(r.currentStep + st, i);
				for (; r.currentStep < e;) {
					let e = r.step();
					for (let t = 0; t < a.length; t++) a[t][e.step] = e.receiverSamples[t];
				}
				n(r.currentStep / i), await pt();
			}
			return {
				irs: a,
				dt: r.dt,
				courant: r.courant,
				cellCount: r.cellCount,
				warnings: [...r.warnings]
			};
		} finally {
			r.dispose();
		}
	}
	emitResults(e) {
		let { sources: t, receivers: n, records: r, bands: i, pulse: a, dt: o, dx: s, c } = e, l = 1 / o, d = a.length, f = he(d, a.length), p = i.length > 1 ? ve(f, l, i) : null, m = this.dimensions === 2, h = m ? fe(f, l, s, c) : null, g = m ? 1 : de(s, c), _ = /* @__PURE__ */ new Map();
		for (let e = 0; e < t.length; e++) {
			let o = t[e], s = u(o.initialSPL);
			for (let t = 0; t < n.length; t++) {
				let c = n[t], u = new Float32Array(d);
				for (let n = 0; n < i.length; n++) {
					let i = _e(r[e][n][t], a, {
						sampleRate: l,
						fMax: this.fMax,
						window: lt(p?.[n], h)
					});
					for (let e = 0; e < d; e++) u[e] += i[e];
				}
				for (let e = 0; e < d; e++) u[e] *= g * s;
				let f = l / this.sampleRate, m = Se(u, l, this.sampleRate);
				for (let e = 0; e < m.length; e++) m[e] *= f;
				let v = `${o.uuid}->${c.uuid}`;
				_.set(v, m), this.emitPair(o, c, m);
			}
		}
		return _;
	}
	emitPair(e, t, n) {
		let r = e.name || "source", i = t.name || "receiver", a = this.dimensions === 2 ? ` [2D ${this.slice}]` : "", o = {
			sourceName: r,
			receiverName: i,
			sourceId: e.uuid,
			receiverId: t.uuid
		}, s = `${this.uuid}-ard-ir-${e.uuid}-${t.uuid}`;
		ht({
			kind: l.ImpulseResponse,
			name: `IR${a}: ${r} → ${i}`,
			uuid: s,
			from: this.uuid,
			info: {
				sampleRate: this.sampleRate,
				...o
			},
			data: mt(n, this.sampleRate)
		});
		let c = k(n), u = `${this.uuid}-ard-edc-${e.uuid}-${t.uuid}`;
		ht({
			kind: l.EnergyDecay,
			name: `ARD energy${a}: ${r} → ${i}`,
			uuid: u,
			from: this.uuid,
			info: {
				binRate: this.sampleRate,
				units: "energy",
				...o
			},
			data: mt(c, this.sampleRate)
		}), this.hasEmittedResults = !0;
	}
	save() {
		let { name: e, kind: t, uuid: n, autoCalculate: r, roomID: i, sourceIDs: a, receiverIDs: o, fMax: s, cellsPerWavelength: c, courant: l, irLength: u, wallThickness: d, boundary: f, perBandRuns: p, sampleRate: m, humidity: h, dimensions: g, slice: _, sliceCoordinate: v } = this;
		return {
			name: e,
			kind: t,
			uuid: n,
			autoCalculate: r,
			roomID: i,
			sourceIDs: a,
			receiverIDs: o,
			fMax: s,
			cellsPerWavelength: c,
			courant: l,
			irLength: u,
			wallThickness: d,
			boundary: f,
			perBandRuns: p,
			sampleRate: m,
			humidity: h,
			dimensions: g,
			slice: _,
			sliceCoordinate: v
		};
	}
	restore(e) {
		return super.restore(e), this.kind = e.kind, e.roomID !== void 0 && (this.roomID = e.roomID), e.sourceIDs !== void 0 && (this.sourceIDs = e.sourceIDs), e.receiverIDs !== void 0 && (this.receiverIDs = e.receiverIDs), e.fMax !== void 0 && (this.fMax = e.fMax), e.cellsPerWavelength !== void 0 && (this.cellsPerWavelength = e.cellsPerWavelength), e.courant !== void 0 && (this.courant = e.courant), e.irLength !== void 0 && (this.irLength = e.irLength), e.wallThickness !== void 0 && (this.wallThickness = e.wallThickness), this.boundary = e.boundary ?? "pml", e.perBandRuns !== void 0 && (this.perBandRuns = e.perBandRuns), e.sampleRate !== void 0 && (this.sampleRate = e.sampleRate), e.humidity !== void 0 && (this.humidity = e.humidity), e.dimensions !== void 0 && (this.dimensions = e.dimensions), e.slice !== void 0 && (this.slice = e.slice), e.sliceCoordinate !== void 0 && (this.sliceCoordinate = e.sliceCoordinate), this;
	}
	dispose() {
		this.cancel();
	}
	get rooms() {
		return c.getState().getRooms();
	}
	get room() {
		return c.getState().containers[this.roomID];
	}
	get temperature() {
		return this.room?.temperature ?? 20;
	}
	get noResults() {
		return !this.hasEmittedResults;
	}
	get padCells() {
		return this.boundary === "pml" ? We(this.wallThickness) : 1;
	}
	get cellSize() {
		return M(this.fMax, p(this.temperature), this.cellsPerWavelength);
	}
	get estimatedGrid() {
		let e = this.roomSize();
		if (!e) return {
			x: 0,
			y: 0,
			z: 0
		};
		let t = this.cellSize, n = 2 * this.padCells;
		return {
			x: Math.ceil(e.x / t) + n,
			y: Math.ceil(e.y / t) + n,
			z: Math.ceil(e.z / t) + n
		};
	}
	get estimatedCellCount() {
		let e = this.estimatedGrid;
		return e.x * e.y * e.z;
	}
	get estimatedSimulatedCells() {
		let e = this.roomSize();
		if (!e) return 0;
		let t = this.cellSize, n = Math.max(1, Math.round(e.x / t) - 1), r = Math.max(1, Math.round(e.y / t) - 1), i = Math.max(1, Math.round(e.z / t) - 1);
		this.dimensions === 2 && (Z(this.slice) === 1 ? r = 1 : i = 1);
		let a = n * r * i, o = 2 * ((n > 1 ? r * i : 0) + (r > 1 ? n * i : 0) + (i > 1 ? n * r : 0));
		return this.boundary === "pml" ? a + o * this.wallThickness : a;
	}
	get estimatedSeconds() {
		return this.estimatedSimulatedCells * this.estimatedSteps / at[this.boundary];
	}
	roomSize() {
		let e = this.room;
		if (!e) return null;
		let t = new A();
		try {
			e.boundingBox.getSize(t);
		} catch {
			return null;
		}
		return !(t.x > 0) || !(t.y > 0) || !(t.z > 0) ? null : {
			x: t.x,
			y: t.y,
			z: t.z
		};
	}
	get bands() {
		if (!this.perBandRuns) return [this.referenceFrequency];
		let e = it.filter((e) => e / Math.SQRT2 <= this.fMax);
		return e.length > 0 ? [...e] : [it[0]];
	}
	get referenceFrequency() {
		return Math.min(500, this.fMax);
	}
	get estimatedStepsPerRun() {
		let e = p(this.temperature), t = this.dimensions === 2 ? 2 : 3, n = this.boundary === "pml" ? q * y(t) : b(1), r = Math.min(this.courant, n) * this.cellSize / e;
		return Math.ceil(this.irLength / r);
	}
	get estimatedRuns() {
		return Math.max(1, this.sourceIDs.length) * this.bands.length;
	}
	get estimatedSteps() {
		return this.estimatedStepsPerRun * this.estimatedRuns;
	}
};
function lt(e, t) {
	if (!e) return t ?? void 0;
	if (!t) return e;
	let n = new Float64Array(e.length);
	for (let r = 0; r < e.length; r++) n[r] = e[r] * t[r];
	return n;
}
function $(e) {
	let t = new A();
	return e.getWorldPosition(t), {
		x: t.x,
		y: t.y,
		z: t.z
	};
}
function ut(e, t, n, r, i) {
	let a = `(${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`, o = B(e, t);
	if (!o) throw Error(`ARD: ${n} at ${a} is outside the voxel grid — it is not in this room.`);
	let s = z(e, o, (e) => r(e));
	if (!s) throw Error(`ARD: ${n} at ${a} is inside a wall, and there is no room air within 8 cells of it. Move it into the room, or lower fMax for a coarser grid.`);
	let c = Math.hypot(s.i - o.i, s.j - o.j, s.k - o.k);
	return c > 0 && i.push(`${n} at ${a} landed on a wall cell and was moved ${(c * e.dx).toFixed(2)} m to the nearest room air. Every probe snaps to the grid — dx is ${e.dx.toFixed(3)} m here — but this one had to move further than rounding.`), [
		s.i,
		s.j,
		s.k
	];
}
function dt(e) {
	return Number.isFinite(e) ? Math.min(Math.max(e, 0), .999) : 0;
}
function ft(e, t) {
	let n = [];
	for (let r = 0; r < e; r++) n.push(new Float32Array(t));
	return n;
}
function pt() {
	return new Promise((e) => setTimeout(e, 0));
}
function mt(e, t) {
	let n = Math.max(1, Math.ceil(e.length / ot)), r = [];
	for (let i = 0; i < e.length; i += n) r.push({
		time: i / t,
		amplitude: e[i]
	});
	return r.length > 0 ? r : [{
		time: 0,
		amplitude: 0
	}];
}
function ht(e) {
	s.getState().results[e.uuid] ? o("UPDATE_RESULT", {
		uuid: e.uuid,
		result: e
	}) : o("ADD_RESULT", e);
}
n("ADD_ARD", i(Q)), n("REMOVE_ARD", t), n("ARD_SET_PROPERTY", a), n("CALCULATE_ARD", (e) => {
	let t = r.getState().solvers[e];
	t && t.calculate();
});
//#endregion
export { Q as ARD, Q as default };

//# sourceMappingURL=ard-DSp2Qk27.mjs.map