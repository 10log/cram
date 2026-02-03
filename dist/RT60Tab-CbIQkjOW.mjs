import { jsxs as u, jsx as o } from "react/jsx-runtime";
import { useReducer as c, useEffect as R } from "react";
import { u as n, P as p, f as m, g as i, o as d, p as T } from "./index-CT5_YzQr.mjs";
import { P, c as g } from "./SolverComponents-DyZscYH1.mjs";
const { PropertyNumberInput: f } = g(
  "RT60_SET_PROPERTY"
), S = ({ uuid: e }) => {
  const [s, r] = n(!0);
  return /* @__PURE__ */ o(p, { label: "Room Settings", open: s, onOpenClose: r, children: /* @__PURE__ */ o(
    f,
    {
      uuid: e,
      label: "Room Volume",
      property: "displayVolume",
      tooltip: "Overrides the calculated room volume",
      elementProps: {
        step: 0.01
      }
    }
  ) });
}, b = ({ uuid: e }) => {
  const [s, r] = n(!0), { noResults: a } = m(i((t) => T(["noResults"], t.solvers[e]))), [, l] = c((t) => t + 1, 0);
  return R(() => d("UPDATE_RT60", (t) => {
    l();
  }), [l]), /* @__PURE__ */ o(p, { label: "Export", open: s, onOpenClose: r, children: /* @__PURE__ */ o(P, { event: "DOWNLOAD_RT60_RESULTS", args: e, label: "Download RT Results", disabled: a, tooltip: "Download RT Results as CSV File" }) });
}, _ = ({ uuid: e }) => /* @__PURE__ */ u("div", { children: [
  /* @__PURE__ */ o(S, { uuid: e }),
  /* @__PURE__ */ o(b, { uuid: e })
] });
export {
  _ as RT60Tab,
  _ as default
};
//# sourceMappingURL=RT60Tab-CbIQkjOW.mjs.map
