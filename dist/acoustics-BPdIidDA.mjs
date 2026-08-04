import { w as e } from "./FileSaver.min-BS9rdHrk.mjs";
//#region src/compute/acoustics/std/bands.ts
var t = [
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
], n = [
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
], r = [
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
], i = (e, t, n) => {
	let r = [e];
	for (let i = 0; i < Math.floor((n - e) / t); i++) r.push(r[i] + t);
	return r;
};
(/* @__PURE__ */ e(((e, t) => {
	var n = function(e, t) {
		this.real = e, this.im = t;
	}, r = n.prototype = {
		fromRect: function(e, t) {
			return this.real = e, this.im = t, this;
		},
		fromPolar: function(e, t) {
			if (typeof e == "string") {
				var n = e.split(" ");
				e = n[0], t = n[1];
			}
			return this.fromRect(e * Math.cos(t), e * Math.sin(t));
		},
		toPrecision: function(e) {
			return this.fromRect(this.real.toPrecision(e), this.im.toPrecision(e));
		},
		toFixed: function(e) {
			return this.fromRect(this.real.toFixed(e), this.im.toFixed(e));
		},
		finalize: function() {
			return this.fromRect = function(e, t) {
				return new n(e, t);
			}, Object.defineProperty && (Object.defineProperty(this, "real", {
				writable: !1,
				value: this.real
			}), Object.defineProperty(this, "im", {
				writable: !1,
				value: this.im
			})), this;
		},
		magnitude: function() {
			var e = this.real, t = this.im;
			return Math.sqrt(e * e + t * t);
		},
		angle: function() {
			return Math.atan2(this.im, this.real);
		},
		conjugate: function() {
			return this.fromRect(this.real, -this.im);
		},
		negate: function() {
			return this.fromRect(-this.real, -this.im);
		},
		multiply: function(e) {
			e = n.from(e);
			var t = this.real, r = this.im;
			return this.fromRect(e.real * t - e.im * r, r * e.real + e.im * t);
		},
		divide: function(e) {
			e = n.from(e);
			var t = e.real ** 2 + e.im ** 2, r = this.real, i = this.im;
			return this.fromRect((r * e.real + i * e.im) / t, (i * e.real - r * e.im) / t);
		},
		add: function(e) {
			return e = n.from(e), this.fromRect(this.real + e.real, this.im + e.im);
		},
		subtract: function(e) {
			return e = n.from(e), this.fromRect(this.real - e.real, this.im - e.im);
		},
		pow: function(e) {
			e = n.from(e);
			var t = e.multiply(this.clone().log()).exp();
			return this.fromRect(t.real, t.im);
		},
		sqrt: function() {
			var e = this.magnitude(), t = this.im < 0 ? -1 : 1;
			return this.fromRect(Math.sqrt((e + this.real) / 2), t * Math.sqrt((e - this.real) / 2));
		},
		log: function(e) {
			return e ||= 0, this.fromRect(Math.log(this.magnitude()), this.angle() + e * 2 * Math.PI);
		},
		exp: function() {
			return this.fromPolar(Math.exp(this.real), this.im);
		},
		sin: function() {
			var e = this.real, t = this.im;
			return this.fromRect(Math.sin(e) * l(t), Math.cos(e) * c(t));
		},
		cos: function() {
			var e = this.real, t = this.im;
			return this.fromRect(Math.cos(e) * l(t), Math.sin(e) * c(t) * -1);
		},
		tan: function() {
			var e = this.real, t = this.im, n = Math.cos(2 * e) + l(2 * t);
			return this.fromRect(Math.sin(2 * e) / n, c(2 * t) / n);
		},
		sinh: function() {
			var e = this.real, t = this.im;
			return this.fromRect(c(e) * Math.cos(t), l(e) * Math.sin(t));
		},
		cosh: function() {
			var e = this.real, t = this.im;
			return this.fromRect(l(e) * Math.cos(t), c(e) * Math.sin(t));
		},
		tanh: function() {
			var e = this.real, t = this.im, n = l(2 * e) + Math.cos(2 * t);
			return this.fromRect(c(2 * e) / n, Math.sin(2 * t) / n);
		},
		clone: function() {
			return new n(this.real, this.im);
		},
		toString: function(e) {
			if (e) return this.magnitude() + " " + this.angle();
			var t = "", n = this.real, r = this.im;
			if (n && (t += n), (n && r || r < 0) && (t += r < 0 ? "-" : "+"), r) {
				var i = Math.abs(r);
				i != 1 && (t += i), t += "i";
			}
			return t || "0";
		},
		equals: function(e) {
			return e = n.from(e), e.real == this.real && e.im == this.im;
		}
	}, i = {
		abs: "magnitude",
		arg: "angle",
		phase: "angle",
		conj: "conjugate",
		mult: "multiply",
		dev: "divide",
		sub: "subtract"
	};
	for (var a in i) r[a] = r[i[a]];
	var o = {
		from: function(e, t) {
			if (e instanceof n) return new n(e.real, e.im);
			if (typeof e == "string") {
				e == "i" && (e = "0+1i");
				var r = e.match(/(\d+)?([\+\-]\d*)[ij]/);
				r && (e = r[1], t = r[2] == "+" || r[2] == "-" ? r[2] + "1" : r[2]);
			}
			return e = +e, t = +t, new n(isNaN(e) ? 0 : e, isNaN(t) ? 0 : t);
		},
		fromPolar: function(e, t) {
			return new n(1, 1).fromPolar(e, t);
		},
		i: new n(0, 1).finalize(),
		one: new n(1, 0).finalize()
	};
	for (var s in o) n[s] = o[s];
	var c = function(e) {
		return (Math.E ** +e - Math.E ** +-e) / 2;
	}, l = function(e) {
		return (Math.E ** +e + Math.E ** +-e) / 2;
	};
	t.exports = n;
})))();
var { PI: a, tanh: o } = Math;
i(100, 50, 1e4);
//#endregion
export { n, r, t };

//# sourceMappingURL=acoustics-BPdIidDA.mjs.map