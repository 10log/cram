import React from "react";
import TransformTable from "./TransformTable";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import { PropertyRowNumberInput } from "./property-row/PropertyRowNumberInput";
import { useContainerProperty } from "./ContainerComponents";
import useToggle from "../hooks/use-toggle";
import Room from "../../objects/room";

const Transform = ({ uuid }: { uuid: string }) => (
  <TransformTable uuid={uuid} event="ROOM_SET_PROPERTY" />
);

const Environment = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  const [temperature, setTemperature] = useContainerProperty<Room, "temperature">(uuid, "temperature", "ROOM_SET_PROPERTY");
  const [humidity, setHumidity] = useContainerProperty<Room, "humidity">(uuid, "humidity", "ROOM_SET_PROPERTY");
  return (
    <PropertyRowFolder label="Environment" open={open} onOpenClose={toggle}>
      <PropertyRow>
        <PropertyRowLabel label="Temperature" hasToolTip tooltip="Temperature in Celsius (affects speed of sound and air absorption)" />
        <PropertyRowNumberInput value={temperature} onChange={setTemperature} step={1} min={-20} max={50} />
      </PropertyRow>
      <PropertyRow>
        <PropertyRowLabel label="Humidity" hasToolTip tooltip="Relative humidity in % (affects air absorption)" />
        <PropertyRowNumberInput value={humidity} onChange={setHumidity} step={1} min={5} max={95} />
      </PropertyRow>
    </PropertyRowFolder>
  );
};

export const RoomTab = ({ uuid }: { uuid: string }) => {
  return (
    <div>
      <Transform uuid={uuid} />
      <Environment uuid={uuid} />
    </div>
  );
};

export default RoomTab;
