import { S as C } from "./solver-BY1W6uB-.mjs";
import { v as I, e as S, R as V, n as k, r as v, p as M, k as m, q as _, s as T, t as U, L as b, w as p, x as q, y as F, F as H, z, I as G, A as j, o as f, B as W, C as N, D as Y, f as y } from "./index-BaH-Rmpc.mjs";
import * as A from "three";
import { Vector3 as R } from "three";
import { MeshLine as B, MeshLineMaterial as $ } from "three.meshline";
function K() {
  let o = [];
  const e = new B();
  e.setPoints(o);
  const t = new $({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new A.Mesh(e, t);
}
class D {
  constructor(e) {
    this.baseSource = e.baseSource, this.reflector = e.reflector, this.order = e.order, this.position = e.position, this.children = [], this.parent = e.parent, this.room = e.room, this.uuid = I();
  }
  constructPathsForAllDescendents(e, t = !0) {
    let r = [];
    if (t) {
      let s = L(this, e);
      s !== null && r.push(s);
    }
    for (let s = 0; s < this.children.length; s++) {
      let i = L(this.children[s], e);
      i !== null && r.push(i), this.children[s].hasChildren && (r = r.concat(this.children[s].constructPathsForAllDescendents(e, !1)));
    }
    return r;
  }
  markupAllDescendents() {
    for (let e = 0; e < this.children.length; e++) {
      let t = this.children[e].position.clone();
      v.markup.addPoint([t.x, t.y, t.z], [0, 0, 0]), this.children[e].hasChildren && this.children[e].markupAllDescendents();
    }
  }
  markup() {
    let e = this.position.clone();
    v.markup.addPoint([e.x, e.y, e.z], [0, 0, 0]);
  }
  getTotalDescendents() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++)
      e++, this.children[t].hasChildren && (e = e + this.children[t].getTotalDescendents());
    return e;
  }
  getChildrenOfOrder(e) {
    let t = [];
    this.order === e && this.order === 0 && t.push(this);
    for (let r = 0; r < this.children.length; r++)
      if (this.children[r].order === e && t.push(this.children[r]), this.children[r].hasChildren) {
        let s = this.children[r].getChildrenOfOrder(e);
        t = t.concat(s);
      }
    return t;
  }
  get hasChildren() {
    return this.children.length > 0;
  }
}
class Z {
  constructor(e) {
    this.path = e, this.uuid = I(), this.highlight = !1;
  }
  markup() {
    for (let e = 0; e < this.path.length - 1; e++) {
      let t = this.path[e].point.clone(), r = this.path[e + 1].point.clone();
      v.markup.addLine([t.x, t.y, t.z], [r.x, r.y, r.z]);
    }
  }
  isvalid(e) {
    for (let t = 1; t <= this.order + 1; t++) {
      let r = this.path[t - 1].point, s = this.path[t].point, i = this.path[t - 1].reflectingSurface, l = this.path[t].reflectingSurface;
      for (let a = 1; a < e.length; a++)
        if (e[a] !== i && e[a] !== l) {
          let n = new R(0, 0, 0);
          n.subVectors(s, r), n.normalize();
          let u = new A.Raycaster();
          u.set(r, n);
          let c;
          c = u.intersectObject(e[a].mesh, !0);
          let d = [];
          for (let g = 0; g < c.length; g++)
            r.distanceTo(c[g].point) < r.distanceTo(s) && d.push(c[g]);
          if (d.length > 0)
            return !1;
        }
    }
    return !0;
  }
  get order() {
    return this.path.length - 2;
  }
  get totalLength() {
    let e = 0, t, r;
    for (let s = 1; s < this.path.length; s++)
      t = this.path[s - 1].point, r = this.path[s].point, e = e + t.distanceTo(r);
    return e;
  }
  arrivalPressure(e, t) {
    let r = z(b(e));
    for (let l = 0; l < this.path.length; l++) {
      let a = this.path[l];
      if (a.reflectingSurface !== null) for (let n = 0; n < t.length; n++) {
        let u = 1 - a.reflectingSurface.absorptionFunction(t[n]);
        r[n] = r[n] * u;
      }
    }
    let s = T(G(r));
    const i = j(t);
    for (let l = 0; l < t.length; l++)
      s[l] = s[l] - i[l] * this.totalLength;
    return b(s);
  }
  arrivalTime(e) {
    return this.totalLength / e;
  }
}
const J = {
  name: "Image Source",
  roomID: "",
  sourceIDs: [],
  surfaceIDs: [],
  receiverIDs: [],
  maxReflectionOrder: 2,
  imageSourcesVisible: !0,
  rayPathsVisible: !0,
  plotOrders: [0, 1, 2],
  // all paths
  frequencies: [125, 250, 500, 1e3, 2e3, 4e3, 8e3]
};
class Q extends C {
  constructor(e = J, t = !1) {
    super(e), this.uuid = e.uuid || I(), this.kind = "image-source", this.name = e.name, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this.frequencies = e.frequencies, this._imageSourcesVisible = e.imageSourcesVisible, this._rayPathsVisible = e.rayPathsVisible, this._plotOrders = e.plotOrders, this.levelTimeProgression = e.levelTimeProgression || I(), this.isHybrid = t, this.impulseResponsePlaying = !1, this._plotFrequency = 1e3, this.isHybrid || S("ADD_RESULT", {
      kind: V.LevelTimeProgression,
      data: [],
      info: {
        initialSPL: [100],
        frequency: [this._plotFrequency],
        maxOrder: this.maxReflectionOrder
      },
      name: `LTP - ${this.name}`,
      uuid: this.levelTimeProgression,
      from: this.uuid
    }), this.surfaceIDs = [], this.rootImageSource = null, this.allRayPaths = null, this.validRayPaths = null;
    const r = k();
    this.roomID = r[0].uuid, this.selectedImageSourcePath = K(), v.markup.add(this.selectedImageSourcePath);
  }
  save() {
    return M([
      "name",
      "kind",
      "uuid",
      "autoCalculate",
      "roomID",
      "sourceIDs",
      "surfaceIDs",
      "receiverIDs",
      "maxReflectionOrder",
      "imageSourcesVisible",
      "rayPathsVisible",
      "plotOrders",
      "levelTimeProgression"
    ], this);
  }
  dispose() {
    v.markup.remove(this.selectedImageSourcePath), this.reset(), S("REMOVE_RESULT", this.levelTimeProgression);
  }
  updateSelectedImageSourcePath(e) {
    this.selectedImageSourcePath.geometry.setPoints(
      e.path.map((t) => t.point.toArray()).flat()
    ), console.log(e.path.map((t) => t.point.toArray()).flat());
  }
  updateImageSourceCalculation() {
    this.clearRayPaths(), this.clearImageSources();
    let e = {
      baseSource: m.getState().containers[this.sourceIDs[0]],
      position: m.getState().containers[this.sourceIDs[0]].position.clone(),
      room: this.room,
      reflector: null,
      parent: null,
      order: 0
    }, t = new D(e), r = E(t, this.maxReflectionOrder);
    this.rootImageSource = r;
    let s, i = [];
    if (r !== null) {
      s = r.constructPathsForAllDescendents(m.getState().containers[this.receiverIDs[0]]), this.allRayPaths = s;
      for (let l = 0; l < (s == null ? void 0 : s.length); l++)
        s[l].isvalid(this.room.allSurfaces) && i.push(s[l]);
    }
    this.validRayPaths = i, this._imageSourcesVisible && this.drawImageSources(), this._rayPathsVisible && this.drawRayPaths(), this.isHybrid || this.calculateLTP(343);
  }
  // hybrid solver use only
  returnSortedPathsForHybrid(e, t, r) {
    this.updateImageSourceCalculation();
    let s = this.validRayPaths;
    s == null || s.sort((l, a) => l.arrivalTime(e) > a.arrivalTime(e) ? 1 : -1);
    let i = [];
    if (s != null)
      for (let l = 0; l < s.length; l++) {
        let a = s[l].arrivalTime(e), n = s[l].arrivalPressure(t, r), u = {
          time: a,
          pressure: n
        };
        i.push(u);
      }
    return i;
  }
  calculateLTP(e, t = !1) {
    if (!this.validRayPaths || this.validRayPaths.length === 0) {
      if (this.sourceIDs.length > 0 && this.receiverIDs.length > 0) {
        this.updateImageSourceCalculation();
        return;
      }
      return;
    }
    let r = this.validRayPaths;
    r == null || r.sort((i, l) => i.arrivalTime(e) > l.arrivalTime(e) ? 1 : -1);
    const s = { ..._.getState().results[this.levelTimeProgression] };
    if (s.data = [], s.info = {
      ...s.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    }, r !== void 0)
      for (let i = 0; i < (r == null ? void 0 : r.length); i++) {
        let l = r[i].arrivalTime(343), a = r[i].arrivalPressure(s.info.initialSPL, s.info.frequency);
        t && console.log("Arrival: " + (i + 1) + " | Arrival Time: (s) " + l + " | Arrival Pressure(1000Hz): " + a + " | Order " + r[i].order), s.data.push({
          time: l,
          pressure: T(a),
          arrival: i + 1,
          order: r[i].order,
          uuid: r[i].uuid
        });
      }
    S("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: s });
  }
  getPathsOfOrder(e) {
    var r;
    let t = [];
    if (this.validRayPaths !== null)
      for (let s = 0; s < ((r = this.validRayPaths) == null ? void 0 : r.length); s++)
        this.validRayPaths[s].order === e && t.push(this.validRayPaths[s]);
    return t;
  }
  test() {
    let e = U.postMessage("FETCH_SOURCE", this.sourceIDs[0])[0], t = {
      baseSource: e.clone(),
      position: e.position.clone(),
      room,
      reflector: null,
      parent: null,
      order: 0
    }, r = new D(t), i = E(r, 1);
    i == null || i.markup(), console.log(i);
    let l = this.receivers[0];
    console.log(l);
    let a;
    if (i !== null) {
      a = i.constructPathsForAllDescendents(l);
      let n = [100, 100, 100, 100, 100, 100], u = 0;
      for (let c = 0; c < a.length; c++)
        a[c].isvalid(this.room.allSurfaces) && (a[c].markup(), console.log(a[c]), console.log(a[c].totalLength), console.log(a[c].arrivalTime(343)), console.log(b(n)), u++);
      console.log(u + " out of " + a.length + " paths are valid");
    }
  }
  clearLevelTimeProgressionData() {
    const e = { ..._.getState().results[this.levelTimeProgression] };
    e.data = [], S("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: e });
  }
  reset() {
    this.rootImageSource = null, this.allRayPaths = null, this.validRayPaths = null, this.plotOrders = this.possibleOrders.map((e) => e.value), this.selectedImageSourcePath.geometry.setPoints([]), this.clearImageSources(), this.clearRayPaths(), this.clearLevelTimeProgressionData();
  }
  // plot functions
  drawImageSources() {
    var e;
    this.clearImageSources();
    for (let t = 0; t < this.plotOrders.length; t++) {
      let r = (e = this.rootImageSource) == null ? void 0 : e.getChildrenOfOrder(this.plotOrders[t]);
      for (let s = 0; s < (r == null ? void 0 : r.length); s++)
        r[s].markup();
    }
  }
  clearImageSources() {
    v.markup.clearPoints();
  }
  drawRayPaths(e) {
    this.clearRayPaths();
    for (let t = 0; t < this.plotOrders.length; t++) {
      let r = this.getPathsOfOrder(this.plotOrders[t]);
      for (let s = 0; s < r.length; s++)
        r[s].markup();
    }
  }
  clearRayPaths() {
    v.markup.clearLines();
  }
  toggleRayPathHighlight(e) {
    if (this.validRayPaths != null) {
      for (let t = 0; t < this.validRayPaths.length; t++)
        if (e === this.validRayPaths[t].uuid) {
          this.updateSelectedImageSourcePath(this.validRayPaths[t]), console.log("WILL HIGHLIGHT RAY PATH WITH ARRIVAL SPL " + T(this.validRayPaths[t].arrivalPressure([100], [1e3])) + " AND ARRIVAL TIME " + this.validRayPaths[t].arrivalTime(343));
          break;
        }
    }
  }
  async calculateImpulseResponse() {
    var l;
    const t = this.frequencies, r = 44100, s = Array(t.length).fill(100);
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (((l = this.validRayPaths) == null ? void 0 : l.length) === 0) throw Error("No rays have been traced yet");
    let i = this.validRayPaths;
    if (i == null || i.sort((a, n) => a.arrivalTime(343) > n.arrivalTime(343) ? 1 : -1), console.log(i), i != null) {
      const a = i[i.length - 1].arrivalTime(343) + 0.05, n = r * a;
      let u = [];
      for (let h = 0; h < this.frequencies.length; h++)
        u.push(new Float32Array(Math.floor(n)));
      for (let h = 0; h < i.length; h++) {
        let w = i[h].arrivalTime(343), O = i[h].arrivalPressure(s, this.frequencies);
        Math.random() > 0.5 && (O = O.map((P) => -P));
        let x = Math.floor(w * r);
        for (let P = 0; P < this.frequencies.length; P++)
          u[P][x] += O[P];
      }
      const c = p.createOfflineContext(1, n, r), d = Array(this.frequencies.length);
      for (let h = 0; h < this.frequencies.length; h++)
        d[h] = p.createFilteredSource(u[h], this.frequencies[h], 1.414, 1, c);
      console.log(d);
      const g = p.createMerger(d.length, c);
      for (let h = 0; h < d.length; h++)
        d[h].source.connect(g, 0, h);
      return g.connect(c.destination), d.forEach((h) => h.source.start()), this.impulseResponse = await p.renderContextAsync(c), this.impulseResponse;
    }
  }
  async playImpulseResponse() {
    this.impulseResponse || await this.calculateImpulseResponse().catch(console.error), p.context.state === "suspended" && p.context.resume(), console.log(this.impulseResponse);
    const e = p.context.createBufferSource();
    e.buffer = this.impulseResponse, e.connect(p.context.destination), e.start(), S("IMAGESOURCE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(p.context.destination), S("IMAGESOURCE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  async downloadImpulseResponse(e, t = 44100) {
    this.impulseResponse || await this.calculateImpulseResponse().catch(console.error);
    const r = q([F(this.impulseResponse.getChannelData(0))], { sampleRate: t, bitDepth: 32 }), s = e.endsWith(".wav") ? "" : ".wav";
    H.saveAs(r, e + s);
  }
  // getters and setters
  get sources() {
    return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => m.getState().containers[e]) : [];
  }
  get receivers() {
    return this.receiverIDs.length > 0 && Object.keys(m.getState().containers).length > 0 ? this.receiverIDs.map((e) => m.getState().containers[e]) : [];
  }
  get room() {
    return m.getState().containers[this.roomID];
  }
  get numValidRays() {
    var t;
    let e = (t = this.validRayPaths) == null ? void 0 : t.length;
    return e === void 0 ? 0 : e;
  }
  get numTotalRays() {
    var t;
    let e = (t = this.allRayPaths) == null ? void 0 : t.length;
    return e === void 0 ? 0 : e;
  }
  set maxReflectionOrderReset(e) {
    this.maxReflectionOrder = e, this.reset();
  }
  get maxReflectionOrderReset() {
    return this.maxReflectionOrder;
  }
  set rayPathsVisible(e) {
    e === this._rayPathsVisible || (e ? this.drawRayPaths() : this.clearRayPaths()), this._rayPathsVisible = e;
  }
  get rayPathsVisible() {
    return this._rayPathsVisible;
  }
  set imageSourcesVisible(e) {
    e === this._imageSourcesVisible || (e ? this.drawImageSources() : this.clearImageSources()), this._imageSourcesVisible = e;
  }
  get imageSourcesVisible() {
    return this._imageSourcesVisible;
  }
  get possibleOrders() {
    let e = [];
    for (let t = 0; t <= this.maxReflectionOrder; t++) {
      let r = {
        value: t,
        label: t.toString()
      };
      e.push(r);
    }
    return e;
  }
  get selectedPlotOrders() {
    let e = [];
    for (let t = 0; t < this.plotOrders.length; t++) {
      let r = {
        value: this.plotOrders[t],
        label: this.plotOrders[t].toString()
      };
      e.push(r);
    }
    return e;
  }
  set toggleOrder(e) {
    e > this.maxReflectionOrder || (this.plotOrders.includes(e) ? this.plotOrders.splice(this.plotOrders.indexOf(e), 1) : this.plotOrders.push(e)), this.clearRayPaths(), this.clearImageSources(), this.drawRayPaths(), this.drawImageSources();
  }
  get plotOrders() {
    return this._plotOrders;
  }
  set plotOrders(e) {
    this._plotOrders = e, this.clearRayPaths(), this.clearImageSources(), this.rayPathsVisible && this.drawRayPaths(), this.imageSourcesVisible && this.drawImageSources();
  }
  set plotFrequency(e) {
    this._plotFrequency = e, this.calculateLTP(343);
  }
}
function E(o, e) {
  let t = o.room.allSurfaces;
  if (e == 0)
    return null;
  for (let r = 0; r < t.length; r++) {
    let s = o.reflector === null || o.reflector !== t[r], i;
    if (o.reflector !== null ? i = X(t[r], o.reflector) : i = !0, s && i) {
      let l = {
        baseSource: o.baseSource,
        position: ee(o.position.clone(), t[r]).clone(),
        room: o.room,
        reflector: t[r],
        parent: o,
        order: o.order + 1
      }, a = new D(l);
      o.children.push(a), e > 0 && E(a, e - 1);
    }
  }
  return o;
}
function L(o, e) {
  let t = [], r = o.order, s = {
    point: e.position.clone(),
    reflectingSurface: null,
    angle: null
  };
  t[r + 1] = s;
  let i = new A.Raycaster();
  for (let n = r; n >= 1; n--) {
    let u = o.position.clone(), c = t[n + 1].point.clone(), d = new R(0, 0, 0);
    d.subVectors(u, c), d.normalize(), i.set(c, d);
    let g;
    if (o.reflector !== null && (g = i.intersectObject(o.reflector.mesh, !0)), g.length > 0) {
      let h = {
        point: g[0].point,
        reflectingSurface: o.reflector,
        angle: d.clone().multiplyScalar(-1).angleTo(g[0].face.normal)
      };
      t[n] = h;
    } else
      return null;
    o.parent !== null && (o = o.parent);
  }
  let l = {
    point: o.position.clone(),
    reflectingSurface: null,
    angle: null
  };
  return t[0] = l, new Z(t);
}
function X(o, e) {
  let t = o.normal.clone(), r = e.normal.clone();
  return t.dot(r) <= 0;
}
function ee(o, e) {
  let t = new R(e.polygon.vertices[0][0], e.polygon.vertices[0][1], e.polygon.vertices[0][2]), r = new R(e.polygon.vertices[1][0], e.polygon.vertices[1][1], e.polygon.vertices[1][2]), s = new R(e.polygon.vertices[2][0], e.polygon.vertices[2][1], e.polygon.vertices[2][2]), i = e.localToWorld(t), l = e.localToWorld(r), a = e.localToWorld(s);
  l.sub(i), a.sub(i), l.cross(a), l.normalize();
  let n = e.normal.clone(), u = n.clone();
  u.multiplyScalar(-1);
  let c = i.dot(u), d = n.clone();
  d.multiplyScalar(o.dot(n) + c);
  let g = o.clone();
  g.sub(d);
  let h = d;
  return h.multiplyScalar(-1), h.add(g), h;
}
f("IMAGESOURCE_SET_PROPERTY", W);
f("REMOVE_IMAGESOURCE", N);
f("ADD_IMAGESOURCE", Y(Q));
f("UPDATE_IMAGESOURCE", (o) => void y.getState().solvers[o].updateImageSourceCalculation());
f("RESET_IMAGESOURCE", (o) => void y.getState().solvers[o].reset());
f("CALCULATE_LTP", (o) => void y.getState().solvers[o].calculateLTP(343));
f("IMAGESOURCE_PLAY_IR", (o) => void y.getState().solvers[o].playImpulseResponse().catch(console.error));
f("IMAGESOURCE_DOWNLOAD_IR", (o) => {
  var l, a;
  const e = y.getState().solvers[o], t = m.getState().containers, r = e.sourceIDs.length > 0 && ((l = t[e.sourceIDs[0]]) == null ? void 0 : l.name) || "source", s = e.receiverIDs.length > 0 && ((a = t[e.receiverIDs[0]]) == null ? void 0 : a.name) || "receiver", i = `ir-imagesource-${r}-${s}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(i).catch(console.error);
});
export {
  Q as ImageSourceSolver,
  Q as default
};
//# sourceMappingURL=index-YDaxJlf9.mjs.map
