import React from "react";
import Receiver from "../../objects/receiver";
import { createPropertyInputs } from "./ContainerComponents";
import useToggle from "../hooks/use-toggle";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import TransformTable from "./TransformTable";

const { PropertySelect } = createPropertyInputs<Receiver>("RECEIVER_SET_PROPERTY");

const directivityOptions = [
  { value: 'omni', label: 'Omnidirectional' },
  { value: 'cardioid', label: 'Cardioid' },
  { value: 'supercardioid', label: 'Supercardioid' },
  { value: 'figure8', label: 'Figure-8' },
];

const Transform = ({ uuid }: { uuid: string }) => (
  <TransformTable uuid={uuid} event="RECEIVER_SET_PROPERTY" />
);

const Directivity = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Directivity" open={open} onOpenClose={toggle}>
      <PropertySelect
        uuid={uuid}
        label="Pattern"
        property="directivityPattern"
        tooltip="Receiver directivity pattern for microphone modeling"
        options={directivityOptions}
      />
    </PropertyRowFolder>
  );
};

export const ReceiverTab = ({ uuid }: { uuid: string }) => {
  return (
    <div>
      <Transform uuid={uuid} />
      <Directivity uuid={uuid} />
    </div>
  );
};

export default ReceiverTab;
