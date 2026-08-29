import "./acoustics-SIlOec_Y.mjs";
import { a as e, i as t, n, r } from "./TessellateModifier-C1tXMs2g.mjs";
import { n as i } from "./air-attenuation-BJnoHmX2.mjs";
import { t as a } from "./geometric-spreading-RO5977E6.mjs";
import { n as o } from "./dir-angle-conversions-CVrFl6B3.mjs";
import * as s from "three";
//#region src/compute/beam-trace/arrival-pressure.ts
function c(e, t, n, r, i) {
	let a = Array(i.length).fill(1);
	if (r.lengthSq() < 1e-20) return a;
	let [s, c] = o(r, n);
	for (let n = 0; n < i.length; n++) try {
		let r = e.getPressureAtPosition(0, i[n], s, c), o = t[n];
		typeof r == "number" && typeof o == "number" && o > 0 && (a[n] = (r / o) ** 2);
	} catch {}
	return a;
}
function l(o, l, u) {
	let { frequencies: d, temperature: f, receiverGain: p = 1, source: m = null, polygonToSurface: h } = u;
	if (l.bandEnergy) {
		let e = t(r(o)), i = l.points.length - 1, s = i >= 1 ? l.points[i].distanceTo(l.points[i - 1]) : l.length, c = a(s), u = Array(d.length);
		for (let t = 0; t < d.length; t++) {
			let r = e[t] * l.bandEnergy[t] * c;
			u[t] = n([r])[0] * p;
		}
		return u;
	}
	let g = a(l.length), _ = t(r(o));
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
			let t = Math.abs(n.reflectionFunction(d[e], r));
			_[e] *= t;
		}
	});
	let b = e(n(_)), x = i(d, f);
	for (let e = 0; e < d.length; e++) b[e] -= x[e] * l.length;
	let S = r(b);
	if (p !== 1) for (let e = 0; e < S.length; e++) S[e] *= p;
	return S;
}
//#endregion
export { c as n, l as t };

//# sourceMappingURL=arrival-pressure-DNCFL7pm.mjs.map