import React, { useCallback, useEffect, useMemo, useState } from "react";
import RayTracer from "../../compute/raytracer";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import PropertyRowButton from "./property-row/PropertyRowButton";
import { PropertyRowSelect } from "./property-row/PropertyRowSelect";
import { PropertyRowNumberInput } from "./property-row/PropertyRowNumberInput";
import { createPropertyInputs, useSolverProperty, PropertyButton } from "./SolverComponents";
import { renderer } from "../../render/renderer";
import SourceReceiverMatrix from "./SourceReceiverMatrix";
import { emit } from "../../messenger";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import type { SxProps, Theme } from "@mui/material/styles";
import { getAvailableSubjects } from "../../compute/binaural/hrtf-data";
import { HRTFSubjectDialog } from "./HRTFSubjectDialog";
import { isWebGPUAvailable } from "../../compute/raytracer/gpu/gpu-context";
import SolverControlBar from "./SolverControlBar";
import SectionLabel from "./property-row/SectionLabel";


const { PropertyTextInput, PropertyNumberInput, PropertyCheckboxInput } = createPropertyInputs<RayTracer>(
  "RAYTRACER_SET_PROPERTY"
);

const toggleGroupSx: SxProps<Theme> = {
  width: "100%",
  "& .MuiToggleButton-root": {
    flex: 1,
    py: 0.25,
    fontSize: "0.7rem",
    textTransform: "none",
    fontWeight: 500,
  },
};

const toggleRowSx: SxProps<Theme> = {
  px: 0.5,
  py: 0.5,
};

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

export const RayTracerTab = ({ uuid }: { uuid: string }) => {
  const [isRunning] = useSolverProperty<RayTracer, "isRunning">(uuid, "isRunning", "RAYTRACER_SET_PROPERTY");
  const [validRayCount] = useSolverProperty<RayTracer, "validRayCount">(uuid, "validRayCount", "RAYTRACER_SET_PROPERTY");
  const [gpuEnabled] = useSolverProperty<RayTracer, "gpuEnabled">(uuid, "gpuEnabled", "RAYTRACER_SET_PROPERTY");
  const [ignoreReceivers] = useSolverProperty<RayTracer, "runningWithoutReceivers">(uuid, "runningWithoutReceivers", "RAYTRACER_SET_PROPERTY");
  const [impulseResponsePlaying] = useSolverProperty<RayTracer, "impulseResponsePlaying">(uuid, "impulseResponsePlaying", "RAYTRACER_SET_PROPERTY");
  const [binauralPlaying] = useSolverProperty<RayTracer, "binauralPlaying">(uuid, "binauralPlaying", "RAYTRACER_SET_PROPERTY");
  const [hrtfSubjectId] = useSolverProperty<RayTracer, "hrtfSubjectId">(uuid, "hrtfSubjectId", "RAYTRACER_SET_PROPERTY");
  const [convergenceMetrics] = useSolverProperty<RayTracer, "convergenceMetrics">(uuid, "convergenceMetrics", "RAYTRACER_SET_PROPERTY");
  const [headYaw, setHeadYaw] = useSolverProperty<RayTracer, "headYaw">(uuid, "headYaw", "RAYTRACER_SET_PROPERTY");
  const [headPitch, setHeadPitch] = useSolverProperty<RayTracer, "headPitch">(uuid, "headPitch", "RAYTRACER_SET_PROPERTY");
  const [headRoll, setHeadRoll] = useSolverProperty<RayTracer, "headRoll">(uuid, "headRoll", "RAYTRACER_SET_PROPERTY");

  const gpuAvailable = useMemo(() => isWebGPUAvailable(), []);
  const [ambiOrder, setAmbiOrder] = useState("1");
  const [binauralOrder, setBinauralOrder] = useState("1");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjectLabel, setSubjectLabel] = useState("");

  useEffect(() => {
    const id = hrtfSubjectId || "D1";
    getAvailableSubjects()
      .then((subjects) => {
        const match = subjects.find((s) => s.id === id);
        setSubjectLabel(match ? match.name : id);
      })
      .catch(() => setSubjectLabel(id));
  }, [hrtfSubjectId]);

  const hasResults = !!validRayCount && validRayCount > 0;
  const isCpu = !gpuEnabled;

  const ratioDisplay = convergenceMetrics && Number.isFinite(convergenceMetrics.convergenceRatio)
    ? (convergenceMetrics.convergenceRatio * 100).toFixed(1) + "%"
    : "--";
  const t30Values = convergenceMetrics?.estimatedT30
    ? convergenceMetrics.estimatedT30.map(t => t > 0 ? t.toFixed(2) : "--")
    : null;

  const handlePlayPause = useCallback(() => {
    emit("RAYTRACER_SET_PROPERTY", { uuid, property: "isRunning", value: !isRunning });
  }, [uuid, isRunning]);

  const handleStop = useCallback(() => {
    emit("RAYTRACER_SET_PROPERTY", { uuid, property: "isRunning", value: false });
  }, [uuid]);

  const handleReset = useCallback(() => {
    emit("RAYTRACER_CLEAR_RAYS", uuid);
  }, [uuid]);

  const handleModeChange = useCallback((_e: React.MouseEvent, value: string | null) => {
    if (value !== null) {
      emit("RAYTRACER_SET_PROPERTY", { uuid, property: "gpuEnabled", value: value === "gpu" });
    }
  }, [uuid]);

  const handleAmbiDownload = useCallback(() => {
    emit("RAYTRACER_DOWNLOAD_AMBISONIC_IR", { uuid, order: parseInt(ambiOrder) });
  }, [uuid, ambiOrder]);

  const handleBinauralPlay = useCallback(() => {
    emit("RAYTRACER_PLAY_BINAURAL_IR", { uuid, order: parseInt(binauralOrder) });
  }, [uuid, binauralOrder]);

  const handleBinauralDownload = useCallback(() => {
    emit("RAYTRACER_DOWNLOAD_BINAURAL_IR", { uuid, order: parseInt(binauralOrder) });
  }, [uuid, binauralOrder]);

  const handleSubjectSelect = useCallback((id: string) => {
    emit("RAYTRACER_SET_PROPERTY", { uuid, property: "hrtfSubjectId", value: id });
    emit("RAYTRACER_SET_PROPERTY", { uuid, property: "binauralImpulseResponse", value: undefined });
  }, [uuid]);

  useEffect(() => {
    const cells = renderer.overlays.global.cells;
    const key = uuid + "-valid-ray-count";
    if(cells.has(key)) cells.get(key)!.show();
    return () => {
      if (cells.has(key)) cells.get(key)!.hide();
    };
  }, [uuid]);

  return (
    <div>
      <SolverControlBar
        onPlayPause={handlePlayPause}
        onStop={handleStop}
        onReset={handleReset}
        isRunning={!!isRunning}
        canRun={true}
        hasResults={hasResults}
      />

      {/* CPU / GPU toggle */}
      <Box sx={toggleRowSx}>
        <ToggleButtonGroup
          value={gpuEnabled && gpuAvailable ? "gpu" : "cpu"}
          exclusive
          onChange={handleModeChange}
          size="small"
          sx={toggleGroupSx}
        >
          <ToggleButton value="cpu">CPU</ToggleButton>
          <Tooltip
            title={gpuAvailable ? "" : "WebGPU is not supported in this browser"}
            placement="top"
          >
            <span style={{ flex: 1, display: "flex" }}>
              <ToggleButton value="gpu" disabled={!gpuAvailable} sx={{ flex: 1 }}>
                GPU
              </ToggleButton>
            </span>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>

      {/* Source / Receiver Pairs */}
      <SectionLabel label="Source / Receiver Pairs" />
      <PropertyCheckboxInput uuid={uuid} label="Ignore Receivers" property="runningWithoutReceivers" tooltip="Run rays without checking receiver intersections — useful for visualization-only mode" />
      <SourceReceiverMatrix uuid={uuid} disabled={ignoreReceivers} />

      {/* Parameters */}
      <SectionLabel label="Parameters" />
      <PropertyNumberInput uuid={uuid} label="Order" property="reflectionOrder" tooltip="Maximum number of specular reflections each ray can undergo before termination" />
      <PropertyNumberInput uuid={uuid} label="Max Paths" property="maxStoredPaths" tooltip="Maximum valid paths stored per source-receiver pair. Oldest paths are evicted when the buffer is full." elementProps={{ step: 1000, min: 1 }} />
      <PropertyCheckboxInput uuid={uuid} label="Edge Diffraction" property="edgeDiffractionEnabled" tooltip="Uniform Theory of Diffraction (UTD) — models sound bending around convex edges using Keller's geometrical theory, adding diffracted contributions at each wedge." />
      {isCpu && (
        <>
          <PropertyNumberInput uuid={uuid} label="Rate (ms)" property="updateInterval" tooltip="Interval between ray-tracing callbacks in milliseconds. Lower values give faster visual feedback but use more CPU." />
          <PropertyNumberInput uuid={uuid} label="Passes" property="passes" tooltip="Number of rays launched per callback interval. Higher values improve convergence speed at the cost of UI responsiveness." />
        </>
      )}
      {!isCpu && (
        <PropertyNumberInput uuid={uuid} label="Batch Size" property="gpuBatchSize" tooltip="Number of rays dispatched per WebGPU compute pass. Larger batches improve throughput but increase per-frame latency." elementProps={{ step: 1000, min: 1000, max: 50000 }} />
      )}
      <PropertyCheckboxInput uuid={uuid} label="Hybrid Method" property="hybrid" tooltip="Combines deterministic image-source calculation for early reflections with stochastic ray tracing for late reflections, improving accuracy at low orders." />
      <PropertyTextInput uuid={uuid} label="Transition Order" property="transitionOrder" tooltip="Reflection order at which the solver switches from image-source to ray tracing in hybrid mode" />
      <PropertyCheckboxInput uuid={uuid} label="Late Reverb Tail" property="lateReverbTailEnabled" tooltip="Synthesize a stochastic noise tail to extend the impulse response beyond the ray-traced data, using energy decay parameters estimated from the simulation." />
      <PropertyNumberInput uuid={uuid} label="Crossfade Time (s)" property="tailCrossfadeTime" tooltip="Time (seconds) at which the crossfade from ray-traced to synthetic tail begins. Set to 0 for automatic detection based on energy curve." elementProps={{ step: 0.1, min: 0, max: 5 }} />
      <PropertyNumberInput uuid={uuid} label="Crossfade Dur. (s)" property="tailCrossfadeDuration" tooltip="Duration of the Hann-windowed crossfade between ray-traced and synthetic tail regions" elementProps={{ step: 0.01, min: 0.01, max: 0.5 }} />

      {/* Convergence */}
      <SectionLabel label="Convergence" />
      <PropertyCheckboxInput uuid={uuid} label="Auto-Stop" property="autoStop" tooltip="Automatically halt the simulation when the coefficient of variation of T30 estimates across octave bands falls below the threshold" />
      <PropertyNumberInput uuid={uuid} label="Threshold" property="convergenceThreshold" tooltip="Target coefficient of variation for T30 estimates across octave bands (125 Hz – 8 kHz). Lower values require more rays but yield more stable results." elementProps={{ step: 0.001, min: 0.001, max: 1 }} />
      <PropertyNumberInput uuid={uuid} label="RR Threshold" property="rrThreshold" tooltip="Russian Roulette termination threshold — rays with energy below this fraction of their initial energy are probabilistically terminated, keeping the estimator unbiased." elementProps={{ step: 0.01, min: 0.01, max: 1 }} />
      <PropertyRow>
        <PropertyRowLabel label="Conv. Ratio" hasToolTip tooltip="Current maximum coefficient of variation of T30 across all octave bands — decreases toward the threshold as more rays are traced" />
        <Box sx={{ fontSize: "0.75rem", fontFamily: "monospace", px: 1, color: "text.primary", textAlign: "center" }}>{ratioDisplay}</Box>
      </PropertyRow>
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

      {/* Visualization */}
      <SectionLabel label="Visualization" />
      <PropertyNumberInput uuid={uuid} label="Point Size" property="pointSize" tooltip="Radius in pixels of each surface intersection point rendered in the viewport" />
      <PropertyCheckboxInput uuid={uuid} label="Rays Visible" property="raysVisible" tooltip="Show or hide ray path lines in the 3D viewport" />
      <PropertyCheckboxInput uuid={uuid} label="Points Visible" property="pointsVisible" tooltip="Show or hide intersection points where rays hit surfaces" />

      {/* Impulse Response */}
      <SectionLabel label="Impulse Response" />
      <PropertyButton event="RAYTRACER_PLAY_IR" args={uuid} label="Play" tooltip="Auralise the broadband impulse response through the default audio output" disabled={impulseResponsePlaying} />
      <PropertyButton event="RAYTRACER_DOWNLOAD_IR" args={uuid} label="Download" tooltip="Export the broadband impulse response as a mono WAV file" />
      <PropertyButton event="RAYTRACER_DOWNLOAD_IR_OCTAVE" args={uuid} label="Download by Octave" tooltip="Export separate WAV files for each octave-band filtered impulse response" />

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
        <PropertyRowButton onClick={handleAmbiDownload} label="Download" disabled={!hasResults} />
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
        <PropertyRowButton onClick={handleBinauralPlay} label="Play Binaural" disabled={!hasResults || binauralPlaying} />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="" />
        <PropertyRowButton onClick={handleBinauralDownload} label="Download Stereo WAV" disabled={!hasResults} />
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

export default RayTracerTab;
