import React, { useEffect, useReducer } from "react";
import "./ImageSourceTab.css";
import {ImageSourceSolver} from "../../../compute/raytracer/image-source/index";
import { on } from "../../../messenger";
import { useSolver } from "../../../store";
import { pickProps } from "../../../common/helpers";
import useToggle from "../../hooks/use-toggle";
import { createPropertyInputs, useSolverProperty, PropertyButton  } from "../SolverComponents";
import PropertyRowFolder from "../property-row/PropertyRowFolder";
import { useShallow } from "zustand/react/shallow";
import SourceReceiverMatrix from "../SourceReceiverMatrix";

export interface ImageSourceTabProps {
  uuid: string;
}

const { PropertyNumberInput, PropertyCheckboxInput } = createPropertyInputs<ImageSourceSolver>(
  "IMAGESOURCE_SET_PROPERTY"
);

const SourceReceiverPairs = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Source / Receiver Pairs" open={open} onOpenClose={toggle}>
      <SourceReceiverMatrix uuid={uuid} eventType="IMAGESOURCE_SET_PROPERTY" />
    </PropertyRowFolder>
  );
};

const Calculation = ({ uuid }: { uuid: string}) => {
  const [open, toggle] = useToggle(true);
  const {sourceIDs, receiverIDs} = useSolver(useShallow(state => pickProps(["sourceIDs", "receiverIDs"], state.solvers[uuid] as ImageSourceSolver)));
  const disabled = !(sourceIDs.length > 0 && receiverIDs.length > 0);
  const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void]
  useEffect(() => {
    return on("IMAGESOURCE_SET_PROPERTY", (e) => {
      if (e.uuid === uuid && (e.property === "sourceIDs" || e.property === "receiverIDs")) {
        forceUpdate();
      }
    });
  }, [uuid]);
  return (
    <PropertyRowFolder label="Calculation" open={open} onOpenClose={toggle}>
      <PropertyNumberInput uuid={uuid} label="Maximum Order" property="maxReflectionOrderReset" tooltip="Sets the maximum reflection order"/>
      <PropertyButton disabled={disabled} event="UPDATE_IMAGESOURCE" args={uuid} label="Update" tooltip="Updates Imagesource Calculation" />
      <PropertyButton disabled={disabled} event="RESET_IMAGESOURCE" args={uuid} label="Clear" tooltip="Clears Imagesource Calculation" />
    </PropertyRowFolder>
  );
}

const Graphing = ({ uuid }: { uuid: string}) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Graphing" open={open} onOpenClose={toggle}>
      <PropertyCheckboxInput uuid={uuid} label="Show Sources" property="imageSourcesVisible" tooltip="Shows/Hides Image Sources"/>
      <PropertyCheckboxInput uuid={uuid} label="Show Paths" property="rayPathsVisible" tooltip="Shows/Hides Ray Paths"/>
    </PropertyRowFolder>
  );
}

const ImpulseResponse = ({uuid}: { uuid: string}) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Impulse Response" open={open} onOpenClose={toggle}>
      <PropertyButton event="IMAGESOURCE_PLAY_IR" args={uuid} label="Play" tooltip="Plays the calculated impulse response" disabled={false} />
      <PropertyButton event="IMAGESOURCE_DOWNLOAD_IR" args={uuid} label="Download" tooltip="Plays the calculated impulse response" />
    </PropertyRowFolder>
  )
}

const Developer = ({ uuid }: { uuid: string}) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Developer" open={open} onOpenClose={toggle}>
      <PropertyButton event="CALCULATE_LTP" args={uuid} label="Calculate LTP" tooltip="Calculates Level Time Progression"/>
    </PropertyRowFolder>
  );
}
export const ImageSourceTab = ({ uuid }: ImageSourceTabProps) => {
  return (
    <div>
      <Calculation uuid={uuid}/>
      <SourceReceiverPairs uuid={uuid}/>
      <Graphing uuid={uuid}/>
      <ImpulseResponse uuid={uuid}/>
      <Developer uuid={uuid}/>
    </div>
  );
};

export default ImageSourceTab;
