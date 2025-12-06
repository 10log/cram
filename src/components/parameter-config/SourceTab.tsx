import React from "react";
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
          type = "file"
          id = "clfinput"
          accept = ".tab"
          onChange={(e) => {
              console.log(e.target.files);
              const reader = new FileReader();

              reader.addEventListener('loadend', (_loadEndEvent) => {
                  let filecontents:string = reader.result as string;
                  let clf = new CLFParser(filecontents);
                  let clf_results = clf.parse();
                  const source = useContainer.getState().containers[uuid] as Source;
                  source.directivityHandler = new DirectivityHandler(1,clf_results);


                  // display CLF parser object (debugging)
                  console.log(clf);
                  // display CLF parser results (debugging)
                  console.log(clf_results);
              });

              reader.readAsText(e.target!.files![0]);

            }
          }
          />
        </div>
      </PropertyRow>
    </PropertyRowFolder>
  )
}

// const StyleProperties = ({ uuid }: { uuid: string }) => {
//   const [open, toggle] = useToggle(true);
//   return (
//     <PropertyRowFolder label="Style Properties" open={open} onOpenClose={toggle}>
//       <PropertyNumberInput
//         uuid={uuid}
//         label="Point Size"
//         property="pointSize"
//         tooltip="Sets the size of each interection point"
//       />
//       <PropertyCheckboxInput
//         uuid={uuid}
//         label="Rays Visible"
//         property="raysVisible"
//         tooltip="Toggles the visibility of the rays"
//       />
//       <PropertyCheckboxInput
//         uuid={uuid}
//         label="Points Visible"
//         property="pointsVisible"
//         tooltip="Toggles the visibility of the intersection points"
//       />
//     </PropertyRowFolder>
//   );
// };
// const ContainerControls = ({ uuid }: { uuid: string }) => {
//   const [open, toggle] = useToggle(true);
//   return (
//     <PropertyRowFolder label="Container Controls" open={open} onOpenClose={toggle}>
//       <PropertyCheckboxInput uuid={uuid} label="Running" property="isRunning" tooltip="Starts/stops the raytracer" />
//       <PropertyButton event="RAYTRACER_CLEAR_RAYS" args={uuid} label="Clear Rays" tooltip="Clears all of the rays" />
//     </PropertyRowFolder>
//   );
// };

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
