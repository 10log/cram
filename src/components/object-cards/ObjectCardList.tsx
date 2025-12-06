import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useShallow } from "zustand/react/shallow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CategoryIcon from "@mui/icons-material/Category";
import { useContainer } from "../../store";
import ObjectCard from "./ObjectCard";

const ListContainer = styled.div`
  overflow-y: auto;
`;

const GroupHeader = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: ${(props) => (props.$expanded ? "#e8ecef" : "transparent")};
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #e1e4e8;

  &:hover {
    background-color: #e8ecef;
  }
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  color: #5c6670;

  svg {
    font-size: 16px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  color: #5c6670;

  svg {
    font-size: 14px;
  }
`;

const GroupTitle = styled.div`
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: #1c2127;
`;

const CountBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 14px;
  height: 14px;
  padding: 0 4px;
  background-color: #8c959f;
  border-radius: 7px;
  font-size: 10px;
  font-weight: 600;
  color: white;
`;

const GroupContent = styled.div<{ $expanded: boolean }>`
  display: ${(props) => (props.$expanded ? "block" : "none")};
  padding-left: 20px;
`;

const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: #8c959f;
  font-size: 13px;
`;

interface ObjectsByKind {
  rooms: string[];
  sources: string[];
  receivers: string[];
}

export default function ObjectCardList() {
  const [expanded, setExpanded] = useState(true);
  const containers = useContainer(useShallow((state) => state.containers));

  const objectsByKind = useMemo((): ObjectsByKind => {
    const result: ObjectsByKind = {
      rooms: [],
      sources: [],
      receivers: [],
    };

    Object.keys(containers).forEach((uuid) => {
      const container = containers[uuid];
      switch (container.kind) {
        case "room":
          result.rooms.push(uuid);
          break;
        case "source":
          result.sources.push(uuid);
          break;
        case "receiver":
          result.receivers.push(uuid);
          break;
        // Surfaces are now children of rooms, not shown at top level
      }
    });

    return result;
  }, [containers]);

  const totalCount =
    objectsByKind.rooms.length +
    objectsByKind.sources.length +
    objectsByKind.receivers.length;

  return (
    <ListContainer>
      <GroupHeader $expanded={expanded} onClick={() => setExpanded(!expanded)}>
        <ExpandIcon>
          {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </ExpandIcon>
        <IconContainer>
          <CategoryIcon />
        </IconContainer>
        <GroupTitle>Objects</GroupTitle>
        {totalCount > 0 && <CountBadge>{totalCount}</CountBadge>}
      </GroupHeader>
      <GroupContent $expanded={expanded}>
        {totalCount === 0 ? (
          <EmptyState>No objects yet. Import a model or add objects from the menu.</EmptyState>
        ) : (
          <>
            {objectsByKind.rooms.map((uuid) => (
              <ObjectCard key={uuid} uuid={uuid} />
            ))}
            {objectsByKind.sources.map((uuid) => (
              <ObjectCard key={uuid} uuid={uuid} />
            ))}
            {objectsByKind.receivers.map((uuid) => (
              <ObjectCard key={uuid} uuid={uuid} />
            ))}
          </>
        )}
      </GroupContent>
    </ListContainer>
  );
}
