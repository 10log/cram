import { S as V } from "./solver-BUUmIR3-.mjs";
import { v as x, u as R, w as O, e as C, R as j, a as k, t as U, F as z, h as L, i as B, j as N, o as f, d as H, f as w, c as K, s as W } from "./index-DILrTUct.mjs";
import { Matrix4 as y, Vector3 as Y, Triangle as $ } from "three";
const P = {
  name: "RT"
};
class G extends V {
  uuid;
  sabine_rt;
  eyring_rt;
  ap_rt;
  volume;
  frequencies;
  roomID;
  resultID;
  resultExists;
  constructor(t = P) {
    super(t), this.kind = "rt60", this.name = t.name || P.name, this.uuid = x(), this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
    const e = R.getState().getRooms();
    this.roomID = e.length > 0 ? e[0].uuid : "", this.frequencies = O.slice(4, 11), this.resultID = x(), this.resultExists = !1, this.volume = R.getState().containers[this.roomID].volumeOfMesh();
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
    this.reset(), this.sabine_rt = this.sabine(), this.eyring_rt = this.eyring(), this.ap_rt = this.arauPuchades(this.room, this.frequencies), this.resultExists || (C("ADD_RESULT", {
      kind: j.StatisticalRT60,
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
    const t = { ...k.getState().results[this.resultID] };
    t.data = [];
    for (let e = 0; e < this.frequencies.length; e++)
      t.data.push({
        frequency: this.frequencies[e],
        sabine: this.sabine_rt[e],
        eyring: this.eyring_rt[e],
        ap: this.ap_rt[e]
      });
    C("UPDATE_RESULT", { uuid: this.resultID, result: t });
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
      let a = n / i, T = 4 * q(u) * s;
      r.push(e * s / (-i * Math.log(1 - a) + T));
    }), r;
  }
  arauPuchades(t, e = U) {
    const s = t.volumeOfMesh(), r = this.unitsConstant, u = new y().fromArray([
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat()), n = new y().fromArray([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat()), i = new y().fromArray([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1]
    ].flat()), a = [u, n, i], m = t.allSurfaces.map((d) => {
      const o = d.triangles.reduce((g, l) => {
        const b = a.map((c) => l.map((v) => new Y().fromArray(v).applyMatrix4(c))).map((c) => new $(...c).getArea());
        return g.map((c, v) => c + b[v]);
      }, [0, 0, 0]), _ = e.map((g) => o.map((l) => d.absorptionFunction(g) * l));
      return { area: o, sabines: _ };
    }), [[A, F], [E, I], [D, M]] = [0, 1, 2].map((d) => {
      const o = m.reduce((l, { area: S }) => l + S[d], 0), g = e.map((l, S) => m.reduce((b, { sabines: c }) => b + c[S][d], 0)).map((l) => l / o);
      return [o, g];
    }), p = A + E + D;
    return e.map((d, o) => (r * s / (-p * Math.log(1 - F[o]))) ** (A / p) * (r * s / (-p * Math.log(1 - I[o]))) ** (E / p) * (r * s / (-p * Math.log(1 - M[o]))) ** (D / p));
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
    return L[B.getState().units];
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
f("ADD_RT60", H(G));
f("UPDATE_RT60", (h) => void w.getState().solvers[h].calculate());
f("REMOVE_RT60", K);
f("DOWNLOAD_RT60_RESULTS", (h) => void w.getState().solvers[h].downloadRT60AsCSV());
f("RT60_SET_PROPERTY", W);
export {
  G as RT60,
  G as default
};
//# sourceMappingURL=index-Dvpd63ba.mjs.map
