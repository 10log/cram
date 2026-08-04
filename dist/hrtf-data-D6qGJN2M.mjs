//#region src/compute/binaural/hrtf-data.ts
var e = null, t = /* @__PURE__ */ new Map(), n = `${{}.PUBLIC_URL || ""}/hrtf`;
async function r() {
	if (e) return e.subjects;
	let t = await fetch(`${n}/manifest.json`);
	if (!t.ok) throw Error(`Failed to load HRTF manifest: ${t.status} ${t.statusText}`);
	return e = await t.json(), e.subjects;
}
async function i(e, r) {
	let i = `${e}_order${r}`, o = t.get(i);
	if (o) return o;
	let s = `${n}/filters/${e}_order${r}.bin`, c = await fetch(s);
	if (!c.ok) throw Error(`Failed to load HRTF filters for ${e} order ${r}: ${c.status}`);
	let l = a(await c.arrayBuffer());
	return t.set(i, l), l;
}
function a(e) {
	let t = new DataView(e), n = t.getUint32(0, !0), r = t.getUint32(4, !0), i = t.getUint32(8, !0), a = n * 2 * r * 4;
	if (e.byteLength < 12 + a) throw Error(`Invalid HRTF filter data: expected ${12 + a} bytes, got ${e.byteLength}`);
	let o = [], s = [], c = 12;
	for (let t = 0; t < n; t++) o.push(new Float32Array(e, c, r)), c += r * 4, s.push(new Float32Array(e, c, r)), c += r * 4;
	return {
		sampleRate: i,
		filterLength: r,
		channelCount: n,
		filtersLeft: o,
		filtersRight: s
	};
}
function o(e) {
	return e ? `${n}/${e}` : "";
}
//#endregion
export { o as n, i as r, r as t };

//# sourceMappingURL=hrtf-data-D6qGJN2M.mjs.map