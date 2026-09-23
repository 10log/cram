//#region src/compute/acoustics/util/allowMultiple.ts
function e(e, t) {
	return t instanceof Array ? t.map((t) => e(t)) : e(t);
}
//#endregion
//#region src/compute/acoustics/std/constants.ts
var t = {
	value: 2e-5,
	units: "Pa"
};
//#endregion
//#region src/compute/acoustics/convert.ts
function n(n) {
	return e((e) => 20 * Math.log10(e / t.value), n);
}
function r(n) {
	return e((e) => 10 ** (e / 20) * t.value, n);
}
function i(t, n = 400) {
	return e((e) => e ** 2 / n, t);
}
function a(t, n = 400) {
	return e((e) => Math.sqrt(e * n), t);
}
//#endregion
export { n as i, r as n, i as r, a as t };

//# sourceMappingURL=convert-GmiMppOk.mjs.map