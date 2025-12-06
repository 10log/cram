import React from 'react';
import useToggle from "../hooks/use-toggle";
import PropertyRowFolder from "./property-row/PropertyRowFolder";

export interface ARTTabProps {
  uuid: string;
}

const Settings = ({ uuid }: { uuid: string }) => {
  const [open, toggle] = useToggle(true);
  return (
    <PropertyRowFolder label="Room Settings" open={open} onOpenClose={toggle}>
      <></>
    </PropertyRowFolder>
  );
};


export const ARTTab = ({ uuid }: ARTTabProps) => {
  return (
    <div>
      <Settings uuid={uuid} />
    </div>
  );
};

export default ARTTab; 

