import React from 'react';
import { emit } from "../../messenger";
import useToggle from "../hooks/use-toggle";
import { PropertyButton } from "./SolverComponents";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";

export interface EnergyDecayTabProps {
    uuid: string;
}
  
const Input = ({ uuid }: { uuid: string }) => {
    const [open, toggle] = useToggle(true);
    return (
      <PropertyRowFolder label="Input" open={open} onOpenClose={toggle}>
        <PropertyRow>
            <PropertyRowLabel label={"Upload IR"}></PropertyRowLabel>
            <div style={{alignItems:'center'}}>
                <input
                type = "file"
                id = "irinput"
                accept = ".wav"
                onChange={(e) => {
                    const reader = new FileReader();

                    reader.addEventListener('loadend', (_loadEndEvent) => {
                        emit("ENERGYDECAY_SET_PROPERTY",{uuid: uuid, property: "broadbandIR", value:reader.result});
                    });

                    reader.readAsArrayBuffer(e.target!.files![0]);
                    }
                }
                />
        </div>
        </PropertyRow>
        <PropertyButton event="CALCULATE_AC_PARAMS" args={uuid} label="Calculate Parameters" tooltip="Calculates Acoustical Parameters from Uploaded IR" />
      </PropertyRowFolder>
    );
};

export const EnergyDecayTab = ({ uuid }: EnergyDecayTabProps) => {
    return (
        <Input uuid={uuid} />
    );
};

export default EnergyDecayTab; 
  