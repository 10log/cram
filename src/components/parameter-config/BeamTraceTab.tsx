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
import { PropertyRowNumberInput } from "./property-row/PropertyRowNumberInput";
import PropertyRowCheckbox from "./property-row/PropertyRowCheckbox";
import SectionLabel from "./property-row/SectionLabel";
import { HRTFSubjectDialog } from "./HRTFSubjectDialog";
import { getAvailableSubjects } from "../../compute/binaural/hrtf-data";
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

const headOrientationRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 0.25,
  flex: 1,
};

const axisLabelSx: SxProps<Theme> = {
  fontSize: "0.6rem",
  color: "text.disabled",
  minWidth: 10,
  textAlign: "center",
};

const T30_BANDS = ["125", "250", "500", "1k", "2k", "4k", "8k"];

const t30TableSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: 0,
  px: 0.5,
  mb: 0.5,
};

const t30HeaderSx: SxProps<Theme> = {
  fontSize: "0.6rem",
  color: "text.disabled",
  textAlign: "center",
  pb: 0.25,
};

const t30CellSx: SxProps<Theme> = {
  fontSize: "0.7rem",
  fontFamily: "monospace",
  color: "text.primary",
  textAlign: "center",
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
  const [estimating, setEstimating] = useState(false);
  const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void];
  const solver = useSolver(state => state.solvers[uuid] as BeamTraceSolver);
  const numPaths = solver?.numValidPaths || 0;
  const metrics = solver?.lastMetrics;
  const bufferUsage = metrics?.bufferUsage;
  const hasResults = numPaths > 0;
  const disabled = !hasResults;

  // Compute T30 values from response-by-intensity (preferred) or quick estimate (fallback)
  const t30Values = (() => {
    const rbi = solver?.responseByIntensity;
    if (rbi) {
      const recKey = Object.keys(rbi)[0];
      if (recKey) {
        const srcKey = Object.keys(rbi[recKey])[0];
        if (srcKey && rbi[recKey][srcKey].t30) {
          return rbi[recKey][srcKey].t30!.map(t => t.m < 0 ? (-60 / t.m).toFixed(2) : "--");
        }
      }
    }
    if (solver?.estimatedT30) {
      return solver.estimatedT30.map(t => t > 0 ? t.toFixed(2) : "--");
    }
    return null;
  })();

  const [mode, setMode] = useSolverProperty<BeamTraceSolver, "visualizationMode">(
    uuid, "visualizationMode", "BEAMTRACE_SET_PROPERTY"
  );
  const [showAllBeams, setShowAllBeams] = useSolverProperty<BeamTraceSolver, "showAllBeams">(
    uuid, "showAllBeams", "BEAMTRACE_SET_PROPERTY"
  );
  const showBeamsOptions = mode === "beams" || mode === "both";

  const [ambiOrder, setAmbiOrder] = useState("1");
  const [binauralOrder, setBinauralOrder] = useState("1");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjectLabel, setSubjectLabel] = useState("");

  const [hrtfSubjectId] = useSolverProperty<BeamTraceSolver, "hrtfSubjectId">(uuid, "hrtfSubjectId", "BEAMTRACE_SET_PROPERTY");
  const [headYaw, setHeadYaw] = useSolverProperty<BeamTraceSolver, "headYaw">(uuid, "headYaw", "BEAMTRACE_SET_PROPERTY");
  const [headPitch, setHeadPitch] = useSolverProperty<BeamTraceSolver, "headPitch">(uuid, "headPitch", "BEAMTRACE_SET_PROPERTY");
  const [headRoll, setHeadRoll] = useSolverProperty<BeamTraceSolver, "headRoll">(uuid, "headRoll", "BEAMTRACE_SET_PROPERTY");
  const [binauralPlaying] = useSolverProperty<BeamTraceSolver, "binauralPlaying">(uuid, "binauralPlaying", "BEAMTRACE_SET_PROPERTY");
  const [edgeDiffractionEnabled, setEdgeDiffractionEnabled] = useSolverProperty<BeamTraceSolver, "edgeDiffractionEnabled">(uuid, "edgeDiffractionEnabled", "BEAMTRACE_SET_PROPERTY");
  const [lateReverbTailEnabled, setLateReverbTailEnabled] = useSolverProperty<BeamTraceSolver, "lateReverbTailEnabled">(uuid, "lateReverbTailEnabled", "BEAMTRACE_SET_PROPERTY");

  useEffect(() => {
    const id = hrtfSubjectId || "D1";
    getAvailableSubjects()
      .then((subjects) => {
        const match = subjects.find((s) => s.id === id);
        setSubjectLabel(match ? match.name : id);
      })
      .catch(() => setSubjectLabel(id));
  }, [hrtfSubjectId]);

  useEffect(() => {
    const unsub1 = on("BEAMTRACE_CALCULATE_COMPLETE", (id) => {
      if (id === uuid) { setCalculating(false); forceUpdate(); }
    });
    const unsub2 = on("BEAMTRACE_RESET", (id) => {
      if (id === uuid) forceUpdate();
    });
    const unsub3 = on("BEAMTRACE_QUICK_ESTIMATE_COMPLETE", (id) => {
      if (id === uuid) { setEstimating(false); forceUpdate(); }
    });
    return () => { unsub1(); unsub2(); unsub3(); };
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

  const handleBinauralPlay = useCallback(() => {
    emit("BEAMTRACE_PLAY_BINAURAL_IR", { uuid, order: parseInt(binauralOrder) });
  }, [uuid, binauralOrder]);

  const handleBinauralDownload = useCallback(() => {
    emit("BEAMTRACE_DOWNLOAD_BINAURAL_IR", { uuid, order: parseInt(binauralOrder) });
  }, [uuid, binauralOrder]);

  const handleQuickEstimate = useCallback(() => {
    setEstimating(true);
    emit("BEAMTRACE_QUICK_ESTIMATE", uuid);
  }, [uuid]);

  const handleSubjectSelect = useCallback((id: string) => {
    emit("BEAMTRACE_SET_PROPERTY", { uuid, property: "hrtfSubjectId", value: id });
    emit("BEAMTRACE_SET_PROPERTY", { uuid, property: "binauralImpulseResponse", value: undefined });
  }, [uuid]);

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

      <PropertyRow>
        <PropertyRowLabel label="Edge Diffraction" hasToolTip tooltip="Uniform Theory of Diffraction (UTD) — models sound bending around convex edges, adding diffracted contributions at each room edge" />
        <PropertyRowCheckbox
          value={edgeDiffractionEnabled || false}
          onChange={({ value }) => setEdgeDiffractionEnabled(value)}
        />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="" hasToolTip tooltip="Shoot 500 random rays to quickly estimate RT60 per octave band" />
        <PropertyRowButton onClick={handleQuickEstimate} label={estimating ? "Estimating..." : "Quick Estimate"} disabled={estimating} />
      </PropertyRow>

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

      {/* Est. T30 */}
      <SectionLabel label="Est. T30" />
      <Box sx={t30TableSx}>
        {T30_BANDS.map((band) => (
          <Box key={band} sx={t30HeaderSx}>{band}</Box>
        ))}
        {t30Values
          ? t30Values.map((v, i) => <Box key={i} sx={t30CellSx}>{v}</Box>)
          : T30_BANDS.map((_, i) => <Box key={i} sx={t30CellSx}>--</Box>)
        }
      </Box>

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
      <PropertyButton
        event="BEAMTRACE_DOWNLOAD_OCTAVE_IR"
        args={uuid}
        label="Download by Octave"
        tooltip="Export per-octave-band impulse responses as individual WAV files"
        disabled={disabled}
      />

      {/* Late Reverberation */}
      <SectionLabel label="Late Reverberation" />
      <PropertyRow>
        <PropertyRowLabel label="Late Reverb Tail" hasToolTip tooltip="Synthesize a noise tail extending the IR beyond specular paths, using energy decay parameters estimated from the computed paths" />
        <PropertyRowCheckbox
          value={lateReverbTailEnabled || false}
          onChange={({ value }) => setLateReverbTailEnabled(value)}
        />
      </PropertyRow>
      <PropertyNumberInput
        uuid={uuid}
        label="Crossfade Time (s)"
        property="tailCrossfadeTime"
        tooltip="Time in seconds where the synthesized tail begins to crossfade with ray-traced IR. 0 = auto-detect from last path arrival."
        elementProps={{ step: 0.1, min: 0, max: 5 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Crossfade Dur. (s)"
        property="tailCrossfadeDuration"
        tooltip="Duration in seconds of the Hann crossfade window between specular IR and synthesized tail"
        elementProps={{ step: 0.01, min: 0.01, max: 0.5 }}
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

      {/* Binaural Output */}
      <SectionLabel label="Binaural Output" />
      <PropertyRow>
        <PropertyRowLabel label="Order" hasToolTip tooltip="Ambisonic order used for binaural decoding via HRTF convolution" />
        <PropertyRowSelect
          value={binauralOrder}
          onChange={({ value }) => setBinauralOrder(value)}
          options={[
            { value: "1", label: "1st Order (4 ch)" },
            { value: "2", label: "2nd Order (9 ch)" },
            { value: "3", label: "3rd Order (16 ch)" }
          ]}
        />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="HRTF Subject" hasToolTip tooltip="Head-Related Transfer Function dataset used for spatial audio rendering — different subjects have different ear geometries" />
        <PropertyRowButton onClick={() => setDialogOpen(true)} label={subjectLabel || hrtfSubjectId || "D1"} />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="Head Orientation" hasToolTip tooltip="Listener head rotation in degrees — Yaw: horizontal (positive = left), Pitch: vertical (positive = up), Roll: tilt (positive = right ear down)" />
        <Box sx={headOrientationRowSx}>
          <Box component="span" sx={axisLabelSx}>Y</Box>
          <PropertyRowNumberInput value={headYaw ?? 0} onChange={({ value }) => setHeadYaw(value)} step={5} min={-180} max={180} />
          <Box component="span" sx={axisLabelSx}>P</Box>
          <PropertyRowNumberInput value={headPitch ?? 0} onChange={({ value }) => setHeadPitch(value)} step={5} min={-90} max={90} />
          <Box component="span" sx={axisLabelSx}>R</Box>
          <PropertyRowNumberInput value={headRoll ?? 0} onChange={({ value }) => setHeadRoll(value)} step={5} min={-90} max={90} />
        </Box>
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="" />
        <PropertyRowButton onClick={handleBinauralPlay} label="Play Binaural" disabled={disabled || binauralPlaying} />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="" />
        <PropertyRowButton onClick={handleBinauralDownload} label="Download Stereo WAV" disabled={disabled} />
      </PropertyRow>

      <HRTFSubjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedId={hrtfSubjectId || "D1"}
        onSelect={handleSubjectSelect}
      />
    </div>
  );
};

export default BeamTraceTab;
