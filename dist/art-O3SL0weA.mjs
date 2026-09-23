import { C as e, a as t, b as n, c as r, n as i, s as a, v as o } from "./FileSaver.min-BS9rdHrk.mjs";
import { a as s, g as c, i as l } from "./store-CUhn0IQy.mjs";
import { n as u } from "./acoustics-SIlOec_Y.mjs";
import { n as d, r as f } from "./convert-GmiMppOk.mjs";
import { i as p, r as m, t as h } from "./air-attenuation-CZldbT4Y.mjs";
import { t as g } from "./sound-speed-CfEkirc1.mjs";
import { t as _ } from "./TessellateModifier-DlSgA920.mjs";
import { t as v } from "./solver-DCp-VMaM.mjs";
import { n as y } from "./arrival-pressure-A8n8xtfD.mjs";
import * as b from "three";
import { IcosahedronGeometry as x, Triangle as S, Vector3 as C } from "three";
//#region src/compute/radiance/direct-path.ts
var w = 1e3;
function T(e) {
	return e.includes(1e3) || e.length === 0 ? w : e[Math.floor(e.length / 2)];
}
function E(e) {
	let { energy: t, distance: n, airAbsDbPerMeter: r } = e;
	return n > 1e-6 ? t * p(r, n) / (n * n) : 0;
}
function D(e, t, n) {
	return Math.round(e / t * n);
}
//#endregion
//#region src/compute/radiance/energy-decay.ts
function O(e, t, n = 2e3) {
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
//#region src/compute/radiance/source-emission.ts
function k(e) {
	return f(d(e));
}
function A(e) {
	let { handler: t, worldDir: n, frequency: r } = e;
	if (!t || n.lengthSq() < 1e-20) return 1;
	let i = t.getPressureAtPosition(0, r, 0, 0);
	return typeof i != "number" || !(i > 0) ? 1 : y(t, [i], e.quaternion ?? new b.Quaternion(), n, [r])[0];
}
//#endregion
//#region src/compute/radiance/brdf.ts
var j = 1, M = class {
	detail;
	directions;
	nSlots;
	coefficients;
	constructor(e = j) {
		this.detail = e;
		let t = new x(1, this.detail).getAttribute("position"), n = /* @__PURE__ */ new Set(), r = [];
		for (let e = 0; e < t.count; e++) {
			let i = t.getX(e), a = t.getY(e), o = t.getZ(e);
			if (o >= 0) {
				let e = new C(i, a, o).normalize(), t = `${e.x.toFixed(6)},${e.y.toFixed(6)},${e.z.toFixed(6)}`;
				n.has(t) || (n.add(t), r.push(e));
			}
		}
		this.directions = r, this.nSlots = r.length, this.coefficients = [];
		for (let e = 0; e < this.nSlots; e++) this.coefficients[e] = new Float32Array(this.nSlots);
	}
	computeCoefficients(e, t) {
		let n = Math.max(0, Math.min(1, Number.isFinite(e) ? e : 0)), r = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0)), i = 1 - n, a = i * r / this.nSlots, o = i * (1 - r);
		for (let e = 0; e < this.nSlots; e++) {
			let t = this.directions[e], n = new C(-t.x, -t.y, t.z).normalize(), r = this.findNearestSlot(n);
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
		let n = N(e, t);
		return n.z < 0 && (n.z = 0), n.lengthSq() < 1e-10 ? 0 : (n.normalize(), this.findNearestSlot(n));
	}
	getOutgoingWeights(e) {
		return this.coefficients[e];
	}
};
function N(e, t) {
	let n = t.clone().normalize(), r = new C(1, 0, 0);
	Math.abs(n.dot(r)) > .9 && (r = new C(0, 1, 0));
	let i = new C().crossVectors(n, r).normalize(), a = new C().crossVectors(n, i).normalize();
	return new C(e.dot(i), e.dot(a), e.dot(n));
}
//#endregion
//#region src/compute/radiance/response.ts
var P = class {
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
}, F = class {
	n;
	responses;
	constructor(e, t) {
		this.n = e, this.responses = [];
		for (let n = 0; n < e; n++) this.responses[n] = new P(t);
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
}, I = class e {
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
}, L = class e {
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
}, R = class e {
	rootNode;
	bboxArray;
	trianglesArray;
	constructor(e, t, n) {
		this.rootNode = e, this.bboxArray = t, this.trianglesArray = n;
	}
	intersectRay(t, n, r = !0) {
		try {
			t = L.fromAny(t), n = L.fromAny(n);
		} catch {
			throw TypeError("Origin or Direction couldn't be converted to a BVHVector3.");
		}
		let i = [this.rootNode], a = [], o = [], s = new L(1 / n.x, 1 / n.y, 1 / n.z);
		for (; i.length > 0;) {
			let n = i.pop();
			if (n && e.intersectNodeBox(t, s, n)) {
				n.node0 && i.push(n.node0), n.node1 && i.push(n.node1);
				for (let e = n.startIndex; e < n.endIndex; e++) a.push(this.bboxArray[e * 7]);
			}
		}
		let c = new L(), l = new L(), u = new L();
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
		var o = new L(), s = new L(), c = new L(), l = new L();
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
}, z = 1e-6;
function B(e, t = 10) {
	if (typeof t != "number") throw Error(`maxTrianglesPerNode must be of type number, got: ${typeof t}`);
	if (t < 1) throw Error(`maxTrianglesPerNode must be greater than or equal to 1, got: ${t}`);
	if (Number.isNaN(t)) throw Error("maxTrianglesPerNode is NaN");
	Number.isInteger(t) || console.warn(`maxTrianglesPerNode is expected to be an integer, got: ${t}`);
	let n;
	if (Array.isArray(e) && e.length === 0 && console.warn("triangles appears to be an array with 0 elements."), J(e)) n = G(e);
	else if (e instanceof Float32Array) n = e;
	else if (ee(e)) n = new Float32Array(e);
	else throw Error(`triangles must be of type Vector[][] | number[] | Float32Array, got: ${typeof e}`);
	let r = W(n), i = new Float32Array(r.length);
	i.set(r);
	var a = n.length / 9, o = U(r, 0, a, z);
	let s = new I(o[0], o[1], 0, a, 0), c = [s], l;
	for (; l = c.pop();) {
		let e = V(l, t, r, i);
		c.push(...e);
	}
	return new R(s, r, n);
}
function V(e, t, n, r) {
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
	H(m, h, e.startIndex, n, r);
	var x = r.subarray(e.startIndex * 7, e.endIndex * 7);
	n.set(x, e.startIndex * 7);
	var S = U(n, _, v, z), C = U(n, y, b, z), w = new I(S[0], S[1], _, v, e.level + 1), T = new I(C[0], C[1], y, b, e.level + 1);
	return e.node0 = w, e.node1 = T, e.clearShapes(), [w, T];
}
function H(e, t, n, r, i) {
	var a = e.concat(t), o = n;
	for (let e = 0; e < a.length; e++) {
		let t = a[e];
		q(r, t, i, o), o++;
	}
}
function U(e, t, n, r = 0) {
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
function W(e) {
	let t = e.length / 9, n = new Float32Array(t * 7);
	for (let r = 0; r < t; r++) {
		let t = r * 9, i = e[t++], a = e[t++], o = e[t++], s = e[t++], c = e[t++], l = e[t++], u = e[t++], d = e[t++], f = e[t];
		K(n, r, r, Math.min(i, s, u), Math.min(a, c, d), Math.min(o, l, f), Math.max(i, s, u), Math.max(a, c, d), Math.max(o, l, f));
	}
	return n;
}
function G(e) {
	let t = new Float32Array(e.length * 9);
	for (let n = 0; n < e.length; n++) {
		let r = e[n][0], i = e[n][1], a = e[n][2], o = n * 9;
		t[o++] = r.x, t[o++] = r.y, t[o++] = r.z, t[o++] = i.x, t[o++] = i.y, t[o++] = i.z, t[o++] = a.x, t[o++] = a.y, t[o] = a.z;
	}
	return t;
}
function K(e, t, n, r, i, a, o, s, c) {
	let l = t * 7;
	e[l++] = n, e[l++] = r, e[l++] = i, e[l++] = a, e[l++] = o, e[l++] = s, e[l] = c;
}
function q(e, t, n, r) {
	let i = r * 7, a = t * 7;
	n[i++] = e[a++], n[i++] = e[a++], n[i++] = e[a++], n[i++] = e[a++], n[i++] = e[a++], n[i++] = e[a++], n[i] = e[a];
}
function J(e) {
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
function ee(e) {
	if (!Array.isArray(e)) return !1;
	for (let t = 0; t < e.length; t++) if (typeof e[t] != "number") return !1;
	return !0;
}
//#endregion
//#region src/compute/radiance/patch.ts
function te(e, t, n) {
	let r = n.clone().sub(t);
	e.dot(r) < 0 && e.negate();
}
function ne(e, t) {
	let n = [], r = [], i = [];
	for (let a of e) {
		let e = new S(a.a, a.b, a.c), o = e.getArea();
		if (o < 1e-10) continue;
		let s = new C();
		e.getMidpoint(s);
		let c = new C();
		e.getNormal(c), t && te(c, s, t);
		let l = n.length;
		n.push({
			index: l,
			centroid: s,
			normal: c,
			area: o,
			vertices: [
				a.a,
				a.b,
				a.c
			],
			surfaceIndex: a.surfaceIndex ?? 0,
			absorption: a.absorption ?? (() => 0),
			scattering: a.scattering ?? (() => 1)
		}), r.push([
			a.a.x,
			a.a.y,
			a.a.z,
			a.b.x,
			a.b.y,
			a.b.z,
			a.c.x,
			a.c.y,
			a.c.z
		]), i.push(l);
	}
	let a = new Float32Array(r.length * 9);
	for (let e = 0; e < r.length; e++) for (let t = 0; t < 9; t++) a[e * 9 + t] = r[e][t];
	return {
		patches: n,
		bvh: B(a),
		triangleToPatch: i
	};
}
function re(e, t) {
	let n = e.allSurfaces, r = [], i = new _(t, 6), a = new C(), o = 0;
	for (let e = 0; e < n.length; e++) {
		let t = n[e], s = t.geometry.clone(), c = i.modify(s).getAttribute("position").array, l = c.length / 9;
		for (let n = 0; n < l; n++) {
			let i = n * 9, s = new C(c[i], c[i + 1], c[i + 2]), l = new C(c[i + 3], c[i + 4], c[i + 5]), u = new C(c[i + 6], c[i + 7], c[i + 8]), d = t.localToWorld(s.clone()), f = t.localToWorld(l.clone()), p = t.localToWorld(u.clone());
			r.push({
				a: d,
				b: f,
				c: p,
				surfaceIndex: e,
				absorption: t.absorptionFunction,
				scattering: t.scatteringFunction || (() => t.scatteringCoefficient)
			}), a.add(d).add(f).add(p), o += 3;
		}
	}
	return ne(r, o > 0 ? a.multiplyScalar(1 / o) : new C());
}
function ie(e) {
	let t = Math.random(), n = Math.random();
	t + n > 1 && (t = 1 - t, n = 1 - n);
	let r = 1 - t - n;
	return new C(e.vertices[0].x * t + e.vertices[1].x * n + e.vertices[2].x * r, e.vertices[0].y * t + e.vertices[1].y * n + e.vertices[2].y * r, e.vertices[0].z * t + e.vertices[1].z * n + e.vertices[2].z * r);
}
//#endregion
//#region src/compute/radiance/form-factor.ts
function Y(e, t) {
	let n = -e.dot(t);
	return n > 0 ? n : 0;
}
function ae(e) {
	let t = -1, n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e[r].sum();
		i > t && (t = i, n = r);
	}
	return n;
}
var X = 1e-4;
function Z(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t += e[n].sum();
	return t;
}
function oe(e, t) {
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
				let l = ie(p).addScaledVector(p.normal, X), h = de(ue(a, n), p.normal), g = d.intersectRay(l, h, !1);
				if (!g || g.length === 0) continue;
				let _ = null, v = Infinity;
				for (let e of g) {
					if (f[e.triangleIndex] === t) continue;
					let n = e.intersectionPoint, r = n.x - l.x, i = n.y - l.y, a = n.z - l.z, o = Math.sqrt(r * r + i * i + a * a);
					o < v && (v = o, _ = e);
				}
				if (!_ || v < 1e-6) continue;
				let b = f[_.triangleIndex], x = u[b];
				if (Y(x.normal, h) <= 0) continue;
				let S = v / s * c, C = Math.exp(-o * v), w = a.getDirectionIndex(h.clone().negate(), x.normal), T = e.absorptions[b], E = e.scatterings[b];
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
function se(e, t, n, r = 500, i) {
	let { patchSet: a, unshotEnergy: o, totalEnergy: s, brdf: c, airAbsNepers: l, speedOfSound: u, sampleRate: d } = n, { patches: f, bvh: p, triangleToPatch: m } = a, h = t / r;
	for (let t = 0; t < r; t++) {
		let t = le(), r = p.intersectRay(e, t, !1);
		if (!r || r.length === 0) continue;
		let a = null, g = Infinity;
		for (let t of r) {
			let n = t.intersectionPoint, r = n.x - e.x, i = n.y - e.y, o = n.z - e.z, s = Math.sqrt(r * r + i * i + o * o);
			s < g && (g = s, a = t);
		}
		if (!a || g < 1e-6) continue;
		let _ = m[a.triangleIndex], v = f[_];
		if (Y(v.normal, t) <= 0) continue;
		let y = g / u * d, b = Math.exp(-l * g), x = t.clone().negate(), S = c.getDirectionIndex(x, v.normal), C = n.absorptions[_], w = n.scatterings[_];
		c.computeCoefficients(C, w);
		let T = c.getOutgoingWeights(S), E = new P(1);
		E.buffer[0] = h * b * (i ? i(t) : 1);
		for (let e = 0; e < c.nSlots; e++) {
			let t = T[e];
			t < 1e-20 || (o[_].responses[e].delayMultiplyAdd(E, y, t), s[_].responses[e].delayMultiplyAdd(E, y, t));
		}
	}
}
function ce(e, t) {
	let { patchSet: n, totalEnergy: r, brdf: i, airAbsNepers: a, speedOfSound: o, sampleRate: s } = t, { patches: c, bvh: l, triangleToPatch: u } = n, d = new P(1);
	for (let t = 0; t < c.length; t++) {
		let n = c[t], f = new C().subVectors(e, n.centroid), p = f.length();
		if (p < 1e-6) continue;
		f.normalize();
		let m = n.normal.dot(f);
		if (m <= 0) continue;
		let h = n.centroid.clone().addScaledVector(n.normal, X), g = l.intersectRay(h, f, !1), _ = !1;
		if (g) for (let e of g) {
			if (u[e.triangleIndex] === t) continue;
			let n = e.intersectionPoint;
			if (new C(n.x - h.x, n.y - h.y, n.z - h.z).length() < p - 1e-4) {
				_ = !0;
				break;
			}
		}
		if (_) continue;
		let v = p / o * s, y = Math.exp(-a * p), b = n.area * m / (p * p), x = i.getDirectionIndex(f, n.normal), S = r[t].responses[x], w = b * y;
		d.delayMultiplyAdd(S, v, w);
	}
	return d;
}
function le() {
	let e = Math.acos(2 * Math.random() - 1), t = 2 * Math.PI * Math.random();
	return new C(Math.sin(e) * Math.cos(t), Math.sin(e) * Math.sin(t), Math.cos(e));
}
function ue(e, t) {
	let n = e.directions[t], r = Math.acos(Math.sqrt(Math.random())) * .5, i = 2 * Math.PI * Math.random(), a = new C(1, 0, 0);
	Math.abs(n.dot(a)) > .9 && (a = new C(0, 1, 0));
	let o = new C().crossVectors(n, a).normalize(), s = new C().crossVectors(n, o).normalize(), c = Math.sin(r), l = Math.cos(r), u = new C().addScaledVector(n, l).addScaledVector(o, c * Math.cos(i)).addScaledVector(s, c * Math.sin(i));
	return u.normalize(), u.z < 0 && (u.z = -u.z), u.normalize(), u;
}
function de(e, t) {
	let n = t.clone().normalize(), r = new C(1, 0, 0);
	Math.abs(n.dot(r)) > .9 && (r = new C(0, 1, 0));
	let i = new C().crossVectors(n, r).normalize(), a = new C().crossVectors(n, i).normalize();
	return new C(e.x * i.x + e.y * a.x + e.z * n.x, e.x * i.y + e.y * a.y + e.z * n.y, e.x * i.z + e.y * a.z + e.z * n.z).normalize();
}
//#endregion
//#region src/compute/radiance/art.ts
var Q = { name: "Acoustic Radiance Transfer" }, $ = class extends v {
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
		let e = c.getState().containers, t = e[this.roomID];
		if (!t) {
			console.error("ART: No room found");
			return;
		}
		let n = [], r = [];
		for (let t of this.sourceIDs) {
			let r = e[t];
			r && r.kind === "source" && n.push(r);
		}
		for (let t of this.receiverIDs) {
			let n = e[t];
			n && n.kind === "receiver" && r.push(n);
		}
		if (n.length === 0 || r.length === 0) {
			console.warn("ART: Need at least one source and one receiver");
			return;
		}
		let i = g(this.temperature), a = re(t, this.maxEdgeLength), u = a.patches.length;
		if (this.lastPatchCount = u, u === 0) {
			console.error("ART: Tessellation produced no patches");
			return;
		}
		let d = new M(this.brdfDetail), f = Math.ceil(this.sampleRate * 5);
		for (let e of n) {
			let t = new C();
			e.getWorldPosition(t);
			for (let n of r) {
				let r = new C();
				n.getWorldPosition(r);
				let c = [];
				for (let n of this.frequencies) {
					let o = [], s = [];
					for (let e of a.patches) o.push(e.absorption(n)), s.push(e.scattering(n));
					let l = m([n], this.temperature)[0], p = h(l), g = [], _ = [];
					for (let e = 0; e < u; e++) g[e] = new F(d.nSlots, f), _[e] = new F(d.nSlots, f);
					let v = {
						patchSet: a,
						unshotEnergy: g,
						totalEnergy: _,
						brdf: d,
						absorptions: o,
						scatterings: s,
						airAbsNepers: p,
						speedOfSound: i,
						sampleRate: this.sampleRate,
						raysPerShoot: this.raysPerShoot
					};
					se(t, k(e.initialSPL), v, this.sourceRays, (t) => A({
						handler: e.directivityHandler,
						quaternion: e.quaternion,
						worldDir: t,
						frequency: n
					}));
					let y = Z(g), b = 0;
					for (; b < this.maxIterations;) {
						let e = Z(g);
						if (y > 0 && e / y < this.convergenceThreshold) break;
						let t = ae(g);
						if (g[t].sum() < 1e-20) break;
						oe(v, t), b++;
					}
					this.lastIterationCount = b;
					let x = ce(r, v);
					c.push(x);
				}
				let p = 0;
				for (let e of c) e.buffer.length > p && (p = e.buffer.length);
				let g = new Float32Array(p);
				for (let e of c) for (let t = 0; t < e.buffer.length; t++) g[t] += e.buffer[t];
				let _ = t.distanceTo(r);
				if (_ > 1e-6 && g.length > 0) {
					let n = T(this.frequencies), a = m([n], this.temperature)[0], o = D(_, i, this.sampleRate);
					if (o >= 0 && o < g.length) {
						let i = r.clone().sub(t), s = A({
							handler: e.directivityHandler,
							quaternion: e.quaternion,
							worldDir: i,
							frequency: n
						});
						g[o] += E({
							energy: k(e.initialSPL) * s,
							distance: _,
							airAbsDbPerMeter: a
						});
					}
				}
				let v = O(g, this.sampleRate), y = e.name || "source", b = n.name || "receiver", x = `${this.uuid}-art-edc-${e.uuid}-${n.uuid}`, S = {
					kind: l.EnergyDecay,
					name: `ART energy: ${y} → ${b}`,
					uuid: x,
					from: this.uuid,
					info: {
						binRate: this.sampleRate,
						units: "energy",
						sourceName: y,
						receiverName: b,
						sourceId: e.uuid,
						receiverId: n.uuid
					},
					data: v.length > 0 ? v : [{
						time: 0,
						amplitude: 0
					}]
				};
				s.getState().results[x] ? o("UPDATE_RESULT", {
					uuid: x,
					result: S
				}) : o("ADD_RESULT", S), this.hasEmittedResults = !0;
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
n("ADD_ART", i($)), n("REMOVE_ART", t), n("ART_SET_PROPERTY", a), n("CALCULATE_ART", (e) => {
	let t = r.getState().solvers[e];
	t && t.calculate();
});
//#endregion
export { $ as ART, $ as default };

//# sourceMappingURL=art-O3SL0weA.mjs.map