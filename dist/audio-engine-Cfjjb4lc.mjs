import { k as e, t } from "./FileSaver.min-BS9rdHrk.mjs";
import { r as n } from "./acoustics-SIlOec_Y.mjs";
//#region src/compute/acoustics/util/nums.ts
function r(e, t) {
	return typeof t == "number" ? e(t) : t.map((t) => e(t));
}
//#endregion
//#region src/compute/acoustics/bands.ts
function i(e, t) {
	return n.map((e) => e.Center).filter((n) => n >= Number(e || 0) && n <= Number(t || 2e4));
}
function a(e, t) {
	return r((t) => t / 2 ** (1 / (2 * e)), t);
}
function o(e, t) {
	return r((t) => t * 2 ** (1 / (2 * e)), t);
}
//#endregion
//#region src/compute/acoustics/util/wav.ts
var s = {
	pcm8: (e, t, n, r, i) => {
		let a = new Uint8Array(e, t), o = 0;
		for (let e = 0; e < i; ++e) for (let t = 0; t < r; ++t) {
			let r = Math.max(-1, Math.min(n[t][e], 1));
			r = (r * .5 + .5) * 255 | 0, a[o++] = r;
		}
	},
	pcm16: (e, t, n, r, i) => {
		let a = new Int16Array(e, t), o = 0;
		for (let e = 0; e < i; ++e) for (let t = 0; t < r; ++t) {
			let r = Math.max(-1, Math.min(n[t][e], 1));
			r = (r < 0 ? r * 32768 : r * 32767) | 0, a[o++] = r;
		}
	},
	pcm24: (e, t, n, r, i) => {
		let a = new Uint8Array(e, t), o = 0;
		for (let e = 0; e < i; ++e) for (let t = 0; t < r; ++t) {
			let r = Math.max(-1, Math.min(n[t][e], 1));
			r = (r < 0 ? 16777216 + r * 8388608 : r * 8388607) | 0, a[o++] = r >> 0 & 255, a[o++] = r >> 8 & 255, a[o++] = r >> 16 & 255;
		}
	},
	pcm32: (e, t, n, r, i) => {
		let a = new Int32Array(e, t), o = 0;
		for (let e = 0; e < i; ++e) for (let t = 0; t < r; ++t) {
			let r = Math.max(-1, Math.min(n[t][e], 1));
			r = (r < 0 ? r * 2147483648 : r * 2147483647) | 0, a[o++] = r;
		}
	},
	pcm32f: (e, t, n, r, i) => {
		let a = new Float32Array(e, t), o = 0;
		for (let e = 0; e < i; ++e) for (let t = 0; t < r; ++t) {
			let r = Math.max(-1, Math.min(n[t][e], 1));
			a[o++] = r;
		}
	},
	pcm64f: (e, t, n, r, i) => {
		let a = new Float64Array(e, t), o = 0;
		for (let e = 0; e < i; ++e) for (let t = 0; t < r; ++t) {
			let r = Math.max(-1, Math.min(n[t][e], 1));
			a[o++] = r;
		}
	}
};
function c(e, t) {
	let n = "pcm" + e + (t ? "f" : ""), r = s[n];
	if (!r) throw TypeError("Unsupported data format: " + n);
	return r;
}
function l(e, t) {
	let n = t.sampleRate || 48e3, r = !!(t.float || t.floatingPoint), i = r ? 32 : t.bitDepth | 0 || 16, a = e.length, o = e[0].length, s = /* @__PURE__ */ new ArrayBuffer(44 + o * a * (i >> 3)), l = new DataView(s), u = 0;
	function d(e) {
		l.setUint8(u++, e);
	}
	function f(e) {
		l.setUint16(u, e, !0), u += 2;
	}
	function p(e) {
		l.setUint32(u, e, !0), u += 4;
	}
	function m(e) {
		for (var t = 0; t < e.length; ++t) d(e.charCodeAt(t));
	}
	return m("RIFF"), p(s.byteLength - 8), m("WAVE"), m("fmt "), p(16), f(r ? 3 : 1), f(a), p(n), p(n * a * (i >> 3)), f(a * (i >> 3)), f(i), m("data"), p(s.byteLength - 44), c(i, r)(s, u, e, a, o), new Uint8Array(s);
}
function u(e, { sampleRate: t = 44100, bitDepth: n = 16 }) {
	let r = l(e, {
		channels: e.length,
		sampleRate: t,
		bitDepth: n
	});
	return new Blob([r.buffer], { type: "audio/wav" });
}
//#endregion
//#region src/compute/acoustics/util/normalize.ts
function d(e) {
	let t = Math.abs(e[0]);
	for (let n = 1; n < e.length; n++) Math.abs(e[n]) > t && (t = Math.abs(e[n]));
	if (t !== 0) for (let n = 0; n < e.length; n++) e[n] = e[n] / t;
	return e;
}
//#endregion
//#region src/common/throwif.ts
var f = /* @__PURE__ */ e(t());
function p(e, t) {
	if (!e) throw Error(t);
}
//#endregion
//#region src/audio-engine/audio-engine.ts
var m = window.AudioContext || window.webkitAudioContext, h = window.OfflineAudioContext || window.webkitOfflineAudioContext, g = new class {
	context;
	constructor() {
		this.context = new m();
	}
	createOfflineContext(e, t, n) {
		return new h(e, t, n);
	}
	async renderContextAsync(e) {
		return new Promise((t, n) => {
			e.oncomplete = function(e) {
				e.renderedBuffer ? t(e.renderedBuffer) : n("failed to get renderedBuffer after context completed rendering");
			}, e.startRendering();
		});
	}
	createBufferSource(e, t = this.context) {
		let n = t.createBufferSource();
		return n.buffer = t.createBuffer(1, e.length, this.context.sampleRate), n.buffer.getChannelData(0).set(e, 0), n;
	}
	createBandpassFilter(e, t = 1.414, n = this.context) {
		let r = n.createBiquadFilter();
		return r.type = "bandpass", r.Q.value = t, r.frequency.value = e, r;
	}
	createBiquadFilter(e, t, n = 1.414, r = 1, i = this.context) {
		let a = i.createBiquadFilter();
		return a.type = e, a.Q.value = n, a.frequency.value = t, a.gain.value = r, a;
	}
	createGainNode(e, t = this.context) {
		let n = t.createGain();
		return n.gain.value = e, n;
	}
	createMerger(e, t = this.context) {
		return t.createChannelMerger(e);
	}
	createFilteredSource(e, t, n = 1.414, r = 1, i = this.context) {
		let s = a(1, t), c = o(1, t), l = {
			source: this.createBufferSource(e, i),
			lowpass: this.createBiquadFilter("lowpass", c, n, 1, i),
			highpass: this.createBiquadFilter("highpass", s, n, 1, i),
			gain: this.createGainNode(r, i)
		};
		return l.source.connect(l.lowpass), l.lowpass.connect(l.highpass), l.highpass.connect(l.gain), l;
	}
	createFilteredSources(e, t, n = this.context) {
		p(e.length === t.length, "There should be exactly one frequency for each data buffer.");
		let r = [];
		for (let i = 0; i < t.length; i++) r.push(this.createFilteredSource(e[i], t[i], .707, 1, n));
		return r;
	}
	diracDelta(e = 8192, t = 0) {
		let n = new Float32Array(Array(e).fill(0));
		return n[t] = 1, n;
	}
	async testFilters(e, t = 44100) {
		let n = Array(e.length).fill(0).map((e) => this.diracDelta()), r = this.createOfflineContext(1, n[0].length, t), i = this.createFilteredSources(n, e, r), a = this.createMerger(i.length, r);
		for (let e = 0; e < i.length; e++) i[e].gain.connect(a, 0, e);
		a.connect(r.destination), i.forEach((e) => e.source.start());
		let o = u([d((await this.renderContextAsync(r)).getChannelData(0))], {
			sampleRate: t,
			bitDepth: 32
		});
		(0, f.saveAs)(o, "testFilters.wav");
	}
	get sampleRate() {
		return this.context.sampleRate;
	}
}();
//#endregion
export { i, d as n, u as r, g as t };

//# sourceMappingURL=audio-engine-Cfjjb4lc.mjs.map