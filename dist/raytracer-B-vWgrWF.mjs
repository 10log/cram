import { a as e, b as t, c as n, k as r, n as i, r as a, s as o, t as s, v as c, y as l } from "./FileSaver.min-BS9rdHrk.mjs";
import { t as u } from "./renderer-Cj8dxF6d.mjs";
import { a as d, g as f, i as p } from "./store-CUhn0IQy.mjs";
import { i as m, n as h, r as g, t as _ } from "./audio-engine-Cfjjb4lc.mjs";
import "./acoustics-SIlOec_Y.mjs";
import { a as v, i as y, n as b, r as x } from "./TessellateModifier-C1tXMs2g.mjs";
import { _ as S, c as C, d as w, f as T, g as E, h as ee, l as D, m as te, n as O, o as k, p as A, r as ne, s as re, t as ie, u as j, v as ae, y as oe } from "./diffraction-CtLn0to_.mjs";
import { n as M } from "./air-attenuation-BJnoHmX2.mjs";
import { t as se } from "./sound-speed-CfEkirc1.mjs";
import { r as ce } from "./room-Be5invjN.mjs";
import { n as le, t as ue } from "./gpu-context-BQmqThE1.mjs";
import { t as de } from "./solver-DCp-VMaM.mjs";
import { a as fe, i as pe, n as me, r as he, t as ge } from "./export-playback-DJ-xd6_v.mjs";
import { n as _e, t as N } from "./dir-angle-conversions-CVrFl6B3.mjs";
import { t as ve } from "./image-source-LJhck_5K.mjs";
import * as P from "three";
import { acceleratedRaycast as ye, computeBoundsTree as be, disposeBoundsTree as xe } from "three-mesh-bvh";
//#endregion
//#region src/compute/raytracer/shaders/points/index.ts
var F = {
	vs: "attribute vec2 color;\nvarying vec2 vColor;\nuniform float pointScale;\nvoid main() {\n  vColor = color;\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  gl_PointSize = pointScale*(color.x/4.0+0.5);\n  gl_Position = projectionMatrix * mvPosition;\n  \n}",
	fs: "varying vec2 vColor;\nuniform float drawStyle;\nuniform int inverted;\nvec3 hsl2rgb(vec3 c)\n{\n    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );\n\n    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));\n}\n\nvec3 rgb2hsl( vec3 c ){\n  float h = 0.0;\n	float s = 0.0;\n	float l = 0.0;\n	float r = c.r;\n	float g = c.g;\n	float b = c.b;\n	float cMin = min( r, min( g, b ) );\n	float cMax = max( r, max( g, b ) );\n\n	l = ( cMax + cMin ) / 2.0;\n	if ( cMax > cMin ) {\n		float cDelta = cMax - cMin;\n        \n        //s = l < .05 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) ); Original\n		s = l < .0 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) );\n        \n		if ( r == cMax ) {\n			h = ( g - b ) / cDelta;\n		} else if ( g == cMax ) {\n			h = 2.0 + ( b - r ) / cDelta;\n		} else {\n			h = 4.0 + ( r - g ) / cDelta;\n		}\n\n		if ( h < 0.0) {\n			h += 6.0;\n		}\n		h = h / 6.0;\n	}\n	return vec3( h, s, l );\n}\n\nvoid main() {\n  vec3 color = vec3(0.0);\n	float alpha = vColor.x;\n  if(drawStyle == 0.0){\n    vec3 col = hsl2rgb(vec3(vColor.x/10.0,0.8, vColor.x));\n    color = col;\n		alpha = vColor.x;\n  }\n  else if(drawStyle == 1.0){\n    vec3 col = hsl2rgb(vec3(vColor.y,vColor.x,vColor.y));\n    vec3 col2 = vec3(vColor.x,vColor.x,1.0-vColor.y);\n    color = col*col2;\n		alpha = vColor.x;\n  }\n	if(inverted != 0){\n		color = vec3(1.0) - color;\n	}\n  gl_FragColor = vec4(color, alpha);\n  \n}"
}, Se = class {
	v;
	constructor(e) {
		this.v = e;
	}
	watchers = /* @__PURE__ */ new Set();
	get value() {
		return this.v;
	}
	set value(e) {
		let t = this.v;
		this.v = e, this.watchers.forEach((e) => e(this.v, t));
	}
	watch(e) {
		return this.watchers.add(e), () => this.watchers.delete(e);
	}
	toJSON() {
		return JSON.stringify(this.v);
	}
	toString() {
		return String(this.v);
	}
}, Ce = (e) => e instanceof Array ? e : [e];
function we(e, t) {
	let n = new Se(e);
	return t && Ce(t).forEach((e) => n.watch(e)), n;
}
//#endregion
//#region src/compute/raytracer/types.ts
var Te = .01, I = .05, Ee = 2e3, L = {
	name: "Ray Tracer",
	roomID: "",
	sourceIDs: [],
	surfaceIDs: [],
	receiverIDs: [],
	updateInterval: 5,
	reflectionOrder: 50,
	isRunning: !1,
	runningWithoutReceivers: !1,
	passes: 100,
	pointSize: 2,
	raysVisible: !0,
	pointsVisible: !0,
	invertedDrawStyle: !1,
	paths: {},
	plotStyle: { mode: "lines" },
	frequencies: [
		125,
		250,
		500,
		1e3,
		2e3,
		4e3,
		8e3
	],
	convergenceThreshold: .01,
	autoStop: !0,
	rrThreshold: .1,
	maxStoredPaths: 1e5,
	edgeDiffractionEnabled: !1,
	lateReverbTailEnabled: !1,
	tailCrossfadeTime: 0,
	tailCrossfadeDuration: .05,
	gpuEnabled: !1,
	gpuBatchSize: 1e4
}, De = /* @__PURE__ */ function(e) {
	return e[e.ENERGY = 0] = "ENERGY", e[e.ANGLE = 1] = "ANGLE", e[e.ANGLE_ENERGY = 2] = "ANGLE_ENERGY", e;
}({});
function R(e) {
	let t = Math.abs(e[0]);
	for (let n = 1; n < e.length; n++) Math.abs(e[n]) > t && (t = Math.abs(e[n]));
	if (t !== 0) for (let n = 0; n < e.length; n++) e[n] /= t;
	return e;
}
//#endregion
//#region src/common/probability.ts
function Oe(e) {
	return Math.random() < e;
}
//#endregion
//#region src/compute/raytracer/world-normal.ts
function ke(e, t) {
	return e.normal && e.normal.lengthSq() > 0 ? t.copy(e.normal).normalize() : e.face ? (t.copy(e.face.normal), e.object?.matrixWorld && t.transformDirection(e.object.matrixWorld), t.normalize()) : null;
}
function Ae(e, t, n) {
	return n.copy(e).addScaledVector(t, -2 * e.dot(t));
}
//#endregion
//#region src/compute/raytracer/ray-core.ts
var { abs: je } = Math, Me = new P.Vector3(), Ne = new P.Vector3();
new P.Vector3();
var Pe = new P.Vector3(), z = new P.Vector3(), Fe = new P.Vector3(), B = new P.Vector3(), V = new P.Plane(), H = new P.Vector4(), Ie = new P.Vector4(), Le = new P.Vector4(), Re = new P.Vector4();
function ze(e, t) {
	return e.getPlane(V), H.set(V.normal.x, V.normal.y, V.normal.z, V.constant), Ie.set(t.a.x, t.a.y, t.a.z, 1), Le.set(t.b.x, t.b.y, t.b.z, 1), Re.set(t.c.x, t.c.y, t.c.z, 1), H.dot(Ie) > 0 || H.dot(Le) > 0 || H.dot(Re) > 0;
}
function Be(e, t, n, r, i, a, o, s, c, l, u, d, f = 1, p = []) {
	o = o.normalize(), e.ray.origin = a, e.ray.direction = o;
	let m = e.intersectObjects(t, !0);
	if (m.length > 0) {
		let a = c.reduce((e, t) => e + t, 0), h = c.length > 0 ? a / c.length : 0;
		if (m[0].object.userData?.kind === "receiver") {
			let e = ke(m[0], Ne), t = e && Me.copy(o).multiplyScalar(-1).angleTo(e), n = m[0].distance, i = c.map((e, t) => e * 10 ** (-r[t] * n / 10)), a = i.reduce((e, t) => e + t, 0), s = i.length > 0 ? a / i.length : 0;
			p.push({
				object: m[0].object.parent.uuid,
				angle: t,
				distance: m[0].distance,
				faceNormal: e ? [
					e.x,
					e.y,
					e.z
				] : [
					m[0].face.normal.x,
					m[0].face.normal.y,
					m[0].face.normal.z
				],
				faceMaterialIndex: m[0].face.materialIndex,
				faceIndex: m[0].faceIndex,
				point: [
					m[0].point.x,
					m[0].point.y,
					m[0].point.z
				],
				energy: s,
				bandEnergy: [...i]
			}), B.copy(o).normalize().negate();
			let f = [
				B.x,
				B.y,
				B.z
			];
			return {
				chain: p,
				chainLength: p.length,
				intersectedReceiver: !0,
				energy: s,
				bandEnergy: [...i],
				source: l,
				initialPhi: u,
				initialTheta: d,
				arrivalDirection: f
			};
		}
		{
			let a = ke(m[0], Ne), g = a && Me.copy(o).multiplyScalar(-1).angleTo(a);
			p.push({
				object: m[0].object.parent.uuid,
				angle: g,
				distance: m[0].distance,
				faceNormal: a ? [
					a.x,
					a.y,
					a.z
				] : [
					0,
					0,
					0
				],
				faceMaterialIndex: m[0].face.materialIndex,
				faceIndex: m[0].faceIndex,
				point: [
					m[0].point.x,
					m[0].point.y,
					m[0].point.z
				],
				energy: h
			}), m[0].object.parent instanceof ce && (m[0].object.parent.numHits += 1);
			let _ = a, v = _ && Ae(o, _, Pe), y = m[0].object.parent, b = n.map((e) => y.scatteringFunction(e)), x = c.reduce((e, t) => e + t, 0) || 1, S = 0;
			for (let e = 0; e < n.length; e++) S += b[e] * (c[e] || 0);
			if (S /= x, Oe(S)) {
				do
					z.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
				while (z.lengthSq() > 1 || z.lengthSq() < 1e-6);
				z.normalize(), v = Pe.copy(z).add(_).normalize();
			}
			let C = m[0].distance, w = n.map((e, t) => {
				let n = c[t];
				if (n == null) return 0;
				let i = n * je(y.reflectionFunction(e, g));
				return i *= 10 ** (-r[t] * C / 10), i;
			}), T = Math.max(...w);
			if (v && _ && f < s + 1) {
				if (T < i && T > 0) {
					let e = T / i;
					if (Math.random() > e) {
						let e = w.reduce((e, t) => e + t, 0), t = w.length > 0 ? e / w.length : 0;
						return {
							chain: p,
							chainLength: p.length,
							source: l,
							intersectedReceiver: !1,
							energy: t,
							bandEnergy: [...w]
						};
					}
					for (let t = 0; t < w.length; t++) w[t] /= e;
				}
				if (T > 0) return Be(e, t, n, r, i, Fe.copy(m[0].point).addScaledVector(_, Te), v, s, w, l, u, d, f + 1, p);
			}
		}
		return {
			chain: p,
			chainLength: p.length,
			source: l,
			intersectedReceiver: !1
		};
	}
}
//#endregion
//#region src/compute/raytracer/impulse-response.ts
var { floor: U, abs: Ve, max: He } = Math, Ue = () => Math.random() > .5, We = () => new Worker(new URL(
	/* @vite-ignore */
	"/assets/filter.worker-B2fYKvk6.js",
	"" + import.meta.url
));
function W(e, t, n, r = 1, i = 20) {
	let a = y(x(e));
	if (n.bandEnergy && n.bandEnergy.length === t.length) {
		for (let e = 0; e < t.length; e++) a[e] *= n.bandEnergy[e];
		let e = x(v(b(a)));
		if (r !== 1) for (let t = 0; t < e.length; t++) e[t] *= r;
		return e;
	}
	n.chain.slice(0, -1).forEach((e) => {
		let n = f.getState().containers[e.object];
		a.forEach((r, i) => {
			let o = Ve(n.reflectionFunction(t[i], e.angle));
			a[i] = r * o;
		});
	});
	let o = v(b(a)), s = M(t, i);
	t.forEach((e, t) => o[t] -= s[t] * n.totalLength);
	let c = x(o);
	if (r !== 1) for (let e = 0; e < c.length; e++) c[e] *= r;
	return c;
}
async function Ge(e, t, n, r = 100, i, a, o = _.sampleRate, s) {
	if (n.length === 0) throw Error("No rays have been traced for this pair");
	let c = n.sort((e, t) => e.time - t.time), l = c[c.length - 1].time + I, u = Array(i.length).fill(r), d = U(o * l) * 2, p = [];
	for (let e = 0; e < i.length; e++) p.push(new Float32Array(d));
	let m = f.getState().containers[t];
	for (let e = 0; e < c.length; e++) {
		let t = Ue() ? 1 : -1, n = c[e].time, r = c[e].arrivalDirection || [
			0,
			0,
			1
		], s = m.getGain(r), l = W(u, i, c[e], s, a).map((e) => e * t), d = U(n * o);
		for (let e = 0; e < i.length; e++) p[e][d] += l[e];
	}
	if (s && s.energyHistogram && s.energyHistogram.length > 0) {
		let e = D(s.energyHistogram, s.frequencies, s.crossfadeTime, s.histogramBinWidth), { tailSamples: t, tailStartSample: n } = j(e, o), r = U(s.crossfadeDuration * o);
		p = C(p, t, n, r);
		let a = p.reduce((e, t) => He(e, t.length), 0) * 2;
		for (let e = 0; e < i.length; e++) if (p[e].length < a) {
			let t = new Float32Array(a);
			t.set(p[e]), p[e] = t;
		}
	}
	let h = We();
	return new Promise((e, t) => {
		h.postMessage({ samples: p }), h.onmessage = (t) => {
			let n = t.data.samples, r = new Float32Array(n[0].length >> 1);
			for (let e = 0; e < n.length; e++) for (let t = 0; t < r.length; t++) r[t] += n[e][t];
			let i = R(r.slice());
			h.terminate(), e({
				signal: r,
				normalizedSignal: i
			});
		}, h.onerror = (e) => {
			h.terminate(), t(e);
		};
	});
}
async function Ke(e, t, n, r = 100, i, a, o = _.sampleRate, s, c) {
	if (e.length == 0) throw Error("No receivers have been assigned to the raytracer");
	if (t.length == 0) throw Error("No sources have been assigned to the raytracer");
	let l = c ?? e[0];
	if (!n[l] || n[l].length == 0) throw Error("No rays have been traced yet");
	let u = n[l].slice().sort((e, t) => e.time - t.time), d = u[u.length - 1].time + I, p = Array(i.length).fill(r), m = U(o * d) * 2, h = [];
	for (let e = 0; e < i.length; e++) h.push(new Float32Array(m));
	let g = f.getState().containers[l];
	for (let e = 0; e < u.length; e++) {
		let t = Ue() ? 1 : -1, n = u[e].time, r = u[e].arrivalDirection || [
			0,
			0,
			1
		], s = g.getGain(r), c = W(p, i, u[e], s, a).map((e) => e * t), l = U(n * o);
		for (let e = 0; e < i.length; e++) h[e][l] += c[e];
	}
	if (s && s.energyHistogram && s.energyHistogram.length > 0) {
		let e = D(s.energyHistogram, s.frequencies, s.crossfadeTime, s.histogramBinWidth), { tailSamples: t, tailStartSample: n } = j(e, o), r = U(s.crossfadeDuration * o);
		h = C(h, t, n, r);
		let a = h.reduce((e, t) => He(e, t.length), 0) * 2;
		for (let e = 0; e < i.length; e++) if (h[e].length < a) {
			let t = new Float32Array(a);
			t.set(h[e]), h[e] = t;
		}
	}
	let v = We();
	return new Promise((e, t) => {
		v.postMessage({ samples: h }), v.onmessage = (t) => {
			let n = t.data.samples, r = new Float32Array(n[0].length >> 1);
			for (let e = 0; e < n.length; e++) for (let t = 0; t < r.length; t++) r[t] += n[e][t];
			let i = R(r.slice());
			v.terminate(), e({
				signal: r,
				normalizedSignal: i
			});
		}, v.onerror = (e) => {
			v.terminate(), t(e);
		};
	});
}
//#endregion
//#region src/compute/raytracer/hybrid-ir.ts
function qe(e) {
	return e.chainLength - 1;
}
function Je(e, t) {
	return e.filter((e) => qe(e) > t).slice().sort((e, t) => e.time - t.time);
}
function Ye(e, t) {
	return e.filter((e) => e.order <= t);
}
//#endregion
//#region src/compute/raytracer/path-timing.ts
function Xe(e, t) {
	let n = 0, r = 0, i = t > 0 ? t : 343;
	for (let t of e.chain) n += t.distance, r += t.distance / i;
	return e.totalLength = n, e.time = r, e;
}
function G(e, t, n) {
	let r = n ?? e[0];
	if (!r) throw Error("No receivers have been assigned to the raytracer");
	if (!t[r] || t[r].length === 0) throw Error("No rays have been traced yet");
	return r;
}
//#endregion
//#region src/compute/raytracer/response-by-intensity.ts
var { abs: Ze } = Math;
function K(e, t, n) {
	let r = t.chain.slice(0, -1);
	if (r && r.length > 0) {
		let t = 1;
		for (let i = 0; i < r.length; i++) {
			let a = r[i], o = e.surfaceMap[a.object], s = a.angle || 0;
			t *= Ze(o.reflectionFunction(n, s));
		}
		return t;
	}
	return 1;
}
function Qe(e, t, n, r) {
	let i = [], a = (e, t) => ({
		label: e,
		data: t
	}), o = [];
	if (r) for (let e = 0; e < r.length; e++) o.push(a(r[e].toString(), []));
	let s = Object.keys(e);
	for (let n = 0; n < s.length; n++) {
		i.push({
			id: s[n],
			data: []
		});
		for (let a = 0; a < e[s[n]].length; a++) {
			let c = e[s[n]][a], l;
			r ? (l = r.map((e) => ({
				frequency: e,
				value: K(t, c, e)
			})), r.forEach((e, n) => {
				o[n].data.push([c.time, K(t, c, e)]);
			})) : l = (e) => K(t, c, e), i[i.length - 1].data.push({
				time: c.time,
				energy: l
			});
		}
		i[i.length - 1].data = i[i.length - 1].data.sort((e, t) => e.time - t.time);
	}
	for (let e = 0; e < o.length; e++) o[e].data = o[e].data.sort((e, t) => e[0] - t[0]), o[e].x = o[e].data.map((e) => e[0]), o[e].y = o[e].data.map((e) => e[1]);
	return [i, o];
}
function $e(e, t, n, r, i, a) {
	let o = e, s = se(i), c = M(r, i), l = {};
	for (let e in o) {
		l[e] = {};
		let t = f.getState().containers[e];
		for (let n in o[e]) {
			l[e][n] = {
				freqs: r,
				response: []
			};
			for (let i = 0; i < o[e][n].length; i++) {
				let a = 0, u = [], d = o[e][n][i].initialPhi, p = o[e][n][i].initialTheta, m = f.getState().containers[n].directivityHandler;
				for (let e = 0; e < r.length; e++) u[e] = y(m.getPressureAtPosition(0, r[e], d, p));
				let h = o[e][n][i].arrivalDirection || [
					0,
					0,
					1
				], g = t.getGain(h), _ = g * g;
				if (_ !== 1) for (let e = 0; e < r.length; e++) u[e] *= _;
				for (let t = 0; t < o[e][n][i].chain.length; t++) {
					let { angle: l, distance: d } = o[e][n][i].chain[t];
					a += d / s;
					let p = o[e][n][i].chain[t].object, m = f.getState().containers[p] || null;
					for (let e = 0; e < r.length; e++) {
						let t = r[e], n = 1;
						m && m.kind === "surface" && (n = m.reflectionFunction(t, l)), u[e] = y(x(v(b(u[e] * n)) - c[e] * d));
					}
				}
				let S = v(b(u));
				l[e][n].response.push({
					time: a,
					level: S,
					bounces: o[e][n][i].chain.length
				});
			}
			l[e][n].response.sort((e, t) => e.time - t.time);
		}
	}
	return E(l, a);
}
//#endregion
//#region src/compute/raytracer/serialization.ts
var et = -2;
function tt(e) {
	let t = (e) => String.fromCharCode(...e), n = (e) => {
		let n = 0;
		return {
			object: t(e.slice(n, n += 36)),
			angle: e[n++],
			distance: e[n++],
			energy: e[n++],
			faceIndex: e[n++],
			faceMaterialIndex: e[n++],
			faceNormal: [
				e[n++],
				e[n++],
				e[n++]
			],
			point: [
				e[n++],
				e[n++],
				e[n++]
			]
		};
	}, r = (e) => {
		let r = [], i = 0;
		for (; i < e.length;) {
			let a = t(e.slice(i, i += 36)), o = e[i++], s = e[i++], c = !!e[i++], l = e[i++], u = [];
			for (let t = 0; t < o; t++) u.push(n(e.slice(i, i += 47)));
			r.push({
				source: a,
				chainLength: o,
				time: s,
				intersectedReceiver: c,
				energy: l,
				chain: u
			});
		}
		return r;
	}, i = 0, a = {};
	for (; i < e.length;) {
		let n = t(e.slice(i, i += 36)), o = e[i++];
		a[n] = r(e.slice(i, i += o));
	}
	return a;
}
function nt(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of Object.keys(e)) {
		t.add(n);
		for (let r of e[n]) {
			t.add(r.source);
			for (let e of r.chain) t.add(e.object);
		}
	}
	let n = Array.from(t), r = /* @__PURE__ */ new Map();
	for (let e = 0; e < n.length; e++) r.set(n[e], e);
	let i = 2 + n.length * 36, a = 0;
	for (let t of Object.keys(e)) {
		a += 2;
		for (let n of e[t]) a += 5, a += n.chain.length * 12;
	}
	let o = new Float32Array(i + a), s = 0;
	o[s++] = et, o[s++] = n.length;
	for (let e of n) for (let t = 0; t < 36; t++) o[s++] = e.charCodeAt(t);
	for (let t of Object.keys(e)) {
		o[s++] = r.get(t);
		let n = 0;
		for (let r of e[t]) n += 5 + r.chain.length * 12;
		o[s++] = n;
		for (let n of e[t]) {
			o[s++] = r.get(n.source), o[s++] = n.chain.length, o[s++] = n.time, o[s++] = Number(n.intersectedReceiver), o[s++] = n.energy;
			for (let e of n.chain) o[s++] = r.get(e.object), o[s++] = e.angle, o[s++] = e.distance, o[s++] = e.energy, o[s++] = e.faceIndex, o[s++] = e.faceMaterialIndex, o[s++] = e.faceNormal[0], o[s++] = e.faceNormal[1], o[s++] = e.faceNormal[2], o[s++] = e.point[0], o[s++] = e.point[1], o[s++] = e.point[2];
		}
	}
	return o;
}
function rt(e) {
	let t = 0;
	t++;
	let n = e[t++];
	if (!Number.isFinite(n) || n < 0 || n !== (n | 0)) throw Error("Invalid V2 buffer: bad numUUIDs");
	if (t + n * 36 > e.length) throw Error("Invalid V2 buffer: UUID table exceeds buffer length");
	let r = [];
	for (let i = 0; i < n; i++) {
		let n = [];
		for (let r = 0; r < 36; r++) n.push(e[t++]);
		r.push(String.fromCharCode(...n));
	}
	let i = {};
	for (; t < e.length;) {
		let n = e[t++];
		if (n < 0 || n >= r.length) throw Error("Invalid V2 buffer: receiver index out of range");
		let a = r[n], o = e[t++];
		if (!Number.isFinite(o) || o < 0) throw Error("Invalid V2 buffer: bad pathBufLen");
		let s = Math.min(t + o, e.length), c = [];
		for (; t < s;) {
			let n = r[e[t++]], i = e[t++], a = e[t++], o = !!e[t++], s = e[t++], l = [];
			for (let n = 0; n < i; n++) {
				let n = r[e[t++]], i = e[t++], a = e[t++], o = e[t++], s = e[t++], c = e[t++], u = [
					e[t++],
					e[t++],
					e[t++]
				], d = [
					e[t++],
					e[t++],
					e[t++]
				];
				l.push({
					object: n,
					angle: i,
					distance: a,
					energy: o,
					faceIndex: s,
					faceMaterialIndex: c,
					faceNormal: u,
					point: d
				});
			}
			c.push({
				source: n,
				chainLength: i,
				time: a,
				intersectedReceiver: o,
				energy: s,
				chain: l
			});
		}
		i[a] = c;
	}
	return i;
}
function it(e) {
	return nt(e);
}
function at(e) {
	return e.length === 0 ? {} : e[0] === et ? rt(e) : tt(e);
}
//#endregion
//#region src/compute/raytracer/export-playback.ts
var ot = /* @__PURE__ */ r(s()), { floor: st, abs: ct } = Math, lt = () => Math.random() > .5, ut = "RAYTRACER_SET_PROPERTY";
function dt(e, t, n, r, i, a = 100, o = m(125, 8e3), s = 44100) {
	if (t.length === 0) throw Error("No receivers have been assigned to the raytracer");
	if (n.length === 0) throw Error("No sources have been assigned to the raytracer");
	if (e[t[0]].length === 0) throw Error("No rays have been traced yet");
	let c = e[t[0]].sort((e, t) => e.time - t.time), l = c[c.length - 1].time + I, u = Array(o.length).fill(a), d = st(s * l), p = [];
	for (let e = 0; e < o.length; e++) p.push(new Float32Array(d));
	let _ = 0, v = f.getState().containers[t[0]];
	for (let e = 0; e < c.length; e++) {
		let t = lt() ? 1 : -1, n = c[e].time, i = c[e].arrivalDirection || [
			0,
			0,
			1
		], a = v.getGain(i), l = r(u, o, c[e], a).map((e) => e * t), d = st(n * s);
		for (let e = 0; e < o.length; e++) p[e][d] += l[e], ct(p[e][d]) > _ && (_ = ct(p[e][d]));
	}
	for (let e = 0; e < o.length; e++) {
		let t = g([h(p[e])], {
			sampleRate: s,
			bitDepth: 32
		});
		ot.default.saveAs(t, `${o[e]}_${i}.wav`);
	}
}
async function ft(e, t, n) {
	return fe(e, t, n, ut);
}
async function pt(e, t, n, r) {
	return he(e, t, n, r);
}
async function mt(e, t, n, r = 1, i) {
	return ge(e, t, n, r, i);
}
async function ht(e, t, n) {
	return pe(e, t, n, ut);
}
async function gt(e, t, n) {
	return me(e, t, n);
}
//#endregion
//#region src/compute/raytracer/convergence.ts
function _t(e) {
	return {
		convergenceMetrics: {
			totalRays: 0,
			validRays: 0,
			estimatedT30: Array(e).fill(0),
			t30Mean: Array(e).fill(0),
			t30M2: Array(e).fill(0),
			t30Count: 0,
			convergenceRatio: Infinity
		},
		energyHistogram: {},
		lastConvergenceCheck: Date.now()
	};
}
function vt(e, t, n, r, i, a, o, s, l) {
	e.totalRays = i, e.validRays = a;
	let u = Object.keys(t);
	if (u.length === 0) return;
	let d;
	if (r.length > 0) for (let e of r) {
		let n = t[e];
		if (n && n.length > 0) {
			d = e;
			break;
		}
	}
	if (!d) {
		let e = u.slice().sort();
		for (let n of e) {
			let e = t[n];
			if (e && e.length > 0) {
				d = n;
				break;
			}
		}
	}
	if (!d) return;
	let f = t[d];
	if (!f || f.length === 0) return;
	let p = n.length, m = Array(p).fill(0);
	for (let e = 0; e < p; e++) {
		let t = f[e], n = 0;
		for (let e = s - 1; e >= 0; e--) if (t[e] > 0) {
			n = e;
			break;
		}
		if (n < 2) {
			m[e] = 0;
			continue;
		}
		let r = new Float32Array(n + 1);
		r[n] = t[n];
		for (let e = n - 1; e >= 0; e--) r[e] = r[e + 1] + t[e];
		let i = r[0];
		if (i <= 0) {
			m[e] = 0;
			continue;
		}
		let a = i * 10 ** (-5 / 10), c = i * 10 ** (-35 / 10), l = -1, u = -1;
		for (let e = 0; e <= n; e++) l < 0 && r[e] <= a && (l = e), u < 0 && r[e] <= c && (u = e);
		if (l >= 0 && u > l) {
			let t = [], n = [];
			for (let e = l; e <= u; e++) {
				let a = r[e];
				a > 0 && (t.push(e * o), n.push(10 * Math.log10(a / i)));
			}
			if (t.length >= 2) {
				let r = S(t, n).m;
				m[e] = r < 0 ? 60 / -r : 0;
			}
		}
	}
	e.estimatedT30 = m, e.t30Count += 1;
	let h = e.t30Count, g = 0, _ = 0;
	for (let t = 0; t < p; t++) {
		let n = m[t], r = e.t30Mean[t], i = r + (n - r) / h, a = e.t30M2[t] + (n - r) * (n - i);
		if (e.t30Mean[t] = i, e.t30M2[t] = a, h >= 2 && i > 0) {
			let e = a / (h - 1), t = Math.sqrt(e) / i;
			t > g && (g = t), _++;
		}
	}
	e.convergenceRatio = _ > 0 ? g : Infinity, c("RAYTRACER_SET_PROPERTY", {
		uuid: l,
		property: "convergenceMetrics",
		value: { ...e }
	});
}
function yt(e, t, n, r, i, a, o) {
	if (!e[t]) {
		e[t] = [];
		for (let n = 0; n < r.length; n++) e[t].push(new Float32Array(o));
	}
	let s = 0;
	for (let e = 0; e < n.chain.length; e++) s += n.chain[e].distance;
	s /= i;
	let c = Math.floor(s / a);
	if (c >= 0 && c < o && n.bandEnergy) for (let i = 0; i < r.length; i++) e[t][i][c] += n.bandEnergy[i] || 0;
}
//#endregion
//#region src/compute/raytracer/gpu/gpu-bvh.ts
function bt(e, t, n) {
	let r = e.allSurfaces, i = f.getState().containers, a = [], o = [], s = [], c = [];
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		a.push(t.uuid);
		let n = t.mesh, i = n.geometry, l = i.getAttribute("position"), u = i.getIndex();
		n.updateMatrixWorld(!0);
		let d = n.matrixWorld;
		if (u) for (let t = 0; t < u.count; t += 3) {
			for (let e = 0; e < 3; e++) {
				let n = u.getX(t + e), r = new P.Vector3(l.getX(n), l.getY(n), l.getZ(n)).applyMatrix4(d);
				o.push(r.x, r.y, r.z);
			}
			let n = o.length - 9, r = wt(o[n], o[n + 1], o[n + 2], o[n + 3], o[n + 4], o[n + 5], o[n + 6], o[n + 7], o[n + 8]);
			s.push(r[0], r[1], r[2]), c.push(e);
		}
		else for (let t = 0; t < l.count; t += 3) {
			for (let e = 0; e < 3; e++) {
				let n = new P.Vector3(l.getX(t + e), l.getY(t + e), l.getZ(t + e)).applyMatrix4(d);
				o.push(n.x, n.y, n.z);
			}
			let n = o.length - 9, r = wt(o[n], o[n + 1], o[n + 2], o[n + 3], o[n + 4], o[n + 5], o[n + 6], o[n + 7], o[n + 8]);
			s.push(r[0], r[1], r[2]), c.push(e);
		}
	}
	let l = c.length, u = new Float32Array(o), d = new Float32Array(s), p = new Uint32Array(c), m = new Float32Array(l * 3);
	for (let e = 0; e < l; e++) {
		let t = e * 9;
		m[e * 3] = (u[t] + u[t + 3] + u[t + 6]) / 3, m[e * 3 + 1] = (u[t + 1] + u[t + 4] + u[t + 7]) / 3, m[e * 3 + 2] = (u[t + 2] + u[t + 5] + u[t + 8]) / 3;
	}
	let h = new Uint32Array(l);
	for (let e = 0; e < l; e++) h[e] = e;
	let g = q(u, m, h, 0, l, 0), _ = new Float32Array(l * 9), v = new Float32Array(l * 3), y = new Uint32Array(l);
	for (let e = 0; e < l; e++) {
		let t = h[e];
		_.set(u.subarray(t * 9, t * 9 + 9), e * 9), v.set(d.subarray(t * 3, t * 3 + 3), e * 3), y[e] = p[t];
	}
	let { nodeArray: b, nodeCount: x } = Ct(g), S = n.length, C = new Float32Array(r.length * S * 2);
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		for (let r = 0; r < S; r++) {
			let i = (e * S + r) * 2;
			C[i] = t.absorptionFunction(n[r]), C[i + 1] = t.scatteringFunction(n[r]);
		}
	}
	let w = [], T = [];
	for (let e of t) {
		let t = i[e];
		if (t) {
			w.push(e);
			let n = t.scale, r = Math.max(Math.abs(n.x), Math.abs(n.y), Math.abs(n.z));
			T.push(t.position.x, t.position.y, t.position.z, .1 * r);
		}
	}
	return {
		bvhNodes: b,
		triangleVertices: _,
		triangleSurfaceIndex: y,
		triangleNormals: v,
		surfaceAcousticData: C,
		receiverSpheres: new Float32Array(T),
		triangleCount: l,
		nodeCount: x,
		surfaceCount: r.length,
		receiverCount: w.length,
		surfaceUuidMap: a,
		receiverUuidMap: w
	};
}
var xt = 8, St = 64;
function q(e, t, n, r, i, a) {
	let o = Infinity, s = Infinity, c = Infinity, l = -Infinity, u = -Infinity, d = -Infinity;
	for (let t = r; t < i; t++) {
		let r = n[t];
		for (let t = 0; t < 3; t++) {
			let n = r * 9 + t * 3, i = e[n], a = e[n + 1], f = e[n + 2];
			i < o && (o = i), i > l && (l = i), a < s && (s = a), a > u && (u = a), f < c && (c = f), f > d && (d = f);
		}
	}
	let f = i - r;
	if (f <= xt || a >= St) return {
		boundsMin: [
			o,
			s,
			c
		],
		boundsMax: [
			l,
			u,
			d
		],
		left: null,
		right: null,
		triStart: r,
		triCount: f
	};
	let p = l - o, m = u - s, h = d - c, g = p >= m && p >= h ? 0 : m >= h ? 1 : 2, _ = Infinity, v = -Infinity;
	for (let e = r; e < i; e++) {
		let r = t[n[e] * 3 + g];
		r < _ && (_ = r), r > v && (v = r);
	}
	let y = (_ + v) * .5, b = r;
	for (let e = r; e < i; e++) if (t[n[e] * 3 + g] < y) {
		let t = n[b];
		n[b] = n[e], n[e] = t, b++;
	}
	(b === r || b === i) && (b = r + i >> 1);
	let x = q(e, t, n, r, b, a + 1), S = q(e, t, n, b, i, a + 1);
	return {
		boundsMin: [
			o,
			s,
			c
		],
		boundsMax: [
			l,
			u,
			d
		],
		left: x,
		right: S,
		triStart: -1,
		triCount: -1
	};
}
function Ct(e) {
	let t = 0, n = [e];
	for (; n.length > 0;) {
		let e = n.pop();
		t++, e.left && n.push(e.left), e.right && n.push(e.right);
	}
	let r = new Float32Array(t * 8), i = 0;
	function a(e) {
		let t = i++, n = t * 8;
		r[n] = e.boundsMin[0], r[n + 1] = e.boundsMin[1], r[n + 2] = e.boundsMin[2], r[n + 4] = e.boundsMax[0], r[n + 5] = e.boundsMax[1], r[n + 6] = e.boundsMax[2];
		let o = new Uint32Array(r.buffer);
		if (e.left && e.right) {
			let t = a(e.left), r = a(e.right);
			o[n + 3] = t, o[n + 7] = r;
		} else o[n + 3] = e.triStart, o[n + 7] = (e.triCount | 2147483648) >>> 0;
		return t;
	}
	return a(e), {
		nodeArray: r,
		nodeCount: t
	};
}
function wt(e, t, n, r, i, a, o, s, c) {
	let l = r - e, u = i - t, d = a - n, f = o - e, p = s - t, m = c - n, h = u * m - d * p, g = d * f - l * m, _ = l * p - u * f, v = Math.sqrt(h * h + g * g + _ * _);
	return v > 1e-10 && (h /= v, g /= v, _ /= v), [
		h,
		g,
		_
	];
}
//#endregion
//#region src/compute/raytracer/gpu/ray-trace.wgsl?raw
var Tt = "// ─── GPU Ray Tracer Compute Shader ───────────────────────────────────\n// Traces one ray per thread through all bounces using an iterative BVH\n// traversal and Moller–Trumbore ray-triangle intersection.\n//\n// Mirrors the CPU implementation in ray-core.ts.\n\n// Constants\nconst MAX_BOUNCES: u32 = 64u;\nconst MAX_BANDS: u32 = 7u;\nconst BVH_STACK_SIZE: u32 = 64u;\nconst SELF_INTERSECTION_OFFSET: f32 = 0.01;\nconst PI: f32 = 3.14159265358979;\nconst EPSILON: f32 = 1e-6;\n\n// ─── Structures ──────────────────────────────────────────────────────\n\nstruct Params {\n  numRays: u32,\n  maxBounces: u32,\n  numBands: u32,\n  numReceivers: u32,\n  numTriangles: u32,\n  numNodes: u32,\n  numSurfaces: u32,\n  batchSeed: u32,\n  rrThreshold: f32,\n  _pad0: f32,\n  _pad1: f32,\n  _pad2: f32,\n  // Per-band air attenuation in dB/m (up to MAX_BANDS), packed into vec4s\n  // to satisfy uniform buffer layout rules (array<f32> has 16-byte stride).\n  // airAttPacked[0] = (band0, band1, band2, band3)\n  // airAttPacked[1] = (band4, band5, band6, unused)\n  airAttPacked: array<vec4<f32>, 2>,\n}\n\nfn getAirAtt(band: u32) -> f32 {\n  return params.airAttPacked[band / 4u][band % 4u];\n}\n\n// Per-bounce output written to the chain buffer\nstruct ChainEntry {\n  px: f32, py: f32, pz: f32,\n  distance: f32,\n  surfaceIndex: u32,\n  _pad0: u32,\n  angle: f32,\n  energy: f32,\n  bandEnergy: array<f32, 7>,\n  _pad1: f32,\n}\n\n// Per-ray output\nstruct RayOutput {\n  chainLength: u32,\n  intersectedReceiver: u32, // 0 or 1\n  receiverIndex: u32,\n  arrivalDirX: f32,\n  arrivalDirY: f32,\n  arrivalDirZ: f32,\n  _pad0: f32,\n  _pad1: f32,\n  finalBandEnergy: array<f32, 7>,\n  _pad2: f32,\n}\n\n// Per-ray input\nstruct RayInput {\n  ox: f32, oy: f32, oz: f32,\n  dx: f32, dy: f32, dz: f32,\n  initialPhi: f32,\n  initialTheta: f32,\n  bandEnergy: array<f32, 7>,\n  _pad: f32,\n}\n\n// ─── Bindings ────────────────────────────────────────────────────────\n\n@group(0) @binding(0) var<uniform> params: Params;\n@group(0) @binding(1) var<storage, read> bvhNodes: array<f32>;\n@group(0) @binding(2) var<storage, read> triVerts: array<f32>;\n@group(0) @binding(3) var<storage, read> triSurfIndex: array<u32>;\n@group(0) @binding(4) var<storage, read> triNormals: array<f32>;\n@group(0) @binding(5) var<storage, read> surfAcoustic: array<f32>;\n@group(0) @binding(6) var<storage, read> receiverSpheres: array<f32>;\n@group(0) @binding(7) var<storage, read> rayInputs: array<RayInput>;\n@group(0) @binding(8) var<storage, read_write> rayOutputs: array<RayOutput>;\n@group(0) @binding(9) var<storage, read_write> chainBuffer: array<ChainEntry>;\n\n// ─── RNG (PCG hash) ─────────────────────────────────────────────────\n\nfn pcg_hash(input: u32) -> u32 {\n  var state = input * 747796405u + 2891336453u;\n  var word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;\n  return (word >> 22u) ^ word;\n}\n\nfn rand(seed: ptr<function, u32>) -> f32 {\n  *seed = pcg_hash(*seed);\n  return f32(*seed) / 4294967295.0;\n}\n\n// ─── Vector helpers ─────────────────────────────────────────────────\n\nfn dot3(ax: f32, ay: f32, az: f32, bx: f32, by: f32, bz: f32) -> f32 {\n  return ax * bx + ay * by + az * bz;\n}\n\nfn length3(x: f32, y: f32, z: f32) -> f32 {\n  return sqrt(x * x + y * y + z * z);\n}\n\nfn normalize3(x: f32, y: f32, z: f32) -> vec3<f32> {\n  let len = length3(x, y, z);\n  if (len < EPSILON) { return vec3<f32>(0.0, 1.0, 0.0); }\n  return vec3<f32>(x / len, y / len, z / len);\n}\n\n// ─── Ray-AABB slab test ─────────────────────────────────────────────\n\nfn rayAabbIntersect(\n  ox: f32, oy: f32, oz: f32,\n  invDx: f32, invDy: f32, invDz: f32,\n  bminX: f32, bminY: f32, bminZ: f32,\n  bmaxX: f32, bmaxY: f32, bmaxZ: f32,\n  tMax: f32,\n) -> bool {\n  var t1 = (bminX - ox) * invDx;\n  var t2 = (bmaxX - ox) * invDx;\n  var tNear = min(t1, t2);\n  var tFar = max(t1, t2);\n\n  t1 = (bminY - oy) * invDy;\n  t2 = (bmaxY - oy) * invDy;\n  tNear = max(tNear, min(t1, t2));\n  tFar = min(tFar, max(t1, t2));\n\n  t1 = (bminZ - oz) * invDz;\n  t2 = (bmaxZ - oz) * invDz;\n  tNear = max(tNear, min(t1, t2));\n  tFar = min(tFar, max(t1, t2));\n\n  return tNear <= tFar && tFar >= 0.0 && tNear < tMax;\n}\n\n// ─── Moller–Trumbore ray-triangle intersection ──────────────────────\n\nfn rayTriIntersect(\n  ox: f32, oy: f32, oz: f32,\n  dx: f32, dy: f32, dz: f32,\n  triIdx: u32,\n) -> vec2<f32> {\n  // Returns (t, 0) on hit, (-1, 0) on miss\n  let b = triIdx * 9u;\n  let v0x = triVerts[b]; let v0y = triVerts[b + 1u]; let v0z = triVerts[b + 2u];\n  let v1x = triVerts[b + 3u]; let v1y = triVerts[b + 4u]; let v1z = triVerts[b + 5u];\n  let v2x = triVerts[b + 6u]; let v2y = triVerts[b + 7u]; let v2z = triVerts[b + 8u];\n\n  let e1x = v1x - v0x; let e1y = v1y - v0y; let e1z = v1z - v0z;\n  let e2x = v2x - v0x; let e2y = v2y - v0y; let e2z = v2z - v0z;\n\n  // h = cross(d, e2)\n  let hx = dy * e2z - dz * e2y;\n  let hy = dz * e2x - dx * e2z;\n  let hz = dx * e2y - dy * e2x;\n\n  let a = e1x * hx + e1y * hy + e1z * hz;\n  if (abs(a) < EPSILON) { return vec2<f32>(-1.0, 0.0); }\n\n  let f_inv = 1.0 / a;\n  let sx = ox - v0x; let sy = oy - v0y; let sz = oz - v0z;\n  let u = f_inv * (sx * hx + sy * hy + sz * hz);\n  if (u < 0.0 || u > 1.0) { return vec2<f32>(-1.0, 0.0); }\n\n  // q = cross(s, e1)\n  let qx = sy * e1z - sz * e1y;\n  let qy = sz * e1x - sx * e1z;\n  let qz = sx * e1y - sy * e1x;\n  let v = f_inv * (dx * qx + dy * qy + dz * qz);\n  if (v < 0.0 || u + v > 1.0) { return vec2<f32>(-1.0, 0.0); }\n\n  let t = f_inv * (e2x * qx + e2y * qy + e2z * qz);\n  if (t < EPSILON) { return vec2<f32>(-1.0, 0.0); }\n\n  return vec2<f32>(t, 0.0);\n}\n\n// ─── Ray-sphere intersection ────────────────────────────────────────\n\nfn raySphereIntersect(\n  ox: f32, oy: f32, oz: f32,\n  dx: f32, dy: f32, dz: f32,\n  cx: f32, cy: f32, cz: f32,\n  r: f32,\n) -> f32 {\n  let lx = cx - ox; let ly = cy - oy; let lz = cz - oz;\n  let tca = lx * dx + ly * dy + lz * dz;\n  let d2 = lx * lx + ly * ly + lz * lz - tca * tca;\n  let r2 = r * r;\n  if (d2 > r2) { return -1.0; }\n  let thc = sqrt(r2 - d2);\n  var t0 = tca - thc;\n  let t1 = tca + thc;\n  if (t0 < EPSILON) { t0 = t1; }\n  if (t0 < EPSILON) { return -1.0; }\n  return t0;\n}\n\n// ─── BVH traversal — find closest triangle hit ─────────────────────\n\nstruct HitResult {\n  t: f32,\n  triIdx: u32,\n  hit: bool,\n}\n\nfn traceClosest(\n  ox: f32, oy: f32, oz: f32,\n  dx: f32, dy: f32, dz: f32,\n) -> HitResult {\n  var result: HitResult;\n  result.t = 1e30;\n  result.triIdx = 0u;\n  result.hit = false;\n\n  let invDx = select(1e30, 1.0 / dx, abs(dx) > EPSILON);\n  let invDy = select(1e30, 1.0 / dy, abs(dy) > EPSILON);\n  let invDz = select(1e30, 1.0 / dz, abs(dz) > EPSILON);\n\n  var stack: array<u32, 64>;\n  var stackPtr: u32 = 0u;\n  stack[0] = 0u; // root node index\n  stackPtr = 1u;\n\n  while (stackPtr > 0u) {\n    stackPtr -= 1u;\n    let nodeIdx = stack[stackPtr];\n    let off = nodeIdx * 8u;\n\n    let bminX = bvhNodes[off];\n    let bminY = bvhNodes[off + 1u];\n    let bminZ = bvhNodes[off + 2u];\n    let bmaxX = bvhNodes[off + 4u];\n    let bmaxY = bvhNodes[off + 5u];\n    let bmaxZ = bvhNodes[off + 6u];\n\n    if (!rayAabbIntersect(ox, oy, oz, invDx, invDy, invDz, bminX, bminY, bminZ, bmaxX, bmaxY, bmaxZ, result.t)) {\n      continue;\n    }\n\n    // Read data1 as u32 to check leaf flag\n    let data1Bits = bitcast<u32>(bvhNodes[off + 7u]);\n    let isLeaf = (data1Bits & 0x80000000u) != 0u;\n\n    if (isLeaf) {\n      let triStart = bitcast<u32>(bvhNodes[off + 3u]);\n      let triCount = data1Bits & 0x7FFFFFFFu;\n      for (var i = 0u; i < triCount; i++) {\n        let tri = triStart + i;\n        let res = rayTriIntersect(ox, oy, oz, dx, dy, dz, tri);\n        if (res.x > 0.0 && res.x < result.t) {\n          result.t = res.x;\n          result.triIdx = tri;\n          result.hit = true;\n        }\n      }\n    } else {\n      let leftIdx = bitcast<u32>(bvhNodes[off + 3u]);\n      let rightIdx = data1Bits;\n      if (stackPtr < BVH_STACK_SIZE) {\n        stack[stackPtr] = leftIdx;\n        stackPtr += 1u;\n      }\n      if (stackPtr < BVH_STACK_SIZE) {\n        stack[stackPtr] = rightIdx;\n        stackPtr += 1u;\n      }\n    }\n  }\n\n  return result;\n}\n\n// ─── Reflection coefficient (matches CPU reflection-coefficient.ts) ──\n\nfn reflectionCoefficient(alpha: f32, theta: f32) -> f32 {\n  let rootOneMinusAlpha = sqrt(max(1.0 - alpha, 0.0));\n  let xi_o = (1.0 - rootOneMinusAlpha) / (1.0 + rootOneMinusAlpha);\n  let cosTheta = abs(cos(theta));\n  let xi_o_cosTheta = xi_o * cosTheta;\n  let R = (xi_o_cosTheta - 1.0) / (xi_o_cosTheta + 1.0);\n  return R * R;\n}\n\n// ─── Main compute entry point ───────────────────────────────────────\n\n@compute @workgroup_size(64)\nfn main(@builtin(global_invocation_id) gid: vec3<u32>) {\n  let rayIdx = gid.x;\n  if (rayIdx >= params.numRays) { return; }\n\n  let inp = rayInputs[rayIdx];\n  let numBands = min(params.numBands, MAX_BANDS);\n  let maxBounces = min(params.maxBounces, MAX_BOUNCES);\n\n  var rngSeed: u32 = pcg_hash(rayIdx * 747796405u + params.batchSeed);\n\n  // Current ray state\n  var ox = inp.ox; var oy = inp.oy; var oz = inp.oz;\n  var dx = inp.dx; var dy = inp.dy; var dz = inp.dz;\n  var d = normalize3(dx, dy, dz);\n  dx = d.x; dy = d.y; dz = d.z;\n\n  var bandEnergy: array<f32, 7>;\n  for (var b = 0u; b < numBands; b++) {\n    bandEnergy[b] = inp.bandEnergy[b];\n  }\n\n  // Output\n  let chainBase = rayIdx * MAX_BOUNCES;\n  var chainLen: u32 = 0u;\n  var hitReceiver: u32 = 0u;\n  var receiverIdx: u32 = 0u;\n  var arrivalDir = vec3<f32>(0.0, 0.0, 0.0);\n\n  for (var bounce = 0u; bounce < maxBounces; bounce++) {\n    // Check receiver spheres first (find closest)\n    var closestRecT: f32 = 1e30;\n    var closestRecIdx: u32 = 0u;\n    var recHit = false;\n    for (var ri = 0u; ri < params.numReceivers; ri++) {\n      let rb = ri * 4u;\n      let rcx = receiverSpheres[rb];\n      let rcy = receiverSpheres[rb + 1u];\n      let rcz = receiverSpheres[rb + 2u];\n      let rr = receiverSpheres[rb + 3u];\n      let t = raySphereIntersect(ox, oy, oz, dx, dy, dz, rcx, rcy, rcz, rr);\n      if (t > 0.0 && t < closestRecT) {\n        closestRecT = t;\n        closestRecIdx = ri;\n        recHit = true;\n      }\n    }\n\n    // BVH closest triangle hit\n    let triHit = traceClosest(ox, oy, oz, dx, dy, dz);\n\n    // Receiver is closer than any surface — ray enters receiver\n    if (recHit && closestRecT < triHit.t) {\n      // Apply air absorption for receiver segment\n      for (var b = 0u; b < numBands; b++) {\n        bandEnergy[b] *= pow(10.0, -getAirAtt(b) * closestRecT / 10.0);\n      }\n\n      // Compute mean energy\n      var totalE: f32 = 0.0;\n      for (var b = 0u; b < numBands; b++) { totalE += bandEnergy[b]; }\n      let meanE = totalE / f32(numBands);\n\n      // Record chain entry at receiver position\n      if (chainLen < MAX_BOUNCES) {\n        let ci = chainBase + chainLen;\n        chainBuffer[ci].px = ox + dx * closestRecT;\n        chainBuffer[ci].py = oy + dy * closestRecT;\n        chainBuffer[ci].pz = oz + dz * closestRecT;\n        chainBuffer[ci].distance = closestRecT;\n        // Store receiver index encoded as surface index + numSurfaces offset\n        chainBuffer[ci].surfaceIndex = params.numSurfaces + closestRecIdx;\n        chainBuffer[ci].angle = 0.0;\n        chainBuffer[ci].energy = meanE;\n        for (var b = 0u; b < numBands; b++) {\n          chainBuffer[ci].bandEnergy[b] = bandEnergy[b];\n        }\n        chainLen += 1u;\n      }\n\n      hitReceiver = 1u;\n      receiverIdx = closestRecIdx;\n      arrivalDir = normalize3(-dx, -dy, -dz);\n      break;\n    }\n\n    // No surface hit — ray escapes\n    if (!triHit.hit) { break; }\n\n    // Surface hit\n    let hitT = triHit.t;\n    let hitTri = triHit.triIdx;\n    let surfIdx = triSurfIndex[hitTri];\n\n    // Hit point\n    let hx = ox + dx * hitT;\n    let hy = oy + dy * hitT;\n    let hz = oz + dz * hitT;\n\n    // Face normal\n    let nb = hitTri * 3u;\n    let nx = triNormals[nb];\n    let ny = triNormals[nb + 1u];\n    let nz = triNormals[nb + 2u];\n\n    // Incidence angle\n    let negDdotN = -(dx * nx + dy * ny + dz * nz);\n    let angle = acos(clamp(abs(negDdotN), 0.0, 1.0));\n\n    // Mean energy before reflection (for chain output)\n    var totalEBefore: f32 = 0.0;\n    for (var b = 0u; b < numBands; b++) { totalEBefore += bandEnergy[b]; }\n    let meanEBefore = totalEBefore / f32(numBands);\n\n    // Record chain entry\n    if (chainLen < MAX_BOUNCES) {\n      let ci = chainBase + chainLen;\n      chainBuffer[ci].px = hx;\n      chainBuffer[ci].py = hy;\n      chainBuffer[ci].pz = hz;\n      chainBuffer[ci].distance = hitT;\n      chainBuffer[ci].surfaceIndex = surfIdx;\n      chainBuffer[ci].angle = angle;\n      chainBuffer[ci].energy = meanEBefore;\n      for (var b = 0u; b < numBands; b++) {\n        chainBuffer[ci].bandEnergy[b] = bandEnergy[b];\n      }\n      chainLen += 1u;\n    }\n\n    // Apply per-band reflection loss and air absorption\n    var broadbandScatter: f32 = 0.0;\n    var totalEForScatter: f32 = 0.0;\n\n    for (var b = 0u; b < numBands; b++) {\n      let acousticOffset = (surfIdx * params.numBands + b) * 2u;\n      let alpha = surfAcoustic[acousticOffset];\n      let scatter = surfAcoustic[acousticOffset + 1u];\n\n      let R = reflectionCoefficient(alpha, angle);\n      bandEnergy[b] *= abs(R);\n      bandEnergy[b] *= pow(10.0, -getAirAtt(b) * hitT / 10.0);\n\n      broadbandScatter += scatter * bandEnergy[b];\n      totalEForScatter += bandEnergy[b];\n    }\n\n    if (totalEForScatter > 0.0) {\n      broadbandScatter /= totalEForScatter;\n    }\n\n    // Russian Roulette termination\n    var maxE: f32 = 0.0;\n    for (var b = 0u; b < numBands; b++) {\n      maxE = max(maxE, bandEnergy[b]);\n    }\n\n    if (maxE < params.rrThreshold && maxE > 0.0) {\n      let survivalProb = maxE / params.rrThreshold;\n      if (rand(&rngSeed) > survivalProb) {\n        break; // Terminate\n      }\n      // Boost survivors\n      for (var b = 0u; b < numBands; b++) {\n        bandEnergy[b] /= survivalProb;\n      }\n    } else if (maxE <= 0.0) {\n      break;\n    }\n\n    // Compute reflected direction\n    // Specular: r = d - 2(d·n)n\n    let dDotN = dx * nx + dy * ny + dz * nz;\n    var rx = dx - 2.0 * dDotN * nx;\n    var ry = dy - 2.0 * dDotN * ny;\n    var rz = dz - 2.0 * dDotN * nz;\n\n    // Scattering: probabilistic Lambert vs specular\n    if (rand(&rngSeed) < broadbandScatter) {\n      // Cosine-weighted hemisphere sampling (rejection + normal offset)\n      var sx: f32; var sy: f32; var sz: f32; var lenSq: f32;\n      loop {\n        sx = rand(&rngSeed) * 2.0 - 1.0;\n        sy = rand(&rngSeed) * 2.0 - 1.0;\n        sz = rand(&rngSeed) * 2.0 - 1.0;\n        lenSq = sx * sx + sy * sy + sz * sz;\n        if (lenSq <= 1.0 && lenSq > 1e-6) { break; }\n      }\n      let invLen = 1.0 / sqrt(lenSq);\n      sx *= invLen; sy *= invLen; sz *= invLen;\n      // Offset along normal for cosine distribution\n      rx = sx + nx;\n      ry = sy + ny;\n      rz = sz + nz;\n    }\n\n    // Normalize reflected direction\n    d = normalize3(rx, ry, rz);\n    dx = d.x; dy = d.y; dz = d.z;\n\n    // Offset origin along normal to avoid self-intersection\n    ox = hx + nx * SELF_INTERSECTION_OFFSET;\n    oy = hy + ny * SELF_INTERSECTION_OFFSET;\n    oz = hz + nz * SELF_INTERSECTION_OFFSET;\n  }\n\n  // Write output\n  rayOutputs[rayIdx].chainLength = chainLen;\n  rayOutputs[rayIdx].intersectedReceiver = hitReceiver;\n  rayOutputs[rayIdx].receiverIndex = receiverIdx;\n  rayOutputs[rayIdx].arrivalDirX = arrivalDir.x;\n  rayOutputs[rayIdx].arrivalDirY = arrivalDir.y;\n  rayOutputs[rayIdx].arrivalDirZ = arrivalDir.z;\n  for (var b = 0u; b < min(params.numBands, MAX_BANDS); b++) {\n    rayOutputs[rayIdx].finalBandEnergy[b] = bandEnergy[b];\n  }\n}\n", J = 64, Et = 7, Dt = 64, Ot = 16, kt = 64, At = 16, Y = 64, jt = 16, Mt = 64, Nt = 80, Pt = class {
	device = null;
	pipeline = null;
	bindGroupLayout = null;
	sceneBuf = null;
	gpuBvhNodes = null;
	gpuTriVerts = null;
	gpuTriSurfIdx = null;
	gpuTriNormals = null;
	gpuSurfAcoustic = null;
	gpuReceiverSpheres = null;
	gpuRayInputs = null;
	gpuRayOutputs = null;
	gpuChainBuffer = null;
	gpuParams = null;
	gpuReadbackOutput = null;
	gpuReadbackChain = null;
	config = null;
	maxBatchSize = 0;
	get effectiveBatchSize() {
		return this.maxBatchSize;
	}
	async initialize(e, t, n, r) {
		let i = await le();
		if (!i) return !1;
		this.device = i.device, this.config = n;
		let a = i.device.limits.maxStorageBufferBindingSize, o = i.device.limits.maxBufferSize, s = Math.floor(Math.min(a, o) / 4096);
		if (s < 1) return console.error("[GPU RT] Device storage limits too small for even a single ray chain buffer"), !1;
		let c = Math.max(1, r), l = Math.min(c, s);
		l < c && console.warn(`[GPU RT] batchSize ${c} exceeds device limits; clamped to ${l}`), this.maxBatchSize = l, n.reflectionOrder > J && console.warn(`[GPU RT] reflectionOrder ${n.reflectionOrder} clamped to ${J}`);
		let u = n.frequencies.slice(0, Et);
		this.sceneBuf = bt(e, t, u), this.gpuBvhNodes = this.createStorageBuffer(this.sceneBuf.bvhNodes), this.gpuTriVerts = this.createStorageBuffer(this.sceneBuf.triangleVertices), this.gpuTriSurfIdx = this.createStorageBuffer(new Uint32Array(this.sceneBuf.triangleSurfaceIndex)), this.gpuTriNormals = this.createStorageBuffer(this.sceneBuf.triangleNormals), this.gpuSurfAcoustic = this.createStorageBuffer(this.sceneBuf.surfaceAcousticData);
		let d = this.sceneBuf.receiverSpheres.length > 0 ? this.sceneBuf.receiverSpheres : /* @__PURE__ */ new Float32Array(4);
		this.gpuReceiverSpheres = this.createStorageBuffer(d);
		let f = l * kt, p = l * Y, m = l * J * Mt;
		this.gpuRayInputs = this.device.createBuffer({
			size: f,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		}), this.gpuRayOutputs = this.device.createBuffer({
			size: p,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
		}), this.gpuChainBuffer = this.device.createBuffer({
			size: m,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
		}), this.gpuParams = this.device.createBuffer({
			size: Nt,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		}), this.gpuReadbackOutput = this.device.createBuffer({
			size: p,
			usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
		}), this.gpuReadbackChain = this.device.createBuffer({
			size: m,
			usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
		});
		let h = this.device.createShaderModule({ code: Tt });
		return this.pipeline = this.device.createComputePipeline({
			layout: "auto",
			compute: {
				module: h,
				entryPoint: "main"
			}
		}), this.bindGroupLayout = this.pipeline.getBindGroupLayout(0), !0;
	}
	async traceBatch(e, t, n) {
		if (!this.device || !this.pipeline || !this.sceneBuf || !this.config) throw Error("[GPU RT] Not initialized");
		if (t > this.maxBatchSize) throw Error(`[GPU RT] rayCount ${t} exceeds maxBatchSize ${this.maxBatchSize}`);
		if (t === 0) return [];
		let r = Math.min(this.config.frequencies.length, Et), i = /* @__PURE__ */ new ArrayBuffer(Nt), a = new Uint32Array(i), o = new Float32Array(i);
		a[0] = t, a[1] = Math.min(this.config.reflectionOrder, J), a[2] = r, a[3] = this.sceneBuf.receiverCount, a[4] = this.sceneBuf.triangleCount, a[5] = this.sceneBuf.nodeCount, a[6] = this.sceneBuf.surfaceCount, a[7] = n, o[8] = this.config.rrThreshold;
		for (let e = 0; e < r; e++) o[12 + e] = this.config.cachedAirAtt[e];
		this.device.queue.writeBuffer(this.gpuParams, 0, i), this.device.queue.writeBuffer(this.gpuRayInputs, 0, e.buffer, e.byteOffset, t * kt);
		let s = this.device.createBindGroup({
			layout: this.bindGroupLayout,
			entries: [
				{
					binding: 0,
					resource: { buffer: this.gpuParams }
				},
				{
					binding: 1,
					resource: { buffer: this.gpuBvhNodes }
				},
				{
					binding: 2,
					resource: { buffer: this.gpuTriVerts }
				},
				{
					binding: 3,
					resource: { buffer: this.gpuTriSurfIdx }
				},
				{
					binding: 4,
					resource: { buffer: this.gpuTriNormals }
				},
				{
					binding: 5,
					resource: { buffer: this.gpuSurfAcoustic }
				},
				{
					binding: 6,
					resource: { buffer: this.gpuReceiverSpheres }
				},
				{
					binding: 7,
					resource: { buffer: this.gpuRayInputs }
				},
				{
					binding: 8,
					resource: { buffer: this.gpuRayOutputs }
				},
				{
					binding: 9,
					resource: { buffer: this.gpuChainBuffer }
				}
			]
		}), c = Math.ceil(t / Dt), l = this.device.createCommandEncoder(), u = l.beginComputePass();
		u.setPipeline(this.pipeline), u.setBindGroup(0, s), u.dispatchWorkgroups(c), u.end();
		let d = t * Y, f = t * J * Mt;
		l.copyBufferToBuffer(this.gpuRayOutputs, 0, this.gpuReadbackOutput, 0, d), l.copyBufferToBuffer(this.gpuChainBuffer, 0, this.gpuReadbackChain, 0, f), this.device.queue.submit([l.finish()]), await this.gpuReadbackOutput.mapAsync(GPUMapMode.READ, 0, d), await this.gpuReadbackChain.mapAsync(GPUMapMode.READ, 0, f);
		let p = new Float32Array(this.gpuReadbackOutput.getMappedRange(0, d).slice(0)), m = new Float32Array(this.gpuReadbackChain.getMappedRange(0, f).slice(0));
		return this.gpuReadbackOutput.unmap(), this.gpuReadbackChain.unmap(), this.parseResults(p, m, e, t, r);
	}
	parseResults(e, t, n, r, i) {
		let a = Array(r), o = this.sceneBuf;
		for (let s = 0; s < r; s++) {
			let r = s * At, c = new Uint32Array(e.buffer, r * 4, At), l = c[0], u = c[1] !== 0;
			if (l === 0) {
				a[s] = null;
				continue;
			}
			let d = [
				e[r + 3],
				e[r + 4],
				e[r + 5]
			], f = [];
			for (let t = 0; t < i; t++) f.push(e[r + 8 + t]);
			let p = [], m = s * J;
			for (let e = 0; e < l; e++) {
				let n = (m + e) * jt, r = new Uint32Array(t.buffer, n * 4, jt), a = t[n], s = t[n + 1], c = t[n + 2], l = t[n + 3], u = r[4], d = t[n + 6], f = t[n + 7], h = [];
				for (let e = 0; e < i; e++) h.push(t[n + 8 + e]);
				let g;
				if (u >= o.surfaceCount) {
					let e = u - o.surfaceCount;
					g = o.receiverUuidMap[e] ?? "";
				} else g = o.surfaceUuidMap[u] ?? "";
				p.push({
					point: [
						a,
						s,
						c
					],
					distance: l,
					object: g,
					faceNormal: [
						0,
						0,
						0
					],
					faceIndex: -1,
					faceMaterialIndex: -1,
					angle: d,
					energy: f,
					bandEnergy: h
				});
			}
			let h = s * Ot, g = n[h + 6], _ = n[h + 7], v = f.reduce((e, t) => e + t, 0), y = i > 0 ? v / i : 0;
			a[s] = {
				intersectedReceiver: u,
				chain: p,
				chainLength: p.length,
				energy: y,
				bandEnergy: f,
				time: 0,
				source: "",
				initialPhi: g,
				initialTheta: _,
				totalLength: 0,
				arrivalDirection: u ? d : void 0
			};
		}
		return a;
	}
	dispose() {
		let e = [
			this.gpuBvhNodes,
			this.gpuTriVerts,
			this.gpuTriSurfIdx,
			this.gpuTriNormals,
			this.gpuSurfAcoustic,
			this.gpuReceiverSpheres,
			this.gpuRayInputs,
			this.gpuRayOutputs,
			this.gpuChainBuffer,
			this.gpuParams,
			this.gpuReadbackOutput,
			this.gpuReadbackChain
		];
		for (let t of e) t && t.destroy();
		this.gpuBvhNodes = null, this.gpuTriVerts = null, this.gpuTriSurfIdx = null, this.gpuTriNormals = null, this.gpuSurfAcoustic = null, this.gpuReceiverSpheres = null, this.gpuRayInputs = null, this.gpuRayOutputs = null, this.gpuChainBuffer = null, this.gpuParams = null, this.gpuReadbackOutput = null, this.gpuReadbackChain = null, this.pipeline = null, this.bindGroupLayout = null, this.device = null, this.sceneBuf = null, this.config = null;
	}
	createStorageBuffer(e) {
		let t = Math.max(e.byteLength, 16), n = this.device.createBuffer({
			size: t,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		});
		return this.device.queue.writeBuffer(n, 0, e.buffer, e.byteOffset, e.byteLength), n;
	}
}, X = () => new Worker(new URL(
	/* @vite-ignore */
	"/assets/filter.worker-B2fYKvk6.js",
	"" + import.meta.url
)), { floor: Z, random: Ft, abs: Q, asin: It } = Math, Lt = () => Ft() > .5;
P.BufferGeometry.prototype.computeBoundsTree = be, P.BufferGeometry.prototype.disposeBoundsTree = xe, P.Mesh.prototype.raycast = ye;
var $ = class extends de {
	roomID;
	sourceIDs;
	surfaceIDs;
	receiverIDs;
	updateInterval;
	reflectionOrder;
	raycaster;
	intersections;
	_isRunning;
	intervals;
	rayBufferGeometry;
	rayBufferAttribute;
	colorBufferAttribute;
	rays;
	rayPositionIndex;
	maxrays;
	intersectableObjects;
	paths;
	stats;
	messageHandlerIDs;
	statsUpdatePeriod;
	lastTime;
	_runningWithoutReceivers;
	frequencies;
	allReceiverData;
	hits;
	_pointSize;
	chartdata;
	passes;
	_raysVisible;
	_pointsVisible;
	_invertedDrawStyle;
	__start_time;
	__calc_time;
	__num_checked_paths;
	responseOverlayElement;
	quickEstimateResults;
	responseByIntensity;
	plotData;
	intensitySampleRate;
	validRayCount;
	plotStyle;
	bvh;
	observed_name;
	_cachedAirAtt;
	hybrid;
	transitionOrder;
	convergenceThreshold;
	autoStop;
	rrThreshold;
	convergenceMetrics;
	_energyHistogram;
	_histogramBinWidth;
	_histogramNumBins;
	_lastConvergenceCheck;
	_convergenceCheckInterval;
	_directivityRefPressures;
	maxStoredPaths;
	edgeDiffractionEnabled;
	lateReverbTailEnabled;
	tailCrossfadeTime;
	tailCrossfadeDuration;
	_edgeGraph;
	gpuEnabled;
	gpuBatchSize;
	_gpuRayTracer = null;
	_gpuRunning = !1;
	_rafId = 0;
	hrtfSubjectId;
	headYaw;
	headPitch;
	headRoll;
	binauralImpulseResponse;
	binauralPlaying = !1;
	constructor(e) {
		super(e), this.kind = "ray-tracer", e = {
			...L,
			...e
		}, this.uuid = e.uuid || this.uuid, this.name = e.name || L.name, this.observed_name = we(this.name), this.responseOverlayElement = document.querySelector("#response-overlay") || document.createElement("div"), this.responseOverlayElement.style.backgroundColor = "#FFFFFF", this.sourceIDs = e.sourceIDs || L.sourceIDs, this.surfaceIDs = e.surfaceIDs || L.surfaceIDs, this.roomID = e.roomID || L.roomID, this.receiverIDs = e.receiverIDs || L.receiverIDs, this.updateInterval = e.updateInterval || L.updateInterval, this.reflectionOrder = e.reflectionOrder || L.reflectionOrder, this._isRunning = e.isRunning || L.isRunning, this._runningWithoutReceivers = e.runningWithoutReceivers || L.runningWithoutReceivers, this.frequencies = e.frequencies || L.frequencies, this._cachedAirAtt = M(this.frequencies, this.temperature), this.intervals = [], this.plotData = [], this.plotStyle = e.plotStyle || L.plotStyle, this.lastTime = Date.now(), this.statsUpdatePeriod = 100, this._pointSize = e.pointSize || L.pointSize, this.validRayCount = 0, this.intensitySampleRate = 256, this.quickEstimateResults = {};
		let t = typeof e.raysVisible == "boolean";
		this._raysVisible = t ? e.raysVisible : L.raysVisible;
		let n = typeof e.pointsVisible == "boolean";
		this._pointsVisible = n ? e.pointsVisible : L.pointsVisible;
		let r = typeof e.invertedDrawStyle == "boolean";
		this._invertedDrawStyle = r ? e.invertedDrawStyle : L.invertedDrawStyle, this.passes = e.passes || L.passes, this.raycaster = new P.Raycaster(), this.rayBufferGeometry = new P.BufferGeometry(), this.rayBufferGeometry.name = "raytracer-ray-buffer-geometry", this.maxrays = 1e6 - 1, this.rayBufferAttribute = new P.Float32BufferAttribute(new Float32Array(this.maxrays), 3), this.rayBufferAttribute.setUsage(P.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("position", this.rayBufferAttribute), this.rayBufferGeometry.setDrawRange(0, this.maxrays), this.colorBufferAttribute = new P.Float32BufferAttribute(new Float32Array(this.maxrays), 2), this.colorBufferAttribute.setUsage(P.DynamicDrawUsage), this.rayBufferGeometry.setAttribute("color", this.colorBufferAttribute), this.chartdata = [], this.hybrid = !1, this.transitionOrder = 2, this.convergenceThreshold = e.convergenceThreshold ?? L.convergenceThreshold, this.autoStop = e.autoStop ?? L.autoStop, this.rrThreshold = e.rrThreshold ?? L.rrThreshold, this.maxStoredPaths = e.maxStoredPaths ?? L.maxStoredPaths, this.edgeDiffractionEnabled = e.edgeDiffractionEnabled ?? L.edgeDiffractionEnabled, this.lateReverbTailEnabled = e.lateReverbTailEnabled ?? L.lateReverbTailEnabled, this.tailCrossfadeTime = e.tailCrossfadeTime ?? L.tailCrossfadeTime, this.tailCrossfadeDuration = e.tailCrossfadeDuration ?? L.tailCrossfadeDuration, this.gpuEnabled = e.gpuEnabled ?? L.gpuEnabled, this.gpuBatchSize = e.gpuBatchSize ?? L.gpuBatchSize, this.hrtfSubjectId = e.hrtfSubjectId ?? "D1", this.headYaw = e.headYaw ?? 0, this.headPitch = e.headPitch ?? 0, this.headRoll = e.headRoll ?? 0, this._edgeGraph = null, this._histogramBinWidth = ae, this._histogramNumBins = oe, this._convergenceCheckInterval = 500, this._resetConvergenceState(), this.rays = new P.LineSegments(this.rayBufferGeometry, new P.LineBasicMaterial({
			fog: !1,
			color: 2631977,
			transparent: !0,
			opacity: .2,
			premultipliedAlpha: !0,
			blending: P.NormalBlending,
			depthFunc: P.AlwaysDepth,
			name: "raytracer-rays-material"
		})), this.rays.renderOrder = -.5, this.rays.frustumCulled = !1, u.scene.add(this.rays);
		var i = new P.ShaderMaterial({
			fog: !1,
			vertexShader: F.vs,
			fragmentShader: F.fs,
			transparent: !0,
			premultipliedAlpha: !0,
			uniforms: {
				drawStyle: { value: De.ENERGY },
				inverted: { value: 0 },
				pointScale: { value: this._pointSize }
			},
			blending: P.NormalBlending,
			name: "raytracer-points-material"
		});
		this.hits = new P.Points(this.rayBufferGeometry, i), this.hits.frustumCulled = !1, u.scene.add(this.hits), this.rayPositionIndex = 0, Object.defineProperty(this.raycaster, "firstHitOnly", {
			value: !0,
			writable: !0
		}), this.intersections = [], this.findIDs(), this.intersectableObjects = [], this.paths = e.paths || L.paths, this.stats = {
			numRaysShot: {
				name: "# of rays shot",
				value: 0
			},
			numValidRayPaths: {
				name: "# of valid rays",
				value: 0
			}
		}, u.overlays.global.addCell("Valid Rays", this.validRayCount, {
			id: this.uuid + "-valid-ray-count",
			hidden: !0,
			formatter: (e) => String(e)
		}), this.messageHandlerIDs = [], l.postMessage("STATS_SETUP", this.stats), this.messageHandlerIDs.push(l.addMessageHandler("RAYTRACER_SOURCE_CHANGE", (e, ...t) => {
			console.log(t && t[0] && t[0] instanceof Array && t[1] && t[1] === this.uuid), t && t[0] && t[0] instanceof Array && t[1] && t[1] === this.uuid && (this.sourceIDs = t[0].map((e) => e.id));
		})), this.messageHandlerIDs.push(l.addMessageHandler("RAYTRACER_RECEIVER_CHANGE", (e, ...t) => {
			t && t[0] && t[0] instanceof Array && t[1] && t[1] === this.uuid && (this.receiverIDs = t[0].map((e) => e.id));
		})), this.messageHandlerIDs.push(l.addMessageHandler("SHOULD_REMOVE_CONTAINER", (e, ...t) => {
			let n = t[0];
			n && (console.log(n), this.sourceIDs.includes(n) ? this.sourceIDs = this.sourceIDs.filter((e) => e != n) : this.receiverIDs.includes(n) && (this.receiverIDs = this.receiverIDs.filter((e) => e != n)));
		})), this.step = this.step.bind(this), this.calculateImpulseResponse = this.calculateImpulseResponse.bind(this);
	}
	update = () => {};
	get temperature() {
		return this.room?.temperature ?? 20;
	}
	get c() {
		return se(this.temperature);
	}
	save() {
		let { name: e, kind: t, uuid: n, autoCalculate: r, roomID: i, sourceIDs: a, surfaceIDs: o, receiverIDs: s, updateInterval: c, passes: l, pointSize: u, reflectionOrder: d, runningWithoutReceivers: f, raysVisible: p, pointsVisible: m, invertedDrawStyle: h, plotStyle: g, paths: _, frequencies: v, convergenceThreshold: y, autoStop: b, rrThreshold: x, maxStoredPaths: S, edgeDiffractionEnabled: C, lateReverbTailEnabled: w, tailCrossfadeTime: T, tailCrossfadeDuration: E, gpuEnabled: ee, gpuBatchSize: D, hrtfSubjectId: te, headYaw: O, headPitch: k, headRoll: A } = this;
		return {
			name: e,
			kind: t,
			uuid: n,
			autoCalculate: r,
			roomID: i,
			sourceIDs: a,
			surfaceIDs: o,
			receiverIDs: s,
			updateInterval: c,
			passes: l,
			pointSize: u,
			reflectionOrder: d,
			runningWithoutReceivers: f,
			raysVisible: p,
			pointsVisible: m,
			invertedDrawStyle: h,
			plotStyle: g,
			paths: _,
			frequencies: v,
			convergenceThreshold: y,
			autoStop: b,
			rrThreshold: x,
			maxStoredPaths: S,
			edgeDiffractionEnabled: C,
			lateReverbTailEnabled: w,
			tailCrossfadeTime: T,
			tailCrossfadeDuration: E,
			gpuEnabled: ee,
			gpuBatchSize: D,
			hrtfSubjectId: te,
			headYaw: O,
			headPitch: k,
			headRoll: A
		};
	}
	removeMessageHandlers() {
		this.messageHandlerIDs.forEach((e) => {
			l.removeMessageHandler(e[0], e[1]);
		});
	}
	dispose() {
		this._isRunning && (this._isRunning = !1, this._gpuRunning = !1, cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => window.clearInterval(e)), this.intervals = []), this._disposeGpu(), this.removeMessageHandlers(), Object.keys(window.vars).forEach((e) => {
			window.vars[e].uuid === this.uuid && delete window.vars[e];
		}), u.scene.remove(this.rays), u.scene.remove(this.hits);
	}
	addSource(e) {
		f.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
	}
	addReceiver(e) {
		f.getState().containers[e.uuid] = e, this.findIDs(), this.mapIntersectableObjects();
	}
	mapIntersectableObjects() {
		let e = [];
		this.room.surfaces.traverse((t) => {
			t.kind && t.kind === "surface" && e.push(t.mesh);
		}), this.intersectableObjects = this.runningWithoutReceivers ? e : e.concat(this.receivers);
	}
	findIDs() {
		this.sourceIDs = [], this.receiverIDs = [], this.surfaceIDs = [];
		for (let e in f.getState().containers) f.getState().containers[e].kind === "room" ? this.roomID = e : f.getState().containers[e].kind === "source" ? this.sourceIDs.push(e) : f.getState().containers[e].kind === "receiver" ? this.receiverIDs.push(e) : f.getState().containers[e].kind === "surface" && this.surfaceIDs.push(e);
		this.mapIntersectableObjects();
	}
	setDrawStyle(e) {
		this.hits.material.uniforms.drawStyle.value = e, this.hits.material.needsUpdate = !0, u.needsToRender = !0;
	}
	setPointScale(e) {
		this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0, u.needsToRender = !0;
	}
	incrementRayPositionIndex() {
		return this.rayPositionIndex < this.maxrays ? this.rayPositionIndex++ : (this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !0, this.rayPositionIndex);
	}
	rayPositionIndexDidOverflow = !1;
	appendRay(e, t, n = 1, r = 1) {
		this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), e[0], e[1], e[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, n, r), this.rayBufferAttribute.setXYZ(this.incrementRayPositionIndex(), t[0], t[1], t[2]), this.colorBufferAttribute.setXY(this.rayPositionIndex, n, r), this.rayBufferGeometry.setDrawRange(0, this.rayPositionIndexDidOverflow ? this.maxrays : this.rayPositionIndex);
	}
	flushRayBuffer() {
		this.rayBufferAttribute.needsUpdate = !0, this.rayBufferAttribute.version++, this.colorBufferAttribute.needsUpdate = !0, this.colorBufferAttribute.version++;
	}
	inFrontOf(e, t) {
		return ze(e, t);
	}
	traceRay(e, t, n, r, i, a, o, s = 1, c = []) {
		return Be(this.raycaster, this.intersectableObjects, this.frequencies, this._cachedAirAtt, this.rrThreshold, e, t, n, r, i, a, o, s, c);
	}
	startQuickEstimate(e = this.frequencies, t = 1e3) {
		let n = this.runningWithoutReceivers;
		this.runningWithoutReceivers = !0;
		let r = 0;
		this.quickEstimateResults = {}, this.sourceIDs.forEach((e) => {
			this.quickEstimateResults[e] = [];
		}), this.intervals.push(window.setInterval(() => {
			for (let n = 0; n < this.passes; n++, r++) for (let n = 0; n < this.sourceIDs.length; n++) {
				let r = this.sourceIDs[n], i = f.getState().containers[r];
				this.quickEstimateResults[r].push(this.quickEstimateStep(i, e, t));
			}
			r >= t ? (this.intervals.forEach((e) => window.clearInterval(e)), this.runningWithoutReceivers = n, console.log(this.quickEstimateResults)) : console.log((r / t * 100).toFixed(1) + "%");
		}, this.updateInterval));
	}
	quickEstimateStep(e, t, n) {
		let r = ne(this.raycaster, this.intersectableObjects, e.position, e.initialIntensity, t, this.temperature);
		return this.stats.numRaysShot.value++, r;
	}
	startAllMonteCarlo() {
		this._lastConvergenceCheck = Date.now(), this._rafId &&= (cancelAnimationFrame(this._rafId), 0);
		let e = () => {
			if (!this._isRunning) return;
			let t = performance.now();
			do
				this.stepStratified(this.passes);
			while (performance.now() - t < 12);
			this.flushRayBuffer(), u.needsToRender = !0;
			let n = Date.now();
			if (this.autoStop && n - this._lastConvergenceCheck >= this._convergenceCheckInterval && (this._lastConvergenceCheck = n, this._updateConvergenceMetrics(), this.convergenceMetrics.convergenceRatio < this.convergenceThreshold && this.convergenceMetrics.t30Count >= 3)) {
				this.isRunning = !1;
				return;
			}
			this._rafId = requestAnimationFrame(e);
		};
		this._rafId = requestAnimationFrame(e);
	}
	stepStratified(e) {
		if (e <= 0) return;
		let t = Math.floor(Math.sqrt(e));
		for (; t > 1 && e % t !== 0;) t--;
		let n = e / t;
		for (let e = 0; e < this.sourceIDs.length; e++) {
			let r = f.getState().containers[this.sourceIDs[e]], i = r.phi, a = r.theta, o = r.position, s = r.rotation, c = r.directivityHandler;
			this._directivityRefPressures ||= /* @__PURE__ */ new Map();
			let l = this.sourceIDs[e], u = this._directivityRefPressures.get(l);
			if (!u || u.length !== this.frequencies.length) {
				u = Array(this.frequencies.length);
				for (let e = 0; e < this.frequencies.length; e++) u[e] = c.getPressureAtPosition(0, this.frequencies[e], 0, 0);
				this._directivityRefPressures.set(l, u);
			}
			for (let e = 0; e < t; e++) for (let r = 0; r < n; r++) {
				this.__num_checked_paths += 1;
				let d = (e + Math.random()) / t * i, f = (r + Math.random()) / n * a, p = N(d, f), m = new P.Vector3().setFromSphericalCoords(1, p[0], p[1]);
				m.applyEuler(s);
				let h = Array(this.frequencies.length);
				for (let e = 0; e < this.frequencies.length; e++) {
					let t = 1;
					try {
						let n = c.getPressureAtPosition(0, this.frequencies[e], d, f), r = u[e];
						typeof n == "number" && typeof r == "number" && r > 0 && (t = (n / r) ** 2);
					} catch {}
					h[e] = t;
				}
				let g = this.traceRay(o, m, this.reflectionOrder, h, l, d, f);
				g && this._handleTracedPath(g, o, l), this.stats.numRaysShot.value++;
			}
		}
	}
	_handleTracedPath(e, t, n) {
		if (this._runningWithoutReceivers) {
			this.appendRay([
				t.x,
				t.y,
				t.z
			], e.chain[0].point, e.chain[0].energy || 1, e.chain[0].angle);
			for (let t = 1; t < e.chain.length; t++) this.appendRay(e.chain[t - 1].point, e.chain[t].point, e.chain[t].energy || 1, e.chain[t].angle);
			let r = e.chain[e.chain.length - 1].object;
			this._pushPathWithEviction(r, e), f.getState().containers[n].numRays += 1;
		} else if (e.intersectedReceiver) {
			this.appendRay([
				t.x,
				t.y,
				t.z
			], e.chain[0].point, e.chain[0].energy || 1, e.chain[0].angle);
			for (let t = 1; t < e.chain.length; t++) this.appendRay(e.chain[t - 1].point, e.chain[t].point, e.chain[t].energy || 1, e.chain[t].angle);
			this.stats.numValidRayPaths.value++, this.validRayCount += 1, u.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
			let r = e.chain[e.chain.length - 1].object;
			this._pushPathWithEviction(r, e), f.getState().containers[n].numRays += 1, this._addToEnergyHistogram(r, e);
		}
	}
	_pushPathWithEviction(e, t) {
		Xe(t, this.c);
		let n = Math.max(1, this.maxStoredPaths | 0);
		if (!this.paths[e]) {
			this.paths[e] = [t];
			return;
		}
		let r = this.paths[e];
		if (r.length >= n) {
			let e = r.length - n + 1;
			e > 0 && r.splice(0, e);
		}
		r.push(t);
	}
	_addToEnergyHistogram(e, t) {
		yt(this._energyHistogram, e, t, this.frequencies, this.c, this._histogramBinWidth, this._histogramNumBins);
	}
	step() {
		for (let e = 0; e < this.sourceIDs.length; e++) {
			this.__num_checked_paths += 1;
			let t = Math.random() * f.getState().containers[this.sourceIDs[e]].theta, n = Math.random() * f.getState().containers[this.sourceIDs[e]].phi, r = f.getState().containers[this.sourceIDs[e]].position, i = f.getState().containers[this.sourceIDs[e]].rotation, a = N(n, t), o = new P.Vector3().setFromSphericalCoords(1, a[0], a[1]);
			o.applyEuler(i);
			let s = f.getState().containers[this.sourceIDs[e]].directivityHandler;
			this._directivityRefPressures ||= /* @__PURE__ */ new Map();
			let c = this.sourceIDs[e], l = this._directivityRefPressures.get(c);
			if (!l || l.length !== this.frequencies.length) {
				l = Array(this.frequencies.length);
				for (let e = 0; e < this.frequencies.length; e++) l[e] = s.getPressureAtPosition(0, this.frequencies[e], 0, 0);
				this._directivityRefPressures.set(c, l);
			}
			let d = Array(this.frequencies.length);
			for (let e = 0; e < this.frequencies.length; e++) {
				let r = 1;
				try {
					let i = s.getPressureAtPosition(0, this.frequencies[e], n, t), a = l[e];
					typeof i == "number" && typeof a == "number" && a > 0 && (r = (i / a) ** 2);
				} catch {}
				d[e] = r;
			}
			let p = this.traceRay(r, o, this.reflectionOrder, d, this.sourceIDs[e], n, t);
			if (p) {
				if (this._runningWithoutReceivers) {
					this.appendRay([
						r.x,
						r.y,
						r.z
					], p.chain[0].point, p.chain[0].energy || 1, p.chain[0].angle);
					for (let e = 1; e < p.chain.length; e++) this.appendRay(p.chain[e - 1].point, p.chain[e].point, p.chain[e].energy || 1, p.chain[e].angle);
					let t = p.chain[p.chain.length - 1].object;
					this._pushPathWithEviction(t, p), f.getState().containers[this.sourceIDs[e]].numRays += 1;
				} else if (p.intersectedReceiver) {
					this.appendRay([
						r.x,
						r.y,
						r.z
					], p.chain[0].point, p.chain[0].energy || 1, p.chain[0].angle);
					for (let e = 1; e < p.chain.length; e++) this.appendRay(p.chain[e - 1].point, p.chain[e].point, p.chain[e].energy || 1, p.chain[e].angle);
					this.stats.numValidRayPaths.value++, this.validRayCount += 1, u.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount);
					let t = p.chain[p.chain.length - 1].object;
					this._pushPathWithEviction(t, p), f.getState().containers[this.sourceIDs[e]].numRays += 1;
				}
			}
			this.stats.numRaysShot.value++;
		}
	}
	_resetConvergenceState() {
		let e = _t(this.frequencies.length);
		this.convergenceMetrics = e.convergenceMetrics, this._energyHistogram = e.energyHistogram, this._lastConvergenceCheck = e.lastConvergenceCheck;
	}
	_updateConvergenceMetrics() {
		vt(this.convergenceMetrics, this._energyHistogram, this.frequencies, this.receiverIDs, this.__num_checked_paths, this.validRayCount, this._histogramBinWidth, this._histogramNumBins, this.uuid);
	}
	start() {
		this._isRunning = !0, this._cachedAirAtt = M(this.frequencies, this.temperature), this.mapIntersectableObjects(), this._edgeGraph = this.edgeDiffractionEnabled && this.room ? O(this.room.allSurfaces) : null, this.__start_time = Date.now(), this.__num_checked_paths = 0, this._resetConvergenceState(), this.gpuEnabled ? this._startGpuMonteCarlo() : this.startAllMonteCarlo();
	}
	stop() {
		this._isRunning = !1, this.__calc_time = Date.now() - this.__start_time, this._gpuRunning = !1, this._gpuRayTracer && setTimeout(() => this._disposeGpu(), 0), cancelAnimationFrame(this._rafId), this._rafId = 0, this.intervals.forEach((e) => {
			window.clearInterval(e);
		}), this.intervals = [], Object.keys(this.paths).forEach((e) => {
			let t = this.__calc_time / 1e3, n = this.paths[e].length, r = n / t, i = this.__num_checked_paths, a = i / t;
			console.log({
				calc_time: t,
				num_valid_rays: n,
				valid_ray_rate: r,
				num_checks: i,
				check_rate: a
			}), this.paths[e].forEach((e) => {
				e.time = 0, e.totalLength = 0;
				for (let t = 0; t < e.chain.length; t++) e.totalLength += e.chain[t].distance, e.time += e.chain[t].distance / this.c;
			});
		}), this.edgeDiffractionEnabled && this._edgeGraph && this._edgeGraph.edges.length > 0 && this._computeDiffractionPaths(), this.mapIntersectableObjects(), this.reportImpulseResponse();
	}
	_computeDiffractionPaths() {
		if (!this._edgeGraph) return;
		let e = f.getState().containers, t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
		for (let r of this.sourceIDs) {
			let i = e[r];
			if (i) {
				t.set(r, [
					i.position.x,
					i.position.y,
					i.position.z
				]);
				let e = i.directivityHandler, a = Array(this.frequencies.length);
				for (let t = 0; t < this.frequencies.length; t++) a[t] = e.getPressureAtPosition(0, this.frequencies[t], 0, 0);
				n.set(r, {
					handler: e,
					refPressures: a,
					quaternion: i.quaternion.clone()
				});
			}
		}
		let r = /* @__PURE__ */ new Map();
		for (let t of this.receiverIDs) {
			let n = e[t];
			n && r.set(t, [
				n.position.x,
				n.position.y,
				n.position.z
			]);
		}
		let i = [];
		this.room.surfaces.traverse((e) => {
			e.kind && e.kind === "surface" && i.push(e.mesh);
		});
		let a = ie(this._edgeGraph, t, r, this.frequencies, this.c, this.temperature, this.raycaster, i);
		for (let e of a) {
			let i = n.get(e.sourceId);
			if (i) {
				let n = t.get(e.sourceId), r = new P.Vector3(e.diffractionPoint[0] - n[0], e.diffractionPoint[1] - n[1], e.diffractionPoint[2] - n[2]), [a, o] = _e(r, i.quaternion);
				for (let t = 0; t < this.frequencies.length; t++) try {
					let n = i.handler.getPressureAtPosition(0, this.frequencies[t], a, o), r = i.refPressures[t];
					typeof n == "number" && typeof r == "number" && r > 0 && (e.bandEnergy[t] *= (n / r) ** 2);
				} catch {}
			}
			let a = e.bandEnergy.reduce((e, t) => e + t, 0) / e.bandEnergy.length, o = r.get(e.receiverId), s = o[0] - e.diffractionPoint[0], c = o[1] - e.diffractionPoint[1], l = o[2] - e.diffractionPoint[2], u = Math.sqrt(s * s + c * c + l * l), d = u > 1e-10 ? [
				s / u,
				c / u,
				l / u
			] : [
				0,
				0,
				1
			], f = t.get(e.sourceId), p = Math.sqrt((e.diffractionPoint[0] - f[0]) ** 2 + (e.diffractionPoint[1] - f[1]) ** 2 + (e.diffractionPoint[2] - f[2]) ** 2), m = e.totalDistance - p, h = {
				intersectedReceiver: !0,
				chain: [{
					distance: p,
					point: e.diffractionPoint,
					object: e.edge.surface0Id,
					faceNormal: e.edge.normal0,
					faceIndex: -1,
					faceMaterialIndex: -1,
					angle: 0,
					energy: a,
					bandEnergy: e.bandEnergy
				}, {
					distance: m,
					point: o,
					object: e.receiverId,
					faceNormal: [
						0,
						0,
						0
					],
					faceIndex: -1,
					faceMaterialIndex: -1,
					angle: 0,
					energy: a,
					bandEnergy: e.bandEnergy
				}],
				chainLength: 2,
				energy: a,
				bandEnergy: e.bandEnergy,
				time: e.time,
				source: e.sourceId,
				initialPhi: 0,
				initialTheta: 0,
				totalLength: e.totalDistance,
				arrivalDirection: d
			};
			this._pushPathWithEviction(e.receiverId, h);
		}
	}
	async reportImpulseResponse() {
		if (this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
		let e = f.getState().containers, t = _.sampleRate, n = [];
		for (let e of this.sourceIDs) for (let t of this.receiverIDs) {
			if (!this.paths[t] || this.paths[t].length === 0) continue;
			let r = this.paths[t].filter((t) => t.source === e);
			r.length > 0 && n.push({
				sourceId: e,
				receiverId: t,
				paths: r
			});
		}
		if (n.length !== 0) {
			c("SHOW_PROGRESS", {
				message: "Calculating impulse response...",
				progress: 0,
				solverUuid: this.uuid
			});
			for (let r = 0; r < n.length; r++) {
				let { sourceId: i, receiverId: a, paths: o } = n[r], s = e[i]?.name || "Source", l = e[a]?.name || "Receiver", u = Math.round(r / n.length * 100);
				c("UPDATE_PROGRESS", {
					progress: u,
					message: `Calculating IR: ${s} → ${l}`
				});
				try {
					let { normalizedSignal: e } = await this.calculateImpulseResponseForPair(i, a, o);
					i === this.sourceIDs[0] && a === this.receiverIDs[0] && this.calculateImpulseResponse().then((e) => {
						this.impulseResponse = e;
					}).catch(console.error);
					let n = Ee, r = Math.max(1, Math.floor(e.length / n)), u = [];
					for (let n = 0; n < e.length; n += r) u.push({
						time: n / t,
						amplitude: e[n]
					});
					let f = `${this.uuid}-ir-${i}-${a}`, m = d.getState().results[f], h = {
						kind: p.ImpulseResponse,
						name: `IR: ${s} → ${l}`,
						uuid: f,
						from: this.uuid,
						info: {
							sampleRate: t,
							sourceName: s,
							receiverName: l,
							sourceId: i,
							receiverId: a
						},
						data: u
					};
					m ? c("UPDATE_RESULT", {
						uuid: f,
						result: h
					}) : c("ADD_RESULT", h);
				} catch (e) {
					console.error(`Failed to calculate impulse response for ${i} -> ${a}:`, e);
				}
			}
			c("HIDE_PROGRESS", void 0);
		}
	}
	async calculateImpulseResponseForPair(e, t, n, r = 100, i = this.frequencies, a = _.sampleRate) {
		let o;
		return this.lateReverbTailEnabled && this._energyHistogram[t] && (o = {
			energyHistogram: this._energyHistogram[t],
			crossfadeTime: this.tailCrossfadeTime,
			crossfadeDuration: this.tailCrossfadeDuration,
			histogramBinWidth: this._histogramBinWidth,
			frequencies: i
		}), Ge(e, t, n, r, i, this.temperature, a, o);
	}
	async calculateImpulseResponseForDisplay(e = 100, t = this.frequencies, n = _.sampleRate, r) {
		let i = G(this.receiverIDs, this.paths, r), a;
		return this.lateReverbTailEnabled && this._energyHistogram[i] && (a = {
			energyHistogram: this._energyHistogram[i],
			crossfadeTime: this.tailCrossfadeTime,
			crossfadeDuration: this.tailCrossfadeDuration,
			histogramBinWidth: this._histogramBinWidth,
			frequencies: t
		}), Ke(this.receiverIDs, this.sourceIDs, this.paths, e, t, this.temperature, n, a, i);
	}
	clearRays() {
		if (this.room) for (let e = 0; e < this.room.allSurfaces.length; e++) this.room.allSurfaces[e].resetHits();
		this.validRayCount = 0, u.overlays.global.setCellValue(this.uuid + "-valid-ray-count", this.validRayCount), this.rayBufferGeometry.setDrawRange(0, 1), this.rayPositionIndex = 0, this.rayPositionIndexDidOverflow = !1, this.stats.numRaysShot.value = 0, this.stats.numValidRayPaths.value = 0, l.postMessage("STATS_UPDATE", this.stats), this.sourceIDs.forEach((e) => {
			f.getState().containers[e].numRays = 0;
		}), this.paths = {}, this.mapIntersectableObjects(), u.needsToRender = !0, this.impulseResponse = void 0, this.clearImpulseResponseResults();
	}
	clearImpulseResponseResults() {
		let e = d.getState().results;
		Object.keys(e).forEach((t) => {
			let n = e[t];
			n.from === this.uuid && n.kind === p.ImpulseResponse && c("REMOVE_RESULT", t);
		});
	}
	reflectionLossFunction(e, t, n) {
		return K(e, t, n);
	}
	calculateReflectionLoss(e = this.frequencies) {
		let [t, n] = Qe(this.paths, this.room, this.receiverIDs, e);
		return this.allReceiverData = t, this.chartdata = n, [this.allReceiverData, n];
	}
	getReceiverIntersectionPoints(e) {
		return this.paths && this.paths[e] && this.paths[e].length > 0 ? this.paths[e].map((e) => new P.Vector3().fromArray(e.chain[e.chain.length - 1].point)) : [];
	}
	calculateResponseByIntensity(e = this.frequencies, t = this.temperature) {
		let n = $e(this.indexedPaths, this.receiverIDs, this.sourceIDs, e, t, this.intensitySampleRate);
		return n && (this.responseByIntensity = n), this.responseByIntensity;
	}
	resampleResponseByIntensity(e = this.intensitySampleRate) {
		if (this.responseByIntensity) {
			let t = E(this.responseByIntensity, e);
			return t && (this.responseByIntensity = t), this.responseByIntensity;
		}
		console.warn("no data yet");
	}
	calculateT30(e, t) {
		if (this.responseByIntensity) {
			let n = e ? [e] : this.receiverIDs, r = t ? [t] : this.sourceIDs;
			for (let e of n) for (let t of r) this.responseByIntensity[e]?.[t] && te(this.responseByIntensity, e, t);
		}
		return this.responseByIntensity;
	}
	calculateT20(e, t) {
		if (this.responseByIntensity) {
			let n = e ? [e] : this.receiverIDs, r = t ? [t] : this.sourceIDs;
			for (let e of n) for (let t of r) this.responseByIntensity[e]?.[t] && A(this.responseByIntensity, e, t);
		}
		return this.responseByIntensity;
	}
	calculateT60(e, t) {
		if (this.responseByIntensity) {
			let n = e ? [e] : this.receiverIDs, r = t ? [t] : this.sourceIDs;
			for (let e of n) for (let t of r) this.responseByIntensity[e]?.[t] && ee(this.responseByIntensity, e, t);
		}
		return this.responseByIntensity;
	}
	onParameterConfigFocus() {
		console.log("focus"), console.log(u.overlays.global.cells), u.overlays.global.showCell(this.uuid + "-valid-ray-count");
	}
	onParameterConfigBlur() {
		console.log("blur"), u.overlays.global.hideCell(this.uuid + "-valid-ray-count");
	}
	pathsToLinearBuffer() {
		return it(this.paths);
	}
	linearBufferToPaths(e) {
		return at(e);
	}
	arrivalPressure(e, t, n, r = 1) {
		return W(e, t, n, r, this.temperature);
	}
	async calculateImpulseResponse(e = 100, t = this.frequencies, n = _.sampleRate, r) {
		if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
		let i = G(this.receiverIDs, this.paths, r), a = this.paths[i], o = a.slice().sort((e, t) => e.time - t.time), s = o, c = o[o.length - 1].time + I, l = Array(t.length).fill(e), u = Z(n * c) * 2, d = [];
		for (let e = 0; e < t.length; e++) d.push(new Float32Array(u));
		if (this.hybrid) {
			console.log("Hybrid Calculation..."), s = Je(a, this.transitionOrder);
			let e = {
				name: "HybridHelperIS",
				roomID: this.roomID,
				sourceIDs: this.sourceIDs,
				surfaceIDs: this.surfaceIDs,
				receiverIDs: this.receiverIDs,
				maxReflectionOrder: this.transitionOrder,
				imageSourcesVisible: !1,
				rayPathsVisible: !1,
				plotOrders: Array.from({ length: this.transitionOrder + 1 }, (e, t) => t),
				frequencies: this.frequencies
			}, r = Ye(new ve(e, !0).returnSortedPathsForHybrid(this.c, l, t), this.transitionOrder);
			for (let e = 0; e < r.length; e++) {
				let i = r[e].time, a = Z(i * n);
				for (let n = 0; n < t.length; n++) d[n][a] += r[e].pressure[n];
			}
		}
		let p = f.getState().containers[i];
		for (let e = 0; e < s.length; e++) {
			let r = Lt() ? 1 : -1, i = s[e].time, a = s[e].arrivalDirection || [
				0,
				0,
				1
			], o = p.getGain(a), c = this.arrivalPressure(l, t, s[e], o).map((e) => e * r), u = Z(i * n);
			for (let e = 0; e < t.length; e++) d[e][u] += c[e];
		}
		if (this.lateReverbTailEnabled && this._energyHistogram[i]) {
			let e = D(this._energyHistogram[i], t, this.tailCrossfadeTime, this._histogramBinWidth), { tailSamples: r, tailStartSample: a } = j(e, n), o = Z(this.tailCrossfadeDuration * n);
			d = C(d, r, a, o);
			let s = d.reduce((e, t) => Math.max(e, t.length), 0) * 2;
			for (let e = 0; e < t.length; e++) if (d[e].length < s) {
				let t = new Float32Array(s);
				t.set(d[e]), d[e] = t;
			}
		}
		let m = X();
		return new Promise((e, t) => {
			m.postMessage({ samples: d }), m.onmessage = (r) => {
				let i = r.data.samples, a = new Float32Array(i[0].length >> 1), o = 0;
				for (let e = 0; e < i.length; e++) for (let t = 0; t < a.length; t++) a[t] += i[e][t], Q(a[t]) > o && (o = Q(a[t]));
				let s = R(a), c = _.createOfflineContext(1, a.length, n), l = _.createBufferSource(s, c);
				l.connect(c.destination), l.start(), _.renderContextAsync(c).then((t) => e(t)).catch(t).finally(() => m.terminate());
			};
		});
	}
	async calculateAmbisonicImpulseResponse(e = 1, t = 100, n = this.frequencies, r = _.sampleRate, i) {
		if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
		let a = G(this.receiverIDs, this.paths, i), o = this.paths[a].slice().sort((e, t) => e.time - t.time);
		if (o.length === 0) throw Error("No valid ray paths found");
		let s = o[o.length - 1].time + I;
		if (s <= 0) throw Error("Invalid impulse response duration");
		let c = Array(n.length).fill(t), l = Z(r * s) * 2;
		if (l < 2) throw Error("Impulse response too short to process");
		let u = T(e), d = [];
		for (let e = 0; e < n.length; e++) {
			d.push([]);
			for (let t = 0; t < u; t++) d[e].push(new Float32Array(l));
		}
		let p = f.getState().containers[a];
		for (let t = 0; t < o.length; t++) {
			let i = o[t], a = Lt() ? 1 : -1, s = i.time, f = i.arrivalDirection || [
				0,
				0,
				1
			], m = p.getGain(f), h = this.arrivalPressure(c, n, i, m).map((e) => e * a), g = Z(s * r);
			if (g >= l) continue;
			let _ = /* @__PURE__ */ new Float32Array(1);
			for (let t = 0; t < n.length; t++) {
				_[0] = h[t];
				let n = w(_, f[0], f[1], f[2], e, "threejs");
				for (let e = 0; e < u; e++) d[t][e][g] += n[e][0];
			}
		}
		if (this.lateReverbTailEnabled && this._energyHistogram[a]) {
			let e = D(this._energyHistogram[a], n, this.tailCrossfadeTime, this._histogramBinWidth), t = Z(this.tailCrossfadeDuration * r);
			re(d, e, r, t);
			let i = 0;
			for (let e = 0; e < n.length; e++) for (let t = 0; t < u; t++) d[e][t].length > i && (i = d[e][t].length);
			let o = i * 2;
			for (let e = 0; e < n.length; e++) for (let t = 0; t < u; t++) if (d[e][t].length < o) {
				let n = new Float32Array(o);
				n.set(d[e][t]), d[e][t] = n;
			}
		}
		let m = X();
		return new Promise((e, t) => {
			let i = async (e) => new Promise((t) => {
				let r = [];
				for (let t = 0; t < n.length; t++) r.push(d[t][e]);
				let i = X();
				i.postMessage({ samples: r }), i.onmessage = (e) => {
					let n = e.data.samples, r = new Float32Array(n[0].length >> 1);
					for (let e = 0; e < n.length; e++) for (let t = 0; t < r.length; t++) r[t] += n[e][t];
					i.terminate(), t(r);
				};
			});
			Promise.all(Array.from({ length: u }, (e, t) => i(t))).then((n) => {
				let i = 0;
				for (let e of n) for (let t = 0; t < e.length; t++) Q(e[t]) > i && (i = Q(e[t]));
				if (i > 0) for (let e of n) for (let t = 0; t < e.length; t++) e[t] /= i;
				let a = n[0].length;
				if (a === 0) {
					m.terminate(), t(/* @__PURE__ */ Error("Filtered signal has zero length"));
					return;
				}
				let o = _.createOfflineContext(u, a, r).createBuffer(u, a, r);
				for (let e = 0; e < u; e++) o.copyToChannel(new Float32Array(n[e]), e);
				m.terminate(), e(o);
			}).catch(t);
		});
	}
	ambisonicImpulseResponse;
	ambisonicOrder = 1;
	impulseResponse;
	impulseResponsePlaying = !1;
	async playImpulseResponse(e) {
		let t = await ft(this.impulseResponse, () => this.calculateImpulseResponse(void 0, void 0, void 0, e), this.uuid);
		this.impulseResponse = t.impulseResponse;
	}
	downloadImpulses(e, t = 100, n = m(125, 8e3), r = 44100) {
		dt(this.paths, this.receiverIDs, this.sourceIDs, (e, t, n, r) => this.arrivalPressure(e, t, n, r), e, t, n, r);
	}
	async downloadImpulseResponse(e, t = _.sampleRate, n) {
		let r = await pt(this.impulseResponse, () => this.calculateImpulseResponse(void 0, void 0, void 0, n), e, t);
		this.impulseResponse = r.impulseResponse;
	}
	async downloadAmbisonicImpulseResponse(e, t = 1, n) {
		let r = await mt(this.ambisonicImpulseResponse, (e) => this.calculateAmbisonicImpulseResponse(e, void 0, void 0, void 0, n), this.ambisonicOrder, t, e);
		this.ambisonicImpulseResponse = r.ambisonicImpulseResponse, this.ambisonicOrder = r.ambisonicOrder;
	}
	async calculateBinauralImpulseResponse(e = 1, t) {
		return (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e, void 0, void 0, void 0, t), this.ambisonicOrder = e), this.binauralImpulseResponse = await k({
			ambisonicImpulseResponse: this.ambisonicImpulseResponse,
			order: e,
			hrtfSubjectId: this.hrtfSubjectId,
			headYaw: this.headYaw,
			headPitch: this.headPitch,
			headRoll: this.headRoll
		}), this.binauralImpulseResponse;
	}
	async playBinauralImpulseResponse(e = 1) {
		let t = await ht(this.binauralImpulseResponse, () => this.calculateBinauralImpulseResponse(e), this.uuid);
		this.binauralImpulseResponse = t.binauralImpulseResponse;
	}
	async downloadBinauralImpulseResponse(e, t = 1) {
		let n = await gt(this.binauralImpulseResponse, () => this.calculateBinauralImpulseResponse(t), e);
		this.binauralImpulseResponse = n.binauralImpulseResponse;
	}
	async _initGpu() {
		if (!ue()) return console.warn("[GPU RT] WebGPU not available in this browser"), !1;
		let e = null;
		try {
			return e = new Pt(), !await e.initialize(this.room, this.receiverIDs, {
				reflectionOrder: this.reflectionOrder,
				frequencies: this.frequencies,
				cachedAirAtt: this._cachedAirAtt,
				rrThreshold: this.rrThreshold
			}, this.gpuBatchSize) || !this._gpuRunning ? (e.dispose(), !1) : (this._gpuRayTracer = e, !0);
		} catch (t) {
			return console.error("[GPU RT] Initialization failed:", t), e && e.dispose(), !1;
		}
	}
	_startGpuMonteCarlo() {
		cancelAnimationFrame(this._rafId), this._rafId = 0, this._gpuRunning = !0, this._lastConvergenceCheck = Date.now();
		let e = Math.min(this.frequencies.length, 7);
		if (this.frequencies.length > 7) {
			console.warn(`[GPU RT] ${this.frequencies.length} frequency bands exceeds GPU limit of 7; falling back to CPU`), this._gpuRunning = !1, this.startAllMonteCarlo();
			return;
		}
		this._initGpu().then((t) => {
			if (!t || !this._gpuRunning) {
				this._gpuRunning && (console.warn("[GPU RT] Falling back to CPU ray tracing"), this._gpuRunning = !1, this.startAllMonteCarlo());
				return;
			}
			let n = this._gpuRayTracer.effectiveBatchSize, r = new Float32Array(n * 16), i = async () => {
				if (!(!this._gpuRunning || !this._isRunning || !this._gpuRayTracer)) try {
					if (!Number.isFinite(this.gpuBatchSize) || this.gpuBatchSize <= 0) {
						console.warn("[GPU RT] Invalid gpuBatchSize, falling back to CPU"), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
						return;
					}
					let t = Math.min(Math.floor(this.gpuBatchSize), n), a = 0;
					for (let n = 0; n < this.sourceIDs.length && a < t; n++) {
						let i = f.getState().containers[this.sourceIDs[n]], o = i.position, s = i.rotation, c = i.phi, l = i.theta, u = i.directivityHandler, d = this.sourceIDs[n];
						this._directivityRefPressures ||= /* @__PURE__ */ new Map();
						let p = this._directivityRefPressures.get(d);
						if (!p || p.length !== this.frequencies.length) {
							p = Array(this.frequencies.length);
							for (let e = 0; e < this.frequencies.length; e++) p[e] = u.getPressureAtPosition(0, this.frequencies[e], 0, 0);
							this._directivityRefPressures.set(d, p);
						}
						let m = Math.max(1, Math.floor(t / this.sourceIDs.length)), h = new P.Vector3();
						for (let n = 0; n < m && a < t; n++) {
							let t = Math.random() * c, n = Math.random() * l, i = N(t, n);
							h.setFromSphericalCoords(1, i[0], i[1]), h.applyEuler(s);
							let d = a * 16;
							r[d] = o.x, r[d + 1] = o.y, r[d + 2] = o.z, r[d + 3] = h.x, r[d + 4] = h.y, r[d + 5] = h.z, r[d + 6] = t, r[d + 7] = n;
							for (let i = 0; i < e; i++) {
								let e = 1;
								try {
									let r = u.getPressureAtPosition(0, this.frequencies[i], t, n), a = p[i];
									typeof r == "number" && typeof a == "number" && a > 0 && (e = (r / a) ** 2);
								} catch {}
								r[d + 8 + i] = e;
							}
							a++;
						}
					}
					let o = a, s = Math.floor(Math.random() * 4294967295), c = await this._gpuRayTracer.traceBatch(r, o, s);
					this.__num_checked_paths += o, this.stats.numRaysShot.value += o;
					let l = Math.max(1, Math.floor(o / Math.max(1, this.sourceIDs.length)));
					for (let e = 0; e < c.length; e++) {
						let t = c[e];
						if (!t) continue;
						let n = Math.min(Math.floor(e / Math.max(1, l)), this.sourceIDs.length - 1), r = this.sourceIDs[n], i = f.getState().containers[r].position;
						t.source = r, this._handleTracedPath(t, i, r);
					}
					this.flushRayBuffer(), u.needsToRender = !0;
					let d = Date.now();
					if (this.autoStop && d - this._lastConvergenceCheck >= this._convergenceCheckInterval && (this._lastConvergenceCheck = d, this._updateConvergenceMetrics(), this.convergenceMetrics.convergenceRatio < this.convergenceThreshold && this.convergenceMetrics.t30Count >= 3)) {
						this.isRunning = !1;
						return;
					}
					this._gpuRunning && this._isRunning && (this._rafId = requestAnimationFrame(() => {
						i();
					}));
				} catch (e) {
					console.error("[GPU RT] Batch error, falling back to CPU:", e), this._gpuRunning = !1, this._disposeGpu(), this.startAllMonteCarlo();
				}
			};
			this._rafId = requestAnimationFrame(() => {
				i();
			});
		});
	}
	_disposeGpu() {
		this._gpuRayTracer &&= (this._gpuRayTracer.dispose(), null);
	}
	get sources() {
		return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => f.getState().containers[e]) : [];
	}
	get receivers() {
		return this.receiverIDs.length > 0 && Object.keys(f.getState().containers).length > 0 ? this.receiverIDs.map((e) => f.getState().containers[e].mesh) : [];
	}
	get room() {
		return f.getState().containers[this.roomID];
	}
	get precheck() {
		return this.sourceIDs.length > 0 && this.room !== void 0;
	}
	get indexedPaths() {
		let e = {};
		for (let t in this.paths) {
			e[t] = {};
			for (let n = 0; n < this.paths[t].length; n++) {
				let r = this.paths[t][n].source;
				e[t][r] ? e[t][r].push(this.paths[t][n]) : e[t][r] = [this.paths[t][n]];
			}
		}
		return e;
	}
	get isRunning() {
		return this.running;
	}
	set isRunning(e) {
		e && this.findIDs(), this.running = this.precheck && e, this.running ? this.start() : this.stop();
	}
	get raysVisible() {
		return this._raysVisible;
	}
	set raysVisible(e) {
		e != this._raysVisible && (this._raysVisible = e, this.rays.visible = e), u.needsToRender = !0;
	}
	get pointsVisible() {
		return this._pointsVisible;
	}
	set pointsVisible(e) {
		e != this._pointsVisible && (this._pointsVisible = e, this.hits.visible = e), u.needsToRender = !0;
	}
	get invertedDrawStyle() {
		return this._invertedDrawStyle;
	}
	set invertedDrawStyle(e) {
		this._invertedDrawStyle != e && (this._invertedDrawStyle = e, this.hits.material.uniforms.inverted.value = Number(e), this.hits.material.needsUpdate = !0), u.needsToRender = !0;
	}
	get pointSize() {
		return this._pointSize;
	}
	set pointSize(e) {
		Number.isFinite(e) && e > 0 && (this._pointSize = e, this.hits.material.uniforms.pointScale.value = this._pointSize, this.hits.material.needsUpdate = !0), u.needsToRender = !0;
	}
	get runningWithoutReceivers() {
		return this._runningWithoutReceivers;
	}
	set runningWithoutReceivers(e) {
		this.mapIntersectableObjects(), this._runningWithoutReceivers = e;
	}
};
t("RAYTRACER_CALL_METHOD", a), t("RAYTRACER_SET_PROPERTY", o), t("REMOVE_RAYTRACER", e), t("ADD_RAYTRACER", i($)), t("RAYTRACER_CLEAR_RAYS", (e) => void n.getState().solvers[e].clearRays()), t("RAYTRACER_PLAY_IR", (e) => {
	n.getState().solvers[e].playImpulseResponse().catch((e) => {
		window.alert(e.message || "Failed to play impulse response");
	});
}), t("RAYTRACER_DOWNLOAD_IR", (e) => {
	let t = n.getState().solvers[e], r = f.getState().containers, i = `ir-${t.sourceIDs.length > 0 && r[t.sourceIDs[0]]?.name || "source"}-${t.receiverIDs.length > 0 && r[t.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	t.downloadImpulseResponse(i).catch((e) => {
		window.alert(e.message || "Failed to download impulse response");
	});
}), t("RAYTRACER_DOWNLOAD_IR_OCTAVE", (e) => void n.getState().solvers[e].downloadImpulses(e)), t("RAYTRACER_DOWNLOAD_AMBISONIC_IR", ({ uuid: e, order: t }) => {
	let r = n.getState().solvers[e], i = f.getState().containers, a = `ir-${r.sourceIDs.length > 0 && i[r.sourceIDs[0]]?.name || "source"}-${r.receiverIDs.length > 0 && i[r.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	r.downloadAmbisonicImpulseResponse(a, t).catch((e) => {
		window.alert(e.message || "Failed to download ambisonic impulse response");
	});
}), t("RAYTRACER_PLAY_BINAURAL_IR", ({ uuid: e, order: t }) => {
	n.getState().solvers[e].playBinauralImpulseResponse(t).catch((e) => {
		window.alert(e.message || "Failed to play binaural impulse response");
	});
}), t("RAYTRACER_DOWNLOAD_BINAURAL_IR", ({ uuid: e, order: t }) => {
	let r = n.getState().solvers[e], i = f.getState().containers, a = `ir-${r.sourceIDs.length > 0 && i[r.sourceIDs[0]]?.name || "source"}-${r.receiverIDs.length > 0 && i[r.receiverIDs[0]]?.name || "receiver"}`.replace(/[^a-zA-Z0-9-_]/g, "_");
	r.downloadBinauralImpulseResponse(a, t).catch((e) => {
		window.alert(e.message || "Failed to download binaural impulse response");
	});
});
//#endregion
export { $ as default };

//# sourceMappingURL=raytracer-B-vWgrWF.mjs.map