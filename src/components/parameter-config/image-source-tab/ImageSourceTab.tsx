import React, { useCallback } from "react";
import "./ImageSourceTab.css";
import {ImageSourceSolver} from "../../../compute/raytracer/image-source/index";
import { createPropertyInputs, PropertyButton } from "../SolverComponents";
import SourceReceiverMatrix from "../SourceReceiverMatrix";
import SolverControlBar from "../SolverControlBar";
import SectionLabel from "../property-row/SectionLabel";
import { emit } from "../../../messenger";

export interface ImageSourceTabProps {
  uuid: string;
}

const { PropertyNumberInput, PropertyCheckboxInput } = createPropertyInputs<ImageSourceSolver>(
  "IMAGESOURCE_SET_PROPERTY"
);

export const ImageSourceTab = ({ uuid }: ImageSourceTabProps) => {
  const handleCalculate = useCallback(() => {
    emit("UPDATE_IMAGESOURCE", uuid);
  }, [uuid]);

  const handleReset = useCallback(() => {
    emit("RESET_IMAGESOURCE", uuid);
  }, [uuid]);

  return (
    <div>
      <SolverControlBar
        onPlayPause={handleCalculate}
        onReset={handleReset}
        canRun={true}
        hasResults={true}
      />

      {/* Calculation */}
      <SectionLabel label="Calculation" />
      <PropertyNumberInput uuid={uuid} label="Maximum Order" property="maxReflectionOrderReset" tooltip="Maximum image-source reflection depth. Each order mirrors the source across every surface, producing deterministic specular paths — computation grows exponentially with order." />

      {/* Source / Receiver Pairs */}
      <SectionLabel label="Source / Receiver Pairs" />
      <SourceReceiverMatrix uuid={uuid} eventType="IMAGESOURCE_SET_PROPERTY" />

      {/* Visualization */}
      <SectionLabel label="Visualization" />
      <PropertyCheckboxInput uuid={uuid} label="Show Sources" property="imageSourcesVisible" tooltip="Display virtual image sources in the 3D viewport — mirrored copies of the source generated at each reflection order" />
      <PropertyCheckboxInput uuid={uuid} label="Show Paths" property="rayPathsVisible" tooltip="Display specular reflection paths from source to receiver through each image-source mirror sequence" />

      {/* Impulse Response */}
      <SectionLabel label="Impulse Response" />
      <PropertyButton event="IMAGESOURCE_PLAY_IR" args={uuid} label="Play" tooltip="Auralise the impulse response computed from deterministic image-source reflections" disabled={false} />
      <PropertyButton event="IMAGESOURCE_DOWNLOAD_IR" args={uuid} label="Download" tooltip="Export the impulse response as a mono WAV file" />

      {/* Developer */}
      <SectionLabel label="Developer" />
      <PropertyButton event="CALCULATE_LTP" args={uuid} label="Calculate LTP" tooltip="Compute Level-Time Progression — energy arrival over time from image-source paths, useful for analysing early reflection structure" />
    </div>
  );
};

export default ImageSourceTab;
