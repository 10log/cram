var k = Object.defineProperty;
var U = (s, c, t) => c in s ? k(s, c, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[c] = t;
var o = (s, c, t) => U(s, typeof c != "symbol" ? c + "" : c, t);
import { S as j } from "./solver-z5p8Cank.mjs";
import { v as P, k as T, E as z, e as q, R as B, q as L, G as N, F as H, H as K, J as G, K as J, o as b, D as W, f as I, C as Y, B as $ } from "./index-KmIKz-wL.mjs";
import { Matrix4 as A, Vector3 as Q, Triangle as X } from "three";
const w = {
  name: "RT"
};
class Z extends j {
  constructor(t = w) {
    super(t);
    o(this, "uuid");
    o(this, "sabine_rt");
    o(this, "eyring_rt");
    o(this, "ap_rt");
    o(this, "volume");
    o(this, "frequencies");
    o(this, "roomID");
    o(this, "resultID");
    o(this, "resultExists");
    this.kind = "rt60", this.name = t.name || w.name, this.uuid = P(), this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
    const e = T.getState().getRooms();
    this.roomID = e.length > 0 ? e[0].uuid : "", this.frequencies = z.slice(4, 11), this.resultID = P(), this.resultExists = !1, this.volume = T.getState().containers[this.roomID].volumeOfMesh();
  }
  save() {
    const { name: t, kind: e, uuid: r, autoCalculate: a } = this;
    return {
      name: t,
      kind: e,
      uuid: r,
      autoCalculate: a
    };
  }
  restore(t) {
    return super.restore(t), this.kind = t.kind, this;
  }
  calculate() {
    this.reset(), this.sabine_rt = this.sabine(), this.eyring_rt = this.eyring(), this.ap_rt = this.arauPuchades(this.room, this.frequencies), this.resultExists || (q("ADD_RESULT", {
      kind: B.StatisticalRT60,
      data: [],
      info: {
        frequency: this.frequencies,
        airabsorption: !1,
        temperature: 20,
        humidity: 40
      },
      name: "Statistical RT Results",
      uuid: this.resultID,
      from: this.uuid
    }), this.resultExists = !0);
    const t = { ...L.getState().results[this.resultID] };
    t.data = [];
    for (let e = 0; e < this.frequencies.length; e++)
      t.data.push({
        frequency: this.frequencies[e],
        sabine: this.sabine_rt[e],
        eyring: this.eyring_rt[e],
        ap: this.ap_rt[e]
      });
    q("UPDATE_RESULT", { uuid: this.resultID, result: t });
  }
  reset() {
    this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
  }
  sabine() {
    let t = this.room;
    const e = this.unitsConstant, r = this.volume, a = [];
    return this.frequencies.forEach((h) => {
      let i = 0;
      t.allSurfaces.forEach((n) => {
        i += n.getArea() * n.absorptionFunction(h);
      });
      let u = 4 * F(h) * r;
      a.push(e * r / (i + u));
    }), a;
  }
  eyring() {
    let t = this.room;
    const e = this.unitsConstant, r = this.volume, a = [];
    return this.frequencies.forEach((h) => {
      let i = 0, u = 0;
      t.allSurfaces.forEach((d) => {
        u += d.getArea(), i += d.getArea() * d.absorptionFunction(h);
      });
      let n = i / u, E = 4 * F(h) * r;
      a.push(e * r / (-u * Math.log(1 - n) + E));
    }), a;
  }
  arauPuchades(t, e = N) {
    const r = t.volumeOfMesh(), a = this.unitsConstant, h = new A().fromArray([
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat()), i = new A().fromArray([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat()), u = new A().fromArray([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1]
    ].flat()), n = [h, i, u], d = t.allSurfaces.map((f) => {
      const l = f.triangles.reduce((S, m) => {
        const R = n.map((p) => m.map((y) => new Q().fromArray(y).applyMatrix4(p))).map((p) => new X(...p).getArea());
        return S.map((p, y) => p + R[y]);
      }, [0, 0, 0]), _ = e.map((S) => l.map((m) => f.absorptionFunction(S) * m));
      return { area: l, sabines: _ };
    }), [[D, M], [C, V], [x, O]] = [0, 1, 2].map((f) => {
      const l = d.reduce((m, { area: v }) => m + v[f], 0), S = e.map((m, v) => d.reduce((R, { sabines: p }) => R + p[v][f], 0)).map((m) => m / l);
      return [l, S];
    }), g = D + C + x;
    return e.map((f, l) => (a * r / (-g * Math.log(1 - M[l]))) ** (D / g) * (a * r / (-g * Math.log(1 - V[l]))) ** (C / g) * (a * r / (-g * Math.log(1 - O[l]))) ** (x / g));
  }
  onParameterConfigFocus() {
  }
  onParameterConfigBlur() {
  }
  downloadRT60AsCSV() {
    let t = 4, i = [
      "Octave Band (Hz),".concat(this.frequencies.toString()),
      "Sabine RT,".concat(this.sabine_rt.map((n) => n.toFixed(t)).toString()),
      "Eyring RT,".concat(this.eyring_rt.map((n) => n.toFixed(t)).toString()),
      "Arau-Puchades RT,".concat(this.ap_rt.map((n) => n.toFixed(t)).toString())
    ].join(`
`);
    console.log(i);
    var u = new Blob([i], { type: "text/csv" });
    H.saveAs(u, `rt60-${this.uuid}.csv`);
  }
  // setters and getters
  get unitsConstant() {
    return K[G.getState().units];
  }
  get room() {
    return T.getState().containers[this.roomID];
  }
  get noResults() {
    return this.sabine_rt.length === 0 && this.eyring_rt.length === 0 && this.ap_rt.length === 0;
  }
  get displayVolume() {
    return J(this.volume, 2);
  }
  set displayVolume(t) {
    this.volume = t;
  }
}
function F(s) {
  switch (s) {
    case 125:
      return 0;
    case 250:
      return 0;
    case 500:
      return 600423e-9;
    case 1e3:
      return 1069606e-9;
    case 2e3:
      return 2578866e-9;
    case 4e3:
      return 839936e-8;
    case 8e3:
      return 0.0246;
    default:
      return 0;
  }
}
b("ADD_RT60", W(Z));
b("UPDATE_RT60", (s) => void I.getState().solvers[s].calculate());
b("REMOVE_RT60", Y);
b("DOWNLOAD_RT60_RESULTS", (s) => void I.getState().solvers[s].downloadRT60AsCSV());
b("RT60_SET_PROPERTY", $);
export {
  Z as RT60,
  Z as default
};
//# sourceMappingURL=index-DITdtLcQ.mjs.map
