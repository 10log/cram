import { C as e, a as t, b as n, c as r, m as i, n as a, s as o, v as s, y as c } from "./FileSaver.min-BS9rdHrk.mjs";
import { t as l } from "./renderer-BeKP35ez.mjs";
import { a as u, g as d, i as f } from "./store-DRnKXLf0.mjs";
import { t as p } from "./audio-engine-BVaMF_Iu.mjs";
import "./acoustics-BPdIidDA.mjs";
import { a as m, c as h, n as g, o as _, s as v } from "./room-ioMGbMK5.mjs";
import { t as y } from "./air-attenuation-DrZYpv8D.mjs";
import { t as b } from "./sound-speed-CfEkirc1.mjs";
import { t as x } from "./solver-DCp-VMaM.mjs";
import { a as S, r as C } from "./export-playback-BtFAijfR.mjs";
import * as w from "three";
import { Vector3 as T } from "three";
import { MeshLine as E, MeshLineMaterial as D } from "three.meshline";
//#region src/compute/raytracer/image-source/index.ts
function O() {
	let e = [], t = new E();
	t.setPoints(e);
	let n = new D({
		lineWidth: .1,
		color: 16711680,
		sizeAttenuation: 1
	});
	return new w.Mesh(t, n);
}
var k = class {
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
			let t = P(this, e);
			t !== null && n.push(t);
		}
		for (let t = 0; t < this.children.length; t++) {
			let r = P(this.children[t], e);
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
}, A = class {
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
				let i = new T(0, 0, 0);
				i.subVectors(r, n), i.normalize();
				let a = new w.Raycaster();
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
		let r = v(_(e));
		for (let e = 0; e < this.path.length; e++) {
			let n = this.path[e];
			if (n.reflectingSurface !== null) for (let e = 0; e < t.length; e++) {
				let i = Math.abs(n.reflectingSurface.reflectionFunction(t[e], n.angle));
				r[e] = r[e] * i;
			}
		}
		let i = h(m(r)), a = y(t, n);
		for (let e = 0; e < t.length; e++) i[e] = i[e] - a[e] * this.totalLength;
		return _(i);
	}
	arrivalTime(e) {
		return this.totalLength / e;
	}
}, j = {
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
}, M = class extends x {
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
	constructor(t = j, n = !1) {
		super(t), this.uuid = t.uuid || e(), this.kind = "image-source", this.name = t.name, this.roomID = t.roomID, this.sourceIDs = t.sourceIDs, this.receiverIDs = t.receiverIDs, this.maxReflectionOrder = t.maxReflectionOrder, this.frequencies = t.frequencies, this._imageSourcesVisible = t.imageSourcesVisible, this._rayPathsVisible = t.rayPathsVisible, this._plotOrders = t.plotOrders, this.levelTimeProgression = t.levelTimeProgression || e(), this.isHybrid = n, this.impulseResponsePlaying = !1, this._plotFrequency = 1e3, this.isHybrid || s("ADD_RESULT", {
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
		}), this.surfaceIDs = [], this.rootImageSource = null, this.allRayPaths = null, this.validRayPaths = null;
		let r = g();
		this.roomID = r[0].uuid, this.selectedImageSourcePath = O(), l.markup.add(this.selectedImageSourcePath);
	}
	save() {
		return i([
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
		l.markup.remove(this.selectedImageSourcePath), this.reset(), s("REMOVE_RESULT", this.levelTimeProgression);
	}
	updateSelectedImageSourcePath(e) {
		this.selectedImageSourcePath.geometry.setPoints(new Float32Array(e.path.map((e) => e.point.toArray()).flat())), console.log(e.path.map((e) => e.point.toArray()).flat());
	}
	updateImageSourceCalculation() {
		this.clearRayPaths(), this.clearImageSources();
		let e = N(new k({
			baseSource: d.getState().containers[this.sourceIDs[0]],
			position: d.getState().containers[this.sourceIDs[0]].position.clone(),
			room: this.room,
			reflector: null,
			parent: null,
			order: 0
		}), this.maxReflectionOrder);
		this.rootImageSource = e;
		let t, n = [];
		if (e !== null) {
			t = e.constructPathsForAllDescendents(d.getState().containers[this.receiverIDs[0]]), this.allRayPaths = t;
			for (let e = 0; e < t?.length; e++) t[e].isvalid(this.room.allSurfaces) && n.push(t[e]);
		}
		this.validRayPaths = n, this._imageSourcesVisible && this.drawImageSources(), this._rayPathsVisible && this.drawRayPaths(), this.isHybrid || this.calculateLTP();
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
	calculateLTP(e = this.c, t = !1) {
		if (!this.validRayPaths || this.validRayPaths.length === 0) {
			if (this.sourceIDs.length > 0 && this.receiverIDs.length > 0) {
				this.updateImageSourceCalculation();
				return;
			}
			return;
		}
		let n = this.validRayPaths;
		n?.sort((t, n) => t.arrivalTime(e) > n.arrivalTime(e) ? 1 : -1);
		let r = { ...u.getState().results[this.levelTimeProgression] };
		if (r.data = [], r.info = {
			...r.info,
			maxOrder: this.maxReflectionOrder,
			frequency: [this._plotFrequency]
		}, n !== void 0) for (let i = 0; i < n?.length; i++) {
			let a = n[i].arrivalTime(e), o = n[i].arrivalPressure(r.info.initialSPL, r.info.frequency, this.temperature);
			t && console.log("Arrival: " + (i + 1) + " | Arrival Time: (s) " + a + " | Arrival Pressure(1000Hz): " + o + " | Order " + n[i].order), r.data.push({
				time: a,
				pressure: h(o),
				arrival: i + 1,
				order: n[i].order,
				uuid: n[i].uuid
			});
		}
		s("UPDATE_RESULT", {
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
		let e = c.postMessage("FETCH_SOURCE", this.sourceIDs[0])[0], t = N(new k({
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
		e.data = [], s("UPDATE_RESULT", {
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
				this.updateSelectedImageSourcePath(this.validRayPaths[t]), console.log("WILL HIGHLIGHT RAY PATH WITH ARRIVAL SPL " + h(this.validRayPaths[t].arrivalPressure([100], [1e3], this.temperature)) + " AND ARRIVAL TIME " + this.validRayPaths[t].arrivalTime(this.c));
				break;
			}
		}
	}
	async calculateImpulseResponse() {
		let e = this.frequencies, t = 44100, n = Array(e.length).fill(100);
		if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
		if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
		if (this.validRayPaths?.length === 0) throw Error("No rays have been traced yet");
		let r = this.c, i = this.validRayPaths;
		if (i?.sort((e, t) => e.arrivalTime(r) > t.arrivalTime(r) ? 1 : -1), console.log(i), i != null) {
			let e = t * (i[i.length - 1].arrivalTime(r) + .05), a = [];
			for (let t = 0; t < this.frequencies.length; t++) a.push(new Float32Array(Math.floor(e)));
			for (let e = 0; e < i.length; e++) {
				let o = i[e].arrivalTime(r), s = i[e].arrivalPressure(n, this.frequencies, this.temperature);
				Math.random() > .5 && (s = s.map((e) => -e));
				let c = Math.floor(o * t);
				for (let e = 0; e < this.frequencies.length; e++) a[e][c] += s[e];
			}
			let o = p.createOfflineContext(1, e, t), s = Array(this.frequencies.length);
			for (let e = 0; e < this.frequencies.length; e++) s[e] = p.createFilteredSource(a[e], this.frequencies[e], 1.414, 1, o);
			console.log(s);
			let c = p.createMerger(s.length, o);
			for (let e = 0; e < s.length; e++) s[e].source.connect(c, 0, e);
			return c.connect(o.destination), s.forEach((e) => e.source.start()), this.impulseResponse = await p.renderContextAsync(o), this.impulseResponse;
		}
	}
	async playImpulseResponse() {
		let e = await S(this.impulseResponse, () => this.calculateImpulseResponse(), this.uuid, "IMAGESOURCE_SET_PROPERTY");
		this.impulseResponse = e.impulseResponse;
	}
	async downloadImpulseResponse(e, t = 44100) {
		let n = await C(this.impulseResponse, () => this.calculateImpulseResponse(), e, t);
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
function N(e, t) {
	let n = e.room.allSurfaces;
	if (t == 0) return null;
	for (let r = 0; r < n.length; r++) {
		let i = e.reflector === null || e.reflector !== n[r], a;
		if (a = e.reflector === null || F(n[r], e.reflector), i && a) {
			let i = new k({
				baseSource: e.baseSource,
				position: I(e.position.clone(), n[r]).clone(),
				room: e.room,
				reflector: n[r],
				parent: e,
				order: e.order + 1
			});
			e.children.push(i), t > 0 && N(i, t - 1);
		}
	}
	return e;
}
function P(e, t) {
	let n = [], r = e.order, i = {
		point: t.position.clone(),
		reflectingSurface: null,
		angle: null
	};
	n[r + 1] = i;
	let a = new w.Raycaster();
	for (let t = r; t >= 1; t--) {
		let r = e.position.clone(), i = n[t + 1].point.clone(), o = new T(0, 0, 0);
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
	}, new A(n);
}
function F(e, t) {
	let n = e.normal.clone(), r = t.normal.clone();
	return n.dot(r) <= 0;
}
function I(e, t) {
	let n = new T(t.polygon.vertices[0][0], t.polygon.vertices[0][1], t.polygon.vertices[0][2]), r = t.localToWorld(n), i = t.normal.clone(), a = i.clone();
	a.multiplyScalar(-1);
	let o = r.dot(a), s = i.clone();
	s.multiplyScalar(e.dot(i) + o);
	let c = e.clone();
	c.sub(s);
	let l = s;
	return l.multiplyScalar(-1), l.add(c), l;
}
n("IMAGESOURCE_SET_PROPERTY", o), n("REMOVE_IMAGESOURCE", t), n("ADD_IMAGESOURCE", a(M)), n("UPDATE_IMAGESOURCE", (e) => void r.getState().solvers[e].updateImageSourceCalculation()), n("RESET_IMAGESOURCE", (e) => void r.getState().solvers[e].reset()), n("CALCULATE_LTP", (e) => void r.getState().solvers[e].calculateLTP()), n("IMAGESOURCE_PLAY_IR", (e) => void r.getState().solvers[e].playImpulseResponse().catch(console.error)), n("IMAGESOURCE_DOWNLOAD_IR", (e) => {
	let t = r.getState().solvers[e], n = d.getState().containers, i = `ir-imagesource-${t.sourceIDs.length > 0 && n[t.sourceIDs[0]]?.name || "source"}-${t.receiverIDs.length > 0 && n[t.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	t.downloadImpulseResponse(i).catch(console.error);
});
//#endregion
export { M as t };

//# sourceMappingURL=image-source-Csr4Kim9.mjs.map