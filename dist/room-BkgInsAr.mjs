import { T as e, _ as t, l as n, y as r } from "./FileSaver.min-DhK9iPpQ.mjs";
import { d as i, t as a, u as o } from "./renderer-CQRXHm3p.mjs";
import { d as s, g as c, h as l, m as u, s as d } from "./store-Dol3XeT3.mjs";
import { t as ee } from "./round-to-CrejEAZs.mjs";
import { t as te } from "./bands-CXX2p1-Y.mjs";
import { t as ne } from "./TessellateModifier-C1tXMs2g.mjs";
import "./acoustics-DtDxi75Z.mjs";
import { t as re } from "./rt-constants-CGTBwQyy.mjs";
import * as f from "three";
import { BufferGeometry as ie, Float32BufferAttribute as ae, LineBasicMaterial as oe, LineSegments as se, Matrix3 as ce, Vector3 as le } from "three";
//#region node_modules/three/examples/jsm/helpers/VertexNormalsHelper.js
var p = new le(), m = new le(), ue = new ce(), de = class extends se {
	constructor(e, t = 1, n = 16711680) {
		let r = new ie(), i = e.geometry.attributes.normal.count, a = new ae(i * 2 * 3, 3);
		r.setAttribute("position", a), super(r, new oe({
			color: n,
			toneMapped: !1
		})), this.object = e, this.size = t, this.type = "VertexNormalsHelper", this.matrixAutoUpdate = !1, this.isVertexNormalsHelper = !0, this.update();
	}
	update() {
		this.object.updateMatrixWorld(!0), ue.getNormalMatrix(this.object.matrixWorld);
		let e = this.object.matrixWorld, t = this.geometry.attributes.position, n = this.object.geometry;
		if (n) {
			let r = n.attributes.position, i = n.attributes.normal, a = 0;
			for (let n = 0, o = r.count; n < o; n++) p.fromBufferAttribute(r, n).applyMatrix4(e), m.fromBufferAttribute(i, n), m.applyMatrix3(ue).normalize().multiplyScalar(this.size).add(p), t.setXYZ(a, p.x, p.y, p.z), a += 1, t.setXYZ(a, m.x, m.y, m.z), a += 1;
		}
		t.needsUpdate = !0;
	}
	dispose() {
		this.geometry.dispose(), this.material.dispose();
	}
};
//#endregion
//#region src/common/chunk.ts
function h(e, t) {
	for (var n = [], r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
//#endregion
//#region src/compute/acoustics/interpolate-log.ts
function fe(e, t, n, r, i) {
	return t + (Math.log10(i) - Math.log10(e)) / (Math.log10(n) - Math.log10(e)) * (r - t);
}
//#endregion
//#region src/compute/acoustics/interpolate-alpha.ts
function g(e, t) {
	return function(n) {
		let r = 0;
		for (; n > t[r] && r < t.length;) r++;
		if (r > 0 && r < t.length) {
			let i = t[r - 1], a = e[r - 1], o = t[r], s = e[r];
			return fe(i, a, o, s, n);
		}
		return r === 0 ? e[r] : e[t.length - 1];
	};
}
//#endregion
//#region src/compute/acoustics/reflection-coefficient.ts
function pe(e, t) {
	let n = Math.sqrt(1 - e), r = (1 - n) / (1 + n) * Math.abs(Math.cos(t));
	return ((r - 1) / (r + 1)) ** 2;
}
//#endregion
//#region src/common/discretize.ts
function me(e, t, n) {
	return function(r) {
		return Math.round((n - t) / e * r);
	};
}
//#endregion
//#region src/compute/raytracer/brdf.ts
var he = class {
	coefficients;
	steps;
	getIndex;
	constructor(e) {
		this.steps = e && e.steps || 10, this.coefficients = [];
		for (let e = 0; e < this.steps; e++) this.coefficients.push([]);
		this.getIndex = me(this.steps, 0, Math.PI), this.set(e.absorptionCoefficient, e.diffusionCoefficient);
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
}, ge = /* @__PURE__ */ e({
	booleans: () => Ae,
	color: () => W,
	colorModule: () => W,
	connectors: () => nt,
	expansions: () => qe,
	extrusions: () => Ge,
	geometry: () => j,
	hulls: () => Ye,
	math: () => T,
	measurements: () => We,
	primitives: () => De,
	text: () => Ze,
	transforms: () => Ue,
	utils: () => et
}), _ = await import(
	/* @vite-ignore */
	(typeof window < "u" ? window.location.origin : "") + "/compute/modeling/jscad-modeling-bundle.js"
).then((e) => e.default), { maths: _e } = _, { vec2: v, vec3: y, mat4: b, plane: x, line2: S, line3: C } = _e, ve = {
	...v,
	create: (e) => e ? v.fromValues(e[0] || 0, e[1] || 0) : v.create(),
	fromArray: (e) => v.fromValues(e[0], e[1]),
	fromValues: v.fromValues,
	clone: v.clone,
	add: v.add,
	subtract: v.subtract,
	scale: v.scale,
	dot: v.dot,
	cross: v.cross,
	length: v.length,
	normalize: v.normalize,
	distance: v.distance,
	equals: v.equals,
	transform: v.transform,
	negate: v.negate,
	rotate: v.rotate,
	angle: v.angle,
	lerp: v.lerp,
	min: v.min,
	max: v.max,
	abs: v.abs,
	squaredLength: v.squaredLength,
	squaredDistance: v.squaredDistance
}, w = {
	...y,
	create: (e) => e ? y.fromValues(e[0] || 0, e[1] || 0, e[2] || 0) : y.create(),
	fromArray: (e) => y.fromValues(e[0], e[1], e[2]),
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
	angle: y.angle,
	lerp: y.lerp,
	min: y.min,
	max: y.max,
	abs: y.abs,
	squaredLength: y.squaredLength,
	squaredDistance: y.squaredDistance,
	unit: y.normalize
}, T = {
	vec2: ve,
	vec3: w,
	mat4: {
		...b,
		create: b.create,
		clone: b.clone,
		identity: b.identity,
		fromValues: b.fromValues,
		fromTranslation: b.fromTranslation,
		fromScaling: b.fromScaling,
		fromRotation: b.fromRotation,
		fromXRotation: b.fromXRotation,
		fromYRotation: b.fromYRotation,
		fromZRotation: b.fromZRotation,
		fromTaitBryanRotation: b.fromTaitBryanRotation,
		multiply: b.multiply,
		translate: b.translate,
		rotate: b.rotate,
		rotateX: b.rotateX,
		rotateY: b.rotateY,
		rotateZ: b.rotateZ,
		scale: b.scale,
		invert: b.invert,
		equals: b.equals,
		mirrorByPlane: b.mirrorByPlane,
		transform: b.transform
	},
	plane: {
		...x,
		create: x.create,
		clone: x.clone,
		equals: x.equals,
		flip: x.flip,
		fromPoints: x.fromPoints,
		fromNormalAndPoint: x.fromNormalAndPoint,
		signedDistanceToPoint: x.signedDistanceToPoint,
		transform: x.transform,
		fromPointsRandom: (e, t, n) => x.fromPoints(x.create(), e, t, n)
	},
	line2: {
		...S,
		create: S.create,
		clone: S.clone,
		equals: S.equals,
		fromPoints: S.fromPoints,
		direction: S.direction,
		origin: S.origin,
		closestPoint: S.closestPoint,
		distanceToPoint: S.distanceToPoint,
		transform: S.transform
	},
	line3: {
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
	constants: _e.constants
}, { geometries: ye } = _, { geom2: E, geom3: D, path2: O, poly3: k } = ye, be = {
	...E,
	create: E.create,
	clone: E.clone,
	isA: E.isA,
	toOutlines: E.toOutlines,
	toPoints: E.toPoints,
	transform: E.transform,
	reverse: E.reverse
}, A = {
	...D,
	create: D.create,
	clone: D.clone,
	isA: D.isA,
	toPolygons: D.toPolygons,
	transform: D.transform,
	fromPolygons: (e) => {
		let t = e.map((e) => k.isA(e) ? e : e.vertices ? k.create(e.vertices) : k.create(e));
		return D.create(t);
	}
}, j = {
	geom2: be,
	geom3: A,
	path2: {
		...O,
		create: O.create,
		clone: O.clone,
		isA: O.isA,
		toPoints: O.toPoints,
		transform: O.transform,
		close: O.close,
		concat: O.concat,
		fromPoints: O.fromPoints,
		appendPoints: O.appendPoints,
		appendArc: O.appendArc,
		appendBezier: O.appendBezier,
		equals: O.equals,
		reverse: O.reverse
	},
	poly3: {
		...k,
		create: k.create,
		clone: k.clone,
		isA: k.isA,
		fromPoints: k.fromPoints,
		toPoints: (e) => e.vertices || k.toVertices(e),
		toVertices: k.toVertices,
		transform: k.transform,
		plane: (e) => {
			if (e.plane) return e.plane;
			let t = e.vertices || k.toVertices(e);
			return t.length >= 3 ? x.fromPoints(x.create(), t[0], t[1], t[2]) : x.create();
		},
		flip: (e) => ({
			vertices: (e.vertices || k.toVertices(e)).slice().reverse(),
			plane: e.plane ? x.flip(x.create(), e.plane) : null
		}),
		fromPointsAndPlane: (e, t) => ({
			vertices: e,
			plane: t
		}),
		measureBoundingSphere: (e) => {
			let t = e.vertices || k.toVertices(e);
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
}, { primitives: M } = _, N = (e) => e.reduce((e, t) => Array.isArray(t) ? e.concat(N(t)) : e.concat(t), []), xe = (e = {}) => {
	let t = e.size ?? 1, n = Array.isArray(t) ? t : [
		t,
		t,
		t
	], r = e.center, i = M.cuboid({ size: n });
	return r && (i = _.transforms.translate(r, i)), i;
}, Se = (e = {}) => {
	let t = e.radius ?? e.r ?? 1, n = e.segments ?? e.resolution ?? 32, r = e.center, i = M.sphere({
		radius: t,
		segments: n
	});
	return r && (i = _.transforms.translate(r, i)), i;
}, Ce = (e = {}) => {
	let t = e.radius ?? e.r ?? 1, n = e.height ?? e.h ?? 1, r = e.segments ?? e.resolution ?? 32, i = e.r1 ?? t, a = e.r2 ?? t, o = e.center, s;
	return s = i === a ? M.cylinder({
		radius: t,
		height: n,
		segments: r
	}) : M.cylinderElliptic({
		height: n,
		startRadius: [i, i],
		endRadius: [a, a],
		segments: r
	}), o && (s = _.transforms.translate(o, s)), s;
}, we = (e = {}) => {
	let t = e.innerRadius ?? e.ri ?? 1, n = e.outerRadius ?? e.ro ?? 4, r = e.innerSegments ?? e.innerResolution ?? 32, i = e.outerSegments ?? e.outerResolution ?? 32;
	return M.torus({
		innerRadius: t,
		outerRadius: n,
		innerSegments: r,
		outerSegments: i
	});
}, Te = (e = {}) => {
	let t = e.points || [], n = e.faces || e.triangles || [];
	return M.polyhedron({
		points: t,
		faces: n
	});
}, Ee = (e = {}) => {
	let t = e.size ?? [1, 1], n = e.center, r = M.rectangle({ size: t });
	return n && (r = _.transforms.translate([
		n[0],
		n[1],
		0
	], r)), r;
}, De = {
	cube: xe,
	cuboid: M.cuboid,
	sphere: Se,
	cylinder: Ce,
	torus: we,
	polyhedron: Te,
	rectangle: Ee,
	square: Ee,
	circle: (e = {}) => {
		let t = e.radius ?? e.r ?? 1, n = e.segments ?? e.resolution ?? 32, r = e.center, i = M.circle({
			radius: t,
			segments: n
		});
		return r && (i = _.transforms.translate([
			r[0],
			r[1],
			0
		], i)), i;
	},
	ellipse: M.ellipse,
	polygon: (e = {}) => {
		let t = e.points || [];
		return M.polygon({ points: t });
	},
	arc: M.arc,
	ellipsoid: M.ellipsoid,
	geodesicSphere: M.geodesicSphere,
	roundedCuboid: M.roundedCuboid,
	roundedCylinder: M.roundedCylinder,
	roundedRectangle: M.roundedRectangle,
	star: M.star,
	line: M.line
}, { booleans: P } = _, Oe = (...e) => {
	let t = N(e);
	return t.length === 0 ? A.create() : t.length === 1 ? t[0] : P.union(t);
}, ke = (...e) => {
	let t = N(e);
	return t.length === 0 ? A.create() : t.length === 1 ? t[0] : P.subtract(t);
}, Ae = {
	union: Oe,
	subtract: ke,
	intersect: (...e) => {
		let t = N(e);
		return t.length === 0 ? A.create() : t.length === 1 ? t[0] : P.intersect(t);
	},
	difference: ke
}, { transforms: F } = _, I = (e, ...t) => {
	let n = N(t);
	if (n.length === 0) return A.create();
	let r = n.map((t) => F.translate(e, t));
	return r.length === 1 ? r[0] : r;
}, je = (e, ...t) => I([
	e,
	0,
	0
], ...t), Me = (e, ...t) => I([
	0,
	e,
	0
], ...t), Ne = (e, ...t) => I([
	0,
	0,
	e
], ...t), L = (e, ...t) => {
	let n = N(t);
	if (n.length === 0) return A.create();
	let r = n.map((t) => F.rotate(e, t));
	return r.length === 1 ? r[0] : r;
}, Pe = (e, ...t) => L([
	e,
	0,
	0
], ...t), Fe = (e, ...t) => L([
	0,
	e,
	0
], ...t), Ie = (e, ...t) => L([
	0,
	0,
	e
], ...t), R = (e, ...t) => {
	let n = N(t);
	if (n.length === 0) return A.create();
	let r = n.map((t) => F.scale(e, t));
	return r.length === 1 ? r[0] : r;
}, Le = (e, ...t) => R([
	e,
	1,
	1
], ...t), Re = (e, ...t) => R([
	1,
	e,
	1
], ...t), ze = (e, ...t) => R([
	1,
	1,
	e
], ...t), z = (e, ...t) => {
	let n = N(t);
	if (n.length === 0) return A.create();
	let r = n.map((t) => F.mirror(e, t));
	return r.length === 1 ? r[0] : r;
}, Be = (...e) => z({ normal: [
	1,
	0,
	0
] }, ...e), Ve = (...e) => z({ normal: [
	0,
	1,
	0
] }, ...e), He = (...e) => z({ normal: [
	0,
	0,
	1
] }, ...e), B = (e = {}, ...t) => {
	let n = N(t);
	if (n.length === 0) return A.create();
	let r = n.map((t) => F.center(e, t));
	return r.length === 1 ? r[0] : r;
}, Ue = {
	translate: I,
	translateX: je,
	translateY: Me,
	translateZ: Ne,
	rotate: L,
	rotateX: Pe,
	rotateY: Fe,
	rotateZ: Ie,
	scale: R,
	scaleX: Le,
	scaleY: Re,
	scaleZ: ze,
	mirror: z,
	mirrorX: Be,
	mirrorY: Ve,
	mirrorZ: He,
	center: B,
	centerX: (...e) => B({ axes: [
		!0,
		!1,
		!1
	] }, ...e),
	centerY: (...e) => B({ axes: [
		!1,
		!0,
		!1
	] }, ...e),
	centerZ: (...e) => B({ axes: [
		!1,
		!1,
		!0
	] }, ...e),
	transform: (e, ...t) => {
		let n = N(t);
		if (n.length === 0) return A.create();
		let r = n.map((t) => F.transform(e, t));
		return r.length === 1 ? r[0] : r;
	},
	align: F.align
}, { measurements: V } = _, We = {
	measureArea: V.measureArea,
	measureBoundingBox: V.measureBoundingBox,
	measureBoundingSphere: V.measureBoundingSphere,
	measureCenter: V.measureCenter,
	measureCenterOfMass: V.measureCenterOfMass,
	measureDimensions: V.measureDimensions,
	measureVolume: V.measureVolume,
	measureAggregateArea: V.measureAggregateArea,
	measureAggregateVolume: V.measureAggregateVolume,
	measureAggregateBoundingBox: V.measureAggregateBoundingBox,
	measureEpsilon: V.measureEpsilon
}, { extrusions: H } = _, Ge = {
	extrudeLinear: (e, ...t) => {
		let n = N(t);
		if (n.length === 0) return A.create();
		let r = n.map((t) => H.extrudeLinear(e, t));
		return r.length === 1 ? r[0] : r;
	},
	extrudeRotate: (e, ...t) => {
		let n = N(t);
		if (n.length === 0) return A.create();
		let r = n.map((t) => H.extrudeRotate(e, t));
		return r.length === 1 ? r[0] : r;
	},
	extrudeRectangular: H.extrudeRectangular,
	extrudeFromSlices: H.extrudeFromSlices,
	extrudeHelical: H.extrudeHelical
}, { expansions: Ke } = _, qe = {
	expand: (e, ...t) => {
		let n = N(t);
		if (n.length === 0) return A.create();
		let r = n.map((t) => Ke.expand(e, t));
		return r.length === 1 ? r[0] : r;
	},
	offset: (e, ...t) => {
		let n = N(t);
		if (n.length === 0) return be.create();
		let r = n.map((t) => Ke.offset(e, t));
		return r.length === 1 ? r[0] : r;
	}
}, { hulls: Je } = _, Ye = {
	hull: (...e) => {
		let t = N(e);
		return t.length === 0 ? A.create() : Je.hull(t);
	},
	hullChain: (...e) => {
		let t = N(e);
		return t.length === 0 ? A.create() : Je.hullChain(t);
	}
}, { text: Xe } = _, Ze = {
	vectorText: Xe.vectorText,
	vectorChar: Xe.vectorChar
}, { colors: U } = _, Qe = {
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
}, W = {
	color: (e, ...t) => {
		let n;
		n = typeof e == "string" ? [...Qe[e.toLowerCase()] || U.colorNameToRgb(e), 1] : e.length === 3 ? [...e, 1] : e;
		let r = N(t).map((e) => U.colorize(n, e));
		return r.length === 1 ? r[0] : r;
	},
	cssColors: Qe,
	colorize: U.colorize,
	colorNameToRgb: U.colorNameToRgb,
	hexToRgb: U.hexToRgb,
	hslToRgb: U.hslToRgb,
	hsvToRgb: U.hsvToRgb,
	rgbToHex: U.rgbToHex,
	rgbToHsl: U.rgbToHsl,
	rgbToHsv: U.rgbToHsv
}, { utils: $e } = _, et = {
	flatten: N,
	degToRad: $e.degToRad,
	radToDeg: $e.radToDeg
}, tt = class e {
	point;
	axisvector;
	normalvector;
	constructor(e, t, n) {
		this.point = e, this.axisvector = w.normalize(w.create(), t), this.normalvector = w.normalize(w.create(), n);
	}
	normalized() {
		return new e(this.point, w.normalize(w.create(), this.axisvector), w.normalize(w.create(), this.normalvector));
	}
	transform(t) {
		let n = w.transform(w.create(), this.point, t), r = w.transform(w.create(), this.axisvector, t), i = w.transform(w.create(), this.normalvector, t);
		return new e(n, r, i);
	}
}, nt = {
	Connector: tt,
	create: (e, t, n) => new tt(e, t, n)
}, { plane: G, vec3: K } = T, { poly3: q } = j, J = 1e-5, rt = (e, t, n) => {
	let r = K.subtract(K.create(), n, t), i = (e[3] - K.dot(e, t)) / K.dot(e, r);
	Number.isNaN(i) && (i = 0), i > 1 && (i = 1), i < 0 && (i = 0);
	let a = K.create();
	return K.scale(a, r, i), K.add(a, a, t), a;
}, it = (e, t) => {
	let n = {
		type: 0,
		front: null,
		back: null
	}, r = t.vertices || q.toVertices(t), i = r.length, a = t.plane || (r.length >= 3 ? G.fromPoints(G.create(), r[0], r[1], r[2]) : G.create());
	if (G.equals(a, e)) n.type = 0;
	else {
		let t = !1, o = !1, s = [];
		for (let n = 0; n < i; n++) {
			let i = K.dot(e, r[n]) - e[3], a = i < 0;
			s.push(a), i > J && (t = !0), i < -1e-5 && (o = !0);
		}
		if (!t && !o) n.type = K.dot(e, a) >= 0 ? 0 : 1;
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
					let n = a, i = r[l], s = rt(e, n, i);
					c ? (o.push(a), o.push(s), t.push(s)) : (t.push(a), t.push(s), o.push(s));
				}
				c = u;
			}
			let l = J * J;
			if (o.length >= 3) {
				let e = o[o.length - 1];
				for (let t = 0; t < o.length; t++) {
					let n = o[t];
					K.squaredDistance(n, e) < l && (o.splice(t, 1), t--), e = n;
				}
			}
			if (t.length >= 3) {
				let e = t[t.length - 1];
				for (let n = 0; n < t.length; n++) {
					let r = t[n];
					K.squaredDistance(r, e) < l && (t.splice(n, 1), n--), e = r;
				}
			}
			t.length >= 3 && (n.front = at(t, a)), o.length >= 3 && (n.back = at(o, a));
		}
	}
	return n;
};
function at(e, t) {
	return {
		vertices: e,
		plane: t
	};
}
function ot(e) {
	let t = e.vertices || q.toVertices(e);
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
function st(e) {
	return {
		vertices: (e.vertices || q.toVertices(e)).slice().reverse(),
		plane: e.plane ? G.flip(G.create(), e.plane) : null
	};
}
var ct = class e {
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
			let [o, s] = ot(a), c = s + J, l = K.dot(e, o) - e[3];
			if (l > c) r.push(this);
			else if (l < -c) i.push(this);
			else {
				let o = it(e, a);
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
			for (let t of n) t.polygon &&= st(t.polygon), t.children.length > 0 && e.push(t.children);
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
}, Y = class e {
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
			n.plane &&= G.flip(G.create(), n.plane), n.front && e.push(n.front), n.back && e.push(n.back);
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
				t.plane = e.plane || G.fromPoints(G.create(), e.vertices[0], e.vertices[1], e.vertices[2]);
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
}, lt = class {
	polygonTree;
	rootnode;
	constructor(e) {
		this.polygonTree = new ct(), this.rootnode = new Y(null), e && this.addPolygons(e);
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
({ ...ge });
var X = {
	connectors: nt,
	geometry: j,
	math: T,
	primitives: De,
	text: Ze,
	booleans: Ae,
	expansions: qe,
	extrusions: Ge,
	hulls: Ye,
	measurements: We,
	transforms: Ue,
	color: W,
	utils: et,
	splitLineByPlane: rt,
	splitPolygonByPlane: it,
	Tree: lt,
	PolygonTreeNode: ct,
	Node: Y
};
//#endregion
//#region src/common/equal-within-range.ts
function ut(e) {
	return e ? (t) => (n, r) => e.reduce((e, i) => e && Math.abs(n[i] - r[i]) < t, !0) : (e) => (t, n) => Math.abs(t - n) < e;
}
var dt = ut();
//#endregion
//#region src/compute/acoustics/scattering-function.ts
function ft(e, t, n, r, i) {
	return t + (i - e) / (n - e) * (r - t);
}
var pt = (e, t) => {
	if (t <= e[0]) return [e[0], e[1]];
	if (t >= e[e.length - 1]) return [e[e.length - 2], e[e.length - 1]];
	for (let r = 1; r < e.length; r++) if (n(t, e[r - 1], e[r])) return [e[r - 1], e[r]];
	throw Error("value could not be found within input array");
}, mt = [
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
], ht = [
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
function gt(e) {
	let [t, n] = pt(Z, e), r = mt[Z.indexOf(t)], i = mt[Z.indexOf(n)];
	return g(r.map((a, o) => ft(t, r[o], n, i[o], e)), ht);
}
//#endregion
//#region src/objects/surface-element.ts
var _t = class {
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
function vt(e) {
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
		this.numHits = 0, this.fillSurface = n.fillSurface, this.wire = new f.Mesh(n.geometry, n.materials.wire), this.wire.geometry.name = "surface-wire-geometry", this.mesh = new f.Mesh(n.geometry, n.materials.mesh), this.mesh.geometry.name = "surface-geometry", this.mesh.geometry.computeBoundingBox(), this.mesh.geometry.computeBoundingSphere(), this.mesh.geometry.computeVertexNormals(), this.vertexNormals = new de(this.mesh, .25, 16711680), this.vertexNormals.geometry.name = "surface-vertex-normals-geometry", this.triangles = h(h(Array.from(n.geometry.getAttribute("position").array), 3), 3), this._triangles = this.triangles.map((e) => new f.Triangle(new f.Vector3(e[0][0], e[0][1], e[0][2]), new f.Vector3(e[1][0], e[1][1], e[1][2]), new f.Vector3(e[2][0], e[2][1], e[2][2]))), this.normal = new f.Vector3(), this._triangles[0].getNormal(this.normal), this.center = new f.Vector3();
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
		this.absorptionFunction = g(this.absorption, s), this.reflectionFunction = (e, t) => pe(this.absorptionFunction(e), t), this.scatteringCoefficient = e.scatteringCoefficient || Q.scatteringCoefficient, this.acousticMaterial = e.acousticMaterial, this.getArea(), this.edgeLoop = this.calculateEdgeLoop();
		let c = this.edgeLoop.map((e) => X.math.vec3.fromArray([
			e.x,
			e.y,
			e.z
		])), l = X.math.plane.fromPoints(X.math.plane.create(), c[0], c[1], c[2]);
		this.polygon = X.geometry.poly3.fromPointsAndPlane(c, l);
		let u = dt(1e-6), d = (e, t) => !u(e.x, t[0]) || !u(e.y, t[1]) || !u(e.z, t[2]);
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
		let n = h(t, 2), r = [], i = 0;
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
		if (this.absorption = t.map((e) => this._acousticMaterial.absorption[String(e)]), this.absorptionFunction = g(this.absorption, t), this.reflectionFunction = (e, t) => pe(this.absorptionFunction(e), t), e.scattering) {
			let t = Object.keys(e.scattering).map(Number), n = t.map((t) => e.scattering[String(t)]);
			this.scatteringFunction = g(n, t), this._scatteringCoefficient = this.scatteringFunction(500);
		}
		this.brdf = [], Object.keys(this.acousticMaterial.absorption).map(Number).forEach((e) => {
			this.brdf.push(new he({
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
r("ADD_SURFACE", s($)), r("REMOVE_SURFACE", u), r("SURFACE_SET_PROPERTY", l), r("SURFACE_HOVER", (e) => {
	let { containers: n } = c.getState(), r = n[e];
	r && r.hover && (r.hover(), t("RENDER", void 0));
}), r("SURFACE_UNHOVER", (e) => {
	let { containers: n } = c.getState(), r = n[e];
	r && r.unhover && (r.unhover(), t("RENDER", void 0));
});
//#endregion
//#region src/objects/room.ts
var yt = class e extends o {
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
	init(e, n = !1) {
		n || this.remove(this.surfaces), this.surfaces = new o("surfaces"), this.originalFileName = e.originalFileName || "", this.originalFileData = e.originalFileData || "", this.units = e.units || d.METERS, e.surfaces.forEach((e) => {
			e.kind === "surface" && t("ADD_SURFACE", e), e.traverse((e) => {
				e.kind && e.kind === "surface" && t("ADD_SURFACE", e);
			}), this.surfaces.add(e);
		}), this.add(this.surfaces), this.calculateBoundingBox(), this.volume = this.volumeOfMesh(), this.surfaceMap = this.allSurfaces.reduce((e, t) => (e[t.uuid] = t, e), {}), a.add(this);
	}
	dispose() {
		a.remove(this), this.allSurfaces.forEach((e) => {
			t("REMOVE_SURFACE", e.uuid);
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
		let t = re[this.units] || re[d.METERS], { totalHits: n, meanAbsorption: r } = this.calculateMeanAbsorptionCoefficientFromHits(e), i = this.allSurfaces.reduce((e, t) => e + t.getArea(), 0);
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
r("ADD_ROOM", s(yt)), r("REMOVE_ROOM", u), r("ROOM_SET_PROPERTY", l);
var bt = () => i("room");
//#endregion
export { dt as i, bt as n, $ as r, yt as t };

//# sourceMappingURL=room-BkgInsAr.mjs.map