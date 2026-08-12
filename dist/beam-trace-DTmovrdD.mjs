import { C as e, a as t, b as n, c as r, k as i, m as a, n as o, s, t as c, v as l } from "./FileSaver.min-BS9rdHrk.mjs";
import { t as u } from "./renderer-BeKP35ez.mjs";
import { a as d, g as f, i as p } from "./store-DRnKXLf0.mjs";
import { n as m, r as h, t as g } from "./audio-engine-BVaMF_Iu.mjs";
import "./acoustics-BPdIidDA.mjs";
import { a as _, c as v, n as ee, o as y, s as b } from "./room-ioMGbMK5.mjs";
import { _ as te, c as x, f as S, g as ne, h as re, l as C, m as w, p as T, s as E, t as ie, u as D, v as ae } from "./quick-estimate-BicDl9SO.mjs";
import { t as oe } from "./air-attenuation-DrZYpv8D.mjs";
import { t as se } from "./sound-speed-CfEkirc1.mjs";
import { t as ce } from "./solver-DCp-VMaM.mjs";
import { a as le, i as ue, n as de, r as fe, t as pe } from "./export-playback-BtFAijfR.mjs";
import * as O from "three";
import k from "chroma-js";
import { MeshLine as me, MeshLineMaterial as he } from "three.meshline";
Math.PI / 2 - 5 * Math.PI / 180;
//#endregion
//#region node_modules/beam-trace/dist/core/vector3.js
var A = {
	create(e, t, n) {
		return [
			e,
			t,
			n
		];
	},
	zero() {
		return [
			0,
			0,
			0
		];
	},
	clone(e) {
		return [
			e[0],
			e[1],
			e[2]
		];
	},
	add(e, t) {
		return [
			e[0] + t[0],
			e[1] + t[1],
			e[2] + t[2]
		];
	},
	subtract(e, t) {
		return [
			e[0] - t[0],
			e[1] - t[1],
			e[2] - t[2]
		];
	},
	scale(e, t) {
		return [
			e[0] * t,
			e[1] * t,
			e[2] * t
		];
	},
	negate(e) {
		return [
			-e[0],
			-e[1],
			-e[2]
		];
	},
	dot(e, t) {
		return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
	},
	cross(e, t) {
		return [
			e[1] * t[2] - e[2] * t[1],
			e[2] * t[0] - e[0] * t[2],
			e[0] * t[1] - e[1] * t[0]
		];
	},
	lengthSquared(e) {
		return e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
	},
	length(e) {
		return Math.sqrt(A.lengthSquared(e));
	},
	normalize(e) {
		let t = A.length(e);
		return t < 1e-10 ? [
			0,
			0,
			0
		] : [
			e[0] / t,
			e[1] / t,
			e[2] / t
		];
	},
	lerp(e, t, n) {
		return [
			e[0] + n * (t[0] - e[0]),
			e[1] + n * (t[1] - e[1]),
			e[2] + n * (t[2] - e[2])
		];
	},
	distance(e, t) {
		return A.length(A.subtract(e, t));
	},
	distanceSquared(e, t) {
		return A.lengthSquared(A.subtract(e, t));
	},
	equals(e, t, n = 1e-10) {
		return Math.abs(e[0] - t[0]) < n && Math.abs(e[1] - t[1]) < n && Math.abs(e[2] - t[2]) < n;
	},
	min(e, t) {
		return [
			Math.min(e[0], t[0]),
			Math.min(e[1], t[1]),
			Math.min(e[2], t[2])
		];
	},
	max(e, t) {
		return [
			Math.max(e[0], t[0]),
			Math.max(e[1], t[1]),
			Math.max(e[2], t[2])
		];
	},
	reflect(e, t) {
		let n = 2 * A.dot(e, t);
		return A.subtract(e, A.scale(t, n));
	},
	project(e, t) {
		let n = A.lengthSquared(t);
		if (n < 1e-10) return [
			0,
			0,
			0
		];
		let r = A.dot(e, t) / n;
		return A.scale(t, r);
	},
	reject(e, t) {
		return A.subtract(e, A.project(e, t));
	},
	toString(e, t = 4) {
		return `[${e[0].toFixed(t)}, ${e[1].toFixed(t)}, ${e[2].toFixed(t)}]`;
	}
}, j = {
	fromNormalAndPoint(e, t) {
		let n = A.normalize(e), r = -A.dot(n, t);
		return {
			a: n[0],
			b: n[1],
			c: n[2],
			d: r
		};
	},
	fromPoints(e, t, n) {
		let r = A.subtract(t, e), i = A.subtract(n, e), a = A.normalize(A.cross(r, i));
		return j.fromNormalAndPoint(a, e);
	},
	create(e, t, n, r) {
		return {
			a: e,
			b: t,
			c: n,
			d: r
		};
	},
	normal(e) {
		return [
			e.a,
			e.b,
			e.c
		];
	},
	signedDistance(e, t) {
		return t.a * e[0] + t.b * e[1] + t.c * e[2] + t.d;
	},
	distance(e, t) {
		return Math.abs(j.signedDistance(e, t));
	},
	classifyPoint(e, t, n = 1e-6) {
		let r = j.signedDistance(e, t);
		return r > n ? "front" : r < -n ? "back" : "on";
	},
	isPointInFront(e, t, n = 1e-6) {
		return j.signedDistance(e, t) > n;
	},
	isPointBehind(e, t, n = 1e-6) {
		return j.signedDistance(e, t) < -n;
	},
	isPointOn(e, t, n = 1e-6) {
		return Math.abs(j.signedDistance(e, t)) <= n;
	},
	mirrorPoint(e, t) {
		let n = j.signedDistance(e, t), r = j.normal(t);
		return A.subtract(e, A.scale(r, 2 * n));
	},
	mirrorPlane(e, t) {
		let n = j.normal(e), r;
		r = Math.abs(n[2]) > .5 ? [
			0,
			0,
			-e.d / e.c
		] : Math.abs(n[1]) > .5 ? [
			0,
			-e.d / e.b,
			0
		] : [
			-e.d / e.a,
			0,
			0
		];
		let i = Math.abs(n[0]) < .9 ? [
			1,
			0,
			0
		] : [
			0,
			1,
			0
		], a = A.normalize(A.cross(n, i)), o = A.add(r, a), s = A.cross(n, a), c = A.add(r, s), l = j.mirrorPoint(r, t), u = j.mirrorPoint(o, t), d = j.mirrorPoint(c, t);
		return j.fromPoints(l, u, d);
	},
	flip(e) {
		return {
			a: -e.a,
			b: -e.b,
			c: -e.c,
			d: -e.d
		};
	},
	rayIntersection(e, t, n) {
		let r = j.normal(n), i = A.dot(r, t);
		return Math.abs(i) < 1e-10 ? null : -(A.dot(r, e) + n.d) / i;
	},
	rayIntersectionPoint(e, t, n) {
		let r = j.rayIntersection(e, t, n);
		return r === null ? null : A.add(e, A.scale(t, r));
	},
	projectPoint(e, t) {
		let n = j.signedDistance(e, t), r = j.normal(t);
		return A.subtract(e, A.scale(r, n));
	},
	equals(e, t, n = 1e-6) {
		let r = e.a * t.a + e.b * t.b + e.c * t.c;
		return Math.abs(r - 1) < n ? Math.abs(e.d - t.d) < n : Math.abs(r + 1) < n && Math.abs(e.d + t.d) < n;
	},
	toString(e, t = 4) {
		return `Plane3D(${e.a.toFixed(t)}x + ${e.b.toFixed(t)}y + ${e.c.toFixed(t)}z + ${e.d.toFixed(t)} = 0)`;
	}
}, M = {
	create(e, t) {
		if (e.length < 3) throw Error("Polygon requires at least 3 vertices");
		let n = e.map((e) => A.clone(e));
		return {
			vertices: n,
			plane: j.fromPoints(n[0], n[1], n[2]),
			materialId: t
		};
	},
	createWithPlane(e, t, n) {
		if (e.length < 3) throw Error("Polygon requires at least 3 vertices");
		return {
			vertices: e.map((e) => A.clone(e)),
			plane: t,
			materialId: n
		};
	},
	vertexCount(e) {
		return e.vertices.length;
	},
	centroid(e) {
		let t = [
			0,
			0,
			0
		];
		for (let n of e.vertices) t[0] += n[0], t[1] += n[1], t[2] += n[2];
		let n = e.vertices.length;
		return [
			t[0] / n,
			t[1] / n,
			t[2] / n
		];
	},
	area(e) {
		if (e.vertices.length < 3) return 0;
		let t = [
			0,
			0,
			0
		], n = e.vertices[0];
		for (let r = 1; r < e.vertices.length - 1; r++) {
			let i = e.vertices[r], a = e.vertices[r + 1], o = A.cross(A.subtract(i, n), A.subtract(a, n));
			t = A.add(t, o);
		}
		return .5 * A.length(t);
	},
	normal(e) {
		return j.normal(e.plane);
	},
	edges(e) {
		let t = [];
		for (let n = 0; n < e.vertices.length; n++) {
			let r = (n + 1) % e.vertices.length;
			t.push([e.vertices[n], e.vertices[r]]);
		}
		return t;
	},
	classify(e, t, n = 1e-6) {
		let r = 0, i = 0;
		for (let a of e.vertices) {
			let e = j.classifyPoint(a, t, n);
			e === "front" ? r++ : e === "back" && i++;
		}
		return r > 0 && i > 0 ? "spanning" : r > 0 ? "front" : i > 0 ? "back" : "coplanar";
	},
	containsPoint(e, t, n = 1e-6) {
		let r = j.normal(e.plane), i = e.vertices.length;
		for (let a = 0; a < i; a++) {
			let o = e.vertices[a], s = e.vertices[(a + 1) % i], c = A.subtract(s, o), l = A.subtract(t, o), u = A.cross(c, l);
			if (A.dot(u, r) < -n) return !1;
		}
		return !0;
	},
	rayIntersection(e, t, n, r = 1e-4) {
		let i = j.rayIntersection(e, t, n.plane);
		if (i === null || i < 0) return null;
		let a = A.add(e, A.scale(t, i));
		return M.containsPoint(n, a, r) ? {
			t: i,
			point: a
		} : null;
	},
	boundingBox(e) {
		let t = [
			Infinity,
			Infinity,
			Infinity
		], n = [
			-Infinity,
			-Infinity,
			-Infinity
		];
		for (let r of e.vertices) t[0] = Math.min(t[0], r[0]), t[1] = Math.min(t[1], r[1]), t[2] = Math.min(t[2], r[2]), n[0] = Math.max(n[0], r[0]), n[1] = Math.max(n[1], r[1]), n[2] = Math.max(n[2], r[2]);
		return {
			min: t,
			max: n
		};
	},
	isDegenerate(e, t = 1e-10) {
		return e.vertices.length < 3 || M.area(e) < t;
	},
	flip(e) {
		return {
			vertices: [...e.vertices].reverse(),
			plane: j.flip(e.plane),
			materialId: e.materialId
		};
	},
	clone(e) {
		return {
			vertices: e.vertices.map((e) => A.clone(e)),
			plane: { ...e.plane },
			materialId: e.materialId
		};
	},
	toString(e) {
		let t = e.vertices.map((e) => A.toString(e, 2)).join(", ");
		return `Polygon3D(${e.vertices.length} vertices: [${t}])`;
	}
};
//#endregion
//#region node_modules/beam-trace/dist/geometry/polygon-split.js
function N(e, t, n = 1e-4) {
	let r = M.classify(e, t, n);
	if (r === "front" || r === "coplanar") return {
		front: e,
		back: null
	};
	if (r === "back") return {
		front: null,
		back: e
	};
	let i = [], a = [], o = e.vertices.length;
	for (let r = 0; r < o; r++) {
		let s = e.vertices[r], c = e.vertices[(r + 1) % o], l = j.signedDistance(s, t), u = j.signedDistance(c, t), d = l > n ? "front" : l < -n ? "back" : "on", f = u > n ? "front" : u < -n ? "back" : "on";
		if (d === "front" ? i.push(s) : (d === "back" || i.push(s), a.push(s)), d === "front" && f === "back" || d === "back" && f === "front") {
			let e = l / (l - u), t = A.lerp(s, c, e);
			i.push(t), a.push(t);
		}
	}
	return {
		front: i.length >= 3 ? M.createWithPlane(i, e.plane, e.materialId) : null,
		back: a.length >= 3 ? M.createWithPlane(a, e.plane, e.materialId) : null
	};
}
//#endregion
//#region node_modules/beam-trace/dist/geometry/clipping3d.js
function P(e, t, n = 1e-4) {
	let r = e.vertices, i = [];
	if (r.length < 3) return null;
	for (let e = 0; e < r.length; e++) {
		let a = r[e], o = r[(e + 1) % r.length], s = j.signedDistance(a, t), c = j.signedDistance(o, t), l = s >= -n, u = c >= -n;
		if (l && i.push(a), l && !u || !l && u) {
			let e = s / (s - c), t = A.lerp(a, o, Math.max(0, Math.min(1, e)));
			i.push(t);
		}
	}
	return i.length < 3 ? null : M.createWithPlane(i, e.plane, e.materialId);
}
function F(e, t, n = 1e-4) {
	let r = e;
	for (let e of t) {
		if (!r) return null;
		r = P(r, e, n);
	}
	return r;
}
function I(e, t, n = 1e-4) {
	for (let r of t) {
		let t = !0;
		for (let i of e.vertices) if (j.signedDistance(i, r) >= -n) {
			t = !1;
			break;
		}
		if (t) return !0;
	}
	return !1;
}
//#endregion
//#region node_modules/beam-trace/dist/structures/bsp3d.js
function L(e) {
	return e.length === 0 ? null : R(e.map((e, t) => ({
		polygon: e,
		originalId: t
	})));
}
function R(e) {
	if (e.length === 0) return null;
	let t = ge(e), n = e[t], r = n.polygon.plane, i = [], a = [];
	for (let n = 0; n < e.length; n++) {
		if (n === t) continue;
		let o = e[n], { front: s, back: c } = N(o.polygon, r);
		s && i.push({
			polygon: s,
			originalId: o.originalId
		}), c && a.push({
			polygon: c,
			originalId: o.originalId
		});
	}
	return {
		plane: r,
		polygon: n.polygon,
		polygonId: n.originalId,
		front: R(i),
		back: R(a)
	};
}
function ge(e) {
	if (e.length <= 3) return 0;
	let t = 0, n = Infinity, r = Math.min(e.length, 10), i = Math.max(1, Math.floor(e.length / r));
	for (let r = 0; r < e.length; r += i) {
		let i = e[r].polygon.plane, a = 0, o = 0, s = 0;
		for (let t = 0; t < e.length; t++) {
			if (r === t) continue;
			let n = M.classify(e[t].polygon, i);
			n === "front" ? a++ : n === "back" ? o++ : n === "spanning" && (a++, o++, s++);
		}
		let c = s * 8 + Math.abs(a - o);
		c < n && (n = c, t = r);
	}
	return t;
}
function z(e, t, n, r = 0, i = Infinity, a = -1) {
	if (!n) return null;
	let o = j.signedDistance(e, n.plane), s = j.normal(n.plane), c = A.dot(s, t), l, u;
	o >= 0 ? (l = n.front, u = n.back) : (l = n.back, u = n.front);
	let d = null;
	Math.abs(c) > 1e-10 && (d = -o / c);
	let f = null;
	if (d === null || d < r) {
		if (f = z(e, t, l, r, i, a), !f && n.polygonId !== a) {
			let a = M.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f ||= z(e, t, u, r, i, a);
	} else if (d > i) {
		if (f = z(e, t, l, r, i, a), !f && n.polygonId !== a) {
			let a = M.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f ||= z(e, t, u, r, i, a);
	} else {
		if (f = z(e, t, l, r, d, a), !f && n.polygonId !== a) {
			let a = M.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f ||= z(e, t, u, d, i, a);
	}
	return f;
}
var B = 0;
function V(e, t, n, r, i, a) {
	if (!n) return null;
	"  ".repeat(B);
	let o = j.signedDistance(e, n.plane), s = j.normal(n.plane), c = A.dot(s, t), l, u;
	o >= 0 ? (l = n.front, u = n.back) : (l = n.back, u = n.front);
	let d = null;
	Math.abs(c) > 1e-10 && (d = -o / c);
	let f = null;
	if (d === null || d < r) {
		if (B++, f = V(e, t, l, r, i, a), B--, !f && !a.has(n.polygonId)) {
			let a = M.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f || (B++, f = V(e, t, u, r, i, a), B--);
	} else if (d > i) {
		if (B++, f = V(e, t, l, r, i, a), B--, !f && !a.has(n.polygonId)) {
			let a = M.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f || (B++, f = V(e, t, u, r, i, a), B--);
	} else {
		if (B++, f = V(e, t, l, r, d, a), B--, !f && !a.has(n.polygonId)) {
			let a = M.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f || (B++, f = V(e, t, u, d, i, a), B--);
	}
	return f;
}
//#endregion
//#region node_modules/beam-trace/dist/structures/beam3d.js
function H(e, t) {
	let n = [], r = M.edges(t), i = M.centroid(t);
	for (let [t, a] of r) {
		let r = j.fromPoints(e, t, a);
		j.signedDistance(i, r) < 0 && (r = j.flip(r)), n.push(r);
	}
	let a = t.plane;
	return j.signedDistance(e, a) > 0 && (a = j.flip(a)), n.push(a), n;
}
function U(e, t) {
	return j.mirrorPoint(e, t.plane);
}
function W(e, t) {
	let n = M.centroid(e), r = A.subtract(t, n), i = j.normal(e.plane);
	return A.dot(i, r) > 0;
}
//#endregion
//#region node_modules/beam-trace/dist/structures/beamtree3d.js
var _e = 1e-6;
function ve(e, t, n) {
	let r = {
		id: -1,
		parent: null,
		virtualSource: A.clone(e),
		children: []
	};
	if (n >= 1) for (let i = 0; i < t.length; i++) {
		let a = t[i];
		if (!W(a, e)) continue;
		let o = U(e, a), s = H(o, a), c = {
			id: i,
			parent: r,
			virtualSource: o,
			aperture: M.clone(a),
			boundaryPlanes: s,
			children: []
		};
		r.children.push(c), n > 1 && G(c, t, 2, n);
	}
	let i = [];
	return K(r, i), {
		root: r,
		leafNodes: i,
		polygons: t,
		maxReflectionOrder: n
	};
}
function G(e, t, n, r) {
	if (!(n > r) && !(!e.boundaryPlanes || !e.aperture)) for (let i = 0; i < t.length; i++) {
		if (i === e.id) continue;
		let a = t[i];
		if (I(a, e.boundaryPlanes) || !W(a, e.virtualSource)) continue;
		let o = F(a, e.boundaryPlanes);
		if (!o || M.area(o) < _e) continue;
		let s = U(e.virtualSource, a), c = H(s, o), l = {
			id: i,
			parent: e,
			virtualSource: s,
			aperture: o,
			boundaryPlanes: c,
			children: []
		};
		e.children.push(l), n < r && G(l, t, n + 1, r);
	}
}
function K(e, t) {
	e.children.length === 0 && e.id !== -1 && t.push(e);
	for (let n of e.children) K(n, t);
}
function ye(e) {
	q(e.root);
}
function q(e) {
	e.failPlane = void 0, e.failPlaneType = void 0;
	for (let t of e.children) q(t);
}
//#endregion
//#region node_modules/beam-trace/dist/optimization/failplane3d.js
function be(e, t, n) {
	if (!t.aperture || !t.boundaryPlanes) return null;
	let r = n[t.id].plane;
	if (j.signedDistance(t.virtualSource, r) < 0 && (r = j.flip(r)), j.signedDistance(e, r) < 0) return {
		plane: r,
		type: "polygon",
		nodeDepth: J(t)
	};
	let i = t.boundaryPlanes.length - 1;
	for (let n = 0; n < t.boundaryPlanes.length; n++) {
		let r = t.boundaryPlanes[n];
		if (j.signedDistance(e, r) < 0) return {
			plane: r,
			type: n < i ? "edge" : "aperture",
			nodeDepth: J(t)
		};
	}
	return null;
}
function J(e) {
	let t = 0, n = e;
	for (; n && n.id !== -1;) t++, n = n.parent;
	return t;
}
function xe(e, t) {
	return j.signedDistance(e, t) < 0;
}
function Se(e, t = 16) {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push({
		id: n.length,
		nodes: e.slice(r, Math.min(r + t, e.length)),
		skipSphere: null
	});
	return n;
}
function Ce(e, t) {
	return A.distance(e, t.center) < t.radius;
}
function we(e, t) {
	return t.skipSphere ? Ce(e, t.skipSphere) ? "inside" : "outside" : "none";
}
function Te(e, t) {
	let n = Infinity;
	for (let r of t) {
		if (!r.failPlane) return null;
		let t = Math.abs(j.signedDistance(e, r.failPlane));
		n = Math.min(n, t);
	}
	return n === Infinity || n <= 1e-10 ? null : {
		center: A.clone(e),
		radius: n
	};
}
function Y(e) {
	e.skipSphere = null;
}
function Ee(e) {
	for (let t of e.nodes) t.failPlane = void 0, t.failPlaneType = void 0;
}
//#endregion
//#region node_modules/beam-trace/dist/solver/solver3d.js
var De = class {
	constructor(e, t, n = {}) {
		let r = n.maxReflectionOrder ?? 5, i = n.bucketSize ?? 16;
		this.polygons = e, this.sourcePosition = A.clone(t), this.epsilon = n.epsilon ?? 1e-4, this.bspRoot = L(e), this.beamTree = ve(t, e, r), this.buckets = Se(this.beamTree.leafNodes, i), this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = this.beamTree.leafNodes.length, this.metrics.bucketsTotal = this.buckets.length;
	}
	getPaths(e) {
		this.resetMetrics();
		let t = [], n = this.validateDirectPath(e);
		n && t.push(n);
		let r = this.findIntermediatePaths(e, this.beamTree.root);
		t.push(...r);
		for (let n of this.buckets) {
			let r = we(e, n);
			if (r === "inside") {
				this.metrics.bucketsSkipped++;
				continue;
			}
			r === "outside" && (Y(n), Ee(n)), this.metrics.bucketsChecked++;
			let i = !0, a = !0;
			for (let r of n.nodes) {
				if (r.failPlane && xe(e, r.failPlane)) {
					this.metrics.failPlaneCacheHits++;
					continue;
				}
				r.failPlane && (r.failPlane = void 0, r.failPlaneType = void 0, this.metrics.failPlaneCacheMisses++);
				let n = this.validatePath(e, r);
				n.valid && n.path ? (t.push(n.path), i = !1, a = !1) : r.failPlane || (a = !1);
			}
			i && a && n.nodes.length > 0 && (n.skipSphere = Te(e, n.nodes), n.skipSphere && this.metrics.skipSphereCount++);
		}
		return this.metrics.validPathCount = t.length, t;
	}
	getDetailedPaths(e) {
		return this.getPaths(e).map((e) => Me(e, this.polygons));
	}
	validateDirectPath(e) {
		let t = A.subtract(this.sourcePosition, e), n = A.length(t), r = A.normalize(t);
		this.metrics.raycastCount++;
		let i = z(e, r, this.bspRoot, 0, n, -1);
		return i && i.t < n - this.epsilon ? null : [{
			position: A.clone(e),
			polygonId: null
		}, {
			position: A.clone(this.sourcePosition),
			polygonId: null
		}];
	}
	findIntermediatePaths(e, t) {
		let n = [];
		for (let r of t.children) r.children.length > 0 && n.push(...this.findIntermediatePaths(e, r));
		if (t.id !== -1 && t.aperture) {
			let r = this.traverseBeam(e, t);
			r && n.push(r);
		}
		return n;
	}
	traverseBeam(e, t, n = !1) {
		let r = [{
			position: A.clone(e),
			polygonId: null
		}], i = [], a = t;
		for (; a && a.id !== -1;) i.unshift(a.id), a = a.parent;
		n && (console.log(`[traverseBeam] Exploring beam with polygonPath: [${i.join(", ")}]`), console.log(`  Listener: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`  Virtual source: [${t.virtualSource[0].toFixed(3)}, ${t.virtualSource[1].toFixed(3)}, ${t.virtualSource[2].toFixed(3)}]`));
		let o = e, s = t, c = /* @__PURE__ */ new Set(), l = 0;
		for (; s && s.id !== -1;) {
			let e = this.polygons[s.id], t = s.virtualSource, i = A.normalize(A.subtract(t, o)), a = M.rayIntersection(o, i, e);
			if (!a) return n && console.log(`  [Segment ${l}] FAIL: No intersection with polygon ${s.id}`), null;
			n && (console.log(`  [Segment ${l}] Ray from [${o[0].toFixed(3)}, ${o[1].toFixed(3)}, ${o[2].toFixed(3)}]`), console.log(`    Direction: [${i[0].toFixed(3)}, ${i[1].toFixed(3)}, ${i[2].toFixed(3)}]`), console.log(`    Hit polygon ${s.id} at t=${a.t.toFixed(3)}, point=[${a.point[0].toFixed(3)}, ${a.point[1].toFixed(3)}, ${a.point[2].toFixed(3)}]`)), c.add(s.id), this.metrics.raycastCount++;
			let u = V(o, i, this.bspRoot, this.epsilon, a.t - this.epsilon, c);
			if (u) return n && (console.log(`    OCCLUDED by polygon ${u.polygonId} at t=${u.t.toFixed(3)}, point=[${u.point[0].toFixed(3)}, ${u.point[1].toFixed(3)}, ${u.point[2].toFixed(3)}]`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`)), null;
			n && console.log(`    OK - no occlusion (ignoreIds: [${Array.from(c).join(", ")}])`), r.push({
				position: A.clone(a.point),
				polygonId: s.id
			}), o = a.point, s = s.parent, l++;
		}
		if (s) {
			let e = A.normalize(A.subtract(s.virtualSource, o)), t = A.distance(s.virtualSource, o);
			if (n) {
				console.log(`  [Final segment] Ray from [${o[0].toFixed(3)}, ${o[1].toFixed(3)}, ${o[2].toFixed(3)}]`), console.log(`    To source: [${s.virtualSource[0].toFixed(3)}, ${s.virtualSource[1].toFixed(3)}, ${s.virtualSource[2].toFixed(3)}]`), console.log(`    Direction: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`    Distance: ${t.toFixed(3)}`), console.log(`    tMin: ${this.epsilon}, tMax: ${(t - this.epsilon).toFixed(6)}`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`);
				let n = o, r = s.virtualSource;
				if (n[1] < 5.575 && r[1] > 5.575 || n[1] > 5.575 && r[1] < 5.575) {
					let t = (5.575 - n[1]) / (r[1] - n[1]), i = n[0] + t * (r[0] - n[0]), a = n[2] + t * (r[2] - n[2]);
					if (console.log(`    CROSSING y=5.575 at t=${t.toFixed(3)}, x=${i.toFixed(3)}, z=${a.toFixed(3)}`), console.log("    back1 spans: x=[6.215, 12.43], z=[0, 4.877]"), i >= 6.215 && i <= 12.43 && a >= 0 && a <= 4.877) {
						console.log("    *** SHOULD HIT back1 (polygons 3, 4) ***"), console.log("    Direct polygon intersection test:");
						for (let t of [3, 4]) {
							let n = this.polygons[t], r = M.rayIntersection(o, e, n);
							r ? console.log(`      Polygon ${t}: HIT at t=${r.t.toFixed(3)}, point=[${r.point[0].toFixed(3)}, ${r.point[1].toFixed(3)}, ${r.point[2].toFixed(3)}]`) : (console.log(`      Polygon ${t}: NO HIT`), console.log(`        Vertices: ${n.vertices.map((e) => `[${e[0].toFixed(2)}, ${e[1].toFixed(2)}, ${e[2].toFixed(2)}]`).join(", ")}`));
						}
					}
				}
			}
			this.metrics.raycastCount++;
			let i = this.epsilon, a = t - this.epsilon, l = V(o, e, this.bspRoot, i, a, c);
			if (l) return n && console.log(`    OCCLUDED by polygon ${l.polygonId} at t=${l.t.toFixed(3)}, point=[${l.point[0].toFixed(3)}, ${l.point[1].toFixed(3)}, ${l.point[2].toFixed(3)}]`), null;
			n && console.log("    OK - path valid!"), r.push({
				position: A.clone(s.virtualSource),
				polygonId: null
			});
		}
		return r;
	}
	validatePath(e, t) {
		let n = this.traverseBeam(e, t);
		if (n) return {
			valid: !0,
			path: n
		};
		let r = be(e, t, this.polygons);
		return r && (t.failPlane = r.plane, t.failPlaneType = r.type), {
			valid: !1,
			path: null
		};
	}
	getMetrics() {
		return { ...this.metrics };
	}
	debugBeamPath(e, t) {
		console.log("=== DEBUG BEAM PATH ==="), console.log(`Listener: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`Polygon path: [${t.join(", ")}]`), console.log(`Source: [${this.sourcePosition[0].toFixed(3)}, ${this.sourcePosition[1].toFixed(3)}, ${this.sourcePosition[2].toFixed(3)}]`);
		let n = (e, t, r) => {
			if (r === t.length) return e;
			for (let i of e.children) if (i.id === t[r]) return n(i, t, r + 1);
			return null;
		}, r = n(this.beamTree.root, t, 0);
		if (!r) {
			console.log("ERROR: Could not find beam node for this polygon path");
			return;
		}
		console.log(`Found beam node with virtual source: [${r.virtualSource[0].toFixed(3)}, ${r.virtualSource[1].toFixed(3)}, ${r.virtualSource[2].toFixed(3)}]`);
		let i = this.traverseBeam(e, r, !0);
		if (i) {
			console.log("PATH VALID - returned path:");
			for (let e = 0; e < i.length; e++) {
				let t = i[e];
				console.log(`  [${e}] pos=[${t.position[0].toFixed(3)}, ${t.position[1].toFixed(3)}, ${t.position[2].toFixed(3)}], polygonId=${t.polygonId}`);
			}
		} else console.log("PATH INVALID");
		console.log("=== END DEBUG ===");
	}
	clearCache() {
		ye(this.beamTree);
		for (let e of this.buckets) Y(e);
	}
	getLeafNodeCount() {
		return this.beamTree.leafNodes.length;
	}
	getMaxReflectionOrder() {
		return this.beamTree.maxReflectionOrder;
	}
	getSourcePosition() {
		return A.clone(this.sourcePosition);
	}
	getBeamsForVisualization(e) {
		let t = [], n = e ?? this.beamTree.maxReflectionOrder, r = (e, i, a) => {
			if (i > n) return;
			let o = e.id === -1 ? a : [...a, e.id];
			e.id !== -1 && e.aperture && t.push({
				virtualSource: A.clone(e.virtualSource),
				apertureVertices: e.aperture.vertices.map((e) => A.clone(e)),
				reflectionOrder: i,
				polygonId: e.id,
				polygonPath: o
			});
			for (let t of e.children) r(t, i + 1, o);
		};
		return r(this.beamTree.root, 0, []), t;
	}
	createEmptyMetrics() {
		return {
			totalLeafNodes: 0,
			bucketsTotal: 0,
			bucketsSkipped: 0,
			bucketsChecked: 0,
			failPlaneCacheHits: 0,
			failPlaneCacheMisses: 0,
			raycastCount: 0,
			skipSphereCount: 0,
			validPathCount: 0
		};
	}
	resetMetrics() {
		let e = this.metrics.totalLeafNodes, t = this.metrics.bucketsTotal;
		this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = e, this.metrics.bucketsTotal = t;
	}
};
function X(e) {
	let t = 0;
	for (let n = 1; n < e.length; n++) t += A.distance(e[n - 1].position, e[n].position);
	return t;
}
function Oe(e, t = 343) {
	return X(e) / t;
}
function ke(e) {
	return e.filter((e) => e.polygonId !== null).length;
}
var Z = .05;
function Ae(e, t) {
	let n = Math.abs(A.dot(A.negate(e), t));
	return Math.acos(Math.max(-1, Math.min(1, n)));
}
function je(e, t) {
	let n = j.normal(e.plane);
	return A.dot(t, n) > 0 ? A.negate(n) : A.clone(n);
}
function Me(e, t) {
	if (e.length < 2) throw Error("Path must have at least 2 points (listener and source)");
	let n = A.clone(e[0].position), r = A.clone(e[e.length - 1].position), i = [], a = [], o = 0;
	for (let n = 0; n < e.length - 1; n++) {
		let r = e[n].position, s = e[n + 1].position, c = A.distance(r, s);
		a.push({
			startPoint: A.clone(r),
			endPoint: A.clone(s),
			length: c,
			segmentIndex: n
		});
		let l = e[n + 1].polygonId;
		if (l !== null) {
			let a = t[l], s = e[n + 1].position, u = A.normalize(A.subtract(s, r)), d = e[n + 2]?.position, f;
			f = d ? A.normalize(A.subtract(d, s)) : A.reflect(u, j.normal(a.plane));
			let p = je(a, u), m = Ae(u, p), h = m;
			o += c;
			let g = Math.abs(m - Math.PI / 2) < Z;
			i.push({
				polygon: a,
				polygonId: l,
				hitPoint: A.clone(s),
				incidenceAngle: m,
				reflectionAngle: h,
				incomingDirection: u,
				outgoingDirection: f,
				surfaceNormal: p,
				reflectionOrder: i.length + 1,
				cumulativeDistance: o,
				incomingSegmentLength: c,
				isGrazing: g
			});
		} else o += c;
	}
	return {
		listenerPosition: n,
		sourcePosition: r,
		totalPathLength: o,
		reflectionCount: i.length,
		reflections: i,
		segments: a,
		simplePath: e
	};
}
//#endregion
//#region node_modules/beam-trace/dist/beamtrace3d.js
var Ne = class {
	constructor(e) {
		this.position = A.clone(e);
	}
}, Pe = class {
	constructor(e, t, n) {
		this.source = t, this.solver = new De(e, t.position, n);
	}
	getPaths(e) {
		let t = Array.isArray(e) ? e : e.position;
		return this.solver.getPaths(t);
	}
	getDetailedPaths(e) {
		let t = Array.isArray(e) ? e : e.position;
		return this.solver.getDetailedPaths(t);
	}
	getMetrics() {
		return this.solver.getMetrics();
	}
	clearCache() {
		this.solver.clearCache();
	}
	getLeafNodeCount() {
		return this.solver.getLeafNodeCount();
	}
	getMaxReflectionOrder() {
		return this.solver.getMaxReflectionOrder();
	}
	getBeamsForVisualization(e) {
		return this.solver.getBeamsForVisualization(e);
	}
	debugBeamPath(e, t) {
		let n = Array.isArray(e) ? e : e.position;
		this.solver.debugBeamPath(n, t);
	}
}, Fe = /* @__PURE__ */ i(c());
function Ie() {
	let e = new me();
	e.setPoints([]);
	let t = new he({
		lineWidth: .1,
		color: 16711680,
		sizeAttenuation: 1
	});
	return new O.Mesh(e, t);
}
var Le = k.scale(["#ff8a0b", "#000080"]).mode("lch");
function Q(e, t) {
	let n = t + 1, r = Le.colors(n), i = Math.min(e, n - 1), a = k(r[i]);
	return parseInt(a.hex().slice(1), 16);
}
var Re = {
	name: "Beam Tracer",
	uuid: "",
	roomID: "",
	sourceIDs: [],
	receiverIDs: [],
	maxReflectionOrder: 3,
	visualizationMode: "rays",
	showAllBeams: !1,
	visibleOrders: [
		0,
		1,
		2,
		3
	],
	frequencies: [
		125,
		250,
		500,
		1e3,
		2e3,
		4e3,
		8e3
	],
	levelTimeProgression: "",
	impulseResponseResult: "",
	hrtfSubjectId: "D1",
	headYaw: 0,
	headPitch: 0,
	headRoll: 0,
	edgeDiffractionEnabled: !1,
	lateReverbTailEnabled: !1,
	tailCrossfadeTime: 0,
	tailCrossfadeDuration: .05
}, $ = class extends ce {
	roomID;
	sourceIDs;
	receiverIDs;
	maxReflectionOrder;
	frequencies;
	levelTimeProgression;
	impulseResponseResult;
	_visualizationMode;
	_showAllBeams;
	_visibleOrders;
	_plotFrequency;
	_plotOrders;
	btSolver = null;
	polygons = [];
	surfaceToPolygonIndex = /* @__PURE__ */ new Map();
	polygonToSurface = /* @__PURE__ */ new Map();
	edgeDiffractionEnabled;
	_edgeGraph = null;
	_raycaster = new O.Raycaster();
	lateReverbTailEnabled;
	tailCrossfadeTime;
	tailCrossfadeDuration;
	_energyHistogram = null;
	hrtfSubjectId;
	headYaw;
	headPitch;
	headRoll;
	binauralImpulseResponse;
	binauralPlaying = !1;
	validPaths = [];
	impulseResponse;
	impulseResponsePlaying = !1;
	responseByIntensity;
	quickEstimateResults = [];
	estimatedT30 = null;
	_quickEstimateInterval = null;
	lastMetrics = null;
	virtualSourcesGroup;
	virtualSourceMap = /* @__PURE__ */ new Map();
	selectedVirtualSource = null;
	clickHandler = null;
	hoverHandler = null;
	selectedPath;
	selectedBeamsGroup;
	_lastSourcePos = null;
	_lastRoomID = "";
	_lastMaxOrder = -1;
	constructor(t = {}) {
		super(t);
		let n = {
			...Re,
			...t
		};
		if (this.kind = "beam-trace", this.uuid = n.uuid || e(), this.name = n.name, this.roomID = n.roomID, this.sourceIDs = n.sourceIDs, this.receiverIDs = n.receiverIDs, this.maxReflectionOrder = n.maxReflectionOrder, this.frequencies = n.frequencies, this.hrtfSubjectId = n.hrtfSubjectId, this.headYaw = n.headYaw, this.headPitch = n.headPitch, this.headRoll = n.headRoll, this.edgeDiffractionEnabled = n.edgeDiffractionEnabled, this.lateReverbTailEnabled = n.lateReverbTailEnabled, this.tailCrossfadeTime = n.tailCrossfadeTime, this.tailCrossfadeDuration = n.tailCrossfadeDuration, this._visualizationMode = n.visualizationMode, this._showAllBeams = n.showAllBeams, this._visibleOrders = n.visibleOrders.length > 0 ? n.visibleOrders : Array.from({ length: n.maxReflectionOrder + 1 }, (e, t) => t), this._plotFrequency = 1e3, this._plotOrders = Array.from({ length: n.maxReflectionOrder + 1 }, (e, t) => t), this.levelTimeProgression = n.levelTimeProgression || e(), this.impulseResponseResult = n.impulseResponseResult || e(), !this.roomID) {
			let e = ee();
			e.length > 0 && (this.roomID = e[0].uuid);
		}
		l("ADD_RESULT", {
			kind: p.LevelTimeProgression,
			data: [],
			info: {
				initialSPL: [100],
				frequency: [this._plotFrequency],
				maxOrder: this.maxReflectionOrder
			},
			name: `LTP - ${this.name}`,
			uuid: this.levelTimeProgression,
			from: this.uuid
		}), l("ADD_RESULT", {
			kind: p.ImpulseResponse,
			data: [],
			info: {
				sampleRate: 44100,
				sourceName: "",
				receiverName: "",
				sourceId: this.sourceIDs[0] || "",
				receiverId: this.receiverIDs[0] || ""
			},
			name: `IR - ${this.name}`,
			uuid: this.impulseResponseResult,
			from: this.uuid
		}), this.selectedPath = Ie(), u.markup.add(this.selectedPath), this.selectedBeamsGroup = new O.Group(), this.selectedBeamsGroup.name = "selected-beams-highlight", u.markup.add(this.selectedBeamsGroup), this.virtualSourcesGroup = new O.Group(), this.virtualSourcesGroup.name = "virtual-sources", u.markup.add(this.virtualSourcesGroup);
	}
	get temperature() {
		return this.room?.temperature ?? 20;
	}
	get c() {
		return se(this.temperature);
	}
	save() {
		return {
			...a([
				"name",
				"kind",
				"uuid",
				"autoCalculate",
				"roomID",
				"sourceIDs",
				"receiverIDs",
				"maxReflectionOrder",
				"frequencies",
				"levelTimeProgression",
				"impulseResponseResult",
				"hrtfSubjectId",
				"headYaw",
				"headPitch",
				"headRoll",
				"edgeDiffractionEnabled",
				"lateReverbTailEnabled",
				"tailCrossfadeTime",
				"tailCrossfadeDuration"
			], this),
			visualizationMode: this._visualizationMode,
			showAllBeams: this._showAllBeams,
			visibleOrders: this._visibleOrders
		};
	}
	restore(t) {
		return this.name = t.name, this.uuid = t.uuid, this.autoCalculate = t.autoCalculate ?? !1, this.roomID = t.roomID, this.sourceIDs = t.sourceIDs, this.receiverIDs = t.receiverIDs, this.maxReflectionOrder = t.maxReflectionOrder, this._visualizationMode = t.visualizationMode || "rays", this._showAllBeams = t.showAllBeams ?? !1, this._visibleOrders = t.visibleOrders ?? Array.from({ length: this.maxReflectionOrder + 1 }, (e, t) => t), this.frequencies = t.frequencies, this.levelTimeProgression = t.levelTimeProgression || e(), this.impulseResponseResult = t.impulseResponseResult || e(), this.hrtfSubjectId = t.hrtfSubjectId ?? "D1", this.headYaw = t.headYaw ?? 0, this.headPitch = t.headPitch ?? 0, this.headRoll = t.headRoll ?? 0, this.edgeDiffractionEnabled = t.edgeDiffractionEnabled ?? !1, this.lateReverbTailEnabled = t.lateReverbTailEnabled ?? !1, this.tailCrossfadeTime = t.tailCrossfadeTime ?? 0, this.tailCrossfadeDuration = t.tailCrossfadeDuration ?? .05, this;
	}
	dispose() {
		this.clearVisualization(), this.removeClickHandler(), u.markup.remove(this.selectedPath), u.markup.remove(this.selectedBeamsGroup), u.markup.remove(this.virtualSourcesGroup), l("REMOVE_RESULT", this.levelTimeProgression), l("REMOVE_RESULT", this.impulseResponseResult);
	}
	setupClickHandler() {
		this.removeClickHandler();
		let e = u.renderer.domElement, t = (t) => {
			let n = e.getBoundingClientRect();
			return new O.Vector2((t.clientX - n.left) / n.width * 2 - 1, -((t.clientY - n.top) / n.height) * 2 + 1);
		};
		this.hoverHandler = (n) => {
			if (this.virtualSourceMap.size === 0) {
				e.style.cursor = "default";
				return;
			}
			let r = t(n), i = new O.Raycaster();
			i.setFromCamera(r, u.camera);
			let a = Array.from(this.virtualSourceMap.keys());
			i.intersectObjects(a).length > 0 ? e.style.cursor = "pointer" : e.style.cursor = "default";
		}, this.clickHandler = (e) => {
			if (e.button !== 0 || this.virtualSourceMap.size === 0) return;
			let n = t(e), r = new O.Raycaster();
			r.setFromCamera(n, u.camera);
			let i = Array.from(this.virtualSourceMap.keys()), a = r.intersectObjects(i);
			if (a.length > 0) {
				let e = a[0].object, t = this.virtualSourceMap.get(e);
				t && (this.selectedVirtualSource === e ? (this.selectedVirtualSource = null, this.clearSelectedBeams()) : (this.selectedVirtualSource = e, this.highlightVirtualSourcePath(t)));
			}
		}, e.addEventListener("click", this.clickHandler), e.addEventListener("mousemove", this.hoverHandler);
	}
	highlightVirtualSourcePath(e) {
		this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams();
		let t = Q(e.reflectionOrder, this.maxReflectionOrder), n = new O.Vector3(e.virtualSource[0], e.virtualSource[1], e.virtualSource[2]);
		if (this.receiverIDs.length === 0) return;
		let r = f.getState().containers[this.receiverIDs[0]];
		if (!r) return;
		let i = r.position.clone(), a = new O.LineDashedMaterial({
			color: t,
			transparent: !0,
			opacity: .4,
			dashSize: .3,
			gapSize: .15
		}), o = new O.BufferGeometry().setFromPoints([n, i]), s = new O.Line(o, a);
		s.computeLineDistances(), this.selectedBeamsGroup.add(s);
		let c = new O.SphereGeometry(.18, 16, 16), l = new O.MeshBasicMaterial({
			color: t,
			transparent: !0,
			opacity: .4
		}), d = new O.Mesh(c, l);
		d.position.copy(n), this.selectedBeamsGroup.add(d);
		let p = e.polygonPath;
		if (!p || p.length === 0) return;
		let m = e.reflectionOrder;
		for (let e of this.validPaths) {
			let t = e.order;
			if (t !== m) continue;
			let n = !0;
			for (let r = 0; r < p.length; r++) {
				let i = t - r;
				if (e.polygonIds[i] !== p[r]) {
					n = !1;
					break;
				}
			}
			if (n) {
				let t = e.points, n = e.order;
				for (let e = 0; e < t.length - 1; e++) {
					let r = t[e], i = t[e + 1], a = r.distanceTo(i), o = new O.Vector3().addVectors(r, i).multiplyScalar(.5), s = n - e, c = s === 0 ? 16777215 : Q(s, this.maxReflectionOrder), l = new O.CylinderGeometry(.025, .025, a, 8), u = new O.MeshBasicMaterial({ color: c }), d = new O.Mesh(l, u);
					d.position.copy(o);
					let f = new O.Vector3().subVectors(i, r).normalize(), p = new O.Quaternion();
					p.setFromUnitVectors(new O.Vector3(0, 1, 0), f), d.setRotationFromQuaternion(p), this.selectedBeamsGroup.add(d);
				}
				for (let t = 1; t < e.points.length - 1; t++) {
					let r = Q(n - t + 1, this.maxReflectionOrder), i = new O.SphereGeometry(.08, 12, 12), a = new O.MeshBasicMaterial({ color: r }), o = new O.Mesh(i, a);
					o.position.copy(e.points[t]), this.selectedBeamsGroup.add(o);
				}
				u.needsToRender = !0;
				return;
			}
		}
		u.needsToRender = !0;
	}
	removeClickHandler() {
		let e = u.renderer.domElement;
		this.clickHandler &&= (e.removeEventListener("click", this.clickHandler), null), this.hoverHandler && (e.removeEventListener("mousemove", this.hoverHandler), this.hoverHandler = null, e.style.cursor = "default");
	}
	extractPolygons() {
		let e = this.room;
		if (!e) return [];
		let t = [];
		return this.surfaceToPolygonIndex.clear(), this.polygonToSurface.clear(), e.allSurfaces.forEach((e) => {
			let n = this.surfaceToPolygons(e), r = t.length;
			n.forEach((n, i) => {
				this.polygonToSurface.set(r + i, e), t.push(n);
			}), this.surfaceToPolygonIndex.set(e.uuid, n.map((e, t) => r + t));
		}), t;
	}
	surfaceToPolygons(e) {
		let t = [], n = e.geometry, r = n.getAttribute("position");
		if (!r) return t;
		e.updateMatrixWorld(!0);
		let i = e.matrixWorld, a = n.getIndex(), o = r.array, s = (e, n, r) => {
			let a = new O.Vector3(o[e * 3], o[e * 3 + 1], o[e * 3 + 2]).applyMatrix4(i), s = new O.Vector3(o[n * 3], o[n * 3 + 1], o[n * 3 + 2]).applyMatrix4(i), c = new O.Vector3(o[r * 3], o[r * 3 + 1], o[r * 3 + 2]).applyMatrix4(i), l = [
				[
					a.x,
					a.y,
					a.z
				],
				[
					s.x,
					s.y,
					s.z
				],
				[
					c.x,
					c.y,
					c.z
				]
			], u = M.create(l);
			t.push(u);
		};
		if (a) {
			let e = a.array;
			for (let t = 0; t < e.length; t += 3) s(e[t], e[t + 1], e[t + 2]);
		} else {
			let e = r.count;
			for (let t = 0; t < e; t += 3) s(t, t + 1, t + 2);
		}
		return t;
	}
	needsBeamTreeRebuild() {
		if (!this.btSolver || this._lastRoomID !== this.roomID || this._lastMaxOrder !== this.maxReflectionOrder || this.sourceIDs.length === 0) return !0;
		let e = f.getState().containers[this.sourceIDs[0]];
		return !e || !this._lastSourcePos || !this._lastSourcePos.equals(e.position);
	}
	buildSolver() {
		if (this.sourceIDs.length === 0) {
			console.warn("BeamTraceSolver: No source selected");
			return;
		}
		let e = f.getState().containers[this.sourceIDs[0]];
		if (!e) {
			console.warn("BeamTraceSolver: Source not found");
			return;
		}
		if (this.polygons = this.extractPolygons(), this.polygons.length === 0) {
			console.warn("BeamTraceSolver: No polygons extracted from room");
			return;
		}
		let t = new Ne([
			e.position.x,
			e.position.y,
			e.position.z
		]);
		this.btSolver = new Pe(this.polygons, t, { maxReflectionOrder: this.maxReflectionOrder }), this._lastSourcePos = e.position.clone(), this._lastRoomID = this.roomID, this._lastMaxOrder = this.maxReflectionOrder, console.log(`BeamTraceSolver: Built with ${this.polygons.length} polygons, max order ${this.maxReflectionOrder}`);
	}
	calculate() {
		if (this.sourceIDs.length === 0 || this.receiverIDs.length === 0) {
			console.warn("BeamTraceSolver: Need at least one source and one receiver");
			return;
		}
		if (this.needsBeamTreeRebuild() ? this.buildSolver() : this.btSolver && (this.btSolver.clearCache(), console.log("BeamTraceSolver: Reusing beam tree (listener-only change)")), !this.btSolver) {
			console.warn("BeamTraceSolver: Solver not built");
			return;
		}
		switch (this.validPaths = [], this.clearVisualization(), this.receiverIDs.forEach((e) => {
			let t = f.getState().containers[e];
			if (!t) return;
			let n = [
				t.position.x,
				t.position.y,
				t.position.z
			], r = this.btSolver.getPaths(n);
			this.lastMetrics = this.btSolver.getMetrics();
			let i = this.btSolver.getDetailedPaths(n);
			r.forEach((e, t) => {
				let n = t < i.length ? i[t] : void 0, r = this.convertPath(e, n);
				this.validPaths.push(r);
			});
		}), this.edgeDiffractionEnabled && this.room && this._computeDiffractionPaths(), this.validPaths.sort((e, t) => e.arrivalTime - t.arrivalTime), this.lateReverbTailEnabled && this.validPaths.length > 0 && this._buildEnergyHistogram(), this._visualizationMode) {
			case "rays":
				this.drawPaths();
				break;
			case "beams":
				this.drawBeams();
				break;
			case "both": this.drawPaths(), this.drawBeams();
		}
		this.calculateLTP(), this.calculateResponseByIntensity(), console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`), this.lastMetrics && (console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`), console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`), console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`)), u.needsToRender = !0;
	}
	convertPath(e, t) {
		let n = e.map((e) => new O.Vector3(e.position[0], e.position[1], e.position[2])), r = X(e), i = Oe(e, this.c), a = ke(e), o = e.map((e) => e.polygonId), s;
		s = n.length >= 2 ? new O.Vector3().subVectors(n[0], n[1]).normalize().negate() : new O.Vector3(0, 0, 1);
		let c = t?.reflections.map((e) => ({
			polygonId: e.polygonId,
			hitPoint: new O.Vector3(e.hitPoint[0], e.hitPoint[1], e.hitPoint[2]),
			incidenceAngle: e.incidenceAngle,
			surfaceNormal: new O.Vector3(e.surfaceNormal[0], e.surfaceNormal[1], e.surfaceNormal[2]),
			isGrazing: e.isGrazing
		}));
		return {
			points: n,
			order: a,
			length: r,
			arrivalTime: i,
			polygonIds: o,
			arrivalDirection: s,
			reflections: c
		};
	}
	calculateLTP() {
		if (this.validPaths.length === 0) return;
		let e = [...this.validPaths].sort((e, t) => e.arrivalTime - t.arrivalTime), t = { ...d.getState().results[this.levelTimeProgression] };
		t.data = [], t.info = {
			...t.info,
			maxOrder: this.maxReflectionOrder,
			frequency: [this._plotFrequency]
		};
		let n = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null;
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = i.arrivalDirection, o = n ? n.getGain([
				a.x,
				a.y,
				a.z
			]) : 1, s = this.calculateArrivalPressure(t.info.initialSPL, i, o), c = v(s);
			t.data.push({
				time: i.arrivalTime,
				pressure: c,
				arrival: r + 1,
				order: i.order,
				uuid: `${this.uuid}-path-${r}`
			});
		}
		l("UPDATE_RESULT", {
			uuid: this.levelTimeProgression,
			result: t
		});
	}
	clearLevelTimeProgressionData() {
		let e = { ...d.getState().results[this.levelTimeProgression] };
		e.data = [], l("UPDATE_RESULT", {
			uuid: this.levelTimeProgression,
			result: e
		});
	}
	set plotFrequency(e) {
		this._plotFrequency = e, this.calculateLTP();
	}
	get plotFrequency() {
		return this._plotFrequency;
	}
	get plotOrders() {
		return this._plotOrders;
	}
	set plotOrders(e) {
		this._plotOrders = e;
	}
	toggleRayPathHighlight(e) {
		let t = e.match(/-path-(\d+)$/);
		if (!t) {
			console.warn("BeamTraceSolver: Invalid path UUID format:", e);
			return;
		}
		let n = parseInt(t[1], 10);
		this.highlightPathByIndex(n);
	}
	clearVisualization() {
		u.markup.clearLines(), u.markup.clearPoints(), this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
	}
	drawPaths() {
		let e = this.validPaths.filter((e) => this._visibleOrders.includes(e.order));
		e.forEach((e) => {
			let t = Q(e.order, this.maxReflectionOrder), n = [
				(t >> 16 & 255) / 255,
				(t >> 8 & 255) / 255,
				(t & 255) / 255
			];
			for (let t = 0; t < e.points.length - 1; t++) {
				let r = e.points[t], i = e.points[t + 1];
				u.markup.addLine([
					r.x,
					r.y,
					r.z
				], [
					i.x,
					i.y,
					i.z
				], n, n);
			}
		}), e.forEach((e) => {
			if (e.bandEnergy && e.points.length === 3) {
				let t = e.points[1], n = Q(e.order, this.maxReflectionOrder), r = new O.SphereGeometry(.06, 8, 8), i = new O.MeshBasicMaterial({ color: n }), a = new O.Mesh(r, i);
				a.position.copy(t), this.virtualSourcesGroup.add(a);
			}
		});
		let t = u.markup.getUsageStats();
		this.lastMetrics && (this.lastMetrics.bufferUsage = t), t.overflowWarning ? console.error(`⚠️ Path buffer overflow! Lines: ${t.linesUsed}/${t.linesCapacity}. Reduce reflection order.`) : t.linesPercent > 80 && console.warn(`Buffer usage high: Lines ${t.linesPercent.toFixed(1)}%`);
	}
	drawBeams() {
		if (!this.btSolver) return;
		this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
		let e = this.validPaths, t = /* @__PURE__ */ new Map();
		e.forEach((e) => {
			let n = e.polygonIds.filter((e) => e !== null).join(",");
			n && t.set(n, e);
		}), this.btSolver.getBeamsForVisualization(this.maxReflectionOrder).forEach((t) => {
			if (!this._visibleOrders.includes(t.reflectionOrder)) return;
			let n = this.beamHasValidPath(t, e);
			if (!n && !this._showAllBeams) return;
			let r = Math.max(.05, .1 - t.reflectionOrder * .01), i = Q(t.reflectionOrder, this.maxReflectionOrder), a = i;
			if (!n) {
				let e = (i >> 16 & 255) * .4 + 76.8, t = (i >> 8 & 255) * .4 + 76.8, n = (i & 255) * .4 + 76.8;
				a = Math.round(e) << 16 | Math.round(t) << 8 | Math.round(n);
			}
			let o = new O.Vector3(t.virtualSource[0], t.virtualSource[1], t.virtualSource[2]), s = new O.SphereGeometry(r, 12, 12), c = new O.MeshStandardMaterial({
				color: a,
				transparent: !n,
				opacity: n ? 1 : .4,
				roughness: .6,
				metalness: .1
			}), l = new O.Mesh(s, c);
			l.position.copy(o), this.virtualSourcesGroup.add(l), n && this.virtualSourceMap.set(l, {
				...t,
				polygonPath: t.polygonPath || []
			});
			let u = t.apertureVertices;
			if (u && u.length >= 3) {
				let e = u.map((e) => new O.Vector3(e[0], e[1], e[2])), t = new O.BufferGeometry(), r = new Float32Array(e.length * 3);
				for (let t = 0; t < e.length; t++) r[t * 3] = e[t].x, r[t * 3 + 1] = e[t].y, r[t * 3 + 2] = e[t].z;
				t.setAttribute("position", new O.BufferAttribute(r, 3));
				let i = [];
				for (let t = 1; t < e.length - 1; t++) i.push(0, t, t + 1);
				t.setIndex(i), t.computeVertexNormals();
				let s = new O.MeshBasicMaterial({
					color: a,
					side: O.DoubleSide,
					transparent: !0,
					opacity: n ? .2 : .08,
					depthWrite: !1
				}), c = new O.Mesh(t, s);
				this.virtualSourcesGroup.add(c);
				let l = new O.BufferGeometry().setFromPoints(e), d = new O.LineBasicMaterial({
					color: a,
					transparent: !0,
					opacity: n ? .5 : .2
				}), f = new O.LineLoop(l, d);
				this.virtualSourcesGroup.add(f);
				let p = [];
				for (let t of e) p.push(o.clone(), t);
				let m = new O.BufferGeometry().setFromPoints(p), h = new O.LineBasicMaterial({
					color: a,
					transparent: !0,
					opacity: n ? .35 : .12
				}), g = new O.LineSegments(m, h);
				this.virtualSourcesGroup.add(g);
			}
		}), this.setupClickHandler(), u.needsToRender = !0;
	}
	beamHasValidPath(e, t) {
		let n = e.polygonPath;
		if (!n || n.length === 0) return !1;
		let r = e.reflectionOrder;
		for (let e of t) {
			if (e.order !== r) continue;
			let t = !0;
			for (let i = 0; i < n.length; i++) {
				let a = r - i;
				if (e.polygonIds[a] !== n[i]) {
					t = !1;
					break;
				}
			}
			if (t) return !0;
		}
		return !1;
	}
	clearVirtualSources() {
		for (; this.virtualSourcesGroup.children.length > 0;) {
			let e = this.virtualSourcesGroup.children[0];
			if (this.virtualSourcesGroup.remove(e), e instanceof O.Mesh || e instanceof O.Line) {
				e.geometry?.dispose();
				let t = e.material;
				if (Array.isArray(t)) for (let e of t) e instanceof O.Material && e.dispose();
				else t instanceof O.Material && t.dispose();
			}
		}
	}
	_computeDiffractionPaths() {
		if (!this.room) return;
		let e = f.getState().containers;
		if (this._edgeGraph = re(this.room.allSurfaces), this._edgeGraph.edges.length === 0) return;
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
		for (let r of this.sourceIDs) {
			let i = e[r];
			if (i) {
				t.set(r, [
					i.position.x,
					i.position.y,
					i.position.z
				]);
				let e = i.directivityHandler;
				if (e) {
					let t = Array(this.frequencies.length);
					for (let n = 0; n < this.frequencies.length; n++) t[n] = e.getPressureAtPosition(0, this.frequencies[n], 0, 0);
					n.set(r, {
						handler: e,
						refPressures: t
					});
				}
			}
		}
		let r = /* @__PURE__ */ new Map();
		for (let t of this.receiverIDs) {
			let n = e[t];
			n && r.set(t, [
				n.position.x,
				n.position.y,
				n.position.z
			]);
		}
		let i = [];
		this.room.surfaces.traverse((e) => {
			e.kind && e.kind === "surface" && i.push(e.mesh);
		});
		let a = w(this._edgeGraph, t, r, this.frequencies, this.c, this.temperature, this._raycaster, i);
		for (let e of a) {
			let i = n.get(e.sourceId);
			if (i) {
				let n = t.get(e.sourceId), r = e.diffractionPoint[0] - n[0], a = e.diffractionPoint[1] - n[1], o = e.diffractionPoint[2] - n[2], s = Math.sqrt(r * r + a * a + o * o);
				if (s > 1e-10) {
					let t = Math.acos(Math.max(-1, Math.min(1, a / s))) * (180 / Math.PI), n = 180 / Math.PI * Math.atan2(o, r);
					for (let r = 0; r < this.frequencies.length; r++) try {
						let a = i.handler.getPressureAtPosition(0, this.frequencies[r], Math.abs(n), t), o = i.refPressures[r];
						typeof a == "number" && typeof o == "number" && o > 0 && (e.bandEnergy[r] *= (a / o) ** 2);
					} catch {}
				}
			}
			let a = r.get(e.receiverId), o = a[0] - e.diffractionPoint[0], s = a[1] - e.diffractionPoint[1], c = a[2] - e.diffractionPoint[2], l = Math.sqrt(o * o + s * s + c * c), u = l > 1e-10 ? new O.Vector3(o / l, s / l, c / l) : new O.Vector3(0, 0, 1), d = t.get(e.sourceId), f = {
				points: [
					new O.Vector3(a[0], a[1], a[2]),
					new O.Vector3(e.diffractionPoint[0], e.diffractionPoint[1], e.diffractionPoint[2]),
					new O.Vector3(d[0], d[1], d[2])
				],
				order: 0,
				length: e.totalDistance,
				arrivalTime: e.time,
				polygonIds: [
					null,
					null,
					null
				],
				arrivalDirection: u,
				reflections: [],
				bandEnergy: e.bandEnergy
			};
			this.validPaths.push(f);
		}
		a.length > 0 && console.log(`BeamTraceSolver: Found ${a.length} diffraction paths`);
	}
	_buildEnergyHistogram() {
		let e = this.frequencies.length;
		this._energyHistogram = [];
		for (let t = 0; t < e; t++) this._energyHistogram.push(new Float32Array(T));
		let t = Array(e).fill(100), n = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null;
		for (let r of this.validPaths) {
			let i = Math.floor(r.arrivalTime / S);
			if (i < 0 || i >= 1e4) continue;
			let a = r.arrivalDirection, o = n ? n.getGain([
				a.x,
				a.y,
				a.z
			]) : 1, s = this.calculateArrivalPressure(t, r, o);
			for (let t = 0; t < e; t++) this._energyHistogram[t][i] += s[t] * s[t];
		}
	}
	async calculateImpulseResponse() {
		if (this.validPaths.length === 0) throw Error("No paths calculated yet. Run calculate() first.");
		let e = g.sampleRate, t = Array(this.frequencies.length).fill(100), n = this.validPaths[this.validPaths.length - 1].arrivalTime + .05, r = Math.floor(e * n) * 2, i = [];
		for (let e = 0; e < this.frequencies.length; e++) i.push(new Float32Array(r));
		let a = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null;
		for (let n of this.validPaths) {
			let r = Math.random() > .5 ? 1 : -1, o = n.arrivalDirection, s = a ? a.getGain([
				o.x,
				o.y,
				o.z
			]) : 1, c = this.calculateArrivalPressure(t, n, s), l = Math.floor(n.arrivalTime * e);
			for (let e = 0; e < this.frequencies.length; e++) l < i[e].length && (i[e][l] += c[e] * r);
		}
		let o = i;
		if (this.lateReverbTailEnabled && this._energyHistogram) {
			let t = C(this._energyHistogram, this.frequencies, this.tailCrossfadeTime, S), { tailSamples: n, tailStartSample: r } = D(t, e), a = Math.floor(this.tailCrossfadeDuration * e);
			o = x(i, n, r, a);
		}
		let s = new Worker(new URL(
			/* @vite-ignore */
			"/assets/filter.worker-B2fYKvk6.js",
			"" + import.meta.url
		));
		return new Promise((t, n) => {
			s.postMessage({ samples: o }), s.onmessage = (r) => {
				let i = r.data.samples, a = new Float32Array(i[0].length >> 1), o = 0;
				for (let e = 0; e < i.length; e++) for (let t = 0; t < a.length; t++) a[t] += i[e][t], Math.abs(a[t]) > o && (o = Math.abs(a[t]));
				let c = m(a), l = g.createOfflineContext(1, a.length, e), u = g.createBufferSource(c, l);
				u.connect(l.destination), u.start(), g.renderContextAsync(l).then((n) => {
					this.impulseResponse = n, this.updateImpulseResponseResult(n, e), t(n);
				}).catch(n).finally(() => s.terminate());
			}, s.onerror = (e) => {
				s.terminate(), n(e);
			};
		});
	}
	calculateArrivalPressure(e, t, n = 1) {
		if (t.bandEnergy) {
			let r = b(y(e)), i = Array(this.frequencies.length);
			for (let e = 0; e < this.frequencies.length; e++) {
				let a = r[e] * t.bandEnergy[e];
				i[e] = _([a])[0] * n;
			}
			return i;
		}
		let r = b(y(e)), i = t.points.length - 1;
		if (i >= 1 && this.sourceIDs.length > 0) {
			let e = f.getState().containers[this.sourceIDs[0]];
			if (e?.directivityHandler) {
				let n = t.points[i], a = t.points[i - 1], o = new O.Vector3().subVectors(a, n).normalize().clone().applyEuler(new O.Euler(-e.rotation.x, -e.rotation.y, -e.rotation.z, e.rotation.order)), s = o.length();
				if (s > 1e-10) {
					let t = Math.acos(Math.min(1, Math.max(-1, o.z / s))), n = (Math.atan2(o.y, o.x) * 180 / Math.PI % 360 + 360) % 360, i = t * 180 / Math.PI;
					for (let t = 0; t < this.frequencies.length; t++) {
						let a = e.directivityHandler.getPressureAtPosition(0, this.frequencies[t], n, i), o = e.directivityHandler.getPressureAtPosition(0, this.frequencies[t], 0, 0);
						typeof a == "number" && typeof o == "number" && o > 0 && (r[t] *= (a / o) ** 2);
					}
				}
			}
		}
		let a = 0;
		t.polygonIds.forEach((e, n) => {
			if (e === null) return;
			let i = this.polygonToSurface.get(e);
			if (!i) {
				a++;
				return;
			}
			let o = 0;
			if (t.reflections && a < t.reflections.length) o = t.reflections[a].incidenceAngle;
			else if (n > 0 && n < t.points.length - 1) {
				let e = new O.Vector3().subVectors(t.points[n + 1], t.points[n]).normalize(), r = new O.Vector3().subVectors(t.points[n - 1], t.points[n]).normalize(), i = Math.min(1, Math.max(-1, e.dot(r)));
				o = Math.acos(i) / 2;
			}
			a++;
			for (let e = 0; e < this.frequencies.length; e++) {
				let t = Math.abs(i.reflectionFunction(this.frequencies[e], o));
				r[e] *= t;
			}
		});
		let o = v(_(r)), s = oe(this.frequencies, this.temperature);
		for (let e = 0; e < this.frequencies.length; e++) o[e] -= s[e] * t.length;
		let c = y(o);
		if (n !== 1) for (let e = 0; e < c.length; e++) c[e] *= n;
		return c;
	}
	updateImpulseResponseResult(e, t) {
		let n = f.getState().containers, r = this.sourceIDs.length > 0 && n[this.sourceIDs[0]]?.name || "source", i = this.receiverIDs.length > 0 && n[this.receiverIDs[0]]?.name || "receiver", a = e.getChannelData(0), o = [], s = Math.max(1, Math.floor(a.length / 2e3));
		for (let e = 0; e < a.length; e += s) o.push({
			time: e / t,
			amplitude: a[e]
		});
		console.log(`BeamTraceSolver: Updating IR result with ${o.length} samples, duration: ${(a.length / t).toFixed(3)}s`);
		let c = {
			kind: p.ImpulseResponse,
			data: o,
			info: {
				sampleRate: t,
				sourceName: r,
				receiverName: i,
				sourceId: this.sourceIDs[0] || "",
				receiverId: this.receiverIDs[0] || ""
			},
			name: `IR: ${r} → ${i}`,
			uuid: this.impulseResponseResult,
			from: this.uuid
		};
		l("UPDATE_RESULT", {
			uuid: this.impulseResponseResult,
			result: c
		});
	}
	async playImpulseResponse() {
		let e = await le(this.impulseResponse, () => this.calculateImpulseResponse(), this.uuid, "BEAMTRACE_SET_PROPERTY");
		this.impulseResponse = e.impulseResponse;
	}
	async downloadImpulseResponse(e, t = g.sampleRate) {
		let n = await fe(this.impulseResponse, () => this.calculateImpulseResponse(), e, t);
		this.impulseResponse = n.impulseResponse;
	}
	ambisonicImpulseResponse;
	ambisonicOrder = 1;
	async calculateAmbisonicImpulseResponse(e = 1) {
		if (this.validPaths.length === 0) throw Error("No paths calculated yet. Run calculate() first.");
		let t = g.sampleRate, n = Array(this.frequencies.length).fill(100), r = this.validPaths[this.validPaths.length - 1].arrivalTime + .05;
		if (r <= 0) throw Error("Invalid impulse response duration");
		let i = Math.floor(t * r) * 2;
		if (i < 2) throw Error("Impulse response too short to process");
		let a = te(e), o = [];
		for (let e = 0; e < this.frequencies.length; e++) {
			o.push([]);
			for (let t = 0; t < a; t++) o[e].push(new Float32Array(i));
		}
		let s = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null;
		for (let r of this.validPaths) {
			let c = Math.random() > .5 ? 1 : -1, l = r.arrivalDirection, u = s ? s.getGain([
				l.x,
				l.y,
				l.z
			]) : 1, d = this.calculateArrivalPressure(n, r, u), f = Math.floor(r.arrivalTime * t);
			if (f >= i) continue;
			let p = /* @__PURE__ */ new Float32Array(1);
			for (let t = 0; t < this.frequencies.length; t++) {
				p[0] = d[t] * c;
				let n = ne(p, l.x, l.y, l.z, e, "threejs");
				for (let e = 0; e < a; e++) o[t][e][f] += n[e][0];
			}
		}
		if (this.lateReverbTailEnabled && this._energyHistogram) {
			let e = C(this._energyHistogram, this.frequencies, this.tailCrossfadeTime, S), { tailSamples: n, tailStartSample: r } = D(e, t), i = Math.floor(this.tailCrossfadeDuration * t), a = [];
			for (let e = 0; e < this.frequencies.length; e++) a.push(o[e][0]);
			let s = x(a, n, r, i);
			for (let e = 0; e < this.frequencies.length; e++) o[e][0] = s[e];
		}
		let c = () => new Worker(new URL(
			/* @vite-ignore */
			"/assets/filter.worker-B2fYKvk6.js",
			"" + import.meta.url
		));
		return new Promise((n, r) => {
			let i = async (e) => new Promise((t) => {
				let n = [];
				for (let t = 0; t < this.frequencies.length; t++) n.push(o[t][e]);
				let r = c();
				r.postMessage({ samples: n }), r.onmessage = (e) => {
					let n = e.data.samples, i = new Float32Array(n[0].length >> 1);
					for (let e = 0; e < n.length; e++) for (let t = 0; t < i.length; t++) i[t] += n[e][t];
					r.terminate(), t(i);
				};
			});
			Promise.all(Array.from({ length: a }, (e, t) => i(t))).then((i) => {
				let o = 0;
				for (let e of i) for (let t = 0; t < e.length; t++) Math.abs(e[t]) > o && (o = Math.abs(e[t]));
				if (o > 0) for (let e of i) for (let t = 0; t < e.length; t++) e[t] /= o;
				let s = i[0].length;
				if (s === 0) {
					r(/* @__PURE__ */ Error("Filtered signal has zero length"));
					return;
				}
				let c = g.createOfflineContext(a, s, t).createBuffer(a, s, t);
				for (let e = 0; e < a; e++) c.copyToChannel(new Float32Array(i[e]), e);
				this.ambisonicImpulseResponse = c, this.ambisonicOrder = e, n(c);
			}).catch(r);
		});
	}
	async downloadAmbisonicImpulseResponse(e, t = 1) {
		let n = await pe(this.ambisonicImpulseResponse, (e) => this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder, t, e);
		this.ambisonicImpulseResponse = n.ambisonicImpulseResponse, this.ambisonicOrder = n.ambisonicOrder;
	}
	async calculateBinauralImpulseResponse(e = 1) {
		return (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder = e), this.binauralImpulseResponse = await ae({
			ambisonicImpulseResponse: this.ambisonicImpulseResponse,
			order: e,
			hrtfSubjectId: this.hrtfSubjectId,
			headYaw: this.headYaw,
			headPitch: this.headPitch,
			headRoll: this.headRoll
		}), this.binauralImpulseResponse;
	}
	async playBinauralImpulseResponse(e = 1) {
		let t = await ue(this.binauralImpulseResponse, () => this.calculateBinauralImpulseResponse(e), this.uuid, "BEAMTRACE_SET_PROPERTY");
		this.binauralImpulseResponse = t.binauralImpulseResponse;
	}
	async downloadBinauralImpulseResponse(e, t = 1) {
		let n = await de(this.binauralImpulseResponse, () => this.calculateBinauralImpulseResponse(t), e);
		this.binauralImpulseResponse = n.binauralImpulseResponse;
	}
	calculateResponseByIntensity() {
		if (this.validPaths.length === 0 || this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
		let e = this.receiverIDs[0], t = this.sourceIDs[0], n = Array(this.frequencies.length).fill(100), r = f.getState().containers[e], i = [...this.validPaths].sort((e, t) => e.arrivalTime - t.arrivalTime), a = [];
		for (let e of i) {
			let t = e.arrivalDirection, i = r ? r.getGain([
				t.x,
				t.y,
				t.z
			]) : 1, o = this.calculateArrivalPressure(n, e, i), s = v(o);
			a.push({
				time: e.arrivalTime,
				bounces: e.order,
				level: s
			});
		}
		let o = { [e]: { [t]: {
			freqs: this.frequencies,
			response: a
		} } };
		this.responseByIntensity = E(o, 256);
	}
	downloadOctaveBandIR(e, t = g.sampleRate) {
		if (this.validPaths.length === 0) throw Error("No paths calculated yet. Run calculate() first.");
		let n = Array(this.frequencies.length).fill(100), r = [...this.validPaths].sort((e, t) => e.arrivalTime - t.arrivalTime), i = r[r.length - 1].arrivalTime + .05, a = Math.floor(t * i), o = [];
		for (let e = 0; e < this.frequencies.length; e++) o.push(new Float32Array(a));
		let s = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null;
		for (let e of r) {
			let r = Math.random() > .5 ? 1 : -1, i = e.arrivalDirection, a = s ? s.getGain([
				i.x,
				i.y,
				i.z
			]) : 1, c = this.calculateArrivalPressure(n, e, a), l = Math.floor(e.arrivalTime * t);
			for (let e = 0; e < this.frequencies.length; e++) l < o[e].length && (o[e][l] += c[e] * r);
		}
		for (let n = 0; n < this.frequencies.length; n++) {
			let r = h([m(o[n])], {
				sampleRate: t,
				bitDepth: 32
			});
			Fe.default.saveAs(r, `${this.frequencies[n]}_${e}.wav`);
		}
	}
	startQuickEstimate(e = 500) {
		if (this._quickEstimateInterval !== null && (window.clearInterval(this._quickEstimateInterval), this._quickEstimateInterval = null), this.sourceIDs.length === 0) return;
		let t = f.getState().containers[this.sourceIDs[0]];
		if (!t) return;
		let n = this.room;
		if (!n) return;
		let r = [];
		if (n.surfaces.traverse((e) => {
			e.isMesh && r.push(e);
		}), r.length === 0) return;
		this.quickEstimateResults = [], this.estimatedT30 = null;
		let i = 0;
		this._quickEstimateInterval = window.setInterval(() => {
			for (let n = 0; n < 10 && i < e; n++, i++) {
				let e = ie(this._raycaster, r, t.position, t.initialIntensity, this.frequencies, this.temperature);
				this.quickEstimateResults.push(e);
			}
			if (i >= e) {
				window.clearInterval(this._quickEstimateInterval), this._quickEstimateInterval = null;
				let e = this.frequencies.length, t = Array(e).fill(0), n = Array(e).fill(0);
				for (let r of this.quickEstimateResults) for (let i = 0; i < e; i++) r.rt60s[i] > 0 && (t[i] += r.rt60s[i], n[i]++);
				for (let r = 0; r < e; r++) t[r] = n[r] > 0 ? t[r] / n[r] : 0;
				this.estimatedT30 = t, l("BEAMTRACE_QUICK_ESTIMATE_COMPLETE", this.uuid);
			}
		}, 5);
	}
	reset() {
		this.validPaths = [], this.clearVisualization(), this.btSolver = null, this.lastMetrics = null, this.responseByIntensity = void 0, this._quickEstimateInterval !== null && (window.clearInterval(this._quickEstimateInterval), this._quickEstimateInterval = null), this.quickEstimateResults = [], this.estimatedT30 = null, this.clearLevelTimeProgressionData(), this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), u.needsToRender = !0;
	}
	clearSelectedBeams() {
		for (; this.selectedBeamsGroup.children.length > 0;) {
			let e = this.selectedBeamsGroup.children[0];
			this.selectedBeamsGroup.remove(e), (e instanceof O.Mesh || e instanceof O.Line) && (e.geometry?.dispose(), e.material instanceof O.Material && e.material.dispose());
		}
	}
	get room() {
		return f.getState().containers[this.roomID];
	}
	get sources() {
		return this.sourceIDs.map((e) => f.getState().containers[e]).filter(Boolean);
	}
	get receivers() {
		return this.receiverIDs.map((e) => f.getState().containers[e]).filter(Boolean);
	}
	get numValidPaths() {
		return this.validPaths.length;
	}
	set maxReflectionOrderReset(e) {
		this.maxReflectionOrder = Math.max(0, Math.floor(e)), this._plotOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (e, t) => t), this._visibleOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (e, t) => t), this.sourceIDs.length > 0 && this.receiverIDs.length > 0 ? (this.calculate(), l("BEAMTRACE_CALCULATE_COMPLETE", this.uuid)) : this.reset();
	}
	get maxReflectionOrderReset() {
		return this.maxReflectionOrder;
	}
	get visualizationMode() {
		return this._visualizationMode;
	}
	set visualizationMode(e) {
		switch (this._visualizationMode = e, this.clearVisualization(), e) {
			case "rays":
				this.validPaths.length > 0 && this.drawPaths();
				break;
			case "beams":
				this.btSolver && this.drawBeams();
				break;
			case "both": this.validPaths.length > 0 && this.drawPaths(), this.btSolver && this.drawBeams();
		}
		u.needsToRender = !0;
	}
	get showAllBeams() {
		return this._showAllBeams;
	}
	set showAllBeams(e) {
		this._showAllBeams = e, (this._visualizationMode === "beams" || this._visualizationMode === "both") && (this.clearVisualization(), this._visualizationMode === "both" && this.validPaths.length > 0 && this.drawPaths(), this.btSolver && this.drawBeams(), u.needsToRender = !0);
	}
	get visibleOrders() {
		return this._visibleOrders;
	}
	set visibleOrders(e) {
		switch (this._visibleOrders = e, this.clearVisualization(), this._visualizationMode) {
			case "rays":
				this.validPaths.length > 0 && this.drawPaths();
				break;
			case "beams":
				this.btSolver && this.drawBeams();
				break;
			case "both": this.validPaths.length > 0 && this.drawPaths(), this.btSolver && this.drawBeams();
		}
		u.needsToRender = !0;
	}
	debugBeamPath(e) {
		if (!this.btSolver) {
			console.warn("BeamTraceSolver: No solver built. Run calculate() first.");
			return;
		}
		if (this.receiverIDs.length === 0) {
			console.warn("BeamTraceSolver: No receiver selected for debugging.");
			return;
		}
		let t = f.getState().containers[this.receiverIDs[0]];
		if (!t) {
			console.warn("BeamTraceSolver: Receiver not found.");
			return;
		}
		let n = [
			t.position.x,
			t.position.y,
			t.position.z
		];
		console.group(`🔍 Debugging beam path: [${e.join(" → ")}]`), this.btSolver.debugBeamPath(n, e), console.groupEnd();
	}
	setBSPDebug(e) {
		console.log(`BeamTraceSolver: BSP debug ${e ? "enabled" : "disabled"} (note: requires beam-trace package update to export setBSPDebug)`);
	}
	getDetailedPaths() {
		if (!this.btSolver) return console.warn("BeamTraceSolver: No solver built. Run calculate() first."), [];
		if (this.receiverIDs.length === 0) return console.warn("BeamTraceSolver: No receiver selected."), [];
		let e = f.getState().containers[this.receiverIDs[0]];
		if (!e) return console.warn("BeamTraceSolver: Receiver not found."), [];
		let t = [
			e.position.x,
			e.position.y,
			e.position.z
		];
		return this.btSolver.getDetailedPaths(t);
	}
	highlightPathByIndex(e) {
		let t = [...this.validPaths].sort((e, t) => e.arrivalTime - t.arrivalTime);
		if (e < 0 || e >= t.length) {
			console.warn("BeamTraceSolver: Path index out of bounds:", e);
			return;
		}
		let n = t[e];
		this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams();
		let r = Q(n.order, this.maxReflectionOrder), i = new O.LineBasicMaterial({
			color: r,
			linewidth: 2,
			transparent: !1
		});
		for (let e = 0; e < n.points.length - 1; e++) {
			let t = new O.BufferGeometry().setFromPoints([n.points[e], n.points[e + 1]]), r = new O.Line(t, i);
			this.selectedBeamsGroup.add(r);
		}
		if (this.btSolver && this.receiverIDs.length > 0) {
			let e = f.getState().containers[this.receiverIDs[0]];
			if (e) {
				let t = this.btSolver.getBeamsForVisualization(this.maxReflectionOrder), i = n.polygonIds[n.order];
				if (i !== null) {
					let a = t.find((e) => e.polygonId === i && e.reflectionOrder === n.order);
					if (a) {
						let t = new O.LineDashedMaterial({
							color: r,
							linewidth: 1,
							dashSize: .3,
							gapSize: .15,
							transparent: !0,
							opacity: .7
						}), n = new O.Vector3(a.virtualSource[0], a.virtualSource[1], a.virtualSource[2]), i = e.position.clone(), o = new O.BufferGeometry().setFromPoints([n, i]), s = new O.Line(o, t);
						s.computeLineDistances(), this.selectedBeamsGroup.add(s);
					}
				}
			}
		}
		console.log(`BeamTraceSolver: Highlighting path ${e} with order ${n.order}, arrival time ${n.arrivalTime.toFixed(4)}s`), u.needsToRender = !0;
	}
	clearPathHighlight() {
		this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), u.needsToRender = !0;
	}
};
n("BEAMTRACE_SET_PROPERTY", s), n("REMOVE_BEAMTRACE", t), n("ADD_BEAMTRACE", o($)), n("BEAMTRACE_CALCULATE", (e) => {
	r.getState().solvers[e].calculate(), setTimeout(() => l("BEAMTRACE_CALCULATE_COMPLETE", e), 0);
}), n("BEAMTRACE_RESET", (e) => {
	r.getState().solvers[e].reset();
}), n("BEAMTRACE_PLAY_IR", (e) => {
	r.getState().solvers[e].playImpulseResponse().catch((e) => {
		window.alert(e.message || "Failed to play impulse response");
	});
}), n("BEAMTRACE_DOWNLOAD_IR", (e) => {
	let t = r.getState().solvers[e], n = f.getState().containers, i = `ir-beamtrace-${t.sourceIDs.length > 0 && n[t.sourceIDs[0]]?.name || "source"}-${t.receiverIDs.length > 0 && n[t.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	t.downloadImpulseResponse(i).catch((e) => {
		window.alert(e.message || "Failed to download impulse response");
	});
}), n("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid: e, order: t }) => {
	let n = r.getState().solvers[e], i = f.getState().containers, a = `ir-beamtrace-ambi-${n.sourceIDs.length > 0 && i[n.sourceIDs[0]]?.name || "source"}-${n.receiverIDs.length > 0 && i[n.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	n.downloadAmbisonicImpulseResponse(a, t).catch((e) => {
		window.alert(e.message || "Failed to download ambisonic impulse response");
	});
}), n("BEAMTRACE_PLAY_BINAURAL_IR", ({ uuid: e, order: t }) => {
	r.getState().solvers[e].playBinauralImpulseResponse(t).catch((e) => {
		window.alert(e.message || "Failed to play binaural impulse response");
	});
}), n("BEAMTRACE_DOWNLOAD_BINAURAL_IR", ({ uuid: e, order: t }) => {
	let n = r.getState().solvers[e], i = f.getState().containers, a = `ir-beamtrace-${n.sourceIDs.length > 0 && i[n.sourceIDs[0]]?.name || "source"}-${n.receiverIDs.length > 0 && i[n.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	n.downloadBinauralImpulseResponse(a, t).catch((e) => {
		window.alert(e.message || "Failed to download binaural impulse response");
	});
}), n("BEAMTRACE_DOWNLOAD_OCTAVE_IR", (e) => {
	let t = r.getState().solvers[e], n = f.getState().containers, i = `ir-beamtrace-${t.sourceIDs.length > 0 && n[t.sourceIDs[0]]?.name || "source"}-${t.receiverIDs.length > 0 && n[t.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	try {
		t.downloadOctaveBandIR(i);
	} catch (e) {
		window.alert(e.message || "Failed to download octave-band impulse responses");
	}
}), n("BEAMTRACE_QUICK_ESTIMATE", (e) => {
	r.getState().solvers[e].startQuickEstimate();
}), n("SHOULD_ADD_BEAMTRACE", () => {
	l("ADD_BEAMTRACE", void 0);
});
//#endregion
export { $ as BeamTraceSolver, $ as default };

//# sourceMappingURL=beam-trace-DTmovrdD.mjs.map