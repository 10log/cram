//#region src/compute/schroeder.ts
function e(e) {
	let t = e.length, n = new Float32Array(t), r = 0;
	for (let i = t - 1; i >= 0; i--) r += e[i] * e[i], n[i] = r;
	let i = n[0] || 1, a = new Float32Array(t);
	for (let e = 0; e < t; e++) a[e] = n[e] > 0 ? 10 * Math.log10(n[e] / i) : -Infinity;
	return a;
}
//#endregion
export { e as t };

//# sourceMappingURL=schroeder-BROBh3sk.mjs.map