//#region src/compute/acoustics/std/bands.ts
var e = [
	6.3,
	8,
	10,
	12.5,
	16,
	20,
	25,
	31.5,
	40,
	50,
	63,
	80,
	100,
	125,
	160,
	200,
	250,
	315,
	400,
	500,
	630,
	800,
	1e3,
	1250,
	1600,
	2e3,
	2500,
	3150,
	4e3,
	5e3,
	6300,
	8e3,
	1e4,
	12500,
	16e3,
	2e4
], t = [
	8,
	16,
	31.5,
	63,
	125,
	250,
	500,
	1e3,
	2e3,
	4e3,
	8e3,
	16e3
], n = [
	{
		Lower: 11,
		Center: 16,
		Upper: 22
	},
	{
		Lower: 22,
		Center: 31.5,
		Upper: 44
	},
	{
		Lower: 44,
		Center: 63,
		Upper: 88
	},
	{
		Lower: 88,
		Center: 125,
		Upper: 177
	},
	{
		Lower: 177,
		Center: 250,
		Upper: 355
	},
	{
		Lower: 355,
		Center: 500,
		Upper: 710
	},
	{
		Lower: 710,
		Center: 1e3,
		Upper: 1420
	},
	{
		Lower: 1420,
		Center: 2e3,
		Upper: 2840
	},
	{
		Lower: 2840,
		Center: 4e3,
		Upper: 5680
	},
	{
		Lower: 5680,
		Center: 8e3,
		Upper: 11360
	},
	{
		Lower: 11360,
		Center: 16e3,
		Upper: 22720
	}
], r = (e, t, n) => {
	let r = [e];
	for (let i = 0; i < Math.floor((n - e) / t); i++) r.push(r[i] + t);
	return r;
}, { PI: i, tanh: a } = Math;
r(100, 50, 1e4);
//#endregion
export { t as n, n as r, e as t };

//# sourceMappingURL=acoustics-SIlOec_Y.mjs.map