import React, { useEffect, useReducer } from "react";
import { BeamTraceSolver } from "../../compute/beam-trace";
import { emit, on } from "../../messenger";
import { useSolver } from "../../store";
import useToggle from "../hooks/use-toggle";
import { createPropertyInputs, PropertyButton, useSolverProperty } from "./SolverComponents";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import SourceReceiverMatrix from "./SourceReceiverMatrix";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import { PropertyRowSelect } from "./property-row/PropertyRowSelect";
import PropertyRowCheckbox from "./property-row/PropertyRowCheckbox";

// PropertyButton is still used for ImpulseResponse section
void PropertyButton;

export interface BeamTraceTabProps {
  uuid: string;
}

const { PropertyNumberInput } = createPropertyInputs<BeamTraceSolver>(
  "BEAMTRACE_SET_PROPERTY"
);

const visualizationModeOptions = [
  { value: "rays", label: "Rays Only" },
  { value: "beams", label: "Beams Only" },
  { value: "both", label: "Both" }
];

const SourceReceiverPairs = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Source / Receiver Pairs" open={open} onOpenClose={toggle}>
      <SourceReceiverMatrix uuid={uuid} eventType="BEAMTRACE_SET_PROPERTY" />
    </PropertyRowFolder>
  );
};

const Calculation = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);

  return (
    <PropertyRowFolder label="Calculation" open={open} onOpenClose={toggle}>
      <PropertyNumberInput
        uuid={uuid}
        label="Max Reflection Order"
        property="maxReflectionOrderReset"
        tooltip="Maximum number of reflections to trace (1-6 recommended)"
      />
    </PropertyRowFolder>
  );
};

const Visualization = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  const [mode, setMode] = useSolverProperty<BeamTraceSolver, "visualizationMode">(
    uuid,
    "visualizationMode",
    "BEAMTRACE_SET_PROPERTY"
  );
  const [showAllBeams, setShowAllBeams] = useSolverProperty<BeamTraceSolver, "showAllBeams">(
    uuid,
    "showAllBeams",
    "BEAMTRACE_SET_PROPERTY"
  );

  const showBeamsOptions = mode === "beams" || mode === "both";

  return (
    <PropertyRowFolder label="Visualization" open={open} onOpenClose={toggle}>
      <PropertyRow>
        <PropertyRowLabel label="Display Mode" hasToolTip tooltip="Toggle between ray paths, beam cones, or both" />
        <PropertyRowSelect
          value={mode || "rays"}
          onChange={setMode}
          options={visualizationModeOptions}
        />
      </PropertyRow>
      {showBeamsOptions && (
        <PropertyRow>
          <PropertyRowLabel label="Show All Beams" hasToolTip tooltip="Show all virtual sources, including invalid/orphaned ones" />
          <PropertyRowCheckbox
            value={showAllBeams || false}
            onChange={({ value }) => setShowAllBeams(value)}
          />
        </PropertyRow>
      )}
    </PropertyRowFolder>
  );
};

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

const Statistics = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(false);
  const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void];
  const solver = useSolver(state => state.solvers[uuid] as BeamTraceSolver);
  const numPaths = solver?.numValidPaths || 0;
  const metrics = solver?.lastMetrics;
  const bufferUsage = metrics?.bufferUsage;

  // Force update when calculation completes to show new metrics
  useEffect(() => {
    const unsub1 = on("BEAMTRACE_CALCULATE_COMPLETE", (id) => {
      if (id === uuid) forceUpdate();
    });
    const unsub2 = on("BEAMTRACE_RESET", (id) => {
      if (id === uuid) forceUpdate();
    });
    return () => { unsub1(); unsub2(); };
  }, [uuid]);

  return (
    <PropertyRowFolder label="Statistics" open={open} onOpenClose={toggle}>
      <PropertyRow>
        <PropertyRowLabel label="Valid Paths" />
        <span style={{ padding: "4px 8px" }}>{numPaths}</span>
      </PropertyRow>
      {metrics && (
        <>
          <PropertyRow>
            <PropertyRowLabel label="Raycasts" />
            <span style={{ padding: "4px 8px" }}>{metrics.raycastCount}</span>
          </PropertyRow>
          <PropertyRow>
            <PropertyRowLabel label="Cache Hits" />
            <span style={{ padding: "4px 8px" }}>{metrics.failPlaneCacheHits}</span>
          </PropertyRow>
          <PropertyRow>
            <PropertyRowLabel label="Buckets Skipped" />
            <span style={{ padding: "4px 8px" }}>{metrics.bucketsSkipped}</span>
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
                ⚠️ Buffer overflow! Reduce reflection order.
              </span>
            </PropertyRow>
          )}
        </>
      )}
    </PropertyRowFolder>
  );
};

const ImpulseResponse = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  const solver = useSolver(state => state.solvers[uuid] as BeamTraceSolver);
  const disabled = !solver || solver.numValidPaths === 0;

  return (
    <PropertyRowFolder label="Impulse Response" open={open} onOpenClose={toggle}>
      <PropertyButton
        event="BEAMTRACE_PLAY_IR"
        args={uuid}
        label="Play"
        tooltip="Play the calculated impulse response"
        disabled={disabled}
      />
      <PropertyButton
        event="BEAMTRACE_DOWNLOAD_IR"
        args={uuid}
        label="Download"
        tooltip="Download the impulse response as WAV"
        disabled={disabled}
      />
    </PropertyRowFolder>
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
      // Don't handle if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentOrder = solver?.maxReflectionOrder ?? 3;

      switch (e.key) {
        case "+":
        case "=":
        case "ArrowUp":
          // Increase reflection order (max 6)
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
          // Decrease reflection order (min 0)
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
          // Toggle between paths and sources view
          if (mode === "rays") {
            emit("BEAMTRACE_SET_PROPERTY", {
              uuid,
              property: "visualizationMode",
              value: "beams"
            });
          } else if (mode === "beams") {
            emit("BEAMTRACE_SET_PROPERTY", {
              uuid,
              property: "visualizationMode",
              value: "rays"
            });
          } else {
            // If "both", toggle to rays
            emit("BEAMTRACE_SET_PROPERTY", {
              uuid,
              property: "visualizationMode",
              value: "rays"
            });
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
  return (
    <div>
      <KeyboardShortcuts uuid={uuid} />
      <Calculation uuid={uuid} />
      <SourceReceiverPairs uuid={uuid} />
      <Visualization uuid={uuid} />
      <Statistics uuid={uuid} />
      <ImpulseResponse uuid={uuid} />
    </div>
  );
};

export default BeamTraceTab;
