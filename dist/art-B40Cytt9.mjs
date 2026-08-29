import { S as e, _ as t, i as n, n as r, o as i, s as a, y as o } from "./FileSaver.min-DhK9iPpQ.mjs";
import { a as s, g as c, i as l } from "./store-Dol3XeT3.mjs";
import { n as u } from "./bands-CXX2p1-Y.mjs";
import "./acoustics-DtDxi75Z.mjs";
import { t as d } from "./air-attenuation-DrZYpv8D.mjs";
import { t as f } from "./sound-speed-CfEkirc1.mjs";
import { t as p } from "./TessellateModifier-DlSgA920.mjs";
import { t as m } from "./solver-DovuaY8D.mjs";
import { IcosahedronGeometry as h, Triangle as g, Vector3 as _ } from "three";
//#region src/compute/radiance/direct-path.ts
var v = 1e3;
function y(e) {
	return e.includes(1e3) || e.length === 0 ? v : e[Math.floor(e.length / 2)];
}
function b(e) {
	let { energy: t, distance: n, airAbsDbPerMeter: r } = e;
	if (!(n > 1e-6)) return 0;
	let i = r / (20 / Math.LN10);
	return t * Math.exp(-i * n) / (n * n);
}
function x(e, t, n) {
	return Math.round(e / t * n);
}
//#endregion
//#region src/compute/radiance/energy-decay.ts
function S(e, t, n = 2e3) {
	let r = Math.max(1, Math.floor(e.length / n)), i = [];
	for (let n = 0; n < e.length; n += r) i.push({
		time: n / t,
		amplitude: e[n]
	});
	let a = i.length - 1;
	for (; a > 0 && Math.abs(i[a].amplitude) < 1e-10;) --a;
	return i.slice(0, a + 1);
}
//#endregion
//#region src/compute/radiance/brdf.ts
var C = 1, w = class {
	detail;
	directions;
	nSlots;
	coefficients;
	constructor(e = C) {
		this.detail = e;
		let t = new h(1, this.detail).getAttribute("position"), n = /* @__PURE__ */ new Set(), r = [];
		for (let e = 0; e < t.count; e++) {
			let i = t.getX(e), a = t.getY(e), o = t.getZ(e);
			if (o >= 0) {
				let e = new _(i, a, o).normalize(), t = `${e.x.toFixed(6)},${e.y.toFixed(6)},${e.z.toFixed(6)}`;
				n.has(t) || (n.add(t), r.push(e));
			}
		}
		this.directions = r, this.nSlots = r.length, this.coefficients = [];
		for (let e = 0; e < this.nSlots; e++) this.coefficients[e] = new Float32Array(this.nSlots);
	}
	computeCoefficients(e, t) {
		let n = Math.max(0, Math.min(1, Number.isFinite(e) ? e : 0)), r = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0)), i = 1 - n, a = i * r / this.nSlots, o = i * (1 - r);
		for (let e = 0; e < this.nSlots; e++) {
			let t = this.directions[e], n = new _(-t.x, -t.y, t.z).normalize(), r = this.findNearestSlot(n);
			for (let t = 0; t < this.nSlots; t++) this.coefficients[e][t] = a;
			this.coefficients[e][r] += o;
		}
	}
	findNearestSlot(e) {
		let t = 0, n = -Infinity;
		for (let r = 0; r < this.nSlots; r++) {
			let i = e.dot(this.directions[r]);
			i > n && (n = i, t = r);
		}
		return t;
	}
	getDirectionIndex(e, t) {
		let n = T(e, t);
		return n.z < 0 && (n.z = 0), n.lengthSq() < 1e-10 ? 0 : (n.normalize(), this.findNearestSlot(n));
	}
	getOutgoingWeights(e) {
		return this.coefficients[e];
	}
};
function T(e, t) {
	let n = t.clone().normalize(), r = new _(1, 0, 0);
	Math.abs(n.dot(r)) > .9 && (r = new _(0, 1, 0));
	let i = new _().crossVectors(n, r).normalize(), a = new _().crossVectors(n, i).normalize();
	return new _(e.dot(i), e.dot(a), e.dot(n));
}
//#endregion
//#region src/compute/radiance/response.ts
var E = class {
	buffer;
	constructor(e) {
		this.buffer = new Float32Array(e);
	}
	clear(e = 0, t = this.buffer.length, n = 0) {
		this.buffer.fill(n, e, t);
	}
	extend(e) {
		let t = new Float32Array(e);
		for (let e = 0; e < this.buffer.length; e++) t[e] = this.buffer[e];
		this.buffer = t;
	}
	add(e, t) {
		this.buffer[e] += t;
	}
	sum() {
		let e = 0;
		for (let t = 0; t < this.buffer.length; t++) e += this.buffer[t];
		return e;
	}
	delayMultiplyAdd(e, t, n) {
		t = Math.round(t);
		let r = e.buffer.length + t;
		r > this.buffer.length && this.extend(r);
		for (let r = 0; r < e.buffer.length; r++) this.buffer[r + t] += e.buffer[r] * n;
	}
}, D = class {
	n;
	responses;
	constructor(e, t) {
		this.n = e, this.responses = [];
		for (let n = 0; n < e; n++) this.responses[n] = new E(t);
	}
	clear() {
		this.responses.forEach((e) => e.clear());
	}
	sum() {
		return this.responses.reduce((e, t) => e + t.sum(), 0);
	}
	delayMultiplyAdd(e, t, n, r) {
		for (let i = 0; i < this.n; i++) this.responses[i].delayMultiplyAdd(e, t, n[i] * r);
	}
	accumulateFrom(e) {
		for (let t = 0; t < this.n; t++) this.responses[t].buffer[0] = e.responses[t].sum();
	}
}, O = class e {
	extentsMin;
	extentsMax;
	startIndex;
	endIndex;
	level;
	node0;
	node1;
	constructor(e, t, n, r, i) {
		this.extentsMin = e, this.extentsMax = t, this.startIndex = n, this.endIndex = r, this.level = i, this.node0 = null, this.node1 = null;
	}
	static fromObj({ extentsMin: t, extentsMax: n, startIndex: r, endIndex: i, level: a, node0: o, node1: s }) {
		let c = new e(t, n, r, i, a);
		return o && (c.node0 = e.fromObj(o)), s && (c.node1 = e.fromObj(s)), c;
	}
	elementCount() {
		return this.endIndex - this.startIndex;
	}
	centerX() {
		return (this.extentsMin[0] + this.extentsMax[0]) * .5;
	}
	centerY() {
		return (this.extentsMin[1] + this.extentsMax[1]) * .5;
	}
	centerZ() {
		return (this.extentsMin[2] + this.extentsMax[2]) * .5;
	}
	clearShapes() {
		this.startIndex = -1, this.endIndex = -1;
	}
	get children() {
		return [this.node0, this.node1];
	}
}, k = class e {
	x = 0;
	y = 0;
	z = 0;
	constructor(e = 0, t = 0, n = 0) {
		this.x = e, this.y = t, this.z = n;
	}
	copy(e) {
		return this.x = e.x, this.y = e.y, this.z = e.z, this;
	}
	setFromArray(e, t) {
		this.x = e[t], this.y = e[t + 1], this.z = e[t + 2];
	}
	setFromArrayNoOffset(e) {
		this.x = e[0], this.y = e[1], this.z = e[2];
	}
	setFromArgs(e, t, n) {
		this.x = e, this.y = t, this.z = n;
	}
	add(e) {
		return this.x += e.x, this.y += e.y, this.z += e.z, this;
	}
	multiplyScalar(e) {
		return this.x *= e, this.y *= e, this.z *= e, this;
	}
	subVectors(e, t) {
		return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
	}
	dot(e) {
		return this.x * e.x + this.y * e.y + this.z * e.z;
	}
	cross(e) {
		let t = this.x, n = this.y, r = this.z;
		return this.x = n * e.z - r * e.y, this.y = r * e.x - t * e.z, this.z = t * e.y - n * e.x, this;
	}
	crossVectors(e, t) {
		let n = e.x, r = e.y, i = e.z, a = t.x, o = t.y, s = t.z;
		return this.x = r * s - i * o, this.y = i * a - n * s, this.z = n * o - r * a, this;
	}
	clone() {
		return new e(this.x, this.y, this.z);
	}
	static fromAny(t) {
		if (t instanceof e) return t;
		if (t.x !== void 0 && t.x !== null) return new e(t.x, t.y, t.z);
		throw TypeError("Couldn't convert to BVHVector3.");
	}
}, A = class e {
	rootNode;
	bboxArray;
	trianglesArray;
	constructor(e, t, n) {
		this.rootNode = e, this.bboxArray = t, this.trianglesArray = n;
	}
	intersectRay(t, n, r = !0) {
		try {
			t = k.fromAny(t), n = k.fromAny(n);
		} catch {
			throw TypeError("Origin or Direction couldn't be converted to a BVHVector3.");
		}
		let i = [this.rootNode], a = [], o = [], s = new k(1 / n.x, 1 / n.y, 1 / n.z);
		for (; i.length > 0;) {
			let n = i.pop();
			if (n && e.intersectNodeBox(t, s, n)) {
				n.node0 && i.push(n.node0), n.node1 && i.push(n.node1);
				for (let e = n.startIndex; e < n.endIndex; e++) a.push(this.bboxArray[e * 7]);
			}
		}
		let c = new k(), l = new k(), u = new k();
		for (let i = 0; i < a.length; i++) {
			let s = a[i];
			c.setFromArray(this.trianglesArray, s * 9), l.setFromArray(this.trianglesArray, s * 9 + 3), u.setFromArray(this.trianglesArray, s * 9 + 6);
			let d = e.intersectRayTriangle(c, l, u, t, n, r);
			d && o.push({
				triangleIndex: s,
				intersectionPoint: d
			});
		}
		return o;
	}
	static calcTValues(e, t, n, r) {
		return r >= 0 ? [(e - n) * r, (t - n) * r] : [(t - n) * r, (e - n) * r];
	}
	static intersectNodeBox(t, n, r) {
		let [i, a] = e.calcTValues(r.extentsMin[0], r.extentsMax[0], t.x, n.x), [o, s] = e.calcTValues(r.extentsMin[1], r.extentsMax[1], t.y, n.y);
		if (i > s || o > a) return !1;
		(o > i || i !== i) && (i = o), (s < a || a !== a) && (a = s);
		let [c, l] = e.calcTValues(r.extentsMin[2], r.extentsMax[2], t.z, n.z);
		return !(i > l || c > a || ((l < a || a !== a) && (a = l), a < 0));
	}
	static intersectRayTriangle(e, t, n, r, i, a) {
		var o = new k(), s = new k(), c = new k(), l = new k();
		s.subVectors(t, e), c.subVectors(n, e), l.crossVectors(s, c);
		let u = i.dot(l);
		if (u === 0 || u > 0 && a) return null;
		let d = Math.sign(u);
		u *= d, o.subVectors(r, e);
		var f = d * i.dot(c.crossVectors(o, c));
		if (f < 0) return null;
		var p = d * i.dot(s.cross(o));
		if (p < 0 || f + p > u) return null;
		let m = -d * o.dot(l);
		return m < 0 ? null : i.clone().multiplyScalar(m / u).add(r);
	}
}, j = 1e-6;
function M(e, t = 10) {
	if (typeof t != "number") throw Error(`maxTrianglesPerNode must be of type number, got: ${typeof t}`);
	if (t < 1) throw Error(`maxTrianglesPerNode must be greater than or equal to 1, got: ${t}`);
	if (Number.isNaN(t)) throw Error("maxTrianglesPerNode is NaN");
	Number.isInteger(t) || console.warn(`maxTrianglesPerNode is expected to be an integer, got: ${t}`);
	let n;
	if (Array.isArray(e) && e.length === 0 && console.warn("triangles appears to be an array with 0 elements."), B(e)) n = L(e);
	else if (e instanceof Float32Array) n = e;
	else if (V(e)) n = new Float32Array(e);
	else throw Error(`triangles must be of type Vector[][] | number[] | Float32Array, got: ${typeof e}`);
	let r = I(n), i = new Float32Array(r.length);
	i.set(r);
	var a = n.length / 9, o = F(r, 0, a, j);
	let s = new O(o[0], o[1], 0, a, 0), c = [s], l;
	for (; l = c.pop();) {
		let e = N(l, t, r, i);
		c.push(...e);
	}
	return new A(s, r, n);
}
function N(e, t, n, r) {
	let i = e.elementCount();
	if (i <= t || i === 0) return [];
	let a = e.startIndex, o = e.endIndex, s = [
		[],
		[],
		[]
	], c = [
		[],
		[],
		[]
	], l = [
		e.centerX(),
		e.centerY(),
		e.centerZ()
	], u = [];
	u.length = 3;
	for (let e = a; e < o; e++) {
		let t = e * 7 + 1;
		u[0] = (n[t] + n[t++ + 3]) * .5, u[1] = (n[t] + n[t++ + 3]) * .5, u[2] = (n[t] + n[t + 3]) * .5;
		for (let t = 0; t < 3; t++) u[t] < l[t] ? s[t].push(e) : c[t].push(e);
	}
	var d = [];
	if (d.length = 3, d[0] = s[0].length === 0 || c[0].length === 0, d[1] = s[1].length === 0 || c[1].length === 0, d[2] = s[2].length === 0 || c[2].length === 0, d[0] && d[1] && d[2]) return [];
	var f = [
		0,
		1,
		2
	], p = [
		e.extentsMax[0] - e.extentsMin[0],
		e.extentsMax[1] - e.extentsMin[1],
		e.extentsMax[2] - e.extentsMin[2]
	];
	f.sort((e, t) => p[t] - p[e]);
	let m = [], h = [];
	for (let e = 0; e < 3; e++) {
		var g = f[e];
		if (!d[g]) {
			m = s[g], h = c[g];
			break;
		}
	}
	var _ = a, v = _ + m.length, y = v, b = o;
	P(m, h, e.startIndex, n, r);
	var x = r.subarray(e.startIndex * 7, e.endIndex * 7);
	n.set(x, e.startIndex * 7);
	var S = F(n, _, v, j), C = F(n, y, b, j), w = new O(S[0], S[1], _, v, e.level + 1), T = new O(C[0], C[1], y, b, e.level + 1);
	return e.node0 = w, e.node1 = T, e.clearShapes(), [w, T];
}
function P(e, t, n, r, i) {
	var a = e.concat(t), o = n;
	for (let e = 0; e < a.length; e++) {
		let t = a[e];
		z(r, t, i, o), o++;
	}
}
function F(e, t, n, r = 0) {
	if (t >= n) return [[
		0,
		0,
		0
	], [
		0,
		0,
		0
	]];
	let i = Infinity, a = Infinity, o = Infinity, s = -Infinity, c = -Infinity, l = -Infinity;
	for (let r = t; r < n; r++) {
		let t = r * 7 + 1;
		i = Math.min(e[t++], i), a = Math.min(e[t++], a), o = Math.min(e[t++], o), s = Math.max(e[t++], s), c = Math.max(e[t++], c), l = Math.max(e[t], l);
	}
	return [[
		i - r,
		a - r,
		o - r
	], [
		s + r,
		c + r,
		l + r
	]];
}
function I(e) {
	let t = e.length / 9, n = new Float32Array(t * 7);
	for (let r = 0; r < t; r++) {
		let t = r * 9, i = e[t++], a = e[t++], o = e[t++], s = e[t++], c = e[t++], l = e[t++], u = e[t++], d = e[t++], f = e[t];
		R(n, r, r, Math.min(i, s, u), Math.min(a, c, d), Math.min(o, l, f), Math.max(i, s, u), Math.max(a, c, d), Math.max(o, l, f));
	}
	return n;
}
function L(e) {
	let t = new Float32Array(e.length * 9);
	for (let n = 0; n < e.length; n++) {
		let r = e[n][0], i = e[n][1], a = e[n][2], o = n * 9;
		t[o++] = r.x, t[o++] = r.y, t[o++] = r.z, t[o++] = i.x, t[o++] = i.y, t[o++] = i.z, t[o++] = a.x, t[o++] = a.y, t[o] = a.z;
	}
	return t;
}
function R(e, t, n, r, i, a, o, s, c) {
	let l = t * 7;
	e[l++] = n, e[l++] = r, e[l++] = i, e[l++] = a, e[l++] = o, e[l++] = s, e[l] = c;
}
function z(e, t, n, r) {
	let i = r * 7, a = t * 7;
	n[i++] = e[a++], n[i++] = e[a++], n[i++] = e[a++], n[i++] = e[a++], n[i++] = e[a++], n[i++] = e[a++], n[i] = e[a];
}
function B(e) {
	if (!Array.isArray(e)) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (!Array.isArray(n) || n.length !== 3) return !1;
		for (let e = 0; e < 3; e++) {
			let t = n[e];
			if (typeof t.x != "number" || typeof t.y != "number" || typeof t.z != "number") return !1;
		}
	}
	return !0;
}
function V(e) {
	if (!Array.isArray(e)) return !1;
	for (let t = 0; t < e.length; t++) if (typeof e[t] != "number") return !1;
	return !0;
}
//#endregion
//#region src/compute/radiance/patch.ts
function H(e, t) {
	let n = e.allSurfaces, r = [], i = [], a = [], o = new p(t, 6);
	for (let e = 0; e < n.length; e++) {
		let t = n[e], s = t.geometry.clone(), c = o.modify(s).getAttribute("position").array, l = c.length / 9;
		for (let n = 0; n < l; n++) {
			let o = n * 9, s = new _(c[o], c[o + 1], c[o + 2]), l = new _(c[o + 3], c[o + 4], c[o + 5]), u = new _(c[o + 6], c[o + 7], c[o + 8]), d = t.localToWorld(s.clone()), f = t.localToWorld(l.clone()), p = t.localToWorld(u.clone()), m = new g(d, f, p), h = m.getArea();
			if (h < 1e-10) continue;
			let v = new _();
			m.getMidpoint(v);
			let y = new _();
			m.getNormal(y);
			let b = r.length;
			r.push({
				index: b,
				centroid: v,
				normal: y,
				area: h,
				vertices: [
					d,
					f,
					p
				],
				surfaceIndex: e,
				absorption: t.absorptionFunction,
				scattering: t.scatteringFunction || (() => t.scatteringCoefficient)
			}), i.push([
				d.x,
				d.y,
				d.z,
				f.x,
				f.y,
				f.z,
				p.x,
				p.y,
				p.z
			]), a.push(b);
		}
	}
	let s = new Float32Array(i.length * 9);
	for (let e = 0; e < i.length; e++) for (let t = 0; t < 9; t++) s[e * 9 + t] = i[e][t];
	return {
		patches: r,
		bvh: M(s),
		triangleToPatch: a
	};
}
function U(e) {
	let t = Math.random(), n = Math.random();
	t + n > 1 && (t = 1 - t, n = 1 - n);
	let r = 1 - t - n;
	return new _(e.vertices[0].x * t + e.vertices[1].x * n + e.vertices[2].x * r, e.vertices[0].y * t + e.vertices[1].y * n + e.vertices[2].y * r, e.vertices[0].z * t + e.vertices[1].z * n + e.vertices[2].z * r);
}
//#endregion
//#region src/compute/radiance/form-factor.ts
function W(e) {
	let t = -1, n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e[r].sum();
		i > t && (t = i, n = r);
	}
	return n;
}
function G(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t += e[n].sum();
	return t;
}
function K(e, t) {
	let { patchSet: n, unshotEnergy: r, totalEnergy: i, brdf: a, airAbsNepers: o, speedOfSound: s, sampleRate: c, raysPerShoot: l } = e, { patches: u, bvh: d, triangleToPatch: f } = n, p = u[t], m = r[t], h = [], g = 0;
	for (let e = 0; e < a.nSlots; e++) {
		let t = m.responses[e].sum();
		h.push(t), g += t;
	}
	if (!(g < 1e-20)) {
		for (let n = 0; n < a.nSlots; n++) {
			if (h[n] < 1e-20) continue;
			let _ = h[n] / g, v = Math.max(1, Math.round(_ * l)), y = 1 / v;
			for (let l = 0; l < v; l++) {
				let l = U(p), h = Z(X(a, n), p.normal), g = d.intersectRay(l, h, !1);
				if (!g || g.length === 0) continue;
				let _ = null, v = Infinity;
				for (let e of g) {
					if (f[e.triangleIndex] === t) continue;
					let n = e.intersectionPoint, r = n.x - l.x, i = n.y - l.y, a = n.z - l.z, o = Math.sqrt(r * r + i * i + a * a);
					o < v && (v = o, _ = e);
				}
				if (!_ || v < 1e-6) continue;
				let b = f[_.triangleIndex], x = u[b], S = v / s * c, C = Math.exp(-o * v), w = a.getDirectionIndex(h.clone().negate(), x.normal), T = e.absorptions[b], E = e.scatterings[b];
				a.computeCoefficients(T, E);
				let D = a.getOutgoingWeights(w), O = m.responses[n], k = y * C;
				for (let e = 0; e < a.nSlots; e++) {
					let t = D[e] * k;
					t < 1e-20 || (r[b].responses[e].delayMultiplyAdd(O, S, t), i[b].responses[e].delayMultiplyAdd(O, S, t));
				}
			}
		}
		m.clear();
	}
}
function q(e, t, n, r = 500) {
	let { patchSet: i, unshotEnergy: a, totalEnergy: o, brdf: s, airAbsNepers: c, speedOfSound: l, sampleRate: u } = n, { patches: d, bvh: f, triangleToPatch: p } = i, m = t / r;
	for (let t = 0; t < r; t++) {
		let t = Y(), r = f.intersectRay(e, t, !1);
		if (!r || r.length === 0) continue;
		let i = null, h = Infinity;
		for (let t of r) {
			let n = t.intersectionPoint, r = n.x - e.x, a = n.y - e.y, o = n.z - e.z, s = Math.sqrt(r * r + a * a + o * o);
			s < h && (h = s, i = t);
		}
		if (!i || h < 1e-6) continue;
		let g = p[i.triangleIndex], _ = d[g], v = h / l * u, y = Math.exp(-c * h), b = t.clone().negate(), x = s.getDirectionIndex(b, _.normal), S = n.absorptions[g], C = n.scatterings[g];
		s.computeCoefficients(S, C);
		let w = s.getOutgoingWeights(x), T = new E(1);
		T.buffer[0] = m * y;
		for (let e = 0; e < s.nSlots; e++) {
			let t = w[e];
			t < 1e-20 || (a[g].responses[e].delayMultiplyAdd(T, v, t), o[g].responses[e].delayMultiplyAdd(T, v, t));
		}
	}
}
function J(e, t) {
	let { patchSet: n, totalEnergy: r, brdf: i, airAbsNepers: a, speedOfSound: o, sampleRate: s } = t, { patches: c, bvh: l, triangleToPatch: u } = n, d = new E(1);
	for (let t = 0; t < c.length; t++) {
		let n = c[t], f = new _().subVectors(e, n.centroid), p = f.length();
		if (p < 1e-6) continue;
		f.normalize();
		let m = n.normal.dot(f);
		if (m <= 0) continue;
		let h = l.intersectRay(n.centroid, f, !1), g = !1;
		if (h) for (let e of h) {
			if (u[e.triangleIndex] === t) continue;
			let r = e.intersectionPoint;
			if (new _(r.x - n.centroid.x, r.y - n.centroid.y, r.z - n.centroid.z).length() < p - .01) {
				g = !0;
				break;
			}
		}
		if (g) continue;
		let v = p / o * s, y = Math.exp(-a * p), b = n.area * m / (p * p), x = i.getDirectionIndex(f, n.normal), S = r[t].responses[x], C = b * y;
		d.delayMultiplyAdd(S, v, C);
	}
	return d;
}
function Y() {
	let e = Math.acos(2 * Math.random() - 1), t = 2 * Math.PI * Math.random();
	return new _(Math.sin(e) * Math.cos(t), Math.sin(e) * Math.sin(t), Math.cos(e));
}
function X(e, t) {
	let n = e.directions[t], r = Math.acos(Math.sqrt(Math.random())) * .5, i = 2 * Math.PI * Math.random(), a = new _(1, 0, 0);
	Math.abs(n.dot(a)) > .9 && (a = new _(0, 1, 0));
	let o = new _().crossVectors(n, a).normalize(), s = new _().crossVectors(n, o).normalize(), c = Math.sin(r), l = Math.cos(r), u = new _().addScaledVector(n, l).addScaledVector(o, c * Math.cos(i)).addScaledVector(s, c * Math.sin(i));
	return u.normalize(), u.z < 0 && (u.z = -u.z), u.normalize(), u;
}
function Z(e, t) {
	let n = t.clone().normalize(), r = new _(1, 0, 0);
	Math.abs(n.dot(r)) > .9 && (r = new _(0, 1, 0));
	let i = new _().crossVectors(n, r).normalize(), a = new _().crossVectors(n, i).normalize();
	return new _(e.x * i.x + e.y * a.x + e.z * n.x, e.x * i.y + e.y * a.y + e.z * n.y, e.x * i.z + e.y * a.z + e.z * n.z).normalize();
}
//#endregion
//#region src/compute/radiance/art.ts
var Q = { name: "Acoustic Radiance Transfer" }, $ = class extends m {
	uuid;
	roomID;
	sourceIDs;
	receiverIDs;
	maxEdgeLength;
	brdfDetail;
	raysPerShoot;
	maxIterations;
	convergenceThreshold;
	sampleRate;
	frequencies;
	initialEnergy;
	sourceRays;
	lastIterationCount;
	lastPatchCount;
	hasEmittedResults;
	constructor(t = Q) {
		super(t), this.kind = "art", this.name = t.name || Q.name, this.uuid = e();
		let n = c.getState().getRooms();
		this.roomID = t.roomID || (n.length > 0 ? n[0].uuid : ""), this.sourceIDs = t.sourceIDs || [], this.receiverIDs = t.receiverIDs || [], this.maxEdgeLength = t.maxEdgeLength ?? .5, this.brdfDetail = t.brdfDetail ?? 1, this.raysPerShoot = t.raysPerShoot ?? 200, this.maxIterations = t.maxIterations ?? 100, this.convergenceThreshold = t.convergenceThreshold ?? .01, this.sampleRate = t.sampleRate ?? 1e3, this.frequencies = u.slice(4, 11), this.initialEnergy = 500, this.sourceRays = 500, this.lastIterationCount = 0, this.lastPatchCount = 0, this.hasEmittedResults = !1;
	}
	calculate() {
		let e = c.getState().containers, n = e[this.roomID];
		if (!n) {
			console.error("ART: No room found");
			return;
		}
		let r = [], i = [];
		for (let t of this.sourceIDs) {
			let n = e[t];
			n && n.kind === "source" && r.push(n);
		}
		for (let t of this.receiverIDs) {
			let n = e[t];
			n && n.kind === "receiver" && i.push(n);
		}
		if (r.length === 0 || i.length === 0) {
			console.warn("ART: Need at least one source and one receiver");
			return;
		}
		let a = f(this.temperature), o = H(n, this.maxEdgeLength), u = o.patches.length;
		if (this.lastPatchCount = u, u === 0) {
			console.error("ART: Tessellation produced no patches");
			return;
		}
		let p = new w(this.brdfDetail), m = Math.ceil(this.sampleRate * 5);
		for (let e of r) {
			let n = new _();
			e.getWorldPosition(n);
			for (let r of i) {
				let i = new _();
				r.getWorldPosition(i);
				let c = [];
				for (let e of this.frequencies) {
					let t = [], r = [];
					for (let n of o.patches) t.push(n.absorption(e)), r.push(n.scattering(e));
					let s = d([e], this.temperature)[0] / (20 / Math.LN10), l = [], f = [];
					for (let e = 0; e < u; e++) l[e] = new D(p.nSlots, m), f[e] = new D(p.nSlots, m);
					let h = {
						patchSet: o,
						unshotEnergy: l,
						totalEnergy: f,
						brdf: p,
						absorptions: t,
						scatterings: r,
						airAbsNepers: s,
						speedOfSound: a,
						sampleRate: this.sampleRate,
						raysPerShoot: this.raysPerShoot
					};
					q(n, this.initialEnergy, h, this.sourceRays);
					let g = G(l), _ = 0;
					for (; _ < this.maxIterations;) {
						let e = G(l);
						if (g > 0 && e / g < this.convergenceThreshold) break;
						let t = W(l);
						if (l[t].sum() < 1e-20) break;
						K(h, t), _++;
					}
					this.lastIterationCount = _;
					let v = J(i, h);
					c.push(v);
				}
				let f = 0;
				for (let e of c) e.buffer.length > f && (f = e.buffer.length);
				let h = new Float32Array(f);
				for (let e of c) for (let t = 0; t < e.buffer.length; t++) h[t] += e.buffer[t];
				let g = n.distanceTo(i);
				if (g > 1e-6 && h.length > 0) {
					let e = y(this.frequencies), t = d([e], this.temperature)[0], n = x(g, a, this.sampleRate);
					n >= 0 && n < h.length && (h[n] += b({
						energy: this.initialEnergy,
						distance: g,
						airAbsDbPerMeter: t
					}));
				}
				let v = S(h, this.sampleRate), C = e.name || "source", w = r.name || "receiver", T = `${this.uuid}-art-edc-${e.uuid}-${r.uuid}`, E = {
					kind: l.EnergyDecay,
					name: `ART energy: ${C} → ${w}`,
					uuid: T,
					from: this.uuid,
					info: {
						binRate: this.sampleRate,
						units: "energy",
						sourceName: C,
						receiverName: w,
						sourceId: e.uuid,
						receiverId: r.uuid
					},
					data: v.length > 0 ? v : [{
						time: 0,
						amplitude: 0
					}]
				};
				s.getState().results[T] ? t("UPDATE_RESULT", {
					uuid: T,
					result: E
				}) : t("ADD_RESULT", E), this.hasEmittedResults = !0;
			}
		}
	}
	save() {
		let { name: e, kind: t, uuid: n, autoCalculate: r, roomID: i, sourceIDs: a, receiverIDs: o, maxEdgeLength: s, brdfDetail: c, raysPerShoot: l, maxIterations: u, convergenceThreshold: d, sampleRate: f } = this;
		return {
			name: e,
			kind: t,
			uuid: n,
			autoCalculate: r,
			roomID: i,
			sourceIDs: a,
			receiverIDs: o,
			maxEdgeLength: s,
			brdfDetail: c,
			raysPerShoot: l,
			maxIterations: u,
			convergenceThreshold: d,
			sampleRate: f
		};
	}
	restore(e) {
		return super.restore(e), this.kind = e.kind, e.roomID !== void 0 && (this.roomID = e.roomID), e.sourceIDs !== void 0 && (this.sourceIDs = e.sourceIDs), e.receiverIDs !== void 0 && (this.receiverIDs = e.receiverIDs), e.maxEdgeLength !== void 0 && (this.maxEdgeLength = e.maxEdgeLength), e.brdfDetail !== void 0 && (this.brdfDetail = e.brdfDetail), e.raysPerShoot !== void 0 && (this.raysPerShoot = e.raysPerShoot), e.maxIterations !== void 0 && (this.maxIterations = e.maxIterations), e.convergenceThreshold !== void 0 && (this.convergenceThreshold = e.convergenceThreshold), e.sampleRate !== void 0 && (this.sampleRate = e.sampleRate), this;
	}
	get rooms() {
		return c.getState().getRooms();
	}
	get temperature() {
		return this.room?.temperature ?? 20;
	}
	get room() {
		return c.getState().containers[this.roomID];
	}
	get noResults() {
		return !this.hasEmittedResults;
	}
};
o("ADD_ART", r($)), o("REMOVE_ART", n), o("ART_SET_PROPERTY", i), o("CALCULATE_ART", (e) => {
	let t = a.getState().solvers[e];
	t && t.calculate();
});
//#endregion
export { $ as ART, $ as default };

//# sourceMappingURL=art-B40Cytt9.mjs.map