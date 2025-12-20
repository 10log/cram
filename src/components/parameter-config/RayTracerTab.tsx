import React, { useEffect } from "react";
import RayTracer from "../../compute/raytracer";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import { createPropertyInputs, useSolverProperty, PropertyButton } from "./SolverComponents";
import useToggle from "../hooks/use-toggle";
import { renderer } from "../../render/renderer";
import SourceReceiverMatrix from "./SourceReceiverMatrix";


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
      <Hybrid uuid={uuid} />
      <Output uuid={uuid} />
    </div>
  );
};

export default RayTracerTab;
