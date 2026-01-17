var k = Object.defineProperty;
var M = (o, r, e) => r in o ? k(o, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[r] = e;
var h = (o, r, e) => M(o, typeof r != "symbol" ? r + "" : r, e);
import { S as q } from "./solver-z5p8Cank.mjs";
import { v as T, e as R, R as F, n as U, r as S, p as H, k as P, q as w, s as D, t as z, L as E, w as m, x as G, y as j, F as W, z as N, I as Y, A as B, o as v, B as $, C as K, D as Z, f as O } from "./index-KmIKz-wL.mjs";
import * as L from "three";
import { Vector3 as I } from "three";
import { MeshLine as J, MeshLineMaterial as Q } from "three.meshline";
function X() {
  let o = [];
  const r = new J();
  r.setPoints(o);
  const e = new Q({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new L.Mesh(r, e);
}
class _ {
  constructor(r) {
    // the source that all image sources are based off of
    // note: this is not the parent image source! that is 'parent' below 
    h(this, "baseSource");
    h(this, "children");
    h(this, "parent");
    h(this, "reflector");
    h(this, "order");
    h(this, "position");
    h(this, "room");
    h(this, "uuid");
    this.baseSource = r.baseSource, this.reflector = r.reflector, this.order = r.order, this.position = r.position, this.children = [], this.parent = r.parent, this.room = r.room, this.uuid = T();
  }
  constructPathsForAllDescendents(r, e = !0) {
    let t = [];
    if (e) {
      let s = x(this, r);
      s !== null && t.push(s);
    }
    for (let s = 0; s < this.children.length; s++) {
      let i = x(this.children[s], r);
      i !== null && t.push(i), this.children[s].hasChildren && (t = t.concat(this.children[s].constructPathsForAllDescendents(r, !1)));
    }
    return t;
  }
  markupAllDescendents() {
    for (let r = 0; r < this.children.length; r++) {
      let e = this.children[r].position.clone();
      S.markup.addPoint([e.x, e.y, e.z], [0, 0, 0]), this.children[r].hasChildren && this.children[r].markupAllDescendents();
    }
  }
  markup() {
    let r = this.position.clone();
    S.markup.addPoint([r.x, r.y, r.z], [0, 0, 0]);
  }
  getTotalDescendents() {
    let r = 0;
    for (let e = 0; e < this.children.length; e++)
      r++, this.children[e].hasChildren && (r = r + this.children[e].getTotalDescendents());
    return r;
  }
  getChildrenOfOrder(r) {
    let e = [];
    this.order === r && this.order === 0 && e.push(this);
    for (let t = 0; t < this.children.length; t++)
      if (this.children[t].order === r && e.push(this.children[t]), this.children[t].hasChildren) {
        let s = this.children[t].getChildrenOfOrder(r);
        e = e.concat(s);
      }
    return e;
  }
  get hasChildren() {
    return this.children.length > 0;
  }
}
class ee {
  constructor(r) {
    h(this, "path");
    h(this, "uuid");
    h(this, "highlight");
    this.path = r, this.uuid = T(), this.highlight = !1;
  }
  markup() {
    for (let r = 0; r < this.path.length - 1; r++) {
      let e = this.path[r].point.clone(), t = this.path[r + 1].point.clone();
      S.markup.addLine([e.x, e.y, e.z], [t.x, t.y, t.z]);
    }
  }
  isvalid(r) {
    for (let e = 1; e <= this.order + 1; e++) {
      let t = this.path[e - 1].point, s = this.path[e].point, i = this.path[e - 1].reflectingSurface, l = this.path[e].reflectingSurface;
      for (let a = 1; a < r.length; a++)
        if (r[a] !== i && r[a] !== l) {
          let n = new I(0, 0, 0);
          n.subVectors(s, t), n.normalize();
          let g = new L.Raycaster();
          g.set(t, n);
          let p;
          p = g.intersectObject(r[a].mesh, !0);
          let c = [];
          for (let d = 0; d < p.length; d++)
            t.distanceTo(p[d].point) < t.distanceTo(s) && c.push(p[d]);
          if (c.length > 0)
            return !1;
        }
    }
    return !0;
  }
  get order() {
    return this.path.length - 2;
  }
  get totalLength() {
    let r = 0, e, t;
    for (let s = 1; s < this.path.length; s++)
      e = this.path[s - 1].point, t = this.path[s].point, r = r + e.distanceTo(t);
    return r;
  }
  arrivalPressure(r, e) {
    let t = N(E(r));
    for (let l = 0; l < this.path.length; l++) {
      let a = this.path[l];
      if (a.reflectingSurface !== null) for (let n = 0; n < e.length; n++) {
        let g = 1 - a.reflectingSurface.absorptionFunction(e[n]);
        t[n] = t[n] * g;
      }
    }
    let s = D(Y(t));
    const i = B(e);
    for (let l = 0; l < e.length; l++)
      s[l] = s[l] - i[l] * this.totalLength;
    return E(s);
  }
  arrivalTime(r) {
    return this.totalLength / r;
  }
}
const te = {
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
class re extends q {
  constructor(e = te, t = !1) {
    super(e);
    h(this, "sourceIDs");
    h(this, "receiverIDs");
    h(this, "roomID");
    h(this, "surfaceIDs");
    h(this, "uuid");
    h(this, "levelTimeProgression");
    h(this, "maxReflectionOrder");
    h(this, "frequencies");
    h(this, "_imageSourcesVisible");
    h(this, "_rayPathsVisible");
    h(this, "_plotOrders");
    h(this, "impulseResponse");
    h(this, "impulseResponsePlaying");
    h(this, "rootImageSource");
    h(this, "validRayPaths");
    h(this, "allRayPaths");
    h(this, "selectedImageSourcePath");
    h(this, "_plotFrequency");
    h(this, "isHybrid");
    this.uuid = e.uuid || T(), this.kind = "image-source", this.name = e.name, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this.frequencies = e.frequencies, this._imageSourcesVisible = e.imageSourcesVisible, this._rayPathsVisible = e.rayPathsVisible, this._plotOrders = e.plotOrders, this.levelTimeProgression = e.levelTimeProgression || T(), this.isHybrid = t, this.impulseResponsePlaying = !1, this._plotFrequency = 1e3, this.isHybrid || R("ADD_RESULT", {
      kind: F.LevelTimeProgression,
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
    const s = U();
    this.roomID = s[0].uuid, this.selectedImageSourcePath = X(), S.markup.add(this.selectedImageSourcePath);
  }
  save() {
    return H([
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
    S.markup.remove(this.selectedImageSourcePath), this.reset(), R("REMOVE_RESULT", this.levelTimeProgression);
  }
  updateSelectedImageSourcePath(e) {
    this.selectedImageSourcePath.geometry.setPoints(
      e.path.map((t) => t.point.toArray()).flat()
    ), console.log(e.path.map((t) => t.point.toArray()).flat());
  }
  updateImageSourceCalculation() {
    this.clearRayPaths(), this.clearImageSources();
    let e = {
      baseSource: P.getState().containers[this.sourceIDs[0]],
      position: P.getState().containers[this.sourceIDs[0]].position.clone(),
      room: this.room,
      reflector: null,
      parent: null,
      order: 0
    }, t = new _(e), s = A(t, this.maxReflectionOrder);
    this.rootImageSource = s;
    let i, l = [];
    if (s !== null) {
      i = s.constructPathsForAllDescendents(P.getState().containers[this.receiverIDs[0]]), this.allRayPaths = i;
      for (let a = 0; a < (i == null ? void 0 : i.length); a++)
        i[a].isvalid(this.room.allSurfaces) && l.push(i[a]);
    }
    this.validRayPaths = l, this._imageSourcesVisible && this.drawImageSources(), this._rayPathsVisible && this.drawRayPaths(), this.isHybrid || this.calculateLTP(343);
  }
  // hybrid solver use only
  returnSortedPathsForHybrid(e, t, s) {
    this.updateImageSourceCalculation();
    let i = this.validRayPaths;
    i == null || i.sort((a, n) => a.arrivalTime(e) > n.arrivalTime(e) ? 1 : -1);
    let l = [];
    if (i != null)
      for (let a = 0; a < i.length; a++) {
        let n = i[a].arrivalTime(e), g = i[a].arrivalPressure(t, s), p = {
          time: n,
          pressure: g
        };
        l.push(p);
      }
    return l;
  }
  calculateLTP(e, t = !1) {
    if (!this.validRayPaths || this.validRayPaths.length === 0) {
      if (this.sourceIDs.length > 0 && this.receiverIDs.length > 0) {
        this.updateImageSourceCalculation();
        return;
      }
      return;
    }
    let s = this.validRayPaths;
    s == null || s.sort((l, a) => l.arrivalTime(e) > a.arrivalTime(e) ? 1 : -1);
    const i = { ...w.getState().results[this.levelTimeProgression] };
    if (i.data = [], i.info = {
      ...i.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    }, s !== void 0)
      for (let l = 0; l < (s == null ? void 0 : s.length); l++) {
        let a = s[l].arrivalTime(343), n = s[l].arrivalPressure(i.info.initialSPL, i.info.frequency);
        t && console.log("Arrival: " + (l + 1) + " | Arrival Time: (s) " + a + " | Arrival Pressure(1000Hz): " + n + " | Order " + s[l].order), i.data.push({
          time: a,
          pressure: D(n),
          arrival: l + 1,
          order: s[l].order,
          uuid: s[l].uuid
        });
      }
    R("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: i });
  }
  getPathsOfOrder(e) {
    var s;
    let t = [];
    if (this.validRayPaths !== null)
      for (let i = 0; i < ((s = this.validRayPaths) == null ? void 0 : s.length); i++)
        this.validRayPaths[i].order === e && t.push(this.validRayPaths[i]);
    return t;
  }
  test() {
    let e = z.postMessage("FETCH_SOURCE", this.sourceIDs[0])[0], t = {
      baseSource: e.clone(),
      position: e.position.clone(),
      room,
      reflector: null,
      parent: null,
      order: 0
    }, s = new _(t), l = A(s, 1);
    l == null || l.markup(), console.log(l);
    let a = this.receivers[0];
    console.log(a);
    let n;
    if (l !== null) {
      n = l.constructPathsForAllDescendents(a);
      let g = [100, 100, 100, 100, 100, 100], p = 0;
      for (let c = 0; c < n.length; c++)
        n[c].isvalid(this.room.allSurfaces) && (n[c].markup(), console.log(n[c]), console.log(n[c].totalLength), console.log(n[c].arrivalTime(343)), console.log(E(g)), p++);
      console.log(p + " out of " + n.length + " paths are valid");
    }
  }
  clearLevelTimeProgressionData() {
    const e = { ...w.getState().results[this.levelTimeProgression] };
    e.data = [], R("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: e });
  }
  reset() {
    this.rootImageSource = null, this.allRayPaths = null, this.validRayPaths = null, this.plotOrders = this.possibleOrders.map((e) => e.value), this.selectedImageSourcePath.geometry.setPoints([]), this.clearImageSources(), this.clearRayPaths(), this.clearLevelTimeProgressionData();
  }
  // plot functions
  drawImageSources() {
    var e;
    this.clearImageSources();
    for (let t = 0; t < this.plotOrders.length; t++) {
      let s = (e = this.rootImageSource) == null ? void 0 : e.getChildrenOfOrder(this.plotOrders[t]);
      for (let i = 0; i < (s == null ? void 0 : s.length); i++)
        s[i].markup();
    }
  }
  clearImageSources() {
    S.markup.clearPoints();
  }
  drawRayPaths(e) {
    this.clearRayPaths();
    for (let t = 0; t < this.plotOrders.length; t++) {
      let s = this.getPathsOfOrder(this.plotOrders[t]);
      for (let i = 0; i < s.length; i++)
        s[i].markup();
    }
  }
  clearRayPaths() {
    S.markup.clearLines();
  }
  toggleRayPathHighlight(e) {
    if (this.validRayPaths != null) {
      for (let t = 0; t < this.validRayPaths.length; t++)
        if (e === this.validRayPaths[t].uuid) {
          this.updateSelectedImageSourcePath(this.validRayPaths[t]), console.log("WILL HIGHLIGHT RAY PATH WITH ARRIVAL SPL " + D(this.validRayPaths[t].arrivalPressure([100], [1e3])) + " AND ARRIVAL TIME " + this.validRayPaths[t].arrivalTime(343));
          break;
        }
    }
  }
  async calculateImpulseResponse() {
    var a;
    const t = this.frequencies, s = 44100, i = Array(t.length).fill(100);
    if (this.receiverIDs.length === 0) throw Error("No receivers have been assigned to the raytracer");
    if (this.sourceIDs.length === 0) throw Error("No sources have been assigned to the raytracer");
    if (((a = this.validRayPaths) == null ? void 0 : a.length) === 0) throw Error("No rays have been traced yet");
    let l = this.validRayPaths;
    if (l == null || l.sort((n, g) => n.arrivalTime(343) > g.arrivalTime(343) ? 1 : -1), console.log(l), l != null) {
      const n = l[l.length - 1].arrivalTime(343) + 0.05, g = s * n;
      let p = [];
      for (let u = 0; u < this.frequencies.length; u++)
        p.push(new Float32Array(Math.floor(g)));
      for (let u = 0; u < l.length; u++) {
        let C = l[u].arrivalTime(343), b = l[u].arrivalPressure(i, this.frequencies);
        Math.random() > 0.5 && (b = b.map((y) => -y));
        let V = Math.floor(C * s);
        for (let y = 0; y < this.frequencies.length; y++)
          p[y][V] += b[y];
      }
      const c = m.createOfflineContext(1, g, s), d = Array(this.frequencies.length);
      for (let u = 0; u < this.frequencies.length; u++)
        d[u] = m.createFilteredSource(p[u], this.frequencies[u], 1.414, 1, c);
      console.log(d);
      const f = m.createMerger(d.length, c);
      for (let u = 0; u < d.length; u++)
        d[u].source.connect(f, 0, u);
      return f.connect(c.destination), d.forEach((u) => u.source.start()), this.impulseResponse = await m.renderContextAsync(c), this.impulseResponse;
    }
  }
  async playImpulseResponse() {
    this.impulseResponse || await this.calculateImpulseResponse().catch(console.error), m.context.state === "suspended" && m.context.resume(), console.log(this.impulseResponse);
    const e = m.context.createBufferSource();
    e.buffer = this.impulseResponse, e.connect(m.context.destination), e.start(), R("IMAGESOURCE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(m.context.destination), R("IMAGESOURCE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  async downloadImpulseResponse(e, t = 44100) {
    this.impulseResponse || await this.calculateImpulseResponse().catch(console.error);
    const s = G([j(this.impulseResponse.getChannelData(0))], { sampleRate: t, bitDepth: 32 }), i = e.endsWith(".wav") ? "" : ".wav";
    W.saveAs(s, e + i);
  }
  // getters and setters
  get sources() {
    return this.sourceIDs.length > 0 ? this.sourceIDs.map((e) => P.getState().containers[e]) : [];
  }
  get receivers() {
    return this.receiverIDs.length > 0 && Object.keys(P.getState().containers).length > 0 ? this.receiverIDs.map((e) => P.getState().containers[e]) : [];
  }
  get room() {
    return P.getState().containers[this.roomID];
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
      let s = {
        value: t,
        label: t.toString()
      };
      e.push(s);
    }
    return e;
  }
  get selectedPlotOrders() {
    let e = [];
    for (let t = 0; t < this.plotOrders.length; t++) {
      let s = {
        value: this.plotOrders[t],
        label: this.plotOrders[t].toString()
      };
      e.push(s);
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
function A(o, r) {
  let e = o.room.allSurfaces;
  if (r == 0)
    return null;
  for (let t = 0; t < e.length; t++) {
    let s = o.reflector === null || o.reflector !== e[t], i;
    if (o.reflector !== null ? i = se(e[t], o.reflector) : i = !0, s && i) {
      let l = {
        baseSource: o.baseSource,
        position: ie(o.position.clone(), e[t]).clone(),
        room: o.room,
        reflector: e[t],
        parent: o,
        order: o.order + 1
      }, a = new _(l);
      o.children.push(a), r > 0 && A(a, r - 1);
    }
  }
  return o;
}
function x(o, r) {
  let e = [], t = o.order, s = {
    point: r.position.clone(),
    reflectingSurface: null,
    angle: null
  };
  e[t + 1] = s;
  let i = new L.Raycaster();
  for (let n = t; n >= 1; n--) {
    let g = o.position.clone(), p = e[n + 1].point.clone(), c = new I(0, 0, 0);
    c.subVectors(g, p), c.normalize(), i.set(p, c);
    let d;
    if (o.reflector !== null && (d = i.intersectObject(o.reflector.mesh, !0)), d.length > 0) {
      let f = {
        point: d[0].point,
        reflectingSurface: o.reflector,
        angle: c.clone().multiplyScalar(-1).angleTo(d[0].face.normal)
      };
      e[n] = f;
    } else
      return null;
    o.parent !== null && (o = o.parent);
  }
  let l = {
    point: o.position.clone(),
    reflectingSurface: null,
    angle: null
  };
  return e[0] = l, new ee(e);
}
function se(o, r) {
  let e = o.normal.clone(), t = r.normal.clone();
  return e.dot(t) <= 0;
}
function ie(o, r) {
  let e = new I(r.polygon.vertices[0][0], r.polygon.vertices[0][1], r.polygon.vertices[0][2]), t = new I(r.polygon.vertices[1][0], r.polygon.vertices[1][1], r.polygon.vertices[1][2]), s = new I(r.polygon.vertices[2][0], r.polygon.vertices[2][1], r.polygon.vertices[2][2]), i = r.localToWorld(e), l = r.localToWorld(t), a = r.localToWorld(s);
  l.sub(i), a.sub(i), l.cross(a), l.normalize();
  let n = r.normal.clone(), g = n.clone();
  g.multiplyScalar(-1);
  let p = i.dot(g), c = n.clone();
  c.multiplyScalar(o.dot(n) + p);
  let d = o.clone();
  d.sub(c);
  let f = c;
  return f.multiplyScalar(-1), f.add(d), f;
}
v("IMAGESOURCE_SET_PROPERTY", $);
v("REMOVE_IMAGESOURCE", K);
v("ADD_IMAGESOURCE", Z(re));
v("UPDATE_IMAGESOURCE", (o) => void O.getState().solvers[o].updateImageSourceCalculation());
v("RESET_IMAGESOURCE", (o) => void O.getState().solvers[o].reset());
v("CALCULATE_LTP", (o) => void O.getState().solvers[o].calculateLTP(343));
v("IMAGESOURCE_PLAY_IR", (o) => void O.getState().solvers[o].playImpulseResponse().catch(console.error));
v("IMAGESOURCE_DOWNLOAD_IR", (o) => {
  var l, a;
  const r = O.getState().solvers[o], e = P.getState().containers, t = r.sourceIDs.length > 0 && ((l = e[r.sourceIDs[0]]) == null ? void 0 : l.name) || "source", s = r.receiverIDs.length > 0 && ((a = e[r.receiverIDs[0]]) == null ? void 0 : a.name) || "receiver", i = `ir-imagesource-${t}-${s}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  r.downloadImpulseResponse(i).catch(console.error);
});
export {
  re as ImageSourceSolver,
  re as default
};
//# sourceMappingURL=index-CjthJHY6.mjs.map
