import { C as e, a as t, b as n, c as r, k as i, m as a, n as o, s, t as c, v as l } from "./FileSaver.min-BS9rdHrk.mjs";
import { t as u } from "./renderer-Cj8dxF6d.mjs";
import { a as d, g as f, i as p } from "./store-CUhn0IQy.mjs";
import { n as m, r as h, t as g } from "./audio-engine-Cfjjb4lc.mjs";
import "./acoustics-SIlOec_Y.mjs";
import { a as _ } from "./TessellateModifier-C1tXMs2g.mjs";
import { _ as v, b as y, c as ee, d as b, f as te, i as x, l as ne, n as re, p as ie, r as S, s as ae, t as oe, u as C, y as w } from "./diffraction-CWqEMcSR.mjs";
import { t as se } from "./sound-speed-CfEkirc1.mjs";
import { n as ce } from "./room-Be5invjN.mjs";
import { t as le } from "./solver-DCp-VMaM.mjs";
import { a as ue, i as de, n as fe, r as pe, t as T } from "./export-playback-DJ-xd6_v.mjs";
import { n as me, t as he } from "./arrival-pressure-DNCFL7pm.mjs";
import * as E from "three";
import D from "chroma-js";
import { MeshLine as ge, MeshLineMaterial as _e } from "three.meshline";
Math.PI / 2 - 5 * Math.PI / 180;
//#endregion
//#region node_modules/beam-trace/dist/core/vector3.js
var O = {
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
		return Math.sqrt(O.lengthSquared(e));
	},
	normalize(e) {
		let t = O.length(e);
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
		return O.length(O.subtract(e, t));
	},
	distanceSquared(e, t) {
		return O.lengthSquared(O.subtract(e, t));
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
		let n = 2 * O.dot(e, t);
		return O.subtract(e, O.scale(t, n));
	},
	project(e, t) {
		let n = O.lengthSquared(t);
		if (n < 1e-10) return [
			0,
			0,
			0
		];
		let r = O.dot(e, t) / n;
		return O.scale(t, r);
	},
	reject(e, t) {
		return O.subtract(e, O.project(e, t));
	},
	toString(e, t = 4) {
		return `[${e[0].toFixed(t)}, ${e[1].toFixed(t)}, ${e[2].toFixed(t)}]`;
	}
}, k = {
	fromNormalAndPoint(e, t) {
		let n = O.normalize(e), r = -O.dot(n, t);
		return {
			a: n[0],
			b: n[1],
			c: n[2],
			d: r
		};
	},
	fromPoints(e, t, n) {
		let r = O.subtract(t, e), i = O.subtract(n, e), a = O.normalize(O.cross(r, i));
		return k.fromNormalAndPoint(a, e);
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
		return Math.abs(k.signedDistance(e, t));
	},
	classifyPoint(e, t, n = 1e-6) {
		let r = k.signedDistance(e, t);
		return r > n ? "front" : r < -n ? "back" : "on";
	},
	isPointInFront(e, t, n = 1e-6) {
		return k.signedDistance(e, t) > n;
	},
	isPointBehind(e, t, n = 1e-6) {
		return k.signedDistance(e, t) < -n;
	},
	isPointOn(e, t, n = 1e-6) {
		return Math.abs(k.signedDistance(e, t)) <= n;
	},
	mirrorPoint(e, t) {
		let n = k.signedDistance(e, t), r = k.normal(t);
		return O.subtract(e, O.scale(r, 2 * n));
	},
	mirrorPlane(e, t) {
		let n = k.normal(e), r;
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
		], a = O.normalize(O.cross(n, i)), o = O.add(r, a), s = O.cross(n, a), c = O.add(r, s), l = k.mirrorPoint(r, t), u = k.mirrorPoint(o, t), d = k.mirrorPoint(c, t);
		return k.fromPoints(l, u, d);
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
		let r = k.normal(n), i = O.dot(r, t);
		return Math.abs(i) < 1e-10 ? null : -(O.dot(r, e) + n.d) / i;
	},
	rayIntersectionPoint(e, t, n) {
		let r = k.rayIntersection(e, t, n);
		return r === null ? null : O.add(e, O.scale(t, r));
	},
	projectPoint(e, t) {
		let n = k.signedDistance(e, t), r = k.normal(t);
		return O.subtract(e, O.scale(r, n));
	},
	equals(e, t, n = 1e-6) {
		let r = e.a * t.a + e.b * t.b + e.c * t.c;
		return Math.abs(r - 1) < n ? Math.abs(e.d - t.d) < n : Math.abs(r + 1) < n && Math.abs(e.d + t.d) < n;
	},
	toString(e, t = 4) {
		return `Plane3D(${e.a.toFixed(t)}x + ${e.b.toFixed(t)}y + ${e.c.toFixed(t)}z + ${e.d.toFixed(t)} = 0)`;
	}
}, A = {
	create(e, t) {
		if (e.length < 3) throw Error("Polygon requires at least 3 vertices");
		let n = e.map((e) => O.clone(e));
		return {
			vertices: n,
			plane: k.fromPoints(n[0], n[1], n[2]),
			materialId: t
		};
	},
	createWithPlane(e, t, n) {
		if (e.length < 3) throw Error("Polygon requires at least 3 vertices");
		return {
			vertices: e.map((e) => O.clone(e)),
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
			let i = e.vertices[r], a = e.vertices[r + 1], o = O.cross(O.subtract(i, n), O.subtract(a, n));
			t = O.add(t, o);
		}
		return .5 * O.length(t);
	},
	normal(e) {
		return k.normal(e.plane);
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
			let e = k.classifyPoint(a, t, n);
			e === "front" ? r++ : e === "back" && i++;
		}
		return r > 0 && i > 0 ? "spanning" : r > 0 ? "front" : i > 0 ? "back" : "coplanar";
	},
	containsPoint(e, t, n = 1e-6) {
		let r = k.normal(e.plane), i = e.vertices.length;
		for (let a = 0; a < i; a++) {
			let o = e.vertices[a], s = e.vertices[(a + 1) % i], c = O.subtract(s, o), l = O.subtract(t, o), u = O.cross(c, l);
			if (O.dot(u, r) < -n) return !1;
		}
		return !0;
	},
	rayIntersection(e, t, n, r = 1e-4) {
		let i = k.rayIntersection(e, t, n.plane);
		if (i === null || i < 0) return null;
		let a = O.add(e, O.scale(t, i));
		return A.containsPoint(n, a, r) ? {
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
		return e.vertices.length < 3 || A.area(e) < t;
	},
	flip(e) {
		return {
			vertices: [...e.vertices].reverse(),
			plane: k.flip(e.plane),
			materialId: e.materialId
		};
	},
	clone(e) {
		return {
			vertices: e.vertices.map((e) => O.clone(e)),
			plane: { ...e.plane },
			materialId: e.materialId
		};
	},
	toString(e) {
		let t = e.vertices.map((e) => O.toString(e, 2)).join(", ");
		return `Polygon3D(${e.vertices.length} vertices: [${t}])`;
	}
};
//#endregion
//#region node_modules/beam-trace/dist/geometry/polygon-split.js
function ve(e, t, n = 1e-4) {
	let r = A.classify(e, t, n);
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
		let s = e.vertices[r], c = e.vertices[(r + 1) % o], l = k.signedDistance(s, t), u = k.signedDistance(c, t), d = l > n ? "front" : l < -n ? "back" : "on", f = u > n ? "front" : u < -n ? "back" : "on";
		if (d === "front" ? i.push(s) : (d === "back" || i.push(s), a.push(s)), d === "front" && f === "back" || d === "back" && f === "front") {
			let e = l / (l - u), t = O.lerp(s, c, e);
			i.push(t), a.push(t);
		}
	}
	return {
		front: i.length >= 3 ? A.createWithPlane(i, e.plane, e.materialId) : null,
		back: a.length >= 3 ? A.createWithPlane(a, e.plane, e.materialId) : null
	};
}
//#endregion
//#region node_modules/beam-trace/dist/geometry/clipping3d.js
function ye(e, t, n = 1e-4) {
	let r = e.vertices, i = [];
	if (r.length < 3) return null;
	for (let e = 0; e < r.length; e++) {
		let a = r[e], o = r[(e + 1) % r.length], s = k.signedDistance(a, t), c = k.signedDistance(o, t), l = s >= -n, u = c >= -n;
		if (l && i.push(a), l && !u || !l && u) {
			let e = s / (s - c), t = O.lerp(a, o, Math.max(0, Math.min(1, e)));
			i.push(t);
		}
	}
	return i.length < 3 ? null : A.createWithPlane(i, e.plane, e.materialId);
}
function be(e, t, n = 1e-4) {
	let r = e;
	for (let e of t) {
		if (!r) return null;
		r = ye(r, e, n);
	}
	return r;
}
function j(e, t, n = 1e-4) {
	for (let r of t) {
		let t = !0;
		for (let i of e.vertices) if (k.signedDistance(i, r) >= -n) {
			t = !1;
			break;
		}
		if (t) return !0;
	}
	return !1;
}
//#endregion
//#region node_modules/beam-trace/dist/structures/bsp3d.js
function M(e) {
	return e.length === 0 ? null : N(e.map((e, t) => ({
		polygon: e,
		originalId: t
	})));
}
function N(e) {
	if (e.length === 0) return null;
	let t = xe(e), n = e[t], r = n.polygon.plane, i = [], a = [];
	for (let n = 0; n < e.length; n++) {
		if (n === t) continue;
		let o = e[n], { front: s, back: c } = ve(o.polygon, r);
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
		front: N(i),
		back: N(a)
	};
}
function xe(e) {
	if (e.length <= 3) return 0;
	let t = 0, n = Infinity, r = Math.min(e.length, 10), i = Math.max(1, Math.floor(e.length / r));
	for (let r = 0; r < e.length; r += i) {
		let i = e[r].polygon.plane, a = 0, o = 0, s = 0;
		for (let t = 0; t < e.length; t++) {
			if (r === t) continue;
			let n = A.classify(e[t].polygon, i);
			n === "front" ? a++ : n === "back" ? o++ : n === "spanning" && (a++, o++, s++);
		}
		let c = s * 8 + Math.abs(a - o);
		c < n && (n = c, t = r);
	}
	return t;
}
function P(e, t, n, r = 0, i = Infinity, a = -1) {
	if (!n) return null;
	let o = k.signedDistance(e, n.plane), s = k.normal(n.plane), c = O.dot(s, t), l, u;
	o >= 0 ? (l = n.front, u = n.back) : (l = n.back, u = n.front);
	let d = null;
	Math.abs(c) > 1e-10 && (d = -o / c);
	let f = null;
	if (d === null || d < r) {
		if (f = P(e, t, l, r, i, a), !f && n.polygonId !== a) {
			let a = A.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f ||= P(e, t, u, r, i, a);
	} else if (d > i) {
		if (f = P(e, t, l, r, i, a), !f && n.polygonId !== a) {
			let a = A.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f ||= P(e, t, u, r, i, a);
	} else {
		if (f = P(e, t, l, r, d, a), !f && n.polygonId !== a) {
			let a = A.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f ||= P(e, t, u, d, i, a);
	}
	return f;
}
var F = 0;
function I(e, t, n, r, i, a) {
	if (!n) return null;
	"  ".repeat(F);
	let o = k.signedDistance(e, n.plane), s = k.normal(n.plane), c = O.dot(s, t), l, u;
	o >= 0 ? (l = n.front, u = n.back) : (l = n.back, u = n.front);
	let d = null;
	Math.abs(c) > 1e-10 && (d = -o / c);
	let f = null;
	if (d === null || d < r) {
		if (F++, f = I(e, t, l, r, i, a), F--, !f && !a.has(n.polygonId)) {
			let a = A.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f || (F++, f = I(e, t, u, r, i, a), F--);
	} else if (d > i) {
		if (F++, f = I(e, t, l, r, i, a), F--, !f && !a.has(n.polygonId)) {
			let a = A.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f || (F++, f = I(e, t, u, r, i, a), F--);
	} else {
		if (F++, f = I(e, t, l, r, d, a), F--, !f && !a.has(n.polygonId)) {
			let a = A.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f || (F++, f = I(e, t, u, d, i, a), F--);
	}
	return f;
}
//#endregion
//#region node_modules/beam-trace/dist/structures/beam3d.js
function L(e, t) {
	let n = [], r = A.edges(t), i = A.centroid(t);
	for (let [t, a] of r) {
		let r = k.fromPoints(e, t, a);
		k.signedDistance(i, r) < 0 && (r = k.flip(r)), n.push(r);
	}
	let a = t.plane;
	return k.signedDistance(e, a) > 0 && (a = k.flip(a)), n.push(a), n;
}
function R(e, t) {
	return k.mirrorPoint(e, t.plane);
}
function z(e, t) {
	let n = A.centroid(e), r = O.subtract(t, n), i = k.normal(e.plane);
	return O.dot(i, r) > 0;
}
//#endregion
//#region node_modules/beam-trace/dist/structures/beamtree3d.js
var Se = 1e-6;
function Ce(e, t, n) {
	let r = {
		id: -1,
		parent: null,
		virtualSource: O.clone(e),
		children: []
	};
	if (n >= 1) for (let i = 0; i < t.length; i++) {
		let a = t[i];
		if (!z(a, e)) continue;
		let o = R(e, a), s = L(o, a), c = {
			id: i,
			parent: r,
			virtualSource: o,
			aperture: A.clone(a),
			boundaryPlanes: s,
			children: []
		};
		r.children.push(c), n > 1 && B(c, t, 2, n);
	}
	let i = [];
	return V(r, i), {
		root: r,
		leafNodes: i,
		polygons: t,
		maxReflectionOrder: n
	};
}
function B(e, t, n, r) {
	if (!(n > r) && !(!e.boundaryPlanes || !e.aperture)) for (let i = 0; i < t.length; i++) {
		if (i === e.id) continue;
		let a = t[i];
		if (j(a, e.boundaryPlanes) || !z(a, e.virtualSource)) continue;
		let o = be(a, e.boundaryPlanes);
		if (!o || A.area(o) < Se) continue;
		let s = R(e.virtualSource, a), c = L(s, o), l = {
			id: i,
			parent: e,
			virtualSource: s,
			aperture: o,
			boundaryPlanes: c,
			children: []
		};
		e.children.push(l), n < r && B(l, t, n + 1, r);
	}
}
function V(e, t) {
	e.children.length === 0 && e.id !== -1 && t.push(e);
	for (let n of e.children) V(n, t);
}
function we(e) {
	H(e.root);
}
function H(e) {
	e.failPlane = void 0, e.failPlaneType = void 0;
	for (let t of e.children) H(t);
}
//#endregion
//#region node_modules/beam-trace/dist/optimization/failplane3d.js
function Te(e, t, n) {
	if (!t.aperture || !t.boundaryPlanes) return null;
	let r = n[t.id].plane;
	if (k.signedDistance(t.virtualSource, r) < 0 && (r = k.flip(r)), k.signedDistance(e, r) < 0) return {
		plane: r,
		type: "polygon",
		nodeDepth: U(t)
	};
	let i = t.boundaryPlanes.length - 1;
	for (let n = 0; n < t.boundaryPlanes.length; n++) {
		let r = t.boundaryPlanes[n];
		if (k.signedDistance(e, r) < 0) return {
			plane: r,
			type: n < i ? "edge" : "aperture",
			nodeDepth: U(t)
		};
	}
	return null;
}
function U(e) {
	let t = 0, n = e;
	for (; n && n.id !== -1;) t++, n = n.parent;
	return t;
}
function Ee(e, t) {
	return k.signedDistance(e, t) < 0;
}
function De(e, t = 16) {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push({
		id: n.length,
		nodes: e.slice(r, Math.min(r + t, e.length)),
		skipSphere: null
	});
	return n;
}
function Oe(e, t) {
	return O.distance(e, t.center) < t.radius;
}
function ke(e, t) {
	return t.skipSphere ? Oe(e, t.skipSphere) ? "inside" : "outside" : "none";
}
function Ae(e, t) {
	let n = Infinity;
	for (let r of t) {
		if (!r.failPlane) return null;
		let t = Math.abs(k.signedDistance(e, r.failPlane));
		n = Math.min(n, t);
	}
	return n === Infinity || n <= 1e-10 ? null : {
		center: O.clone(e),
		radius: n
	};
}
function W(e) {
	e.skipSphere = null;
}
function je(e) {
	for (let t of e.nodes) t.failPlane = void 0, t.failPlaneType = void 0;
}
//#endregion
//#region node_modules/beam-trace/dist/solver/solver3d.js
var Me = class {
	constructor(e, t, n = {}) {
		let r = n.maxReflectionOrder ?? 5, i = n.bucketSize ?? 16;
		this.polygons = e, this.sourcePosition = O.clone(t), this.epsilon = n.epsilon ?? 1e-4, this.bspRoot = M(e), this.beamTree = Ce(t, e, r), this.buckets = De(this.beamTree.leafNodes, i), this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = this.beamTree.leafNodes.length, this.metrics.bucketsTotal = this.buckets.length;
	}
	getPaths(e) {
		this.resetMetrics();
		let t = [], n = this.validateDirectPath(e);
		n && t.push(n);
		let r = this.findIntermediatePaths(e, this.beamTree.root);
		t.push(...r);
		for (let n of this.buckets) {
			let r = ke(e, n);
			if (r === "inside") {
				this.metrics.bucketsSkipped++;
				continue;
			}
			r === "outside" && (W(n), je(n)), this.metrics.bucketsChecked++;
			let i = !0, a = !0;
			for (let r of n.nodes) {
				if (r.failPlane && Ee(e, r.failPlane)) {
					this.metrics.failPlaneCacheHits++;
					continue;
				}
				r.failPlane && (r.failPlane = void 0, r.failPlaneType = void 0, this.metrics.failPlaneCacheMisses++);
				let n = this.validatePath(e, r);
				n.valid && n.path ? (t.push(n.path), i = !1, a = !1) : r.failPlane || (a = !1);
			}
			i && a && n.nodes.length > 0 && (n.skipSphere = Ae(e, n.nodes), n.skipSphere && this.metrics.skipSphereCount++);
		}
		return this.metrics.validPathCount = t.length, t;
	}
	getDetailedPaths(e) {
		return this.getPaths(e).map((e) => Le(e, this.polygons));
	}
	validateDirectPath(e) {
		let t = O.subtract(this.sourcePosition, e), n = O.length(t), r = O.normalize(t);
		this.metrics.raycastCount++;
		let i = P(e, r, this.bspRoot, 0, n, -1);
		return i && i.t < n - this.epsilon ? null : [{
			position: O.clone(e),
			polygonId: null
		}, {
			position: O.clone(this.sourcePosition),
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
			position: O.clone(e),
			polygonId: null
		}], i = [], a = t;
		for (; a && a.id !== -1;) i.unshift(a.id), a = a.parent;
		n && (console.log(`[traverseBeam] Exploring beam with polygonPath: [${i.join(", ")}]`), console.log(`  Listener: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`  Virtual source: [${t.virtualSource[0].toFixed(3)}, ${t.virtualSource[1].toFixed(3)}, ${t.virtualSource[2].toFixed(3)}]`));
		let o = e, s = t, c = /* @__PURE__ */ new Set(), l = 0;
		for (; s && s.id !== -1;) {
			let e = this.polygons[s.id], t = s.virtualSource, i = O.normalize(O.subtract(t, o)), a = A.rayIntersection(o, i, e);
			if (!a) return n && console.log(`  [Segment ${l}] FAIL: No intersection with polygon ${s.id}`), null;
			n && (console.log(`  [Segment ${l}] Ray from [${o[0].toFixed(3)}, ${o[1].toFixed(3)}, ${o[2].toFixed(3)}]`), console.log(`    Direction: [${i[0].toFixed(3)}, ${i[1].toFixed(3)}, ${i[2].toFixed(3)}]`), console.log(`    Hit polygon ${s.id} at t=${a.t.toFixed(3)}, point=[${a.point[0].toFixed(3)}, ${a.point[1].toFixed(3)}, ${a.point[2].toFixed(3)}]`)), c.add(s.id), this.metrics.raycastCount++;
			let u = I(o, i, this.bspRoot, this.epsilon, a.t - this.epsilon, c);
			if (u) return n && (console.log(`    OCCLUDED by polygon ${u.polygonId} at t=${u.t.toFixed(3)}, point=[${u.point[0].toFixed(3)}, ${u.point[1].toFixed(3)}, ${u.point[2].toFixed(3)}]`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`)), null;
			n && console.log(`    OK - no occlusion (ignoreIds: [${Array.from(c).join(", ")}])`), r.push({
				position: O.clone(a.point),
				polygonId: s.id
			}), o = a.point, s = s.parent, l++;
		}
		if (s) {
			let e = O.normalize(O.subtract(s.virtualSource, o)), t = O.distance(s.virtualSource, o);
			if (n) {
				console.log(`  [Final segment] Ray from [${o[0].toFixed(3)}, ${o[1].toFixed(3)}, ${o[2].toFixed(3)}]`), console.log(`    To source: [${s.virtualSource[0].toFixed(3)}, ${s.virtualSource[1].toFixed(3)}, ${s.virtualSource[2].toFixed(3)}]`), console.log(`    Direction: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`    Distance: ${t.toFixed(3)}`), console.log(`    tMin: ${this.epsilon}, tMax: ${(t - this.epsilon).toFixed(6)}`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`);
				let n = o, r = s.virtualSource;
				if (n[1] < 5.575 && r[1] > 5.575 || n[1] > 5.575 && r[1] < 5.575) {
					let t = (5.575 - n[1]) / (r[1] - n[1]), i = n[0] + t * (r[0] - n[0]), a = n[2] + t * (r[2] - n[2]);
					if (console.log(`    CROSSING y=5.575 at t=${t.toFixed(3)}, x=${i.toFixed(3)}, z=${a.toFixed(3)}`), console.log("    back1 spans: x=[6.215, 12.43], z=[0, 4.877]"), i >= 6.215 && i <= 12.43 && a >= 0 && a <= 4.877) {
						console.log("    *** SHOULD HIT back1 (polygons 3, 4) ***"), console.log("    Direct polygon intersection test:");
						for (let t of [3, 4]) {
							let n = this.polygons[t], r = A.rayIntersection(o, e, n);
							r ? console.log(`      Polygon ${t}: HIT at t=${r.t.toFixed(3)}, point=[${r.point[0].toFixed(3)}, ${r.point[1].toFixed(3)}, ${r.point[2].toFixed(3)}]`) : (console.log(`      Polygon ${t}: NO HIT`), console.log(`        Vertices: ${n.vertices.map((e) => `[${e[0].toFixed(2)}, ${e[1].toFixed(2)}, ${e[2].toFixed(2)}]`).join(", ")}`));
						}
					}
				}
			}
			this.metrics.raycastCount++;
			let i = this.epsilon, a = t - this.epsilon, l = I(o, e, this.bspRoot, i, a, c);
			if (l) return n && console.log(`    OCCLUDED by polygon ${l.polygonId} at t=${l.t.toFixed(3)}, point=[${l.point[0].toFixed(3)}, ${l.point[1].toFixed(3)}, ${l.point[2].toFixed(3)}]`), null;
			n && console.log("    OK - path valid!"), r.push({
				position: O.clone(s.virtualSource),
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
		let r = Te(e, t, this.polygons);
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
		we(this.beamTree);
		for (let e of this.buckets) W(e);
	}
	getLeafNodeCount() {
		return this.beamTree.leafNodes.length;
	}
	getMaxReflectionOrder() {
		return this.beamTree.maxReflectionOrder;
	}
	getSourcePosition() {
		return O.clone(this.sourcePosition);
	}
	getBeamsForVisualization(e) {
		let t = [], n = e ?? this.beamTree.maxReflectionOrder, r = (e, i, a) => {
			if (i > n) return;
			let o = e.id === -1 ? a : [...a, e.id];
			e.id !== -1 && e.aperture && t.push({
				virtualSource: O.clone(e.virtualSource),
				apertureVertices: e.aperture.vertices.map((e) => O.clone(e)),
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
function G(e) {
	let t = 0;
	for (let n = 1; n < e.length; n++) t += O.distance(e[n - 1].position, e[n].position);
	return t;
}
function Ne(e, t = 343) {
	return G(e) / t;
}
function K(e) {
	return e.filter((e) => e.polygonId !== null).length;
}
var Pe = .05;
function Fe(e, t) {
	let n = Math.abs(O.dot(O.negate(e), t));
	return Math.acos(Math.max(-1, Math.min(1, n)));
}
function Ie(e, t) {
	let n = k.normal(e.plane);
	return O.dot(t, n) > 0 ? O.negate(n) : O.clone(n);
}
function Le(e, t) {
	if (e.length < 2) throw Error("Path must have at least 2 points (listener and source)");
	let n = O.clone(e[0].position), r = O.clone(e[e.length - 1].position), i = [], a = [], o = 0;
	for (let n = 0; n < e.length - 1; n++) {
		let r = e[n].position, s = e[n + 1].position, c = O.distance(r, s);
		a.push({
			startPoint: O.clone(r),
			endPoint: O.clone(s),
			length: c,
			segmentIndex: n
		});
		let l = e[n + 1].polygonId;
		if (l !== null) {
			let a = t[l], s = e[n + 1].position, u = O.normalize(O.subtract(s, r)), d = e[n + 2]?.position, f;
			f = d ? O.normalize(O.subtract(d, s)) : O.reflect(u, k.normal(a.plane));
			let p = Ie(a, u), m = Fe(u, p), h = m;
			o += c;
			let g = Math.abs(m - Math.PI / 2) < Pe;
			i.push({
				polygon: a,
				polygonId: l,
				hitPoint: O.clone(s),
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
var Re = class {
	constructor(e) {
		this.position = O.clone(e);
	}
}, ze = class {
	constructor(e, t, n) {
		this.source = t, this.solver = new Me(e, t.position, n);
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
}, Be = {
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
}, Ve = /* @__PURE__ */ i(c()), q = () => new Worker(new URL(
	/* @vite-ignore */
	"/assets/filter.worker-B2fYKvk6.js",
	"" + import.meta.url
));
function J(e, t) {
	if (!e) return 1;
	let n = t.arrivalDirection;
	return e.getGain([
		n.x,
		n.y,
		n.z
	]);
}
async function He(e) {
	let { validPaths: t, frequencies: n, receiver: r, arrivalPressure: i, lateReverbTailEnabled: a, energyHistogram: o, tailCrossfadeTime: s, tailCrossfadeDuration: c, updateResult: l } = e;
	if (t.length === 0) throw Error("No paths calculated yet. Run calculate() first.");
	let u = g.sampleRate, d = Array(n.length).fill(100), f = t[t.length - 1].arrivalTime + .05, p = Math.floor(u * f) * 2, h = [];
	for (let e = 0; e < n.length; e++) h.push(new Float32Array(p));
	for (let e of t) {
		let t = Math.random() > .5 ? 1 : -1, a = i(d, e, J(r, e)), o = Math.floor(e.arrivalTime * u);
		for (let e = 0; e < n.length; e++) o < h[e].length && (h[e][o] += a[e] * t);
	}
	let _ = h;
	if (a && o) {
		let e = C(o, n, s, w), { tailSamples: t, tailStartSample: r } = b(e, u), i = Math.floor(c * u);
		_ = ne(h, t, r, i);
	}
	let v = q();
	return new Promise((e, t) => {
		v.postMessage({ samples: _ }), v.onmessage = (n) => {
			let r = n.data.samples, i = new Float32Array(r[0].length >> 1), a = 0;
			for (let e = 0; e < r.length; e++) for (let t = 0; t < i.length; t++) i[t] += r[e][t], Math.abs(i[t]) > a && (a = Math.abs(i[t]));
			let o = m(i), s = g.createOfflineContext(1, i.length, u), c = g.createBufferSource(o, s);
			c.connect(s.destination), c.start(), g.renderContextAsync(s).then((t) => {
				l(t, u), e(t);
			}).catch(t).finally(() => v.terminate());
		}, v.onerror = (e) => {
			v.terminate(), t(e);
		};
	});
}
function Ue(e) {
	let { ir: t, sampleRate: n, sourceIDs: r, receiverIDs: i, impulseResponseResult: a, solverUuid: o } = e, s = f.getState().containers, c = r.length > 0 && s[r[0]]?.name || "source", u = i.length > 0 && s[i[0]]?.name || "receiver", d = t.getChannelData(0), m = [], h = Math.max(1, Math.floor(d.length / 2e3));
	for (let e = 0; e < d.length; e += h) m.push({
		time: e / n,
		amplitude: d[e]
	});
	console.log(`BeamTraceSolver: Updating IR result with ${m.length} samples, duration: ${(d.length / n).toFixed(3)}s`);
	let g = {
		kind: p.ImpulseResponse,
		data: m,
		info: {
			sampleRate: n,
			sourceName: c,
			receiverName: u,
			sourceId: r[0] || "",
			receiverId: i[0] || ""
		},
		name: `IR: ${c} → ${u}`,
		uuid: a,
		from: o
	};
	l("UPDATE_RESULT", {
		uuid: a,
		result: g
	});
}
async function We(e) {
	let { validPaths: t, frequencies: n, receiver: r, arrivalPressure: i, lateReverbTailEnabled: a, energyHistogram: o, tailCrossfadeTime: s, tailCrossfadeDuration: c, order: l } = e;
	if (t.length === 0) throw Error("No paths calculated yet. Run calculate() first.");
	let u = g.sampleRate, d = Array(n.length).fill(100), f = t[t.length - 1].arrivalTime + .05;
	if (f <= 0) throw Error("Invalid impulse response duration");
	let p = Math.floor(u * f) * 2;
	if (p < 2) throw Error("Impulse response too short to process");
	let m = ie(l), h = [];
	for (let e = 0; e < n.length; e++) {
		h.push([]);
		for (let t = 0; t < m; t++) h[e].push(new Float32Array(p));
	}
	for (let e of t) {
		let t = Math.random() > .5 ? 1 : -1, a = i(d, e, J(r, e)), o = Math.floor(e.arrivalTime * u);
		if (o >= p) continue;
		let s = /* @__PURE__ */ new Float32Array(1), c = e.arrivalDirection;
		for (let e = 0; e < n.length; e++) {
			s[0] = a[e] * t;
			let n = te(s, c.x, c.y, c.z, l, "threejs");
			for (let t = 0; t < m; t++) h[e][t][o] += n[t][0];
		}
	}
	if (a && o) {
		let e = C(o, n, s, w), t = Math.floor(c * u);
		ee(h, e, u, t);
	}
	let _ = async (e) => new Promise((t) => {
		let r = [];
		for (let t = 0; t < n.length; t++) r.push(h[t][e]);
		let i = q();
		i.postMessage({ samples: r }), i.onmessage = (e) => {
			let n = e.data.samples, r = new Float32Array(n[0].length >> 1);
			for (let e = 0; e < n.length; e++) for (let t = 0; t < r.length; t++) r[t] += n[e][t];
			i.terminate(), t(r);
		};
	}), v = await Promise.all(Array.from({ length: m }, (e, t) => _(t))), y = 0;
	for (let e of v) for (let t = 0; t < e.length; t++) Math.abs(e[t]) > y && (y = Math.abs(e[t]));
	if (y > 0) for (let e of v) for (let t = 0; t < e.length; t++) e[t] /= y;
	let b = v[0].length;
	if (b === 0) throw Error("Filtered signal has zero length");
	let x = g.createOfflineContext(m, b, u).createBuffer(m, b, u);
	for (let e = 0; e < m; e++) x.copyToChannel(new Float32Array(v[e]), e);
	return x;
}
async function Ge(e) {
	return ae(e);
}
function Ke(e) {
	let { validPaths: t, frequencies: n, receiver: r, arrivalPressure: i, filename: a } = e, o = e.sampleRate ?? g.sampleRate;
	if (t.length === 0) throw Error("No paths calculated yet. Run calculate() first.");
	let s = Array(n.length).fill(100), c = [...t].sort((e, t) => e.arrivalTime - t.arrivalTime), l = c[c.length - 1].arrivalTime + .05, u = Math.floor(o * l), d = [];
	for (let e = 0; e < n.length; e++) d.push(new Float32Array(u));
	for (let e of c) {
		let t = Math.random() > .5 ? 1 : -1, a = i(s, e, J(r, e)), c = Math.floor(e.arrivalTime * o);
		for (let e = 0; e < n.length; e++) c < d[e].length && (d[e][c] += a[e] * t);
	}
	for (let e = 0; e < n.length; e++) {
		let t = h([m(d[e])], {
			sampleRate: o,
			bitDepth: 32
		});
		Ve.default.saveAs(t, `${n[e]}_${a}.wav`);
	}
}
//#endregion
//#region src/compute/beam-trace/results.ts
function qe(e) {
	let { validPaths: t, frequencies: n, receiver: r, arrivalPressure: i } = e, a = n.length, o = [];
	for (let e = 0; e < a; e++) o.push(new Float32Array(y));
	let s = Array(a).fill(100);
	for (let e of t) {
		let t = Math.floor(e.arrivalTime / w);
		if (t < 0 || t >= 1e4) continue;
		let n = i(s, e, J(r, e));
		for (let e = 0; e < a; e++) o[e][t] += n[e] * n[e];
	}
	return o;
}
function Je(e) {
	let { validPaths: t, levelTimeProgressionId: n, plotFrequency: r, maxReflectionOrder: i, solverUuid: a, receiver: o, arrivalPressure: s } = e;
	if (t.length === 0) return;
	let c = [...t].sort((e, t) => e.arrivalTime - t.arrivalTime), u = { ...d.getState().results[n] };
	u.data = [], u.info = {
		...u.info,
		maxOrder: i,
		frequency: [r]
	};
	for (let e = 0; e < c.length; e++) {
		let t = c[e], n = J(o, t), r = s(u.info.initialSPL, t, n), i = _(r);
		u.data.push({
			time: t.arrivalTime,
			pressure: i,
			arrival: e + 1,
			order: t.order,
			uuid: `${a}-path-${e}`
		});
	}
	l("UPDATE_RESULT", {
		uuid: n,
		result: u
	});
}
function Ye(e) {
	let { validPaths: t, frequencies: n, sourceId: r, receiverId: i, receiver: a, arrivalPressure: o } = e, s = Array(n.length).fill(100), c = [...t].sort((e, t) => e.arrivalTime - t.arrivalTime), l = [];
	for (let e of c) {
		let t = o(s, e, J(a, e));
		l.push({
			time: e.arrivalTime,
			bounces: e.order,
			level: _(t)
		});
	}
	let u = { [i]: { [r]: {
		freqs: n,
		response: l
	} } };
	return v(u, 256) ?? u;
}
//#endregion
//#region src/compute/beam-trace/quick-estimate.ts
function Xe(e, t, n = 500) {
	if (e._quickEstimateInterval !== null && (window.clearInterval(e._quickEstimateInterval), e._quickEstimateInterval = null), !t || !e.room) return;
	let r = [];
	if (e.room.surfaces.traverse((e) => {
		e.isMesh && r.push(e);
	}), r.length === 0) return;
	e.quickEstimateResults = [], e.estimatedT30 = null;
	let i = 0;
	e._quickEstimateInterval = window.setInterval(() => {
		for (let a = 0; a < 10 && i < n; a++, i++) e.quickEstimateResults.push(x(e._raycaster, r, t.position, t.initialIntensity, e.frequencies, e.temperature));
		if (i >= n) {
			window.clearInterval(e._quickEstimateInterval), e._quickEstimateInterval = null;
			let t = e.frequencies.length, n = Array(t).fill(0), r = Array(t).fill(0);
			for (let i of e.quickEstimateResults) for (let e = 0; e < t; e++) i.rt60s[e] > 0 && (n[e] += i.rt60s[e], r[e]++);
			for (let e = 0; e < t; e++) n[e] = r[e] > 0 ? n[e] / r[e] : 0;
			e.estimatedT30 = n, l("BEAMTRACE_QUICK_ESTIMATE_COMPLETE", e.uuid);
		}
	}, 5);
}
//#endregion
//#region src/compute/beam-trace/events.ts
function Ze(e) {
	n("BEAMTRACE_SET_PROPERTY", s), n("REMOVE_BEAMTRACE", t), n("ADD_BEAMTRACE", o(e)), n("BEAMTRACE_CALCULATE", (e) => {
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
}
//#endregion
//#region src/compute/beam-trace/paths.ts
function Qe(e, t, n) {
	let r = e.map((e) => new E.Vector3(e.position[0], e.position[1], e.position[2])), i = G(e), a = Ne(e, n), o = K(e), s = e.map((e) => e.polygonId), c;
	if (r.length >= 2) {
		let [e, t, n] = S(r[0], r[1]);
		c = new E.Vector3(e, t, n);
	} else c = new E.Vector3(0, 0, 1);
	let l = t?.reflections.map((e) => ({
		polygonId: e.polygonId,
		hitPoint: new E.Vector3(e.hitPoint[0], e.hitPoint[1], e.hitPoint[2]),
		incidenceAngle: e.incidenceAngle,
		surfaceNormal: new E.Vector3(e.surfaceNormal[0], e.surfaceNormal[1], e.surfaceNormal[2]),
		isGrazing: e.isGrazing
	}));
	return {
		points: r,
		order: o,
		length: i,
		arrivalTime: a,
		polygonIds: s,
		arrivalDirection: c,
		reflections: l
	};
}
//#endregion
//#region src/compute/beam-trace/tree-signature.ts
function $e(e) {
	return [
		e.sourceId,
		e.roomID,
		String(e.maxOrder),
		String(e.surfaceCount),
		e.sourceX.toFixed(6),
		e.sourceY.toFixed(6),
		e.sourceZ.toFixed(6),
		e.surfaceWorlds.map((e) => e.toFixed(6)).join(",")
	].join("|");
}
//#endregion
//#region src/compute/beam-trace/geometry.ts
function et(e) {
	let t = [], n = e.geometry, r = n.getAttribute("position");
	if (!r) return t;
	e.updateMatrixWorld(!0);
	let i = e.matrixWorld, a = n.getIndex(), o = r.array, s = (e, n, r) => {
		let a = new E.Vector3(o[e * 3], o[e * 3 + 1], o[e * 3 + 2]).applyMatrix4(i), s = new E.Vector3(o[n * 3], o[n * 3 + 1], o[n * 3 + 2]).applyMatrix4(i), c = new E.Vector3(o[r * 3], o[r * 3 + 1], o[r * 3 + 2]).applyMatrix4(i), l = [
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
		];
		t.push(A.create(l));
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
function tt(e) {
	let t = [], n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
	return e && e.allSurfaces.forEach((e) => {
		let i = et(e), a = t.length;
		i.forEach((n, i) => {
			r.set(a + i, e), t.push(n);
		}), n.set(e.uuid, i.map((e, t) => a + t));
	}), {
		polygons: t,
		surfaceToPolygonIndex: n,
		polygonToSurface: r
	};
}
function nt(e) {
	let { source: t, room: n, roomID: r, maxOrder: i } = e;
	if (!t || !n) return null;
	let a = n.allSurfaces, o = [];
	for (let e of a) {
		e.updateMatrixWorld(!0);
		let t = e.matrixWorld.elements;
		for (let e = 0; e < 16; e++) o.push(t[e]);
	}
	return $e({
		sourceId: t.uuid,
		sourceX: t.position.x,
		sourceY: t.position.y,
		sourceZ: t.position.z,
		roomID: r,
		maxOrder: i,
		surfaceCount: a.length,
		surfaceWorlds: o
	});
}
//#endregion
//#region src/compute/beam-trace/diffraction.ts
function rt(e) {
	let { room: t, sourceId: n, receiverId: r, frequencies: i, speedOfSound: a, temperature: o, containers: s, raycaster: c } = e, l = re(t.allSurfaces);
	if (l.edges.length === 0) return {
		paths: [],
		edgeGraph: l
	};
	let u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = s[n];
	if (f) {
		u.set(n, [
			f.position.x,
			f.position.y,
			f.position.z
		]);
		let e = f.directivityHandler;
		if (e) {
			let t = Array(i.length);
			for (let n = 0; n < i.length; n++) t[n] = e.getPressureAtPosition(0, i[n], 0, 0);
			d.set(n, {
				handler: e,
				refPressures: t,
				quaternion: f.quaternion.clone()
			});
		}
	}
	let p = /* @__PURE__ */ new Map(), m = s[r];
	m && p.set(r, [
		m.position.x,
		m.position.y,
		m.position.z
	]);
	let h = [];
	t.surfaces.traverse((e) => {
		e.kind && e.kind === "surface" && h.push(e.mesh);
	});
	let g = oe(l, u, p, i, a, o, c, h), _ = [];
	for (let e of g) {
		let t = d.get(e.sourceId);
		if (t) {
			let n = u.get(e.sourceId), r = new E.Vector3(e.diffractionPoint[0] - n[0], e.diffractionPoint[1] - n[1], e.diffractionPoint[2] - n[2]), a = me(t.handler, t.refPressures, t.quaternion, r, i);
			for (let t = 0; t < i.length; t++) e.bandEnergy[t] *= a[t];
		}
		let n = p.get(e.receiverId), r = {
			x: e.diffractionPoint[0],
			y: e.diffractionPoint[1],
			z: e.diffractionPoint[2]
		}, a = {
			x: n[0],
			y: n[1],
			z: n[2]
		}, [o, s, c] = S(a, r), l = new E.Vector3(o, s, c), f = u.get(e.sourceId), m = new E.Vector3(n[0], n[1], n[2]), h = new E.Vector3(e.diffractionPoint[0], e.diffractionPoint[1], e.diffractionPoint[2]), g = new E.Vector3(f[0], f[1], f[2]);
		_.push({
			points: [
				m,
				h,
				g
			],
			order: 0,
			length: e.totalDistance,
			arrivalTime: e.time,
			polygonIds: [
				null,
				null,
				null
			],
			arrivalDirection: l,
			reflections: [],
			bandEnergy: e.bandEnergy
		});
	}
	return {
		paths: _,
		edgeGraph: l
	};
}
//#endregion
//#region src/compute/beam-trace/visualization.ts
var it = D.scale(["#ff8a0b", "#000080"]).mode("lch");
function Y(e, t) {
	let n = t + 1, r = it.colors(n), i = Math.min(e, n - 1), a = D(r[i]);
	return parseInt(a.hex().slice(1), 16);
}
function at() {
	let e = new ge();
	e.setPoints(/* @__PURE__ */ new Float32Array());
	let t = new _e({
		lineWidth: .1,
		color: 16711680,
		sizeAttenuation: 1
	});
	return new E.Mesh(e, t);
}
function ot(e) {
	if (e instanceof E.Mesh || e instanceof E.Line) {
		e.geometry?.dispose();
		let t = e.material;
		if (Array.isArray(t)) for (let e of t) e instanceof E.Material && e.dispose();
		else t instanceof E.Material && t.dispose();
	}
}
function X(e) {
	for (; e.children.length > 0;) {
		let t = e.children[0];
		e.remove(t), ot(t);
	}
}
function Z(e) {
	u.markup.clearLines(), u.markup.clearPoints(), X(e);
}
function st(e, t) {
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
function ct(e) {
	let { validPaths: t, visibleOrders: n, maxReflectionOrder: r, virtualSourcesGroup: i, lastMetrics: a } = e, o = t.filter((e) => n.includes(e.order));
	o.forEach((e) => {
		let t = Y(e.order, r), n = [
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
	}), o.forEach((e) => {
		if (e.bandEnergy && e.points.length === 3) {
			let t = e.points[1], n = Y(e.order, r), a = new E.SphereGeometry(.06, 8, 8), o = new E.MeshBasicMaterial({ color: n }), s = new E.Mesh(a, o);
			s.position.copy(t), i.add(s);
		}
	});
	let s = u.markup.getUsageStats();
	a && (a.bufferUsage = s), s.overflowWarning ? console.error(`⚠️ Path buffer overflow! Lines: ${s.linesUsed}/${s.linesCapacity}. Reduce reflection order.`) : s.linesPercent > 80 && console.warn(`Buffer usage high: Lines ${s.linesPercent.toFixed(1)}%`);
}
function lt(e) {
	if (!e.btSolver) return;
	X(e.virtualSourcesGroup), e.virtualSourceMap.clear(), e.selectedVirtualSource = null;
	let t = e.validPaths;
	e.btSolver.getBeamsForVisualization(e.maxReflectionOrder).forEach((n) => {
		if (!e.visibleOrders.includes(n.reflectionOrder)) return;
		let r = st(n, t);
		if (!r && !e.showAllBeams) return;
		let i = Math.max(.05, .1 - n.reflectionOrder * .01), a = Y(n.reflectionOrder, e.maxReflectionOrder), o = a;
		if (!r) {
			let e = (a >> 16 & 255) * .4 + 76.8, t = (a >> 8 & 255) * .4 + 76.8, n = (a & 255) * .4 + 76.8;
			o = Math.round(e) << 16 | Math.round(t) << 8 | Math.round(n);
		}
		let s = new E.Vector3(n.virtualSource[0], n.virtualSource[1], n.virtualSource[2]), c = new E.SphereGeometry(i, 12, 12), l = new E.MeshStandardMaterial({
			color: o,
			transparent: !r,
			opacity: r ? 1 : .4,
			roughness: .6,
			metalness: .1
		}), u = new E.Mesh(c, l);
		u.position.copy(s), e.virtualSourcesGroup.add(u), r && e.virtualSourceMap.set(u, {
			...n,
			polygonPath: n.polygonPath || []
		});
		let d = n.apertureVertices;
		if (d && d.length >= 3) {
			let t = d.map((e) => new E.Vector3(e[0], e[1], e[2])), n = new E.BufferGeometry(), i = new Float32Array(t.length * 3);
			for (let e = 0; e < t.length; e++) i[e * 3] = t[e].x, i[e * 3 + 1] = t[e].y, i[e * 3 + 2] = t[e].z;
			n.setAttribute("position", new E.BufferAttribute(i, 3));
			let a = [];
			for (let e = 1; e < t.length - 1; e++) a.push(0, e, e + 1);
			n.setIndex(a), n.computeVertexNormals();
			let c = new E.MeshBasicMaterial({
				color: o,
				side: E.DoubleSide,
				transparent: !0,
				opacity: r ? .2 : .08,
				depthWrite: !1
			});
			e.virtualSourcesGroup.add(new E.Mesh(n, c));
			let l = new E.BufferGeometry().setFromPoints(t), u = new E.LineBasicMaterial({
				color: o,
				transparent: !0,
				opacity: r ? .5 : .2
			});
			e.virtualSourcesGroup.add(new E.LineLoop(l, u));
			let f = [];
			for (let e of t) f.push(s.clone(), e);
			let p = new E.BufferGeometry().setFromPoints(f), m = new E.LineBasicMaterial({
				color: o,
				transparent: !0,
				opacity: r ? .35 : .12
			});
			e.virtualSourcesGroup.add(new E.LineSegments(p, m));
		}
	}), u.needsToRender = !0;
}
function ut(e) {
	let { beam: t, validPaths: n, maxReflectionOrder: r, receiver: i, selectedPath: a, selectedBeamsGroup: o } = e;
	a.geometry.setPoints(/* @__PURE__ */ new Float32Array()), X(o);
	let s = Y(t.reflectionOrder, r), c = new E.Vector3(t.virtualSource[0], t.virtualSource[1], t.virtualSource[2]);
	if (!i) return;
	let l = i.position.clone(), d = new E.LineDashedMaterial({
		color: s,
		transparent: !0,
		opacity: .4,
		dashSize: .3,
		gapSize: .15
	}), f = new E.BufferGeometry().setFromPoints([c, l]), p = new E.Line(f, d);
	p.computeLineDistances(), o.add(p);
	let m = new E.SphereGeometry(.18, 16, 16), h = new E.MeshBasicMaterial({
		color: s,
		transparent: !0,
		opacity: .4
	}), g = new E.Mesh(m, h);
	g.position.copy(c), o.add(g);
	let _ = t.polygonPath;
	if (!_ || _.length === 0) return;
	let v = t.reflectionOrder;
	for (let e of n) {
		if (e.order !== v) continue;
		let t = !0;
		for (let n = 0; n < _.length; n++) {
			let r = v - n;
			if (e.polygonIds[r] !== _[n]) {
				t = !1;
				break;
			}
		}
		if (t) {
			let t = e.points, n = e.order;
			for (let e = 0; e < t.length - 1; e++) {
				let i = t[e], a = t[e + 1], s = i.distanceTo(a), c = new E.Vector3().addVectors(i, a).multiplyScalar(.5), l = n - e, u = l === 0 ? 16777215 : Y(l, r), d = new E.CylinderGeometry(.025, .025, s, 8), f = new E.MeshBasicMaterial({ color: u }), p = new E.Mesh(d, f);
				p.position.copy(c);
				let m = new E.Vector3().subVectors(a, i).normalize(), h = new E.Quaternion();
				h.setFromUnitVectors(new E.Vector3(0, 1, 0), m), p.setRotationFromQuaternion(h), o.add(p);
			}
			for (let t = 1; t < e.points.length - 1; t++) {
				let i = Y(n - t + 1, r), a = new E.SphereGeometry(.08, 12, 12), s = new E.MeshBasicMaterial({ color: i }), c = new E.Mesh(a, s);
				c.position.copy(e.points[t]), o.add(c);
			}
			u.needsToRender = !0;
			return;
		}
	}
	u.needsToRender = !0;
}
function dt(e) {
	let { pathIndex: t, validPaths: n, maxReflectionOrder: r, btSolver: i, receiver: a, selectedPath: o, selectedBeamsGroup: s } = e, c = [...n].sort((e, t) => e.arrivalTime - t.arrivalTime);
	if (t < 0 || t >= c.length) {
		console.warn("BeamTraceSolver: Path index out of bounds:", t);
		return;
	}
	let l = c[t];
	o.geometry.setPoints(/* @__PURE__ */ new Float32Array()), X(s);
	let d = Y(l.order, r), f = new E.LineBasicMaterial({
		color: d,
		linewidth: 2,
		transparent: !1
	});
	for (let e = 0; e < l.points.length - 1; e++) {
		let t = new E.BufferGeometry().setFromPoints([l.points[e], l.points[e + 1]]);
		s.add(new E.Line(t, f));
	}
	if (i && a) {
		let e = i.getBeamsForVisualization(r), t = l.polygonIds[l.order];
		if (t !== null) {
			let n = e.find((e) => e.polygonId === t && e.reflectionOrder === l.order);
			if (n) {
				let e = new E.LineDashedMaterial({
					color: d,
					linewidth: 1,
					dashSize: .3,
					gapSize: .15,
					transparent: !0,
					opacity: .7
				}), t = new E.Vector3(n.virtualSource[0], n.virtualSource[1], n.virtualSource[2]), r = new E.BufferGeometry().setFromPoints([t, a.position.clone()]), i = new E.Line(r, e);
				i.computeLineDistances(), s.add(i);
			}
		}
	}
	console.log(`BeamTraceSolver: Highlighting path ${t} with order ${l.order}, arrival time ${l.arrivalTime.toFixed(4)}s`), u.needsToRender = !0;
}
function ft(e) {
	switch (Z(e.virtualSourcesGroup), e.mode) {
		case "rays":
			e.validPaths.length > 0 && e.drawPathsFn();
			break;
		case "beams":
			e.btSolver && e.drawBeamsFn();
			break;
		case "both": e.validPaths.length > 0 && e.drawPathsFn(), e.btSolver && e.drawBeamsFn();
	}
	u.needsToRender = !0;
}
function Q(e) {
	let t = u.renderer.domElement;
	e.clickHandler &&= (t.removeEventListener("click", e.clickHandler), null), e.hoverHandler && (t.removeEventListener("mousemove", e.hoverHandler), e.hoverHandler = null, t.style.cursor = "default");
}
function pt(e) {
	Q(e);
	let t = u.renderer.domElement, n = (e) => {
		let n = t.getBoundingClientRect();
		return new E.Vector2((e.clientX - n.left) / n.width * 2 - 1, -((e.clientY - n.top) / n.height) * 2 + 1);
	};
	e.hoverHandler = (r) => {
		if (e.virtualSourceMap.size === 0) {
			t.style.cursor = "default";
			return;
		}
		let i = n(r), a = new E.Raycaster();
		a.setFromCamera(i, u.camera);
		let o = a.intersectObjects(Array.from(e.virtualSourceMap.keys()));
		t.style.cursor = o.length > 0 ? "pointer" : "default";
	}, e.clickHandler = (t) => {
		if (t.button !== 0 || e.virtualSourceMap.size === 0) return;
		let r = n(t), i = new E.Raycaster();
		i.setFromCamera(r, u.camera);
		let a = i.intersectObjects(Array.from(e.virtualSourceMap.keys()));
		if (a.length > 0) {
			let t = a[0].object, n = e.virtualSourceMap.get(t);
			n && (e.selectedVirtualSource === t ? (e.selectedVirtualSource = null, e.onDeselect()) : (e.selectedVirtualSource = t, e.onSelectBeam(n)));
		}
	}, t.addEventListener("click", e.clickHandler), t.addEventListener("mousemove", e.hoverHandler);
}
//#endregion
//#region src/compute/beam-trace/index.ts
var $ = class extends le {
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
	_raycaster = new E.Raycaster();
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
	_lastTreeSignature = null;
	constructor(t = {}) {
		super(t);
		let n = {
			...Be,
			...t
		};
		if (this.kind = "beam-trace", this.uuid = n.uuid || e(), this.name = n.name, this.roomID = n.roomID, this.sourceIDs = n.sourceIDs, this.receiverIDs = n.receiverIDs, this.maxReflectionOrder = n.maxReflectionOrder, this.frequencies = n.frequencies, this.hrtfSubjectId = n.hrtfSubjectId, this.headYaw = n.headYaw, this.headPitch = n.headPitch, this.headRoll = n.headRoll, this.edgeDiffractionEnabled = n.edgeDiffractionEnabled, this.lateReverbTailEnabled = n.lateReverbTailEnabled, this.tailCrossfadeTime = n.tailCrossfadeTime, this.tailCrossfadeDuration = n.tailCrossfadeDuration, this._visualizationMode = n.visualizationMode, this._showAllBeams = n.showAllBeams, this._visibleOrders = n.visibleOrders.length > 0 ? n.visibleOrders : Array.from({ length: n.maxReflectionOrder + 1 }, (e, t) => t), this._plotFrequency = 1e3, this._plotOrders = Array.from({ length: n.maxReflectionOrder + 1 }, (e, t) => t), this.levelTimeProgression = n.levelTimeProgression || e(), this.impulseResponseResult = n.impulseResponseResult || e(), !this.roomID) {
			let e = ce();
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
		}), this.selectedPath = at(), u.markup.add(this.selectedPath), this.selectedBeamsGroup = new E.Group(), this.selectedBeamsGroup.name = "selected-beams-highlight", u.markup.add(this.selectedBeamsGroup), this.virtualSourcesGroup = new E.Group(), this.virtualSourcesGroup.name = "virtual-sources", u.markup.add(this.virtualSourcesGroup);
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
		this.reset(), this.removeClickHandler(), u.markup.remove(this.selectedPath), u.markup.remove(this.selectedBeamsGroup), u.markup.remove(this.virtualSourcesGroup), this.selectedPath.geometry?.dispose();
		let e = this.selectedPath.material;
		if (e instanceof E.Material) e.dispose();
		else if (Array.isArray(e)) for (let t of e) t instanceof E.Material && t.dispose();
		l("REMOVE_RESULT", this.levelTimeProgression), l("REMOVE_RESULT", this.impulseResponseResult);
	}
	clickHost() {
		let e = {
			virtualSourceMap: this.virtualSourceMap,
			clickHandler: this.clickHandler,
			hoverHandler: this.hoverHandler,
			onSelectBeam: (e) => this.highlightVirtualSourcePath(e),
			onDeselect: () => this.clearSelectedBeams(),
			selectedVirtualSource: null
		};
		return Object.defineProperty(e, "selectedVirtualSource", {
			get: () => this.selectedVirtualSource,
			set: (e) => {
				this.selectedVirtualSource = e;
			},
			enumerable: !0,
			configurable: !0
		}), e;
	}
	setupClickHandler() {
		let e = this.clickHost();
		pt(e), this.clickHandler = e.clickHandler, this.hoverHandler = e.hoverHandler;
	}
	removeClickHandler() {
		let e = this.clickHost();
		Q(e), this.clickHandler = e.clickHandler, this.hoverHandler = e.hoverHandler;
	}
	highlightVirtualSourcePath(e) {
		let t = this.receiverIDs.length === 0 ? void 0 : f.getState().containers[this.receiverIDs[0]];
		ut({
			beam: e,
			validPaths: this.validPaths,
			maxReflectionOrder: this.maxReflectionOrder,
			receiver: t,
			selectedPath: this.selectedPath,
			selectedBeamsGroup: this.selectedBeamsGroup
		});
	}
	extractPolygons() {
		let e = tt(this.room);
		return this.polygons = e.polygons, this.surfaceToPolygonIndex = e.surfaceToPolygonIndex, this.polygonToSurface = e.polygonToSurface, e.polygons;
	}
	currentTreeSignature() {
		if (this.sourceIDs.length === 0) return null;
		let e = f.getState().containers[this.sourceIDs[0]];
		return nt({
			source: e,
			room: this.room,
			roomID: this.roomID,
			maxOrder: this.maxReflectionOrder
		});
	}
	needsBeamTreeRebuild() {
		if (!this.btSolver) return !0;
		let e = this.currentTreeSignature();
		return e === null || e !== this._lastTreeSignature;
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
		let t = [
			e.position.x,
			e.position.y,
			e.position.z
		];
		this.btSolver = new ze(this.polygons, new Re(t), { maxReflectionOrder: this.maxReflectionOrder }), this._lastTreeSignature = this.currentTreeSignature(), console.log(`BeamTraceSolver: Built with ${this.polygons.length} polygons, max order ${this.maxReflectionOrder}`);
	}
	calculate() {
		if (this.sourceIDs.length === 0 || this.receiverIDs.length === 0) {
			console.warn("BeamTraceSolver: Need at least one source and one receiver");
			return;
		}
		this.sourceIDs.length > 1 && console.warn(`BeamTraceSolver: ${this.sourceIDs.length} sources selected; using only the first (${this.sourceIDs[0]})`), this.receiverIDs.length > 1 && console.warn(`BeamTraceSolver: ${this.receiverIDs.length} receivers selected; using only the first (${this.receiverIDs[0]})`);
		let e = this.receiverIDs[0];
		if (this.needsBeamTreeRebuild() ? this.buildSolver() : this.btSolver && (this.btSolver.clearCache(), console.log("BeamTraceSolver: Reusing beam tree (listener-only change)")), !this.btSolver) {
			console.warn("BeamTraceSolver: Solver not built");
			return;
		}
		this.validPaths = [], this.clearVisualization();
		let t = f.getState().containers[e];
		if (!t) {
			console.warn("BeamTraceSolver: Receiver not found");
			return;
		}
		let n = [
			t.position.x,
			t.position.y,
			t.position.z
		], r = this.btSolver.getPaths(n);
		this.lastMetrics = this.btSolver.getMetrics();
		let i = this.btSolver.getDetailedPaths(n);
		switch (r.forEach((e, t) => {
			let n = t < i.length ? i[t] : void 0;
			this.validPaths.push(this.convertPath(e, n));
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
		return Qe(e, t, this.c);
	}
	calculateLTP() {
		let e = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null;
		Je({
			validPaths: this.validPaths,
			levelTimeProgressionId: this.levelTimeProgression,
			plotFrequency: this._plotFrequency,
			maxReflectionOrder: this.maxReflectionOrder,
			solverUuid: this.uuid,
			receiver: e,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n)
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
		this.highlightPathByIndex(parseInt(t[1], 10));
	}
	clearVisualization() {
		Z(this.virtualSourcesGroup), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
	}
	drawPaths() {
		ct({
			validPaths: this.validPaths,
			visibleOrders: this._visibleOrders,
			maxReflectionOrder: this.maxReflectionOrder,
			virtualSourcesGroup: this.virtualSourcesGroup,
			lastMetrics: this.lastMetrics
		});
	}
	drawBeams() {
		let e = {
			btSolver: this.btSolver,
			validPaths: this.validPaths,
			visibleOrders: this._visibleOrders,
			maxReflectionOrder: this.maxReflectionOrder,
			showAllBeams: this._showAllBeams,
			virtualSourcesGroup: this.virtualSourcesGroup,
			virtualSourceMap: this.virtualSourceMap,
			selectedVirtualSource: this.selectedVirtualSource
		};
		lt(e), this.selectedVirtualSource = e.selectedVirtualSource, this.setupClickHandler(), u.needsToRender = !0;
	}
	_computeDiffractionPaths() {
		if (!this.room) return;
		let e = rt({
			room: this.room,
			sourceId: this.sourceIDs[0],
			receiverId: this.receiverIDs[0],
			frequencies: this.frequencies,
			speedOfSound: this.c,
			temperature: this.temperature,
			containers: f.getState().containers,
			raycaster: this._raycaster
		});
		this._edgeGraph = e.edgeGraph, this.validPaths.push(...e.paths), e.paths.length > 0 && console.log(`BeamTraceSolver: Found ${e.paths.length} diffraction paths`);
	}
	_buildEnergyHistogram() {
		let e = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null;
		this._energyHistogram = qe({
			validPaths: this.validPaths,
			frequencies: this.frequencies,
			receiver: e,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n)
		});
	}
	calculateArrivalPressure(e, t, n = 1) {
		let r = this.sourceIDs.length > 0 ? f.getState().containers[this.sourceIDs[0]] : null;
		return he(e, t, {
			frequencies: this.frequencies,
			temperature: this.temperature,
			receiverGain: n,
			source: r?.directivityHandler ? r : null,
			polygonToSurface: this.polygonToSurface
		});
	}
	async calculateImpulseResponse() {
		let e = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null, t = await He({
			validPaths: this.validPaths,
			frequencies: this.frequencies,
			receiver: e,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n),
			lateReverbTailEnabled: this.lateReverbTailEnabled,
			energyHistogram: this._energyHistogram,
			tailCrossfadeTime: this.tailCrossfadeTime,
			tailCrossfadeDuration: this.tailCrossfadeDuration,
			updateResult: (e, t) => {
				this.impulseResponse = e, Ue({
					ir: e,
					sampleRate: t,
					sourceIDs: this.sourceIDs,
					receiverIDs: this.receiverIDs,
					impulseResponseResult: this.impulseResponseResult,
					solverUuid: this.uuid
				});
			}
		});
		return this.impulseResponse = t, t;
	}
	async playImpulseResponse() {
		let e = await ue(this.impulseResponse, () => this.calculateImpulseResponse(), this.uuid, "BEAMTRACE_SET_PROPERTY");
		this.impulseResponse = e.impulseResponse;
	}
	async downloadImpulseResponse(e, t = g.sampleRate) {
		let n = await pe(this.impulseResponse, () => this.calculateImpulseResponse(), e, t);
		this.impulseResponse = n.impulseResponse;
	}
	ambisonicImpulseResponse;
	ambisonicOrder = 1;
	async calculateAmbisonicImpulseResponse(e = 1) {
		let t = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null, n = await We({
			validPaths: this.validPaths,
			frequencies: this.frequencies,
			receiver: t,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n),
			lateReverbTailEnabled: this.lateReverbTailEnabled,
			energyHistogram: this._energyHistogram,
			tailCrossfadeTime: this.tailCrossfadeTime,
			tailCrossfadeDuration: this.tailCrossfadeDuration,
			order: e
		});
		return this.ambisonicImpulseResponse = n, this.ambisonicOrder = e, n;
	}
	async downloadAmbisonicImpulseResponse(e, t = 1) {
		let n = await T(this.ambisonicImpulseResponse, (e) => this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder, t, e);
		this.ambisonicImpulseResponse = n.ambisonicImpulseResponse, this.ambisonicOrder = n.ambisonicOrder;
	}
	async calculateBinauralImpulseResponse(e = 1) {
		return (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder = e), this.binauralImpulseResponse = await Ge({
			ambisonicImpulseResponse: this.ambisonicImpulseResponse,
			order: e,
			hrtfSubjectId: this.hrtfSubjectId,
			headYaw: this.headYaw,
			headPitch: this.headPitch,
			headRoll: this.headRoll
		}), this.binauralImpulseResponse;
	}
	async playBinauralImpulseResponse(e = 1) {
		let t = await de(this.binauralImpulseResponse, () => this.calculateBinauralImpulseResponse(e), this.uuid, "BEAMTRACE_SET_PROPERTY");
		this.binauralImpulseResponse = t.binauralImpulseResponse;
	}
	async downloadBinauralImpulseResponse(e, t = 1) {
		let n = await fe(this.binauralImpulseResponse, () => this.calculateBinauralImpulseResponse(t), e);
		this.binauralImpulseResponse = n.binauralImpulseResponse;
	}
	calculateResponseByIntensity() {
		if (this.validPaths.length === 0 || this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
		let e = this.receiverIDs[0], t = this.sourceIDs[0], n = f.getState().containers[e];
		this.responseByIntensity = Ye({
			validPaths: this.validPaths,
			frequencies: this.frequencies,
			sourceId: t,
			receiverId: e,
			receiver: n,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n)
		});
	}
	downloadOctaveBandIR(e, t = g.sampleRate) {
		let n = this.receiverIDs.length > 0 ? f.getState().containers[this.receiverIDs[0]] : null;
		Ke({
			validPaths: this.validPaths,
			frequencies: this.frequencies,
			receiver: n,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n),
			filename: e,
			sampleRate: t
		});
	}
	startQuickEstimate(e = 500) {
		let t = this.sourceIDs.length === 0 ? void 0 : f.getState().containers[this.sourceIDs[0]];
		Xe(this, t, e);
	}
	reset() {
		this.validPaths = [], this.clearVisualization(), this.btSolver = null, this._lastTreeSignature = null, this.lastMetrics = null, this.responseByIntensity = void 0, this._quickEstimateInterval !== null && (window.clearInterval(this._quickEstimateInterval), this._quickEstimateInterval = null), this.quickEstimateResults = [], this.estimatedT30 = null, this.clearLevelTimeProgressionData(), this.selectedPath.geometry.setPoints(/* @__PURE__ */ new Float32Array()), this.clearSelectedBeams(), u.needsToRender = !0;
	}
	clearSelectedBeams() {
		X(this.selectedBeamsGroup);
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
		this._visualizationMode = e, ft({
			mode: e,
			validPaths: this.validPaths,
			btSolver: this.btSolver,
			virtualSourcesGroup: this.virtualSourcesGroup,
			drawBeamsFn: () => this.drawBeams(),
			drawPathsFn: () => this.drawPaths()
		});
	}
	get showAllBeams() {
		return this._showAllBeams;
	}
	set showAllBeams(e) {
		this._showAllBeams = e, (this._visualizationMode === "beams" || this._visualizationMode === "both") && (this.visualizationMode = this._visualizationMode);
	}
	get visibleOrders() {
		return this._visibleOrders;
	}
	set visibleOrders(e) {
		this._visibleOrders = e, this.visualizationMode = this._visualizationMode;
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
		return e ? this.btSolver.getDetailedPaths([
			e.position.x,
			e.position.y,
			e.position.z
		]) : (console.warn("BeamTraceSolver: Receiver not found."), []);
	}
	highlightPathByIndex(e) {
		let t = this.receiverIDs.length === 0 ? void 0 : f.getState().containers[this.receiverIDs[0]];
		dt({
			pathIndex: e,
			validPaths: this.validPaths,
			maxReflectionOrder: this.maxReflectionOrder,
			btSolver: this.btSolver,
			receiver: t,
			selectedPath: this.selectedPath,
			selectedBeamsGroup: this.selectedBeamsGroup
		});
	}
	clearPathHighlight() {
		this.selectedPath.geometry.setPoints(/* @__PURE__ */ new Float32Array()), this.clearSelectedBeams(), u.needsToRender = !0;
	}
};
Ze($);
//#endregion
export { $ as BeamTraceSolver, $ as default };

//# sourceMappingURL=beam-trace-CoFca5Js.mjs.map