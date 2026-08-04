import { D as e, E as t, O as n, T as r, b as i, c as a, d as o, g as s, h as c, k as l, o as u, p as d, t as f, v as p, w as m } from "./FileSaver.min-BS9rdHrk.mjs";
import { create as h } from "zustand";
import "zustand/react/shallow";
//#region src/store/container-store.ts
c();
var g = (e) => {
	let t = Object.keys(e);
	if (t.length > 0) {
		let n = e[t[0]];
		for (; n.parent && !n.userData.hasOwnProperty("isWorkspace");) n = n.parent;
		return n;
	}
	return null;
}, _ = (e) => Object.keys(e).filter((t) => e[t].kind === "room"), v = (e) => _(e).map((t) => e[t]), y = h((e, t) => ({
	containers: {},
	selectedObjects: /* @__PURE__ */ new Set(),
	version: 0,
	set: (t) => e(s(t)),
	getWorkspace: () => g(t().containers),
	getRooms: () => v(t().containers)
})), b = (e) => (t) => {
	let n = t || new e();
	y.setState((e) => ({
		...e,
		containers: {
			...e.containers,
			[n.uuid]: n
		}
	}), !0), p("MARK_DIRTY", void 0);
}, x = (e) => {
	y.getState().containers[e] && (y.getState().containers[e].dispose(), y.getState().set((t) => {
		t.selectedObjects.delete(y.getState().containers[e]);
	}), y.setState((t) => ({
		...t,
		containers: d([e], t.containers)
	}), !0), p("MARK_DIRTY", void 0));
}, S = ({ uuid: e, property: t, value: n }) => {
	let r = y.getState().containers[e];
	r && (r[t] = n), y.getState().set((e) => {
		e.version++;
	}), p("RENDER", void 0), p("MARK_DIRTY", void 0);
}, C = ({ uuid: e, method: t, args: n = [] }) => {
	t && y.getState().set((r) => {
		r.containers[e][t](...n);
	});
}, w = () => Object.keys(y.getState().containers), T = () => {
	let { containers: e, selectedObjects: t } = y.getState();
	Object.values(e).forEach((e) => {
		try {
			e.dispose();
		} catch (e) {
			console.warn("[ContainerStore] Error disposing container:", e);
		}
	}), t.clear(), y.setState({
		containers: {},
		selectedObjects: /* @__PURE__ */ new Set(),
		version: 0
	}), console.log("[ContainerStore] Reset complete");
}, E = /* @__PURE__ */ m(((e, t) => {
	t.exports = {
		Other: 0,
		CR: 1,
		LF: 2,
		Control: 4,
		Extend: 8,
		ZWJ: 16,
		Regional_Indicator: 32,
		Prepend: 64,
		SpacingMark: 128,
		L: 256,
		V: 512,
		T: 1024,
		LV: 2048,
		LVT: 4096,
		Extended_Pictographic: 8192,
		InCB_Linker: 16384,
		InCB_Consonant: 32768,
		InCB_Extend: 65536
	};
})), D = /* @__PURE__ */ t({
	data: () => O,
	default: () => k
}), O, k, A = r((() => {
	O = "ABAOAAAAAADQjQAAAd4HIfjtnG2oFUUYxx/1nHu29OolvKRSZIIQghSSEFJwwj4YWdzoFcoQyriBHwz8YHDBiSKDLG9YKSEiUX4IFQ0FCaRLoFmUb9mLBqJ+EDOIsAgpjf7b7nCnOTO7M7szu8frPPBjZufleZ6ZeWZm73pwYALRk2ApGAQMvC6UlU2HwUbwDthk0P5DsC2jfifYC0bAQXAE/AhOgXNCu1/A7+ASoAZRD5gMekE/mAFmge1gN9jbSPrOSdPPkM4DX4AvwVFwApwBZ8EFcBH8Bf4GE5pEUXP0uQ/5ac2k/UyktzWT/ncgPYj0rmZip91M6hc1R/U/hPzj4BnwPBgECwT7cb8VKFsZJflVyK9O9cW8gvwb6fM6pO+l+c1It4Lt4Hah/R7k94H94BuhPGZDNMqWlK1gf4rYNovthu1c8x3G8xOYmhKXnUH6c5pf0/h/+8Uo/1Wagz+bev1X0rpGD9GkniS/FjRTvVNRdiO4BcwGc8H8tN3dabqwp1Pv/Sh7WFHOGU4pOz9vws/1qa+PCuXxGHZmjDtQAdL6n1DEgAs7NwnrvCQj5gKBQCAQCAQCgUAgEOgGnsPfrlOE7zlvG3y/WI4+K4W/eYciotVgCGWv8u85SNeDjVHyPXAj8tORbknrtyLdAT5Jnz9Fehnp5zl/S3+F+kPQeRgcAUfBMfAtOB6FulAX6kJdqHNdtwPsAQei+u+sQCAwdjnk+d9TNk0Y/Xd1mUFFmfh+vKHhxycbRnoTaDLR0t582mg3oGg7LJWN4JmmoD1YNSUp24b0NJjWR3QnGAT3TcT7Pzh7HdGt1xNF4xKeFvIiu9D25ER1nczqVMeMSUS7kX8M6bvgMKBeMx2BQCAQGJv8gXuhEd8nLaJ/cB+2cCdPaiW/E2ojvyi9oyOkN6B8Df5mmZbW34x0QLjDZ7eS707i/Rr/ZmRua/R3ZPORv6eV1C2MU/R/MP1O9gCeH2mN9n0K+Wdb+rt7EHUrhPpVreS7GH9mQt1ryL+VoWt9Rl3MEuhdJr2vvI8+H4CPwQuo25XqeLHAe81ewf4I8gckf77G80up3uM5voqcRNuX0e800vMW/XwyBH7rEl9EZiC2n6jQ3masyxzY/EHxnXjeVfptIP797rAAkxjO4KNGZ/trjTJz/33O33rTpXPpVBf+1u4cfLqg8Wuxo9+Dnk/1XzQc/6W03RWhrD+dSzI4x+K/eS914Xnnisvp2MY7OrP2ldAToe86MFnQ0X+VnqU2xOfnrCh5f3Oha0GUpPciXQQGrqY5hK9LBX+nK/aebaweS8+AZSXnIa9/v4MzTh7b2jH6O/rlJdfiZBeMoUFmjBfy4wz7mBCkPgnz7y6Oq4x/l+sWXeO4lKrsdJvUvYZF111MdfmxLm0NpmI7591853Tj+VJVDGaNoZ3TRtahautDRL/qkm6KlW6Wa2EeXI3N5Ry0SX+e26xJ27K9K5iijNJyjvwsnllZ4mKeZbuy72I5F5VvNr6o+hcVbredoVc3/y7vN/keke0ywS6T6tqOfOE2mQKS8rJ/3A8mpHWfZVl7qq0oV0lbQ9m9bOszt+lb5LWsU8TxN8j9+LnOPnL3Pc73tz4X31fy7mVdDObZcnHfdev3VNV86ebRtF1VUsSui7U0OQ/rEvE8Jsp+j1H5Lbfnecrpa+Nf1XEi2mZUz/qIe4b7oJtDXi8/m85bN69HJOXr2i9Z+0PVVuW36n5x6V8Z/Yw640s+t5nQlpGfOPAdX2XPI5d+iP6wDJ8YFdvfRc/bOkR31jKpXHx2eb7J91kd7yaMOseb9w6Vp7PO9YyFUWeMM6pvfC7mhBXoI78z1SnyfDPLvqoyRp1nmNieZeAqRlUxV+Ssz3vvdSWm/paJ87ruuipsyTGmssfI3X4zWSMVTFNOlD1PNjbK+OeKsmI6b/J4mdTWp+TZ8jkfRXXEwgz0lPXZx9z7PruqOhdNYlqMZR2qeHe1N33OQdYYVeWyiG3l/rKeKteS2/UhXDdP885CMaWcPqbzaBJTOt1ViqnPjOqJmSzxcbfWtQ6iMNLPv6tx5om8fxh1niUu/GA5mMalq3lQnQ+25PmtspnlDxdRrwupaw/7WCvb9VLpynrWlbkURp17zrcPjNT7rSopsr9cnX95+861PRN/bM8Y1/YZmd0//Fmnp0oxvRvk5yJ2TNqwArpdiY+Y4Kk8b1nzWGSOGZnFF29nK1ynHAuiraK6XUudPlRh2+ZM1d3xJnp9S9H3Op2OKu4Xn7qrfn9gVO+Za3oe6vrq7vWq3z24Py6Fkf59Qjd2VzZ0dnXC62x89iGi7xwuumebc8ZUZFum81BlvKoka+19+cLIPGZU7fizT3GlP29+xfEwKa864+oUk3OCkXp9maJtFeLaJqNisctTG9HFRh13XZaoxmd6T7sWRuZz5Ssus3zgIseI2F7WVbWYzFsVsWZzT5veHWVE1qWaj7w4cyWma6TyMW8cTJP37bvchqQ6Gx+YAlkfL/exPqIt0b5r4brz5lPVzqfo9GfZLRrTNmMx1cfIz5z5Pkd9ntfyvilCnv6y/tr2q+ouM/WhbPyX2UNFdPqSqs6pLLuucWXLZAw24/UlOt9dzqELn1z5Zrtv8uz6EF82ZlaEK2FU7vtpXcIsydJRhbCa+e8/D60bUcbXTMMzfRK24nKssvgYr+x71lh8iO/1tBl/LPGlIseAT6q2J8m/", k = { data: O };
})), j = /* @__PURE__ */ t({
	data: () => M,
	default: () => N
}), M, N, P = r((() => {
	M = "AAACAAAAAACAOAAAAbYBSf7t2S1IBEEYBuDVDZ7FYrQMNsFiu3hgEYOI0SCXRIUrB8JhEZtgs5gEg1GMFk02m82oGI02m+9xezCOczv/uwv3fvAwc/PzfXOzcdqzWdaBDdiGPdiHdjE+DS3RNDuCfsn8idQ/g3OH3BdwKf0e96/gumTfYcncLdzBPTzAo+RZ+f0Cr/AG7/AJX4738x1wtz9FO5PX/50n6UXMNdfg/0lERERERERERERERETpdedHBvDRql4nq0cXtW9af98qdRby0Vvp8K4W0V+C5Xw0t4J2bfjeBp3cnEu1brnnCTYNa7eKdz91XP7WO9Lb4GqRb7cY6xbtAdqeVOsY/QGcevw/tb6OT85YhvfKYEx9CMuxKsKnrs+eJtVInVvHJ0eVYVvTZk2siFVLOCjb61PTZX3MdVWEyP7fjzpmMxdzTyq2Ebue6x61nXRGnzndWpf1an7dXmGYE4Y1ptqqKsK1nu26Ju0ty+maV2Rpvk+qnDZjKUIobUiesdAQE/jmCTmHmsskpFZsVYbtmXRcaoSGUPomunW2derQhDPFjtT1Q/eb8vnm990fq35oHVt11bU9m89c7DNI8Qs=", N = { data: M };
})), F = /* @__PURE__ */ t({
	data: () => I,
	default: () => L
}), I, L, ee = r((() => {
	I = "AAgOAAAAAABQfgAAAWMGnPntmm2IVUUYx+dyb2ezXXtBiSCLsKDIiKIIoYINciGwQHrRL2Ufii0qMsv7QVBuQkXhkmW5gksQRhRFSBslbkllHyy3L2XllkXrB3uhF0tQ0Kj+xzN3d3buzJx5PeesOw/8mDNvz/PMnOc8s/fs6asTcgu4A9wF+mjdV9kEa8FqsE5j/DPgeUX/JvASeBW8Bd4GO8CHYDcz7nPwFRgD4+An8Cf4AxwBx0G9QcjrYBt4p5HN/YDqGEF9F7gW3AC6wU1gCVgK5oDlYA8YBXvBGOgHD4FzwSo6fg24EDwBxsEB8Cu1N4ByI1gA/gbfo+0wyuO0vgW8DK5i+tN5tVOyMmUWrs9k6nNxPY/WL0B5Mb2+HOU14HrwY2Ny/CLUbwa3gzsZPT7ZGECnDvdiPQ+ARyhpWxPlWnr9JLfeAdS/43S8qNiTIdq3FeUb9HolOEj7h9H2LtgJPgHr0TZKx31Jy30C/T+g7aDCbpPiuj/fStrTNfQGioWIHr9z+z8iiAEfdg4zdo7Gex6JRCKRSCQSiUQikYrzL367HmLq8zV+yyYJIbOTzva5aJtH2y9CuYBebwdX4PoYyv107ELUe5PsPWBavzHJ3tMtFuhluTWnPxKJRCKRSCQy/TjQCKt/XX3y/+o6HPJs35XNszPO0WQf+FnQfsnpU+vLUN8MdgNyRtZ2Ncp7wBDYDn4D47MIOes0QpaADeDUWsYe5pql3k3IZd3iPp4H6bjnUI6Cf8B1PYQ0wWCPno5IJBKJnJx83eN2fi7NeYd0jKsvr+A7p3749KzkXd2Ap+9R7qfrflhz/ava45m2I7Rcw+lI3/WtAO+Bx5PsG6+nk+xbv7Q/fWe4gc7ZRPu3oNzK6Hktmfy2r036vc82On44yb4ZHKFzPkL5aZJ9f9hH7Y8y+nbheq9irWOpf0z/L8nUWPmL6TuK6/8Uuhpd6r3sRv8cbszZXZm981HOB5fS/itzdIlYyMzpTa85HYtRv422LTPQ/yjd+/SZudvCr1DcV5Iv6W+HFRXaB988Rte2ugJrHKTPW4vx5akK+MWzvoI++Sb9zvKFriy/m8wbwpxXQL/gDNs5Tb+zTPfiza6sHEa5A3w8jWLgM/j6BePvoOBcM33+v6Hj9zvuQ978lR5ihl/bedM0DvN4vwI+NOvy7/SbCkze51WVRfXaCaJEmdlSm+H4lKLsVE3Kvoe2950tZdcnu5T1rISQKuaHovZNZw26/aKxvn0tS6oUG1WWmbAPvtbGjzPU2WvgV4uoEc7PkQ77MhHoYu1K7YvOVhv7uuJ7/QpdLcKtX2ZPthc1A/tEcK/zbAW+/0rbnqRVAlPuk0gC5b5cv1Q+BbIp8kGnX2VjQmT7bLm/Hfp1RfZ3kAdpGZI3h2iMnZCC47ftj+351WJ06PTLxk6I7OxxWH8rd4RCRHHuKC1DbOaIdJyQAn4vuPpqS8d5HVJUfy+p2lXjihIbuya/L2wowkae3TJEZFfmjywnBshRSl9s9Je1v7z9kL7bPE9Fi+xMlf09Z3Ne2KxNFu8qf2x02ojMD9McrpOLivTX9j6F9l/HfmgbotKnfp9nJCHqffFho0hcxWRNhHTarUI8h94PGx28Pp2xrrZ8SehcFToPhvabvbZ5JkXx4etZd4lZfn0+pIz8oMoRunpsbPgUUZ4NaYu1qcr9vC+2MWsa8yHOPlOxfU7L9Fnkg0t+0dGdZ9O38PGr6nPxwzRWXUX0/JmSN09kU+WPyD8f4jM+ioo7lW1femzuv0iXqi5r8yGq/fBts+gca/M8+orLvOc0RJ7P88c0J/m2L/OFbzfVa5LrXc4WH2NsbJrulcsafa+T99lFVwgpwr7JMy47U3T0FiFF56uQuss4j3gfbOb68sUlB6vOjaLPtrbdkLp9nZmqffcpqnurk4NU+oq8rzIx2Xddv8tel+peydar+htBpIufH0J4O2XFCCu2z0GZayjyDMzLS6Z+yGK1Sjmk7RNbtq91zrXQfumeOb58MdGTtxdlngmyc09nTlmxqfMcmvij67OJXV3R3dOQsZznh6qfkOL80M3BuvtW1B7yY2R+FLG/MsnzVXd+aF9VuUk1xzWudPwy1edzz1x8t9UfyndbHTY2yxTdHOCa92zj3CR+Te6fjzX5Ftf9M/E1VC4yzVehROa77/h09cmXb6Zxm2c3pPjSH9bn/wE=", L = { data: I };
})), te = /* @__PURE__ */ m(((e, t) => {
	function n() {
		this.table = /* @__PURE__ */ new Uint16Array(16), this.trans = /* @__PURE__ */ new Uint16Array(288);
	}
	function r(e, t) {
		this.source = e, this.sourceIndex = 0, this.tag = 0, this.bitcount = 0, this.dest = t, this.destLen = 0, this.ltree = new n(), this.dtree = new n();
	}
	var i = new n(), a = new n(), o = /* @__PURE__ */ new Uint8Array(30), s = /* @__PURE__ */ new Uint16Array(30), c = /* @__PURE__ */ new Uint8Array(30), l = /* @__PURE__ */ new Uint16Array(30), u = new Uint8Array([
		16,
		17,
		18,
		0,
		8,
		7,
		9,
		6,
		10,
		5,
		11,
		4,
		12,
		3,
		13,
		2,
		14,
		1,
		15
	]), d = new n(), f = /* @__PURE__ */ new Uint8Array(320);
	function p(e, t, n, r) {
		var i, a;
		for (i = 0; i < n; ++i) e[i] = 0;
		for (i = 0; i < 30 - n; ++i) e[i + n] = i / n | 0;
		for (a = r, i = 0; i < 30; ++i) t[i] = a, a += 1 << e[i];
	}
	function m(e, t) {
		var n;
		for (n = 0; n < 7; ++n) e.table[n] = 0;
		for (e.table[7] = 24, e.table[8] = 152, e.table[9] = 112, n = 0; n < 24; ++n) e.trans[n] = 256 + n;
		for (n = 0; n < 144; ++n) e.trans[24 + n] = n;
		for (n = 0; n < 8; ++n) e.trans[168 + n] = 280 + n;
		for (n = 0; n < 112; ++n) e.trans[176 + n] = 144 + n;
		for (n = 0; n < 5; ++n) t.table[n] = 0;
		for (t.table[5] = 32, n = 0; n < 32; ++n) t.trans[n] = n;
	}
	var h = /* @__PURE__ */ new Uint16Array(16);
	function g(e, t, n, r) {
		var i, a;
		for (i = 0; i < 16; ++i) e.table[i] = 0;
		for (i = 0; i < r; ++i) e.table[t[n + i]]++;
		for (e.table[0] = 0, a = 0, i = 0; i < 16; ++i) h[i] = a, a += e.table[i];
		for (i = 0; i < r; ++i) t[n + i] && (e.trans[h[t[n + i]]++] = i);
	}
	function _(e) {
		e.bitcount-- || (e.tag = e.source[e.sourceIndex++], e.bitcount = 7);
		var t = e.tag & 1;
		return e.tag >>>= 1, t;
	}
	function v(e, t, n) {
		if (!t) return n;
		for (; e.bitcount < 24;) e.tag |= e.source[e.sourceIndex++] << e.bitcount, e.bitcount += 8;
		var r = e.tag & 65535 >>> 16 - t;
		return e.tag >>>= t, e.bitcount -= t, r + n;
	}
	function y(e, t) {
		for (; e.bitcount < 24;) e.tag |= e.source[e.sourceIndex++] << e.bitcount, e.bitcount += 8;
		var n = 0, r = 0, i = 0, a = e.tag;
		do
			r = 2 * r + (a & 1), a >>>= 1, ++i, n += t.table[i], r -= t.table[i];
		while (r >= 0);
		return e.tag = a, e.bitcount -= i, t.trans[n + r];
	}
	function b(e, t, n) {
		var r = v(e, 5, 257), i = v(e, 5, 1), a = v(e, 4, 4), o, s, c;
		for (o = 0; o < 19; ++o) f[o] = 0;
		for (o = 0; o < a; ++o) {
			var l = v(e, 3, 0);
			f[u[o]] = l;
		}
		for (g(d, f, 0, 19), s = 0; s < r + i;) {
			var p = y(e, d);
			switch (p) {
				case 16:
					var m = f[s - 1];
					for (c = v(e, 2, 3); c; --c) f[s++] = m;
					break;
				case 17:
					for (c = v(e, 3, 3); c; --c) f[s++] = 0;
					break;
				case 18:
					for (c = v(e, 7, 11); c; --c) f[s++] = 0;
					break;
				default: f[s++] = p;
			}
		}
		g(t, f, 0, r), g(n, f, r, i);
	}
	function x(e, t, n) {
		for (;;) {
			var r = y(e, t);
			if (r === 256) return 0;
			if (r < 256) e.dest[e.destLen++] = r;
			else {
				var i, a, u, d;
				for (r -= 257, i = v(e, o[r], s[r]), a = y(e, n), u = e.destLen - v(e, c[a], l[a]), d = u; d < u + i; ++d) e.dest[e.destLen++] = e.dest[d];
			}
		}
	}
	function S(e) {
		for (var t, n, r; e.bitcount > 8;) e.sourceIndex--, e.bitcount -= 8;
		if (t = e.source[e.sourceIndex + 1], t = 256 * t + e.source[e.sourceIndex], n = e.source[e.sourceIndex + 3], n = 256 * n + e.source[e.sourceIndex + 2], t !== (~n & 65535)) return -3;
		for (e.sourceIndex += 4, r = t; r; --r) e.dest[e.destLen++] = e.source[e.sourceIndex++];
		return e.bitcount = 0, 0;
	}
	function C(e, t) {
		var n = new r(e, t), o, s, c;
		do {
			switch (o = _(n), s = v(n, 2, 0), s) {
				case 0:
					c = S(n);
					break;
				case 1:
					c = x(n, i, a);
					break;
				case 2:
					b(n, n.ltree, n.dtree), c = x(n, n.ltree, n.dtree);
					break;
				default: c = -3;
			}
			if (c !== 0) throw Error("Data error");
		} while (!o);
		return n.destLen < n.dest.length ? typeof n.dest.slice == "function" ? n.dest.slice(0, n.destLen) : n.dest.subarray(0, n.destLen) : n.dest;
	}
	m(i, a), p(o, s, 4, 3), p(c, l, 2, 1), o[28] = 0, s[28] = 258, t.exports = C;
})), R = /* @__PURE__ */ m(((e, t) => {
	var n = new Uint8Array(new Uint32Array([305419896]).buffer)[0] === 18, r = (e, t, n) => {
		let r = e[t];
		e[t] = e[n], e[n] = r;
	}, i = (e) => {
		let t = e.length;
		for (let n = 0; n < t; n += 4) r(e, n, n + 3), r(e, n + 1, n + 2);
	};
	t.exports = { swap32LE: (e) => {
		n && i(e);
	} };
})), ne = /* @__PURE__ */ m(((e, t) => {
	var n = te(), { swap32LE: r } = R(), i = 11, a = 5, o = 63, s = 2, c = 31, l = 2048, u = 4;
	t.exports = class {
		constructor(e) {
			let t = typeof e.readUInt32BE == "function" && typeof e.slice == "function";
			if (t || e instanceof Uint8Array) {
				let i;
				if (t) this.highStart = e.readUInt32LE(0), this.errorValue = e.readUInt32LE(4), i = e.readUInt32LE(8), e = e.slice(12);
				else {
					let t = new DataView(e.buffer);
					this.highStart = t.getUint32(0, !0), this.errorValue = t.getUint32(4, !0), i = t.getUint32(8, !0), e = e.subarray(12);
				}
				e = n(e, new Uint8Array(i)), e = n(e, new Uint8Array(i)), r(e), this.data = new Uint32Array(e.buffer);
			} else ({data: this.data, highStart: this.highStart, errorValue: this.errorValue} = e);
		}
		get(e) {
			let t;
			return e < 0 || e > 1114111 ? this.errorValue : e < 55296 || e > 56319 && e <= 65535 ? (t = (this.data[e >> a] << s) + (e & c), this.data[t]) : e <= 65535 ? (t = (this.data[l + (e - 55296 >> a)] << s) + (e & c), this.data[t]) : e < this.highStart ? (t = this.data[2080 + (e >> i)], t = this.data[t + (e >> a & o)], t = (t << s) + (e & c), this.data[t]) : this.data[this.data.length - u];
		}
	};
})), re = /* @__PURE__ */ m(((e, t) => {
	(function(n, r) {
		typeof e == "object" && t !== void 0 ? r(e) : typeof define == "function" && define.amd ? define(["exports"], r) : (n = typeof globalThis < "u" ? globalThis : n || self, (function() {
			var e = n.Base64, t = n.Base64 = {};
			r(t), t.noConflict = function() {
				return n.Base64 = e, t;
			};
		})());
	})(e, (function(e) {
		var t = "3.9.2", n = t, r = typeof TextDecoder == "function" ? new TextDecoder("utf-8", { ignoreBOM: !0 }) : void 0, i = typeof TextEncoder == "function" ? new TextEncoder() : void 0, a = Array.prototype.slice.call("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="), o = (function(e) {
			var t = {};
			return e.forEach(function(e, n) {
				return t[e] = n;
			}), t;
		})(a), s = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/, c = String.fromCharCode.bind(String), l = typeof Uint8Array.from == "function" ? Uint8Array.from.bind(Uint8Array) : function(e) {
			return new Uint8Array(Array.prototype.slice.call(e, 0));
		}, u = function(e) {
			return e.replace(/=/g, "").replace(/[+\/]/g, function(e) {
				return e == "+" ? "-" : "_";
			});
		}, d = function(e) {
			return e.replace(/[^A-Za-z0-9\+\/]/g, "");
		}, f = function(e) {
			for (var t, n, r, i, o = "", s = e.length % 3, c = 0; c < e.length;) {
				if ((n = e.charCodeAt(c++)) > 255 || (r = e.charCodeAt(c++)) > 255 || (i = e.charCodeAt(c++)) > 255) throw TypeError("invalid character found");
				t = n << 16 | r << 8 | i, o += a[t >> 18 & 63] + a[t >> 12 & 63] + a[t >> 6 & 63] + a[t & 63];
			}
			return s ? o.slice(0, s - 3) + "===".substring(s) : o;
		}, p = typeof btoa == "function" ? function(e) {
			return btoa(e);
		} : f, m = typeof Uint8Array.prototype.toBase64 == "function" ? function(e) {
			return e.toBase64();
		} : function(e) {
			for (var t = 4096, n = [], r = 0, i = e.length; r < i; r += t) n.push(c.apply(null, e.subarray(r, r + t)));
			return p(n.join(""));
		}, h = function(e, t) {
			return t === void 0 && (t = !1), t ? u(m(e)) : m(e);
		}, g = function(e) {
			if (e.length < 2) {
				var t = e.charCodeAt(0);
				return t < 128 ? e : t < 2048 ? c(192 | t >>> 6) + c(128 | t & 63) : c(224 | t >>> 12 & 15) + c(128 | t >>> 6 & 63) + c(128 | t & 63);
			}
			var t = 65536 + (e.charCodeAt(0) - 55296) * 1024 + (e.charCodeAt(1) - 56320);
			return c(240 | t >>> 18 & 7) + c(128 | t >>> 12 & 63) + c(128 | t >>> 6 & 63) + c(128 | t & 63);
		}, _ = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, v = function(e) {
			return e.replace(_, g);
		}, y = i ? function(e) {
			return m(i.encode(e));
		} : function(e) {
			return p(v(e));
		}, b = function(e, t) {
			return t === void 0 && (t = !1), t ? u(y(e)) : y(e);
		}, x = function(e) {
			return b(e, !0);
		}, S = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g, C = function(e) {
			switch (e.length) {
				case 4:
					var t = ((7 & e.charCodeAt(0)) << 18 | (63 & e.charCodeAt(1)) << 12 | (63 & e.charCodeAt(2)) << 6 | 63 & e.charCodeAt(3)) - 65536;
					return c((t >>> 10) + 55296) + c((t & 1023) + 56320);
				case 3: return c((15 & e.charCodeAt(0)) << 12 | (63 & e.charCodeAt(1)) << 6 | 63 & e.charCodeAt(2));
				default: return c((31 & e.charCodeAt(0)) << 6 | 63 & e.charCodeAt(1));
			}
		}, w = function(e) {
			return e.replace(S, C);
		}, T = function(e) {
			if (e = e.replace(/\s+/g, ""), !s.test(e)) throw TypeError("malformed base64.");
			e += "==".slice(2 - (e.length & 3));
			for (var t, n, r, i = [], a = 0; a < e.length;) t = o[e.charAt(a++)] << 18 | o[e.charAt(a++)] << 12 | (n = o[e.charAt(a++)]) << 6 | (r = o[e.charAt(a++)]), n === 64 ? i.push(c(t >> 16 & 255)) : r === 64 ? i.push(c(t >> 16 & 255, t >> 8 & 255)) : i.push(c(t >> 16 & 255, t >> 8 & 255, t & 255));
			return i.join("");
		}, E = typeof atob == "function" ? function(e) {
			return atob(d(e));
		} : T, D = typeof Uint8Array.fromBase64 == "function" ? function(e) {
			return Uint8Array.fromBase64(e);
		} : function(e) {
			return l(E(e).split("").map(function(e) {
				return e.charCodeAt(0);
			}));
		}, O = function(e) {
			return D(A(e));
		}, k = r ? function(e) {
			return r.decode(D(e));
		} : function(e) {
			return w(E(e));
		}, A = function(e) {
			return d(e.replace(/[-_]/g, function(e) {
				return e == "-" ? "+" : "/";
			}));
		}, j = function(e) {
			return k(A(e));
		}, M = function(e) {
			if (typeof e != "string") return !1;
			var t = e.replace(/\s+/g, "").replace(/={0,2}$/, "");
			return !/[^\s0-9a-zA-Z\+/]/.test(t) || !/[^\s0-9a-zA-Z\-_]/.test(t);
		}, N = function(e) {
			return {
				value: e,
				enumerable: !1,
				writable: !0,
				configurable: !0
			};
		}, P = function() {
			var e = function(e, t) {
				return Object.defineProperty(String.prototype, e, N(t));
			};
			e("fromBase64", function() {
				return j(this);
			}), e("toBase64", function(e) {
				return b(this, e);
			}), e("toBase64URI", function() {
				return b(this, !0);
			}), e("toBase64URL", function() {
				return b(this, !0);
			}), e("toUint8Array", function() {
				return O(this);
			});
		}, F = function() {
			var e = function(e, t) {
				return Object.defineProperty(Uint8Array.prototype, e, N(t));
			};
			e("toBase64", function(e) {
				return h(this, e);
			}), e("toBase64URI", function() {
				return h(this, !0);
			}), e("toBase64URL", function() {
				return h(this, !0);
			});
		}, I = function() {
			P(), F();
		};
		e.Base64 = {
			version: t,
			VERSION: n,
			atob: E,
			atobPolyfill: T,
			btoa: p,
			btoaPolyfill: f,
			fromBase64: j,
			toBase64: b,
			encode: b,
			encodeURI: x,
			encodeURL: x,
			utob: v,
			btou: w,
			decode: j,
			isValid: M,
			fromUint8Array: h,
			toUint8Array: O,
			extendString: P,
			extendUint8Array: F,
			extendBuiltins: I
		}, e.VERSION = n, e.atob = E, e.atobPolyfill = T, e.btoa = p, e.btoaPolyfill = f, e.btou = w, e.decode = j, e.encode = b, e.encodeURI = x, e.encodeURL = x, e.extendBuiltins = I, e.extendString = P, e.extendUint8Array = F, e.fromBase64 = j, e.fromUint8Array = h, e.isValid = M, e.toBase64 = b, e.toUint8Array = O, e.utob = v, e.version = t;
	}));
})), ie = /* @__PURE__ */ l((/* @__PURE__ */ m(((e, t) => {
	var r = E(), i = (A(), n(D).default).data, a = (P(), n(j).default).data, o = (ee(), n(F).default).data, s = ne(), c = re().Base64, l = new s(c.toUint8Array(i)), u = new s(c.toUint8Array(a)), d = new s(c.toUint8Array(o));
	function f(e, t) {
		return (e & t) !== 0;
	}
	function p(e, t, n) {
		let i = t.length;
		for (let a = n; a + 1 < i; a++) {
			let i = t[a + 0], o = t[a + 1];
			switch (e.gb9c) {
				case 0:
					f(i, r.InCB_Consonant) && (e.gb9c = 1);
					break;
				case 1:
					e.gb9c = f(i, r.InCB_Extend) ? 1 : f(i, r.InCB_Linker) ? 2 : +!!f(i, r.InCB_Consonant);
					break;
				case 2: e.gb9c = f(i, r.InCB_Extend | r.InCB_Linker) ? 2 : +!!f(i, r.InCB_Consonant);
			}
			switch (e.gb11) {
				case 0:
					f(i, r.Extended_Pictographic) && (e.gb11 = 1);
					break;
				case 1:
					e.gb11 = f(i, r.Extend) ? 1 : f(i, r.ZWJ) ? 2 : +!!f(i, r.Extended_Pictographic);
					break;
				case 2: e.gb11 = +!!f(i, r.Extended_Pictographic);
			}
			switch (e.gb12) {
				case 0:
					e.gb12 = f(i, r.Regional_Indicator) ? 1 : -1;
					break;
				case 1: e.gb12 = f(i, r.Regional_Indicator) ? 0 : -1;
			}
			switch (e.gb13) {
				case 0:
					f(i, r.Regional_Indicator) || (e.gb13 = 1);
					break;
				case 1:
					e.gb13 = f(i, r.Regional_Indicator) ? 2 : 1;
					break;
				case 2: e.gb13 = 1;
			}
			if (!(f(i, r.CR) && f(o, r.LF)) && (f(i, r.Control | r.CR | r.LF) || f(o, r.Control | r.CR | r.LF) || !(f(i, r.L) && f(o, r.L | r.V | r.LV | r.LVT)) && !(f(i, r.LV | r.V) && f(o, r.V | r.T)) && !(f(i, r.LVT | r.T) && f(o, r.T)) && !f(o, r.Extend | r.ZWJ) && !f(o, r.SpacingMark) && !f(i, r.Prepend) && !(f(o, r.InCB_Consonant) && e.gb9c === 2) && !(f(o, r.Extended_Pictographic) && e.gb11 === 2) && !(f(o, r.Regional_Indicator) && e.gb12 === 1) && !(f(o, r.Regional_Indicator) && e.gb13 === 2))) return a + 1 - n;
		}
		return i - n;
	}
	t.exports = function(e) {
		let t = [], n = [0], r = [];
		for (let t = 0; t < e.length;) {
			let i = e.codePointAt(t);
			r.push(l.get(i) | u.get(i) | d.get(i)), t += i > 65535 ? 2 : 1, n.push(t);
		}
		let i = {
			gb9c: 0,
			gb11: 0,
			gb12: 0,
			gb13: 0
		};
		for (let a = 0; a < r.length;) {
			let o = p(i, r, a), s = n[a], c = n[a + o];
			t.push(e.slice(s, c)), a += o;
		}
		return t;
	};
})))(), 1), ae = (e) => e.normalize("NFKD").split(""), oe = /^\s+$/, se = /^[`~!@#$%^&*()\-=_+{}[\]\|\\;':",./<>?]+$/, ce = {
	insertOrder: "insertOrder",
	bestMatch: "bestMatch"
}, le = {
	keySelector: (e) => e,
	threshold: .6,
	ignoreCase: !0,
	ignoreSymbols: !0,
	normalizeWhitespace: !0,
	returnMatchData: !1,
	useDamerau: !0,
	useSellers: !0,
	useSeparatedUnicode: !1,
	sortBy: ce.bestMatch
}, ue = () => {}, de = (e) => e instanceof Array ? e : [e];
function fe(e, t) {
	let n = t.ignoreCase ? e.toLocaleLowerCase() : e, r = [], i = [], a = !0, o = 0, s = t.useSeparatedUnicode ? ae(n) : (0, ie.default)(n);
	for (let e of s) oe.lastIndex = 0, se.lastIndex = 0, t.normalizeWhitespace && oe.test(e) ? a ||= (r.push(" "), i.push(o), !0) : t.ignoreSymbols && se.test(e) || (t.useSeparatedUnicode ? r.push(e) : r.push(e.normalize()), i.push(o), a = !1), o += e.length;
	for (i.push(e.length); r[r.length - 1] === " ";) r.pop(), i.pop();
	return {
		original: e,
		normal: r,
		map: i
	};
}
function pe(e, t) {
	return {
		index: t[e.start],
		length: t[e.end + 1] - t[e.start]
	};
}
function me(e, t) {
	if (t === 0) return {
		index: 0,
		length: 0
	};
	let n = t;
	for (let t = e.length - 2; t > 0 && n > 1; t--) {
		let r = e[t];
		n = r[n] < r[n - 1] ? n : n - 1;
	}
	return {
		start: n - 1,
		end: t - 1
	};
}
function he() {
	return {
		start: 0,
		end: 0
	};
}
var ge = () => !0, _e = (e, t) => e < t;
function ve(e, t) {
	let n = Array(e);
	for (let r = 0; r < e; r++) n[r] = Array(t), n[r][0] = r;
	for (let e = 0; e < t; e++) n[0][e] = e;
	return n;
}
function ye(e, t) {
	let n = Array(e);
	n[0] = Array(t).fill(0);
	for (let r = 1; r < e; r++) n[r] = Array(t), n[r][0] = r;
	return n;
}
function be(e, t, n, r, i) {
	let a = n[r], o = n[r + 1], s = e[r] === t[i] ? 0 : 1, c, l = o[i] + 1;
	(c = a[i + 1] + 1) < l && (l = c), (c = a[i] + s) < l && (l = c), o[i + 1] = l;
}
function xe(e, t, n, r) {
	for (let i = 0; i < e.length; i++) be(e, t, n, i, r);
}
function Se(e, t, n, r) {
	if (r === 0) {
		xe(e, t, n, r);
		return;
	}
	e.length > 0 && be(e, t, n, 0, r);
	for (let i = 1; i < e.length; i++) {
		let a = n[i - 1], o = n[i], s = n[i + 1], c = e[i] === t[r] ? 0 : 1, l, u = s[r] + 1;
		(l = o[r + 1] + 1) < u && (u = l), (l = o[r] + c) < u && (u = l), e[i] === t[r - 1] && e[i - 1] === t[r] && (l = a[r - 1] + c) < u && (u = l), s[r + 1] = u;
	}
}
function Ce(e, t, n) {
	let r = e;
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		r.children[n] ?? (r.children[n] = {
			children: {},
			candidates: [],
			depth: 0
		}), r.depth = Math.max(r.depth, t.length - e), r = r.children[n];
	}
	r.candidates.push(n);
}
function we(e, t, n, r) {
	for (let i of n) {
		let n = de(r.keySelector(i)).map((e, n) => ({
			index: t,
			keyIndex: n,
			item: i,
			normalized: fe(e, r)
		}));
		t++;
		for (let t of n) Ce(e, t.normalized.normal, t);
	}
}
function Te(e, t) {
	let n = t.score - e.score;
	if (n !== 0) return n;
	let r = e.match.start - t.match.start;
	if (r !== 0) return r;
	let i = e.keyIndex - t.keyIndex;
	if (i !== 0) return i;
	let a = e.lengthDiff - t.lengthDiff;
	return a === 0 ? Ee(e, t) : a;
}
function Ee(e, t) {
	return e.index - t.index;
}
function De(e) {
	switch (e) {
		case ce.bestMatch: return Te;
		case ce.insertOrder: return Ee;
		default: throw Error(`unknown sortBy method ${e}`);
	}
}
function Oe(e, t, n, r, i, a, o) {
	let s = {
		item: n.item,
		normalized: n.normalized,
		score: r,
		match: i,
		index: n.index,
		keyIndex: n.keyIndex,
		lengthDiff: a
	};
	t[n.index] == null ? (t[n.index] = e.length, e.push(s)) : o(s, e[t[n.index]]) < 0 && (e[t[n.index]] = s);
}
var ke = Math.max, Ae = (e) => e;
function je(e, t, n, r, i) {
	let a = t + i, o = Math.min(n.length, t + e.depth + 1), s = Math.ceil((a + o) / 2);
	return 1 - (s - o) / s >= r;
}
function Me(e, t, n, r, i, a) {
	return 1 - Math.min(i, a - (e.depth + 1)) / n.length >= r;
}
function Ne(e, t, n, r, i, a, o) {
	let s = [];
	for (let n in e.children) {
		let r = e.children[n];
		s.push([
			r,
			1,
			n,
			0,
			t.length
		]);
	}
	let c = Array(e.depth);
	for (; s.length !== 0;) {
		let [e, l, u, d, f] = s.pop();
		c[l - 1] = u, n.score(t, c, r, l - 1);
		let p = l, m = r[r.length - 1][p], h = d, g = f;
		if (n.shouldUpdateScore(m, f) && (h = p, g = m), e.candidates.length > 0) {
			let s = n.getLength(t.length, l), c = 1 - g / s;
			if (c >= o.threshold) {
				let o = me(r, h), s = Math.abs(l - t.length);
				for (let t of e.candidates) Oe(i, a, t, c, o, s, n.compareItems);
			}
		}
		for (let r in e.children) {
			let i = e.children[r];
			n.shouldContinue(i, l, t, o.threshold, g, m) && s.push([
				i,
				l + 1,
				r,
				h,
				g
			]);
		}
	}
}
function Pe(e, t, n) {
	let r = n.useSellers ? ye : ve, i = {
		score: n.useDamerau ? Se : xe,
		getLength: n.useSellers ? Ae : ke,
		shouldUpdateScore: n.useSellers ? _e : ge,
		shouldContinue: n.useSellers ? Me : je,
		walkBack: n.useSellers ? me : he,
		compareItems: De(n.sortBy)
	}, a = {}, o = [], s = r(e.length + 1, t.depth + 1);
	if (n.threshold <= 0 || e.length === 0) for (let n of t.candidates) Oe(o, a, n, 0, {
		index: 0,
		length: 0
	}, e.length, i.compareItems);
	Ne(t, e, i, s, o, a, n);
	let c = o.sort(i.compareItems);
	if (n.returnMatchData) {
		let e = n.useSellers ? pe : ue;
		return c.map((t) => ({
			item: t.item,
			original: t.normalized.original,
			key: t.normalized.normal.join(""),
			score: t.score,
			match: e(t.match, t.normalized.map)
		}));
	}
	return c.map((e) => e.item);
}
var Fe = class {
	constructor(e, t) {
		this.options = Object.assign({}, le, t), this.trie = {
			children: {},
			candidates: [],
			depth: 0
		}, we(this.trie, 0, e, this.options), this.count = e.length;
	}
	add(...e) {
		we(this.trie, this.count, e, this.options), this.count += e.length;
	}
	search(e, t) {
		return t = Object.assign({}, this.options, t), Pe(fe(e, this.options).normal, this.trie, t);
	}
}, Ie = /*#__PURE__*/ JSON.parse("[{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Mineral Fiber Act\",\"material\":\"Mineral Fiber ACT, 5/8in, average; in ceiling grid\",\"absorption\":{\"63\":0.16,\"125\":0.34,\"250\":0.36,\"500\":0.71,\"1000\":0.82,\"2000\":0.68,\"4000\":0.64,\"8000\":0.64},\"nrc\":0.64,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"001l2w6QjpA5JPJ7\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1\\\" Pyrok Cement\",\"material\":\"1\\\" Pyrok Cement\",\"absorption\":{\"63\":0.09,\"125\":0.18,\"250\":0.35,\"500\":0.64,\"1000\":0.73,\"2000\":0.73,\"4000\":0.77,\"8000\":0.81},\"nrc\":0.61,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"046LqpyAULzGUsPE\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Avl Systems 1-1/2\\\" Fabric Wrapped Fiberglass Panel\",\"material\":\"AVL Systems 1-1/2\\\" fabric wrapped fiberglass panel\",\"absorption\":{\"63\":0.2,\"125\":0.29,\"250\":0.73,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"06f4jPFyPE0jlFfx\"},{\"tags\":[\"Operable\",\"Operable Walls\"],\"manufacturer\":\"\",\"name\":\"4\\\" Thick Operable Wall\",\"material\":\"4\\\" thick Operable Wall, Perforated one Side, NRC=0.90\",\"absorption\":{\"63\":0.32,\"125\":0.45,\"250\":0.95,\"500\":0.85,\"1000\":0.85,\"2000\":0.85,\"4000\":0.8,\"8000\":0.85},\"nrc\":0.88,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"084RN7l5z8GHZMOP\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-2P, 50% Intermittent Mount\",\"absorption\":{\"63\":0.3,\"125\":0.43,\"250\":0.43,\"500\":0.67,\"1000\":0.81,\"2000\":0.88,\"4000\":0.84,\"8000\":0.88},\"nrc\":0.7,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0AfgP8D0V0iX8bdc\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Modfusor\",\"material\":\"RPG Modfusor\",\"absorption\":{\"63\":0.15,\"125\":0.22,\"250\":0.29,\"500\":0.33,\"1000\":0.22,\"2000\":0.18,\"4000\":0.2,\"8000\":0.22},\"nrc\":0.26,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0CbSv2nPCdLQTQNJ\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Wenger\",\"material\":\"Wenger, Absorber, 4x4, fabric faced, EACH\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"Wenger data\",\"description\":\"\",\"uuid\":\"0DZ8IRdndfx47EV2\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Hardside Panel 2\\\" Thick\",\"material\":\"Kinetics Hardside Panel 2\\\" Thick\",\"absorption\":{\"63\":0.2,\"125\":0.29,\"250\":0.8,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.94,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0JmRSy90eWoabRJg\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"4\\\" Owens Corning 701\",\"material\":\"4\\\" Owens Corning 701, plain faced, Mounting A\",\"absorption\":{\"63\":0.51,\"125\":0.73,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.97,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0QGKK894xrgT8xdk\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Hardside Panel 3\\\" Thick\",\"material\":\"Kinetics Hardside Panel 3\\\" Thick\",\"absorption\":{\"63\":0.63,\"125\":0.9,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0XjchxnQZlVI3ROI\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3.50\\\" Owens Corning R-11\",\"material\":\"3.50\\\" Owens Corning R-11, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.56,\"125\":0.8,\"250\":0.98,\"500\":0.99,\"1000\":0.99,\"2000\":0.98,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0ai9L0nzDb19a9QY\"},{\"tags\":[\"Plaster\",\"Plaster Constructions\"],\"manufacturer\":\"\",\"name\":\"Plaster Or Plaster Board Sus Clg W/Large Air Space Above   Parkin\",\"material\":\"Plaster or Plaster board sus clg w/large air space above   PARKIN\",\"absorption\":{\"63\":0.25,\"125\":0.2,\"250\":0.15,\"500\":0.1,\"1000\":0.05,\"2000\":0.04,\"4000\":0.05,\"8000\":0.06},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0bFhs0NIGyhyzhgk\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Metal Cladding\",\"material\":\"Metal cladding, against solid backing\",\"absorption\":{\"63\":0.05,\"125\":0.15,\"250\":0.1,\"500\":0.08,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.07,\"source\":\"C&A Files\",\"description\":\"\",\"uuid\":\"0bPJUrKmOzMnrTNQ\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Medium Curtain\",\"material\":\"Medium curtain, in folds, on solid\",\"absorption\":{\"63\":0,\"125\":0.05,\"250\":0.15,\"500\":0.35,\"1000\":0.4,\"2000\":0.5,\"4000\":0.5,\"8000\":0.5},\"nrc\":0.35,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"0dAYDyXigSfJJ9vm\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"2''Fabric Wrapped Panel -Sonotrol Std.\",\"material\":\"2''fabric wrapped panel -sonotrol std.\",\"absorption\":{\"63\":0.3,\"125\":0.4,\"250\":0.97,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0ihritWcrvWkXp6C\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"G & S Fabric Wrapped Panel 2\\\"\",\"material\":\"G & S Fabric Wrapped Panel 2\\\"\",\"absorption\":{\"63\":0.29,\"125\":0.42,\"250\":0.89,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.97,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0mCD72RXm2cKB0KN\"},{\"tags\":[\"Soundblocks\",\"Soundblocks\"],\"manufacturer\":\"\",\"name\":\"Proudfoot 'Soundblox' \",\"material\":\"Proudfoot 'Soundblox' , 8 -in., Type A-1 Painted\",\"absorption\":{\"63\":0.5,\"125\":0.97,\"250\":0.44,\"500\":0.38,\"1000\":0.39,\"2000\":0.5,\"4000\":0.6,\"8000\":0.7},\"nrc\":0.43,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0oEDwwqzXatFe2O3\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Concrete Or Terrazzo Floor\",\"material\":\"Concrete or terrazzo floor\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.02,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0ucuMlGTlsTXKstw\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Kinetics Barrel 2'X4' Flush J-Mounted W/ Damping\",\"material\":\"Kinetics Barrel 2'x4' Flush J-Mounted w/ damping\",\"absorption\":{\"63\":0.26,\"125\":0.62,\"250\":0.25,\"500\":0.24,\"1000\":0.14,\"2000\":0.13,\"4000\":0.14,\"8000\":0.15},\"nrc\":0.19,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"0wzdhyNga0EaF46s\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.33H Spacing, Type NF-4\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.34,\"500\":0.41,\"1000\":0.37,\"2000\":0.39,\"4000\":0.25,\"8000\":0.39},\"nrc\":0.38,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"12Gmh3JBaxigzl2p\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"People\",\"material\":\"People, unseated, each\",\"absorption\":{\"63\":0,\"125\":0.15,\"250\":0.35,\"500\":0.4,\"1000\":0.4,\"2000\":0.4,\"4000\":0.4,\"8000\":0.4},\"nrc\":0.39,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"15VNSulLnYRRue84\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Velour\",\"material\":\"Velour, 14 oz/sq yd at wall (100% fullness) AIMA\",\"absorption\":{\"63\":0.04,\"125\":0.07,\"250\":0.31,\"500\":0.49,\"1000\":0.75,\"2000\":0.7,\"4000\":0.6,\"8000\":0.7},\"nrc\":0.56,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"17vH72xx65ZRhc5L\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, heavy, on foam rubber\",\"absorption\":{\"63\":0,\"125\":0.08,\"250\":0.24,\"500\":0.57,\"1000\":0.69,\"2000\":0.71,\"4000\":0.73,\"8000\":0.73},\"nrc\":0.55,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"1A5VGNdJBPzRE0vm\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Velour\",\"material\":\"Velour, 10 oz/sq yd at wall (0% fullness) AIMA\",\"absorption\":{\"63\":0.02,\"125\":0.03,\"250\":0.04,\"500\":0.11,\"1000\":0.17,\"2000\":0.24,\"4000\":0.35,\"8000\":0.46},\"nrc\":0.14,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"1Ee8xMNyokjUsg5I\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-2P, Intermittent Mount\",\"absorption\":{\"63\":0.23,\"125\":0.33,\"250\":0.56,\"500\":0.72,\"1000\":0.85,\"2000\":0.8,\"4000\":0.87,\"8000\":0.94},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"1HHNeCOMYRUNknFR\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Flutterfree (Non Slotted) - Helmholtz Mount - 1/16\\\" Slot Width - 3.5\\\" Cavity Mount With 1\\\" 6Pcf Fiberglass Backing\",\"material\":\"RPG FlutterFree (non slotted) - Helmholtz Mount - 1/16\\\" slot width - 3.5\\\" cavity mount with 1\\\" 6PCF fiberglass backing\",\"absorption\":{\"63\":0.43,\"125\":0.62,\"250\":0.41,\"500\":0.24,\"1000\":0.16,\"2000\":0.19,\"4000\":0.2,\"8000\":0.21},\"nrc\":0.25,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"1MILcig6sE1ekz4L\"},{\"tags\":[\"Floors\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Wood Floor\",\"material\":\"Wood floor\",\"absorption\":{\"63\":0.06,\"125\":0.15,\"250\":0.11,\"500\":0.1,\"1000\":0.07,\"2000\":0.06,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.09,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"1PgJwgIAqHwMj99A\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Decoustics Baffle #10&20 ; S/H =3\",\"material\":\"decoustics Baffle #10&20 ; S/H =3\",\"absorption\":{\"63\":0.24,\"125\":0.34,\"250\":0.74,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"1bgA79iDoiqMsEtj\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Pyrok Acoustement Plaster 20\",\"material\":\"1/2\\\" Pyrok Acoustement Plaster 20\",\"absorption\":{\"63\":0.05,\"125\":0.11,\"250\":0.3,\"500\":0.36,\"1000\":0.46,\"2000\":0.78,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.48,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"1h6V98CcCN3yr6dJ\"},{\"tags\":[\"People\",\"Heavily upholstered\"],\"manufacturer\":\"\",\"name\":\"Heavily Upholstered Seats \",\"material\":\"Heavily Upholstered Seats , occupied\",\"absorption\":{\"63\":0.32,\"125\":0.72,\"250\":0.8,\"500\":0.86,\"1000\":0.89,\"2000\":0.9,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.86,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"1hEMORE0cIpiF4Ie\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Martin 1-1/2In Fibroplank\",\"material\":\"Martin 1-1/2in FIBROPLANK, C-40 MTG w/ FG insulation\",\"absorption\":{\"63\":0,\"125\":0.39,\"250\":0.82,\"500\":0.99,\"1000\":0.75,\"2000\":0.81,\"4000\":0.92,\"8000\":0.92},\"nrc\":0.84,\"source\":\"Martin data\",\"description\":\"\",\"uuid\":\"1kIAXz4LVeNMIRjA\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"1\\\" Tectum Mounting #4 (Directly To Concrete)\",\"material\":\"1\\\" Tectum mounting #4 (directly to concrete)\",\"absorption\":{\"63\":0.03,\"125\":0.06,\"250\":0.13,\"500\":0.24,\"1000\":0.45,\"2000\":0.82,\"4000\":0.64,\"8000\":0.82},\"nrc\":0.41,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"1norc7iBSgRnqJ7E\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Alto 8 2\\\" E-400 Mounted\",\"material\":\"Kinetics Alto 8 2\\\" E-400 Mounted\",\"absorption\":{\"63\":0.6,\"125\":0.86,\"250\":0.98,\"500\":0.99,\"1000\":0.94,\"2000\":0.64,\"4000\":0.68,\"8000\":0.72},\"nrc\":0.89,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"1yGRKMU4pp7XcO4J\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Flat Double Layer\",\"material\":\"32oz. Flat double layer, 0\\\" separation, 12\\\" behind rear fabric, closed side edges\",\"absorption\":{\"63\":0.39,\"125\":0.56,\"250\":0.64,\"500\":0.61,\"1000\":0.73,\"2000\":0.83,\"4000\":0.79,\"8000\":0.83},\"nrc\":0.7,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"23rVvEdQyg2tQU40\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Millennia Climaplus 3/4 2X2 High Nrc\",\"material\":\"USG Millennia ClimaPlus 3/4 2x2 High NRC\",\"absorption\":{\"63\":0.29,\"125\":0.61,\"250\":0.58,\"500\":0.6,\"1000\":0.82,\"2000\":0.93,\"4000\":0.89,\"8000\":0.89},\"nrc\":0.73,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"2N4xcGexZm5qPGfO\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloud-Lite Baffels 2600-2015 ((2'X4'\",\"material\":\"MBI Cloud-Lite Baffels 2600-2015 ((2'x4', 2\\\" thick, 1.5# density) 3 Mil PVC\",\"absorption\":{\"63\":0.27,\"125\":0.38,\"250\":0.7,\"500\":0.99,\"1000\":0.99,\"2000\":0.79,\"4000\":0.4,\"8000\":0.79},\"nrc\":0.87,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"2O9jnsSioY5hAGXt\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Glass\",\"material\":\"Glass, 24 oz operable\",\"absorption\":{\"63\":0.03,\"125\":0.1,\"250\":0.05,\"500\":0.04,\"1000\":0.03,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.04,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"2YHxGK51SAlLPaBq\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Hardside Panel 1\\\" Thick\",\"material\":\"Kinetics Hardside Panel 1\\\" Thick\",\"absorption\":{\"63\":0.05,\"125\":0.07,\"250\":0.33,\"500\":0.8,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.78,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"2mw3rw5IgApFbdNv\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 4' Ceiling Diffuser\",\"material\":\"Wenger 4' x 4' Ceiling Diffuser, Convex (E-400)\",\"absorption\":{\"63\":0.15,\"125\":0.21,\"250\":0.16,\"500\":0.16,\"1000\":0.15,\"2000\":0.14,\"4000\":0.26,\"8000\":0.38},\"nrc\":0.15,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"2oPegebjqOn1rwSp\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Minaboard  Panel\",\"material\":\"Armstrong Minaboard  Panel, Fissured (2 x 4 x 5/8\\\"), Mount E-400\",\"absorption\":{\"63\":0.13,\"125\":0.29,\"250\":0.31,\"500\":0.48,\"1000\":0.7,\"2000\":0.77,\"4000\":0.84,\"8000\":0.91},\"nrc\":0.57,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"2rTu9rQssau8Nzag\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone F Mineral Fiber Acoustic Tile (1 X 1 X 3/4\\\")\",\"material\":\"USG Acoustone F mineral fiber acoustic tile (1 x 1 x 3/4\\\"), direct applied\",\"absorption\":{\"63\":0.03,\"125\":0.05,\"250\":0.23,\"500\":0.71,\"1000\":0.97,\"2000\":0.86,\"4000\":0.93,\"8000\":0.99},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"2u8JeK5JO3KdkUuz\"},{\"tags\":[\"Plaster\",\"Plaster Constructions\"],\"manufacturer\":\"\",\"name\":\"Plaster On Lath\",\"material\":\"Plaster on lath, smooth AIMA rev no thk, no air space or backing given\",\"absorption\":{\"63\":0.02,\"125\":0.14,\"250\":0.1,\"500\":0.06,\"1000\":0.04,\"2000\":0.04,\"4000\":0.03,\"8000\":0.04},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"2uQbho0NkcFwzsSX\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Painted Fiberboard\",\"material\":\"Painted fiberboard, normal or soft, 1/4\\\" thick, mounted on a solid backing\",\"absorption\":{\"63\":0.05,\"125\":0.05,\"250\":0.1,\"500\":0.1,\"1000\":0.1,\"2000\":0.1,\"4000\":0.15,\"8000\":0.2},\"nrc\":0.1,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"2uciWFFTMx4yTSNr\"},{\"tags\":[\"Slit\",\"Slit Resonators\"],\"manufacturer\":\"\",\"name\":\"Slit Resonator - 10% Open Area \",\"material\":\"Slit Resonator - 10% Open Area , 1 in. insulation\",\"absorption\":{\"63\":0.04,\"125\":0.08,\"250\":0.25,\"500\":0.99,\"1000\":0.75,\"2000\":0.5,\"4000\":0.3,\"8000\":0.5},\"nrc\":0.62,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"2xGuvMBWvi2wZbaE\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1+2 @ 5/8in on ins. 3-5/8in studs\",\"absorption\":{\"63\":0.04,\"125\":0.13,\"250\":0.07,\"500\":0.06,\"1000\":0.05,\"2000\":0.05,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.06,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"2zoJHvHGyUHKHDD0\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Person\",\"material\":\"Person, adult (metric sabines per person)\",\"absorption\":{\"63\":0.17,\"125\":0.23,\"250\":0.33,\"500\":0.39,\"1000\":0.43,\"2000\":0.46,\"4000\":0.46,\"8000\":0.46},\"nrc\":0.4,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"35wd0u6kaIdPydJH\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloud-Lite Baffels 2800-Hl Fabric\",\"material\":\"MBI Cloud-Lite Baffels 2800-HL Fabric\",\"absorption\":{\"63\":0.2,\"125\":0.29,\"250\":0.74,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"390MXDkl2rHjSt4s\"},{\"tags\":[\"Ceilings\",\"Roof Fabric\"],\"manufacturer\":\"\",\"name\":\"Glass-Fiber Roof Fabric\",\"material\":\"Glass-fiber roof fabric, 37.5oz\",\"absorption\":{\"63\":0.12,\"125\":0.38,\"250\":0.23,\"500\":0.17,\"1000\":0.15,\"2000\":0.09,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.16,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"3Geg5sUZek4kwAtX\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Armstrong Soundsoak Panel 60 \",\"material\":\"Armstrong SoundSoak Panel 60 , Mounting D-20\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.64,\"500\":0.58,\"1000\":0.82,\"2000\":0.84,\"4000\":0.76,\"8000\":0.84},\"nrc\":0.72,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"3NGEwq1oMbpZHKIp\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Orchestra Pit Opening\",\"material\":\"Orchestra Pit Opening, small orchestra (40 players)\",\"absorption\":{\"63\":0.04,\"125\":0.1,\"250\":0.13,\"500\":0.17,\"1000\":0.41,\"2000\":0.5,\"4000\":0.57,\"8000\":0.57},\"nrc\":0.3,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"3TN4UozS1ulzlRsV\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13\",\"material\":\"K13, solid backing, 5/8in\",\"absorption\":{\"63\":0,\"125\":0.05,\"250\":0.16,\"500\":0.44,\"1000\":0.79,\"2000\":0.9,\"4000\":0.91,\"8000\":0.91},\"nrc\":0.57,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"3ZstUYhPFOdvbEYo\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood\",\"material\":\"Wood, 1in paneling with air space\",\"absorption\":{\"63\":0.07,\"125\":0.19,\"250\":0.14,\"500\":0.09,\"1000\":0.06,\"2000\":0.06,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.09,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"3a80seowGffawweo\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, heavy, glued to concrete\",\"absorption\":{\"63\":0,\"125\":0.02,\"250\":0.06,\"500\":0.14,\"1000\":0.37,\"2000\":0.6,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.29,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"3p8bIyaC10mgLyYy\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Fiberglass Fabric Curtain\",\"material\":\"Fiberglass fabric curtain, 8.5 oz/sq yd (50% fullness) Egan\",\"absorption\":{\"63\":0.03,\"125\":0.09,\"250\":0.32,\"500\":0.68,\"1000\":0.83,\"2000\":0.39,\"4000\":0.76,\"8000\":0.99},\"nrc\":0.56,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"3sUxVxHXIi9Gc6Zi\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Steel\",\"material\":\"Steel\",\"absorption\":{\"63\":0,\"125\":0.05,\"250\":0.1,\"500\":0.1,\"1000\":0.1,\"2000\":0.07,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.09,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"3wFsC6HN1ComYnPo\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Panels (Solid)\",\"material\":\"Wood Panels (solid), 3/4in, on furring\",\"absorption\":{\"63\":0.09,\"125\":0.25,\"250\":0.18,\"500\":0.11,\"1000\":0.08,\"2000\":0.07,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.11,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"3z0f9dHFjcUHYPoH\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloudlite Baffles\",\"material\":\"MBI Cloudlite Baffles, 2600-1515 2 mil PVC\",\"absorption\":{\"63\":0.06,\"125\":0.38,\"250\":0.64,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.9,\"source\":\"MBI\",\"description\":\"\",\"uuid\":\"47QdpZfM0RAgUpof\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Glazing\",\"material\":\"Glazing\",\"absorption\":{\"63\":0.05,\"125\":0.15,\"250\":0.1,\"500\":0.05,\"1000\":0.03,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.05,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"4DqU50PHK0I375pF\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Cortega High NRC\",\"absorption\":{\"63\":0.16,\"125\":0.36,\"250\":0.41,\"500\":0.65,\"1000\":0.84,\"2000\":0.9,\"4000\":0.88,\"8000\":0.88},\"nrc\":0.7,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"4bY93hPEP6fzuNFH\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Ensemble A-Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Ensemble A-Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.07,\"125\":0.1,\"250\":0.35,\"500\":0.82,\"1000\":0.91,\"2000\":0.71,\"4000\":0.56,\"8000\":0.71},\"nrc\":0.7,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"4oqF0jwZvYkfwrTA\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"12Mm Ply On 50Mm Air Space\",\"material\":\"12mm ply on 50mm air space, mineral wool insulation\",\"absorption\":{\"63\":0.1,\"125\":0.3,\"250\":0.2,\"500\":0.15,\"1000\":0.1,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.14,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"4pjYLmByAsgHicbL\"},{\"tags\":[\"People\",\"Lightly upholstered\"],\"manufacturer\":\"\",\"name\":\"Lightly Upholstered Seats\",\"material\":\"Lightly Upholstered Seats, occupied\",\"absorption\":{\"63\":0.19,\"125\":0.51,\"250\":0.64,\"500\":0.75,\"1000\":0.8,\"2000\":0.82,\"4000\":0.83,\"8000\":0.83},\"nrc\":0.75,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"4qtWyigkGfsMlyBL\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Alto 16 E-400 Mounted\",\"material\":\"Kinetics Alto 16 E-400 Mounted\",\"absorption\":{\"63\":0.48,\"125\":0.74,\"250\":0.83,\"500\":0.71,\"1000\":0.69,\"2000\":0.68,\"4000\":0.67,\"8000\":0.68},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"4tT89FQWZnVAoe7J\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Double 100% Gathers\",\"material\":\"32oz. Double 100% gathers, 8\\\" separation, 15\\\" to track, closed side edges\",\"absorption\":{\"63\":0.53,\"125\":0.76,\"250\":0.91,\"500\":0.99,\"1000\":0.97,\"2000\":0.98,\"4000\":0.92,\"8000\":0.98},\"nrc\":0.96,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"4uGdOMOCdL6l6G6K\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone\",\"material\":\"USG Acoustone, foil, 3/4in, 2x2 panels, Glacier 707\",\"absorption\":{\"63\":0.15,\"125\":0.33,\"250\":0.3,\"500\":0.46,\"1000\":0.96,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.68,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"4yXliHJA3h6HoQaV\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Flat Double Layer\",\"material\":\"32oz. Flat double layer, 4\\\" separation, 8\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.32,\"125\":0.45,\"250\":0.66,\"500\":0.87,\"1000\":0.95,\"2000\":0.91,\"4000\":0.88,\"8000\":0.91},\"nrc\":0.85,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"53NNSbgxoIV5FZCg\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Random Fissured (Perforated) 2x4\",\"absorption\":{\"63\":0.33,\"125\":0.67,\"250\":0.65,\"500\":0.65,\"1000\":0.71,\"2000\":0.81,\"4000\":0.71,\"8000\":0.71},\"nrc\":0.71,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"575Qx2P6CnbVTyMG\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics High Impact Hardside 1-1/8\\\" Thick\",\"material\":\"Kinetics High Impact HardSide 1-1/8\\\" Thick\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.54,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.88,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"5EUroDdSjlNTNFmb\"},{\"tags\":[\"Ceilings\",\"Metal Roof Decks\"],\"manufacturer\":\"\",\"name\":\"Roof Deck\",\"material\":\"Roof deck, perf. fluted steel ribbed insulated, WR 3in w/.15ind.@3/8incenters\",\"absorption\":{\"63\":0.01,\"125\":0.11,\"250\":0.2,\"500\":0.63,\"1000\":0.99,\"2000\":0.66,\"4000\":0.36,\"8000\":0.36},\"nrc\":0.62,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"5HDF1FHNOpjylvex\"},{\"tags\":[\"Mech\",\"Grilles\"],\"manufacturer\":\"\",\"name\":\"Diffusers & Grilles\",\"material\":\"Diffusers & Grilles, average\",\"absorption\":{\"63\":0.05,\"125\":0.15,\"250\":0.2,\"500\":0.3,\"1000\":0.35,\"2000\":0.45,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.33,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"5LxsMVG6hJyknR8f\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg Thermoformed (Plastic) Lay-In Formedffusor\",\"material\":\"RPG Thermoformed (plastic) lay-in Formedffusor, E400\",\"absorption\":{\"63\":0.19,\"125\":0.53,\"250\":0.37,\"500\":0.38,\"1000\":0.32,\"2000\":0.15,\"4000\":0.18,\"8000\":0.18},\"nrc\":0.31,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"5NzNyNnqPQrGgNBp\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone Firecode Panels\",\"material\":\"USG Auratone Firecode panels, Aspen 3845 3/4 2x2\",\"absorption\":{\"63\":0.16,\"125\":0.45,\"250\":0.32,\"500\":0.58,\"1000\":0.67,\"2000\":0.64,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.55,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"5VMhW4l6i7FszarV\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Radar High-Nrc 3173 3/4 2X2\",\"material\":\"USG Radar High-NRC 3173 3/4 2x2\",\"absorption\":{\"63\":0.22,\"125\":0.46,\"250\":0.44,\"500\":0.7,\"1000\":0.87,\"2000\":0.77,\"4000\":0.62,\"8000\":0.62},\"nrc\":0.7,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"5aKVwnkmiB2yLFe3\"},{\"tags\":[\"Air\",\"Air Absorption\"],\"manufacturer\":\"\",\"name\":\"Air (Per 1000 Cu. Ft.) - Relative Humidity 40%\",\"material\":\"Air (per 1000 cu. ft.) - relative humidity 40%\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0,\"500\":0,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.5,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"5dBdJB5Ve8KorS7F\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 705\",\"material\":\"2\\\" Owens Corning 705, FRK faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.27,\"125\":0.38,\"250\":0.36,\"500\":0.39,\"1000\":0.37,\"2000\":0.56,\"4000\":0.38,\"8000\":0.56},\"nrc\":0.42,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"5fWsY5ahy0sUY8cB\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"5/8In Or 16Mm Fiberglass\",\"material\":\"5/8in or 16mm fiberglass, perf. vinyl\",\"absorption\":{\"63\":0.31,\"125\":0.65,\"250\":0.68,\"500\":0.66,\"1000\":0.72,\"2000\":0.82,\"4000\":0.71,\"8000\":0.71},\"nrc\":0.72,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"5lDpn8yzHHbBSX7T\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno A-Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Sereno A-Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.04,\"125\":0.16,\"250\":0.36,\"500\":0.79,\"1000\":0.99,\"2000\":0.62,\"4000\":0.44,\"8000\":0.62},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"5pOcNsbcEWDlf9Gb\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Omniffusor (Frg) - A Mount Uncovered\",\"material\":\"RPG Omniffusor (FRG) - A mount uncovered\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.12,\"500\":0.15,\"1000\":0.2,\"2000\":0.09,\"4000\":0.11,\"8000\":0.13},\"nrc\":0.14,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"5taTVn4LGA6znbMZ\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Upholstered Seats\",\"material\":\"Upholstered seats, empty\",\"absorption\":{\"63\":0.16,\"125\":0.46,\"250\":0.6,\"500\":0.73,\"1000\":0.81,\"2000\":0.76,\"4000\":0.66,\"8000\":0.66},\"nrc\":0.73,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"61RMt2HucWJLVq68\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Drapery\",\"material\":\"Drapery, 10 oz/yd, against wall; no fullness\",\"absorption\":{\"63\":0.01,\"125\":0.03,\"250\":0.04,\"500\":0.11,\"1000\":0.17,\"2000\":0.24,\"4000\":0.35,\"8000\":0.35},\"nrc\":0.14,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"61SS6sJhWfpAnMjK\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Orchestra On Stage\",\"material\":\"Orchestra on stage, 92 players, 4 brass (in metric sabines)  (Beranek 1998)\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"61i2irwpYmTFsR5p\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Seating\",\"material\":\"Seating, empty, wood or padded\",\"absorption\":{\"63\":0.03,\"125\":0.08,\"250\":0.11,\"500\":0.15,\"1000\":0.16,\"2000\":0.18,\"4000\":0.2,\"8000\":0.2},\"nrc\":0.15,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"6MbQlXxiUZwedB28\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Reflective Velour\",\"material\":\"Reflective Velour, 20 oz/sq yd hung free in space (fullness unk) man. lab test data Rosco 4-91\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0.04,\"500\":0.03,\"1000\":0.04,\"2000\":0.09,\"4000\":0.15,\"8000\":0.21},\"nrc\":0.05,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"6OJYaIBUqVwIuHmN\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Lightweight Drapery\",\"material\":\"Lightweight drapery, 10oz, flat on wall\",\"absorption\":{\"63\":0.01,\"125\":0.03,\"250\":0.04,\"500\":0.11,\"1000\":0.17,\"2000\":0.24,\"4000\":0.15,\"8000\":0.15},\"nrc\":0.14,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"6Xawb0zzdYxTZdft\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, heavy, on 40 oz. pad\",\"absorption\":{\"63\":0,\"125\":0.08,\"250\":0.24,\"500\":0.57,\"1000\":0.69,\"2000\":0.71,\"4000\":0.73,\"8000\":0.73},\"nrc\":0.55,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"6fGZP1HneY8Ptfxp\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloud-Lite Baffels 2600-2020 ((2'X4'\",\"material\":\"MBI Cloud-Lite Baffels 2600-2020 ((2'x4', 2\\\" thick, 2# density) Perforated PVC\",\"absorption\":{\"63\":0.24,\"125\":0.34,\"250\":0.74,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"6gmiqfVDmD0MOjAA\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - 6\\\"\",\"material\":\"Cellular Metal Deck - 6\\\"\",\"absorption\":{\"63\":0.4,\"125\":0.8,\"250\":0.99,\"500\":0.99,\"1000\":0.7,\"2000\":0.5,\"4000\":0.45,\"8000\":0.5},\"nrc\":0.8,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"6kjS7r81frvWgR2L\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13Fc\",\"material\":\"K13fc, solid backing, 3/4in\",\"absorption\":{\"63\":0.05,\"125\":0.18,\"250\":0.27,\"500\":0.67,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.73,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"6mRJFh09xt20OdMp\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone Panel With 4\\\" Fiberglass\",\"material\":\"IAC Varitone Panel with 4\\\" Fiberglass\",\"absorption\":{\"63\":0.45,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"6tfkhotwCw4pl8qk\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Painted Fiberboard\",\"material\":\"Painted fiberboard, 1/2\\\" thick on 2\\\" x 1\\\" battens, 16\\\" center, on a solid backing\",\"absorption\":{\"63\":0.25,\"125\":0.3,\"250\":0.22,\"500\":0.15,\"1000\":0.12,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.15,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"6vNCvUQKgDjGzlBY\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, 1/8in pile\",\"absorption\":{\"63\":0.01,\"125\":0.03,\"250\":0.05,\"500\":0.09,\"1000\":0.2,\"2000\":0.3,\"4000\":0.4,\"8000\":0.4},\"nrc\":0.16,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"6y4uQUs5CP1hcS73\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 705\",\"material\":\"2\\\" Owens Corning 705, FRK faced, Mounting E-405\",\"absorption\":{\"63\":0.35,\"125\":0.5,\"250\":0.36,\"500\":0.7,\"1000\":0.9,\"2000\":0.52,\"4000\":0.47,\"8000\":0.52},\"nrc\":0.62,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"6ysoQH2OmFKvG3GT\"},{\"tags\":[\"Roofing\",\"Roofing Constructons\"],\"manufacturer\":\"\",\"name\":\"Precast Concrete Roof Slab\",\"material\":\"Precast concrete roof slab, Duwe concrete - Dulite, 3\\\" thick, 8.97 lbs./sq. ft., mounting No. 4 on concrete floor (63 Hz estimated)\",\"absorption\":{\"63\":0.1,\"125\":0.17,\"250\":0.38,\"500\":0.98,\"1000\":0.87,\"2000\":0.83,\"4000\":0.84,\"8000\":0.85},\"nrc\":0.77,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"70bXneQ9vn9z9PaJ\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass Batt\",\"material\":\"Fiberglass Batt, 6in, against solid backing\",\"absorption\":{\"63\":0.39,\"125\":0.88,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"71UC2418YEGK5Mbn\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Omniffusor - A Mount With Fabric At 2\\\" From Face\",\"material\":\"RPG Omniffusor - A mount with fabric at 2\\\" from face\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.15,\"500\":0.26,\"1000\":0.32,\"2000\":0.23,\"4000\":0.27,\"8000\":0.31},\"nrc\":0.24,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"72Vf8kHSkQVyIova\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"3/4In Or 19Mm Fiberglass\",\"material\":\"3/4in or 19mm fiberglass, nubby fabric facing\",\"absorption\":{\"63\":0.19,\"125\":0.64,\"250\":0.9,\"500\":0.66,\"1000\":0.88,\"2000\":0.97,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.85,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"749OBekshwogjVzF\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics A.P. Fabric 0.75In\",\"material\":\"Decoustics a.p. fabric 0.75in\",\"absorption\":{\"63\":0,\"125\":0.01,\"250\":0.17,\"500\":0.54,\"1000\":0.89,\"2000\":0.99,\"4000\":0.97,\"8000\":0.97},\"nrc\":0.65,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"78r4teJEVcUJG4SL\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 8' Type Ii Wall Diffuser\",\"material\":\"Wenger 4' x 8' Type II Wall Diffuser, (A)\",\"absorption\":{\"63\":0.24,\"125\":0.34,\"250\":0.27,\"500\":0.14,\"1000\":0.11,\"2000\":0.11,\"4000\":0.19,\"8000\":0.27},\"nrc\":0.16,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"7FfTYvegTguymphB\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Steeltone (A.A.V. Ltd)\",\"material\":\"Steeltone (A.A.V. ltd)\",\"absorption\":{\"63\":0.03,\"125\":0.2,\"250\":0.34,\"500\":0.88,\"1000\":0.7,\"2000\":0.5,\"4000\":0.57,\"8000\":0.57},\"nrc\":0.61,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"7ISssVkvLpk5Nv2c\"},{\"tags\":[\"Walls\",\"Concrete Block\"],\"manufacturer\":\"\",\"name\":\"Concrete\",\"material\":\"Concrete, rough\",\"absorption\":{\"63\":0,\"125\":0.01,\"250\":0.02,\"500\":0.04,\"1000\":0.06,\"2000\":0.08,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.05,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"7NUaeXHuxuvJXhrB\"},{\"tags\":[\"Ceilings\",\"Special Ceilings\"],\"manufacturer\":\"\",\"name\":\"1In Parallel Glass-Fiber Panels\",\"material\":\"1in parallel glass-fiber panels, 18inwide, 6.5inapart, 12ina.s.\",\"absorption\":{\"63\":0,\"125\":0.1,\"250\":0.29,\"500\":0.62,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.72,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"7SIDCGyI0XqtUjXR\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Natural Fissured Fire Guard 2x2\",\"absorption\":{\"63\":0.15,\"125\":0.34,\"250\":0.29,\"500\":0.4,\"1000\":0.59,\"2000\":0.74,\"4000\":0.84,\"8000\":0.84},\"nrc\":0.51,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"7SmcR00yu2fTqtA7\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Fabric Uphostered Seats\",\"material\":\"Fabric uphostered seats, perforated seat pans, empty\",\"absorption\":{\"63\":0.01,\"125\":0.19,\"250\":0.37,\"500\":0.56,\"1000\":0.67,\"2000\":0.61,\"4000\":0.59,\"8000\":0.59},\"nrc\":0.55,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"7TRnz5p3i6VtzGDy\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Decoustics H. I. R. Type 1:  2\\\" Thick Fabric-Covered Wall Panel\",\"material\":\"Decoustics H. I. R. Type 1:  2\\\" thick fabric-covered wall panel\",\"absorption\":{\"63\":0.2,\"125\":0.52,\"250\":0.84,\"500\":0.95,\"1000\":0.88,\"2000\":0.86,\"4000\":0.88,\"8000\":0.9},\"nrc\":0.88,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"7TaLWABCRa82mnRP\"},{\"tags\":[\"People\",\"Moderately upholstered\"],\"manufacturer\":\"\",\"name\":\"Musician W/ Instr; Each\",\"material\":\"Musician w/ instr; each\",\"absorption\":{\"63\":0,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"7VClt0G6c6GtQxzN\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Rockwool (1/2 To 1 Lb./Sq. Ft.)\",\"material\":\"Rockwool (1/2 to 1 lb./sq. ft.), 1\\\" thick semi-rigid slabs against a solid backing\",\"absorption\":{\"63\":0.03,\"125\":0.05,\"250\":0.2,\"500\":0.45,\"1000\":0.75,\"2000\":0.8,\"4000\":0.75,\"8000\":0.8},\"nrc\":0.55,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"7ifv49Ub3BTLVzhr\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plywood\",\"material\":\"Plywood, 7/8in, over air space (+/- 3in)\",\"absorption\":{\"63\":0.11,\"125\":0.28,\"250\":0.22,\"500\":0.17,\"1000\":0.09,\"2000\":0.1,\"4000\":0.11,\"8000\":0.11},\"nrc\":0.15,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"7jVNIv9f08NyB6EC\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 8In Type A1; Painted\",\"material\":\"Soundblox 8in Type A1; painted\",\"absorption\":{\"63\":0.22,\"125\":0.97,\"250\":0.44,\"500\":0.38,\"1000\":0.39,\"2000\":0.5,\"4000\":0.6,\"8000\":0.6},\"nrc\":0.43,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"7qiY9Xqgxgp6Z4P2\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 703\",\"material\":\"1\\\" Owens Corning 703, ASJ faced, Mounting E-405\",\"absorption\":{\"63\":0.19,\"125\":0.27,\"250\":0.54,\"500\":0.57,\"1000\":0.66,\"2000\":0.58,\"4000\":0.36,\"8000\":0.58},\"nrc\":0.59,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"86nE1QKg0JbDfgvU\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Stonebrooke 2x4 x1in\",\"absorption\":{\"63\":0.24,\"125\":0.62,\"250\":0.77,\"500\":0.66,\"1000\":0.82,\"2000\":0.79,\"4000\":0.64,\"8000\":0.64},\"nrc\":0.76,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"86y2apxLJYcFStlM\"},{\"tags\":[\"Ceilings\",\"Special Ceilings\"],\"manufacturer\":\"\",\"name\":\"Plaster\",\"material\":\"Plaster, 1-1/4in, on ceiling lath with air space\",\"absorption\":{\"63\":0.06,\"125\":0.14,\"250\":0.12,\"500\":0.08,\"1000\":0.06,\"2000\":0.06,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.08,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"8DESFw7VY14pCrn0\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Single 100% Gathers\",\"material\":\"32oz. Single 100% gathers, 15\\\" to track, closed side edges - most current data, based on actual tests\",\"absorption\":{\"63\":0.42,\"125\":0.6,\"250\":0.86,\"500\":0.87,\"1000\":0.95,\"2000\":0.96,\"4000\":0.92,\"8000\":0.96},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8DGZrGJNqQIRAang\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster On Lath / Air\",\"material\":\"Plaster on lath / air\",\"absorption\":{\"63\":0.04,\"125\":0.1,\"250\":0.08,\"500\":0.06,\"1000\":0.05,\"2000\":0.04,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.06,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"8EiWZnOMBcglR68r\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.75H Spacing, Type NF-2P\",\"absorption\":{\"63\":0.11,\"125\":0.15,\"250\":0.34,\"500\":0.41,\"1000\":0.46,\"2000\":0.51,\"4000\":0.3,\"8000\":0.51},\"nrc\":0.43,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8EvT7PS1rKynYWOE\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Flat Double Layer\",\"material\":\"25oz. Flat double layer, 4\\\" separation, 8\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.31,\"125\":0.44,\"250\":0.59,\"500\":0.84,\"1000\":0.96,\"2000\":0.9,\"4000\":0.84,\"8000\":0.9},\"nrc\":0.82,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8GPbkLuMItJwiUIW\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Perdue High-Impact Fabric And Rockwool 1\\\" Panel\",\"material\":\"Perdue High-Impact Fabric and Rockwool 1\\\" Panel\",\"absorption\":{\"63\":0.2,\"125\":0.28,\"250\":0.67,\"500\":0.99,\"1000\":0.99,\"2000\":0.98,\"4000\":0.98,\"8000\":0.98},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8O7rWNA3UO2zEGbK\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"People In Uph. Seats\",\"material\":\"People in Uph. Seats\",\"absorption\":{\"63\":0.23,\"125\":0.58,\"250\":0.7,\"500\":0.84,\"1000\":0.93,\"2000\":0.9,\"4000\":0.83,\"8000\":0.83},\"nrc\":0.84,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"8PJjn7WqIGulaiX3\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone\",\"material\":\"USG Auratone, Illus. Two/24 3575 3/4 2x4\",\"absorption\":{\"63\":0.16,\"125\":0.35,\"250\":0.31,\"500\":0.45,\"1000\":0.67,\"2000\":0.67,\"4000\":0.58,\"8000\":0.58},\"nrc\":0.53,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"8TmTfwpMb8kvn7Nq\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sportsboard Elite 1-1/16\\\" Thick\",\"material\":\"Kinetics SportsBoard Elite 1-1/16\\\" Thick\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.54,\"500\":0.9,\"1000\":0.98,\"2000\":0.95,\"4000\":0.89,\"8000\":0.95},\"nrc\":0.84,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8dOwYWtU8LYYGI4x\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Optima Open Plan (foil) 2x4 x1-1/2in\",\"absorption\":{\"63\":0.07,\"125\":0.47,\"250\":0.8,\"500\":0.85,\"1000\":0.99,\"2000\":0.99,\"4000\":0.94,\"8000\":0.94},\"nrc\":0.91,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"8f5k4R9XnDaG3WOP\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 703\",\"material\":\"1\\\" Owens Corning 703, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.22,\"125\":0.32,\"250\":0.32,\"500\":0.73,\"1000\":0.93,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8isEMuKmPlfmPawf\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"Rpg Baswaphon\",\"material\":\"RPG BASWAphon, 5mm acoustic plaster, 60 mm mineral wool, A mount\",\"absorption\":{\"63\":0.4,\"125\":0.57,\"250\":0.82,\"500\":0.77,\"1000\":0.65,\"2000\":0.63,\"4000\":0.49,\"8000\":0.63},\"nrc\":0.72,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8jAPNRlzU7bedCNw\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Alpro Perf. Metal Ac. Wall Panels W/1.5\\\" Tk.\",\"material\":\"Alpro Perf. Metal Ac. Wall Panels w/1.5\\\" tk., 1.5\\\" Density Fiberglass (Mount A)\",\"absorption\":{\"63\":0.15,\"125\":0.37,\"250\":0.69,\"500\":0.97,\"1000\":0.93,\"2000\":0.92,\"4000\":0.93,\"8000\":0.94},\"nrc\":0.88,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8o3RtZp5FJ3tYL1w\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3.50\\\" Owens Corning R-11\",\"material\":\"3.50\\\" Owens Corning R-11, FRK faced, Mounting A\",\"absorption\":{\"63\":0.39,\"125\":0.56,\"250\":0.99,\"500\":0.99,\"1000\":0.61,\"2000\":0.4,\"4000\":0.21,\"8000\":0.4},\"nrc\":0.75,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8wWRIKvsCAvJGyGz\"},{\"tags\":[\"Roofing\",\"Roofing Constructons\"],\"manufacturer\":\"\",\"name\":\"Concrete Ceiling Or Roof\",\"material\":\"Concrete ceiling or roof\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.05,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.03,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"8wbIpUL3y5mWXlAI\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Almute (3.0Mm Thick) With 50Mm (2\\\") Glass Wool\",\"material\":\"Almute (3.0mm thick) with 50mm (2\\\") glass wool\",\"absorption\":{\"63\":0.17,\"125\":0.24,\"250\":0.72,\"500\":0.97,\"1000\":0.9,\"2000\":0.73,\"4000\":0.92,\"8000\":0.99},\"nrc\":0.83,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"9292QjXEtGi7OVFT\"},{\"tags\":[\"Plaster\",\"Plaster Constructions\"],\"manufacturer\":\"\",\"name\":\"Smooth Plaster On Block  Beranek\",\"material\":\"Smooth plaster on block  BERANEK\",\"absorption\":{\"63\":0.15,\"125\":0.12,\"250\":0.09,\"500\":0.07,\"1000\":0.05,\"2000\":0.05,\"4000\":0.04,\"8000\":0.05},\"nrc\":0.07,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"95qhnTiyWEMcW3it\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Formedffusor\",\"material\":\"RPG Formedffusor\",\"absorption\":{\"63\":0.34,\"125\":0.49,\"250\":0.45,\"500\":0.43,\"1000\":0.33,\"2000\":0.18,\"4000\":0.19,\"8000\":0.2},\"nrc\":0.35,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"99yCzGuS1VLNqlC3\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Fine Fissured Travertone Tile (1 X 1 X 3/4\\\")\",\"material\":\"Armstrong Fine Fissured Travertone Tile (1 x 1 x 3/4\\\"), direct applied\",\"absorption\":{\"63\":0.02,\"125\":0.04,\"250\":0.27,\"500\":0.66,\"1000\":0.92,\"2000\":0.97,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.71,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"9CiEjansX5dUCR7s\"},{\"tags\":[\"Ceilings\",\"Metal Roof Decks\"],\"manufacturer\":\"\",\"name\":\"Metal Roof Deck\",\"material\":\"Metal roof deck, plain\",\"absorption\":{\"63\":0.15,\"125\":0.4,\"250\":0.3,\"500\":0.15,\"1000\":0.1,\"2000\":0.04,\"4000\":0.12,\"8000\":0.12},\"nrc\":0.15,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"9FCfqm0jMbXw7Vx4\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Chair\",\"material\":\"Chair, metal or wood seat, empty\",\"absorption\":{\"63\":0.06,\"125\":0.15,\"250\":0.19,\"500\":0.22,\"1000\":0.39,\"2000\":0.38,\"4000\":0.3,\"8000\":0.3},\"nrc\":0.3,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"9Ln94HgD2e0bjMLA\"},{\"tags\":[\"Walls\",\"Block\"],\"manufacturer\":\"\",\"name\":\"Block Work\",\"material\":\"Block work, painted\",\"absorption\":{\"63\":0.05,\"125\":0.15,\"250\":0.2,\"500\":0.3,\"1000\":0.3,\"2000\":0.25,\"4000\":0.2,\"8000\":0.2},\"nrc\":0.26,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"9WkBWUpzTTrrYuom\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Students\",\"material\":\"Students, seated in tablet-arm chairs\",\"absorption\":{\"63\":0.1,\"125\":0.3,\"250\":0.41,\"500\":0.49,\"1000\":0.84,\"2000\":0.87,\"4000\":0.84,\"8000\":0.84},\"nrc\":0.65,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"9Yf0FL3KyVU8miwr\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg Frg Omniffusor\",\"material\":\"RPG FRG Omniffusor\",\"absorption\":{\"63\":0.11,\"125\":0.3,\"250\":0.21,\"500\":0.28,\"1000\":0.53,\"2000\":0.21,\"4000\":0.36,\"8000\":0.36},\"nrc\":0.31,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"9c4GIjzUirSIC7Jf\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Designer Minatone  Panel\",\"material\":\"Armstrong Designer Minatone  Panel, (2 x 2 x 5/8\\\"), Mount E-400\",\"absorption\":{\"63\":0.18,\"125\":0.36,\"250\":0.28,\"500\":0.47,\"1000\":0.65,\"2000\":0.76,\"4000\":0.82,\"8000\":0.88},\"nrc\":0.54,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"9hovdNknRahvqTe9\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Woodacoustic C (A.A.V. Ltd)\",\"material\":\"Woodacoustic C (A.A.V. ltd)\",\"absorption\":{\"63\":0,\"125\":0.26,\"250\":0.72,\"500\":0.54,\"1000\":0.42,\"2000\":0.63,\"4000\":0.51,\"8000\":0.51},\"nrc\":0.58,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"9knPIvCNDqOoZm4j\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"1-1/2\\\" Tectum Mounting #4 (Directly To Concrete)\",\"material\":\"1-1/2\\\" Tectum mounting #4 (directly to concrete)\",\"absorption\":{\"63\":0.03,\"125\":0.07,\"250\":0.22,\"500\":0.48,\"1000\":0.82,\"2000\":0.64,\"4000\":0.96,\"8000\":0.99},\"nrc\":0.54,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"9pZlcSxXRNs40Bnd\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 703\",\"material\":\"2\\\" Owens Corning 703, ASJ faced, Mounting A\",\"absorption\":{\"63\":0.33,\"125\":0.47,\"250\":0.62,\"500\":0.99,\"1000\":0.81,\"2000\":0.51,\"4000\":0.32,\"8000\":0.51},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"9td0LKC7tKXaWz6l\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Suspended Acoustic Tile\",\"material\":\"Suspended acoustic tile, mineral fiber\",\"absorption\":{\"63\":0.05,\"125\":0.3,\"250\":0.5,\"500\":0.35,\"1000\":0.8,\"2000\":0.75,\"4000\":0.75,\"8000\":0.75},\"nrc\":0.6,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"9vSsBHby8IgnIdjO\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 6In Type A1; Painted\",\"material\":\"Soundblox 6in Type A1; painted\",\"absorption\":{\"63\":0.2,\"125\":0.62,\"250\":0.84,\"500\":0.36,\"1000\":0.43,\"2000\":0.27,\"4000\":0.5,\"8000\":0.5},\"nrc\":0.48,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"A0ixdQTaIujdUvw9\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Painted Nubby Open Plan 2x4 x 1in\",\"absorption\":{\"63\":0.3,\"125\":0.78,\"250\":0.97,\"500\":0.79,\"1000\":0.98,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"A1ehX4KlNYes0670\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Beranek Unoccupied Average Well-Upholstered Seating Area\",\"material\":\"Beranek unoccupied average well-upholstered seating area, perforated seat bottoms and edge effect\",\"absorption\":{\"63\":0.08,\"125\":0.19,\"250\":0.37,\"500\":0.56,\"1000\":0.67,\"2000\":0.61,\"4000\":0.59,\"8000\":0.61},\"nrc\":0.55,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"A2EbprmwIieru1TH\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Armstrong Soundsoak Panel Vinyl \",\"material\":\"Armstrong SoundSoak Panel Vinyl , Mounting D-20\",\"absorption\":{\"63\":0.13,\"125\":0.18,\"250\":0.54,\"500\":0.44,\"1000\":0.55,\"2000\":0.56,\"4000\":0.45,\"8000\":0.56},\"nrc\":0.52,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AANMgbhga1GkY9qu\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13Fc\",\"material\":\"K13fc, solid backing, 5/8in\",\"absorption\":{\"63\":0.05,\"125\":0.16,\"250\":0.22,\"500\":0.57,\"1000\":0.95,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.68,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"AFr1EmeKGdWTZVDc\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Cirrus 2x2 Classic\",\"absorption\":{\"63\":0.19,\"125\":0.38,\"250\":0.38,\"500\":0.51,\"1000\":0.77,\"2000\":0.89,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.64,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"AGrYZJtTTLxdKF8c\"},{\"tags\":[\"Metals\",\"Metals\"],\"manufacturer\":\"\",\"name\":\"Metal Venetian Blinds\",\"material\":\"Metal venetian blinds\",\"absorption\":{\"63\":0.03,\"125\":0.06,\"250\":0.05,\"500\":0.07,\"1000\":0.15,\"2000\":0.13,\"4000\":0.17,\"8000\":0.21},\"nrc\":0.1,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AIzHVkMKKif0WqRl\"},{\"tags\":[\"Ceilings\",\"Special Ceilings\"],\"manufacturer\":\"\",\"name\":\"Plaster\",\"material\":\"Plaster, 2-1/2in, on ceiling lath with air space\",\"absorption\":{\"63\":0.04,\"125\":0.1,\"250\":0.08,\"500\":0.05,\"1000\":0.04,\"2000\":0.03,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.05,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"AJO37AxEpwv1gAuf\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"25Mm Timber Panels On Air Space And Mineral Wool\",\"material\":\"25mm timber panels on air space and mineral wool\",\"absorption\":{\"63\":0.1,\"125\":0.3,\"250\":0.2,\"500\":0.1,\"1000\":0.1,\"2000\":0.1,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.13,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"AOs9tnDBfIjIoxiB\"},{\"tags\":[\"Air\",\"Air Absorption\"],\"manufacturer\":\"\",\"name\":\"Air (Per 1000 Cu. Ft.) - Relative Humidity 60%\",\"material\":\"Air (per 1000 cu. ft.) - relative humidity 60%\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0,\"500\":0,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.5,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AVgZXPUp0iDsSf43\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - 7.5\\\"\",\"material\":\"Cellular Metal Deck - 7.5\\\"\",\"absorption\":{\"63\":0.45,\"125\":0.75,\"250\":0.99,\"500\":0.95,\"1000\":0.65,\"2000\":0.65,\"4000\":0.55,\"8000\":0.65},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AVre2xxGWPTHGumw\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-4PS, Continuous Mount\",\"absorption\":{\"63\":0.4,\"125\":0.57,\"250\":0.6,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.86,\"8000\":0.99},\"nrc\":0.89,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AXk9VJmwram2Vgc0\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Panels (Solid)\",\"material\":\"Wood Panels (solid), 3/4in, over 1in compressed FG\",\"absorption\":{\"63\":0.08,\"125\":0.2,\"250\":0.15,\"500\":0.08,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.08,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"AY4xVw33jM0FqwsF\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Alpro Perf. Metal Ac. Wall Panels W/1.5\\\" Tk.\",\"material\":\"Alpro Perf. Metal Ac. Wall Panels w/1.5\\\" tk., 1.5\\\" Dens. Fiberglass (Mount E-405)\",\"absorption\":{\"63\":0.35,\"125\":0.74,\"250\":0.97,\"500\":0.87,\"1000\":0.99,\"2000\":0.99,\"4000\":0.95,\"8000\":0.99},\"nrc\":0.96,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Aa1QcNFA2GaFarGd\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Person\",\"material\":\"Person, high school students (per person) est. Knudsen & Harris\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AaGMJJoASXMvJ94d\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"1/4In Pegboard\",\"material\":\"1/4in Pegboard, 9/32in d.@ 1in over 2x4s, 1.5in fuzz\",\"absorption\":{\"63\":0.1,\"125\":0.37,\"250\":0.55,\"500\":0.75,\"1000\":0.35,\"2000\":0.25,\"4000\":0.18,\"8000\":0.18},\"nrc\":0.48,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"Agugh5tBLDLOXg4g\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"2 X 4 Banner\",\"material\":\"2 x 4 banner, 1-1/2in, 3# fiberglass core\",\"absorption\":{\"63\":0.01,\"125\":0.32,\"250\":0.62,\"500\":0.99,\"1000\":0.99,\"2000\":0.86,\"4000\":0.46,\"8000\":0.46},\"nrc\":0.87,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"AkUH2Ht3bHDugVCJ\"},{\"tags\":[\"Wood\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Door (Solid Wood Panel)\",\"material\":\"Door (Solid Wood Panel)\",\"absorption\":{\"63\":0.1,\"125\":0.1,\"250\":0.07,\"500\":0.05,\"1000\":0.04,\"2000\":0.04,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.05,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AlQchZHtTVi67zDD\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"60 Hz Panel Absorber (High Q) - 3/16\\\" Ply W/15\\\" A.S.\",\"material\":\"60 Hz panel absorber (high Q) - 3/16\\\" ply w/15\\\" a.s., no abs.\",\"absorption\":{\"63\":0.92,\"125\":0.46,\"250\":0.2,\"500\":0.15,\"1000\":0.12,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.14,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AlaIxv35YK9w3TV1\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Flutterfree (Non Slotted) - Helmholtz Mount - 1/16\\\" Slot Width - Surface Mount Over 1\\\" 6Pcf Fiberglass\",\"material\":\"RPG FlutterFree (non slotted) - Helmholtz Mount - 1/16\\\" slot width - surface mount over 1\\\" 6PCF fiberglass\",\"absorption\":{\"63\":0.22,\"125\":0.32,\"250\":0.64,\"500\":0.28,\"1000\":0.13,\"2000\":0.16,\"4000\":0.16,\"8000\":0.16},\"nrc\":0.3,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AmJwhzBaYRlLfhuk\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Slotted Concrete Block \",\"material\":\"Slotted concrete block , 6in, Empty void\",\"absorption\":{\"63\":0.2,\"125\":0.62,\"250\":0.84,\"500\":0.36,\"1000\":0.43,\"2000\":0.27,\"4000\":0.3,\"8000\":0.3},\"nrc\":0.48,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"AqBRdGvPmHoH1WsJ\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 705\",\"material\":\"1\\\" Owens Corning 705, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.15,\"125\":0.3,\"250\":0.34,\"500\":0.68,\"1000\":0.87,\"2000\":0.97,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.72,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AqDOlsbf9T4bYplS\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.0H Spacing, Type NF-4\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.44,\"500\":0.64,\"1000\":0.65,\"2000\":0.81,\"4000\":0.46,\"8000\":0.81},\"nrc\":0.64,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AsR3UpsJmBsdiWBI\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Diffuse Signature Wood (3.5\\\" Standoff + 3 Pcf Faced Fg Board)\",\"material\":\"Diffuse Signature Wood (3.5\\\" Standoff + 3 pcf Faced FG Board)\",\"absorption\":{\"63\":0.3,\"125\":0.42,\"250\":0.99,\"500\":0.65,\"1000\":0.29,\"2000\":0.22,\"4000\":0.18,\"8000\":0.22},\"nrc\":0.54,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AvGlUhgMSq4O5Nud\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Asc Tube Trap\",\"material\":\"ASC Tube Trap, 9\\\" Diameter x 2' L, Full-Round - sabines per tube \",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Ay3LbgYxA3dZrcvn\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Kinetics Barrel 2'X4' Flush J-Mounted W/O Damping\",\"material\":\"Kinetics Barrel 2'x4' Flush J-Mounted w/o damping\",\"absorption\":{\"63\":0.19,\"125\":0.64,\"250\":0.29,\"500\":0.25,\"1000\":0.13,\"2000\":0.12,\"4000\":0.17,\"8000\":0.22},\"nrc\":0.2,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"AyF6U2g0ivUoaQbU\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"1/2'' Fabric Panel - Sonotrol\",\"material\":\"1/2'' fabric panel - sonotrol\",\"absorption\":{\"63\":0.05,\"125\":0.07,\"250\":0.14,\"500\":0.46,\"1000\":0.9,\"2000\":0.95,\"4000\":0.79,\"8000\":0.95},\"nrc\":0.61,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"B0kfZhyXRpmr1GPM\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 705\",\"material\":\"2\\\" Owens Corning 705, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.27,\"125\":0.39,\"250\":0.59,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.89,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"B1jj0zbr64iMkLFj\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1\\\" Grace Acoustikote On Solid\",\"material\":\"1\\\" Grace Acoustikote on solid\",\"absorption\":{\"63\":0.03,\"125\":0.04,\"250\":0.3,\"500\":0.8,\"1000\":0.99,\"2000\":0.88,\"4000\":0.93,\"8000\":0.98},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"B1pcnS7P7Dh2POp7\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fabric Wrapped Fg Panel\",\"material\":\"Fabric Wrapped FG Panel, 2in, against solid backing\",\"absorption\":{\"63\":0,\"125\":0.23,\"250\":0.81,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.95,\"source\":\"Decoustics Tests\",\"description\":\"\",\"uuid\":\"B2rPqa7x9y5HnlQ9\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mci Lapendary Banners #110 2\\\" Thick\",\"material\":\"MCI Lapendary Banners #110 2\\\" thick, Perforated PVC\",\"absorption\":{\"63\":0.76,\"125\":0.99,\"250\":0.97,\"500\":0.92,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.97,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"B3WUuGAtRF9n74ka\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 705\",\"material\":\"1\\\" Owens Corning 705, FRK faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.18,\"125\":0.25,\"250\":0.48,\"500\":0.28,\"1000\":0.57,\"2000\":0.39,\"4000\":0.3,\"8000\":0.39},\"nrc\":0.43,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"B9Sc6ZKjzt4Wr7zc\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"4\\\" Owens Corning 703\",\"material\":\"4\\\" Owens Corning 703, plain faced, Mounting A\",\"absorption\":{\"63\":0.59,\"125\":0.84,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.97,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"BDA5IwzeZl2jPoU1\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Cafco Soundcote On Solid Base\",\"material\":\"1/2\\\" Cafco SoundCote on solid base\",\"absorption\":{\"63\":0.03,\"125\":0.06,\"250\":0.2,\"500\":0.48,\"1000\":0.54,\"2000\":0.67,\"4000\":0.79,\"8000\":0.91},\"nrc\":0.47,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"BFNmvjycddCSTyPO\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 4' Type I Wall Diffuser\",\"material\":\"Wenger 4' x 4' Type I Wall Diffuser, Convex (E-9/32\\\")\",\"absorption\":{\"63\":0.18,\"125\":0.25,\"250\":0.14,\"500\":0.11,\"1000\":0.1,\"2000\":0.13,\"4000\":0.16,\"8000\":0.19},\"nrc\":0.12,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"BHyYXm4txkuZxuFE\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 8In Type Rr; Painted\",\"material\":\"Soundblox 8in Type RR; painted\",\"absorption\":{\"63\":0.16,\"125\":0.61,\"250\":0.91,\"500\":0.65,\"1000\":0.65,\"2000\":0.42,\"4000\":0.49,\"8000\":0.49},\"nrc\":0.66,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"BPZw8qS1D1IWJDTh\"},{\"tags\":[\"Wood\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"1/4\\\" Hardwood On Wood Frame  From O/C & Aima?\",\"material\":\"1/4\\\" Hardwood on wood frame  from O/C & AIMA?\",\"absorption\":{\"63\":0.65,\"125\":0.58,\"250\":0.22,\"500\":0.07,\"1000\":0.04,\"2000\":0.03,\"4000\":0.07,\"8000\":0.11},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"BPkHQntmCBnSHTNK\"},{\"tags\":[\"Walls\",\"Mineral wool\"],\"manufacturer\":\"\",\"name\":\"50Mm Mineral Wool On 50Mm Air Space On Solid\",\"material\":\"50mm mineral wool on 50mm air space on solid\",\"absorption\":{\"63\":0.08,\"125\":0.45,\"250\":0.75,\"500\":0.8,\"1000\":0.85,\"2000\":0.9,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.83,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"BUuykegk306jWpEc\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 705\",\"material\":\"2\\\" Owens Corning 705, plain faced, Mounting A\",\"absorption\":{\"63\":0.08,\"125\":0.16,\"250\":0.71,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.92,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"BchSQFgQtvws0fV9\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Hemiffusor\",\"material\":\"RPG Hemiffusor\",\"absorption\":{\"63\":0.2,\"125\":0.21,\"250\":0.54,\"500\":0.42,\"1000\":0.37,\"2000\":0.25,\"4000\":0.21,\"8000\":0.25},\"nrc\":0.4,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"BjvliNh5g5KNyBnE\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Almute (2.5Mm Thick) With 50Mm (2\\\") Airspace\",\"material\":\"Almute (2.5mm thick) with 50mm (2\\\") airspace\",\"absorption\":{\"63\":0.08,\"125\":0.12,\"250\":0.34,\"500\":0.58,\"1000\":0.81,\"2000\":0.82,\"4000\":0.64,\"8000\":0.82},\"nrc\":0.64,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"BqrJDBW17ukxYWbb\"},{\"tags\":[\"Walls\",\"Concrete Block\"],\"manufacturer\":\"\",\"name\":\"Cmu\",\"material\":\"CMU, painted\",\"absorption\":{\"63\":0.03,\"125\":0.1,\"250\":0.05,\"500\":0.06,\"1000\":0.07,\"2000\":0.09,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.07,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"ByswUBFezm3zBKiE\"},{\"tags\":[\"Outdoors\",\"Snow\"],\"manufacturer\":\"\",\"name\":\"Snow\",\"material\":\"Snow, 4in Deep, freshly fallen (not packed)\",\"absorption\":{\"63\":0.08,\"125\":0.45,\"250\":0.75,\"500\":0.9,\"1000\":0.95,\"2000\":0.95,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.89,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"C7l01nK1BWeeHmOt\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.0H Spacing, Type NF-4P\",\"absorption\":{\"63\":0.14,\"125\":0.2,\"250\":0.39,\"500\":0.59,\"1000\":0.59,\"2000\":0.7,\"4000\":0.42,\"8000\":0.7},\"nrc\":0.57,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"CEK6o8WPrr7n0lx5\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Fissured Minatone Tile (1 X 1 X 5/8\\\")\",\"material\":\"Armstrong Fissured Minatone Tile (1 x 1 x 5/8\\\"), direct applied\",\"absorption\":{\"63\":0.04,\"125\":0.08,\"250\":0.25,\"500\":0.6,\"1000\":0.8,\"2000\":0.82,\"4000\":0.81,\"8000\":0.82},\"nrc\":0.62,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"CN3xzdHXWN80ugbX\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Profillia A (A.A.V. Ltd)\",\"material\":\"Profillia A (A.A.V. ltd)\",\"absorption\":{\"63\":0,\"125\":0.1,\"250\":0.35,\"500\":0.8,\"1000\":0.4,\"2000\":0.25,\"4000\":0.35,\"8000\":0.35},\"nrc\":0.45,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"CQTcpshAe7X4Sjh5\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Flutterfree (Slotted) - Helmholtz Mount - 1/4\\\" Slot Width / 1.125\\\" Slot Spacing - 3.5\\\" Cavity Mount With 1\\\" 6Pcf Fiberglass Backing\",\"material\":\"RPG FlutterFree (slotted) - Helmholtz Mount - 1/4\\\" slot width / 1.125\\\" slot spacing - 3.5\\\" cavity mount with 1\\\" 6PCF fiberglass backing\",\"absorption\":{\"63\":0.28,\"125\":0.4,\"250\":0.78,\"500\":0.92,\"1000\":0.62,\"2000\":0.43,\"4000\":0.44,\"8000\":0.45},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"CQXqTDa451lPCEgR\"},{\"tags\":[\"People\",\"Pews\"],\"manufacturer\":\"\",\"name\":\"Pews; All Types; Occupied\",\"material\":\"Pews; all types; occupied\",\"absorption\":{\"63\":0.23,\"125\":0.55,\"250\":0.65,\"500\":0.78,\"1000\":0.88,\"2000\":0.91,\"4000\":0.82,\"8000\":0.82},\"nrc\":0.81,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"CVhsHUf1OwG908Hk\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1\\\" Grace Acoustikote On Lath Over Air Space\",\"material\":\"1\\\" Grace Acoustikote on lath over air space\",\"absorption\":{\"63\":0.3,\"125\":0.44,\"250\":0.53,\"500\":0.64,\"1000\":0.88,\"2000\":0.96,\"4000\":0.98,\"8000\":0.99},\"nrc\":0.75,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"CWluieb5Ffi6nUAg\"},{\"tags\":[\"Floors\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Poured Concrete Floor\",\"material\":\"Poured Concrete Floor, all, painted or sealed\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.02,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"Beranek (C&OH '96)\",\"description\":\"\",\"uuid\":\"CaVvGQoCf2Rry73j\"},{\"tags\":[\"Ceiling\",\" Ceiling Systems\"],\"manufacturer\":\"\",\"name\":\"Alcan Metal Ceiling Deck With 1.5 In. Insulation\",\"material\":\"Alcan Metal Ceiling Deck with 1.5 in. Insulation\",\"absorption\":{\"63\":0.3,\"125\":0.63,\"250\":0.84,\"500\":0.77,\"1000\":0.76,\"2000\":0.45,\"4000\":0.5,\"8000\":0.55},\"nrc\":0.71,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Cb0Pe9PLiKXyxqxx\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Thin Porous Sound-Abosrbing Material\",\"material\":\"Thin porous sound-abosrbing material, 3/4in thick\",\"absorption\":{\"63\":0,\"125\":0.1,\"250\":0.6,\"500\":0.8,\"1000\":0.82,\"2000\":0.78,\"4000\":0.6,\"8000\":0.6},\"nrc\":0.75,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"CbMaUzhoaH19Rt8K\"},{\"tags\":[\"People\",\"Pews\"],\"manufacturer\":\"\",\"name\":\"Pews; Upholstered; Full\",\"material\":\"Pews; upholstered; full\",\"absorption\":{\"63\":0.19,\"125\":0.52,\"250\":0.67,\"500\":0.8,\"1000\":0.91,\"2000\":0.91,\"4000\":0.8,\"8000\":0.8},\"nrc\":0.82,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"CeoiNqvwMlGo6EJh\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass (1 Lb./Sq. Ft.)\",\"material\":\"Fiberglass (1 lb./sq. ft.), 2\\\" thick, semi-rigid battens on solid backing\",\"absorption\":{\"63\":0.1,\"125\":0.15,\"250\":0.4,\"500\":0.75,\"1000\":0.85,\"2000\":0.8,\"4000\":0.85,\"8000\":0.9},\"nrc\":0.7,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"CfhSTB4kOSgZySsc\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"44Mm Flush Door\",\"material\":\"44mm flush door\",\"absorption\":{\"63\":0.08,\"125\":0.25,\"250\":0.15,\"500\":0.1,\"1000\":0.08,\"2000\":0.08,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.1,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"CjbPJVAK2tk9f0W1\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Heavy Carpet On Concrete\",\"material\":\"Heavy carpet on concrete\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.06,\"500\":0.14,\"1000\":0.37,\"2000\":0.6,\"4000\":0.65,\"8000\":0.7},\"nrc\":0.29,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Cn4bj8vnFeFCiYPM\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Armstrong Soundsoak Panel Vinyl \",\"material\":\"Armstrong SoundSoak Panel Vinyl , Mounting A\",\"absorption\":{\"63\":0.08,\"125\":0.12,\"250\":0.31,\"500\":0.51,\"1000\":0.59,\"2000\":0.59,\"4000\":0.49,\"8000\":0.59},\"nrc\":0.5,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Co6smWfe2W9lMVY6\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.5H Spacing, Type NF-2PS\",\"absorption\":{\"63\":0.09,\"125\":0.13,\"250\":0.42,\"500\":0.56,\"1000\":0.77,\"2000\":0.83,\"4000\":0.45,\"8000\":0.83},\"nrc\":0.65,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"CqVdV1STU2eHDHpc\"},{\"tags\":[\"Roofing\",\"Roofing Constructons\"],\"manufacturer\":\"\",\"name\":\"Boardered Roof - Underside Of Pitched Slate Or Tile Covering\",\"material\":\"Boardered roof - underside of pitched slate or tile covering\",\"absorption\":{\"63\":0.2,\"125\":0.15,\"250\":0.12,\"500\":0.1,\"1000\":0.1,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.11,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"CsIrW6CZQBveuvgL\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Single 100% Gathers\",\"material\":\"32oz. Single 100% gathers, 5\\\" to track, closed side edges - most current data, based on actual tests\",\"absorption\":{\"63\":0.31,\"125\":0.44,\"250\":0.86,\"500\":0.96,\"1000\":0.89,\"2000\":0.95,\"4000\":0.92,\"8000\":0.95},\"nrc\":0.92,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"CujMDrjA0IeCEuVn\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Glass\",\"material\":\"Glass, 1/4in, monolithic\",\"absorption\":{\"63\":0.13,\"125\":0.35,\"250\":0.25,\"500\":0.18,\"1000\":0.12,\"2000\":0.07,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.16,\"source\":\"C&A Files\",\"description\":\"\",\"uuid\":\"D6DSvHNEQURJ6aIb\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Ribbed Metal Acoustical Deck - 4.5\\\" Rib\",\"material\":\"Ribbed metal acoustical deck - 4.5\\\" Rib\",\"absorption\":{\"63\":0.48,\"125\":0.8,\"250\":0.99,\"500\":0.99,\"1000\":0.75,\"2000\":0.5,\"4000\":0.4,\"8000\":0.5},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DFFu0wSz9ynVGZEJ\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Leather Panel On Mineral Wool On Solid\",\"material\":\"Leather panel on mineral wool on solid\",\"absorption\":{\"63\":0.13,\"125\":0.5,\"250\":0.25,\"500\":0.15,\"1000\":0.1,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.15,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"DFflpXsQwhX4sOHH\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloud-Lite Baffels 2600-2015 ((2'X4'\",\"material\":\"MBI Cloud-Lite Baffels 2600-2015 ((2'x4', 2\\\" thick, 1.5# density) 2 Mil PVC\",\"absorption\":{\"63\":0.28,\"125\":0.4,\"250\":0.74,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DHmC3poTlT7tVPPP\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Velour\",\"material\":\"Velour, 17 oz/sq yd hung free in space (fullness unknown) man. lab test data Rosco 4-91\",\"absorption\":{\"63\":0.08,\"125\":0.15,\"250\":0.3,\"500\":0.6,\"1000\":0.77,\"2000\":0.93,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.65,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DK8iWT0eJYOqjnae\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone Firecode Panels\",\"material\":\"USG Auratone Firecode panels, Omni 339 5/8 2x4\",\"absorption\":{\"63\":0.15,\"125\":0.35,\"250\":0.29,\"500\":0.58,\"1000\":0.93,\"2000\":0.77,\"4000\":0.64,\"8000\":0.64},\"nrc\":0.64,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"DOQokZwpbgrigYrg\"},{\"tags\":[\"Glass\",\"Glass\"],\"manufacturer\":\"\",\"name\":\"Heavy Plate Glass\",\"material\":\"Heavy plate glass\",\"absorption\":{\"63\":0.2,\"125\":0.18,\"250\":0.06,\"500\":0.04,\"1000\":0.03,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.04,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DRSxRCj2AOHAZptf\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.0H Spacing, Type NF-2\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.32,\"500\":0.48,\"1000\":0.47,\"2000\":0.66,\"4000\":0.43,\"8000\":0.66},\"nrc\":0.48,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DSWac8KouGQ9kmfq\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno 4 A-Mounted Over 2\\\" Fiberglass Core\",\"material\":\"Kinetics Sereno 4 A-Mounted over 2\\\" Fiberglass Core\",\"absorption\":{\"63\":0.25,\"125\":0.54,\"250\":0.7,\"500\":0.53,\"1000\":0.38,\"2000\":0.31,\"4000\":0.28,\"8000\":0.31},\"nrc\":0.48,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DSnP1WvqgIF1GOGp\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, thin hair cord on woodboard floor\",\"absorption\":{\"63\":0.15,\"125\":0.2,\"250\":0.25,\"500\":0.3,\"1000\":0.3,\"2000\":0.3,\"4000\":0.3,\"8000\":0.3},\"nrc\":0.29,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DTfbo2T1eREMdoAi\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1+2 @ 5/8in on  3-5/8in studs\",\"absorption\":{\"63\":0.04,\"125\":0.19,\"250\":0.09,\"500\":0.06,\"1000\":0.05,\"2000\":0.05,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.06,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"DUCYM0kksPpWjd7g\"},{\"tags\":[\"Walls\",\"Plasterboard\"],\"manufacturer\":\"\",\"name\":\"9Mm P/Board On 25Mm Air Space\",\"material\":\"9mm p/board on 25mm air space, w/ m/wool on solid\",\"absorption\":{\"63\":0.1,\"125\":0.4,\"250\":0.2,\"500\":0.15,\"1000\":0.1,\"2000\":0.1,\"4000\":0.09,\"8000\":0.09},\"nrc\":0.14,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"DV9XyoLltGQXYLcR\"},{\"tags\":[\"Common\",\"Common Materials\"],\"manufacturer\":\"\",\"name\":\"Unglazed Painted Brick\",\"material\":\"Unglazed painted brick\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.02,\"1000\":0.02,\"2000\":0.02,\"4000\":0.03,\"8000\":0.04},\"nrc\":0.02,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DXob7Bz7g0P0K1gQ\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 705\",\"material\":\"2\\\" Owens Corning 705, FRK faced, Mounting A\",\"absorption\":{\"63\":0.42,\"125\":0.6,\"250\":0.5,\"500\":0.63,\"1000\":0.82,\"2000\":0.45,\"4000\":0.34,\"8000\":0.45},\"nrc\":0.6,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DYb0MPF92jxJm9sd\"},{\"tags\":[\"Soundblocks\",\"Soundblocks\"],\"manufacturer\":\"\",\"name\":\"Proudfoot 'Soundblox' \",\"material\":\"Proudfoot 'Soundblox' , 12 -in., Type RSC Painted (63 Hz est.)\",\"absorption\":{\"63\":0.4,\"125\":0.57,\"250\":0.76,\"500\":0.99,\"1000\":0.94,\"2000\":0.54,\"4000\":0.59,\"8000\":0.64},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DbLjZmglycdlG1TY\"},{\"tags\":[\"Glass\",\"Glass\"],\"manufacturer\":\"\",\"name\":\"Typical Window Glass\",\"material\":\"Typical window glass\",\"absorption\":{\"63\":0.4,\"125\":0.35,\"250\":0.25,\"500\":0.18,\"1000\":0.12,\"2000\":0.07,\"4000\":0.04,\"8000\":0.07},\"nrc\":0.16,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DgYoeddEQiqZ8q0k\"},{\"tags\":[\"Environmental\",\"Environmental Materials\"],\"manufacturer\":\"\",\"name\":\"Soil (Rough)\",\"material\":\"Soil (rough)\",\"absorption\":{\"63\":0.1,\"125\":0.15,\"250\":0.25,\"500\":0.4,\"1000\":0.55,\"2000\":0.6,\"4000\":0.6,\"8000\":0.6},\"nrc\":0.45,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Dgl3QRVn4ub32CAS\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Tectum Fabritough Panels\",\"material\":\"Tectum FabriTough panels, Mtg. D-20, insulation\",\"absorption\":{\"63\":0.04,\"125\":0.13,\"250\":0.19,\"500\":0.45,\"1000\":0.86,\"2000\":0.8,\"4000\":0.84,\"8000\":0.84},\"nrc\":0.58,\"source\":\"Tectum data\",\"description\":\"\",\"uuid\":\"DkqDqz1XPcYTh6Ym\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Wenger\",\"material\":\"Wenger, Type 1 diffuser, 4x4, wall mounted, A, PSF\",\"absorption\":{\"63\":0.07,\"125\":0.13,\"250\":0.13,\"500\":0.05,\"1000\":0.02,\"2000\":0.06,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.07,\"source\":\"Wenger data\",\"description\":\"\",\"uuid\":\"DmkOs1Sl6usBYyUx\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Audience In Wood Or Padded Seat\",\"material\":\"Audience in wood or padded seat\",\"absorption\":{\"63\":0,\"125\":0.16,\"250\":0.35,\"500\":0.4,\"1000\":0.4,\"2000\":0.44,\"4000\":0.4,\"8000\":0.4},\"nrc\":0.4,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"DrHTUw4ox4tGNV9Y\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Gypsum Board In Lay-In Tile System Egan\",\"material\":\"1/2\\\" gypsum board in lay-in tile system EGAN\",\"absorption\":{\"63\":0.2,\"125\":0.15,\"250\":0.1,\"500\":0.05,\"1000\":0.04,\"2000\":0.07,\"4000\":0.09,\"8000\":0.11},\"nrc\":0.07,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DwK0nTYkiuAejLh2\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Unoccupied Wood Theater Seats\",\"material\":\"Unoccupied Wood Theater Seats\",\"absorption\":{\"63\":0.02,\"125\":0.03,\"250\":0.04,\"500\":0.05,\"1000\":0.07,\"2000\":0.08,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"DzkEHx50gIynGjwR\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"4\\\" Owens Corning 703\",\"material\":\"4\\\" Owens Corning 703, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.43,\"125\":0.62,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"E03vk4GdkQRXNiKk\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Ensemble E-400 Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Ensemble E-400 Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.44,\"125\":0.8,\"250\":0.78,\"500\":0.8,\"1000\":0.97,\"2000\":0.82,\"4000\":0.64,\"8000\":0.82},\"nrc\":0.84,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"E4eczAYUmnW5Jrtk\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Flat Double Layer\",\"material\":\"25oz. Flat double layer, 4\\\" separation, 8\\\" behind rear fabric, closed side edges\",\"absorption\":{\"63\":0.37,\"125\":0.53,\"250\":0.63,\"500\":0.81,\"1000\":0.87,\"2000\":0.81,\"4000\":0.74,\"8000\":0.81},\"nrc\":0.78,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"EFbdjWbZrJuedtpV\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"4\\\" Owens Corning 703\",\"material\":\"4\\\" Owens Corning 703, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.46,\"125\":0.65,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"EHHyhN3NGMns290B\"},{\"tags\":[\"General\",\"General\"],\"manufacturer\":\"\",\"name\":\"Open Window (Dimensions Must Be Greater Than Sound Wavelength)\",\"material\":\"Open window (dimensions must be greater than sound wavelength)\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"EPuypJSpcw916ltP\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Timber Bench/Panels\",\"material\":\"Timber bench/panels\",\"absorption\":{\"63\":0.08,\"125\":0.25,\"250\":0.35,\"500\":0.4,\"1000\":0.4,\"2000\":0.4,\"4000\":0.4,\"8000\":0.4},\"nrc\":0.39,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"EaMvBaTsYkqM0BkP\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Shredded-Wood Fiberboard\",\"material\":\"Shredded-wood fiberboard, 2in thick on concrete\",\"absorption\":{\"63\":0.02,\"125\":0.15,\"250\":0.26,\"500\":0.62,\"1000\":0.94,\"2000\":0.64,\"4000\":0.6,\"8000\":0.6},\"nrc\":0.62,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"EarYrj91zwKq7s7L\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Alpro Perf. Metal Ac. Wall Panels W/4\\\" Tk.\",\"material\":\"Alpro Perf. Metal Ac. Wall Panels w/4\\\" tk., 1.5\\\" Dens. Fiberglass (Mount A) ,13% O.A. \",\"absorption\":{\"63\":0.4,\"125\":0.66,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.94,\"4000\":0.7,\"8000\":0.94},\"nrc\":0.98,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Ee8subnIvadskLfL\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Tonewood Acoustic Cladding\",\"material\":\"Tonewood acoustic cladding\",\"absorption\":{\"63\":0,\"125\":0.08,\"250\":0.35,\"500\":0.8,\"1000\":0.7,\"2000\":0.55,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.6,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"EegHQ6CxMQDru8ac\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"Rpg Baswaphon\",\"material\":\"RPG BASWAphon, 5mm acoustic plaster, 30 mm mineral wool, A mount\",\"absorption\":{\"63\":0.23,\"125\":0.33,\"250\":0.54,\"500\":0.82,\"1000\":0.79,\"2000\":0.74,\"4000\":0.52,\"8000\":0.74},\"nrc\":0.72,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Ejuz6TGB0UekA7ue\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Velour\",\"material\":\"Velour, 18 oz/sq yd at wall (0% fullness) P.E.Sabine\",\"absorption\":{\"63\":0.03,\"125\":0.05,\"250\":0.12,\"500\":0.35,\"1000\":0.45,\"2000\":0.38,\"4000\":0.36,\"8000\":0.38},\"nrc\":0.33,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Emf7t4bJWeM8G0sG\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone 3In Thick\",\"material\":\"IAC Varitone 3in thick, Polymer & Spacer\",\"absorption\":{\"63\":0.3,\"125\":0.65,\"250\":0.7,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.89,\"8000\":0.89},\"nrc\":0.92,\"source\":\"IAC data\",\"description\":\"\",\"uuid\":\"Eujk4FwpgNCCz6Aw\"},{\"tags\":[\"Walls\",\"Plasterboard\"],\"manufacturer\":\"\",\"name\":\"9Mm P/Board + 50Mm Stud + 9Mm P/Board\",\"material\":\"9mm p/board + 50mm stud + 9mm p/board\",\"absorption\":{\"63\":0.08,\"125\":0.3,\"250\":0.15,\"500\":0.1,\"1000\":0.05,\"2000\":0.04,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.09,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"F3Ws1qSJzZJAn9yT\"},{\"tags\":[\"Metals\",\"Metals\"],\"manufacturer\":\"\",\"name\":\"Metal Venetian Blinds\",\"material\":\"Metal venetian blinds, 45 degree angle, 5\\\" from wall AMA\",\"absorption\":{\"63\":0.04,\"125\":0.07,\"250\":0.05,\"500\":0.1,\"1000\":0.16,\"2000\":0.13,\"4000\":0.18,\"8000\":0.23},\"nrc\":0.11,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"F3i0DMvkQ1JiQpe6\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1\\\" Cafco 300 Fireproofing Spray\",\"material\":\"1\\\" Cafco 300 Fireproofing Spray\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.21,\"500\":0.47,\"1000\":0.6,\"2000\":0.74,\"4000\":0.94,\"8000\":0.99},\"nrc\":0.51,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"F4GrzWF2Z80toA4t\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Mbi Colorsonix 1800 Wall Panel 1\\\" Thick\",\"material\":\"MBI Colorsonix 1800 Wall Panel 1\\\" thick, 6# density, Fabric\",\"absorption\":{\"63\":0.06,\"125\":0.09,\"250\":0.32,\"500\":0.85,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.79,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"F6sCyoNKR011ebZO\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"3Mm Perf. On Large Air Space With Mineral Wool\",\"material\":\"3mm perf. on large air space with mineral wool\",\"absorption\":{\"63\":0.18,\"125\":0.4,\"250\":0.45,\"500\":0.65,\"1000\":0.8,\"2000\":0.9,\"4000\":0.85,\"8000\":0.85},\"nrc\":0.7,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"FCiBOEWtuTNn9pxl\"},{\"tags\":[\"Environmental\",\"Environmental Materials\"],\"manufacturer\":\"\",\"name\":\"Soil\",\"material\":\"Soil, gravel 4\\\" thick\",\"absorption\":{\"63\":0.2,\"125\":0.3,\"250\":0.6,\"500\":0.65,\"1000\":0.75,\"2000\":0.75,\"4000\":0.8,\"8000\":0.85},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"FGArpoVJgEZ1fPKy\"},{\"tags\":[\"Wood\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"1/4\\\" Masonite Over 1\\\" Air Space  From Canadian Interiors 1976\",\"material\":\"1/4\\\" Masonite over 1\\\" air space  from Canadian Interiors 1976\",\"absorption\":{\"63\":0.28,\"125\":0.12,\"250\":0.28,\"500\":0.19,\"1000\":0.18,\"2000\":0.19,\"4000\":0.15,\"8000\":0.19},\"nrc\":0.21,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"FI9im0ZmqhMsrZKZ\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Decoustics 2\\\" Thick\",\"material\":\"Decoustics 2\\\" thick, Type AP Fabric-wrapped fiberglass panel, A mounting\",\"absorption\":{\"63\":0.16,\"125\":0.23,\"250\":0.81,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.95,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"FKjFvDs9hL4Q26NU\"},{\"tags\":[\"Common\",\"Common Materials\"],\"manufacturer\":\"\",\"name\":\"Concrete Or Terrazzo Wall\",\"material\":\"Concrete or terrazzo wall\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.01,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"FKyB9z6E6QFRDBFZ\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3\\\" Owens Corning 705\",\"material\":\"3\\\" Owens Corning 705, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.46,\"125\":0.66,\"250\":0.92,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.97,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"FUfrM5WMCmJdYBo8\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics A.P. Vinyl 2In\",\"material\":\"Decoustics a.p. vinyl 2in\",\"absorption\":{\"63\":0,\"125\":0.23,\"250\":0.81,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.95,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"FbbZZkrN9GdsHm4p\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 705\",\"material\":\"2\\\" Owens Corning 705, ASJ faced, Mounting E-405\",\"absorption\":{\"63\":0.29,\"125\":0.42,\"250\":0.35,\"500\":0.69,\"1000\":0.8,\"2000\":0.55,\"4000\":0.42,\"8000\":0.55},\"nrc\":0.6,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"FehvMh5zLX2oa51i\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Occupied Wood Theater Seats\",\"material\":\"Occupied Wood Theater Seats\",\"absorption\":{\"63\":0.35,\"125\":0.5,\"250\":0.3,\"500\":0.4,\"1000\":0.76,\"2000\":0.8,\"4000\":0.76,\"8000\":0.8},\"nrc\":0.57,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"FksfDuxPZyak8Udr\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Drapery\",\"material\":\"Drapery, 24 oz./sq. yd., on wall (50% fullness)\",\"absorption\":{\"63\":0.04,\"125\":0.1,\"250\":0.26,\"500\":0.47,\"1000\":0.61,\"2000\":0.57,\"4000\":0.53,\"8000\":0.57},\"nrc\":0.48,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"FzGIJVvr9mmVhFjv\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"Baswaphon\",\"material\":\"BASWAphon, 40mm Classic Fine Finish\",\"absorption\":{\"63\":0.4,\"125\":0.31,\"250\":0.63,\"500\":0.98,\"1000\":0.9,\"2000\":0.87,\"4000\":0.76,\"8000\":0.87},\"nrc\":0.85,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"G12cC34nZ0DvwT46\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Armstrong Soundsoak Panel 85 \",\"material\":\"Armstrong SoundSoak Panel 85 , Mounting A\",\"absorption\":{\"63\":0.12,\"125\":0.17,\"250\":0.51,\"500\":0.92,\"1000\":0.98,\"2000\":0.97,\"4000\":0.97,\"8000\":0.97},\"nrc\":0.85,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"G8VCxvidXtMNOjnp\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Pebble Open Plan (foil) 2x4 x1in\",\"absorption\":{\"63\":0.28,\"125\":0.73,\"250\":0.9,\"500\":0.71,\"1000\":0.96,\"2000\":0.98,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.89,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"G9Mj1Dy8ktwCl3M4\"},{\"tags\":[\"Ceilings\",\"Gypsum Board Ceilings\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1/2in thick, in suspension system\",\"absorption\":{\"63\":0.05,\"125\":0.15,\"250\":0.1,\"500\":0.05,\"1000\":0.04,\"2000\":0.07,\"4000\":0.09,\"8000\":0.09},\"nrc\":0.07,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"GHKZw9BLPSQs11xI\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone Firecode\",\"material\":\"USG Acoustone Firecode, 3/4in, 2x2 panels, F fissured 141\",\"absorption\":{\"63\":0.16,\"125\":0.37,\"250\":0.32,\"500\":0.67,\"1000\":0.99,\"2000\":0.92,\"4000\":0.92,\"8000\":0.92},\"nrc\":0.73,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"GLmaF3hKQOC9YpDf\"},{\"tags\":[\"Wood\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"1/4\\\" Plywood 3\\\" Air Space With 1\\\" Fuzz  From Nrc Canada\",\"material\":\"1/4\\\" Plywood 3\\\" air space with 1\\\" fuzz  from NRC Canada\",\"absorption\":{\"63\":0.7,\"125\":0.6,\"250\":0.3,\"500\":0.1,\"1000\":0.09,\"2000\":0.09,\"4000\":0.09,\"8000\":0.09},\"nrc\":0.15,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"GSLfQSuJ2iC9QJtN\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plywood. 3/4In/Air\",\"material\":\"Plywood. 3/4in/air\",\"absorption\":{\"63\":0.09,\"125\":0.2,\"250\":0.18,\"500\":0.15,\"1000\":0.12,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.14,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"GVM6XGEmIoWLx0Hc\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Fabric\",\"material\":\"Fabric, 18 oz velour, 50% full\",\"absorption\":{\"63\":0,\"125\":0.14,\"250\":0.35,\"500\":0.55,\"1000\":0.72,\"2000\":0.7,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.58,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"GeC3GnmO9WaqN89c\"},{\"tags\":[\"People\",\"Heavily upholstered\"],\"manufacturer\":\"\",\"name\":\"Leather Upholstered Seats\",\"material\":\"Leather upholstered seats, empty\",\"absorption\":{\"63\":0.17,\"125\":0.44,\"250\":0.54,\"500\":0.6,\"1000\":0.62,\"2000\":0.58,\"4000\":0.5,\"8000\":0.5},\"nrc\":0.59,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"GeHoyBhW5052kicN\"},{\"tags\":[\"Walls\",\"Brick\"],\"manufacturer\":\"\",\"name\":\"Claro Panels\",\"material\":\"Claro Panels, 1in, over air space\",\"absorption\":{\"63\":0.16,\"125\":0.47,\"250\":0.63,\"500\":0.82,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.86,\"source\":\"Decoustics Tests\",\"description\":\"\",\"uuid\":\"GnXpGhi0MbDrg5j7\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Unoccupied\",\"material\":\"Unoccupied, medium upholstered (Beranek 1998)\",\"absorption\":{\"63\":0.38,\"125\":0.54,\"250\":0.62,\"500\":0.68,\"1000\":0.7,\"2000\":0.68,\"4000\":0.66,\"8000\":0.68},\"nrc\":0.67,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"GtZur8okkSdwqTIS\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Sanserra Angled Tegular 2x2\",\"absorption\":{\"63\":0.16,\"125\":0.35,\"250\":0.32,\"500\":0.54,\"1000\":0.81,\"2000\":0.91,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.65,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"GuZbRkB1Zv4lFOON\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"1\\\" Tectum Mounting #5 (1\\\" X 3\\\" Battens\",\"material\":\"1\\\" Tectum mounting #5 (1\\\" x 3\\\" battens, 24\\\" center, over 1\\\" fiberglass backing)\",\"absorption\":{\"63\":0.05,\"125\":0.16,\"250\":0.43,\"500\":0.99,\"1000\":0.99,\"2000\":0.79,\"4000\":0.98,\"8000\":0.99},\"nrc\":0.8,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"H48styXx1bfxcmax\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Picado With 0.9Mm Micro-Perforations E-400 Mounted\",\"material\":\"Kinetics Picado with 0.9mm micro-perforations E-400 Mounted\",\"absorption\":{\"63\":0.36,\"125\":0.84,\"250\":0.86,\"500\":0.67,\"1000\":0.66,\"2000\":0.72,\"4000\":0.63,\"8000\":0.72},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"H8LGpEPj34peQJfw\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"1\\\" Fabric Covered Wall Panel\",\"material\":\"1\\\" fabric covered wall panel, Don Jon mounting #4\",\"absorption\":{\"63\":0.01,\"125\":0.09,\"250\":0.29,\"500\":0.78,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.76,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HCnTHVaeX2nAlSeX\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1\\\" Pyrok Acoustement Plaster 20\",\"material\":\"1\\\" Pyrok Acoustement Plaster 20\",\"absorption\":{\"63\":0.08,\"125\":0.15,\"250\":0.39,\"500\":0.61,\"1000\":0.75,\"2000\":0.85,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.65,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HDLGRSsU61d15kc7\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Mbi Colorsonix Weather Resistant (Eterior Use) 2\\\" Thick\",\"material\":\"MBI Colorsonix Weather Resistant (Eterior Use) 2\\\" thick, Perforated Cypress Fabric\",\"absorption\":{\"63\":0.29,\"125\":0.41,\"250\":0.84,\"500\":0.99,\"1000\":0.99,\"2000\":0.97,\"4000\":0.86,\"8000\":0.97},\"nrc\":0.95,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HDZCFxhX209YuxuK\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Orion 210 Climaplus 1/2 2X4\",\"material\":\"USG Orion 210 ClimaPlus 1/2 2x4\",\"absorption\":{\"63\":0.34,\"125\":0.73,\"250\":0.67,\"500\":0.63,\"1000\":0.81,\"2000\":0.74,\"4000\":0.42,\"8000\":0.42},\"nrc\":0.71,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"HE0tEWpadaH146WA\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.5H Spacing, Type NF-2\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.33,\"500\":0.59,\"1000\":0.64,\"2000\":0.8,\"4000\":0.5,\"8000\":0.8},\"nrc\":0.59,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HNSj3jbhsXxdO4v9\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 703\",\"material\":\"2\\\" Owens Corning 703, FRK faced, Mounting A\",\"absorption\":{\"63\":0.44,\"125\":0.63,\"250\":0.56,\"500\":0.95,\"1000\":0.74,\"2000\":0.6,\"4000\":0.35,\"8000\":0.6},\"nrc\":0.71,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HSXna37sYn3YLvUw\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Alto 16 A-Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Alto 16 A-Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.11,\"125\":0.18,\"250\":0.54,\"500\":0.91,\"1000\":0.96,\"2000\":0.78,\"4000\":0.66,\"8000\":0.78},\"nrc\":0.8,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HTgMM9aWhiFBN5G8\"},{\"tags\":[\"People\",\"Pews\"],\"manufacturer\":\"\",\"name\":\"Pews; Upholstered\",\"material\":\"Pews; upholstered, empty\",\"absorption\":{\"63\":0.14,\"125\":0.34,\"250\":0.41,\"500\":0.43,\"1000\":0.44,\"2000\":0.46,\"4000\":0.48,\"8000\":0.48},\"nrc\":0.44,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"HVj1u0WLzfonwB8d\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3\\\" Owens Corning 701\",\"material\":\"3\\\" Owens Corning 701, plain faced, Mounting A\",\"absorption\":{\"63\":0.3,\"125\":0.43,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HVtRsybKlWeD9DSl\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Painted Nubby Panel (2 X 4 X 3/4\\\")\",\"material\":\"Armstrong Painted Nubby panel (2 x 4 x 3/4\\\"), Mount E-400\",\"absorption\":{\"63\":0,\"125\":0.4,\"250\":0.61,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.9,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HYzazWu1CFle4rGT\"},{\"tags\":[\"Floors\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Office Grade Carpet Tile\",\"material\":\"Office grade carpet tile\",\"absorption\":{\"63\":0.03,\"125\":0.1,\"250\":0.15,\"500\":0.25,\"1000\":0.3,\"2000\":0.4,\"4000\":0.4,\"8000\":0.4},\"nrc\":0.28,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"HZOK0DnkPT3dkpHT\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass Batt\",\"material\":\"Fiberglass Batt, 3-1/2in, against solid backing\",\"absorption\":{\"63\":0,\"125\":0.38,\"250\":0.9,\"500\":0.99,\"1000\":0.93,\"2000\":0.94,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.94,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"Hd7bQ14WhqRK8P7K\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, heavy, over foamed rubber pad\",\"absorption\":{\"63\":0,\"125\":0.08,\"250\":0.24,\"500\":0.57,\"1000\":0.69,\"2000\":0.71,\"4000\":0.73,\"8000\":0.73},\"nrc\":0.55,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"He31hb1qsaiOCah6\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"4\\\" Owens Corning 705\",\"material\":\"4\\\" Owens Corning 705, plain faced, Mounting A\",\"absorption\":{\"63\":0.35,\"125\":0.75,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.97,\"4000\":0.98,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HhZxdLYcabeskzUy\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.75H Spacing, Type NF-2\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.28,\"500\":0.41,\"1000\":0.42,\"2000\":0.53,\"4000\":0.36,\"8000\":0.53},\"nrc\":0.41,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HjK0T1QFYykCQVRr\"},{\"tags\":[\"Foams\",\"Foams\"],\"manufacturer\":\"\",\"name\":\"Polyurethane (Flexible Foam)\",\"material\":\"Polyurethane (flexible foam), 2\\\" thick over solid backing\",\"absorption\":{\"63\":0.1,\"125\":0.25,\"250\":0.5,\"500\":0.85,\"1000\":0.95,\"2000\":0.9,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.8,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HkC2ysyIKnZ2BhZ2\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Construction No. 8 With 2 Layers Of 5/8In Gypsum Board\",\"material\":\"Construction no. 8 with 2 layers of 5/8in gypsum board\",\"absorption\":{\"63\":0.06,\"125\":0.28,\"250\":0.12,\"500\":0.1,\"1000\":0.07,\"2000\":0.13,\"4000\":0.09,\"8000\":0.09},\"nrc\":0.11,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"Hp8Y1KKXybmPFmBZ\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Medium Curtain\",\"material\":\"Medium curtain, straight, on solid\",\"absorption\":{\"63\":0,\"125\":0.05,\"250\":0.1,\"500\":0.15,\"1000\":0.2,\"2000\":0.25,\"4000\":0.3,\"8000\":0.3},\"nrc\":0.18,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"HqhGSBJA8L0lW5gp\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Perforated Metal (24 Gauge\",\"material\":\"Perforated metal (24 gauge, 3/32\\\" holes, 13% open), over 2\\\" Owens-Corning 703 (mounting #2)\",\"absorption\":{\"63\":0.1,\"125\":0.18,\"250\":0.73,\"500\":0.99,\"1000\":0.99,\"2000\":0.97,\"4000\":0.95,\"8000\":0.97},\"nrc\":0.92,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Hqi7vqa0Sqhw0IXC\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Versatune 4-1/8\\\" Thick\",\"material\":\"Kinetics VersaTune 4-1/8\\\" Thick\",\"absorption\":{\"63\":0.64,\"125\":0.91,\"250\":0.82,\"500\":0.75,\"1000\":0.71,\"2000\":0.69,\"4000\":0.74,\"8000\":0.79},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HyXtF98yubtvFO6i\"},{\"tags\":[\"Walls\",\"Plasterboard\"],\"manufacturer\":\"\",\"name\":\"Audex A Acoustic Plaster\",\"material\":\"Audex A acoustic plaster\",\"absorption\":{\"63\":0.13,\"125\":0.3,\"250\":0.35,\"500\":0.55,\"1000\":0.7,\"2000\":0.85,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.61,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"Hz1pId91NalSLq5n\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"2 Layers 5/8\\\" Gypsum Bd. -Est.\",\"material\":\"2 layers 5/8\\\" gypsum bd. -EST.\",\"absorption\":{\"63\":0.25,\"125\":0.2,\"250\":0.15,\"500\":0.1,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"HzhgoVuj6hD68P6d\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - 3\\\"\",\"material\":\"Cellular Metal Deck - 3\\\"\",\"absorption\":{\"63\":0.3,\"125\":0.5,\"250\":0.65,\"500\":0.95,\"1000\":0.85,\"2000\":0.7,\"4000\":0.6,\"8000\":0.7},\"nrc\":0.79,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"I1Ih9VYix2to4dK0\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 2+2 @ 5/8in on 3-5/8in studs\",\"absorption\":{\"63\":0.04,\"125\":0.15,\"250\":0.08,\"500\":0.06,\"1000\":0.05,\"2000\":0.05,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.06,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"I1esImsQrKZl0AAw\"},{\"tags\":[\"Walls\",\"Brick\"],\"manufacturer\":\"\",\"name\":\"Brick\",\"material\":\"Brick, unglazed\",\"absorption\":{\"63\":0.02,\"125\":0.03,\"250\":0.03,\"500\":0.03,\"1000\":0.04,\"2000\":0.05,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.04,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"I3c1eU94Dc5JVq10\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics H.I.R.1 Perf Vinyl 2-1/8In\",\"material\":\"Decoustics h.i.r.1 perf vinyl 2-1/8in\",\"absorption\":{\"63\":0.05,\"125\":0.45,\"250\":0.8,\"500\":0.99,\"1000\":0.99,\"2000\":0.96,\"4000\":0.88,\"8000\":0.88},\"nrc\":0.94,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"I4Fx8xWA4TyMJ66R\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Asc Track Trap\",\"material\":\"ASC Track Trap, 16\\\" Diameter x 1' L, Third-Round, corner loaded - sabines per tube \",\"absorption\":{\"63\":0.9,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"I5ac3kkVzoBCc0RU\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 703\",\"material\":\"1\\\" Owens Corning 703, FRK faced, Mounting E-405\",\"absorption\":{\"63\":0.23,\"125\":0.33,\"250\":0.49,\"500\":0.62,\"1000\":0.78,\"2000\":0.66,\"4000\":0.45,\"8000\":0.66},\"nrc\":0.64,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"I5pXQGC5jsx8Sf0h\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster On Solid\",\"material\":\"Plaster on solid\",\"absorption\":{\"63\":0.02,\"125\":0.04,\"250\":0.05,\"500\":0.06,\"1000\":0.08,\"2000\":0.04,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.06,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"IBXfE2KdSum3e34J\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Classroom Chairs\",\"material\":\"Classroom Chairs, 2/3 occupied - MCB\",\"absorption\":{\"63\":0.15,\"125\":0.21,\"250\":0.29,\"500\":0.35,\"1000\":0.59,\"2000\":0.61,\"4000\":0.59,\"8000\":0.61},\"nrc\":0.46,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"IHzZXZPFug3UZ2Qw\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"5/8\\\" K-13 On Solid Base\",\"material\":\"5/8\\\" K-13 on solid base\",\"absorption\":{\"63\":0.02,\"125\":0.05,\"250\":0.16,\"500\":0.44,\"1000\":0.79,\"2000\":0.9,\"4000\":0.91,\"8000\":0.92},\"nrc\":0.57,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ILcE2wZMTnRO0cWI\"},{\"tags\":[\"Plaster\",\"Plaster Constructions\"],\"manufacturer\":\"\",\"name\":\"Smooth Plaster On Brick Aima\",\"material\":\"Smooth plaster on brick AIMA\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.02,\"500\":0.02,\"1000\":0.03,\"2000\":0.04,\"4000\":0.05,\"8000\":0.06},\"nrc\":0.03,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"IPLPT28H14bg6PdR\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Flat Double Layer\",\"material\":\"25oz. Flat double layer, 0\\\" separation, 3\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.53,\"500\":0.78,\"1000\":0.81,\"2000\":0.82,\"4000\":0.85,\"8000\":0.88},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"IRQErp7V4XQPWUnl\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Grace Acoustikote On Solid\",\"material\":\"1/2\\\" Grace Acoustikote on solid\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.1,\"500\":0.28,\"1000\":0.7,\"2000\":0.94,\"4000\":0.88,\"8000\":0.94},\"nrc\":0.51,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"IRmDCLI13HHoLYsb\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Golden Pyramid Product\",\"material\":\"RPG Golden Pyramid Product\",\"absorption\":{\"63\":0.1,\"125\":0.75,\"250\":0.12,\"500\":0.1,\"1000\":0.05,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.08,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"IUN7fQ6VEJM5KoPS\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Mediumweight Drapery\",\"material\":\"Mediumweight drapery, 14oz, draped to half area\",\"absorption\":{\"63\":0,\"125\":0.07,\"250\":0.31,\"500\":0.49,\"1000\":0.75,\"2000\":0.7,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.56,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"IUwWIopBeddEhR9Y\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Glass W/ Venetian Blinds\",\"material\":\"Glass w/ venetian blinds\",\"absorption\":{\"63\":0.03,\"125\":0.07,\"250\":0.05,\"500\":0.1,\"1000\":0.16,\"2000\":0.13,\"4000\":0.18,\"8000\":0.18},\"nrc\":0.11,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"Ia02IkJuMWXsw9CP\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass 6In: 5In Type 703 + 1In Nubby Glass Cloth\",\"material\":\"Fiberglass 6in: 5in Type 703 + 1in Nubby Glass Cloth\",\"absorption\":{\"63\":0.42,\"125\":0.92,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"IbVOLOdUnNTMju3S\"},{\"tags\":[\"Ceilings\",\"Metal Roof Decks\"],\"manufacturer\":\"\",\"name\":\"Perforated Acoustical Deck\",\"material\":\"Perforated Acoustical Deck, filled with fiberglass\",\"absorption\":{\"63\":0.14,\"125\":0.38,\"250\":0.49,\"500\":0.63,\"1000\":0.98,\"2000\":0.74,\"4000\":0.54,\"8000\":0.54},\"nrc\":0.71,\"source\":\"Vulcraft\",\"description\":\"\",\"uuid\":\"IbsvZAVwk39y30ld\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Tundra 2x2\",\"absorption\":{\"63\":0.15,\"125\":0.31,\"250\":0.32,\"500\":0.63,\"1000\":0.7,\"2000\":0.48,\"4000\":0.38,\"8000\":0.38},\"nrc\":0.53,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"IfFgwMhTCg8Z9MTd\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Fabrasorb 1-W\",\"material\":\"Fabrasorb 1-W, mounting #7 (63 Hz est.)\",\"absorption\":{\"63\":0.5,\"125\":0.6,\"250\":0.69,\"500\":0.54,\"1000\":0.7,\"2000\":0.72,\"4000\":0.75,\"8000\":0.78},\"nrc\":0.66,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"IhJwwl5GyA5jNuWk\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone\",\"material\":\"USG Acoustone, foil, 3/4in, 2x2 panels, F fissured 131\",\"absorption\":{\"63\":0.16,\"125\":0.34,\"250\":0.32,\"500\":0.6,\"1000\":0.99,\"2000\":0.96,\"4000\":0.97,\"8000\":0.97},\"nrc\":0.72,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"IrNewywICl8GpPL7\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics High Impact Hardside 2-1/8\\\" Thick\",\"material\":\"Kinetics High Impact HardSide 2-1/8\\\" Thick\",\"absorption\":{\"63\":0.32,\"125\":0.45,\"250\":0.8,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.94,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Irv3KQGtHeGndqHJ\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"G & S Fabric Wrapped Panel 1\\\" \",\"material\":\"G & S Fabric Wrapped Panel 1\\\" \",\"absorption\":{\"63\":0.05,\"125\":0.07,\"250\":0.29,\"500\":0.8,\"1000\":0.99,\"2000\":0.99,\"4000\":0.85,\"8000\":0.99},\"nrc\":0.77,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Irw1BxEiuMPImhq0\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fabric Wrapped Fg Panel\",\"material\":\"Fabric Wrapped FG Panel, 1in, against solid backing\",\"absorption\":{\"63\":0,\"125\":0.11,\"250\":0.37,\"500\":0.89,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.81,\"source\":\"Decoustics Tests\",\"description\":\"\",\"uuid\":\"IsHdA4xhFhRceKKX\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plywood\",\"material\":\"Plywood, 3/8in paneling\",\"absorption\":{\"63\":0.11,\"125\":0.28,\"250\":0.22,\"500\":0.17,\"1000\":0.09,\"2000\":0.1,\"4000\":0.11,\"8000\":0.11},\"nrc\":0.15,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"Ix84zatosRQsCZGH\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Unoccupied Wooden Church Pews - Mcb\",\"material\":\"Unoccupied wooden church pews - MCB\",\"absorption\":{\"63\":0.07,\"125\":0.1,\"250\":0.09,\"500\":0.08,\"1000\":0.08,\"2000\":0.08,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.08,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"IzQ9T519078LzwMc\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Fiberglass Curtain 1/2\\\" Hung In Space Sailcloth Mbi\",\"material\":\"Fiberglass Curtain 1/2\\\" hung in space Sailcloth MBI\",\"absorption\":{\"63\":0.05,\"125\":0.11,\"250\":0.19,\"500\":0.3,\"1000\":0.44,\"2000\":0.61,\"4000\":0.72,\"8000\":0.83},\"nrc\":0.39,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"J1dmGfS0tX4WCCgV\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Glass Cloth Board Over .85 Density Tiw (703 Sim.)\",\"material\":\"1\\\" glass cloth board over .85 density TIW (703 sim.)\",\"absorption\":{\"63\":0,\"125\":0.23,\"250\":0.72,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.92,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"J2jGUTiVhAqN1CBi\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics A.P./H.I.R2 Fabric 1.5In\",\"material\":\"Decoustics a.p./h.i.r2 fabric 1.5in\",\"absorption\":{\"63\":0,\"125\":0.15,\"250\":0.58,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.89,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"J3C1ZPFElMkUtKL0\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Classroom Chairs\",\"material\":\"Classroom Chairs, unoccupied - MCB\",\"absorption\":{\"63\":0.03,\"125\":0.04,\"250\":0.05,\"500\":0.06,\"1000\":0.1,\"2000\":0.1,\"4000\":0.08,\"8000\":0.1},\"nrc\":0.08,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"J3tFvPJkOede5snW\"},{\"tags\":[\"Floors\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Terrazzo Floor\",\"material\":\"Terrazzo Floor, 1/4in, mud set or thin set\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.02,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"JBgLYW4AUaBbO4Z0\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass 3In Type 703\",\"material\":\"Fiberglass 3in Type 703, unfaced\",\"absorption\":{\"63\":0.03,\"125\":0.53,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"JJUfThsmG81FiCFV\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Silvatone (A.A.V. Ltd)\",\"material\":\"Silvatone (A.A.V. ltd)\",\"absorption\":{\"63\":0.13,\"125\":0.4,\"250\":0.25,\"500\":0.2,\"1000\":0.15,\"2000\":0.15,\"4000\":0.15,\"8000\":0.15},\"nrc\":0.19,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"JLi5lvQzzFXs8TQK\"},{\"tags\":[\"Slit\",\"Slit Resonators\"],\"manufacturer\":\"\",\"name\":\"Slit Resonator - 10% Open Area \",\"material\":\"Slit Resonator - 10% Open Area , 2 in. insulation\",\"absorption\":{\"63\":0.08,\"125\":0.23,\"250\":0.75,\"500\":0.99,\"1000\":0.79,\"2000\":0.5,\"4000\":0.3,\"8000\":0.5},\"nrc\":0.76,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"JOyMKWOY0Kbtdz8c\"},{\"tags\":[\"Proscenium\",\"Proscenium & Balcony Openings\"],\"manufacturer\":\"\",\"name\":\"Proscenium Opening\",\"material\":\"Proscenium opening\",\"absorption\":{\"63\":0.2,\"125\":0.3,\"250\":0.35,\"500\":0.4,\"1000\":0.45,\"2000\":0.5,\"4000\":0.45,\"8000\":0.5},\"nrc\":0.43,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"JUiT08KPscdBxSZt\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"2 X 4 Banner\",\"material\":\"2 x 4 banner, 1-1/2in, 1.5# fiberglass core\",\"absorption\":{\"63\":0.03,\"125\":0.32,\"250\":0.59,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.59,\"8000\":0.59},\"nrc\":0.89,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"JXyI2fKzi4oKlkCh\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Random Fissured (Nonperforated) 2x4\",\"absorption\":{\"63\":0.19,\"125\":0.65,\"250\":0.38,\"500\":0.3,\"1000\":0.78,\"2000\":0.77,\"4000\":0.71,\"8000\":0.71},\"nrc\":0.56,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"JaKVRbVEyL2shRhL\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 701\",\"material\":\"2\\\" Owens Corning 701, plain faced, Mounting A\",\"absorption\":{\"63\":0.15,\"125\":0.22,\"250\":0.67,\"500\":0.98,\"1000\":0.99,\"2000\":0.98,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"JfFbO5y9lJlgdMdw\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1+1 @ 1/2in on 3-5/8in studs\",\"absorption\":{\"63\":0.05,\"125\":0.27,\"250\":0.1,\"500\":0.05,\"1000\":0.04,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.06,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"Jfh6uIc2ZeoYijSD\"},{\"tags\":[\"Floors\",\"Concrete\"],\"manufacturer\":\"\",\"name\":\"Concrete\",\"material\":\"Concrete\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.02,\"500\":0.02,\"1000\":0.03,\"2000\":0.03,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.03,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"JllgpdsPo1PdECpN\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-2PS, Continuous Mount\",\"absorption\":{\"63\":0.27,\"125\":0.39,\"250\":0.48,\"500\":0.71,\"1000\":0.99,\"2000\":0.93,\"4000\":0.77,\"8000\":0.93},\"nrc\":0.78,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"JpSccnclaQNFNsW1\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster On Masonry\",\"material\":\"Plaster on masonry\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.02,\"500\":0.03,\"1000\":0.04,\"2000\":0.04,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.03,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"JrkKO5d1ob8jv8Wf\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Heavy Carpet Over Foam Rubber\",\"material\":\"Heavy carpet over foam rubber, or 40 oz. hairfelt; on concrete\",\"absorption\":{\"63\":0.05,\"125\":0.08,\"250\":0.24,\"500\":0.57,\"1000\":0.69,\"2000\":0.71,\"4000\":0.73,\"8000\":0.75},\"nrc\":0.55,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"JtIS3iGRMXNHsssw\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno 4 E-400 Mounted\",\"material\":\"Kinetics Sereno 4 E-400 Mounted\",\"absorption\":{\"63\":0.44,\"125\":0.55,\"250\":0.52,\"500\":0.41,\"1000\":0.36,\"2000\":0.34,\"4000\":0.33,\"8000\":0.34},\"nrc\":0.41,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"K3BwVvYkAl2VjKOI\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 701\",\"material\":\"2\\\" Owens Corning 701, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.31,\"125\":0.44,\"250\":0.68,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"K5V2kS5D8kdscX3p\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Panels (Solid)\",\"material\":\"Wood Panels (solid), 1/2in, on furring\",\"absorption\":{\"63\":0.11,\"125\":0.28,\"250\":0.22,\"500\":0.19,\"1000\":0.13,\"2000\":0.08,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.16,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"K6FcnJtUougWMHiA\"},{\"tags\":[\"Floors\",\"Timber\"],\"manufacturer\":\"\",\"name\":\"Suspended Timber Floor With Carpet\",\"material\":\"Suspended timber floor with carpet\",\"absorption\":{\"63\":0.13,\"125\":0.3,\"250\":0.35,\"500\":0.35,\"1000\":0.55,\"2000\":0.65,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.48,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"K8nnwgfgrEN1sCAT\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.5H Spacing, Type NF-2P\",\"absorption\":{\"63\":0.11,\"125\":0.15,\"250\":0.4,\"500\":0.59,\"1000\":0.71,\"2000\":0.77,\"4000\":0.41,\"8000\":0.77},\"nrc\":0.62,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"K8spL1EstxSFqA6y\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"4\\\" Owens Corning 701\",\"material\":\"4\\\" Owens Corning 701, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.61,\"125\":0.87,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"KBhanSHBkVMclv63\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-2N, Intermittent Mount\",\"absorption\":{\"63\":0.22,\"125\":0.32,\"250\":0.64,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.9,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"KHEa2fP0vJrnzfYC\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics H.I.R 1 Vinyl 1-1/8In\",\"material\":\"Decoustics h.i.r 1 vinyl 1-1/8in\",\"absorption\":{\"63\":0.05,\"125\":0.45,\"250\":0.8,\"500\":0.99,\"1000\":0.99,\"2000\":0.96,\"4000\":0.88,\"8000\":0.88},\"nrc\":0.94,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"KM8yqfvmMLLqV0fE\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, 1/4in pile\",\"absorption\":{\"63\":0,\"125\":0.04,\"250\":0.1,\"500\":0.15,\"1000\":0.3,\"2000\":0.5,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.26,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"KN0tAiN7ZjisT8XB\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"2X4 Wood Stud Wall 16\\\" Oc W/ R-19 - Iso Max - Hat Channel - 2 Layers 5/8 Type X Screws 12\\\" Oc\",\"material\":\"2x4 Wood Stud Wall 16\\\" oc w/ R-19 - ISO Max - Hat Channel - 2 layers 5/8 Type X Screws 12\\\" oc\",\"absorption\":{\"63\":0.56,\"125\":0.22,\"250\":0.14,\"500\":0.08,\"1000\":0.06,\"2000\":0.08,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"KQ6AFWDPnlDwCc0D\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Skyline\",\"material\":\"RPG Skyline\",\"absorption\":{\"63\":0.04,\"125\":0.05,\"250\":0.31,\"500\":0.29,\"1000\":0.28,\"2000\":0.19,\"4000\":0.15,\"8000\":0.19},\"nrc\":0.27,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"KRqSnH5J1dFtLG6e\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Climaplus Firecode Panels\",\"material\":\"USG Climaplus Firecode panels, Rockface 56380 5/8 2x4\",\"absorption\":{\"63\":0.16,\"125\":0.38,\"250\":0.31,\"500\":0.43,\"1000\":0.8,\"2000\":0.63,\"4000\":0.62,\"8000\":0.62},\"nrc\":0.54,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"KTpnr62ytcuoErlP\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Almute (2.5Mm Thick) With 200Mm (8\\\") Airspace\",\"material\":\"Almute (2.5mm thick) with 200mm (8\\\") airspace\",\"absorption\":{\"63\":0.22,\"125\":0.31,\"250\":0.91,\"500\":0.89,\"1000\":0.58,\"2000\":0.57,\"4000\":0.68,\"8000\":0.79},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"KegDooPqgSu5Lik3\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Climaplus Firecode Panels\",\"material\":\"USG Climaplus Firecode panels, Clean Room (perf) 55060 5/8 2x2\",\"absorption\":{\"63\":0.16,\"125\":0.36,\"250\":0.32,\"500\":0.56,\"1000\":0.8,\"2000\":0.66,\"4000\":0.5,\"8000\":0.5},\"nrc\":0.59,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"Kiplropcg2NLQhMY\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics A.P./ H.I.R2 Fabric 2In\",\"material\":\"Decoustics a.p./ h.i.r2 fabric 2in\",\"absorption\":{\"63\":0,\"125\":0.23,\"250\":0.81,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.95,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"Kj4srA1JZYen1965\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloudlite Baffles\",\"material\":\"MBI Cloudlite Baffles, 2600-2015 3 mil PVC\",\"absorption\":{\"63\":0.03,\"125\":0.38,\"250\":0.7,\"500\":0.99,\"1000\":0.99,\"2000\":0.79,\"4000\":0.4,\"8000\":0.4},\"nrc\":0.87,\"source\":\"MBI\",\"description\":\"\",\"uuid\":\"L3BSSrpq8dK5IdAr\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-4PS, Intermittent Mount\",\"absorption\":{\"63\":0.47,\"125\":0.67,\"250\":0.8,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.83,\"8000\":0.99},\"nrc\":0.94,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"LDnLlv4cq8HSgJHx\"},{\"tags\":[\"Wood\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"1/4\\\" Wood With ? Air Space  From Egan\",\"material\":\"1/4\\\" Wood with ? air space  from Egan\",\"absorption\":{\"63\":0.6,\"125\":0.42,\"250\":0.21,\"500\":0.1,\"1000\":0.08,\"2000\":0.06,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.11,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"LGl6DV4CfbOylLz6\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Drapery\",\"material\":\"Drapery, 18 oz/yd, 4in air space; 50% fullness\",\"absorption\":{\"63\":0,\"125\":0.14,\"250\":0.35,\"500\":0.55,\"1000\":0.72,\"2000\":0.7,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.58,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"LHGc7wcSJfP11Yz2\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Velour\",\"material\":\"Velour, 18 oz/sq yd, 4\\\" from wall (100% fullness) AIMA\",\"absorption\":{\"63\":0.04,\"125\":0.06,\"250\":0.27,\"500\":0.44,\"1000\":0.5,\"2000\":0.4,\"4000\":0.35,\"8000\":0.4},\"nrc\":0.4,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"LHrSVb9nwY5MH2FW\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1+1 @ 5/8in on ins. 3-5/8in studs\",\"absorption\":{\"63\":0.03,\"125\":0.14,\"250\":0.06,\"500\":0.04,\"1000\":0.03,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.04,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"LL0VdgZMW8DwX2iN\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"45Mm Solid Core Door\",\"material\":\"45mm solid core door\",\"absorption\":{\"63\":0.05,\"125\":0.15,\"250\":0.1,\"500\":0.08,\"1000\":0.08,\"2000\":0.08,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.09,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"LNaF3pUmVosuKgDr\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Window\",\"material\":\"Window, up to 4mm glass\",\"absorption\":{\"63\":0.13,\"125\":0.35,\"250\":0.25,\"500\":0.15,\"1000\":0.1,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.14,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"LNaoKanpTOq5uMcb\"},{\"tags\":[\"Outdoors\",\"Soil\"],\"manufacturer\":\"\",\"name\":\"Soil\",\"material\":\"Soil, rough\",\"absorption\":{\"63\":0.03,\"125\":0.15,\"250\":0.25,\"500\":0.4,\"1000\":0.55,\"2000\":0.6,\"4000\":0.6,\"8000\":0.6},\"nrc\":0.45,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"LQFN80xQ6driYG6D\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Flat Double Layer\",\"material\":\"32oz. Flat double layer, 0\\\" separation, 3\\\" behind rear fabric, closed side edges\",\"absorption\":{\"63\":0.11,\"125\":0.15,\"250\":0.63,\"500\":0.8,\"1000\":0.77,\"2000\":0.76,\"4000\":0.74,\"8000\":0.76},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"LUGHo6pTc0qbP33c\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Wenger\",\"material\":\"Wenger, Quadratic diffuser, 7 well sequence, plastic, PSF\",\"absorption\":{\"63\":0.09,\"125\":0.36,\"250\":0.54,\"500\":0.59,\"1000\":0.43,\"2000\":0.24,\"4000\":0.17,\"8000\":0.17},\"nrc\":0.45,\"source\":\"Wenger data\",\"description\":\"\",\"uuid\":\"LVer8JmtOnw3UQL8\"},{\"tags\":[\"Floors\",\"Marble\"],\"manufacturer\":\"\",\"name\":\"Marble Tiles\",\"material\":\"Marble Tiles, adhered to wall/floor\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.01,\"1000\":0.01,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.01,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"LWEi8cUXlpYkzrdr\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Travertone 80 Tile (1 X 1 X 3/4\\\")\",\"material\":\"Armstrong Travertone 80 Tile (1 x 1 x 3/4\\\"), Mount E-400\",\"absorption\":{\"63\":0.35,\"125\":0.67,\"250\":0.62,\"500\":0.66,\"1000\":0.88,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.79,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"LWjZwPxhIPxyDHY0\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics Quadrillo Perf Wood 1-1/8In\",\"material\":\"Decoustics QUADRILLO perf wood 1-1/8in\",\"absorption\":{\"63\":0,\"125\":0.04,\"250\":0.23,\"500\":0.52,\"1000\":0.9,\"2000\":0.94,\"4000\":0.66,\"8000\":0.66},\"nrc\":0.65,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"LY8Lxou4ncG7tUgw\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 4' Ceiling Diffuser\",\"material\":\"Wenger 4' x 4' Ceiling Diffuser, Pyramidal (A)\",\"absorption\":{\"63\":0.19,\"125\":0.27,\"250\":0.18,\"500\":0.09,\"1000\":0.06,\"2000\":0.03,\"4000\":0,\"8000\":0.03},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"LYVlEryzIbiAElTO\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Seating\",\"material\":\"Seating, empty, fully upholstered\",\"absorption\":{\"63\":0.01,\"125\":0.12,\"250\":0.22,\"500\":0.28,\"1000\":0.3,\"2000\":0.32,\"4000\":0.37,\"8000\":0.37},\"nrc\":0.28,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"LatyjSVuY67ocIiD\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"Pyrok Acoustement 20\",\"material\":\"Pyrok Acoustement 20, 1in, sprayed on concrete slab\",\"absorption\":{\"63\":0,\"125\":0.15,\"250\":0.39,\"500\":0.61,\"1000\":0.75,\"2000\":0.85,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.65,\"source\":\"Pyrok tests\",\"description\":\"\",\"uuid\":\"LiGGLzPNnc2dX1bY\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, \\\"Theatre thick\\\" pile\",\"absorption\":{\"63\":0.02,\"125\":0.04,\"250\":0.05,\"500\":0.2,\"1000\":0.45,\"2000\":0.55,\"4000\":0.6,\"8000\":0.65},\"nrc\":0.31,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Lp1ujCrYHCXjMhRL\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1\\\" Grace Acoustikote On Lath\",\"material\":\"1\\\" Grace Acoustikote on lath\",\"absorption\":{\"63\":0.2,\"125\":0.28,\"250\":0.74,\"500\":0.8,\"1000\":0.82,\"2000\":0.91,\"4000\":0.94,\"8000\":0.97},\"nrc\":0.82,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Ls768HsInZ9xOpaU\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 703\",\"material\":\"1\\\" Owens Corning 703, FRK faced, Mounting A\",\"absorption\":{\"63\":0.13,\"125\":0.18,\"250\":0.75,\"500\":0.58,\"1000\":0.72,\"2000\":0.62,\"4000\":0.35,\"8000\":0.62},\"nrc\":0.67,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"LxSCJ2nsyPYkPyFT\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Nylon Thin Pile On Concrete\",\"material\":\"Nylon thin pile on concrete\",\"absorption\":{\"63\":0.02,\"125\":0.04,\"250\":0.05,\"500\":0.1,\"1000\":0.2,\"2000\":0.45,\"4000\":0.65,\"8000\":0.85},\"nrc\":0.2,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"M0ckdFcV8ZGa0Xv4\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 703\",\"material\":\"2\\\" Owens Corning 703, FRK faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.27,\"125\":0.38,\"250\":0.51,\"500\":0.83,\"1000\":0.73,\"2000\":0.53,\"4000\":0.37,\"8000\":0.53},\"nrc\":0.65,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"M6YHf5fmdn3ZWR3V\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Nylon Carpet\",\"material\":\"Nylon carpet, medium pile on needleloom underfelt\",\"absorption\":{\"63\":0.05,\"125\":0.1,\"250\":0.15,\"500\":0.4,\"1000\":0.6,\"2000\":0.75,\"4000\":0.75,\"8000\":0.75},\"nrc\":0.48,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"MHoyvokR4j9vKgSl\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Usg Orion 270 #61175 (2 X 2 X 1\\\" W/Backing)\",\"material\":\"USG Orion 270 #61175 (2 x 2 x 1\\\" w/backing), Mount E-400\",\"absorption\":{\"63\":0.21,\"125\":0.42,\"250\":0.43,\"500\":0.82,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"MOEpgQFtVqevRC2W\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Johns Manville Permacote (Ductliner)\",\"material\":\"2\\\" Johns Manville Permacote (Ductliner)\",\"absorption\":{\"63\":0.16,\"125\":0.27,\"250\":0.81,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.95,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"MlFeSkV0LcdzhgRZ\"},{\"tags\":[\"Walls\",\"Mineral wool\"],\"manufacturer\":\"\",\"name\":\"50Mm Mineral Wool On Solid\",\"material\":\"50mm mineral wool on solid\",\"absorption\":{\"63\":0,\"125\":0.2,\"250\":0.45,\"500\":0.7,\"1000\":0.85,\"2000\":0.9,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.73,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"Mm09tGmtw5JSOMqz\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Lignacoust (R. Graefe Ltd.)\",\"material\":\"Lignacoust (R. Graefe ltd.)\",\"absorption\":{\"63\":0,\"125\":0.2,\"250\":0.65,\"500\":0.95,\"1000\":0.65,\"2000\":0.6,\"4000\":0.5,\"8000\":0.5},\"nrc\":0.71,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"Mmdq9tzEe0axj2ms\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Velour\",\"material\":\"Velour, 14 oz/sq yd at wall (50% fullness) Mankovsky\",\"absorption\":{\"63\":0.04,\"125\":0.07,\"250\":0.37,\"500\":0.49,\"1000\":0.81,\"2000\":0.65,\"4000\":0.54,\"8000\":0.65},\"nrc\":0.58,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"MtR2snyFDuPf5szS\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Trackwall\",\"material\":\"IAC Trackwall, perforated on one side\",\"absorption\":{\"63\":0.4,\"125\":0.45,\"250\":0.95,\"500\":0.85,\"1000\":0.85,\"2000\":0.85,\"4000\":0.85,\"8000\":0.85},\"nrc\":0.88,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"MyBm2Or9aA54naSD\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"2\\\" Tectum Mounting #4 (Directly To Concrete)\",\"material\":\"2\\\" Tectum mounting #4 (directly to concrete)\",\"absorption\":{\"63\":0.07,\"125\":0.15,\"250\":0.26,\"500\":0.62,\"1000\":0.94,\"2000\":0.64,\"4000\":0.92,\"8000\":0.99},\"nrc\":0.62,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Mz2Jhdf0ikBmG88E\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Glass\",\"material\":\"Glass, 1/4in large\",\"absorption\":{\"63\":0.03,\"125\":0.15,\"250\":0.05,\"500\":0.04,\"1000\":0.03,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.04,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"N0ecSYu8eXtmCk1P\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Venetian Blinds\",\"material\":\"Venetian blinds, metal\",\"absorption\":{\"63\":0.03,\"125\":0.06,\"250\":0.05,\"500\":0.07,\"1000\":0.15,\"2000\":0.13,\"4000\":0.17,\"8000\":0.17},\"nrc\":0.1,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"NCFGKfpbqARdgahb\"},{\"tags\":[\"Walls\",\"Brick\"],\"manufacturer\":\"\",\"name\":\"Brick\",\"material\":\"Brick, 4in, unglazed\",\"absorption\":{\"63\":0.02,\"125\":0.03,\"250\":0.03,\"500\":0.03,\"1000\":0.04,\"2000\":0.05,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.04,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"NDH5uADtinF9CYVy\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.75H Spacing, Type NF-4PS\",\"absorption\":{\"63\":0.13,\"125\":0.18,\"250\":0.36,\"500\":0.55,\"1000\":0.59,\"2000\":0.58,\"4000\":0.34,\"8000\":0.58},\"nrc\":0.52,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"NHF9TzvCww0jSmtd\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 703\",\"material\":\"1\\\" Owens Corning 703, FRK faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.22,\"125\":0.31,\"250\":0.45,\"500\":0.62,\"1000\":0.65,\"2000\":0.51,\"4000\":0.28,\"8000\":0.51},\"nrc\":0.56,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"NJuo3k3Xh9FtvSUb\"},{\"tags\":[\"Common\",\"Common Materials\"],\"manufacturer\":\"\",\"name\":\"Painted Concrete Block\",\"material\":\"Painted concrete block\",\"absorption\":{\"63\":0.05,\"125\":0.1,\"250\":0.05,\"500\":0.06,\"1000\":0.07,\"2000\":0.09,\"4000\":0.08,\"8000\":0.09},\"nrc\":0.07,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"NKjOvZ6xCO808ilr\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 703\",\"material\":\"2\\\" Owens Corning 703, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.27,\"125\":0.38,\"250\":0.63,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.9,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"NOxfAKheg5xkGf78\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-4N, Continuous Mount\",\"absorption\":{\"63\":0.68,\"125\":0.97,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"NQJV2WpfV0mMQSos\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Slotted Concrete Block \",\"material\":\"Slotted concrete block , 8in, Empty void\",\"absorption\":{\"63\":0.22,\"125\":0.64,\"250\":0.44,\"500\":0.38,\"1000\":0.39,\"2000\":0.5,\"4000\":0.25,\"8000\":0.25},\"nrc\":0.43,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"NSqEQPMw9KBLVICl\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Large-Scale Diffusor\",\"material\":\"Large-Scale Diffusor, 9-1/8in, RPG inQRD-734in\",\"absorption\":{\"63\":0.09,\"125\":0.22,\"250\":0.26,\"500\":0.33,\"1000\":0.23,\"2000\":0.2,\"4000\":0.21,\"8000\":0.21},\"nrc\":0.26,\"source\":\"RPG tests\",\"description\":\"\",\"uuid\":\"NXoqQE4xuZXxwcuN\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Hard Floor Tiles\",\"material\":\"Hard floor tiles, or composition floor\",\"absorption\":{\"63\":0.02,\"125\":0.03,\"250\":0.03,\"500\":0.03,\"1000\":0.04,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.04,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"NgW5I9Kq8VGh3peY\"},{\"tags\":[\"Ceilings\",\"Metal Roof Decks\"],\"manufacturer\":\"\",\"name\":\"Epic Perf Metal Roof Er2Ra 2In 1-Pc. Deck; 50% Infill\",\"material\":\"EPIC perf metal roof ER2RA 2in 1-pc. deck; 50% infill\",\"absorption\":{\"63\":0,\"125\":0.29,\"250\":0.68,\"500\":0.99,\"1000\":0.82,\"2000\":0.58,\"4000\":0.41,\"8000\":0.41},\"nrc\":0.77,\"source\":\"Epic data\",\"description\":\"\",\"uuid\":\"NjTy2oPgeXcONdUy\"},{\"tags\":[\"Outdoors\",\"Water\"],\"manufacturer\":\"\",\"name\":\"Water Surface (Swimming Pool)\",\"material\":\"Water surface (swimming pool)\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.01,\"1000\":0.02,\"2000\":0.02,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.02,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"NlWW6BTdxdzHZl6a\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"Pyrok Acoustement 20\",\"material\":\"Pyrok Acoustement 20, 1/2in, sprayed on concrete slab\",\"absorption\":{\"63\":0,\"125\":0.11,\"250\":0.3,\"500\":0.36,\"1000\":0.46,\"2000\":0.73,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.46,\"source\":\"Pyrok tests\",\"description\":\"\",\"uuid\":\"Nny2jN5aU1H1GYdl\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-4N, 50% Intermittent Mount\",\"absorption\":{\"63\":0.81,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"NsqZ7PuCtEGNYRYz\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Vicracoustic Type A Perforated Vinyl-Faced 2\\\" Thick Panel (Mounting #2)\",\"material\":\"Vicracoustic Type A perforated vinyl-faced 2\\\" thick panel (mounting #2)\",\"absorption\":{\"63\":0.4,\"125\":0.57,\"250\":0.98,\"500\":0.92,\"1000\":0.76,\"2000\":0.71,\"4000\":0.78,\"8000\":0.85},\"nrc\":0.84,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"NtZDrHEbty9dErZh\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Balcony Opening\",\"material\":\"Balcony Opening, deep opening\",\"absorption\":{\"63\":0.2,\"125\":0.5,\"250\":0.6,\"500\":0.7,\"1000\":0.8,\"2000\":0.9,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.75,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"NyMkTg7dA7GuraSq\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Unoccupied\",\"material\":\"Unoccupied, heavily upholstered (Beranek 1998)\",\"absorption\":{\"63\":0.49,\"125\":0.7,\"250\":0.76,\"500\":0.81,\"1000\":0.84,\"2000\":0.84,\"4000\":0.81,\"8000\":0.84},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"O6vxwRGCBQSEoqdI\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Tad 1-1/8\\\" Thick\",\"material\":\"Kinetics TAD 1-1/8\\\" Thick\",\"absorption\":{\"63\":0.14,\"125\":0.2,\"250\":0.45,\"500\":0.9,\"1000\":0.89,\"2000\":0.62,\"4000\":0.43,\"8000\":0.62},\"nrc\":0.72,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"O8TIPWAfA3WOrRAk\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Wenger\",\"material\":\"Wenger, Type 2 diffuser, bowed, 4x8, gel coat, EACH\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"Wenger data\",\"description\":\"\",\"uuid\":\"OCmydRkrLSYy8VKG\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Occupied Part Of Stage\",\"material\":\"Occupied Part of Stage, filled with orchestra players\",\"absorption\":{\"63\":0.02,\"125\":0.13,\"250\":0.22,\"500\":0.26,\"1000\":0.39,\"2000\":0.6,\"4000\":0.78,\"8000\":0.78},\"nrc\":0.37,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"ODEqG3rviDrwJCFD\"},{\"tags\":[\"Floors\",\"Marble\"],\"manufacturer\":\"\",\"name\":\"Marble Or Glazed Tile\",\"material\":\"Marble or glazed tile\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.01,\"1000\":0.01,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.01,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"ODVnZR4UWw640F6f\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Am.Seating Plastic Stadium\",\"material\":\"Am.Seating plastic stadium\",\"absorption\":{\"63\":0,\"125\":0.01,\"250\":0.02,\"500\":0.03,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"OF9ootobIeWvtLVj\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Omniffusor (Frg) - A Mount With Fabric On Surface\",\"material\":\"RPG Omniffusor (FRG) - A mount with fabric on surface\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.17,\"500\":0.28,\"1000\":0.41,\"2000\":0.26,\"4000\":0.28,\"8000\":0.3},\"nrc\":0.28,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"OGaa4CXSUOhC4OWz\"},{\"tags\":[\"People\",\"Pews\"],\"manufacturer\":\"\",\"name\":\"Pews; Upholstered\",\"material\":\"Pews; upholstered, 2/3 filled\",\"absorption\":{\"63\":0.17,\"125\":0.46,\"250\":0.59,\"500\":0.68,\"1000\":0.76,\"2000\":0.77,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.7,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"OIFSzmqvwKCYuP3q\"},{\"tags\":[\"Cotton\",\" Cotton Panels\"],\"manufacturer\":\"\",\"name\":\"Asi Bass Buster 4\\\" Thick Bonded Acoustical Cotton\",\"material\":\"ASI Bass Buster 4\\\" thick Bonded Acoustical Cotton\",\"absorption\":{\"63\":0.55,\"125\":0.97,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"OOyBAxE160Yd0Itc\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.5H Spacing, Type NF-4P\",\"absorption\":{\"63\":0.14,\"125\":0.2,\"250\":0.4,\"500\":0.73,\"1000\":0.8,\"2000\":0.84,\"4000\":0.48,\"8000\":0.84},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"OSJBMKb3gEA8bLAs\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Usg Orion 270 #63171 (2 X 4 X 1\\\")\",\"material\":\"USG Orion 270 #63171 (2 x 4 x 1\\\"), Mount E-400\",\"absorption\":{\"63\":0.5,\"125\":0.74,\"250\":0.82,\"500\":0.82,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"OalTnE6Z0esIDml0\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone\",\"material\":\"USG Auratone, Omni 345 5/8 2x4\",\"absorption\":{\"63\":0.14,\"125\":0.35,\"250\":0.27,\"500\":0.45,\"1000\":0.71,\"2000\":0.7,\"4000\":0.59,\"8000\":0.59},\"nrc\":0.53,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"OcKABwTMed9AVoSc\"},{\"tags\":[\"Floors\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Thick Pile Carpet With Underlay\",\"material\":\"Thick pile carpet with underlay\",\"absorption\":{\"63\":0.03,\"125\":0.15,\"250\":0.25,\"500\":0.5,\"1000\":0.6,\"2000\":0.7,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.51,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"OfdFy9PIoe4eafQ6\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 8' Type Ii Wall Diffuser\",\"material\":\"Wenger 4' x 8' Type II Wall Diffuser, (E-9/32\\\")\",\"absorption\":{\"63\":0.2,\"125\":0.28,\"250\":0.29,\"500\":0.19,\"1000\":0.13,\"2000\":0.13,\"4000\":0.2,\"8000\":0.27},\"nrc\":0.19,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"OhX8Yd6JEhxy4rtI\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plywood\",\"material\":\"Plywood, 1/4in/air\",\"absorption\":{\"63\":0.11,\"125\":0.58,\"250\":0.22,\"500\":0.07,\"1000\":0.04,\"2000\":0.03,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.09,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"Ohhz6fdUuYnlFUhc\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics Metallo 1In\",\"material\":\"Decoustics METALLO 1in\",\"absorption\":{\"63\":0,\"125\":0.13,\"250\":0.37,\"500\":0.89,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.81,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"OilY2JiHsFhYCQ5I\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Single 100% Gathers\",\"material\":\"25oz. Single 100% gathers, 15\\\" to track, closed side edges - most current data, based on actual tests\",\"absorption\":{\"63\":0.36,\"125\":0.52,\"250\":0.75,\"500\":0.79,\"1000\":0.9,\"2000\":0.93,\"4000\":0.93,\"8000\":0.93},\"nrc\":0.84,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"OmmoQ6n9vi8k9hlj\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Shasta (Nonperforated) 2x4 x5/8in\",\"absorption\":{\"63\":0.18,\"125\":0.62,\"250\":0.36,\"500\":0.29,\"1000\":0.76,\"2000\":0.66,\"4000\":0.77,\"8000\":0.77},\"nrc\":0.52,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"OtLWujVKwTJMwwyR\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Opera House Pit\",\"material\":\"Opera house pit, 40 players (in metric sabines)  (Beranek 1998)\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"OwZ2b5PWAcMHN7wT\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Wood Flooring On Joists Over Air Space  From Aima\",\"material\":\"Wood Flooring on joists over air space  from AIMA\",\"absorption\":{\"63\":0.1,\"125\":0.15,\"250\":0.11,\"500\":0.1,\"1000\":0.07,\"2000\":0.06,\"4000\":0.07,\"8000\":0.08},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Owzz3W3G2W7vTDm8\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plywood\",\"material\":\"Plywood, 1/4in, over air space (+/- 3in)\",\"absorption\":{\"63\":0.11,\"125\":0.42,\"250\":0.21,\"500\":0.1,\"1000\":0.08,\"2000\":0.06,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.11,\"source\":\"Beranek (C&OH '96)\",\"description\":\"\",\"uuid\":\"P0U69cfO2icOiDTt\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Fabric\",\"material\":\"Fabric, 10 oz velour, straight\",\"absorption\":{\"63\":0.01,\"125\":0.03,\"250\":0.04,\"500\":0.11,\"1000\":0.17,\"2000\":0.24,\"4000\":0.35,\"8000\":0.35},\"nrc\":0.14,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"P0lAMCI7kuo6gO49\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Slotted Concrete Block \",\"material\":\"Slotted concrete block , 12in, fiberglass in void\",\"absorption\":{\"63\":0.07,\"125\":0.48,\"250\":0.83,\"500\":0.86,\"1000\":0.54,\"2000\":0.47,\"4000\":0.44,\"8000\":0.44},\"nrc\":0.68,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"P1CWgkH2FRNbVlys\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Medium Texture Mineral Fiber\",\"material\":\"medium texture mineral fiber, all sizes\",\"absorption\":{\"63\":0.16,\"125\":0.32,\"250\":0.31,\"500\":0.51,\"1000\":0.72,\"2000\":0.71,\"4000\":0.63,\"8000\":0.63},\"nrc\":0.56,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"P1cjVg5ftpGw9mTF\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"Pyrok Acoustement 40\",\"material\":\"Pyrok Acoustement 40, 1in, sprayed on concrete slab\",\"absorption\":{\"63\":0.03,\"125\":0.18,\"250\":0.31,\"500\":0.36,\"1000\":0.73,\"2000\":0.67,\"4000\":0.63,\"8000\":0.63},\"nrc\":0.52,\"source\":\"Pyrok tests\",\"description\":\"\",\"uuid\":\"PBO5Ms3dvTTXg1Gn\"},{\"tags\":[\"Grilles\",\"Grilles\"],\"manufacturer\":\"\",\"name\":\"Grilles - Mechanical Air System\",\"material\":\"Grilles - mechanical air system\",\"absorption\":{\"63\":0.02,\"125\":0.05,\"250\":0.1,\"500\":0.15,\"1000\":0.25,\"2000\":0.3,\"4000\":0.3,\"8000\":0.3},\"nrc\":0.2,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"PHZFyBIO61iYhIAR\"},{\"tags\":[\"Roofing\",\"Roofing Constructons\"],\"manufacturer\":\"\",\"name\":\"Panel 0.8 Lb./Sq. Ft Of 2 Layers Of Bitumen Roofing\",\"material\":\"Panel 0.8 lb./sq. ft of 2 layers of bitumen roofing, felt back, mtd over 10\\\" air space, on a solid back\",\"absorption\":{\"63\":0.9,\"125\":0.5,\"250\":0.3,\"500\":0.2,\"1000\":0.1,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.18,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"PJ4tvmPpxjX9U4S3\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"2\\\" Tectum Mounting #8 (2\\\" X 4\\\" Battens\",\"material\":\"2\\\" Tectum mounting #8 (2\\\" x 4\\\" battens, 24\\\" center, over solid backing, with fiberglass batt (3/4 lb./cu. ft.) in void)\",\"absorption\":{\"63\":0.15,\"125\":0.42,\"250\":0.89,\"500\":0.99,\"1000\":0.85,\"2000\":0.99,\"4000\":0.94,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"PLA6Nt4irDYoW0L0\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - Robertson Adc 3.0 20/18\",\"material\":\"Cellular metal deck - Robertson ADC 3.0 20/18, 5/32\\\" perforations, fiberglass pad and insulation\",\"absorption\":{\"63\":0.3,\"125\":0.62,\"250\":0.61,\"500\":0.82,\"1000\":0.83,\"2000\":0.66,\"4000\":0.6,\"8000\":0.66},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"PSwjo3RPcAko3OBi\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster\",\"material\":\"Plaster, 1/2in, on wall lath\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.02,\"500\":0.03,\"1000\":0.04,\"2000\":0.04,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.03,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"PXNay6iNR7GoOMKN\"},{\"tags\":[\"Roofing\",\"Roofing Constructons\"],\"manufacturer\":\"\",\"name\":\"1/8\\\" Hardbd Panel 1 Lb./Sq. Ft W/ Bitumen Roofing\",\"material\":\"1/8\\\" hardbd panel 1 lb./sq. ft w/ bitumen roofing, felt backing, mtd over 2\\\" air space, on solid back\",\"absorption\":{\"63\":0.5,\"125\":0.9,\"250\":0.45,\"500\":0.25,\"1000\":0.15,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.24,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Pf8oooVkbWUbc3ld\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Almute (2.5Mm Thick) With 50Mm (2\\\") Honeycomb\",\"material\":\"Almute (2.5mm thick) with 50mm (2\\\") honeycomb\",\"absorption\":{\"63\":0.14,\"125\":0.2,\"250\":0.59,\"500\":0.97,\"1000\":0.98,\"2000\":0.8,\"4000\":0.68,\"8000\":0.8},\"nrc\":0.84,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Pfr4nmJtpxUhBl7c\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Curved Bad Panel - 1\\\" Thick  6 Pcf Curved Bad - A Mounting\",\"material\":\"RPG Curved BAD Panel - 1\\\" thick  6 PCF curved BAD - A mounting\",\"absorption\":{\"63\":0.25,\"125\":0.36,\"250\":0.68,\"500\":0.95,\"1000\":0.97,\"2000\":0.85,\"4000\":0.69,\"8000\":0.85},\"nrc\":0.86,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"PsiFODMbJmcr1x3J\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Glass\",\"material\":\"Glass, > 1/4in, monolithic\",\"absorption\":{\"63\":0.03,\"125\":0.18,\"250\":0.05,\"500\":0.04,\"1000\":0.03,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.04,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"Q0CjQkJvKTbMqcaK\"},{\"tags\":[\"Rubber\",\"Rubber\"],\"manufacturer\":\"\",\"name\":\"Hard Sheet Rubber\",\"material\":\"Hard sheet rubber\",\"absorption\":{\"63\":0.03,\"125\":0.04,\"250\":0.05,\"500\":0.05,\"1000\":0.1,\"2000\":0.05,\"4000\":0.03,\"8000\":0.05},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Q5dgAbY1I5BuSd6x\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Audience In Upholstered Seats\",\"material\":\"Audience in upholstered seats\",\"absorption\":{\"63\":0,\"125\":0.18,\"250\":0.4,\"500\":0.46,\"1000\":0.46,\"2000\":0.51,\"4000\":0.46,\"8000\":0.46},\"nrc\":0.46,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"QFCVbDYrU5uWvhK2\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Optima Open Plan 2x2 x1in\",\"absorption\":{\"63\":0.29,\"125\":0.78,\"250\":0.98,\"500\":0.76,\"1000\":0.98,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"QIHXrivTqi2Rd4k7\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1 Layer Gypsum Board\",\"material\":\"1 layer gypsum board, 3/8\\\" thick, on 3-5/8\\\" metal studs, 16\\\" o.c.-EST.\",\"absorption\":{\"63\":0.45,\"125\":0.35,\"250\":0.15,\"500\":0.07,\"1000\":0.05,\"2000\":0.07,\"4000\":0.09,\"8000\":0.11},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"QMaKwpc8yeccno6h\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Diffuse Signature Wood (1\\\" Standoff Sides Closed)\",\"material\":\"Diffuse Signature Wood (1\\\" Standoff Sides Closed)\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0.02,\"500\":0.09,\"1000\":0.19,\"2000\":0.14,\"4000\":0.15,\"8000\":0.16},\"nrc\":0.11,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"QSEIH3goj9RG8TNd\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Am. Seating Ac. Pan\",\"material\":\"Am. Seating ac. pan\",\"absorption\":{\"63\":0,\"125\":0.02,\"250\":0.07,\"500\":0.11,\"1000\":0.07,\"2000\":0.08,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.08,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"QYSptfydpss5vxw5\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Perdue Fabric And Rockwool 1\\\" Panel\",\"material\":\"Perdue Fabric and Rockwool 1\\\" Panel\",\"absorption\":{\"63\":0.11,\"125\":0.15,\"250\":0.7,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.92,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"QZj4RxvnCKjwjSi1\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloudlite Baffles\",\"material\":\"MBI Cloudlite Baffles, 2800-2020 sailcloth\",\"absorption\":{\"63\":0,\"125\":0.29,\"250\":0.68,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.91,\"source\":\"MBI\",\"description\":\"\",\"uuid\":\"QaC0A0D4YRZxyaKs\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"4\\\" Iac Moduline Panel With 12\\\" Air Space\",\"material\":\"4\\\" IAC Moduline panel with 12\\\" air space\",\"absorption\":{\"63\":0.6,\"125\":0.85,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.95,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"QjyWEt09BNMzaKQu\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Rockwool (1/2 To 1 Lb./Sq. Ft.)\",\"material\":\"Rockwool (1/2 to 1 lb./sq. ft.), or fiberglass, 1\\\" semi-rigid solid backing with 5% perforated hardboard cover\",\"absorption\":{\"63\":0.05,\"125\":0.1,\"250\":0.85,\"500\":0.85,\"1000\":0.85,\"2000\":0.35,\"4000\":0.15,\"8000\":0.35},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"QlP6ErLnZ05GoYf0\"},{\"tags\":[\"Outdoors\",\"Water\"],\"manufacturer\":\"\",\"name\":\"Water Surface\",\"material\":\"Water surface, as in a swimming pool\",\"absorption\":{\"63\":0.11,\"125\":0.28,\"250\":0.22,\"500\":0.17,\"1000\":0.09,\"2000\":0.1,\"4000\":0.11,\"8000\":0.11},\"nrc\":0.15,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"QlaTuOh1yynhxXvJ\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 6In Type Rsc; Painted\",\"material\":\"Soundblox 6in Type RSC; painted\",\"absorption\":{\"63\":0,\"125\":0.48,\"250\":0.99,\"500\":0.91,\"1000\":0.76,\"2000\":0.67,\"4000\":0.51,\"8000\":0.51},\"nrc\":0.83,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"QoPJJBPHOyCjA17i\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Glass\",\"material\":\"Glass, ordinary window\",\"absorption\":{\"63\":0.13,\"125\":0.35,\"250\":0.25,\"500\":0.18,\"1000\":0.12,\"2000\":0.07,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.16,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"QtmSubmu0mPTLCiC\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Gypsum Board On 2\\\" X 4\\\" Studs\",\"material\":\"1/2\\\" gypsum board on 2\\\" x 4\\\" studs, 16\\\" o.c. painted AMA? VALUES SEEM WRONG AT LOW END\",\"absorption\":{\"63\":0.15,\"125\":0.1,\"250\":0.08,\"500\":0.05,\"1000\":0.03,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.05,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"QzdDD94UvApU2ul9\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Sound Cell; Acoustade 8 Cmu Without Fillers\",\"material\":\"Sound Cell; Acoustade 8 cmu without fillers\",\"absorption\":{\"63\":0.24,\"125\":0.98,\"250\":0.47,\"500\":0.35,\"1000\":0.71,\"2000\":0.77,\"4000\":0.69,\"8000\":0.69},\"nrc\":0.58,\"source\":\"Bestblock data\",\"description\":\"\",\"uuid\":\"R5Xhcs3cFTjOSdEO\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.0H Spacing, Type NF-4PS\",\"absorption\":{\"63\":0.13,\"125\":0.18,\"250\":0.41,\"500\":0.64,\"1000\":0.66,\"2000\":0.72,\"4000\":0.41,\"8000\":0.72},\"nrc\":0.61,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"R82lkNzHtNjyWTKF\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics Quadrillo Perf Wood 2-3/8In\",\"material\":\"Decoustics QUADRILLO perf wood 2-3/8in\",\"absorption\":{\"63\":0.05,\"125\":0.38,\"250\":0.67,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.94,\"8000\":0.94},\"nrc\":0.91,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"RBS6xUudEk7G6gkW\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Mbi Colorsonix 1800 Wall Panel 1\\\" Thick\",\"material\":\"MBI Colorsonix 1800 Wall Panel 1\\\" thick, 6# density, Perforated Vinyl\",\"absorption\":{\"63\":0.08,\"125\":0.11,\"250\":0.3,\"500\":0.77,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.76,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"RDrECJ3M8eyFrtXc\"},{\"tags\":[\"Foams\",\"Foams\"],\"manufacturer\":\"\",\"name\":\"1\\\" Thick Foam - Scott Coustex\",\"material\":\"1\\\" thick foam - Scott Coustex\",\"absorption\":{\"63\":0.06,\"125\":0.15,\"250\":0.28,\"500\":0.51,\"1000\":0.78,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.64,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"RGqKvjUNQ8AHt4p4\"},{\"tags\":[\"Ceilings\",\"Gypsum Board Ceilings\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1/2in thick\",\"absorption\":{\"63\":0.05,\"125\":0.29,\"250\":0.1,\"500\":0.05,\"1000\":0.04,\"2000\":0.07,\"4000\":0.09,\"8000\":0.09},\"nrc\":0.07,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"ROU1k4g0cgMC5b1N\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sportsboard 1-1/16\\\" Thick\",\"material\":\"Kinetics SportsBoard 1-1/16\\\" Thick\",\"absorption\":{\"63\":0.08,\"125\":0.11,\"250\":0.25,\"500\":0.66,\"1000\":0.94,\"2000\":0.99,\"4000\":0.98,\"8000\":0.99},\"nrc\":0.71,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"RRgzkFNcEA1ZDccj\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics H.I.R 1 Perf. Vinyl 1-1/8In\",\"material\":\"Decoustics h.i.r 1 perf. vinyl 1-1/8in\",\"absorption\":{\"63\":0,\"125\":0.16,\"250\":0.57,\"500\":0.92,\"1000\":0.99,\"2000\":0.99,\"4000\":0.93,\"8000\":0.93},\"nrc\":0.87,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"RVHRz01qVlpkzlp4\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Rockwool (1/2 To 1 Lb./Sq. Ft.)\",\"material\":\"Rockwool (1/2 to 1 lb./sq. ft.), or fiberglass (1/2 lb./sq. ft.), 1\\\" semi-rigid battens, solid backing with 10% perforated or 20% slotted hardboard cover\",\"absorption\":{\"63\":0.05,\"125\":0.15,\"250\":0.3,\"500\":0.75,\"1000\":0.85,\"2000\":0.75,\"4000\":0.4,\"8000\":0.75},\"nrc\":0.66,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"RiW7qtbAx0MDGKdI\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"2X4 Wood Stud Wall 16\\\" Oc W/ R-19 - Iso Max - Hat Channel - 1 Layer Quietrock Qr-525\",\"material\":\"2x4 Wood Stud Wall 16\\\" oc w/ R-19 - ISO Max - Hat Channel - 1 Layer QuietRock QR-525\",\"absorption\":{\"63\":0.66,\"125\":0.4,\"250\":0.16,\"500\":0.07,\"1000\":0.04,\"2000\":0.07,\"4000\":0.1,\"8000\":0.13},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Ril4zUzkZLAKsiE2\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Martin 1-1/2In Fibroplank\",\"material\":\"Martin 1-1/2in FIBROPLANK\",\"absorption\":{\"63\":0,\"125\":0.09,\"250\":0.21,\"500\":0.42,\"1000\":0.99,\"2000\":0.58,\"4000\":0.8,\"8000\":0.8},\"nrc\":0.55,\"source\":\"Martin data\",\"description\":\"\",\"uuid\":\"RlgFTumr5JCsTDOL\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Asc Tube Trap\",\"material\":\"ASC Tube Trap, 16\\\" Diameter x 1' L, Quarter-Round - sabines per tube \",\"absorption\":{\"63\":0.72,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"RucjFJ82C82whcIz\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.33H Spacing, Type NF-4PS\",\"absorption\":{\"63\":0.18,\"125\":0.31,\"250\":0.41,\"500\":0.38,\"1000\":0.35,\"2000\":0.23,\"4000\":0.35,\"8000\":0.47},\"nrc\":0.34,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"S3fmpseSyZnPbsqh\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Occupied Wooden Church Pews - Mcb\",\"material\":\"Occupied wooden church pews - MCB\",\"absorption\":{\"63\":0.35,\"125\":0.5,\"250\":0.56,\"500\":0.66,\"1000\":0.76,\"2000\":0.8,\"4000\":0.76,\"8000\":0.8},\"nrc\":0.7,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"SHIU7ZBhEI1Tkood\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, heavy, on 5/8in perf mineral fiberboard, air space\",\"absorption\":{\"63\":0.17,\"125\":0.37,\"250\":0.41,\"500\":0.63,\"1000\":0.85,\"2000\":0.96,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.71,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"SIaEjZwJvroHuLSL\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.5H Spacing, Type NF-4PS\",\"absorption\":{\"63\":0.13,\"125\":0.18,\"250\":0.42,\"500\":0.8,\"1000\":0.91,\"2000\":0.87,\"4000\":0.48,\"8000\":0.87},\"nrc\":0.75,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"SLG0B3iLPDAdP14I\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Fissured Travertone Panel (2 X 2 X 3/4\\\")\",\"material\":\"Armstrong Fissured Travertone panel (2 x 2 x 3/4\\\"), Mount E-400\",\"absorption\":{\"63\":0.24,\"125\":0.48,\"250\":0.38,\"500\":0.53,\"1000\":0.78,\"2000\":0.94,\"4000\":0.98,\"8000\":0.99},\"nrc\":0.66,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"SORjMQC24R1hrqlh\"},{\"tags\":[\"Outdoors\",\"Grass\"],\"manufacturer\":\"\",\"name\":\"Grass\",\"material\":\"Grass, marion bluegrass, 2in high\",\"absorption\":{\"63\":0,\"125\":0.11,\"250\":0.26,\"500\":0.6,\"1000\":0.69,\"2000\":0.92,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.62,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"SQ7W8hUYXOFQ1OnJ\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3\\\" Owens Corning 705\",\"material\":\"3\\\" Owens Corning 705, plain faced, Mounting A\",\"absorption\":{\"63\":0.25,\"125\":0.54,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Sbwjcbczr3VOnAMT\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-4P, Intermittent Mount\",\"absorption\":{\"63\":0.67,\"125\":0.96,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.94,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.98,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Sc6H4WSx3UKh4lOF\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"Baswaphon\",\"material\":\"BASWAphon, 30mm Classic Fine Finish\",\"absorption\":{\"63\":0.23,\"125\":0.32,\"250\":0.34,\"500\":0.86,\"1000\":0.98,\"2000\":0.89,\"4000\":0.72,\"8000\":0.89},\"nrc\":0.77,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"SeT5tCBSaSMetASs\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"Plaster Or Gypsum Board (Suspended) With Air Space (12\\\" Or More)\",\"material\":\"Plaster or gypsum board (suspended) with air space (12\\\" or more)\",\"absorption\":{\"63\":0.3,\"125\":0.2,\"250\":0.15,\"500\":0.1,\"1000\":0.08,\"2000\":0.04,\"4000\":0.02,\"8000\":0.04},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"T1JK42eavYRK1ZQ7\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Cork\",\"material\":\"Cork, rubber, linoleum or asphalt tiles on concrete\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.03,\"500\":0.03,\"1000\":0.03,\"2000\":0.03,\"4000\":0.02,\"8000\":0.03},\"nrc\":0.03,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"T4u30b6IdEwUywrN\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13Fc\",\"material\":\"K13fc, solid backing, 1/2in\",\"absorption\":{\"63\":0.07,\"125\":0.15,\"250\":0.16,\"500\":0.46,\"1000\":0.87,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.62,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"T6m3nkpjArPOTl0w\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone 101 F Fissured 3/4 1X1\",\"material\":\"USG Acoustone 101 F fissured 3/4 1x1\",\"absorption\":{\"63\":0.31,\"125\":0.63,\"250\":0.64,\"500\":0.54,\"1000\":0.76,\"2000\":0.88,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.71,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"T8TOVLGrU5k3wdA9\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 703\",\"material\":\"2\\\" Owens Corning 703, FRK faced, Mounting E-405\",\"absorption\":{\"63\":0.32,\"125\":0.45,\"250\":0.47,\"500\":0.97,\"1000\":0.93,\"2000\":0.65,\"4000\":0.42,\"8000\":0.65},\"nrc\":0.76,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TDBQiv0KIRE8nVZk\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Picado With 0.5Mm Micro-Perforations A-Mounted Over 2\\\" Fiberglass Core\",\"material\":\"Kinetics Picado with 0.5mm micro-perforations A-Mounted over 2\\\" Fiberglass Core\",\"absorption\":{\"63\":0.2,\"125\":0.51,\"250\":0.99,\"500\":0.99,\"1000\":0.87,\"2000\":0.77,\"4000\":0.57,\"8000\":0.77},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TFPwkB34hgHQNeiF\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno 4/10 E-400 Mounted\",\"material\":\"Kinetics Sereno 4/10 E-400 Mounted\",\"absorption\":{\"63\":0.42,\"125\":0.83,\"250\":0.83,\"500\":0.61,\"1000\":0.52,\"2000\":0.51,\"4000\":0.32,\"8000\":0.51},\"nrc\":0.62,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TJFn1g2wwmS5Ey41\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Cafco Soundcote On Metal Lath Over 16\\\" Air Space\",\"material\":\"1/2\\\" Cafco SoundCote on metal lath over 16\\\" air space\",\"absorption\":{\"63\":0.9,\"125\":0.87,\"250\":0.66,\"500\":0.65,\"1000\":0.71,\"2000\":0.83,\"4000\":0.8,\"8000\":0.83},\"nrc\":0.71,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TJfHIWgRD1Wm4bpe\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg Fiberglass Golden Pyramid Diffusers\",\"material\":\"RPG fiberglass Golden Pyramid diffusers, 2x2; mtg. A\",\"absorption\":{\"63\":0.06,\"125\":0.74,\"250\":0.12,\"500\":0.1,\"1000\":0.05,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.08,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"TMKVvbzFpZ1SNKfj\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Person\",\"material\":\"Person, elementary students (per person) est. Knudsen & Harris\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TMS8untzGF4BSULR\"},{\"tags\":[\"Floors\",\"Concrete\"],\"manufacturer\":\"\",\"name\":\"Concrete Or Terrazzo\",\"material\":\"Concrete or terrazzo\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.02,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"TMYcbWso3dbLNuZn\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Beranek Occupied Audience In Upholstered Seats (Perforated Seat Bottoms And Edge Effect)\",\"material\":\"Beranek occupied audience in upholstered seats (perforated seat bottoms and edge effect), and orchestra and chorus (per sq. ft.)\",\"absorption\":{\"63\":0.25,\"125\":0.39,\"250\":0.57,\"500\":0.8,\"1000\":0.94,\"2000\":0.92,\"4000\":0.87,\"8000\":0.92},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TSqCXmIamWfNyXZd\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Acoustical Membrane - Fabrasorb I (Birdair)\",\"material\":\"Acoustical Membrane - Fabrasorb I (Birdair)\",\"absorption\":{\"63\":0.23,\"125\":0.33,\"250\":0.66,\"500\":0.43,\"1000\":0.56,\"2000\":0.64,\"4000\":0.65,\"8000\":0.66},\"nrc\":0.57,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TUPTKlewloGgT8aV\"},{\"tags\":[\"Walls\",\"Brick\"],\"manufacturer\":\"\",\"name\":\"Brick\",\"material\":\"Brick, unglazed and painted\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.02,\"1000\":0.02,\"2000\":0.02,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.02,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"TXLs7N9QFkZOdDUo\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Upholstered Seats\",\"material\":\"Upholstered seats, leather covered (per sq. ft.) Beranek\",\"absorption\":{\"63\":0.2,\"125\":0.44,\"250\":0.54,\"500\":0.6,\"1000\":0.62,\"2000\":0.58,\"4000\":0.5,\"8000\":0.58},\"nrc\":0.59,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TYFrLrPP5PRJPwnx\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"3 Layers Gypsum Board\",\"material\":\"3 layers gypsum board, 5/8\\\" thick, on 3-5/8\\\" metal studs, 16\\\" o.c., 1\\\" batt insulation-EST.\",\"absorption\":{\"63\":0.15,\"125\":0.1,\"250\":0.08,\"500\":0.07,\"1000\":0.06,\"2000\":0.08,\"4000\":0.09,\"8000\":0.1},\"nrc\":0.07,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TbIe7gpTlyvLvqXl\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Drapery\",\"material\":\"Drapery, 14 oz/yd, 4in air space; 50% fullness\",\"absorption\":{\"63\":0,\"125\":0.07,\"250\":0.31,\"500\":0.49,\"1000\":0.75,\"2000\":0.7,\"4000\":0.6,\"8000\":0.6},\"nrc\":0.56,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"Td8qFVllNzK6xzYP\"},{\"tags\":[\"Floors\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Vct On Concrete\",\"material\":\"VCT on concrete\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.03,\"500\":0.03,\"1000\":0.03,\"2000\":0.03,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.03,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"Tjn1GhgrBtTd6Vt6\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Millennia Climaplus 3/4 2X2\",\"material\":\"USG Millennia ClimaPlus 3/4 2x2\",\"absorption\":{\"63\":0.17,\"125\":0.45,\"250\":0.33,\"500\":0.59,\"1000\":0.92,\"2000\":0.96,\"4000\":0.93,\"8000\":0.93},\"nrc\":0.7,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"TmR79mAk1bKBYbKE\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1 Layer Gypsum Board\",\"material\":\"1 layer gypsum board, 5/8\\\" thick, on 3-5/8\\\" metal studs, 16\\\" o.c.-EST.\",\"absorption\":{\"63\":0.35,\"125\":0.25,\"250\":0.07,\"500\":0.05,\"1000\":0.04,\"2000\":0.07,\"4000\":0.09,\"8000\":0.11},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TmUaAScGKmovmMVX\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Carpet And Pad On Kinetics Floating Wood Floor\",\"material\":\"Carpet and pad on Kinetics floating wood floor\",\"absorption\":{\"63\":0.08,\"125\":0.12,\"250\":0.23,\"500\":0.59,\"1000\":0.5,\"2000\":0.36,\"4000\":0.41,\"8000\":0.46},\"nrc\":0.42,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TpV4cJua2woJdrXl\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1 Layer 5/8\\\" Gypsum Board\",\"material\":\"1 layer 5/8\\\" gypsum board, on 1\\\" x 3\\\" 16\\\" o.c., with batt insulation  EGAN\",\"absorption\":{\"63\":0.65,\"125\":0.55,\"250\":0.14,\"500\":0.08,\"1000\":0.04,\"2000\":0.12,\"4000\":0.11,\"8000\":0.12},\"nrc\":0.1,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"TzV18JA2f3hLE5fd\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Flat Double Layer\",\"material\":\"32oz. Flat double layer, 4\\\" separation, 8\\\" behind rear fabric, closed side edges\",\"absorption\":{\"63\":0.41,\"125\":0.59,\"250\":0.68,\"500\":0.85,\"1000\":0.86,\"2000\":0.79,\"4000\":0.76,\"8000\":0.79},\"nrc\":0.8,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"U2sH6papSvqazFho\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Orion 270 Climaplus 3/4 2X2 Backed\",\"material\":\"USG Orion 270 ClimaPlus 3/4 2x2 backed\",\"absorption\":{\"63\":0.2,\"125\":0.43,\"250\":0.4,\"500\":0.63,\"1000\":0.95,\"2000\":0.99,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.74,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"U3pSZsTMO22e0cMz\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3.50\\\" Owens Corning R-11\",\"material\":\"3.50\\\" Owens Corning R-11, plain faced, Mounting A\",\"absorption\":{\"63\":0.24,\"125\":0.34,\"250\":0.85,\"500\":0.99,\"1000\":0.97,\"2000\":0.97,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.95,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"U8nzeE352SC182d8\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 701\",\"material\":\"2\\\" Owens Corning 701, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.31,\"125\":0.44,\"250\":0.66,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"UB9wiucfWhVreFqz\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone 2In Thick\",\"material\":\"IAC Varitone 2in thick, No facing\",\"absorption\":{\"63\":0.03,\"125\":0.35,\"250\":0.65,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.92,\"8000\":0.92},\"nrc\":0.91,\"source\":\"IAC data\",\"description\":\"\",\"uuid\":\"UGYYIkstus2THH0Z\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Omniffusor - A Mount With Fabric On Surface\",\"material\":\"RPG Omniffusor - A mount with fabric on surface\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.17,\"500\":0.28,\"1000\":0.41,\"2000\":0.26,\"4000\":0.28,\"8000\":0.3},\"nrc\":0.28,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"UIQIjwAelZlzz9W1\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Stage Opening\",\"material\":\"Stage Opening, average; depends on set\",\"absorption\":{\"63\":0.08,\"125\":0.25,\"250\":0.35,\"500\":0.45,\"1000\":0.55,\"2000\":0.65,\"4000\":0.75,\"8000\":0.75},\"nrc\":0.5,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"UIvouVfZVswA2AMT\"},{\"tags\":[\"Common\",\"Common Materials\"],\"manufacturer\":\"\",\"name\":\"Unglazed Brick\",\"material\":\"Unglazed brick\",\"absorption\":{\"63\":0.02,\"125\":0.03,\"250\":0.03,\"500\":0.03,\"1000\":0.04,\"2000\":0.05,\"4000\":0.07,\"8000\":0.09},\"nrc\":0.04,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"UMDxFyWryko1QbFL\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Flutterfree (Slotted) - Helmholtz Mount - 1/4\\\" Slot Width / 1.125\\\" Slot Spacing - Surface Mount Over 1\\\" 6Pcf Fiberglass\",\"material\":\"RPG FlutterFree (slotted) - Helmholtz Mount - 1/4\\\" slot width / 1.125\\\" slot spacing - surface mount over 1\\\" 6PCF fiberglass\",\"absorption\":{\"63\":0.08,\"125\":0.11,\"250\":0.38,\"500\":0.99,\"1000\":0.61,\"2000\":0.35,\"4000\":0.41,\"8000\":0.47},\"nrc\":0.58,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"URtzzWU5nVS9AUSC\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Wenger\",\"material\":\"Wenger, Type 1 diffuser, 4x4, gel coat finish, E400, PSF\",\"absorption\":{\"63\":0.03,\"125\":0.09,\"250\":0.13,\"500\":0.12,\"1000\":0.1,\"2000\":0.16,\"4000\":0.25,\"8000\":0.25},\"nrc\":0.13,\"source\":\"Wenger data\",\"description\":\"\",\"uuid\":\"UUXKrEkLC8SelZg0\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloud-Lite Baffels 2800-2020 ((2'X4'\",\"material\":\"MBI Cloud-Lite Baffels 2800-2020 ((2'x4', 2\\\" thick, 2# density) Sailcloth\",\"absorption\":{\"63\":0.2,\"125\":0.29,\"250\":0.68,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"UUxOu7y71JBpyTZk\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1 Layer Gypsum Board\",\"material\":\"1 layer gypsum board, 3/8\\\" thick, on 3-5/8\\\" metal studs, 16\\\" o.c., 1\\\" batt insulation-EST.\",\"absorption\":{\"63\":0.5,\"125\":0.4,\"250\":0.2,\"500\":0.1,\"1000\":0.06,\"2000\":0.08,\"4000\":0.09,\"8000\":0.1},\"nrc\":0.11,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"UXqYnNbL3kmwP5GF\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Bad Panel - 1\\\" A Mount With 5/8\\\" Holes\",\"material\":\"RPG BAD Panel - 1\\\" A mount with 5/8\\\" holes\",\"absorption\":{\"63\":0.08,\"125\":0.11,\"250\":0.32,\"500\":0.76,\"1000\":0.99,\"2000\":0.99,\"4000\":0.86,\"8000\":0.99},\"nrc\":0.77,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Uh0tcRKoytw3NIEU\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-2N, Continuous Mount\",\"absorption\":{\"63\":0.25,\"125\":0.35,\"250\":0.65,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.92,\"8000\":0.99},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"UjKfZ9Pkbozp7CTB\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13Fc\",\"material\":\"K13fc, solid backing, 1in\",\"absorption\":{\"63\":0,\"125\":0.12,\"250\":0.38,\"500\":0.88,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.81,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"UjNAWVhJbM9fFJfC\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Flat Double Layer\",\"material\":\"25oz. Flat double layer, 0\\\" separation, 3\\\" behind rear fabric, closed side edges\",\"absorption\":{\"63\":0.13,\"125\":0.19,\"250\":0.61,\"500\":0.74,\"1000\":0.7,\"2000\":0.76,\"4000\":0.75,\"8000\":0.76},\"nrc\":0.7,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"UmcyNUptIrLhpYs3\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Orchestra On Stage\",\"material\":\"Orchestra on stage, 44 players, 2 brass (in metric sabines)  (Beranek 1998)\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Urvlyz4Pj2YLIPZb\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3\\\" Owens Corning 703\",\"material\":\"3\\\" Owens Corning 703, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.32,\"125\":0.45,\"250\":0.98,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"UvQRfNi2ONgsSnPG\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Congregation\",\"material\":\"Congregation, seated in wooden pews\",\"absorption\":{\"63\":0.27,\"125\":0.57,\"250\":0.61,\"500\":0.75,\"1000\":0.86,\"2000\":0.91,\"4000\":0.86,\"8000\":0.86},\"nrc\":0.78,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"V0o0qSU0nkjm5M4w\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Plywood On 2 Layers Of 3/4\\\" Plywood On 1\\\" Kinetics Isolators (A90-156)\",\"material\":\"1/2\\\" plywood on 2 layers of 3/4\\\" plywood on 1\\\" Kinetics Isolators (A90-156)\",\"absorption\":{\"63\":0.18,\"125\":0.08,\"250\":0.1,\"500\":0.15,\"1000\":0.16,\"2000\":0.23,\"4000\":0.43,\"8000\":0.63},\"nrc\":0.16,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"V2d6ABRGw0dbM7te\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Occupied\",\"material\":\"Occupied, lightly upholstered (Beranek 1998)\",\"absorption\":{\"63\":0.36,\"125\":0.51,\"250\":0.64,\"500\":0.75,\"1000\":0.8,\"2000\":0.82,\"4000\":0.83,\"8000\":0.84},\"nrc\":0.75,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"V2mAHqgaSbfvcUan\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Classroom Chairs\",\"material\":\"Classroom Chairs, fully occupied - MCB\",\"absorption\":{\"63\":0.21,\"125\":0.3,\"250\":0.41,\"500\":0.49,\"1000\":0.84,\"2000\":0.87,\"4000\":0.84,\"8000\":0.87},\"nrc\":0.65,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"V43NV4qbcSIZupdI\"},{\"tags\":[\"Ceilings\",\"Special Ceilings\"],\"manufacturer\":\"\",\"name\":\"Wood Ceiling (Solid)\",\"material\":\"Wood Ceiling (solid), 2 layers 1/2in, suspended on black iron\",\"absorption\":{\"63\":0.07,\"125\":0.18,\"250\":0.14,\"500\":0.1,\"1000\":0.08,\"2000\":0.07,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.1,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"V9rFu5E3lcY1F5h0\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics H.I.R 1 Fabric 1-1/8In\",\"material\":\"Decoustics h.i.r 1 fabric 1-1/8in\",\"absorption\":{\"63\":0,\"125\":0.16,\"250\":0.57,\"500\":0.94,\"1000\":0.99,\"2000\":0.99,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.87,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"VC061fHImmm1ytTB\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Polyurethane Foam\",\"material\":\"Polyurethane foam, 1in thick, open cell, reticulated\",\"absorption\":{\"63\":0.02,\"125\":0.07,\"250\":0.11,\"500\":0.2,\"1000\":0.32,\"2000\":0.6,\"4000\":0.85,\"8000\":0.85},\"nrc\":0.31,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"VCO0sky4UYMgVWsF\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Asc Tube Trap\",\"material\":\"ASC Tube Trap, 11\\\" Diameter x 2' L, Full-Round - sabines per tube \",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"VH40UssmE5sRUwQR\"},{\"tags\":[\"Plaster\",\"Plaster Constructions\"],\"manufacturer\":\"\",\"name\":\"Plaster On Lath\",\"material\":\"Plaster on lath, rough AIMA rev no thk, no air space or backing given\",\"absorption\":{\"63\":0.02,\"125\":0.14,\"250\":0.1,\"500\":0.06,\"1000\":0.05,\"2000\":0.04,\"4000\":0.03,\"8000\":0.04},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"VNuTyVS6x0R4JpSX\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno 2/10 A-Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Sereno 2/10 A-Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.02,\"125\":0.21,\"250\":0.74,\"500\":0.89,\"1000\":0.33,\"2000\":0.14,\"4000\":0.08,\"8000\":0.14},\"nrc\":0.53,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"VPXeAUClcuCLDlWc\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3\\\" Owens Corning 703\",\"material\":\"3\\\" Owens Corning 703, plain faced, Mounting A\",\"absorption\":{\"63\":0.37,\"125\":0.53,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"VRpjFxq4tBEE26je\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Eclipse Climaplus 3/4 2X2\",\"material\":\"USG Eclipse ClimaPlus 3/4 2x2\",\"absorption\":{\"63\":0.17,\"125\":0.47,\"250\":0.33,\"500\":0.59,\"1000\":0.91,\"2000\":0.96,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.7,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"VT7cXdLbQe8bnEWk\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"1\\\" Tectum Mounting #2 (1\\\" X 3\\\" Battens\",\"material\":\"1\\\" Tectum mounting #2 (1\\\" x 3\\\" battens, 24\\\" center, over solid backing)\",\"absorption\":{\"63\":0.05,\"125\":0.07,\"250\":0.15,\"500\":0.36,\"1000\":0.65,\"2000\":0.71,\"4000\":0.81,\"8000\":0.91},\"nrc\":0.47,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"VaPwfBELIxerupKG\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 705\",\"material\":\"1\\\" Owens Corning 705, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.22,\"125\":0.32,\"250\":0.3,\"500\":0.66,\"1000\":0.9,\"2000\":0.95,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.7,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Vb648rBbkHCSeP4d\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Bad Panel - 1\\\" A Mount With 1/2\\\" Holes\",\"material\":\"RPG BAD Panel - 1\\\" A mount with 1/2\\\" holes\",\"absorption\":{\"63\":0.12,\"125\":0.17,\"250\":0.4,\"500\":0.86,\"1000\":0.99,\"2000\":0.84,\"4000\":0.61,\"8000\":0.84},\"nrc\":0.77,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Vc7Be7WQ6O3CQh3R\"},{\"tags\":[\"Floors\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Floor (T&G)\",\"material\":\"Wood Floor (t&g), 2 layers 5/8in, adhered to concrete\",\"absorption\":{\"63\":0.03,\"125\":0.09,\"250\":0.06,\"500\":0.05,\"1000\":0.05,\"2000\":0.05,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.05,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"VepJwUsmtAKbaldQ\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone\",\"material\":\"USG Acoustone, foil, 3/4in, 2x2 panels, F fissured 132\",\"absorption\":{\"63\":0.16,\"125\":0.43,\"250\":0.31,\"500\":0.59,\"1000\":0.98,\"2000\":0.98,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.72,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"ViMasbelAuU7wCI9\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Perdue High-Impact Fabric And Rockwool 2\\\" Panel\",\"material\":\"Perdue High-Impact Fabric and Rockwool 2\\\" Panel\",\"absorption\":{\"63\":0.34,\"125\":0.49,\"250\":0.89,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.98,\"8000\":0.99},\"nrc\":0.97,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"VjWGFcjjQYWlHVBr\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Bad Panel - 4\\\" A Mount With 1/2\\\" Holes\",\"material\":\"RPG BAD Panel - 4\\\" A mount with 1/2\\\" holes\",\"absorption\":{\"63\":0.63,\"125\":0.9,\"250\":0.92,\"500\":0.99,\"1000\":0.97,\"2000\":0.82,\"4000\":0.62,\"8000\":0.82},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Vuo7nAd002o3cZhe\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Decoustics Baffle #10&20 ; S/H =4\",\"material\":\"decoustics Baffle #10&20 ; S/H =4\",\"absorption\":{\"63\":0.22,\"125\":0.32,\"250\":0.79,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.94,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Vypefnj21slwxYZT\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"Pyrok Acoustement 40\",\"material\":\"Pyrok Acoustement 40, 1/2in, sprayed on concrete slab\",\"absorption\":{\"63\":0.03,\"125\":0.11,\"250\":0.16,\"500\":0.26,\"1000\":0.49,\"2000\":0.78,\"4000\":0.78,\"8000\":0.78},\"nrc\":0.42,\"source\":\"Pyrok tests\",\"description\":\"\",\"uuid\":\"Vz12oo9IMf6h4Q0N\"},{\"tags\":[\"People\",\"Heavily upholstered\"],\"manufacturer\":\"\",\"name\":\"Heavily Upholstered Seats \",\"material\":\"Heavily Upholstered Seats , unoccupied\",\"absorption\":{\"63\":0.32,\"125\":0.7,\"250\":0.76,\"500\":0.81,\"1000\":0.84,\"2000\":0.84,\"4000\":0.81,\"8000\":0.81},\"nrc\":0.81,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"Vzsjn9oid8N0Dt82\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Tectum\",\"material\":\"Tectum, 1in, against solid backing\",\"absorption\":{\"63\":0,\"125\":0.06,\"250\":0.13,\"500\":0.24,\"1000\":0.45,\"2000\":0.82,\"4000\":0.64,\"8000\":0.64},\"nrc\":0.41,\"source\":\"Tectum Company\",\"description\":\"\",\"uuid\":\"W2wCsvqJV0a1RMGw\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Unpainted Fiberboard\",\"material\":\"Unpainted fiberboard, normal or soft, 1/4\\\" thick, mounted on a solid backing\",\"absorption\":{\"63\":0.05,\"125\":0.05,\"250\":0.1,\"500\":0.15,\"1000\":0.25,\"2000\":0.3,\"4000\":0.3,\"8000\":0.3},\"nrc\":0.2,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"W5EG7ZCEopuB77Fu\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 6In Type R; Painted\",\"material\":\"Soundblox 6in Type R; painted\",\"absorption\":{\"63\":0,\"125\":0.39,\"250\":0.99,\"500\":0.65,\"1000\":0.58,\"2000\":0.43,\"4000\":0.45,\"8000\":0.45},\"nrc\":0.66,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"W8TqkXS9SHuzM1Hd\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster On Brick\",\"material\":\"Plaster on brick\",\"absorption\":{\"63\":0,\"125\":0.01,\"250\":0.02,\"500\":0.02,\"1000\":0.03,\"2000\":0.04,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.03,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"WDskEsB9ksTYOxkv\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Thin Cork Tiles\",\"material\":\"Thin cork tiles, wood blocks, linoleum, or rubber flooring on solid floor\",\"absorption\":{\"63\":0.05,\"125\":0.02,\"250\":0.04,\"500\":0.05,\"1000\":0.05,\"2000\":0.1,\"4000\":0.05,\"8000\":0.1},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"WUN53rNmMOvY0XJ8\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Bass Trap\",\"material\":\"Bass trap, Helmholtz resonator tuned for 100 Hz (low Q)\",\"absorption\":{\"63\":0.68,\"125\":0.68,\"250\":0.5,\"500\":0.3,\"1000\":0.1,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.25,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Waawm60MUzFB3ZVA\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Tectum Fabritough Panels\",\"material\":\"Tectum FabriTough panels, Mtg. A\",\"absorption\":{\"63\":0,\"125\":0.05,\"250\":0.16,\"500\":0.3,\"1000\":0.57,\"2000\":0.94,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.49,\"source\":\"Tectum data\",\"description\":\"\",\"uuid\":\"WeDASwV7hpByi3vY\"},{\"tags\":[\"Air\",\"Air Absorption\"],\"manufacturer\":\"\",\"name\":\"Air (Per 1000 Cu. Ft.) - Relative Humidity 20%\",\"material\":\"Air (per 1000 cu. ft.) - relative humidity 20%\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"WfsgwBbReRCH11Wv\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Sound Cell; Acoustade 12 Cmu With Fillers\",\"material\":\"Sound Cell; Acoustade 12 cmu with fillers\",\"absorption\":{\"63\":0.32,\"125\":0.95,\"250\":0.64,\"500\":0.55,\"1000\":0.74,\"2000\":0.81,\"4000\":0.72,\"8000\":0.72},\"nrc\":0.69,\"source\":\"Bestblock data\",\"description\":\"\",\"uuid\":\"WnH0PsIed693kGVy\"},{\"tags\":[\"Common\",\"Common Materials\"],\"manufacturer\":\"\",\"name\":\"Construction Concrete\",\"material\":\"Construction concrete, tooled stone, or granolithic\",\"absorption\":{\"63\":0.05,\"125\":0.02,\"250\":0.02,\"500\":0.02,\"1000\":0.04,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.03,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"WoF6wk53CNFy7NgL\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Sound Cell; Acoustade 8 Cmu With Fillers\",\"material\":\"Sound Cell; Acoustade 8 cmu with fillers\",\"absorption\":{\"63\":0.23,\"125\":0.67,\"250\":0.89,\"500\":0.51,\"1000\":0.75,\"2000\":0.77,\"4000\":0.69,\"8000\":0.69},\"nrc\":0.73,\"source\":\"Bestblock data\",\"description\":\"\",\"uuid\":\"Wpz4GvQGVEieGMvZ\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Slotted Concrete Block \",\"material\":\"Slotted concrete block , 12in, fiberglass & metal septum\",\"absorption\":{\"63\":0.19,\"125\":0.57,\"250\":0.76,\"500\":0.99,\"1000\":0.94,\"2000\":0.54,\"4000\":0.59,\"8000\":0.59},\"nrc\":0.81,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"WxC6nVLBMVmwQ5uW\"},{\"tags\":[\"Ceiling\",\" Ceiling Systems\"],\"manufacturer\":\"\",\"name\":\"Barrisol Stretched Ceiling Over 3\\\" Fiberglass\",\"material\":\"Barrisol Stretched Ceiling over 3\\\" fiberglass\",\"absorption\":{\"63\":0.18,\"125\":0.26,\"250\":0.58,\"500\":0.57,\"1000\":0.43,\"2000\":0.36,\"4000\":0.36,\"8000\":0.36},\"nrc\":0.49,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Wz4CjrpqIYGba8G0\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Painted Nubby Open Plan (foil) 2x4 x 3/4in\",\"absorption\":{\"63\":0.15,\"125\":0.47,\"250\":0.3,\"500\":0.66,\"1000\":0.92,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.72,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"X14uZXarb8kW58M5\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone 4In Thick\",\"material\":\"IAC Varitone 4in thick, No facing\",\"absorption\":{\"63\":0.28,\"125\":0.97,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"IAC data\",\"description\":\"\",\"uuid\":\"X2qVb3ukxm8mxFKV\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone Panels\",\"material\":\"USG Auratone panels, 12x12 tile, Omni 320 5/8 1x1\",\"absorption\":{\"63\":0.18,\"125\":0.5,\"250\":0.36,\"500\":0.53,\"1000\":0.69,\"2000\":0.65,\"4000\":0.64,\"8000\":0.64},\"nrc\":0.56,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"XKPt2A9QvGaI6tMW\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"1\\\" Banner W/ Guilford 701 Ea Side From Columbus Legacy Rts\",\"material\":\"1\\\" Banner w/ Guilford 701 ea side from Columbus Legacy RTs\",\"absorption\":{\"63\":0.2,\"125\":0.44,\"250\":0.64,\"500\":0.51,\"1000\":0.56,\"2000\":0.66,\"4000\":0.78,\"8000\":0.91},\"nrc\":0.59,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"XL9nyUoR6tbl4sp4\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"2\\\" Tectum Mounting #5 (1\\\" X 3\\\" Battens\",\"material\":\"2\\\" Tectum mounting #5 (1\\\" x 3\\\" battens, 24\\\" center, over 1\\\" fiberglass backing)\",\"absorption\":{\"63\":0.12,\"125\":0.24,\"250\":0.67,\"500\":0.99,\"1000\":0.87,\"2000\":0.99,\"4000\":0.96,\"8000\":0.99},\"nrc\":0.88,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"XLXYpJqTO3inUV2a\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass Duct Liner\",\"material\":\"Fiberglass Duct Liner, 1in, 1.5# fiberglass on duct\",\"absorption\":{\"63\":0,\"125\":0.13,\"250\":0.51,\"500\":0.46,\"1000\":0.65,\"2000\":0.74,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.59,\"source\":\"Owens Corning\",\"description\":\"\",\"uuid\":\"XLnDDMTHczIBlLJj\"},{\"tags\":[\"Floors\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Parquet On Concrete\",\"material\":\"Wood parquet on concrete\",\"absorption\":{\"63\":0.02,\"125\":0.04,\"250\":0.04,\"500\":0.07,\"1000\":0.06,\"2000\":0.06,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.06,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"XP8vQ5YFxyfCMcLz\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13\",\"material\":\"K13, solid backing, 2in\",\"absorption\":{\"63\":0,\"125\":0.26,\"250\":0.68,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.98,\"8000\":0.98},\"nrc\":0.91,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"XQKJkE0XGAZ7v9Am\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"1-1/2\\\" Tectum Mounting #5 (1\\\" X 3\\\" Battens\",\"material\":\"1-1/2\\\" Tectum mounting #5 (1\\\" x 3\\\" battens, 24\\\" center, over 1\\\" fiberglass backing)\",\"absorption\":{\"63\":0.05,\"125\":0.24,\"250\":0.57,\"500\":0.99,\"1000\":0.87,\"2000\":0.93,\"4000\":0.87,\"8000\":0.93},\"nrc\":0.84,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"XURdEsLIbWis7IK7\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg Skyline Primitive Root 2D Diffuser\",\"material\":\"RPG Skyline primitive root 2D diffuser\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0.1,\"500\":0.14,\"1000\":0.34,\"2000\":0.46,\"4000\":0.31,\"8000\":0.31},\"nrc\":0.26,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"Xbwc4DLrC7rpEcHI\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1 Layer Gypsum Board\",\"material\":\"1 layer gypsum board, 5/8\\\" thick, on 3-5/8\\\" metal studs, 16\\\" o.c., 1\\\" batt insulation-EST.\",\"absorption\":{\"63\":0.4,\"125\":0.3,\"250\":0.1,\"500\":0.07,\"1000\":0.06,\"2000\":0.08,\"4000\":0.09,\"8000\":0.1},\"nrc\":0.08,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Xob9yHw7l6VUSvkm\"},{\"tags\":[\"Floors\",\"Concrete\"],\"manufacturer\":\"\",\"name\":\"Concrete Floor\",\"material\":\"Concrete floor\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.01,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"XoiX0hNgjPHloc4z\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone\",\"material\":\"USG Acoustone, foil, 3/4in, 2x2 panels, Frost 414\",\"absorption\":{\"63\":0.17,\"125\":0.38,\"250\":0.34,\"500\":0.61,\"1000\":0.96,\"2000\":0.92,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.71,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"XyEyJCgKg7O6PMJV\"},{\"tags\":[\"General\",\"General\"],\"manufacturer\":\"\",\"name\":\"Ideal Material\",\"material\":\"Ideal material, fully absorptive at all frequencies\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"XzHgRLzbNXZrJasg\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Bad Panel - 3\\\" A Mount With 1/2\\\" Holes\",\"material\":\"RPG BAD Panel - 3\\\" A mount with 1/2\\\" holes\",\"absorption\":{\"63\":0.43,\"125\":0.61,\"250\":0.93,\"500\":0.96,\"1000\":0.91,\"2000\":0.84,\"4000\":0.65,\"8000\":0.84},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YAfg5Gn5j8Qklrds\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.75H Spacing, Type NF-4P\",\"absorption\":{\"63\":0.14,\"125\":0.2,\"250\":0.34,\"500\":0.5,\"1000\":0.52,\"2000\":0.56,\"4000\":0.34,\"8000\":0.56},\"nrc\":0.48,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YCmNxsrYAP5ux7gA\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Heavyweight Drapery\",\"material\":\"Heavyweight drapery, 18oz, draped to half area\",\"absorption\":{\"63\":0,\"125\":0.14,\"250\":0.35,\"500\":0.55,\"1000\":0.72,\"2000\":0.7,\"4000\":0.6,\"8000\":0.6},\"nrc\":0.58,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"YEfOFyrxa1mbk0UJ\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Curved Bad Panel - 1\\\" Thick 6Pcf Curved Bad - E400 Mounting\",\"material\":\"RPG Curved BAD Panel - 1\\\" thick 6PCF curved BAD - E400 mounting\",\"absorption\":{\"63\":0.06,\"125\":0.08,\"250\":0.25,\"500\":0.78,\"1000\":0.99,\"2000\":0.6,\"4000\":0.43,\"8000\":0.6},\"nrc\":0.66,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YHBSF8GR9FyvA1j2\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics A.P. Fabric 0.5In\",\"material\":\"Decoustics a.p. fabric 0.5in\",\"absorption\":{\"63\":0,\"125\":0.04,\"250\":0.12,\"500\":0.3,\"1000\":0.69,\"2000\":0.87,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.5,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"YKd9EaGMR4bv9x3G\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Alto 8 A-Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Alto 8 A-Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.03,\"125\":0.2,\"250\":0.43,\"500\":0.95,\"1000\":0.93,\"2000\":0.47,\"4000\":0.54,\"8000\":0.61},\"nrc\":0.7,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YN3i5aa6K4XfXdQ7\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Mbi Colorsonix Weather Resistant (Eterior Use) 2\\\" Thick\",\"material\":\"MBI Colorsonix Weather Resistant (Eterior Use) 2\\\" thick, Solid Cypress Fabric\",\"absorption\":{\"63\":0.24,\"125\":0.34,\"250\":0.88,\"500\":0.99,\"1000\":0.62,\"2000\":0.43,\"4000\":0.37,\"8000\":0.43},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YOPpshzIfwDpzJ25\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Armstrong Soundsoak Panel 60 \",\"material\":\"Armstrong SoundSoak Panel 60 , Mounting A\",\"absorption\":{\"63\":0.06,\"125\":0.08,\"250\":0.25,\"500\":0.59,\"1000\":0.8,\"2000\":0.78,\"4000\":0.69,\"8000\":0.78},\"nrc\":0.61,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YRTveCCb4dwIEi2Q\"},{\"tags\":[\"Walls\",\"Concrete Block\"],\"manufacturer\":\"\",\"name\":\"Concrete Block\",\"material\":\"Concrete Block, all, painted or glazed\",\"absorption\":{\"63\":0.04,\"125\":0.11,\"250\":0.08,\"500\":0.07,\"1000\":0.06,\"2000\":0.06,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.07,\"source\":\"Beranek (C&OH '96)\",\"description\":\"\",\"uuid\":\"YVb7bSpJStdX9Imr\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Flat Double Layer\",\"material\":\"32oz. Flat double layer, 0\\\" separation, 8\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.25,\"125\":0.36,\"250\":0.64,\"500\":0.71,\"1000\":0.77,\"2000\":0.86,\"4000\":0.82,\"8000\":0.86},\"nrc\":0.75,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YXfSHAaYbIAXkgpw\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Person\",\"material\":\"person, high school, each\",\"absorption\":{\"63\":0.6,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"YZk0TDbUgVY3MiyX\"},{\"tags\":[\"Foams\",\"Foams\"],\"manufacturer\":\"\",\"name\":\"Anechoic Wedges By Eckel Industries\",\"material\":\"Anechoic wedges by Eckel Industries, Inc. - 130 Hz. cutoff\",\"absorption\":{\"63\":0.85,\"125\":0.97,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Ycz4W0ozpPnCE8UD\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"4\\\" Owens Corning 705\",\"material\":\"4\\\" Owens Corning 705, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.41,\"125\":0.59,\"250\":0.91,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.97,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YeoSSFESIoeATypp\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 705\",\"material\":\"2\\\" Owens Corning 705, ASJ faced, Mounting A\",\"absorption\":{\"63\":0.41,\"125\":0.58,\"250\":0.49,\"500\":0.73,\"1000\":0.76,\"2000\":0.55,\"4000\":0.35,\"8000\":0.55},\"nrc\":0.63,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YgXoAjXl39wInztK\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno 2/10 E-400 Mounted\",\"material\":\"Kinetics Sereno 2/10 E-400 Mounted\",\"absorption\":{\"63\":0.49,\"125\":0.78,\"250\":0.66,\"500\":0.41,\"1000\":0.31,\"2000\":0.26,\"4000\":0.16,\"8000\":0.26},\"nrc\":0.41,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YsDS3zBgnwYJk8BB\"},{\"tags\":[\"Ceilings\",\"Roof Fabric\"],\"manufacturer\":\"\",\"name\":\"Glass-Fiber Roof Fabric\",\"material\":\"Glass-fiber roof fabric, 12oz\",\"absorption\":{\"63\":0.3,\"125\":0.65,\"250\":0.71,\"500\":0.82,\"1000\":0.86,\"2000\":0.76,\"4000\":0.62,\"8000\":0.62},\"nrc\":0.79,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"YsRr7mzm5XsCZcIp\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sportsboard 2-1/16\\\" Thick\",\"material\":\"Kinetics SportsBoard 2-1/16\\\" Thick\",\"absorption\":{\"63\":0.22,\"125\":0.31,\"250\":0.73,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.96,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"YuVAYhiLN66lT8BM\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Cortega 2x4 Square Lay-in\",\"absorption\":{\"63\":0.15,\"125\":0.3,\"250\":0.31,\"500\":0.48,\"1000\":0.75,\"2000\":0.75,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.57,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"Z0VKs8KvxDPupzQ8\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloud-Lite Baffels 2600-1515 ( (2'X4'\",\"material\":\"MBI Cloud-Lite Baffels 2600-1515 ( (2'x4', 1.5\\\" thick, 1.5# density) 2 Mil PVC\",\"absorption\":{\"63\":0.27,\"125\":0.38,\"250\":0.64,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.9,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Z5VMkHyXWBeahjZw\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-2PS, 50% Intermittent Mount\",\"absorption\":{\"63\":0.33,\"125\":0.48,\"250\":0.43,\"500\":0.77,\"1000\":0.99,\"2000\":0.99,\"4000\":0.84,\"8000\":0.99},\"nrc\":0.8,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Z7sDQ1YgRlTTISqu\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"4\\\" Owens Corning 701\",\"material\":\"4\\\" Owens Corning 701, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.43,\"125\":0.61,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ZCqRBdHmKxo6aE3V\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Asc Tube Trap\",\"material\":\"ASC Tube Trap, 11\\\" Diameter x 3' L, Full-Round - sabines per tube \",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ZDYpbAJGNiVFNulL\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Tectum Deck\",\"material\":\"Tectum deck, 1in - Mounting A (on concrete)\",\"absorption\":{\"63\":0,\"125\":0.06,\"250\":0.13,\"500\":0.24,\"1000\":0.45,\"2000\":0.82,\"4000\":0.64,\"8000\":0.64},\"nrc\":0.41,\"source\":\"Tectum data\",\"description\":\"\",\"uuid\":\"ZKrHyAuQ1Xy2G2Bt\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Ribbed Metal Acoustical Deck - 1.5\\\" Rib\",\"material\":\"Ribbed metal acoustical deck - 1.5\\\" Rib\",\"absorption\":{\"63\":0.28,\"125\":0.47,\"250\":0.93,\"500\":0.99,\"1000\":0.96,\"2000\":0.55,\"4000\":0.23,\"8000\":0.55},\"nrc\":0.86,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ZR1sBPZySWguUtPb\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Qrd 734\",\"material\":\"RPG QRD 734\",\"absorption\":{\"63\":0.15,\"125\":0.22,\"250\":0.26,\"500\":0.33,\"1000\":0.23,\"2000\":0.2,\"4000\":0.2,\"8000\":0.2},\"nrc\":0.26,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ZRzw4KSzKTq4BBjD\"},{\"tags\":[\"Ceiling\",\" Ceiling Systems\"],\"manufacturer\":\"\",\"name\":\"Anechoic Ceiling Of Acoustic Banners Hung In Crossed Pattern\",\"material\":\"Anechoic ceiling of acoustic banners hung in crossed pattern\",\"absorption\":{\"63\":0.75,\"125\":0.8,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ZW328A2y1x22wMgV\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Audience\",\"material\":\"Audience, seated in upholstered seats\",\"absorption\":{\"63\":0.11,\"125\":0.39,\"250\":0.57,\"500\":0.8,\"1000\":0.94,\"2000\":0.92,\"4000\":0.87,\"8000\":0.87},\"nrc\":0.81,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"ZZUs4lNJQmIecMbp\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Rpg Modex - 100Hz\",\"material\":\"RPG Modex - 100Hz\",\"absorption\":{\"63\":0.39,\"125\":0.52,\"250\":0.2,\"500\":0.1,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.1,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"Zd4S6NPx1Ajxf5js\"},{\"tags\":[\"Floors\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Stage Floor (T&G)\",\"material\":\"Wood Stage Floor (T&G), 2 layers 1/2in, on joists\",\"absorption\":{\"63\":0.04,\"125\":0.1,\"250\":0.07,\"500\":0.06,\"1000\":0.06,\"2000\":0.06,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.06,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"ZdwcxUjnCaTijM8d\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.0H Spacing, Type NF-2P\",\"absorption\":{\"63\":0.11,\"125\":0.15,\"250\":0.39,\"500\":0.48,\"1000\":0.52,\"2000\":0.64,\"4000\":0.36,\"8000\":0.64},\"nrc\":0.51,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ZfWWQttwuqcmVhuH\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Fabric\",\"material\":\"Fabric, 14 oz velour, 50% full\",\"absorption\":{\"63\":0,\"125\":0.07,\"250\":0.31,\"500\":0.49,\"1000\":0.75,\"2000\":0.7,\"4000\":0.6,\"8000\":0.6},\"nrc\":0.56,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"ZzVN3S4xySgPJ5aD\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-4PS, 50% Intermittent Mount\",\"absorption\":{\"63\":0.63,\"125\":0.9,\"250\":0.74,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.96,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ZzcYoUyT5rg69feN\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Window\",\"material\":\"Window, 6mm glass\",\"absorption\":{\"63\":0.04,\"125\":0.13,\"250\":0.07,\"500\":0.04,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.04,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"a5e1XQf5vT96lCJG\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1+1 @ 5/8in on 3-5/8in studs\",\"absorption\":{\"63\":0.04,\"125\":0.22,\"250\":0.08,\"500\":0.05,\"1000\":0.04,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.05,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"a5egcoPxnuSUgp8c\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 703\",\"material\":\"2\\\" Owens Corning 703, ASJ faced, Mounting E-405\",\"absorption\":{\"63\":0.37,\"125\":0.53,\"250\":0.44,\"500\":0.93,\"1000\":0.77,\"2000\":0.55,\"4000\":0.35,\"8000\":0.55},\"nrc\":0.67,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"a7Pw86rSis1HuPQe\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Fissured Mineral Fiber 2X4 Panels\",\"material\":\"Fissured mineral fiber 2x4 panels\",\"absorption\":{\"63\":0.16,\"125\":0.31,\"250\":0.31,\"500\":0.49,\"1000\":0.71,\"2000\":0.75,\"4000\":0.79,\"8000\":0.79},\"nrc\":0.57,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"aIYDl73v21d3UJL1\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Person\",\"material\":\"person, elementary school, each\",\"absorption\":{\"63\":0.6,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"aIcTxQFeDkNlumHA\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Triffusor - Absorptive Side\",\"material\":\"RPG Triffusor - Absorptive Side\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.59,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.89,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"aJa5JVaJWcEiF3fk\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1 Layer Gypsum Board\",\"material\":\"1 layer gypsum board, 1/2\\\" thick, on 3-5/8\\\" metal studs, 16\\\" o.c.-EST.\",\"absorption\":{\"63\":0.4,\"125\":0.29,\"250\":0.1,\"500\":0.05,\"1000\":0.04,\"2000\":0.07,\"4000\":0.09,\"8000\":0.11},\"nrc\":0.07,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"aXHIGhPVQVnZ9ywc\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fabric Wrapped Fg Panel\",\"material\":\"Fabric Wrapped FG Panel, 2in, over 400mm air space\",\"absorption\":{\"63\":0.17,\"125\":0.6,\"250\":0.87,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.96,\"source\":\"Decoustics Tests\",\"description\":\"\",\"uuid\":\"aYtWrPJpJNLZs8K1\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Fabric Covered Wall\",\"material\":\"Fabric covered wall, panels 1\\\" thick, in frame  (mounting #4)\",\"absorption\":{\"63\":0.06,\"125\":0.08,\"250\":0.3,\"500\":0.88,\"1000\":0.99,\"2000\":0.99,\"4000\":0.97,\"8000\":0.99},\"nrc\":0.79,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ajH2yVobMXiXoyBk\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 4' Type I Wall Diffuser\",\"material\":\"Wenger 4' x 4' Type I Wall Diffuser, Pyramidal (E-9/32\\\")\",\"absorption\":{\"63\":0.15,\"125\":0.22,\"250\":0.18,\"500\":0.12,\"1000\":0.12,\"2000\":0.17,\"4000\":0.2,\"8000\":0.23},\"nrc\":0.15,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ajLNnxrEYajCtu7K\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Painted Nubby  Panel (2 X 4 X 1\\\")\",\"material\":\"Armstrong Painted Nubby  panel (2 x 4 x 1\\\"), Mount E-400\",\"absorption\":{\"63\":0.35,\"125\":0.7,\"250\":0.95,\"500\":0.75,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.92,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"akHftjFeXblJqTna\"},{\"tags\":[\"Metals\",\"Metals\"],\"manufacturer\":\"\",\"name\":\"Steel\",\"material\":\"Steel\",\"absorption\":{\"63\":0.05,\"125\":0.1,\"250\":0.1,\"500\":0.1,\"1000\":0.07,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.07,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"alGt7Cvog5YG2VrP\"},{\"tags\":[\"Wood\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"3/8\\\" Plywood Paneling Over Undetermined Air Space From Aima\",\"material\":\"3/8\\\" Plywood paneling over undetermined air space from AIMA\",\"absorption\":{\"63\":0.34,\"125\":0.28,\"250\":0.22,\"500\":0.17,\"1000\":0.09,\"2000\":0.1,\"4000\":0.11,\"8000\":0.12},\"nrc\":0.15,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"avbHwerEiL7AXsXc\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 12In Type Rsc; Painted\",\"material\":\"Soundblox 12in Type RSC; painted\",\"absorption\":{\"63\":0.19,\"125\":0.57,\"250\":0.76,\"500\":0.99,\"1000\":0.94,\"2000\":0.54,\"4000\":0.59,\"8000\":0.59},\"nrc\":0.81,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"avfNr7XeFmXXmme9\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Abffusor - A Mount\",\"material\":\"RPG Abffusor - A mount\",\"absorption\":{\"63\":0.32,\"125\":0.46,\"250\":0.75,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ax4Klxi69oXIXio5\"},{\"tags\":[\"Walls\",\"Plasterboard\"],\"manufacturer\":\"\",\"name\":\"Acoustic Plaster On Solid\",\"material\":\"Acoustic plaster on solid\",\"absorption\":{\"63\":0.03,\"125\":0.1,\"250\":0.15,\"500\":0.2,\"1000\":0.25,\"2000\":0.3,\"4000\":0.35,\"8000\":0.35},\"nrc\":0.23,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"ayKNYJPyjsJyHwB1\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1 Layer 1/2\\\" Gyp Suspended E400 (Alf Warnock Test)\",\"material\":\"1 layer 1/2\\\" gyp suspended E400 (Alf Warnock Test)\",\"absorption\":{\"63\":0.6,\"125\":0.12,\"250\":0,\"500\":0,\"1000\":0,\"2000\":0,\"4000\":0,\"8000\":0},\"nrc\":0,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"b2r1maJsai29630k\"},{\"tags\":[\"Walls\",\"Plasterboard\"],\"manufacturer\":\"\",\"name\":\"Audex G Acoustic Plaster\",\"material\":\"Audex G acoustic plaster\",\"absorption\":{\"63\":0.18,\"125\":0.35,\"250\":0.35,\"500\":0.4,\"1000\":0.55,\"2000\":0.7,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.5,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"b6TpegsVE9b8Xibk\"},{\"tags\":[\"People\",\"Moderately upholstered\"],\"manufacturer\":\"\",\"name\":\"Moderately Upholstered Seats \",\"material\":\"Moderately Upholstered Seats , unoccupied\",\"absorption\":{\"63\":0.23,\"125\":0.54,\"250\":0.62,\"500\":0.68,\"1000\":0.7,\"2000\":0.68,\"4000\":0.66,\"8000\":0.66},\"nrc\":0.67,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"b83IxMnfApauDAhz\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster\",\"material\":\"Plaster, skim coat, over concrete block\",\"absorption\":{\"63\":0.03,\"125\":0.06,\"250\":0.05,\"500\":0.05,\"1000\":0.04,\"2000\":0.04,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.05,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"b873Il1uQCleKC2Z\"},{\"tags\":[\"Ceiling\",\" Ceiling Systems\"],\"manufacturer\":\"\",\"name\":\"Alcan Metal Ceiling Deck With 2.0 In. Insulation\",\"material\":\"Alcan Metal Ceiling Deck with 2.0 in. Insulation\",\"absorption\":{\"63\":0.34,\"125\":0.67,\"250\":0.87,\"500\":0.89,\"1000\":0.76,\"2000\":0.46,\"4000\":0.42,\"8000\":0.46},\"nrc\":0.75,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"b8s2PXx9dLz23EIe\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics Quadrillo Perf Wood 1-7/8In\",\"material\":\"Decoustics QUADRILLO perf wood 1-7/8in\",\"absorption\":{\"63\":0,\"125\":0.2,\"250\":0.5,\"500\":0.97,\"1000\":0.99,\"2000\":0.99,\"4000\":0.92,\"8000\":0.92},\"nrc\":0.86,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"bMty1tgJ7elNMp1A\"},{\"tags\":[\"Plaster\",\"Plaster Constructions\"],\"manufacturer\":\"\",\"name\":\"Plaster\",\"material\":\"Plaster, 3/4\\\" thick on metal lath BERANEK - KNUDSEN\",\"absorption\":{\"63\":0.03,\"125\":0.04,\"250\":0.05,\"500\":0.06,\"1000\":0.08,\"2000\":0.04,\"4000\":0.06,\"8000\":0.08},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"bPJ0rTgr36jj9Ye7\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Orchestra Pit Opening\",\"material\":\"Orchestra Pit Opening, large orchestra (80 players)\",\"absorption\":{\"63\":0.04,\"125\":0.12,\"250\":0.17,\"500\":0.23,\"1000\":0.56,\"2000\":0.67,\"4000\":0.71,\"8000\":0.71},\"nrc\":0.41,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"bRr8UgYgNuVqu4mV\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Carpet Over Thick Felt On Concrete Floor\",\"material\":\"Carpet over thick felt on concrete floor\",\"absorption\":{\"63\":0.05,\"125\":0.07,\"250\":0.25,\"500\":0.5,\"1000\":0.5,\"2000\":0.6,\"4000\":0.65,\"8000\":0.7},\"nrc\":0.46,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"bU4ACUZkPbvTHlQO\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Flat Double Layer\",\"material\":\"25oz. Flat double layer, 0\\\" separation, 8\\\" behind rear fabric, closed side edges\",\"absorption\":{\"63\":0.33,\"125\":0.47,\"250\":0.65,\"500\":0.61,\"1000\":0.67,\"2000\":0.79,\"4000\":0.84,\"8000\":0.89},\"nrc\":0.68,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"bUuVW6jVGg10hFrl\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass 3In: Thermal Insulating Wool (Tiw)\",\"material\":\"Fiberglass 3in: Thermal Insulating Wool (TIW)\",\"absorption\":{\"63\":0,\"125\":0.46,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"bVK5ASCZoHUe2Rng\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone 3In Thick\",\"material\":\"IAC Varitone 3in thick, No facing\",\"absorption\":{\"63\":0.25,\"125\":0.85,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.89,\"8000\":0.89},\"nrc\":0.99,\"source\":\"IAC data\",\"description\":\"\",\"uuid\":\"bX2Q0ZmW3Sd2Ff0n\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"6.25\\\" Owens Corning R-19\",\"material\":\"6.25\\\" Owens Corning R-19, plain faced, Mounting A\",\"absorption\":{\"63\":0.45,\"125\":0.64,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"bZzcoAkCedWoc6Gc\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno E-400 Mounted\",\"material\":\"Kinetics Sereno E-400 Mounted\",\"absorption\":{\"63\":0.6,\"125\":0.88,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.81,\"4000\":0.63,\"8000\":0.81},\"nrc\":0.95,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"bfwHbAXFmlxbbNUB\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck\",\"material\":\"Cellular metal deck, perforated, 7\\\" fiberglass, 3' air space\",\"absorption\":{\"63\":0.7,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.95,\"2000\":0.9,\"4000\":0.85,\"8000\":0.9},\"nrc\":0.96,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"bgrB7wCwwuhOZH2x\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Thick Porous Sound-Abosrbing Material\",\"material\":\"Thick porous sound-abosrbing material, 2in thick, or thin material with airspace\",\"absorption\":{\"63\":0.08,\"125\":0.38,\"250\":0.6,\"500\":0.78,\"1000\":0.8,\"2000\":0.78,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.74,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"bs9jZaikVal8ShxJ\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 705\",\"material\":\"1\\\" Owens Corning 705, plain faced, Mounting A\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.27,\"500\":0.63,\"1000\":0.85,\"2000\":0.93,\"4000\":0.95,\"8000\":0.97},\"nrc\":0.67,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"bsXAJqJPTvnutO6T\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone 2In Thick\",\"material\":\"IAC Varitone 2in thick, polymer facing\",\"absorption\":{\"63\":0.18,\"125\":0.41,\"250\":0.47,\"500\":0.64,\"1000\":0.79,\"2000\":0.85,\"4000\":0.72,\"8000\":0.72},\"nrc\":0.69,\"source\":\"IAC data\",\"description\":\"\",\"uuid\":\"c03YMkuMtaljysla\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Nylon Medium Pile\",\"material\":\"Nylon medium pile\",\"absorption\":{\"63\":0.01,\"125\":0.03,\"250\":0.05,\"500\":0.15,\"1000\":0.3,\"2000\":0.45,\"4000\":0.55,\"8000\":0.65},\"nrc\":0.24,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"c842gYNt2lwy0lbd\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"25Mm Mineral Wool On Solid\",\"material\":\"25mm mineral wool on solid\",\"absorption\":{\"63\":0,\"125\":0.15,\"250\":0.35,\"500\":0.7,\"1000\":0.85,\"2000\":0.9,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.7,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"c9ZP753xM3gUKPhO\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone 808 Sandrift 3/4 2X2\",\"material\":\"USG Acoustone 808 Sandrift 3/4 2x2\",\"absorption\":{\"63\":0.2,\"125\":0.46,\"250\":0.39,\"500\":0.63,\"1000\":0.84,\"2000\":0.87,\"4000\":0.91,\"8000\":0.91},\"nrc\":0.68,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"cB4HHfr23UhD8iLr\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13\",\"material\":\"K13, ribbed deck, 2in\",\"absorption\":{\"63\":0.09,\"125\":0.56,\"250\":0.94,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.98,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"cBHLhjju7tgUyVvO\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Fissured Minatone Tile (1 X 1 X 5/8\\\")\",\"material\":\"Armstrong Fissured Minatone Tile (1 x 1 x 5/8\\\"), Mount E-400\",\"absorption\":{\"63\":0.2,\"125\":0.39,\"250\":0.28,\"500\":0.5,\"1000\":0.69,\"2000\":0.81,\"4000\":0.84,\"8000\":0.87},\"nrc\":0.57,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"cPL0yjWCha6gFwVI\"},{\"tags\":[\"Ceiling\",\" Ceiling Systems\"],\"manufacturer\":\"\",\"name\":\"Dampa Linar 75 Ceiling System\",\"material\":\"Dampa Linar 75 Ceiling System\",\"absorption\":{\"63\":0.4,\"125\":0.57,\"250\":0.69,\"500\":0.82,\"1000\":0.65,\"2000\":0.59,\"4000\":0.74,\"8000\":0.89},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"cPMiOyqPNaDv51xP\"},{\"tags\":[\"People\",\"Moderately upholstered\"],\"manufacturer\":\"\",\"name\":\"Moderately Upholstered Seats \",\"material\":\"Moderately Upholstered Seats , occupied\",\"absorption\":{\"63\":0.26,\"125\":0.62,\"250\":0.72,\"500\":0.8,\"1000\":0.83,\"2000\":0.84,\"4000\":0.85,\"8000\":0.85},\"nrc\":0.8,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"cT2rBDi4mKcONf8D\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"2 Layers 5/8'' Gypsum Bd. On 1\\\" X 3\\\" With Insulation 16\\\" O.C.  Egan\",\"material\":\"2 layers 5/8'' gypsum bd. on 1\\\" x 3\\\" with insulation 16\\\" o.c.  EGAN\",\"absorption\":{\"63\":0.4,\"125\":0.28,\"250\":0.12,\"500\":0.1,\"1000\":0.07,\"2000\":0.13,\"4000\":0.09,\"8000\":0.13},\"nrc\":0.11,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"cYilAglbMVuVzNRc\"},{\"tags\":[\"Outdoors\",\"Gravel\"],\"manufacturer\":\"\",\"name\":\"Gravel\",\"material\":\"Gravel, loose and moist, 4in thick\",\"absorption\":{\"63\":0,\"125\":0.25,\"250\":0.6,\"500\":0.65,\"1000\":0.7,\"2000\":0.75,\"4000\":0.8,\"8000\":0.8},\"nrc\":0.68,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"cbLY2gNlGargPt3U\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Nylon Carpet\",\"material\":\"Nylon carpet, medium pile on sponge rubber underlayment\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.05,\"500\":0.2,\"1000\":0.4,\"2000\":0.6,\"4000\":0.65,\"8000\":0.7},\"nrc\":0.31,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"cbvDmnXMSnedM2Fn\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - Robertson Adc 45 18/18   (63 Hz Estimated)\",\"material\":\"Cellular metal deck - Robertson ADC 45 18/18   (63 Hz estimated)\",\"absorption\":{\"63\":0.2,\"125\":0.37,\"250\":0.79,\"500\":0.98,\"1000\":0.81,\"2000\":0.7,\"4000\":0.55,\"8000\":0.7},\"nrc\":0.82,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"cfF8a18DzR959Wby\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Deep Balcony With Upholstered Seats\",\"material\":\"Deep balcony with upholstered seats\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0.5,\"500\":0,\"1000\":0.99,\"2000\":0,\"4000\":0,\"8000\":0},\"nrc\":0.37,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"cftE6LVyvQOHbBi9\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Armstrong Soundsoak Panel 85 \",\"material\":\"Armstrong SoundSoak Panel 85 , Mounting D-20\",\"absorption\":{\"63\":0.19,\"125\":0.27,\"250\":0.78,\"500\":0.83,\"1000\":0.89,\"2000\":0.95,\"4000\":0.93,\"8000\":0.95},\"nrc\":0.86,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"cmnTIaYmBlga2eG0\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Versatune 2-1/8\\\" Thick\",\"material\":\"Kinetics VersaTune 2-1/8\\\" Thick\",\"absorption\":{\"63\":0.54,\"125\":0.77,\"250\":0.83,\"500\":0.89,\"1000\":0.8,\"2000\":0.76,\"4000\":0.77,\"8000\":0.78},\"nrc\":0.82,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"crFfxSBfTwd8w148\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Rpg Modex - 80Hz\",\"material\":\"RPG Modex - 80Hz\",\"absorption\":{\"63\":0.64,\"125\":0.35,\"250\":0.2,\"500\":0.1,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.1,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"cuYeY4KWvz2nmuPI\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Stratus 2x2\",\"absorption\":{\"63\":0.25,\"125\":0.52,\"250\":0.54,\"500\":0.58,\"1000\":0.8,\"2000\":0.95,\"4000\":0.97,\"8000\":0.97},\"nrc\":0.72,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"cwX3lIjA88nZuEc0\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Person\",\"material\":\"person, adult, each\",\"absorption\":{\"63\":0.75,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"cxEDDMiXjTVfREl0\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-4P, Continuous Mount\",\"absorption\":{\"63\":0.62,\"125\":0.86,\"250\":0.89,\"500\":0.93,\"1000\":0.89,\"2000\":0.84,\"4000\":0.77,\"8000\":0.84},\"nrc\":0.89,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"d7leKB0giuDm6Wkt\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sportsboard Elite 2-1/16\\\" Thick\",\"material\":\"Kinetics SportsBoard Elite 2-1/16\\\" Thick\",\"absorption\":{\"63\":0.22,\"125\":0.31,\"250\":0.73,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.96,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"dCAiBCCViAiZvs7X\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone 4In Thick\",\"material\":\"IAC Varitone 4in thick, polymer facing\",\"absorption\":{\"63\":0.42,\"125\":0.86,\"250\":0.89,\"500\":0.93,\"1000\":0.89,\"2000\":0.84,\"4000\":0.77,\"8000\":0.77},\"nrc\":0.89,\"source\":\"IAC data\",\"description\":\"\",\"uuid\":\"dDTjXNGWRu16bnoM\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.33H Spacing, Type NF-2PS\",\"absorption\":{\"63\":0.09,\"125\":0.13,\"250\":0.31,\"500\":0.29,\"1000\":0.32,\"2000\":0.34,\"4000\":0.21,\"8000\":0.34},\"nrc\":0.32,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"dGXmHCna1dx7wyNJ\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Unpainted Fiberboard\",\"material\":\"Unpainted fiberboard, 1/2\\\" thick on 2\\\" x 1\\\" battens, 16\\\" centers, over solid backing\",\"absorption\":{\"63\":0.25,\"125\":0.3,\"250\":0.3,\"500\":0.3,\"1000\":0.3,\"2000\":0.3,\"4000\":0.35,\"8000\":0.4},\"nrc\":0.3,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"dMeusf4aogzHxms0\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg Flutterfree Diffusion Molding (Wood)\",\"material\":\"RPG FlutterFree diffusion molding (wood)\",\"absorption\":{\"63\":0.11,\"125\":0.23,\"250\":0.24,\"500\":0.35,\"1000\":0.23,\"2000\":0.2,\"4000\":0.2,\"8000\":0.2},\"nrc\":0.26,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"dQmdYve7E8EcaaIm\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"4 X 4 Wall Module\",\"material\":\"4 x 4 wall module, 6\\\" deep; Helmholtz resonator tuned for 120 Hz\",\"absorption\":{\"63\":0.52,\"125\":0.68,\"250\":0.4,\"500\":0.15,\"1000\":0.1,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.19,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"dZgsaJZS8s9LCRSw\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Hi-Tack 3/4\\\" Thick\",\"material\":\"Kinetics Hi-Tack 3/4\\\" Thick\",\"absorption\":{\"63\":0.04,\"125\":0.06,\"250\":0.09,\"500\":0.14,\"1000\":0.2,\"2000\":0.17,\"4000\":0.19,\"8000\":0.21},\"nrc\":0.15,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"dbJzVYhNfXgVMo0U\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 701\",\"material\":\"1\\\" Owens Corning 701, plain faced, Mounting A\",\"absorption\":{\"63\":0.12,\"125\":0.17,\"250\":0.33,\"500\":0.64,\"1000\":0.83,\"2000\":0.9,\"4000\":0.92,\"8000\":0.94},\"nrc\":0.68,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"dcuAda8UZG8DekHu\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Wenger\",\"material\":\"Wenger, Type 1 Diffuser, 4x4, fabric faced, EACH\",\"absorption\":{\"63\":0.96,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"Wenger data\",\"description\":\"\",\"uuid\":\"dgD4PmFX8tm9UnVt\"},{\"tags\":[\"Walls\",\"Concrete Block\"],\"manufacturer\":\"\",\"name\":\"Concrete Block\",\"material\":\"Concrete block, painted\",\"absorption\":{\"63\":0.03,\"125\":0.1,\"250\":0.05,\"500\":0.06,\"1000\":0.07,\"2000\":0.09,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.07,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"dmX1uP6JmrlzaTMQ\"},{\"tags\":[\"People\",\"Lightly upholstered\"],\"manufacturer\":\"\",\"name\":\"Lightly Upholstered Seats\",\"material\":\"Lightly Upholstered Seats, unoccupied\",\"absorption\":{\"63\":0.13,\"125\":0.36,\"250\":0.47,\"500\":0.57,\"1000\":0.62,\"2000\":0.62,\"4000\":0.6,\"8000\":0.6},\"nrc\":0.57,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"dnWC2V0yV6OQGXdd\"},{\"tags\":[\"Walls\",\"Mineral wool\"],\"manufacturer\":\"\",\"name\":\"75Mm Mineral Wool On Solid\",\"material\":\"75mm mineral wool on solid\",\"absorption\":{\"63\":0.05,\"125\":0.3,\"250\":0.5,\"500\":0.75,\"1000\":0.85,\"2000\":0.9,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.75,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"dt7A3gNf1oo8UbNG\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloudlite Baffles\",\"material\":\"MBI Cloudlite Baffles, 2600-2015 2 mil PVC\",\"absorption\":{\"63\":0.03,\"125\":0.4,\"250\":0.74,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"MBI\",\"description\":\"\",\"uuid\":\"dzgKNOhz2qLeTEEF\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone 4In Thick\",\"material\":\"IAC Varitone 4in thick, Polymer & Spacer\",\"absorption\":{\"63\":0.27,\"125\":0.57,\"250\":0.6,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.86,\"8000\":0.86},\"nrc\":0.89,\"source\":\"IAC data\",\"description\":\"\",\"uuid\":\"dzo7cmM1ERPFSGqV\"},{\"tags\":[\"Walls\",\"Concrete Block\"],\"manufacturer\":\"\",\"name\":\"Concrete Block\",\"material\":\"Concrete Block, all, unpainted\",\"absorption\":{\"63\":0.14,\"125\":0.36,\"250\":0.44,\"500\":0.31,\"1000\":0.29,\"2000\":0.39,\"4000\":0.25,\"8000\":0.25},\"nrc\":0.36,\"source\":\"Knudsen/Harris\",\"description\":\"\",\"uuid\":\"e1hIlbiDt7tFPpcP\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno 4 A-Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Sereno 4 A-Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.09,\"125\":0.29,\"250\":0.62,\"500\":0.62,\"1000\":0.43,\"2000\":0.29,\"4000\":0.23,\"8000\":0.29},\"nrc\":0.49,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"e3sRkFsidLKmTTZL\"},{\"tags\":[\"General\",\"General\"],\"manufacturer\":\"\",\"name\":\"Ideally Flat 50% Absorptive Material\",\"material\":\"Ideally flat 50% absorptive material\",\"absorption\":{\"63\":0.5,\"125\":0.5,\"250\":0.5,\"500\":0.5,\"1000\":0.5,\"2000\":0.5,\"4000\":0.5,\"8000\":0.5},\"nrc\":0.5,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"e4a1WYCqBQFTOBzY\"},{\"tags\":[\"Grilles\",\"Grilles\"],\"manufacturer\":\"\",\"name\":\"Grille Opening - 50% Opening\",\"material\":\"Grille Opening - 50% Opening\",\"absorption\":{\"63\":0.2,\"125\":0.3,\"250\":0.4,\"500\":0.5,\"1000\":0.5,\"2000\":0.5,\"4000\":0.5,\"8000\":0.5},\"nrc\":0.48,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"e5tcDPN6uyNaORz4\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13\",\"material\":\"K13, ribbed deck, 1.5in\",\"absorption\":{\"63\":0,\"125\":0.36,\"250\":0.89,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.97,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"eEDIDAcI6yB1XJqx\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Opera House Pit\",\"material\":\"Opera house pit, 80 players (in metric sabines)  (Beranek 1998)\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"eMwW74N8o8TQlKUA\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Skyline Low Profile - 4\\\" A Mount\",\"material\":\"RPG Skyline Low Profile - 4\\\" A mount\",\"absorption\":{\"63\":0.05,\"125\":0.07,\"250\":0.09,\"500\":0.36,\"1000\":0.31,\"2000\":0.21,\"4000\":0.15,\"8000\":0.21},\"nrc\":0.24,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"eOrkePX5l96aa2up\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Omniffusor - A Mount With Fabric At 7\\\" From Face\",\"material\":\"RPG Omniffusor - A mount with fabric at 7\\\" from face\",\"absorption\":{\"63\":0.11,\"125\":0.15,\"250\":0.19,\"500\":0.27,\"1000\":0.32,\"2000\":0.23,\"4000\":0.27,\"8000\":0.31},\"nrc\":0.25,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"eTymjWLpEgCxmP52\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Alto 16 A-Mounted Over 2\\\" Fiberglass Core\",\"material\":\"Kinetics Alto 16 A-Mounted over 2\\\" Fiberglass Core\",\"absorption\":{\"63\":0.23,\"125\":0.49,\"250\":0.94,\"500\":0.97,\"1000\":0.86,\"2000\":0.78,\"4000\":0.72,\"8000\":0.78},\"nrc\":0.89,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"eUH2DRIsb8J7zid5\"},{\"tags\":[\"Environmental\",\"Environmental Materials\"],\"manufacturer\":\"\",\"name\":\"Grass (2\\\" High) Asa 10/69\",\"material\":\"Grass (2\\\" high) ASA 10/69\",\"absorption\":{\"63\":0.05,\"125\":0.11,\"250\":0.26,\"500\":0.6,\"1000\":0.69,\"2000\":0.92,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.62,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ebPYz2wfLRSgvyfU\"},{\"tags\":[\"Floors\",\"Concrete\"],\"manufacturer\":\"\",\"name\":\"Concrete\",\"material\":\"Concrete\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.02,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"ecG3c4odzYk7sj8g\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 4In Type A1; Painted\",\"material\":\"Soundblox 4in Type A1; painted\",\"absorption\":{\"63\":0,\"125\":0.12,\"250\":0.85,\"500\":0.36,\"1000\":0.36,\"2000\":0.42,\"4000\":0.45,\"8000\":0.45},\"nrc\":0.5,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"ecbzSgPACMMMHkFR\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 8In Type R; Painted\",\"material\":\"Soundblox 8in Type R; painted\",\"absorption\":{\"63\":0,\"125\":0.33,\"250\":0.94,\"500\":0.62,\"1000\":0.6,\"2000\":0.57,\"4000\":0.49,\"8000\":0.49},\"nrc\":0.68,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"ekQhFJ5W4hECAOT6\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"1In Or 25Mm Fiberglass\",\"material\":\"1in or 25mm fiberglass, fabric or perf. vinyl\",\"absorption\":{\"63\":0.26,\"125\":0.72,\"250\":0.93,\"500\":0.73,\"1000\":0.97,\"2000\":0.99,\"4000\":0.96,\"8000\":0.96},\"nrc\":0.91,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"emswHEpvUve8P0fD\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Orchestra On Stage\",\"material\":\"Orchestra on stage, 13 string instruments (in metric sabines)  (Beranek 1998)\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"eqUb1EVVoSOJKtKg\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, heavy, w/impermeable latex on foam rubber\",\"absorption\":{\"63\":0,\"125\":0.08,\"250\":0.27,\"500\":0.39,\"1000\":0.34,\"2000\":0.48,\"4000\":0.63,\"8000\":0.63},\"nrc\":0.37,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"ewwnwFt3kp2qWstN\"},{\"tags\":[\"Proscenium\",\"Proscenium & Balcony Openings\"],\"manufacturer\":\"\",\"name\":\"Deep Balcony With Upholstered Seats\",\"material\":\"Deep balcony with upholstered seats\",\"absorption\":{\"63\":0.1,\"125\":0.2,\"250\":0.3,\"500\":0.5,\"1000\":0.6,\"2000\":0.7,\"4000\":0.8,\"8000\":0.9},\"nrc\":0.53,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"f1BrLYrU8TLR7hSd\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Kinetics Knp 2\\\" Thick\",\"material\":\"Kinetics KNP 2\\\" Thick\",\"absorption\":{\"63\":0.08,\"125\":0.23,\"250\":0.75,\"500\":0.99,\"1000\":0.99,\"2000\":0.78,\"4000\":0.58,\"8000\":0.78},\"nrc\":0.88,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"f7yqmwZs88g91Wp4\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Uph. Stadium; Fab/Foam; Empty\",\"material\":\"Uph. stadium; fab/foam; empty\",\"absorption\":{\"63\":0,\"125\":0.32,\"250\":0.64,\"500\":0.69,\"1000\":0.61,\"2000\":0.58,\"4000\":0.5,\"8000\":0.5},\"nrc\":0.63,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"fARLro3Kzd7p92V7\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.33H Spacing, Type NF-4P\",\"absorption\":{\"63\":0.14,\"125\":0.2,\"250\":0.3,\"500\":0.37,\"1000\":0.34,\"2000\":0.34,\"4000\":0.22,\"8000\":0.34},\"nrc\":0.34,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"fBIt2nZDbhlzSTzi\"},{\"tags\":[\"Floors\",\"Linoleum\"],\"manufacturer\":\"\",\"name\":\"Linoleum\",\"material\":\"Linoleum, rubber, or asphalt tile on concrete\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.03,\"500\":0.03,\"1000\":0.03,\"2000\":0.03,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.03,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"fEr786B7h20GrwS6\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"1-1/2\\\" Tectum Mounting #8 (2\\\" X 4\\\" Battens\",\"material\":\"1-1/2\\\" Tectum mounting #8 (2\\\" x 4\\\" battens, 24\\\" center, over solid backing, with fiberglass batt (3/4 lb./cu. ft.) in void)\",\"absorption\":{\"63\":0.15,\"125\":0.4,\"250\":0.84,\"500\":0.99,\"1000\":0.84,\"2000\":0.94,\"4000\":0.88,\"8000\":0.94},\"nrc\":0.9,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"fGK22LzbjF1xwlPr\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, heavy, on concrete\",\"absorption\":{\"63\":0.02,\"125\":0.06,\"250\":0.14,\"500\":0.37,\"1000\":0.6,\"2000\":0.65,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.44,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"fYPRyxNMGib15HsZ\"},{\"tags\":[\"Ars\",\"Ars Panel Absorption\"],\"manufacturer\":\"\",\"name\":\"Ars 1\\\" Diffusive Panel (Est.)\",\"material\":\"ARS 1\\\" Diffusive panel (EST.)\",\"absorption\":{\"63\":0.05,\"125\":0.1,\"250\":0.13,\"500\":0.1,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.08,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"fb28Lmy2VDwHIGXt\"},{\"tags\":[\"People\",\"Non-upholstered\"],\"manufacturer\":\"\",\"name\":\"Non-Upholstered Seats\",\"material\":\"Non-upholstered Seats, unoccupied\",\"absorption\":{\"63\":0.06,\"125\":0.15,\"250\":0.19,\"500\":0.22,\"1000\":0.39,\"2000\":0.38,\"4000\":0.3,\"8000\":0.3},\"nrc\":0.3,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"fbquQfrAqbn8i3bJ\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Metal Cladding\",\"material\":\"Metal Cladding\",\"absorption\":{\"63\":0.05,\"125\":0.15,\"250\":0.1,\"500\":0.08,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.07,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"fhaotnOUL5ec54S5\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Single 100% Gathers\",\"material\":\"25oz. Single 100% gathers, 5\\\" to track, closed side edges - most current data, based on actual tests\",\"absorption\":{\"63\":0.24,\"125\":0.34,\"250\":0.73,\"500\":0.94,\"1000\":0.83,\"2000\":0.9,\"4000\":0.87,\"8000\":0.9},\"nrc\":0.85,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"fjtUNQ4vKegaclu2\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Noisemaster Res. Snd Absrs. On 4' Centers - 12\\\" Rnd.\",\"material\":\"Noisemaster Res. Snd Absrs. on 4' centers - 12\\\" rnd., 24\\\" long, sabins/unit\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"fmxs3gjdOj6I8Fby\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"1\\\" Tectum Mount #8  2 X 4 Battens\",\"material\":\"1\\\" Tectum mount #8  2 x 4 battens, 24\\\" o.c., on solid back, w/ fiberglass batt 0.75 lb./cu. ft in void\",\"absorption\":{\"63\":0.15,\"125\":0.32,\"250\":0.7,\"500\":0.99,\"1000\":0.93,\"2000\":0.76,\"4000\":0.94,\"8000\":0.99},\"nrc\":0.85,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"foXTVe6I4h8Dc35j\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Velour\",\"material\":\"Velour, 18 oz/sq yd, 8\\\" from wall (100% fullness) AIMA\",\"absorption\":{\"63\":0.08,\"125\":0.14,\"250\":0.35,\"500\":0.55,\"1000\":0.72,\"2000\":0.7,\"4000\":0.65,\"8000\":0.7},\"nrc\":0.58,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"fxTbMLoo9UHIfMrX\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, thin, glued to concrete\",\"absorption\":{\"63\":0,\"125\":0.02,\"250\":0.04,\"500\":0.08,\"1000\":0.2,\"2000\":0.35,\"4000\":0.4,\"8000\":0.4},\"nrc\":0.17,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"fywHXZai5ML31yWp\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Martin 3In Fibroplank\",\"material\":\"Martin 3in FIBROPLANK\",\"absorption\":{\"63\":0.05,\"125\":0.2,\"250\":0.3,\"500\":0.89,\"1000\":0.7,\"2000\":0.88,\"4000\":0.92,\"8000\":0.92},\"nrc\":0.69,\"source\":\"Martin data\",\"description\":\"\",\"uuid\":\"fz4m8F1Tn32sQRiX\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Cirrus Tile (1 X 1 X 3/4\\\")\",\"material\":\"Armstrong Cirrus Tile (1 x 1 x 3/4\\\"), Mount E-400\",\"absorption\":{\"63\":0.25,\"125\":0.49,\"250\":0.45,\"500\":0.52,\"1000\":0.76,\"2000\":0.88,\"4000\":0.91,\"8000\":0.94},\"nrc\":0.65,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"g4OmyPFWuoCFmqMr\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, \\\"Theatre thick\\\" pile over sponge rubber underlayment\",\"absorption\":{\"63\":0.05,\"125\":0.1,\"250\":0.1,\"500\":0.3,\"1000\":0.5,\"2000\":0.55,\"4000\":0.75,\"8000\":0.95},\"nrc\":0.36,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"g4VMTVrFiAOJwWzN\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"2 Layers Gypsum Board\",\"material\":\"2 layers gypsum board, 5/8\\\" thick, on 3-5/8\\\" metal studs, 16\\\" o.c., 1\\\" batt insulation-EST.\",\"absorption\":{\"63\":0.2,\"125\":0.15,\"250\":0.1,\"500\":0.07,\"1000\":0.06,\"2000\":0.08,\"4000\":0.09,\"8000\":0.1},\"nrc\":0.08,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"g8ZAvnLeFa0OBvbF\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.75H Spacing, Type NF-4\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.38,\"500\":0.55,\"1000\":0.58,\"2000\":0.65,\"4000\":0.38,\"8000\":0.65},\"nrc\":0.54,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"gCTqXmNdjey6s6fT\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Double 100% Gathers\",\"material\":\"32oz. Double 100% gathers, 10\\\" separation, 5\\\" to track, closed side edges - most current data, based on actual tests\",\"absorption\":{\"63\":0.53,\"125\":0.75,\"250\":0.98,\"500\":0.99,\"1000\":0.99,\"2000\":0.98,\"4000\":0.97,\"8000\":0.98},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"gGte7Wu3U1vdSleq\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Carpet: Medium Pile On Needleloom Underfelt\",\"material\":\"Carpet: medium pile on needleloom underfelt, or thick pile on nylon\",\"absorption\":{\"63\":0.15,\"125\":0.25,\"250\":0.45,\"500\":0.65,\"1000\":0.6,\"2000\":0.65,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.59,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"gH7b9Fdyin8FNhaO\"},{\"tags\":[\"Ars\",\"Ars Panel Absorption\"],\"manufacturer\":\"\",\"name\":\"Ars 1\\\" Panel - Reflective Side Out\",\"material\":\"ARS 1\\\" Panel - reflective side out\",\"absorption\":{\"63\":0.09,\"125\":0.46,\"250\":0.23,\"500\":0.08,\"1000\":0.09,\"2000\":0.08,\"4000\":0.07,\"8000\":0.08},\"nrc\":0.12,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"gKOW9wN9eVVBwoGS\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster On Lath\",\"material\":\"Plaster on lath\",\"absorption\":{\"63\":0.05,\"125\":0.14,\"250\":0.1,\"500\":0.06,\"1000\":0.05,\"2000\":0.04,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.06,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"gRbBSYkSbePlqUoe\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Rpg Bass Trap \",\"material\":\"RPG Bass Trap \",\"absorption\":{\"63\":0.99,\"125\":0.54,\"250\":0.36,\"500\":0.21,\"1000\":0.25,\"2000\":0.25,\"4000\":0.2,\"8000\":0.25},\"nrc\":0.27,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"gaQJVPhuj6LFqP9V\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Flat Double Layer\",\"material\":\"32oz. Flat double layer, 0\\\" separation, 12\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.27,\"125\":0.39,\"250\":0.61,\"500\":0.65,\"1000\":0.79,\"2000\":0.88,\"4000\":0.82,\"8000\":0.88},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"gfi7pz5NghZA44QF\"},{\"tags\":[\"Cotton\",\" Cotton Panels\"],\"manufacturer\":\"\",\"name\":\"Asi Echo Eliminator 2\\\" Thick Bonded Acoustical Cotton\",\"material\":\"ASI Echo Eliminator 2\\\" thick Bonded Acoustical Cotton\",\"absorption\":{\"63\":0.15,\"125\":0.35,\"250\":0.94,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.98,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"gjhW4N5cnA3l82eZ\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - 4.5\\\"\",\"material\":\"Cellular Metal Deck - 4.5\\\"\",\"absorption\":{\"63\":0.25,\"125\":0.4,\"250\":0.8,\"500\":0.99,\"1000\":0.75,\"2000\":0.5,\"4000\":0.4,\"8000\":0.5},\"nrc\":0.76,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"gnYNljYgNe5T4gp2\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass Fabric Curtain\",\"material\":\"Fiberglass fabric curtain, 8.5oz, draped to half area\",\"absorption\":{\"63\":0,\"125\":0.09,\"250\":0.32,\"500\":0.68,\"1000\":0.83,\"2000\":0.39,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.56,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"gqdWtay3cqnO1onD\"},{\"tags\":[\"Environmental\",\"Environmental Materials\"],\"manufacturer\":\"\",\"name\":\"Balsam Fir Trees - 20 Sq. Ft./Tree\",\"material\":\"Balsam fir trees - 20 sq. ft./tree, 8 ft. high ASA 10/69\",\"absorption\":{\"63\":0.01,\"125\":0.03,\"250\":0.06,\"500\":0.11,\"1000\":0.17,\"2000\":0.27,\"4000\":0.31,\"8000\":0.35},\"nrc\":0.15,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"grZ4Ikm2E5Qhc2Fi\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno 4/10 A-Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Sereno 4/10 A-Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.05,\"125\":0.18,\"250\":0.56,\"500\":0.99,\"1000\":0.86,\"2000\":0.42,\"4000\":0.28,\"8000\":0.42},\"nrc\":0.71,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"grpwTROcB7O3RR8Q\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"19Mm Timber Panels On Air Space And Mineral Wool\",\"material\":\"19mm timber panels on air space and mineral wool\",\"absorption\":{\"63\":0.1,\"125\":0.3,\"250\":0.2,\"500\":0.1,\"1000\":0.1,\"2000\":0.1,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.13,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"gsNRHijX08pgeG7L\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"1''Fabric Wrapped Panel -Sonotrol Std.\",\"material\":\"1''fabric wrapped panel -sonotrol std.\",\"absorption\":{\"63\":0.08,\"125\":0.11,\"250\":0.45,\"500\":0.94,\"1000\":0.99,\"2000\":0.99,\"4000\":0.86,\"8000\":0.99},\"nrc\":0.84,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"h1RukDCpq3EGk37B\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster On Lath\",\"material\":\"Plaster on lath, small air space\",\"absorption\":{\"63\":0.04,\"125\":0.1,\"250\":0.08,\"500\":0.05,\"1000\":0.05,\"2000\":0.04,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.06,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"h2ZZl2hUyzzFSB8y\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fabric Wrapped Fg Panel\",\"material\":\"Fabric Wrapped FG Panel, 1/2in, against solid backing\",\"absorption\":{\"63\":0,\"125\":0.04,\"250\":0.12,\"500\":0.3,\"1000\":0.69,\"2000\":0.87,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.5,\"source\":\"Decoustics Tests\",\"description\":\"\",\"uuid\":\"h8ICYAUo5MHCHpET\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 703\",\"material\":\"1\\\" Owens Corning 703, plain faced, Mounting A\",\"absorption\":{\"63\":0.08,\"125\":0.11,\"250\":0.28,\"500\":0.68,\"1000\":0.9,\"2000\":0.93,\"4000\":0.96,\"8000\":0.99},\"nrc\":0.7,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hBcweiDZzsOdV6bA\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 8In Type Rsc; Painted\",\"material\":\"Soundblox 8in Type RSC; painted\",\"absorption\":{\"63\":0,\"125\":0.5,\"250\":0.99,\"500\":0.99,\"1000\":0.66,\"2000\":0.56,\"4000\":0.72,\"8000\":0.72},\"nrc\":0.8,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"hBmXWTdUBXIYJsJ3\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Asc Tube Trap\",\"material\":\"ASC Tube Trap, 11\\\" Diameter x 3' L, Half-Round - sabines per tube \",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hCAMEWZWumz0aMJW\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Sponge Rubber Underlayment\",\"material\":\"Sponge rubber underlayment\",\"absorption\":{\"63\":0.01,\"125\":0.03,\"250\":0.05,\"500\":0.05,\"1000\":0.2,\"2000\":0.2,\"4000\":0.15,\"8000\":0.2},\"nrc\":0.13,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hGnx5HI7hTueMnR1\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 8In Type Q; Painted\",\"material\":\"Soundblox 8in Type Q; painted\",\"absorption\":{\"63\":0.29,\"125\":0.99,\"250\":0.57,\"500\":0.61,\"1000\":0.37,\"2000\":0.56,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.53,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"hJ5GMhW1GPJMe0Ag\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - 1 5/8\\\" Nf\",\"material\":\"Cellular metal deck - 1 5/8\\\" NF, 50% perforated, 50% not perforated\",\"absorption\":{\"63\":0.2,\"125\":0.38,\"250\":0.4,\"500\":0.44,\"1000\":0.54,\"2000\":0.33,\"4000\":0.21,\"8000\":0.33},\"nrc\":0.43,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hLwyFOKjMrScJ6M7\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.75H Spacing, Type NF-2PS\",\"absorption\":{\"63\":0.09,\"125\":0.13,\"250\":0.36,\"500\":0.39,\"1000\":0.5,\"2000\":0.55,\"4000\":0.32,\"8000\":0.55},\"nrc\":0.45,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hN8GgfmzFOwmixiy\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Occupied\",\"material\":\"Occupied, medium upholstered (Beranek 1998)\",\"absorption\":{\"63\":0.43,\"125\":0.62,\"250\":0.72,\"500\":0.8,\"1000\":0.83,\"2000\":0.84,\"4000\":0.85,\"8000\":0.86},\"nrc\":0.8,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hQkBu7CmRXKcavsk\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, \\\"Theatre thick\\\" pile over needleloom underfelt\",\"absorption\":{\"63\":0.1,\"125\":0.2,\"250\":0.25,\"500\":0.5,\"1000\":0.6,\"2000\":0.7,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.51,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hRpA7kzp6CjaIszh\"},{\"tags\":[\"Outdoors\",\"Water\"],\"manufacturer\":\"\",\"name\":\"Water\",\"material\":\"Water\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.01,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"hVFxX7xmbyIaTwkt\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Woodacoustic A (A.A.V. Ltd)\",\"material\":\"Woodacoustic A (A.A.V. ltd)\",\"absorption\":{\"63\":0,\"125\":0.15,\"250\":0.35,\"500\":0.4,\"1000\":0.6,\"2000\":0.85,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.55,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"he9FnJ9QPFECRFQJ\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1\\\" K-13 On Solid Base\",\"material\":\"1\\\" K-13 on solid base\",\"absorption\":{\"63\":0.02,\"125\":0.08,\"250\":0.29,\"500\":0.75,\"1000\":0.98,\"2000\":0.93,\"4000\":0.73,\"8000\":0.93},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hgYlID0YHfwM7NI9\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"Sprayed Cellulose Fibers\",\"material\":\"Sprayed cellulose fibers, 1in thick on concrete\",\"absorption\":{\"63\":0,\"125\":0.08,\"250\":0.29,\"500\":0.75,\"1000\":0.98,\"2000\":0.93,\"4000\":0.76,\"8000\":0.76},\"nrc\":0.74,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"hhnDSMAXK8eI5Vbv\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1/2\\\", nailed to 2\\\" x 4\\\" studs, 16\\\" 0C  AIMA\",\"absorption\":{\"63\":0.35,\"125\":0.29,\"250\":0.1,\"500\":0.05,\"1000\":0.04,\"2000\":0.07,\"4000\":0.09,\"8000\":0.11},\"nrc\":0.07,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hkC36k7uf6FdEw0O\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Usg Omni-Fissured Auratone (2 X 2)\",\"material\":\"USG Omni-Fissured Auratone (2 x 2), Mount E-400\",\"absorption\":{\"63\":0.3,\"125\":0.42,\"250\":0.51,\"500\":0.68,\"1000\":0.85,\"2000\":0.79,\"4000\":0.78,\"8000\":0.79},\"nrc\":0.71,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hoNf2Y4A5F38Afzv\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Decoustics Low-Frequency-Tuner: 2\\\" Thick Fabric-Covered Wall Panel\",\"material\":\"Decoustics Low-Frequency-Tuner: 2\\\" thick fabric-covered wall panel\",\"absorption\":{\"63\":0.25,\"125\":0.35,\"250\":0.99,\"500\":0.76,\"1000\":0.24,\"2000\":0.07,\"4000\":0.08,\"8000\":0.09},\"nrc\":0.52,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hpqDPHJynSpaEhjK\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Ensemble A-Mounted Over 2\\\" Fiberglass Core\",\"material\":\"Kinetics Ensemble A-Mounted over 2\\\" Fiberglass Core\",\"absorption\":{\"63\":0.12,\"125\":0.32,\"250\":0.93,\"500\":0.99,\"1000\":0.94,\"2000\":0.79,\"4000\":0.59,\"8000\":0.79},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"hvFG9X7cVtdT7OOx\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Asc Tube Trap\",\"material\":\"ASC Tube Trap, 9\\\" Diameter x 3' L, Half-Round - sabines per tube \",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"i5AYD08zNGN0NPoC\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Flat Double Layer\",\"material\":\"25oz. Flat double layer, 0\\\" separation, 12\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.22,\"125\":0.32,\"250\":0.55,\"500\":0.59,\"1000\":0.82,\"2000\":0.98,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"i6wzAmy3Hc4JwSnB\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Triffusor - Diffusive Side\",\"material\":\"RPG Triffusor - Diffusive Side\",\"absorption\":{\"63\":0.91,\"125\":0.49,\"250\":0.09,\"500\":0.37,\"1000\":0.35,\"2000\":0.27,\"4000\":0.23,\"8000\":0.27},\"nrc\":0.27,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"i8UQJUGJkWCzKoIi\"},{\"tags\":[\"Floors\",\"Timber\"],\"manufacturer\":\"\",\"name\":\"Suspended Timber Floor\",\"material\":\"Suspended timber floor, large air space\",\"absorption\":{\"63\":0.13,\"125\":0.3,\"250\":0.25,\"500\":0.15,\"1000\":0.1,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.15,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"iCR8bNyeoCgQtYcO\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Pyrok Cement\",\"material\":\"1/2\\\" Pyrok Cement\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.2,\"500\":0.43,\"1000\":0.68,\"2000\":0.75,\"4000\":0.8,\"8000\":0.85},\"nrc\":0.52,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"iFGqrXpzdcaqXqpS\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Acoustical Board\",\"material\":\"Acoustical board, 3/4in thick, in suspension system\",\"absorption\":{\"63\":0.3,\"125\":0.76,\"250\":0.93,\"500\":0.83,\"1000\":0.99,\"2000\":0.99,\"4000\":0.94,\"8000\":0.94},\"nrc\":0.94,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"iGwWr9dVMEHIEytS\"},{\"tags\":[\"Soundblocks\",\"Soundblocks\"],\"manufacturer\":\"\",\"name\":\"Proudfoot 'Soundblox' \",\"material\":\"Proudfoot 'Soundblox' , 8 -in., Type RSC Painted (63 Hz est.)\",\"absorption\":{\"63\":0.4,\"125\":0.5,\"250\":0.99,\"500\":0.99,\"1000\":0.66,\"2000\":0.56,\"4000\":0.72,\"8000\":0.88},\"nrc\":0.8,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"iLXB1JQvZYIcTBdO\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone\",\"material\":\"USG Auratone, Aspen Illus. Two/24 652 3/4 2x4\",\"absorption\":{\"63\":0.15,\"125\":0.37,\"250\":0.29,\"500\":0.46,\"1000\":0.62,\"2000\":0.64,\"4000\":0.76,\"8000\":0.76},\"nrc\":0.5,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"iQFkFIBHbkhS9S0X\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Heavy Carpet (Impermeable Latex Backing) On Foam Rubber\",\"material\":\"Heavy carpet (impermeable latex backing) on foam rubber, or 40 oz. hairfelt; on concrete\",\"absorption\":{\"63\":0.06,\"125\":0.08,\"250\":0.27,\"500\":0.39,\"1000\":0.34,\"2000\":0.48,\"4000\":0.63,\"8000\":0.78},\"nrc\":0.37,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"iSNOHOA1qmlZWppv\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Alto 8 A-Mounted Over 2\\\" Fiberglass Core\",\"material\":\"Kinetics Alto 8 A-Mounted over 2\\\" Fiberglass Core\",\"absorption\":{\"63\":0.07,\"125\":0.38,\"250\":0.97,\"500\":0.99,\"1000\":0.84,\"2000\":0.57,\"4000\":0.62,\"8000\":0.67},\"nrc\":0.84,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"iSt3ODugF90LGQKb\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Ribbed Metal Acoustical Deck - 3\\\" Rib\",\"material\":\"Ribbed metal acoustical deck - 3\\\" Rib\",\"absorption\":{\"63\":0.36,\"125\":0.59,\"250\":0.99,\"500\":0.99,\"1000\":0.95,\"2000\":0.6,\"4000\":0.34,\"8000\":0.6},\"nrc\":0.88,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"iTgTefS3gSzqYw5G\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 8In Rsr; Split Rib\",\"material\":\"Soundblox 8in RSR; split rib, unpainted\",\"absorption\":{\"63\":0.21,\"125\":0.61,\"250\":0.81,\"500\":0.57,\"1000\":0.55,\"2000\":0.66,\"4000\":0.64,\"8000\":0.64},\"nrc\":0.65,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"iWHLy9ORrujPjoT5\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Pebble Open Plan (foil) 2x4 x1.5in\",\"absorption\":{\"63\":0.27,\"125\":0.76,\"250\":0.98,\"500\":0.87,\"1000\":0.99,\"2000\":0.99,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.96,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"iX7oltNpPzXHnuVZ\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Abffusor - E Mount\",\"material\":\"RPG Abffusor - E mount\",\"absorption\":{\"63\":0.57,\"125\":0.82,\"250\":0.86,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.96,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"iYHaYEmZZfskysn5\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass 6In Type 703\",\"material\":\"Fiberglass 6in Type 703, unfaced\",\"absorption\":{\"63\":0.5,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"iaNWv2FqiatlHxXe\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 4' Ceiling Diffuser\",\"material\":\"Wenger 4' x 4' Ceiling Diffuser, Pyramidal (E-400)\",\"absorption\":{\"63\":0.15,\"125\":0.21,\"250\":0.14,\"500\":0.13,\"1000\":0.13,\"2000\":0.18,\"4000\":0.27,\"8000\":0.36},\"nrc\":0.15,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"iebB7jtR0jCRm9Qm\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 705\",\"material\":\"1\\\" Owens Corning 705, FRK faced, Mounting E-405\",\"absorption\":{\"63\":0.2,\"125\":0.29,\"250\":0.52,\"500\":0.33,\"1000\":0.72,\"2000\":0.58,\"4000\":0.53,\"8000\":0.58},\"nrc\":0.54,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ifFnTr3RjE6mlXps\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Flat Double Layer\",\"material\":\"32oz. Flat double layer, 0\\\" separation, 3\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.56,\"500\":0.83,\"1000\":0.81,\"2000\":0.84,\"4000\":0.78,\"8000\":0.84},\"nrc\":0.76,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"igj3fzuQkhNWwWjk\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 5/8in screwed to 1x3studs, 16inoc, ins.\",\"absorption\":{\"63\":0.07,\"125\":0.55,\"250\":0.14,\"500\":0.08,\"1000\":0.04,\"2000\":0.12,\"4000\":0.11,\"8000\":0.11},\"nrc\":0.1,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"ihyoO2ubYh5nsc74\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood\",\"material\":\"Wood, 1/4in paneling, with air space\",\"absorption\":{\"63\":0.11,\"125\":0.42,\"250\":0.21,\"500\":0.1,\"1000\":0.08,\"2000\":0.06,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.11,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"il39jmoYmUYLCwxM\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Shredded-Wood Fiberboard\",\"material\":\"Shredded-wood fiberboard, 2in thick on lay-in grid\",\"absorption\":{\"63\":0.26,\"125\":0.59,\"250\":0.51,\"500\":0.53,\"1000\":0.73,\"2000\":0.88,\"4000\":0.74,\"8000\":0.74},\"nrc\":0.66,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"ipssADcK8d7KFjkT\"},{\"tags\":[\"Ars\",\"Ars Panel Absorption\"],\"manufacturer\":\"\",\"name\":\"Ars 1\\\" Panel - Absorptive Side Out\",\"material\":\"ARS 1\\\" Panel - absorptive side out\",\"absorption\":{\"63\":0.06,\"125\":0.13,\"250\":0.45,\"500\":0.74,\"1000\":0.95,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.78,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ir3zCXGnOj2rURuL\"},{\"tags\":[\"Walls\",\"Plasterboard\"],\"manufacturer\":\"\",\"name\":\"9Mm P/Board On 25Mm Air Space On Solid\",\"material\":\"9mm p/board on 25mm air space on solid\",\"absorption\":{\"63\":0.08,\"125\":0.3,\"250\":0.15,\"500\":0.1,\"1000\":0.05,\"2000\":0.04,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.09,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"ixWbqRJhF00qkaXx\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Perdue Fabric And Rockwool 4\\\" Panel\",\"material\":\"Perdue Fabric and Rockwool 4\\\" Panel\",\"absorption\":{\"63\":0.54,\"125\":0.77,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.94,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"iz50PJdrqGG1HeQn\"},{\"tags\":[\"Floors\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Floor On Joists\",\"material\":\"Wood floor on joists\",\"absorption\":{\"63\":0.06,\"125\":0.15,\"250\":0.11,\"500\":0.1,\"1000\":0.07,\"2000\":0.06,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.09,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"j6XDIwt4z5QcUhu5\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Occupied Audience\",\"material\":\"Occupied audience, orchestra and chorus areas    SOURCE?\",\"absorption\":{\"63\":0.34,\"125\":0.52,\"250\":0.68,\"500\":0.85,\"1000\":0.97,\"2000\":0.93,\"4000\":0.85,\"8000\":0.93},\"nrc\":0.86,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"j78I11pYH5PGVl7L\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"1 Layer Gypsum Board\",\"material\":\"1 layer gypsum board, 1/2\\\" thick, on 3-5/8\\\" metal studs, 16\\\" o.c., 1\\\" batt insulation-EST.\",\"absorption\":{\"63\":0.45,\"125\":0.35,\"250\":0.12,\"500\":0.1,\"1000\":0.06,\"2000\":0.08,\"4000\":0.09,\"8000\":0.1},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"j9LKUp2djMzDBFui\"},{\"tags\":[\"Floors\",\"Concrete\"],\"manufacturer\":\"\",\"name\":\"Glazed Tile Or Marble\",\"material\":\"Glazed tile or marble\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.02,\"500\":0.02,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.02,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"jKszTsT1uOuz1TnR\"},{\"tags\":[\"Floors\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Vinyl Or Woodblock Floor\",\"material\":\"Vinyl or woodblock floor\",\"absorption\":{\"63\":0.02,\"125\":0.03,\"250\":0.03,\"500\":0.03,\"1000\":0.04,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.04,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"jRA4TsT7fD0vlVTQ\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Double 100% Gathers\",\"material\":\"25oz. Double 100% gathers, 8\\\" separation, 15\\\" to track, closed side edges\",\"absorption\":{\"63\":0.48,\"125\":0.69,\"250\":0.87,\"500\":0.99,\"1000\":0.98,\"2000\":0.97,\"4000\":0.86,\"8000\":0.97},\"nrc\":0.95,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"jRmPYgGuH4bmH03z\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Glass\",\"material\":\"Glass, heavy, large panes\",\"absorption\":{\"63\":0.03,\"125\":0.18,\"250\":0.06,\"500\":0.04,\"1000\":0.03,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.04,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"jau9Oq1llKn7XZS8\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Foil Faced Fiberglass\",\"material\":\"Foil Faced Fiberglass, 1in, against solid backing\",\"absorption\":{\"63\":0.07,\"125\":0.56,\"250\":0.99,\"500\":0.93,\"1000\":0.41,\"2000\":0.21,\"4000\":0.14,\"8000\":0.14},\"nrc\":0.64,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"jd5IhMHzNMaRi5v2\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Tectum\",\"material\":\"Tectum, 1in, over 1in fiberglass batt (3/4in furring)\",\"absorption\":{\"63\":0,\"125\":0.07,\"250\":0.15,\"500\":0.36,\"1000\":0.65,\"2000\":0.71,\"4000\":0.81,\"8000\":0.81},\"nrc\":0.47,\"source\":\"Tectum Company\",\"description\":\"\",\"uuid\":\"jgUEByAueKu3rDjU\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"1-1/2\\\" Tectum Mounting #2 (1\\\" X 3\\\" Battens\",\"material\":\"1-1/2\\\" Tectum mounting #2 (1\\\" x 3\\\" battens, 24\\\" center, over solid backing)\",\"absorption\":{\"63\":0.05,\"125\":0.15,\"250\":0.26,\"500\":0.62,\"1000\":0.83,\"2000\":0.7,\"4000\":0.91,\"8000\":0.99},\"nrc\":0.6,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"jpKBk8LEqdpvI8Lk\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Painted Linear Glass Cloth Board Over 2\\\" Air Space\",\"material\":\"1\\\" painted linear glass cloth board over 2\\\" air space\",\"absorption\":{\"63\":0.12,\"125\":0.17,\"250\":0.4,\"500\":0.94,\"1000\":0.99,\"2000\":0.97,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.83,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"jvAg8dBJ6jKb7Nhl\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Glass Clothboard Over 2\\\" Owens Corning 703\",\"material\":\"1\\\" glass clothboard over 2\\\" Owens Corning 703\",\"absorption\":{\"63\":0.41,\"125\":0.59,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.97,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"jwpCQiMwVvTC44lq\"},{\"tags\":[\"Floors\",\"Timber\"],\"manufacturer\":\"\",\"name\":\"Suspended Timber Floor\",\"material\":\"Suspended timber floor, 19mm air space\",\"absorption\":{\"63\":0.1,\"125\":0.3,\"250\":0.2,\"500\":0.1,\"1000\":0.1,\"2000\":0.1,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.13,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"jzN26SN3nfS4dODW\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Metal Chairs Or Wood Seats (Per Sq. Ft.) Aima\",\"material\":\"Metal chairs or wood seats (per sq. ft.) AIMA\",\"absorption\":{\"63\":0.1,\"125\":0.15,\"250\":0.19,\"500\":0.22,\"1000\":0.39,\"2000\":0.38,\"4000\":0.3,\"8000\":0.38},\"nrc\":0.3,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"k9PgTzY8AdOYE1IY\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics H.I.R1 Fabric 2-1/8In\",\"material\":\"Decoustics h.i.r1 fabric 2-1/8in\",\"absorption\":{\"63\":0.11,\"125\":0.54,\"250\":0.87,\"500\":0.99,\"1000\":0.99,\"2000\":0.94,\"4000\":0.91,\"8000\":0.91},\"nrc\":0.95,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"kEul680Kk8fcX2DH\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Indoor-Outdoor Carpet On Concrete\",\"material\":\"Indoor-outdoor carpet on concrete\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.05,\"500\":0.1,\"1000\":0.2,\"2000\":0.45,\"4000\":0.65,\"8000\":0.85},\"nrc\":0.2,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"kVJho4ovZaFy57Ou\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Nubby Glass Cloth O/C\",\"material\":\"Nubby glass cloth O/C, 1\\\" thick on solid surface\",\"absorption\":{\"63\":0.03,\"125\":0.04,\"250\":0.21,\"500\":0.73,\"1000\":0.99,\"2000\":0.99,\"4000\":0.9,\"8000\":0.99},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"kYSRT8NeVnDdgUHh\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass 4In: 3In Type 703 + 1In Nubby Glass Cloth\",\"material\":\"Fiberglass 4in: 3in Type 703 + 1in Nubby Glass Cloth\",\"absorption\":{\"63\":0.25,\"125\":0.75,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.97,\"8000\":0.97},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"kiQ4fVzfoQIerzjj\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.33H Spacing, Type NF-2\",\"absorption\":{\"63\":0.11,\"125\":0.16,\"250\":0.25,\"500\":0.3,\"1000\":0.27,\"2000\":0.32,\"4000\":0.23,\"8000\":0.32},\"nrc\":0.29,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"kkJCvpNEWkOYHYzj\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Orion 270 Climaplus 3/4 2X2\",\"material\":\"USG Orion 270 ClimaPlus 3/4 2x2\",\"absorption\":{\"63\":0.32,\"125\":0.72,\"250\":0.64,\"500\":0.62,\"1000\":0.92,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.79,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"kqUGgcIEGncCxvIZ\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 4In Type R; Painted\",\"material\":\"Soundblox 4in Type R; painted\",\"absorption\":{\"63\":0,\"125\":0.2,\"250\":0.88,\"500\":0.63,\"1000\":0.65,\"2000\":0.52,\"4000\":0.43,\"8000\":0.43},\"nrc\":0.67,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"kqb8ikZb5SzOxaTA\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Flat Double Layer\",\"material\":\"32oz. Flat double layer, 0\\\" separation, 8\\\" behind rear fabric, closed side edges\",\"absorption\":{\"63\":0.32,\"125\":0.46,\"250\":0.7,\"500\":0.68,\"1000\":0.74,\"2000\":0.8,\"4000\":0.75,\"8000\":0.8},\"nrc\":0.73,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ksB0qjNeghETcCvV\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Acoustiflex Neoprene-Coated 1\\\" Mid-Nite Blanket\",\"material\":\"Acoustiflex neoprene-coated 1\\\" mid-nite blanket, 1.5 lb./cu. ft.\",\"absorption\":{\"63\":0.12,\"125\":0.17,\"250\":0.63,\"500\":0.74,\"1000\":0.97,\"2000\":0.9,\"4000\":0.86,\"8000\":0.9},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"l0KKt95OdZ64XLMe\"},{\"tags\":[\"Air\",\"Air Absorption\"],\"manufacturer\":\"\",\"name\":\"Air (Metric Sabines Per 1000 Cu. M.) - Relative Humidity 40%\",\"material\":\"Air (metric sabines per 1000 cu. m.) - relative humidity 40%\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0,\"500\":0,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.5,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"l201mzYL9xjwM8IZ\"},{\"tags\":[\"Air\",\"Air Absorption\"],\"manufacturer\":\"\",\"name\":\"Air (Per 1000 Cu. Ft.) - Relative Humidity 80%\",\"material\":\"Air (per 1000 cu. ft.) - relative humidity 80%\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0,\"500\":0,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.5,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"l3vDsRSMmhl92ZWz\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Asc Tube Trap\",\"material\":\"ASC Tube Trap, 16\\\" Diameter x 3' L, Full-Round - sabines per tube \",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"l99zTUrv6dSoreKV\"},{\"tags\":[\"Floors\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Medium Pile Carpet With Underlay\",\"material\":\"Medium pile carpet with underlay\",\"absorption\":{\"63\":0.03,\"125\":0.1,\"250\":0.15,\"500\":0.3,\"1000\":0.5,\"2000\":0.65,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.4,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"lAqakvXBEIJYyMuD\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass Duct Liner\",\"material\":\"Fiberglass Duct Liner, 2in, 1.5# fiberglass on duct\",\"absorption\":{\"63\":0,\"125\":0.25,\"250\":0.73,\"500\":0.94,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.91,\"source\":\"Owens Corning\",\"description\":\"\",\"uuid\":\"lG8NwirHiu98D1Ke\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 705\",\"material\":\"2\\\" Owens Corning 705, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.27,\"125\":0.39,\"250\":0.63,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.9,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"lOQWBsSaFhxqqHgM\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, 5 mm, foam backed\",\"absorption\":{\"63\":0,\"125\":0.05,\"250\":0.1,\"500\":0.12,\"1000\":0.3,\"2000\":0.4,\"4000\":0.5,\"8000\":0.5},\"nrc\":0.23,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"ldKDVJXZ7BqxYPGi\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Martin 2In Fibroplank\",\"material\":\"Martin 2in FIBROPLANK\",\"absorption\":{\"63\":0.02,\"125\":0.13,\"250\":0.23,\"500\":0.62,\"1000\":0.99,\"2000\":0.61,\"4000\":0.81,\"8000\":0.81},\"nrc\":0.61,\"source\":\"Martin data\",\"description\":\"\",\"uuid\":\"lhFLZH6JoO47irr4\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Velour\",\"material\":\"Velour, 14 oz/sq yd at wall (0% fullness) Beranek\",\"absorption\":{\"63\":0.03,\"125\":0.05,\"250\":0.07,\"500\":0.13,\"1000\":0.22,\"2000\":0.32,\"4000\":0.35,\"8000\":0.38},\"nrc\":0.19,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"lhkbTv6sKKjLwS6U\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-2N, 50% Intermittent Mount\",\"absorption\":{\"63\":0.23,\"125\":0.33,\"250\":0.77,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.94,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"lkS8vz4VzkwRCbZr\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Vicracoustic Type A Perforated Vinyl Face 1\\\" Core (Mounting #2)\",\"material\":\"Vicracoustic Type A perforated vinyl face 1\\\" core (mounting #2)\",\"absorption\":{\"63\":0.19,\"125\":0.27,\"250\":0.72,\"500\":0.87,\"1000\":0.82,\"2000\":0.74,\"4000\":0.7,\"8000\":0.74},\"nrc\":0.79,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"lpDAGdajJdkRn4zj\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Almute (2.5Mm Thick) With 150Mm (6\\\") Airspace\",\"material\":\"Almute (2.5mm thick) with 150mm (6\\\") airspace\",\"absorption\":{\"63\":0.21,\"125\":0.3,\"250\":0.84,\"500\":0.88,\"1000\":0.71,\"2000\":0.58,\"4000\":0.59,\"8000\":0.6},\"nrc\":0.75,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"lu4OoF9R1Su8NN3U\"},{\"tags\":[\"Outdoors\",\"Snow\"],\"manufacturer\":\"\",\"name\":\"Snow\",\"material\":\"Snow, freshly fallen, 4in thick\",\"absorption\":{\"63\":0.08,\"125\":0.45,\"250\":0.75,\"500\":0.9,\"1000\":0.95,\"2000\":0.95,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.89,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"luBKwRTGjaoFLjhh\"},{\"tags\":[\"Walls\",\"Brick\"],\"manufacturer\":\"\",\"name\":\"Brick Work\",\"material\":\"Brick work, fair faced\",\"absorption\":{\"63\":0.02,\"125\":0.05,\"250\":0.04,\"500\":0.02,\"1000\":0.04,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.04,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"lzWNqFTbU7y0I6xl\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood\",\"material\":\"Wood, pine sheathing\",\"absorption\":{\"63\":0.05,\"125\":0.1,\"250\":0.11,\"500\":0.1,\"1000\":0.08,\"2000\":0.08,\"4000\":0.11,\"8000\":0.11},\"nrc\":0.09,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"m6RO9QZHC8ox2Wsm\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"6.25\\\" Owens Corning R-19\",\"material\":\"6.25\\\" Owens Corning R-19, FRK faced, Mounting A\",\"absorption\":{\"63\":0.66,\"125\":0.94,\"250\":0.99,\"500\":0.99,\"1000\":0.71,\"2000\":0.56,\"4000\":0.39,\"8000\":0.56},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"mBMf7mDI7j5Ag94O\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Fine Fissured Square Lay-in, 2x4\",\"absorption\":{\"63\":0.16,\"125\":0.34,\"250\":0.32,\"500\":0.61,\"1000\":0.89,\"2000\":0.95,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.69,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"mFlsD6AofgysW2Ci\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Uph. Auditorium Chairs\",\"material\":\"Uph. auditorium chairs, empty\",\"absorption\":{\"63\":0.01,\"125\":0.45,\"250\":0.88,\"500\":0.83,\"1000\":0.78,\"2000\":0.72,\"4000\":0.63,\"8000\":0.63},\"nrc\":0.8,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"mGE8fMcWNWmPLhYU\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 4' Ceiling Diffuser\",\"material\":\"Wenger 4' x 4' Ceiling Diffuser, Convex (A)\",\"absorption\":{\"63\":0.34,\"125\":0.49,\"250\":0.16,\"500\":0.1,\"1000\":0.04,\"2000\":0.03,\"4000\":0.05,\"8000\":0.07},\"nrc\":0.08,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"mZLCVUkifIVl4UWq\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 705\",\"material\":\"1\\\" Owens Corning 705, ASJ faced, Mounting E-405\",\"absorption\":{\"63\":0.17,\"125\":0.24,\"250\":0.58,\"500\":0.29,\"1000\":0.75,\"2000\":0.57,\"4000\":0.41,\"8000\":0.57},\"nrc\":0.55,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"mdi7uLOK0cqGQ7M7\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plywood\",\"material\":\"Plywood, 3/8in thick\",\"absorption\":{\"63\":0.11,\"125\":0.28,\"250\":0.22,\"500\":0.17,\"1000\":0.09,\"2000\":0.1,\"4000\":0.11,\"8000\":0.11},\"nrc\":0.15,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"mfvMfE3yMuAl60Hb\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Cirrus Open Plan\",\"absorption\":{\"63\":0.14,\"125\":0.32,\"250\":0.37,\"500\":0.7,\"1000\":0.93,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.75,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"mmoWmTjqMew2Qmkf\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Turkey (Shag) Carpet\",\"material\":\"Turkey (shag) carpet, thick pile on needleloom underfelt\",\"absorption\":{\"63\":0.1,\"125\":0.2,\"250\":0.3,\"500\":0.55,\"1000\":0.65,\"2000\":0.65,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.54,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"mq0k5kAWOxq6Rnkb\"},{\"tags\":[\"Plaster\",\"Plaster Constructions\"],\"manufacturer\":\"\",\"name\":\"Plasterglass 3/16\\\" Thick Frg  Manuf Test Data\",\"material\":\"Plasterglass 3/16\\\" thick FRG  MANUF TEST DATA\",\"absorption\":{\"63\":0.15,\"125\":0.1,\"250\":0.02,\"500\":0.09,\"1000\":0.06,\"2000\":0.02,\"4000\":0.12,\"8000\":0.22},\"nrc\":0.05,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"mtvqt4rLGwpE4Sej\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Fine Texture Mineral Fiber\",\"material\":\"fine texture mineral fiber, all sizes\",\"absorption\":{\"63\":0.16,\"125\":0.34,\"250\":0.37,\"500\":0.56,\"1000\":0.72,\"2000\":0.79,\"4000\":0.82,\"8000\":0.82},\"nrc\":0.61,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"n0cgx4acKYXY1DuA\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Slotted Concrete Block \",\"material\":\"Slotted concrete block , 8in, metal septum in void\",\"absorption\":{\"63\":0.49,\"125\":0.99,\"250\":0.97,\"500\":0.61,\"1000\":0.37,\"2000\":0.56,\"4000\":0.39,\"8000\":0.39},\"nrc\":0.63,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"n6iVMZAP0smGbolk\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, indoor-outdoor, glued\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.03,\"500\":0.06,\"1000\":0.1,\"2000\":0.26,\"4000\":0.47,\"8000\":0.47},\"nrc\":0.11,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"nJpZ9Lu4HSForGCF\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloudlite Baffles\",\"material\":\"MBI Cloudlite Baffles, 2600-2020 perf. PVC\",\"absorption\":{\"63\":0,\"125\":0.34,\"250\":0.74,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"MBI\",\"description\":\"\",\"uuid\":\"nSI7vhMhYuVIldH7\"},{\"tags\":[\"Floors\",\"Concrete\"],\"manufacturer\":\"\",\"name\":\"Indoor-Outdoor Carpet\",\"material\":\"Indoor-Outdoor carpet\",\"absorption\":{\"63\":0,\"125\":0.01,\"250\":0.05,\"500\":0.1,\"1000\":0.2,\"2000\":0.45,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.2,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"nSVwCYNw6CmeDmx1\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"Plaster Coated Tectum (1\\\" Thick)\",\"material\":\"Plaster coated Tectum (1\\\" thick), on 1\\\" x 3\\\" battens, 24\\\" center, with Rockwool (1/2 lb./sq. ft.) in cavity\",\"absorption\":{\"63\":0.4,\"125\":0.5,\"250\":0.3,\"500\":0.2,\"1000\":0.15,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.19,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"nUTOOFYgSvFkhh3j\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Decoustics Baffle #10&20 ; S/H =2\",\"material\":\"decoustics Baffle #10&20 ; S/H =2\",\"absorption\":{\"63\":0.22,\"125\":0.31,\"250\":0.71,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.92,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"nZgAXk6smWqJ1NLq\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Picado With 0.5Mm Micro-Perforations E-400 Mounted\",\"material\":\"Kinetics Picado with 0.5mm micro-perforations E-400 Mounted\",\"absorption\":{\"63\":0.38,\"125\":0.78,\"250\":0.85,\"500\":0.7,\"1000\":0.67,\"2000\":0.74,\"4000\":0.58,\"8000\":0.74},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"nZjGv1u6GzUc9lCn\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Bad Panel - 1\\\" E Mount With 1/2\\\" Holes\",\"material\":\"RPG BAD Panel - 1\\\" E mount with 1/2\\\" holes\",\"absorption\":{\"63\":0.52,\"125\":0.74,\"250\":0.77,\"500\":0.79,\"1000\":0.92,\"2000\":0.85,\"4000\":0.7,\"8000\":0.85},\"nrc\":0.83,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"niMBd2fslZ78vMVw\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, heavy, on concrete\",\"absorption\":{\"63\":0,\"125\":0.02,\"250\":0.06,\"500\":0.14,\"1000\":0.37,\"2000\":0.6,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.29,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"nimWDMj342Amwv1B\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Upholst. Seats\",\"material\":\"Upholst. seats, 3/4 audience\",\"absorption\":{\"63\":0.21,\"125\":0.55,\"250\":0.68,\"500\":0.81,\"1000\":0.9,\"2000\":0.87,\"4000\":0.79,\"8000\":0.79},\"nrc\":0.82,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"nvHeqerSCJDZPUJQ\"},{\"tags\":[\"Floors\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Parquet On Concrete\",\"material\":\"Wood parquet on concrete\",\"absorption\":{\"63\":0.02,\"125\":0.04,\"250\":0.04,\"500\":0.07,\"1000\":0.07,\"2000\":0.06,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.06,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"nxaVcdCPtuj2BLJ6\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Martin 2-1/2In Fibroplank\",\"material\":\"Martin 2-1/2in FIBROPLANK\",\"absorption\":{\"63\":0,\"125\":0.15,\"250\":0.32,\"500\":0.78,\"1000\":0.85,\"2000\":0.73,\"4000\":0.88,\"8000\":0.88},\"nrc\":0.67,\"source\":\"Martin data\",\"description\":\"\",\"uuid\":\"nxvh6M5174VgoHTb\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg Frg Golden Pyramid Diffusers\",\"material\":\"RPG FRG Golden Pyramid diffusers, 2x2; mtg. E-400\",\"absorption\":{\"63\":0.1,\"125\":0.39,\"250\":0.19,\"500\":0.1,\"1000\":0.1,\"2000\":0.08,\"4000\":0.14,\"8000\":0.14},\"nrc\":0.12,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"nybOldeHL1Fpwbm8\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno A-Mounted Over 2\\\" Fiberglass Core\",\"material\":\"Kinetics Sereno A-Mounted over 2\\\" Fiberglass Core\",\"absorption\":{\"63\":0.07,\"125\":0.36,\"250\":0.89,\"500\":0.99,\"1000\":0.99,\"2000\":0.73,\"4000\":0.59,\"8000\":0.73},\"nrc\":0.9,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"o4AdqxZgamXinB1E\"},{\"tags\":[\"Soundblocks\",\"Soundblocks\"],\"manufacturer\":\"\",\"name\":\"Rpg Diffusor Block Painted\",\"material\":\"RPG Diffusor Block Painted\",\"absorption\":{\"63\":0.99,\"125\":0.77,\"250\":0.5,\"500\":0.58,\"1000\":0.35,\"2000\":0.25,\"4000\":0.26,\"8000\":0.27},\"nrc\":0.42,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"o6VAqKByuyrnXjsw\"},{\"tags\":[\"Ceilings\",\"Special Ceilings\"],\"manufacturer\":\"\",\"name\":\"1In Parallel Glass-Fiber Panels\",\"material\":\"1in Parallel glass-fiber panels, 18inwide, 18inapart, 12ina.s.\",\"absorption\":{\"63\":0,\"125\":0.07,\"250\":0.2,\"500\":0.4,\"1000\":0.52,\"2000\":0.6,\"4000\":0.67,\"8000\":0.67},\"nrc\":0.43,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"o7YLKmuoyGuOlmrP\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"1/8\\\" Glastrate Abuse-Resistant Face Over 1\\\" Owens-Corning 703 (Mounting #4)\",\"material\":\"1/8\\\" Glastrate abuse-resistant face over 1\\\" Owens-Corning 703 (mounting #4)\",\"absorption\":{\"63\":0.04,\"125\":0.06,\"250\":0.43,\"500\":0.95,\"1000\":0.98,\"2000\":0.94,\"4000\":0.94,\"8000\":0.94},\"nrc\":0.83,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"o8yG0Zs5xHsYTQtS\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics A.P./H.I.R2 Perf. Vinyl 1In\",\"material\":\"Decoustics a.p./h.i.r2 perf. vinyl 1in\",\"absorption\":{\"63\":0,\"125\":0.14,\"250\":0.34,\"500\":0.75,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.77,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"o9lAYLLwmdbvDD56\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Picado With 0.9Mm Micro-Perforations A-Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Picado with 0.9mm micro-perforations A-Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.04,\"125\":0.18,\"250\":0.54,\"500\":0.97,\"1000\":0.99,\"2000\":0.76,\"4000\":0.62,\"8000\":0.76},\"nrc\":0.82,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"o9wRzDljmD0jD3yo\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Omniffusor (Frg)\",\"material\":\"RPG Omniffusor (FRG), E-405 Mounting\",\"absorption\":{\"63\":0.9,\"125\":0.4,\"250\":0.2,\"500\":0.3,\"1000\":0.55,\"2000\":0.2,\"4000\":0.4,\"8000\":0.6},\"nrc\":0.31,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"oEqvpaqqOUDWuN0S\"},{\"tags\":[\"Ceilings\",\"Gypsum Board Ceilings\"],\"manufacturer\":\"\",\"name\":\"1/2In Gypsum Board Ceiling\",\"material\":\"1/2in Gypsum board ceiling\",\"absorption\":{\"63\":0.06,\"125\":0.12,\"250\":0.11,\"500\":0.05,\"1000\":0.06,\"2000\":0.04,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.07,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"oKHc152401gZeV5C\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Person\",\"material\":\"Person, adult (per person) est. Knudsen & Harris\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"oOpaUXNTw2EbRdhJ\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"1-1/2In Or 38Mm Fiberglass\",\"material\":\"1-1/2in or 38mm fiberglass, fabric or perf. vinyl\",\"absorption\":{\"63\":0.27,\"125\":0.75,\"250\":0.96,\"500\":0.89,\"1000\":0.99,\"2000\":0.99,\"4000\":0.98,\"8000\":0.98},\"nrc\":0.96,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"oUjalMhO8mOPiuDh\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1\\\" K-13 On Metal Lath With Solid Base\",\"material\":\"1\\\" K-13 on metal lath with solid base\",\"absorption\":{\"63\":0.2,\"125\":0.47,\"250\":0.9,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.97,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"oX6S5Z45fcpzYpOr\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Mbi Colorsonix 1800 Wall Panel 1-1/8\\\" Thick\",\"material\":\"MBI Colorsonix 1800 Wall Panel 1-1/8\\\" thick, Tack/impact\",\"absorption\":{\"63\":0.07,\"125\":0.1,\"250\":0.43,\"500\":0.92,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.83,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"oXMYQIRb3AaDGpFO\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13\",\"material\":\"K13, solid backing, 3/4in\",\"absorption\":{\"63\":0,\"125\":0.06,\"250\":0.19,\"500\":0.55,\"1000\":0.89,\"2000\":0.91,\"4000\":0.93,\"8000\":0.93},\"nrc\":0.64,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"oeeWF1h8oSM7DIkT\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"32Oz. Flat Double Layer\",\"material\":\"32oz. Flat double layer, 2\\\" separation, 10\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.31,\"125\":0.44,\"250\":0.63,\"500\":0.74,\"1000\":0.9,\"2000\":0.97,\"4000\":0.86,\"8000\":0.97},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ofMy8DMoO8RUW5AY\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Occupied\",\"material\":\"Occupied, heavily upholstered (Beranek 1998)\",\"absorption\":{\"63\":0.5,\"125\":0.72,\"250\":0.8,\"500\":0.86,\"1000\":0.89,\"2000\":0.9,\"4000\":0.9,\"8000\":0.9},\"nrc\":0.86,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"okD3eJasZ8ygsays\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Nylon Thin Pile On Wood Platform\",\"material\":\"Nylon thin pile on wood platform\",\"absorption\":{\"63\":0.11,\"125\":0.15,\"250\":0.15,\"500\":0.2,\"1000\":0.3,\"2000\":0.5,\"4000\":0.55,\"8000\":0.6},\"nrc\":0.29,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"olJYKV4P6COlMf4L\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundwood Acoustic Cladding\",\"material\":\"Soundwood acoustic cladding\",\"absorption\":{\"63\":0.03,\"125\":0.35,\"250\":0.65,\"500\":0.75,\"1000\":0.4,\"2000\":0.25,\"4000\":0.3,\"8000\":0.3},\"nrc\":0.51,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"on1vlnHXxYDubqEc\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Omniffusor (Frg) - A Mount With Fabric At 7\\\" From Face\",\"material\":\"RPG Omniffusor (FRG) - A mount with fabric at 7\\\" from face\",\"absorption\":{\"63\":0.11,\"125\":0.15,\"250\":0.19,\"500\":0.27,\"1000\":0.32,\"2000\":0.23,\"4000\":0.27,\"8000\":0.31},\"nrc\":0.25,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ot0IfjfG3KYMKJvX\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 703\",\"material\":\"1\\\" Owens Corning 703, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.23,\"125\":0.33,\"250\":0.28,\"500\":0.62,\"1000\":0.88,\"2000\":0.96,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"oyancSaH4puktbQS\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Minaboard Cortega  Tile (1 X 1 X 5/8\\\")\",\"material\":\"Armstrong Minaboard Cortega  Tile (1 x 1 x 5/8\\\"), Mount E-400\",\"absorption\":{\"63\":0.14,\"125\":0.27,\"250\":0.29,\"500\":0.48,\"1000\":0.71,\"2000\":0.75,\"4000\":0.74,\"8000\":0.75},\"nrc\":0.56,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"oz5qgpXNBxjx5MFa\"},{\"tags\":[\"Slit\",\"Slit Resonators\"],\"manufacturer\":\"\",\"name\":\"Slit Resonator - 40% Open Area \",\"material\":\"Slit Resonator - 40% Open Area , 2 in. insulation\",\"absorption\":{\"63\":0.12,\"125\":0.23,\"250\":0.8,\"500\":0.99,\"1000\":0.9,\"2000\":0.8,\"4000\":0.7,\"8000\":0.8},\"nrc\":0.87,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"p2FmqDdXsZx7sseY\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3\\\" Owens Corning 703\",\"material\":\"3\\\" Owens Corning 703, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.46,\"125\":0.66,\"250\":0.93,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.98,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"p2nvAESQM463Fb9x\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-4P, 50% Intermittent Mount\",\"absorption\":{\"63\":0.75,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.96,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"p3LyPcfrz1Ulv6aA\"},{\"tags\":[\"Wood\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"3/8\\\" - 1/2\\\" Wood Over 2\\\" - 4\\\" Airspace  From Beranek\",\"material\":\"3/8\\\" - 1/2\\\" Wood over 2\\\" - 4\\\" airspace  from Beranek\",\"absorption\":{\"63\":0.35,\"125\":0.3,\"250\":0.25,\"500\":0.2,\"1000\":0.17,\"2000\":0.15,\"4000\":0.1,\"8000\":0.15},\"nrc\":0.19,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"p635d6KJRd0Rc4gV\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Triffusor - Reflective Side\",\"material\":\"RPG Triffusor - Reflective Side\",\"absorption\":{\"63\":0.94,\"125\":0.4,\"250\":0.07,\"500\":0.23,\"1000\":0.21,\"2000\":0.17,\"4000\":0.17,\"8000\":0.17},\"nrc\":0.17,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"pAsJLjrPU6BIM3Ab\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Asc Tube Trap\",\"material\":\"ASC Tube Trap, 16\\\" Diameter x 2' L, Full-Round - sabines per tube \",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"pEhlBnrWlqpaM7FA\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone\",\"material\":\"USG Auratone, Fissured 562 5/8 2x4\",\"absorption\":{\"63\":0.15,\"125\":0.38,\"250\":0.3,\"500\":0.38,\"1000\":0.69,\"2000\":0.81,\"4000\":0.68,\"8000\":0.68},\"nrc\":0.55,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"pPhj0NZL2U0KySD3\"},{\"tags\":[\"Walls\",\"Block\"],\"manufacturer\":\"\",\"name\":\"Block Work\",\"material\":\"Block work, fair faced\",\"absorption\":{\"63\":0.05,\"125\":0.2,\"250\":0.3,\"500\":0.6,\"1000\":0.5,\"2000\":0.45,\"4000\":0.4,\"8000\":0.4},\"nrc\":0.46,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"pPtsikR3vo9fLzBE\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics A.P./ H.I.R2 Fabric 1In\",\"material\":\"Decoustics a.p./ h.i.r2 fabric 1in\",\"absorption\":{\"63\":0,\"125\":0.03,\"250\":0.37,\"500\":0.89,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.81,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"pQuOgOOi8UW72Erc\"},{\"tags\":[\"Walls\",\"Brick\"],\"manufacturer\":\"\",\"name\":\"Brick\",\"material\":\"Brick, painted\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.02,\"1000\":0.02,\"2000\":0.02,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.02,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"pVAEfWCkGiGo4AnU\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno 4/10 A-Mounted Over 2\\\" Fiberglass Core\",\"material\":\"Kinetics Sereno 4/10 A-Mounted over 2\\\" Fiberglass Core\",\"absorption\":{\"63\":0.09,\"125\":0.46,\"250\":0.99,\"500\":0.99,\"1000\":0.74,\"2000\":0.51,\"4000\":0.3,\"8000\":0.51},\"nrc\":0.81,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"phrG5ZHN7vn9vm9I\"},{\"tags\":[\"Environmental\",\"Environmental Materials\"],\"manufacturer\":\"\",\"name\":\"Water\",\"material\":\"Water\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.01,\"1000\":0.01,\"2000\":0.02,\"4000\":0.03,\"8000\":0.04},\"nrc\":0.01,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ptTu0lUboRBSS4pd\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Diffuse Signature Wood (3.5\\\" Standoff + R13 Faced Batting)\",\"material\":\"Diffuse Signature Wood (3.5\\\" Standoff + R13 Faced Batting)\",\"absorption\":{\"63\":0.6,\"125\":0.79,\"250\":0.81,\"500\":0.36,\"1000\":0.18,\"2000\":0.22,\"4000\":0.24,\"8000\":0.26},\"nrc\":0.39,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"puhffQLOmfwsYk5k\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Rockwool Or Fiberglass\",\"material\":\"Rockwool or fiberglass, 2\\\" thick over 1\\\" air space, solid backing\",\"absorption\":{\"63\":0.15,\"125\":0.35,\"250\":0.7,\"500\":0.9,\"1000\":0.9,\"2000\":0.95,\"4000\":0.9,\"8000\":0.95},\"nrc\":0.86,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"pulG6EI907MS2vCv\"},{\"tags\":[\"Glass\",\"Glass\"],\"manufacturer\":\"\",\"name\":\"Glass\",\"material\":\"Glass, 1/8\\\" \",\"absorption\":{\"63\":0.2,\"125\":0.1,\"250\":0.05,\"500\":0.04,\"1000\":0.03,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.04,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"q0LLopmkzvQN98ou\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass 3In: Type 703 + 1In Nubby Glass Cloth\",\"material\":\"Fiberglass 3in: Type 703 + 1in Nubby Glass Cloth\",\"absorption\":{\"63\":0,\"125\":0.5,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.97,\"8000\":0.97},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"q5xZXotJflOi6fNZ\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloud-Lite Weather Resistant (Eterior Use) 2'X4' 2\\\" Thick\",\"material\":\"MBI Cloud-Lite Weather Resistant (Eterior Use) 2'x4' 2\\\" thick, Perforated Cypress Fabric\",\"absorption\":{\"63\":0.2,\"125\":0.29,\"250\":0.73,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"q7Rniqgc89lltje4\"},{\"tags\":[\"Roofing\",\"Roofing Constructons\"],\"manufacturer\":\"\",\"name\":\"Metal Roof Deck\",\"material\":\"Metal Roof Deck\",\"absorption\":{\"63\":0.15,\"125\":0.1,\"250\":0.07,\"500\":0.04,\"1000\":0.02,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.04,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"q8Oe7VrNMEHT0MRZ\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Stage\",\"material\":\"Stage\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0.25,\"500\":0,\"1000\":0.75,\"2000\":0,\"4000\":0,\"8000\":0},\"nrc\":0.25,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"q9TV4222yKhCYpgZ\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Flat Double Layer\",\"material\":\"25oz. Flat double layer, 0\\\" separation, 12\\\" behind rear fabric, closed side edges\",\"absorption\":{\"63\":0.39,\"125\":0.55,\"250\":0.58,\"500\":0.54,\"1000\":0.73,\"2000\":0.82,\"4000\":0.85,\"8000\":0.88},\"nrc\":0.67,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"q9hYSLNeM5zUdV5K\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-4N, Intermittent Mount\",\"absorption\":{\"63\":0.66,\"125\":0.94,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"qEM9qCo2jEEWru8U\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Organ Pipes\",\"material\":\"Organ Pipes, In pipe case\",\"absorption\":{\"63\":0.18,\"125\":0.55,\"250\":0.35,\"500\":0.25,\"1000\":0.2,\"2000\":0.15,\"4000\":0.15,\"8000\":0.15},\"nrc\":0.24,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"qK0oTeEynKgYE4MP\"},{\"tags\":[\"Walls\",\"Plasterboard\"],\"manufacturer\":\"\",\"name\":\"Acoustic Plaster On Lath\",\"material\":\"Acoustic plaster on lath, big air space\",\"absorption\":{\"63\":0.1,\"125\":0.25,\"250\":0.2,\"500\":0.2,\"1000\":0.27,\"2000\":0.35,\"4000\":0.35,\"8000\":0.35},\"nrc\":0.26,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"qdgTj1qg9QZbZnv9\"},{\"tags\":[\"Soundblocks\",\"Soundblocks\"],\"manufacturer\":\"\",\"name\":\"Rpg Diffusor Block Unpainted\",\"material\":\"RPG Diffusor Block Unpainted\",\"absorption\":{\"63\":0.8,\"125\":0.98,\"250\":0.9,\"500\":0.92,\"1000\":0.78,\"2000\":0.8,\"4000\":0.78,\"8000\":0.8},\"nrc\":0.85,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"qfHhQAKGcxcLynWr\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Decoustics Lft Non-Perf Vinyl 2In\",\"material\":\"Decoustics LFT non-perf vinyl 2in\",\"absorption\":{\"63\":0,\"125\":0.35,\"250\":0.99,\"500\":0.76,\"1000\":0.24,\"2000\":0.07,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.52,\"source\":\"Decoustics data\",\"description\":\"\",\"uuid\":\"qolckC3ouYbEy8WW\"},{\"tags\":[\"Outdoors\",\"Grass\"],\"manufacturer\":\"\",\"name\":\"Grass\",\"material\":\"Grass, 2in High, outdoors, minimal dirt patches\",\"absorption\":{\"63\":0,\"125\":0.11,\"250\":0.26,\"500\":0.6,\"1000\":0.69,\"2000\":0.92,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.62,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"qweVO2uB5pOFG8t8\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 701\",\"material\":\"1\\\" Owens Corning 701, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.22,\"125\":0.32,\"250\":0.41,\"500\":0.7,\"1000\":0.83,\"2000\":0.93,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.72,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"qxbNLFIwXFXqaFig\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Mbi Colorsonix 1800 Wall Panel 2\\\" Thick\",\"material\":\"MBI Colorsonix 1800 Wall Panel 2\\\" thick, 6# density, Perforated Vinyl\",\"absorption\":{\"63\":0.32,\"125\":0.46,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"r7SZgzbKWTcedMTQ\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloudlite Baffles\",\"material\":\"MBI Cloudlite Baffles, 2600-1030 2 mil PVC\",\"absorption\":{\"63\":0.07,\"125\":0.31,\"250\":0.49,\"500\":0.84,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.83,\"source\":\"MBI\",\"description\":\"\",\"uuid\":\"rBBRxYt0UqlaFngj\"},{\"tags\":[\"Roofing\",\"Roofing Constructons\"],\"manufacturer\":\"\",\"name\":\"Wood T-N-G Roof Decking\",\"material\":\"Wood T-n-G roof decking\",\"absorption\":{\"63\":0.17,\"125\":0.24,\"250\":0.19,\"500\":0.14,\"1000\":0.08,\"2000\":0.13,\"4000\":0.1,\"8000\":0.13},\"nrc\":0.14,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"rDRmbZjgmMNQIeLM\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-2P, Continuous Mount\",\"absorption\":{\"63\":0.29,\"125\":0.41,\"250\":0.47,\"500\":0.64,\"1000\":0.79,\"2000\":0.85,\"4000\":0.72,\"8000\":0.85},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"rGqgntSSTQY1yfUH\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Grace Acoustikote On Lath Over Air Space\",\"material\":\"1/2\\\" Grace Acoustikote on lath over air space\",\"absorption\":{\"63\":0.39,\"125\":0.55,\"250\":0.51,\"500\":0.5,\"1000\":0.7,\"2000\":0.84,\"4000\":0.96,\"8000\":0.99},\"nrc\":0.64,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"rNbHGmiNr9OD7opI\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Profillia B (A.A.V. Ltd)\",\"material\":\"Profillia B (A.A.V. ltd)\",\"absorption\":{\"63\":0,\"125\":0.15,\"250\":0.5,\"500\":0.65,\"1000\":0.35,\"2000\":0.2,\"4000\":0.35,\"8000\":0.35},\"nrc\":0.43,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"re2j50IUwzbzcIv2\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"5/8\\\" Armstrong Acoustic Ceiling Spray\",\"material\":\"5/8\\\" Armstrong acoustic ceiling spray\",\"absorption\":{\"63\":0.4,\"125\":0.44,\"250\":0.46,\"500\":0.54,\"1000\":0.74,\"2000\":0.87,\"4000\":0.87,\"8000\":0.87},\"nrc\":0.65,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"rgG4mSuTFzoTswpe\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plywood\",\"material\":\"Plywood, 3/8in-1/2in /air\",\"absorption\":{\"63\":0.11,\"125\":0.28,\"250\":0.22,\"500\":0.17,\"1000\":0.09,\"2000\":0.1,\"4000\":0.11,\"8000\":0.11},\"nrc\":0.15,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"rhFUnadRAxTJgCU7\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Soundblox 12In Type R; Painted\",\"material\":\"Soundblox 12in Type R; painted\",\"absorption\":{\"63\":0.07,\"125\":0.48,\"250\":0.83,\"500\":0.86,\"1000\":0.54,\"2000\":0.47,\"4000\":0.44,\"8000\":0.44},\"nrc\":0.68,\"source\":\"Soundblox data\",\"description\":\"\",\"uuid\":\"rkJgNzyftZrrTrMl\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3\\\" Owens Corning 701\",\"material\":\"3\\\" Owens Corning 701, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.54,\"125\":0.77,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"rvfYBNgRHPaciRAm\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Martin 1In Fibroplank\",\"material\":\"Martin 1in FIBROPLANK\",\"absorption\":{\"63\":0,\"125\":0.03,\"250\":0.15,\"500\":0.21,\"1000\":0.35,\"2000\":0.82,\"4000\":0.58,\"8000\":0.58},\"nrc\":0.38,\"source\":\"Martin data\",\"description\":\"\",\"uuid\":\"ryZjdZ49kN1pbDdV\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Carpet On Pad On 2 Layers Of 3/4\\\" Plywood On 1\\\" Kinetics Isolators (A90-155)\",\"material\":\"Carpet on pad on 2 layers of 3/4\\\" plywood on 1\\\" Kinetics Isolators (A90-155)\",\"absorption\":{\"63\":0.23,\"125\":0.16,\"250\":0.26,\"500\":0.6,\"1000\":0.58,\"2000\":0.53,\"4000\":0.76,\"8000\":0.99},\"nrc\":0.49,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"s2uWrHkFWVh7anE5\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Small-Scale Diffusor\",\"material\":\"Small-Scale Diffusor, 1-1/6in, RPG inFlutter Freein\",\"absorption\":{\"63\":0.07,\"125\":0.19,\"250\":0.14,\"500\":0.1,\"1000\":0.15,\"2000\":0.18,\"4000\":0.2,\"8000\":0.2},\"nrc\":0.14,\"source\":\"RPG tests\",\"description\":\"\",\"uuid\":\"s6NPVEUngzjDHlUG\"},{\"tags\":[\"Ceiling\",\" Ceiling Systems\"],\"manufacturer\":\"\",\"name\":\"Dampa Linar 100 Ceiling System\",\"material\":\"Dampa Linar 100 Ceiling System\",\"absorption\":{\"63\":0.34,\"125\":0.48,\"250\":0.67,\"500\":0.69,\"1000\":0.61,\"2000\":0.46,\"4000\":0.49,\"8000\":0.52},\"nrc\":0.61,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"s9OvPvd4RDogxQn7\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Flat Double Layer\",\"material\":\"25oz. Flat double layer, 2\\\" separation, 10\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.29,\"125\":0.42,\"250\":0.54,\"500\":0.73,\"1000\":0.87,\"2000\":0.9,\"4000\":0.88,\"8000\":0.9},\"nrc\":0.76,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"sGnq8L1TFpD6iYsS\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mci Lapendary Banners #115 4\\\" Thick\",\"material\":\"MCI Lapendary Banners #115 4\\\" thick, Perforated PVC\",\"absorption\":{\"63\":0.92,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"sMAtJlomkJxlQHlL\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Omniffusor (Frg) - A Mount With Fabric At 2\\\" From Face\",\"material\":\"RPG Omniffusor (FRG) - A mount with fabric at 2\\\" from face\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.15,\"500\":0.26,\"1000\":0.32,\"2000\":0.23,\"4000\":0.27,\"8000\":0.31},\"nrc\":0.24,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"sVMuDRM6aiQ3PCvz\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Slotted Concrete Block \",\"material\":\"Slotted concrete block , 4in, Empty void\",\"absorption\":{\"63\":0,\"125\":0.12,\"250\":0.85,\"500\":0.36,\"1000\":0.36,\"2000\":0.42,\"4000\":0.35,\"8000\":0.35},\"nrc\":0.5,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"skz9jA72jEmGoeWU\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg 734-Qrd Diffusor (Wood\",\"material\":\"RPG 734-QRD Diffusor (wood, Melamine)\",\"absorption\":{\"63\":0.11,\"125\":0.23,\"250\":0.24,\"500\":0.35,\"1000\":0.23,\"2000\":0.2,\"4000\":0.2,\"8000\":0.2},\"nrc\":0.26,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"slA0wbz0bfsCuelg\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Picado With 0.9Mm Micro-Perforations A-Mounted Over 2\\\" Fiberglass Core\",\"material\":\"Kinetics Picado with 0.9mm micro-perforations A-Mounted over 2\\\" Fiberglass Core\",\"absorption\":{\"63\":0.15,\"125\":0.41,\"250\":0.99,\"500\":0.99,\"1000\":0.91,\"2000\":0.79,\"4000\":0.64,\"8000\":0.79},\"nrc\":0.92,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"stFPvVlgMchuaYXS\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fiberglass 4In Type 703\",\"material\":\"Fiberglass 4in Type 703, unfaced\",\"absorption\":{\"63\":0.34,\"125\":0.84,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.97,\"8000\":0.97},\"nrc\":0.99,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"suDJvWquZ7GiKhen\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Painted Nubby Open Plan (foil) 2x2 x 1in\",\"absorption\":{\"63\":0.19,\"125\":0.4,\"250\":0.42,\"500\":0.94,\"1000\":0.97,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.83,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"swb7uWrpREdP1nLv\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 705\",\"material\":\"1\\\" Owens Corning 705, ASJ faced, Mounting A\",\"absorption\":{\"63\":0.14,\"125\":0.2,\"250\":0.64,\"500\":0.33,\"1000\":0.56,\"2000\":0.54,\"4000\":0.33,\"8000\":0.54},\"nrc\":0.52,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"szA5VFT02vhzZ7Al\"},{\"tags\":[\"Floors\",\"Linoleum\"],\"manufacturer\":\"\",\"name\":\"Linoleum Tiles\",\"material\":\"Linoleum Tiles, 1/8in, adhered to concrete\",\"absorption\":{\"63\":0.02,\"125\":0.04,\"250\":0.03,\"500\":0.03,\"1000\":0.03,\"2000\":0.03,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.03,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"t1ZBcnKNk8IQqXzg\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Wood Floor On Kinetics Floating Wood Floor\",\"material\":\"1/2\\\" wood floor on Kinetics floating wood floor\",\"absorption\":{\"63\":0.05,\"125\":0.07,\"250\":0.09,\"500\":0.12,\"1000\":0.08,\"2000\":0.06,\"4000\":0.08,\"8000\":0.1},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"t73pPc8pbanjfbFi\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Orchestral Player With Instrument (Per Player) Est. Parkin/Humphrey Too High\",\"material\":\"Orchestral player with instrument (per player) est. Parkin/Humphrey TOO HIGH\",\"absorption\":{\"63\":0.99,\"125\":0.99,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"t91uoAaLrZqKi8hU\"},{\"tags\":[\"Proscenium\",\"Proscenium & Balcony Openings\"],\"manufacturer\":\"\",\"name\":\"Balcony Opening D/H=3.0\",\"material\":\"Balcony Opening D/H=3.0\",\"absorption\":{\"63\":0.3,\"125\":0.4,\"250\":0.53,\"500\":0.65,\"1000\":0.7,\"2000\":0.75,\"4000\":0.8,\"8000\":0.85},\"nrc\":0.66,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tFCh90dZml4marPg\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3\\\" Owens Corning 705\",\"material\":\"3\\\" Owens Corning 705, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.34,\"125\":0.49,\"250\":0.93,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.98,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tNVDByKiFaavZn6a\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 705\",\"material\":\"1\\\" Owens Corning 705, FRK faced, Mounting A\",\"absorption\":{\"63\":0.19,\"125\":0.27,\"250\":0.66,\"500\":0.33,\"1000\":0.66,\"2000\":0.51,\"4000\":0.41,\"8000\":0.51},\"nrc\":0.54,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tP71y65lsHlszOd6\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - Robertson Adc 3.0 20/18\",\"material\":\"Cellular metal deck - Robertson ADC 3.0 20/18, 1/8\\\" perforations, 2\\\" 711 insulation\",\"absorption\":{\"63\":0.2,\"125\":0.46,\"250\":0.93,\"500\":0.99,\"1000\":0.82,\"2000\":0.7,\"4000\":0.54,\"8000\":0.7},\"nrc\":0.86,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tSsk73eN3LtrulBm\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone Firecode\",\"material\":\"USG Acoustone Firecode, 3/4in, 2x2 panels, Glacier 715\",\"absorption\":{\"63\":0.15,\"125\":0.45,\"250\":0.29,\"500\":0.6,\"1000\":0.96,\"2000\":0.93,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.7,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"tTTrxyE3IFNFNH16\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Wooden Platform With Air Space Below  From Beranek\",\"material\":\"Wooden Platform with air space below  from Beranek\",\"absorption\":{\"63\":0.5,\"125\":0.4,\"250\":0.3,\"500\":0.2,\"1000\":0.17,\"2000\":0.15,\"4000\":0.1,\"8000\":0.15},\"nrc\":0.21,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tVHTO4jzxcPetIfy\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"4\\\" Owens Corning 705\",\"material\":\"4\\\" Owens Corning 705, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.4,\"125\":0.57,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.94,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.98,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tVz1FADkAyXysEMA\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 701\",\"material\":\"1\\\" Owens Corning 701, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.27,\"125\":0.38,\"250\":0.34,\"500\":0.68,\"1000\":0.82,\"2000\":0.87,\"4000\":0.96,\"8000\":0.99},\"nrc\":0.68,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tZ9GScBOPv55gDIu\"},{\"tags\":[\"Floors\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Floor (T&G)\",\"material\":\"Wood Floor (t&g), 3/4in, adhered to concrete\",\"absorption\":{\"63\":0.04,\"125\":0.1,\"250\":0.08,\"500\":0.07,\"1000\":0.06,\"2000\":0.06,\"4000\":0.06,\"8000\":0.06},\"nrc\":0.07,\"source\":\"Beranek (JASA '98)\",\"description\":\"\",\"uuid\":\"tgAuQn0hDpqVJqwQ\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Diffuse Signature Wood (1\\\" Standoff Sides Open)\",\"material\":\"Diffuse Signature Wood (1\\\" Standoff Sides Open)\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0.02,\"500\":0.06,\"1000\":0.16,\"2000\":0.13,\"4000\":0.15,\"8000\":0.17},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tgGAnP5OCLWlPFF4\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13\",\"material\":\"K13, solid backing, 1in\",\"absorption\":{\"63\":0,\"125\":0.08,\"250\":0.29,\"500\":0.79,\"1000\":0.98,\"2000\":0.93,\"4000\":0.96,\"8000\":0.96},\"nrc\":0.75,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"tgXJpAzA13lVgSVB\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1 layer 5/8in on studs 16inoc w/batt\",\"absorption\":{\"63\":0.07,\"125\":0.55,\"250\":0.14,\"500\":0.08,\"1000\":0.04,\"2000\":0.12,\"4000\":0.11,\"8000\":0.11},\"nrc\":0.1,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"th2PuWU5EhCsaon3\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Thick\",\"material\":\"Thick, fibrous material behind open facing\",\"absorption\":{\"63\":0.23,\"125\":0.6,\"250\":0.75,\"500\":0.82,\"1000\":0.8,\"2000\":0.6,\"4000\":0.75,\"8000\":0.75},\"nrc\":0.74,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"tk3IOnMAt56qbroK\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg Diffusorblox\",\"material\":\"RPG DiffusorBlox, unpainted\",\"absorption\":{\"63\":0.45,\"125\":0.98,\"250\":0.9,\"500\":0.92,\"1000\":0.77,\"2000\":0.8,\"4000\":0.77,\"8000\":0.77},\"nrc\":0.85,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"tl9z13o5lqo4f9iZ\"},{\"tags\":[\"Outdoors\",\"Trees\"],\"manufacturer\":\"\",\"name\":\"Trees\",\"material\":\"Trees, balsam firs, 20sq.ft area per tree, 8 high\",\"absorption\":{\"63\":0,\"125\":0.03,\"250\":0.06,\"500\":0.11,\"1000\":0.17,\"2000\":0.27,\"4000\":0.31,\"8000\":0.31},\"nrc\":0.15,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"tpMBHwBs6lgIk5JP\"},{\"tags\":[\"People\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Desks/Cabinets Each\",\"material\":\"Desks/cabinets each\",\"absorption\":{\"63\":0.08,\"125\":0.2,\"250\":0.15,\"500\":0.1,\"1000\":0.08,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.1,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"tuNWLwwmuXbAYppW\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"Sonosorber - 12\\\" Diameter By 24\\\" Length\",\"material\":\"Sonosorber - 12\\\" diameter by 24\\\" length, 7.9 sq. ft. per item\",\"absorption\":{\"63\":0.2,\"125\":0.37,\"250\":0.66,\"500\":0.82,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.87,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tyPx6VjN9VnHKWsL\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 703\",\"material\":\"2\\\" Owens Corning 703, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.28,\"125\":0.4,\"250\":0.73,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"tyoCgFVDU51I6RJ8\"},{\"tags\":[\"Walls\",\"Mineral wool\"],\"manufacturer\":\"\",\"name\":\"50Mm Mineral Wool + 10% Perforated Hardboard\",\"material\":\"50mm mineral wool + 10% perforated hardboard\",\"absorption\":{\"63\":0.2,\"125\":0.45,\"250\":0.4,\"500\":0.8,\"1000\":0.8,\"2000\":0.75,\"4000\":0.4,\"8000\":0.4},\"nrc\":0.69,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"tz9FFAQUqHNSZuI9\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Flat Double Layer\",\"material\":\"25oz. Flat double layer, 0\\\" separation, 8\\\" behind rear fabric, open side edges\",\"absorption\":{\"63\":0.19,\"125\":0.27,\"250\":0.57,\"500\":0.7,\"1000\":0.8,\"2000\":0.91,\"4000\":0.93,\"8000\":0.95},\"nrc\":0.75,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"u10DLGmHXTWcusY7\"},{\"tags\":[\"Drapes\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloudlite Baffles\",\"material\":\"MBI Cloudlite Baffles, 2800-HL Fabric\",\"absorption\":{\"63\":0,\"125\":0.29,\"250\":0.74,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"MBI\",\"description\":\"\",\"uuid\":\"u9gKCPbr9KsEiPRl\"},{\"tags\":[\"Environmental\",\"Environmental Materials\"],\"manufacturer\":\"\",\"name\":\"Sand\",\"material\":\"Sand\",\"absorption\":{\"63\":0.1,\"125\":0.15,\"250\":0.35,\"500\":0.4,\"1000\":0.5,\"2000\":0.55,\"4000\":0.8,\"8000\":0.99},\"nrc\":0.45,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"u9xV7rXf94aUxU2U\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - 1.5\\\"\",\"material\":\"Cellular Metal Deck - 1.5\\\"\",\"absorption\":{\"63\":0.3,\"125\":0.5,\"250\":0.35,\"500\":0.55,\"1000\":0.8,\"2000\":0.85,\"4000\":0.6,\"8000\":0.85},\"nrc\":0.64,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"uIIVOlbKVEX6U1u4\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1+1 @ 1/2in on ins. 3-5/8in studs\",\"absorption\":{\"63\":0.03,\"125\":0.16,\"250\":0.07,\"500\":0.04,\"1000\":0.04,\"2000\":0.03,\"4000\":0.03,\"8000\":0.03},\"nrc\":0.05,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"uM5hOmMHxOMSpbBP\"},{\"tags\":[\"Carpets\",\"Carpets\"],\"manufacturer\":\"\",\"name\":\"Turkey (Shag) Carpet\",\"material\":\"Turkey (shag) carpet, thick pile\",\"absorption\":{\"63\":0.02,\"125\":0.05,\"250\":0.1,\"500\":0.25,\"1000\":0.5,\"2000\":0.65,\"4000\":0.7,\"8000\":0.75},\"nrc\":0.38,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"uYeIIxdARr3unOfl\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 4' Type I Wall Diffuser\",\"material\":\"Wenger 4' x 4' Type I Wall Diffuser, Convex (A)\",\"absorption\":{\"63\":0.13,\"125\":0.18,\"250\":0.18,\"500\":0.13,\"1000\":0.1,\"2000\":0.12,\"4000\":0.16,\"8000\":0.2},\"nrc\":0.13,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"uc119iRUaRChCISt\"},{\"tags\":[\"Rubber\",\"Rubber\"],\"manufacturer\":\"\",\"name\":\"Soft Sheet Rubber\",\"material\":\"Soft sheet rubber\",\"absorption\":{\"63\":0.01,\"125\":0.03,\"250\":0.05,\"500\":0.1,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"udM5vOPCqNFrybZ3\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1\\\" Cafco Soundcote On Solid Base\",\"material\":\"1\\\" Cafco SoundCote on solid base\",\"absorption\":{\"63\":0.1,\"125\":0.22,\"250\":0.39,\"500\":0.84,\"1000\":0.99,\"2000\":0.85,\"4000\":0.82,\"8000\":0.85},\"nrc\":0.77,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"udN99fQTQKWRxg5G\"},{\"tags\":[\"Floorings\",\"Floorings\"],\"manufacturer\":\"\",\"name\":\"Wood\",\"material\":\"Wood, parquet in asphalt over concrete  from AIMA\",\"absorption\":{\"63\":0.02,\"125\":0.04,\"250\":0.04,\"500\":0.07,\"1000\":0.06,\"2000\":0.06,\"4000\":0.07,\"8000\":0.08},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"uhpvkIWccx3JIJ4o\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Perdue Fabric And Rockwool 2\\\" Panel\",\"material\":\"Perdue Fabric and Rockwool 2\\\" Panel\",\"absorption\":{\"63\":0.32,\"125\":0.46,\"250\":0.93,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.98,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"uj7nbzzyTw9ZRiI0\"},{\"tags\":[\"Tectum\",\"Tectum\"],\"manufacturer\":\"\",\"name\":\"2\\\" Tectum Mounting #2 (1\\\" X 3\\\" Battens\",\"material\":\"2\\\" Tectum mounting #2 (1\\\" x 3\\\" battens, 24\\\" center, over solid backing)\",\"absorption\":{\"63\":0.07,\"125\":0.15,\"250\":0.36,\"500\":0.74,\"1000\":0.82,\"2000\":0.82,\"4000\":0.92,\"8000\":0.99},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"uqBUjhKvUYU7KvUe\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Insonexin Style Foam\",\"material\":\"inSonexin style foam, 3in, 3in at tip of wedges\",\"absorption\":{\"63\":0,\"125\":0.14,\"250\":0.43,\"500\":0.98,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.85,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"uqeTYsLh6ZQeWPpR\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster On Concrete Block\",\"material\":\"Plaster on concrete block, or 1in thick on lath\",\"absorption\":{\"63\":0.05,\"125\":0.12,\"250\":0.09,\"500\":0.07,\"1000\":0.05,\"2000\":0.05,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.07,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"uuWxra9N1KJoG9Vl\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"Fiberglass Curtain 1/2\\\" 14\\\" From Wall Land Fabric @Chicago Mad\",\"material\":\"Fiberglass Curtain 1/2\\\" 14\\\" from wall Land Fabric @Chicago MAD\",\"absorption\":{\"63\":0.28,\"125\":0.46,\"250\":0.75,\"500\":0.73,\"1000\":0.94,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.85,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"uyjmDyB84rgjlVuV\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Almute (2.5Mm Thick) With 100Mm (4\\\") Airspace\",\"material\":\"Almute (2.5mm thick) with 100mm (4\\\") airspace\",\"absorption\":{\"63\":0.25,\"125\":0.35,\"250\":0.72,\"500\":0.91,\"1000\":0.78,\"2000\":0.61,\"4000\":0.77,\"8000\":0.93},\"nrc\":0.76,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"v33APQxnpDs94NP6\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Optima Open Plan (foil) 2x4 x1in\",\"absorption\":{\"63\":0.15,\"125\":0.4,\"250\":0.5,\"500\":0.95,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.86,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"v4qgsyn9sMQI5xLS\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 1/2in on 2x4studs, 16inoc\",\"absorption\":{\"63\":0.05,\"125\":0.29,\"250\":0.1,\"500\":0.05,\"1000\":0.04,\"2000\":0.07,\"4000\":0.09,\"8000\":0.09},\"nrc\":0.07,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"v6JRm7482Btjs5cF\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone Panel With 2\\\" Fiberglass\",\"material\":\"IAC Varitone Panel with 2\\\" Fiberglass\",\"absorption\":{\"63\":0.17,\"125\":0.57,\"250\":0.86,\"500\":0.99,\"1000\":0.99,\"2000\":0.94,\"4000\":0.82,\"8000\":0.94},\"nrc\":0.95,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"vEvRx1bCXDNgji9G\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13\",\"material\":\"K13, solid backing, 1.5in\",\"absorption\":{\"63\":0,\"125\":0.15,\"250\":0.51,\"500\":0.95,\"1000\":0.99,\"2000\":0.99,\"4000\":0.98,\"8000\":0.98},\"nrc\":0.86,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"vGL2EsjChRolXryn\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone Firecode Panels\",\"material\":\"USG Auratone Firecode panels, Fissured 586 5/8 2x4\",\"absorption\":{\"63\":0.14,\"125\":0.36,\"250\":0.28,\"500\":0.57,\"1000\":0.83,\"2000\":0.64,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.58,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"vUVq8ANnWrb5kNKR\"},{\"tags\":[\"Ceilings\",\"Metal Roof Decks\"],\"manufacturer\":\"\",\"name\":\"Epic Perf Metal Roof Er2Ra 2In Perf. Steel Deck\",\"material\":\"EPIC perf metal roof ER2RA 2in perf. steel deck, 1-pc.\",\"absorption\":{\"63\":0,\"125\":0.26,\"250\":0.6,\"500\":0.99,\"1000\":0.98,\"2000\":0.99,\"4000\":0.91,\"8000\":0.91},\"nrc\":0.89,\"source\":\"Epic data\",\"description\":\"\",\"uuid\":\"vUbnoTSupXW1li5T\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Painted Nubby Open Plan (foil) 2x4 x1.5in\",\"absorption\":{\"63\":0.07,\"125\":0.48,\"250\":0.82,\"500\":0.9,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"vXMX5W3hZJdAynQQ\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone 2In Thick\",\"material\":\"IAC Varitone 2in thick, Polymer & Spacer\",\"absorption\":{\"63\":0.15,\"125\":0.39,\"250\":0.48,\"500\":0.71,\"1000\":0.99,\"2000\":0.93,\"4000\":0.77,\"8000\":0.77},\"nrc\":0.78,\"source\":\"IAC data\",\"description\":\"\",\"uuid\":\"vl9A9Cg7EnzBIJ98\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood\",\"material\":\"Wood, 1/2in paneling, perf to 11%, on 2.5in glass fiber\",\"absorption\":{\"63\":0,\"125\":0.4,\"250\":0.9,\"500\":0.8,\"1000\":0.5,\"2000\":0.4,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.65,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"vn6bcDwQg4RrpBRk\"},{\"tags\":[\"Ceilings\",\"Special Ceilings\"],\"manufacturer\":\"\",\"name\":\"Wood Roof Deck\",\"material\":\"Wood Roof Deck\",\"absorption\":{\"63\":0.1,\"125\":0.24,\"250\":0.19,\"500\":0.14,\"1000\":0.08,\"2000\":0.13,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.14,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"vssUaPutMXuE5B1S\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Radar High-Nrc 3178 3/4 2X4\",\"material\":\"USG Radar High-NRC 3178 3/4 2x4\",\"absorption\":{\"63\":0.24,\"125\":0.5,\"250\":0.47,\"500\":0.62,\"1000\":0.93,\"2000\":0.74,\"4000\":0.81,\"8000\":0.81},\"nrc\":0.69,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"vzyOcupTJsduN9YY\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 4' Type I Wall Diffuser\",\"material\":\"Wenger 4' x 4' Type I Wall Diffuser, Pyramidal (A)\",\"absorption\":{\"63\":0.16,\"125\":0.23,\"250\":0.18,\"500\":0.13,\"1000\":0.12,\"2000\":0.14,\"4000\":0.11,\"8000\":0.14},\"nrc\":0.14,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"w4owCviniQktaD8J\"},{\"tags\":[\"Walls\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"Wood Panels (Solid)\",\"material\":\"Wood Panels (solid), 1in, over air space (+/- 3in)\",\"absorption\":{\"63\":0.07,\"125\":0.19,\"250\":0.14,\"500\":0.09,\"1000\":0.06,\"2000\":0.06,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.09,\"source\":\"Beranek (C&OH '96)\",\"description\":\"\",\"uuid\":\"w5vYKa5QcpbHEoUX\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Mbi Cloud-Lite Baffels 2600-1030 (2'X4'\",\"material\":\"MBI Cloud-Lite Baffels 2600-1030 (2'x4', 1\\\" thick, 3# density) 2 Mil PVC\",\"absorption\":{\"63\":0.22,\"125\":0.31,\"250\":0.49,\"500\":0.84,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.83,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"w6l7WMFvrrF5wr7e\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Insonexin Style Foam\",\"material\":\"inSonexin style foam, 2in, 2in at tip of wedges\",\"absorption\":{\"63\":0,\"125\":0.08,\"250\":0.25,\"500\":0.61,\"1000\":0.92,\"2000\":0.95,\"4000\":0.92,\"8000\":0.92},\"nrc\":0.68,\"source\":\"Cavanaugh (AA '99)\",\"description\":\"\",\"uuid\":\"wLPb4CsTZuqsCyli\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Tectum Fabritough Panels\",\"material\":\"Tectum FabriTough panels, Mtg. C-40, insulation\",\"absorption\":{\"63\":0,\"125\":0.3,\"250\":0.77,\"500\":0.99,\"1000\":0.98,\"2000\":0.79,\"4000\":0.95,\"8000\":0.95},\"nrc\":0.88,\"source\":\"Tectum data\",\"description\":\"\",\"uuid\":\"wRqTsaHbhxijIUU4\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Acoustone 701 Glacier 3/4 1X1\",\"material\":\"USG Acoustone 701 Glacier 3/4 1x1\",\"absorption\":{\"63\":0.26,\"125\":0.57,\"250\":0.51,\"500\":0.49,\"1000\":0.77,\"2000\":0.85,\"4000\":0.82,\"8000\":0.82},\"nrc\":0.66,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"wSmtUks7UGxkJZBb\"},{\"tags\":[\"Metal\",\" Metal Panels\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Wall Panels\",\"material\":\"IAC Noise-Foil Wall Panels, Type NF-2PS, Intermittent Mount\",\"absorption\":{\"63\":0.34,\"125\":0.49,\"250\":0.51,\"500\":0.72,\"1000\":0.99,\"2000\":0.96,\"4000\":0.87,\"8000\":0.96},\"nrc\":0.8,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"wVpLmyPm0lRl1KYa\"},{\"tags\":[\"Proscenium\",\"Proscenium & Balcony Openings\"],\"manufacturer\":\"\",\"name\":\"Balcony Opening D/H=2.5\",\"material\":\"Balcony Opening D/H=2.5\",\"absorption\":{\"63\":0.2,\"125\":0.3,\"250\":0.4,\"500\":0.5,\"1000\":0.55,\"2000\":0.6,\"4000\":0.65,\"8000\":0.7},\"nrc\":0.51,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"wfKpscSfxQMfjhSe\"},{\"tags\":[\"Walls\",\"Concrete Block\"],\"manufacturer\":\"\",\"name\":\"Concrete Block\",\"material\":\"Concrete block, course\",\"absorption\":{\"63\":0.14,\"125\":0.36,\"250\":0.44,\"500\":0.31,\"1000\":0.29,\"2000\":0.39,\"4000\":0.35,\"8000\":0.35},\"nrc\":0.36,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"wgJ6AP35vb6mH7UD\"},{\"tags\":[\"People\",\"Non-upholstered\"],\"manufacturer\":\"\",\"name\":\"Non-Upholstered Seats\",\"material\":\"Non-upholstered Seats, occupied\",\"absorption\":{\"63\":0.27,\"125\":0.57,\"250\":0.61,\"500\":0.75,\"1000\":0.86,\"2000\":0.91,\"4000\":0.86,\"8000\":0.86},\"nrc\":0.78,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"whk2Al3iag7oUuy4\"},{\"tags\":[\"Walls\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Fabric Wrapped Fg Panel\",\"material\":\"Fabric Wrapped FG Panel, 1in, over 400mm air space\",\"absorption\":{\"63\":0.19,\"125\":0.67,\"250\":0.97,\"500\":0.76,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.93,\"source\":\"Decoustics Tests\",\"description\":\"\",\"uuid\":\"wjEi7QJs5v6U8RVn\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"3\\\" Owens Corning 701\",\"material\":\"3\\\" Owens Corning 701, plain faced, Mounting Mod. 7\",\"absorption\":{\"63\":0.37,\"125\":0.53,\"250\":0.96,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.98,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"wkKMliucLycK29SG\"},{\"tags\":[\"Floors\",\"Carpet\"],\"manufacturer\":\"\",\"name\":\"Carpet\",\"material\":\"Carpet, heavy, on concrete\",\"absorption\":{\"63\":0.02,\"125\":0.05,\"250\":0.06,\"500\":0.14,\"1000\":0.37,\"2000\":0.6,\"4000\":0.65,\"8000\":0.65},\"nrc\":0.29,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"woKyDR0mWLAoHVTF\"},{\"tags\":[\"Metal\",\" Metal Deck\"],\"manufacturer\":\"\",\"name\":\"Cellular Metal Deck - Robertson Adc 3.0 20/18\",\"material\":\"Cellular metal deck - Robertson ADC 3.0 20/18, 1/8\\\" perforations, no insulation\",\"absorption\":{\"63\":0.1,\"125\":0.2,\"250\":0.47,\"500\":0.42,\"1000\":0.27,\"2000\":0.2,\"4000\":0.15,\"8000\":0.2},\"nrc\":0.34,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"wtFYSHncSDJoXcEI\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Plaster On Lath\",\"material\":\"Plaster on lath, large air space\",\"absorption\":{\"63\":0.08,\"125\":0.2,\"250\":0.15,\"500\":0.1,\"1000\":0.06,\"2000\":0.04,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.09,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"wwwMHnhvZjOIDtkm\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Acoustical Membrane - Fabrasorb Ii (Birdair)\",\"material\":\"Acoustical Membrane - Fabrasorb II (Birdair)\",\"absorption\":{\"63\":0.49,\"125\":0.7,\"250\":0.8,\"500\":0.5,\"1000\":0.62,\"2000\":0.7,\"4000\":0.7,\"8000\":0.7},\"nrc\":0.66,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"x5xZ9EhJ88vMuIyU\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"6.25\\\" Owens Corning R-19\",\"material\":\"6.25\\\" Owens Corning R-19, plain faced, Mounting E-405\",\"absorption\":{\"63\":0.6,\"125\":0.86,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"x603iHpnWQGcnYXG\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone\",\"material\":\"USG Auratone, Aspen 650 3/4 2x2\",\"absorption\":{\"63\":0.16,\"125\":0.41,\"250\":0.32,\"500\":0.51,\"1000\":0.75,\"2000\":0.62,\"4000\":0.66,\"8000\":0.66},\"nrc\":0.55,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"xDMzpn2vYWYjPvvB\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"1\\\" Owens Corning 703\",\"material\":\"1\\\" Owens Corning 703, ASJ faced, Mounting A\",\"absorption\":{\"63\":0.12,\"125\":0.17,\"250\":0.71,\"500\":0.59,\"1000\":0.68,\"2000\":0.54,\"4000\":0.3,\"8000\":0.54},\"nrc\":0.63,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"xDeFhdZkBm1b6pAo\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Picado With 0.5Mm Micro-Perforations A-Mounted Over 1\\\" Fiberglass Core\",\"material\":\"Kinetics Picado with 0.5mm micro-perforations A-Mounted over 1\\\" Fiberglass Core\",\"absorption\":{\"63\":0.09,\"125\":0.19,\"250\":0.55,\"500\":0.99,\"1000\":0.99,\"2000\":0.73,\"4000\":0.54,\"8000\":0.73},\"nrc\":0.82,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"xGqBpWXgEHAXyqM6\"},{\"tags\":[\"People\",\"Pews\"],\"manufacturer\":\"\",\"name\":\"Pews; Wood; Filled\",\"material\":\"Pews; wood; filled\",\"absorption\":{\"63\":0.27,\"125\":0.57,\"250\":0.61,\"500\":0.75,\"1000\":0.86,\"2000\":0.91,\"4000\":0.86,\"8000\":0.86},\"nrc\":0.78,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"xIQBTlRZDSim7R6a\"},{\"tags\":[\"Soundblocks\",\"Soundblocks\"],\"manufacturer\":\"\",\"name\":\"Proudfoot 'Soundblox' \",\"material\":\"Proudfoot 'Soundblox' , 8 -in., Type RSR Unpainted\",\"absorption\":{\"63\":0.55,\"125\":0.61,\"250\":0.81,\"500\":0.57,\"1000\":0.55,\"2000\":0.66,\"4000\":0.64,\"8000\":0.66},\"nrc\":0.65,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"xLoWx0qC156oiYl5\"},{\"tags\":[\"Walls\",\"Various\"],\"manufacturer\":\"\",\"name\":\"Iac Varitone 3In Thick\",\"material\":\"IAC Varitone 3in thick, polymer facing\",\"absorption\":{\"63\":0.39,\"125\":0.89,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.96,\"8000\":0.96},\"nrc\":0.99,\"source\":\"IAC data\",\"description\":\"\",\"uuid\":\"xZDRMmaEN7eY1krL\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Tad 2-1/8\\\" Thick\",\"material\":\"Kinetics TAD 2-1/8\\\" Thick\",\"absorption\":{\"63\":0.35,\"125\":0.5,\"250\":0.93,\"500\":0.99,\"1000\":0.87,\"2000\":0.59,\"4000\":0.46,\"8000\":0.59},\"nrc\":0.85,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"xZPusmeRd8uD8ePT\"},{\"tags\":[\"People\",\"Pews\"],\"manufacturer\":\"\",\"name\":\"Pews; Wood; Empty\",\"material\":\"Pews; wood; empty\",\"absorption\":{\"63\":0.05,\"125\":0.1,\"250\":0.1,\"500\":0.09,\"1000\":0.08,\"2000\":0.08,\"4000\":0.08,\"8000\":0.08},\"nrc\":0.09,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"xivZRc3bpbX3kdIF\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"3 Layers 1/2\\\" Gypsum Bd. On Metal Studs (Est.)\",\"material\":\"3 layers 1/2\\\" gypsum bd. on metal studs (est.)\",\"absorption\":{\"63\":0.19,\"125\":0.15,\"250\":0.12,\"500\":0.1,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.08,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"xkWJW92TDedJxp9k\"},{\"tags\":[\"Slit\",\"Slit Resonators\"],\"manufacturer\":\"\",\"name\":\"Slit Resonator - 40% Open Area \",\"material\":\"Slit Resonator - 40% Open Area , 1 in. insulation\",\"absorption\":{\"63\":0.03,\"125\":0.12,\"250\":0.25,\"500\":0.99,\"1000\":0.9,\"2000\":0.8,\"4000\":0.7,\"8000\":0.8},\"nrc\":0.74,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"xlf01qbcjh7zkgFR\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 2 layers 5/8in on studs 16inoc w/batt\",\"absorption\":{\"63\":0.06,\"125\":0.28,\"250\":0.12,\"500\":0.1,\"1000\":0.07,\"2000\":0.13,\"4000\":0.09,\"8000\":0.09},\"nrc\":0.11,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"xmzQfq6zBKEec4TS\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 0.33H Spacing, Type NF-2P\",\"absorption\":{\"63\":0.11,\"125\":0.15,\"250\":0.3,\"500\":0.3,\"1000\":0.3,\"2000\":0.31,\"4000\":0.19,\"8000\":0.31},\"nrc\":0.3,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"xnBipcoX4sLDG3z4\"},{\"tags\":[\"Soundblocks\",\"Soundblocks\"],\"manufacturer\":\"\",\"name\":\"Proudfoot 'Soundblox' \",\"material\":\"Proudfoot 'Soundblox' , 8 -in., Type Q Painted\",\"absorption\":{\"63\":0.6,\"125\":0.99,\"250\":0.57,\"500\":0.61,\"1000\":0.37,\"2000\":0.56,\"4000\":0.55,\"8000\":0.56},\"nrc\":0.53,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"xsh5MKU5XYwclCfu\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg Diffusorblox\",\"material\":\"RPG DiffusorBlox, painted\",\"absorption\":{\"63\":0.26,\"125\":0.76,\"250\":0.51,\"500\":0.58,\"1000\":0.34,\"2000\":0.24,\"4000\":0.26,\"8000\":0.26},\"nrc\":0.42,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"xtQo9oDcSuOW8IOj\"},{\"tags\":[\"Diffusers\",\"Diffuser\"],\"manufacturer\":\"\",\"name\":\"Rpg Modex Corner Absorber\",\"material\":\"RPG Modex Corner Absorber\",\"absorption\":{\"63\":0.1,\"125\":0.44,\"250\":0.19,\"500\":0.08,\"1000\":0.07,\"2000\":0.08,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.11,\"source\":\"RPG data\",\"description\":\"\",\"uuid\":\"xtZO2q5rKnpForr6\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Auratone\",\"material\":\"USG Auratone, Omni 323 5/8 2x2\",\"absorption\":{\"63\":0.12,\"125\":0.4,\"250\":0.24,\"500\":0.47,\"1000\":0.78,\"2000\":0.7,\"4000\":0.55,\"8000\":0.55},\"nrc\":0.55,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"xtcxLYK8ajrV9XW5\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13\",\"material\":\"K13, ribbed deck, 2.5in\",\"absorption\":{\"63\":0.28,\"125\":0.77,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.97,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"xyd399wxkm6EmwUO\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"2\\\" Owens Corning 703\",\"material\":\"2\\\" Owens Corning 703, plain faced, Mounting A\",\"absorption\":{\"63\":0.12,\"125\":0.17,\"250\":0.86,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.98,\"8000\":0.99},\"nrc\":0.96,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"y3JWPqNGKMNEHbtf\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Decoustics Baffle #10&20 ; S/H =1\",\"material\":\"decoustics Baffle #10&20 ; S/H =1\",\"absorption\":{\"63\":0.2,\"125\":0.28,\"250\":0.6,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.89,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"y5BiZm7CwZcYBkwZ\"},{\"tags\":[\"Fiberglass\",\"Fiberglass\"],\"manufacturer\":\"\",\"name\":\"Heavy Carpet On 5/8\\\" Perforated Mineral Fiberboard With Air Space Behind\",\"material\":\"Heavy carpet on 5/8\\\" perforated mineral fiberboard with air space behind\",\"absorption\":{\"63\":0.2,\"125\":0.37,\"250\":0.41,\"500\":0.63,\"1000\":0.85,\"2000\":0.96,\"4000\":0.92,\"8000\":0.96},\"nrc\":0.71,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"yCaEN67SfdlRJLK5\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Wall Technology New Dimensions\",\"material\":\"Wall TEchnology New Dimensions\",\"absorption\":{\"63\":0.06,\"125\":0.12,\"250\":0.44,\"500\":0.88,\"1000\":0.99,\"2000\":0.99,\"4000\":0.98,\"8000\":0.99},\"nrc\":0.83,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"yEwptBj4BrgjLC09\"},{\"tags\":[\"Wood\",\" Wood Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Sereno 2/10 A-Mounted Over 2\\\" Fiberglass Core\",\"material\":\"Kinetics Sereno 2/10 A-Mounted over 2\\\" Fiberglass Core\",\"absorption\":{\"63\":0.12,\"125\":0.56,\"250\":0.99,\"500\":0.68,\"1000\":0.32,\"2000\":0.18,\"4000\":0.11,\"8000\":0.18},\"nrc\":0.54,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"yFjm5ntQjWJ4gnh9\"},{\"tags\":[\"Ceiling\",\" Ceiling Tile\"],\"manufacturer\":\"\",\"name\":\"Armstrong Sanserra Travertone Tile (1 X 1 X 3/4\\\")\",\"material\":\"Armstrong Sanserra Travertone Tile (1 x 1 x 3/4\\\"), direct applied\",\"absorption\":{\"63\":0.04,\"125\":0.07,\"250\":0.23,\"500\":0.61,\"1000\":0.92,\"2000\":0.97,\"4000\":0.98,\"8000\":0.99},\"nrc\":0.68,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"yI5EAV9hKpzgIMaj\"},{\"tags\":[\"Windows\",\"Fenestration\"],\"manufacturer\":\"\",\"name\":\"Venetian Blinds\",\"material\":\"Venetian Blinds, 5in air space\",\"absorption\":{\"63\":0.03,\"125\":0.07,\"250\":0.05,\"500\":0.1,\"1000\":0.16,\"2000\":0.13,\"4000\":0.18,\"8000\":0.18},\"nrc\":0.11,\"source\":\"C&A Files\",\"description\":\"\",\"uuid\":\"yLMTLHAUtOlBiFW8\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Mineral Fiber Ceiling Panel\",\"material\":\"Armstrong Mineral Fiber ceiling panel, Ultima 2x4\",\"absorption\":{\"63\":0.15,\"125\":0.32,\"250\":0.34,\"500\":0.76,\"1000\":0.87,\"2000\":0.86,\"4000\":0.84,\"8000\":0.84},\"nrc\":0.71,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"yPgYUFycM2a4Q8Vv\"},{\"tags\":[\"Plaster\",\" Plaster\"],\"manufacturer\":\"\",\"name\":\"1/2\\\" Grace Acoustikote On Lath\",\"material\":\"1/2\\\" Grace Acoustikote on lath\",\"absorption\":{\"63\":0.13,\"125\":0.19,\"250\":0.56,\"500\":0.68,\"1000\":0.72,\"2000\":0.79,\"4000\":0.89,\"8000\":0.99},\"nrc\":0.69,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"yWjLMGUmxcfNOQpB\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Omniffusor - A Mount Uncovered\",\"material\":\"RPG Omniffusor - A mount uncovered\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.12,\"500\":0.15,\"1000\":0.2,\"2000\":0.09,\"4000\":0.11,\"8000\":0.13},\"nrc\":0.14,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"yXf2OprGq5zitrrQ\"},{\"tags\":[\"Common\",\"Common Materials\"],\"manufacturer\":\"\",\"name\":\"Concrete Block\",\"material\":\"Concrete block, coarse and unpainted\",\"absorption\":{\"63\":0.2,\"125\":0.36,\"250\":0.44,\"500\":0.31,\"1000\":0.29,\"2000\":0.39,\"4000\":0.25,\"8000\":0.39},\"nrc\":0.36,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ye5yONDQpImM7LbR\"},{\"tags\":[\"Walls\",\"Gypsum board\"],\"manufacturer\":\"\",\"name\":\"Gypsum Board\",\"material\":\"Gypsum board, 2+2 @ 5/8in on ins. 3-5/8in studs\",\"absorption\":{\"63\":0.03,\"125\":0.1,\"250\":0.07,\"500\":0.05,\"1000\":0.05,\"2000\":0.05,\"4000\":0.04,\"8000\":0.04},\"nrc\":0.06,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"ygqTtzZtFGXsSORf\"},{\"tags\":[\"Metals\",\"Metals\"],\"manufacturer\":\"\",\"name\":\"Heavy Metal\",\"material\":\"Heavy metal\",\"absorption\":{\"63\":0.01,\"125\":0.05,\"250\":0.1,\"500\":0.1,\"1000\":0.1,\"2000\":0.07,\"4000\":0.02,\"8000\":0.07},\"nrc\":0.09,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"yiluEH4n23sI3Vxy\"},{\"tags\":[\"Drapery\",\"Drapery\"],\"manufacturer\":\"\",\"name\":\"25Oz. Double 100% Gathers\",\"material\":\"25oz. Double 100% gathers, 10\\\" separation, 5\\\" to track, closed side edges - most current data, based on actual tests\",\"absorption\":{\"63\":0.43,\"125\":0.62,\"250\":0.89,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.94,\"8000\":0.99},\"nrc\":0.97,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ykmr1AqNN4KqIc2M\"},{\"tags\":[\"Walls\",\"Brick\"],\"manufacturer\":\"\",\"name\":\"Brick\",\"material\":\"Brick, unglazed\",\"absorption\":{\"63\":0.01,\"125\":0.02,\"250\":0.02,\"500\":0.03,\"1000\":0.04,\"2000\":0.05,\"4000\":0.07,\"8000\":0.07},\"nrc\":0.04,\"source\":\"Egan\",\"description\":\"\",\"uuid\":\"ymHfDx323GGqiSLR\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Diffractal\",\"material\":\"RPG Diffractal\",\"absorption\":{\"63\":0.15,\"125\":0.21,\"250\":0.26,\"500\":0.33,\"1000\":0.23,\"2000\":0.2,\"4000\":0.2,\"8000\":0.2},\"nrc\":0.26,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"ypxu7m6Bl7Os2CtS\"},{\"tags\":[\"Walls\",\"Concrete Block\"],\"manufacturer\":\"\",\"name\":\"Cmu\",\"material\":\"CMU, coarse\",\"absorption\":{\"63\":0.14,\"125\":0.36,\"250\":0.44,\"500\":0.31,\"1000\":0.29,\"2000\":0.39,\"4000\":0.25,\"8000\":0.25},\"nrc\":0.36,\"source\":\"wjhw?\",\"description\":\"\",\"uuid\":\"yxlDREPmYrpnGe1t\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Kinetics Hardside Panel 4\\\" Thick\",\"material\":\"Kinetics Hardside Panel 4\\\" Thick\",\"absorption\":{\"63\":0.67,\"125\":0.96,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"yz9GTYj6EOpOcRaB\"},{\"tags\":[\"Gypsum\",\"Gypsum Board Constructions\"],\"manufacturer\":\"\",\"name\":\"2 Layers Gypsum Board\",\"material\":\"2 layers gypsum board, 5/8\\\" thick, on 3-5/8\\\" metal studs, 16\\\" o.c.-EST.\",\"absorption\":{\"63\":0.15,\"125\":0.1,\"250\":0.07,\"500\":0.05,\"1000\":0.04,\"2000\":0.07,\"4000\":0.09,\"8000\":0.11},\"nrc\":0.06,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"z3CC7WjD6OCxEfrx\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"\",\"name\":\"Usg Mars Climaplus 3/4 2X2\",\"material\":\"USG Mars ClimaPlus 3/4 2x2\",\"absorption\":{\"63\":0.24,\"125\":0.59,\"250\":0.48,\"500\":0.56,\"1000\":0.8,\"2000\":0.87,\"4000\":0.77,\"8000\":0.77},\"nrc\":0.68,\"source\":\"USG data\",\"description\":\"\",\"uuid\":\"z5yXZYXd0LGe6VdX\"},{\"tags\":[\"Ceilings\",\"Metal Roof Decks\"],\"manufacturer\":\"\",\"name\":\"Plain Steel Ceiling Planks\",\"material\":\"Plain steel ceiling planks\",\"absorption\":{\"63\":0.08,\"125\":0.25,\"250\":0.15,\"500\":0.1,\"1000\":0.08,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.1,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"z8SRS91KZamWAQEZ\"},{\"tags\":[\"Fabric\",\"Fabric Wrapped Panels\"],\"manufacturer\":\"\",\"name\":\"Wenger 4' X 4' Acoust. Absorber Panel\",\"material\":\"Wenger 4' x 4' Acoust. Absorber Panel, fabric wrapped\",\"absorption\":{\"63\":0.25,\"125\":0.36,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.99,\"4000\":0.99,\"8000\":0.99},\"nrc\":0.99,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"zCrT4E5HcjxlIiD6\"},{\"tags\":[\"Ceilings\",\"Sprayed-On Cellulose Fibers\"],\"manufacturer\":\"\",\"name\":\"K13\",\"material\":\"K13, ribbed deck, 3in\",\"absorption\":{\"63\":0.48,\"125\":0.97,\"250\":0.99,\"500\":0.99,\"1000\":0.99,\"2000\":0.95,\"4000\":0.98,\"8000\":0.98},\"nrc\":0.98,\"source\":\"ICC data\",\"description\":\"\",\"uuid\":\"zLwmOImZ6lrVizsP\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.0H Spacing, Type NF-2PS\",\"absorption\":{\"63\":0.09,\"125\":0.13,\"250\":0.41,\"500\":0.45,\"1000\":0.56,\"2000\":0.69,\"4000\":0.39,\"8000\":0.69},\"nrc\":0.53,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"zS4vZI9XgREb3Apw\"},{\"tags\":[\"Diffusion\",\"Diffusion Products\"],\"manufacturer\":\"\",\"name\":\"Rpg Bad Panel - 2\\\" A Mount With 1/2\\\" Holes\",\"material\":\"RPG BAD Panel - 2\\\" A mount with 1/2\\\" holes\",\"absorption\":{\"63\":0.28,\"125\":0.4,\"250\":0.84,\"500\":0.99,\"1000\":0.98,\"2000\":0.83,\"4000\":0.64,\"8000\":0.83},\"nrc\":0.91,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"zaLycYyQVcAX3Zlr\"},{\"tags\":[\"General\",\"General\"],\"manufacturer\":\"\",\"name\":\"Ideal Reflector - No Absorption At Any Frequency\",\"material\":\"Ideal reflector - no absorption at any frequency\",\"absorption\":{\"63\":0,\"125\":0,\"250\":0,\"500\":0,\"1000\":0,\"2000\":0,\"4000\":0,\"8000\":0},\"nrc\":0,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"zbPT2gyUUY7qsVjf\"},{\"tags\":[\"Wood\",\"Wood\"],\"manufacturer\":\"\",\"name\":\"3/8 In. Plywood With 1/2 In. Airspace From Bbn Chart\",\"material\":\"3/8 in. Plywood with 1/2 in. airspace from BBN chart\",\"absorption\":{\"63\":0.05,\"125\":0.08,\"250\":0.14,\"500\":0.12,\"1000\":0.1,\"2000\":0.08,\"4000\":0.06,\"8000\":0.08},\"nrc\":0.11,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"zc2mCJk9EcH3HxWz\"},{\"tags\":[\"Low\",\"Low Frequency Absorbers\"],\"manufacturer\":\"\",\"name\":\"4 X 4 Wall Module\",\"material\":\"4 x 4 wall module, 10\\\" deep; Helmholtz resonator tuned for 100 Hz\",\"absorption\":{\"63\":0.68,\"125\":0.68,\"250\":0.35,\"500\":0.15,\"1000\":0.1,\"2000\":0.1,\"4000\":0.1,\"8000\":0.1},\"nrc\":0.18,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"zqYs2xobFN2claG2\"},{\"tags\":[\"Audience/Seat\",\"Audience/Seat Absorption\"],\"manufacturer\":\"\",\"name\":\"Unoccupied\",\"material\":\"Unoccupied, lightly upholstered (Beranek 1998)\",\"absorption\":{\"63\":0.25,\"125\":0.36,\"250\":0.47,\"500\":0.57,\"1000\":0.62,\"2000\":0.62,\"4000\":0.6,\"8000\":0.62},\"nrc\":0.57,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"zswqR1G2hbB1NHzJ\"},{\"tags\":[\"Common\",\"Common Materials\"],\"manufacturer\":\"\",\"name\":\"Marble Or Glazed Tile\",\"material\":\"Marble or glazed tile\",\"absorption\":{\"63\":0.01,\"125\":0.01,\"250\":0.01,\"500\":0.01,\"1000\":0.01,\"2000\":0.02,\"4000\":0.02,\"8000\":0.02},\"nrc\":0.01,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"zxEcrKBebWo3YPsI\"},{\"tags\":[\"Ceilings\",\"Ceiling Tiles\"],\"manufacturer\":\"Armstrong\",\"name\":\"Armstrong Ceiling Panel\",\"material\":\"Armstrong ceiling panel, Shasta (Perforated) 2x4 x5/8in\",\"absorption\":{\"63\":0.33,\"125\":0.72,\"250\":0.65,\"500\":0.66,\"1000\":0.73,\"2000\":0.73,\"4000\":0.68,\"8000\":0.68},\"nrc\":0.69,\"source\":\"Armstrong data\",\"description\":\"\",\"uuid\":\"zyAY4qGoAUs2aP0u\"},{\"tags\":[\"Baffles\",\"Baffles\"],\"manufacturer\":\"\",\"name\":\"Iac Noise-Foil Baffles\",\"material\":\"IAC Noise-Foil Baffles, 1.5H Spacing, Type NF-4\",\"absorption\":{\"63\":0.1,\"125\":0.14,\"250\":0.45,\"500\":0.8,\"1000\":0.89,\"2000\":0.97,\"4000\":0.53,\"8000\":0.97},\"nrc\":0.78,\"source\":\"SH\",\"description\":\"\",\"uuid\":\"zzCxuWnyNyRSY6Ej\"},{\"tags\":[\"Ceilings\",\"Gypsum Board Ceilings\"],\"manufacturer\":\"\",\"name\":\"Suspended Plasterboard On Large Air Space\",\"material\":\"Suspended plasterboard on large air space\",\"absorption\":{\"63\":0.08,\"125\":0.2,\"250\":0.15,\"500\":0.1,\"1000\":0.05,\"2000\":0.05,\"4000\":0.05,\"8000\":0.05},\"nrc\":0.09,\"source\":\"Hann Tucker\",\"description\":\"\",\"uuid\":\"zzppQkVPyUnj3ctQ\"}]"), Le = h((e, t) => ({
	materials: new Map(Ie.map((e) => [e.uuid, e])),
	materialSearcher: new Fe(Ie, { keySelector: (e) => e.material }),
	search: (e) => e ? t().materialSearcher.search(e) : [...t().materials.values()],
	set: (t) => e(s(t)),
	bufferLength: 30,
	selectedMaterial: "",
	query: ""
}));
i("ASSIGN_MATERIAL", ({ material: e, target: t }) => {
	y.getState().set((n) => {
		o(t).forEach((t) => {
			n.containers[t.uuid].acousticMaterial = e;
		});
	});
});
var Re = () => {
	Le.setState({
		selectedMaterial: "",
		query: ""
	}, !1), console.log("[MaterialStore] Reset complete");
}, ze = /* @__PURE__ */ function(e) {
	return e[e.FEET = 0] = "FEET", e[e.INCHES = 1] = "INCHES", e[e.METERS = 2] = "METERS", e;
}({}), z = h((e) => ({
	units: ze.METERS,
	version: "0.2.1",
	canDuplicate: !1,
	rendererStatsVisible: !1,
	saveDialogVisible: !1,
	projectName: "",
	openWarningVisible: !1,
	newWarningVisible: !1,
	importDialogVisible: !1,
	selectedObjects: void 0,
	canRedo: !1,
	canUndo: !1,
	materialDrawerOpen: !1,
	settingsDrawerVisible: !1,
	resultsPanelOpen: !1,
	progress: {
		visible: !1,
		message: "",
		progress: -1,
		solverUuid: void 0
	},
	autoCalculate: !0,
	hasUnsavedChanges: !1,
	set: (t) => e(s(t))
}));
i("OPEN_MATERIAL_DRAWER", (e) => {
	z.getState().set((e) => {
		e.materialDrawerOpen = !0;
	});
}), i("TOGGLE_MATERIAL_SEARCH", () => {
	z.getState().set((e) => {
		e.materialDrawerOpen = !0;
	});
}), i("TOGGLE_RESULTS_PANEL", (e) => {
	z.getState().set((t) => {
		t.resultsPanelOpen = e === void 0 ? !t.resultsPanelOpen : e;
	});
}), i("SHOW_PROGRESS", ({ message: e, progress: t = -1, solverUuid: n }) => {
	z.getState().set((r) => {
		r.progress.visible = !0, r.progress.message = e, r.progress.progress = t, r.progress.solverUuid = n;
	});
}), i("UPDATE_PROGRESS", ({ progress: e, message: t }) => {
	z.getState().set((n) => {
		n.progress.progress = e, t !== void 0 && (n.progress.message = t);
	});
}), i("HIDE_PROGRESS", () => {
	z.getState().set((e) => {
		e.progress.visible = !1, e.progress.message = "", e.progress.progress = -1, e.progress.solverUuid = void 0;
	});
}), i("SET_AUTO_CALCULATE", (e) => {
	z.getState().set((t) => {
		t.autoCalculate = e;
	});
}), i("MARK_DIRTY", () => {
	z.getState().set((e) => {
		e.hasUnsavedChanges = !0;
	});
}), i("MARK_CLEAN", () => {
	z.getState().set((e) => {
		e.hasUnsavedChanges = !1;
	});
});
var Be = () => {
	let { version: e } = z.getState();
	z.setState({
		units: ze.METERS,
		version: e,
		canDuplicate: !1,
		rendererStatsVisible: !1,
		saveDialogVisible: !1,
		projectName: "",
		openWarningVisible: !1,
		newWarningVisible: !1,
		importDialogVisible: !1,
		selectedObjects: void 0,
		canRedo: !1,
		canUndo: !1,
		materialDrawerOpen: !1,
		settingsDrawerVisible: !1,
		resultsPanelOpen: !1,
		progress: {
			visible: !1,
			message: "",
			progress: -1,
			solverUuid: void 0
		},
		autoCalculate: !0,
		hasUnsavedChanges: !1
	}), console.log("[AppStore] Reset complete");
}, Ve = /* @__PURE__ */ function(e) {
	return e.LevelTimeProgression = "linear-time-progression", e.Default = "default", e.StatisticalRT60 = "statisticalRT60", e.ImpulseResponse = "impulseResponse", e;
}({}), B = h((e) => ({
	results: {},
	openTabIndex: 0,
	set: (t) => e(s(t))
}));
i("ADD_RESULT", (e) => {
	B.getState().set((t) => void (t.results[e.uuid] = e)), z.getState().resultsPanelOpen || p("TOGGLE_RESULTS_PANEL", !0);
}), i("UPDATE_RESULT", ({ result: e }) => {
	B.getState().set((t) => void (t.results[e.uuid] = e));
}), i("REMOVE_RESULT", (e) => {
	B.getState().set((t) => {
		t.results = d([e], t.results);
	});
});
var He = (e, t, n) => {
	B.getState().set((r) => {
		Object.values(r.results).forEach((r) => {
			if (r.kind === "impulseResponse") {
				let i = r.info;
				n === "source" && i.sourceId === e ? (i.sourceName = t, r.name = `IR: ${t} → ${i.receiverName}`) : n === "receiver" && i.receiverId === e && (i.receiverName = t, r.name = `IR: ${i.sourceName} → ${t}`);
			}
		});
	});
};
i("SOURCE_SET_PROPERTY", (e) => {
	e.property === "name" && He(e.uuid, e.value, "source");
}), i("RECEIVER_SET_PROPERTY", (e) => {
	e.property === "name" && He(e.uuid, e.value, "receiver");
});
var Ue = () => {
	B.setState({
		results: {},
		openTabIndex: 0
	}), console.log("[ResultStore] Reset complete");
}, We = {
	general: {
		fogColor: {
			id: "fogColor",
			name: "Fog Color",
			description: "Changes the color of the scene's fog",
			kind: "color",
			value: "#ffffff",
			staged_value: "#ffffff",
			default_value: "#ffffff"
		},
		defaultSaveName: {
			id: "defaultSaveName",
			name: "Default Save Name",
			description: "The default name when saving",
			kind: "text",
			value: "new-project",
			staged_value: "new-project",
			default_value: "new-project"
		}
	},
	editor: {
		transformSnapFine: {
			id: "transformSnapFine",
			name: "Transform - Snap (fine)",
			description: "The fine step size when transforming an object",
			kind: "number",
			value: .001,
			staged_value: .001,
			default_value: .001
		},
		transformSnapNormal: {
			id: "transformSnapNormal",
			name: "Transform - Snap (normal)",
			description: "The fine step size when transforming an object",
			kind: "number",
			value: .1,
			staged_value: .1,
			default_value: .1
		},
		transformSnapCoarse: {
			id: "transformSnapCoarse",
			name: "Transform - Snap (coarse)",
			description: "The fine step size when transforming an object",
			kind: "number",
			value: 1,
			staged_value: 1,
			default_value: 1
		}
	},
	keybindings: { SHOW_IMPORT_DIALOG: {
		id: "SHOW_IMPORT_DIALOG",
		name: "Import",
		description: "Shows the import dialog window",
		kind: "keybinding",
		value: "⌃+i, ⌘+i",
		staged_value: "⌃+i, ⌘+i",
		default_value: "⌃+i, ⌘+i"
	} }
}, Ge = h((e) => ({
	settings: We,
	set: (t) => e(s(t))
})), Ke = () => {
	Ge.setState({ settings: We }), console.log("[SettingsStore] Reset complete");
}, qe = {
	light: {
		mode: "light",
		ui: {
			fontColor: "#182026",
			panelBackgroundColor: "#ffffff",
			backgroundColor: "#f5f8fa",
			layoutSeperatorColor: "#bbbbbb33",
			tabsBorderColor: "#aaaaaa",
			tabsBackgroundColor: "#0000000d",
			tabBackgroundColor: "#ffffff"
		},
		renderer: {
			background: 16120058,
			fog: 16120058,
			gridMinor: 0,
			gridMajor: 0,
			gridOpacity: .1,
			gridMajorOpacity: .2
		}
	},
	dark: {
		mode: "dark",
		ui: {
			fontColor: "#f5f6f7",
			panelBackgroundColor: "#1e1e1e",
			backgroundColor: "#121212",
			layoutSeperatorColor: "#ffffff20",
			tabsBorderColor: "#444444",
			tabsBackgroundColor: "#ffffff0d",
			tabBackgroundColor: "#2d2d2d"
		},
		renderer: {
			background: 1710638,
			fog: 1710638,
			gridMinor: 16777215,
			gridMajor: 16777215,
			gridOpacity: .08,
			gridMajorOpacity: .15
		}
	}
}, Je = h((e) => ({
	mode: "light",
	theme: qe.light,
	set: (t) => e(s(t))
}));
i("SET_THEME_MODE", (e) => {
	let t = qe[e];
	Je.getState().set((n) => {
		n.mode = e, n.theme = t;
	}), p("THEME_CHANGED", t);
});
var Ye = () => {
	Je.setState({
		mode: "light",
		theme: qe.light
	}), console.log("[ThemeStore] Reset complete");
};
h((e) => ({})), i("UNDO", () => {}), i("REDO", () => {});
//#endregion
//#region node_modules/object-hash/dist/object_hash.js
var Xe = /* @__PURE__ */ m(((t, n) => {
	(function(e) {
		var r;
		typeof t == "object" ? n.exports = e() : typeof define == "function" && define.amd ? define(e) : (typeof window < "u" ? r = window : typeof global < "u" ? r = global : typeof self < "u" && (r = self), r.objectHash = e());
	})(function() {
		return function t(n, r, i) {
			function a(s, c) {
				if (!r[s]) {
					if (!n[s]) {
						var l = typeof e == "function" && e;
						if (!c && l) return l(s, !0);
						if (o) return o(s, !0);
						throw Error("Cannot find module '" + s + "'");
					}
					c = r[s] = { exports: {} }, n[s][0].call(c.exports, function(e) {
						var t = n[s][1][e];
						return a(t || e);
					}, c, c.exports, t, n, r, i);
				}
				return r[s].exports;
			}
			for (var o = typeof e == "function" && e, s = 0; s < i.length; s++) a(i[s]);
			return a;
		}({
			1: [function(e, t, n) {
				(function(r, i, a, o, s, c, l, u, d) {
					var f = e("crypto");
					function p(e, t) {
						t = g(e, t);
						var n;
						return (n = t.algorithm === "passthrough" ? new y() : f.createHash(t.algorithm)).write === void 0 && (n.write = n.update, n.end = n.update), v(t, n).dispatch(e), n.update || n.end(""), n.digest ? n.digest(t.encoding === "buffer" ? void 0 : t.encoding) : (e = n.read(), t.encoding === "buffer" ? e : e.toString(t.encoding));
					}
					(n = t.exports = p).sha1 = function(e) {
						return p(e);
					}, n.keys = function(e) {
						return p(e, {
							excludeValues: !0,
							algorithm: "sha1",
							encoding: "hex"
						});
					}, n.MD5 = function(e) {
						return p(e, {
							algorithm: "md5",
							encoding: "hex"
						});
					}, n.keysMD5 = function(e) {
						return p(e, {
							algorithm: "md5",
							encoding: "hex",
							excludeValues: !0
						});
					};
					var m = f.getHashes ? f.getHashes().slice() : ["sha1", "md5"], h = (m.push("passthrough"), [
						"buffer",
						"hex",
						"binary",
						"base64"
					]);
					function g(e, t) {
						var n = {};
						if (n.algorithm = (t ||= {}).algorithm || "sha1", n.encoding = t.encoding || "hex", n.excludeValues = !!t.excludeValues, n.algorithm = n.algorithm.toLowerCase(), n.encoding = n.encoding.toLowerCase(), n.ignoreUnknown = !0 === t.ignoreUnknown, n.respectType = !1 !== t.respectType, n.respectFunctionNames = !1 !== t.respectFunctionNames, n.respectFunctionProperties = !1 !== t.respectFunctionProperties, n.unorderedArrays = !0 === t.unorderedArrays, n.unorderedSets = !1 !== t.unorderedSets, n.unorderedObjects = !1 !== t.unorderedObjects, n.replacer = t.replacer || void 0, n.excludeKeys = t.excludeKeys || void 0, e === void 0) throw Error("Object argument required.");
						for (var r = 0; r < m.length; ++r) m[r].toLowerCase() === n.algorithm.toLowerCase() && (n.algorithm = m[r]);
						if (m.indexOf(n.algorithm) === -1) throw Error("Algorithm \"" + n.algorithm + "\"  not supported. supported values: " + m.join(", "));
						if (h.indexOf(n.encoding) === -1 && n.algorithm !== "passthrough") throw Error("Encoding \"" + n.encoding + "\"  not supported. supported values: " + h.join(", "));
						return n;
					}
					function _(e) {
						if (typeof e == "function") return /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(Function.prototype.toString.call(e)) != null;
					}
					function v(e, t, n) {
						n ||= [];
						function r(e) {
							return t.update ? t.update(e, "utf8") : t.write(e, "utf8");
						}
						return {
							dispatch: function(t) {
								return this["_" + ((t = e.replacer ? e.replacer(t) : t) === null ? "null" : typeof t)](t);
							},
							_object: function(t) {
								var i, o = Object.prototype.toString.call(t), s = /\[object (.*)\]/i.exec(o);
								if (s = (s = s ? s[1] : "unknown:[" + o + "]").toLowerCase(), 0 <= (o = n.indexOf(t))) return this.dispatch("[CIRCULAR:" + o + "]");
								if (n.push(t), a !== void 0 && a.isBuffer && a.isBuffer(t)) return r("buffer:"), r(t);
								if (s === "object" || s === "function" || s === "asyncfunction") return o = Object.keys(t), e.unorderedObjects && (o = o.sort()), !1 === e.respectType || _(t) || o.splice(0, 0, "prototype", "__proto__", "constructor"), e.excludeKeys && (o = o.filter(function(t) {
									return !e.excludeKeys(t);
								})), r("object:" + o.length + ":"), i = this, o.forEach(function(n) {
									i.dispatch(n), r(":"), e.excludeValues || i.dispatch(t[n]), r(",");
								});
								if (!this["_" + s]) {
									if (e.ignoreUnknown) return r("[" + s + "]");
									throw Error("Unknown object type \"" + s + "\"");
								}
								this["_" + s](t);
							},
							_array: function(t, i) {
								i = i === void 0 ? !1 !== e.unorderedArrays : i;
								var a = this;
								if (r("array:" + t.length + ":"), !i || t.length <= 1) return t.forEach(function(e) {
									return a.dispatch(e);
								});
								var o = [], i = t.map(function(t) {
									var r = new y(), i = n.slice();
									return v(e, r, i).dispatch(t), o = o.concat(i.slice(n.length)), r.read().toString();
								});
								return n = n.concat(o), i.sort(), this._array(i, !1);
							},
							_date: function(e) {
								return r("date:" + e.toJSON());
							},
							_symbol: function(e) {
								return r("symbol:" + e.toString());
							},
							_error: function(e) {
								return r("error:" + e.toString());
							},
							_boolean: function(e) {
								return r("bool:" + e.toString());
							},
							_string: function(e) {
								r("string:" + e.length + ":"), r(e.toString());
							},
							_function: function(t) {
								r("fn:"), _(t) ? this.dispatch("[native]") : this.dispatch(t.toString()), !1 !== e.respectFunctionNames && this.dispatch("function-name:" + String(t.name)), e.respectFunctionProperties && this._object(t);
							},
							_number: function(e) {
								return r("number:" + e.toString());
							},
							_xml: function(e) {
								return r("xml:" + e.toString());
							},
							_null: function() {
								return r("Null");
							},
							_undefined: function() {
								return r("Undefined");
							},
							_regexp: function(e) {
								return r("regex:" + e.toString());
							},
							_uint8array: function(e) {
								return r("uint8array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_uint8clampedarray: function(e) {
								return r("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_int8array: function(e) {
								return r("int8array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_uint16array: function(e) {
								return r("uint16array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_int16array: function(e) {
								return r("int16array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_uint32array: function(e) {
								return r("uint32array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_int32array: function(e) {
								return r("int32array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_float32array: function(e) {
								return r("float32array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_float64array: function(e) {
								return r("float64array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_arraybuffer: function(e) {
								return r("arraybuffer:"), this.dispatch(new Uint8Array(e));
							},
							_url: function(e) {
								return r("url:" + e.toString());
							},
							_map: function(t) {
								return r("map:"), t = Array.from(t), this._array(t, !1 !== e.unorderedSets);
							},
							_set: function(t) {
								return r("set:"), t = Array.from(t), this._array(t, !1 !== e.unorderedSets);
							},
							_file: function(e) {
								return r("file:"), this.dispatch([
									e.name,
									e.size,
									e.type,
									e.lastModfied
								]);
							},
							_blob: function() {
								if (e.ignoreUnknown) return r("[blob]");
								throw Error("Hashing Blob objects is currently not supported\n(see https://github.com/puleos/object-hash/issues/26)\nUse \"options.replacer\" or \"options.ignoreUnknown\"\n");
							},
							_domwindow: function() {
								return r("domwindow");
							},
							_bigint: function(e) {
								return r("bigint:" + e.toString());
							},
							_process: function() {
								return r("process");
							},
							_timer: function() {
								return r("timer");
							},
							_pipe: function() {
								return r("pipe");
							},
							_tcp: function() {
								return r("tcp");
							},
							_udp: function() {
								return r("udp");
							},
							_tty: function() {
								return r("tty");
							},
							_statwatcher: function() {
								return r("statwatcher");
							},
							_securecontext: function() {
								return r("securecontext");
							},
							_connection: function() {
								return r("connection");
							},
							_zlib: function() {
								return r("zlib");
							},
							_context: function() {
								return r("context");
							},
							_nodescript: function() {
								return r("nodescript");
							},
							_httpparser: function() {
								return r("httpparser");
							},
							_dataview: function() {
								return r("dataview");
							},
							_signal: function() {
								return r("signal");
							},
							_fsevent: function() {
								return r("fsevent");
							},
							_tlswrap: function() {
								return r("tlswrap");
							}
						};
					}
					function y() {
						return {
							buf: "",
							write: function(e) {
								this.buf += e;
							},
							end: function(e) {
								this.buf += e;
							},
							read: function() {
								return this.buf;
							}
						};
					}
					n.writeToStream = function(e, t, n) {
						return n === void 0 && (n = t, t = {}), v(t = g(e, t), n).dispatch(e);
					};
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/fake_9a5aa49d.js", "/");
			}, {
				buffer: 3,
				crypto: 5,
				lYpoI2: 11
			}],
			2: [function(e, t, n) {
				(function(e, t, r, i, a, o, s, c, l) {
					(function(e) {
						var t = typeof Uint8Array < "u" ? Uint8Array : Array, n = 43, r = 47, i = 48, a = 97, o = 65, s = 45, c = 95;
						function l(e) {
							return e = e.charCodeAt(0), e === n || e === s ? 62 : e === r || e === c ? 63 : e < i ? -1 : e < i + 10 ? e - i + 26 + 26 : e < o + 26 ? e - o : e < a + 26 ? e - a + 26 : void 0;
						}
						e.toByteArray = function(e) {
							var n, r;
							if (0 < e.length % 4) throw Error("Invalid string. Length must be a multiple of 4");
							var i = e.length, i = e.charAt(i - 2) === "=" ? 2 : +(e.charAt(i - 1) === "="), a = new t(3 * e.length / 4 - i), o = 0 < i ? e.length - 4 : e.length, s = 0;
							function c(e) {
								a[s++] = e;
							}
							for (n = 0; n < o; n += 4) c((16711680 & (r = l(e.charAt(n)) << 18 | l(e.charAt(n + 1)) << 12 | l(e.charAt(n + 2)) << 6 | l(e.charAt(n + 3)))) >> 16), c((65280 & r) >> 8), c(255 & r);
							return i == 2 ? c(255 & (r = l(e.charAt(n)) << 2 | l(e.charAt(n + 1)) >> 4)) : i == 1 && (c((r = l(e.charAt(n)) << 10 | l(e.charAt(n + 1)) << 4 | l(e.charAt(n + 2)) >> 2) >> 8 & 255), c(255 & r)), a;
						}, e.fromByteArray = function(e) {
							var t, n, r, i, a = e.length % 3, o = "";
							function s(e) {
								return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e);
							}
							for (t = 0, r = e.length - a; t < r; t += 3) n = (e[t] << 16) + (e[t + 1] << 8) + e[t + 2], o += s((i = n) >> 18 & 63) + s(i >> 12 & 63) + s(i >> 6 & 63) + s(63 & i);
							switch (a) {
								case 1:
									o = (o += s((n = e[e.length - 1]) >> 2)) + s(n << 4 & 63) + "==";
									break;
								case 2: o = (o = (o += s((n = (e[e.length - 2] << 8) + e[e.length - 1]) >> 10)) + s(n >> 4 & 63)) + s(n << 2 & 63) + "=";
							}
							return o;
						};
					})(n === void 0 ? this.base64js = {} : n);
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js", "/node_modules/gulp-browserify/node_modules/base64-js/lib");
			}, {
				buffer: 3,
				lYpoI2: 11
			}],
			3: [function(e, t, n) {
				(function(t, r, i, a, o, s, c, l, u) {
					var d = e("base64-js"), f = e("ieee754");
					function i(e, t, n) {
						if (!(this instanceof i)) return new i(e, t, n);
						var r, a, o, s, c = typeof e;
						if (t === "base64" && c == "string") for (e = (s = e).trim ? s.trim() : s.replace(/^\s+|\s+$/g, ""); e.length % 4 != 0;) e += "=";
						if (c == "number") r = A(e);
						else if (c == "string") r = i.byteLength(e, t);
						else {
							if (c != "object") throw Error("First argument needs to be a number, array or string.");
							r = A(e.length);
						}
						if (i._useTypedArrays ? a = i._augment(new Uint8Array(r)) : ((a = this).length = r, a._isBuffer = !0), i._useTypedArrays && typeof e.byteLength == "number") a._set(e);
						else if (j(s = e) || i.isBuffer(s) || s && typeof s == "object" && typeof s.length == "number") for (o = 0; o < r; o++) i.isBuffer(e) ? a[o] = e.readUInt8(o) : a[o] = e[o];
						else if (c == "string") a.write(e, 0, t);
						else if (c == "number" && !i._useTypedArrays && !n) for (o = 0; o < r; o++) a[o] = 0;
						return a;
					}
					function p(e, t, n, r) {
						return i._charsWritten = F(function(e) {
							for (var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
							return t;
						}(t), e, n, r);
					}
					function m(e, t, n, r) {
						return i._charsWritten = F(function(e) {
							for (var t, n, r = [], i = 0; i < e.length; i++) n = e.charCodeAt(i), t = n >> 8, n %= 256, r.push(n), r.push(t);
							return r;
						}(t), e, n, r);
					}
					function h(e, t, n) {
						var r = "";
						n = Math.min(e.length, n);
						for (var i = t; i < n; i++) r += String.fromCharCode(e[i]);
						return r;
					}
					function g(e, t, n, r) {
						r || (R(typeof n == "boolean", "missing or invalid endian"), R(t != null, "missing offset"), R(t + 1 < e.length, "Trying to read beyond buffer length"));
						var i, r = e.length;
						if (!(r <= t)) return n ? (i = e[t], t + 1 < r && (i |= e[t + 1] << 8)) : (i = e[t] << 8, t + 1 < r && (i |= e[t + 1])), i;
					}
					function _(e, t, n, r) {
						r || (R(typeof n == "boolean", "missing or invalid endian"), R(t != null, "missing offset"), R(t + 3 < e.length, "Trying to read beyond buffer length"));
						var i, r = e.length;
						if (!(r <= t)) return n ? (t + 2 < r && (i = e[t + 2] << 16), t + 1 < r && (i |= e[t + 1] << 8), i |= e[t], t + 3 < r && (i += e[t + 3] << 24 >>> 0)) : (t + 1 < r && (i = e[t + 1] << 16), t + 2 < r && (i |= e[t + 2] << 8), t + 3 < r && (i |= e[t + 3]), i += e[t] << 24 >>> 0), i;
					}
					function v(e, t, n, r) {
						if (r || (R(typeof n == "boolean", "missing or invalid endian"), R(t != null, "missing offset"), R(t + 1 < e.length, "Trying to read beyond buffer length")), !(e.length <= t)) return r = g(e, t, n, !0), 32768 & r ? -1 * (65535 - r + 1) : r;
					}
					function y(e, t, n, r) {
						if (r || (R(typeof n == "boolean", "missing or invalid endian"), R(t != null, "missing offset"), R(t + 3 < e.length, "Trying to read beyond buffer length")), !(e.length <= t)) return r = _(e, t, n, !0), 2147483648 & r ? -1 * (4294967295 - r + 1) : r;
					}
					function b(e, t, n, r) {
						return r || (R(typeof n == "boolean", "missing or invalid endian"), R(t + 3 < e.length, "Trying to read beyond buffer length")), f.read(e, t, n, 23, 4);
					}
					function x(e, t, n, r) {
						return r || (R(typeof n == "boolean", "missing or invalid endian"), R(t + 7 < e.length, "Trying to read beyond buffer length")), f.read(e, t, n, 52, 8);
					}
					function S(e, t, n, r, i) {
						if (i || (R(t != null, "missing value"), R(typeof r == "boolean", "missing or invalid endian"), R(n != null, "missing offset"), R(n + 1 < e.length, "trying to write beyond buffer length"), L(t, 65535)), i = e.length, !(i <= n)) for (var a = 0, o = Math.min(i - n, 2); a < o; a++) e[n + a] = (t & 255 << 8 * (r ? a : 1 - a)) >>> 8 * (r ? a : 1 - a);
					}
					function C(e, t, n, r, i) {
						if (i || (R(t != null, "missing value"), R(typeof r == "boolean", "missing or invalid endian"), R(n != null, "missing offset"), R(n + 3 < e.length, "trying to write beyond buffer length"), L(t, 4294967295)), i = e.length, !(i <= n)) for (var a = 0, o = Math.min(i - n, 4); a < o; a++) e[n + a] = t >>> 8 * (r ? a : 3 - a) & 255;
					}
					function w(e, t, n, r, i) {
						i || (R(t != null, "missing value"), R(typeof r == "boolean", "missing or invalid endian"), R(n != null, "missing offset"), R(n + 1 < e.length, "Trying to write beyond buffer length"), ee(t, 32767, -32768)), e.length <= n || S(e, 0 <= t ? t : 65535 + t + 1, n, r, i);
					}
					function T(e, t, n, r, i) {
						i || (R(t != null, "missing value"), R(typeof r == "boolean", "missing or invalid endian"), R(n != null, "missing offset"), R(n + 3 < e.length, "Trying to write beyond buffer length"), ee(t, 2147483647, -2147483648)), e.length <= n || C(e, 0 <= t ? t : 4294967295 + t + 1, n, r, i);
					}
					function E(e, t, n, r, i) {
						i || (R(t != null, "missing value"), R(typeof r == "boolean", "missing or invalid endian"), R(n != null, "missing offset"), R(n + 3 < e.length, "Trying to write beyond buffer length"), te(t, 34028234663852886e22, -34028234663852886e22)), e.length <= n || f.write(e, t, n, r, 23, 4);
					}
					function D(e, t, n, r, i) {
						i || (R(t != null, "missing value"), R(typeof r == "boolean", "missing or invalid endian"), R(n != null, "missing offset"), R(n + 7 < e.length, "Trying to write beyond buffer length"), te(t, 17976931348623157e292, -17976931348623157e292)), e.length <= n || f.write(e, t, n, r, 52, 8);
					}
					n.Buffer = i, n.SlowBuffer = i, n.INSPECT_MAX_BYTES = 50, i.poolSize = 8192, i._useTypedArrays = function() {
						try {
							var e = new Uint8Array(/* @__PURE__ */ new ArrayBuffer(0));
							return e.foo = function() {
								return 42;
							}, e.foo() === 42 && typeof e.subarray == "function";
						} catch {
							return !1;
						}
					}(), i.isEncoding = function(e) {
						switch (String(e).toLowerCase()) {
							case "hex":
							case "utf8":
							case "utf-8":
							case "ascii":
							case "binary":
							case "base64":
							case "raw":
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le": return !0;
							default: return !1;
						}
					}, i.isBuffer = function(e) {
						return !(e == null || !e._isBuffer);
					}, i.byteLength = function(e, t) {
						var n;
						switch (e += "", t || "utf8") {
							case "hex":
								n = e.length / 2;
								break;
							case "utf8":
							case "utf-8":
								n = N(e).length;
								break;
							case "ascii":
							case "binary":
							case "raw":
								n = e.length;
								break;
							case "base64":
								n = P(e).length;
								break;
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								n = 2 * e.length;
								break;
							default: throw Error("Unknown encoding");
						}
						return n;
					}, i.concat = function(e, t) {
						if (R(j(e), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."), e.length === 0) return new i(0);
						if (e.length === 1) return e[0];
						if (typeof t != "number") for (a = t = 0; a < e.length; a++) t += e[a].length;
						for (var n = new i(t), r = 0, a = 0; a < e.length; a++) {
							var o = e[a];
							o.copy(n, r), r += o.length;
						}
						return n;
					}, i.prototype.write = function(e, t, n, r) {
						isFinite(t) ? isFinite(n) || (r = n, n = void 0) : (l = r, r = t, t = n, n = l), t = Number(t) || 0;
						var a, o, s, c, l = this.length - t;
						switch ((!n || l < (n = Number(n))) && (n = l), r = String(r || "utf8").toLowerCase()) {
							case "hex":
								a = function(e, t, n, r) {
									n = Number(n) || 0;
									var a = e.length - n;
									(!r || a < (r = Number(r))) && (r = a), R((a = t.length) % 2 == 0, "Invalid hex string"), a / 2 < r && (r = a / 2);
									for (var o = 0; o < r; o++) {
										var s = parseInt(t.substr(2 * o, 2), 16);
										R(!isNaN(s), "Invalid hex string"), e[n + o] = s;
									}
									return i._charsWritten = 2 * o, o;
								}(this, e, t, n);
								break;
							case "utf8":
							case "utf-8":
								o = this, s = t, c = n, a = i._charsWritten = F(N(e), o, s, c);
								break;
							case "ascii":
							case "binary":
								a = p(this, e, t, n);
								break;
							case "base64":
								o = this, s = t, c = n, a = i._charsWritten = F(P(e), o, s, c);
								break;
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								a = m(this, e, t, n);
								break;
							default: throw Error("Unknown encoding");
						}
						return a;
					}, i.prototype.toString = function(e, t, n) {
						var r, i, a, o, s = this;
						if (e = String(e || "utf8").toLowerCase(), t = Number(t) || 0, (n = n === void 0 ? s.length : Number(n)) === t) return "";
						switch (e) {
							case "hex":
								r = function(e, t, n) {
									var r = e.length;
									(!t || t < 0) && (t = 0), (!n || n < 0 || r < n) && (n = r);
									for (var i = "", a = t; a < n; a++) i += M(e[a]);
									return i;
								}(s, t, n);
								break;
							case "utf8":
							case "utf-8":
								r = function(e, t, n) {
									var r = "", i = "";
									n = Math.min(e.length, n);
									for (var a = t; a < n; a++) e[a] <= 127 ? (r += I(i) + String.fromCharCode(e[a]), i = "") : i += "%" + e[a].toString(16);
									return r + I(i);
								}(s, t, n);
								break;
							case "ascii":
							case "binary":
								r = h(s, t, n);
								break;
							case "base64":
								i = s, o = n, r = (a = t) === 0 && o === i.length ? d.fromByteArray(i) : d.fromByteArray(i.slice(a, o));
								break;
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								r = function(e, t, n) {
									for (var r = e.slice(t, n), i = "", a = 0; a < r.length; a += 2) i += String.fromCharCode(r[a] + 256 * r[a + 1]);
									return i;
								}(s, t, n);
								break;
							default: throw Error("Unknown encoding");
						}
						return r;
					}, i.prototype.toJSON = function() {
						return {
							type: "Buffer",
							data: Array.prototype.slice.call(this._arr || this, 0)
						};
					}, i.prototype.copy = function(e, t, n, r) {
						if (t ||= 0, (r = r || r === 0 ? r : this.length) !== (n ||= 0) && e.length !== 0 && this.length !== 0) {
							R(n <= r, "sourceEnd < sourceStart"), R(0 <= t && t < e.length, "targetStart out of bounds"), R(0 <= n && n < this.length, "sourceStart out of bounds"), R(0 <= r && r <= this.length, "sourceEnd out of bounds"), r > this.length && (r = this.length);
							var a = (r = e.length - t < r - n ? e.length - t + n : r) - n;
							if (a < 100 || !i._useTypedArrays) for (var o = 0; o < a; o++) e[o + t] = this[o + n];
							else e._set(this.subarray(n, n + a), t);
						}
					}, i.prototype.slice = function(e, t) {
						var n = this.length;
						if (e = k(e, n, 0), t = k(t, n, n), i._useTypedArrays) return i._augment(this.subarray(e, t));
						for (var r = t - e, a = new i(r, void 0, !0), o = 0; o < r; o++) a[o] = this[o + e];
						return a;
					}, i.prototype.get = function(e) {
						return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e);
					}, i.prototype.set = function(e, t) {
						return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t);
					}, i.prototype.readUInt8 = function(e, t) {
						if (t || (R(e != null, "missing offset"), R(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) return this[e];
					}, i.prototype.readUInt16LE = function(e, t) {
						return g(this, e, !0, t);
					}, i.prototype.readUInt16BE = function(e, t) {
						return g(this, e, !1, t);
					}, i.prototype.readUInt32LE = function(e, t) {
						return _(this, e, !0, t);
					}, i.prototype.readUInt32BE = function(e, t) {
						return _(this, e, !1, t);
					}, i.prototype.readInt8 = function(e, t) {
						if (t || (R(e != null, "missing offset"), R(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) return 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
					}, i.prototype.readInt16LE = function(e, t) {
						return v(this, e, !0, t);
					}, i.prototype.readInt16BE = function(e, t) {
						return v(this, e, !1, t);
					}, i.prototype.readInt32LE = function(e, t) {
						return y(this, e, !0, t);
					}, i.prototype.readInt32BE = function(e, t) {
						return y(this, e, !1, t);
					}, i.prototype.readFloatLE = function(e, t) {
						return b(this, e, !0, t);
					}, i.prototype.readFloatBE = function(e, t) {
						return b(this, e, !1, t);
					}, i.prototype.readDoubleLE = function(e, t) {
						return x(this, e, !0, t);
					}, i.prototype.readDoubleBE = function(e, t) {
						return x(this, e, !1, t);
					}, i.prototype.writeUInt8 = function(e, t, n) {
						n || (R(e != null, "missing value"), R(t != null, "missing offset"), R(t < this.length, "trying to write beyond buffer length"), L(e, 255)), t >= this.length || (this[t] = e);
					}, i.prototype.writeUInt16LE = function(e, t, n) {
						S(this, e, t, !0, n);
					}, i.prototype.writeUInt16BE = function(e, t, n) {
						S(this, e, t, !1, n);
					}, i.prototype.writeUInt32LE = function(e, t, n) {
						C(this, e, t, !0, n);
					}, i.prototype.writeUInt32BE = function(e, t, n) {
						C(this, e, t, !1, n);
					}, i.prototype.writeInt8 = function(e, t, n) {
						n || (R(e != null, "missing value"), R(t != null, "missing offset"), R(t < this.length, "Trying to write beyond buffer length"), ee(e, 127, -128)), t >= this.length || (0 <= e ? this.writeUInt8(e, t, n) : this.writeUInt8(255 + e + 1, t, n));
					}, i.prototype.writeInt16LE = function(e, t, n) {
						w(this, e, t, !0, n);
					}, i.prototype.writeInt16BE = function(e, t, n) {
						w(this, e, t, !1, n);
					}, i.prototype.writeInt32LE = function(e, t, n) {
						T(this, e, t, !0, n);
					}, i.prototype.writeInt32BE = function(e, t, n) {
						T(this, e, t, !1, n);
					}, i.prototype.writeFloatLE = function(e, t, n) {
						E(this, e, t, !0, n);
					}, i.prototype.writeFloatBE = function(e, t, n) {
						E(this, e, t, !1, n);
					}, i.prototype.writeDoubleLE = function(e, t, n) {
						D(this, e, t, !0, n);
					}, i.prototype.writeDoubleBE = function(e, t, n) {
						D(this, e, t, !1, n);
					}, i.prototype.fill = function(e, t, n) {
						if (t ||= 0, n ||= this.length, R(typeof (e = typeof (e ||= 0) == "string" ? e.charCodeAt(0) : e) == "number" && !isNaN(e), "value is not a number"), R(t <= n, "end < start"), n !== t && this.length !== 0) {
							R(0 <= t && t < this.length, "start out of bounds"), R(0 <= n && n <= this.length, "end out of bounds");
							for (var r = t; r < n; r++) this[r] = e;
						}
					}, i.prototype.inspect = function() {
						for (var e = [], t = this.length, r = 0; r < t; r++) if (e[r] = M(this[r]), r === n.INSPECT_MAX_BYTES) {
							e[r + 1] = "...";
							break;
						}
						return "<Buffer " + e.join(" ") + ">";
					}, i.prototype.toArrayBuffer = function() {
						if (typeof Uint8Array > "u") throw Error("Buffer.toArrayBuffer not supported in this browser");
						if (i._useTypedArrays) return new i(this).buffer;
						for (var e = new Uint8Array(this.length), t = 0, n = e.length; t < n; t += 1) e[t] = this[t];
						return e.buffer;
					};
					var O = i.prototype;
					function k(e, t, n) {
						return typeof e == "number" ? t <= (e = ~~e) ? t : 0 <= e || 0 <= (e += t) ? e : 0 : n;
					}
					function A(e) {
						return (e = ~~Math.ceil(+e)) < 0 ? 0 : e;
					}
					function j(e) {
						return (Array.isArray || function(e) {
							return Object.prototype.toString.call(e) === "[object Array]";
						})(e);
					}
					function M(e) {
						return e < 16 ? "0" + e.toString(16) : e.toString(16);
					}
					function N(e) {
						for (var t = [], n = 0; n < e.length; n++) {
							var r = e.charCodeAt(n);
							if (r <= 127) t.push(e.charCodeAt(n));
							else for (var i = n, a = (55296 <= r && r <= 57343 && n++, encodeURIComponent(e.slice(i, n + 1)).substr(1).split("%")), o = 0; o < a.length; o++) t.push(parseInt(a[o], 16));
						}
						return t;
					}
					function P(e) {
						return d.toByteArray(e);
					}
					function F(e, t, n, r) {
						for (var i = 0; i < r && !(i + n >= t.length || i >= e.length); i++) t[i + n] = e[i];
						return i;
					}
					function I(e) {
						try {
							return decodeURIComponent(e);
						} catch {
							return "�";
						}
					}
					function L(e, t) {
						R(typeof e == "number", "cannot write a non-number as a number"), R(0 <= e, "specified a negative value for writing an unsigned value"), R(e <= t, "value is larger than maximum value for type"), R(Math.floor(e) === e, "value has a fractional component");
					}
					function ee(e, t, n) {
						R(typeof e == "number", "cannot write a non-number as a number"), R(e <= t, "value larger than maximum allowed value"), R(n <= e, "value smaller than minimum allowed value"), R(Math.floor(e) === e, "value has a fractional component");
					}
					function te(e, t, n) {
						R(typeof e == "number", "cannot write a non-number as a number"), R(e <= t, "value larger than maximum allowed value"), R(n <= e, "value smaller than minimum allowed value");
					}
					function R(e, t) {
						if (!e) throw Error(t || "Failed assertion");
					}
					i._augment = function(e) {
						return e._isBuffer = !0, e._get = e.get, e._set = e.set, e.get = O.get, e.set = O.set, e.write = O.write, e.toString = O.toString, e.toLocaleString = O.toString, e.toJSON = O.toJSON, e.copy = O.copy, e.slice = O.slice, e.readUInt8 = O.readUInt8, e.readUInt16LE = O.readUInt16LE, e.readUInt16BE = O.readUInt16BE, e.readUInt32LE = O.readUInt32LE, e.readUInt32BE = O.readUInt32BE, e.readInt8 = O.readInt8, e.readInt16LE = O.readInt16LE, e.readInt16BE = O.readInt16BE, e.readInt32LE = O.readInt32LE, e.readInt32BE = O.readInt32BE, e.readFloatLE = O.readFloatLE, e.readFloatBE = O.readFloatBE, e.readDoubleLE = O.readDoubleLE, e.readDoubleBE = O.readDoubleBE, e.writeUInt8 = O.writeUInt8, e.writeUInt16LE = O.writeUInt16LE, e.writeUInt16BE = O.writeUInt16BE, e.writeUInt32LE = O.writeUInt32LE, e.writeUInt32BE = O.writeUInt32BE, e.writeInt8 = O.writeInt8, e.writeInt16LE = O.writeInt16LE, e.writeInt16BE = O.writeInt16BE, e.writeInt32LE = O.writeInt32LE, e.writeInt32BE = O.writeInt32BE, e.writeFloatLE = O.writeFloatLE, e.writeFloatBE = O.writeFloatBE, e.writeDoubleLE = O.writeDoubleLE, e.writeDoubleBE = O.writeDoubleBE, e.fill = O.fill, e.inspect = O.inspect, e.toArrayBuffer = O.toArrayBuffer, e;
					};
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/buffer/index.js", "/node_modules/gulp-browserify/node_modules/buffer");
			}, {
				"base64-js": 2,
				buffer: 3,
				ieee754: 10,
				lYpoI2: 11
			}],
			4: [function(e, t, n) {
				(function(n, r, i, a, o, s, c, l, u) {
					var i = e("buffer").Buffer, d = 4, f = new i(d);
					f.fill(0), t.exports = { hash: function(e, t, n, r) {
						for (var a = t(function(e, t) {
							e.length % d != 0 && (n = e.length + (d - e.length % d), e = i.concat([e, f], n));
							for (var n, r = [], a = t ? e.readInt32BE : e.readInt32LE, o = 0; o < e.length; o += d) r.push(a.call(e, o));
							return r;
						}(e = i.isBuffer(e) ? e : new i(e), r), 8 * e.length), t = r, o = new i(n), s = t ? o.writeInt32BE : o.writeInt32LE, c = 0; c < a.length; c++) s.call(o, a[c], 4 * c, !0);
						return o;
					} };
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/helpers.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				buffer: 3,
				lYpoI2: 11
			}],
			5: [function(e, t, n) {
				(function(t, r, i, a, o, s, c, l, u) {
					var i = e("buffer").Buffer, d = e("./sha"), f = e("./sha256"), p = e("./rng"), m = {
						sha1: d,
						sha256: f,
						md5: e("./md5")
					}, h = 64, g = new i(h);
					function _(e, t) {
						var n = m[e ||= "sha1"], r = [];
						return n || v("algorithm:", e, "is not yet supported"), {
							update: function(e) {
								return i.isBuffer(e) || (e = new i(e)), r.push(e), e.length, this;
							},
							digest: function(e) {
								var a = i.concat(r), a = t ? function(e, t, n) {
									i.isBuffer(t) || (t = new i(t)), i.isBuffer(n) || (n = new i(n)), t.length > h ? t = e(t) : t.length < h && (t = i.concat([t, g], h));
									for (var r = new i(h), a = new i(h), o = 0; o < h; o++) r[o] = 54 ^ t[o], a[o] = 92 ^ t[o];
									return n = e(i.concat([r, n])), e(i.concat([a, n]));
								}(n, t, a) : n(a);
								return r = null, e ? a.toString(e) : a;
							}
						};
					}
					function v() {
						var e = [].slice.call(arguments).join(" ");
						throw Error([
							e,
							"we accept pull requests",
							"http://github.com/dominictarr/crypto-browserify"
						].join("\n"));
					}
					g.fill(0), n.createHash = function(e) {
						return _(e);
					}, n.createHmac = _, n.randomBytes = function(e, t) {
						if (!t || !t.call) return new i(p(e));
						try {
							t.call(this, void 0, new i(p(e)));
						} catch (e) {
							t(e);
						}
					};
					var y, b = [
						"createCredentials",
						"createCipher",
						"createCipheriv",
						"createDecipher",
						"createDecipheriv",
						"createSign",
						"createVerify",
						"createDiffieHellman",
						"pbkdf2"
					], x = function(e) {
						n[e] = function() {
							v("sorry,", e, "is not implemented yet");
						};
					};
					for (y in b) x(b[y], y);
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/index.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				"./md5": 6,
				"./rng": 7,
				"./sha": 8,
				"./sha256": 9,
				buffer: 3,
				lYpoI2: 11
			}],
			6: [function(e, t, n) {
				(function(n, r, i, a, o, s, c, l, u) {
					var d = e("./helpers");
					function f(e, t) {
						e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
						for (var n = 1732584193, r = -271733879, i = -1732584194, a = 271733878, o = 0; o < e.length; o += 16) {
							var s = n, c = r, l = i, u = a, n = m(n, r, i, a, e[o + 0], 7, -680876936), a = m(a, n, r, i, e[o + 1], 12, -389564586), i = m(i, a, n, r, e[o + 2], 17, 606105819), r = m(r, i, a, n, e[o + 3], 22, -1044525330);
							n = m(n, r, i, a, e[o + 4], 7, -176418897), a = m(a, n, r, i, e[o + 5], 12, 1200080426), i = m(i, a, n, r, e[o + 6], 17, -1473231341), r = m(r, i, a, n, e[o + 7], 22, -45705983), n = m(n, r, i, a, e[o + 8], 7, 1770035416), a = m(a, n, r, i, e[o + 9], 12, -1958414417), i = m(i, a, n, r, e[o + 10], 17, -42063), r = m(r, i, a, n, e[o + 11], 22, -1990404162), n = m(n, r, i, a, e[o + 12], 7, 1804603682), a = m(a, n, r, i, e[o + 13], 12, -40341101), i = m(i, a, n, r, e[o + 14], 17, -1502002290), n = h(n, r = m(r, i, a, n, e[o + 15], 22, 1236535329), i, a, e[o + 1], 5, -165796510), a = h(a, n, r, i, e[o + 6], 9, -1069501632), i = h(i, a, n, r, e[o + 11], 14, 643717713), r = h(r, i, a, n, e[o + 0], 20, -373897302), n = h(n, r, i, a, e[o + 5], 5, -701558691), a = h(a, n, r, i, e[o + 10], 9, 38016083), i = h(i, a, n, r, e[o + 15], 14, -660478335), r = h(r, i, a, n, e[o + 4], 20, -405537848), n = h(n, r, i, a, e[o + 9], 5, 568446438), a = h(a, n, r, i, e[o + 14], 9, -1019803690), i = h(i, a, n, r, e[o + 3], 14, -187363961), r = h(r, i, a, n, e[o + 8], 20, 1163531501), n = h(n, r, i, a, e[o + 13], 5, -1444681467), a = h(a, n, r, i, e[o + 2], 9, -51403784), i = h(i, a, n, r, e[o + 7], 14, 1735328473), n = g(n, r = h(r, i, a, n, e[o + 12], 20, -1926607734), i, a, e[o + 5], 4, -378558), a = g(a, n, r, i, e[o + 8], 11, -2022574463), i = g(i, a, n, r, e[o + 11], 16, 1839030562), r = g(r, i, a, n, e[o + 14], 23, -35309556), n = g(n, r, i, a, e[o + 1], 4, -1530992060), a = g(a, n, r, i, e[o + 4], 11, 1272893353), i = g(i, a, n, r, e[o + 7], 16, -155497632), r = g(r, i, a, n, e[o + 10], 23, -1094730640), n = g(n, r, i, a, e[o + 13], 4, 681279174), a = g(a, n, r, i, e[o + 0], 11, -358537222), i = g(i, a, n, r, e[o + 3], 16, -722521979), r = g(r, i, a, n, e[o + 6], 23, 76029189), n = g(n, r, i, a, e[o + 9], 4, -640364487), a = g(a, n, r, i, e[o + 12], 11, -421815835), i = g(i, a, n, r, e[o + 15], 16, 530742520), n = _(n, r = g(r, i, a, n, e[o + 2], 23, -995338651), i, a, e[o + 0], 6, -198630844), a = _(a, n, r, i, e[o + 7], 10, 1126891415), i = _(i, a, n, r, e[o + 14], 15, -1416354905), r = _(r, i, a, n, e[o + 5], 21, -57434055), n = _(n, r, i, a, e[o + 12], 6, 1700485571), a = _(a, n, r, i, e[o + 3], 10, -1894986606), i = _(i, a, n, r, e[o + 10], 15, -1051523), r = _(r, i, a, n, e[o + 1], 21, -2054922799), n = _(n, r, i, a, e[o + 8], 6, 1873313359), a = _(a, n, r, i, e[o + 15], 10, -30611744), i = _(i, a, n, r, e[o + 6], 15, -1560198380), r = _(r, i, a, n, e[o + 13], 21, 1309151649), n = _(n, r, i, a, e[o + 4], 6, -145523070), a = _(a, n, r, i, e[o + 11], 10, -1120210379), i = _(i, a, n, r, e[o + 2], 15, 718787259), r = _(r, i, a, n, e[o + 9], 21, -343485551), n = v(n, s), r = v(r, c), i = v(i, l), a = v(a, u);
						}
						return [
							n,
							r,
							i,
							a
						];
					}
					function p(e, t, n, r, i, a) {
						return v((t = v(v(t, e), v(r, a))) << i | t >>> 32 - i, n);
					}
					function m(e, t, n, r, i, a, o) {
						return p(t & n | ~t & r, e, t, i, a, o);
					}
					function h(e, t, n, r, i, a, o) {
						return p(t & r | n & ~r, e, t, i, a, o);
					}
					function g(e, t, n, r, i, a, o) {
						return p(t ^ n ^ r, e, t, i, a, o);
					}
					function _(e, t, n, r, i, a, o) {
						return p(n ^ (t | ~r), e, t, i, a, o);
					}
					function v(e, t) {
						var n = (65535 & e) + (65535 & t);
						return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
					}
					t.exports = function(e) {
						return d.hash(e, f, 16);
					};
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/md5.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				"./helpers": 4,
				buffer: 3,
				lYpoI2: 11
			}],
			7: [function(e, t, n) {
				(function(e, n, r, i, a, o, s, c, l) {
					var u;
					t.exports = u || function(e) {
						for (var t, n = Array(e), r = 0; r < e; r++) !(3 & r) && (t = 4294967296 * Math.random()), n[r] = t >>> ((3 & r) << 3) & 255;
						return n;
					};
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/rng.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				buffer: 3,
				lYpoI2: 11
			}],
			8: [function(e, t, n) {
				(function(n, r, i, a, o, s, c, l, u) {
					var d = e("./helpers");
					function f(e, t) {
						e[t >> 5] |= 128 << 24 - t % 32, e[15 + (t + 64 >> 9 << 4)] = t;
						for (var n, r, i, a = Array(80), o = 1732584193, s = -271733879, c = -1732584194, l = 271733878, u = -1009589776, d = 0; d < e.length; d += 16) {
							for (var f = o, h = s, g = c, _ = l, v = u, y = 0; y < 80; y++) {
								a[y] = y < 16 ? e[d + y] : m(a[y - 3] ^ a[y - 8] ^ a[y - 14] ^ a[y - 16], 1);
								var b = p(p(m(o, 5), (b = s, r = c, i = l, (n = y) < 20 ? b & r | ~b & i : !(n < 40) && n < 60 ? b & r | b & i | r & i : b ^ r ^ i)), p(p(u, a[y]), (n = y) < 20 ? 1518500249 : n < 40 ? 1859775393 : n < 60 ? -1894007588 : -899497514)), u = l, l = c, c = m(s, 30), s = o, o = b;
							}
							o = p(o, f), s = p(s, h), c = p(c, g), l = p(l, _), u = p(u, v);
						}
						return [
							o,
							s,
							c,
							l,
							u
						];
					}
					function p(e, t) {
						var n = (65535 & e) + (65535 & t);
						return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
					}
					function m(e, t) {
						return e << t | e >>> 32 - t;
					}
					t.exports = function(e) {
						return d.hash(e, f, 20, !0);
					};
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				"./helpers": 4,
				buffer: 3,
				lYpoI2: 11
			}],
			9: [function(e, t, n) {
				(function(n, r, i, a, o, s, c, l, u) {
					function d(e, t) {
						var n = (65535 & e) + (65535 & t);
						return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
					}
					function f(e, t) {
						var n, r = [
							1116352408,
							1899447441,
							3049323471,
							3921009573,
							961987163,
							1508970993,
							2453635748,
							2870763221,
							3624381080,
							310598401,
							607225278,
							1426881987,
							1925078388,
							2162078206,
							2614888103,
							3248222580,
							3835390401,
							4022224774,
							264347078,
							604807628,
							770255983,
							1249150122,
							1555081692,
							1996064986,
							2554220882,
							2821834349,
							2952996808,
							3210313671,
							3336571891,
							3584528711,
							113926993,
							338241895,
							666307205,
							773529912,
							1294757372,
							1396182291,
							1695183700,
							1986661051,
							2177026350,
							2456956037,
							2730485921,
							2820302411,
							3259730800,
							3345764771,
							3516065817,
							3600352804,
							4094571909,
							275423344,
							430227734,
							506948616,
							659060556,
							883997877,
							958139571,
							1322822218,
							1537002063,
							1747873779,
							1955562222,
							2024104815,
							2227730452,
							2361852424,
							2428436474,
							2756734187,
							3204031479,
							3329325298
						], i = [
							1779033703,
							3144134277,
							1013904242,
							2773480762,
							1359893119,
							2600822924,
							528734635,
							1541459225
						], a = Array(64);
						e[t >> 5] |= 128 << 24 - t % 32, e[15 + (t + 64 >> 9 << 4)] = t;
						for (var o, s, c = 0; c < e.length; c += 16) {
							for (var l = i[0], u = i[1], f = i[2], p = i[3], g = i[4], _ = i[5], v = i[6], y = i[7], b = 0; b < 64; b++) a[b] = b < 16 ? e[b + c] : d(d(d((s = a[b - 2], m(s, 17) ^ m(s, 19) ^ h(s, 10)), a[b - 7]), (s = a[b - 15], m(s, 7) ^ m(s, 18) ^ h(s, 3))), a[b - 16]), n = d(d(d(d(y, m(s = g, 6) ^ m(s, 11) ^ m(s, 25)), g & _ ^ ~g & v), r[b]), a[b]), o = d(m(o = l, 2) ^ m(o, 13) ^ m(o, 22), l & u ^ l & f ^ u & f), y = v, v = _, _ = g, g = d(p, n), p = f, f = u, u = l, l = d(n, o);
							i[0] = d(l, i[0]), i[1] = d(u, i[1]), i[2] = d(f, i[2]), i[3] = d(p, i[3]), i[4] = d(g, i[4]), i[5] = d(_, i[5]), i[6] = d(v, i[6]), i[7] = d(y, i[7]);
						}
						return i;
					}
					var p = e("./helpers"), m = function(e, t) {
						return e >>> t | e << 32 - t;
					}, h = function(e, t) {
						return e >>> t;
					};
					t.exports = function(e) {
						return p.hash(e, f, 32, !0);
					};
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha256.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				"./helpers": 4,
				buffer: 3,
				lYpoI2: 11
			}],
			10: [function(e, t, n) {
				(function(e, t, r, i, a, o, s, c, l) {
					n.read = function(e, t, n, r, i) {
						var a, o, s = 8 * i - r - 1, c = (1 << s) - 1, l = c >> 1, u = -7, d = n ? i - 1 : 0, f = n ? -1 : 1, i = e[t + d];
						for (d += f, a = i & (1 << -u) - 1, i >>= -u, u += s; 0 < u; a = 256 * a + e[t + d], d += f, u -= 8);
						for (o = a & (1 << -u) - 1, a >>= -u, u += r; 0 < u; o = 256 * o + e[t + d], d += f, u -= 8);
						if (a === 0) a = 1 - l;
						else {
							if (a === c) return o ? NaN : Infinity * (i ? -1 : 1);
							o += 2 ** r, a -= l;
						}
						return (i ? -1 : 1) * o * 2 ** (a - r);
					}, n.write = function(e, t, n, r, i, a) {
						var o, s, c = 8 * a - i - 1, l = (1 << c) - 1, u = l >> 1, d = i === 23 ? 2 ** -24 - 2 ** -77 : 0, f = r ? 0 : a - 1, p = r ? 1 : -1, a = +(t < 0 || t === 0 && 1 / t < 0);
						for (t = Math.abs(t), isNaN(t) || t === Infinity ? (s = +!!isNaN(t), o = l) : (o = Math.floor(Math.log(t) / Math.LN2), t * (r = 2 ** -o) < 1 && (o--, r *= 2), 2 <= (t += 1 <= o + u ? d / r : d * 2 ** (1 - u)) * r && (o++, r /= 2), l <= o + u ? (s = 0, o = l) : 1 <= o + u ? (s = (t * r - 1) * 2 ** i, o += u) : (s = t * 2 ** (u - 1) * 2 ** i, o = 0)); 8 <= i; e[n + f] = 255 & s, f += p, s /= 256, i -= 8);
						for (o = o << i | s, c += i; 0 < c; e[n + f] = 255 & o, f += p, o /= 256, c -= 8);
						e[n + f - p] |= 128 * a;
					};
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/ieee754/index.js", "/node_modules/gulp-browserify/node_modules/ieee754");
			}, {
				buffer: 3,
				lYpoI2: 11
			}],
			11: [function(e, t, n) {
				(function(e, n, r, i, a, o, s, c, l) {
					var u, d, f;
					function p() {}
					(e = t.exports = {}).nextTick = (d = typeof window < "u" && window.setImmediate, f = typeof window < "u" && window.postMessage && window.addEventListener, d ? function(e) {
						return window.setImmediate(e);
					} : f ? (u = [], window.addEventListener("message", function(e) {
						var t = e.source;
						t !== window && t !== null || e.data !== "process-tick" || (e.stopPropagation(), 0 < u.length && u.shift()());
					}, !0), function(e) {
						u.push(e), window.postMessage("process-tick", "*");
					}) : function(e) {
						setTimeout(e, 0);
					}), e.title = "browser", e.browser = !0, e.env = {}, e.argv = [], e.on = p, e.addListener = p, e.once = p, e.off = p, e.removeListener = p, e.removeAllListeners = p, e.emit = p, e.binding = function(e) {
						throw Error("process.binding is not supported");
					}, e.cwd = function() {
						return "/";
					}, e.chdir = function(e) {
						throw Error("process.chdir is not supported");
					};
				}).call(this, e("lYpoI2"), typeof self < "u" ? self : typeof window < "u" ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/process/browser.js", "/node_modules/gulp-browserify/node_modules/process");
			}, {
				buffer: 3,
				lYpoI2: 11
			}]
		}, {}, [1])(1);
	});
})), Ze = typeof navigator < "u" && navigator.userAgent.toLowerCase().indexOf("firefox") > 0;
function Qe(e, t, n, r) {
	e.addEventListener ? e.addEventListener(t, n, r) : e.attachEvent && e.attachEvent(`on${t}`, n);
}
function V(e, t, n, r) {
	e && (e.removeEventListener ? e.removeEventListener(t, n, r) : e.detachEvent && e.detachEvent(`on${t}`, n));
}
function $e(e, t) {
	let n = t.slice(0, t.length - 1), r = [];
	for (let t = 0; t < n.length; t++) r.push(e[n[t].toLowerCase()]);
	return r;
}
function et(e) {
	typeof e != "string" && (e = ""), e = e.replace(/\s/g, "");
	let t = e.split(","), n = t.lastIndexOf("");
	for (; n >= 0;) t[n - 1] += ",", t.splice(n, 1), n = t.lastIndexOf("");
	return t;
}
function tt(e, t) {
	let n = e.length >= t.length ? e : t, r = e.length >= t.length ? t : e, i = !0;
	for (let e = 0; e < n.length; e++) r.indexOf(n[e]) === -1 && (i = !1);
	return i;
}
function nt(e) {
	let t = e.keyCode || e.which || e.charCode;
	return e.key && /^[a-z]$/i.test(e.key) ? e.key.toUpperCase().charCodeAt(0) : (e.code && /^Key[A-Z]$/.test(e.code) && (t = e.code.charCodeAt(3)), t);
}
var H = {
	backspace: 8,
	"⌫": 8,
	tab: 9,
	clear: 12,
	enter: 13,
	"↩": 13,
	return: 13,
	esc: 27,
	escape: 27,
	space: 32,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	arrowup: 38,
	arrowdown: 40,
	arrowleft: 37,
	arrowright: 39,
	del: 46,
	delete: 46,
	ins: 45,
	insert: 45,
	home: 36,
	end: 35,
	pageup: 33,
	pagedown: 34,
	capslock: 20,
	num_0: 96,
	num_1: 97,
	num_2: 98,
	num_3: 99,
	num_4: 100,
	num_5: 101,
	num_6: 102,
	num_7: 103,
	num_8: 104,
	num_9: 105,
	num_multiply: 106,
	num_add: 107,
	num_enter: 108,
	num_subtract: 109,
	num_decimal: 110,
	num_divide: 111,
	"⇪": 20,
	",": 188,
	".": 190,
	"/": 191,
	"`": 192,
	"-": Ze ? 173 : 189,
	"=": Ze ? 61 : 187,
	";": Ze ? 59 : 186,
	"'": 222,
	"{": 219,
	"}": 221,
	"[": 219,
	"]": 221,
	"\\": 220
}, U = {
	"⇧": 16,
	shift: 16,
	"⌥": 18,
	alt: 18,
	option: 18,
	"⌃": 17,
	ctrl: 17,
	control: 17,
	"⌘": 91,
	cmd: 91,
	meta: 91,
	command: 91
}, W = {
	16: "shiftKey",
	18: "altKey",
	17: "ctrlKey",
	91: "metaKey",
	shiftKey: 16,
	ctrlKey: 17,
	altKey: 18,
	metaKey: 91
}, G = {
	16: !1,
	18: !1,
	17: !1,
	91: !1
}, K = {};
for (let e = 1; e < 20; e++) H[`f${e}`] = 111 + e;
var q = [], J = null, Y = null, rt = "all", X = /* @__PURE__ */ new Map(), Z = (e) => H[e.toLowerCase()] || U[e.toLowerCase()] || e.toUpperCase().charCodeAt(0), it = (e) => Object.keys(H).find((t) => H[t] === e), at = (e) => Object.keys(U).find((t) => U[t] === e), ot = (e) => {
	rt = e || "all";
}, Q = () => rt || "all", st = () => q.slice(0), ct = () => q.map((e) => it(e) || at(e) || String.fromCharCode(e)), lt = () => {
	let e = [];
	return Object.keys(K).forEach((t) => {
		K[t].forEach(({ key: t, scope: n, mods: r, shortcut: i }) => {
			e.push({
				scope: n,
				shortcut: i,
				mods: r,
				keys: t.split("+").map((e) => Z(e))
			});
		});
	}), e;
}, ut = (e) => {
	let t = e.target || e.srcElement, { tagName: n } = t, r = !0, i = n === "INPUT" && ![
		"checkbox",
		"radio",
		"range",
		"button",
		"file",
		"reset",
		"submit",
		"color"
	].includes(t.type);
	return (t.isContentEditable || (i || n === "TEXTAREA" || n === "SELECT") && !t.readOnly) && (r = !1), r;
}, dt = (e) => (typeof e == "string" && (e = Z(e)), q.indexOf(e) !== -1), ft = (e, t) => {
	let n, r;
	e ||= Q();
	for (let t in K) if (Object.prototype.hasOwnProperty.call(K, t)) for (n = K[t], r = 0; r < n.length;) n[r].scope === e ? n.splice(r, 1).forEach(({ element: e }) => yt(e)) : r++;
	Q() === e && ot(t || "all");
};
function pt(e) {
	let t = nt(e);
	e.key && e.key.toLowerCase() === "capslock" && (t = Z(e.key));
	let n = q.indexOf(t);
	if (n >= 0 && q.splice(n, 1), e.key && e.key.toLowerCase() === "meta" && q.splice(0, q.length), (t === 93 || t === 224) && (t = 91), t in G) {
		G[t] = !1;
		for (let e in U) U[e] === t && ($[e] = !1);
	}
}
var mt = (e, ...t) => {
	if (e === void 0) Object.keys(K).forEach((e) => {
		Array.isArray(K[e]) && K[e].forEach((e) => ht(e)), delete K[e];
	}), yt(null);
	else if (Array.isArray(e)) e.forEach((e) => {
		e.key && ht(e);
	});
	else if (typeof e == "object") e.key && ht(e);
	else if (typeof e == "string") {
		let [n, r] = t;
		typeof n == "function" && (r = n, n = ""), ht({
			key: e,
			scope: n,
			method: r,
			splitKey: "+"
		});
	}
}, ht = ({ key: e, scope: t, method: n, splitKey: r = "+" }) => {
	et(e).forEach((e) => {
		let i = e.split(r), a = i.length, o = i[a - 1], s = o === "*" ? "*" : Z(o);
		if (!K[s]) return;
		t ||= Q();
		let c = a > 1 ? $e(U, i) : [], l = [];
		K[s] = K[s].filter((e) => {
			let r = (!n || e.method === n) && e.scope === t && tt(e.mods, c);
			return r && l.push(e.element), !r;
		}), l.forEach((e) => yt(e));
	});
};
function gt(e, t, n, r) {
	if (t.element !== r) return;
	let i;
	if (t.scope === n || t.scope === "all") {
		i = t.mods.length > 0;
		for (let e in G) Object.prototype.hasOwnProperty.call(G, e) && (!G[e] && t.mods.indexOf(+e) > -1 || G[e] && t.mods.indexOf(+e) === -1) && (i = !1);
		(t.mods.length === 0 && !G[16] && !G[18] && !G[17] && !G[91] || i || t.shortcut === "*") && (t.keys = [], t.keys = t.keys.concat(q), t.method(e, t) === !1 && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, e.stopPropagation && e.stopPropagation(), e.cancelBubble &&= !0));
	}
}
function _t(e, t) {
	let n = K["*"], r = nt(e);
	if (e.key && e.key.toLowerCase() === "capslock" || !($.filter || ut).call(this, e)) return;
	if ((r === 93 || r === 224) && (r = 91), q.indexOf(r) === -1 && r !== 229 && q.push(r), [
		"metaKey",
		"ctrlKey",
		"altKey",
		"shiftKey"
	].forEach((t) => {
		let n = W[t];
		e[t] && q.indexOf(n) === -1 ? q.push(n) : !e[t] && q.indexOf(n) > -1 ? q.splice(q.indexOf(n), 1) : t === "metaKey" && e[t] && (q = q.filter((e) => e in W || e === r));
	}), r in G) {
		G[r] = !0;
		for (let t in U) Object.prototype.hasOwnProperty.call(U, t) && ($[t] = e[W[U[t]]]);
		if (!n) return;
	}
	for (let t in G) Object.prototype.hasOwnProperty.call(G, t) && (G[t] = e[W[t]]);
	e.getModifierState && !(e.altKey && !e.ctrlKey) && e.getModifierState("AltGraph") && (q.indexOf(17) === -1 && q.push(17), q.indexOf(18) === -1 && q.push(18), G[17] = !0, G[18] = !0);
	let i = Q();
	if (n) for (let r = 0; r < n.length; r++) n[r].scope === i && (e.type === "keydown" && n[r].keydown || e.type === "keyup" && n[r].keyup) && gt(e, n[r], i, t);
	if (!(r in K)) return;
	let a = K[r], o = a.length;
	for (let n = 0; n < o; n++) if ((e.type === "keydown" && a[n].keydown || e.type === "keyup" && a[n].keyup) && a[n].key) {
		let r = a[n], { splitKey: o } = r, s = r.key.split(o), c = [];
		for (let e = 0; e < s.length; e++) c.push(Z(s[e]));
		c.sort().join("") === q.sort().join("") && gt(e, r, i, t);
	}
}
var $ = function e(t, n, r) {
	q = [];
	let i = et(t), a = [], o = "all", s = document, c = 0, l = !1, u = !0, d = "+", f = !1, p = !1;
	if (r === void 0 && typeof n == "function" && (r = n), Object.prototype.toString.call(n) === "[object Object]") {
		let e = n;
		e.scope && (o = e.scope), e.element && (s = e.element), e.keyup && (l = e.keyup), e.keydown !== void 0 && (u = e.keydown), e.capture !== void 0 && (f = e.capture), typeof e.splitKey == "string" && (d = e.splitKey), e.single === !0 && (p = !0);
	}
	for (typeof n == "string" && (o = n), p && mt(t, o); c < i.length; c++) {
		let e = i[c].split(d);
		a = [], e.length > 1 && (a = $e(U, e));
		let t = e[e.length - 1];
		t = t === "*" ? "*" : Z(t), t in K || (K[t] = []), K[t].push({
			keyup: l,
			keydown: u,
			scope: o,
			mods: a,
			shortcut: i[c],
			method: r,
			key: i[c],
			splitKey: d,
			element: s
		});
	}
	if (s !== void 0 && typeof window < "u") {
		if (!X.has(s)) {
			let e = (e = window.event) => _t(e, s), t = (e = window.event) => {
				_t(e, s), pt(e);
			};
			X.set(s, {
				keydownListener: e,
				keyupListenr: t,
				capture: f
			}), Qe(s, "keydown", e, f), Qe(s, "keyup", t, f);
		}
		if (!J) {
			let e = () => {
				q = [];
			};
			J = {
				listener: e,
				capture: f
			}, Qe(window, "focus", e, f);
		}
		if (!Y && typeof document < "u") {
			let t = () => {
				q = [];
				for (let e in G) G[e] = !1;
				for (let t in U) e[t] = !1;
			}, n = t, r = t;
			document.addEventListener("fullscreenchange", n), document.addEventListener("webkitfullscreenchange", r), Y = {
				fullscreen: n,
				webkit: r
			};
		}
	}
};
function vt(e, t = "all") {
	Object.keys(K).forEach((n) => {
		K[n].filter((n) => n.scope === t && n.shortcut === e).forEach((e) => {
			e && e.method && e.method({}, e);
		});
	});
}
function yt(e) {
	let t = Object.values(K).flat();
	if (t.findIndex(({ element: t }) => t === e) < 0 && e) {
		let { keydownListener: t, keyupListenr: n, capture: r } = X.get(e) || {};
		t && n && (V(e, "keyup", n, r), V(e, "keydown", t, r), X.delete(e));
	}
	if (t.length <= 0 || X.size <= 0) {
		if (Array.from(X.keys()).forEach((e) => {
			let { keydownListener: t, keyupListenr: n, capture: r } = X.get(e) || {};
			t && n && (V(e, "keyup", n, r), V(e, "keydown", t, r), X.delete(e));
		}), X.clear(), Object.keys(K).forEach((e) => delete K[e]), J) {
			let { listener: e, capture: t } = J;
			V(window, "focus", e, t), J = null;
		}
		Y && typeof document < "u" && (document.removeEventListener("fullscreenchange", Y.fullscreen), document.removeEventListener("webkitfullscreenchange", Y.webkit), Y = null);
	}
}
var bt = {
	getPressedKeyString: ct,
	setScope: ot,
	getScope: Q,
	deleteScope: ft,
	getPressedKeyCodes: st,
	getAllKeyCodes: lt,
	isPressed: dt,
	filter: ut,
	trigger: vt,
	unbind: mt,
	keyMap: H,
	modifier: U,
	modifierMap: W
};
for (let e in bt) {
	let t = e;
	Object.prototype.hasOwnProperty.call(bt, t) && ($[t] = bt[t]);
}
if (typeof window < "u") {
	let e = window.hotkeys;
	$.noConflict = (t) => (t && window.hotkeys === $ && (window.hotkeys = e), $), window.hotkeys = $;
}
//#endregion
//#region src/store/shortcut-store.ts
var xt = /* @__PURE__ */ l(Xe()), St = [
	{
		event: "SHOW_IMPORT_DIALOG",
		key: "ctrl+i, command+i",
		scopes: ["NORMAL", "EDITOR"],
		name: "Show Import Dialog",
		description: "Show import dialog"
	},
	{
		event: "TOGGLE_MATERIAL_SEARCH",
		key: "shift+m",
		scopes: ["NORMAL", "EDITOR"],
		name: "Toggle Material Search",
		description: "Toggle material search"
	},
	{
		event: "TOGGLE_CAMERA_ORTHO",
		key: "shift+o",
		scopes: ["NORMAL", "EDITOR"],
		name: "Toggle Camera Ortho",
		description: "Toggle camera ortho"
	},
	{
		event: "UNDO",
		key: "ctrl+z, command+z",
		scopes: ["NORMAL", "EDITOR"],
		name: "Undo",
		description: "Undo"
	},
	{
		event: "REDO",
		key: "ctrl+shift+z, command+shift+z",
		scopes: ["NORMAL", "EDITOR"],
		name: "Redo",
		description: "Redo"
	},
	{
		event: "MOVE_SELECTED_OBJECTS",
		key: "m",
		scopes: ["EDITOR"],
		name: "Move Selected Objects",
		description: "Move selected objects"
	},
	{
		event: "FOCUS_ON_SELECTED_OBJECTS",
		key: "f",
		scopes: ["EDITOR"],
		name: "Focus On Selected Objects",
		description: "Focus on selected objects"
	},
	{
		event: "FOCUS_ON_CURSOR",
		key: "shift+f",
		scopes: ["EDITOR"],
		name: "Focus On Cursor",
		description: "Focus on cursor"
	},
	{
		event: "PHASE_OUT",
		key: "escape",
		scopes: [
			"EDITOR",
			"EDITOR_MOVING",
			"FIRST_PERSON"
		],
		name: "Phase Out",
		description: "Phase out"
	}
], Ct = h((e) => ({
	shortcuts: new Map(St.map((e) => [(0, xt.default)(e), e])),
	set: (t) => e(s(t))
}));
i("REGISTER_SHORTCUTS", () => {
	$.unbind(), Ct.getState().shortcuts.forEach((e) => {
		e.scopes.forEach((t) => {
			$(e.key, t, (t) => {
				p(e.event, e.args);
			});
		});
	});
});
//#endregion
//#region src/store/io.ts
var wt = /* @__PURE__ */ l(f()), Tt = () => {
	let e = a.getState().solvers, t = y.getState().containers, { projectName: n, version: r } = z.getState(), i = [], o = [];
	return Object.keys(t).forEach((e) => {
		i.push(t[e].save());
	}), Object.keys(e).forEach((t) => {
		o.push(e[t].save());
	}), {
		meta: {
			version: r,
			name: n,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		},
		containers: i,
		solvers: o
	};
};
i("SAVE", (e) => {
	let t = Tt(), n = new Blob([JSON.stringify(t)], { type: "application/json" }), r = t.meta.name;
	wt.default.saveAs(n, `${r}.json`), p("MARK_CLEAN", void 0), e && e();
});
var Et = () => {
	let e = document.createElement("input");
	return e.type = "file", e.accept = "application/json", e.setAttribute("style", "display: none"), e;
}, Dt = (e) => {
	let t = Et();
	document.body.appendChild(t), t.addEventListener("change", async (n) => {
		let r = n.target.files;
		if (!r) {
			t.remove(), e(void 0);
			return;
		}
		e(r);
	}), t.click();
};
i("OPEN", async (e) => {
	let { hasUnsavedChanges: t } = z.getState();
	if (t && !confirm("Open a file? Unsaved data will be lost.")) {
		e && e();
		return;
	}
	Dt(async (t) => {
		if (!t) return;
		let n = URL.createObjectURL(t[0]);
		try {
			let e = await (await fetch(n)).text(), r = JSON.parse(e);
			p("RESTORE", {
				file: t[0],
				json: r
			});
		} catch (e) {
			console.warn(e);
		}
		p("RENDERER_SHOULD_ANIMATE", !0), e && e();
	});
}), i("NEW", (e) => {
	let { hasUnsavedChanges: t, version: n } = z.getState(), r = !t || confirm("Create a new project? Unsaved data will be lost.");
	if (r) {
		let e = { json: {
			containers: [],
			solvers: [],
			meta: {
				name: "untitled",
				version: n,
				timestamp: (/* @__PURE__ */ new Date()).toJSON()
			}
		} };
		p("RESTORE", e);
	}
	e && e(r);
}), i("RESTORE", ({ json: e }) => {
	p("DESELECT_ALL_OBJECTS"), p("RESTORE_CONTAINERS", e.containers), p("RESTORE_SOLVERS", e.solvers), z.getState().set((t) => {
		t.projectName = e.meta.name, t.hasUnsavedChanges = !1;
	});
});
//#endregion
//#region src/store/index.ts
var Ot = () => {
	console.log("[Store] Resetting all stores..."), T(), u(), Ue(), Re(), Be(), Ke(), Ye(), console.log("[Store] All stores reset complete");
};
//#endregion
export { B as a, Le as c, b as d, C as f, y as g, S as h, Ve as i, Ie as l, x as m, $ as n, z as o, w as p, Je as r, ze as s, Ot as t, Fe as u };

//# sourceMappingURL=store-DRnKXLf0.mjs.map