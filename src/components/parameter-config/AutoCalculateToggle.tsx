import React from "react";
import { emit } from "../../messenger";
import { useSolver } from "../../store";
import Solver from "../../compute/solver";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import { PropertyRowCheckbox } from "./property-row/PropertyRowCheckbox";

export interface AutoCalculateToggleProps {
  uuid: string;
  eventType: keyof EventTypes;
}

export const AutoCalculateToggle: React.FC<AutoCalculateToggleProps> = ({ uuid, eventType }) => {
  // Include version in selector to force re-render when properties change
  const autoCalculate = useSolver((state) => {
    const _version = state.version;
    const solver = state.solvers[uuid] as Solver | undefined;
    return solver?.autoCalculate ?? false;
  });

  const handleChange = (e: { value: boolean }) => {
    emit(eventType, { uuid, property: "autoCalculate", value: e.value } as any);
  };

  return (
    <PropertyRow>
      <PropertyRowLabel
        label="Auto-Calculate"
        hasToolTip
        tooltip="Automatically recalculate when objects or parameters change"
      />
      <PropertyRowCheckbox value={autoCalculate} onChange={handleChange} />
    </PropertyRow>
  );
};

export default AutoCalculateToggle;
