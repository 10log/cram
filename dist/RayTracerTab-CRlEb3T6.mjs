import { jsxs as l, jsx as o } from "react/jsx-runtime";
import { useEffect as O, useState as P } from "react";
import { r as m, u as s, P as n, a as y, b as d, c as u, d as v, e as A } from "./index-CT5_YzQr.mjs";
import { u as b, P as c, c as T } from "./SolverComponents-DyZscYH1.mjs";
import { S as C } from "./SourceReceiverMatrix-DmxBth7B.mjs";
const { PropertyTextInput: S, PropertyNumberInput: p, PropertyCheckboxInput: i } = T(
  "RAYTRACER_SET_PROPERTY"
), E = ({ uuid: e }) => {
  const [t, r] = s(!0);
  return /* @__PURE__ */ l(n, { label: "Parameters", open: t, onOpenClose: r, children: [
    /* @__PURE__ */ o(p, { uuid: e, label: "Rate (ms)", property: "updateInterval", tooltip: "Sets the callback rate" }),
    /* @__PURE__ */ o(
      p,
      {
        uuid: e,
        label: "Order",
        property: "reflectionOrder",
        tooltip: "Sets the maximum reflection order"
      }
    ),
    /* @__PURE__ */ o(
      p,
      {
        uuid: e,
        label: "Passes",
        property: "passes",
        tooltip: "Number of rays shot on each callback"
      }
    )
  ] });
}, f = ({ uuid: e }) => {
  const [t, r] = s(!0), [a] = b(
    e,
    "runningWithoutReceivers",
    "RAYTRACER_SET_PROPERTY"
  );
  return /* @__PURE__ */ l(n, { label: "Source / Receiver Pairs", open: t, onOpenClose: r, children: [
    /* @__PURE__ */ o(
      i,
      {
        uuid: e,
        label: "Ignore Receivers",
        property: "runningWithoutReceivers",
        tooltip: "Ignores receiver intersections (visualization only)"
      }
    ),
    /* @__PURE__ */ o(C, { uuid: e, disabled: a })
  ] });
}, _ = ({ uuid: e }) => {
  const [t, r] = s(!0);
  return /* @__PURE__ */ l(n, { label: "Style Properties", open: t, onOpenClose: r, children: [
    /* @__PURE__ */ o(
      p,
      {
        uuid: e,
        label: "Point Size",
        property: "pointSize",
        tooltip: "Sets the size of each interection point"
      }
    ),
    /* @__PURE__ */ o(
      i,
      {
        uuid: e,
        label: "Rays Visible",
        property: "raysVisible",
        tooltip: "Toggles the visibility of the rays"
      }
    ),
    /* @__PURE__ */ o(
      i,
      {
        uuid: e,
        label: "Points Visible",
        property: "pointsVisible",
        tooltip: "Toggles the visibility of the intersection points"
      }
    )
  ] });
}, D = ({ uuid: e }) => {
  const [t, r] = s(!0);
  return /* @__PURE__ */ o(n, { label: "Solver Controls", open: t, onOpenClose: r, children: /* @__PURE__ */ o(i, { uuid: e, label: "Running", property: "isRunning", tooltip: "Starts/stops the raytracer" }) });
}, w = ({ uuid: e }) => {
  const [t, r] = s(!0);
  return /* @__PURE__ */ l(n, { label: "Hybrid Method", open: t, onOpenClose: r, children: [
    /* @__PURE__ */ o(i, { uuid: e, label: "Use Hybrid Method", property: "hybrid", tooltip: "Enables Hybrid Calculation" }),
    /* @__PURE__ */ o(S, { uuid: e, label: "Transition Order", property: "transitionOrder", tooltip: "Delination between image source and raytracer" })
  ] });
}, I = ({ uuid: e }) => {
  const [t, r] = s(!0), [a] = b(e, "impulseResponsePlaying", "RAYTRACER_SET_PROPERTY");
  return /* @__PURE__ */ l(n, { label: "Impulse Response", open: t, onOpenClose: r, children: [
    /* @__PURE__ */ o(c, { event: "RAYTRACER_PLAY_IR", args: e, label: "Play", tooltip: "Plays the calculated impulse response", disabled: a }),
    /* @__PURE__ */ o(c, { event: "RAYTRACER_DOWNLOAD_IR", args: e, label: "Download", tooltip: "Downloads the calculated broadband impulse response" }),
    /* @__PURE__ */ o(c, { event: "RAYTRACER_DOWNLOAD_IR_OCTAVE", args: e, label: "Download by Octave", tooltip: "Downloads the impulse response in each octave" })
  ] });
}, Y = ({ uuid: e }) => {
  const [t, r] = s(!1), [a, h] = P("1"), [R] = b(e, "validRayCount", "RAYTRACER_SET_PROPERTY");
  return /* @__PURE__ */ l(n, { label: "Ambisonic Output", open: t, onOpenClose: r, children: [
    /* @__PURE__ */ l(y, { children: [
      /* @__PURE__ */ o(d, { label: "Order", hasToolTip: !0, tooltip: "Ambisonic order (1=FOA 4ch, 2=HOA 9ch, 3=HOA 16ch)" }),
      /* @__PURE__ */ o(
        u,
        {
          value: a,
          onChange: ({ value: g }) => h(g),
          options: [
            { value: "1", label: "1st Order (4 ch)" },
            { value: "2", label: "2nd Order (9 ch)" },
            { value: "3", label: "3rd Order (16 ch)" }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ l(y, { children: [
      /* @__PURE__ */ o(d, { label: "", hasToolTip: !0, tooltip: "Downloads ambisonic impulse response (ACN/N3D format)" }),
      /* @__PURE__ */ o(v, { onClick: () => {
        A("RAYTRACER_DOWNLOAD_AMBISONIC_IR", { uuid: e, order: parseInt(a) });
      }, label: "Download", disabled: !R || R === 0 })
    ] })
  ] });
}, z = ({ uuid: e }) => (O(() => {
  const t = m.overlays.global.cells, r = e + "-valid-ray-count";
  return t.has(r) && t.get(r).show(), () => {
    t.has(r) && t.get(r).hide();
  };
}, [e]), /* @__PURE__ */ l("div", { children: [
  /* @__PURE__ */ o(E, { uuid: e }),
  /* @__PURE__ */ o(f, { uuid: e }),
  /* @__PURE__ */ o(_, { uuid: e }),
  /* @__PURE__ */ o(D, { uuid: e }),
  /* @__PURE__ */ o(w, { uuid: e }),
  /* @__PURE__ */ o(I, { uuid: e }),
  /* @__PURE__ */ o(Y, { uuid: e })
] }));
export {
  z as RayTracerTab,
  z as default
};
//# sourceMappingURL=RayTracerTab-CRlEb3T6.mjs.map
