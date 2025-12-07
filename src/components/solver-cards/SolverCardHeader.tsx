import React from "react";
import styled, { keyframes } from "styled-components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot"; // Ray Tracer
import AccountTreeIcon from "@mui/icons-material/AccountTree"; // Image Source
import GridOnIcon from "@mui/icons-material/GridOn"; // FDTD
import BarChartIcon from "@mui/icons-material/BarChart"; // RT60
import GraphicEqIcon from "@mui/icons-material/GraphicEq"; // Energy Decay
import BlurOnIcon from "@mui/icons-material/BlurOn"; // ART
import SettingsIcon from "@mui/icons-material/Settings"; // Renderer
import { Menu, MenuItem, Popover, Position } from "@blueprintjs/core";

const HeaderContainer = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: ${(props) => (props.$expanded ? "#e8ecef" : "transparent")};
  cursor: pointer;
  user-select: none;

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

const Title = styled.div`
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: #1c2127;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MenuButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  color: #8c959f;
  opacity: 0;

  svg {
    font-size: 14px;
  }

  ${HeaderContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #d0d7de;
    color: #1c2127;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RunningButton = styled.div<{ $isRunning: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 4px;
  border-radius: 3px;
  color: ${(props) => (props.$isRunning ? "#2d72d2" : "#8c959f")};
  cursor: pointer;

  svg {
    font-size: 14px;
    animation: ${(props) => (props.$isRunning ? spin : "none")} 1s linear infinite;
  }

  &:hover {
    background-color: #d0d7de;
    color: ${(props) => (props.$isRunning ? "#2d72d2" : "#1c2127")};
  }
`;

/**
 * Maps solver kind to its icon component
 */
const SolverIconMap: Record<string, React.ElementType> = {
  "ray-tracer": ScatterPlotIcon,
  "image-source": AccountTreeIcon,
  "fdtd-2d": GridOnIcon,
  "rt60": BarChartIcon,
  "energydecay": GraphicEqIcon,
  "art": BlurOnIcon,
  "renderer": SettingsIcon,
};

export interface SolverCardHeaderProps {
  name: string;
  kind: string;
  expanded: boolean;
  isRunning?: boolean;
  canRun?: boolean;
  onToggle: () => void;
  onRunningToggle?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export default function SolverCardHeader({
  name,
  kind,
  expanded,
  isRunning = false,
  canRun = false,
  onToggle,
  onRunningToggle,
  onDelete,
  onDuplicate,
}: SolverCardHeaderProps) {
  const Icon = SolverIconMap[kind] || ScatterPlotIcon;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRunningClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRunningToggle?.();
  };

  const menu = (
    <Menu>
      {onDuplicate && <MenuItem text="Duplicate" icon="duplicate" onClick={onDuplicate} />}
      {onDelete && <MenuItem text="Delete" icon="trash" intent="danger" onClick={onDelete} />}
    </Menu>
  );

  return (
    <HeaderContainer $expanded={expanded} onClick={onToggle}>
      <ExpandIcon>{expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}</ExpandIcon>
      <IconContainer>
        <Icon />
      </IconContainer>
      <Title>{name}</Title>
      {canRun && (
        <RunningButton $isRunning={isRunning} onClick={handleRunningClick}>
          <AutorenewIcon />
        </RunningButton>
      )}
      {(onDelete || onDuplicate) && (
        <Popover content={menu} position={Position.BOTTOM_RIGHT} minimal>
          <MenuButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </MenuButton>
        </Popover>
      )}
    </HeaderContainer>
  );
}
