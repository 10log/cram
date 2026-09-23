//#region src/compute/acoustics/reflection-coefficient.ts
function e(e) {
	let n = t(e);
	return n >= 1 ? Infinity : (1 + n) / (1 - n);
}
function t(e) {
	return Math.sqrt(1 - (Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0));
}
function n(e, n) {
	let r = t(e), i = Math.abs(Math.cos(n)), a = (1 + r) * i - (1 - r), o = (1 + r) * i + (1 - r);
	return o === 0 ? 1 : a / o;
}
function r(e, t) {
	let r = n(e, t);
	return r * r;
}
//#endregion
export { n, r, e as t };

//# sourceMappingURL=reflection-coefficient-DOfZqTBY.mjs.map