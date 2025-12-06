import React, { useState, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useContainer } from "../../store";
import { emit, on } from "../../messenger";
import ObjectCardHeader from "./ObjectCardHeader";
import Container from "../../objects/container";
import { Room } from "../../objects";

// Import object parameter components
import RoomTab from "../parameter-config/RoomTab";
import SourceTab from "../parameter-config/SourceTab";
import ReceiverTab from "../parameter-config/ReceiverTab";
import SurfaceTab from "../parameter-config/SurfaceTab";

const CardContainer = styled.div`
  border-bottom: 1px solid #e1e4e8;
`;

const CardContent = styled.div<{ $expanded: boolean }>`
  display: ${(props) => (props.$expanded ? "block" : "none")};
  padding-left: 20px;
`;

const ParameterSection = styled.div`
  padding: 4px 0;
`;

const ChildrenSection = styled.div`
  border-top: 1px solid #e1e4e8;
`;

/**
 * Maps object kind to its parameter configuration component
 */
const ObjectComponentMap = new Map<string, React.ComponentType<{ uuid: string }>>([
  ["room", RoomTab],
  ["source", SourceTab],
  ["receiver", ReceiverTab],
  ["surface", SurfaceTab],
]);

export interface ObjectCardProps {
  uuid: string;
  defaultExpanded?: boolean;
  isChild?: boolean;
}

export default function ObjectCard({ uuid, defaultExpanded = false, isChild = false }: ObjectCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selected, setSelected] = useState(false);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(true);

  const container = useContainer((state) => state.containers[uuid]);
  const version = useContainer((state) => state.version);

  // Get child surface UUIDs for rooms
  const childSurfaceUuids = useMemo(() => {
    if (container?.kind === "room") {
      const room = container as Room;
      return room.allSurfaces.map((s) => s.uuid);
    }
    return [];
  }, [container, version]);

  // Sync name and visibility from container
  useEffect(() => {
    if (container) {
      setName(container.name || "Untitled");
      setVisible(container.visible);
    }
  }, [container, version]);

  // Listen for name changes
  useEffect(() => {
    const event = container?.kind ? `${container.kind.toUpperCase()}_SET_PROPERTY` as "SOURCE_SET_PROPERTY" : null;
    if (!event) return;

    return on(event, ({ uuid: eventUuid, property, value }) => {
      if (eventUuid === uuid && property === "name") {
        setName(value as string);
      }
    });
  }, [uuid, container?.kind]);

  // Listen for selection changes
  useEffect(() => {
    const unsubSet = on("SET_SELECTION", (containers: Container[]) => {
      setSelected(containers.some((c) => c.uuid === uuid));
    });
    const unsubAppend = on("APPEND_SELECTION", (containers: Container[]) => {
      if (containers.some((c) => c.uuid === uuid)) {
        setSelected(true);
      }
    });
    const unsubDeselect = on("DESELECT_ALL_OBJECTS", () => {
      setSelected(false);
    });

    return () => {
      unsubSet();
      unsubAppend();
      unsubDeselect();
    };
  }, [uuid]);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleSelect = useCallback((e: React.MouseEvent) => {
    if (container) {
      emit(e.shiftKey ? "APPEND_SELECTION" : "SET_SELECTION", [container]);
    }
  }, [container]);

  const handleMouseEnter = useCallback(() => {
    if (container?.kind === "surface") {
      emit("SURFACE_HOVER", uuid);
    }
  }, [container?.kind, uuid]);

  const handleMouseLeave = useCallback(() => {
    if (container?.kind === "surface") {
      emit("SURFACE_UNHOVER", uuid);
    }
  }, [container?.kind, uuid]);

  const handleVisibilityToggle = useCallback(() => {
    if (container) {
      const event = `${container.kind.toUpperCase()}_SET_PROPERTY` as "ROOM_SET_PROPERTY";
      emit(event, { uuid, property: "visible", value: !visible });
      setVisible(!visible);
    }
  }, [container, uuid, visible]);

  const handleNameChange = useCallback((newName: string) => {
    if (container) {
      const event = `${container.kind.toUpperCase()}_SET_PROPERTY` as "ROOM_SET_PROPERTY";
      emit(event, { uuid, property: "name", value: newName });
      setName(newName);
    }
  }, [container, uuid]);

  // If container doesn't exist (was deleted), don't render
  if (!container) {
    return null;
  }

  const kind = container.kind || "object";
  const ParameterComponent = ObjectComponentMap.get(kind);

  return (
    <CardContainer>
      <ObjectCardHeader
        name={name}
        kind={kind}
        expanded={expanded}
        selected={selected}
        visible={visible}
        onToggle={handleToggle}
        onSelect={handleSelect}
        onVisibilityToggle={handleVisibilityToggle}
        onNameChange={handleNameChange}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <CardContent $expanded={expanded}>
        {ParameterComponent && (
          <ParameterSection>
            <ParameterComponent uuid={uuid} />
          </ParameterSection>
        )}
        {childSurfaceUuids.length > 0 && (
          <ChildrenSection>
            {childSurfaceUuids.map((surfaceUuid) => (
              <ObjectCard key={surfaceUuid} uuid={surfaceUuid} isChild />
            ))}
          </ChildrenSection>
        )}
      </CardContent>
    </CardContainer>
  );
}
