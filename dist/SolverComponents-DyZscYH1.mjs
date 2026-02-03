import { jsxs as c, jsx as a } from "react/jsx-runtime";
import { f as v, a as l, b as P, d as m, e as y, h as x, j as I, k as w } from "./index-CT5_YzQr.mjs";
function R(r, o, t) {
  return [v(
    (e) => (e.version, e.solvers[r]?.[o])
  ), (e) => y(t, { uuid: r, property: o, value: e.value })];
}
const u = (r, o) => ({ uuid: t, property: n, label: s, tooltip: e, elementProps: p }) => {
  const [h, i] = R(t, n, r);
  return /* @__PURE__ */ c(l, { children: [
    /* @__PURE__ */ a(P, { label: s, hasToolTip: !0, tooltip: e }),
    /* @__PURE__ */ a(o, { value: h, onChange: i, ...p })
  ] });
}, d = (r) => ({
  PropertyTextInput: u(r, w),
  PropertyNumberInput: u(r, I),
  PropertyCheckboxInput: u(r, x)
}), f = ({
  args: r,
  event: o,
  label: t,
  tooltip: n,
  disabled: s
}) => /* @__PURE__ */ c(l, { children: [
  /* @__PURE__ */ a(P, { label: t, hasToolTip: !0, tooltip: n }),
  /* @__PURE__ */ a(m, { onClick: (e) => y(o, r), label: t, disabled: s })
] });
export {
  f as P,
  d as c,
  R as u
};
//# sourceMappingURL=SolverComponents-DyZscYH1.mjs.map
