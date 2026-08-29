import { create as e } from "zustand";
//#region \0rolldown/runtime.js
var t = Object.create, n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, a = Object.getPrototypeOf, o = Object.prototype.hasOwnProperty, s = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, c = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), l = (e, t) => {
	let r = {};
	for (var i in e) n(r, i, {
		get: e[i],
		enumerable: !0
	});
	return t || n(r, Symbol.toStringTag, { value: "Module" }), r;
}, u = (e, t, a, s) => {
	if (t && typeof t == "object" || typeof t == "function") for (var c = i(t), l = 0, u = c.length, d; l < u; l++) d = c[l], !o.call(e, d) && d !== a && n(e, d, {
		get: ((e) => t[e]).bind(null, d),
		enumerable: !(s = r(t, d)) || s.enumerable
	});
	return e;
}, d = (e, r, i) => (i = e == null ? {} : t(a(e)), u(r || !e || !e.__esModule || !o.call(e, "default") ? n(i, "default", {
	value: e,
	enumerable: !0
}) : i, e)), f = (e) => o.call(e, "module.exports") ? e["module.exports"] : u(n({}, "__esModule", { value: !0 }), e), ee = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), p = [];
for (let e = 0; e < 256; ++e) p.push((e + 256).toString(16).slice(1));
function te(e, t = 0) {
	return (p[e[t + 0]] + p[e[t + 1]] + p[e[t + 2]] + p[e[t + 3]] + "-" + p[e[t + 4]] + p[e[t + 5]] + "-" + p[e[t + 6]] + p[e[t + 7]] + "-" + p[e[t + 8]] + p[e[t + 9]] + "-" + p[e[t + 10]] + p[e[t + 11]] + p[e[t + 12]] + p[e[t + 13]] + p[e[t + 14]] + p[e[t + 15]]).toLowerCase();
}
//#endregion
//#region node_modules/uuid/dist/rng.js
var ne = /* @__PURE__ */ new Uint8Array(16);
function re() {
	return crypto.getRandomValues(ne);
}
//#endregion
//#region node_modules/uuid/dist/v4.js
function m(e, t, n) {
	return !t && !e && crypto.randomUUID ? crypto.randomUUID() : ie(e, t, n);
}
function ie(e, t, n) {
	e ||= {};
	let r = e.random ?? e.rng?.() ?? re();
	if (r.length < 16) throw Error("Random bytes length must be >= 16");
	if (r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, t) {
		if (n ||= 0, n < 0 || n + 16 > t.length) throw RangeError(`UUID byte range ${n}:${n + 15} is out of buffer bounds`);
		for (let e = 0; e < 16; ++e) t[n + e] = r[e];
		return t;
	}
	return te(r);
}
var h = new class {
	static postMessage(e) {
		throw Error("Method not implemented.");
	}
	dictionary;
	messageListeners;
	events;
	lastMessage;
	constructor() {
		this.dictionary = {}, this.messageListeners = {}, this.events = {}, this.lastMessage = "";
	}
	addMessageHandler(e, t) {
		let n = m();
		return this.dictionary[e] ? (this.dictionary[e][n] = t, [e, n]) : (this.dictionary[e] = { [n]: t }, [e, n]);
	}
	removeMessage(e) {
		this.dictionary[e] && delete this.dictionary[e];
	}
	removeMessageHandler(e, t) {
		this.dictionary[e][t] && delete this.dictionary[e][t];
	}
	postMessage(e, ...t) {
		if (e !== this.lastMessage && (this.lastMessage = e), this.dictionary[e]) {
			let n = [];
			return Object.keys(this.dictionary[e]).forEach((r) => {
				let i = this.dictionary[e][r](n, ...t);
				n.push(i);
			}), n;
		}
		return [];
	}
	before(e, t) {
		return this.events[e] || (this.events[e] = {
			before: /* @__PURE__ */ new Set(),
			on: /* @__PURE__ */ new Set(),
			after: /* @__PURE__ */ new Set()
		}), this.events[e].before.add(t), (() => {
			this.events[e]?.before.delete(t);
		});
	}
	on(e, t) {
		return this.events[e] || (this.events[e] = {
			before: /* @__PURE__ */ new Set(),
			on: /* @__PURE__ */ new Set(),
			after: /* @__PURE__ */ new Set()
		}), this.events[e].on.add(t), (() => {
			this.events[e]?.on.delete(t);
		});
	}
	after(e, t) {
		return this.events[e] || (this.events[e] = {
			before: /* @__PURE__ */ new Set(),
			on: /* @__PURE__ */ new Set(),
			after: /* @__PURE__ */ new Set()
		}), this.events[e].after.add(t), (() => {
			this.events[e]?.after.delete(t);
		});
	}
	emit(e, t) {
		if (this.events[e]) {
			if (this.events[e].before.size > 0) for (let n of this.events[e].before) {
				let e = n(t);
				if (e !== void 0 && !e) return;
			}
			for (let n of this.events[e].on) {
				let e = n(t);
				if (e !== void 0 && !e) break;
			}
			if (this.events[e].after.size > 0) for (let n of this.events[e].after) {
				let e = n(t);
				if (e !== void 0 && !e) break;
			}
		}
	}
	addMessageListener(e) {
		let t = m();
		this.messageListeners[t] = e;
	}
	removeMessageListener(e) {
		this.messageListeners[e] && delete this.messageListeners[e];
	}
	clear() {
		this.dictionary = {}, this.messageListeners = {};
		for (let e of Object.keys(this.events)) this.events[e] && (this.events[e].before.clear(), this.events[e].on.clear(), this.events[e].after.clear());
		this.events = {}, this.lastMessage = "", console.log("[Messenger] Cleared all handlers");
	}
}(), g = h.emit.bind(h);
h.before.bind(h);
var ae = h.on.bind(h), oe = h.after.bind(h), se = h.postMessage.bind(h);
h.addMessageHandler.bind(h);
var ce = h.removeMessageHandler.bind(h), le = Symbol.for("immer-nothing"), ue = Symbol.for("immer-draftable"), _ = Symbol.for("immer-state"), de = process.env.NODE_ENV === "production" ? [] : [
	function(e) {
		return `The plugin for '${e}' has not been loaded into Immer. To enable the plugin, import and call \`enable${e}()\` when initializing your application.`;
	},
	function(e) {
		return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${e}'`;
	},
	"This object has been frozen and should not be mutated",
	function(e) {
		return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + e;
	},
	"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
	"Immer forbids circular references",
	"The first or second argument to `produce` must be a function",
	"The third argument to `produce` must be a function or undefined",
	"First argument to `createDraft` must be a plain object, an array, or an immerable object",
	"First argument to `finishDraft` must be a draft returned by `createDraft`",
	function(e) {
		return `'current' expects a draft, got: ${e}`;
	},
	"Object.defineProperty() cannot be used on an Immer draft",
	"Object.setPrototypeOf() cannot be used on an Immer draft",
	"Immer only supports deleting array indices",
	"Immer only supports setting array indices and the 'length' property",
	function(e) {
		return `'original' expects a draft, got: ${e}`;
	}
];
function v(e, ...t) {
	if (process.env.NODE_ENV !== "production") {
		let n = de[e], r = F(n) ? n.apply(null, t) : n;
		throw Error(`[Immer] ${r}`);
	}
	throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
}
var y = Object, b = y.getPrototypeOf, x = "constructor", S = "prototype", fe = "configurable", C = "enumerable", w = "writable", T = "value", E = (e) => !!e && !!e[_];
function D(e) {
	return e ? he(e) || j(e) || !!e[ue] || !!e[x]?.[ue] || M(e) || N(e) : !1;
}
var pe = y[S][x].toString(), me = /* @__PURE__ */ new WeakMap();
function he(e) {
	if (!e || !P(e)) return !1;
	let t = b(e);
	if (t === null || t === y[S]) return !0;
	let n = y.hasOwnProperty.call(t, x) && t[x];
	if (n === Object) return !0;
	if (!F(n)) return !1;
	let r = me.get(n);
	return r === void 0 && (r = Function.toString.call(n), me.set(n, r)), r === pe;
}
function O(e, t, n = !0) {
	k(e) === 0 ? (n ? Reflect.ownKeys(e) : y.keys(e)).forEach((n) => {
		t(n, e[n], e);
	}) : e.forEach((n, r) => t(r, n, e));
}
function k(e) {
	let t = e[_];
	return t ? t.type_ : j(e) ? 1 : M(e) ? 2 : N(e) ? 3 : 0;
}
var ge = (e, t, n = k(e)) => n === 2 ? e.has(t) : y[S].hasOwnProperty.call(e, t), _e = (e, t, n = k(e)) => n === 2 ? e.get(t) : e[t], A = (e, t, n, r = k(e)) => {
	r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
};
function ve(e, t) {
	return e === t ? e !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
var j = Array.isArray, M = (e) => e instanceof Map, N = (e) => e instanceof Set, P = (e) => typeof e == "object", F = (e) => typeof e == "function", I = (e) => typeof e == "boolean";
function ye(e) {
	let t = +e;
	return Number.isInteger(t) && String(t) === e;
}
var be = (e) => P(e) ? e?.[_] : null, L = (e) => e.copy_ || e.base_, xe = (e) => {
	let t = be(e);
	return t ? t.copy_ ?? t.base_ : e;
}, Se = (e) => e.modified_ ? e.copy_ : e.base_;
function Ce(e, t) {
	if (M(e)) return new Map(e);
	if (N(e)) return new Set(e);
	if (j(e)) return Array[S].slice.call(e);
	let n = he(e);
	if (t === !0 || t === "class_only" && !n) {
		let t = y.getOwnPropertyDescriptors(e);
		delete t[_];
		let n = Reflect.ownKeys(t);
		for (let r = 0; r < n.length; r++) {
			let i = n[r], a = t[i];
			a[w] === !1 && (a[w] = !0, a[fe] = !0), (a.get || a.set) && (t[i] = {
				[fe]: !0,
				[w]: !0,
				[C]: a[C],
				[T]: e[i]
			});
		}
		return y.create(b(e), t);
	}
	{
		let t = b(e);
		if (t !== null && n) return { ...e };
		let r = y.create(t);
		return y.assign(r, e);
	}
}
function we(e, t = !1) {
	return z(e) || E(e) || !D(e) ? e : (k(e) > 1 && y.defineProperties(e, {
		set: R,
		add: R,
		clear: R,
		delete: R
	}), y.freeze(e), t && O(e, (e, t) => {
		we(t, !0);
	}, !1), e);
}
function Te() {
	v(2);
}
var R = { [T]: Te };
function z(e) {
	return e === null || !P(e) || y.isFrozen(e);
}
var B = "MapSet", V = "Patches", Ee = "ArrayMethods", H = {};
function U(e) {
	let t = H[e];
	return t || v(0, e), t;
}
var De = (e) => !!H[e];
function Oe(e, t) {
	H[e] || (H[e] = t);
}
var W, G = () => W, ke = (e, t) => ({
	drafts_: [],
	parent_: e,
	immer_: t,
	canAutoFreeze_: !0,
	unfinalizedDrafts_: 0,
	handledSet_: /* @__PURE__ */ new Set(),
	processedForPatches_: /* @__PURE__ */ new Set(),
	mapSetPlugin_: De(B) ? U(B) : void 0,
	arrayMethodsPlugin_: De(Ee) ? U(Ee) : void 0
});
function Ae(e, t) {
	t && (e.patchPlugin_ = U(V), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function je(e) {
	Me(e), e.drafts_.forEach(Pe), e.drafts_ = null;
}
function Me(e) {
	e === W && (W = e.parent_);
}
var Ne = (e) => W = ke(W, e);
function Pe(e) {
	let t = e[_];
	t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function Fe(e, t) {
	t.unfinalizedDrafts_ = t.drafts_.length;
	let n = t.drafts_[0];
	if (e !== void 0 && e !== n) {
		n[_].modified_ && (je(t), v(4)), D(e) && (e = Ie(t, e));
		let { patchPlugin_: r } = t;
		r && r.generateReplacementPatches_(n[_].base_, e, t);
	} else e = Ie(t, n);
	return Le(t, e, !0), je(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e === le ? void 0 : e;
}
function Ie(e, t) {
	if (z(t)) return t;
	let n = t[_];
	if (!n) return q(t, e.handledSet_, e);
	if (!K(n, e)) return t;
	if (!n.modified_) return n.base_;
	if (!n.finalized_) {
		let { callbacks_: t } = n;
		if (t) for (; t.length > 0;) t.pop()(e);
		He(n, e);
	}
	return n.copy_;
}
function Le(e, t, n = !1) {
	!e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && we(t, n);
}
function Re(e) {
	e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
var K = (e, t) => e.scope_ === t, ze = [];
function Be(e, t, n, r) {
	let i = L(e), a = e.type_;
	if (r !== void 0 && _e(i, r, a) === t) {
		A(i, r, n, a);
		return;
	}
	if (!e.draftLocations_) {
		let t = e.draftLocations_ = /* @__PURE__ */ new Map();
		O(i, (e, n) => {
			if (E(n)) {
				let r = t.get(n) || [];
				r.push(e), t.set(n, r);
			}
		});
	}
	let o = e.draftLocations_.get(t) ?? ze;
	for (let e of o) A(i, e, n, a);
}
function Ve(e, t, n) {
	e.callbacks_.push(function(r) {
		let i = t;
		if (!i || !K(i, r)) return;
		r.mapSetPlugin_?.fixSetContents(i);
		let a = Se(i);
		Be(e, i.draft_ ?? i, a, n), He(i, r);
	});
}
function He(e, t) {
	if (e.modified_ && !e.finalized_ && (e.type_ === 3 || e.type_ === 1 && e.allIndicesReassigned_ || (e.assigned_?.size ?? 0) > 0)) {
		let { patchPlugin_: n } = t;
		if (n) {
			let r = n.getPath(e);
			r && n.generatePatches_(e, r, t);
		}
		Re(e);
	}
}
function Ue(e, t, n) {
	let { scope_: r } = e;
	if (E(n)) {
		let i = n[_];
		K(i, r) && i.callbacks_.push(function() {
			Z(e), Be(e, n, Se(i), t);
		});
	} else D(n) && e.callbacks_.push(function() {
		let i = L(e);
		e.type_ === 3 ? i.has(n) && q(n, r.handledSet_, r) : _e(i, t, e.type_) === n && r.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && q(_e(e.copy_, t, e.type_), r.handledSet_, r);
	});
}
function q(e, t, n) {
	return !n.immer_.autoFreeze_ && n.unfinalizedDrafts_ < 1 || E(e) || t.has(e) || !D(e) || z(e) ? e : (t.add(e), O(e, (r, i) => {
		if (E(i)) {
			let t = i[_];
			K(t, n) && (A(e, r, Se(t), e.type_), Re(t));
		} else D(i) && q(i, t, n);
	}), e);
}
function We(e, t) {
	let n = j(e), r = {
		type_: +!!n,
		scope_: t ? t.scope_ : G(),
		modified_: !1,
		finalized_: !1,
		assigned_: void 0,
		parent_: t,
		base_: e,
		draft_: null,
		copy_: null,
		revoke_: null,
		isManual_: !1,
		callbacks_: void 0
	}, i = r, a = J;
	n && (i = [r], a = Y);
	let { revoke: o, proxy: s } = Proxy.revocable(i, a);
	return r.draft_ = s, r.revoke_ = o, [s, r];
}
var J = {
	get(e, t) {
		if (t === _) return e;
		let n = e.scope_.arrayMethodsPlugin_, r = e.type_ === 1 && typeof t == "string";
		if (r && n?.isArrayOperationMethod(t)) return n.createMethodInterceptor(e, t);
		let i = L(e);
		if (!ge(i, t, e.type_)) return qe(e, i, t);
		let a = i[t];
		if (e.finalized_ || !D(a) || r && e.operationMethod && n?.isMutatingArrayMethod(e.operationMethod) && ye(t)) return a;
		if (a === Ge(e.base_, t) || Ke(e, t, a)) {
			Z(e);
			let n = e.type_ === 1 ? +t : t, r = Q(e.scope_, a, e, n);
			return e.copy_[n] = r;
		}
		return a;
	},
	has(e, t) {
		return t in L(e);
	},
	ownKeys(e) {
		return Reflect.ownKeys(L(e));
	},
	set(e, t, n) {
		let r = Je(L(e), t);
		if (r?.set) return r.set.call(e.draft_, n), !0;
		if (!e.modified_) {
			let r = Ge(L(e), t), i = r?.[_];
			if (i && i.base_ === n) return e.copy_[t] = n, e.assigned_.set(t, !1), !0;
			if (ve(n, r) && (n !== void 0 || ge(e.base_, t, e.type_))) return !0;
			Z(e), X(e);
		}
		return e.copy_[t] === n && (n !== void 0 || ge(e.copy_, t, e.type_)) || Number.isNaN(n) && Number.isNaN(e.copy_[t]) ? !0 : (e.copy_[t] = n, e.assigned_.set(t, !0), Ue(e, t, n), !0);
	},
	deleteProperty(e, t) {
		return Z(e), Ge(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), X(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = L(e), r = Reflect.getOwnPropertyDescriptor(n, t);
		return r && {
			[w]: !0,
			[fe]: e.type_ !== 1 || t !== "length",
			[C]: r[C],
			[T]: n[t]
		};
	},
	defineProperty() {
		v(11);
	},
	getPrototypeOf(e) {
		return b(e.base_);
	},
	setPrototypeOf() {
		v(12);
	}
}, Y = {};
for (let e in J) {
	let t = J[e];
	Y[e] = function() {
		let e = arguments;
		return e[0] = e[0][0], t.apply(this, e);
	};
}
Y.deleteProperty = function(e, t) {
	return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && v(13), Y.set.call(this, e, t, void 0);
}, Y.set = function(e, t, n) {
	return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && v(14), J.set.call(this, e[0], t, n, e[0]);
};
function Ge(e, t) {
	let n = e[_];
	return (n ? L(n) : e)[t];
}
function Ke(e, t, n) {
	return e.type_ !== 1 || !e.allIndicesReassigned_ || e.assigned_?.get(t) || !D(n) || n[_] ? !1 : e.baseRefs_.has(n);
}
function qe(e, t, n) {
	let r = Je(t, n);
	return r ? T in r ? r[T] : r.get?.call(e.draft_) : void 0;
}
function Je(e, t) {
	if (!(t in e)) return;
	let n = b(e);
	for (; n;) {
		let e = Object.getOwnPropertyDescriptor(n, t);
		if (e) return e;
		n = b(n);
	}
}
function X(e) {
	e.modified_ || (e.modified_ = !0, e.parent_ && X(e.parent_));
}
function Z(e) {
	e.copy_ ||= (e.assigned_ = /* @__PURE__ */ new Map(), Ce(e.base_, e.scope_.immer_.useStrictShallowCopy_));
}
var Ye = class {
	constructor(e) {
		this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (e, t, n) => {
			if (F(e) && !F(t)) {
				let n = t;
				t = e;
				let r = this;
				return function(e = n, ...i) {
					return r.produce(e, (e) => t.call(this, e, ...i));
				};
			}
			F(t) || v(6), n !== void 0 && !F(n) && v(7);
			let r;
			if (D(e)) {
				let i = Ne(this), a = Q(i, e, void 0), o = !0;
				try {
					r = t(a), o = !1;
				} finally {
					o ? je(i) : Me(i);
				}
				return Ae(i, n), Fe(r, i);
			}
			if (!e || !P(e)) {
				if (r = t(e), r === void 0 && (r = e), r === le && (r = void 0), this.autoFreeze_ && we(r, !0), n) {
					let t = [], i = [];
					U(V).generateReplacementPatches_(e, r, {
						patches_: t,
						inversePatches_: i
					}), n(t, i);
				}
				return r;
			}
			v(1, e);
		}, this.produceWithPatches = (e, t) => {
			if (F(e)) return (t, ...n) => this.produceWithPatches(t, (t) => e(t, ...n));
			let n, r;
			return [
				this.produce(e, t, (e, t) => {
					n = e, r = t;
				}),
				n,
				r
			];
		}, I(e?.autoFreeze) && this.setAutoFreeze(e.autoFreeze), I(e?.useStrictShallowCopy) && this.setUseStrictShallowCopy(e.useStrictShallowCopy), I(e?.useStrictIteration) && this.setUseStrictIteration(e.useStrictIteration);
	}
	createDraft(e) {
		D(e) || v(8), E(e) && (e = Xe(e));
		let t = Ne(this), n = Q(t, e, void 0);
		return n[_].isManual_ = !0, Me(t), n;
	}
	finishDraft(e, t) {
		let n = e && e[_];
		(!n || !n.isManual_) && v(9);
		let { scope_: r } = n;
		return Ae(r, t), Fe(void 0, r);
	}
	setAutoFreeze(e) {
		this.autoFreeze_ = e;
	}
	setUseStrictShallowCopy(e) {
		this.useStrictShallowCopy_ = e;
	}
	setUseStrictIteration(e) {
		this.useStrictIteration_ = e;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(e, t) {
		let n;
		for (n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			if (r.path.length === 0 && r.op === "replace") {
				e = r.value;
				break;
			}
		}
		n > -1 && (t = t.slice(n + 1));
		let r = U(V).applyPatches_;
		return E(e) ? r(e, t) : this.produce(e, (e) => r(e, t));
	}
};
function Q(e, t, n, r) {
	let [i, a] = M(t) ? U(B).proxyMap_(t, n) : N(t) ? U(B).proxySet_(t, n) : We(t, n);
	return (n?.scope_ ?? G()).drafts_.push(i), a.callbacks_ = n?.callbacks_ ?? [], a.key_ = r, n && r !== void 0 ? Ve(n, a, r) : a.callbacks_.push(function(e) {
		e.mapSetPlugin_?.fixSetContents(a);
		let { patchPlugin_: t } = e;
		a.modified_ && t && t.generatePatches_(a, [], e);
	}), i;
}
function Xe(e) {
	return E(e) || v(10, e), Ze(e);
}
function Ze(e) {
	if (!D(e) || z(e)) return e;
	let t = e[_], n, r = !0;
	if (t) {
		if (!t.modified_) return t.base_;
		t.finalized_ = !0, n = Ce(e, t.scope_.immer_.useStrictShallowCopy_), r = t.scope_.immer_.shouldUseStrictIteration();
	} else n = Ce(e, !0);
	return O(n, (e, t) => {
		A(n, e, Ze(t));
	}, r), t && (t.finalized_ = !1), n;
}
function Qe() {
	class e extends Map {
		constructor(e, t) {
			super(), this[_] = {
				type_: 2,
				parent_: t,
				scope_: t ? t.scope_ : G(),
				modified_: !1,
				finalized_: !1,
				copy_: void 0,
				assigned_: void 0,
				base_: e,
				draft_: this,
				isManual_: !1,
				revoked_: !1,
				callbacks_: []
			};
		}
		get size() {
			return L(this[_]).size;
		}
		has(e) {
			return L(this[_]).has(e);
		}
		set(e, t) {
			let n = this[_];
			return s(n), (!L(n).has(e) || L(n).get(e) !== t) && (r(n), X(n), n.assigned_.set(e, !0), n.copy_.set(e, t), n.assigned_.set(e, !0), Ue(n, e, t)), this;
		}
		delete(e) {
			if (!this.has(e)) return !1;
			let t = this[_];
			return s(t), r(t), X(t), t.base_.has(e) ? t.assigned_.set(e, !1) : t.assigned_.delete(e), t.copy_.delete(e), !0;
		}
		clear() {
			let e = this[_];
			s(e), L(e).size && (r(e), X(e), e.assigned_ = /* @__PURE__ */ new Map(), O(e.base_, (t) => {
				e.assigned_.set(t, !1);
			}), e.copy_.clear());
		}
		forEach(e, t) {
			let n = this[_];
			L(n).forEach((n, r, i) => {
				e.call(t, this.get(r), r, this);
			});
		}
		get(e) {
			let t = this[_];
			s(t);
			let n = L(t).get(e);
			if (t.finalized_ || !D(n) || n !== t.base_.get(e)) return n;
			let i = Q(t.scope_, n, t, e);
			return r(t), t.copy_.set(e, i), i;
		}
		keys() {
			return L(this[_]).keys();
		}
		values() {
			let e = this.keys();
			return t({ next: () => {
				let t = e.next();
				return t.done ? t : {
					done: !1,
					value: this.get(t.value)
				};
			} });
		}
		entries() {
			let e = this.keys();
			return t({ next: () => {
				let t = e.next();
				if (t.done) return t;
				let n = this.get(t.value);
				return {
					done: !1,
					value: [t.value, n]
				};
			} });
		}
		[Symbol.iterator]() {
			return this.entries();
		}
	}
	function t(e) {
		if (typeof Iterator < "u") return Iterator.from(e);
		let t = {
			...e,
			[Symbol.iterator]: () => t
		};
		return t;
	}
	function n(t, n) {
		let r = new e(t, n);
		return [r, r[_]];
	}
	function r(e) {
		e.copy_ ||= (e.assigned_ = /* @__PURE__ */ new Map(), new Map(e.base_));
	}
	class i extends Set {
		constructor(e, t) {
			super(), this[_] = {
				type_: 3,
				parent_: t,
				scope_: t ? t.scope_ : G(),
				modified_: !1,
				finalized_: !1,
				copy_: void 0,
				base_: e,
				draft_: this,
				drafts_: /* @__PURE__ */ new Map(),
				revoked_: !1,
				isManual_: !1,
				assigned_: void 0,
				callbacks_: []
			};
		}
		get size() {
			return L(this[_]).size;
		}
		has(e) {
			let t = this[_];
			return s(t), t.copy_ ? !!(t.copy_.has(e) || t.drafts_.has(e) && t.copy_.has(t.drafts_.get(e))) : t.base_.has(e);
		}
		add(e) {
			let t = this[_];
			return s(t), this.has(e) || (o(t), X(t), t.copy_.add(e), Ue(t, e, e)), this;
		}
		delete(e) {
			if (!this.has(e)) return !1;
			let t = this[_];
			return s(t), o(t), X(t), t.copy_.delete(e) || (t.drafts_.has(e) ? t.copy_.delete(t.drafts_.get(e)) : 
			/* istanbul ignore next */
			!1);
		}
		clear() {
			let e = this[_];
			s(e), L(e).size && (o(e), X(e), e.copy_.clear());
		}
		values() {
			let e = this[_];
			return s(e), o(e), e.copy_.values();
		}
		entries() {
			let e = this[_];
			return s(e), o(e), e.copy_.entries();
		}
		keys() {
			return this.values();
		}
		[Symbol.iterator]() {
			return this.values();
		}
		forEach(e, t) {
			let n = this.values(), r = n.next();
			for (; !r.done;) e.call(t, r.value, r.value, this), r = n.next();
		}
	}
	function a(e, t) {
		let n = new i(e, t);
		return [n, n[_]];
	}
	function o(e) {
		e.copy_ || (e.copy_ = /* @__PURE__ */ new Set(), e.base_.forEach((t) => {
			if (D(t)) {
				let n = Q(e.scope_, t, e, t);
				e.drafts_.set(t, n), e.copy_.add(n);
			} else e.copy_.add(t);
		}));
	}
	function s(e) {
		e.revoked_ && v(3, JSON.stringify(L(e)));
	}
	function c(e) {
		if (e.type_ === 3 && e.copy_) {
			let t = new Set(e.copy_);
			e.copy_.clear(), t.forEach((t) => {
				e.copy_.add(xe(t));
			});
		}
	}
	Oe(B, {
		proxyMap_: n,
		proxySet_: a,
		fixSetContents: c
	});
}
var $e = new Ye().produce, et = (e, t, n) => e >= t && e <= n;
Number.isInteger;
function tt(e, t) {
	return Object.keys(e).reduce((n, r) => t(e[r], r, e) ? n.concat(e[r]) : n, []);
}
var nt = (e) => (t) => !e.has(t) && e.add(t), rt = (e, t) => e.reduce((e, n) => ({
	...e,
	[n]: t[n]
}), {}), it = (e, t) => Object.keys(t).filter((t) => !e.includes(t)).reduce((e, n) => ({
	...e,
	[n]: t[n]
}), {}), at = (e) => e instanceof Array ? e : [e], $ = e((e, t) => ({
	solvers: {},
	version: 0,
	keys: () => Object.keys(t().solvers),
	set: (t) => e($e(t))
})), ot = (e) => (t) => {
	let n = t || new e();
	$.getState().set((e) => {
		e.solvers[n.uuid] = n;
	}), g("MARK_DIRTY", void 0);
}, st = (e) => {
	$.getState().set((t) => {
		t.solvers = it([e], t.solvers);
	}), g("MARK_DIRTY", void 0);
}, ct = ({ uuid: e, property: t, value: n }) => {
	let r = $.getState().solvers[e];
	r && (r[t] = n), $.getState().set((e) => {
		e.version++;
	}), g("MARK_DIRTY", void 0);
}, lt = () => Object.keys($.getState().solvers), ut = () => {
	let { solvers: e } = $.getState();
	Object.values(e).forEach((e) => {
		try {
			typeof e.dispose == "function" && e.dispose();
		} catch (e) {
			console.warn("[SolverStore] Error disposing solver:", e);
		}
	}), $.setState({
		solvers: {},
		version: 0
	}), console.log("[SolverStore] Reset complete");
}, dt = /* @__PURE__ */ c(((e, t) => {
	(function(t, n) {
		typeof define == "function" && define.amd ? define([], n) : e === void 0 ? (n(), t.FileSaver = { exports: {} }.exports) : n();
	})(e, function() {
		function e(e, t) {
			return t === void 0 ? t = { autoBom: !1 } : typeof t != "object" && (console.warn("Deprecated: Expected third argument to be a object"), t = { autoBom: !t }), t.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["﻿", e], { type: e.type }) : e;
		}
		function n(e, t, n) {
			var r = new XMLHttpRequest();
			r.open("GET", e), r.responseType = "blob", r.onload = function() {
				s(r.response, t, n);
			}, r.onerror = function() {
				console.error("could not download file");
			}, r.send();
		}
		function r(e) {
			var t = new XMLHttpRequest();
			t.open("HEAD", e, !1);
			try {
				t.send();
			} catch {}
			return 200 <= t.status && 299 >= t.status;
		}
		function i(e) {
			try {
				e.dispatchEvent(new MouseEvent("click"));
			} catch {
				var t = document.createEvent("MouseEvents");
				t.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), e.dispatchEvent(t);
			}
		}
		var a = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : void 0, o = a.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent), s = a.saveAs || (typeof window != "object" || window !== a ? function() {} : "download" in HTMLAnchorElement.prototype && !o ? function(e, t, o) {
			var s = a.URL || a.webkitURL, c = document.createElement("a");
			t = t || e.name || "download", c.download = t, c.rel = "noopener", typeof e == "string" ? (c.href = e, c.origin === location.origin ? i(c) : r(c.href) ? n(e, t, o) : i(c, c.target = "_blank")) : (c.href = s.createObjectURL(e), setTimeout(function() {
				s.revokeObjectURL(c.href);
			}, 4e4), setTimeout(function() {
				i(c);
			}, 0));
		} : "msSaveOrOpenBlob" in navigator ? function(t, a, o) {
			if (a = a || t.name || "download", typeof t != "string") navigator.msSaveOrOpenBlob(e(t, o), a);
			else if (r(t)) n(t, a, o);
			else {
				var s = document.createElement("a");
				s.href = t, s.target = "_blank", setTimeout(function() {
					i(s);
				});
			}
		} : function(e, t, r, i) {
			if (i ||= open("", "_blank"), i && (i.document.title = i.document.body.innerText = "downloading..."), typeof e == "string") return n(e, t, r);
			var s = e.type === "application/octet-stream", c = /constructor/i.test(a.HTMLElement) || a.safari, l = /CriOS\/[\d]+/.test(navigator.userAgent);
			if ((l || s && c || o) && typeof FileReader < "u") {
				var u = new FileReader();
				u.onloadend = function() {
					var e = u.result;
					e = l ? e : e.replace(/^data:[^;]*;/, "data:attachment/file;"), i ? i.location.href = e : location = e, i = null;
				}, u.readAsDataURL(e);
			} else {
				var d = a.URL || a.webkitURL, f = d.createObjectURL(e);
				i ? i.location = f : location.href = f, i = null, setTimeout(function() {
					d.revokeObjectURL(f);
				}, 4e4);
			}
		});
		a.saveAs = s.saveAs = s, t !== void 0 && (t.exports = s);
	});
}));
//#endregion
export { c as C, f as D, ee as E, d as O, m as S, l as T, g as _, ut as a, se as b, nt as c, tt as d, it as f, oe as g, $e as h, st as i, et as l, Qe as m, ot as n, ct as o, rt as p, lt as r, $ as s, dt as t, at as u, h as v, s as w, ce as x, ae as y };

//# sourceMappingURL=FileSaver.min-DhK9iPpQ.mjs.map