import { S as I } from "./solver-qC3XYtzY.mjs";
import { v as C, u as T, w as O, e as M, R as j, a as k, t as U, F as z, h as L, i as B, j as N, o as _, d as H, f as w, c as K, s as W } from "./index-GmH05fDm.mjs";
import { a as q } from "./air-attenuation-CBIk1QMo.mjs";
import { Matrix4 as E, Vector3 as Y, Triangle as $ } from "three";
const P = {
  name: "RT"
};
class G extends I {
  uuid;
  sabine_rt;
  eyring_rt;
  ap_rt;
  volume;
  frequencies;
  roomID;
  temperature;
  resultID;
  resultExists;
  constructor(t = P) {
    super(t), this.kind = "rt60", this.name = t.name || P.name, this.uuid = C(), this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
    const s = T.getState().getRooms();
    this.roomID = s.length > 0 ? s[0].uuid : "", this.frequencies = O.slice(4, 11), this.temperature = 20, this.resultID = C(), this.resultExists = !1, this.volume = T.getState().containers[this.roomID].volumeOfMesh();
  }
  save() {
    const { name: t, kind: s, uuid: r, autoCalculate: e, temperature: i } = this;
    return {
      name: t,
      kind: s,
      uuid: r,
      autoCalculate: e,
      temperature: i
    };
  }
  restore(t) {
    return super.restore(t), this.kind = t.kind, this.temperature = t.temperature ?? 20, this;
  }
  calculate() {
    this.reset();
    const s = q(this.frequencies, this.temperature).map((e) => e / (20 / Math.log(10)));
    this.sabine_rt = this.sabine(s), this.eyring_rt = this.eyring(s), this.ap_rt = this.arauPuchades(this.room, this.frequencies), this.resultExists || (M("ADD_RESULT", {
      kind: j.StatisticalRT60,
      data: [],
      info: {
        frequency: this.frequencies,
        airabsorption: !1,
        temperature: this.temperature,
        humidity: 40
      },
      name: "Statistical RT Results",
      uuid: this.resultID,
      from: this.uuid
    }), this.resultExists = !0);
    const r = { ...k.getState().results[this.resultID] };
    r.data = [];
    for (let e = 0; e < this.frequencies.length; e++)
      r.data.push({
        frequency: this.frequencies[e],
        sabine: this.sabine_rt[e],
        eyring: this.eyring_rt[e],
        ap: this.ap_rt[e]
      });
    M("UPDATE_RESULT", { uuid: this.resultID, result: r });
  }
  reset() {
    this.sabine_rt = [], this.eyring_rt = [], this.ap_rt = [];
  }
  sabine(t) {
    let s = this.room;
    const r = this.unitsConstant, e = this.volume, i = [];
    return this.frequencies.forEach((o, l) => {
      let a = 0;
      s.allSurfaces.forEach((c) => {
        a += c.getArea() * c.absorptionFunction(o);
      });
      let p = 4 * t[l] * e;
      i.push(r * e / (a + p));
    }), i;
  }
  eyring(t) {
    let s = this.room;
    const r = this.unitsConstant, e = this.volume, i = [];
    return this.frequencies.forEach((o, l) => {
      let a = 0, p = 0;
      s.allSurfaces.forEach((S) => {
        p += S.getArea(), a += S.getArea() * S.absorptionFunction(o);
      });
      let c = Math.max(0, Math.min(a / p, 0.9999)), v = 4 * t[l] * e;
      i.push(r * e / (-p * Math.log(1 - c) + v));
    }), i;
  }
  arauPuchades(t, s = U) {
    const r = t.volumeOfMesh(), e = this.unitsConstant, i = new E().fromArray([
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat()), o = new E().fromArray([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat()), l = new E().fromArray([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1]
    ].flat()), a = [i, o, l], c = t.allSurfaces.map((h) => {
      const n = h.triangles.reduce((f, u) => {
        const A = a.map((m) => u.map((R) => new Y().fromArray(R).applyMatrix4(m))).map((m) => new $(...m).getArea());
        return f.map((m, R) => m + A[R]);
      }, [0, 0, 0]), g = s.map((f) => n.map((u) => h.absorptionFunction(f) * u));
      return { area: n, sabines: g };
    }), [[v, S], [x, F], [D, V]] = [0, 1, 2].map((h) => {
      const n = c.reduce((u, { area: y }) => u + y[h], 0), f = s.map((u, y) => c.reduce((A, { sabines: m }) => A + m[y][h], 0)).map((u) => Math.max(0, Math.min(u / n, 0.9999)));
      return [n, f];
    }), d = v + x + D;
    return s.map((h, n) => {
      const g = 4 * q([h])[0] * r;
      return (e * r / (-d * Math.log(1 - S[n]) + g)) ** (v / d) * (e * r / (-d * Math.log(1 - F[n]) + g)) ** (x / d) * (e * r / (-d * Math.log(1 - V[n]) + g)) ** (D / d);
    });
  }
  onParameterConfigFocus() {
  }
  onParameterConfigBlur() {
  }
  downloadRT60AsCSV() {
    let t = 4, o = [
      "Octave Band (Hz),".concat(this.frequencies.toString()),
      "Sabine RT,".concat(this.sabine_rt.map((a) => a.toFixed(t)).toString()),
      "Eyring RT,".concat(this.eyring_rt.map((a) => a.toFixed(t)).toString()),
      "Arau-Puchades RT,".concat(this.ap_rt.map((a) => a.toFixed(t)).toString())
    ].join(`
`);
    console.log(o);
    var l = new Blob([o], { type: "text/csv" });
    z.saveAs(l, `rt60-${this.uuid}.csv`);
  }
  // setters and getters
  get unitsConstant() {
    return L[B.getState().units];
  }
  get room() {
    return T.getState().containers[this.roomID];
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
_("ADD_RT60", H(G));
_("UPDATE_RT60", (b) => void w.getState().solvers[b].calculate());
_("REMOVE_RT60", K);
_("DOWNLOAD_RT60_RESULTS", (b) => void w.getState().solvers[b].downloadRT60AsCSV());
_("RT60_SET_PROPERTY", W);
export {
  G as RT60,
  G as default
};
//# sourceMappingURL=index-CGEMlz9k.mjs.map
