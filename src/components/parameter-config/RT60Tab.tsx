import React, { useReducer, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { RT60 } from '../../compute/rt';
import { on } from "../../messenger";
import { useSolver } from "../../store";
import { pickProps } from "../../common/helpers";
import useToggle from "../hooks/use-toggle";
import { createPropertyInputs, PropertyButton } from "./SolverComponents";
import PropertyRowFolder from "./property-row/PropertyRowFolder";

export interface RT60TabProps {
  uuid: string;
}

const { PropertyNumberInput } = createPropertyInputs<RT60>(
  "RT60_SET_PROPERTY"
);

const Settings = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Room Settings" open={open} onOpenClose={toggle}>
    <PropertyNumberInput
        uuid={uuid}
        label="Room Volume"
        property="displayVolume"
        tooltip="Overrides the calculated room volume"
        elementProps={{
          step: 0.01
        }}
      />
    </PropertyRowFolder>
  );
};


const Export = ({uuid}: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  const {noResults} = useSolver(useShallow(state => pickProps(["noResults"], state.solvers[uuid] as RT60)));
  const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void]

  useEffect(() => {
    return on("UPDATE_RT60", (_e) => {
      forceUpdate();
    });
  }, [forceUpdate]);

  return(
    <PropertyRowFolder label="Export" open={open} onOpenClose={toggle}>
      <PropertyButton event="DOWNLOAD_RT60_RESULTS" args={uuid} label="Download RT Results" disabled={noResults} tooltip="Download RT Results as CSV File"/>
    </PropertyRowFolder>
  )
}

export const RT60Tab = ({ uuid }: RT60TabProps) => {
  return (
    <div>
      <Settings uuid={uuid} />
      <Export uuid={uuid} />
    </div>
  );
};

export default RT60Tab;
