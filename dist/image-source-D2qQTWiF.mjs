import { S as e, _ as t, i as n, n as r, o as i, p as a, s as o, v as s, y as c } from "./FileSaver.min-DhK9iPpQ.mjs";
import { t as l } from "./renderer-CQRXHm3p.mjs";
import { a as u, g as d, i as f } from "./store-Dol3XeT3.mjs";
import { t as p } from "./audio-engine-CmA_oANp.mjs";
import { a as m, i as h, n as g, r as _ } from "./TessellateModifier-C1tXMs2g.mjs";
import "./acoustics-DtDxi75Z.mjs";
import { n as v } from "./air-attenuation-BJnoHmX2.mjs";
import { t as y } from "./geometric-spreading-RO5977E6.mjs";
import { t as b } from "./sound-speed-CfEkirc1.mjs";
import { n as x } from "./room-CAL7Miyq.mjs";
import { t as S } from "./solver-DovuaY8D.mjs";
import { a as C, r as w } from "./export-playback-BZxoZ2U1.mjs";
import * as T from "three";
import { Vector3 as E } from "three";
import { MeshLine as D, MeshLineMaterial as O } from "three.meshline";
//#region src/compute/raytracer/image-source/arrival-pressure.ts
function k(e) {
	let t = 0;
	for (let n = 1; n < e.length; n++) t += e[n - 1].point.distanceTo(e[n].point);
	return t;
}
function A(e, t, n, r = 20) {
	let i = h(_(e)), a = k(n), o = y(a);
	for (let e = 0; e < i.length; e++) i[e] *= o;
	for (let e of n) {
		if (!e.reflectingSurface) continue;
		let n = e.angle ?? 0;
		for (let r = 0; r < t.length; r++) i[r] *= e.reflectingSurface.reflectionFunction(t[r], n);
	}
	let s = m(g(i)), c = v(t, r);
	for (let e = 0; e < t.length; e++) s[e] -= c[e] * a;
	return _(s);
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
//#endregion
//#region src/compute/raytracer/image-source/selection.ts
function M(e, t) {
	return e || (t[0] ?? "");
}
function N(e, t) {
	if (!t.length) return e;
	let n = new Set(t);
	return e.filter((e) => n.has(e.uuid));
}
//#endregion
//#region src/compute/raytracer/image-source/index.ts
function P() {
	let e = new D();
	e.setPoints(/* @__PURE__ */ new Float32Array());
	let t = new O({
		lineWidth: .1,
		color: 16711680,
		sizeAttenuation: 1
	});
	return new T.Mesh(e, t);
}
var F = class {
	baseSource;
	children;
	parent;
	reflector;
	order;
	position;
	room;
	uuid;
	constructor(t) {
		this.baseSource = t.baseSource, this.reflector = t.reflector, this.order = t.order, this.position = t.position, this.children = [], this.parent = t.parent, this.room = t.room, this.uuid = e();
	}
	constructPathsForAllDescendents(e, t = !0) {
		let n = [];
		if (t) {
			let t = B(this, e);
			t !== null && n.push(t);
		}
		for (let t = 0; t < this.children.length; t++) {
			let r = B(this.children[t], e);
			r !== null && n.push(r), this.children[t].hasChildren && (n = n.concat(this.children[t].constructPathsForAllDescendents(e, !1)));
		}
		return n;
	}
	markupAllDescendents() {
		for (let e = 0; e < this.children.length; e++) {
			let t = this.children[e].position.clone();
			l.markup.addPoint([
				t.x,
				t.y,
				t.z
			], [
				0,
				0,
				0
			]), this.children[e].hasChildren && this.children[e].markupAllDescendents();
		}
	}
	markup() {
		let e = this.position.clone();
		l.markup.addPoint([
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
}, I = class {
	path;
	uuid;
	highlight;
	constructor(t) {
		this.path = t, this.uuid = e(), this.highlight = !1;
	}
	markup() {
		for (let e = 0; e < this.path.length - 1; e++) {
			let t = this.path[e].point.clone(), n = this.path[e + 1].point.clone();
			l.markup.addLine([
				t.x,
				t.y,
				t.z
			], [
				n.x,
				n.y,
				n.z
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
}, L = {
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
}, R = class extends S {
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
	_plotFrequency;
	isHybrid;
	constructor(n = L, r = !1) {
		super(n), this.uuid = n.uuid || e(), this.kind = "image-source", this.name = n.name, this.roomID = n.roomID, this.sourceIDs = n.sourceIDs, this.receiverIDs = n.receiverIDs, this.maxReflectionOrder = n.maxReflectionOrder, this.frequencies = n.frequencies, this._imageSourcesVisible = n.imageSourcesVisible, this._rayPathsVisible = n.rayPathsVisible, this._plotOrders = n.plotOrders, this.levelTimeProgression = n.levelTimeProgression || e(), this.isHybrid = r, this.impulseResponsePlaying = !1, this._plotFrequency = 1e3, this.isHybrid || t("ADD_RESULT", {
			kind: f.LevelTimeProgression,
			data: [],
			info: {
				initialSPL: [100],
				frequency: [this._plotFrequency],
				maxOrder: this.maxReflectionOrder
			},
			name: `LTP - ${this.name}`,
			uuid: this.levelTimeProgression,
			from: this.uuid
		}), this.surfaceIDs = n.surfaceIDs ?? [], this.rootImageSource = null, this.allRayPaths = null, this.validRayPaths = null, this.roomID = M(this.roomID, x().map((e) => e.uuid)), this.selectedImageSourcePath = P(), l.markup.add(this.selectedImageSourcePath);
	}
	save() {
		return a([
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
		l.markup.remove(this.selectedImageSourcePath), this.reset(), t("REMOVE_RESULT", this.levelTimeProgression);
	}
	updateSelectedImageSourcePath(e) {
		this.selectedImageSourcePath.geometry.setPoints(new Float32Array(e.path.map((e) => e.point.toArray()).flat())), console.log(e.path.map((e) => e.point.toArray()).flat());
	}
	updateImageSourceCalculation() {
		this.clearRayPaths(), this.clearImageSources();
		let e = d.getState().containers, t = this.room.allSurfaces, n = N(t, this.surfaceIDs), r = [], i = [], a = null;
		for (let o of this.sourceIDs) {
			let s = e[o];
			if (!s) continue;
			let c = z(new F({
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
				pressure: r[a].arrivalPressure(t, n, this.temperature)
			};
			i.push(o);
		}
		return i;
	}
	calculateLTP(e = this.c, n = !1) {
		if (!this.validRayPaths || this.validRayPaths.length === 0) {
			if (this.sourceIDs.length > 0 && this.receiverIDs.length > 0) {
				this.updateImageSourceCalculation();
				return;
			}
			return;
		}
		let r = this.validRayPaths;
		r?.sort((t, n) => t.arrivalTime(e) > n.arrivalTime(e) ? 1 : -1);
		let i = { ...u.getState().results[this.levelTimeProgression] };
		if (i.data = [], i.info = {
			...i.info,
			maxOrder: this.maxReflectionOrder,
			frequency: [this._plotFrequency]
		}, r !== void 0) for (let t = 0; t < r?.length; t++) {
			let a = r[t].arrivalTime(e), o = r[t].arrivalPressure(i.info.initialSPL, i.info.frequency, this.temperature);
			n && console.log("Arrival: " + (t + 1) + " | Arrival Time: (s) " + a + " | Arrival Pressure(1000Hz): " + o + " | Order " + r[t].order), i.data.push({
				time: a,
				pressure: m(o),
				arrival: t + 1,
				order: r[t].order,
				uuid: r[t].uuid
			});
		}
		t("UPDATE_RESULT", {
			uuid: this.levelTimeProgression,
			result: i
		});
	}
	getPathsOfOrder(e) {
		let t = [];
		if (this.validRayPaths !== null) for (let n = 0; n < this.validRayPaths?.length; n++) this.validRayPaths[n].order === e && t.push(this.validRayPaths[n]);
		return t;
	}
	test() {
		let e = s.postMessage("FETCH_SOURCE", this.sourceIDs[0])[0], t = z(new F({
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
			for (let t = 0; t < r.length; t++) r[t].isvalid(this.room.allSurfaces) && (r[t].markup(), console.log(r[t]), console.log(r[t].totalLength), console.log(r[t].arrivalTime(this.c)), console.log(_(e)), i++);
			console.log(i + " out of " + r.length + " paths are valid");
		}
	}
	clearLevelTimeProgressionData() {
		let e = { ...u.getState().results[this.levelTimeProgression] };
		e.data = [], t("UPDATE_RESULT", {
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
			for (let e = 0; e < t?.length; e++) t[e].markup();
		}
	}
	clearImageSources() {
		l.markup.clearPoints();
	}
	drawRayPaths(e) {
		this.clearRayPaths();
		for (let e = 0; e < this.plotOrders.length; e++) {
			let t = this.getPathsOfOrder(this.plotOrders[e]);
			for (let e = 0; e < t.length; e++) t[e].markup();
		}
	}
	clearRayPaths() {
		l.markup.clearLines();
	}
	toggleRayPathHighlight(e) {
		if (this.validRayPaths != null) {
			for (let t = 0; t < this.validRayPaths.length; t++) if (e === this.validRayPaths[t].uuid) {
				this.updateSelectedImageSourcePath(this.validRayPaths[t]), console.log("WILL HIGHLIGHT RAY PATH WITH ARRIVAL SPL " + m(this.validRayPaths[t].arrivalPressure([100], [1e3], this.temperature)) + " AND ARRIVAL TIME " + this.validRayPaths[t].arrivalTime(this.c));
				break;
			}
		}
	}
	async calculateImpulseResponse() {
		let e = d.getState().containers[this.sourceIDs[0]]?.initialSPL ?? 100, t = this.frequencies, n = 44100, r = Array(t.length).fill(e);
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
			let o = p.createOfflineContext(1, e, n), s = Array(this.frequencies.length);
			for (let e = 0; e < this.frequencies.length; e++) s[e] = p.createFilteredSource(t[e], this.frequencies[e], 1.414, 1, o);
			console.log(s);
			let c = p.createMerger(s.length, o);
			for (let e = 0; e < s.length; e++) s[e].source.connect(c, 0, e);
			return c.connect(o.destination), s.forEach((e) => e.source.start()), this.impulseResponse = await p.renderContextAsync(o), this.impulseResponse;
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
		return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => d.getState().containers[e]) : [];
	}
	get receivers() {
		return this.receiverIDs.length > 0 && Object.keys(d.getState().containers).length > 0 ? this.receiverIDs.map((e) => d.getState().containers[e]) : [];
	}
	get room() {
		return d.getState().containers[this.roomID];
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
		return b(this.temperature);
	}
	set plotFrequency(e) {
		this._plotFrequency = e, this.calculateLTP();
	}
};
function z(e, t, n) {
	if (t < 0) return null;
	if (t === 0) return e;
	let r = n ?? e.room.allSurfaces;
	for (let n = 0; n < r.length; n++) {
		let i = e.reflector === null || e.reflector !== r[n], a;
		if (a = e.reflector === null || V(r[n], e.reflector), i && a) {
			let i = new F({
				baseSource: e.baseSource,
				position: H(e.position.clone(), r[n]).clone(),
				room: e.room,
				reflector: r[n],
				parent: e,
				order: e.order + 1
			});
			e.children.push(i), t > 0 && z(i, t - 1, r);
		}
	}
	return e;
}
function B(e, t) {
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
				angle: o.clone().multiplyScalar(-1).angleTo(s[0].face.normal)
			};
			n[t] = r;
		} else return null;
		e.parent !== null && (e = e.parent);
	}
	return n[0] = {
		point: e.position.clone(),
		reflectingSurface: null,
		angle: null
	}, new I(n);
}
function V(e, t) {
	let n = e.normal.clone(), r = t.normal.clone();
	return n.dot(r) <= 0;
}
function H(e, t) {
	let n = new E(t.polygon.vertices[0][0], t.polygon.vertices[0][1], t.polygon.vertices[0][2]), r = t.localToWorld(n), i = t.normal.clone(), a = i.clone();
	a.multiplyScalar(-1);
	let o = r.dot(a), s = i.clone();
	s.multiplyScalar(e.dot(i) + o);
	let c = e.clone();
	c.sub(s);
	let l = s;
	return l.multiplyScalar(-1), l.add(c), l;
}
c("IMAGESOURCE_SET_PROPERTY", i), c("REMOVE_IMAGESOURCE", n), c("ADD_IMAGESOURCE", r(R)), c("UPDATE_IMAGESOURCE", (e) => void o.getState().solvers[e].updateImageSourceCalculation()), c("RESET_IMAGESOURCE", (e) => void o.getState().solvers[e].reset()), c("CALCULATE_LTP", (e) => void o.getState().solvers[e].calculateLTP()), c("IMAGESOURCE_PLAY_IR", (e) => void o.getState().solvers[e].playImpulseResponse().catch(console.error)), c("IMAGESOURCE_DOWNLOAD_IR", (e) => {
	let t = o.getState().solvers[e], n = d.getState().containers, r = `ir-imagesource-${t.sourceIDs.length > 0 && n[t.sourceIDs[0]]?.name || "source"}-${t.receiverIDs.length > 0 && n[t.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	t.downloadImpulseResponse(r).catch(console.error);
});
//#endregion
export { R as ImageSourceSolver, R as default };

//# sourceMappingURL=image-source-D2qQTWiF.mjs.map