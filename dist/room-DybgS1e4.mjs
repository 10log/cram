import { d as e, t, u as n } from "./renderer-Ca4ltx3N.mjs";
import { t as r } from "./round-to-FZU9bzmC.mjs";
import { n as i, r as a } from "./reflection-coefficient-BNE0JULn.mjs";
import { d as o, g as s, h as c, m as l, s as u } from "./store-Cb8r9O09.mjs";
import { O as d, S as f, b as p, f as m } from "./FileSaver.min-C7ZD-uW3.mjs";
import { t as ee } from "./rt-constants-BAMpsGPB.mjs";
import { t as te } from "./acoustics-Cs_0VALc.mjs";
import { t as ne } from "./TessellateModifier-IYRd7LWy.mjs";
import * as h from "three";
import { BufferGeometry as re, Float32BufferAttribute as ie, LineBasicMaterial as ae, LineSegments as oe, Matrix3 as se, Vector3 as ce } from "three";
// node_modules/three/examples/jsm/helpers/VertexNormalsHelper.js
var g = new ce(), _ = new ce(), le = new se(), ue = class extends oe {
	constructor(e, t = 1, n = 16711680) {
		let r = new re(), i = e.geometry.attributes.normal.count, a = new ie(i * 2 * 3, 3);
		r.setAttribute("position", a), super(r, new ae({
			color: n,
			toneMapped: !1
		})), this.object = e, this.size = t, this.type = "VertexNormalsHelper", this.matrixAutoUpdate = !1, this.isVertexNormalsHelper = !0, this.update();
	}
	update() {
		this.object.updateMatrixWorld(!0), le.getNormalMatrix(this.object.matrixWorld);
		let e = this.object.matrixWorld, t = this.geometry.attributes.position, n = this.object.geometry;
		if (n) {
			let r = n.attributes.position, i = n.attributes.normal, a = 0;
			for (let n = 0, o = r.count; n < o; n++) g.fromBufferAttribute(r, n).applyMatrix4(e), _.fromBufferAttribute(i, n), _.applyMatrix3(le).normalize().multiplyScalar(this.size).add(g), t.setXYZ(a, g.x, g.y, g.z), a += 1, t.setXYZ(a, _.x, _.y, _.z), a += 1;
		}
		t.needsUpdate = !0;
	}
	dispose() {
		this.geometry.dispose(), this.material.dispose();
	}
};
// src/common/chunk.ts
function v(e, t) {
	for (var n = [], r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
// src/compute/acoustics/interpolate-log.ts
function de(e, t, n, r, i) {
	return t + (Math.log10(i) - Math.log10(e)) / (Math.log10(n) - Math.log10(e)) * (r - t);
}
// src/compute/acoustics/interpolate-alpha.ts
function y(e, t) {
	return function(n) {
		let r = 0;
		for (; n > t[r] && r < t.length;) r++;
		if (r > 0 && r < t.length) {
			let i = t[r - 1], a = e[r - 1], o = t[r], s = e[r];
			return de(i, a, o, s, n);
		}
		return r === 0 ? e[r] : e[t.length - 1];
	};
}
// src/common/discretize.ts
function fe(e, t, n) {
	return function(r) {
		return Math.round((n - t) / e * r);
	};
}
// src/compute/raytracer/brdf.ts
var pe = class {
	coefficients;
	steps;
	getIndex;
	constructor(e) {
		this.steps = e && e.steps || 10, this.coefficients = [];
		for (let e = 0; e < this.steps; e++) this.coefficients.push([]);
		this.getIndex = fe(this.steps, 0, Math.PI), this.set(e.absorptionCoefficient, e.diffusionCoefficient);
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
}, me = /* @__PURE__ */ d({
	booleans: () => Oe,
	color: () => q,
	colorModule: () => q,
	connectors: () => et,
	expansions: () => Ge,
	extrusions: () => Ue,
	geometry: () => P,
	hulls: () => qe,
	math: () => O,
	measurements: () => He,
	primitives: () => Te,
	text: () => Ye,
	transforms: () => Ve,
	utils: () => Qe
}), b = await import(
	/* @vite-ignore */
	(typeof window < "u" ? window.location.origin : "") + "/compute/modeling/jscad-modeling-bundle.js"
).then((e) => e.default), { maths: he } = b, { vec2: x, vec3: S, mat4: C, plane: w, line2: T, line3: E } = he, ge = {
	...x,
	create: (e) => e ? x.fromValues(e[0] || 0, e[1] || 0) : x.create(),
	fromArray: (e) => x.fromValues(e[0], e[1]),
	fromValues: x.fromValues,
	clone: x.clone,
	add: x.add,
	subtract: x.subtract,
	scale: x.scale,
	dot: x.dot,
	cross: x.cross,
	length: x.length,
	normalize: x.normalize,
	distance: x.distance,
	equals: x.equals,
	transform: x.transform,
	negate: x.negate,
	rotate: x.rotate,
	angle: x.angle,
	lerp: x.lerp,
	min: x.min,
	max: x.max,
	abs: x.abs,
	squaredLength: x.squaredLength,
	squaredDistance: x.squaredDistance
}, D = {
	...S,
	create: (e) => e ? S.fromValues(e[0] || 0, e[1] || 0, e[2] || 0) : S.create(),
	fromArray: (e) => S.fromValues(e[0], e[1], e[2]),
	fromValues: S.fromValues,
	clone: S.clone,
	add: S.add,
	subtract: S.subtract,
	scale: S.scale,
	dot: S.dot,
	cross: S.cross,
	length: S.length,
	normalize: S.normalize,
	distance: S.distance,
	equals: S.equals,
	transform: S.transform,
	negate: S.negate,
	angle: S.angle,
	lerp: S.lerp,
	min: S.min,
	max: S.max,
	abs: S.abs,
	squaredLength: S.squaredLength,
	squaredDistance: S.squaredDistance,
	unit: S.normalize
}, O = {
	vec2: ge,
	vec3: D,
	mat4: {
		...C,
		create: C.create,
		clone: C.clone,
		identity: C.identity,
		fromValues: C.fromValues,
		fromTranslation: C.fromTranslation,
		fromScaling: C.fromScaling,
		fromRotation: C.fromRotation,
		fromXRotation: C.fromXRotation,
		fromYRotation: C.fromYRotation,
		fromZRotation: C.fromZRotation,
		fromTaitBryanRotation: C.fromTaitBryanRotation,
		multiply: C.multiply,
		translate: C.translate,
		rotate: C.rotate,
		rotateX: C.rotateX,
		rotateY: C.rotateY,
		rotateZ: C.rotateZ,
		scale: C.scale,
		invert: C.invert,
		equals: C.equals,
		mirrorByPlane: C.mirrorByPlane,
		transform: C.transform
	},
	plane: {
		...w,
		create: w.create,
		clone: w.clone,
		equals: w.equals,
		flip: w.flip,
		fromPoints: w.fromPoints,
		fromNormalAndPoint: w.fromNormalAndPoint,
		signedDistanceToPoint: w.signedDistanceToPoint,
		transform: w.transform,
		fromPointsRandom: (e, t, n) => w.fromPoints(w.create(), e, t, n)
	},
	line2: {
		...T,
		create: T.create,
		clone: T.clone,
		equals: T.equals,
		fromPoints: T.fromPoints,
		direction: T.direction,
		origin: T.origin,
		closestPoint: T.closestPoint,
		distanceToPoint: T.distanceToPoint,
		transform: T.transform
	},
	line3: {
		...E,
		create: E.create,
		clone: E.clone,
		equals: E.equals,
		fromPoints: E.fromPoints,
		direction: E.direction,
		origin: E.origin,
		closestPoint: E.closestPoint,
		distanceToPoint: E.distanceToPoint,
		transform: E.transform
	},
	constants: he.constants
}, { geometries: _e } = b, { geom2: k, geom3: A, path2: j, poly3: M } = _e, ve = {
	...k,
	create: k.create,
	clone: k.clone,
	isA: k.isA,
	toOutlines: k.toOutlines,
	toPoints: k.toPoints,
	transform: k.transform,
	reverse: k.reverse
}, N = {
	...A,
	create: A.create,
	clone: A.clone,
	isA: A.isA,
	toPolygons: A.toPolygons,
	transform: A.transform,
	fromPolygons: (e) => {
		let t = e.map((e) => M.isA(e) ? e : e.vertices ? M.create(e.vertices) : M.create(e));
		return A.create(t);
	}
}, P = {
	geom2: ve,
	geom3: N,
	path2: {
		...j,
		create: j.create,
		clone: j.clone,
		isA: j.isA,
		toPoints: j.toPoints,
		transform: j.transform,
		close: j.close,
		concat: j.concat,
		fromPoints: j.fromPoints,
		appendPoints: j.appendPoints,
		appendArc: j.appendArc,
		appendBezier: j.appendBezier,
		equals: j.equals,
		reverse: j.reverse
	},
	poly3: {
		...M,
		create: M.create,
		clone: M.clone,
		isA: M.isA,
		fromPoints: M.fromPoints,
		toPoints: (e) => e.vertices || M.toVertices(e),
		toVertices: M.toVertices,
		transform: M.transform,
		plane: (e) => {
			if (e.plane) return e.plane;
			let t = e.vertices || M.toVertices(e);
			return t.length >= 3 ? w.fromPoints(w.create(), t[0], t[1], t[2]) : w.create();
		},
		flip: (e) => ({
			vertices: (e.vertices || M.toVertices(e)).slice().reverse(),
			plane: e.plane ? w.flip(w.create(), e.plane) : null
		}),
		fromPointsAndPlane: (e, t) => ({
			vertices: e,
			plane: t
		}),
		measureBoundingSphere: (e) => {
			let t = e.vertices || M.toVertices(e);
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
}, { primitives: F } = b, I = (e) => e.reduce((e, t) => Array.isArray(t) ? e.concat(I(t)) : e.concat(t), []), ye = (e = {}) => {
	let t = e.size ?? 1, n = Array.isArray(t) ? t : [
		t,
		t,
		t
	], r = e.center, i = F.cuboid({ size: n });
	return r && (i = b.transforms.translate(r, i)), i;
}, be = (e = {}) => {
	let t = e.radius ?? e.r ?? 1, n = e.segments ?? e.resolution ?? 32, r = e.center, i = F.sphere({
		radius: t,
		segments: n
	});
	return r && (i = b.transforms.translate(r, i)), i;
}, xe = (e = {}) => {
	let t = e.radius ?? e.r ?? 1, n = e.height ?? e.h ?? 1, r = e.segments ?? e.resolution ?? 32, i = e.r1 ?? t, a = e.r2 ?? t, o = e.center, s;
	return s = i === a ? F.cylinder({
		radius: t,
		height: n,
		segments: r
	}) : F.cylinderElliptic({
		height: n,
		startRadius: [i, i],
		endRadius: [a, a],
		segments: r
	}), o && (s = b.transforms.translate(o, s)), s;
}, Se = (e = {}) => {
	let t = e.innerRadius ?? e.ri ?? 1, n = e.outerRadius ?? e.ro ?? 4, r = e.innerSegments ?? e.innerResolution ?? 32, i = e.outerSegments ?? e.outerResolution ?? 32;
	return F.torus({
		innerRadius: t,
		outerRadius: n,
		innerSegments: r,
		outerSegments: i
	});
}, Ce = (e = {}) => {
	let t = e.points || [], n = e.faces || e.triangles || [];
	return F.polyhedron({
		points: t,
		faces: n
	});
}, we = (e = {}) => {
	let t = e.size ?? [1, 1], n = e.center, r = F.rectangle({ size: t });
	return n && (r = b.transforms.translate([
		n[0],
		n[1],
		0
	], r)), r;
}, Te = {
	cube: ye,
	cuboid: F.cuboid,
	sphere: be,
	cylinder: xe,
	torus: Se,
	polyhedron: Ce,
	rectangle: we,
	square: we,
	circle: (e = {}) => {
		let t = e.radius ?? e.r ?? 1, n = e.segments ?? e.resolution ?? 32, r = e.center, i = F.circle({
			radius: t,
			segments: n
		});
		return r && (i = b.transforms.translate([
			r[0],
			r[1],
			0
		], i)), i;
	},
	ellipse: F.ellipse,
	polygon: (e = {}) => {
		let t = e.points || [];
		return F.polygon({ points: t });
	},
	arc: F.arc,
	ellipsoid: F.ellipsoid,
	geodesicSphere: F.geodesicSphere,
	roundedCuboid: F.roundedCuboid,
	roundedCylinder: F.roundedCylinder,
	roundedRectangle: F.roundedRectangle,
	star: F.star,
	line: F.line
}, { booleans: L } = b, Ee = (...e) => {
	let t = I(e);
	return t.length === 0 ? N.create() : t.length === 1 ? t[0] : L.union(t);
}, De = (...e) => {
	let t = I(e);
	return t.length === 0 ? N.create() : t.length === 1 ? t[0] : L.subtract(t);
}, Oe = {
	union: Ee,
	subtract: De,
	intersect: (...e) => {
		let t = I(e);
		return t.length === 0 ? N.create() : t.length === 1 ? t[0] : L.intersect(t);
	},
	difference: De
}, { transforms: R } = b, z = (e, ...t) => {
	let n = I(t);
	if (n.length === 0) return N.create();
	let r = n.map((t) => R.translate(e, t));
	return r.length === 1 ? r[0] : r;
}, ke = (e, ...t) => z([
	e,
	0,
	0
], ...t), Ae = (e, ...t) => z([
	0,
	e,
	0
], ...t), je = (e, ...t) => z([
	0,
	0,
	e
], ...t), B = (e, ...t) => {
	let n = I(t);
	if (n.length === 0) return N.create();
	let r = n.map((t) => R.rotate(e, t));
	return r.length === 1 ? r[0] : r;
}, Me = (e, ...t) => B([
	e,
	0,
	0
], ...t), Ne = (e, ...t) => B([
	0,
	e,
	0
], ...t), Pe = (e, ...t) => B([
	0,
	0,
	e
], ...t), V = (e, ...t) => {
	let n = I(t);
	if (n.length === 0) return N.create();
	let r = n.map((t) => R.scale(e, t));
	return r.length === 1 ? r[0] : r;
}, Fe = (e, ...t) => V([
	e,
	1,
	1
], ...t), Ie = (e, ...t) => V([
	1,
	e,
	1
], ...t), Le = (e, ...t) => V([
	1,
	1,
	e
], ...t), H = (e, ...t) => {
	let n = I(t);
	if (n.length === 0) return N.create();
	let r = n.map((t) => R.mirror(e, t));
	return r.length === 1 ? r[0] : r;
}, Re = (...e) => H({ normal: [
	1,
	0,
	0
] }, ...e), ze = (...e) => H({ normal: [
	0,
	1,
	0
] }, ...e), Be = (...e) => H({ normal: [
	0,
	0,
	1
] }, ...e), U = (e = {}, ...t) => {
	let n = I(t);
	if (n.length === 0) return N.create();
	let r = n.map((t) => R.center(e, t));
	return r.length === 1 ? r[0] : r;
}, Ve = {
	translate: z,
	translateX: ke,
	translateY: Ae,
	translateZ: je,
	rotate: B,
	rotateX: Me,
	rotateY: Ne,
	rotateZ: Pe,
	scale: V,
	scaleX: Fe,
	scaleY: Ie,
	scaleZ: Le,
	mirror: H,
	mirrorX: Re,
	mirrorY: ze,
	mirrorZ: Be,
	center: U,
	centerX: (...e) => U({ axes: [
		!0,
		!1,
		!1
	] }, ...e),
	centerY: (...e) => U({ axes: [
		!1,
		!0,
		!1
	] }, ...e),
	centerZ: (...e) => U({ axes: [
		!1,
		!1,
		!0
	] }, ...e),
	transform: (e, ...t) => {
		let n = I(t);
		if (n.length === 0) return N.create();
		let r = n.map((t) => R.transform(e, t));
		return r.length === 1 ? r[0] : r;
	},
	align: R.align
}, { measurements: W } = b, He = {
	measureArea: W.measureArea,
	measureBoundingBox: W.measureBoundingBox,
	measureBoundingSphere: W.measureBoundingSphere,
	measureCenter: W.measureCenter,
	measureCenterOfMass: W.measureCenterOfMass,
	measureDimensions: W.measureDimensions,
	measureVolume: W.measureVolume,
	measureAggregateArea: W.measureAggregateArea,
	measureAggregateVolume: W.measureAggregateVolume,
	measureAggregateBoundingBox: W.measureAggregateBoundingBox,
	measureEpsilon: W.measureEpsilon
}, { extrusions: G } = b, Ue = {
	extrudeLinear: (e, ...t) => {
		let n = I(t);
		if (n.length === 0) return N.create();
		let r = n.map((t) => G.extrudeLinear(e, t));
		return r.length === 1 ? r[0] : r;
	},
	extrudeRotate: (e, ...t) => {
		let n = I(t);
		if (n.length === 0) return N.create();
		let r = n.map((t) => G.extrudeRotate(e, t));
		return r.length === 1 ? r[0] : r;
	},
	extrudeRectangular: G.extrudeRectangular,
	extrudeFromSlices: G.extrudeFromSlices,
	extrudeHelical: G.extrudeHelical
}, { expansions: We } = b, Ge = {
	expand: (e, ...t) => {
		let n = I(t);
		if (n.length === 0) return N.create();
		let r = n.map((t) => We.expand(e, t));
		return r.length === 1 ? r[0] : r;
	},
	offset: (e, ...t) => {
		let n = I(t);
		if (n.length === 0) return ve.create();
		let r = n.map((t) => We.offset(e, t));
		return r.length === 1 ? r[0] : r;
	}
}, { hulls: Ke } = b, qe = {
	hull: (...e) => {
		let t = I(e);
		return t.length === 0 ? N.create() : Ke.hull(t);
	},
	hullChain: (...e) => {
		let t = I(e);
		return t.length === 0 ? N.create() : Ke.hullChain(t);
	}
}, { text: Je } = b, Ye = {
	vectorText: Je.vectorText,
	vectorChar: Je.vectorChar
}, { colors: K } = b, Xe = {
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
}, q = {
	color: (e, ...t) => {
		let n;
		n = typeof e == "string" ? [...Xe[e.toLowerCase()] || K.colorNameToRgb(e), 1] : e.length === 3 ? [...e, 1] : e;
		let r = I(t).map((e) => K.colorize(n, e));
		return r.length === 1 ? r[0] : r;
	},
	cssColors: Xe,
	colorize: K.colorize,
	colorNameToRgb: K.colorNameToRgb,
	hexToRgb: K.hexToRgb,
	hslToRgb: K.hslToRgb,
	hsvToRgb: K.hsvToRgb,
	rgbToHex: K.rgbToHex,
	rgbToHsl: K.rgbToHsl,
	rgbToHsv: K.rgbToHsv
}, { utils: Ze } = b, Qe = {
	flatten: I,
	degToRad: Ze.degToRad,
	radToDeg: Ze.radToDeg
}, $e = class e {
	point;
	axisvector;
	normalvector;
	constructor(e, t, n) {
		this.point = e, this.axisvector = D.normalize(D.create(), t), this.normalvector = D.normalize(D.create(), n);
	}
	normalized() {
		return new e(this.point, D.normalize(D.create(), this.axisvector), D.normalize(D.create(), this.normalvector));
	}
	transform(t) {
		let n = D.transform(D.create(), this.point, t), r = D.transform(D.create(), this.axisvector, t), i = D.transform(D.create(), this.normalvector, t);
		return new e(n, r, i);
	}
}, et = {
	Connector: $e,
	create: (e, t, n) => new $e(e, t, n)
}, { plane: J, vec3: Y } = O, { poly3: X } = P, Z = 1e-5, tt = (e, t, n) => {
	let r = Y.subtract(Y.create(), n, t), i = (e[3] - Y.dot(e, t)) / Y.dot(e, r);
	Number.isNaN(i) && (i = 0), i > 1 && (i = 1), i < 0 && (i = 0);
	let a = Y.create();
	return Y.scale(a, r, i), Y.add(a, a, t), a;
}, nt = (e, t) => {
	let n = {
		type: 0,
		front: null,
		back: null
	}, r = t.vertices || X.toVertices(t), i = r.length, a = t.plane || (r.length >= 3 ? J.fromPoints(J.create(), r[0], r[1], r[2]) : J.create());
	if (J.equals(a, e)) n.type = 0;
	else {
		let t = !1, o = !1, s = [];
		for (let n = 0; n < i; n++) {
			let i = Y.dot(e, r[n]) - e[3], a = i < 0;
			s.push(a), i > Z && (t = !0), i < -1e-5 && (o = !0);
		}
		if (!t && !o) n.type = Y.dot(e, a) >= 0 ? 0 : 1;
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
					let n = a, i = r[l], s = tt(e, n, i);
					c ? (o.push(a), o.push(s), t.push(s)) : (t.push(a), t.push(s), o.push(s));
				}
				c = u;
			}
			let l = Z * Z;
			if (o.length >= 3) {
				let e = o[o.length - 1];
				for (let t = 0; t < o.length; t++) {
					let n = o[t];
					Y.squaredDistance(n, e) < l && (o.splice(t, 1), t--), e = n;
				}
			}
			if (t.length >= 3) {
				let e = t[t.length - 1];
				for (let n = 0; n < t.length; n++) {
					let r = t[n];
					Y.squaredDistance(r, e) < l && (t.splice(n, 1), n--), e = r;
				}
			}
			t.length >= 3 && (n.front = rt(t, a)), o.length >= 3 && (n.back = rt(o, a));
		}
	}
	return n;
};
function rt(e, t) {
	return {
		vertices: e,
		plane: t
	};
}
function it(e) {
	let t = e.vertices || X.toVertices(e);
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
function at(e) {
	return {
		vertices: (e.vertices || X.toVertices(e)).slice().reverse(),
		plane: e.plane ? J.flip(J.create(), e.plane) : null
	};
}
var ot = class e {
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
			let [o, s] = it(a), c = s + Z, l = Y.dot(e, o) - e[3];
			if (l > c) r.push(this);
			else if (l < -c) i.push(this);
			else {
				let o = nt(e, a);
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
			for (let t of n) t.polygon &&= at(t.polygon), t.children.length > 0 && e.push(t.children);
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
}, st = class e {
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
			n.plane &&= J.flip(J.create(), n.plane), n.front && e.push(n.front), n.back && e.push(n.back);
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
				t.plane = e.plane || J.fromPoints(J.create(), e.vertices[0], e.vertices[1], e.vertices[2]);
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
}, ct = class {
	polygonTree;
	rootnode;
	constructor(e) {
		this.polygonTree = new ot(), this.rootnode = new st(null), e && this.addPolygons(e);
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
({ ...me });
var Q = {
	connectors: et,
	geometry: P,
	math: O,
	primitives: Te,
	text: Ye,
	booleans: Oe,
	expansions: Ge,
	extrusions: Ue,
	hulls: qe,
	measurements: He,
	transforms: Ve,
	color: q,
	utils: Qe,
	splitLineByPlane: tt,
	splitPolygonByPlane: nt,
	Tree: ct,
	PolygonTreeNode: ot,
	Node: st
};
// src/common/equal-within-range.ts
function lt(e) {
	return e ? (t) => (n, r) => e.reduce((e, i) => e && Math.abs(n[i] - r[i]) < t, !0) : (e) => (t, n) => Math.abs(t - n) < e;
}
var ut = lt();
// src/compute/acoustics/scattering-function.ts
function dt(e, t, n, r, i) {
	return t + (i - e) / (n - e) * (r - t);
}
var ft = (e, t) => {
	if (t <= e[0]) return [e[0], e[1]];
	if (t >= e[e.length - 1]) return [e[e.length - 2], e[e.length - 1]];
	for (let n = 1; n < e.length; n++) if (m(t, e[n - 1], e[n])) return [e[n - 1], e[n]];
	throw Error("value could not be found within input array");
}, pt = [
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
], mt = [
	63,
	125,
	250,
	500,
	1e3,
	2e3,
	4e3,
	8e3
], ht = [
	.01,
	.05,
	.25,
	.55,
	.8,
	.9
];
function gt(e) {
	let [t, n] = ft(ht, e), r = pt[ht.indexOf(t)], i = pt[ht.indexOf(n)];
	return y(r.map((a, o) => dt(t, r[o], n, i[o], e)), mt);
}
// src/objects/surface-element.ts
var _t = class {
	bufferAttribute;
	a;
	b;
	c;
	constructor(e, t, n, r) {
		this.bufferAttribute = e, this.a = t, this.b = n, this.c = r;
	}
}, $ = {
	materials: {
		selected: new h.MeshLambertMaterial({
			fog: !1,
			color: new h.Color(5227511),
			transparent: !0,
			opacity: .6,
			side: h.DoubleSide,
			reflectivity: .15,
			depthWrite: !0,
			depthTest: !1,
			name: "surface-selected-material"
		}),
		hovered: new h.MeshLambertMaterial({
			fog: !1,
			color: new h.Color(16771899),
			transparent: !0,
			opacity: .4,
			side: h.DoubleSide,
			reflectivity: .15,
			depthWrite: !0,
			depthTest: !1,
			name: "surface-hovered-material"
		}),
		mesh: new h.MeshLambertMaterial({
			fog: !1,
			transparent: !0,
			opacity: .1,
			side: h.DoubleSide,
			reflectivity: .15,
			color: new h.Color(11184810),
			depthWrite: !0,
			depthTest: !1,
			name: "surface-material"
		}),
		wire: new h.MeshBasicMaterial({
			fog: !1,
			side: h.FrontSide,
			wireframe: !0,
			color: 2895149,
			name: "surface-wireframe-material"
		}),
		line: new h.LineBasicMaterial({
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
function vt(e) {
	let t = new h.BufferGeometry();
	if (!e.data) return t;
	let n = e.data.attributes;
	return n.position && t.setAttribute("position", new h.BufferAttribute(new Float32Array(n.position.array), n.position.itemSize, n.position.normalized)), n.normals ? t.setAttribute("normals", new h.BufferAttribute(new Float32Array(n.normals.array), n.normals.itemSize, n.normals.normalized)) : (t.computeVertexNormals(), t.setAttribute("normals", t.getAttribute("normal"))), n.texCoords && t.setAttribute("texCoords", new h.BufferAttribute(new Float32Array(n.texCoords.array), n.texCoords.itemSize, n.texCoords.normalized)), e.name && (t.name = e.name), e.uuid && (t.uuid = e.uuid), t;
}
var yt = class e extends n {
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
	pressureReflectionFunction;
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
			...$,
			...e
		};
		this.numHits = 0, this.fillSurface = n.fillSurface, this.wire = new h.Mesh(n.geometry, n.materials.wire), this.wire.geometry.name = "surface-wire-geometry", this.mesh = new h.Mesh(n.geometry, n.materials.mesh), this.mesh.geometry.name = "surface-geometry", this.mesh.geometry.computeBoundingBox(), this.mesh.geometry.computeBoundingSphere(), this.mesh.geometry.computeVertexNormals(), this.vertexNormals = new ue(this.mesh, .25, 16711680), this.vertexNormals.geometry.name = "surface-vertex-normals-geometry", this.triangles = v(v(Array.from(n.geometry.getAttribute("position").array), 3), 3), this._triangles = this.triangles.map((e) => new h.Triangle(new h.Vector3(e[0][0], e[0][1], e[0][2]), new h.Vector3(e[1][0], e[1][1], e[1][2]), new h.Vector3(e[2][0], e[2][1], e[2][2]))), this.normal = new h.Vector3(), this._triangles[0].getNormal(this.normal), this.center = new h.Vector3();
		let o = 0;
		this._triangles.forEach((e) => {
			let t = e.getArea();
			o += t, this.center.add(e.getMidpoint(new h.Vector3()).multiplyScalar(t));
		}), this.center.divideScalar(o), this.selectedMaterial = $.materials.selected, this.normalMaterial = $.materials.mesh, this.normalColor = new h.Color(11184810);
		let s = {};
		this.triangles.forEach((e, t) => {
			let n = this._triangles[t].getNormal(new h.Vector3()).toArray().map((e) => r(e, 5));
			for (let r = 0; r < 3; r++) {
				let i = [e[r], e[(r + 1) % 3]], a = JSON.stringify([i.sort(), n]);
				s[a] ? s[a].keep = !1 : s[a] = {
					keep: !0,
					line: i,
					triangle_normal: n,
					triangle_index: t
				};
			}
		});
		let c = [];
		Object.keys(s).reduce((e, t) => (s[t].keep && e.push(s[t].line), e), []).forEach((e) => {
			e.forEach((e) => {
				c.push(e[0], e[1], e[2]);
			});
		});
		let l = new h.BufferGeometry();
		l.setAttribute("position", new h.Float32BufferAttribute(c, 3)), this.edges = new h.LineSegments(l, $.materials.line), this.edges.geometry.name = "surface-edges-geometry", this.add(this.mesh), this.mesh.visible = this.fillSurface, this.add(this.wire), this.wireframeVisible = e.wireframeVisible || $.wireframeVisible, this.add(this.edges), this.edgesVisible = e.edgesVisible || $.edgesVisible, this.add(this.vertexNormals), this.displayVertexNormals = e.displayVertexNormals || $.displayVertexNormals, this.absorption = [
			0,
			.04,
			.23,
			.52,
			.9,
			.94,
			.66,
			.66
		];
		let u = [
			63,
			125,
			250,
			500,
			1e3,
			2e3,
			4e3,
			8e3
		];
		this.absorptionFunction = y(this.absorption, u), this.reflectionFunction = (e, t) => a(this.absorptionFunction(e), t), this.pressureReflectionFunction = (e, t) => i(this.absorptionFunction(e), t), this.scatteringCoefficient = e.scatteringCoefficient || $.scatteringCoefficient, this.acousticMaterial = e.acousticMaterial, this.getArea(), this.edgeLoop = this.calculateEdgeLoop();
		let d = this.edgeLoop.map((e) => Q.math.vec3.fromArray([
			e.x,
			e.y,
			e.z
		])), f = Q.math.plane.fromPoints(Q.math.plane.create(), d[0], d[1], d[2]);
		this.polygon = Q.geometry.poly3.fromPointsAndPlane(d, f);
		let p = ut(1e-6), m = (e, t) => !p(e.x, t[0]) || !p(e.y, t[1]) || !p(e.z, t[2]);
		m(this.normal, this.polygon.plane) && (this.polygon = Q.geometry.poly3.fromPointsAndPlane(d, Q.math.plane.fromPoints(Q.math.plane.create(), d[2], d[1], d[0])), m(this.normal, this.polygon.plane));
	}
	dispose() {
		this.parent && this.parent.remove(this), super.dispose();
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
			geometry: vt(e.geometry),
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
		this.selected || (this.mesh.material = $.materials.hovered, this.mesh.material.needsUpdate = !0);
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
		for (let n = 0; n < e.count; n++) t.push(new h.Vector3(e.getX(n), e.getY(n), e.getZ(n)));
		let n = v(t, 2), r = [], i = 0;
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
		let n = this.name + "-merged", r = this.acousticMaterial, i = new h.BufferGeometry(), a = {};
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
			i.setAttribute(e, new h.BufferAttribute(new Float32Array(a[e].arr), a[e].itemSize));
		}), new e(n, {
			geometry: i,
			acousticMaterial: r
		});
	}
	tessellate(e) {
		this.tessellatedMesh && this.remove(this.tessellatedMesh);
		let t = e.modify(this.geometry);
		this.tessellatedMesh = new h.Mesh(t, this.wire.material), this.add(this.tessellatedMesh);
		let n = t.getAttribute("position"), r = [];
		for (let e = 0; e < n.count; e += 3) {
			let t = new _t(n, e + 0, e + 1, e + 2);
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
		if (this.absorption = t.map((e) => this._acousticMaterial.absorption[String(e)]), this.absorptionFunction = y(this.absorption, t), this.reflectionFunction = (e, t) => a(this.absorptionFunction(e), t), this.pressureReflectionFunction = (e, t) => i(this.absorptionFunction(e), t), e.scattering) {
			let t = Object.keys(e.scattering).map(Number), n = t.map((t) => e.scattering[String(t)]);
			this.scatteringFunction = y(n, t), this._scatteringCoefficient = this.scatteringFunction(500);
		}
		this.brdf = [], Object.keys(this.acousticMaterial.absorption).map(Number).forEach((e) => {
			this.brdf.push(new pe({
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
		this._scatteringCoefficient = e, this.scatteringFunction = gt(e);
	}
};
f("ADD_SURFACE", o(yt)), f("REMOVE_SURFACE", l), f("SURFACE_SET_PROPERTY", c), f("SURFACE_HOVER", (e) => {
	let { containers: t } = s.getState(), n = t[e];
	n && n.hover && (n.hover(), p("RENDER", void 0));
}), f("SURFACE_UNHOVER", (e) => {
	let { containers: t } = s.getState(), n = t[e];
	n && n.unhover && (n.unhover(), p("RENDER", void 0));
});
// src/objects/room.ts
var bt = class e extends n {
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
	init(e, r = !1) {
		r || this.remove(this.surfaces), this.surfaces = new n("surfaces"), this.originalFileName = e.originalFileName || "", this.originalFileData = e.originalFileData || "", this.units = e.units || u.METERS, e.surfaces.forEach((e) => {
			e.kind === "surface" && p("ADD_SURFACE", e), e.traverse((e) => {
				e.kind && e.kind === "surface" && p("ADD_SURFACE", e);
			}), this.surfaces.add(e);
		}), this.add(this.surfaces), this.calculateBoundingBox(), this.volume = this.volumeOfMesh(), this.surfaceMap = this.allSurfaces.reduce((e, t) => (e[t.uuid] = t, e), {}), t.add(this);
	}
	dispose() {
		t.remove(this), this.allSurfaces.forEach((e) => {
			p("REMOVE_SURFACE", e.uuid);
		}), super.dispose();
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
			if (e.kind === "surface") return new yt(e.name).restore(e);
			{
				let r = new n(e.name).restore(e);
				return e.children?.forEach((e) => {
					r.add(t(e));
				}), r;
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
		}, new h.Box3()), this.boundingBox;
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
		let t = ee[this.units] || ee[u.METERS], { totalHits: n, meanAbsorption: r } = this.calculateMeanAbsorptionCoefficientFromHits(e), i = this.allSurfaces.reduce((e, t) => e + t.getArea(), 0);
		return n > 0 ? [e, r.map((e) => t * this.volume / (e * i))] : [e, r];
	}
	tessellateSurfaces(e = .1, t = 6) {
		let n = new ne(e, t);
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
f("ADD_ROOM", o(bt)), f("REMOVE_ROOM", l), f("ROOM_SET_PROPERTY", c);
var xt = () => e("room");
export { ut as i, xt as n, yt as r, bt as t };

//# sourceMappingURL=room-DybgS1e4.mjs.map