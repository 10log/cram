import React, { useEffect, useState } from "react";
import RayTracer from "../../compute/raytracer";
import { ConvergenceMetrics } from "../../compute/raytracer";
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


const { PropertyTextInput, PropertyNumberInput, PropertyCheckboxInput } = createPropertyInputs<RayTracer>(
  "RAYTRACER_SET_PROPERTY"
);


const Parameters = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Parameters" open={open} onOpenClose={toggle}>
      <PropertyNumberInput uuid={uuid} label="Rate (ms)" property="updateInterval" tooltip="Sets the callback rate" />
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
      <SourceReceiverPairs uuid={uuid} />
      <StyleProperties uuid={uuid} />
      <SolverControls uuid={uuid} />
      <Convergence uuid={uuid} />
      <Hybrid uuid={uuid} />
      <Output uuid={uuid} />
      <AmbisonicOutput uuid={uuid} />
    </div>
  );
};

export default RayTracerTab;
