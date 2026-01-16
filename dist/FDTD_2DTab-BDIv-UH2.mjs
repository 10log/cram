import { jsxs as o, jsx as s } from "react/jsx-runtime";
import { useState as r } from "react";
import { h as q, i as E, f as G, P as d, S as m, a as i, b as a, j as J, d as u } from "./index-Cyx44W_I.mjs";
const X = ({ uuid: S }) => {
  const f = q(), b = E(), l = G((e) => e.solvers[S]), [R, P] = r(l.uniforms.colorBrightness.value), [D, F] = r(l.mesh.scale.z), [x, O] = r(l.heightmapVariable.material.uniforms.damping.value), [w, K] = r(l.numPasses), [y, T] = r(l.running), [V, C] = r(l.recording), [B, _] = r(l.getWireframeVisible()), [c, W] = r(!1), [p, j] = r(!1), [h, H] = r(!1), [A, v] = r(l.sourceKeys), I = f.filter((e) => !l.sources[e.uuid]), [g, N] = r(!1), [z, L] = r(l.receiverKeys), Z = b.filter((e) => !l.receiverKeys[e.uuid]);
  return /* @__PURE__ */ o("div", { children: [
    /* @__PURE__ */ o(
      d,
      {
        id: "view",
        label: "View",
        open: c,
        onOpenClose: () => W(!c),
        children: [
          /* @__PURE__ */ s(
            m,
            {
              id: "colorBrightness",
              label: "Color Brightness",
              labelPosition: "left",
              tooltipText: "Changes the color brightness",
              min: 0,
              max: 40,
              step: 0.1,
              value: R,
              hasToolTip: c,
              onChange: (e) => {
                l.uniforms.colorBrightness.value = e.value, P(e.value);
              }
            }
          ),
          /* @__PURE__ */ s(
            m,
            {
              id: "heightScale",
              label: "Height Scale",
              labelPosition: "left",
              tooltipText: "Height Scale",
              min: 0,
              max: 1,
              step: 1e-3,
              hasToolTip: c,
              value: D,
              onChange: (e) => {
                l.mesh.scale.setZ(e.value === 0 ? 1e-3 : e.value), F(e.value);
              }
            }
          ),
          /* @__PURE__ */ o(i, { children: [
            /* @__PURE__ */ s(a, { hasToolTip: c, label: "Wireframe", tooltip: "Display mesh as wirefame" }),
            /* @__PURE__ */ s(
              J,
              {
                onChange: (e) => {
                  l.setWireframeVisible(e.value), _(e.value);
                },
                value: B
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ o(
      d,
      {
        id: "sim-params",
        label: "Simulation Parameters",
        open: p,
        onOpenClose: () => j(!p),
        children: [
          /* @__PURE__ */ s(
            m,
            {
              id: "damping",
              label: "Damping",
              labelPosition: "left",
              tooltipText: "Damping Coefficient",
              min: 0.7,
              max: 1,
              step: 1e-3,
              hasToolTip: p,
              value: x,
              onChange: (e) => {
                l.heightmapVariable.material.uniforms.damping.value = e.value, O(e.value);
              }
            }
          ),
          /* @__PURE__ */ s(
            m,
            {
              id: "numPasses",
              label: "Passes",
              labelPosition: "left",
              tooltipText: "Number of passes per frame",
              min: 1,
              max: 30,
              step: 1,
              hasToolTip: p,
              value: w,
              onChange: (e) => {
                l.numPasses = e.value, K(e.value);
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ o(
      d,
      {
        id: "sim-sources",
        label: "Sources",
        open: h,
        onOpenClose: () => H(!h),
        children: [
          /* @__PURE__ */ o(i, { children: [
            /* @__PURE__ */ s(a, { hasToolTip: h, label: "Source", tooltip: "All available sources" }),
            /* @__PURE__ */ o(
              "select",
              {
                value: 0,
                name: "sources",
                onChange: (e) => {
                  console.log(e.currentTarget.value);
                  const n = f.filter((t) => t.uuid === e.currentTarget.value);
                  n[0] && l.addSource(n[0]), v(l.sourceKeys);
                },
                children: [
                  /* @__PURE__ */ s("option", { value: 0, children: "Select Source" }),
                  I.map((e) => /* @__PURE__ */ s("option", { value: e.uuid, children: e.name }, e.uuid))
                ]
              }
            )
          ] }),
          A.map((e) => /* @__PURE__ */ o(i, { children: [
            /* @__PURE__ */ s(
              a,
              {
                hasToolTip: !1,
                label: l.sources[e] && l.sources[e].name
              }
            ),
            /* @__PURE__ */ s(
              u,
              {
                label: "Remove",
                onClick: (n) => {
                  v(l.sourceKeys.filter((t) => t !== e)), l.removeSource(e);
                }
              }
            )
          ] }, e))
        ]
      }
    ),
    /* @__PURE__ */ o(
      d,
      {
        id: "sim-receivers",
        label: "Receivers",
        open: g,
        onOpenClose: () => N(!g),
        children: [
          /* @__PURE__ */ o(i, { children: [
            /* @__PURE__ */ s(a, { hasToolTip: g, label: "Receiver", tooltip: "All available receivers" }),
            /* @__PURE__ */ o(
              "select",
              {
                value: 0,
                name: "receivers",
                onChange: (e) => {
                  console.log(e.currentTarget.value);
                  const n = b.filter((t) => t.uuid === e.currentTarget.value);
                  n[0] && l.addReceiver(n[0]), v(l.receiverKeys);
                },
                children: [
                  /* @__PURE__ */ s("option", { value: 0, children: "Select Receiver" }),
                  Z.map((e) => /* @__PURE__ */ s("option", { value: e.uuid, children: e.name }, e.uuid))
                ]
              }
            )
          ] }),
          z.map((e) => /* @__PURE__ */ o(i, { children: [
            /* @__PURE__ */ s(a, { hasToolTip: !1, label: l.receivers[e].name }),
            /* @__PURE__ */ s(
              u,
              {
                label: "Remove",
                onClick: (n) => {
                  L(l.receiverKeys.filter((t) => t !== e)), l.removeReceiver(e);
                }
              }
            )
          ] }, e))
        ]
      }
    ),
    /* @__PURE__ */ o(i, { children: [
      /* @__PURE__ */ s(a, { label: "Run/Pause", tooltip: "Runs or pauses the simulation" }),
      /* @__PURE__ */ s(
        u,
        {
          onClick: (e) => {
            l.running ? (l.stop(), T(!1)) : (l.run(), T(!0));
          },
          label: y ? "Pause" : "Run"
        }
      )
    ] }),
    /* @__PURE__ */ o(i, { children: [
      /* @__PURE__ */ s(a, { label: "Recording", tooltip: "Starts/stops recording" }),
      /* @__PURE__ */ s(
        u,
        {
          onClick: (e) => {
            l.recording ? (l.recording = !1, C(!1)) : (l.recording = !0, C(!0));
          },
          label: V ? "Stop" : "Record"
        }
      )
    ] }),
    /* @__PURE__ */ o(i, { children: [
      /* @__PURE__ */ s(a, { label: "Clear", tooltip: "Clears the grid" }),
      /* @__PURE__ */ s(u, { onClick: l.clear, label: "Clear" })
    ] })
  ] });
};
export {
  X as FDTD_2DTab,
  X as default
};
//# sourceMappingURL=FDTD_2DTab-BDIv-UH2.mjs.map
