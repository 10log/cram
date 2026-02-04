import { S as x } from "./solver-BamTcCzE.mjs";
import { v as I, e as S, R as C, g as V, r as P, p as k, u as p, a as A, P as T, m as M, L as b, F as q, b as F, I as U, o as m, s as H, c as z, d as G, f as y } from "./index-CjqGQOEv.mjs";
import * as E from "three";
import { Vector3 as R } from "three";
import { MeshLine as j, MeshLineMaterial as W } from "three.meshline";
import { a as N } from "./air-attenuation-CBIk1QMo.mjs";
import { a as g, w as Y, n as B } from "./audio-engine-BA44PQJC.mjs";
function $() {
  let o = [];
  const e = new j();
  e.setPoints(o);
  const t = new W({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new E.Mesh(e, t);
}
class D {
  // the source that all image sources are based off of
  // note: this is not the parent image source! that is 'parent' below 
  baseSource;
  children;
  parent;
  reflector;
  order;
  position;
  room;
  uuid;
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
      P.markup.addPoint([t.x, t.y, t.z], [0, 0, 0]), this.children[e].hasChildren && this.children[e].markupAllDescendents();
    }
  }
  markup() {
    let e = this.position.clone();
    P.markup.addPoint([e.x, e.y, e.z], [0, 0, 0]);
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
class K {
  path;
  uuid;
  highlight;
  constructor(e) {
    this.path = e, this.uuid = I(), this.highlight = !1;
  }
  markup() {
    for (let e = 0; e < this.path.length - 1; e++) {
      let t = this.path[e].point.clone(), r = this.path[e + 1].point.clone();
      P.markup.addLine([t.x, t.y, t.z], [r.x, r.y, r.z]);
    }
  }
  isvalid(e) {
    for (let t = 1; t <= this.order + 1; t++) {
      let r = this.path[t - 1].point, s = this.path[t].point, i = this.path[t - 1].reflectingSurface, l = this.path[t].reflectingSurface;
      for (let a = 1; a < e.length; a++)
        if (e[a] !== i && e[a] !== l) {
          let h = new R(0, 0, 0);
          h.subVectors(s, r), h.normalize();
          let u = new E.Raycaster();
          u.set(r, h);
          let c;
          c = u.intersectObject(e[a].mesh, !0);
          let d = [];
          for (let n = 0; n < c.length; n++)
            r.distanceTo(c[n].point) < r.distanceTo(s) && d.push(c[n]);
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
    let r = F(b(e));
    for (let l = 0; l < this.path.length; l++) {
      let a = this.path[l];
      if (a.reflectingSurface !== null) for (let h = 0; h < t.length; h++) {
        let u = 1 - a.reflectingSurface.absorptionFunction(t[h]);
        r[h] = r[h] * u;
      }
    }
    let s = T(U(r));
    const i = N(t);
    for (let l = 0; l < t.length; l++)
      s[l] = s[l] - i[l] * this.totalLength;
    return b(s);
  }
  arrivalTime(e) {
    return this.totalLength / e;
  }
}
const Z = {
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
class J extends x {
  sourceIDs;
  receiverIDs;
  roomID;
  surfaceIDs;
  uuid;
  levelTimeProgression;
  maxReflectionOrder;
  frequencies;
  _imageSourcesVisible;
  _rayPathsVisible;
  _plotOrders;
  impulseResponse;
  impulseResponsePlaying;
  rootImageSource;
  validRayPaths;
  allRayPaths;
  selectedImageSourcePath;
  _plotFrequency;
  isHybrid;
  constructor(e = Z, t = !1) {
    super(e), this.uuid = e.uuid || I(), this.kind = "image-source", this.name = e.name, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this.frequencies = e.frequencies, this._imageSourcesVisible = e.imageSourcesVisible, this._rayPathsVisible = e.rayPathsVisible, this._plotOrders = e.plotOrders, this.levelTimeProgression = e.levelTimeProgression || I(), this.isHybrid = t, this.impulseResponsePlaying = !1, this._plotFrequency = 1e3, this.isHybrid || S("ADD_RESULT", {
      kind: C.LevelTimeProgression,
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
    const r = V();
    this.roomID = r[0].uuid, this.selectedImageSourcePath = $(), P.markup.add(this.selectedImageSourcePath);
  }
  save() {
    return k([
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
    P.markup.remove(this.selectedImageSourcePath), this.reset(), S("REMOVE_RESULT", this.levelTimeProgression);
  }
  updateSelectedImageSourcePath(e) {
    this.selectedImageSourcePath.geometry.setPoints(
      e.path.map((t) => t.point.toArray()).flat()
    ), console.log(e.path.map((t) => t.point.toArray()).flat());
  }
  updateImageSourceCalculation() {
    this.clearRayPaths(), this.clearImageSources();
    let e = {
      baseSource: p.getState().containers[this.sourceIDs[0]],
      position: p.getState().containers[this.sourceIDs[0]].position.clone(),
      room: this.room,
      reflector: null,
      parent: null,
      order: 0
    }, t = new D(e), r = _(t, this.maxReflectionOrder);
    this.rootImageSource = r;
    let s, i = [];
    if (r !== null) {
      s = r.constructPathsForAllDescendents(p.getState().containers[this.receiverIDs[0]]), this.allRayPaths = s;
      for (let l = 0; l < s?.length; l++)
        s[l].isvalid(this.room.allSurfaces) && i.push(s[l]);
    }
    this.validRayPaths = i, this._imageSourcesVisible && this.drawImageSources(), this._rayPathsVisible && this.drawRayPaths(), this.isHybrid || this.calculateLTP(343);
  }
  // hybrid solver use only
  returnSortedPathsForHybrid(e, t, r) {
    this.updateImageSourceCalculation();
    let s = this.validRayPaths;
    s?.sort((l, a) => l.arrivalTime(e) > a.arrivalTime(e) ? 1 : -1);
    let i = [];
    if (s != null)
      for (let l = 0; l < s.length; l++) {
        let a = s[l].arrivalTime(e), h = s[l].arrivalPressure(t, r), u = {
          time: a,
          pressure: h
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
    r?.sort((i, l) => i.arrivalTime(e) > l.arrivalTime(e) ? 1 : -1);
    const s = { ...A.getState().results[this.levelTimeProgression] };
    if (s.data = [], s.info = {
      ...s.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    }, r !== void 0)
      for (let i = 0; i < r?.length; i++) {
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
    let t = [];
    if (this.validRayPaths !== null)
      for (let r = 0; r < this.validRayPaths?.length; r++)
        this.validRayPaths[r].order === e && t.push(this.validRayPaths[r]);
    return t;
  }
  test() {
    let e = M.postMessage("FETCH_SOURCE", this.sourceIDs[0])[0], t = {
      baseSource: e.clone(),
      position: e.position.clone(),
      room,
      reflector: null,
      parent: null,
      order: 0
    }, r = new D(t), i = _(r, 1);
    i?.markup(), console.log(i);
    let l = this.receivers[0];
    console.log(l);
    let a;
    if (i !== null) {
      a = i.constructPathsForAllDescendents(l);
      let h = [100, 100, 100, 100, 100, 100], u = 0;
      for (let c = 0; c < a.length; c++)
        a[c].isvalid(this.room.allSurfaces) && (a[c].markup(), console.log(a[c]), console.log(a[c].totalLength), console.log(a[c].arrivalTime(343)), console.log(b(h)), u++);
      console.log(u + " out of " + a.length + " paths are valid");
    }
  }
  clearLevelTimeProgressionData() {
    const e = { ...A.getState().results[this.levelTimeProgression] };
    e.data = [], S("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: e });
  }
  reset() {
    this.rootImageSource = null, this.allRayPaths = null, this.validRayPaths = null, this.plotOrders = this.possibleOrders.map((e) => e.value), this.selectedImageSourcePath.geometry.setPoints([]), this.clearImageSources(), this.clearRayPaths(), this.clearLevelTimeProgressionData();
  }
  // plot functions
  drawImageSources() {
    this.clearImageSources();
    for (let e = 0; e < this.plotOrders.length; e++) {
      let t = this.rootImageSource?.getChildrenOfOrder(this.plotOrders[e]);
      for (let r = 0; r < t?.length; r++)
        t[r].markup();
    }
  }
  clearImageSources() {
    P.markup.clearPoints();
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
    P.markup.clearLines();
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
    const t = this.frequencies, r = 44100, s = Array(t.length).fill(100);
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (this.validRayPaths?.length === 0) throw Error("No rays have been traced yet");
    let i = this.validRayPaths;
    if (i?.sort((l, a) => l.arrivalTime(343) > a.arrivalTime(343) ? 1 : -1), console.log(i), i != null) {
      const l = i[i.length - 1].arrivalTime(343) + 0.05, a = r * l;
      let h = [];
      for (let n = 0; n < this.frequencies.length; n++)
        h.push(new Float32Array(Math.floor(a)));
      for (let n = 0; n < i.length; n++) {
        let f = i[n].arrivalTime(343), O = i[n].arrivalPressure(s, this.frequencies);
        Math.random() > 0.5 && (O = O.map((v) => -v));
        let w = Math.floor(f * r);
        for (let v = 0; v < this.frequencies.length; v++)
          h[v][w] += O[v];
      }
      const u = g.createOfflineContext(1, a, r), c = Array(this.frequencies.length);
      for (let n = 0; n < this.frequencies.length; n++)
        c[n] = g.createFilteredSource(h[n], this.frequencies[n], 1.414, 1, u);
      console.log(c);
      const d = g.createMerger(c.length, u);
      for (let n = 0; n < c.length; n++)
        c[n].source.connect(d, 0, n);
      return d.connect(u.destination), c.forEach((n) => n.source.start()), this.impulseResponse = await g.renderContextAsync(u), this.impulseResponse;
    }
  }
  async playImpulseResponse() {
    this.impulseResponse || await this.calculateImpulseResponse().catch(console.error), g.context.state === "suspended" && g.context.resume(), console.log(this.impulseResponse);
    const e = g.context.createBufferSource();
    e.buffer = this.impulseResponse, e.connect(g.context.destination), e.start(), S("IMAGESOURCE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(g.context.destination), S("IMAGESOURCE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  async downloadImpulseResponse(e, t = 44100) {
    this.impulseResponse || await this.calculateImpulseResponse().catch(console.error);
    const r = Y([B(this.impulseResponse.getChannelData(0))], { sampleRate: t, bitDepth: 32 }), s = e.endsWith(".wav") ? "" : ".wav";
    q.saveAs(r, e + s);
  }
  // getters and setters
  get sources() {
    return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => p.getState().containers[e]) : [];
  }
  get receivers() {
    return this.receiverIDs.length > 0 && Object.keys(p.getState().containers).length > 0 ? this.receiverIDs.map((e) => p.getState().containers[e]) : [];
  }
  get room() {
    return p.getState().containers[this.roomID];
  }
  get numValidRays() {
    let e = this.validRayPaths?.length;
    return e === void 0 ? 0 : e;
  }
  get numTotalRays() {
    let e = this.allRayPaths?.length;
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
function _(o, e) {
  let t = o.room.allSurfaces;
  if (e == 0)
    return null;
  for (let r = 0; r < t.length; r++) {
    let s = o.reflector === null || o.reflector !== t[r], i;
    if (o.reflector !== null ? i = Q(t[r], o.reflector) : i = !0, s && i) {
      let l = {
        baseSource: o.baseSource,
        position: X(o.position.clone(), t[r]).clone(),
        room: o.room,
        reflector: t[r],
        parent: o,
        order: o.order + 1
      }, a = new D(l);
      o.children.push(a), e > 0 && _(a, e - 1);
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
  let i = new E.Raycaster();
  for (let h = r; h >= 1; h--) {
    let u = o.position.clone(), c = t[h + 1].point.clone(), d = new R(0, 0, 0);
    d.subVectors(u, c), d.normalize(), i.set(c, d);
    let n;
    if (o.reflector !== null && (n = i.intersectObject(o.reflector.mesh, !0)), n.length > 0) {
      let f = {
        point: n[0].point,
        reflectingSurface: o.reflector,
        angle: d.clone().multiplyScalar(-1).angleTo(n[0].face.normal)
      };
      t[h] = f;
    } else
      return null;
    o.parent !== null && (o = o.parent);
  }
  let l = {
    point: o.position.clone(),
    reflectingSurface: null,
    angle: null
  };
  return t[0] = l, new K(t);
}
function Q(o, e) {
  let t = o.normal.clone(), r = e.normal.clone();
  return t.dot(r) <= 0;
}
function X(o, e) {
  let t = new R(e.polygon.vertices[0][0], e.polygon.vertices[0][1], e.polygon.vertices[0][2]), r = new R(e.polygon.vertices[1][0], e.polygon.vertices[1][1], e.polygon.vertices[1][2]), s = new R(e.polygon.vertices[2][0], e.polygon.vertices[2][1], e.polygon.vertices[2][2]), i = e.localToWorld(t), l = e.localToWorld(r), a = e.localToWorld(s);
  l.sub(i), a.sub(i), l.cross(a), l.normalize();
  let h = e.normal.clone(), u = h.clone();
  u.multiplyScalar(-1);
  let c = i.dot(u), d = h.clone();
  d.multiplyScalar(o.dot(h) + c);
  let n = o.clone();
  n.sub(d);
  let f = d;
  return f.multiplyScalar(-1), f.add(n), f;
}
m("IMAGESOURCE_SET_PROPERTY", H);
m("REMOVE_IMAGESOURCE", z);
m("ADD_IMAGESOURCE", G(J));
m("UPDATE_IMAGESOURCE", (o) => void y.getState().solvers[o].updateImageSourceCalculation());
m("RESET_IMAGESOURCE", (o) => void y.getState().solvers[o].reset());
m("CALCULATE_LTP", (o) => void y.getState().solvers[o].calculateLTP(343));
m("IMAGESOURCE_PLAY_IR", (o) => void y.getState().solvers[o].playImpulseResponse().catch(console.error));
m("IMAGESOURCE_DOWNLOAD_IR", (o) => {
  const e = y.getState().solvers[o], t = p.getState().containers, r = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", s = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", i = `ir-imagesource-${r}-${s}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(i).catch(console.error);
});
export {
  J as ImageSourceSolver
};
//# sourceMappingURL=index-Cpx4GbwK.mjs.map
