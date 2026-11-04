import React from "react";
import Source, { SignalSourceOptions } from "../../objects/source";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import { createPropertyInputs } from "./ContainerComponents";
import useToggle from "../hooks/use-toggle";
import PropertyButton from "./property-row/PropertyButton";
import TransformTable from "./TransformTable";

const { PropertyNumberInput, PropertySelect } = createPropertyInputs<Source>(
  "SOURCE_SET_PROPERTY"
);

const Transform = ({ uuid }: { uuid: string }) => (
  <TransformTable uuid={uuid} event="SOURCE_SET_PROPERTY" />
);


const Configuration = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Configuration" open={open} onOpenClose={toggle}>
      <PropertyNumberInput
        uuid={uuid}
        label="θ Theta"
        property="theta"
        tooltip="Sets theta" 
      />
      <PropertyNumberInput
        uuid={uuid}
        label="φ Phi"
        property="phi"
        tooltip="Sets phi" 
      />
    </PropertyRowFolder>
  );
};

const FDTDConfig =({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="FDTD Config" open={open} onOpenClose={toggle}>
      <PropertySelect 
        uuid={uuid} 
        label="Signal Source" 
        tooltip="The source thats generating it's signal"
        property="signalSource"
        options={SignalSourceOptions}
      />
      <PropertyNumberInput uuid={uuid} label="Frequency" property="frequency" tooltip="The source's frequency" />
      <PropertyNumberInput uuid={uuid} label="Amplitude" property="amplitude" tooltip="The source's amplitude" />
      <PropertyButton label="Signal Data" tooltip="The source's signal data" event="SOURCE_CALL_METHOD" args={{ uuid, method: "saveSamples" }} />
    </PropertyRowFolder>
  )
}

export const SourceTab = ({ uuid }: { uuid: string }) => {
  return (
    <div>
      <Transform uuid={uuid} />
      <PropertyButton
        label="First Person View"
        tooltip="Look through this source and adjust its orientation"
        event="ENTER_FIRST_PERSON"
        args={{ uuid }}
      />
      <Configuration uuid={uuid} />
      <FDTDConfig uuid={uuid} />
    </div>
  );
};

export default SourceTab;
