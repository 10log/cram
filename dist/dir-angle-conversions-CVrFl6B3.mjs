//#region src/common/dir-angle-conversions.ts
function e(e, t) {
	let n = (360 - e) * (Math.PI / 180);
	return [Math.PI / 180 * t, n];
}
function t(e, t, n) {
	let r = Math.sqrt(e * e + t * t + n * n);
	if (r < 1e-10) return [0, 0];
	let i = Math.acos(Math.min(1, Math.max(-1, t / r))), a = Math.atan2(e, n), o = 180 / Math.PI * i;
	return [((360 - 180 / Math.PI * a) % 360 + 360) % 360, o];
}
function n(e, n) {
	if (e.lengthSq() < 1e-20) return [0, 0];
	let r = e.clone().normalize().applyQuaternion(n.clone().invert()), [i, a] = t(r.x, r.y, r.z);
	return [i, a];
}
//#endregion
export { n, e as t };

//# sourceMappingURL=dir-angle-conversions-CVrFl6B3.mjs.map