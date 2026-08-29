import { O as __toESM, S as v4, _ as emit, i as removeSolver, n as addSolver, o as setSolverProperty, p as pickProps, s as useSolver, t as require_FileSaver_min, y as on } from "./FileSaver.min-DhK9iPpQ.mjs";
import { f as lerp, t as renderer } from "./renderer-CQRXHm3p.mjs";
import { a as useResult, g as useContainer, i as ResultKind } from "./store-Dol3XeT3.mjs";
import { n as normalize$1, r as wavAsBlob, t as audioEngine } from "./audio-engine-CmA_oANp.mjs";
import { a as I2P, c as P2Lp, i as numbersEqualWithinTolerence, n as getRooms, o as Lp2P, r as Surface, s as P2I } from "./room-B7DOQicQ.mjs";
import "./acoustics-DtDxi75Z.mjs";
import { n as airAttenuation } from "./air-attenuation-BJnoHmX2.mjs";
import { a as playImpulseResponse, i as playBinauralImpulseResponse, n as downloadBinauralImpulseResponse, o as spreadingFactor, r as downloadImpulseResponse, t as downloadAmbisonicImpulseResponse } from "./export-playback-CgbEgL1N.mjs";
import { t as soundSpeed } from "./sound-speed-CfEkirc1.mjs";
import { r as loadDecoderFilters } from "./hrtf-data-D6qGJN2M.mjs";
import { t as Solver } from "./solver-DovuaY8D.mjs";
import * as THREE from "three";
import chroma from "chroma-js";
import { MeshLine, MeshLineMaterial } from "three.meshline";
//#region src/compute/acoustics/util/sum.ts
function sum(e) {
	return e.reduce((e, t) => e + t);
}
//#endregion
//#region src/compute/acoustics/dbaddition.ts
function db_add(e) {
	let t = sum(e.map((e) => 10 ** (e / 10)));
	return 10 * Math.log10(t);
}
//#endregion
//#region node_modules/beam-trace/dist/beamtrace2d.js
var GRAZING_THRESHOLD = Math.PI / 2 - 5 * Math.PI / 180, Vector3$1 = {
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
		return Math.sqrt(Vector3$1.lengthSquared(e));
	},
	normalize(e) {
		let t = Vector3$1.length(e);
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
		return Vector3$1.length(Vector3$1.subtract(e, t));
	},
	distanceSquared(e, t) {
		return Vector3$1.lengthSquared(Vector3$1.subtract(e, t));
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
		let n = 2 * Vector3$1.dot(e, t);
		return Vector3$1.subtract(e, Vector3$1.scale(t, n));
	},
	project(e, t) {
		let n = Vector3$1.lengthSquared(t);
		if (n < 1e-10) return [
			0,
			0,
			0
		];
		let r = Vector3$1.dot(e, t) / n;
		return Vector3$1.scale(t, r);
	},
	reject(e, t) {
		return Vector3$1.subtract(e, Vector3$1.project(e, t));
	},
	toString(e, t = 4) {
		return `[${e[0].toFixed(t)}, ${e[1].toFixed(t)}, ${e[2].toFixed(t)}]`;
	}
}, Plane3D = {
	fromNormalAndPoint(e, t) {
		let n = Vector3$1.normalize(e), r = -Vector3$1.dot(n, t);
		return {
			a: n[0],
			b: n[1],
			c: n[2],
			d: r
		};
	},
	fromPoints(e, t, n) {
		let r = Vector3$1.subtract(t, e), i = Vector3$1.subtract(n, e), a = Vector3$1.normalize(Vector3$1.cross(r, i));
		return Plane3D.fromNormalAndPoint(a, e);
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
		return Math.abs(Plane3D.signedDistance(e, t));
	},
	classifyPoint(e, t, n = 1e-6) {
		let r = Plane3D.signedDistance(e, t);
		return r > n ? "front" : r < -n ? "back" : "on";
	},
	isPointInFront(e, t, n = 1e-6) {
		return Plane3D.signedDistance(e, t) > n;
	},
	isPointBehind(e, t, n = 1e-6) {
		return Plane3D.signedDistance(e, t) < -n;
	},
	isPointOn(e, t, n = 1e-6) {
		return Math.abs(Plane3D.signedDistance(e, t)) <= n;
	},
	mirrorPoint(e, t) {
		let n = Plane3D.signedDistance(e, t), r = Plane3D.normal(t);
		return Vector3$1.subtract(e, Vector3$1.scale(r, 2 * n));
	},
	mirrorPlane(e, t) {
		let n = Plane3D.normal(e), r;
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
		], a = Vector3$1.normalize(Vector3$1.cross(n, i)), o = Vector3$1.add(r, a), s = Vector3$1.cross(n, a), c = Vector3$1.add(r, s), l = Plane3D.mirrorPoint(r, t), u = Plane3D.mirrorPoint(o, t), d = Plane3D.mirrorPoint(c, t);
		return Plane3D.fromPoints(l, u, d);
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
		let r = Plane3D.normal(n), i = Vector3$1.dot(r, t);
		return Math.abs(i) < 1e-10 ? null : -(Vector3$1.dot(r, e) + n.d) / i;
	},
	rayIntersectionPoint(e, t, n) {
		let r = Plane3D.rayIntersection(e, t, n);
		return r === null ? null : Vector3$1.add(e, Vector3$1.scale(t, r));
	},
	projectPoint(e, t) {
		let n = Plane3D.signedDistance(e, t), r = Plane3D.normal(t);
		return Vector3$1.subtract(e, Vector3$1.scale(r, n));
	},
	equals(e, t, n = 1e-6) {
		let r = e.a * t.a + e.b * t.b + e.c * t.c;
		return Math.abs(r - 1) < n ? Math.abs(e.d - t.d) < n : Math.abs(r + 1) < n && Math.abs(e.d + t.d) < n;
	},
	toString(e, t = 4) {
		return `Plane3D(${e.a.toFixed(t)}x + ${e.b.toFixed(t)}y + ${e.c.toFixed(t)}z + ${e.d.toFixed(t)} = 0)`;
	}
}, Polygon3D = {
	create(e, t) {
		if (e.length < 3) throw Error("Polygon requires at least 3 vertices");
		let n = e.map((e) => Vector3$1.clone(e));
		return {
			vertices: n,
			plane: Plane3D.fromPoints(n[0], n[1], n[2]),
			materialId: t
		};
	},
	createWithPlane(e, t, n) {
		if (e.length < 3) throw Error("Polygon requires at least 3 vertices");
		return {
			vertices: e.map((e) => Vector3$1.clone(e)),
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
			let i = e.vertices[r], a = e.vertices[r + 1], o = Vector3$1.cross(Vector3$1.subtract(i, n), Vector3$1.subtract(a, n));
			t = Vector3$1.add(t, o);
		}
		return .5 * Vector3$1.length(t);
	},
	normal(e) {
		return Plane3D.normal(e.plane);
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
			let e = Plane3D.classifyPoint(a, t, n);
			e === "front" ? r++ : e === "back" && i++;
		}
		return r > 0 && i > 0 ? "spanning" : r > 0 ? "front" : i > 0 ? "back" : "coplanar";
	},
	containsPoint(e, t, n = 1e-6) {
		let r = Plane3D.normal(e.plane), i = e.vertices.length;
		for (let a = 0; a < i; a++) {
			let o = e.vertices[a], s = e.vertices[(a + 1) % i], c = Vector3$1.subtract(s, o), l = Vector3$1.subtract(t, o), u = Vector3$1.cross(c, l);
			if (Vector3$1.dot(u, r) < -n) return !1;
		}
		return !0;
	},
	rayIntersection(e, t, n, r = 1e-4) {
		let i = Plane3D.rayIntersection(e, t, n.plane);
		if (i === null || i < 0) return null;
		let a = Vector3$1.add(e, Vector3$1.scale(t, i));
		return Polygon3D.containsPoint(n, a, r) ? {
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
		return e.vertices.length < 3 || Polygon3D.area(e) < t;
	},
	flip(e) {
		return {
			vertices: [...e.vertices].reverse(),
			plane: Plane3D.flip(e.plane),
			materialId: e.materialId
		};
	},
	clone(e) {
		return {
			vertices: e.vertices.map((e) => Vector3$1.clone(e)),
			plane: { ...e.plane },
			materialId: e.materialId
		};
	},
	toString(e) {
		let t = e.vertices.map((e) => Vector3$1.toString(e, 2)).join(", ");
		return `Polygon3D(${e.vertices.length} vertices: [${t}])`;
	}
};
//#endregion
//#region node_modules/beam-trace/dist/geometry/polygon-split.js
function splitPolygon(e, t, n = 1e-4) {
	let r = Polygon3D.classify(e, t, n);
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
		let s = e.vertices[r], c = e.vertices[(r + 1) % o], l = Plane3D.signedDistance(s, t), u = Plane3D.signedDistance(c, t), d = l > n ? "front" : l < -n ? "back" : "on", f = u > n ? "front" : u < -n ? "back" : "on";
		if (d === "front" ? i.push(s) : (d === "back" || i.push(s), a.push(s)), d === "front" && f === "back" || d === "back" && f === "front") {
			let e = l / (l - u), t = Vector3$1.lerp(s, c, e);
			i.push(t), a.push(t);
		}
	}
	return {
		front: i.length >= 3 ? Polygon3D.createWithPlane(i, e.plane, e.materialId) : null,
		back: a.length >= 3 ? Polygon3D.createWithPlane(a, e.plane, e.materialId) : null
	};
}
//#endregion
//#region node_modules/beam-trace/dist/geometry/clipping3d.js
function clipPolygonByPlane(e, t, n = 1e-4) {
	let r = e.vertices, i = [];
	if (r.length < 3) return null;
	for (let e = 0; e < r.length; e++) {
		let a = r[e], o = r[(e + 1) % r.length], s = Plane3D.signedDistance(a, t), c = Plane3D.signedDistance(o, t), l = s >= -n, u = c >= -n;
		if (l && i.push(a), l && !u || !l && u) {
			let e = s / (s - c), t = Vector3$1.lerp(a, o, Math.max(0, Math.min(1, e)));
			i.push(t);
		}
	}
	return i.length < 3 ? null : Polygon3D.createWithPlane(i, e.plane, e.materialId);
}
function clipPolygonByPlanes(e, t, n = 1e-4) {
	let r = e;
	for (let e of t) {
		if (!r) return null;
		r = clipPolygonByPlane(r, e, n);
	}
	return r;
}
function quickRejectPolygon(e, t, n = 1e-4) {
	for (let r of t) {
		let t = !0;
		for (let i of e.vertices) if (Plane3D.signedDistance(i, r) >= -n) {
			t = !1;
			break;
		}
		if (t) return !0;
	}
	return !1;
}
//#endregion
//#region node_modules/beam-trace/dist/structures/bsp3d.js
function buildBSP(e) {
	return e.length === 0 ? null : buildBSPRecursive(e.map((e, t) => ({
		polygon: e,
		originalId: t
	})));
}
function buildBSPRecursive(e) {
	if (e.length === 0) return null;
	let t = chooseSplitter(e), n = e[t], r = n.polygon.plane, i = [], a = [];
	for (let n = 0; n < e.length; n++) {
		if (n === t) continue;
		let o = e[n], { front: s, back: c } = splitPolygon(o.polygon, r);
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
		front: buildBSPRecursive(i),
		back: buildBSPRecursive(a)
	};
}
function chooseSplitter(e) {
	if (e.length <= 3) return 0;
	let t = 0, n = Infinity, r = Math.min(e.length, 10), i = Math.max(1, Math.floor(e.length / r));
	for (let r = 0; r < e.length; r += i) {
		let i = e[r].polygon.plane, a = 0, o = 0, s = 0;
		for (let t = 0; t < e.length; t++) {
			if (r === t) continue;
			let n = Polygon3D.classify(e[t].polygon, i);
			n === "front" ? a++ : n === "back" ? o++ : n === "spanning" && (a++, o++, s++);
		}
		let c = s * 8 + Math.abs(a - o);
		c < n && (n = c, t = r);
	}
	return t;
}
function rayTraceBSP(e, t, n, r = 0, i = Infinity, a = -1) {
	if (!n) return null;
	let o = Plane3D.signedDistance(e, n.plane), s = Plane3D.normal(n.plane), c = Vector3$1.dot(s, t), l, u;
	o >= 0 ? (l = n.front, u = n.back) : (l = n.back, u = n.front);
	let d = null;
	Math.abs(c) > 1e-10 && (d = -o / c);
	let f = null;
	if (d === null || d < r) {
		if (f = rayTraceBSP(e, t, l, r, i, a), !f && n.polygonId !== a) {
			let a = Polygon3D.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f ||= rayTraceBSP(e, t, u, r, i, a);
	} else if (d > i) {
		if (f = rayTraceBSP(e, t, l, r, i, a), !f && n.polygonId !== a) {
			let a = Polygon3D.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f ||= rayTraceBSP(e, t, u, r, i, a);
	} else {
		if (f = rayTraceBSP(e, t, l, r, d, a), !f && n.polygonId !== a) {
			let a = Polygon3D.rayIntersection(e, t, n.polygon);
			a && a.t >= r && a.t <= i && (f = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		}
		f ||= rayTraceBSP(e, t, u, d, i, a);
	}
	return f;
}
var bspDebug = !1, bspDebugDepth = 0;
function rayTraceBSPMultiIgnore(e, t, n, r, i, a) {
	if (!n) return null;
	let o = "  ".repeat(bspDebugDepth), s = Plane3D.signedDistance(e, n.plane), c = Plane3D.normal(n.plane), l = Vector3$1.dot(c, t), u, d;
	s >= 0 ? (u = n.front, d = n.back) : (u = n.back, d = n.front);
	let f = null;
	Math.abs(l) > 1e-10 && (f = -s / l), bspDebug && console.log(`${o}[BSP] Node ${n.polygonId}: dOrigin=${s.toFixed(3)}, dDir=${l.toFixed(3)}, tSplit=${f?.toFixed(3) ?? "null"}, tMin=${r.toFixed(3)}, tMax=${i.toFixed(3)}`);
	let p = null;
	if (f === null || f < r) {
		if (bspDebug && console.log(`${o}  Case: tSplit null or < tMin, checking near then far`), bspDebugDepth++, p = rayTraceBSPMultiIgnore(e, t, u, r, i, a), bspDebugDepth--, !p && !a.has(n.polygonId)) {
			let a = Polygon3D.rayIntersection(e, t, n.polygon);
			bspDebug && (console.log(`${o}  Checking node polygon ${n.polygonId}: ${a ? `HIT t=${a.t.toFixed(3)}` : "NO HIT"}`), a && console.log(`${o}    In range [${r.toFixed(3)}, ${i.toFixed(3)}]? ${a.t >= r && a.t <= i}`)), a && a.t >= r && a.t <= i && (p = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		} else bspDebug && a.has(n.polygonId) && console.log(`${o}  Skipping node polygon ${n.polygonId} (in ignoreIds)`);
		p || (bspDebugDepth++, p = rayTraceBSPMultiIgnore(e, t, d, r, i, a), bspDebugDepth--);
	} else if (f > i) {
		if (bspDebug && console.log(`${o}  Case: tSplit > tMax, checking near then far`), bspDebugDepth++, p = rayTraceBSPMultiIgnore(e, t, u, r, i, a), bspDebugDepth--, !p && !a.has(n.polygonId)) {
			let a = Polygon3D.rayIntersection(e, t, n.polygon);
			bspDebug && (console.log(`${o}  Checking node polygon ${n.polygonId}: ${a ? `HIT t=${a.t.toFixed(3)}` : "NO HIT"}`), a && console.log(`${o}    In range [${r.toFixed(3)}, ${i.toFixed(3)}]? ${a.t >= r && a.t <= i}`)), a && a.t >= r && a.t <= i && (p = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		} else bspDebug && a.has(n.polygonId) && console.log(`${o}  Skipping node polygon ${n.polygonId} (in ignoreIds)`);
		p || (bspDebugDepth++, p = rayTraceBSPMultiIgnore(e, t, d, r, i, a), bspDebugDepth--);
	} else {
		if (bspDebug && console.log(`${o}  Case: ray crosses plane at tSplit=${f.toFixed(3)}`), bspDebugDepth++, p = rayTraceBSPMultiIgnore(e, t, u, r, f, a), bspDebugDepth--, !p && !a.has(n.polygonId)) {
			let a = Polygon3D.rayIntersection(e, t, n.polygon);
			bspDebug && (console.log(`${o}  Checking node polygon ${n.polygonId}: ${a ? `HIT t=${a.t.toFixed(3)}` : "NO HIT"}`), a && console.log(`${o}    In range [${r.toFixed(3)}, ${i.toFixed(3)}]? ${a.t >= r && a.t <= i}`)), a && a.t >= r && a.t <= i && (p = {
				t: a.t,
				point: a.point,
				polygonId: n.polygonId,
				polygon: n.polygon
			});
		} else bspDebug && a.has(n.polygonId) && console.log(`${o}  Skipping node polygon ${n.polygonId} (in ignoreIds)`);
		p || (bspDebugDepth++, p = rayTraceBSPMultiIgnore(e, t, d, f, i, a), bspDebugDepth--);
	}
	return bspDebug && p && console.log(`${o}  RETURNING HIT: polygon ${p.polygonId} at t=${p.t.toFixed(3)}`), p;
}
//#endregion
//#region node_modules/beam-trace/dist/structures/beam3d.js
function constructBeamBoundaryPlanes(e, t) {
	let n = [], r = Polygon3D.edges(t), i = Polygon3D.centroid(t);
	for (let [t, a] of r) {
		let r = Plane3D.fromPoints(e, t, a);
		Plane3D.signedDistance(i, r) < 0 && (r = Plane3D.flip(r)), n.push(r);
	}
	let a = t.plane;
	return Plane3D.signedDistance(e, a) > 0 && (a = Plane3D.flip(a)), n.push(a), n;
}
function mirrorPointAcrossPolygon(e, t) {
	return Plane3D.mirrorPoint(e, t.plane);
}
function isPolygonFacingSource(e, t) {
	let n = Polygon3D.centroid(e), r = Vector3$1.subtract(t, n), i = Plane3D.normal(e.plane);
	return Vector3$1.dot(i, r) > 0;
}
//#endregion
//#region node_modules/beam-trace/dist/structures/beamtree3d.js
var MIN_APERTURE_AREA = 1e-6;
function buildBeamTree3D(e, t, n) {
	let r = {
		id: -1,
		parent: null,
		virtualSource: Vector3$1.clone(e),
		children: []
	};
	if (n >= 1) for (let i = 0; i < t.length; i++) {
		let a = t[i];
		if (!isPolygonFacingSource(a, e)) continue;
		let o = mirrorPointAcrossPolygon(e, a), s = constructBeamBoundaryPlanes(o, a), c = {
			id: i,
			parent: r,
			virtualSource: o,
			aperture: Polygon3D.clone(a),
			boundaryPlanes: s,
			children: []
		};
		r.children.push(c), n > 1 && buildBeamChildren(c, t, 2, n);
	}
	let i = [];
	return collectLeafNodes(r, i), {
		root: r,
		leafNodes: i,
		polygons: t,
		maxReflectionOrder: n
	};
}
function buildBeamChildren(e, t, n, r) {
	if (!(n > r) && !(!e.boundaryPlanes || !e.aperture)) for (let i = 0; i < t.length; i++) {
		if (i === e.id) continue;
		let a = t[i];
		if (quickRejectPolygon(a, e.boundaryPlanes) || !isPolygonFacingSource(a, e.virtualSource)) continue;
		let o = clipPolygonByPlanes(a, e.boundaryPlanes);
		if (!o || Polygon3D.area(o) < MIN_APERTURE_AREA) continue;
		let s = mirrorPointAcrossPolygon(e.virtualSource, a), c = constructBeamBoundaryPlanes(s, o), l = {
			id: i,
			parent: e,
			virtualSource: s,
			aperture: o,
			boundaryPlanes: c,
			children: []
		};
		e.children.push(l), n < r && buildBeamChildren(l, t, n + 1, r);
	}
}
function collectLeafNodes(e, t) {
	e.children.length === 0 && e.id !== -1 && t.push(e);
	for (let n of e.children) collectLeafNodes(n, t);
}
function clearFailPlanes(e) {
	clearFailPlanesRecursive(e.root);
}
function clearFailPlanesRecursive(e) {
	e.failPlane = void 0, e.failPlaneType = void 0;
	for (let t of e.children) clearFailPlanesRecursive(t);
}
//#endregion
//#region node_modules/beam-trace/dist/optimization/failplane3d.js
function detectFailPlane(e, t, n) {
	if (!t.aperture || !t.boundaryPlanes) return null;
	let r = n[t.id].plane;
	if (Plane3D.signedDistance(t.virtualSource, r) < 0 && (r = Plane3D.flip(r)), Plane3D.signedDistance(e, r) < 0) return {
		plane: r,
		type: "polygon",
		nodeDepth: getNodeDepth(t)
	};
	let i = t.boundaryPlanes.length - 1;
	for (let n = 0; n < t.boundaryPlanes.length; n++) {
		let r = t.boundaryPlanes[n];
		if (Plane3D.signedDistance(e, r) < 0) return {
			plane: r,
			type: n < i ? "edge" : "aperture",
			nodeDepth: getNodeDepth(t)
		};
	}
	return null;
}
function getNodeDepth(e) {
	let t = 0, n = e;
	for (; n && n.id !== -1;) t++, n = n.parent;
	return t;
}
function isListenerBehindFailPlane(e, t) {
	return Plane3D.signedDistance(e, t) < 0;
}
//#endregion
//#region node_modules/beam-trace/dist/optimization/skipsphere3d.js
var DEFAULT_BUCKET_SIZE_3D = 16;
function createBuckets3D(e, t = 16) {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push({
		id: n.length,
		nodes: e.slice(r, Math.min(r + t, e.length)),
		skipSphere: null
	});
	return n;
}
function isInsideSkipSphere(e, t) {
	return Vector3$1.distance(e, t.center) < t.radius;
}
function checkSkipSphere(e, t) {
	return t.skipSphere ? isInsideSkipSphere(e, t.skipSphere) ? "inside" : "outside" : "none";
}
function createSkipSphere(e, t) {
	let n = Infinity;
	for (let r of t) {
		if (!r.failPlane) return null;
		let t = Math.abs(Plane3D.signedDistance(e, r.failPlane));
		n = Math.min(n, t);
	}
	return n === Infinity || n <= 1e-10 ? null : {
		center: Vector3$1.clone(e),
		radius: n
	};
}
function invalidateSkipSphere(e) {
	e.skipSphere = null;
}
function clearBucketFailPlanes(e) {
	for (let t of e.nodes) t.failPlane = void 0, t.failPlaneType = void 0;
}
//#endregion
//#region node_modules/beam-trace/dist/solver/solver3d.js
var OptimizedSolver3D = class {
	constructor(e, t, n = {}) {
		let r = n.maxReflectionOrder ?? 5, i = n.bucketSize ?? 16;
		this.polygons = e, this.sourcePosition = Vector3$1.clone(t), this.epsilon = n.epsilon ?? 1e-4, this.bspRoot = buildBSP(e), this.beamTree = buildBeamTree3D(t, e, r), this.buckets = createBuckets3D(this.beamTree.leafNodes, i), this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = this.beamTree.leafNodes.length, this.metrics.bucketsTotal = this.buckets.length;
	}
	getPaths(e) {
		this.resetMetrics();
		let t = [], n = this.validateDirectPath(e);
		n && t.push(n);
		let r = this.findIntermediatePaths(e, this.beamTree.root);
		t.push(...r);
		for (let n of this.buckets) {
			let r = checkSkipSphere(e, n);
			if (r === "inside") {
				this.metrics.bucketsSkipped++;
				continue;
			}
			r === "outside" && (invalidateSkipSphere(n), clearBucketFailPlanes(n)), this.metrics.bucketsChecked++;
			let i = !0, a = !0;
			for (let r of n.nodes) {
				if (r.failPlane && isListenerBehindFailPlane(e, r.failPlane)) {
					this.metrics.failPlaneCacheHits++;
					continue;
				}
				r.failPlane && (r.failPlane = void 0, r.failPlaneType = void 0, this.metrics.failPlaneCacheMisses++);
				let n = this.validatePath(e, r);
				n.valid && n.path ? (t.push(n.path), i = !1, a = !1) : r.failPlane || (a = !1);
			}
			i && a && n.nodes.length > 0 && (n.skipSphere = createSkipSphere(e, n.nodes), n.skipSphere && this.metrics.skipSphereCount++);
		}
		return this.metrics.validPathCount = t.length, t;
	}
	getDetailedPaths(e) {
		return this.getPaths(e).map((e) => convertToDetailedPath3D(e, this.polygons));
	}
	validateDirectPath(e) {
		let t = Vector3$1.subtract(this.sourcePosition, e), n = Vector3$1.length(t), r = Vector3$1.normalize(t);
		this.metrics.raycastCount++;
		let i = rayTraceBSP(e, r, this.bspRoot, 0, n, -1);
		return i && i.t < n - this.epsilon ? null : [{
			position: Vector3$1.clone(e),
			polygonId: null
		}, {
			position: Vector3$1.clone(this.sourcePosition),
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
			position: Vector3$1.clone(e),
			polygonId: null
		}], i = [], a = t;
		for (; a && a.id !== -1;) i.unshift(a.id), a = a.parent;
		n && (console.log(`[traverseBeam] Exploring beam with polygonPath: [${i.join(", ")}]`), console.log(`  Listener: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`  Virtual source: [${t.virtualSource[0].toFixed(3)}, ${t.virtualSource[1].toFixed(3)}, ${t.virtualSource[2].toFixed(3)}]`));
		let o = e, s = t, c = /* @__PURE__ */ new Set(), l = 0;
		for (; s && s.id !== -1;) {
			let e = this.polygons[s.id], t = s.virtualSource, i = Vector3$1.normalize(Vector3$1.subtract(t, o)), a = Polygon3D.rayIntersection(o, i, e);
			if (!a) return n && console.log(`  [Segment ${l}] FAIL: No intersection with polygon ${s.id}`), null;
			n && (console.log(`  [Segment ${l}] Ray from [${o[0].toFixed(3)}, ${o[1].toFixed(3)}, ${o[2].toFixed(3)}]`), console.log(`    Direction: [${i[0].toFixed(3)}, ${i[1].toFixed(3)}, ${i[2].toFixed(3)}]`), console.log(`    Hit polygon ${s.id} at t=${a.t.toFixed(3)}, point=[${a.point[0].toFixed(3)}, ${a.point[1].toFixed(3)}, ${a.point[2].toFixed(3)}]`)), c.add(s.id), this.metrics.raycastCount++;
			let u = rayTraceBSPMultiIgnore(o, i, this.bspRoot, this.epsilon, a.t - this.epsilon, c);
			if (u) return n && (console.log(`    OCCLUDED by polygon ${u.polygonId} at t=${u.t.toFixed(3)}, point=[${u.point[0].toFixed(3)}, ${u.point[1].toFixed(3)}, ${u.point[2].toFixed(3)}]`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`)), null;
			n && console.log(`    OK - no occlusion (ignoreIds: [${Array.from(c).join(", ")}])`), r.push({
				position: Vector3$1.clone(a.point),
				polygonId: s.id
			}), o = a.point, s = s.parent, l++;
		}
		if (s) {
			let e = Vector3$1.normalize(Vector3$1.subtract(s.virtualSource, o)), t = Vector3$1.distance(s.virtualSource, o);
			if (n) {
				console.log(`  [Final segment] Ray from [${o[0].toFixed(3)}, ${o[1].toFixed(3)}, ${o[2].toFixed(3)}]`), console.log(`    To source: [${s.virtualSource[0].toFixed(3)}, ${s.virtualSource[1].toFixed(3)}, ${s.virtualSource[2].toFixed(3)}]`), console.log(`    Direction: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`    Distance: ${t.toFixed(3)}`), console.log(`    tMin: ${this.epsilon}, tMax: ${(t - this.epsilon).toFixed(6)}`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`);
				let n = o, r = s.virtualSource;
				if (n[1] < 5.575 && r[1] > 5.575 || n[1] > 5.575 && r[1] < 5.575) {
					let t = (5.575 - n[1]) / (r[1] - n[1]), i = n[0] + t * (r[0] - n[0]), a = n[2] + t * (r[2] - n[2]);
					if (console.log(`    CROSSING y=5.575 at t=${t.toFixed(3)}, x=${i.toFixed(3)}, z=${a.toFixed(3)}`), console.log("    back1 spans: x=[6.215, 12.43], z=[0, 4.877]"), i >= 6.215 && i <= 12.43 && a >= 0 && a <= 4.877) {
						console.log("    *** SHOULD HIT back1 (polygons 3, 4) ***"), console.log("    Direct polygon intersection test:");
						for (let t of [3, 4]) {
							let n = this.polygons[t], r = Polygon3D.rayIntersection(o, e, n);
							r ? console.log(`      Polygon ${t}: HIT at t=${r.t.toFixed(3)}, point=[${r.point[0].toFixed(3)}, ${r.point[1].toFixed(3)}, ${r.point[2].toFixed(3)}]`) : (console.log(`      Polygon ${t}: NO HIT`), console.log(`        Vertices: ${n.vertices.map((e) => `[${e[0].toFixed(2)}, ${e[1].toFixed(2)}, ${e[2].toFixed(2)}]`).join(", ")}`));
						}
					}
				}
			}
			this.metrics.raycastCount++;
			let i = this.epsilon, a = t - this.epsilon, l = rayTraceBSPMultiIgnore(o, e, this.bspRoot, i, a, c);
			if (l) return n && console.log(`    OCCLUDED by polygon ${l.polygonId} at t=${l.t.toFixed(3)}, point=[${l.point[0].toFixed(3)}, ${l.point[1].toFixed(3)}, ${l.point[2].toFixed(3)}]`), null;
			n && console.log("    OK - path valid!"), r.push({
				position: Vector3$1.clone(s.virtualSource),
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
		let r = detectFailPlane(e, t, this.polygons);
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
		clearFailPlanes(this.beamTree);
		for (let e of this.buckets) invalidateSkipSphere(e);
	}
	getLeafNodeCount() {
		return this.beamTree.leafNodes.length;
	}
	getMaxReflectionOrder() {
		return this.beamTree.maxReflectionOrder;
	}
	getSourcePosition() {
		return Vector3$1.clone(this.sourcePosition);
	}
	getBeamsForVisualization(e) {
		let t = [], n = e ?? this.beamTree.maxReflectionOrder, r = (e, i, a) => {
			if (i > n) return;
			let o = e.id === -1 ? a : [...a, e.id];
			e.id !== -1 && e.aperture && t.push({
				virtualSource: Vector3$1.clone(e.virtualSource),
				apertureVertices: e.aperture.vertices.map((e) => Vector3$1.clone(e)),
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
function computePathLength(e) {
	let t = 0;
	for (let n = 1; n < e.length; n++) t += Vector3$1.distance(e[n - 1].position, e[n].position);
	return t;
}
function computeArrivalTime(e, t = 343) {
	return computePathLength(e) / t;
}
function getPathReflectionOrder(e) {
	return e.filter((e) => e.polygonId !== null).length;
}
var GRAZING_THRESHOLD_3D = .05;
function calculateIncidenceAngle3D(e, t) {
	let n = Math.abs(Vector3$1.dot(Vector3$1.negate(e), t));
	return Math.acos(Math.max(-1, Math.min(1, n)));
}
function getOrientedNormal3D(e, t) {
	let n = Plane3D.normal(e.plane);
	return Vector3$1.dot(t, n) > 0 ? Vector3$1.negate(n) : Vector3$1.clone(n);
}
function convertToDetailedPath3D(e, t) {
	if (e.length < 2) throw Error("Path must have at least 2 points (listener and source)");
	let n = Vector3$1.clone(e[0].position), r = Vector3$1.clone(e[e.length - 1].position), i = [], a = [], o = 0;
	for (let n = 0; n < e.length - 1; n++) {
		let r = e[n].position, s = e[n + 1].position, c = Vector3$1.distance(r, s);
		a.push({
			startPoint: Vector3$1.clone(r),
			endPoint: Vector3$1.clone(s),
			length: c,
			segmentIndex: n
		});
		let l = e[n + 1].polygonId;
		if (l !== null) {
			let a = t[l], s = e[n + 1].position, u = Vector3$1.normalize(Vector3$1.subtract(s, r)), d = e[n + 2]?.position, f;
			f = d ? Vector3$1.normalize(Vector3$1.subtract(d, s)) : Vector3$1.reflect(u, Plane3D.normal(a.plane));
			let p = getOrientedNormal3D(a, u), m = calculateIncidenceAngle3D(u, p), h = m;
			o += c;
			let g = Math.abs(m - Math.PI / 2) < GRAZING_THRESHOLD_3D;
			i.push({
				polygon: a,
				polygonId: l,
				hitPoint: Vector3$1.clone(s),
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
var Source3D = class {
	constructor(e) {
		this.position = Vector3$1.clone(e);
	}
}, Solver3D = class {
	constructor(e, t, n) {
		this.source = t, this.solver = new OptimizedSolver3D(e, t.position, n);
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
}, beamTraceDefaults = {
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
}, HISTOGRAM_BIN_WIDTH = .001, HISTOGRAM_NUM_BINS = 1e4;
//#endregion
//#region src/common/moving-average.ts
function movingAverage(e, t = 1) {
	let n = e.slice();
	for (let r = 0; r < e.length; r++) if (r >= t && r < e.length - t) {
		let i = r - t, a = r + t, o = 0;
		for (let t = i; t < a; t++) o += e[t];
		n[r] = o / (2 * t);
	}
	return n;
}
//#endregion
//#region node_modules/simple-statistics/dist/simple-statistics.mjs
function linearRegression$1(e) {
	var t, n, r = e.length;
	if (r === 1) t = 0, n = e[0][1];
	else {
		for (var i = 0, a = 0, o = 0, s = 0, c, l, u, d = 0; d < r; d++) c = e[d], l = c[0], u = c[1], i += l, a += u, o += l * l, s += l * u;
		t = (r * s - i * a) / (r * o - i * i), n = a / r - t * i / r;
	}
	return {
		m: t,
		b: n
	};
}
var BayesianClassifier = function() {
	this.totalCount = 0, this.data = {};
};
BayesianClassifier.prototype.train = function(e, t) {
	for (var n in this.data[t] || (this.data[t] = {}), e) {
		var r = e[n];
		this.data[t][n] === void 0 && (this.data[t][n] = {}), this.data[t][n][r] === void 0 && (this.data[t][n][r] = 0), this.data[t][n][r]++;
	}
	this.totalCount++;
}, BayesianClassifier.prototype.score = function(e) {
	var t = {}, n;
	for (var r in e) {
		var i = e[r];
		for (n in this.data) t[n] = {}, this.data[n][r] ? t[n][r + "_" + i] = (this.data[n][r][i] || 0) / this.totalCount : t[n][r + "_" + i] = 0;
	}
	var a = {};
	for (n in t) for (var o in a[n] = 0, t[n]) a[n] += t[n][o];
	return a;
};
var SQRT_2PI$1 = Math.sqrt(2 * Math.PI);
function cumulativeDistribution(e) {
	for (var t = e, n = e, r = 1; r < 15; r++) n *= e * e / (2 * r + 1), t += n;
	return Math.round((.5 + t / SQRT_2PI$1 * Math.exp(-e * e / 2)) * 1e4) / 1e4;
}
for (var standardNormalTable = [], z = 0; z <= 3.09; z += .01) standardNormalTable.push(cumulativeDistribution(z));
var LOGSQRT2PI = Math.log(Math.sqrt(2 * Math.PI)), SQRT_2PI = Math.sqrt(2 * Math.PI), PerceptronModel = function() {
	this.weights = [], this.bias = 0;
};
PerceptronModel.prototype.predict = function(e) {
	if (e.length !== this.weights.length) return null;
	for (var t = 0, n = 0; n < this.weights.length; n++) t += this.weights[n] * e[n];
	return t += this.bias, +(t > 0);
}, PerceptronModel.prototype.train = function(e, t) {
	if (t !== 0 && t !== 1) return null;
	e.length !== this.weights.length && (this.weights = e, this.bias = 1);
	var n = this.predict(e);
	if (typeof n == "number" && n !== t) {
		for (var r = t - n, i = 0; i < this.weights.length; i++) this.weights[i] += r * e[i];
		this.bias += r;
	}
	return this;
};
//#endregion
//#region src/common/linear-regression.ts
function linearRegression(e, t) {
	let n = e.length, r = [];
	for (let i = 0; i < n; i++) r.push([e[i], t[i]]);
	let { m: i, b: a } = linearRegression$1(r);
	return {
		m: i,
		b: a,
		fx: (e) => i * e + a,
		fy: (e) => (e - a) / i
	};
}
//#endregion
//#region src/compute/shared/response-by-intensity.ts
var { floor: floor$1 } = Math;
function resampleResponseByIntensity(e, t = 256) {
	if (e) {
		for (let n in e) for (let r in e[n]) {
			let { response: i, freqs: a } = e[n][r], o = i[i.length - 1].time, s = floor$1(t * o);
			e[n][r].resampledResponse = Array(a.length).fill(0).map((e) => new Float32Array(s)), e[n][r].sampleRate = t;
			let c = 0, l = [], u = a.map((e) => 0), d = !1;
			for (let t = 0, f = 0; t < s; t++) {
				let p = t / s * o;
				if (i[f] && i[f].time) {
					let t = i[f].time;
					if (t > p) {
						for (let t = 0; t < a.length; t++) e[n][r].resampledResponse[t][c] = 0;
						d && l.push(c), c++;
						continue;
					}
					if (t <= p) {
						let o = i[f].level.map((e) => 0);
						for (; t <= p;) {
							t = i[f].time;
							for (let e = 0; e < a.length; e++) o[e] = db_add([o[e], i[f].level[e]]);
							f++;
						}
						for (let t = 0; t < a.length; t++) {
							if (e[n][r].resampledResponse[t][c] = o[t], l.length > 0) {
								let i = u[t], a = o[t];
								for (let o = 0; o < l.length; o++) {
									let s = lerp(i, a, (o + 1) / (l.length + 1));
									e[n][r].resampledResponse[t][l[o]] = s;
								}
							}
							u[t] = o[t];
						}
						l.length > 0 && (l = []), d = !0, c++;
						continue;
					}
				}
			}
			calculateT20(e, n, r), calculateT30(e, n, r), calculateT60(e, n, r);
		}
		return e;
	}
	console.warn("no data yet");
}
function calculateT30(e, t, n) {
	let r = t, i = n, a = e[r][i].resampledResponse, o = e[r][i].sampleRate;
	if (a && o) {
		let t = new Float32Array(a[0].length);
		for (let e = 0; e < a[0].length; e++) t[e] = e / o;
		e[r][i].t30 = a.map((e) => {
			let n = 0, r = e[n];
			for (; r === 0;) r = e[n++];
			for (let t = n; t >= 0; t--) e[t] = r;
			let i = r - 30, a = movingAverage(e, 2).filter((e) => e >= i).length;
			return linearRegression(t.slice(0, a), e.slice(0, a));
		});
	}
}
function calculateT20(e, t, n) {
	let r = t, i = n, a = e[r][i].resampledResponse, o = e[r][i].sampleRate;
	if (a && o) {
		let t = new Float32Array(a[0].length);
		for (let e = 0; e < a[0].length; e++) t[e] = e / o;
		e[r][i].t20 = a.map((e) => {
			let n = 0, r = e[n];
			for (; r === 0;) r = e[n++];
			for (let t = n; t >= 0; t--) e[t] = r;
			let i = r - 20, a = movingAverage(e, 2).filter((e) => e >= i).length;
			return linearRegression(t.slice(0, a), e.slice(0, a));
		});
	}
}
function calculateT60(e, t, n) {
	let r = t, i = n, a = e[r][i].resampledResponse, o = e[r][i].sampleRate;
	if (a && o) {
		let t = new Float32Array(a[0].length);
		for (let e = 0; e < a[0].length; e++) t[e] = e / o;
		e[r][i].t60 = a.map((e) => {
			let n = 0, r = e[n];
			for (; r === 0;) r = e[n++];
			for (let t = n; t >= 0; t--) e[t] = r;
			let i = r - 60, a = movingAverage(e, 2).filter((e) => e >= i).length;
			return linearRegression(t.slice(0, a), e.slice(0, a));
		});
	}
}
//#endregion
//#region node_modules/ambisonics/dist/ambisonics.es.js
var import_FileSaver_min = /* @__PURE__ */ __toESM(require_FileSaver_min());
function getAmbisonicChannelCount(e) {
	return (e + 1) * (e + 1);
}
function getAmbisonicChannelCount2D(e) {
	return 2 * e + 1;
}
function degreesToRadians(e) {
	return e * Math.PI / 180;
}
function radiansToDegrees(e) {
	return e * 180 / Math.PI;
}
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function getDefaultExportFromCjs(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var numeric1_2_6 = {};
(function(exports$1) {
	var numeric = exports$1;
	commonjsGlobal !== void 0 && (commonjsGlobal.numeric = numeric), numeric.version = "1.2.6", numeric.bench = function(e, t) {
		var n, r, i, a;
		for (t === void 0 && (t = 15), i = .5, n = /* @__PURE__ */ new Date();;) {
			for (i *= 2, a = i; a > 3; a -= 4) e(), e(), e(), e();
			for (; a > 0;) e(), a--;
			if (r = /* @__PURE__ */ new Date(), r - n > t) break;
		}
		for (a = i; a > 3; a -= 4) e(), e(), e(), e();
		for (; a > 0;) e(), a--;
		return r = /* @__PURE__ */ new Date(), 1e3 * (3 * i - 1) / (r - n);
	}, numeric._myIndexOf = function(e) {
		var t = this.length, n;
		for (n = 0; n < t; ++n) if (this[n] === e) return n;
		return -1;
	}, numeric.myIndexOf = Array.prototype.indexOf ? Array.prototype.indexOf : numeric._myIndexOf, numeric.Function = Function, numeric.precision = 4, numeric.largeArray = 50, numeric.prettyPrint = function(e) {
		function t(e) {
			if (e === 0) return "0";
			if (isNaN(e)) return "NaN";
			if (e < 0) return "-" + t(-e);
			if (isFinite(e)) {
				var n = Math.floor(Math.log(e) / Math.log(10)), r = e / 10 ** n, i = r.toPrecision(numeric.precision);
				return parseFloat(i) === 10 && (n++, r = 1, i = r.toPrecision(numeric.precision)), parseFloat(i).toString() + "e" + n.toString();
			}
			return "Infinity";
		}
		var n = [];
		function r(e) {
			var i;
			if (e === void 0) return n.push(Array(numeric.precision + 8).join(" ")), !1;
			if (typeof e == "string") return n.push("\"" + e + "\""), !1;
			if (typeof e == "boolean") return n.push(e.toString()), !1;
			if (typeof e == "number") {
				var a = t(e), o = e.toPrecision(numeric.precision), s = parseFloat(e.toString()).toString(), c = [
					a,
					o,
					s,
					parseFloat(o).toString(),
					parseFloat(s).toString()
				];
				for (i = 1; i < c.length; i++) c[i].length < a.length && (a = c[i]);
				return n.push(Array(numeric.precision + 8 - a.length).join(" ") + a), !1;
			}
			if (e === null) return n.push("null"), !1;
			if (typeof e == "function") {
				n.push(e.toString());
				var l = !1;
				for (i in e) e.hasOwnProperty(i) && (l ? n.push(",\n") : n.push("\n{"), l = !0, n.push(i), n.push(": \n"), r(e[i]));
				return l && n.push("}\n"), !0;
			}
			if (e instanceof Array) {
				if (e.length > numeric.largeArray) return n.push("...Large Array..."), !0;
				var l = !1;
				for (n.push("["), i = 0; i < e.length; i++) i > 0 && (n.push(","), l && n.push("\n ")), l = r(e[i]);
				return n.push("]"), !0;
			}
			n.push("{");
			var l = !1;
			for (i in e) e.hasOwnProperty(i) && (l && n.push(",\n"), l = !0, n.push(i), n.push(": \n"), r(e[i]));
			return n.push("}"), !0;
		}
		return r(e), n.join("");
	}, numeric.parseDate = function(e) {
		function t(e) {
			if (typeof e == "string") return Date.parse(e.replace(/-/g, "/"));
			if (!(e instanceof Array)) throw Error("parseDate: parameter must be arrays of strings");
			var n = [], r;
			for (r = 0; r < e.length; r++) n[r] = t(e[r]);
			return n;
		}
		return t(e);
	}, numeric.parseFloat = function(e) {
		function t(e) {
			if (typeof e == "string") return parseFloat(e);
			if (!(e instanceof Array)) throw Error("parseFloat: parameter must be arrays of strings");
			var n = [], r;
			for (r = 0; r < e.length; r++) n[r] = t(e[r]);
			return n;
		}
		return t(e);
	}, numeric.parseCSV = function(e) {
		var t = e.split("\n"), n, r, i = [], a = /(([^'",]*)|('[^']*')|("[^"]*")),/g, o = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/, s = function(e) {
			return e.substr(0, e.length - 1);
		}, c = 0;
		for (r = 0; r < t.length; r++) {
			var l = (t[r] + ",").match(a), u;
			if (l.length > 0) {
				for (i[c] = [], n = 0; n < l.length; n++) u = s(l[n]), o.test(u) ? i[c][n] = parseFloat(u) : i[c][n] = u;
				c++;
			}
		}
		return i;
	}, numeric.toCSV = function(e) {
		var t = numeric.dim(e), n, r, i = t[0], a, o;
		for (t[1], o = [], n = 0; n < i; n++) {
			for (a = [], r = 0; r < i; r++) a[r] = e[n][r].toString();
			o[n] = a.join(", ");
		}
		return o.join("\n") + "\n";
	}, numeric.getURL = function(e) {
		var t = new XMLHttpRequest();
		return t.open("GET", e, !1), t.send(), t;
	}, numeric.imageURL = function(e) {
		function t(e) {
			var t = e.length, n, r, i, a, o, s, c, l, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", d = "";
			for (n = 0; n < t; n += 3) r = e[n], i = e[n + 1], a = e[n + 2], o = r >> 2, s = ((r & 3) << 4) + (i >> 4), c = ((i & 15) << 2) + (a >> 6), l = a & 63, n + 1 >= t ? c = l = 64 : n + 2 >= t && (l = 64), d += u.charAt(o) + u.charAt(s) + u.charAt(c) + u.charAt(l);
			return d;
		}
		function n(e, t, n) {
			t === void 0 && (t = 0), n === void 0 && (n = e.length);
			var r = [
				0,
				1996959894,
				3993919788,
				2567524794,
				124634137,
				1886057615,
				3915621685,
				2657392035,
				249268274,
				2044508324,
				3772115230,
				2547177864,
				162941995,
				2125561021,
				3887607047,
				2428444049,
				498536548,
				1789927666,
				4089016648,
				2227061214,
				450548861,
				1843258603,
				4107580753,
				2211677639,
				325883990,
				1684777152,
				4251122042,
				2321926636,
				335633487,
				1661365465,
				4195302755,
				2366115317,
				997073096,
				1281953886,
				3579855332,
				2724688242,
				1006888145,
				1258607687,
				3524101629,
				2768942443,
				901097722,
				1119000684,
				3686517206,
				2898065728,
				853044451,
				1172266101,
				3705015759,
				2882616665,
				651767980,
				1373503546,
				3369554304,
				3218104598,
				565507253,
				1454621731,
				3485111705,
				3099436303,
				671266974,
				1594198024,
				3322730930,
				2970347812,
				795835527,
				1483230225,
				3244367275,
				3060149565,
				1994146192,
				31158534,
				2563907772,
				4023717930,
				1907459465,
				112637215,
				2680153253,
				3904427059,
				2013776290,
				251722036,
				2517215374,
				3775830040,
				2137656763,
				141376813,
				2439277719,
				3865271297,
				1802195444,
				476864866,
				2238001368,
				4066508878,
				1812370925,
				453092731,
				2181625025,
				4111451223,
				1706088902,
				314042704,
				2344532202,
				4240017532,
				1658658271,
				366619977,
				2362670323,
				4224994405,
				1303535960,
				984961486,
				2747007092,
				3569037538,
				1256170817,
				1037604311,
				2765210733,
				3554079995,
				1131014506,
				879679996,
				2909243462,
				3663771856,
				1141124467,
				855842277,
				2852801631,
				3708648649,
				1342533948,
				654459306,
				3188396048,
				3373015174,
				1466479909,
				544179635,
				3110523913,
				3462522015,
				1591671054,
				702138776,
				2966460450,
				3352799412,
				1504918807,
				783551873,
				3082640443,
				3233442989,
				3988292384,
				2596254646,
				62317068,
				1957810842,
				3939845945,
				2647816111,
				81470997,
				1943803523,
				3814918930,
				2489596804,
				225274430,
				2053790376,
				3826175755,
				2466906013,
				167816743,
				2097651377,
				4027552580,
				2265490386,
				503444072,
				1762050814,
				4150417245,
				2154129355,
				426522225,
				1852507879,
				4275313526,
				2312317920,
				282753626,
				1742555852,
				4189708143,
				2394877945,
				397917763,
				1622183637,
				3604390888,
				2714866558,
				953729732,
				1340076626,
				3518719985,
				2797360999,
				1068828381,
				1219638859,
				3624741850,
				2936675148,
				906185462,
				1090812512,
				3747672003,
				2825379669,
				829329135,
				1181335161,
				3412177804,
				3160834842,
				628085408,
				1382605366,
				3423369109,
				3138078467,
				570562233,
				1426400815,
				3317316542,
				2998733608,
				733239954,
				1555261956,
				3268935591,
				3050360625,
				752459403,
				1541320221,
				2607071920,
				3965973030,
				1969922972,
				40735498,
				2617837225,
				3943577151,
				1913087877,
				83908371,
				2512341634,
				3803740692,
				2075208622,
				213261112,
				2463272603,
				3855990285,
				2094854071,
				198958881,
				2262029012,
				4057260610,
				1759359992,
				534414190,
				2176718541,
				4139329115,
				1873836001,
				414664567,
				2282248934,
				4279200368,
				1711684554,
				285281116,
				2405801727,
				4167216745,
				1634467795,
				376229701,
				2685067896,
				3608007406,
				1308918612,
				956543938,
				2808555105,
				3495958263,
				1231636301,
				1047427035,
				2932959818,
				3654703836,
				1088359270,
				936918e3,
				2847714899,
				3736837829,
				1202900863,
				817233897,
				3183342108,
				3401237130,
				1404277552,
				615818150,
				3134207493,
				3453421203,
				1423857449,
				601450431,
				3009837614,
				3294710456,
				1567103746,
				711928724,
				3020668471,
				3272380065,
				1510334235,
				755167117
			], i = -1, a = 0;
			e.length;
			var o;
			for (o = t; o < n; o++) a = (i ^ e[o]) & 255, i = i >>> 8 ^ r[a];
			return i ^ -1;
		}
		var r = e[0].length, i = e[0][0].length, a, o, s, c, l, u, d, f, p, m, h = [
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10,
			0,
			0,
			0,
			13,
			73,
			72,
			68,
			82,
			i >> 24 & 255,
			i >> 16 & 255,
			i >> 8 & 255,
			i & 255,
			r >> 24 & 255,
			r >> 16 & 255,
			r >> 8 & 255,
			r & 255,
			8,
			2,
			0,
			0,
			0,
			-1,
			-2,
			-3,
			-4,
			-5,
			-6,
			-7,
			-8,
			73,
			68,
			65,
			84,
			8,
			29
		];
		for (m = n(h, 12, 29), h[29] = m >> 24 & 255, h[30] = m >> 16 & 255, h[31] = m >> 8 & 255, h[32] = m & 255, a = 1, o = 0, d = 0; d < r; d++) {
			for (d < r - 1 ? h.push(0) : h.push(1), l = 3 * i + 1 + (d === 0) & 255, u = 3 * i + 1 + (d === 0) >> 8 & 255, h.push(l), h.push(u), h.push(~l & 255), h.push(~u & 255), d === 0 && h.push(0), f = 0; f < i; f++) for (s = 0; s < 3; s++) l = e[s][d][f], l = l > 255 ? 255 : l < 0 ? 0 : Math.round(l), a = (a + l) % 65521, o = (o + a) % 65521, h.push(l);
			h.push(0);
		}
		return p = (o << 16) + a, h.push(p >> 24 & 255), h.push(p >> 16 & 255), h.push(p >> 8 & 255), h.push(p & 255), c = h.length - 41, h[33] = c >> 24 & 255, h[34] = c >> 16 & 255, h[35] = c >> 8 & 255, h[36] = c & 255, m = n(h, 37), h.push(m >> 24 & 255), h.push(m >> 16 & 255), h.push(m >> 8 & 255), h.push(m & 255), h.push(0), h.push(0), h.push(0), h.push(0), h.push(73), h.push(69), h.push(78), h.push(68), h.push(174), h.push(66), h.push(96), h.push(130), "data:image/png;base64," + t(h);
	}, numeric._dim = function(e) {
		for (var t = []; typeof e == "object";) t.push(e.length), e = e[0];
		return t;
	}, numeric.dim = function(e) {
		var t, n;
		return typeof e == "object" ? (t = e[0], typeof t == "object" ? (n = t[0], typeof n == "object" ? numeric._dim(e) : [e.length, t.length]) : [e.length]) : [];
	}, numeric.mapreduce = function(e, t) {
		return Function("x", "accum", "_s", "_k", "if(typeof accum === \"undefined\") accum = " + t + ";\nif(typeof x === \"number\") { var xi = x; " + e + "; return accum; }\nif(typeof _s === \"undefined\") _s = numeric.dim(x);\nif(typeof _k === \"undefined\") _k = 0;\nvar _n = _s[_k];\nvar i,xi;\nif(_k < _s.length-1) {\n    for(i=_n-1;i>=0;i--) {\n        accum = arguments.callee(x[i],accum,_s,_k+1);\n    }    return accum;\n}\nfor(i=_n-1;i>=1;i-=2) { \n    xi = x[i];\n    " + e + ";\n    xi = x[i-1];\n    " + e + ";\n}\nif(i === 0) {\n    xi = x[i];\n    " + e + "\n}\nreturn accum;");
	}, numeric.mapreduce2 = function(e, t) {
		return Function("x", "var n = x.length;\nvar i,xi;\n" + t + ";\nfor(i=n-1;i!==-1;--i) { \n    xi = x[i];\n    " + e + ";\n}\nreturn accum;");
	}, numeric.same = function e(t, n) {
		var r, i;
		if (!(t instanceof Array) || !(n instanceof Array) || (i = t.length, i !== n.length)) return !1;
		for (r = 0; r < i; r++) if (t[r] !== n[r]) if (typeof t[r] == "object") {
			if (!e(t[r], n[r])) return !1;
		} else return !1;
		return !0;
	}, numeric.rep = function(e, t, n) {
		n === void 0 && (n = 0);
		var r = e[n], i = Array(r), a;
		if (n === e.length - 1) {
			for (a = r - 2; a >= 0; a -= 2) i[a + 1] = t, i[a] = t;
			return a === -1 && (i[0] = t), i;
		}
		for (a = r - 1; a >= 0; a--) i[a] = numeric.rep(e, t, n + 1);
		return i;
	}, numeric.dotMMsmall = function(e, t) {
		var n, r, i, a = e.length, o = t.length, s = t[0].length, c = Array(a), l, u, d, f;
		for (n = a - 1; n >= 0; n--) {
			for (l = Array(s), u = e[n], i = s - 1; i >= 0; i--) {
				for (d = u[o - 1] * t[o - 1][i], r = o - 2; r >= 1; r -= 2) f = r - 1, d += u[r] * t[r][i] + u[f] * t[f][i];
				r === 0 && (d += u[0] * t[0][i]), l[i] = d;
			}
			c[n] = l;
		}
		return c;
	}, numeric._getCol = function(e, t, n) {
		var r = e.length, i;
		for (i = r - 1; i > 0; --i) n[i] = e[i][t], --i, n[i] = e[i][t];
		i === 0 && (n[0] = e[0][t]);
	}, numeric.dotMMbig = function(e, t) {
		var n = numeric._getCol, r = t.length, i = Array(r), a = e.length, o = t[0].length, s = Array(a), c, l = numeric.dotVV, u, d;
		for (--r, --a, u = a; u !== -1; --u) s[u] = Array(o);
		for (--o, u = o; u !== -1; --u) for (n(t, u, i), d = a; d !== -1; --d) c = e[d], s[d][u] = l(c, i);
		return s;
	}, numeric.dotMV = function(e, t) {
		var n = e.length;
		t.length;
		var r, i = Array(n), a = numeric.dotVV;
		for (r = n - 1; r >= 0; r--) i[r] = a(e[r], t);
		return i;
	}, numeric.dotVM = function(e, t) {
		var n, r, i = e.length, a = t[0].length, o = Array(a), s, c;
		for (r = a - 1; r >= 0; r--) {
			for (s = e[i - 1] * t[i - 1][r], n = i - 2; n >= 1; n -= 2) c = n - 1, s += e[n] * t[n][r] + e[c] * t[c][r];
			n === 0 && (s += e[0] * t[0][r]), o[r] = s;
		}
		return o;
	}, numeric.dotVV = function(e, t) {
		var n, r = e.length, i, a = e[r - 1] * t[r - 1];
		for (n = r - 2; n >= 1; n -= 2) i = n - 1, a += e[n] * t[n] + e[i] * t[i];
		return n === 0 && (a += e[0] * t[0]), a;
	}, numeric.dot = function(e, t) {
		var n = numeric.dim;
		switch (n(e).length * 1e3 + n(t).length) {
			case 2002: return t.length < 10 ? numeric.dotMMsmall(e, t) : numeric.dotMMbig(e, t);
			case 2001: return numeric.dotMV(e, t);
			case 1002: return numeric.dotVM(e, t);
			case 1001: return numeric.dotVV(e, t);
			case 1e3: return numeric.mulVS(e, t);
			case 1: return numeric.mulSV(e, t);
			case 0: return e * t;
			default: throw Error("numeric.dot only works on vectors and matrices");
		}
	}, numeric.diag = function(e) {
		var t, n, r, i = e.length, a = Array(i), o;
		for (t = i - 1; t >= 0; t--) {
			for (o = Array(i), n = t + 2, r = i - 1; r >= n; r -= 2) o[r] = 0, o[r - 1] = 0;
			for (r > t && (o[r] = 0), o[t] = e[t], r = t - 1; r >= 1; r -= 2) o[r] = 0, o[r - 1] = 0;
			r === 0 && (o[0] = 0), a[t] = o;
		}
		return a;
	}, numeric.getDiag = function(e) {
		var t = Math.min(e.length, e[0].length), n, r = Array(t);
		for (n = t - 1; n >= 1; --n) r[n] = e[n][n], --n, r[n] = e[n][n];
		return n === 0 && (r[0] = e[0][0]), r;
	}, numeric.identity = function(e) {
		return numeric.diag(numeric.rep([e], 1));
	}, numeric.pointwise = function(e, t, n) {
		n === void 0 && (n = "");
		var r = [], i, a = /\[i\]$/, o, s = "", c = !1;
		for (i = 0; i < e.length; i++) a.test(e[i]) ? (o = e[i].substring(0, e[i].length - 3), s = o) : o = e[i], o === "ret" && (c = !0), r.push(o);
		return r[e.length] = "_s", r[e.length + 1] = "_k", r[e.length + 2] = "if(typeof _s === \"undefined\") _s = numeric.dim(" + s + ");\nif(typeof _k === \"undefined\") _k = 0;\nvar _n = _s[_k];\nvar i" + (c ? "" : ", ret = Array(_n)") + ";\nif(_k < _s.length-1) {\n    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee(" + e.join(",") + ",_s,_k+1);\n    return ret;\n}\n" + n + "\nfor(i=_n-1;i!==-1;--i) {\n    " + t + "\n}\nreturn ret;", Function.apply(null, r);
	}, numeric.pointwise2 = function(e, t, n) {
		n === void 0 && (n = "");
		var r = [], i, a = /\[i\]$/, o, s = "", c = !1;
		for (i = 0; i < e.length; i++) a.test(e[i]) ? (o = e[i].substring(0, e[i].length - 3), s = o) : o = e[i], o === "ret" && (c = !0), r.push(o);
		return r[e.length] = "var _n = " + s + ".length;\nvar i" + (c ? "" : ", ret = Array(_n)") + ";\n" + n + "\nfor(i=_n-1;i!==-1;--i) {\n" + t + "\n}\nreturn ret;", Function.apply(null, r);
	}, numeric._biforeach = function e(t, n, r, i, a) {
		if (i === r.length - 1) {
			a(t, n);
			return;
		}
		var o;
		for (o = r[i] - 1; o >= 0; o--) e(typeof t == "object" ? t[o] : t, typeof n == "object" ? n[o] : n, r, i + 1, a);
	}, numeric._biforeach2 = function e(t, n, r, i, a) {
		if (i === r.length - 1) return a(t, n);
		var o, s = r[i], c = Array(s);
		for (o = s - 1; o >= 0; --o) c[o] = e(typeof t == "object" ? t[o] : t, typeof n == "object" ? n[o] : n, r, i + 1, a);
		return c;
	}, numeric._foreach = function e(t, n, r, i) {
		if (r === n.length - 1) {
			i(t);
			return;
		}
		var a;
		for (a = n[r] - 1; a >= 0; a--) e(t[a], n, r + 1, i);
	}, numeric._foreach2 = function e(t, n, r, i) {
		if (r === n.length - 1) return i(t);
		var a, o = n[r], s = Array(o);
		for (a = o - 1; a >= 0; a--) s[a] = e(t[a], n, r + 1, i);
		return s;
	}, numeric.ops2 = {
		add: "+",
		sub: "-",
		mul: "*",
		div: "/",
		mod: "%",
		and: "&&",
		or: "||",
		eq: "===",
		neq: "!==",
		lt: "<",
		gt: ">",
		leq: "<=",
		geq: ">=",
		band: "&",
		bor: "|",
		bxor: "^",
		lshift: "<<",
		rshift: ">>",
		rrshift: ">>>"
	}, numeric.opseq = {
		addeq: "+=",
		subeq: "-=",
		muleq: "*=",
		diveq: "/=",
		modeq: "%=",
		lshifteq: "<<=",
		rshifteq: ">>=",
		rrshifteq: ">>>=",
		bandeq: "&=",
		boreq: "|=",
		bxoreq: "^="
	}, numeric.mathfuns = [
		"abs",
		"acos",
		"asin",
		"atan",
		"ceil",
		"cos",
		"exp",
		"floor",
		"log",
		"round",
		"sin",
		"sqrt",
		"tan",
		"isNaN",
		"isFinite"
	], numeric.mathfuns2 = [
		"atan2",
		"pow",
		"max",
		"min"
	], numeric.ops1 = {
		neg: "-",
		not: "!",
		bnot: "~",
		clone: ""
	}, numeric.mapreducers = {
		any: ["if(xi) return true;", "var accum = false;"],
		all: ["if(!xi) return false;", "var accum = true;"],
		sum: ["accum += xi;", "var accum = 0;"],
		prod: ["accum *= xi;", "var accum = 1;"],
		norm2Squared: ["accum += xi*xi;", "var accum = 0;"],
		norminf: ["accum = max(accum,abs(xi));", "var accum = 0, max = Math.max, abs = Math.abs;"],
		norm1: ["accum += abs(xi)", "var accum = 0, abs = Math.abs;"],
		sup: ["accum = max(accum,xi);", "var accum = -Infinity, max = Math.max;"],
		inf: ["accum = min(accum,xi);", "var accum = Infinity, min = Math.min;"]
	}, (function() {
		var e, t;
		for (e = 0; e < numeric.mathfuns2.length; ++e) t = numeric.mathfuns2[e], numeric.ops2[t] = t;
		for (e in numeric.ops2) if (numeric.ops2.hasOwnProperty(e)) {
			t = numeric.ops2[e];
			var n, r, i = "";
			numeric.myIndexOf.call(numeric.mathfuns2, e) === -1 ? (n = function(e, n, r) {
				return e + " = " + n + " " + t + " " + r;
			}, r = numeric.opseq.hasOwnProperty(e + "eq") ? function(e, n) {
				return e + " " + t + "= " + n;
			} : function(e, n) {
				return e + " = " + e + " " + t + " " + n;
			}) : (i = "var " + t + " = Math." + t + ";\n", n = function(e, n, r) {
				return e + " = " + t + "(" + n + "," + r + ")";
			}, r = function(e, n) {
				return e + " = " + t + "(" + e + "," + n + ")";
			}), numeric[e + "VV"] = numeric.pointwise2(["x[i]", "y[i]"], n("ret[i]", "x[i]", "y[i]"), i), numeric[e + "SV"] = numeric.pointwise2(["x", "y[i]"], n("ret[i]", "x", "y[i]"), i), numeric[e + "VS"] = numeric.pointwise2(["x[i]", "y"], n("ret[i]", "x[i]", "y"), i), numeric[e] = Function("var n = arguments.length, i, x = arguments[0], y;\nvar VV = numeric." + e + "VV, VS = numeric." + e + "VS, SV = numeric." + e + "SV;\nvar dim = numeric.dim;\nfor(i=1;i!==n;++i) { \n  y = arguments[i];\n  if(typeof x === \"object\") {\n      if(typeof y === \"object\") x = numeric._biforeach2(x,y,dim(x),0,VV);\n      else x = numeric._biforeach2(x,y,dim(x),0,VS);\n  } else if(typeof y === \"object\") x = numeric._biforeach2(x,y,dim(y),0,SV);\n  else " + r("x", "y") + "\n}\nreturn x;\n"), numeric[t] = numeric[e], numeric[e + "eqV"] = numeric.pointwise2(["ret[i]", "x[i]"], r("ret[i]", "x[i]"), i), numeric[e + "eqS"] = numeric.pointwise2(["ret[i]", "x"], r("ret[i]", "x"), i), numeric[e + "eq"] = Function("var n = arguments.length, i, x = arguments[0], y;\nvar V = numeric." + e + "eqV, S = numeric." + e + "eqS\nvar s = numeric.dim(x);\nfor(i=1;i!==n;++i) { \n  y = arguments[i];\n  if(typeof y === \"object\") numeric._biforeach(x,y,s,0,V);\n  else numeric._biforeach(x,y,s,0,S);\n}\nreturn x;\n");
		}
		for (e = 0; e < numeric.mathfuns2.length; ++e) t = numeric.mathfuns2[e], delete numeric.ops2[t];
		for (e = 0; e < numeric.mathfuns.length; ++e) t = numeric.mathfuns[e], numeric.ops1[t] = t;
		for (e in numeric.ops1) numeric.ops1.hasOwnProperty(e) && (i = "", t = numeric.ops1[e], numeric.myIndexOf.call(numeric.mathfuns, e) !== -1 && Math.hasOwnProperty(t) && (i = "var " + t + " = Math." + t + ";\n"), numeric[e + "eqV"] = numeric.pointwise2(["ret[i]"], "ret[i] = " + t + "(ret[i]);", i), numeric[e + "eq"] = Function("x", "if(typeof x !== \"object\") return " + t + "x\nvar i;\nvar V = numeric." + e + "eqV;\nvar s = numeric.dim(x);\nnumeric._foreach(x,s,0,V);\nreturn x;\n"), numeric[e + "V"] = numeric.pointwise2(["x[i]"], "ret[i] = " + t + "(x[i]);", i), numeric[e] = Function("x", "if(typeof x !== \"object\") return " + t + "(x)\nvar i;\nvar V = numeric." + e + "V;\nvar s = numeric.dim(x);\nreturn numeric._foreach2(x,s,0,V);\n"));
		for (e = 0; e < numeric.mathfuns.length; ++e) t = numeric.mathfuns[e], delete numeric.ops1[t];
		for (e in numeric.mapreducers) numeric.mapreducers.hasOwnProperty(e) && (t = numeric.mapreducers[e], numeric[e + "V"] = numeric.mapreduce2(t[0], t[1]), numeric[e] = Function("x", "s", "k", t[1] + "if(typeof x !== \"object\") {    xi = x;\n" + t[0] + ";\n    return accum;\n}if(typeof s === \"undefined\") s = numeric.dim(x);\nif(typeof k === \"undefined\") k = 0;\nif(k === s.length-1) return numeric." + e + "V(x);\nvar xi;\nvar n = x.length, i;\nfor(i=n-1;i!==-1;--i) {\n   xi = arguments.callee(x[i]);\n" + t[0] + ";\n}\nreturn accum;\n"));
	})(), numeric.truncVV = numeric.pointwise(["x[i]", "y[i]"], "ret[i] = round(x[i]/y[i])*y[i];", "var round = Math.round;"), numeric.truncVS = numeric.pointwise(["x[i]", "y"], "ret[i] = round(x[i]/y)*y;", "var round = Math.round;"), numeric.truncSV = numeric.pointwise(["x", "y[i]"], "ret[i] = round(x/y[i])*y[i];", "var round = Math.round;"), numeric.trunc = function(e, t) {
		return typeof e == "object" ? typeof t == "object" ? numeric.truncVV(e, t) : numeric.truncVS(e, t) : typeof t == "object" ? numeric.truncSV(e, t) : Math.round(e / t) * t;
	}, numeric.inv = function(e) {
		var t = numeric.dim(e), n = Math.abs, r = t[0], i = t[1], a = numeric.clone(e), o, s, c = numeric.identity(r), l, u, d, f, p, e;
		for (f = 0; f < i; ++f) {
			var m = -1, h = -1;
			for (d = f; d !== r; ++d) p = n(a[d][f]), p > h && (m = d, h = p);
			for (s = a[m], a[m] = a[f], a[f] = s, u = c[m], c[m] = c[f], c[f] = u, e = s[f], p = f; p !== i; ++p) s[p] /= e;
			for (p = i - 1; p !== -1; --p) u[p] /= e;
			for (d = r - 1; d !== -1; --d) if (d !== f) {
				for (o = a[d], l = c[d], e = o[f], p = f + 1; p !== i; ++p) o[p] -= s[p] * e;
				for (p = i - 1; p > 0; --p) l[p] -= u[p] * e, --p, l[p] -= u[p] * e;
				p === 0 && (l[0] -= u[0] * e);
			}
		}
		return c;
	}, numeric.det = function(e) {
		var t = numeric.dim(e);
		if (t.length !== 2 || t[0] !== t[1]) throw Error("numeric: det() only works on square matrices");
		var n = t[0], r = 1, i, a, o, s = numeric.clone(e), c, l, u, d, f;
		for (a = 0; a < n - 1; a++) {
			for (o = a, i = a + 1; i < n; i++) Math.abs(s[i][a]) > Math.abs(s[o][a]) && (o = i);
			for (o !== a && (d = s[o], s[o] = s[a], s[a] = d, r *= -1), c = s[a], i = a + 1; i < n; i++) {
				for (l = s[i], u = l[a] / c[a], o = a + 1; o < n - 1; o += 2) f = o + 1, l[o] -= c[o] * u, l[f] -= c[f] * u;
				o !== n && (l[o] -= c[o] * u);
			}
			if (c[a] === 0) return 0;
			r *= c[a];
		}
		return r * s[a][a];
	}, numeric.transpose = function(e) {
		var t, n, r = e.length, i = e[0].length, a = Array(i), o, s, c;
		for (n = 0; n < i; n++) a[n] = Array(r);
		for (t = r - 1; t >= 1; t -= 2) {
			for (s = e[t], o = e[t - 1], n = i - 1; n >= 1; --n) c = a[n], c[t] = s[n], c[t - 1] = o[n], --n, c = a[n], c[t] = s[n], c[t - 1] = o[n];
			n === 0 && (c = a[0], c[t] = s[0], c[t - 1] = o[0]);
		}
		if (t === 0) {
			for (o = e[0], n = i - 1; n >= 1; --n) a[n][0] = o[n], --n, a[n][0] = o[n];
			n === 0 && (a[0][0] = o[0]);
		}
		return a;
	}, numeric.negtranspose = function(e) {
		var t, n, r = e.length, i = e[0].length, a = Array(i), o, s, c;
		for (n = 0; n < i; n++) a[n] = Array(r);
		for (t = r - 1; t >= 1; t -= 2) {
			for (s = e[t], o = e[t - 1], n = i - 1; n >= 1; --n) c = a[n], c[t] = -s[n], c[t - 1] = -o[n], --n, c = a[n], c[t] = -s[n], c[t - 1] = -o[n];
			n === 0 && (c = a[0], c[t] = -s[0], c[t - 1] = -o[0]);
		}
		if (t === 0) {
			for (o = e[0], n = i - 1; n >= 1; --n) a[n][0] = -o[n], --n, a[n][0] = -o[n];
			n === 0 && (a[0][0] = -o[0]);
		}
		return a;
	}, numeric._random = function e(t, n) {
		var r, i = t[n], a = Array(i), o;
		if (n === t.length - 1) {
			for (o = Math.random, r = i - 1; r >= 1; r -= 2) a[r] = o(), a[r - 1] = o();
			return r === 0 && (a[0] = o()), a;
		}
		for (r = i - 1; r >= 0; r--) a[r] = e(t, n + 1);
		return a;
	}, numeric.random = function(e) {
		return numeric._random(e, 0);
	}, numeric.norm2 = function(e) {
		return Math.sqrt(numeric.norm2Squared(e));
	}, numeric.linspace = function(e, t, n) {
		if (n === void 0 && (n = Math.max(Math.round(t - e) + 1, 1)), n < 2) return n === 1 ? [e] : [];
		var r, i = Array(n);
		for (n--, r = n; r >= 0; r--) i[r] = (r * t + (n - r) * e) / n;
		return i;
	}, numeric.getBlock = function(e, t, n) {
		var r = numeric.dim(e);
		function i(e, a) {
			var o, s = t[a], c = n[a] - s, l = Array(c);
			if (a === r.length - 1) {
				for (o = c; o >= 0; o--) l[o] = e[o + s];
				return l;
			}
			for (o = c; o >= 0; o--) l[o] = i(e[o + s], a + 1);
			return l;
		}
		return i(e, 0);
	}, numeric.setBlock = function(e, t, n, r) {
		var i = numeric.dim(e);
		function a(e, r, o) {
			var s, c = t[o], l = n[o] - c;
			if (o === i.length - 1) for (s = l; s >= 0; s--) e[s + c] = r[s];
			for (s = l; s >= 0; s--) a(e[s + c], r[s], o + 1);
		}
		return a(e, r, 0), e;
	}, numeric.getRange = function(e, t, n) {
		var r = t.length, i = n.length, a, o, s = Array(r), c, l;
		for (a = r - 1; a !== -1; --a) for (s[a] = Array(i), c = s[a], l = e[t[a]], o = i - 1; o !== -1; --o) c[o] = l[n[o]];
		return s;
	}, numeric.blockMatrix = function(e) {
		var t = numeric.dim(e);
		if (t.length < 4) return numeric.blockMatrix([e]);
		var n = t[0], r = t[1], i = 0, a = 0, o, s, c;
		for (o = 0; o < n; ++o) i += e[o][0].length;
		for (s = 0; s < r; ++s) a += e[0][s][0].length;
		var l = Array(i);
		for (o = 0; o < i; ++o) l[o] = Array(a);
		var u = 0, d, f, p, m, h;
		for (o = 0; o < n; ++o) {
			for (d = a, s = r - 1; s !== -1; --s) for (c = e[o][s], d -= c[0].length, p = c.length - 1; p !== -1; --p) for (h = c[p], f = l[u + p], m = h.length - 1; m !== -1; --m) f[d + m] = h[m];
			u += e[o][0].length;
		}
		return l;
	}, numeric.tensor = function(e, t) {
		if (typeof e == "number" || typeof t == "number") return numeric.mul(e, t);
		var n = numeric.dim(e), r = numeric.dim(t);
		if (n.length !== 1 || r.length !== 1) throw Error("numeric: tensor product is only defined for vectors");
		var i = n[0], a = r[0], o = Array(i), s, c, l, u;
		for (c = i - 1; c >= 0; c--) {
			for (s = Array(a), u = e[c], l = a - 1; l >= 3; --l) s[l] = u * t[l], --l, s[l] = u * t[l], --l, s[l] = u * t[l], --l, s[l] = u * t[l];
			for (; l >= 0;) s[l] = u * t[l], --l;
			o[c] = s;
		}
		return o;
	}, numeric.T = function(e, t) {
		this.x = e, this.y = t;
	}, numeric.t = function(e, t) {
		return new numeric.T(e, t);
	}, numeric.Tbinop = function(e, t, n, r, i) {
		if (numeric.indexOf, typeof i != "string") for (var a in i = "", numeric) numeric.hasOwnProperty(a) && (e.indexOf(a) >= 0 || t.indexOf(a) >= 0 || n.indexOf(a) >= 0 || r.indexOf(a) >= 0) && a.length > 1 && (i += "var " + a + " = numeric." + a + ";\n");
		return Function(["y"], "var x = this;\nif(!(y instanceof numeric.T)) { y = new numeric.T(y); }\n" + i + "\nif(x.y) {  if(y.y) {    return new numeric.T(" + r + ");\n  }\n  return new numeric.T(" + n + ");\n}\nif(y.y) {\n  return new numeric.T(" + t + ");\n}\nreturn new numeric.T(" + e + ");\n");
	}, numeric.T.prototype.add = numeric.Tbinop("add(x.x,y.x)", "add(x.x,y.x),y.y", "add(x.x,y.x),x.y", "add(x.x,y.x),add(x.y,y.y)"), numeric.T.prototype.sub = numeric.Tbinop("sub(x.x,y.x)", "sub(x.x,y.x),neg(y.y)", "sub(x.x,y.x),x.y", "sub(x.x,y.x),sub(x.y,y.y)"), numeric.T.prototype.mul = numeric.Tbinop("mul(x.x,y.x)", "mul(x.x,y.x),mul(x.x,y.y)", "mul(x.x,y.x),mul(x.y,y.x)", "sub(mul(x.x,y.x),mul(x.y,y.y)),add(mul(x.x,y.y),mul(x.y,y.x))"), numeric.T.prototype.reciprocal = function() {
		var e = numeric.mul, t = numeric.div;
		if (this.y) {
			var n = numeric.add(e(this.x, this.x), e(this.y, this.y));
			return new numeric.T(t(this.x, n), t(numeric.neg(this.y), n));
		}
		return new T(t(1, this.x));
	}, numeric.T.prototype.div = function(e) {
		if (e instanceof numeric.T || (e = new numeric.T(e)), e.y) return this.mul(e.reciprocal());
		var t = numeric.div;
		return this.y ? new numeric.T(t(this.x, e.x), t(this.y, e.x)) : new numeric.T(t(this.x, e.x));
	}, numeric.T.prototype.dot = numeric.Tbinop("dot(x.x,y.x)", "dot(x.x,y.x),dot(x.x,y.y)", "dot(x.x,y.x),dot(x.y,y.x)", "sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))"), numeric.T.prototype.transpose = function() {
		var e = numeric.transpose, t = this.x, n = this.y;
		return n ? new numeric.T(e(t), e(n)) : new numeric.T(e(t));
	}, numeric.T.prototype.transjugate = function() {
		var e = numeric.transpose, t = this.x, n = this.y;
		return n ? new numeric.T(e(t), numeric.negtranspose(n)) : new numeric.T(e(t));
	}, numeric.Tunop = function(e, t, n) {
		return typeof n != "string" && (n = ""), Function("var x = this;\n" + n + "\nif(x.y) {  " + t + ";\n}\n" + e + ";\n");
	}, numeric.T.prototype.exp = numeric.Tunop("return new numeric.T(ex)", "return new numeric.T(mul(cos(x.y),ex),mul(sin(x.y),ex))", "var ex = numeric.exp(x.x), cos = numeric.cos, sin = numeric.sin, mul = numeric.mul;"), numeric.T.prototype.conj = numeric.Tunop("return new numeric.T(x.x);", "return new numeric.T(x.x,numeric.neg(x.y));"), numeric.T.prototype.neg = numeric.Tunop("return new numeric.T(neg(x.x));", "return new numeric.T(neg(x.x),neg(x.y));", "var neg = numeric.neg;"), numeric.T.prototype.sin = numeric.Tunop("return new numeric.T(numeric.sin(x.x))", "return x.exp().sub(x.neg().exp()).div(new numeric.T(0,2));"), numeric.T.prototype.cos = numeric.Tunop("return new numeric.T(numeric.cos(x.x))", "return x.exp().add(x.neg().exp()).div(2);"), numeric.T.prototype.abs = numeric.Tunop("return new numeric.T(numeric.abs(x.x));", "return new numeric.T(numeric.sqrt(numeric.add(mul(x.x,x.x),mul(x.y,x.y))));", "var mul = numeric.mul;"), numeric.T.prototype.log = numeric.Tunop("return new numeric.T(numeric.log(x.x));", "var theta = new numeric.T(numeric.atan2(x.y,x.x)), r = x.abs();\nreturn new numeric.T(numeric.log(r.x),theta.x);"), numeric.T.prototype.norm2 = numeric.Tunop("return numeric.norm2(x.x);", "var f = numeric.norm2Squared;\nreturn Math.sqrt(f(x.x)+f(x.y));"), numeric.T.prototype.inv = function() {
		var e = this;
		if (e.y === void 0) return new numeric.T(numeric.inv(e.x));
		var t = e.x.length, n, r, i, a = numeric.identity(t), o = numeric.rep([t, t], 0), s = numeric.clone(e.x), c = numeric.clone(e.y), l, u, d, f, p, m, h, g, n, r, i, _, v, y, b, x, S, w;
		for (n = 0; n < t; n++) {
			for (y = s[n][n], b = c[n][n], _ = y * y + b * b, i = n, r = n + 1; r < t; r++) y = s[r][n], b = c[r][n], v = y * y + b * b, v > _ && (i = r, _ = v);
			for (i !== n && (w = s[n], s[n] = s[i], s[i] = w, w = c[n], c[n] = c[i], c[i] = w, w = a[n], a[n] = a[i], a[i] = w, w = o[n], o[n] = o[i], o[i] = w), l = s[n], u = c[n], p = a[n], m = o[n], y = l[n], b = u[n], r = n + 1; r < t; r++) x = l[r], S = u[r], l[r] = (x * y + S * b) / _, u[r] = (S * y - x * b) / _;
			for (r = 0; r < t; r++) x = p[r], S = m[r], p[r] = (x * y + S * b) / _, m[r] = (S * y - x * b) / _;
			for (r = n + 1; r < t; r++) {
				for (d = s[r], f = c[r], h = a[r], g = o[r], y = d[n], b = f[n], i = n + 1; i < t; i++) x = l[i], S = u[i], d[i] -= x * y - S * b, f[i] -= S * y + x * b;
				for (i = 0; i < t; i++) x = p[i], S = m[i], h[i] -= x * y - S * b, g[i] -= S * y + x * b;
			}
		}
		for (n = t - 1; n > 0; n--) for (p = a[n], m = o[n], r = n - 1; r >= 0; r--) for (h = a[r], g = o[r], y = s[r][n], b = c[r][n], i = t - 1; i >= 0; i--) x = p[i], S = m[i], h[i] -= y * x - b * S, g[i] -= y * S + b * x;
		return new numeric.T(a, o);
	}, numeric.T.prototype.get = function(e) {
		var t = this.x, n = this.y, r = 0, i, a = e.length;
		if (n) {
			for (; r < a;) i = e[r], t = t[i], n = n[i], r++;
			return new numeric.T(t, n);
		}
		for (; r < a;) i = e[r], t = t[i], r++;
		return new numeric.T(t);
	}, numeric.T.prototype.set = function(e, t) {
		var n = this.x, r = this.y, i = 0, a, o = e.length, s = t.x, c = t.y;
		if (o === 0) return c ? this.y = c : r && (this.y = void 0), this.x = n, this;
		if (c) {
			for (r || (r = numeric.rep(numeric.dim(n), 0), this.y = r); i < o - 1;) a = e[i], n = n[a], r = r[a], i++;
			return a = e[i], n[a] = s, r[a] = c, this;
		}
		if (r) {
			for (; i < o - 1;) a = e[i], n = n[a], r = r[a], i++;
			return a = e[i], n[a] = s, s instanceof Array ? r[a] = numeric.rep(numeric.dim(s), 0) : r[a] = 0, this;
		}
		for (; i < o - 1;) a = e[i], n = n[a], i++;
		return a = e[i], n[a] = s, this;
	}, numeric.T.prototype.getRows = function(e, t) {
		var n = t - e + 1, r, i = Array(n), a, o = this.x, s = this.y;
		for (r = e; r <= t; r++) i[r - e] = o[r];
		if (s) {
			for (a = Array(n), r = e; r <= t; r++) a[r - e] = s[r];
			return new numeric.T(i, a);
		}
		return new numeric.T(i);
	}, numeric.T.prototype.setRows = function(e, t, n) {
		var r, i = this.x, a = this.y, o = n.x, s = n.y;
		for (r = e; r <= t; r++) i[r] = o[r - e];
		if (s) for (a || (a = numeric.rep(numeric.dim(i), 0), this.y = a), r = e; r <= t; r++) a[r] = s[r - e];
		else if (a) for (r = e; r <= t; r++) a[r] = numeric.rep([o[r - e].length], 0);
		return this;
	}, numeric.T.prototype.getRow = function(e) {
		var t = this.x, n = this.y;
		return n ? new numeric.T(t[e], n[e]) : new numeric.T(t[e]);
	}, numeric.T.prototype.setRow = function(e, t) {
		var n = this.x, r = this.y, i = t.x, a = t.y;
		return n[e] = i, a ? (r || (r = numeric.rep(numeric.dim(n), 0), this.y = r), r[e] = a) : r &&= numeric.rep([i.length], 0), this;
	}, numeric.T.prototype.getBlock = function(e, t) {
		var n = this.x, r = this.y, i = numeric.getBlock;
		return r ? new numeric.T(i(n, e, t), i(r, e, t)) : new numeric.T(i(n, e, t));
	}, numeric.T.prototype.setBlock = function(e, t, n) {
		n instanceof numeric.T || (n = new numeric.T(n));
		var r = this.x, i = this.y, a = numeric.setBlock, o = n.x, s = n.y;
		if (s) return i ||= (this.y = numeric.rep(numeric.dim(this), 0), this.y), a(r, e, t, o), a(i, e, t, s), this;
		a(r, e, t, o), i && a(i, e, t, numeric.rep(numeric.dim(o), 0));
	}, numeric.T.rep = function(e, t) {
		var n = numeric.T;
		t instanceof n || (t = new n(t));
		var r = t.x, i = t.y, a = numeric.rep;
		return i ? new n(a(e, r), a(e, i)) : new n(a(e, r));
	}, numeric.T.diag = function(e) {
		e instanceof numeric.T || (e = new numeric.T(e));
		var t = e.x, n = e.y, r = numeric.diag;
		return n ? new numeric.T(r(t), r(n)) : new numeric.T(r(t));
	}, numeric.T.eig = function() {
		if (this.y) throw Error("eig: not implemented for complex matrices.");
		return numeric.eig(this.x);
	}, numeric.T.identity = function(e) {
		return new numeric.T(numeric.identity(e));
	}, numeric.T.prototype.getDiag = function() {
		var e = numeric, t = this.x, n = this.y;
		return n ? new e.T(e.getDiag(t), e.getDiag(n)) : new e.T(e.getDiag(t));
	}, numeric.house = function(e) {
		var t = numeric.clone(e), n = (e[0] >= 0 ? 1 : -1) * numeric.norm2(e);
		t[0] += n;
		var r = numeric.norm2(t);
		if (r === 0) throw Error("eig: internal error");
		return numeric.div(t, r);
	}, numeric.toUpperHessenberg = function(e) {
		var t = numeric.dim(e);
		if (t.length !== 2 || t[0] !== t[1]) throw Error("numeric: toUpperHessenberg() only works on square matrices");
		var n = t[0], r, i, a, o, s, c = numeric.clone(e), l, u, d, f, p = numeric.identity(n), m;
		for (i = 0; i < n - 2; i++) {
			for (o = Array(n - i - 1), r = i + 1; r < n; r++) o[r - i - 1] = c[r][i];
			if (numeric.norm2(o) > 0) {
				for (s = numeric.house(o), l = numeric.getBlock(c, [i + 1, i], [n - 1, n - 1]), u = numeric.tensor(s, numeric.dot(s, l)), r = i + 1; r < n; r++) for (d = c[r], f = u[r - i - 1], a = i; a < n; a++) d[a] -= 2 * f[a - i];
				for (l = numeric.getBlock(c, [0, i + 1], [n - 1, n - 1]), u = numeric.tensor(numeric.dot(l, s), s), r = 0; r < n; r++) for (d = c[r], f = u[r], a = i + 1; a < n; a++) d[a] -= 2 * f[a - i - 1];
				for (l = Array(n - i - 1), r = i + 1; r < n; r++) l[r - i - 1] = p[r];
				for (u = numeric.tensor(s, numeric.dot(s, l)), r = i + 1; r < n; r++) for (m = p[r], f = u[r - i - 1], a = 0; a < n; a++) m[a] -= 2 * f[a];
			}
		}
		return {
			H: c,
			Q: p
		};
	}, numeric.epsilon = 2220446049250313e-31, numeric.QRFrancis = function(e, t) {
		t === void 0 && (t = 1e4), e = numeric.clone(e), numeric.clone(e);
		var n = numeric.dim(e)[0], r, i, a, o, s, c, l, u, d, f = numeric.identity(n), p, m, h, g, _, v, y, b, x;
		if (n < 3) return {
			Q: f,
			B: [[0, n - 1]]
		};
		var S = numeric.epsilon;
		for (x = 0; x < t; x++) {
			for (y = 0; y < n - 1; y++) if (Math.abs(e[y + 1][y]) < S * (Math.abs(e[y][y]) + Math.abs(e[y + 1][y + 1]))) {
				var w = numeric.QRFrancis(numeric.getBlock(e, [0, 0], [y, y]), t), E = numeric.QRFrancis(numeric.getBlock(e, [y + 1, y + 1], [n - 1, n - 1]), t);
				for (h = Array(y + 1), v = 0; v <= y; v++) h[v] = f[v];
				for (g = numeric.dot(w.Q, h), v = 0; v <= y; v++) f[v] = g[v];
				for (h = Array(n - y - 1), v = y + 1; v < n; v++) h[v - y - 1] = f[v];
				for (g = numeric.dot(E.Q, h), v = y + 1; v < n; v++) f[v] = g[v - y - 1];
				return {
					Q: f,
					B: w.B.concat(numeric.add(E.B, y + 1))
				};
			}
			if (a = e[n - 2][n - 2], o = e[n - 2][n - 1], s = e[n - 1][n - 2], c = e[n - 1][n - 1], u = a + c, l = a * c - o * s, d = numeric.getBlock(e, [0, 0], [2, 2]), u * u >= 4 * l) {
				var D = .5 * (u + Math.sqrt(u * u - 4 * l)), O = .5 * (u - Math.sqrt(u * u - 4 * l));
				d = numeric.add(numeric.sub(numeric.dot(d, d), numeric.mul(d, D + O)), numeric.diag(numeric.rep([3], D * O)));
			} else d = numeric.add(numeric.sub(numeric.dot(d, d), numeric.mul(d, u)), numeric.diag(numeric.rep([3], l)));
			for (r = [
				d[0][0],
				d[1][0],
				d[2][0]
			], i = numeric.house(r), h = [
				e[0],
				e[1],
				e[2]
			], g = numeric.tensor(i, numeric.dot(i, h)), v = 0; v < 3; v++) for (m = e[v], _ = g[v], b = 0; b < n; b++) m[b] -= 2 * _[b];
			for (h = numeric.getBlock(e, [0, 0], [n - 1, 2]), g = numeric.tensor(numeric.dot(h, i), i), v = 0; v < n; v++) for (m = e[v], _ = g[v], b = 0; b < 3; b++) m[b] -= 2 * _[b];
			for (h = [
				f[0],
				f[1],
				f[2]
			], g = numeric.tensor(i, numeric.dot(i, h)), v = 0; v < 3; v++) for (p = f[v], _ = g[v], b = 0; b < n; b++) p[b] -= 2 * _[b];
			var j;
			for (y = 0; y < n - 2; y++) {
				for (b = y; b <= y + 1; b++) if (Math.abs(e[b + 1][b]) < S * (Math.abs(e[b][b]) + Math.abs(e[b + 1][b + 1]))) {
					var w = numeric.QRFrancis(numeric.getBlock(e, [0, 0], [b, b]), t), E = numeric.QRFrancis(numeric.getBlock(e, [b + 1, b + 1], [n - 1, n - 1]), t);
					for (h = Array(b + 1), v = 0; v <= b; v++) h[v] = f[v];
					for (g = numeric.dot(w.Q, h), v = 0; v <= b; v++) f[v] = g[v];
					for (h = Array(n - b - 1), v = b + 1; v < n; v++) h[v - b - 1] = f[v];
					for (g = numeric.dot(E.Q, h), v = b + 1; v < n; v++) f[v] = g[v - b - 1];
					return {
						Q: f,
						B: w.B.concat(numeric.add(E.B, b + 1))
					};
				}
				for (j = Math.min(n - 1, y + 3), r = Array(j - y), v = y + 1; v <= j; v++) r[v - y - 1] = e[v][y];
				for (i = numeric.house(r), h = numeric.getBlock(e, [y + 1, y], [j, n - 1]), g = numeric.tensor(i, numeric.dot(i, h)), v = y + 1; v <= j; v++) for (m = e[v], _ = g[v - y - 1], b = y; b < n; b++) m[b] -= 2 * _[b - y];
				for (h = numeric.getBlock(e, [0, y + 1], [n - 1, j]), g = numeric.tensor(numeric.dot(h, i), i), v = 0; v < n; v++) for (m = e[v], _ = g[v], b = y + 1; b <= j; b++) m[b] -= 2 * _[b - y - 1];
				for (h = Array(j - y), v = y + 1; v <= j; v++) h[v - y - 1] = f[v];
				for (g = numeric.tensor(i, numeric.dot(i, h)), v = y + 1; v <= j; v++) for (p = f[v], _ = g[v - y - 1], b = 0; b < n; b++) p[b] -= 2 * _[b];
			}
		}
		throw Error("numeric: eigenvalue iteration does not converge -- increase maxiter?");
	}, numeric.eig = function(e, t) {
		var n = numeric.toUpperHessenberg(e), r = numeric.QRFrancis(n.H, t), i = numeric.T, a = e.length, o, s, c = r.B, l = numeric.dot(r.Q, numeric.dot(n.H, numeric.transpose(r.Q))), u = new i(numeric.dot(r.Q, n.Q)), d, f = c.length, p, m, h, g, _, v, y, b, x, S, w, E, D, O, j = Math.sqrt;
		for (s = 0; s < f; s++) if (o = c[s][0], o !== c[s][1]) {
			if (p = o + 1, m = l[o][o], h = l[o][p], g = l[p][o], _ = l[p][p], h === 0 && g === 0) continue;
			v = -m - _, y = m * _ - h * g, b = v * v - 4 * y, b >= 0 ? (x = v < 0 ? -.5 * (v - j(b)) : -.5 * (v + j(b)), D = (m - x) * (m - x) + h * h, O = g * g + (_ - x) * (_ - x), D > O ? (D = j(D), w = (m - x) / D, E = h / D) : (O = j(O), w = g / O, E = (_ - x) / O), d = new i([[E, -w], [w, E]]), u.setRows(o, p, d.dot(u.getRows(o, p)))) : (x = -.5 * v, S = .5 * j(-b), D = (m - x) * (m - x) + h * h, O = g * g + (_ - x) * (_ - x), D > O ? (D = j(D + S * S), w = (m - x) / D, E = h / D, x = 0, S /= D) : (O = j(O + S * S), w = g / O, E = (_ - x) / O, x = S / O, S = 0), d = new i([[E, -w], [w, E]], [[x, S], [S, -x]]), u.setRows(o, p, d.dot(u.getRows(o, p))));
		}
		var M = u.dot(e).dot(u.transjugate()), a = e.length, N = numeric.T.identity(a);
		for (p = 0; p < a; p++) if (p > 0) for (s = p - 1; s >= 0; s--) {
			var F = M.get([s, s]), I = M.get([p, p]);
			if (numeric.neq(F.x, I.x) || numeric.neq(F.y, I.y)) x = M.getRow(s).getBlock([s], [p - 1]), S = N.getRow(p).getBlock([s], [p - 1]), N.set([p, s], M.get([s, p]).neg().sub(x.dot(S)).div(F.sub(I)));
			else {
				N.setRow(p, N.getRow(s));
				continue;
			}
		}
		for (p = 0; p < a; p++) x = N.getRow(p), N.setRow(p, x.div(x.norm2()));
		return N = N.transpose(), N = u.transjugate().dot(N), {
			lambda: M.getDiag(),
			E: N
		};
	}, numeric.ccsSparse = function(e) {
		var t = e.length, n, r, i, a, o = [];
		for (i = t - 1; i !== -1; --i) for (a in r = e[i], r) {
			for (a = parseInt(a); a >= o.length;) o[o.length] = 0;
			r[a] !== 0 && o[a]++;
		}
		var n = o.length, s = Array(n + 1);
		for (s[0] = 0, i = 0; i < n; ++i) s[i + 1] = s[i] + o[i];
		var c = Array(s[n]), l = Array(s[n]);
		for (i = t - 1; i !== -1; --i) for (a in r = e[i], r) r[a] !== 0 && (o[a]--, c[s[a] + o[a]] = i, l[s[a] + o[a]] = r[a]);
		return [
			s,
			c,
			l
		];
	}, numeric.ccsFull = function(e) {
		var t = e[0], n = e[1], r = e[2], i = numeric.ccsDim(e), a = i[0], o = i[1], s, c, l, u, d = numeric.rep([a, o], 0);
		for (s = 0; s < o; s++) for (l = t[s], u = t[s + 1], c = l; c < u; ++c) d[n[c]][s] = r[c];
		return d;
	}, numeric.ccsTSolve = function(e, t, n, r, i) {
		var a = e[0], o = e[1], s = e[2], c = a.length - 1, l = Math.max, u = 0;
		r === void 0 && (n = numeric.rep([c], 0)), r === void 0 && (r = numeric.linspace(0, n.length - 1)), i === void 0 && (i = []);
		function d(e) {
			var t;
			if (n[e] === 0) {
				for (n[e] = 1, t = a[e]; t < a[e + 1]; ++t) d(o[t]);
				i[u] = e, ++u;
			}
		}
		var f, p, m, h, g, _, v;
		for (f = r.length - 1; f !== -1; --f) d(r[f]);
		for (i.length = u, f = i.length - 1; f !== -1; --f) n[i[f]] = 0;
		for (f = r.length - 1; f !== -1; --f) p = r[f], n[p] = t[p];
		for (f = i.length - 1; f !== -1; --f) {
			for (p = i[f], m = a[p], h = l(a[p + 1], m), g = m; g !== h; ++g) if (o[g] === p) {
				n[p] /= s[g];
				break;
			}
			for (v = n[p], g = m; g !== h; ++g) _ = o[g], _ !== p && (n[_] -= v * s[g]);
		}
		return n;
	}, numeric.ccsDFS = function(e) {
		this.k = Array(e), this.k1 = Array(e), this.j = Array(e);
	}, numeric.ccsDFS.prototype.dfs = function(e, t, n, r, i, a) {
		var o = 0, s, c = i.length, l = this.k, u = this.k1, d = this.j, f, p;
		if (r[e] === 0) for (r[e] = 1, d[0] = e, l[0] = f = t[e], u[0] = p = t[e + 1];;) if (f >= p) {
			if (i[c] = d[o], o === 0) return;
			++c, --o, f = l[o], p = u[o];
		} else s = a[n[f]], r[s] === 0 ? (r[s] = 1, l[o] = f, ++o, d[o] = s, f = t[s], u[o] = p = t[s + 1]) : ++f;
	}, numeric.ccsLPSolve = function(e, t, n, r, i, a, o) {
		var s = e[0], c = e[1], l = e[2];
		s.length - 1;
		var u = t[0], d = t[1], f = t[2], p, m = u[i], h = u[i + 1], g, _, v, y, b, x;
		for (r.length = 0, p = m; p < h; ++p) o.dfs(a[d[p]], s, c, n, r, a);
		for (p = r.length - 1; p !== -1; --p) n[r[p]] = 0;
		for (p = m; p !== h; ++p) g = a[d[p]], n[g] = f[p];
		for (p = r.length - 1; p !== -1; --p) {
			for (g = r[p], _ = s[g], v = s[g + 1], y = _; y < v; ++y) if (a[c[y]] === g) {
				n[g] /= l[y];
				break;
			}
			for (x = n[g], y = _; y < v; ++y) b = a[c[y]], b !== g && (n[b] -= x * l[y]);
		}
		return n;
	}, numeric.ccsLUP1 = function(e, t) {
		var n = e[0].length - 1, r = [
			numeric.rep([n + 1], 0),
			[],
			[]
		], i = [
			numeric.rep([n + 1], 0),
			[],
			[]
		], a = r[0], o = r[1], s = r[2], c = i[0], l = i[1], u = i[2], d = numeric.rep([n], 0), f = numeric.rep([n], 0), p, m, h, g, _, v, y, b = numeric.ccsLPSolve, x = Math.abs, S = numeric.linspace(0, n - 1), w = numeric.linspace(0, n - 1), E = new numeric.ccsDFS(n);
		for (t === void 0 && (t = 1), p = 0; p < n; ++p) {
			for (b(r, e, d, f, p, w, E), g = -1, _ = -1, m = f.length - 1; m !== -1; --m) h = f[m], !(h <= p) && (v = x(d[h]), v > g && (_ = h, g = v));
			for (x(d[p]) < t * g && (m = S[p], g = S[_], S[p] = g, w[g] = p, S[_] = m, w[m] = _, g = d[p], d[p] = d[_], d[_] = g), g = a[p], _ = c[p], y = d[p], o[g] = S[p], s[g] = 1, ++g, m = f.length - 1; m !== -1; --m) h = f[m], v = d[h], f[m] = 0, d[h] = 0, h <= p ? (l[_] = h, u[_] = v, ++_) : (o[g] = S[h], s[g] = v / y, ++g);
			a[p + 1] = g, c[p + 1] = _;
		}
		for (m = o.length - 1; m !== -1; --m) o[m] = w[o[m]];
		return {
			L: r,
			U: i,
			P: S,
			Pinv: w
		};
	}, numeric.ccsDFS0 = function(e) {
		this.k = Array(e), this.k1 = Array(e), this.j = Array(e);
	}, numeric.ccsDFS0.prototype.dfs = function(e, t, n, r, i, a, o) {
		var s = 0, c, l = i.length, u = this.k, d = this.k1, f = this.j, p, m;
		if (r[e] === 0) for (r[e] = 1, f[0] = e, u[0] = p = t[a[e]], d[0] = m = t[a[e] + 1];;) {
			if (isNaN(p)) throw Error("Ow!");
			if (p >= m) {
				if (i[l] = a[f[s]], s === 0) return;
				++l, --s, p = u[s], m = d[s];
			} else c = n[p], r[c] === 0 ? (r[c] = 1, u[s] = p, ++s, f[s] = c, c = a[c], p = t[c], d[s] = m = t[c + 1]) : ++p;
		}
	}, numeric.ccsLPSolve0 = function(e, t, n, r, i, a, o, s) {
		var c = e[0], l = e[1], u = e[2];
		c.length - 1;
		var d = t[0], f = t[1], p = t[2], m, h = d[i], g = d[i + 1], _, v, y, b, x, S;
		for (r.length = 0, m = h; m < g; ++m) s.dfs(f[m], c, l, n, r, a, o);
		for (m = r.length - 1; m !== -1; --m) _ = r[m], n[o[_]] = 0;
		for (m = h; m !== g; ++m) _ = f[m], n[_] = p[m];
		for (m = r.length - 1; m !== -1; --m) {
			for (_ = r[m], x = o[_], v = c[_], y = c[_ + 1], b = v; b < y; ++b) if (l[b] === x) {
				n[x] /= u[b];
				break;
			}
			for (S = n[x], b = v; b < y; ++b) n[l[b]] -= S * u[b];
			n[x] = S;
		}
	}, numeric.ccsLUP0 = function(e, t) {
		var n = e[0].length - 1, r = [
			numeric.rep([n + 1], 0),
			[],
			[]
		], i = [
			numeric.rep([n + 1], 0),
			[],
			[]
		], a = r[0], o = r[1], s = r[2], c = i[0], l = i[1], u = i[2], d = numeric.rep([n], 0), f = numeric.rep([n], 0), p, m, h, g, _, v, y, b = numeric.ccsLPSolve0, x = Math.abs, S = numeric.linspace(0, n - 1), w = numeric.linspace(0, n - 1), E = new numeric.ccsDFS0(n);
		for (t === void 0 && (t = 1), p = 0; p < n; ++p) {
			for (b(r, e, d, f, p, w, S, E), g = -1, _ = -1, m = f.length - 1; m !== -1; --m) h = f[m], !(h <= p) && (v = x(d[S[h]]), v > g && (_ = h, g = v));
			for (x(d[S[p]]) < t * g && (m = S[p], g = S[_], S[p] = g, w[g] = p, S[_] = m, w[m] = _), g = a[p], _ = c[p], y = d[S[p]], o[g] = S[p], s[g] = 1, ++g, m = f.length - 1; m !== -1; --m) h = f[m], v = d[S[h]], f[m] = 0, d[S[h]] = 0, h <= p ? (l[_] = h, u[_] = v, ++_) : (o[g] = S[h], s[g] = v / y, ++g);
			a[p + 1] = g, c[p + 1] = _;
		}
		for (m = o.length - 1; m !== -1; --m) o[m] = w[o[m]];
		return {
			L: r,
			U: i,
			P: S,
			Pinv: w
		};
	}, numeric.ccsLUP = numeric.ccsLUP0, numeric.ccsDim = function(e) {
		return [numeric.sup(e[1]) + 1, e[0].length - 1];
	}, numeric.ccsGetBlock = function(e, t, n) {
		var r = numeric.ccsDim(e), i = r[0], a = r[1];
		t === void 0 ? t = numeric.linspace(0, i - 1) : typeof t == "number" && (t = [t]), n === void 0 ? n = numeric.linspace(0, a - 1) : typeof n == "number" && (n = [n]);
		var o, s = t.length, c, l = n.length, u, d, f, p = numeric.rep([a], 0), m = [], h = [], g = [
			p,
			m,
			h
		], _ = e[0], v = e[1], y = e[2], b = numeric.rep([i], 0), x = 0, S = numeric.rep([i], 0);
		for (c = 0; c < l; ++c) {
			d = n[c];
			var w = _[d], E = _[d + 1];
			for (o = w; o < E; ++o) u = v[o], S[u] = 1, b[u] = y[o];
			for (o = 0; o < s; ++o) f = t[o], S[f] && (m[x] = o, h[x] = b[t[o]], ++x);
			for (o = w; o < E; ++o) u = v[o], S[u] = 0;
			p[c + 1] = x;
		}
		return g;
	}, numeric.ccsDot = function(e, t) {
		var n = e[0], r = e[1], i = e[2], a = t[0], o = t[1], s = t[2], c = numeric.ccsDim(e), l = numeric.ccsDim(t), u = c[0];
		c[1];
		var d = l[1], f = numeric.rep([u], 0), p = numeric.rep([u], 0), m = Array(u), h = numeric.rep([d], 0), g = [], _ = [], v = [
			h,
			g,
			_
		], y, b, x, S, w, E, D, O, j, M, N;
		for (x = 0; x !== d; ++x) {
			for (S = a[x], w = a[x + 1], j = 0, b = S; b < w; ++b) for (M = o[b], N = s[b], E = n[M], D = n[M + 1], y = E; y < D; ++y) O = r[y], p[O] === 0 && (m[j] = O, p[O] = 1, j += 1), f[O] = f[O] + i[y] * N;
			for (S = h[x], w = S + j, h[x + 1] = w, b = j - 1; b !== -1; --b) N = S + b, y = m[b], g[N] = y, _[N] = f[y], p[y] = 0, f[y] = 0;
			h[x + 1] = h[x] + j;
		}
		return v;
	}, numeric.ccsLUPSolve = function(e, t) {
		var n = e.L, r = e.U;
		e.P;
		var i = t[0], a = !1;
		typeof i != "object" && (t = [
			[0, t.length],
			numeric.linspace(0, t.length - 1),
			t
		], i = t[0], a = !0);
		var o = t[1], s = t[2], c = n[0].length - 1, l = i.length - 1, u = numeric.rep([c], 0), d = Array(c), f = numeric.rep([c], 0), p = Array(c), m = numeric.rep([l + 1], 0), h = [], g = [], _ = numeric.ccsTSolve, v, y, b, x, S, w, E = 0;
		for (v = 0; v < l; ++v) {
			for (S = 0, b = i[v], x = i[v + 1], y = b; y < x; ++y) w = e.Pinv[o[y]], p[S] = w, f[w] = s[y], ++S;
			for (p.length = S, _(n, f, u, p, d), y = p.length - 1; y !== -1; --y) f[p[y]] = 0;
			if (_(r, u, f, d, p), a) return f;
			for (y = d.length - 1; y !== -1; --y) u[d[y]] = 0;
			for (y = p.length - 1; y !== -1; --y) w = p[y], h[E] = w, g[E] = f[w], f[w] = 0, ++E;
			m[v + 1] = E;
		}
		return [
			m,
			h,
			g
		];
	}, numeric.ccsbinop = function(e, t) {
		return t === void 0 && (t = ""), Function("X", "Y", "var Xi = X[0], Xj = X[1], Xv = X[2];\nvar Yi = Y[0], Yj = Y[1], Yv = Y[2];\nvar n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;\nvar Zi = numeric.rep([n+1],0), Zj = [], Zv = [];\nvar x = numeric.rep([m],0),y = numeric.rep([m],0);\nvar xk,yk,zk;\nvar i,j,j0,j1,k,p=0;\n" + t + "for(i=0;i<n;++i) {\n  j0 = Xi[i]; j1 = Xi[i+1];\n  for(j=j0;j!==j1;++j) {\n    k = Xj[j];\n    x[k] = 1;\n    Zj[p] = k;\n    ++p;\n  }\n  j0 = Yi[i]; j1 = Yi[i+1];\n  for(j=j0;j!==j1;++j) {\n    k = Yj[j];\n    y[k] = Yv[j];\n    if(x[k] === 0) {\n      Zj[p] = k;\n      ++p;\n    }\n  }\n  Zi[i+1] = p;\n  j0 = Xi[i]; j1 = Xi[i+1];\n  for(j=j0;j!==j1;++j) x[Xj[j]] = Xv[j];\n  j0 = Zi[i]; j1 = Zi[i+1];\n  for(j=j0;j!==j1;++j) {\n    k = Zj[j];\n    xk = x[k];\n    yk = y[k];\n" + e + "\n    Zv[j] = zk;\n  }\n  j0 = Xi[i]; j1 = Xi[i+1];\n  for(j=j0;j!==j1;++j) x[Xj[j]] = 0;\n  j0 = Yi[i]; j1 = Yi[i+1];\n  for(j=j0;j!==j1;++j) y[Yj[j]] = 0;\n}\nreturn [Zi,Zj,Zv];");
	}, (function() {
		var k, A, B, C;
		for (k in numeric.ops2) A = isFinite(eval("1" + numeric.ops2[k] + "0")) ? "[Y[0],Y[1],numeric." + k + "(X,Y[2])]" : "NaN", B = isFinite(eval("0" + numeric.ops2[k] + "1")) ? "[X[0],X[1],numeric." + k + "(X[2],Y)]" : "NaN", C = isFinite(eval("1" + numeric.ops2[k] + "0")) && isFinite(eval("0" + numeric.ops2[k] + "1")) ? "numeric.ccs" + k + "MM(X,Y)" : "NaN", numeric["ccs" + k + "MM"] = numeric.ccsbinop("zk = xk " + numeric.ops2[k] + "yk;"), numeric["ccs" + k] = Function("X", "Y", "if(typeof X === \"number\") return " + A + ";\nif(typeof Y === \"number\") return " + B + ";\nreturn " + C + ";\n");
	})(), numeric.ccsScatter = function(e) {
		var t = e[0], n = e[1], r = e[2], i = numeric.sup(n) + 1, a = t.length, o = numeric.rep([i], 0), s = Array(a), c = Array(a), l = numeric.rep([i], 0), u;
		for (u = 0; u < a; ++u) l[n[u]]++;
		for (u = 0; u < i; ++u) o[u + 1] = o[u] + l[u];
		var d = o.slice(0), f, p;
		for (u = 0; u < a; ++u) p = n[u], f = d[p], s[f] = t[u], c[f] = r[u], d[p] = d[p] + 1;
		return [
			o,
			s,
			c
		];
	}, numeric.ccsGather = function(e) {
		var t = e[0], n = e[1], r = e[2], i = t.length - 1, a = n.length, o = Array(a), s = Array(a), c = Array(a), l, u, d, f, p = 0;
		for (l = 0; l < i; ++l) for (d = t[l], f = t[l + 1], u = d; u !== f; ++u) s[p] = l, o[p] = n[u], c[p] = r[u], ++p;
		return [
			o,
			s,
			c
		];
	}, numeric.sdim = function e(t, n, r) {
		if (n === void 0 && (n = []), typeof t != "object") return n;
		for (var i in r === void 0 && (r = 0), r in n || (n[r] = 0), t.length > n[r] && (n[r] = t.length), t) t.hasOwnProperty(i) && e(t[i], n, r + 1);
		return n;
	}, numeric.sclone = function e(t, n, r) {
		n === void 0 && (n = 0), r === void 0 && (r = numeric.sdim(t).length);
		var i, a = Array(t.length);
		if (n === r - 1) {
			for (i in t) t.hasOwnProperty(i) && (a[i] = t[i]);
			return a;
		}
		for (i in t) t.hasOwnProperty(i) && (a[i] = e(t[i], n + 1, r));
		return a;
	}, numeric.sdiag = function(e) {
		var t = e.length, n, r = Array(t), i;
		for (n = t - 1; n >= 1; n -= 2) i = n - 1, r[n] = [], r[n][n] = e[n], r[i] = [], r[i][i] = e[i];
		return n === 0 && (r[0] = [], r[0][0] = e[n]), r;
	}, numeric.sidentity = function(e) {
		return numeric.sdiag(numeric.rep([e], 1));
	}, numeric.stranspose = function(e) {
		var t = [];
		e.length;
		var n, r, i;
		for (n in e) if (e.hasOwnProperty(n)) for (r in i = e[n], i) i.hasOwnProperty(r) && (typeof t[r] != "object" && (t[r] = []), t[r][n] = i[r]);
		return t;
	}, numeric.sLUP = function(e, t) {
		throw Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.");
	}, numeric.sdotMM = function(e, t) {
		var n = e.length;
		t.length;
		var r = numeric.stranspose(t), i = r.length, a, o, s, c, l, u, d = Array(n), f;
		for (s = n - 1; s >= 0; s--) {
			for (f = [], a = e[s], l = i - 1; l >= 0; l--) {
				for (c in u = 0, o = r[l], a) a.hasOwnProperty(c) && c in o && (u += a[c] * o[c]);
				u && (f[l] = u);
			}
			d[s] = f;
		}
		return d;
	}, numeric.sdotMV = function(e, t) {
		var n = e.length, r, i, a, o = Array(n), s;
		for (i = n - 1; i >= 0; i--) {
			for (a in r = e[i], s = 0, r) r.hasOwnProperty(a) && t[a] && (s += r[a] * t[a]);
			s && (o[i] = s);
		}
		return o;
	}, numeric.sdotVM = function(e, t) {
		var n, r, i, a, o = [];
		for (n in e) if (e.hasOwnProperty(n)) for (r in i = t[n], a = e[n], i) i.hasOwnProperty(r) && (o[r] || (o[r] = 0), o[r] += a * i[r]);
		return o;
	}, numeric.sdotVV = function(e, t) {
		var n, r = 0;
		for (n in e) e[n] && t[n] && (r += e[n] * t[n]);
		return r;
	}, numeric.sdot = function(e, t) {
		var n = numeric.sdim(e).length, r = numeric.sdim(t).length;
		switch (n * 1e3 + r) {
			case 0: return e * t;
			case 1001: return numeric.sdotVV(e, t);
			case 2001: return numeric.sdotMV(e, t);
			case 1002: return numeric.sdotVM(e, t);
			case 2002: return numeric.sdotMM(e, t);
			default: throw Error("numeric.sdot not implemented for tensors of order " + n + " and " + r);
		}
	}, numeric.sscatter = function(e) {
		var t = e[0].length, n, r, i, a = e.length, o = [], s;
		for (r = t - 1; r >= 0; --r) if (e[a - 1][r]) {
			for (s = o, i = 0; i < a - 2; i++) n = e[i][r], s[n] || (s[n] = []), s = s[n];
			s[e[i][r]] = e[i + 1][r];
		}
		return o;
	}, numeric.sgather = function e(t, n, r) {
		n === void 0 && (n = []), r === void 0 && (r = []);
		var i = r.length, a, o;
		for (a in t) if (t.hasOwnProperty(a)) if (r[i] = parseInt(a), o = t[a], typeof o == "number") {
			if (o) {
				if (n.length === 0) for (a = i + 1; a >= 0; --a) n[a] = [];
				for (a = i; a >= 0; --a) n[a].push(r[a]);
				n[i + 1].push(o);
			}
		} else e(o, n, r);
		return r.length > i && r.pop(), n;
	}, numeric.cLU = function(e) {
		var t = e[0], n = e[1], r = e[2], i = t.length, a = 0, o, s, c, l, u, d;
		for (o = 0; o < i; o++) t[o] > a && (a = t[o]);
		a++;
		var f = Array(a), p = Array(a), m = numeric.rep([a], Infinity), h = numeric.rep([a], -Infinity), g, _, v;
		for (c = 0; c < i; c++) o = t[c], s = n[c], s < m[o] && (m[o] = s), s > h[o] && (h[o] = s);
		for (o = 0; o < a - 1; o++) h[o] > h[o + 1] && (h[o + 1] = h[o]);
		for (o = a - 1; o >= 1; o--) m[o] < m[o - 1] && (m[o - 1] = m[o]);
		var y = 0, b = 0;
		for (o = 0; o < a; o++) p[o] = numeric.rep([h[o] - m[o] + 1], 0), f[o] = numeric.rep([o - m[o]], 0), y += o - m[o] + 1, b += h[o] - o + 1;
		for (c = 0; c < i; c++) o = t[c], p[o][n[c] - m[o]] = r[c];
		for (o = 0; o < a - 1; o++) for (l = o - m[o], g = p[o], s = o + 1; m[s] <= o && s < a; s++) if (u = o - m[s], d = h[o] - o, _ = p[s], v = _[u] / g[l], v) {
			for (c = 1; c <= d; c++) _[c + u] -= v * g[c + l];
			f[s][o - m[s]] = v;
		}
		var g = [], _ = [], x = [], S = [], w = [], E = [], i = 0, D = 0, O;
		for (o = 0; o < a; o++) {
			for (l = m[o], u = h[o], O = p[o], s = o; s <= u; s++) O[s - l] && (g[i] = o, _[i] = s, x[i] = O[s - l], i++);
			for (O = f[o], s = l; s < o; s++) O[s - l] && (S[D] = o, w[D] = s, E[D] = O[s - l], D++);
			S[D] = o, w[D] = o, E[D] = 1, D++;
		}
		return {
			U: [
				g,
				_,
				x
			],
			L: [
				S,
				w,
				E
			]
		};
	}, numeric.cLUsolve = function(e, t) {
		var n = e.L, r = e.U, i = numeric.clone(t), a = n[0], o = n[1], s = n[2], c = r[0], l = r[1], u = r[2], d = c.length;
		a.length;
		var f = i.length, p, m = 0;
		for (p = 0; p < f; p++) {
			for (; o[m] < p;) i[p] -= s[m] * i[o[m]], m++;
			m++;
		}
		for (m = d - 1, p = f - 1; p >= 0; p--) {
			for (; l[m] > p;) i[p] -= u[m] * i[l[m]], m--;
			i[p] /= u[m], m--;
		}
		return i;
	}, numeric.cgrid = function(e, t) {
		typeof e == "number" && (e = [e, e]);
		var n = numeric.rep(e, -1), r, i, a;
		if (typeof t != "function") switch (t) {
			case "L":
				t = function(t, n) {
					return t >= e[0] / 2 || n < e[1] / 2;
				};
				break;
			default: t = function(e, t) {
				return !0;
			};
		}
		for (a = 0, r = 1; r < e[0] - 1; r++) for (i = 1; i < e[1] - 1; i++) t(r, i) && (n[r][i] = a, a++);
		return n;
	}, numeric.cdelsq = function(e) {
		var t = [
			[-1, 0],
			[0, -1],
			[0, 1],
			[1, 0]
		], n = numeric.dim(e), r = n[0], i = n[1], a, o, s, c, l, u = [], d = [], f = [];
		for (a = 1; a < r - 1; a++) for (o = 1; o < i - 1; o++) if (!(e[a][o] < 0)) {
			for (s = 0; s < 4; s++) c = a + t[s][0], l = o + t[s][1], !(e[c][l] < 0) && (u.push(e[a][o]), d.push(e[c][l]), f.push(-1));
			u.push(e[a][o]), d.push(e[a][o]), f.push(4);
		}
		return [
			u,
			d,
			f
		];
	}, numeric.cdotMV = function(e, t) {
		var n, r = e[0], i = e[1], a = e[2], o, s = r.length, c = 0;
		for (o = 0; o < s; o++) r[o] > c && (c = r[o]);
		for (c++, n = numeric.rep([c], 0), o = 0; o < s; o++) n[r[o]] += a[o] * t[i[o]];
		return n;
	}, numeric.Spline = function(e, t, n, r, i) {
		this.x = e, this.yl = t, this.yr = n, this.kl = r, this.kr = i;
	}, numeric.Spline.prototype._at = function(e, t) {
		var n = this.x, r = this.yl, i = this.yr, a = this.kl, o = this.kr, e, s, c, l, u = numeric.add, d = numeric.sub, f = numeric.mul;
		s = d(f(a[t], n[t + 1] - n[t]), d(i[t + 1], r[t])), c = u(f(o[t + 1], n[t] - n[t + 1]), d(i[t + 1], r[t])), l = (e - n[t]) / (n[t + 1] - n[t]);
		var p = l * (1 - l);
		return u(u(u(f(1 - l, r[t]), f(l, i[t + 1])), f(s, p * (1 - l))), f(c, p * l));
	}, numeric.Spline.prototype.at = function(e) {
		if (typeof e == "number") {
			var t = this.x, n = t.length, r, i, a, o = Math.floor;
			for (r = 0, i = n - 1; i - r > 1;) a = o((r + i) / 2), t[a] <= e ? r = a : i = a;
			return this._at(e, r);
		}
		var n = e.length, s, c = Array(n);
		for (s = n - 1; s !== -1; --s) c[s] = this.at(e[s]);
		return c;
	}, numeric.Spline.prototype.diff = function() {
		var e = this.x, t = this.yl, n = this.yr, r = this.kl, i = this.kr, a = t.length, o, s, c, l = r, u = i, d = Array(a), f = Array(a), p = numeric.add, m = numeric.mul, h = numeric.div, g = numeric.sub;
		for (o = a - 1; o !== -1; --o) s = e[o + 1] - e[o], c = g(n[o + 1], t[o]), d[o] = h(p(m(c, 6), m(r[o], -4 * s), m(i[o + 1], -2 * s)), s * s), f[o + 1] = h(p(m(c, -6), m(r[o], 2 * s), m(i[o + 1], 4 * s)), s * s);
		return new numeric.Spline(e, l, u, d, f);
	}, numeric.Spline.prototype.roots = function() {
		function e(e) {
			return e * e;
		}
		var t = [], n = this.x, r = this.yl, i = this.yr, a = this.kl, o = this.kr;
		typeof r[0] == "number" && (r = [r], i = [i], a = [a], o = [o]);
		var s = r.length, c = n.length - 1, l, u, d, f, p, m, h, t = Array(s), g, _, v, y, b, x, S, w, E, D, O, j, M, N, F, I, L = Math.sqrt;
		for (l = 0; l !== s; ++l) {
			for (f = r[l], p = i[l], m = a[l], h = o[l], g = [], u = 0; u !== c; u++) {
				for (u > 0 && p[u] * f[u] < 0 && g.push(n[u]), E = n[u + 1] - n[u], n[u], y = f[u], b = p[u + 1], _ = m[u] / E, v = h[u + 1] / E, w = e(_ - v + 3 * (y - b)) + 12 * v * y, x = v + 3 * y + 2 * _ - 3 * b, S = 3 * (v + _ + 2 * (y - b)), w <= 0 ? (O = x / S, D = O > n[u] && O < n[u + 1] ? [
					n[u],
					O,
					n[u + 1]
				] : [n[u], n[u + 1]]) : (O = (x - L(w)) / S, j = (x + L(w)) / S, D = [n[u]], O > n[u] && O < n[u + 1] && D.push(O), j > n[u] && j < n[u + 1] && D.push(j), D.push(n[u + 1])), N = D[0], O = this._at(N, u), d = 0; d < D.length - 1; d++) {
					if (F = D[d + 1], j = this._at(F, u), O === 0) {
						g.push(N), N = F, O = j;
						continue;
					}
					if (j === 0 || O * j > 0) {
						N = F, O = j;
						continue;
					}
					for (var R = 0; I = (O * F - j * N) / (O - j), !(I <= N || I >= F);) if (M = this._at(I, u), M * j > 0) F = I, j = M, R === -1 && (O *= .5), R = -1;
					else if (M * O > 0) N = I, O = M, R === 1 && (j *= .5), R = 1;
					else break;
					g.push(I), N = D[d + 1], O = this._at(N, u);
				}
				j === 0 && g.push(F);
			}
			t[l] = g;
		}
		return typeof this.yl[0] == "number" ? t[0] : t;
	}, numeric.spline = function(e, t, n, r) {
		var i = e.length, a = [], o = [], s = [], c, l = numeric.sub, u = numeric.mul, d = numeric.add;
		for (c = i - 2; c >= 0; c--) o[c] = e[c + 1] - e[c], s[c] = l(t[c + 1], t[c]);
		(typeof n == "string" || typeof r == "string") && (n = r = "periodic");
		var f = [
			[],
			[],
			[]
		];
		switch (typeof n) {
			case "undefined":
				a[0] = u(3 / (o[0] * o[0]), s[0]), f[0].push(0, 0), f[1].push(0, 1), f[2].push(2 / o[0], 1 / o[0]);
				break;
			case "string":
				a[0] = d(u(3 / (o[i - 2] * o[i - 2]), s[i - 2]), u(3 / (o[0] * o[0]), s[0])), f[0].push(0, 0, 0), f[1].push(i - 2, 0, 1), f[2].push(1 / o[i - 2], 2 / o[i - 2] + 2 / o[0], 1 / o[0]);
				break;
			default: a[0] = n, f[0].push(0), f[1].push(0), f[2].push(1);
		}
		for (c = 1; c < i - 1; c++) a[c] = d(u(3 / (o[c - 1] * o[c - 1]), s[c - 1]), u(3 / (o[c] * o[c]), s[c])), f[0].push(c, c, c), f[1].push(c - 1, c, c + 1), f[2].push(1 / o[c - 1], 2 / o[c - 1] + 2 / o[c], 1 / o[c]);
		switch (typeof r) {
			case "undefined":
				a[i - 1] = u(3 / (o[i - 2] * o[i - 2]), s[i - 2]), f[0].push(i - 1, i - 1), f[1].push(i - 2, i - 1), f[2].push(1 / o[i - 2], 2 / o[i - 2]);
				break;
			case "string":
				f[1][f[1].length - 1] = 0;
				break;
			default: a[i - 1] = r, f[0].push(i - 1), f[1].push(i - 1), f[2].push(1);
		}
		a = typeof a[0] == "number" ? [a] : numeric.transpose(a);
		var p = Array(a.length);
		if (typeof n == "string") for (c = p.length - 1; c !== -1; --c) p[c] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(f)), a[c]), p[c][i - 1] = p[c][0];
		else for (c = p.length - 1; c !== -1; --c) p[c] = numeric.cLUsolve(numeric.cLU(f), a[c]);
		return p = typeof t[0] == "number" ? p[0] : numeric.transpose(p), new numeric.Spline(e, t, t, p, p);
	}, numeric.fftpow2 = function e(t, n) {
		var r = t.length;
		if (r !== 1) {
			var i = Math.cos, a = Math.sin, o, s, c = Array(r / 2), l = Array(r / 2), u = Array(r / 2), d = Array(r / 2);
			for (s = r / 2, o = r - 1; o !== -1; --o) --s, u[s] = t[o], d[s] = n[o], --o, c[s] = t[o], l[s] = n[o];
			e(c, l), e(u, d), s = r / 2;
			var f, p = -6.283185307179586 / r, m, h;
			for (o = r - 1; o !== -1; --o) --s, s === -1 && (s = r / 2 - 1), f = p * o, m = i(f), h = a(f), t[o] = c[s] + m * u[s] - h * d[s], n[o] = l[s] + m * d[s] + h * u[s];
		}
	}, numeric._ifftpow2 = function e(t, n) {
		var r = t.length;
		if (r !== 1) {
			var i = Math.cos, a = Math.sin, o, s, c = Array(r / 2), l = Array(r / 2), u = Array(r / 2), d = Array(r / 2);
			for (s = r / 2, o = r - 1; o !== -1; --o) --s, u[s] = t[o], d[s] = n[o], --o, c[s] = t[o], l[s] = n[o];
			e(c, l), e(u, d), s = r / 2;
			var f, p = 6.283185307179586 / r, m, h;
			for (o = r - 1; o !== -1; --o) --s, s === -1 && (s = r / 2 - 1), f = p * o, m = i(f), h = a(f), t[o] = c[s] + m * u[s] - h * d[s], n[o] = l[s] + m * d[s] + h * u[s];
		}
	}, numeric.ifftpow2 = function(e, t) {
		numeric._ifftpow2(e, t), numeric.diveq(e, e.length), numeric.diveq(t, t.length);
	}, numeric.convpow2 = function(e, t, n, r) {
		numeric.fftpow2(e, t), numeric.fftpow2(n, r);
		var i, a = e.length, o, s, c, l;
		for (i = a - 1; i !== -1; --i) o = e[i], c = t[i], s = n[i], l = r[i], e[i] = o * s - c * l, t[i] = o * l + c * s;
		numeric.ifftpow2(e, t);
	}, numeric.T.prototype.fft = function() {
		var e = this.x, t = this.y, n = e.length, r = Math.log, i = r(2), a = 2 ** Math.ceil(r(2 * n - 1) / i), o = numeric.rep([a], 0), s = numeric.rep([a], 0), c = Math.cos, l = Math.sin, u, d = -3.141592653589793 / n, f, p = numeric.rep([a], 0), m = numeric.rep([a], 0);
		for (u = 0; u < n; u++) p[u] = e[u];
		if (t !== void 0) for (u = 0; u < n; u++) m[u] = t[u];
		for (o[0] = 1, u = 1; u <= a / 2; u++) f = d * u * u, o[u] = c(f), s[u] = l(f), o[a - u] = c(f), s[a - u] = l(f);
		var h = new numeric.T(p, m), g = new numeric.T(o, s);
		return h = h.mul(g), numeric.convpow2(h.x, h.y, numeric.clone(g.x), numeric.neg(g.y)), h = h.mul(g), h.x.length = n, h.y.length = n, h;
	}, numeric.T.prototype.ifft = function() {
		var e = this.x, t = this.y, n = e.length, r = Math.log, i = r(2), a = 2 ** Math.ceil(r(2 * n - 1) / i), o = numeric.rep([a], 0), s = numeric.rep([a], 0), c = Math.cos, l = Math.sin, u, d = 3.141592653589793 / n, f, p = numeric.rep([a], 0), m = numeric.rep([a], 0);
		for (u = 0; u < n; u++) p[u] = e[u];
		if (t !== void 0) for (u = 0; u < n; u++) m[u] = t[u];
		for (o[0] = 1, u = 1; u <= a / 2; u++) f = d * u * u, o[u] = c(f), s[u] = l(f), o[a - u] = c(f), s[a - u] = l(f);
		var h = new numeric.T(p, m), g = new numeric.T(o, s);
		return h = h.mul(g), numeric.convpow2(h.x, h.y, numeric.clone(g.x), numeric.neg(g.y)), h = h.mul(g), h.x.length = n, h.y.length = n, h.div(n);
	}, numeric.gradient = function(e, t) {
		var n = t.length, r = e(t);
		if (isNaN(r)) throw Error("gradient: f(x) is a NaN!");
		var i = Math.max, a, o = numeric.clone(t), s, c, l = Array(n);
		numeric.div, numeric.sub;
		var u, i = Math.max, d = .001, f = Math.abs, p = Math.min, m, h, g, _ = 0, v, y, b;
		for (a = 0; a < n; a++) for (var x = i(1e-6 * r, 1e-8);;) {
			if (++_, _ > 20) throw Error("Numerical gradient fails");
			if (o[a] = t[a] + x, s = e(o), o[a] = t[a] - x, c = e(o), o[a] = t[a], isNaN(s) || isNaN(c)) {
				x /= 16;
				continue;
			}
			if (l[a] = (s - c) / (2 * x), m = t[a] - x, h = t[a], g = t[a] + x, v = (s - r) / x, y = (r - c) / x, b = i(f(l[a]), f(r), f(s), f(c), f(m), f(h), f(g), 1e-8), u = p(i(f(v - l[a]), f(y - l[a]), f(v - y)) / b, x / b), u > d) x /= 16;
			else break;
		}
		return l;
	}, numeric.uncmin = function(e, t, n, r, i, a, o) {
		var s = numeric.gradient;
		o === void 0 && (o = {}), n === void 0 && (n = 1e-8), r === void 0 && (r = function(t) {
			return s(e, t);
		}), i === void 0 && (i = 1e3), t = numeric.clone(t);
		var c = t.length, l = e(t), u, d;
		if (isNaN(l)) throw Error("uncmin: f(x0) is a NaN!");
		var f = Math.max, p = numeric.norm2;
		n = f(n, numeric.epsilon);
		var m, h, g, _ = o.Hinv || numeric.identity(c), v = numeric.dot;
		numeric.inv;
		var y = numeric.sub, b = numeric.add, x = numeric.tensor, S = numeric.div, w = numeric.mul, E = numeric.all, D = numeric.isFinite, O = numeric.neg, j = 0, M, N, F, I, L, R, H, G = "";
		for (h = r(t); j < i;) {
			if (typeof a == "function" && a(j, t, l, h, _)) {
				G = "Callback returned true";
				break;
			}
			if (!E(D(h))) {
				G = "Gradient has Infinity or NaN";
				break;
			}
			if (m = O(v(_, h)), !E(D(m))) {
				G = "Search direction has Infinity or NaN";
				break;
			}
			if (H = p(m), H < n) {
				G = "Newton step smaller than tol";
				break;
			}
			for (R = 1, d = v(h, m), N = t; j < i && !(R * H < n);) {
				if (M = w(m, R), N = b(t, M), u = e(N), u - l >= .1 * R * d || isNaN(u)) {
					R *= .5, ++j;
					continue;
				}
				break;
			}
			if (R * H < n) {
				G = "Line search step size smaller than tol";
				break;
			}
			if (j === i) {
				G = "maxit reached during line search";
				break;
			}
			g = r(N), F = y(g, h), L = v(F, M), I = v(_, F), _ = y(b(_, w((L + v(F, I)) / (L * L), x(M, M))), S(b(x(I, M), x(M, I)), L)), t = N, l = u, h = g, ++j;
		}
		return {
			solution: t,
			f: l,
			gradient: h,
			invHessian: _,
			iterations: j,
			message: G
		};
	}, numeric.Dopri = function(e, t, n, r, i, a, o) {
		this.x = e, this.y = t, this.f = n, this.ymid = r, this.iterations = i, this.events = o, this.message = a;
	}, numeric.Dopri.prototype._at = function(e, t) {
		function n(e) {
			return e * e;
		}
		var r = this, i = r.x, a = r.y, o = r.f, s = r.ymid;
		i.length;
		var c, l, u, d, f, p, e, m, h = .5, g = numeric.add, _ = numeric.mul, v = numeric.sub, y, b, x;
		return c = i[t], l = i[t + 1], d = a[t], f = a[t + 1], m = l - c, u = c + h * m, p = s[t], y = v(o[t], _(d, 1 / (c - u) + 2 / (c - l))), b = v(o[t + 1], _(f, 1 / (l - u) + 2 / (l - c))), x = [
			n(e - l) * (e - u) / n(c - l) / (c - u),
			n(e - c) * n(e - l) / n(c - u) / n(l - u),
			n(e - c) * (e - u) / n(l - c) / (l - u),
			(e - c) * n(e - l) * (e - u) / n(c - l) / (c - u),
			(e - l) * n(e - c) * (e - u) / n(c - l) / (l - u)
		], g(g(g(g(_(d, x[0]), _(p, x[1])), _(f, x[2])), _(y, x[3])), _(b, x[4]));
	}, numeric.Dopri.prototype.at = function(e) {
		var t, n, r, i = Math.floor;
		if (typeof e != "number") {
			var a = e.length, o = Array(a);
			for (t = a - 1; t !== -1; --t) o[t] = this.at(e[t]);
			return o;
		}
		var s = this.x;
		for (t = 0, n = s.length - 1; n - t > 1;) r = i(.5 * (t + n)), s[r] <= e ? t = r : n = r;
		return this._at(e, t);
	}, numeric.dopri = function(e, t, n, r, i, a, o) {
		i === void 0 && (i = 1e-6), a === void 0 && (a = 1e3);
		var s = [e], c = [n], l = [r(e, n)], u, d, f, p, m, h, g = [], _ = 1 / 5, v = [3 / 40, 9 / 40], y = [
			44 / 45,
			-56 / 15,
			32 / 9
		], b = [
			19372 / 6561,
			-25360 / 2187,
			64448 / 6561,
			-212 / 729
		], x = [
			9017 / 3168,
			-355 / 33,
			46732 / 5247,
			49 / 176,
			-5103 / 18656
		], S = [
			35 / 384,
			0,
			500 / 1113,
			125 / 192,
			-2187 / 6784,
			11 / 84
		], w = [
			3012596371.5 / 30085553152,
			0,
			25626146462.5 / 65400821598,
			-1345934462.5 / 45128329728,
			93970186033.5 / 1594534317056,
			-888047165.5 / 19743644256,
			5618549.5 / 235043384
		], E = [
			1 / 5,
			3 / 10,
			4 / 5,
			8 / 9,
			1,
			1
		], D = [
			-71 / 57600,
			0,
			71 / 16695,
			-71 / 1920,
			17253 / 339200,
			-22 / 525,
			1 / 40
		], O = 0, j, M, N = (t - e) / 10, F = 0, I = numeric.add, L = numeric.mul, R, H, G = Math.min, K = Math.abs, q = numeric.norminf, J = Math.pow, ee = numeric.any, Y = numeric.lt, te = numeric.and;
		numeric.sub;
		var X, Z, ne, Q = new numeric.Dopri(s, c, l, g, -1, "");
		for (typeof o == "function" && (X = o(e, n)); e < t && F < a;) {
			if (++F, e + N > t && (N = t - e), u = r(e + E[0] * N, I(n, L(_ * N, l[O]))), d = r(e + E[1] * N, I(I(n, L(v[0] * N, l[O])), L(v[1] * N, u))), f = r(e + E[2] * N, I(I(I(n, L(y[0] * N, l[O])), L(y[1] * N, u)), L(y[2] * N, d))), p = r(e + E[3] * N, I(I(I(I(n, L(b[0] * N, l[O])), L(b[1] * N, u)), L(b[2] * N, d)), L(b[3] * N, f))), m = r(e + E[4] * N, I(I(I(I(I(n, L(x[0] * N, l[O])), L(x[1] * N, u)), L(x[2] * N, d)), L(x[3] * N, f)), L(x[4] * N, p))), R = I(I(I(I(I(n, L(l[O], N * S[0])), L(d, N * S[2])), L(f, N * S[3])), L(p, N * S[4])), L(m, N * S[5])), h = r(e + N, R), j = I(I(I(I(I(L(l[O], N * D[0]), L(d, N * D[2])), L(f, N * D[3])), L(p, N * D[4])), L(m, N * D[5])), L(h, N * D[6])), H = typeof j == "number" ? K(j) : q(j), H > i) {
				if (N = .2 * N * J(i / H, .25), e + N === e) {
					Q.msg = "Step size became too small";
					break;
				}
				continue;
			}
			if (g[O] = I(I(I(I(I(I(n, L(l[O], N * w[0])), L(d, N * w[2])), L(f, N * w[3])), L(p, N * w[4])), L(m, N * w[5])), L(h, N * w[6])), ++O, s[O] = e + N, c[O] = R, l[O] = h, typeof o == "function") {
				var re, ie = e, ae = e + .5 * N, $;
				if (Z = o(ae, g[O - 1]), ne = te(Y(X, 0), Y(0, Z)), ee(ne) || (ie = ae, ae = e + N, X = Z, Z = o(ae, R), ne = te(Y(X, 0), Y(0, Z))), ee(ne)) {
					for (var oe, se, ce = 0, le = 1, ue = 1;;) {
						if (typeof X == "number") $ = (ue * Z * ie - le * X * ae) / (ue * Z - le * X);
						else for ($ = ae, M = X.length - 1; M !== -1; --M) X[M] < 0 && Z[M] > 0 && ($ = G($, (ue * Z[M] * ie - le * X[M] * ae) / (ue * Z[M] - le * X[M])));
						if ($ <= ie || $ >= ae) break;
						re = Q._at($, O - 1), se = o($, re), oe = te(Y(X, 0), Y(0, se)), ee(oe) ? (ae = $, Z = se, ne = oe, ue = 1, ce === -1 ? le *= .5 : le = 1, ce = -1) : (ie = $, X = se, le = 1, ce === 1 ? ue *= .5 : ue = 1, ce = 1);
					}
					return R = Q._at(.5 * (e + $), O - 1), Q.f[O] = r($, re), Q.x[O] = $, Q.y[O] = re, Q.ymid[O - 1] = R, Q.events = ne, Q.iterations = F, Q;
				}
			}
			e += N, n = R, X = Z, N = G(.8 * N * J(i / H, .25), 4 * N);
		}
		return Q.iterations = F, Q;
	}, numeric.LU = function(e, t) {
		t ||= !1;
		var n = Math.abs, r, i, a, o, s, c, l, u, d, f = e.length, p = f - 1, m = Array(f);
		for (t || (e = numeric.clone(e)), a = 0; a < f; ++a) {
			for (l = a, c = e[a], d = n(c[a]), i = a + 1; i < f; ++i) o = n(e[i][a]), d < o && (d = o, l = i);
			for (m[a] = l, l != a && (e[a] = e[l], e[l] = c, c = e[a]), s = c[a], r = a + 1; r < f; ++r) e[r][a] /= s;
			for (r = a + 1; r < f; ++r) {
				for (u = e[r], i = a + 1; i < p; ++i) u[i] -= u[a] * c[i], ++i, u[i] -= u[a] * c[i];
				i === p && (u[i] -= u[a] * c[i]);
			}
		}
		return {
			LU: e,
			P: m
		};
	}, numeric.LUsolve = function(e, t) {
		var n, r, i = e.LU, a = i.length, o = numeric.clone(t), s = e.P, c, l, u;
		for (n = a - 1; n !== -1; --n) o[n] = t[n];
		for (n = 0; n < a; ++n) for (c = s[n], s[n] !== n && (u = o[n], o[n] = o[c], o[c] = u), l = i[n], r = 0; r < n; ++r) o[n] -= o[r] * l[r];
		for (n = a - 1; n >= 0; --n) {
			for (l = i[n], r = n + 1; r < a; ++r) o[n] -= o[r] * l[r];
			o[n] /= l[n];
		}
		return o;
	}, numeric.solve = function(e, t, n) {
		return numeric.LUsolve(numeric.LU(e, n), t);
	}, numeric.echelonize = function(e) {
		var t = numeric.dim(e), n = t[0], r = t[1], i = numeric.identity(n), a = Array(n), o, s, c, l, u, d, f, p, m = Math.abs, h = numeric.diveq;
		for (e = numeric.clone(e), o = 0; o < n; ++o) {
			for (c = 0, u = e[o], d = i[o], s = 1; s < r; ++s) m(u[c]) < m(u[s]) && (c = s);
			for (a[o] = c, h(d, u[c]), h(u, u[c]), s = 0; s < n; ++s) if (s !== o) {
				for (f = e[s], p = f[c], l = r - 1; l !== -1; --l) f[l] -= u[l] * p;
				for (f = i[s], l = n - 1; l !== -1; --l) f[l] -= d[l] * p;
			}
		}
		return {
			I: i,
			A: e,
			P: a
		};
	}, numeric.__solveLP = function(e, t, n, r, i, a, o) {
		var s = numeric.sum;
		numeric.log;
		var c = numeric.mul, l = numeric.sub, u = numeric.dot, d = numeric.div, f = numeric.add, p = e.length, m = n.length, h, g = !1, _ = 0, v = 1;
		numeric.transpose(t), numeric.svd;
		var y = numeric.transpose;
		numeric.leq;
		var b = Math.sqrt, x = Math.abs;
		numeric.muleq, numeric.norminf, numeric.any;
		var S = Math.min, w = numeric.all, E = numeric.gt, D = Array(p), O = Array(m);
		numeric.rep([m], 1);
		var j, M = numeric.solve, N = l(n, u(t, a)), F, I = u(e, e), L;
		for (F = _; F < i; ++F) {
			var R, H;
			for (R = m - 1; R !== -1; --R) O[R] = d(t[R], N[R]);
			var G = y(O);
			for (R = p - 1; R !== -1; --R) D[R] = s(G[R]);
			v = .25 * x(I / u(e, D));
			var K = 100 * b(I / u(D, D));
			for ((!isFinite(v) || v > K) && (v = K), L = f(e, c(v, D)), j = u(G, O), R = p - 1; R !== -1; --R) j[R][R] += 1;
			H = M(j, d(L, v), !0);
			var q = d(N, u(t, H)), J = 1;
			for (R = m - 1; R !== -1; --R) q[R] < 0 && (J = S(J, -.999 * q[R]));
			if (h = l(a, c(H, J)), N = l(n, u(t, h)), !w(E(N, 0))) return {
				solution: a,
				message: "",
				iterations: F
			};
			if (a = h, v < r) return {
				solution: h,
				message: "",
				iterations: F
			};
			if (o) {
				var ee = u(e, L), Y = u(t, L);
				for (g = !0, R = m - 1; R !== -1; --R) if (ee * Y[R] < 0) {
					g = !1;
					break;
				}
			} else g = !(a[p - 1] >= 0);
			if (g) return {
				solution: h,
				message: "Unbounded",
				iterations: F
			};
		}
		return {
			solution: a,
			message: "maximum iteration count exceeded",
			iterations: F
		};
	}, numeric._solveLP = function(e, t, n, r, i) {
		var a = e.length, o = n.length, s;
		numeric.sum, numeric.log, numeric.mul;
		var c = numeric.sub, l = numeric.dot;
		numeric.div, numeric.add;
		var u = numeric.rep([a], 0).concat([1]), d = numeric.rep([o, 1], -1), f = numeric.blockMatrix([[t, d]]), p = n, s = numeric.rep([a], 0).concat(Math.max(0, numeric.sup(numeric.neg(n))) + 1), m = numeric.__solveLP(u, f, p, r, i, s, !1), h = numeric.clone(m.solution);
		if (h.length = a, numeric.inf(c(n, l(t, h))) < 0) return {
			solution: NaN,
			message: "Infeasible",
			iterations: m.iterations
		};
		var g = numeric.__solveLP(e, t, n, r, i - m.iterations, h, !0);
		return g.iterations += m.iterations, g;
	}, numeric.solveLP = function(e, t, n, r, i, a, o) {
		if (o === void 0 && (o = 1e3), a === void 0 && (a = numeric.epsilon), r === void 0) return numeric._solveLP(e, t, n, a, o);
		var s = r.length, c = r[0].length, l = t.length, u = numeric.echelonize(r), d = numeric.rep([c], 0), f = u.P, p = [], m;
		for (m = f.length - 1; m !== -1; --m) d[f[m]] = 1;
		for (m = c - 1; m !== -1; --m) d[m] === 0 && p.push(m);
		var h = numeric.getRange, g = numeric.linspace(0, s - 1), _ = numeric.linspace(0, l - 1), v = h(r, g, p), y = h(t, _, f), b = h(t, _, p), x = numeric.dot, S = numeric.sub, w = x(y, u.I), E = S(b, x(w, v)), D = S(n, x(w, i)), O = Array(f.length), j = Array(p.length);
		for (m = f.length - 1; m !== -1; --m) O[m] = e[f[m]];
		for (m = p.length - 1; m !== -1; --m) j[m] = e[p[m]];
		var M = S(j, x(O, x(u.I, v))), N = numeric._solveLP(M, E, D, a, o), F = N.solution;
		if (F !== F) return N;
		var I = x(u.I, S(i, x(v, F))), L = Array(e.length);
		for (m = f.length - 1; m !== -1; --m) L[f[m]] = I[m];
		for (m = p.length - 1; m !== -1; --m) L[p[m]] = F[m];
		return {
			solution: L,
			message: N.message,
			iterations: N.iterations
		};
	}, numeric.MPStoLP = function(e) {
		e instanceof String && e.split("\n");
		var t = 0, n = [
			"Initial state",
			"NAME",
			"ROWS",
			"COLUMNS",
			"RHS",
			"BOUNDS",
			"ENDATA"
		], r = e.length, i, a, o, s = 0, c = {}, l = [], u = 0, d = {}, f = 0, p, m = [], h = [], g = [];
		function _(r) {
			throw Error("MPStoLP: " + r + "\nLine " + i + ": " + e[i] + "\nCurrent state: " + n[t] + "\n");
		}
		for (i = 0; i < r; ++i) {
			o = e[i];
			var v = o.match(/\S*/g), y = [];
			for (a = 0; a < v.length; ++a) v[a] !== "" && y.push(v[a]);
			if (y.length !== 0) {
				for (a = 0; a < n.length && o.substr(0, n[a].length) !== n[a]; ++a);
				if (a < n.length) {
					if (t = a, a === 1 && (p = y[1]), a === 6) return {
						name: p,
						c: m,
						A: numeric.transpose(h),
						b: g,
						rows: c,
						vars: d
					};
					continue;
				}
				switch (t) {
					case 0:
					case 1: _("Unexpected line");
					case 2:
						switch (y[0]) {
							case "N":
								s === 0 ? s = y[1] : _("Two or more N rows");
								break;
							case "L":
								c[y[1]] = u, l[u] = 1, g[u] = 0, ++u;
								break;
							case "G":
								c[y[1]] = u, l[u] = -1, g[u] = 0, ++u;
								break;
							case "E":
								c[y[1]] = u, l[u] = 0, g[u] = 0, ++u;
								break;
							default: _("Parse error " + numeric.prettyPrint(y));
						}
						break;
					case 3:
						d.hasOwnProperty(y[0]) || (d[y[0]] = f, m[f] = 0, h[f] = numeric.rep([u], 0), ++f);
						var b = d[y[0]];
						for (a = 1; a < y.length; a += 2) {
							if (y[a] === s) {
								m[b] = parseFloat(y[a + 1]);
								continue;
							}
							var x = c[y[a]];
							h[b][x] = (l[x] < 0 ? -1 : 1) * parseFloat(y[a + 1]);
						}
						break;
					case 4:
						for (a = 1; a < y.length; a += 2) g[c[y[a]]] = (l[c[y[a]]] < 0 ? -1 : 1) * parseFloat(y[a + 1]);
						break;
					case 5: break;
					case 6: _("Internal error");
				}
			}
		}
		_("Reached end of file without ENDATA");
	}, numeric.seedrandom = {
		pow: Math.pow,
		random: Math.random
	}, (function(e, t, n, r, i, a, o) {
		t.seedrandom = function(u, d) {
			var f = [], p;
			return u = l(c(d ? [u, e] : arguments.length ? u : [
				(/* @__PURE__ */ new Date()).getTime(),
				e,
				window
			], 3), f), p = new s(f), l(p.S, e), t.random = function() {
				for (var e = p.g(r), t = o, s = 0; e < i;) e = (e + s) * n, t *= n, s = p.g(1);
				for (; e >= a;) e /= 2, t /= 2, s >>>= 1;
				return (e + s) / t;
			}, u;
		};
		function s(e) {
			var t, r, i = this, a = e.length, o = 0, s = i.i = i.j = i.m = 0;
			for (i.S = [], i.c = [], a || (e = [a++]); o < n;) i.S[o] = o++;
			for (o = 0; o < n; o++) t = i.S[o], s = u(s + t + e[o % a]), r = i.S[s], i.S[o] = r, i.S[s] = t;
			i.g = function(e) {
				var t = i.S, r = u(i.i + 1), a = t[r], o = u(i.j + a), s = t[o];
				t[r] = s, t[o] = a;
				for (var c = t[u(a + s)]; --e;) r = u(r + 1), a = t[r], o = u(o + a), s = t[o], t[r] = s, t[o] = a, c = c * n + t[u(a + s)];
				return i.i = r, i.j = o, c;
			}, i.g(n);
		}
		function c(e, t, n, r, i) {
			if (n = [], i = typeof e, t && i == "object") {
				for (r in e) if (r.indexOf("S") < 5) try {
					n.push(c(e[r], t - 1));
				} catch {}
			}
			return n.length ? n : e + (i == "string" ? "" : "\0");
		}
		function l(e, t, n, r) {
			for (e += "", n = 0, r = 0; r < e.length; r++) t[u(r)] = u((n ^= t[u(r)] * 19) + e.charCodeAt(r));
			for (r in e = "", t) e += String.fromCharCode(t[r]);
			return e;
		}
		function u(e) {
			return e & n - 1;
		}
		o = t.pow(n, r), i = t.pow(2, i), a = i * 2, l(t.random(), e);
	})([], numeric.seedrandom, 256, 6, 52), (function(e) {
		function t(e) {
			if (typeof e != "object") return e;
			var n = [], r, i = e.length;
			for (r = 0; r < i; r++) n[r + 1] = t(e[r]);
			return n;
		}
		function n(e) {
			if (typeof e != "object") return e;
			var t = [], r, i = e.length;
			for (r = 1; r < i; r++) t[r - 1] = n(e[r]);
			return t;
		}
		function r(e, t, n) {
			var r, i, a, o, s;
			for (a = 1; a <= n; a += 1) {
				for (e[a][a] = 1 / e[a][a], s = -e[a][a], r = 1; r < a; r += 1) e[r][a] = s * e[r][a];
				if (o = a + 1, n < o) break;
				for (i = o; i <= n; i += 1) for (s = e[a][i], e[a][i] = 0, r = 1; r <= a; r += 1) e[r][i] = e[r][i] + s * e[r][a];
			}
		}
		function i(e, t, n, r) {
			var i, a, o, s;
			for (a = 1; a <= n; a += 1) {
				for (s = 0, i = 1; i < a; i += 1) s += e[i][a] * r[i];
				r[a] = (r[a] - s) / e[a][a];
			}
			for (o = 1; o <= n; o += 1) for (a = n + 1 - o, r[a] = r[a] / e[a][a], s = -r[a], i = 1; i < a; i += 1) r[i] = r[i] + s * e[i][a];
		}
		function a(e, t, n, r) {
			var i, a, o, s, c, l;
			for (a = 1; a <= n; a += 1) {
				if (r[1] = a, l = 0, o = a - 1, o < 1) {
					if (l = e[a][a] - l, l <= 0) break;
					e[a][a] = Math.sqrt(l);
				} else {
					for (s = 1; s <= o; s += 1) {
						for (c = e[s][a], i = 1; i < s; i += 1) c -= e[i][a] * e[i][s];
						c /= e[s][s], e[s][a] = c, l += c * c;
					}
					if (l = e[a][a] - l, l <= 0) break;
					e[a][a] = Math.sqrt(l);
				}
				r[1] = 0;
			}
		}
		function o(e, t, n, o, s, c, l, u, d, f, p, m, h, g, _, v) {
			var y, b, x, S, w, E, D, O, j, M, N, F, I = Math.min(o, f), L, R, H, G, K, q, J, ee, Y, te, X, Z, ne, Q;
			x = 2 * o + I * (I + 5) / 2 + 2 * f + 1, X = 1e-60;
			do
				X += X, Z = 1 + .1 * X, ne = 1 + .2 * X;
			while (Z <= 1 || ne <= 1);
			for (y = 1; y <= o; y += 1) _[y] = t[y];
			for (y = o + 1; y <= x; y += 1) _[y] = 0;
			for (y = 1; y <= f; y += 1) m[y] = 0;
			if (w = [], v[1] === 0) {
				if (a(e, n, o, w), w[1] !== 0) {
					v[1] = 2;
					return;
				}
				i(e, n, o, t), r(e, n, o);
			} else {
				for (b = 1; b <= o; b += 1) for (s[b] = 0, y = 1; y <= b; y += 1) s[b] = s[b] + e[y][b] * t[y];
				for (b = 1; b <= o; b += 1) for (t[b] = 0, y = b; y <= o; y += 1) t[b] = t[b] + e[b][y] * s[y];
			}
			for (c[1] = 0, b = 1; b <= o; b += 1) for (s[b] = t[b], c[1] += _[b] * s[b], _[b] = 0, y = b + 1; y <= o; y += 1) e[y][b] = 0;
			for (c[1] = -c[1] / 2, v[1] = 0, D = o, O = D + o, N = O + I, j = N + I + 1, M = j + I * (I + 1) / 2, L = M + f, y = 1; y <= f; y += 1) {
				for (H = 0, b = 1; b <= o; b += 1) H += l[b][y] * l[b][y];
				_[L + y] = Math.sqrt(H);
			}
			h = 0, g[1] = 0, g[2] = 0;
			function re() {
				for (g[1] += 1, x = M, y = 1; y <= f; y += 1) {
					for (x += 1, H = -u[y], b = 1; b <= o; b += 1) H += l[b][y] * s[b];
					if (Math.abs(H) < X && (H = 0), y > p) _[x] = H;
					else if (_[x] = -Math.abs(H), H > 0) {
						for (b = 1; b <= o; b += 1) l[b][y] = -l[b][y];
						u[y] = -u[y];
					}
				}
				for (y = 1; y <= h; y += 1) _[M + m[y]] = 0;
				for (F = 0, R = 0, y = 1; y <= f; y += 1) _[M + y] < R * _[L + y] && (F = y, R = _[M + y] / _[L + y]);
				return F === 0 ? 999 : 0;
			}
			function ie() {
				for (y = 1; y <= o; y += 1) {
					for (H = 0, b = 1; b <= o; b += 1) H += e[b][y] * l[b][F];
					_[y] = H;
				}
				for (S = D, y = 1; y <= o; y += 1) _[S + y] = 0;
				for (b = h + 1; b <= o; b += 1) for (y = 1; y <= o; y += 1) _[S + y] = _[S + y] + e[y][b] * _[b];
				for (Y = !0, y = h; y >= 1; --y) {
					for (H = _[y], x = j + y * (y + 3) / 2, S = x - y, b = y + 1; b <= h; b += 1) H -= _[x] * _[O + b], x += b;
					if (H /= _[S], _[O + y] = H, m[y] < p || H < 0) break;
					Y = !1, E = y;
				}
				if (!Y) for (G = _[N + E] / _[O + E], y = 1; y <= h && !(m[y] < p || _[O + y] < 0); y += 1) R = _[N + y] / _[O + y], R < G && (G = R, E = y);
				for (H = 0, y = D + 1; y <= D + o; y += 1) H += _[y] * _[y];
				if (Math.abs(H) <= X) {
					if (Y) return v[1] = 1, 999;
					for (y = 1; y <= h; y += 1) _[N + y] = _[N + y] - G * _[O + y];
					return _[N + h + 1] = _[N + h + 1] + G, 700;
				}
				for (H = 0, y = 1; y <= o; y += 1) H += _[D + y] * l[y][F];
				for (K = -_[M + F] / H, te = !0, Y || G < K && (K = G, te = !1), y = 1; y <= o; y += 1) s[y] = s[y] + K * _[D + y], Math.abs(s[y]) < X && (s[y] = 0);
				for (c[1] += K * H * (K / 2 + _[N + h + 1]), y = 1; y <= h; y += 1) _[N + y] = _[N + y] - K * _[O + y];
				if (_[N + h + 1] = _[N + h + 1] + K, te) {
					for (h += 1, m[h] = F, x = j + (h - 1) * h / 2 + 1, y = 1; y <= h - 1; y += 1) _[x] = _[y], x += 1;
					if (h === o) _[x] = _[o];
					else {
						for (y = o; y >= h + 1 && !(_[y] === 0 || (q = Math.max(Math.abs(_[y - 1]), Math.abs(_[y])), J = Math.min(Math.abs(_[y - 1]), Math.abs(_[y])), R = _[y - 1] >= 0 ? Math.abs(q * Math.sqrt(1 + J * J / (q * q))) : -Math.abs(q * Math.sqrt(1 + J * J / (q * q))), q = _[y - 1] / R, J = _[y] / R, q === 1)); --y) if (q === 0) for (_[y - 1] = J * R, b = 1; b <= o; b += 1) R = e[b][y - 1], e[b][y - 1] = e[b][y], e[b][y] = R;
						else for (_[y - 1] = R, ee = J / (1 + q), b = 1; b <= o; b += 1) R = q * e[b][y - 1] + J * e[b][y], e[b][y] = ee * (e[b][y - 1] + R) - e[b][y], e[b][y - 1] = R;
						_[x] = _[h];
					}
				} else {
					for (H = -u[F], b = 1; b <= o; b += 1) H += s[b] * l[b][F];
					if (F > p) _[M + F] = H;
					else if (_[M + F] = -Math.abs(H), H > 0) {
						for (b = 1; b <= o; b += 1) l[b][F] = -l[b][F];
						u[F] = -u[F];
					}
					return 700;
				}
				return 0;
			}
			function ae() {
				if (x = j + E * (E + 1) / 2 + 1, S = x + E, _[S] === 0 || (q = Math.max(Math.abs(_[S - 1]), Math.abs(_[S])), J = Math.min(Math.abs(_[S - 1]), Math.abs(_[S])), R = _[S - 1] >= 0 ? Math.abs(q * Math.sqrt(1 + J * J / (q * q))) : -Math.abs(q * Math.sqrt(1 + J * J / (q * q))), q = _[S - 1] / R, J = _[S] / R, q === 1)) return 798;
				if (q === 0) {
					for (y = E + 1; y <= h; y += 1) R = _[S - 1], _[S - 1] = _[S], _[S] = R, S += y;
					for (y = 1; y <= o; y += 1) R = e[y][E], e[y][E] = e[y][E + 1], e[y][E + 1] = R;
				} else {
					for (ee = J / (1 + q), y = E + 1; y <= h; y += 1) R = q * _[S - 1] + J * _[S], _[S] = ee * (_[S - 1] + R) - _[S], _[S - 1] = R, S += y;
					for (y = 1; y <= o; y += 1) R = q * e[y][E] + J * e[y][E + 1], e[y][E + 1] = ee * (e[y][E] + R) - e[y][E + 1], e[y][E] = R;
				}
				return 0;
			}
			function $() {
				for (S = x - E, y = 1; y <= E; y += 1) _[S] = _[x], x += 1, S += 1;
				return _[N + E] = _[N + E + 1], m[E] = m[E + 1], E += 1, E < h ? 797 : 0;
			}
			function oe() {
				return _[N + h] = _[N + h + 1], _[N + h + 1] = 0, m[h] = 0, --h, g[2] += 1, 0;
			}
			for (Q = 0;;) {
				if (Q = re(), Q === 999) return;
				for (; Q = ie(), Q !== 0;) {
					if (Q === 999) return;
					if (Q === 700) if (E === h) oe();
					else {
						for (; ae(), Q = $(), Q === 797;);
						oe();
					}
				}
			}
		}
		function s(e, r, i, a, s, c) {
			e = t(e), r = t(r), i = t(i);
			var l, u, d, f, p, m = [], h = [], g = [], _ = [], v = [], y;
			if (s ||= 0, c = c ? t(c) : [void 0, 0], a = a ? t(a) : [], u = e.length - 1, d = i[1].length - 1, !a) for (l = 1; l <= d; l += 1) a[l] = 0;
			for (l = 1; l <= d; l += 1) h[l] = 0;
			for (f = 0, p = Math.min(u, d), l = 1; l <= u; l += 1) g[l] = 0;
			for (m[1] = 0, l = 1; l <= 2 * u + p * (p + 5) / 2 + 2 * d + 1; l += 1) _[l] = 0;
			for (l = 1; l <= 2; l += 1) v[l] = 0;
			return o(e, r, u, u, g, m, i, a, u, d, s, h, f, v, _, c), y = "", c[1] === 1 && (y = "constraints are inconsistent, no solution!"), c[1] === 2 && (y = "matrix D in quadratic function is not positive definite!"), {
				solution: n(g),
				value: n(m),
				unconstrained_solution: n(r),
				iterations: n(v),
				iact: n(h),
				message: y
			};
		}
		e.solveQP = s;
	})(numeric), numeric.svd = function(e) {
		var t, n = numeric.epsilon, r = 1e-64 / n, i = 50, a = 0, o = 0, s = 0, c = 0, l = 0, u = numeric.clone(e), d = u.length, f = u[0].length;
		if (d < f) throw "Need more rows than columns";
		var p = Array(f), m = Array(f);
		for (o = 0; o < f; o++) p[o] = m[o] = 0;
		var h = numeric.rep([f, f], 0);
		function g(e, t) {
			return e = Math.abs(e), t = Math.abs(t), e > t ? e * Math.sqrt(1 + t * t / e / e) : t == 0 ? e : t * Math.sqrt(1 + e * e / t / t);
		}
		var _ = 0, v = 0, y = 0, b = 0, x = 0, S = 0, w = 0;
		for (o = 0; o < f; o++) {
			for (p[o] = v, w = 0, l = o + 1, s = o; s < d; s++) w += u[s][o] * u[s][o];
			if (w <= r) v = 0;
			else for (_ = u[o][o], v = Math.sqrt(w), _ >= 0 && (v = -v), y = _ * v - w, u[o][o] = _ - v, s = l; s < f; s++) {
				for (w = 0, c = o; c < d; c++) w += u[c][o] * u[c][s];
				for (_ = w / y, c = o; c < d; c++) u[c][s] += _ * u[c][o];
			}
			for (m[o] = v, w = 0, s = l; s < f; s++) w += u[o][s] * u[o][s];
			if (w <= r) v = 0;
			else {
				for (_ = u[o][o + 1], v = Math.sqrt(w), _ >= 0 && (v = -v), y = _ * v - w, u[o][o + 1] = _ - v, s = l; s < f; s++) p[s] = u[o][s] / y;
				for (s = l; s < d; s++) {
					for (w = 0, c = l; c < f; c++) w += u[s][c] * u[o][c];
					for (c = l; c < f; c++) u[s][c] += w * p[c];
				}
			}
			x = Math.abs(m[o]) + Math.abs(p[o]), x > b && (b = x);
		}
		for (o = f - 1; o != -1; o += -1) {
			if (v != 0) {
				for (y = v * u[o][o + 1], s = l; s < f; s++) h[s][o] = u[o][s] / y;
				for (s = l; s < f; s++) {
					for (w = 0, c = l; c < f; c++) w += u[o][c] * h[c][s];
					for (c = l; c < f; c++) h[c][s] += w * h[c][o];
				}
			}
			for (s = l; s < f; s++) h[o][s] = 0, h[s][o] = 0;
			h[o][o] = 1, v = p[o], l = o;
		}
		for (o = f - 1; o != -1; o += -1) {
			for (l = o + 1, v = m[o], s = l; s < f; s++) u[o][s] = 0;
			if (v != 0) {
				for (y = u[o][o] * v, s = l; s < f; s++) {
					for (w = 0, c = l; c < d; c++) w += u[c][o] * u[c][s];
					for (_ = w / y, c = o; c < d; c++) u[c][s] += _ * u[c][o];
				}
				for (s = o; s < d; s++) u[s][o] = u[s][o] / v;
			} else for (s = o; s < d; s++) u[s][o] = 0;
			u[o][o] += 1;
		}
		for (n *= b, c = f - 1; c != -1; c += -1) for (var E = 0; E < i; E++) {
			var D = !1;
			for (l = c; l != -1; l += -1) {
				if (Math.abs(p[l]) <= n) {
					D = !0;
					break;
				}
				if (Math.abs(m[l - 1]) <= n) break;
			}
			if (!D) {
				a = 0, w = 1;
				var O = l - 1;
				for (o = l; o < c + 1 && (_ = w * p[o], p[o] = a * p[o], !(Math.abs(_) <= n)); o++) for (v = m[o], y = g(_, v), m[o] = y, a = v / y, w = -_ / y, s = 0; s < d; s++) x = u[s][O], S = u[s][o], u[s][O] = x * a + S * w, u[s][o] = -x * w + S * a;
			}
			if (S = m[c], l == c) {
				if (S < 0) for (m[c] = -S, s = 0; s < f; s++) h[s][c] = -h[s][c];
				break;
			}
			if (E >= i - 1) throw "Error: no convergence.";
			for (b = m[l], x = m[c - 1], v = p[c - 1], y = p[c], _ = ((x - S) * (x + S) + (v - y) * (v + y)) / (2 * y * x), v = g(_, 1), _ = _ < 0 ? ((b - S) * (b + S) + y * (x / (_ - v) - y)) / b : ((b - S) * (b + S) + y * (x / (_ + v) - y)) / b, a = 1, w = 1, o = l + 1; o < c + 1; o++) {
				for (v = p[o], x = m[o], y = w * v, v = a * v, S = g(_, y), p[o - 1] = S, a = _ / S, w = y / S, _ = b * a + v * w, v = -b * w + v * a, y = x * w, x *= a, s = 0; s < f; s++) b = h[s][o - 1], S = h[s][o], h[s][o - 1] = b * a + S * w, h[s][o] = -b * w + S * a;
				for (S = g(_, y), m[o - 1] = S, a = _ / S, w = y / S, _ = a * v + w * x, b = -w * v + a * x, s = 0; s < d; s++) x = u[s][o - 1], S = u[s][o], u[s][o - 1] = x * a + S * w, u[s][o] = -x * w + S * a;
			}
			p[l] = 0, p[c] = _, m[c] = b;
		}
		for (o = 0; o < m.length; o++) m[o] < n && (m[o] = 0);
		for (o = 0; o < f; o++) for (s = o - 1; s >= 0; s--) if (m[s] < m[o]) {
			for (a = m[s], m[s] = m[o], m[o] = a, c = 0; c < u.length; c++) t = u[c][o], u[c][o] = u[c][s], u[c][s] = t;
			for (c = 0; c < h.length; c++) t = h[c][o], h[c][o] = h[c][s], h[c][s] = t;
			o = s;
		}
		return {
			U: u,
			S: m,
			V: h
		};
	};
})(numeric1_2_6);
var numeric$1 = numeric1_2_6, forwardSHT = function(e, t, n, r) {
	var i = t.length, a = (e + 1) * (e + 1), o, s = [,];
	a > i && console.log("The SHT degree is too high for the number of data points"), n == 0 && (t = convertCart2Sph(t));
	for (var c = 0; c < t.length; c++) s[c] = t[c][2];
	return Y_N = computeRealSH(e, t), o = r == 0 ? numeric$1.mul(1 / i, Y_N) : pinv_direct(numeric$1.transpose(Y_N)), numeric$1.dotMV(o, s);
}, convertCart2Sph = function(e, t) {
	for (var n, r, i, a = Array(e.length), o = 0; o < e.length; o++) n = Math.atan2(e[o][1], e[o][0]), r = Math.atan2(e[o][2], Math.sqrt(e[o][0] * e[o][0] + e[o][1] * e[o][1])), t == 1 ? a[o] = [n, r] : (i = Math.sqrt(e[o][0] * e[o][0] + e[o][1] * e[o][1] + e[o][2] * e[o][2]), a[o] = [
		n,
		r,
		i
	]);
	return a;
}, convertSph2Cart = function(e) {
	for (var t, n, r, i = Array(e.length), a = 0; a < e.length; a++) t = Math.cos(e[a][0]) * Math.cos(e[a][1]), n = Math.sin(e[a][0]) * Math.cos(e[a][1]), r = Math.sin(e[a][1]), e[0].length == 2 ? i[a] = [
		t,
		n,
		r
	] : e[0].length == 3 && (i[a] = [
		e[a][2] * t,
		e[a][2] * n,
		e[a][2] * r
	]);
	return i;
}, computeRealSH = function(e, t) {
	for (var n = Array(t.length), r = Array(t.length), i = 0; i < t.length; i++) n[i] = t[i][0], r[i] = t[i][1];
	var a = Array(2 * e + 1);
	n.length;
	for (var o = (e + 1) * (e + 1), s = 0, c = 0, l, u = numeric$1.sin(r), d = 0, f = Array(o), p, m, h, g, i = 0; i < 2 * e + 1; i++) a[i] = factorial(i);
	for (var _ = 0; _ < e + 1; _++) {
		if (_ == 0) {
			var v = Array(n.length);
			v.fill(1), f[_] = v, d = 1;
		} else {
			l = recurseLegendrePoly(_, u, s, c), p = Math.sqrt(2 * _ + 1);
			for (var y = 0; y < _ + 1; y++) y == 0 ? f[d + _] = numeric$1.mul(p, l[y]) : (m = p * Math.sqrt(2 * a[_ - y] / a[_ + y]), h = numeric$1.cos(numeric$1.mul(y, n)), g = numeric$1.sin(numeric$1.mul(y, n)), f[d + _ - y] = numeric$1.mul(m, numeric$1.mul(l[y], g)), f[d + _ + y] = numeric$1.mul(m, numeric$1.mul(l[y], h)));
			d = d + 2 * _ + 1;
		}
		c = s, s = l;
	}
	return f;
}, factorial = function(e) {
	return e === 0 ? 1 : e * factorial(e - 1);
}, recurseLegendrePoly = function(e, t, n, r) {
	var i = Array(e + 1);
	switch (e) {
		case 1:
			var a = numeric$1.mul(t, t), o = t, s = numeric$1.sqrt(numeric$1.sub(1, a));
			i[0] = o, i[1] = s;
			break;
		case 2:
			var a = numeric$1.mul(t, t), c = numeric$1.mul(3, a);
			c = numeric$1.sub(c, 1), c = numeric$1.div(c, 2);
			var l = numeric$1.sub(1, a);
			l = numeric$1.sqrt(l), l = numeric$1.mul(3, l), l = numeric$1.mul(l, t);
			var u = numeric$1.sub(1, a);
			u = numeric$1.mul(3, u), i[0] = c, i[1] = l, i[2] = u;
			break;
		default:
			var a = numeric$1.mul(t, t), d = numeric$1.sub(1, a), f = 2 * e - 1, p = 1;
			if (f % 2 == 0) for (var m = 1; m < f / 2 + 1; m++) p = p * 2 * m;
			else for (var m = 1; m < (f + 1) / 2 + 1; m++) p *= 2 * m - 1;
			i[e] = numeric$1.mul(p, numeric$1.pow(d, e / 2)), i[e - 1] = numeric$1.mul(2 * e - 1, numeric$1.mul(t, n[e - 1]));
			for (var h = 0; h < e - 1; h++) {
				var g = numeric$1.mul(2 * e - 1, numeric$1.mul(t, n[h])), _ = numeric$1.mul(e + h - 1, r[h]);
				i[h] = numeric$1.div(numeric$1.sub(g, _), e - h);
			}
	}
	return i;
}, pinv_direct = function(e) {
	var t = numeric$1.transpose(e);
	return numeric$1.dot(numeric$1.inv(numeric$1.dot(t, e)), t);
}, getSHrotMtx = function(e, t) {
	var n = (t + 1) * (t + 1), r = numeric$1.rep([n, n], 0);
	r[0][0] = 1;
	var i = numeric$1.rep([3, 3], 0);
	i[0][0] = e[1][1], i[0][1] = e[1][2], i[0][2] = e[1][0], i[1][0] = e[2][1], i[1][1] = e[2][2], i[1][2] = e[2][0], i[2][0] = e[0][1], i[2][1] = e[0][2], i[2][2] = e[0][0], r = numeric$1.setBlock(r, [1, 1], [3, 3], i);
	for (var a = i, o = 3, s = 2; s < t + 1; s++) {
		for (var c = numeric$1.rep([2 * s + 1, 2 * s + 1], 0), l = -s; l < s + 1; l++) for (var u = -s; u < s + 1; u++) {
			var d = +(l == 0), f = Math.abs(u) == s ? 2 * s * (2 * s - 1) : s * s - u * u, p = Math.sqrt((s * s - l * l) / f), m = Math.sqrt((1 + d) * (s + Math.abs(l) - 1) * (s + Math.abs(l)) / f) * (1 - 2 * d) * .5, h = Math.sqrt((s - Math.abs(l) - 1) * (s - Math.abs(l)) / f) * (1 - d) * -.5;
			p != 0 && (p *= U(s, l, u, i, a)), m != 0 && (m *= V(s, l, u, i, a)), h != 0 && (h *= W(s, l, u, i, a)), c[l + s][u + s] = p + m + h;
		}
		r = numeric$1.setBlock(r, [o + 1, o + 1], [o + 2 * s + 1, o + 2 * s + 1], c), a = c, o = o + 2 * s + 1;
	}
	return r;
};
function U(e, t, n, r, i) {
	return P(0, e, t, n, r, i);
}
function V(e, t, n, r, i) {
	var a, o, s, c;
	return t == 0 ? (a = P(1, e, 1, n, r, i), o = P(-1, e, -1, n, r, i), s = a + o) : t > 0 ? (c = +(t == 1), a = P(1, e, t - 1, n, r, i), o = P(-1, e, -t + 1, n, r, i), s = a * Math.sqrt(1 + c) - o * (1 - c)) : (c = +(t == -1), a = P(1, e, t + 1, n, r, i), o = P(-1, e, -t - 1, n, r, i), s = a * (1 - c) + o * Math.sqrt(1 + c)), s;
}
function W(e, t, n, r, i) {
	var a, o, s;
	return t == 0 ? console.error("should not be called") : t > 0 ? (a = P(1, e, t + 1, n, r, i), o = P(-1, e, -t - 1, n, r, i), s = a + o) : (a = P(1, e, t - 1, n, r, i), o = P(-1, e, -t + 1, n, r, i), s = a - o), s;
}
function P(e, t, n, r, i, a) {
	var o = i[e + 1][2], s = i[e + 1][0], c = i[e + 1][1];
	return r == -t ? o * a[n + t - 1][0] + s * a[n + t - 1][2 * t - 2] : r == t ? o * a[n + t - 1][2 * t - 2] - s * a[n + t - 1][0] : c * a[n + t - 1][r + t - 1];
}
var yawPitchRoll2Rzyx = function(e, t, n) {
	var r = n == 0 ? [
		[
			1,
			0,
			0
		],
		[
			0,
			1,
			0
		],
		[
			0,
			0,
			1
		]
	] : [
		[
			1,
			0,
			0
		],
		[
			0,
			Math.cos(n),
			Math.sin(n)
		],
		[
			0,
			-Math.sin(n),
			Math.cos(n)
		]
	], i = t == 0 ? [
		[
			1,
			0,
			0
		],
		[
			0,
			1,
			0
		],
		[
			0,
			0,
			1
		]
	] : [
		[
			Math.cos(t),
			0,
			-Math.sin(t)
		],
		[
			0,
			1,
			0
		],
		[
			Math.sin(t),
			0,
			Math.cos(t)
		]
	], a = e == 0 ? [
		[
			1,
			0,
			0
		],
		[
			0,
			1,
			0
		],
		[
			0,
			0,
			1
		]
	] : [
		[
			Math.cos(e),
			Math.sin(e),
			0
		],
		[
			-Math.sin(e),
			Math.cos(e),
			0
		],
		[
			0,
			0,
			1
		]
	], o = numeric$1.dotMMsmall(i, a);
	return o = numeric$1.dotMMsmall(r, o), o;
}, forwardSHT_1 = forwardSHT, convertCart2Sph_1 = convertCart2Sph, convertSph2Cart_1 = convertSph2Cart, computeRealSH_1 = computeRealSH, factorial_1 = factorial, recurseLegendrePoly_1 = recurseLegendrePoly, getSHrotMtx_1 = getSHrotMtx, yawPitchRoll2Rzyx_1 = yawPitchRoll2Rzyx, ch1d = convexHull1d$1;
function convexHull1d$1(e) {
	for (var t = 0, n = 0, r = 1; r < e.length; ++r) e[r][0] < e[t][0] && (t = r), e[r][0] > e[n][0] && (n = r);
	return t < n ? [[t], [n]] : t > n ? [[n], [t]] : [[t]];
}
var orientation = { exports: {} }, twoProduct_1 = twoProduct$1, SPLITTER = +(2 ** 27 + 1);
function twoProduct$1(e, t, n) {
	var r = e * t, i = SPLITTER * e, a = i - (i - e), o = e - a, s = SPLITTER * t, c = s - (s - t), l = t - c, u = r - a * c - o * c - a * l, d = o * l - u;
	return n ? (n[0] = d, n[1] = r, n) : [d, r];
}
var robustSum = linearExpansionSum;
function scalarScalar$1(e, t) {
	var n = e + t, r = n - e, i = n - r, a = t - r, o = e - i + a;
	return o ? [o, n] : [n];
}
function linearExpansionSum(e, t) {
	var n = e.length | 0, r = t.length | 0;
	if (n === 1 && r === 1) return scalarScalar$1(e[0], t[0]);
	var i = n + r, a = Array(i), o = 0, s = 0, c = 0, l = Math.abs, u = e[s], d = l(u), f = t[c], p = l(f), m, h;
	d < p ? (h = u, s += 1, s < n && (u = e[s], d = l(u))) : (h = f, c += 1, c < r && (f = t[c], p = l(f))), s < n && d < p || c >= r ? (m = u, s += 1, s < n && (u = e[s], d = l(u))) : (m = f, c += 1, c < r && (f = t[c], p = l(f)));
	for (var g = m + h, _ = g - m, v = h - _, y = v, b = g, x, S, w, E, D; s < n && c < r;) d < p ? (m = u, s += 1, s < n && (u = e[s], d = l(u))) : (m = f, c += 1, c < r && (f = t[c], p = l(f))), h = y, g = m + h, _ = g - m, v = h - _, v && (a[o++] = v), x = b + g, S = x - b, w = x - S, E = g - S, D = b - w, y = D + E, b = x;
	for (; s < n;) m = u, h = y, g = m + h, _ = g - m, v = h - _, v && (a[o++] = v), x = b + g, S = x - b, w = x - S, E = g - S, D = b - w, y = D + E, b = x, s += 1, s < n && (u = e[s]);
	for (; c < r;) m = f, h = y, g = m + h, _ = g - m, v = h - _, v && (a[o++] = v), x = b + g, S = x - b, w = x - S, E = g - S, D = b - w, y = D + E, b = x, c += 1, c < r && (f = t[c]);
	return y && (a[o++] = y), b && (a[o++] = b), o || (a[o++] = 0), a.length = o, a;
}
var twoSum$1 = fastTwoSum;
function fastTwoSum(e, t, n) {
	var r = e + t, i = r - e, a = r - i, o = t - i, s = e - a;
	return n ? (n[0] = s + o, n[1] = r, n) : [s + o, r];
}
var twoProduct = twoProduct_1, twoSum = twoSum$1, robustScale = scaleLinearExpansion;
function scaleLinearExpansion(e, t) {
	var n = e.length;
	if (n === 1) {
		var r = twoProduct(e[0], t);
		return r[0] ? r : [r[1]];
	}
	var i = Array(2 * n), a = [.1, .1], o = [.1, .1], s = 0;
	twoProduct(e[0], t, a), a[0] && (i[s++] = a[0]);
	for (var c = 1; c < n; ++c) {
		twoProduct(e[c], t, o);
		var l = a[1];
		twoSum(l, o[0], a), a[0] && (i[s++] = a[0]);
		var u = o[1], d = a[1], f = u + d, p = d - (f - u);
		a[1] = f, p && (i[s++] = p);
	}
	return a[1] && (i[s++] = a[1]), s === 0 && (i[s++] = 0), i.length = s, i;
}
var robustDiff = robustSubtract;
function scalarScalar(e, t) {
	var n = e + t, r = n - e, i = n - r, a = t - r, o = e - i + a;
	return o ? [o, n] : [n];
}
function robustSubtract(e, t) {
	var n = e.length | 0, r = t.length | 0;
	if (n === 1 && r === 1) return scalarScalar(e[0], -t[0]);
	var i = n + r, a = Array(i), o = 0, s = 0, c = 0, l = Math.abs, u = e[s], d = l(u), f = -t[c], p = l(f), m, h;
	d < p ? (h = u, s += 1, s < n && (u = e[s], d = l(u))) : (h = f, c += 1, c < r && (f = -t[c], p = l(f))), s < n && d < p || c >= r ? (m = u, s += 1, s < n && (u = e[s], d = l(u))) : (m = f, c += 1, c < r && (f = -t[c], p = l(f)));
	for (var g = m + h, _ = g - m, v = h - _, y = v, b = g, x, S, w, E, D; s < n && c < r;) d < p ? (m = u, s += 1, s < n && (u = e[s], d = l(u))) : (m = f, c += 1, c < r && (f = -t[c], p = l(f))), h = y, g = m + h, _ = g - m, v = h - _, v && (a[o++] = v), x = b + g, S = x - b, w = x - S, E = g - S, D = b - w, y = D + E, b = x;
	for (; s < n;) m = u, h = y, g = m + h, _ = g - m, v = h - _, v && (a[o++] = v), x = b + g, S = x - b, w = x - S, E = g - S, D = b - w, y = D + E, b = x, s += 1, s < n && (u = e[s]);
	for (; c < r;) m = f, h = y, g = m + h, _ = g - m, v = h - _, v && (a[o++] = v), x = b + g, S = x - b, w = x - S, E = g - S, D = b - w, y = D + E, b = x, c += 1, c < r && (f = -t[c]);
	return y && (a[o++] = y), b && (a[o++] = b), o || (a[o++] = 0), a.length = o, a;
}
(function(e) {
	var t = twoProduct_1, n = robustSum, r = robustScale, i = robustDiff, a = 5, o = 11102230246251565e-32, s = (3 + 16 * o) * o, c = (7 + 56 * o) * o;
	function l(e, t, n, r) {
		return function(n, i, a) {
			var o = r(e(e(t(i[1], a[0]), t(-a[1], i[0])), e(t(n[1], i[0]), t(-i[1], n[0]))), e(t(n[1], a[0]), t(-a[1], n[0])));
			return o[o.length - 1];
		};
	}
	function u(e, t, n, r) {
		return function(i, a, o, s) {
			var c = r(e(e(n(e(t(o[1], s[0]), t(-s[1], o[0])), a[2]), e(n(e(t(a[1], s[0]), t(-s[1], a[0])), -o[2]), n(e(t(a[1], o[0]), t(-o[1], a[0])), s[2]))), e(n(e(t(a[1], s[0]), t(-s[1], a[0])), i[2]), e(n(e(t(i[1], s[0]), t(-s[1], i[0])), -a[2]), n(e(t(i[1], a[0]), t(-a[1], i[0])), s[2])))), e(e(n(e(t(o[1], s[0]), t(-s[1], o[0])), i[2]), e(n(e(t(i[1], s[0]), t(-s[1], i[0])), -o[2]), n(e(t(i[1], o[0]), t(-o[1], i[0])), s[2]))), e(n(e(t(a[1], o[0]), t(-o[1], a[0])), i[2]), e(n(e(t(i[1], o[0]), t(-o[1], i[0])), -a[2]), n(e(t(i[1], a[0]), t(-a[1], i[0])), o[2])))));
			return c[c.length - 1];
		};
	}
	function d(e, t, n, r) {
		return function(i, a, o, s, c) {
			var l = r(e(e(e(n(e(n(e(t(s[1], c[0]), t(-c[1], s[0])), o[2]), e(n(e(t(o[1], c[0]), t(-c[1], o[0])), -s[2]), n(e(t(o[1], s[0]), t(-s[1], o[0])), c[2]))), a[3]), e(n(e(n(e(t(s[1], c[0]), t(-c[1], s[0])), a[2]), e(n(e(t(a[1], c[0]), t(-c[1], a[0])), -s[2]), n(e(t(a[1], s[0]), t(-s[1], a[0])), c[2]))), -o[3]), n(e(n(e(t(o[1], c[0]), t(-c[1], o[0])), a[2]), e(n(e(t(a[1], c[0]), t(-c[1], a[0])), -o[2]), n(e(t(a[1], o[0]), t(-o[1], a[0])), c[2]))), s[3]))), e(n(e(n(e(t(o[1], s[0]), t(-s[1], o[0])), a[2]), e(n(e(t(a[1], s[0]), t(-s[1], a[0])), -o[2]), n(e(t(a[1], o[0]), t(-o[1], a[0])), s[2]))), -c[3]), e(n(e(n(e(t(s[1], c[0]), t(-c[1], s[0])), a[2]), e(n(e(t(a[1], c[0]), t(-c[1], a[0])), -s[2]), n(e(t(a[1], s[0]), t(-s[1], a[0])), c[2]))), i[3]), n(e(n(e(t(s[1], c[0]), t(-c[1], s[0])), i[2]), e(n(e(t(i[1], c[0]), t(-c[1], i[0])), -s[2]), n(e(t(i[1], s[0]), t(-s[1], i[0])), c[2]))), -a[3])))), e(e(n(e(n(e(t(a[1], c[0]), t(-c[1], a[0])), i[2]), e(n(e(t(i[1], c[0]), t(-c[1], i[0])), -a[2]), n(e(t(i[1], a[0]), t(-a[1], i[0])), c[2]))), s[3]), e(n(e(n(e(t(a[1], s[0]), t(-s[1], a[0])), i[2]), e(n(e(t(i[1], s[0]), t(-s[1], i[0])), -a[2]), n(e(t(i[1], a[0]), t(-a[1], i[0])), s[2]))), -c[3]), n(e(n(e(t(o[1], s[0]), t(-s[1], o[0])), a[2]), e(n(e(t(a[1], s[0]), t(-s[1], a[0])), -o[2]), n(e(t(a[1], o[0]), t(-o[1], a[0])), s[2]))), i[3]))), e(n(e(n(e(t(o[1], s[0]), t(-s[1], o[0])), i[2]), e(n(e(t(i[1], s[0]), t(-s[1], i[0])), -o[2]), n(e(t(i[1], o[0]), t(-o[1], i[0])), s[2]))), -a[3]), e(n(e(n(e(t(a[1], s[0]), t(-s[1], a[0])), i[2]), e(n(e(t(i[1], s[0]), t(-s[1], i[0])), -a[2]), n(e(t(i[1], a[0]), t(-a[1], i[0])), s[2]))), o[3]), n(e(n(e(t(a[1], o[0]), t(-o[1], a[0])), i[2]), e(n(e(t(i[1], o[0]), t(-o[1], i[0])), -a[2]), n(e(t(i[1], a[0]), t(-a[1], i[0])), o[2]))), -s[3]))))), e(e(e(n(e(n(e(t(s[1], c[0]), t(-c[1], s[0])), o[2]), e(n(e(t(o[1], c[0]), t(-c[1], o[0])), -s[2]), n(e(t(o[1], s[0]), t(-s[1], o[0])), c[2]))), i[3]), n(e(n(e(t(s[1], c[0]), t(-c[1], s[0])), i[2]), e(n(e(t(i[1], c[0]), t(-c[1], i[0])), -s[2]), n(e(t(i[1], s[0]), t(-s[1], i[0])), c[2]))), -o[3])), e(n(e(n(e(t(o[1], c[0]), t(-c[1], o[0])), i[2]), e(n(e(t(i[1], c[0]), t(-c[1], i[0])), -o[2]), n(e(t(i[1], o[0]), t(-o[1], i[0])), c[2]))), s[3]), n(e(n(e(t(o[1], s[0]), t(-s[1], o[0])), i[2]), e(n(e(t(i[1], s[0]), t(-s[1], i[0])), -o[2]), n(e(t(i[1], o[0]), t(-o[1], i[0])), s[2]))), -c[3]))), e(e(n(e(n(e(t(o[1], c[0]), t(-c[1], o[0])), a[2]), e(n(e(t(a[1], c[0]), t(-c[1], a[0])), -o[2]), n(e(t(a[1], o[0]), t(-o[1], a[0])), c[2]))), i[3]), n(e(n(e(t(o[1], c[0]), t(-c[1], o[0])), i[2]), e(n(e(t(i[1], c[0]), t(-c[1], i[0])), -o[2]), n(e(t(i[1], o[0]), t(-o[1], i[0])), c[2]))), -a[3])), e(n(e(n(e(t(a[1], c[0]), t(-c[1], a[0])), i[2]), e(n(e(t(i[1], c[0]), t(-c[1], i[0])), -a[2]), n(e(t(i[1], a[0]), t(-a[1], i[0])), c[2]))), o[3]), n(e(n(e(t(a[1], o[0]), t(-o[1], a[0])), i[2]), e(n(e(t(i[1], o[0]), t(-o[1], i[0])), -a[2]), n(e(t(i[1], a[0]), t(-a[1], i[0])), o[2]))), -c[3])))));
			return l[l.length - 1];
		};
	}
	function f(e) {
		return (e === 3 ? l : e === 4 ? u : d)(n, t, r, i);
	}
	var p = f(3), m = f(4), h = [
		function() {
			return 0;
		},
		function() {
			return 0;
		},
		function(e, t) {
			return t[0] - e[0];
		},
		function(e, t, n) {
			var r = (e[1] - n[1]) * (t[0] - n[0]), i = (e[0] - n[0]) * (t[1] - n[1]), a = r - i, o;
			if (r > 0) {
				if (i <= 0) return a;
				o = r + i;
			} else if (r < 0) {
				if (i >= 0) return a;
				o = -(r + i);
			} else return a;
			var c = s * o;
			return a >= c || a <= -c ? a : p(e, t, n);
		},
		function(e, t, n, r) {
			var i = e[0] - r[0], a = t[0] - r[0], o = n[0] - r[0], s = e[1] - r[1], l = t[1] - r[1], u = n[1] - r[1], d = e[2] - r[2], f = t[2] - r[2], p = n[2] - r[2], h = a * u, g = o * l, _ = o * s, v = i * u, y = i * l, b = a * s, x = d * (h - g) + f * (_ - v) + p * (y - b), S = c * ((Math.abs(h) + Math.abs(g)) * Math.abs(d) + (Math.abs(_) + Math.abs(v)) * Math.abs(f) + (Math.abs(y) + Math.abs(b)) * Math.abs(p));
			return x > S || -x > S ? x : m(e, t, n, r);
		}
	];
	function g(e) {
		var t = h[e.length];
		return t ||= h[e.length] = f(e.length), t.apply(void 0, e);
	}
	function _(e, t, n, r, i, a, o) {
		return function(t, n, s, c, l) {
			switch (arguments.length) {
				case 0:
				case 1: return 0;
				case 2: return r(t, n);
				case 3: return i(t, n, s);
				case 4: return a(t, n, s, c);
				case 5: return o(t, n, s, c, l);
			}
			for (var u = Array(arguments.length), d = 0; d < arguments.length; ++d) u[d] = arguments[d];
			return e(u);
		};
	}
	function v() {
		for (; h.length <= a;) h.push(f(h.length));
		e.exports = _.apply(void 0, [g].concat(h));
		for (var t = 0; t <= a; ++t) e.exports[t] = h[t];
	}
	v();
})(orientation);
var orientationExports = orientation.exports, monotoneConvexHull2d = monotoneConvexHull2D, orient$2 = orientationExports[3];
function monotoneConvexHull2D(e) {
	var t = e.length;
	if (t < 3) {
		for (var n = Array(t), r = 0; r < t; ++r) n[r] = r;
		return t === 2 && e[0][0] === e[1][0] && e[0][1] === e[1][1] ? [0] : n;
	}
	for (var i = Array(t), r = 0; r < t; ++r) i[r] = r;
	i.sort(function(t, n) {
		return e[t][0] - e[n][0] || e[t][1] - e[n][1];
	});
	for (var a = [i[0], i[1]], o = [i[0], i[1]], r = 2; r < t; ++r) {
		for (var s = i[r], c = e[s], l = a.length; l > 1 && orient$2(e[a[l - 2]], e[a[l - 1]], c) <= 0;) --l, a.pop();
		for (a.push(s), l = o.length; l > 1 && orient$2(e[o[l - 2]], e[o[l - 1]], c) >= 0;) --l, o.pop();
		o.push(s);
	}
	for (var n = Array(o.length + a.length - 2), u = 0, r = 0, d = a.length; r < d; ++r) n[u++] = a[r];
	for (var f = o.length - 2; f > 0; --f) n[u++] = o[f];
	return n;
}
var ch2d = convexHull2D, monotoneHull = monotoneConvexHull2d;
function convexHull2D(e) {
	var t = monotoneHull(e), n = t.length;
	if (n <= 2) return [];
	for (var r = Array(n), i = t[n - 1], a = 0; a < n; ++a) {
		var o = t[a];
		r[a] = [i, o], i = o;
	}
	return r;
}
var topology = {}, twiddle = {}, INT_BITS = 32;
twiddle.INT_BITS = INT_BITS, twiddle.INT_MAX = 2147483647, twiddle.INT_MIN = -1 << INT_BITS - 1, twiddle.sign = function(e) {
	return (e > 0) - (e < 0);
}, twiddle.abs = function(e) {
	var t = e >> INT_BITS - 1;
	return (e ^ t) - t;
}, twiddle.min = function(e, t) {
	return t ^ (e ^ t) & -(e < t);
}, twiddle.max = function(e, t) {
	return e ^ (e ^ t) & -(e < t);
}, twiddle.isPow2 = function(e) {
	return !(e & e - 1) && !!e;
}, twiddle.log2 = function(e) {
	var t = (e > 65535) << 4, n;
	return e >>>= t, n = (e > 255) << 3, e >>>= n, t |= n, n = (e > 15) << 2, e >>>= n, t |= n, n = (e > 3) << 1, e >>>= n, t |= n, t | e >> 1;
}, twiddle.log10 = function(e) {
	return e >= 1e9 ? 9 : e >= 1e8 ? 8 : e >= 1e7 ? 7 : e >= 1e6 ? 6 : e >= 1e5 ? 5 : e >= 1e4 ? 4 : e >= 1e3 ? 3 : e >= 100 ? 2 : +(e >= 10);
}, twiddle.popCount = function(e) {
	return e -= e >>> 1 & 1431655765, e = (e & 858993459) + (e >>> 2 & 858993459), (e + (e >>> 4) & 252645135) * 16843009 >>> 24;
};
function countTrailingZeros(e) {
	var t = 32;
	return e &= -e, e && t--, e & 65535 && (t -= 16), e & 16711935 && (t -= 8), e & 252645135 && (t -= 4), e & 858993459 && (t -= 2), e & 1431655765 && --t, t;
}
twiddle.countTrailingZeros = countTrailingZeros, twiddle.nextPow2 = function(e) {
	return e += e === 0, --e, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e + 1;
}, twiddle.prevPow2 = function(e) {
	return e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e - (e >>> 1);
}, twiddle.parity = function(e) {
	return e ^= e >>> 16, e ^= e >>> 8, e ^= e >>> 4, e &= 15, 27030 >>> e & 1;
};
var REVERSE_TABLE = Array(256);
(function(e) {
	for (var t = 0; t < 256; ++t) {
		var n = t, r = t, i = 7;
		for (n >>>= 1; n; n >>>= 1) r <<= 1, r |= n & 1, --i;
		e[t] = r << i & 255;
	}
})(REVERSE_TABLE), twiddle.reverse = function(e) {
	return REVERSE_TABLE[e & 255] << 24 | REVERSE_TABLE[e >>> 8 & 255] << 16 | REVERSE_TABLE[e >>> 16 & 255] << 8 | REVERSE_TABLE[e >>> 24 & 255];
}, twiddle.interleave2 = function(e, t) {
	return e &= 65535, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, t &= 65535, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, e | t << 1;
}, twiddle.deinterleave2 = function(e, t) {
	return e = e >>> t & 1431655765, e = (e | e >>> 1) & 858993459, e = (e | e >>> 2) & 252645135, e = (e | e >>> 4) & 16711935, e = (e | e >>> 16) & 65535, e << 16 >> 16;
}, twiddle.interleave3 = function(e, t, n) {
	return e &= 1023, e = (e | e << 16) & 4278190335, e = (e | e << 8) & 251719695, e = (e | e << 4) & 3272356035, e = (e | e << 2) & 1227133513, t &= 1023, t = (t | t << 16) & 4278190335, t = (t | t << 8) & 251719695, t = (t | t << 4) & 3272356035, t = (t | t << 2) & 1227133513, e |= t << 1, n &= 1023, n = (n | n << 16) & 4278190335, n = (n | n << 8) & 251719695, n = (n | n << 4) & 3272356035, n = (n | n << 2) & 1227133513, e | n << 2;
}, twiddle.deinterleave3 = function(e, t) {
	return e = e >>> t & 1227133513, e = (e | e >>> 2) & 3272356035, e = (e | e >>> 4) & 251719695, e = (e | e >>> 8) & 4278190335, e = (e | e >>> 16) & 1023, e << 22 >> 22;
}, twiddle.nextCombination = function(e) {
	var t = e | e - 1;
	return t + 1 | (~t & -~t) - 1 >>> countTrailingZeros(e) + 1;
};
var unionFind = UnionFind$1;
function UnionFind$1(e) {
	this.roots = Array(e), this.ranks = Array(e);
	for (var t = 0; t < e; ++t) this.roots[t] = t, this.ranks[t] = 0;
}
var proto$1 = UnionFind$1.prototype;
Object.defineProperty(proto$1, "length", { get: function() {
	return this.roots.length;
} }), proto$1.makeSet = function() {
	var e = this.roots.length;
	return this.roots.push(e), this.ranks.push(0), e;
}, proto$1.find = function(e) {
	for (var t = e, n = this.roots; n[e] !== e;) e = n[e];
	for (; n[t] !== e;) {
		var r = n[t];
		n[t] = e, t = r;
	}
	return e;
}, proto$1.link = function(e, t) {
	var n = this.find(e), r = this.find(t);
	if (n !== r) {
		var i = this.ranks, a = this.roots, o = i[n], s = i[r];
		o < s ? a[n] = r : s < o ? a[r] = n : (a[r] = n, ++i[n]);
	}
};
var bits = twiddle, UnionFind = unionFind;
function dimension(e) {
	for (var t = 0, n = Math.max, r = 0, i = e.length; r < i; ++r) t = n(t, e[r].length);
	return t - 1;
}
topology.dimension = dimension;
function countVertices(e) {
	for (var t = -1, n = Math.max, r = 0, i = e.length; r < i; ++r) for (var a = e[r], o = 0, s = a.length; o < s; ++o) t = n(t, a[o]);
	return t + 1;
}
topology.countVertices = countVertices;
function cloneCells(e) {
	for (var t = Array(e.length), n = 0, r = e.length; n < r; ++n) t[n] = e[n].slice(0);
	return t;
}
topology.cloneCells = cloneCells;
function compareCells(e, t) {
	var n = e.length, r = e.length - t.length, i = Math.min;
	if (r) return r;
	switch (n) {
		case 0: return 0;
		case 1: return e[0] - t[0];
		case 2:
			var a = e[0] + e[1] - t[0] - t[1];
			return a || i(e[0], e[1]) - i(t[0], t[1]);
		case 3:
			var o = e[0] + e[1], s = t[0] + t[1];
			if (a = o + e[2] - (s + t[2]), a) return a;
			var c = i(e[0], e[1]), l = i(t[0], t[1]), a = i(c, e[2]) - i(l, t[2]);
			return a || i(c + e[2], o) - i(l + t[2], s);
		default:
			var u = e.slice(0);
			u.sort();
			var d = t.slice(0);
			d.sort();
			for (var f = 0; f < n; ++f) if (r = u[f] - d[f], r) return r;
			return 0;
	}
}
topology.compareCells = compareCells;
function compareZipped(e, t) {
	return compareCells(e[0], t[0]);
}
function normalize(e, t) {
	if (t) {
		for (var n = e.length, r = Array(n), i = 0; i < n; ++i) r[i] = [e[i], t[i]];
		r.sort(compareZipped);
		for (var i = 0; i < n; ++i) e[i] = r[i][0], t[i] = r[i][1];
		return e;
	}
	return e.sort(compareCells), e;
}
topology.normalize = normalize;
function unique(e) {
	if (e.length === 0) return [];
	for (var t = 1, n = e.length, r = 1; r < n; ++r) {
		var i = e[r];
		if (compareCells(i, e[r - 1])) {
			if (r === t) {
				t++;
				continue;
			}
			e[t++] = i;
		}
	}
	return e.length = t, e;
}
topology.unique = unique;
function findCell(e, t) {
	for (var n = 0, r = e.length - 1, i = -1; n <= r;) {
		var a = n + r >> 1, o = compareCells(e[a], t);
		o <= 0 ? (o === 0 && (i = a), n = a + 1) : o > 0 && (r = a - 1);
	}
	return i;
}
topology.findCell = findCell;
function incidence(e, t) {
	for (var n = Array(e.length), r = 0, i = n.length; r < i; ++r) n[r] = [];
	for (var a = [], r = 0, o = t.length; r < o; ++r) for (var s = t[r], c = s.length, l = 1, u = 1 << c; l < u; ++l) {
		a.length = bits.popCount(l);
		for (var d = 0, f = 0; f < c; ++f) l & 1 << f && (a[d++] = s[f]);
		var p = findCell(e, a);
		if (!(p < 0)) for (; n[p++].push(r), !(p >= e.length || compareCells(e[p], a) !== 0););
	}
	return n;
}
topology.incidence = incidence;
function dual(e, t) {
	if (!t) return incidence(unique(skeleton(e, 0)), e);
	for (var n = Array(t), r = 0; r < t; ++r) n[r] = [];
	for (var r = 0, i = e.length; r < i; ++r) for (var a = e[r], o = 0, s = a.length; o < s; ++o) n[a[o]].push(r);
	return n;
}
topology.dual = dual;
function explode(e) {
	for (var t = [], n = 0, r = e.length; n < r; ++n) for (var i = e[n], a = i.length | 0, o = 1, s = 1 << a; o < s; ++o) {
		for (var c = [], l = 0; l < a; ++l) o >>> l & 1 && c.push(i[l]);
		t.push(c);
	}
	return normalize(t);
}
topology.explode = explode;
function skeleton(e, t) {
	if (t < 0) return [];
	for (var n = [], r = (1 << t + 1) - 1, i = 0; i < e.length; ++i) for (var a = e[i], o = r; o < 1 << a.length; o = bits.nextCombination(o)) {
		for (var s = Array(t + 1), c = 0, l = 0; l < a.length; ++l) o & 1 << l && (s[c++] = a[l]);
		n.push(s);
	}
	return normalize(n);
}
topology.skeleton = skeleton;
function boundary(e) {
	for (var t = [], n = 0, r = e.length; n < r; ++n) for (var i = e[n], a = 0, o = i.length; a < o; ++a) {
		for (var s = Array(i.length - 1), c = 0, l = 0; c < o; ++c) c !== a && (s[l++] = i[c]);
		t.push(s);
	}
	return normalize(t);
}
topology.boundary = boundary;
function connectedComponents_dense(e, t) {
	for (var n = new UnionFind(t), r = 0; r < e.length; ++r) for (var i = e[r], a = 0; a < i.length; ++a) for (var o = a + 1; o < i.length; ++o) n.link(i[a], i[o]);
	for (var s = [], c = n.ranks, r = 0; r < c.length; ++r) c[r] = -1;
	for (var r = 0; r < e.length; ++r) {
		var l = n.find(e[r][0]);
		c[l] < 0 ? (c[l] = s.length, s.push([e[r].slice(0)])) : s[c[l]].push(e[r].slice(0));
	}
	return s;
}
function connectedComponents_sparse(e) {
	for (var t = unique(normalize(skeleton(e, 0))), n = new UnionFind(t.length), r = 0; r < e.length; ++r) for (var i = e[r], a = 0; a < i.length; ++a) for (var o = findCell(t, [i[a]]), s = a + 1; s < i.length; ++s) n.link(o, findCell(t, [i[s]]));
	for (var c = [], l = n.ranks, r = 0; r < l.length; ++r) l[r] = -1;
	for (var r = 0; r < e.length; ++r) {
		var u = n.find(findCell(t, [e[r][0]]));
		l[u] < 0 ? (l[u] = c.length, c.push([e[r].slice(0)])) : c[l[u]].push(e[r].slice(0));
	}
	return c;
}
function connectedComponents(e, t) {
	return t ? connectedComponents_dense(e, t) : connectedComponents_sparse(e);
}
topology.connectedComponents = connectedComponents;
var ich$1 = incrementalConvexHull, orient$1 = orientationExports, compareCell = topology.compareCells;
function Simplex(e, t, n) {
	this.vertices = e, this.adjacent = t, this.boundary = n, this.lastVisited = -1;
}
Simplex.prototype.flip = function() {
	var e = this.vertices[0];
	this.vertices[0] = this.vertices[1], this.vertices[1] = e;
	var t = this.adjacent[0];
	this.adjacent[0] = this.adjacent[1], this.adjacent[1] = t;
};
function GlueFacet(e, t, n) {
	this.vertices = e, this.cell = t, this.index = n;
}
function compareGlue(e, t) {
	return compareCell(e.vertices, t.vertices);
}
function bakeOrient(e) {
	for (var t = ["function orient(){var tuple=this.tuple;return test("], n = 0; n <= e; ++n) n > 0 && t.push(","), t.push("tuple[", n, "]");
	t.push(")}return orient");
	var r = Function("test", t.join("")), i = orient$1[e + 1];
	return i ||= orient$1, r(i);
}
var BAKED = [];
function Triangulation(e, t, n) {
	this.dimension = e, this.vertices = t, this.simplices = n, this.interior = n.filter(function(e) {
		return !e.boundary;
	}), this.tuple = Array(e + 1);
	for (var r = 0; r <= e; ++r) this.tuple[r] = this.vertices[r];
	var i = BAKED[e];
	i ||= BAKED[e] = bakeOrient(e), this.orient = i;
}
var proto = Triangulation.prototype;
proto.handleBoundaryDegeneracy = function(e, t) {
	var n = this.dimension, r = this.vertices.length - 1, i = this.tuple, a = this.vertices, o = [e];
	for (e.lastVisited = -r; o.length > 0;) {
		e = o.pop(), e.vertices;
		for (var s = e.adjacent, c = 0; c <= n; ++c) {
			var l = s[c];
			if (!(!l.boundary || l.lastVisited <= -r)) {
				for (var u = l.vertices, d = 0; d <= n; ++d) {
					var f = u[d];
					f < 0 ? i[d] = t : i[d] = a[f];
				}
				var p = this.orient();
				if (p > 0) return l;
				l.lastVisited = -r, p === 0 && o.push(l);
			}
		}
	}
	return null;
}, proto.walk = function(e, t) {
	var n = this.vertices.length - 1, r = this.dimension, i = this.vertices, a = this.tuple, o = t ? this.interior.length * Math.random() | 0 : this.interior.length - 1, s = this.interior[o];
	outerLoop: for (; !s.boundary;) {
		for (var c = s.vertices, l = s.adjacent, u = 0; u <= r; ++u) a[u] = i[c[u]];
		s.lastVisited = n;
		for (var u = 0; u <= r; ++u) {
			var d = l[u];
			if (!(d.lastVisited >= n)) {
				var f = a[u];
				a[u] = e;
				var p = this.orient();
				if (a[u] = f, p < 0) {
					s = d;
					continue outerLoop;
				}
				d.lastVisited = d.boundary ? -n : n;
			}
		}
		return;
	}
	return s;
}, proto.addPeaks = function(e, t) {
	var n = this.vertices.length - 1, r = this.dimension, i = this.vertices, a = this.tuple, o = this.interior, s = this.simplices, c = [t];
	t.lastVisited = n, t.vertices[t.vertices.indexOf(-1)] = n, t.boundary = !1, o.push(t);
	for (var l = []; c.length > 0;) {
		var t = c.pop(), u = t.vertices, d = t.adjacent, f = u.indexOf(n);
		if (!(f < 0)) {
			for (var p = 0; p <= r; ++p) if (p !== f) {
				var m = d[p];
				if (!(!m.boundary || m.lastVisited >= n)) {
					var h = m.vertices;
					if (m.lastVisited !== -n) {
						for (var g = 0, _ = 0; _ <= r; ++_) h[_] < 0 ? (g = _, a[_] = e) : a[_] = i[h[_]];
						if (this.orient() > 0) {
							h[g] = n, m.boundary = !1, o.push(m), c.push(m), m.lastVisited = n;
							continue;
						}
						m.lastVisited = -n;
					}
					var v = m.adjacent, y = u.slice(), b = d.slice(), x = new Simplex(y, b, !0);
					s.push(x);
					var S = v.indexOf(t);
					if (!(S < 0)) {
						v[S] = x, b[f] = m, y[p] = -1, b[p] = t, d[p] = x, x.flip();
						for (var _ = 0; _ <= r; ++_) {
							var w = y[_];
							if (!(w < 0 || w === n)) {
								for (var E = Array(r - 1), D = 0, O = 0; O <= r; ++O) {
									var j = y[O];
									j < 0 || O === _ || (E[D++] = j);
								}
								l.push(new GlueFacet(E, x, _));
							}
						}
					}
				}
			}
		}
	}
	l.sort(compareGlue);
	for (var p = 0; p + 1 < l.length; p += 2) {
		var M = l[p], N = l[p + 1], F = M.index, I = N.index;
		F < 0 || I < 0 || (M.cell.adjacent[M.index] = N.cell, N.cell.adjacent[N.index] = M.cell);
	}
}, proto.insert = function(e, t) {
	var n = this.vertices;
	n.push(e);
	var r = this.walk(e, t);
	if (r) {
		for (var i = this.dimension, a = this.tuple, o = 0; o <= i; ++o) {
			var s = r.vertices[o];
			s < 0 ? a[o] = e : a[o] = n[s];
		}
		var c = this.orient(a);
		c < 0 || c === 0 && (r = this.handleBoundaryDegeneracy(r, e), !r) || this.addPeaks(e, r);
	}
}, proto.boundary = function() {
	for (var e = this.dimension, t = [], n = this.simplices, r = n.length, i = 0; i < r; ++i) {
		var a = n[i];
		if (a.boundary) {
			for (var o = Array(e), s = a.vertices, c = 0, l = 0, u = 0; u <= e; ++u) s[u] >= 0 ? o[c++] = s[u] : l = u & 1;
			if (l === (e & 1)) {
				var d = o[0];
				o[0] = o[1], o[1] = d;
			}
			t.push(o);
		}
	}
	return t;
};
function incrementalConvexHull(e, t) {
	var n = e.length;
	if (n === 0) throw Error("Must have at least d+1 points");
	var r = e[0].length;
	if (n <= r) throw Error("Must input at least d+1 points");
	var i = e.slice(0, r + 1), a = orient$1.apply(void 0, i);
	if (a === 0) throw Error("Input not in general position");
	for (var o = Array(r + 1), s = 0; s <= r; ++s) o[s] = s;
	a < 0 && (o[0] = 1, o[1] = 0);
	for (var c = new Simplex(o, Array(r + 1), !1), l = c.adjacent, u = Array(r + 2), s = 0; s <= r; ++s) {
		for (var d = o.slice(), f = 0; f <= r; ++f) f === s && (d[f] = -1);
		var p = d[0];
		d[0] = d[1], d[1] = p;
		var m = new Simplex(d, Array(r + 1), !0);
		l[s] = m, u[s] = m;
	}
	u[r + 1] = c;
	for (var s = 0; s <= r; ++s) for (var d = l[s].vertices, h = l[s].adjacent, f = 0; f <= r; ++f) {
		var g = d[f];
		if (g < 0) {
			h[f] = c;
			continue;
		}
		for (var _ = 0; _ <= r; ++_) l[_].vertices.indexOf(g) < 0 && (h[f] = l[_]);
	}
	for (var v = new Triangulation(r, i, u), y = !!t, s = r + 1; s < n; ++s) v.insert(e[s], y);
	return v.boundary();
}
var aff$1 = affineHull, orient = orientationExports;
function linearlyIndependent(e, t) {
	for (var n = Array(t + 1), r = 0; r < e.length; ++r) n[r] = e[r];
	for (var r = 0; r <= e.length; ++r) {
		for (var i = e.length; i <= t; ++i) {
			for (var a = Array(t), o = 0; o < t; ++o) a[o] = (i + 1 - r) ** +o;
			n[i] = a;
		}
		if (orient.apply(void 0, n)) return !0;
	}
	return !1;
}
function affineHull(e) {
	var t = e.length;
	if (t === 0) return [];
	if (t === 1) return [0];
	for (var n = e[0].length, r = [e[0]], i = [0], a = 1; a < t; ++a) {
		if (r.push(e[a]), !linearlyIndependent(r, n)) {
			r.pop();
			continue;
		}
		if (i.push(a), i.length === n + 1) return i;
	}
	return i;
}
var chnd = convexHullnD, ich = ich$1, aff = aff$1;
function permute(e, t) {
	for (var n = e.length, r = Array(n), i = 0; i < t.length; ++i) r[i] = e[t[i]];
	for (var a = t.length, i = 0; i < n; ++i) t.indexOf(i) < 0 && (r[a++] = e[i]);
	return r;
}
function invPermute(e, t) {
	for (var n = e.length, r = t.length, i = 0; i < n; ++i) for (var a = e[i], o = 0; o < a.length; ++o) {
		var s = a[o];
		if (s < r) a[o] = t[s];
		else {
			s -= r;
			for (var c = 0; c < r; ++c) s >= t[c] && (s += 1);
			a[o] = s;
		}
	}
	return e;
}
function convexHullnD(e, t) {
	try {
		return ich(e, !0);
	} catch {
		var n = aff(e);
		return n.length <= t ? [] : invPermute(ich(permute(e, n), !0), n);
	}
}
var convexHull1d = ch1d, convexHull2d = ch2d, convexHullnd = chnd, ch = convexHull;
function convexHull(e) {
	var t = e.length;
	if (t === 0) return [];
	if (t === 1) return [[0]];
	var n = e[0].length;
	return n === 0 ? [] : n === 1 ? convexHull1d(e) : n === 2 ? convexHull2d(e) : convexHullnd(e, n);
}
var convexhull = /* @__PURE__ */ getDefaultExportFromCjs(ch), numeric = {
	mul: function(e, t) {
		return Array.isArray(e) && typeof t == "number" ? e.map((e) => e * t) : typeof e == "number" && Array.isArray(t) ? t.map((t) => e * t) : Array.isArray(e) && Array.isArray(t) ? e.map((e, n) => e * t[n]) : e * t;
	},
	div: function(e, t) {
		return Array.isArray(e) ? e.map((e) => e / t) : e / t;
	},
	sin: function(e) {
		return e.map((e) => Math.sin(e));
	},
	cos: function(e) {
		return e.map((e) => Math.cos(e));
	},
	pow: function(e, t) {
		return e.map((e) => e ** +t);
	},
	sum: function(e) {
		return e.reduce((e, t) => e + t, 0);
	},
	dotVV: function(e, t) {
		let n = 0;
		for (let r = 0; r < e.length; r++) n += e[r] * t[r];
		return n;
	},
	sub: function(e, t) {
		return Array.isArray(e) && Array.isArray(t) ? e.map((e, n) => e - t[n]) : e - t;
	},
	round: function(e) {
		return Array.isArray(e) ? e.map((e) => Math.round(e)) : Math.round(e);
	},
	mod: function(e, t) {
		return Array.isArray(e) ? e.map((e) => (e % t + t) % t) : (e % t + t) % t;
	},
	add: function(...e) {
		if (e.length === 0) return 0;
		let t = e[0];
		for (let n = 1; n < e.length; n++) {
			let r = e[n];
			Array.isArray(t) && Array.isArray(r) ? t = t.map((e, t) => e + r[t]) : Array.isArray(t) && typeof r == "number" ? t = t.map((e) => e + r) : typeof t == "number" && Array.isArray(r) ? t = r.map((e) => e + t) : t += r;
		}
		return t;
	},
	transpose: function(e) {
		let t = e.length, n = e[0].length, r = Array(n);
		for (let i = 0; i < n; i++) {
			r[i] = Array(t);
			for (let n = 0; n < t; n++) r[i][n] = e[n][i];
		}
		return r;
	},
	dotMMsmall: function(e, t) {
		let n = e.length, r = e[0].length, i = t[0].length, a = Array(n);
		for (let o = 0; o < n; o++) {
			a[o] = Array(i);
			for (let n = 0; n < i; n++) {
				let i = 0;
				for (let a = 0; a < r; a++) i += e[o][a] * t[a][n];
				a[o][n] = i;
			}
		}
		return a;
	},
	inv: function(e) {
		let t = e.length, n = Array(t);
		for (let r = 0; r < t; r++) {
			n[r] = Array(2 * t);
			for (let i = 0; i < t; i++) n[r][i] = e[r][i], n[r][i + t] = +(r === i);
		}
		for (let e = 0; e < t; e++) {
			let r = e;
			for (let i = e + 1; i < t; i++) Math.abs(n[i][e]) > Math.abs(n[r][e]) && (r = i);
			if ([n[e], n[r]] = [n[r], n[e]], Math.abs(n[e][e]) < 1e-10) throw Error("Matrix is singular");
			let i = n[e][e];
			for (let r = 0; r < 2 * t; r++) n[e][r] /= i;
			for (let r = 0; r < t; r++) if (r !== e) {
				let i = n[r][e];
				for (let a = 0; a < 2 * t; a++) n[r][a] -= i * n[e][a];
			}
		}
		let r = Array(t);
		for (let e = 0; e < t; e++) {
			r[e] = Array(t);
			for (let i = 0; i < t; i++) r[e][i] = n[e][i + t];
		}
		return r;
	},
	identity: function(e) {
		let t = Array(e);
		for (let n = 0; n < e; n++) {
			t[n] = Array(e);
			for (let r = 0; r < e; r++) t[n][r] = +(n === r);
		}
		return t;
	},
	diag: function(e) {
		let t = e.length, n = Array(t);
		for (let r = 0; r < t; r++) {
			n[r] = Array(t);
			for (let i = 0; i < t; i++) n[r][i] = r === i ? e[r] : 0;
		}
		return n;
	},
	dot: function(e, t) {
		if (!Array.isArray(e[0]) && !Array.isArray(t[0])) return numeric.dotVV(e, t);
		if (Array.isArray(e[0]) && !Array.isArray(t[0])) {
			let n = e.length, r = e[0].length, i = Array(n);
			for (let a = 0; a < n; a++) {
				let n = 0;
				for (let i = 0; i < r; i++) n += e[a][i] * t[i];
				i[a] = n;
			}
			return i;
		}
		let n = e.length, r = e[0].length, i = t[0].length, a = Array(n);
		for (let o = 0; o < n; o++) {
			a[o] = Array(i);
			for (let n = 0; n < i; n++) {
				let i = 0;
				for (let a = 0; a < r; a++) i += e[o][a] * t[a][n];
				a[o][n] = i;
			}
		}
		return a;
	}
};
function deg2rad(e) {
	var t = [], n = Math.PI / 180;
	for (let r = 0; r < e.length; r++) e[0].length == 3 ? t.push([
		e[r][0] * n,
		e[r][1] * n,
		e[r][2]
	]) : e[0].length == 2 && t.push([e[r][0] * n, e[r][1] * n]);
	return t;
}
function rad2deg(e) {
	var t = [], n = 180 / Math.PI;
	for (let r = 0; r < e.length; r++) e[0].length == 3 ? t.push([
		e[r][0] * n,
		e[r][1] * n,
		e[r][2]
	]) : e[0].length == 2 && t.push([e[r][0] * n, e[r][1] * n]);
	return t;
}
function getColumn(e, t) {
	return e.map(function(e) {
		return e[t];
	});
}
function sampleCircle(e) {
	for (var t = [], n = 360 / e, r = 0, i = 0; i < e; i++) t.push([
		r,
		0,
		1
	]), r += n;
	return t;
}
function getCircHarmonics(e, t) {
	var n = e, r = 2 * n + 1, i = t.length, a = Array(r), o = Array(i);
	t = numeric.mul(t, Math.PI / 180), o.fill(1 / Math.sqrt(2 * Math.PI)), a[0] = o;
	for (var s = 0; s < n; s++) a[2 * s + 1] = numeric.div(numeric.sin(numeric.mul(-(s + 1), t)), Math.sqrt(Math.PI)), a[2 * s + 2] = numeric.div(numeric.cos(numeric.mul(s + 1, t)), Math.sqrt(Math.PI));
	return a;
}
function getAmbisonicDecMtx(e, t) {
	var n = deg2rad(e), r = convertSph2Cart_1(n), i = convexhull(r), a = i.length, o = n.length, s = Array(a);
	for (let e = 0; e < a; e++) {
		let t = [
			,
			,
			,
		];
		for (let n = 0; n < 3; n++) t[n] = r[i[e][n]];
		let n = numeric.inv(t), a = [];
		for (let e = 0; e < 3; e++) for (let t = 0; t < 3; t++) a.push(n[t][e]);
		s[e] = a;
	}
	var c = deg2rad(getTdesign(2 * t)), l = vbap3(c, i, s, o);
	l = numeric.transpose(l);
	var u = computeRealSH_1(t, c);
	u = numeric.transpose(u);
	var d = c.length, f = numeric.dotMMsmall(l, u);
	return f = numeric.mul(1 / d, f), f;
}
var vbap3 = function(e, t, n, r) {
	var i = e.length, a = r, o = t.length;
	function s(e) {
		return Math.min.apply(null, e);
	}
	var c = Array(i), l = convertSph2Cart_1(e);
	for (let e = 0; e < i; e++) {
		let r = l[e], i = Array(a);
		i.fill(0);
		for (let e = 0; e < o; e++) {
			let a = [], o = [
				n[e][0],
				n[e][1],
				n[e][2]
			];
			if (a[0] = numeric.dotVV(o, r), o = [
				n[e][3],
				n[e][4],
				n[e][5]
			], a[1] = numeric.dotVV(o, r), o = [
				n[e][6],
				n[e][7],
				n[e][8]
			], a[2] = numeric.dotVV(o, r), s(a) > -.001) {
				let n = Math.sqrt(numeric.sum(numeric.pow(a, 2))), r = numeric.div(a, n);
				for (let n = 0; n < 3; n++) i[t[e][n]] = r[n];
				break;
			}
		}
		let u = Math.sqrt(numeric.sum(numeric.pow(i, 2))), d = numeric.div(i, u);
		c[e] = d;
	}
	return c;
};
function createNearestLookup(e, t) {
	var n = e.length, r = convertSph2Cart_1(deg2rad(e)), i = Math.round(360 / t[0]) + 1, a = Math.round(180 / t[1]) + 1, o = Array(i);
	o[0] = -180;
	for (let e = 1; e < i; e++) o[e] = o[e - 1] + t[0];
	var s = i * a, c = Array(s);
	for (let e = 0; e < s; e++) {
		let a = convertSph2Cart_1(deg2rad([[e % i * t[0] - 180, Math.floor(e / i) * t[1] - 90]])), o = 1e3;
		for (let t = 0; t < n; t++) {
			let n = numeric.sum(numeric.pow(numeric.sub(a[0], r[t]), 2));
			n < o && (c[e] = t, o = n);
		}
	}
	return c;
}
function findNearest(e, t, n) {
	var r = e.length, i = [], a = [];
	for (let t = 0; t < r; t++) i.push(e[t][0] + 180), a.push(e[t][1] + 90);
	var o = Math.round(360 / n[0]) + 1, s = numeric.round(numeric.div(numeric.mod(i, 360), n[0])), c = numeric.round(numeric.div(a, n[1])), l = numeric.add(numeric.mul(c, o), s, 1), u = [];
	for (let e = 0; e < r; e++) u.push(t[l[e]]);
	return u;
}
function getTdesign(e) {
	if (e > 21) throw Error("Designs of order greater than 21 are not implemented");
	if (e < 1) throw Error("Order should be at least 1");
	return [
		[[
			0,
			0,
			1
		], [
			180,
			0,
			1
		]],
		[
			[
				45,
				35.26,
				1
			],
			[
				-45,
				-35.26,
				1
			],
			[
				135,
				-35.26,
				1
			],
			[
				-135,
				35.26,
				1
			]
		],
		[
			[
				0,
				0,
				1
			],
			[
				180,
				0,
				1
			],
			[
				90,
				0,
				1
			],
			[
				-90,
				0,
				1
			],
			[
				0,
				90,
				1
			],
			[
				0,
				-90,
				1
			]
		],
		[
			[
				0,
				-31.72,
				1
			],
			[
				-58.28,
				0,
				1
			],
			[
				-90,
				58.28,
				1
			],
			[
				0,
				31.72,
				1
			],
			[
				-121.72,
				0,
				1
			],
			[
				90,
				-58.28,
				1
			],
			[
				180,
				-31.72,
				1
			],
			[
				121.72,
				0,
				1
			],
			[
				90,
				58.28,
				1
			],
			[
				180,
				31.72,
				1
			],
			[
				58.28,
				0,
				1
			],
			[
				-90,
				-58.28,
				1
			]
		],
		[
			[
				0,
				-31.72,
				1
			],
			[
				-58.28,
				0,
				1
			],
			[
				-90,
				58.28,
				1
			],
			[
				0,
				31.72,
				1
			],
			[
				-121.72,
				0,
				1
			],
			[
				90,
				-58.28,
				1
			],
			[
				180,
				-31.72,
				1
			],
			[
				121.72,
				0,
				1
			],
			[
				90,
				58.28,
				1
			],
			[
				180,
				31.72,
				1
			],
			[
				58.28,
				0,
				1
			],
			[
				-90,
				-58.28,
				1
			]
		],
		[
			[
				26,
				15.46,
				1
			],
			[
				-26,
				-15.46,
				1
			],
			[
				17.11,
				-24.99,
				1
			],
			[
				-17.11,
				24.99,
				1
			],
			[
				154,
				-15.46,
				1
			],
			[
				-154,
				15.46,
				1
			],
			[
				162.89,
				24.99,
				1
			],
			[
				-162.89,
				-24.99,
				1
			],
			[
				72.89,
				24.99,
				1
			],
			[
				107.11,
				-24.99,
				1
			],
			[
				116,
				15.46,
				1
			],
			[
				64,
				-15.46,
				1
			],
			[
				-107.11,
				24.99,
				1
			],
			[
				-72.89,
				-24.99,
				1
			],
			[
				-64,
				15.46,
				1
			],
			[
				-116,
				-15.46,
				1
			],
			[
				32.25,
				60.03,
				1
			],
			[
				-147.75,
				60.03,
				1
			],
			[
				-57.75,
				60.03,
				1
			],
			[
				122.25,
				60.03,
				1
			],
			[
				-32.25,
				-60.03,
				1
			],
			[
				147.75,
				-60.03,
				1
			],
			[
				57.75,
				-60.03,
				1
			],
			[
				-122.25,
				-60.03,
				1
			]
		],
		[
			[
				26,
				15.46,
				1
			],
			[
				-26,
				-15.46,
				1
			],
			[
				17.11,
				-24.99,
				1
			],
			[
				-17.11,
				24.99,
				1
			],
			[
				154,
				-15.46,
				1
			],
			[
				-154,
				15.46,
				1
			],
			[
				162.89,
				24.99,
				1
			],
			[
				-162.89,
				-24.99,
				1
			],
			[
				72.89,
				24.99,
				1
			],
			[
				107.11,
				-24.99,
				1
			],
			[
				116,
				15.46,
				1
			],
			[
				64,
				-15.46,
				1
			],
			[
				-107.11,
				24.99,
				1
			],
			[
				-72.89,
				-24.99,
				1
			],
			[
				-64,
				15.46,
				1
			],
			[
				-116,
				-15.46,
				1
			],
			[
				32.25,
				60.03,
				1
			],
			[
				-147.75,
				60.03,
				1
			],
			[
				-57.75,
				60.03,
				1
			],
			[
				122.25,
				60.03,
				1
			],
			[
				-32.25,
				-60.03,
				1
			],
			[
				147.75,
				-60.03,
				1
			],
			[
				57.75,
				-60.03,
				1
			],
			[
				-122.25,
				-60.03,
				1
			]
		],
		[
			[
				-31.11,
				53.65,
				1
			],
			[
				110.82,
				30.5,
				1
			],
			[
				148.89,
				53.65,
				1
			],
			[
				32.21,
				-17.83,
				1
			],
			[
				69.18,
				-30.5,
				1
			],
			[
				-32.21,
				17.83,
				1
			],
			[
				-69.18,
				30.5,
				1
			],
			[
				-147.79,
				-17.83,
				1
			],
			[
				-110.82,
				-30.5,
				1
			],
			[
				147.79,
				17.83,
				1
			],
			[
				31.11,
				-53.65,
				1
			],
			[
				-148.89,
				-53.65,
				1
			],
			[
				-21.25,
				-47.78,
				1
			],
			[
				-108.2,
				38.78,
				1
			],
			[
				158.75,
				-47.78,
				1
			],
			[
				139.77,
				-14.09,
				1
			],
			[
				-71.8,
				-38.78,
				1
			],
			[
				-139.77,
				14.09,
				1
			],
			[
				71.8,
				38.78,
				1
			],
			[
				-40.23,
				-14.09,
				1
			],
			[
				108.2,
				-38.78,
				1
			],
			[
				40.23,
				14.09,
				1
			],
			[
				21.25,
				47.78,
				1
			],
			[
				-158.75,
				47.78,
				1
			],
			[
				106.65,
				-2.55,
				1
			],
			[
				-2.66,
				-16.63,
				1
			],
			[
				-73.35,
				-2.55,
				1
			],
			[
				-98.84,
				73.16,
				1
			],
			[
				-177.34,
				16.63,
				1
			],
			[
				98.84,
				-73.16,
				1
			],
			[
				177.34,
				-16.63,
				1
			],
			[
				81.16,
				73.16,
				1
			],
			[
				2.66,
				16.63,
				1
			],
			[
				-81.16,
				-73.16,
				1
			],
			[
				-106.65,
				2.55,
				1
			],
			[
				73.35,
				2.55,
				1
			]
		],
		[
			[
				20.75,
				-3.55,
				1
			],
			[
				-20.75,
				3.55,
				1
			],
			[
				-3.8,
				-20.7,
				1
			],
			[
				3.8,
				20.7,
				1
			],
			[
				159.25,
				3.55,
				1
			],
			[
				-159.25,
				-3.55,
				1
			],
			[
				-176.2,
				20.7,
				1
			],
			[
				176.2,
				-20.7,
				1
			],
			[
				93.8,
				20.7,
				1
			],
			[
				86.2,
				-20.7,
				1
			],
			[
				110.75,
				-3.55,
				1
			],
			[
				69.25,
				3.55,
				1
			],
			[
				-86.2,
				20.7,
				1
			],
			[
				-93.8,
				-20.7,
				1
			],
			[
				-69.25,
				-3.55,
				1
			],
			[
				-110.75,
				3.55,
				1
			],
			[
				-9.94,
				68.97,
				1
			],
			[
				170.06,
				68.97,
				1
			],
			[
				-99.94,
				68.97,
				1
			],
			[
				80.06,
				68.97,
				1
			],
			[
				9.94,
				-68.97,
				1
			],
			[
				-170.06,
				-68.97,
				1
			],
			[
				99.94,
				-68.97,
				1
			],
			[
				-80.06,
				-68.97,
				1
			],
			[
				42.15,
				17.57,
				1
			],
			[
				-42.15,
				-17.57,
				1
			],
			[
				23.12,
				-39.77,
				1
			],
			[
				-23.12,
				39.77,
				1
			],
			[
				137.85,
				-17.57,
				1
			],
			[
				-137.85,
				17.57,
				1
			],
			[
				156.88,
				39.77,
				1
			],
			[
				-156.88,
				-39.77,
				1
			],
			[
				66.88,
				39.77,
				1
			],
			[
				113.12,
				-39.77,
				1
			],
			[
				132.15,
				17.57,
				1
			],
			[
				47.85,
				-17.57,
				1
			],
			[
				-113.12,
				39.77,
				1
			],
			[
				-66.88,
				-39.77,
				1
			],
			[
				-47.85,
				17.57,
				1
			],
			[
				-132.15,
				-17.57,
				1
			],
			[
				25.26,
				44.98,
				1
			],
			[
				-154.74,
				44.98,
				1
			],
			[
				-64.74,
				44.98,
				1
			],
			[
				115.26,
				44.98,
				1
			],
			[
				-25.26,
				-44.98,
				1
			],
			[
				154.74,
				-44.98,
				1
			],
			[
				64.74,
				-44.98,
				1
			],
			[
				-115.26,
				-44.98,
				1
			]
		],
		[
			[
				144.09,
				-21.45,
				1
			],
			[
				-33.81,
				-48.92,
				1
			],
			[
				-35.91,
				-21.45,
				1
			],
			[
				-115.87,
				33.09,
				1
			],
			[
				-146.19,
				48.92,
				1
			],
			[
				115.87,
				-33.09,
				1
			],
			[
				146.19,
				-48.92,
				1
			],
			[
				64.13,
				33.09,
				1
			],
			[
				33.81,
				48.92,
				1
			],
			[
				-64.13,
				-33.09,
				1
			],
			[
				-144.09,
				21.45,
				1
			],
			[
				35.91,
				21.45,
				1
			],
			[
				-45.53,
				1.95,
				1
			],
			[
				177.26,
				44.44,
				1
			],
			[
				134.47,
				1.95,
				1
			],
			[
				87.21,
				-45.49,
				1
			],
			[
				2.74,
				-44.44,
				1
			],
			[
				-87.21,
				45.49,
				1
			],
			[
				-2.74,
				44.44,
				1
			],
			[
				-92.79,
				-45.49,
				1
			],
			[
				-177.26,
				-44.44,
				1
			],
			[
				92.79,
				45.49,
				1
			],
			[
				45.53,
				-1.95,
				1
			],
			[
				-134.47,
				-1.95,
				1
			],
			[
				15.59,
				-73.34,
				1
			],
			[
				-85.4,
				16.04,
				1
			],
			[
				-164.41,
				-73.34,
				1
			],
			[
				163.92,
				4.42,
				1
			],
			[
				-94.6,
				-16.04,
				1
			],
			[
				-163.92,
				-4.42,
				1
			],
			[
				94.6,
				16.04,
				1
			],
			[
				-16.08,
				4.42,
				1
			],
			[
				85.4,
				-16.04,
				1
			],
			[
				16.08,
				-4.42,
				1
			],
			[
				-15.59,
				73.34,
				1
			],
			[
				164.41,
				73.34,
				1
			],
			[
				-60.02,
				25.27,
				1
			],
			[
				151.41,
				26.86,
				1
			],
			[
				119.98,
				25.27,
				1
			],
			[
				46.63,
				-51.57,
				1
			],
			[
				28.59,
				-26.86,
				1
			],
			[
				-46.63,
				51.57,
				1
			],
			[
				-28.59,
				26.86,
				1
			],
			[
				-133.37,
				-51.57,
				1
			],
			[
				-151.41,
				-26.86,
				1
			],
			[
				133.37,
				51.57,
				1
			],
			[
				60.02,
				-25.27,
				1
			],
			[
				-119.98,
				-25.27,
				1
			],
			[
				-109.94,
				6.91,
				1
			],
			[
				172.65,
				-19.79,
				1
			],
			[
				70.06,
				6.91,
				1
			],
			[
				-70.44,
				-68.94,
				1
			],
			[
				7.35,
				19.79,
				1
			],
			[
				70.44,
				68.94,
				1
			],
			[
				-7.35,
				-19.79,
				1
			],
			[
				109.56,
				-68.94,
				1
			],
			[
				-172.65,
				19.79,
				1
			],
			[
				-109.56,
				68.94,
				1
			],
			[
				109.94,
				-6.91,
				1
			],
			[
				-70.06,
				-6.91,
				1
			]
		],
		[
			[
				132.93,
				7.69,
				1
			],
			[
				-83.93,
				-23.73,
				1
			],
			[
				8.47,
				23.51,
				1
			],
			[
				-113.34,
				70.42,
				1
			],
			[
				-103.27,
				-9.9,
				1
			],
			[
				-33.24,
				-70.75,
				1
			],
			[
				21.86,
				-26.46,
				1
			],
			[
				-156.54,
				47.78,
				1
			],
			[
				-64.26,
				-7.72,
				1
			],
			[
				165.78,
				44.53,
				1
			],
			[
				-25.2,
				26.39,
				1
			],
			[
				-97,
				-44.66,
				1
			],
			[
				27.85,
				9.77,
				1
			],
			[
				153.21,
				-47.71,
				1
			],
			[
				-155.06,
				7.45,
				1
			],
			[
				-11.84,
				-23.59,
				1
			],
			[
				80.54,
				23.72,
				1
			],
			[
				-42.06,
				70.44,
				1
			],
			[
				-31.22,
				-9.84,
				1
			],
			[
				38.84,
				-70.5,
				1
			],
			[
				93.76,
				-26.29,
				1
			],
			[
				-84.76,
				47.61,
				1
			],
			[
				7.76,
				-7.52,
				1
			],
			[
				-122.28,
				44.29,
				1
			],
			[
				46.8,
				26.64,
				1
			],
			[
				-24.77,
				-44.57,
				1
			],
			[
				99.89,
				9.91,
				1
			],
			[
				-134.78,
				-47.96,
				1
			],
			[
				-83.09,
				7.3,
				1
			],
			[
				60.13,
				-23.34,
				1
			],
			[
				152.64,
				23.64,
				1
			],
			[
				29.76,
				70.68,
				1
			],
			[
				40.78,
				-9.58,
				1
			],
			[
				110.18,
				-70.39,
				1
			],
			[
				165.65,
				-26.43,
				1
			],
			[
				-12.99,
				47.75,
				1
			],
			[
				79.74,
				-7.31,
				1
			],
			[
				-50.52,
				44.26,
				1
			],
			[
				118.92,
				26.71,
				1
			],
			[
				47.22,
				-44.31,
				1
			],
			[
				171.93,
				9.76,
				1
			],
			[
				-62.51,
				-48.04,
				1
			],
			[
				-11.12,
				7.44,
				1
			],
			[
				132.02,
				-23.33,
				1
			],
			[
				-135.36,
				23.39,
				1
			],
			[
				102.37,
				70.82,
				1
			],
			[
				112.74,
				-9.49,
				1
			],
			[
				-178.3,
				-70.58,
				1
			],
			[
				-122.32,
				-26.67,
				1
			],
			[
				59.08,
				48,
				1
			],
			[
				151.7,
				-7.38,
				1
			],
			[
				21.38,
				44.5,
				1
			],
			[
				-169.01,
				26.5,
				1
			],
			[
				118.98,
				-44.25,
				1
			],
			[
				-116.09,
				9.52,
				1
			],
			[
				9.65,
				-47.83,
				1
			],
			[
				60.89,
				7.68,
				1
			],
			[
				-156.02,
				-23.57,
				1
			],
			[
				-63.46,
				23.31,
				1
			],
			[
				174.93,
				70.66,
				1
			],
			[
				-175.29,
				-9.68,
				1
			],
			[
				-105.95,
				-70.8,
				1
			],
			[
				-50.19,
				-26.7,
				1
			],
			[
				131.36,
				48.01,
				1
			],
			[
				-136.3,
				-7.64,
				1
			],
			[
				93.56,
				44.67,
				1
			],
			[
				-97.08,
				26.3,
				1
			],
			[
				-169.16,
				-44.46,
				1
			],
			[
				-44.13,
				9.52,
				1
			],
			[
				81.48,
				-47.62,
				1
			]
		],
		[
			[
				-154.47,
				7.9,
				1
			],
			[
				162.15,
				-63.36,
				1
			],
			[
				25.53,
				7.9,
				1
			],
			[
				-81.26,
				-25.27,
				1
			],
			[
				17.85,
				63.36,
				1
			],
			[
				81.26,
				25.27,
				1
			],
			[
				-17.85,
				-63.36,
				1
			],
			[
				98.74,
				-25.27,
				1
			],
			[
				-162.15,
				63.36,
				1
			],
			[
				-98.74,
				25.27,
				1
			],
			[
				154.47,
				-7.9,
				1
			],
			[
				-25.53,
				-7.9,
				1
			],
			[
				1.3,
				-10.47,
				1
			],
			[
				-83.01,
				79.45,
				1
			],
			[
				-178.7,
				-10.47,
				1
			],
			[
				100.48,
				1.28,
				1
			],
			[
				-96.99,
				-79.45,
				1
			],
			[
				-100.48,
				-1.28,
				1
			],
			[
				96.99,
				79.45,
				1
			],
			[
				-79.52,
				1.28,
				1
			],
			[
				83.01,
				-79.45,
				1
			],
			[
				79.52,
				-1.28,
				1
			],
			[
				-1.3,
				10.47,
				1
			],
			[
				178.7,
				10.47,
				1
			],
			[
				157.24,
				13.15,
				1
			],
			[
				31.14,
				-63.89,
				1
			],
			[
				-22.76,
				13.15,
				1
			],
			[
				-75.78,
				22.13,
				1
			],
			[
				148.86,
				63.89,
				1
			],
			[
				75.78,
				-22.13,
				1
			],
			[
				-148.86,
				-63.89,
				1
			],
			[
				104.22,
				22.13,
				1
			],
			[
				-31.14,
				63.89,
				1
			],
			[
				-104.22,
				-22.13,
				1
			],
			[
				-157.24,
				-13.15,
				1
			],
			[
				22.76,
				-13.15,
				1
			],
			[
				110.44,
				-60.62,
				1
			],
			[
				-62.18,
				-9.87,
				1
			],
			[
				-69.56,
				-60.62,
				1
			],
			[
				-168.88,
				27.37,
				1
			],
			[
				-117.82,
				9.87,
				1
			],
			[
				168.88,
				-27.37,
				1
			],
			[
				117.82,
				-9.87,
				1
			],
			[
				11.12,
				27.37,
				1
			],
			[
				62.18,
				9.87,
				1
			],
			[
				-11.12,
				-27.37,
				1
			],
			[
				-110.44,
				60.62,
				1
			],
			[
				69.56,
				60.62,
				1
			],
			[
				-125.93,
				-47.4,
				1
			],
			[
				-126.67,
				-23.4,
				1
			],
			[
				54.07,
				-47.4,
				1
			],
			[
				-151.65,
				-33.24,
				1
			],
			[
				-53.33,
				23.4,
				1
			],
			[
				151.65,
				33.24,
				1
			],
			[
				53.33,
				-23.4,
				1
			],
			[
				28.35,
				-33.24,
				1
			],
			[
				126.67,
				23.4,
				1
			],
			[
				-28.35,
				33.24,
				1
			],
			[
				125.93,
				47.4,
				1
			],
			[
				-54.07,
				47.4,
				1
			],
			[
				61.41,
				37.54,
				1
			],
			[
				41.19,
				22.3,
				1
			],
			[
				-118.59,
				37.54,
				1
			],
			[
				31.92,
				44.13,
				1
			],
			[
				138.81,
				-22.3,
				1
			],
			[
				-31.92,
				-44.13,
				1
			],
			[
				-138.81,
				22.3,
				1
			],
			[
				-148.08,
				44.13,
				1
			],
			[
				-41.19,
				-22.3,
				1
			],
			[
				148.08,
				-44.13,
				1
			],
			[
				-61.41,
				-37.54,
				1
			],
			[
				118.59,
				-37.54,
				1
			],
			[
				132.92,
				4.73,
				1
			],
			[
				6.45,
				-42.74,
				1
			],
			[
				-47.08,
				4.73,
				1
			],
			[
				-83.07,
				46.87,
				1
			],
			[
				173.55,
				42.74,
				1
			],
			[
				83.07,
				-46.87,
				1
			],
			[
				-173.55,
				-42.74,
				1
			],
			[
				96.93,
				46.87,
				1
			],
			[
				-6.45,
				42.74,
				1
			],
			[
				-96.93,
				-46.87,
				1
			],
			[
				-132.92,
				-4.73,
				1
			],
			[
				47.08,
				-4.73,
				1
			]
		],
		[
			[
				-40.36,
				68.7,
				1
			],
			[
				61.12,
				65.68,
				1
			],
			[
				141.73,
				70.75,
				1
			],
			[
				-131.25,
				72.32,
				1
			],
			[
				-154.88,
				-12.62,
				1
			],
			[
				-66.2,
				-9.78,
				1
			],
			[
				26.36,
				-11.97,
				1
			],
			[
				114.95,
				-12.58,
				1
			],
			[
				37.02,
				51.13,
				1
			],
			[
				129.77,
				51.95,
				1
			],
			[
				-140.63,
				50.15,
				1
			],
			[
				-56.5,
				47.88,
				1
			],
			[
				-65.05,
				12.58,
				1
			],
			[
				25.12,
				12.62,
				1
			],
			[
				113.8,
				9.78,
				1
			],
			[
				-153.64,
				11.97,
				1
			],
			[
				-134.51,
				-9.73,
				1
			],
			[
				-46.23,
				-8.37,
				1
			],
			[
				47.91,
				-9.73,
				1
			],
			[
				141.51,
				-8.73,
				1
			],
			[
				-17.84,
				-44.1,
				1
			],
			[
				69.37,
				-43.27,
				1
			],
			[
				151.22,
				-42.67,
				1
			],
			[
				-106.78,
				-40.18,
				1
			],
			[
				-50.23,
				-51.95,
				1
			],
			[
				39.37,
				-50.15,
				1
			],
			[
				123.5,
				-47.88,
				1
			],
			[
				-142.98,
				-51.13,
				1
			],
			[
				-179.19,
				-60.75,
				1
			],
			[
				-84.57,
				-54.07,
				1
			],
			[
				5.39,
				-58.05,
				1
			],
			[
				89.5,
				-60.75,
				1
			],
			[
				-145.98,
				31.02,
				1
			],
			[
				-54.39,
				26.43,
				1
			],
			[
				28.92,
				32.51,
				1
			],
			[
				125.34,
				30.94,
				1
			],
			[
				168.71,
				-7.06,
				1
			],
			[
				-112.49,
				-10.38,
				1
			],
			[
				-21.96,
				-9.6,
				1
			],
			[
				73.11,
				-8.31,
				1
			],
			[
				95.68,
				.04,
				1
			],
			[
				-170.71,
				2.32,
				1
			],
			[
				-84.32,
				-.04,
				1
			],
			[
				9.29,
				-2.32,
				1
			],
			[
				9.19,
				-34.33,
				1
			],
			[
				98.21,
				-37.31,
				1
			],
			[
				-179.2,
				-40.48,
				1
			],
			[
				-77.81,
				-31.6,
				1
			],
			[
				-177.08,
				-21.74,
				1
			],
			[
				-93.77,
				-18.83,
				1
			],
			[
				-2.72,
				-19.8,
				1
			],
			[
				90.51,
				-20.91,
				1
			],
			[
				-106.89,
				8.31,
				1
			],
			[
				-11.29,
				7.06,
				1
			],
			[
				67.51,
				10.38,
				1
			],
			[
				158.04,
				9.6,
				1
			],
			[
				-118.88,
				-65.68,
				1
			],
			[
				-38.27,
				-70.75,
				1
			],
			[
				48.75,
				-72.32,
				1
			],
			[
				139.64,
				-68.7,
				1
			],
			[
				-54.66,
				-30.94,
				1
			],
			[
				34.02,
				-31.02,
				1
			],
			[
				125.61,
				-26.43,
				1
			],
			[
				-151.08,
				-32.51,
				1
			],
			[
				-170.81,
				34.33,
				1
			],
			[
				-81.79,
				37.31,
				1
			],
			[
				.8,
				40.48,
				1
			],
			[
				102.19,
				31.6,
				1
			],
			[
				-28.78,
				42.67,
				1
			],
			[
				73.22,
				40.18,
				1
			],
			[
				162.16,
				44.1,
				1
			],
			[
				-110.63,
				43.27,
				1
			],
			[
				-89.49,
				20.91,
				1
			],
			[
				2.92,
				21.74,
				1
			],
			[
				86.23,
				18.83,
				1
			],
			[
				177.28,
				19.8,
				1
			],
			[
				133.77,
				8.37,
				1
			],
			[
				-132.09,
				9.73,
				1
			],
			[
				-38.49,
				8.73,
				1
			],
			[
				45.49,
				9.73,
				1
			],
			[
				-25.6,
				24.04,
				1
			],
			[
				55.12,
				30.23,
				1
			],
			[
				149.3,
				28.05,
				1
			],
			[
				-118.71,
				26.06,
				1
			],
			[
				.81,
				60.75,
				1
			],
			[
				95.43,
				54.07,
				1
			],
			[
				-174.61,
				58.05,
				1
			],
			[
				-90.5,
				60.75,
				1
			],
			[
				-124.88,
				-30.23,
				1
			],
			[
				-30.7,
				-28.05,
				1
			],
			[
				61.29,
				-26.06,
				1
			],
			[
				154.4,
				-24.04,
				1
			],
			[
				-132.92,
				-85.6,
				1
			],
			[
				47.08,
				85.6,
				1
			]
		],
		[
			[
				-129.19,
				8.11,
				1
			],
			[
				169.58,
				-38.73,
				1
			],
			[
				50.81,
				8.12,
				1
			],
			[
				-77.27,
				-50.11,
				1
			],
			[
				10.42,
				38.73,
				1
			],
			[
				77.3,
				50.12,
				1
			],
			[
				-10.41,
				-38.72,
				1
			],
			[
				102.71,
				-50.11,
				1
			],
			[
				-169.57,
				38.72,
				1
			],
			[
				-102.71,
				50.11,
				1
			],
			[
				129.19,
				-8.11,
				1
			],
			[
				-50.8,
				-8.11,
				1
			],
			[
				-4.59,
				-56.01,
				1
			],
			[
				-93.1,
				33.85,
				1
			],
			[
				175.39,
				-56.03,
				1
			],
			[
				146.11,
				-2.57,
				1
			],
			[
				-86.89,
				-33.86,
				1
			],
			[
				-146.1,
				2.56,
				1
			],
			[
				86.91,
				33.86,
				1
			],
			[
				-33.89,
				-2.57,
				1
			],
			[
				93.1,
				-33.85,
				1
			],
			[
				33.9,
				2.58,
				1
			],
			[
				4.6,
				56.03,
				1
			],
			[
				-175.38,
				56.01,
				1
			],
			[
				106.57,
				26.1,
				1
			],
			[
				27.07,
				-14.82,
				1
			],
			[
				-73.44,
				26.09,
				1
			],
			[
				-30.2,
				59.41,
				1
			],
			[
				152.94,
				14.83,
				1
			],
			[
				30.2,
				-59.4,
				1
			],
			[
				-152.93,
				-14.84,
				1
			],
			[
				149.82,
				59.41,
				1
			],
			[
				-27.06,
				14.83,
				1
			],
			[
				-149.8,
				-59.42,
				1
			],
			[
				-106.55,
				-26.1,
				1
			],
			[
				73.44,
				-26.09,
				1
			],
			[
				-171.42,
				77.45,
				1
			],
			[
				91.9,
				-12.4,
				1
			],
			[
				8.54,
				77.46,
				1
			],
			[
				-12.4,
				-1.85,
				1
			],
			[
				88.11,
				12.41,
				1
			],
			[
				12.41,
				1.86,
				1
			],
			[
				-88.1,
				-12.41,
				1
			],
			[
				167.6,
				-1.86,
				1
			],
			[
				-91.89,
				12.4,
				1
			],
			[
				-167.59,
				1.84,
				1
			],
			[
				171.43,
				-77.46,
				1
			],
			[
				-8.52,
				-77.45,
				1
			],
			[
				-122.73,
				-10.44,
				1
			],
			[
				-167.65,
				-32.13,
				1
			],
			[
				57.27,
				-10.43,
				1
			],
			[
				-108.8,
				-55.83,
				1
			],
			[
				-12.35,
				32.13,
				1
			],
			[
				108.83,
				55.83,
				1
			],
			[
				12.36,
				-32.12,
				1
			],
			[
				71.19,
				-55.82,
				1
			],
			[
				167.66,
				32.12,
				1
			],
			[
				-71.19,
				55.82,
				1
			],
			[
				122.74,
				10.44,
				1
			],
			[
				-57.27,
				10.44,
				1
			],
			[
				-135.84,
				-23.05,
				1
			],
			[
				-148.58,
				-41.32,
				1
			],
			[
				44.16,
				-23.04,
				1
			],
			[
				-120.66,
				-39.88,
				1
			],
			[
				-31.41,
				41.31,
				1
			],
			[
				120.68,
				39.87,
				1
			],
			[
				31.42,
				-41.3,
				1
			],
			[
				59.33,
				-39.86,
				1
			],
			[
				148.6,
				41.31,
				1
			],
			[
				-59.33,
				39.87,
				1
			],
			[
				135.85,
				23.05,
				1
			],
			[
				-44.16,
				23.05,
				1
			],
			[
				-161.55,
				20.62,
				1
			],
			[
				130.04,
				-62.6,
				1
			],
			[
				18.45,
				20.64,
				1
			],
			[
				-68.35,
				-17.23,
				1
			],
			[
				49.96,
				62.61,
				1
			],
			[
				68.36,
				17.23,
				1
			],
			[
				-49.93,
				-62.6,
				1
			],
			[
				111.65,
				-17.22,
				1
			],
			[
				-130.05,
				62.59,
				1
			],
			[
				-111.64,
				17.22,
				1
			],
			[
				161.56,
				-20.63,
				1
			],
			[
				-18.44,
				-20.62,
				1
			],
			[
				-105.23,
				-3.38,
				1
			],
			[
				-176.5,
				-15.21,
				1
			],
			[
				74.77,
				-3.37,
				1
			],
			[
				-102.64,
				-74.41,
				1
			],
			[
				-3.5,
				15.21,
				1
			],
			[
				102.69,
				74.41,
				1
			],
			[
				3.51,
				-15.2,
				1
			],
			[
				77.33,
				-74.4,
				1
			],
			[
				176.51,
				15.2,
				1
			],
			[
				-77.36,
				74.4,
				1
			],
			[
				105.24,
				3.38,
				1
			],
			[
				-74.76,
				3.37,
				1
			],
			[
				-142.39,
				25.42,
				1
			],
			[
				142.08,
				-45.69,
				1
			],
			[
				37.61,
				25.43,
				1
			],
			[
				-59.02,
				-33.44,
				1
			],
			[
				37.92,
				45.69,
				1
			],
			[
				59.04,
				33.45,
				1
			],
			[
				-37.91,
				-45.68,
				1
			],
			[
				120.97,
				-33.44,
				1
			],
			[
				-142.07,
				45.68,
				1
			],
			[
				-120.96,
				33.44,
				1
			],
			[
				142.4,
				-25.43,
				1
			],
			[
				-37.6,
				-25.42,
				1
			]
		],
		[
			[
				-30.6,
				6.94,
				1
			],
			[
				166.56,
				58.69,
				1
			],
			[
				149.4,
				6.96,
				1
			],
			[
				81.95,
				-30.36,
				1
			],
			[
				13.48,
				-58.69,
				1
			],
			[
				-81.93,
				30.36,
				1
			],
			[
				-13.46,
				58.68,
				1
			],
			[
				-98.06,
				-30.37,
				1
			],
			[
				-166.54,
				-58.68,
				1
			],
			[
				98.07,
				30.37,
				1
			],
			[
				30.62,
				-6.95,
				1
			],
			[
				-149.38,
				-6.95,
				1
			],
			[
				106.69,
				-22.68,
				1
			],
			[
				-23.57,
				-15.36,
				1
			],
			[
				-73.31,
				-22.69,
				1
			],
			[
				-145.5,
				62.1,
				1
			],
			[
				-156.41,
				15.36,
				1
			],
			[
				145.53,
				-62.1,
				1
			],
			[
				156.43,
				-15.35,
				1
			],
			[
				34.47,
				62.11,
				1
			],
			[
				23.58,
				15.36,
				1
			],
			[
				-34.46,
				-62.11,
				1
			],
			[
				-106.67,
				22.68,
				1
			],
			[
				73.33,
				22.69,
				1
			],
			[
				166.82,
				1.39,
				1
			],
			[
				6.09,
				-76.74,
				1
			],
			[
				-13.19,
				1.38,
				1
			],
			[
				-88.57,
				13.18,
				1
			],
			[
				173.99,
				76.74,
				1
			],
			[
				88.59,
				-13.18,
				1
			],
			[
				-173.97,
				-76.73,
				1
			],
			[
				91.43,
				13.2,
				1
			],
			[
				-6.07,
				76.73,
				1
			],
			[
				-91.42,
				-13.2,
				1
			],
			[
				-166.8,
				-1.38,
				1
			],
			[
				13.2,
				-1.39,
				1
			],
			[
				-74.67,
				48.11,
				1
			],
			[
				130.86,
				10.16,
				1
			],
			[
				105.32,
				48.13,
				1
			],
			[
				13.34,
				-40.08,
				1
			],
			[
				49.16,
				-10.15,
				1
			],
			[
				-13.32,
				40.07,
				1
			],
			[
				-49.14,
				10.15,
				1
			],
			[
				-166.67,
				-40.08,
				1
			],
			[
				-130.84,
				-10.16,
				1
			],
			[
				166.69,
				40.08,
				1
			],
			[
				74.7,
				-48.11,
				1
			],
			[
				-105.31,
				-48.13,
				1
			],
			[
				-126.99,
				26.55,
				1
			],
			[
				147.96,
				-32.57,
				1
			],
			[
				53,
				26.56,
				1
			],
			[
				-50.28,
				-45.59,
				1
			],
			[
				32.05,
				32.58,
				1
			],
			[
				50.3,
				45.59,
				1
			],
			[
				-32.03,
				-32.58,
				1
			],
			[
				129.71,
				-45.58,
				1
			],
			[
				-147.94,
				32.57,
				1
			],
			[
				-129.69,
				45.58,
				1
			],
			[
				127.02,
				-26.55,
				1
			],
			[
				-52.98,
				-26.56,
				1
			],
			[
				-171.93,
				30.37,
				1
			],
			[
				103.47,
				-58.68,
				1
			],
			[
				8.07,
				30.36,
				1
			],
			[
				-59.38,
				-6.96,
				1
			],
			[
				76.54,
				58.69,
				1
			],
			[
				59.4,
				6.95,
				1
			],
			[
				-76.53,
				-58.69,
				1
			],
			[
				120.62,
				-6.94,
				1
			],
			[
				-103.44,
				58.68,
				1
			],
			[
				-120.6,
				6.95,
				1
			],
			[
				171.94,
				-30.36,
				1
			],
			[
				-8.05,
				-30.37,
				1
			],
			[
				40.86,
				10.16,
				1
			],
			[
				15.32,
				48.12,
				1
			],
			[
				-139.14,
				10.16,
				1
			],
			[
				76.68,
				40.09,
				1
			],
			[
				164.69,
				-48.12,
				1
			],
			[
				-76.67,
				-40.09,
				1
			],
			[
				-164.67,
				48.12,
				1
			],
			[
				-103.31,
				40.07,
				1
			],
			[
				-15.3,
				-48.13,
				1
			],
			[
				103.34,
				-40.07,
				1
			],
			[
				-40.84,
				-10.16,
				1
			],
			[
				139.16,
				-10.15,
				1
			],
			[
				103.2,
				-1.38,
				1
			],
			[
				-1.41,
				-13.19,
				1
			],
			[
				-76.8,
				-1.39,
				1
			],
			[
				-96.02,
				76.73,
				1
			],
			[
				-178.57,
				13.19,
				1
			],
			[
				96.07,
				-76.73,
				1
			],
			[
				178.58,
				-13.19,
				1
			],
			[
				83.94,
				76.74,
				1
			],
			[
				1.43,
				13.19,
				1
			],
			[
				-83.95,
				-76.74,
				1
			],
			[
				-103.18,
				1.38,
				1
			],
			[
				76.81,
				1.39,
				1
			],
			[
				37.02,
				-26.56,
				1
			],
			[
				-39.7,
				45.58,
				1
			],
			[
				-142.99,
				-26.56,
				1
			],
			[
				122.05,
				32.58,
				1
			],
			[
				-140.29,
				-45.59,
				1
			],
			[
				-122.04,
				-32.58,
				1
			],
			[
				140.31,
				45.59,
				1
			],
			[
				-57.95,
				32.57,
				1
			],
			[
				39.72,
				-45.58,
				1
			],
			[
				57.97,
				-32.57,
				1
			],
			[
				-37,
				26.55,
				1
			],
			[
				143,
				26.56,
				1
			],
			[
				163.33,
				22.69,
				1
			],
			[
				55.55,
				-62.1,
				1
			],
			[
				-16.67,
				22.68,
				1
			],
			[
				-66.41,
				15.35,
				1
			],
			[
				124.49,
				62.11,
				1
			],
			[
				66.43,
				-15.35,
				1
			],
			[
				-124.48,
				-62.11,
				1
			],
			[
				113.58,
				15.36,
				1
			],
			[
				-55.52,
				62.1,
				1
			],
			[
				-113.57,
				-15.36,
				1
			],
			[
				-163.31,
				-22.68,
				1
			],
			[
				16.69,
				-22.69,
				1
			]
		],
		[
			[
				-10.57,
				-17.35,
				1
			],
			[
				-120.42,
				69.76,
				1
			],
			[
				169.43,
				-17.35,
				1
			],
			[
				107.63,
				-10.08,
				1
			],
			[
				-59.57,
				-69.78,
				1
			],
			[
				-107.63,
				10.08,
				1
			],
			[
				59.57,
				69.78,
				1
			],
			[
				-72.37,
				-10.09,
				1
			],
			[
				120.42,
				-69.76,
				1
			],
			[
				72.37,
				10.09,
				1
			],
			[
				10.57,
				17.35,
				1
			],
			[
				-169.43,
				17.35,
				1
			],
			[
				-30.77,
				68.25,
				1
			],
			[
				101.53,
				18.57,
				1
			],
			[
				149.25,
				68.26,
				1
			],
			[
				18.92,
				-10.92,
				1
			],
			[
				78.47,
				-18.56,
				1
			],
			[
				-18.92,
				10.92,
				1
			],
			[
				-78.47,
				18.56,
				1
			],
			[
				-161.09,
				-10.92,
				1
			],
			[
				-101.53,
				-18.56,
				1
			],
			[
				161.09,
				10.92,
				1
			],
			[
				30.78,
				-68.26,
				1
			],
			[
				-149.26,
				-68.26,
				1
			],
			[
				56.46,
				41.26,
				1
			],
			[
				46.46,
				24.54,
				1
			],
			[
				-123.53,
				41.26,
				1
			],
			[
				32.19,
				38.8,
				1
			],
			[
				133.53,
				-24.53,
				1
			],
			[
				-32.19,
				-38.8,
				1
			],
			[
				-133.53,
				24.53,
				1
			],
			[
				-147.8,
				38.8,
				1
			],
			[
				-46.46,
				-24.54,
				1
			],
			[
				147.8,
				-38.8,
				1
			],
			[
				-56.46,
				-41.27,
				1
			],
			[
				123.53,
				-41.26,
				1
			],
			[
				84.74,
				27.31,
				1
			],
			[
				27.41,
				4.68,
				1
			],
			[
				-95.26,
				27.3,
				1
			],
			[
				10.06,
				62.23,
				1
			],
			[
				152.59,
				-4.67,
				1
			],
			[
				-10.06,
				-62.23,
				1
			],
			[
				-152.59,
				4.67,
				1
			],
			[
				-169.92,
				62.23,
				1
			],
			[
				-27.4,
				-4.68,
				1
			],
			[
				169.92,
				-62.22,
				1
			],
			[
				-84.74,
				-27.31,
				1
			],
			[
				95.26,
				-27.3,
				1
			],
			[
				136.27,
				-.73,
				1
			],
			[
				-1.05,
				-46.27,
				1
			],
			[
				-43.73,
				-.74,
				1
			],
			[
				-91.01,
				43.72,
				1
			],
			[
				-178.94,
				46.27,
				1
			],
			[
				91.01,
				-43.72,
				1
			],
			[
				178.94,
				-46.27,
				1
			],
			[
				88.99,
				43.73,
				1
			],
			[
				1.05,
				46.27,
				1
			],
			[
				-88.99,
				-43.73,
				1
			],
			[
				-136.27,
				.73,
				1
			],
			[
				43.73,
				.73,
				1
			],
			[
				55.23,
				10.82,
				1
			],
			[
				13.09,
				34.07,
				1
			],
			[
				-124.77,
				10.81,
				1
			],
			[
				71.48,
				53.8,
				1
			],
			[
				166.91,
				-34.06,
				1
			],
			[
				-71.48,
				-53.8,
				1
			],
			[
				-166.9,
				34.06,
				1
			],
			[
				-108.52,
				53.79,
				1
			],
			[
				-13.09,
				-34.06,
				1
			],
			[
				108.52,
				-53.79,
				1
			],
			[
				-55.23,
				-10.82,
				1
			],
			[
				124.77,
				-10.81,
				1
			],
			[
				-105.49,
				-68.13,
				1
			],
			[
				-111.15,
				-5.71,
				1
			],
			[
				74.52,
				-68.12,
				1
			],
			[
				-173.89,
				-21.04,
				1
			],
			[
				-68.85,
				5.7,
				1
			],
			[
				173.89,
				21.04,
				1
			],
			[
				68.85,
				-5.7,
				1
			],
			[
				6.12,
				-21.04,
				1
			],
			[
				111.15,
				5.71,
				1
			],
			[
				-6.12,
				21.04,
				1
			],
			[
				105.49,
				68.13,
				1
			],
			[
				-74.52,
				68.12,
				1
			],
			[
				35.28,
				-15.18,
				1
			],
			[
				-25.17,
				51.98,
				1
			],
			[
				-144.72,
				-15.19,
				1
			],
			[
				108.39,
				33.88,
				1
			],
			[
				-154.84,
				-51.99,
				1
			],
			[
				-108.39,
				-33.88,
				1
			],
			[
				154.84,
				51.99,
				1
			],
			[
				-71.61,
				33.87,
				1
			],
			[
				25.17,
				-51.98,
				1
			],
			[
				71.61,
				-33.87,
				1
			],
			[
				-35.28,
				15.18,
				1
			],
			[
				144.72,
				15.19,
				1
			],
			[
				-125.28,
				-28.56,
				1
			],
			[
				-146.32,
				-30.49,
				1
			],
			[
				54.72,
				-28.55,
				1
			],
			[
				-133.29,
				-45.82,
				1
			],
			[
				-33.69,
				30.48,
				1
			],
			[
				133.3,
				45.82,
				1
			],
			[
				33.68,
				-30.48,
				1
			],
			[
				46.71,
				-45.81,
				1
			],
			[
				146.32,
				30.49,
				1
			],
			[
				-46.71,
				45.81,
				1
			],
			[
				125.28,
				28.56,
				1
			],
			[
				-54.72,
				28.54,
				1
			],
			[
				-144.4,
				54.71,
				1
			],
			[
				112.38,
				-28.01,
				1
			],
			[
				35.58,
				54.72,
				1
			],
			[
				-29.92,
				-19.65,
				1
			],
			[
				67.62,
				28.02,
				1
			],
			[
				29.92,
				19.65,
				1
			],
			[
				-67.62,
				-28.02,
				1
			],
			[
				150.08,
				-19.64,
				1
			],
			[
				-112.38,
				28.01,
				1
			],
			[
				-150.08,
				19.64,
				1
			],
			[
				144.4,
				-54.71,
				1
			],
			[
				-35.58,
				-54.72,
				1
			],
			[
				68.53,
				-52.85,
				1
			],
			[
				-54.82,
				12.76,
				1
			],
			[
				-111.46,
				-52.87,
				1
			],
			[
				164.51,
				34.19,
				1
			],
			[
				-125.18,
				-12.77,
				1
			],
			[
				-164.51,
				-34.19,
				1
			],
			[
				125.18,
				12.77,
				1
			],
			[
				-15.5,
				34.19,
				1
			],
			[
				54.82,
				-12.76,
				1
			],
			[
				15.49,
				-34.19,
				1
			],
			[
				-68.53,
				52.85,
				1
			],
			[
				111.47,
				52.86,
				1
			],
			[
				91.48,
				-7.37,
				1
			],
			[
				-7.38,
				-1.47,
				1
			],
			[
				-88.52,
				-7.38,
				1
			],
			[
				-168.69,
				82.47,
				1
			],
			[
				-172.62,
				1.47,
				1
			],
			[
				168.69,
				-82.47,
				1
			],
			[
				172.62,
				-1.46,
				1
			],
			[
				11.22,
				82.48,
				1
			],
			[
				7.38,
				1.47,
				1
			],
			[
				-11.21,
				-82.48,
				1
			],
			[
				-91.48,
				7.37,
				1
			],
			[
				88.52,
				7.38,
				1
			]
		],
		[
			[
				-110.97,
				-81.34,
				1
			],
			[
				-98.09,
				-3.09,
				1
			],
			[
				69.03,
				-81.34,
				1
			],
			[
				-176.88,
				-8.08,
				1
			],
			[
				-81.91,
				3.09,
				1
			],
			[
				176.88,
				8.08,
				1
			],
			[
				81.91,
				-3.09,
				1
			],
			[
				3.12,
				-8.08,
				1
			],
			[
				98.09,
				3.09,
				1
			],
			[
				-3.12,
				8.08,
				1
			],
			[
				110.97,
				81.34,
				1
			],
			[
				-69.03,
				81.34,
				1
			],
			[
				145.76,
				30.52,
				1
			],
			[
				46.33,
				-45.41,
				1
			],
			[
				-34.24,
				30.52,
				1
			],
			[
				-54.51,
				28.99,
				1
			],
			[
				133.67,
				45.41,
				1
			],
			[
				54.51,
				-28.99,
				1
			],
			[
				-133.67,
				-45.41,
				1
			],
			[
				125.49,
				28.99,
				1
			],
			[
				-46.33,
				45.41,
				1
			],
			[
				-125.49,
				-28.99,
				1
			],
			[
				-145.76,
				-30.52,
				1
			],
			[
				34.24,
				-30.52,
				1
			],
			[
				159.58,
				41.4,
				1
			],
			[
				68.4,
				-44.67,
				1
			],
			[
				-20.42,
				41.4,
				1
			],
			[
				-46.75,
				15.18,
				1
			],
			[
				111.6,
				44.67,
				1
			],
			[
				46.75,
				-15.18,
				1
			],
			[
				-111.6,
				-44.67,
				1
			],
			[
				133.25,
				15.18,
				1
			],
			[
				-68.4,
				44.67,
				1
			],
			[
				-133.25,
				-15.18,
				1
			],
			[
				-159.58,
				-41.4,
				1
			],
			[
				20.42,
				-41.4,
				1
			],
			[
				85.43,
				-37.93,
				1
			],
			[
				-38.02,
				3.6,
				1
			],
			[
				-94.57,
				-37.93,
				1
			],
			[
				174.17,
				51.83,
				1
			],
			[
				-141.98,
				-3.6,
				1
			],
			[
				-174.17,
				-51.83,
				1
			],
			[
				141.98,
				3.6,
				1
			],
			[
				-5.83,
				51.83,
				1
			],
			[
				38.02,
				-3.6,
				1
			],
			[
				5.83,
				-51.83,
				1
			],
			[
				-85.43,
				37.93,
				1
			],
			[
				94.57,
				37.93,
				1
			],
			[
				21.18,
				27.17,
				1
			],
			[
				54.86,
				56.05,
				1
			],
			[
				-158.82,
				27.17,
				1
			],
			[
				61.17,
				18.75,
				1
			],
			[
				125.14,
				-56.05,
				1
			],
			[
				-61.17,
				-18.75,
				1
			],
			[
				-125.14,
				56.05,
				1
			],
			[
				-118.83,
				18.75,
				1
			],
			[
				-54.86,
				-56.05,
				1
			],
			[
				118.83,
				-18.75,
				1
			],
			[
				-21.18,
				-27.17,
				1
			],
			[
				158.82,
				-27.17,
				1
			],
			[
				104.66,
				-9.56,
				1
			],
			[
				-9.88,
				-14.45,
				1
			],
			[
				-75.34,
				-9.56,
				1
			],
			[
				-123.65,
				72.56,
				1
			],
			[
				-170.12,
				14.45,
				1
			],
			[
				123.65,
				-72.56,
				1
			],
			[
				170.12,
				-14.45,
				1
			],
			[
				56.35,
				72.56,
				1
			],
			[
				9.88,
				14.45,
				1
			],
			[
				-56.35,
				-72.56,
				1
			],
			[
				-104.66,
				9.56,
				1
			],
			[
				75.34,
				9.56,
				1
			],
			[
				25.94,
				-16.83,
				1
			],
			[
				-34.66,
				59.4,
				1
			],
			[
				-154.06,
				-16.83,
				1
			],
			[
				108.59,
				24.75,
				1
			],
			[
				-145.34,
				-59.41,
				1
			],
			[
				-108.59,
				-24.75,
				1
			],
			[
				145.34,
				59.41,
				1
			],
			[
				-71.41,
				24.75,
				1
			],
			[
				34.66,
				-59.41,
				1
			],
			[
				71.41,
				-24.75,
				1
			],
			[
				-25.94,
				16.83,
				1
			],
			[
				154.06,
				16.83,
				1
			],
			[
				-100.89,
				26.49,
				1
			],
			[
				153.1,
				-9.74,
				1
			],
			[
				79.11,
				26.49,
				1
			],
			[
				-20.77,
				-61.51,
				1
			],
			[
				26.9,
				9.74,
				1
			],
			[
				20.77,
				61.51,
				1
			],
			[
				-26.9,
				-9.74,
				1
			],
			[
				159.23,
				-61.51,
				1
			],
			[
				-153.1,
				9.74,
				1
			],
			[
				-159.23,
				61.51,
				1
			],
			[
				100.89,
				-26.49,
				1
			],
			[
				-79.11,
				-26.49,
				1
			],
			[
				44.31,
				12.28,
				1
			],
			[
				17.3,
				44.36,
				1
			],
			[
				-135.69,
				12.28,
				1
			],
			[
				73.08,
				43.05,
				1
			],
			[
				162.7,
				-44.36,
				1
			],
			[
				-73.08,
				-43.05,
				1
			],
			[
				-162.7,
				44.36,
				1
			],
			[
				-106.92,
				43.05,
				1
			],
			[
				-17.3,
				-44.36,
				1
			],
			[
				106.92,
				-43.05,
				1
			],
			[
				-44.31,
				-12.28,
				1
			],
			[
				135.69,
				-12.28,
				1
			],
			[
				-169.08,
				-24.53,
				1
			],
			[
				-112.54,
				-63.29,
				1
			],
			[
				10.92,
				-24.53,
				1
			],
			[
				-114.93,
				-9.92,
				1
			],
			[
				-67.46,
				63.28,
				1
			],
			[
				114.93,
				9.92,
				1
			],
			[
				67.46,
				-63.29,
				1
			],
			[
				65.07,
				-9.92,
				1
			],
			[
				112.54,
				63.29,
				1
			],
			[
				-65.07,
				9.92,
				1
			],
			[
				169.08,
				24.53,
				1
			],
			[
				-10.92,
				24.53,
				1
			],
			[
				93.2,
				-57.39,
				1
			],
			[
				-57.43,
				-1.73,
				1
			],
			[
				-86.8,
				-57.39,
				1
			],
			[
				-177.95,
				32.55,
				1
			],
			[
				-122.57,
				1.73,
				1
			],
			[
				177.95,
				-32.55,
				1
			],
			[
				122.57,
				-1.73,
				1
			],
			[
				2.05,
				32.55,
				1
			],
			[
				57.43,
				1.73,
				1
			],
			[
				-2.05,
				-32.55,
				1
			],
			[
				-93.2,
				57.39,
				1
			],
			[
				86.8,
				57.39,
				1
			],
			[
				-17.59,
				3.04,
				1
			],
			[
				170.04,
				72.16,
				1
			],
			[
				162.41,
				3.04,
				1
			],
			[
				86.81,
				-17.56,
				1
			],
			[
				9.96,
				-72.16,
				1
			],
			[
				-86.81,
				17.56,
				1
			],
			[
				-9.96,
				72.16,
				1
			],
			[
				-93.19,
				-17.56,
				1
			],
			[
				-170.04,
				-72.16,
				1
			],
			[
				93.19,
				17.56,
				1
			],
			[
				17.59,
				-3.04,
				1
			],
			[
				-162.41,
				-3.04,
				1
			],
			[
				39.38,
				44.26,
				1
			],
			[
				56.93,
				33.61,
				1
			],
			[
				-140.62,
				44.26,
				1
			],
			[
				38.42,
				27.03,
				1
			],
			[
				123.07,
				-33.61,
				1
			],
			[
				-38.42,
				-27.03,
				1
			],
			[
				-123.07,
				33.61,
				1
			],
			[
				-141.58,
				27.03,
				1
			],
			[
				-56.93,
				-33.61,
				1
			],
			[
				141.58,
				-27.03,
				1
			],
			[
				-39.38,
				-44.26,
				1
			],
			[
				140.62,
				-44.26,
				1
			]
		],
		[
			[
				165.52,
				26.52,
				1
			],
			[
				63.39,
				-60.04,
				1
			],
			[
				-14.48,
				26.52,
				1
			],
			[
				-62.74,
				12.93,
				1
			],
			[
				116.61,
				60.04,
				1
			],
			[
				62.74,
				-12.93,
				1
			],
			[
				-116.61,
				-60.04,
				1
			],
			[
				117.26,
				12.93,
				1
			],
			[
				-63.39,
				60.04,
				1
			],
			[
				-117.26,
				-12.93,
				1
			],
			[
				-165.52,
				-26.52,
				1
			],
			[
				14.48,
				-26.52,
				1
			],
			[
				-150.22,
				-21.62,
				1
			],
			[
				-141.41,
				-53.79,
				1
			],
			[
				29.78,
				-21.62,
				1
			],
			[
				-114.55,
				-27.5,
				1
			],
			[
				-38.59,
				53.79,
				1
			],
			[
				114.55,
				27.5,
				1
			],
			[
				38.59,
				-53.79,
				1
			],
			[
				65.45,
				-27.5,
				1
			],
			[
				141.41,
				53.79,
				1
			],
			[
				-65.45,
				27.5,
				1
			],
			[
				150.22,
				21.62,
				1
			],
			[
				-29.78,
				21.62,
				1
			],
			[
				-163.47,
				81.91,
				1
			],
			[
				92.31,
				-7.75,
				1
			],
			[
				16.53,
				81.91,
				1
			],
			[
				-7.76,
				-2.29,
				1
			],
			[
				87.69,
				7.75,
				1
			],
			[
				7.76,
				2.29,
				1
			],
			[
				-87.69,
				-7.75,
				1
			],
			[
				172.24,
				-2.29,
				1
			],
			[
				-92.31,
				7.75,
				1
			],
			[
				-172.24,
				2.29,
				1
			],
			[
				163.47,
				-81.91,
				1
			],
			[
				-16.53,
				-81.91,
				1
			],
			[
				-79.91,
				-73.49,
				1
			],
			[
				-106.27,
				2.85,
				1
			],
			[
				100.09,
				-73.49,
				1
			],
			[
				177.03,
				-16.24,
				1
			],
			[
				-73.73,
				-2.85,
				1
			],
			[
				-177.03,
				16.24,
				1
			],
			[
				73.73,
				2.85,
				1
			],
			[
				-2.97,
				-16.24,
				1
			],
			[
				106.27,
				-2.85,
				1
			],
			[
				2.97,
				16.24,
				1
			],
			[
				79.91,
				73.49,
				1
			],
			[
				-100.09,
				73.49,
				1
			],
			[
				-43.19,
				73.63,
				1
			],
			[
				101.37,
				11.86,
				1
			],
			[
				136.81,
				73.63,
				1
			],
			[
				12.09,
				-11.12,
				1
			],
			[
				78.63,
				-11.86,
				1
			],
			[
				-12.09,
				11.12,
				1
			],
			[
				-78.63,
				11.86,
				1
			],
			[
				-167.91,
				-11.12,
				1
			],
			[
				-101.37,
				-11.86,
				1
			],
			[
				167.91,
				11.12,
				1
			],
			[
				43.19,
				-73.63,
				1
			],
			[
				-136.81,
				-73.63,
				1
			],
			[
				109.86,
				-34.83,
				1
			],
			[
				-36.5,
				-16.19,
				1
			],
			[
				-70.14,
				-34.83,
				1
			],
			[
				-153.97,
				50.53,
				1
			],
			[
				-143.5,
				16.19,
				1
			],
			[
				153.97,
				-50.53,
				1
			],
			[
				143.5,
				-16.19,
				1
			],
			[
				26.03,
				50.53,
				1
			],
			[
				36.5,
				16.19,
				1
			],
			[
				-26.03,
				-50.53,
				1
			],
			[
				-109.86,
				34.83,
				1
			],
			[
				70.14,
				34.83,
				1
			],
			[
				-23.31,
				-6.54,
				1
			],
			[
				-163.84,
				65.83,
				1
			],
			[
				156.69,
				-6.54,
				1
			],
			[
				97.12,
				-23.15,
				1
			],
			[
				-16.16,
				-65.83,
				1
			],
			[
				-97.12,
				23.15,
				1
			],
			[
				16.16,
				65.83,
				1
			],
			[
				-82.88,
				-23.15,
				1
			],
			[
				163.84,
				-65.83,
				1
			],
			[
				82.88,
				23.15,
				1
			],
			[
				23.31,
				6.54,
				1
			],
			[
				-156.69,
				6.54,
				1
			],
			[
				-.87,
				-31.92,
				1
			],
			[
				-91.4,
				58.07,
				1
			],
			[
				179.13,
				-31.92,
				1
			],
			[
				121.93,
				-.74,
				1
			],
			[
				-88.6,
				-58.07,
				1
			],
			[
				-121.93,
				.74,
				1
			],
			[
				88.6,
				58.07,
				1
			],
			[
				-58.07,
				-.74,
				1
			],
			[
				91.4,
				-58.07,
				1
			],
			[
				58.07,
				.74,
				1
			],
			[
				.87,
				31.92,
				1
			],
			[
				-179.13,
				31.92,
				1
			],
			[
				163.12,
				43.35,
				1
			],
			[
				72.9,
				-44.1,
				1
			],
			[
				-16.88,
				43.35,
				1
			],
			[
				-45.39,
				12.19,
				1
			],
			[
				107.1,
				44.1,
				1
			],
			[
				45.39,
				-12.19,
				1
			],
			[
				-107.1,
				-44.1,
				1
			],
			[
				134.61,
				12.19,
				1
			],
			[
				-72.9,
				44.1,
				1
			],
			[
				-134.61,
				-12.19,
				1
			],
			[
				-163.12,
				-43.35,
				1
			],
			[
				16.88,
				-43.35,
				1
			],
			[
				-114.23,
				50.37,
				1
			],
			[
				127.06,
				-15.17,
				1
			],
			[
				65.77,
				50.37,
				1
			],
			[
				-18.77,
				-35.57,
				1
			],
			[
				52.94,
				15.17,
				1
			],
			[
				18.77,
				35.57,
				1
			],
			[
				-52.94,
				-15.17,
				1
			],
			[
				161.23,
				-35.57,
				1
			],
			[
				-127.06,
				15.17,
				1
			],
			[
				-161.23,
				35.57,
				1
			],
			[
				114.23,
				-50.37,
				1
			],
			[
				-65.77,
				-50.37,
				1
			],
			[
				54.17,
				30.16,
				1
			],
			[
				35.63,
				30.41,
				1
			],
			[
				-125.83,
				30.16,
				1
			],
			[
				45.21,
				44.51,
				1
			],
			[
				144.37,
				-30.41,
				1
			],
			[
				-45.21,
				-44.51,
				1
			],
			[
				-144.37,
				30.41,
				1
			],
			[
				-134.79,
				44.51,
				1
			],
			[
				-35.63,
				-30.41,
				1
			],
			[
				134.79,
				-44.51,
				1
			],
			[
				-54.17,
				-30.16,
				1
			],
			[
				125.83,
				-30.16,
				1
			],
			[
				126.2,
				41.73,
				1
			],
			[
				47.86,
				-26.15,
				1
			],
			[
				-53.8,
				41.73,
				1
			],
			[
				-33.51,
				37.03,
				1
			],
			[
				132.14,
				26.15,
				1
			],
			[
				33.51,
				-37.03,
				1
			],
			[
				-132.14,
				-26.15,
				1
			],
			[
				146.49,
				37.03,
				1
			],
			[
				-47.86,
				26.15,
				1
			],
			[
				-146.49,
				-37.03,
				1
			],
			[
				-126.2,
				-41.73,
				1
			],
			[
				53.8,
				-41.73,
				1
			],
			[
				-161.75,
				20.38,
				1
			],
			[
				130.12,
				-62.91,
				1
			],
			[
				18.25,
				20.38,
				1
			],
			[
				-68.63,
				-17.07,
				1
			],
			[
				49.88,
				62.91,
				1
			],
			[
				68.63,
				17.07,
				1
			],
			[
				-49.88,
				-62.91,
				1
			],
			[
				111.37,
				-17.07,
				1
			],
			[
				-130.12,
				62.91,
				1
			],
			[
				-111.37,
				17.07,
				1
			],
			[
				161.75,
				-20.38,
				1
			],
			[
				-18.25,
				-20.38,
				1
			],
			[
				2.71,
				48.49,
				1
			],
			[
				87.6,
				41.45,
				1
			],
			[
				-177.29,
				48.49,
				1
			],
			[
				41.48,
				1.8,
				1
			],
			[
				92.4,
				-41.45,
				1
			],
			[
				-41.48,
				-1.8,
				1
			],
			[
				-92.4,
				41.45,
				1
			],
			[
				-138.52,
				1.8,
				1
			],
			[
				-87.6,
				-41.45,
				1
			],
			[
				138.52,
				-1.8,
				1
			],
			[
				-2.71,
				-48.49,
				1
			],
			[
				177.29,
				-48.49,
				1
			],
			[
				-98.15,
				-27.54,
				1
			],
			[
				-152.22,
				-7.22,
				1
			],
			[
				81.85,
				-27.54,
				1
			],
			[
				-164.79,
				-61.37,
				1
			],
			[
				-27.78,
				7.22,
				1
			],
			[
				164.79,
				61.37,
				1
			],
			[
				27.78,
				-7.22,
				1
			],
			[
				15.21,
				-61.37,
				1
			],
			[
				152.22,
				7.22,
				1
			],
			[
				-15.21,
				61.37,
				1
			],
			[
				98.15,
				27.54,
				1
			],
			[
				-81.85,
				27.54,
				1
			]
		],
		[
			[
				-40.48,
				43.36,
				1
			],
			[
				124.51,
				33.58,
				1
			],
			[
				139.52,
				43.36,
				1
			],
			[
				38.85,
				-28.17,
				1
			],
			[
				55.49,
				-33.58,
				1
			],
			[
				-38.85,
				28.17,
				1
			],
			[
				-55.49,
				33.58,
				1
			],
			[
				-141.15,
				-28.17,
				1
			],
			[
				-124.51,
				-33.58,
				1
			],
			[
				141.15,
				28.17,
				1
			],
			[
				40.48,
				-43.36,
				1
			],
			[
				-139.52,
				-43.36,
				1
			],
			[
				56.01,
				17.18,
				1
			],
			[
				20.46,
				32.29,
				1
			],
			[
				-123.99,
				17.18,
				1
			],
			[
				61.05,
				52.38,
				1
			],
			[
				159.54,
				-32.29,
				1
			],
			[
				-61.05,
				-52.38,
				1
			],
			[
				-159.54,
				32.29,
				1
			],
			[
				-118.95,
				52.38,
				1
			],
			[
				-20.46,
				-32.29,
				1
			],
			[
				118.95,
				-52.38,
				1
			],
			[
				-56.01,
				-17.18,
				1
			],
			[
				123.99,
				-17.18,
				1
			],
			[
				-179.51,
				-8.95,
				1
			],
			[
				-93.08,
				-81.04,
				1
			],
			[
				.49,
				-8.95,
				1
			],
			[
				-98.95,
				-.48,
				1
			],
			[
				-86.92,
				81.04,
				1
			],
			[
				98.95,
				.48,
				1
			],
			[
				86.92,
				-81.04,
				1
			],
			[
				81.05,
				-.48,
				1
			],
			[
				93.08,
				81.04,
				1
			],
			[
				-81.05,
				.48,
				1
			],
			[
				179.51,
				8.95,
				1
			],
			[
				-.49,
				8.95,
				1
			],
			[
				12.04,
				-13.56,
				1
			],
			[
				-49.15,
				71.95,
				1
			],
			[
				-167.96,
				-13.56,
				1
			],
			[
				103.85,
				11.7,
				1
			],
			[
				-130.85,
				-71.95,
				1
			],
			[
				-103.85,
				-11.7,
				1
			],
			[
				130.85,
				71.95,
				1
			],
			[
				-76.15,
				11.7,
				1
			],
			[
				49.15,
				-71.95,
				1
			],
			[
				76.15,
				-11.7,
				1
			],
			[
				-12.04,
				13.56,
				1
			],
			[
				167.96,
				13.56,
				1
			],
			[
				-13.62,
				-58.2,
				1
			],
			[
				-98.3,
				30.8,
				1
			],
			[
				166.38,
				-58.2,
				1
			],
			[
				148.93,
				-7.13,
				1
			],
			[
				-81.7,
				-30.8,
				1
			],
			[
				-148.93,
				7.13,
				1
			],
			[
				81.7,
				30.8,
				1
			],
			[
				-31.07,
				-7.13,
				1
			],
			[
				98.3,
				-30.8,
				1
			],
			[
				31.07,
				7.13,
				1
			],
			[
				13.62,
				58.2,
				1
			],
			[
				-166.38,
				58.2,
				1
			],
			[
				65.26,
				-20.55,
				1
			],
			[
				-22.43,
				23.07,
				1
			],
			[
				-114.74,
				-20.55,
				1
			],
			[
				131.85,
				58.26,
				1
			],
			[
				-157.57,
				-23.07,
				1
			],
			[
				-131.85,
				-58.26,
				1
			],
			[
				157.57,
				23.07,
				1
			],
			[
				-48.15,
				58.26,
				1
			],
			[
				22.43,
				-23.07,
				1
			],
			[
				48.15,
				-58.26,
				1
			],
			[
				-65.26,
				20.55,
				1
			],
			[
				114.74,
				20.55,
				1
			],
			[
				-135.39,
				26.5,
				1
			],
			[
				144.63,
				-39.58,
				1
			],
			[
				44.61,
				26.5,
				1
			],
			[
				-55,
				-38.94,
				1
			],
			[
				35.37,
				39.58,
				1
			],
			[
				55,
				38.94,
				1
			],
			[
				-35.37,
				-39.58,
				1
			],
			[
				125,
				-38.94,
				1
			],
			[
				-144.63,
				39.58,
				1
			],
			[
				-125,
				38.94,
				1
			],
			[
				135.39,
				-26.5,
				1
			],
			[
				-44.61,
				-26.5,
				1
			],
			[
				114.95,
				-4.75,
				1
			],
			[
				-5.23,
				-24.86,
				1
			],
			[
				-65.05,
				-4.75,
				1
			],
			[
				-101.14,
				64.63,
				1
			],
			[
				-174.77,
				24.86,
				1
			],
			[
				101.14,
				-64.63,
				1
			],
			[
				174.77,
				-24.86,
				1
			],
			[
				78.86,
				64.63,
				1
			],
			[
				5.23,
				24.86,
				1
			],
			[
				-78.86,
				-64.63,
				1
			],
			[
				-114.95,
				4.75,
				1
			],
			[
				65.05,
				4.75,
				1
			],
			[
				35.85,
				52.64,
				1
			],
			[
				65.91,
				29.46,
				1
			],
			[
				-144.15,
				52.64,
				1
			],
			[
				31.75,
				20.82,
				1
			],
			[
				114.09,
				-29.46,
				1
			],
			[
				-31.75,
				-20.82,
				1
			],
			[
				-114.09,
				29.46,
				1
			],
			[
				-148.25,
				20.82,
				1
			],
			[
				-65.91,
				-29.46,
				1
			],
			[
				148.25,
				-20.82,
				1
			],
			[
				-35.85,
				-52.64,
				1
			],
			[
				144.15,
				-52.64,
				1
			],
			[
				86.45,
				11.52,
				1
			],
			[
				11.54,
				3.48,
				1
			],
			[
				-93.55,
				11.52,
				1
			],
			[
				16.9,
				77.95,
				1
			],
			[
				168.46,
				-3.48,
				1
			],
			[
				-16.9,
				-77.95,
				1
			],
			[
				-168.46,
				3.48,
				1
			],
			[
				-163.1,
				77.95,
				1
			],
			[
				-11.54,
				-3.48,
				1
			],
			[
				163.1,
				-77.95,
				1
			],
			[
				-86.45,
				-11.52,
				1
			],
			[
				93.55,
				-11.52,
				1
			],
			[
				135.24,
				4.02,
				1
			],
			[
				5.69,
				-45.1,
				1
			],
			[
				-44.76,
				4.02,
				1
			],
			[
				-84.35,
				44.62,
				1
			],
			[
				174.31,
				45.1,
				1
			],
			[
				84.35,
				-44.62,
				1
			],
			[
				-174.31,
				-45.1,
				1
			],
			[
				95.65,
				44.62,
				1
			],
			[
				-5.69,
				45.1,
				1
			],
			[
				-95.65,
				-44.62,
				1
			],
			[
				-135.24,
				-4.02,
				1
			],
			[
				44.76,
				-4.02,
				1
			],
			[
				-129.84,
				-18.16,
				1
			],
			[
				-156.86,
				-37.5,
				1
			],
			[
				50.16,
				-18.16,
				1
			],
			[
				-117.12,
				-46.85,
				1
			],
			[
				-23.14,
				37.5,
				1
			],
			[
				117.12,
				46.85,
				1
			],
			[
				23.14,
				-37.5,
				1
			],
			[
				62.88,
				-46.85,
				1
			],
			[
				156.86,
				37.5,
				1
			],
			[
				-62.88,
				46.85,
				1
			],
			[
				129.84,
				18.16,
				1
			],
			[
				-50.16,
				18.16,
				1
			],
			[
				-74.1,
				32.87,
				1
			],
			[
				146.1,
				13.3,
				1
			],
			[
				105.9,
				32.87,
				1
			],
			[
				22.97,
				-53.88,
				1
			],
			[
				33.9,
				-13.3,
				1
			],
			[
				-22.97,
				53.88,
				1
			],
			[
				-33.9,
				13.3,
				1
			],
			[
				-157.03,
				-53.88,
				1
			],
			[
				-146.1,
				-13.3,
				1
			],
			[
				157.03,
				53.88,
				1
			],
			[
				74.1,
				-32.87,
				1
			],
			[
				-105.9,
				-32.87,
				1
			],
			[
				-119.92,
				-5.64,
				1
			],
			[
				-173.5,
				-29.76,
				1
			],
			[
				60.08,
				-5.64,
				1
			],
			[
				-101.2,
				-59.6,
				1
			],
			[
				-6.5,
				29.76,
				1
			],
			[
				101.2,
				59.6,
				1
			],
			[
				6.5,
				-29.76,
				1
			],
			[
				78.8,
				-59.6,
				1
			],
			[
				173.5,
				29.76,
				1
			],
			[
				-78.8,
				59.6,
				1
			],
			[
				119.92,
				5.64,
				1
			],
			[
				-60.08,
				5.64,
				1
			],
			[
				73.14,
				16.13,
				1
			],
			[
				16.82,
				16.18,
				1
			],
			[
				-106.86,
				16.13,
				1
			],
			[
				45.09,
				66.83,
				1
			],
			[
				163.18,
				-16.18,
				1
			],
			[
				-45.09,
				-66.83,
				1
			],
			[
				-163.18,
				16.18,
				1
			],
			[
				-134.91,
				66.83,
				1
			],
			[
				-16.82,
				-16.18,
				1
			],
			[
				134.91,
				-66.83,
				1
			],
			[
				-73.14,
				-16.13,
				1
			],
			[
				106.86,
				-16.13,
				1
			],
			[
				-11.7,
				-43.38,
				1
			],
			[
				-102.11,
				45.38,
				1
			],
			[
				168.3,
				-43.38,
				1
			],
			[
				133.98,
				-8.47,
				1
			],
			[
				-77.89,
				-45.38,
				1
			],
			[
				-133.98,
				8.47,
				1
			],
			[
				77.89,
				45.38,
				1
			],
			[
				-46.02,
				-8.47,
				1
			],
			[
				102.11,
				-45.38,
				1
			],
			[
				46.02,
				8.47,
				1
			],
			[
				11.7,
				43.38,
				1
			],
			[
				-168.3,
				43.38,
				1
			],
			[
				-24.11,
				3.73,
				1
			],
			[
				170.94,
				65.63,
				1
			],
			[
				155.89,
				3.73,
				1
			],
			[
				85.92,
				-24.05,
				1
			],
			[
				9.06,
				-65.63,
				1
			],
			[
				-85.92,
				24.05,
				1
			],
			[
				-9.06,
				65.63,
				1
			],
			[
				-94.08,
				-24.05,
				1
			],
			[
				-170.94,
				-65.63,
				1
			],
			[
				94.08,
				24.05,
				1
			],
			[
				24.11,
				-3.73,
				1
			],
			[
				-155.89,
				-3.73,
				1
			]
		],
		[
			[
				104.6,
				-3.68,
				1
			],
			[
				-3.81,
				-14.57,
				1
			],
			[
				-75.4,
				-3.68,
				1
			],
			[
				-104.32,
				74.95,
				1
			],
			[
				-176.19,
				14.57,
				1
			],
			[
				104.32,
				-74.95,
				1
			],
			[
				176.19,
				-14.57,
				1
			],
			[
				75.68,
				74.95,
				1
			],
			[
				3.81,
				14.57,
				1
			],
			[
				-75.68,
				-74.95,
				1
			],
			[
				-104.6,
				3.68,
				1
			],
			[
				75.4,
				3.68,
				1
			],
			[
				153.77,
				-30.33,
				1
			],
			[
				-52.93,
				-50.74,
				1
			],
			[
				-26.23,
				-30.33,
				1
			],
			[
				-123.11,
				22.43,
				1
			],
			[
				-127.07,
				50.74,
				1
			],
			[
				123.11,
				-22.43,
				1
			],
			[
				127.07,
				-50.74,
				1
			],
			[
				56.89,
				22.43,
				1
			],
			[
				52.93,
				50.74,
				1
			],
			[
				-56.89,
				-22.43,
				1
			],
			[
				-153.77,
				30.33,
				1
			],
			[
				26.23,
				30.33,
				1
			],
			[
				35.99,
				-39.77,
				1
			],
			[
				-54.77,
				38.45,
				1
			],
			[
				-144.01,
				-39.77,
				1
			],
			[
				135.81,
				26.85,
				1
			],
			[
				-125.23,
				-38.45,
				1
			],
			[
				-135.81,
				-26.85,
				1
			],
			[
				125.23,
				38.45,
				1
			],
			[
				-44.19,
				26.85,
				1
			],
			[
				54.77,
				-38.45,
				1
			],
			[
				44.19,
				-26.85,
				1
			],
			[
				-35.99,
				39.77,
				1
			],
			[
				144.01,
				39.77,
				1
			],
			[
				71.82,
				-25.43,
				1
			],
			[
				-26.58,
				16.37,
				1
			],
			[
				-108.18,
				-25.43,
				1
			],
			[
				146.72,
				59.1,
				1
			],
			[
				-153.42,
				-16.37,
				1
			],
			[
				-146.72,
				-59.1,
				1
			],
			[
				153.42,
				16.37,
				1
			],
			[
				-33.28,
				59.1,
				1
			],
			[
				26.58,
				-16.37,
				1
			],
			[
				33.28,
				-59.1,
				1
			],
			[
				-71.82,
				25.43,
				1
			],
			[
				108.18,
				25.43,
				1
			],
			[
				-136.55,
				26.52,
				1
			],
			[
				144.03,
				-40.51,
				1
			],
			[
				43.45,
				26.52,
				1
			],
			[
				-55.5,
				-37.97,
				1
			],
			[
				35.97,
				40.51,
				1
			],
			[
				55.5,
				37.97,
				1
			],
			[
				-35.97,
				-40.51,
				1
			],
			[
				124.5,
				-37.97,
				1
			],
			[
				-144.03,
				40.51,
				1
			],
			[
				-124.5,
				37.97,
				1
			],
			[
				136.55,
				-26.52,
				1
			],
			[
				-43.45,
				-26.52,
				1
			],
			[
				-6.52,
				-1.08,
				1
			],
			[
				-170.58,
				83.4,
				1
			],
			[
				173.48,
				-1.08,
				1
			],
			[
				91.09,
				-6.52,
				1
			],
			[
				-9.42,
				-83.4,
				1
			],
			[
				-91.09,
				6.52,
				1
			],
			[
				9.42,
				83.4,
				1
			],
			[
				-88.91,
				-6.52,
				1
			],
			[
				170.58,
				-83.4,
				1
			],
			[
				88.91,
				6.52,
				1
			],
			[
				6.52,
				1.08,
				1
			],
			[
				-173.48,
				1.08,
				1
			],
			[
				-71.13,
				40.38,
				1
			],
			[
				138.05,
				14.26,
				1
			],
			[
				108.87,
				40.38,
				1
			],
			[
				20.82,
				-46.12,
				1
			],
			[
				41.95,
				-14.26,
				1
			],
			[
				-20.82,
				46.12,
				1
			],
			[
				-41.95,
				14.26,
				1
			],
			[
				-159.18,
				-46.12,
				1
			],
			[
				-138.05,
				-14.26,
				1
			],
			[
				159.18,
				46.12,
				1
			],
			[
				71.13,
				-40.38,
				1
			],
			[
				-108.87,
				-40.38,
				1
			],
			[
				-153.97,
				-27.97,
				1
			],
			[
				-129.57,
				-52.52,
				1
			],
			[
				26.03,
				-27.97,
				1
			],
			[
				-120.59,
				-22.81,
				1
			],
			[
				-50.43,
				52.52,
				1
			],
			[
				120.59,
				22.81,
				1
			],
			[
				50.43,
				-52.52,
				1
			],
			[
				59.41,
				-22.81,
				1
			],
			[
				129.57,
				52.52,
				1
			],
			[
				-59.41,
				22.81,
				1
			],
			[
				153.97,
				27.97,
				1
			],
			[
				-26.03,
				27.97,
				1
			],
			[
				-80.23,
				13.48,
				1
			],
			[
				166.33,
				9.49,
				1
			],
			[
				99.77,
				13.48,
				1
			],
			[
				35.29,
				-73.41,
				1
			],
			[
				13.67,
				-9.49,
				1
			],
			[
				-35.29,
				73.41,
				1
			],
			[
				-13.67,
				9.49,
				1
			],
			[
				-144.71,
				-73.41,
				1
			],
			[
				-166.33,
				-9.49,
				1
			],
			[
				144.71,
				73.41,
				1
			],
			[
				80.23,
				-13.48,
				1
			],
			[
				-99.77,
				-13.48,
				1
			],
			[
				55.43,
				-9,
				1
			],
			[
				-10.89,
				34.09,
				1
			],
			[
				-124.57,
				-9,
				1
			],
			[
				105.6,
				54.41,
				1
			],
			[
				-169.11,
				-34.09,
				1
			],
			[
				-105.6,
				-54.41,
				1
			],
			[
				169.11,
				34.09,
				1
			],
			[
				-74.4,
				54.41,
				1
			],
			[
				10.89,
				-34.09,
				1
			],
			[
				74.4,
				-54.41,
				1
			],
			[
				-55.43,
				9,
				1
			],
			[
				124.57,
				9,
				1
			],
			[
				68.32,
				-7.14,
				1
			],
			[
				-7.68,
				21.51,
				1
			],
			[
				-111.68,
				-7.14,
				1
			],
			[
				108.74,
				67.22,
				1
			],
			[
				-172.32,
				-21.51,
				1
			],
			[
				-108.74,
				-67.22,
				1
			],
			[
				172.32,
				21.51,
				1
			],
			[
				-71.26,
				67.22,
				1
			],
			[
				7.68,
				-21.51,
				1
			],
			[
				71.26,
				-67.22,
				1
			],
			[
				-68.32,
				7.14,
				1
			],
			[
				111.68,
				7.14,
				1
			],
			[
				-174.97,
				36.12,
				1
			],
			[
				96.85,
				-53.58,
				1
			],
			[
				5.03,
				36.12,
				1
			],
			[
				-53.77,
				-4.06,
				1
			],
			[
				83.15,
				53.58,
				1
			],
			[
				53.77,
				4.06,
				1
			],
			[
				-83.15,
				-53.58,
				1
			],
			[
				126.23,
				-4.06,
				1
			],
			[
				-96.85,
				53.58,
				1
			],
			[
				-126.23,
				4.06,
				1
			],
			[
				174.97,
				-36.12,
				1
			],
			[
				-5.03,
				-36.12,
				1
			],
			[
				-149.91,
				16.26,
				1
			],
			[
				149.81,
				-56.16,
				1
			],
			[
				30.09,
				16.26,
				1
			],
			[
				-71.37,
				-28.77,
				1
			],
			[
				30.19,
				56.16,
				1
			],
			[
				71.37,
				28.77,
				1
			],
			[
				-30.19,
				-56.16,
				1
			],
			[
				108.63,
				-28.77,
				1
			],
			[
				-149.81,
				56.16,
				1
			],
			[
				-108.63,
				28.77,
				1
			],
			[
				149.91,
				-16.26,
				1
			],
			[
				-30.09,
				-16.26,
				1
			],
			[
				2.52,
				-51.45,
				1
			],
			[
				-87.99,
				38.5,
				1
			],
			[
				-177.48,
				-51.45,
				1
			],
			[
				141.48,
				1.57,
				1
			],
			[
				-92.01,
				-38.5,
				1
			],
			[
				-141.48,
				-1.57,
				1
			],
			[
				92.01,
				38.5,
				1
			],
			[
				-38.52,
				1.57,
				1
			],
			[
				87.99,
				-38.5,
				1
			],
			[
				38.52,
				-1.57,
				1
			],
			[
				-2.52,
				51.45,
				1
			],
			[
				177.48,
				51.45,
				1
			],
			[
				161.12,
				-9.98,
				1
			],
			[
				-28.54,
				-68.73,
				1
			],
			[
				-18.88,
				-9.98,
				1
			],
			[
				-100.54,
				18.59,
				1
			],
			[
				-151.46,
				68.73,
				1
			],
			[
				100.54,
				-18.59,
				1
			],
			[
				151.46,
				-68.73,
				1
			],
			[
				79.46,
				18.59,
				1
			],
			[
				28.54,
				68.73,
				1
			],
			[
				-79.46,
				-18.59,
				1
			],
			[
				-161.12,
				9.98,
				1
			],
			[
				18.88,
				9.98,
				1
			],
			[
				12.84,
				24.97,
				1
			],
			[
				64.49,
				62.11,
				1
			],
			[
				-167.16,
				24.97,
				1
			],
			[
				64.47,
				11.62,
				1
			],
			[
				115.51,
				-62.11,
				1
			],
			[
				-64.47,
				-11.62,
				1
			],
			[
				-115.51,
				62.11,
				1
			],
			[
				-115.53,
				11.62,
				1
			],
			[
				-64.49,
				-62.11,
				1
			],
			[
				115.53,
				-11.62,
				1
			],
			[
				-12.84,
				-24.97,
				1
			],
			[
				167.16,
				-24.97,
				1
			],
			[
				74.13,
				41.65,
				1
			],
			[
				42.76,
				11.79,
				1
			],
			[
				-105.87,
				41.65,
				1
			],
			[
				17.09,
				45.95,
				1
			],
			[
				137.24,
				-11.79,
				1
			],
			[
				-17.09,
				-45.95,
				1
			],
			[
				-137.24,
				11.79,
				1
			],
			[
				-162.91,
				45.95,
				1
			],
			[
				-42.76,
				-11.79,
				1
			],
			[
				162.91,
				-45.95,
				1
			],
			[
				-74.13,
				-41.65,
				1
			],
			[
				105.87,
				-41.65,
				1
			],
			[
				154.04,
				1.27,
				1
			],
			[
				2.9,
				-64.01,
				1
			],
			[
				-25.96,
				1.27,
				1
			],
			[
				-88.59,
				25.96,
				1
			],
			[
				177.1,
				64.01,
				1
			],
			[
				88.59,
				-25.96,
				1
			],
			[
				-177.1,
				-64.01,
				1
			],
			[
				91.41,
				25.96,
				1
			],
			[
				-2.9,
				64.01,
				1
			],
			[
				-91.41,
				-25.96,
				1
			],
			[
				-154.04,
				-1.27,
				1
			],
			[
				25.96,
				-1.27,
				1
			]
		],
		[
			[
				24.8,
				-10.46,
				1
			],
			[
				-23.76,
				63.21,
				1
			],
			[
				-155.2,
				-10.46,
				1
			],
			[
				101.5,
				24.36,
				1
			],
			[
				-156.24,
				-63.21,
				1
			],
			[
				-101.5,
				-24.36,
				1
			],
			[
				156.24,
				63.21,
				1
			],
			[
				-78.5,
				24.36,
				1
			],
			[
				23.76,
				-63.21,
				1
			],
			[
				78.5,
				-24.36,
				1
			],
			[
				-24.8,
				10.46,
				1
			],
			[
				155.2,
				10.46,
				1
			],
			[
				-134.64,
				65.44,
				1
			],
			[
				108.01,
				-16.98,
				1
			],
			[
				45.36,
				65.44,
				1
			],
			[
				-17.8,
				-17.2,
				1
			],
			[
				71.99,
				16.98,
				1
			],
			[
				17.8,
				17.2,
				1
			],
			[
				-71.99,
				-16.98,
				1
			],
			[
				162.2,
				-17.2,
				1
			],
			[
				-108.01,
				16.98,
				1
			],
			[
				-162.2,
				17.2,
				1
			],
			[
				134.64,
				-65.44,
				1
			],
			[
				-45.36,
				-65.44,
				1
			],
			[
				177.6,
				54.85,
				1
			],
			[
				88.31,
				-35.12,
				1
			],
			[
				-2.4,
				54.85,
				1
			],
			[
				-35.13,
				1.38,
				1
			],
			[
				91.69,
				35.12,
				1
			],
			[
				35.13,
				-1.38,
				1
			],
			[
				-91.69,
				-35.12,
				1
			],
			[
				144.87,
				1.38,
				1
			],
			[
				-88.31,
				35.12,
				1
			],
			[
				-144.87,
				-1.38,
				1
			],
			[
				-177.6,
				-54.85,
				1
			],
			[
				2.4,
				-54.85,
				1
			],
			[
				157.93,
				82.01,
				1
			],
			[
				86.98,
				-7.4,
				1
			],
			[
				-22.07,
				82.01,
				1
			],
			[
				-7.41,
				2.99,
				1
			],
			[
				93.02,
				7.4,
				1
			],
			[
				7.41,
				-2.99,
				1
			],
			[
				-93.02,
				-7.4,
				1
			],
			[
				172.59,
				2.99,
				1
			],
			[
				-86.98,
				7.4,
				1
			],
			[
				-172.59,
				-2.99,
				1
			],
			[
				-157.93,
				-82.01,
				1
			],
			[
				22.07,
				-82.01,
				1
			],
			[
				42.48,
				-13.21,
				1
			],
			[
				-19.17,
				45.89,
				1
			],
			[
				-137.52,
				-13.21,
				1
			],
			[
				107.66,
				41.11,
				1
			],
			[
				-160.83,
				-45.89,
				1
			],
			[
				-107.66,
				-41.11,
				1
			],
			[
				160.83,
				45.89,
				1
			],
			[
				-72.34,
				41.11,
				1
			],
			[
				19.17,
				-45.89,
				1
			],
			[
				72.34,
				-41.11,
				1
			],
			[
				-42.48,
				13.21,
				1
			],
			[
				137.52,
				13.21,
				1
			],
			[
				28.48,
				10.9,
				1
			],
			[
				21.99,
				59.68,
				1
			],
			[
				-151.52,
				10.9,
				1
			],
			[
				77.65,
				27.92,
				1
			],
			[
				158.01,
				-59.68,
				1
			],
			[
				-77.65,
				-27.92,
				1
			],
			[
				-158.01,
				59.68,
				1
			],
			[
				-102.35,
				27.92,
				1
			],
			[
				-21.99,
				-59.68,
				1
			],
			[
				102.35,
				-27.92,
				1
			],
			[
				-28.48,
				-10.9,
				1
			],
			[
				151.52,
				-10.9,
				1
			],
			[
				-33.79,
				21.61,
				1
			],
			[
				144.53,
				50.59,
				1
			],
			[
				146.21,
				21.61,
				1
			],
			[
				64.51,
				-31.14,
				1
			],
			[
				35.47,
				-50.59,
				1
			],
			[
				-64.51,
				31.14,
				1
			],
			[
				-35.47,
				50.59,
				1
			],
			[
				-115.49,
				-31.14,
				1
			],
			[
				-144.53,
				-50.59,
				1
			],
			[
				115.49,
				31.14,
				1
			],
			[
				33.79,
				-21.61,
				1
			],
			[
				-146.21,
				-21.61,
				1
			],
			[
				-175.53,
				-31.74,
				1
			],
			[
				-97.19,
				-57.98,
				1
			],
			[
				4.47,
				-31.74,
				1
			],
			[
				-121.82,
				-3.8,
				1
			],
			[
				-82.81,
				57.98,
				1
			],
			[
				121.82,
				3.8,
				1
			],
			[
				82.81,
				-57.98,
				1
			],
			[
				58.18,
				-3.8,
				1
			],
			[
				97.19,
				57.98,
				1
			],
			[
				-58.18,
				3.8,
				1
			],
			[
				175.53,
				31.74,
				1
			],
			[
				-4.47,
				31.74,
				1
			],
			[
				89.4,
				19.43,
				1
			],
			[
				19.43,
				.56,
				1
			],
			[
				-90.6,
				19.43,
				1
			],
			[
				1.69,
				70.56,
				1
			],
			[
				160.57,
				-.56,
				1
			],
			[
				-1.69,
				-70.56,
				1
			],
			[
				-160.57,
				.56,
				1
			],
			[
				-178.31,
				70.56,
				1
			],
			[
				-19.43,
				-.56,
				1
			],
			[
				178.31,
				-70.56,
				1
			],
			[
				-89.4,
				-19.43,
				1
			],
			[
				90.6,
				-19.43,
				1
			],
			[
				-27.28,
				-27.88,
				1
			],
			[
				-130.91,
				51.78,
				1
			],
			[
				152.72,
				-27.88,
				1
			],
			[
				120.76,
				-23.9,
				1
			],
			[
				-49.09,
				-51.78,
				1
			],
			[
				-120.76,
				23.9,
				1
			],
			[
				49.09,
				51.78,
				1
			],
			[
				-59.24,
				-23.9,
				1
			],
			[
				130.91,
				-51.78,
				1
			],
			[
				59.24,
				23.9,
				1
			],
			[
				27.28,
				27.88,
				1
			],
			[
				-152.72,
				27.88,
				1
			],
			[
				139.9,
				-15.44,
				1
			],
			[
				-23.21,
				-47.5,
				1
			],
			[
				-40.1,
				-15.44,
				1
			],
			[
				-109.85,
				38.38,
				1
			],
			[
				-156.79,
				47.5,
				1
			],
			[
				109.85,
				-38.38,
				1
			],
			[
				156.79,
				-47.5,
				1
			],
			[
				70.15,
				38.38,
				1
			],
			[
				23.21,
				47.5,
				1
			],
			[
				-70.15,
				-38.38,
				1
			],
			[
				-139.9,
				15.44,
				1
			],
			[
				40.1,
				15.44,
				1
			],
			[
				-2.17,
				-43.33,
				1
			],
			[
				-92.29,
				46.62,
				1
			],
			[
				177.83,
				-43.33,
				1
			],
			[
				133.35,
				-1.58,
				1
			],
			[
				-87.71,
				-46.62,
				1
			],
			[
				-133.35,
				1.58,
				1
			],
			[
				87.71,
				46.62,
				1
			],
			[
				-46.65,
				-1.58,
				1
			],
			[
				92.29,
				-46.62,
				1
			],
			[
				46.65,
				1.58,
				1
			],
			[
				2.17,
				43.33,
				1
			],
			[
				-177.83,
				43.33,
				1
			],
			[
				41.12,
				27.96,
				1
			],
			[
				38.91,
				41.71,
				1
			],
			[
				-138.88,
				27.96,
				1
			],
			[
				54.83,
				35.51,
				1
			],
			[
				141.09,
				-41.71,
				1
			],
			[
				-54.83,
				-35.51,
				1
			],
			[
				-141.09,
				41.71,
				1
			],
			[
				-125.17,
				35.51,
				1
			],
			[
				-38.91,
				-41.71,
				1
			],
			[
				125.17,
				-35.51,
				1
			],
			[
				-41.12,
				-27.96,
				1
			],
			[
				138.88,
				-27.96,
				1
			],
			[
				-126.67,
				13.75,
				1
			],
			[
				163.04,
				-35.46,
				1
			],
			[
				53.33,
				13.75,
				1
			],
			[
				-67.73,
				-51.18,
				1
			],
			[
				16.96,
				35.46,
				1
			],
			[
				67.73,
				51.18,
				1
			],
			[
				-16.96,
				-35.46,
				1
			],
			[
				112.27,
				-51.18,
				1
			],
			[
				-163.04,
				35.46,
				1
			],
			[
				-112.27,
				51.18,
				1
			],
			[
				126.67,
				-13.75,
				1
			],
			[
				-53.33,
				-13.75,
				1
			],
			[
				6.02,
				-15.42,
				1
			],
			[
				-69.18,
				73.47,
				1
			],
			[
				-173.98,
				-15.42,
				1
			],
			[
				105.51,
				5.8,
				1
			],
			[
				-110.82,
				-73.47,
				1
			],
			[
				-105.51,
				-5.8,
				1
			],
			[
				110.82,
				73.47,
				1
			],
			[
				-74.49,
				5.8,
				1
			],
			[
				69.18,
				-73.47,
				1
			],
			[
				74.49,
				-5.8,
				1
			],
			[
				-6.02,
				15.42,
				1
			],
			[
				173.98,
				15.42,
				1
			],
			[
				160.08,
				33.45,
				1
			],
			[
				62.71,
				-51.67,
				1
			],
			[
				-19.92,
				33.45,
				1
			],
			[
				-54.9,
				16.52,
				1
			],
			[
				117.29,
				51.67,
				1
			],
			[
				54.9,
				-16.52,
				1
			],
			[
				-117.29,
				-51.67,
				1
			],
			[
				125.1,
				16.52,
				1
			],
			[
				-62.71,
				51.67,
				1
			],
			[
				-125.1,
				-16.52,
				1
			],
			[
				-160.08,
				-33.45,
				1
			],
			[
				19.92,
				-33.45,
				1
			],
			[
				80.34,
				6.51,
				1
			],
			[
				6.61,
				9.59,
				1
			],
			[
				-99.66,
				6.51,
				1
			],
			[
				55.76,
				78.37,
				1
			],
			[
				173.39,
				-9.59,
				1
			],
			[
				-55.76,
				-78.37,
				1
			],
			[
				-173.39,
				9.59,
				1
			],
			[
				-124.24,
				78.37,
				1
			],
			[
				-6.61,
				-9.59,
				1
			],
			[
				124.24,
				-78.37,
				1
			],
			[
				-80.34,
				-6.51,
				1
			],
			[
				99.66,
				-6.51,
				1
			],
			[
				6.25,
				24.64,
				1
			],
			[
				76.64,
				64.63,
				1
			],
			[
				-173.75,
				24.64,
				1
			],
			[
				65.23,
				5.68,
				1
			],
			[
				103.36,
				-64.63,
				1
			],
			[
				-65.23,
				-5.68,
				1
			],
			[
				-103.36,
				64.63,
				1
			],
			[
				-114.77,
				5.68,
				1
			],
			[
				-76.64,
				-64.63,
				1
			],
			[
				114.77,
				-5.68,
				1
			],
			[
				-6.25,
				-24.64,
				1
			],
			[
				173.75,
				-24.64,
				1
			],
			[
				51.41,
				-63.45,
				1
			],
			[
				-68.67,
				16.19,
				1
			],
			[
				-128.59,
				-63.45,
				1
			],
			[
				162.69,
				20.45,
				1
			],
			[
				-111.33,
				-16.19,
				1
			],
			[
				-162.69,
				-20.45,
				1
			],
			[
				111.33,
				16.19,
				1
			],
			[
				-17.31,
				20.45,
				1
			],
			[
				68.67,
				-16.19,
				1
			],
			[
				17.31,
				-20.45,
				1
			],
			[
				-51.41,
				63.45,
				1
			],
			[
				128.59,
				63.45,
				1
			],
			[
				-50.6,
				28.85,
				1
			],
			[
				144.51,
				33.77,
				1
			],
			[
				129.4,
				28.85,
				1
			],
			[
				49.04,
				-42.6,
				1
			],
			[
				35.49,
				-33.77,
				1
			],
			[
				-49.04,
				42.6,
				1
			],
			[
				-35.49,
				33.77,
				1
			],
			[
				-130.96,
				-42.6,
				1
			],
			[
				-144.51,
				-33.77,
				1
			],
			[
				130.96,
				42.6,
				1
			],
			[
				50.6,
				-28.85,
				1
			],
			[
				-129.4,
				-28.85,
				1
			]
		]
	][e - 1];
}
var _utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
	__proto__: null,
	createNearestLookup,
	deg2rad,
	findNearest,
	getAmbisonicDecMtx,
	getCircHarmonics,
	getColumn,
	getTdesign,
	numeric,
	rad2deg,
	sampleCircle
}, Symbol.toStringTag, { value: "Module" }));
function computeEncodingCoefficients(e, t, n) {
	let r = getAmbisonicChannelCount(n), i = computeRealSH_1(n, [[degreesToRadians(e), degreesToRadians(t)]]), a = new Float32Array(r);
	for (let e = 0; e < r; e++) a[e] = i[e][0];
	return a;
}
function computeEncodingCoefficients2D(e, t) {
	let n = getAmbisonicChannelCount2D(t), r = getCircHarmonics(t, [e]), i = new Float32Array(n);
	for (let e = 0; e < n; e++) i[e] = r[e][0];
	return i;
}
function encodeBuffer(e, t, n, r) {
	let i = getAmbisonicChannelCount(r), a = e.length, o = computeEncodingCoefficients(t, n, r), s = Array(i);
	for (let t = 0; t < i; t++) {
		s[t] = new Float32Array(a);
		let n = o[t];
		for (let r = 0; r < a; r++) s[t][r] = e[r] * n;
	}
	return s;
}
function encodeBuffer2D(e, t, n) {
	let r = getAmbisonicChannelCount2D(n), i = e.length, a = computeEncodingCoefficients2D(t, n), o = Array(r);
	for (let t = 0; t < r; t++) {
		o[t] = new Float32Array(i);
		let n = a[t];
		for (let r = 0; r < i; r++) o[t][r] = e[r] * n;
	}
	return o;
}
function encodeBufferFromDirection(e, t, n, r, i, a = "ambisonics") {
	let o = t, s = n, c = r;
	a === "threejs" && (o = r, s = -t, c = n);
	let [[l, u]] = convertCart2Sph_1([[
		o,
		s,
		c
	]], 1);
	return encodeBuffer(e, l * 180 / Math.PI, u * 180 / Math.PI, i);
}
function encodeBuffer2DFromDirection(e, t, n, r, i, a = "ambisonics") {
	let o = t, s = n;
	return a === "threejs" && (o = r, s = -t), encodeBuffer2D(e, Math.atan2(s, o) * 180 / Math.PI, i);
}
function encodeAndSumBuffers(e, t) {
	if (e.length === 0) {
		let e = getAmbisonicChannelCount(t);
		return Array.from({ length: e }, () => /* @__PURE__ */ new Float32Array());
	}
	let n = Math.max(...e.map((e) => e.samples.length)), r = getAmbisonicChannelCount(t), i = Array.from({ length: r }, () => new Float32Array(n));
	for (let n of e) {
		let e = encodeBuffer(n.samples, n.azim, n.elev, t);
		for (let t = 0; t < r; t++) for (let r = 0; r < n.samples.length; r++) i[t][r] += e[t][r];
	}
	return i;
}
var monoEncoder = class {
	constructor(e, t) {
		this.initialized = !1, this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.azim = 0, this.elev = 0, this.gains = Array(this.nCh), this.gainNodes = Array(this.nCh), this.in = this.ctx.createGain(), this.in.channelCountMode = "explicit", this.in.channelCount = 1, this.out = this.ctx.createChannelMerger(this.nCh);
		for (let e = 0; e < this.nCh; e++) this.gainNodes[e] = this.ctx.createGain(), this.gainNodes[e].channelCountMode = "explicit", this.gainNodes[e].channelCount = 1;
		this.updateGains();
		for (let e = 0; e < this.nCh; e++) this.in.connect(this.gainNodes[e]), this.gainNodes[e].connect(this.out, 0, e);
		this.initialized = !0;
	}
	updateGains() {
		let e = computeRealSH_1(this.order, [[degreesToRadians(this.azim), degreesToRadians(this.elev)]]);
		for (let t = 0; t < this.nCh; t++) this.gains[t] = e[t][0], this.gainNodes[t].gain.value = this.gains[t];
	}
	setDirection(e, t, n, r = "ambisonics") {
		let i = e, a = t, o = n;
		r === "threejs" && (i = n, a = -e, o = t);
		let [[s, c]] = convertCart2Sph_1([[
			i,
			a,
			o
		]], 1);
		this.azim = radiansToDegrees(s), this.elev = radiansToDegrees(c), this.updateGains();
	}
	getDirection(e = "ambisonics") {
		let t = degreesToRadians(this.azim), n = degreesToRadians(this.elev), r = Math.cos(n), i = r * Math.cos(t), a = r * Math.sin(t), o = Math.sin(n);
		return e === "threejs" ? [
			-a,
			o,
			i
		] : [
			i,
			a,
			o
		];
	}
}, monoEncoder2D = class {
	constructor(e, t) {
		this.initialized = !1, this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount2D(t), this.azim = 0, this.elev = 0, this.gainNodes = Array(this.nCh), this.in = this.ctx.createGain(), this.in.channelCountMode = "explicit", this.in.channelCount = 1, this.out = this.ctx.createChannelMerger(this.nCh);
		for (let e = 0; e < this.nCh; e++) this.gainNodes[e] = this.ctx.createGain(), this.gainNodes[e].channelCountMode = "explicit", this.gainNodes[e].channelCount = 1;
		this.updateGains();
		for (let e = 0; e < this.nCh; e++) this.in.connect(this.gainNodes[e]), this.gainNodes[e].connect(this.out, 0, e);
		this.initialized = !0;
	}
	updateGains() {
		let e = getCircHarmonics(this.order, [this.azim]);
		for (let t = 0; t < this.nCh; t++) this.gainNodes[t].gain.value = e[t][0];
	}
	setDirection(e, t, n, r = "ambisonics") {
		let i = e, a = t;
		r === "threejs" && (i = n, a = -e), this.azim = radiansToDegrees(Math.atan2(a, i)), this.elev = 0, this.updateGains();
	}
	getDirection(e = "ambisonics") {
		let t = degreesToRadians(this.azim), n = Math.cos(t), r = Math.sin(t);
		return e === "threejs" ? [
			-r,
			0,
			n
		] : [
			n,
			r,
			0
		];
	}
}, orderLimiter = class {
	get order() {
		return this.orderOut;
	}
	get nCh() {
		return this.nChOut;
	}
	constructor(e, t, n) {
		this.ctx = e, this.orderIn = t, this.orderOut = n < t ? n : t, this.nChIn = getAmbisonicChannelCount(this.orderIn), this.nChOut = getAmbisonicChannelCount(this.orderOut), this.in = this.ctx.createChannelSplitter(this.nChIn), this.out = this.ctx.createChannelMerger(this.nChOut);
		for (let e = 0; e < this.nChOut; e++) this.in.connect(this.out, e, e);
	}
	updateOrder(e) {
		if (!(e > this.orderIn)) {
			this.orderOut = e, this.nChOut = getAmbisonicChannelCount(this.orderOut), this.out.disconnect(), this.out = this.ctx.createChannelMerger(this.nChOut);
			for (let e = 0; e < this.nChOut; e++) this.in.connect(this.out, e, e);
		}
	}
}, orderLimiter2D = class {
	get order() {
		return this.orderOut;
	}
	get nCh() {
		return this.nChOut;
	}
	constructor(e, t, n) {
		this.ctx = e, this.orderIn = t, this.orderOut = n < t ? n : t, this.nChIn = getAmbisonicChannelCount2D(this.orderIn), this.nChOut = getAmbisonicChannelCount2D(this.orderOut), this.in = this.ctx.createChannelSplitter(this.nChIn), this.out = this.ctx.createChannelMerger(this.nChOut);
		for (let e = 0; e < this.nChOut; e++) this.in.connect(this.out, e, e);
	}
	updateOrder(e) {
		if (!(e > this.orderIn)) {
			this.orderOut = e, this.nChOut = getAmbisonicChannelCount2D(this.orderOut), this.out.disconnect(), this.out = this.ctx.createChannelMerger(this.nChOut);
			for (let e = 0; e < this.nChOut; e++) this.in.connect(this.out, e, e);
		}
	}
}, orderWeight = class {
	constructor(e, t) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(this.order), this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh), this.gains = Array(this.nCh), this.orderGains = Array(this.order + 1), this.orderGains.fill(1);
		for (let e = 0; e < this.nCh; e++) this.gains[e] = this.ctx.createGain(), this.in.connect(this.gains[e], e, 0), this.gains[e].connect(this.out, 0, e);
	}
	updateOrderGains() {
		for (let e = 0; e < this.nCh; e++) {
			let t = Math.floor(Math.sqrt(e));
			this.gains[e].gain.value = this.orderGains[t];
		}
	}
	computeMaxRECoeffs() {
		let e = this.order;
		this.orderGains[0] = 1;
		let t = 0, n = 0;
		for (let r = 1; r <= e; r++) {
			let i = recurseLegendrePoly_1(r, [Math.cos(2.406809 / (e + 1.51))], t, n);
			this.orderGains[r] = i[0][0], n = t, t = i;
		}
	}
}, sceneRotator = class {
	constructor(e, t) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.yaw = 0, this.pitch = 0, this.roll = 0, this.rotMtx = numeric.identity(this.nCh), this.rotMtxNodes = Array(this.order), this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh);
		for (let e = 1; e <= this.order; e++) {
			let t = Array(2 * e + 1);
			for (let n = 0; n < 2 * e + 1; n++) {
				t[n] = Array(2 * e + 1);
				for (let r = 0; r < 2 * e + 1; r++) t[n][r] = this.ctx.createGain(), t[n][r].gain.value = +(n === r);
			}
			this.rotMtxNodes[e - 1] = t;
		}
		this.in.connect(this.out, 0, 0);
		let n = 1;
		for (let e = 1; e <= this.order; e++) {
			for (let t = 0; t < 2 * e + 1; t++) for (let r = 0; r < 2 * e + 1; r++) this.in.connect(this.rotMtxNodes[e - 1][t][r], n + r, 0), this.rotMtxNodes[e - 1][t][r].connect(this.out, 0, n + t);
			n = n + 2 * e + 1;
		}
	}
	updateRotMtx() {
		let e = degreesToRadians(this.yaw), t = degreesToRadians(this.pitch), n = degreesToRadians(this.roll);
		this.rotMtx = getSHrotMtx_1(yawPitchRoll2Rzyx_1(e, t, n), this.order);
		let r = 1;
		for (let e = 1; e < this.order + 1; e++) {
			for (let t = 0; t < 2 * e + 1; t++) for (let n = 0; n < 2 * e + 1; n++) this.rotMtxNodes[e - 1][t][n].gain.value = this.rotMtx[r + t][r + n];
			r = r + 2 * e + 1;
		}
	}
}, sceneRotator2D = class {
	constructor(e, t) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount2D(t), this.yaw = 0, this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh), this.rotMtxNodes = Array(2 * this.order), this.in.connect(this.out, 0, 0);
		for (let e = 0; e < 2 * this.order; e += 2) {
			let t = [this.ctx.createGain(), this.ctx.createGain()], n = [this.ctx.createGain(), this.ctx.createGain()];
			this.rotMtxNodes[e] = t, this.rotMtxNodes[e + 1] = n, this.in.connect(this.rotMtxNodes[e][0], e + 1, 0), this.rotMtxNodes[e][0].connect(this.out, 0, e + 1), this.in.connect(this.rotMtxNodes[e][1], e + 2, 0), this.rotMtxNodes[e][1].connect(this.out, 0, e + 1), this.in.connect(this.rotMtxNodes[e + 1][0], e + 1, 0), this.rotMtxNodes[e + 1][0].connect(this.out, 0, e + 2), this.in.connect(this.rotMtxNodes[e + 1][1], e + 2, 0), this.rotMtxNodes[e + 1][1].connect(this.out, 0, e + 2);
		}
		this.updateRotMtx();
	}
	updateRotMtx() {
		let e = degreesToRadians(this.yaw), t = 1;
		for (let n = 0; n < 2 * this.order; n += 2) this.rotMtxNodes[n][0].gain.value = Math.cos(t * e), this.rotMtxNodes[n][1].gain.value = Math.sin(t * e), this.rotMtxNodes[n + 1][0].gain.value = -Math.sin(t * e), this.rotMtxNodes[n + 1][1].gain.value = Math.cos(t * e), t++;
	}
}, sceneMirror = class {
	constructor(e, t) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.mirrorPlane = 0, this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh), this.gains = Array(this.nCh);
		for (let e = 0; e < this.nCh; e++) this.gains[e] = this.ctx.createGain(), this.gains[e].gain.value = 1, this.in.connect(this.gains[e], e, 0), this.gains[e].connect(this.out, 0, e);
	}
	reset() {
		for (let e = 0; e < this.nCh; e++) this.gains[e].gain.value = 1;
	}
	mirror(e) {
		switch (e) {
			case 0:
				this.mirrorPlane = 0, this.reset();
				break;
			case 1:
				this.reset(), this.mirrorPlane = 1;
				for (let e = 0; e <= this.order; e++) for (let t = -e; t <= e; t++) {
					let n = e * e + e + t;
					(t < 0 && t % 2 == 0 || t > 0 && t % 2 == 1) && (this.gains[n].gain.value = -1);
				}
				break;
			case 2:
				this.reset(), this.mirrorPlane = 2;
				for (let e = 0; e <= this.order; e++) for (let t = -e; t <= e; t++) {
					let n = e * e + e + t;
					t < 0 && (this.gains[n].gain.value = -1);
				}
				break;
			case 3:
				this.reset(), this.mirrorPlane = 3;
				for (let e = 0; e <= this.order; e++) for (let t = -e; t <= e; t++) {
					let n = e * e + e + t;
					(t + e) % 2 == 1 && (this.gains[n].gain.value = -1);
				}
				break;
			default: console.log("The mirroring planes can be either 1 (yz), 2 (xz), 3 (xy), or 0 (no mirroring). Value set to 0."), this.mirrorPlane = 0, this.reset();
		}
	}
}, sceneMirror2D = class {
	constructor(e, t) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount2D(t), this.mirrorPlane = 0, this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh), this.gains = Array(this.nCh);
		for (let e = 0; e < this.nCh; e++) this.gains[e] = this.ctx.createGain(), this.gains[e].gain.value = 1, this.in.connect(this.gains[e], e, 0), this.gains[e].connect(this.out, 0, e);
	}
	reset() {
		for (let e = 0; e < this.nCh; e++) this.gains[e].gain.value = 1;
	}
	mirror(e) {
		switch (e) {
			case 0:
				this.mirrorPlane = 0, this.reset();
				break;
			case 1:
				this.reset(), this.mirrorPlane = 1;
				for (let e = 2; e < this.nCh; e++) this.gains[e].gain.value = -1, e % 2 != 0 && (e += 2);
				break;
			case 2:
				this.reset(), this.mirrorPlane = 2;
				for (let e = 0; e < this.nCh; e++) e % 2 != 0 && (this.gains[e].gain.value = -1);
				break;
			case 3:
				console.log("up-down mirroring in 2D mode not possible");
				break;
			default: console.log("The mirroring planes can be either 1 (yz), 2 (xz) or 0 (no mirroring). Value set to 0."), this.mirrorPlane = 0, this.reset();
		}
	}
}, binDecoder = class {
	constructor(e, t) {
		this.initialized = !1, this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.decFilters = Array(this.nCh), this.decFilterNodes = Array(this.nCh), this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(2), this.out.channelCountMode = "explicit", this.out.channelCount = 1, this.gainMid = this.ctx.createGain(), this.gainSide = this.ctx.createGain(), this.invertSide = this.ctx.createGain(), this.gainMid.gain.value = 1, this.gainSide.gain.value = 1, this.invertSide.gain.value = -1;
		for (let e = 0; e < this.nCh; e++) this.decFilterNodes[e] = this.ctx.createConvolver(), this.decFilterNodes[e].normalize = !1;
		this.resetFilters();
		for (let e = 0; e < this.nCh; e++) {
			this.in.connect(this.decFilterNodes[e], e, 0);
			let t = Math.floor(Math.sqrt(e));
			e - t * t - t >= 0 ? this.decFilterNodes[e].connect(this.gainMid) : this.decFilterNodes[e].connect(this.gainSide);
		}
		this.gainMid.connect(this.out, 0, 0), this.gainSide.connect(this.out, 0, 0), this.gainMid.connect(this.out, 0, 1), this.gainSide.connect(this.invertSide, 0, 0), this.invertSide.connect(this.out, 0, 1), this.initialized = !0;
	}
	updateFilters(e) {
		for (let t = 0; t < this.nCh; t++) this.decFilters[t] = this.ctx.createBuffer(1, e.length, e.sampleRate), this.decFilters[t].getChannelData(0).set(e.getChannelData(t)), this.decFilterNodes[t].buffer = this.decFilters[t];
	}
	resetFilters() {
		let e = Array(this.nCh);
		e.fill(0), e[0] = .5, e[1] = .5 / Math.sqrt(3);
		for (let t = 0; t < this.nCh; t++) {
			this.decFilters[t] = this.ctx.createBuffer(1, 64, this.ctx.sampleRate);
			for (let e = 0; e < 64; e++) this.decFilters[t].getChannelData(0)[e] = 0;
			this.decFilters[t].getChannelData(0)[0] = e[t], this.decFilterNodes[t].buffer = this.decFilters[t];
		}
	}
}, binDecoder2D = class {
	constructor(e, t) {
		this.initialized = !1, this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount2D(t), this.decFilters = Array(this.nCh), this.decFilterNodes = Array(this.nCh), this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(2), this.out.channelCountMode = "explicit", this.out.channelCount = 1, this.gainMid = this.ctx.createGain(), this.gainSide = this.ctx.createGain(), this.invertSide = this.ctx.createGain(), this.gainMid.gain.value = 1, this.gainSide.gain.value = 1, this.invertSide.gain.value = -1;
		for (let e = 0; e < this.nCh; e++) this.decFilterNodes[e] = this.ctx.createConvolver(), this.decFilterNodes[e].normalize = !1;
		this.resetFilters();
		for (let e = 0; e < this.nCh; e++) this.in.connect(this.decFilterNodes[e], e, 0), e % 2 == 0 ? this.decFilterNodes[e].connect(this.gainMid) : this.decFilterNodes[e].connect(this.gainSide);
		this.gainMid.connect(this.out, 0, 0), this.gainSide.connect(this.out, 0, 0), this.gainMid.connect(this.out, 0, 1), this.gainSide.connect(this.invertSide, 0, 0), this.invertSide.connect(this.out, 0, 1), this.initialized = !0;
	}
	updateFilters(e) {
		for (let t = 0; t < this.nCh; t++) this.decFilters[t] = this.ctx.createBuffer(1, e.length, e.sampleRate), this.decFilters[t].getChannelData(0).set(e.getChannelData(t)), this.decFilterNodes[t].buffer = this.decFilters[t];
	}
	resetFilters() {
		let e = Array(this.nCh);
		e.fill(0), e[0] = .5, e[1] = .5 / Math.sqrt(3);
		for (let t = 0; t < this.nCh; t++) {
			this.decFilters[t] = this.ctx.createBuffer(1, 64, this.ctx.sampleRate);
			for (let e = 0; e < 64; e++) this.decFilters[t].getChannelData(0)[e] = 0;
			this.decFilters[t].getChannelData(0)[0] = e[t], this.decFilterNodes[t].buffer = this.decFilters[t];
		}
	}
}, decoder = class {
	constructor(e, t) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.nSpk = 0, this._decodingMatrix = [], this._spkSphPosArray = [], this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(1), this._spkSphPosArray = this._getDefaultSpkConfig(this.order), this._updateDecodeMtx(this._spkSphPosArray);
	}
	set speakerPos(e) {
		e === void 0 && (e = this._getDefaultSpkConfig(this.order)), this._spkSphPosArray = e, this.out.disconnect(), this._updateDecodeMtx(e);
	}
	get speakerPos() {
		return this._spkSphPosArray;
	}
	_updateDecodeMtx(e) {
		this.nSpk = e.length, this.out = this.ctx.createChannelMerger(this.nSpk), this._decodingMatrix = getAmbisonicDecMtx(e, this.order), this.mtxGain = Array(this.nCh);
		for (let e = 0; e < this.nCh; e++) {
			this.mtxGain[e] = Array(this.nSpk);
			for (let t = 0; t < this.nSpk; t++) {
				let n = this.ctx.createGain();
				n.gain.value = this._decodingMatrix[t][e], this.in.connect(n, e, 0), n.connect(this.out, 0, t), this.mtxGain[e][t] = n;
			}
		}
	}
	_getDefaultSpkConfig(e) {
		let t = [];
		switch (e) {
			case 1:
				t = [
					[
						0,
						0,
						1
					],
					[
						90,
						0,
						1
					],
					[
						180,
						0,
						1
					],
					[
						270,
						0,
						1
					],
					[
						0,
						90,
						1
					],
					[
						0,
						-90,
						1
					]
				];
				break;
			case 2:
				t = [
					[
						180,
						-31.7161,
						.5878
					],
					[
						180,
						31.7161,
						.5878
					],
					[
						-121.7161,
						0,
						.5878
					],
					[
						121.7161,
						0,
						.5878
					],
					[
						-90,
						-58.2839,
						.5878
					],
					[
						-90,
						58.2839,
						.5878
					],
					[
						90,
						-58.2839,
						.5878
					],
					[
						90,
						58.2839,
						.5878
					],
					[
						-58.2839,
						0,
						.5878
					],
					[
						58.2839,
						0,
						.5878
					],
					[
						0,
						-31.7161,
						.5878
					],
					[
						0,
						31.7161,
						.5878
					]
				];
				break;
			case 3:
				t = [
					[
						-159.0931,
						0,
						.5352
					],
					[
						159.0931,
						0,
						.5352
					],
					[
						-135,
						-35.2644,
						.5352
					],
					[
						-135,
						35.2644,
						.5352
					],
					[
						135,
						-35.2644,
						.5352
					],
					[
						135,
						35.2644,
						.5352
					],
					[
						180,
						-69.0931,
						.5352
					],
					[
						180,
						69.0931,
						.5352
					],
					[
						-90,
						-20.9069,
						.5352
					],
					[
						-90,
						20.9069,
						.5352
					],
					[
						90,
						-20.9069,
						.5352
					],
					[
						90,
						20.9069,
						.5352
					],
					[
						0,
						-69.0931,
						.5352
					],
					[
						0,
						69.0931,
						.5352
					],
					[
						-45,
						-35.2644,
						.5352
					],
					[
						-45,
						35.2644,
						.5352
					],
					[
						45,
						-35.2644,
						.5352
					],
					[
						45,
						35.2644,
						.5352
					],
					[
						-20.9069,
						0,
						.5352
					],
					[
						20.9069,
						0,
						.5352
					]
				];
				break;
			default: console.error("unsupported default order:", e);
		}
		return t;
	}
}, convolver = class {
	constructor(e, t) {
		this.initialized = !1, this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.encFilters = Array(this.nCh), this.encFilterNodes = Array(this.nCh), this.in = this.ctx.createGain(), this.in.channelCountMode = "explicit", this.in.channelCount = 1, this.out = this.ctx.createChannelMerger(this.nCh);
		for (let e = 0; e < this.nCh; e++) this.encFilterNodes[e] = this.ctx.createConvolver(), this.encFilterNodes[e].normalize = !1;
		for (let e = 0; e < this.nCh; e++) this.in.connect(this.encFilterNodes[e]), this.encFilterNodes[e].connect(this.out, 0, e);
		this.initialized = !0;
	}
	updateFilters(e) {
		for (let t = 0; t < this.nCh; t++) this.encFilters[t] = this.ctx.createBuffer(1, e.length, e.sampleRate), this.encFilters[t].getChannelData(0).set(e.getChannelData(t)), this.encFilterNodes[t].buffer = this.encFilters[t];
	}
}, virtualMic = class {
	constructor(e, t) {
		this.initialized = !1, this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.azim = 0, this.elev = 0, this.vmicGains = Array(this.nCh), this.vmicGainNodes = Array(this.nCh), this.vmicCoeffs = Array(this.order + 1), this.vmicPattern = "hypercardioid", this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createGain();
		for (let e = 0; e < this.nCh; e++) this.vmicGainNodes[e] = this.ctx.createGain();
		this.SHxyz = Array(this.nCh), this.SHxyz.fill(0), this.updatePattern(), this.updateOrientation();
		for (let e = 0; e < this.nCh; e++) this.in.connect(this.vmicGainNodes[e], e, 0), this.vmicGainNodes[e].connect(this.out);
		this.initialized = !0;
	}
	updatePattern() {
		switch (this.vmicPattern) {
			case "cardioid":
				this.vmicCoeffs = this.computeCardioidCoeffs(this.order);
				break;
			case "supercardioid":
				this.vmicCoeffs = this.computeSupercardCoeffs(this.order);
				break;
			case "hypercardioid":
				this.vmicCoeffs = this.computeHypercardCoeffs(this.order);
				break;
			case "max_rE":
				this.vmicCoeffs = this.computeMaxRECoeffs(this.order);
				break;
			default: this.vmicPattern = "hypercardioid", this.vmicCoeffs = this.computeHypercardCoeffs(this.order);
		}
		this.updateGains();
	}
	updateOrientation() {
		let e = degreesToRadians(this.azim), t = degreesToRadians(this.elev), n = computeRealSH_1(this.order, [[e, t]]);
		for (let e = 0; e < this.nCh; e++) this.SHxyz[e] = n[e][0];
		this.updateGains();
	}
	updateGains() {
		for (let e = 0; e <= this.order; e++) for (let t = -e; t <= e; t++) {
			let n = e * e + e + t;
			this.vmicGains[n] = this.vmicCoeffs[e] * this.SHxyz[n];
		}
		for (let e = 0; e < this.nCh; e++) this.vmicGainNodes[e].gain.value = this.vmicGains[e];
	}
	computeCardioidCoeffs(e) {
		let t = Array(e + 1);
		for (let n = 0; n <= e; n++) t[n] = factorial_1(e) * factorial_1(e) / (factorial_1(e + n + 1) * factorial_1(e - n));
		return t;
	}
	computeHypercardCoeffs(e) {
		let t = Array(e + 1), n = (e + 1) * (e + 1);
		for (let r = 0; r <= e; r++) t[r] = 1 / n;
		return t;
	}
	computeSupercardCoeffs(e) {
		switch (e) {
			case 1: return [.366, .2113];
			case 2: return [
				.2362,
				.1562,
				.059
			];
			case 3: return [
				.1768,
				.1281,
				.0633,
				.0175
			];
			case 4: return [
				.1414,
				.1087,
				.0623,
				.0247,
				.0054
			];
			default: return console.error("Orders should be in the range of 1-4 at the moment."), [];
		}
	}
	computeMaxRECoeffs(e) {
		let t = Array(e + 1);
		t[0] = 1;
		let n = 0, r = 0;
		for (let i = 1; i < e + 1; i++) {
			let a = recurseLegendrePoly_1(i, [Math.cos(2.406809 / (e + 1.51))], n, r);
			t[i] = a[0][0], r = n, n = a;
		}
		let i = 0;
		for (let n = 0; n <= e; n++) i += t[n] * (2 * n + 1);
		for (let n = 0; n <= e; n++) t[n] = t[n] / i;
		return t;
	}
};
if (commonjsGlobal.AnalyserNode && !commonjsGlobal.AnalyserNode.prototype.getFloatTimeDomainData) {
	var uint8 = /* @__PURE__ */ new Uint8Array(2048);
	commonjsGlobal.AnalyserNode.prototype.getFloatTimeDomainData = function(e) {
		this.getByteTimeDomainData(uint8);
		for (var t = 0, n = e.length; t < n; t++) e[t] = (uint8[t] - 128) * .0078125;
	};
}
var rmsAnalyser = class {
	constructor(e, t) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.fftSize = 2048, this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh), this.analysers = Array(this.nCh), this.analBuffers = Array(this.nCh);
		for (let e = 0; e < this.nCh; e++) this.analysers[e] = this.ctx.createAnalyser(), this.analysers[e].fftSize = this.fftSize, this.analysers[e].smoothingTimeConstant = 0, this.analBuffers[e] = new Float32Array(this.fftSize), this.in.connect(this.analysers[e], e, 0), this.analysers[e].connect(this.out, 0, e);
	}
	updateBuffers() {
		for (let e = 0; e < this.nCh; e++) this.analysers[e].getFloatTimeDomainData(this.analBuffers[e]);
	}
	computeRMS() {
		let e = Array(this.nCh);
		e.fill(0);
		for (let t = 0; t < this.nCh; t++) {
			for (let n = 0; n < this.fftSize; n++) e[t] = e[t] + this.analBuffers[t][n] * this.analBuffers[t][n];
			e[t] = Math.sqrt(e[t] / this.fftSize);
		}
		return e;
	}
}, powermapAnalyser = class {
	constructor(e, t, n) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.fftSize = 2048, this.analysers = Array(this.nCh), this.analBuffers = Array(this.nCh), this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh);
		for (let e = 0; e < this.nCh; e++) this.analysers[e] = this.ctx.createAnalyser(), this.analysers[e].fftSize = this.fftSize, this.analysers[e].smoothingTimeConstant = 0, this.analBuffers[e] = new Float32Array(this.fftSize);
		for (let e = 0; e < this.nCh; e++) this.in.connect(this.out, e, e), this.in.connect(this.analysers[e], e, 0);
		let r = getTdesign(4 * t);
		this.td_dirs_rad = deg2rad(r), this.SHmtx = computeRealSH_1(this.order, this.td_dirs_rad), this.mode = n;
	}
	updateBuffers() {
		for (let e = 0; e < this.nCh; e++) this.analysers[e].getFloatTimeDomainData(this.analBuffers[e]);
	}
	computePowermap() {
		let e = this.td_dirs_rad.length, t = numeric.dot(numeric.transpose(this.SHmtx), this.analBuffers), n = Array(e);
		for (let r = 0; r < e; r++) {
			let e = 0;
			for (let n = 0; n < this.fftSize; n++) e += t[r][n] * t[r][n];
			e /= this.fftSize, n[r] = [
				this.td_dirs_rad[r][0],
				this.td_dirs_rad[r][1],
				e
			];
		}
		return this.mode === 0 ? n : forwardSHT_1(2 * this.order, n, 1, 0);
	}
}, intensityAnalyser = class {
	constructor(e) {
		this.ctx = e, this.fftSize = 2048, this.in = this.ctx.createChannelSplitter(4), this.out = this.ctx.createChannelMerger(4), this.gains = [
			,
			,
			,
		];
		for (let e = 0; e < 3; e++) this.gains[e] = this.ctx.createGain(), this.gains[e].gain.value = 1 / Math.sqrt(3);
		this.analysers = [
			,
			,
			,
			,
		], this.analBuffers = [
			,
			,
			,
			,
		];
		for (let e = 0; e < 4; e++) this.analysers[e] = this.ctx.createAnalyser(), this.analysers[e].fftSize = this.fftSize, this.analysers[e].smoothingTimeConstant = 0, this.analBuffers[e] = new Float32Array(this.fftSize);
		this.in.connect(this.out, 0, 0), this.in.connect(this.analysers[0], 0, 0), this.in.connect(this.gains[1], 1, 0), this.in.connect(this.gains[2], 2, 0), this.in.connect(this.gains[0], 3, 0);
		for (let e = 0; e < 3; e++) this.gains[e].connect(this.analysers[e + 1], 0, 0), this.gains[e].connect(this.out, 0, e + 1);
	}
	updateBuffers() {
		for (let e = 0; e < 4; e++) this.analysers[e].getFloatTimeDomainData(this.analBuffers[e]);
	}
	computeIntensity() {
		let e = 0, t = 0, n = 0, r = 0, i = 0, a = 0, o = 0;
		for (let s = 0; s < this.fftSize; s++) e += this.analBuffers[0][s] * this.analBuffers[1][s], t += this.analBuffers[0][s] * this.analBuffers[2][s], n += this.analBuffers[0][s] * this.analBuffers[3][s], r += this.analBuffers[0][s] * this.analBuffers[0][s], i += this.analBuffers[1][s] * this.analBuffers[1][s], a += this.analBuffers[2][s] * this.analBuffers[2][s], o += this.analBuffers[3][s] * this.analBuffers[3][s];
		let s = [
			e,
			t,
			n
		], c = Math.sqrt(s[0] * s[0] + s[1] * s[1] + s[2] * s[2]), l = (r + i + a + o) / 2, u = 1 - c / (l + 1e-7);
		return [
			radiansToDegrees(Math.atan2(t, e)),
			radiansToDegrees(Math.atan2(s[2], Math.sqrt(s[0] * s[0] + s[1] * s[1]))),
			u,
			l
		];
	}
}, intensityAnalyser2D = class {
	constructor(e) {
		this.ctx = e, this.fftSize = 2048, this.in = this.ctx.createChannelSplitter(3), this.out = this.ctx.createChannelMerger(3), this.gains = [, ,];
		for (let e = 0; e < 2; e++) this.gains[e] = this.ctx.createGain(), this.gains[e].gain.value = 1 / Math.sqrt(3);
		this.analysers = [
			,
			,
			,
		], this.analBuffers = [
			,
			,
			,
		];
		for (let e = 0; e < 3; e++) this.analysers[e] = this.ctx.createAnalyser(), this.analysers[e].fftSize = this.fftSize, this.analysers[e].smoothingTimeConstant = 0, this.analBuffers[e] = new Float32Array(this.fftSize);
		this.in.connect(this.out, 0, 0), this.in.connect(this.analysers[0], 0, 0), this.in.connect(this.gains[1], 1, 0), this.in.connect(this.gains[0], 2, 0);
		for (let e = 0; e < 2; e++) this.gains[e].connect(this.analysers[e + 1], 0, 0), this.gains[e].connect(this.out, 0, e + 1);
	}
	updateBuffers() {
		for (let e = 0; e < 3; e++) this.analysers[e].getFloatTimeDomainData(this.analBuffers[e]);
	}
	computeIntensity() {
		let e = 0, t = 0, n = 0, r = 0, i = 0;
		for (let a = 0; a < this.fftSize; a++) e += this.analBuffers[0][a] * this.analBuffers[1][a], t += this.analBuffers[0][a] * this.analBuffers[2][a], n += this.analBuffers[0][a] * this.analBuffers[0][a], r += this.analBuffers[1][a] * this.analBuffers[1][a], i += this.analBuffers[2][a] * this.analBuffers[2][a];
		let a = [e, t], o = Math.sqrt(a[0] * a[0] + a[1] * a[1]), s = (n + r + i) / 2, c = 1 - o / (s + 1e-7);
		return [
			-radiansToDegrees(Math.atan2(t, e)),
			0,
			c,
			s
		];
	}
};
function pad(e, t) {
	return ("000000000" + e).substr(-2);
}
var HOAloader = class {
	constructor(e, t, n, r) {
		this.context = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.nChGroups = Math.ceil(this.nCh / 8), this.buffers = [], this.loadCount = 0, this.loaded = !1, this.onLoad = r, this.urls = Array(this.nChGroups), this.concatBuffer = null;
		let i = n.slice(n.length - 3, n.length);
		this.fileExt = i;
		for (let e = 0; e < this.nChGroups; e++) e === this.nChGroups - 1 ? this.urls[e] = n.slice(0, n.length - 4) + "_" + pad(e * 8 + 1) + "-" + pad(this.nCh) + "ch." + i : this.urls[e] = n.slice(0, n.length - 4) + "_" + pad(e * 8 + 1) + "-" + pad(e * 8 + 8) + "ch." + i;
	}
	loadBuffers(e, t) {
		let n = new XMLHttpRequest();
		n.open("GET", e, !0), n.responseType = "arraybuffer";
		let r = this;
		n.onload = function() {
			r.context.decodeAudioData(n.response, function(n) {
				if (!n) {
					alert("error decoding file data: " + e);
					return;
				}
				r.buffers[t] = n, r.loadCount++, r.loadCount === r.nChGroups && (r.loaded = !0, r.concatBuffers(), console.log("HOAloader: all buffers loaded and concatenated"), r.onLoad(r.concatBuffer));
			}, function(t) {
				alert("Browser cannot decode audio data:  " + e + "\n\nError: " + t + "\n\n(If you re using Safari and get a null error, this is most likely due to Apple's shady plan going on to stop the .ogg format from easing web developer's life :)");
			});
		}, n.onerror = function() {
			alert("HOAloader: XHR error");
		}, n.send();
	}
	load() {
		for (let e = 0; e < this.nChGroups; ++e) this.loadBuffers(this.urls[e], e);
	}
	concatBuffers() {
		if (!this.loaded) return;
		let e = this.nCh, t = this.nChGroups, n = this.buffers[0].length;
		this.buffers.forEach((e) => {
			n = Math.max(n, e.length);
		});
		let r = this.buffers[0].sampleRate, i = [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8
		];
		this.fileExt.toLowerCase() === "ogg" && (console.log("Loading of 8chan OGG files [Chrome/Firefox]: remap channels to correct order!"), i = [
			1,
			3,
			2,
			7,
			8,
			5,
			6,
			4
		]), this.concatBuffer = this.context.createBuffer(e, n, r);
		for (let e = 0; e < t; e++) for (let t = 0; t < this.buffers[e].numberOfChannels; t++) this.concatBuffer.getChannelData(e * 8 + t).set(this.buffers[e].getChannelData(i[t] - 1));
	}
}, HRIRloader_local = class {
	constructor(e, t, n) {
		this.context = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.onLoad = n, this.vls_dirs_deg = getTdesign(2 * this.order), this.nVLS = this.vls_dirs_deg.length, this.nearestLookupRes = [5, 5], this.fs = 0, this.nSamples = 0, this.hrir_dirs_deg = [], this.hrirs = [], this.nearestLookup = [], this.nearest_dirs_deg = [], this.vls_hrirs = [], this.decodingMatrix = [], this.hoaBuffer = null;
	}
	load(e) {
		let t = this, n = new XMLHttpRequest();
		n.open("GET", e, !0), n.responseType = "json", n.onload = function() {
			t.parseHrirFromJSON(n.response), t.nearestLookup = createNearestLookup(t.hrir_dirs_deg, t.nearestLookupRes);
			let e = findNearest(t.vls_dirs_deg, t.nearestLookup, t.nearestLookupRes);
			t.nearest_dirs_deg = t.getClosestDirs(e, t.hrir_dirs_deg), t.vls_hrirs = t.getClosestHrirFilters(e, t.hrirs), t.computeDecFilters();
		}, n.send();
	}
	parseHrirFromJSON(e) {
		let t = this;
		this.fs = e.leaves[6].data[0], this.nSamples = e.leaves[8].data[0][1].length, this.hrir_dirs_deg = [], e.leaves[4].data.forEach(function(e) {
			t.hrir_dirs_deg.push([e[0], e[1]]);
		}), this.hrirs = [], e.leaves[8].data.forEach(function(e) {
			let n = new Float64Array(e[0]), r = new Float64Array(e[1]);
			t.hrirs.push([n, r]);
		});
	}
	getClosestDirs(e, t) {
		let n = e.length, r = [];
		for (let i = 0; i < n; i++) r.push(t[e[i]]);
		return r;
	}
	getClosestHrirFilters(e, t) {
		let n = e.length, r = [];
		for (let i = 0; i < n; i++) r.push(t[e[i]]);
		return r;
	}
	computeDecFilters() {
		this.decodingMatrix = getAmbisonicDecMtx(this.nearest_dirs_deg, this.order), this.hoaBuffer = this.getHoaFilterFromHrirFilter(this.nCh, this.nSamples, this.fs, this.vls_hrirs, this.decodingMatrix), this.onLoad(this.hoaBuffer);
	}
	getHoaFilterFromHrirFilter(e, t, n, r, i) {
		t > r[0][0].length && (t = r[0][0].length);
		let a = this.context.createBuffer(e, t, n);
		for (let n = 0; n < e; n++) {
			let e = new Float32Array(t);
			for (let a = 0; a < r.length; a++) for (let o = 0; o < t; o++) e[o] += i[a][n] * r[a][0][o];
			a.getChannelData(n).set(e);
		}
		return a;
	}
}, HRIRloader2D_local = class {
	constructor(e, t, n) {
		this.context = e, this.order = t, this.nCh = getAmbisonicChannelCount2D(t), this.onLoad = n, this.vls_dirs_deg = sampleCircle(2 * this.order + 2), this.nVLS = this.vls_dirs_deg.length, this.nearestLookupRes = [5, 5], this.fs = 0, this.nSamples = 0, this.hrir_dirs_deg = [], this.hrirs = [], this.nearestLookup = [], this.vls_hrirs = [], this.decodingMatrix = [], this.hoaBuffer = null;
	}
	load(e) {
		let t = this, n = new XMLHttpRequest();
		n.open("GET", e, !0), n.responseType = "json", n.onload = function() {
			t.parseHrirFromJSON(n.response), t.nearestLookup = createNearestLookup(t.hrir_dirs_deg, t.nearestLookupRes);
			let e = findNearest(t.vls_dirs_deg, t.nearestLookup, t.nearestLookupRes);
			t.getClosestDirs(e, t.hrir_dirs_deg), t.vls_hrirs = t.getClosestHrirFilters(e, t.hrirs), t.computeDecFilters();
		}, n.send();
	}
	parseHrirFromJSON(e) {
		let t = this;
		this.fs = e.leaves[6].data[0], this.nSamples = e.leaves[8].data[0][1].length, this.hrir_dirs_deg = [], e.leaves[4].data.forEach(function(e) {
			t.hrir_dirs_deg.push([e[0], e[1]]);
		}), this.hrirs = [], e.leaves[8].data.forEach(function(e) {
			let n = new Float64Array(e[0]), r = new Float64Array(e[1]);
			t.hrirs.push([n, r]);
		});
	}
	getClosestDirs(e, t) {
		let n = e.length, r = [];
		for (let i = 0; i < n; i++) r.push(t[e[i]]);
		return r;
	}
	getClosestHrirFilters(e, t) {
		let n = e.length, r = [];
		for (let i = 0; i < n; i++) r.push(t[e[i]]);
		return r;
	}
	computeDecFilters() {
		let e = [];
		e.push(1);
		for (let t = 1; t < this.order + 1; t++) e.push(Math.cos(t * Math.PI / (2 * this.order + 2))), e.push(Math.cos(t * Math.PI / (2 * this.order + 2)));
		let t = numeric.diag(e);
		this.decodingMatrix = numeric.transpose(getCircHarmonics(this.order, getColumn(this.vls_dirs_deg, 0))), this.decodingMatrix = numeric.dot(this.decodingMatrix, t), this.decodingMatrix = numeric.mul(2 * Math.PI / this.vls_dirs_deg.length, this.decodingMatrix), this.hoaBuffer = this.getHoaFilterFromHrirFilter(this.nCh, this.nSamples, this.fs, this.vls_hrirs, this.decodingMatrix), this.onLoad(this.hoaBuffer);
	}
	getHoaFilterFromHrirFilter(e, t, n, r, i) {
		t > r[0][0].length && (t = r[0][0].length);
		let a = this.context.createBuffer(e, t, n);
		for (let n = 0; n < e; n++) {
			let e = new Float32Array(t);
			for (let a = 0; a < r.length; a++) for (let o = 0; o < t; o++) e[o] += i[a][n] * r[a][0][o];
			a.getChannelData(n).set(e);
		}
		return a;
	}
};
function commonjsRequire(e) {
	throw Error("Could not dynamically require \"" + e + "\". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.");
}
var serveSofaHrir = { exports: {} };
(function(e, t) {
	(function(t) {
		e.exports = t();
	})(function() {
		return function e(t, n, r) {
			function i(o, s) {
				if (!n[o]) {
					if (!t[o]) {
						var c = typeof commonjsRequire == "function" && commonjsRequire;
						if (!s && c) return c(o, !0);
						if (a) return a(o, !0);
						var l = /* @__PURE__ */ Error("Cannot find module '" + o + "'");
						throw l.code = "MODULE_NOT_FOUND", l;
					}
					var u = n[o] = { exports: {} };
					t[o][0].call(u.exports, function(e) {
						var n = t[o][1][e];
						return i(n || e);
					}, u, u.exports, e, t, n, r);
				}
				return n[o].exports;
			}
			for (var a = typeof commonjsRequire == "function" && commonjsRequire, o = 0; o < r.length; o++) i(r[o]);
			return i;
		}({
			1: [function(e, t, n) {
				t.exports = {
					default: e("core-js/library/fn/object/define-property"),
					__esModule: !0
				};
			}, { "core-js/library/fn/object/define-property": 4 }],
			2: [function(e, t, n) {
				n.default = function(e, t) {
					if (!(e instanceof t)) throw TypeError("Cannot call a class as a function");
				}, n.__esModule = !0;
			}, {}],
			3: [function(e, t, n) {
				var r = e("babel-runtime/core-js/object/define-property").default;
				n.default = /* @__PURE__ */ function() {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var i = t[n];
							i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), r(e, i.key, i);
						}
					}
					return function(t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				}(), n.__esModule = !0;
			}, { "babel-runtime/core-js/object/define-property": 1 }],
			4: [function(e, t, n) {
				var r = e("../../modules/$");
				t.exports = function(e, t, n) {
					return r.setDesc(e, t, n);
				};
			}, { "../../modules/$": 5 }],
			5: [function(e, t, n) {
				var r = Object;
				t.exports = {
					create: r.create,
					getProto: r.getPrototypeOf,
					isEnum: {}.propertyIsEnumerable,
					getDesc: r.getOwnPropertyDescriptor,
					setDesc: r.defineProperty,
					setDescs: r.defineProperties,
					getKeys: r.keys,
					getNames: r.getOwnPropertyNames,
					getSymbols: r.getOwnPropertySymbols,
					each: [].forEach
				};
			}, {}],
			6: [function(e, t, n) {
				var r = e("babel-runtime/helpers/create-class").default, i = e("babel-runtime/helpers/class-call-check").default;
				Object.defineProperty(n, "__esModule", { value: !0 }), n.default = function() {
					function e(t, n) {
						i(this, e), this.delayTime = 0, this.posRead = 0, this.posWrite = 0, this.fracXi1 = 0, this.fracYi1 = 0, this.intDelay = 0, this.fracDelay = 0, this.a1 = void 0, this.sampleRate = t, this.maxDelayTime = n || 1, this.bufferSize = this.maxDelayTime * this.sampleRate, this.bufferSize % 1 != 0 && (this.bufferSize = parseInt(this.bufferSize) + 1), this.buffer = new Float32Array(this.bufferSize);
					}
					return r(e, [
						{
							key: "setDelay",
							value: function(e) {
								if (e < this.maxDelayTime) {
									this.delayTime = e;
									var t = e * this.sampleRate;
									this.intDelay = parseInt(t), this.fracDelay = t - this.intDelay, this.resample(), this.fracDelay !== 0 && this.updateThiranCoefficient();
								} else throw Error("delayTime > maxDelayTime");
							}
						},
						{
							key: "getDelay",
							value: function() {
								return this.delayTime;
							}
						},
						{
							key: "process",
							value: function(e) {
								for (var t = new Float32Array(e.length), n = 0; n < e.length; n += 1) this.buffer[this.posWrite] = e[n], t[n] = this.buffer[this.posRead], this.updatePointers();
								return this.fracDelay === 0 || (t = new Float32Array(this.fractionalThiranProcess(t))), t;
							}
						},
						{
							key: "updatePointers",
							value: function() {
								this.posWrite === this.buffer.length - 1 ? this.posWrite = 0 : this.posWrite += 1, this.posRead === this.buffer.length - 1 ? this.posRead = 0 : this.posRead += 1;
							}
						},
						{
							key: "updateThiranCoefficient",
							value: function() {
								this.a1 = (1 - this.fracDelay) / (1 + this.fracDelay);
							}
						},
						{
							key: "resample",
							value: function() {
								if (this.posWrite - this.intDelay < 0) {
									var e = this.intDelay - this.posWrite;
									this.posRead = this.buffer.length - e;
								} else this.posRead = this.posWrite - this.intDelay;
							}
						},
						{
							key: "fractionalThiranProcess",
							value: function(e) {
								for (var t = new Float32Array(e.length), n, r, i = this.fracXi1, a = this.fracYi1, o = 0; o < e.length; o += 1) n = e[o], r = this.a1 * n + i - this.a1 * a, i = n, a = r, t[o] = r;
								return this.fracXi1 = i, this.fracYi1 = a, t;
							}
						}
					]), e;
				}(), t.exports = n.default;
			}, {
				"babel-runtime/helpers/class-call-check": 2,
				"babel-runtime/helpers/create-class": 3
			}],
			7: [function(e, t, n) {
				t.exports = e("./dist/fractional-delay");
			}, { "./dist/fractional-delay": 6 }],
			8: [function(e, t, n) {
				(function(e, r) {
					if (typeof n == "object" && typeof t == "object") t.exports = r();
					else {
						var i = r();
						for (var a in i) (typeof n == "object" ? n : e)[a] = i[a];
					}
				})(this, function() {
					return function(e) {
						var t = {};
						function n(r) {
							if (t[r]) return t[r].exports;
							var i = t[r] = {
								i: r,
								l: !1,
								exports: {}
							};
							return e[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports;
						}
						return n.m = e, n.c = t, n.d = function(e, t, r) {
							n.o(e, t) || Object.defineProperty(e, t, {
								configurable: !1,
								enumerable: !0,
								get: r
							});
						}, n.n = function(e) {
							var t = e && e.__esModule ? (function() {
								return e.default;
							}) : (function() {
								return e;
							});
							return n.d(t, "a", t), t;
						}, n.o = function(e, t) {
							return Object.prototype.hasOwnProperty.call(e, t);
						}, n.p = "", n(n.s = 4);
					}([
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.setMatrixArrayType = i, t.toRadian = o, t.equals = s;
							var r = t.EPSILON = 1e-6;
							t.ARRAY_TYPE = typeof Float32Array < "u" ? Float32Array : Array, t.RANDOM = Math.random;
							function i(e) {
								t.ARRAY_TYPE = e;
							}
							var a = Math.PI / 180;
							function o(e) {
								return e * a;
							}
							function s(e, t) {
								return Math.abs(e - t) <= r * Math.max(1, Math.abs(e), Math.abs(t));
							}
						},
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.sub = t.mul = void 0, t.create = a, t.fromMat4 = o, t.clone = s, t.copy = c, t.fromValues = l, t.set = u, t.identity = d, t.transpose = f, t.invert = p, t.adjoint = m, t.determinant = h, t.multiply = g, t.translate = _, t.rotate = v, t.scale = y, t.fromTranslation = b, t.fromRotation = x, t.fromScaling = S, t.fromMat2d = w, t.fromQuat = E, t.normalFromMat4 = D, t.projection = O, t.str = j, t.frob = M, t.add = N, t.subtract = F, t.multiplyScalar = I, t.multiplyScalarAndAdd = L, t.exactEquals = R, t.equals = H;
							var r = i(n(0));
							function i(e) {
								if (e && e.__esModule) return e;
								var t = {};
								if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
								return t.default = e, t;
							}
							function a() {
								var e = new r.ARRAY_TYPE(9);
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
							}
							function o(e, t) {
								return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[4], e[4] = t[5], e[5] = t[6], e[6] = t[8], e[7] = t[9], e[8] = t[10], e;
							}
							function s(e) {
								var t = new r.ARRAY_TYPE(9);
								return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t;
							}
							function c(e, t) {
								return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e;
							}
							function l(e, t, n, i, a, o, s, c, l) {
								var u = new r.ARRAY_TYPE(9);
								return u[0] = e, u[1] = t, u[2] = n, u[3] = i, u[4] = a, u[5] = o, u[6] = s, u[7] = c, u[8] = l, u;
							}
							function u(e, t, n, r, i, a, o, s, c, l) {
								return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e[4] = a, e[5] = o, e[6] = s, e[7] = c, e[8] = l, e;
							}
							function d(e) {
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
							}
							function f(e, t) {
								if (e === t) {
									var n = t[1], r = t[2], i = t[5];
									e[1] = t[3], e[2] = t[6], e[3] = n, e[5] = t[7], e[6] = r, e[7] = i;
								} else e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8];
								return e;
							}
							function p(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], c = t[6], l = t[7], u = t[8], d = u * o - s * l, f = -u * a + s * c, p = l * a - o * c, m = n * d + r * f + i * p;
								return m ? (m = 1 / m, e[0] = d * m, e[1] = (-u * r + i * l) * m, e[2] = (s * r - i * o) * m, e[3] = f * m, e[4] = (u * n - i * c) * m, e[5] = (-s * n + i * a) * m, e[6] = p * m, e[7] = (-l * n + r * c) * m, e[8] = (o * n - r * a) * m, e) : null;
							}
							function m(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], c = t[6], l = t[7], u = t[8];
								return e[0] = o * u - s * l, e[1] = i * l - r * u, e[2] = r * s - i * o, e[3] = s * c - a * u, e[4] = n * u - i * c, e[5] = i * a - n * s, e[6] = a * l - o * c, e[7] = r * c - n * l, e[8] = n * o - r * a, e;
							}
							function h(e) {
								var t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8];
								return t * (l * a - o * c) + n * (-l * i + o * s) + r * (c * i - a * s);
							}
							function g(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = t[6], u = t[7], d = t[8], f = n[0], p = n[1], m = n[2], h = n[3], g = n[4], _ = n[5], v = n[6], y = n[7], b = n[8];
								return e[0] = f * r + p * o + m * l, e[1] = f * i + p * s + m * u, e[2] = f * a + p * c + m * d, e[3] = h * r + g * o + _ * l, e[4] = h * i + g * s + _ * u, e[5] = h * a + g * c + _ * d, e[6] = v * r + y * o + b * l, e[7] = v * i + y * s + b * u, e[8] = v * a + y * c + b * d, e;
							}
							function _(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = t[6], u = t[7], d = t[8], f = n[0], p = n[1];
								return e[0] = r, e[1] = i, e[2] = a, e[3] = o, e[4] = s, e[5] = c, e[6] = f * r + p * o + l, e[7] = f * i + p * s + u, e[8] = f * a + p * c + d, e;
							}
							function v(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = t[6], u = t[7], d = t[8], f = Math.sin(n), p = Math.cos(n);
								return e[0] = p * r + f * o, e[1] = p * i + f * s, e[2] = p * a + f * c, e[3] = p * o - f * r, e[4] = p * s - f * i, e[5] = p * c - f * a, e[6] = l, e[7] = u, e[8] = d, e;
							}
							function y(e, t, n) {
								var r = n[0], i = n[1];
								return e[0] = r * t[0], e[1] = r * t[1], e[2] = r * t[2], e[3] = i * t[3], e[4] = i * t[4], e[5] = i * t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e;
							}
							function b(e, t) {
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = t[0], e[7] = t[1], e[8] = 1, e;
							}
							function x(e, t) {
								var n = Math.sin(t), r = Math.cos(t);
								return e[0] = r, e[1] = n, e[2] = 0, e[3] = -n, e[4] = r, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
							}
							function S(e, t) {
								return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = t[1], e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
							}
							function w(e, t) {
								return e[0] = t[0], e[1] = t[1], e[2] = 0, e[3] = t[2], e[4] = t[3], e[5] = 0, e[6] = t[4], e[7] = t[5], e[8] = 1, e;
							}
							function E(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = n + n, s = r + r, c = i + i, l = n * o, u = r * o, d = r * s, f = i * o, p = i * s, m = i * c, h = a * o, g = a * s, _ = a * c;
								return e[0] = 1 - d - m, e[3] = u - _, e[6] = f + g, e[1] = u + _, e[4] = 1 - l - m, e[7] = p - h, e[2] = f - g, e[5] = p + h, e[8] = 1 - l - d, e;
							}
							function D(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], c = t[6], l = t[7], u = t[8], d = t[9], f = t[10], p = t[11], m = t[12], h = t[13], g = t[14], _ = t[15], v = n * s - r * o, y = n * c - i * o, b = n * l - a * o, x = r * c - i * s, S = r * l - a * s, w = i * l - a * c, E = u * h - d * m, D = u * g - f * m, O = u * _ - p * m, j = d * g - f * h, M = d * _ - p * h, N = f * _ - p * g, F = v * N - y * M + b * j + x * O - S * D + w * E;
								return F ? (F = 1 / F, e[0] = (s * N - c * M + l * j) * F, e[1] = (c * O - o * N - l * D) * F, e[2] = (o * M - s * O + l * E) * F, e[3] = (i * M - r * N - a * j) * F, e[4] = (n * N - i * O + a * D) * F, e[5] = (r * O - n * M - a * E) * F, e[6] = (h * w - g * S + _ * x) * F, e[7] = (g * b - m * w - _ * y) * F, e[8] = (m * S - h * b + _ * v) * F, e) : null;
							}
							function O(e, t, n) {
								return e[0] = 2 / t, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = -2 / n, e[5] = 0, e[6] = -1, e[7] = 1, e[8] = 1, e;
							}
							function j(e) {
								return "mat3(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ")";
							}
							function M(e) {
								return Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2 + e[3] ** 2 + e[4] ** 2 + e[5] ** 2 + e[6] ** 2 + e[7] ** 2 + e[8] ** 2);
							}
							function N(e, t, n) {
								return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], e[4] = t[4] + n[4], e[5] = t[5] + n[5], e[6] = t[6] + n[6], e[7] = t[7] + n[7], e[8] = t[8] + n[8], e;
							}
							function F(e, t, n) {
								return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], e[4] = t[4] - n[4], e[5] = t[5] - n[5], e[6] = t[6] - n[6], e[7] = t[7] - n[7], e[8] = t[8] - n[8], e;
							}
							function I(e, t, n) {
								return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * n, e[5] = t[5] * n, e[6] = t[6] * n, e[7] = t[7] * n, e[8] = t[8] * n, e;
							}
							function L(e, t, n, r) {
								return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, e[4] = t[4] + n[4] * r, e[5] = t[5] + n[5] * r, e[6] = t[6] + n[6] * r, e[7] = t[7] + n[7] * r, e[8] = t[8] + n[8] * r, e;
							}
							function R(e, t) {
								return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8];
							}
							function H(e, t) {
								var n = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7], d = e[8], f = t[0], p = t[1], m = t[2], h = t[3], g = t[4], _ = t[5], v = t[6], y = t[7], b = t[8];
								return Math.abs(n - f) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(f)) && Math.abs(i - p) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(p)) && Math.abs(a - m) <= r.EPSILON * Math.max(1, Math.abs(a), Math.abs(m)) && Math.abs(o - h) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(h)) && Math.abs(s - g) <= r.EPSILON * Math.max(1, Math.abs(s), Math.abs(g)) && Math.abs(c - _) <= r.EPSILON * Math.max(1, Math.abs(c), Math.abs(_)) && Math.abs(l - v) <= r.EPSILON * Math.max(1, Math.abs(l), Math.abs(v)) && Math.abs(u - y) <= r.EPSILON * Math.max(1, Math.abs(u), Math.abs(y)) && Math.abs(d - b) <= r.EPSILON * Math.max(1, Math.abs(d), Math.abs(b));
							}
							t.mul = g, t.sub = F;
						},
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.forEach = t.sqrLen = t.len = t.sqrDist = t.dist = t.div = t.mul = t.sub = void 0, t.create = a, t.clone = o, t.length = s, t.fromValues = c, t.copy = l, t.set = u, t.add = d, t.subtract = f, t.multiply = p, t.divide = m, t.ceil = h, t.floor = g, t.min = _, t.max = v, t.round = y, t.scale = b, t.scaleAndAdd = x, t.distance = S, t.squaredDistance = w, t.squaredLength = E, t.negate = D, t.inverse = O, t.normalize = j, t.dot = M, t.cross = N, t.lerp = F, t.hermite = I, t.bezier = L, t.random = R, t.transformMat4 = H, t.transformMat3 = G, t.transformQuat = K, t.rotateX = q, t.rotateY = J, t.rotateZ = ee, t.angle = Y, t.str = te, t.exactEquals = X, t.equals = Z;
							var r = i(n(0));
							function i(e) {
								if (e && e.__esModule) return e;
								var t = {};
								if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
								return t.default = e, t;
							}
							function a() {
								var e = new r.ARRAY_TYPE(3);
								return e[0] = 0, e[1] = 0, e[2] = 0, e;
							}
							function o(e) {
								var t = new r.ARRAY_TYPE(3);
								return t[0] = e[0], t[1] = e[1], t[2] = e[2], t;
							}
							function s(e) {
								var t = e[0], n = e[1], r = e[2];
								return Math.sqrt(t * t + n * n + r * r);
							}
							function c(e, t, n) {
								var i = new r.ARRAY_TYPE(3);
								return i[0] = e, i[1] = t, i[2] = n, i;
							}
							function l(e, t) {
								return e[0] = t[0], e[1] = t[1], e[2] = t[2], e;
							}
							function u(e, t, n, r) {
								return e[0] = t, e[1] = n, e[2] = r, e;
							}
							function d(e, t, n) {
								return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e;
							}
							function f(e, t, n) {
								return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e;
							}
							function p(e, t, n) {
								return e[0] = t[0] * n[0], e[1] = t[1] * n[1], e[2] = t[2] * n[2], e;
							}
							function m(e, t, n) {
								return e[0] = t[0] / n[0], e[1] = t[1] / n[1], e[2] = t[2] / n[2], e;
							}
							function h(e, t) {
								return e[0] = Math.ceil(t[0]), e[1] = Math.ceil(t[1]), e[2] = Math.ceil(t[2]), e;
							}
							function g(e, t) {
								return e[0] = Math.floor(t[0]), e[1] = Math.floor(t[1]), e[2] = Math.floor(t[2]), e;
							}
							function _(e, t, n) {
								return e[0] = Math.min(t[0], n[0]), e[1] = Math.min(t[1], n[1]), e[2] = Math.min(t[2], n[2]), e;
							}
							function v(e, t, n) {
								return e[0] = Math.max(t[0], n[0]), e[1] = Math.max(t[1], n[1]), e[2] = Math.max(t[2], n[2]), e;
							}
							function y(e, t) {
								return e[0] = Math.round(t[0]), e[1] = Math.round(t[1]), e[2] = Math.round(t[2]), e;
							}
							function b(e, t, n) {
								return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e;
							}
							function x(e, t, n, r) {
								return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e;
							}
							function S(e, t) {
								var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2];
								return Math.sqrt(n * n + r * r + i * i);
							}
							function w(e, t) {
								var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2];
								return n * n + r * r + i * i;
							}
							function E(e) {
								var t = e[0], n = e[1], r = e[2];
								return t * t + n * n + r * r;
							}
							function D(e, t) {
								return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e;
							}
							function O(e, t) {
								return e[0] = 1 / t[0], e[1] = 1 / t[1], e[2] = 1 / t[2], e;
							}
							function j(e, t) {
								var n = t[0], r = t[1], i = t[2], a = n * n + r * r + i * i;
								return a > 0 && (a = 1 / Math.sqrt(a), e[0] = t[0] * a, e[1] = t[1] * a, e[2] = t[2] * a), e;
							}
							function M(e, t) {
								return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
							}
							function N(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = n[0], s = n[1], c = n[2];
								return e[0] = i * c - a * s, e[1] = a * o - r * c, e[2] = r * s - i * o, e;
							}
							function F(e, t, n, r) {
								var i = t[0], a = t[1], o = t[2];
								return e[0] = i + r * (n[0] - i), e[1] = a + r * (n[1] - a), e[2] = o + r * (n[2] - o), e;
							}
							function I(e, t, n, r, i, a) {
								var o = a * a, s = o * (2 * a - 3) + 1, c = o * (a - 2) + a, l = o * (a - 1), u = o * (3 - 2 * a);
								return e[0] = t[0] * s + n[0] * c + r[0] * l + i[0] * u, e[1] = t[1] * s + n[1] * c + r[1] * l + i[1] * u, e[2] = t[2] * s + n[2] * c + r[2] * l + i[2] * u, e;
							}
							function L(e, t, n, r, i, a) {
								var o = 1 - a, s = o * o, c = a * a, l = s * o, u = 3 * a * s, d = 3 * c * o, f = c * a;
								return e[0] = t[0] * l + n[0] * u + r[0] * d + i[0] * f, e[1] = t[1] * l + n[1] * u + r[1] * d + i[1] * f, e[2] = t[2] * l + n[2] * u + r[2] * d + i[2] * f, e;
							}
							function R(e, t) {
								t ||= 1;
								var n = r.RANDOM() * 2 * Math.PI, i = r.RANDOM() * 2 - 1, a = Math.sqrt(1 - i * i) * t;
								return e[0] = Math.cos(n) * a, e[1] = Math.sin(n) * a, e[2] = i * t, e;
							}
							function H(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = n[3] * r + n[7] * i + n[11] * a + n[15];
								return o ||= 1, e[0] = (n[0] * r + n[4] * i + n[8] * a + n[12]) / o, e[1] = (n[1] * r + n[5] * i + n[9] * a + n[13]) / o, e[2] = (n[2] * r + n[6] * i + n[10] * a + n[14]) / o, e;
							}
							function G(e, t, n) {
								var r = t[0], i = t[1], a = t[2];
								return e[0] = r * n[0] + i * n[3] + a * n[6], e[1] = r * n[1] + i * n[4] + a * n[7], e[2] = r * n[2] + i * n[5] + a * n[8], e;
							}
							function K(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = n[0], s = n[1], c = n[2], l = n[3], u = l * r + s * a - c * i, d = l * i + c * r - o * a, f = l * a + o * i - s * r, p = -o * r - s * i - c * a;
								return e[0] = u * l + p * -o + d * -c - f * -s, e[1] = d * l + p * -s + f * -o - u * -c, e[2] = f * l + p * -c + u * -s - d * -o, e;
							}
							function q(e, t, n, r) {
								var i = [], a = [];
								return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[0], a[1] = i[1] * Math.cos(r) - i[2] * Math.sin(r), a[2] = i[1] * Math.sin(r) + i[2] * Math.cos(r), e[0] = a[0] + n[0], e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
							}
							function J(e, t, n, r) {
								var i = [], a = [];
								return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[2] * Math.sin(r) + i[0] * Math.cos(r), a[1] = i[1], a[2] = i[2] * Math.cos(r) - i[0] * Math.sin(r), e[0] = a[0] + n[0], e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
							}
							function ee(e, t, n, r) {
								var i = [], a = [];
								return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[0] * Math.cos(r) - i[1] * Math.sin(r), a[1] = i[0] * Math.sin(r) + i[1] * Math.cos(r), a[2] = i[2], e[0] = a[0] + n[0], e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
							}
							function Y(e, t) {
								var n = c(e[0], e[1], e[2]), r = c(t[0], t[1], t[2]);
								j(n, n), j(r, r);
								var i = M(n, r);
								return i > 1 ? 0 : i < -1 ? Math.PI : Math.acos(i);
							}
							function te(e) {
								return "vec3(" + e[0] + ", " + e[1] + ", " + e[2] + ")";
							}
							function X(e, t) {
								return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
							}
							function Z(e, t) {
								var n = e[0], i = e[1], a = e[2], o = t[0], s = t[1], c = t[2];
								return Math.abs(n - o) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(o)) && Math.abs(i - s) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(s)) && Math.abs(a - c) <= r.EPSILON * Math.max(1, Math.abs(a), Math.abs(c));
							}
							t.sub = f, t.mul = p, t.div = m, t.dist = S, t.sqrDist = w, t.len = s, t.sqrLen = E, t.forEach = function() {
								var e = a();
								return function(t, n, r, i, a, o) {
									var s = void 0, c = void 0;
									for (n ||= 3, r ||= 0, c = i ? Math.min(i * n + r, t.length) : t.length, s = r; s < c; s += n) e[0] = t[s], e[1] = t[s + 1], e[2] = t[s + 2], a(e, e, o), t[s] = e[0], t[s + 1] = e[1], t[s + 2] = e[2];
									return t;
								};
							}();
						},
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.forEach = t.sqrLen = t.len = t.sqrDist = t.dist = t.div = t.mul = t.sub = void 0, t.create = a, t.clone = o, t.fromValues = s, t.copy = c, t.set = l, t.add = u, t.subtract = d, t.multiply = f, t.divide = p, t.ceil = m, t.floor = h, t.min = g, t.max = _, t.round = v, t.scale = y, t.scaleAndAdd = b, t.distance = x, t.squaredDistance = S, t.length = w, t.squaredLength = E, t.negate = D, t.inverse = O, t.normalize = j, t.dot = M, t.lerp = N, t.random = F, t.transformMat4 = I, t.transformQuat = L, t.str = R, t.exactEquals = H, t.equals = G;
							var r = i(n(0));
							function i(e) {
								if (e && e.__esModule) return e;
								var t = {};
								if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
								return t.default = e, t;
							}
							function a() {
								var e = new r.ARRAY_TYPE(4);
								return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e;
							}
							function o(e) {
								var t = new r.ARRAY_TYPE(4);
								return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;
							}
							function s(e, t, n, i) {
								var a = new r.ARRAY_TYPE(4);
								return a[0] = e, a[1] = t, a[2] = n, a[3] = i, a;
							}
							function c(e, t) {
								return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
							}
							function l(e, t, n, r, i) {
								return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e;
							}
							function u(e, t, n) {
								return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], e;
							}
							function d(e, t, n) {
								return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], e;
							}
							function f(e, t, n) {
								return e[0] = t[0] * n[0], e[1] = t[1] * n[1], e[2] = t[2] * n[2], e[3] = t[3] * n[3], e;
							}
							function p(e, t, n) {
								return e[0] = t[0] / n[0], e[1] = t[1] / n[1], e[2] = t[2] / n[2], e[3] = t[3] / n[3], e;
							}
							function m(e, t) {
								return e[0] = Math.ceil(t[0]), e[1] = Math.ceil(t[1]), e[2] = Math.ceil(t[2]), e[3] = Math.ceil(t[3]), e;
							}
							function h(e, t) {
								return e[0] = Math.floor(t[0]), e[1] = Math.floor(t[1]), e[2] = Math.floor(t[2]), e[3] = Math.floor(t[3]), e;
							}
							function g(e, t, n) {
								return e[0] = Math.min(t[0], n[0]), e[1] = Math.min(t[1], n[1]), e[2] = Math.min(t[2], n[2]), e[3] = Math.min(t[3], n[3]), e;
							}
							function _(e, t, n) {
								return e[0] = Math.max(t[0], n[0]), e[1] = Math.max(t[1], n[1]), e[2] = Math.max(t[2], n[2]), e[3] = Math.max(t[3], n[3]), e;
							}
							function v(e, t) {
								return e[0] = Math.round(t[0]), e[1] = Math.round(t[1]), e[2] = Math.round(t[2]), e[3] = Math.round(t[3]), e;
							}
							function y(e, t, n) {
								return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e;
							}
							function b(e, t, n, r) {
								return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, e;
							}
							function x(e, t) {
								var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2], a = t[3] - e[3];
								return Math.sqrt(n * n + r * r + i * i + a * a);
							}
							function S(e, t) {
								var n = t[0] - e[0], r = t[1] - e[1], i = t[2] - e[2], a = t[3] - e[3];
								return n * n + r * r + i * i + a * a;
							}
							function w(e) {
								var t = e[0], n = e[1], r = e[2], i = e[3];
								return Math.sqrt(t * t + n * n + r * r + i * i);
							}
							function E(e) {
								var t = e[0], n = e[1], r = e[2], i = e[3];
								return t * t + n * n + r * r + i * i;
							}
							function D(e, t) {
								return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = -t[3], e;
							}
							function O(e, t) {
								return e[0] = 1 / t[0], e[1] = 1 / t[1], e[2] = 1 / t[2], e[3] = 1 / t[3], e;
							}
							function j(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = n * n + r * r + i * i + a * a;
								return o > 0 && (o = 1 / Math.sqrt(o), e[0] = n * o, e[1] = r * o, e[2] = i * o, e[3] = a * o), e;
							}
							function M(e, t) {
								return e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3];
							}
							function N(e, t, n, r) {
								var i = t[0], a = t[1], o = t[2], s = t[3];
								return e[0] = i + r * (n[0] - i), e[1] = a + r * (n[1] - a), e[2] = o + r * (n[2] - o), e[3] = s + r * (n[3] - s), e;
							}
							function F(e, t) {
								return t ||= 1, e[0] = r.RANDOM(), e[1] = r.RANDOM(), e[2] = r.RANDOM(), e[3] = r.RANDOM(), j(e, e), y(e, e, t), e;
							}
							function I(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3];
								return e[0] = n[0] * r + n[4] * i + n[8] * a + n[12] * o, e[1] = n[1] * r + n[5] * i + n[9] * a + n[13] * o, e[2] = n[2] * r + n[6] * i + n[10] * a + n[14] * o, e[3] = n[3] * r + n[7] * i + n[11] * a + n[15] * o, e;
							}
							function L(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = n[0], s = n[1], c = n[2], l = n[3], u = l * r + s * a - c * i, d = l * i + c * r - o * a, f = l * a + o * i - s * r, p = -o * r - s * i - c * a;
								return e[0] = u * l + p * -o + d * -c - f * -s, e[1] = d * l + p * -s + f * -o - u * -c, e[2] = f * l + p * -c + u * -s - d * -o, e[3] = t[3], e;
							}
							function R(e) {
								return "vec4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
							}
							function H(e, t) {
								return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3];
							}
							function G(e, t) {
								var n = e[0], i = e[1], a = e[2], o = e[3], s = t[0], c = t[1], l = t[2], u = t[3];
								return Math.abs(n - s) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(s)) && Math.abs(i - c) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(c)) && Math.abs(a - l) <= r.EPSILON * Math.max(1, Math.abs(a), Math.abs(l)) && Math.abs(o - u) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(u));
							}
							t.sub = d, t.mul = f, t.div = p, t.dist = x, t.sqrDist = S, t.len = w, t.sqrLen = E, t.forEach = function() {
								var e = a();
								return function(t, n, r, i, a, o) {
									var s = void 0, c = void 0;
									for (n ||= 4, r ||= 0, c = i ? Math.min(i * n + r, t.length) : t.length, s = r; s < c; s += n) e[0] = t[s], e[1] = t[s + 1], e[2] = t[s + 2], e[3] = t[s + 3], a(e, e, o), t[s] = e[0], t[s + 1] = e[1], t[s + 2] = e[2], t[s + 3] = e[3];
									return t;
								};
							}();
						},
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.vec4 = t.vec3 = t.vec2 = t.quat = t.mat4 = t.mat3 = t.mat2d = t.mat2 = t.glMatrix = void 0;
							var r = f(n(0)), i = f(n(5)), a = f(n(6)), o = f(n(1)), s = f(n(7)), c = f(n(8)), l = f(n(9)), u = f(n(2)), d = f(n(3));
							function f(e) {
								if (e && e.__esModule) return e;
								var t = {};
								if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
								return t.default = e, t;
							}
							t.glMatrix = r, t.mat2 = i, t.mat2d = a, t.mat3 = o, t.mat4 = s, t.quat = c, t.vec2 = l, t.vec3 = u, t.vec4 = d;
						},
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.sub = t.mul = void 0, t.create = a, t.clone = o, t.copy = s, t.identity = c, t.fromValues = l, t.set = u, t.transpose = d, t.invert = f, t.adjoint = p, t.determinant = m, t.multiply = h, t.rotate = g, t.scale = _, t.fromRotation = v, t.fromScaling = y, t.str = b, t.frob = x, t.LDU = S, t.add = w, t.subtract = E, t.exactEquals = D, t.equals = O, t.multiplyScalar = j, t.multiplyScalarAndAdd = M;
							var r = i(n(0));
							function i(e) {
								if (e && e.__esModule) return e;
								var t = {};
								if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
								return t.default = e, t;
							}
							function a() {
								var e = new r.ARRAY_TYPE(4);
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e;
							}
							function o(e) {
								var t = new r.ARRAY_TYPE(4);
								return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;
							}
							function s(e, t) {
								return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
							}
							function c(e) {
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e;
							}
							function l(e, t, n, i) {
								var a = new r.ARRAY_TYPE(4);
								return a[0] = e, a[1] = t, a[2] = n, a[3] = i, a;
							}
							function u(e, t, n, r, i) {
								return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e;
							}
							function d(e, t) {
								if (e === t) {
									var n = t[1];
									e[1] = t[2], e[2] = n;
								} else e[0] = t[0], e[1] = t[2], e[2] = t[1], e[3] = t[3];
								return e;
							}
							function f(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = n * a - i * r;
								return o ? (o = 1 / o, e[0] = a * o, e[1] = -r * o, e[2] = -i * o, e[3] = n * o, e) : null;
							}
							function p(e, t) {
								var n = t[0];
								return e[0] = t[3], e[1] = -t[1], e[2] = -t[2], e[3] = n, e;
							}
							function m(e) {
								return e[0] * e[3] - e[2] * e[1];
							}
							function h(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = n[0], c = n[1], l = n[2], u = n[3];
								return e[0] = r * s + a * c, e[1] = i * s + o * c, e[2] = r * l + a * u, e[3] = i * l + o * u, e;
							}
							function g(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = Math.sin(n), c = Math.cos(n);
								return e[0] = r * c + a * s, e[1] = i * c + o * s, e[2] = r * -s + a * c, e[3] = i * -s + o * c, e;
							}
							function _(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = n[0], c = n[1];
								return e[0] = r * s, e[1] = i * s, e[2] = a * c, e[3] = o * c, e;
							}
							function v(e, t) {
								var n = Math.sin(t), r = Math.cos(t);
								return e[0] = r, e[1] = n, e[2] = -n, e[3] = r, e;
							}
							function y(e, t) {
								return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = t[1], e;
							}
							function b(e) {
								return "mat2(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
							}
							function x(e) {
								return Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2 + e[3] ** 2);
							}
							function S(e, t, n, r) {
								return e[2] = r[2] / r[0], n[0] = r[0], n[1] = r[1], n[3] = r[3] - e[2] * n[1], [
									e,
									t,
									n
								];
							}
							function w(e, t, n) {
								return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], e;
							}
							function E(e, t, n) {
								return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], e;
							}
							function D(e, t) {
								return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3];
							}
							function O(e, t) {
								var n = e[0], i = e[1], a = e[2], o = e[3], s = t[0], c = t[1], l = t[2], u = t[3];
								return Math.abs(n - s) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(s)) && Math.abs(i - c) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(c)) && Math.abs(a - l) <= r.EPSILON * Math.max(1, Math.abs(a), Math.abs(l)) && Math.abs(o - u) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(u));
							}
							function j(e, t, n) {
								return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e;
							}
							function M(e, t, n, r) {
								return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, e;
							}
							t.mul = h, t.sub = E;
						},
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.sub = t.mul = void 0, t.create = a, t.clone = o, t.copy = s, t.identity = c, t.fromValues = l, t.set = u, t.invert = d, t.determinant = f, t.multiply = p, t.rotate = m, t.scale = h, t.translate = g, t.fromRotation = _, t.fromScaling = v, t.fromTranslation = y, t.str = b, t.frob = x, t.add = S, t.subtract = w, t.multiplyScalar = E, t.multiplyScalarAndAdd = D, t.exactEquals = O, t.equals = j;
							var r = i(n(0));
							function i(e) {
								if (e && e.__esModule) return e;
								var t = {};
								if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
								return t.default = e, t;
							}
							function a() {
								var e = new r.ARRAY_TYPE(6);
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e;
							}
							function o(e) {
								var t = new r.ARRAY_TYPE(6);
								return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t;
							}
							function s(e, t) {
								return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e;
							}
							function c(e) {
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e;
							}
							function l(e, t, n, i, a, o) {
								var s = new r.ARRAY_TYPE(6);
								return s[0] = e, s[1] = t, s[2] = n, s[3] = i, s[4] = a, s[5] = o, s;
							}
							function u(e, t, n, r, i, a, o) {
								return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e[4] = a, e[5] = o, e;
							}
							function d(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], c = n * a - r * i;
								return c ? (c = 1 / c, e[0] = a * c, e[1] = -r * c, e[2] = -i * c, e[3] = n * c, e[4] = (i * s - a * o) * c, e[5] = (r * o - n * s) * c, e) : null;
							}
							function f(e) {
								return e[0] * e[3] - e[1] * e[2];
							}
							function p(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = n[0], u = n[1], d = n[2], f = n[3], p = n[4], m = n[5];
								return e[0] = r * l + a * u, e[1] = i * l + o * u, e[2] = r * d + a * f, e[3] = i * d + o * f, e[4] = r * p + a * m + s, e[5] = i * p + o * m + c, e;
							}
							function m(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = Math.sin(n), u = Math.cos(n);
								return e[0] = r * u + a * l, e[1] = i * u + o * l, e[2] = r * -l + a * u, e[3] = i * -l + o * u, e[4] = s, e[5] = c, e;
							}
							function h(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = n[0], u = n[1];
								return e[0] = r * l, e[1] = i * l, e[2] = a * u, e[3] = o * u, e[4] = s, e[5] = c, e;
							}
							function g(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = n[0], u = n[1];
								return e[0] = r, e[1] = i, e[2] = a, e[3] = o, e[4] = r * l + a * u + s, e[5] = i * l + o * u + c, e;
							}
							function _(e, t) {
								var n = Math.sin(t), r = Math.cos(t);
								return e[0] = r, e[1] = n, e[2] = -n, e[3] = r, e[4] = 0, e[5] = 0, e;
							}
							function v(e, t) {
								return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = t[1], e[4] = 0, e[5] = 0, e;
							}
							function y(e, t) {
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = t[0], e[5] = t[1], e;
							}
							function b(e) {
								return "mat2d(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ")";
							}
							function x(e) {
								return Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2 + e[3] ** 2 + e[4] ** 2 + e[5] ** 2 + 1);
							}
							function S(e, t, n) {
								return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], e[4] = t[4] + n[4], e[5] = t[5] + n[5], e;
							}
							function w(e, t, n) {
								return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], e[4] = t[4] - n[4], e[5] = t[5] - n[5], e;
							}
							function E(e, t, n) {
								return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * n, e[5] = t[5] * n, e;
							}
							function D(e, t, n, r) {
								return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, e[4] = t[4] + n[4] * r, e[5] = t[5] + n[5] * r, e;
							}
							function O(e, t) {
								return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5];
							}
							function j(e, t) {
								var n = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = t[0], u = t[1], d = t[2], f = t[3], p = t[4], m = t[5];
								return Math.abs(n - l) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(l)) && Math.abs(i - u) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(u)) && Math.abs(a - d) <= r.EPSILON * Math.max(1, Math.abs(a), Math.abs(d)) && Math.abs(o - f) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(f)) && Math.abs(s - p) <= r.EPSILON * Math.max(1, Math.abs(s), Math.abs(p)) && Math.abs(c - m) <= r.EPSILON * Math.max(1, Math.abs(c), Math.abs(m));
							}
							t.mul = p, t.sub = w;
						},
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.sub = t.mul = void 0, t.create = a, t.clone = o, t.copy = s, t.fromValues = c, t.set = l, t.identity = u, t.transpose = d, t.invert = f, t.adjoint = p, t.determinant = m, t.multiply = h, t.translate = g, t.scale = _, t.rotate = v, t.rotateX = y, t.rotateY = b, t.rotateZ = x, t.fromTranslation = S, t.fromScaling = w, t.fromRotation = E, t.fromXRotation = D, t.fromYRotation = O, t.fromZRotation = j, t.fromRotationTranslation = M, t.getTranslation = N, t.getScaling = F, t.getRotation = I, t.fromRotationTranslationScale = L, t.fromRotationTranslationScaleOrigin = R, t.fromQuat = H, t.frustum = G, t.perspective = K, t.perspectiveFromFieldOfView = q, t.ortho = J, t.lookAt = ee, t.targetTo = Y, t.str = te, t.frob = X, t.add = Z, t.subtract = ne, t.multiplyScalar = Q, t.multiplyScalarAndAdd = re, t.exactEquals = ie, t.equals = ae;
							var r = i(n(0));
							function i(e) {
								if (e && e.__esModule) return e;
								var t = {};
								if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
								return t.default = e, t;
							}
							function a() {
								var e = new r.ARRAY_TYPE(16);
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
							}
							function o(e) {
								var t = new r.ARRAY_TYPE(16);
								return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t;
							}
							function s(e, t) {
								return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e;
							}
							function c(e, t, n, i, a, o, s, c, l, u, d, f, p, m, h, g) {
								var _ = new r.ARRAY_TYPE(16);
								return _[0] = e, _[1] = t, _[2] = n, _[3] = i, _[4] = a, _[5] = o, _[6] = s, _[7] = c, _[8] = l, _[9] = u, _[10] = d, _[11] = f, _[12] = p, _[13] = m, _[14] = h, _[15] = g, _;
							}
							function l(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g) {
								return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e[4] = a, e[5] = o, e[6] = s, e[7] = c, e[8] = l, e[9] = u, e[10] = d, e[11] = f, e[12] = p, e[13] = m, e[14] = h, e[15] = g, e;
							}
							function u(e) {
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
							}
							function d(e, t) {
								if (e === t) {
									var n = t[1], r = t[2], i = t[3], a = t[6], o = t[7], s = t[11];
									e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = n, e[6] = t[9], e[7] = t[13], e[8] = r, e[9] = a, e[11] = t[14], e[12] = i, e[13] = o, e[14] = s;
								} else e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = t[1], e[5] = t[5], e[6] = t[9], e[7] = t[13], e[8] = t[2], e[9] = t[6], e[10] = t[10], e[11] = t[14], e[12] = t[3], e[13] = t[7], e[14] = t[11], e[15] = t[15];
								return e;
							}
							function f(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], c = t[6], l = t[7], u = t[8], d = t[9], f = t[10], p = t[11], m = t[12], h = t[13], g = t[14], _ = t[15], v = n * s - r * o, y = n * c - i * o, b = n * l - a * o, x = r * c - i * s, S = r * l - a * s, w = i * l - a * c, E = u * h - d * m, D = u * g - f * m, O = u * _ - p * m, j = d * g - f * h, M = d * _ - p * h, N = f * _ - p * g, F = v * N - y * M + b * j + x * O - S * D + w * E;
								return F ? (F = 1 / F, e[0] = (s * N - c * M + l * j) * F, e[1] = (i * M - r * N - a * j) * F, e[2] = (h * w - g * S + _ * x) * F, e[3] = (f * S - d * w - p * x) * F, e[4] = (c * O - o * N - l * D) * F, e[5] = (n * N - i * O + a * D) * F, e[6] = (g * b - m * w - _ * y) * F, e[7] = (u * w - f * b + p * y) * F, e[8] = (o * M - s * O + l * E) * F, e[9] = (r * O - n * M - a * E) * F, e[10] = (m * S - h * b + _ * v) * F, e[11] = (d * b - u * S - p * v) * F, e[12] = (s * D - o * j - c * E) * F, e[13] = (n * j - r * D + i * E) * F, e[14] = (h * y - m * x - g * v) * F, e[15] = (u * x - d * y + f * v) * F, e) : null;
							}
							function p(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], c = t[6], l = t[7], u = t[8], d = t[9], f = t[10], p = t[11], m = t[12], h = t[13], g = t[14], _ = t[15];
								return e[0] = s * (f * _ - p * g) - d * (c * _ - l * g) + h * (c * p - l * f), e[1] = -(r * (f * _ - p * g) - d * (i * _ - a * g) + h * (i * p - a * f)), e[2] = r * (c * _ - l * g) - s * (i * _ - a * g) + h * (i * l - a * c), e[3] = -(r * (c * p - l * f) - s * (i * p - a * f) + d * (i * l - a * c)), e[4] = -(o * (f * _ - p * g) - u * (c * _ - l * g) + m * (c * p - l * f)), e[5] = n * (f * _ - p * g) - u * (i * _ - a * g) + m * (i * p - a * f), e[6] = -(n * (c * _ - l * g) - o * (i * _ - a * g) + m * (i * l - a * c)), e[7] = n * (c * p - l * f) - o * (i * p - a * f) + u * (i * l - a * c), e[8] = o * (d * _ - p * h) - u * (s * _ - l * h) + m * (s * p - l * d), e[9] = -(n * (d * _ - p * h) - u * (r * _ - a * h) + m * (r * p - a * d)), e[10] = n * (s * _ - l * h) - o * (r * _ - a * h) + m * (r * l - a * s), e[11] = -(n * (s * p - l * d) - o * (r * p - a * d) + u * (r * l - a * s)), e[12] = -(o * (d * g - f * h) - u * (s * g - c * h) + m * (s * f - c * d)), e[13] = n * (d * g - f * h) - u * (r * g - i * h) + m * (r * f - i * d), e[14] = -(n * (s * g - c * h) - o * (r * g - i * h) + m * (r * c - i * s)), e[15] = n * (s * f - c * d) - o * (r * f - i * d) + u * (r * c - i * s), e;
							}
							function m(e) {
								var t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8], u = e[9], d = e[10], f = e[11], p = e[12], m = e[13], h = e[14], g = e[15], _ = t * o - n * a, v = t * s - r * a, y = t * c - i * a, b = n * s - r * o, x = n * c - i * o, S = r * c - i * s, w = l * m - u * p, E = l * h - d * p, D = l * g - f * p, O = u * h - d * m, j = u * g - f * m;
								return _ * (d * g - f * h) - v * j + y * O + b * D - x * E + S * w;
							}
							function h(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = t[6], u = t[7], d = t[8], f = t[9], p = t[10], m = t[11], h = t[12], g = t[13], _ = t[14], v = t[15], y = n[0], b = n[1], x = n[2], S = n[3];
								return e[0] = y * r + b * s + x * d + S * h, e[1] = y * i + b * c + x * f + S * g, e[2] = y * a + b * l + x * p + S * _, e[3] = y * o + b * u + x * m + S * v, y = n[4], b = n[5], x = n[6], S = n[7], e[4] = y * r + b * s + x * d + S * h, e[5] = y * i + b * c + x * f + S * g, e[6] = y * a + b * l + x * p + S * _, e[7] = y * o + b * u + x * m + S * v, y = n[8], b = n[9], x = n[10], S = n[11], e[8] = y * r + b * s + x * d + S * h, e[9] = y * i + b * c + x * f + S * g, e[10] = y * a + b * l + x * p + S * _, e[11] = y * o + b * u + x * m + S * v, y = n[12], b = n[13], x = n[14], S = n[15], e[12] = y * r + b * s + x * d + S * h, e[13] = y * i + b * c + x * f + S * g, e[14] = y * a + b * l + x * p + S * _, e[15] = y * o + b * u + x * m + S * v, e;
							}
							function g(e, t, n) {
								var r = n[0], i = n[1], a = n[2], o = void 0, s = void 0, c = void 0, l = void 0, u = void 0, d = void 0, f = void 0, p = void 0, m = void 0, h = void 0, g = void 0, _ = void 0;
								return t === e ? (e[12] = t[0] * r + t[4] * i + t[8] * a + t[12], e[13] = t[1] * r + t[5] * i + t[9] * a + t[13], e[14] = t[2] * r + t[6] * i + t[10] * a + t[14], e[15] = t[3] * r + t[7] * i + t[11] * a + t[15]) : (o = t[0], s = t[1], c = t[2], l = t[3], u = t[4], d = t[5], f = t[6], p = t[7], m = t[8], h = t[9], g = t[10], _ = t[11], e[0] = o, e[1] = s, e[2] = c, e[3] = l, e[4] = u, e[5] = d, e[6] = f, e[7] = p, e[8] = m, e[9] = h, e[10] = g, e[11] = _, e[12] = o * r + u * i + m * a + t[12], e[13] = s * r + d * i + h * a + t[13], e[14] = c * r + f * i + g * a + t[14], e[15] = l * r + p * i + _ * a + t[15]), e;
							}
							function _(e, t, n) {
								var r = n[0], i = n[1], a = n[2];
								return e[0] = t[0] * r, e[1] = t[1] * r, e[2] = t[2] * r, e[3] = t[3] * r, e[4] = t[4] * i, e[5] = t[5] * i, e[6] = t[6] * i, e[7] = t[7] * i, e[8] = t[8] * a, e[9] = t[9] * a, e[10] = t[10] * a, e[11] = t[11] * a, e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e;
							}
							function v(e, t, n, i) {
								var a = i[0], o = i[1], s = i[2], c = Math.sqrt(a * a + o * o + s * s), l = void 0, u = void 0, d = void 0, f = void 0, p = void 0, m = void 0, h = void 0, g = void 0, _ = void 0, v = void 0, y = void 0, b = void 0, x = void 0, S = void 0, w = void 0, E = void 0, D = void 0, O = void 0, j = void 0, M = void 0, N = void 0, F = void 0, I = void 0, L = void 0;
								return Math.abs(c) < r.EPSILON ? null : (c = 1 / c, a *= c, o *= c, s *= c, l = Math.sin(n), u = Math.cos(n), d = 1 - u, f = t[0], p = t[1], m = t[2], h = t[3], g = t[4], _ = t[5], v = t[6], y = t[7], b = t[8], x = t[9], S = t[10], w = t[11], E = a * a * d + u, D = o * a * d + s * l, O = s * a * d - o * l, j = a * o * d - s * l, M = o * o * d + u, N = s * o * d + a * l, F = a * s * d + o * l, I = o * s * d - a * l, L = s * s * d + u, e[0] = f * E + g * D + b * O, e[1] = p * E + _ * D + x * O, e[2] = m * E + v * D + S * O, e[3] = h * E + y * D + w * O, e[4] = f * j + g * M + b * N, e[5] = p * j + _ * M + x * N, e[6] = m * j + v * M + S * N, e[7] = h * j + y * M + w * N, e[8] = f * F + g * I + b * L, e[9] = p * F + _ * I + x * L, e[10] = m * F + v * I + S * L, e[11] = h * F + y * I + w * L, t !== e && (e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e);
							}
							function y(e, t, n) {
								var r = Math.sin(n), i = Math.cos(n), a = t[4], o = t[5], s = t[6], c = t[7], l = t[8], u = t[9], d = t[10], f = t[11];
								return t !== e && (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[4] = a * i + l * r, e[5] = o * i + u * r, e[6] = s * i + d * r, e[7] = c * i + f * r, e[8] = l * i - a * r, e[9] = u * i - o * r, e[10] = d * i - s * r, e[11] = f * i - c * r, e;
							}
							function b(e, t, n) {
								var r = Math.sin(n), i = Math.cos(n), a = t[0], o = t[1], s = t[2], c = t[3], l = t[8], u = t[9], d = t[10], f = t[11];
								return t !== e && (e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * i - l * r, e[1] = o * i - u * r, e[2] = s * i - d * r, e[3] = c * i - f * r, e[8] = a * r + l * i, e[9] = o * r + u * i, e[10] = s * r + d * i, e[11] = c * r + f * i, e;
							}
							function x(e, t, n) {
								var r = Math.sin(n), i = Math.cos(n), a = t[0], o = t[1], s = t[2], c = t[3], l = t[4], u = t[5], d = t[6], f = t[7];
								return t !== e && (e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * i + l * r, e[1] = o * i + u * r, e[2] = s * i + d * r, e[3] = c * i + f * r, e[4] = l * i - a * r, e[5] = u * i - o * r, e[6] = d * i - s * r, e[7] = f * i - c * r, e;
							}
							function S(e, t) {
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = t[0], e[13] = t[1], e[14] = t[2], e[15] = 1, e;
							}
							function w(e, t) {
								return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = t[1], e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = t[2], e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
							}
							function E(e, t, n) {
								var i = n[0], a = n[1], o = n[2], s = Math.sqrt(i * i + a * a + o * o), c = void 0, l = void 0, u = void 0;
								return Math.abs(s) < r.EPSILON ? null : (s = 1 / s, i *= s, a *= s, o *= s, c = Math.sin(t), l = Math.cos(t), u = 1 - l, e[0] = i * i * u + l, e[1] = a * i * u + o * c, e[2] = o * i * u - a * c, e[3] = 0, e[4] = i * a * u - o * c, e[5] = a * a * u + l, e[6] = o * a * u + i * c, e[7] = 0, e[8] = i * o * u + a * c, e[9] = a * o * u - i * c, e[10] = o * o * u + l, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e);
							}
							function D(e, t) {
								var n = Math.sin(t), r = Math.cos(t);
								return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = r, e[6] = n, e[7] = 0, e[8] = 0, e[9] = -n, e[10] = r, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
							}
							function O(e, t) {
								var n = Math.sin(t), r = Math.cos(t);
								return e[0] = r, e[1] = 0, e[2] = -n, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = n, e[9] = 0, e[10] = r, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
							}
							function j(e, t) {
								var n = Math.sin(t), r = Math.cos(t);
								return e[0] = r, e[1] = n, e[2] = 0, e[3] = 0, e[4] = -n, e[5] = r, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
							}
							function M(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = r + r, c = i + i, l = a + a, u = r * s, d = r * c, f = r * l, p = i * c, m = i * l, h = a * l, g = o * s, _ = o * c, v = o * l;
								return e[0] = 1 - (p + h), e[1] = d + v, e[2] = f - _, e[3] = 0, e[4] = d - v, e[5] = 1 - (u + h), e[6] = m + g, e[7] = 0, e[8] = f + _, e[9] = m - g, e[10] = 1 - (u + p), e[11] = 0, e[12] = n[0], e[13] = n[1], e[14] = n[2], e[15] = 1, e;
							}
							function N(e, t) {
								return e[0] = t[12], e[1] = t[13], e[2] = t[14], e;
							}
							function F(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[4], o = t[5], s = t[6], c = t[8], l = t[9], u = t[10];
								return e[0] = Math.sqrt(n * n + r * r + i * i), e[1] = Math.sqrt(a * a + o * o + s * s), e[2] = Math.sqrt(c * c + l * l + u * u), e;
							}
							function I(e, t) {
								var n = t[0] + t[5] + t[10], r = 0;
								return n > 0 ? (r = Math.sqrt(n + 1) * 2, e[3] = .25 * r, e[0] = (t[6] - t[9]) / r, e[1] = (t[8] - t[2]) / r, e[2] = (t[1] - t[4]) / r) : t[0] > t[5] & t[0] > t[10] ? (r = Math.sqrt(1 + t[0] - t[5] - t[10]) * 2, e[3] = (t[6] - t[9]) / r, e[0] = .25 * r, e[1] = (t[1] + t[4]) / r, e[2] = (t[8] + t[2]) / r) : t[5] > t[10] ? (r = Math.sqrt(1 + t[5] - t[0] - t[10]) * 2, e[3] = (t[8] - t[2]) / r, e[0] = (t[1] + t[4]) / r, e[1] = .25 * r, e[2] = (t[6] + t[9]) / r) : (r = Math.sqrt(1 + t[10] - t[0] - t[5]) * 2, e[3] = (t[1] - t[4]) / r, e[0] = (t[8] + t[2]) / r, e[1] = (t[6] + t[9]) / r, e[2] = .25 * r), e;
							}
							function L(e, t, n, r) {
								var i = t[0], a = t[1], o = t[2], s = t[3], c = i + i, l = a + a, u = o + o, d = i * c, f = i * l, p = i * u, m = a * l, h = a * u, g = o * u, _ = s * c, v = s * l, y = s * u, b = r[0], x = r[1], S = r[2];
								return e[0] = (1 - (m + g)) * b, e[1] = (f + y) * b, e[2] = (p - v) * b, e[3] = 0, e[4] = (f - y) * x, e[5] = (1 - (d + g)) * x, e[6] = (h + _) * x, e[7] = 0, e[8] = (p + v) * S, e[9] = (h - _) * S, e[10] = (1 - (d + m)) * S, e[11] = 0, e[12] = n[0], e[13] = n[1], e[14] = n[2], e[15] = 1, e;
							}
							function R(e, t, n, r, i) {
								var a = t[0], o = t[1], s = t[2], c = t[3], l = a + a, u = o + o, d = s + s, f = a * l, p = a * u, m = a * d, h = o * u, g = o * d, _ = s * d, v = c * l, y = c * u, b = c * d, x = r[0], S = r[1], w = r[2], E = i[0], D = i[1], O = i[2];
								return e[0] = (1 - (h + _)) * x, e[1] = (p + b) * x, e[2] = (m - y) * x, e[3] = 0, e[4] = (p - b) * S, e[5] = (1 - (f + _)) * S, e[6] = (g + v) * S, e[7] = 0, e[8] = (m + y) * w, e[9] = (g - v) * w, e[10] = (1 - (f + h)) * w, e[11] = 0, e[12] = n[0] + E - (e[0] * E + e[4] * D + e[8] * O), e[13] = n[1] + D - (e[1] * E + e[5] * D + e[9] * O), e[14] = n[2] + O - (e[2] * E + e[6] * D + e[10] * O), e[15] = 1, e;
							}
							function H(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = n + n, s = r + r, c = i + i, l = n * o, u = r * o, d = r * s, f = i * o, p = i * s, m = i * c, h = a * o, g = a * s, _ = a * c;
								return e[0] = 1 - d - m, e[1] = u + _, e[2] = f - g, e[3] = 0, e[4] = u - _, e[5] = 1 - l - m, e[6] = p + h, e[7] = 0, e[8] = f + g, e[9] = p - h, e[10] = 1 - l - d, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
							}
							function G(e, t, n, r, i, a, o) {
								var s = 1 / (n - t), c = 1 / (i - r), l = 1 / (a - o);
								return e[0] = a * 2 * s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = a * 2 * c, e[6] = 0, e[7] = 0, e[8] = (n + t) * s, e[9] = (i + r) * c, e[10] = (o + a) * l, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = o * a * 2 * l, e[15] = 0, e;
							}
							function K(e, t, n, r, i) {
								var a = 1 / Math.tan(t / 2), o = 1 / (r - i);
								return e[0] = a / n, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = a, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = (i + r) * o, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = 2 * i * r * o, e[15] = 0, e;
							}
							function q(e, t, n, r) {
								var i = Math.tan(t.upDegrees * Math.PI / 180), a = Math.tan(t.downDegrees * Math.PI / 180), o = Math.tan(t.leftDegrees * Math.PI / 180), s = Math.tan(t.rightDegrees * Math.PI / 180), c = 2 / (o + s), l = 2 / (i + a);
								return e[0] = c, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = l, e[6] = 0, e[7] = 0, e[8] = -((o - s) * c * .5), e[9] = (i - a) * l * .5, e[10] = r / (n - r), e[11] = -1, e[12] = 0, e[13] = 0, e[14] = r * n / (n - r), e[15] = 0, e;
							}
							function J(e, t, n, r, i, a, o) {
								var s = 1 / (t - n), c = 1 / (r - i), l = 1 / (a - o);
								return e[0] = -2 * s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * c, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * l, e[11] = 0, e[12] = (t + n) * s, e[13] = (i + r) * c, e[14] = (o + a) * l, e[15] = 1, e;
							}
							function ee(e, t, n, i) {
								var a = void 0, o = void 0, s = void 0, c = void 0, l = void 0, u = void 0, d = void 0, f = void 0, p = void 0, m = void 0, h = t[0], g = t[1], _ = t[2], v = i[0], y = i[1], b = i[2], x = n[0], S = n[1], w = n[2];
								return Math.abs(h - x) < r.EPSILON && Math.abs(g - S) < r.EPSILON && Math.abs(_ - w) < r.EPSILON ? mat4.identity(e) : (d = h - x, f = g - S, p = _ - w, m = 1 / Math.sqrt(d * d + f * f + p * p), d *= m, f *= m, p *= m, a = y * p - b * f, o = b * d - v * p, s = v * f - y * d, m = Math.sqrt(a * a + o * o + s * s), m ? (m = 1 / m, a *= m, o *= m, s *= m) : (a = 0, o = 0, s = 0), c = f * s - p * o, l = p * a - d * s, u = d * o - f * a, m = Math.sqrt(c * c + l * l + u * u), m ? (m = 1 / m, c *= m, l *= m, u *= m) : (c = 0, l = 0, u = 0), e[0] = a, e[1] = c, e[2] = d, e[3] = 0, e[4] = o, e[5] = l, e[6] = f, e[7] = 0, e[8] = s, e[9] = u, e[10] = p, e[11] = 0, e[12] = -(a * h + o * g + s * _), e[13] = -(c * h + l * g + u * _), e[14] = -(d * h + f * g + p * _), e[15] = 1, e);
							}
							function Y(e, t, n, r) {
								var i = t[0], a = t[1], o = t[2], s = r[0], c = r[1], l = r[2], u = i - n[0], d = a - n[1], f = o - n[2], p = u * u + d * d + f * f;
								p > 0 && (p = 1 / Math.sqrt(p), u *= p, d *= p, f *= p);
								var m = c * f - l * d, h = l * u - s * f, g = s * d - c * u;
								return e[0] = m, e[1] = h, e[2] = g, e[3] = 0, e[4] = d * g - f * h, e[5] = f * m - u * g, e[6] = u * h - d * m, e[7] = 0, e[8] = u, e[9] = d, e[10] = f, e[11] = 0, e[12] = i, e[13] = a, e[14] = o, e[15] = 1, e;
							}
							function te(e) {
								return "mat4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ", " + e[9] + ", " + e[10] + ", " + e[11] + ", " + e[12] + ", " + e[13] + ", " + e[14] + ", " + e[15] + ")";
							}
							function X(e) {
								return Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2 + e[3] ** 2 + e[4] ** 2 + e[5] ** 2 + e[6] ** 2 + e[7] ** 2 + e[8] ** 2 + e[9] ** 2 + e[10] ** 2 + e[11] ** 2 + e[12] ** 2 + e[13] ** 2 + e[14] ** 2 + e[15] ** 2);
							}
							function Z(e, t, n) {
								return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], e[4] = t[4] + n[4], e[5] = t[5] + n[5], e[6] = t[6] + n[6], e[7] = t[7] + n[7], e[8] = t[8] + n[8], e[9] = t[9] + n[9], e[10] = t[10] + n[10], e[11] = t[11] + n[11], e[12] = t[12] + n[12], e[13] = t[13] + n[13], e[14] = t[14] + n[14], e[15] = t[15] + n[15], e;
							}
							function ne(e, t, n) {
								return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e[3] = t[3] - n[3], e[4] = t[4] - n[4], e[5] = t[5] - n[5], e[6] = t[6] - n[6], e[7] = t[7] - n[7], e[8] = t[8] - n[8], e[9] = t[9] - n[9], e[10] = t[10] - n[10], e[11] = t[11] - n[11], e[12] = t[12] - n[12], e[13] = t[13] - n[13], e[14] = t[14] - n[14], e[15] = t[15] - n[15], e;
							}
							function Q(e, t, n) {
								return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * n, e[5] = t[5] * n, e[6] = t[6] * n, e[7] = t[7] * n, e[8] = t[8] * n, e[9] = t[9] * n, e[10] = t[10] * n, e[11] = t[11] * n, e[12] = t[12] * n, e[13] = t[13] * n, e[14] = t[14] * n, e[15] = t[15] * n, e;
							}
							function re(e, t, n, r) {
								return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e[2] = t[2] + n[2] * r, e[3] = t[3] + n[3] * r, e[4] = t[4] + n[4] * r, e[5] = t[5] + n[5] * r, e[6] = t[6] + n[6] * r, e[7] = t[7] + n[7] * r, e[8] = t[8] + n[8] * r, e[9] = t[9] + n[9] * r, e[10] = t[10] + n[10] * r, e[11] = t[11] + n[11] * r, e[12] = t[12] + n[12] * r, e[13] = t[13] + n[13] * r, e[14] = t[14] + n[14] * r, e[15] = t[15] + n[15] * r, e;
							}
							function ie(e, t) {
								return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8] && e[9] === t[9] && e[10] === t[10] && e[11] === t[11] && e[12] === t[12] && e[13] === t[13] && e[14] === t[14] && e[15] === t[15];
							}
							function ae(e, t) {
								var n = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7], d = e[8], f = e[9], p = e[10], m = e[11], h = e[12], g = e[13], _ = e[14], v = e[15], y = t[0], b = t[1], x = t[2], S = t[3], w = t[4], E = t[5], D = t[6], O = t[7], j = t[8], M = t[9], N = t[10], F = t[11], I = t[12], L = t[13], R = t[14], H = t[15];
								return Math.abs(n - y) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(y)) && Math.abs(i - b) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(b)) && Math.abs(a - x) <= r.EPSILON * Math.max(1, Math.abs(a), Math.abs(x)) && Math.abs(o - S) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(S)) && Math.abs(s - w) <= r.EPSILON * Math.max(1, Math.abs(s), Math.abs(w)) && Math.abs(c - E) <= r.EPSILON * Math.max(1, Math.abs(c), Math.abs(E)) && Math.abs(l - D) <= r.EPSILON * Math.max(1, Math.abs(l), Math.abs(D)) && Math.abs(u - O) <= r.EPSILON * Math.max(1, Math.abs(u), Math.abs(O)) && Math.abs(d - j) <= r.EPSILON * Math.max(1, Math.abs(d), Math.abs(j)) && Math.abs(f - M) <= r.EPSILON * Math.max(1, Math.abs(f), Math.abs(M)) && Math.abs(p - N) <= r.EPSILON * Math.max(1, Math.abs(p), Math.abs(N)) && Math.abs(m - F) <= r.EPSILON * Math.max(1, Math.abs(m), Math.abs(F)) && Math.abs(h - I) <= r.EPSILON * Math.max(1, Math.abs(h), Math.abs(I)) && Math.abs(g - L) <= r.EPSILON * Math.max(1, Math.abs(g), Math.abs(L)) && Math.abs(_ - R) <= r.EPSILON * Math.max(1, Math.abs(_), Math.abs(R)) && Math.abs(v - H) <= r.EPSILON * Math.max(1, Math.abs(v), Math.abs(H));
							}
							t.mul = h, t.sub = ne;
						},
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.setAxes = t.sqlerp = t.rotationTo = t.equals = t.exactEquals = t.normalize = t.sqrLen = t.squaredLength = t.len = t.length = t.lerp = t.dot = t.scale = t.mul = t.add = t.set = t.copy = t.fromValues = t.clone = void 0, t.create = c, t.identity = l, t.setAxisAngle = u, t.getAxisAngle = d, t.multiply = f, t.rotateX = p, t.rotateY = m, t.rotateZ = h, t.calculateW = g, t.slerp = _, t.invert = v, t.conjugate = y, t.fromMat3 = b, t.fromEuler = x, t.str = S;
							var r = s(n(0)), i = s(n(1)), a = s(n(2)), o = s(n(3));
							function s(e) {
								if (e && e.__esModule) return e;
								var t = {};
								if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
								return t.default = e, t;
							}
							function c() {
								var e = new r.ARRAY_TYPE(4);
								return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e;
							}
							function l(e) {
								return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e;
							}
							function u(e, t, n) {
								n *= .5;
								var r = Math.sin(n);
								return e[0] = r * t[0], e[1] = r * t[1], e[2] = r * t[2], e[3] = Math.cos(n), e;
							}
							function d(e, t) {
								var n = Math.acos(t[3]) * 2, r = Math.sin(n / 2);
								return r == 0 ? (e[0] = 1, e[1] = 0, e[2] = 0) : (e[0] = t[0] / r, e[1] = t[1] / r, e[2] = t[2] / r), n;
							}
							function f(e, t, n) {
								var r = t[0], i = t[1], a = t[2], o = t[3], s = n[0], c = n[1], l = n[2], u = n[3];
								return e[0] = r * u + o * s + i * l - a * c, e[1] = i * u + o * c + a * s - r * l, e[2] = a * u + o * l + r * c - i * s, e[3] = o * u - r * s - i * c - a * l, e;
							}
							function p(e, t, n) {
								n *= .5;
								var r = t[0], i = t[1], a = t[2], o = t[3], s = Math.sin(n), c = Math.cos(n);
								return e[0] = r * c + o * s, e[1] = i * c + a * s, e[2] = a * c - i * s, e[3] = o * c - r * s, e;
							}
							function m(e, t, n) {
								n *= .5;
								var r = t[0], i = t[1], a = t[2], o = t[3], s = Math.sin(n), c = Math.cos(n);
								return e[0] = r * c - a * s, e[1] = i * c + o * s, e[2] = a * c + r * s, e[3] = o * c - i * s, e;
							}
							function h(e, t, n) {
								n *= .5;
								var r = t[0], i = t[1], a = t[2], o = t[3], s = Math.sin(n), c = Math.cos(n);
								return e[0] = r * c + i * s, e[1] = i * c - r * s, e[2] = a * c + o * s, e[3] = o * c - a * s, e;
							}
							function g(e, t) {
								var n = t[0], r = t[1], i = t[2];
								return e[0] = n, e[1] = r, e[2] = i, e[3] = Math.sqrt(Math.abs(1 - n * n - r * r - i * i)), e;
							}
							function _(e, t, n, r) {
								var i = t[0], a = t[1], o = t[2], s = t[3], c = n[0], l = n[1], u = n[2], d = n[3], f = void 0, p = void 0, m = void 0, h = void 0, g = void 0;
								return p = i * c + a * l + o * u + s * d, p < 0 && (p = -p, c = -c, l = -l, u = -u, d = -d), 1 - p > 1e-6 ? (f = Math.acos(p), m = Math.sin(f), h = Math.sin((1 - r) * f) / m, g = Math.sin(r * f) / m) : (h = 1 - r, g = r), e[0] = h * i + g * c, e[1] = h * a + g * l, e[2] = h * o + g * u, e[3] = h * s + g * d, e;
							}
							function v(e, t) {
								var n = t[0], r = t[1], i = t[2], a = t[3], o = n * n + r * r + i * i + a * a, s = o ? 1 / o : 0;
								return e[0] = -n * s, e[1] = -r * s, e[2] = -i * s, e[3] = a * s, e;
							}
							function y(e, t) {
								return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = t[3], e;
							}
							function b(e, t) {
								var n = t[0] + t[4] + t[8], r = void 0;
								if (n > 0) r = Math.sqrt(n + 1), e[3] = .5 * r, r = .5 / r, e[0] = (t[5] - t[7]) * r, e[1] = (t[6] - t[2]) * r, e[2] = (t[1] - t[3]) * r;
								else {
									var i = 0;
									t[4] > t[0] && (i = 1), t[8] > t[i * 3 + i] && (i = 2);
									var a = (i + 1) % 3, o = (i + 2) % 3;
									r = Math.sqrt(t[i * 3 + i] - t[a * 3 + a] - t[o * 3 + o] + 1), e[i] = .5 * r, r = .5 / r, e[3] = (t[a * 3 + o] - t[o * 3 + a]) * r, e[a] = (t[a * 3 + i] + t[i * 3 + a]) * r, e[o] = (t[o * 3 + i] + t[i * 3 + o]) * r;
								}
								return e;
							}
							function x(e, t, n, r) {
								var i = .5 * Math.PI / 180;
								t *= i, n *= i, r *= i;
								var a = Math.sin(t), o = Math.cos(t), s = Math.sin(n), c = Math.cos(n), l = Math.sin(r), u = Math.cos(r);
								return e[0] = a * c * u - o * s * l, e[1] = o * s * u + a * c * l, e[2] = o * c * l - a * s * u, e[3] = o * c * u + a * s * l, e;
							}
							function S(e) {
								return "quat(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
							}
							t.clone = o.clone, t.fromValues = o.fromValues, t.copy = o.copy, t.set = o.set, t.add = o.add, t.mul = f, t.scale = o.scale, t.dot = o.dot, t.lerp = o.lerp, t.len = t.length = o.length, t.sqrLen = t.squaredLength = o.squaredLength;
							var w = t.normalize = o.normalize;
							t.exactEquals = o.exactEquals, t.equals = o.equals, t.rotationTo = function() {
								var e = a.create(), t = a.fromValues(1, 0, 0), n = a.fromValues(0, 1, 0);
								return function(r, i, o) {
									var s = a.dot(i, o);
									return s < -.999999 ? (a.cross(e, t, i), a.len(e) < 1e-6 && a.cross(e, n, i), a.normalize(e, e), u(r, e, Math.PI), r) : s > .999999 ? (r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 1, r) : (a.cross(e, i, o), r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = 1 + s, w(r, r));
								};
							}(), t.sqlerp = function() {
								var e = c(), t = c();
								return function(n, r, i, a, o, s) {
									return _(e, r, o, s), _(t, i, a, s), _(n, e, t, 2 * s * (1 - s)), n;
								};
							}(), t.setAxes = function() {
								var e = i.create();
								return function(t, n, r, i) {
									return e[0] = r[0], e[3] = r[1], e[6] = r[2], e[1] = i[0], e[4] = i[1], e[7] = i[2], e[2] = -n[0], e[5] = -n[1], e[8] = -n[2], w(t, b(t, e));
								};
							}();
						},
						function(e, t, n) {
							Object.defineProperty(t, "__esModule", { value: !0 }), t.forEach = t.sqrLen = t.sqrDist = t.dist = t.div = t.mul = t.sub = t.len = void 0, t.create = a, t.clone = o, t.fromValues = s, t.copy = c, t.set = l, t.add = u, t.subtract = d, t.multiply = f, t.divide = p, t.ceil = m, t.floor = h, t.min = g, t.max = _, t.round = v, t.scale = y, t.scaleAndAdd = b, t.distance = x, t.squaredDistance = S, t.length = w, t.squaredLength = E, t.negate = D, t.inverse = O, t.normalize = j, t.dot = M, t.cross = N, t.lerp = F, t.random = I, t.transformMat2 = L, t.transformMat2d = R, t.transformMat3 = H, t.transformMat4 = G, t.str = K, t.exactEquals = q, t.equals = J;
							var r = i(n(0));
							function i(e) {
								if (e && e.__esModule) return e;
								var t = {};
								if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
								return t.default = e, t;
							}
							function a() {
								var e = new r.ARRAY_TYPE(2);
								return e[0] = 0, e[1] = 0, e;
							}
							function o(e) {
								var t = new r.ARRAY_TYPE(2);
								return t[0] = e[0], t[1] = e[1], t;
							}
							function s(e, t) {
								var n = new r.ARRAY_TYPE(2);
								return n[0] = e, n[1] = t, n;
							}
							function c(e, t) {
								return e[0] = t[0], e[1] = t[1], e;
							}
							function l(e, t, n) {
								return e[0] = t, e[1] = n, e;
							}
							function u(e, t, n) {
								return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e;
							}
							function d(e, t, n) {
								return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e;
							}
							function f(e, t, n) {
								return e[0] = t[0] * n[0], e[1] = t[1] * n[1], e;
							}
							function p(e, t, n) {
								return e[0] = t[0] / n[0], e[1] = t[1] / n[1], e;
							}
							function m(e, t) {
								return e[0] = Math.ceil(t[0]), e[1] = Math.ceil(t[1]), e;
							}
							function h(e, t) {
								return e[0] = Math.floor(t[0]), e[1] = Math.floor(t[1]), e;
							}
							function g(e, t, n) {
								return e[0] = Math.min(t[0], n[0]), e[1] = Math.min(t[1], n[1]), e;
							}
							function _(e, t, n) {
								return e[0] = Math.max(t[0], n[0]), e[1] = Math.max(t[1], n[1]), e;
							}
							function v(e, t) {
								return e[0] = Math.round(t[0]), e[1] = Math.round(t[1]), e;
							}
							function y(e, t, n) {
								return e[0] = t[0] * n, e[1] = t[1] * n, e;
							}
							function b(e, t, n, r) {
								return e[0] = t[0] + n[0] * r, e[1] = t[1] + n[1] * r, e;
							}
							function x(e, t) {
								var n = t[0] - e[0], r = t[1] - e[1];
								return Math.sqrt(n * n + r * r);
							}
							function S(e, t) {
								var n = t[0] - e[0], r = t[1] - e[1];
								return n * n + r * r;
							}
							function w(e) {
								var t = e[0], n = e[1];
								return Math.sqrt(t * t + n * n);
							}
							function E(e) {
								var t = e[0], n = e[1];
								return t * t + n * n;
							}
							function D(e, t) {
								return e[0] = -t[0], e[1] = -t[1], e;
							}
							function O(e, t) {
								return e[0] = 1 / t[0], e[1] = 1 / t[1], e;
							}
							function j(e, t) {
								var n = t[0], r = t[1], i = n * n + r * r;
								return i > 0 && (i = 1 / Math.sqrt(i), e[0] = t[0] * i, e[1] = t[1] * i), e;
							}
							function M(e, t) {
								return e[0] * t[0] + e[1] * t[1];
							}
							function N(e, t, n) {
								var r = t[0] * n[1] - t[1] * n[0];
								return e[0] = e[1] = 0, e[2] = r, e;
							}
							function F(e, t, n, r) {
								var i = t[0], a = t[1];
								return e[0] = i + r * (n[0] - i), e[1] = a + r * (n[1] - a), e;
							}
							function I(e, t) {
								t ||= 1;
								var n = r.RANDOM() * 2 * Math.PI;
								return e[0] = Math.cos(n) * t, e[1] = Math.sin(n) * t, e;
							}
							function L(e, t, n) {
								var r = t[0], i = t[1];
								return e[0] = n[0] * r + n[2] * i, e[1] = n[1] * r + n[3] * i, e;
							}
							function R(e, t, n) {
								var r = t[0], i = t[1];
								return e[0] = n[0] * r + n[2] * i + n[4], e[1] = n[1] * r + n[3] * i + n[5], e;
							}
							function H(e, t, n) {
								var r = t[0], i = t[1];
								return e[0] = n[0] * r + n[3] * i + n[6], e[1] = n[1] * r + n[4] * i + n[7], e;
							}
							function G(e, t, n) {
								var r = t[0], i = t[1];
								return e[0] = n[0] * r + n[4] * i + n[12], e[1] = n[1] * r + n[5] * i + n[13], e;
							}
							function K(e) {
								return "vec2(" + e[0] + ", " + e[1] + ")";
							}
							function q(e, t) {
								return e[0] === t[0] && e[1] === t[1];
							}
							function J(e, t) {
								var n = e[0], i = e[1], a = t[0], o = t[1];
								return Math.abs(n - a) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(a)) && Math.abs(i - o) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(o));
							}
							t.len = w, t.sub = d, t.mul = f, t.div = p, t.dist = x, t.sqrDist = S, t.sqrLen = E, t.forEach = function() {
								var e = a();
								return function(t, n, r, i, a, o) {
									var s = void 0, c = void 0;
									for (n ||= 2, r ||= 0, c = i ? Math.min(i * n + r, t.length) : t.length, s = r; s < c; s += n) e[0] = t[s], e[1] = t[s + 1], a(e, e, o), t[s] = e[0], t[s + 1] = e[1];
									return t;
								};
							}();
						}
					]);
				});
			}, {}],
			9: [function(e, t, n) {
				function r(e, t, n) {
					this.obj = e, this.left = null, this.right = null, this.parent = n, this.dimension = t;
				}
				function i(e, t, n) {
					var i = this;
					function o(e, t, i) {
						var a = t % n.length, s, c;
						return e.length === 0 ? null : e.length === 1 ? new r(e[0], a, i) : (e.sort(function(e, t) {
							return e[n[a]] - t[n[a]];
						}), s = Math.floor(e.length / 2), c = new r(e[s], a, i), c.left = o(e.slice(0, s), t + 1, c), c.right = o(e.slice(s + 1), t + 1, c), c);
					}
					this.root = o(e, 0, null), this.insert = function(e) {
						function t(r, i) {
							if (r === null) return i;
							var a = n[r.dimension];
							return e[a] < r.obj[a] ? t(r.left, r) : t(r.right, r);
						}
						var i = t(this.root, null), a, o;
						if (i === null) {
							this.root = new r(e, 0, null);
							return;
						}
						a = new r(e, (i.dimension + 1) % n.length, i), o = n[i.dimension], e[o] < i.obj[o] ? i.left = a : i.right = a;
					}, this.remove = function(e) {
						var t;
						function r(t) {
							if (t === null) return null;
							if (t.obj === e) return t;
							var i = n[t.dimension];
							return e[i] < t.obj[i] ? r(t.left) : r(t.right);
						}
						function a(e) {
							var t, r, o;
							function s(e, t) {
								var r, i, a, o, c;
								return e === null ? null : (r = n[t], e.dimension === t ? e.right === null ? e : s(e.right, t) : (i = e.obj[r], a = s(e.left, t), o = s(e.right, t), c = e, a !== null && a.obj[r] > i && (c = a), o !== null && o.obj[r] > c.obj[r] && (c = o), c));
							}
							function c(e, t) {
								var r, i, a, o, s;
								return e === null ? null : (r = n[t], e.dimension === t ? e.left === null ? e : c(e.left, t) : (i = e.obj[r], a = c(e.left, t), o = c(e.right, t), s = e, a !== null && a.obj[r] < i && (s = a), o !== null && o.obj[r] < s.obj[r] && (s = o), s));
							}
							if (e.left === null && e.right === null) {
								if (e.parent === null) {
									i.root = null;
									return;
								}
								o = n[e.parent.dimension], e.obj[o] < e.parent.obj[o] ? e.parent.left = null : e.parent.right = null;
								return;
							}
							t = e.left === null ? c(e.right, e.dimension) : s(e.left, e.dimension), r = t.obj, a(t), e.obj = r;
						}
						t = r(i.root), t !== null && a(t);
					}, this.nearest = function(e, r, o) {
						var s, c, l = new a(function(e) {
							return -e[1];
						});
						function u(a) {
							if (!i.root) return [];
							var o, s = n[a.dimension], c = t(e, a.obj), d = {}, f, p, m;
							function h(e, t) {
								l.push([e, t]), l.size() > r && l.pop();
							}
							for (m = 0; m < n.length; m += 1) m === a.dimension ? d[n[m]] = e[n[m]] : d[n[m]] = a.obj[n[m]];
							if (f = t(d, a.obj), a.right === null && a.left === null) {
								(l.size() < r || c < l.peek()[1]) && h(a, c);
								return;
							}
							o = a.right === null ? a.left : a.left === null ? a.right : e[s] < a.obj[s] ? a.left : a.right, u(o), (l.size() < r || c < l.peek()[1]) && h(a, c), (l.size() < r || Math.abs(f) < l.peek()[1]) && (p = o === a.left ? a.right : a.left, p !== null && u(p));
						}
						if (o) for (s = 0; s < r; s += 1) l.push([null, o]);
						for (u(i.root), c = [], s = 0; s < r && s < l.content.length; s += 1) l.content[s][0] && c.push([l.content[s][0].obj, l.content[s][1]]);
						return c;
					}, this.balanceFactor = function() {
						function e(t) {
							return t === null ? 0 : Math.max(e(t.left), e(t.right)) + 1;
						}
						function t(e) {
							return e === null ? 0 : t(e.left) + t(e.right) + 1;
						}
						return e(i.root) / (Math.log(t(i.root)) / Math.log(2));
					};
				}
				function a(e) {
					this.content = [], this.scoreFunction = e;
				}
				a.prototype = {
					push: function(e) {
						this.content.push(e), this.bubbleUp(this.content.length - 1);
					},
					pop: function() {
						var e = this.content[0], t = this.content.pop();
						return this.content.length > 0 && (this.content[0] = t, this.sinkDown(0)), e;
					},
					peek: function() {
						return this.content[0];
					},
					remove: function(e) {
						for (var t = this.content.length, n = 0; n < t; n++) if (this.content[n] == e) {
							var r = this.content.pop();
							n != t - 1 && (this.content[n] = r, this.scoreFunction(r) < this.scoreFunction(e) ? this.bubbleUp(n) : this.sinkDown(n));
							return;
						}
						throw Error("Node not found.");
					},
					size: function() {
						return this.content.length;
					},
					bubbleUp: function(e) {
						for (var t = this.content[e]; e > 0;) {
							var n = Math.floor((e + 1) / 2) - 1, r = this.content[n];
							if (this.scoreFunction(t) < this.scoreFunction(r)) this.content[n] = t, this.content[e] = r, e = n;
							else break;
						}
					},
					sinkDown: function(e) {
						for (var t = this.content.length, n = this.content[e], r = this.scoreFunction(n);;) {
							var i = (e + 1) * 2, a = i - 1, o = null;
							if (a < t) {
								var s = this.content[a], c = this.scoreFunction(s);
								c < r && (o = a);
							}
							if (i < t) {
								var l = this.content[i];
								this.scoreFunction(l) < (o == null ? r : c) && (o = i);
							}
							if (o != null) this.content[e] = this.content[o], this.content[o] = n, e = o;
							else break;
						}
					}
				}, t.exports = { createKdTree: function(e, t, n) {
					return new i(e, t, n);
				} };
			}, {}],
			10: [function(e, t, n) {
				t.exports = {
					name: "serve-sofa-hrir",
					exports: "serveSofaHrir",
					version: "0.4.2",
					description: "Utility to fetch and shape sofa formated HRIR from server",
					main: "./dist/",
					standalone: "serveSofaHrir",
					scripts: {
						lint: "eslint ./src/ ./test/ && jscs --verbose ./src/ ./test/",
						"lint-examples": "eslint -c examples/.eslintrc ./examples/*.html",
						compile: "rm -rf ./dist && babel ./src/ --out-dir ./dist/",
						browserify: "browserify ./src/index.js -t [ babelify ] --standalone serveSofaHrir > serveSofaHrir.js",
						bundle: "npm run lint && npm run test && npm run doc && npm run compile && npm run browserify",
						doc: "esdoc -c esdoc.json",
						test: "browserify test/*/*.js -t [ babelify ] --exclude 'test/*/*_listen.js*' --exclude 'test/*/*_issues.js' | tape-run",
						"test-browser": "browserify test/*/*.js -t [ babelify ] --exclude 'test/*/*_listen.js*' --exclude 'test/*/*_issues.js' | testling -u",
						"test-listen": "browserify test/*/*_listen.js -t [ babelify ] | tape-run",
						"test-issues": "browserify test/*/*_issues.js -t [ babelify ] | tape-run",
						watch: "watch 'npm run browserify && echo $( date ): browserified' ./src/"
					},
					authors: [
						"Jean-Philippe.Lambert@ircam.fr",
						"Arnau Julià <arnau.julia@gmail.com>",
						"Samuel.Goldszmidt@ircam.fr",
						"David.Poirier-Quinot@ircam.fr"
					],
					license: "BSD-3-Clause",
					dependencies: {
						"fractional-delay": "git://github.com/Ircam-RnD/fractional-delay#gh-pages",
						"gl-matrix": "^2.4.0",
						"kd.tree": "akshaylive/node-kdt#39bc780704a324393bca68a17cf7bc71be8544c6"
					},
					repository: {
						type: "git",
						url: "https://github.com/Ircam-RnD/serveSofaHrir"
					},
					engines: {
						node: "0.12 || 4",
						npm: ">=1.0.0 <3.0.0"
					},
					devDependencies: {
						"babel-cli": "^6.5.1",
						"babel-eslint": "^4.1.8",
						"babel-preset-es2015": "^6.5.0",
						babelify: "^7.2.0",
						"blue-tape": "^0.1.11",
						browserify: "^12.0.2",
						esdoc: "^0.4.6",
						eslint: "^1.10.3",
						"eslint-config-airbnb": "^1.0.2",
						"eslint-plugin-html": "^1.4.0",
						jscs: "2.11.0",
						"jscs-jsdoc": "^1.3.1",
						tape: "^4.4.0",
						"tape-run": "^2.1.2",
						testling: "^1.7.1",
						watch: "^0.17.1"
					}
				};
			}, {}],
			11: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.resampleFloat32Array = a;
				var r = i(e("fractional-delay"));
				function i(e) {
					return e && e.__esModule ? e : { default: e };
				}
				function a() {
					var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
					return new Promise(function(t, n) {
						var i = e.inputSamples, a = e.inputSampleRate, o = e.inputDelay === void 0 ? 0 : e.inputDelay, s = e.outputSampleRate === void 0 ? a : e.outputSampleRate;
						if (a === s && o === 0) t(new Float32Array(i));
						else try {
							var c = Math.ceil(i.length * s / a), l = new window.OfflineAudioContext(1, c, s), u = l.createBuffer(1, i.length, a), d = new r.default(a, 1);
							d.setDelay(o / a), u.getChannelData(0).set(d.process(i));
							var f = l.createBufferSource();
							f.buffer = u, f.connect(l.destination), f.start(), l.oncomplete = function(e) {
								t(e.renderedBuffer.getChannelData(0));
							}, l.startRendering();
						} catch (e) {
							n(/* @__PURE__ */ Error("Unable to re-sample Float32Array. " + e.message));
						}
					});
				}
				n.default = { resampleFloat32Array: a };
			}, { "fractional-delay": 7 }],
			12: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.tree = void 0, n.distanceSquared = a, n.distance = o;
				var r = i(e("kd.tree"));
				function i(e) {
					return e && e.__esModule ? e : { default: e };
				}
				n.tree = r.default;
				function a(e, t) {
					var n = t.x - e.x, r = t.y - e.y, i = t.z - e.z;
					return n * n + r * r + i * i;
				}
				function o(e, t) {
					return Math.sqrt(this.distanceSquared(e, t));
				}
				n.default = {
					distance: o,
					distanceSquared: a,
					tree: r.default
				};
			}, { "kd.tree": 9 }],
			13: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.sofaCartesianToGl = a, n.glToSofaCartesian = o, n.sofaCartesianToSofaSpherical = s, n.sofaSphericalToSofaCartesian = c, n.sofaSphericalToGl = l, n.glToSofaSpherical = u, n.sofaToSofaCartesian = d, n.spat4CartesianToGl = f, n.glToSpat4Cartesian = p, n.spat4CartesianToSpat4Spherical = m, n.spat4SphericalToSpat4Cartesian = h, n.spat4SphericalToGl = g, n.glToSpat4Spherical = _, n.systemType = v, n.systemToGl = y, n.glToSystem = b;
				var r = i(e("./degree"));
				function i(e) {
					return e && e.__esModule ? e : { default: e };
				}
				function a(e, t) {
					var n = t[0], r = t[1], i = t[2];
					return e[0] = 0 - r, e[1] = i, e[2] = 0 - n, e;
				}
				function o(e, t) {
					var n = t[0], r = t[1];
					return e[0] = 0 - t[2], e[1] = 0 - n, e[2] = r, e;
				}
				function s(e, t) {
					var n = t[0], i = t[1], a = t[2], o = n * n + i * i;
					return e[0] = (r.default.atan2(i, n) + 360) % 360, e[1] = r.default.atan2(a, Math.sqrt(o)), e[2] = Math.sqrt(o + a * a), e;
				}
				function c(e, t) {
					var n = t[0], i = t[1], a = t[2], o = r.default.cos(i);
					return e[0] = a * o * r.default.cos(n), e[1] = a * o * r.default.sin(n), e[2] = a * r.default.sin(i), e;
				}
				function l(e, t) {
					var n = t[0], i = t[1], a = t[2], o = r.default.cos(i);
					return e[0] = 0 - a * o * r.default.sin(n), e[1] = a * r.default.sin(i), e[2] = 0 - a * o * r.default.cos(n), e;
				}
				function u(e, t) {
					var n = 0 - t[2], i = 0 - t[0], a = t[1], o = n * n + i * i;
					return e[0] = (r.default.atan2(i, n) + 360) % 360, e[1] = r.default.atan2(a, Math.sqrt(o)), e[2] = Math.sqrt(o + a * a), e;
				}
				function d(e, t, n) {
					switch (n) {
						case "sofaCartesian":
							e[0] = t[0], e[1] = t[1], e[2] = t[2];
							break;
						case "sofaSpherical":
							c(e, t);
							break;
						default: throw Error("Bad coordinate system");
					}
					return e;
				}
				function f(e, t) {
					var n = t[0], r = t[1], i = t[2];
					return e[0] = n, e[1] = i, e[2] = 0 - r, e;
				}
				function p(e, t) {
					var n = t[0], r = t[1], i = t[2];
					return e[0] = n, e[1] = 0 - i, e[2] = r, e;
				}
				function m(e, t) {
					var n = t[0], i = t[1], a = t[2], o = n * n + i * i;
					return e[0] = r.default.atan2(n, i), e[1] = r.default.atan2(a, Math.sqrt(o)), e[2] = Math.sqrt(o + a * a), e;
				}
				function h(e, t) {
					var n = t[0], i = t[1], a = t[2], o = r.default.cos(i);
					return e[0] = a * o * r.default.sin(n), e[1] = a * o * r.default.cos(n), e[2] = a * r.default.sin(i), e;
				}
				function g(e, t) {
					var n = t[0], i = t[1], a = t[2], o = r.default.cos(i);
					return e[0] = a * o * r.default.sin(n), e[1] = a * r.default.sin(i), e[2] = 0 - a * o * r.default.cos(n), e;
				}
				function _(e, t) {
					var n = t[0], i = 0 - t[2], a = t[1], o = n * n + i * i;
					return e[0] = r.default.atan2(n, i), e[1] = r.default.atan2(a, Math.sqrt(o)), e[2] = Math.sqrt(o + a * a), e;
				}
				function v(e) {
					var t = void 0;
					if (e === "sofaCartesian" || e === "spat4Cartesian" || e === "gl") t = "cartesian";
					else if (e === "sofaSpherical" || e === "spat4Spherical") t = "spherical";
					else throw Error("Unknown coordinate system type " + e);
					return t;
				}
				function y(e, t, n) {
					switch (n) {
						case "gl":
							e[0] = t[0], e[1] = t[1], e[2] = t[2];
							break;
						case "sofaCartesian":
							a(e, t);
							break;
						case "sofaSpherical":
							l(e, t);
							break;
						case "spat4Cartesian":
							f(e, t);
							break;
						case "spat4Spherical":
							g(e, t);
							break;
						default: throw Error("Bad coordinate system");
					}
					return e;
				}
				function b(e, t, n) {
					switch (n) {
						case "gl":
							e[0] = t[0], e[1] = t[1], e[2] = t[2];
							break;
						case "sofaCartesian":
							o(e, t);
							break;
						case "sofaSpherical":
							u(e, t);
							break;
						case "spat4Cartesian":
							p(e, t);
							break;
						case "spat4Spherical":
							_(e, t);
							break;
						default: throw Error("Bad coordinate system");
					}
					return e;
				}
				n.default = {
					glToSofaCartesian: o,
					glToSofaSpherical: u,
					glToSpat4Cartesian: p,
					glToSpat4Spherical: _,
					glToSystem: b,
					sofaCartesianToGl: a,
					sofaCartesianToSofaSpherical: s,
					sofaSphericalToGl: l,
					sofaSphericalToSofaCartesian: c,
					sofaToSofaCartesian: d,
					spat4CartesianToGl: f,
					spat4CartesianToSpat4Spherical: m,
					spat4SphericalToGl: g,
					spat4SphericalToSpat4Cartesian: h,
					systemToGl: y,
					systemType: v
				};
			}, { "./degree": 14 }],
			14: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.toRadian = a, n.fromRadian = o, n.cos = s, n.sin = c, n.atan2 = l;
				var r = n.toRadianFactor = Math.PI / 180, i = n.fromRadianFactor = 1 / r;
				function a(e) {
					return e * r;
				}
				function o(e) {
					return e * i;
				}
				function s(e) {
					return Math.cos(e * r);
				}
				function c(e) {
					return Math.sin(e * r);
				}
				function l(e, t) {
					return Math.atan2(e, t) * i;
				}
				n.default = {
					atan2: l,
					cos: s,
					fromRadian: o,
					fromRadianFactor: i,
					sin: c,
					toRadian: a,
					toRadianFactor: r
				};
			}, {}],
			15: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.ServerDataBase = n.HrtfSet = void 0;
				var r = a(e("./sofa/HrtfSet")), i = a(e("./sofa/ServerDataBase"));
				function a(e) {
					return e && e.__esModule ? e : { default: e };
				}
				n.HrtfSet = r.default, n.ServerDataBase = i.default, n.default = {
					HrtfSet: r.default,
					ServerDataBase: i.default
				};
			}, {
				"./sofa/HrtfSet": 17,
				"./sofa/ServerDataBase": 18
			}],
			16: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.version = n.name = n.license = n.description = void 0;
				var r = i(e("../package.json"));
				function i(e) {
					return e && e.__esModule ? e : { default: e };
				}
				var a = r.default.description;
				n.description = a;
				var o = r.default.license;
				n.license = o;
				var s = r.default.name;
				n.name = s;
				var c = r.default.version;
				n.version = c, n.default = {
					description: a,
					license: o,
					name: s,
					version: c
				};
			}, { "../package.json": 10 }],
			17: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.HrtfSet = void 0;
				var r = /* @__PURE__ */ function() {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}
					return function(t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				}(), i = f(e("gl-matrix")), a = d(e("../info")), o = e("./parseDataSet"), s = e("./parseSofa"), c = d(e("../geometry/coordinates")), l = d(e("../geometry/KdTree")), u = e("../audio/utilities");
				function d(e) {
					return e && e.__esModule ? e : { default: e };
				}
				function f(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (e != null) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t.default = e, t;
				}
				function p(e) {
					if (Array.isArray(e)) {
						for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
						return n;
					}
					return Array.from(e);
				}
				function m(e, t) {
					if (!(e instanceof t)) throw TypeError("Cannot call a class as a function");
				}
				n.default = n.HrtfSet = function() {
					function e() {
						var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
						m(this, e), this._audioContext = t.audioContext, this._ready = !1, this.coordinateSystem = t.coordinateSystem, this.filterCoordinateSystem = t.filterCoordinateSystem, this.filterPositions = t.filterPositions, this.filterAfterLoad = t.filterAfterLoad;
					}
					return r(e, [
						{
							key: "applyFilterPositions",
							value: function() {
								var e = this, t = this._filterPositions.map(function(t) {
									return e._kdt.nearest({
										x: t[0],
										y: t[1],
										z: t[2]
									}, 1).pop()[0];
								});
								t = [].concat(p(new Set(t))), this._kdt = l.default.tree.createKdTree(t, l.default.distanceSquared, [
									"x",
									"y",
									"z"
								]);
							}
						},
						{
							key: "load",
							value: function(e) {
								var t = this, n = e.split(".").pop(), r = n === "sofa" ? e + ".json" : e, i = void 0;
								return i = this._filterPositions !== void 0 && !this.filterAfterLoad && n === "sofa" ? Promise.all([this._loadMetaAndPositions(e), this._loadDataSet(e)]).then(function(n) {
									var r = n[0], i = n[1];
									return t._loadSofaPartial(e, r, i).then(function() {
										return t._ready = !0, t;
									});
								}).catch(function() {
									return t._loadSofaFull(r).then(function() {
										return t.applyFilterPositions(), t._ready = !0, t;
									});
								}) : this._loadSofaFull(r).then(function() {
									return t._filterPositions !== void 0 && t.filterAfterLoad && t.applyFilterPositions(), t._ready = !0, t;
								}), i;
							}
						},
						{
							key: "export",
							value: function() {
								var e = this, t = void 0, n = c.default.systemType(this.filterCoordinateSystem);
								switch (n) {
									case "cartesian":
										t = this._sofaSourcePosition.map(function(e) {
											return c.default.glToSofaCartesian([], e);
										});
										break;
									case "spherical":
										t = this._sofaSourcePosition.map(function(e) {
											return c.default.glToSofaSpherical([], e);
										});
										break;
									default: throw Error("Bad source position type " + n + " for export.");
								}
								var r = this._sofaSourcePosition.map(function(t) {
									for (var n = e._kdt.nearest({
										x: t[0],
										y: t[1],
										z: t[2]
									}, 1).pop()[0].fir, r = [], i = 0; i < n.numberOfChannels; ++i) r.push([].concat(p(n.getChannelData(i))));
									return r;
								});
								return (0, s.stringifySofa)({
									name: this._sofaName,
									metaData: this._sofaMetaData,
									ListenerPosition: [
										0,
										0,
										0
									],
									ListenerPositionType: "cartesian",
									ListenerUp: [
										0,
										0,
										1
									],
									ListenerUpType: "cartesian",
									ListenerView: [
										1,
										0,
										0
									],
									ListenerViewType: "cartesian",
									SourcePositionType: n,
									SourcePosition: t,
									DataSamplingRate: this._audioContext.sampleRate,
									DataDelay: this._sofaDelay,
									DataIR: r,
									RoomVolume: this._sofaRoomVolume
								});
							}
						},
						{
							key: "nearest",
							value: function(e) {
								var t = c.default.systemToGl([], e, this.coordinateSystem), n = this._kdt.nearest({
									x: t[0],
									y: t[1],
									z: t[2]
								}, 1).pop(), r = n[0];
								return c.default.glToSystem(t, [
									r.x,
									r.y,
									r.z
								], this.coordinateSystem), {
									distance: n[1],
									fir: r.fir,
									index: r.index,
									position: t
								};
							}
						},
						{
							key: "nearestFir",
							value: function(e) {
								return this.nearest(e).fir;
							}
						},
						{
							key: "_createKdTree",
							value: function(e) {
								var t = this, n = e.map(function(e) {
									var n = e[2], r = t._audioContext.createBuffer(n.length, n[0].length, t._audioContext.sampleRate);
									return n.forEach(function(e, t) {
										r.getChannelData(t).set(e);
									}), {
										index: e[0],
										x: e[1][0],
										y: e[1][1],
										z: e[1][2],
										fir: r
									};
								});
								return this._sofaSourcePosition = n.map(function(e) {
									return [
										e.x,
										e.y,
										e.z
									];
								}), this._kdt = l.default.tree.createKdTree(n, l.default.distanceSquared, [
									"x",
									"y",
									"z"
								]), this;
							}
						},
						{
							key: "_generateIndicesPositionsFirs",
							value: function(e, t, n, r) {
								var i = this, a = n.map(function(n, a) {
									var o = n.length;
									if (o !== 2) throw Error("Bad number of channels" + (" for IR index " + e[a]) + (" (" + o + " instead of 2)"));
									if (r[0].length !== 2) throw Error("Bad delay format" + (" for IR index " + e[a]) + (" (first element in Data.Delay is " + r[0]) + " instead of [[delayL, delayR]] )");
									var s = r[a] === void 0 ? r[0] : r[a], c = n.map(function(t, n) {
										if (s[n] < 0) throw Error("Negative delay detected (not handled at the moment):" + (" delay index " + e[a]) + (" channel " + n));
										return (0, u.resampleFloat32Array)({
											inputSamples: t,
											inputDelay: s[n],
											inputSampleRate: i._sofaSampleRate,
											outputSampleRate: i._audioContext.sampleRate
										});
									});
									return Promise.all(c).then(function(n) {
										return [
											e[a],
											t[a],
											n
										];
									}).catch(function(e) {
										throw Error("Unable to re-sample impulse response " + a + ". " + e.message);
									});
								});
								return Promise.all(a);
							}
						},
						{
							key: "_loadDataSet",
							value: function(e) {
								return new Promise(function(t, n) {
									var r = e + ".dds", i = new window.XMLHttpRequest();
									i.open("GET", r), i.onerror = function() {
										n(/* @__PURE__ */ Error("Unable to GET " + r + ", status " + i.status + " " + ("" + i.responseText)));
									}, i.onload = function() {
										if (i.status < 200 || i.status >= 300) {
											i.onerror();
											return;
										}
										try {
											t((0, o.parseDataSet)(i.response));
										} catch (e) {
											n(/* @__PURE__ */ Error("Unable to parse " + r + ". " + e.message));
										}
									}, i.send();
								});
							}
						},
						{
							key: "_loadMetaAndPositions",
							value: function(e) {
								var t = this;
								return new Promise(function(n, r) {
									var i = e + ".json?ListenerPosition,ListenerUp,ListenerView,SourcePosition,Data.Delay,Data.SamplingRate,EmitterPosition,ReceiverPosition,RoomVolume", a = new window.XMLHttpRequest();
									a.open("GET", i), a.onerror = function() {
										r(/* @__PURE__ */ Error("Unable to GET " + i + ", status " + a.status + " " + ("" + a.responseText)));
									}, a.onload = function() {
										if (a.status < 200 || a.status >= 300) {
											a.onerror();
											return;
										}
										try {
											var o = (0, s.parseSofa)(a.response);
											t._setMetaData(o, e);
											var c = t._sourcePositionsToGl(o).map(function(e, t) {
												return {
													x: e[0],
													y: e[1],
													z: e[2],
													index: t
												};
											}), u = l.default.tree.createKdTree(c, l.default.distanceSquared, [
												"x",
												"y",
												"z"
											]), d = t._filterPositions.map(function(e) {
												return u.nearest({
													x: e[0],
													y: e[1],
													z: e[2]
												}, 1).pop()[0].index;
											});
											d = [].concat(p(new Set(d))), t._sofaUrl = e, n(d);
										} catch (e) {
											r(/* @__PURE__ */ Error("Unable to parse " + i + ". " + e.message));
										}
									}, a.send();
								});
							}
						},
						{
							key: "_loadSofaFull",
							value: function(e) {
								var t = this;
								return new Promise(function(n, r) {
									var i = new window.XMLHttpRequest();
									i.open("GET", e), i.onerror = function() {
										r(/* @__PURE__ */ Error("Unable to GET " + e + ", status " + i.status + " " + ("" + i.responseText)));
									}, i.onload = function() {
										if (i.status < 200 || i.status >= 300) {
											i.onerror();
											return;
										}
										try {
											var a = (0, s.parseSofa)(i.response);
											t._setMetaData(a, e);
											var o = t._sourcePositionsToGl(a);
											t._generateIndicesPositionsFirs(o.map(function(e, t) {
												return t;
											}), o, a["Data.IR"].data, a["Data.Delay"].data).then(function(r) {
												t._createKdTree(r), t._sofaUrl = e, n(t);
											});
										} catch (t) {
											r(/* @__PURE__ */ Error("Unable to parse " + e + ". " + t.message));
										}
									}, i.send();
								});
							}
						},
						{
							key: "_loadSofaPartial",
							value: function(e, t, n) {
								var r = this, i = t.map(function(t) {
									return new Promise(function(i, a) {
										var o = e + ".json?" + ("SourcePosition[" + t + "][0:1:" + (n.SourcePosition.C - 1) + "],") + ("Data.IR[" + t + "][0:1:" + (n["Data.IR"].R - 1) + "]") + ("[0:1:" + (n["Data.IR"].N - 1) + "]"), c = new window.XMLHttpRequest();
										c.open("GET", o), c.onerror = function() {
											a(/* @__PURE__ */ Error("Unable to GET " + o + ", status " + c.status + " " + ("" + c.responseText)));
										}, c.onload = function() {
											(c.status < 200 || c.status >= 300) && c.onerror();
											try {
												var e = (0, s.parseSofa)(c.response), n = r._sourcePositionsToGl(e);
												r._generateIndicesPositionsFirs([t], n, e["Data.IR"].data, e["Data.Delay"].data).then(function(e) {
													i(e[0]);
												});
											} catch (e) {
												a(/* @__PURE__ */ Error("Unable to parse " + o + ". " + e.message));
											}
										}, c.send();
									});
								});
								return Promise.all(i).then(function(e) {
									return r._createKdTree(e), r;
								});
							}
						},
						{
							key: "_setMetaData",
							value: function(e, t) {
								if (e.metaData.DataType !== void 0 && e.metaData.DataType !== "FIR") throw Error("According to meta-data, SOFA data type is not FIR");
								var n = (/* @__PURE__ */ new Date()).toISOString();
								this._sofaName = e.name === void 0 ? "HRTF.sofa" : "" + e.name, this._sofaMetaData = e.metaData === void 0 ? {} : e.metaData, t !== void 0 && (this._sofaMetaData.OriginalUrl = t), this._sofaMetaData.Converter = "Ircam " + a.default.name + " " + a.default.version + " javascript API ", this._sofaMetaData.DateConverted = n, this._sofaSampleRate = e["Data.SamplingRate"] === void 0 ? 48e3 : e["Data.SamplingRate"].data[0], this._sofaSampleRate !== this._audioContext.sampleRate && (this._sofaMetaData.OriginalSampleRate = this._sofaSampleRate), this._sofaDelay = e["Data.Delay"] === void 0 ? [0, 0] : e["Data.Delay"].data, this._sofaRoomVolume = e.RoomVolume === void 0 ? void 0 : e.RoomVolume.data[0];
								var r = c.default.sofaToSofaCartesian([], e.ListenerPosition.data[0], (0, s.conformSofaCoordinateSystem)(e.ListenerPosition.Type || "cartesian")), o = c.default.sofaToSofaCartesian([], e.ListenerView.data[0], (0, s.conformSofaCoordinateSystem)(e.ListenerView.Type || "cartesian")), l = c.default.sofaToSofaCartesian([], e.ListenerUp.data[0], (0, s.conformSofaCoordinateSystem)(e.ListenerUp.Type || "cartesian"));
								this._sofaToGl = i.mat4.lookAt([], r, o, l);
							}
						},
						{
							key: "_sourcePositionsToGl",
							value: function(e) {
								var t = this, n = e.SourcePosition.data;
								switch (e.SourcePosition.Type === void 0 ? "spherical" : e.SourcePosition.Type) {
									case "cartesian":
										n.forEach(function(e) {
											i.vec3.transformMat4(e, e, t._sofaToGl);
										});
										break;
									case "spherical":
										n.forEach(function(e) {
											c.default.sofaSphericalToSofaCartesian(e, e), i.vec3.transformMat4(e, e, t._sofaToGl);
										});
										break;
									default: throw Error("Bad source position type");
								}
								return n;
							}
						},
						{
							key: "coordinateSystem",
							set: function(e) {
								this._coordinateSystem = e === void 0 ? "gl" : e;
							},
							get: function() {
								return this._coordinateSystem;
							}
						},
						{
							key: "filterCoordinateSystem",
							set: function(e) {
								this._filterCoordinateSystem = e === void 0 ? this.coordinateSystem : e;
							},
							get: function() {
								return this._filterCoordinateSystem;
							}
						},
						{
							key: "filterPositions",
							set: function(e) {
								if (e === void 0) this._filterPositions = void 0;
								else switch (this.filterCoordinateSystem) {
									case "gl":
										this._filterPositions = e.map(function(e) {
											return e.slice(0);
										});
										break;
									case "sofaCartesian":
										this._filterPositions = e.map(function(e) {
											return c.default.sofaCartesianToGl([], e);
										});
										break;
									case "sofaSpherical":
										this._filterPositions = e.map(function(e) {
											return c.default.sofaSphericalToGl([], e);
										});
										break;
									default: throw Error("Bad filter coordinate system");
								}
							},
							get: function() {
								var e = void 0;
								if (this._filterPositions !== void 0) switch (this.filterCoordinateSystem) {
									case "gl":
										e = this._filterPositions.map(function(e) {
											return e.slice(0);
										});
										break;
									case "sofaCartesian":
										e = this._filterPositions.map(function(e) {
											return c.default.glToSofaCartesian([], e);
										});
										break;
									case "sofaSpherical":
										e = this._filterPositions.map(function(e) {
											return c.default.glToSofaSpherical([], e);
										});
										break;
									default: throw Error("Bad filter coordinate system");
								}
								return e;
							}
						},
						{
							key: "filterAfterLoad",
							set: function(e) {
								this._filterAfterLoad = e !== void 0 && e;
							},
							get: function() {
								return this._filterAfterLoad;
							}
						},
						{
							key: "isReady",
							get: function() {
								return this._ready;
							}
						},
						{
							key: "sofaName",
							get: function() {
								return this._sofaName;
							}
						},
						{
							key: "sofaUrl",
							get: function() {
								return this._sofaUrl;
							}
						},
						{
							key: "sofaSampleRate",
							get: function() {
								return this._sofaSampleRate;
							}
						},
						{
							key: "sofaMetaData",
							get: function() {
								return this._sofaMetaData;
							}
						}
					]), e;
				}();
			}, {
				"../audio/utilities": 11,
				"../geometry/KdTree": 12,
				"../geometry/coordinates": 13,
				"../info": 16,
				"./parseDataSet": 19,
				"./parseSofa": 20,
				"gl-matrix": 8
			}],
			18: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.ServerDataBase = void 0;
				var r = /* @__PURE__ */ function() {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}
					return function(t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				}(), i = o(e("./parseXml")), a = e("./parseDataSet");
				function o(e) {
					return e && e.__esModule ? e : { default: e };
				}
				function s(e, t) {
					if (!(e instanceof t)) throw TypeError("Cannot call a class as a function");
				}
				n.default = n.ServerDataBase = function() {
					function e() {
						var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
						if (s(this, e), this._server = t.serverUrl, this._server === void 0) {
							var n = window.location.protocol === "https:" ? "https:" : "http:";
							this._server = n + "//bili2.ircam.fr";
						}
						this._catalogue = {}, this._urls = [];
					}
					return r(e, [
						{
							key: "loadCatalogue",
							value: function() {
								var e = this, t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this._server + "/catalog.xml", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this._catalogue;
								return new Promise(function(r, a) {
									var o = new window.XMLHttpRequest();
									o.open("GET", t), o.onerror = function() {
										a(/* @__PURE__ */ Error("Unable to GET " + t + ", status " + o.status + " " + ("" + o.responseText)));
									}, o.onload = function() {
										if (o.status < 200 || o.status >= 300) {
											o.onerror();
											return;
										}
										var s = (0, i.default)(o.response), c = s.querySelector("dataset"), l = s.querySelectorAll("dataset > catalogRef");
										if (l.length === 0) {
											n.urls = [];
											for (var u = s.querySelectorAll("dataset > dataset"), d = 0; d < u.length; ++d) {
												var f = e._server + c.getAttribute("name") + "/" + u[d].getAttribute("name");
												e._urls.push(f), n.urls.push(f);
											}
											r(t);
										} else {
											for (var p = [], m = 0; m < l.length; ++m) {
												var h = l[m].getAttribute("name"), g = e._server + c.getAttribute("name") + "/" + l[m].getAttribute("xlink:href");
												n[h] = {}, p.push(e.loadCatalogue(g, n[h]));
											}
											Promise.all(p).then(function() {
												e._urls.sort(), r(t);
											}).catch(function(e) {
												a(e);
											});
										}
									}, o.send();
								});
							}
						},
						{
							key: "getUrls",
							value: function() {
								var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = [
									e.convention,
									e.dataBase,
									e.equalisation,
									e.sampleRate,
									e.sosOrder
								], n = typeof e.freePattern == "number" ? e.freePattern.toString() : e.freePattern, r = t.reduce(function(e, t) {
									return e + "/" + (t === void 0 ? "[^/]*" : "[^/]*(?:" + t + ")[^/]*");
								}, ""), i = new RegExp(r, "i"), a = this._urls.filter(function(e) {
									return i.test(e);
								});
								return n !== void 0 && n.split(/\s+/).forEach(function(e) {
									i = new RegExp(e, "i"), a = a.filter(function(e) {
										return i.test(e);
									});
								}), a;
							}
						},
						{
							key: "getDataSetDefinitions",
							value: function(e) {
								return new Promise(function(t, n) {
									var r = e + ".dds", i = new window.XMLHttpRequest();
									i.open("GET", r), i.onerror = function() {
										n(/* @__PURE__ */ Error("Unable to GET " + r + ", status " + i.status + " " + ("" + i.responseText)));
									}, i.onload = function() {
										if (i.status < 200 || i.status >= 300) {
											i.onerror();
											return;
										}
										t((0, a.parseDataSet)(i.response));
									}, i.send();
								});
							}
						},
						{
							key: "getSourcePositions",
							value: function(e) {
								return new Promise(function(t, n) {
									var r = e + ".json?SourcePosition", i = new window.XMLHttpRequest();
									i.open("GET", r), i.onerror = function() {
										n(/* @__PURE__ */ Error("Unable to GET " + r + ", status " + i.status + " " + ("" + i.responseText)));
									}, i.onload = function() {
										if (i.status < 200 || i.status >= 300) {
											i.onerror();
											return;
										}
										try {
											var e = JSON.parse(i.response);
											if (e.leaves[0].name !== "SourcePosition") throw Error("SourcePosition not found");
											t(e.leaves[0].data);
										} catch (e) {
											n(/* @__PURE__ */ Error("Unable to parse response from " + r + ". " + e.message));
										}
									}, i.send();
								});
							}
						}
					]), e;
				}();
			}, {
				"./parseDataSet": 19,
				"./parseXml": 21
			}],
			19: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n._parseDimension = u, n._parseDefinition = d, n.parseDataSet = f;
				var r = "\\[\\s*(\\w+)\\s*=\\s*(\\d+)\\s*\\]", i = new RegExp(r, "g"), a = new RegExp(r), o = "\\s*(\\w+)\\s*([\\w.]+)\\s*((?:\\[[^\\]]+\\]\\s*)+);\\s*", s = new RegExp(o, "g"), c = new RegExp(o), l = /* @__PURE__ */ RegExp("\\s*Dataset\\s*\\{\\s*((?:[^;]+;\\s*)*)\\s*\\}\\s*[\\w.]+\\s*;\\s*");
				function u(e) {
					var t = [], n = e.match(i);
					return n !== null && n.forEach(function(e) {
						var n = a.exec(e);
						n !== null && n.length > 2 && t.push([n[1], Number(n[2])]);
					}), t;
				}
				function d(e) {
					var t = [], n = e.match(s);
					return n !== null && n.forEach(function(e) {
						var n = c.exec(e);
						if (n !== null && n.length > 3) {
							var r = [];
							r[0] = n[2], r[1] = {}, r[1].type = n[1], u(n[3]).forEach(function(e) {
								r[1][e[0]] = e[1];
							}), t.push(r);
						}
					}), t;
				}
				function f(e) {
					var t = {}, n = l.exec(e);
					return n !== null && n.length > 1 && d(n[1]).forEach(function(e) {
						t[e[0]] = e[1];
					}), t;
				}
				n.default = f;
			}, {}],
			20: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.parseSofa = r, n.stringifySofa = i, n.conformSofaCoordinateSystem = a;
				function r(e) {
					try {
						var t = JSON.parse(e), n = {};
						if (n.name = t.name, t.attributes !== void 0) {
							n.metaData = {};
							var r = t.attributes.find(function(e) {
								return e.name === "NC_GLOBAL";
							});
							r !== void 0 && r.attributes.forEach(function(e) {
								n.metaData[e.name] = e.value[0];
							});
						}
						return t.leaves !== void 0 && t.leaves.forEach(function(e) {
							n[e.name] = {}, e.attributes.forEach(function(t) {
								n[e.name][t.name] = t.value[0];
							}), n[e.name].shape = e.shape, n[e.name].data = e.data;
						}), n;
					} catch (e) {
						throw Error("Unable to parse SOFA string. " + e.message);
					}
				}
				function i(e) {
					var t = {};
					if (e.name !== void 0 && (t.name = e.name), e.metaData !== void 0) {
						t.attributes = [];
						var n = {
							name: "NC_GLOBAL",
							attributes: []
						};
						for (var r in e.metaData) e.metaData.hasOwnProperty(r) && n.attributes.push({
							name: r,
							value: [e.metaData[r]]
						});
						t.attributes.push(n);
					}
					var i = "Float64", a = void 0;
					if (t.leaves = [], [
						["ListenerPosition", "ListenerPositionType"],
						["ListenerUp", "ListenerUpType"],
						["ListenerView", "ListenerViewType"]
					].forEach(function(n) {
						var r = n[0], o = e[r], s = e[n[1]];
						if (o !== void 0) {
							switch (s) {
								case "cartesian":
									a = [{
										name: "Type",
										value: ["cartesian"]
									}, {
										name: "Units",
										value: ["metre, metre, metre"]
									}];
									break;
								case "spherical":
									a = [{
										name: "Type",
										value: ["spherical"]
									}, {
										name: "Units",
										value: ["degree, degree, metre"]
									}];
									break;
								default: throw Error("Unknown coordinate system type " + (s + " for " + o));
							}
							t.leaves.push({
								name: r,
								type: i,
								attributes: a,
								shape: [1, 3],
								data: [o]
							});
						}
					}), e.SourcePosition !== void 0) {
						switch (e.SourcePositionType) {
							case "cartesian":
								a = [{
									name: "Type",
									value: ["cartesian"]
								}, {
									name: "Units",
									value: ["metre, metre, metre"]
								}];
								break;
							case "spherical":
								a = [{
									name: "Type",
									value: ["spherical"]
								}, {
									name: "Units",
									value: ["degree, degree, metre"]
								}];
								break;
							default: throw Error("Unknown coordinate system type " + ("" + e.SourcePositionType));
						}
						t.leaves.push({
							name: "SourcePosition",
							type: i,
							attributes: a,
							shape: [e.SourcePosition.length, e.SourcePosition[0].length],
							data: e.SourcePosition
						});
					}
					if (e.DataSamplingRate !== void 0) t.leaves.push({
						name: "Data.SamplingRate",
						type: i,
						attributes: [{
							name: "Unit",
							value: "hertz"
						}],
						shape: [1],
						data: [e.DataSamplingRate]
					});
					else throw Error("No data sampling-rate");
					if (e.DataDelay !== void 0 && t.leaves.push({
						name: "Data.Delay",
						type: i,
						attributes: [],
						shape: [1, e.DataDelay.length],
						data: e.DataDelay
					}), e.DataIR !== void 0) t.leaves.push({
						name: "Data.IR",
						type: i,
						attributes: [],
						shape: [
							e.DataIR.length,
							e.DataIR[0].length,
							e.DataIR[0][0].length
						],
						data: e.DataIR
					});
					else throw Error("No data IR");
					return e.RoomVolume !== void 0 && t.leaves.push({
						name: "RoomVolume",
						type: i,
						attributes: [{
							name: "Units",
							value: ["cubic metre"]
						}],
						shape: [1],
						data: [e.RoomVolume]
					}), t.nodes = [], JSON.stringify(t);
				}
				function a(e) {
					var t = void 0;
					switch (e) {
						case "cartesian":
							t = "sofaCartesian";
							break;
						case "spherical":
							t = "sofaSpherical";
							break;
						default: throw Error("Bad SOFA type " + e);
					}
					return t;
				}
				n.default = {
					parseSofa: r,
					conformSofaCoordinateSystem: a
				};
			}, {}],
			21: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 });
				var r = n.parseXml = void 0;
				if (window.DOMParser !== void 0) n.parseXml = r = function(e) {
					return new window.DOMParser().parseFromString(e, "text/xml");
				};
				else if (window.ActiveXObject !== void 0 && new window.ActiveXObject("Microsoft.XMLDOM")) n.parseXml = r = function(e) {
					var t = new window.ActiveXObject("Microsoft.XMLDOM");
					return t.async = "false", t.loadXML(e), t;
				};
				else throw Error("No XML parser found");
				n.default = r;
			}, {}]
		}, {}, [15])(15);
	});
})(serveSofaHrir);
var serveSofaHrirExports = serveSofaHrir.exports, HRIRloader_ircam = class {
	constructor(e, t, n) {
		this.context = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.onLoad = n, this.hrtfSet = new serveSofaHrirExports.HrtfSet({
			audioContext: this.context,
			coordinateSystem: "sofaSpherical"
		}), this.wishedSpeakerPos = getTdesign(2 * this.order), this.hrirBuffer = [], this.decodingMatrix = [], this.hoaBuffer = null;
	}
	load(e) {
		this.hrtfSet.load(e).then(() => {
			let e = [];
			this.hrirBuffer = [];
			for (let t = 0; t < this.wishedSpeakerPos.length; t++) e.push(this.hrtfSet.nearest(this.wishedSpeakerPos[t]).position), this.hrirBuffer.push(this.hrtfSet.nearest(this.wishedSpeakerPos[t]).fir);
			let t = 0;
			for (let n = 0; n < this.wishedSpeakerPos.length; n++) this.wishedSpeakerPos[n][0] < 0 && (this.wishedSpeakerPos[n][0] += 360), t += Math.sqrt((this.wishedSpeakerPos[n][0] - e[n][0]) ** 2 + (this.wishedSpeakerPos[n][1] - e[n][1]) ** 2);
			console.log("summed / average angular dist between asked and present pos:", Math.round(t * 100) / 100, "deg /", Math.round(t / this.wishedSpeakerPos.length * 100) / 100, "deg"), this.decodingMatrix = getAmbisonicDecMtx(e, this.order), this.hoaBuffer = this.getHoaFilterFromHrirFilter(), this.onLoad(this.hoaBuffer);
		});
	}
	getHoaFilterFromHrirFilter() {
		let e = this.hrirBuffer[0].length, t = this.hrirBuffer[0].sampleRate, n = this.context.createBuffer(this.nCh, e, t);
		for (let t = 0; t < this.nCh; t++) {
			let r = new Float32Array(e);
			for (let n = 0; n < this.hrirBuffer.length; n++) for (let i = 0; i < e; i++) r[i] += this.decodingMatrix[n][t] * this.hrirBuffer[n].getChannelData(0)[i];
			n.getChannelData(t).set(r);
		}
		return n;
	}
}, wxyz2acn = class {
	constructor(e) {
		this.ctx = e, this.in = this.ctx.createChannelSplitter(4), this.out = this.ctx.createChannelMerger(4), this.gains = [
			,
			,
			,
			,
		];
		for (let e = 0; e < 4; e++) this.gains[e] = this.ctx.createGain(), e === 0 ? this.gains[e].gain.value = Math.SQRT2 : this.gains[e].gain.value = Math.sqrt(3), this.gains[e].connect(this.out, 0, e);
		this.in.connect(this.gains[0], 0, 0), this.in.connect(this.gains[3], 1, 0), this.in.connect(this.gains[1], 2, 0), this.in.connect(this.gains[2], 3, 0);
	}
}, acn2wxyz = class {
	constructor(e) {
		this.ctx = e, this.in = this.ctx.createChannelSplitter(4), this.out = this.ctx.createChannelMerger(4), this.gains = [
			,
			,
			,
			,
		];
		for (let e = 0; e < 4; e++) this.gains[e] = this.ctx.createGain(), e === 0 ? this.gains[e].gain.value = Math.SQRT1_2 : this.gains[e].gain.value = 1 / Math.sqrt(3), this.gains[e].connect(this.out, 0, e);
		this.in.connect(this.gains[0], 0, 0), this.in.connect(this.gains[2], 1, 0), this.in.connect(this.gains[3], 2, 0), this.in.connect(this.gains[1], 3, 0);
	}
}, sn3d2n3d = class {
	constructor(e, t) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh), this.gains = Array(this.nCh);
		for (let e = 0; e < this.nCh; e++) {
			let t = Math.floor(Math.sqrt(e));
			this.gains[e] = this.ctx.createGain(), this.gains[e].gain.value = Math.sqrt(2 * t + 1), this.in.connect(this.gains[e], e, 0), this.gains[e].connect(this.out, 0, e);
		}
	}
}, n3d2sn3d = class {
	constructor(e, t) {
		this.ctx = e, this.order = t, this.nCh = getAmbisonicChannelCount(t), this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh), this.gains = Array(this.nCh);
		for (let e = 0; e < this.nCh; e++) {
			let t = Math.floor(Math.sqrt(e));
			this.gains[e] = this.ctx.createGain(), this.gains[e].gain.value = 1 / Math.sqrt(2 * t + 1), this.in.connect(this.gains[e], e, 0), this.gains[e].connect(this.out, 0, e);
		}
	}
}, fuma2acn = class {
	constructor(e, t) {
		let n = t;
		n > 3 && (console.log("FuMa specifiction is supported up to 3rd order"), n = 3);
		let r = [
			Math.sqrt(2),
			Math.sqrt(3),
			Math.sqrt(3),
			Math.sqrt(3),
			Math.sqrt(15) / 2,
			Math.sqrt(15) / 2,
			Math.sqrt(5),
			Math.sqrt(15) / 2,
			Math.sqrt(15) / 2,
			Math.sqrt(35 / 8),
			Math.sqrt(35) / 3,
			Math.sqrt(224 / 45),
			Math.sqrt(7),
			Math.sqrt(224 / 45),
			Math.sqrt(35) / 3,
			Math.sqrt(35 / 8)
		];
		if (this.ctx = e, this.order = n, this.nCh = getAmbisonicChannelCount(n), this.in = this.ctx.createChannelSplitter(this.nCh), this.out = this.ctx.createChannelMerger(this.nCh), this.gains = [], this.remapArray = [], this.remapArray.push(0, 2, 3, 1), n > 1) {
			let e = 0, t;
			for (let n = 0; n < this.nCh; n++) if (t = [], n >= (e + 1) * (e + 1)) {
				e += 1;
				for (let n = (e + 1) * (e + 1); n < (e + 2) * (e + 2); n++) (n + e % 2) % 2 == 0 ? t.push(n) : t.unshift(n);
				this.remapArray = this.remapArray.concat(t);
			}
		}
		for (let e = 0; e < this.nCh; e++) this.gains[e] = this.ctx.createGain(), this.gains[e].gain.value = r[e], this.in.connect(this.gains[e], this.remapArray[e], 0), this.gains[e].connect(this.out, 0, e);
	}
}, _converters = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
	__proto__: null,
	acn2wxyz,
	fuma2acn,
	n3d2sn3d,
	sn3d2n3d,
	wxyz2acn
}, Symbol.toStringTag, { value: "Module" })), converters = _converters, utils = _utils, { log10, pow, floor, max, min, sqrt: sqrt$1, cos: cos$1, PI: PI$1, random } = Math;
function extractDecayParameters(e, t, n, r) {
	let i = t.length, a = [];
	for (let t = 0; t < i; t++) {
		let i = e[t], o = 0;
		for (let e = i.length - 1; e >= 0; e--) if (i[e] > 0) {
			o = e;
			break;
		}
		if (o < 2) {
			a.push({
				t60: 0,
				decayRate: 0,
				crossfadeLevel: 0,
				crossfadeTime: 0,
				endTime: 0
			});
			continue;
		}
		let s = new Float32Array(o + 1);
		s[o] = i[o];
		for (let e = o - 1; e >= 0; e--) s[e] = s[e + 1] + i[e];
		let c = s[0];
		if (c <= 0) {
			a.push({
				t60: 0,
				decayRate: 0,
				crossfadeLevel: 0,
				crossfadeTime: 0,
				endTime: 0
			});
			continue;
		}
		let l = c * pow(10, -5 / 10), u = c * pow(10, -35 / 10), d = -1, f = -1;
		for (let e = 0; e <= o; e++) d < 0 && s[e] <= l && (d = e), f < 0 && s[e] <= u && (f = e);
		let p = 0, m = 0;
		if (d >= 0 && f > d) {
			let e = [], t = [];
			for (let n = d; n <= f; n++) {
				let i = s[n];
				i > 0 && (e.push(n * r), t.push(10 * log10(i / c)));
			}
			if (e.length >= 2) {
				let n = linearRegression(e, t).m;
				n < 0 && (p = n, m = -60 / n);
			}
		}
		p < 0 && p > -1 && (p = -1, m = 60 / 1);
		let h = n;
		if (h <= 0) {
			let e = max(1, floor(.05 / r));
			h = max(0, o - e) * r;
		}
		let g = min(floor(h / r), o), _ = g <= o && g >= 0 ? s[g] / c : 0, v = m > 0 ? min(h + m, 10) : h;
		a.push({
			t60: m,
			decayRate: p,
			crossfadeLevel: _,
			crossfadeTime: h,
			endTime: v
		});
	}
	return a;
}
function synthesizeTail(e, t) {
	let n = 0, r = Infinity;
	for (let t of e) t.endTime > n && (n = t.endTime), t.crossfadeTime > 0 && t.crossfadeTime < r && (r = t.crossfadeTime);
	if (n <= 0 || !isFinite(r)) return {
		tailSamples: e.map(() => /* @__PURE__ */ new Float32Array()),
		tailStartSample: 0,
		totalSamples: 0
	};
	let i = floor(r * t), a = floor(n * t), o = a - i;
	if (o <= 0) return {
		tailSamples: e.map(() => /* @__PURE__ */ new Float32Array()),
		tailStartSample: i,
		totalSamples: a
	};
	let s = [];
	for (let n of e) {
		let e = new Float32Array(o);
		if (n.decayRate >= 0 || n.crossfadeLevel <= 0) {
			s.push(e);
			continue;
		}
		let r = sqrt$1(n.crossfadeLevel) / (1 / sqrt$1(3));
		for (let i = 0; i < o; i++) {
			let a = i / t, o = pow(10, n.decayRate * a / 20), s = random() * 2 - 1;
			e[i] = s * o * r;
		}
		s.push(e);
	}
	return {
		tailSamples: s,
		tailStartSample: i,
		totalSamples: a
	};
}
function assembleFinalIR(e, t, n, r) {
	let i = e.length, a = [];
	for (let o = 0; o < i; o++) {
		let i = e[o], s = t[o];
		if (!s || s.length === 0) {
			a.push(i);
			continue;
		}
		let c = max(i.length, n + s.length), l = new Float32Array(c);
		for (let e = 0; e < min(n, i.length); e++) l[e] = i[e];
		let u = r, d = u > 1 ? u - 1 : 1;
		for (let e = 0; e < u; e++) {
			let t = n + e;
			if (t >= c) break;
			let r = .5 * (1 + cos$1(PI$1 * e / d)), a = .5 * (1 - cos$1(PI$1 * e / d)), o = t < i.length ? i[t] : 0, u = e < s.length ? s[e] : 0;
			l[t] = o * r + u * a;
		}
		for (let e = u; e < s.length; e++) {
			let t = n + e;
			if (t >= c) break;
			l[t] = s[e];
		}
		a.push(l);
	}
	return a;
}
function applyAmbisonicTail(e, t, n, r) {
	if (e.length === 0 || e[0].length === 0) return e;
	let i = e.length, a = e[0].length;
	for (let o = 0; o < a; o++) {
		let { tailSamples: a, tailStartSample: s } = synthesizeTail(t, n), c = Array(i);
		for (let t = 0; t < i; t++) c[t] = e[t][o];
		let l = assembleFinalIR(c, a, s, r);
		for (let t = 0; t < i; t++) e[t][o] = l[t];
	}
	return e;
}
//#endregion
//#region src/compute/binaural/binaural-decoder.ts
async function decodeBinaural(e, t) {
	let n = e.sampleRate;
	if (n !== t.sampleRate) throw Error(`Sample rate mismatch: ambisonic IR is ${n} Hz but HRTF filters are ${t.sampleRate} Hz`);
	let r = Math.min(e.numberOfChannels, t.channelCount);
	if (r === 0) throw Error("No channels to decode");
	let i = e.length + t.filterLength - 1, a = new OfflineAudioContext(2, i, n);
	for (let i = 0; i < r; i++) {
		let r = a.createBuffer(1, e.length, n);
		r.copyToChannel(e.getChannelData(i), 0);
		let o = a.createBufferSource();
		o.buffer = r;
		let s = a.createBuffer(2, t.filterLength, n);
		s.copyToChannel(new Float32Array(t.filtersLeft[i]), 0), s.copyToChannel(new Float32Array(t.filtersRight[i]), 1);
		let c = a.createConvolver();
		c.normalize = !1, c.buffer = s, o.connect(c), c.connect(a.destination), o.start(0);
	}
	return {
		buffer: await a.startRendering(),
		sampleRate: n
	};
}
function rotateAmbisonicIR(e, t, n, r) {
	if (t === 0 && n === 0 && r === 0) return e;
	let i = e.numberOfChannels, a = e.length, o = e.sampleRate;
	if (i < 4) throw Error("Ambisonic rotation requires at least 4 channels (first order)");
	let s = t * Math.PI / 180, c = n * Math.PI / 180, l = r * Math.PI / 180, u = Math.cos(s), d = Math.sin(s), f = Math.cos(c), p = Math.sin(c), m = Math.cos(l), h = Math.sin(l), g = u * m + d * p * h, _ = -u * h + d * p * m, v = d * f, y = f * h, b = f * m, x = -p, S = -d * m + u * p * h, w = d * h + u * p * m, E = u * f, D = new OfflineAudioContext(i, a, o).createBuffer(i, a, o);
	D.copyToChannel(e.getChannelData(0), 0);
	let O = e.getChannelData(1), j = e.getChannelData(2), M = e.getChannelData(3), N = new Float32Array(a), F = new Float32Array(a), I = new Float32Array(a);
	for (let e = 0; e < a; e++) {
		let t = O[e], n = j[e], r = M[e];
		N[e] = g * t + _ * n + v * r, F[e] = y * t + b * n + x * r, I[e] = S * t + w * n + E * r;
	}
	D.copyToChannel(N, 1), D.copyToChannel(F, 2), D.copyToChannel(I, 3);
	for (let t = 4; t < i; t++) D.copyToChannel(e.getChannelData(t), t);
	return D;
}
//#endregion
//#region src/compute/binaural/calculate-binaural.ts
async function calculateBinauralFromAmbisonic(e) {
	let { ambisonicImpulseResponse: t, order: n, hrtfSubjectId: r, headYaw: i, headPitch: a, headRoll: o } = e, s = t;
	(i !== 0 || a !== 0 || o !== 0) && (s = rotateAmbisonicIR(s, i, a, o));
	let c = await loadDecoderFilters(r, n);
	return (await decodeBinaural(s, c)).buffer;
}
//#endregion
//#region src/compute/beam-trace/impulse-response.ts
var FilterWorker = () => new Worker(new URL(
	/* @vite-ignore */
	"/assets/filter.worker-B2fYKvk6.js",
	"" + import.meta.url
));
function receiverGainForPath(e, t) {
	if (!e) return 1;
	let n = t.arrivalDirection;
	return e.getGain([
		n.x,
		n.y,
		n.z
	]);
}
async function calculateMonoImpulseResponse(e) {
	let { validPaths: t, frequencies: n, receiver: r, arrivalPressure: i, lateReverbTailEnabled: a, energyHistogram: o, tailCrossfadeTime: s, tailCrossfadeDuration: c, updateResult: l } = e;
	if (t.length === 0) throw Error("No paths calculated yet. Run calculate() first.");
	let u = audioEngine.sampleRate, d = Array(n.length).fill(100), f = t[t.length - 1].arrivalTime + .05, p = Math.floor(u * f) * 2, m = [];
	for (let e = 0; e < n.length; e++) m.push(new Float32Array(p));
	for (let e of t) {
		let t = Math.random() > .5 ? 1 : -1, a = i(d, e, receiverGainForPath(r, e)), o = Math.floor(e.arrivalTime * u);
		for (let e = 0; e < n.length; e++) o < m[e].length && (m[e][o] += a[e] * t);
	}
	let h = m;
	if (a && o) {
		let { tailSamples: e, tailStartSample: t } = synthesizeTail(extractDecayParameters(o, n, s, HISTOGRAM_BIN_WIDTH), u);
		h = assembleFinalIR(m, e, t, Math.floor(c * u));
	}
	let g = FilterWorker();
	return new Promise((e, t) => {
		g.postMessage({ samples: h }), g.onmessage = (n) => {
			let r = n.data.samples, i = new Float32Array(r[0].length >> 1), a = 0;
			for (let e = 0; e < r.length; e++) for (let t = 0; t < i.length; t++) i[t] += r[e][t], Math.abs(i[t]) > a && (a = Math.abs(i[t]));
			let o = normalize$1(i), s = audioEngine.createOfflineContext(1, i.length, u), c = audioEngine.createBufferSource(o, s);
			c.connect(s.destination), c.start(), audioEngine.renderContextAsync(s).then((t) => {
				l(t, u), e(t);
			}).catch(t).finally(() => g.terminate());
		}, g.onerror = (e) => {
			g.terminate(), t(e);
		};
	});
}
function updateImpulseResponseResult(e) {
	let { ir: t, sampleRate: n, sourceIDs: r, receiverIDs: i, impulseResponseResult: a, solverUuid: o } = e, s = useContainer.getState().containers, c = r.length > 0 && s[r[0]]?.name || "source", l = i.length > 0 && s[i[0]]?.name || "receiver", u = t.getChannelData(0), d = [], f = Math.max(1, Math.floor(u.length / 2e3));
	for (let e = 0; e < u.length; e += f) d.push({
		time: e / n,
		amplitude: u[e]
	});
	console.log(`BeamTraceSolver: Updating IR result with ${d.length} samples, duration: ${(u.length / n).toFixed(3)}s`);
	let p = {
		kind: ResultKind.ImpulseResponse,
		data: d,
		info: {
			sampleRate: n,
			sourceName: c,
			receiverName: l,
			sourceId: r[0] || "",
			receiverId: i[0] || ""
		},
		name: `IR: ${c} → ${l}`,
		uuid: a,
		from: o
	};
	emit("UPDATE_RESULT", {
		uuid: a,
		result: p
	});
}
async function calculateAmbisonicImpulseResponse(e) {
	let { validPaths: t, frequencies: n, receiver: r, arrivalPressure: i, lateReverbTailEnabled: a, energyHistogram: o, tailCrossfadeTime: s, tailCrossfadeDuration: c, order: l } = e;
	if (t.length === 0) throw Error("No paths calculated yet. Run calculate() first.");
	let u = audioEngine.sampleRate, d = Array(n.length).fill(100), f = t[t.length - 1].arrivalTime + .05;
	if (f <= 0) throw Error("Invalid impulse response duration");
	let p = Math.floor(u * f) * 2;
	if (p < 2) throw Error("Impulse response too short to process");
	let m = getAmbisonicChannelCount(l), h = [];
	for (let e = 0; e < n.length; e++) {
		h.push([]);
		for (let t = 0; t < m; t++) h[e].push(new Float32Array(p));
	}
	for (let e of t) {
		let t = Math.random() > .5 ? 1 : -1, a = i(d, e, receiverGainForPath(r, e)), o = Math.floor(e.arrivalTime * u);
		if (o >= p) continue;
		let s = /* @__PURE__ */ new Float32Array(1), c = e.arrivalDirection;
		for (let e = 0; e < n.length; e++) {
			s[0] = a[e] * t;
			let n = encodeBufferFromDirection(s, c.x, c.y, c.z, l, "threejs");
			for (let t = 0; t < m; t++) h[e][t][o] += n[t][0];
		}
	}
	a && o && applyAmbisonicTail(h, extractDecayParameters(o, n, s, HISTOGRAM_BIN_WIDTH), u, Math.floor(c * u));
	let g = async (e) => new Promise((t) => {
		let r = [];
		for (let t = 0; t < n.length; t++) r.push(h[t][e]);
		let i = FilterWorker();
		i.postMessage({ samples: r }), i.onmessage = (e) => {
			let n = e.data.samples, r = new Float32Array(n[0].length >> 1);
			for (let e = 0; e < n.length; e++) for (let t = 0; t < r.length; t++) r[t] += n[e][t];
			i.terminate(), t(r);
		};
	}), _ = await Promise.all(Array.from({ length: m }, (e, t) => g(t))), v = 0;
	for (let e of _) for (let t = 0; t < e.length; t++) Math.abs(e[t]) > v && (v = Math.abs(e[t]));
	if (v > 0) for (let e of _) for (let t = 0; t < e.length; t++) e[t] /= v;
	let y = _[0].length;
	if (y === 0) throw Error("Filtered signal has zero length");
	let b = audioEngine.createOfflineContext(m, y, u).createBuffer(m, y, u);
	for (let e = 0; e < m; e++) b.copyToChannel(new Float32Array(_[e]), e);
	return b;
}
async function calculateBinauralImpulseResponse(e) {
	return calculateBinauralFromAmbisonic(e);
}
function downloadOctaveBandIR(e) {
	let { validPaths: t, frequencies: n, receiver: r, arrivalPressure: i, filename: a } = e, o = e.sampleRate ?? audioEngine.sampleRate;
	if (t.length === 0) throw Error("No paths calculated yet. Run calculate() first.");
	let s = Array(n.length).fill(100), c = [...t].sort((e, t) => e.arrivalTime - t.arrivalTime), l = c[c.length - 1].arrivalTime + .05, u = Math.floor(o * l), d = [];
	for (let e = 0; e < n.length; e++) d.push(new Float32Array(u));
	for (let e of c) {
		let t = Math.random() > .5 ? 1 : -1, a = i(s, e, receiverGainForPath(r, e)), c = Math.floor(e.arrivalTime * o);
		for (let e = 0; e < n.length; e++) c < d[e].length && (d[e][c] += a[e] * t);
	}
	for (let e = 0; e < n.length; e++) {
		let t = wavAsBlob([normalize$1(d[e])], {
			sampleRate: o,
			bitDepth: 32
		});
		import_FileSaver_min.default.saveAs(t, `${n[e]}_${a}.wav`);
	}
}
//#endregion
//#region src/compute/beam-trace/results.ts
function buildEnergyHistogram(e) {
	let { validPaths: t, frequencies: n, receiver: r, arrivalPressure: i } = e, a = n.length, o = [];
	for (let e = 0; e < a; e++) o.push(new Float32Array(HISTOGRAM_NUM_BINS));
	let s = Array(a).fill(100);
	for (let e of t) {
		let t = Math.floor(e.arrivalTime / HISTOGRAM_BIN_WIDTH);
		if (t < 0 || t >= 1e4) continue;
		let n = i(s, e, receiverGainForPath(r, e));
		for (let e = 0; e < a; e++) o[e][t] += n[e] * n[e];
	}
	return o;
}
function calculateLevelTimeProgression(e) {
	let { validPaths: t, levelTimeProgressionId: n, plotFrequency: r, maxReflectionOrder: i, solverUuid: a, receiver: o, arrivalPressure: s } = e;
	if (t.length === 0) return;
	let c = [...t].sort((e, t) => e.arrivalTime - t.arrivalTime), l = { ...useResult.getState().results[n] };
	l.data = [], l.info = {
		...l.info,
		maxOrder: i,
		frequency: [r]
	};
	for (let e = 0; e < c.length; e++) {
		let t = c[e], n = receiverGainForPath(o, t), r = s(l.info.initialSPL, t, n), i = P2Lp(r);
		l.data.push({
			time: t.arrivalTime,
			pressure: i,
			arrival: e + 1,
			order: t.order,
			uuid: `${a}-path-${e}`
		});
	}
	emit("UPDATE_RESULT", {
		uuid: n,
		result: l
	});
}
function calculateResponseByIntensity(e) {
	let { validPaths: t, frequencies: n, sourceId: r, receiverId: i, receiver: a, arrivalPressure: o } = e, s = Array(n.length).fill(100), c = [...t].sort((e, t) => e.arrivalTime - t.arrivalTime), l = [];
	for (let e of c) {
		let t = o(s, e, receiverGainForPath(a, e));
		l.push({
			time: e.arrivalTime,
			bounces: e.order,
			level: P2Lp(t)
		});
	}
	return resampleResponseByIntensity({ [i]: { [r]: {
		freqs: n,
		response: l
	} } }, 256);
}
//#endregion
//#region src/compute/shared/quick-estimate-types.ts
var QUICK_ESTIMATE_MAX_ORDER = 1e3, RT60_DECAY_RATIO = 1e6;
//#endregion
//#region src/compute/shared/quick-estimate.ts
function quickEstimateStep(e, t, n, r, i, a, o = QUICK_ESTIMATE_MAX_ORDER) {
	let s = soundSpeed(a), c = Array(i.length).fill(0), l = n.clone(), u, d, f, p;
	do
		u = Math.random() * 2 - 1, d = Math.random() * 2 - 1, f = Math.random() * 2 - 1, p = u * u + d * d + f * f;
	while (p > 1 || p < 1e-6);
	let m = new THREE.Vector3(u, d, f).normalize(), h = 0, g = Array(i.length).fill(r), _ = 0, v = !1, y = 0;
	airAttenuation(i, a);
	let b = {};
	for (; !v && _ < o;) {
		e.ray.set(l, m);
		let n = e.intersectObjects(t, !0);
		if (n.length > 0) {
			h = m.clone().multiplyScalar(-1).angleTo(n[0].face.normal), y += n[0].distance;
			let e = n[0].object.parent;
			for (let t = 0; t < i.length; t++) {
				let n = i[t], a = 1;
				e.kind === "surface" && (a = e.reflectionFunction(n, h)), g[t] *= a;
				let o = r / g[t] > RT60_DECAY_RATIO;
				o && (c[t] = y / s), v ||= o;
			}
			n[0].object.parent instanceof Surface && (n[0].object.parent.numHits += 1);
			let t = n[0].face.normal.normalize();
			m.sub(t.clone().multiplyScalar(m.dot(t)).multiplyScalar(2)).normalize(), l.copy(n[0].point), b = n[0];
		}
		_ += 1;
	}
	return {
		distance: y,
		rt60s: c,
		angle: h,
		direction: m,
		lastIntersection: b
	};
}
//#endregion
//#region src/compute/beam-trace/quick-estimate.ts
function startQuickEstimate(e, t, n = 500) {
	if (e._quickEstimateInterval !== null && (window.clearInterval(e._quickEstimateInterval), e._quickEstimateInterval = null), !t || !e.room) return;
	let r = [];
	if (e.room.surfaces.traverse((e) => {
		e.isMesh && r.push(e);
	}), r.length === 0) return;
	e.quickEstimateResults = [], e.estimatedT30 = null;
	let i = 0, a = 10;
	e._quickEstimateInterval = window.setInterval(() => {
		for (let a = 0; a < 10 && i < n; a++, i++) e.quickEstimateResults.push(quickEstimateStep(e._raycaster, r, t.position, t.initialIntensity, e.frequencies, e.temperature));
		if (i >= n) {
			window.clearInterval(e._quickEstimateInterval), e._quickEstimateInterval = null;
			let t = e.frequencies.length, n = Array(t).fill(0), r = Array(t).fill(0);
			for (let i of e.quickEstimateResults) for (let e = 0; e < t; e++) i.rt60s[e] > 0 && (n[e] += i.rt60s[e], r[e]++);
			for (let e = 0; e < t; e++) n[e] = r[e] > 0 ? n[e] / r[e] : 0;
			e.estimatedT30 = n, emit("BEAMTRACE_QUICK_ESTIMATE_COMPLETE", e.uuid);
		}
	}, 5);
}
//#endregion
//#region src/compute/beam-trace/events.ts
function registerBeamTraceEvents(e) {
	on("BEAMTRACE_SET_PROPERTY", setSolverProperty), on("REMOVE_BEAMTRACE", removeSolver), on("ADD_BEAMTRACE", addSolver(e)), on("BEAMTRACE_CALCULATE", (e) => {
		useSolver.getState().solvers[e].calculate(), setTimeout(() => emit("BEAMTRACE_CALCULATE_COMPLETE", e), 0);
	}), on("BEAMTRACE_RESET", (e) => {
		useSolver.getState().solvers[e].reset();
	}), on("BEAMTRACE_PLAY_IR", (e) => {
		useSolver.getState().solvers[e].playImpulseResponse().catch((e) => {
			window.alert(e.message || "Failed to play impulse response");
		});
	}), on("BEAMTRACE_DOWNLOAD_IR", (e) => {
		let t = useSolver.getState().solvers[e], n = useContainer.getState().containers, r = `ir-beamtrace-${t.sourceIDs.length > 0 && n[t.sourceIDs[0]]?.name || "source"}-${t.receiverIDs.length > 0 && n[t.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
		t.downloadImpulseResponse(r).catch((e) => {
			window.alert(e.message || "Failed to download impulse response");
		});
	}), on("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid: e, order: t }) => {
		let n = useSolver.getState().solvers[e], r = useContainer.getState().containers, i = `ir-beamtrace-ambi-${n.sourceIDs.length > 0 && r[n.sourceIDs[0]]?.name || "source"}-${n.receiverIDs.length > 0 && r[n.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
		n.downloadAmbisonicImpulseResponse(i, t).catch((e) => {
			window.alert(e.message || "Failed to download ambisonic impulse response");
		});
	}), on("BEAMTRACE_PLAY_BINAURAL_IR", ({ uuid: e, order: t }) => {
		useSolver.getState().solvers[e].playBinauralImpulseResponse(t).catch((e) => {
			window.alert(e.message || "Failed to play binaural impulse response");
		});
	}), on("BEAMTRACE_DOWNLOAD_BINAURAL_IR", ({ uuid: e, order: t }) => {
		let n = useSolver.getState().solvers[e], r = useContainer.getState().containers, i = `ir-beamtrace-${n.sourceIDs.length > 0 && r[n.sourceIDs[0]]?.name || "source"}-${n.receiverIDs.length > 0 && r[n.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
		n.downloadBinauralImpulseResponse(i, t).catch((e) => {
			window.alert(e.message || "Failed to download binaural impulse response");
		});
	}), on("BEAMTRACE_DOWNLOAD_OCTAVE_IR", (e) => {
		let t = useSolver.getState().solvers[e], n = useContainer.getState().containers, r = `ir-beamtrace-${t.sourceIDs.length > 0 && n[t.sourceIDs[0]]?.name || "source"}-${t.receiverIDs.length > 0 && n[t.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
		try {
			t.downloadOctaveBandIR(r);
		} catch (e) {
			window.alert(e.message || "Failed to download octave-band impulse responses");
		}
	}), on("BEAMTRACE_QUICK_ESTIMATE", (e) => {
		useSolver.getState().solvers[e].startQuickEstimate();
	}), on("SHOULD_ADD_BEAMTRACE", () => {
		emit("ADD_BEAMTRACE", void 0);
	});
}
//#endregion
//#region src/common/dir-angle-conversions.ts
function threejsdir2cramangle(e, t, n) {
	let r = Math.sqrt(e * e + t * t + n * n);
	if (r < 1e-10) return [0, 0];
	let i = Math.acos(Math.min(1, Math.max(-1, t / r))), a = Math.atan2(e, n), o = 180 / Math.PI * i;
	return [((360 - 180 / Math.PI * a) % 360 + 360) % 360, o];
}
function worldDirToCramAngles(e, t) {
	if (e.lengthSq() < 1e-20) return [0, 0];
	let n = e.clone().normalize().applyQuaternion(t.clone().invert()), [r, i] = threejsdir2cramangle(n.x, n.y, n.z);
	return [r, i];
}
//#endregion
//#region src/compute/beam-trace/arrival-pressure.ts
function directivityBandEnergy(e, t, n, r, i) {
	let a = Array(i.length).fill(1);
	if (r.lengthSq() < 1e-20) return a;
	let [o, s] = worldDirToCramAngles(r, n);
	for (let n = 0; n < i.length; n++) try {
		let r = e.getPressureAtPosition(0, i[n], o, s), c = t[n];
		typeof r == "number" && typeof c == "number" && c > 0 && (a[n] = (r / c) ** 2);
	} catch {}
	return a;
}
function calculateArrivalPressure(e, t, n) {
	let { frequencies: r, temperature: i, receiverGain: a = 1, source: o = null, polygonToSurface: s } = n;
	if (t.bandEnergy) {
		let n = P2I(Lp2P(e)), i = t.points.length - 1, o = i >= 1 ? t.points[i].distanceTo(t.points[i - 1]) : t.length, s = spreadingFactor(o), c = Array(r.length);
		for (let e = 0; e < r.length; e++) {
			let r = n[e] * t.bandEnergy[e] * s;
			c[e] = I2P([r])[0] * a;
		}
		return c;
	}
	let c = spreadingFactor(t.length), l = P2I(Lp2P(e));
	for (let e = 0; e < l.length; e++) l[e] *= c;
	let u = t.points.length - 1;
	if (u >= 1 && o?.directivityHandler) {
		let e = t.points[u], n = t.points[u - 1], i = new THREE.Vector3().subVectors(n, e), a = Array(r.length);
		for (let e = 0; e < r.length; e++) a[e] = o.directivityHandler.getPressureAtPosition(0, r[e], 0, 0);
		let s = directivityBandEnergy(o.directivityHandler, a, o.quaternion, i, r);
		for (let e = 0; e < r.length; e++) l[e] *= s[e];
	}
	let d = 0;
	t.polygonIds.forEach((e, n) => {
		if (e === null) return;
		let i = s?.get(e);
		if (!i) {
			d++;
			return;
		}
		let a = 0;
		if (t.reflections && d < t.reflections.length) a = t.reflections[d].incidenceAngle;
		else if (n > 0 && n < t.points.length - 1) {
			let e = new THREE.Vector3().subVectors(t.points[n + 1], t.points[n]).normalize(), r = new THREE.Vector3().subVectors(t.points[n - 1], t.points[n]).normalize(), i = Math.min(1, Math.max(-1, e.dot(r)));
			a = Math.acos(i) / 2;
		}
		d++;
		for (let e = 0; e < r.length; e++) {
			let t = Math.abs(i.reflectionFunction(r[e], a));
			l[e] *= t;
		}
	});
	let f = P2Lp(I2P(l)), p = airAttenuation(r, i);
	for (let e = 0; e < r.length; e++) f[e] -= p[e] * t.length;
	let m = Lp2P(f);
	if (a !== 1) for (let e = 0; e < m.length; e++) m[e] *= a;
	return m;
}
//#endregion
//#region src/common/arrival-direction.ts
function lookingBackArrivalDirection(e, t) {
	let n = t.x - e.x, r = t.y - e.y, i = t.z - e.z, a = Math.hypot(n, r, i);
	return a < 1e-10 ? [
		0,
		0,
		1
	] : [
		n / a,
		r / a,
		i / a
	];
}
//#endregion
//#region src/compute/beam-trace/paths.ts
function convertPath(e, t, n) {
	let r = e.map((e) => new THREE.Vector3(e.position[0], e.position[1], e.position[2])), i = computePathLength(e), a = computeArrivalTime(e, n), o = getPathReflectionOrder(e), s = e.map((e) => e.polygonId), c;
	if (r.length >= 2) {
		let [e, t, n] = lookingBackArrivalDirection(r[0], r[1]);
		c = new THREE.Vector3(e, t, n);
	} else c = new THREE.Vector3(0, 0, 1);
	let l = t?.reflections.map((e) => ({
		polygonId: e.polygonId,
		hitPoint: new THREE.Vector3(e.hitPoint[0], e.hitPoint[1], e.hitPoint[2]),
		incidenceAngle: e.incidenceAngle,
		surfaceNormal: new THREE.Vector3(e.surfaceNormal[0], e.surfaceNormal[1], e.surfaceNormal[2]),
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
function beamTreeSignature(e) {
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
function surfaceToPolygons(e) {
	let t = [], n = e.geometry, r = n.getAttribute("position");
	if (!r) return t;
	e.updateMatrixWorld(!0);
	let i = e.matrixWorld, a = n.getIndex(), o = r.array, s = (e, n, r) => {
		let a = new THREE.Vector3(o[e * 3], o[e * 3 + 1], o[e * 3 + 2]).applyMatrix4(i), s = new THREE.Vector3(o[n * 3], o[n * 3 + 1], o[n * 3 + 2]).applyMatrix4(i), c = new THREE.Vector3(o[r * 3], o[r * 3 + 1], o[r * 3 + 2]).applyMatrix4(i), l = [
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
		t.push(Polygon3D.create(l));
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
function extractPolygons(e) {
	let t = [], n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
	return e && e.allSurfaces.forEach((e) => {
		let i = surfaceToPolygons(e), a = t.length;
		i.forEach((n, i) => {
			r.set(a + i, e), t.push(n);
		}), n.set(e.uuid, i.map((e, t) => a + t));
	}), {
		polygons: t,
		surfaceToPolygonIndex: n,
		polygonToSurface: r
	};
}
function currentTreeSignature(e) {
	let { source: t, room: n, roomID: r, maxOrder: i } = e;
	if (!t || !n) return null;
	let a = n.allSurfaces, o = [];
	for (let e of a) {
		e.updateMatrixWorld(!0);
		let t = e.matrixWorld.elements;
		for (let e = 0; e < 16; e++) o.push(t[e]);
	}
	return beamTreeSignature({
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
//#region src/compute/shared/diffraction/edge-graph.ts
function hashPointKeys(e, t, n, r) {
	let i = e / r, a = t / r, o = n / r, s = Math.floor(i), c = Math.floor(a), l = Math.floor(o), u = [`${s},${c},${l}`], d = [
		0,
		-1,
		1
	];
	for (let e of d) for (let t of d) for (let n of d) {
		if (e === 0 && t === 0 && n === 0) continue;
		let r = s + e, d = c + t, f = l + n;
		Math.abs(i - (r + .5)) < 1 && Math.abs(a - (d + .5)) < 1 && Math.abs(o - (f + .5)) < 1 && u.push(`${r},${d},${f}`);
	}
	return u;
}
function edgeKey(e, t) {
	return e < t ? `${e}|${t}` : `${t}|${e}`;
}
function buildEdgeGraph(e, t = 1e-4) {
	let n = numbersEqualWithinTolerence(t), r = t * 10, i = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = t.edgeLoop;
		if (!e || e.length < 3) continue;
		let n = [
			t.normal.x,
			t.normal.y,
			t.normal.z
		];
		for (let a = 0; a < e.length; a++) {
			let o = e[a], s = e[(a + 1) % e.length], c = {
				start: [
					o.x,
					o.y,
					o.z
				],
				end: [
					s.x,
					s.y,
					s.z
				],
				surfaceId: t.uuid,
				normal: n
			}, l = hashPointKeys(o.x, o.y, o.z, r), u = hashPointKeys(s.x, s.y, s.z, r), d = /* @__PURE__ */ new Set();
			for (let e of l) for (let t of u) {
				let n = edgeKey(e, t);
				d.has(n) || (d.add(n), i.has(n) ? i.get(n).push(c) : i.set(n, [c]));
			}
		}
	}
	let a = [];
	for (let [, e] of i) {
		if (e.length !== 2 || e[0].surfaceId === e[1].surfaceId) continue;
		let r = e[0], i = e[1];
		if (!(n(r.start[0], i.start[0]) && n(r.start[1], i.start[1]) && n(r.start[2], i.start[2]) && n(r.end[0], i.end[0]) && n(r.end[1], i.end[1]) && n(r.end[2], i.end[2]) || n(r.start[0], i.end[0]) && n(r.start[1], i.end[1]) && n(r.start[2], i.end[2]) && n(r.end[0], i.start[0]) && n(r.end[1], i.start[1]) && n(r.end[2], i.start[2]))) continue;
		let o = r.end[0] - r.start[0], s = r.end[1] - r.start[1], c = r.end[2] - r.start[2], l = Math.sqrt(o * o + s * s + c * c);
		if (l < t) continue;
		let u = [
			o / l,
			s / l,
			c / l
		], d = r.normal, f = i.normal, p = d[0] * f[0] + d[1] * f[1] + d[2] * f[2], m = Math.acos(Math.max(-1, Math.min(1, p)));
		if (m < .01) continue;
		let h = 2 * Math.PI - m, g = h / Math.PI;
		g <= 1 || a.push({
			start: r.start,
			end: r.end,
			direction: u,
			length: l,
			normal0: d,
			normal1: f,
			surface0Id: r.surfaceId,
			surface1Id: i.surfaceId,
			wedgeAngle: h,
			n: g
		});
	}
	return { edges: a };
}
//#endregion
//#region src/compute/shared/diffraction/utd-coefficient.ts
var { PI, sqrt, abs, cos, sin, atan2 } = Math;
function fresnelTransition(e) {
	return e < 0 && (e = 0), 1 - Math.exp(-sqrt(PI * e));
}
function computeWedgeAngles(e, t, n, r, i) {
	let a = e, o = [
		r[0] - n[0],
		r[1] - n[1],
		r[2] - n[2]
	], s = o[0] * a[0] + o[1] * a[1] + o[2] * a[2], c = [
		o[0] - s * a[0],
		o[1] - s * a[1],
		o[2] - s * a[2]
	], l = sqrt(c[0] ** 2 + c[1] ** 2 + c[2] ** 2), u = [
		i[0] - n[0],
		i[1] - n[1],
		i[2] - n[2]
	], d = u[0] * a[0] + u[1] * a[1] + u[2] * a[2], f = [
		u[0] - d * a[0],
		u[1] - d * a[1],
		u[2] - d * a[2]
	], p = sqrt(f[0] ** 2 + f[1] ** 2 + f[2] ** 2);
	if (l < 1e-10 || p < 1e-10) return {
		phiSource: PI,
		phiReceiver: PI
	};
	let m = [
		c[0] / l,
		c[1] / l,
		c[2] / l
	], h = [
		f[0] / p,
		f[1] / p,
		f[2] / p
	], g = [
		-t[0],
		-t[1],
		-t[2]
	], _ = [
		a[1] * g[2] - a[2] * g[1],
		a[2] * g[0] - a[0] * g[2],
		a[0] * g[1] - a[1] * g[0]
	], v = atan2(m[0] * _[0] + m[1] * _[1] + m[2] * _[2], m[0] * g[0] + m[1] * g[1] + m[2] * g[2]), y = atan2(h[0] * _[0] + h[1] * _[1] + h[2] * _[2], h[0] * g[0] + h[1] * g[1] + h[2] * g[2]), b = (e) => {
		let t = e;
		for (; t < 0;) t += 2 * PI;
		return t;
	};
	return {
		phiSource: b(v),
		phiReceiver: b(y)
	};
}
function cotTerm(e, t, n, r, i) {
	let a = (PI + t * (n + r * i)) / (2 * e), o = sin(a);
	return abs(o) < 1e-12 ? 0 : cos(a) / o;
}
function utdDiffractionCoefficient(e, t, n, r, i, a, o) {
	if (n < 1e-10 || r < 1e-10) return 0;
	let s = 2 * PI * e / o;
	if (s < 1e-10) return 0;
	let c = n * r / (n + r), l = (e, n, r, i) => {
		let a = n + r * i, o = Math.round((a + PI) / (2 * PI * t)), s = Math.round((a - PI) / (2 * PI * t)), c = 2 * cos((2 * PI * t * o - a) / 2) ** 2, l = 2 * cos((2 * PI * t * s - a) / 2) ** 2;
		return e > 0 ? c : l;
	}, u = 0, d = l(1, a, -1, i), f = cotTerm(t, 1, a, -1, i), p = fresnelTransition(s * c * d), m = l(-1, a, -1, i), h = cotTerm(t, -1, a, -1, i), g = fresnelTransition(s * c * m), _ = l(1, a, 1, i), v = cotTerm(t, 1, a, 1, i), y = fresnelTransition(s * c * _), b = l(-1, a, 1, i), x = cotTerm(t, -1, a, 1, i), S = fresnelTransition(s * c * b), w = 1 / (2 * t * sqrt(2 * PI * s)), E = f * p + h * g + v * y + x * S;
	u = w * w * E * E;
	let D = n, O = D / (r * (r + D));
	return u * O;
}
//#endregion
//#region src/compute/shared/diffraction/find-diffraction-paths.ts
function findDiffractionPoint(e, t, n, r) {
	let i = t[0] - e[0], a = t[1] - e[1], o = t[2] - e[2], s = i * i + a * a + o * o;
	if (s < 1e-20) return [...e];
	let c = Math.sqrt(s), l = [
		i / c,
		a / c,
		o / c
	], u = (t) => {
		let s = e[0] + t * i, c = e[1] + t * a, u = e[2] + t * o, d = Math.sqrt((s - n[0]) ** 2 + (c - n[1]) ** 2 + (u - n[2]) ** 2), f = Math.sqrt((s - r[0]) ** 2 + (c - r[1]) ** 2 + (u - r[2]) ** 2);
		return d < 1e-10 || f < 1e-10 ? 0 : ((s - n[0]) * l[0] + (c - n[1]) * l[1] + (u - n[2]) * l[2]) / d + ((s - r[0]) * l[0] + (c - r[1]) * l[1] + (u - r[2]) * l[2]) / f;
	}, d = 0, f = 1, p = u(d);
	if (p * u(f) > 0) {
		let t = (t) => {
			let s = e[0] + t * i, c = e[1] + t * a, l = e[2] + t * o;
			return Math.sqrt((s - n[0]) ** 2 + (c - n[1]) ** 2 + (l - n[2]) ** 2) + Math.sqrt((s - r[0]) ** 2 + (c - r[1]) ** 2 + (l - r[2]) ** 2);
		}, s = t(0) < t(1) ? 0 : 1;
		return [
			e[0] + s * i,
			e[1] + s * a,
			e[2] + s * o
		];
	}
	for (let e = 0; e < 50; e++) {
		let e = (d + f) / 2, t = u(e);
		if (Math.abs(t) < 1e-12) break;
		p * t < 0 ? f = e : d = e;
	}
	let m = (d + f) / 2;
	return [
		e[0] + m * i,
		e[1] + m * a,
		e[2] + m * o
	];
}
function hasLineOfSight(e, t, n, r, i = .01) {
	let a = t[0] - e[0], o = t[1] - e[1], s = t[2] - e[2], c = Math.sqrt(a * a + o * o + s * s);
	if (c < i) return !0;
	let l = new THREE.Vector3(a / c, o / c, s / c), u = new THREE.Vector3(e[0] + l.x * i, e[1] + l.y * i, e[2] + l.z * i);
	n.ray.set(u, l), n.far = c - 2 * i, n.near = 0;
	let d = n.intersectObjects(r, !0);
	return n.far = Infinity, d.length === 0;
}
function findDiffractionPaths(e, t, n, r, i, a, o, s) {
	let c = [], l = airAttenuation(r, a);
	for (let a of e.edges) for (let [e, u] of t) for (let [t, d] of n) {
		let n = findDiffractionPoint(a.start, a.end, u, d), f = Math.sqrt((n[0] - u[0]) ** 2 + (n[1] - u[1]) ** 2 + (n[2] - u[2]) ** 2), p = Math.sqrt((n[0] - d[0]) ** 2 + (n[1] - d[1]) ** 2 + (n[2] - d[2]) ** 2);
		if (f < 1e-6 || p < 1e-6 || !hasLineOfSight(u, n, o, s) || !hasLineOfSight(n, d, o, s)) continue;
		let { phiSource: m, phiReceiver: h } = computeWedgeAngles(a.direction, a.normal0, n, u, d), g = f + p, _ = g / i, v = Array(r.length);
		for (let e = 0; e < r.length; e++) {
			let t = utdDiffractionCoefficient(r[e], a.n, f, p, m, h, i), n = l[e] * g;
			t *= 10 ** (-n / 10), v[e] = t;
		}
		c.push({
			edge: a,
			diffractionPoint: n,
			totalDistance: g,
			time: _,
			bandEnergy: v,
			sourceId: e,
			receiverId: t
		});
	}
	return c;
}
//#endregion
//#region src/compute/beam-trace/diffraction.ts
function computeDiffractionPaths(e) {
	let { room: t, sourceId: n, receiverId: r, frequencies: i, speedOfSound: a, temperature: o, containers: s, raycaster: c } = e, l = buildEdgeGraph(t.allSurfaces);
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
	let g = findDiffractionPaths(l, u, p, i, a, o, c, h), _ = [];
	for (let e of g) {
		let t = d.get(e.sourceId);
		if (t) {
			let n = u.get(e.sourceId), r = new THREE.Vector3(e.diffractionPoint[0] - n[0], e.diffractionPoint[1] - n[1], e.diffractionPoint[2] - n[2]), a = directivityBandEnergy(t.handler, t.refPressures, t.quaternion, r, i);
			for (let t = 0; t < i.length; t++) e.bandEnergy[t] *= a[t];
		}
		let n = p.get(e.receiverId), r = {
			x: e.diffractionPoint[0],
			y: e.diffractionPoint[1],
			z: e.diffractionPoint[2]
		}, [a, o, s] = lookingBackArrivalDirection({
			x: n[0],
			y: n[1],
			z: n[2]
		}, r), c = new THREE.Vector3(a, o, s), l = u.get(e.sourceId), f = new THREE.Vector3(n[0], n[1], n[2]), m = new THREE.Vector3(e.diffractionPoint[0], e.diffractionPoint[1], e.diffractionPoint[2]), h = new THREE.Vector3(l[0], l[1], l[2]);
		_.push({
			points: [
				f,
				m,
				h
			],
			order: 0,
			length: e.totalDistance,
			arrivalTime: e.time,
			polygonIds: [
				null,
				null,
				null
			],
			arrivalDirection: c,
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
var colorScale = chroma.scale(["#ff8a0b", "#000080"]).mode("lch");
function getOrderColor(e, t) {
	let n = t + 1, r = colorScale.colors(n), i = Math.min(e, n - 1), a = chroma(r[i]);
	return parseInt(a.hex().slice(1), 16);
}
function createHighlightLine() {
	let e = new MeshLine();
	e.setPoints(/* @__PURE__ */ new Float32Array());
	let t = new MeshLineMaterial({
		lineWidth: .1,
		color: 16711680,
		sizeAttenuation: 1
	});
	return new THREE.Mesh(e, t);
}
function disposeObject3D(e) {
	if (e instanceof THREE.Mesh || e instanceof THREE.Line) {
		e.geometry?.dispose();
		let t = e.material;
		if (Array.isArray(t)) for (let e of t) e instanceof THREE.Material && e.dispose();
		else t instanceof THREE.Material && t.dispose();
	}
}
function clearGroup(e) {
	for (; e.children.length > 0;) {
		let t = e.children[0];
		e.remove(t), disposeObject3D(t);
	}
}
function clearVisualization(e) {
	renderer.markup.clearLines(), renderer.markup.clearPoints(), clearGroup(e);
}
function beamHasValidPath(e, t) {
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
function drawPaths(e) {
	let { validPaths: t, visibleOrders: n, maxReflectionOrder: r, virtualSourcesGroup: i, lastMetrics: a } = e, o = t.filter((e) => n.includes(e.order));
	o.forEach((e) => {
		let t = getOrderColor(e.order, r), n = [
			(t >> 16 & 255) / 255,
			(t >> 8 & 255) / 255,
			(t & 255) / 255
		];
		for (let t = 0; t < e.points.length - 1; t++) {
			let r = e.points[t], i = e.points[t + 1];
			renderer.markup.addLine([
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
			let t = e.points[1], n = getOrderColor(e.order, r), a = new THREE.SphereGeometry(.06, 8, 8), o = new THREE.MeshBasicMaterial({ color: n }), s = new THREE.Mesh(a, o);
			s.position.copy(t), i.add(s);
		}
	});
	let s = renderer.markup.getUsageStats();
	a && (a.bufferUsage = s), s.overflowWarning ? console.error(`⚠️ Path buffer overflow! Lines: ${s.linesUsed}/${s.linesCapacity}. Reduce reflection order.`) : s.linesPercent > 80 && console.warn(`Buffer usage high: Lines ${s.linesPercent.toFixed(1)}%`);
}
function drawBeams(e) {
	if (!e.btSolver) return;
	clearGroup(e.virtualSourcesGroup), e.virtualSourceMap.clear(), e.selectedVirtualSource = null;
	let t = e.validPaths;
	e.btSolver.getBeamsForVisualization(e.maxReflectionOrder).forEach((n) => {
		if (!e.visibleOrders.includes(n.reflectionOrder)) return;
		let r = beamHasValidPath(n, t);
		if (!r && !e.showAllBeams) return;
		let i = Math.max(.05, .1 - n.reflectionOrder * .01), a = getOrderColor(n.reflectionOrder, e.maxReflectionOrder), o = a;
		if (!r) {
			let e = (a >> 16 & 255) * .4 + 76.8, t = (a >> 8 & 255) * .4 + 76.8, n = (a & 255) * .4 + 76.8;
			o = Math.round(e) << 16 | Math.round(t) << 8 | Math.round(n);
		}
		let s = new THREE.Vector3(n.virtualSource[0], n.virtualSource[1], n.virtualSource[2]), c = new THREE.SphereGeometry(i, 12, 12), l = new THREE.MeshStandardMaterial({
			color: o,
			transparent: !r,
			opacity: r ? 1 : .4,
			roughness: .6,
			metalness: .1
		}), u = new THREE.Mesh(c, l);
		u.position.copy(s), e.virtualSourcesGroup.add(u), r && e.virtualSourceMap.set(u, {
			...n,
			polygonPath: n.polygonPath || []
		});
		let d = n.apertureVertices;
		if (d && d.length >= 3) {
			let t = d.map((e) => new THREE.Vector3(e[0], e[1], e[2])), n = new THREE.BufferGeometry(), i = new Float32Array(t.length * 3);
			for (let e = 0; e < t.length; e++) i[e * 3] = t[e].x, i[e * 3 + 1] = t[e].y, i[e * 3 + 2] = t[e].z;
			n.setAttribute("position", new THREE.BufferAttribute(i, 3));
			let a = [];
			for (let e = 1; e < t.length - 1; e++) a.push(0, e, e + 1);
			n.setIndex(a), n.computeVertexNormals();
			let c = new THREE.MeshBasicMaterial({
				color: o,
				side: THREE.DoubleSide,
				transparent: !0,
				opacity: r ? .2 : .08,
				depthWrite: !1
			});
			e.virtualSourcesGroup.add(new THREE.Mesh(n, c));
			let l = new THREE.BufferGeometry().setFromPoints(t), u = new THREE.LineBasicMaterial({
				color: o,
				transparent: !0,
				opacity: r ? .5 : .2
			});
			e.virtualSourcesGroup.add(new THREE.LineLoop(l, u));
			let f = [];
			for (let e of t) f.push(s.clone(), e);
			let p = new THREE.BufferGeometry().setFromPoints(f), m = new THREE.LineBasicMaterial({
				color: o,
				transparent: !0,
				opacity: r ? .35 : .12
			});
			e.virtualSourcesGroup.add(new THREE.LineSegments(p, m));
		}
	}), renderer.needsToRender = !0;
}
function highlightVirtualSourcePath(e) {
	let { beam: t, validPaths: n, maxReflectionOrder: r, receiver: i, selectedPath: a, selectedBeamsGroup: o } = e;
	a.geometry.setPoints(/* @__PURE__ */ new Float32Array()), clearGroup(o);
	let s = getOrderColor(t.reflectionOrder, r), c = new THREE.Vector3(t.virtualSource[0], t.virtualSource[1], t.virtualSource[2]);
	if (!i) return;
	let l = i.position.clone(), u = new THREE.LineDashedMaterial({
		color: s,
		transparent: !0,
		opacity: .4,
		dashSize: .3,
		gapSize: .15
	}), d = new THREE.BufferGeometry().setFromPoints([c, l]), f = new THREE.Line(d, u);
	f.computeLineDistances(), o.add(f);
	let p = new THREE.SphereGeometry(.18, 16, 16), m = new THREE.MeshBasicMaterial({
		color: s,
		transparent: !0,
		opacity: .4
	}), h = new THREE.Mesh(p, m);
	h.position.copy(c), o.add(h);
	let g = t.polygonPath;
	if (!g || g.length === 0) return;
	let _ = t.reflectionOrder;
	for (let e of n) {
		if (e.order !== _) continue;
		let t = !0;
		for (let n = 0; n < g.length; n++) {
			let r = _ - n;
			if (e.polygonIds[r] !== g[n]) {
				t = !1;
				break;
			}
		}
		if (t) {
			let t = e.points, n = e.order;
			for (let e = 0; e < t.length - 1; e++) {
				let i = t[e], a = t[e + 1], s = i.distanceTo(a), c = new THREE.Vector3().addVectors(i, a).multiplyScalar(.5), l = n - e, u = l === 0 ? 16777215 : getOrderColor(l, r), d = new THREE.CylinderGeometry(.025, .025, s, 8), f = new THREE.MeshBasicMaterial({ color: u }), p = new THREE.Mesh(d, f);
				p.position.copy(c);
				let m = new THREE.Vector3().subVectors(a, i).normalize(), h = new THREE.Quaternion();
				h.setFromUnitVectors(new THREE.Vector3(0, 1, 0), m), p.setRotationFromQuaternion(h), o.add(p);
			}
			for (let t = 1; t < e.points.length - 1; t++) {
				let i = getOrderColor(n - t + 1, r), a = new THREE.SphereGeometry(.08, 12, 12), s = new THREE.MeshBasicMaterial({ color: i }), c = new THREE.Mesh(a, s);
				c.position.copy(e.points[t]), o.add(c);
			}
			renderer.needsToRender = !0;
			return;
		}
	}
	renderer.needsToRender = !0;
}
function highlightPathByIndex(e) {
	let { pathIndex: t, validPaths: n, maxReflectionOrder: r, btSolver: i, receiver: a, selectedPath: o, selectedBeamsGroup: s } = e, c = [...n].sort((e, t) => e.arrivalTime - t.arrivalTime);
	if (t < 0 || t >= c.length) {
		console.warn("BeamTraceSolver: Path index out of bounds:", t);
		return;
	}
	let l = c[t];
	o.geometry.setPoints(/* @__PURE__ */ new Float32Array()), clearGroup(s);
	let u = getOrderColor(l.order, r), d = new THREE.LineBasicMaterial({
		color: u,
		linewidth: 2,
		transparent: !1
	});
	for (let e = 0; e < l.points.length - 1; e++) {
		let t = new THREE.BufferGeometry().setFromPoints([l.points[e], l.points[e + 1]]);
		s.add(new THREE.Line(t, d));
	}
	if (i && a) {
		let e = i.getBeamsForVisualization(r), t = l.polygonIds[l.order];
		if (t !== null) {
			let n = e.find((e) => e.polygonId === t && e.reflectionOrder === l.order);
			if (n) {
				let e = new THREE.LineDashedMaterial({
					color: u,
					linewidth: 1,
					dashSize: .3,
					gapSize: .15,
					transparent: !0,
					opacity: .7
				}), t = new THREE.Vector3(n.virtualSource[0], n.virtualSource[1], n.virtualSource[2]), r = new THREE.BufferGeometry().setFromPoints([t, a.position.clone()]), i = new THREE.Line(r, e);
				i.computeLineDistances(), s.add(i);
			}
		}
	}
	console.log(`BeamTraceSolver: Highlighting path ${t} with order ${l.order}, arrival time ${l.arrivalTime.toFixed(4)}s`), renderer.needsToRender = !0;
}
function redrawVisualization(e) {
	switch (clearVisualization(e.virtualSourcesGroup), e.mode) {
		case "rays":
			e.validPaths.length > 0 && e.drawPathsFn();
			break;
		case "beams":
			e.btSolver && e.drawBeamsFn();
			break;
		case "both": e.validPaths.length > 0 && e.drawPathsFn(), e.btSolver && e.drawBeamsFn();
	}
	renderer.needsToRender = !0;
}
function removeClickHandler(e) {
	let t = renderer.renderer.domElement;
	e.clickHandler &&= (t.removeEventListener("click", e.clickHandler), null), e.hoverHandler && (t.removeEventListener("mousemove", e.hoverHandler), e.hoverHandler = null, t.style.cursor = "default");
}
function setupClickHandler(e) {
	removeClickHandler(e);
	let t = renderer.renderer.domElement, n = (e) => {
		let n = t.getBoundingClientRect();
		return new THREE.Vector2((e.clientX - n.left) / n.width * 2 - 1, -((e.clientY - n.top) / n.height) * 2 + 1);
	};
	e.hoverHandler = (r) => {
		if (e.virtualSourceMap.size === 0) {
			t.style.cursor = "default";
			return;
		}
		let i = n(r), a = new THREE.Raycaster();
		a.setFromCamera(i, renderer.camera);
		let o = a.intersectObjects(Array.from(e.virtualSourceMap.keys()));
		t.style.cursor = o.length > 0 ? "pointer" : "default";
	}, e.clickHandler = (t) => {
		if (t.button !== 0 || e.virtualSourceMap.size === 0) return;
		let r = n(t), i = new THREE.Raycaster();
		i.setFromCamera(r, renderer.camera);
		let a = i.intersectObjects(Array.from(e.virtualSourceMap.keys()));
		if (a.length > 0) {
			let t = a[0].object, n = e.virtualSourceMap.get(t);
			n && (e.selectedVirtualSource === t ? (e.selectedVirtualSource = null, e.onDeselect()) : (e.selectedVirtualSource = t, e.onSelectBeam(n)));
		}
	}, t.addEventListener("click", e.clickHandler), t.addEventListener("mousemove", e.hoverHandler);
}
//#endregion
//#region src/compute/beam-trace/index.ts
var BeamTraceSolver = class extends Solver {
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
	_raycaster = new THREE.Raycaster();
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
	constructor(e = {}) {
		super(e);
		let t = {
			...beamTraceDefaults,
			...e
		};
		if (this.kind = "beam-trace", this.uuid = t.uuid || v4(), this.name = t.name, this.roomID = t.roomID, this.sourceIDs = t.sourceIDs, this.receiverIDs = t.receiverIDs, this.maxReflectionOrder = t.maxReflectionOrder, this.frequencies = t.frequencies, this.hrtfSubjectId = t.hrtfSubjectId, this.headYaw = t.headYaw, this.headPitch = t.headPitch, this.headRoll = t.headRoll, this.edgeDiffractionEnabled = t.edgeDiffractionEnabled, this.lateReverbTailEnabled = t.lateReverbTailEnabled, this.tailCrossfadeTime = t.tailCrossfadeTime, this.tailCrossfadeDuration = t.tailCrossfadeDuration, this._visualizationMode = t.visualizationMode, this._showAllBeams = t.showAllBeams, this._visibleOrders = t.visibleOrders.length > 0 ? t.visibleOrders : Array.from({ length: t.maxReflectionOrder + 1 }, (e, t) => t), this._plotFrequency = 1e3, this._plotOrders = Array.from({ length: t.maxReflectionOrder + 1 }, (e, t) => t), this.levelTimeProgression = t.levelTimeProgression || v4(), this.impulseResponseResult = t.impulseResponseResult || v4(), !this.roomID) {
			let e = getRooms();
			e.length > 0 && (this.roomID = e[0].uuid);
		}
		emit("ADD_RESULT", {
			kind: ResultKind.LevelTimeProgression,
			data: [],
			info: {
				initialSPL: [100],
				frequency: [this._plotFrequency],
				maxOrder: this.maxReflectionOrder
			},
			name: `LTP - ${this.name}`,
			uuid: this.levelTimeProgression,
			from: this.uuid
		}), emit("ADD_RESULT", {
			kind: ResultKind.ImpulseResponse,
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
		}), this.selectedPath = createHighlightLine(), renderer.markup.add(this.selectedPath), this.selectedBeamsGroup = new THREE.Group(), this.selectedBeamsGroup.name = "selected-beams-highlight", renderer.markup.add(this.selectedBeamsGroup), this.virtualSourcesGroup = new THREE.Group(), this.virtualSourcesGroup.name = "virtual-sources", renderer.markup.add(this.virtualSourcesGroup);
	}
	get temperature() {
		return this.room?.temperature ?? 20;
	}
	get c() {
		return soundSpeed(this.temperature);
	}
	save() {
		return {
			...pickProps([
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
	restore(e) {
		return this.name = e.name, this.uuid = e.uuid, this.autoCalculate = e.autoCalculate ?? !1, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this._visualizationMode = e.visualizationMode || "rays", this._showAllBeams = e.showAllBeams ?? !1, this._visibleOrders = e.visibleOrders ?? Array.from({ length: this.maxReflectionOrder + 1 }, (e, t) => t), this.frequencies = e.frequencies, this.levelTimeProgression = e.levelTimeProgression || v4(), this.impulseResponseResult = e.impulseResponseResult || v4(), this.hrtfSubjectId = e.hrtfSubjectId ?? "D1", this.headYaw = e.headYaw ?? 0, this.headPitch = e.headPitch ?? 0, this.headRoll = e.headRoll ?? 0, this.edgeDiffractionEnabled = e.edgeDiffractionEnabled ?? !1, this.lateReverbTailEnabled = e.lateReverbTailEnabled ?? !1, this.tailCrossfadeTime = e.tailCrossfadeTime ?? 0, this.tailCrossfadeDuration = e.tailCrossfadeDuration ?? .05, this;
	}
	dispose() {
		this.reset(), this.removeClickHandler(), renderer.markup.remove(this.selectedPath), renderer.markup.remove(this.selectedBeamsGroup), renderer.markup.remove(this.virtualSourcesGroup), this.selectedPath.geometry?.dispose();
		let e = this.selectedPath.material;
		if (e instanceof THREE.Material) e.dispose();
		else if (Array.isArray(e)) for (let t of e) t instanceof THREE.Material && t.dispose();
		emit("REMOVE_RESULT", this.levelTimeProgression), emit("REMOVE_RESULT", this.impulseResponseResult);
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
		setupClickHandler(e), this.clickHandler = e.clickHandler, this.hoverHandler = e.hoverHandler;
	}
	removeClickHandler() {
		let e = this.clickHost();
		removeClickHandler(e), this.clickHandler = e.clickHandler, this.hoverHandler = e.hoverHandler;
	}
	highlightVirtualSourcePath(e) {
		let t = this.receiverIDs.length === 0 ? void 0 : useContainer.getState().containers[this.receiverIDs[0]];
		highlightVirtualSourcePath({
			beam: e,
			validPaths: this.validPaths,
			maxReflectionOrder: this.maxReflectionOrder,
			receiver: t,
			selectedPath: this.selectedPath,
			selectedBeamsGroup: this.selectedBeamsGroup
		});
	}
	extractPolygons() {
		let e = extractPolygons(this.room);
		return this.polygons = e.polygons, this.surfaceToPolygonIndex = e.surfaceToPolygonIndex, this.polygonToSurface = e.polygonToSurface, e.polygons;
	}
	currentTreeSignature() {
		if (this.sourceIDs.length === 0) return null;
		let e = useContainer.getState().containers[this.sourceIDs[0]];
		return currentTreeSignature({
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
		let e = useContainer.getState().containers[this.sourceIDs[0]];
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
		this.btSolver = new Solver3D(this.polygons, new Source3D(t), { maxReflectionOrder: this.maxReflectionOrder }), this._lastTreeSignature = this.currentTreeSignature(), console.log(`BeamTraceSolver: Built with ${this.polygons.length} polygons, max order ${this.maxReflectionOrder}`);
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
		let t = useContainer.getState().containers[e];
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
		this.calculateLTP(), this.calculateResponseByIntensity(), console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`), this.lastMetrics && (console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`), console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`), console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`)), renderer.needsToRender = !0;
	}
	convertPath(e, t) {
		return convertPath(e, t, this.c);
	}
	calculateLTP() {
		let e = this.receiverIDs.length > 0 ? useContainer.getState().containers[this.receiverIDs[0]] : null;
		calculateLevelTimeProgression({
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
		let e = { ...useResult.getState().results[this.levelTimeProgression] };
		e.data = [], emit("UPDATE_RESULT", {
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
		clearVisualization(this.virtualSourcesGroup), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
	}
	drawPaths() {
		drawPaths({
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
		drawBeams(e), this.selectedVirtualSource = e.selectedVirtualSource, this.setupClickHandler(), renderer.needsToRender = !0;
	}
	_computeDiffractionPaths() {
		if (!this.room) return;
		let e = computeDiffractionPaths({
			room: this.room,
			sourceId: this.sourceIDs[0],
			receiverId: this.receiverIDs[0],
			frequencies: this.frequencies,
			speedOfSound: this.c,
			temperature: this.temperature,
			containers: useContainer.getState().containers,
			raycaster: this._raycaster
		});
		this._edgeGraph = e.edgeGraph, this.validPaths.push(...e.paths), e.paths.length > 0 && console.log(`BeamTraceSolver: Found ${e.paths.length} diffraction paths`);
	}
	_buildEnergyHistogram() {
		let e = this.receiverIDs.length > 0 ? useContainer.getState().containers[this.receiverIDs[0]] : null;
		this._energyHistogram = buildEnergyHistogram({
			validPaths: this.validPaths,
			frequencies: this.frequencies,
			receiver: e,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n)
		});
	}
	calculateArrivalPressure(e, t, n = 1) {
		let r = this.sourceIDs.length > 0 ? useContainer.getState().containers[this.sourceIDs[0]] : null;
		return calculateArrivalPressure(e, t, {
			frequencies: this.frequencies,
			temperature: this.temperature,
			receiverGain: n,
			source: r?.directivityHandler ? r : null,
			polygonToSurface: this.polygonToSurface
		});
	}
	async calculateImpulseResponse() {
		let e = this.receiverIDs.length > 0 ? useContainer.getState().containers[this.receiverIDs[0]] : null, t = await calculateMonoImpulseResponse({
			validPaths: this.validPaths,
			frequencies: this.frequencies,
			receiver: e,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n),
			lateReverbTailEnabled: this.lateReverbTailEnabled,
			energyHistogram: this._energyHistogram,
			tailCrossfadeTime: this.tailCrossfadeTime,
			tailCrossfadeDuration: this.tailCrossfadeDuration,
			updateResult: (e, t) => {
				this.impulseResponse = e, updateImpulseResponseResult({
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
		let e = await playImpulseResponse(this.impulseResponse, () => this.calculateImpulseResponse(), this.uuid, "BEAMTRACE_SET_PROPERTY");
		this.impulseResponse = e.impulseResponse;
	}
	async downloadImpulseResponse(e, t = audioEngine.sampleRate) {
		let n = await downloadImpulseResponse(this.impulseResponse, () => this.calculateImpulseResponse(), e, t);
		this.impulseResponse = n.impulseResponse;
	}
	ambisonicImpulseResponse;
	ambisonicOrder = 1;
	async calculateAmbisonicImpulseResponse(e = 1) {
		let t = this.receiverIDs.length > 0 ? useContainer.getState().containers[this.receiverIDs[0]] : null, n = await calculateAmbisonicImpulseResponse({
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
		let n = await downloadAmbisonicImpulseResponse(this.ambisonicImpulseResponse, (e) => this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder, t, e);
		this.ambisonicImpulseResponse = n.ambisonicImpulseResponse, this.ambisonicOrder = n.ambisonicOrder;
	}
	async calculateBinauralImpulseResponse(e = 1) {
		return (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder = e), this.binauralImpulseResponse = await calculateBinauralImpulseResponse({
			ambisonicImpulseResponse: this.ambisonicImpulseResponse,
			order: e,
			hrtfSubjectId: this.hrtfSubjectId,
			headYaw: this.headYaw,
			headPitch: this.headPitch,
			headRoll: this.headRoll
		}), this.binauralImpulseResponse;
	}
	async playBinauralImpulseResponse(e = 1) {
		let t = await playBinauralImpulseResponse(this.binauralImpulseResponse, () => this.calculateBinauralImpulseResponse(e), this.uuid, "BEAMTRACE_SET_PROPERTY");
		this.binauralImpulseResponse = t.binauralImpulseResponse;
	}
	async downloadBinauralImpulseResponse(e, t = 1) {
		let n = await downloadBinauralImpulseResponse(this.binauralImpulseResponse, () => this.calculateBinauralImpulseResponse(t), e);
		this.binauralImpulseResponse = n.binauralImpulseResponse;
	}
	calculateResponseByIntensity() {
		if (this.validPaths.length === 0 || this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
		let e = this.receiverIDs[0], t = this.sourceIDs[0], n = useContainer.getState().containers[e];
		this.responseByIntensity = calculateResponseByIntensity({
			validPaths: this.validPaths,
			frequencies: this.frequencies,
			sourceId: t,
			receiverId: e,
			receiver: n,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n)
		});
	}
	downloadOctaveBandIR(e, t = audioEngine.sampleRate) {
		let n = this.receiverIDs.length > 0 ? useContainer.getState().containers[this.receiverIDs[0]] : null;
		downloadOctaveBandIR({
			validPaths: this.validPaths,
			frequencies: this.frequencies,
			receiver: n,
			arrivalPressure: (e, t, n) => this.calculateArrivalPressure(e, t, n),
			filename: e,
			sampleRate: t
		});
	}
	startQuickEstimate(e = 500) {
		let t = this.sourceIDs.length === 0 ? void 0 : useContainer.getState().containers[this.sourceIDs[0]];
		startQuickEstimate(this, t, e);
	}
	reset() {
		this.validPaths = [], this.clearVisualization(), this.btSolver = null, this._lastTreeSignature = null, this.lastMetrics = null, this.responseByIntensity = void 0, this._quickEstimateInterval !== null && (window.clearInterval(this._quickEstimateInterval), this._quickEstimateInterval = null), this.quickEstimateResults = [], this.estimatedT30 = null, this.clearLevelTimeProgressionData(), this.selectedPath.geometry.setPoints(/* @__PURE__ */ new Float32Array()), this.clearSelectedBeams(), renderer.needsToRender = !0;
	}
	clearSelectedBeams() {
		clearGroup(this.selectedBeamsGroup);
	}
	get room() {
		return useContainer.getState().containers[this.roomID];
	}
	get sources() {
		return this.sourceIDs.map((e) => useContainer.getState().containers[e]).filter(Boolean);
	}
	get receivers() {
		return this.receiverIDs.map((e) => useContainer.getState().containers[e]).filter(Boolean);
	}
	get numValidPaths() {
		return this.validPaths.length;
	}
	set maxReflectionOrderReset(e) {
		this.maxReflectionOrder = Math.max(0, Math.floor(e)), this._plotOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (e, t) => t), this._visibleOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (e, t) => t), this.sourceIDs.length > 0 && this.receiverIDs.length > 0 ? (this.calculate(), emit("BEAMTRACE_CALCULATE_COMPLETE", this.uuid)) : this.reset();
	}
	get maxReflectionOrderReset() {
		return this.maxReflectionOrder;
	}
	get visualizationMode() {
		return this._visualizationMode;
	}
	set visualizationMode(e) {
		this._visualizationMode = e, redrawVisualization({
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
		let t = useContainer.getState().containers[this.receiverIDs[0]];
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
		let e = useContainer.getState().containers[this.receiverIDs[0]];
		return e ? this.btSolver.getDetailedPaths([
			e.position.x,
			e.position.y,
			e.position.z
		]) : (console.warn("BeamTraceSolver: Receiver not found."), []);
	}
	highlightPathByIndex(e) {
		let t = this.receiverIDs.length === 0 ? void 0 : useContainer.getState().containers[this.receiverIDs[0]];
		highlightPathByIndex({
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
		this.selectedPath.geometry.setPoints(/* @__PURE__ */ new Float32Array()), this.clearSelectedBeams(), renderer.needsToRender = !0;
	}
};
registerBeamTraceEvents(BeamTraceSolver);
//#endregion
export { BeamTraceSolver, BeamTraceSolver as default };

//# sourceMappingURL=beam-trace-D1Oty2Gv.mjs.map