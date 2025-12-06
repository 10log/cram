import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { NodesIcon, RoomIcon, SourceIcon, ReceiverIcon } from "../icons";
import { on } from "../../messenger";
import Container from "../../objects/container";

// Import object parameter components
import RoomTab from "../parameter-config/RoomTab";
import SourceTab from "../parameter-config/SourceTab";
import ReceiverTab from "../parameter-config/ReceiverTab";
import SurfaceTab from "../parameter-config/SurfaceTab";

const InspectorContainer = styled.div`
  border-top: 1px solid #d0d7de;
  background-color: #fff;
`;

const InspectorHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  color: #5c6670;
`;

const Title = styled.div`
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: #1c2127;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ObjectKind = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: #656d76;
  margin-left: 6px;
`;

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  color: #656d76;
  cursor: pointer;

  &:hover {
    background-color: #dde3e8;
    color: #1c2127;
  }
`;

const InspectorContent = styled.div`
  padding: 8px 0;
  max-height: 300px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 16px;
  text-align: center;
  color: #8c959f;
  font-size: 12px;
`;

/**
 * Maps object kind to its icon component
 */
const ObjectIconMap: Record<string, React.ElementType> = {
  room: RoomIcon,
  source: SourceIcon,
  receiver: ReceiverIcon,
  surface: NodesIcon,
};

/**
 * Maps object kind to its parameter configuration component
 */
const ObjectComponentMap = new Map<string, React.ComponentType<{ uuid: string }>>([
  ["room", RoomTab],
  ["source", SourceTab],
  ["receiver", ReceiverTab],
  ["surface", SurfaceTab],
]);

export default function ObjectInspector() {
  const [selectedObject, setSelectedObject] = useState<Container | null>(null);

  useEffect(() => {
    return on("SET_SELECTION", (containers: Container[]) => {
      if (containers.length > 0) {
        setSelectedObject(containers[0]);
      } else {
        setSelectedObject(null);
      }
    });
  }, []);

  useEffect(() => {
    return on("APPEND_SELECTION", (containers: Container[]) => {
      if (containers.length > 0) {
        setSelectedObject(containers[containers.length - 1]);
      }
    });
  }, []);

  useEffect(() => {
    return on("DESELECT_ALL_OBJECTS", () => {
      setSelectedObject(null);
    });
  }, []);

  const handleClose = () => {
    setSelectedObject(null);
  };

  if (!selectedObject) {
    return null;
  }

  const kind = selectedObject.kind || "object";
  const Icon = ObjectIconMap[kind] || NodesIcon;
  const ParameterComponent = ObjectComponentMap.get(kind);

  return (
    <InspectorContainer>
      <InspectorHeader>
        <IconContainer>
          <Icon fontSize="small" />
        </IconContainer>
        <Title>
          {selectedObject.name || "Untitled"}
          <ObjectKind>{kind}</ObjectKind>
        </Title>
        <CloseButton onClick={handleClose} title="Close inspector">
          <CloseIcon style={{ fontSize: 16 }} />
        </CloseButton>
      </InspectorHeader>
      <InspectorContent>
        {ParameterComponent ? (
          <ParameterComponent uuid={selectedObject.uuid} />
        ) : (
          <EmptyState>No properties available for this object type.</EmptyState>
        )}
      </InspectorContent>
    </InspectorContainer>
  );
}
