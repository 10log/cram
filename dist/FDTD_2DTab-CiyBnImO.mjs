import { jsxs as t, jsx as i } from "react/jsx-runtime";
import { useState as o } from "react";
import { l as U, o as x, m as Y, n as Z, s as $, q as Q, M as X, t as ee, r as O, F as se, E as M, v as re, f as ie, P as p, S as v, a as l, b as a, h as te, d as u } from "./index-CT5_YzQr.mjs";
import * as g from "three";
import oe from "chroma-js";
const A = {
  color: 14511983
};
class le extends Q {
  mesh;
  selectedMaterial;
  normalMaterial;
  fdtdSamples;
  constructor(r, h) {
    super(r || "new receiver"), this.kind = "receiver", this.fdtdSamples = [], this.selectedMaterial = new g.MeshMatcapMaterial({
      fog: !1,
      color: A.color,
      matcap: X,
      name: "receiver-selected-material"
    }), this.normalMaterial = new g.MeshMatcapMaterial({
      fog: !1,
      color: A.color,
      matcap: ee,
      name: "receiver-material"
    }), this.mesh = new g.Mesh(new g.SphereGeometry(0.1, 32, 16), this.normalMaterial), this.mesh.userData.kind = "receiver", this.add(this.mesh), this.select = () => {
      if (!this.selected) {
        this.selected = !0;
        let s = oe(this.mesh.material.color.getHex()).brighten(1).num();
        this.selectedMaterial.color.setHex(s), this.mesh.material = this.selectedMaterial;
      }
    }, this.deselect = () => {
      this.selected && (this.selected = !1, this.mesh.material = this.normalMaterial);
    }, this.renderCallback = (s) => {
    }, O.add(this);
  }
  dispose() {
    O.remove(this);
  }
  save() {
    const r = this.name, h = this.visible, s = this.position.toArray(), f = this.scale.toArray(), b = this.rotation.toArray().slice(0, 3), C = this.getColorAsNumber(), S = this.uuid;
    return {
      kind: this.kind,
      name: r,
      visible: h,
      position: s,
      scale: f,
      rotation: b,
      color: C,
      uuid: S
    };
  }
  restore(r) {
    return this.name = r.name, this.visible = r.visible, this.position.set(r.position[0], r.position[1], r.position[2]), this.scale.set(r.scale[0], r.scale[1], r.scale[2]), this.rotation.set(
      Number(r.rotation[0]),
      Number(r.rotation[1]),
      Number(r.rotation[2])
    ), this.color = r.color, this.uuid = r.uuid, this;
  }
  clearSamples() {
    this.fdtdSamples = [];
  }
  saveSamples() {
    if (this.fdtdSamples.length > 0) {
      const r = new Blob([this.fdtdSamples.join(`
`)], {
        type: "text/plain;charset=utf-8"
      });
      se.saveAs(r, `fdtdsamples-receiver-${this.name}.txt`);
    } else return;
  }
  getColorAsNumber() {
    return this.mesh.material.color.getHex();
  }
  getColorAsString() {
    return "#" + this.mesh.material.color.getHexString();
  }
  onModeChange(r) {
    switch (r) {
      case M.OBJECT:
        break;
      case M.SKETCH:
        break;
      case M.EDIT:
        break;
    }
  }
  get color() {
    return "#" + this.mesh.material.color.getHexString();
  }
  set color(r) {
    typeof r == "string" ? (this.mesh.material.color.setStyle(r), this.normalMaterial.color.setStyle(r), this.selectedMaterial.color.setStyle(r)) : (this.mesh.material.color.setHex(r), this.normalMaterial.color.setHex(r), this.selectedMaterial.color.setHex(r));
  }
  get brief() {
    return {
      uuid: this.uuid,
      name: this.name,
      selected: this.selected,
      kind: this.kind,
      children: []
    };
  }
}
x("ADD_RECEIVER", Y(le));
x("REMOVE_RECEIVER", Z);
x("RECEIVER_SET_PROPERTY", $);
const ae = () => U("receiver"), ue = ({ uuid: E }) => {
  const r = re(), h = ae(), s = ie((e) => e.solvers[E]), [f, b] = o(s.uniforms.colorBrightness.value), [C, S] = o(s.mesh.scale.z), [D, F] = o(s.heightmapVariable.material.uniforms.damping.value), [_, H] = o(s.numPasses), [K, y] = o(s.running), [V, w] = o(s.recording), [k, B] = o(s.getWireframeVisible()), [m, N] = o(!1), [d, I] = o(!1), [T, W] = o(!1), [j, R] = o(s.sourceKeys), L = r.filter((e) => !s.sources[e.uuid]), [P, q] = o(!1), [z, G] = o(s.receiverKeys), J = h.filter((e) => !s.receiverKeys[e.uuid]);
  return /* @__PURE__ */ t("div", { children: [
    /* @__PURE__ */ t(
      p,
      {
        id: "view",
        label: "View",
        open: m,
        onOpenClose: () => N(!m),
        children: [
          /* @__PURE__ */ i(
            v,
            {
              id: "colorBrightness",
              label: "Color Brightness",
              labelPosition: "left",
              tooltipText: "Changes the color brightness",
              min: 0,
              max: 40,
              step: 0.1,
              value: f,
              hasToolTip: m,
              onChange: (e) => {
                s.uniforms.colorBrightness.value = e.value, b(e.value);
              }
            }
          ),
          /* @__PURE__ */ i(
            v,
            {
              id: "heightScale",
              label: "Height Scale",
              labelPosition: "left",
              tooltipText: "Height Scale",
              min: 0,
              max: 1,
              step: 1e-3,
              hasToolTip: m,
              value: C,
              onChange: (e) => {
                s.mesh.scale.setZ(e.value === 0 ? 1e-3 : e.value), S(e.value);
              }
            }
          ),
          /* @__PURE__ */ t(l, { children: [
            /* @__PURE__ */ i(a, { hasToolTip: m, label: "Wireframe", tooltip: "Display mesh as wirefame" }),
            /* @__PURE__ */ i(
              te,
              {
                onChange: (e) => {
                  s.setWireframeVisible(e.value), B(e.value);
                },
                value: k
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ t(
      p,
      {
        id: "sim-params",
        label: "Simulation Parameters",
        open: d,
        onOpenClose: () => I(!d),
        children: [
          /* @__PURE__ */ i(
            v,
            {
              id: "damping",
              label: "Damping",
              labelPosition: "left",
              tooltipText: "Damping Coefficient",
              min: 0.7,
              max: 1,
              step: 1e-3,
              hasToolTip: d,
              value: D,
              onChange: (e) => {
                s.heightmapVariable.material.uniforms.damping.value = e.value, F(e.value);
              }
            }
          ),
          /* @__PURE__ */ i(
            v,
            {
              id: "numPasses",
              label: "Passes",
              labelPosition: "left",
              tooltipText: "Number of passes per frame",
              min: 1,
              max: 30,
              step: 1,
              hasToolTip: d,
              value: _,
              onChange: (e) => {
                s.numPasses = e.value, H(e.value);
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t(
      p,
      {
        id: "sim-sources",
        label: "Sources",
        open: T,
        onOpenClose: () => W(!T),
        children: [
          /* @__PURE__ */ t(l, { children: [
            /* @__PURE__ */ i(a, { hasToolTip: T, label: "Source", tooltip: "All available sources" }),
            /* @__PURE__ */ t(
              "select",
              {
                value: 0,
                name: "sources",
                onChange: (e) => {
                  console.log(e.currentTarget.value);
                  const n = r.filter((c) => c.uuid === e.currentTarget.value);
                  n[0] && s.addSource(n[0]), R(s.sourceKeys);
                },
                children: [
                  /* @__PURE__ */ i("option", { value: 0, children: "Select Source" }),
                  L.map((e) => /* @__PURE__ */ i("option", { value: e.uuid, children: e.name }, e.uuid))
                ]
              }
            )
          ] }),
          j.map((e) => /* @__PURE__ */ t(l, { children: [
            /* @__PURE__ */ i(
              a,
              {
                hasToolTip: !1,
                label: s.sources[e] && s.sources[e].name
              }
            ),
            /* @__PURE__ */ i(
              u,
              {
                label: "Remove",
                onClick: (n) => {
                  R(s.sourceKeys.filter((c) => c !== e)), s.removeSource(e);
                }
              }
            )
          ] }, e))
        ]
      }
    ),
    /* @__PURE__ */ t(
      p,
      {
        id: "sim-receivers",
        label: "Receivers",
        open: P,
        onOpenClose: () => q(!P),
        children: [
          /* @__PURE__ */ t(l, { children: [
            /* @__PURE__ */ i(a, { hasToolTip: P, label: "Receiver", tooltip: "All available receivers" }),
            /* @__PURE__ */ t(
              "select",
              {
                value: 0,
                name: "receivers",
                onChange: (e) => {
                  console.log(e.currentTarget.value);
                  const n = h.filter((c) => c.uuid === e.currentTarget.value);
                  n[0] && s.addReceiver(n[0]), R(s.receiverKeys);
                },
                children: [
                  /* @__PURE__ */ i("option", { value: 0, children: "Select Receiver" }),
                  J.map((e) => /* @__PURE__ */ i("option", { value: e.uuid, children: e.name }, e.uuid))
                ]
              }
            )
          ] }),
          z.map((e) => /* @__PURE__ */ t(l, { children: [
            /* @__PURE__ */ i(a, { hasToolTip: !1, label: s.receivers[e].name }),
            /* @__PURE__ */ i(
              u,
              {
                label: "Remove",
                onClick: (n) => {
                  G(s.receiverKeys.filter((c) => c !== e)), s.removeReceiver(e);
                }
              }
            )
          ] }, e))
        ]
      }
    ),
    /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ i(a, { label: "Run/Pause", tooltip: "Runs or pauses the simulation" }),
      /* @__PURE__ */ i(
        u,
        {
          onClick: (e) => {
            s.running ? (s.stop(), y(!1)) : (s.run(), y(!0));
          },
          label: K ? "Pause" : "Run"
        }
      )
    ] }),
    /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ i(a, { label: "Recording", tooltip: "Starts/stops recording" }),
      /* @__PURE__ */ i(
        u,
        {
          onClick: (e) => {
            s.recording ? (s.recording = !1, w(!1)) : (s.recording = !0, w(!0));
          },
          label: V ? "Stop" : "Record"
        }
      )
    ] }),
    /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ i(a, { label: "Clear", tooltip: "Clears the grid" }),
      /* @__PURE__ */ i(u, { onClick: s.clear, label: "Clear" })
    ] })
  ] });
};
export {
  ue as FDTD_2DTab,
  ue as default
};
//# sourceMappingURL=FDTD_2DTab-CiyBnImO.mjs.map
