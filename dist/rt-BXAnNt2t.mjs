import { t as e } from "./solver-BGP8KuNH.mjs";
import { n as t, t as n } from "./acoustics-Cs_0VALc.mjs";
import { t as r } from "./rt-constants-BAMpsGPB.mjs";
import { S as i, T as a, a as o, b as s, j as c, l, n as u, s as d, t as f } from "./FileSaver.min-C7ZD-uW3.mjs";
import { r as p } from "./air-attenuation-BBmC2Nj9.mjs";
import { a as m, g as h, i as g, o as _ } from "./store-Cb8r9O09.mjs";
import { t as v } from "./round-to-FZU9bzmC.mjs";
import { Matrix4 as y, Triangle as b, Vector3 as x } from "three";
// src/compute/rt/index.ts
var S = /* @__PURE__ */ c(f()), C = { name: "RT" }, w = class extends e {
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
		super(e), this.kind = "rt60", this.name = e.name || C.name, this.uuid = a(), this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
		let n = h.getState().getRooms();
		this.roomID = n.length > 0 ? n[0].uuid : "", this.frequencies = t.slice(4, 11), this.resultID = a(), this.resultExists = !1, this.volume = h.getState().containers[this.roomID].volumeOfMesh();
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
		let e = p(this.frequencies, this.temperature, this.humidity).map((e) => e / (20 / Math.log(10)));
		this.sabine_rt = this.sabine(e), this.eyring_rt = this.eyring(e), this.ap_rt = this.arauPuchades(this.room, this.frequencies), this.resultExists ||= (s("ADD_RESULT", {
			kind: g.StatisticalRT60,
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
		let t = { ...m.getState().results[this.resultID] };
		t.data = [];
		for (let e = 0; e < this.frequencies.length; e++) t.data.push({
			frequency: this.frequencies[e],
			sabine: this.sabine_rt[e],
			eyring: this.eyring_rt[e],
			ap: this.ap_rt[e]
		});
		s("UPDATE_RESULT", {
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
	arauPuchades(e, t = n) {
		let r = e.volumeOfMesh(), i = this.unitsConstant, a = [
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
		], o = e.allSurfaces.map((e) => {
			let n = e.triangles.reduce((e, t) => {
				let n = a.map((e) => t.map((t) => new x().fromArray(t).applyMatrix4(e))).map((e) => new b(...e).getArea());
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
		}), [[s, c], [l, u], [d, f]] = [
			0,
			1,
			2
		].map((e) => {
			let n = o.reduce((t, { area: n }) => t + n[e], 0);
			return [n, t.map((t, n) => o.reduce((t, { sabines: r }) => t + r[n][e], 0)).map((e) => Math.max(0, Math.min(e / n, .9999)))];
		}), m = s + l + d;
		return t.map((e, t) => {
			let n = 4 * p([e])[0] * r;
			return (i * r / (-m * Math.log(1 - c[t]) + n)) ** (s / m) * (i * r / (-m * Math.log(1 - u[t]) + n)) ** (l / m) * (i * r / (-m * Math.log(1 - f[t]) + n)) ** (d / m);
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
		return r[_.getState().units];
	}
	get temperature() {
		return this.room?.temperature ?? 20;
	}
	get humidity() {
		return this.room?.humidity ?? 40;
	}
	get room() {
		return h.getState().containers[this.roomID];
	}
	get noResults() {
		return this.sabine_rt.length === 0 && this.eyring_rt.length === 0 && this.ap_rt.length === 0;
	}
	get displayVolume() {
		return v(this.volume, 2);
	}
	set displayVolume(e) {
		this.volume = e;
	}
};
i("ADD_RT60", u(w)), i("UPDATE_RT60", (e) => void l.getState().solvers[e].calculate()), i("REMOVE_RT60", o), i("DOWNLOAD_RT60_RESULTS", (e) => void l.getState().solvers[e].downloadRT60AsCSV()), i("RT60_SET_PROPERTY", d);
export { w as RT60, w as default };

//# sourceMappingURL=rt-BXAnNt2t.mjs.map