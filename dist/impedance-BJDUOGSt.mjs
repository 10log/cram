import { t as e } from "./reflection-coefficient-DOfZqTBY.mjs";
//#region src/compute/ard/partition.ts
var t = /* @__PURE__ */ function(e) {
	return e[e.X = 0] = "X", e[e.Y = 1] = "Y", e[e.Z = 2] = "Z", e;
}({}), n = class {
	box;
	dims;
	nx;
	ny;
	nz;
	size;
	dx;
	c;
	dt;
	force;
	constructor(e) {
		let { box: t, dx: n, c: r, dt: i } = e;
		for (let [e, n] of [
			["w", t.w],
			["h", t.h],
			["d", t.d],
			["x", t.x],
			["y", t.y],
			["z", t.z]
		]) if (!Number.isInteger(n)) throw Error(`Partition box.${e} must be an integer, got ${n}`);
		if (t.w < 1 || t.h < 1 || t.d < 1) throw Error(`Partition extents must be >= 1, got ${t.w}x${t.h}x${t.d}`);
		if (!(n > 0) || !(r > 0) || !(i > 0)) throw Error(`Partition needs positive dx, c and dt; got ${n}, ${r}, ${i}`);
		this.box = { ...t }, this.nx = t.w, this.ny = t.h, this.nz = t.d, this.dims = [
			t.w,
			t.h,
			t.d
		], this.size = t.w * t.h * t.d, this.dx = n, this.c = r, this.dt = i, this.force = new Float64Array(this.size);
	}
	index(e, t, n) {
		return e < 0 || t < 0 || n < 0 || e >= this.nx || t >= this.ny || n >= this.nz ? -1 : e + this.nx * (t + this.ny * n);
	}
	pressureAt(e, t, n) {
		let r = this.index(e, t, n);
		return r < 0 ? 0 : this.pressure[r];
	}
	addForce(e, t, n, r) {
		let i = this.index(e, t, n);
		i >= 0 && (this.force[i] += r);
	}
	clearForce() {
		this.force.fill(0);
	}
	dispose() {}
	get courant() {
		return this.c * this.dt / this.dx;
	}
	get rank() {
		return i(this.nx, this.ny, this.nz);
	}
};
function r(e) {
	return e === 0 ? [1, 2] : e === 1 ? [0, 2] : [0, 1];
}
function i(e, t, n) {
	return Math.max(1, +(e > 1) + +(t > 1) + +(n > 1));
}
var a = 1088 / 180;
function o(e) {
	return Math.sqrt(4 / (a * e));
}
var s = [
	2,
	-27,
	270,
	-490,
	270,
	-27,
	2
], c = (s.length - 1) / 2, l = [
	1,
	-8,
	0,
	8,
	-1
], u = [
	"w",
	"h",
	"d"
], d = [
	"x",
	"y",
	"z"
];
function f(e, t) {
	return e[d[t]];
}
function p(e, t) {
	return e[d[t]] + e[u[t]];
}
function m(e, n) {
	for (let i = t.X; i <= t.Z; i++) {
		let t = null, a = null;
		if (p(e.box, i) === f(n.box, i)) t = e, a = n;
		else if (p(n.box, i) === f(e.box, i)) t = n, a = e;
		else continue;
		let [o, s] = r(i), c = Math.max(f(e.box, o), f(n.box, o)), l = Math.min(p(e.box, o), p(n.box, o)), u = Math.max(f(e.box, s), f(n.box, s)), d = Math.min(p(e.box, s), p(n.box, s));
		if (!(l <= c || d <= u)) return {
			axis: i,
			lower: t,
			upper: a,
			overlap: {
				uMin: c,
				uMax: l,
				vMin: u,
				vMax: d
			}
		};
	}
	return null;
}
function h(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) for (let r = n + 1; r < e.length; r++) {
		let i = m(e[n], e[r]);
		i && t.push(i);
	}
	return t;
}
function g(e, t, n, i, a, o) {
	let [s, c] = r(t), l = [
		0,
		0,
		0
	];
	return l[t] = n ? e.box[u[t]] - 1 - i : i, l[s] = a - e.box[d[s]], l[c] = o - e.box[d[c]], e.pressureAt(l[0], l[1], l[2]);
}
function _(e, t, n, i, a, o, s) {
	let [c, l] = r(t), f = [
		0,
		0,
		0
	];
	f[t] = n ? e.box[u[t]] - 1 - i : i, f[c] = a - e.box[d[c]], f[l] = o - e.box[d[l]], e.addForce(f[0], f[1], f[2], s);
}
function v(e, t, n) {
	let { axis: r, lower: i, upper: a, overlap: o } = e;
	y(e, t, n);
	let l = t * t / (180 * n * n), d = i.includeSelfTerms, f = a.includeSelfTerms, p = Math.min(c, i.box[u[r]]), m = Math.min(c, a.box[u[r]]), h = new Float64Array(c), v = new Float64Array(c);
	for (let e = o.vMin; e < o.vMax; e++) for (let t = o.uMin; t < o.uMax; t++) {
		for (let n = 0; n < c; n++) h[n] = n < p ? g(i, r, !0, n, t, e) : 0, v[n] = n < m ? g(a, r, !1, n, t, e) : 0;
		for (let n = 1; n <= p; n++) {
			let a = 0;
			for (let e = 0; e + n <= c; e++) {
				let t = s[3 + n + e];
				a += t * (v[e] - (d ? h[e] : 0));
			}
			a !== 0 && _(i, r, !0, n - 1, t, e, l * a);
		}
		for (let n = 1; n <= m; n++) {
			let i = 0;
			for (let e = 0; e + n <= c; e++) {
				let t = s[3 + n + e];
				i += t * (h[e] - (f ? v[e] : 0));
			}
			i !== 0 && _(a, r, !1, n - 1, t, e, l * i);
		}
	}
}
function y(e, t, n) {
	for (let [r, i] of [["lower", e.lower], ["upper", e.upper]]) {
		if (i.c !== t) throw Error(`Interface forcing called with c = ${t} but the ${r} partition runs at ${i.c}`);
		if (i.dx !== n) throw Error(`Interface forcing called with dx = ${n} but the ${r} partition runs at ${i.dx}`);
	}
	if (e.lower.dt !== e.upper.dt) throw Error(`Partitions across an interface must share a time step; got ${e.lower.dt} and ${e.upper.dt}`);
}
function b(e, t, n) {
	for (let r of e) v(r, t, n);
}
//#endregion
//#region src/compute/ard/impedance.ts
function x(t) {
	if (!(t >= 0) || t > 1) throw Error(`Absorption coefficient must be in [0, 1], got ${t}`);
	return e(t);
}
var S = 1e-6, C = .55, w = .05;
function T(e) {
	return C - w * Math.min(1, Math.max(0, e));
}
var E = class {
	partition;
	axis;
	high;
	uMin;
	uMax;
	vMin;
	vMax;
	impedance;
	depth;
	beta;
	history;
	ghost;
	own;
	constructor(e) {
		let { partition: t, axis: n, high: r, uMin: i, uMax: a, vMin: o, vMax: s, impedance: l } = e;
		if (a <= i || s <= o) throw Error(`An impedance boundary needs a positive face area, got ${a - i} x ${s - o}`);
		if (!(l > 0)) throw Error(`Impedance must be positive, got ${l}. A zero impedance is a pressure-release surface, which is not a room material.`);
		this.partition = t, this.axis = n, this.high = r, this.uMin = i, this.uMax = a, this.vMin = o, this.vMax = s, this.impedance = l;
		let u = [
			t.box.w,
			t.box.h,
			t.box.d
		][n];
		this.depth = Math.min(c, u);
		let d = t.c * t.dt / t.dx;
		this.beta = new Float64Array(c);
		for (let e = 0; e < c; e++) this.beta[e] = Number.isFinite(this.impedance) ? (e + .5) / (this.impedance * d) : 0;
		this.history = new Float64Array((a - i) * (s - o) * c), this.ghost = new Float64Array(c), this.own = new Float64Array(c);
	}
	get cellCount() {
		return (this.uMax - this.uMin) * (this.vMax - this.vMin);
	}
	reset() {
		this.history.fill(0);
	}
	apply() {
		let { partition: e, axis: t, high: n, depth: r, beta: i, history: a, ghost: o, own: l } = this, u = e.c * e.c / (180 * e.dx * e.dx), d = e.includeSelfTerms, f = this.uMax - this.uMin;
		for (let p = this.vMin; p < this.vMax; p++) for (let m = this.uMin; m < this.uMax; m++) {
			let h = ((p - this.vMin) * f + (m - this.uMin)) * c;
			for (let s = 0; s < c; s++) {
				if (s >= r) {
					o[s] = 0, l[s] = 0;
					continue;
				}
				let c = g(e, t, n, s, m, p), u = i[s], f = ((1 - u) * c + u * a[h + s]) / (1 + u);
				a[h + s] = f + c, o[s] = f, l[s] = d ? c : 0;
			}
			for (let i = 1; i <= r; i++) {
				let r = 0;
				for (let e = 0; e + i <= c; e++) r += s[3 + i + e] * (o[e] - l[e]);
				r !== 0 && _(e, t, n, i - 1, m, p, u * r);
			}
		}
	}
};
function D(e) {
	for (let t of e) t.apply();
}
//#endregion
export { x as a, t as c, n as d, s as f, o as h, T as i, l, r as m, S as n, b as o, i as p, D as r, h as s, E as t, c as u };

//# sourceMappingURL=impedance-BJDUOGSt.mjs.map