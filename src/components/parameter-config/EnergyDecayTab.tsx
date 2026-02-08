import React from 'react';
import { emit } from "../../messenger";
import { PropertyButton } from "./SolverComponents";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import SectionLabel from "./property-row/SectionLabel";

export interface EnergyDecayTabProps {
    uuid: string;
}

export const EnergyDecayTab = ({ uuid }: EnergyDecayTabProps) => {
    return (
      <div>
        {/* Input */}
        <SectionLabel label="Input" />
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
        <PropertyButton event="CALCULATE_AC_PARAMS" args={uuid} label="Calculate Parameters" tooltip="Derive acoustical parameters (T20, T30, EDT, C50, C80, D50, D80, Ts) from the uploaded impulse response using Schroeder backward integration" />
      </div>
    );
};

export default EnergyDecayTab;
