import { O as e, _ as t, t as n } from "./FileSaver.min-DhK9iPpQ.mjs";
import { n as r, r as i, t as a } from "./audio-engine-CmA_oANp.mjs";
import "./acoustics-DtDxi75Z.mjs";
//#region src/compute/shared/export-playback.ts
var o = /* @__PURE__ */ e(n());
async function s(e, n, r, i) {
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
async function c(e, t, n, s = a.sampleRate) {
	e ||= await t();
	let c = i([r(e.getChannelData(0))], {
		sampleRate: s,
		bitDepth: 32
	}), l = n.endsWith(".wav") ? "" : ".wav";
	return o.default.saveAs(c, n + l), { impulseResponse: e };
}
async function l(e, t, n, r = 1, a) {
	(!e || n !== r) && (n = r, e = await t(r));
	let s = e.numberOfChannels, c = e.sampleRate, l = [];
	for (let t = 0; t < s; t++) l.push(e.getChannelData(t));
	let u = i(l, {
		sampleRate: c,
		bitDepth: 32
	}), d = a.endsWith(".wav") ? "" : ".wav", f = r === 1 ? "FOA" : `HOA${r}`;
	return o.default.saveAs(u, `${a}_${f}${d}`), {
		ambisonicImpulseResponse: e,
		ambisonicOrder: n
	};
}
async function u(e, n, r, i) {
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
async function d(e, t, n) {
	e ||= await t();
	let r = e.sampleRate, a = e.getChannelData(0), s = e.getChannelData(1), c = 0;
	for (let e = 0; e < a.length; e++) Math.abs(a[e]) > c && (c = Math.abs(a[e])), Math.abs(s[e]) > c && (c = Math.abs(s[e]));
	let l = new Float32Array(a.length), u = new Float32Array(s.length);
	if (c > 0) for (let e = 0; e < a.length; e++) l[e] = a[e] / c, u[e] = s[e] / c;
	let d = i([l, u], {
		sampleRate: r,
		bitDepth: 32
	}), f = n.endsWith(".wav") ? "" : ".wav";
	return o.default.saveAs(d, `${n}_binaural${f}`), { binauralImpulseResponse: e };
}
//#endregion
export { s as a, u as i, d as n, c as r, l as t };

//# sourceMappingURL=export-playback-BZxoZ2U1.mjs.map