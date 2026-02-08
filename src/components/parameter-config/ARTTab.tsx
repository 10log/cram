import React, { useCallback, useMemo } from 'react';
import { ART } from '../../compute/radiance/art';
import { useContainer } from "../../store";
import { createPropertyInputs, useSolverProperty } from "./SolverComponents";
import SourceReceiverMatrix from "./SourceReceiverMatrix";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import { PropertyRowSelect } from "./property-row/PropertyRowSelect";
import SolverControlBar from "./SolverControlBar";
import SectionLabel from "./property-row/SectionLabel";
import { emit } from "../../messenger";

export interface ARTTabProps {
  uuid: string;
}

const { PropertyNumberInput } = createPropertyInputs<ART>(
  "ART_SET_PROPERTY"
);

export const ARTTab = ({ uuid }: ARTTabProps) => {
  const containers = useContainer((state) => state.containers);
  const version = useContainer((state) => state.version);

  const rooms = useMemo(() => {
    return Object.values(containers)
      .filter(c => c.kind === "room")
      .map(c => ({ value: c.uuid, label: c.name }));
  }, [containers, version]);

  const [roomID, setRoomID] = useSolverProperty<ART, "roomID">(
    uuid, "roomID", "ART_SET_PROPERTY"
  );

  const handleCalculate = useCallback(() => {
    emit("CALCULATE_ART", uuid);
  }, [uuid]);

  return (
    <div>
      <SolverControlBar
        onPlayPause={handleCalculate}
        canRun={true}
      />

      {/* Room */}
      <SectionLabel label="Room" />
      <PropertyRow>
        <PropertyRowLabel label="Room" hasToolTip tooltip="Room geometry to tessellate into radiosity patches for energy exchange computation" />
        <PropertyRowSelect
          value={roomID || ""}
          onChange={setRoomID}
          options={rooms.length > 0 ? rooms : [{ value: "", label: "No rooms available" }]}
        />
      </PropertyRow>

      {/* Source / Receiver Pairs */}
      <SectionLabel label="Source / Receiver Pairs" />
      <SourceReceiverMatrix uuid={uuid} eventType="ART_SET_PROPERTY" />

      {/* Solver Settings */}
      <SectionLabel label="Solver Settings" />
      <PropertyNumberInput
        uuid={uuid}
        label="Max Edge Length"
        property="maxEdgeLength"
        tooltip="Maximum triangle edge length during adaptive tessellation (metres). Smaller values create finer radiosity patches for more spatial detail at the cost of computation time."
        elementProps={{ step: 0.1, min: 0.05 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="BRDF Detail"
        property="brdfDetail"
        tooltip="Hemisphere discretization level for directional energy exchange. Level 0 = 6 bins, 1 ≈ 18 bins, 2 ≈ 66 bins. Higher levels model more complex reflection patterns but increase memory and compute cost."
        elementProps={{ step: 1, min: 0, max: 3 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Rays per Shoot"
        property="raysPerShoot"
        tooltip="Number of stochastic rays emitted per progressive shooting iteration to estimate form factors between surface patches"
        elementProps={{ step: 50, min: 10 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Max Iterations"
        property="maxIterations"
        tooltip="Maximum progressive radiosity shooting iterations before the solver halts — each iteration distributes the highest-energy unshot patch"
        elementProps={{ step: 10, min: 1 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Convergence"
        property="convergenceThreshold"
        tooltip="Ratio of remaining unshot energy to initial energy at which the solver stops. Lower values yield more accurate steady-state energy distributions but require more iterations."
        elementProps={{ step: 0.005, min: 0.001, max: 0.5 }}
      />
      <PropertyNumberInput
        uuid={uuid}
        label="Sample Rate"
        property="sampleRate"
        tooltip="Temporal resolution for time-dependent energy exchange between patches (Hz). Higher rates capture faster energy fluctuations but increase computation."
        elementProps={{ step: 100, min: 100, max: 44100 }}
      />
    </div>
  );
};

export default ARTTab;
