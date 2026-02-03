import { jsxs as a, jsx as o } from "react/jsx-runtime";
import { u as l, P as s } from "./index-CT5_YzQr.mjs";
import { P as n, c } from "./SolverComponents-DyZscYH1.mjs";
import { S as i } from "./SourceReceiverMatrix-DmxBth7B.mjs";
const { PropertyNumberInput: u, PropertyCheckboxInput: p } = c(
  "IMAGESOURCE_SET_PROPERTY"
), m = ({ uuid: e }) => {
  const [r, t] = l(!0);
  return /* @__PURE__ */ o(s, { label: "Source / Receiver Pairs", open: r, onOpenClose: t, children: /* @__PURE__ */ o(i, { uuid: e, eventType: "IMAGESOURCE_SET_PROPERTY" }) });
}, P = ({ uuid: e }) => {
  const [r, t] = l(!0);
  return /* @__PURE__ */ o(s, { label: "Calculation", open: r, onOpenClose: t, children: /* @__PURE__ */ o(u, { uuid: e, label: "Maximum Order", property: "maxReflectionOrderReset", tooltip: "Sets the maximum reflection order" }) });
}, g = ({ uuid: e }) => {
  const [r, t] = l(!0);
  return /* @__PURE__ */ a(s, { label: "Graphing", open: r, onOpenClose: t, children: [
    /* @__PURE__ */ o(p, { uuid: e, label: "Show Sources", property: "imageSourcesVisible", tooltip: "Shows/Hides Image Sources" }),
    /* @__PURE__ */ o(p, { uuid: e, label: "Show Paths", property: "rayPathsVisible", tooltip: "Shows/Hides Ray Paths" })
  ] });
}, h = ({ uuid: e }) => {
  const [r, t] = l(!0);
  return /* @__PURE__ */ a(s, { label: "Impulse Response", open: r, onOpenClose: t, children: [
    /* @__PURE__ */ o(n, { event: "IMAGESOURCE_PLAY_IR", args: e, label: "Play", tooltip: "Plays the calculated impulse response", disabled: !1 }),
    /* @__PURE__ */ o(n, { event: "IMAGESOURCE_DOWNLOAD_IR", args: e, label: "Download", tooltip: "Plays the calculated impulse response" })
  ] });
}, R = ({ uuid: e }) => {
  const [r, t] = l(!0);
  return /* @__PURE__ */ o(s, { label: "Developer", open: r, onOpenClose: t, children: /* @__PURE__ */ o(n, { event: "CALCULATE_LTP", args: e, label: "Calculate LTP", tooltip: "Calculates Level Time Progression" }) });
}, y = ({ uuid: e }) => /* @__PURE__ */ a("div", { children: [
  /* @__PURE__ */ o(P, { uuid: e }),
  /* @__PURE__ */ o(m, { uuid: e }),
  /* @__PURE__ */ o(g, { uuid: e }),
  /* @__PURE__ */ o(h, { uuid: e }),
  /* @__PURE__ */ o(R, { uuid: e })
] });
export {
  y as ImageSourceTab
};
//# sourceMappingURL=ImageSourceTab-ymgD6jTE.mjs.map
