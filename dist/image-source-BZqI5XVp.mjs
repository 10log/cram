import { t as e } from "./solver-BGP8KuNH.mjs";
import { t } from "./renderer-Ca4ltx3N.mjs";
import { S as n, T as r, a as i, b as a, g as o, l as s, n as c, s as l, x as u } from "./FileSaver.min-C7ZD-uW3.mjs";
import "./acoustics-Cs_0VALc.mjs";
import { n as d } from "./room-DybgS1e4.mjs";
import { i as f, n as p, r as m, t as h } from "./convert-BWB5KhF2.mjs";
import { r as g } from "./air-attenuation-BBmC2Nj9.mjs";
import { t as _ } from "./geometric-spreading-DTzP8xvT.mjs";
import { t as v } from "./sound-speed-6e5N6SrW.mjs";
import { a as y, g as b, i as x } from "./store-Cb8r9O09.mjs";
import { t as S } from "./audio-engine-ByEZlMz-.mjs";
import { a as C, r as w } from "./export-playback-DfkrlIMt.mjs";
import * as T from "three";
import { Vector3 as E } from "three";
import { MeshLineGeometry as D, MeshLineMaterial as O } from "meshline";
// src/compute/raytracer/image-source/arrival-pressure.ts
function k(e) {
	let t = 0;
	for (let n = 1; n < e.length; n++) t += e[n - 1].point.distanceTo(e[n].point);
	return t;
}
function A(e, t, n, r = 20) {
	let i = m(p(e)), a = k(n), o = _(a);
	for (let e = 0; e < i.length; e++) i[e] *= o;
	for (let e of n) {
		if (!e.reflectingSurface) continue;
		let n = e.angle ?? 0;
		for (let r = 0; r < t.length; r++) i[r] *= e.reflectingSurface.reflectionFunction(t[r], n);
	}
	let s = f(h(i)), c = g(t, r);
	for (let e = 0; e < t.length; e++) s[e] -= c[e] * a;
	return p(s);
}
function j(e, t, n, r = 20) {
	let i = A(e, t, n, r).slice();
	for (let e = 0; e < t.length; e++) {
		let r = 1;
		for (let i of n) {
			if (!i.reflectingSurface?.pressureReflectionFunction) continue;
			let n = i.reflectingSurface.pressureReflectionFunction(t[e], i.angle ?? 0);
			r *= n < 0 ? -1 : 1;
		}
		i[e] *= r;
	}
	return i;
}
// src/compute/raytracer/image-source/selection.ts
function M(e, t) {
	return e && t.includes(e) ? e : t[0] ?? "";
}
function N(e, t) {
	if (!t.length) return e;
	let n = new Set(t);
	return e.filter((e) => n.has(e.uuid));
}
function P(e) {
	return e === null;
}
// src/compute/raytracer/image-source/reflection-geometry.ts
function F(e, t) {
	return e.clone().transformDirection(t).normalize();
}
function I(e, t, n) {
	let r = n.clone().normalize(), i = r.dot(e.clone().sub(t));
	return e.clone().sub(r.multiplyScalar(2 * i));
}
function L(e, t) {
	let n = e.clone().normalize().negate(), r = t.clone().normalize(), i = n.angleTo(r);
	return i > Math.PI / 2 && (i = Math.PI - i), i;
}
function R(e, t, n, r = 1e-6) {
	return n.clone().normalize().dot(e.clone().sub(t)) >= -r;
}
function z(e, t, n) {
	return e.normal && e.normal.lengthSq() > 0 ? e.normal.clone().normalize() : e.face ? F(e.face.normal, t) : F(n, t);
}
// src/compute/raytracer/image-source/overlay.ts
var B = class {
	group;
	points = [];
	lines = [];
	parent;
	constructor(e) {
		this.group = new T.Group(), this.group.name = "image-source-overlay", this.parent = e ?? null, this.parent?.add(this.group);
	}
	addPoint(e, t = 0) {
		let n = new T.BufferGeometry().setFromPoints([new T.Vector3(e[0], e[1], e[2])]), r = new T.Points(n, new T.PointsMaterial({
			color: t,
			size: .12
		}));
		this.points.push(r), this.group.add(r);
	}
	addLine(e, t, n = 2697513) {
		let r = new T.BufferGeometry().setFromPoints([new T.Vector3(e[0], e[1], e[2]), new T.Vector3(t[0], t[1], t[2])]), i = new T.Line(r, new T.LineBasicMaterial({ color: n }));
		this.lines.push(i), this.group.add(i);
	}
	clearPoints() {
		this.disposeObjects(this.points), this.points = [];
	}
	clearLines() {
		this.disposeObjects(this.lines), this.lines = [];
	}
	get pointCount() {
		return this.points.length;
	}
	get lineCount() {
		return this.lines.length;
	}
	dispose() {
		this.clearPoints(), this.clearLines(), this.parent?.remove(this.group), this.parent = null;
	}
	disposeObjects(e) {
		for (let t of e) {
			this.group.remove(t);
			let e = t;
			e.geometry?.dispose();
			let n = e.material;
			Array.isArray(n) ? n.forEach((e) => e.dispose()) : n?.dispose();
		}
	}
};
// src/compute/raytracer/image-source/index.ts
function V() {
	let e = new D();
	e.setPoints(/* @__PURE__ */ new Float32Array());
	let t = new O({
		lineWidth: .1,
		color: 16711680,
		sizeAttenuation: 1,
		resolution: new T.Vector2(1, 1)
	});
	return new T.Mesh(e, t);
}
var H = class {
	baseSource;
	children;
	parent;
	reflector;
	order;
	position;
	room;
	uuid;
	constructor(e) {
		this.baseSource = e.baseSource, this.reflector = e.reflector, this.order = e.order, this.position = e.position, this.children = [], this.parent = e.parent, this.room = e.room, this.uuid = r();
	}
	constructPathsForAllDescendents(e, t = !0) {
		let n = [];
		if (t) {
			let t = q(this, e);
			t !== null && n.push(t);
		}
		for (let t = 0; t < this.children.length; t++) {
			let r = q(this.children[t], e);
			r !== null && n.push(r), this.children[t].hasChildren && (n = n.concat(this.children[t].constructPathsForAllDescendents(e, !1)));
		}
		return n;
	}
	markupAllDescendents() {
		for (let e = 0; e < this.children.length; e++) {
			let n = this.children[e].position.clone();
			t.markup.addPoint([
				n.x,
				n.y,
				n.z
			], [
				0,
				0,
				0
			]), this.children[e].hasChildren && this.children[e].markupAllDescendents();
		}
	}
	markup() {
		let e = this.position.clone();
		t.markup.addPoint([
			e.x,
			e.y,
			e.z
		], [
			0,
			0,
			0
		]);
	}
	getTotalDescendents() {
		let e = 0;
		for (let t = 0; t < this.children.length; t++) e++, this.children[t].hasChildren && (e += this.children[t].getTotalDescendents());
		return e;
	}
	getChildrenOfOrder(e) {
		let t = [];
		this.order === e && this.order === 0 && t.push(this);
		for (let n = 0; n < this.children.length; n++) if (this.children[n].order === e && t.push(this.children[n]), this.children[n].hasChildren) {
			let r = this.children[n].getChildrenOfOrder(e);
			t = t.concat(r);
		}
		return t;
	}
	get hasChildren() {
		return this.children.length > 0;
	}
}, U = class {
	path;
	uuid;
	highlight;
	constructor(e) {
		this.path = e, this.uuid = r(), this.highlight = !1;
	}
	markup() {
		for (let e = 0; e < this.path.length - 1; e++) {
			let n = this.path[e].point.clone(), r = this.path[e + 1].point.clone();
			t.markup.addLine([
				n.x,
				n.y,
				n.z
			], [
				r.x,
				r.y,
				r.z
			]);
		}
	}
	isvalid(e) {
		for (let t = 1; t <= this.order + 1; t++) {
			let n = this.path[t - 1].point, r = this.path[t].point, i = this.path[t - 1].reflectingSurface, a = this.path[t].reflectingSurface;
			for (let t = 0; t < e.length; t++) if (e[t] !== i && e[t] !== a) {
				let i = new E(0, 0, 0);
				i.subVectors(r, n), i.normalize();
				let a = new T.Raycaster();
				a.set(n, i);
				let o;
				o = a.intersectObject(e[t].mesh, !0);
				let s = [];
				for (let e = 0; e < o.length; e++) n.distanceTo(o[e].point) < n.distanceTo(r) && s.push(o[e]);
				if (s.length > 0) return !1;
			}
		}
		return !0;
	}
	get order() {
		return this.path.length - 2;
	}
	get totalLength() {
		let e = 0, t, n;
		for (let r = 1; r < this.path.length; r++) t = this.path[r - 1].point, n = this.path[r].point, e += t.distanceTo(n);
		return e;
	}
	arrivalPressure(e, t, n = 20) {
		return A(e, t, this.path, n);
	}
	arrivalTime(e) {
		return this.totalLength / e;
	}
}, W = {
	name: "Image Source",
	roomID: "",
	sourceIDs: [],
	surfaceIDs: [],
	receiverIDs: [],
	maxReflectionOrder: 2,
	imageSourcesVisible: !0,
	rayPathsVisible: !0,
	plotOrders: [
		0,
		1,
		2
	],
	frequencies: [
		125,
		250,
		500,
		1e3,
		2e3,
		4e3,
		8e3
	]
}, G = class extends e {
	sourceIDs;
	receiverIDs;
	roomID;
	surfaceIDs;
	uuid;
	levelTimeProgression;
	maxReflectionOrder;
	frequencies;
	_imageSourcesVisible;
	_rayPathsVisible;
	_plotOrders;
	impulseResponse;
	impulseResponsePlaying;
	rootImageSource;
	validRayPaths;
	allRayPaths;
	selectedImageSourcePath;
	overlay;
	_plotFrequency;
	isHybrid;
	constructor(e = W, n = !1) {
		super(e), this.uuid = e.uuid || r(), this.kind = "image-source", this.name = e.name, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this.frequencies = e.frequencies, this._imageSourcesVisible = e.imageSourcesVisible, this._rayPathsVisible = e.rayPathsVisible, this._plotOrders = e.plotOrders, this.levelTimeProgression = e.levelTimeProgression || r(), this.isHybrid = n, this.impulseResponsePlaying = !1, this._plotFrequency = 1e3, this.isHybrid || a("ADD_RESULT", {
			kind: x.LevelTimeProgression,
			data: [],
			info: {
				initialSPL: [100],
				frequency: [this._plotFrequency],
				maxOrder: this.maxReflectionOrder
			},
			name: `LTP - ${this.name}`,
			uuid: this.levelTimeProgression,
			from: this.uuid
		}), this.surfaceIDs = e.surfaceIDs ?? [], this.rootImageSource = null, this.allRayPaths = null, this.validRayPaths = null, this.roomID = M(this.roomID, d().map((e) => e.uuid)), this.overlay = new B(t.markup), this.selectedImageSourcePath = V(), this.isHybrid || this.overlay.group.add(this.selectedImageSourcePath);
	}
	save() {
		return o([
			"name",
			"kind",
			"uuid",
			"autoCalculate",
			"roomID",
			"sourceIDs",
			"surfaceIDs",
			"receiverIDs",
			"maxReflectionOrder",
			"imageSourcesVisible",
			"rayPathsVisible",
			"plotOrders",
			"levelTimeProgression"
		], this);
	}
	dispose() {
		this.reset(), this.overlay.dispose(), a("REMOVE_RESULT", this.levelTimeProgression);
	}
	updateSelectedImageSourcePath(e) {
		this.selectedImageSourcePath.geometry.setPoints(new Float32Array(e.path.map((e) => e.point.toArray()).flat())), console.log(e.path.map((e) => e.point.toArray()).flat());
	}
	updateImageSourceCalculation() {
		this.clearRayPaths(), this.clearImageSources();
		let e = b.getState().containers, t = this.room.allSurfaces, n = N(t, this.surfaceIDs), r = [], i = [], a = null;
		for (let o of this.sourceIDs) {
			let s = e[o];
			if (!s) continue;
			let c = K(new H({
				baseSource: s,
				position: s.position.clone(),
				room: this.room,
				reflector: null,
				parent: null,
				order: 0
			}), this.maxReflectionOrder, n);
			if (a ||= c, c) for (let n of this.receiverIDs) {
				let a = e[n];
				if (!a) continue;
				let o = c.constructPathsForAllDescendents(a);
				r.push(...o);
				for (let e of o) e.isvalid(t) && i.push(e);
			}
		}
		this.rootImageSource = a, this.allRayPaths = r, this.validRayPaths = i, this._imageSourcesVisible && this.drawImageSources(), this._rayPathsVisible && this.drawRayPaths(), this.isHybrid || this.calculateLTP();
	}
	returnSortedPathsForHybrid(e, t, n) {
		this.updateImageSourceCalculation();
		let r = this.validRayPaths;
		r?.sort((t, n) => t.arrivalTime(e) > n.arrivalTime(e) ? 1 : -1);
		let i = [];
		if (r != null) for (let a = 0; a < r.length; a++) {
			let o = {
				time: r[a].arrivalTime(e),
				pressure: r[a].arrivalPressure(t, n, this.temperature),
				order: r[a].order
			};
			i.push(o);
		}
		return i;
	}
	calculateLTP(e = this.c, t = !1) {
		if (P(this.validRayPaths)) {
			if (this.sourceIDs.length > 0 && this.receiverIDs.length > 0) {
				this.updateImageSourceCalculation();
				return;
			}
			return;
		}
		let n = this.validRayPaths ?? [];
		n.sort((t, n) => t.arrivalTime(e) > n.arrivalTime(e) ? 1 : -1);
		let r = { ...y.getState().results[this.levelTimeProgression] };
		r.data = [], r.info = {
			...r.info,
			maxOrder: this.maxReflectionOrder,
			frequency: [this._plotFrequency]
		};
		for (let i = 0; i < n.length; i++) {
			let a = n[i].arrivalTime(e), o = n[i].arrivalPressure(r.info.initialSPL, r.info.frequency, this.temperature);
			t && console.log("Arrival: " + (i + 1) + " | Arrival Time: (s) " + a + " | Arrival Pressure(1000Hz): " + o + " | Order " + n[i].order), r.data.push({
				time: a,
				pressure: f(o),
				arrival: i + 1,
				order: n[i].order,
				uuid: n[i].uuid
			});
		}
		a("UPDATE_RESULT", {
			uuid: this.levelTimeProgression,
			result: r
		});
	}
	getPathsOfOrder(e) {
		let t = [];
		if (this.validRayPaths !== null) for (let n = 0; n < this.validRayPaths?.length; n++) this.validRayPaths[n].order === e && t.push(this.validRayPaths[n]);
		return t;
	}
	test() {
		let e = u.postMessage("FETCH_SOURCE", this.sourceIDs[0])[0], t = K(new H({
			baseSource: e.clone(),
			position: e.position.clone(),
			room: this.room,
			reflector: null,
			parent: null,
			order: 0
		}), 1);
		t?.markup(), console.log(t);
		let n = this.receivers[0];
		console.log(n);
		let r;
		if (t !== null) {
			r = t.constructPathsForAllDescendents(n);
			let e = [
				100,
				100,
				100,
				100,
				100,
				100
			], i = 0;
			for (let t = 0; t < r.length; t++) r[t].isvalid(this.room.allSurfaces) && (r[t].markup(), console.log(r[t]), console.log(r[t].totalLength), console.log(r[t].arrivalTime(this.c)), console.log(p(e)), i++);
			console.log(i + " out of " + r.length + " paths are valid");
		}
	}
	clearLevelTimeProgressionData() {
		let e = { ...y.getState().results[this.levelTimeProgression] };
		e.data = [], a("UPDATE_RESULT", {
			uuid: this.levelTimeProgression,
			result: e
		});
	}
	reset() {
		this.rootImageSource = null, this.allRayPaths = null, this.validRayPaths = null, this.plotOrders = this.possibleOrders.map((e) => e.value), this.selectedImageSourcePath.geometry.setPoints(/* @__PURE__ */ new Float32Array()), this.clearImageSources(), this.clearRayPaths(), this.clearLevelTimeProgressionData();
	}
	drawImageSources() {
		this.clearImageSources();
		for (let e = 0; e < this.plotOrders.length; e++) {
			let t = this.rootImageSource?.getChildrenOfOrder(this.plotOrders[e]);
			for (let e = 0; e < t?.length; e++) {
				let n = t[e].position;
				this.overlay.addPoint([
					n.x,
					n.y,
					n.z
				]);
			}
		}
	}
	clearImageSources() {
		this.overlay.clearPoints();
	}
	drawRayPaths(e) {
		this.clearRayPaths();
		for (let e = 0; e < this.plotOrders.length; e++) {
			let t = this.getPathsOfOrder(this.plotOrders[e]);
			for (let e = 0; e < t.length; e++) {
				let n = t[e].path;
				for (let e = 0; e < n.length - 1; e++) {
					let t = n[e].point, r = n[e + 1].point;
					this.overlay.addLine([
						t.x,
						t.y,
						t.z
					], [
						r.x,
						r.y,
						r.z
					]);
				}
			}
		}
	}
	clearRayPaths() {
		this.overlay.clearLines();
	}
	toggleRayPathHighlight(e) {
		if (this.validRayPaths != null) {
			for (let t = 0; t < this.validRayPaths.length; t++) if (e === this.validRayPaths[t].uuid) {
				this.updateSelectedImageSourcePath(this.validRayPaths[t]), console.log("WILL HIGHLIGHT RAY PATH WITH ARRIVAL SPL " + f(this.validRayPaths[t].arrivalPressure([100], [1e3], this.temperature)) + " AND ARRIVAL TIME " + this.validRayPaths[t].arrivalTime(this.c));
				break;
			}
		}
	}
	async calculateImpulseResponse() {
		let e = b.getState().containers[this.sourceIDs[0]]?.initialSPL ?? 100, t = this.frequencies, n = 44100, r = Array(t.length).fill(e);
		if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
		if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
		if (this.validRayPaths?.length === 0) throw Error("No rays have been traced yet");
		let i = this.c, a = this.validRayPaths;
		if (a?.sort((e, t) => e.arrivalTime(i) > t.arrivalTime(i) ? 1 : -1), console.log(a), a != null) {
			let e = n * (a[a.length - 1].arrivalTime(i) + .05), t = [];
			for (let n = 0; n < this.frequencies.length; n++) t.push(new Float32Array(Math.floor(e)));
			for (let e = 0; e < a.length; e++) {
				let o = a[e].arrivalTime(i), s = j(r, this.frequencies, a[e].path, this.temperature), c = Math.floor(o * n);
				for (let e = 0; e < this.frequencies.length; e++) t[e][c] += s[e];
			}
			let o = S.createOfflineContext(1, e, n), s = Array(this.frequencies.length);
			for (let e = 0; e < this.frequencies.length; e++) s[e] = S.createFilteredSource(t[e], this.frequencies[e], 1.414, 1, o);
			console.log(s);
			let c = S.createMerger(s.length, o);
			for (let e = 0; e < s.length; e++) s[e].source.connect(c, 0, e);
			return c.connect(o.destination), s.forEach((e) => e.source.start()), this.impulseResponse = await S.renderContextAsync(o), this.impulseResponse;
		}
	}
	async playImpulseResponse() {
		let e = await C(this.impulseResponse, () => this.calculateImpulseResponse(), this.uuid, "IMAGESOURCE_SET_PROPERTY");
		this.impulseResponse = e.impulseResponse;
	}
	async downloadImpulseResponse(e, t = 44100) {
		let n = await w(this.impulseResponse, () => this.calculateImpulseResponse(), e, t);
		this.impulseResponse = n.impulseResponse;
	}
	get sources() {
		return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => b.getState().containers[e]) : [];
	}
	get receivers() {
		return this.receiverIDs.length > 0 && Object.keys(b.getState().containers).length > 0 ? this.receiverIDs.map((e) => b.getState().containers[e]) : [];
	}
	get room() {
		return b.getState().containers[this.roomID];
	}
	get numValidRays() {
		let e = this.validRayPaths?.length;
		return e === void 0 ? 0 : e;
	}
	get numTotalRays() {
		let e = this.allRayPaths?.length;
		return e === void 0 ? 0 : e;
	}
	set maxReflectionOrderReset(e) {
		this.maxReflectionOrder = e, this.reset();
	}
	get maxReflectionOrderReset() {
		return this.maxReflectionOrder;
	}
	set rayPathsVisible(e) {
		e === this._rayPathsVisible || (e ? this.drawRayPaths() : this.clearRayPaths()), this._rayPathsVisible = e;
	}
	get rayPathsVisible() {
		return this._rayPathsVisible;
	}
	set imageSourcesVisible(e) {
		e === this._imageSourcesVisible || (e ? this.drawImageSources() : this.clearImageSources()), this._imageSourcesVisible = e;
	}
	get imageSourcesVisible() {
		return this._imageSourcesVisible;
	}
	get possibleOrders() {
		let e = [];
		for (let t = 0; t <= this.maxReflectionOrder; t++) {
			let n = {
				value: t,
				label: t.toString()
			};
			e.push(n);
		}
		return e;
	}
	get selectedPlotOrders() {
		let e = [];
		for (let t = 0; t < this.plotOrders.length; t++) {
			let n = {
				value: this.plotOrders[t],
				label: this.plotOrders[t].toString()
			};
			e.push(n);
		}
		return e;
	}
	set toggleOrder(e) {
		e > this.maxReflectionOrder || (this.plotOrders.includes(e) ? this.plotOrders.splice(this.plotOrders.indexOf(e), 1) : this.plotOrders.push(e)), this.clearRayPaths(), this.clearImageSources(), this.drawRayPaths(), this.drawImageSources();
	}
	get plotOrders() {
		return this._plotOrders;
	}
	set plotOrders(e) {
		this._plotOrders = e, this.clearRayPaths(), this.clearImageSources(), this.rayPathsVisible && this.drawRayPaths(), this.imageSourcesVisible && this.drawImageSources();
	}
	get temperature() {
		return this.room?.temperature ?? 20;
	}
	get c() {
		return v(this.temperature);
	}
	set plotFrequency(e) {
		this._plotFrequency = e, this.calculateLTP();
	}
};
function K(e, t, n) {
	if (t < 0) return null;
	if (t === 0) return e;
	let r = n ?? e.room.allSurfaces;
	for (let n = 0; n < r.length; n++) {
		let i = e.reflector === null || e.reflector !== r[n], a = e.reflector === null || J(r[n], e.reflector), o;
		if (o = e.reflector === null || Z(r[n], e.reflector), i && a && o) {
			let i = new H({
				baseSource: e.baseSource,
				position: Q(e.position.clone(), r[n]).clone(),
				room: e.room,
				reflector: r[n],
				parent: e,
				order: e.order + 1
			});
			e.children.push(i), t > 0 && K(i, t - 1, r);
		}
	}
	return e;
}
function q(e, t) {
	let n = [], r = e.order, i = {
		point: t.position.clone(),
		reflectingSurface: null,
		angle: null
	};
	n[r + 1] = i;
	let a = new T.Raycaster();
	for (let t = r; t >= 1; t--) {
		let r = e.position.clone(), i = n[t + 1].point.clone(), o = new E(0, 0, 0);
		if (o.subVectors(r, i), o.normalize(), a.set(i, o), e.reflector === null) return null;
		let s = a.intersectObject(e.reflector.mesh, !0);
		if (s.length > 0) {
			let r = {
				point: s[0].point,
				reflectingSurface: e.reflector,
				angle: L(o, z(s[0], e.reflector.matrixWorld, e.reflector.normal))
			};
			n[t] = r;
		} else return null;
		e.parent !== null && (e = e.parent);
	}
	return n[0] = {
		point: e.position.clone(),
		reflectingSurface: null,
		angle: null
	}, new U(n);
}
function J(e, t) {
	let n = Y(t), r = F(t.normal, t.matrixWorld);
	return R(X(e), n, r);
}
function Y(e) {
	let t = e.polygon.vertices[0];
	return e.localToWorld(new E(t[0], t[1], t[2]));
}
function X(e) {
	let t = e.polygon.vertices, n = new E();
	for (let r of t) n.add(e.localToWorld(new E(r[0], r[1], r[2])));
	return n.multiplyScalar(1 / Math.max(t.length, 1));
}
function Z(e, t) {
	let n = F(e.normal, e.matrixWorld), r = F(t.normal, t.matrixWorld);
	return n.dot(r) <= 0;
}
function Q(e, t) {
	let n = new E(t.polygon.vertices[0][0], t.polygon.vertices[0][1], t.polygon.vertices[0][2]);
	return I(e, t.localToWorld(n), F(t.normal, t.matrixWorld));
}
n("IMAGESOURCE_SET_PROPERTY", l), n("REMOVE_IMAGESOURCE", i), n("ADD_IMAGESOURCE", c(G)), n("UPDATE_IMAGESOURCE", (e) => void s.getState().solvers[e].updateImageSourceCalculation()), n("RESET_IMAGESOURCE", (e) => void s.getState().solvers[e].reset()), n("CALCULATE_LTP", (e) => void s.getState().solvers[e].calculateLTP()), n("IMAGESOURCE_PLAY_IR", (e) => void s.getState().solvers[e].playImpulseResponse().catch(console.error)), n("IMAGESOURCE_DOWNLOAD_IR", (e) => {
	let t = s.getState().solvers[e], n = b.getState().containers, r = `ir-imagesource-${t.sourceIDs.length > 0 && n[t.sourceIDs[0]]?.name || "source"}-${t.receiverIDs.length > 0 && n[t.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	t.downloadImpulseResponse(r).catch(console.error);
});
export { M as n, G as t };

//# sourceMappingURL=image-source-BZqI5XVp.mjs.map