import { n as e } from "./dir-angle-conversions-LXTMJ8Lq.mjs";
import { i as t, n, r, t as i } from "./convert-BWB5KhF2.mjs";
import { r as a } from "./air-attenuation-BBmC2Nj9.mjs";
import { t as o } from "./geometric-spreading-DTzP8xvT.mjs";
import "./acoustics-Cs_0VALc.mjs";
import * as s from "three";
// src/compute/beam-trace/arrival-pressure.ts
function c(t, n, r, i, a) {
	let o = Array(a.length).fill(1);
	if (i.lengthSq() < 1e-20) return o;
	let [s, c] = e(i, r);
	for (let e = 0; e < a.length; e++) try {
		let r = t.getPressureAtPosition(0, a[e], s, c), i = n[e];
		typeof r == "number" && typeof i == "number" && i > 0 && (o[e] = (r / i) ** 2);
	} catch {}
	return o;
}
function l(e, l, u) {
	let { frequencies: d, temperature: f, receiverGain: p = 1, source: m = null, polygonToSurface: h } = u;
	if (l.bandEnergy) {
		let t = r(n(e)), a = l.points.length - 1, s = a >= 1 ? l.points[a].distanceTo(l.points[a - 1]) : l.length, c = o(s), u = Array(d.length);
		for (let e = 0; e < d.length; e++) {
			let n = t[e] * l.bandEnergy[e] * c;
			u[e] = i([n])[0] * p;
		}
		return u;
	}
	let g = o(l.length), _ = r(n(e));
	for (let e = 0; e < _.length; e++) _[e] *= g;
	let v = l.points.length - 1;
	if (v >= 1 && m?.directivityHandler) {
		let e = l.points[v], t = l.points[v - 1], n = new s.Vector3().subVectors(t, e), r = Array(d.length);
		for (let e = 0; e < d.length; e++) r[e] = m.directivityHandler.getPressureAtPosition(0, d[e], 0, 0);
		let i = c(m.directivityHandler, r, m.quaternion, n, d);
		for (let e = 0; e < d.length; e++) _[e] *= i[e];
	}
	let y = 0;
	l.polygonIds.forEach((e, t) => {
		if (e === null) return;
		let n = h?.get(e);
		if (!n) {
			y++;
			return;
		}
		let r = 0;
		if (l.reflections && y < l.reflections.length) r = l.reflections[y].incidenceAngle;
		else if (t > 0 && t < l.points.length - 1) {
			let e = new s.Vector3().subVectors(l.points[t + 1], l.points[t]).normalize(), n = new s.Vector3().subVectors(l.points[t - 1], l.points[t]).normalize(), i = Math.min(1, Math.max(-1, e.dot(n)));
			r = Math.acos(i) / 2;
		}
		y++;
		for (let e = 0; e < d.length; e++) {
			let t = n.reflectionFunction(d[e], r);
			_[e] *= t;
		}
	});
	let b = t(i(_)), x = a(d, f);
	for (let e = 0; e < d.length; e++) b[e] -= x[e] * l.length;
	let S = n(b);
	if (p !== 1) for (let e = 0; e < S.length; e++) S[e] *= p;
	return S;
}
export { c as n, l as t };

//# sourceMappingURL=arrival-pressure-C8HqwvFl.mjs.map