import { jsxs as t, jsx as o, Fragment as T } from "react/jsx-runtime";
import { useEffect as g, useReducer as w, useState as x } from "react";
import { f as b, u, P as R, a as d, b as h, c as v, j as C, o as y, d as S, e as f } from "./index-Cyx44W_I.mjs";
import { u as m, c as B, P as A } from "./SolverComponents-B-k3d-YR.mjs";
import { S as M } from "./SourceReceiverMatrix-CWp2nL0j.mjs";
const { PropertyNumberInput: _ } = B(
  "BEAMTRACE_SET_PROPERTY"
), D = [
  { value: "rays", label: "Rays Only" },
  { value: "beams", label: "Beams Only" },
  { value: "both", label: "Both" }
], L = ({ uuid: e }) => {
  const [n, a] = u(!0);
  return /* @__PURE__ */ o(R, { label: "Source / Receiver Pairs", open: n, onOpenClose: a, children: /* @__PURE__ */ o(M, { uuid: e, eventType: "BEAMTRACE_SET_PROPERTY" }) });
}, k = ({ uuid: e }) => {
  const [n, a] = u(!0);
  return /* @__PURE__ */ o(R, { label: "Calculation", open: n, onOpenClose: a, children: /* @__PURE__ */ o(
    _,
    {
      uuid: e,
      label: "Max Reflection Order",
      property: "maxReflectionOrderReset",
      tooltip: "Maximum number of reflections to trace (1-6 recommended)"
    }
  ) });
}, I = ({ uuid: e }) => {
  const [n, a] = u(!0), [r, l] = m(
    e,
    "visualizationMode",
    "BEAMTRACE_SET_PROPERTY"
  ), [i, c] = m(
    e,
    "showAllBeams",
    "BEAMTRACE_SET_PROPERTY"
  );
  return /* @__PURE__ */ t(R, { label: "Visualization", open: n, onOpenClose: a, children: [
    /* @__PURE__ */ t(d, { children: [
      /* @__PURE__ */ o(h, { label: "Display Mode", hasToolTip: !0, tooltip: "Toggle between ray paths, beam cones, or both" }),
      /* @__PURE__ */ o(
        v,
        {
          value: r || "rays",
          onChange: l,
          options: D
        }
      )
    ] }),
    (r === "beams" || r === "both") && /* @__PURE__ */ t(d, { children: [
      /* @__PURE__ */ o(h, { label: "Show All Beams", hasToolTip: !0, tooltip: "Show all virtual sources, including invalid/orphaned ones" }),
      /* @__PURE__ */ o(
        C,
        {
          value: i || !1,
          onChange: ({ value: p }) => c(p)
        }
      )
    ] })
  ] });
}, P = ({ percent: e, overflow: n }) => {
  const a = n ? "#ff4444" : e > 80 ? "#ffaa00" : "#44aa44";
  return /* @__PURE__ */ o("div", { style: {
    width: "60px",
    height: "8px",
    background: "#333",
    borderRadius: "4px",
    overflow: "hidden",
    marginRight: "8px"
  }, children: /* @__PURE__ */ o("div", { style: {
    width: `${Math.min(e, 100)}%`,
    height: "100%",
    background: a,
    transition: "width 0.2s"
  } }) });
}, z = ({ uuid: e }) => {
  const [n, a] = u(!1), [, r] = w((p) => p + 1, 0), l = b((p) => p.solvers[e]), i = (l == null ? void 0 : l.numValidPaths) || 0, c = l == null ? void 0 : l.lastMetrics, s = c == null ? void 0 : c.bufferUsage;
  return g(() => {
    const p = y("BEAMTRACE_CALCULATE_COMPLETE", (E) => {
      E === e && r();
    }), O = y("BEAMTRACE_RESET", (E) => {
      E === e && r();
    });
    return () => {
      p(), O();
    };
  }, [e]), /* @__PURE__ */ t(R, { label: "Statistics", open: n, onOpenClose: a, children: [
    /* @__PURE__ */ t(d, { children: [
      /* @__PURE__ */ o(h, { label: "Valid Paths" }),
      /* @__PURE__ */ o("span", { style: { padding: "4px 8px" }, children: i })
    ] }),
    c && /* @__PURE__ */ t(T, { children: [
      /* @__PURE__ */ t(d, { children: [
        /* @__PURE__ */ o(h, { label: "Raycasts" }),
        /* @__PURE__ */ o("span", { style: { padding: "4px 8px" }, children: c.raycastCount })
      ] }),
      /* @__PURE__ */ t(d, { children: [
        /* @__PURE__ */ o(h, { label: "Cache Hits" }),
        /* @__PURE__ */ o("span", { style: { padding: "4px 8px" }, children: c.failPlaneCacheHits })
      ] }),
      /* @__PURE__ */ t(d, { children: [
        /* @__PURE__ */ o(h, { label: "Buckets Skipped" }),
        /* @__PURE__ */ o("span", { style: { padding: "4px 8px" }, children: c.bucketsSkipped })
      ] })
    ] }),
    s && /* @__PURE__ */ t(T, { children: [
      /* @__PURE__ */ t(d, { children: [
        /* @__PURE__ */ o(
          h,
          {
            label: "Lines Buffer",
            hasToolTip: !0,
            tooltip: `${s.linesUsed.toLocaleString()} / ${s.linesCapacity.toLocaleString()} vertices`
          }
        ),
        /* @__PURE__ */ t("div", { style: { display: "flex", alignItems: "center", padding: "4px 8px" }, children: [
          /* @__PURE__ */ o(P, { percent: s.linesPercent, overflow: s.overflowWarning }),
          /* @__PURE__ */ t("span", { style: { fontSize: "11px", color: s.linesPercent > 80 ? "#ffaa00" : "#888" }, children: [
            s.linesPercent.toFixed(1),
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t(d, { children: [
        /* @__PURE__ */ o(
          h,
          {
            label: "Points Buffer",
            hasToolTip: !0,
            tooltip: `${s.pointsUsed.toLocaleString()} / ${s.pointsCapacity.toLocaleString()} points`
          }
        ),
        /* @__PURE__ */ t("div", { style: { display: "flex", alignItems: "center", padding: "4px 8px" }, children: [
          /* @__PURE__ */ o(P, { percent: s.pointsPercent, overflow: s.overflowWarning }),
          /* @__PURE__ */ t("span", { style: { fontSize: "11px", color: s.pointsPercent > 80 ? "#ffaa00" : "#888" }, children: [
            s.pointsPercent.toFixed(1),
            "%"
          ] })
        ] })
      ] }),
      s.overflowWarning && /* @__PURE__ */ o(d, { children: /* @__PURE__ */ o("span", { style: { color: "#ff4444", fontSize: "11px", padding: "4px 8px" }, children: "⚠️ Buffer overflow! Reduce reflection order." }) })
    ] })
  ] });
}, Y = ({ uuid: e }) => {
  const [n, a] = u(!0), r = b((i) => i.solvers[e]), l = !r || r.numValidPaths === 0;
  return /* @__PURE__ */ t(R, { label: "Impulse Response", open: n, onOpenClose: a, children: [
    /* @__PURE__ */ o(
      A,
      {
        event: "BEAMTRACE_PLAY_IR",
        args: e,
        label: "Play",
        tooltip: "Play the calculated impulse response",
        disabled: l
      }
    ),
    /* @__PURE__ */ o(
      A,
      {
        event: "BEAMTRACE_DOWNLOAD_IR",
        args: e,
        label: "Download",
        tooltip: "Download the impulse response as WAV",
        disabled: l
      }
    )
  ] });
}, U = ({ uuid: e }) => {
  const [n, a] = u(!1), [r, l] = x("1"), i = b((p) => p.solvers[e]), c = !i || i.numValidPaths === 0;
  return /* @__PURE__ */ t(R, { label: "Ambisonic Output", open: n, onOpenClose: a, children: [
    /* @__PURE__ */ t(d, { children: [
      /* @__PURE__ */ o(h, { label: "Order", hasToolTip: !0, tooltip: "Ambisonic order (1=FOA 4ch, 2=HOA 9ch, 3=HOA 16ch)" }),
      /* @__PURE__ */ o(
        v,
        {
          value: r,
          onChange: ({ value: p }) => l(p),
          options: [
            { value: "1", label: "1st Order (4 ch)" },
            { value: "2", label: "2nd Order (9 ch)" },
            { value: "3", label: "3rd Order (16 ch)" }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ t(d, { children: [
      /* @__PURE__ */ o(h, { label: "", hasToolTip: !0, tooltip: "Downloads ambisonic impulse response (ACN/N3D format)" }),
      /* @__PURE__ */ o(S, { onClick: () => {
        f("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", { uuid: e, order: parseInt(r) });
      }, label: "Download", disabled: c })
    ] })
  ] });
}, V = ({ uuid: e }) => {
  const n = b((r) => r.solvers[e]), [a] = m(
    e,
    "visualizationMode",
    "BEAMTRACE_SET_PROPERTY"
  );
  return g(() => {
    const r = (l) => {
      if (l.target instanceof HTMLInputElement || l.target instanceof HTMLTextAreaElement)
        return;
      const i = (n == null ? void 0 : n.maxReflectionOrder) ?? 3;
      switch (l.key) {
        case "+":
        case "=":
        case "ArrowUp":
          i < 6 && f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "maxReflectionOrderReset",
            value: i + 1
          }), l.preventDefault();
          break;
        case "-":
        case "_":
        case "ArrowDown":
          i > 0 && f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "maxReflectionOrderReset",
            value: i - 1
          }), l.preventDefault();
          break;
        case "b":
        case "B":
          a === "rays" ? f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "visualizationMode",
            value: "beams"
          }) : a === "beams" ? f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "visualizationMode",
            value: "rays"
          }) : f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "visualizationMode",
            value: "rays"
          }), l.preventDefault();
          break;
      }
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [e, n == null ? void 0 : n.maxReflectionOrder, a]), null;
}, j = ({ uuid: e }) => /* @__PURE__ */ t("div", { children: [
  /* @__PURE__ */ o(V, { uuid: e }),
  /* @__PURE__ */ o(k, { uuid: e }),
  /* @__PURE__ */ o(L, { uuid: e }),
  /* @__PURE__ */ o(I, { uuid: e }),
  /* @__PURE__ */ o(z, { uuid: e }),
  /* @__PURE__ */ o(Y, { uuid: e }),
  /* @__PURE__ */ o(U, { uuid: e })
] });
export {
  j as BeamTraceTab,
  j as default
};
//# sourceMappingURL=BeamTraceTab-BrWqJPLQ.mjs.map
