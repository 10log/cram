import React, { useCallback, useEffect, useState } from "react";
import RayTracer from "../../compute/raytracer";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import PropertyRowButton from "./property-row/PropertyRowButton";
import { PropertyRowSelect } from "./property-row/PropertyRowSelect";
import { createPropertyInputs, useSolverProperty, PropertyButton } from "./SolverComponents";
import useToggle from "../hooks/use-toggle";
import { renderer } from "../../render/renderer";
import SourceReceiverMatrix from "./SourceReceiverMatrix";
import { emit } from "../../messenger";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import type { HRTFSubject } from "../../compute/raytracer/binaural/hrtf-data";
import { getAvailableSubjects, getThumbnailUrl } from "../../compute/raytracer/binaural/hrtf-data";


const { PropertyTextInput, PropertyNumberInput, PropertyCheckboxInput } = createPropertyInputs<RayTracer>(
  "RAYTRACER_SET_PROPERTY"
);


const Parameters = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Parameters" open={open} onOpenClose={toggle}>
      <PropertyNumberInput uuid={uuid} label="Rate (ms)" property="updateInterval" tooltip="Callback rate for quick estimate (ms)" />
      <PropertyNumberInput
        uuid={uuid}
        label="Order"
        property="reflectionOrder"
        tooltip="Sets the maximum reflection order"
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Passes"
        property="passes"
        tooltip="Number of rays shot on each callback"
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Temperature"
        property="temperature"
        tooltip="Temperature in Celsius (affects speed of sound and air absorption)"
        elementProps={{ step: 1, min: -20, max: 50 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Max Paths"
        property="maxStoredPaths"
        tooltip="Maximum paths stored per receiver (older paths evicted)"
        elementProps={{ step: 1000, min: 1 }}
      />
      <PropertyCheckboxInput
        uuid={uuid}
        label="Edge Diffraction"
        property="edgeDiffractionEnabled"
        tooltip="Enable UTD edge diffraction for sound around convex edges"
      />
    </PropertyRowFolder>
  );
};

const SourceReceiverPairs = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  const [ignoreReceivers] = useSolverProperty<RayTracer, "runningWithoutReceivers">(
    uuid,
    "runningWithoutReceivers",
    "RAYTRACER_SET_PROPERTY"
  );

  return (
    <PropertyRowFolder label="Source / Receiver Pairs" open={open} onOpenClose={toggle}>
      <PropertyCheckboxInput
        uuid={uuid}
        label="Ignore Receivers"
        property="runningWithoutReceivers"
        tooltip="Ignores receiver intersections (visualization only)"
      />
      <SourceReceiverMatrix uuid={uuid} disabled={ignoreReceivers} />
    </PropertyRowFolder>
  );
};

const StyleProperties = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Style Properties" open={open} onOpenClose={toggle}>
      <PropertyNumberInput
        uuid={uuid}
        label="Point Size"
        property="pointSize"
        tooltip="Sets the size of each interection point"
      />
      <PropertyCheckboxInput
        uuid={uuid}
        label="Rays Visible"
        property="raysVisible"
        tooltip="Toggles the visibility of the rays"
      />
      <PropertyCheckboxInput
        uuid={uuid}
        label="Points Visible"
        property="pointsVisible"
        tooltip="Toggles the visibility of the intersection points"
      />
    </PropertyRowFolder>
  );
};
const SolverControls = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Solver Controls" open={open} onOpenClose={toggle}>
      <PropertyCheckboxInput uuid={uuid} label="Running" property="isRunning" tooltip="Starts/stops the raytracer" />
    </PropertyRowFolder>
  );
};

const Convergence = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  const [metrics] = useSolverProperty<RayTracer, "convergenceMetrics">(uuid, "convergenceMetrics", "RAYTRACER_SET_PROPERTY");

  const ratioDisplay = metrics && Number.isFinite(metrics.convergenceRatio)
    ? (metrics.convergenceRatio * 100).toFixed(1) + "%"
    : "--";
  const t30Display = metrics && metrics.estimatedT30
    ? metrics.estimatedT30.map(t => t > 0 ? t.toFixed(2) + "s" : "--").join(", ")
    : "--";

  return (
    <PropertyRowFolder label="Convergence" open={open} onOpenClose={toggle}>
      <PropertyCheckboxInput
        uuid={uuid}
        label="Auto-Stop"
        property="autoStop"
        tooltip="Automatically stop when simulation converges"
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Threshold"
        property="convergenceThreshold"
        tooltip="Convergence ratio threshold (coefficient of variation of T30 estimates)"
        elementProps={{ step: 0.001, min: 0.001, max: 1 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="RR Threshold"
        property="rrThreshold"
        tooltip="Russian Roulette energy threshold for unbiased ray termination"
        elementProps={{ step: 0.01, min: 0.01, max: 1 }}
      />
      <PropertyRow>
        <PropertyRowLabel label="Conv. Ratio" hasToolTip tooltip="Current convergence ratio (max coefficient of variation across bands)" />
        <span style={{ fontSize: "11px", fontFamily: "monospace" }}>{ratioDisplay}</span>
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="Est. T30" hasToolTip tooltip="Estimated T30 per octave band (125-8000 Hz)" />
        <span style={{ fontSize: "11px", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>{t30Display}</span>
      </PropertyRow>
    </PropertyRowFolder>
  );
};

const LateReverberation = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(false);
  return (
    <PropertyRowFolder label="Late Reverberation" open={open} onOpenClose={toggle}>
      <PropertyCheckboxInput
        uuid={uuid}
        label="Enable Tail"
        property="lateReverbTailEnabled"
        tooltip="Synthesize a noise-based tail to extend the impulse response beyond ray-traced data"
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Crossfade Time (s)"
        property="tailCrossfadeTime"
        tooltip="Time (s) where crossfade from ray-traced to synthetic tail begins (0 = auto-detect)"
        elementProps={{ step: 0.1, min: 0, max: 5 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Crossfade Dur. (s)"
        property="tailCrossfadeDuration"
        tooltip="Duration of the Hann crossfade window between ray-traced and synthetic tail"
        elementProps={{ step: 0.01, min: 0.01, max: 0.5 }}
      />
    </PropertyRowFolder>
  );
};

const GpuAcceleration = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(false);
  return (
    <PropertyRowFolder label="GPU Acceleration" open={open} onOpenClose={toggle}>
      <PropertyCheckboxInput
        uuid={uuid}
        label="Enable GPU"
        property="gpuEnabled"
        tooltip="Use WebGPU compute shaders for parallel ray tracing (requires WebGPU browser)"
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Batch Size"
        property="gpuBatchSize"
        tooltip="Number of rays per GPU dispatch"
        elementProps={{ step: 1000, min: 1000, max: 50000 }}
      />
    </PropertyRowFolder>
  );
};

const Hybrid = ({ uuid }: { uuid: string}) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Hybrid Method" open={open} onOpenClose={toggle}>
      <PropertyCheckboxInput uuid={uuid} label="Use Hybrid Method" property="hybrid" tooltip="Enables Hybrid Calculation" />
      <PropertyTextInput uuid={uuid} label="Transition Order" property="transitionOrder" tooltip="Delination between image source and raytracer" />
    </PropertyRowFolder>
  )
}

const Output = ({uuid}: {uuid: string}) => {
  const [open, toggle] = useToggle(true);
  const [impulseResponsePlaying] = useSolverProperty<RayTracer, "impulseResponsePlaying">(uuid, "impulseResponsePlaying", "RAYTRACER_SET_PROPERTY");
  return (
    <PropertyRowFolder label="Impulse Response" open={open} onOpenClose={toggle}>
      <PropertyButton event="RAYTRACER_PLAY_IR" args={uuid} label="Play" tooltip="Plays the calculated impulse response" disabled={impulseResponsePlaying} />
      <PropertyButton event="RAYTRACER_DOWNLOAD_IR" args={uuid} label="Download" tooltip="Downloads the calculated broadband impulse response" />
      <PropertyButton event="RAYTRACER_DOWNLOAD_IR_OCTAVE" args={uuid} label="Download by Octave" tooltip="Downloads the impulse response in each octave" />
    </PropertyRowFolder>
  );
}

const AmbisonicOutput = ({uuid}: {uuid: string}) => {
  const [open, toggle] = useToggle(false);
  const [order, setOrder] = useState("1");
  const [validRayCount] = useSolverProperty<RayTracer, "validRayCount">(uuid, "validRayCount", "RAYTRACER_SET_PROPERTY");
  const disabled = !validRayCount || validRayCount === 0;

  const handleDownload = () => {
    emit("RAYTRACER_DOWNLOAD_AMBISONIC_IR", { uuid, order: parseInt(order) });
  };

  return (
    <PropertyRowFolder label="Ambisonic Output" open={open} onOpenClose={toggle}>
      <PropertyRow>
        <PropertyRowLabel label="Order" hasToolTip tooltip="Ambisonic order (1=FOA 4ch, 2=HOA 9ch, 3=HOA 16ch)" />
        <PropertyRowSelect
          value={order}
          onChange={({ value }) => setOrder(value)}
          options={[
            { value: "1", label: "1st Order (4 ch)" },
            { value: "2", label: "2nd Order (9 ch)" },
            { value: "3", label: "3rd Order (16 ch)" }
          ]}
        />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="" hasToolTip tooltip="Downloads ambisonic impulse response (ACN/N3D format)" />
        <PropertyRowButton onClick={handleDownload} label="Download" disabled={disabled} />
      </PropertyRow>
    </PropertyRowFolder>
  );
}

const HRTFSubjectDialog = ({
  open,
  onClose,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const [subjects, setSubjects] = useState<HRTFSubject[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      getAvailableSubjects()
        .then(setSubjects)
        .catch((err) => setError(err.message));
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Select HRTF Subject
        <IconButton onClick={onClose} size="small" aria-label="close">
          &#x2715;
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
          padding: "8px 0",
        }}>
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => {
                onSelect(subject.id);
                onClose();
              }}
              style={{
                border: subject.id === selectedId ? "2px solid #1976d2" : "1px solid #ccc",
                borderRadius: 8,
                padding: 8,
                cursor: "pointer",
                backgroundColor: subject.id === selectedId ? "#e3f2fd" : "#fff",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 6 }}>
                {subject.thumbnailLeft && (
                  <img
                    src={getThumbnailUrl(subject.thumbnailLeft)}
                    alt={`${subject.id} left ear`}
                    style={{ width: 80, height: 100, objectFit: "cover", borderRadius: 4 }}
                  />
                )}
                {subject.thumbnailRight && (
                  <img
                    src={getThumbnailUrl(subject.thumbnailRight)}
                    alt={`${subject.id} right ear`}
                    style={{ width: 80, height: 100, objectFit: "cover", borderRadius: 4 }}
                  />
                )}
              </div>
              <div style={{ fontWeight: 600, fontSize: 12, textAlign: "center" }}>
                {subject.name}
              </div>
              <div style={{ fontSize: 11, color: "#666", textAlign: "center" }}>
                {subject.description}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BinauralOutput = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(false);
  const [order, setOrder] = useState("1");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validRayCount] = useSolverProperty<RayTracer, "validRayCount">(uuid, "validRayCount", "RAYTRACER_SET_PROPERTY");
  const [binauralPlaying] = useSolverProperty<RayTracer, "binauralPlaying">(uuid, "binauralPlaying", "RAYTRACER_SET_PROPERTY");
  const [hrtfSubjectId] = useSolverProperty<RayTracer, "hrtfSubjectId">(uuid, "hrtfSubjectId", "RAYTRACER_SET_PROPERTY");
  const disabled = !validRayCount || validRayCount === 0;

  const handlePlay = useCallback(() => {
    emit("RAYTRACER_PLAY_BINAURAL_IR", { uuid, order: parseInt(order) });
  }, [uuid, order]);

  const handleDownload = useCallback(() => {
    emit("RAYTRACER_DOWNLOAD_BINAURAL_IR", { uuid, order: parseInt(order) });
  }, [uuid, order]);

  const handleSubjectSelect = useCallback((id: string) => {
    emit("RAYTRACER_SET_PROPERTY", { uuid, property: "hrtfSubjectId", value: id });
    // Invalidate cached binaural IR when subject changes
    emit("RAYTRACER_SET_PROPERTY", { uuid, property: "binauralImpulseResponse", value: undefined });
  }, [uuid]);

  return (
    <PropertyRowFolder label="Binaural Output" open={open} onOpenClose={toggle}>
      <PropertyRow>
        <PropertyRowLabel label="Order" hasToolTip tooltip="Ambisonic order for binaural decoding (1=FOA, 2=HOA2, 3=HOA3)" />
        <PropertyRowSelect
          value={order}
          onChange={({ value }) => setOrder(value)}
          options={[
            { value: "1", label: "1st Order (4 ch)" },
            { value: "2", label: "2nd Order (9 ch)" },
            { value: "3", label: "3rd Order (16 ch)" }
          ]}
        />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="HRTF Subject" hasToolTip tooltip="Head-related transfer function subject for binaural rendering" />
        <span style={{ fontSize: 11, fontFamily: "monospace" }}>{hrtfSubjectId || "D1"}</span>
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="" />
        <PropertyRowButton
          onClick={() => setDialogOpen(true)}
          label="Select HRTF Subject..."
        />
      </PropertyRow>
      <PropertyNumberInput
        uuid={uuid}
        label="Head Yaw"
        property="headYaw"
        tooltip="Head rotation around vertical axis in degrees (positive = left)"
        elementProps={{ step: 5, min: -180, max: 180 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Head Pitch"
        property="headPitch"
        tooltip="Head tilt up/down in degrees (positive = up)"
        elementProps={{ step: 5, min: -90, max: 90 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Head Roll"
        property="headRoll"
        tooltip="Head tilt left/right in degrees (positive = right ear down)"
        elementProps={{ step: 5, min: -90, max: 90 }}
      />
      <PropertyRow>
        <PropertyRowLabel label="" />
        <PropertyRowButton onClick={handlePlay} label="Play Binaural" disabled={disabled || binauralPlaying} />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="" />
        <PropertyRowButton onClick={handleDownload} label="Download Stereo WAV" disabled={disabled} />
      </PropertyRow>
      <HRTFSubjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedId={hrtfSubjectId || "D1"}
        onSelect={handleSubjectSelect}
      />
    </PropertyRowFolder>
  );
};

export const RayTracerTab = ({ uuid }: { uuid: string }) => {
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
      <Parameters uuid={uuid} />
      <GpuAcceleration uuid={uuid} />
      <SourceReceiverPairs uuid={uuid} />
      <StyleProperties uuid={uuid} />
      <SolverControls uuid={uuid} />
      <Convergence uuid={uuid} />
      <LateReverberation uuid={uuid} />
      <Hybrid uuid={uuid} />
      <Output uuid={uuid} />
      <AmbisonicOutput uuid={uuid} />
      <BinauralOutput uuid={uuid} />
    </div>
  );
};

export default RayTracerTab;
