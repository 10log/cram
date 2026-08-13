import { E as e, b as t, u as n, v as r } from "./FileSaver.min-BS9rdHrk.mjs";
import { d as i, t as a, u as o } from "./renderer-BeKP35ez.mjs";
import { d as s, g as c, h as l, m as u, s as d } from "./store-DRnKXLf0.mjs";
import { t as ee } from "./round-to-CrejEAZs.mjs";
import { t as te } from "./acoustics-SIlOec_Y.mjs";
import { t as ne } from "./rt-constants-BjCsO47l.mjs";
import { t as re } from "./TessellateModifier-DlSgA920.mjs";
import * as f from "three";
import { BufferGeometry as ie, Float32BufferAttribute as ae, LineBasicMaterial as oe, LineSegments as se, Matrix3 as ce, Vector3 as le } from "three";
//#region src/compute/acoustics/util/allowMultiple.ts
function p(e, t) {
	return t instanceof Array ? t.map((t) => e(t)) : e(t);
}
//#endregion
//#region src/compute/acoustics/std/constants.ts
var ue = {
	value: 2e-5,
	units: "Pa"
};
//#endregion
//#region src/compute/acoustics/convert.ts
function de(e) {
	return p((e) => 20 * Math.log10(e / ue.value), e);
}
function fe(e) {
	return p((e) => 10 ** (e / 20) * ue.value, e);
}
function pe(e, t = 400) {
	return p((e) => e ** 2 / t, e);
}
function me(e, t = 400) {
	return p((e) => Math.sqrt(e * t), e);
}
//#endregion
//#region node_modules/three/examples/jsm/helpers/VertexNormalsHelper.js
var m = new le(), h = new le(), he = new ce(), ge = class extends se {
	constructor(e, t = 1, n = 16711680) {
		let r = new ie(), i = e.geometry.attributes.normal.count, a = new ae(i * 2 * 3, 3);
		r.setAttribute("position", a), super(r, new oe({
			color: n,
			toneMapped: !1
		})), this.object = e, this.size = t, this.type = "VertexNormalsHelper", this.matrixAutoUpdate = !1, this.isVertexNormalsHelper = !0, this.update();
	}
	update() {
		this.object.updateMatrixWorld(!0), he.getNormalMatrix(this.object.matrixWorld);
		let e = this.object.matrixWorld, t = this.geometry.attributes.position, n = this.object.geometry;
		if (n) {
			let r = n.attributes.position, i = n.attributes.normal, a = 0;
			for (let n = 0, o = r.count; n < o; n++) m.fromBufferAttribute(r, n).applyMatrix4(e), h.fromBufferAttribute(i, n), h.applyMatrix3(he).normalize().multiplyScalar(this.size).add(m), t.setXYZ(a, m.x, m.y, m.z), a += 1, t.setXYZ(a, h.x, h.y, h.z), a += 1;
		}
		t.needsUpdate = !0;
	}
	dispose() {
		this.geometry.dispose(), this.material.dispose();
	}
};
//#endregion
//#region src/common/chunk.ts
function g(e, t) {
	for (var n = [], r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
//#endregion
//#region src/compute/acoustics/interpolate-log.ts
function _e(e, t, n, r, i) {
	return t + (Math.log10(i) - Math.log10(e)) / (Math.log10(n) - Math.log10(e)) * (r - t);
}
//#endregion
//#region src/compute/acoustics/interpolate-alpha.ts
function _(e, t) {
	return function(n) {
		let r = 0;
		for (; n > t[r] && r < t.length;) r++;
		if (r > 0 && r < t.length) {
			let i = t[r - 1], a = e[r - 1], o = t[r], s = e[r];
			return _e(i, a, o, s, n);
		}
		return r === 0 ? e[r] : e[t.length - 1];
	};
}
//#endregion
//#region src/compute/acoustics/reflection-coefficient.ts
function ve(e, t) {
	let n = Math.sqrt(1 - e), r = (1 - n) / (1 + n) * Math.abs(Math.cos(t));
	return ((r - 1) / (r + 1)) ** 2;
}
//#endregion
//#region src/common/discretize.ts
function ye(e, t, n) {
	return function(r) {
		return Math.round((n - t) / e * r);
	};
}
//#endregion
//#region src/compute/raytracer/brdf.ts
var be = class {
	coefficients;
	steps;
	getIndex;
	constructor(e) {
		this.steps = e && e.steps || 10, this.coefficients = [];
		for (let e = 0; e < this.steps; e++) this.coefficients.push([]);
		this.getIndex = ye(this.steps, 0, Math.PI), this.set(e.absorptionCoefficient, e.diffusionCoefficient);
	}
	get(e, t) {
		return this.coefficients[this.getIndex(e)][this.getIndex(t)];
	}
	set(e, t) {
		let n = 1 - e, r = n * (1 - t), i = (n - r) / this.steps;
		for (let e = 0; e < this.steps; e++) for (let t = 0; t < this.steps; t++) {
			this.coefficients[e][t] = i;
			let n = this.steps - e - 1;
			t === n && (this.coefficients[e][t] += r);
		}
		return this;
	}
	randomize() {
		let e;
		for (let t = 0; t < this.steps; t++) {
			e = 0;
			for (let n = 0; n < this.steps; n++) this.coefficients[t][n] = Math.random(), e += this.coefficients[t][n];
			for (let n = 0; n < this.steps; n++) this.coefficients[t][n] = this.coefficients[t][n] / e;
		}
		return this;
	}
}, xe = /* @__PURE__ */ e({
	booleans: () => Fe,
	color: () => G,
	colorModule: () => G,
	connectors: () => st,
	expansions: () => Qe,
	extrusions: () => Xe,
	geometry: () => M,
	hulls: () => et,
	math: () => E,
	measurements: () => Ye,
	primitives: () => Me,
	text: () => nt,
	transforms: () => Je,
	utils: () => at
}), v = await import(
	/* @vite-ignore */
	(typeof window < "u" ? window.location.origin : "") + "/compute/modeling/jscad-modeling-bundle.js"
).then((e) => e.default), { maths: Se } = v, { vec2: y, vec3: b, mat4: x, plane: S, line2: C, line3: w } = Se, Ce = {
	...y,
	create: (e) => e ? y.fromValues(e[0] || 0, e[1] || 0) : y.create(),
	fromArray: (e) => y.fromValues(e[0], e[1]),
	fromValues: y.fromValues,
	clone: y.clone,
	add: y.add,
	subtract: y.subtract,
	scale: y.scale,
	dot: y.dot,
	cross: y.cross,
	length: y.length,
	normalize: y.normalize,
	distance: y.distance,
	equals: y.equals,
	transform: y.transform,
	negate: y.negate,
	rotate: y.rotate,
	angle: y.angle,
	lerp: y.lerp,
	min: y.min,
	max: y.max,
	abs: y.abs,
	squaredLength: y.squaredLength,
	squaredDistance: y.squaredDistance
}, T = {
	...b,
	create: (e) => e ? b.fromValues(e[0] || 0, e[1] || 0, e[2] || 0) : b.create(),
	fromArray: (e) => b.fromValues(e[0], e[1], e[2]),
	fromValues: b.fromValues,
	clone: b.clone,
	add: b.add,
	subtract: b.subtract,
	scale: b.scale,
	dot: b.dot,
	cross: b.cross,
	length: b.length,
	normalize: b.normalize,
	distance: b.distance,
	equals: b.equals,
	transform: b.transform,
	negate: b.negate,
	angle: b.angle,
	lerp: b.lerp,
	min: b.min,
	max: b.max,
	abs: b.abs,
	squaredLength: b.squaredLength,
	squaredDistance: b.squaredDistance,
	unit: b.normalize
}, E = {
	vec2: Ce,
	vec3: T,
	mat4: {
		...x,
		create: x.create,
		clone: x.clone,
		identity: x.identity,
		fromValues: x.fromValues,
		fromTranslation: x.fromTranslation,
		fromScaling: x.fromScaling,
		fromRotation: x.fromRotation,
		fromXRotation: x.fromXRotation,
		fromYRotation: x.fromYRotation,
		fromZRotation: x.fromZRotation,
		fromTaitBryanRotation: x.fromTaitBryanRotation,
		multiply: x.multiply,
		translate: x.translate,
		rotate: x.rotate,
		rotateX: x.rotateX,
		rotateY: x.rotateY,
		rotateZ: x.rotateZ,
		scale: x.scale,
		invert: x.invert,
		equals: x.equals,
		mirrorByPlane: x.mirrorByPlane,
		transform: x.transform
	},
	plane: {
		...S,
		create: S.create,
		clone: S.clone,
		equals: S.equals,
		flip: S.flip,
		fromPoints: S.fromPoints,
		fromNormalAndPoint: S.fromNormalAndPoint,
		signedDistanceToPoint: S.signedDistanceToPoint,
		transform: S.transform,
		fromPointsRandom: (e, t, n) => S.fromPoints(S.create(), e, t, n)
	},
	line2: {
		...C,
		create: C.create,
		clone: C.clone,
		equals: C.equals,
		fromPoints: C.fromPoints,
		direction: C.direction,
		origin: C.origin,
		closestPoint: C.closestPoint,
		distanceToPoint: C.distanceToPoint,
		transform: C.transform
	},
	line3: {
		...w,
		create: w.create,
		clone: w.clone,
		equals: w.equals,
		fromPoints: w.fromPoints,
		direction: w.direction,
		origin: w.origin,
		closestPoint: w.closestPoint,
		distanceToPoint: w.distanceToPoint,
		transform: w.transform
	},
	constants: Se.constants
}, { geometries: we } = v, { geom2: D, geom3: O, path2: k, poly3: A } = we, Te = {
	...D,
	create: D.create,
	clone: D.clone,
	isA: D.isA,
	toOutlines: D.toOutlines,
	toPoints: D.toPoints,
	transform: D.transform,
	reverse: D.reverse
}, j = {
	...O,
	create: O.create,
	clone: O.clone,
	isA: O.isA,
	toPolygons: O.toPolygons,
	transform: O.transform,
	fromPolygons: (e) => {
		let t = e.map((e) => A.isA(e) ? e : e.vertices ? A.create(e.vertices) : A.create(e));
		return O.create(t);
	}
}, M = {
	geom2: Te,
	geom3: j,
	path2: {
		...k,
		create: k.create,
		clone: k.clone,
		isA: k.isA,
		toPoints: k.toPoints,
		transform: k.transform,
		close: k.close,
		concat: k.concat,
		fromPoints: k.fromPoints,
		appendPoints: k.appendPoints,
		appendArc: k.appendArc,
		appendBezier: k.appendBezier,
		equals: k.equals,
		reverse: k.reverse
	},
	poly3: {
		...A,
		create: A.create,
		clone: A.clone,
		isA: A.isA,
		fromPoints: A.fromPoints,
		toPoints: (e) => e.vertices || A.toVertices(e),
		toVertices: A.toVertices,
		transform: A.transform,
		plane: (e) => {
			if (e.plane) return e.plane;
			let t = e.vertices || A.toVertices(e);
			return t.length >= 3 ? S.fromPoints(S.create(), t[0], t[1], t[2]) : S.create();
		},
		flip: (e) => ({
			vertices: (e.vertices || A.toVertices(e)).slice().reverse(),
			plane: e.plane ? S.flip(S.create(), e.plane) : null
		}),
		fromPointsAndPlane: (e, t) => ({
			vertices: e,
			plane: t
		}),
		measureBoundingSphere: (e) => {
			let t = e.vertices || A.toVertices(e);
			if (t.length === 0) return [[
				0,
				0,
				0
			], 0];
			let n = [
				0,
				0,
				0
			];
			for (let e of t) n[0] += e[0], n[1] += e[1], n[2] += e[2];
			n[0] /= t.length, n[1] /= t.length, n[2] /= t.length;
			let r = 0;
			for (let e of t) {
				let t = e[0] - n[0], i = e[1] - n[1], a = e[2] - n[2], o = t * t + i * i + a * a;
				o > r && (r = o);
			}
			return [n, Math.sqrt(r)];
		}
	}
}, { primitives: N } = v, P = (e) => e.reduce((e, t) => Array.isArray(t) ? e.concat(P(t)) : e.concat(t), []), Ee = (e = {}) => {
	let t = e.size ?? 1, n = Array.isArray(t) ? t : [
		t,
		t,
		t
	], r = e.center, i = N.cuboid({ size: n });
	return r && (i = v.transforms.translate(r, i)), i;
}, De = (e = {}) => {
	let t = e.radius ?? e.r ?? 1, n = e.segments ?? e.resolution ?? 32, r = e.center, i = N.sphere({
		radius: t,
		segments: n
	});
	return r && (i = v.transforms.translate(r, i)), i;
}, Oe = (e = {}) => {
	let t = e.radius ?? e.r ?? 1, n = e.height ?? e.h ?? 1, r = e.segments ?? e.resolution ?? 32, i = e.r1 ?? t, a = e.r2 ?? t, o = e.center, s;
	return s = i === a ? N.cylinder({
		radius: t,
		height: n,
		segments: r
	}) : N.cylinderElliptic({
		height: n,
		startRadius: [i, i],
		endRadius: [a, a],
		segments: r
	}), o && (s = v.transforms.translate(o, s)), s;
}, ke = (e = {}) => {
	let t = e.innerRadius ?? e.ri ?? 1, n = e.outerRadius ?? e.ro ?? 4, r = e.innerSegments ?? e.innerResolution ?? 32, i = e.outerSegments ?? e.outerResolution ?? 32;
	return N.torus({
		innerRadius: t,
		outerRadius: n,
		innerSegments: r,
		outerSegments: i
	});
}, Ae = (e = {}) => {
	let t = e.points || [], n = e.faces || e.triangles || [];
	return N.polyhedron({
		points: t,
		faces: n
	});
}, je = (e = {}) => {
	let t = e.size ?? [1, 1], n = e.center, r = N.rectangle({ size: t });
	return n && (r = v.transforms.translate([
		n[0],
		n[1],
		0
	], r)), r;
}, Me = {
	cube: Ee,
	cuboid: N.cuboid,
	sphere: De,
	cylinder: Oe,
	torus: ke,
	polyhedron: Ae,
	rectangle: je,
	square: je,
	circle: (e = {}) => {
		let t = e.radius ?? e.r ?? 1, n = e.segments ?? e.resolution ?? 32, r = e.center, i = N.circle({
			radius: t,
			segments: n
		});
		return r && (i = v.transforms.translate([
			r[0],
			r[1],
			0
		], i)), i;
	},
	ellipse: N.ellipse,
	polygon: (e = {}) => {
		let t = e.points || [];
		return N.polygon({ points: t });
	},
	arc: N.arc,
	ellipsoid: N.ellipsoid,
	geodesicSphere: N.geodesicSphere,
	roundedCuboid: N.roundedCuboid,
	roundedCylinder: N.roundedCylinder,
	roundedRectangle: N.roundedRectangle,
	star: N.star,
	line: N.line
}, { booleans: F } = v, Ne = (...e) => {
	let t = P(e);
	return t.length === 0 ? j.create() : t.length === 1 ? t[0] : F.union(t);
}, Pe = (...e) => {
	let t = P(e);
	return t.length === 0 ? j.create() : t.length === 1 ? t[0] : F.subtract(t);
}, Fe = {
	union: Ne,
	subtract: Pe,
	intersect: (...e) => {
		let t = P(e);
		return t.length === 0 ? j.create() : t.length === 1 ? t[0] : F.intersect(t);
	},
	difference: Pe
}, { transforms: I } = v, L = (e, ...t) => {
	let n = P(t);
	if (n.length === 0) return j.create();
	let r = n.map((t) => I.translate(e, t));
	return r.length === 1 ? r[0] : r;
}, Ie = (e, ...t) => L([
	e,
	0,
	0
], ...t), Le = (e, ...t) => L([
	0,
	e,
	0
], ...t), Re = (e, ...t) => L([
	0,
	0,
	e
], ...t), R = (e, ...t) => {
	let n = P(t);
	if (n.length === 0) return j.create();
	let r = n.map((t) => I.rotate(e, t));
	return r.length === 1 ? r[0] : r;
}, ze = (e, ...t) => R([
	e,
	0,
	0
], ...t), Be = (e, ...t) => R([
	0,
	e,
	0
], ...t), Ve = (e, ...t) => R([
	0,
	0,
	e
], ...t), z = (e, ...t) => {
	let n = P(t);
	if (n.length === 0) return j.create();
	let r = n.map((t) => I.scale(e, t));
	return r.length === 1 ? r[0] : r;
}, He = (e, ...t) => z([
	e,
	1,
	1
], ...t), Ue = (e, ...t) => z([
	1,
	e,
	1
], ...t), We = (e, ...t) => z([
	1,
	1,
	e
], ...t), B = (e, ...t) => {
	let n = P(t);
	if (n.length === 0) return j.create();
	let r = n.map((t) => I.mirror(e, t));
	return r.length === 1 ? r[0] : r;
}, Ge = (...e) => B({ normal: [
	1,
	0,
	0
] }, ...e), Ke = (...e) => B({ normal: [
	0,
	1,
	0
] }, ...e), qe = (...e) => B({ normal: [
	0,
	0,
	1
] }, ...e), V = (e = {}, ...t) => {
	let n = P(t);
	if (n.length === 0) return j.create();
	let r = n.map((t) => I.center(e, t));
	return r.length === 1 ? r[0] : r;
}, Je = {
	translate: L,
	translateX: Ie,
	translateY: Le,
	translateZ: Re,
	rotate: R,
	rotateX: ze,
	rotateY: Be,
	rotateZ: Ve,
	scale: z,
	scaleX: He,
	scaleY: Ue,
	scaleZ: We,
	mirror: B,
	mirrorX: Ge,
	mirrorY: Ke,
	mirrorZ: qe,
	center: V,
	centerX: (...e) => V({ axes: [
		!0,
		!1,
		!1
	] }, ...e),
	centerY: (...e) => V({ axes: [
		!1,
		!0,
		!1
	] }, ...e),
	centerZ: (...e) => V({ axes: [
		!1,
		!1,
		!0
	] }, ...e),
	transform: (e, ...t) => {
		let n = P(t);
		if (n.length === 0) return j.create();
		let r = n.map((t) => I.transform(e, t));
		return r.length === 1 ? r[0] : r;
	},
	align: I.align
}, { measurements: H } = v, Ye = {
	measureArea: H.measureArea,
	measureBoundingBox: H.measureBoundingBox,
	measureBoundingSphere: H.measureBoundingSphere,
	measureCenter: H.measureCenter,
	measureCenterOfMass: H.measureCenterOfMass,
	measureDimensions: H.measureDimensions,
	measureVolume: H.measureVolume,
	measureAggregateArea: H.measureAggregateArea,
	measureAggregateVolume: H.measureAggregateVolume,
	measureAggregateBoundingBox: H.measureAggregateBoundingBox,
	measureEpsilon: H.measureEpsilon
}, { extrusions: U } = v, Xe = {
	extrudeLinear: (e, ...t) => {
		let n = P(t);
		if (n.length === 0) return j.create();
		let r = n.map((t) => U.extrudeLinear(e, t));
		return r.length === 1 ? r[0] : r;
	},
	extrudeRotate: (e, ...t) => {
		let n = P(t);
		if (n.length === 0) return j.create();
		let r = n.map((t) => U.extrudeRotate(e, t));
		return r.length === 1 ? r[0] : r;
	},
	extrudeRectangular: U.extrudeRectangular,
	extrudeFromSlices: U.extrudeFromSlices,
	extrudeHelical: U.extrudeHelical
}, { expansions: Ze } = v, Qe = {
	expand: (e, ...t) => {
		let n = P(t);
		if (n.length === 0) return j.create();
		let r = n.map((t) => Ze.expand(e, t));
		return r.length === 1 ? r[0] : r;
	},
	offset: (e, ...t) => {
		let n = P(t);
		if (n.length === 0) return Te.create();
		let r = n.map((t) => Ze.offset(e, t));
		return r.length === 1 ? r[0] : r;
	}
}, { hulls: $e } = v, et = {
	hull: (...e) => {
		let t = P(e);
		return t.length === 0 ? j.create() : $e.hull(t);
	},
	hullChain: (...e) => {
		let t = P(e);
		return t.length === 0 ? j.create() : $e.hullChain(t);
	}
}, { text: tt } = v, nt = {
	vectorText: tt.vectorText,
	vectorChar: tt.vectorChar
}, { colors: W } = v, rt = {
	black: [
		0,
		0,
		0
	],
	silver: [
		192 / 255,
		192 / 255,
		192 / 255
	],
	gray: [
		128 / 255,
		128 / 255,
		128 / 255
	],
	white: [
		1,
		1,
		1
	],
	maroon: [
		128 / 255,
		0,
		0
	],
	red: [
		1,
		0,
		0
	],
	purple: [
		128 / 255,
		0,
		128 / 255
	],
	fuchsia: [
		1,
		0,
		1
	],
	green: [
		0,
		128 / 255,
		0
	],
	lime: [
		0,
		1,
		0
	],
	olive: [
		128 / 255,
		128 / 255,
		0
	],
	yellow: [
		1,
		1,
		0
	],
	navy: [
		0,
		0,
		128 / 255
	],
	blue: [
		0,
		0,
		1
	],
	teal: [
		0,
		128 / 255,
		128 / 255
	],
	aqua: [
		0,
		1,
		1
	]
}, G = {
	color: (e, ...t) => {
		let n;
		n = typeof e == "string" ? [...rt[e.toLowerCase()] || W.colorNameToRgb(e), 1] : e.length === 3 ? [...e, 1] : e;
		let r = P(t).map((e) => W.colorize(n, e));
		return r.length === 1 ? r[0] : r;
	},
	cssColors: rt,
	colorize: W.colorize,
	colorNameToRgb: W.colorNameToRgb,
	hexToRgb: W.hexToRgb,
	hslToRgb: W.hslToRgb,
	hsvToRgb: W.hsvToRgb,
	rgbToHex: W.rgbToHex,
	rgbToHsl: W.rgbToHsl,
	rgbToHsv: W.rgbToHsv
}, { utils: it } = v, at = {
	flatten: P,
	degToRad: it.degToRad,
	radToDeg: it.radToDeg
}, ot = class e {
	point;
	axisvector;
	normalvector;
	constructor(e, t, n) {
		this.point = e, this.axisvector = T.normalize(T.create(), t), this.normalvector = T.normalize(T.create(), n);
	}
	normalized() {
		return new e(this.point, T.normalize(T.create(), this.axisvector), T.normalize(T.create(), this.normalvector));
	}
	transform(t) {
		let n = T.transform(T.create(), this.point, t), r = T.transform(T.create(), this.axisvector, t), i = T.transform(T.create(), this.normalvector, t);
		return new e(n, r, i);
	}
}, st = {
	Connector: ot,
	create: (e, t, n) => new ot(e, t, n)
}, { plane: K, vec3: q } = E, { poly3: J } = M, Y = 1e-5, ct = (e, t, n) => {
	let r = q.subtract(q.create(), n, t), i = (e[3] - q.dot(e, t)) / q.dot(e, r);
	Number.isNaN(i) && (i = 0), i > 1 && (i = 1), i < 0 && (i = 0);
	let a = q.create();
	return q.scale(a, r, i), q.add(a, a, t), a;
}, lt = (e, t) => {
	let n = {
		type: 0,
		front: null,
		back: null
	}, r = t.vertices || J.toVertices(t), i = r.length, a = t.plane || (r.length >= 3 ? K.fromPoints(K.create(), r[0], r[1], r[2]) : K.create());
	if (K.equals(a, e)) n.type = 0;
	else {
		let t = !1, o = !1, s = [];
		for (let n = 0; n < i; n++) {
			let i = q.dot(e, r[n]) - e[3], a = i < 0;
			s.push(a), i > Y && (t = !0), i < -1e-5 && (o = !0);
		}
		if (!t && !o) n.type = q.dot(e, a) >= 0 ? 0 : 1;
		else if (!o) n.type = 2;
		else if (!t) n.type = 3;
		else {
			n.type = 4;
			let t = [], o = [], c = s[0];
			for (let n = 0; n < i; n++) {
				let a = r[n], l = n + 1;
				l >= i && (l = 0);
				let u = s[l];
				if (c === u) c ? o.push(a) : t.push(a);
				else {
					let n = a, i = r[l], s = ct(e, n, i);
					c ? (o.push(a), o.push(s), t.push(s)) : (t.push(a), t.push(s), o.push(s));
				}
				c = u;
			}
			let l = Y * Y;
			if (o.length >= 3) {
				let e = o[o.length - 1];
				for (let t = 0; t < o.length; t++) {
					let n = o[t];
					q.squaredDistance(n, e) < l && (o.splice(t, 1), t--), e = n;
				}
			}
			if (t.length >= 3) {
				let e = t[t.length - 1];
				for (let n = 0; n < t.length; n++) {
					let r = t[n];
					q.squaredDistance(r, e) < l && (t.splice(n, 1), n--), e = r;
				}
			}
			t.length >= 3 && (n.front = ut(t, a)), o.length >= 3 && (n.back = ut(o, a));
		}
	}
	return n;
};
function ut(e, t) {
	return {
		vertices: e,
		plane: t
	};
}
function dt(e) {
	let t = e.vertices || J.toVertices(e);
	if (t.length === 0) return [[
		0,
		0,
		0
	], 0];
	let n = [
		0,
		0,
		0
	];
	for (let e of t) n[0] += e[0], n[1] += e[1], n[2] += e[2];
	n[0] /= t.length, n[1] /= t.length, n[2] /= t.length;
	let r = 0;
	for (let e of t) {
		let t = e[0] - n[0], i = e[1] - n[1], a = e[2] - n[2], o = t * t + i * i + a * a;
		o > r && (r = o);
	}
	return [n, Math.sqrt(r)];
}
function ft(e) {
	return {
		vertices: (e.vertices || J.toVertices(e)).slice().reverse(),
		plane: e.plane ? K.flip(K.create(), e.plane) : null
	};
}
var pt = class e {
	parent = null;
	children = [];
	polygon = null;
	removed = !1;
	constructor() {}
	addPolygons(e) {
		if (!this.isRootNode()) throw Error("Assertion failed: can only add polygons to root node");
		for (let t of e) this.addChild(t);
	}
	remove() {
		if (!this.removed && (this.removed = !0, this.parent)) {
			let e = this.parent.children.indexOf(this);
			e >= 0 && this.parent.children.splice(e, 1), this.parent.recursivelyInvalidatePolygon();
		}
	}
	isRemoved() {
		return this.removed;
	}
	isRootNode() {
		return !this.parent;
	}
	invert() {
		if (!this.isRootNode()) throw Error("Assertion failed: can only invert from root node");
		this.invertSub();
	}
	getPolygon() {
		if (!this.polygon) throw Error("Assertion failed: node has no polygon");
		return this.polygon;
	}
	getPolygons(e) {
		let t = [[this]];
		for (let n = 0; n < t.length; ++n) {
			let r = t[n];
			for (let n of r) n.polygon ? e.push(n.polygon) : n.children.length > 0 && t.push(n.children);
		}
	}
	splitByPlane(e, t, n, r, i) {
		if (this.children.length > 0) {
			let a = [this.children];
			for (let o = 0; o < a.length; o++) {
				let s = a[o];
				for (let o of s) o.children.length > 0 ? a.push(o.children) : o._splitByPlane(e, t, n, r, i);
			}
		} else this._splitByPlane(e, t, n, r, i);
	}
	_splitByPlane(e, t, n, r, i) {
		let a = this.polygon;
		if (a) {
			let [o, s] = dt(a), c = s + Y, l = q.dot(e, o) - e[3];
			if (l > c) r.push(this);
			else if (l < -c) i.push(this);
			else {
				let o = lt(e, a);
				switch (o.type) {
					case 0:
						t.push(this);
						break;
					case 1:
						n.push(this);
						break;
					case 2:
						r.push(this);
						break;
					case 3:
						i.push(this);
						break;
					case 4:
						if (o.front) {
							let e = this.addChild(o.front);
							r.push(e);
						}
						if (o.back) {
							let e = this.addChild(o.back);
							i.push(e);
						}
				}
			}
		}
	}
	addChild(t) {
		let n = new e();
		return n.parent = this, n.polygon = t, this.children.push(n), n;
	}
	invertSub() {
		let e = [[this]];
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			for (let t of n) t.polygon &&= ft(t.polygon), t.children.length > 0 && e.push(t.children);
		}
	}
	recursivelyInvalidatePolygon() {
		let e = this;
		for (; e && e.polygon;) e.polygon = null, e = e.parent;
	}
	clear() {
		let e = [[this]];
		for (let t = 0; t < e.length; ++t) {
			let n = e[t];
			for (let t of n) t.polygon = null, t.parent = null, t.children.length > 0 && e.push(t.children), t.children = [];
		}
	}
}, mt = class e {
	plane = null;
	front = null;
	back = null;
	polygontreenodes = [];
	parent;
	constructor(e) {
		this.parent = e;
	}
	invert() {
		let e = [this];
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			n.plane &&= K.flip(K.create(), n.plane), n.front && e.push(n.front), n.back && e.push(n.back);
			let r = n.front;
			n.front = n.back, n.back = r;
		}
	}
	clipPolygons(e, t) {
		let n = {
			node: this,
			polygontreenodes: e
		}, r = [];
		do {
			let e = n.node, i = n.polygontreenodes;
			if (e.plane) {
				let n = [], a = [], o = t ? n : a;
				for (let t of i) t.isRemoved() || t.splitByPlane(e.plane, o, n, a, n);
				if (e.front && a.length > 0 && r.push({
					node: e.front,
					polygontreenodes: a
				}), e.back && n.length > 0) r.push({
					node: e.back,
					polygontreenodes: n
				});
				else for (let e of n) e.remove();
			}
			n = r.pop();
		} while (n !== void 0);
	}
	clipTo(e, t) {
		let n = this, r = [];
		do
			n.polygontreenodes.length > 0 && e.rootnode.clipPolygons(n.polygontreenodes, t), n.front && r.push(n.front), n.back && r.push(n.back), n = r.pop();
		while (n !== void 0);
	}
	addPolygonTreeNodes(t) {
		let n = {
			node: this,
			polygontreenodes: t
		}, r = [];
		do {
			let t = n.node, i = n.polygontreenodes;
			if (i.length === 0) {
				n = r.pop();
				continue;
			}
			if (!t.plane) {
				let e = i[Math.floor(i.length / 2)].getPolygon();
				t.plane = e.plane || K.fromPoints(K.create(), e.vertices[0], e.vertices[1], e.vertices[2]);
			}
			let a = [], o = [];
			for (let e of i) e.splitByPlane(t.plane, t.polygontreenodes, o, a, o);
			a.length > 0 && (t.front ||= new e(t), r.push({
				node: t.front,
				polygontreenodes: a
			})), o.length > 0 && (t.back ||= new e(t), r.push({
				node: t.back,
				polygontreenodes: o
			})), n = r.pop();
		} while (n !== void 0);
	}
	getParentPlaneNormals(e, t) {
		t > 0 && this.parent && this.parent.plane && (e.push([
			this.parent.plane[0],
			this.parent.plane[1],
			this.parent.plane[2]
		]), this.parent.getParentPlaneNormals(e, t - 1));
	}
}, ht = class {
	polygonTree;
	rootnode;
	constructor(e) {
		this.polygonTree = new pt(), this.rootnode = new mt(null), e && this.addPolygons(e);
	}
	invert() {
		this.polygonTree.invert(), this.rootnode.invert();
	}
	clipTo(e, t) {
		this.rootnode.clipTo(e, !!t);
	}
	allPolygons() {
		let e = [];
		return this.polygonTree.getPolygons(e), e;
	}
	addPolygons(e) {
		let t = Array(e.length);
		for (let n = 0; n < e.length; n++) t[n] = this.polygonTree.addChild(e[n]);
		this.rootnode.addPolygonTreeNodes(t);
	}
};
({ ...xe });
var X = {
	connectors: st,
	geometry: M,
	math: E,
	primitives: Me,
	text: nt,
	booleans: Fe,
	expansions: Qe,
	extrusions: Xe,
	hulls: et,
	measurements: Ye,
	transforms: Je,
	color: G,
	utils: at,
	splitLineByPlane: ct,
	splitPolygonByPlane: lt,
	Tree: ht,
	PolygonTreeNode: pt,
	Node: mt
};
//#endregion
//#region src/common/equal-within-range.ts
function gt(e) {
	return e ? (t) => (n, r) => e.reduce((e, i) => e && Math.abs(n[i] - r[i]) < t, !0) : (e) => (t, n) => Math.abs(t - n) < e;
}
var _t = gt();
//#endregion
//#region src/compute/acoustics/scattering-function.ts
function vt(e, t, n, r, i) {
	return t + (i - e) / (n - e) * (r - t);
}
var yt = (e, t) => {
	if (t <= e[0]) return [e[0], e[1]];
	if (t >= e[e.length - 1]) return [e[e.length - 2], e[e.length - 1]];
	for (let r = 1; r < e.length; r++) if (n(t, e[r - 1], e[r])) return [e[r - 1], e[r]];
	throw Error("value could not be found within input array");
}, bt = [
	[
		.003,
		.003,
		.003,
		.003,
		.017,
		.034,
		.043,
		.046
	],
	[
		.009,
		.007,
		.022,
		.023,
		.08,
		.207,
		.25,
		.302
	],
	[
		.014,
		.011,
		.04,
		.152,
		.33,
		.448,
		.497,
		.529
	],
	[
		.017,
		.034,
		.115,
		.443,
		.664,
		.77,
		.83,
		.851
	],
	[
		.02,
		.072,
		.256,
		.724,
		.882,
		.902,
		.922,
		.934
	],
	[
		.049,
		.175,
		.698,
		.874,
		.94,
		.957,
		.977,
		.989
	]
], xt = [
	63,
	125,
	250,
	500,
	1e3,
	2e3,
	4e3,
	8e3
], Z = [
	.01,
	.05,
	.25,
	.55,
	.8,
	.9
];
function St(e) {
	let [t, n] = yt(Z, e), r = bt[Z.indexOf(t)], i = bt[Z.indexOf(n)];
	return _(r.map((a, o) => vt(t, r[o], n, i[o], e)), xt);
}
//#endregion
//#region src/objects/surface-element.ts
var Ct = class {
	bufferAttribute;
	a;
	b;
	c;
	constructor(e, t, n, r) {
		this.bufferAttribute = e, this.a = t, this.b = n, this.c = r;
	}
}, Q = {
	materials: {
		selected: new f.MeshLambertMaterial({
			fog: !1,
			color: new f.Color(5227511),
			transparent: !0,
			opacity: .6,
			side: f.DoubleSide,
			reflectivity: .15,
			depthWrite: !0,
			depthTest: !1,
			name: "surface-selected-material"
		}),
		hovered: new f.MeshLambertMaterial({
			fog: !1,
			color: new f.Color(16771899),
			transparent: !0,
			opacity: .4,
			side: f.DoubleSide,
			reflectivity: .15,
			depthWrite: !0,
			depthTest: !1,
			name: "surface-hovered-material"
		}),
		mesh: new f.MeshLambertMaterial({
			fog: !1,
			transparent: !0,
			opacity: .1,
			side: f.DoubleSide,
			reflectivity: .15,
			color: new f.Color(11184810),
			depthWrite: !0,
			depthTest: !1,
			name: "surface-material"
		}),
		wire: new f.MeshBasicMaterial({
			fog: !1,
			side: f.FrontSide,
			wireframe: !0,
			color: 2895149,
			name: "surface-wireframe-material"
		}),
		line: new f.LineBasicMaterial({
			fog: !1,
			color: 10066329,
			name: "surface-edges-material"
		})
	},
	wireframeVisible: !1,
	edgesVisible: !0,
	fillSurface: !0,
	displayVertexNormals: !1,
	scatteringCoefficient: .1
};
function wt(e) {
	let t = new f.BufferGeometry();
	if (!e.data) return t;
	let n = e.data.attributes;
	return n.position && t.setAttribute("position", new f.BufferAttribute(new Float32Array(n.position.array), n.position.itemSize, n.position.normalized)), n.normals ? t.setAttribute("normals", new f.BufferAttribute(new Float32Array(n.normals.array), n.normals.itemSize, n.normals.normalized)) : (t.computeVertexNormals(), t.setAttribute("normals", t.getAttribute("normal"))), n.texCoords && t.setAttribute("texCoords", new f.BufferAttribute(new Float32Array(n.texCoords.array), n.texCoords.itemSize, n.texCoords.normalized)), e.name && (t.name = e.name), e.uuid && (t.uuid = e.uuid), t;
}
var $ = class e extends o {
	mesh;
	wire;
	edges;
	center;
	triangles;
	fillSurface;
	vertexNormals;
	_triangles;
	selectedMaterial;
	normalMaterial;
	normalColor;
	tessellatedMesh = null;
	numHits;
	absorption;
	absorptionFunction;
	reflection;
	reflectionFunction;
	_scatteringCoefficient;
	scatteringFunction;
	_acousticMaterial;
	brdf;
	area;
	isPlanar;
	edgeLoop;
	polygon;
	normal;
	eventDestructors;
	constructor(e, t) {
		super(e), this.kind = "surface", this.eventDestructors = [], t && this.init(t, !0);
	}
	destroyEvents() {
		for (; this.eventDestructors.length > 0;) this.eventDestructors[this.eventDestructors.length - 1](), this.eventDestructors.pop();
	}
	init(e, t = !1) {
		t || (this.remove(this.mesh), this.remove(this.wire), this.remove(this.edges), this.remove(this.vertexNormals), this.destroyEvents());
		let n = {
			...Q,
			...e
		};
		this.numHits = 0, this.fillSurface = n.fillSurface, this.wire = new f.Mesh(n.geometry, n.materials.wire), this.wire.geometry.name = "surface-wire-geometry", this.mesh = new f.Mesh(n.geometry, n.materials.mesh), this.mesh.geometry.name = "surface-geometry", this.mesh.geometry.computeBoundingBox(), this.mesh.geometry.computeBoundingSphere(), this.mesh.geometry.computeVertexNormals(), this.vertexNormals = new ge(this.mesh, .25, 16711680), this.vertexNormals.geometry.name = "surface-vertex-normals-geometry", this.triangles = g(g(Array.from(n.geometry.getAttribute("position").array), 3), 3), this._triangles = this.triangles.map((e) => new f.Triangle(new f.Vector3(e[0][0], e[0][1], e[0][2]), new f.Vector3(e[1][0], e[1][1], e[1][2]), new f.Vector3(e[2][0], e[2][1], e[2][2]))), this.normal = new f.Vector3(), this._triangles[0].getNormal(this.normal), this.center = new f.Vector3();
		let r = 0;
		this._triangles.forEach((e) => {
			let t = e.getArea();
			r += t, this.center.add(e.getMidpoint(new f.Vector3()).multiplyScalar(t));
		}), this.center.divideScalar(r), this.selectedMaterial = Q.materials.selected, this.normalMaterial = Q.materials.mesh, this.normalColor = new f.Color(11184810);
		let i = {};
		this.triangles.forEach((e, t) => {
			let n = this._triangles[t].getNormal(new f.Vector3()).toArray().map((e) => ee(e, 5));
			for (let r = 0; r < 3; r++) {
				let a = [e[r], e[(r + 1) % 3]], o = JSON.stringify([a.sort(), n]);
				i[o] ? i[o].keep = !1 : i[o] = {
					keep: !0,
					line: a,
					triangle_normal: n,
					triangle_index: t
				};
			}
		});
		let a = [];
		Object.keys(i).reduce((e, t) => (i[t].keep && e.push(i[t].line), e), []).forEach((e) => {
			e.forEach((e) => {
				a.push(e[0], e[1], e[2]);
			});
		});
		let o = new f.BufferGeometry();
		o.setAttribute("position", new f.Float32BufferAttribute(a, 3)), this.edges = new f.LineSegments(o, Q.materials.line), this.edges.geometry.name = "surface-edges-geometry", this.add(this.mesh), this.mesh.visible = this.fillSurface, this.add(this.wire), this.wireframeVisible = e.wireframeVisible || Q.wireframeVisible, this.add(this.edges), this.edgesVisible = e.edgesVisible || Q.edgesVisible, this.add(this.vertexNormals), this.displayVertexNormals = e.displayVertexNormals || Q.displayVertexNormals, this.absorption = [
			0,
			.04,
			.23,
			.52,
			.9,
			.94,
			.66,
			.66
		];
		let s = [
			63,
			125,
			250,
			500,
			1e3,
			2e3,
			4e3,
			8e3
		];
		this.absorptionFunction = _(this.absorption, s), this.reflectionFunction = (e, t) => ve(this.absorptionFunction(e), t), this.scatteringCoefficient = e.scatteringCoefficient || Q.scatteringCoefficient, this.acousticMaterial = e.acousticMaterial, this.getArea(), this.edgeLoop = this.calculateEdgeLoop();
		let c = this.edgeLoop.map((e) => X.math.vec3.fromArray([
			e.x,
			e.y,
			e.z
		])), l = X.math.plane.fromPoints(X.math.plane.create(), c[0], c[1], c[2]);
		this.polygon = X.geometry.poly3.fromPointsAndPlane(c, l);
		let u = _t(1e-6), d = (e, t) => !u(e.x, t[0]) || !u(e.y, t[1]) || !u(e.z, t[2]);
		d(this.normal, this.polygon.plane) && (this.polygon = X.geometry.poly3.fromPointsAndPlane(c, X.math.plane.fromPoints(X.math.plane.create(), c[2], c[1], c[0])), d(this.normal, this.polygon.plane));
	}
	dispose() {
		this.parent && this.parent.remove(this);
	}
	save() {
		return {
			kind: this.kind,
			visible: this.visible,
			acousticMaterial: this.acousticMaterial,
			geometry: this.mesh.geometry.toJSON(),
			displayVertexNormals: this.displayVertexNormals,
			fillSurface: this.fillSurface,
			wireframeVisible: this.wireframeVisible,
			edgesVisible: this.edgesVisible,
			scatteringCoefficient: this.scatteringCoefficient,
			name: this.name,
			position: this.position.toArray(),
			rotation: this.rotation.toArray().slice(0, 3),
			scale: this.scale.toArray(),
			uuid: this.uuid
		};
	}
	restore(e) {
		return this.init({
			acousticMaterial: e.acousticMaterial,
			geometry: wt(e.geometry),
			wireframeVisible: e.wireframeVisible,
			edgesVisible: e.edgesVisible,
			fillSurface: e.fillSurface,
			displayVertexNormals: e.displayVertexNormals,
			scatteringCoefficient: e.scatteringCoefficient
		}), this.visible = e.visible, this.uuid = e.uuid, this.position.set(e.position[0], e.position[1], e.position[2]), this.rotation.set(e.rotation[0], e.rotation[1], e.rotation[2], "XYZ"), this.scale.set(e.scale[0], e.scale[1], e.scale[2]), this;
	}
	select() {
		this.selected = !0, this.mesh.material = this.selectedMaterial, this.mesh.material.needsUpdate = !0;
	}
	deselect() {
		this.selected = !1, this.mesh.material = this.normalMaterial, this.mesh.material.needsUpdate = !0;
	}
	hover() {
		this.selected || (this.mesh.material = Q.materials.hovered, this.mesh.material.needsUpdate = !0);
	}
	unhover() {
		this.selected ? this.mesh.material = this.selectedMaterial : this.mesh.material = this.normalMaterial, this.mesh.material.needsUpdate = !0;
	}
	resetHits() {
		this.numHits = 0;
	}
	getArea() {
		this.area = 0;
		for (let e = 0; e < this._triangles.length; e++) this.area += this._triangles[e].getArea();
		return this.area;
	}
	getEdges() {
		return this.edges;
	}
	calculateEdgeLoop() {
		let e = this.edges.geometry.getAttribute("position"), t = [];
		for (let n = 0; n < e.count; n++) t.push(new f.Vector3(e.getX(n), e.getY(n), e.getZ(n)));
		let n = g(t, 2), r = [], i = 0;
		for (r.push(n[i][0]), r.push(n[i][1]); r.length < n.length;) for (let e = 0; e < n.length; e++) if (e !== i) {
			if (r[r.length - 1].equals(n[e][0])) {
				r.push(n[e][1]), i = e;
				break;
			}
			if (r[r.length - 1].equals(n[e][1])) {
				r.push(n[e][0]), i = e;
				break;
			}
		}
		return r;
	}
	mergeSurfaces(t) {
		let n = this.name + "-merged", r = this.acousticMaterial, i = new f.BufferGeometry(), a = {};
		for (let e = 0; e < t.length; e++) {
			let n = t[e].mesh.geometry;
			Object.keys(n.attributes).forEach((e) => {
				e.match(/position|normals?/gim) && (a[e] ? a[e].arr = a[e].arr.concat(Array.from(n.attributes[e].array)) : a[e] = {
					arr: Array.from(n.attributes[e].array),
					itemSize: n.attributes[e].itemSize
				});
			});
		}
		return Object.keys(a).forEach((e) => {
			i.setAttribute(e, new f.BufferAttribute(new Float32Array(a[e].arr), a[e].itemSize));
		}), new e(n, {
			geometry: i,
			acousticMaterial: r
		});
	}
	tessellate(e) {
		this.tessellatedMesh && this.remove(this.tessellatedMesh);
		let t = e.modify(this.geometry);
		this.tessellatedMesh = new f.Mesh(t, this.wire.material), this.add(this.tessellatedMesh);
		let n = t.getAttribute("position"), r = [];
		for (let e = 0; e < n.count; e += 3) {
			let t = new Ct(n, e + 0, e + 1, e + 2);
			r.push(t);
		}
		return this.tessellatedMesh;
	}
	get edgesVisible() {
		return this.edges.visible;
	}
	set edgesVisible(e) {
		this.edges.visible = e;
	}
	get acousticMaterial() {
		return this._acousticMaterial;
	}
	set acousticMaterial(e) {
		this._acousticMaterial = e;
		let t = Object.keys(this._acousticMaterial.absorption).map((e) => Number(e));
		if (this.absorption = t.map((e) => this._acousticMaterial.absorption[String(e)]), this.absorptionFunction = _(this.absorption, t), this.reflectionFunction = (e, t) => ve(this.absorptionFunction(e), t), e.scattering) {
			let t = Object.keys(e.scattering).map(Number), n = t.map((t) => e.scattering[String(t)]);
			this.scatteringFunction = _(n, t), this._scatteringCoefficient = this.scatteringFunction(500);
		}
		this.brdf = [], Object.keys(this.acousticMaterial.absorption).map(Number).forEach((e) => {
			this.brdf.push(new be({
				absorptionCoefficient: this.acousticMaterial.absorption[String(e)],
				diffusionCoefficient: this.scatteringFunction(e)
			}));
		});
	}
	get displayVertexNormals() {
		return this.vertexNormals.visible;
	}
	set displayVertexNormals(e) {
		this.vertexNormals.visible = e;
	}
	get geometry() {
		return this.mesh.geometry;
	}
	get faces() {
		return this._triangles;
	}
	get wireframeVisible() {
		return this.wire.visible;
	}
	set wireframeVisible(e) {
		this.wire.visible = e;
	}
	get tessellatedMeshVisible() {
		return this.tessellatedMesh ? this.tessellatedMesh.visible : !1;
	}
	set tessellatedMeshVisible(e) {
		this.tessellatedMesh && (this.tessellatedMesh.visible = e);
	}
	get isTessellated() {
		return this.tessellatedMesh !== null;
	}
	get room() {
		return this.parent.parent;
	}
	get brief() {
		return {
			uuid: this.uuid,
			name: this.name,
			selected: this.selected,
			kind: this.kind,
			children: []
		};
	}
	get scatteringCoefficient() {
		return this._scatteringCoefficient;
	}
	set scatteringCoefficient(e) {
		this._scatteringCoefficient = e, this.scatteringFunction = St(e);
	}
};
t("ADD_SURFACE", s($)), t("REMOVE_SURFACE", u), t("SURFACE_SET_PROPERTY", l), t("SURFACE_HOVER", (e) => {
	let { containers: t } = c.getState(), n = t[e];
	n && n.hover && (n.hover(), r("RENDER", void 0));
}), t("SURFACE_UNHOVER", (e) => {
	let { containers: t } = c.getState(), n = t[e];
	n && n.unhover && (n.unhover(), r("RENDER", void 0));
});
//#endregion
//#region src/objects/room.ts
var Tt = class e extends o {
	boundingBox;
	surfaces;
	volume;
	units;
	originalFileName;
	originalFileData;
	surfaceMap;
	temperature;
	humidity;
	constructor(e, t) {
		super(e || "new room"), this.kind = "room", this.temperature = t?.temperature ?? 20, this.humidity = t?.humidity ?? 40, t && this.init(t, !0);
	}
	init(e, t = !1) {
		t || this.remove(this.surfaces), this.surfaces = new o("surfaces"), this.originalFileName = e.originalFileName || "", this.originalFileData = e.originalFileData || "", this.units = e.units || d.METERS, e.surfaces.forEach((e) => {
			e.kind === "surface" && r("ADD_SURFACE", e), e.traverse((e) => {
				e.kind && e.kind === "surface" && r("ADD_SURFACE", e);
			}), this.surfaces.add(e);
		}), this.add(this.surfaces), this.calculateBoundingBox(), this.volume = this.volumeOfMesh(), this.surfaceMap = this.allSurfaces.reduce((e, t) => (e[t.uuid] = t, e), {}), a.add(this);
	}
	dispose() {
		a.remove(this), this.allSurfaces.forEach((e) => {
			r("REMOVE_SURFACE", e.uuid);
		});
	}
	save() {
		return {
			surfaces: this.surfaces.children.map((e) => e.save()),
			kind: this.kind,
			name: this.name,
			uuid: this.uuid,
			units: this.units,
			originalFileData: this.originalFileData,
			originalFileName: this.originalFileName,
			visible: this.visible,
			position: this.position.toArray(),
			rotation: this.rotation.toArray().slice(0, 3),
			scale: this.scale.toArray(),
			temperature: this.temperature,
			humidity: this.humidity
		};
	}
	restore(e) {
		function t(e) {
			if (e.kind === "surface") return new $(e.name).restore(e);
			{
				let n = new o(e.name).restore(e);
				return e.children?.forEach((e) => {
					n.add(t(e));
				}), n;
			}
		}
		return this.init({
			...e,
			surfaces: e.surfaces.map((e) => t(e))
		}), this.visible = e.visible, this.position.set(e.position[0], e.position[1], e.position[2]), this.rotation.set(e.rotation[0], e.rotation[1], e.rotation[2], "XYZ"), this.scale.set(e.scale[0], e.scale[1], e.scale[2]), this.uuid = e.uuid, this.temperature = e.temperature ?? 20, this.humidity = e.humidity ?? 40, this;
	}
	static from(t) {
		return new e(t.name).restore(t);
	}
	select() {
		this.surfaces.select();
	}
	deselect() {
		this.surfaces.deselect();
	}
	calculateBoundingBox() {
		return this.boundingBox = this.allSurfaces.reduce((e, t) => {
			t.geometry.computeBoundingBox();
			let n = t.geometry.boundingBox;
			return n ? e.union(n) : e;
		}, new f.Box3()), this.boundingBox;
	}
	signedVolumeOfTriangle(e, t, n) {
		return e.dot(t.clone().cross(n)) / 6;
	}
	volumeOfMesh() {
		let e = 0;
		return this.allSurfaces.forEach((t) => {
			t._triangles.forEach((t) => {
				e += this.signedVolumeOfTriangle(t.a, t.b, t.c);
			});
		}), Math.abs(e);
	}
	calculateMeanAbsorptionCoefficientFromHits(e = te) {
		let t = 0, n = [];
		for (let r = 0; r < this.allSurfaces.length; r++) {
			let i = this.allSurfaces[r].numHits;
			t += i, n.push(e.map((e) => this.allSurfaces[r].absorptionFunction(e) * i));
		}
		if (t > 0) {
			console.log(n);
			let r = [];
			for (let i = 0; i < e.length; i++) {
				let e = 0;
				for (let t = 0; t < n.length; t++) e += n[t][i];
				r.push(e / t);
			}
			return {
				meanAbsorption: r,
				totalHits: t
			};
		}
		return {
			meanAbsorption: Array(n[0].length).fill(0),
			totalHits: 0
		};
	}
	calculateRT60FromHits(e = te) {
		this.volume = this.volumeOfMesh();
		let t = ne[this.units] || ne[d.METERS], { totalHits: n, meanAbsorption: r } = this.calculateMeanAbsorptionCoefficientFromHits(e), i = this.allSurfaces.reduce((e, t) => e + t.getArea(), 0);
		return n > 0 ? [e, r.map((e) => t * this.volume / (e * i))] : [e, r];
	}
	tessellateSurfaces(e = .1, t = 6) {
		let n = new re(e, t);
		this.allSurfaces.forEach((e) => e.tessellate(n));
	}
	get allSurfaces() {
		let e = [];
		return this.surfaces.traverse((t) => {
			t.kind && t.kind === "surface" && e.push(t);
		}), e;
	}
	get brief() {
		return {
			uuid: this.uuid,
			name: this.name,
			selected: this.selected,
			children: this.allSurfaces.map((e) => e.brief),
			kind: this.kind
		};
	}
};
t("ADD_ROOM", s(Tt)), t("REMOVE_ROOM", u), t("ROOM_SET_PROPERTY", l);
var Et = () => i("room");
//#endregion
export { me as a, de as c, _t as i, Et as n, fe as o, $ as r, pe as s, Tt as t };

//# sourceMappingURL=room-BwaogGM4.mjs.map