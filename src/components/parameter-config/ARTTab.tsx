import React, { useMemo } from 'react';
import { ART } from '../../compute/radiance/art';
import { useContainer } from "../../store";
import useToggle from "../hooks/use-toggle";
import { createPropertyInputs, PropertyButton, useSolverProperty } from "./SolverComponents";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import SourceReceiverMatrix from "./SourceReceiverMatrix";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import { PropertyRowSelect } from "./property-row/PropertyRowSelect";

export interface ARTTabProps {
  uuid: string;
}

const { PropertyNumberInput } = createPropertyInputs<ART>(
  "ART_SET_PROPERTY"
);

const RoomSettings = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  const containers = useContainer((state) => state.containers);
  const version = useContainer((state) => state.version);

  const rooms = useMemo(() => {
    return Object.values(containers)
      .filter(c => c.kind === "room")
      .map(c => ({ value: c.uuid, label: c.name }));
  }, [containers, version]);

  const [roomID, setRoomID] = useSolverProperty<ART, "roomID">(
    uuid,
    "roomID",
    "ART_SET_PROPERTY"
  );

  return (
    <PropertyRowFolder label="Room" open={open} onOpenClose={toggle}>
      <PropertyRow>
        <PropertyRowLabel label="Room" hasToolTip tooltip="Room geometry used for tessellation" />
        <PropertyRowSelect
          value={roomID || ""}
          onChange={setRoomID}
          options={rooms.length > 0 ? rooms : [{ value: "", label: "No rooms available" }]}
        />
      </PropertyRow>
    </PropertyRowFolder>
  );
};

const SourceReceiverPairs = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Source / Receiver Pairs" open={open} onOpenClose={toggle}>
      <SourceReceiverMatrix uuid={uuid} eventType="ART_SET_PROPERTY" />
    </PropertyRowFolder>
  );
};

const SolverSettings = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Solver Settings" open={open} onOpenClose={toggle}>
      <PropertyNumberInput
        uuid={uuid}
        label="Max Edge Length"
        property="maxEdgeLength"
        tooltip="Maximum triangle edge length for tessellation (meters)"
        elementProps={{ step: 0.1, min: 0.05 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="BRDF Detail"
        property="brdfDetail"
        tooltip="Icosahedron subdivision level (0=6, 1=~18, 2=~66 hemisphere bins)"
        elementProps={{ step: 1, min: 0, max: 3 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Rays per Shoot"
        property="raysPerShoot"
        tooltip="Number of rays cast per shooting iteration"
        elementProps={{ step: 50, min: 10 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Max Iterations"
        property="maxIterations"
        tooltip="Maximum number of progressive shooting iterations"
        elementProps={{ step: 10, min: 1 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Convergence"
        property="convergenceThreshold"
        tooltip="Stop when unshot/initial energy ratio falls below this"
        elementProps={{ step: 0.005, min: 0.001, max: 0.5 }}
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
        label="Sample Rate"
        property="sampleRate"
        tooltip="Internal temporal sample rate (Hz)"
        elementProps={{ step: 100, min: 100, max: 44100 }}
      />
    </PropertyRowFolder>
  );
};

const Calculate = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Calculate" open={open} onOpenClose={toggle}>
      <PropertyButton
        event="CALCULATE_ART"
        args={uuid}
        label="Calculate"
        tooltip="Run the Acoustic Radiance Transfer solver"
      />
    </PropertyRowFolder>
  );
};

export const ARTTab = ({ uuid }: ARTTabProps) => {
  return (
    <div>
      <RoomSettings uuid={uuid} />
      <SourceReceiverPairs uuid={uuid} />
      <SolverSettings uuid={uuid} />
      <Calculate uuid={uuid} />
    </div>
  );
};

export default ARTTab;
