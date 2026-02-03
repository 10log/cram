import { jsx as e, jsxs as a } from "react/jsx-runtime";
import { u as s, P as p, a as d, b as i, e as c } from "./index-CT5_YzQr.mjs";
import { P as u } from "./SolverComponents-DyZscYH1.mjs";
const m = ({ uuid: r }) => {
  const [o, l] = s(!0);
  return /* @__PURE__ */ a(p, { label: "Input", open: o, onOpenClose: l, children: [
    /* @__PURE__ */ a(d, { children: [
      /* @__PURE__ */ e(i, { label: "Upload IR" }),
      /* @__PURE__ */ e("div", { style: { alignItems: "center" }, children: /* @__PURE__ */ e(
        "input",
        {
          type: "file",
          id: "irinput",
          accept: ".wav",
          onChange: (n) => {
            const t = new FileReader();
            t.addEventListener("loadend", (P) => {
              c("ENERGYDECAY_SET_PROPERTY", { uuid: r, property: "broadbandIR", value: t.result });
            }), t.readAsArrayBuffer(n.target.files[0]);
          }
        }
      ) })
    ] }),
    /* @__PURE__ */ e(u, { event: "CALCULATE_AC_PARAMS", args: r, label: "Calculate Parameters", tooltip: "Calculates Acoustical Parameters from Uploaded IR" })
  ] });
}, f = ({ uuid: r }) => /* @__PURE__ */ e(m, { uuid: r });
export {
  f as EnergyDecayTab,
  f as default
};
//# sourceMappingURL=EnergyDecayTab-C-1UKdEf.mjs.map
