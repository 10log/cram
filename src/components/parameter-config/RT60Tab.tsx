import React, { useReducer, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { RT60 } from '../../compute/rt';
import { on } from "../../messenger";
import { useSolver } from "../../store";
import { pickProps } from "../../common/helpers";
import { createPropertyInputs, PropertyButton } from "./SolverComponents";
import SectionLabel from "./property-row/SectionLabel";

export interface RT60TabProps {
  uuid: string;
}

const { PropertyNumberInput } = createPropertyInputs<RT60>(
  "RT60_SET_PROPERTY"
);

export const RT60Tab = ({ uuid }: RT60TabProps) => {
  const {noResults} = useSolver(useShallow(state => pickProps(["noResults"], state.solvers[uuid] as RT60)));
  const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void];

  useEffect(() => {
    return on("UPDATE_RT60", (_e) => {
      forceUpdate();
    });
  }, [forceUpdate]);

  return (
    <div>
      {/* Settings */}
      <SectionLabel label="Settings" />
      <PropertyNumberInput
        uuid={uuid}
        label="Room Volume"
        property="displayVolume"
        tooltip="Override the automatically computed room volume (m³). Used in Sabine, Eyring, and Fitzroy reverberation time formulas."
        elementProps={{ step: 0.01 }}
      />

      {/* Export */}
      <SectionLabel label="Export" />
      <PropertyButton event="DOWNLOAD_RT60_RESULTS" args={uuid} label="Download RT Results" disabled={noResults} tooltip="Export reverberation time results (T20, T30, EDT) per octave band as a CSV file" />
    </div>
  );
};

export default RT60Tab;
