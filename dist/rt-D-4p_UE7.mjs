import { O as e, S as t, _ as n, i as r, n as i, o as a, s as o, t as s, y as c } from "./FileSaver.min-DhK9iPpQ.mjs";
import { a as l, g as u, i as d, o as f } from "./store-CAL1R5s7.mjs";
import { t as p } from "./round-to-CrejEAZs.mjs";
import { n as m, t as h } from "./bands-CXX2p1-Y.mjs";
import "./acoustics-DtDxi75Z.mjs";
import { t as g } from "./air-attenuation-DrZYpv8D.mjs";
import { t as _ } from "./rt-constants-B_io3wgi.mjs";
import { t as v } from "./solver-DovuaY8D.mjs";
import { Matrix4 as y, Triangle as b, Vector3 as x } from "three";
//#region src/compute/rt/index.ts
var S = /* @__PURE__ */ e(s()), C = { name: "RT" }, w = class extends v {
	uuid;
	sabine_rt;
	eyring_rt;
	ap_rt;
	volume;
	frequencies;
	roomID;
	resultID;
	resultExists;
	constructor(e = C) {
		super(e), this.kind = "rt60", this.name = e.name || C.name, this.uuid = t(), this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
		let n = u.getState().getRooms();
		this.roomID = n.length > 0 ? n[0].uuid : "", this.frequencies = m.slice(4, 11), this.resultID = t(), this.resultExists = !1, this.volume = u.getState().containers[this.roomID].volumeOfMesh();
	}
	save() {
		let { name: e, kind: t, uuid: n, autoCalculate: r } = this;
		return {
			name: e,
			kind: t,
			uuid: n,
			autoCalculate: r
		};
	}
	restore(e) {
		return super.restore(e), this.kind = e.kind, this;
	}
	calculate() {
		this.reset();
		let e = g(this.frequencies, this.temperature, this.humidity).map((e) => e / (20 / Math.log(10)));
		this.sabine_rt = this.sabine(e), this.eyring_rt = this.eyring(e), this.ap_rt = this.arauPuchades(this.room, this.frequencies), this.resultExists ||= (n("ADD_RESULT", {
			kind: d.StatisticalRT60,
			data: [],
			info: {
				frequency: this.frequencies,
				airabsorption: !1,
				temperature: this.temperature,
				humidity: this.humidity
			},
			name: "Statistical RT Results",
			uuid: this.resultID,
			from: this.uuid
		}), !0);
		let t = { ...l.getState().results[this.resultID] };
		t.data = [];
		for (let e = 0; e < this.frequencies.length; e++) t.data.push({
			frequency: this.frequencies[e],
			sabine: this.sabine_rt[e],
			eyring: this.eyring_rt[e],
			ap: this.ap_rt[e]
		});
		n("UPDATE_RESULT", {
			uuid: this.resultID,
			result: t
		});
	}
	reset() {
		this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
	}
	sabine(e) {
		let t = this.room, n = this.unitsConstant, r = this.volume, i = [];
		return this.frequencies.forEach((a, o) => {
			let s = 0;
			t.allSurfaces.forEach((e) => {
				s += e.getArea() * e.absorptionFunction(a);
			});
			let c = 4 * e[o] * r;
			i.push(n * r / (s + c));
		}), i;
	}
	eyring(e) {
		let t = this.room, n = this.unitsConstant, r = this.volume, i = [];
		return this.frequencies.forEach((a, o) => {
			let s = 0, c = 0;
			t.allSurfaces.forEach((e) => {
				c += e.getArea(), s += e.getArea() * e.absorptionFunction(a);
			});
			let l = Math.max(0, Math.min(s / c, .9999)), u = 4 * e[o] * r;
			i.push(n * r / (-c * Math.log(1 - l) + u));
		}), i;
	}
	arauPuchades(e, t = h) {
		let n = e.volumeOfMesh(), r = this.unitsConstant, i = [
			new y().fromArray([
				[
					0,
					0,
					0,
					0
				],
				[
					0,
					1,
					0,
					0
				],
				[
					0,
					0,
					1,
					0
				],
				[
					0,
					0,
					0,
					1
				]
			].flat()),
			new y().fromArray([
				[
					1,
					0,
					0,
					0
				],
				[
					0,
					0,
					0,
					0
				],
				[
					0,
					0,
					1,
					0
				],
				[
					0,
					0,
					0,
					1
				]
			].flat()),
			new y().fromArray([
				[
					1,
					0,
					0,
					0
				],
				[
					0,
					1,
					0,
					0
				],
				[
					0,
					0,
					0,
					0
				],
				[
					0,
					0,
					0,
					1
				]
			].flat())
		], a = e.allSurfaces.map((e) => {
			let n = e.triangles.reduce((e, t) => {
				let n = i.map((e) => t.map((t) => new x().fromArray(t).applyMatrix4(e))).map((e) => new b(...e).getArea());
				return e.map((e, t) => e + n[t]);
			}, [
				0,
				0,
				0
			]);
			return {
				area: n,
				sabines: t.map((t) => n.map((n) => e.absorptionFunction(t) * n))
			};
		}), [[o, s], [c, l], [u, d]] = [
			0,
			1,
			2
		].map((e) => {
			let n = a.reduce((t, { area: n }) => t + n[e], 0);
			return [n, t.map((t, n) => a.reduce((t, { sabines: r }) => t + r[n][e], 0)).map((e) => Math.max(0, Math.min(e / n, .9999)))];
		}), f = o + c + u;
		return t.map((e, t) => {
			let i = 4 * g([e])[0] * n;
			return (r * n / (-f * Math.log(1 - s[t]) + i)) ** (o / f) * (r * n / (-f * Math.log(1 - l[t]) + i)) ** (c / f) * (r * n / (-f * Math.log(1 - d[t]) + i)) ** (u / f);
		});
	}
	onParameterConfigFocus() {}
	onParameterConfigBlur() {}
	downloadRT60AsCSV() {
		let e = [
			`Octave Band (Hz),${this.frequencies.toString()}`,
			`Sabine RT,${this.sabine_rt.map((e) => e.toFixed(4)).toString()}`,
			`Eyring RT,${this.eyring_rt.map((e) => e.toFixed(4)).toString()}`,
			`Arau-Puchades RT,${this.ap_rt.map((e) => e.toFixed(4)).toString()}`
		].join("\n");
		console.log(e);
		var t = new Blob([e], { type: "text/csv" });
		S.default.saveAs(t, `rt60-${this.uuid}.csv`);
	}
	get unitsConstant() {
		return _[f.getState().units];
	}
	get temperature() {
		return this.room?.temperature ?? 20;
	}
	get humidity() {
		return this.room?.humidity ?? 40;
	}
	get room() {
		return u.getState().containers[this.roomID];
	}
	get noResults() {
		return this.sabine_rt.length === 0 && this.eyring_rt.length === 0 && this.ap_rt.length === 0;
	}
	get displayVolume() {
		return p(this.volume, 2);
	}
	set displayVolume(e) {
		this.volume = e;
	}
};
c("ADD_RT60", i(w)), c("UPDATE_RT60", (e) => void o.getState().solvers[e].calculate()), c("REMOVE_RT60", r), c("DOWNLOAD_RT60_RESULTS", (e) => void o.getState().solvers[e].downloadRT60AsCSV()), c("RT60_SET_PROPERTY", a);
//#endregion
export { w as RT60, w as default };

//# sourceMappingURL=rt-D-4p_UE7.mjs.map