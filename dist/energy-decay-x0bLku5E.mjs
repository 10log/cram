import { C as e, b as t, c as n, k as r, n as i, s as a, t as o, v as s } from "./FileSaver.min-BS9rdHrk.mjs";
import { t as c } from "./audio-engine-Cfjjb4lc.mjs";
import { t as l } from "./solver-DCp-VMaM.mjs";
//#region src/compute/schroeder.ts
var u = /* @__PURE__ */ r(o());
function d(e) {
	let t = e.length, n = new Float32Array(t), r = 0;
	for (let i = t - 1; i >= 0; i--) r += e[i] * e[i], n[i] = r;
	let i = n[0] || 1, a = new Float32Array(t);
	for (let e = 0; e < t; e++) a[e] = n[e] > 0 ? 10 * Math.log10(n[e] / i) : -Infinity;
	return a;
}
//#endregion
//#region src/compute/trim-ir.ts
function f(e) {
	let t = 1e-6, n = 0, r = e.length, i = 0;
	for (; i < e.length && Math.abs(e[i]) < t;) n = i, i++;
	for (i = e.length - 1; i >= 0 && Math.abs(e[i]) < t;) r = i, i--;
	return e.slice(n, r);
}
//#endregion
//#region src/compute/energy-decay.ts
var p = { name: "Energy Decay" };
window.AudioContext;
var m = [
	125,
	250,
	500,
	1e3,
	2e3,
	4e3,
	8e3
], h = class extends l {
	uuid;
	broadbandIRData;
	broadbandIRSampleRate;
	broadbandIRSource;
	source = null;
	filteredData;
	filteredEnergyDecayData;
	impulseResponsePlaying;
	filterTest;
	T15;
	T20;
	T30;
	constructor(t = p) {
		super(t), this.kind = "energydecay", this.name = t.name || p.name, this.broadbandIRData = /* @__PURE__ */ new Float32Array(), this.broadbandIRSampleRate = 0, this.uuid = e(), this.filteredData = [], this.filteredEnergyDecayData = [], this.impulseResponsePlaying = !1, this.filterTest = null, this.T15 = [], this.T20 = [], this.T30 = [];
	}
	calculateAcParams() {
		this.filteredData.length === 0 && console.error("No IR Data Loaded"), this.calculateOctavebandBackwardsIntegration();
		for (let e = 0; e < m.length; e++) this.T15[e] = g(this.filteredEnergyDecayData[e], 15, this.broadbandIRSampleRate), this.T20[e] = g(this.filteredEnergyDecayData[e], 20, this.broadbandIRSampleRate), this.T30[e] = g(this.filteredEnergyDecayData[e], 30, this.broadbandIRSampleRate);
		console.log(m), console.log("T15 Values: "), console.log(this.T15), console.log("T20 Values: "), console.log(this.T20), console.log("T30 Values: "), console.log(this.T30);
	}
	calculateOctavebandBackwardsIntegration() {
		for (let e = 0; e < m.length; e++) this.filteredEnergyDecayData[e] = d(this.filteredData[e]);
	}
	downloadResultsAsCSV() {
		let e = [
			`Octave Band (Hz),${m.toString()}`,
			`T15,${this.T15.map((e) => e.toFixed(4)).toString()}`,
			`T20,${this.T20.map((e) => e.toFixed(4)).toString()}`,
			`T30,${this.T30.map((e) => e.toFixed(4)).toString()}`
		].join("\n");
		var t = new Blob([e], { type: "text/csv" });
		u.default.saveAs(t, `energy-decay-${this.uuid}.csv`);
	}
	play(e) {
		c.context.state === "suspended" && c.context.resume(), e.connect(c.context.destination), e.start(), s("ENERGYDECAY_SET_PROPERTY", {
			uuid: this.uuid,
			property: "impulseResponsePlaying",
			value: !0
		}), e.onended = () => {
			e.stop(), e.disconnect(c.context.destination), s("ENERGYDECAY_SET_PROPERTY", {
				uuid: this.uuid,
				property: "impulseResponsePlaying",
				value: !1
			});
		};
	}
	set broadbandIR(e) {
		let t = this;
		c.context.decodeAudioData(e, async function(e) {
			let n = f(e.getChannelData(0));
			t.broadbandIRSource = c.createBufferSource(n), t.broadbandIRData = n, t.broadbandIRSampleRate = e.sampleRate, t.filterTest = c.createFilteredSource(n, 8e3, 1.414, 1);
			let r = [];
			for (let e = 0; e < m.length; e++) r[e] = n;
			for (let r = 0; r < m.length; r++) {
				let i = c.createOfflineContext(1, n.length, e.sampleRate), a = c.createFilteredSource(n, m[r], 1.414, 1, i);
				a.gain.connect(i.destination), a.source.start();
				let o = await c.renderContextAsync(i);
				t.filteredData.push(o.getChannelData(0));
			}
		});
	}
};
function g(e, t, n) {
	let r = -5 - t, i = _(v(y(e, -5))), a = _(v(y(e, r)));
	return Math.abs(a - i) / n * (60 / t);
}
function _(e) {
	let t = 0, n = e[t];
	for (let r = 0; r < e.length; r++) n > e[r] && (n = e[r], t = r);
	return t;
}
function v(e) {
	return e.map((e) => Math.abs(e));
}
function y(e, t) {
	return e.map((e) => e - t);
}
t("ADD_ENERGYDECAY", i(h)), t("ENERGYDECAY_SET_PROPERTY", a), t("CALCULATE_AC_PARAMS", (e) => void n.getState().solvers[e].calculateAcParams());
//#endregion
export { h as default };

//# sourceMappingURL=energy-decay-x0bLku5E.mjs.map