import { v as _, F as y, e as h, o as m, d as R, s as S, f as D } from "./index-Dtm47vRQ.mjs";
import { a as r } from "./audio-engine-Bb3qEFey.mjs";
import { S as T } from "./solver-BilcDAqb.mjs";
const f = {
  name: "Energy Decay"
}, c = [125, 250, 500, 1e3, 2e3, 4e3, 8e3];
class v extends T {
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
    super(e), this.kind = "energydecay", this.name = e.name || f.name, this.broadbandIRData = new Float32Array(), this.broadbandIRSampleRate = 0, this.uuid = _(), this.filteredData = [], this.filteredEnergyDecayData = [], this.impulseResponsePlaying = !1, this.filterTest = null, this.T15 = [], this.T20 = [], this.T30 = [];
  }
  calculateAcParams() {
    this.filteredData.length === 0 && console.error("No IR Data Loaded"), this.calculateOctavebandBackwardsIntegration();
    for (let e = 0; e < c.length; e++)
      this.T15[e] = u(this.filteredEnergyDecayData[e], 15, this.broadbandIRSampleRate), this.T20[e] = u(this.filteredEnergyDecayData[e], 20, this.broadbandIRSampleRate), this.T30[e] = u(this.filteredEnergyDecayData[e], 30, this.broadbandIRSampleRate);
    console.log(c), console.log("T10 Values: "), console.log(this.T15), console.log("T20 Values: "), console.log(this.T20), console.log("T30 Values: "), console.log(this.T30), this.downloadResultsAsCSV();
  }
  calculateOctavebandBackwardsIntegration() {
    for (let e = 0; e < c.length; e++)
      this.filteredEnergyDecayData[e] = E(this.filteredData[e]);
  }
  downloadResultsAsCSV() {
    let e = 4, o = [
      "Octave Band (Hz),".concat(c.toString()),
      "T15,".concat(this.T15.map((l) => l.toFixed(e)).toString()),
      "T20,".concat(this.T20.map((l) => l.toFixed(e)).toString()),
      "T30,".concat(this.T30.map((l) => l.toFixed(e)).toString())
    ].join(`
`);
    var d = new Blob([o], { type: "text/csv" });
    y.saveAs(d, `energy-decay-${this.uuid}.csv`);
  }
  play(e) {
    r.context.state === "suspended" && r.context.resume(), e.connect(r.context.destination), e.start(), h("ENERGYDECAY_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(r.context.destination), h("ENERGYDECAY_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  set broadbandIR(e) {
    let a = this;
    r.context.decodeAudioData(e, async function(s) {
      let n = I(s.getChannelData(0));
      a.broadbandIRSource = r.createBufferSource(n), a.broadbandIRData = n, a.broadbandIRSampleRate = s.sampleRate, a.filterTest = r.createFilteredSource(n, 8e3, 1.414, 1);
      for (let i = 0; i < c.length; i++) {
        const o = r.createOfflineContext(1, n.length, s.sampleRate), d = r.createFilteredSource(n, c[i], 1.414, 1, o);
        d.gain.connect(o.destination), d.source.start();
        let l = await r.renderContextAsync(o);
        a.filteredData.push(l.getChannelData(0));
      }
    });
  }
}
function u(t, e, a) {
  const n = -5 - e;
  let i = b(p(g(t, -5))), o = b(p(g(t, n)));
  return Math.abs(o - i) / a * (60 / e);
}
function E(t) {
  t.length;
  let a = t.reverse().map((l) => Math.pow(l, 2)), s = A(a), n = t.map((l) => Math.pow(l, 2)), i = x(n);
  return s.map((l) => l / i).map((l) => l !== 0 ? 10 * Math.log10(l) : 0);
}
function b(t) {
  let e = 0, a = t[e];
  for (let s = 0; s < t.length; s++)
    a > t[s] && (a = t[s], e = s);
  return e;
}
function x(t) {
  return t.reduce(function(a, s) {
    return a + s;
  }, 0);
}
function A(t) {
  const e = /* @__PURE__ */ ((s) => (n) => s += n)(0);
  return t.map(e);
}
function p(t) {
  return t.map((a) => Math.abs(a));
}
function g(t, e) {
  return t.map((s) => s - e);
}
function I(t) {
  let e = 1e-6, a = 0, s = t.length, n = 0;
  for (; Math.abs(t[n]) < e; )
    a = n, n++;
  for (n = t.length; Math.abs(t[n]) < e; )
    s = n, n--;
  return t.slice(a, s);
}
m("ADD_ENERGYDECAY", R(v));
m("ENERGYDECAY_SET_PROPERTY", S);
m("CALCULATE_AC_PARAMS", (t) => void D.getState().solvers[t].calculateAcParams());
export {
  v as default
};
//# sourceMappingURL=energy-decay-DpH6Aejq.mjs.map
