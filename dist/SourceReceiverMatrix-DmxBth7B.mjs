import { jsx as t, jsxs as x } from "react/jsx-runtime";
import { memo as z, useMemo as w, useCallback as b } from "react";
import { i as R, T as m, B as s, C as B } from "./index-CT5_YzQr.mjs";
import { u as C } from "./SolverComponents-DyZscYH1.mjs";
const O = (l) => ({
  p: "4px 8px",
  overflowX: "auto",
  opacity: l ? 0.5 : 1,
  pointerEvents: l ? "none" : "auto"
}), P = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 11,
  "& th, & td": {
    p: "4px 6px"
  }
}, W = {
  textAlign: "center",
  fontWeight: 500,
  color: "#1c2127",
  borderBottom: "1px solid #e1e4e8",
  whiteSpace: "nowrap",
  maxWidth: 80,
  overflow: "hidden",
  textOverflow: "ellipsis"
}, j = {
  fontWeight: 500,
  color: "#1c2127",
  borderRight: "1px solid #e1e4e8",
  whiteSpace: "nowrap",
  maxWidth: 80,
  overflow: "hidden",
  textOverflow: "ellipsis"
}, E = {
  textAlign: "center",
  borderBottom: "1px solid #f0f0f0"
}, M = {
  textAlign: "right",
  fontWeight: 400,
  fontSize: 10,
  color: "#656d76",
  borderBottom: "1px solid #e1e4e8",
  borderRight: "1px solid #e1e4e8"
}, f = {
  p: "12px 8px",
  fontSize: 11,
  color: "#8c959f",
  fontStyle: "italic",
  textAlign: "center"
}, T = {
  p: 0,
  width: 14,
  height: 14,
  "& .MuiSvgIcon-root": {
    fontSize: 18
  }
}, X = z(({ uuid: l, disabled: D = !1, eventType: g = "RAYTRACER_SET_PROPERTY" }) => {
  const c = R((e) => e.containers), S = R((e) => e.version), d = w(() => Object.values(c).filter((e) => e.kind === "source").map((e) => ({ uuid: e.uuid, name: e.name })), [c, S]), a = w(() => Object.values(c).filter((e) => e.kind === "receiver").map((e) => ({ uuid: e.uuid, name: e.name })), [c, S]), [A, u] = C(
    l,
    "sourceIDs",
    g
  ), [k, h] = C(
    l,
    "receiverIDs",
    g
  ), n = A || [], i = k || [], I = b((e, o) => n.includes(e) && i.includes(o), [n, i]), y = b((e, o, p) => {
    if (p) {
      const r = n.includes(e) ? n : [...n, e], v = i.includes(o) ? i : [...i, o];
      r !== n && u({ value: r }), v !== i && h({ value: v });
    } else
      i.length === 1 && u({ value: n.filter((r) => r !== e) }), n.length === 1 && h({ value: i.filter((r) => r !== o) });
  }, [n, i, u, h]);
  return d.length === 0 && a.length === 0 ? /* @__PURE__ */ t(m, { sx: f, children: "Add sources and receivers to configure pairs" }) : d.length === 0 ? /* @__PURE__ */ t(m, { sx: f, children: "Add sources to configure pairs" }) : a.length === 0 ? /* @__PURE__ */ t(m, { sx: f, children: "Add receivers to configure pairs" }) : /* @__PURE__ */ t(s, { sx: O(D), children: /* @__PURE__ */ x(s, { component: "table", sx: P, children: [
    /* @__PURE__ */ t("thead", { children: /* @__PURE__ */ x("tr", { children: [
      /* @__PURE__ */ t(s, { component: "th", sx: M, children: "Src \\ Rec" }),
      a.map((e) => /* @__PURE__ */ t(s, { component: "th", sx: W, title: e.name, children: e.name }, e.uuid))
    ] }) }),
    /* @__PURE__ */ t("tbody", { children: d.map((e) => /* @__PURE__ */ x("tr", { children: [
      /* @__PURE__ */ t(s, { component: "td", sx: j, title: e.name, children: e.name }),
      a.map((o) => /* @__PURE__ */ t(s, { component: "td", sx: E, children: /* @__PURE__ */ t(
        B,
        {
          checked: I(e.uuid, o.uuid),
          onChange: (p) => y(e.uuid, o.uuid, p.target.checked),
          title: `${e.name} → ${o.name}`,
          sx: T,
          size: "small"
        }
      ) }, `${e.uuid}-${o.uuid}`))
    ] }, e.uuid)) })
  ] }) });
});
export {
  X as S
};
//# sourceMappingURL=SourceReceiverMatrix-DmxBth7B.mjs.map
