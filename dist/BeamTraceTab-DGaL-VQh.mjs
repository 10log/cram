import { jsxs as t, jsx as o, Fragment as T } from "react/jsx-runtime";
import { useEffect as P, useReducer as w, useState as x } from "react";
import { f as b, u, P as R, a as p, b as d, c as g, h as C, o as v, d as S, e as f } from "./index-CT5_YzQr.mjs";
import { u as E, P as y, c as B } from "./SolverComponents-DyZscYH1.mjs";
import { S as M } from "./SourceReceiverMatrix-DmxBth7B.mjs";
const { PropertyNumberInput: _ } = B(
  "BEAMTRACE_SET_PROPERTY"
), D = [
  { value: "rays", label: "Rays Only" },
  { value: "beams", label: "Beams Only" },
  { value: "both", label: "Both" }
], L = ({ uuid: e }) => {
  const [r, n] = u(!0);
  return /* @__PURE__ */ o(R, { label: "Source / Receiver Pairs", open: r, onOpenClose: n, children: /* @__PURE__ */ o(M, { uuid: e, eventType: "BEAMTRACE_SET_PROPERTY" }) });
}, k = ({ uuid: e }) => {
  const [r, n] = u(!0);
  return /* @__PURE__ */ o(R, { label: "Calculation", open: r, onOpenClose: n, children: /* @__PURE__ */ o(
    _,
    {
      uuid: e,
      label: "Max Reflection Order",
      property: "maxReflectionOrderReset",
      tooltip: "Maximum number of reflections to trace (1-6 recommended)"
    }
  ) });
}, I = ({ uuid: e }) => {
  const [r, n] = u(!0), [l, s] = E(
    e,
    "visualizationMode",
    "BEAMTRACE_SET_PROPERTY"
  ), [i, h] = E(
    e,
    "showAllBeams",
    "BEAMTRACE_SET_PROPERTY"
  );
  return /* @__PURE__ */ t(R, { label: "Visualization", open: r, onOpenClose: n, children: [
    /* @__PURE__ */ t(p, { children: [
      /* @__PURE__ */ o(d, { label: "Display Mode", hasToolTip: !0, tooltip: "Toggle between ray paths, beam cones, or both" }),
      /* @__PURE__ */ o(
        g,
        {
          value: l || "rays",
          onChange: s,
          options: D
        }
      )
    ] }),
    (l === "beams" || l === "both") && /* @__PURE__ */ t(p, { children: [
      /* @__PURE__ */ o(d, { label: "Show All Beams", hasToolTip: !0, tooltip: "Show all virtual sources, including invalid/orphaned ones" }),
      /* @__PURE__ */ o(
        C,
        {
          value: i || !1,
          onChange: ({ value: c }) => h(c)
        }
      )
    ] })
  ] });
}, A = ({ percent: e, overflow: r }) => {
  const n = r ? "#ff4444" : e > 80 ? "#ffaa00" : "#44aa44";
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
    background: n,
    transition: "width 0.2s"
  } }) });
}, z = ({ uuid: e }) => {
  const [r, n] = u(!1), [, l] = w((c) => c + 1, 0), s = b((c) => c.solvers[e]), i = s?.numValidPaths || 0, h = s?.lastMetrics, a = h?.bufferUsage;
  return P(() => {
    const c = v("BEAMTRACE_CALCULATE_COMPLETE", (m) => {
      m === e && l();
    }), O = v("BEAMTRACE_RESET", (m) => {
      m === e && l();
    });
    return () => {
      c(), O();
    };
  }, [e]), /* @__PURE__ */ t(R, { label: "Statistics", open: r, onOpenClose: n, children: [
    /* @__PURE__ */ t(p, { children: [
      /* @__PURE__ */ o(d, { label: "Valid Paths" }),
      /* @__PURE__ */ o("span", { style: { padding: "4px 8px" }, children: i })
    ] }),
    h && /* @__PURE__ */ t(T, { children: [
      /* @__PURE__ */ t(p, { children: [
        /* @__PURE__ */ o(d, { label: "Raycasts" }),
        /* @__PURE__ */ o("span", { style: { padding: "4px 8px" }, children: h.raycastCount })
      ] }),
      /* @__PURE__ */ t(p, { children: [
        /* @__PURE__ */ o(d, { label: "Cache Hits" }),
        /* @__PURE__ */ o("span", { style: { padding: "4px 8px" }, children: h.failPlaneCacheHits })
      ] }),
      /* @__PURE__ */ t(p, { children: [
        /* @__PURE__ */ o(d, { label: "Buckets Skipped" }),
        /* @__PURE__ */ o("span", { style: { padding: "4px 8px" }, children: h.bucketsSkipped })
      ] })
    ] }),
    a && /* @__PURE__ */ t(T, { children: [
      /* @__PURE__ */ t(p, { children: [
        /* @__PURE__ */ o(
          d,
          {
            label: "Lines Buffer",
            hasToolTip: !0,
            tooltip: `${a.linesUsed.toLocaleString()} / ${a.linesCapacity.toLocaleString()} vertices`
          }
        ),
        /* @__PURE__ */ t("div", { style: { display: "flex", alignItems: "center", padding: "4px 8px" }, children: [
          /* @__PURE__ */ o(A, { percent: a.linesPercent, overflow: a.overflowWarning }),
          /* @__PURE__ */ t("span", { style: { fontSize: "11px", color: a.linesPercent > 80 ? "#ffaa00" : "#888" }, children: [
            a.linesPercent.toFixed(1),
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t(p, { children: [
        /* @__PURE__ */ o(
          d,
          {
            label: "Points Buffer",
            hasToolTip: !0,
            tooltip: `${a.pointsUsed.toLocaleString()} / ${a.pointsCapacity.toLocaleString()} points`
          }
        ),
        /* @__PURE__ */ t("div", { style: { display: "flex", alignItems: "center", padding: "4px 8px" }, children: [
          /* @__PURE__ */ o(A, { percent: a.pointsPercent, overflow: a.overflowWarning }),
          /* @__PURE__ */ t("span", { style: { fontSize: "11px", color: a.pointsPercent > 80 ? "#ffaa00" : "#888" }, children: [
            a.pointsPercent.toFixed(1),
            "%"
          ] })
        ] })
      ] }),
      a.overflowWarning && /* @__PURE__ */ o(p, { children: /* @__PURE__ */ o("span", { style: { color: "#ff4444", fontSize: "11px", padding: "4px 8px" }, children: "⚠️ Buffer overflow! Reduce reflection order." }) })
    ] })
  ] });
}, Y = ({ uuid: e }) => {
  const [r, n] = u(!0), l = b((i) => i.solvers[e]), s = !l || l.numValidPaths === 0;
  return /* @__PURE__ */ t(R, { label: "Impulse Response", open: r, onOpenClose: n, children: [
    /* @__PURE__ */ o(
      y,
      {
        event: "BEAMTRACE_PLAY_IR",
        args: e,
        label: "Play",
        tooltip: "Play the calculated impulse response",
        disabled: s
      }
    ),
    /* @__PURE__ */ o(
      y,
      {
        event: "BEAMTRACE_DOWNLOAD_IR",
        args: e,
        label: "Download",
        tooltip: "Download the impulse response as WAV",
        disabled: s
      }
    )
  ] });
}, U = ({ uuid: e }) => {
  const [r, n] = u(!1), [l, s] = x("1"), i = b((c) => c.solvers[e]), h = !i || i.numValidPaths === 0;
  return /* @__PURE__ */ t(R, { label: "Ambisonic Output", open: r, onOpenClose: n, children: [
    /* @__PURE__ */ t(p, { children: [
      /* @__PURE__ */ o(d, { label: "Order", hasToolTip: !0, tooltip: "Ambisonic order (1=FOA 4ch, 2=HOA 9ch, 3=HOA 16ch)" }),
      /* @__PURE__ */ o(
        g,
        {
          value: l,
          onChange: ({ value: c }) => s(c),
          options: [
            { value: "1", label: "1st Order (4 ch)" },
            { value: "2", label: "2nd Order (9 ch)" },
            { value: "3", label: "3rd Order (16 ch)" }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ t(p, { children: [
      /* @__PURE__ */ o(d, { label: "", hasToolTip: !0, tooltip: "Downloads ambisonic impulse response (ACN/N3D format)" }),
      /* @__PURE__ */ o(S, { onClick: () => {
        f("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", { uuid: e, order: parseInt(l) });
      }, label: "Download", disabled: h })
    ] })
  ] });
}, V = ({ uuid: e }) => {
  const r = b((l) => l.solvers[e]), [n] = E(
    e,
    "visualizationMode",
    "BEAMTRACE_SET_PROPERTY"
  );
  return P(() => {
    const l = (s) => {
      if (s.target instanceof HTMLInputElement || s.target instanceof HTMLTextAreaElement)
        return;
      const i = r?.maxReflectionOrder ?? 3;
      switch (s.key) {
        case "+":
        case "=":
        case "ArrowUp":
          i < 6 && f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "maxReflectionOrderReset",
            value: i + 1
          }), s.preventDefault();
          break;
        case "-":
        case "_":
        case "ArrowDown":
          i > 0 && f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "maxReflectionOrderReset",
            value: i - 1
          }), s.preventDefault();
          break;
        case "b":
        case "B":
          n === "rays" ? f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "visualizationMode",
            value: "beams"
          }) : n === "beams" ? f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "visualizationMode",
            value: "rays"
          }) : f("BEAMTRACE_SET_PROPERTY", {
            uuid: e,
            property: "visualizationMode",
            value: "rays"
          }), s.preventDefault();
          break;
      }
    };
    return window.addEventListener("keydown", l), () => window.removeEventListener("keydown", l);
  }, [e, r?.maxReflectionOrder, n]), null;
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
//# sourceMappingURL=BeamTraceTab-DGaL-VQh.mjs.map
