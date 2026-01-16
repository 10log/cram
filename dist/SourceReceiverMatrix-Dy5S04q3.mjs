import { jsx as t, jsxs as x } from "react/jsx-runtime";
import { memo as I, useMemo as w, useCallback as b } from "react";
import n from "styled-components";
import { k as R } from "./index-CgcZvXNw.mjs";
import { u as C } from "./SolverComponents-l86Lkg2K.mjs";
const A = n.div`
  padding: 4px 8px;
  overflow-x: auto;
  opacity: ${(s) => s.$disabled ? 0.5 : 1};
  pointer-events: ${(s) => s.$disabled ? "none" : "auto"};
`, P = n.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
`, j = n.th`
  padding: 4px 6px;
  text-align: center;
  font-weight: 500;
  color: #1c2127;
  border-bottom: 1px solid #e1e4e8;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
`, E = n.td`
  padding: 4px 6px;
  font-weight: 500;
  color: #1c2127;
  border-right: 1px solid #e1e4e8;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
`, M = n.td`
  padding: 4px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
`, z = n.input.attrs({ type: "checkbox" })`
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #2d72d2;
`, f = n.div`
  padding: 12px 8px;
  font-size: 11px;
  color: #8c959f;
  font-style: italic;
  text-align: center;
`, O = n.th`
  padding: 4px 6px;
  text-align: right;
  font-weight: 400;
  font-size: 10px;
  color: #656d76;
  border-bottom: 1px solid #e1e4e8;
  border-right: 1px solid #e1e4e8;
`, B = I(({ uuid: s, disabled: D = !1, eventType: m = "RAYTRACER_SET_PROPERTY" }) => {
  const d = R((e) => e.containers), g = R((e) => e.version), a = w(() => Object.values(d).filter((e) => e.kind === "source").map((e) => ({ uuid: e.uuid, name: e.name })), [d, g]), c = w(() => Object.values(d).filter((e) => e.kind === "receiver").map((e) => ({ uuid: e.uuid, name: e.name })), [d, g]), [$, u] = C(
    s,
    "sourceIDs",
    m
  ), [k, p] = C(
    s,
    "receiverIDs",
    m
  ), o = $ || [], r = k || [], S = b((e, i) => o.includes(e) && r.includes(i), [o, r]), y = b((e, i, h) => {
    if (h) {
      const l = o.includes(e) ? o : [...o, e], v = r.includes(i) ? r : [...r, i];
      l !== o && u({ value: l }), v !== r && p({ value: v });
    } else
      r.length === 1 && u({ value: o.filter((l) => l !== e) }), o.length === 1 && p({ value: r.filter((l) => l !== i) });
  }, [o, r, u, p]);
  return a.length === 0 && c.length === 0 ? /* @__PURE__ */ t(f, { children: "Add sources and receivers to configure pairs" }) : a.length === 0 ? /* @__PURE__ */ t(f, { children: "Add sources to configure pairs" }) : c.length === 0 ? /* @__PURE__ */ t(f, { children: "Add receivers to configure pairs" }) : /* @__PURE__ */ t(A, { $disabled: D, children: /* @__PURE__ */ x(P, { children: [
    /* @__PURE__ */ t("thead", { children: /* @__PURE__ */ x("tr", { children: [
      /* @__PURE__ */ t(O, { children: "Src \\ Rec" }),
      c.map((e) => /* @__PURE__ */ t(j, { title: e.name, children: e.name }, e.uuid))
    ] }) }),
    /* @__PURE__ */ t("tbody", { children: a.map((e) => /* @__PURE__ */ x("tr", { children: [
      /* @__PURE__ */ t(E, { title: e.name, children: e.name }),
      c.map((i) => /* @__PURE__ */ t(M, { children: /* @__PURE__ */ t(
        z,
        {
          checked: S(e.uuid, i.uuid),
          onChange: (h) => y(e.uuid, i.uuid, h.target.checked),
          title: `${e.name} → ${i.name}`
        }
      ) }, `${e.uuid}-${i.uuid}`))
    ] }, e.uuid)) })
  ] }) });
});
export {
  B as S
};
//# sourceMappingURL=SourceReceiverMatrix-Dy5S04q3.mjs.map
