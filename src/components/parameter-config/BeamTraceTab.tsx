import React, { useCallback, useEffect, useReducer, useState } from "react";
import { BeamTraceSolver } from "../../compute/beam-trace";
import { emit, on } from "../../messenger";
import { useSolver } from "../../store";
import { createPropertyInputs, PropertyButton, useSolverProperty } from "./SolverComponents";
import SourceReceiverMatrix from "./SourceReceiverMatrix";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import PropertyRowButton from "./property-row/PropertyRowButton";
import { PropertyRowSelect } from "./property-row/PropertyRowSelect";
import PropertyRowCheckbox from "./property-row/PropertyRowCheckbox";
import SectionLabel from "./property-row/SectionLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import type { SxProps, Theme } from "@mui/material/styles";

export interface BeamTraceTabProps {
  uuid: string;
}

const { PropertyNumberInput } = createPropertyInputs<BeamTraceSolver>(
  "BEAMTRACE_SET_PROPERTY"
);

const statusBarSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1,
  py: 0.5,
  borderBottom: "1px solid",
  borderColor: "divider",
  minHeight: 28,
};

const statusTextSx = (calculating: boolean): SxProps<Theme> => ({
  fontSize: "0.7rem",
  color: calculating ? "warning.main" : "text.secondary",
  fontWeight: calculating ? 500 : 400,
});

const visualizationModeOptions = [
  { value: "rays", label: "Rays Only" },
  { value: "beams", label: "Beams Only" },
  { value: "both", label: "Both" }
];

const BufferUsageBar = ({ percent, overflow }: { percent: number; overflow: boolean }) => {
  const color = overflow ? "#ff4444" : percent > 80 ? "#ffaa00" : "#44aa44";
  return (
    <div style={{
      width: "60px",
      height: "8px",
      background: "#333",
      borderRadius: "4px",
      overflow: "hidden",
      marginRight: "8px"
    }}>
      <div style={{
        width: `${Math.min(percent, 100)}%`,
        height: "100%",
        background: color,
        transition: "width 0.2s"
      }} />
    </div>
  );
};

// Keyboard shortcuts component for reflection order control
const KeyboardShortcuts = ({ uuid }: { uuid: string }) => {
  const solver = useSolver(state => state.solvers[uuid] as BeamTraceSolver | undefined);
  const [mode] = useSolverProperty<BeamTraceSolver, "visualizationMode">(
    uuid,
    "visualizationMode",
    "BEAMTRACE_SET_PROPERTY"
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentOrder = solver?.maxReflectionOrder ?? 3;

      switch (e.key) {
        case "+":
        case "=":
        case "ArrowUp":
          if (currentOrder < 6) {
            emit("BEAMTRACE_SET_PROPERTY", {
              uuid,
              property: "maxReflectionOrderReset",
              value: currentOrder + 1
            });
          }
          e.preventDefault();
          break;
        case "-":
        case "_":
        case "ArrowDown":
          if (currentOrder > 0) {
            emit("BEAMTRACE_SET_PROPERTY", {
              uuid,
              property: "maxReflectionOrderReset",
              value: currentOrder - 1
            });
          }
          e.preventDefault();
          break;
        case "b":
        case "B":
          if (mode === "rays") {
            emit("BEAMTRACE_SET_PROPERTY", { uuid, property: "visualizationMode", value: "beams" });
          } else if (mode === "beams") {
            emit("BEAMTRACE_SET_PROPERTY", { uuid, property: "visualizationMode", value: "rays" });
          } else {
            emit("BEAMTRACE_SET_PROPERTY", { uuid, property: "visualizationMode", value: "rays" });
          }
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [uuid, solver?.maxReflectionOrder, mode]);

  return null;
};

export const BeamTraceTab = ({ uuid }: BeamTraceTabProps) => {
  const [calculating, setCalculating] = useState(false);
  const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void];
  const solver = useSolver(state => state.solvers[uuid] as BeamTraceSolver);
  const numPaths = solver?.numValidPaths || 0;
  const metrics = solver?.lastMetrics;
  const bufferUsage = metrics?.bufferUsage;
  const hasResults = numPaths > 0;
  const disabled = !hasResults;

  const [mode, setMode] = useSolverProperty<BeamTraceSolver, "visualizationMode">(
    uuid, "visualizationMode", "BEAMTRACE_SET_PROPERTY"
  );
  const [showAllBeams, setShowAllBeams] = useSolverProperty<BeamTraceSolver, "showAllBeams">(
    uuid, "showAllBeams", "BEAMTRACE_SET_PROPERTY"
  );
  const showBeamsOptions = mode === "beams" || mode === "both";

  const [ambiOrder, setAmbiOrder] = useState("1");

  useEffect(() => {
    const unsub1 = on("BEAMTRACE_CALCULATE_COMPLETE", (id) => {
      if (id === uuid) { setCalculating(false); forceUpdate(); }
    });
    const unsub2 = on("BEAMTRACE_RESET", (id) => {
      if (id === uuid) forceUpdate();
    });
    return () => { unsub1(); unsub2(); };
  }, [uuid]);

  const handleCalculate = useCallback(() => {
    setCalculating(true);
    emit("BEAMTRACE_CALCULATE", uuid);
  }, [uuid]);

  const handleReset = useCallback(() => {
    emit("BEAMTRACE_RESET", uuid);
  }, [uuid]);

  const handleAmbiDownload = useCallback(() => {
    emit("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", { uuid, order: parseInt(ambiOrder) });
  }, [uuid, ambiOrder]);

  return (
    <div>
      <KeyboardShortcuts uuid={uuid} />

      {/* Status bar */}
      <Box sx={statusBarSx}>
        {calculating ? (
          <>
            <CircularProgress size={12} thickness={5} color="warning" />
            <Typography sx={statusTextSx(true)}>Unfolding surfaces...</Typography>
          </>
        ) : hasResults ? (
          <Typography sx={statusTextSx(false)}>
            {numPaths.toLocaleString()} path{numPaths !== 1 ? "s" : ""} found
          </Typography>
        ) : (
          <Typography sx={statusTextSx(false)}>Ready</Typography>
        )}
        <Box sx={{ flex: 1 }} />
        {!calculating && (
          <Typography
            component="span"
            onClick={handleCalculate}
            sx={{ fontSize: "0.65rem", color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          >
            Recalculate
          </Typography>
        )}
        {hasResults && !calculating && (
          <Typography
            component="span"
            onClick={handleReset}
            sx={{ fontSize: "0.65rem", color: "text.disabled", cursor: "pointer", ml: 1, "&:hover": { textDecoration: "underline", color: "text.secondary" } }}
          >
            Clear
          </Typography>
        )}
      </Box>

      {/* Calculation */}
      <SectionLabel label="Calculation" />
      <PropertyNumberInput
        uuid={uuid}
        label="Max Reflection Order"
        property="maxReflectionOrderReset"
        tooltip="Maximum surface-unfolding depth. All valid specular paths are found deterministically and instantaneously via geometric surface unfolding — no stochastic sampling. Complexity grows with order; 1–6 recommended."
      />

      {/* Source / Receiver Pairs */}
      <SectionLabel label="Source / Receiver Pairs" />
      <SourceReceiverMatrix uuid={uuid} eventType="BEAMTRACE_SET_PROPERTY" />

      {/* Visualization */}
      <SectionLabel label="Visualization" />
      <PropertyRow>
        <PropertyRowLabel label="Display Mode" hasToolTip tooltip="Visualization style: ray paths show specular reflection chains, beam cones show the volumetric unfolded regions, or both overlaid" />
        <PropertyRowSelect
          value={mode || "rays"}
          onChange={setMode}
          options={visualizationModeOptions}
        />
      </PropertyRow>
      {showBeamsOptions && (
        <PropertyRow>
          <PropertyRowLabel label="Show All Beams" hasToolTip tooltip="Display all unfolded beam cones including geometrically invalid or orphaned ones — useful for debugging surface-unfolding coverage" />
          <PropertyRowCheckbox
            value={showAllBeams || false}
            onChange={({ value }) => setShowAllBeams(value)}
          />
        </PropertyRow>
      )}

      {/* Statistics */}
      <SectionLabel label="Statistics" />
      <PropertyRow>
        <PropertyRowLabel label="Valid Paths" />
        <Box sx={{ fontSize: "0.75rem", fontFamily: "monospace", px: 1, color: "text.primary", textAlign: "center" }}>{numPaths}</Box>
      </PropertyRow>
      {metrics && (
        <>
          <PropertyRow>
            <PropertyRowLabel label="Raycasts" />
            <Box sx={{ fontSize: "0.75rem", fontFamily: "monospace", px: 1, color: "text.primary", textAlign: "center" }}>{metrics.raycastCount}</Box>
          </PropertyRow>
          <PropertyRow>
            <PropertyRowLabel label="Cache Hits" />
            <Box sx={{ fontSize: "0.75rem", fontFamily: "monospace", px: 1, color: "text.primary", textAlign: "center" }}>{metrics.failPlaneCacheHits}</Box>
          </PropertyRow>
          <PropertyRow>
            <PropertyRowLabel label="Buckets Skipped" />
            <Box sx={{ fontSize: "0.75rem", fontFamily: "monospace", px: 1, color: "text.primary", textAlign: "center" }}>{metrics.bucketsSkipped}</Box>
          </PropertyRow>
        </>
      )}
      {bufferUsage && (
        <>
          <PropertyRow>
            <PropertyRowLabel
              label="Lines Buffer"
              hasToolTip
              tooltip={`${bufferUsage.linesUsed.toLocaleString()} / ${bufferUsage.linesCapacity.toLocaleString()} vertices`}
            />
            <div style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}>
              <BufferUsageBar percent={bufferUsage.linesPercent} overflow={bufferUsage.overflowWarning} />
              <span style={{ fontSize: "11px", color: bufferUsage.linesPercent > 80 ? "#ffaa00" : "#888" }}>
                {bufferUsage.linesPercent.toFixed(1)}%
              </span>
            </div>
          </PropertyRow>
          <PropertyRow>
            <PropertyRowLabel
              label="Points Buffer"
              hasToolTip
              tooltip={`${bufferUsage.pointsUsed.toLocaleString()} / ${bufferUsage.pointsCapacity.toLocaleString()} points`}
            />
            <div style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}>
              <BufferUsageBar percent={bufferUsage.pointsPercent} overflow={bufferUsage.overflowWarning} />
              <span style={{ fontSize: "11px", color: bufferUsage.pointsPercent > 80 ? "#ffaa00" : "#888" }}>
                {bufferUsage.pointsPercent.toFixed(1)}%
              </span>
            </div>
          </PropertyRow>
          {bufferUsage.overflowWarning && (
            <PropertyRow>
              <span style={{ color: "#ff4444", fontSize: "11px", padding: "4px 8px" }}>
                Buffer overflow! Reduce reflection order.
              </span>
            </PropertyRow>
          )}
        </>
      )}

      {/* Impulse Response */}
      <SectionLabel label="Impulse Response" />
      <PropertyButton
        event="BEAMTRACE_PLAY_IR"
        args={uuid}
        label="Play"
        tooltip="Auralise the impulse response computed from beam-traced specular paths"
        disabled={disabled}
      />
      <PropertyButton
        event="BEAMTRACE_DOWNLOAD_IR"
        args={uuid}
        label="Download"
        tooltip="Export the impulse response as a mono WAV file"
        disabled={disabled}
      />

      {/* Ambisonic Output */}
      <SectionLabel label="Ambisonic Output" />
      <PropertyRow>
        <PropertyRowLabel label="Order" hasToolTip tooltip="Ambisonic order — 1st (4 ch FOA), 2nd (9 ch HOA), or 3rd (16 ch HOA). Higher orders capture finer spatial detail." />
        <PropertyRowSelect
          value={ambiOrder}
          onChange={({ value }) => setAmbiOrder(value)}
          options={[
            { value: "1", label: "1st Order (4 ch)" },
            { value: "2", label: "2nd Order (9 ch)" },
            { value: "3", label: "3rd Order (16 ch)" }
          ]}
        />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="" hasToolTip tooltip="Download a multi-channel WAV in ACN channel order with N3D normalisation" />
        <PropertyRowButton onClick={handleAmbiDownload} label="Download" disabled={disabled} />
      </PropertyRow>
    </div>
  );
};

export default BeamTraceTab;
