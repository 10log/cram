import React from "react";
import TransformTable from "./TransformTable";

const Transform = ({ uuid }: { uuid: string }) => (
  <TransformTable uuid={uuid} event="ROOM_SET_PROPERTY" />
);

export const RoomTab = ({ uuid }: { uuid: string }) => {
  return (
    <div>
      <Transform uuid={uuid} />
    </div>
  );
};

export default RoomTab;
