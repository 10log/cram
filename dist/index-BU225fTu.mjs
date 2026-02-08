import { S as C } from "./solver-BP4XtfBW.mjs";
import { v as y, e as v, R as V, g as M, r as P, p as k, u as m, a as A, P as O, m as F, L as T, F as q, b as U, I as H, o as f, s as G, c as z, d as j, f as R } from "./index-Cm7mh5nT.mjs";
import * as E from "three";
import { Vector3 as _ } from "three";
import { MeshLine as N, MeshLineMaterial as W } from "three.meshline";
import { a as Y } from "./air-attenuation-CBIk1QMo.mjs";
import { s as B } from "./sound-speed-Biev-mJ1.mjs";
import { a as g, w as $, n as K } from "./audio-engine-CqZtbt41.mjs";
function Z() {
  let o = [];
  const e = new N();
  e.setPoints(o);
  const t = new W({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new E.Mesh(e, t);
}
class b {
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
    this.baseSource = e.baseSource, this.reflector = e.reflector, this.order = e.order, this.position = e.position, this.children = [], this.parent = e.parent, this.room = e.room, this.uuid = y();
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
class J {
  path;
  uuid;
  highlight;
  constructor(e) {
    this.path = e, this.uuid = y(), this.highlight = !1;
  }
  markup() {
    for (let e = 0; e < this.path.length - 1; e++) {
      let t = this.path[e].point.clone(), r = this.path[e + 1].point.clone();
      P.markup.addLine([t.x, t.y, t.z], [r.x, r.y, r.z]);
    }
  }
  isvalid(e) {
    for (let t = 1; t <= this.order + 1; t++) {
      let r = this.path[t - 1].point, s = this.path[t].point, i = this.path[t - 1].reflectingSurface, a = this.path[t].reflectingSurface;
      for (let l = 0; l < e.length; l++)
        if (e[l] !== i && e[l] !== a) {
          let n = new _(0, 0, 0);
          n.subVectors(s, r), n.normalize();
          let h = new E.Raycaster();
          h.set(r, n);
          let c;
          c = h.intersectObject(e[l].mesh, !0);
          let d = [];
          for (let p = 0; p < c.length; p++)
            r.distanceTo(c[p].point) < r.distanceTo(s) && d.push(c[p]);
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
  arrivalPressure(e, t, r = 20) {
    let s = U(T(e));
    for (let l = 0; l < this.path.length; l++) {
      let n = this.path[l];
      if (n.reflectingSurface !== null) for (let h = 0; h < t.length; h++) {
        const c = Math.abs(n.reflectingSurface.reflectionFunction(t[h], n.angle));
        s[h] = s[h] * c;
      }
    }
    let i = O(H(s));
    const a = Y(t, r);
    for (let l = 0; l < t.length; l++)
      i[l] = i[l] - a[l] * this.totalLength;
    return T(i);
  }
  arrivalTime(e) {
    return this.totalLength / e;
  }
}
const Q = {
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
class X extends C {
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
  constructor(e = Q, t = !1) {
    super(e), this.uuid = e.uuid || y(), this.kind = "image-source", this.name = e.name, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this.frequencies = e.frequencies, this._imageSourcesVisible = e.imageSourcesVisible, this._rayPathsVisible = e.rayPathsVisible, this._plotOrders = e.plotOrders, this.levelTimeProgression = e.levelTimeProgression || y(), this.isHybrid = t, this.impulseResponsePlaying = !1, this._plotFrequency = 1e3, this.isHybrid || v("ADD_RESULT", {
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
    const r = M();
    this.roomID = r[0].uuid, this.selectedImageSourcePath = Z(), P.markup.add(this.selectedImageSourcePath);
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
    P.markup.remove(this.selectedImageSourcePath), this.reset(), v("REMOVE_RESULT", this.levelTimeProgression);
  }
  updateSelectedImageSourcePath(e) {
    this.selectedImageSourcePath.geometry.setPoints(
      new Float32Array(e.path.map((t) => t.point.toArray()).flat())
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
    }, t = new b(e), r = D(t, this.maxReflectionOrder);
    this.rootImageSource = r;
    let s, i = [];
    if (r !== null) {
      s = r.constructPathsForAllDescendents(m.getState().containers[this.receiverIDs[0]]), this.allRayPaths = s;
      for (let a = 0; a < s?.length; a++)
        s[a].isvalid(this.room.allSurfaces) && i.push(s[a]);
    }
    this.validRayPaths = i, this._imageSourcesVisible && this.drawImageSources(), this._rayPathsVisible && this.drawRayPaths(), this.isHybrid || this.calculateLTP();
  }
  // hybrid solver use only
  returnSortedPathsForHybrid(e, t, r) {
    this.updateImageSourceCalculation();
    let s = this.validRayPaths;
    s?.sort((a, l) => a.arrivalTime(e) > l.arrivalTime(e) ? 1 : -1);
    let i = [];
    if (s != null)
      for (let a = 0; a < s.length; a++) {
        let l = s[a].arrivalTime(e), n = s[a].arrivalPressure(t, r, this.temperature), h = {
          time: l,
          pressure: n
        };
        i.push(h);
      }
    return i;
  }
  calculateLTP(e = this.c, t = !1) {
    if (!this.validRayPaths || this.validRayPaths.length === 0) {
      if (this.sourceIDs.length > 0 && this.receiverIDs.length > 0) {
        this.updateImageSourceCalculation();
        return;
      }
      return;
    }
    let r = this.validRayPaths;
    r?.sort((i, a) => i.arrivalTime(e) > a.arrivalTime(e) ? 1 : -1);
    const s = { ...A.getState().results[this.levelTimeProgression] };
    if (s.data = [], s.info = {
      ...s.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    }, r !== void 0)
      for (let i = 0; i < r?.length; i++) {
        let a = r[i].arrivalTime(e), l = r[i].arrivalPressure(s.info.initialSPL, s.info.frequency, this.temperature);
        t && console.log("Arrival: " + (i + 1) + " | Arrival Time: (s) " + a + " | Arrival Pressure(1000Hz): " + l + " | Order " + r[i].order), s.data.push({
          time: a,
          pressure: O(l),
          arrival: i + 1,
          order: r[i].order,
          uuid: r[i].uuid
        });
      }
    v("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: s });
  }
  getPathsOfOrder(e) {
    let t = [];
    if (this.validRayPaths !== null)
      for (let r = 0; r < this.validRayPaths?.length; r++)
        this.validRayPaths[r].order === e && t.push(this.validRayPaths[r]);
    return t;
  }
  test() {
    let e = F.postMessage("FETCH_SOURCE", this.sourceIDs[0])[0], t = {
      baseSource: e.clone(),
      position: e.position.clone(),
      room: this.room,
      reflector: null,
      parent: null,
      order: 0
    }, r = new b(t), i = D(r, 1);
    i?.markup(), console.log(i);
    let a = this.receivers[0];
    console.log(a);
    let l;
    if (i !== null) {
      l = i.constructPathsForAllDescendents(a);
      let n = [100, 100, 100, 100, 100, 100], h = 0;
      for (let c = 0; c < l.length; c++)
        l[c].isvalid(this.room.allSurfaces) && (l[c].markup(), console.log(l[c]), console.log(l[c].totalLength), console.log(l[c].arrivalTime(this.c)), console.log(T(n)), h++);
      console.log(h + " out of " + l.length + " paths are valid");
    }
  }
  clearLevelTimeProgressionData() {
    const e = { ...A.getState().results[this.levelTimeProgression] };
    e.data = [], v("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: e });
  }
  reset() {
    this.rootImageSource = null, this.allRayPaths = null, this.validRayPaths = null, this.plotOrders = this.possibleOrders.map((e) => e.value), this.selectedImageSourcePath.geometry.setPoints(new Float32Array(0)), this.clearImageSources(), this.clearRayPaths(), this.clearLevelTimeProgressionData();
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
          this.updateSelectedImageSourcePath(this.validRayPaths[t]), console.log("WILL HIGHLIGHT RAY PATH WITH ARRIVAL SPL " + O(this.validRayPaths[t].arrivalPressure([100], [1e3], this.temperature)) + " AND ARRIVAL TIME " + this.validRayPaths[t].arrivalTime(this.c));
          break;
        }
    }
  }
  async calculateImpulseResponse() {
    const t = this.frequencies, r = 44100, s = Array(t.length).fill(100);
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (this.validRayPaths?.length === 0) throw Error("No rays have been traced yet");
    const i = this.c;
    let a = this.validRayPaths;
    if (a?.sort((l, n) => l.arrivalTime(i) > n.arrivalTime(i) ? 1 : -1), console.log(a), a != null) {
      const l = a[a.length - 1].arrivalTime(i) + 0.05, n = r * l;
      let h = [];
      for (let u = 0; u < this.frequencies.length; u++)
        h.push(new Float32Array(Math.floor(n)));
      for (let u = 0; u < a.length; u++) {
        let w = a[u].arrivalTime(i), I = a[u].arrivalPressure(s, this.frequencies, this.temperature);
        Math.random() > 0.5 && (I = I.map((S) => -S));
        let x = Math.floor(w * r);
        for (let S = 0; S < this.frequencies.length; S++)
          h[S][x] += I[S];
      }
      const c = g.createOfflineContext(1, n, r), d = Array(this.frequencies.length);
      for (let u = 0; u < this.frequencies.length; u++)
        d[u] = g.createFilteredSource(h[u], this.frequencies[u], 1.414, 1, c);
      console.log(d);
      const p = g.createMerger(d.length, c);
      for (let u = 0; u < d.length; u++)
        d[u].source.connect(p, 0, u);
      return p.connect(c.destination), d.forEach((u) => u.source.start()), this.impulseResponse = await g.renderContextAsync(c), this.impulseResponse;
    }
  }
  async playImpulseResponse() {
    this.impulseResponse || await this.calculateImpulseResponse().catch(console.error), g.context.state === "suspended" && g.context.resume(), console.log(this.impulseResponse);
    const e = g.context.createBufferSource();
    e.buffer = this.impulseResponse, e.connect(g.context.destination), e.start(), v("IMAGESOURCE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(g.context.destination), v("IMAGESOURCE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  async downloadImpulseResponse(e, t = 44100) {
    this.impulseResponse || await this.calculateImpulseResponse().catch(console.error);
    const r = $([K(this.impulseResponse.getChannelData(0))], { sampleRate: t, bitDepth: 32 }), s = e.endsWith(".wav") ? "" : ".wav";
    q.saveAs(r, e + s);
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
  get temperature() {
    return this.room?.temperature ?? 20;
  }
  get c() {
    return B(this.temperature);
  }
  set plotFrequency(e) {
    this._plotFrequency = e, this.calculateLTP();
  }
}
function D(o, e) {
  let t = o.room.allSurfaces;
  if (e == 0)
    return null;
  for (let r = 0; r < t.length; r++) {
    let s = o.reflector === null || o.reflector !== t[r], i;
    if (o.reflector !== null ? i = ee(t[r], o.reflector) : i = !0, s && i) {
      let a = {
        baseSource: o.baseSource,
        position: te(o.position.clone(), t[r]).clone(),
        room: o.room,
        reflector: t[r],
        parent: o,
        order: o.order + 1
      }, l = new b(a);
      o.children.push(l), e > 0 && D(l, e - 1);
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
  for (let n = r; n >= 1; n--) {
    let h = o.position.clone(), c = t[n + 1].point.clone(), d = new _(0, 0, 0);
    if (d.subVectors(h, c), d.normalize(), i.set(c, d), o.reflector === null)
      return null;
    const p = i.intersectObject(o.reflector.mesh, !0);
    if (p.length > 0) {
      let u = {
        point: p[0].point,
        reflectingSurface: o.reflector,
        angle: d.clone().multiplyScalar(-1).angleTo(p[0].face.normal)
      };
      t[n] = u;
    } else
      return null;
    o.parent !== null && (o = o.parent);
  }
  let a = {
    point: o.position.clone(),
    reflectingSurface: null,
    angle: null
  };
  return t[0] = a, new J(t);
}
function ee(o, e) {
  let t = o.normal.clone(), r = e.normal.clone();
  return t.dot(r) <= 0;
}
function te(o, e) {
  let t = new _(e.polygon.vertices[0][0], e.polygon.vertices[0][1], e.polygon.vertices[0][2]), r = e.localToWorld(t), s = e.normal.clone(), i = s.clone();
  i.multiplyScalar(-1);
  let a = r.dot(i), l = s.clone();
  l.multiplyScalar(o.dot(s) + a);
  let n = o.clone();
  n.sub(l);
  let h = l;
  return h.multiplyScalar(-1), h.add(n), h;
}
f("IMAGESOURCE_SET_PROPERTY", G);
f("REMOVE_IMAGESOURCE", z);
f("ADD_IMAGESOURCE", j(X));
f("UPDATE_IMAGESOURCE", (o) => void R.getState().solvers[o].updateImageSourceCalculation());
f("RESET_IMAGESOURCE", (o) => void R.getState().solvers[o].reset());
f("CALCULATE_LTP", (o) => void R.getState().solvers[o].calculateLTP());
f("IMAGESOURCE_PLAY_IR", (o) => void R.getState().solvers[o].playImpulseResponse().catch(console.error));
f("IMAGESOURCE_DOWNLOAD_IR", (o) => {
  const e = R.getState().solvers[o], t = m.getState().containers, r = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", s = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", i = `ir-imagesource-${r}-${s}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(i).catch(console.error);
});
export {
  X as ImageSourceSolver,
  X as default
};
//# sourceMappingURL=index-BU225fTu.mjs.map
