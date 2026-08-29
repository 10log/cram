import { a as e, i as t, n, r } from "./TessellateModifier-C1tXMs2g.mjs";
import "./acoustics-DtDxi75Z.mjs";
import { n as i } from "./air-attenuation-BJnoHmX2.mjs";
import { t as a } from "./geometric-spreading-RO5977E6.mjs";
import * as o from "three";
//#region src/common/dir-angle-conversions.ts
function s(e, t, n) {
	let r = Math.sqrt(e * e + t * t + n * n);
	if (r < 1e-10) return [0, 0];
	let i = Math.acos(Math.min(1, Math.max(-1, t / r))), a = Math.atan2(e, n), o = 180 / Math.PI * i;
	return [((360 - 180 / Math.PI * a) % 360 + 360) % 360, o];
}
function c(e, t) {
	if (e.lengthSq() < 1e-20) return [0, 0];
	let n = e.clone().normalize().applyQuaternion(t.clone().invert()), [r, i] = s(n.x, n.y, n.z);
	return [r, i];
}
//#endregion
//#region src/compute/beam-trace/arrival-pressure.ts
function l(e, t, n, r, i) {
	let a = Array(i.length).fill(1);
	if (r.lengthSq() < 1e-20) return a;
	let [o, s] = c(r, n);
	for (let n = 0; n < i.length; n++) try {
		let r = e.getPressureAtPosition(0, i[n], o, s), c = t[n];
		typeof r == "number" && typeof c == "number" && c > 0 && (a[n] = (r / c) ** 2);
	} catch {}
	return a;
}
function u(s, c, u) {
	let { frequencies: d, temperature: f, receiverGain: p = 1, source: m = null, polygonToSurface: h } = u;
	if (c.bandEnergy) {
		let e = t(r(s)), i = c.points.length - 1, o = i >= 1 ? c.points[i].distanceTo(c.points[i - 1]) : c.length, l = a(o), u = Array(d.length);
		for (let t = 0; t < d.length; t++) {
			let r = e[t] * c.bandEnergy[t] * l;
			u[t] = n([r])[0] * p;
		}
		return u;
	}
	let g = a(c.length), _ = t(r(s));
	for (let e = 0; e < _.length; e++) _[e] *= g;
	let v = c.points.length - 1;
	if (v >= 1 && m?.directivityHandler) {
		let e = c.points[v], t = c.points[v - 1], n = new o.Vector3().subVectors(t, e), r = Array(d.length);
		for (let e = 0; e < d.length; e++) r[e] = m.directivityHandler.getPressureAtPosition(0, d[e], 0, 0);
		let i = l(m.directivityHandler, r, m.quaternion, n, d);
		for (let e = 0; e < d.length; e++) _[e] *= i[e];
	}
	let y = 0;
	c.polygonIds.forEach((e, t) => {
		if (e === null) return;
		let n = h?.get(e);
		if (!n) {
			y++;
			return;
		}
		let r = 0;
		if (c.reflections && y < c.reflections.length) r = c.reflections[y].incidenceAngle;
		else if (t > 0 && t < c.points.length - 1) {
			let e = new o.Vector3().subVectors(c.points[t + 1], c.points[t]).normalize(), n = new o.Vector3().subVectors(c.points[t - 1], c.points[t]).normalize(), i = Math.min(1, Math.max(-1, e.dot(n)));
			r = Math.acos(i) / 2;
		}
		y++;
		for (let e = 0; e < d.length; e++) {
			let t = Math.abs(n.reflectionFunction(d[e], r));
			_[e] *= t;
		}
	});
	let b = e(n(_)), x = i(d, f);
	for (let e = 0; e < d.length; e++) b[e] -= x[e] * c.length;
	let S = r(b);
	if (p !== 1) for (let e = 0; e < S.length; e++) S[e] *= p;
	return S;
}
//#endregion
export { l as n, u as t };

//# sourceMappingURL=arrival-pressure-Da2OR1wk.mjs.map