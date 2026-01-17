import { jsxs as c, jsx as u } from "react/jsx-runtime";
import { a as l, b as P, f as m, e as y, d as x, j as I, l as v, m as w } from "./index-BovKYX7u.mjs";
function R(r, o, t) {
  return [m(
    (e) => {
      e.version;
      const n = e.solvers[r];
      return n == null ? void 0 : n[o];
    }
  ), (e) => y(t, { uuid: r, property: o, value: e.value })];
}
const p = (r, o) => ({ uuid: t, property: a, label: s, tooltip: e, elementProps: n }) => {
  const [h, i] = R(t, a, r);
  return /* @__PURE__ */ c(l, { children: [
    /* @__PURE__ */ u(P, { label: s, hasToolTip: !0, tooltip: e }),
    /* @__PURE__ */ u(o, { value: h, onChange: i, ...n })
  ] });
}, d = (r) => ({
  PropertyTextInput: p(r, w),
  PropertyNumberInput: p(r, v),
  PropertyCheckboxInput: p(r, I)
}), f = ({
  args: r,
  event: o,
  label: t,
  tooltip: a,
  disabled: s
}) => /* @__PURE__ */ c(l, { children: [
  /* @__PURE__ */ u(P, { label: t, hasToolTip: !0, tooltip: a }),
  /* @__PURE__ */ u(x, { onClick: (e) => y(o, r), label: t, disabled: s })
] });
export {
  f as P,
  d as c,
  R as u
};
//# sourceMappingURL=SolverComponents-DF-GfH6V.mjs.map
