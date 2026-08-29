import { O as e, _ as t, t as n } from "./FileSaver.min-DhK9iPpQ.mjs";
import { n as r, r as i, t as a } from "./audio-engine-CmA_oANp.mjs";
import "./acoustics-DtDxi75Z.mjs";
//#region src/compute/acoustics/geometric-spreading.ts
function o(e) {
	let t = Math.max(e, .001);
	return 1 / (t * t);
}
//#endregion
//#region src/compute/shared/export-playback.ts
var s = /* @__PURE__ */ e(n());
async function c(e, n, r, i) {
	e ||= await n(), a.context.state === "suspended" && a.context.resume(), console.log(e);
	let o = a.context.createBufferSource();
	return o.buffer = e, o.connect(a.context.destination), o.start(), t(i, {
		uuid: r,
		property: "impulseResponsePlaying",
		value: !0
	}), o.onended = () => {
		o.stop(), o.disconnect(a.context.destination), t(i, {
			uuid: r,
			property: "impulseResponsePlaying",
			value: !1
		});
	}, { impulseResponse: e };
}
async function l(e, t, n, o = a.sampleRate) {
	e ||= await t();
	let c = i([r(e.getChannelData(0))], {
		sampleRate: o,
		bitDepth: 32
	}), l = n.endsWith(".wav") ? "" : ".wav";
	return s.default.saveAs(c, n + l), { impulseResponse: e };
}
async function u(e, t, n, r = 1, a) {
	(!e || n !== r) && (n = r, e = await t(r));
	let o = e.numberOfChannels, c = e.sampleRate, l = [];
	for (let t = 0; t < o; t++) l.push(e.getChannelData(t));
	let u = i(l, {
		sampleRate: c,
		bitDepth: 32
	}), d = a.endsWith(".wav") ? "" : ".wav", f = r === 1 ? "FOA" : `HOA${r}`;
	return s.default.saveAs(u, `${a}_${f}${d}`), {
		ambisonicImpulseResponse: e,
		ambisonicOrder: n
	};
}
async function d(e, n, r, i) {
	e ||= await n(), a.context.state === "suspended" && a.context.resume();
	let o = a.context.createBufferSource();
	return o.buffer = e, o.connect(a.context.destination), o.start(), t(i, {
		uuid: r,
		property: "binauralPlaying",
		value: !0
	}), o.onended = () => {
		o.stop(), o.disconnect(a.context.destination), t(i, {
			uuid: r,
			property: "binauralPlaying",
			value: !1
		});
	}, { binauralImpulseResponse: e };
}
async function f(e, t, n) {
	e ||= await t();
	let r = e.sampleRate, a = e.getChannelData(0), o = e.getChannelData(1), c = 0;
	for (let e = 0; e < a.length; e++) Math.abs(a[e]) > c && (c = Math.abs(a[e])), Math.abs(o[e]) > c && (c = Math.abs(o[e]));
	let l = new Float32Array(a.length), u = new Float32Array(o.length);
	if (c > 0) for (let e = 0; e < a.length; e++) l[e] = a[e] / c, u[e] = o[e] / c;
	let d = i([l, u], {
		sampleRate: r,
		bitDepth: 32
	}), f = n.endsWith(".wav") ? "" : ".wav";
	return s.default.saveAs(d, `${n}_binaural${f}`), { binauralImpulseResponse: e };
}
//#endregion
export { c as a, d as i, f as n, o, l as r, u as t };

//# sourceMappingURL=export-playback-CgbEgL1N.mjs.map