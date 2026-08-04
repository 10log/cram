//#region src/compute/acoustics/air-attenuation.ts
function e(e, t = 20, n = 40, r = 101325) {
	let i = t + 273.15, a = 293.15, o = 101325, s = r || o, c = 10 ** (-6.8346 * (273.16 / i) ** 1.261 + 4.6151) * n * o / s, l = s / o * (a / i) ** .5 * (9 + 280 * c * Math.exp(-4.17 * ((a / i) ** (1 / 3) - 1))), u = s / o * (24 + 40400 * c * (.02 + c) / (.391 + c)), d = [];
	return e.forEach((e) => {
		let t = e ** 2 * (184e-13 / ((a / i) ** .5 * s / o) + (a / i) ** -2.5 * (.1068 * Math.exp(-3352 / i) * l / (e * e + l * l) + .01278 * Math.exp(-2239.1 / i) * u / (e * e + u * u)));
		d.push(20 * t / Math.log(10));
	}), d;
}
//#endregion
export { e as t };

//# sourceMappingURL=air-attenuation-DrZYpv8D.mjs.map