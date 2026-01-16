import { S as O } from "./solver-BGevQtbj.mjs";
import { v as D, k as R, E as I, e as x, R as k, q as U, G as j, F as z, H as B, J as L, K as N, o as f, D as H, f as w, C as K, B as G } from "./index-CgcZvXNw.mjs";
import { Matrix4 as T, Vector3 as J, Triangle as W } from "three";
const P = {
  name: "RT"
};
class Y extends O {
  constructor(t = P) {
    super(t), this.kind = "rt60", this.name = t.name || P.name, this.uuid = D(), this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
    const e = R.getState().getRooms();
    this.roomID = e.length > 0 ? e[0].uuid : "", this.frequencies = I.slice(4, 11), this.resultID = D(), this.resultExists = !1, this.volume = R.getState().containers[this.roomID].volumeOfMesh();
  }
  save() {
    const { name: t, kind: e, uuid: s, autoCalculate: r } = this;
    return {
      name: t,
      kind: e,
      uuid: s,
      autoCalculate: r
    };
  }
  restore(t) {
    return super.restore(t), this.kind = t.kind, this;
  }
  calculate() {
    this.reset(), this.sabine_rt = this.sabine(), this.eyring_rt = this.eyring(), this.ap_rt = this.arauPuchades(this.room, this.frequencies), this.resultExists || (x("ADD_RESULT", {
      kind: k.StatisticalRT60,
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
    const t = { ...U.getState().results[this.resultID] };
    t.data = [];
    for (let e = 0; e < this.frequencies.length; e++)
      t.data.push({
        frequency: this.frequencies[e],
        sabine: this.sabine_rt[e],
        eyring: this.eyring_rt[e],
        ap: this.ap_rt[e]
      });
    x("UPDATE_RESULT", { uuid: this.resultID, result: t });
  }
  reset() {
    this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
  }
  sabine() {
    let t = this.room;
    const e = this.unitsConstant, s = this.volume, r = [];
    return this.frequencies.forEach((u) => {
      let n = 0;
      t.allSurfaces.forEach((a) => {
        n += a.getArea() * a.absorptionFunction(u);
      });
      let i = 4 * q(u) * s;
      r.push(e * s / (n + i));
    }), r;
  }
  eyring() {
    let t = this.room;
    const e = this.unitsConstant, s = this.volume, r = [];
    return this.frequencies.forEach((u) => {
      let n = 0, i = 0;
      t.allSurfaces.forEach((m) => {
        i += m.getArea(), n += m.getArea() * m.absorptionFunction(u);
      });
      let a = n / i, y = 4 * q(u) * s;
      r.push(e * s / (-i * Math.log(1 - a) + y));
    }), r;
  }
  arauPuchades(t, e = j) {
    const s = t.volumeOfMesh(), r = this.unitsConstant, u = new T().fromArray([
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat()), n = new T().fromArray([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat()), i = new T().fromArray([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1]
    ].flat()), a = [u, n, i], m = t.allSurfaces.map((d) => {
      const o = d.triangles.reduce((g, l) => {
        const v = a.map((c) => l.map((_) => new J().fromArray(_).applyMatrix4(c))).map((c) => new W(...c).getArea());
        return g.map((c, _) => c + v[_]);
      }, [0, 0, 0]), b = e.map((g) => o.map((l) => d.absorptionFunction(g) * l));
      return { area: o, sabines: b };
    }), [[A, F], [E, M], [C, V]] = [0, 1, 2].map((d) => {
      const o = m.reduce((l, { area: S }) => l + S[d], 0), g = e.map((l, S) => m.reduce((v, { sabines: c }) => v + c[S][d], 0)).map((l) => l / o);
      return [o, g];
    }), p = A + E + C;
    return e.map((d, o) => (r * s / (-p * Math.log(1 - F[o]))) ** (A / p) * (r * s / (-p * Math.log(1 - M[o]))) ** (E / p) * (r * s / (-p * Math.log(1 - V[o]))) ** (C / p));
  }
  onParameterConfigFocus() {
  }
  onParameterConfigBlur() {
  }
  downloadRT60AsCSV() {
    let t = 4, n = [
      "Octave Band (Hz),".concat(this.frequencies.toString()),
      "Sabine RT,".concat(this.sabine_rt.map((a) => a.toFixed(t)).toString()),
      "Eyring RT,".concat(this.eyring_rt.map((a) => a.toFixed(t)).toString()),
      "Arau-Puchades RT,".concat(this.ap_rt.map((a) => a.toFixed(t)).toString())
    ].join(`
`);
    console.log(n);
    var i = new Blob([n], { type: "text/csv" });
    z.saveAs(i, `rt60-${this.uuid}.csv`);
  }
  // setters and getters
  get unitsConstant() {
    return B[L.getState().units];
  }
  get room() {
    return R.getState().containers[this.roomID];
  }
  get noResults() {
    return this.sabine_rt.length === 0 && this.eyring_rt.length === 0 && this.ap_rt.length === 0;
  }
  get displayVolume() {
    return N(this.volume, 2);
  }
  set displayVolume(t) {
    this.volume = t;
  }
}
function q(h) {
  switch (h) {
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
f("ADD_RT60", H(Y));
f("UPDATE_RT60", (h) => void w.getState().solvers[h].calculate());
f("REMOVE_RT60", K);
f("DOWNLOAD_RT60_RESULTS", (h) => void w.getState().solvers[h].downloadRT60AsCSV());
f("RT60_SET_PROPERTY", G);
export {
  Y as RT60,
  Y as default
};
//# sourceMappingURL=index-DtHre65k.mjs.map
