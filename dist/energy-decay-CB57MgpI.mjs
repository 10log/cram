var _ = Object.defineProperty;
var D = (t, a, e) => a in t ? _(t, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[a] = e;
var r = (t, a, e) => D(t, typeof a != "symbol" ? a + "" : a, e);
import { v as S, F as T, w as o, e as b, o as f, D as v, B as E, f as A } from "./index-BovKYX7u.mjs";
import { S as x } from "./solver-cvNYXUbR.mjs";
const p = {
  name: "Energy Decay"
}, m = [125, 250, 500, 1e3, 2e3, 4e3, 8e3];
class I extends x {
  constructor(e = p) {
    super(e);
    r(this, "uuid");
    r(this, "broadbandIRData");
    r(this, "broadbandIRSampleRate");
    r(this, "broadbandIRSource");
    r(this, "source", null);
    r(this, "filteredData");
    r(this, "filteredEnergyDecayData");
    r(this, "impulseResponsePlaying");
    r(this, "filterTest");
    r(this, "T15");
    r(this, "T20");
    r(this, "T30");
    this.kind = "energydecay", this.name = e.name || p.name, this.broadbandIRData = new Float32Array(), this.broadbandIRSampleRate = 0, this.uuid = S(), this.filteredData = [], this.filteredEnergyDecayData = [], this.impulseResponsePlaying = !1, this.filterTest = null, this.T15 = [], this.T20 = [], this.T30 = [];
  }
  calculateAcParams() {
    this.filteredData.length === 0 && console.error("No IR Data Loaded"), this.calculateOctavebandBackwardsIntegration();
    for (let e = 0; e < m.length; e++)
      this.T15[e] = h(this.filteredEnergyDecayData[e], 15, this.broadbandIRSampleRate), this.T20[e] = h(this.filteredEnergyDecayData[e], 20, this.broadbandIRSampleRate), this.T30[e] = h(this.filteredEnergyDecayData[e], 30, this.broadbandIRSampleRate);
    console.log(m), console.log("T10 Values: "), console.log(this.T15), console.log("T20 Values: "), console.log(this.T20), console.log("T30 Values: "), console.log(this.T30), this.downloadResultsAsCSV();
  }
  calculateOctavebandBackwardsIntegration() {
    for (let e = 0; e < m.length; e++)
      this.filteredEnergyDecayData[e] = C(this.filteredData[e]);
  }
  downloadResultsAsCSV() {
    let e = 4, u = [
      "Octave Band (Hz),".concat(m.toString()),
      "T15,".concat(this.T15.map((d) => d.toFixed(e)).toString()),
      "T20,".concat(this.T20.map((d) => d.toFixed(e)).toString()),
      "T30,".concat(this.T30.map((d) => d.toFixed(e)).toString())
    ].join(`
`);
    var l = new Blob([u], { type: "text/csv" });
    T.saveAs(l, `energy-decay-${this.uuid}.csv`);
  }
  play(e) {
    o.context.state === "suspended" && o.context.resume(), e.connect(o.context.destination), e.start(), b("ENERGYDECAY_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(o.context.destination), b("ENERGYDECAY_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  set broadbandIR(e) {
    let n = this;
    o.context.decodeAudioData(e, async function(s) {
      let i = F(s.getChannelData(0));
      n.broadbandIRSource = o.createBufferSource(i), n.broadbandIRData = i, n.broadbandIRSampleRate = s.sampleRate, n.filterTest = o.createFilteredSource(i, 8e3, 1.414, 1);
      for (let c = 0; c < m.length; c++) {
        const u = o.createOfflineContext(1, i.length, s.sampleRate), l = o.createFilteredSource(i, m[c], 1.414, 1, u);
        l.gain.connect(u.destination), l.source.start();
        let d = await o.renderContextAsync(u);
        n.filteredData.push(d.getChannelData(0));
      }
    });
  }
}
function h(t, a, e) {
  const s = -5 - a;
  let i = g(y(R(t, -5))), c = g(y(R(t, s)));
  return Math.abs(c - i) / e * (60 / a);
}
function C(t) {
  t.length;
  let e = t.reverse().map((l) => Math.pow(l, 2)), n = w(e), s = t.map((l) => Math.pow(l, 2)), i = P(s);
  return n.map((l) => l / i).map((l) => l !== 0 ? 10 * Math.log10(l) : 0);
}
function g(t) {
  let a = 0, e = t[a];
  for (let n = 0; n < t.length; n++)
    e > t[n] && (e = t[n], a = n);
  return a;
}
function P(t) {
  return t.reduce(function(e, n) {
    return e + n;
  }, 0);
}
function w(t) {
  const a = /* @__PURE__ */ ((n) => (s) => n += s)(0);
  return t.map(a);
}
function y(t) {
  return t.map((e) => Math.abs(e));
}
function R(t, a) {
  return t.map((n) => n - a);
}
function F(t) {
  let a = 1e-6, e = 0, n = t.length, s = 0;
  for (; Math.abs(t[s]) < a; )
    e = s, s++;
  for (s = t.length; Math.abs(t[s]) < a; )
    n = s, s--;
  return t.slice(e, n);
}
f("ADD_ENERGYDECAY", v(I));
f("ENERGYDECAY_SET_PROPERTY", E);
f("CALCULATE_AC_PARAMS", (t) => void A.getState().solvers[t].calculateAcParams());
export {
  I as default
};
//# sourceMappingURL=energy-decay-CB57MgpI.mjs.map
