function e(e) {
	if (!(e > 0)) throw Error(`Impedance must be positive, got ${e}`);
	return Number.isFinite(e) ? 8 / e * (1 + 1 / (1 + e) - 2 / e * Math.log1p(e)) : 0;
}
var t = [], n = [];
(() => {
	for (let e = 1; e <= 48; e++) {
		let r = Math.cos(Math.PI * (e - .25) / 48.5), i = 0;
		for (let e = 0; e < 100; e++) {
			let e = 1, t = r;
			for (let n = 2; n <= 48; n++) {
				let i = ((2 * n - 1) * r * t - (n - 1) * e) / n;
				e = t, t = i;
			}
			i = 48 * (r * t - e) / (r * r - 1);
			let n = t / i;
			if (r -= n, Math.abs(n) < 1e-16) break;
		}
		t.push(r), n.push(2 / ((1 - r * r) * i * i));
	}
})();
function r(e) {
	let r = Math.PI / 4, i = 0;
	for (let a = 0; a < t.length; a++) {
		let o = r * (t[a] + 1), s = Math.cos(o), c = e * s + 1;
		i += n[a] * (4 * e * s / (c * c)) * s;
	}
	return i * r;
}
function i(e) {
	if (!(e > 0)) throw Error(`Impedance must be positive, got ${e}`);
	if (!Number.isFinite(e)) return 0;
	if (Math.abs(e - 1) < .01) return r(e);
	let t, n;
	if (e > 1) {
		let r = Math.sqrt(e * e - 1), i = Math.atanh(Math.sqrt((e - 1) / (e + 1)));
		t = 2 / r * i, n = e / (r * r) - 2 * i / (r * r * r);
	} else {
		let r = Math.sqrt(1 - e * e), i = Math.atan(Math.sqrt((1 - e) / (1 + e)));
		t = 2 / r * i, n = 2 * i / (r * r * r) - e / (r * r);
	}
	return 4 / e * (Math.PI / 2 - 2 * t + n);
}
function a(t, n) {
	return n === 3 ? e(t) : i(t);
}
function o(e) {
	let t = Math.log(.5), n = Math.log(20), r = (Math.sqrt(5) - 1) / 2, i = (t) => -a(Math.exp(t), e), o = n - r * (n - t), s = t + r * (n - t), c = i(o), l = i(s);
	for (let e = 0; e < 200 && n - t > 1e-13; e++) c < l ? (n = s, s = o, l = c, o = n - r * (n - t), c = i(o)) : (t = o, o = s, c = l, s = t + r * (n - t), l = i(s));
	let u = Math.exp((t + n) / 2);
	return {
		xi: u,
		alpha: a(u, e)
	};
}
var s = {
	2: o(2),
	3: o(3)
};
function c(e) {
	return s[e].alpha;
}
function l(e, t) {
	if (!Number.isFinite(e) || e <= 1e-6) return Infinity;
	let { xi: n, alpha: r } = s[t];
	if (e >= r) return n;
	let i = Math.log(n), o = Math.log(0xe8d4a51000);
	for (let n = 0; n < 200 && o - i > 1e-14; n++) {
		let n = (i + o) / 2;
		a(Math.exp(n), t) > e ? i = n : o = n;
	}
	return Math.exp((i + o) / 2);
}
//#endregion
export { c as n, l as t };

//# sourceMappingURL=random-incidence-C2tZkwdg.mjs.map