import { jsx as t, jsxs as x } from "react/jsx-runtime";
import { memo as y, useMemo as w, useCallback as b } from "react";
import { k as R, l as r } from "./index-Cyx44W_I.mjs";
import { u as C } from "./SolverComponents-B-k3d-YR.mjs";
const A = r.div`
  padding: 4px 8px;
  overflow-x: auto;
  opacity: ${(s) => s.$disabled ? 0.5 : 1};
  pointer-events: ${(s) => s.$disabled ? "none" : "auto"};
`, P = r.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
`, j = r.th`
  padding: 4px 6px;
  text-align: center;
  font-weight: 500;
  color: #1c2127;
  border-bottom: 1px solid #e1e4e8;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
`, E = r.td`
  padding: 4px 6px;
  font-weight: 500;
  color: #1c2127;
  border-right: 1px solid #e1e4e8;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
`, M = r.td`
  padding: 4px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
`, z = r.input.attrs({ type: "checkbox" })`
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #2d72d2;
`, f = r.div`
  padding: 12px 8px;
  font-size: 11px;
  color: #8c959f;
  font-style: italic;
  text-align: center;
`, O = r.th`
  padding: 4px 6px;
  text-align: right;
  font-weight: 400;
  font-size: 10px;
  color: #656d76;
  border-bottom: 1px solid #e1e4e8;
  border-right: 1px solid #e1e4e8;
`, q = y(({ uuid: s, disabled: D = !1, eventType: m = "RAYTRACER_SET_PROPERTY" }) => {
  const d = R((e) => e.containers), g = R((e) => e.version), c = w(() => Object.values(d).filter((e) => e.kind === "source").map((e) => ({ uuid: e.uuid, name: e.name })), [d, g]), a = w(() => Object.values(d).filter((e) => e.kind === "receiver").map((e) => ({ uuid: e.uuid, name: e.name })), [d, g]), [$, u] = C(
    s,
    "sourceIDs",
    m
  ), [k, p] = C(
    s,
    "receiverIDs",
    m
  ), o = $ || [], n = k || [], S = b((e, i) => o.includes(e) && n.includes(i), [o, n]), I = b((e, i, h) => {
    if (h) {
      const l = o.includes(e) ? o : [...o, e], v = n.includes(i) ? n : [...n, i];
      l !== o && u({ value: l }), v !== n && p({ value: v });
    } else
      n.length === 1 && u({ value: o.filter((l) => l !== e) }), o.length === 1 && p({ value: n.filter((l) => l !== i) });
  }, [o, n, u, p]);
  return c.length === 0 && a.length === 0 ? /* @__PURE__ */ t(f, { children: "Add sources and receivers to configure pairs" }) : c.length === 0 ? /* @__PURE__ */ t(f, { children: "Add sources to configure pairs" }) : a.length === 0 ? /* @__PURE__ */ t(f, { children: "Add receivers to configure pairs" }) : /* @__PURE__ */ t(A, { $disabled: D, children: /* @__PURE__ */ x(P, { children: [
    /* @__PURE__ */ t("thead", { children: /* @__PURE__ */ x("tr", { children: [
      /* @__PURE__ */ t(O, { children: "Src \\ Rec" }),
      a.map((e) => /* @__PURE__ */ t(j, { title: e.name, children: e.name }, e.uuid))
    ] }) }),
    /* @__PURE__ */ t("tbody", { children: c.map((e) => /* @__PURE__ */ x("tr", { children: [
      /* @__PURE__ */ t(E, { title: e.name, children: e.name }),
      a.map((i) => /* @__PURE__ */ t(M, { children: /* @__PURE__ */ t(
        z,
        {
          checked: S(e.uuid, i.uuid),
          onChange: (h) => I(e.uuid, i.uuid, h.target.checked),
          title: `${e.name} → ${i.name}`
        }
      ) }, `${e.uuid}-${i.uuid}`))
    ] }, e.uuid)) })
  ] }) });
});
export {
  q as S
};
//# sourceMappingURL=SourceReceiverMatrix-CWp2nL0j.mjs.map
