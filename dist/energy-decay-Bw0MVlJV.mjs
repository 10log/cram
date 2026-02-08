import { v as y, F as R, e as h, o as m, d as D, s as S, f as T } from "./index-WPNQK-eO.mjs";
import { a as r } from "./audio-engine-BltQIBir.mjs";
import { S as E } from "./solver-R8BUlJ5R.mjs";
function v(t) {
  return t.reduce((e, a) => e + a, 0);
}
function _(t) {
  const e = /* @__PURE__ */ ((a) => (n) => a += n)(0);
  return t.map(e);
}
function x(t) {
  const a = new Float32Array(t).reverse().map((l) => l ** 2), n = _(a), s = t.map((l) => l ** 2), o = v(s);
  return n.map((l) => l / o).map((l) => l !== 0 ? 10 * Math.log10(l) : 0);
}
function A(t) {
  let a = 0, n = t.length, s = 0;
  for (; s < t.length && Math.abs(t[s]) < 1e-6; )
    a = s, s++;
  for (s = t.length - 1; s >= 0 && Math.abs(t[s]) < 1e-6; )
    n = s, s--;
  return t.slice(a, n);
}
const f = {
  name: "Energy Decay"
}, d = [125, 250, 500, 1e3, 2e3, 4e3, 8e3];
class I extends E {
  uuid;
  broadbandIRData;
  broadbandIRSampleRate;
  broadbandIRSource;
  source = null;
  filteredData;
  filteredEnergyDecayData;
  impulseResponsePlaying;
  filterTest;
  T15;
  T20;
  T30;
  constructor(e = f) {
    super(e), this.kind = "energydecay", this.name = e.name || f.name, this.broadbandIRData = new Float32Array(), this.broadbandIRSampleRate = 0, this.uuid = y(), this.filteredData = [], this.filteredEnergyDecayData = [], this.impulseResponsePlaying = !1, this.filterTest = null, this.T15 = [], this.T20 = [], this.T30 = [];
  }
  calculateAcParams() {
    this.filteredData.length === 0 && console.error("No IR Data Loaded"), this.calculateOctavebandBackwardsIntegration();
    for (let e = 0; e < d.length; e++)
      this.T15[e] = u(this.filteredEnergyDecayData[e], 15, this.broadbandIRSampleRate), this.T20[e] = u(this.filteredEnergyDecayData[e], 20, this.broadbandIRSampleRate), this.T30[e] = u(this.filteredEnergyDecayData[e], 30, this.broadbandIRSampleRate);
    console.log(d), console.log("T15 Values: "), console.log(this.T15), console.log("T20 Values: "), console.log(this.T20), console.log("T30 Values: "), console.log(this.T30);
  }
  calculateOctavebandBackwardsIntegration() {
    for (let e = 0; e < d.length; e++)
      this.filteredEnergyDecayData[e] = x(this.filteredData[e]);
  }
  downloadResultsAsCSV() {
    let e = 4, i = [
      "Octave Band (Hz),".concat(d.toString()),
      "T15,".concat(this.T15.map((c) => c.toFixed(e)).toString()),
      "T20,".concat(this.T20.map((c) => c.toFixed(e)).toString()),
      "T30,".concat(this.T30.map((c) => c.toFixed(e)).toString())
    ].join(`
`);
    var l = new Blob([i], { type: "text/csv" });
    R.saveAs(l, `energy-decay-${this.uuid}.csv`);
  }
  play(e) {
    r.context.state === "suspended" && r.context.resume(), e.connect(r.context.destination), e.start(), h("ENERGYDECAY_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(r.context.destination), h("ENERGYDECAY_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  set broadbandIR(e) {
    let a = this;
    r.context.decodeAudioData(e, async function(n) {
      let s = A(n.getChannelData(0));
      a.broadbandIRSource = r.createBufferSource(s), a.broadbandIRData = s, a.broadbandIRSampleRate = n.sampleRate, a.filterTest = r.createFilteredSource(s, 8e3, 1.414, 1);
      for (let o = 0; o < d.length; o++) {
        const i = r.createOfflineContext(1, s.length, n.sampleRate), l = r.createFilteredSource(s, d[o], 1.414, 1, i);
        l.gain.connect(i.destination), l.source.start();
        let c = await r.renderContextAsync(i);
        a.filteredData.push(c.getChannelData(0));
      }
    });
  }
}
function u(t, e, a) {
  const s = -5 - e;
  let o = b(p(g(t, -5))), i = b(p(g(t, s)));
  return Math.abs(i - o) / a * (60 / e);
}
function b(t) {
  let e = 0, a = t[e];
  for (let n = 0; n < t.length; n++)
    a > t[n] && (a = t[n], e = n);
  return e;
}
function p(t) {
  return t.map((a) => Math.abs(a));
}
function g(t, e) {
  return t.map((n) => n - e);
}
m("ADD_ENERGYDECAY", D(I));
m("ENERGYDECAY_SET_PROPERTY", S);
m("CALCULATE_AC_PARAMS", (t) => void T.getState().solvers[t].calculateAcParams());
export {
  I as default
};
//# sourceMappingURL=energy-decay-Bw0MVlJV.mjs.map
