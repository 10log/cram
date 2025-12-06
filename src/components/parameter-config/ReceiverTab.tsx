import React from "react";
import TransformTable from "./TransformTable";

const Transform = ({ uuid }: { uuid: string }) => (
  <TransformTable uuid={uuid} event="RECEIVER_SET_PROPERTY" />
);

export const ReceiverTab = ({ uuid }: { uuid: string }) => {
  return (
    <div>
      <Transform uuid={uuid} />
    </div>
  );
};

export default ReceiverTab;
