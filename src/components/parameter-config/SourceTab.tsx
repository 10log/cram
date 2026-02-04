import React, { useRef } from "react";
import Button from "@mui/material/Button";
import Source, { DirectivityHandler, SignalSourceOptions } from "../../objects/source";
import { useContainer } from "../../store";
import PropertyRow from "./property-row/PropertyRow";
import PropertyRowFolder from "./property-row/PropertyRowFolder";
import { createPropertyInputs } from "./ContainerComponents";
import useToggle from "../hooks/use-toggle";
import PropertyRowLabel from "./property-row/PropertyRowLabel";
import PropertyButton from "./property-row/PropertyButton";
import { CLFParser } from "../../import-handlers/CLFParser";
import TransformTable from "./TransformTable";

const { PropertyNumberInput, PropertySelect } = createPropertyInputs<Source>(
  "SOURCE_SET_PROPERTY"
);

const Transform = ({ uuid }: { uuid: string }) => (
  <TransformTable uuid={uuid} event="SOURCE_SET_PROPERTY" />
);


const Configuration = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Configuration" open={open} onOpenClose={toggle}>
      <PropertyNumberInput
        uuid={uuid}
        label="θ Theta"
        property="theta"
        tooltip="Sets theta" 
      />
      <PropertyNumberInput
        uuid={uuid}
        label="φ Phi"
        property="phi"
        tooltip="Sets phi" 
      />
    </PropertyRowFolder>
  );
};

const FDTDConfig =({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="FDTD Config" open={open} onOpenClose={toggle}>
      <PropertySelect 
        uuid={uuid} 
        label="Signal Source" 
        tooltip="The source thats generating it's signal"
        property="signalSource"
        options={SignalSourceOptions}
      />
      <PropertyNumberInput uuid={uuid} label="Frequency" property="frequency" tooltip="The source's frequency" />
      <PropertyNumberInput uuid={uuid} label="Amplitude" property="amplitude" tooltip="The source's amplitude" />
      <PropertyButton label="Signal Data" tooltip="The source's signal data" event="SOURCE_CALL_METHOD" args={{ uuid, method: "saveSamples" }} />
    </PropertyRowFolder>
  )
}

const CLFConfig = ({uuid}: {uuid: string}) => {
  const [open, toggle] = useToggle(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    reader.addEventListener('loadend', () => {
      const filecontents = reader.result as string;
      const clf = new CLFParser(filecontents);
      const clf_results = clf.parse();
      const source = useContainer.getState().containers[uuid] as Source;
      source.directivityHandler = new DirectivityHandler(1, clf_results);
    });

    if (e.target?.files?.[0]) {
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <PropertyRowFolder label="CLF Config" open={open} onOpenClose={toggle}>
      <PropertySelect
        uuid={uuid}
        label="Signal Source"
        tooltip="The source thats generating it's signal"
        property="signalSource"
        options={SignalSourceOptions}
      />
      <PropertyNumberInput uuid={uuid} label="Frequency" property="frequency" tooltip="The source's frequency" />
      <PropertyNumberInput uuid={uuid} label="Amplitude" property="amplitude" tooltip="The source's amplitude" />
      <PropertyButton label="Signal Data" tooltip="The source's signal data" event="SOURCE_CALL_METHOD" args={{ uuid, method: "saveSamples" }} />
      <PropertyRow>
        <PropertyRowLabel label="CLF Data" tooltip="Import CLF directivity text files"/>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".tab"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{ fontSize: '0.75rem', textTransform: 'none' }}
          >
            Import CLF
          </Button>
        </div>
      </PropertyRow>
    </PropertyRowFolder>
  );
}

export const SourceTab = ({ uuid }: { uuid: string }) => {
  return (
    <div>
      <Transform uuid={uuid} />
      <Configuration uuid={uuid} />
      <FDTDConfig uuid={uuid} />
    </div>
  );
};

export default SourceTab;
