//#region src/constants/editor-modes.ts
var e = /* @__PURE__ */ function(e) {
	return e.OBJECT = "OBJECT", e.SKETCH = "SKETCH", e.EDIT = "EDIT", e;
}({});
function t(e) {
	return 1 / e;
}
function n(e) {
	if (!e.recording) return Math.max(1, Math.round(e.displayPasses) || 1);
	if (!(e.wallDt > 0) || !(e.dt > 0)) return 1;
	let t = e.cap ?? 2048;
	return Math.max(1, Math.min(t, Math.round(e.wallDt / e.dt)));
}
function r(e, t) {
	return (t && t > 0 ? `# sampleRate=${t}\n` : "") + e.join("\n");
}
function i(e, t) {
	let n = e.length, r = n * 2, i = new ArrayBuffer(44 + r), a = new DataView(i), o = (e, t) => {
		for (let n = 0; n < t.length; n++) a.setUint8(e + n, t.charCodeAt(n));
	};
	o(0, "RIFF"), a.setUint32(4, 36 + r, !0), o(8, "WAVE"), o(12, "fmt "), a.setUint32(16, 16, !0), a.setUint16(20, 1, !0), a.setUint16(22, 1, !0), a.setUint32(24, t, !0), a.setUint32(28, t * 2, !0), a.setUint16(32, 2, !0), a.setUint16(34, 16, !0), o(36, "data"), a.setUint32(40, r, !0);
	let s = 44;
	for (let t = 0; t < n; t++) {
		let n = Math.max(-1, Math.min(1, e[t]));
		a.setInt16(s, Math.round(n * 32767), !0), s += 2;
	}
	return i;
}
function a(e, t, n = 10) {
	if (!(t > 0)) throw Error(`Sample rate must be positive, got ${t}`);
	if (!(n > 0) || n >= t / 2) throw Error(`Cutoff must be in (0, ${t / 2}) Hz, got ${n}`);
	let r = 2 * t, i = r * Math.tan(Math.PI * n / t), a = Math.SQRT2 * i, o = i * i, s = r * r + a * r + o, c = r * r / s, l = (2 * o - 2 * r * r) / s, u = (r * r - a * r + o) / s, d = Array(e.length), f = 0, p = 0, m = 0;
	for (let t = 0; t < e.length; t++) {
		let n = e[t], r = c * (n - f) - l * p - u * m;
		d[t] = r, f = n, m = p, p = r;
	}
	return d;
}
//#endregion
export { t as a, n as i, r as n, e as o, a as r, i as t };

//# sourceMappingURL=recording-D6qgIUE6.mjs.map