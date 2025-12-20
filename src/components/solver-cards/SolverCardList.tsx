import React, { useMemo, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalculateIcon from "@mui/icons-material/Calculate";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useSolver } from "../../store/solver-store";
import { useAppStore } from "../../store/app-store";
import { emit } from "../../messenger";
import SolverCard from "./SolverCard";
import RendererCard from "./RendererCard";

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

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const AutoCalcButton = styled.button<{ $active: boolean; $calculating: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 6px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => (props.$active ? "#2d72d2" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#5c6670")};
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: ${(props) => (props.$active ? "#215db0" : "#d3d8de")};
  }

  svg {
    font-size: 16px;
    ${(props) => props.$calculating && css`
      animation: ${spin} 1s linear infinite;
    `}
  }
`;

const GroupContent = styled.div<{ $expanded: boolean }>`
  display: ${(props) => (props.$expanded ? "block" : "none")};
  padding-left: 20px;
`;

const EmptyState = styled.div`
  padding: 16px;
  text-align: center;
  color: #8c959f;
  font-size: 12px;
`;

export default function SolverCardList() {
  const [expanded, setExpanded] = useState(true);
  const solversData = useSolver((state) => state.solvers);
  const autoCalculate = useAppStore((state) => state.autoCalculate);
  const progressVisible = useAppStore((state) => state.progress.visible);

  const solverUuids = useMemo(() => {
    return Object.keys(solversData);
  }, [solversData]);

  // Count solvers + 1 for renderer
  const totalCount = solverUuids.length + 1;

  const handleAutoCalcToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't toggle expand/collapse
    emit("SET_AUTO_CALCULATE", !autoCalculate);
  };

  return (
    <ListContainer>
      <GroupHeader $expanded={expanded} onClick={() => setExpanded(!expanded)}>
        <ExpandIcon>
          {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </ExpandIcon>
        <IconContainer>
          <CalculateIcon />
        </IconContainer>
        <GroupTitle>Solvers</GroupTitle>
        <CountBadge>{totalCount}</CountBadge>
        <AutoCalcButton
          $active={autoCalculate}
          $calculating={autoCalculate && progressVisible}
          onClick={handleAutoCalcToggle}
          title={autoCalculate ? "Auto-calculate enabled" : "Auto-calculate disabled"}
        >
          <AutorenewIcon />
        </AutoCalcButton>
      </GroupHeader>
      <GroupContent $expanded={expanded}>
        {solverUuids.length > 0 ? (
          solverUuids.map((uuid) => (
            <SolverCard key={uuid} uuid={uuid} />
          ))
        ) : (
          <EmptyState>
            No solvers yet. Add one from the menu.
          </EmptyState>
        )}
        <RendererCard />
      </GroupContent>
    </ListContainer>
  );
}
