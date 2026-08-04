import { BufferGeometry as e, Color as t, Float32BufferAttribute as n, Vector2 as r, Vector3 as i } from "three";
//#region src/compute/radiance/TessellateModifier.ts
var a = class {
	maxEdgeLength;
	maxIterations;
	constructor(e = .1, t = 6) {
		this.maxEdgeLength = e, this.maxIterations = t;
	}
	modify(a) {
		if (a.isGeometry === !0) return console.error("THREE.TessellateModifier no longer supports Geometry. Use BufferGeometry instead."), a;
		a.index !== null && (a = a.toNonIndexed());
		let o = this.maxIterations, s = this.maxEdgeLength * this.maxEdgeLength, c = new i(), l = new i(), u = new i(), d = new i(), f = [
			c,
			l,
			u,
			d
		], p = new i(), m = new i(), h = new i(), g = new i(), _ = [
			p,
			m,
			h,
			g
		], v = new t(), y = new t(), b = new t(), x = new t(), S = [
			v,
			y,
			b,
			x
		], C = new r(), w = new r(), T = new r(), E = new r(), D = [
			C,
			w,
			T,
			E
		], O = new r(), k = new r(), A = new r(), j = new r(), M = [
			O,
			k,
			A,
			j
		], N = a.attributes, P = N.normal !== void 0, F = N.color !== void 0, I = N.uv !== void 0, L = N.uv2 !== void 0, R = Array.from(N.position.array), z = P ? Array.from(N.normal.array) : null, B = F ? Array.from(N.color.array) : null, V = I ? Array.from(N.uv.array) : null, H = L ? Array.from(N.uv2.array) : null, U = R, W = z, G = B, K = V, q = H, J = 0, Y = !0;
		function X(e, t, n) {
			let r = f[e], i = f[t], a = f[n];
			if (U.push(r.x, r.y, r.z), U.push(i.x, i.y, i.z), U.push(a.x, a.y, a.z), P) {
				let r = _[e], i = _[t], a = _[n];
				W.push(r.x, r.y, r.z), W.push(i.x, i.y, i.z), W.push(a.x, a.y, a.z);
			}
			if (F) {
				let r = S[e], i = S[t], a = S[n];
				G.push(r.x, r.y, r.z), G.push(i.x, i.y, i.z), G.push(a.x, a.y, a.z);
			}
			if (I) {
				let r = D[e], i = D[t], a = D[n];
				K.push(r.x, r.y), K.push(i.x, i.y), K.push(a.x, a.y);
			}
			if (L) {
				let r = M[e], i = M[t], a = M[n];
				q.push(r.x, r.y), q.push(i.x, i.y), q.push(a.x, a.y);
			}
		}
		for (; Y && J < o;) {
			J++, Y = !1, R = U, U = [], P && (z = W, W = []), F && (B = G, G = []), I && (V = K, K = []), L && (H = q, q = []);
			for (let e = 0, t = 0, n = R.length; e < n; e += 9, t += 6) {
				c.fromArray(R, e + 0), l.fromArray(R, e + 3), u.fromArray(R, e + 6), P && (p.fromArray(z, e + 0), m.fromArray(z, e + 3), h.fromArray(z, e + 6)), F && (v.fromArray(B, e + 0), y.fromArray(B, e + 3), b.fromArray(B, e + 6)), I && (C.fromArray(V, t + 0), w.fromArray(V, t + 2), T.fromArray(V, t + 4)), L && (O.fromArray(H, t + 0), k.fromArray(H, t + 2), A.fromArray(H, t + 4));
				let n = c.distanceToSquared(l), r = l.distanceToSquared(u), i = c.distanceToSquared(u);
				n > s || r > s || i > s ? (Y = !0, n >= r && n >= i ? (d.lerpVectors(c, l, .5), P && g.lerpVectors(p, m, .5), F && x.lerpColors(v, y, .5), I && E.lerpVectors(C, w, .5), L && j.lerpVectors(O, k, .5), X(0, 3, 2), X(3, 1, 2)) : r >= n && r >= i ? (d.lerpVectors(l, u, .5), P && g.lerpVectors(m, h, .5), F && x.lerpColors(y, b, .5), I && E.lerpVectors(w, T, .5), L && j.lerpVectors(k, A, .5), X(0, 1, 3), X(3, 2, 0)) : (d.lerpVectors(c, u, .5), P && g.lerpVectors(p, h, .5), F && x.lerpColors(v, b, .5), I && E.lerpVectors(C, T, .5), L && j.lerpVectors(O, A, .5), X(0, 1, 3), X(3, 1, 2))) : X(0, 1, 2);
			}
		}
		let Z = new e();
		return Z.setAttribute("position", new n(U, 3)), P && Z.setAttribute("normal", new n(W, 3)), F && Z.setAttribute("color", new n(G, 3)), I && Z.setAttribute("uv", new n(K, 2)), L && Z.setAttribute("uv2", new n(q, 2)), Z;
	}
};
//#endregion
export { a as t };

//# sourceMappingURL=TessellateModifier-DlSgA920.mjs.map