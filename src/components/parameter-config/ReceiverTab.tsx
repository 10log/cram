import React from "react";
import Receiver, { ReceiverPattern } from "../../objects/receiver";
import { createPropertyInputs } from "./ContainerComponents";
import useToggle from "../hooks/use-toggle";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import TransformTable from "./TransformTable";

const { PropertySelect } = createPropertyInputs<Receiver>("RECEIVER_SET_PROPERTY");

const directivityOptions = [
  { value: ReceiverPattern.OMNIDIRECTIONAL, label: 'Omnidirectional' },
  { value: ReceiverPattern.CARDIOID, label: 'Cardioid' },
  { value: ReceiverPattern.SUPERCARDIOID, label: 'Supercardioid' },
  { value: ReceiverPattern.FIGURE_EIGHT, label: 'Figure-8' },
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
